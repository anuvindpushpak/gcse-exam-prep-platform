// ============================================================================
// SHARED DOMAIN TYPES FOR THE THREE-ENGINE EXAM PREPARATION PLATFORM
// ============================================================================

export type UserRole = "STUDENT" | "PARENT" | "ADMIN";
export type ExamBoardCode = "EDEXCEL" | "AQA" | "OCR";
export type ExamTier = "FOUNDATION" | "HIGHER";
export type CalculatorPolicy = "NON_CALCULATOR" | "CALCULATOR_ALLOWED" | "MIXED";
export type AssessmentObjective = "AO1" | "AO2" | "AO3";
export type QuestionType = "NUMERIC" | "ALGEBRAIC" | "MULTI_STEP" | "MULTIPLE_CHOICE";
export type ContentLifecycleStatus = "AI_DRAFT" | "AUTO_VALIDATED" | "REVIEW_PENDING" | "PUBLISHED" | "ARCHIVED";
export type EntitlementScope = "DIAGNOSTIC_FREE" | "FULL_PACK" | "WEEKLY_MEMBERSHIP";
export type AssessmentMode = "DIAGNOSTIC" | "TOPIC_PRACTICE" | "TIMED_CHALLENGE" | "MOCK_EXAM" | "WEEKLY_CHALLENGE";
export type MasteryStatus = "NOT_STARTED" | "NEEDS_FOCUS" | "DEVELOPING" | "SECURE_GRADE_4";

// ----------------------------------------------------------------------------
// Declarative SVG Diagram Schema (No LLM Raster Hallucinations)
// ----------------------------------------------------------------------------
export type DiagramSpec =
  | {
      type: "RIGHT_TRIANGLE";
      title?: string;
      baseLabel: string;
      heightLabel: string;
      hypotenuseLabel?: string;
      angleLabel?: string;
      notToScale?: boolean;
    }
  | {
      type: "PARALLEL_LINES_ANGLES";
      title?: string;
      knownAngle: number;
      unknownLabel: string;
      relationship: "ALTERNATE" | "CORRESPONDING" | "CO_INTERIOR";
      notToScale?: boolean;
    }
  | {
      type: "COORDINATE_GRID";
      title?: string;
      xRange: [number, number];
      yRange: [number, number];
      points?: Array<{ x: number; y: number; label: string; color?: string }>;
      line?: { slope: number; intercept: number; label?: string };
    }
  | {
      type: "BAR_CHART";
      title: string;
      xAxisLabel: string;
      yAxisLabel: string;
      bars: Array<{ category: string; value: number; color?: string }>;
    }
  | {
      type: "VENN_DIAGRAM";
      title: string;
      universalTotal: number;
      setALabel: string;
      setBLabel: string;
      onlyA: number | string;
      bothAB: number | string;
      onlyB: number | string;
      outsideAB: number | string;
    }
  | {
      type: "NUMBER_LINE_INEQUALITY";
      min: number;
      max: number;
      value: number;
      operator: "<" | "<=" | ">" | ">=";
      variable: string;
    }
  | {
      type: "RECTANGLE_COMPOUND";
      title?: string;
      widthTop: string;
      heightLeft: string;
      widthBottomInner: string;
      heightRightInner: string;
      notToScale?: boolean;
    };

// ----------------------------------------------------------------------------
// Multi-Step Mark Scheme (Method Marks M1 + Accuracy Marks A1 / B1)
// ----------------------------------------------------------------------------
export interface WorkingStepRule {
  id: string;
  stepNumber: number;
  promptLabel: string; // e.g., "Step 1: Find 1 part of the ratio" or "Step 1: Expand the brackets"
  markCode: "M1" | "B1";
  marks: number;
  acceptedAnswers: string[]; // Evaluated symbolically/numerically
  tolerance?: number;
  explanation: string;
}

export interface MisconceptionRule {
  wrongAnswer: string;
  tolerance?: number;
  tag: string;
  diagnosticFeedback: string;
}

