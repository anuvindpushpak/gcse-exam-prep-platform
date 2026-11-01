"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Lock,
  Sparkles,
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
  const [activeSection, setActiveSection] = useState<
    "PATHWAY" | "MASTERY" | "EXAMS"
  >("PATHWAY");

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 space-y-12">
      {/* Calm Editorial Welcome & Readiness Card */}
      <section className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              {targetStudent?.selectedBoard || "Edexcel"} GCSE Mathematics ·
              Foundation Tier
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
              Good afternoon,{" "}
              {targetStudent?.firstName || activeUser?.firstName || "Leo"}.
            </h1>
            <p className="text-base text-[#57554F] leading-relaxed">
              {attempts.length === 0
                ? "Your preparation profile is ready. Begin with the 12-question Baseline Diagnostic Assessment so we can map your strengths and build your personalised Grade 4 study sequence."
                : `You have completed ${attempts.length} assessment session(s). Your current readiness is ${readiness}% against the 62% Grade 4 pass benchmark.`}
            </p>
          </div>

          {attempts.length === 0 ? (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/exam/diag-edexcel-foundation"
                className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#0B382B] transition-colors"
              >
                <span>Start Free Diagnostic</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handleSimulateDiagnostic}
                disabled={simulating}
                className="rounded-full border border-[#D5CFC2] bg-[#FAF9F5] px-5 py-3.5 text-xs font-semibold text-[#3D3B37] hover:border-[#141413]"
              >
                {simulating
                  ? "Generating..."
                  : "Simulate Diagnostic (48% Sample)"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSimulateDiagnostic}
              disabled={simulating}
              className="self-start lg:self-end text-xs font-medium text-[#6E6B64] hover:text-[#141413] underline underline-offset-4"
            >
              Refresh sample diagnostic data
            </button>
          )}
        </div>

        {/* Visual Grade 4 Readiness Thermometer */}
        <div className="border-t border-[#E8E4DB] pt-8 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
            <div>
              <span className="font-semibold text-[#141413]">
                Progress to Grade 4 Standard Pass
              </span>
              <span className="ml-2 text-xs text-[#6E6B64]">
                ({intelligenceProfile?.estimatedCurrentGrade || "Pending Diagnostic"})
              </span>
            </div>
            <div className="text-xs font-medium text-[#57554F]">
              Current: <strong className="text-[#141413]">{readiness}%</strong>{" "}
              · Grade 4 Pass Benchmark:{" "}
              <strong className="text-[#0F4C3A]">62%</strong>
            </div>
          </div>

          <div className="relative h-3 w-full rounded-full bg-[#F4F2EC] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0F4C3A] transition-all duration-500"
              style={{ width: `${Math.max(2, readiness)}%` }}
            />
            {/* 62% Benchmark Marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#141413]"
              style={{ left: "62%" }}
              title="62% Grade 4 Pass Threshold"
            />
          </div>

          {/* 4 Quiet Metric Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
            <div>
              <div className="text-xs text-[#6E6B64]">Distance to Grade 4</div>
              <div className="font-serif text-2xl font-medium text-[#141413] mt-1">
                {attempts.length === 0
                  ? "—"
                  : intelligenceProfile?.marksAwayFromGrade4 === 0
                  ? "On Target"
                  : `${intelligenceProfile?.marksAwayFromGrade4} marks`}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#6E6B64]">
                Method Credit Captured
              </div>
              <div className="font-serif text-2xl font-medium text-[#0F4C3A] mt-1">
                {intelligenceProfile?.methodMarkCaptureRate ?? 0}%
              </div>
            </div>
            <div>
              <div className="text-xs text-[#6E6B64]">
                Non-Calculator Accuracy
              </div>
              <div className="font-serif text-2xl font-medium text-[#141413] mt-1">
                {intelligenceProfile?.nonCalculatorAccuracy ?? 0}%
              </div>
            </div>
            <div>
              <div className="text-xs text-[#6E6B64]">Calculator Accuracy</div>
              <div className="font-serif text-2xl font-medium text-[#141413] mt-1">
                {intelligenceProfile?.calculatorAccuracy ?? 0}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Light-Mode Upgrade Banner (Only when on Free Tier) */}
      {!entitlements.hasFullPack && (
        <section className="rounded-3xl border border-[#0F4C3A]/25 bg-[#E6F0EC]/60 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              Complete Preparation Access
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#141413]">
              Unlock all 6 Foundation topic question banks and 3 Mock
              Examinations.
            </h2>
            <p className="text-sm text-[#3D3B37]">
              One-time payment of £39.99 · Includes full question-by-question
              remediation and linked Parent Progress Dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-3.5 text-xs font-semibold text-white hover:bg-[#0B382B] transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Unlock Grade 4 Pack · £39.99</span>
          </button>
        </section>
      )}

      {/* Clean Editorial Section Switcher (Progressive Disclosure) */}
      <div className="border-b border-[#E8E4DB] flex items-center gap-8">
        {[
          { id: "PATHWAY", label: "1. Recommended Pathway" },
          { id: "MASTERY", label: "2. Syllabus Mastery (6 Domains)" },
          {
            id: "EXAMS",
            label: `3. Mock Exams & History (${attempts.length})`,
          },
        ].map((tab) => {
          const active = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveSection(tab.id as "PATHWAY" | "MASTERY" | "EXAMS")
              }
              className={`pb-4 text-sm transition-colors ${
                active
                  ? "border-b-2 border-[#0F4C3A] font-semibold text-[#0F4C3A]"
                  : "font-medium text-[#6E6B64] hover:text-[#141413]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: RECOMMENDED PATHWAY */}
      {activeSection === "PATHWAY" && (
        <section className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-medium text-[#141413]">
              Your Next Steps, Ranked by Mark Impact
            </h2>
            <p className="text-sm text-[#57554F] mt-1">
              Focus on one step at a time. Each recommendation is weighted by
              how frequently the topic appears on the Foundation examination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {intelligenceProfile?.recommendations.map((rec, idx) => {
              const isLocked =
                rec.requiresEntitlement === "FULL_PACK" &&
                !entitlements.hasFullPack;

              return (
                <div
                  key={rec.id}
                  className="flex flex-col justify-between rounded-3xl border border-[#E8E4DB] bg-white p-8 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold uppercase tracking-wider text-[#0F4C3A]">
                        Step 0{idx + 1} · {rec.topicCode}
                      </span>
                      <span className="rounded-full bg-[#F4F2EC] px-3 py-1 font-medium text-[#3D3B37]">
                        +{rec.potentialMarkGain} potential marks
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#141413]">
                      {rec.headline}
                    </h3>

                    <p className="text-sm text-[#57554F] leading-relaxed">
                      {rec.reasonSummary}
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-[#E8E4DB] flex items-center justify-between">
                    {isLocked ? (
                      <button
                        type="button"
                        onClick={() =>
                          openCheckout("prod-gcse-maths-grade4-pack")
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-[#141413] px-5 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#141413] hover:text-white transition-colors"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>{rec.ctaLabel}</span>
                      </button>
                    ) : (
                      <Link
                        href={rec.ctaHref}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0B382B] transition-colors"
                      >
                        <span>{rec.ctaLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <span className="text-xs text-[#6E6B64]">
                      {rec.topicName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VIEW 2: SYLLABUS MASTERY MATRIX */}
      {activeSection === "MASTERY" && (
        <section className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-medium text-[#141413]">
              Topic Mastery Across All 6 Syllabus Domains
            </h2>
            <p className="text-sm text-[#57554F] mt-1">
              A score of 65% or higher in a domain indicates secure Grade 4
              proficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intelligenceProfile?.topicMastery.map((tm) => {
              const topicDef = topics.find((t) => t.id === tm.topicId);
              const isUnlocked =
                topicDef?.isFreeSample || entitlements.hasFullPack;

              const statusLabel = {
                NOT_STARTED: "Not Assessed",
                NEEDS_FOCUS: "Priority Focus",
                DEVELOPING: "Developing",
                SECURE_GRADE_4: "Grade 4 Secure",
              }[tm.status];

              return (
                <div
                  key={tm.topicId}
                  className="rounded-3xl border border-[#E8E4DB] bg-white p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-[#6E6B64]">
                        {tm.topicCode} · {tm.weightPercentage}% Weight
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-medium ${
                          tm.status === "SECURE_GRADE_4"
                            ? "bg-[#E6F0EC] text-[#0F4C3A]"
                            : tm.status === "NEEDS_FOCUS"
                            ? "bg-amber-50 text-amber-900"
                            : "bg-[#F4F2EC] text-[#57554F]"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-medium text-[#141413]">
                        {tm.domain}
                      </h3>
                      <p className="text-xs text-[#6E6B64] mt-1">
                        {tm.topicName}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#3D3B37]">
                          Mastery: {tm.masteryScore}%
                        </span>
                        <span className="text-[#6E6B64]">
                          {tm.marksEarned}/{tm.marksPossible || "—"} marks
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#F4F2EC] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0F4C3A]"
                          style={{ width: `${Math.max(3, tm.masteryScore)}%` }}
                        />
                      </div>
                    </div>

                    {tm.commonErrors.length > 0 && (
                      <p className="text-xs text-amber-900 bg-amber-50/70 rounded-xl px-3 py-2">
                        Review: {tm.commonErrors.join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E8E4DB] flex items-center justify-between text-xs font-semibold">
                    <Link
                      href={`/topics/${tm.topicId}`}
                      className="text-[#0F4C3A] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Study Guide & Practice</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    {!isUnlocked && (
                      <Lock className="h-3.5 w-3.5 text-[#969289]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VIEW 3: MOCK EXAMINATIONS & COMPLETED HISTORY */}
      {activeSection === "EXAMS" && (
        <section className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 3 Full Mock Examinations */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#141413]">
                Full-Length Mock Examinations
              </h2>
              <div className="space-y-4">
                {mockExams.map((mock) => {
                  const isLocked = !entitlements.hasFullPack;
                  const completedAttempt = attempts
                    .filter((a) => a.templateId === mock.id)
                    .slice(-1)[0];

                  return (
                    <div
                      key={mock.id}
                      className="rounded-3xl border border-[#E8E4DB] bg-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6E6B64]">
                          <span className="font-mono font-semibold text-[#0F4C3A]">
                            {mock.calculatorPolicy === "NON_CALCULATOR"
                              ? "PAPER 1F · NON-CALCULATOR"
                              : `PAPER ${mock.paperNumber}F · CALCULATOR`}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {mock.timeLimitMinutes} mins · {mock.totalMarks}{" "}
                            marks
                          </span>
                          {completedAttempt && (
                            <span className="rounded-full bg-[#E6F0EC] px-2.5 py-0.5 font-semibold text-[#0F4C3A]">
                              Last: {completedAttempt.percentageScore}%
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-xl font-medium text-[#141413]">
                          {mock.title}
                        </h3>
                        <p className="text-sm text-[#57554F]">{mock.subtitle}</p>
                      </div>

                      <div className="shrink-0">
                        {isLocked ? (
                          <button
                            type="button"
                            onClick={() =>
                              openCheckout("prod-gcse-maths-grade4-pack")
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-[#D5CFC2] px-5 py-2.5 text-xs font-semibold text-[#3D3B37] hover:border-[#141413]"
                          >
                            <Lock className="h-3.5 w-3.5" />
                            <span>Unlock Pack</span>
                          </button>
                        ) : (
                          <Link
                            href={`/exam/${mock.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0B382B]"
                          >
                            <span>
                              {completedAttempt ? "Retake Paper" : "Sit Paper"}
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

            {/* Weekly Sprints */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#141413]">
                Weekly Practice Sprints
              </h2>
              <div className="space-y-4">
                {weeklyChallenges.map((wc) => {
                  const isLocked =
                    !entitlements.hasWeeklyMembership &&
                    !entitlements.hasFullPack;
                  return (
                    <div
                      key={wc.id}
                      className="rounded-3xl border border-[#E8E4DB] bg-white p-6 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs text-[#6E6B64]">
                        <span className="font-medium text-[#0F4C3A]">
                          {wc.releaseWeekLabel}
                        </span>
                        <span>
                          {wc.timeLimitMinutes} mins · {wc.totalMarks} marks
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-medium text-[#141413]">
                        {wc.title}
                      </h3>
                      <p className="text-xs text-[#57554F] leading-relaxed">
                        {wc.subtitle}
                      </p>
                      <div className="pt-2">
                        {isLocked ? (
                          <button
                            type="button"
                            onClick={() =>
                              openCheckout("prod-weekly-maths-membership")
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A] hover:underline"
                          >
                            <Lock className="h-3.5 w-3.5" />
                            <span>Unlock Weekly Membership · £7.99/mo</span>
                          </button>
                        ) : (
                          <Link
                            href={`/exam/${wc.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A] hover:underline"
                          >
                            <span>Begin Sprint</span>
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

          {/* Completed Assessment History */}
          {attempts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#141413]">
                Completed Assessment Archive
              </h3>
              <div className="overflow-hidden rounded-3xl border border-[#E8E4DB] bg-white">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E8E4DB] bg-[#FAF9F5] text-xs uppercase tracking-wider text-[#6E6B64]">
                      <th className="py-4 px-6 font-medium">Assessment</th>
                      <th className="py-4 px-6 font-medium">Marks</th>
                      <th className="py-4 px-6 font-medium">Score</th>
                      <th className="py-4 px-6 font-medium">Indicative Grade</th>
                      <th className="py-4 px-6 font-medium text-right">
                        Report
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DB]">
                    {[...attempts].reverse().map((att) => (
                      <tr key={att.id} className="hover:bg-[#FAF9F5]/60">
                        <td className="py-4 px-6 font-medium text-[#141413]">
                          {att.templateTitle}
                        </td>
                        <td className="py-4 px-6 text-[#57554F]">
                          {att.earnedMarks} / {att.totalMarks}
                        </td>
                        <td className="py-4 px-6 font-semibold text-[#0F4C3A]">
                          {att.percentageScore}%
                        </td>
                        <td className="py-4 px-6 text-[#57554F]">
                          {att.estimatedGrade}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/exam/${att.templateId}?review=${att.id}`}
                            className="font-semibold text-[#0F4C3A] hover:underline"
                          >
                            Review →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
