# Portfolio — Design Decisions

Living record of the redesign. We **finalize the design fully before writing any
implementation code**, and implementation only begins once the design *and* the
mlops platform are both done. This file is the source of truth; it merges to `main`
when the design is finalized.

**Companion:** `PORTFOLIO_PLAN.md` (site scope/IA as originally planned — some of it
will be superseded by decisions here).

## Process (in order — do not skip ahead)

1. **Overall look, feel & theme** — _locked 2026-07-10_
2. **Layout** — the sections, and what goes on which page (site IA) — _locked 2026-07-16_
3. **Section-by-section design** — one section at a time, to a finalized spec ← _current stage_
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
- **No emojis anywhere on the site** (2026-07-16). Mature/editorial tone — use text or thin line
  icons instead. Supersedes the emoji used in `PORTFOLIO_PLAN.md`'s demo copy (feedback buttons,
  cold-start state).
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

## Stage 2 — Layout  _(LOCKED 2026-07-16)_

Sections, and what lives on which page. Revisited `PORTFOLIO_PLAN.md`'s IA (Home /
Journey / Projects / About / Resume) against the new direction and revised it.

### Locked

- **IA — six destinations: Home · Journey · Architecture · Skills · About · Contact** (2026-07-16).
  The original five-page split is revised, not preserved: there is **no standalone Projects or Résumé
  route**; the mlops deep-dive gets its own **Architecture** page (promoted into the menu), a
  dedicated **Skills** page is added, **About** carries the CV content (education + work history), and
  a **Contact** page is added.

  | Nav | Contains |
  |---|---|
  | **Home** | Hero + live canvas demo (the hook), then narrative teasers |
  | **Journey** | MDX devlog index — decisions, trade-offs, wrong turns (the differentiator) |
  | **Architecture** | mlops deep-dive — clickable diagram, per-component write-ups, evidence-hub links |
  | **Skills** | Dedicated skills page |
  | **About** | Bio + **education + work history** (the CV) |
  | **Contact** | Email + socials (GitHub, LinkedIn) |

- **Navigation pattern — top-right menu button + overlay** (2026-07-16). No persistent horizontal
  nav bar. A minimal top bar carries a **current-section indicator (left)** — see Hero spec — and a
  **menu toggle (top-right)** that opens an overlay listing the six destinations. Keeps the editorial layout uncluttered and lets the Home
  scroll breathe. Exact treatment is now specified in **Stage 3 → Navigation / menu**: hamburger
  **icon** trigger, slide-in **panel**, items revealed on a staircase stagger; top-bar left is a
  current-section indicator.

  **Resolved (2026-07-16):** the mlops deep-dive gets a **dedicated `/architecture` page**
  (clickable diagram, per-component write-ups, evidence-hub links), reached from Home §3 **and
  promoted into the overlay menu** as a top-level destination.

- **Home composition — five-part sticky scroll** (2026-07-16). Home does the Stage 0 job: hook
  with the playful demo, then reveal the serious machine behind it. The sequence also spends all
  four muted grounds in order, which settles the "which section takes which ground" item.

  | # | Section | Ground | Content |
  |---|---|---|---|
  | 1 | **Hero** | white | Bodoni Moda name + one-line positioning; minimal; scroll cue down |
  | 2 | **The live demo** | dusty blue `#3f5286` | "Draw something — my model will guess." Canvas + ochre confidence bars. The hook, placed early so it lands within one scroll |
  | 3 | **Behind the demo** | sage `#6f9d7e` | The reveal: that doodle ran through a real pipeline (ephemeral K8s, CI gates, drift). High-level architecture snapshot → "explore the full architecture" → `/architecture` |
  | 4 | **Journey teaser** | ochre `#c2701f` | 2–3 latest devlog entries → Journey |
  | 5 | **Skills + About teaser** | dusty rose `#b3637b` | Brief pointers → Skills, About; then footer |

  Grounds are heavily desaturated per Stage 1 (grounds only, never on type/controls). Ochre
  `#c98a3a` accent and calm expo reveals throughout.

### Open (next to decide, in order)

- Stage 2 (Layout) is now complete — IA, Home composition, and ground assignments all locked.
  Next is **Stage 3: section-by-section design**, starting with the Hero + live-demo sections.

---

## Stage 3 — Section-by-section design  _(IN PROGRESS)_

