"use client";

import React, { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  Flag,
  Lock,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { DeclarativeDiagram } from "@/components/diagrams/DeclarativeDiagram";
import { FormulaSheetModal } from "@/components/exam/FormulaSheetModal";
import { MathKeypad } from "@/components/math/MathKeypad";
import { MathText } from "@/components/math/MathText";
import { usePlatform } from "@/components/providers/PlatformProvider";
import { AssessmentAttempt } from "@/types/platform";

export default function ExaminationSimulatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl p-8 text-center text-sm text-slate-600">
          Loading examination simulator...
        </div>
      }
    >
      <ExaminationSimulatorInner slug={slug} />
    </Suspense>
  );
}

function ExaminationSimulatorInner({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const reviewAttemptId = searchParams.get("review");

  const {
    specifications,
    questions,
    assessmentTemplates,
    attempts,
    entitlements,
    openCheckout,
    submitAssessment,
  } = usePlatform();

  const template =
    assessmentTemplates.find((t) => t.id === slug || t.slug === slug) ||
    assessmentTemplates[0];

  const spec =
    specifications.find((s) => s.id === template?.specId) || specifications[0];

  const examQuestions = (template?.questionIds || [])
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  // Check if viewing an existing submitted attempt
  const existingReviewAttempt = reviewAttemptId
    ? attempts.find((a) => a.id === reviewAttemptId)
    : undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [stepAnswers, setStepAnswers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [flaggedMap, setFlaggedMap] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<{
    questionId: string;
    stepId?: string;
  } | null>(null);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [showPreSubmitReview, setShowPreSubmitReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<
    AssessmentAttempt | undefined
  >(existingReviewAttempt);

  // Countdown timer
  const totalSecondsAllocated = (template?.timeLimitMinutes || 30) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(
    totalSecondsAllocated
  );

  useEffect(() => {
    if (existingReviewAttempt) {
      setSubmittedAttempt(existingReviewAttempt);
    }
  }, [existingReviewAttempt]);

  useEffect(() => {
    setSecondsRemaining((template?.timeLimitMinutes || 30) * 60);
  }, [template?.id, template?.timeLimitMinutes]);

  useEffect(() => {
    if (submittedAttempt) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submittedAttempt]);

  if (!template) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-sm text-slate-600">
        Loading examination simulator...
      </div>
    );
  }

  // Entitlement check
  const isLocked =
    (template.requiresEntitlement === "FULL_PACK" &&
      !entitlements.hasFullPack) ||
    (template.requiresEntitlement === "WEEKLY_MEMBERSHIP" &&
      !entitlements.hasWeeklyMembership &&
      !entitlements.hasFullPack);

  if (isLocked && !submittedAttempt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {template.title} Requires an Active Pack
        </h1>
        <p className="text-sm text-slate-600">
          Unlock the GCSE Maths Grade 4 Preparation Pack (£39.99) to sit all 3
          full-length Mock Examinations and topic assessments under timed exam
          conditions.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span>Unlock GCSE Maths Grade 4 Pack (£39.99)</span>
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Student Hub
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentIndex] || examQuestions[0];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const handleKeypadInsert = (token: string) => {
    const targetQId = focusedField?.questionId || currentQuestion?.id;
    if (!targetQId) return;
    if (focusedField?.stepId) {
      const sId = focusedField.stepId;
      setStepAnswers((prev) => ({
        ...prev,
        [targetQId]: {
          ...(prev[targetQId] || {}),
          [sId]: ((prev[targetQId] || {})[sId] || "") + token,
        },
      }));
    } else {
      setFinalAnswers((prev) => ({
        ...prev,
        [targetQId]: (prev[targetQId] || "") + token,
      }));
    }
  };

  const handleKeypadClear = () => {
    const targetQId = focusedField?.questionId || currentQuestion?.id;
    if (!targetQId) return;
    if (focusedField?.stepId) {
      const sId = focusedField.stepId;
      setStepAnswers((prev) => ({
        ...prev,
        [targetQId]: {
          ...(prev[targetQId] || {}),
          [sId]: "",
        },
      }));
    } else {
      setFinalAnswers((prev) => ({
        ...prev,
        [targetQId]: "",
      }));
    }
  };

  const handleSubmitExam = async (
    customFinal?: Record<string, string>,
    customSteps?: Record<string, Record<string, string>>
  ) => {
    setSubmitting(true);
    try {
      const finalsToUse = customFinal || finalAnswers;
      const stepsToUse = customSteps || stepAnswers;

      const payload: Record<
        string,
        {
          studentFinalAnswer: string;
          studentSteps: Record<string, string>;
          isFlagged: boolean;
        }
      > = {};

      for (const q of examQuestions) {
        payload[q.id] = {
          studentFinalAnswer: finalsToUse[q.id] || "",
          studentSteps: stepsToUse[q.id] || {},
          isFlagged: Boolean(flaggedMap[q.id]),
        };
      }

      const elapsed = Math.max(
        180,
        totalSecondsAllocated - secondsRemaining
      );
      const attempt = await submitAssessment({
        templateId: template.id,
        timeSpentSeconds: elapsed,
        responses: payload,
      });
      if (attempt) {
        setSubmittedAttempt(attempt);
        setShowPreSubmitReview(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to auto-fill realistic exam answers (~68% Grade 4 Pass on Mock Exams, or ~52% on Diagnostic)
  const handleQuickAutoFillAndSubmit = async () => {
    const autoFinals: Record<string, string> = {};
    const autoSteps: Record<string, Record<string, string>> = {};

    examQuestions.forEach((q, idx) => {
      // Answer ~70% right, ~20% with partial M1 step credit, ~10% with common misconception
      if (idx % 4 !== 2) {
        autoFinals[q.id] = q.markScheme.acceptedFinalAnswers[0];
        if (q.markScheme.workingSteps[0]) {
          autoSteps[q.id] = {
            [q.markScheme.workingSteps[0].id]:
              q.markScheme.workingSteps[0].acceptedAnswers[0],
          };
        }
      } else if (q.markScheme.workingSteps.length > 0) {
        // Wrong final answer, but valid M1 step!
        autoFinals[q.id] =
          q.markScheme.misconceptions[0]?.wrongAnswer || "999";
        autoSteps[q.id] = {
          [q.markScheme.workingSteps[0].id]:
            q.markScheme.workingSteps[0].acceptedAnswers[0],
        };
      } else {
        autoFinals[q.id] =
          q.markScheme.misconceptions[0]?.wrongAnswer || "0";
      }
    });

    setFinalAnswers(autoFinals);
    setStepAnswers(autoSteps);
    await handleSubmitExam(autoFinals, autoSteps);
  };

  // ============================================================================
  // POST-SUBMISSION PERFORMANCE & REMEDIATION REPORT VIEW
  // ============================================================================
  if (submittedAttempt) {
    const passedGrade4 = submittedAttempt.percentageScore >= 62;

    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
        {/* Top Score Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Official Examination Performance Report
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {submittedAttempt.templateTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Indicative assessment result · Graded with deterministic M1/A1
                step evaluation
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedAttempt(undefined);
                  setCurrentIndex(0);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Retake Paper
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <span>Go to Updated Student Hub</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 4 Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-500">
                Total Marks Achieved
              </div>
              <div className="mt-1 text-3xl font-extrabold text-slate-900">
                {submittedAttempt.earnedMarks} / {submittedAttempt.totalMarks}
              </div>
              <div className="mt-1 text-xs font-bold text-sky-700">
                {submittedAttempt.percentageScore}% (Grade 4 Pass = 62%)
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-500">
                Indicative GCSE Grade
              </div>
              <div
                className={`mt-1 text-xl font-extrabold ${
                  passedGrade4 ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {submittedAttempt.estimatedGrade}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {passedGrade4
                  ? "Above Grade 4 standard pass benchmark"
                  : `${Math.max(
                      1,
                      template.passMarkGrade4 - submittedAttempt.earnedMarks
                    )} marks needed on this paper for Grade 4`}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-500">
                Non-Calculator vs Calculator
              </div>
              <div className="mt-1 text-lg font-extrabold text-slate-900">
                {submittedAttempt.nonCalcScore
                  ? `Non-Calc: ${submittedAttempt.nonCalcScore.percentage}%`
                  : "—"}{" "}
                {submittedAttempt.calcScore
                  ? `· Calc: ${submittedAttempt.calcScore.percentage}%`
                  : ""}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Accuracy by paper policy
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-500">
                Method Marks (M1) Earned
              </div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-700">
                {Object.values(submittedAttempt.responses).reduce(
                  (acc, r) => acc + (r.grading?.methodMarksAwarded || 0),
                  0
                )}{" "}
                marks
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Awarded from intermediate working
              </div>
            </div>
          </div>

          {/* Topic Breakdown Bars */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Performance by Syllabus Topic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {submittedAttempt.topicBreakdown.map((tb) => (
                <div
                  key={tb.topicId}
                  className="rounded-xl border border-slate-200 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">
                      {tb.topicCode} · {tb.topicName}
                    </span>
                    <span
                      className={
                        tb.percentage >= 65
                          ? "text-emerald-700"
                          : tb.percentage >= 45
                          ? "text-amber-700"
                          : "text-rose-700"
                      }
                    >
                      {tb.earnedMarks}/{tb.maxMarks} ({tb.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${
                        tb.percentage >= 65
                          ? "bg-emerald-500"
                          : tb.percentage >= 45
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.max(5, tb.percentage)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[11px] text-slate-500">
                      {tb.status.replace(/_/g, " ")}
                    </span>
                    <Link
                      href={`/topics/${tb.topicId}`}
                      className="text-[11px] font-bold text-sky-700 hover:underline"
                    >
                      Remediate Topic →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commercial Upsell Banner if on Free Diagnostic Tier */}
        {!entitlements.hasFullPack && (
          <div className="rounded-2xl border-2 border-sky-600 bg-slate-900 p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Diagnostic Complete · Next Step
              </div>
              <h2 className="text-lg font-extrabold">
                Unlock Your Personalised Remediation Plan & All 3 Full Mock Examinations (£39.99)
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                We identified your exact topic gaps above. Unlock the GCSE Maths Grade 4 Preparation Pack to practise every weak topic and sit Paper 1F, Paper 2F, and Paper 3F.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-xs font-extrabold text-slate-950 hover:bg-sky-400"
            >
              <Sparkles className="h-4 w-4" />
              <span>Unlock Full Grade 4 Pack (£39.99)</span>
            </button>
          </div>
        )}

        {/* Question-by-Question Mark Scheme & Worked Solution Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Question-by-Question Mark Breakdown & Worked Solutions
          </h2>

          {examQuestions.map((q, idx) => {
            const resp = submittedAttempt.responses[q.id];
            const grading = resp?.grading;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                      Q{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {q.subtopicName}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {q.calculatorPolicy === "NON_CALCULATOR"
                        ? "Non-Calc"
                        : "Calc Allowed"}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                      grading?.isFullyCorrect
                        ? "bg-emerald-100 text-emerald-800"
                        : grading?.isPartiallyCorrect
                        ? "bg-amber-100 text-amber-900"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {grading?.markCodeSummary || `0/${q.totalMarks}`}
                  </span>
                </div>

                <div className="text-sm font-medium text-slate-900">
                  <MathText text={q.stemMarkdown} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
                    <div className="font-bold text-slate-600">
                      Your Submitted Answer & Working:
                    </div>
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      Final: {resp?.studentFinalAnswer || "(Blank)"}
                    </div>
                    {resp?.studentSteps &&
                      Object.keys(resp.studentSteps).length > 0 && (
                        <div className="text-slate-600 font-mono">
                          Working Steps:{" "}
                          {Object.values(resp.studentSteps)
                            .filter(Boolean)
                            .join(" | ") || "None"}
                        </div>
                      )}
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-1">
                    <div className="font-bold text-emerald-900">
                      Mark Scheme Expected Answer:
                    </div>
                    <div className="font-mono font-bold text-emerald-950 text-sm">
                      {q.markScheme.acceptedFinalAnswers.join(" or ")}{" "}
                      {q.answerUnit || ""}
                    </div>
                    <div className="text-emerald-800">
                      {grading?.overallFeedback}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900">
                    Step-by-Step Examiner Worked Solution:
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    <MathText text={q.workedSolutionMarkdown} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================================
  // ACTIVE DISTRACTION-FREE EXAMINATION SIMULATOR VIEW
  // ============================================================================
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-5">
      {/* Top Examination Control Header */}
      <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-4 sm:p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2.5 py-0.5 text-[11px] font-extrabold uppercase ${
                  template.calculatorPolicy === "NON_CALCULATOR"
                    ? "bg-rose-500 text-white"
                    : "bg-sky-500 text-slate-950"
                }`}
              >
                {template.calculatorPolicy === "NON_CALCULATOR"
                  ? "Strictly Non-Calculator"
                  : template.calculatorPolicy === "CALCULATOR_ALLOWED"
                  ? "Calculator Allowed"
                  : "Mixed Policy (Check Question Badge)"}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {spec?.name} · {template.totalMarks} Total Marks
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold">
              {template.title}
            </h1>
          </div>

          {/* Right Controls: Formula Sheet, Demo Auto-Fill, Timer & Submit */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setFormulaOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-sky-300 hover:bg-slate-700"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Formulae Sheet</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAutoFillAndSubmit}
              disabled={submitting}
              title="Populate realistic exam answers and submit immediately to inspect the Performance Report"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Demo: Auto-Fill & Grade Paper</span>
            </button>

            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 font-mono text-sm font-extrabold text-white">
              <Clock className="h-4 w-4 text-sky-400" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowPreSubmitReview(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-sky-400"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Finish & Submit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pre-Submission Review Overlay if Clicked Finish */}
      {showPreSubmitReview && (
        <div className="rounded-2xl border-2 border-sky-600 bg-white p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Review Your Examination Paper Before Final Submission
              </h2>
              <p className="text-xs text-slate-600">
                You have answered{" "}
                {
                  examQuestions.filter(
                    (q) => (finalAnswers[q.id] || "").trim().length > 0
                  ).length
                }{" "}
                of {examQuestions.length} questions (
                {
                  examQuestions.filter((q) => flaggedMap[q.id]).length
                }{" "}
                flagged for review).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreSubmitReview(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Continue Working
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmitExam()}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {submitting
                    ? "Marking Paper..."
                    : "Confirm & Mark Paper Now"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Simulator Grid: Question Canvas (Left 8 cols) + Navigation Palette (Right 4 cols) */}
      {currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              {/* Question Number, Calculator Policy & Flag Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm font-extrabold text-white">
                    Question {currentIndex + 1} of {examQuestions.length}
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                      currentQuestion.calculatorPolicy === "NON_CALCULATOR"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {currentQuestion.calculatorPolicy === "NON_CALCULATOR"
                      ? "Non-Calculator"
                      : "Calculator Allowed"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentQuestion.subtopicName} ({currentQuestion.assessmentObjective})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-800">
                    [{currentQuestion.totalMarks} marks]
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFlaggedMap((prev) => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id],
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors ${
                      flaggedMap[currentQuestion.id]
                        ? "border-amber-400 bg-amber-100 text-amber-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>
                      {flaggedMap[currentQuestion.id]
                        ? "Flagged"
                        : "Flag for Review"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Question Stem */}
              <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed py-1">
                <MathText text={currentQuestion.stemMarkdown} />
              </div>

              {/* Declarative Diagram if present */}
              {currentQuestion.diagram && (
                <DeclarativeDiagram spec={currentQuestion.diagram} />
              )}

              {/* Working Steps Box (Method Marks M1) */}
              {currentQuestion.markScheme.workingSteps.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Working Space — Intermediate Method Checkpoints (Earns M1
                      Method Marks)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Full marks awarded automatically if final answer is right
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {currentQuestion.markScheme.workingSteps.map((st) => (
                      <div key={st.id} className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700">
                          {st.promptLabel}{" "}
                          <span className="font-bold text-sky-700">
                            [{st.markCode} · {st.marks} mark]
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Write working step here..."
                          value={
                            (stepAnswers[currentQuestion.id] || {})[st.id] || ""
                          }
                          onFocus={() =>
                            setFocusedField({
                              questionId: currentQuestion.id,
                              stepId: st.id,
                            })
                          }
                          onChange={(e) =>
                            setStepAnswers((prev) => ({
                              ...prev,
                              [currentQuestion.id]: {
                                ...(prev[currentQuestion.id] || {}),
                                [st.id]: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:border-sky-600 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Answer Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Final Answer Line [{currentQuestion.markScheme.finalMarkCode}]
                </label>
                <div className="flex items-center gap-2 max-w-md">
                  {currentQuestion.answerPrefix && (
                    <span className="text-base font-bold font-mono text-slate-800">
                      {currentQuestion.answerPrefix}
                    </span>
                  )}
                  <input
                    type="text"
                    placeholder="Enter final answer..."
                    value={finalAnswers[currentQuestion.id] || ""}
                    onFocus={() =>
                      setFocusedField({ questionId: currentQuestion.id })
                    }
                    onChange={(e) =>
                      setFinalAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base font-mono font-bold text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                  {currentQuestion.answerUnit && (
                    <span className="text-base font-bold text-slate-800">
                      {currentQuestion.answerUnit}
                    </span>
                  )}
                </div>
              </div>

              {/* GCSE Math Keypad */}
              <MathKeypad
                onInsert={handleKeypadInsert}
                onClear={handleKeypadClear}
              />

              {/* Previous / Next Footer Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous Question</span>
                </button>

                {currentIndex < examQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((i) =>
                        Math.min(examQuestions.length - 1, i + 1)
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <span>Save & Next Question</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPreSubmitReview(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Review & Submit Paper</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Navigation Palette */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Question Navigation Palette
                </h2>
                <span className="text-xs text-slate-500">
                  {
                    examQuestions.filter(
                      (q) => (finalAnswers[q.id] || "").trim().length > 0
                    ).length
                  }
                  /{examQuestions.length} Answered
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {examQuestions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered =
                    (finalAnswers[q.id] || "").trim().length > 0;
                  const isFlagged = Boolean(flaggedMap[q.id]);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative flex h-10 items-center justify-center rounded-xl text-xs font-extrabold border transition-all ${
                        isCurrent
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : isFlagged
                          ? "border-amber-400 bg-amber-100 text-amber-900"
                          : isAnswered
                          ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-300" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-amber-100 border border-amber-400" />
                  <span>Flagged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-slate-900" />
                  <span>Current</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Switch Assessment / Mock Paper
              </h3>
              <div className="space-y-1.5">
                {assessmentTemplates.slice(0, 6).map((t) => (
                  <Link
                    key={t.id}
                    href={`/exam/${t.id}`}
                    className={`block rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      t.id === template.id
                        ? "bg-sky-50 text-sky-900 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official GCSE Formulae Sheet Modal */}
      <FormulaSheetModal
        isOpen={formulaOpen}
        onClose={() => setFormulaOpen(false)}
        boardName={spec?.name || "Edexcel GCSE Mathematics (1MA1)"}
        formulae={spec?.formulaSheet || []}
      />
    </div>
  );
}
