# Content

All site-facing copy lives here as JSON. The frontend reads it; editing text means editing
these files, not the components. Live numbers (model accuracy, drift, performance) are **not**
here — those are fetched at runtime from the mlops evidence hub's JSON contracts. This folder is
the *words*; the hub is the *data*.

## Conventions

- **`*_md` / `*_md` fields** hold Markdown (paragraphs, `**bold**`, light emphasis). Everything
  else is plain text.
- **`_note`** at the top of a file is a maintainer note to ourselves — not for display.
- **`{token}`** in a string is a live value the frontend interpolates at render (documented in
  that file's `_note`). Example: `monitoring.json`'s `{confidenceFrom}` / `{confidenceTo}`.
- **Evidence `href` values are pinned to real, verified URLs** (as of 2026-10-20) — mlops repo
  files on `main`, specific GitHub Actions runs (e.g. the blocked-deploy gate failure
  `29757829275`), and the live evidence hub. The one exception is `api-metrics.json`, which 404s
  until the first monthly EKS load test publishes a capture — see `data/performance.json`'s note.

## Files

| File | Page / area |
|---|---|
| `site.json` | Global: name, tagline, nav + menu groups, the two trays, contact + link placeholders |
| `home.json` | Home scroll: hero, live-demo copy + states, the three teasers, closing bookend |
| `architecture.json` | Architecture ("The Story"): overview, the plane/wire narrative scroll, clickable component cards, closing |
| `journey.json` | Journey devlog entries (stored newest-first; page renders oldest→newest) |
| `skills.json` | Skills: competencies with evidence links, shared crossings, the toolbox tail |
| `data/quality.json` | Data mode → Quality (frames live `evidence.json`) |
| `data/monitoring.json` | Data mode → Monitoring (frames live `drift.json` + `feedback.json`) |
| `data/performance.json` | Data mode → Performance (frames live `api-metrics.json`) |
| `about.json` | About: bio, Work + Education CV (newest-first), résumé link, contact |

## Where the copy came from

Rewritten for the site from the mlops repo's engineering docs — `README.md`, `ARCHITECTURE.md`,
and the `LEARNING.md` devlog — plus the finalized design in `DESIGN.md` and the three prototypes
(`transition-prototype.html`, `sections-prototype.html`, `data-prototype-white.html`). The source
docs are raw engineering records; the copy here is the reader-facing version, balanced for both
technical and non-technical visitors.

## Still open

- Nothing blocking — all content is written, wired, and live-data-backed.

## Resolved

- **About** — written from `public/resume.pdf` (CV, bio, contact).
- **Portrait** — `public/portrait.jpg`; wired into `about.json → bio.portrait`.
- **Contact details** — real email / GitHub / LinkedIn now in `site.json` and `about.json`.
- **Résumé PDF** — copied to `public/resume.pdf`; `about.json → resume.href` points at it.
- **Evidence links** — pinned to real, verified URLs across `architecture.json`, `skills.json`,
  `journey.json` (every entry), and the Data pages.
- **Performance page** — flipped to live: the first EKS load test published `api-metrics.json`
  (2026-10-20), and `data/performance.json` now frames the real contract (latency p50–p99,
  throughput, zero-5xx error rate, node CPU/mem) with `contractKeys` per section.
