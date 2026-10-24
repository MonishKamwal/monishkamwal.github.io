"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { Loadable } from "@/lib/hooks/useContracts";

/* ---------- status chips (reserved meaning, icon + label, never colour alone) ---------- */

export type ChipKind = "ok" | "bad" | "watch" | "mock";

const CHIP_ICON: Record<Exclude<ChipKind, "mock">, ReactNode> = {
  ok: (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 6.5l2.6 2.6L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bad: (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
    </svg>
  ),
  watch: (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 1.5L11 10.5H1z" strokeLinejoin="round" />
      <path d="M6 5v2.4" strokeLinecap="round" />
    </svg>
  ),
};

export function StatusChip({
  kind,
  label,
  style,
}: {
  kind: ChipKind;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`st ${kind}`} style={style}>
      {kind !== "mock" && CHIP_ICON[kind]}
      {label}
    </span>
  );
}

/* ---------- provenance row ---------- */

export function Prov({
  live,
  mock,
  contract,
  generated,
  cadence,
}: {
  live: string;
  mock?: boolean;
  contract: string;
  generated: string;
  cadence: string;
}) {
  return (
    <div className="prov">
      {mock ? (
        <span className="st mock" style={{ textTransform: "uppercase" }}>
          {live}
        </span>
      ) : (
        <span className="dot-live">{live}</span>
      )}
      <span className="sep">·</span>
      <span>{contract}</span>
      <span className="sep">·</span>
      <span>{generated}</span>
      <span className="sep">·</span>
      <span>{cadence}</span>
    </div>
  );
}

/* ---------- page head ---------- */

export function PageHead({
  title,
  lead,
  prov,
}: {
  title: string;
  lead: string;
  prov: ReactNode;
}) {
  return (
    <div className="page-head reveal">
      <h1 className="page-title display">{title}</h1>
      <p className="page-lead">{lead}</p>
      {prov}
    </div>
  );
}

/* ---------- page foot + forward handoff ---------- */

export function PageFoot({
  note,
  links,
}: {
  note: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="page-foot reveal">
      <p>{note}</p>
      <div className="links">
        {links.map((l) => (
          <a key={l.href + l.label} className="link" href={l.href} target="_blank" rel="noopener">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function ReadNextData({
  next,
}: {
  next: { name: string; peek: string; href: string };
}) {
  return (
    <nav className="read-next reveal" data-reveal="foot" aria-label="Continue reading">
      <Link className="rn-link" href={next.href}>
        <span className="rn-cue">Next</span>
        <span className="rn-row">
          <span className="rn-name">{next.name}</span>
          <svg className="rn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M5 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="rn-peek">{next.peek}</span>
      </Link>
    </nav>
  );
}

/* ---------- chart legend ---------- */

export type LegendItem = ["line" | "dot" | "rect", string, string];

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="lg">
      {items.map(([type, color, label], i) => (
        <span className="k" key={i}>
          <span className={`sw-${type}`} style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

/* ---------- loading / error state (one honest state, not a half-board) ---------- */

export function ContractState<T extends Record<string, unknown>>({
  state,
  children,
}: {
  state: Loadable<T>;
  children: (data: T) => ReactNode;
}) {
  if (state.status === "ready") return <>{children(state.data)}</>;
  return (
    <div className="panel well reveal" style={{ gridColumn: "span 12" }}>
      <p style={{ margin: 0, fontSize: 15, maxWidth: "70ch", color: "var(--muted-foreground)" }}>
        {state.status === "loading"
          ? "Reading the live contracts from the evidence hub…"
          : "Couldn't reach the evidence hub right now. These panels render straight from its published JSON — try again in a moment."}
      </p>
    </div>
  );
}

/* ---------- chart panel: the common chart-with-table-twin case ---------- */

export function ChartPanel({
  span,
  title,
  sub,
  status,
  stagger,
  legend,
  caption,
  table,
  children,
}: {
  span: number;
  title: string;
  sub?: ReactNode;
  status?: { kind: ChipKind; label: string };
  stagger?: number;
  legend?: ReactNode;
  caption?: ReactNode;
  table?: ReactNode;
  children: ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <div
      className={`panel reveal ${showTable ? "show-table" : ""}`}
      data-stagger={stagger}
      style={{ gridColumn: `span ${span}` }}
    >
      <div className="p-head">
        <div>
          <div className="p-title">{title}</div>
          {sub && <div className="p-sub">{sub}</div>}
        </div>
        {(status || table) && (
          <div className="p-tools">
            {status && <StatusChip kind={status.kind} label={status.label} />}
            {table && (
              <button
                className="chip-btn"
                aria-pressed={showTable}
                onClick={() => setShowTable((s) => !s)}
              >
                data
              </button>
            )}
          </div>
        )}
      </div>
      {children}
      {legend}
      {table && <div className="tview">{table}</div>}
      {caption && <div className="cap">{caption}</div>}
    </div>
  );
}
