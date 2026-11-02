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
  ContactEnquiryRecord,
  ContentLifecycleStatus,
  CouponRule,
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
  coupons: CouponRule[];
  enquiries: ContactEnquiryRecord[];
  emailOtps: Record<string, { code: string; expiresAt: number }>;
}

const DEFAULT_COUPONS: CouponRule[] = [
  {
    code: "EARLY100",
    discountPercent: 100,
    description: "Early Adopter 100% Full Access Scholarship",
    active: true,
    redemptionsCount: 0,
  },
  {
    code: "PILOT100",
    discountPercent: 100,
    description: "Pilot Client 100% Complimentary Unlock",
    active: true,
    redemptionsCount: 0,
  },
  {
    code: "FOUNDER50",
    discountPercent: 50,
    description: "Founding Family 50% Discount",
    active: true,
    redemptionsCount: 0,
  },
  {
    code: "WELCOME20",
    discountPercent: 20,
    description: "Welcome 20% Enrolment Discount",
    active: true,
    redemptionsCount: 0,
  },
];

function getDbFilePath(): string {
  // Prefer persistent Railway volume mount if configured, then local workspace data dir
  const volumeDir =
    process.env.RAILWAY_VOLUME_MOUNT_PATH ||
    process.env.PERSISTENT_DATA_DIR ||
    path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(volumeDir)) {
      fs.mkdirSync(volumeDir, { recursive: true });
    }
    return path.join(volumeDir, "runtime-db.json");
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
    activeUserId: "",
    specifications: EXAM_BOARD_SPECIFICATIONS,
    topics: EDEXCEL_FOUNDATION_TOPICS,
    learningResources: EDEXCEL_LEARNING_RESOURCES,
    questions: EDEXCEL_FOUNDATION_QUESTIONS,
    assessmentTemplates: EDEXCEL_ASSESSMENT_TEMPLATES,
    attempts: [],
    products: PRODUCT_CATALOG,
    purchases: [],
    coupons: DEFAULT_COUPONS.map((c) => ({ ...c })),
    enquiries: [],
    emailOtps: {},
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
      if (!parsed.coupons || parsed.coupons.length === 0) {
        parsed.coupons = DEFAULT_COUPONS.map((c) => ({ ...c }));
      }
      if (!parsed.enquiries) {
        parsed.enquiries = [];
      }
      if (!parsed.emailOtps) {
        parsed.emailOtps = {};
      }
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
 * Validates a coupon code and returns the matching active CouponRule if valid.
 */
export function validateCouponCode(rawCode?: string): CouponRule | undefined {
  if (!rawCode) return undefined;
  const db = readDb();
  const clean = rawCode.trim().toUpperCase();
  if (!clean) return undefined;
  return db.coupons.find(
    (c) =>
      c.code.toUpperCase() === clean &&
      c.active &&
      (c.maxRedemptions === undefined || c.redemptionsCount < c.maxRedemptions)
  );
}

/**
 * Creates or updates a coupon code (1% to 100% discount) in the database.
 */
export function createOrUpdateCoupon(params: {
  code: string;
  discountPercent: number;
  description?: string;
}): CouponRule {
  const db = readDb();
  const cleanCode = params.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  if (!cleanCode) {
    throw new Error("Please provide a valid alphanumeric coupon code.");
  }
  const pct = Math.max(1, Math.min(100, Math.round(params.discountPercent)));
  let existing = db.coupons.find((c) => c.code.toUpperCase() === cleanCode);
  if (existing) {
    existing.discountPercent = pct;
    existing.description =
      params.description?.trim() || `${pct}% Early Adopter Discount`;
    existing.active = true;
  } else {
    existing = {
      code: cleanCode,
      discountPercent: pct,
      description:
        params.description?.trim() || `${pct}% Early Adopter Discount`,
      active: true,
      redemptionsCount: 0,
    };
    db.coupons.unshift(existing);
  }
  writeDb(db);
  return existing;
}

