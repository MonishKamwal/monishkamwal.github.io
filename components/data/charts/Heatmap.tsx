"use client";

import { useState } from "react";
import { useMeasure } from "@/lib/hooks/useMeasure";
import { C, fmtComma, fmtPct, clamp } from "@/lib/data/format";
import { hoverHandlers } from "./useHover";
import { useVizTip } from "../VizTip";
import type { ConfusionData } from "@/lib/data/contracts";

// Confusion-matrix heatmap with a capped sequential ramp (ported from the
// prototype's `heatmap`). The diagonal runs 77–98%, so the ramp caps at 12% to
// keep the off-diagonal weak spots legible. Rows are true classes, columns the
// prediction; each cell is shaded by its share of its true-class row.
const CAP = 0.12;

export function Heatmap({ data }: { data: ConfusionData }) {
  const [ref, w] = useMeasure();
  return (
    <div className="chart tscroll" ref={ref}>
      {w > 10 && <HeatSvg data={data} w={w} />}
    </div>
  );
}

function HeatSvg({ data, w: boxW }: { data: ConfusionData; w: number }) {
  const vizTip = useVizTip();
  const [hot, setHot] = useState<[number, number] | null>(null);

  const n = data.labels.length;
  const labelCol = 72;
  const topM = 74;
  const cell = clamp(Math.floor((boxW - labelCol - 10) / n) - 2, 15, 30);
  const w = labelCol + n * (cell + 2) + 10;
  const h = topM + n * (cell + 2) + 46;
  const ramp = (t: number) => C.seq[Math.min(C.seq.length - 1, Math.floor(t * (C.seq.length - 1) + 0.5))];
  const rowTotals = data.matrix.map((r) => r.reduce((a, b) => a + b, 0));

  const lw = 150;
  const lx = labelCol;
  const ly = topM + n * (cell + 2) + 16;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {/* column labels (rotated) */}
      {data.labels.map((lab, j) => {
        const x = labelCol + j * (cell + 2) + cell / 2;
        return (
          <text key={`c${j}`} x={x + 4} y={topM - 8} className="ax" transform={`rotate(-52 ${x + 4} ${topM - 8})`}>
            {lab}
          </text>
        );
      })}
      {/* rows: label + cells */}
      {data.labels.map((rowLab, i) => (
        <g key={`r${i}`}>
          <text x={labelCol - 8} y={topM + i * (cell + 2) + cell / 2 + 4} textAnchor="end" className="ax">
            {rowLab}
          </text>
          {data.labels.map((colLab, j) => {
            const v = data.matrix[i][j];
            const share = v / rowTotals[i];
            const x = labelCol + j * (cell + 2);
            const y = topM + i * (cell + 2);
            const hp = hoverHandlers(
              vizTip,
              (cx, cy) => {
                setHot([i, j]);
                vizTip.show(cx, cy, `true ${rowLab} → predicted ${colLab}`, [
                  [i === j ? C.seq[12] : C.primary, fmtComma(v), "doodles"],
                  [null, fmtPct(share), `of true ${rowLab}`],
                ]);
              },
              () => {
                setHot(null);
                vizTip.hide();
              },
            );
            return (
              <rect
                key={`${i}-${j}`}
                x={x}
                y={y}
                width={cell}
                height={cell}
                rx={2.5}
                fill={v === 0 ? C.card : ramp(Math.min(1, share / CAP))}
                stroke={v === 0 ? C.grid : "none"}
                strokeWidth={v === 0 ? 1 : 0}
                {...hp}
              />
            );
          })}
        </g>
      ))}
      {/* hover ring */}
      {hot && (
        <rect
          x={labelCol + hot[1] * (cell + 2) - 1}
          y={topM + hot[0] * (cell + 2) - 1}
          width={cell + 2}
          height={cell + 2}
          rx={3.5}
          fill="none"
          stroke={C.ink}
          strokeWidth={1.5}
          className="hov hov-on"
        />
      )}
      {/* legend: capped gradient */}
      {C.seq.map((col, k) => (
        <rect key={`lg${k}`} x={lx + k * (lw / C.seq.length)} y={ly} width={lw / C.seq.length + 0.5} height={8} fill={col} />
      ))}
      <text x={lx} y={ly + 22} className="ax">
        0%
      </text>
      <text x={lx + lw} y={ly + 22} textAnchor="end" className="ax">
        12%+
      </text>
      <text x={lx + lw + 14} y={ly + 9} className="ax">
        share of the true class (capped — the diagonal is 77–98%)
      </text>
    </svg>
  );
}
