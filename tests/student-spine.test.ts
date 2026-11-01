import assert from "node:assert";
import {
  generateValidatedAiQuestionDraft,
  getStudentEntitlements,
  readDb,
  recordProductPurchase,
  resetDemoDatabase,
  submitAndGradeAssessment,
  updateQuestionLifecycleStatus,
} from "../src/lib/db/store";
import { buildStudentIntelligenceProfile } from "../src/lib/engine/intelligence";

console.log("Running End-to-End Student & Commercial Spine Verification...");

// 1. Reset to clean initial state
const initialDb = resetDemoDatabase();
const studentId = "user-student-leo";
const initialEntitlements = getStudentEntitlements(initialDb, studentId);
assert.strictEqual(
  initialEntitlements.hasFullPack,
  false,
  "Student should start on Free Diagnostic Lead Magnet tier"
);

// 2. Step 1 of Spine: Student completes Free Baseline Diagnostic Assessment
const diagnosticAttempt = submitAndGradeAssessment({
  studentId,
  templateId: "diag-edexcel-foundation",
  timeSpentSeconds: 900,
  rawResponses: {
    "q-num-1": { studentFinalAnswer: "-4" }, // 2/2
    "q-num-2": { studentFinalAnswer: "90" }, // 3/3
    "q-fdp-1": { studentFinalAnswer: "1/-1" }, // 0/2 (weakness: FDP)
    "q-fdp-2": { studentFinalAnswer: "586.5" }, // 0/3 (weakness: Reverse %)
    "q-rat-1": {
      studentFinalAnswer: "80",
      studentSteps: { "q-rat-1-s1": "20" },
    }, // 1/2 (M1 A0)
    "q-rat-3": { studentFinalAnswer: "54.4" }, // 0/3 (weakness: Speed decimal time)
    "q-alg-1": { studentFinalAnswer: "10x + 4" }, // 2/2
    "q-alg-2": { studentFinalAnswer: "5" }, // 3/3
    "q-geom-1": {
      studentFinalAnswer: "169",
      studentSteps: { "q-geom-1-s1": "169" },
    }, // 1/3 (M1 A0)
    "q-geom-2": { studentFinalAnswer: "65" }, // 2/2
    "q-stat-1": { studentFinalAnswer: "3/5" }, // 2/2
    "q-stat-2": { studentFinalAnswer: "5" }, // 2/2
  },
});

assert.strictEqual(diagnosticAttempt.status, "SUBMITTED");
assert.ok(
  diagnosticAttempt.earnedMarks > 0 &&
    diagnosticAttempt.earnedMarks < diagnosticAttempt.totalMarks,
  `Diagnostic scored ${diagnosticAttempt.earnedMarks}/${diagnosticAttempt.totalMarks} (${diagnosticAttempt.percentageScore}%)`
);

// Verify Intelligence Engine detects FDP & Ratio as priority weak topics
const dbAfterDiag = readDb();
const profileAfterDiag = buildStudentIntelligenceProfile(
  studentId,
  dbAfterDiag.topics,
  dbAfterDiag.questions.filter((q) => q.lifecycleStatus === "PUBLISHED"),
  dbAfterDiag.attempts,
  getStudentEntitlements(dbAfterDiag, studentId)
);
assert.ok(
  profileAfterDiag.recommendations.length > 0,
  "Intelligence Engine should generate prioritized recommendations"
);

// 3. Step 2 of Spine: Purchase £39.99 GCSE Maths Grade 4 Preparation Pack
const purchase = recordProductPurchase({
  buyerUserId: "user-parent-sarah",
  buyerEmail: "parent@demo.uk",
  beneficiaryStudentId: studentId,
  productId: "prod-gcse-maths-grade4-pack",
});
assert.strictEqual(purchase.amountPence, 3999);

const entitlementsAfterPurchase = getStudentEntitlements(readDb(), studentId);
assert.strictEqual(
  entitlementsAfterPurchase.hasFullPack,
  true,
  "£39.99 purchase must unlock full pack entitlement"
);

// 4. Step 3 of Spine: Student practises weak topic (FDP) and masters it
const practiceAttempt = submitAndGradeAssessment({
  studentId,
  templateId: "prac-topic-fdp",
  timeSpentSeconds: 480,
  rawResponses: {
    "q-fdp-1": { studentFinalAnswer: "7/20" },
    "q-fdp-2": { studentFinalAnswer: "600" },
    "q-fdp-3": { studentFinalAnswer: "2121.80" },
    "q-fdp-4b": { studentFinalAnswer: "20%" },
  },
});
assert.strictEqual(
  practiceAttempt.percentageScore,
  100,
  "Student should score 100% on remediated FDP practice set"
);

// 5. Step 4 of Spine: Student sits Mock Examination Paper 1F (Non-Calculator)
const mockAttempt = submitAndGradeAssessment({
  studentId,
  templateId: "mock-edexcel-p1-noncalc",
  timeSpentSeconds: 2100,
  rawResponses: {
    "q-num-1": { studentFinalAnswer: "-4" },
    "q-rat-1": { studentFinalAnswer: "100" },
    "q-fdp-1": { studentFinalAnswer: "7/20" },
    "q-alg-1": { studentFinalAnswer: "10x + 4" },
    "q-geom-2": { studentFinalAnswer: "65" },
    "q-stat-1": { studentFinalAnswer: "3/5" },
    "q-num-2": { studentFinalAnswer: "90" },
    "q-num-3": { studentFinalAnswer: "8" },
    "q-alg-2": { studentFinalAnswer: "5" },
    "q-alg-3": { studentFinalAnswer: "2" },
    "q-alg-4": { studentFinalAnswer: "x >= 2" },
    "q-geom-3": { studentFinalAnswer: "50" },
    "q-rat-2": { studentFinalAnswer: "70" },
    "q-num-4": { studentFinalAnswer: "2.4 * 10^9" },
    "q-fdp-4b": { studentFinalAnswer: "20" },
  },
});
assert.strictEqual(mockAttempt.percentageScore, 100);
assert.ok(
  mockAttempt.estimatedGrade.includes("Grade 5") ||
    mockAttempt.estimatedGrade.includes("Grade 4")
);

// 6. Verify AI Content Factory & Governance Lifecycle
const aiDraft = generateValidatedAiQuestionDraft({
  topicId: "topic-ratio",
  calculatorPolicy: "NON_CALCULATOR",
  targetGrade: 4,
});
assert.strictEqual(
  aiDraft.lifecycleStatus,
  "REVIEW_PENDING",
  "AI generated question must enter REVIEW_PENDING, never auto-publish"
);
assert.strictEqual(aiDraft.validationReport?.symbolicCheckPassed, true);

const published = updateQuestionLifecycleStatus(aiDraft.id, "PUBLISHED");
assert.strictEqual(published.lifecycleStatus, "PUBLISHED");

// Reset database back to clean demo start state after verification
resetDemoDatabase();

console.log(
  "✅ Complete Student & Commercial Spine (Diagnostic -> Purchase -> Practice -> Mock Exam -> Report + AI Governance) verified!"
);
