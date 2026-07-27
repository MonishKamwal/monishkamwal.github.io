# MLOps data contracts — reference for this site

The [MLOps platform](https://github.com/MonishKamwal/mlops) publishes **styling-agnostic JSON**
to its evidence hub; this site is what renders it into styled UI. This file is the reference for
**what's published, where, and in what shape** — so we don't have to go spelunking in the mlops
repo every time we wire up a component.

**Source of truth is the mlops repo.** These contracts are *generated* — never hand-edit them
here, and never assume a field that isn't listed below. If a contract needs to change, it changes
on the producing side (mlops) and this doc gets updated to match.

- **Hub base URL:** `https://monishkamwal.github.io/mlops/`
- All schemas below are **illustrative** (annotated with `//` comments for readability — the real
  files are plain JSON). Numbers are rounded to 4 dp on the producing side.
- Availability of any given file on the hub is a moving target (some publish weekly, some monthly);
  treat every fetch as "may 404 / may be empty" and degrade gracefully.

## Index

| Contract | Hub path | Produced by | Cadence | What it's for |
|---|---|---|---|---|
| `evidence.json` | `/mlops/evidence.json` | evidence-pages (MLflow registry) | every model deploy | Model quality: champion, runs, per-class F1, gate |
| `drift.json` | `/mlops/drift.json` | drift-report | weekly | Output-distribution drift vs reference |
| `drift_history.json` | `/mlops/drift_history.json` | drift-report | weekly | Drift trend over time |
| `feedback.json` | `/mlops/feedback.json` | drift-report | weekly | Proxy accuracy from 👍/👎 |
| `feedback_history.json` | `/mlops/feedback_history.json` | drift-report | weekly | Proxy-accuracy trend |
| `api-metrics.json` | `/mlops/api-metrics.json` | eks-demo | monthly | Live latency/throughput series (Prometheus) |
| `architecture.json` | `/mlops/portfolio/architecture.json` | evidence-pages (`architecture_edit.md`) | on doc edit | Narrative: architecture, section by section |
| `journey.json` | `/mlops/portfolio/journey.json` | evidence-pages (`learning_edit.md`) | on doc edit | Narrative: dated devlog timeline |

Also published, **not** styling-agnostic (reference only, not for the site's own components):
`drift.html` (Evidently's own report), `index.html` + `style.css` (the hub's throwaway render),
`confusion_matrix.png`, and `MODEL_CARD.md` (raw markdown at the mlops repo root).

---

## Narrative contracts

These two are the ones we author by hand in `mlops/portfolio/*_edit.md`; the converter copies each
section's **raw markdown** through unchanged, so `body_md` fields are markdown to be rendered.

### `architecture.json`

```jsonc
{
  "title": "Architecture",
  "subtitle": "How the QuickDraw MLOps platform fits together",
  "source": "ARCHITECTURE.md",        // any front-matter keys pass through
  "lede": "optional intro markdown before the first section (may be absent)",
  "sections": [
    {
      "id": "system-overview",        // slug of the heading, stable anchor
      "title": "System overview",
      "body_md": "raw markdown — may contain mermaid fences, lists, emoji"
    }
    // ... one per `##` heading, in document order
  ]
}
```

### `journey.json`

```jsonc
{
  "title": "Build journey",
  "subtitle": "Things I learned building an MLOps platform on a $0 budget",
  "source": "LEARNING.md",
  "entries": [                         // newest-first (file order); sort if you need
    {
      "date": "2026-07-24",            // parsed from the `## YYYY-MM-DD — headline` heading
      "title": "The retrain flywheel, proven end to end",
      "slug": "the-retrain-flywheel-proven-end-to-end",
      "body_md": "raw markdown body of the entry"
    }
    // ...
  ]
}
```

---

## Model-quality contract

### `evidence.json`

Rendered from the MLflow registry — the source of truth for champion state.

```jsonc
{
  "generated_at": "2026-07-24 18:30 UTC",
  "model_name": "quickdraw",
  "repo_slug": "MonishKamwal/mlops",
  "champion": {                        // the current champion run (or null if none)
    "version": "2",
    "alias": ["champion", "challenger"],
    "test_accuracy": 0.917,
    "macro_f1": 0.916,
    "run_id": "…",
    "created": "…"                     // shape = one row of `runs` below
  },
  "runs": [                            // every registered version, for the runs table + charts
    { "version": "2", "alias": ["champion"], "test_accuracy": 0.917, "macro_f1": 0.916, "run_id": "…", "created": "…" }
  ],
  "per_class": [                       // per-class eval metrics (from the eval report)
    { "cls": "cat", "precision": 0.84, "recall": 0.83, "f1": 0.84, "support": 1500 }
  ],
  "gate": { "min_test_accuracy": 0.85, "epsilon": 0.005 },
  "blocked_gate_run_url": "https://github.com/…/actions/runs/…"  // the failing-gate demo
}
```

> The exact `runs`/`champion` field set mirrors the registry rows; treat `champion` as "one element
> of `runs`, or `null`." The confusion matrix is a **separate PNG** (`confusion_matrix.png`), not in
> this JSON.

---

## Monitoring contracts

### `drift.json`

Output-distribution drift (the model's predictions), not input-pixel drift. Numeric columns
(`confidence`, `margin`) carry a histogram; the categorical column (`predicted_label`) carries
class shares.

```jsonc
{
  "generated_at": "2026-07-23T07:00:00+00:00",
  "window": { "n_reference": 15000, "n_current": 10 },   // sample sizes compared
  "dataset_drift": {
    "drifted_columns": 3,
    "share": 1.0,                       // fraction of columns drifted
    "drift_detected": true
  },
  "columns": {
    "confidence": {
      "type": "numerical",
      "method": "wasserstein",          // per-column drift metric
      "score": 0.44,
      "threshold": 0.1,
      "drifted": true,
      "distribution": {                 // for numeric: shared-bin histograms
        "bin_edges": [0.0, 0.1, /* … */ 1.0],
        "reference": { "counts": [/* … */], "mean": 0.909, "median": 0.997 },
        "current":   { "counts": [/* … */], "mean": 0.832, "median": 0.81 }
      }
    },
    "margin": { "type": "numerical", "method": "wasserstein", "score": 0.09, "threshold": 0.1, "drifted": false, "distribution": { /* … */ } },
    "predicted_label": {
      "type": "categorical",
      "method": "jensenshannon",
      "score": 0.66,
      "threshold": 0.1,
      "drifted": true,
      "distribution": {                 // for categorical: per-class share
        "labels": ["cat", "dog", /* … */],
        "reference": { "cat": 0.05, "dog": 0.05 },
        "current":   { "cat": 0.20, "dog": 0.10 }
      }
    }
  }
}
```

### `drift_history.json`

An array of trend points (one per run, idempotent per day):

```jsonc
[
  { "date": "2026-07-23", "generated_at": "2026-07-23T07:00:00+00:00",
    "drift_share": 1.0, "drifted_columns": 3,
    "confidence_mean": 0.832 /* + a few summary fields off drift.json */ }
]
```

### `feedback.json`

Proxy accuracy from visitor 👍/👎 verdicts. **An empty window is normal** (feedback is sparse):
`n: 0` and `accuracy: null` — never treat that as an error.

```jsonc
{
  "generated_at": "2026-07-23T07:00:00+00:00",
  "window": { "n": 24, "n_correct": 14 },
  "accuracy": 0.583,                    // null when n == 0
  "by_class":  [ { "label": "cat", "n": 5, "n_correct": 3, "accuracy": 0.6 } ],
  "by_source": [ { "source": "canvas", "n": 20, "n_correct": 12, "accuracy": 0.6 } ]
}
```

### `feedback_history.json`

```jsonc
[
  { "date": "2026-07-23", "generated_at": "2026-07-23T07:00:00+00:00",
    "n": 24, "n_correct": 14, "accuracy": 0.583 }
]
```

---

## Live-ops contract

### `api-metrics.json`

The raw Prometheus time-series behind the Grafana panels, captured during the monthly EKS load
test — so the site can render its own styled charts. Each query is **best-effort**: a failed query
yields `series: []` plus an `error`, never sinking the rest.

```jsonc
{
  "captured_at": "2026-07-24T12:00:00+00:00",
  "window": { "start": 1690, "end": 1690, "step_seconds": 15, "minutes": 15 },  // unix seconds
  "queries": {
    // keys: rps_total, rps_by_handler, requests_by_status,
    //       latency p50/p90/p95/p99, error_rate, node_cpu_utilization, node_mem_utilization
    "rps_total": {
      "promql": "sum(rate(http_requests_total[1m]))",
      "unit": "reqps",
      "series": [
        {
          "labels": { /* Prometheus metric labels, e.g. {"handler": "/predict"} */ },
          "points": [ [1690, 198.7], /* [unix_seconds, value] … */ ]
        }
      ]
    }
    // "error_rate": { …, "series": [] , "error": "…" }   // on a failed query
  }
}
```

---

## Consuming these

- The site is a static export, so contracts are most naturally fetched **at build time** (and/or
  client-side for anything that should feel live, like `api-metrics.json`).
- `body_md` fields are **markdown** — run them through the site's markdown renderer; they may
  include mermaid fences and emoji.
- Always code for **absent or empty**: a contract may not be published yet, or may legitimately be
  empty (`feedback.json` with `n: 0`, a query with `series: []`).
