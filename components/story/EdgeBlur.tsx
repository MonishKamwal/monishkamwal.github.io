"use client";

import { useRef } from "react";
import { useEdgeBlur } from "@/lib/hooks/useEdgeBlur";

// Top & bottom progressive-blur bands (global .edge-blur CSS). Three stacked
// backdrop layers per edge ramp the blur; opacity is scroll-driven by useEdgeBlur.
export function EdgeBlur() {
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  useEdgeBlur(topRef, botRef);
  return (
    <>
      <div ref={topRef} className="edge-blur top" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div ref={botRef} className="edge-blur bot" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </>
  );
}
