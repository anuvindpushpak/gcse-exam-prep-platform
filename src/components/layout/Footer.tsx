"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E8E4DB] bg-white text-[#141413]">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Column 1: Brand & Mission (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F4C3A] text-[#FAF9F5] font-serif text-lg font-medium">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-semibold tracking-tight text-[#141413] leading-none">
                  Examora
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-[#6E6B64] mt-0.5">
                  Examination Excellence
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#57554F] leading-relaxed max-w-sm">
              Structured, self-service examination preparation. We help students
              diagnose knowledge gaps, practise with partial method credit, and
              achieve target grades independently.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-1.5 text-xs text-[#3D3B37]">
              <ShieldCheck className="h-4 w-4 text-[#0F4C3A]" />
              <span>UK GDPR & Children&apos;s Privacy Compliant</span>
            </div>
          </div>

          {/* Column 2: Live Preparation System (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              Preparation Systems
            </div>
            <ul className="space-y-2.5 text-sm text-[#57554F]">
              <li>
                <Link
                  href="/gcse-maths"
                  className="hover:text-[#0F4C3A] font-medium text-[#141413] transition-colors"
                >
                  GCSE Mathematics (Grade 4)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Contact Link (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A]">
              Platform
            </div>
            <ul className="space-y-2.5 text-sm text-[#57554F]">
              <li>
                <Link
                  href="/#product-catalogue"
                  className="hover:text-[#141413] transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-[#141413] transition-colors"
                >
                  Student Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/exam"
                  className="hover:text-[#141413] transition-colors"
                >
                  Exam Room
                </Link>
              </li>
              <li>
                <Link
                  href="/parent"
                  className="hover:text-[#141413] transition-colors"
                >
                  Guardian Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-[#141413] transition-colors"
                >
                  Curator Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-medium text-[#0F4C3A] hover:underline transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-[#E8E4DB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#6E6B64]">
          <div>
            © {new Date().getFullYear()} Examora Education Ltd. All rights
            reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/parent" className="hover:text-[#141413]">
              Privacy & Safeguarding
            </Link>
            <Link href="/contact" className="hover:text-[#141413]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
