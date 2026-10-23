# Portfolio — Design Specification

**This document is a carbon copy of the finalized design.** The design *is* the
prototype files; this spec transcribes every value, layout, motion, and interaction in them so
the real site can be built to match exactly. Where a pixel-exact path, chart algorithm, or SVG
geometry is needed, the prototype is the literal source of truth.

| Prototype (source of truth) | Covers |
|---|---|
| `transition-prototype.html` | **Home** — the six-section scroll (Hero · Demo · Behind the Scenes · Journey · Skills · Contact bookend) |
| `sections-prototype.html` | **Story mode** — Architecture · Skills — and **About** |
| `journey-page-svg-sketches.html` | **Story mode → Journey** — the all-SVG scroll-camera road (supersedes the Journey page that used to live in `sections-prototype.html`) |
| `data-prototype-white.html` | **Data mode** — Quality · Monitoring · Performance |

The prototypes are standalone HTML (inline `<style>`/`<script>`, Google-Fonts `<link>`). The real
site is Next.js static export reading copy from `content/*.json` and live numbers from the mlops
evidence hub. **Text/number content is NOT authored in components** — the prototypes' hard-coded
strings are placeholders; the structure, layout, type, motion, and interaction are the spec.

The earlier staged decision-log that used to live here is in git history (`git log DESIGN.md`).

---

## 1. Design tokens

All three prototypes share one `:root`. Values are identical across files except where noted.
Light theme only; no dark mode.

### 1.1 Core palette (all pages)

| Token | Value | Use |
|---|---|---|
| `--background` | `#ffffff` | page ground |
| `--border` | `#e8e8e8` | hairline separators on white surfaces |
| `--foreground` | `#0a0a0a` | primary text; **all drawn ink** (lines, dots, SVG strokes) |
| `--muted-foreground` | `#6b6b6b` | secondary text, micro-labels (AA-safe) |
| `--warm` | `#c98a3a` | **bright ochre** — the one hover/active color, large marks, fills, focus |
| `--warm-soft` | `#e8b87e` | soft ochre (secondary bar fills, hover borders) |
| `--deep-ochre` | `#96600a` | **deep ochre** — small text links & labels (AA on white + all washes) |
| `--ease-out-expo` | `cubic-bezier(.16,1,.3,1)` | the reveal/transition easing |
| `--ease-hover` | `cubic-bezier(.2,.7,.35,1)` | hover easing (short travel, no front-load) |
| `--hover-dur` | `.18s` | hover duration |
| `--hover-scale` | `1.08` | hover grow factor |
| `--dur` | `.48s` | the single global motion duration |

### 1.2 Section washes (Home + Story wayfinding)

Each inner page inherits the wash of the Home section that points to it.

| Token | Value | Home section / inner page |
|---|---|---|
| `--wash-blue` | `#e7f0ff` | (orphaned; About took warm paper instead) |
| `--well` | `#f6f8fb` | **Demo §2 ground** + Data-mode recessed well |
| `--wash-sage` | `#e0f7e7` | Behind-the-Scenes §3 → **Architecture** |
| `--wash-ochre` | `#ffecdb` | Journey §4 → **Journey** |
| `--wash-rose` | `#ffe8ee` | Skills §5 → **Skills** |
| `--paper` | `#f6efe3` | **About** ground (warm paper; Story file only) |

Inner-page ground is set by `body[data-page]`: journey=ochre, architecture=sage, skills=rose,
about=paper. The slide-in menu reuses `--ground` so the drawer tints to the page.

### 1.3 Skills/About "wash" blob fills (multiply-blend shapes)

Five desaturated fills, multiplied together so overlaps deepen on their own.

| Token | Value |
|---|---|
| `--w-rose` | `#fbd3dc` |
| `--w-ochre` | `#f8dfc4` |
| `--w-sage` | `#d8ecde` |
| `--w-blue` | `#dee5f4` |
| `--w-sand` | `#f1e7d0` |

### 1.4 Home seam tokens (ground-merge system)

Home's six sections **merge** grounds instead of butting (no hard line at any boundary). Each seam
is the oklab midpoint of its two neighbouring grounds, derived (not typed) so a repalette moves
with it:

```
--seam-12: color-mix(in oklab, #ffffff, var(--well));            /* Hero→Demo   */
--seam-23: color-mix(in oklab, var(--well), var(--wash-sage));   /* Demo→Scene  */
--seam-34: color-mix(in oklab, var(--wash-sage), var(--wash-ochre)); /* Scene→Journey */
--seam-45: color-mix(in oklab, var(--wash-ochre), var(--wash-rose)); /* Journey→Skills */
--seam-56: color-mix(in oklab, var(--wash-rose), #ffffff);       /* Skills→Contact */
```

A `.sec` paints one full-height `linear-gradient`: `seam-top` at 0 → `--sec-bg` at `--merge` → `--sec-bg`
at `100%-merge` → `seam-bottom` at `100%`. `--merge: clamp(72px,11vh,132px)`. Sections with no
neighbour (Hero top, Contact bottom) default the seam to their own ground (flat no-op).

### 1.5 Data-mode instrument palette (`data-prototype-white.html` only)

The "white / lifted-paper" variant. Mode identity rides the **chrome** (slate shadows, cool
hairlines), not a ground tint. Chart hues validated on `#ffffff`.

| Token | Value | Use |
|---|---|---|
| `--well` | `#f6f8fb` | recessed well (narrative panels, verdict banner) |
| `--card` | `#ffffff` | lifted paper (chart panels) |
| `--card-border` | `#e4e8ef` | cool hairline (where the shadow fades) |
| `--grid` | `#e7ebf1` | chart gridline |
| `--axis` | `#c9cfd9` | baseline / axis rule |
| `--chart-primary` | `#2a78d6` | the mode's data ink (blue 450) |
| `--chart-deep` | `#256abf` | deeper blue |
| `--ref-gray` | `#8a93a1` | reference/context series (deliberately gray) |
| `--ok` / `--ok-text` | `#0ca30c` / `#006300` | positive · pass · stable |
| `--watch` / `--watch-text` | `#c98a3a` / `#96600a` | watch — **= brand ochre, deliberately** |
| `--bad` / `--bad-text` | `#d03b3b` / `#d03b3b` | negative · fail · drifted |

