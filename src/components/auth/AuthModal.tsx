"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Link2,
  MailCheck,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { ExamBoardCode, UserAccount } from "@/types/platform";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: "SIGN_IN" | "SIGN_UP";
  onClose: () => void;
  demoUsers: UserAccount[];
  onQuickSwitchUser: (userId: string) => Promise<void>;
  onRequestEmailCode: (email: string) => Promise<{
    email: string;
    demoPreviewCode?: string;
    sentLiveEmail?: boolean;
    isExistingUser: boolean;
  }>;
  onVerifyEmailCode: (params: {
    email: string;
    code: string;
    firstName?: string;
    lastName?: string;
    role?: "STUDENT" | "PARENT" | "ADMIN";
    selectedBoard?: ExamBoardCode;
    linkedStudentQuery?: string;
  }) => Promise<void>;
}

export function AuthModal({
  isOpen,
  initialMode,
  onClose,
  demoUsers,
  onQuickSwitchUser,
  onRequestEmailCode,
  onVerifyEmailCode,
}: AuthModalProps) {
  const [mode, setMode] = useState<"SIGN_IN" | "SIGN_UP">(initialMode);
  const [step, setStep] = useState<"DETAILS" | "VERIFY_CODE">("DETAILS");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"STUDENT" | "PARENT">("STUDENT");
  const [selectedBoard, setSelectedBoard] = useState<ExamBoardCode>("EDEXCEL");
  const [linkedStudentQuery, setLinkedStudentQuery] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setStep("DETAILS");
    setVerificationCode("");
    setPreviewCode(null);
    setErrorMsg(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Only expose Student and Parent demo personas (Curator/Admin removed from public demo)
  const publicDemoPersonas = demoUsers.filter(
    (u) =>
      (u.id === "user-student-leo" || u.id === "user-parent-sarah") &&
      u.role !== "ADMIN"
  );

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const challenge = await onRequestEmailCode(email);
      setPreviewCode(challenge.demoPreviewCode || null);
      setStep("VERIFY_CODE");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Unable to send confirmation code. Please check your email."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await onVerifyEmailCode({
        email,
        code: verificationCode,
        firstName: mode === "SIGN_UP" ? firstName : undefined,
        lastName: mode === "SIGN_UP" ? lastName : undefined,
        role: mode === "SIGN_UP" ? role : undefined,
        selectedBoard: mode === "SIGN_UP" ? selectedBoard : undefined,
        linkedStudentQuery:
          mode === "SIGN_UP" && role === "PARENT"
            ? linkedStudentQuery
            : undefined,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Invalid confirmation code. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (userId: string) => {
    setSubmitting(true);
    try {
      await onQuickSwitchUser(userId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF9F5] border border-[#E8E4DB] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DB] px-7 py-5 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F4C3A] text-white font-serif text-base font-medium">
              E
            </div>
            <div>
              <h2
                id="auth-modal-title"
                className="font-serif text-lg font-semibold text-[#141413]"
              >
                {step === "VERIFY_CODE"
                  ? "Confirm your email address"
                  : mode === "SIGN_IN"
                  ? "Password-free Sign In"
                  : "Create your Examora account"}
              </h2>
              <p className="text-xs text-[#6E6B64]">
                {step === "VERIFY_CODE"
                  ? `Enter the 6-digit confirmation code sent to ${email}`
                  : "Passwordless email confirmation · Or explore our live Student & Parent demo"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#6E6B64] hover:bg-[#F3F1EA] hover:text-[#141413] transition-colors"
            aria-label="Close sign in modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-7 space-y-6">
          {/* Interactive Demo Option (Student & Parent Views Only) */}
          {publicDemoPersonas.length > 0 && step === "DETAILS" && (
            <div className="rounded-2xl border border-[#0F4C3A]/25 bg-[#E6F0EC]/55 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
                  <Sparkles className="h-4 w-4" />
                  <span>Explore Interactive Demo (No Sign-Up Needed)</span>
                </div>
              </div>
              <p className="text-xs text-[#3D3B37] leading-relaxed">
                Preview the platform immediately and toggle between the{" "}
                <strong>Student Hub</strong> and linked{" "}
                <strong>Parent Guardian View</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {publicDemoPersonas.map((u) => {
                  const isParent = u.role === "PARENT";
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickDemo(u.id)}
                      className="flex flex-col justify-between rounded-xl border border-[#0F4C3A]/25 bg-white p-3.5 text-left hover:border-[#0F4C3A] hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-[#E6F0EC] px-2.5 py-0.5 text-[10px] font-semibold uppercase text-[#0F4C3A]">
                          {isParent ? "Demo Parent View" : "Demo Student View"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#0F4C3A]" />
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-semibold text-[#141413]">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-[11px] text-[#6E6B64]">
                          {isParent
                            ? "Tracks Leo's Grade 4 readiness"
                            : "Edexcel Foundation · Target Grade 4"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          {step === "DETAILS" && (
            <div className="grid grid-cols-2 rounded-full border border-[#E8E4DB] bg-white p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("SIGN_IN");
                  setErrorMsg(null);
                }}
                className={`rounded-full py-2 text-xs font-semibold transition-all ${
                  mode === "SIGN_IN"
                    ? "bg-[#141413] text-white"
                    : "text-[#6E6B64] hover:text-[#141413]"
                }`}
              >
                Sign In with Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("SIGN_UP");
                  setErrorMsg(null);
                }}
                className={`rounded-full py-2 text-xs font-semibold transition-all ${
                  mode === "SIGN_UP"
                    ? "bg-[#141413] text-white"
                    : "text-[#6E6B64] hover:text-[#141413]"
                }`}
              >
                Create New Account
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: ENTER EMAIL & DETAILS (NO PASSWORD) */}
          {step === "DETAILS" ? (
            <form
              onSubmit={handleRequestCode}
              className="rounded-2xl border border-[#E8E4DB] bg-white p-6 space-y-4 shadow-sm"
            >
              {mode === "SIGN_UP" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3D3B37] mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Oliver"
                        className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3D3B37] mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Bennett"
                        className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3D3B37] mb-1.5">
                        I am a...
                      </label>
                      <select
                        value={role}
                        onChange={(e) =>
                          setRole(e.target.value as "STUDENT" | "PARENT")
                        }
                        className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-2.5 text-xs font-medium text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="PARENT">Parent / Guardian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3D3B37] mb-1.5">
                        Exam Board
                      </label>
                      <select
                        value={selectedBoard}
                        onChange={(e) =>
                          setSelectedBoard(e.target.value as ExamBoardCode)
                        }
                        className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-2.5 text-xs font-medium text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
                      >
                        <option value="EDEXCEL">Pearson Edexcel (1MA1)</option>
                        <option value="AQA">AQA (8300)</option>
                        <option value="OCR">OCR (J560)</option>
                      </select>
                    </div>
                  </div>

                  {/* Parent-to-Student Link Input when signing up as a Parent */}
                  {role === "PARENT" && (
                    <div className="rounded-xl border border-[#0F4C3A]/25 bg-[#FAF9F5] p-3.5 space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A]">
                        <Link2 className="h-3.5 w-3.5" />
                        <span>
                          Link to Your Child&apos;s Account (Student Email or
                          Invite Code)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={linkedStudentQuery}
                        onChange={(e) => setLinkedStudentQuery(e.target.value)}
                        placeholder="e.g. child@school.uk or PARENT-LEO-2027"
                        className="w-full rounded-xl border border-[#E8E4DB] bg-white px-3 py-2 text-xs text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
                      />
                      <p className="text-[11px] text-[#6E6B64]">
                        Connects your Guardian Dashboard directly to your
                        child&apos;s diagnostic & practice telemetry.
                      </p>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#3D3B37] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.co.uk"
                  className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
                />
                <p className="mt-1.5 text-[11px] text-[#6E6B64]">
                  No password required. We will send a 6-digit confirmation code
                  to verify your email.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] disabled:opacity-50 transition-all"
              >
                <MailCheck className="h-4 w-4" />
                <span>
                  {submitting
                    ? "Sending Confirmation Code..."
                    : "Send Email Confirmation Code"}
                </span>
              </button>
            </form>
          ) : (
            /* STEP 2: ENTER 6-DIGIT EMAIL CONFIRMATION CODE */
            <form
              onSubmit={handleVerifyCode}
              className="rounded-2xl border border-[#E8E4DB] bg-white p-6 space-y-5 shadow-sm"
            >
              {previewCode && (
                <div className="rounded-2xl border border-[#0F4C3A]/30 bg-[#E6F0EC]/70 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C3A]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Email Confirmation Dispatched</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setVerificationCode(previewCode)}
                      className="rounded-full bg-[#0F4C3A] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#0B382B]"
                    >
                      Auto-Fill Code ({previewCode})
                    </button>
                  </div>
                  <p className="text-xs text-[#3D3B37] leading-relaxed">
                    Your 6-digit verification code for{" "}
                    <strong>{email}</strong> is{" "}
                    <span className="font-mono font-bold text-[#0F4C3A]">
                      {previewCode}
                    </span>
                    .
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#3D3B37] mb-1.5">
                  6-Digit Confirmation Code
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 text-[#6E6B64] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="e.g. 482910"
                    className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] pl-10 pr-4 py-3 text-base font-mono tracking-widest text-[#141413] focus:border-[#0F4C3A] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("DETAILS")}
                  className="rounded-full border border-[#D5CFC2] px-5 py-3 text-xs font-semibold text-[#3D3B37] hover:border-[#141413]"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0B382B] disabled:opacity-50 transition-all"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>
                    {submitting ? "Verifying..." : "Confirm & Enter Examora"}
                  </span>
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6E6B64]">
            <ShieldCheck className="h-4 w-4 text-[#0F4C3A]" />
            <span>
              Password-free email verification · UK GDPR & Age-Appropriate
              Design compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
