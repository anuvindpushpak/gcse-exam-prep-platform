"use client";

import React from "react";

interface MathKeypadProps {
  onInsert: (token: string) => void;
  onClear?: () => void;
}

const KEYPAD_BUTTONS: Array<{
  label: string;
  insert: string;
  hint: string;
}> = [
  { label: "a/b", insert: "/", hint: "Fraction (e.g. 3/5)" },
  { label: "x²", insert: "^2", hint: "Squared" },
  { label: "x³", insert: "^3", hint: "Cubed" },
  { label: "xⁿ", insert: "^", hint: "Power / Index" },
  { label: "√", insert: "sqrt(", hint: "Square root" },
  { label: "×10ⁿ", insert: " * 10^", hint: "Standard Form" },
  { label: "π", insert: "pi", hint: "Pi" },
  { label: "≤", insert: "<=", hint: "Less than or equal" },
  { label: "≥", insert: ">=", hint: "Greater than or equal" },
  { label: "x", insert: "x", hint: "Variable x" },
  { label: "(", insert: "(", hint: "Open bracket" },
  { label: ")", insert: ")", hint: "Close bracket" },
];

export function MathKeypad({ onInsert, onClear }: MathKeypadProps) {
  return (
    <div
      className="rounded-2xl border border-[#E8E4DB] bg-[#FAF9F5] p-3.5"
      aria-label="Mathematical symbol keypad"
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-medium uppercase tracking-widest text-[#6E6B64]">
          Mathematical Symbols
        </span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-[#6E6B64] hover:text-[#141413] transition-colors"
          >
            Clear box
          </button>
        )}
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
        {KEYPAD_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.hint}
            onClick={() => onInsert(btn.insert)}
            className="flex items-center justify-center h-9 rounded-xl border border-[#E8E4DB] bg-white px-2 text-xs font-mono font-medium text-[#141413] hover:border-[#0F4C3A] hover:bg-[#E6F0EC] hover:text-[#0F4C3A] active:scale-95 transition-all"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