export interface MarkScheme {
  totalMarks: number;
  /** Primary final answer(s) accepted for full accuracy credit */
  acceptedFinalAnswers: string[];
  /** Numeric tolerance for rounding or graph-reading questions */
  numericTolerance?: number;
  /** Whether a fraction must be in simplest form to earn the final A1 mark */
  requireSimplifiedFraction?: boolean;
  /** Equivalent unsimplified or intermediate final answer that earns M1 but loses A1 */
  partialFinalAnswers?: Array<{
    answer: string;
    marksAwarded: number;
    feedback: string;
  }>;
  /** Optional or structured intermediate working steps for M1 method credit */
  workingSteps: WorkingStepRule[];
  /** Final accuracy mark allocation (e.g., 1 mark for A1 after M1 steps) */
  finalAccuracyMarks: number;
  finalMarkCode: "A1" | "B1";
  /** Common wrong answers mapped to targeted misconception coaching */
  misconceptions: MisconceptionRule[];
}

// ----------------------------------------------------------------------------
// Engine 1: Content Engine Models
// ----------------------------------------------------------------------------
export interface FormulaSheetItem {
  category: string;
  title: string;
  formulaLatex: string;
  notes?: string;
}

export interface ExamBoardSpecification {
  id: string;
  subjectSlug: string;
  subjectName: string;
  boardCode: ExamBoardCode;
  specCode: string;
  name: string;
  supportedTiers: ExamTier[];
  grade4PassPercentage: number;
  formulaSheet: FormulaSheetItem[];
}

export interface TopicDefinition {
  id: string;
  specId: string;
  code: string;
  domain: string;
  name: string;
  tier: ExamTier;
  gradeTarget: number;
  weightPercentage: number;
  prerequisiteTopicIds: string[];
  isFreeSample: boolean;
  description: string;
}

export interface WorkedExample {
  title: string;
  questionText: string;
  calculatorPolicy: CalculatorPolicy;
  marks: number;
  steps: Array<{
    markCode: string;
    working: string;
    explanation: string;
  }>;
  finalAnswer: string;
}

export interface LearningResource {
  id: string;
  topicId: string;
  summaryMarkdown: string;
  keyRules: string[];
  formulae: Array<{ label: string; expression: string; note?: string }>;
  workedExamples: WorkedExample[];
  commonMistakes: Array<{ trap: string; correction: string }>;
}

export interface QuestionItem {
  id: string;
  specId: string;
  topicId: string;
  subtopicName: string;
  tier: ExamTier;
  targetGrade: number; // 1 to 5 on Foundation
  difficulty: 1 | 2 | 3 | 4 | 5;
  calculatorPolicy: "NON_CALCULATOR" | "CALCULATOR_ALLOWED";
  assessmentObjective: AssessmentObjective;
  questionType: QuestionType;
  stemMarkdown: string;
  options?: string[]; // For MULTIPLE_CHOICE
  answerUnit?: string; // e.g., "cm", "£", "degrees"
  answerPrefix?: string; // e.g., "x ="
  diagram?: DiagramSpec;
  totalMarks: number;
  markScheme: MarkScheme;
  workedSolutionMarkdown: string;
  commonMistakeHint: string;
  lifecycleStatus: ContentLifecycleStatus;
  validationReport?: {
    symbolicCheckPassed: boolean;
    verifiedAt: string;
    validatorNotes: string[];
  };
  version: number;
}

// ----------------------------------------------------------------------------
// Engine 2: Assessment & Examination Simulator Models
// ----------------------------------------------------------------------------
export interface AssessmentTemplate {
  id: string;
  specId: string;
  slug: string;
  title: string;
  subtitle: string;
  mode: AssessmentMode;
  calculatorPolicy: CalculatorPolicy;
  timeLimitMinutes: number;
  totalMarks: number;
  passMarkGrade4: number;
  requiresEntitlement: EntitlementScope;
  questionIds: string[];
  paperNumber?: number; // e.g., Paper 1 (Non-Calc), Paper 2 (Calc), Paper 3 (Calc)
  releaseWeekLabel?: string; // For Weekly Practice Membership
}

