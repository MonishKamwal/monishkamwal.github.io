import { skillsTeaser, bookend } from "./content";
import { ArrowDown } from "./icons";
import { WASH_MARKUP } from "./washMarkup";

// §5 Skills — the living wash (a geometry-locked SVG injected once and morphed
// by useHomeMotion) and the cue on to the Contact bookend.
export function Skills() {
  return (
    <section className="sec skills-layer" id="skillsLayer">
      <div className="s-inner">
        <div className="sec-head">
          <h2 className="scene-title reveal">{skillsTeaser.title}</h2>
          <p className="scene-lead reveal" data-stagger="1">{skillsTeaser.lede}</p>
        </div>
        <div className="wash-wrap" dangerouslySetInnerHTML={{ __html: WASH_MARKUP }} />
      </div>
      <div className="next-cue" id="skillsCue">
        <button className="arrow-btn" aria-label={`Continue to ${bookend.sectionIndicator}`}>
          <ArrowDown />
        </button>
      </div>
    </section>
  );
}
