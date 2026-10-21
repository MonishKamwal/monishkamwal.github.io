import { home } from "@/lib/content";
import { ArrowDown } from "./icons";

// §1 Hero — the name in display Bodoni, tagline, and the scroll cue.
export function Hero() {
  return (
    <section className="sec hero-layer" id="heroLayer">
      <h1 className="display hero-name">{home.hero.name}</h1>
      <p className="hero-sub">{home.hero.tagline}</p>
      <div className="hero-arrow-wrap">
        <button className="arrow-btn" id="arrowBtn" aria-label={home.hero.scrollCueLabel}>
          <ArrowDown />
        </button>
      </div>
    </section>
  );
}
