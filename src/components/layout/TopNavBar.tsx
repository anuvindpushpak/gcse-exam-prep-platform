"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  ChevronDown,
  LogOut,
  RotateCcw,
  User,
} from "lucide-react";
import {
  ExamBoardCode,
  StudentEntitlementState,
  UserAccount,
} from "@/types/platform";

interface TopNavBarProps {
  activeUser?: UserAccount;
  users?: UserAccount[];
  entitlements?: StudentEntitlementState;
  onSwitchUser?: (userId: string, board?: ExamBoardCode) => void;
  onSignOut?: () => void;
  onOpenAuth?: (mode: "SIGN_IN" | "SIGN_UP") => void;
  onOpenCheckout?: () => void;
  onResetDemo?: () => void;
}

export function TopNavBar({
  activeUser,
  entitlements,
  onSwitchUser,
  onSignOut,
  onOpenAuth,
  onResetDemo,
}: TopNavBarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = Boolean(activeUser);

  // Check if the user is currently in the public Student/Parent Demo Mode
  const isPublicDemoSession =
    activeUser?.id === "user-student-leo" ||
    activeUser?.id === "user-parent-sarah";

  const visitorNavLinks = [
    { href: "/#product-catalogue", matchPrefix: "/gcse-maths", label: "Products" },
    { href: "/exam", matchPrefix: "/exam", label: "Exam Room" },
    { href: "/contact", matchPrefix: "/contact", label: "Contact" },
  ];

  const studentNavLinks = [
    { href: "/#product-catalogue", matchPrefix: "/gcse-maths", label: "Products" },
    { href: "/dashboard", matchPrefix: "/dashboard", label: "Student Hub" },
    { href: "/exam", matchPrefix: "/exam", label: "Exam Room" },
    { href: "/contact", matchPrefix: "/contact", label: "Contact" },
  ];

  const parentNavLinks = [
    { href: "/#product-catalogue", matchPrefix: "/gcse-maths", label: "Products" },
    { href: "/parent", matchPrefix: "/parent", label: "Guardian Dashboard" },
    { href: "/contact", matchPrefix: "/contact", label: "Contact" },
  ];

  const adminNavLinks = [
    { href: "/#product-catalogue", matchPrefix: "/gcse-maths", label: "Products" },
    { href: "/dashboard", matchPrefix: "/dashboard", label: "Student Hub" },
    { href: "/exam", matchPrefix: "/exam", label: "Exam Room" },
    { href: "/parent", matchPrefix: "/parent", label: "Guardian Dashboard" },
    { href: "/admin", matchPrefix: "/admin", label: "Curator Studio" },
  ];

  const navLinks = !isLoggedIn
    ? visitorNavLinks
    : activeUser?.role === "PARENT"
    ? parentNavLinks
    : activeUser?.role === "ADMIN"
    ? adminNavLinks
    : studentNavLinks;

  const fullName = activeUser
    ? `${activeUser.firstName} ${activeUser.lastName || ""}`.trim()
    : "";

  const initials = activeUser
    ? `${activeUser.firstName?.[0] || "U"}${activeUser.lastName?.[0] || ""}`
    : "U";

  const roleLabel =
    activeUser?.role === "PARENT"
      ? "Guardian"
      : activeUser?.role === "ADMIN"
      ? "Curator"
      : "Student";

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E4DB] bg-[#FAF9F5]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Placeholder Business Logo: Examora */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0F4C3A]/20 bg-[#0F4C3A] text-[#FAF9F5] font-serif text-lg font-medium tracking-tight transition-transform group-hover:scale-105">
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

        {/* Primary Header Navigation */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Primary navigation"
        >
          {navLinks.map((item) => {
            const isActive =
              item.label === "Products"
                ? pathname === "/" ||
                  pathname?.startsWith("/gcse-maths") ||
                  pathname?.startsWith("/topics")
                : pathname?.startsWith(item.matchPrefix);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm transition-colors py-1 ${
                  isActive
                    ? "font-semibold text-[#0F4C3A] border-b-2 border-[#0F4C3A]"
                    : "font-medium text-[#6E6B64] hover:text-[#141413]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Sign-in / Sign-up for Visitors OR User Profile for Logged-in Users */}
        {!isLoggedIn ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth?.("SIGN_IN")}
              className="rounded-full border border-[#D5CFC2] bg-white px-4 py-2 text-xs font-semibold text-[#141413] hover:border-[#141413] transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth?.("SIGN_UP")}
              className="rounded-full bg-[#0F4C3A] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-colors"
            >
              Sign up
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Quick Student <-> Parent Demo Toggle Pill (ONLY visible in Demo Session) */}
            {isPublicDemoSession && onSwitchUser && (
              <button
                type="button"
                onClick={() =>
                  onSwitchUser(
                    activeUser?.role === "STUDENT"
                      ? "user-parent-sarah"
                      : "user-student-leo"
                  )
                }
                className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-[#0F4C3A]/30 bg-[#E6F0EC] px-3.5 py-1.5 text-xs font-semibold text-[#0F4C3A] hover:bg-[#0F4C3A] hover:text-white transition-colors"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span>
                  {activeUser?.role === "STUDENT"
                    ? "Demo: Switch to Parent View"
                    : "Demo: Switch to Student View"}
                </span>
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#E8E4DB] bg-white pl-2 pr-3.5 py-1.5 text-xs font-medium text-[#141413] shadow-sm hover:border-[#D5CFC2] transition-colors"
                aria-label="Open user profile menu"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E6F0EC] text-[11px] font-semibold text-[#0F4C3A]">
                  {initials}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="font-semibold text-[#141413]">{fullName}</span>
                  <span className="text-[10px] text-[#6E6B64]">
                    {isPublicDemoSession ? `Demo ${roleLabel}` : roleLabel} ·{" "}
                    {activeUser?.selectedBoard || "Edexcel"}
                  </span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#6E6B64]" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E8E4DB] bg-white p-5 shadow-xl space-y-4 z-50">
                  {/* Active Profile Summary */}
                  <div className="flex items-center gap-3 border-b border-[#E8E4DB] pb-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F4C3A] text-white font-serif text-sm font-medium">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#141413]">
                        {fullName}
                      </div>
                      <div className="text-xs text-[#6E6B64]">
                        {activeUser?.email}
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#FAF9F5] border border-[#E8E4DB] px-2.5 py-0.5 text-[10px] font-semibold text-[#0F4C3A]">
                        <User className="h-2.5 w-2.5" />
                        <span>
                          {entitlements?.hasFullPack
                            ? "Grade 4 Pack Active"
                            : "Free Diagnostic Tier"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {activeUser && onSwitchUser && (
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B64] mb-1.5">
                        Examination Board
                      </label>
                      <select
                        value={activeUser.selectedBoard || "EDEXCEL"}
                        onChange={(e) => {
                          onSwitchUser(
                            activeUser.id,
                            e.target.value as ExamBoardCode
                          );
                          setMenuOpen(false);
                        }}
                        className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3 py-2 text-xs font-medium text-[#141413]"
                      >
                        <option value="EDEXCEL">Pearson Edexcel (1MA1)</option>
                        <option value="AQA">AQA (8300)</option>
                        <option value="OCR">OCR (J560)</option>
                      </select>
                    </div>
                  )}

                  {/* Student <-> Parent Demo Toggle (Only shown when in Demo Session) */}
                  {isPublicDemoSession && onSwitchUser && (
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B64] mb-1.5">
                        Interactive Demo View
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSwitchUser("user-student-leo");
                            setMenuOpen(false);
                          }}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                            activeUser?.id === "user-student-leo"
                              ? "bg-[#0F4C3A] text-white"
                              : "bg-[#FAF9F5] text-[#3D3B37] hover:bg-[#E6F0EC]"
                          }`}
                        >
                          Student View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSwitchUser("user-parent-sarah");
                            setMenuOpen(false);
                          }}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                            activeUser?.id === "user-parent-sarah"
                              ? "bg-[#0F4C3A] text-white"
                              : "bg-[#FAF9F5] text-[#3D3B37] hover:bg-[#E6F0EC]"
                          }`}
                        >
                          Parent View
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Links */}
                  <div className="md:hidden border-t border-[#E8E4DB] pt-3 space-y-1">
                    {navLinks.map((l) => (
                      <Link
                        key={l.label}
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-1.5 text-xs font-medium text-[#3D3B37] hover:bg-[#FAF9F5]"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-[#E8E4DB] pt-3 space-y-2">
                    {isPublicDemoSession && onResetDemo && (
                      <button
                        type="button"
                        onClick={() => {
                          onResetDemo();
                          setMenuOpen(false);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E8E4DB] px-3 py-1.5 text-xs font-medium text-[#6E6B64] hover:bg-[#FAF9F5] hover:text-[#141413]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset Demo Data</span>
                      </button>
                    )}

                    {onSignOut && (
                      <button
                        type="button"
                        onClick={() => {
                          onSignOut();
                          setMenuOpen(false);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FAF9F5] border border-[#E8E4DB] px-3 py-2 text-xs font-semibold text-[#141413] hover:bg-[#F3F1EA]"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
