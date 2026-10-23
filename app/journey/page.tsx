import type { Metadata } from "next";
import { StoryShell } from "@/components/story/StoryShell";
import { JourneyPage } from "@/components/story/journey/JourneyPage";
import { journey } from "@/lib/content";

export const metadata: Metadata = {
  title: journey.title,
  description: journey.lede,
};

// The Journey inner page (Story mode): the all-SVG scroll-camera road through
// the devlog — a winding serpentine the camera walks past every entry while a
// comet dot stays locked to the active one, each entry opening its full story
// in a paper card. See DESIGN.md §6.1.
export default function Journey() {
  return (
    <StoryShell page="journey">
      <JourneyPage />
    </StoryShell>
  );
}
