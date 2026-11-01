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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="formula-sheet-title"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#FAF9F5] border border-[#E8E4DB] shadow-2xl p-7">
        <div className="flex items-start justify-between border-b border-[#E8E4DB] pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EDF3F0] text-[#0F4C3A]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="formula-sheet-title"
                className="font-serif text-xl font-semibold text-[#141413]"
              >
                Foundation Tier Formulae Reference
              </h2>
              <p className="text-xs text-[#78756E]">{boardName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#78756E] hover:bg-[#F3F1EA] hover:text-[#141413] transition-colors"
            aria-label="Close formula sheet"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {formulae.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E8E4DB] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0F4C3A]">
                  {item.category}
                </span>
              </div>
              <h3 className="font-serif text-base font-semibold text-[#141413] mb-2.5">
                {item.title}
              </h3>
              <div className="rounded-xl bg-[#FAF9F5] border border-[#E8E4DB] px-4 py-3 text-base font-medium text-[#141413]">
                <MathText text={`$${item.formulaLatex}$`} />
              </div>
              {item.notes && (
                <p className="mt-2.5 text-xs text-[#575550]">{item.notes}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-end border-t border-[#E8E4DB] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#141413] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#2C2C2A] transition-colors"
          >
            Return to Paper
          </button>
        </div>
      </div>
    </div>
  );
}
