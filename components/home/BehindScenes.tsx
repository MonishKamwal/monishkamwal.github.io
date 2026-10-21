import { archTeaser, journeyTeaser } from "./content";
import { ArrowDown } from "./icons";

// §3 Behind the Scenes — the auto-cycling isometric architecture deck. The SVG
// (#archSvg) and caption (.cy-*) are populated/animated by useHomeMotion; this
// renders the empty stage, the caption shell, the prev/next controls, and cue.
export function BehindScenes() {
  return (
    <section className="sec scene-layer" id="sceneLayer">
      <div className="scene-inner">
        <div className="sec-head">
          <h2 className="scene-title display reveal">{archTeaser.title}</h2>
          <p className="scene-lead reveal" data-stagger="1">{archTeaser.lede}</p>
        </div>
        <div className="arch-wrap">
          <div className="arch-stage" id="archStage">
            <svg id="archSvg" className="arch-svg" viewBox="0 0 1440 816" aria-hidden="true" />
            <div className="cy-cap">
              <div className="cy-txt">
                <p className="cy-k" />
                <h3 className="cy-n" />
                <p className="cy-s" />
              </div>
              <div className="cy-dots">
                <b data-i="0" /><b data-i="1" /><b data-i="2" /><b data-i="3" />
              </div>
              <p className="scene-link reveal" data-stagger="3">
                <a className="link cta-strong" href={archTeaser.cta.href}>
                  {archTeaser.cta.label} →
                </a>
              </p>
            </div>
            <button className="cy-arrow prev" type="button" aria-label="Previous plane">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button className="cy-arrow next" type="button" aria-label="Next plane">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
      <div className="next-cue" id="sceneCue">
        <button className="arrow-btn" aria-label={`Continue to ${journeyTeaser.sectionIndicator}`}>
          <ArrowDown />
        </button>
      </div>
    </section>
  );
}
