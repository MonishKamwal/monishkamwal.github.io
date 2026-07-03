import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Monish Kamwal.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold sm:text-4xl">About</h1>

      <div className="mt-6 flex flex-col gap-4 text-muted">
        <p>
          I&apos;m Monish Kamwal. I&apos;m building an end-to-end MLOps
          platform in public — partly to learn the craft hands-on, partly so
          that when I say &quot;I can take a model from a notebook to
          monitored production&quot;, there&apos;s a URL that proves it.
        </p>
        <div className="rounded-xl border border-dashed border-edge p-5 text-sm">
          <span className="font-mono text-xs text-accent">[placeholder]</span>{" "}
          The real bio — background, interests, and what I&apos;m looking for —
          lands here during the Phase 4 polish pass. For now, the{" "}
          <a className="text-accent hover:underline" href="/journey">
            journey log
          </a>{" "}
          is the best picture of how I work.
        </div>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Tools I&apos;m working with</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          "Python",
          "PyTorch",
          "FastAPI",
          "Docker",
          "Kubernetes",
          "Terraform",
          "AWS",
          "GitHub Actions",
          "MLflow",
          "DVC",
          "TypeScript",
          "Next.js",
        ].map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-edge bg-panel px-3 py-1 font-mono text-xs text-muted"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
