"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react";
import { usePlatform } from "@/components/providers/PlatformProvider";

export default function ExamRoomSelectionPage() {
  const {
    isAuthenticated,
    assessmentTemplates,
    attempts,
    entitlements,
    openCheckout,
    openAuth,
  } = usePlatform();

  const diagnosticTemplate =
    assessmentTemplates.find((t) => t.mode === "DIAGNOSTIC") ||
    assessmentTemplates[0];

  const mockTemplates = assessmentTemplates.filter(
    (t) => t.mode === "MOCK_EXAM"
  );

  const latestDiagnosticAttempt = attempts.find(
    (a) => a.mode === "DIAGNOSTIC"
  );

  const hasUnlockedMocks = isAuthenticated && entitlements.hasFullPack;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20 space-y-14">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white px-4 py-1.5 text-xs font-medium text-[#3D3B37] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
          <span>Examora · Examination Room</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413] tracking-tight">
          Select an assessment to begin.
        </h1>

        <p className="text-base text-[#57554F] leading-relaxed">
          Start with the free Baseline Diagnostic Assessment to measure your
          current Grade 4 readiness. The countdown timer will only start once
          you open the paper and click <strong>Start the Test</strong>.
        </p>
      </div>

      {/* Primary Card: Baseline Diagnostic Assessment (Free for All Visitors) */}
      {diagnosticTemplate && (
        <div className="rounded-[2rem] border-2 border-[#0F4C3A] bg-white p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-3.5 py-1 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>Baseline Diagnostic Test · Free Access</span>
                </span>
                {latestDiagnosticAttempt && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F0EC] px-3 py-1 text-xs font-semibold text-[#0F4C3A]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      Last Score: {latestDiagnosticAttempt.percentageScore}%
                    </span>
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#141413]">
                {diagnosticTemplate.title}
              </h2>

              <p className="text-sm sm:text-base text-[#57554F] leading-relaxed">
                {diagnosticTemplate.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-[#3D3B37]">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#0F4C3A]" />
                  <span>
                    {diagnosticTemplate.questionIds.length} Questions ·{" "}
                    {diagnosticTemplate.totalMarks} Marks
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#0F4C3A]" />
                  <span>{diagnosticTemplate.timeLimitMinutes} Minutes</span>
                </span>
                <span className="text-[#6E6B64]">
                  Step-by-step M1 + A1 method marking
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href={`/exam/${diagnosticTemplate.slug}`}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-7 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-all"
              >
                <span>Select Diagnostic Test</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {latestDiagnosticAttempt && (
                <Link
                  href={`/exam/${diagnosticTemplate.slug}?review=${latestDiagnosticAttempt.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-[#D5CFC2] bg-[#FAF9F5] px-6 py-3 text-xs font-semibold text-[#3D3B37] hover:border-[#141413] transition-colors"
                >
                  Review Previous Report
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Section: Full Mock Examination Papers (Paid Product Feature) */}
      {mockTemplates.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E4DB] pb-4">
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#141413]">
                Full GCSE Mock Examination Papers
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6B64] mt-1">
                Realistic Non-Calculator and Calculator examination simulations
                included in the GCSE Maths Grade 4 Preparation Pack.
              </p>
            </div>

            {!hasUnlockedMocks && (
              <div className="flex items-center gap-3">
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => openAuth("SIGN_IN")}
                    className="text-xs font-semibold text-[#3D3B37] underline underline-offset-4 hover:text-[#141413]"
                  >
                    Sign in
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#141413] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2C2C2A] transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Unlock All Mock Papers · £39.99</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTemplates.map((mock) => {
              const pastAttempt = attempts.find(
                (a) => a.templateId === mock.id
              );

              return (
                <div
                  key={mock.id}
                  className={`rounded-3xl border p-7 flex flex-col justify-between space-y-6 ${
                    hasUnlockedMocks
                      ? "border-[#E8E4DB] bg-white shadow-sm"
                      : "border-[#E8E4DB] bg-white/70"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-medium uppercase text-[#0F4C3A]">
                        {mock.calculatorPolicy === "NON_CALCULATOR"
                          ? "Paper 1F · Non-Calc"
                          : `Paper ${mock.paperNumber || 2}F · Calc`}
                      </span>
                      {hasUnlockedMocks ? (
                        <span className="rounded-full bg-[#E6F0EC] px-2.5 py-0.5 text-[10px] font-semibold text-[#0F4C3A]">
                          Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-2.5 py-0.5 text-[10px] font-semibold text-[#6E6B64]">
                          <Lock className="h-3 w-3" />
                          <span>Full Pack</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#141413]">
                      {mock.title}
                    </h3>

                    <p className="text-xs text-[#57554F] leading-relaxed">
                      {mock.subtitle}
                    </p>

                    <div className="text-xs text-[#6E6B64] pt-1">
                      {mock.questionIds.length} Questions · {mock.totalMarks}{" "}
                      Marks · {mock.timeLimitMinutes} Mins
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E4DB]">
                    {hasUnlockedMocks ? (
                      <Link
                        href={`/exam/${mock.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-5 py-3 text-xs font-semibold text-white hover:bg-[#0B382B] transition-colors"
                      >
                        <span>
                          {pastAttempt
                            ? `Retake Paper (Last: ${pastAttempt.percentageScore}%)`
                            : "Select Mock Paper"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          openCheckout("prod-gcse-maths-grade4-pack")
                        }
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D5CFC2] bg-[#FAF9F5] px-5 py-3 text-xs font-semibold text-[#3D3B37] hover:border-[#141413] hover:text-[#141413] transition-colors"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Unlock with Grade 4 Pack</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
