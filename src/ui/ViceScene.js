// VICE, the HQ's neon ground, as a place: a Miami dusk in the retro way. Behind the panels of both hubs
// (ui/ManagerHub.js, ui/CareerHub.js - ui/HQKit.js themes them) - a sky going from indigo through violet and magenta
// to a burning orange at the horizon; a big sun cut by bands, sitting on a neon horizon line; the grid floor running
// away from it; and palms - large ones in silhouette framing the scene from both sides, a rim of pink light on their
// edges, a few small ones along the horizon. Drawn once as an SVG (no images, nothing to load); only shown on the VICE
// ground. sceneHTML() -> the layer; SCENE_CSS(root) its stylesheet.

const rnd = (() => { let s = 20260611; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
const f1 = (v) => Math.round(v * 10) / 10;

/**
 * A palm: a tapering trunk bending up from (x, y) by lean, and its crown of fronds - each a filled leaf drooping from
 * the top, notched on its lower edge. s: its size (the trunk's height); flip: mirrored.
 */
function palm(x, y, s, lean, flip = false) {
  const tx = x + lean, ty = y - s, cx = x + lean * 0.15, cy = y - s * 0.55, w0 = s * 0.05, w1 = s * 0.022, L = [], R = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, a = 1 - t, px = a * a * x + 2 * a * t * cx + t * t * tx, py = a * a * y + 2 * a * t * cy + t * t * ty;
    const dx = 2 * a * (cx - x) + 2 * t * (tx - cx), dy = 2 * a * (cy - y) + 2 * t * (ty - cy), n = Math.hypot(dx, dy) || 1, w = w0 + (w1 - w0) * t;
    L.push(`${f1(px - (dy / n) * w)} ${f1(py + (dx / n) * w)}`); R.unshift(`${f1(px + (dy / n) * w)} ${f1(py - (dx / n) * w)}`);
  }
  const out = [`<path d="M${L.join(' L')} L${R.join(' L')}Z" class="pt"/>`];
  // the trunk's rings
  for (let i = 2; i < 15; i += 2) { const t = i / 16, a = 1 - t, px = a * a * x + 2 * a * t * cx + t * t * tx, py = a * a * y + 2 * a * t * cy + t * t * ty, w = w0 + (w1 - w0) * t;
    out.push(`<path d="M${f1(px - w)} ${f1(py)} q${f1(w)} ${f1(w * 0.5)} ${f1(2 * w)} 0" class="pr"/>`); }
  // the fronds: a rib arching out and drooping, leaflets hanging off it on both sides (stroked: drawn twice - a pink
  //  rim under, the silhouette over)
  const N = 10, fr = [];
  for (let k = 0; k < N; k++) {
    const ang = (-175 + (k * 170) / (N - 1) + (rnd() - 0.5) * 8) * (Math.PI / 180), side = Math.cos(ang), len = s * (0.48 + rnd() * 0.14) * (Math.abs(side) > 0.5 ? 1 : 0.8);
    const ex = tx + side * len, ey = ty + Math.sin(ang) * len * 0.35 + s * (0.1 + 0.32 * Math.abs(side));
    const mx = tx + side * len * 0.55, my = ty + Math.sin(ang) * len * 0.5 - s * 0.04;
    let d = `M${f1(tx)} ${f1(ty)} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}`;
    for (let t = 0.16; t <= 0.98; t += 0.055) {
      const a = 1 - t, px = a * a * tx + 2 * a * t * mx + t * t * ex, py = a * a * ty + 2 * a * t * my + t * t * ey;
      const gx = 2 * a * (mx - tx) + 2 * t * (ex - mx), gy = 2 * a * (my - ty) + 2 * t * (ey - my), g = Math.hypot(gx, gy) || 1, ll = s * 0.11 * (1 - t * 0.7);
      for (const sg of [-1, 1]) { const nx = -gy / g * sg, ny = gx / g * sg, lx = px + (nx * 0.55 + gx / g * 0.35) * ll, ly = py + (Math.abs(ny) * 0.55 + 0.75) * ll; d += ` M${f1(px)} ${f1(py)} L${f1(lx)} ${f1(ly)}`; }
    }
    fr.push(d);
  }
  const fd = fr.join(' '), sw = Math.max(1.4, s * 0.007);
  out.push(`<path d="${fd}" class="pg" style="stroke-width:${f1(sw + 2.4)}"/><path d="${fd}" class="pf" style="stroke-width:${f1(sw)}"/>`);
  out.push(`<circle cx="${f1(tx)}" cy="${f1(ty + s * 0.02)}" r="${f1(s * 0.03)}" class="pt"/>`);
  return `<g${flip ? ` transform="translate(${2 * x} 0) scale(-1 1)"` : ''}>${out.join('')}</g>`;
}
let cached = null;
/** the scene's layer (made once) */
export function sceneHTML() {
  if (cached) return cached;
  const W = 1366, H = 768, hz = 520;
  // the small palms along the horizon, then the big ones framing it: two on the left, two on the right
  const far = [palm(330, hz, 70, -6), palm(360, hz, 52, 8), palm(1010, hz, 64, 6), palm(1048, hz, 48, -7)];
  const near = [palm(70, H + 20, 560, 130), palm(-10, H + 30, 430, 60), palm(1300, H + 20, 540, 120, true), palm(1395, H + 30, 420, 50, true)];
  cached = `<div class="vc-scene" aria-hidden="true"><i class="vc-sun"></i><i class="vc-hz"></i><svg class="vc-palms" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">
    <g class="far">${far.join('')}</g><g class="near">${near.join('')}</g></svg></div>`;
  return cached;
}
/** its stylesheet, for a hub's root (#mgr, #career) */
export const SCENE_CSS = (R) => `
${R} .vc-scene { display: none; position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
${R}[data-tone="vice"] .vc-scene { display: block; }
/* (the sun: big, banded, sitting on the horizon - the retro one) */
${R} .vc-sun { position: absolute; left: 50%; top: calc(67.7% - 250px); width: 500px; height: 250px; margin-left: -250px; border-radius: 250px 250px 0 0; overflow: hidden;
  background: linear-gradient(180deg, #fff27a 0%, #ffc34d 28%, #ff8a3d 55%, #ff3f8e 82%, #d4147f 100%); opacity: .85;
  -webkit-mask: linear-gradient(180deg, #000 0 50%, transparent 50% 53%, #000 53% 62%, transparent 62% 66%, #000 66% 73%, transparent 73% 78%, #000 78% 84%, transparent 84% 90%, #000 90% 94%, transparent 94% 100%);
  mask: linear-gradient(180deg, #000 0 50%, transparent 50% 53%, #000 53% 62%, transparent 62% 66%, #000 66% 73%, transparent 73% 78%, #000 78% 84%, transparent 84% 90%, #000 90% 94%, transparent 94% 100%);
  filter: drop-shadow(0 0 40px rgba(255,90,150,.55)); }
${R} .vc-scene::before { content: ''; position: absolute; left: 50%; top: calc(67.7% - 330px); width: 760px; height: 380px; margin-left: -380px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,110,140,.35), transparent 75%); }
/* (the horizon: a neon line, the sun sitting on it) */
${R} .vc-hz { position: absolute; left: 0; right: 0; top: 67.7%; height: 2px; background: linear-gradient(90deg, transparent, #23e5ff 18%, #ff3fa4 50%, #23e5ff 82%, transparent); box-shadow: 0 0 14px 2px rgba(255,63,164,.6), 0 0 34px 6px rgba(35,229,255,.3); }
/* (the palms: silhouettes, a rim of pink light on their edges; the far ones dimmer) */
${R} .vc-palms { position: absolute; inset: 0; width: 100%; height: 100%; }
${R} .vc-palms .pt { fill: #07020f; stroke: rgba(255,63,164,.55); stroke-width: 1.2; stroke-linejoin: round; }
${R} .vc-palms .pf { fill: none; stroke: #07020f; stroke-linecap: round; stroke-linejoin: round; }
${R} .vc-palms .pg { fill: none; stroke: rgba(255,63,164,.5); stroke-linecap: round; stroke-linejoin: round; }
${R} .vc-palms .near { filter: drop-shadow(0 0 6px rgba(255,63,164,.45)); }
${R} .vc-palms .pr { fill: none; stroke: rgba(255,63,164,.22); stroke-width: 1.2; }
${R} .vc-palms .far .pt { fill: #1a0730; stroke: rgba(255,63,164,.35); } ${R} .vc-palms .far .pf { stroke: #1a0730; } ${R} .vc-palms .far .pg { stroke: rgba(255,63,164,.3); }
/* (the sky, deeper and warmer at the horizon: a Miami dusk) */
${R}[data-tone="vice"]::before { background:
  radial-gradient(60% 34% at 50% 68%, rgba(255,140,60,.45), rgba(255,63,164,.25) 45%, transparent 78%),
  radial-gradient(40% 50% at 92% 8%, rgba(35,229,255,.18), transparent 70%),
  radial-gradient(45% 55% at 6% 14%, rgba(155,92,255,.28), transparent 72%),
  linear-gradient(180deg, #0a0524 0%, #1a0a3e 34%, #3b1060 54%, #8a2470 67.5%, #1a0632 67.8%, #120428 100%) !important; }
/* (the floor: the grid running to the horizon, brighter now there is nothing on it) */
${R}[data-tone="vice"]::after { opacity: .75; height: 32.3%; }
/* (the panels: a pane of smoked glass with the dusk behind it, every edge a tube) */
${R}[data-tone="vice"] .q-p, ${R}[data-tone="vice"] .glass:not(.ch-top):not(.ch-rail):not(.ch-panel) { backdrop-filter: blur(10px) saturate(1.25); -webkit-backdrop-filter: blur(10px) saturate(1.25); }
${R}[data-tone="vice"] .q-p > header h3 { color: #ffd1f0; text-shadow: 0 0 8px rgba(255,63,164,.8), 0 0 18px rgba(255,63,164,.4); }
/* (the tubes: every panel's edge brighter, pink into cyan, and a glow off it) */
${R}[data-tone="vice"] .q-p { background: linear-gradient(180deg, rgba(27,16,58,.80), rgba(20,11,45,.76)) padding-box, linear-gradient(140deg, rgba(255,63,164,.85), rgba(155,92,255,.22) 38%, rgba(155,92,255,.18) 62%, rgba(35,229,255,.8)) border-box;
  box-shadow: 0 14px 34px -20px rgba(0,0,0,.8), 0 0 22px -10px rgba(255,63,164,.75), 0 0 28px -14px rgba(35,229,255,.6); }
${R}[data-tone="vice"] button.go { box-shadow: 0 0 0 1px rgba(255,255,255,.18) inset, 0 0 18px -2px var(--ac), 0 0 34px -8px var(--ac); text-shadow: 0 0 8px rgba(255,255,255,.5); }
`;
