// Shared motion math for Story mode, ported verbatim from the prototype's
// reveal machinery (sections-prototype.html). Pure functions — no DOM state —
// so the hooks that drive the rAF loops stay thin and testable.

export const clamp = (v: number, a: number, b: number): number =>
  Math.min(b, Math.max(a, v));

export const easeOut = (sp: number): number =>
  sp <= 0 ? 0 : sp >= 1 ? 1 : 1 - Math.pow(1 - sp, 3);

// An element's reveal is a pure function of its position in the viewport
// (scrubbed, per DESIGN.md Stage 4.5). `data-stagger` shifts the window so a
// group's children resolve on a staircase; `data-reveal="foot"` anchors a
// bottom-of-page block to its own height so it can't rest at partial opacity.
export function revealProgress(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (el.dataset.reveal === "foot") {
    return clamp((vh * 0.98 - r.top) / r.height, 0, 1);
  }
  const st = parseFloat(el.dataset.stagger || "0");
  const start = vh * 0.88 - st * vh * 0.045;
  const end = vh * 0.6 - st * vh * 0.045;
  return clamp((start - r.top) / (start - end), 0, 1);
}

// Apply a 0..1 reveal amount to an element: fade + a small directional rise.
// A settled element drops its transform entirely so light-weight serif text is
// re-rastered at its real size instead of GPU-upscaled from a composited layer.
export function setReveal(
  el: HTMLElement,
  e: number,
  dir?: string,
  reduced = false,
): void {
  el.style.opacity = String(e);
  if (reduced) {
    el.style.transform = "none";
    return;
  }
  if (e > 0.999) {
    el.style.transform = "";
    return;
  }
  if (dir === "left") el.style.transform = `translate3d(${(1 - e) * -28}px,0,0)`;
  else if (dir === "right")
    el.style.transform = `translate3d(${(1 - e) * 28}px,0,0)`;
  else el.style.transform = `translate3d(0,${(1 - e) * 16}px,0)`;
}
