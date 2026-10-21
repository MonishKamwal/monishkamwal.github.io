"use client";

import { useSyncExternalStore } from "react";

// Tracks the user's `prefers-reduced-motion` setting, reactively, via
// useSyncExternalStore (matchMedia is an external store). Story-mode motion
// branches on this: when reduced, elements render settled and nothing animates.
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
