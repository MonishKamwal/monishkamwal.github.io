import { journeyEntry } from "@/lib/content";
import { journeyTeaser, skillsTeaser } from "./content";
import { ArrowDown } from "./icons";

function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const featured = journeyTeaser.featuredSlugs
  .map((slug) => journeyEntry(slug))
  .filter((e): e is NonNullable<typeof e> => !!e);

// §4 The Journey — three featured entries along a short serpentine with a comet
// that laps the path (both drawn/animated by useHomeMotion). This renders the
// static SVG scaffold (path, dots, rings, comet, lens defs) and the entry cards.
export function JourneyTeaser() {
  return (
    <section className="sec journey-layer" id="journeyLayer">
      <div className="j-inner">
        <div className="sec-head">
          <h2 className="scene-title reveal">{journeyTeaser.title}</h2>
          <p className="scene-lead reveal" data-stagger="1">{journeyTeaser.lede}</p>
        </div>
        <div className="j-path-wrap">
          <svg viewBox="0 0 700 420" fill="none" aria-hidden="true">
            <defs>
              <clipPath id="jLensClip">
                <circle id="jLensCircle" cx="0" cy="0" r="0" />
              </clipPath>
              <mask id="jLensMask" maskUnits="userSpaceOnUse">
                <rect x="-100" y="-100" width="900" height="640" fill="#fff" />
                <circle id="jLensHole" cx="0" cy="0" r="0" fill="#000" />
              </mask>
            </defs>
            <path className="j-path" id="jPath" d="" mask="url(#jLensMask)" />
            <path className="j-lens" id="jLensPath" d="" clipPath="url(#jLensClip)" />
            <circle className="j-ring" r="5.5" opacity="0" />
            <circle className="j-ring" r="5.5" opacity="0" />
            <circle className="j-ring" r="5.5" opacity="0" />
            <circle className="j-ring" r="5.5" opacity="0" />
            <circle className="j-dot" r="5.5" />
            <circle className="j-dot" r="5.5" />
            <circle className="j-dot" r="5.5" />
            <circle className="j-dot" r="5.5" />
            <path className="j-comet" id="jComet" d="" />
            <circle className="j-halo" id="jHalo" r="9" opacity="0" />
            <circle className="j-halo" id="jHead" r="3.6" opacity="0" />
          </svg>
          {featured.map((e) => (
            <div className="j-entry" key={e.slug}>
              <div className="d">{fmtDate(e.date)} · {e.phaseKey}</div>
              <h4>{e.title}</h4>
              <p>{e.summary}</p>
            </div>
          ))}
          <p className="scene-link j-cta j-cta-wrap" id="jLinkWrap">
            <a className="link cta-strong" href={journeyTeaser.cta.href}>
              {journeyTeaser.cta.label} →
            </a>
          </p>
        </div>
      </div>
      <div className="next-cue" id="journeyCue">
        <button className="arrow-btn" aria-label={`Continue to ${skillsTeaser.sectionIndicator}`}>
          <ArrowDown />
        </button>
      </div>
    </section>
  );
}
