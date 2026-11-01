"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LockOpen,
  RotateCcw,
  Settings,
  Shield,
  Users,
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

  const navLinks = [
    { href: "/", label: "Overview", icon: GraduationCap },
    { href: "/dashboard", label: "Student Hub", icon: LayoutDashboard },
    { href: "/topics/topic-num", label: "Topics & Practice", icon: BookOpen },
    {
      href: "/exam/diag-edexcel-foundation",
      label: "Exam Simulator",
      icon: ClipboardCheck,
    },
    { href: "/parent", label: "Parent View", icon: Users },
    { href: "/admin", label: "Admin & AI Factory", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold shadow-sm group-hover:bg-sky-700 transition-colors">
            G4
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-tight text-slate-900">
                GradeFour<span className="text-sky-600">.ai</span>
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                GCSE MATHS 9–1
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Diagnose · Understand · Practise · Assess · Improve
            </p>
          </div>
        </Link>

        {/* Primary Navigation Links */}
        <nav
          className="flex items-center gap-1 overflow-x-auto"
          aria-label="Main navigation"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href.split("/").slice(0, 2).join("/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Board Selector, Entitlement Badge, Persona Switcher */}
        <div className="flex items-center gap-2">
          {activeUser && onSwitchUser && (
            <select
              aria-label="Select GCSE Examination Board"
              value={activeUser.selectedBoard || "EDEXCEL"}
              onChange={(e) =>
                onSwitchUser(activeUser.id, e.target.value as ExamBoardCode)
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-800 focus:border-sky-600 focus:outline-none"
            >
              <option value="EDEXCEL">Edexcel (1MA1)</option>
              <option value="AQA">AQA (8300)</option>
              <option value="OCR">OCR (J560)</option>
            </select>
          )}

          {entitlements?.hasFullPack ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
              <Award className="h-3.5 w-3.5" />
              Grade 4 Pack Active
            </span>
          ) : (
            onOpenCheckout && (
              <button
                type="button"
                onClick={onOpenCheckout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition-colors"
              >
                <LockOpen className="h-3.5 w-3.5" />
                <span>Unlock Pack (£39.99)</span>
              </button>
            )
          )}

          {users.length > 0 && activeUser && onSwitchUser && (
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-slate-400 hidden md:inline" />
              <select
                aria-label="Switch user role persona"
                value={activeUser.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:border-sky-600 focus:outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {onResetDemo && (
            <button
              type="button"
              onClick={onResetDemo}
              title="Reset demo progress & purchases to initial state"
              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Reset demo data"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
