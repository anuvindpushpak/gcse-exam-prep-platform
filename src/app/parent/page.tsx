"use client";

import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  Link2,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { usePlatform } from "@/components/providers/PlatformProvider";

export default function ParentDashboardPage() {
  const {
    isAuthenticated,
    activeUser,
    targetStudent,
    attempts,
    entitlements,
    intelligenceProfile,
    openCheckout,
    openAuth,
    linkStudent,
    simulateDiagnostic,
  } = usePlatform();

  const [studentQuery, setStudentQuery] = useState("");
  const [linkStatus, setLinkStatus] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E8E4DB] bg-white text-[#0F4C3A]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
          Guardian Progress Portal
        </h1>
        <p className="text-base text-[#57554F] leading-relaxed">
          Please sign in with your linked Parent or Guardian account to view
          your child&apos;s GCSE Grade 4 readiness score and topic mastery
          telemetry.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => openAuth("SIGN_IN")}
            className="rounded-full bg-[#0F4C3A] px-7 py-3.5 text-xs font-semibold text-white hover:bg-[#0B382B] transition-colors"
          >
            Sign In as Guardian
          </button>
        </div>
      </div>
    );
  }

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError(null);
    setLinkStatus(null);
    if (!studentQuery.trim()) return;
    setLinking(true);
    try {
      const linked = await linkStudent(studentQuery.trim());
      setLinkStatus(
        `Successfully connected to ${linked.firstName} ${linked.lastName || ""} (${linked.email}).`
      );
      setStudentQuery("");
    } catch (err: unknown) {
      setLinkError(
        err instanceof Error
          ? err.message
          : "Could not find a student with that email or invite code."
      );
    } finally {
      setLinking(false);
    }
  };

  const studentName = targetStudent
    ? `${targetStudent.firstName} ${targetStudent.lastName || ""}`.trim()
    : "Student";

  const readiness = intelligenceProfile?.overallReadinessScore || 0;
  const strongTopics =
    intelligenceProfile?.topicMastery.filter(
      (t) => t.status === "SECURE_GRADE_4"
    ) || [];
  const focusTopics =
    intelligenceProfile?.topicMastery.filter(
      (t) => t.status === "NEEDS_FOCUS" || t.status === "DEVELOPING"
    ) || [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 space-y-12">
      {/* Editorial Parent Header */}
      <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-[#EDF3F0] px-3.5 py-1 text-xs font-semibold text-[#0F4C3A]">
              <UserCheck className="h-3.5 w-3.5" />
              <span>
                Tracking Student:{" "}
                <strong>{studentName}</strong> ({targetStudent?.email}) · Link
                Code:{" "}
                <span className="font-mono">
                  {targetStudent?.parentInviteCode || "PARENT-LEO-2027"}
                </span>
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#141413] tracking-tight">
              Preparation Report for {studentName}
            </h1>
            <p className="text-base text-[#575550] max-w-2xl leading-relaxed">
              A clear, plain-English overview of{" "}
              {targetStudent?.firstName || "your child"}&apos;s progress towards
              a GCSE Mathematics Grade 4 pass (
              {targetStudent?.selectedBoard || "Edexcel"} Foundation Tier).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!entitlements.hasFullPack ? (
              <button
                type="button"
                onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
                className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#19634D] transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  Unlock {targetStudent?.firstName}&apos;s Grade 4 Pack (£39.99)
                </span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EDF3F0] border border-[#0F4C3A]/20 px-5 py-2.5 text-xs font-semibold text-[#0F4C3A]">
                <Award className="h-4 w-4" />
                <span>Grade 4 Preparation Pack Active</span>
              </span>
            )}
          </div>
        </div>

        {/* Parent-to-Student Link Bar */}
        <form
          onSubmit={handleLinkStudent}
          className="border-t border-[#E8E4DB] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#141413]">
              <Link2 className="h-3.5 w-3.5 text-[#0F4C3A]" />
              <span>Link or Switch Tracked Student</span>
            </div>
            <p className="text-xs text-[#6E6B64]">
              Enter your child&apos;s registered Student Email or their Parent
              Link Code from their Student Hub.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:w-96">
            <input
              type="text"
              value={studentQuery}
              onChange={(e) => setStudentQuery(e.target.value)}
              placeholder="Student email or code (e.g. PARENT-LEO-2027)"
              className="w-full rounded-full border border-[#D5CFC2] bg-[#FAF9F5] px-4 py-2 text-xs text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={linking}
              className="shrink-0 rounded-full bg-[#141413] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2C2C2A] transition-colors"
            >
              {linking ? "Linking..." : "Link Student"}
            </button>
          </div>
        </form>

        {linkStatus && (
          <div className="rounded-2xl border border-[#0F4C3A]/30 bg-[#E6F0EC]/70 px-4 py-2.5 text-xs font-medium text-[#0F4C3A] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{linkStatus}</span>
          </div>
        )}
        {linkError && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900">
            {linkError}
          </div>
        )}
      </div>

      {/* Plain-English Executive Summary for Parents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-7 shadow-sm space-y-2">
          <div className="text-xs font-medium uppercase tracking-widest text-[#78756E]">
            Readiness Score
          </div>
          <div className="font-serif text-4xl font-semibold text-[#141413]">
            {readiness}%
          </div>
          <div className="text-xs font-semibold text-[#0F4C3A]">
            {intelligenceProfile?.estimatedCurrentGrade}
          </div>
          <p className="pt-1 text-xs text-[#78756E] leading-relaxed">
            62% or above indicates strong readiness for a GCSE Grade 4 pass.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-7 shadow-sm space-y-2">
          <div className="text-xs font-medium uppercase tracking-widest text-[#78756E]">
            Progress Since Baseline
          </div>
          <div className="font-serif text-4xl font-semibold text-[#0F4C3A]">
            {intelligenceProfile?.improvementDelta !== undefined &&
            intelligenceProfile.improvementDelta >= 0
              ? `+${intelligenceProfile.improvementDelta}%`
              : `${intelligenceProfile?.improvementDelta || 0}%`}
          </div>
          <div className="text-xs font-medium text-[#575550]">
            Initial Diagnostic:{" "}
            {intelligenceProfile?.baselineDiagnosticScore !== undefined
              ? `${intelligenceProfile.baselineDiagnosticScore}%`
              : "Not taken yet"}
          </div>
          <p className="pt-1 text-xs text-[#78756E] leading-relaxed">
            Measures mark improvements from initial assessment to recent papers.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-7 shadow-sm space-y-2">
          <div className="text-xs font-medium uppercase tracking-widest text-[#78756E]">
            Questions Completed
          </div>
          <div className="font-serif text-4xl font-semibold text-[#141413]">
            {intelligenceProfile?.totalQuestionsAttempted || 0}
          </div>
          <div className="text-xs font-medium text-[#575550] inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#78756E]" />
            <span>
              {AttemptsCountLabel(
                attempts.length,
                intelligenceProfile?.totalPracticeMinutes || 0
              )}
            </span>
          </div>
          <p className="pt-1 text-xs text-[#78756E] leading-relaxed">
            Step-marked GCSE questions practised independently.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-7 shadow-sm space-y-2">
          <div className="text-xs font-medium uppercase tracking-widest text-[#78756E]">
            Method Habits (M1)
          </div>
          <div className="font-serif text-4xl font-semibold text-[#141413]">
            {intelligenceProfile?.methodMarkCaptureRate || 0}%
          </div>
          <div className="text-xs font-medium text-[#575550]">
            Working steps shown
          </div>
          <p className="pt-1 text-xs text-[#78756E] leading-relaxed">
            Shows how consistently {targetStudent?.firstName} records intermediate
            working.
          </p>
        </div>
      </div>

      {attempts.length === 0 && (
        <div className="rounded-3xl border border-[#E8E4DB] bg-[#F3F1EA] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="font-serif text-xl font-semibold text-[#141413]">
              Awaiting First Baseline Diagnostic
            </h2>
            <p className="text-sm text-[#575550] max-w-xl leading-relaxed">
              Once {targetStudent?.firstName} completes the 15-minute Free
              Baseline Diagnostic, their topic strengths, priority focus areas,
              and mock exam scores will appear here automatically.
            </p>
          </div>
          {activeUser?.id === "user-parent-sarah" && (
            <button
              type="button"
              onClick={() => simulateDiagnostic()}
              className="shrink-0 rounded-full bg-[#141413] px-6 py-3 text-xs font-semibold text-white hover:bg-[#2C2C2A] transition-colors"
            >
              Preview Sample Diagnostic Telemetry
            </button>
          )}
        </div>
      )}

      {/* Strengths vs Areas Needing Additional Practice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E4DB] pb-4">
            <h2 className="font-serif text-xl font-semibold text-[#141413]">
              Topics On Track for Grade 4
            </h2>
            <span className="rounded-full bg-[#EDF3F0] px-3 py-1 text-xs font-semibold text-[#0F4C3A]">
              {strongTopics.length} Secure
            </span>
          </div>
          {strongTopics.length === 0 ? (
            <p className="text-sm text-[#78756E] leading-relaxed py-4">
              Topics reaching 65%+ mastery will appear here as{" "}
              {targetStudent?.firstName} completes structured practice sets.
            </p>
          ) : (
            <div className="space-y-3">
              {strongTopics.map((t) => (
                <div
                  key={t.topicId}
                  className="flex items-center justify-between rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-4"
                >
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-[#78756E]">
                      {t.topicCode} · {t.domain}
                    </div>
                    <div className="text-sm font-semibold text-[#141413] mt-0.5">
                      {t.topicName}
                    </div>
                  </div>
                  <span className="font-serif text-lg font-semibold text-[#0F4C3A]">
                    {t.masteryScore}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E4DB] pb-4">
            <h2 className="font-serif text-xl font-semibold text-[#141413]">
              Recommended Focus Areas
            </h2>
            <span className="rounded-full bg-[#FBF4EA] px-3 py-1 text-xs font-semibold text-[#9A5B13]">
              {focusTopics.length} In Progress
            </span>
          </div>
          {focusTopics.length === 0 ? (
            <p className="text-sm text-[#78756E] leading-relaxed py-4">
              Complete the baseline diagnostic to identify priority syllabus
              topics.
            </p>
          ) : (
            <div className="space-y-3">
              {focusTopics.map((t) => (
                <div
                  key={t.topicId}
                  className="flex items-center justify-between rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-4"
                >
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-[#78756E]">
                      {t.topicCode} · {t.domain}
                    </div>
                    <div className="text-sm font-semibold text-[#141413] mt-0.5">
                      {t.topicName}
                    </div>
                    {t.commonErrors.length > 0 && (
                      <div className="text-xs text-[#9A5B13] mt-1">
                        Focus: {t.commonErrors.join(", ")}
                      </div>
                    )}
                  </div>
                  <span className="font-serif text-lg font-semibold text-[#9A5B13]">
                    {t.masteryScore}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* UK GDPR & Children's Privacy Assurance Card */}
      <div className="rounded-3xl border border-[#E8E4DB] bg-white p-6 flex items-start gap-4 text-xs text-[#575550] leading-relaxed">
        <ShieldCheck className="h-5 w-5 text-[#0F4C3A] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#141413]">
            UK GDPR & Age-Appropriate Design Safeguards:{" "}
          </span>
          We collect minimal personal data, never run behavioural advertising,
          and share preparation telemetry exclusively with linked parent or
          guardian accounts authorised via student email or invite code.
        </div>
      </div>
    </div>
  );
}

function AttemptsCountLabel(attemptsCount: number, minutes: number) {
  if (attemptsCount === 0) return "0 sessions completed";
  return `${attemptsCount} session(s) · ~${minutes} mins active`;
}
