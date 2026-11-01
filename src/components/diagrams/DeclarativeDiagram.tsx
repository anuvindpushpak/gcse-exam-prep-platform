"use client";

import React from "react";
import { DiagramSpec } from "@/types/platform";

interface DeclarativeDiagramProps {
  spec: DiagramSpec;
}

/**
 * Deterministic JSON-to-SVG Diagram Renderer for GCSE Mathematics.
 * Eliminates LLM image hallucinations by rendering crisp, accessible vector diagrams
 * for geometry, angles on parallel lines, coordinate grids, bar charts, Venn diagrams,
 * compound shapes, and number line inequalities.
 */
export function DeclarativeDiagram({ spec }: DeclarativeDiagramProps) {
  switch (spec.type) {
    case "RIGHT_TRIANGLE":
      return (
        <figure className="my-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">
              {spec.title || "Geometric Diagram"}
            </span>
            {spec.notToScale && (
              <span className="italic font-medium text-slate-500">
                Diagram NOT accurately drawn
              </span>
            )}
          </div>
          <svg
            viewBox="0 0 320 190"
            className="w-full max-w-sm mx-auto h-auto"
            role="img"
            aria-label={`Right-angled triangle with base ${spec.baseLabel}, height ${spec.heightLabel}, and hypotenuse ${spec.hypotenuseLabel || ""}`}
          >
            {/* Triangle polygon */}
            <polygon
              points="60,150 250,150 60,40"
              fill="#f8fafc"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Right-angle square marker */}
            <polyline
              points="60,132 78,132 78,150"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
            />
            {/* Labels */}
            <text
              x="155"
              y="174"
              textAnchor="middle"
              className="fill-slate-900 text-sm font-semibold"
            >
              {spec.baseLabel}
            </text>
            <text
              x="46"
              y="100"
              textAnchor="end"
              className="fill-slate-900 text-sm font-semibold"
            >
              {spec.heightLabel}
            </text>
            {spec.hypotenuseLabel && (
              <text
                x="170"
                y="85"
                textAnchor="start"
                className="fill-sky-700 text-sm font-bold"
              >
                {spec.hypotenuseLabel}
              </text>
            )}
          </svg>
        </figure>
      );

    case "PARALLEL_LINES_ANGLES":
      return (
        <figure className="my-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">
              {spec.title || "Angles on Parallel Lines"}
            </span>
            {spec.notToScale && (
              <span className="italic">Diagram NOT accurately drawn</span>
            )}
          </div>
          <svg
            viewBox="0 0 340 190"
            className="w-full max-w-sm mx-auto h-auto"
            role="img"
            aria-label={`Parallel lines intersected by transversal with known angle ${spec.knownAngle} degrees and unknown angle ${spec.unknownLabel}`}
          >
            {/* Top Parallel Line */}
            <line
              x1="30"
              y1="55"
              x2="310"
              y2="55"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Parallel arrow chevron top */}
            <polyline
              points="265,49 275,55 265,61"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Bottom Parallel Line */}
            <line
              x1="30"
              y1="140"
              x2="310"
              y2="140"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Parallel arrow chevron bottom */}
            <polyline
              points="265,134 275,140 265,146"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Transversal Line */}
            <line
              x1="215"
              y1="20"
              x2="115"
              y2="175"
              stroke="#0284c7"
              strokeWidth="2.5"
            />
            {/* Known Angle Arc (bottom-right inside) */}
            <path
              d="M 162,140 A 24,24 0 0,0 152,118"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2"
            />
            <text
              x="175"
              y="128"
              className="fill-rose-700 text-xs font-bold"
            >
              {spec.knownAngle}°
            </text>
            {/* Unknown Angle Arc (top-right inside - co-interior) */}
            <path
              d="M 180,78 A 24,24 0 0,0 218,55"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <text
              x="205"
              y="76"
              className="fill-sky-700 text-sm font-bold"
            >
              {spec.unknownLabel}
            </text>
          </svg>
        </figure>
      );

    case "RECTANGLE_COMPOUND":
      return (
        <figure className="my-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">
              {spec.title || "Compound L-Shape"}
            </span>
            {spec.notToScale && (
              <span className="italic">Diagram NOT accurately drawn</span>
            )}
          </div>
          <svg
            viewBox="0 0 320 200"
            className="w-full max-w-sm mx-auto h-auto"
            role="img"
            aria-label="Compound L-shape polygon with side measurements"
          >
            {/* L-Shape Polygon */}
            <polygon
              points="60,35 150,35 150,115 260,115 260,165 60,165"
              fill="#f1f5f9"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Top total width indicator */}
            <line
              x1="60"
              y1="20"
              x2="260"
              y2="20"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text
              x="160"
              y="15"
              textAnchor="middle"
              className="fill-slate-900 text-xs font-bold"
            >
              Total Width = {spec.widthTop}
            </text>
            {/* Left height */}
            <text
              x="50"
              y="105"
              textAnchor="end"
              className="fill-slate-900 text-xs font-bold"
            >
              {spec.heightLeft}
            </text>
            {/* Inner horizontal step */}
            <text
              x="205"
              y="108"
              textAnchor="middle"
              className="fill-sky-700 text-xs font-bold"
            >
              {spec.widthBottomInner}
            </text>
            {/* Right vertical height */}
            <text
              x="270"
              y="145"
              textAnchor="start"
              className="fill-sky-700 text-xs font-bold"
            >
              {spec.heightRightInner}
            </text>
          </svg>
        </figure>
      );

    case "COORDINATE_GRID": {
      const width = 280;
      const height = 220;
      const [xMin, xMax] = spec.xRange;
      const [yMin, yMax] = spec.yRange;
      const pad = 28;
      const mapX = (x: number) =>
        pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad);
      const mapY = (y: number) =>
        height - pad - ((y - yMin) / (yMax - yMin)) * (height - 2 * pad);

      const xTicks: number[] = [];
      for (let x = xMin; x <= xMax; x++) xTicks.push(x);
      const yTicks: number[] = [];
      for (let y = yMin; y <= yMax; y++) yTicks.push(y);

      return (
        <figure className="my-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            {spec.title || "Coordinate Grid"}
          </div>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full max-w-sm mx-auto h-auto"
            role="img"
            aria-label={spec.title || "Coordinate grid with plotted line"}
          >
            {/* Grid lines */}
            {xTicks.map((x) => (
              <g key={`gx-${x}`}>
                <line
                  x1={mapX(x)}
                  y1={pad}
                  x2={mapX(x)}
                  y2={height - pad}
                  stroke={x === 0 ? "#334155" : "#e2e8f0"}
                  strokeWidth={x === 0 ? "2" : "1"}
                />
                <text
                  x={mapX(x)}
                  y={mapY(0) + 14}
                  textAnchor="middle"
                  className="fill-slate-600 text-[10px]"
                >
                  {x}
                </text>
              </g>
            ))}
            {yTicks.map((y) => (
              <g key={`gy-${y}`}>
                <line
                  x1={pad}
                  y1={mapY(y)}
                  x2={width - pad}
                  y2={mapY(y)}
                  stroke={y === 0 ? "#334155" : "#e2e8f0"}
                  strokeWidth={y === 0 ? "2" : "1"}
                />
                {y !== 0 && (
                  <text
                    x={mapX(0) - 8}
                    y={mapY(y) + 3}
                    textAnchor="end"
                    className="fill-slate-600 text-[10px]"
                  >
                    {y}
                  </text>
                )}
              </g>
            ))}
            {/* Plotted straight line */}
            {spec.line && (
              <line
                x1={mapX(-1)}
                y1={mapY(spec.line.slope * -1 + spec.line.intercept)}
                x2={mapX(2.5)}
                y2={mapY(spec.line.slope * 2.5 + spec.line.intercept)}
                stroke="#0284c7"
                strokeWidth="2.5"
              />
            )}
            {/* Plotted points */}
            {spec.points?.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={mapX(pt.x)}
                  cy={mapY(pt.y)}
                  r="4.5"
                  fill="#e11d48"
                />
                <text
                  x={mapX(pt.x) + 8}
                  y={mapY(pt.y) - 6}
                  className="fill-slate-900 text-[11px] font-bold"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </figure>
      );
    }

    case "VENN_DIAGRAM":
      return (
        <figure className="my-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            {spec.title}
          </div>
          <svg
            viewBox="0 0 340 190"
            className="w-full max-w-sm mx-auto h-auto"
            role="img"
            aria-label={`Venn diagram with ${spec.setALabel} and ${spec.setBLabel}`}
          >
            {/* Universal Set Box */}
            <rect
              x="15"
              y="15"
              width="310"
              height="160"
              rx="8"
              fill="#f8fafc"
              stroke="#334155"
              strokeWidth="2"
            />
            <text
              x="28"
              y="36"
              className="fill-slate-800 text-xs font-bold"
            >
              ξ = {spec.universalTotal}
            </text>
            {/* Circle A */}
            <circle
              cx="135"
              cy="98"
              r="56"
              fill="rgba(14, 165, 233, 0.12)"
              stroke="#0284c7"
              strokeWidth="2"
            />
            {/* Circle B */}
            <circle
              cx="205"
              cy="98"
              r="56"
              fill="rgba(16, 185, 129, 0.12)"
              stroke="#059669"
              strokeWidth="2"
            />
            {/* Set Headings */}
            <text
              x="110"
              y="36"
              textAnchor="middle"
              className="fill-sky-800 text-xs font-bold"
            >
              {spec.setALabel}
            </text>
            <text
              x="230"
              y="36"
              textAnchor="middle"
              className="fill-emerald-800 text-xs font-bold"
            >
              {spec.setBLabel}
            </text>
            {/* Region Numbers */}
            <text
              x="108"
              y="103"
              textAnchor="middle"
              className="fill-slate-900 text-base font-bold"
            >
              {spec.onlyA}
            </text>
            <text
              x="170"
              y="103"
              textAnchor="middle"
              className="fill-slate-900 text-base font-bold"
            >
              {spec.bothAB}
            </text>
            <text
              x="232"
              y="103"
              textAnchor="middle"
              className="fill-slate-900 text-base font-bold"
            >
              {spec.onlyB}
            </text>
            <text
              x="295"
              y="158"
              textAnchor="middle"
              className="fill-slate-700 text-sm font-bold"
            >
              {spec.outsideAB}
            </text>
          </svg>
        </figure>
      );

    case "BAR_CHART": {
      const maxVal = Math.max(...spec.bars.map((b) => b.value), 8);
      return (
        <figure className="my-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            {spec.title}
          </div>
          <svg
            viewBox="0 0 320 190"
            className="w-full max-w-sm mx-auto h-auto"
            role="img"
            aria-label={spec.title}
          >
            {/* Y-axis gridlines */}
            {[0, 2, 4, 6, 8].map((val) => {
              const y = 150 - (val / maxVal) * 115;
              return (
                <g key={val}>
                  <line
                    x1="45"
                    y1={y}
                    x2="295"
                    y2={y}
                    stroke={val === 0 ? "#334155" : "#e2e8f0"}
                    strokeWidth={val === 0 ? "2" : "1"}
                  />
                  <text
                    x="36"
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-600 text-[10px]"
                  >
                    {val}
                  </text>
                </g>
              );
            })}
            {/* Bars */}
            {spec.bars.map((bar, idx) => {
              const barWidth = 36;
              const x = 65 + idx * 58;
              const barH = (bar.value / maxVal) * 115;
              const y = 150 - barH;
              return (
                <g key={bar.category}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx="4"
                    fill="#0284c7"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="fill-slate-900 text-xs font-bold"
                  >
                    {bar.value}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y="168"
                    textAnchor="middle"
                    className="fill-slate-700 text-[10px] font-medium"
                  >
                    {bar.category}
                  </text>
                </g>
              );
            })}
          </svg>
        </figure>
      );
    }

    case "NUMBER_LINE_INEQUALITY": {
      const ticks: number[] = [];
      for (let t = spec.min; t <= spec.max; t++) ticks.push(t);
      const mapX = (v: number) =>
        30 + ((v - spec.min) / (spec.max - spec.min)) * 280;
      const isClosed = spec.operator === "<=" || spec.operator === ">=";
      const pointsRight = spec.operator === ">" || spec.operator === ">=";
      const startX = mapX(spec.value);
      const endX = pointsRight ? 305 : 35;

      return (
        <figure className="my-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            Inequality on Number Line
          </div>
          <svg
            viewBox="0 0 340 100"
            className="w-full max-w-sm mx-auto h-auto"
            role="img"
            aria-label={`Number line showing inequality at ${spec.value}`}
          >
            {/* Base Number Line */}
            <line
              x1="20"
              y1="65"
              x2="320"
              y2="65"
              stroke="#334155"
              strokeWidth="2"
            />
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={mapX(t)}
                  y1="60"
                  x2={mapX(t)}
                  y2="70"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <text
                  x={mapX(t)}
                  y="85"
                  textAnchor="middle"
                  className="fill-slate-700 text-[11px] font-medium"
                >
                  {t}
                </text>
              </g>
            ))}
            {/* Inequality Ray Above Line */}
            <line
              x1={startX}
              y1="34"
              x2={endX}
              y2="34"
              stroke="#0284c7"
              strokeWidth="3"
            />
            {/* Arrowhead */}
            {pointsRight ? (
              <polygon points="305,28 317,34 305,40" fill="#0284c7" />
            ) : (
              <polygon points="35,28 23,34 35,40" fill="#0284c7" />
            )}
            {/* Circle Endpoint (Solid for <= / >=, Open for < / >) */}
            <circle
              cx={startX}
              cy="34"
              r="6"
              fill={isClosed ? "#0284c7" : "#ffffff"}
              stroke="#0284c7"
              strokeWidth="2.5"
            />
          </svg>
        </figure>
      );
    }

    default:
      return null;
  }
}

