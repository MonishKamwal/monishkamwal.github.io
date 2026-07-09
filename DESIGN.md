# Portfolio — Design Decisions

Living record of the redesign. We **finalize the design fully before writing any
implementation code**, and implementation only begins once the design *and* the
mlops platform are both done. This file is the source of truth; it merges to `main`
when the design is finalized.

**Companion:** `PORTFOLIO_PLAN.md` (site scope/IA as originally planned — some of it
will be superseded by decisions here).

## Process (in order — do not skip ahead)

1. **Overall look, feel & theme** ← _current stage_
2. **Layout** — the sections, and what goes on which page (site IA)
3. **Section-by-section design** — one section at a time, to a finalized spec
4. **Finalize** — the whole design reviewed and locked
5. **Implement** — only after 1–4 *and* the mlops project are complete

Each decision gets logged with a date and a short rationale. Open questions stay
visible until resolved. Nothing here is built until Stage 5.

---

## Stage 0 — Constraints & taste (settled)

**Aesthetic:** mature, clean, calm, **warm, editorial, serif-led**. Confident but not
loud. Explicitly **not** playful/childish — a doodle/handwriting-themed direction was
tried and rejected (2026-07-09) as "childish and unfashionable."

**Positioning tension to resolve in Stage 1:** the home page is both a *playful live
demo* (visitors doodle, a model guesses) and proof of *serious systems engineering*
(pipelines, gates, ephemeral K8s, drift). Calibration chosen: **expressive** end of
the scale — warm/artistic with personality, à la omswami — over minimal/calm.

**Hard constraints:**
- Next.js static export on GitHub Pages (see `PORTFOLIO_PLAN.md`). It's a
  version-modified Next.js — read `node_modules/next/dist/docs/` before any code.
- Existing token setup is Tailwind `@theme` in `app/globals.css` (to be replaced).
- The live demo (canvas → Lambda → confidence bars) is the flagship and stays.

### Reference sites (decoded from their actual CSS)

**os.me** — "clean, mature, calm"; the scroll where "one section rolls into the next."
- Type: *Nocturne Serif* headlines at **weight 300/100**, `line-height: .85`, negative
  tracking (−.02…−.04em); **Outfit** geometric sans for body/UI; wide-tracked uppercase
  micro-labels (`letter-spacing: .22em`).
- Palette: warm neutrals — light paper `#f4f1ec`, hairline `#e8e8e8`; dark = warm
  near-black `#1c1814`, border `#26221c`. Muted, desaturated **per-section** accents
  (dusty blue `#3f5286`, sage `#6f9d7e`, ochre `#c2701f`, dusty rose `#b3637b`) — never
  one loud pop.
- Motion: sticky sections + transform/opacity reveals on
  `--ease-out-expo: cubic-bezier(.16, 1, .3, 1)` (~.48s). Calm, GPU-smooth, never bouncy.

**omswami.com** — "creative, non-static" presentation of information (our expressive north star).
- Type: *Mondia* / *MondiaThin* / *MondiaMedium* + *Dahlia* display + a *MilitaryScribe*
  script used sparingly for accents.
- Palette: warm **parchment/clay** — `#ece3d2`, `#e0d6c3`, `#ded4c1`, `#c6bba6`,
  `#c9beab`, `#c0b5a0`; text warm-charcoal `#373636` (never pure black).
- Motion: slow `cubic-bezier(.22, .61, .36, 1)` transitions with subtle rotations
  (−12°, 7°) and `mix-blend-mode`.

**Canva design** (font/text treatment liked, layout not) — login-gated; **screenshot +
font name pending** as of 2026-07-09. Likely decides the display typeface.

---

## Stage 1 — Overall look, feel & theme  _(IN PROGRESS)_

Decisions to make here: the **theme** (light / dark / both), the **palette** (grounds,
text, accent system), the **type pairing** (display + body + accent), and the **motion
language**. Everything downstream inherits these.

### Decisions
- _none locked yet_

### Open questions
- [ ] Canva screenshot + font name → sets the display typeface direction.
- [ ] Light-first, dark-first, or both themes? (os.me does both, warm on each.)
- [ ] Display serif: license-friendly stand-in for Nocturne/Dahlia (candidates:
      Instrument Serif, Fraunces, Newsreader) vs. a licensed face.
- [ ] Body sans: keep **Outfit** (os.me's choice, free) or alternative.
- [ ] Accent model: single muted accent vs. os.me-style per-section accent set.
- [ ] Warmth level: os.me warm-neutral vs. omswami warmer parchment/clay.

---

## Stage 2 — Layout  _(not started)_

Sections, and what lives on which page. Revisits `PORTFOLIO_PLAN.md`'s IA (Home /
Journey / Projects / About / Resume) against the new direction.

---

## Stage 3 — Section-by-section design  _(not started)_

One section at a time, each to a locked spec (content, layout, type, motion).

---

## Decision log

Newest first. Each entry: what was decided and why.

- **2026-07-09** — Branch `design` created; this doc scaffolded. Taste settled
  (mature/warm/editorial, not childish); references os.me + omswami decoded into
  concrete specs above. Awaiting Canva screenshot to begin locking Stage 1.
