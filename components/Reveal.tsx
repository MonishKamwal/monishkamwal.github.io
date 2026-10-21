"use client";

import { useReveal } from "@/lib/useReveal";

type RevealProps = {
  children: React.ReactNode;
  as?: "div" | "section" | "li" | "article";
  className?: string;
  delay?: number;
};

// Thin client wrapper that lets server-rendered content fade/rise in once it
// enters view. Under prefers-reduced-motion the CSS keeps it visible, so this
// stays an enhancement, never a gate on content.
export default function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
}: RevealProps) {
  const { ref, revealed } = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      data-reveal
      data-revealed={revealed ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
