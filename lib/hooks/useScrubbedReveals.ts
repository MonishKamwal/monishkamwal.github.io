"use client";

import { RefObject, useEffect } from "react";
import { clamp, easeOut, revealProgress, setReveal } from "@/lib/story/motion";

// Drives the scrubbed reveal of every `.reveal` element inside `rootRef` from
// one rAF loop (the shared Story-mode pattern). Path-owned elements (`.j-entry`,
// `.cv-stop`) opt out — their own page hook reveals them against their geometry.
// Under reduced motion everything is pinned visible and the loop never starts.
//
// Data pages fetch their contracts client-side, so their panels mount *after*
// the first paint; a MutationObserver re-captures the `.reveal` set when the
// subtree changes so late-arriving panels still fade in (a no-op for the static
// Story pages, whose subtree never changes).
export function useScrubbedReveals(
  rootRef: RefObject<HTMLElement | null>,
  reduced: boolean,
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const collect = () =>
      [...root.querySelectorAll<HTMLElement>(".reveal")].filter(
        (el) => !el.classList.contains("j-entry") && !el.classList.contains("cv-stop"),
      );

    let els = collect();

    if (reduced) {
      const pin = () => {
        for (const el of els) setReveal(el, 1, el.dataset.dir, true);
      };
      pin();
      const mo = new MutationObserver(() => {
        els = collect();
        pin();
      });
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const mo = new MutationObserver(() => {
      els = collect();
    });
    mo.observe(root, { childList: true, subtree: true });

    let raf = 0;
    const frame = () => {
      for (const el of els) {
        setReveal(el, easeOut(clamp(revealProgress(el), 0, 1)), el.dataset.dir);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, [rootRef, reduced]);
}
