"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  FileText,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { usePlatform } from "@/components/providers/PlatformProvider";

export default function GcseMathsProductPage() {
  const {
    isAuthenticated,
    topics,
    products,
    entitlements,
    openCheckout,
    openAuth,
  } = usePlatform();

  const hasUnlockedPack = isAuthenticated && entitlements.hasFullPack;

  return (
    <div className="bg-[#FAF9F5] text-[#141413]">
      {/* Top Breadcrumb Bar back to Master Product Catalogue */}
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E4DB] pb-4 text-xs text-[#6E6B64]">
          <Link
            href="/#product-catalogue"
            className="inline-flex items-center gap-2 font-medium text-[#3D3B37] hover:text-[#0F4C3A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Products</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono uppercase tracking-wider text-[#0F4C3A] font-semibold">
              Flagship Product · GCSE Mathematics (Foundation Tier)
            </span>
            {hasUnlockedPack ? (
              <Link
                href="/dashboard"
                className="font-semibold text-[#0F4C3A] underline underline-offset-4"
              >
                Open Your Student Hub →
              </Link>
            ) : !isAuthenticated ? (
              <button
                type="button"
                onClick={() => openAuth("SIGN_IN")}
                className="font-semibold text-[#141413] underline underline-offset-4 hover:text-[#0F4C3A]"
              >
                Already enrolled? Sign in →
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Section 1: Product Hero — Designed for Clear Commercial Conversion */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 sm:pt-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white px-4 py-1.5 text-xs font-medium text-[#3D3B37] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
              <span>Pearson Edexcel (1MA1) · AQA (8300) · OCR (J560)</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] font-medium tracking-tight text-[#141413] leading-[1.12]">
              GCSE Mathematics{" "}
              <span className="italic font-normal text-[#0F4C3A]">
                Grade 4 Preparation System.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#57554F] leading-relaxed max-w-2xl">
              Built specifically for Foundation Tier students aiming to secure a
              confident Grade 4 pass. Diagnose your exact syllabus gaps for
              free, master every topic with partial method credit (M1 + A1), and
              sit realistic timed mock examinations.
            </p>

            {/* Primary & Secondary Commercial CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              {hasUnlockedPack ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-all"
                >
                  <span>Continue in Your Student Hub</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Enrol in Grade 4 Pack · £39.99</span>
                </button>
              )}

              <Link
                href="/exam"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#141413] bg-white px-7 py-4 text-sm font-semibold text-[#141413] hover:bg-[#141413] hover:text-white transition-all"
              >
                <span>Take Free Diagnostic Test</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E8E4DB]">
              <div>
                <div className="font-serif text-xl sm:text-2xl font-medium text-[#141413] whitespace-nowrap">
                  6 Modules
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Complete Foundation syllabus
                </div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-medium text-[#141413] whitespace-nowrap">
                  M1 + A1 Grading
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Step-by-step method credit
                </div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-medium text-[#141413] whitespace-nowrap">
                  3 Mock Papers
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Non-Calculator & Calculator
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Summary Card */}
          <div className="lg:col-span-5">
            <div className="rounded-[2rem] border border-[#E8E4DB] bg-white p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E4DB] pb-5">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0F4C3A]">
                    What You Receive
                  </span>
                  <h2 className="font-serif text-2xl font-medium text-[#141413] mt-1">
                    Complete Preparation Pack
                  </h2>
                </div>
                <div className="text-right">
                  <div className="font-serif text-3xl font-semibold text-[#141413]">
                    £39.99
                  </div>
                  <div className="text-[11px] text-[#6E6B64]">
                    One-time payment
                  </div>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-[#3D3B37]">
                {[
                  "Free 12-question Baseline Diagnostic Assessment",
                  "All 6 Foundation Tier syllabus study guides & formula sheets",
                  "Interactive question bank with M1 intermediate working marks",
                  "3 full timed Mock Examinations (Paper 1F, Paper 2F & Paper 3F)",
                  "Live Grade 4 Readiness Score (62% pass benchmark)",
                  "Linked Guardian Dashboard for parent progress tracking",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-[#0F4C3A] shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                {hasUnlockedPack ? (
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#E6F0EC] px-6 py-4 text-sm font-semibold text-[#0F4C3A]"
                  >
                    <span>Unlocked on Your Account — Go to Student Hub →</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Unlock Full Access Now · £39.99</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How the Customer Journey Works (4 Steps) */}
      <section className="border-y border-[#E8E4DB] bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-14 space-y-3">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-1.5 text-xs font-medium text-[#3D3B37]">
              <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
              <span>The Student Journey</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
              From baseline diagnostic to Grade 4 readiness.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              {
                num: "01",
                badge: "Free for All Visitors",
                title: "Baseline Diagnostic",
                body: "Sit our 12-question diagnostic in the Exam Room to measure your starting score and uncover topic-level weaknesses.",
              },
              {
                num: "02",
                badge: "Included in Pack",
                title: "Concise Topic Study",
                body: "Review structured study guides, key rules, and examiner-annotated worked examples for every weak syllabus topic.",
              },
              {
                num: "03",
                badge: "Included in Pack",
                title: "Step-Marked Practice",
                body: "Practise one question at a time and enter intermediate working steps to earn M1 method marks — just like the real GCSE.",
              },
              {
                num: "04",
                badge: "Included in Pack",
                title: "Full Mock Examinations",
                body: "Complete timed Non-Calculator and Calculator mock papers and track your readiness score past the 62% Grade 4 pass line.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="border-t border-[#E8E4DB] pt-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-[#0F4C3A]">
                    {step.num}
                  </span>
                  <span className="rounded-full bg-[#FAF9F5] border border-[#E8E4DB] px-2.5 py-0.5 text-[10px] font-semibold text-[#57554F]">
                    {step.badge}
                  </span>
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

      {/* Section 3: The Six Syllabus Modules (With Free Sample vs Paid Pack Gating) */}
      <section className="bg-[#FAF9F5] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white px-4 py-1.5 text-xs font-medium text-[#3D3B37]">
                <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
                <span>Curriculum & Syllabus Coverage</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
                Six structured Foundation modules.
              </h2>
              <p className="text-sm sm:text-base text-[#57554F]">
                Preview Module 01 for free below. Enrol in the Grade 4
                Preparation Pack to unlock all six syllabus modules and the
                complete question bank.
              </p>
            </div>

            {!hasUnlockedPack && (
              <button
                type="button"
                onClick={() => openCheckout("prod-gcse-maths-grade4-pack")}
                className="inline-flex items-center gap-2 rounded-full bg-[#141413] px-6 py-3 text-xs font-semibold text-white hover:bg-[#2C2C2A] transition-colors shrink-0"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Unlock All 6 Modules · £39.99</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, index) => {
              const isUnlocked = topic.isFreeSample || hasUnlockedPack;
              return (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className={`group flex flex-col justify-between rounded-3xl border p-8 transition-all ${
                    isUnlocked
                      ? "border-[#E8E4DB] bg-white hover:border-[#0F4C3A] hover:shadow-md"
                      : "border-[#E8E4DB] bg-white/75 hover:border-[#141413]"
                  }`}
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
                    {isUnlocked ? (
                      <>
                        <span className="text-[#0F4C3A] inline-flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>
                            {topic.isFreeSample && !hasUnlockedPack
                              ? "Preview Free Sample Module"
                              : "Open Study Guide & Practice"}
                          </span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#0F4C3A] transition-transform group-hover:translate-x-1" />
                      </>
                    ) : (
                      <>
                        <span className="text-[#6E6B64] inline-flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5" />
                          <span>Included in Full Pack</span>
                        </span>
                        <span className="text-[#0F4C3A]">Unlock →</span>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Enrolment & Membership Options */}
      <section className="border-t border-[#E8E4DB] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-1.5 text-xs font-medium text-[#3D3B37]">
              <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
              <span>Enrolment Options</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
              Complete self-service preparation, for less than a single tutoring
              hour.
            </h2>
            <p className="text-base text-[#57554F]">
              Purchase once for full access to the GCSE Maths Grade 4
              Preparation Pack, or add our optional weekly practice membership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((prod) => {
              const isOwned =
                isAuthenticated &&
                ((prod.id === "prod-gcse-maths-grade4-pack" &&
                  entitlements.hasFullPack) ||
                  (prod.id === "prod-weekly-maths-membership" &&
                    entitlements.hasWeeklyMembership));
              const isPrimary = prod.type === "ONE_TIME_PACK";

              return (
                <div
                  key={prod.id}
                  className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between border transition-all ${
                    isPrimary
                      ? "border-2 border-[#0F4C3A] bg-[#FAF9F5] shadow-sm"
                      : "border border-[#E8E4DB] bg-white"
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
                          Enrol in {prod.name} · {prod.priceFormatted}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Parent & Student Frequently Asked Questions */}
      <section className="border-t border-[#E8E4DB] bg-[#FAF9F5] py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="max-w-2xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white px-4 py-1.5 text-xs font-medium text-[#3D3B37]">
              <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
              <span>Parent & Student FAQ</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
              Clear answers before you enrol.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Which GCSE examination boards are supported?",
                a: "The system is aligned to Pearson Edexcel (1MA1), AQA (8300), and OCR (J560) Foundation Tier specifications, calibrating your Grade 4 pass target to your chosen board (62% Edexcel, 60% AQA, 58% OCR).",
              },
              {
                q: "How does step-by-step M1 + A1 method marking work?",
                a: "Unlike basic multiple-choice apps, Examora awards partial M1 method marks for valid intermediate working steps even when a final arithmetic slip occurs—mirroring official GCSE mark schemes.",
              },
              {
                q: "How does this compare to hiring a private maths tutor?",
                a: "A private tutor typically costs £40–£60 for a single hour. For £39.99 one-time, your child receives unlimited diagnostic pinpointing, all 6 syllabus modules, infinite fresh number variations, and 3 full mock exams.",
              },
              {
                q: "How do parents track progress?",
                a: "Every student account includes a linked Guardian Dashboard showing plain-English Grade 4 readiness, distance in marks to the pass threshold, and top priority focus areas.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[#E8E4DB] bg-white p-7 space-y-2.5 shadow-sm"
              >
                <h3 className="font-serif text-lg font-medium text-[#141413]">
                  {faq.q}
                </h3>
                <p className="text-sm text-[#57554F] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
