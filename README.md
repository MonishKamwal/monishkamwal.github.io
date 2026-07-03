# monishkamwal.github.io

Personal portfolio and the public frontend of my [end-to-end MLOps platform](https://github.com/MonishKamwal/mlops).
The home page hosts a live sketch-recognition demo whose predictions come from the platform's
deployed model (mocked until Phase 1 ships the inference API).

**Live site:** https://monishkamwal.github.io

## Stack

- Next.js (App Router, `output: 'export'` — fully static)
- Tailwind CSS v4 + `@tailwindcss/typography`
- MDX for Journey (devlog) entries
- Deployed to GitHub Pages by GitHub Actions on every push to `main`

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
npm run lint
```

## Structure

- `app/` — routes (home/demo, journey, projects, about, resume)
- `components/` — Nav, Footer, SketchDemo (canvas + predictions)
- `lib/predict.ts` — inference API contract; `API_URL` is empty until Phase 1
- `app/journey/(entries)/*/page.mdx` — devlog entries

The frontend plan is in [`PORTFOLIO_PLAN.md`](./PORTFOLIO_PLAN.md); the overall
project plan is in the platform repo's [`PLAN.md`](https://github.com/MonishKamwal/mlops/blob/main/PLAN.md).
