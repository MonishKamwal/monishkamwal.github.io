"use client";

import { performance as perf } from "@/lib/content";
import { CONTRACT_URL, type ApiMetrics } from "@/lib/data/contracts";
import { useContracts } from "@/lib/hooks/useContracts";
import { C, fmtComma, fmtDayYear } from "@/lib/data/format";
import { renderInline } from "@/lib/story/inline";
import {
  ChartPanel,
  ContractState,
  PageFoot,
  PageHead,
  Prov,
  ReadNextData,
} from "../ui";
import { LineChart, type Pt } from "../charts/LineChart";
import { DataTable } from "../charts/DataTable";
import { MeterLedger } from "../charts/MeterLedger";

const p = perf;
const panel = (id: string) => p.panels.find((x) => x.id === id)!;

// Performance — a snapshot from the last EKS dress rehearsal (DESIGN.md §7.4).
// Renders live from api-metrics.json: KPI tiles, latency p50–p99, throughput,
// the status ledger, node CPU/mem. A deliberate monthly capture, not a live feed.
export function PerformancePage() {
  const state = useContracts<{ api: ApiMetrics }>({ api: CONTRACT_URL.apiMetrics });

  return (
    <div className="wrap">
      <PageHead
        title={p.title}
        lead={p.subtitle}
        prov={
          <ContractState state={state}>
            {({ api }) => (
              <Prov
                live={p.provenance.liveLabel}
                mock={p.provenance.mock}
                contract={p.provenance.contract}
                generated={`${p.provenance.generatedVerb} ${fmtDayYear(api.captured_at)}`}
                cadence={p.provenance.cadence}
              />
            )}
          </ContractState>
        }
      />

      <div className="grid12">
        {/* narrative well — present even before the contract resolves */}
        <div className="panel well reveal" style={{ gridColumn: "span 12" }}>
          <p style={{ margin: 0, fontSize: 15, maxWidth: "74ch" }}>
            {renderInline(panel("intro").body_md ?? "")}{" "}
            <a className="link" href={panel("intro").link!.href}>
              {panel("intro").link!.label}
            </a>
          </p>
        </div>

        <ContractState state={state}>{({ api }) => <PerfBoard api={api} />}</ContractState>
      </div>

      <PageFoot note={p.footer} links={p.links} />
      <ReadNextData next={p.readNext} />
    </div>
  );
}

