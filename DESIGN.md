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
  | 5 | **Skills + closing** | dusty rose `#b3637b` | Skills content, closing button, footer — Stage 3 §5 folded the About teaser into the button |

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

### Architecture page (`/architecture`)  _(LOCKED 2026-07-17)_

The mlops deep-dive as a **three-chapter story**, told in the site's line-and-dot grammar.
Sage wash (inner-page tint precedent, from Home §3); section indicator reads
**"Architecture"**. Content source: the mlops repo's `PLAN.md` §3 — exact stops get refined
against the built system at implementation.

- **Title:** **"Architecture"** in Bodoni Moda; Outfit lead: **"The machine behind the
  doodle"**.
- **Summary line:** the familiar five-stop line (draw ▸ preprocess ▸ model ▸ serve ▸
  monitor) sits under the title — the anchor to Home §3. Non-interactive here too; the
  chapters below do the work.
- **Arrival transition — "the line carries you," reused.** From Home §3's "Explore the full
  architecture →": the section fades and the five-stop line persists, redrawing at the top
  of the page (view-transition morph if the modified Next.js allows; fade + draw fallback;
  plain fade under reduced motion). From the menu, the page arrives with the line drawing in.
- **Three chapters,** each a Bodoni Moda heading + one plain Outfit sentence + a thin-ink
  diagram (`#0a0a0a` — dots as stops, thin connectors, Outfit labels with few-word sub-labels):
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

### Contact page (`/contact`)  _(LOCKED 2026-07-17)_

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

## Decision log

Newest first. Each entry: what was decided and why.

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
