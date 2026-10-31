"use client";

import { RefObject, useEffect } from "react";

// A self-contained "living wash": the breathing/morphing blobs from Home §5,
// reusable on any container that holds a `.wash-wide` / `.wash-tall` pair of
// SVGs (markup in a `*Wash.ts`). It (1) reveals the `.b-g` groups when the
// section scrolls into view and (2) runs the organic morph loop on the visible
// layout while on-screen. Hover lighting is pure CSS; a click/tap is handled by
// the caller (About opens a paper card). Ported from the HomeScroll §5 block;
// kept standalone so About can reuse it without the full-screen scroll
// machinery. Honours prefers-reduced-motion: when reduced, shapes reveal
// settled and nothing morphs.

function closedSpline(p: [number, number][]): string {
  const n = p.length;
  let d = "M" + p[0][0].toFixed(2) + " " + p[0][1].toFixed(2);
  for (let i = 0; i < n; i++) {
    const a = p[(i - 1 + n) % n],
      b = p[i],
      c = p[(i + 1) % n],
      e = p[(i + 2) % n];
    const c1x = b[0] + (c[0] - a[0]) / 6,
      c1y = b[1] + (c[1] - a[1]) / 6;
    const c2x = c[0] - (e[0] - b[0]) / 6,
      c2y = c[1] - (e[1] - b[1]) / 6;
    d += " C" + c1x.toFixed(2) + " " + c1y.toFixed(2) + " " + c2x.toFixed(2) + " " + c2y.toFixed(2) + " " + c[0].toFixed(2) + " " + c[1].toFixed(2);
  }
  return d + "Z";
}

type MorphItem = {
  el: SVGPathElement;
  cx: number;
  cy: number;
  polar: { ang: number; r: number }[];
  ph: number;
  amp: number;
  bAmp: number;
  bSpd: number;
  bPh: number;
  t: number;
  rate: number;
};

const TAU = 84; // ms time-constant for the hold/resume ease

export function useBreathingWash(
  root: RefObject<HTMLElement | null>,
  reduced: boolean,
  revealedClass: string,
): void {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const washes = [...el.querySelectorAll<SVGSVGElement>(".wash")];

    // reveal the groups once the section scrolls into view
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      washes.forEach((w) => w.classList.add(revealedClass));
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) reveal();
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.12 },
    );
    io.observe(el);

    if (reduced) {
      reveal();
      return () => io.disconnect();
    }

    // ---- the morph loop ----
    const portMq = window.matchMedia("(max-aspect-ratio:9/10)");
    const origD = new Map<SVGPathElement, string>();
    let morph: { key: string; items: MorphItem[] } | null = null;
    let last = 0;
    const N = 56;

    function build() {
      const key = portMq.matches ? "tall" : "wide";
      const wash = el!.querySelector(key === "tall" ? ".wash-tall" : ".wash-wide");
      morph = null;
      if (!wash) return;
      const items = [...wash.querySelectorAll<SVGPathElement>(".b-g .blob")]
        .map((path, i): MorphItem | null => {
          if (!origD.has(path)) origD.set(path, path.getAttribute("d")!);
          else path.setAttribute("d", origD.get(path)!);
          let len = 0;
          try {
            len = path.getTotalLength();
          } catch {
            len = 0;
          }
          if (!len) return null;
          const pts: [number, number][] = [];
          for (let k = 0; k < N; k++) {
            const pt = path.getPointAtLength((len * k) / N);
            pts.push([pt.x, pt.y]);
          }
          const cx = pts.reduce((s, p) => s + p[0], 0) / N,
            cy = pts.reduce((s, p) => s + p[1], 0) / N;
          const polar = pts.map((p) => ({
            ang: Math.atan2(p[1] - cy, p[0] - cx),
            r: Math.hypot(p[0] - cx, p[1] - cy),
          }));
          return {
            el: path,
            cx,
            cy,
            polar,
            ph: i * 1.3,
            amp: 0.055 + 0.015 * (i % 3),
            bAmp: 0.08 + 0.02 * (i % 2),
            bSpd: 0.00072 + 0.00006 * i,
            bPh: i * 1.7,
            t: performance.now(),
            rate: 1,
          };
        })
        .filter((x): x is MorphItem => x !== null);
      morph = { key, items };
    }

    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      const r = el!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) {
        last = 0;
        return;
      }
      const key = portMq.matches ? "tall" : "wide";
      if (!morph || morph.key !== key) build();
      if (!morph) return;
      const now = performance.now();
      const dt = last ? Math.min(now - last, 50) : 0;
      last = now;
      const ease = 1 - Math.exp(-dt / TAU);
      for (const it of morph.items) {
        const g = it.el.closest(".b-g");
        // the enlarged shape keeps breathing; others still settle on hover/tap
        const isOpen = !!g && g.hasAttribute("data-sk-open");
        const held =
          !!g && !isOpen && (g.classList.contains("lit") || g.matches(":hover"));
        it.rate += ((held ? 0 : 1) - it.rate) * ease;
        if (it.rate < 0.0005) {
          it.rate = 0;
          continue;
        }
        it.t += dt * it.rate;
        const t = it.t;
        const breath = 1 + it.bAmp * Math.sin(t * it.bSpd + it.bPh);
        const pts = it.polar.map((pp): [number, number] => {
          const wob =
            1 +
            it.amp *
              (0.7 * Math.sin(t * 0.0012 + it.ph + pp.ang * 3) +
                0.3 * Math.sin(t * 0.0018 - it.ph + pp.ang * 2));
          const rr = pp.r * wob * breath;
          return [it.cx + Math.cos(pp.ang) * rr, it.cy + Math.sin(pp.ang) * rr];
        });
        it.el.setAttribute("d", closedSpline(pts));
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [root, reduced, revealedClass]);
}
