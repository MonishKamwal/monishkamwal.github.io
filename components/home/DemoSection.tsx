import { home } from "@/lib/content";
import SketchDemo from "./SketchDemo";
import { archTeaser } from "./content";
import { ArrowDown } from "./icons";

// §2 Live demo — the title, the sketch pad wired to the model, and the cue on
// to Behind the Scenes.
export function DemoSection() {
  return (
    <section className="sec panel-layer" id="panelLayer">
      <div className="demo-title reveal">{home.demo.title}</div>
      <SketchDemo />
      <div className="demo-arrow-wrap" id="demoArrowWrap">
        <button className="arrow-btn" id="demoArrow" aria-label={`Continue to ${archTeaser.sectionIndicator}`}>
          <ArrowDown />
        </button>
      </div>
    </section>
  );
}
