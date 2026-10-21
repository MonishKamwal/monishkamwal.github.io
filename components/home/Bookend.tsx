"use client";

import { useState } from "react";
import Link from "next/link";
import { home, site } from "@/lib/content";

const b = home.bookend;

export default function Bookend() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — the mailto link below still works
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="font-display text-5xl text-ink sm:text-6xl">{b.title}</h2>

      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={copyEmail}
          className="font-sans text-xl text-ochre-deep transition-colors hover:text-ochre sm:text-2xl"
        >
          {site.contact.email}
        </button>
        <span className="h-4 text-xs text-muted" aria-live="polite">
          {copied ? site.contact.copiedLabel : ""}
        </span>
        <a
          href={`mailto:${site.contact.email}`}
          className="text-xs text-muted underline-offset-2 hover:underline"
        >
          or open in your mail app
        </a>
      </div>

      <div className="flex items-center gap-5 text-sm">
        <a
          href={site.contact.github}
          target="_blank"
          rel="noreferrer"
          className="ink-link"
        >
          GitHub
        </a>
        <span aria-hidden className="text-hairline">
          ·
        </span>
        <a
          href={site.contact.linkedin}
          target="_blank"
          rel="noreferrer"
          className="ink-link"
        >
          LinkedIn
        </a>
      </div>

      <Link href={b.aboutLink.href} className="ink-link mt-2 text-sm">
        {b.aboutLink.label} →
      </Link>

      <p className="text-xs text-muted">{b.note}</p>
    </div>
  );
}
