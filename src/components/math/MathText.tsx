"use client";

import React from "react";

/**
 * Clean, zero-external-CDN mathematical notation formatter for GCSE Mathematics.
 * Converts inline LaTeX ($...$), fractions (\frac{a}{b}), exponents (x^2),
 * symbols (\times, \div, \pi, \le, \ge, \sqrt) and markdown bold (**...**) into
 * accessible, high-contrast mathematical HTML.
 */
export function formatMathInline(raw: string): string {
  if (!raw) return "";

  let html = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Markdown bold **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');

  // Format $...$ blocks
  html = html.replace(/\$([^$]+)\$/g, (_, expr: string) => {
    let e = expr
      .replace(/\\text\{([^}]+)\}/g, '<span class="font-sans not-italic">$1</span>')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (_, num, den) => {
        return `<span class="inline-flex flex-col items-center align-middle mx-1 px-1 text-[0.92em] leading-tight"><span class="border-b border-current px-1">${num}</span><span class="px-1">${den}</span></span>`;
      })
      .replace(/\\times/g, " × ")
      .replace(/\\div/g, " ÷ ")
      .replace(/\\pi/g, "π")
      .replace(/\\le/g, " ≤ ")
      .replace(/\\ge/g, " ≥ ")
      .replace(/\\neq/g, " ≠ ")
      .replace(/\\quad/g, " &nbsp;&nbsp; ")
      .replace(/\\left\(/g, "(")
      .replace(/\\right\)/g, ")")
      .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
      .replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>")
      .replace(/\^(\d+|[a-z])/gi, "<sup>$1</sup>")
      .replace(/_(\d+)/g, "<sub>$1</sub>")
      .replace(/\^\\circ/g, "°")
      .replace(/\\xi/g, "ξ")
      .replace(/\\cap/g, "∩")
      .replace(/\\cup/g, "∪")
      .replace(/\\%/g, "%");

    return `<span class="font-serif italic text-slate-900 px-0.5">${e}</span>`;
  });

  // Also format standalone LaTeX strings passed without $ delimiters (e.g., formula sheet)
  if (!raw.includes("$") && (raw.includes("\\") || raw.includes("^"))) {
    html = html
      .replace(/\\text\{([^}]+)\}/g, '<span class="font-sans not-italic">$1</span>')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (_, num, den) => {
        return `<span class="inline-flex flex-col items-center align-middle mx-1 px-1 text-[0.92em] leading-tight"><span class="border-b border-current px-1">${num}</span><span class="px-1">${den}</span></span>`;
      })
      .replace(/\\times/g, " × ")
      .replace(/\\div/g, " ÷ ")
      .replace(/\\pi/g, "π")
      .replace(/\\le/g, " ≤ ")
      .replace(/\\ge/g, " ≥ ")
      .replace(/\\quad/g, " &nbsp;&nbsp; ")
      .replace(/\\left\(/g, "(")
      .replace(/\\right\)/g, ")")
      .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
      .replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>")
      .replace(/\^(\d+|[a-z])/gi, "<sup>$1</sup>");
  }

  return html;
}

export function MathText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const lines = text.split("\n");
  return (
    <span className={className}>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          <span
            dangerouslySetInnerHTML={{ __html: formatMathInline(line) }}
          />
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}

