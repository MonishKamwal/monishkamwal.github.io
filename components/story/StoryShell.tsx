"use client";

import { useRef } from "react";
import { TopBar } from "./TopBar";
import { Menu } from "./Menu";
import { EdgeBlur } from "./EdgeBlur";
import { ArrivalLine } from "./ArrivalLine";
import { PaperCardProvider } from "./PaperCard";
import { useMenu } from "@/lib/hooks/useMenu";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrubbedReveals } from "@/lib/hooks/useScrubbedReveals";
import type { StoryPageKey } from "@/lib/story/storyNav";

// Each Story page inherits its Home section's wash as the page ground (the
// wayfinding rule); the slide-in menu reuses --ground so the drawer matches.
const GROUND: Record<StoryPageKey, string> = {
  architecture: "var(--wash-sage)",
  journey: "var(--wash-ochre)",
  skills: "var(--wash-rose)",
  about: "var(--paper)",
};

// The shared layout wrapper for every inner page: fixed chrome (top bar, menu,
// edge blur, arrival line), the shared paper-card overlay, and a scrubbed-reveal
// loop over the page's `.reveal` elements. Page content is passed as children.
export function StoryShell({
  page,
  children,
}: {
  page: StoryPageKey;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { open, openMenu, close } = useMenu();
  useScrubbedReveals(rootRef, reduced);

  return (
    <div
      ref={rootRef}
      className="story-root"
      data-page={page}
      // --ground tints the page + menu; --wash is what the global edge-blur
      // dissolves toward (Home names it --wash per section) — keep them in sync.
      style={{ "--ground": GROUND[page], "--wash": GROUND[page] } as React.CSSProperties}
    >
      <TopBar menuOpen={open} onOpenMenu={openMenu} />
      <Menu open={open} onClose={close} />
      <EdgeBlur />
      <ArrivalLine reduced={reduced} />
      <PaperCardProvider>
        <main>{children}</main>
      </PaperCardProvider>
    </div>
  );
}
