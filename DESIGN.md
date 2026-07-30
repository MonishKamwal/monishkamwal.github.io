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
3. **Section-by-section design** — one section at a time, to a finalized spec — _locked 2026-07-17_
4. **Finalize** — the whole design reviewed and locked — _locked 2026-07-17_
5. **Implement** — only after 1–4 *and* the mlops project are complete ← _next; waits on the mlops build_

Each decision gets logged with a date and a short rationale. Open questions stay
visible until resolved. Nothing here is built until Stage 5.

> **2026-07-26 — the IA is reopened.** Once the mlops platform began publishing live data
> contracts (six JSON files — see `portfolio/DATA_CONTRACTS.md`), the six-destination IA locked
> in Stages 2–3 no longer fit: it had **no home for the four monitoring/quality contracts**
> (evidence, drift, feedback, api-metrics) and only linked out to the hub. The IA is reworked into
> **two internal "modes" (Story and Data), plus Home and About** — see **"IA rework (2026-07-26)"**
> near the end of the design body. It **supersedes the Stage 2 IA** and adds the Data-mode pages.
> **Nothing is re-locked** — this is the new working direction while the visual design is reworked
> too; the older "LOCKED" section specs below remain useful for grammar (cards, trays, tints, motion)
> even where the IA around them has moved.

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
  | Secondary text | `#6b6b6b` | `--muted-foreground`; darkened from os.me's `#828282` in Stage 4 — the original fails AA for small text |
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
  **Amended in Stage 4.5 (2026-07-19):** reveals are **scroll-scrubbed** (with clocked
  money-moment exceptions), all durations hang off one `--dur` token, and the Home
  scroll has **hard snap floors** — see Stage 4.5.

---

## Stage 2 — Layout  _(LOCKED 2026-07-16 · IA SUPERSEDED 2026-07-26)_

> **IA superseded 2026-07-26.** The "six destinations" IA below is reworked into **two internal
> modes plus Home and About** — see **"IA rework (2026-07-26)"** near the end of the doc. The Home
> composition, ground assignments, and the funnel-through-the-demo model still hold; what changed is
> the *destination set* (the monitoring/quality contracts are now first-class Data-mode pages, not
> just links out to the hub).

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
  | **Contact** | *(Stage 4.5)* menu entry → **Home's closing bookend**; no standalone page |

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
  | 5 | **Skills + closing** | dusty rose `#b3637b` | Skills content — ends on "See all skills →" (Stage 4.5 moved button + footer to the bookend) |
  | 6 | **Bookend** *(added Stage 4.5)* | white | "Say hello." + icon trio (mail copies address) + "Or learn more about me →" |

  Grounds are heavily desaturated per Stage 1 (grounds only, never on type/controls). Ochre
  `#c98a3a` accent and calm expo reveals throughout.

### Open (next to decide, in order)

- Stage 2 (Layout) is now complete — IA, Home composition, and ground assignments all locked.
  Next is **Stage 3: section-by-section design**, starting with the Hero + live-demo sections.

---

## Stage 3 — Section-by-section design  _(IN PROGRESS)_

One section at a time, each to a locked spec (content, layout, type, motion).

### Navigation / menu  _(LOCKED 2026-07-16)_

> **Amended in Stage 4.5 (2026-07-19):** the menu is **absent on the Hero** and arrives
> with §2; the **Contact entry points to Home's closing bookend**; there is deliberately
> **no demo entry**.
>
> **Amended in Stage 4.6 (2026-07-20):** on **inner pages** the top-bar left slot is
> **"← Home"** (not the section indicator), and a **persistent bottom navigation tray**
> (the four inner destinations) carries peer-jumping and the current-location indicator.
> The menu is kept whole; Home is unaffected. See Stage 4.6.

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
  Home sections ~~(and shows the page name on inner pages)~~. ~~Hamburger icon top-right as
  specced.~~ **Amended in Stage 4.5:** the Hero carries **no hamburger** — the menu
  arrives with §2 (see Stage 4.5). **Amended in Stage 4.6:** the indicator is **Home-only** —
  on inner pages the left slot is **"← Home"** and the bottom tray declares location.
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
  gently off it. Exact tint: **`#e7f0ff`** (four-ground token pass).
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

> **Amended in Stage 4.5 (2026-07-19):** the name **floats above the rising panel**,
> fading in place in full view; the transition (and all reveals) are **scrubbed** by the
> scroll with hard snap floors — see Stage 4.5.

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

- **Ground — sage wash** (desaturated `#6f9d7e`), per Stage 1. Exact tint: **`#e0f7e7`** (token
  pass).
- **Title:** **"Behind the Scenes"** in Bodoni Moda.
- **Lead:** one Outfit line — **"From strokes to prediction"**.
- **Teaser — simplified flow line:** a light horizontal line-diagram of the pipeline,
  **draw ▸ preprocess ▸ model ▸ serve ▸ monitor**. Thin ink connectors (`#0a0a0a`, per the
  ink-line rule) with small arrows, Outfit stage labels; **non-interactive** (the clickable version lives on `/architecture`). Wraps to
  a vertical stack on mobile.
- **Action link:** an ochre **"Explore the full architecture →"** link that takes the visitor to
  the `/architecture` page.
- **Motion:** on scroll-in the flow stages reveal **left-to-right in sequence** (short expo
  stagger, echoing the pipeline direction); title + lead reveal first. Respects
  `prefers-reduced-motion` (stages appear together, no stagger).

### Home §4 — Journey teaser  _(LOCKED 2026-07-17)_

The devlog hand-off, drawn as an actual journey: the latest entries sit along a winding
downward path. Ochre ground; section indicator reads **"Journey"**.

- **Ground — ochre wash** (desaturated `#c2701f`), per Stage 1. Exact tint: **`#ffecdb`** (token
  pass).
- **Title:** **"The Journey"** in Bodoni Moda, with one Outfit lead line beneath it:
  **"Roads not taken"**.
- **Layout — a winding path, not a list.** A thin ink line (`#0a0a0a`) curves down the section in
  **asymmetric S-curves** — never a straight timeline. The 2–3 latest entries hang off it,
  **alternating left and right of the path** with generous whitespace, and deliberately
  misaligned: two entries on the same side never share the same left edge. Entries run
  **oldest at the top, newest at the bottom** (Stage 4) — the same direction as the full
  Journey page, so the scroll ends on the newest entry beside the "Read the journey →" link
  and the arrival morph into `/journey` keeps its logic.
- **Entry anchor:** each entry is marked by a **visible dot sitting on the path**. Dots **rest in
  ink `#0a0a0a` and warm to ochre `#c98a3a` on hover** (settled in the token pass — bright ochre
  alone measured 2.5:1 on this wash; the resting ink carries the contrast, so the transient
  hover warm-up is fine).
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

### Home §5 — Skills + closing  _(LOCKED 2026-07-17)_

> **Amended in Stage 4.5 (2026-07-19):** §5 now ends on **"See all skills →"** — the
> closing button and footer icons moved to the new **Home §6 bookend** (see Stage 4.5).

The flow **keeps rolling** — no teaser break. §4's ending arrow delivers the scroll straight
into real skills content, and the page closes on one button plus the footer. The About teaser
is folded into that closing button rather than getting its own block. Dusty-rose ground;
section indicator reads **"Skills"**.

- **Ground — dusty-rose wash** (desaturated `#b3637b`), per Stage 1. Exact tint: **`#ffe8ee`**
  (token pass).
- **Title:** **"Skills"** in Bodoni Moda, with one short Outfit lead line beneath it:
  **"What I build with"**.
- **Skills — drifting lines.** Skill names in **large Outfit** on 3–5 staggered lines that
  drift alternately left and right down the section — echoing §4's path rhythm, with the same
  asymmetry rule (no two lines share an edge). Each line is a loose cluster of related tools
  separated by interpuncts (e.g. Python · PyTorch · scikit-learn / AWS · Kubernetes ·
  Terraform / GitHub Actions · Docker · MLflow / Next.js · TypeScript). No group labels.
  Curated, ~12 names max — the full inventory lives on `/skills`.
- **Skills link:** an ochre **"See all skills →"** link after the lines, to `/skills`.
- **Closing button:** one **solid button** (Stage 1: `#0a0a0a` bg / `#fafafa` text) reading
  **"Learn more about me or reach out"** → `/about`. _Carried requirement: the **About page
  must repeat the contact info**, so the button's "reach out" half is honored one click in.
  (The Contact page still exists in the menu.)_
- **Footer:** at the bottom of the section, under a thin ink rule (`#0a0a0a` — the ink-line
  rule) — **three thin-line icons only, centered, in ink, warming to ochre on hover** (the dot
  behavior): GitHub, LinkedIn, email. GitHub/LinkedIn open the profiles in a new tab; the
  **email icon copies the address to the clipboard** and shows a brief **"Copied"** text
  confirmation by the icon. Icon-only controls carry accessible labels. No emojis, no extra
  footer text.
- **Mobile:** the drifting lines keep their stagger with smaller side offsets; long lines wrap
  while holding their side. Button and footer center.
- **Motion:** title + lead first; then the skill lines reveal one after another, each sliding
  in subtly **from its own side** (left lines from left, right from right) on the expo ease;
  then the button, then the footer icons. The "Copied" note fades in/out on the same ease.
  Respects `prefers-reduced-motion` (everything appears at once; "Copied" still shows, without
  animation).

**Home is now fully specified** (§1–§5 + nav + the §1→§2 transition).

### Journey page (`/journey`)  _(LOCKED 2026-07-17)_

The Home §4 path at full length: **every** devlog entry on one winding line. Section
indicator reads **"Journey"**.

- **Ground — the same pale ochre wash as Home §4.** This sets a precedent: **an inner page
  inherits the tint of the Home section that points to it**, so the washes double as
  wayfinding (Architecture → sage; Skills → dusty rose; About and Contact get settled when
  those pages are designed).
- **Title:** the same pair as the teaser — **"The Journey"** in Bodoni Moda, Outfit lead
  **"Roads not taken"** — so arriving feels like the same place, now in full.
- **Path:** the §4 grammar unchanged — thin ink line, asymmetric S-curves, entries
  alternating left/right with deliberate misalignment, a dot anchoring each entry.
- **Order — oldest at the top, newest at the bottom.** The page reads as the actual walk
  from the start to today; scrolling *is* the journey.
- **Entries:** same grammar as the teaser — uppercase date + phase micro-label, Bodoni Moda
  title (links to the entry), one plain Outfit line.
- **Phase markers:** where a new project phase begins, a small wide-tracked uppercase label
  sits on the line (e.g. `PHASE 1 — SERVING LIVE`) — orientation on a long path, driven by
  the entries' frontmatter.
- **Ending — the line trails off.** Past the newest entry the path runs on a short way and
  **fades out mid-curve, unfinished** — the project is still going. No arrow here; the arrow
  was the teaser's hand-off device.
