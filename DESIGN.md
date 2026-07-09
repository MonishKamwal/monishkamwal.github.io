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

**Canva design** — photographer template (`design_inspo/`, decoded 2026-07-09). We take
its **type character only — NOT its color**.
- Display: high-contrast **couture/fashion serif**, ALL CAPS, with calligraphic **swash
  alternates** (curly `A` apex, swashy `M`/`R`, flourished terminals); dramatic thick↔thin.
  Closest free web match = **Fraunces**. This is the "type he loves."
- Body: warm old-style **serif** (Lora / Newsreader character) — so he likes serif body too.
- Utility: clean sans micro-labels/buttons, uppercase + letter-spaced.
- Its monochrome palette is **explicitly not adopted** — palette comes from os.me (Stage 1).

### Convergence (the core identity)

All three references center on a **high-contrast, elegant display serif** — Nocturne
Serif (os.me), Dahlia (omswami), swash couture serif (Canva). Settled: the site is built
around a **dramatic editorial serif**, with the **os.me light palette** for color.

---

## Stage 1 — Overall look, feel & theme  _(IN PROGRESS)_

### Locked

- **Theme — light mode only** (2026-07-09). Dark mode is optional and **deferred** until
  after the portfolio work is finished.
- **Palette — os.me light mode.** Warmth comes from the serif type + a warm ochre accent,
  **not** a cream ground (os.me's light ground is actually white).

  | Role | Hex | Notes |
  |---|---|---|
  | Page ground | `#ffffff` | `--background` |
  | Muted surface | `#f5f5f5` | panels, `--muted` / `--secondary` / `--accent` |
  | Hairline / input | `#e8e8e8` | `--border` |
  | Primary text | `#0a0a0a` | `--foreground` (near-black, not pure) |
  | Secondary text | `#828282` | `--muted-foreground` |
  | Solid button | `#0a0a0a` bg / `#fafafa` text | `--primary` |
  | **Warm accent** | `#c98a3a` | `--warm`; the one signature color |
  | Warm accent soft / glow | `#e8b87e` / `#f4cc9e38` | hovers, glows |
  | Section accents (optional) | `#3f5286` `#6f9d7e` `#c2701f` `#b3637b` | os.me muted per-section set |
  | Error | `#ef4444` | `--destructive` |

- **Type character — a high-contrast editorial/couture serif** (converged across all three
  references). Working display face = **Fraunces** (OFL/free; high-contrast with swash/wonk
  alternates) unless we license the exact Canva face.

### Open (next to decide, in order)

- [ ] **Body face: serif vs sans** — warm serif (Canva-style, e.g. Newsreader/Lora) vs a
      clean sans (Outfit, os.me's choice). Genuine fork; sets the whole feel. ← _decide next_
- [ ] Confirm the display font: Fraunces vs identifying + licensing the actual Canva swash serif.
- [ ] Accent model: warm ochre only, vs os.me-style per-section muted accents.
- [ ] Motion language: os.me sticky-scroll expo reveals + occasional omswami rotation/blend
      moments — confirm the intensity.

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

- **2026-07-09** — Canva screenshots decoded (`design_inspo/`): high-contrast couture
  swash serif. **Stage 1 locks:** light-mode only (dark deferred, optional); **palette =
  os.me light mode** (table above); **type character** from Canva/convergence = a
  high-contrast editorial serif (Fraunces as working face). Canva's *color* explicitly not
  adopted. Remaining Stage 1 forks: body face (serif vs sans) ← next, exact display font,
  accent model, motion.
- **2026-07-09** — Branch `design` created; this doc scaffolded. Taste settled
  (mature/warm/editorial, not childish); references os.me + omswami decoded into
  concrete specs above. Awaiting Canva screenshot to begin locking Stage 1.
