"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "./Menu";

type TopBarProps = {
  // "home": left slot is the live section indicator, menu appears past the hero.
  // "inner": left slot is "← Home", menu always available.
  variant?: "home" | "inner";
  // inner pages pass their own fixed label (e.g. "Architecture").
  staticLabel?: string;
};

export default function TopBar({
  variant = "home",
  staticLabel,
}: TopBarProps) {
  const [open, setOpen] = useState(false);
  const [sectionLabel, setSectionLabel] = useState("");

  // Home: track the section currently crossing the upper third of the viewport.
  useEffect(() => {
    if (variant !== "home") return;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-label]"),
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSectionLabel(
              entry.target.getAttribute("data-section-label") ?? "",
            );
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [variant]);

  const inner = variant === "inner";
  // On home the hamburger stays hidden on the hero (no label yet).
  const showMenuButton = inner || sectionLabel !== "";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="min-h-[1.25rem]">
          {inner ? (
            <Link
              href="/"
              className="micro-label transition-colors hover:text-ochre"
            >
              ← Home
            </Link>
          ) : (
            <span
              className="micro-label transition-opacity duration-300"
              aria-live="polite"
            >
              {sectionLabel}
            </span>
          )}
          {inner && staticLabel && (
            <span className="sr-only">{staticLabel}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className={`text-ink transition-opacity duration-300 hover:text-ochre ${
            showMenuButton ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <MenuIcon />
        </button>
      </header>

      <Menu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8h16M4 16h16"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
