"use client";

import { useEffect, useState } from "react";

// Client-side fetch of the live MLOps contracts (DESIGN.md §9). The site is a
// static export, so these are fetched in the browser at view time — the numbers
// are always as fresh as the last hub publish. Takes a map of key → URL and
// resolves them together; a single failure fails the whole page (the pages
// render one honest "couldn't reach the contracts" state rather than a
// half-populated board).

export type Loadable<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "ready"; data: T; error: null }
  | { status: "error"; data: null; error: string };

export function useContracts<T extends Record<string, unknown>>(
  urls: { [K in keyof T]: string },
): Loadable<T> {
  const [state, setState] = useState<Loadable<T>>({
    status: "loading",
    data: null,
    error: null,
  });

  // The URL map is a stable per-page constant; key it by its values so the
  // effect runs once per page, not on every render.
  const key = Object.values(urls).join("|");

  useEffect(() => {
    let live = true;
    // The URL map is a per-page constant, so this effect runs once; the initial
    // useState already holds "loading", so there's no synchronous reset here.

    const entries = Object.entries(urls) as [keyof T, string][];
    Promise.all(
      entries.map(async ([, url]) => {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`${url} → ${res.status}`);
        return res.json();
      }),
    )
      .then((results) => {
        if (!live) return;
        const data = {} as T;
        entries.forEach(([k], i) => {
          data[k] = results[i];
        });
        setState({ status: "ready", data, error: null });
      })
      .catch((err: unknown) => {
        if (!live) return;
        setState({
          status: "error",
          data: null,
          error: err instanceof Error ? err.message : String(err),
        });
      });

    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
