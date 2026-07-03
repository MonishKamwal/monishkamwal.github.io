import Link from "next/link";
import SketchDemo from "@/components/SketchDemo";

const pillars = [
  {
    title: "Train in CI",
    body: "GitHub Actions retrains the QuickDraw CNN on every model-affecting merge; MLflow tracks every run and artifact.",
    phase: "Phase 2 · planned",
  },
  {
    title: "Gate & deploy",
    body: "A quality gate compares challenger vs champion — regressions never ship. Winners land on a scale-to-zero Lambda.",
    phase: "Phase 1–2 · planned",
  },
  {
    title: "Ephemeral Kubernetes",
    body: "Terraform builds an EKS cluster every week, load-tests the model, publishes the evidence, and destroys itself.",
    phase: "Phase 3 · planned",
  },
  {
    title: "Watch for drift",
    body: "Visitor drawings (anonymous) feed weekly Evidently drift reports against the training distribution.",
    phase: "Phase 4 · planned",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-20 sm:pt-28">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-edge bg-panel px-3 py-1 text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
          Phase 0 · Foundations — building in public
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          I build machine-learning systems{" "}
          <span className="font-hand text-5xl text-accent sm:text-6xl">
            end to end.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-muted">
          I&apos;m Monish Kamwal. This site is the live frontend of an MLOps
          platform I&apos;m building from scratch — data versioning, training
          pipelines with quality gates, ephemeral Kubernetes deployments, and
          drift monitoring. Every claim links to a public artifact: a CI run, a
          report, a line of Terraform.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#demo"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-night transition-opacity hover:opacity-90"
          >
            Try the live demo
          </a>
          <Link
            href="/journey"
            className="rounded-md border border-edge bg-panel px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent"
          >
            Read the journey
          </Link>
        </div>
      </section>

      <SketchDemo />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold sm:text-3xl">Under the hood</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          The doodle box above is the tip of an iceberg. Each piece below gets
          built, demoed, and documented — in order.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {pillars.map((p) => (
            <Link
              key={p.title}
              href="/projects/mlops-platform"
              className="group rounded-xl border border-edge bg-panel p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-ink group-hover:text-accent">
                  {p.title}
                </h3>
                <span className="rounded-full bg-night px-2.5 py-0.5 font-mono text-[11px] text-muted">
                  {p.phase}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