- **Arrival transition — "the line carries you."** From "Read the journey →" or the menu:
  the current view fades while a single thin ink line draws down from the top of the screen, and
  the page arrives already threaded on it. _If the modified Next.js supports view
  transitions, the teaser's path morphs into the page's path; the fallback (fade + path
  drawing in from the top edge) still reads as the same line continuing. Reduced motion:
  plain fade._
- **Scroll motion:** the path draws as the visitor scrolls, entries revealing as the line
  reaches them — same mechanics, same jank fallback, and same `prefers-reduced-motion`
  behavior as §4.
- **Mobile:** same §4 adaptation — near-vertical path on the left, entries stacked down the
  right.

### Journey entry card  _(LOCKED 2026-07-17)_

**There is no separate entry page.** Clicking an entry title opens the devlog post as a
**card over the Journey page** — the visitor never leaves the path; they stop at a marker,
read, and keep walking.

- **Card:** a bright **white paper card** — same grammar as the demo's canvas card (hairline
  `#e8e8e8` + subtle shadow) — floating centered over the Journey page, which dims behind a
  light scrim. Comfortable reading width; long entries **scroll inside the card** while the
  page behind stays put.
- **Content, top to bottom:** uppercase date · phase micro-label; the entry title in
  **Bodoni Moda**; the post body in Outfit (the MDX entry: context → options considered →
  decision + rationale → what went wrong); **evidence links** (commits, CI runs, cost
  screenshots) as ochre links opening in new tabs. Images render within the card's width.
  A thin-line **×** sits top-right.
- **Open motion:** the card **scales up from the clicked dot** (transform origin at the dot)
  with the scrim fading in, on the expo ease. Reduced motion: plain fade.
- **Close:** the ×, the Esc key, or clicking the scrim. The visitor lands exactly where they
  were on the path, and keyboard focus returns to the entry title. While open the card traps
  focus and announces as a dialog.
- **Address:** opening a card **updates the URL**, and visiting that URL opens Journey with
  the card already open and the path scrolled to its dot — every entry stays shareable and
  linkable. _Exact mechanism (hash vs. route) checked against the modified Next.js docs at
  implementation time._
- **Mobile:** the card fills most of the screen with small margins — a reading sheet — and
  closes the same three ways.

### Architecture page (`/architecture`)  _(LOCKED 2026-07-17 · AMENDED 2026-07-20)_

> **Amended in Stage 4.7 (2026-07-20):** the page now opens with a **consolidated
> system-overview diagram** (the whole machine in one view) under an **"Overview"**
> heading, then the three chapters as the breakdown; the **five-stop summary line is
> removed** and chapter diagrams may use **icon tiles / a vertical flow**. Structure only —
> every node, tool name, and stop is illustrative and changes once the platform is built.
> See Stage 4.7.

The mlops deep-dive as a **three-chapter story**, told in the site's line-and-dot grammar.
Sage wash (inner-page tint precedent, from Home §3); section indicator reads
**"Architecture"**. Content source: the mlops repo's `PLAN.md` §3 — exact stops get refined
against the built system at implementation.

- **Title:** **"Architecture"** in Bodoni Moda; Outfit lead: **"The machine behind the
  doodle"**.
- ~~**Summary line:** the familiar five-stop line (draw ▸ preprocess ▸ model ▸ serve ▸
  monitor) sits under the title — the anchor to Home §3.~~ **Removed in Stage 4.7** — the
  consolidated **Overview diagram** supersedes it as the page's opening (see Stage 4.7).
- **Arrival transition — "the line carries you," reused.** From Home §3's "Explore the full
  architecture →": the section fades and the five-stop line persists, redrawing at the top
  of the page (view-transition morph if the modified Next.js allows; fade + draw fallback;
  plain fade under reduced motion). From the menu, the page arrives with the line drawing in.
  **Amended in Stage 4.7:** with the five-stop line gone, the Home §3 hand-off now morphs
  into the **Overview diagram's top** instead (exact morph target TBD at implementation);
  fallback + reduced-motion unchanged.
- **Three chapters,** each a Bodoni Moda heading + one plain Outfit sentence + a thin-ink
  diagram (`#0a0a0a` — dots as stops, thin connectors, Outfit labels with few-word
  sub-labels; **amended in Stage 4.7:** stops may instead be **icon tiles** and a chapter
  may run **vertically** as a loose flow chart — see Stage 4.7):
  1. **The road your doodle took** — browser → Lambda wakes from zero (FastAPI + ONNX) →
     the guess comes back → the doodle is logged to S3. A replay of what the visitor just
     did on Home.
  2. **The factory that builds the model** — pull data → validate → train → evaluate →
     **quality gate** → registry → build container → update the Lambda. The gate gets a
     visible **dead-end stub** off the line: the deliberately blocked deploy, clickable to
     its CI-run evidence — the page's best proof moment.
  3. **The weekly dress rehearsal** — Terraform builds a VPC + EKS cluster → the same
     container deploys with monitoring → smoke + k6 load tests → Grafana dashboards
     captured → everything destroyed. The line ends in a deliberate full stop: nothing left
     running.
- **Stops open paper cards** — the Journey entry card grammar unchanged: white card scales
  up from the clicked dot over the dimmed page; inside: what it is → why this choice →
  the trade-offs → evidence links (ochre, new tabs). Same close behaviors, focus handling,
  and **shareable URL per component**.
- **Hover:** a stop's dot and label warm to ochre; cursor signals clickability.
- **Closing strip:** after chapter 3, one quiet line on the persistent footprint — *what
  stays running when nothing is happening: two storage buckets, one container registry, one
  function* — plus ochre links: **"Browse the raw evidence →"** (the mlops evidence hub) and
  the GitHub repo.
- **Motion:** each chapter's diagram draws in stop-by-stop as it scrolls into view (§3's
  reveal grammar); reduced motion shows chapters whole, no drawing.
- **Mobile:** each chapter's line turns vertical (the Journey path adaptation); cards become
  the reading sheet.

### Skills page (`/skills`)  _(LOCKED 2026-07-17)_

**Skills with receipts** — the page claims less and proves more. Dusty-rose wash (tint
precedent, from Home §5); section indicator reads **"Skills"**. **No proficiency bars,
levels, or ratings anywhere** — the evidence links do the grading.

- **Title:** the same pair as Home §5 — **"Skills"** in Bodoni Moda, Outfit lead **"What I
  build with"** — so arrival reads as the same place in full (the Journey precedent).
- **Arrival:** no single shared line to carry over here; the shared gesture is the
  **drift** — the page's content drifts in from the sides exactly as §5's lines do. Plain
  fade under reduced motion.
- **Tier 1 — "PROVEN HERE"** (uppercase micro-label): the skills this project actually
  demonstrates, ~8–12 of them. Each entry, alternating sides with the asymmetry rule:
  - the skill name in **large Outfit** (technical terms stay sans, per Stage 1),
  - one plain Outfit line stating what it did *in this project*,
  - an ochre **evidence link** — an Architecture stop's card, a Journey entry, a CI run,
    or the repo. The per-component and per-entry shareable URLs pay off here.
  Only the link is clickable, not the whole entry.
- **Thin ink divider** (`#0a0a0a` — the ink-line rule).
- **Tier 2 — "ALSO IN THE TOOLBOX"** (uppercase micro-label): the honest long tail as quiet
  drifting lines of names, loosely clustered by theme — slightly smaller and more muted than
  tier 1, **no claims, no links**.
- **Content:** the actual skill lists and evidence targets come from Monish at
  implementation; everything above fixes structure, not inventory.
- **Motion:** entries drift in from their own side as they scroll into view (expo ease);
  reduced motion shows them in place.
- **Mobile:** single column, stagger kept with smaller side offsets (the §5 adaptation).

### About page (`/about`)  _(LOCKED 2026-07-17)_

Bio + the CV, on the one wash no inner page had claimed. Section indicator reads
**"About"**.

- **Ground — dusty-blue wash** (desaturated `#3f5286`). §2's demo has no inner page, so the
  blue was orphaned; About takes it, and **every wash now has exactly one inner page** —
  ochre = Journey, sage = Architecture, dusty rose = Skills, dusty blue = About. The
  wayfinding set is complete.
- **Title:** **"About"** in Bodoni Moda; Outfit lead **"The person behind the machine"** —
  the deliberate mirror of Architecture's "The machine behind the doodle".
- **Bio block:** a **small portrait** with the bio prose beside it — asymmetric, photo one
  side, text the other (stacks on mobile, photo first). The photo is treated like a
  photograph laid on the page: hairline border `#e8e8e8` + subtle shadow, same family as
  the paper cards; no rotation, no frills. Bio is first-person Outfit prose, written by
  Monish at implementation.
