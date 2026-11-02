"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
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
          <FileText className="h-3.5 w-3.5 text-[#0F4C3A]" />
          <span>Terms of Service</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413] tracking-tight">
          Terms & Conditions of Use
        </h1>
        <p className="text-xs text-[#6E6B64]">
          Last updated: November 2026 · Examora Education Ltd
        </p>
      </div>

      <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-8 text-sm text-[#3D3B37] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            1. Digital Examination Preparation Licence
          </h2>
          <p>
            When you enrol in the Examora GCSE Mathematics Grade 4 Preparation
            Pack (£39.99 one-time payment) or the Weekly Practice Membership
            (£7.99/month), you receive a personal, non-transferable licence for
            one named student and their linked parent/guardian to access all
            included study guides, step-marked practice questions, and timed
            mock examinations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            2. Independent Curriculum Alignment Disclaimer
          </h2>
          <p>
            Examora practice papers, diagnostic assessments, and study resources
            are independently authored and symbolically verified to align with
            Pearson Edexcel (1MA1), AQA (8300), and OCR (J560) Foundation Tier
            specifications. Examora is an independent educational platform and
            is not affiliated with or endorsed by Pearson, AQA, or OCR.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            3. Passwordless Account Security
          </h2>
          <p>
            Accounts are authenticated via email confirmation codes. Users are
            responsible for maintaining the security of their registered email
            inbox and their Parent Link Code.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            4. Early Adopter & Scholarship Coupons
          </h2>
          <p>
            Promotional and early-adopter coupon codes (offering up to 100%
            discount) may be applied at checkout. Coupons carry no cash value
            and are subject to availability.
          </p>
        </section>
      </div>
    </div>
  );
}
