import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MLOps platform",
  description:
    "An end-to-end MLOps platform: DVC, MLflow, CI/CD quality gates, Lambda + EKS serving, and drift monitoring.",
};

const components = [
  {
    name: "Data versioning & validation",
    tools: "DVC (S3 remote) · Pandera",
    phase: "Phase 2",
  },
  {
    name: "Training & experiment tracking",
    tools: "PyTorch CNN · MLflow (SQLite on S3)",
    phase: "Phase 1–2",
  },
  {
    name: "Model quality gate",
    tools: "challenger vs champion, blocks regressions",
    phase: "Phase 2",
  },
  {
    name: "Serving",
    tools: "FastAPI + ONNX Runtime · Lambda Function URL (scale-to-zero)",
    phase: "Phase 1",
  },
  {
    name: "Ephemeral Kubernetes",
    tools: "Terraform · EKS · Helm · k6 — weekly spin-up & teardown",
    phase: "Phase 3",
  },
  {
    name: "Monitoring & drift",
    tools: "prediction logs on S3 · Evidently reports",
    phase: "Phase 4",
  },
];

export default function MlopsPlatformPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">MLOps platform</h1>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
          in progress · Phase 0
        </span>
      </div>

      <p className="mt-4 max-w-3xl text-muted">
        A demonstration of the full ML lifecycle on a deliberately small
        problem: recognizing hand-drawn sketches (15 QuickDraw classes). The
        model is trivial by design — the engineering around it is the project.
        Two hosting tiers keep it nearly free: an always-on scale-to-zero
        Lambda serves the live demo, and a weekly, fully ephemeral EKS cluster
        demonstrates real Kubernetes operations before destroying itself.
      </p>

      <h2 className="mt-12 text-xl font-semibold">The lifecycle</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {components.map((c) => (
          <li
            key={c.name}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-edge bg-panel px-5 py-4"
          >
            <div>
              <p className="font-medium text-ink">{c.name}</p>
              <p className="mt-0.5 text-sm text-muted">{c.tools}</p>
            </div>
            <span className="rounded-full bg-night px-2.5 py-0.5 font-mono text-[11px] text-muted">
              {c.phase}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold">Architecture</h2>
      <div className="mt-5 rounded-xl border border-dashed border-edge p-8 text-center text-sm text-muted">
        Interactive architecture diagram lands here in Phase 3.
        <br />
        Until then, the full design is in{" "}
        <a
          className="text-accent hover:underline"
          href="https://github.com/MonishKamwal/mlops/blob/main/PLAN.md"
          target="_blank"
          rel="noreferrer"
        >
          PLAN.md
        </a>
        .
      </div>

      <h2 className="mt-12 text-xl font-semibold">Evidence</h2>
      <div className="mt-5 rounded-xl border border-dashed border-edge p-8 text-center text-sm text-muted">
        The evidence hub — MLflow experiment history, Evidently drift reports,
        k6 load-test results, CI runs — goes live with Phase 2 at{" "}
        <span className="font-mono">monishkamwal.github.io/mlops</span>.
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <a
          className="rounded-md border border-edge bg-panel px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent"
          href="https://github.com/MonishKamwal/mlops"
          target="_blank"
          rel="noreferrer"
        >
          Platform repo →
        </a>
        <a
          className="rounded-md border border-edge bg-panel px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent"
          href="https://github.com/MonishKamwal/mlops/blob/main/PLAN.md"
          target="_blank"
          rel="noreferrer"
        >
          Read the plan →
        </a>
      </div>
    </div>
  );
}
