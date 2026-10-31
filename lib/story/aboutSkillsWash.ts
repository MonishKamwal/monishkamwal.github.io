// The About "What I work with" wash — the wider skillset (co-ops + research),
// beyond this site's own project (that's the /skills Toolkit). Same living-wash
// vocabulary as Home §5 (overlapping multiply-blend blobs that breathe, light on
// hover/tap) but without the shared-tool crossings — a broad capability map, not
// an evidence-receipt one. Five clusters, hand-placed so neighbours overlap:
// Cloud & AI · Machine learning · DevOps & infra · Observability · People.
// Geometry is measured, not computed; keep labels in step with about.json skills.
// `data-skill` = cluster id. Two layouts: wide (landscape) + tall (portrait),
// switched on (max-aspect-ratio: 9/10), the same way Home §5 does.

// three organic blob outlines reused across the clusters (from Home §5)
const P = "M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z";
const Q = "M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z";
const R = "M60 14 C110 -4 176 16 190 64 C204 114 176 164 130 186 C86 206 32 190 14 148 C-2 110 10 56 44 26 C50 20 54 16 60 14 Z";

export const ABOUT_SKILLS_WASH_MARKUP = `
<svg class="wash wash-wide" viewBox="0 0 1300 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <g class="b-g" data-skill="cloud" data-stagger="1">
    <path class="blob" fill="var(--w-blue)" transform="translate(40,160) scale(2.1) rotate(8 100 100)" d="${P}"/>
    <text class="b-name" x="250" y="330" font-size="25" text-anchor="middle">Cloud &amp; AI services</text>
    <text class="b-tool" x="250" y="360" font-size="16.5" text-anchor="middle">Azure AI Foundry · GPT-4o / mini</text>
    <text class="b-tool" x="250" y="383" font-size="16.5" text-anchor="middle">Document Intelligence · AI Search</text>
    <text class="b-tool" x="250" y="406" font-size="16.5" text-anchor="middle">Speech — TTS + STT</text>
    <text class="b-tool" x="250" y="429" font-size="16.5" text-anchor="middle">Functions · Blob · Tables · AWS</text>
  </g>
  <g class="b-g" data-skill="ml" data-stagger="2">
    <path class="blob" fill="var(--w-sage)" transform="translate(295,40) scale(1.75) rotate(-9 100 100)" d="${P}"/>
    <text class="b-name" x="470" y="180" font-size="25" text-anchor="middle">Machine learning</text>
    <text class="b-tool" x="470" y="210" font-size="16.5" text-anchor="middle">Python · PyTorch · scikit-learn</text>
    <text class="b-tool" x="470" y="233" font-size="16.5" text-anchor="middle">Pandas · NumPy</text>
    <text class="b-tool" x="470" y="256" font-size="16.5" text-anchor="middle">RAG · multimodal / VLMs</text>
  </g>
  <g class="b-g" data-skill="devops" data-stagger="3">
    <path class="blob" fill="var(--w-rose)" transform="translate(480,170) scale(2.15) rotate(-4 100 100)" d="${R}"/>
    <text class="b-name" x="695" y="345" font-size="25" text-anchor="middle">DevOps &amp; infrastructure</text>
    <text class="b-tool" x="695" y="375" font-size="16.5" text-anchor="middle">Docker · Azure DevOps · Pipelines</text>
    <text class="b-tool" x="695" y="398" font-size="16.5" text-anchor="middle">self-hosted agents · Bicep · Terraform</text>
    <text class="b-tool" x="695" y="421" font-size="16.5" text-anchor="middle">GitHub Actions · CI/CD</text>
    <text class="b-tool" x="695" y="444" font-size="16.5" text-anchor="middle">DevOps policy &amp; security</text>
  </g>
  <g class="b-g" data-skill="observe" data-stagger="4">
    <path class="blob" fill="var(--w-ochre)" transform="translate(740,40) scale(1.75) rotate(15 100 100)" d="${Q}"/>
    <text class="b-name" x="915" y="180" font-size="25" text-anchor="middle">Observability</text>
    <text class="b-tool" x="915" y="210" font-size="16.5" text-anchor="middle">MLflow · Grafana · Prometheus</text>
    <text class="b-tool" x="915" y="233" font-size="16.5" text-anchor="middle">Evidently</text>
    <text class="b-tool" x="915" y="256" font-size="16.5" text-anchor="middle">telemetry &amp; cost monitoring</text>
  </g>
  <g class="b-g" data-skill="people" data-stagger="5">
    <path class="blob" fill="var(--w-sand)" transform="translate(920,190) scale(1.9) rotate(-16 100 100)" d="${Q}"/>
    <text class="b-name" x="1110" y="345" font-size="25" text-anchor="middle">People &amp; communication</text>
    <text class="b-tool" x="1110" y="375" font-size="16.5" text-anchor="middle">Agile / Scrum</text>
    <text class="b-tool" x="1110" y="398" font-size="16.5" text-anchor="middle">Azure Boards · Conducting Workshops</text>
    <text class="b-tool" x="1110" y="421" font-size="16.5" text-anchor="middle">Stakeholder engagement &amp; presentations</text>
  </g>
</svg>
<svg class="wash wash-tall" viewBox="0 0 520 1180" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <g class="b-g" data-skill="cloud" data-stagger="1">
    <path class="blob" fill="var(--w-blue)" transform="translate(35,25) scale(1.55) rotate(8 100 100)" d="${P}"/>
    <text class="b-name" x="190" y="140" font-size="17" text-anchor="middle">Cloud &amp; AI services</text>
    <text class="b-tool" x="190" y="164" font-size="12" text-anchor="middle">Azure AI Foundry · GPT-4o</text>
    <text class="b-tool" x="190" y="180" font-size="12" text-anchor="middle">Document Intelligence · AI Search</text>
    <text class="b-tool" x="190" y="196" font-size="12" text-anchor="middle">Speech — TTS + STT</text>
    <text class="b-tool" x="190" y="212" font-size="12" text-anchor="middle">Functions · Blob · Tables · AWS</text>
  </g>
  <g class="b-g" data-skill="ml" data-stagger="2">
    <path class="blob" fill="var(--w-sage)" transform="translate(200,220) scale(1.4) rotate(-9 100 100)" d="${P}"/>
    <text class="b-name" x="340" y="320" font-size="17" text-anchor="middle">Machine learning</text>
    <text class="b-tool" x="340" y="344" font-size="12" text-anchor="middle">Python · PyTorch · scikit-learn</text>
    <text class="b-tool" x="340" y="360" font-size="12" text-anchor="middle">Pandas · NumPy</text>
    <text class="b-tool" x="340" y="376" font-size="12" text-anchor="middle">RAG · multimodal / VLMs</text>
  </g>
  <g class="b-g" data-skill="devops" data-stagger="3">
    <path class="blob" fill="var(--w-rose)" transform="translate(15,400) scale(1.6) rotate(-4 100 100)" d="${R}"/>
    <text class="b-name" x="175" y="520" font-size="17" text-anchor="middle">DevOps &amp; infrastructure</text>
    <text class="b-tool" x="175" y="544" font-size="12" text-anchor="middle">Docker · Azure DevOps · Pipelines</text>
    <text class="b-tool" x="175" y="560" font-size="12" text-anchor="middle">self-hosted agents · Bicep</text>
    <text class="b-tool" x="175" y="576" font-size="12" text-anchor="middle">Terraform · GitHub Actions</text>
    <text class="b-tool" x="175" y="592" font-size="12" text-anchor="middle">DevOps policy &amp; security</text>
  </g>
  <g class="b-g" data-skill="observe" data-stagger="4">
    <path class="blob" fill="var(--w-ochre)" transform="translate(215,625) scale(1.35) rotate(15 100 100)" d="${Q}"/>
    <text class="b-name" x="350" y="720" font-size="17" text-anchor="middle">Observability</text>
    <text class="b-tool" x="350" y="744" font-size="12" text-anchor="middle">MLflow · Grafana · Prometheus</text>
    <text class="b-tool" x="350" y="760" font-size="12" text-anchor="middle">Evidently</text>
    <text class="b-tool" x="350" y="776" font-size="12" text-anchor="middle">telemetry &amp; cost monitoring</text>
  </g>
  <g class="b-g" data-skill="people" data-stagger="5">
    <path class="blob" fill="var(--w-sand)" transform="translate(60,810) scale(1.5) rotate(-16 100 100)" d="${Q}"/>
    <text class="b-name" x="210" y="920" font-size="17" text-anchor="middle">People &amp; communication</text>
    <text class="b-tool" x="210" y="944" font-size="12" text-anchor="middle">Agile / Scrum</text>
    <text class="b-tool" x="210" y="960" font-size="12" text-anchor="middle">Azure Boards · Conducting Workshops</text>
    <text class="b-tool" x="210" y="976" font-size="12" text-anchor="middle">Stakeholder engagement &amp; presentations</text>
  </g>
</svg>`;
