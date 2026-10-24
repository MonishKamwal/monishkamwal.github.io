"use client";

import Link from "next/link";
import { site } from "@/lib/content";

// The isolated Data-mode bottom tray (DESIGN.md §4.6): within-mode navigation
// across Quality · Performance · Monitoring. The current page is inert — it is
// the page you are on, so it is a plain marker, not a link (keeps focus/aria
// clean). The menu is the only bridge out of the mode.
export function SwitchDock({ current }: { current: string }) {
  return (
    <nav className="switch-dock" aria-label="Data pages">
      {site.trays.data.map((item) => {
        const active = item.href === current;
        return active ? (
          <span key={item.href} className="sw active" aria-current="page">
            {item.label}
          </span>
        ) : (
          <Link key={item.href} className="sw" href={item.href}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
