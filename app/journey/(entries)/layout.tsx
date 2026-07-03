import Link from "next/link";

export default function JourneyEntryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/journey"
        className="font-mono text-sm text-muted hover:text-accent"
      >
        ← all entries
      </Link>
      <article className="prose prose-invert prose-zinc mt-8 max-w-none prose-headings:font-semibold prose-a:text-accent prose-code:text-accent">
        {children}
      </article>
    </div>
  );
}