Status color is used **only** in charts and status marks, always with an icon + label, never color
alone. Panel lift shadow: `0 22px 46px -28px rgba(15,23,42,.20), 0 3px 9px -5px rgba(15,23,42,.07)`.

---

## 2. Typography

Two families, loaded variable from Google Fonts:
`Bodoni Moda` (ital, opsz 6–96, wght 400–900) + `Outfit` (wght 100–900).

- **Body / UI / data** — `Outfit`, `font-weight:330`, `line-height:1.6`, antialiased. System mono
  stack (`ui-monospace, Menlo, monospace`) for code, metrics, date ranges.
- **Display titles** — `.display` = `Bodoni Moda`, `font-optical-sizing:auto`,
  `font-variation-settings:"opsz" 96`, `font-weight:500`, `line-height:.92`, `letter-spacing:-.02em`.
  Titles are often `text-transform:uppercase`. Smaller display uses lower opsz (`72`, `48`, `40`,
  `28`) to keep hairlines proportionate.
- **Micro-label** — `.micro` = uppercase, `letter-spacing:.22em`, `font-size:11.5px`,
  `font-weight:500`, `--muted-foreground`.
- **Editorial voice** — emphasis is by **scale at a light weight**, never bold or all-caps body.
  Menu links are Bodoni mixed-case weight 400 (not caps). **No emoji anywhere.**

### Type scale (exact, by use)

| Element | Font / size |
|---|---|
| Hero name (Home §1) | `.display`, `clamp(52px,12vw,140px)`, uppercase, `text-shadow:0 2px 6px rgba(10,10,10,.08),0 16px 40px rgba(10,10,10,.14)` |
| Hero subtitle | Outfit `clamp(12px,1.5vw,15px)`, `letter-spacing:.34em`, uppercase, 500, muted |
| Inner page title (`.page-title`) | `.display`, `clamp(46px,9vw,96px)`, uppercase |
| Page lead (`.page-lead`) | Outfit `clamp(16px,2vw,21px)`, muted |
| Section title (Home §2–5 `.scene-title`/`.demo-title`) | Bodoni opsz 72, 500, `clamp(30px,5vw,54px)` |
| Menu link | Bodoni opsz 72, **weight 400**, `font-size:min(clamp(29px,4.6vw,38px),8vw)`, mixed case |
| Body links (`.link`) | `--deep-ochre`, no underline, `border-bottom:1px solid rgba(150,96,10,.32)` |
| Micro-label | see `.micro` above |

---

## 3. Motion system

- **Reveal on scroll** — every revealable element (`.reveal`, plus `.j-entry`, `.cv-stop` on inner
  pages) starts `opacity:0` and is driven **per-frame from its position** (not IntersectionObserver).
  - *Home* keys a reveal to its **section's** arrival (sections are one screen each):
    `sectionProgress = clamp((vh*0.85 - rect.top)/(vh*0.70), 0, 1)`;
    `revealProgress = clamp((sectionProgress - stagger*REV_STEP)/0.40, 0, 1)`, eased `1-(1-p)^3`.
    `REV_STEP` is derived from the deepest `data-stagger` so the ladder always settles before the
    section is flush (`REV_STEP = min(.10, (1-.40-.06)/maxStagger)`).
  - *Story/Data* (long documents) key a reveal to the **element's own rect**:
    `start=vh*0.88 - stagger*vh*0.045`, `end=vh*0.60 - …`; page-foot blocks anchor to their own
    height (`clamp((vh*0.98-top)/height,0,1)`) so bottom-of-page items reach 1.
  - A settled element (`p>0.999`) drops its transform entirely (no leftover `translate3d` — it keeps
    a composited layer that softens the light serif under the hover zoom). Motion is `translateY(16px)`
    up (or `translateX(±28px)` for side reveals / `±24px` on Home).
  - `data-stagger="n"` delays a reveal by `n` steps within its group.
- **The one hover (whole site)** — every control answers the pointer identically: warm to ochre
  (`--warm`), grow by `--hover-scale`, over `--hover-dur` on `--ease-hover`. Deep-ochre links go to
  bright ochre; a pill's border warms with its label. Three triggers: `:hover` inside
  `@media (hover:hover) and (pointer:fine)`, `:focus-visible` (plus a `2px solid var(--warm)` outline
  offset 2–3px), and `:active` (touch; an empty `touchstart` listener enables iOS `:active`).
- **Text-that-is-read vs marks** — in Journey/Skills/About hovers, text you read while lifted goes
  **deep ochre** (`.hot` title); marks (dots) go **bright ochre**.
- **`--dur:.48s`** governs reveals, menu, cards, page fades. Hover is always `.18s`.
- **Reduced motion** — `@media (prefers-reduced-motion:reduce){ *{animation:none!important;
  transition:none!important;} .reveal{opacity:1!important;} }`. All scroll-linked effects (edge blur,
  journey comet, skills morph, lenses) are gated off; content shows in place.

---

## 4. Shared chrome

### 4.1 Top bar (`.topbar`, fixed, z-30, `padding:18px 26px`, `pointer-events:none`; children re-enable)

- **Home:** left = **current-section indicator** (`.indicator`, 12px, `letter-spacing:.14em`,
  uppercase, muted) — blank on Hero, then "Live demo / Behind the scenes / Journey / Skills /
  Contact". Right = **hamburger** (`.menu-btn`), **hidden on the Hero**, fades in as the Hero leaves
  (`clamp((scrollY - heroH*0.35)/(heroH*0.30),0,1)`). Icon: 3 lines, `26×14`.
- **Inner pages (Story + Data):** left = **"← Home"** (`.home-link`, chevron + "Home", uppercase
  12px; chevron nudges left 3px on hover). Right = hamburger (icon `22×22`, 3 lines). No section
  indicator on inner pages.

### 4.2 Slide-in menu (identical everywhere) — the global bridge, the only link between modes

- `.menu-btn` opens `.menu-panel` (fixed right, `width:min(400px,88vw)`, z-51, `background:var(--ground)`,
  `border-left:1px solid var(--border)`, `box-shadow:-20px 0 48px -28px rgba(10,10,10,.30)`,
  `padding:24px 34px 34px`), over `.m-scrim` (`rgba(10,10,10,.16)`, z-50). Panel slides
  `translateX(102%)→0` over `--dur` on `--ease-out-expo`; scrim fades over `.8×--dur`.
