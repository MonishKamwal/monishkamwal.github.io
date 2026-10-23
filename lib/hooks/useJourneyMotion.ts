"use client";

import { RefObject, useEffect } from "react";
import { clamp } from "@/lib/story/motion";
import { buildRoad, type JourneyGroup, type RoadGate, type RoadNode } from "@/lib/story/journeyRoad";

export type JourneyRefs = {
  root: RefObject<HTMLElement | null>; // holds the [data-stop] reading blocks
  svg: RefObject<SVGSVGElement | null>; // the #jMap diagram
};

const smooth = (v: number) => {
  v = clamp(v, 0, 1);
  return v * v * (3 - 2 * v);
};

// how close (in path-fraction) the comet must be to an entry for its ring to bloom
const RING_NEAR = 0.032;

// A camera stop, 1:1 with the reading-column blocks: a gate, an entry, or the
// final pull-back. `frac` is the stop's measured length-fraction along the road.
type Stop = { kind: "gate" | "entry" | "end"; x: number; y: number; frac: number; ni?: number; gi?: number };

// The Journey page's scroll camera. The whole diagram is one viewBox SVG; the
// camera walks a winding road past every devlog entry while a lit stroke + comet
// head stay locked to the active entry (the same eased progress selects the
// active text, so the dot lands on a node exactly as that node's text centres).
// Each milestone rings out as the head passes. Ported verbatim from
// journey-page-svg-sketches.html (build + layout + cam + setVB + apply).
export function useJourneyMotion(
  refs: JourneyRefs,
  groups: JourneyGroup[],
  reduced: boolean,
): void {
  useEffect(() => {
    const svg = refs.svg.current;
    const root = refs.root.current;
    if (!svg || !root || groups.length === 0) return;
    const svgEl = svg;

    const portMq = window.matchMedia("(max-aspect-ratio:9/10),(max-width:720px)");

    let nodes: RoadNode[] = [];
    let gates: RoadGate[] = [];
    let geomPath: SVGPathElement | null = null;
    let roadLit: SVGPathElement | null = null;
    let jHead: SVGCircleElement | null = null;
    let jHalo: SVGCircleElement | null = null;
    let pins: SVGGElement[] = [];
    let pathLen = 0;
    let stops: Stop[] = [];
    let nodeStop: Record<number, number> = {};
    let blocks: HTMLElement[] = [];
    let anchors: number[] = [];

    const pinCleanups: (() => void)[] = [];

    function build() {
      const geo = buildRoad(groups);
      nodes = geo.nodes;
      gates = geo.gates;
      svgEl.setAttribute("viewBox", `0 0 ${geo.vbw} ${geo.vbh}`);

      // pass 1 — drop the bare road in, measure each waypoint's length-fraction
      svgEl.innerHTML = `<path class="jm-road" d="${geo.d}"/>`;
      geomPath = svgEl.querySelector(".jm-road");
      pathLen = geomPath!.getTotalLength();
      const N = 720,
        samp: DOMPoint[] = [];
      for (let k = 0; k <= N; k++) samp.push(geomPath!.getPointAtLength((pathLen * k) / N));
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
      const fracAtY = (y: number) => {
        let bi = 0,
          bd = 1e9;
        for (let k = 0; k <= N; k++) {
          const dy = Math.abs(samp[k].y - y);
          if (dy < bd) {
            bd = dy;
            bi = k;
          }
        }
        return bi / N;
      };
      // snap each node/gate onto the EXACT path point at its measured fraction,
      // so the entry pin is drawn at the very spot the comet settles — pin ring,
      // dot and halo end up concentric (the ~2u sampling gap otherwise leaves the
      // dot sitting low in the ring). This path-snap is load-bearing (DESIGN.md).
      nodes.forEach((n) => {
        n.frac = fracNear(n.x, n.y);
        const p = geomPath!.getPointAtLength(n.frac * pathLen);
        n.x = p.x;
        n.y = p.y;
      });
      gates.forEach((g) => {
        g.frac = fracAtY(g.y);
        const p = geomPath!.getPointAtLength(g.frac * pathLen);
        g.x = p.x;
        g.y = p.y;
      });

      // pass 2 — assemble the full diagram now that every point is known
      let s = `<path class="jm-road" d="${geo.d}"/><path class="jm-tail" d="${geo.tailD}"/>`;
      s += `<path class="jm-roadLit" d="${geo.d}"/>`;
      nodes.forEach((n, i) => {
        s += `<g class="jm-pin" data-pin="${i}" opacity="0"><circle class="jm-pinDot" cx="${n.x}" cy="${n.y}" r="7"/></g>`;
      });
      // the travelling comet: a steady dot + a ring that blooms out of it at entries
      s += `<circle class="jm-halo" r="6" opacity="0"/><circle class="jm-head" r="4" opacity="0"/>`;
      svgEl.innerHTML = s;

      geomPath = svgEl.querySelector(".jm-road");
      roadLit = svgEl.querySelector(".jm-roadLit");
      roadLit!.style.strokeDasharray = pathLen.toFixed(2);
      roadLit!.style.strokeDashoffset = pathLen.toFixed(2);
      jHead = svgEl.querySelector(".jm-head");
      jHalo = svgEl.querySelector(".jm-halo");
      pins = [...svgEl.querySelectorAll<SVGGElement>(".jm-pin")];

      // stops, 1:1 with the flow blocks: (gate, entries…) per phase → end
      stops = [];
      let ni = 0;
      groups.forEach((g, gi) => {
        stops.push({ kind: "gate", gi, x: gates[gi].x!, y: gates[gi].y, frac: gates[gi].frac! });
        g.items.forEach(() => {
          const n = nodes[ni];
          stops.push({ kind: "entry", ni, x: n.x, y: n.y, frac: n.frac! });
          ni++;
        });
      });
      const last = nodes[nodes.length - 1];
      // centre well above the last node so the fading tail sits low in frame, near the foot
      stops.push({ kind: "end", x: last.x, y: last.y - 150, frac: 1 });
      nodeStop = {};
      stops.forEach((st, si) => {
        if (st.kind === "entry") nodeStop[st.ni!] = si;
      });

      // click a pin → scroll to its stop
      pinCleanups.forEach((fn) => fn());
      pinCleanups.length = 0;
      pins.forEach((p, k) => {
        const onClick = () => {
          const si = nodeStop[k];
          if (anchors[si] != null) window.scrollTo({ top: anchors[si], behavior: "smooth" });
        };
        p.addEventListener("click", onClick);
        pinCleanups.push(() => p.removeEventListener("click", onClick));
      });
    }

    function layout() {
      blocks = [...root!.querySelectorAll<HTMLElement>("[data-stop]")];
      const vh = window.innerHeight,
        max = document.documentElement.scrollHeight - vh;
      let prev = 0;
      anchors = blocks.map((b, i) => {
        if (i === 0) return 0;
        const top = b.getBoundingClientRect().top + window.scrollY;
        const a = clamp(top + b.offsetHeight / 2 - vh / 2, prev + 1, Math.max(prev + 1, max));
        prev = a;
        return a;
      });
    }

    function cam(stop: Stop): [number, number, number, number] {
      const r = svgEl.getBoundingClientRect(),
        AR = r.width / Math.max(1, r.height),
        port = portMq.matches;
      const H = stop.kind === "end" ? (port ? 980 : 820) : port ? 770 : 630,
        W = H * AR; // road left, reading right
      const cx = port ? stop.x : stop.x + W * 0.16;
      // the waypoint sits dead-centre vertically, so at settle the dot's horizontal
      // line runs through the gap between the active entry's title and its summary
      return [cx - W / 2, stop.y - H / 2, W, H];
    }

    function setVB(a: Stop, b: Stop, e: number) {
      const A = cam(a),
        B = cam(b);
      const W = Math.exp(Math.log(A[2]) + (Math.log(B[2]) - Math.log(A[2])) * e),
        AR = A[2] / A[3];
      const cxA = A[0] + A[2] / 2,
        cyA = A[1] + A[3] / 2,
        cxB = B[0] + B[2] / 2,
        cyB = B[1] + B[3] / 2;
      const cx = cxA + (cxB - cxA) * e,
        cy = cyA + (cyB - cyA) * e,
        H = W / AR;
      svgEl.setAttribute(
        "viewBox",
        `${(cx - W / 2).toFixed(1)} ${(cy - H / 2).toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}`,
      );
    }

    function apply() {
      if (!anchors.length || !stops.length || !roadLit || !geomPath || !jHead || !jHalo) return;
      const st = window.scrollY,
        an = anchors;
      let i = 0;
      while (i < an.length - 2 && st >= an[i + 1]) i++;
      const seg = Math.max(1, an[i + 1] - an[i]);
      const f = clamp((st - an[i]) / seg, 0, 1);
      const e = reduced ? (f < 0.5 ? 0 : 1) : smooth((f - 0.08) / 0.84);
      const prog = i + e;
      setVB(stops[i], stops[i + 1], e);

      // THE ORCHESTRATION: the comet's position along the road is the SAME progress
      // that selects the active text — mapped through each stop's measured
      // path-fraction. So the head sits exactly on a dot the instant that dot's
      // text is centred. The comet itself is gated off under reduced motion.
      const headFrac = clamp(stops[i].frac + (stops[i + 1].frac - stops[i].frac) * e, 0, 1);
      const hp = geomPath.getPointAtLength(headFrac * pathLen);
      if (reduced) {
        roadLit.style.strokeDashoffset = pathLen.toFixed(2);
        jHead.setAttribute("opacity", "0");
        jHalo.setAttribute("opacity", "0");
      } else {
        roadLit.style.strokeDashoffset = (pathLen * (1 - headFrac)).toFixed(2);
        const headOn = clamp((1.002 - headFrac) / 0.02, 0, 1);
        jHead.setAttribute("cx", hp.x.toFixed(1));
        jHead.setAttribute("cy", hp.y.toFixed(1));
        jHead.setAttribute("opacity", headOn.toFixed(3));
        // the ring blooms OUT OF the dot as it nears an entry, is at max ON the
        // entry, then shrinks back in as it leaves — by distance to the nearest
        // entry, not time
        let dNear = 1;
        for (const n of nodes) {
          const d = Math.abs(headFrac - n.frac!);
          if (d < dNear) dNear = d;
        }
        const prox = clamp(1 - dNear / RING_NEAR, 0, 1);
        jHalo.setAttribute("cx", hp.x.toFixed(1));
        jHalo.setAttribute("cy", hp.y.toFixed(1));
        jHalo.setAttribute("r", (6 + prox * 12).toFixed(2)); // 6 (into the dot) → 18 (on the entry)
        jHalo.setAttribute("opacity", (headOn * prox * 0.6).toFixed(3));
      }

      // pins reveal as the head walks past (all shown at once under reduced motion);
      // the active one hands its title to the reading column
      pins.forEach((p, k) => {
        const n = nodes[k];
        const op = reduced ? 1 : clamp((headFrac - (n.frac! - 0.05)) / 0.04, 0, 1);
        p.setAttribute("opacity", op.toFixed(3));
        p.classList.toggle("on", Math.round(prog) === nodeStop[k]);
      });

      // reading column: fade the active block in, its neighbour out (all visible
      // under reduced motion, where the text must simply show in place)
      blocks.forEach((b, j) => {
        if (reduced) {
          b.style.opacity = "";
          return;
        }
        let o: number;
        if (j === i) o = 1 - clamp((f - 0.2) / 0.3, 0, 1);
        else if (j === i + 1) o = clamp((f - 0.5) / 0.3, 0, 1);
        else o = 0;
        if (i === an.length - 2 && j === an.length - 1) o = 1; // hold the end card
        b.style.opacity = o.toFixed(3);
      });
    }

    build();
    layout();
    let raf = requestAnimationFrame(function loop() {
      apply();
      raf = requestAnimationFrame(loop);
    });
    const onResize = () => {
      build();
      layout();
    };
    window.addEventListener("resize", onResize);
    if (document.fonts) document.fonts.ready.then(() => {
      build();
      layout();
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      pinCleanups.forEach((fn) => fn());
    };
  }, [refs, groups, reduced]);
}
