"use client";

import { RefObject, useEffect, useRef, useState } from "react";

// Measures an element's content width and re-measures on resize (the prototype
// rebuilt every chart on resize; here a width change re-renders the SVG). Width
// is 0 until the first measurement, so charts can hold off drawing until they
// know their bench space — matching the prototype's `chartBox` width gate.
export function useMeasure<T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T | null>,
  number,
] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.round(w));
    });
    ro.observe(el);
    setWidth(Math.round(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}
