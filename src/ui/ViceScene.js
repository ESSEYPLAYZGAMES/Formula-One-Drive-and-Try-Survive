// VICE, the HQ's neon ground, as a place: Ocean Drive at dusk. Behind the panels of both hubs (ui/ManagerHub.js,
// ui/CareerHub.js - ui/HQKit.js themes them) - a sky going from indigo through violet and magenta to a burning orange
// at the sea; a low sun cut by bands; a row of Art Deco hotels along the front, every edge a neon tube (pink, cyan,
// tangerine, violet), lit windows, vertical signs, porches with their awnings; palms in silhouette between them; the
// sea's glow and the street's light along the foot. Drawn once as an SVG (no images, nothing to load); only shown on
// the VICE ground. The names on the signs are invented. sceneHTML() -> the layer; SCENE_CSS(root) its stylesheet.

const NEON = ['#ff3fa4', '#23e5ff', '#ff8a3d', '#b36bff', '#3dffb5', '#ffd23f'];
const rnd = (() => { let s = 20260611; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
const SIGNS = ['HOTEL', 'NEON', 'VICE', 'PALMS', 'TIDE', 'CORAL', 'SUNSET', 'MARINA'];

/** one hotel: a body, a stepped crown or a fin, its tubes, its windows, maybe a vertical sign and an awning */
function hotel(x, w, h, i) {
  const base = 300, top = base - h, c = NEON[i % NEON.length], c2 = NEON[(i + 2) % NEON.length], out = [];
  out.push(`<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="url(#vcB)"/>`);
  // the crown: steps, a rounded corner, or a fin
  const k = i % 3;
  if (k === 0) { out.push(`<path d="M${x + w * 0.2} ${top} v-14 h${w * 0.6} v14 M${x + w * 0.34} ${top - 14} v-10 h${w * 0.32} v10" fill="#120826" stroke="${c}" stroke-width="1.6" filter="url(#vcG)"/>`); }
  else if (k === 1) { out.push(`<path d="M${x} ${top + 26} q0 -26 26 -26 h${w - 26}" fill="none" stroke="${c}" stroke-width="1.8" filter="url(#vcG)"/>`); }
  else { out.push(`<rect x="${x + w / 2 - 5}" y="${top - 46}" width="10" height="46" rx="5" fill="#120826" stroke="${c2}" stroke-width="1.6" filter="url(#vcG)"/>`); }
  // the tubes: the outline and a band under the roof and over the porch
  out.push(`<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="none" stroke="${c}" stroke-width="1.6" filter="url(#vcG)" opacity=".95"/>`);
  out.push(`<line x1="${x + 4}" y1="${top + 10}" x2="${x + w - 4}" y2="${top + 10}" stroke="${c2}" stroke-width="2" filter="url(#vcG)"/>`);
  out.push(`<line x1="${x + 4}" y1="${base - 34}" x2="${x + w - 4}" y2="${base - 34}" stroke="${c}" stroke-width="2.4" filter="url(#vcG)"/>`);
  // the windows: rows of lit and dark
  for (let y = top + 20; y < base - 44; y += 15) for (let wx = x + 8; wx < x + w - 10; wx += 13) if (rnd() < 0.55) out.push(`<rect x="${wx}" y="${y}" width="6" height="7" fill="${rnd() < 0.7 ? '#ffd9a0' : c2}" opacity="${(0.35 + rnd() * 0.5).toFixed(2)}"/>`);
  // a vertical sign down the front
  if (i % 2 === 0 && h > 140) { const t = SIGNS[i % SIGNS.length], sx = x + w - 20, sh = Math.min(h - 56, t.length * 17 + 12);
    out.push(`<rect x="${sx}" y="${top + 22}" width="16" height="${sh}" rx="3" fill="#0e0620" stroke="${c2}" stroke-width="1.4" filter="url(#vcG)"/>`);
    out.push(`<text x="${sx + 8}" y="${top + 38}" fill="${c2}" font-size="13" font-weight="800" text-anchor="middle" font-family="Arial, sans-serif" filter="url(#vcG)">${t.split('').map((ch, j) => `<tspan x="${sx + 8}" dy="${j ? 17 : 0}">${ch}</tspan>`).join('')}</text>`); }
  // the porch: an awning in stripes
  out.push(`<rect x="${x + 6}" y="${base - 30}" width="${w - 12}" height="8" fill="${c}" opacity=".55"/><rect x="${x + 6}" y="${base - 22}" width="${w - 12}" height="22" fill="#12071f" opacity=".9"/>`);
  return out.join('');
}
/** a palm in silhouette: a leaning trunk and its fronds */
function palm(x, h, lean) {
  const top = 300 - h, tx = x + lean, P = [`<path d="M${x} 300 Q${x + lean * 0.3} ${300 - h * 0.5} ${tx} ${top}" stroke="#07020f" stroke-width="5" fill="none"/>`];
  for (let a = -160; a <= -20; a += 20) { const r = (a * Math.PI) / 180, L = 34 + rnd() * 16, ex = tx + Math.cos(r) * L, ey = top + Math.sin(r) * L * 0.55 + 18;
    P.push(`<path d="M${tx} ${top} Q${(tx + ex) / 2} ${top - 12} ${ex} ${ey}" stroke="#07020f" stroke-width="4" fill="none" stroke-linecap="round"/>`); }
  return P.join('');
}
let cached = null;
/** the scene's layer (made once) */
export function sceneHTML() {
  if (cached) return cached;
  const W = 1366, parts = [];
  let x = -10, i = 0;
  while (x < W) { const w = 92 + Math.round(rnd() * 70), h = 120 + Math.round(rnd() * 120); parts.push(hotel(x, w, h, i++)); x += w + 18 + Math.round(rnd() * 26); }
  const palms = []; for (let px = 40; px < W; px += 120 + Math.round(rnd() * 90)) palms.push(palm(px, 150 + rnd() * 80, (rnd() - 0.5) * 50));
  cached = `<div class="vc-scene" aria-hidden="true"><i class="vc-sun"></i><svg class="vc-city" viewBox="0 0 ${W} 320" preserveAspectRatio="xMidYMax slice">
    <defs><linearGradient id="vcB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d0b3a"/><stop offset="1" stop-color="#0c0420"/></linearGradient>
      <filter id="vcG" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${parts.join('')}${palms.join('')}<rect x="0" y="300" width="${W}" height="20" fill="#07020f"/><line x1="0" y1="301" x2="${W}" y2="301" stroke="#ff3fa4" stroke-width="2" filter="url(#vcG)" opacity=".8"/></svg><i class="vc-sea"></i></div>`;
  return cached;
}
/** its stylesheet, for a hub's root (#mgr, #career) */
export const SCENE_CSS = (R) => `
${R} .vc-scene { display: none; position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
${R}[data-tone="vice"] .vc-scene { display: block; }
${R} .vc-sun { position: absolute; left: 50%; bottom: 150px; width: 380px; height: 380px; margin-left: -190px; border-radius: 50%;
  background: linear-gradient(180deg, #ffe066 0%, #ff9a3d 38%, #ff3f8e 72%, #b0127a 100%); opacity: .55; filter: blur(.5px);
  -webkit-mask: repeating-linear-gradient(180deg, #000 0 16px, transparent 16px 21px); mask: repeating-linear-gradient(180deg, #000 0 16px, transparent 16px 21px);
  box-shadow: 0 0 120px 40px rgba(255,80,150,.25); }
${R} .vc-city { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 42%; min-height: 230px; opacity: .92; }
${R} .vc-sea { position: absolute; left: 0; right: 0; bottom: 0; height: 30px; background: linear-gradient(180deg, rgba(255,63,164,.0), rgba(255,63,164,.22) 40%, rgba(35,229,255,.18)); }
/* (the sky, deeper and warmer at the sea: Ocean Drive at dusk) */
${R}[data-tone="vice"]::before { background:
  radial-gradient(70% 40% at 50% 100%, rgba(255,140,60,.42), rgba(255,63,164,.24) 40%, transparent 75%),
  radial-gradient(40% 50% at 92% 8%, rgba(35,229,255,.18), transparent 70%),
  radial-gradient(45% 55% at 6% 14%, rgba(155,92,255,.28), transparent 72%),
  linear-gradient(180deg, #0a0524 0%, #1a0a3e 38%, #3b1060 62%, #6e1a6a 82%, #a8325a 100%) !important; }
${R}[data-tone="vice"]::after { opacity: .28; }
/* (the panels: a pane of smoked glass with the city behind it, every edge a tube) */
${R}[data-tone="vice"] .q-p, ${R}[data-tone="vice"] .glass { backdrop-filter: blur(10px) saturate(1.25); -webkit-backdrop-filter: blur(10px) saturate(1.25); }
${R}[data-tone="vice"] .q-p > header h3 { color: #ffd1f0; text-shadow: 0 0 8px rgba(255,63,164,.8), 0 0 18px rgba(255,63,164,.4); }
/* (the tubes: every panel's edge brighter, pink into cyan, and a glow off it) */
${R}[data-tone="vice"] .q-p { background: linear-gradient(180deg, rgba(27,16,58,.80), rgba(20,11,45,.76)) padding-box, linear-gradient(140deg, rgba(255,63,164,.85), rgba(155,92,255,.22) 38%, rgba(155,92,255,.18) 62%, rgba(35,229,255,.8)) border-box;
  box-shadow: 0 14px 34px -20px rgba(0,0,0,.8), 0 0 22px -10px rgba(255,63,164,.75), 0 0 28px -14px rgba(35,229,255,.6); }
${R}[data-tone="vice"] button.go { box-shadow: 0 0 0 1px rgba(255,255,255,.18) inset, 0 0 18px -2px var(--ac), 0 0 34px -8px var(--ac); text-shadow: 0 0 8px rgba(255,255,255,.5); }
`;
