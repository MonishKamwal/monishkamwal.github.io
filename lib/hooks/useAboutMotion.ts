"use client";

import { RefObject, useEffect } from "react";
import { clamp } from "@/lib/story/motion";

export type AboutRefs = {
  wash: RefObject<SVGSVGElement | null>;
  trace: RefObject<HTMLDivElement | null>;
  path: RefObject<SVGPathElement | null>;
  lensCircle: RefObject<SVGCircleElement | null>;
  lensHole: RefObject<SVGCircleElement | null>;
};

// a smooth closed Catmull-Rom spline through points (the wash blob outlines)
function closedSpline(p: [number, number][]): string {
  const n = p.length;
  let d = `M${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const a = p[(i - 1 + n) % n], b = p[i], c = p[(i + 1) % n], e = p[(i + 2) % n];
    const c1x = b[0] + (c[0] - a[0]) / 6, c1y = b[1] + (c[1] - a[1]) / 6;
    const c2x = c[0] - (e[0] - b[0]) / 6, c2y = c[1] - (e[1] - b[1]) / 6;
    d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${c[0].toFixed(2)} ${c[1].toFixed(2)}`;
  }
  return d + "Z";
}

const TR_LENS_R = 52;
const NODE_COORDS: [number, number][] = [[500, 70], [205, 330], [500, 580]];

