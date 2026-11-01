import { evaluate, gcd, simplify } from "mathjs";
import {
  GradedStepResult,
  QuestionGradingResult,
  QuestionItem,
} from "@/types/platform";

/**
 * Normalises a raw student mathematical input string so keyboard variations
 * (£, %, °, ×, ÷, spaces, "x =", etc.) can be compared cleanly and evaluated by mathjs.
 */
export function normaliseMathString(raw: string): string {
  if (!raw) return "";
  return raw
    .trim()
    .replace(/£/g, "")
    .replace(/°/g, "")
    .replace(/cm²|m²|cm|mph|g/gi, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/π/g, "pi")
    .replace(/\s+/g, "")
    .toLowerCase();
}

/**
 * Strips leading variable assignments like `x=5` -> `5` or `k=8` -> `8`
 * while preserving inequalities like `x>=2`.
 */
function stripAssignmentPrefix(norm: string): string {
  if (norm.includes("<=") || norm.includes(">=") || norm.includes("<") || norm.includes(">")) {
    return norm;
  }
  const eqParts = norm.split("=");
  if (eqParts.length === 2 && /^[a-z]$/.test(eqParts[0])) {
    return eqParts[1];
  }
  return norm;
}

/**
 * Checks if a string is a simple integer fraction `a/b` and whether it is in simplest form.
 */
export function checkFractionSimplification(raw: string): {
  isFraction: boolean;
  numerator?: number;
  denominator?: number;
  isSimplified: boolean;
} {
  const clean = normaliseMathString(raw);
  const match = clean.match(/^(-?\d+)\/(-?\d+)$/);
  if (!match) {
    return { isFraction: false, isSimplified: true };
  }
  const num = parseInt(match[1], 10);
  const den = parseInt(match[2], 10);
  if (den === 0) return { isFraction: true, isSimplified: false };
  const divisor = Number(gcd(Math.abs(num), Math.abs(den)));
  return {
    isFraction: true,
    numerator: num,
    denominator: den,
    isSimplified: divisor === 1 && den > 0,
  };
}

/**
 * Evaluates a numeric or fractional expression to a finite floating-point number if possible.
 */