One section at a time, each to a locked spec (content, layout, type, motion).

### Navigation / menu  _(LOCKED 2026-07-16)_

- **Trigger:** a **hamburger icon** at top-right (not a "Menu" wordmark). Minimal top bar,
  current-section indicator left / icon right.
- **Surface:** a **slide-in panel** (not a full-screen overlay) — enters from the right, over a
  light scrim, so the page stays visible behind it.
- **Reveal — staircase stagger:** on open, each menu item slides in one after the next like a
  descending stair (incremental `transform: translateX/translateY` + opacity, ~40–60 ms delay per
  item), on Stage 1's `--ease-out-expo: cubic-bezier(.16, 1, .3, 1)`. GPU-composited only, never
  bouncy. On close, items can reverse or the panel simply slides out.
- **Items:** the six destinations as large **Bodoni Moda** links; ochre `#c98a3a` on hover/active.
- **Reduced motion:** with `prefers-reduced-motion`, drop the stagger and slide — items just
  fade/appear and the panel opens without translation.
- **Top-bar left slot:** not a static wordmark — a **current-section indicator** that reflects the
  section/page in view (see Hero spec). Icon stays top-right.

### Home §1 — Hero  _(LOCKED 2026-07-16)_

Direction: **name-forward** (chosen over demo-teasing / positioning statements). The type carries
it; no clever claim, no tagline. White ground.

- **Headline:** **Monish Kamwal** on **one line, centre-aligned**, set in **Bodoni Moda** display
  optical size for the thinnest hairlines; negative tracking (~−.02em). Centered in the viewport.
- **No micro-label / tagline.** The name stands alone.
- **Scroll cue:** a single ochre **down arrow (↓) only — no text**, at the bottom.
- **Top bar — current-section indicator (upper-left):** the upper-left shows the **section the
  visitor is currently in**, and is **blank on the Hero**. It updates as the scroll moves into later
  Home sections (and shows the page name on inner pages). Hamburger icon top-right as specced.
- **Motion:** headline does a calm expo reveal on load (opacity + small translate on
  `--ease-out-expo`); arrow follows subtly. Respects `prefers-reduced-motion`.
- **Scroll:** proceeds down into §2 the live demo — see the **Home §1 → §2 transition** spec below.

### Home §2 — Live demo  _(LOCKED 2026-07-16)_

The flagship hook. **Behavior** is already specced in `PORTFOLIO_PLAN.md` (raw strokes →
Lambda, ~400 ms predict-on-pause, top-3 confidence bars, cold-start warm-up ping, feedback,
GIF fallback). This is the **visual design** on the section ground. **No emojis** — all states and
buttons use text or thin line icons.

- **Ground — subtle desaturated wash** (per Stage 1, not a bold panel). A **pale grey-blue** derived
  from `#3f5286`, heavily lightened/desaturated on the white site; the canvas card lifts only
  gently off it. _Exact tint TBD in a token pass that derives all four section washes as a
  consistent set._
- **Layout — asymmetric split:** white **canvas card on the left**, live **predictions on the
  right**. Stacks on mobile (canvas on top, predictions below).
- **Section title:** **Draw something.** in Bodoni Moda, upper-left of the section. Current-section
  indicator reads **"Live demo"**.
- **Canvas:** a bright **white paper card** — soft hairline (`#e8e8e8`) + subtle shadow — as the
  draw surface (pointer + touch). Clear figure/ground against the wash.
