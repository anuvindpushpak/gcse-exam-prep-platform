"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  FileCheck2,
  Layers,
  PlusCircle,
  ShieldCheck,
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
    entitlements,
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Module 6 & 7 · Platform Administration & AI Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Content Engine CMS & 6-Agent AI Governance Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Strict lifecycle enforcement:{" "}
              <strong>
                AI Draft → Symbolic Math Validation (Agent 3) → Specialist Human
                Approval → Published to Students
              </strong>
              . AI never publishes unverified educational content directly to
              students.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
              <div className="text-slate-500">Published Bank</div>
              <div className="text-lg font-extrabold text-emerald-700">
                {publishedQuestions.length} Qs
              </div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2">
              <div className="text-amber-800">Awaiting Review</div>
              <div className="text-lg font-extrabold text-amber-900">
                {pendingQuestions.length} Qs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Agent Pipeline Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            agent: "AI Agent 1: Curriculum & Specification Agent",
            desc: "Maps Edexcel (1MA1), AQA (8300), and OCR (J560) specifications into topic & AO1/AO2/AO3 trees.",
            badge: "3 Exam Boards Active",
          },
          {
            agent: "AI Agent 2: Question & Variation Generator",
            desc: "Produces original parameterized GCSE questions, M1/A1 step mark schemes, and declarative SVG diagrams.",
            badge: "Parameterized Templates",
          },
          {
            agent: "AI Agent 3: Symbolic Answer Validator",
            desc: "Uses deterministic mathjs symbolic evaluation to verify roots, fractions, and step mark totals before review.",
            badge: "100% Symbolic Guardrail",
          },
          {
            agent: "AI Agent 4: Learning Explanation Agent",
            desc: "Authors concise Grade 4 step-by-step worked solutions and targeted misconception coaching.",
            badge: "Misconception Mapped",
          },
          {
            agent: "AI Agent 5: Personalisation & Pathway Agent",
            desc: "Ranks student topic deficits by exam syllabus weight to recommend the highest-ROI next practice set.",
            badge: "Rule + Telemetry Driven",
          },
          {
            agent: "AI Agent 6: Content QA & Coverage Auditor",
            desc: "Audits Non-Calculator vs Calculator balance and flags duplicate or out-of-spec items.",
            badge: "Zero Unreviewed Live Items",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                <Cpu className="h-3.5 w-3.5 text-sky-600" />
                {item.agent}
              </span>
            </div>
            <p className="text-xs text-slate-600">{item.desc}</p>
            <div className="pt-1">
              <span className="rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[10px] font-bold text-sky-800">
                {item.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive AI Question Generator + Symbolic Validator */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              AI-Assisted Content Production Workflow
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Generate & Symbolically Validate New GCSE Question Variation
            </h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            Enters REVIEW_PENDING Queue (Requires Specialist Approval)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Syllabus Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} · {t.domain}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Calculator Policy
            </label>
            <select
              value={selectedPolicy}
              onChange={(e) =>
                setSelectedPolicy(
                  e.target.value as "NON_CALCULATOR" | "CALCULATOR_ALLOWED"
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900"
            >
              <option value="NON_CALCULATOR">Non-Calculator (Paper 1F)</option>
              <option value="CALCULATOR_ALLOWED">
                Calculator Allowed (Paper 2F/3F)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Foundation Grade
            </label>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900"
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span>
              {generating
                ? "Running Agent 2 & Agent 3..."
                : "Generate & Validate Draft"}
            </span>
          </button>
        </div>
      </div>

      {/* Question Bank & Governance Approval Queue */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-slate-900">
            Question Bank & Specialist Review Queue ({filteredQuestions.length})
          </h2>
          <div className="flex items-center gap-1.5">
            {["ALL", "REVIEW_PENDING", "PUBLISHED", "ARCHIVED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  statusFilter === st
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
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
                className={`rounded-2xl border p-5 bg-white shadow-sm space-y-3 ${
                  isPending ? "border-2 border-amber-400" : "border-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        q.lifecycleStatus === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-800"
                          : isPending
                          ? "bg-amber-100 text-amber-900"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {q.lifecycleStatus} (v{q.version})
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {q.subtopicName}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {q.calculatorPolicy} · {q.totalMarks} marks · Grade{" "}
                      {q.targetGrade}
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
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve & Publish to Students</span>
                      </button>
                    )}
                    {q.lifecycleStatus !== "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={() => updateQuestionStatus(q.id, "ARCHIVED")}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Withdraw</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm font-medium text-slate-900">
                  <MathText text={q.stemMarkdown} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
                    <div className="font-bold text-slate-700">
                      Mark Scheme & Step Checkpoints:
                    </div>
                    <div>
                      Accepted Final:{" "}
                      <span className="font-mono font-bold text-slate-900">
                        {q.markScheme.acceptedFinalAnswers.join(" | ")}
                      </span>
                    </div>
                    {q.markScheme.workingSteps.map((s) => (
                      <div key={s.id} className="text-slate-600">
                        • [{s.markCode}] {s.promptLabel} →{" "}
                        <span className="font-mono">
                          {s.acceptedAnswers.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {q.validationReport && (
                    <div className="rounded-xl bg-emerald-50/60 border border-emerald-200 p-3 space-y-1">
                      <div className="inline-flex items-center gap-1.5 font-bold text-emerald-900">
                        <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>
                          Agent 3 Symbolic Validation Report (Passed:{" "}
                          {String(q.validationReport.symbolicCheckPassed)})
                        </span>
                      </div>
                      {q.validationReport.validatorNotes.map((note, idx) => (
                        <div key={idx} className="text-emerald-800 text-[11px]">
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

      {/* Multi-Exam-Board & Commercial Catalogue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Configured Examination Specifications (Decoupled Architecture)
          </h3>
          {specifications.map((sp) => (
            <div
              key={sp.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>
                  {sp.boardCode} ({sp.specCode}) — {sp.subjectName}
                </span>
                <span className="text-sky-700">
                  Grade 4 Benchmark: {sp.grade4PassPercentage}%
                </span>
              </div>
              <div className="text-slate-600">{sp.name}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Configured Commercial Products & Entitlements
          </h3>
          {products.map((pr) => (
            <div
              key={pr.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{pr.name}</span>
                <span className="text-emerald-700">{pr.priceFormatted}</span>
              </div>
              <div className="text-slate-600">
                Scope: {pr.entitlementScope} · Type: {pr.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
