"use client";

import { useEffect, useRef, useState } from "react";

// Reveal-on-scroll: returns a ref to attach to an element and a boolean that
// flips true the first time the element scrolls into view. Pairs with the
// [data-reveal] CSS in globals.css. Under prefers-reduced-motion the CSS keeps
// everything visible, so this just becomes a no-op signal.
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed, options]);

  return { ref, revealed };
}
