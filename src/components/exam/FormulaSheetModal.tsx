"use client";

import React from "react";
import { BookOpen, X } from "lucide-react";
import { FormulaSheetItem } from "@/types/platform";
import { MathText } from "@/components/math/MathText";

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardName: string;
  formulae: FormulaSheetItem[];
}

export function FormulaSheetModal({
  isOpen,
  onClose,
  boardName,
  formulae,
}: FormulaSheetModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="formula-sheet-title"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-6">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="formula-sheet-title"
                className="text-lg font-bold text-slate-900"
              >
                GCSE Mathematics — Foundation Tier Formulae Sheet
              </h2>
              <p className="text-xs text-slate-500">{boardName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close formula sheet"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {formulae.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                  {item.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <div className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-base font-medium text-slate-900">
                <MathText text={`$${item.formulaLatex}$`} />
              </div>
              {item.notes && (
                <p className="mt-2 text-xs text-slate-600">{item.notes}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Return to Examination
          </button>
        </div>
      </div>
    </div>
  );
}
