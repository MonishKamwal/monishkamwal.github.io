"use client";

import { monitoring } from "@/lib/content";
import {
  CONTRACT_URL,
  type Drift,
  type DriftHistoryEntry,
  type Feedback,
  type FeedbackHistoryEntry,
} from "@/lib/data/contracts";
import { useContracts } from "@/lib/hooks/useContracts";
import { C, fmtComma, fmtDay, fmtDayYear, fmtPct } from "@/lib/data/format";
import { renderInline } from "@/lib/story/inline";
import {
  ChartPanel,
  ContractState,
  Legend,
  PageFoot,
  PageHead,
  Prov,
  ReadNextData,
  StatusChip,
} from "../ui";
import { HistPair } from "../charts/HistPair";
import { Dumbbell } from "../charts/Dumbbell";
import { LineChart, type Pt } from "../charts/LineChart";
import { DataTable } from "../charts/DataTable";

const m = monitoring;
const panel = (id: string) => m.panels.find((p) => p.id === id)!;

type MonData = {
  drift: Drift;
  driftHistory: DriftHistoryEntry[];
  feedback: Feedback;
  feedbackHistory: FeedbackHistoryEntry[];
};

const methodName = (mth: string) =>
  mth === "jensenshannon" ? "jensen–shannon" : mth;

// Monitoring — is it holding up against real visitors? (DESIGN.md §7.3). Renders
// live from drift.json + its history + feedback.json + its history. The current
// feedback window can be quiet (n = 0); that is normal — the drift signals carry
// the page, and the proxy-accuracy panel falls back to the last window with votes.
export function MonitoringPage() {
  const state = useContracts<MonData>({
    drift: CONTRACT_URL.drift,
    driftHistory: CONTRACT_URL.driftHistory,
    feedback: CONTRACT_URL.feedback,
    feedbackHistory: CONTRACT_URL.feedbackHistory,
  });

  return (
    <div className="wrap">
      <PageHead
        title={m.title}
        lead={m.subtitle}
        prov={
          <ContractState state={state}>
            {({ drift }) => (
              <Prov
                live={m.provenance.liveLabel}
                contract={m.provenance.contract}
                generated={`${m.provenance.generatedVerb} ${fmtDayYear(drift.generated_at)}`}
                cadence={m.provenance.cadence}
              />
            )}
          </ContractState>
        }
      />

      <div className="grid12">
        <ContractState state={state}>{(data) => <MonitoringBoard data={data} />}</ContractState>
      </div>

      <PageFoot note={m.footer} links={m.links} />
      <ReadNextData next={m.readNext} />
    </div>
  );
}

