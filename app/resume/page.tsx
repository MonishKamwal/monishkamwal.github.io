import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Monish Kamwal.",
};

const sections = [
  {
    heading: "Experience",
    note: "Roles, dates, and impact bullets land here during Phase 4 polish.",
  },
  {
    heading: "Education",
    note: "Degrees and certifications land here.",
  },
  {
    heading: "Selected work",
    note: "The MLOps platform, with links to its evidence hub.",
  },
];

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold sm:text-4xl">Resume</h1>
        <button
          disabled
          title="Available with the Phase 4 polish pass"
          className="cursor-not-allowed rounded-md border border-edge bg-panel px-5 py-2.5 text-sm text-muted opacity-50"
        >
          Download PDF — coming soon
        </button>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {sections.map((s) => (
          <section
            key={s.heading}
            className="rounded-xl border border-dashed border-edge p-6"
          >
            <h2 className="text-lg font-medium text-ink">{s.heading}</h2>
            <p className="mt-2 text-sm text-muted">
              <span className="font-mono text-xs text-accent">
                [placeholder]
              </span>{" "}
              {s.note}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
