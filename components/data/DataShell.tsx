"use client";

import { useRef } from "react";
import { TopBar } from "@/components/story/TopBar";
import { Menu } from "@/components/story/Menu";
import { EdgeBlur } from "@/components/story/EdgeBlur";
import { ArrivalLine } from "@/components/story/ArrivalLine";
import { VizTipProvider } from "./VizTip";
import { SwitchDock } from "./SwitchDock";
import { useMenu } from "@/lib/hooks/useMenu";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrubbedReveals } from "@/lib/hooks/useScrubbedReveals";

// The shared layout for every Data page (DESIGN.md §7). White ground, lifted
// paper; mode identity rides the chrome, not a ground tint. Reuses the global
// chrome (top bar, menu, edge blur, arrival line) and adds the isolated Data
// tray + the one shared chart tooltip. A scrubbed-reveal loop animates the
// page's `.reveal` blocks in. Page content (the panel grid) is the children.
export function DataShell({
  current,
  children,
}: {
  current: string;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { open, openMenu, close } = useMenu();
  useScrubbedReveals(rootRef, reduced);

  return (
    <div ref={rootRef} className="data-root" data-page={current}>
      <TopBar menuOpen={open} onOpenMenu={openMenu} />
      <Menu open={open} onClose={close} />
      <EdgeBlur />
      <ArrivalLine reduced={reduced} />
      <VizTipProvider>
        <main>{children}</main>
      </VizTipProvider>
      <SwitchDock current={current} />
    </div>
  );
}