- Head: `.micro` "Menu" + close `×` (`.m-close`, 20×20).
- Nav = **four groups**, each with a `.menu-cat` micro-label; a group fades-up as a unit with a
  staircase stagger (`:nth-child` → `--stagger` = `.2 / .32 / .44 / .56 × --dur`):
  - **Start** — Home
  - **The Data** — Quality · Performance · Monitoring
  - **The Story** — Architecture · Journey · Skills
  - **More** — About · Contact
- Links: Bodoni opsz 72, weight 400, `clamp(29px,4.6vw,38px)` (capped `8vw`), mixed case; the one
  hover. Close on `×`, scrim, or Esc; focus moves to close on open, back to button on close.
- Menu order ≠ Data tray order (tray: Quality · Performance · Monitoring — see §7).

### 4.3 Edge blur (all pages) — the page dissolves at top & bottom edges

Two fixed bars (`.edge-blur.top` h110, `.edge-blur.bot` h130, z-25, `pointer-events:none`), each
with 3 stacked `backdrop-filter` layers masked into bands so the blur **ramps 2→6→14px**, plus a
`::after` wash toward the ground (`72%`). Chrome (topbar z30, menu z50/51, cues z26, cards z60/61)
stays above and crisp.

- **Data/Story:** opacity scroll-keyed to **depth** — top on once scrolled, bottom until document
  end. Wash = `var(--ground)` (tints per Story page).
- **Home:** opacity keyed to the **crossing** (full while a section passes an edge, 0 once one rests
  flush) so a section's own head is never permanently soft: `edgeStrength = min(clamp(d/140,0,1),
  clamp((max-scrollY)/140,0,1))` where `d` = px from nearest section boundary to screen top. Wash is
  **per edge**, read from the ground actually painted behind that band (`edgeGround()` mixes across
  the merge). Off entirely under reduced motion.

### 4.4 Arrival line — "the line carries you" (inner pages)

`.arrival-wrap` (fixed top, z-20) holds a 150px vertical `.arrival-line` (ink, 1.4, `dasharray:160`).
On page entry it positions just right of that page's title (`title.right+52px`, capped
`innerWidth-60`), draws down over `1.7×--dur`, then **retires** (fades) after 700ms. Off under
reduced motion. (In the real site this is the route-transition device between inner pages.)

### 4.5 Paper card (Journey entries · Architecture stops · About CV entries)

Shared overlay. `.card-scrim` (`rgba(10,10,10,.20)`, z-60) + `.paper-card` (fixed centre,
`width:min(680px,92vw)`, `max-height:86vh`, scrolls inside; `#fff`, `border:1px solid var(--border)`,
`border-radius:6px`, big slate shadow, `padding:clamp(28px,5vw,52px)`, z-61).

- **Open:** scales `0.6→1` from the clicked element's centre (`--ox/--oy`), scrim fades, over `--dur`.
  Closed, it is `pointer-events:none` (so it never blocks links beneath).
- **Structure:** `.card-x` (close, top-right) · `.card-meta` (uppercase micro) · `.card-title`
  (`.display`, Bodoni opsz 72, `clamp(26px,4vw,38px)`) · `.card-body` (repeating `<h4>` section head
  (uppercase 12px, 600) + `<p>` 15px, max 60ch) · `.card-ev` (top-ruled list of ochre `.link ↗`
  evidence links, new tab).
- **Card content shapes:** Journey cards = Context / Options considered / Decision / What went wrong.
  Architecture cards = What it is / Why this choice / Trade-offs. About cards = role-specific.
- **Close:** `×`, scrim, or Esc; focus returns to the opener.
- **Shareable URL per card** — opening sets the hash (`#journey/<id>`, `#architecture/<part>`); the
  URL opens the page with that card already open (`bootFromHash`). In the real site these become real
  per-entry / per-component routes.

### 4.6 Bottom tray (`.switch-dock`) — within-mode navigation (Story + Data, **isolated by mode**)

Fixed bottom-centre pill (`#fff`, `border-radius:30px`, `padding:6px 8px`, shadow
`0 8px 24px -16px`, z-40). Tabs (`.sw`, Outfit 12.5px, muted) jump between the mode's pages; the
active tab is `background:var(--foreground)`, `#fff` text, and does not answer the pointer.
- **Story tray:** Architecture · Journey · Skills.
- **Data tray:** Quality · Performance · Monitoring.
No cross-mode tray link — the menu is the only bridge. On ≤640px the tray sits `bottom:70px`.

### 4.7 Read-next foot (`.read-next`) — the forward handoff, mirror of "← Home"

Last block on every inner page, under a `1px solid var(--foreground)` top rule. A `.rn-link`
column: `.rn-cue` "Next" (micro) · `.rn-row` = `.rn-name` (Bodoni opsz 72, weight 500, uppercase,
`clamp(34px,6vw,54px)`) + `.rn-arrow` (chevron, slides right 3–4px on hover) · `.rn-peek` (the next
page's lead line). The whole link warms to ochre on hover. **Order** (menu order within each mode,
then crossing):
- Story: Architecture → Journey → Skills → About → Contact.
- Data: Quality → Performance → Monitoring → Architecture.

### 4.8 Card hint (`.card-hint`) — "Click/Tap … to read"

One deep-ochre line under a page's lead where items open cards. A thin target-dot icon + text; the
verb follows the input (`.on-fine` "Click" / `.on-touch` "Tap" via `@media (hover:none)`).

---

## 5. Home — the six-section scroll (`transition-prototype.html`)

Sections are **plain blocks in normal document flow** (`.sec`, `min-height:100svh`, flex-centered,
`padding:clamp(24px,5vw,72px)`), grounds merged by the §1.4 seam system. The browser owns scrolling.
Each section (except Hero) carries `data-section-label` driving the indicator, and its own `↓` cue.

