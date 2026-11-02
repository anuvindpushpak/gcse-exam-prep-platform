"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Layers,
  ShieldCheck,
} from "lucide-react";

interface CatalogueProductCard {
  id: string;
  title: string;
  valueOutcome: string;
  description: string;
  availabilityStatus: string;
  isAvailable: boolean;
  productHref?: string;
  diagnosticHref?: string;
}

const PREPARATION_CATALOGUE: CatalogueProductCard[] = [
  {
    id: "gcse-maths-foundation",
    title: "GCSE Mathematics — Foundation Tier",
    valueOutcome:
      "Secure a confident Grade 4 pass across Pearson Edexcel, AQA & OCR.",
    description:
      "A complete self-service preparation system combining a syllabus-wide diagnostic assessment, concise topic study guides, step-marked (M1/A1) practice, and full realistic mock examinations.",
    availabilityStatus: "Available Now",
    isAvailable: true,
    productHref: "/gcse-maths",
    diagnosticHref: "/exam/diag-edexcel-foundation",
  },
  {
    id: "gcse-english-language",
    title: "GCSE English Language",
    valueOutcome:
      "Master unseen text comprehension, language analysis & transactional writing for Grades 4–9.",
    description:
      "Structured reading and writing pathways calibrated to official AO1–AO6 assessment objectives, with guided paragraph scaffolds and full Paper 1 & Paper 2 simulations.",
    availabilityStatus: "In Curation · Coming Soon",
    isAvailable: false,
  },
  {
    id: "gcse-combined-science",
    title: "GCSE Combined Science (Trilogy)",
    valueOutcome:
      "Build exam readiness across Biology, Chemistry & Physics with step-marked quantitative and practical drills.",
    description:
      "Pinpoints cross-topic gaps across all six Combined Science papers, focusing on multi-step equation working, required practical variables, and extended-response precision.",
    availabilityStatus: "In Curation · Coming Soon",
    isAvailable: false,
  },
  {
    id: "gcse-maths-higher",
    title: "GCSE Mathematics — Higher Tier",
    valueOutcome:
      "Reach Grades 6–9 through advanced algebra, trigonometry, vectors & formal proof.",
    description:
      "Extends our symbolic step-grading engine to higher-tier problem solving, multi-line algebraic proof, and full Paper 1H, 2H, and 3H examination simulations.",
    availabilityStatus: "Planned Release",
    isAvailable: false,
  },
  {
    id: "11plus-grammar-entrance",
    title: "11+ & Grammar School Entrance",
    valueOutcome:
      "Develop calm speed and accuracy across Mathematics, Verbal & Non-Verbal Reasoning.",
    description:
      "Structured baseline diagnostics, timed section practice, and transparent guardian readiness reporting designed for selective school entrance examinations.",
    availabilityStatus: "Planned Release",
    isAvailable: false,
  },
  {
    id: "international-igcse-sat",
    title: "Cambridge IGCSE & Digital SAT",
    valueOutcome:
      "Achieve top international qualification bands with adaptive mock examinations.",
    description:
      "Tailored specification pathways for Cambridge IGCSE Mathematics (0580) and the College Board Digital SAT with full symbolic equivalence marking.",
    availabilityStatus: "Planned Release",
    isAvailable: false,
  },
];

