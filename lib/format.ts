// Human-facing formatters shared across the site.

/** "2026-07-24" → "24 Jul 2026" (en-GB, the site's date style). */
export function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
