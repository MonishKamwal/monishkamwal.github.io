"use client";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { about, type AboutEntry, type AboutSection } from "@/lib/content";
import { ABOUT_WASH_MARKUP, ABOUT_TRACE_D, ABOUT_TRACE_NODES, ABOUT_TRACE_STOPS } from "@/lib/story/aboutWash";
import { ABOUT_SKILLS_WASH_MARKUP } from "@/lib/story/aboutSkillsWash";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useAboutMotion } from "@/lib/hooks/useAboutMotion";
import { useBreathingWash } from "@/lib/hooks/useBreathingWash";
import { CardHint } from "../CardHint";
import { ReadNext } from "../ReadNext";
import { useCardController, useHashCard, type CardData } from "../PaperCard";
import styles from "./AboutPage.module.css";

function entryCard(e: AboutEntry): CardData {
  return {
    meta: e.card.meta,
    title: e.card.title,
    sections: e.card.items.map((i) => ({ heading: i.heading, body: i.body })),
    evidence: e.card.evidence,
    hash: e.id,
  };
}

// The injected skills wash, isolated so React never re-commits it. The blobs are
// wired imperatively (reveal class, button roles, morphed paths, click handlers);
// a card open/close re-renders AboutPage, and re-committing dangerouslySetInnerHTML
// would wipe all of that — memo with no props keeps the subtree mounted untouched.
const SkillsWash = memo(function SkillsWash() {
  return (
    <div
      className={styles.abSkillsWash}
      dangerouslySetInnerHTML={{ __html: ABOUT_SKILLS_WASH_MARKUP }}
    />
  );
});