Section headers anchor at one spot: `.sec-head{position:absolute; top:clamp(44px,7vh,64px);
left:clamp(24px,5vw,72px)}` (titles get `padding-top:.3em` to match the demo title's baseline).
A `↓` cue (`.next-cue`/`.arrow-btn`, SVG `34×54`, ochre, floats 7px on a 2.6s loop, z-26) sits
`bottom:34px` centre and belongs to its section (up only while that section holds the viewport
middle); clicking it `scrollIntoView({block:'start'})` to the next section.

### §1 Hero — white

- `.hero-name` = "Monish Kamwal", `.display` uppercase `clamp(52px,12vw,140px)`, centered, the depth
  text-shadow. `heroReveal` on load (opacity + `translateY(16px)`, 1s expo, delay .1s).
- `.hero-sub` = "MLOps Project & Portfolio", `clamp(12px,1.5vw,15px)`, `letter-spacing:.34em`,
  uppercase, muted (delay .32s).
- `.hero-arrow-wrap` ↓ cue, fades in at .45s then floats. **No hamburger, no indicator on Hero.**
- Ground `#ffffff`, `--seam-bottom:var(--seam-12)`.

### §2 Live demo — the `--well` ground (foreshadows Data mode)

- `.demo-title` "Draw Something" (absolute, Bodoni opsz 72, 500, `clamp(30px,5vw,54px)`). Indicator
  "Live demo".
- **One wide lifted instrument** (`.instrument`: `max-width:min(92vw,980px)`, `#fff`,
  `border:1px solid #e4e8ef`, `border-radius:13px`, the Data lift shadow, `padding:clamp(20px,3vw,30px)`,
  flex row with a 1px `.instr-split` divider). Two columns:
  - **Canvas column** (`.canvas-col`, `width:min(42vw,470px)`): a borderless `.canvas-card` SVG pad
    (`viewBox 0 0 120 90`, ink stroke 1.6, `cursor:crosshair`) + `.canvas-tools` pill buttons
    **Clear / Undo** (`.tool-btn`: `border:1px solid var(--border)`, `border-radius:20px`,
    `padding:5px 18px`, 13.5px).
    - **Idle self-demo:** when idle, the pad draws one of 6 real-class doodles (cat, house, star,
      fish, umbrella, clock) via `stroke-dasharray` draw-in on a 5.2s loop (`body.pad-idle`), rotating
      one per loop. Any pointer activity wakes it (`padWake`); 15s of quiet fades the visitor's ink
      and resumes the demo. Real pointer drawing appends `<polyline>` strokes (ink `#0a0a0a`); a tap
      leaves a dot.
  - **Predictions column** (`.pred`): three `.bar-row` (label + `.pct` tabular% + `.bar-track` 8px
    `#e7ebf1` + `.bar-fill` ochre, soft ochre for #2/#3). Fills are a **clocked payoff**: they play
    `scaleX(0)→var(--w)` over `1.9×--dur` once §2 is ~55% on screen (`body.bars-live`), staggered
    `.12/.24×--dur`. Then `.prompt` "It knows 15 doodles — <class list>." (list hidden on phone),
    `.feedback` ("Did I get it?" + Yes/No `.fb-btn` pills, top-ruled), `.doorway` (`every guess is
    scored` micro + "See how the model performs →" `.link` 18–21px → Data/Quality), `.privacy`
    ("Anonymous — your drawing + verdict may help train the model.", 11.5px).
- `.demo-arrow-wrap` ↓ cue (becomes the last stacked item on phone).
- Ground `--well`, seams `--seam-12`/`--seam-23`. Reveal order: canvas (`data-stagger=1`), then
  predictions (`data-stagger=2`).
- **Real site:** the pad sends raw QuickDraw strokes to the Lambda (`lib/predict.ts`), renders live
  top-3, warm-up ping + cold-start state, feedback with 👍/👎 + class-picker — all per `content/home.json`.

### §3 Behind the Scenes — `--wash-sage`

- `.sec-head`: "Behind the Scenes" (`.scene-title display`, uppercase) + lead "From strokes to
  prediction" (`.scene-lead`, muted, `clamp(16px,2vw,20px)`). `padding-top:clamp(84px,10vh,120px)`.
- **Auto-cycling isometric architecture deck** (`.arch-stage`, `aspect-ratio:1440/816`,
  `container-type:inline-size`, `--u` = 1 board px): the inner Architecture page's **four pulled-apart
  isometric planes** drawn as stacked sheets (SVG), visiting one plane at a time with a smooth tween
  (its own camera on a timer). Planes: **Serving** (`#dee5f4`), **Monitoring** (`#d8ecde`), **CI/CD**
  (`#f8dfc4`), **Ephemeral K8s** (`#fbd3dc`, dashed/ghost). Each plane holds labeled part-cubes; wires
  (ink, or ochre for the "new model ships" loop-closing wire) connect parts between the lit planes.
  - Camera: hold `1500ms` then tween `950ms` (cubic in-out) to the next plane; `renderArch(p)` scales
    the focused plane to `1.1×` and raises its opacity `0.28→1`. A `.cy-cap` on the right cross-fades
    the caption per plane: `.cy-k` deep-ochre kicker, `.cy-n` Bodoni opsz 48 name, `.cy-s` sentence,
    `.cy-dots` (4 progress dots, active = deep ochre `scale(1.25)`), and the "Explore the full
    architecture →" `.link.cta-strong`. `.cy-arrow.prev/.next` chevrons step the deck.
  - Captions (A_CAP): Plane 1 · always on — Serving; Plane 2 · every week — Monitoring; Plane 3 ·
    every merge — CI/CD; Plane 4 · ~30 min a month — Ephemeral K8s.
  - Only runs while §3 is in view; off (static first plane) under reduced motion. Portrait (≤700px):
    stage goes `390/760`, caption below the drawing, arrows flanking.

### §4 The Journey — `--wash-ochre`

- `.sec-head`: "The Journey" + lead "Roads not taken". `padding-top:clamp(84px,10vh,120px)`.
- A **winding serpentine SVG path** (`viewBox 0 0 700 420`, ink 1.4) through 4 nodes with vertical
  bezier handles (`m=(b.y-a.y)*.5`): node coords (wide) `(350,24)L · (450,139)R · (250,254)L ·
  (450,369)R`. Three latest entries (`.j-entry`, `width:min(240px,34%)`) hang **alternating
  left/right** off their dot (same side as the dot), each: `.d` date·phase (10px uppercase), `h4`
  Bodoni opsz 40 title, `p` 12.5px line. The 4th node is the **"Read the journey →"** CTA
  (`.j-cta .link.cta-strong`). Entries run oldest→newest top-to-bottom.
- **Dots** rest in ink (`.j-dot r=5.5`), warm to bright ochre on hover; the hovered entry lifts
  (magnifier, §4.5-style lens): `scale ×--hover-scale`, dot swells, title → deep ochre (`.hot`), and a
  thickened **lens** segment (clipped copy of the line, base masked under) slides to that entry's
  point. Mouse/trackpad only.
- **Ambient comet** (J1+J6): a lit dash (`.j-comet`, deep ochre 2.6) runs the fully-drawn road on a
  5.6s loop; each milestone **rings out** (`.j-ring`) as the head passes it. Independent of scroll,
  gated to the section, off under reduced motion.
- Reveal: dots + entries arrive top-to-bottom as the section comes up (line stays fully drawn).
  Phone: path straightens to a left-edge wave, entries stacked to its right.

### §5 Skills — `--wash-rose`

- `.sec-head`: "Skills" + lead "What I build with". `padding-top:0` (full-bleed composition).
- **Five competencies as overlapping multiply-blend "wash" shapes** (SVG `.wash-wide`
  `viewBox -182.5 -102.5 1825 1025`; a separate hand-built `.wash-tall` for portrait
  `max-aspect-ratio:9/10`). Each `.b-g` = a `.blob` (one `--w-*` fill, `mix-blend-mode:multiply`,
  rest `opacity:.42`) + `.b-name` (Bodoni opsz 28) + `.b-tool` lines (Outfit, muted). The five:
  - **Training models** (sage) — Python · PyTorch / scikit-learn
  - **Keeping data honest** (ochre) — DVC · Pandera
  - **Shipping it** (rose) — Docker · Terraform / AWS Lambda
  - **Watching it run** (blue) — MLflow · Grafana · Evidently
  - **Building the front** (sand) — Next.js · TypeScript
- **Four crossings** carry a shared tool written once in the overlap (ink, `.b-shared`), named in no
  shape's own list: Training∩Data = **S3**, Training∩Shipping = **ONNX**, Shipping∩Watching = **k6**,
  Shipping∩Front = **GitHub Actions**. (Positions are measured, not computed — `lens.js` verifies.)
- A sixth shape hung off "Building the front" is the **"See all skills →"** `.wash-link` (ochre text,
  SVG font-size synced to the HTML CTA's `clamp(17px,1.7vw,20px)` in screen px).
- **Shapes rest faded**; one lights on hover/tap (`.lit` / `:hover`): `blob opacity→1`,
  `.b-g scale:1.03`, name → deep ochre, tools → ink, and its shared-tool labels scale/ochre. Touch:
  tap lights, tap-elsewhere resets.
- **Living wash:** every blob's outline undulates + breathes forever (each on its own clock, sampled
  into 56 points, rebuilt as a closed Catmull-Rom spline `closedSpline`); a hovered/lit blob's clock
  eases to a stop (τ=84ms) so it holds still to read. Off under reduced motion.
- Entrance: each `.b-g` grows from its own centre (`scale 0.965→1`, driven by `applyWashes`, staggered
  1–7). Ends on the skills link; the closing button + footer live on §6.

### §6 Contact bookend — white

- `.after`: centered. `h2` "Say hello." (`.display`, `clamp(44px,10vw,110px)`). `.b-foot` = **three
  thin-line icons** (GitHub, LinkedIn, mail — each `26×26`, ink, the one hover) — the **mail icon
  copies the email** (`navigator.clipboard`, 1.6s "Copied" confirm in `.copied`, deep ochre).
  Then `.or-link` "Or learn more about me →" (→ About) and a `.note` closing line. Ground `#ffffff`,
  `--seam-top:var(--seam-56)`. Indicator "Contact". `#contact` deep-link lands here.

---

## 6. Story mode (`sections-prototype.html`)

Three pages (Architecture · Journey · Skills) + About, each `.page` (shown one at a time in the
prototype; **routes in the real site**). Each page inherits its wash via `body[data-page]`, opens
with the arrival line, carries the Story tray, and ends on a read-next foot. Shared paper card +
crop modal overlays live once at the end of `<main>`.

### 6.1 Journey (`/journey`) — ground ochre — "an SVG camera walks the road"

Source of truth: **`journey-page-svg-sketches.html`** (supersedes the static serpentine that used to
live in `sections-prototype.html`). The **whole diagram is one `viewBox` SVG** (`0 0 1000 <vbh>`,
`preserveAspectRatio="xMidYMid meet"`, so it scales to any screen), and a **scroll-driven camera**
walks a winding road past every devlog entry while a **comet dot stays locked to the active entry**.

- **Masthead** (`.masthead`, `position:absolute; top:clamp(74px,12vh,122px); left:clamp(24px,6vw,86px)`,
  z-6, `pointer-events:none`) — the intro title **scrolls away** with the page (the road never runs
  under a pinned title): `.mh-title` "The Journey" (`.display` opsz 96, uppercase) + `.mh-sub` "Roads
  not taken" + `.card-hint` "Click any entry to read the full story".
- **The stage** (`.stageScroll` > `.stage`, `position:sticky; top:0; height:100svh`, z-0, holding the
  `#jMap` SVG) with the **reading column scrolling over it** (`.flow`, `margin-top:-100svh`,
  `pointer-events:none` except the entries). (The sketch carries the shared top bar + slide-in menu
  (§4.1–4.2) and the read-next foot; add the arrival line (§4.4) on port.)

- **The road** (`buildRoad`, plan units, `vbw=1000`): a smooth serpentine through the entries' nodes
  with vertical bezier handles (`m=(b.y−a.y)*.5`), nodes alternating **L=322 / R=678**, the chain
  starting centre-top (`500, firstGateY`). Vertical rhythm: `TOP=150`, gate→first-entry `178`,
  entry→entry `212`, entry→next-gate `252`, `TAIL=250`. The line runs past the last node and **fades
  unfinished** (`.tail`, ochre-line, dashed `2 11`). **Palette departs from ink:** base road =
  `--ochre-line` (2.2); the walked stretch = `--warm` (`.roadLit`, 3.2); entry pins (`.pinDot`) are
  `--ground`-filled **ink** circles (`r=7`) that switch to a **deep-ochre** ring when active (`.pin.on`).
  **Every node & gate is snapped onto the exact path point at its measured length-fraction** — so the
  pin ring, the comet dot and the halo end up **concentric** (without the snap the ~2u sampling gap
  left the dot sitting low in the ring).

- **The camera** (`cam`/`setVB`): each flow block owns a **stop** `{x,y,frac}`; the viewBox is
  interpolated between consecutive stops by an **eased segment fraction** (`e=smooth((f−0.08)/0.84)`),
  width **log-lerped**, centre linear. Framing: `H=630` landscape (`820` on the end stop; `770`/`980`
  portrait), `W=H·AR`; the road sits left and the reading column right (`cx = stop.x + W·0.16`); **the
  stop sits dead-centre vertically** (`vbTop = stop.y − H/2`) so **at settle the dot's horizontal line
  runs between the active entry's title and its summary** (verified within ±9u of the gap midpoint for
  every entry). No zoomed-out intro — the page **lands directly in the Phase 0 camera**.

- **The comet** (`apply`, per-frame from `scrollY`, in a `requestAnimationFrame` loop): `headFrac`
  runs the road by the **same eased progress that selects the active text**, so the dot lands on a node
  exactly as that node's text centres. The lit stroke draws to the head (`strokeDashoffset`); `.jHead`
  is a deep-ochre dot (`r=4`); `.jHalo` is a ring that **blooms out of the dot** (`r 6→18`,
  `6+prox·12`) as it nears an entry and shrinks as it leaves — driven by **distance to the nearest
  node** (`RING_NEAR=0.032`), not time. Pins fade in as the head passes; the active one rings `.on`.
  Gated to in-view; off under reduced motion.

- **The reading column** (`buildFlow`, right **56%**, one screen per block, `justify-content:center`):
  - **Phase chapter card** (`.block.chapter`): `.chapPhase` "PHASE N" (uppercase, deep ochre) +
    `.chapTitle` phase name — both **Bodoni opsz 72, weight 400, at the same full size**
    (`clamp(38px,4.6vw,68px)`); no fine-print decision count.
  - **Entry** (`.block > .jEntry`, `role="button"`, `data-slug`): `.micro` date·phase eyebrow (deep
    ochre) + `.jTitle` (Bodoni opsz 48, weight 500, `clamp(30px,3.2vw,46px)`) + `.jSummary` (17px
    muted, max 40ch). **Teaser only — no evidence links on the road.**
  - A final empty `.blockEnd` (`min-height:62svh`) pulls the camera back to reveal the fading tail low
    in frame, close to the foot.
- **Hover** (`.jEntry`, `@media (hover:hover)` only): title → deep ochre + block `scale:1.02` — a
  **pure text hover that never touches the travelling dot**. `:focus-visible` outlines the entry.
- **Click / Enter / Space** opens the entry's **paper card** (§4.5), scaling from the entry's centre:
  `.card-meta` date·phase · `.card-title` · `.card-body` = the entry's full `body_md` (blank-line-split
  into `<p>`) · `.card-ev` = the evidence `.link ↗` list (new tab). Esc / ✕ / scrim close; focus
  returns to the opener.
