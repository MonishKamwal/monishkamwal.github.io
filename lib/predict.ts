// Client-side contract with the inference API.
//
// Phase 1 swap: set API_URL to the Lambda Function URL and predictSketch will
// POST the raw strokes there. Until then every prediction is an honest mock.

export type Point = { x: number; y: number };
export type Stroke = Point[];

export type Prediction = { label: string; confidence: number };

export type PredictResult = {
  predictions: Prediction[];
  modelVersion: string;
  mock: boolean;
};

// Logical drawing space; the API contract sends strokes in 0–280 coordinates
// and all preprocessing down to the 28×28 model input happens server-side.
export const CANVAS_SIZE = 280;

export const QUICKDRAW_CLASSES = [
  "cat",
  "dog",
  "fish",
  "bird",
  "apple",
  "banana",
  "house",
  "tree",
  "car",
  "bicycle",
  "airplane",
  "clock",
  "star",
  "umbrella",
  "face",
] as const;

export const API_URL = ""; // Phase 1: https://<function-url>.lambda-url.<region>.on.aws

export async function predictSketch(strokes: Stroke[]): Promise<PredictResult> {
  if (!API_URL) {
    return mockPredict(strokes);
  }
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strokes, canvas_size: CANVAS_SIZE }),
  });
  if (!res.ok) {
    throw new Error(`predict failed: ${res.status}`);
  }
  return { ...(await res.json()), mock: false };
}

// Deterministic per drawing (seeded by its geometry) so repeated pauses over
// the same sketch don't shuffle the "answer", but different sketches vary.
function mockPredict(strokes: Stroke[]): Promise<PredictResult> {
  const seed = strokes.reduce(
    (acc, stroke) => acc + stroke.length * 31 + Math.round(pathLength(stroke)),
    strokes.length * 7919,
  );
  const rand = mulberry32(seed);

  const picks = [...QUICKDRAW_CLASSES]
    .sort(() => rand() - 0.5)
    .slice(0, 3);

  const first = 0.35 + rand() * 0.45;
  const second = (1 - first) * (0.35 + rand() * 0.4);
  const third = (1 - first - second) * (0.4 + rand() * 0.5);
  const confidences = [first, second, third];

  const result: PredictResult = {
    predictions: picks.map((label, i) => ({
      label,
      confidence: confidences[i],
    })),
    modelVersion: "mock-0.0.0",
    mock: true,
  };

  const latency = 250 + rand() * 350;
  return new Promise((resolve) => setTimeout(() => resolve(result), latency));
}

function pathLength(stroke: Stroke): number {
  let length = 0;
  for (let i = 1; i < stroke.length; i++) {
    length += Math.hypot(
      stroke[i].x - stroke[i - 1].x,
      stroke[i].y - stroke[i - 1].y,
    );
  }
  return length;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
