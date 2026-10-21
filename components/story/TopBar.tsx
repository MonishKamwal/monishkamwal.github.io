"use client";

import Link from "next/link";

// Fixed top bar: a back-to-Home link (left) and the menu trigger (right).
// Reuses the global .topbar/.home-link/.menu-btn chrome from the design system.
export function TopBar({
  menuOpen,
  onOpenMenu,
}: {
  menuOpen: boolean;
  onOpenMenu: () => void;
}) {
  return (
    <div className="topbar">
      <Link className="home-link" href="/" aria-label="Back to the home page">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M16 6H1M6 1 1 6l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Home</span>
      </Link>
      <button
        className="menu-btn"
        onClick={onOpenMenu}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="menuPanel"
      >
        <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M1 1h24M1 7h24M1 13h24" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
