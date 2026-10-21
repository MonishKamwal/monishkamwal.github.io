"use client";

import { RefObject, useEffect } from "react";
import { clamp } from "@/lib/story/motion";
import {
  AX_PH,
  AX_TAG,
  AX_WIRES,
  buildArchSvg,
  type Sheet,
} from "@/lib/story/archDiagram";

export type ArchRefs = {
  svg: RefObject<SVGSVGElement | null>;
  root: RefObject<HTMLElement | null>; // the page root (queries [data-k] blocks + [data-w] io)
};

const smooth = (v: number) => {
  v = clamp(v, 0, 1);
  return v * v * (3 - 2 * v);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// The Architecture page's scroll camera. Four isometric sheets on a sticky
// stage pull apart as the text scrolls; each plane stop slides one sheet out and
// dims the rest, each wire stop lights the one crossing it names. A sends/receives
// row lights its wire on hover/tap. Clicking a cube opens its paper card. Ported
// from sections-prototype.html (archBuild + archLayout + applyArch).
export function useArchMotion(
  refs: ArchRefs,
  reduced: boolean,
  onPart: (cardId: string, el: Element) => void,
  ioOnClass: string,
): void {
  useEffect(() => {
    const svg = refs.svg.current;
    const root = refs.root.current;
    if (!svg || !root) return;
    // non-null locals so the narrowing holds inside the nested closures below
    const svgEl = svg;

    const portMq = window.matchMedia("(max-aspect-ratio:9/10)");
    const blocks = [...root.querySelectorAll<HTMLElement>("[data-k]")];
    const ioRows = [...root.querySelectorAll<HTMLElement>("[data-w]")];

    let sheets: Sheet[] = [];
    let gs: SVGGElement[] = [];
    let wg: SVGGElement | null = null;
    let lg: SVGGElement | null = null;
    let anchors: number[] = [];
    let hover = -1;
    let builtFor = "";

    const partCleanups: (() => void)[] = [];
    function build() {
      const port = portMq.matches;
      const key = port ? "p" : "l";
      if (key === builtFor) return;
      builtFor = key;
      const ts = port ? 1.9 : 1.45;
      const b = buildArchSvg(ts);
      sheets = b.sheets;
      svgEl.innerHTML = b.html;
      gs = [...svgEl.querySelectorAll<SVGGElement>(".ax-pl")].sort(
        (a, c) => Number(a.dataset.i) - Number(c.dataset.i),
      );
      wg = svgEl.querySelector(".ax-w");
      lg = svgEl.querySelector(".ax-l");
      partCleanups.forEach((fn) => fn());
      partCleanups.length = 0;
      svgEl.querySelectorAll<SVGGElement>(".ax-part").forEach((el) => {
        const open = () => onPart(el.dataset.card!, el);
        const onKey = (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        };
        el.addEventListener("click", open);
        el.addEventListener("keydown", onKey);
        partCleanups.push(() => {
          el.removeEventListener("click", open);
          el.removeEventListener("keydown", onKey);
        });
      });
    }

    function layout() {
      build();
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const port = portMq.matches;
      let prev = 0;
      anchors = blocks.map((b, i) => {
        if (i === 0) return 0;
        const top = b.getBoundingClientRect().top + window.scrollY;
        let a = port ? top - 0.53 * vh : top + b.offsetHeight / 2 - vh / 2;
        a = clamp(a, prev + 1, Math.max(prev + 1, max));
        prev = a;
        return a;
      });
    }

    function applyArch() {
      if (anchors.length < 2 || !wg || !lg) return;
      const st = window.scrollY, an = anchors, port = portMq.matches;
      const W = window.innerWidth, H = window.innerHeight;
      let i = 0;
      while (i < an.length - 2 && st >= an[i + 1]) i++;
      const seg = Math.max(1, an[i + 1] - an[i]), f = clamp((st - an[i]) / seg, 0, 1);
      let e: number;
      if (reduced) e = f < 0.5 ? 0 : 1;
      else if (port) { const T2 = Math.min(seg, H * 0.34); e = smooth((st - (an[i + 1] - T2)) / T2); }
      else e = smooth((f - 0.12) / 0.76);
      const P0 = AX_PH[i], P1 = AX_PH[i + 1];
      const u = port ? Math.min(W / 390, H / 844) : Math.min(W / 1440, H / 900);
      const place = (p: typeof P0) =>
        port ? { cx: W / 2, cy: 0.27 * H, k: 0.36 * u }
          : p.hero ? { cx: 0.66 * W, cy: 0.6 * H, k: 0.62 * u }
            : { cx: 0.31 * W, cy: 0.5 * H, k: 0.6 * u };
      const p0 = place(P0), p1 = place(P1);
      const cx = lerp(p0.cx, p1.cx, e), cy = lerp(p0.cy, p1.cy, e), k = lerp(p0.k, p1.k, e);
      const sep = lerp(P0.sep, P1.sep, e) * (port ? 0.62 : 1);
      const litOf = (p: typeof P0, n: number) =>
        p.focus != null ? (p.focus === n ? 1 : 0)
          : p.cross != null ? (AX_WIRES[p.cross].a[0] === n || AX_WIRES[p.cross].b[0] === n ? 1 : 0) : 1;
      const isF = (p: typeof P0) => (p.focus != null || p.cross != null ? 1 : 0);
      const anyF = lerp(isF(P0), isF(P1), e);
      const T: { X: number; Y: number; s: number }[] = [];
      for (let n = 0; n < 4; n++) {
        const w = lerp(P0.focus === n ? 1 : 0, P1.focus === n ? 1 : 0, e);
        const lit = lerp(litOf(P0, n), litOf(P1, n), e);
        const sc = k * (1 + 0.1 * w), X = cx + w * (port ? 0 : 60 * u), Y = cy + (n - 1.5) * sep * k - w * (port ? 0 : 10 * u);
        T.push({ X, Y, s: sc });
        gs[n].setAttribute("transform", "translate(" + X.toFixed(1) + "," + Y.toFixed(1) + ") scale(" + sc.toFixed(4) + ")");
        gs[n].style.opacity = (1 - anyF * (1 - lit) * 0.74).toFixed(3);
      }
      gs[3].classList.toggle("mat", !!(e < 0.5 ? P0 : P1).mat);
      const open = clamp((sep / (port ? 0.62 : 1) - 22) / 150, 0, 1);
      const at = (pi: number, part: string, key: "top" | "base"): [number, number] => {
        const p = sheets[pi].pts[part][key];
        return [T[pi].X + T[pi].s * p[0], T[pi].Y + T[pi].s * p[1]];
      };
      const wOf = (p: typeof P0, j: number) => {
        const w = AX_WIRES[j];
        if (p.cross != null) return p.cross === j ? 1 : 0.12;
        if (p.focus != null) return w.a[0] === p.focus || w.b[0] === p.focus ? 1 : 0.15;
        return p.all ? 0.75 : 0;
      };
      let ws = "", ls = "";
      AX_WIRES.forEach((wr, j) => {
        const A = at(wr.a[0], wr.a[1], wr.up ? "top" : "base");
        const B = at(wr.b[0], wr.b[1], wr.up ? "base" : "top");
        let hw = lerp(wOf(P0, j), wOf(P1, j), e);
        if (hover >= 0) hw = hover === j ? 1 : Math.min(hw, 0.15);
        hw *= open;
        if (hw < 0.01) return;
        const col = hw > 0.85 || wr.up ? "#96600a" : "#0a0a0a";
        const dir = Math.atan2(B[1] - A[1], B[0] - A[0]), ah = (7 + 3 * hw) * u;
        ws += '<g opacity="' + (0.18 + 0.82 * hw).toFixed(3) + '">' +
          '<path d="M' + A[0].toFixed(1) + " " + A[1].toFixed(1) + " L" + B[0].toFixed(1) + " " + B[1].toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="' + ((1.4 + 1.4 * hw) * u).toFixed(2) + '"/>' +
          '<path d="M' + (B[0] - ah * Math.cos(dir - 0.5)).toFixed(1) + " " + (B[1] - ah * Math.sin(dir - 0.5)).toFixed(1) + " L" + B[0].toFixed(1) + " " + B[1].toFixed(1) + " L" + (B[0] - ah * Math.cos(dir + 0.5)).toFixed(1) + " " + (B[1] - ah * Math.sin(dir + 0.5)).toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="' + (1.6 * u).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<circle cx="' + A[0].toFixed(1) + '" cy="' + A[1].toFixed(1) + '" r="' + ((3 + 2 * hw) * u).toFixed(1) + '" fill="' + col + '"/></g>';
        if (hw > 0.3) {
          const fs = (port ? 10 : 12) * u, tw = wr.l.length * fs * 0.56 + 16 * u, th = fs + 10 * u, tg = AX_TAG[j];
          const mx = lerp(A[0], B[0], tg.t), my = lerp(A[1], B[1], tg.t);
          const lx = clamp(tg.side > 0 ? mx + 12 * u : mx - 12 * u - tw, 10, W - tw - 10);
          ls += '<g opacity="' + clamp((hw - 0.3) / 0.4, 0, 1).toFixed(3) + '"><rect x="' + lx.toFixed(1) + '" y="' + (my - th / 2).toFixed(1) + '" width="' + tw.toFixed(1) + '" height="' + th.toFixed(1) + '" rx="' + (th / 2).toFixed(1) + '" fill="#fff" stroke="' + col + '" stroke-width="' + (0.8 * u).toFixed(2) + '"/>' +
            '<text x="' + (lx + tw / 2).toFixed(1) + '" y="' + (my + fs * 0.36).toFixed(1) + '" font-size="' + fs.toFixed(1) + '" font-weight="500" text-anchor="middle" fill="' + col + '">' + wr.l + "</text></g>";
        }
      });
      wg.innerHTML = ws;
      lg.innerHTML = ls;
      blocks.forEach((b, j) => {
        if (j === 0) { b.style.opacity = port ? String(clamp(1 - st / (H * 0.28), 0, 1)) : ""; return; }
        if (port || reduced) { b.style.opacity = ""; return; }
        let o = 0;
        if (j === i) o = 1 - clamp((f - 0.15) / 0.3, 0, 1);
        else if (j === i + 1) o = clamp((f - 0.55) / 0.3, 0, 1);
        b.style.opacity = o.toFixed(3);
      });
      ioRows.forEach((li) => li.classList.toggle(ioOnClass, hover === Number(li.dataset.w)));
    }

    // a sends/receives row lights its wire (hover with a mouse, tap on touch)
    const ioCleanups: (() => void)[] = [];
    ioRows.forEach((li) => {
      const j = Number(li.dataset.w);
      const enter = () => { hover = j; };
      const leave = () => { hover = -1; };
      const tap = (e: PointerEvent) => { if (e.pointerType === "mouse") return; hover = hover === j ? -1 : j; };
      li.addEventListener("mouseenter", enter);
      li.addEventListener("mouseleave", leave);
      li.addEventListener("pointerup", tap);
      ioCleanups.push(() => {
        li.removeEventListener("mouseenter", enter);
        li.removeEventListener("mouseleave", leave);
        li.removeEventListener("pointerup", tap);
      });
    });

    layout();
    let raf = requestAnimationFrame(function loop() {
      applyArch();
      raf = requestAnimationFrame(loop);
    });
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    if (document.fonts) document.fonts.ready.then(layout);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ioCleanups.forEach((fn) => fn());
      partCleanups.forEach((fn) => fn());
    };
  }, [refs, reduced, onPart, ioOnClass]);
}