- **CV — the straight line.** The path's calm cousin: Journey's road winds because that
  story has wrong turns; the record stands straight. Two runs of it under Bodoni Moda
  subheads **"Work"** and **"Education"**:
  - a **straight vertical ink line** (`#0a0a0a`) with a dot per stop, **newest at the top** (a record,
    not a story — unlike Journey's oldest-first walk);
  - each stop: date-range micro-label (uppercase, wide tracking), role + place in Outfit,
    one plain line on what the work was. Stops are not clickable — nothing hides behind
    them.
- **Résumé:** a quiet ochre **"Download résumé (PDF)"** link after the Education run. The
  PDF itself is content Monish maintains.
- **Contact block — the carried requirement, fulfilled.** The page closes with a short
  reach-me block: the email address as an ochre **click-to-copy** (with the footer's
  "Copied" confirmation) plus **GitHub** and **LinkedIn** as text links — text, not icons,
  on this reading page. The §5 button's "or reach out" promise lands here, one click in.
- **Arrival + motion:** calm fade in, then top-to-bottom reveals; each CV line **draws
  downward** as it scrolls into view, dots and entries appearing as the line reaches them —
  Journey's mechanics, straightened. Same jank fallback; reduced motion shows everything in
  place.
- **Mobile:** portrait above bio; the CV lines are already vertical — entries sit to the
  line's right.

### Contact page (`/contact`)  _(LOCKED 2026-07-17 · SUPERSEDED 2026-07-19)_

> **Superseded in Stage 4.5:** there is **no standalone Contact page** — this
> composition lives on as **Home's closing bookend**, and the menu's Contact entry
> points there. About keeps the full contact block (the carried requirement).

**The Hero's bookend.** The site opens on white with nothing but a name; it closes on white
with nothing but a way to reach that name. Section indicator reads **"Contact"**.

- **Ground — white.** All four tints belong to the other inner pages; white gives the
  bookend its meaning.
- **Composition — centered and sparse, like the Hero.** Three things stacked mid-viewport:
  1. **"Say hello."** in Bodoni Moda — the display line, in the voice of "Draw something."
  2. **The email address, large, Outfit, deep ochre `#96600a`** (Stage 4 correction — bright
     `#c98a3a` measures 2.9:1 on white, under the bar even at display size) — the page's real
     content. Click copies it
     ("Copied" confirmation, the established gesture); a tiny secondary link beneath —
     *"or open in your mail app →"* (plain mailto). The address stays in Outfit even at
     display size: technical text is sans, per Stage 1.
  3. **GitHub · LinkedIn** as quiet text links (deep ochre `#96600a`, the body-link rule),
     opening in new tabs.
- **Optional slot** for one plain line (expectations — e.g., "I read everything"); whether
  it's filled is a content call at implementation.
- **No contact form** — the site is static with no server, and a third-party form service
  would add a dependency to do worse what the email already does.
- **Motion:** the Hero's arrival reused — display line, then email, then links, on the calm
  expo reveal. Reduced motion: everything appears in place.
- **Mobile:** identical, centered.

**All six destinations are now specified.**

### Four-ground token pass  _(LOCKED 2026-07-17)_

All four washes derived with **one formula** (OKLCH: same lightness L .955, same low
chroma C .032, each base keeping only its hue) so no section reads bolder than its
siblings; every ink that sits on them contrast-measured (WCAG). Swatch record: the
token-pass artifact, 2026-07-17.

- **Wash values (adopted — the "present" set):**

  | Wash | Base | Value |
  |---|---|---|
  | Demo / About (dusty blue) | `#3f5286` | **`#e7f0ff`** |
  | Behind the demo / Architecture (sage) | `#6f9d7e` | **`#e0f7e7`** |
  | Journey (ochre) | `#c2701f` | **`#ffecdb`** |
  | Skills (dusty rose) | `#b3637b` | **`#ffe8ee`** |

  This resolves every "_exact tint TBD_" note in the section specs. **Noted alternate —
  the "whisper" set** (L .970, C .020): `#eff5ff` / `#ebf9ef` / `#fff2e8` / `#fff0f4`,
  kept on record in case the built pages want fainter grounds once seen for real.
- **Ink-line rule (adopted).** `#e8e8e8` on the washes measures ~1.07:1 — invisible.
  All **drawn lines and resting dots** (the Journey path, flow diagrams, the CV line)
  are thin **ink `#0a0a0a`**; `#e8e8e8` stays for separators on white surfaces only.
  Dots **rest in ink and warm to ochre on hover** — closing §4's open dot question
  (ochre on its own wash measured 2.5:1).
- **Deep ochre for small marks (adopted).** `#c98a3a` fails as small text (2.9:1 on
  white, ~2.5:1 on washes). **Body-size links and small labels use deep ochre
  `#96600a`** — same hue family, ≥4.5:1 on white and all four washes. Bright `#c98a3a`
  keeps every large-scale job: hero arrow, confidence-bar fills, hovers, focus glows,
  display accents. On the bars, the ink percentage text carries the data; the fill is
  reinforcement.
- **Muted gray — resolved in Stage 4.** `#828282` measures 3.8:1 on white and 3.3–3.5:1 on
  washes, below AA for small text. The passing **`#6b6b6b` was adopted everywhere** in the
  Stage 4 review (2026-07-17); the palette table reflects it.
- Sanity: body text `#0a0a0a` ≥ 17:1 on every wash; the white cards lift ~1.15:1 off
  the washes, carried by hairline + shadow as designed.

**Stage 3 is complete.**

---

## Stage 4 — Finalize  _(LOCKED 2026-07-17)_

The whole design read front to back in a fresh conversation. Verdict: **coherent** — the
line-and-dot grammar, the paper cards, the single ochre accent, the calm expo reveals, and
the no-emoji rule hold across all six destinations, and nothing contradicts the hard
constraints. Findings, all resolved:

- **Muted gray darkened to `#6b6b6b`.** `#828282` fails AA for small text even on white
  (3.8:1); the darker gray passes on white and all four washes. Adopted everywhere —
  secondary text, prompt lines, micro-labels. Palette table updated.
- **Contact email corrected to deep ochre `#96600a`.** The page's centerpiece was specced
  in bright `#c98a3a` on white — 2.9:1, under the bar even for display type (that spec was
  locked hours before the token pass measured it). Deep ochre keeps the warmth and reads.
- **Teaser entry order settled: oldest first.** Home §4's featured entries run oldest →
  newest down the path, matching the full Journey page's direction; the scroll ends on the
  newest entry beside "Read the journey →", and the morph into `/journey` keeps its logic.
- **Stale text swept.** §4's dots now match the token pass (rest in ink, warm to ochre on
  hover); the four "exact tint TBD" notes carry their locked wash values; the Stage 2 Home
  table reflects the locked "Skills + closing" §5.
- **"Hairline" disambiguated.** The word now strictly means the `#e8e8e8` separator color,
  used on white surfaces only (card borders, separators on white). Every drawn line on a
  wash — the Journey path, the flow diagrams, the Architecture chapters, the CV line, §5's
  footer rule, the Skills divider, the arrival transitions — is explicitly **thin ink
  `#0a0a0a`**.
- **Small gaps closed.** Footer icons: ink, warming to ochre on hover (the dot behavior).
  Contact's GitHub · LinkedIn links: deep ochre `#96600a` (the body-link rule).
- **Accepted, on record:** ochre hover states on the ochre wash measure 2.5:1 — fine
  because hover is transient and the resting state (ink) carries the contrast. About keeps
  the dusty-blue wash even though §5 (rose) points to it — the wayfinding rule is "one wash
  per inner page," not "follow the color you came from."

**The design is finalized.** Stage 5 — Implement — begins only once the mlops platform is
done, per the process rules.

---

## Stage 4.5 — Motion & flow amendments from prototyping  _(LOCKED 2026-07-19)_

The finalized design, pressure-tested in two working artifacts before Stage 5:
`design-system-preview.html` (motion demos: ease speed tester, slide-in menu, transition
compartment) and `transition-prototype.html` (the **full Home scroll** as a scrubbed,
full-viewport prototype — hero through bookend). Testing from the visitor's POV revised
the motion model, Home's ending, and the IA. Supersedes the affected Stage 1–3 text
where noted inline; the prototypes are the working reference.

### Motion model — scrubbed, with clocked money moments

> **Note (2026-07-28):** an event-driven **paged** variant (one gesture = one always-completing
> transition, native scroll off) was tried to fix the "stranded between sections on a jittery
> mouse" problem, then **reverted** — it read as frustrating on repeat visits. Scrubbed
> position-drive (below) stands. Two things from that round were **kept** because they're
> independent of the driver: the per-section outgoing fade, and the ↓ next-section cues on §3–§5.

- **Scrub-driven reveals.** Section transitions and content reveals are driven by scroll
  position, not timers: each element owns a **slice of the scroll** and its
  opacity/transform is a pure function of progress through that slice; overlapping
  slices produce the staggers. A hard flick can't skip choreography — it just plays
  fast, and scrolling back plays it in reverse. Chosen after A/B-ing against
  settle-triggered reveals, which fire on arrival and get missed by fast scrollers.
- **The hybrid exception — clocked money moments.** A few payoff animations play on the
  clock at their designed tempo, triggered when they become **visible** (not on full
  settle): the demo's confidence-bar fills. Structure scrubs; payoffs play.
- **The ease survives as smoothing.** Scrubbed layers chase the scroll target with
  exponential smoothing whose time constant follows `--dur` — the ease-out-expo
  character, applied to scrubbing.
- **`--dur` — one loose global duration token.** Every choreographed duration and
  stagger delay is a multiple of a single `--dur` token (default **.48s**; final value
  tuned via the preview's speed tester at implementation). Hover/feedback transitions
  stay fast and off the token.
- **Hard floors.** The Home scroll snaps: `scroll-snap-type: y mandatory` with
  `scroll-snap-stop: always` at each section's resting point. A fling stops at the next
  section (each section demands its own gesture to leave); released scroll always
  resolves onto a section, so transitions self-complete and parking mid-transition is
  deliberately impossible.

### Home flow amendments

- **§1→§2 — the name floats above the rising panel.** The name fades in place **in full
  view**, the wash panel rising beneath it (was: panel overlaps and covers the name —
  which swallowed the fade behind an opaque surface).
- **§2 gains its own ↓ cue.** The hero's arrow grammar repeated: an ochre floating
  arrow at the demo panel's bottom, appearing once the demo has assembled and retiring
  as §3 rises; clicking carries the visitor to §3 fully built. (The hero arrow's target
  is the built demo.)
- **§5 slims.** Skills ends on **"See all skills →"** — its closing button and footer
  icons move to the bookend below.
- **Home §6 — the closing bookend (new).** Home ends as it opens: a **stand-alone white
  page**. After §5 the sticky stack releases and the bookend scrolls up in normal
  document flow — the break in the roll-over pattern *is* the ending gesture. Centered,
  top to bottom, reading as one sentence:
  1. **"Say hello."** in Bodoni display — the Hero's mirror;
  2. the **three thin-line icons** directly beneath (GitHub · LinkedIn · mail), ink
     warming to ochre; the mail icon **copies the address** with the "Copied"
     confirmation. No ink rule — the icons are the invitation's answer, not a footer;
  3. **"Or learn more about me →"** as a deep-ochre text link → `/about`, last because
     "or" follows the offer it's an alternative to.
  Accepted, deliberate: **Home no longer has a solid button anywhere.**
- **IA — the Contact page is folded into the bookend.** No standalone `/contact` route.
  The bookend *is* the site's contact surface; About keeps the full contact block (the
  carried requirement, unchanged); and the **menu keeps its "Contact" entry, pointing
  at the bookend** (anchor to Home's end — scrubbed state renders finished on direct
  arrival). Rationale: after the bookend, the page duplicated contact info already
  available in three places, and by the Stage-2 Résumé precedent a thin page doesn't
  earn a route. The Stage 3 Contact spec's composition lives on in the bookend.
- **Nav — the menu arrives with §2; the Hero is bare.** The hamburger is **not present
  on the Hero**: it fades in (scrubbed) as the demo panel rises, and retires if the
  visitor returns to the top. Combined with **no demo entry in the menu** (none will be
  added), the first scroll is the only path in: every visitor is funneled through the
  demo before they get the map — one affordance on the Hero (the ↓ arrow), no way to
  unintentionally skip the flagship, and tighter control over the experience than
  offering two competing doors. Accepted costs, on record: a visitor who never scrolls
  sees no navigation; returning visitors pay one flick before the menu exists.

---

## Stage 4.6 — Inner-page navigation & wayfinding (from section prototyping)  _(LOCKED 2026-07-20)_