- **Content**: `fetch("content/journey.json")` at boot — `phases[] {key,title}` + `entries[]`
  (newest-first) `{slug, date, phaseKey, title, summary, body_md, evidence[] {label,href}}`; grouped by
  phase (declared order, entries oldest-first within, empty phases dropped). A hard-coded array is the
  `file://` fallback.
- **Portrait/phone** (`≤720px` or `9/10`): the stage holds the top (`jMap top:7% height:46%`), the
  reading column runs beneath, and the camera keeps the dot **centred** (stacked layout).
- Read-next → **Skills** ("What I build with").

### 6.2 Architecture (`/architecture`) — ground sage — "pulled apart, crossings are stops"

- A **sticky isometric stage** (`.ax-stage`, `position:sticky; top:0; height:100svh`) with the four
  planes as stacked sheets; the **text scrolls over it** (`.ax-flow`, `margin-top:-100svh`,
  `pointer-events:none` except links + io rows). The scroll opens the stack, slides each sheet out to
  its text, and gives **each wire a stop of its own** (only the two sheets a wire joins stay lit on a
  wire stop). Camera is scroll-driven, never taken over (`applyArch`, lerp between consecutive
  `AX_PH` stops). Wrapped in `.stage-scroll` so the pin releases at the flow's end (clear of the foot).
