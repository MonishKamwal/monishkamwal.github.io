# Content

All site-facing copy lives here as JSON. The frontend reads it; editing text means editing
these files, not the components. Live numbers (model accuracy, drift, performance) are **not**
here — those are fetched at runtime from the mlops evidence hub's JSON contracts. This folder is
the *words*; the hub is the *data*.

**Schemas match the finalized prototypes / `DESIGN.md`** (aligned 2026-10-21). The typed shape of
every file is in `lib/content.ts`; each file's `_note` says which prototype/page it maps to.

## Conventions

- **`*_md` / `*_md` fields** hold Markdown (paragraphs, `**bold**`, light emphasis). Everything
  else is plain text.
- **`_note`** at the top of a file is a maintainer note to ourselves — not for display.
- **`{token}`** in a string is a live value the frontend interpolates at render (documented in
  that file's `_note`). Example: `monitoring.json`'s `{refMean}` / `{curMean}`, `quality.json`'s
  `{floor}` / `{eps}`.
- **Evidence `href` values are pinned to real, verified URLs** — mlops repo files on `main`,
  specific GitHub Actions runs (e.g. the blocked-deploy gate failure `29757829275`), and the live
  evidence hub (incl. `api-metrics.json`, published 2026-10-20).

## Files

| File | Page / area |
|---|---|
| `site.json` | Global: name, tagline, nav + menu groups, the two trays, contact + links |
| `home.json` | Home scroll: hero, demo copy + states, teasers (`architecture` arch-deck · `journey` featuredSlugs · `skills`), icon-trio bookend |
| `architecture.json` | Architecture: camera-ordered `blocks` (overview/planes/wires/end) with `io` rows + `parts` (clickable isometric cubes → paper cards) |
| `journey.json` | Journey: `phases` (chip headings) + `entries` (stored newest-first; page renders oldest→newest; each opens a paper card) |
| `skills.json` | Skills: `stops` (camera order) · `competencies` (per-tool receipts) · `crossings` (shared tools) · `toolbox` |
| `data/quality.json` | Data → Quality: `panels` framing live `evidence.json` |
| `data/monitoring.json` | Data → Monitoring: `panels` framing live `drift.json` + `feedback.json` |
| `data/performance.json` | Data → Performance: `panels` framing live `api-metrics.json` |
| `about.json` | About: `hero` · `education` · `work` (serpentine) · `projects` — each entry has a `card` (paper-card body) |

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
