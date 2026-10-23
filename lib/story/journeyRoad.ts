// The Journey "road" — the winding serpentine the scroll camera walks, in plan
// units (viewBox 0 0 1000 <vbh>). Pure builders: group the devlog entries by
// phase, then lay a smooth bezier serpentine through every entry node with a
// phase gate at each chapter break and an unfinished tail off the last node.
// Ported verbatim from journey-page-svg-sketches.html (buildRoad); the scroll
// camera + comet that animate it live in useJourneyMotion. See DESIGN.md §6.1.

import type { JourneyEntry, JourneyPhase } from "@/lib/content";

/** A devlog phase with the entries that fall under it, oldest-first. */
export type JourneyGroup = { phase: JourneyPhase; items: JourneyEntry[] };

/** An entry's node on the road. `x/y` start in plan units and are snapped onto
 *  the exact path point at `frac` in useJourneyMotion, so the pin ring, comet
 *  dot and halo end up concentric. */
export type RoadNode = {
  x: number;
  y: number;
  side: "L" | "R";
  slug: string;
  idx: number;
  frac?: number;
};

/** A phase gate (chapter break) on the road. */
export type RoadGate = {
  gi: number;
  key: string;
  title: string;
  y: number;
  x?: number;
  frac?: number;
};

export type RoadGeo = {
  vbw: number;
  vbh: number;
  d: string; // the serpentine path
  tailD: string; // the unfinished tail off the last node
  nodes: RoadNode[];
  gates: RoadGate[];
};

// Group entries by phase in the phases' declared order, entries within each
// sorted oldest-first (so scrolling down walks forward through the build), and
// drop phases with no entries.
export function journeyGroups(
  phases: JourneyPhase[],
  entries: JourneyEntry[],
): JourneyGroup[] {
  return phases
    .map((phase) => ({
      phase,
      items: entries
        .filter((e) => e.phaseKey === phase.key)
        .sort((a, b) => a.date.localeCompare(b.date)),
    }))
    .filter((g) => g.items.length > 0);
}

// Lay the road through the grouped entries. Nodes alternate L=322 / R=678; the
// chain starts centre-top (500, firstGateY). Vertical rhythm: TOP=150, gate→
// first-entry 178, entry→entry 212, entry→next-gate 252, TAIL=250. The last
// segment runs past the final node and fades off as a dashed tail.
export function buildRoad(groups: JourneyGroup[]): RoadGeo {
  const vbw = 1000,
    LX = 322,
    RX = 678;
  const GATE_TO_ENTRY = 178,
    ENTRY_TO_ENTRY = 212,
    ENTRY_TO_GATE = 252,
    TOP = 150,
    TAIL = 250;
  const nodes: RoadNode[] = [],
    gates: RoadGate[] = [];
  let y = TOP,
    side = 0,
    first = true,
    idx = 0;
  groups.forEach((g, gi) => {
    const gy = first ? TOP : y + ENTRY_TO_GATE;
    gates.push({ gi, key: g.phase.key, title: g.phase.title, y: gy });
    g.items.forEach((e, ei) => {
      const ny = ei === 0 ? gy + GATE_TO_ENTRY : y + ENTRY_TO_ENTRY;
      nodes.push({ x: side % 2 === 0 ? LX : RX, y: ny, side: side % 2 === 0 ? "L" : "R", slug: e.slug, idx });
      y = ny;
      side++;
      idx++;
    });
    first = false;
  });
  const vbh = y + TAIL;
  // smooth serpentine through [centre-top start, ...nodes] — vertical handles
  const chain = [{ x: vbw / 2, y: gates[0].y }, ...nodes];
  let d = `M ${chain[0].x} ${chain[0].y}`;
  for (let i = 1; i < chain.length; i++) {
    const a = chain[i - 1],
      b = chain[i],
      m = (b.y - a.y) * 0.5;
    d += ` C ${a.x} ${(a.y + m).toFixed(1)}, ${b.x} ${(b.y - m).toFixed(1)}, ${b.x} ${b.y}`;
  }
  const last = nodes[nodes.length - 1];
  const tailD = `M ${last.x} ${last.y} C ${last.x} ${last.y + 90}, 470 ${last.y + 150}, 500 ${last.y + 220}`;
  return { vbw, vbh, d, tailD, nodes, gates };
}

// "Jul 24, 2026" — the entry eyebrow + card meta date format (local-safe parse).
export function fmtDate(d: string): string {
  const [y, m, dd] = d.split("-").map(Number);
  return new Date(y, m - 1, dd).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
