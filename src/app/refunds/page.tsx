"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function RefundPolicyPage() {
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
          <span>Consumer Rights & Satisfaction Guarantee</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413] tracking-tight">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-[#6E6B64]">
          Last updated: November 2026 · Examora Education Ltd
        </p>
      </div>

      <div className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 shadow-sm space-y-8 text-sm text-[#3D3B37] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            1. 14-Day Peace-of-Mind Refund Guarantee (One-Time Packs)
          </h2>
          <p>
            We want every parent and student to feel confident in their
            preparation. If you purchase the{" "}
            <strong>GCSE Mathematics Grade 4 Preparation Pack (£39.99)</strong>{" "}
            and decide within 14 days of purchase that it is not right for your
            child, simply contact us for a full 100% refund—no complicated forms
            required.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            2. Weekly Practice Membership (£7.99/month)
          </h2>
          <p>
            Monthly memberships can be cancelled at any time with zero notice
            period. When cancelled, your student retains access until the end of
            the current monthly billing cycle and will not be billed again.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-[#141413]">
            3. How to Request a Refund or Cancellation
          </h2>
          <p>
            Send us a message on our{" "}
            <Link
              href="/contact"
              className="font-semibold text-[#0F4C3A] underline"
            >
              Contact page
            </Link>{" "}
            with your account email address. Refunds are processed back to your
            original payment method within 3–5 working days.
          </p>
        </section>
      </div>
    </div>
  );
}
