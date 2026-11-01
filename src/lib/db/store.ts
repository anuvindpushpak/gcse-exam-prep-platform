import fs from "node:fs";
import path from "node:path";
import { EDEXCEL_ASSESSMENT_TEMPLATES } from "@/content/edexcel-1ma1-foundation/assessments";
import { EDEXCEL_LEARNING_RESOURCES } from "@/content/edexcel-1ma1-foundation/learning-resources";
import { EDEXCEL_FOUNDATION_QUESTIONS } from "@/content/edexcel-1ma1-foundation/questions";
import {
  EDEXCEL_FOUNDATION_TOPICS,
  EXAM_BOARD_SPECIFICATIONS,
  PRODUCT_CATALOG,
} from "@/content/edexcel-1ma1-foundation/specification";
import {
  classifyMasteryStatus,
  estimateFoundationGrade,
} from "@/lib/engine/intelligence";
import { gradeQuestionResponse, runSymbolicValidationAgent } from "@/lib/engine/grader";
import {
  AssessmentAttempt,
  AssessmentTemplate,
  ContentLifecycleStatus,
  ExamBoardCode,
  ExamBoardSpecification,
  LearningResource,
  ProductCatalogItem,
  PurchaseRecord,
  QuestionItem,
  QuestionResponseRecord,
  StudentEntitlementState,
  TopicDefinition,
  TopicScoreBreakdown,
  UserAccount,
} from "@/types/platform";

export interface PlatformDatabaseState {
  users: UserAccount[];
  activeUserId: string;
  specifications: ExamBoardSpecification[];
  topics: TopicDefinition[];
  learningResources: LearningResource[];
  questions: QuestionItem[];
  assessmentTemplates: AssessmentTemplate[];
  attempts: AssessmentAttempt[];
  products: ProductCatalogItem[];
  purchases: PurchaseRecord[];
}

function getDbFilePath(): string {
  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, "runtime-db.json");
  } catch {
    return path.join("/tmp", "gcse-exam-platform-db.json");
  }
}

function createInitialSeedState(): PlatformDatabaseState {
  const users: UserAccount[] = [
    {
      id: "user-student-leo",
      email: "student@demo.uk",
      firstName: "Leo",
      lastName: "Carter",
      role: "STUDENT",
      examYear: 2027,
      targetGrade: 4,
      selectedBoard: "EDEXCEL",
      parentInviteCode: "PARENT-LEO-2027",
      createdAt: "2026-11-01T09:00:00Z",
    },
    {
      id: "user-parent-sarah",
      email: "parent@demo.uk",
      firstName: "Sarah",
      lastName: "Carter",
      role: "PARENT",
      selectedBoard: "EDEXCEL",
      linkedStudentIds: ["user-student-leo"],
      createdAt: "2026-11-01T09:05:00Z",
    },
    {
      id: "user-admin-eleanor",
      email: "admin@demo.uk",
      firstName: "Dr. Eleanor",
      lastName: "Vance",
      role: "ADMIN",
      selectedBoard: "EDEXCEL",
      createdAt: "2026-11-01T08:00:00Z",
    },
  ];

  return {
    users,
    activeUserId: "user-student-leo",
    specifications: EXAM_BOARD_SPECIFICATIONS,
    topics: EDEXCEL_FOUNDATION_TOPICS,
    learningResources: EDEXCEL_LEARNING_RESOURCES,
    questions: EDEXCEL_FOUNDATION_QUESTIONS,
    assessmentTemplates: EDEXCEL_ASSESSMENT_TEMPLATES,
    attempts: [],
    products: PRODUCT_CATALOG,
    purchases: [],
  };
}

let memoryCache: PlatformDatabaseState | null = null;

export function readDb(): PlatformDatabaseState {
  if (memoryCache) return memoryCache;
  const filePath = getDbFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw) as PlatformDatabaseState;
      memoryCache = parsed;
      return parsed;
    }
  } catch {
    // Fall back to fresh seed state
  }
  const initial = createInitialSeedState();
  writeDb(initial);
  return initial;
}

export function writeDb(state: PlatformDatabaseState): PlatformDatabaseState {
  memoryCache = state;
  const filePath = getDbFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
  } catch {
    // Ignore filesystem errors in read-only environments; memoryCache stays current
  }
  return state;
}