// The About page's two motions, in one loop: the background wash blobs
// breathe/undulate (Home §5's living-wash scheme), and the Work serpentine takes
// the Journey hover — hover a stop and it grows, its node swells and warms, and
// the lens slides along the path to it. Both off under reduced motion. Ported
// from sections-prototype.html (morphAbout + applyTrace).
export function useAboutMotion(refs: AboutRefs, reduced: boolean, hotClass: string): void {
  useEffect(() => {
    if (reduced) return;

    const wash = refs.wash.current;
    const trace = refs.trace.current;
    const path = refs.path.current;
    const lensCircle = refs.lensCircle.current;
    const lensHole = refs.lensHole.current;

    // ---- wash: built lazily (getTotalLength needs the blobs laid out) ----
    type Blob = { el: SVGPathElement; polar: { ang: number; r: number }[]; cx: number; cy: number; ph: number; amp: number; bAmp: number; bSpd: number; bPh: number };
    let blobs: Blob[] | null = null;
    const buildWash = () => {
      if (!wash) return;
      const els = [...wash.querySelectorAll<SVGPathElement>(".blob")];
      if (!els.length) return;
      let len0 = 0;
      try { len0 = els[0].getTotalLength(); } catch { return; }
      if (!len0) return;
      blobs = els.map((el, i) => {
        const N = 56;
        let len = 0;
        try { len = el.getTotalLength(); } catch { len = 0; }
        const pts: [number, number][] = [];
        for (let k = 0; k < N; k++) { const q = el.getPointAtLength((len * k) / N); pts.push([q.x, q.y]); }
        const cx = pts.reduce((s, p) => s + p[0], 0) / N, cy = pts.reduce((s, p) => s + p[1], 0) / N;
        const polar = pts.map((p) => ({ ang: Math.atan2(p[1] - cy, p[0] - cx), r: Math.hypot(p[0] - cx, p[1] - cy) }));
        return { el, polar, cx, cy, ph: i * 1.3, amp: 0.055 + 0.015 * (i % 3), bAmp: 0.08 + 0.02 * (i % 2), bSpd: 0.00072 + 0.00006 * i, bPh: i * 1.7 };
      });
    };
    const morphWash = (t: number) => {
      if (!blobs) { buildWash(); if (!blobs) return; }
      blobs.forEach((it) => {
        const breath = 1 + it.bAmp * Math.sin(t * it.bSpd + it.bPh);
        const pts = it.polar.map((pp) => {
          const wob = 1 + it.amp * (0.7 * Math.sin(t * 0.0012 + it.ph + pp.ang * 3) + 0.3 * Math.sin(t * 0.0018 - it.ph + pp.ang * 2));
          const r = pp.r * wob * breath;
          return [it.cx + Math.cos(pp.ang) * r, it.cy + Math.sin(pp.ang) * r] as [number, number];
        });
        it.el.setAttribute("d", closedSpline(pts));
      });
    };

    // ---- the Work serpentine lens (built lazily; the path has no length until laid out) ----
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)");
    const S = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hover-scale")) || 1.08;
    type Trace = {
      stops: HTMLElement[]; nodes: SVGCircleElement[]; len: number;
      frac: number[]; baseR: number[]; cur: number[];
      hover: number; target: number; focus: number; lensOn: number; off: number | null;
      comet: SVGPathElement | null; halo: SVGCircleElement | null;
      head: SVGCircleElement | null; rings: SVGCircleElement[]; cometTail: number;
    };
    let tr: Trace | null = null;
    const traceCleanups: (() => void)[] = [];
    const buildTrace = (): Trace | null => {
      if (!trace || !path) return null;
      const len = path.getTotalLength();
      if (!len) return null;
      const N = 240;
      const samp: DOMPoint[] = [];
      for (let k = 0; k <= N; k++) samp.push(path.getPointAtLength((len * k) / N));
      const fracNear = (x: number, y: number) => {
        let bi = 0, bd = 1e9;
        samp.forEach((p, k) => { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; bi = k; } });
        return bi / N;
      };
      const nodes = [...trace.querySelectorAll<SVGCircleElement>("[data-tr-node]")];
      const stops = [...trace.querySelectorAll<HTMLElement>("[data-tr-stop]")];
      const comet = trace.querySelector<SVGPathElement>("[data-tr-comet]");
      const cometTail = Math.max(40, len * 0.16);
      if (comet) comet.style.strokeDasharray = `${cometTail} ${len}`;
      const t: Trace = {
        stops, nodes, len,
        frac: NODE_COORDS.map(([x, y]) => fracNear(x, y)),
        baseR: nodes.map((n) => parseFloat(n.getAttribute("r") || "8")),
        cur: stops.map(() => 0),
        hover: -1, target: 0, focus: 0, lensOn: 0, off: null,
        comet,
        halo: trace.querySelector<SVGCircleElement>("[data-tr-halo]"),
        head: trace.querySelector<SVGCircleElement>("[data-tr-head]"),
        rings: [...trace.querySelectorAll<SVGCircleElement>("[data-tr-ring]")],
        cometTail,
      };
      stops.forEach((el, i) => {
        const enter = () => {
          if (!fine.matches) return;
          if (parseFloat(trace.style.opacity || "0") <= 0.6) return;
          if (t.off) clearTimeout(t.off);
          if (t.lensOn < 0.05) t.focus = t.frac[i];
          t.hover = i;
          t.target = t.frac[i];
        };
        const leave = () => { if (t.off) clearTimeout(t.off); t.off = window.setTimeout(() => { t.hover = -1; }, 90); };
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        traceCleanups.push(() => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
      });
      return t;
    };
    const applyTrace = () => {
      if (!tr) { tr = buildTrace(); if (!tr) return; }
      if (!path || !lensCircle || !lensHole) return;
      tr.lensOn += ((tr.hover >= 0 ? 1 : 0) - tr.lensOn) * 0.18;
      tr.focus += (tr.target - tr.focus) * 0.3;
      tr.stops.forEach((el, i) => {
        tr!.cur[i] += ((i === tr!.hover ? 1 : 0) - tr!.cur[i]) * 0.18;
        const s = 1 + (S - 1) * tr!.cur[i];
        el.style.scale = tr!.cur[i] < 0.001 ? "" : s.toFixed(3);
        tr!.nodes[i]?.setAttribute("r", (tr!.baseR[i] * s).toFixed(2));
        el.classList.toggle(hotClass, i === tr!.hover);
        tr!.nodes[i]?.classList.toggle(hotClass, i === tr!.hover);
      });
      if (tr.lensOn < 0.01) {
        lensCircle.setAttribute("r", "0");
        lensHole.setAttribute("r", "0");
        return;
      }
      const pt = path.getPointAtLength(clamp(tr.focus, 0, 1) * tr.len);
      const r = (TR_LENS_R * tr.lensOn).toFixed(1);
      for (const el of [lensCircle, lensHole]) {
        el.setAttribute("cx", pt.x.toFixed(1));
        el.setAttribute("cy", pt.y.toFixed(1));
        el.setAttribute("r", r);
      }
    };

    // ---- the travelling comet: the Journey "traveling light + milestone pulse",
    // ported onto the Work serpentine. A short lit tail laps the path on a steady
    // clock (not scroll-position), gated by the serpentine's visibility; a soft
    // halo + bright head ride the leading edge, and each Work node's ring blooms
    // as the comet passes it. ----
    const CM_LAP = 6000, CM_WIN = 0.12;
    const applyComet = (now: number) => {
      if (!tr || !path || !trace || !tr.comet || !tr.halo || !tr.head) return;
      const rect = trace.getBoundingClientRect(), vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) {
        tr.comet.style.opacity = "0";
        tr.halo.setAttribute("opacity", "0");
        tr.head.setAttribute("opacity", "0");
        tr.rings.forEach((rg) => rg.setAttribute("opacity", "0"));
        return;
      }
      const vis = clamp((vh * 0.85 - rect.top) / (vh * 0.7), 0, 1);
      const ph = (now / CM_LAP) % 1, s = ph * tr.len;
      tr.comet.style.strokeDashoffset = (tr.cometTail - s).toFixed(1);
      const fade = Math.min(1, ph / 0.06, (1 - ph) / 0.06) * vis;
      tr.comet.style.opacity = (0.9 * fade).toFixed(3);
      const pt = path.getPointAtLength(s);
      for (const el of [tr.halo, tr.head]) {
        el.setAttribute("cx", pt.x.toFixed(1));
        el.setAttribute("cy", pt.y.toFixed(1));
      }
      tr.halo.setAttribute("opacity", (0.2 * fade).toFixed(3));
      tr.head.setAttribute("opacity", fade.toFixed(3));
      tr.rings.forEach((rg, i) => {
        const since = (((ph - tr!.frac[i]) % 1) + 1) % 1;
        const raw = since < CM_WIN ? 1 - since / CM_WIN : 0;
        rg.setAttribute("r", (tr!.baseR[i] + (1 - raw) * 14).toFixed(2));
        rg.setAttribute("opacity", (raw * vis * 0.5).toFixed(3));
      });
    };

    let raf = requestAnimationFrame(function loop(t) {
      morphWash(t);
      applyTrace();
      applyComet(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      traceCleanups.forEach((fn) => fn());
    };
  }, [refs, reduced, hotClass]);
}
