"use client";

import { useMeasure } from "@/lib/hooks/useMeasure";
import { C, fmt4 } from "@/lib/data/format";
import { useHoverProps } from "./useHover";
import { useVizTip } from "../VizTip";

export type GateConfig = {
  floor: number;
  eps: number;
  champ: number;
  champV: string;
  chall: number;
  challV: string;
};

// The quality gate as a single instrument reading (ported from the prototype's
// `gateLine`): one axis, the blocked zone below the floor, the ε band at the
// champion, the champion (ink, upper lane) and challenger (blue, lower lane)
// dropped to the axis. The whole instrument is the mark, so it has no hover mark
// — a hover just reads out the rule.
export function GateLine({ cfg }: { cfg: GateConfig }) {
  const [ref, w] = useMeasure();
  return (
    <div className="chart" ref={ref}>
      {w > 10 && <GateSvg cfg={cfg} w={w} />}
    </div>
  );
}

function GateSvg({ cfg, w }: { cfg: GateConfig; w: number }) {
  const vizTip = useVizTip();
  const h = 132;
  const M = { l: 16, r: 16 };
  const pw = w - M.l - M.r;
  const [d0, d1] = [0.83, 0.935];
  const X = (v: number) => M.l + ((v - d0) / (d1 - d0)) * pw;
  const axisY = 62;
  const laneCh = 34;
  const laneLa = 104;

  const ticks: number[] = [];
  for (let v = 0.84; v <= 0.9301; v += 0.01) ticks.push(Math.round(v * 100) / 100);

  const hp = useHoverProps(
    (cx, cy) =>
      vizTip.show(cx, cy, "the gate, this deploy", [
        [C.ink, fmt4(cfg.champ), `champion v${cfg.champV}`],
        [C.primary, fmt4(cfg.chall), `challenger v${cfg.challV}`],
        [null, `≥ ${cfg.floor.toFixed(2)} and within ε ${cfg.eps}`, "rule"],
      ]),
    () => vizTip.hide(),
  );

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {/* blocked zone below the floor */}
      <rect x={M.l} y={axisY - 26} width={X(cfg.floor) - M.l} height={52} fill="rgba(208,59,59,.06)" />
      <text x={(M.l + X(cfg.floor)) / 2} y={axisY - 32} textAnchor="middle" className="ax-title" style={{ fill: "#d03b3b" }}>
        blocked
      </text>
      {/* epsilon band */}
      <rect x={X(cfg.champ - cfg.eps)} y={axisY - 26} width={X(cfg.champ) - X(cfg.champ - cfg.eps)} height={52} fill="rgba(201,138,58,.16)" />
      {/* axis + ticks */}
      <line x1={M.l} x2={M.l + pw} y1={axisY} y2={axisY} stroke={C.axis} strokeWidth={1.4} />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={X(v)} x2={X(v)} y1={axisY - 3} y2={axisY + 3} stroke={C.axis} strokeWidth={1} />
          <text x={X(v)} y={axisY + 18} textAnchor="middle" className="ax">
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {/* floor */}
      <line x1={X(cfg.floor)} x2={X(cfg.floor)} y1={axisY - 26} y2={axisY + 26} stroke={C.ink} strokeWidth={1.4} />
      <text x={X(cfg.floor)} y={axisY + 40} textAnchor="middle" className="dlab">
        floor {cfg.floor.toFixed(2)}
      </text>
      {/* champion (upper lane) */}
      <line x1={X(cfg.champ)} x2={X(cfg.champ)} y1={laneCh} y2={axisY} stroke={C.grid} strokeWidth={1} />
      <circle cx={X(cfg.champ)} cy={laneCh} r={5.5} fill={C.ink} stroke={C.card} strokeWidth={2} />
      <text x={X(cfg.champ) - 12} y={laneCh + 4} textAnchor="end" className="dlab">
        champion v{cfg.champV} · {fmt4(cfg.champ)}
      </text>
      {/* challenger (lower lane) */}
      <line x1={X(cfg.chall)} x2={X(cfg.chall)} y1={axisY} y2={laneLa} stroke={C.grid} strokeWidth={1} />
      <circle cx={X(cfg.chall)} cy={laneLa} r={5.5} fill={C.primary} stroke={C.card} strokeWidth={2} />
      <text x={X(cfg.chall) - 12} y={laneLa + 4} textAnchor="end" className="dlab">
        challenger v{cfg.challV} · {fmt4(cfg.chall)}
      </text>
      <rect x={0} y={0} width={w} height={h} fill="transparent" {...hp} />
    </svg>
  );
}
