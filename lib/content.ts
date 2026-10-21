// Typed accessors for the hand-authored site copy in /content.
// JSON is imported at build time (static export), so this is zero-runtime.
// Schemas match the three finalized prototypes (see DESIGN.md). Fields ending
// in `_md` hold Markdown; `_note` keys are maintainer notes, never shown.

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
/** A paper-card body: labeled sections + evidence links. */
export type CardItem = { heading: string; body: string };
export type Card = {
  meta: string;
  title: string;
  items: CardItem[];
  evidence: Link[];
};

/* ---------- site ---------- */

export type NavGroup = { label: string; note?: string; items: Link[] };
export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  nav: { menuLabel: string; homeLabel: string; groups: NavGroup[] };
  trays: { story: Link[]; data: Link[] };
  contact: { email: string; github: string; linkedin: string; copiedLabel: string };
  links: { evidenceHub: string; repo: string; siteRepo: string };
};

/* ---------- home ---------- */

export type ArchDeckPlane = { kicker: string; name: string; sentence: string };
export type HomeContent = {
  hero: { name: string; tagline: string; scrollCueLabel: string };
  demo: {
    sectionIndicator: string;
    title: string;
    prompt: string;
    promptClasses: string[];
    controls: { clear: string; undo: string };
    predictions: { emptyHint: string };
    feedback: {
      question: string;
      yes: string;
      no: string;
      noFollowUp: string;
      thanks: string;
    };
    doorwayNote: string;
    cta: Cta;
    privacyNote: string;
    states: { warmingUp: string; thinking: string; unreachable: string };
  };
  teasers: {
    architecture: {
      sectionIndicator: string;
      title: string;
      lede: string;
      archDeck: ArchDeckPlane[];
      cta: Cta;
    };
    journey: {
      sectionIndicator: string;
      title: string;
      lede: string;
      featuredSlugs: string[];
      cta: Cta;
    };
    skills: { sectionIndicator: string; title: string; lede: string; cta: Cta };
  };
  bookend: {
    sectionIndicator: string;
    title: string;
    copiedLabel: string;
    aboutLink: Cta;
    note: string;
  };
};

/* ---------- architecture ---------- */

export type ArchIo = { dir: "Sends" | "Receives"; text: string; target: string; wire: string };
export type ArchBlock = {
  id: string;
  kind: "overview" | "plane" | "wire" | "end";
  kicker: string;
  kickerTone?: "ochre";
  heading?: string;
  body: string[];
  io?: ArchIo[];
  links?: Link[];
};
export type ArchPart = { id: string; meta: string; title: string; items: CardItem[]; evidence: Link[] };
export type ArchitectureContent = {
  sectionIndicator: string;
  title: string;
  lead: string;
  cardHint: string;
  blocks: ArchBlock[];
  parts: ArchPart[];
};

/* ---------- journey ---------- */

export type JourneyPhase = { key: string; title: string };
export type JourneyEntry = {
  slug: string;
  date: string;
  phaseKey: string;
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
  cardHint: string;
  tail: string;
  phases: JourneyPhase[];
  entries: JourneyEntry[];
};

/* ---------- skills ---------- */

export type SkillTool = { name: string; did: string; evidence: Link };
export type Competency = {
  id: string;
  index: string;
  name: string;
  line: string;
  tools: SkillTool[];
};
export type Crossing = {
  id: string;
  name: string;
  between: [string, string];
  sharedLabel: string;
  line: string;
  evidence: Link;
};
export type SkillsContent = {
  sectionIndicator: string;
  title: string;
  lede: string;
  cardHint: string;
  stops: string[];
  competencies: Competency[];
  crossings: Crossing[];
  toolbox: { label: string; items: string[] };
};

/* ---------- about ---------- */

export type AboutEntry = {
  id: string;
  range: string;
  role: string;
  what: string;
  anchor?: string; // Education / Projects row anchor (big year/degree)
  side?: "left" | "right"; // Work serpentine stop side
  card: Card;
};
export type AboutSection = { title: string; cardHint: string; entries: AboutEntry[] };
export type AboutContent = {
  sectionIndicator: string;
  hero: {
    eyebrow: string;
    nameFirst: string;
    nameLast: string;
    lead: string[];
    portrait: { src: string; alt: string };
    resume: Link;
  };
  education: AboutSection;
  work: AboutSection;
  projects: AboutSection;
};

/* ---------- data pages ---------- */

export type DataProvenance = {
  liveLabel: string;
  mock?: boolean;
  contract: string;
  generatedVerb: string;
  cadence: string;
};
export type DataPanel = {
  id: string;
  span: number;
  kind: string; // hero | line | bar | heatmap | table | banner | histogram | dumbbell | dotstrip | tiles | ledger | well
  title?: string;
  sub?: string;
  caption?: string;
  status?: string;
  statusLabel?: string;
  hasTable?: boolean;
  body_md?: string;
  windowLabel?: string;
  tiles?: { label: string }[];
  blocked?: { label: string; text: string; link: Link };
  link?: Link;
};
export type DataPageContent = {
  sectionIndicator: string;
  mode: "data";
  title: string;
  subtitle: string;
  provenance: DataProvenance;
  panels: DataPanel[];
  footer: string;
  links: Link[];
  readNext: { name: string; peek: string; href: string };
};

/* ---------- typed exports ---------- */

export const site = siteJson as unknown as SiteContent;
export const home = homeJson as unknown as HomeContent;
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
