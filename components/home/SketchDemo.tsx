"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CANVAS_SIZE,
  QUICKDRAW_CLASSES,
  type Prediction,
  type Stroke,
  fetchModelInfo,
  predictSketch,
  sendFeedback,
} from "@/lib/predict";
import { home } from "@/lib/content";

const c = home.demo;

type Status = "warming" | "ready" | "thinking" | "offline";
type Verdict = "none" | "asked" | "thanks" | "picking";

export default function SketchDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const predictTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [classes, setClasses] = useState<string[]>(QUICKDRAW_CLASSES);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [status, setStatus] = useState<Status>("warming");
  const [verdict, setVerdict] = useState<Verdict>("none");
  const [hasInk, setHasInk] = useState(false);

  /* --- warm-up ping on mount: boots the Lambda + fetches the live class list --- */
  useEffect(() => {
    let alive = true;
    const slow = setTimeout(() => {
      if (alive) setStatus((s) => (s === "warming" ? "warming" : s));
    }, 2000);
    fetchModelInfo()
      .then((info) => {
        if (!alive) return;
        if (info.classes?.length) setClasses(info.classes);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("offline"))
      .finally(() => clearTimeout(slow));
    return () => {
      alive = false;
      clearTimeout(slow);
    };
  }, []);

  /* --- canvas drawing --- */
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (const stroke of strokesRef.current) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (const p of stroke) ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }, []);

  const toCanvas = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const schedulePredict = useCallback(() => {
    if (predictTimer.current) clearTimeout(predictTimer.current);
    predictTimer.current = setTimeout(async () => {
      if (strokesRef.current.length === 0) return;
      if (status !== "offline") setStatus("thinking");
      try {
        const res = await predictSketch(strokesRef.current);
        setPredictions(res.predictions.slice(0, 3));
        setStatus("ready");
        setVerdict("asked");
      } catch {
        setStatus("offline");
      }
    }, 400);
  }, [status]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (status === "offline") return;
    (e.target as Element).setPointerCapture(e.pointerId);
    drawingRef.current = true;
    strokesRef.current = [...strokesRef.current, [toCanvas(e)]];
    setHasInk(true);
    setVerdict("none");
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    const stroke = strokesRef.current[strokesRef.current.length - 1];
    stroke.push(toCanvas(e));
    redraw();
  };
  const onPointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    schedulePredict();
  };

  const clear = () => {
    strokesRef.current = [];
    setPredictions([]);
    setHasInk(false);
    setVerdict("none");
    redraw();
  };
  const undo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setHasInk(strokesRef.current.length > 0);
    redraw();
    if (strokesRef.current.length) schedulePredict();
    else setPredictions([]);
  };

  /* --- feedback --- */
  const top = predictions[0];
  const submit = (correct: boolean, trueLabel?: string) => {
    if (!top) return;
    sendFeedback({
      predicted_label: top.label,
      confidence: top.probability,
      correct,
      source: "strokes",
      strokes: strokesRef.current,
      ...(trueLabel ? { true_label: trueLabel } : {}),
    });
    setVerdict("thanks");
  };

  const offline = status === "offline";

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-stretch">
      {/* Canvas paper */}
      <div className="paper flex flex-col gap-3 p-4">
        <div className="relative aspect-square w-full">
          {offline ? (
            <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-well px-6 text-center text-sm text-muted">
              {c.states.unreachable}
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              className="h-full w-full touch-none rounded-[9px] bg-well"
              aria-label="Drawing canvas"
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">{c.prompt}</p>
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={undo}
              disabled={!hasInk}
              className="text-ink transition-colors hover:text-ochre disabled:opacity-30"
            >
              {c.controls.undo}
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={!hasInk}
              className="text-ink transition-colors hover:text-ochre disabled:opacity-30"
            >
              {c.controls.clear}
            </button>
          </div>
        </div>
      </div>

      {/* Predictions paper */}
      <div className="paper flex flex-col gap-4 p-5">
        <p className="micro-label">{c.predictions.heading}</p>

        {status === "warming" && (
          <p className="text-sm text-muted">{c.states.warmingUp}</p>
        )}

        {status !== "warming" && predictions.length === 0 && (
          <p className="text-sm text-muted">
            {offline ? "" : c.predictions.emptyHint}
          </p>
        )}

        {predictions.length > 0 && (
          <ul className="flex flex-col gap-3">
            {predictions.map((p, i) => (
              <li key={p.label}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="capitalize text-ink">{p.label}</span>
                  <span className="font-mono text-xs text-ink">
                    {Math.round(p.probability * 100)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-well">
                  <div
                    className="h-full rounded-full bg-ochre transition-[width] duration-[480ms] [transition-timing-function:var(--ease-expo)]"
                    style={{
                      width: `${Math.round(p.probability * 100)}%`,
                      opacity: i === 0 ? 1 : 0.55,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* feedback */}
        {verdict === "asked" && top && (
          <div className="mt-auto flex items-center gap-3 text-sm">
            <span className="text-muted">{c.feedback.question}</span>
            <button
              type="button"
              onClick={() => submit(true)}
              className="ink-link"
            >
              {c.feedback.yes}
            </button>
            <button
              type="button"
              onClick={() => setVerdict("picking")}
              className="ink-link"
            >
              {c.feedback.no}
            </button>
          </div>
        )}
        {verdict === "picking" && (
          <div className="mt-auto">
            <p className="mb-2 text-sm text-muted">{c.feedback.noFollowUp}</p>
            <div className="flex flex-wrap gap-2">
              {classes.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => submit(false, label)}
                  className="rounded-full border border-hairline px-2.5 py-1 text-xs capitalize text-ink transition-colors hover:border-ochre hover:text-ochre"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        {verdict === "thanks" && (
          <p className="mt-auto text-sm text-muted">{c.feedback.thanks}</p>
        )}

        <p className="text-[0.7rem] leading-relaxed text-muted">
          {c.privacyNote}
        </p>
      </div>
    </div>
  );
}
