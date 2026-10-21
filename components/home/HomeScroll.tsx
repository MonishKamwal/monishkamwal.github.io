"use client";

import { useRef } from "react";
import { useHomeMotion } from "@/lib/hooks/useHomeMotion";
import { TopBar } from "./TopBar";
import { Menu } from "./Menu";
import { EdgeBlur } from "./EdgeBlur";
import { Hero } from "./Hero";
import { DemoSection } from "./DemoSection";
import { BehindScenes } from "./BehindScenes";
import { JourneyTeaser } from "./JourneyTeaser";
import { Skills } from "./Skills";
import { Contact } from "./Contact";

// Home — the six-section scroll (Hero · Demo · Behind the Scenes · Journey ·
// Skills · Contact), ported from transition-prototype.html (DESIGN.md §5). The
// structure is React-rendered once by the section components; all the motion
// runs in one imperative requestAnimationFrame loop (useHomeMotion) that reads
// rects every frame and must never trigger a re-render. Copy is in content/*.json.
export default function HomeScroll() {
  const rootRef = useRef<HTMLElement>(null);
  useHomeMotion(rootRef);

  return (
    <main className="home-root story" ref={rootRef}>
      <TopBar />
      <Menu />
      <EdgeBlur />
      <Hero />
      <DemoSection />
      <BehindScenes />
      <JourneyTeaser />
      <Skills />
      <Contact />
    </main>
  );
}
