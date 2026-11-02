"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20 space-y-10">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F4C3A] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Examora</span>
        </Link>

        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white px-4 py-1.5 text-xs font-medium text-[#3D3B37] shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-[#0F4C3A]" />
          <span>UK GDPR & ICO Children&apos;s Code Compliance</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413] tracking-tight">
          Privacy & Children&apos;s Data Protection Policy
        </h1>
        <p className="text-xs text-[#6E6B64]">
          Last updated: November 2026 · Examora Education Ltd (United Kingdom)
        </p>
      </div>

      <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-8 text-sm text-[#3D3B37] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            1. Data Minimisation & Age-Appropriate Design
          </h2>
          <p>
            Examora is designed in accordance with the UK General Data
            Protection Regulation (UK GDPR) and the Information
            Commissioner&apos;s Office (ICO) Age-Appropriate Design Code
            (Children&apos;s Code). High-privacy settings are enabled by default
            for all student accounts. We collect only the minimum information
            required to deliver personalised GCSE examination preparation:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#57554F]">
            <li>Student first name, optional last name, and email address.</li>
            <li>Selected examination board (Edexcel, AQA, or OCR) and target grade.</li>
            <li>
              Question-level working steps, scores, and syllabus mastery
              telemetry.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            2. Zero Behavioural Advertising or Third-Party Profiling
          </h2>
          <p>
            We never sell, rent, or share student data with advertising networks
            or data brokers. Student assessment data is used strictly to compute
            Grade 4 readiness scores, identify mathematical misconceptions, and
            recommend syllabus revision steps.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            3. Parent & Guardian Transparency
          </h2>
          <p>
            A Parent or Guardian account may view a student&apos;s readiness
            telemetry only when linked via the student&apos;s registered email
            address or unique Parent Link Code. Students can see their active
            Parent Link Code at any time inside their Student Hub.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            4. Your Rights (Access, Rectification & Erasure)
          </h2>
          <p>
            Students and parents have the right to request a full export or
            immediate deletion of their account and assessment history at any
            time via our{" "}
            <Link
              href="/contact"
              className="font-semibold text-[#0F4C3A] underline"
            >
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
