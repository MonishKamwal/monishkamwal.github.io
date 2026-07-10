# Portfolio — Design Decisions

Living record of the redesign. We **finalize the design fully before writing any
implementation code**, and implementation only begins once the design *and* the
mlops platform are both done. This file is the source of truth; it merges to `main`
when the design is finalized.

**Companion:** `PORTFOLIO_PLAN.md` (site scope/IA as originally planned — some of it
will be superseded by decisions here).

## Process (in order — do not skip ahead)

1. **Overall look, feel & theme** — _locked 2026-07-10_
2. **Layout** — the sections, and what goes on which page (site IA) ← _current stage_
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
  This is the "type he loves." Read closer (2026-07-10): it is a **geometric didone** —
  hairline strokes, near-circular bowls, tall caps. The exact face is unidentified.
  ~~Closest free web match = Fraunces.~~ **Corrected:** Fraunces is a soft, chunky,
  low-contrast old-style with slab serifs — close to the opposite of the reference. The
  didone-territory free faces are Bodoni Moda, Playfair Display, Prata, Italiana.
- Body: the template used a serif, but **we do not adopt this** — only the display/title
  character is taken from Canva; body is Outfit sans (Stage 1).
- Its monochrome palette is **explicitly not adopted** — palette comes from os.me (Stage 1).

### Convergence (the core identity)

All three references center on a **high-contrast, elegant display serif** — Nocturne
Serif (os.me), Dahlia (omswami), swash couture serif (Canva). Settled: the site is built
around a **dramatic editorial serif**, with the **os.me light palette** for color.

---

## Stage 1 — Overall look, feel & theme  _(LOCKED 2026-07-10)_

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
  | Section tints | `#3f5286` `#6f9d7e` `#c2701f` `#b3637b` | os.me muted set — **grounds only**, heavily desaturated; never on type or controls |
  | Error | `#ef4444` | `--destructive` |

- **Type — editorial serif titles + Outfit sans everything else** (os.me's proven model):
  - *Headers / titles only:* **Bodoni Moda** (OFL, variable) — locked 2026-07-10. A true
    didone: the high-contrast, hairline, geometric character of the Canva reference. Use its
    **display optical sizes** at large sizes to get the thinnest hairlines. Set all-caps for
    section titles, with negative tracking at display sizes.
  - **Accepted loss:** Bodoni Moda has no swash alternates, so the reference's curly `A` /
    splayed `M` are *not* reproduced. The contrast and elegance carry the character instead.
    If swashes later prove essential, that means licensing the real face (see Stage 0).
  - *Everything else* — body, nav, buttons, data, code: **Outfit** (OFL sans; os.me's
    choice). System monospace stack for code/metrics.
  - The Canva reference is adopted for **titles only**, never body.

- **Accent model — ochre primary + section tints** (2026-07-10). Warm ochre `#c98a3a` is the
  single interactive/emphasis color: links, buttons, focus, confidence bars, hovers. The os.me
  muted set (`#3f5286` `#6f9d7e` `#c2701f` `#b3637b`) appears **only** as large, low-saturation
  section grounds — never on type, never on controls. More expressive than one flat color,
  without four competing accents.

- **Motion — calm reveals only** (2026-07-10). os.me's model: sticky sections plus
  transform/opacity reveals on `--ease-out-expo: cubic-bezier(.16, 1, .3, 1)`, ~.48s.
  GPU-composited properties only; never bouncy. omswami's rotation/`mix-blend-mode` set pieces
  are **not** adopted. Respect `prefers-reduced-motion`.

---

## Stage 2 — Layout  _(IN PROGRESS)_

Sections, and what lives on which page. Revisits `PORTFOLIO_PLAN.md`'s IA (Home /
Journey / Projects / About / Resume) against the new direction.

### Open (next to decide, in order)

- [ ] Does the IA survive? Confirm or revise the five-page split (Home / Journey / Projects /
      About / Resume) against the editorial direction. ← _decide next_
- [ ] Home page composition: what the sticky-scroll sequence is, and where the live canvas
      demo sits within it.
- [ ] Which sections take which of the four muted grounds.

---

## Stage 3 — Section-by-section design  _(not started)_

One section at a time, each to a locked spec (content, layout, type, motion).

---

## Decision log

Newest first. Each entry: what was decided and why.

- **2026-07-10** — **Stage 1 locked; Stage 2 (Layout) opened.** Three final Stage 1 decisions:
  - *Display font = **Bodoni Moda***. Re-reading `design_inspo/` showed the Canva face is a
    geometric didone (hairline, circular bowls, tall caps), so the previously recorded working
    face **Fraunces was wrong** — it's a soft, low-contrast old-style with slab serifs, close to
    the opposite. Bodoni Moda is the nearest free face with a real weight range; Italiana matches
    more closely but ships one weight, which won't carry a type scale. Cost accepted: no swashes.
  - *Accent = **ochre primary + section tints***. Ochre `#c98a3a` alone for everything
    interactive; the muted set demoted to section grounds only. Keeps one signature color while
    still giving each section its own identity for the sticky scroll.
  - *Motion = **calm reveals only***. os.me expo reveals; omswami's rotations/blends dropped.
    Stage 0's "expressive" calibration is carried by *type and color*, not movement — expressive
    motion read as the bigger risk of tipping back toward "loud."
- **2026-07-09** — Body face resolved: **Outfit sans** for all body/UI/data/code; the
  Canva editorial serif is used for **headers/titles only** (os.me's serif-display +
  Outfit-sans model). Type pairing locked.
- **2026-07-09** — Canva screenshots decoded (`design_inspo/`): high-contrast couture
  swash serif. **Stage 1 locks:** light-mode only (dark deferred, optional); **palette =
  os.me light mode** (table above); **type character** from Canva/convergence = a
  high-contrast editorial serif (Fraunces as working face). Canva's *color* explicitly not
  adopted. Remaining Stage 1 forks: body face (serif vs sans) ← next, exact display font,
  accent model, motion.
- **2026-07-09** — Branch `design` created; this doc scaffolded. Taste settled
  (mature/warm/editorial, not childish); references os.me + omswami decoded into
  concrete specs above. Awaiting Canva screenshot to begin locking Stage 1.
