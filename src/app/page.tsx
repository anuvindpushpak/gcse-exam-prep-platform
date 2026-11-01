"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  Layers,
  Lock,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { usePlatform } from "@/components/providers/PlatformProvider";

export default function LandingPage() {
  const router = useRouter();
  const {
    topics,
    products,
    entitlements,
    intelligenceProfile,
    openCheckout,
    simulateDiagnostic,
  } = usePlatform();
  const [simulating, setSimulating] = useState(false);

  const handleQuickDemoDiagnostic = async () => {
    setSimulating(true);
    try {
      await simulateDiagnostic();
      router.push("/dashboard");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-sky-800">
                <Target className="h-3.5 w-3.5 text-sky-600" />
                <span>
                  Edexcel (1MA1) · AQA (8300) · OCR (J560) — Foundation Tier Grade 4 System
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Turn GCSE Maths revision into a{" "}
                <span className="text-sky-600">measurable pathway</span> to Grade 4.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
                Stop jumping between disconnected PDFs and passive videos.
                Diagnose your exact topic gaps, earn partial{" "}
                <strong>Method Marks (M1)</strong> with step-by-step feedback,
                and sit realistic timed Mock Examinations — without relying on
                expensive private tutors.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/exam/diag-edexcel-foundation"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all"
                >
                  <ClipboardCheck className="h-4 w-4 text-sky-400" />
                  <span>Take Free Baseline Diagnostic</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleQuickDemoDiagnostic}
                  disabled={simulating}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-sky-600 bg-sky-50/70 px-5 py-3 text-sm font-bold text-sky-900 hover:bg-sky-100 transition-all"
                >
                  <Zap className="h-4 w-4 text-sky-600" />
                  <span>
                    {simulating
                      ? "Generating Profile..."
                      : "1-Click Simulate Diagnostic & View Student Hub"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div>
                  <div className="font-extrabold text-slate-900 text-base">
                    M1 + A1 Grading
                  </div>
                  <div>Symbolic step-by-step credit</div>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-base">
                    3 Full Mock Papers
                  </div>
                  <div>Non-Calc (1F) & Calc (2F/3F)</div>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-base">
                    100% Self-Service
                  </div>
                  <div>No tutors or video bloat</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Spine Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                      Core Loop Architecture
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      Complete Working Student Spine
                    </h2>
                  </div>
                  <span className="rounded-lg bg-sky-500/20 border border-sky-400/30 px-2.5 py-1 text-xs font-bold text-sky-300">
                    Live Readiness:{" "}
                    {intelligenceProfile?.overallReadinessScore || 0}%
                  </span>
                </div>

                <ol className="space-y-3 text-xs">
                  <li className="flex items-start gap-3 rounded-xl bg-slate-800/80 p-3 border border-slate-700/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-extrabold">
                      1
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-white">
                        Free Diagnostic Assessment (Lead Magnet)
                      </div>
                      <p className="text-slate-300 mt-0.5">
                        12 calibrated Edexcel 1MA1 questions across all 6 topics
                        pinpoint your distance to Grade 4 (62% target).
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl bg-slate-800/80 p-3 border border-slate-700/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-extrabold">
                      2
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-white">
                        Unlock £39.99 Grade 4 Preparation Pack
                      </div>
                      <p className="text-slate-300 mt-0.5">
                        Direct checkout or 1-click Parent Unlock Link activates
                        all 6 topic modules, worked solutions, and 3 Mock Exams.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl bg-slate-800/80 p-3 border border-slate-700/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-extrabold">
                      3
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-white">
                        Targeted Topic Study & Step-Marked Practice
                      </div>
                      <p className="text-slate-300 mt-0.5">
                        Concise written guides, worked examples, and interactive
                        practice with our GCSE Math Keypad & M1/A1 grader.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl bg-slate-800/80 p-3 border border-slate-700/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-extrabold">
                      4
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-white">
                        Full Timed Mock Exam & Readiness Report
                      </div>
                      <p className="text-slate-300 mt-0.5">
                        Distraction-free Exam Simulator with Official GCSE
                        Formulae Sheet, question flagging, and misconception
                        diagnostics.
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="flex gap-2 pt-1">
                  <Link
                    href="/dashboard"
                    className="flex-1 text-center rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-colors"
                  >
                    Open Student Dashboard →
                  </Link>
                  <Link
                    href="/admin"
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    AI Content Factory
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Interconnected Engines Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Modular Platform Architecture
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
            One Platform. Three Interconnected Engines.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Content is completely decoupled from application code, enabling seamless expansion across Edexcel, AQA, OCR, and additional GCSE/A-Level subjects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700 mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. Content Engine
            </h3>
            <p className="mt-1.5 text-xs text-slate-600">
              Structured syllabus specifications, concise non-video topic guides, declarative JSON-to-SVG geometric & statistical diagrams, and a governed 6-Agent AI question factory.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <li>• Zero LLM raster diagram hallucinations</li>
              <li>• Mandatory Symbolic Math Validation (Agent 3)</li>
              <li>• Human specialist approval gate before publish</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. Assessment Engine
            </h3>
            <p className="mt-1.5 text-xs text-slate-600">
              Powers the Free Baseline Diagnostic, topic practice sets, weekly timed challenges, and full Mock Examinations under authentic Non-Calculator and Calculator policies.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <li>• Partial Method Marks (M1) & Accuracy Marks (A1)</li>
              <li>• Algebraic, fractional & tolerance equivalence</li>
              <li>• Official GCSE Formulae Sheet & Math Keypad</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. Intelligence Engine
            </h3>
            <p className="mt-1.5 text-xs text-slate-600">
              Tracks question-level telemetry, detects recurring mathematical misconceptions, calculates live Grade 4 readiness, and ranks the highest-ROI next practice steps.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <li>• Live distance-to-Grade-4 mark tracker</li>
              <li>• Separate Non-Calc vs. Calculator accuracy</li>
              <li>• Linked Parent Progress Dashboard</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6 GCSE Maths Foundation Syllabus Domains */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Edexcel 1MA1 Foundation Syllabus
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              6 Core Topic Modules Weighted by Exam Marks
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-sky-700 hover:text-sky-800 inline-flex items-center gap-1"
          >
            <span>View Full Mastery Breakdown in Student Hub</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic) => {
            const isUnlocked = topic.isFreeSample || entitlements.hasFullPack;
            return (
              <div
                key={topic.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-sky-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                      {topic.code} · {topic.domain}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-800">
                        {topic.weightPercentage}% of Exam
                      </span>
                      {topic.isFreeSample ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Free Sample
                        </span>
                      ) : !isUnlocked ? (
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                      ) : null}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {topic.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/topics/${topic.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>
                      {isUnlocked
                        ? "Open Guide & Practise"
                        : "Preview Topic Guide"}
                    </span>
                  </Link>
                  {!isUnlocked && (
                    <button
                      type="button"
                      onClick={() =>
                        openCheckout("prod-gcse-maths-grade4-pack")
                      }
                      className="text-[11px] font-semibold text-amber-700 hover:underline"
                    >
                      Unlock Pack (£39.99)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Commercial Pricing Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Simple, Transparent Pricing
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Replace £50/hr Tutoring with a Structured Preparation System
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Start with our Free Baseline Diagnostic Assessment, then unlock the complete Grade 4 Preparation Pack or Weekly Practice Membership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {products.map((prod) => {
            const isOwned =
              (prod.id === "prod-gcse-maths-grade4-pack" &&
                entitlements.hasFullPack) ||
              (prod.id === "prod-weekly-maths-membership" &&
                entitlements.hasWeeklyMembership);
            const isPrimary = prod.type === "ONE_TIME_PACK";

            return (
              <div
                key={prod.id}
                className={`rounded-2xl border-2 p-6 flex flex-col justify-between ${
                  isPrimary
                    ? "border-slate-900 bg-white shadow-lg"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isPrimary
                          ? "bg-sky-100 text-sky-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {prod.badge || prod.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {prod.billingLabel}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">
                    {prod.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {prod.priceFormatted}
                    </span>
                    <span className="text-xs text-slate-500">
                      {prod.type === "ONE_TIME_PACK"
                        ? "one-off payment"
                        : "/ month"}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-600">
                    {prod.description}
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
                    {prod.features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isOwned ? (
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Award className="h-4 w-4" />
                      <span>Active on Your Account — Go to Student Hub</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCheckout(prod.id)}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                        isPrimary
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "bg-sky-600 text-white hover:bg-sky-700"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>
                        Unlock {prod.name} ({prod.priceFormatted})
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
