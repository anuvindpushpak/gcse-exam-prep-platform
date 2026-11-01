import {
  AssessmentAttempt,
  MasteryStatus,
  NextBestActionRecommendation,
  QuestionItem,
  StudentEntitlementState,
  StudentIntelligenceProfile,
  StudentTopicMastery,
  TopicDefinition,
} from "@/types/platform";

export function classifyMasteryStatus(
  questionsAttempted: number,
  percentage: number
): MasteryStatus {
  if (questionsAttempted === 0) return "NOT_STARTED";
  if (percentage >= 65) return "SECURE_GRADE_4";
  if (percentage >= 45) return "DEVELOPING";
  return "NEEDS_FOCUS";
}

export function estimateFoundationGrade(percentage: number): string {
  if (percentage >= 76) return "Grade 5 (Strong Pass)";
  if (percentage >= 62) return "Grade 4 (Standard Pass)";
  if (percentage >= 46) return "Grade 3 (Borderline — Close to Pass)";
  if (percentage >= 30) return "Grade 2 (Foundation Building)";
  return "Grade 1 (Early Foundation)";
}

/**
 * Engine 3: Intelligence Engine
 * Computes real-time student analytics, topic mastery RAG, Non-Calc vs Calc accuracy,
 * method-mark capture rate, and prioritized Next-Best-Action recommendations.
 */
