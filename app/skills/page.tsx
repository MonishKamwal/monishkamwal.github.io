import type { Metadata } from "next";
import { StoryShell } from "@/components/story/StoryShell";
import { SkillsPage } from "@/components/story/skills/SkillsPage";
import { skills } from "@/lib/content";

export const metadata: Metadata = {
  title: skills.title,
  description: skills.lede,
};

// The Skills inner page (Story mode): the five competencies and the tools they
// share, laid over Home §5's map — a sticky stage the text scrolls into, one
// stop per competency and per crossing. See DESIGN.md §6.
export default function Skills() {
  return (
    <StoryShell page="skills">
      <SkillsPage />
    </StoryShell>
  );
}