export function resetDemoDatabase(): PlatformDatabaseState {
  const fresh = createInitialSeedState();
  return writeDb(fresh);
}

export function getStudentEntitlements(
  state: PlatformDatabaseState,
  studentId: string
): StudentEntitlementState {
  const studentPurchases = state.purchases.filter(
    (p) => p.beneficiaryStudentId === studentId && p.status === "COMPLETED"
  );

  const hasFullPack = studentPurchases.some(
    (p) => p.productId === "prod-gcse-maths-grade4-pack"
  );
  const hasWeeklyMembership = studentPurchases.some(
    (p) => p.productId === "prod-weekly-maths-membership"
  );

  return {
    hasFreeDiagnostic: true,
    hasFullPack,
    hasWeeklyMembership,
    purchasedProducts: studentPurchases,
  };
}

/**
 * Grades and records a completed AssessmentAttempt (Diagnostic, Topic Practice, Timed Check, or Full Mock Exam).
 */
export function submitAndGradeAssessment(params: {
  studentId: string;
  templateId: string;
  timeSpentSeconds: number;
  rawResponses: Record<
    string,
    {
      studentFinalAnswer: string;
      studentSteps?: Record<string, string>;
      isFlagged?: boolean;
      timeSpentSeconds?: number;
    }
  >;
}): AssessmentAttempt {
  const db = readDb();
  const template = db.assessmentTemplates.find((t) => t.id === params.templateId);
  if (!template) {
    throw new Error(`Assessment template ${params.templateId} not found.`);
  }

  const questionMap = new Map(db.questions.map((q) => [q.id, q]));
  const topicMap = new Map(db.topics.map((t) => [t.id, t]));

  const gradedResponses: Record<string, QuestionResponseRecord> = {};
  let earnedMarks = 0;
  let totalMarks = 0;
  let nonCalcEarned = 0;
  let nonCalcMax = 0;
  let calcEarned = 0;
  let calcMax = 0;

  const topicAccum = new Map<
    string,
    { earned: number; max: number; count: number }
  >();

  for (const qId of template.questionIds) {
    const q = questionMap.get(qId);
    if (!q) continue;

    const studentResp = params.rawResponses[qId] || {
      studentFinalAnswer: "",
      studentSteps: {},
      isFlagged: false,
      timeSpentSeconds: 0,
    };

    const grading = gradeQuestionResponse(
      q,
      studentResp.studentFinalAnswer,
      studentResp.studentSteps || {}
    );

    gradedResponses[qId] = {
      questionId: qId,
      studentFinalAnswer: studentResp.studentFinalAnswer,
      studentSteps: studentResp.studentSteps || {},
      isFlagged: Boolean(studentResp.isFlagged),
      timeSpentSeconds: studentResp.timeSpentSeconds || 30,
      grading,
    };

    earnedMarks += grading.marksAwarded;
    totalMarks += grading.maxMarks;

    if (q.calculatorPolicy === "NON_CALCULATOR") {
      nonCalcEarned += grading.marksAwarded;
      nonCalcMax += grading.maxMarks;
    } else {
      calcEarned += grading.marksAwarded;
      calcMax += grading.maxMarks;
    }

    const tAcc = topicAccum.get(q.topicId) || { earned: 0, max: 0, count: 0 };
    tAcc.earned += grading.marksAwarded;
    tAcc.max += grading.maxMarks;
    tAcc.count += 1;
    topicAccum.set(q.topicId, tAcc);
  }

  const percentageScore =
    totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;

  const topicBreakdown: TopicScoreBreakdown[] = Array.from(
    topicAccum.entries()
  ).map(([topicId, acc]) => {
    const tDef = topicMap.get(topicId);
    const pct = acc.max > 0 ? Math.round((acc.earned / acc.max) * 100) : 0;
    return {
      topicId,
      topicName: tDef?.domain || topicId,
      topicCode: tDef?.code || "T",
      earnedMarks: acc.earned,
      maxMarks: acc.max,
      percentage: pct,
      status: classifyMasteryStatus(acc.count, pct),
    };
  });

  const attempt: AssessmentAttempt = {
    id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    studentId: params.studentId,
    templateId: template.id,
    templateTitle: template.title,
    mode: template.mode,
    calculatorPolicy: template.calculatorPolicy,
    status: "SUBMITTED",
    startedAt: new Date(
      Date.now() - params.timeSpentSeconds * 1000
    ).toISOString(),
    submittedAt: new Date().toISOString(),
    timeSpentSeconds: params.timeSpentSeconds,
    earnedMarks,
    totalMarks,
    percentageScore,
    estimatedGrade: estimateFoundationGrade(percentageScore),
    grade4ReadinessScore: percentageScore,
    responses: gradedResponses,
    topicBreakdown,
    nonCalcScore:
      nonCalcMax > 0
        ? {
            earned: nonCalcEarned,
            max: nonCalcMax,
            percentage: Math.round((nonCalcEarned / nonCalcMax) * 100),
          }
        : undefined,
    calcScore:
      calcMax > 0
        ? {
            earned: calcEarned,
            max: calcMax,
            percentage: Math.round((calcEarned / calcMax) * 100),
          }
        : undefined,
  };

  db.attempts.push(attempt);
  writeDb(db);
  return attempt;
}