Building the four inner pages as a working artifact — `sections-prototype.html` (Journey,
Architecture, Skills, About from their locked Stage 3 specs, sharing the shell, the "line
carries you" arrival, the slide-in menu, and the paper-card grammar) — surfaced a
navigation gap: the four inner destinations are **peers** a visitor will want to hop
between, and routing every hop through the slide-in menu is friction. Two additions,
**inner-pages only**; supersedes the affected nav text where noted.

- **Bottom navigation tray (new).** A small, persistent pill centered at the **bottom** of
  every inner page listing the four inner destinations — **Journey · Architecture · Skills ·
  About** — as peer links, the current one filled (ink) as its active state. It **doubles as
  the current-location indicator**: on inner pages *the tray declares where you are*, so the
  top-bar section indicator is retired (below). `aria-current="page"` on the active item.
  Rationale: fast sibling-to-sibling jumping without opening the menu, in a light centered
  element that doesn't span or clutter the editorial layout the way a top nav bar would.
- **Top-left "← Home" (new).** With the tray owning location, the top-bar's left slot is
  free; inner pages put a **"← Home"** back affordance there — a thin-line left arrow +
  "Home", ink warming to ochre, the arrow **nudging left on hover** (the site's motion
  character). A direct escape back to the Hero, clearer than routing through the menu.
- **Inner-page top bar, settled: "← Home" left · hamburger right.** The **current-section
  indicator is dropped on inner pages** (superseded by the tray). It still lives inside the
  **Home scroll** per Home §1 — blank on the Hero, updating through §2–§5.
- **The menu is kept as-is** — the full six-item map on every page. On inner pages its
  unique remaining value is **Contact** (the tray covers the four inner pages; "← Home"
  covers Home), so it stays as the Contact path and the consistent full map. **Considered
  and deferred:** trimming or dropping the menu on inner pages — not worth the cross-page
  inconsistency now; revisit only if it reads as pure redundancy.
- **Home is unaffected.** No tray, no "← Home" on the Home scroll — the funnel-through-the-
  demo flow (menu arrives with §2, bare Hero) stands. The tray + "← Home" are strictly an
  **inner-page convention**.
- **Supersedes:** the Stage 3 nav intent of **"no persistent nav bar"** — the bottom tray
  *is* persistent nav, accepted on inner pages because peer-jumping earns it and the pill
  stays visually quiet — and the **"top-bar left = current-section indicator"** slot **on
  inner pages** (now "← Home").
- **Mobile:** the tray sits centered at the bottom edge; the four short labels stay on one
  row, compacting to a tighter pill on the narrowest widths.

---

## Stage 4.7 — Architecture page: overview, then breakdown (from prototyping)  _(LOCKED 2026-07-20)_

Prototyping the Architecture page (`sections-prototype.html`) showed the three-chapter
story never lets a visitor see the **whole system at once** — they meet the parts before
the shape. Fix: **an overview first, the chapters as the breakdown.** This revisits the
Stage 3 rejection of a "one-big-map" — the difference is *overview **plus** breakdown* (not
instead of), and the map stays high-level, so the mobile-density worry that killed the
original one-map idea doesn't return.

> **Content is illustrative.** Every node, tool name, sub-label, chapter stop, and the
> exact diagram topology below is **placeholder** — the real system is still being built
> and the finished content will differ significantly. Stage 4.7 fixes **structure,
> grammar, and interaction**, not inventory.

- **Overview diagram (new — replaces the summary line).** An **"Overview"** heading
  (Bodoni, a peer to the chapter titles) over a **consolidated system diagram** — the whole
  machine in one view. Shape = **a unified lifecycle with a fork**: a top-to-bottom flow of
  node tiles (white, hairline + soft shadow — the paper-card family) joined by thin-ink
  connectors, where a shared artifact **forks to two subsystems and merges back**
  (prototype's illustrative topology: data → build → container image → forks to live-serve
  + weekly-rehearse → merges to monitoring). The five-stop `draw ▸ preprocess ▸ …` line is
  **removed** — the real diagram is the overview now.
- **Zones vs. connective tissue.** The diagram's **subsystem tiles are interactive
  "zones"** — hovering shows a **"see chapter ↓"** cue and clicking **scroll-jumps to that
  subsystem's chapter** below (keyboard-operable). The **shared artifacts** between zones
  are **non-interactive** — their detail lives in the chapters. So the overview both
  explains the system *and* is the table of contents into the breakdown.
- **Fork/merge drawing.** The branch/merge lines are **CSS-drawn** at the two branch
  columns' centres (uniform ink weight, no distortion) and **collapse to a vertical stack
  on mobile**, keeping the map readable small — the property the original one-map lacked.
- **Chapter diagrams — icon tiles + optional vertical flow.** A chapter's stops may render
  as **icon tiles** (one **monochrome thin-ink glyph per tool** + name + role, warming to
  ochre on hover — still no colour, still no emoji) and the chapter may run **vertically as
  a loose flow chart** when it has too many stops for one row; the quality gate's
  **dead-end stub branches to the side**. Applied to chapter 2 ("the factory") in the
  prototype; chapters 1 and 3 stay horizontal for now.
- **Supersedes / affects:** the Stage 3 **"Summary line"** bullet (removed) and the
  **"one-big-map rejected"** rationale (an overview map returns, kept high-level); the
  **Home §3 → Architecture "line carries you" arrival** loses its five-stop anchor and now
  hands off into the **Overview diagram's top** (exact morph target TBD at implementation).
- **Open (deferred, not locked):**
  - **Tool icons — glyphs vs. brand logos.** The prototype uses on-brand **monochrome
    conceptual glyphs**; whether to switch to **actual brand logos** (which would introduce
    colour — a real departure from the locked ink + one-ochre palette — or be rendered as
    monochrome marks) is unresolved.
  - **Chapter consistency.** Whether **all three** chapters adopt the vertical icon-flow, or
    short chapters keep the horizontal dotted row as a deliberate contrast.

---

## IA rework (2026-07-26) — two internal modes  _(nothing locked — working direction)_

**Why now.** The mlops platform now publishes six live JSON contracts to its evidence hub
(`portfolio/DATA_CONTRACTS.md`). Two map cleanly onto existing pages (`architecture.json` →
Architecture, `journey.json` → Journey), but the **four monitoring/quality contracts** —
`evidence.json` (model quality, gate, per-class F1), `drift.json` (+history), `feedback.json`
(+history, proxy accuracy), `api-metrics.json` (live latency/throughput) — had **nowhere to live**
in the six-destination IA; the design only linked out to the raw hub. This rework gives that live
proof a first-class home and reorganizes the internals into two tray-navigated **modes**.

### The shape

- **Home (hero scroll)** — unchanged in spirit; the Stage 4.5 "funnel every visitor through the
  demo" model holds. Sections: **Hero → Demo → Architecture teaser → Journey teaser → Skills teaser
  → Closing (Contact bookend)**. Each *teaser* is a doorway into **Story mode**; the **Demo** is the
  doorway into **Data mode** ("→ see how it performs"). _(Teaser order isn't fixed here — the old
  Stage 2 spent the four washes in a set order; that's part of what the visual rework revisits.)_
- **Story mode** — the narrative pages: **Architecture · Journey · Skills**. A bottom-center tray
  (the `.switch-dock` from `sections-prototype.html`) hops between these three. Entered from the Home
  teasers.
- **Data mode** — the technical/live pages rendering the monitoring/quality contracts as styled UI.
  **Three pages** (decided 2026-07-26): **Quality · Monitoring · Performance** — the narrative arc
  *report card → is it holding up → is it fast*. A *second, isolated* bottom tray hops between them.
  Entered from the Demo.
  - **Quality** — `evidence.json`: champion card, runs table, per-class F1, the **quality gate**
    (incl. the blocked-deploy demo run), confusion matrix. Populated every deploy — always dense.
  - **Monitoring** — `drift.json` + `feedback.json` (+ their histories): output-distribution drift
    and proxy accuracy from 👍/👎. Drift (weekly, reliable) carries the page through feedback's
    sparse `n:0` weeks.
  - **Performance** — `api-metrics.json`: latency p50–p99, RPS, throughput. Framed as a **snapshot
    from the last EKS load test** ("captured 〈date〉"), not a live feed — which reads as intentional
    rather than stale, and ties back to Architecture's "weekly dress rehearsal" chapter.
  - _Grouping rationale: the two frequently-thin contracts (feedback, api-metrics) are placed so a
    reliable neighbour or an inherently-periodic framing covers their empty states — no page is
    routinely blank._
- **About** — standalone; **off both trays**. Reached from the closing section (the Contact bookend
  carries an explicit "or learn more about me →" link) and the menu. The personal coda, kept apart
  from the technical body (decided 2026-07-26).
- **Menu** — the **global bridge**. Lists everything: **Home · [Data pages] · Architecture · Journey
  · Skills · About · Contact** (Home and Contact both point at the hero scroll — top and bookend).

### The two trays

- Bottom-center pill (`.switch-dock` grammar from `sections-prototype.html`): Outfit labels, active =
  filled ink, tray declares the current location (`aria-current`). ~~The prototype's tray currently
  includes About;~~ **About is pulled out** of both trays here _(done in `sections-prototype.html`
  2026-07-28: Story tray = Architecture · Journey · Skills; About active → no tray item highlights)_.
- **Isolated by mode** (decided 2026-07-26): the Story tray only cycles Architecture/Journey/Skills;
  the Data tray only cycles the Data pages. **No cross-mode tray link — the menu is the only bridge
  between modes.** Rationale: each mode stays focused, and the menu earns its keep as the one global
  map. (The alternative — one continuous tray across all internal pages — was rejected to keep the
  two modes' identities distinct.)

### Where each contract lands

| Contract | Mode → page (working) |
|---|---|
| `architecture.json` | Story → Architecture |
| `journey.json` | Story → Journey |
| `evidence.json` (quality, gate, per-class F1, confusion matrix) | Data → **Quality** |
| `drift.json` + `drift_history.json` | Data → **Monitoring** |
| `feedback.json` + `feedback_history.json` (proxy accuracy) | Data → **Monitoring** |
| `api-metrics.json` (latency/throughput) | Data → **Performance** |
| — (no single contract) | Skills draws *evidence links* across both modes |

### Color & wayfinding (decided 2026-07-26)

**Color now encodes the *mode*, not the page.** The Stage 3 rule of one wash per destination doesn't
survive three new Data pages — seven near-identical low-chroma washes stop working as wayfinding, and
they'd leave the two-mode structure invisible. Instead:

- **Story mode keeps the warm editorial washes, per page** — Architecture = sage `#e0f7e7`, Journey =
  ochre `#ffecdb`, Skills = rose `#ffe8ee` — each still inherited from its Home teaser (the
  teaser→page tint hand-off from Stage 3 is preserved). **About** stays **dusty blue `#e7f0ff`**, the
  personal page, off-tray.
- **Data mode gets one shared, cooler "instrument" ground** across Quality/Monitoring/Performance.
  **Wayfinding inside the mode is the tray, not color** — so the three pages deliberately share a
  ground; crossing from a warm story wash to the cool instrument ground *is* the "you've entered the
  machine room" signal. Provisional ground: a light cool neutral (placeholder `#f2f4f7`, slate-tinted
  — exact value set in the visual pass, contrast-checked like the token pass). _(2026-07-28: the
  visual pass A/B'd this — the shared ground became **white with lifted-paper cards + a cool well**;
  the crossing signal now rides the chrome (slate shadows, cool hairlines), not a ground tint. See
  "Data-mode visual pass".)_
- **Ochre stays the sole *interactive* accent** everywhere (bright `#c98a3a` for large marks / fills /
  hovers, deep `#96600a` for small links + labels — unchanged from the token pass).
- **Data mode adds a semantic *status* palette** — positive / watch / negative (pass·stable /
  warn / fail·drifted) — used **only in charts and status marks**, never as page identity. This is
  additive to the single-accent rule, not a replacement: the editorial pages never needed status
  colors; the Data charts can't work without them (a gate is pass/fail, drift is drifted/stable).
  Exact hues derived in the visual pass with WCAG checks. _Open nuance: "watch" sits near brand
  ochre — either keep it a distinct amber, or reuse ochre as the attention colour; decide when the
  palette is drawn._
- **Optional per-page identity within Data mode:** each Data page may take a quiet per-page accent for
  its tray-active state + chart primary, if the shared ground feels too flat once built. Kept quiet so
  it never competes with ochre.

**Consequence for the Home scroll.** With About now owning dusty blue, the **Demo** section — the
doorway *into* Data mode — takes the **Data instrument ground** as foreshadowing, instead of the old
orphaned blue. So Home reads: Hero (white) → Demo (instrument) → Architecture teaser (sage) → Journey
teaser (ochre) → Skills teaser (rose) → Bookend (white) — every section now the colour of where it
leads. (Revises the Stage 2 "spend all four warm washes in order" note; provisional with the rest.)
_(2026-07-28: Data mode's ground went **white** in the visual pass — and the Demo foreshadow was
**reconciled the same day**: §2 now grounds on Data mode's **well `#f6f8fb`** (a real machine-room
surface, so the "colour of where it leads" rule stays truthful and the Hero→Demo cross-fade beat
survives), and **both demo columns are lifted Data panels** — canvas and predictions, two floating
papers on the well, the Data-mode composition before the visitor knows it. Bar tracks take the
Data grid tint.)_

### Open (to decide — nothing locked)

- ~~**Data-mode split:** one combined page vs several.~~ **Resolved 2026-07-26 — three pages:
  Quality · Monitoring · Performance** (see Data mode above).
- ~~**Ground/color for Data mode / does wash-per-page survive?**~~ **Resolved 2026-07-26 — color
  encodes the mode** (see "Color & wayfinding" above). ~~Left for the visual pass: the exact
  instrument-ground value, the status-palette hues (incl. the "watch"-vs-ochre nuance), and whether
  Data pages take quiet per-page accents.~~ **Visual pass done 2026-07-28** — see "Data-mode visual
  pass" below; all three settled (watch = ochre, by measurement; no per-page accents).
- ~~**Home teaser order** and the closing bookend's About link.~~ **Resolved 2026-07-26 — order:
  Hero → Demo → Architecture → Journey → Skills → Closing** (matches the colour foreshadowing and the
  original Stage 2 comp); the **closing bookend carries the About link** ("or learn more about me →"),
  About's soft off-tray doorway.

### What this supersedes

- Stage 2's **six-destination IA** (Home · Journey · Architecture · Skills · About · Contact) and
  Stage 3's Architecture-page **"Browse the raw evidence → (link out only)"** treatment of monitoring
  data. That data is now on-site UI in Data mode. Everything else in Stages 3–4.5 (card grammar, tray
  grammar, tints, motion model, the demo funnel) still applies as raw material.

---

## Data-mode visual pass (2026-07-28) — palette settled, three pages prototyped  _(A/B: `data-prototype.html` tinted vs `data-prototype-white.html` white/lifted paper — **white picked 2026-07-28**)_

The IA rework left three things "for the visual pass"; all three are now settled — by validator
runs (the data-viz six checks + WCAG contrast), not taste — and proven on working prototypes of
all three Data pages, rendering the **real hub contracts** (evidence/drift/feedback are live
snapshots; api-metrics is mock-to-contract until the hub's first EKS capture lands). Two surface
schemes were built and compared; **`data-prototype-white.html` is the settled reference**.

### The instrument instance (validated)

- **Surfaces — white ground + lifted paper** _(picked over the tinted ground in the same-day A/B)_.
  The provisional tinted ground (`#f2f4f7`, near-white cards) was built first, then flipped:
  the page grounds on **white**, and the cards do the work — **data panels are lifted paper**
  (white cards, cool hairline `#e4e8ef`, deeper **slate-tinted shadows** `rgba(15,23,42,…)` so the
  lift reads without a ground tint), while **narrative panels sink into a faint cool well
  `#f6f8fb`** (the verdict banner, the rehearsal explainer) instead of lifting. That yields three
  surface levels — **well < ground < paper** — so callouts, ground, and data read as different
  *kinds* of content; the tinted scheme only ever had one level. The "machine room" coolness now
  lives in the **chrome** (slate shadows, cool hairlines, gridlines `#e7ebf1`, axis `#c9cfd9`),
  not the ground — the warm site keeps its warm `--border`; Data mode's chrome cools by a step.
- **Chart ink is one blue family** — primary `#2a78d6` (4.3:1 on the card, revalidated on
  `#ffffff` after the white pick), a 13-step sequential ramp
  for the confusion heatmap, and a 4-step **ordinal ramp** for latency percentiles
  (`#86b6ef → #3987e5 → #256abf → #104281`, p50→p99 — passes the ordinal checks: monotone
  lightness, ≥.06 step gaps, light end ≥2:1). Reference/context series are a deliberate cool gray
  `#8a93a1` (emphasis form: the current window is the point, the reference is context) — the pair
  separates at ΔE 16.3 normal / 14.1 CVD.
- **Status trio:** positive `#0ca30c` (small text `#006300`, 7.4:1) · negative `#d03b3b` (4.7:1,
  doubles as its own text step) · **watch = brand ochre `#c98a3a`** (small text = deep ochre
  `#96600a`, 5.2:1). **The watch-vs-ochre nuance is resolved by measurement:** the best distinct
  amber (`#fab219`) sits **ΔE 13.7** from brand ochre — under the 15 normal-vision floor, i.e. an
  almost-collision readers can't reliably resolve. Either clearly distinct or deliberately
  identical; so ochre *is* the attention colour, status and interactive both. Status never rides
  on colour alone — every status mark ships **icon + label** (which also covers the red/green CVD
  collapse every pass/fail scale has).
- **No per-page accents inside Data mode.** Built shared-first; the pages differentiate by
  content shape (report card / drift histograms / load-test series), and the tray carries
  wayfinding. A per-page accent would fight the one-blue instrument identity for no informational
  gain. Revisit only if a real build feels flat.

### Grammar the prototype adds (Data-mode specific)

- **The arrival line is back on Data pages** (removed, then restored 2026-07-28 — Monish's call
  both times): the plain fade was tried for a day and the pages arrived flat; every internal
  page — Story and Data — now shares the site-wide "the line carries you" ink stroke again.
  **Per-page placement** (2026-07-28): on **every internal page — Data and Story** — the line is
  positioned just right of that page's own title (measured live via a Range on the `.page-title`,
  +52px, clamped clear of the menu button) so it never crosses the headline. A fixed centre line
  collided with the long titles (Monitoring, Performance; Architecture, The Journey). Lines
  deliberately don't align across pages; each sits in its own header's clear zone, and it
  re-measures per navigation so it survives any viewport width. `positionArrival()` is identical
  in all three prototype files.
- **Progressive edge dissolve** (added 2026-07-28, Monish's call): scrolling content blurs + fades
  out at the viewport's top and bottom edges — three stacked backdrop-blur layers per edge
  (2 → 6 → 14px, each mask-banded so the blur genuinely ramps) plus a soft wash toward the ground
  colour. Sized subliminal: 130px bottom / 110px top, heavy blur only in the last ~40px — felt,
  not noticed. Scroll-driven: the top edge only appears once scrolled (~140px ramp), the bottom
  edge fades out at the document end so the footer reads crisp. Chrome (topbar, trays, tooltip)
  sits above it, always sharp.
- **Provenance row** under every page lead: contract name · generated-at · cadence, with an
  honesty chip — `● live data` vs a dashed `mock — first capture pending` / `illustrative`. The
  dashed chip reuses the site's "dead end" dashed grammar for not-yet-real things.
- **Panel** = the mode's card: cool surface, 13px radius, soft shadow; Bodoni stays for page/section
  titles, but **data figures are Outfit** (hero number, tiles, axes — a display serif on numbers
  reads as decoration; the report-card voice is the sans).
- **Every chart has a hover layer and a `data` table twin** (chip toggle) — tooltips enhance,
  tables guarantee; axis/labels never wear series colour.
- **The gate is drawn as an instrument reading**: a number line with the blocked zone, the ε band
  (ochre wash = attention), champion (ink, upper lane) vs challenger (blue, lower lane). The runs
  table derives a `below floor` chip from the contract itself (any run under `gate.min_test_accuracy`)
  — v3's 0.5049 wears it, tying the registry to the blocked-run story without asserting anything
  the data doesn't say.
- **Monitoring leads with the verdict banner** (drifted 3/3, framed as the instrument catching the
  world moving — the flywheel's food, not a failure), then ref-vs-current histograms (gray behind
  blue), the class-share dumbbell sorted by shift, sparse-but-real trend dots, and feedback framed
  as "a signal, not a score" (n=21).
- **Performance is framed as the dress-rehearsal snapshot** ("captured 〈date〉 · monthly load
  test"), latency percentiles on the ordinal ramp, k6 phase bands on throughput, a status ledger
  (counts + meters — honest at 147k/1.8k/40 ratios), and the signature tile: **left running
  after: 0**.

### Follow-ups this pass surfaced

- ~~**The Demo §2 foreshadow needs re-deciding** (from the white pick).~~ **Resolved 2026-07-28 —
  the well + lifted paper**: the Demo grounds on Data mode's well `#f6f8fb` (not the retired
  `#f2f4f7`, not pure white — the well is a real Data surface, so the foreshadow stays truthful
  while the Hero→Demo cross-fade beat survives), and the canvas card wears the Data panel chrome
  (cool hairline `#e4e8ef`, slate shadow, 13px radius); bar tracks take the Data grid `#e7ebf1`.
  Reconciled in `transition-prototype.html`.
- Fold the white scheme into `data-prototype.html` (or retire the tinted file) once the Home-side
  foreshadow question is settled — until then both variants stay for reference.
- ~~`sections-prototype.html` is stale vs the IA rework: its tray still lists About, and its menu
  is the old 6-item list — reconcile next.~~ **Done 2026-07-28** — Story tray is now Architecture ·
  Journey · Skills (About off-tray, reachable from the menu); menu is the 9-item global bridge
  cross-linking into the Data + Home prototypes. (Default landing stays Journey — a prototype
  detail; on the real site each Story page is entered from its own Home teaser.)
- Producer-side (mlops): the confusion matrix exists only as a PNG (explicitly not
  styling-agnostic) — the Quality page wants **cell-level matrix data in `evidence.json`**; until
  then the prototype's matrix is IPF-derived from the real per-class marginals and labeled
  `illustrative`. And `api-metrics.json` still 404s on the hub — the Performance page swaps to real
  the moment the first capture publishes.

---

## Decision log

Newest first. Each entry: what was decided and why.

- **2026-07-29** — **Journey line: scroll-driven "magnifying glass"** (both `transition-prototype.html`
  and `sections-prototype.html`). Replaced the earlier hover "lift" (and its dark travelling segment,
  which read badly) with a **circular lens that rolls down the journey as you scroll**. Implementation:
  a faint lens **ring** (`.j-lens-ring`), a **mask** that hides the base line inside the ring, and a
  clipped copy of the line (`.j-lens`, geometry mirrored from `#jPath`) shown only inside the ring at a
  **bolder stroke (1.4→3px)** — so within the lens the line reads **magnified**, with no dark highlight.
  *Note:* an earlier version scaled the line's geometry `1.4×` inside the lens, but scaling a vector line
  offsets it from the base → a visible **duplicate/parallel "weird line"** at the rim; switched to
  bolden-in-place (same geometry, thicker) which is perfectly aligned = no duplicate. The **dot and entry
  text at the focus zoom in place** (dot `r` ×1.4, text via the `scale` property so it composes with the
  reveal `transform`); text scales from its **outer edge** (`transform-origin` right/left per side) so it
  grows *away* from the line instead of overlapping it. **Trigger differs per surface:** the internal
  `/journey` page is a long scroll, so its lens is **scroll-driven** (tracks the viewport centre passing
  through the journey). The Home teaser is short + static on screen and its scroll is a sticky section
  **scrub** — driving the lens from that scrub fought the section-transition animation, so the Home lens
  is **hover-driven** instead (cursor projects to the nearest point on the line; the lens eases in on
  enter, out on leave). The **line is always fully drawn** now (removed the draw-in) — fixes the gap where it
  appeared to vanish between the first entries mid scroll-in. Tunable via constants — `LENS_R` (lens
  radius), `LENS_S` (dot/text zoom, 1.4), `NEAR` (reach) — plus `.j-lens` stroke-width for the line
  boldness. Hooked into each rAF loop; skipped under `prefers-reduced-motion`; dots stay clickable.

- **2026-07-29** — **Primary teaser CTAs emphasised — via scale, not weight** (`transition-prototype.html`).
  Made the two deepest internal destinations' CTAs stand out from a plain text link: "Explore the
  full architecture →" (Behind the Scenes) and "Read the journey →" (Journey preview), both via a
  shared `.link.cta-strong` class. First attempt (~27px, weight 460, 2px underline) read as **out of
  place** against the editorial look, so it was dialled back to a **gentle size bump at a light
  weight** — `font-size:clamp(17px,1.7vw,20px); font-weight:380` — matching the demo's existing
  doorway link ("See how the model performs →"). No bold, no thick underline. The Journey CTA (which
  sits on the line's end) also gets `white-space:nowrap; width:auto` so the bigger label stays one
  line. Principle recorded: on this site prominence comes from **scale / serif / colour / whitespace
  at a light weight**, not bold or boxed treatments.

- **2026-07-29** — **Journey teaser reflowed: the line starts on a point and ends on the CTA**
  (`transition-prototype.html`). Was: a blank line origin, three entry dots on the crests, and a
  "Read the journey" link sitting *below* the SVG, with a fading tail past the last dot. Now the
  serpentine carries **four points** — the first entry ("One bucket, three jobs") sits on a dot at
  the line's **origin**, the other two step down one crest each ("The gate", "Pandera"), and the
  **final crest is the "Read the journey →" CTA itself** (moved onto the path terminus; the separate
  link and the tail are gone). The serpentine is oriented so it **ends on the right crest**, with the
  CTA and its → hanging to the right so the arrow points outward.
  `layoutPath` now takes an explicit `jNodes` list (each with its
  `side`) and lays out `[...jEntries, jLinkWrap]` one per point; reveal windows end at each point's
  fraction so the origin dot is present from the first stroke and the CTA (fraction ≈1) still
  completes by the end of the draw. Dates stay chronological top-to-bottom (10 Jun → 2 Jul → 18 Jul).

- **2026-07-29** — **Journey teaser path matched to the internal Journey page** (`transition-prototype.html`).
  The Home teaser drew a different curve from the `/journey` page — a wide, laterally-swooping weave
  (x from 150→560, horizontal control handles) vs the internal page's gentle vertical serpentine.
  Rebuilt the teaser's `layoutPath` to use the **same construction as `buildJourney`**: crests at
  LX=250 / RX=450 joined with vertical control handles (`m = half the y-gap`, so the tangent is
  vertical at every crest), starting centre-top and veering left first. Dots now sit **on** the
  crests (not at arbitrary path fractions) and each entry hangs on the crest's **outer** side
  (`on-left`/`on-right`, matching the internal page). viewBox 360→420 to fit the taller curve; the
  end marker changed from a filled triangle to a stroked fading tail like the internal one. Reveal
  windows flipped to complete **as the line reaches** each crest (`[f-.10,f-.02]` dot, `[f-.07,f]`
  entry) since the last crest is now the path's own endpoint (f≈1) and the old `[f,f+.08]` windows
  would have run past the draw. Verified the shapes side-by-side and the teaser in context.

- **2026-07-29** — **Home teasers now link into the Story pages; About dropped from the tray on its
  own page.** Two wayfinding fixes:
  - *Home-scroll section CTAs wired to the internal pages* (`transition-prototype.html`). The teaser
    links were prototype dead-ends (`href="#" onclick="return false"`). Now: "Explore the full
    architecture" → `sections-prototype.html#architecture`, "Read the journey" → `#journey`, "See
    all skills" → `#skills`, "Or learn more about me" → `#about` (the Demo's "See how the model
    performs" already pointed at the data prototype). Targets deep-link via each prototype's
    `bootFromHash`. GitHub/LinkedIn/email left as social links, not internal pages.
  - *The Story tray is hidden on the About page* (`sections-prototype.html`). The tray was always
    `position:fixed` and showed on every page, contradicting the standing intent (tray =
    Architecture · Journey · Skills only; About is off it, reached from the menu / Home bookend).
    `switchPage` now hides `.switch-dock` when the page is About and restores it otherwise. Verified:
    pill gone on About, back when leaving via the menu.

- **2026-07-29** — **Typography casing normalized — one rule per element role.** The site was already
  cased by role; this formalizes the rule and fixes the one deviation. The rule (source casing in
  parentheses where CSS re-cases it):
  - *Display titles* (page / scene / phase headers): **ALL-CAPS** via `text-transform:uppercase`
    (source kept Title Case, e.g. `The Journey`).
  - *Eyebrows / kickers / dates / the Home scroll indicator*: **ALL-CAPS tracked** via CSS.
  - *Section subheads (`<h2>`) and entry/panel titles*: **sentence case** ("The road your doodle
    took", "One bucket, three jobs", "Where it gets confused").
  - *Pipeline stop labels*: **lowercase**, proper nouns kept as-branded (`browser`, `the guess`,
    `Lambda`, `S3`, `Terraform`).
  - *Product / proper nouns*: **as-branded** (Draw Something, Next.js, k6 + Grafana, MLflow, DVC).
  - *Conversational lines*: **sentence case** ("Say hello.").
  Fixed the flagged mismatch: the Home indicator read "Behind the demo" for a section titled "Behind
  the Scenes" — both render uppercase, so a visitor saw **BEHIND THE DEMO** on the wayfinding chip vs
  **BEHIND THE SCENES** as the header, for the same section. Indicator is now `Behind the scenes`
  (sentence-case source, matching the other multi-word indicator `Live demo`; renders BEHIND THE
  SCENES to match the header). Left `Live demo` / `Contact` as intentional functional wayfinding
  labels (they never mirrored their section titles "Draw Something" / "Say hello.").

- **2026-07-29** — **Story/Data prototype punch-list cleared** (`sections-prototype.html`,
  `data-prototype.html`, `data-prototype-white.html`).
  - *Skills-page arrival line restored.* It carried `data-arrival="drift"`, but `runArrival()` only
    draws the stroke for `="line"` (the "drift" arrival was never implemented), so Skills silently
    had no line. Set to `"line"` like the other Story pages; verified the line now shows.
  - *Edge blur-fade ported to Story internal pages.* The scroll-driven top/bottom dissolve (three
    stacked backdrop-blur bands 2→6→14px + a wash toward the ground, top in once scrolled, bottom
    until the document end) previously existed only on the Data prototypes. The wash now tints
    **per page** via `color-mix(in srgb, var(--ground) 72%, transparent)` (ochre/sage/rose/blue)
    instead of the Data prototypes' fixed grey. Verified in-browser on Journey (ochre) and Skills
    (rose).
  - *Monitoring emoji removed.* Dropped the 👍/👎 from the feedback / proxy-accuracy copy; reworded
    to **"yes / no votes"** to match the demo's "Did I get it right? Yes / No" prompt.

- **2026-07-28** — **Menu: uniform links + panel matches the page ground** (all three internal-page
  prototypes). Dropped the mode-based muting — cross-file links (`.elsewhere`) were greyed as
  prototype scaffolding, which read as "these options are for a different mode." **Every menu item
  now looks identical**; the tray already declares where you are, the menu is just the full map.
  And the slide-in panel's background now tracks a `--ground` custom property set per page, so the
  drawer takes the current page's colour (Story: sage/ochre/rose/blue per page; Data: white /
  instrument) instead of a generic white — it reads as part of the page, un-dimmed, against the
  scrim. Added a soft left-edge shadow so the panel still reads when its colour equals the ground.

- **2026-07-28** — **Reverted the paged scroll back to scrubbed** (`transition-prototype.html`).
  The event-driven paging (previous entry) read as *frustrating* on repeat visits — the
  gesture-lock made moving feel gated even when you knew where you were going. Restored the
  scrubbed position-drive (native scroll, snap floors, 1250vh runway, `targetProgress` +
  smoothing); the dangling-mid-transition risk it re-introduces is accepted as the lesser evil.
  **Kept** from the paged round (both are driver-independent, pure functions of progress): the
  per-section **outgoing fade** and the **↓ next-section cues** on §3–§5 (re-wired from `goTo` to
  `scrollTo` the next floor).

- **2026-07-28** — **Home motion: paged (event-driven), and the outgoing section fades**
  (`transition-prototype.html`). Two fixes, one change:
  1. **Every section now fades as the next rises** — not just the Hero. Each outgoing layer's
     *content* dissolves (`inner.opacity = max(0, 1 - nextRise*1.35)`, the Hero's own curve) while
     the incoming sheet rolls up; the section bg stays until covered (so no flash of older colours
     underneath). The demo is the exception — its bg *is* the well below, so the whole layer fades
     and only the instrument dissolves. All of it is a pure function of progress, so **scrolling up
     reverses it exactly** (sheet rolls back down, previous content fades back in).
  2. **Scroll is now paged, not scrubbed.** Native scroll is disabled (`overflow:hidden`); a
     wheel/touch/key gesture past a threshold fires **one** transition that animates to completion
     (`REST[]` rest points, eased `current`, ~1.9×`--dur`), and further input is **locked out until
     it finishes** (+220 ms settle). This kills the "stranded between two sections on a jittery
     mouse" problem — you can never be left mid-transition. The scrub *math* (`apply(progress)`) is
     untouched; only the driver changed (progress is animated, not read from `scrollY`). The engine
     runs on `performance.now()` (the rAF timestamp and `scrollY` are both gone). Arrows/menu
     Home·Contact now call `goTo()`; six rest points; runway collapsed 1250vh → 100vh (one sticky
     viewport). Revises the Stage 4.5 scrub-drive (annotated there).

- **2026-07-28** — **Skills → Contact gets the roll-over too** (`transition-prototype.html`). The
  Contact bookend used to sit *outside* the sticky runway and arrive by a hard scroll-snap; it's
  now a **6th rising layer** (z-index 6, white) that rolls up over the settled Skills exactly like
  §2–§5 do — so the Home scroll is five scrubbed transitions, not four, and reverses cleanly. To
  avoid re-timing the dozens of hand-tuned sub-reveals, the whole story is **squeezed into raw
  progress `[0, STORY_END=.80]`** (a single `p = min(1, praw/STORY_END)` at the top of `apply()`,
  so every existing `segP` fraction is unchanged) and Contact rides the tail `[.80, 1]` on
  `T5=[.83,.96]`. Runway grew 1000vh → 1250vh (story keeps ~its old scroll length; Contact adds
  ~230vh); floors re-spaced to six; the ↓ arrows and the menu's Contact link retargeted to the new
  progress points. Verified the story is visually untouched (Journey et al. render identically at
  their remapped positions).

- **2026-07-28** — **Story prototype reconciled to the IA rework** (`sections-prototype.html`).
  The last stale file catches up: the `.switch-dock` drops About and now cycles only
  **Architecture · Journey · Skills** (About is off both trays — reached from the menu, and on the
  real site from the Home closing bookend; when About is active no tray item highlights). The menu
  becomes the **9-item global bridge** — Home · Quality · Monitoring · Performance · Architecture ·
  Journey · Skills · About · Contact — with the Story pages navigating in-page and everything else
  linking to its own prototype (Data → `data-prototype-white.html`, Home/Contact →
  `transition-prototype.html`), cross-file links muted like the Data prototype's. Fixed along the
  way: the staircase stagger uses `:nth-child` (the nav mixes `<a>`/`<button>`, so `:nth-of-type`
  scrambled it) and extends to 9; `.elsewhere` links now warm on hover. All three prototypes now
  agree on the two-mode IA.

- **2026-07-28** — **Hero: name stays the pure original cut + a subtitle.** Two hairline fixes
  were tried against "the thins vanish on non-retina screens" — a heavier cut (weight 680 +
  opsz 64) and a 0.4px uniform text-stroke — and **both were rejected**: each dulled the didone
  character that makes the hero. Verdict: the gossamer hairlines *are* the look; keep
  weight 500 · opsz 96 untouched. (Don't re-propose either fix.) **Prominence comes from depth
  instead**: a tight + ambient text-shadow (`0 2px 6px ·08 + 0 16px 40px ·14`) — the same
  layering as the lifted panels — lifts the name off the white and gives the thins a faint
  reinforcing halo without altering the letterforms. The hero
  does gain a subtitle: **"MLOps Project & Portfolio"** — letterspaced micro-caps under the name,
  entering between the name and the arrow (delay .32s). Rationale: a bare name reads as vanity;
  the subtitle declares what the site *is* before the demo does.

- **2026-07-28** — **The pad demonstrates itself (idle self-drawing demo)** — store-window
  behaviour: the mock doodle draws itself on a loop (draw → hold → fade → redraw, ~5s) whenever
  nobody is drawing; the visitor's first touch stops the demo and inks for real (the prototype's
  pad now captures strokes, and Clear/Undo actually work); after **15s of quiet** the sketch fades
  and the demo resumes (never mid-stroke). **The demo rotates through six of the model's real
  classes** — cat, house, star, fish, umbrella, clock — one per loop (swapped while the mock is
  invisible), and resumes on a fresh doodle after an interruption, so the idle animation doesn't
  wear thin. This also answers the borderless pad's affordance
  question — the self-drawing loop *is* the "draw here" hint. Reduced motion: static doodle, no
  loop.

- **2026-07-28** — **Demo §2 becomes ONE instrument** (Monish's pick over a two-panel "causal
  column"). A single wide lifted Data panel — the span-12 grammar of the Data pages — holds the
  whole demo, split by hairlines: drawpad (an inner input field: hairline, no lift) + Clear/Undo
  as proper pill buttons · predictions (ink labels — muted gray was blending) · **verdict block**
  ("Did I get it?" 15px ink + larger Yes/No pills, its own hairline section — it feeds Monitoring's
  proxy accuracy, it earns the weight) · **the doorway, finally added**: "every guess is scored —
  See how the model performs →" pinned to the instrument's foot, linking into Data mode
  (`data-prototype-white.html`). The Demo's menu Quality/Monitoring/Performance links now point
  there too. Supersedes the same-day two-papers cut. _(Later that day: a live **§2-layout dock**
  was added to the prototype chrome — instrument ↔ "causal columns" (two equal panels, the right
  one ending on the doorway) — so the pick can be felt in place before it's final.)_

- **2026-07-28** — **Demo §2 foreshadow reconciled to the white pick** (`transition-prototype.html`).
  The Demo's ground becomes Data mode's **well `#f6f8fb`** — chosen over pure white (which would
  erase the Hero→Demo cross-fade beat) and over a made-up half-step tint (the well is a *real*
  Data-mode surface, so "every section the colour of where it leads" stays literally true). The
  **demo's two columns both become lifted Data panels** — the canvas card *and* the prediction
  column (bars · feedback · privacy note) wear the panel chrome (cool hairline `#e4e8ef`, slate
  shadow, 13px radius), so §2 is **two floating papers on the well: the Data-mode composition
  itself**. (The first cut left the predictions bare on the ground and read as no change — the
  well tint is imperceptible with nothing white beside it; the second panel is what makes the
  cool ground *read*.) Bar tracks take the Data grid `#e7ebf1`; ochre fills stay, the demo's
  money moment is brand attention. Closes the open item from the white pick.

- **2026-07-28** — **White / lifted paper wins the Data-mode surface A/B**
  (`data-prototype-white.html`). The ground goes white; data cards lift as paper (slate-tinted
  shadows + cool hairline `#e4e8ef`), and narrative panels recess into a cool well `#f6f8fb` —
  three surface levels (well < ground < paper) instead of the tinted scheme's one. Chart ink and
  status colours unchanged, revalidated on `#ffffff` — mode identity rides the chrome, not the
  data hues. Supersedes the same-day tinted ground `#f2f4f7`. One consequence left open: how
  Home's Demo §2 foreshadows a white-grounded Data mode (well chrome vs a half-step tint
  `#f7f9fb`) — decide on the Home pass.

- **2026-07-28** — **Data-mode palette settled by measurement + all three pages prototyped**
  (`data-prototype.html`). Ground `#f2f4f7` confirmed; chart ink = one validated blue family
  (primary `#2a78d6`, sequential ramp, ordinal p50→p99 ramp) with reference-gray for context;
  status = green/red **+ watch = brand ochre** — the distinct-amber option measured ΔE 13.7 from
  ochre, under the 15 normal-vision floor, so "almost the same amber, different meaning" lost to
  deliberate reuse (status always carries icon + label anyway). **No per-page accents** inside the
  mode. Quality/Monitoring/Performance render the real hub snapshots (api-metrics mocked to
  contract until the hub's first capture); every chart has a hover layer + table twin.

- **2026-07-26** — **Home scroll order confirmed + About's doorway.** Order: **Hero → Demo →
  Architecture → Journey → Skills → Closing** — the demo's "behind the scenes" hands straight to
  Architecture, then Journey deepens into process, Skills consolidates, Closing reaches out. Matches
  both the colour foreshadowing (each section the colour of where it leads) and the original Stage 2
  composition. The **closing bookend carries an explicit About link** ("or learn more about me →") —
  About is off-tray, so this + the menu are its two doorways.
- **2026-07-26** — **Color now encodes the mode, not the page.** The Stage 3 one-wash-per-destination
  rule doesn't survive three new Data pages (seven low-chroma washes stop reading as wayfinding).
  Story mode keeps its warm per-page washes (sage/ochre/rose, teaser-inherited); About keeps dusty
  blue; **Data mode shares one cool "instrument" ground**, with the **tray** (not colour) doing
  wayfinding inside the mode. Ochre stays the sole interactive accent; Data mode **adds a semantic
  status palette** (pass/watch/fail) for charts + status marks only — additive, not a replacement.
  Knock-on: the Home **Demo** section takes the instrument ground (foreshadowing Data mode) now that
  About owns the old blue. Exact hues + the watch-vs-ochre nuance deferred to the visual pass. Chosen
  over extending wash-per-page (blurs at 7 tints) or fully unifying inner pages (loses warm
  character).
- **2026-07-26** — **Data mode split settled: three pages — Quality · Monitoring · Performance.**
  Arc: report card → is it holding up → is it fast. `evidence.json` → Quality (dense, every deploy);
  `drift.json` + `feedback.json` → Monitoring (drift's weekly cadence carries feedback's sparse
  weeks); `api-metrics.json` → Performance (framed as the last EKS load-test snapshot, so its monthly
  cadence reads as intentional). Grouping deliberately pairs the two thin contracts with a reliable
  neighbour or a periodic framing so no page is routinely blank. Chosen over a two-page (Quality/Live
  or Model/Service) or one-page split — three stops give the Data tray real purpose and the cleanest
  narrative.
- **2026-07-26** — **IA reworked into two internal modes (nothing re-locked).** The mlops platform
  now publishes six live data contracts, and the four monitoring/quality ones had no home in the
  six-destination IA. New shape: **Home** (hero scroll, teasers as doorways) → **Story mode**
  (Architecture · Journey · Skills, one bottom tray) and **Data mode** (Evidence/Metrics/Monitoring/
  Performance — split TBD, a second bottom tray), reached from the Demo; **About** stays standalone,
  off both trays. **Trays are isolated per mode; the menu is the only bridge** between modes (the
  connected-tray alternative was rejected to keep each mode's identity distinct). About pulled out of
  the prototype tray. Data-mode page split, its ground/color, and the fate of the wash-wayfinding
  system are left open — the visual design is being reworked alongside. Supersedes the Stage 2 IA and
  Stage 3's link-out-only treatment of monitoring data. Full spec: "IA rework (2026-07-26)" above.
- **2026-07-20** — **Stage 4.7 locked — Architecture page opens with an overview, then the
  breakdown.** Prototyping showed the three chapters never let a visitor see the whole
  system at once. Added a **consolidated system-overview diagram** (a unified lifecycle
  with a fork — build → image → forks to live-serve + weekly-rehearse → merges to
  monitoring) under an **"Overview"** heading, with the three chapters as the detailed
  breakdown; the **five-stop `draw ▸ preprocess ▸ …` summary line is removed**. The
  overview's **subsystem tiles are "zones"** that scroll-jump to their chapter (a
  "see chapter ↓" hover cue); shared artifacts are non-interactive. Chapter diagrams may use
  **icon tiles** (monochrome tool glyphs) and run **vertically** when a row would wrap
  (chapter 2 does). Revisits the Stage 3 "one-big-map rejected" call — the map returns but
  stays high-level and collapses cleanly on mobile. **All node/tool/topology content is
  illustrative** and changes once the platform is built. Open: glyphs vs. brand logos, and
  whether all chapters go vertical.
- **2026-07-20** — **Stage 4.6 locked — inner-page navigation from section prototyping.**
  Prototyping the four inner pages (`sections-prototype.html`) surfaced that the inner
  destinations are peers worth hopping between directly. Added, **inner-pages only**: a
  **persistent bottom navigation tray** (Journey · Architecture · Skills · About, active
  item filled) that also **declares current location**, and a top-left **"← Home"**
  back-to-Hero affordance (thin arrow, nudges on hover). The inner-page top bar is now
  **"← Home" left / hamburger right**, and the **current-section indicator is dropped on
  inner pages** (the tray replaces it; it survives inside the Home scroll). The **menu is
  kept whole** — its unique inner-page value is now Contact; trimming it was considered and
  deferred. **Home is unaffected** (no tray; the funnel-through-demo flow stands).
  Supersedes the earlier "no persistent nav bar" intent (the quiet centered pill earns it
  on inner pages) and the "top-bar left = section indicator" slot on inner pages.
- **2026-07-19** — **Stage 4.5 locked — motion & flow amendments from prototyping.** Built
  two working artifacts (`design-system-preview.html` motion demos and
  `transition-prototype.html`, the full Home scroll hero→bookend) and revised from the
  visitor's POV. **Motion is scrub-driven**: reveals map to slices of the scroll (a hard
  flick plays choreography fast instead of skipping it; scrubbing back plays it in
  reverse), with **clocked money moments** (the bar fills fire on visibility at their
  designed tempo) and exponential smoothing carrying the expo character; every duration
  hangs off one **`--dur` token** (default .48s, final value at implementation).
  **Hard floors**: mandatory scroll-snap with `scroll-snap-stop: always` — a fling
  can't pass a section, released scroll self-completes the transition. **§1→§2 fixed**:
  the name floats *above* the rising panel, fading in place in full view (the old
  stacking swallowed the fade). **§2 gains its own ↓ cue** to §3. **Home ends on a
  white bookend** — "Say hello." / icon trio with copy-email / "Or learn more about
  me →" → about — the Hero's mirror, arriving in normal flow as the sticky stack
  releases; §5 slims to end on "See all skills →", and no solid button remains on Home.
  **Contact folded into the bookend**: no standalone route (the thin page duplicated
  info now in three places — the Résumé precedent); the menu's Contact entry targets
  the bookend; About keeps the contact block. **The menu arrives with §2**: the Hero is
  bare and the demo has no menu entry, so the first scroll funnels every visitor
  through the flagship before the map appears — one affordance, no accidental skips,
  tighter control over the experience than two competing doors.
- **2026-07-17** — **Stage 4 locked — the design is finalized.** Front-to-back review (run in
  a fresh conversation, per practice) found the system coherent and four issues, all resolved:
  **muted gray darkened to `#6b6b6b`** (the flagged `#828282` fails AA even on white);
  **Contact's display email corrected to deep ochre `#96600a`** (bright ochre measured 2.9:1
  on white — the spec predated the token pass by hours); **Home §4's teaser entries ordered
  oldest-first** to match the Journey page's walk and keep the arrival morph's logic; and the
  **stale text swept** (dots rest in ink per the token pass; wash values inlined where "TBD"
  notes remained; "hairline" now strictly means `#e8e8e8`-on-white — drawn lines on washes are
  ink, including §5's footer rule and the Skills divider). Small gaps closed: footer icons ink
  with ochre hover; Contact links deep ochre. Accepted deliberately: ochre hovers on the ochre
  wash (2.5:1 — transient, over ink resting states), and About keeping the blue wash despite
  §5 (rose) pointing to it — the wayfinding rule is one wash per inner page. Implementation
  still waits on the mlops build.
- **2026-07-17** — **Stage 3: four-ground token pass locked — Stage 3 complete.** Washes
  derived with one OKLCH formula (hue kept, shared lightness/chroma) and adopted at the
  **"present"** intensity — `#e7f0ff` / `#e0f7e7` / `#ffecdb` / `#ffe8ee` — with the fainter
  "whisper" set recorded as an alternate at Monish's request. Contrast measurement forced and
  won two corrections: the **ink-line rule** (drawn lines/dots in `#0a0a0a` — `#e8e8e8` is
  invisible on washes; dots rest ink, warm to ochre on hover, closing §4's question) and
  **deep ochre `#96600a`** for body-size links/small labels (bright `#c98a3a` keeps all large
  jobs). The muted-gray correction (`#828282` fails AA even on white) was **declined for
  now** and flagged for Stage 4. Stage 4 (whole-design review) is next.
- **2026-07-17** — **Stage 3: Contact page locked — all six destinations specified.** The
  **Hero's bookend**: white ground (the only inner page on white — the four tints are all
  claimed, and the circle back to plain paper is the point), centered **"Say hello."** in
  Bodoni Moda over a large ochre **click-to-copy email** (Outfit — technical text stays
  sans even at display size), mailto secondary, GitHub/LinkedIn text links. **No contact
  form**: static site, and the email does the job without a third-party dependency. Hero's
  reveal motion reused. Only the four-ground token pass remains before Stage 4.
- **2026-07-17** — **Stage 3: About page locked.** Ground = the **dusty-blue wash** (the one
  tint without an inner page, completing the wayfinding set). CV rendered as **the straight
  line** — a vertical hairline with dots, newest first, under "Work" and "Education"
  subheads — deliberately contrasting Journey's winding road: the story winds, the record
  stands straight. **Small portrait** with the bio (photograph-on-the-page treatment);
  quiet **"Download résumé (PDF)"** link; closing **contact block** (click-to-copy email +
  GitHub/LinkedIn text links) fulfills the carried requirement from §5's "or reach out"
  button. Lead "The person behind the machine" mirrors Architecture's lead.
- **2026-07-17** — **Stage 3: Skills page locked.** Model = **skills with receipts**: a
  "PROVEN HERE" tier where each skill gets one plain line of what it did in this project
  plus an ochre evidence link (Architecture stop, Journey entry, CI run, repo), then an
  "ALSO IN THE TOOLBOX" tier — the long tail as quiet drifting lines with no claims.
  **No proficiency bars/levels anywhere**; the evidence does the grading. Chosen over a
  labeled grouped inventory and pure drifting lines because a plain list is what every
  portfolio has, and this site's thesis is show-don't-claim. Skill names set in Outfit
  (technical terms stay sans); arrival and reveals reuse §5's side-drift gesture.
- **2026-07-17** — **Stage 3: Architecture page locked.** Organized as **three chapters** in
  the line-and-dot grammar — *the road your doodle took* (live path), *the factory that
  builds the model* (CI/training, with the blocked-deploy **dead-end stub** on the quality
  gate), *the weekly dress rehearsal* (ephemeral EKS, ending in a deliberate full stop) —
  with the five-stop summary line up top and the "line carries you" arrival reused from
  Journey. Component write-ups open as **paper cards** (Journey card grammar, shareable
  URLs). Chosen over a one-big-map (dense, collapses on mobile anyway) and sticky
  scrollytelling (costliest, would obsolete the cards). Closing strip states the persistent
  footprint and links the evidence hub + repo.
- **2026-07-17** — **Stage 3: Journey entry card locked — no separate entry page.** A devlog
  post opens as a **white paper card over the dimmed Journey page** (Monish's idea), scaling
  up from the clicked dot; the visitor never leaves the path. Long reads scroll inside the
  card; evidence links open in new tabs; closes via ×/Esc/scrim back to the same spot. Two
  requirements folded in to make the no-page model safe: the card is a **generous reading
  surface** (these are long posts), and **every entry keeps a shareable URL** that reopens
  its card directly. Chosen over a menu-style slide-in panel and an expand-in-place
  accordion — the paper card reuses the canvas card's grammar and reads like a page from the
  logbook.
- **2026-07-17** — **Stage 3: Journey page locked.** The §4 path continues at full length —
  every entry on one line, **oldest at the top** so scrolling reads as the walk from start to
  today, small phase markers on the line, and the path **trailing off unfinished** past the
  newest entry (the project is ongoing). **Pale ochre ground**, setting the precedent that an
  inner page inherits its Home section's tint (washes as wayfinding). Arrival transition =
  **"the line carries you"**: the old view fades, one hairline draws down, the page arrives
  threaded on it (view-transition morph if the modified Next.js allows; fade + draw
  otherwise). Chosen over a page-rise or plain fade because it's the only option that
  continues the path metaphor. Still open: the single-entry post template.
- **2026-07-17** — **Stage 3: Home §5 Skills + closing locked; Home fully specified.** Chose to
  **keep the flow rolling** instead of breaking into a two-door teaser: §4's arrow lands on real
  skills content — **drifting lines** of tool names in large Outfit, staggered left/right with
  §4's asymmetry rule — then an ochre "See all skills →", then one solid closing button with the
  full phrase **"Learn more about me or reach out"** → `/about` (accepted trade-off: the label
  names two things and goes one place; in exchange the **About page must repeat contact info**,
  recorded as a carried requirement). The About teaser is folded into that button. **Footer:**
  three centered thin-line icons only — GitHub and LinkedIn open profiles, the **email icon
  copies the address** with a "Copied" confirmation. Rationale: a continuous story reads better
  than a directory ending, and a stranger leaves with real information instead of pointers.
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
