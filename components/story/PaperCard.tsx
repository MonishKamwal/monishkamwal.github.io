"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Link as ContentLink } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { renderInline } from "@/lib/story/inline";
import styles from "./PaperCard.module.css";

/** One labeled (or unlabeled) block of a card's body. */
export type CardSection = { heading?: string; body: string };

/** The content a paper card renders — shared by Journey entries, Architecture
 *  stops, and About entries. `hash` is written to the URL while the card is open
 *  so a card is deep-linkable (and survives a reload / share). */
export type CardData = {
  meta: string;
  title: string;
  sections: CardSection[];
  evidence: ContentLink[];
  hash?: string;
};

type Controller = {
  openCard: (data: CardData, opener?: Element | null) => void;
  closeCard: () => void;
};

const PaperCardContext = createContext<Controller | null>(null);

/** Access the shared card controller from any Story page. */
export function useCardController(): Controller {
  const ctx = useContext(PaperCardContext);
  if (!ctx) throw new Error("useCardController must be used within <PaperCardProvider>");
  return ctx;
}

export function PaperCardProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [data, setData] = useState<CardData | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<Element | null>(null);

  const openCard = useCallback(
    (next: CardData, opener?: Element | null) => {
      if (opener && !reduced && cardRef.current) {
        const r = opener.getBoundingClientRect();
        cardRef.current.style.setProperty("--ox", `${r.left + r.width / 2}px`);
        cardRef.current.style.setProperty("--oy", `${r.top + r.height / 2}px`);
      }
      prevFocus.current = document.activeElement;
      setData(next);
    },
    [reduced],
  );

  const closeCard = useCallback(() => {
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    setData(null);
    if (prevFocus.current instanceof HTMLElement) prevFocus.current.focus();
  }, []);

  // Keep the URL hash in step with the open card (so it's deep-linkable), as an
  // effect — never inside render / a setState updater, which would update the
  // router mid-render.
  useEffect(() => {
    if (data?.hash && location.hash !== `#${data.hash}`) {
      history.replaceState(null, "", `#${data.hash}`);
    }
  }, [data]);

  // Move focus into the card when it opens; close on Escape.
  useEffect(() => {
    if (!data) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCard();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [data, closeCard]);

  return (
    <PaperCardContext.Provider value={{ openCard, closeCard }}>
      {children}
      <div
        className={`${styles.scrim} ${data ? styles.open : ""}`}
        onClick={closeCard}
        aria-hidden="true"
      />
      <div
        ref={cardRef}
        className={`${styles.card} ${data ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cardTitle"
        aria-hidden={!data}
        tabIndex={-1}
      >
        <button
          ref={closeRef}
          className={styles.close}
          onClick={closeCard}
          aria-label="Close"
          tabIndex={data ? 0 : -1}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M2 2l16 16M18 2L2 18" strokeLinecap="round" />
          </svg>
        </button>
        {data && (
          <>
            <div className={styles.meta}>{data.meta}</div>
            <div className={styles.title} id="cardTitle">
              {data.title}
            </div>
            <div className={styles.body}>
              {data.sections.map((s, i) => (
                <div key={i}>
                  {s.heading && <h4>{s.heading}</h4>}
                  <p>{renderInline(s.body)}</p>
                </div>
              ))}
            </div>
            {data.evidence.length > 0 && (
              <div className={styles.ev}>
                {data.evidence.map((e) => (
                  <a
                    key={e.href + e.label}
                    className="link"
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={data ? 0 : -1}
                  >
                    {e.label} ↗
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PaperCardContext.Provider>
  );
}