/**
 * Records a purchase (either £39.99 Grade 4 Preparation Pack or £7.99/mo Weekly Membership)
 * and immediately activates the student's entitlement.
 */
export function recordProductPurchase(params: {
  buyerUserId: string;
  buyerEmail: string;
  beneficiaryStudentId: string;
  productId: string;
}): PurchaseRecord {
  const db = readDb();
  const product = db.products.find((p) => p.id === params.productId);
  if (!product) {
    throw new Error(`Product ${params.productId} not found.`);
  }

  const existing = db.purchases.find(
    (p) =>
      p.beneficiaryStudentId === params.beneficiaryStudentId &&
      p.productId === params.productId &&
      p.status === "COMPLETED"
  );
  if (existing) return existing;

  const purchase: PurchaseRecord = {
    id: `ord-${Date.now()}`,
    buyerUserId: params.buyerUserId,
    buyerEmail: params.buyerEmail,
    beneficiaryStudentId: params.beneficiaryStudentId,
    productId: product.id,
    productName: product.name,
    amountPence: product.pricePence,
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
  };

  db.purchases.push(purchase);
  writeDb(db);
  return purchase;
}

/**
 * AI Agent 2 + Agent 3: Generates a new parameterized GCSE Maths Foundation question variation,
 * runs the Symbolic Answer Validation Agent, and places it in the Admin Governance queue
 * (never publishing directly to students without human approval).
 */