function MonitoringBoard({ data }: { data: MonData }) {
  const { drift, driftHistory: DH, feedback: FB, feedbackHistory: FH } = data;
  const conf = drift.columns.confidence;
  const marg = drift.columns.margin;
  const lab = drift.columns.predicted_label;
  const nSignals = Object.keys(drift.columns).length;

  const refMean = conf.distribution.reference.mean;
  const curMean = conf.distribution.current.mean;
  const verdict = panel("verdict");
  const bannerText = (verdict.body_md ?? "")
    .replace("{refMean}", refMean.toFixed(2))
    .replace("{curMean}", curMean.toFixed(2));

  const colSub = (c: { method: string; score: number; threshold: number }) =>
    `${methodName(c.method)} ${c.score.toFixed(2)} · threshold ${c.threshold.toFixed(2)}`;

  // dumbbell rows: class share reference → current, sorted by shift
  const ld = lab.distribution;
  const dumbRows = ld.labels
    .map((l) => ({ label: l, ref: ld.reference[l] ?? 0, cur: ld.current[l] ?? 0 }))
    .sort((a, b) => b.cur - b.ref - (a.cur - a.ref));
  const dumbMax = Math.max(...dumbRows.map((r) => Math.max(r.ref, r.cur))) * 1.15;

  const tms = DH.map((d) => Date.parse(d.date));

  // proxy accuracy: the current window can be quiet (n = 0) — fall back to the
  // most recent window that actually collected votes, clearly dated.
  const withVotes = FH.filter((e) => e.n > 0 && e.accuracy != null);
  const fbShown =
    FB.window.n > 0
      ? { acc: FB.accuracy!, n: FB.window.n, nc: FB.window.n_correct, date: FB.generated_at, current: true }
      : (() => {
          const h = withVotes[withVotes.length - 1];
          return h ? { acc: h.accuracy!, n: h.n, nc: h.n_correct, date: h.date, current: false } : null;
        })();
  const prev = fbShown?.current
    ? withVotes[withVotes.length - 1]
    : withVotes[withVotes.length - 2];

  return (
    <>
      {/* verdict banner */}
      <div className="panel banner is-bad reveal" style={{ gridColumn: "span 12" }}>
        <div className="b-row">
          <StatusChip kind="bad" label={`output drift — ${drift.dataset_drift.drifted_columns} of ${nSignals} signals`} />
          <span className="micro">
            {verdict.windowLabel}{" "}
            {fmtComma(drift.window.n_current)} live vs {fmtComma(drift.window.n_reference)} reference predictions
          </span>
        </div>
        <p className="b-text">{renderInline(bannerText)}</p>
      </div>

      {/* numeric drift columns */}
      {(
        [
          ["confidence", conf, 0],
          ["margin", marg, 1],
        ] as const
      ).map(([id, col, idx]) => {
        const d = col.distribution;
        const refN = d.reference.counts.reduce((a, b) => a + b, 0);
        const curN = d.current.counts.reduce((a, b) => a + b, 0);
        return (
          <ChartPanel
            key={id}
            span={6}
            stagger={idx}
            title={panel(id).title!}
            sub={colSub(col)}
            status={{ kind: "bad", label: "drifted" }}
            legend={
              <Legend
                items={[
                  ["rect", C.primary, "current window"],
                  ["rect", C.ref, "training-era reference"],
                ]}
              />
            }
            table={
              <DataTable
                heads={["bin", "current n", "current", "reference"]}
                numCols={[1, 2, 3]}
                rows={d.bin_edges.slice(0, -1).map((lo, i) => [
                  `${lo.toFixed(2)} – ${d.bin_edges[i + 1].toFixed(2)}`,
                  d.current.counts[i],
                  fmtPct(d.current.counts[i] / (curN || 1)),
                  fmtPct(d.reference.counts[i] / (refN || 1)),
                ])}
              />
            }
          >
            <HistPair
              cfg={{
                edges: d.bin_edges,
                ref: d.reference.counts,
                cur: d.current.counts,
                refMean: d.reference.mean,
                curMean: d.current.mean,
              }}
            />
          </ChartPanel>
        );
      })}

      {/* categorical drift: what people actually draw */}
      <ChartPanel
        span={7}
        title={panel("labels").title!}
        sub={colSub(lab)}
        status={{ kind: "bad", label: "drifted" }}
        caption={panel("labels").caption}
        legend={
          <Legend
            items={[
              ["dot", C.primary, "current window"],
              ["dot", C.ref, "reference share"],
            ]}
          />
        }
        table={
          <DataTable
            heads={["class", "reference", "current", "shift"]}
            numCols={[1, 2, 3]}
            rows={dumbRows.map((r) => [
              r.label,
              fmtPct(r.ref),
              fmtPct(r.cur),
              `${r.cur - r.ref >= 0 ? "+" : ""}${((r.cur - r.ref) * 100).toFixed(1)} pp`,
            ])}
          />
        }
      >
        <Dumbbell rows={dumbRows} max={dumbMax} />
      </ChartPanel>

      {/* trends column */}
      <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
        <ChartPanel
          span={12}
          stagger={1}
          title={panel("confidence-trend").title!}
          sub={panel("confidence-trend").sub}
          legend={
            <Legend
              items={[
                ["line", C.primary, "live mean confidence"],
                ["line", C.ref, "reference mean"],
              ]}
            />
          }
          table={
            <DataTable
              heads={["run", "reference", "current", "live n"]}
              numCols={[1, 2, 3]}
              rows={DH.map((d) => [
                d.date,
                d.mean_confidence_reference.toFixed(3),
                d.mean_confidence_current.toFixed(3),
                d.n_current,
              ])}
            />
          }
        >
          <LineChart
            cfg={{
              h: 190,
              padL: 44,
              series: [
                { name: "reference", color: C.ref, pts: DH.map((d, i) => [tms[i], d.mean_confidence_reference]) as Pt[], dots: true },
                { name: "current", color: C.primary, pts: DH.map((d, i) => [tms[i], d.mean_confidence_current]) as Pt[], dots: true },
              ],
              x: { fmt: fmtDay },
              y: { fmt: (v) => v.toFixed(2), min: 0.5, max: 1.0 },
              yTicks: 5,
            }}
          />
        </ChartPanel>

        <ChartPanel
          span={12}
          stagger={2}
          title={panel("columns-drifted").title!}
          sub={panel("columns-drifted").sub}
          table={
            <DataTable
              heads={["run", "drifted", "of", "drift?"]}
              numCols={[1, 2]}
              rows={DH.map((d) => [d.date, d.drifted_columns, nSignals, d.drift_detected ? "yes" : "no"])}
            />
          }
        >
          <LineChart
            cfg={{
              h: 150,
              padL: 44,
              series: [
                {
                  name: "columns drifted",
                  color: C.primary,
                  pts: DH.map((d, i) => [tms[i], d.drifted_columns]) as Pt[],
                  dots: true,
                  dotColor: (_p, i) => (DH[i].drift_detected ? C.bad : C.primary),
                },
              ],
              x: { fmt: fmtDay },
              y: { fmt: (v) => String(Math.round(v)), min: 0, max: nSignals },
              yTicks: nSignals,
            }}
          />
        </ChartPanel>
      </div>

      {/* feedback / proxy accuracy */}
      <div className="panel reveal" style={{ gridColumn: "span 5" }}>
        <div className="p-head">
          <div>
            <div className="p-title">{panel("proxy-accuracy").title}</div>
            <div className="p-sub">{panel("proxy-accuracy").sub}</div>
          </div>
        </div>
        <div className="hero-num" style={{ fontSize: "clamp(40px,4.6vw,56px)" }}>
          {fbShown ? (fbShown.acc * 100).toFixed(1) : "—"}
          <span className="unit">%</span>
        </div>
        {fbShown && !fbShown.current && (
          <div className="p-sub" style={{ marginTop: 4 }}>
            latest window with votes · {fmtDay(fbShown.date)} (quiet since)
          </div>
        )}
        <div className="tile-row" style={{ marginTop: 14 }}>
          <div className="tile">
            <div className="t-label">votes</div>
            <div className="t-value">{fbShown ? fbShown.n : 0}</div>
            <div className="t-sub">
              {fbShown ? `${fbShown.nc} yes · ${fbShown.n - fbShown.nc} no` : "no votes yet"}
            </div>
          </div>
          <div className="tile">
            <div className="t-label">last window</div>
            <div className="t-value">{prev ? `${(prev.accuracy! * 100).toFixed(0)}%` : "—"}</div>
            <div className="t-sub">{prev ? `n = ${prev.n} · ${fmtDay(prev.date)}` : ""}</div>
          </div>
        </div>
        <div className="cap">{panel("proxy-accuracy").caption}</div>
      </div>

      {/* verdicts by predicted class */}
      <div className="panel reveal" data-stagger={1} style={{ gridColumn: "span 7" }}>
        <div className="p-head">
          <div>
            <div className="p-title">{panel("verdicts-by-class").title}</div>
            <div className="p-sub">{panel("verdicts-by-class").sub}</div>
          </div>
        </div>
        {FB.window.n > 0 && FB.by_class.length > 0 ? (
          <DataTable
            heads={["model guessed", "votes", "yes votes", "proxy accuracy"]}
            numCols={[1, 2, 3]}
            rows={[...FB.by_class]
              .sort((a, b) => b.n - a.n)
              .map((r) => [r.predicted_label, r.n, r.n_correct, fmtPct(r.accuracy, 0)])}
          />
        ) : (
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--muted-foreground)", maxWidth: "60ch" }}>
            No votes in the current window (<span style={{ fontVariantNumeric: "tabular-nums" }}>n = 0</span>).
            Per-class verdicts are published for the live window only; quiet weeks are normal, and the drift
            signals above carry the page through them.
          </p>
        )}
      </div>
    </>
  );
}
