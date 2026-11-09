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

// Known abbreviations whose trailing period is not a sentence end, so a bullet
// split must not break e.g. "St. John's" or "Prof. Ada Lovelace".
const BULLET_ABBR = new Set([
  "St", "Prof", "Dr", "Mr", "Mrs", "Ms", "Sr", "Jr", "vs", "etc", "Inc", "Ltd",
  "Co", "No", "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Sept",
  "Oct", "Nov", "Dec",
]);

// Present a section's descriptive paragraph as a bulleted list: one bullet per
// sentence. Split on a sentence boundary — end punctuation, whitespace, then a
// capital/quote/code start — via a sentinel, skipping known abbreviations, so
// "St. John's", decimals (0.85), inline code, and middot "A · B · C" stack lines
// all stay whole. No regex lookbehind (which throws on older engines). Copy kept.
function toBullets(body: string): string[] {
  const text = body.trim();
  if (!text) return [];
  const SEP = String.fromCharCode(0);
  const parts = text
    .replace(/(\w*)([.!?])(\s+)(?=[A-Z"'(`])/g, (_m, word, punc, ws) =>
      BULLET_ABBR.has(word) ? word + punc + ws : word + punc + SEP,
    )
    .split(SEP)
    .map((x) => x.trim())
    .filter(Boolean);
  return parts.length ? parts : [text];
}

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

/** Open a card from the URL hash — on first load AND on later same-page hash
 *  changes. `resolve` maps a hash id to its card (or null). Pass a stable
 *  (useCallback) resolver. Re-opening the already-open card is a harmless no-op,
 *  so no de-dup is needed. */
export function useHashCard(resolve: (id: string) => CardData | null): void {
  const { openCard } = useCardController();
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(location.hash.replace("#", ""));
      if (!id) return;
      const data = resolve(id);
      if (data) openCard(data, null);
    };
    open(); // first load / deep link
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [resolve, openCard]);
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
                  <ul className={styles.bullets}>
                    {toBullets(s.body).map((b, j) => (
                      <li key={j}>{renderInline(b)}</li>
                    ))}
                  </ul>
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
