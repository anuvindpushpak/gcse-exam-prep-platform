"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
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

  const currentTopic = topics.find((t) => t.id === topicId) || topics[0];
  const resource = learningResources.find(
    (lr) => lr.topicId === currentTopic?.id
  );
  const topicQuestions = questions.filter(
    (q) => q.topicId === currentTopic?.id && q.lifecycleStatus === "PUBLISHED"
  );
  const practiceTemplate = assessmentTemplates.find(
    (t) =>
      t.mode === "TOPIC_PRACTICE" &&
      t.questionIds.some((qId) => topicQuestions.some((tq) => tq.id === qId))
  );

  const isTopicUnlocked =
    Boolean(currentTopic?.isFreeSample) || entitlements.hasFullPack;

  // Interactive Practice State (One Question at a Time for Calm Focus)
  const [activeTab, setActiveTab] = useState<"LEARN" | "PRACTISE">("LEARN");
  const [qIndex, setQIndex] = useState(0);
  const [showWorkingSteps, setShowWorkingSteps] = useState(true);
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
      <div className="mx-auto max-w-4xl p-12 text-center text-sm text-[#6E6B64]">
        Loading syllabus module...
      </div>
    );
  }

  const activeQuestion = topicQuestions[qIndex] || topicQuestions[0];

  const handleCheckSingleQuestion = (q: QuestionItem) => {
    const res = gradeQuestionResponse(
      q,
      finalAnswers[q.id] || "",
      stepAnswers[q.id] || {}
    );
    setInstantResults((prev) => ({ ...prev, [q.id]: res }));
  };

  const handleKeypadInsert = (token: string) => {
    const targetQId = focusedField?.questionId || activeQuestion?.id;
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
    const targetQId = focusedField?.questionId || activeQuestion?.id;
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
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16 space-y-10">
      {/* Quiet Syllabus Domain Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8E4DB]">
        {topics.map((t, i) => {
          const active = t.id === currentTopic.id;
          const unlocked = t.isFreeSample || entitlements.hasFullPack;
          return (
            <Link
              key={t.id}
              href={`/topics/${t.id}`}
              onClick={() => setQIndex(0)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all ${
                active
                  ? "bg-[#0F4C3A] text-white font-semibold"
                  : "text-[#6E6B64] hover:bg-[#F4F2EC] hover:text-[#141413]"
              }`}
            >
              <span>
                0{i + 1} · {t.domain}
              </span>
              {!unlocked && <Lock className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}
      </div>

      {/* Editorial Module Header */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-[#0F4C3A]">
            Module {currentTopic.code} · {currentTopic.weightPercentage}% of
            Foundation Paper
          </div>

          {/* Segmented Control: Study Guide vs Focused Practice */}
          <div className="inline-flex rounded-full border border-[#E8E4DB] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("LEARN")}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                activeTab === "LEARN"
                  ? "bg-[#0F4C3A] text-white"
                  : "text-[#6E6B64] hover:text-[#141413]"
              }`}
            >
              Study Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("PRACTISE")}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                activeTab === "PRACTISE"
                  ? "bg-[#0F4C3A] text-white"
                  : "text-[#6E6B64] hover:text-[#141413]"
              }`}
            >
              Interactive Practice ({topicQuestions.length})
            </button>
          </div>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
            {currentTopic.name}
          </h1>
          <p className="text-base text-[#57554F] leading-relaxed">
            {currentTopic.description}
          </p>
        </div>
      </header>

      {/* TAB 1: DIGITAL TEXTBOOK STUDY GUIDE (Calm Single-Column Reading Flow) */}
      {activeTab === "LEARN" && resource && (
        <article className="space-y-12">
          {/* Core Principles & Rules */}
          <section className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-8">
            <div className="space-y-3 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
                01 · Core Principles
              </span>
              <p className="text-base text-[#3D3B37] leading-relaxed">
                {resource.summaryMarkdown}
              </p>
            </div>

            <div className="space-y-4 border-t border-[#E8E4DB] pt-8">
              {resource.keyRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-2xl bg-[#FAF9F5] p-5 text-sm sm:text-base text-[#141413]"
                >
                  <span className="font-serif text-lg font-medium text-[#0F4C3A] shrink-0">
                    0{idx + 1}
                  </span>
                  <MathText text={rule} className="leading-relaxed" />
                </div>
              ))}
            </div>
          </section>

          {/* Essential Formulae & Common Traps Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="rounded-3xl border border-[#E8E4DB] bg-white p-8 space-y-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
                02 · Essential Formulae
              </span>
              <div className="space-y-4">
                {resource.formulae.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-5 space-y-2"
                  >
                    <div className="text-xs font-semibold text-[#6E6B64]">
                      {f.label}
                    </div>
                    <div className="text-lg font-medium text-[#141413]">
                      <MathText text={`$${f.expression}$`} />
                    </div>
                    {f.note && (
                      <p className="text-xs text-[#6E6B64]">{f.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#E8E4DB] bg-white p-8 space-y-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                03 · Common Examination Traps
              </span>
              <div className="space-y-4">
                {resource.commonMistakes.map((cm, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-5 space-y-2 text-sm"
                  >
                    <div className="font-semibold text-[#141413]">
                      Avoid: {cm.trap}
                    </div>
                    <div className="text-[#0F4C3A]">
                      Instead: {cm.correction}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Examiner Worked Examples */}
          <section className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
                04 · Annotated Worked Examples
              </span>
              <h2 className="mt-2 font-serif text-2xl font-medium text-[#141413]">
                How Method (M1) and Accuracy (A1) Marks Are Awarded
              </h2>
            </div>

            <div className="space-y-8">
              {resource.workedExamples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-6 sm:p-8 space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4DB] pb-4">
                    <span className="font-serif text-lg font-medium text-[#141413]">
                      Worked Example {i + 1}: {ex.title}
                    </span>
                    <span className="text-xs font-mono text-[#6E6B64]">
                      {ex.calculatorPolicy === "NON_CALCULATOR"
                        ? "Non-Calculator"
                        : "Calculator Allowed"}{" "}
                      · {ex.marks} Marks
                    </span>
                  </div>

                  <div className="text-base font-medium text-[#141413]">
                    {ex.questionText}
                  </div>

                  <div className="space-y-3">
                    {ex.steps.map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-4 rounded-xl bg-white border border-[#E8E4DB] p-4 text-sm"
                      >
                        <span className="rounded-full bg-[#E6F0EC] px-3 py-0.5 text-xs font-mono font-semibold text-[#0F4C3A] shrink-0 mt-0.5">
                          {st.markCode}
                        </span>
                        <div className="space-y-1">
                          <div className="font-mono font-semibold text-[#141413]">
                            {st.working}
                          </div>
                          <div className="text-xs text-[#57554F]">
                            {st.explanation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab("PRACTISE")}
                className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#0B382B] transition-colors"
              >
                <span>Practise {currentTopic.domain} Questions</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </article>
      )}

      {/* TAB 2: FOCUSED SINGLE-QUESTION PRACTICE VIEW */}
      {activeTab === "PRACTISE" && activeQuestion && (
        <section className="space-y-8">
          {/* Question Stepper Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {topicQuestions.map((q, idx) => {
                const isCurrent = idx === qIndex;
                const graded = instantResults[q.id];
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQIndex(idx)}
                    className={`h-10 px-4 rounded-full text-xs font-semibold transition-all border ${
                      isCurrent
                        ? "border-[#0F4C3A] bg-[#0F4C3A] text-white"
                        : graded?.isFullyCorrect
                        ? "border-[#0F4C3A]/30 bg-[#E6F0EC] text-[#0F4C3A]"
                        : "border-[#E8E4DB] bg-white text-[#57554F] hover:border-[#141413]"
                    }`}
                  >
                    Question {idx + 1}
                  </button>
                );
              })}
            </div>

            {practiceTemplate && isTopicUnlocked && (
              <Link
                href={`/exam/${practiceTemplate.id}`}
                className="text-xs font-semibold text-[#0F4C3A] hover:underline"
              >
                Switch to Timed Exam Room →
              </Link>
            )}
          </div>

          {/* Focused Question Card */}
          <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4DB] pb-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#6E6B64]">
                  Question {qIndex + 1} of {topicQuestions.length} ·{" "}
                  {activeQuestion.calculatorPolicy === "NON_CALCULATOR"
                    ? "Non-Calculator"
                    : "Calculator Allowed"}
                </span>
                <h2 className="font-serif text-xl font-medium text-[#141413] mt-0.5">
                  {activeQuestion.subtopicName}
                </h2>
              </div>
              <span className="rounded-full bg-[#F4F2EC] px-3.5 py-1 text-xs font-semibold text-[#3D3B37]">
                {activeQuestion.totalMarks} marks · Grade{" "}
                {activeQuestion.targetGrade}
              </span>
            </div>

            {!isTopicUnlocked && qIndex > 0 ? (
              <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                <Lock className="h-6 w-6 text-[#6E6B64] mx-auto" />
                <h3 className="font-serif text-2xl font-medium text-[#141413]">
                  Unlock the Full Question Bank
                </h3>
                <p className="text-sm text-[#57554F]">
                  Question 1 is available as a free preview. Unlock the GCSE
                  Maths Grade 4 Preparation Pack (£39.99) to access all topic
                  questions and Mock Examinations.
                </p>
                <button
                  type="button"
                  onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-3 text-xs font-semibold text-white hover:bg-[#0B382B]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Unlock Grade 4 Pack · £39.99</span>
                </button>
              </div>
            ) : (
              <>
                <div className="text-lg text-[#141413] leading-relaxed">
                  <MathText text={activeQuestion.stemMarkdown} />
                </div>

                {activeQuestion.diagram && (
                  <DeclarativeDiagram spec={activeQuestion.diagram} />
                )}

                {/* Collapsible Working Steps (M1) */}
                {activeQuestion.markScheme.workingSteps.length > 0 && (
                  <div className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-6 space-y-4">
                    <button
                      type="button"
                      onClick={() => setShowWorkingSteps((prev) => !prev)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
                          Method Working Space (M1 Credit)
                        </span>
                        <p className="text-xs text-[#6E6B64] mt-0.5">
                          Enter intermediate steps to claim partial method marks
                          if your final answer slips.
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-[#6E6B64] transition-transform ${
                          showWorkingSteps ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showWorkingSteps && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {activeQuestion.markScheme.workingSteps.map((st) => (
                          <div key={st.id} className="space-y-1.5">
                            <label className="block text-xs font-medium text-[#3D3B37]">
                              {st.promptLabel}{" "}
                              <span className="font-mono text-[#0F4C3A]">
                                [{st.markCode}]
                              </span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter working..."
                              value={
                                (stepAnswers[activeQuestion.id] || {})[st.id] ||
                                ""
                              }
                              onFocus={() =>
                                setFocusedField({
                                  questionId: activeQuestion.id,
                                  stepId: st.id,
                                })
                              }
                              onChange={(e) =>
                                setStepAnswers((prev) => ({
                                  ...prev,
                                  [activeQuestion.id]: {
                                    ...(prev[activeQuestion.id] || {}),
                                    [st.id]: e.target.value,
                                  },
                                }))
                              }
                              className="w-full rounded-xl border border-[#D5CFC2] bg-white px-3.5 py-2.5 text-sm font-mono text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Final Answer & Check Action */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
                  <div className="flex-1 max-w-md space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B64]">
                      Final Answer [{activeQuestion.markScheme.finalMarkCode}]
                    </label>
                    <div className="flex items-center gap-2.5">
                      {activeQuestion.answerPrefix && (
                        <span className="text-base font-mono font-medium text-[#3D3B37]">
                          {activeQuestion.answerPrefix}
                        </span>
                      )}
                      <input
                        type="text"
                        placeholder="Type final answer..."
                        value={finalAnswers[activeQuestion.id] || ""}
                        onFocus={() =>
                          setFocusedField({ questionId: activeQuestion.id })
                        }
                        onChange={(e) =>
                          setFinalAnswers((prev) => ({
                            ...prev,
                            [activeQuestion.id]: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF9F5] px-4 py-3 text-base font-mono font-medium text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
                      />
                      {activeQuestion.answerUnit && (
                        <span className="text-base font-medium text-[#3D3B37]">
                          {activeQuestion.answerUnit}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCheckSingleQuestion(activeQuestion)}
                    className="rounded-full bg-[#0F4C3A] px-7 py-3.5 text-xs font-semibold text-white hover:bg-[#0B382B] transition-colors"
                  >
                    Mark My Answer
                  </button>
                </div>

                {/* Math Keypad */}
                <MathKeypad
                  onInsert={handleKeypadInsert}
                  onClear={handleKeypadClear}
                />

                {/* Instant Feedback Panel */}
                {instantResults[activeQuestion.id] && (
                  <div className="rounded-2xl border border-[#0F4C3A]/25 bg-[#F2F7F5] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg font-medium text-[#141413]">
                        Result:{" "}
                        {instantResults[activeQuestion.id].markCodeSummary}
                      </span>
                      <span className="text-xs font-mono text-[#0F4C3A]">
                        Method:{" "}
                        {instantResults[activeQuestion.id].methodMarksAwarded} ·
                        Accuracy:{" "}
                        {instantResults[activeQuestion.id].accuracyMarksAwarded}
                      </span>
                    </div>

                    <p className="text-sm text-[#3D3B37]">
                      {instantResults[activeQuestion.id].overallFeedback}
                    </p>

                    <div className="rounded-xl bg-white border border-[#E8E4DB] p-4 text-sm space-y-1.5">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#6E6B64]">
                        Worked Solution
                      </div>
                      <div className="text-[#141413] leading-relaxed">
                        <MathText
                          text={activeQuestion.workedSolutionMarkdown}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Question Navigation Footer */}
                <div className="flex items-center justify-between border-t border-[#E8E4DB] pt-6">
                  <button
                    type="button"
                    disabled={qIndex === 0}
                    onClick={() => setQIndex((i) => Math.max(0, i - 1))}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#57554F] hover:text-[#141413] disabled:opacity-30"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous Question</span>
                  </button>

                  {qIndex < topicQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setQIndex((i) =>
                          Math.min(topicQuestions.length - 1, i + 1)
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F4C3A] hover:underline"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={savingSession}
                      onClick={handleSavePracticeToProfile}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0B382B]"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {savingSession
                          ? "Saving..."
                          : sessionSavedBanner
                          ? "Saved to Profile ✓"
                          : "Save Topic Score to Profile"}
                      </span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
