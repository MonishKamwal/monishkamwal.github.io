"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

// The one shared chart tooltip (DESIGN.md §7.1): value leads, label follows,
// keys are line strokes not boxes. Fixed, pointer-following, never a series
// colour on the frame. A single node is reused across every chart on the page
// and driven imperatively (as in the prototype) so pointermove never re-renders.
//
// Interaction model, ported from the prototype's one-hover rule:
//  - mouse / trackpad: visible while the pointer is over a mark;
//  - touch: a tap shows it; it stays until the next tap anywhere, or a scroll;
//  - keyboard: the table twin (the `data` chip) is the keyboard path —
//    "tooltips enhance, tables guarantee".

export type TipRow = [color: string | null, value: string, label?: string];

export type TipApi = {
  show: (clientX: number, clientY: number, head: string, rows: TipRow[]) => void;
  move: (clientX: number, clientY: number) => void;
  hide: () => void;
  /** Register the hide fn for the current touch so a later tap/scroll clears it. */
  armTouch: (hide: () => void) => void;
};

const VizTipContext = createContext<TipApi | null>(null);

export function useVizTip(): TipApi {
  const api = useContext(VizTipContext);
  if (!api) throw new Error("useVizTip must be used inside <VizTipProvider>");
  return api;
}

export function VizTipProvider({ children }: { children: React.ReactNode }) {
  const tipRef = useRef<HTMLDivElement>(null);
  const tapHideRef = useRef<(() => void) | null>(null);

  const el = (tag: string, cls: string, parent: Node, text?: string) => {
    const e = document.createElement(tag);
    e.className = cls;
    if (text != null) e.textContent = text;
    parent.appendChild(e);
    return e;
  };

  const move = useCallback((clientX: number, clientY: number) => {
    const tip = tipRef.current;
    if (!tip) return;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    let x = clientX + 14;
    let y = clientY + 12;
    if (x + w > window.innerWidth - 8) x = clientX - w - 14;
    if (y + h > window.innerHeight - 8) y = clientY - h - 12;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  }, []);

  const show = useCallback(
    (clientX: number, clientY: number, head: string, rows: TipRow[]) => {
      const tip = tipRef.current;
      if (!tip) return;
      tip.textContent = "";
      if (head) el("div", "tt-h", tip, head);
      rows.forEach(([color, value, label]) => {
        const r = el("div", "tt-r", tip);
        const k = el("span", "tt-k", r);
        k.style.background = color || "transparent";
        el("span", "tt-v", r, value);
        if (label) el("span", "tt-l", r, label);
      });
      tip.style.opacity = "1";
      tip.setAttribute("aria-hidden", "false");
      move(clientX, clientY);
    },
    [move],
  );

  const hide = useCallback(() => {
    const tip = tipRef.current;
    if (!tip) return;
    tip.style.opacity = "0";
    tip.setAttribute("aria-hidden", "true");
  }, []);

  const armTouch = useCallback((h: () => void) => {
    tapHideRef.current = h;
  }, []);

  // Clear a stuck touch tooltip on the next touch-down or any scroll.
  useEffect(() => {
    const clear = () => {
      if (tapHideRef.current) {
        tapHideRef.current();
        tapHideRef.current = null;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") clear();
    };
    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("scroll", clear, { passive: true });
    // lets iOS apply :active (the one-hover's touch state)
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("scroll", clear);
      document.removeEventListener("touchstart", noop);
    };
  }, []);

  const api = useMemo<TipApi>(
    () => ({ show, move, hide, armTouch }),
    [show, move, hide, armTouch],
  );

  return (
    <VizTipContext.Provider value={api}>
      {children}
      <div ref={tipRef} className="viz-tip" role="status" aria-hidden="true" />
    </VizTipContext.Provider>
  );
}
