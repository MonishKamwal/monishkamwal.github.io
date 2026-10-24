"use client";

import { quality } from "@/lib/content";
import { CONTRACT_URL, ILLUSTRATIVE_CONFUSION, type Evidence } from "@/lib/data/contracts";
import { useContracts } from "@/lib/hooks/useContracts";
import {
  fmt4,
  fmtComma,
  fmtDay,
  fmtEvidenceStamp,
  parseEvDate,
} from "@/lib/data/format";
import {
  ChartPanel,
  ContractState,
  PageFoot,
  PageHead,
  Prov,
  ReadNextData,
  StatusChip,
} from "../ui";
import { GateLine } from "../charts/GateLine";
import { DotPlot } from "../charts/DotPlot";
import { Heatmap } from "../charts/Heatmap";
import { DataTable } from "../charts/DataTable";

const q = quality;
const panel = (id: string) => q.panels.find((p) => p.id === id)!;

// Quality — the model's report card (DESIGN.md §7.2). Every panel renders live
// from evidence.json; this file is the layout + the static framing from
// content/data/quality.json. The confusion matrix is the one illustrative
// panel (the hub doesn't publish cell-level data yet).
export function QualityPage() {
  const state = useContracts<{ ev: Evidence }>({ ev: CONTRACT_URL.evidence });

  return (
    <div className="wrap">
      <PageHead
        title={q.title}
        lead={q.subtitle}
        prov={
          <ContractState state={state}>
            {({ ev }) => (
              <Prov
                live={q.provenance.liveLabel}
                contract={q.provenance.contract}
                generated={`${q.provenance.generatedVerb} ${fmtEvidenceStamp(ev.generated_at)}`}
                cadence={q.provenance.cadence}
              />
            )}
          </ContractState>
        }
      />

      <div className="grid12">
        <ContractState state={state}>{({ ev }) => <QualityBoard ev={ev} />}</ContractState>
      </div>

      <PageFoot note={q.footer} links={q.links} />
      <ReadNextData next={q.readNext} />
    </div>
  );
}

function QualityBoard({ ev }: { ev: Evidence }) {
  const champ = ev.champion;
  const runs = ev.runs;
  const challenger = runs.find((r) => r.alias === "challenger") ?? runs[0];
  const perClass = [...ev.per_class].sort((a, b) => b.f1 - a.f1);

  const floor = ev.gate.min_test_accuracy;
  const eps = ev.gate.epsilon;

  const gate = panel("gate");
  const champIdx = runs.findIndex((r) => r.alias === "champion");

  return (
    <>
      {/* hero: the one number this page leads with */}
      <div className="panel reveal" style={{ gridColumn: "span 4" }}>
        <div className="p-head">
          <div>
            <div className="p-title">{panel("champion").title}</div>
            <div className="p-sub">{panel("champion").sub}</div>
          </div>
        </div>
        <div className="hero-num">
          {(champ.test_accuracy * 100).toFixed(1)}
          <span className="unit">%</span>
        </div>
        <div className="tile-row" style={{ marginTop: 18 }}>
          <div className="tile">
            <div className="t-label">macro-F1</div>
            <div className="t-value">{champ.macro_f1.toFixed(3)}</div>
          </div>
          <div className="tile">
            <div className="t-label">champion</div>
            <div className="t-value">v{champ.version}</div>
            <div className="t-sub">
              of {runs.length} registered · since {fmtDay(parseEvDate(champ.started))}
            </div>
          </div>
        </div>
      </div>

      {/* the quality gate */}
      <div className="panel reveal" data-stagger={1} style={{ gridColumn: "span 8" }}>
        <div className="p-head">
          <div>
            <div className="p-title">{gate.title}</div>
            <div className="p-sub">{gate.sub}</div>
          </div>
          <div className="p-tools">
            <StatusChip kind="ok" label="passing — champion holds" />
          </div>
        </div>
        <GateLine
          cfg={{
            floor,
            eps,
            champ: champ.test_accuracy,
            champV: champ.version,
            chall: challenger.test_accuracy,
            challV: challenger.version,
          }}
        />
        <div className="cap">
          Floor: test accuracy ≥ <strong>{floor.toFixed(2)}</strong>. Regression band ε ={" "}
          <strong>{eps.toFixed(3)}</strong> — a challenger inside the band is statistically equal,
          so the champion holds.
        </div>
        <div className="meter-row" style={{ gridTemplateColumns: "auto 1fr", marginTop: 8 }}>
          <StatusChip kind="bad" label={gate.blocked!.label} />
          <span style={{ fontSize: "13.5px" }}>
            {gate.blocked!.text}{" "}
            <a className="link" href={gate.blocked!.link.href} target="_blank" rel="noopener">
              {gate.blocked!.link.label}
            </a>
          </span>
        </div>
      </div>

      {/* per-class F1 */}
      <ChartPanel
        span={panel("per-class-f1").span}
        title={panel("per-class-f1").title!}
        sub={panel("per-class-f1").sub}
        caption={panel("per-class-f1").caption}
        table={
          <DataTable
            heads={["class", "F1", "precision", "recall", "doodles"]}
            numCols={[1, 2, 3, 4]}
            rows={perClass.map((r) => [
              r.cls,
              r.f1.toFixed(3),
              r.precision.toFixed(3),
              r.recall.toFixed(3),
              fmtComma(r.support),
            ])}
          />
        }
      >
        <DotPlot rows={perClass} domain={[0.7, 1.0]} mean={champ.macro_f1} />
      </ChartPanel>

      {/* confusion matrix (illustrative) */}
      <ChartPanel
        span={panel("confusion-matrix").span}
        title={panel("confusion-matrix").title!}
        sub={panel("confusion-matrix").sub}
        stagger={1}
        status={{ kind: "mock", label: panel("confusion-matrix").statusLabel ?? "illustrative" }}
        caption="Diagonal = correct guesses. The heavy off-diagonal cells are the honest weak spots — dogs read as cats, birds as airplanes. Derived to match the real per-class precision & recall; cell-level export is pending in evidence.json."
      >
        <Heatmap data={ILLUSTRATIVE_CONFUSION} />
      </ChartPanel>

      {/* every registered run */}
      <div className="panel reveal" style={{ gridColumn: "span 12" }}>
        <div className="p-head">
          <div>
            <div className="p-title">{panel("runs").title}</div>
            <div className="p-sub">{panel("runs").sub}</div>
          </div>
        </div>
        <DataTable
          heads={["version", "started (UTC)", "epochs", "lr", "val acc", "test acc", "macro-F1", ""]}
          numCols={[2, 3, 4, 5, 6]}
          champRow={champIdx}
          rows={runs.map((r) => [
            `v${r.version}`,
            r.started,
            String(r.epochs),
            String(r.learning_rate),
            fmt4(r.val_accuracy),
            fmt4(r.test_accuracy),
            fmt4(r.macro_f1),
            <span key="a">
              {r.alias && (
                <span className={`alias-chip${r.alias === "challenger" ? " challenger" : ""}`}>
                  {r.alias}
                </span>
              )}
              {r.test_accuracy < floor && <span className="alias-chip blocked">below floor</span>}
            </span>,
          ])}
        />
      </div>
    </>
  );
}
