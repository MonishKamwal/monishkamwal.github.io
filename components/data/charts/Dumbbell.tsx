"use client";

import { useState } from "react";
import { useMeasure } from "@/lib/hooks/useMeasure";
import { C, fmtPct } from "@/lib/data/format";
import { hoverHandlers } from "./useHover";
import { useVizTip } from "../VizTip";

export type DumbRow = { label: string; ref: number; cur: number };

// Class-share dumbbell: reference share → current share, one row per class,
// sorted by shift. Ported from the prototype's `dumbbell`. The connecting rule
// is the shift; the leading dots are reference (gray) and current (blue).
export function Dumbbell({ rows, max }: { rows: DumbRow[]; max: number }) {
  const [ref, w] = useMeasure();
  return (
    <div className="chart" ref={ref}>
      {w > 10 && <DumbSvg rows={rows} max={max} w={w} />}
    </div>
  );
}

function DumbSvg({ rows, max, w }: { rows: DumbRow[]; max: number; w: number }) {
  const vizTip = useVizTip();
  const [hot, setHot] = useState<number | null>(null);

  const rh = 26;
  const M = { t: 22, r: 46, b: 24, l: 86 };
  const h = M.t + rows.length * rh + M.b;
  const pw = w - M.l - M.r;
  const d1 = max;
  const X = (v: number) => M.l + (v / d1) * pw;
  const ticks = [0, 0.03, 0.06, 0.09, 0.12].filter((v) => v <= d1 * 1.01);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {rows.map((_, i) => (
        <rect key={`band${i}`} x={0} y={M.t + i * rh} width={w} height={rh} fill={C.grid} className={`hov ${hot === i ? "hov-on" : ""}`} />
      ))}
      {ticks.map((v) => (
        <g key={`gx${v}`}>
          <line x1={X(v)} x2={X(v)} y1={M.t - 6} y2={M.t + rows.length * rh} stroke={C.grid} strokeWidth={1} />
          <text x={X(v)} y={h - 6} textAnchor="middle" className="ax">
            {Math.round(v * 100)}%
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = M.t + i * rh + rh / 2;
        const hp = hoverHandlers(
          vizTip,
          (cx, cy) => {
            setHot(i);
            vizTip.show(cx, cy, r.label, [
              [C.primary, fmtPct(r.cur), "current window"],
              [C.ref, fmtPct(r.ref), "reference"],
              [null, `${r.cur - r.ref >= 0 ? "+" : ""}${((r.cur - r.ref) * 100).toFixed(1)} pp`, "shift"],
            ]);
          },
          () => {
            setHot(null);
            vizTip.hide();
          },
        );
        return (
          <g key={r.label}>
            <text x={M.l - 10} y={y + 4} textAnchor="end" className="ax" style={{ fill: C.ink, fontSize: 12 }}>
              {r.label}
            </text>
            <line x1={X(r.ref)} x2={X(r.cur)} y1={y} y2={y} stroke={C.axis} strokeWidth={1.4} />
            <circle cx={X(r.ref)} cy={y} r={4} fill={C.ref} stroke={C.card} strokeWidth={2} />
            <circle cx={X(r.cur)} cy={y} r={4.5} fill={C.primary} stroke={C.card} strokeWidth={2} />
            {(i < 2 || r.cur === 0) && (
              <text x={Math.max(X(r.cur), X(r.ref)) + 10} y={y + 4} className="dlab">
                {(r.cur * 100).toFixed(1)}%
              </text>
            )}
            <rect x={0} y={M.t + i * rh} width={w} height={rh} fill="transparent" {...hp} />
          </g>
        );
      })}
    </svg>
  );
}
