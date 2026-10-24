// The live MLOps contracts the Data pages consume client-side (DESIGN.md §7/§9).
// Every number on these pages renders from these published JSON files — no
// screenshots, no hand-typed values. The hub serves each as its own file:
//
//   Quality      evidence.json
//   Monitoring   drift.json + drift_history.json + feedback.json + feedback_history.json
//   Performance  api-metrics.json
//
// The confusion matrix is the one exception: the hub does not publish cell-level
// data yet, so it is embedded here, clearly labelled "illustrative" in the UI.

const HUB = "https://monishkamwal.github.io/mlops";

export const CONTRACT_URL = {
  evidence: `${HUB}/evidence.json`,
  drift: `${HUB}/drift.json`,
  driftHistory: `${HUB}/drift_history.json`,
  feedback: `${HUB}/feedback.json`,
  feedbackHistory: `${HUB}/feedback_history.json`,
  apiMetrics: `${HUB}/api-metrics.json`,
} as const;

/* ---------- evidence.json (Quality) ---------- */

export type Run = {
  run_id: string;
  started: string;
  epochs: number;
  learning_rate: number;
  val_accuracy: number;
  test_accuracy: number;
  macro_f1: number;
  version: string;
  alias: string | null;
};
export type PerClass = {
  cls: string;
  precision: number;
  recall: number;
  f1: number;
  support: number;
};
export type Evidence = {
  generated_at: string;
  model_name: string;
  repo_slug: string;
  champion: Run;
  runs: Run[];
  per_class: PerClass[];
  gate: { min_test_accuracy: number; epsilon: number };
  blocked_gate_run_url: string;
};

/* ---------- drift.json + drift_history.json (Monitoring) ---------- */

export type NumericDist = {
  bin_edges: number[];
  reference: { counts: number[]; mean: number; median: number };
  current: { counts: number[]; mean: number; median: number };
};
export type CategoricalDist = {
  labels: string[];
  reference: Record<string, number>;
  current: Record<string, number>;
};
export type DriftColumn<D> = {
  type: string;
  method: string;
  score: number;
  threshold: number;
  drifted: boolean;
  distribution: D;
};
export type Drift = {
  generated_at: string;
  window: { n_reference: number; n_current: number };
  model_sha256: string;
  dataset_drift: {
    drifted_columns: number;
    share: number;
    drift_detected: boolean;
  };
  columns: {
    confidence: DriftColumn<NumericDist>;
    margin: DriftColumn<NumericDist>;
    predicted_label: DriftColumn<CategoricalDist>;
  };
};
export type DriftHistoryEntry = {
  date: string;
  generated_at: string;
  drift_share: number;
  drifted_columns: number;
  drift_detected: boolean;
  n_current: number;
  mean_confidence_reference: number;
  mean_confidence_current: number;
  model_sha256: string;
};

/* ---------- feedback.json + feedback_history.json (Monitoring) ---------- */

export type Feedback = {
  generated_at: string;
  window: { n: number; n_correct: number };
  accuracy: number | null; // null on a quiet (n = 0) window
  by_class: {
    predicted_label: string;
    n: number;
    n_correct: number;
    accuracy: number;
  }[];
  by_source: { source: string; n: number; n_correct: number; accuracy: number }[];
  model_sha256: string;
};
export type FeedbackHistoryEntry = {
  date: string;
  generated_at: string;
  n: number;
  n_correct: number;
  accuracy: number | null;
  model_sha256: string;
};

/* ---------- api-metrics.json (Performance) ---------- */

export type MetricPoint = [number, number]; // [unix seconds, value]
export type MetricSeries = {
  labels: Record<string, string>;
  points: MetricPoint[];
};
export type MetricQuery = {
  promql: string;
  unit: string;
  series: MetricSeries[];
};
export type ApiMetrics = {
  captured_at: string;
  window: {
    start: number;
    end: number;
    step_seconds: number;
    minutes: number;
  };
  note?: string;
  // Real EKS capture schema (differs from the prototype's mock): latency is in
  // seconds, requests_by_status is a per-class rate series (2xx/4xx/5xx), node
  // utilisation is a per-instance ratio across the cluster's nodes, and the 5xx
  // error rate has no series when nothing failed.
  queries: {
    rps_total: MetricQuery;
    rps_by_handler: MetricQuery;
    requests_by_status: MetricQuery;
    latency_p50: MetricQuery;
    latency_p90: MetricQuery;
    latency_p95: MetricQuery;
    latency_p99: MetricQuery;
    error_rate_5xx: MetricQuery;
    node_cpu_utilization: MetricQuery;
    node_mem_utilization: MetricQuery;
  };
};

/* ---------- illustrative confusion matrix (Quality) ----------
   Not a published contract — derived to match the real per-class precision /
   recall / support, used only in the heatmap and always flagged "illustrative".
   Cell-level export is pending in evidence.json. */

export type ConfusionData = {
  labels: string[];
  matrix: number[][];
  note: string;
};

export const ILLUSTRATIVE_CONFUSION: ConfusionData = {
  labels: [
    "airplane", "apple", "banana", "bicycle", "bird", "car", "cat", "clock",
    "dog", "face", "fish", "house", "star", "tree", "umbrella",
  ],
  matrix: [
    [890, 2, 4, 4, 52, 3, 5, 3, 18, 3, 4, 1, 4, 4, 3],
    [3, 961, 2, 2, 6, 1, 3, 4, 8, 2, 2, 0, 2, 2, 2],
    [4, 1, 940, 3, 10, 2, 4, 3, 15, 2, 5, 1, 3, 4, 3],
    [2, 1, 2, 966, 6, 2, 2, 1, 10, 1, 2, 0, 2, 2, 1],
    [59, 4, 12, 10, 771, 7, 14, 9, 50, 7, 23, 2, 11, 12, 9],
    [6, 2, 5, 6, 14, 919, 6, 3, 17, 3, 5, 1, 4, 5, 4],
    [6, 2, 5, 4, 15, 3, 802, 4, 131, 8, 5, 1, 5, 5, 4],
    [2, 1, 2, 1, 5, 1, 2, 971, 7, 1, 2, 0, 2, 2, 1],
    [10, 3, 8, 7, 25, 5, 62, 6, 833, 10, 8, 1, 8, 8, 6],
    [5, 3, 4, 4, 13, 3, 5, 3, 20, 924, 4, 1, 4, 4, 3],
    [3, 1, 4, 2, 13, 2, 3, 2, 11, 2, 950, 0, 2, 3, 2],
    [2, 1, 2, 1, 5, 1, 2, 1, 7, 1, 2, 969, 2, 3, 1],
    [5, 2, 5, 4, 13, 3, 5, 3, 19, 3, 4, 1, 925, 4, 4],
    [3, 1, 2, 2, 7, 1, 3, 2, 11, 1, 2, 1, 2, 959, 3],
    [3, 1, 2, 2, 7, 2, 3, 2, 11, 2, 2, 0, 2, 5, 956],
  ],
  note:
    "illustrative — derived to match the real per-class precision/recall/support; cell-level data pending in evidence.json",
};
