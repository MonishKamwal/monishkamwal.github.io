"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { site } from "@/lib/content";

// The slide-in site menu (the global nav spec, shared with Home). Grouped into
// Start / The Data / The Story / More; each group fades up on a stagger via the
// global .menu-panel CSS. Internal links use next/link so Story-to-Story moves
// are client transitions. Closes on link click, Escape (useMenu), or scrim.
export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const groups = [
    { label: "Start", items: [{ label: site.nav.homeLabel, href: "/" }] },
    ...site.nav.groups,
  ];

  return (
    <>
      <div
        className={`m-scrim ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`menu-panel ${open ? "open" : ""}`}
        id="menuPanel"
        aria-hidden={!open}
        aria-label="Site menu"
      >
        <div className="menu-head">
          <span className="micro">{site.nav.menuLabel}</span>
          <button
            ref={closeRef}
            className="m-close"
            onClick={onClose}
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M2 2l16 16M18 2L2 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav>
          {groups.map((group) => (
            <div className="menu-group" key={group.label}>
              <span className="menu-cat micro">{group.label}</span>
              {group.items.map((item) => (
                <Link
                  key={item.href + item.label}
                  className="menu-link"
                  href={item.href}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
