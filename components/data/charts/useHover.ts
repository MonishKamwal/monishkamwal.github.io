"use client";

import { useVizTip, type TipApi } from "../VizTip";

// The shared hover model (DESIGN.md §7.1), exactly as the prototype's
// `hoverLayer`: mouse/trackpad show while the pointer is over the target; a
// touch tap shows and arms a hide for the next tap or scroll; keyboard users
// get the table twin instead. `onShow`/`onHide` also drive the chart's own
// recessive mark (crosshair / band / ring).

// Plain factory — safe to call per hit-target inside a map (no hooks), given a
// tooltip api from the one `useVizTip()` the component already holds.
export function hoverHandlers(
  tip: TipApi,
  onShow: (clientX: number, clientY: number) => void,
  onHide: () => void,
) {
  return {
    onPointerMove: (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") onShow(e.clientX, e.clientY);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") onHide();
    },
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "touch") {
        onShow(e.clientX, e.clientY);
        tip.armTouch(onHide);
      }
    },
  };
}

// Hook form for the single-hit-area charts (one call per component).
export function useHoverProps(
  onShow: (clientX: number, clientY: number) => void,
  onHide: () => void,
) {
  const tip = useVizTip();
  return hoverHandlers(tip, onShow, onHide);
}
