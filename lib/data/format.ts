// Data-mode formatters + the validated instrument palette, ported verbatim from
// data-prototype-white.html (the finalized design). The charts are hand-rolled
// SVG against this one grammar; colors come only from the validated instance
// (revalidated on #ffffff — mode identity rides the chrome, not the data ink).

// The chart palette (prototype's `C`). Status hues carry reserved meaning and
// always appear with an icon + label in the UI, never color alone.
export const C = {
  primary: "#2a78d6",
  deep: "#256abf",
  ref: "#8a93a1",
  ink: "#0a0a0a",
  mut: "#6b6b6b",
  grid: "#e7ebf1",
  axis: "#c9cfd9",
  card: "#ffffff",
  ok: "#0ca30c",
  okText: "#006300",
  watch: "#c98a3a",
  watchText: "#96600a",
  bad: "#d03b3b",
  // p50→p99 (validated ordinal ramp) and the capped sequential ramp (heatmap).
  ord: ["#86b6ef", "#3987e5", "#256abf", "#104281"],
  seq: [
    "#cde2fb", "#b7d3f6", "#9ec5f4", "#86b6ef", "#6da7ec", "#5598e7", "#3987e5",
    "#2a78d6", "#256abf", "#1c5cab", "#184f95", "#104281", "#0d366b",
  ],
} as const;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** A timestamp (ms, ISO string, or Date) → "27 Jul". */
export const fmtDay = (d: number | string | Date): string => {
  const t = new Date(d);
  return `${t.getUTCDate()} ${MONTHS[t.getUTCMonth()]}`;
};

/** A timestamp → "27 Jul 2026". */
export const fmtDayYear = (d: number | string | Date): string => {
  const t = new Date(d);
  return `${fmtDay(d)} ${t.getUTCFullYear()}`;
};

export const fmtComma = (n: number): string => n.toLocaleString("en-US");

export const fmtPct = (v: number, dp = 1): string => `${(v * 100).toFixed(dp)}%`;

export const fmt4 = (v: number): string => v.toFixed(4);

/** Parse the leading YYYY-MM-DD out of a loose date/timestamp string (UTC). */
export const parseEvDate = (s: string): Date => {
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return new Date(s);
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
};

/** The evidence contract's "2026-07-27 10:38 UTC" → "27 Jul 2026, 10:38 UTC". */
export const fmtEvidenceStamp = (s: string): string =>
  s
    .replace(" UTC", "")
    .replace(
      /(\d{4})-(\d{2})-(\d{2}) /,
      (_m, y, mo, d) => `${+d} ${MONTHS[+mo - 1]} ${y}, `,
    ) + " UTC";

/** A "nice" axis maximum (1/2/2.5/5/10 × 10ⁿ) above a raw value. */
export const niceMax = (v: number): number => {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};

export const clamp = (v: number, a: number, b: number): number =>
  Math.min(b, Math.max(a, v));
