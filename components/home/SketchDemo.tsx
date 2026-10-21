"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  predictSketch,
  fetchModelInfo,
  sendFeedback,
  type Stroke,
  type Prediction,
} from "@/lib/predict";
import { home } from "@/lib/content";

// §2 live demo. Ports the prototype's pad (real ink + the idle self-drawing
// demo) and wires predictions to the deployed model (lib/predict.ts): draw →
// top-3 bars, warm-up / thinking / offline states, and the Yes/No verdict with
// a No → class-picker capture (feeds Monitoring's proxy accuracy + the retrain
// flywheel). Copy comes from content/home.json. See DESIGN.md §5 "§2".

const demo = home.demo;

// the idle self-demo cycles through doodles from the model's real 15 classes,
// one per loop — ported verbatim from the prototype (geometry authority).
const MOCKS = [
  /* cat */ "M40 30 L34 14 L48 24 C 55 21, 65 21, 72 24 L86 14 L80 30 C 88 37, 90 52, 80 62 C 70 71, 50 71, 40 62 C 30 52, 32 37, 40 30 Z M50 44 a1.8 1.8 0 1 0 0.1 0 M70 44 a1.8 1.8 0 1 0 0.1 0 M20 50 L34 52 M20 60 L34 57 M100 50 L86 52 M100 60 L86 57",
  /* house */ "M30 62 L30 34 L60 16 L90 34 L90 62 Z M52 62 L52 46 L68 46 L68 62",
  /* star */ "M60 14 L67 36 L90 36 L72 50 L79 72 L60 58 L41 72 L48 50 L30 36 L53 36 Z",
  /* fish */ "M28 40 C 42 22, 74 22, 88 40 C 74 58, 42 58, 28 40 Z M88 40 L102 32 L102 48 Z M40 36 a2.2 2.2 0 1 0 0.1 0",
  /* umbrella */ "M28 44 C 32 20, 88 20, 92 44 M28 44 C 33 38, 39 38, 44 44 C 49 38, 55 38, 60 44 C 65 38, 71 38, 76 44 C 81 38, 87 38, 92 44 M60 26 L60 64 C 60 72, 48 72, 48 65",
  /* clock */ "M60 16 a24 24 0 1 1 -0.1 0 M60 40 L60 27 M60 40 L71 45",
];
const IDLE_AFTER = 15000;

