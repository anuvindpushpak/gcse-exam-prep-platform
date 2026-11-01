"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Lock,
  Sparkles,
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
    <div className="bg-[#FAF9F5] text-[#141413]">
      {/* Hero Section — Spacious Editorial Light Mode */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white px-4 py-1.5 text-xs font-medium text-[#3D3B37] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
              <span>Edexcel · AQA · OCR — Foundation Tier to Grade 4</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] font-medium tracking-tight text-[#141413] leading-[1.12]">
              A quiet, structured path to your{" "}
              <span className="italic font-normal text-[#0F4C3A]">
                GCSE Maths
              </span>{" "}
              pass.
            </h1>

            <p className="text-base sm:text-lg text-[#57554F] leading-relaxed max-w-xl">
              Replace fragmented revision notes and expensive private tutoring
              with a precision preparation system. Diagnose your exact syllabus
              gaps, earn partial method credit on every step, and sit realistic
              mock examinations at your own pace.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <Link
                href="/exam/diag-edexcel-foundation"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-7 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-all"
              >
                <span>Begin Free Diagnostic</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleQuickDemoDiagnostic}
                disabled={simulating}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D5CFC2] bg-white px-6 py-4 text-sm font-medium text-[#3D3B37] hover:border-[#141413] hover:text-[#141413] transition-all"
              >
                <span>
                  {simulating
                    ? "Preparing profile..."
                    : "Preview with sample diagnostic"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E8E4DB]">
              <div>
                <div className="font-serif text-2xl font-medium text-[#141413]">
                  M1 + A1
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Step-by-step method credit
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl font-medium text-[#141413]">
                  3 Papers
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Non-Calculator & Calculator
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl font-medium text-[#141413]">
                  62% Target
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Measured Grade 4 benchmark
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Photography & Floating Light Card */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-[#E8E4DB] bg-white p-3 shadow-sm">
                <img
                  src="/images/hero-geometry.jpg"
                  alt="Minimalist architectural mathematical instruments on warm travertine stone"
                  className="w-full h-[380px] sm:h-[440px] object-cover rounded-[1.5rem]"
                />
              </div>

              {/* Floating Light-Mode Readiness Card */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:left-6 sm:right-6 rounded-2xl border border-[#E8E4DB] bg-white/95 backdrop-blur-md p-5 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-[#0F4C3A]">
                      Continuous Readiness Telemetry
                    </div>
                    <div className="font-serif text-lg font-medium text-[#141413] mt-0.5">
                      Diagnose → Understand → Practise → Assess
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="shrink-0 rounded-full bg-[#F4F2EC] px-4 py-2 text-xs font-semibold text-[#141413] hover:bg-[#E8E4DB] transition-colors"
                  >
                    Open Student Hub →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Four-Step Method (Architectural Grid) */}
      <section className="border-y border-[#E8E4DB] bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              How The System Works
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
              Designed for clarity, not cognitive overload.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              {
                num: "01",
                title: "Baseline Diagnostic",
                body: "A calm 12-question assessment across all six Foundation domains establishes your starting distance from a Grade 4 pass.",
              },
              {
                num: "02",
                title: "Concise Topic Study",
                body: "No passive video lectures. Read crisp written explanations, essential formulae, and examiner-annotated worked examples.",
              },
              {
                num: "03",
                title: "Method-Marked Practice",
                body: "Enter intermediate working steps to earn M1 method marks even if your final arithmetic slips — just like a real GCSE paper.",
              },
              {
                num: "04",
                title: "Realistic Mock Exams",
                body: "Sit full Non-Calculator and Calculator papers with the official GCSE Formulae Sheet and receive an instant remediation report.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="border-t border-[#E8E4DB] pt-6 space-y-3"
              >
                <div className="font-serif text-2xl text-[#0F4C3A]">
                  {step.num}
                </div>
                <h3 className="text-base font-semibold text-[#141413]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#57554F] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Editorial Feature Split with Bespoke Study Illustration */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-[2rem] border border-[#E8E4DB] bg-white p-3 shadow-sm">
              <img
                src="/images/calm-study.jpg"
                alt="Minimalist study desk with geometric notebook and fountain pen"
                className="w-full h-[360px] sm:h-[420px] object-cover rounded-[1.5rem]"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              Three Interconnected Engines
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413] leading-tight">
              Every wrong answer tells a story. We read the working, not just
              the final box.
            </h2>
            <p className="text-base text-[#57554F] leading-relaxed">
              Most online revision tools mark a 3-mark question as simply wrong
              if you make a small calculation slip on the final line. Our
              symbolic grading engine evaluates your intermediate working steps
              to award partial <strong>Method Marks (M1)</strong> and pinpoint
              the exact misconception holding you back.
            </p>

            <div className="space-y-4 pt-2">
              <div className="rounded-2xl border border-[#E8E4DB] bg-white p-5">
                <div className="text-sm font-semibold text-[#141413]">
                  1. Content Engine
                </div>
                <p className="text-sm text-[#57554F] mt-1">
                  Decoupled syllabus specifications, declarative vector geometry
                  diagrams, and human-reviewed AI question variations.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E8E4DB] bg-white p-5">
                <div className="text-sm font-semibold text-[#141413]">
                  2. Assessment Engine
                </div>
                <p className="text-sm text-[#57554F] mt-1">
                  Symbolic equivalence grading for fractions, algebra, and
                  numerical tolerances across Non-Calculator and Calculator papers.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E8E4DB] bg-white p-5">
                <div className="text-sm font-semibold text-[#141413]">
                  3. Intelligence Engine
                </div>
                <p className="text-sm text-[#57554F] mt-1">
                  Live Grade 4 readiness tracking and plain-English progress
                  sharing for parents and guardians.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: The Six Syllabus Domains (Spacious, Uncluttered Index) */}
      <section className="border-t border-[#E8E4DB] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
                Foundation Tier Curriculum
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
                Six structured syllabus modules.
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F4C3A] hover:underline"
            >
              <span>View your personal mastery matrix</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, index) => {
              const isUnlocked = topic.isFreeSample || entitlements.hasFullPack;
              return (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="group flex flex-col justify-between rounded-3xl border border-[#E8E4DB] bg-[#FAF9F5]/60 p-8 hover:bg-white hover:border-[#0F4C3A]/40 hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#6E6B64]">
                      <span className="font-mono font-medium uppercase tracking-wider">
                        0{index + 1} · {topic.domain}
                      </span>
                      <span>{topic.weightPercentage}% of exam</span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#141413] group-hover:text-[#0F4C3A] transition-colors">
                      {topic.name}
                    </h3>

                    <p className="text-sm text-[#57554F] leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#E8E4DB]/80 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#0F4C3A] inline-flex items-center gap-1.5">
                      <span>Read study guide & practise</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    {topic.isFreeSample ? (
                      <span className="text-[#0F4C3A] font-medium">
                        Free Sample
                      </span>
                    ) : !isUnlocked ? (
                      <Lock className="h-3.5 w-3.5 text-[#969289]" />
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Calm, Transparent Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
            Enrolment & Membership
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
            Complete self-service preparation, for less than a single tutoring
            hour.
          </h2>
          <p className="mt-3 text-base text-[#57554F]">
            Begin with the free baseline diagnostic assessment. Unlock the
            complete Grade 4 Preparation Pack whenever you are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between border transition-all ${
                  isPrimary
                    ? "border-[#0F4C3A] bg-white shadow-sm"
                    : "border-[#E8E4DB] bg-[#F4F2EC]/70"
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-widest text-[#0F4C3A]">
                      {prod.badge || prod.type}
                    </span>
                    <span className="text-[#6E6B64]">{prod.billingLabel}</span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-medium text-[#141413]">
                      {prod.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-serif text-4xl font-medium text-[#141413]">
                        {prod.priceFormatted}
                      </span>
                      <span className="text-xs text-[#6E6B64]">
                        {prod.type === "ONE_TIME_PACK"
                          ? "one-time payment"
                          : "per month"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#57554F] leading-relaxed">
                    {prod.description}
                  </p>

                  <ul className="space-y-3 border-t border-[#E8E4DB] pt-6">
                    {prod.features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-[#3D3B37]"
                      >
                        <Check className="h-4 w-4 text-[#0F4C3A] shrink-0 mt-1" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 pt-6 border-t border-[#E8E4DB]">
                  {isOwned ? (
                    <Link
                      href="/dashboard"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#E6F0EC] px-6 py-3.5 text-sm font-semibold text-[#0F4C3A]"
                    >
                      <span>Active on your account — Open Student Hub</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCheckout(prod.id)}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all ${
                        isPrimary
                          ? "bg-[#0F4C3A] text-white hover:bg-[#0B382B]"
                          : "border border-[#141413] bg-white text-[#141413] hover:bg-[#141413] hover:text-white"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>
                        Unlock {prod.name} · {prod.priceFormatted}
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
