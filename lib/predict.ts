// Client-side contract with the inference API (mlops Phase 1, task 5).
//
// The API is a FastAPI app on a scale-to-zero Lambda behind a Function URL.
// CORS is owned by the Function URL (allowlist: this site + localhost:3000),
// so the browser can call it directly — no proxy, no app-level CORS.

export type Point = { x: number; y: number };
export type Stroke = Point[];

export type Prediction = { label: string; probability: number };

export type PredictResult = {
  predictions: Prediction[]; // every class, sorted by probability descending
  source: "strokes" | "png"; // which input format the server used
};

export type ModelInfo = {
  classes: string[];
  val_accuracy: number;
  model_sha256: string;
  service_version: string;
};

// Logical drawing space for the canvas. The server normalizes every drawing to
// its own bounding box before rasterizing, so the actual range never matters to
// the model — this only defines the coordinate system the canvas draws in.
export const CANVAS_SIZE = 280;

// Fallback until /model-info answers (also the prompt while the model warms up).
export const QUICKDRAW_CLASSES = [
  "airplane",
  "apple",
  "banana",
  "bicycle",
  "bird",
  "car",
  "cat",
  "clock",
  "dog",
  "face",
  "fish",
  "house",
  "star",
  "tree",
  "umbrella",
];

// Changes only if the infra is rebuilt (mlops infra/persistent).
export const API_URL =
  "https://u4udjs3pbrr6xlaanmcpdb7bty0amoeh.lambda-url.us-east-2.on.aws";

// The API speaks QuickDraw's native stroke shape: per stroke, two parallel
// arrays [[x0, x1, ...], [y0, y1, ...]] — not point objects.
function toQuickDrawStrokes(strokes: Stroke[]): number[][][] {
  return strokes.map((stroke) => [
    stroke.map((p) => p.x),
    stroke.map((p) => p.y),
  ]);
}

export async function predictSketch(strokes: Stroke[]): Promise<PredictResult> {
  // Strokes only: the server prefers strokes over PNG when both are sent, so
  // the PNG would be dead weight in every request.
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strokes: toQuickDrawStrokes(strokes) }),
  });
  if (!res.ok) {
    throw new Error(`predict failed: ${res.status}`);
  }
  return res.json();
}

// Fired on page load: doubles as the cold-start warm-up ping (the fetch itself
// boots the Lambda) and returns the live class list + model identity to render.
export async function fetchModelInfo(): Promise<ModelInfo> {
  const res = await fetch(`${API_URL}/model-info`);
  if (!res.ok) {
    throw new Error(`model-info failed: ${res.status}`);
  }
  return res.json();
}

// A visitor's 👍/👎 on the top prediction (mlops Phase 4, task 3). Self-contained:
// it carries the context the client already has, so the server needs no prediction id.
// When `strokes` is present the server also captures the drawing for retraining (task 5):
// 👍 labels it with the guess; 👎 labels it with `true_label` (what the user says they drew).
export type FeedbackContext = {
  predicted_label: string;
  confidence: number;
  correct: boolean;
  source: "strokes" | "png";
  model_sha256?: string;
  strokes?: Stroke[];
  true_label?: string;
};

// Fire-and-forget: a lost verdict must never disrupt the demo, so this swallows
// every error and never rejects — mirroring the server's fail-open logging.
export async function sendFeedback(ctx: FeedbackContext): Promise<void> {
  const { strokes, ...rest } = ctx;
  const body = strokes
    ? { ...rest, strokes: toQuickDrawStrokes(strokes) }
    : rest;
  try {
    await fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // intentionally ignored
  }
}