export function buildStudentIntelligenceProfile(
  studentId: string,
  topics: TopicDefinition[],
  questions: QuestionItem[],
  attempts: AssessmentAttempt[],
  entitlements: StudentEntitlementState
): StudentIntelligenceProfile {
  const submittedAttempts = attempts
    .filter((a) => a.studentId === studentId && a.status === "SUBMITTED")
    .sort(
      (a, b) =>
        new Date(a.submittedAt || a.startedAt).getTime() -
        new Date(b.submittedAt || b.startedAt).getTime()
    );

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // Aggregate per-topic statistics across all submitted attempts
  const topicStats = new Map<
    string,
    {
      attempted: number;
      earned: number;
      possible: number;
      errors: Set<string>;
      lastAt?: string;
    }
  >();

  for (const t of topics) {
    topicStats.set(t.id, {
      attempted: 0,
      earned: 0,
      possible: 0,
      errors: new Set(),
    });
  }

  let nonCalcEarned = 0;
  let nonCalcMax = 0;
  let calcEarned = 0;
  let calcMax = 0;
  let totalMethodEarned = 0;
  let totalMethodMax = 0;
  let totalQuestionsAttempted = 0;
  let totalTimeSeconds = 0;

  for (const attempt of submittedAttempts) {
    totalTimeSeconds += attempt.timeSpentSeconds || 0;
    for (const [qId, resp] of Object.entries(attempt.responses)) {
      const q = questionMap.get(qId);
      if (!q || !resp.grading) continue;

      totalQuestionsAttempted += 1;
      const earned = resp.grading.marksAwarded;
      const max = resp.grading.maxMarks;

      if (q.calculatorPolicy === "NON_CALCULATOR") {
        nonCalcEarned += earned;
        nonCalcMax += max;
      } else {
        calcEarned += earned;
        calcMax += max;
      }

      const qMethodMax = Math.max(
        0,
        q.totalMarks - q.markScheme.finalAccuracyMarks
      );
      totalMethodMax += qMethodMax;
      totalMethodEarned += resp.grading.methodMarksAwarded;

      const tStat = topicStats.get(q.topicId);
      if (tStat) {
        tStat.attempted += 1;
        tStat.earned += earned;
        tStat.possible += max;
        tStat.lastAt = attempt.submittedAt || attempt.startedAt;
        if (resp.grading.detectedMisconception) {
          tStat.errors.add(resp.grading.detectedMisconception.tag);
        } else if (!resp.grading.isFullyCorrect) {
          tStat.errors.add(q.subtopicName);
        }
      }
    }
  }

  // Build Topic Mastery records
  const topicMastery: StudentTopicMastery[] = topics.map((t) => {
    const st = topicStats.get(t.id)!;
    const score =
      st.possible > 0 ? Math.round((st.earned / st.possible) * 100) : 0;
    return {
      studentId,
      topicId: t.id,
      topicCode: t.code,
      topicName: t.name,
      domain: t.domain,
      weightPercentage: t.weightPercentage,
      masteryScore: score,
      status: classifyMasteryStatus(st.attempted, score),
      questionsAttempted: st.attempted,
      marksEarned: st.earned,
      marksPossible: st.possible,
      commonErrors: Array.from(st.errors).slice(0, 3),
      lastPractisedAt: st.lastAt,
    };
  });

  // Compute weighted overall readiness score
  const attemptedTopics = topicMastery.filter((m) => m.questionsAttempted > 0);
  let overallReadinessScore = 0;
  if (attemptedTopics.length > 0) {
    const weightedSum = attemptedTopics.reduce(
      (sum, m) => sum + m.masteryScore * m.weightPercentage,
      0
    );
    const totalWeight = attemptedTopics.reduce(
      (sum, m) => sum + m.weightPercentage,
      0
    );
    overallReadinessScore = Math.round(weightedSum / Math.max(1, totalWeight));
  }

  // Baseline diagnostic vs latest score
  const diagAttempts = submittedAttempts.filter((a) => a.mode === "DIAGNOSTIC");
  const baselineDiagnosticScore =
    diagAttempts.length > 0 ? diagAttempts[0].percentageScore : undefined;
  const latestAssessmentScore =
    submittedAttempts.length > 0
      ? submittedAttempts[submittedAttempts.length - 1].percentageScore
      : undefined;

  const improvementDelta =
    baselineDiagnosticScore !== undefined && latestAssessmentScore !== undefined
      ? Math.round(latestAssessmentScore - baselineDiagnosticScore)
      : 0;

  // On a 240-mark Edexcel GCSE series (3 × 80 marks), Grade 4 is ~149 marks (62%).
  const currentSimulatedMarksOutOf240 = Math.round(
    (overallReadinessScore / 100) * 240
  );
  const marksAwayFromGrade4 = Math.max(
    0,
    149 - currentSimulatedMarksOutOf240
  );

  // Build Personalized Next-Best-Action Recommendations
  const recommendations: NextBestActionRecommendation[] = [];

  if (submittedAttempts.length === 0) {
    recommendations.push({
      id: "rec-start-diag",
      priorityRank: 1,
      topicId: "topic-num",
      topicCode: "DIAG",
      topicName: "Baseline Diagnostic Assessment",
      actionType: "TAKE_DIAGNOSTIC",
      headline: "Take your Free Grade 4 Baseline Diagnostic Assessment",
      reasonSummary:
        "Complete this 12-question diagnostic across all 6 Edexcel Foundation topics to discover your exact Grade 4 mark gap and unlock your personalised study pathway.",
      potentialMarkGain: 25,
      ctaHref: "/exam/diag-edexcel-foundation",
      ctaLabel: "Start Free Diagnostic (15–20 mins)",
      requiresEntitlement: "DIAGNOSTIC_FREE",
    });
  } else {
    // Sort topics by highest syllabus leverage * mark deficit from Grade 4 (65%)
    const weakTopics = [...topicMastery]
      .filter((m) => m.status !== "SECURE_GRADE_4")
      .sort((a, b) => {
        const deficitA = Math.max(10, 75 - a.masteryScore) * a.weightPercentage;
        const deficitB = Math.max(10, 75 - b.masteryScore) * b.weightPercentage;
        return deficitB - deficitA;
      });

    weakTopics.slice(0, 3).forEach((wt, idx) => {
      const topicDef = topics.find((t) => t.id === wt.topicId)!;
      const potentialGain = Math.max(
        4,
        Math.round(((75 - wt.masteryScore) / 100) * (wt.weightPercentage * 1.4))
      );
      const practiceSlugMap: Record<string, string> = {
        "topic-num": "prac-topic-num",
        "topic-fdp": "prac-topic-fdp",
        "topic-ratio": "prac-topic-ratio",
        "topic-alg": "prac-topic-alg",
        "topic-geom": "prac-topic-geom",
        "topic-stat": "prac-topic-stat",
      };

      recommendations.push({
        id: `rec-topic-${wt.topicId}`,
        priorityRank: idx + 1,
        topicId: wt.topicId,
        topicCode: wt.topicCode,
        topicName: wt.topicName,
        actionType: "STUDY_AND_PRACTISE",
        headline: `Fix ${wt.domain} (${wt.topicCode}) — Currently ${wt.masteryScore}% Mastery`,
        reasonSummary:
          wt.commonErrors.length > 0
            ? `Targeted priority: Worth ${wt.weightPercentage}% of the Foundation exam. Focus on fixing: ${wt.commonErrors.join(", ")}.`
            : `High-yield topic worth ${wt.weightPercentage}% of the Foundation syllabus. Review the worked examples and complete the step-marked practice set.`,
        potentialMarkGain: potentialGain,
        ctaHref: `/topics/${wt.topicId}?practice=${practiceSlugMap[wt.topicId]}`,
        ctaLabel: topicDef.isFreeSample || entitlements.hasFullPack
          ? "Study Guide & Practise Topic"
          : "Unlock Grade 4 Pack to Practise",
        requiresEntitlement: topicDef.isFreeSample
          ? "DIAGNOSTIC_FREE"
          : "FULL_PACK",
      });
    });

    // Also recommend sitting Mock Exam Paper 1 if they haven't taken a full mock yet
    const hasCompletedMock = submittedAttempts.some(
      (a) => a.mode === "MOCK_EXAM"
    );
    if (!hasCompletedMock) {
      recommendations.push({
        id: "rec-sit-mock-1",
        priorityRank: recommendations.length + 1,
        topicId: "topic-num",
        topicCode: "1MA1/1F",
        topicName: "Full Mock Examination Paper 1F (Non-Calculator)",
        actionType: "SIT_MOCK_EXAM",
        headline: "Sit Mock Examination Paper 1F under timed exam conditions",
        reasonSummary:
          "Test your non-calculator accuracy and method-mark capture in our realistic Examination Simulator with the official Edexcel Formulae Sheet.",
        potentialMarkGain: 15,
        ctaHref: "/exam/mock-edexcel-p1-noncalc",
        ctaLabel: entitlements.hasFullPack
          ? "Launch Mock Paper 1F"
          : "Unlock Mock Exams (£39.99 Pack)",
        requiresEntitlement: "FULL_PACK",
      });
    }
  }

  return {
    studentId,
    overallReadinessScore,
    estimatedCurrentGrade:
      submittedAttempts.length === 0
        ? "Diagnostic Pending"
        : estimateFoundationGrade(overallReadinessScore),
    marksAwayFromGrade4,
    baselineDiagnosticScore,
    latestAssessmentScore,
    improvementDelta,
    nonCalculatorAccuracy:
      nonCalcMax > 0 ? Math.round((nonCalcEarned / nonCalcMax) * 100) : 0,
    calculatorAccuracy:
      calcMax > 0 ? Math.round((calcEarned / calcMax) * 100) : 0,
    methodMarkCaptureRate:
      totalMethodMax > 0
        ? Math.round((totalMethodEarned / totalMethodMax) * 100)
        : 0,
    totalQuestionsAttempted,
    totalPracticeMinutes: Math.max(1, Math.round(totalTimeSeconds / 60)),
    topicMastery,
    recommendations,
  };
}
