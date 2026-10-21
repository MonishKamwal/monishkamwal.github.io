import { site } from "@/lib/content";
import { bookend } from "./content";

// §6 Contact bookend — the "Say hello." close with GitHub / LinkedIn / copy-email
// (#bMail → clipboard, handled by useHomeMotion) and the About link.
export function Contact() {
  return (
    <section className="sec after" id="afterLayer">
      <h2 className="display">{bookend.title}</h2>
      <div className="b-foot">
        <a href={site.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 20 4.8 4.9 4.9 0 0 0 19.9 1S18.7.6 16 2.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A4.9 4.9 0 0 0 5 4.8a5.2 5.2 0 0 0-1.4 3.7c0 5.2 3.2 6.4 6.2 6.7A3.4 3.4 0 0 0 9 17.8V22" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
        <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="2" width="20" height="20" rx="2.5" /><path d="M7 10v7M7 6.5v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
        <button id="bMail" aria-label="Copy email address">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="M3 6l9 7 9-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="copied" id="emailCopied">{bookend.copiedLabel}</div>
      <a className="link or-link" href={bookend.aboutLink.href}>
        {bookend.aboutLink.label} →
      </a>
    </section>
  );
}