- `.ax-block`s (one screen each, text at right `padding:… 62%`), in camera order (`AX_PH`): **head →
  overview → serve → w0 → mon → w1 → ci → w3 → k8s → w2 → end**. Each block: `.ax-k` kicker
  (plane kickers plain muted; **wire kickers** `.ax-k.o` deep ochre), `.ax-h` Bodoni opsz 48 heading,
  `.ax-p` body (15.5px, max 46ch, `<b>`=ink, `<code>`=mono), and for planes an `.io` list — **Sends /
  Receives** rows (`io-k` label + `io-to` target) that light their wire on hover/tap.
  - head: "Architecture" + lead "The machine behind the doodle" + card-hint "Click/Tap any part of the
    drawing to read about it".
  - end: "Every claim is published" + the footprint line + `.ax-links` "Browse the raw evidence →",
    "GitHub repo →".
- **Parts on a sheet** (`.ax-part`, cubes) open their **paper card** (per-component, shareable
  `#architecture/<part>`); hover outlines the cube in ochre. The K8s sheet is dashed (ghost) and goes
  solid on its stop (`.ax-pl.mat`).
- Wire texts (w0–w3) and the four Sends/Receives relations are authored for this page (not in the
  contract). Content from `content/architecture.json`.
- Portrait/phone (≤700px or `9/10`): stage holds the top ~53% (an `.ax-plate` gradient masks text
  under it), reading runs beneath.
- Read-next → **Journey** ("Roads not taken").

### 6.3 Skills (`/skills`) — ground rose — "into the map"

- Opens on **Home §5's exact map** (same five shapes, same positions — the way-out shape omitted) as a
  **sticky stage** (`.sk-stage`); the text scrolls over it in normal flow, **one block per stop**
  (`.sk-block`, text at right `padding:… 59%`). Scroll position between two blocks moves the **camera**
  between their map stops (`skCam`/`applySkills`); a click/tap on a shape scrolls to its stop. Never
  takes over the scroll.