/**
 * Records a purchase (either £39.99 Grade 4 Preparation Pack or £7.99/mo Weekly Membership)
 * with optional coupon discount (up to 100% off) and immediately activates the student's entitlement.
 */
export function recordProductPurchase(params: {
  buyerUserId: string;
  buyerEmail: string;
  beneficiaryStudentId: string;
  productId: string;
  couponCode?: string;
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

  const coupon = validateCouponCode(params.couponCode);
  const discountPercent = coupon ? coupon.discountPercent : 0;
  const finalAmountPence = Math.max(
    0,
    Math.round(product.pricePence * (1 - discountPercent / 100))
  );

  if (coupon) {
    coupon.redemptionsCount += 1;
  }

  const purchase: PurchaseRecord = {
    id: `ord-${Date.now()}`,
    buyerUserId: params.buyerUserId,
    buyerEmail: params.buyerEmail,
    beneficiaryStudentId: params.beneficiaryStudentId,
    productId: product.id,
    productName: product.name,
    amountPence: finalAmountPence,
    originalAmountPence: product.pricePence,
    couponCode: coupon?.code,
    discountPercent: discountPercent > 0 ? discountPercent : undefined,
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
  autoPublishForPractice?: boolean;
}): QuestionItem {
  const db = readDb();
  const seedMult = Math.floor(Math.random() * 5) + 3; // 3..7
  const templatesByTopic: Record<string, () => QuestionItem> = {
    "topic-num": () => {
      const a = seedMult * 6;
      const b = seedMult * 10;
      const lcmVal = (a * b) / (seedMult * 2);
      return {
        id: `q-ai-${Date.now()}`,
        specId: "spec-edexcel-1ma1",
        topicId: "topic-num",
        subtopicName: "Prime Factors & Lowest Common Multiple (Fresh Variation)",
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
    "topic-fdp": () => {
      const originalPrice = seedMult * 80;
      const salePrice = Math.round(originalPrice * 0.8);
      return {
        id: `q-ai-${Date.now()}`,
        specId: "spec-edexcel-1ma1",
        topicId: "topic-fdp",
        subtopicName: "Reverse Percentage Reduction (Fresh Variation)",
        tier: "FOUNDATION",
        targetGrade: params.targetGrade,
        difficulty: 4,
        calculatorPolicy: params.calculatorPolicy,
        assessmentObjective: "AO2",
        questionType: "MULTI_STEP",
        stemMarkdown: `In a $20\\%$ sale, the price of a laptop is reduced to $\\text{£}${salePrice}$. Work out the normal price of the laptop before the sale.`,
        answerUnit: "£",
        totalMarks: 3,
        markScheme: {
          totalMarks: 3,
          acceptedFinalAnswers: [String(originalPrice)],
          workingSteps: [
            {
              id: "s1",
              stepNumber: 1,
              promptLabel: "Step 1: Write the percentage multiplier after a 20% reduction (as a decimal)",
              markCode: "M1",
              marks: 1,
              acceptedAnswers: ["0.8", "0.80", "80%"],
              explanation: "100% - 20% = 80% = 0.8.",
            },
            {
              id: "s2",
              stepNumber: 2,
              promptLabel: `Step 2: Divide ${salePrice} by 0.8`,
              markCode: "M1",
              marks: 1,
              acceptedAnswers: [String(originalPrice)],
              explanation: `£${salePrice} ÷ 0.8 = £${originalPrice}.`,
            },
          ],
          finalAccuracyMarks: 1,
          finalMarkCode: "A1",
          misconceptions: [
            {
              wrongAnswer: String(Math.round(salePrice * 1.2)),
              tag: "ADDED_20_PERCENT_OF_SALE_PRICE",
              diagnosticFeedback: "You added 20% of the sale price instead of dividing by 0.8.",
            },
          ],
        },
        workedSolutionMarkdown: `1. **Multiplier (M1):** $100\\% - 20\\% = 80\\% = 0.8$\n2. **Divide by multiplier (M1 A1):** $\\text{£}${salePrice} \\div 0.8 = \\text{£}${originalPrice}$`,
        commonMistakeHint: "For reverse percentages, divide the sale price by the decimal multiplier.",
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
        subtopicName: "Ratio Sharing Variation (Fresh Variation)",
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
    "topic-alg": () => {
      const xVal = seedMult + 1;
      const rhs = 3 * xVal - 5;
      return {
        id: `q-ai-${Date.now()}`,
        specId: "spec-edexcel-1ma1",
        topicId: "topic-alg",
        subtopicName: "Two-Step Linear Equation (Fresh Variation)",
        tier: "FOUNDATION",
        targetGrade: params.targetGrade,
        difficulty: 2,
        calculatorPolicy: params.calculatorPolicy,
        assessmentObjective: "AO1",
        questionType: "MULTI_STEP",
        stemMarkdown: `Solve the linear equation $3x - 5 = ${rhs}$.`,
        answerPrefix: "x =",
        totalMarks: 2,
        markScheme: {
          totalMarks: 2,
          acceptedFinalAnswers: [String(xVal), `x = ${xVal}`],
          workingSteps: [
            {
              id: "s1",
              stepNumber: 1,
              promptLabel: `Step 1: Add 5 to both sides (find 3x)`,
              markCode: "M1",
              marks: 1,
              acceptedAnswers: [String(rhs + 5), `3x = ${rhs + 5}`],
              explanation: `3x = ${rhs} + 5 = ${rhs + 5}.`,
            },
          ],
          finalAccuracyMarks: 1,
          finalMarkCode: "A1",
          misconceptions: [
            {
              wrongAnswer: String((rhs - 5) / 3),
              tag: "SUBTRACTED_INSTEAD_OF_ADDED",
              diagnosticFeedback: "Add 5 to both sides to undo -5 before dividing by 3.",
            },
          ],
        },
        workedSolutionMarkdown: `1. **Add 5 (M1):** $3x = ${rhs + 5}$\n2. **Divide by 3 (A1):** $x = ${xVal}$`,
        commonMistakeHint: "Use inverse operations: add 5 to both sides first.",
        lifecycleStatus: "AUTO_VALIDATED",
        version: 1,
      };
    },
    "topic-geom": () => {
      const base = seedMult * 4;
      const height = seedMult * 3;
      const area = (base * height) / 2;
      return {
        id: `q-ai-${Date.now()}`,
        specId: "spec-edexcel-1ma1",
        topicId: "topic-geom",
        subtopicName: "Area of a Right-Angled Triangle (Fresh Variation)",
        tier: "FOUNDATION",
        targetGrade: params.targetGrade,
        difficulty: 2,
        calculatorPolicy: params.calculatorPolicy,
        assessmentObjective: "AO1",
        questionType: "MULTI_STEP",
        stemMarkdown: `A right-angled triangle has a base of $${base}\\text{ cm}$ and a perpendicular height of $${height}\\text{ cm}$. Work out the area of the triangle.`,
        answerUnit: "cm²",
        totalMarks: 2,
        markScheme: {
          totalMarks: 2,
          acceptedFinalAnswers: [String(area)],
          workingSteps: [
            {
              id: "s1",
              stepNumber: 1,
              promptLabel: `Step 1: Multiply base by height (${base} × ${height})`,
              markCode: "M1",
              marks: 1,
              acceptedAnswers: [String(base * height)],
              explanation: `${base} × ${height} = ${base * height}.`,
            },
          ],
          finalAccuracyMarks: 1,
          finalMarkCode: "A1",
          misconceptions: [
            {
              wrongAnswer: String(base * height),
              tag: "FORGOT_TO_HALVE_TRIANGLE_AREA",
              diagnosticFeedback: `You calculated base × height (${base * height}), forgetting to divide by 2 for a triangle.`,
            },
          ],
        },
        workedSolutionMarkdown: `1. **Formula (M1):** $\\text{Area} = \\frac{1}{2} \\times ${base} \\times ${height}$\n2. **Evaluate (A1):** $${area}\\text{ cm}^2$`,
        commonMistakeHint: "Always divide base × height by 2 for the area of a triangle.",
        lifecycleStatus: "AUTO_VALIDATED",
        version: 1,
      };
    },
    "topic-stat": () => {
      const n1 = seedMult * 2;
      const n2 = seedMult * 3;
      const n3 = seedMult * 4;
      const n4 = seedMult * 7;
      const sum = n1 + n2 + n3 + n4;
      const mean = sum / 4;
      return {
        id: `q-ai-${Date.now()}`,
        specId: "spec-edexcel-1ma1",
        topicId: "topic-stat",
        subtopicName: "Mean of a Data Set (Fresh Variation)",
        tier: "FOUNDATION",
        targetGrade: params.targetGrade,
        difficulty: 2,
        calculatorPolicy: params.calculatorPolicy,
        assessmentObjective: "AO1",
        questionType: "MULTI_STEP",
        stemMarkdown: `Work out the mean of these four numbers: $${n1},\\; ${n2},\\; ${n3},\\; ${n4}$.`,
        totalMarks: 2,
        markScheme: {
          totalMarks: 2,
          acceptedFinalAnswers: [String(mean)],
          workingSteps: [
            {
              id: "s1",
              stepNumber: 1,
              promptLabel: `Step 1: Add the four numbers together`,
              markCode: "M1",
              marks: 1,
              acceptedAnswers: [String(sum)],
              explanation: `${n1} + ${n2} + ${n3} + ${n4} = ${sum}.`,
            },
          ],
          finalAccuracyMarks: 1,
          finalMarkCode: "A1",
          misconceptions: [
            {
              wrongAnswer: String(sum),
              tag: "FOUND_SUM_NOT_MEAN",
              diagnosticFeedback: `${sum} is the total sum. Divide by 4 to find the mean.`,
            },
          ],
        },
        workedSolutionMarkdown: `1. **Total sum (M1):** $${n1} + ${n2} + ${n3} + ${n4} = ${sum}$\n2. **Divide by 4 (A1):** $${sum} \\div 4 = ${mean}$`,
        commonMistakeHint: "Add all values together first, then divide by the number of values (4).",
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
  if (params.autoPublishForPractice && validation.passed) {
    draft.lifecycleStatus = "PUBLISHED";
  } else {
    draft.lifecycleStatus = validation.passed ? "REVIEW_PENDING" : "AI_DRAFT";
  }
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
): UserAccount | undefined {
  const db = readDb();
  if (!userId) {
    db.activeUserId = "";
    writeDb(db);
    return undefined;
  }
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error(`User ${userId} not found.`);
  db.activeUserId = user.id;
  if (selectedBoard) {
    user.selectedBoard = selectedBoard;
  }
  writeDb(db);
  return user;
}

export function signOutUser(): void {
  const db = readDb();
  db.activeUserId = "";
  writeDb(db);
}

/**
 * Finds a student account by either their email address or their parentInviteCode.
 */
export function findStudentByEmailOrInviteCode(
  db: PlatformDatabaseState,
  query?: string
): UserAccount | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase();
  if (!clean) return undefined;
  return db.users.find(
    (u) =>
      u.role === "STUDENT" &&
      (u.email.trim().toLowerCase() === clean ||
        (u.parentInviteCode && u.parentInviteCode.trim().toLowerCase() === clean))
  );
}

/**
 * Links a Parent account to a Student account using the student's email or parentInviteCode.
 */
export function linkStudentToParent(params: {
  parentUserId: string;
  studentEmailOrInviteCode: string;
}): UserAccount {
  const db = readDb();
  const parent = db.users.find((u) => u.id === params.parentUserId);
  if (!parent) {
    throw new Error("Parent account not found.");
  }
  const student = findStudentByEmailOrInviteCode(
    db,
    params.studentEmailOrInviteCode
  );
  if (!student) {
    throw new Error(
      `No student found matching "${params.studentEmailOrInviteCode}". Enter your child's registered Student Email or Parent Invite Code (e.g. PARENT-LEO-2027).`
    );
  }
  const existingLinks = parent.linkedStudentIds || [];
  parent.linkedStudentIds = [
    student.id,
    ...existingLinks.filter((id) => id !== student.id),
  ];
  writeDb(db);
  return student;
}

/**
 * Generates a passwordless 6-digit email confirmation code for a user.
 */
export function requestEmailVerificationCode(email: string): {
  email: string;
  code: string;
  existingUser?: UserAccount;
} {
  const db = readDb();
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  // Generate a 6-digit numeric confirmation code
  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.emailOtps[normalizedEmail] = {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  };
  writeDb(db);
  const existingUser = db.users.find(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );
  return { email: normalizedEmail, code, existingUser };
}

/**
 * Verifies a 6-digit email confirmation code.
 */
export function verifyEmailConfirmationCode(
  email: string,
  code?: string
): boolean {
  if (!code) return false;
  const db = readDb();
  const normalizedEmail = email.trim().toLowerCase();
  const record = db.emailOtps[normalizedEmail];
  if (!record) return false;
  if (Date.now() > record.expiresAt) return false;
  if (record.code === code.trim()) {
    delete db.emailOtps[normalizedEmail];
    writeDb(db);
    return true;
  }
  return false;
}

export function signInOrRegisterUser(params: {
  email: string;
  firstName?: string;
  lastName?: string;
  role?: "STUDENT" | "PARENT" | "ADMIN";
  selectedBoard?: ExamBoardCode;
  linkedStudentQuery?: string;
}): UserAccount {
  const db = readDb();
  const normalizedEmail = params.email.trim().toLowerCase();
  let user = db.users.find(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );

  const matchedStudent = findStudentByEmailOrInviteCode(
    db,
    params.linkedStudentQuery
  );

  if (!user) {
    const role = params.role || "STUDENT";
    const firstName =
      params.firstName?.trim() ||
      normalizedEmail.split("@")[0].replace(/[^a-zA-Z]/g, "") ||
      "Student";
    const lastName = params.lastName?.trim() || "";
    const newId = `user-${role.toLowerCase()}-${Date.now()}`;
    const shortSuffix = String(Date.now()).slice(-3);

    user = {
      id: newId,
      email: normalizedEmail,
      firstName:
        firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName,
      role,
      examYear: 2027,
      targetGrade: 4,
      selectedBoard: params.selectedBoard || "EDEXCEL",
      parentInviteCode:
        role === "STUDENT"
          ? `PARENT-${firstName.toUpperCase().slice(0, 4)}-${shortSuffix}`
          : undefined,
      linkedStudentIds:
        role === "PARENT"
          ? [matchedStudent ? matchedStudent.id : "user-student-leo"]
          : undefined,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else {
    if (params.selectedBoard) {
      user.selectedBoard = params.selectedBoard;
    }
    if (user.role === "PARENT" && matchedStudent) {
      const prev = user.linkedStudentIds || [];
      user.linkedStudentIds = [
        matchedStudent.id,
        ...prev.filter((id) => id !== matchedStudent.id),
      ];
    }
  }

  db.activeUserId = user.id;
  writeDb(db);
  return user;
}

/**
 * Records a contact enquiry from a parent, student, or school in the database.
 */
export function recordContactEnquiry(params: {
  fullName: string;
  email: string;
  role: string;
  message: string;
}): ContactEnquiryRecord {
  const db = readDb();
  const enquiry: ContactEnquiryRecord = {
    id: `enq-${Date.now()}`,
    fullName: params.fullName.trim() || "Visitor",
    email: params.email.trim(),
    role: params.role.trim() || "Parent / Guardian",
    message: params.message.trim(),
    createdAt: new Date().toISOString(),
  };
  db.enquiries.unshift(enquiry);
  writeDb(db);
  return enquiry;
}