export function AboutPage() {
  const reduced = useReducedMotion();
  const { openCard } = useCardController();
  const { hero } = about;

  const wash = useRef<SVGSVGElement>(null);
  const trace = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const lensCircle = useRef<SVGCircleElement>(null);
  const lensHole = useRef<SVGCircleElement>(null);
  const motionRefs = useMemo(() => ({ wash, trace, path, lensCircle, lensHole }), []);
  useAboutMotion(motionRefs, reduced, styles.hot);

  // the "What I work with" living wash (Home §5's breathing blobs, reused)
  const skillsRoot = useRef<HTMLElement>(null);
  useBreathingWash(skillsRoot, reduced, styles.washIn);

  // Clicking a cluster blob enlarges it in place so its fine print is readable
  // (one open at a time; click again, click away, or Escape to collapse). The
  // wash SVG is injected (dangerouslySetInnerHTML), so the groups are wired
  // imperatively — the expanded shape just gets `data-sk-open` (CSS scales it and
  // quiets the rest). We deliberately DON'T reorder the DOM to bring it forward:
  // re-inserting the node restarts its CSS reveal animation (it would blink out
  // and back) and shifts every sibling's :nth-child, re-triggering their reveals
  // too. The others dim to ~0.22, so the enlarged shape reads clearly on top.
  const clustersById = useMemo(
    () => new Map(about.skills.clusters.map((c) => [c.id, c])),
    [],
  );
  useEffect(() => {
    const el = skillsRoot.current;
    if (!el) return;
    const cleanups: Array<() => void> = [];

    let openEl: SVGGElement | null = null;

    const collapse = () => {
      if (!openEl) return;
      const g = openEl;
      g.removeAttribute("data-sk-open"); // shrinks 1.6 → 1 via the CSS transition
      g.ownerSVGElement?.removeAttribute("data-sk-has-open"); // the rest un-dim together
      g.setAttribute("aria-expanded", "false");
      openEl = null;
    };
    const expand = (g: SVGGElement) => {
      if (openEl === g) {
        collapse();
        return;
      }
      collapse();
      g.setAttribute("data-sk-open", ""); // scales 1 → 1.6 via the CSS transition
      g.ownerSVGElement?.setAttribute("data-sk-has-open", "");
      g.setAttribute("aria-expanded", "true");
      openEl = g;
    };

    el.querySelectorAll<SVGGElement>(".b-g[data-skill]").forEach((g) => {
      const c = clustersById.get(g.dataset.skill ?? "");
      if (!c) return;
      g.setAttribute("role", "button");
      g.setAttribute("tabindex", "0");
      g.setAttribute("aria-expanded", "false");
      g.setAttribute("aria-label", `${c.name} — enlarge`);
      const onClick = (ev: MouseEvent) => {
        ev.stopPropagation(); // don't let the document handler collapse it
        expand(g);
      };
      const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          expand(g);
        } else if (ev.key === "Escape") {
          collapse();
        }
      };
      g.addEventListener("click", onClick);
      g.addEventListener("keydown", onKeyDown);
      cleanups.push(() => {
        g.removeEventListener("click", onClick);
        g.removeEventListener("keydown", onKeyDown);
      });
    });

    const onDocPointer = () => collapse();
    const onDocKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") collapse();
    };
    document.addEventListener("click", onDocPointer);
    document.addEventListener("keydown", onDocKey);
    cleanups.push(() => {
      document.removeEventListener("click", onDocPointer);
      document.removeEventListener("keydown", onDocKey);
    });

    return () => cleanups.forEach((fn) => fn());
  }, [clustersById]);

  const entries = useMemo(
    () => [...about.education.entries, ...about.work.entries, ...about.projects.entries],
    [],
  );
  const open = (e: AboutEntry, opener: Element | null) => openCard(entryCard(e), opener);
  const onKey = (e: AboutEntry) => (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      open(e, ev.currentTarget);
    }
  };
  const resolveCard = useCallback(
    (id: string) => {
      const e = entries.find((x) => x.id === id);
      return e ? entryCard(e) : null;
    },
    [entries],
  );
  useHashCard(resolveCard);

  // Education / Projects: a big-anchor row list that opens a card on click
  const cv2Section = (section: AboutSection) => (
    <div className={styles.cv2}>
      <section className={styles.cv2Sec}>
        <h2 className={`reveal ${styles.cv2H}`}>{section.title}</h2>
        <CardHint text={section.cardHint} />
        {section.entries.map((e) => (
          <article
            key={e.id}
            className={`reveal ${styles.cv2Item}`}
            role="button"
            tabIndex={0}
            data-ab-card={e.id}
            aria-label={`Open: ${e.role}`}
            onClick={(ev) => open(e, ev.currentTarget)}
            onKeyDown={onKey(e)}
          >
            <div className={styles.cv2Year}>{e.anchor}</div>
            <div className={styles.cv2Body}>
              <div className={styles.cv2Range}>{e.range}</div>
              <h3 className={styles.cv2Role}>{e.role}</h3>
              <p className={styles.cv2What}>{e.what}</p>
              <span className={styles.cv2More}>Read more →</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );

  return (
    <>
      <div className={styles.abPage}>
        <svg
          ref={wash}
          className={styles.abWash}
          viewBox="0 0 560 1340"
          preserveAspectRatio="xMidYMin meet"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: ABOUT_WASH_MARKUP }}
        />

        <section className={styles.abHero}>
          <div className={styles.heroIn}>
            <p className={`micro reveal ${styles.abEyebrow}`}>{hero.eyebrow}</p>
            <h1 className={`reveal ${styles.abName}`} data-dir="left">
              {hero.nameFirst}
              <em>{hero.nameLast}</em>
            </h1>
            <div className={styles.heroPhoto}>
              <div className={`reveal ${styles.portrait}`} data-dir="right">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.portrait.src} alt={hero.portrait.alt} />
              </div>
              <p className={`reveal ${styles.photoResume}`}>
                <Link href={hero.resume.href}>{hero.resume.label}</Link>
              </p>
            </div>
            <div className={`reveal ${styles.abLead}`} data-stagger="1">
              {hero.lead.map((p, i) => (
                <p key={i} className={i === 0 ? styles.abDrop : undefined}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {cv2Section(about.education)}

        <div className={styles.workGroup}>
          <div className={`reveal ${styles.workH}`}>
            <h2 className={styles.cv2H}>{about.work.title}</h2>
          </div>
          <CardHint text={about.work.cardHint} />
          <div ref={trace} className={`reveal ${styles.trace}`}>
            <svg viewBox="0 0 700 660" preserveAspectRatio="xMidYMid meet">
              <defs>
                <clipPath id="abLensClip">
                  <circle ref={lensCircle} cx="0" cy="0" r="0" />
                </clipPath>
                <mask id="abLensMask" maskUnits="userSpaceOnUse">
                  <rect x="-100" y="-100" width="900" height="860" fill="#fff" />
                  <circle ref={lensHole} cx="0" cy="0" r="0" fill="#000" />
                </mask>
              </defs>
              <path ref={path} className={styles.trPath} d={ABOUT_TRACE_D} mask="url(#abLensMask)" />
              <path className={styles.trLens} d={ABOUT_TRACE_D} clipPath="url(#abLensClip)" />
              {/* milestone rings bloom as the comet passes each Work node */}
              {ABOUT_TRACE_NODES.map((n, i) => (
                <circle key={`ring${i}`} data-tr-ring className={styles.trRing} cx={n[0]} cy={n[1]} r="8" opacity="0" />
              ))}
              {ABOUT_TRACE_NODES.map((n, i) => (
                <circle key={i} data-tr-node className={styles.trNode} cx={n[0]} cy={n[1]} r="8" />
              ))}
              {/* the travelling comet — the Journey "traveling light", laps the serpentine */}
              <path data-tr-comet className={styles.trComet} d={ABOUT_TRACE_D} />
              <circle data-tr-halo className={styles.trHalo} r="9" opacity="0" />
              <circle data-tr-head className={styles.trHead} r="3.6" opacity="0" />
            </svg>
            {about.work.entries.map((e, i) => (
              <div
                key={e.id}
                data-tr-stop
                className={`${styles.trStop} ${e.side === "left" ? styles.left : styles.right}`}
                style={ABOUT_TRACE_STOPS[i]}
                role="button"
                tabIndex={0}
                data-ab-card={e.id}
                aria-label={`Open role: ${e.role}`}
                onClick={(ev) => open(e, ev.currentTarget)}
                onKeyDown={onKey(e)}
              >
                <span className={styles.trRange}>{e.range}</span>
                <span className={styles.trRole}>{e.role}</span>
                <span className={styles.trWhat}>{e.what}</span>
                <span className={styles.trMore}>Read more →</span>
              </div>
            ))}
          </div>
        </div>

        <section ref={skillsRoot} className={styles.abSkills}>
          <div className={styles.abSkillsHead}>
            <h2 className={`reveal ${styles.cv2H}`}>{about.skills.title}</h2>
            <p className={`reveal ${styles.abSkillsLede}`} data-stagger="1">{about.skills.lede}</p>
            <CardHint text={about.skills.hint} />
          </div>
          <SkillsWash />
        </section>

        {cv2Section(about.projects)}
      </div>

      <ReadNext next={{ name: "Contact", href: "/#contact", peek: "Where to find me" }} />
    </>
  );
}
