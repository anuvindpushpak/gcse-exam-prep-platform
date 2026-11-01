import assert from "node:assert";
import { EDEXCEL_FOUNDATION_QUESTIONS } from "../src/content/edexcel-1ma1-foundation/questions";
import {
  areExpressionsEquivalent,
  checkFractionSimplification,
  gradeQuestionResponse,
  runSymbolicValidationAgent,
} from "../src/lib/engine/grader";

console.log("Running Assessment Engine & Symbolic Grader Verification Suite...");

// 1. Test Numeric & Fractional Equivalence
assert.strictEqual(
  areExpressionsEquivalent("7/20", "0.35"),
  true,
  "7/20 should equal 0.35"
);
assert.strictEqual(
  areExpressionsEquivalent("£600", "600"),
  true,
  "Currency symbol £ should normalise cleanly"
);

// 2. Test Algebraic Equivalence
assert.strictEqual(
  areExpressionsEquivalent("10x + 4", "4 + 10x"),
  true,
  "Commutative algebraic expressions 10x + 4 and 4 + 10x should be equivalent"
);
assert.strictEqual(
  areExpressionsEquivalent("4(2x + 3) + 2(x - 4)", "10x + 4"),
  false,
  "Unexpanded expression with brackets must not pass as final simplified answer"
);

// 3. Test Fraction Simplification Detection
const unsimp = checkFractionSimplification("18/30");
assert.strictEqual(unsimp.isFraction, true);
assert.strictEqual(unsimp.isSimplified, false, "18/30 is not simplified");

const simp = checkFractionSimplification("3/5");
assert.strictEqual(simp.isFraction, true);
assert.strictEqual(simp.isSimplified, true, "3/5 is simplified");

// 4. Test Partial Method Marks (M1 A0) when unsimplified fraction is given
const vennQuestion = EDEXCEL_FOUNDATION_QUESTIONS.find((q) => q.id === "q-stat-1")!;
const unsimpGrade = gradeQuestionResponse(vennQuestion, "18/30", {});
assert.strictEqual(
  unsimpGrade.marksAwarded,
  1,
  "Unsimplified 18/30 should award 1/2 (M1 A0) marks"
);
assert.strictEqual(unsimpGrade.methodMarksAwarded, 1);
assert.strictEqual(unsimpGrade.accuracyMarksAwarded, 0);

// 5. Test Full Marks (M1 A1) when simplified fraction is given
const simpGrade = gradeQuestionResponse(vennQuestion, "3/5", {});
assert.strictEqual(simpGrade.marksAwarded, 2);
assert.strictEqual(simpGrade.isFullyCorrect, true);

// 6. Test Step-Input Method Marks (M1) when Final Answer is Wrong
const reversePctQuestion = EDEXCEL_FOUNDATION_QUESTIONS.find((q) => q.id === "q-fdp-2")!;
const partialStepResult = gradeQuestionResponse(reversePctQuestion, "590", {
  "q-fdp-2-s1": "0.85",
  "q-fdp-2-s2": "510/0.85",
});
assert.strictEqual(
  partialStepResult.marksAwarded,
  2,
  "Correct intermediate steps should earn 2/3 M1 marks even if final answer is wrong"
);

// 7. Test Misconception Detection
const bidmasQuestion = EDEXCEL_FOUNDATION_QUESTIONS.find((q) => q.id === "q-num-1")!;
const miscResult = gradeQuestionResponse(bidmasQuestion, "136", {});
assert.strictEqual(miscResult.marksAwarded, 0);
assert.strictEqual(
  miscResult.detectedMisconception?.tag,
  "BIDMAS_SUBTRACTION_FIRST",
  "Should detect BIDMAS subtraction-first misconception"
);

// 8. Validate ALL Published Questions in the Question Bank with Agent 3 (Symbolic Validator)
const publishedQuestions = EDEXCEL_FOUNDATION_QUESTIONS.filter(
  (q) => q.lifecycleStatus === "PUBLISHED"
);
assert.ok(
  publishedQuestions.length >= 24,
  `Expected at least 24 published questions, found ${publishedQuestions.length}`
);

for (const q of publishedQuestions) {
  const report = runSymbolicValidationAgent(q);
  assert.strictEqual(
    report.passed,
    true,
    `Question ${q.id} failed symbolic validation: ${report.notes.join("; ")}`
  );
}

console.log(
  `✅ All Grader unit tests and ${publishedQuestions.length} Question Bank symbolic validations passed!`
);

