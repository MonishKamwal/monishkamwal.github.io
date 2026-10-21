// The Skills "map" — Home §5's wide composition (the five wash shapes + the four
// shared-tool crossings), and the camera stops that zoom into it. Ported from
// sections-prototype.html §SKILLS; the map is geometry-locked (a change to Home
// §5 is a change here). Labels mirror content/skills.json.

export type SkillsStop = {
  k: string;
  x: number;
  y: number;
  w: number;
  h: number;
  lit?: string[];
  s?: string;
  wide?: boolean;
  whole?: boolean;
  rest?: number;
};

// camera stops, in .sk-block order: head → competencies interleaved with the
// crossings they connect → end. `lit` = competency shapes shown; `s` = the lit
// crossing label; whole/wide = overview framings.
export const SK_STOPS: SkillsStop[] = [
  { k: "head", x: 730, y: 410, w: 1825, h: 1025, wide: true, whole: true },
  { k: "data", x: 282, y: 440, w: 1150, h: 700, lit: ["data"] },
  { k: "s3", x: 398, y: 418, w: 1000, h: 620, lit: ["data", "train"], s: "s3" },
  { k: "train", x: 579, y: 372, w: 1150, h: 700, lit: ["train"] },
  { k: "onnx", x: 688, y: 432, w: 1000, h: 620, lit: ["train", "ship"], s: "onnx" },
  { k: "ship", x: 850, y: 450, w: 1150, h: 700, lit: ["ship"] },
  { k: "k6", x: 969, y: 364, w: 1000, h: 620, lit: ["ship", "watch"], s: "k6" },
  { k: "watch", x: 1081, y: 282, w: 1150, h: 700, lit: ["watch"] },
  { k: "gha", x: 961, y: 555, w: 1000, h: 620, lit: ["ship", "front"], s: "gha" },
  { k: "front", x: 1054, y: 612, w: 1150, h: 700, lit: ["front"] },
  { k: "end", x: 560, y: 457, w: 2100, h: 900, whole: true, rest: 0.42 },
];

// the whole map's content box (map units), used for the portrait overview
export const SK_CONTENT = { x: 664, y: 457, w: 1180, h: 700 };

// The map's inner SVG (groups keyed by competency id, shared-tool crossings keyed
// by id). Geometry-locked; labels kept in step with skills.json.
export const SKILLS_MAP_MARKUP = `
<g class="m-g" data-k="train">
  <path class="blob" fill="var(--w-sage)" transform="translate(365,175) scale(2.05) rotate(-9 100 100)"
        d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/>
  <text class="m-name" x="579" y="378" font-size="28" text-anchor="middle">Training models</text>
  <text class="m-tool" x="579" y="420" font-size="19" text-anchor="middle">PyTorch · Python</text>
</g>
<g class="m-g" data-k="data">
  <path class="blob" fill="var(--w-ochre)" transform="translate(110,310) scale(1.75) rotate(15 100 100)"
        d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/>
  <text class="m-name" x="282" y="478" font-size="28" text-anchor="middle">Keeping data honest</text>
  <text class="m-tool" x="282" y="514" font-size="19" text-anchor="middle">DVC · Pandera</text>
</g>
<g class="m-g" data-k="ship">
  <path class="blob" fill="var(--w-rose)" transform="translate(625,255) scale(2.05) rotate(-4 100 100)"
        d="M60 14 C110 -4 176 16 190 64 C204 114 176 164 130 186 C86 206 32 190 14 148 C-2 110 10 56 44 26 C50 20 54 16 60 14 Z"/>
  <text class="m-name" x="852" y="455" font-size="28" text-anchor="middle">Shipping it</text>
  <text class="m-tool" x="845" y="497" font-size="19" text-anchor="middle">Docker · Terraform</text>
  <text class="m-tool" x="845" y="525" font-size="19" text-anchor="middle">AWS Lambda</text>
</g>
<g class="m-g" data-k="watch">
  <path class="blob" fill="var(--w-blue)" transform="translate(905,125) scale(1.70) rotate(8 100 100)"
        d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/>
  <text class="m-name" x="1081" y="290" font-size="28" text-anchor="middle">Watching it run</text>
  <text class="m-tool" x="1081" y="328" font-size="19" text-anchor="middle">MLflow · Grafana · Evidently</text>
</g>
<g class="m-g" data-k="front">
  <path class="blob" fill="var(--w-sand)" transform="translate(898,470) scale(1.60) rotate(-16 100 100)"
        d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/>
  <text class="m-name" x="1054" y="622" font-size="28" text-anchor="middle">Building the front</text>
  <text class="m-tool" x="1054" y="654" font-size="19" text-anchor="middle">Next.js · TypeScript</text>
</g>
<text class="m-shared" data-s="s3" x="398" y="421" font-size="18" text-anchor="middle">S3</text>
<text class="m-shared" data-s="onnx" x="688" y="435" font-size="18" text-anchor="middle">ONNX</text>
<text class="m-shared" data-s="k6" x="969" y="368" font-size="18" text-anchor="middle">k6</text>
<text class="m-shared" data-s="gha" x="961" y="559" font-size="18" text-anchor="middle">GitHub Actions</text>
`;
