"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CANVAS_SIZE,
  QUICKDRAW_CLASSES,
  fetchModelInfo,
  predictSketch,
  sendFeedback,
  type ModelInfo,
  type Point,
  type PredictResult,
  type Stroke,
} from "@/lib/predict";

const INK = "#1c2130";
const PAPER = "#fdfdfc";
const LINE_WIDTH = 6;
const PREDICT_DEBOUNCE_MS = 350;
// A warm Lambda answers in well under a second; anything slower than this is
// almost certainly a cold start, so the UI switches to the "waking up" story.
const WAKE_HINT_MS = 2000;

type ApiStatus = "warming" | "ready" | "down";

export default function SketchDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generationRef = useRef(0);

  const [strokeCount, setStrokeCount] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [waking, setWaking] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);
  // null = not yet answered for the current prediction; true/false = the verdict sent.
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [error, setError] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("warming");

  // Warm-up ping on page load: Lambda scales to zero between visitors, and the
  // first request pays the cold start. Fetching /model-info now means the boot
  // usually happens while the visitor is still reading — and it returns the
  // live class list + model identity as a bonus.
  useEffect(() => {
    let cancelled = false;
    fetchModelInfo()
      .then((info) => {
        if (cancelled) return;
        setModelInfo(info);
        setApiStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setApiStatus("down");
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
      const wakeTimer = setTimeout(() => {
        if (generationRef.current === generation) setWaking(true);
      }, WAKE_HINT_MS);
      try {
        const res = await predictSketch(strokesRef.current);
        if (generationRef.current === generation) {
          setResult(res);
          setFeedback(null); // a new guess deserves a fresh 👍/👎
          setApiStatus("ready"); // a successful predict beats a failed warm-up
        }
      } catch {
        if (generationRef.current === generation) setError(true);
      } finally {
        clearTimeout(wakeTimer);
        if (generationRef.current === generation) {
          setThinking(false);
          setWaking(false);
        }
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
      setFeedback(null);
      setThinking(false);
    }
  };

  const handleClear = () => {
    cancelPending();
    strokesRef.current = [];
    currentStrokeRef.current = null;
    setStrokeCount(0);
    setResult(null);
    setFeedback(null);
    setThinking(false);
    setError(false);
    redraw();
  };

  const handleFeedback = useCallback(
    (correct: boolean) => {
      const top = result?.predictions[0];
      if (!top) return;
      setFeedback(correct);
      void sendFeedback({
        predicted_label: top.label,
        confidence: top.probability,
        correct,
        source: result.source,
        model_sha256: modelInfo?.model_sha256,
      });
    },
    [result, modelInfo],
  );

  // Prefer the live class list (/model-info) so the prompt can never drift from
  // what the deployed model actually knows; fall back while it loads.
  const classes = modelInfo?.classes ?? QUICKDRAW_CLASSES;

  const statusChip = {
    warming: {
      style: "border-accent/40 bg-accent/10 text-accent animate-pulse",
      text: "Warming up the model — it scales to zero between visitors…",
    },
    ready: {
      style: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
      text: "Live — drawings hit a real model on a scale-to-zero AWS Lambda.",
    },
    down: {
      style: "border-red-400/40 bg-red-400/10 text-red-300",
      text: "Model API unreachable — predictions won't work right now.",
    },
  }[apiStatus];

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
          Try one of the {classes.length} things it knows:{" "}
          {classes.slice(0, 8).join(", ")}…
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
          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusChip.style}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
            {statusChip.text}
          </div>

          <div className="min-h-[180px] rounded-xl border border-edge bg-panel p-5">
            {error ? (
              <p className="text-sm text-muted">
                The model API is unreachable right now — try again in a moment.
              </p>
            ) : result ? (
              <div className="flex flex-col gap-3">
                {result.predictions.slice(0, 3).map((p, i) => (
                  <div key={p.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className={i === 0 ? "font-medium text-ink" : "text-muted"}>
                        {p.label}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {(p.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-night">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          i === 0 ? "bg-accent" : "bg-edge"
                        }`}
                        style={{ width: `${Math.max(2, p.probability * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="mt-1 font-mono text-xs text-muted">
                  {modelInfo
                    ? `model ${modelInfo.model_sha256.slice(0, 8)} · val acc ${(
                        modelInfo.val_accuracy * 100
                      ).toFixed(1)}%`
                    : "model: live"}
                  {thinking &&
                    (waking ? " · waking the model (cold start)…" : " · thinking…")}
                </p>

                {/* 👍/👎 feedback — a real accuracy signal on live drawings (feeds
                    the platform's proxy-accuracy). One answer per guess. */}
                <div className="mt-2 flex items-center gap-2 border-t border-edge pt-3 text-sm">
                  {feedback === null ? (
                    <>
                      <span className="text-muted">Did I get it right?</span>
                      <button
                        onClick={() => handleFeedback(true)}
                        className="rounded-md border border-edge bg-panel px-2.5 py-1 transition-colors hover:border-accent"
                        aria-label="Yes, the guess was correct"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="rounded-md border border-edge bg-panel px-2.5 py-1 transition-colors hover:border-accent"
                        aria-label="No, the guess was wrong"
                      >
                        👎
                      </button>
                    </>
                  ) : (
                    <span className="text-muted">
                      {feedback ? "Thanks! 🎉" : "Thanks — noted. 🙏"}
                    </span>
                  )}
                </div>
              </div>
            ) : thinking ? (
              waking ? (
                <p className="animate-pulse text-sm text-muted">
                  The model is waking up — it scales to zero between visitors.
                  That&apos;s the point 😉 First guess lands in a few seconds.
                </p>
              ) : (
                <p className="animate-pulse text-sm text-muted">hmm…</p>
              )
            ) : (
              <p className="text-sm text-muted">
                Your masterpiece will be judged here.
              </p>
            )}
          </div>

          <p className="text-xs text-muted">
            Drawings are anonymous — no accounts, no tracking. Next up:
            predictions get logged (input digest, top guesses, latency — no
            PII) to feed the platform&apos;s drift monitoring — that&apos;s the
            whole point.
          </p>
        </div>
      </div>
    </section>
  );
}
