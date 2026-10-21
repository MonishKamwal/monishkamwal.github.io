"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { architecture, type ArchPart } from "@/lib/content";
import { readNextFor } from "@/lib/story/storyNav";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useArchMotion } from "@/lib/hooks/useArchMotion";
import { renderInline } from "@/lib/story/inline";
import { CardHint } from "../CardHint";
import { ReadNext } from "../ReadNext";
import { useCardController, type CardData } from "../PaperCard";
import frame from "../story.module.css";
import styles from "./ArchitecturePage.module.css";

function partCard(part: ArchPart): CardData {
  return {
    meta: part.meta,
    title: part.title,
    sections: part.items.map((i) => ({ heading: i.heading, body: i.body })),
    evidence: part.evidence,
    hash: part.id,
  };
}

export function ArchitecturePage() {
  const reduced = useReducedMotion();
  const { openCard } = useCardController();
  const next = readNextFor("architecture");

  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const motionRefs = useMemo(() => ({ root, svg }), []);

  const onPart = useCallback(
    (cardId: string, el: Element) => {
      const part = architecture.parts.find((p) => p.id === cardId);
      if (part) openCard(partCard(part), el);
    },
    [openCard],
  );

  useArchMotion(motionRefs, reduced, onPart, styles.ioOn);

  // deep link: /architecture#<part-id> opens that card on load
  useEffect(() => {
    const id = location.hash.replace("#", "");
    const part = id && architecture.parts.find((p) => p.id === id);
    if (part) openCard(partCard(part), null);
  }, [openCard]);

  return (
    <>
      <div ref={root} className={styles.stageScroll}>
        <div className={styles.axStage}>
          <div className={styles.axPlate} />
          <svg ref={svg} className={styles.axSvg} aria-hidden="true" />
        </div>
        <div className={styles.axFlow}>
          <div className={`${styles.axBlock} ${styles.axBlockHead}`} data-k="head">
            <h1 className={`page-title display reveal ${frame.pageTitle}`}>{architecture.title}</h1>
            <p className={`reveal ${frame.pageLead}`} data-stagger="1">{architecture.lead}</p>
            <CardHint text={architecture.cardHint} stagger={2} />
          </div>

          {architecture.blocks.map((b) => (
            <div
              key={b.id}
              className={`${styles.axBlock} ${b.kind === "end" ? styles.axBlockEnd : ""}`}
              data-k={b.id}
            >
              <p className={`micro ${styles.axK} ${b.kickerTone === "ochre" ? styles.axKOchre : ""}`}>
                {b.kicker}
              </p>
              {b.heading && <h2 className={styles.axH}>{b.heading}</h2>}
              {b.body.map((p, i) => (
                <p key={i} className={styles.axP}>{renderInline(p)}</p>
              ))}
              {b.io && (
                <ul className={styles.io}>
                  {b.io.map((row, i) => (
                    <li key={i} className={styles.ioRow} data-w={row.wire.replace("w", "")}>
                      <span className={styles.ioK}>{row.dir}</span>
                      {row.text} <span className={styles.ioTo}>{row.target}</span>
                    </li>
                  ))}
                </ul>
              )}
              {b.links && (
                <div className={styles.axLinks}>
                  {b.links.map((l) => (
                    <a key={l.href} className="link" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {next && <ReadNext next={next} />}
    </>
  );
}