export default function HomePage() {
  const availableProduct = PREPARATION_CATALOGUE[0];
  const upcomingProducts = PREPARATION_CATALOGUE.slice(1);

  return (
    <div className="bg-[#FAF9F5] text-[#141413]">
      {/* Section 1: Hero Section — Highlighting Examination Preparation Value & Grade Outcomes */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white px-4 py-1.5 text-xs font-medium text-[#3D3B37] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
              <span>Examora · Examination Preparation Platform</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-[#141413] leading-[1.1]">
              Structured preparation for{" "}
              <span className="italic font-normal text-[#0F4C3A]">
                confident examination grades.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#57554F] leading-relaxed max-w-2xl">
              Examora turns revision from unstructured guesswork into a
              measurable academic system trusted by parents, teachers, and
              students. Diagnose exact syllabus gaps, earn partial method credit
              on every step, and walk into the exam hall knowing your target
              grade is secure.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#product-catalogue"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-7 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-all"
              >
                <span>Explore Preparation Catalogue</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/exam"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D5CFC2] bg-white px-6 py-4 text-sm font-medium text-[#3D3B37] hover:border-[#141413] hover:text-[#141413] transition-all"
              >
                <span>Take Free Diagnostic</span>
              </Link>
            </div>

            {/* Outcome Pillars — Single-Line Titles */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-[#E8E4DB]">
              <div>
                <div className="font-serif text-lg sm:text-2xl font-medium text-[#141413] whitespace-nowrap">
                  Pinpoint Gaps
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Baseline diagnostic clarity
                </div>
              </div>
              <div>
                <div className="font-serif text-lg sm:text-2xl font-medium text-[#141413] whitespace-nowrap">
                  Method Marks
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Step-by-step M1 + A1 grading
                </div>
              </div>
              <div>
                <div className="font-serif text-lg sm:text-2xl font-medium text-[#141413] whitespace-nowrap">
                  Secure Grades
                </div>
                <div className="text-xs text-[#6E6B64] mt-0.5">
                  Readiness before exam day
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Photography */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-[2rem] border border-[#E8E4DB] bg-white p-3 shadow-sm">
              <img
                src="/images/hero-geometry.jpg"
                alt="Architectural mathematical instruments on warm travertine stone"
                className="w-full h-[360px] sm:h-[400px] object-cover rounded-[1.5rem]"
              />
              <div className="p-5 space-y-3.5">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-[#0F4C3A]">
                    Disciplined Preparation
                  </div>
                  <div className="font-serif text-lg sm:text-xl font-medium text-[#141413] mt-1 whitespace-nowrap">
                    Diagnose → Practise → Succeed
                  </div>
                </div>
                <div>
                  <Link
                    href="/gcse-maths"
                    className="inline-flex items-center gap-2 rounded-full bg-[#F4F2EC] px-4 py-2 text-xs font-semibold text-[#141413] hover:bg-[#E8E4DB] transition-colors"
                  >
                    <span className="text-[#0F4C3A] uppercase tracking-wider text-[10px] font-bold">
                      Flagship Product
                    </span>
                    <span>·</span>
                    <span>GCSE Maths →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Preparation Catalogue (Available Card + Upcoming Cards, High-Level Value, No Pricing) */}
      <section
        id="product-catalogue"
        className="border-y border-[#E8E4DB] bg-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-6 space-y-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-1.5 text-xs font-medium text-[#3D3B37] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
              <span>Preparation Catalogue</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
              Examination preparation systems.
            </h2>
            <p className="mt-2 text-base text-[#57554F]">
              Select an examination programme to explore the syllabus pathway or
              begin with a free diagnostic assessment.
            </p>
          </div>

          {/* Featured Available Product Card */}
          <div className="rounded-[2rem] border-2 border-[#0F4C3A] bg-[#FAF9F5] p-8 sm:p-12 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0F4C3A] px-3.5 py-1 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>{availableProduct.availabilityStatus}</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413]">
                  {availableProduct.title}
                </h3>

                <p className="text-base sm:text-lg font-medium text-[#0F4C3A]">
                  {availableProduct.valueOutcome}
                </p>

                <p className="text-sm sm:text-base text-[#57554F] leading-relaxed">
                  {availableProduct.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 shrink-0">
                <Link
                  href={availableProduct.productHref || "/gcse-maths"}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-7 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-all"
                >
                  <span>Explore Product Page</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={
                    availableProduct.diagnosticHref ||
                    "/exam/diag-edexcel-foundation"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#141413] bg-white px-7 py-4 text-sm font-semibold text-[#141413] hover:bg-[#141413] hover:text-white transition-all"
                >
                  <span>Start Free Diagnostic</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Product Cards Grid */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-medium text-[#141413]">
              Upcoming Examination Systems
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {upcomingProducts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-[#E8E4DB] bg-[#FAF9F5]/70 p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-[#E8E4DB] bg-white px-3 py-1 text-[11px] font-semibold text-[#57554F]">
                        {item.availabilityStatus}
                      </span>
                    </div>

                    <h4 className="font-serif text-xl font-medium text-[#141413]">
                      {item.title}
                    </h4>

                    <p className="text-sm font-medium text-[#0F4C3A] leading-snug">
                      {item.valueOutcome}
                    </p>

                    <p className="text-sm text-[#57554F] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8E4DB] flex items-center justify-between text-xs text-[#6E6B64]">
                    <span>Syllabus & diagnostic in preparation</span>
                    <span className="font-medium text-[#141413]">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: One Platform · Three Interconnected Engines */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-[2rem] border border-[#E8E4DB] bg-white p-3 shadow-sm">
              <img
                src="/images/calm-study.jpg"
                alt="Minimalist oak and marble study desk with geometric notebook"
                className="w-full h-[360px] sm:h-[400px] object-cover rounded-[1.5rem]"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              One Platform · Three Interconnected Engines
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413] leading-tight">
              Built for students, transparent for parents, governed by
              specialists.
            </h2>
            <p className="text-base text-[#57554F] leading-relaxed">
              Every product in our catalogue shares a unified core architecture:
              decoupled curriculum specifications, deterministic step-by-step
              grading, and live readiness analytics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl border border-[#E8E4DB] bg-white p-5">
                <Compass className="h-5 w-5 text-[#0F4C3A] mb-2" />
                <div className="font-serif text-base font-medium text-[#141413]">
                  1. Content Engine
                </div>
                <p className="text-xs text-[#6E6B64] mt-1 leading-relaxed">
                  Board-aligned syllabus guides, geometric diagrams & verified
                  question banks.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8E4DB] bg-white p-5">
                <Layers className="h-5 w-5 text-[#0F4C3A] mb-2" />
                <div className="font-serif text-base font-medium text-[#141413]">
                  2. Assessment Engine
                </div>
                <p className="text-xs text-[#6E6B64] mt-1 leading-relaxed">
                  Step-by-step symbolic M1 + A1 method marking & realistic timed
                  mock papers.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8E4DB] bg-white p-5">
                <ShieldCheck className="h-5 w-5 text-[#0F4C3A] mb-2" />
                <div className="font-serif text-base font-medium text-[#141413]">
                  3. Intelligence Engine
                </div>
                <p className="text-xs text-[#6E6B64] mt-1 leading-relaxed">
                  Personalised weakness detection, Grade 4 readiness tracking &
                  guardian reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
