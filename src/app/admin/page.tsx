"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Cpu,
  FileCheck2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { MathText } from "@/components/math/MathText";
import { usePlatform } from "@/components/providers/PlatformProvider";

export default function AdminAndAiGovernancePage() {
  const {
    specifications,
    topics,
    questions,
    products,
    generateAiDraft,
    updateQuestionStatus,
  } = usePlatform();

  const [selectedTopicId, setSelectedTopicId] = useState("topic-ratio");
  const [selectedPolicy, setSelectedPolicy] = useState<
    "NON_CALCULATOR" | "CALCULATOR_ALLOWED"
  >("NON_CALCULATOR");
  const [targetGrade, setTargetGrade] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleGenerateQuestion = async () => {
    setGenerating(true);
    try {
      await generateAiDraft({
        topicId: selectedTopicId,
        calculatorPolicy: selectedPolicy,
        targetGrade,
      });
    } finally {
      setGenerating(false);
    }
  };

  const pendingQuestions = questions.filter(
    (q) =>
      q.lifecycleStatus === "REVIEW_PENDING" ||
      q.lifecycleStatus === "AUTO_VALIDATED" ||
      q.lifecycleStatus === "AI_DRAFT"
  );
  const publishedQuestions = questions.filter(
    (q) => q.lifecycleStatus === "PUBLISHED"
  );

  const filteredQuestions =
    statusFilter === "ALL"
      ? questions
      : questions.filter((q) => q.lifecycleStatus === statusFilter);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 space-y-12">
      {/* Editorial Studio Header */}
      <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              Curator Studio · Content Engine & AI Governance
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#141413] tracking-tight">
              Curriculum & Symbolic Validation Studio
            </h1>
            <p className="text-sm sm:text-base text-[#575550] max-w-2xl leading-relaxed">
              Every candidate question passes through{" "}
              <strong className="font-semibold text-[#141413]">
                AI Draft → Deterministic Symbolic Verification → Human
                Specialist Approval
              </strong>{" "}
              before reaching students.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] px-5 py-3.5">
              <div className="text-xs text-[#78756E]">Published Bank</div>
              <div className="font-serif text-2xl font-semibold text-[#0F4C3A]">
                {publishedQuestions.length} Items
              </div>
            </div>
            <div className="rounded-2xl border border-[#E8E4DB] bg-[#FBF4EA] px-5 py-3.5">
              <div className="text-xs text-[#9A5B13]">Awaiting Review</div>
              <div className="font-serif text-2xl font-semibold text-[#9A5B13]">
                {pendingQuestions.length} Items
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AI Question Generator + Symbolic Validator */}
      <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E4DB] pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              AI-Assisted Authoring Pipeline
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#141413] mt-1">
              Synthesise & Symbolically Verify Question Candidate
            </h2>
          </div>
          <span className="rounded-full bg-[#FBF4EA] px-3.5 py-1 text-xs font-semibold text-[#9A5B13]">
            Enters Specialist Review Queue
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#575550] mb-2">
              Syllabus Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-3 text-xs font-medium text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} · {t.domain}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#575550] mb-2">
              Paper Mode
            </label>
            <select
              value={selectedPolicy}
              onChange={(e) =>
                setSelectedPolicy(
                  e.target.value as "NON_CALCULATOR" | "CALCULATOR_ALLOWED"
                )
              }
              className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-3 text-xs font-medium text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
            >
              <option value="NON_CALCULATOR">Non-Calculator (Paper 1F)</option>
              <option value="CALCULATOR_ALLOWED">
                Calculator Allowed (Paper 2F/3F)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#575550] mb-2">
              Target Foundation Grade
            </label>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(Number(e.target.value))}
              className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-3 text-xs font-medium text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
            >
              <option value={3}>Grade 3 (Foundation Core)</option>
              <option value={4}>Grade 4 (Standard Pass Target)</option>
              <option value={5}>Grade 5 (Strong Pass Crossover)</option>
            </select>
          </div>

          <button
            type="button"
            disabled={generating}
            onClick={handleGenerateQuestion}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-5 py-3 text-xs font-semibold text-white hover:bg-[#19634D] disabled:opacity-50 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {generating
                ? "Verifying with Symbolic Engine..."
                : "Generate & Verify Candidate"}
            </span>
          </button>
        </div>
      </div>

      {/* Question Bank & Governance Approval Queue */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-[#141413]">
            Question Repository & Review Queue ({filteredQuestions.length})
          </h2>
          <div className="flex items-center gap-2">
            {["ALL", "REVIEW_PENDING", "PUBLISHED", "ARCHIVED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? "bg-[#141413] text-white"
                    : "bg-white border border-[#E8E4DB] text-[#575550] hover:bg-[#F3F1EA]"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isPending =
              q.lifecycleStatus === "REVIEW_PENDING" ||
              q.lifecycleStatus === "AUTO_VALIDATED";

            return (
              <div
                key={q.id}
                className={`rounded-3xl border p-6 sm:p-7 bg-white shadow-sm space-y-4 ${
                  isPending ? "border-[#9A5B13]/40 bg-[#FAF9F5]" : "border-[#E8E4DB]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E4DB] pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`rounded-full px-3 py-0.5 text-[11px] font-semibold ${
                        q.lifecycleStatus === "PUBLISHED"
                          ? "bg-[#EDF3F0] text-[#0F4C3A]"
                          : isPending
                          ? "bg-[#FBF4EA] text-[#9A5B13]"
                          : "bg-[#F3F1EA] text-[#575550]"
                      }`}
                    >
                      {q.lifecycleStatus} · v{q.version}
                    </span>
                    <span className="text-sm font-semibold text-[#141413]">
                      {q.subtopicName}
                    </span>
                    <span className="rounded-full bg-[#F3F1EA] px-3 py-0.5 text-[11px] font-medium text-[#575550]">
                      {q.calculatorPolicy === "NON_CALCULATOR"
                        ? "Non-Calculator"
                        : "Calculator"}{" "}
                      · {q.totalMarks} marks · Grade {q.targetGrade}
                    </span>
                  </div>

                  {/* Governance Actions */}
                  <div className="flex items-center gap-2">
                    {q.lifecycleStatus !== "PUBLISHED" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateQuestionStatus(q.id, "PUBLISHED")
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0F4C3A] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#19634D] transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    )}
                    {q.lifecycleStatus !== "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={() => updateQuestionStatus(q.id, "ARCHIVED")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E4DB] px-3.5 py-1.5 text-xs font-medium text-[#575550] hover:bg-[#F3F1EA] hover:text-[#141413] transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Archive</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-base text-[#141413] leading-relaxed">
                  <MathText text={q.stemMarkdown} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-[#FAF9F5] border border-[#E8E4DB] p-4 space-y-1.5">
                    <div className="font-semibold text-[#141413]">
                      Mark Scheme & Step Checkpoints
                    </div>
                    <div className="text-[#575550]">
                      Accepted Final:{" "}
                      <span className="font-mono font-semibold text-[#141413]">
                        {q.markScheme.acceptedFinalAnswers.join(" | ")}
                      </span>
                    </div>
                    {q.markScheme.workingSteps.map((s) => (
                      <div key={s.id} className="text-[#575550]">
                        • [{s.markCode}] {s.promptLabel} →{" "}
                        <span className="font-mono text-[#141413]">
                          {s.acceptedAnswers.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {q.validationReport && (
                    <div className="rounded-2xl bg-[#EDF3F0]/60 border border-[#0F4C3A]/15 p-4 space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 font-semibold text-[#0F4C3A]">
                        <FileCheck2 className="h-4 w-4" />
                        <span>
                          Agent 3 Symbolic Verification:{" "}
                          {q.validationReport.symbolicCheckPassed
                            ? "Verified"
                            : "Flagged"}
                        </span>
                      </div>
                      {q.validationReport.validatorNotes.map((note, idx) => (
                        <div key={idx} className="text-[#0F4C3A]/90 text-xs">
                          ✓ {note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6-Agent Architecture Summary & Multi-Board Catalogue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
            <Cpu className="h-4 w-4" />
            <span>Configured Examination Specifications</span>
          </div>
          <div className="space-y-3">
            {specifications.map((sp) => (
              <div
                key={sp.id}
                className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-4 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-semibold text-[#141413]">
                  <span>
                    {sp.boardCode} ({sp.specCode}) — {sp.subjectName}
                  </span>
                  <span className="text-[#0F4C3A]">
                    Grade 4 Pass Target: {sp.grade4PassPercentage}%
                  </span>
                </div>
                <div className="text-[#575550]">{sp.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 shadow-sm space-y-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
            Commercial Products & Entitlements
          </div>
          <div className="space-y-3">
            {products.map((pr) => (
              <div
                key={pr.id}
                className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-4 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-semibold text-[#141413]">
                  <span>{pr.name}</span>
                  <span className="font-serif text-base text-[#0F4C3A]">
                    {pr.priceFormatted}
                  </span>
                </div>
                <div className="text-[#575550]">
                  Scope: {pr.entitlementScope} · Model: {pr.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
