import type { Metadata } from "next";
import { StoryShell } from "@/components/story/StoryShell";
import { AboutPage } from "@/components/story/about/AboutPage";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: about.hero.lead[0],
};

// The About inner page (Story mode): an editorial hero over the Skills wash, the
// work history as a serpentine, and Education/Projects rows — each opening a
// detail card. See DESIGN.md §6.
export default function About() {
  return (
    <StoryShell page="about">
      <AboutPage />
    </StoryShell>
  );
}