export function generateValidatedAiQuestionDraft(params: {
  topicId: string;
  calculatorPolicy: "NON_CALCULATOR" | "CALCULATOR_ALLOWED";
  targetGrade: number;
}): QuestionItem {
  const db = readDb();
  const seedMult = Math.floor(Math.random() * 4) + 3; // 3..6
  const templatesByTopic: Record<string, () => QuestionItem> = {
    "topic-num": () => {
      const a = seedMult * 6;
      const b = seedMult * 10;
      const lcmVal = (a * b) / (seedMult * 2);
      return {
        id: `q-ai-${Date.now()}`,
        specId: "spec-edexcel-1ma1",
        topicId: "topic-num",
        subtopicName: "Prime Factors & Lowest Common Multiple (AI Variation)",
        tier: "FOUNDATION",
        targetGrade: params.targetGrade,
        difficulty: 3,
        calculatorPolicy: params.calculatorPolicy,
        assessmentObjective: "AO1",
        questionType: "MULTI_STEP",
        stemMarkdown: `Find the Lowest Common Multiple (LCM) of $${a}$ and $${b}$.`,
        totalMarks: 3,
        markScheme: {
          totalMarks: 3,
          acceptedFinalAnswers: [String(lcmVal)],
          workingSteps: [
            {
              id: "s1",
              stepNumber: 1,
              promptLabel: `Step 1: Find the Highest Common Factor (HCF) of ${a} and ${b}`,
              markCode: "M1",
              marks: 1,
              acceptedAnswers: [String(seedMult * 2)],
              explanation: `The HCF of ${a} and ${b} is ${seedMult * 2}.`,
            },
            {
              id: "s2",
              stepNumber: 2,
              promptLabel: `Step 2: Multiply HCF by remaining factors (${seedMult * 2} × 3 × 5)`,
              markCode: "M1",
              marks: 1,
              acceptedAnswers: [String(lcmVal)],
              explanation: `${seedMult * 2} × 15 = ${lcmVal}.`,
            },
          ],
          finalAccuracyMarks: 1,
          finalMarkCode: "A1",
          misconceptions: [
            {
              wrongAnswer: String(seedMult * 2),
              tag: "CONFUSED_HCF_AND_LCM",
              diagnosticFeedback: `${seedMult * 2} is the HCF, not the LCM.`,
            },
          ],
        },
        workedSolutionMarkdown: `1. **HCF (M1):** $\\text{HCF}(${a}, ${b}) = ${seedMult * 2}$\n2. **LCM (M1 A1):** $${seedMult * 2} \\times 3 \\times 5 = ${lcmVal}$`,
        commonMistakeHint: "Do not confuse Highest Common Factor with Lowest Common Multiple.",
        lifecycleStatus: "AUTO_VALIDATED",
        version: 1,
      };
    },
    "topic-ratio": () => {
      const partVal = seedMult * 5;
      const total = partVal * 9;
      const larger = partVal * 5;
      return {
        id: `q-ai-${Date.now()}`,
        specId: "spec-edexcel-1ma1",
        topicId: "topic-ratio",
        subtopicName: "Ratio Sharing Variation (AI Generated)",
        tier: "FOUNDATION",
        targetGrade: params.targetGrade,
        difficulty: 2,
        calculatorPolicy: params.calculatorPolicy,
        assessmentObjective: "AO2",
        questionType: "MULTI_STEP",
        stemMarkdown: `Two friends share $\\text{£}${total}$ in the ratio $4 : 5$. Work out the larger share.`,
        answerUnit: "£",
        totalMarks: 2,
        markScheme: {
          totalMarks: 2,
          acceptedFinalAnswers: [String(larger)],
          workingSteps: [
            {
              id: "s1",
              stepNumber: 1,
              promptLabel: `Step 1: Find 1 part (${total} ÷ 9)`,
              markCode: "M1",
              marks: 1,
              acceptedAnswers: [String(partVal)],
              explanation: `4 + 5 = 9 parts. £${total} ÷ 9 = £${partVal}.`,
            },
          ],
          finalAccuracyMarks: 1,
          finalMarkCode: "A1",
          misconceptions: [
            {
              wrongAnswer: String(partVal * 4),
              tag: "FOUND_SMALLER_SHARE_INSTEAD_OF_LARGER",
              diagnosticFeedback: `£${partVal * 4} is the smaller share (4 parts). The larger share is 5 × £${partVal} = £${larger}.`,
            },
          ],
        },
        workedSolutionMarkdown: `1. **1 part (M1):** $\\text{£}${total} \\div 9 = \\text{£}${partVal}$\n2. **Larger share (A1):** $5 \\times \\text{£}${partVal} = \\text{£}${larger}$`,
        commonMistakeHint: "Divide the total by the sum of the ratio parts (4 + 5 = 9).",
        lifecycleStatus: "AUTO_VALIDATED",
        version: 1,
      };
    },
  };

  const generator =
    templatesByTopic[params.topicId] || templatesByTopic["topic-ratio"];
  const draft = generator();
  draft.topicId = params.topicId;

  const validation = runSymbolicValidationAgent(draft);
  draft.lifecycleStatus = validation.passed ? "REVIEW_PENDING" : "AI_DRAFT";
  draft.validationReport = {
    symbolicCheckPassed: validation.passed,
    verifiedAt: new Date().toISOString(),
    validatorNotes: validation.notes,
  };

  db.questions.unshift(draft);
  writeDb(db);
  return draft;
}

export function updateQuestionLifecycleStatus(
  questionId: string,
  status: ContentLifecycleStatus
): QuestionItem {
  const db = readDb();
  const q = db.questions.find((item) => item.id === questionId);
  if (!q) throw new Error(`Question ${questionId} not found.`);
  q.lifecycleStatus = status;
  q.version += 1;
  writeDb(db);
  return q;
}

export function switchActiveUser(
  userId: string,
  selectedBoard?: ExamBoardCode
): UserAccount {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error(`User ${userId} not found.`);
  db.activeUserId = user.id;
  if (selectedBoard) {
    user.selectedBoard = selectedBoard;
  }
  writeDb(db);
  return user;
}

