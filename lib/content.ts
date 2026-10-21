// Typed accessors for the hand-authored site copy in /content.
// JSON is imported at build time (static export), so this is zero-runtime —
// the types just give components a safe, documented shape to render.
//
// Convention (see content/README.md): fields ending in `_md` hold Markdown;
// everything else is plain text. `_note` keys are maintainer notes, never shown.

import siteJson from "@/content/site.json";
import homeJson from "@/content/home.json";
import architectureJson from "@/content/architecture.json";
import journeyJson from "@/content/journey.json";
import skillsJson from "@/content/skills.json";
import aboutJson from "@/content/about.json";
import qualityJson from "@/content/data/quality.json";
import monitoringJson from "@/content/data/monitoring.json";
import performanceJson from "@/content/data/performance.json";

/* ---------- shared ---------- */

export type Link = { label: string; href: string };
export type Cta = Link;

/* ---------- site ---------- */

export type NavGroup = {
  label: string;
  note?: string;
  items: Link[];
};

export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  nav: { menuLabel: string; homeLabel: string; groups: NavGroup[] };
  trays: { story: Link[]; data: Link[] };
  contact: {
    email: string;
    github: string;
    linkedin: string;
    copiedLabel: string;
  };
  links: { evidenceHub: string; repo: string; siteRepo: string };
};

/* ---------- home ---------- */

export type HomeTeaser = {
  id: string;
  sectionIndicator: string;
  title: string;
  lede: string;
  body: string;
  cta: Cta;
  featuredSlugs?: string[];
};

export type HomeContent = {
  hero: { name: string; tagline: string; scrollCueLabel: string };
  demo: {
    sectionIndicator: string;
    title: string;
    lede: string;
    prompt: string;
    promptFallbackClasses: string[];
    controls: { clear: string; undo: string };
    predictions: { heading: string; emptyHint: string };
    feedback: {
      question: string;
      yes: string;
      no: string;
      noFollowUp: string;
      note: string;
      thanks: string;
    };
    privacyNote: string;
    cta: Cta;
    states: { warmingUp: string; thinking: string; unreachable: string };
  };
  teasers: HomeTeaser[];
  bookend: {
    sectionIndicator: string;
    title: string;
    lede: string;
    aboutLink: Cta;
    mailtoLabel: string;
  };
};

/* ---------- architecture ---------- */

export type ArchStop = {
  id: string;
  kind: "plane" | "wire";
  label: string;
  title: string;
  body_md: string;
};

export type ArchComponent = {
  id: string;
  meta: string;
  title: string;
  format: string;
  items: { heading: string; body: string }[];
  evidence: Link[];
};

export type ArchitectureContent = {
  sectionIndicator: string;
  title: string;
  lede: string;
  intro: string;
  overview: { label: string; title: string; body_md: string };
  stops: ArchStop[];
  closing: { title: string; body_md: string; links: Link[] };
  components: ArchComponent[];
};

/* ---------- journey ---------- */

export type JourneyEntry = {
  slug: string;
  date: string;
  phase: string;
  title: string;
  summary: string;
  body_md: string;
  evidence: Link[];
};

export type JourneyContent = {
  sectionIndicator: string;
  title: string;
  lede: string;
  intro: string;
  entries: JourneyEntry[];
};

/* ---------- skills ---------- */

export type SkillTool = { name: string; did: string; evidence: Link };
export type Competency = {
  id: string;
  name: string;
  line: string;
  tools: SkillTool[];
};
export type Crossing = {
  id: string;
  name: string;
  between: string[];
  line: string;
  evidence: Link;
};

export type SkillsContent = {
  sectionIndicator: string;
  title: string;
  lede: string;
  intro: string;
  competencies: Competency[];
  crossings: Crossing[];
  toolbox: { label: string; note: string; items: string[] };
};

/* ---------- about ---------- */

export type CvEntry = {
  dateRange: string;
  role: string;
  place: string;
  line: string;
  details?: string[];
};

export type AboutContent = {
  sectionIndicator: string;
  title: string;
  lede: string;
  bio: { portrait: { src: string; alt: string }; body_md: string };
  cv: {
    work: { title: string; intro: string; entries: CvEntry[] };
    education: { title: string; intro: string; entries: CvEntry[] };
  };
  resume: { label: string; href: string };
  contact: {
    lede: string;
    email: string;
    emailCopiedLabel: string;
    github: string;
    linkedin: string;
  };
};

/* ---------- data pages ---------- */

export type DataSource = {
  liveLabel: string;
  contract: string;
  cadenceVerb: string;
  cadence: string;
  contractHref: string;
  capturedAtField?: string;
};

export type DataSection = {
  id: string;
  title: string;
  body: string;
  caption?: string;
  contractKeys?: string[];
  seriesLabels?: Record<string, string>;
  windowLabel?: string;
  signals?: { key: string; label: string; plain: string }[];
  note?: string;
  callout?: {
    status: string;
    label: string;
    text: string;
    link?: Link;
  };
  emptyState?: { label: string; text: string };
};

export type DataPageContent = {
  sectionIndicator: string;
  mode: "data";
  title: string;
  subtitle: string;
  source: DataSource;
  intro?: string;
  intro_md?: string;
  crossLink?: Link;
  sections: DataSection[];
  footer: string;
  links: Link[];
};

/* ---------- typed exports ---------- */

export const site = siteJson as SiteContent;
export const home = homeJson as HomeContent;
export const architecture = architectureJson as unknown as ArchitectureContent;
export const journey = journeyJson as unknown as JourneyContent;
export const skills = skillsJson as unknown as SkillsContent;
export const about = aboutJson as unknown as AboutContent;
export const quality = qualityJson as unknown as DataPageContent;
export const monitoring = monitoringJson as unknown as DataPageContent;
export const performance = performanceJson as unknown as DataPageContent;

// Journey entries read oldest→newest on the page (stored newest-first).
export const journeyOldestFirst: JourneyEntry[] = [...journey.entries].reverse();

export function journeyEntry(slug: string): JourneyEntry | undefined {
  return journey.entries.find((e) => e.slug === slug);
}
