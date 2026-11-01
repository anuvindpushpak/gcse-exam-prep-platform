"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Lock,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { usePlatform } from "@/components/providers/PlatformProvider";

export default function StudentDashboardPage() {
  const {
    activeUser,
    targetStudent,
    topics,
    assessmentTemplates,
    attempts,
    entitlements,
    intelligenceProfile,
    openCheckout,
    simulateDiagnostic,
  } = usePlatform();

  const [simulating, setSimulating] = useState(false);

  const handleSimulateDiagnostic = async () => {
    setSimulating(true);
    try {
      await simulateDiagnostic();
    } finally {
      setSimulating(false);
    }
  };

  const mockExams = assessmentTemplates.filter((t) => t.mode === "MOCK_EXAM");
  const weeklyChallenges = assessmentTemplates.filter(
    (t) => t.mode === "WEEKLY_CHALLENGE"
  );

  const readiness = intelligenceProfile?.overallReadinessScore || 0;
  const isGrade4Ready = readiness >= 62;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Top Student Banner & Readiness Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                {targetStudent?.selectedBoard || "EDEXCEL"} GCSE MATHS (1MA1) · FOUNDATION TIER
              </span>
              <span className="rounded-md bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-bold text-sky-800">
                Target: Grade 4 (Standard Pass ≥ 62%)
              </span>
              {entitlements.hasFullPack ? (
                <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  Full Grade 4 Pack Unlocked
                </span>
              ) : (
                <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                  Free Diagnostic Tier
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-1">
              Welcome back, {targetStudent?.firstName || activeUser?.firstName || "Leo"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {attempts.length === 0
                ? "Start by completing your Free Baseline Diagnostic Assessment so the Intelligence Engine can map your topic gaps and build your Grade 4 study pathway."
                : `You have completed ${attempts.length} assessment(s) and attempted ${intelligenceProfile?.totalQuestionsAttempted || 0} step-marked exam questions. Follow your priority recommendations below to cross the Grade 4 line.`}
            </p>

            {attempts.length === 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href="/exam/diag-edexcel-foundation"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <ClipboardCheck className="h-4 w-4 text-sky-400" />
                  <span>Take Free Baseline Diagnostic Now</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSimulateDiagnostic}
                  disabled={simulating}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-900 hover:bg-sky-100"
                >
                  <Zap className="h-4 w-4 text-sky-600" />
                  <span>
                    {simulating
                      ? "Simulating..."
                      : "Instant Demo: Simulate Completed Diagnostic (48% Grade 3)"}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Right Readiness KPI Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-[11px] font-semibold uppercase text-slate-500">
                Grade 4 Readiness
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span
                  className={`text-2xl font-extrabold ${
                    isGrade4Ready ? "text-emerald-600" : "text-sky-600"
                  }`}
                >
                  {readiness}%
                </span>
                <span className="text-[11px] text-slate-500">/ 62% pass</span>
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-slate-700 truncate">
                {intelligenceProfile?.estimatedCurrentGrade || "Pending"}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-[11px] font-semibold uppercase text-slate-500">
                Distance to Grade 4
              </div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">
                {attempts.length === 0
                  ? "—"
                  : intelligenceProfile?.marksAwayFromGrade4 === 0
                  ? "On Target!"
                  : `${intelligenceProfile?.marksAwayFromGrade4} marks`}
              </div>
              <div className="mt-1.5 text-[11px] text-slate-500">
                Across 240-mark series
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-[11px] font-semibold uppercase text-slate-500">
                Non-Calc vs Calc
              </div>
              <div className="mt-1 text-base font-extrabold text-slate-900">
                {intelligenceProfile?.nonCalculatorAccuracy ?? 0}% /{" "}
                {intelligenceProfile?.calculatorAccuracy ?? 0}%
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Paper 1F vs 2F/3F
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-[11px] font-semibold uppercase text-slate-500">
                Method Marks (M1)
              </div>
              <div className="mt-1 text-base font-extrabold text-emerald-700">
                {intelligenceProfile?.methodMarkCaptureRate ?? 0}% captured
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Step working credit
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Paywall Banner if Student has taken Diagnostic but not unlocked £39.99 Pack */}
      {!entitlements.hasFullPack && (
        <div className="rounded-2xl border-2 border-sky-600 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-0.5 text-xs font-bold text-sky-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Unlock Full Personalised Remediation & Mock Exams</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold">
                Bridge your {intelligenceProfile?.marksAwayFromGrade4 || 34}-mark gap with the GCSE Maths Grade 4 Preparation Pack (£39.99)
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Unlock all 6 Foundation topic modules, unlimited step-marked practice sets, 3 full-length Mock Examinations (Paper 1F Non-Calc, Paper 2F & 3F Calc), and the linked Parent Dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-xs font-extrabold text-slate-950 hover:bg-sky-400 transition-colors shadow-md"
            >
              <span>Unlock Full Grade 4 Pack (£39.99)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Personalised Next-Best-Action Pathway (Engine 3) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Engine 3 · Personalised Preparation Pathway
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Recommended Next Actions (Highest Mark ROI)
            </h2>
          </div>
          {attempts.length > 0 && (
            <button
              type="button"
              onClick={handleSimulateDiagnostic}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Re-run Demo Diagnostic
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligenceProfile?.recommendations.map((rec) => {
            const isLocked =
              rec.requiresEntitlement === "FULL_PACK" &&
              !entitlements.hasFullPack;
            return (
              <div
                key={rec.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-900">
                      <Target className="h-3.5 w-3.5 text-sky-600" />
                      Priority #{rec.priorityRank} · {rec.topicCode}
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      +{rec.potentialMarkGain} potential exam marks
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {rec.headline}
                  </h3>
                  <p className="text-xs text-slate-600">{rec.reasonSummary}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isLocked ? (
                    <button
                      type="button"
                      onClick={() =>
                        openCheckout("prod-gcse-maths-grade4-pack")
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{rec.ctaLabel}</span>
                    </button>
                  ) : (
                    <Link
                      href={rec.ctaHref}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      <span>{rec.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <span className="text-[11px] font-medium text-slate-500">
                    {rec.topicName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Topic Mastery RAG Matrix Across All 6 Syllabus Domains */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Syllabus Coverage & Weaknesses
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            Topic Mastery Matrix (6 Edexcel Foundation Domains)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intelligenceProfile?.topicMastery.map((tm) => {
            const topicDef = topics.find((t) => t.id === tm.topicId);
            const isUnlocked =
              topicDef?.isFreeSample || entitlements.hasFullPack;

            const statusBadge = {
              NOT_STARTED: {
                label: "Not Assessed Yet",
                cls: "bg-slate-100 text-slate-700",
                bar: "bg-slate-300",
              },
              NEEDS_FOCUS: {
                label: "Priority Gap (<45%)",
                cls: "bg-rose-100 text-rose-800",
                bar: "bg-rose-500",
              },
              DEVELOPING: {
                label: "Developing (45–64%)",
                cls: "bg-amber-100 text-amber-900",
                bar: "bg-amber-500",
              },
              SECURE_GRADE_4: {
                label: "Grade 4 Secure (≥65%)",
                cls: "bg-emerald-100 text-emerald-800",
                bar: "bg-emerald-500",
              },
            }[tm.status];

            return (
              <div
                key={tm.topicId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {tm.topicCode} · {tm.domain}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusBadge.cls}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {tm.topicName}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">
                        Mastery: {tm.masteryScore}%
                      </span>
                      <span className="text-slate-500">
                        Marks: {tm.marksEarned}/{tm.marksPossible || "—"} (Weight:{" "}
                        {tm.weightPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full transition-all ${statusBadge.bar}`}
                        style={{ width: `${Math.max(4, tm.masteryScore)}%` }}
                      />
                    </div>
                  </div>

                  {tm.commonErrors.length > 0 && (
                    <div className="mt-3 rounded-lg bg-rose-50/80 border border-rose-100 p-2 text-[11px] text-rose-900">
                      <span className="font-bold">Detected Gaps: </span>
                      {tm.commonErrors.join(", ")}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/topics/${tm.topicId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Study Resource & Practise</span>
                  </Link>
                  {!isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                      <Lock className="h-3 w-3" />
                      Pack Required for Full Bank
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mock Examinations & Weekly Membership Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3 Full Mock Examinations */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Module H & I · Examination Simulator
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Full-Length Edexcel GCSE Foundation Mock Papers
            </h2>
          </div>

          <div className="space-y-3">
            {mockExams.map((mock) => {
              const isLocked = !entitlements.hasFullPack;
              const completedAttempt = attempts
                .filter((a) => a.templateId === mock.id)
                .slice(-1)[0];

              return (
                <div
                  key={mock.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          mock.calculatorPolicy === "NON_CALCULATOR"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {mock.calculatorPolicy === "NON_CALCULATOR"
                          ? "Non-Calculator (Paper 1F)"
                          : `Calculator Allowed (Paper ${mock.paperNumber}F)`}
                      </span>
                      <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mock.timeLimitMinutes} mins · {mock.totalMarks} marks
                      </span>
                      {completedAttempt && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Last Score: {completedAttempt.percentageScore}% (
                          {completedAttempt.estimatedGrade})
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {mock.title}
                    </h3>
                    <p className="text-xs text-slate-600">{mock.subtitle}</p>
                  </div>

                  <div className="shrink-0">
                    {isLocked ? (
                      <button
                        type="button"
                        onClick={() =>
                          openCheckout("prod-gcse-maths-grade4-pack")
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Unlock in £39.99 Pack</span>
                      </button>
                    ) : (
                      <Link
                        href={`/exam/${mock.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                      >
                        <span>
                          {completedAttempt ? "Retake Mock" : "Sit Mock Exam"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Practice Membership Sprints (£7.99/mo) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Module K · Recurring Membership
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Weekly Exam Sprints (£7.99/mo)
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {weeklyChallenges.map((wc) => {
              const isLocked =
                !entitlements.hasWeeklyMembership && !entitlements.hasFullPack;
              return (
                <div
                  key={wc.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 font-bold text-sky-700">
                      <Calendar className="h-3.5 w-3.5" />
                      {wc.releaseWeekLabel}
                    </span>
                    <span className="text-slate-500">
                      {wc.timeLimitMinutes} mins · {wc.totalMarks} marks
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {wc.title}
                  </h3>
                  <p className="text-xs text-slate-600">{wc.subtitle}</p>
                  <div className="pt-1">
                    {isLocked ? (
                      <button
                        type="button"
                        onClick={() =>
                          openCheckout("prod-weekly-maths-membership")
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:underline"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Unlock Weekly Membership (£7.99/mo)</span>
                      </button>
                    ) : (
                      <Link
                        href={`/exam/${wc.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-sky-700"
                      >
                        <span>Start Timed Sprint</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Assessment & Exam History */}
      {attempts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Completed Assessment & Examination History
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="py-3 px-4 font-bold">Assessment</th>
                  <th className="py-3 px-4 font-bold">Mode</th>
                  <th className="py-3 px-4 font-bold">Marks</th>
                  <th className="py-3 px-4 font-bold">Percentage</th>
                  <th className="py-3 px-4 font-bold">Indicative Grade</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...attempts].reverse().map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {att.templateTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{att.mode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {att.earnedMarks} / {att.totalMarks}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-bold ${
                          att.percentageScore >= 62
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {att.percentageScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {att.estimatedGrade}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/exam/${att.templateId}?review=${att.id}`}
                        className="font-bold text-sky-700 hover:underline"
                      >
                        Review Solutions →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