export interface GradedStepResult {
  stepId: string;
  markCode: string;
  studentInput: string;
  awardedMarks: number;
  maxMarks: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuestionGradingResult {
  questionId: string;
  marksAwarded: number;
  maxMarks: number;
  methodMarksAwarded: number;
  accuracyMarksAwarded: number;
  isFullyCorrect: boolean;
  isPartiallyCorrect: boolean;
  stepResults: GradedStepResult[];
  detectedMisconception?: {
    tag: string;
    feedback: string;
  };
  overallFeedback: string;
  markCodeSummary: string; // e.g. "M1 A1 (2/2)" or "M1 A0 (1/2)"
}

export interface QuestionResponseRecord {
  questionId: string;
  studentFinalAnswer: string;
  studentSteps: Record<string, string>; // stepId -> student input
  isFlagged: boolean;
  timeSpentSeconds: number;
  grading?: QuestionGradingResult;
}

export interface TopicScoreBreakdown {
  topicId: string;
  topicName: string;
  topicCode: string;
  earnedMarks: number;
  maxMarks: number;
  percentage: number;
  status: MasteryStatus;
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  templateId: string;
  templateTitle: string;
  mode: AssessmentMode;
  calculatorPolicy: CalculatorPolicy;
  status: "IN_PROGRESS" | "SUBMITTED";
  startedAt: string;
  submittedAt?: string;
  timeSpentSeconds: number;
  earnedMarks: number;
  totalMarks: number;
  percentageScore: number;
  estimatedGrade: string; // e.g., "Grade 3 (High)", "Grade 4 (Standard Pass)"
  grade4ReadinessScore: number; // 0 to 100
  responses: Record<string, QuestionResponseRecord>;
  topicBreakdown: TopicScoreBreakdown[];
  nonCalcScore?: { earned: number; max: number; percentage: number };
  calcScore?: { earned: number; max: number; percentage: number };
}

// ----------------------------------------------------------------------------
// Engine 3: Intelligence Engine Models
// ----------------------------------------------------------------------------
export interface StudentTopicMastery {
  studentId: string;
  topicId: string;
  topicCode: string;
  topicName: string;
  domain: string;
  weightPercentage: number;
  masteryScore: number; // 0 - 100
  status: MasteryStatus;
  questionsAttempted: number;
  marksEarned: number;
  marksPossible: number;
  commonErrors: string[];
  lastPractisedAt?: string;
}

export interface NextBestActionRecommendation {
  id: string;
  priorityRank: number;
  topicId: string;
  topicCode: string;
  topicName: string;
  actionType: "TAKE_DIAGNOSTIC" | "STUDY_AND_PRACTISE" | "TIMED_TOPIC_CHECK" | "SIT_MOCK_EXAM";
  headline: string;
  reasonSummary: string;
  potentialMarkGain: number;
  ctaHref: string;
  ctaLabel: string;
  requiresEntitlement: EntitlementScope;
}

export interface StudentIntelligenceProfile {
  studentId: string;
  overallReadinessScore: number; // 0 to 100 (where >= 65% represents Grade 4 secure readiness)
  estimatedCurrentGrade: string;
  marksAwayFromGrade4: number;
  baselineDiagnosticScore?: number;
  latestAssessmentScore?: number;
  improvementDelta: number;
  nonCalculatorAccuracy: number;
  calculatorAccuracy: number;
  methodMarkCaptureRate: number;
  totalQuestionsAttempted: number;
  totalPracticeMinutes: number;
  topicMastery: StudentTopicMastery[];
  recommendations: NextBestActionRecommendation[];
}

// ----------------------------------------------------------------------------
// Commerce, Accounts & Parent Linking Models
// ----------------------------------------------------------------------------
export interface UserAccount {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  examYear?: number;
  targetGrade?: number;
  selectedBoard: ExamBoardCode;
  linkedStudentIds?: string[]; // For PARENT
  parentInviteCode?: string;   // For STUDENT to share with Parent
  createdAt: string;
}

export interface ProductCatalogItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  type: "ONE_TIME_PACK" | "SUBSCRIPTION";
  pricePence: number;
  priceFormatted: string;
  billingLabel: string;
  entitlementScope: EntitlementScope;
  badge?: string;
  features: string[];
}

export interface PurchaseRecord {
  id: string;
  buyerUserId: string;
  buyerEmail: string;
  beneficiaryStudentId: string;
  productId: string;
  productName: string;
  amountPence: number;
  status: "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface StudentEntitlementState {
  hasFreeDiagnostic: boolean;
  hasFullPack: boolean;
  hasWeeklyMembership: boolean;
  purchasedProducts: PurchaseRecord[];
}

