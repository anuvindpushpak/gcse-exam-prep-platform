"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Lock,
  Sparkles,
} from "lucide-react";
import { DeclarativeDiagram } from "@/components/diagrams/DeclarativeDiagram";
import { MathKeypad } from "@/components/math/MathKeypad";
import { MathText } from "@/components/math/MathText";
import { usePlatform } from "@/components/providers/PlatformProvider";
import { gradeQuestionResponse } from "@/lib/engine/grader";
import { QuestionGradingResult, QuestionItem } from "@/types/platform";

export default function TopicLearningAndPracticePage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = use(params);
  const router = useRouter();
  const {
    topics,
    learningResources,
    questions,
    assessmentTemplates,
    entitlements,
    openCheckout,
    submitAssessment,
  } = usePlatform();

  const currentTopic =
    topics.find((t) => t.id === topicId) || topics[0];
  const resource = learningResources.find(
    (lr) => lr.topicId === currentTopic?.id
  );
  const topicQuestions = questions.filter(
    (q) =>
      q.topicId === currentTopic?.id && q.lifecycleStatus === "PUBLISHED"
  );
  const practiceTemplate = assessmentTemplates.find(
    (t) =>
      t.mode === "TOPIC_PRACTICE" &&
      t.questionIds.some((qId) =>
        topicQuestions.some((tq) => tq.id === qId)
      )
  );

  const isTopicUnlocked =
    Boolean(currentTopic?.isFreeSample) || entitlements.hasFullPack;

  // Interactive Practice State
  const [activeTab, setActiveTab] = useState<"LEARN" | "PRACTISE">("LEARN");
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [stepAnswers, setStepAnswers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [focusedField, setFocusedField] = useState<{
    questionId: string;
    stepId?: string;
  } | null>(null);
  const [instantResults, setInstantResults] = useState<
    Record<string, QuestionGradingResult>
  >({});
  const [savingSession, setSavingSession] = useState(false);
  const [sessionSavedBanner, setSessionSavedBanner] = useState(false);

  if (!currentTopic) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-sm text-slate-600">
        Loading topic module...
      </div>
    );
  }

  const handleCheckSingleQuestion = (q: QuestionItem) => {
    const res = gradeQuestionResponse(
      q,
      finalAnswers[q.id] || "",
      stepAnswers[q.id] || {}
    );
    setInstantResults((prev) => ({ ...prev, [q.id]: res }));
  };

  const handleKeypadInsert = (token: string) => {
    if (!focusedField) return;
    const { questionId, stepId } = focusedField;
    if (stepId) {
      setStepAnswers((prev) => ({
        ...prev,
        [questionId]: {
          ...(prev[questionId] || {}),
          [stepId]: ((prev[questionId] || {})[stepId] || "") + token,
        },
      }));
    } else {
      setFinalAnswers((prev) => ({
        ...prev,
        [questionId]: (prev[questionId] || "") + token,
      }));
    }
  };

  const handleKeypadClear = () => {
    if (!focusedField) return;
    const { questionId, stepId } = focusedField;
    if (stepId) {
      setStepAnswers((prev) => ({
        ...prev,
        [questionId]: {
          ...(prev[questionId] || {}),
          [stepId]: "",
        },
      }));
    } else {
      setFinalAnswers((prev) => ({
        ...prev,
        [questionId]: "",
      }));
    }
  };

  const handleSavePracticeToProfile = async () => {
    if (!practiceTemplate) return;
    setSavingSession(true);
    try {
      const payload: Record<
        string,
        { studentFinalAnswer: string; studentSteps: Record<string, string> }
      > = {};
      for (const q of topicQuestions) {
        payload[q.id] = {
          studentFinalAnswer: finalAnswers[q.id] || "",
          studentSteps: stepAnswers[q.id] || {},
        };
      }
      await submitAssessment({
        templateId: practiceTemplate.id,
        timeSpentSeconds: 360,
        responses: payload,
      });
      setSessionSavedBanner(true);
    } finally {
      setSavingSession(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Horizontal Syllabus Topic Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {topics.map((t) => {
          const active = t.id === currentTopic.id;
          const unlocked = t.isFreeSample || entitlements.hasFullPack;
          return (
            <Link
              key={t.id}
              href={`/topics/${t.id}`}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap border transition-all ${
                active
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span>
                {t.code} · {t.domain}
              </span>
              {t.isFreeSample && (
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
                  Free
                </span>
              )}
              {!unlocked && <Lock className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}
      </div>

      {/* Topic Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-sky-100 px-2.5 py-1 text-xs font-extrabold text-sky-900">
                {currentTopic.code} · {currentTopic.domain}
              </span>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                Exam Weighting: {currentTopic.weightPercentage}% of Foundation Paper
              </span>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                Target: Grade {currentTopic.gradeTarget}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {currentTopic.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              {currentTopic.description}
            </p>
          </div>

          {/* Mode Toggle: Study Guide vs Interactive Practice */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("LEARN")}
                className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  activeTab === "LEARN"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1. Concise Learning Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("PRACTISE")}
                className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  activeTab === "PRACTISE"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2. Interactive Step Practice ({topicQuestions.length} Qs)
              </button>
            </div>

            {practiceTemplate && isTopicUnlocked && (
              <Link
                href={`/exam/${practiceTemplate.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-sky-700"
              >
                <ClipboardCheck className="h-3.5 w-3.5" />
                <span>Timed Exam Mode</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Paywall Notice if Locked Topic */}
      {!isTopicUnlocked && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
              <Lock className="h-4 w-4 text-amber-700" />
              <span>Full Topic Question Bank Locked on Free Diagnostic Tier</span>
            </div>
            <p className="text-xs text-amber-800">
              You can preview the concise study summary below. Unlock the £39.99 GCSE Maths Grade 4 Preparation Pack to access all interactive step-marked practice sets and 3 full Mock Examinations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            <span>Unlock Grade 4 Pack (£39.99)</span>
          </button>
        </div>
      )}

      {/* TAB 1: CONCISE LEARNING RESOURCE (MODULE E) */}
      {activeTab === "LEARN" && resource && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Overview & Key Rules */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
                <BookOpen className="h-4 w-4" />
                <span>Core Concepts & Exam Rules</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {resource.summaryMarkdown}
              </p>

              <div className="space-y-2.5 pt-2">
                {resource.keyRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs sm:text-sm text-slate-800"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <MathText text={rule} className="leading-relaxed" />
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Worked Examples with M1 / A1 Marking */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Method-Mark Worked Examples
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  How Examiners Award M1 & A1 Marks
                </h2>
              </div>

              {resource.workedExamples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <span className="text-sm font-bold text-slate-900">
                      Example {i + 1}: {ex.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {ex.calculatorPolicy === "NON_CALCULATOR"
                          ? "Non-Calculator"
                          : "Calculator Allowed"}
                      </span>
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-900">
                        [{ex.marks} marks]
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white border border-slate-200 p-3.5 text-sm font-semibold text-slate-900">
                    {ex.questionText}
                  </div>

                  <div className="space-y-2">
                    {ex.steps.map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-3 rounded-lg bg-white border border-slate-200/80 p-3 text-xs"
                      >
                        <span
                          className={`rounded px-2 py-0.5 font-extrabold shrink-0 ${
                            st.markCode.startsWith("M")
                              ? "bg-sky-100 text-sky-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {st.markCode}
                        </span>
                        <div className="space-y-0.5">
                          <div className="font-mono font-bold text-slate-900 text-sm">
                            {st.working}
                          </div>
                          <div className="text-slate-600">{st.explanation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Key Formulae & Common Exam Traps */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                Essential Topic Formulae
              </h3>
              {resource.formulae.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5"
                >
                  <div className="text-xs font-bold text-slate-700">
                    {f.label}
                  </div>
                  <div className="rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900">
                    <MathText text={`$${f.expression}$`} />
                  </div>
                  {f.note && (
                    <p className="text-[11px] text-slate-500">{f.note}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-900">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <h3 className="text-sm font-extrabold">
                  Common Grade 4 Exam Traps
                </h3>
              </div>
              {resource.commonMistakes.map((cm, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white border border-rose-100 p-3.5 space-y-1.5 text-xs"
                >
                  <div className="font-bold text-rose-800">
                    ✗ Trap: {cm.trap}
                  </div>
                  <div className="text-emerald-900 font-medium">
                    ✓ Fix: {cm.correction}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-900 p-5 text-white space-y-3">
              <h3 className="text-sm font-bold">
                Ready to practise {currentTopic.domain}?
              </h3>
              <p className="text-xs text-slate-300">
                Test your understanding on step-marked exam questions with
                instant M1/A1 feedback.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("PRACTISE")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-sky-400"
              >
                <span>Start Interactive Topic Practice</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE STEP-MARKED PRACTICE ENGINE (MODULE G) */}
      {activeTab === "PRACTISE" && (
        <div className="space-y-6">
          <MathKeypad
            onInsert={handleKeypadInsert}
            onClear={handleKeypadClear}
          />

          <div className="space-y-5">
            {topicQuestions.map((q, idx) => {
              const lockedQuestion = !isTopicUnlocked && idx > 0;
              const result = instantResults[q.id];

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                        Question {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {q.subtopicName}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          q.calculatorPolicy === "NON_CALCULATOR"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {q.calculatorPolicy === "NON_CALCULATOR"
                          ? "Non-Calculator"
                          : "Calculator Allowed"}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-700">
                      [{q.totalMarks} marks · Grade {q.targetGrade}]
                    </span>
                  </div>

                  {lockedQuestion ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-6 text-center space-y-3">
                      <Lock className="h-6 w-6 text-amber-700 mx-auto" />
                      <div className="text-sm font-bold text-slate-900">
                        Unlock Question {idx + 1} ({q.subtopicName}) in the
                        Grade 4 Preparation Pack
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          openCheckout("prod-gcse-maths-grade4-pack")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                      >
                        <span>Unlock Full Pack (£39.99)</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-base font-medium text-slate-900 leading-relaxed">
                        <MathText text={q.stemMarkdown} />
                      </div>

                      {q.diagram && <DeclarativeDiagram spec={q.diagram} />}

                      {/* Scaffolded Intermediate Working Steps for M1 Method Marks */}
                      {q.markScheme.workingSteps.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">
                              Show Working Steps (Earns M1 Method Marks even if
                              final answer slips)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Optional if final answer is right
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.markScheme.workingSteps.map((st) => (
                              <div key={st.id} className="space-y-1">
                                <label className="block text-xs font-medium text-slate-600">
                                  {st.promptLabel}{" "}
                                  <span className="font-bold text-sky-700">
                                    [{st.markCode}]
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter working step..."
                                  value={(stepAnswers[q.id] || {})[st.id] || ""}
                                  onFocus={() =>
                                    setFocusedField({
                                      questionId: q.id,
                                      stepId: st.id,
                                    })
                                  }
                                  onChange={(e) =>
                                    setStepAnswers((prev) => ({
                                      ...prev,
                                      [q.id]: {
                                        ...(prev[q.id] || {}),
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

                      {/* Final Answer Box & Check Answer Button */}
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
                        <div className="flex-1 max-w-md">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Final Answer{" "}
                            <span className="text-emerald-700">
                              [{q.markScheme.finalMarkCode}]
                            </span>
                          </label>
                          <div className="flex items-center gap-2">
                            {q.answerPrefix && (
                              <span className="text-sm font-bold font-mono text-slate-700">
                                {q.answerPrefix}
                              </span>
                            )}
                            <input
                              type="text"
                              placeholder="Type final answer (e.g. 7/20 or 10x + 4)..."
                              value={finalAnswers[q.id] || ""}
                              onFocus={() =>
                                setFocusedField({ questionId: q.id })
                              }
                              onChange={(e) =>
                                setFinalAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: e.target.value,
                                }))
                              }
                              className="w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:border-sky-600 focus:outline-none"
                            />
                            {q.answerUnit && (
                              <span className="text-sm font-bold text-slate-700">
                                {q.answerUnit}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCheckSingleQuestion(q)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                        >
                          <Calculator className="h-4 w-4 text-sky-400" />
                          <span>Check Answer & Mark Steps</span>
                        </button>
                      </div>

                      {/* Instant Grading & Worked Solution Feedback */}
                      {result && (
                        <div
                          className={`mt-4 rounded-xl border p-4 space-y-3 ${
                            result.isFullyCorrect
                              ? "border-emerald-300 bg-emerald-50/70"
                              : result.isPartiallyCorrect
                              ? "border-amber-300 bg-amber-50/70"
                              : "border-rose-300 bg-rose-50/70"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                className={`h-4 w-4 ${
                                  result.isFullyCorrect
                                    ? "text-emerald-600"
                                    : result.isPartiallyCorrect
                                    ? "text-amber-600"
                                    : "text-rose-600"
                                }`}
                              />
                              <span className="text-sm font-extrabold text-slate-900">
                                {result.markCodeSummary}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-700">
                              Method: {result.methodMarksAwarded} · Accuracy:{" "}
                              {result.accuracyMarksAwarded}
                            </span>
                          </div>

                          <p className="text-xs text-slate-800 font-medium">
                            {result.overallFeedback}
                          </p>

                          <div className="rounded-lg bg-white/90 border border-slate-200 p-3 text-xs space-y-1">
                            <div className="font-bold text-slate-900">
                              Official Worked Solution:
                            </div>
                            <div className="text-slate-700 leading-relaxed">
                              <MathText text={q.workedSolutionMarkdown} />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Save Practice Set to Profile Footer */}
          {isTopicUnlocked && practiceTemplate && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Update Your Grade 4 Readiness Profile
                </h3>
                <p className="text-xs text-slate-600">
                  Record your answers for {currentTopic.domain} to update your
                  Topic Mastery score and Next-Best-Action pathway.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {sessionSavedBanner && (
                  <span className="text-xs font-bold text-emerald-700">
                    ✓ Saved to Profile!
                  </span>
                )}
                <button
                  type="button"
                  disabled={savingSession}
                  onClick={handleSavePracticeToProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {savingSession
                      ? "Saving..."
                      : "Save Practice Score to Profile"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Return to Student Hub
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
