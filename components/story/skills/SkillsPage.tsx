"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { skills, type Link as ContentLink } from "@/lib/content";
import { readNextFor } from "@/lib/story/storyNav";
import { SKILLS_MAP_MARKUP } from "@/lib/story/skillsMap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useSkillsMotion } from "@/lib/hooks/useSkillsMotion";
import { CardHint } from "../CardHint";
import { ReadNext } from "../ReadNext";
import frame from "../story.module.css";
import styles from "./SkillsPage.module.css";

// An evidence link: "<claim> · <where> →", with the "· where" muted. Internal
// hrefs use next/link (so a Journey/Architecture hash opens its card); external
// ones open in a new tab.
function EvLink({ ev }: { ev: ContentLink }) {
  const [claim, where] = ev.label.split(" · ");
  const inner = (
    <>
      {claim}
      {where && <span className={styles.w}> · {where}</span>}
      {" "}→
    </>
  );
  const cls = `link ${styles.skEv}`;
  return ev.href.startsWith("/") ? (
    <Link className={cls} href={ev.href}>{inner}</Link>
  ) : (
    <a className={cls} href={ev.href} target="_blank" rel="noopener noreferrer">{inner}</a>
  );
}

export function SkillsPage() {
  const reduced = useReducedMotion();
  const next = readNextFor("skills");

  const map = useRef<SVGSVGElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const motionRefs = useMemo(() => ({ map, root }), []);
  useSkillsMotion(motionRefs, reduced);

  const byId = useMemo(() => {
    const comp = new Map(skills.competencies.map((c) => [c.id, c]));
    const cross = new Map(skills.crossings.map((c) => [c.id, c]));
    return { comp, cross };
  }, []);

  return (
    <>
      <div ref={root} className={styles.stageScroll}>
        <div className={styles.skStage}>
          <div className={styles.skPlate} />
          <svg
            ref={map}
            className={styles.skMap}
            viewBox="-182.5 -102.5 1825 1025"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: SKILLS_MAP_MARKUP }}
          />
        </div>

        <div className={styles.skFlow}>
          <div className={`${styles.skBlock} ${styles.skBlockHead}`} data-stop="head">
            <h1 className={`page-title display reveal ${frame.pageTitle}`}>{skills.title}</h1>
            <p className={`reveal ${frame.pageLead}`} data-stagger="1">{skills.lede}</p>
            <CardHint text={skills.cardHint} />
          </div>

          {skills.stops.map((stop) => {
            const comp = byId.comp.get(stop);
            if (comp) {
              return (
                <div key={stop} className={styles.skBlock} data-stop={stop}>
                  <p className={`micro ${styles.skK}`}>{comp.index}</p>
                  <h2 className={styles.skName}>{comp.name}</h2>
                  <p className={styles.skLine}>{comp.line}</p>
                  <div className={styles.skRcs}>
                    {comp.tools.map((t) => (
                      <div key={t.name} className={styles.skRc}>
                        <div className={styles.skRcT}>{t.name}</div>
                        <p className={styles.skRcD}>{t.did}</p>
                        <EvLink ev={t.evidence} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            const cross = byId.cross.get(stop);
            if (!cross) return null;
            return (
              <div key={stop} className={styles.skBlock} data-stop={stop}>
                <p className={`micro ${styles.skK} ${styles.skKShared}`}>{cross.sharedLabel}</p>
                <h2 className={styles.skTool}>{cross.name}</h2>
                <p className={styles.skLine}>{cross.line}</p>
                <EvLink ev={cross.evidence} />
              </div>
            );
          })}

          <div className={`${styles.skBlock} ${styles.skBlockEnd}`} data-stop="end">
            <p className={`micro ${styles.skK}`}>{skills.toolbox.label}</p>
            <div className={styles.skBox}>
              {skills.toolbox.items.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {next && <ReadNext next={next} />}
    </>
  );
}
