"use client";

import React, { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flag,
  Lock,
  Sparkles,
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
        <div className="mx-auto max-w-4xl p-12 text-center text-sm text-[#6E6B64]">
          Preparing examination paper...
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

  const existingReviewAttempt = reviewAttemptId
    ? attempts.find((a) => a.id === reviewAttemptId)
    : undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [stepAnswers, setStepAnswers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [flaggedMap, setFlaggedMap] = useState<Record<string, boolean>>({});
  const [showWorkingSteps, setShowWorkingSteps] = useState(true);
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
      <div className="mx-auto max-w-4xl p-12 text-center text-sm text-[#6E6B64]">
        Loading examination paper...
      </div>
    );
  }

  const isLocked =
    (template.requiresEntitlement === "FULL_PACK" &&
      !entitlements.hasFullPack) ||
    (template.requiresEntitlement === "WEEKLY_MEMBERSHIP" &&
      !entitlements.hasWeeklyMembership &&
      !entitlements.hasFullPack);

  if (isLocked && !submittedAttempt) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E8E4DB] bg-white text-[#0F4C3A]">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#141413]">
          {template.title}
        </h1>
        <p className="text-base text-[#57554F] leading-relaxed">
          This examination paper is included in the GCSE Maths Grade 4
          Preparation Pack (£39.99). Unlock instant access to all three
          full-length Mock Examinations and complete topic banks.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-7 py-3.5 text-xs font-semibold text-white hover:bg-[#0B382B]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Unlock Grade 4 Pack · £39.99</span>
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border border-[#D5CFC2] bg-white px-6 py-3.5 text-xs font-semibold text-[#3D3B37] hover:border-[#141413]"
          >
            Return to Student Hub
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

      const elapsed = Math.max(180, totalSecondsAllocated - secondsRemaining);
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

  const handleQuickAutoFillAndSubmit = async () => {
    const autoFinals: Record<string, string> = {};
    const autoSteps: Record<string, Record<string, string>> = {};

    examQuestions.forEach((q, idx) => {
      if (idx % 4 !== 2) {
        autoFinals[q.id] = q.markScheme.acceptedFinalAnswers[0];
        if (q.markScheme.workingSteps[0]) {
          autoSteps[q.id] = {
            [q.markScheme.workingSteps[0].id]:
              q.markScheme.workingSteps[0].acceptedAnswers[0],
          };
        }
      } else if (q.markScheme.workingSteps.length > 0) {
        autoFinals[q.id] =
          q.markScheme.misconceptions[0]?.wrongAnswer || "999";
        autoSteps[q.id] = {
          [q.markScheme.workingSteps[0].id]:
            q.markScheme.workingSteps[0].acceptedAnswers[0],
        };
      } else {
        autoFinals[q.id] = q.markScheme.misconceptions[0]?.wrongAnswer || "0";
      }
    });

    setFinalAnswers(autoFinals);
    setStepAnswers(autoSteps);
    await handleSubmitExam(autoFinals, autoSteps);
  };

  // ============================================================================
  // POST-SUBMISSION PERFORMANCE & REMEDIATION REPORT (CALM EDITORIAL LIGHT VIEW)
  // ============================================================================
  if (submittedAttempt) {
    const passedGrade4 = submittedAttempt.percentageScore >= 62;

    return (
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16 space-y-12">
        <section className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E8E4DB] pb-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
                Examination Performance Report
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
                {submittedAttempt.templateTitle}
              </h1>
              <p className="text-sm text-[#6E6B64]">
                Indicative assessment result · Evaluated with symbolic M1/A1
                step marking
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSubmittedAttempt(undefined);
                  setCurrentIndex(0);
                }}
                className="rounded-full border border-[#D5CFC2] bg-white px-5 py-2.5 text-xs font-semibold text-[#3D3B37] hover:border-[#141413]"
              >
                Retake Paper
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0B382B]"
              >
                <span>Return to Student Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 4 Calm Score Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <div className="text-xs text-[#6E6B64]">Total Marks</div>
              <div className="font-serif text-3xl font-medium text-[#141413] mt-1">
                {submittedAttempt.earnedMarks} / {submittedAttempt.totalMarks}
              </div>
              <div className="text-xs text-[#0F4C3A] font-medium mt-1">
                {submittedAttempt.percentageScore}% (Pass = 62%)
              </div>
            </div>

            <div>
              <div className="text-xs text-[#6E6B64]">Indicative Grade</div>
              <div className="font-serif text-xl font-medium text-[#141413] mt-1">
                {submittedAttempt.estimatedGrade}
              </div>
              <div className="text-xs text-[#6E6B64] mt-1">
                {passedGrade4
                  ? "Above Grade 4 benchmark"
                  : "Continue targeted practice"}
              </div>
            </div>

            <div>
              <div className="text-xs text-[#6E6B64]">Method Credit (M1)</div>
              <div className="font-serif text-3xl font-medium text-[#0F4C3A] mt-1">
                {Object.values(submittedAttempt.responses).reduce(
                  (acc, r) => acc + (r.grading?.methodMarksAwarded || 0),
                  0
                )}{" "}
                marks
              </div>
              <div className="text-xs text-[#6E6B64] mt-1">
                From intermediate working
              </div>
            </div>

            <div>
              <div className="text-xs text-[#6E6B64]">Paper Breakdown</div>
              <div className="font-serif text-lg font-medium text-[#141413] mt-1">
                {submittedAttempt.nonCalcScore
                  ? `Non-Calc ${submittedAttempt.nonCalcScore.percentage}%`
                  : "—"}
                {submittedAttempt.calcScore
                  ? ` · Calc ${submittedAttempt.calcScore.percentage}%`
                  : ""}
              </div>
            </div>
          </div>

          {/* Syllabus Domain Breakdown */}
          <div className="border-t border-[#E8E4DB] pt-8 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6E6B64]">
              Performance by Syllabus Domain
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {submittedAttempt.topicBreakdown.map((tb) => (
                <div
                  key={tb.topicId}
                  className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#141413]">
                      {tb.topicCode} · {tb.topicName}
                    </span>
                    <span className="text-[#0F4C3A]">{tb.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#E8E4DB] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0F4C3A]"
                      style={{ width: `${Math.max(4, tb.percentage)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#6E6B64]">
                    <span>
                      {tb.earnedMarks}/{tb.maxMarks} marks
                    </span>
                    <Link
                      href={`/topics/${tb.topicId}`}
                      className="font-semibold text-[#0F4C3A] hover:underline"
                    >
                      Study Module →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Question-by-Question Examiner Solutions */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-medium text-[#141413]">
            Question-by-Question Examiner Review
          </h2>

          <div className="space-y-6">
            {examQuestions.map((q, idx) => {
              const resp = submittedAttempt.responses[q.id];
              const grading = resp?.grading;

              return (
                <div
                  key={q.id}
                  className="rounded-3xl border border-[#E8E4DB] bg-white p-7 sm:p-8 space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4DB] pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-[#6E6B64]">
                        QUESTION 0{idx + 1}
                      </span>
                      <span className="font-serif text-lg font-medium text-[#141413]">
                        {q.subtopicName}
                      </span>
                    </div>
                    <span className="rounded-full bg-[#E6F0EC] px-3.5 py-1 text-xs font-mono font-semibold text-[#0F4C3A]">
                      {grading?.markCodeSummary || `0/${q.totalMarks}`}
                    </span>
                  </div>

                  <div className="text-base text-[#141413]">
                    <MathText text={q.stemMarkdown} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl bg-[#FAF9F5] p-4 space-y-1">
                      <div className="text-xs text-[#6E6B64]">
                        Your Response
                      </div>
                      <div className="font-mono font-semibold text-[#141413]">
                        {resp?.studentFinalAnswer || "(No answer entered)"}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#F2F7F5] p-4 space-y-1">
                      <div className="text-xs text-[#0F4C3A]">
                        Expected Answer & Feedback
                      </div>
                      <div className="font-mono font-semibold text-[#141413]">
                        {q.markScheme.acceptedFinalAnswers.join(" or ")}{" "}
                        {q.answerUnit || ""}
                      </div>
                      <div className="text-xs text-[#3D3B37]">
                        {grading?.overallFeedback}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E8E4DB] p-5 text-sm space-y-1.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#6E6B64]">
                      Examiner Worked Solution
                    </div>
                    <div className="text-[#3D3B37] leading-relaxed">
                      <MathText text={q.workedSolutionMarkdown} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // ============================================================================
  // ACTIVE EXAMINATION ROOM (SERENE LIGHT PAPER VIEW)
  // ============================================================================
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14 space-y-8">
      {/* Quiet Light-Mode Exam Room Header */}
      <div className="rounded-3xl border border-[#E8E4DB] bg-white p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#0F4C3A]">
              {template.calculatorPolicy === "NON_CALCULATOR"
                ? "Non-Calculator Examination"
                : template.calculatorPolicy === "CALCULATOR_ALLOWED"
                ? "Calculator Allowed"
                : "Diagnostic Assessment"}
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#141413] mt-0.5">
              {template.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setFormulaOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-2 text-xs font-medium text-[#3D3B37] hover:border-[#141413]"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#0F4C3A]" />
              <span>Formulae Sheet</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAutoFillAndSubmit}
              disabled={submitting}
              className="rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-2 text-xs font-medium text-[#6E6B64] hover:text-[#141413]"
            >
              Auto-Fill Sample
            </button>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F2EC] px-4 py-2 font-mono text-xs font-semibold text-[#141413]">
              <Clock className="h-3.5 w-3.5 text-[#0F4C3A]" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowPreSubmitReview(true)}
              className="rounded-full bg-[#0F4C3A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0B382B]"
            >
              Submit Paper
            </button>
          </div>
        </div>

        {/* Subtle Horizontal Question Number Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-[#E8E4DB]">
          {examQuestions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = (finalAnswers[q.id] || "").trim().length > 0;
            const isFlagged = Boolean(flaggedMap[q.id]);

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-[#0F4C3A] text-white font-semibold"
                    : isFlagged
                    ? "bg-amber-100 text-amber-900"
                    : isAnswered
                    ? "bg-[#E6F0EC] text-[#0F4C3A]"
                    : "bg-[#FAF9F5] text-[#6E6B64] hover:bg-[#F4F2EC]"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pre-Submission Confirmation Banner */}
      {showPreSubmitReview && (
        <div className="rounded-3xl border border-[#0F4C3A] bg-white p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#141413]">
              Ready to submit your examination paper?
            </h2>
            <p className="text-sm text-[#57554F] mt-0.5">
              You have answered{" "}
              {
                examQuestions.filter(
                  (q) => (finalAnswers[q.id] || "").trim().length > 0
                ).length
              }{" "}
              of {examQuestions.length} questions.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowPreSubmitReview(false)}
              className="rounded-full border border-[#D5CFC2] px-5 py-2.5 text-xs font-semibold text-[#3D3B37]"
            >
              Continue Working
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmitExam()}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0B382B]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{submitting ? "Grading..." : "Confirm & Mark Paper"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Centered Examination Sheet */}
      {currentQuestion && (
        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4DB] pb-5">
            <div className="space-y-0.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6E6B64]">
                Question {currentIndex + 1} of {examQuestions.length} ·{" "}
                {currentQuestion.calculatorPolicy === "NON_CALCULATOR"
                  ? "Non-Calculator"
                  : "Calculator Allowed"}
              </span>
              <h2 className="font-serif text-lg font-medium text-[#141413]">
                {currentQuestion.subtopicName}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-[#3D3B37]">
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
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium transition-colors ${
                  flaggedMap[currentQuestion.id]
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-[#E8E4DB] text-[#6E6B64] hover:text-[#141413]"
                }`}
              >
                <Flag className="h-3 w-3" />
                <span>
                  {flaggedMap[currentQuestion.id] ? "Flagged" : "Flag"}
                </span>
              </button>
            </div>
          </div>

          {/* Question Stem */}
          <div className="text-lg sm:text-xl text-[#141413] leading-relaxed py-2">
            <MathText text={currentQuestion.stemMarkdown} />
          </div>

          {currentQuestion.diagram && (
            <DeclarativeDiagram spec={currentQuestion.diagram} />
          )}

          {/* Collapsible Method Working Space */}
          {currentQuestion.markScheme.workingSteps.length > 0 && (
            <div className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-6 space-y-4">
              <button
                type="button"
                onClick={() => setShowWorkingSteps((prev) => !prev)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
                    Method Working Space (M1 Checkpoints)
                  </span>
                  <p className="text-xs text-[#6E6B64] mt-0.5">
                    Show your intermediate working steps for partial method
                    marks.
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[#6E6B64] transition-transform ${
                    showWorkingSteps ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showWorkingSteps && (
                <div className="space-y-3 pt-2">
                  {currentQuestion.markScheme.workingSteps.map((st) => (
                    <div key={st.id} className="space-y-1">
                      <label className="block text-xs font-medium text-[#3D3B37]">
                        {st.promptLabel}{" "}
                        <span className="font-mono text-[#0F4C3A]">
                          [{st.markCode}]
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Write working step..."
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
                        className="w-full rounded-xl border border-[#D5CFC2] bg-white px-4 py-2.5 text-sm font-mono text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Final Answer Input */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B64]">
              Final Answer [{currentQuestion.markScheme.finalMarkCode}]
            </label>
            <div className="flex items-center gap-3 max-w-md">
              {currentQuestion.answerPrefix && (
                <span className="text-base font-mono font-medium text-[#3D3B37]">
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
                className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF9F5] px-4 py-3.5 text-base font-mono font-medium text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
              />
              {currentQuestion.answerUnit && (
                <span className="text-base font-medium text-[#3D3B37]">
                  {currentQuestion.answerUnit}
                </span>
              )}
            </div>
          </div>

          <MathKeypad
            onInsert={handleKeypadInsert}
            onClear={handleKeypadClear}
          />

          {/* Previous / Next Footer */}
          <div className="flex items-center justify-between border-t border-[#E8E4DB] pt-6">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#57554F] hover:text-[#141413] disabled:opacity-30"
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
                className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-3 text-xs font-semibold text-white hover:bg-[#0B382B]"
              >
                <span>Next Question</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPreSubmitReview(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-7 py-3 text-xs font-semibold text-white hover:bg-[#0B382B]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Review & Submit Paper</span>
              </button>
            )}
          </div>
        </div>
      )}

      <FormulaSheetModal
        isOpen={formulaOpen}
        onClose={() => setFormulaOpen(false)}
        boardName={spec?.name || "Edexcel GCSE Mathematics (1MA1)"}
        formulae={spec?.formulaSheet || []}
      />
    </div>
  );
}
