export type JourneyEntry = {
  slug: string;
  title: string;
  date: string;
  phase: string;
  summary: string;
  published: boolean;
};

export const journeyEntries: JourneyEntry[] = [
  {
    slug: "planning-the-platform",
    title: "001 · Planning the platform",
    date: "2026-07-02",
    phase: "Phase 0",
    summary:
      "Two repos, one QuickDraw model, a $200 budget — and why the inference API is a Lambda, not a Hugging Face Space.",
    published: true,
  },
  {
    slug: "walking-skeleton",
    title: "002 · The walking skeleton",
    date: "TBD",
    phase: "Phase 1",
    summary:
      "Data → train → serve → this very canvas, with a real model behind it.",
    published: false,
  },
  {
    slug: "automation-and-gates",
    title: "003 · Automation & quality gates",
    date: "TBD",
    phase: "Phase 2",
    summary: "DVC, CI/CD, and teaching the pipeline to say no to a bad model.",
    published: false,
  },
  {
    slug: "ephemeral-kubernetes",
    title: "004 · A cluster that deletes itself",
    date: "TBD",
    phase: "Phase 3",
    summary: "Weekly EKS spin-up, load test, evidence capture, teardown.",
    published: false,
  },
];
