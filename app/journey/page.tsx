import type { Metadata } from "next";
import { StoryShell } from "@/components/story/StoryShell";
import { JourneyPage } from "@/components/story/journey/JourneyPage";
import { journey } from "@/lib/content";

export const metadata: Metadata = {
  title: journey.title,
  description: journey.intro,
};

// The Journey inner page (Story mode). A thin server shell around the shared
// StoryShell chrome and the client-driven JourneyPage. See DESIGN.md §6.
export default function Journey() {
  return (
    <StoryShell page="journey">
      <JourneyPage />
    </StoryShell>
  );
}
