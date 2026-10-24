"use client";

import { useState } from "react";
import { useMeasure } from "@/lib/hooks/useMeasure";
import { C, fmtPct } from "@/lib/data/format";
import { hoverHandlers } from "./useHover";
import { useVizTip } from "../VizTip";

export type HistConfig = {
  edges: number[];
  ref: number[];
  cur: number[];
  refMean: number;
  curMean: number;
};

// Paired histogram: training-era reference (context, gray, full-width bars) vs
// the current window (blue, inset bars), both normalised to share. Mean markers
// are dashed verticals. Ported from the prototype's `histPair`.
export function HistPair({ cfg }: { cfg: HistConfig }) {
  const [ref, w] = useMeasure();
  return (
    <div className="chart" ref={ref}>
      {w > 10 && <HistSvg cfg={cfg} w={w} />}
    </div>
  );
}

function HistSvg({ cfg, w }: { cfg: HistConfig; w: number }) {
  const vizTip = useVizTip();
  const [band, setBand] = useState<number | null>(null);

  const M = { t: 14, r: 10, b: 26, l: 40 };
  const h = 180;
  const pw = w - M.l - M.r;
  const ph = h - M.t - M.b;
  const nB = cfg.ref.length;
  const refN = cfg.ref.reduce((a, b) => a + b, 0);
  const curN = cfg.cur.reduce((a, b) => a + b, 0);
  const refS = cfg.ref.map((v) => v / (refN || 1));
  const curS = cfg.cur.map((v) => v / (curN || 1));
  const yMax = Math.max(0.2, Math.ceil(Math.max(...refS, ...curS) * 5) / 5);
  const bw = pw / nB;
  const Y = (v: number) => M.t + ph - (v / yMax) * ph;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {/* hover bands (behind everything) */}
      {Array.from({ length: nB }, (_, i) => (
        <rect
          key={`band${i}`}
          x={M.l + i * bw}
          y={M.t}
          width={bw}
          height={ph}
          fill={C.grid}
          className={`hov ${band === i ? "hov-on" : ""}`}
        />
      ))}
      {/* grid + y ticks */}
      {[0, 1, 2, 3, 4].map((i) => {
        const v = (yMax * i) / 4;
        return (
          <g key={`y${i}`}>
            <line x1={M.l} x2={M.l + pw} y1={Y(v)} y2={Y(v)} stroke={i === 0 ? C.axis : C.grid} strokeWidth={1} />
            <text x={M.l - 7} y={Y(v) + 3.5} textAnchor="end" className="ax">
              {Math.round(v * 100)}%
            </text>
          </g>
        );
      })}
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <text key={`x${v}`} x={M.l + v * pw} y={h - 8} textAnchor="middle" className="ax">
          {v.toFixed(2)}
        </text>
      ))}
      {/* bars */}
      {Array.from({ length: nB }, (_, i) => {
        const x = M.l + i * bw;
        return (
          <g key={`bar${i}`}>
            {refS[i] > 0 && (
              <rect x={x + 1} y={Y(refS[i])} width={Math.max(1, bw - 2)} height={M.t + ph - Y(refS[i])} fill={C.ref} rx={1.5} />
            )}
            {curS[i] > 0 && (
              <rect x={x + bw * 0.26} y={Y(curS[i])} width={Math.max(1, bw * 0.48)} height={M.t + ph - Y(curS[i])} fill={C.primary} rx={1.5} />
            )}
          </g>
        );
      })}
      {/* mean markers */}
      {([
        [cfg.refMean, C.ref, `ref ${cfg.refMean.toFixed(3)}`],
        [cfg.curMean, C.primary, `now ${cfg.curMean.toFixed(3)}`],
      ] as const).map(([m, col, lab], i) => (
        <g key={`m${i}`}>
          <line x1={M.l + m * pw} x2={M.l + m * pw} y1={M.t + 2} y2={M.t + ph} stroke={col} strokeWidth={1.4} strokeDasharray="1.5 3" />
          <text x={M.l + m * pw - 5} y={M.t + 10 + i * 13} textAnchor="end" className="dlab mut">
            {lab}
          </text>
        </g>
      ))}
      {/* hit areas */}
      {Array.from({ length: nB }, (_, i) => {
        const lo = cfg.edges[i];
        const hi = cfg.edges[i + 1];
        const hp = hoverHandlers(
          vizTip,
          (cx, cy) => {
            setBand(i);
            vizTip.show(cx, cy, `${lo.toFixed(2)} – ${hi.toFixed(2)}`, [
              [C.primary, fmtPct(curS[i]), `current (${cfg.cur[i]} of ${curN})`],
              [C.ref, fmtPct(refS[i]), "reference"],
            ]);
          },
          () => {
            setBand(null);
            vizTip.hide();
          },
        );
        return <rect key={`hit${i}`} x={M.l + i * bw} y={M.t} width={bw} height={ph} fill="transparent" {...hp} />;
      })}
    </svg>
  );
}
