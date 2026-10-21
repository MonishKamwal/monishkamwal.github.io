import { architecture, journey, skills } from "@/lib/content";

// The Story reading order and the "read next" chain (Architecture → Journey →
// Skills → About), matching the prototype's docking ribbons. Each target's peek
// is its own page lead, so the ribbon previews where it goes from one source.
export type StoryPageKey = "architecture" | "journey" | "skills" | "about";

export type ReadNext = { key: StoryPageKey; name: string; href: string; peek: string };

const PAGE: Record<StoryPageKey, { name: string; href: string; peek: string }> = {
  architecture: {
    name: "Architecture",
    href: "/architecture",
    peek: architecture.lead,
  },
  journey: { name: "Journey", href: "/journey", peek: journey.lede },
  skills: { name: "Skills", href: "/skills", peek: skills.lede },
  about: {
    name: "About",
    href: "/about",
    peek: "Who built this, and how I got here",
  },
};

const NEXT: Record<StoryPageKey, StoryPageKey | null> = {
  architecture: "journey",
  journey: "skills",
  skills: "about",
  about: null,
};

/** The next Story page to read after `page`, or null at the end of the chain. */
export function readNextFor(page: StoryPageKey): ReadNext | null {
  const next = NEXT[page];
  return next ? { key: next, ...PAGE[next] } : null;
}
