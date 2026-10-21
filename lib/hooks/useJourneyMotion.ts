"use client";

import { RefObject, useEffect } from "react";
import { clamp, easeOut, setReveal } from "@/lib/story/motion";
import type { JourneyLayout } from "@/lib/story/journeyLayout";

export type JourneyRefs = {
  wrap: RefObject<HTMLDivElement | null>;
  svg: RefObject<SVGSVGElement | null>;
  path: RefObject<SVGPathElement | null>;
  end: RefObject<SVGPathElement | null>;
  tail: RefObject<HTMLParagraphElement | null>;
  lensCircle: RefObject<SVGCircleElement | null>;
  lensHole: RefObject<SVGCircleElement | null>;
};

const LENS_R = 52; // the lens radius Home and About use
const SAMPLES = 500;

type Focus = {
  hit: HTMLElement;
  scaleEl: HTMLElement;
  liftEl: HTMLElement;
  dot: SVGCircleElement | null;
  frac: number;
  cur: number;
};

// The Journey page's own motion loop: reveals dots + entries + phase heads
// against scroll position (down the wrap), draws the fading tail, and runs the
// hover lens — the stretch of line under the hovered block, thickened, with the
// block lifted and warmed. Ported from sections-prototype.html (buildJourney +
// wireJourneyHover + magnify + applyJourney), generalized to the data layout.
export function useJourneyMotion(
  refs: JourneyRefs,
  layout: JourneyLayout,
  reduced: boolean,
  hotClass: string,
): void {
  useEffect(() => {
    const wrap = refs.wrap.current;
    const svg = refs.svg.current;
    const path = refs.path.current;
    const end = refs.end.current;
    const tail = refs.tail.current;
    const lensCircle = refs.lensCircle.current;
    const lensHole = refs.lensHole.current;
    if (!wrap || !svg || !path || !end || !tail || !lensCircle || !lensHole) return;

    const LENS_S =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--hover-scale"),
      ) || 1.08;
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)");

    const entries = [...wrap.querySelectorAll<HTMLElement>("[data-jentry]")];
    const dots = [...svg.querySelectorAll<SVGCircleElement>("[data-jdot]")];
    const heads = [...wrap.querySelectorAll<HTMLElement>("[data-jhead]")];

    // measure each anchor's length-fraction along the drawn line (nearest sample)
    let jLen = path.getTotalLength();
    let samp: DOMPoint[] = [];
    const resample = () => {
      jLen = path.getTotalLength();
      samp = [];
      for (let k = 0; k <= SAMPLES; k++) samp.push(path.getPointAtLength((jLen * k) / SAMPLES));
    };
    const fracNear = (x: number, y: number) => {
      let bi = 0, bd = 1e9;
      for (let k = 0; k <= SAMPLES; k++) {
        const dx = samp[k].x - x, dy = samp[k].y - y, dd = dx * dx + dy * dy;
        if (dd < bd) { bd = dd; bi = k; }
      }
      return bi / SAMPLES;
    };
    const fracY = (y: number) => {
      let bi = 0, bd = 1e9;
      for (let k = 0; k <= SAMPLES; k++) {
        const dy = Math.abs(samp[k].y - y);
        if (dy < bd) { bd = dy; bi = k; }
      }
      return bi / SAMPLES;
    };
    resample();

    const nodeFrac = layout.nodes.map((n) => fracNear(n.x, n.y));
    const headFrac = layout.heads.map((h) => fracY(h.y));

    // reduced motion: settle everything visible, no loop, no hover lens
    if (reduced) {
      entries.forEach((e) => setReveal(e, 1, undefined, true));
      dots.forEach((d) => (d.style.opacity = "1"));
      heads.forEach((h) => (h.style.opacity = "1"));
      end.style.strokeDashoffset = "0";
      tail.style.opacity = "1";
      return;
    }

    // hover focus targets: entries scale as a block; headings scale their chip
    let hoverIdx = -1, focusTarget = 0, focusCur = 0, lensOn = 0;
    let offTimer: number | null = null;
    const focus: Focus[] = [
      ...entries.map((el, i) => ({
        hit: el, scaleEl: el, liftEl: el,
        dot: dots[i] ?? null, frac: nodeFrac[i], cur: 0,
      })),
      ...heads.map((el, i) => {
        const chip = el.querySelector<HTMLElement>("[data-jchip]") ?? el;
        return { hit: chip, scaleEl: chip, liftEl: el, dot: null, frac: headFrac[i], cur: 0 };
      }),
    ];

    const focusOn = (i: number) => {
      if (!fine.matches) return;
      if (offTimer) clearTimeout(offTimer);
      if (lensOn < 0.05) focusCur = focus[i].frac; // cold start grows in place
      hoverIdx = i;
      focusTarget = focus[i].frac;
    };
    const focusOff = () => {
      if (offTimer) clearTimeout(offTimer);
      offTimer = window.setTimeout(() => { hoverIdx = -1; }, 90);
    };
    const cleanups: (() => void)[] = [];
    focus.forEach((f, i) => {
      const on = () => focusOn(i);
      f.hit.addEventListener("mouseenter", on);
      f.hit.addEventListener("mouseleave", focusOff);
      cleanups.push(() => {
        f.hit.removeEventListener("mouseenter", on);
        f.hit.removeEventListener("mouseleave", focusOff);
      });
      if (f.dot) {
        f.dot.addEventListener("mouseenter", on);
        f.dot.addEventListener("mouseleave", focusOff);
        cleanups.push(() => {
          f.dot?.removeEventListener("mouseenter", on);
          f.dot?.removeEventListener("mouseleave", focusOff);
        });
      }
    });

    const magnify = () => {
      lensOn += ((hoverIdx >= 0 ? 1 : 0) - lensOn) * 0.18;
      focusCur += (focusTarget - focusCur) * 0.3;
      focus.forEach((f, i) => {
        f.cur += ((i === hoverIdx ? 1 : 0) - f.cur) * 0.18;
        const s = 1 + (LENS_S - 1) * f.cur;
        f.scaleEl.style.scale = f.cur < 0.001 ? "" : s.toFixed(3);
        f.liftEl.style.zIndex = f.cur < 0.001 ? "" : "26"; // clear the edge blur while lifted
        if (f.dot) f.dot.setAttribute("r", (6 * s).toFixed(2));
        f.scaleEl.classList.toggle(hotClass, i === hoverIdx);
        if (f.dot) f.dot.classList.toggle(hotClass, i === hoverIdx);
      });
      if (lensOn < 0.01) {
        lensCircle.setAttribute("r", "0");
        lensHole.setAttribute("r", "0");
        return;
      }
      const pt = path.getPointAtLength(clamp(focusCur, 0, 1) * jLen);
      const fx = +pt.x.toFixed(1), fy = +pt.y.toFixed(1), r = (LENS_R * lensOn).toFixed(1);
      for (const el of [lensCircle, lensHole]) {
        el.setAttribute("cx", String(fx));
        el.setAttribute("cy", String(fy));
        el.setAttribute("r", r);
      }
    };

    const applyJourney = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // draw progress: from when the wrap nears the fold to when it clears mid-screen
      const dP = clamp((vh * 0.72 - r.top) / (r.height - vh * 0.28), 0, 1);
      layout.nodes.forEach((n, i) => {
        if (dots[i]) dots[i].style.opacity = String(clamp((dP - n.ry) / 0.03, 0, 1));
        const e = easeOut(clamp((dP - (n.ry + 0.005)) / 0.08, 0, 1));
        setReveal(entries[i], e, undefined);
        entries[i].style.pointerEvents = e > 0.6 ? "auto" : "none";
      });
      layout.heads.forEach((h, i) => {
        const e = easeOut(clamp((dP - Math.max(0, h.ry - 0.03)) / 0.06, 0, 1));
        heads[i].style.opacity = String(e);
        const chip = heads[i].querySelector<HTMLElement>("[data-jchip]");
        if (chip) chip.style.pointerEvents = e > 0.6 ? "auto" : "none";
      });
      const eLen = end.getTotalLength();
      end.style.strokeDashoffset = String(eLen * (1 - clamp((dP - 0.9) / 0.1, 0, 1)));
      tail.style.opacity = String(clamp((dP - 0.96) / 0.04, 0, 1));
      magnify();
    };

    // seed the end tail's dash so it draws on scroll
    const eLen = end.getTotalLength();
    end.style.strokeDasharray = String(eLen);
    end.style.strokeDashoffset = String(eLen);

    let raf = requestAnimationFrame(function loop() {
      applyJourney();
      raf = requestAnimationFrame(loop);
    });
    const onResize = () => resample();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (offTimer) clearTimeout(offTimer);
      cleanups.forEach((fn) => fn());
    };
  }, [refs, layout, reduced, hotClass]);
}
