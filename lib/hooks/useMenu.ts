"use client";

import { useCallback, useEffect, useState } from "react";

// Open/close state for the slide-in menu, with Escape-to-close and a scroll lock
// while open. Focus movement (into the panel, back to the trigger) is owned by
// the Menu component, which holds the element refs.
export function useMenu() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => setOpen(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return { open, openMenu, close };
}