- Block order (camera order) = competency, then the crossing that follows it: **head → data → s3 →
  train → onnx → ship → k6 → watch → gha → front → end**:
  - Competency blocks (`.sk-k` "N of 5", `.sk-name` Bodoni opsz 48, `.sk-line`, then `.sk-rcs` =
    per-tool **receipts**: `.sk-rc-t` tool name + `.sk-rc-d` what-it-did + `.sk-ev .link` evidence
    "… · <section> →"). Five competencies exactly as Home §5, each tool with one line + one proof link.
  - Crossing blocks (`.sk-k.shared` deep-ochre "Shared · A + B", `.sk-tool` Bodoni, one line, one
    evidence link): S3, ONNX, k6, GitHub Actions.
  - end: "Also in the toolbox" + `.sk-box` chips (FastAPI, SQL, Kubernetes, CloudWatch, pandas, NumPy,
    pytest, Bash, Git, Tailwind).
- Map labels fade by where they land on screen (`--sk-l`) × their shape's quiet level (`--sk-t`), so
  words never sit under the reading column. A shape's `.on` state matches the active stop (name → deep
  ochre; shared label `scale:1.25` deep ochre). No card hint beyond "Click/Tap a link under any tool to
  see the evidence". Content/evidence from `content/skills.json`.
- Portrait/phone: map holds the top (`top:9% height:51%`), reading beneath; `.sk-plate` gradient masks.
- Read-next → **About** ("The person behind the machine").

### 6.4 About (`/about`) — ground `--paper` `#f6efe3`

A single editorial column (`.ab-page`, `max-width:1000px`, `container-type:inline-size` so type scales
in `cqw`). A **Skills-scheme multiply wash** (`.ab-wash`, right side, morphing blobs) runs behind the
hero down to the serpentine.

- **Hero** (`.hero-in` grid: eyebrow / name / portrait / lead):
  - `.ab-eyebrow` micro "About — the person behind the machine".
  - `.ab-name` "Monish *Kamwal*" — Bodoni opsz 96, `font-size:clamp(40px,12cqw,120px)`,
    `line-height:.84`; the surname is an `<em>` block, italic, **deep ochre**, `margin-left:.3em`.
  - `.hero-photo`: a **circular portrait** (`min(290px,52vw)`, `border-radius:50%`, soft shadow) with a
    default line-silhouette and an **Instagram-style uploader** — `.pt-edit` "Add/Change photo" opens a
    **crop modal** (`.crop-modal`: round `.crop-view`, drag to move, `.crop-zoom` slider 1–3×, Cancel /
    Set photo; persisted to `localStorage` in the prototype). Below it, "Download résumé (PDF)".
  - `.ab-lead`: first paragraph has a Bodoni deep-ochre **drop cap** (`.ab-drop::first-letter`, 3.4em).
- **Education** (`.cv2`): `.cv2-h` "Education" + card-hint. Each `.cv2-item` is a 2-col grid — a huge
  deep-ochre **year/degree anchor** (`.cv2-year`, Bodoni, `clamp(40px,8cqw,86px)`) + body
  (`.cv2-range` mono date, `.cv2-role`, `.cv2-what`). Top-ruled (`1px solid var(--foreground)`).
  Opens a **paper card** on click (hover pops the year ochre + a "Read more →" cue).
- **Work** (`.work-group`): title ruled like Education, card-hint, then a **static serpentine** SVG
  (`.trace`, `aspect-ratio:700/660`): a deep-ochre path (`.tr-path` 2.2) with `.tr-node` circles; roles
  (`.tr-stop width:38%`, alternating left/right) sit at the nodes (`.tr-range` mono, `.tr-role`,
  `.tr-what`, `.tr-more`). Hover = the Home §4 magnifier on the Work path (node swells + ochre, role →
  deep ochre, lens slides along the path). Each stop opens a **paper card**.
- **Projects** (`.cv2`, same row style as Education): year anchor + body, each opening a card.
- Read-next → **Contact** (Home `#contact` bookend) — ("Where to find me").
- (The old centered "Say hello" `.ab-outro` + `.ab-email` click-to-copy + `.ab-links` grammar exists
  in CSS as the contact close.)

---

## 7. Data mode (`data-prototype-white.html`)

Three pages (Quality · Monitoring · Performance) — the narrative arc **report card → is it holding up
→ is it fast**. White ground, lifted-paper panels, cool well for narrative, the §1.5 palette. Data
tray + menu as the only nav. Wider shell than Story: `.wrap max-width:1120px`.

### 7.1 Grammar

- **Grid** `.grid12` = 12-col, `gap:18px`; panels set `grid-column:span N`. Collapses to 1-col ≤880px.
- **Panel** (`.panel`): lifted paper card (`--card`, `--card-border`, `border-radius:13px`, the lift
  shadow). `.panel.well` = sunk narrative (`--well`, no shadow). `.p-head` = `.p-title` 15px/500 +
  `.p-sub` muted + `.p-tools` (status chip and/or the `data` toggle).
- **Section head** `.sec-head` Bodoni opsz 72 `clamp(24px,3.6vw,36px)`; `.sec-cap` muted lead.
- **Provenance row** (`.prov`, under every page lead): `live data` (green `●`) · contract filename ·
  `generated/captured <date>` · cadence — all uppercase micro. (Performance uses a dashed
  `.st.mock` "mock — first capture pending" until a real capture exists.)
- **Status chips** `.st` (`.ok/.watch/.bad/.mock`) — icon + label, reserved meaning, never color
  alone. **KPI tiles** `.tile` (`.t-label` / `.t-value` `clamp(24px,3vw,30px)` / `.t-sub`) and
  `.hero-num` (`clamp(56px,7vw,84px)`, 600, with a muted `.unit`).
- **Tables** `.dtable` are the **WCAG-clean twin of every chart**: each chart panel has a `data`
  toggle (`.chip-btn`, mono 11px; active = ochre) that swaps `.chart` for `.tview` (`.panel.show-table`).
  Champion row tinted (`.row-champ`); alias chips (`.alias-chip` champion/challenger/blocked).
- **Charts** = inline SVG (`.chart svg`, Outfit labels, `.ax` axes, `.dlab` data labels, `.lg`
  legend with line/dot/rect swatches, `.cap` caption). Hover shows a shared **tooltip** (`.viz-tip`,
  fixed, value-leads-label, line-keys not boxes) + a recessive **hover mark** (`.hov`: crosshair /
  band / ring, grid-colored, on `--hover-dur`). `.meter-row` for status/ratio bars.
- **Verdict banner** (`.banner`, in the well, left border `is-ok`/`is-bad`) — the one place a page
  leads with status. **Page foot** (`.page-foot`, top-ruled) = one line + contract/hub links.
