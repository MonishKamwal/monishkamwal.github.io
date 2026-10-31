// The §5 Skills wash — ported VERBATIM from transition-prototype.html. Its
// geometry is measured, not computed: five overlapping multiply-blend shapes
// whose four crossings each carry a shared tool named in no shape's own list
// (Training∩Data = S3, Training∩Shipping = ONNX, Shipping∩Watching = k6,
// Shipping∩Front = GitHub Actions). Moving any shape loses a crossing or invents
// a false one — so this is kept as the authored string, injected as-is. The only
// change from the prototype is the "See all skills" href (→ the real /skills
// route). The living-wash morph + hover/tap lighting are driven in HomeScroll.
// See DESIGN.md §5 "§5" and the "pixel/geometry authority" note (§10).

export const WASH_MARKUP = `
<svg class="wash wash-wide" viewBox="-182.5 -102.5 1825 1025" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <g class="b-g" data-skill="train" data-stagger="1">
    <path class="blob" fill="var(--w-sage)" transform="translate(365,175) scale(2.05) rotate(-9 100 100)"
          d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/>
    <text class="b-name" x="579" y="378" font-size="28" text-anchor="middle">Training models</text>
    <text class="b-tool" x="579" y="420" font-size="19" text-anchor="middle">Python · PyTorch</text>
    <text class="b-tool" x="579" y="448" font-size="19" text-anchor="middle">scikit-learn</text>
  </g>
  <g class="b-g" data-skill="data" data-stagger="2">
    <path class="blob" fill="var(--w-ochre)" transform="translate(110,310) scale(1.75) rotate(15 100 100)"
          d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/>
    <text class="b-name" x="282" y="478" font-size="28" text-anchor="middle">Keeping data honest</text>
    <text class="b-tool" x="282" y="514" font-size="19" text-anchor="middle">DVC · Pandera</text>
  </g>
  <g class="b-g" data-skill="ship" data-stagger="3">
    <path class="blob" fill="var(--w-rose)" transform="translate(625,255) scale(2.05) rotate(-4 100 100)"
          d="M60 14 C110 -4 176 16 190 64 C204 114 176 164 130 186 C86 206 32 190 14 148 C-2 110 10 56 44 26 C50 20 54 16 60 14 Z"/>
    <text class="b-name" x="852" y="455" font-size="28" text-anchor="middle">Shipping it</text>
    <text class="b-tool" x="845" y="497" font-size="19" text-anchor="middle">Docker · Terraform</text>
    <text class="b-tool" x="845" y="525" font-size="19" text-anchor="middle">AWS Lambda</text>
  </g>
  <g class="b-g" data-skill="watch" data-stagger="4">
    <path class="blob" fill="var(--w-blue)" transform="translate(905,125) scale(1.70) rotate(8 100 100)"
          d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/>
    <text class="b-name" x="1081" y="290" font-size="28" text-anchor="middle">Watching it run</text>
    <text class="b-tool" x="1081" y="328" font-size="19" text-anchor="middle">MLflow · Grafana · Evidently</text>
  </g>
  <g class="b-g" data-skill="front" data-stagger="5">
    <path class="blob" fill="var(--w-sand)" transform="translate(898,470) scale(1.60) rotate(-16 100 100)"
          d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/>
    <text class="b-name" x="1054" y="622" font-size="28" text-anchor="middle">Building the front</text>
    <text class="b-tool" x="1054" y="654" font-size="19" text-anchor="middle">Next.js · TypeScript</text>
  </g>
  <text class="b-shared" data-pair="train data" data-stagger="6" x="398" y="421" font-size="18" text-anchor="middle">S3</text>
  <text class="b-shared" data-pair="train ship" data-stagger="6" x="688" y="435" font-size="18" text-anchor="middle">ONNX</text>
  <text class="b-shared" data-pair="ship watch" data-stagger="6" x="969" y="368" font-size="18" text-anchor="middle">k6</text>
  <text class="b-shared" data-pair="ship front" data-stagger="6" x="961" y="559" font-size="18" text-anchor="middle">GitHub Actions</text>
  <g class="b-g" data-stagger="7">
    <a class="wash-link" href="/skills">
      <path class="blob" fill="var(--w-ochre)" transform="translate(1135,525) scale(1.45) rotate(11 100 100)"
            d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/>
      <text x="1275" y="652" font-size="22" text-anchor="middle">See the toolkit →</text>
    </a>
  </g>
</svg>
<svg class="wash wash-tall" viewBox="20 27 505 817" aria-hidden="true">
  <g class="b-g" data-skill="data" data-stagger="2">
    <path class="blob" fill="var(--w-ochre)" transform="translate(68,78) scale(1.00) rotate(15 100 100)"
          d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/>
    <text class="b-name" x="166" y="172" font-size="19" text-anchor="middle">Keeping data honest</text>
    <text class="b-tool" x="166" y="196" font-size="13" text-anchor="middle">DVC · Pandera</text>
  </g>
  <g class="b-g" data-skill="train" data-stagger="1">
    <path class="blob" fill="var(--w-sage)" transform="translate(152,186) scale(1.28) rotate(-9 100 100)"
          d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/>
    <text class="b-name" x="286" y="310" font-size="19" text-anchor="middle">Training models</text>
    <text class="b-tool" x="286" y="338" font-size="13" text-anchor="middle">Python · PyTorch</text>
    <text class="b-tool" x="286" y="357" font-size="13" text-anchor="middle">scikit-learn</text>
  </g>
  <g class="b-g" data-skill="ship" data-stagger="3">
    <path class="blob" fill="var(--w-rose)" transform="translate(55,380) scale(1.30) rotate(-4 100 100)"
          d="M60 14 C110 -4 176 16 190 64 C204 114 176 164 130 186 C86 206 32 190 14 148 C-2 110 10 56 44 26 C50 20 54 16 60 14 Z"/>
    <text class="b-name" x="170" y="478" font-size="19" text-anchor="middle">Shipping it</text>
    <text class="b-tool" x="170" y="552" font-size="13" text-anchor="middle">Docker · Terraform</text>
    <text class="b-tool" x="170" y="570" font-size="13" text-anchor="middle">AWS Lambda</text>
  </g>
  <g class="b-g" data-skill="front" data-stagger="5">
    <path class="blob" fill="var(--w-sand)" transform="translate(272,424) scale(0.86) rotate(-16 100 100)"
          d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/>
    <text class="b-name" x="366" y="468" font-size="15" text-anchor="middle">Building the front</text>
    <text class="b-tool" x="366" y="488" font-size="11.5" text-anchor="middle">Next.js · TypeScript</text>
  </g>
  <g class="b-g" data-skill="watch" data-stagger="4">
    <path class="blob" fill="var(--w-blue)" transform="translate(140,580) scale(1.00) rotate(8 100 100)"
          d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/>
    <text class="b-name" x="244" y="678" font-size="19" text-anchor="middle">Watching it run</text>
    <text class="b-tool" x="244" y="702" font-size="13" text-anchor="middle">MLflow · Grafana</text>
    <text class="b-tool" x="244" y="720" font-size="13" text-anchor="middle">Evidently</text>
  </g>
  <text class="b-shared" data-pair="train data" data-stagger="6" x="214" y="244" font-size="13" text-anchor="middle">S3</text>
  <text class="b-shared" data-pair="train ship" data-stagger="6" x="239" y="415" font-size="13" text-anchor="middle">ONNX</text>
  <text class="b-shared" data-pair="ship front" data-stagger="6" x="292" y="517" font-size="13" text-anchor="middle">GitHub Actions</text>
  <text class="b-shared" data-pair="ship watch" data-stagger="6" x="213" y="617" font-size="13" text-anchor="middle">k6</text>
  <g class="b-g" data-stagger="7">
    <a class="wash-link" href="/skills">
      <path class="blob" fill="var(--w-ochre)" transform="translate(318,632) scale(0.95) rotate(11 100 100)"
            d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/>
      <text x="411" y="730" font-size="18" text-anchor="middle">See the toolkit →</text>
    </a>
  </g>
</svg>`;
