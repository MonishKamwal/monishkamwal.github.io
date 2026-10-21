// The isometric architecture diagram geometry, ported verbatim from
// sections-prototype.html ("pulled apart, crossings are stops"). Pure builders:
// the planes, their parts (cubes), and the wires between them, in plan units.
// The scroll camera that animates them lives in useArchMotion.

export type ArchPartGeo = {
  n: string; // label
  s: string; // sub-label
  x: number;
  y: number;
  card: string; // id into content/architecture.json parts
  gate?: boolean;
};
export type ArchPlaneGeo = {
  name: string;
  sub: string;
  fill: string;
  ghost?: boolean;
  parts: ArchPartGeo[];
};
export type ArchWire = { a: [number, string]; b: [number, string]; up?: boolean; l: string };
export type ArchStop = {
  k: string;
  sep: number;
  hero?: number;
  all?: number;
  focus?: number;
  cross?: number;
  mat?: number;
};

// parts a wire joins stand at the SAME spot on both sheets, so every wire runs
// straight up or down (the drawing's z axis)
export const AX_PLANES: ArchPlaneGeo[] = [
  { name: "Serving", sub: "always on · ~$0", fill: "#dee5f4", parts: [
    { n: "Browser", s: "canvas · yes / no", x: 110, y: 250, card: "browser" },
    { n: "Lambda", s: "FastAPI + ONNX", x: 300, y: 100, card: "lambda" },
    { n: "S3", s: "logs + labeled drawings", x: 470, y: 250, card: "s3" }] },
  { name: "Monitoring", sub: "every Monday", fill: "#d8ecde", parts: [
    { n: "Drift report", s: "Evidently", x: 470, y: 250, card: "drift" },
    { n: "Evidence hub", s: "JSON contracts", x: 470, y: 80, card: "evidence" },
    { n: "GitHub issue", s: "on a drift breach", x: 130, y: 250, card: "issue" }] },
  { name: "CI/CD", sub: "every merge", fill: "#f8dfc4", parts: [
    { n: "Train", s: "PyTorch · DVC", x: 130, y: 250, card: "train" },
    { n: "Registry", s: "MLflow", x: 130, y: 80, card: "registry" },
    { n: "Quality gate", s: "floor 0.85 · ε", x: 460, y: 200, card: "gate", gate: true },
    { n: "Deploy", s: "Docker → Lambda", x: 300, y: 100, card: "ship" }] },
  { name: "Ephemeral K8s", sub: "~30 minutes a month", fill: "#fbd3dc", ghost: true, parts: [
    { n: "EKS + VPC", s: "Terraform", x: 120, y: 240, card: "eks" },
    { n: "API by digest", s: "Helm", x: 300, y: 100, card: "helm" },
    { n: "Load", s: "k6 · Prometheus", x: 470, y: 250, card: "load" }] },
];

// [from plane, part] → [to plane, part]; up = the flywheel, drawn ochre
export const AX_WIRES: ArchWire[] = [
  { a: [0, "S3"], b: [1, "Drift report"], l: "logs, every prediction" },
  { a: [1, "GitHub issue"], b: [2, "Train"], l: "drift breach → retrain" },
  { a: [2, "Deploy"], b: [0, "Lambda"], up: true, l: "a new model ships" },
  { a: [2, "Deploy"], b: [3, "API by digest"], l: "the same image" },
];

// each wire's tag: how far along the wire, and which side of it
export const AX_TAG = [{ t: 0.55, side: 1 }, { t: 0.5, side: -1 }, { t: 0.3, side: -1 }, { t: 0.62, side: 1 }];

// the camera's stops, in the order of the .ax-block elements: sep = sheet
// spacing, focus = the plane slid out, cross = the wire in focus, all = every wire
export const AX_PH: ArchStop[] = [
  { k: "head", sep: 22, hero: 1 },
  { k: "ov", sep: 175, all: 1 },
  { k: "serve", sep: 175, focus: 0 },
  { k: "w0", sep: 200, cross: 0 },
  { k: "mon", sep: 175, focus: 1 },
  { k: "w1", sep: 200, cross: 1 },
  { k: "ci", sep: 175, focus: 2 },
  { k: "w3", sep: 200, cross: 3 },
  { k: "k8s", sep: 175, focus: 3, mat: 1 },
  { k: "w2", sep: 200, cross: 2 },
  { k: "end", sep: 22 },
];

export const AX_C30 = Math.cos(Math.PI / 6);
export const AX_PW = 520;
export const AX_PD = 300;
export const axIso = (x: number, y: number, z = 0): [number, number] => [(x - y) * AX_C30, (x + y) * 0.5 - z];
const axP = (p: [number, number]) => p[0].toFixed(1) + "," + p[1].toFixed(1);

export type Sheet = { svg: string; pts: Record<string, { top: [number, number]; base: [number, number] }> };

