import Link from "next/link";
import type { Metadata } from "next";
import { journeyEntries } from "@/lib/journey";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "A devlog of building an MLOps platform in public — decisions, trade-offs, and wrong turns.",
};

export default function JourneyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold sm:text-4xl">
        The{" "}
        <span className="font-hand text-4xl text-accent sm:text-5xl">
          journey
        </span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        An insider&apos;s devlog of building the platform: the options I
        considered, what I chose and why, and what went wrong along the way.
        Written while building, not after.
      </p>

      <ul className="mt-10 flex flex-col gap-4">
        {journeyEntries.map((entry) =>
          entry.published ? (
            <li key={entry.slug}>
              <Link
                href={`/journey/${entry.slug}`}
                className="group block rounded-xl border border-edge bg-panel p-5 transition-colors hover:border-accent"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-medium text-ink group-hover:text-accent">
                    {entry.title}
                  </h2>
                  <span className="font-mono text-xs text-muted">
                    {entry.date} · {entry.phase}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{entry.summary}</p>
              </Link>
            </li>
          ) : (
            <li
              key={entry.slug}
              className="rounded-xl border border-dashed border-edge p-5 opacity-60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium text-muted">{entry.title}</h2>
                <span className="font-mono text-xs text-muted">
                  coming with {entry.phase}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{entry.summary}</p>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
