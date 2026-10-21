"use client";

import { RefObject, useEffect } from "react";
import { clamp } from "@/lib/story/motion";

// Scroll-driven top & bottom edge dissolve (ported from the Data prototypes):
// the top band fades in once scrolled, the bottom band fades out as the document
// end nears. Chrome above stays crisp. Cheap enough to run on a passive scroll
// listener rather than a rAF loop.
export function useEdgeBlur(
  topRef: RefObject<HTMLElement | null>,
  botRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const apply = () => {
      const top = topRef.current;
      const bot = botRef.current;
      if (!top || !bot) return;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      top.style.opacity = String(clamp(y / 140, 0, 1));
      bot.style.opacity = String(max <= 0 ? 0 : clamp((max - y) / 140, 0, 1));
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, [topRef, botRef]);
}
