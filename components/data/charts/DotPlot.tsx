"use client";

import { useState } from "react";
import { useMeasure } from "@/lib/hooks/useMeasure";
import { C, fmtComma } from "@/lib/data/format";
import { hoverHandlers } from "./useHover";
import { useVizTip } from "../VizTip";
import type { PerClass } from "@/lib/data/contracts";

// Per-class F1 as a dot plot (ported from the prototype's `dotPlot`): one row
// per class, sorted by F1, with the macro-F1 anchor line. Hovering a row shows
// precision/recall/support.
export function DotPlot({
  rows,
  domain,
  mean,
}: {
  rows: PerClass[];
  domain: [number, number];
  mean: number;
}) {
  const [ref, w] = useMeasure();
  return (
    <div className="chart" ref={ref}>
      {w > 10 && <DotSvg rows={rows} domain={domain} mean={mean} w={w} />}
    </div>
  );
}

function DotSvg({
  rows,
  domain,
  mean,
  w,
}: {
  rows: PerClass[];
  domain: [number, number];
  mean: number;
  w: number;
}) {
  const vizTip = useVizTip();
  const [hot, setHot] = useState<number | null>(null);

  const rh = 26;
  const M = { t: 20, r: 16, b: 24, l: 86 };
  const h = M.t + rows.length * rh + M.b;
  const pw = w - M.l - M.r;
  const [d0, d1] = domain;
  const X = (v: number) => M.l + ((v - d0) / (d1 - d0)) * pw;
  const mx = X(mean);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {rows.map((_, i) => (
        <rect key={`band${i}`} x={0} y={M.t + i * rh} width={w} height={rh} fill={C.grid} className={`hov ${hot === i ? "hov-on" : ""}`} />
      ))}
      {[0.7, 0.8, 0.9, 1].map((v) => (
        <g key={`gx${v}`}>
          <line x1={X(v)} x2={X(v)} y1={M.t - 4} y2={M.t + rows.length * rh} stroke={C.grid} strokeWidth={1} />
          <text x={X(v)} y={h - 6} textAnchor="middle" className="ax">
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <line x1={mx} x2={mx} y1={M.t - 6} y2={M.t + rows.length * rh} stroke={C.axis} strokeWidth={1.4} />
      <text x={mx} y={M.t - 10} textAnchor="middle" className="dlab mut">
        macro-F1 {mean.toFixed(3)}
      </text>
      {rows.map((r, i) => {
        const y = M.t + i * rh + rh / 2;
        const hp = hoverHandlers(
          vizTip,
          (cx, cy) => {
            setHot(i);
            vizTip.show(cx, cy, r.cls, [
              [C.primary, r.f1.toFixed(3), "F1"],
              [null, r.precision.toFixed(3), "precision"],
              [null, r.recall.toFixed(3), "recall"],
              [null, fmtComma(r.support), "test doodles"],
            ]);
          },
          () => {
            setHot(null);
            vizTip.hide();
          },
        );
        return (
          <g key={r.cls}>
            <text x={M.l - 10} y={y + 4} textAnchor="end" className="ax" style={{ fill: C.ink, fontSize: 12 }}>
              {r.cls}
            </text>
            <line x1={M.l} x2={M.l + pw} y1={y} y2={y} stroke={C.grid} strokeWidth={1} />
            <circle cx={X(r.f1)} cy={y} r={4.5} fill={C.primary} stroke={C.card} strokeWidth={2} />
            {i === 0 && (
              <text x={X(r.f1) - 10} y={y + 4} textAnchor="end" className="dlab">
                {r.f1.toFixed(3)}
              </text>
            )}
            {i === rows.length - 1 && (
              <text x={X(r.f1) + 10} y={y + 4} className="dlab">
                {r.f1.toFixed(3)}
              </text>
            )}
            <rect x={0} y={M.t + i * rh} width={w} height={rh} fill="transparent" {...hp} />
          </g>
        );
      })}
    </svg>
  );
}
