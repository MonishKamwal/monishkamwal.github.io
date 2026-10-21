"use client";

import { RefObject, useEffect } from "react";
import { clamp } from "@/lib/story/motion";
import { SK_STOPS, SK_CONTENT, type SkillsStop } from "@/lib/story/skillsMap";

export type SkillsRefs = {
  map: RefObject<SVGSVGElement | null>;
  root: RefObject<HTMLElement | null>; // queries [data-stop] blocks
};

const smooth = (v: number) => {
  v = clamp(v, 0, 1);
  return v * v * (3 - 2 * v);
};

// The Skills page camera: the map is a sticky SVG the text scrolls over; the
// scroll position between two blocks moves the camera (the map's viewBox) from
// one stop to the next, zooming into each competency shape or shared-tool
// crossing. Lit shapes stay full colour, the rest go quiet (and their labels
// with them); a click on a shape scrolls to its stop. Ported from the prototype.
export function useSkillsMotion(refs: SkillsRefs, reduced: boolean): void {
  useEffect(() => {
    const map = refs.map.current;
    const root = refs.root.current;
    if (!map || !root) return;

    const portMq = window.matchMedia("(max-aspect-ratio:9/10)");
    const blocks = [...root.querySelectorAll<HTMLElement>("[data-stop]")];
    const head = blocks[0];

    const groups: Record<string, { g: SVGGElement; blob: SVGElement; texts: SVGTextElement[] }> = {};
    map.querySelectorAll<SVGGElement>(".m-g").forEach((g) => {
      groups[g.dataset.k!] = {
        g,
        blob: g.querySelector<SVGElement>(".blob")!,
        texts: [...g.querySelectorAll<SVGTextElement>("text")],
      };
    });
    const shared: Record<string, SVGTextElement> = {};
    map.querySelectorAll<SVGTextElement>(".m-shared").forEach((t) => {
      shared[t.dataset.s!] = t;
    });

    let anchors: number[] = [];
    let labels: { t: SVGTextElement; cx: number; hw: number }[] | null = null;

    const measureLabels = () => {
      labels = [...map.querySelectorAll<SVGTextElement>("text")].map((t) => {
        const b = t.getBBox();
        return { t, cx: b.x + b.width / 2, hw: b.width / 2 };
      });
    };

    const layout = () => {
      measureLabels();
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const port = portMq.matches;
      let prev = 0;
      anchors = blocks.map((b, i) => {
        if (i === 0) return 0;
        const top = b.getBoundingClientRect().top + window.scrollY;
        let a = port ? top - 0.62 * vh : top + b.offsetHeight / 2 - vh / 2;
        a = clamp(a, prev + 1, Math.max(prev + 1, max));
        prev = a;
        return a;
      });
    };

    const cam = (s: SkillsStop): [number, number, number, number] => {
      const r = map.getBoundingClientRect();
      const AR = r.width / Math.max(1, r.height);
      const port = portMq.matches;
      let { x, w, h } = s;
      const y = s.y;
      if (port && s.whole) {
        x = SK_CONTENT.x;
        w = SK_CONTENT.w;
        h = SK_CONTENT.h;
        const W = Math.max(w, h * AR), H = W / AR;
        const yy = s.k === "head" ? Math.min(SK_CONTENT.y, SK_CONTENT.y + SK_CONTENT.h / 2 + 0.03 * H - H / 2) : SK_CONTENT.y;
        return [x, yy, W, AR];
      }
      if (port) { w *= 0.62; h *= 0.62; }
      const W = Math.max(w, h * AR);
      return [!port && !s.wide ? x + W * 0.21 : x, y, W, AR];
    };

    const applySkills = () => {
      if (!anchors.length) return;
      const st = window.scrollY, an = anchors, port = portMq.matches, vh = window.innerHeight;
      let i = 0;
      while (i < an.length - 2 && st >= an[i + 1]) i++;
      const seg = Math.max(1, an[i + 1] - an[i]), f = clamp((st - an[i]) / seg, 0, 1);
      let e: number;
      if (reduced) e = f < 0.5 ? 0 : 1;
      else if (port) { const T = Math.min(seg, vh * 0.32); e = smooth((st - (an[i + 1] - T)) / T); }
      else e = smooth((f - 0.12) / 0.76);
      const A = cam(SK_STOPS[i]), B = cam(SK_STOPS[i + 1]);
      const W = Math.exp(Math.log(A[2]) + (Math.log(B[2]) - Math.log(A[2])) * e);
      const cx = A[0] + (B[0] - A[0]) * e, cy = A[1] + (B[1] - A[1]) * e, H = W / A[3];
      map.setAttribute("viewBox", `${(cx - W / 2).toFixed(1)} ${(cy - H / 2).toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}`);

      const S0 = SK_STOPS[i], S1 = SK_STOPS[i + 1], near = e < 0.5 ? S0 : S1;
      const level = (S: SkillsStop, k: string) => ((S.lit || []).includes(k) ? 1 : S.rest ?? (S.lit ? 0.26 : 0.42));
      for (const k in groups) {
        const v = level(S0, k) + (level(S1, k) - level(S0, k)) * e, g = groups[k];
        g.blob.style.opacity = v.toFixed(3);
        const tv = v > 0.42 ? 1 : clamp((v - 0.26) / (0.42 - 0.26), 0, 1) * 0.75 + 0.25;
        g.texts.forEach((t) => t.style.setProperty("--sk-t", tv.toFixed(3)));
        g.g.classList.toggle("on", (near.lit || []).length === 1 && near.lit![0] === k);
      }
      for (const k in shared) shared[k].classList.toggle("on", k === near.s);

      const fade = port ? 0 : (S0.lit ? 1 : 0) + ((S1.lit ? 1 : 0) - (S0.lit ? 1 : 0)) * e;
      if (labels) {
        const mw = map.getBoundingClientRect().width, col = 0.57 * mw;
        labels.forEach((L) => {
          const right = ((L.cx + L.hw) - (cx - W / 2)) / W * mw;
          L.t.style.setProperty("--sk-l", (1 - fade * (1 - clamp((col - right) / (0.05 * mw), 0, 1))).toFixed(3));
        });
      }

      if (port) {
        if (head) head.style.opacity = String(clamp(1 - st / (vh * 0.28), 0, 1));
        blocks.forEach((b, j) => { if (j) b.style.opacity = ""; });
      } else {
        if (head) head.style.opacity = "";
        blocks.forEach((b, j) => {
          if (!j) return;
          let o = 0;
          if (reduced) o = 1;
          else if (j === i) o = 1 - clamp((f - 0.15) / 0.3, 0, 1);
          else if (j === i + 1) o = clamp((f - 0.55) / 0.3, 0, 1);
          b.style.opacity = o.toFixed(3);
        });
      }
    };

    // a click/tap on a shape scrolls to its stop
    const clickCleanups: (() => void)[] = [];
    Object.keys(groups).forEach((k) => {
      const onClick = () => {
        const i = SK_STOPS.findIndex((s) => s.k === k);
        if (anchors[i] != null) window.scrollTo({ top: anchors[i], behavior: reduced ? "auto" : "smooth" });
      };
      groups[k].g.addEventListener("click", onClick);
      clickCleanups.push(() => groups[k].g.removeEventListener("click", onClick));
    });

    layout();
    let raf = requestAnimationFrame(function loop() {
      applySkills();
      raf = requestAnimationFrame(loop);
    });
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    if (document.fonts) document.fonts.ready.then(layout);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      clickCleanups.forEach((fn) => fn());
    };
  }, [refs, reduced]);
}
