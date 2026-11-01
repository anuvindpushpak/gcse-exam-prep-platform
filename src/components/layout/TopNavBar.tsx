"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  RotateCcw,
  Sparkles,
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
  onOpenCheckout?: () => void;
  onResetDemo?: () => void;
}

export function TopNavBar({
  activeUser,
  users = [],
  entitlements,
  onSwitchUser,
  onOpenCheckout,
  onResetDemo,
}: TopNavBarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/dashboard", label: "Student Hub" },
    { href: "/topics/topic-num", label: "Syllabus & Study" },
    { href: "/exam/diag-edexcel-foundation", label: "Exam Room" },
    { href: "/parent", label: "Parents" },
    { href: "/admin", label: "Curator Studio" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E4DB] bg-[#FAF9F5]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Refined Editorial Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0F4C3A]/20 bg-[#0F4C3A] text-[#FAF9F5] font-serif text-base font-medium tracking-tight transition-transform group-hover:scale-105">
            G4
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold tracking-tight text-[#141413] leading-none">
              GradeFour
            </span>
            <span className="text-[11px] font-medium tracking-widest uppercase text-[#6E6B64] mt-0.5">
              GCSE Mathematics
            </span>
          </div>
        </Link>

        {/* Clean Minimalist Navigation */}
        <nav
          className="hidden md:flex items-center gap-7"
          aria-label="Primary navigation"
        >
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(
                    item.href.split("/").slice(0, 2).join("/")
                  );
            return (
              <Link
                key={item.href}
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

        {/* Quiet Right Controls */}
        <div className="flex items-center gap-3">
          {entitlements?.hasFullPack ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#0F4C3A]/20 bg-[#E6F0EC] px-3.5 py-1.5 text-xs font-semibold text-[#0F4C3A]">
              <span>Full Pack Unlocked</span>
            </span>
          ) : (
            onOpenCheckout && (
              <button
                type="button"
                onClick={onOpenCheckout}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0F4C3A] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0B382B] transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Unlock Pack · £39.99</span>
              </button>
            )
          )}

          {/* Single Quiet Switcher Pill for Board / Persona / Reset */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8E4DB] bg-white px-3.5 py-1.5 text-xs font-medium text-[#3D3B37] hover:border-[#D5CFC2] transition-colors"
            >
              <span>
                {activeUser?.firstName || "Leo"} ·{" "}
                {activeUser?.selectedBoard || "Edexcel"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#6E6B64]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#E8E4DB] bg-white p-4 shadow-xl space-y-4 z-50">
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

                {users.length > 0 && activeUser && onSwitchUser && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B64] mb-1.5">
                      View Platform As
                    </label>
                    <div className="space-y-1">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            onSwitchUser(u.id);
                            setMenuOpen(false);
                          }}
                          className={`w-full text-left rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            u.id === activeUser.id
                              ? "bg-[#E6F0EC] text-[#0F4C3A] font-semibold"
                              : "text-[#3D3B37] hover:bg-[#FAF9F5]"
                          }`}
                        >
                          {u.firstName} {u.lastName} ({u.role.toLowerCase()})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Links */}
                <div className="md:hidden border-t border-[#E8E4DB] pt-3 space-y-1">
                  {navLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-1.5 text-xs font-medium text-[#3D3B37] hover:bg-[#FAF9F5]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>

                {onResetDemo && (
                  <div className="border-t border-[#E8E4DB] pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        onResetDemo();
                        setMenuOpen(false);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E8E4DB] px-3 py-1.5 text-xs font-medium text-[#6E6B64] hover:bg-[#FAF9F5] hover:text-[#141413]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset Demo Progress</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
