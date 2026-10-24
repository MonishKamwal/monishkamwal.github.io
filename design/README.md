# Design artifacts

Standalone HTML design files, kept out of the app source. Open any of them
directly in a browser — they have no build step.

## `prototypes/`

The **finalized design spec**. The real site (Next.js app under `app/`,
`components/`, `lib/`) is built to match these; `DESIGN.md` is their
carbon-copy spec. Source comments across the codebase reference these by name
(e.g. "ported from `sections-prototype.html`").

- `transition-prototype.html` — Home (the six-section scroll)
- `sections-prototype.html` — Story pages (Journey, Architecture, Skills, About)
- `data-prototype-white.html` — Data mode (Quality, Monitoring, Performance)

## `sketches/`

Exploratory, superseded design studies kept for reference. Not the spec —
these fed into the prototypes above.
