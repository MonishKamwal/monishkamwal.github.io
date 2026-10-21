import type { Metadata } from "next";
import { StoryShell } from "@/components/story/StoryShell";
import { ArchitecturePage } from "@/components/story/architecture/ArchitecturePage";
import { architecture } from "@/lib/content";

export const metadata: Metadata = {
  title: architecture.title,
  description: architecture.lead,
};

// The Architecture inner page (Story mode): a sticky isometric diagram of the
// four planes, pulled apart as the text scrolls, with every component cube
// opening its detail card. See DESIGN.md §6.
export default function Architecture() {
  return (
    <StoryShell page="architecture">
      <ArchitecturePage />
    </StoryShell>
  );
}