- **Controls:** **Clear / Undo** as minimal Outfit text buttons beneath the canvas; ochre focus rings.
- **Predictions:** top-3 as **ochre `#c98a3a` confidence bars** — class label (Outfit) + percentage,
  fill animates on the expo ease when a new guess arrives. A muted prompt line ("try: cat, bicycle,
  umbrella…") pulls from the live class list.
- **Feedback:** a quiet "Did I get it?" with **text buttons — Yes / No** (thin line icons at most),
  no emoji; logged with the prediction, plus a one-line privacy note.
- **States:** cold-start shows a **text-only** "model is waking up — it scales to zero, that's the
  point" line; the API-unreachable **GIF fallback** renders inside the same card frame so the layout
  never jumps.
- **Motion:** card + bars reveal on scroll-in (expo); bar fills animate per prediction. Respects
  `prefers-reduced-motion`.

### Home §1 → §2 transition (Hero → Demo)  _(LOCKED 2026-07-16)_

**Feel: a mix of overlap + fade.** As the scroll begins the demo panel rises and takes over, while
the hero fades in place — three things happening on the same scroll:

- **Name fades in place:** the centered name **stays exactly where it is** (no drift/translate) and
  simply **fades away**; the ↓ arrow fades with it.
- **Background cross-fades:** while the panel rises, the page **background transitions white → pale
  tinted blue**, so the ground itself shifts colour under the motion.
- **Panel overlaps:** the **demo panel (pale grey-blue wash) rises up from below and overlaps the
  name** as the name is fading — one surface dealt over another.
- **Settle + reveal:** once the demo panel fills the viewport, its contents reveal in a short expo
  stagger — **canvas card first, then the confidence bars**.
- **Easing / perf:** scroll-linked on `--ease-out-expo`, ~.48s character; **GPU transform + opacity
  only**, never bouncy.
- **Reduced motion:** no rise or overlap — the background still settles to the tinted blue, the name
  fades, and the demo simply fades in.

### Home §3 — Behind the demo  _(LOCKED 2026-07-16)_

The reveal: recast the playful doodle as proof of real systems engineering, and hand off to the
`/architecture` page. Sage ground; section indicator reads **"Behind the demo"**.

- **Ground — sage wash** (desaturated `#6f9d7e`), per Stage 1. _Exact tint in the four-ground token
  pass._
- **Title:** **"Behind the Scenes"** in Bodoni Moda.
- **Lead:** one Outfit line — **"From strokes to prediction"**.
- **Teaser — simplified flow line:** a light horizontal line-diagram of the pipeline,
  **draw ▸ preprocess ▸ model ▸ serve ▸ monitor**. Thin hairline connectors with small arrows,
  Outfit stage labels; **non-interactive** (the clickable version lives on `/architecture`). Wraps to
  a vertical stack on mobile.
- **Action link:** an ochre **"Explore the full architecture →"** link that takes the visitor to
  the `/architecture` page.
- **Motion:** on scroll-in the flow stages reveal **left-to-right in sequence** (short expo
  stagger, echoing the pipeline direction); title + lead reveal first. Respects
  `prefers-reduced-motion` (stages appear together, no stagger).

### Home §4 — Journey teaser  _(LOCKED 2026-07-17)_

The devlog hand-off, drawn as an actual journey: the latest entries sit along a winding
downward path. Ochre ground; section indicator reads **"Journey"**.

- **Ground — ochre wash** (desaturated `#c2701f`), per Stage 1. _Exact tint in the four-ground
  token pass._
- **Title:** **"The Journey"** in Bodoni Moda, with one Outfit lead line beneath it:
  **"Roads not taken"**.
- **Layout — a winding path, not a list.** A thin hairline path curves down the section in
  **asymmetric S-curves** — never a straight timeline. The 2–3 latest entries hang off it,
  **alternating left and right of the path** with generous whitespace, and deliberately
  misaligned: two entries on the same side never share the same left edge.
- **Entry anchor:** each entry is marked by a **visible dot sitting on the path**. Dots use the
  ochre accent `#c98a3a`; _contrast against the ochre wash gets checked in the token pass —
  fallback is near-black `#0a0a0a`._
- **Entry content:** a small uppercase date label (Outfit, wide tracking), the entry title in
  **Bodoni Moda**, and one plain Outfit line about it. The title links to that entry on
  `/journey`; ochre on hover.
- **Action link:** an ochre **"Read the journey →"** link after the last entry, to `/journey`.
- **Path ending:** the path runs on past the last entry and **ends in a small downward arrow
  that leads into §5** — the Hero's ↓ cue, this time built into the drawing itself.
- **Mobile:** no room to alternate sides — the path straightens into a gentle near-vertical
  curve on the left, dots on it, entries stacked down its right.
- **Motion:** title + lead reveal first; then the **path draws itself downward** and each
  dot + entry reveals as the line reaches it (top-to-bottom sequence, expo ease — echoing §3's
  left-to-right pipeline reveal). If line-drawing proves janky in practice it degrades to a
  plain fade-in of the whole path. Respects `prefers-reduced-motion` (everything appears at
  once, no drawing, no stagger).

---

## Decision log

Newest first. Each entry: what was decided and why.

- **2026-07-17** — **Stage 3: Home §4 Journey teaser locked.** Layout is a **winding downward
  path**, not a list (Monish's idea, chosen over the proposed row/featured/card layouts): a thin
  hairline in asymmetric S-curves, the 2–3 latest entries alternating left/right of it with
  deliberate misalignment, each anchored by a dot on the path. Title **"The Journey"** with lead
  **"Roads not taken"**; ochre **"Read the journey →"** link; the path ends in a small down
  arrow that hands the scroll to §5. Rationale: the section's form says what the section is
  about — a journey with turns — and the ending arrow makes the sticky scroll feel continuous.
  Left to §5: nothing carried over; next section is the last on Home.
- **2026-07-16** — **Stage 3: Home §3 Behind the demo locked.** Sage-ground reveal — title
  **"Behind the Scenes"**, lead **"From strokes to prediction"**, and a **simplified,
  non-interactive flow line** (draw ▸ preprocess ▸ model ▸ serve ▸ monitor) that reveals
  left-to-right, plus an ochre **"Explore the full architecture →"** link to the `/architecture`
  page. The full clickable diagram stays on that page.
- **2026-07-16** — **Stage 3: Home §1→§2 transition locked.** A **mix of overlap + fade** — on
  scroll the **name fades in place** (no drift), the **background cross-fades white → tinted blue**,
  and the **demo panel rises to overlap** the fading name; then canvas → bars reveal in an expo
  stagger. Reduced-motion falls back to fades only. Closes the last item left open on §2.
- **2026-07-16** — **Stage 3: Home §2 Live demo locked + global no-emoji rule.** Visual design:
  **asymmetric split** (white canvas card left, ochre confidence bars right), on a **subtle
  desaturated grey-blue wash** of `#3f5286` (per Stage 1, not a bold panel); "Draw something."
  Bodoni Moda title. Added a **hard constraint: no emojis anywhere** — feedback becomes text
  Yes/No, cold-start is text-only, superseding `PORTFOLIO_PLAN.md`'s emoji copy. Left open: exact
  four-ground tint values (a later token pass) and the §1→§2 scroll transition.
- **2026-07-16** — **Stage 3: Home §1 Hero locked.** **Name-forward** direction — "Monish Kamwal"
  on one line, **centre-aligned** Bodoni Moda display, **no tagline/micro-label**, a single ochre
  **down-arrow** scroll cue (no text). Established the top-bar left slot as a **current-section
  indicator** (blank on Hero, updates on scroll / shows page name inside) rather than a static
  wordmark; reconciled the earlier nav notes to match. Demo transition still to design.
- **2026-07-16** — **Stage 3 opened: Navigation / menu locked.** Menu treatment settled — a
  **hamburger icon** trigger opening a **slide-in panel** (not full-screen), with each of the six
  items revealed on a **staircase stagger** (incremental delay, expo ease, GPU transform/opacity),
  large Bodoni Moda links, ochre hover. Respects `prefers-reduced-motion` (no stagger/slide).
- **2026-07-16** — **Nav pattern + IA finalized.** Navigation becomes a **top-right menu button
  opening an overlay** (no persistent nav bar) to keep the editorial layout uncluttered. Destinations
  finalized at **six: Home · Journey · Architecture · Skills · About · Contact** — a **Contact** page
  is added, and the mlops **Architecture** deep-dive is promoted from a Home-linked page into a
  top-level menu destination.
- **2026-07-16** — **Stage 2 (Layout) locked.** Home composition settled: a **five-part sticky
  scroll** — Hero (white) → Live demo (dusty blue) → Behind the demo (sage) → Journey teaser (ochre)
  → Skills/About teaser (dusty rose). Demo placed at §2 so the hook lands within one scroll; the
  scroll spends all four muted grounds in order, which also settles ground assignment. The mlops
  deep-dive gets a **dedicated `/architecture` page** reached from Home §3, kept out of the four-item
  nav for now. Stage 3 (section-by-section) is next.
- **2026-07-16** — **IA revised (Stage 2, first decision).** Down from five pages to four
  destinations: **Home · Journey · Skills · About**. No standalone Projects or Résumé route;
  **Skills** becomes its own page and **About** absorbs the CV (education + work history). Rationale:
  fewer, richer destinations fit the editorial direction, and a thin standalone Résumé didn't earn a
  nav slot. Left open: where the mlops platform deep-dive lives, to settle with Home composition.
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