// the resting demo prediction (shown while the pad self-draws, before the
// visitor takes over) — the prototype's hard-coded cat verdict.
const RESTING: Prediction[] = [
  { label: "cat", probability: 0.87 },
  { label: "dog", probability: 0.09 },
  { label: "bird", probability: 0.04 },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type FbStage = "ask" | "picking" | "done";

export default function SketchDemo() {
  const padRef = useRef<SVGSVGElement>(null);
  const inkRef = useRef<SVGGElement>(null);
  const mockPathRef = useRef<SVGPathElement>(null);

  // drawn strokes, as logical points in the 0..120 × 0..90 pad space
  const strokesRef = useRef<Stroke[]>([]);
  const currentPolyRef = useRef<SVGPolylineElement | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mockIxRef = useRef(0);
  const reduceRef = useRef(false);
  // Holds the latest padIdle so the idle loop can re-arm itself without a
  // stale self-reference (the recursive setTimeout below goes through this).
  const padIdleRef = useRef<() => void>(() => {});

  const [preds, setPreds] = useState<Prediction[] | null>(null); // null → resting
  const [status, setStatus] = useState<"" | "warming" | "thinking" | "offline">(
    "",
  );
  const [fbStage, setFbStage] = useState<FbStage>("ask");

  const live = preds !== null;
  const shown = preds ?? RESTING;
  const top3 = shown.slice(0, 3);

  const rootEl = () =>
    padRef.current?.closest(".home-root") as HTMLElement | null;

  // ----- idle self-demo -----
  const setMock = useCallback((i: number) => {
    const p = mockPathRef.current;
    if (!p) return;
    p.setAttribute("d", MOCKS[i]);
    p.style.setProperty("--len", String(Math.ceil(p.getTotalLength())));
  }, []);

  const padIdle = useCallback(() => {
    if (currentPolyRef.current) {
      idleTimerRef.current = setTimeout(() => padIdleRef.current(), IDLE_AFTER);
      return; // never wipe mid-stroke
    }
    const ink = inkRef.current;
    if (ink) ink.style.opacity = "0";
    setTimeout(
      () => {
        if (ink) {
          ink.textContent = "";
          ink.style.opacity = "1";
        }
        strokesRef.current = [];
        setPreds(null);
        setStatus("");
        setFbStage("ask");
        mockIxRef.current = (mockIxRef.current + 1) % MOCKS.length;
        setMock(mockIxRef.current);
        rootEl()?.classList.add("pad-idle");
      },
      reduceRef.current ? 0 : 650,
    );
  }, [setMock]);
  useEffect(() => {
    padIdleRef.current = padIdle;
  }, [padIdle]);

  const padWake = useCallback(() => {
    rootEl()?.classList.remove("pad-idle");
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(padIdle, IDLE_AFTER);
  }, [padIdle]);

  // ----- run a prediction against the deployed model -----
  const runPredict = useCallback(async () => {
    if (strokesRef.current.length === 0) return;
    const snapshot = strokesRef.current.map((s) => s.map((p) => ({ ...p })));
    setStatus((s) => (s === "warming" ? "warming" : "thinking"));
    try {
      const res = await predictSketch(snapshot);
      setPreds(res.predictions);
      setStatus("");
      setFbStage("ask");
    } catch {
      setStatus("offline");
    }
  }, []);

  // ----- pad geometry: screen point → the SVG's 0..120 / 0..90 space -----
  const padPoint = (e: PointerEvent): { x: number; y: number } => {
    const svg = padRef.current!;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      svg.getScreenCTM()!.inverse(),
    );
    return { x: +pt.x.toFixed(1), y: +pt.y.toFixed(1) };
  };

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const svg = padRef.current;
    const ink = inkRef.current;
    const mockPath = mockPathRef.current;
    if (!svg || !ink || !mockPath) return;

    setMock(0);
    rootEl()?.classList.add("pad-idle"); // the demo plays from the start

    // warm the Lambda (scale-to-zero): the ping itself boots it
    setStatus("warming");
    fetchModelInfo()
      .then(() => setStatus((s) => (s === "warming" ? "" : s)))
      .catch(() => setStatus((s) => (s === "warming" ? "offline" : s)));

    const onIter = () => {
      mockIxRef.current = (mockIxRef.current + 1) % MOCKS.length;
      setMock(mockIxRef.current);
    };
    mockPath.addEventListener("animationiteration", onIter);

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      svg.setPointerCapture(e.pointerId);
      padWake();
      const poly = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline",
      );
      const p = padPoint(e);
      poly.setAttribute("points", `${p.x},${p.y} ${p.x},${p.y}`); // a tap leaves a dot
      ink.appendChild(poly);
      currentPolyRef.current = poly;
      strokesRef.current.push([p]);
    };
    const onMove = (e: PointerEvent) => {
      const poly = currentPolyRef.current;
      if (!poly) return;
      const p = padPoint(e);
      poly.setAttribute("points", `${poly.getAttribute("points")} ${p.x},${p.y}`);
      strokesRef.current[strokesRef.current.length - 1].push(p);
    };
    const onUp = () => {
      if (!currentPolyRef.current) return;
      currentPolyRef.current = null;
      padWake();
      void runPredict();
    };

    svg.addEventListener("pointerdown", onDown);
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerup", onUp);
    svg.addEventListener("pointercancel", onUp);
    // iOS applies :active (the one hover on touch) only once the page listens
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });

    return () => {
      mockPath.removeEventListener("animationiteration", onIter);
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerup", onUp);
      svg.removeEventListener("pointercancel", onUp);
      document.removeEventListener("touchstart", noop);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [setMock, padWake, runPredict]);

  const clearPad = () => {
    if (inkRef.current) inkRef.current.textContent = "";
    strokesRef.current = [];
    currentPolyRef.current = null;
    setPreds(null);
    setStatus("");
    setFbStage("ask");
    padWake();
  };
  const undoStroke = () => {
    const ink = inkRef.current;
    if (ink?.lastElementChild) ink.lastElementChild.remove();
    strokesRef.current.pop();
    padWake();
    if (strokesRef.current.length === 0) setPreds(null);
    else void runPredict();
  };

  // ----- verdict -----
  const topLabel = live ? top3[0]?.label : undefined;
  const sendVerdict = (correct: boolean, trueLabel?: string) => {
    if (!live || !topLabel) return;
    sendFeedback({
      predicted_label: topLabel,
      confidence: top3[0].probability,
      correct,
      source: "strokes",
      strokes: strokesRef.current.map((s) => s.map((p) => ({ ...p }))),
      ...(trueLabel ? { true_label: trueLabel } : {}),
    });
    setFbStage("done");
  };

  const statusMsg =
    status === "warming"
      ? demo.states.warmingUp
      : status === "thinking"
        ? demo.states.thinking
        : status === "offline"
          ? demo.states.unreachable
          : "";

  return (
    <div className="instrument">
      <div className="canvas-col reveal" data-stagger="1">
        <div className="canvas-card">
          <svg
            ref={padRef}
            viewBox="0 0 120 90"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="1.6"
          >
            <g
              className="mock"
              transform="translate(18 17) scale(.7)"
            >
              <path
                ref={mockPathRef}
                d={MOCKS[0]}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <g className="ink" ref={inkRef} />
          </svg>
        </div>
        <div className="canvas-tools">
          <button className="tool-btn" type="button" onClick={clearPad}>
            {demo.controls.clear}
          </button>
          <button className="tool-btn" type="button" onClick={undoStroke}>
            {demo.controls.undo}
          </button>
        </div>
      </div>

      <div className="instr-split" aria-hidden="true" />

      <div className="pred reveal" data-stagger="2">
        {top3.map((p, i) => (
          <div className="bar-row" key={i}>
            <div className="bar-top">
              <span>{cap(p.label)}</span>
              <span className="pct">{Math.round(p.probability * 100)}%</span>
            </div>
            <div className="bar-track">
              <div
                className={`bar-fill${i > 0 ? " soft" : ""}`}
                style={{ "--w": p.probability } as React.CSSProperties}
              />
            </div>
          </div>
        ))}

        <p className="prompt" aria-live="polite">
          {statusMsg || (
            <>
              {demo.prompt}
              <span className="class-list">
                {" — " + demo.promptClasses.join(", ") + "."}
              </span>
            </>
          )}
        </p>

        <div className="feedback">
          {fbStage === "done" ? (
            <span className="fb-q">{demo.feedback.thanks}</span>
          ) : fbStage === "picking" ? (
            <>
              <span className="fb-q">{demo.feedback.noFollowUp}</span>
              {demo.promptClasses.map((c) => (
                <button
                  key={c}
                  className="fb-btn"
                  type="button"
                  onClick={() => sendVerdict(false, c.toLowerCase())}
                >
                  {c}
                </button>
              ))}
            </>
          ) : (
            <>
              <span className="fb-q">{demo.feedback.question}</span>
              <button
                className="fb-btn"
                type="button"
                disabled={!live}
                onClick={() => sendVerdict(true)}
              >
                {demo.feedback.yes}
              </button>
              <button
                className="fb-btn"
                type="button"
                disabled={!live}
                onClick={() => setFbStage("picking")}
              >
                {demo.feedback.no}
              </button>
            </>
          )}
        </div>

        <div className="doorway">
          <span className="micro">{demo.doorwayNote}</span>
          <a className="link" href={demo.cta.href}>
            {demo.cta.label} →
          </a>
        </div>
        <p className="privacy">{demo.privacyNote}</p>
      </div>
    </div>
  );
}
