"use client";

import { useRef, useState } from "react";
import { useMeasure } from "@/lib/hooks/useMeasure";
import { C, niceMax } from "@/lib/data/format";
import { useHoverProps } from "./useHover";
import { useVizTip } from "../VizTip";

export type Pt = [number, number];
export type LineSeries = {
  name: string;
  color: string;
  pts: Pt[];
  area?: boolean;
  dots?: boolean;
  dotLabels?: boolean;
  dotColor?: (p: Pt, i: number) => string;
  endLabel?: boolean;
};
export type LineConfig = {
  series: LineSeries[];
  x: { fmt: (v: number) => string; ticks?: number[]; min?: number; max?: number };
  y: { fmt: (v: number) => string; min?: number; max?: number };
  yTicks?: number;
  h?: number;
  padT?: number;
  padL?: number;
  xBands?: { from: number; to: number; label: string }[];
};

// Line / area plot with a shared crosshair + tooltip (ported from the prototype's
// `lineChart`). Thin marks, hairline grid, the zero rule in --axis. Rebuilds at
// the measured container width; the crosshair snaps to the nearest x sample.
export function LineChart({ cfg }: { cfg: LineConfig }) {
  const [ref, w] = useMeasure();
  const svgRef = useRef<SVGSVGElement>(null);
  const [bi, setBi] = useState<number | null>(null);

  const h = cfg.h ?? 210;
  const anyEnd = cfg.series.some((s) => s.endLabel);
  const M = { t: cfg.padT ?? 16, r: anyEnd ? 58 : 14, b: 26, l: cfg.padL ?? 40 };
  const pw = w - M.l - M.r;
  const ph = h - M.t - M.b;

  const xs = cfg.series[0].pts.map((p) => p[0]);
  const x0 = cfg.x.min != null ? cfg.x.min : Math.min(...xs);
  const x1 = cfg.x.max != null ? cfg.x.max : Math.max(...xs);
  const yMax =
    cfg.y.max != null
      ? cfg.y.max
      : niceMax(Math.max(...cfg.series.flatMap((s) => s.pts.map((p) => p[1]))) * 1.08);
  const yMin = cfg.y.min != null ? cfg.y.min : 0;
  const X = (v: number) => M.l + ((v - x0) / (x1 - x0 || 1)) * pw;
  const Y = (v: number) => M.t + ph - ((v - yMin) / (yMax - yMin || 1)) * ph;

  const vizTip = useVizTip();
  const hoverProps = useHoverProps(
    (clientX, clientY) => {
      const svg = svgRef.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const mx = (clientX - r.left) * (w / r.width);
      let best = 0;
      let bd = 1e9;
      xs.forEach((v, i) => {
        const d = Math.abs(X(v) - mx);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      setBi(best);
      vizTip.show(
        clientX,
        clientY,
        cfg.x.fmt(xs[best]),
        cfg.series.map((s) => [s.color, cfg.y.fmt(s.pts[best][1]), s.name]),
      );
    },
    () => {
      setBi(null);
      vizTip.hide();
    },
  );

  const nT = cfg.yTicks ?? 4;
  const yTickVals = Array.from({ length: nT + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / nT);
  const xTicks = cfg.x.ticks ?? xs.filter((_, i) => i % Math.ceil(xs.length / 6) === 0);

  return (
    <div className="chart" ref={ref}>
      {w > 10 && (
        <LineSvg
          svgRef={svgRef}
          cfg={cfg}
          geo={{ w, h, M, pw, ph, X, Y, yMin, xs, yTickVals, xTicks }}
          bi={bi}
          hoverProps={hoverProps}
        />
      )}
    </div>
  );
}

type Geo = {
  w: number;
  h: number;
  M: { t: number; r: number; b: number; l: number };
  pw: number;
  ph: number;
  X: (v: number) => number;
  Y: (v: number) => number;
  yMin: number;
  xs: number[];
  yTickVals: number[];
  xTicks: number[];
};

function LineSvg({
  svgRef,
  cfg,
  geo,
  bi,
  hoverProps,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  cfg: LineConfig;
  geo: Geo;
  bi: number | null;
  hoverProps: ReturnType<typeof useHoverProps>;
}) {
  // The parent's hover handler owns the tooltip (show/hide + rows); this draws
  // the crosshair at the snapped index and the transparent hit area.
  const { w, h, M, pw, ph, X, Y, yMin, xs, yTickVals, xTicks } = geo;

  return (
    <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {/* grid + y ticks */}
      {yTickVals.map((v, i) => (
        <g key={`y${i}`}>
          <line x1={M.l} x2={M.l + pw} y1={Y(v)} y2={Y(v)} stroke={i === 0 ? C.axis : C.grid} strokeWidth={1} />
          <text x={M.l - 7} y={Y(v) + 3.5} textAnchor="end" className="ax">
            {cfg.y.fmt(v)}
          </text>
        </g>
      ))}
      {/* x bands (k6 phases) */}
      {(cfg.xBands ?? []).map((b, i) => (
        <g key={`b${i}`}>
          {b.from > (cfg.x.min ?? Math.min(...xs)) && (
            <line x1={X(b.from)} x2={X(b.from)} y1={M.t} y2={M.t + ph} stroke={C.grid} strokeWidth={1} />
          )}
          <text x={(X(b.from) + X(b.to)) / 2} y={M.t + 11} textAnchor="middle" className="ax-title">
            {b.label}
          </text>
        </g>
      ))}
      {/* x ticks */}
      {xTicks.map((v, i) => (
        <text key={`x${i}`} x={X(v)} y={h - 8} textAnchor="middle" className="ax">
          {cfg.x.fmt(v)}
        </text>
      ))}
      {/* series */}
      {cfg.series.map((s, si) => {
        const d = s.pts.map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)} ${Y(p[1]).toFixed(1)}`).join(" ");
        const last = s.pts[s.pts.length - 1];
        return (
          <g key={si}>
            {s.area && (
              <path
                d={`${d} L${X(last[0]).toFixed(1)} ${Y(yMin)} L${X(s.pts[0][0]).toFixed(1)} ${Y(yMin)} Z`}
                fill={s.color}
                opacity={0.1}
              />
            )}
            <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {s.dots &&
              s.pts.map((p, i) => (
                <g key={i}>
                  <circle cx={X(p[0])} cy={Y(p[1])} r={4.5} fill={s.dotColor ? s.dotColor(p, i) : s.color} stroke={C.card} strokeWidth={2} />
                  {s.dotLabels && (
                    <text x={X(p[0])} y={Y(p[1]) - 10} textAnchor="middle" className="dlab">
                      {cfg.y.fmt(p[1])}
                    </text>
                  )}
                </g>
              ))}
            {s.endLabel && (
              <text x={X(last[0]) + 8} y={Y(last[1]) + 3.5} className="dlab">
                {s.name}
              </text>
            )}
          </g>
        );
      })}
      {/* crosshair + hit area */}
      {bi != null && (
        <line x1={X(xs[bi])} x2={X(xs[bi])} y1={M.t} y2={M.t + ph} stroke={C.axis} strokeWidth={1} className="hov hov-on" />
      )}
      <rect x={M.l} y={M.t} width={pw} height={ph} fill="transparent" {...hoverProps} />
    </svg>
  );
}