function PerfBoard({ api }: { api: ApiMetrics }) {
  const Q = api.queries;
  const step = api.window.step_seconds;
  const rps = Q.rps_total.series[0].points as Pt[];
  // Latency comes in seconds; the page reads in milliseconds.
  const toMs = (pts: Pt[]): Pt[] => pts.map((p) => [p[0], p[1] * 1000]);
  const lat = {
    p50: toMs(Q.latency_p50.series[0].points),
    p90: toMs(Q.latency_p90.series[0].points),
    p95: toMs(Q.latency_p95.series[0].points),
    p99: toMs(Q.latency_p99.series[0].points),
  };
  const t0 = api.window.start;
  const mins = (t: number) => (t - t0) / 60;
  const fmtMin = (t: number) => `${Math.round(mins(t))}m`;

  // requests_by_status is a per-class rate (reqps); integrate rate × step to get
  // request counts over the captured window. 4xx/5xx classes are simply absent
  // when none occurred.
  const integ = (pts: Pt[]) => pts.reduce((a, p) => a + p[1] * step, 0);
  const byClass: Record<string, number> = {};
  Q.requests_by_status.series.forEach((s) => {
    byClass[s.labels.status] = integ(s.points);
  });
  const c2 = byClass["2xx"] ?? 0;
  const c4 = byClass["4xx"] ?? 0;
  const c5 = byClass["5xx"] ?? 0;
  const total = c2 + c4 + c5;

  // Prometheus publishes only the window it captured; the plateau (minutes 4–11)
  // can be empty on a partial capture, so fall back to the full series.
  const steady = (pts: Pt[]) => {
    const inWindow = pts.filter((pt) => mins(pt[0]) >= 4 && mins(pt[0]) <= 11);
    const sel = inWindow.length ? inWindow : pts;
    return { v: sel.reduce((a, pt) => a + pt[1], 0) / sel.length, pinned: inWindow.length > 0 };
  };
  const p50s = steady(lat.p50);
  const p99s = steady(lat.p99);
  const plateauSub = p50s.pinned ? "minutes 4–11" : "captured window";

  const tiles: [string, string, string][] = [
    ["peak throughput", `${Math.round(Math.max(...rps.map((pt) => pt[1])))} rps`, "15-minute k6 run"],
    ["p50 at plateau", `${Math.round(p50s.v)} ms`, plateauSub],
    ["p99 at plateau", `${Math.round(p99s.v)} ms`, "tail latency"],
    ["requests served", fmtComma(Math.round(total)), "across the run"],
    ["error rate", `${total > 0 ? ((c5 / total) * 100).toFixed(2) : "0.00"}%`, `${fmtComma(Math.round(c5))} × 5xx`],
    ["left running after", "0", "terraform destroy"],
  ];

  // Node utilisation is a per-instance ratio; average the cluster's nodes per
  // timestamp and read as a percentage.
  const clusterAvg = (q: typeof Q.node_cpu_utilization): Pt[] => {
    const series = q.series;
    if (!series.length) return [];
    return series[0].points.map((_, i) => {
      const ts = series[0].points[i][0];
      const vals = series.map((s) => s.points[i]?.[1] ?? 0);
      return [ts, (vals.reduce((a, b) => a + b, 0) / series.length) * 100];
    });
  };

  // Axis spans the nominal window, not just the captured points: a full capture
  // fills it (as in the prototype), a partial one honestly shows data only where
  // Prometheus returned it.
  const tEnd = api.window.end;
  const xTicks = [0, 3, 6, 9, 12, 15].map((m) => t0 + m * 60);
  const latMax = Math.ceil(Math.max(...lat.p99.map((pt) => pt[1])) / 40) * 40;
  const rpsMax = Math.ceil(Math.max(...rps.map((pt) => pt[1])) / 40) * 40;
  const quarter = <T,>(arr: T[]) => arr.filter((_, i) => i % 4 === 0);
  const latKeys = ["p50", "p90", "p95", "p99"] as const;

  return (
    <>
      {/* KPI row */}
      <div className="panel reveal" style={{ gridColumn: "span 12" }}>
        <div className="tile-row">
          {tiles.map(([l, v, s]) => (
            <div className="tile" key={l}>
              <div className="t-label">{l}</div>
              <div className="t-value">{v}</div>
              <div className="t-sub">{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* latency percentiles */}
      <ChartPanel
        span={panel("latency").span}
        title={panel("latency").title!}
        sub={panel("latency").sub}
        legend={
          <div className="lg">
            {latKeys.map((k, i) => (
              <span className="k" key={k}>
                <span className="sw-line" style={{ background: C.ord[i] }} />
                {["p50 (median)", "p90", "p95", "p99"][i]}
              </span>
            ))}
          </div>
        }
        table={
          <DataTable
            heads={["minute", "p50", "p90", "p95", "p99"]}
            numCols={[1, 2, 3, 4]}
            rows={quarter(lat.p50).map((pt, ri) => {
              const i = ri * 4;
              return [`${Math.round(mins(pt[0]))}m`, ...latKeys.map((k) => `${Math.round(lat[k][i][1])} ms`)];
            })}
          />
        }
      >
        <LineChart
          cfg={{
            h: 280,
            series: latKeys.map((k, i) => ({ name: k, color: C.ord[i], pts: lat[k], endLabel: true })),
            x: { fmt: fmtMin, ticks: xTicks, min: t0, max: tEnd },
            y: { fmt: (v) => `${Math.round(v)} ms`, max: latMax },
            yTicks: 4,
          }}
        />
      </ChartPanel>

      {/* throughput */}
      <ChartPanel
        span={panel("throughput").span}
        title={panel("throughput").title!}
        sub={panel("throughput").sub}
        table={
          <DataTable
            heads={["minute", "req/s"]}
            numCols={[1]}
            rows={quarter(rps).map((pt) => [`${Math.round(mins(pt[0]))}m`, pt[1].toFixed(0)])}
          />
        }
      >
        <LineChart
          cfg={{
            h: 220,
            series: [{ name: "requests / s", color: C.primary, pts: rps, area: true }],
            x: { fmt: fmtMin, ticks: xTicks, min: t0, max: tEnd },
            y: { fmt: (v) => String(Math.round(v)), max: rpsMax },
            yTicks: 4,
            xBands: [
              { from: t0, to: t0 + 180, label: "ramp" },
              { from: t0 + 180, to: t0 + 720, label: "plateau" },
              { from: t0 + 720, to: t0 + 900, label: "ramp-down" },
            ],
          }}
        />
      </ChartPanel>

      {/* status ledger */}
      <div className="panel reveal" data-stagger={1} style={{ gridColumn: "span 5" }}>
        <div className="p-head">
          <div>
            <div className="p-title">{panel("status-ledger").title}</div>
            <div className="p-sub">{panel("status-ledger").sub}</div>
          </div>
        </div>
        <MeterLedger
          total={total}
          rows={[
            { code: "2xx", kind: "ok", color: C.ok, count: Math.round(c2) },
            { code: "4xx", kind: "watch", color: C.watch, count: Math.round(c4) },
            { code: "5xx", kind: "bad", color: C.bad, count: Math.round(c5) },
          ]}
        />
        <div className="cap">{panel("status-ledger").caption}</div>
      </div>

      {/* node utilization */}
      {(
        [
          ["node-cpu", clusterAvg(Q.node_cpu_utilization), "cpu %", 0],
          ["node-mem", clusterAvg(Q.node_mem_utilization), "mem %", 1],
        ] as const
      ).map(([id, pts, name, idx]) => (
        <ChartPanel
          key={id}
          span={panel(id).span}
          title={panel(id).title!}
          sub={panel(id).sub}
          stagger={idx}
          table={
            <DataTable
              heads={["minute", "%"]}
              numCols={[1]}
              rows={quarter(pts).map((pt) => [`${Math.round(mins(pt[0]))}m`, pt[1].toFixed(0)])}
            />
          }
        >
          <LineChart
            cfg={{
              h: 170,
              series: [{ name, color: C.primary, pts, area: true }],
              x: { fmt: fmtMin, ticks: [0, 5, 10, 15].map((m) => t0 + m * 60), min: t0, max: tEnd },
              y: { fmt: (v) => `${Math.round(v)}%`, max: 100 },
              yTicks: 4,
            }}
          />
        </ChartPanel>
      ))}
    </>
  );
}
