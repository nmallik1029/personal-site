"use client";

import { useState } from "react";

type Props = {
  data: number[]; // weekly commit counts (52 weeks)
  positive: boolean;
};

const ranges = [
  { label: "1M", weeks: 4 },
  { label: "3M", weeks: 13 },
  { label: "6M", weeks: 26 },
  { label: "1Y", weeks: 52 },
] as const;

export default function BigChart({ data, positive }: Props) {
  const [rangeIdx, setRangeIdx] = useState(3); // default 1Y
  const range = ranges[rangeIdx];
  const slice = data.slice(-range.weeks);

  const w = 800;
  const h = 240;
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerW = w - padding.left - padding.right;
  const innerH = h - padding.top - padding.bottom;

  const max = Math.max(...slice, 1);
  const min = 0;
  const range_ = max - min || 1;
  const step = slice.length > 1 ? innerW / (slice.length - 1) : innerW;

  const toX = (i: number) => padding.left + i * step;
  const toY = (v: number) => padding.top + innerH - ((v - min) / range_) * innerH;

  const points = slice.map((v, i) => `${toX(i).toFixed(2)},${toY(v).toFixed(2)}`).join(" ");
  const area = `${padding.left},${padding.top + innerH} ${points} ${(padding.left + (slice.length - 1) * step).toFixed(2)},${padding.top + innerH}`;

  const stroke = positive ? "#16a34a" : "#dc2626";
  const fill = positive ? "rgba(22,163,74,0.10)" : "rgba(220,38,38,0.10)";

  // Y-axis gridlines (5 lines)
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const value = (max / 4) * (4 - i);
    const y = toY(value);
    return { y, value };
  });

  // X-axis labels (3 labels: start, mid, end)
  const xLabels =
    slice.length > 0
      ? [
          { i: 0, label: `${range.weeks}w ago` },
          { i: Math.floor(slice.length / 2), label: `${Math.floor(range.weeks / 2)}w` },
          { i: slice.length - 1, label: "now" },
        ]
      : [];

  return (
    <div>
      {/* Range selector */}
      <div className="flex items-center gap-1 mb-3">
        {ranges.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setRangeIdx(i)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-widest transition-colors ${
              i === rangeIdx
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        {/* Grid */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              x2={w - padding.right}
              y1={g.y}
              y2={g.y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
              y={g.y + 3}
              textAnchor="end"
              className="text-[9px] fill-gray-400 font-mono"
            >
              {Math.round(g.value)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <polygon points={area} fill={fill} />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* End-point dot */}
        {slice.length > 0 && (
          <circle
            cx={toX(slice.length - 1)}
            cy={toY(slice[slice.length - 1])}
            r="3"
            fill={stroke}
          />
        )}

        {/* X-axis labels */}
        {xLabels.map((l, i) => (
          <text
            key={i}
            x={toX(l.i)}
            y={h - 8}
            textAnchor={i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"}
            className="text-[9px] fill-gray-400 font-mono uppercase tracking-widest"
          >
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