// one sheet with its parts, in plan units, centred on (0,0). `ts` scales labels.
export function axSheet(pl: ArchPlaneGeo, ts: number): Sheet {
  const hw = AX_PW / 2, hd = AX_PD / 2, T = 10;
  const pts: Sheet["pts"] = {};
  const g = pl.ghost, dash = g ? ' stroke-dasharray="5 5"' : "", op = g ? ' fill-opacity=".4"' : "";
  const c = ([[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]] as [number, number][]).map((q) => axIso(q[0], q[1]));
  const dn = (p: [number, number]): [number, number] => [p[0], p[1] + T];
  let s = '<polygon points="' + [c[1], c[2], dn(c[2]), dn(c[1])].map(axP).join(" ") + '" fill="' + pl.fill + '" stroke="#0a0a0a" stroke-width="1"' + dash + op + ' style="filter:brightness(.92)"/>';
  s += '<polygon points="' + [c[2], c[3], dn(c[3]), dn(c[2])].map(axP).join(" ") + '" fill="' + pl.fill + '" stroke="#0a0a0a" stroke-width="1"' + dash + op + ' style="filter:brightness(.85)"/>';
  s += '<polygon points="' + c.map(axP).join(" ") + '" fill="' + pl.fill + '" stroke="#0a0a0a" stroke-width="1"' + dash + (g ? ' fill-opacity=".5"' : "") + "/>";
  pl.parts.forEach((pt) => {
    const bx = (pt.x * AX_PW) / 560 - hw, by = (pt.y * AX_PD) / 320 - hd, bw = 60, bh = pt.gate ? 18 : 32;
    const sq: [number, number][] = [[0, 0], [bw, 0], [bw, bw], [0, bw]];
    const top = sq.map((q) => axIso(bx + q[0] - bw / 2, by + q[1] - bw / 2, bh));
    const base = sq.map((q) => axIso(bx + q[0] - bw / 2, by + q[1] - bw / 2, 0));
    const fc = g ? "rgba(255,255,255,.55)" : "#fff", pd = g ? ' stroke-dasharray="3 3"' : "";
    const lp = axIso(bx, by, bh + bw / 2 + 26);
    s += '<g class="ax-part" data-card="' + pt.card + '" data-n="' + pt.n + '" data-s="' + pt.s + '" data-pl="' + pl.name + '" tabindex="0" role="button" aria-label="' + pt.n + ' — open details">';
    s += '<polygon points="' + [top[1], top[2], base[2], base[1]].map(axP).join(" ") + '" fill="' + fc + '" stroke="#0a0a0a" stroke-width=".9"' + pd + ' style="filter:brightness(.94)"/>';
    s += '<polygon points="' + [top[2], top[3], base[3], base[2]].map(axP).join(" ") + '" fill="' + fc + '" stroke="#0a0a0a" stroke-width=".9"' + pd + ' style="filter:brightness(.86)"/>';
    s += '<polygon points="' + top.map(axP).join(" ") + '" fill="' + fc + '" stroke="#0a0a0a" stroke-width=".9"' + pd + "/>";
    s += '<text x="' + lp[0] + '" y="' + lp[1] + '" font-size="' + (13 * ts) + '" font-weight="500" text-anchor="middle" fill="#0a0a0a">' + pt.n + "</text>";
    s += '<text x="' + lp[0] + '" y="' + (lp[1] + 14 * ts) + '" font-size="' + (10.5 * ts) + '" text-anchor="middle" fill="#6b6b6b">' + pt.s + "</text></g>";
    if (pt.gate) {
      // the gate's dead end: the blocked 0.50 model, its own card
      const dz = axIso(bx + 70, by + 60), a0 = axIso(bx + 20, by + 20);
      s += '<g class="ax-part" data-card="blocked" data-n="A deploy that got blocked" data-s="" data-pl="CI/CD" tabindex="0" role="button" aria-label="The blocked deploy — open details">';
      s += '<line x1="' + a0[0] + '" y1="' + a0[1] + '" x2="' + dz[0] + '" y2="' + (dz[1] + 12) + '" stroke="#0a0a0a" stroke-dasharray="4 4"/>';
      s += '<polygon points="' + ([[dz[0] - 12, dz[1] + 14], [dz[0] + 12, dz[1] + 14], [dz[0] + 12, dz[1] + 18], [dz[0] - 12, dz[1] + 18]] as [number, number][]).map(axP).join(" ") + '" fill="#0a0a0a" stroke="#0a0a0a"/>';
      s += '<text x="' + dz[0] + '" y="' + (dz[1] + 32 * ts) + '" font-size="' + (11.5 * ts) + '" font-weight="500" text-anchor="middle" fill="#96600a">v7 · 0.50 — blocked</text></g>';
    }
    pts[pt.n] = { top: axIso(bx, by, bh), base: axIso(bx, by, 0) };
  });
  return { svg: s, pts };
}

// the full svg innerHTML (sheets 3..0, then empty wire + label groups)
export function buildArchSvg(ts: number): { html: string; sheets: Sheet[] } {
  const sheets = AX_PLANES.map((pl) => axSheet(pl, ts));
  let html = "";
  for (let i = 3; i >= 0; i--) html += '<g class="ax-pl" data-i="' + i + '">' + sheets[i].svg + "</g>";
  html += '<g class="ax-w"></g><g class="ax-l"></g>';
  return { html, sheets };
}
