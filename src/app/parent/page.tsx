"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Clock,
  LockOpen,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { usePlatform } from "@/components/providers/PlatformProvider";

export default function ParentDashboardPage() {
  const {
    targetStudent,
    attempts,
    entitlements,
    intelligenceProfile,
    openCheckout,
    simulateDiagnostic,
  } = usePlatform();

  const studentName = targetStudent
    ? `${targetStudent.firstName} ${targetStudent.lastName || ""}`
    : "Leo Carter";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Parent Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
              <UserCheck className="h-3.5 w-3.5" />
              <span>
                Linked Parent Account · Student Invite Code:{" "}
                {targetStudent?.parentInviteCode || "PARENT-LEO-2027"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-1">
              Parent Progress Report for {studentName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Plain-English summary of {targetStudent?.firstName || "Leo"}&apos;s
              preparation towards a GCSE Mathematics Grade 4 pass ({targetStudent?.selectedBoard || "Edexcel"} Foundation Tier).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!entitlements.hasFullPack ? (
              <button
                type="button"
                onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-xs font-extrabold text-white shadow-sm hover:bg-sky-700"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  Unlock {targetStudent?.firstName}&apos;s Grade 4 Pack (£39.99)
                </span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-4 py-2.5 text-xs font-extrabold text-emerald-900">
                <Award className="h-4 w-4" />
                <span>Grade 4 Preparation Pack Active</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Plain-English Executive Summary for Parents */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">
            Current Readiness Score
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {readiness}%
          </div>
          <div className="mt-1 text-xs font-bold text-sky-700">
            {intelligenceProfile?.estimatedCurrentGrade}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            A score of 62%+ indicates strong readiness for a GCSE Grade 4 pass.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">
            Improvement Since Baseline
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600">
            {intelligenceProfile?.improvementDelta !== undefined &&
            intelligenceProfile.improvementDelta >= 0
              ? `+${intelligenceProfile.improvementDelta}%`
              : `${intelligenceProfile?.improvementDelta || 0}%`}
          </div>
          <div className="mt-1 text-xs font-medium text-slate-700">
            Baseline:{" "}
            {intelligenceProfile?.baselineDiagnosticScore !== undefined
              ? `${intelligenceProfile.baselineDiagnosticScore}%`
              : "Not taken yet"}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Tracks mark gains from initial diagnostic to latest test.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">
            Active Practice Telemetry
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {intelligenceProfile?.totalQuestionsAttempted || 0} Qs
          </div>
          <div className="mt-1 text-xs font-medium text-slate-700 inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {AttemptsCountLabel(
                attempts.length,
                intelligenceProfile?.totalPracticeMinutes || 0
              )}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Verified step-marked questions completed on platform.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">
            Working Steps Habits (M1)
          </div>
          <div className="mt-2 text-3xl font-extrabold text-sky-700">
            {intelligenceProfile?.methodMarkCaptureRate || 0}%
          </div>
          <div className="mt-1 text-xs font-medium text-slate-700">
            Method marks earned
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Shows how consistently {targetStudent?.firstName} writes down method steps.
          </p>
        </div>
      </div>

      {attempts.length === 0 && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900">
              No Assessments Completed Yet
            </h2>
            <p className="text-xs text-slate-600">
              Once {targetStudent?.firstName} completes the Free Baseline
              Diagnostic Assessment, you will see their topic strengths, areas
              requiring extra practice, and mock exam scores here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => simulateDiagnostic()}
            className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            Simulate {targetStudent?.firstName}&apos;s Baseline Diagnostic Now
          </button>
        </div>
      )}

      {/* Strengths vs Areas Needing Additional Practice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-emerald-900">
            Topics On Track for Grade 4 ({strongTopics.length})
          </h2>
          {strongTopics.length === 0 ? (
            <p className="text-xs text-slate-500">
              Topics reaching 65%+ mastery will appear here as{" "}
              {targetStudent?.firstName} completes practice sets.
            </p>
          ) : (
            <div className="space-y-2.5">
              {strongTopics.map((t) => (
                <div
                  key={t.topicId}
                  className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {t.topicCode} · {t.domain}
                    </div>
                    <div className="text-slate-600">{t.topicName}</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-extrabold text-emerald-800">
                    {t.masteryScore}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-rose-900">
            Topics Requiring Additional Practice ({focusTopics.length})
          </h2>
          {focusTopics.length === 0 ? (
            <p className="text-xs text-slate-500">
              Complete the baseline diagnostic to identify priority topics.
            </p>
          ) : (
            <div className="space-y-2.5">
              {focusTopics.map((t) => (
                <div
                  key={t.topicId}
                  className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/40 p-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {t.topicCode} · {t.domain}
                    </div>
                    <div className="text-slate-600">
                      {t.commonErrors.length > 0
                        ? `Focus area: ${t.commonErrors.join(", ")}`
                        : t.topicName}
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 font-extrabold text-rose-800">
                    {t.masteryScore}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* UK GDPR & Children's Privacy Assurance Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-3.5 text-xs text-slate-600">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">
            UK GDPR & Age-Appropriate Design Safeguards:{" "}
          </span>
          We collect minimal personal data, never run behavioural advertising,
          and share preparation telemetry exclusively with linked parent or
          guardian accounts authorised via student invite code.
        </div>
      </div>
    </div>
  );
}

function AttemptsCountLabel(attemptsCount: number, minutes: number) {
  if (attemptsCount === 0) return "0 sessions completed";
  return `${attemptsCount} session(s) · ~${minutes} mins active`;
}
