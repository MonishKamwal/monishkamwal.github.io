"use client";

import { useRef } from "react";
import { useArrival } from "@/lib/hooks/useArrival";

// The arrival line that draws in beside the page title on load, then retires.
// Positioning + the draw/retire timing live in useArrival; the global
// .arrival-wrap/.arrival-line CSS carries the stroke animation.
export function ArrivalLine({ reduced }: { reduced: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useArrival(wrapRef, reduced);
  return (
    <div ref={wrapRef} className="arrival-wrap" aria-hidden="true">
      <svg width="2" height="150" viewBox="0 0 2 150">
        <path className="arrival-line" d="M1 0 V150" />
      </svg>
    </div>
  );
}