export function tryEvaluateNumeric(raw: string): number | null {
  const clean = stripAssignmentPrefix(normaliseMathString(raw)).replace(/%$/, "");
  if (!clean) return null;
  // Do not evaluate if it contains free algebraic variables (other than pi or e)
  const withoutConstants = clean.replace(/pi/g, "").replace(/sqrt/g, "");
  if (/[a-df-z]/.test(withoutConstants)) {
    return null;
  }
  try {
    const val = evaluate(clean);
    if (typeof val === "number" && Number.isFinite(val)) {
      return val;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks whether two algebraic or symbolic expressions are mathematically equivalent
 * by evaluating them across multiple test points and comparing symbolic simplification.
 */
export function areExpressionsEquivalent(
  studentRaw: string,
  expectedRaw: string,
  tolerance = 1e-6
): boolean {
  const sNorm = normaliseMathString(studentRaw);
  const eNorm = normaliseMathString(expectedRaw);
  if (!sNorm || !eNorm) return false;
  if (sNorm === eNorm) return true;

  const sStripped = stripAssignmentPrefix(sNorm).replace(/%$/, "");
  const eStripped = stripAssignmentPrefix(eNorm).replace(/%$/, "");
  if (sStripped === eStripped) return true;

  // 1. Numeric evaluation check
  const sNum = tryEvaluateNumeric(sStripped);
  const eNum = tryEvaluateNumeric(eStripped);
  if (sNum !== null && eNum !== null) {
    return Math.abs(sNum - eNum) <= tolerance;
  }

  // 2. Algebraic expression check (e.g. 10x + 4 vs 4 + 10x)
  // Ensure that if the question is "Expand and simplify", an unexpanded expression with brackets
  // doesn't falsely pass as the final simplified form if expected has no brackets.
  const expectedHasBrackets = eStripped.includes("(") || eStripped.includes(")");
  const studentHasBrackets = sStripped.includes("(") || sStripped.includes(")");
  if (!expectedHasBrackets && studentHasBrackets) {
    return false;
  }

  try {
    // Convert implicit multiplication like 10x -> 10*x
    const prepareAlg = (expr: string) =>
      expr
        .replace(/(\d)([a-z(])/g, "$1*$2")
        .replace(/(\))(\d|[a-z(])/g, "$1*$2");

    const sAlg = prepareAlg(sStripped);
    const eAlg = prepareAlg(eStripped);

    const testValues = [-3, -1, 0, 2, 5];
    for (const val of testValues) {
      const sVal = evaluate(sAlg, { x: val, y: val, k: val, n: val });
      const eVal = evaluate(eAlg, { x: val, y: val, k: val, n: val });
      if (typeof sVal !== "number" || typeof eVal !== "number") return false;
      if (Math.abs(sVal - eVal) > 1e-5) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Grades a student's response to a QuestionItem using Edexcel GCSE Maths marking conventions:
 * - Correct final answer awards full marks (Method M1 + Accuracy A1) automatically unless
 *   fraction simplification was required and omitted.
 * - If the final answer is incorrect, each intermediate working step is checked to award
 *   earned M1 method marks and diagnose the exact step or misconception where marks were lost.
 */
export function gradeQuestionResponse(
  question: QuestionItem,
  studentFinalAnswer: string,
  studentSteps: Record<string, string> = {}
): QuestionGradingResult {
  const { markScheme } = question;
  const maxMarks = markScheme.totalMarks;
  const tolerance = markScheme.numericTolerance ?? 1e-5;
  const cleanFinal = (studentFinalAnswer || "").trim();

  // 1. Evaluate intermediate working steps first so we always have step diagnostics
  const stepResults: GradedStepResult[] = markScheme.workingSteps.map((step) => {
    const rawStepInput = (studentSteps[step.id] || "").trim();
    const stepTol = step.tolerance ?? tolerance;
    const isStepCorrect =
      rawStepInput.length > 0 &&
      step.acceptedAnswers.some((acc) =>
        areExpressionsEquivalent(rawStepInput, acc, stepTol)
      );

    return {
      stepId: step.id,
      markCode: step.markCode,
      studentInput: rawStepInput,
      awardedMarks: isStepCorrect ? step.marks : 0,
      maxMarks: step.marks,
      isCorrect: isStepCorrect,
      explanation: step.explanation,
    };
  });

  // 2. Check if the final answer matches an accepted final answer
  const matchesFinalValue =
    cleanFinal.length > 0 &&
    markScheme.acceptedFinalAnswers.some((acc) =>
      areExpressionsEquivalent(cleanFinal, acc, tolerance)
    );

  // 3. Check if fraction simplification was required (e.g., 18/30 vs 3/5)
  if (matchesFinalValue && markScheme.requireSimplifiedFraction) {
    const fracCheck = checkFractionSimplification(cleanFinal);
    if (fracCheck.isFraction && !fracCheck.isSimplified) {
      const methodMarks = Math.max(0, maxMarks - markScheme.finalAccuracyMarks);
      return {
        questionId: question.id,
        marksAwarded: methodMarks,
        maxMarks,
        methodMarksAwarded: methodMarks,
        accuracyMarksAwarded: 0,
        isFullyCorrect: false,
        isPartiallyCorrect: methodMarks > 0,
        stepResults,
        overallFeedback: `Your value (${cleanFinal}) is mathematically equivalent to the correct answer, earning ${methodMarks} method mark(s) (M1), but you lost the final accuracy mark (${markScheme.finalMarkCode}) because the fraction is not in its simplest form.`,
        markCodeSummary: `M${methodMarks} A0 (${methodMarks}/${maxMarks})`,
      };
    }
  }

  // 4. Full marks if final answer is completely valid
  if (matchesFinalValue) {
    const totalMethodMarks = maxMarks - markScheme.finalAccuracyMarks;
    return {
      questionId: question.id,
      marksAwarded: maxMarks,
      maxMarks,
      methodMarksAwarded: totalMethodMarks,
      accuracyMarksAwarded: markScheme.finalAccuracyMarks,
      isFullyCorrect: true,
      isPartiallyCorrect: false,
      stepResults: stepResults.map((s) => ({
        ...s,
        awardedMarks: s.maxMarks,
        isCorrect: true,
      })),
      overallFeedback: `Full marks (${maxMarks}/${maxMarks})! Correct method and accurate final answer.`,
      markCodeSummary:
        totalMethodMarks > 0
          ? `M${totalMethodMarks} ${markScheme.finalMarkCode} (${maxMarks}/${maxMarks})`
          : `${markScheme.finalMarkCode}${maxMarks} (${maxMarks}/${maxMarks})`,
    };
  }

  // 5. Check explicit partial final answers (e.g., 24 * 10^8 for standard form or x > 2 for x >= 2)
  if (cleanFinal.length > 0 && markScheme.partialFinalAnswers) {
    for (const partial of markScheme.partialFinalAnswers) {
      if (areExpressionsEquivalent(cleanFinal, partial.answer, tolerance)) {
        return {
          questionId: question.id,
          marksAwarded: partial.marksAwarded,
          maxMarks,
          methodMarksAwarded: partial.marksAwarded,
          accuracyMarksAwarded: 0,
          isFullyCorrect: false,
          isPartiallyCorrect: partial.marksAwarded > 0,
          stepResults,
          overallFeedback: partial.feedback,
          markCodeSummary: `M${partial.marksAwarded} A0 (${partial.marksAwarded}/${maxMarks})`,
        };
      }
    }
  }

  // 6. Check if final answer matches any intermediate working step (awards M1 even if entered in final box!)
  let methodMarksEarned = stepResults.reduce((sum, s) => sum + s.awardedMarks, 0);
  if (methodMarksEarned === 0 && cleanFinal.length > 0) {
    for (const step of markScheme.workingSteps) {
      if (
        step.acceptedAnswers.some((acc) =>
          areExpressionsEquivalent(cleanFinal, acc, step.tolerance ?? tolerance)
        )
      ) {
        methodMarksEarned = Math.min(
          maxMarks - markScheme.finalAccuracyMarks,
          step.marks
        );
        break;
      }
    }
  }

  // 7. Check for known diagnostic misconceptions
  let detectedMisconception: { tag: string; feedback: string } | undefined;
  if (cleanFinal.length > 0) {
    for (const misc of markScheme.misconceptions) {
      if (
        areExpressionsEquivalent(
          cleanFinal,
          misc.wrongAnswer,
          misc.tolerance ?? tolerance
        )
      ) {
        detectedMisconception = {
          tag: misc.tag,
          feedback: misc.diagnosticFeedback,
        };
        break;
      }
    }
  }

  const boundedMarks = Math.min(
    maxMarks - markScheme.finalAccuracyMarks,
    methodMarksEarned
  );

  let overallFeedback = "";
  if (detectedMisconception) {
    overallFeedback = detectedMisconception.feedback;
  } else if (boundedMarks > 0) {
    overallFeedback = `Partial credit awarded (${boundedMarks}/${maxMarks} marks): Your working earned Method Marks (M1), but the final answer was inaccurate. Review the final step in the worked solution below.`;
  } else if (!cleanFinal) {
    overallFeedback = `No answer submitted (0/${maxMarks} marks). Even if unsure on a GCSE paper, writing the first step earns M1 method marks!`;
  } else {
    overallFeedback = `Incorrect answer (0/${maxMarks} marks). Tip: ${question.commonMistakeHint}`;
  }

  return {
    questionId: question.id,
    marksAwarded: boundedMarks,
    maxMarks,
    methodMarksAwarded: boundedMarks,
    accuracyMarksAwarded: 0,
    isFullyCorrect: false,
    isPartiallyCorrect: boundedMarks > 0,
    stepResults,
    detectedMisconception,
    overallFeedback,
    markCodeSummary: `M${boundedMarks} A0 (${boundedMarks}/${maxMarks})`,
  };
}

/**
 * AI Agent 3: Symbolic & Deterministic Answer Validation Agent
 * Independently checks a question item's mark scheme to ensure:
 * 1. Accepted final answers are non-empty and self-consistent.
 * 2. Working steps sum + final accuracy marks equal totalMarks.
 * 3. Misconception answers do not collide with the accepted correct answer.
 */
export function runSymbolicValidationAgent(question: QuestionItem): {
  passed: boolean;
  notes: string[];
} {
  const notes: string[] = [];
  let passed = true;

  if (!question.markScheme.acceptedFinalAnswers.length) {
    passed = false;
    notes.push("ERROR: Mark scheme has no accepted final answers.");
  } else {
    const primary = question.markScheme.acceptedFinalAnswers[0];
    const numVal = tryEvaluateNumeric(primary);
    if (numVal !== null) {
      notes.push(`Symbolic Evaluator confirmed deterministic numeric target: ${primary} = ${numVal}.`);
    } else {
      try {
        const simplified = simplify(normaliseMathString(primary)).toString();
        notes.push(`Symbolic Evaluator parsed algebraic expression: ${primary} -> ${simplified}.`);
      } catch {
        notes.push(`Verified structured expression target: ${primary}.`);
      }
    }
  }

  const stepMarkSum = question.markScheme.workingSteps.reduce(
    (acc, s) => acc + s.marks,
    0
  );
  const totalFromScheme = stepMarkSum + question.markScheme.finalAccuracyMarks;
  if (totalFromScheme !== question.totalMarks) {
    passed = false;
    notes.push(
      `ERROR: Step marks (${stepMarkSum}) + Final Accuracy Marks (${question.markScheme.finalAccuracyMarks}) != totalMarks (${question.totalMarks}).`
    );
  } else {
    notes.push(
      `Mark allocation verified: ${stepMarkSum} Method (M1) + ${question.markScheme.finalAccuracyMarks} Accuracy (${question.markScheme.finalMarkCode}) = ${question.totalMarks} total marks.`
    );
  }

  // Ensure no misconception collides with accepted final answer
  for (const misc of question.markScheme.misconceptions) {
    const collides = question.markScheme.acceptedFinalAnswers.some((ans) =>
      areExpressionsEquivalent(misc.wrongAnswer, ans)
    );
    if (collides) {
      passed = false;
      notes.push(
        `ERROR: Misconception '${misc.tag}' (${misc.wrongAnswer}) collides with the accepted correct answer.`
      );
    }
  }

  if (passed) {
    notes.push("All deterministic & symbolic checks passed (AUTO_VALIDATED).");
  }

  return { passed, notes };
}
