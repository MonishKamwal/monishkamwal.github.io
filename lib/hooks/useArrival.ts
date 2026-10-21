"use client";

import { RefObject, useEffect } from "react";

// "The line carries you" — a short vertical stroke draws in beside the page
// title on arrival, then retires. Positioned just right of the title's text
// (measured with a Range, so it tracks the glyphs, not the element box). Under
// reduced motion the line is hidden entirely. Ported from sections-prototype.
export function useArrival(
  wrapRef: RefObject<HTMLElement | null>,
  reduced: boolean,
): void {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (reduced) {
      wrap.style.display = "none";
      return;
    }

    const title = document.querySelector<HTMLElement>(
      ".story-root .page-title",
    );
    if (title) {
      const rg = document.createRange();
      rg.selectNodeContents(title);
      const x = Math.min(
        rg.getBoundingClientRect().right + 52,
        window.innerWidth - 60,
      );
      wrap.style.left = `${Math.round(x)}px`;
      wrap.style.transform = "none";
    } else {
      wrap.style.left = "50%";
      wrap.style.transform = "translateX(-50%)";
    }

    wrap.style.display = "block";
    wrap.classList.remove("draw", "retire");
    void wrap.offsetWidth; // reflow so the stroke-dashoffset transition restarts
    const raf = requestAnimationFrame(() => wrap.classList.add("draw"));
    const timer = window.setTimeout(() => wrap.classList.add("retire"), 700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [wrapRef, reduced]);
}
