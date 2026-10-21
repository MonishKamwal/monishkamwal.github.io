"use client";

import { useEffect, useMemo, useRef } from "react";
import { journey } from "@/lib/content";
import { fmtDate } from "@/lib/format";
import { buildJourneyLayout, type JourneyNode } from "@/lib/story/journeyLayout";
import { readNextFor } from "@/lib/story/storyNav";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useJourneyMotion } from "@/lib/hooks/useJourneyMotion";
import { CardHint } from "../CardHint";
import { ReadNext } from "../ReadNext";
import { useCardController, type CardData } from "../PaperCard";
import frame from "../story.module.css";
import styles from "./JourneyPage.module.css";

// Turn a journey entry into the shared paper card's content: its prose becomes
// unlabeled paragraphs, with the real evidence links beneath.
function entryCard(node: JourneyNode): CardData {
  const entry = journey.entries.find((e) => e.slug === node.slug);
  return {
    meta: `${fmtDate(node.date)} · ${node.phaseKey}`,
    title: node.title,
    sections: (entry?.body_md ?? node.summary)
      .split("\n\n")
      .map((p) => ({ body: p.trim() }))
      .filter((s) => s.body.length > 0),
    evidence: entry?.evidence ?? [],
    hash: node.slug,
  };
}

export function JourneyPage() {
  const reduced = useReducedMotion();
  const { openCard } = useCardController();
  const layout = useMemo(
    () => buildJourneyLayout(journey.entries, journey.phases),
    [],
  );
  const next = readNextFor("journey");

  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const end = useRef<SVGPathElement>(null);
  const tail = useRef<HTMLParagraphElement>(null);
  const lensCircle = useRef<SVGCircleElement>(null);
  const lensHole = useRef<SVGCircleElement>(null);
  const motionRefs = useMemo(
    () => ({ wrap, svg, path, end, tail, lensCircle, lensHole }),
    [],
  );

  useJourneyMotion(motionRefs, layout, reduced, styles.hot);

  const open = (node: JourneyNode, opener: Element | null) =>
    openCard(entryCard(node), opener);

  // deep link: /journey#<slug> opens that entry's card on load
  useEffect(() => {
    const slug = location.hash.replace("#", "");
    if (!slug) return;
    const node = layout.nodes.find((n) => n.slug === slug);
    if (node) openCard(entryCard(node), null);
  }, [layout, openCard]);

  return (
    <>
      <div className={styles.intro}>
        <div className={`page-head reveal ${frame.pageHead} ${styles.introHead}`}>
          <h1 className={`page-title display ${frame.pageTitle}`}>{journey.title}</h1>
          <p className={frame.pageLead}>{journey.lede}</p>
        </div>
        <CardHint text={journey.cardHint} />
      </div>

      <div className={`${frame.wrap} ${styles.body}`}>
        <div ref={wrap} className={styles.pathWrap}>
          <svg
            ref={svg}
            className={styles.svg}
            viewBox={`0 0 ${layout.vbw} ${layout.vbh}`}
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="jLensClip">
                <circle ref={lensCircle} cx="0" cy="0" r="0" />
              </clipPath>
              <mask id="jLensMask" maskUnits="userSpaceOnUse">
                <rect x="-100" y="-100" width={layout.vbw + 200} height={layout.vbh + 220} fill="#fff" />
                <circle ref={lensHole} cx="0" cy="0" r="0" fill="#000" />
              </mask>
            </defs>
            <path ref={path} className={styles.path} d={layout.pathD} mask="url(#jLensMask)" />
            <path ref={end} className={styles.end} d={layout.endD} />
            <path className={styles.lens} d={layout.pathD} clipPath="url(#jLensClip)" />
            {layout.nodes.map((n, i) => (
              <circle
                key={n.slug}
                data-jdot={i}
                className={styles.dot}
                r="6"
                cx={n.x}
                cy={n.y}
                onClick={(e) => open(n, e.currentTarget)}
              />
            ))}
          </svg>

          {layout.nodes.map((n, i) => {
            const xPct = (n.x / layout.vbw) * 100;
            const yPct = n.ry * 100;
            const pos: React.CSSProperties =
              n.side === "left"
                ? { top: `calc(${yPct}% - 14px)`, right: `calc(${100 - xPct}% + 20px)` }
                : { top: `calc(${yPct}% - 14px)`, left: `calc(${xPct}% + 20px)` };
            return (
              <div
                key={n.slug}
                data-jentry={i}
                className={`${styles.entry} ${n.side === "left" ? styles.onLeft : styles.onRight}`}
                style={pos}
                onClick={(e) => open(n, e.currentTarget)}
              >
                <div className={styles.d}>
                  {fmtDate(n.date)} · {n.phaseKey}
                </div>
                <h3>
                  <a>{n.title}</a>
                </h3>
                <p>{n.summary}</p>
              </div>
            );
          })}

          {layout.heads.map((h, i) => (
            <div
              key={h.key}
              data-jhead={i}
              className={styles.phaseHead}
              style={{ top: `${h.ry * 100}%` }}
            >
              <span className={styles.chip} data-jchip>
                <span className={styles.pk}>{h.key}</span>
                <span className={styles.ph}>{h.title}</span>
              </span>
            </div>
          ))}
        </div>
        <p ref={tail} className={styles.tail}>
          {journey.tail}
        </p>
      </div>

      {next && <ReadNext next={next} />}
    </>
  );
}
