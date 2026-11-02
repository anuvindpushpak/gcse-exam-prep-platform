"use client";

import React, { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { usePlatform } from "@/components/providers/PlatformProvider";

export default function ContactPage() {
  const { submitContactEnquiry } = usePlatform();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("Parent / Student Support");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactEnquiry({
        fullName: name,
        email,
        role: enquiryType,
        message,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 sm:py-20 space-y-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white px-4 py-1.5 text-xs font-medium text-[#3D3B37] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#0F4C3A]" />
          <span>Contact Examora</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#141413] tracking-tight">
          We are here to help students, parents, and schools.
        </h1>

        <p className="text-base text-[#57554F] leading-relaxed">
          Have a question about our GCSE Mathematics preparation pack, diagnostic
          assessments, or school licences? Send us a note below and our team
          will respond within one working day.
        </p>
      </div>

      <div>
        {submitted ? (
          <div className="rounded-3xl border border-[#0F4C3A] bg-white p-8 sm:p-10 space-y-4 shadow-sm">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F0EC] text-[#0F4C3A]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-[#141413]">
              Thank you for getting in touch.
            </h2>
            <p className="text-sm text-[#57554F] leading-relaxed">
              We have received your message from{" "}
              <strong className="font-semibold text-[#141413]">
                {email || "your email"}
              </strong>{" "}
              and will reply within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setMessage("");
              }}
              className="rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-5 py-2.5 text-xs font-semibold text-[#141413] hover:border-[#141413] transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#E8E4DB] bg-white p-8 sm:p-10 space-y-6 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#3D3B37] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Carter"
                  className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-3 text-sm text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3B37] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.co.uk"
                  className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-3 text-sm text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3B37] mb-2">
                Enquiry Type
              </label>
              <select
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-3 text-sm text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
              >
                <option>Parent / Student Support</option>
                <option>GCSE Mathematics Grade 4 Pack</option>
                <option>School & Teacher Enquiries</option>
                <option>Account & Billing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3B37] mb-2">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-4 py-3 text-sm text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] disabled:opacity-50 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? "Sending..." : "Send Message"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
