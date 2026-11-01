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
      className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5"
      aria-label="Mathematical symbol keypad"
    >
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          GCSE Math Input Keypad (Click to insert into active box)
        </span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
          >
            Clear active box
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
            className="flex items-center justify-center h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-800 shadow-sm hover:border-sky-500 hover:bg-sky-50 hover:text-sky-800 active:scale-95 transition-all"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
