"use client";

import { useEffect, useRef } from "react";
import { home, site, journeyEntry } from "@/lib/content";
import SketchDemo from "./SketchDemo";
import { WASH_MARKUP } from "./washMarkup";

// Home — the six-section scroll, ported from transition-prototype.html (the
// finalized design; DESIGN.md §5). The structure is React-rendered once; all the
// motion (reveals, the auto-cycling arch deck, the journey serpentine + comet +
// magnifier, the living skills wash, the section chrome, the edge blur) runs in
// one imperative requestAnimationFrame loop — the prototype's model, kept intact
// because it reads rects every frame and must never trigger a React re-render.
// Copy comes from content/*.json; the live demo is its own component.

const archTeaser = home.teasers.architecture;
const journeyTeaser = home.teasers.journey;
const skillsTeaser = home.teasers.skills;
const bookend = home.bookend;

const ArrowDown = () => (
  <svg viewBox="0 0 34 54" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M17 2v46M6 37l11 11 11-11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function HomeScroll() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(sel: string) =>
      root.querySelector(sel) as T | null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const heroLayer = $("#heroLayer") as HTMLElement;
    const panelLayer = $("#panelLayer") as HTMLElement;
    const sceneLayer = $("#sceneLayer") as HTMLElement;
    const journeyLayer = $("#journeyLayer") as HTMLElement;
    const skillsLayer = $("#skillsLayer") as HTMLElement;
    const afterLayer = $("#afterLayer") as HTMLElement;
    const indicator = $("#indicator") as HTMLElement;
    const menuBtn = $("#menuBtn") as HTMLElement;

    const clamp = (v: number, a: number, b: number) =>
      Math.min(b, Math.max(a, v));

    /* ================= §3 architecture deck ================= */
    const A_PLANES = [
      { name: "Serving", fill: "#dee5f4" },
      { name: "Monitoring", fill: "#d8ecde" },
      { name: "CI/CD", fill: "#f8dfc4" },
      { name: "Ephemeral K8s", fill: "#fbd3dc", ghost: true },
    ];
    const A_PARTS = [
      [{ n: "Browser", x: 110, y: 250 }, { n: "Lambda", x: 300, y: 100 }, { n: "S3", x: 470, y: 250 }],
      [{ n: "Drift", x: 470, y: 250 }, { n: "Hub", x: 470, y: 80 }, { n: "Issue", x: 130, y: 250 }],
      [{ n: "Train", x: 130, y: 250 }, { n: "Registry", x: 130, y: 80 }, { n: "Gate", x: 460, y: 200, gate: true }, { n: "Deploy", x: 300, y: 100 }],
      [{ n: "EKS", x: 120, y: 240 }, { n: "API", x: 300, y: 100 }, { n: "Load", x: 470, y: 250 }],
    ] as { n: string; x: number; y: number; gate?: boolean }[][];
    const A_WIRES = [
      { a: [0, "S3"], b: [1, "Drift"] },
      { a: [1, "Issue"], b: [2, "Train"] },
      { a: [2, "Deploy"], b: [0, "Lambda"], up: true },
      { a: [2, "Deploy"], b: [3, "API"] },
    ] as { a: [number, string]; b: [number, string]; up?: boolean }[];
    const A_CAP = archTeaser.archDeck.map((p) => ({
      k: p.kicker,
      n: p.name,
      s: p.sentence,
    }));
    const A_C30 = Math.cos(Math.PI / 6);
    const aIso = (x: number, y: number, z = 0): [number, number] => [
      (x - y) * A_C30,
      (x + y) * 0.5 - z,
    ];
    const aFp = (p: [number, number]) => p[0].toFixed(1) + "," + p[1].toFixed(1);
    const A_PW = 520,
      A_PD = 300;
    type Sheet = { svg: string; pts: Record<string, { top: [number, number]; base: [number, number] }> };
    function aSheet(pl: (typeof A_PLANES)[number], parts: (typeof A_PARTS)[number]): Sheet {
      const hw = A_PW / 2,
        hd = A_PD / 2,
        T = 10,
        pts: Sheet["pts"] = {},
        g = pl.ghost,
        dash = g ? ' stroke-dasharray="5 5"' : "",
        op = g ? ' fill-opacity=".4"' : "";
      const c = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map((q) => aIso(q[0], q[1]));
      const dn = (p: [number, number]): [number, number] => [p[0], p[1] + T];
      let s =
        '<polygon points="' +
        [c[1], c[2], dn(c[2]), dn(c[1])].map(aFp).join(" ") +
        '" fill="' + pl.fill + '" stroke="#0a0a0a" stroke-width="1"' + dash + op + ' style="filter:brightness(.92)"/>';
      s +=
        '<polygon points="' +
        [c[2], c[3], dn(c[3]), dn(c[2])].map(aFp).join(" ") +
        '" fill="' + pl.fill + '" stroke="#0a0a0a" stroke-width="1"' + dash + op + ' style="filter:brightness(.85)"/>';
      s +=
        '<polygon points="' +
        c.map(aFp).join(" ") +
        '" fill="' + pl.fill + '" stroke="#0a0a0a" stroke-width="1"' + dash + (g ? ' fill-opacity=".5"' : "") + "/>";
      parts.forEach((pt) => {
        const bx = (pt.x * A_PW) / 560 - hw,
          by = (pt.y * A_PD) / 320 - hd,
          bw = 60,
          bh = pt.gate ? 18 : 32;
        const sq = [[0, 0], [bw, 0], [bw, bw], [0, bw]];
        const top = sq.map((q) => aIso(bx + q[0] - bw / 2, by + q[1] - bw / 2, bh));
        const base = sq.map((q) => aIso(bx + q[0] - bw / 2, by + q[1] - bw / 2, 0));
        const fc = g ? "rgba(255,255,255,.55)" : "#fff",
          pd = g ? ' stroke-dasharray="3 3"' : "";
        s +=
          '<polygon points="' + [top[1], top[2], base[2], base[1]].map(aFp).join(" ") +
          '" fill="' + fc + '" stroke="#0a0a0a" stroke-width=".9"' + pd + ' style="filter:brightness(.94)"/>';
        s +=
          '<polygon points="' + [top[2], top[3], base[3], base[2]].map(aFp).join(" ") +
          '" fill="' + fc + '" stroke="#0a0a0a" stroke-width=".9"' + pd + ' style="filter:brightness(.86)"/>';
        s +=
          '<polygon points="' + top.map(aFp).join(" ") +
          '" fill="' + fc + '" stroke="#0a0a0a" stroke-width=".9"' + pd + "/>";
        pts[pt.n] = { top: aIso(bx, by, bh), base: aIso(bx, by, 0) };
      });
      return { svg: s, pts };
    }
    const archStage = $("#archStage") as HTMLElement;
    const archSvg = $("#archSvg") as SVGSVGElement | null;
    const archCap = archStage ? archStage.querySelector(".cy-cap") : null;
    const A_PORTRAIT = window.matchMedia("(max-width:700px)");
    let archP: { sh: Sheet }[] = [],
      archEls: SVGGElement[] = [],
      archWg: SVGGElement | null = null,
      archBaseY: number[] = [],
      archC: { cx: number; cy: number; k: number; sep: number; pull: number; lift: number; W: number; H: number } | null = null,
      archBuiltFor = "",
      archCurText = -1;
    function archBuild() {
      if (!archSvg) return;
      const key = A_PORTRAIT.matches ? "p" : "l";
      if (key === archBuiltFor) return;
      archBuiltFor = key;
      archC =
        key === "p"
          ? { cx: 195, cy: 250, k: 0.3, sep: 135, pull: 10, lift: 8, W: 390, H: 760 }
          : { cx: 486, cy: 452, k: 0.56, sep: 162, pull: 30, lift: 14, W: 1440, H: 816 };
      archSvg.setAttribute("viewBox", "0 0 " + archC.W + " " + archC.H);
      archP = A_PLANES.map((pl, n) => ({ sh: aSheet(pl, A_PARTS[n]) }));
      archBaseY = A_PLANES.map((_, n) => archC!.cy + (n - 1.5) * archC!.sep * archC!.k);
      let svg = "";
      for (let n = 3; n >= 0; n--)
        svg += '<g class="dk-pl" data-i="' + n + '" opacity="0">' + archP[n].sh.svg + "</g>";
      svg += '<g class="dk-wires"></g>';
      archSvg.innerHTML = svg;
      archEls = [];
      archSvg.querySelectorAll(".dk-pl").forEach((g) => {
        archEls[+(g as HTMLElement).dataset.i!] = g as unknown as SVGGElement;
      });
      archWg = archSvg.querySelector(".dk-wires");
      archCurText = -1;
    }
    const aAt = (T: { X: number; Y: number; s: number }[], pi: number, part: string, key: "top" | "base"): [number, number] => {
      const lp = archP[pi].sh.pts[part][key];
      return [T[pi].X + T[pi].s * lp[0], T[pi].Y + T[pi].s * lp[1]];
    };
    function aWire(A: [number, number], B: [number, number], ochre: boolean, o: number) {
      const col = ochre ? "#96600a" : "#0a0a0a",
        dir = Math.atan2(B[1] - A[1], B[0] - A[0]),
        w = ochre ? 2.4 : 1.5,
        ah = ochre ? 11 : 8;
      return (
        '<g opacity="' + o.toFixed(3) + '">' +
        '<path d="M' + A[0].toFixed(1) + " " + A[1].toFixed(1) + " L" + B[0].toFixed(1) + " " + B[1].toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="' + w + '"/>' +
        '<path d="M' + (B[0] - ah * Math.cos(dir - 0.5)).toFixed(1) + " " + (B[1] - ah * Math.sin(dir - 0.5)).toFixed(1) + " L" + B[0].toFixed(1) + " " + B[1].toFixed(1) + " L" + (B[0] - ah * Math.cos(dir + 0.5)).toFixed(1) + " " + (B[1] - ah * Math.sin(dir + 0.5)).toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="' + A[0].toFixed(1) + '" cy="' + A[1].toFixed(1) + '" r="3.4" fill="' + col + '"/></g>'
      );
    }
    function aSetText(idx: number) {
      if (!archCap) return;
      (archCap.querySelector(".cy-k") as HTMLElement).textContent = A_CAP[idx].k;
      (archCap.querySelector(".cy-n") as HTMLElement).textContent = A_CAP[idx].n;
      (archCap.querySelector(".cy-s") as HTMLElement).textContent = A_CAP[idx].s;
      archCap.querySelectorAll(".cy-dots b").forEach((b) =>
        b.classList.toggle("on", +(b as HTMLElement).dataset.i! === idx),
      );
    }
    function renderArch(p: number) {
      if (!archWg || !archC) return;
      const base = Math.floor(p),
        frac = p - base,
        pf = ((base % 4) + 4) % 4,
        pt = (((base + 1) % 4) + 4) % 4,
        T: { X: number; Y: number; s: number }[] = [];
      for (let n = 0; n < 4; n++) {
        const w = (n === pf ? 1 : 0) * (1 - frac) + (n === pt ? 1 : 0) * frac;
        const s = archC.k * (1 + 0.1 * w),
          X = archC.cx + archC.pull * w,
          Y = archBaseY[n] - archC.lift * w;
        T.push({ X, Y, s });
        archEls[n].setAttribute("transform", "translate(" + X.toFixed(1) + "," + Y.toFixed(1) + ") scale(" + s.toFixed(3) + ")");
        archEls[n].setAttribute("opacity", (0.28 + 0.72 * w).toFixed(3));
      }
      let ws = "";
      A_WIRES.forEach((wr) => {
        const A = aAt(T, wr.a[0], wr.a[1], wr.up ? "top" : "base"),
          B = aAt(T, wr.b[0], wr.b[1], wr.up ? "base" : "top");
        const tf = wr.a[0] === pf || wr.b[0] === pf ? 1 : 0.12,
          tt = wr.a[0] === pt || wr.b[0] === pt ? 1 : 0.12;
        const w = tf + (tt - tf) * frac;
        ws += aWire(A, B, wr.up || w > 0.5, 0.12 + 0.88 * w);
      });
      archWg.innerHTML = ws;
      const showIdx = frac < 0.5 ? pf : pt;
      if (showIdx !== archCurText) {
        aSetText(showIdx);
        archCurText = showIdx;
      }
      const txt = archCap && (archCap.querySelector(".cy-txt") as HTMLElement);
      if (txt) {
        const op = Math.abs(2 * frac - 1),
          sign = frac < 0.5 ? -1 : 1;
        txt.style.opacity = op.toFixed(3);
        txt.style.transform = "translateY(" + (sign * (1 - op) * 10).toFixed(1) + "px)";
      }
    }
    let aP = 0,
      aFrom = 0,
      aTo = 0,
      aPhase = "hold",
      aPhaseEl = 0,
      aLastNow = 0,
      aStarted = false;
    const A_DT = 950,
      A_DH = 1500;
    const aArrow = (dir: number) => {
      aFrom = aP;
      aTo = Math.round(aP) + dir;
      aPhase = "trans";
      aPhaseEl = 0;
    };
    function applyArch12() {
      if (!archWg) return;
      const now = performance.now();
      let dt = now - aLastNow;
      aLastNow = now;
      if (sectionProgress(sceneLayer) <= 0.1) return;
      if (!aStarted) {
        aStarted = true;
        renderArch(0);
        if (reduce) return;
        aPhase = "hold";
        aPhaseEl = 0;
      }
      if (reduce) return;
      if (dt < 0 || dt > 120) dt = 16;
      aPhaseEl += dt;
      if (aPhase === "hold") {
        if (aPhaseEl >= A_DH) {
          aFrom = aP;
          aTo = Math.round(aP) + 1;
          aPhase = "trans";
          aPhaseEl = 0;
        }
      } else {
        const t = aPhaseEl / A_DT;
        if (t >= 1) {
          aP = aTo;
          aPhase = "hold";
          aPhaseEl = 0;
        } else {
          const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          aP = aFrom + (aTo - aFrom) * e;
        }
      }
      renderArch(aP);
    }

    /* ================= §4 journey ================= */
    const jLinkWrap = $("#jLinkWrap") as HTMLElement;
    const jPath = $("#jPath") as SVGPathElement;
    const jDots = [...root.querySelectorAll<SVGCircleElement>(".j-dot")];
    const jEntries = [...root.querySelectorAll<HTMLElement>(".j-entry")];
    const jRings = [...root.querySelectorAll<SVGCircleElement>(".j-ring")];
    const jComet = $("#jComet") as SVGPathElement;
    const jHalo = $("#jHalo") as SVGCircleElement;
    const jHead = $("#jHead") as SVGCircleElement;
    let cometTail = 0;
    const LX = 250,
      RX = 450;
    const jLabelEls: HTMLElement[] = [...jEntries, jLinkWrap];
    const jNodesWide = [
      { x: 350, y: 24, side: "left" },
      { x: RX, y: 139, side: "right" },
      { x: LX, y: 254, side: "left" },
      { x: RX, y: 369, side: "right" },
    ];
    const MXa = 76,
      MXb = 44;
    const jNodesPhone = [
      { x: MXa, y: 40, side: "right" },
      { x: MXb, y: 196, side: "right" },
      { x: MXa, y: 352, side: "right" },
      { x: MXb, y: 468, side: "right" },
    ];
    let jNodes = jNodesWide,
      VBW = 700,
      VBH = 404;
    const jFr = [0, 0, 0, 0];
    let pathLen = 0;
    const jLensPath = $("#jLensPath") as SVGPathElement;
    const jLensCircle = $("#jLensCircle") as SVGCircleElement;
    const jLensHole = $("#jLensHole") as SVGCircleElement;
    function layoutPath() {
      const phone = window.matchMedia("(max-width:700px)").matches;
      jNodes = phone ? jNodesPhone : jNodesWide;
      VBW = phone ? 360 : 700;
      VBH = phone ? 540 : 404;
      const vbBox = phone ? 540 : 420;
      const lblOff = phone ? 14 : 22;
      jPath.ownerSVGElement!.setAttribute("viewBox", "0 0 " + VBW + " " + vbBox);
      let d = "M " + jNodes[0].x + " " + jNodes[0].y;
      for (let i = 1; i < jNodes.length; i++) {
        const a = jNodes[i - 1],
          b = jNodes[i],
          m = (b.y - a.y) * 0.5;
        d += " C " + a.x + " " + (a.y + m) + ", " + b.x + " " + (b.y - m) + ", " + b.x + " " + b.y;
      }
      jPath.setAttribute("d", d);
      jLensPath.setAttribute("d", d);
      pathLen = jPath.getTotalLength();
      jPath.style.strokeDasharray = String(pathLen);
      jPath.style.strokeDashoffset = String(pathLen);
      const N = 400,
        samp: DOMPoint[] = [];
      for (let k = 0; k <= N; k++) samp.push(jPath.getPointAtLength((pathLen * k) / N));
      const fracNear = (x: number, y: number) => {
        let bi = 0,
          bd = 1e9;
        for (let k = 0; k <= N; k++) {
          const dx = samp[k].x - x,
            dy = samp[k].y - y,
            dd = dx * dx + dy * dy;
          if (dd < bd) {
            bd = dd;
            bi = k;
          }
        }
        return bi / N;
      };
      jNodes.forEach((n, i) => {
        jFr[i] = fracNear(n.x, n.y);
        jDots[i].setAttribute("cx", String(n.x));
        jDots[i].setAttribute("cy", String(n.y));
        if (jRings[i]) {
          jRings[i].setAttribute("cx", String(n.x));
          jRings[i].setAttribute("cy", String(n.y));
        }
        const e = jLabelEls[i],
          xPct = (n.x / VBW) * 100,
          yPct = (n.y / VBH) * 100,
          onLeft = n.side === "left";
        e.classList.toggle("on-left", onLeft);
        e.classList.toggle("on-right", !onLeft);
        e.style.top = "calc(" + yPct + "% - 12px)";
        if (onLeft) {
          e.style.right = "calc(" + (100 - xPct) + "% + " + lblOff + "px)";
          e.style.left = "auto";
        } else {
          e.style.left = "calc(" + xPct + "% + " + lblOff + "px)";
          e.style.right = "auto";
        }
      });
      if (jComet) {
        cometTail = Math.max(60, pathLen * 0.14);
        jComet.setAttribute("d", d);
        jComet.style.strokeDasharray = cometTail + " " + pathLen;
      }
    }

    const jDotBaseR = jDots.map((d) => parseFloat(d.getAttribute("r") || "") || 5.5);
    const LENS_R = 52,
      LENS_S = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hover-scale")) || 1.08;
    const jScale = jLabelEls.map(() => 0);
    let focusTarget = 0,
      focusCur = 0,
      lensOn = 0,
      hoverIdx = -1,
      offTimer: ReturnType<typeof setTimeout> | null = null;
    const fineHover = window.matchMedia("(hover:hover) and (pointer:fine)");
    const jEnter: ((e: Event) => void)[] = [];
    const jLeave: ((e: Event) => void)[] = [];
    if (!reduce) {
      jLabelEls.forEach((el, i) => {
        const enter = () => {
          if (!fineHover.matches) return;
          if (parseFloat(el.style.opacity || "0") <= 0.6) return;
          if (offTimer) clearTimeout(offTimer);
          if (lensOn < 0.05) focusCur = jFr[i];
          hoverIdx = i;
          focusTarget = jFr[i];
        };
        const leave = () => {
          if (offTimer) clearTimeout(offTimer);
          offTimer = setTimeout(() => {
            hoverIdx = -1;
          }, 90);
        };
        jEnter[i] = enter;
        jLeave[i] = leave;
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    }
    function updateMagnifier() {
      if (reduce || !pathLen || !jLensPath) return;
      lensOn += ((hoverIdx >= 0 ? 1 : 0) - lensOn) * 0.18;
      focusCur += (focusTarget - focusCur) * 0.3;
      jLabelEls.forEach((e, i) => {
        jScale[i] += ((i === hoverIdx ? 1 : 0) - jScale[i]) * 0.18;
        const s = 1 + (LENS_S - 1) * jScale[i];
        e.style.scale = jScale[i] < 0.001 ? "" : s.toFixed(3);
        jDots[i].setAttribute("r", (jDotBaseR[i] * s).toFixed(2));
        e.classList.toggle("hot", i === hoverIdx);
        jDots[i].classList.toggle("hot", i === hoverIdx);
      });
      if (lensOn < 0.01) {
        for (const el of [jLensCircle, jLensHole]) el.setAttribute("r", "0");
        return;
      }
      const pt = jPath.getPointAtLength(Math.max(0, Math.min(1, focusCur)) * pathLen);
      const fx = +pt.x.toFixed(1),
        fy = +pt.y.toFixed(1),
        r = (LENS_R * lensOn).toFixed(1);
      for (const el of [jLensCircle, jLensHole]) {
        el.setAttribute("cx", String(fx));
        el.setAttribute("cy", String(fy));
        el.setAttribute("r", r);
      }
    }
    function applyJourney() {
      jPath.style.strokeDashoffset = "0";
      const rP = reduce ? 1 : clamp((sectionProgress(journeyLayer) - 0.06) / 0.66, 0, 1);
      for (let i = 0; i < jFr.length; i++) {
        const s = i * 0.12;
        jDots[i].style.opacity = String(reduce ? 1 : clamp((rP - s) / 0.15, 0, 1));
        setReveal(jLabelEls[i], reduce ? 1 : clamp((rP - (s + 0.03)) / 0.22, 0, 1));
      }
    }
    const CM_LAP = 5600,
      CM_WIN = 0.12;
    function applyJourneyPulse() {
      if (reduce || !pathLen || !jComet) return;
      const r = journeyLayer.getBoundingClientRect(),
        vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) {
        jComet.style.opacity = "0";
        jHalo.setAttribute("opacity", "0");
        jHead.setAttribute("opacity", "0");
        for (const rg of jRings) rg.setAttribute("opacity", "0");
        return;
      }
      const vis = clamp((vh * 0.85 - r.top) / (vh * 0.7), 0, 1);
      const ph = (performance.now() / CM_LAP) % 1,
        s = ph * pathLen;
      jComet.style.strokeDashoffset = String((cometTail - s).toFixed(1));
      const fade = Math.min(1, ph / 0.06, (1 - ph) / 0.06) * vis;
      jComet.style.opacity = (0.85 * fade).toFixed(3);
      const pt = jPath.getPointAtLength(s);
      jHalo.setAttribute("cx", pt.x.toFixed(1));
      jHalo.setAttribute("cy", pt.y.toFixed(1));
      jHalo.setAttribute("opacity", (0.18 * fade).toFixed(3));
      jHead.setAttribute("cx", pt.x.toFixed(1));
      jHead.setAttribute("cy", pt.y.toFixed(1));
      jHead.setAttribute("opacity", fade.toFixed(3));
      for (let i = 0; i < jRings.length; i++) {
        const since = (((ph - jFr[i]) % 1) + 1) % 1;
        const raw = since < CM_WIN ? 1 - since / CM_WIN : 0;
        jRings[i].setAttribute("r", (jDotBaseR[i] + (1 - raw) * 15).toFixed(2));
        jRings[i].setAttribute("opacity", (raw * vis * 0.5).toFixed(3));
      }
    }

    /* ================= §5 skills living wash ================= */
    function closedSpline(p: [number, number][]) {
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
    const SK_PORTRAIT = window.matchMedia("(max-aspect-ratio:9/10)");
    const skOrigD = new Map<SVGPathElement, string>();
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
    let skMorph: { key: string; items: MorphItem[] } | null = null,
      skLast = 0;
    const SK_TAU = 84;
    function skMorphBuild() {
      const key = SK_PORTRAIT.matches ? "tall" : "wide";
      const wash = root!.querySelector(key === "tall" ? ".wash-tall" : ".wash-wide");
      skMorph = null;
      if (!wash) return;
      const N = 56;
      const items = [...wash.querySelectorAll<SVGPathElement>(".b-g .blob")]
        .map((el, i): MorphItem | null => {
          if (!skOrigD.has(el)) skOrigD.set(el, el.getAttribute("d")!);
          else el.setAttribute("d", skOrigD.get(el)!);
          let len = 0;
          try {
            len = el.getTotalLength();
          } catch {
            len = 0;
          }
          if (!len) return null;
          const pts: [number, number][] = [];
          for (let k = 0; k < N; k++) {
            const pt = el.getPointAtLength((len * k) / N);
            pts.push([pt.x, pt.y]);
          }
          const cx = pts.reduce((s, p) => s + p[0], 0) / N,
            cy = pts.reduce((s, p) => s + p[1], 0) / N;
          const polar = pts.map((p) => ({
            ang: Math.atan2(p[1] - cy, p[0] - cx),
            r: Math.hypot(p[0] - cx, p[1] - cy),
          }));
          return {
            el,
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
      skMorph = { key, items };
    }
    function applySkillsMorph() {
      if (reduce) return;
      const r = skillsLayer.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const key = SK_PORTRAIT.matches ? "tall" : "wide";
      if (!skMorph || skMorph.key !== key) skMorphBuild();
      if (!skMorph) return;
      const now = performance.now();
      const dt = skLast ? Math.min(now - skLast, 50) : 0;
      skLast = now;
      const ease = 1 - Math.exp(-dt / SK_TAU);
      for (const it of skMorph.items) {
        const g = it.el.closest(".b-g");
        const held = !!g && (g.classList.contains("lit") || g.matches(":hover"));
        it.rate += ((held ? 0 : 1) - it.rate) * ease;
        if (it.rate < 0.0005) {
          it.rate = 0;
          continue;
        }
        it.t += dt * it.rate;
        const t = it.t;
        const breath = 1 + it.bAmp * Math.sin(t * it.bSpd + it.bPh);
        const pts = it.polar.map((pp): [number, number] => {
          const wob = 1 + it.amp * (0.7 * Math.sin(t * 0.0012 + it.ph + pp.ang * 3) + 0.3 * Math.sin(t * 0.0018 - it.ph + pp.ang * 2));
          const rr = pp.r * wob * breath;
          return [it.cx + Math.cos(pp.ang) * rr, it.cy + Math.sin(pp.ang) * rr];
        });
        it.el.setAttribute("d", closedSpline(pts));
      }
    }
    const washShapes = [...root.querySelectorAll<HTMLElement>(".wash .b-g")];
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const target = e.target as Element;
      const g = target.closest && (target.closest(".wash .b-g") as HTMLElement | null);
      const hit = g && !g.querySelector(".wash-link") ? g : null;
      for (const x of washShapes) if (x !== hit) x.classList.remove("lit");
      if (hit) hit.classList.toggle("lit");
    };
    document.addEventListener("pointerup", onPointerUp);
    function sizeSkillsLink() {
      const px = Math.max(17, Math.min(20, 0.017 * window.innerWidth));
      root!.querySelectorAll<SVGSVGElement>(".wash").forEach((wash) => {
        const txt = wash.querySelector(".wash-link text");
        if (!txt) return;
        const vb = wash.viewBox.baseVal,
          rect = wash.getBoundingClientRect();
        if (!rect.width || !rect.height || !vb.width) return;
        const scale = Math.min(rect.width / vb.width, rect.height / vb.height);
        txt.setAttribute("font-size", (px / scale).toFixed(2));
      });
    }

    /* ================= reveals ================= */
    const easeOut = (sp: number) => (sp <= 0 ? 0 : sp >= 1 ? 1 : 1 - Math.pow(1 - sp, 3));
    const REV_SPAN = 0.4,
      REV_HEADROOM = 0.06;
    const MAX_STAGGER = [...root.querySelectorAll<HTMLElement>("[data-stagger]")].reduce(
      (m, el) => Math.max(m, parseFloat(el.dataset.stagger || "0") || 0),
      0,
    );
    const REV_STEP = Math.min(0.1, MAX_STAGGER ? (1 - REV_SPAN - REV_HEADROOM) / MAX_STAGGER : 0.1);
    function sectionProgress(sec: HTMLElement) {
      const r = sec.getBoundingClientRect(),
        vh = window.innerHeight;
      return clamp((vh * 0.85 - r.top) / (vh * 0.7), 0, 1);
    }
    function revealProgress(el: HTMLElement) {
      const sec = el.closest(".sec") as HTMLElement | null;
      if (!sec) return 1;
      const st = parseFloat(el.dataset.stagger || "0");
      return clamp((sectionProgress(sec) - st * REV_STEP) / REV_SPAN, 0, 1);
    }
    function setReveal(el: HTMLElement, sp: number) {
      el.style.opacity = String(sp);
      el.style.transform = reduce ? "none" : sp > 0.999 ? "" : "translate3d(0," + (1 - sp) * 16 + "px,0)";
    }
    const revealEls = [...root.querySelectorAll<HTMLElement>(".reveal")];
    const washGs = [...root.querySelectorAll<HTMLElement>(".wash .b-g,.wash .b-shared")];
    function applyReveals() {
      for (const el of revealEls) setReveal(el, reduce ? 1 : easeOut(revealProgress(el)));
      for (const el of washGs) {
        const sp = reduce ? 1 : easeOut(revealProgress(el));
        el.style.opacity = String(sp);
        el.style.transform = reduce ? "none" : sp > 0.999 ? "" : "scale(" + (0.965 + 0.035 * sp) + ")";
      }
    }

    /* ================= §2 bars ================= */
    let barsLive = false;
    function applyBars() {
      const v = sectionProgress(panelLayer);
      if (!barsLive && v > 0.55) {
        barsLive = true;
        root!.classList.add("bars-live");
      } else if (barsLive && v < 0.25) {
        barsLive = false;
        root!.classList.remove("bars-live");
      }
    }

    /* ================= chrome ================= */
    const demoArrowWrap = $("#demoArrowWrap") as HTMLElement;
    const sceneCue = $("#sceneCue") as HTMLElement;
    const journeyCue = $("#journeyCue") as HTMLElement;
    const skillsCue = $("#skillsCue") as HTMLElement;
    const setCue = (el: HTMLElement, o: number) => {
      el.style.opacity = String(o);
      el.style.pointerEvents = o > 0.5 ? "auto" : "none";
    };
    const SECS = [
      { el: heroLayer, label: "", ground: "#ffffff", cue: null as HTMLElement | null },
      { el: panelLayer, label: home.demo.sectionIndicator, ground: "#ffffff", cue: demoArrowWrap },
      { el: sceneLayer, label: archTeaser.sectionIndicator, ground: "var(--wash-sage)", cue: sceneCue },
      { el: journeyLayer, label: journeyTeaser.sectionIndicator, ground: "var(--wash-ochre)", cue: journeyCue },
      { el: skillsLayer, label: skillsTeaser.sectionIndicator, ground: "var(--wash-rose)", cue: skillsCue },
      { el: afterLayer, label: bookend.sectionIndicator, ground: "#ffffff", cue: null },
    ];
    const secBg = SECS.map((s) => getComputedStyle(s.el).getPropertyValue("--sec-bg").trim());
    let secNow = -1;
    function applyChrome() {
      const mid = window.innerHeight / 2;
      let i = 0;
      for (let k = SECS.length - 1; k >= 0; k--) {
        if (SECS[k].el.getBoundingClientRect().top <= mid) {
          i = k;
          break;
        }
      }
      if (i !== secNow) {
        secNow = i;
        const s = SECS[i];
        indicator.textContent = s.label;
        indicator.style.opacity = s.label ? "1" : "0";
        document.documentElement.style.setProperty("--ground", s.ground);
        SECS.forEach((x, k) => {
          if (x.cue) setCue(x.cue, k === i ? 1 : 0);
        });
      }
      const hh = heroLayer.offsetHeight || 1;
      const mB = reduce
        ? window.scrollY > hh * 0.5 ? 1 : 0
        : clamp((window.scrollY - hh * 0.35) / (hh * 0.3), 0, 1);
      menuBtn.style.opacity = String(mB);
      menuBtn.style.visibility = mB <= 0 ? "hidden" : "visible";
    }

    /* ================= edge blur ================= */
    const edgeTop = $("#edgeTop") as HTMLElement;
    const edgeBot = $("#edgeBot") as HTMLElement;
    function edgeStrength() {
      let d = Infinity;
      for (const s of SECS) d = Math.min(d, Math.abs(s.el.getBoundingClientRect().top));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.min(clamp(d / 140, 0, 1), max <= 0 ? 0 : clamp((max - window.scrollY) / 140, 0, 1));
    }
    const MERGE = () => clamp(window.innerHeight * 0.11, 72, 132);
    const mix = (a: string, b: string, p: number) =>
      "color-mix(in oklab," + a + "," + b + " " + Math.round(p * 100) + "%)";
    function edgeGround(y: number) {
      let i = 0,
        top = 0;
      for (let k = SECS.length - 1; k >= 0; k--) {
        const t = SECS[k].el.getBoundingClientRect().top;
        if (t <= y) {
          i = k;
          top = t;
          break;
        }
      }
      const m = MERGE();
      if (i > 0 && y - top < m) return mix(secBg[i - 1], secBg[i], 0.5 + (y - top) / (2 * m));
      if (i < SECS.length - 1) {
        const nx = SECS[i + 1].el.getBoundingClientRect().top;
        if (nx - y < m) return mix(secBg[i], secBg[i + 1], 0.5 - (nx - y) / (2 * m));
      }
      return secBg[i];
    }
    let eNow = "",
      wT = "",
      wB = "";
    function applyEdges() {
      const e = String(reduce ? 0 : edgeStrength());
      if (e !== eNow) {
        eNow = e;
        edgeTop.style.opacity = edgeBot.style.opacity = e;
        const v = e === "0" ? "hidden" : "visible";
        edgeTop.style.visibility = edgeBot.style.visibility = v;
      }
      const gt = edgeGround(55),
        gb = edgeGround(window.innerHeight - 65);
      if (gt !== wT) edgeTop.style.setProperty("--wash", (wT = gt));
      if (gb !== wB) edgeBot.style.setProperty("--wash", (wB = gb));
    }

    /* ================= boot + frame loop ================= */
    archBuild();
    layoutPath();
    sizeSkillsLink();
    const aPrev = archStage?.querySelector(".cy-arrow.prev");
    const aNext = archStage?.querySelector(".cy-arrow.next");
    const onPrev = () => aArrow(-1);
    const onNext = () => aArrow(1);
    aPrev?.addEventListener("click", onPrev);
    aNext?.addEventListener("click", onNext);

    const onResize = () => {
      archBuild();
      layoutPath();
      sizeSkillsLink();
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const frame = () => {
      applyReveals();
      applyArch12();
      applySkillsMorph();
      applyJourney();
      applyJourneyPulse();
      applyBars();
      applyChrome();
      applyEdges();
      updateMagnifier();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    /* ================= cues + deep-link + menu ================= */
    const goTo = (el: HTMLElement) =>
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    const arrowBtn = $("#arrowBtn") as HTMLElement;
    const demoArrow = $("#demoArrow") as HTMLElement;
    const cueGo: { el: HTMLElement | null; to: HTMLElement }[] = [
      { el: arrowBtn, to: panelLayer },
      { el: demoArrow, to: sceneLayer },
      { el: sceneCue.querySelector(".arrow-btn"), to: journeyLayer },
      { el: journeyCue.querySelector(".arrow-btn"), to: skillsLayer },
      { el: skillsCue.querySelector(".arrow-btn"), to: afterLayer },
    ];
    const cueHandlers = cueGo.map(({ el, to }) => {
      const h = () => goTo(to);
      el?.addEventListener("click", h);
      return { el, h };
    });
    if (location.hash === "#contact") afterLayer.scrollIntoView({ block: "start" });

    const menuPanel = $("#menuPanel") as HTMLElement;
    const mScrim = $("#mScrim") as HTMLElement;
    const mClose = $("#mClose") as HTMLElement;
    const setMenu = (open: boolean) => {
      menuPanel.classList.toggle("open", open);
      mScrim.classList.toggle("open", open);
      menuPanel.setAttribute("aria-hidden", String(!open));
      menuBtn.setAttribute("aria-expanded", String(open));
      (open ? mClose : menuBtn).focus();
    };
    const openMenu = () => setMenu(true);
    const closeMenu = () => setMenu(false);
    menuBtn.addEventListener("click", openMenu);
    mClose.addEventListener("click", closeMenu);
    mScrim.addEventListener("click", closeMenu);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuPanel.classList.contains("open")) setMenu(false);
    };
    document.addEventListener("keydown", onKey);
    const mHome = $("#mHome") as HTMLElement;
    const mContact = $("#mContact") as HTMLElement;
    const onHome = (e: Event) => {
      e.preventDefault();
      setMenu(false);
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    };
    const onContact = (e: Event) => {
      e.preventDefault();
      setMenu(false);
      goTo(afterLayer);
    };
    mHome?.addEventListener("click", onHome);
    mContact?.addEventListener("click", onContact);

    /* ================= bookend: copy email ================= */
    const bMail = $("#bMail") as HTMLElement;
    const emailCopied = $("#emailCopied") as HTMLElement;
    let copyTimer: ReturnType<typeof setTimeout>;
    const onMail = async () => {
      try {
        await navigator.clipboard.writeText(site.contact.email);
      } catch {}
      emailCopied.style.opacity = "1";
      copyTimer = setTimeout(() => {
        emailCopied.style.opacity = "0";
      }, 1600);
    };
    bMail?.addEventListener("click", onMail);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("keydown", onKey);
      aPrev?.removeEventListener("click", onPrev);
      aNext?.removeEventListener("click", onNext);
      cueHandlers.forEach(({ el, h }) => el?.removeEventListener("click", h));
      menuBtn.removeEventListener("click", openMenu);
      mClose.removeEventListener("click", closeMenu);
      mScrim.removeEventListener("click", closeMenu);
      mHome?.removeEventListener("click", onHome);
      mContact?.removeEventListener("click", onContact);
      bMail?.removeEventListener("click", onMail);
      jLabelEls.forEach((el, i) => {
        if (jEnter[i]) el.removeEventListener("mouseenter", jEnter[i]);
        if (jLeave[i]) el.removeEventListener("mouseleave", jLeave[i]);
      });
      if (offTimer) clearTimeout(offTimer);
      clearTimeout(copyTimer);
    };
  }, []);

  const featured = journeyTeaser.featuredSlugs
    .map((slug) => journeyEntry(slug))
    .filter((e): e is NonNullable<typeof e> => !!e);

  // four menu groups: Start · The Data · The Story · More (site.nav)
  const menuGroups = [
    { label: "Start", items: [{ label: site.nav.homeLabel, href: "/", id: "mHome" }] },
    ...site.nav.groups.map((g) => ({
      label: g.label,
      items: g.items.map((it) => ({
        label: it.label,
        href: it.href,
        id: it.label === "Contact" ? "mContact" : undefined,
      })),
    })),
  ];

  return (
    <main className="home-root story" ref={rootRef}>
      <div className="topbar">
        <span className="indicator" id="indicator" aria-live="polite" />
        <button
          className="menu-btn"
          id="menuBtn"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="menuPanel"
        >
          <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M1 1h24M1 7h24M1 13h24" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="m-scrim" id="mScrim" />
      <aside className="menu-panel" id="menuPanel" aria-hidden="true" aria-label="Site menu">
        <div className="menu-head">
          <span className="micro">{site.nav.menuLabel}</span>
          <button className="m-close" id="mClose" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M2 2l16 16M18 2L2 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav>
          {menuGroups.map((g) => (
            <div className="menu-group" key={g.label}>
              <span className="menu-cat micro">{g.label}</span>
              {g.items.map((it) => (
                <a className="menu-link" href={it.href} id={it.id} key={it.label}>
                  {it.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="edge-blur top" id="edgeTop" aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className="edge-blur bot" id="edgeBot" aria-hidden="true">
        <i /><i /><i />
      </div>

      {/* §1 Hero */}
      <section className="sec hero-layer" id="heroLayer">
        <h1 className="display hero-name">{home.hero.name}</h1>
        <p className="hero-sub">{home.hero.tagline}</p>
        <div className="hero-arrow-wrap">
          <button className="arrow-btn" id="arrowBtn" aria-label={home.hero.scrollCueLabel}>
            <ArrowDown />
          </button>
        </div>
      </section>

      {/* §2 Live demo */}
      <section className="sec panel-layer" id="panelLayer">
        <div className="demo-title reveal">{home.demo.title}</div>
        <SketchDemo />
        <div className="demo-arrow-wrap" id="demoArrowWrap">
          <button className="arrow-btn" id="demoArrow" aria-label={`Continue to ${archTeaser.sectionIndicator}`}>
            <ArrowDown />
          </button>
        </div>
      </section>

      {/* §3 Behind the Scenes */}
      <section className="sec scene-layer" id="sceneLayer">
        <div className="scene-inner">
          <div className="sec-head">
            <h2 className="scene-title display reveal">{archTeaser.title}</h2>
            <p className="scene-lead reveal" data-stagger="1">{archTeaser.lede}</p>
          </div>
          <div className="arch-wrap">
            <div className="arch-stage" id="archStage">
              <svg id="archSvg" className="arch-svg" viewBox="0 0 1440 816" aria-hidden="true" />
              <div className="cy-cap">
                <div className="cy-txt">
                  <p className="cy-k" />
                  <h3 className="cy-n" />
                  <p className="cy-s" />
                </div>
                <div className="cy-dots">
                  <b data-i="0" /><b data-i="1" /><b data-i="2" /><b data-i="3" />
                </div>
                <p className="scene-link reveal" data-stagger="3">
                  <a className="link cta-strong" href={archTeaser.cta.href}>
                    {archTeaser.cta.label} →
                  </a>
                </p>
              </div>
              <button className="cy-arrow prev" type="button" aria-label="Previous plane">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <button className="cy-arrow next" type="button" aria-label="Next plane">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="next-cue" id="sceneCue">
          <button className="arrow-btn" aria-label={`Continue to ${journeyTeaser.sectionIndicator}`}>
            <ArrowDown />
          </button>
        </div>
      </section>

      {/* §4 The Journey */}
      <section className="sec journey-layer" id="journeyLayer">
        <div className="j-inner">
          <div className="sec-head">
            <h2 className="scene-title reveal">{journeyTeaser.title}</h2>
            <p className="scene-lead reveal" data-stagger="1">{journeyTeaser.lede}</p>
          </div>
          <div className="j-path-wrap">
            <svg viewBox="0 0 700 420" fill="none" aria-hidden="true">
              <defs>
                <clipPath id="jLensClip">
                  <circle id="jLensCircle" cx="0" cy="0" r="0" />
                </clipPath>
                <mask id="jLensMask" maskUnits="userSpaceOnUse">
                  <rect x="-100" y="-100" width="900" height="640" fill="#fff" />
                  <circle id="jLensHole" cx="0" cy="0" r="0" fill="#000" />
                </mask>
              </defs>
              <path className="j-path" id="jPath" d="" mask="url(#jLensMask)" />
              <path className="j-lens" id="jLensPath" d="" clipPath="url(#jLensClip)" />
              <circle className="j-ring" r="5.5" opacity="0" />
              <circle className="j-ring" r="5.5" opacity="0" />
              <circle className="j-ring" r="5.5" opacity="0" />
              <circle className="j-ring" r="5.5" opacity="0" />
              <circle className="j-dot" r="5.5" />
              <circle className="j-dot" r="5.5" />
              <circle className="j-dot" r="5.5" />
              <circle className="j-dot" r="5.5" />
              <path className="j-comet" id="jComet" d="" />
              <circle className="j-halo" id="jHalo" r="9" opacity="0" />
              <circle className="j-halo" id="jHead" r="3.6" opacity="0" />
            </svg>
            {featured.map((e) => (
              <div className="j-entry" key={e.slug}>
                <div className="d">{fmtDate(e.date)} · {e.phaseKey}</div>
                <h4>{e.title}</h4>
                <p>{e.summary}</p>
              </div>
            ))}
            <p className="scene-link j-cta j-cta-wrap" id="jLinkWrap">
              <a className="link cta-strong" href={journeyTeaser.cta.href}>
                {journeyTeaser.cta.label} →
              </a>
            </p>
          </div>
        </div>
        <div className="next-cue" id="journeyCue">
          <button className="arrow-btn" aria-label={`Continue to ${skillsTeaser.sectionIndicator}`}>
            <ArrowDown />
          </button>
        </div>
      </section>

      {/* §5 Skills */}
      <section className="sec skills-layer" id="skillsLayer">
        <div className="s-inner">
          <div className="sec-head">
            <h2 className="scene-title reveal">{skillsTeaser.title}</h2>
            <p className="scene-lead reveal" data-stagger="1">{skillsTeaser.lede}</p>
          </div>
          <div className="wash-wrap" dangerouslySetInnerHTML={{ __html: WASH_MARKUP }} />
        </div>
        <div className="next-cue" id="skillsCue">
          <button className="arrow-btn" aria-label={`Continue to ${bookend.sectionIndicator}`}>
            <ArrowDown />
          </button>
        </div>
      </section>

      {/* §6 Contact bookend */}
      <section className="sec after" id="afterLayer">
        <h2 className="display">{bookend.title}</h2>
        <div className="b-foot">
          <a href={site.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 20 4.8 4.9 4.9 0 0 0 19.9 1S18.7.6 16 2.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A4.9 4.9 0 0 0 5 4.8a5.2 5.2 0 0 0-1.4 3.7c0 5.2 3.2 6.4 6.2 6.7A3.4 3.4 0 0 0 9 17.8V22" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="2" width="20" height="20" rx="2.5" /><path d="M7 10v7M7 6.5v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <button id="bMail" aria-label="Copy email address">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="M3 6l9 7 9-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className="copied" id="emailCopied">{bookend.copiedLabel}</div>
        <a className="link or-link" href={bookend.aboutLink.href}>
          {bookend.aboutLink.label} →
        </a>
      </section>
    </main>
  );
}
