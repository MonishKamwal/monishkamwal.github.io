"use client";

import { RefObject, useEffect } from "react";
import { clamp, easeOut, revealProgress, setReveal } from "@/lib/story/motion";

// Drives the scrubbed reveal of every `.reveal` element inside `rootRef` from
// one rAF loop (the shared Story-mode pattern). Path-owned elements (`.j-entry`,
// `.cv-stop`) opt out — their own page hook reveals them against their geometry.
// Under reduced motion everything is pinned visible and the loop never starts.
export function useScrubbedReveals(
  rootRef: RefObject<HTMLElement | null>,
  reduced: boolean,
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const els = [...root.querySelectorAll<HTMLElement>(".reveal")].filter(
      (el) => !el.classList.contains("j-entry") && !el.classList.contains("cv-stop"),
    );

    if (reduced) {
      for (const el of els) setReveal(el, 1, el.dataset.dir, true);
      return;
    }

    let raf = 0;
    const frame = () => {
      for (const el of els) {
        setReveal(el, easeOut(clamp(revealProgress(el), 0, 1)), el.dataset.dir);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [rootRef, reduced]);
}
