import type { JourneyEntry, JourneyPhase } from "@/lib/content";

// Serpentine layout for the Journey page, generalized from the prototype's
// fixed 7-entry anchor list (sections-prototype.html) so it adapts to the real
// data: entries grouped into phase bands, laid out down alternating crests with
// a phase heading in each gap. Geometry only — the length-fractions that drive
// the hover lens are measured from the rendered path in useJourneyMotion.

const VBW = 700;
const LX = 245;
const RX = 455; // gentle crests, room for the outer text
const PHASE0_Y = 70; // first heading sits center-top; the line starts under it
// Gaps are sized for the real entries, whose blocks run 1–3 lines of title plus
// a 2–3 line summary (~150px tall). A centered phase heading spans the full
// width, so the gap from the last entry of a band to the next heading is the
// largest — it must clear the tallest entry's text.
const HEAD_TO_ENTRY = 150;
const ENTRY_TO_ENTRY = 185;
const ENTRY_TO_HEAD = 195;
const TAIL = 150; // room below the last dot for the unfinished tail

export type JourneyNode = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  phaseKey: string;
  x: number;
  y: number;
  side: "left" | "right";
  ry: number; // y as a fraction of the viewBox height (drives the reveal)
};

export type JourneyHeadNode = {
  key: string;
  title: string;
  y: number;
  ry: number;
};

export type JourneyLayout = {
  vbw: number;
  vbh: number;
  pathD: string;
  endD: string;
  nodes: JourneyNode[];
  heads: JourneyHeadNode[];
};

/** Group entries into their phase bands (in the phases' declared order), each
 *  band sorted oldest-first, dropping phases that have no entries. */
function groupByPhase(entries: JourneyEntry[], phases: JourneyPhase[]) {
  return phases
    .map((ph) => ({
      ph,
      items: entries
        .filter((e) => e.phaseKey === ph.key)
        .sort((a, b) => a.date.localeCompare(b.date)),
    }))
    .filter((g) => g.items.length > 0);
}

export function buildJourneyLayout(
  entries: JourneyEntry[],
  phases: JourneyPhase[],
): JourneyLayout {
  const groups = groupByPhase(entries, phases);

  const nodes: JourneyNode[] = [];
  const heads: JourneyHeadNode[] = [];
  let lastEntryY = 0;
  let sideIdx = 0;
  let first = true;

  for (const g of groups) {
    const headY = first ? PHASE0_Y : lastEntryY + ENTRY_TO_HEAD;
    heads.push({ key: g.ph.key, title: g.ph.title, y: headY, ry: 0 });
    g.items.forEach((e, ei) => {
      const y = ei === 0 ? headY + HEAD_TO_ENTRY : lastEntryY + ENTRY_TO_ENTRY;
      const side = sideIdx % 2 === 0 ? "left" : "right";
      nodes.push({
        slug: e.slug,
        title: e.title,
        summary: e.summary,
        date: e.date,
        phaseKey: e.phaseKey,
        x: side === "left" ? LX : RX,
        y,
        side,
        ry: 0,
      });
      lastEntryY = y;
      sideIdx++;
    });
    first = false;
  }

  const vbh = lastEntryY + TAIL;
  for (const n of nodes) n.ry = n.y / vbh;
  for (const h of heads) h.ry = h.y / vbh;

  // the line starts under the first heading (center-top), then winds through the
  // entry anchors with vertical control handles (a smooth S between crests)
  const pathNodes = [{ x: VBW / 2, y: heads[0]?.y ?? PHASE0_Y }, ...nodes];
  let pathD = `M ${pathNodes[0].x} ${pathNodes[0].y}`;
  for (let i = 1; i < pathNodes.length; i++) {
    const a = pathNodes[i - 1];
    const b = pathNodes[i];
    const m = (b.y - a.y) * 0.5;
    pathD += ` C ${a.x} ${a.y + m}, ${b.x} ${b.y - m}, ${b.x} ${b.y}`;
  }

  // the unfinished tail continues past the last dot and fades out
  const last = nodes[nodes.length - 1];
  const endD = last
    ? `M ${last.x} ${last.y} C ${last.x} ${last.y + 70}, 320 ${last.y + 110}, 340 ${last.y + 160}`
    : "";

  return { vbw: VBW, vbh, pathD, endD, nodes, heads };
}
