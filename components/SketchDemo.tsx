"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CANVAS_SIZE,
  QUICKDRAW_CLASSES,
  predictSketch,
  type Point,
  type PredictResult,
  type Stroke,
} from "@/lib/predict";

const INK = "#1c2130";
const PAPER = "#fdfdfc";
const LINE_WIDTH = 6;
const PREDICT_DEBOUNCE_MS = 350;

export default function SketchDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generationRef = useRef(0);

  const [strokeCount, setStrokeCount] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [error, setError] = useState(false);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = canvas.width / CANVAS_SIZE;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.strokeStyle = INK;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const strokes = currentStrokeRef.current
      ? [...strokesRef.current, currentStrokeRef.current]
      : strokesRef.current;
    for (const stroke of strokes) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (const p of stroke.slice(1)) ctx.lineTo(p.x, p.y);
      // A tap should still leave a dot.
      if (stroke.length === 1) ctx.lineTo(stroke[0].x + 0.1, stroke[0].y);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = canvas.width;
      redraw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redraw]);

  const cancelPending = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    generationRef.current += 1;
  };

  const schedulePredict = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const generation = ++generationRef.current;
    timerRef.current = setTimeout(async () => {
      setThinking(true);
      setError(false);
      try {
        const res = await predictSketch(strokesRef.current);
        if (generationRef.current === generation) setResult(res);
      } catch {
        if (generationRef.current === generation) setError(true);
      } finally {
        if (generationRef.current === generation) setThinking(false);
      }
    }, PREDICT_DEBOUNCE_MS);
  }, []);

  const toCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.round(((e.clientX - rect.left) / rect.width) * CANVAS_SIZE * 10) / 10,
      y: Math.round(((e.clientY - rect.top) / rect.height) * CANVAS_SIZE * 10) / 10,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelPending();
    currentStrokeRef.current = [toCanvasPoint(e)];
    redraw();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStrokeRef.current) return;
    currentStrokeRef.current.push(toCanvasPoint(e));
    redraw();
  };

  const endStroke = () => {
    if (!currentStrokeRef.current) return;
    strokesRef.current.push(currentStrokeRef.current);
    currentStrokeRef.current = null;
    setStrokeCount(strokesRef.current.length);
    schedulePredict();
  };

  const handleUndo = () => {
    cancelPending();
    strokesRef.current.pop();
    setStrokeCount(strokesRef.current.length);
    redraw();
    if (strokesRef.current.length > 0) {
      schedulePredict();
    } else {
      setResult(null);
      setThinking(false);
    }
  };

  const handleClear = () => {
    cancelPending();
    strokesRef.current = [];
    currentStrokeRef.current = null;
    setStrokeCount(0);
    setResult(null);
    setThinking(false);
    setError(false);
    redraw();
  };

  return (
    <section id="demo" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Draw something.{" "}
          <span className="font-hand text-3xl text-accent sm:text-4xl">
            the model will guess.
          </span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Try one of the {QUICKDRAW_CLASSES.length} things it knows:{" "}
          {QUICKDRAW_CLASSES.slice(0, 8).join(", ")}…
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr]">
        <div>
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            className="aspect-square w-full max-w-[340px] cursor-crosshair rounded-xl border border-edge shadow-lg shadow-black/40"
            style={{ touchAction: "none", backgroundColor: PAPER }}
            aria-label="Drawing canvas — sketch something for the model to classify"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleClear}
              disabled={strokeCount === 0}
              className="rounded-md border border-edge bg-panel px-4 py-1.5 text-sm text-ink transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
            <button
              onClick={handleUndo}
              disabled={strokeCount === 0}
              className="rounded-md border border-edge bg-panel px-4 py-1.5 text-sm text-ink transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              Undo
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">
            <span aria-hidden>⚠</span> Demo mode — predictions are mocked. The
            real model API ships in Phase 1.
          </div>

          <div className="min-h-[180px] rounded-xl border border-edge bg-panel p-5">
            {error ? (
              <p className="text-sm text-muted">
                The model API is unreachable right now — try again in a moment.
              </p>
            ) : result ? (
              <div className="flex flex-col gap-3">
                {result.predictions.map((p, i) => (
                  <div key={p.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className={i === 0 ? "font-medium text-ink" : "text-muted"}>
                        {p.label}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {(p.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-night">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          i === 0 ? "bg-accent" : "bg-edge"
                        }`}
                        style={{ width: `${Math.max(2, p.confidence * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="mt-1 font-mono text-xs text-muted">
                  model: {result.modelVersion}
                  {thinking && " · thinking…"}
                </p>
              </div>
            ) : thinking ? (
              <p className="animate-pulse text-sm text-muted">hmm…</p>
            ) : (
              <p className="text-sm text-muted">
                Your masterpiece will be judged here.
              </p>
            )}
          </div>

          <p className="text-xs text-muted">
            When the real API is live, drawings are logged anonymously and feed
            the platform&apos;s drift monitoring — that&apos;s the whole point.
          </p>
        </div>
      </div>
    </section>
  );
}
