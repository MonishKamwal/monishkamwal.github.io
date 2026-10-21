"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { site } from "@/lib/content";

type MenuProps = { open: boolean; onClose: () => void };

// Slide-in panel from the right over a light scrim (DESIGN.md Stage 3 / 4.5).
// Items are large Bodoni Moda links grouped as The Data / The Story / More,
// revealed on a staircase stagger. Closes on link click, Esc, or scrim.
export default function Menu({ open, onClose }: MenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Flat ordered list for the staircase index; keep the Home entry first.
  const groups = [
    { label: null, items: [{ label: site.nav.homeLabel, href: "/" }] },
    ...site.nav.groups,
  ];

  let stairIndex = 0;

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
    >
      {/* scrim */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`absolute right-0 top-0 h-full w-[min(88vw,22rem)] overflow-y-auto border-l border-hairline bg-ground px-8 py-7 shadow-[0_0_60px_rgba(10,10,10,0.08)] transition-transform duration-[480ms] [transition-timing-function:var(--ease-expo)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
            className="text-ink transition-colors hover:text-ochre"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-col gap-7">
          {groups.map((group, gi) => (
            <div key={group.label ?? "home"}>
              {group.label && (
                <p className="micro-label mb-3">{group.label}</p>
              )}
              <ul className="flex flex-col gap-1.5">
                {group.items.map((item) => {
                  const i = stairIndex++;
                  return (
                    <li
                      key={item.href + item.label}
                      style={{
                        transitionDelay: open ? `${i * 45}ms` : "0ms",
                      }}
                      className={`transition-[opacity,transform] duration-[420ms] [transition-timing-function:var(--ease-expo)] ${
                        open
                          ? "translate-x-0 opacity-100"
                          : "translate-x-3 opacity-0"
                      }`}
                    >
                      <Link
                        ref={gi === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={onClose}
                        tabIndex={open ? 0 : -1}
                        className="font-display text-3xl leading-tight text-ink transition-colors hover:text-ochre"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M5 5l12 12M17 5L5 17"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
