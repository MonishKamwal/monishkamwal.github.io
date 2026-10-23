"use client";

import { useCallback, useMemo, useRef } from "react";
import { journey, type JourneyEntry } from "@/lib/content";
import { readNextFor } from "@/lib/story/storyNav";
import { journeyGroups, fmtDate } from "@/lib/story/journeyRoad";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useJourneyMotion } from "@/lib/hooks/useJourneyMotion";
import { CardHint } from "../CardHint";
import { ReadNext } from "../ReadNext";
import { useCardController, useHashCard, type CardData } from "../PaperCard";
import frame from "../story.module.css";
import styles from "./JourneyPage.module.css";

// An entry's paper card: the meta line, the full body_md (a section per blank-line
// paragraph, no headings — a plain devlog read), and its evidence links. The hash
// is the slug, so a card is deep-linkable at /journey#<slug>.
function entryCard(e: JourneyEntry): CardData {
  const phase = journey.phases.find((p) => p.key === e.phaseKey);
  return {
    meta: `${fmtDate(e.date)} · ${e.phaseKey} — ${phase?.title ?? ""}`,
    title: e.title,
    sections: (e.body_md || e.summary || "")
      .split(/\n\n+/)
      .map((body) => ({ body })),
    evidence: e.evidence,
    hash: e.slug,
  };
}

// The Journey inner page (Story mode): the whole devlog diagram is one viewBox
// SVG on a sticky stage, and a scroll-driven camera walks a winding road past
// every entry while a comet dot stays locked to the active one. The reading
// column scrolls over the stage — phase chapter cards and entry teasers, one
// screen each — and every entry opens its full story in a paper card.
// See DESIGN.md §6.1; the geometry + camera are ported from
// journey-page-svg-sketches.html.
export function JourneyPage() {
  const reduced = useReducedMotion();
  const { openCard } = useCardController();
  const next = readNextFor("journey");

  const groups = useMemo(
    () => journeyGroups(journey.phases, journey.entries),
    [],
  );

  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const motionRefs = useMemo(() => ({ root, svg }), []);
  useJourneyMotion(motionRefs, groups, reduced);

  const onEntry = useCallback(
    (slug: string, el: Element) => {
      const e = journey.entries.find((x) => x.slug === slug);
      if (e) openCard(entryCard(e), el);
    },
    [openCard],
  );

  // deep link: /journey#<slug> opens that entry's card (on load + hash change)
  const resolveCard = useCallback((slug: string) => {
    const e = journey.entries.find((x) => x.slug === slug);
    return e ? entryCard(e) : null;
  }, []);
  useHashCard(resolveCard);

  return (
    <>
      {/* the intro title scrolls away with the page (the road never runs under a
          pinned title) */}
      <div className={styles.masthead}>
        <h1 className={`page-title display reveal ${frame.pageTitle}`}>{journey.title}</h1>
        <p className={`reveal ${frame.pageLead}`} data-stagger="1">{journey.lede}</p>
        <CardHint text={journey.cardHint} stagger={2} />
      </div>

      <div ref={root} className={styles.stageScroll}>
        <div className={styles.stage}>
          <svg ref={svg} className={styles.jMap} preserveAspectRatio="xMidYMid meet" aria-hidden="true" />
        </div>

        {/* The reading column. Blocks interleave in exactly camera-stop order —
            per phase: a chapter card, then its entries — then a final empty block
            that pulls the camera back to reveal the fading tail. */}
        <div className={styles.flow}>
          {groups.map((g) => (
            <div key={g.phase.key} className={styles.phaseGroup}>
              <div className={`${styles.block} ${styles.chapter}`} data-stop>
                <p className={styles.chapPhase}>{`Phase ${g.phase.key.replace(/\D/g, "")}`}</p>
                <h2 className={styles.chapTitle}>{g.phase.title}</h2>
              </div>
              {g.items.map((e) => (
                <div key={e.slug} className={styles.block} data-stop>
                  <div
                    className={styles.jEntry}
                    data-slug={e.slug}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    onClick={(ev) => {
                      if ((ev.target as HTMLElement).closest("a")) return;
                      onEntry(e.slug, ev.currentTarget);
                    }}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        onEntry(e.slug, ev.currentTarget);
                      }
                    }}
                  >
                    <p className={`micro ${styles.jEyebrow}`}>
                      {`${fmtDate(e.date)} · ${e.phaseKey} — ${g.phase.title}`}
                    </p>
                    <h2 className={styles.jTitle}>{e.title}</h2>
                    <p className={styles.jSummary}>{e.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {/* the final stop carries no text — it only pulls the camera back so the
              unfinished tail fades off low in frame, close to the foot */}
          <div className={`${styles.block} ${styles.blockEnd}`} data-stop aria-hidden="true" />
        </div>
      </div>

      {next && <ReadNext next={next} />}
    </>
  );
}
