// The About page's background wash — Home §5's Skills scheme, as a vertical
// chain down the right side (hero cluster → serpentine). Geometry-locked; the
// blobs breathe/undulate via useAboutMotion. Ported from sections-prototype.html.
export const ABOUT_WASH_MARKUP = `
<g class="b-g"><path class="blob" fill="var(--w-sand)"  transform="translate(70,50) scale(1.55) rotate(-8 100 100)"  d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/></g>
<g class="b-g"><path class="blob" fill="var(--w-ochre)" transform="translate(240,120) scale(1.7) rotate(14 100 100)" d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/></g>
<g class="b-g"><path class="blob" fill="var(--w-rose)"  transform="translate(300,300) scale(1.5) rotate(-12 100 100)" d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/></g>
<g class="b-g"><path class="blob" fill="var(--w-sage)"  transform="translate(300,620) scale(1.55) rotate(10 100 100)" d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/></g>
<g class="b-g"><path class="blob" fill="var(--w-ochre)" transform="translate(300,790) scale(1.55) rotate(-18 100 100)" d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/></g>
<g class="b-g"><path class="blob" fill="var(--w-rose)"  transform="translate(300,960) scale(1.55) rotate(14 100 100)" d="M92 6 C146 0 178 34 186 80 C194 128 164 178 112 190 C66 200 20 174 10 128 C0 82 22 38 66 16 C74 12 84 8 92 6 Z"/></g>
<g class="b-g"><path class="blob" fill="var(--w-sand)"  transform="translate(300,1130) scale(1.6) rotate(-10 100 100)" d="M104 10 C158 2 196 46 188 96 C182 138 200 160 172 180 C140 202 88 196 56 178 C22 158 2 122 10 84 C18 44 58 18 104 10 Z"/></g>
`;

// the Work serpentine's path — a fixed S between three nodes (matching the three
// Work entries), with the node coordinates used to anchor the hover lens.
export const ABOUT_TRACE_D = "M500 70 C500 200 205 200 205 330 C205 455 500 455 500 580";
export const ABOUT_TRACE_NODES: [number, number][] = [
  [500, 70],
  [205, 330],
  [500, 580],
];
// each Work stop's position on the .trace box, by index (left/top %), matching
// the three serpentine nodes
export const ABOUT_TRACE_STOPS = [
  { left: "2%", top: "1%" },
  { left: "44%", top: "34%" },
  { left: "2%", top: "67%" },
];
