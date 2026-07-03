# Portfolio Site — Frontend Plan

Companion to `PLAN.md` in the `mlops` repo. This site is the public face of the MLOps platform
**and** a full personal portfolio. The home page *is* the live demo.

## Stack

- **Next.js 15 (App Router) with `output: 'export'`** — static HTML export; GitHub Pages cannot
  run a server. Constraints accepted: no server actions/API routes/ISR, `images.unoptimized: true`.
  All dynamic behavior is client-side JS calling the Lambda Function URL directly (CORS handles it).
- **Tailwind CSS** for styling; **MDX** for Journey entries and write-ups (content lives in the
  repo, renders at build time).
- **Deployment: GitHub Actions → `actions/deploy-pages`** on push to `main`.
  ⚠️ One-time setting via GitHub UI: repo → *Settings → Pages → Build and deployment →
  Source: GitHub Actions* (currently "Deploy from a branch"). No custom domain for now
  (the old CNAME was already removed).
- CI on PR: build + typecheck + link check (dead evidence links fail the build).

## Information architecture

```
/            Home — hero + live canvas demo (the hook), then project summary + links
/journey     Devlog: the creation process — decisions, trade-offs, wrong turns, rationale
             (MDX entries, roughly one per PLAN.md phase/milestone; the "insider view")
/projects    Project cards; MLOps platform is the flagship
/projects/mlops-platform
             Architecture deep-dive: clickable diagram, per-component write-ups,
             links into evidence hub + GitHub
/about       Bio, skills
/resume      HTML + downloadable PDF
```

The **evidence hub is NOT in this repo** — it's the `mlops` repo's own GitHub Pages at
`monishkamwal.github.io/mlops/` (MLflow exports, Evidently drift reports, k6 results, CI runs).
This site links and selectively iframes it. Keeps this repo's history clean and needs no
cross-repo tokens.

## The canvas demo (home page centerpiece)

- Draw area (pointer + touch), Clear / Undo, predict-on-pause (debounced ~400 ms) so guesses
  appear *while* drawing — this is the delight moment.
- Sends **raw strokes + 280×280 PNG** to the API; all preprocessing is server-side (one code
  path with training — see mlops PLAN.md §2).
- Top-3 predictions as animated confidence bars; prompt suggests what to draw ("try: cat,
  bicycle, umbrella…" from the live class list via `/model-info`).
- **Cold-start UX:** fire a warm-up ping on page load; if predict is slow, show a friendly
  "model is waking up (it scales to zero — that's the point 😉)" state.
- **Feedback buttons** ("did I get it? 👍/👎") — logged with the prediction; feeds the Phase 4
  proxy-accuracy chart. Include a one-line privacy note (anonymous drawings, used to monitor
  the model).
- Graceful degradation: if the API is unreachable, show a recorded GIF of the demo + status note.

## Journey section (the differentiator)

Each MDX entry: context → options considered → decision + rationale → what went wrong →
evidence links (commits, CI runs, cost screenshots). Written *during* the build, not after —
source material is the decisions table and phase DoDs in the mlops PLAN.md. Target one entry
per phase minimum; frontmatter (date, phase, tags) drives an index/timeline page.

## Work, aligned to mlops phases

| mlops phase | Site work | Done when |
|---|---|---|
| 0 | Scaffold Next.js + Tailwind + MDX, Pages workflow, nav shell, placeholder pages | Site live on Pages from `main` via Actions |
| 1 | Canvas demo on home (strokes → API → confidence bars), cold-start UX | Stranger can draw + get live prediction on the public site |
| 2 | Evidence links wired (badges, MLflow export, eval report), first two Journey entries, project page skeleton | Evidence reachable from home in ≤ 2 clicks |
| 3 | Architecture diagram (interactive SVG/Mermaid, nodes link to write-ups + journey), EKS-run evidence surfaced | Diagram clickable; latest weekly run evidence linked |
| 4 | Feedback buttons, drift dashboard link, remaining Journey entries, about/resume, polish pass (lighthouse, mobile, OG tags) | No dead links; Lighthouse ≥ 90; full narrative navigable |

## Risks / notes

- Static export quirks (trailing slashes, basePath) — none needed for a user-site repo
  (`monishkamwal.github.io` serves at domain root); test export locally with `npx serve out`.
- Don't iframe pages that set `X-Frame-Options` — GitHub Pages content is fine, external
  services are not; prefer links + screenshots for anything third-party.
- Keep the Function URL in a single config constant; it changes only if infra is rebuilt.