- Tables scroll inside `.tscroll`; "tooltips enhance, tables guarantee".

### 7.2 Quality (`/quality`) — "The model's report card — regenerated on every deploy"

Provenance: `live data · evidence.json · generated <date> · every model deploy`. Panels:
- **Test accuracy** (span 4): `.hero-num %` champion test accuracy + tiles macro-F1 / champion version
  + since.
- **The quality gate** (span 8): `.st.ok` gate chip; a line chart of challenger-vs-champion over runs;
  caption with floor (`≥ 0.85`) and ε band; a **blocked** `.st.bad` row — "the gate saying no, on the
  record … the blocked CI run ↗" (real `actions/runs/...` link).
- **Per-class F1** (span 5): bar chart (15 classes), `data` toggle, caption "Dogs are hard…".
- **Where it gets confused** (span 7): confusion-matrix heatmap (`.st.mock` "illustrative"), "true
  class ↓ → predicted class".
- **Every registered run** (span 12): the runs table (registry is source of truth).
- Foot links: evidence.json ↗ · the raw evidence hub ↗. Read-next → **Performance**.

### 7.3 Monitoring (`/monitoring`) — "Is it holding up against real visitors?"

Provenance: `live data · drift.json + feedback.json · generated <date> · weekly`. Panels:
- **Verdict banner** `is-bad` (span 12): the drift verdict + "this window: <range>" + the
  "every signal has drifted … confidence slid from X to Y … the instrument catching the world moving"
  paragraph.
- **Prediction confidence** (span 6) + **Decision margin** (span 6): overlaid reference-vs-current
  histograms, each a `.st.bad` chip + `data` toggle + legend.
- **What people actually draw** (span 7): categorical dumbbell (reference vs current class mix, sorted
  by shift), `.st.bad` chip.
- **Trends column** (span 5): **Confidence over time** (weekly line, "the gap is the story") +
  **Columns drifted** (per-run dot strip, red = drift detected).
- **Visitors as evaluators** (span 5): proxy-accuracy `.hero-num %` + tiles votes / last-window;
  caption "quiet weeks (n = 0) are normal".
- **Verdicts by predicted class** (span 7): table.
- Foot links: drift.json ↗ · feedback.json ↗ · Evidently's own report ↗. Read-next → **Architecture**.

### 7.4 Performance (`/performance`) — "A snapshot from the last EKS dress rehearsal"

Provenance: `mock — first capture pending · api-metrics.json · captured <date> · monthly load test`
(flip the mock chip to `live data`/`captured data` once a real `api-metrics.json` exists). Panels:
- **Narrative well** (span 12): "Once a month … load-tests the same container image … tears everything
  down …" + "how the rehearsal works →" (→ `#architecture/destroy`).
- **KPI tiles** (span 12): headline p-values / RPS / etc. from the contract.
- **Latency under load** (span 12): p50→p99 multi-line over the run.
- **Throughput** (span 7): RPS line (k6 ramp → plateau → ramp-down).
- **Every response, accounted for** (span 5): status-code meter ledger + caption (empty 5xx = clean).
- **Node CPU** (span 6) + **Node memory** (span 6): cluster-average line charts.
- Foot link: api-metrics.json ↗. Read-next → **Monitoring**.

Data pages consume the live contracts client-side (`evidence/drift/feedback/api-metrics.json`); the
framing prose is in `content/data/*.json`. Charts are hand-rolled inline SVG per this grammar.

---

## 8. Information architecture & wayfinding

- **Home** (hero scroll) funnels every visitor through the Demo. Teasers are doorways into **Story
  mode**; the Demo's "See how the model performs →" is the doorway into **Data mode**.
- **Two internal modes, each with its own isolated bottom tray; the menu is the only bridge:**
  - **Story mode** — Architecture · Journey · Skills (warm washes: sage / ochre / rose, inherited from
    the Home teaser that points to each).
  - **Data mode** — Quality · Performance · Monitoring (white + lifted paper; mode identity rides the
    chrome, not a ground tint; adds the status palette for charts only).
- **About** is standalone, **off both trays**, on warm paper; reached from the Contact bookend
  ("Or learn more about me →") and the menu.
- **Contact** is the Home bookend (`#contact`), not a standalone page.
- **Color encodes the mode**, not the page: one warm wash per Story page; one cool instrument system
  across Data; ochre is the sole interactive accent everywhere.
- **Deep-link/URL grammar** (prototype hashes → real routes): `#journey/<entry>`,
  `#architecture/<part>` open a page with that paper card open and shareable.

---

## 9. Content & data sources

- **Copy** (titles, leads, body, labels) → `content/*.json` via `lib/content.ts`. Prototype strings
  are placeholders.
- **Live numbers** (Data mode) → mlops evidence hub JSON contracts, fetched in the browser:
  `evidence.json` (Quality), `drift.json` + `feedback.json` (Monitoring), `api-metrics.json`
  (Performance). Tables are the accessible twin of every chart.
- **Assets** → `public/portrait.jpg`, `public/resume.pdf`.

---

## 10. Implementation notes (prototype → real site)

- The prototypes are **one file each with an in-file page switcher**; the real site is **routes**
  (`app/(story)/…`, `app/(data)/…`, `/about`, `/`). The "arrival line" is the inter-page transition
  device; the trays and menu become real navigation.
- **Static export, GitHub Pages, modified Next.js** — all dynamic behavior is client-side; read the
  bundled Next docs (`node_modules/next/dist/docs/`) before using an API.
- **Build structure-first, motion second** (reduced-motion honored throughout); charts are hand-rolled
  inline SVG.
- Prototype-only scaffolding to drop or replace: the About photo uploader's `localStorage`, the idle
  self-demo's hard-coded doodles (real demo draws from the live model), placeholder copy and `#`
  evidence hrefs (real URLs live in `content/*.json`).
- **Pixel/geometry authority:** for exact SVG path data (journey serpentine, isometric sheets, wash
  blobs, work serpentine), camera math (Journey `buildRoad`/`cam`/`setVB`/`apply`; Architecture
  `renderArch`/`applyArch`; Skills `skCam`), and chart rendering, the prototype files are the literal
  reference — port them. The Journey road's node/gate **path-snap** (`getPointAtLength` at each
  measured fraction) is load-bearing: it is what keeps the comet dot concentric with the entry rings.
```
