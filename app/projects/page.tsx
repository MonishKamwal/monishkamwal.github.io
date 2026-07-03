import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects — flagship: an end-to-end MLOps platform.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold sm:text-4xl">Projects</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Things I&apos;ve built or am building. The MLOps platform is the
        flagship — everything else orbits it.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/projects/mlops-platform"
          className="group rounded-xl border border-edge bg-panel p-6 transition-colors hover:border-accent sm:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-medium text-ink group-hover:text-accent">
              End-to-end MLOps platform
            </h2>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] text-accent">
              in progress · Phase 0
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            The full ML lifecycle, built in public on a shoestring budget: DVC
            data versioning, PyTorch training tracked in MLflow, CI/CD with a
            model quality gate, FastAPI serving on a scale-to-zero Lambda,
            weekly self-destroying EKS deployments via Terraform + Helm, and
            Evidently drift monitoring fed by the demo on this site&apos;s home
            page.
          </p>
        </Link>

        <a
          href="https://github.com/MonishKamwal/monishkamwal.github.io"
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-edge bg-panel p-6 transition-colors hover:border-accent"
        >
          <h2 className="font-medium text-ink group-hover:text-accent">
            This website
          </h2>
          <p className="mt-2 text-sm text-muted">
            Next.js static export on GitHub Pages, deployed by GitHub Actions.
            The drawing canvas on the home page is the platform&apos;s public
            face.
          </p>
        </a>

        <div className="rounded-xl border border-dashed border-edge p-6 opacity-60">
          <h2 className="font-medium text-muted">Next project</h2>
          <p className="mt-2 text-sm text-muted">
            Reserved. The platform comes first.
          </p>
        </div>
      </div>
    </div>
  );
}
