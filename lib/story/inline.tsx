import type { ReactNode } from "react";

// Render the small inline markdown the content uses — **bold** and `code` —
// as React nodes. Plain text passes through untouched. Shared by the paper card
// bodies and the Architecture text flow.
export function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <b key={i}>{p.slice(2, -2)}</b>;
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    return p;
  });
}
