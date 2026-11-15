// The loading screen, between the menus and a weekend: the Grand Prix's name, the round, the day's conditions; the
// latest from the paddock (the career's news, your recent results, those remembered); a fact or a tip; and behind it
// all, a slow cross-fade of screenshots - your own (ui/Gallery.js: poles, wins, the crowds, your photos), else the
// game's own - each drifting in slowly. The bar follows the real build (main.js loadWorld's stages); the drift is CSS,
// so the picture keeps moving while the build holds the page.
// It tells the menus when it is up and when it goes: body[data-loader="on"] while it shows, and a 'loader:hiding' event
// the moment it starts to fade, so an overlay waiting behind it (Motion.open: the weekend sheet) arrives as it lifts.
// No frosted glass (the laptop's GPU): its cards are near-solid fills over the pictures.
// Its look is the strategy screen's and the HQ's: deep purple, an edge from pink to cyan, the headings lit.
// The progress - the red line round the map, its head, the bar - is drawn by a WORKER on its own canvases (PROG): the
// build holds the page for a second and more between its stages, and anything the page itself animates stands still
// for that long and then jumps. The worker is not held: it is told the new figure and runs up to it - pulling away,
// then easing in - sixty times a second whatever the page is doing. (No worker, or reduced motion: the page draws it,
// as before.)
import { Gallery } from './Gallery.js';
import { BUILTIN_SHOTS } from './LoadingShots.js';
import { TRACK_MAPS } from './TrackMaps.js';
import { ensureMotion, reduced } from './Motion.js';

const CSS = `
#loader { position: fixed; inset: 0; z-index: 95; background: #050608; color: #fff; overflow: hidden; opacity: 0; transition: opacity var(--m-slow, 260ms) var(--ease-out, ease); font-family: var(--k-font, 'Segoe UI', Roboto, Arial, sans-serif); }
#loader.on { opacity: 1; }
#loader.off { opacity: 0; transform: scale(1.02); transition: opacity var(--m-slow, 260ms) var(--ease-in, ease-in), transform var(--m-slow, 260ms) var(--ease-in, ease-in); }
#loader .ld-slide { position: absolute; inset: -4%; background: #050608 center / cover no-repeat; opacity: 0; transition: opacity 1.6s ease; }
#loader .ld-slide.on { opacity: 1; animation: ldKB 11s linear both; }
#loader .ld-slide.alt.on { animation-name: ldKB2; }
@keyframes ldKB { from { transform: scale(1.02) translate(0, 0); } to { transform: scale(1.13) translate(-2.2%, -1.2%); } }
@keyframes ldKB2 { from { transform: scale(1.13) translate(1.6%, -1%); } to { transform: scale(1.02) translate(0, 0); } }
#loader .ld-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(4,5,8,.86) 0%, rgba(4,5,8,.5) 36%, rgba(4,5,8,.15) 60%, rgba(4,5,8,.55) 100%), linear-gradient(0deg, rgba(4,5,8,.94) 0%, rgba(4,5,8,0) 40%), linear-gradient(180deg, rgba(4,5,8,.6) 0%, rgba(4,5,8,0) 16%); }
/* the frame: the name and the day bottom left, the circuit and the news down the right, the facts and the bar along the foot */
#loader .ld-frame { position: absolute; inset: clamp(14px, 3.2vh, 34px) clamp(16px, 4vw, 56px) clamp(14px, 3.6vh, 38px); display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(250px, 29vw, 440px); grid-template-rows: auto minmax(0, 1fr) auto; column-gap: clamp(20px, 4vw, 60px); row-gap: clamp(10px, 2.2vh, 22px); }
#loader .ld-brand { grid-area: 1 / 1; font: 900 13px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .32em; color: rgba(255,255,255,.82); }
#loader .ld-brand b { color: #e10600; }
#loader .ld-side { grid-area: 1 / 2 / 3 / 3; display: flex; flex-direction: column; gap: 10px; min-height: 0; animation: ldIn .8s .15s ease both; }
#loader .ld-card { background: rgba(8,10,16,.78); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; }
#loader .ld-mapcard { flex: 1 1 0; min-height: 200px; display: flex; flex-direction: column; padding: 14px 16px 12px; }
#loader .ld-mapcard h4, #loader .ld-news h4 { margin: 0; font: 800 10.5px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .28em; color: rgba(255,255,255,.55); }
#loader .ld-mapcard h5 { margin: 4px 0 0; font: 700 15px/1.25 'Segoe UI', Arial, sans-serif; color: #fff; }
#loader .ld-map { flex: 1 1 0; min-height: 90px; margin: 8px 0; }
#loader .ld-map svg { width: 100%; height: 100%; display: block; overflow: visible; }
#loader .ld-map .cas { fill: none; stroke: rgba(0,0,0,.6); stroke-width: 34; stroke-linejoin: round; }
#loader .ld-map .trk { fill: none; stroke: rgba(255,255,255,.9); stroke-width: 13; stroke-linejoin: round; }
#loader .ld-map .pit { fill: none; stroke: rgba(255,255,255,.4); stroke-width: 5; stroke-dasharray: 10 9; stroke-linejoin: round; }
#loader .ld-map .run { fill: none; stroke: #e10600; stroke-width: 13; stroke-linejoin: round; stroke-linecap: round; stroke-dasharray: 1000; stroke-dashoffset: 1000; filter: drop-shadow(0 0 7px rgba(255,60,30,.75)); }
#loader .ld-map .head { fill: #fff; filter: drop-shadow(0 0 9px #ff5a3d); }
#loader .ld-map .sf { stroke: #fff; stroke-width: 9; } #loader .ld-map .sf2 { stroke: #111; stroke-width: 9; stroke-dasharray: 9 9; }
#loader .ld-map .dir { fill: #e10600; }
#loader .ld-map .t circle { fill: rgba(10,12,18,.9); stroke: rgba(255,255,255,.55); stroke-width: 2.5; }
#loader .ld-map .t text { fill: #fff; font: 700 25px 'Segoe UI', Arial, sans-serif; text-anchor: middle; dominant-baseline: central; }
#loader .ld-stats { display: flex; justify-content: space-between; gap: 8px; border-top: 1px solid rgba(255,255,255,.1); padding-top: 10px; }
#loader .ld-stats div { min-width: 0; }
#loader .ld-stats b { display: block; font: 800 clamp(15px, 1.5vw, 20px)/1.1 'Segoe UI', Arial, sans-serif; font-variant-numeric: tabular-nums; }
#loader .ld-stats small { display: block; font: 700 9.5px/1.4 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; color: rgba(255,255,255,.5); }
#loader .ld-news { flex: none; display: flex; flex-direction: column; gap: 7px; }
#loader .ld-item { background: rgba(10,12,18,.84); border-left: 3px solid var(--c, #e10600); border-radius: 4px; padding: 8px 11px; font: 500 12.5px/1.4 'Segoe UI', Arial, sans-serif; color: rgba(255,255,255,.9); animation: ldIn .7s ease both; }
#loader .ld-item small { display: block; font: 700 9.5px/1.4 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; color: rgba(255,255,255,.5); margin-bottom: 2px; text-transform: uppercase; }
#loader .ld-main { grid-area: 2 / 1; align-self: end; min-width: 0; }
#loader .ld-kick { font: 700 12px/1.3 'Segoe UI', Arial, sans-serif; letter-spacing: .28em; color: #ff4b3e; margin-bottom: 10px; text-transform: uppercase; animation: ldUp .8s .1s ease both; }
#loader h1 { margin: 0; font: 900 clamp(30px, min(6vw, 9.5vh), 88px)/.95 'Segoe UI', Arial, sans-serif; letter-spacing: -.01em; text-transform: uppercase; text-shadow: 0 4px 30px rgba(0,0,0,.5); animation: ldUp .9s .2s ease both; }
#loader .ld-sub { margin-top: 12px; font: 600 14px/1.5 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; color: rgba(255,255,255,.8); animation: ldUp .9s .35s ease both; }
#loader .ld-sub span + span::before { content: '·'; margin: 0 .6em; color: rgba(255,255,255,.4); }
#loader .ld-foot { grid-area: 3 / 1 / 4 / 3; }
#loader .ld-row { display: flex; align-items: flex-end; gap: 24px; margin-bottom: clamp(8px, 1.8vh, 16px); }
#loader .ld-fact { flex: 1; font: 400 14px/1.5 Georgia, 'Times New Roman', serif; color: rgba(255,255,255,.82); max-width: 820px; min-height: 42px; transition: opacity .5s; }
#loader .ld-fact b { font: 800 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .28em; color: #ff4b3e; display: block; margin-bottom: 6px; }
#loader .ld-cap { flex: none; max-width: 36%; font: 600 11px/1.3 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; color: rgba(255,255,255,.55); text-transform: uppercase; text-align: right; transition: opacity .8s; }
#loader .ld-bar { height: 3px; background: rgba(255,255,255,.14); border-radius: 2px; overflow: hidden; }
#loader .ld-bar i { display: block; height: 100%; width: 100%; background: linear-gradient(90deg, #e10600, #ff6a3d); transform-origin: left center; transform: scaleX(0); box-shadow: 0 0 12px rgba(255,80,40,.6); }
#loader .ld-stage { display: flex; justify-content: space-between; margin-top: 8px; font: 600 11px/1.3 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: rgba(255,255,255,.62); text-transform: uppercase; }
#loader .ld-stage b { color: #fff; font-variant-numeric: tabular-nums; }
#loader .ld-err { margin-top: 12px; color: #ff8b80; font: 600 13px/1.5 'Segoe UI', Arial, sans-serif; }
#loader .ld-err button { margin-left: 10px; background: none; border: 1px solid rgba(255,255,255,.4); color: #fff; border-radius: 4px; padding: 5px 12px; cursor: pointer; font: 700 11px 'Segoe UI', Arial; letter-spacing: .14em; }
@keyframes ldUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes ldIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
/* shorter screens: the news gives way to the map; then the fact */
@media (max-height: 1000px) { #loader .ld-news .ld-item:nth-of-type(n+4) { display: none; } }
@media (max-height: 820px) { #loader .ld-news .ld-item:nth-of-type(n+3) { display: none; } }
@media (max-height: 680px) { #loader .ld-news .ld-item:nth-of-type(n+2) { display: none; } }
@media (max-height: 560px) { #loader .ld-news { display: none; } #loader .ld-fact { min-height: 0; } #loader .ld-mapcard h5 { display: none; } }
@media (max-height: 420px) { #loader .ld-row { display: none; } }
/* narrow screens: one column - the map above the name */
@media (max-width: 760px) {
  #loader .ld-frame { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr) auto auto; }
  #loader .ld-side { grid-area: 2 / 1; } #loader .ld-news { display: none; }
  #loader .ld-main { grid-area: 3 / 1; } #loader .ld-foot { grid-area: 4 / 1; }
  #loader .ld-cap { display: none; }
}
@media (prefers-reduced-motion: reduce) { #loader .ld-slide.on, #loader .ld-side, #loader .ld-item, #loader .ld-kick, #loader h1, #loader .ld-sub { animation: none; } #loader.off { transform: none; } }
html.m-off #loader .ld-slide.on, html.m-off #loader .ld-side, html.m-off #loader .ld-item, html.m-off #loader .ld-kick, html.m-off #loader h1, html.m-off #loader .ld-sub { animation: none; }
html.m-off #loader.off { transform: none; }
/* ---- the look of the strategy screen and the HQ */
#loader { background: #07030f; }
#loader .ld-slide { background-color: #07030f; }
#loader .ld-shade { background: radial-gradient(110% 85% at 0% 100%, rgba(255,63,164,.22), rgba(255,63,164,0) 55%), radial-gradient(85% 75% at 100% 0%, rgba(35,229,255,.15), rgba(35,229,255,0) 60%), linear-gradient(90deg, rgba(10,5,28,.9) 0%, rgba(12,6,32,.56) 36%, rgba(12,6,32,.22) 60%, rgba(12,6,32,.62) 100%), linear-gradient(0deg, rgba(9,4,24,.96) 0%, rgba(9,4,24,0) 42%), linear-gradient(180deg, rgba(9,4,24,.68) 0%, rgba(9,4,24,0) 18%); }
#loader .ld-brand b { color: #ff3f6e; text-shadow: 0 0 14px rgba(255,63,110,.85), 0 0 30px rgba(255,63,164,.5); }
#loader .ld-card { border: 1px solid transparent; border-radius: 14px; background: linear-gradient(180deg, rgba(27,16,58,.9), rgba(16,9,40,.93)) padding-box, linear-gradient(140deg, rgba(255,63,164,.78), rgba(155,92,255,.25) 42%, rgba(35,229,255,.72)) border-box; box-shadow: 0 24px 60px -30px rgba(0,0,0,.9), 0 0 46px -22px #ff3fa4, 0 0 54px -26px #23e5ff; }
#loader .ld-mapcard h4, #loader .ld-news h4 { color: #8fdcf0; text-shadow: 0 0 10px rgba(35,229,255,.55); }
#loader .ld-map { position: relative; }
#loader .ld-map svg, #loader .ld-map canvas { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
#loader .ld-map canvas { display: none; pointer-events: none; }
#loader .ld-map .cas { stroke: rgba(8,3,22,.78); }
#loader .ld-map .pit { stroke: rgba(143,220,240,.5); }
#loader .ld-map .run { stroke: #ff2d55; filter: drop-shadow(0 0 8px rgba(255,63,164,.85)); }
#loader .ld-map .head { filter: drop-shadow(0 0 9px #ff3fa4); }
#loader .ld-map .dir { fill: #ff3f6e; }
#loader .ld-map .t circle { fill: rgba(20,11,45,.96); stroke: rgba(143,220,240,.7); }
#loader .ld-stats { border-top: 0; position: relative; } #loader .ld-stats::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: linear-gradient(90deg, #ff3fa4, #9b5cff 50%, #23e5ff); box-shadow: 0 0 10px rgba(255,63,164,.55); }
#loader .ld-stats b { text-shadow: 0 0 14px rgba(35,229,255,.5); } #loader .ld-stats small { color: #9aa6c8; }
#loader .ld-item { background: linear-gradient(90deg, rgba(60,18,70,.8), rgba(22,12,50,.88)); border-left-color: var(--c, #ff3fa4); border-radius: 0 9px 9px 0; box-shadow: -3px 0 14px -5px var(--c, #ff3fa4); }
#loader .ld-item small { color: #ff8fc4; }
#loader .ld-kick { color: #ff4f7c; text-shadow: 0 0 14px rgba(255,63,110,.75); }
#loader h1 { text-shadow: 0 0 22px rgba(255,255,255,.2), 0 4px 30px rgba(0,0,0,.6); }
#loader h1 span { white-space: nowrap; color: #ff3f6e; text-shadow: 0 0 18px rgba(255,63,110,.8), 0 0 44px rgba(255,63,164,.5), 0 4px 30px rgba(0,0,0,.6); }
#loader .ld-sub { color: rgba(232,226,255,.86); } #loader .ld-sub span + span::before { color: #23e5ff; text-shadow: 0 0 8px #23e5ff; }
#loader .ld-fact { font: 500 14px/1.55 var(--k-font, 'Segoe UI', Arial, sans-serif); color: rgba(236,232,255,.86); }
#loader .ld-fact b { color: #ff6fb8; text-shadow: 0 0 10px rgba(255,63,164,.7); }
#loader .ld-cap { color: rgba(190,200,235,.6); }
#loader .ld-bar { position: relative; background: rgba(200,165,255,.16); }
#loader .ld-bar i { background: linear-gradient(90deg, #ff3f6e, #ff3fa4 40%, #9b5cff 72%, #23e5ff); box-shadow: 0 0 14px rgba(255,63,164,.7); }
#loader .ld-barc { position: absolute; left: -14px; top: -12px; width: calc(100% + 28px); height: 27px; display: none; pointer-events: none; }
#loader .ld-stage { color: rgba(214,208,245,.7); } #loader .ld-stage b { text-shadow: 0 0 12px rgba(35,229,255,.65); }
#loader .ld-err button { border-color: rgba(35,229,255,.6); border-radius: 8px; }
/* (the worker's canvases in place of the page's own line, head and bar) */
#loader.ld-w .ld-map canvas, #loader.ld-w .ld-barc { display: block; }
#loader.ld-w .ld-map .run, #loader.ld-w .ld-map .head { display: none; }
#loader.ld-w .ld-bar { overflow: visible; background: none; } #loader.ld-w .ld-bar i { display: none; }
`.replaceAll("'Segoe UI', Arial, sans-serif", "var(--k-font, 'Segoe UI', Arial, sans-serif)").replaceAll("'Segoe UI', Arial;", "var(--k-font, 'Segoe UI', Arial, sans-serif);");

/** true things about the circuits and the sport (checked), and the game's own keys */
const FACTS = {
  lasvegas: [
    'The Las Vegas Strip Circuit is 6.201 km long with 17 corners. Its longest straight runs down Las Vegas Boulevard, past the casinos.',
    'Formula 1 came back to Las Vegas in November 2023, racing on a Saturday night. Max Verstappen won the first race.',
    'The Sphere is 112 m tall and 157 m wide. Its whole outside is a screen of LEDs.',
  ],
  silverstone: [
    'Silverstone held the first World Championship Grand Prix, on 13 May 1950. Giuseppe Farina won it for Alfa Romeo.',
    'Silverstone began as a Second World War RAF airfield. The first races used its runways and perimeter roads.',
    'Silverstone is 5.891 km long with 18 corners. Maggotts, Becketts and Chapel is one of the fastest sequences of direction changes on the calendar.',
  ],
  montreal: [
    'The Circuit Gilles Villeneuve is 4.361 km long, on Ile Notre-Dame, an island built in the St. Lawrence for Expo 67 from the rock dug out for the Montreal metro.',
    'The wall at the exit of the last chicane is the Wall of Champions: in 1999 Damon Hill, Michael Schumacher and Jacques Villeneuve, three world champions, all hit it in the same race.',
    'The Biosphère, the geodesic dome across the Chenal Le Moyne, was the United States pavilion at Expo 67. Buckminster Fuller designed it.',
  ],
  austin: [
    'The Circuit of the Americas opened in 2012, the first circuit in the United States built for Formula 1. It is 5.513 km long with 20 corners.',
    'The climb to Turn 1 rises about 40 m, a gradient of 11 per cent: the drivers brake for an apex they cannot see over the crest.',
    'The Observation Tower over the Grand Plaza is 77 m tall. Its veil of red steel cables falls from the top to the canopy over the amphitheatre stage.',
  ],
  any: [
    'The fastest pit stop in Formula 1 so far took 1.80 s: McLaren, for Lando Norris, at the 2023 Qatar Grand Prix.',
    'The halo has been mandatory since 2018. It is tested to withstand a load of 125 kN, more than twelve tonnes.',
    'DRS, the opening rear-wing flap for overtaking, was introduced in 2011.',
    'In 2024 a Formula 1 car had to weigh at least 798 kg, driver included.',
    'Drivers can lose two to three kilograms of fluid in a hot race.',
  ],
  tips: [
    'Backspace opens a flashback: scrub back through the last 15 seconds and try again.',
    'T opens the telemetry: your lap against the fastest, corner by corner.',
    'In the pit lane the car drives itself to your box. Press Space as you reach the marker to time the pull-in.',
    'V changes camera. Q and E look left and right, C looks behind.',
    'L shows the racing line. P calls you into the pits and chooses your tyres.',
    'Photo mode saves your shots, and the best of them come back here.',
  ],
};
const GP = { lasvegas: 'Las Vegas Grand Prix', silverstone: 'British Grand Prix', montreal: 'Canadian Grand Prix', austin: 'United States Grand Prix' };
const CIRCUIT = { lasvegas: 'Las Vegas Strip Circuit', silverstone: 'Silverstone Circuit', montreal: 'Circuit Gilles Villeneuve', austin: 'Circuit of the Americas' };
/**
 * The circuit's map (ui/TrackMaps.js), north up: the lap in white on a dark casing, the pit lane dashed, the start line
 * and the way the cars go, every corner's number set off the track to the outside; a red line drawing itself round the
 * lap as the build goes on (Loader.stage), its head glowing.
 */
function mapSVG(id) {
  const M = TRACK_MAPS[id]; if (!M) return '';
  const P = 76, pts = M.pts, n = pts.length, d = `M${pts.map((p) => p.join(' ')).join('L')}Z`;
  let cx = 0, cy = 0; for (const [x, y] of pts) { cx += x / n; cy += y / n; }
  const L0 = M.corners.map(([num, x, y]) => {
    let bi = 0, bd = Infinity; pts.forEach(([px, py], i) => { const q = (px - x) ** 2 + (py - y) ** 2; if (q < bd) { bd = q; bi = i; } });
    const a = pts[(bi + n - 2) % n], b = pts[(bi + 2) % n]; let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let nx = -ty, ny = tx; if ((x - cx) * nx + (y - cy) * ny < 0) { nx = -nx; ny = -ny; }   // (to the outside of the lap)
    return { num, ax: x, ay: y, x: x + nx * 46, y: y + ny * 46 };
  });
  // (corners close together - a chicane, Las Vegas's 14-15-16: the numbers pushed apart until none covers another, each
  //  kept clear of the track and near its corner)
  for (let it = 0; it < 60; it++) {
    for (let i = 0; i < L0.length; i++) for (let j = i + 1; j < L0.length; j++) {
      const A = L0[i], B = L0[j]; let dx = B.x - A.x, dy = B.y - A.y; const d = Math.hypot(dx, dy) || 0.01; if (d >= 46) continue;
      const push = (46 - d) / 2; dx /= d; dy /= d; A.x -= dx * push; A.y -= dy * push; B.x += dx * push; B.y += dy * push;
    }
    for (const Lb of L0) {
      for (let k = 0; k < n; k += 2) { const [px, py] = pts[k], dx = Lb.x - px, dy = Lb.y - py, d = Math.hypot(dx, dy); if (d < 36 && d > 0.01) { Lb.x += (dx / d) * (36 - d) * 0.5; Lb.y += (dy / d) * (36 - d) * 0.5; } }
      const dx = Lb.x - Lb.ax, dy = Lb.y - Lb.ay, d = Math.hypot(dx, dy); if (d > 80) { Lb.x = Lb.ax + (dx / d) * 80; Lb.y = Lb.ay + (dy / d) * 80; }
    }
  }
  const labels = L0.map((Lb) => `<g class="t" transform="translate(${Math.round(Lb.x)} ${Math.round(Lb.y)})"><circle r="21"/><text>${Lb.num}</text></g>`).join('');
  const [sx, sy] = pts[0], c = Math.cos(M.dir), s = Math.sin(M.dir), L = 30;
  const sf = `<line class="sf" x1="${sx + s * L}" y1="${sy - c * L}" x2="${sx - s * L}" y2="${sy + c * L}"/><line class="sf2" x1="${sx + s * L}" y1="${sy - c * L}" x2="${sx - s * L}" y2="${sy + c * L}"/>`;
  const ax = sx + c * 62, ay = sy + s * 62, arrow = `<path class="dir" d="M${ax + c * 22} ${ay + s * 22}L${ax - c * 10 + s * 16} ${ay - s * 10 - c * 16}L${ax - c * 10 - s * 16} ${ay - s * 10 + c * 16}Z"/>`;
  // (three layers: the road; the progress - the worker's canvas, or the page's own line and head where there is no worker; the start line, the arrow and the numbers over it)
  const vbx = `viewBox="${-P} ${-P} ${M.w + 2 * P} ${M.h + 2 * P}" preserveAspectRatio="xMidYMid meet"`;
  return `<svg ${vbx} aria-label="Circuit map"><path class="cas" d="${d}"/>${M.pit.length ? `<path class="pit" d="M${M.pit.map((p) => p.join(' ')).join('L')}"/>` : ''}<path class="trk" d="${d}"/>
    <path class="run" d="${d}" pathLength="1000"/></svg><canvas></canvas><svg ${vbx} aria-hidden="true">${sf}${arrow}${labels}<circle class="head" r="15" cx="${sx}" cy="${sy}"/></svg>`;
}
/**
 * The progress, drawn off the page (a worker with the two canvases handed to it). It is told a figure (pct) and runs
 * the shown one up to it as a damped spring does: away slowly, quickly through the middle, easing in - and while the
 * next figure is awaited it creeps on a little (never past what the next stage will bring), so the line is never
 * quite still. Messages: { map, pts, vb, bar } once; { mapSize, barSize, dpr }; { pct }. It posts { shown } back for
 * the figure in the corner.
 */
const PROG = `
let map = null, bar = null, mc = null, bc = null, pts = [], cum = [0], total = 1, vb = [0, 0, 1, 1], dpr = 1;
let target = 0, shown = 0, vel = 0, tT = 0, last = 0, drawn = -1, posted = 0, dirty = true;
const raf = self.requestAnimationFrame ? (f) => self.requestAnimationFrame(f) : (f) => setTimeout(() => f(performance.now()), 16);
onmessage = (e) => {
  const m = e.data;
  if (m.map) { map = m.map; mc = map.getContext('2d'); pts = m.pts; vb = m.vb; cum = [0]; for (let i = 1; i <= pts.length; i++) { const a = pts[i - 1], b = pts[i % pts.length]; cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); } total = cum[cum.length - 1] || 1; }
  if (m.bar) { bar = m.bar; bc = bar.getContext('2d'); }
  if (m.dpr) dpr = m.dpr;
  if (m.mapSize && map) { map.width = m.mapSize[0]; map.height = m.mapSize[1]; dirty = true; }
  if (m.barSize && bar) { bar.width = m.barSize[0]; bar.height = m.barSize[1]; dirty = true; }
  if (m.pct != null && m.pct > target) { target = m.pct; tT = performance.now(); }
};
function draw() {
  const f = Math.max(0, Math.min(1, shown / 100));
  if (mc && map.width > 2) {
    const W = map.width, H = map.height, s = Math.min(W / vb[2], H / vb[3]), ox = (W - vb[2] * s) / 2 - vb[0] * s, oy = (H - vb[3] * s) / 2 - vb[1] * s, len = total * f;
    mc.setTransform(1, 0, 0, 1, 0, 0); mc.clearRect(0, 0, W, H); mc.setTransform(s, 0, 0, s, ox, oy);
    let hx = pts[0][0], hy = pts[0][1];
    if (len > 0.5) {
      mc.beginPath(); mc.moveTo(hx, hy); let i = 1;
      for (; i < cum.length && cum[i] <= len; i++) { const p = pts[i % pts.length]; mc.lineTo(p[0], p[1]); hx = p[0]; hy = p[1]; }
      if (i < cum.length) { const a = pts[i - 1], b = pts[i % pts.length], u = (len - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]); hx = a[0] + (b[0] - a[0]) * u; hy = a[1] + (b[1] - a[1]) * u; mc.lineTo(hx, hy); }
      mc.lineJoin = 'round'; mc.lineCap = 'round';
      mc.shadowColor = 'rgba(255,63,164,.95)'; mc.shadowBlur = 11 * dpr; mc.strokeStyle = '#ff2d55'; mc.lineWidth = 13; mc.stroke();
      mc.shadowBlur = 0; mc.strokeStyle = 'rgba(255,190,214,.5)'; mc.lineWidth = 3.5; mc.stroke();
    }
    mc.beginPath(); mc.arc(hx, hy, 15, 0, 6.2832); mc.shadowColor = '#ff3fa4'; mc.shadowBlur = 13 * dpr; mc.fillStyle = '#fff'; mc.fill(); mc.shadowBlur = 0;
  }
  if (bc && bar.width > 2) {
    const W = bar.width, H = bar.height, pad = 14 * dpr, x0 = pad, x1 = W - pad, y = H / 2, h = Math.max(2, 3 * dpr), xe = x0 + (x1 - x0) * f;
    bc.setTransform(1, 0, 0, 1, 0, 0); bc.clearRect(0, 0, W, H);
    bc.fillStyle = 'rgba(200,165,255,.16)'; bc.fillRect(x0, y - h / 2, x1 - x0, h);
    if (xe > x0 + 0.5) {
      const g = bc.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#ff3f6e'); g.addColorStop(0.4, '#ff3fa4'); g.addColorStop(0.72, '#9b5cff'); g.addColorStop(1, '#23e5ff');
      bc.shadowColor = 'rgba(255,63,164,.85)'; bc.shadowBlur = 8 * dpr; bc.fillStyle = g; bc.fillRect(x0, y - h / 2, xe - x0, h);
      bc.shadowColor = '#fff'; bc.shadowBlur = 7 * dpr; bc.fillStyle = '#fff'; bc.beginPath(); bc.arc(xe, y, h * 0.9, 0, 6.2832); bc.fill(); bc.shadowBlur = 0;
    }
  }
}
function step(now) {
  const dt = Math.min(0.05, Math.max(0, (now - (last || now)) / 1000)); last = now;
  const end = target >= 100, idle = (now - tT) / 1000, creep = end || target <= 0 ? 0 : Math.min(4.5, 0.9 * idle);
  const goal = Math.max(shown, end ? 100 : Math.min(99, target + creep)), k = end ? 70 : 20, c = 2 * Math.sqrt(k);
  vel += (k * (goal - shown) - c * vel) * dt; if (vel < 0) vel = 0;
  shown = Math.min(goal, shown + vel * dt); if (end && goal - shown < 0.3) shown = goal;
  if (dirty || Math.abs(shown - drawn) > 0.02) { draw(); drawn = shown; dirty = false; }
  if (now - posted > 110) { posted = now; postMessage({ shown }); }
  raf(step);
}
raf(step);
`;
/** the worker started on this loading screen's canvases -> { w, ro, url } | null (no worker here: the page draws the progress itself) */
function progress(el, track, fig) {
  try {
    const bcv = el.querySelector('.ld-barc'), cv = el.querySelector('.ld-map canvas'), box = el.querySelector('.ld-map'), M = TRACK_MAPS[track];
    if (reduced() || typeof Worker === 'undefined' || !bcv || typeof bcv.transferControlToOffscreen !== 'function') return null;
    const url = URL.createObjectURL(new Blob([PROG], { type: 'text/javascript' })), w = new Worker(url), dpr = Math.min(2, window.devicePixelRatio || 1), P = 76;
    el.classList.add('ld-w');   // (its canvases shown - they are measured next - and the page's own line and bar put away)
    const sizes = () => { const m = { dpr }; if (cv && box) { const r = box.getBoundingClientRect(); if (r.width > 4 && r.height > 4) m.mapSize = [Math.round(r.width * dpr), Math.round(r.height * dpr)]; } const b = bcv.getBoundingClientRect(); if (b.width > 4) m.barSize = [Math.round(b.width * dpr), Math.round(b.height * dpr)]; return m; };
    const init = { dpr }, give = [];
    if (M && cv && box) { const o = cv.transferControlToOffscreen(); init.map = o; init.pts = M.pts; init.vb = [-P, -P, M.w + 2 * P, M.h + 2 * P]; give.push(o); }
    { const o = bcv.transferControlToOffscreen(); init.bar = o; give.push(o); }
    w.postMessage(init, give); w.postMessage(sizes());
    const P0 = { w, url, ro: null, dead: false };
    w.onmessage = (e) => { if (!P0.dead && fig && e.data && e.data.shown != null) fig.textContent = `${Math.round(e.data.shown)}%`; };
    w.onerror = () => { P0.dead = true; el.classList.remove('ld-w'); try { w.terminate(); } catch (e) { /* gone */ } };   // (it would not start - a browser that will not run a worker from the page itself: the page draws the progress)
    if (typeof ResizeObserver !== 'undefined') { P0.ro = new ResizeObserver(() => { if (!P0.dead) w.postMessage(sizes()); }); if (box) P0.ro.observe(box); P0.ro.observe(bcv); }
    return P0;
  } catch (e) { el.classList.remove('ld-w'); return null; }
}
const TAGS = { pole: 'Pole position', winner: 'Race winner', grid: 'The grid', crowd: 'The crowd', photo: 'Your photo', aerial: 'Race day' };
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** the loading screen has started to go: body's flag off, and the word to whatever waits behind it (Motion.open) */
function lifting() {
  if (document.body.dataset.loader !== 'on') return;
  document.body.dataset.loader = '';
  // (bubbling, so a listener on the document or on the window both hear it)
  document.dispatchEvent(new Event('loader:hiding', { bubbles: true }));
}

let L = null;
export const Loader = {
  get on() { return !!L; },
  /**
   * o: { track (id), kicker ('ROUND 3 OF 10 · CAREER'), sub: [strings] (conditions, your car),
   *      news: [{ tag, text, color }] } -> a Promise, settled once it covers the screen (the menu behind may go then)
   */
  show(o) {
    if (L) this.kill(L, true);
    ensureMotion();
    if (!document.getElementById('loader-css')) { const st = document.createElement('style'); st.id = 'loader-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = document.createElement('div'); el.id = 'loader';
    const M = TRACK_MAPS[o.track];
    const stats = M ? [[M.km.toFixed(3), 'km'], [M.turns, 'turns'], ...(o.laps ? [[o.laps, 'laps'], [(M.km * o.laps).toFixed(1), 'km race']] : [])] : [];
    el.innerHTML = `<div class="ld-slides"></div><div class="ld-shade"></div>
      <div class="ld-frame">
        <div class="ld-brand"><b>F1</b> SIMULATOR</div>
        <div class="ld-side">
          ${M ? `<div class="ld-card ld-mapcard"><h4>THE CIRCUIT</h4><h5>${esc(CIRCUIT[o.track] || '')}</h5><div class="ld-map">${mapSVG(o.track)}</div>
            <div class="ld-stats">${stats.map(([v, k]) => `<div><b>${esc(v)}</b><small>${esc(k)}</small></div>`).join('')}</div></div>` : ''}
          ${o.news?.length ? `<div class="ld-news"><h4>LATEST</h4>${o.news.slice(0, 4).map((n, i) => `<div class="ld-item" style="animation-delay:${0.45 + i * 0.12}s;${n.color ? `--c:${esc(n.color)}` : ''}">${n.tag ? `<small>${esc(n.tag)}</small>` : ''}${esc(n.text)}</div>`).join('')}</div>` : ''}
        </div>
        <div class="ld-main"><div class="ld-kick">${esc(o.kicker || '')}</div><h1>${esc(GP[o.track] || o.title || 'Grand Prix').replace(/ (Grand Prix)$/, ' <span>$1</span>')}</h1><div class="ld-sub">${(o.sub || []).filter(Boolean).map((s) => `<span>${esc(s)}</span>`).join('')}</div><div class="ld-err"></div></div>
        <div class="ld-foot"><div class="ld-row"><div class="ld-fact"></div><div class="ld-cap"></div></div><div class="ld-bar"><i></i><canvas class="ld-barc"></canvas></div><div class="ld-stage"><span>Getting ready</span><b>0%</b></div></div>
      </div>`;
    document.body.appendChild(el);
    L = { el, t0: performance.now(), slides: [], k: -1, timers: [], urls: [], pct: 0, shown: 0, raf: 0, prog: null };
    L.prog = progress(el, o.track, el.querySelector('.ld-stage b'));
    document.body.dataset.loader = 'on';
    requestAnimationFrame(() => el.classList.add('on')); setTimeout(() => el.classList.add('on'), 30);
    // (opaque once the 260 ms fade has played, from the frame it began on)
    const shown = new Promise((res) => setTimeout(res, reduced() ? 40 : 300));
    // the facts: this circuit's first, then the sport's, a key or two; a new one every 7 s
    const facts = [...shuffle([...(FACTS[o.track] || [])]), ...shuffle([...FACTS.any]).slice(0, 2), ...shuffle([...FACTS.tips]).slice(0, 2)];
    let f = 0; const fe = el.querySelector('.ld-fact');
    const fact = () => { const tip = FACTS.tips.includes(facts[f % facts.length]); fe.style.opacity = 0; setTimeout(() => { fe.innerHTML = `<b>${tip ? 'TIP' : 'DID YOU KNOW'}</b>${esc(facts[f++ % facts.length])}`; fe.style.opacity = 1; }, 250); };
    fact(); L.timers.push(setInterval(fact, 7000));
    // the pictures: yours from this circuit first, then yours from anywhere, then the game's own
    const mine = L;
    Gallery.list().then((shots) => {
      if (L !== mine) { shots.forEach((s) => URL.revokeObjectURL(s.url)); return; }
      L.urls = shots.map((s) => s.url);
      const here = shots.filter((s) => s.track === o.track), else_ = shots.filter((s) => s.track !== o.track);
      const own = BUILTIN_SHOTS.filter((s) => s.track === o.track), rest = BUILTIN_SHOTS.filter((s) => s.track !== o.track);
      const list = [...shuffle(here).slice(0, 8), ...shuffle(own), ...shuffle(else_).slice(0, 3), ...shuffle(rest)];
      this._slides(list.length ? list : BUILTIN_SHOTS);
    });
    return shown;
  },
  _slides(list) {
    const box = L.el.querySelector('.ld-slides'), cap = L.el.querySelector('.ld-cap');
    L.slides = list.map((s, i) => { const d = document.createElement('div'); d.className = `ld-slide${i % 2 ? ' alt' : ''}`; d.style.backgroundImage = `url("${s.url}")`; box.appendChild(d); return { d, s }; });
    const next = () => {
      if (!L || !L.slides.length) return;
      const prev = L.slides[L.k]; L.k = (L.k + 1) % L.slides.length; const cur = L.slides[L.k];
      // (restart the drift on the new one)
      cur.d.classList.remove('on'); void cur.d.offsetWidth; cur.d.classList.add('on');
      if (prev && prev !== cur) setTimeout(() => prev.d.classList.remove('on'), 1700);
      const s = cur.s, when = s.at ? new Date(s.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '';
      cap.style.opacity = 0; setTimeout(() => { cap.textContent = s.caption || [TAGS[s.tag], s.at ? `your shot, ${when}` : ''].filter(Boolean).join(' · '); cap.style.opacity = 1; }, 400);
    };
    next(); L.timers.push(setInterval(next, 6000));
  },
  /**
   * the build's progress: what it is doing, how far (0-100). The bar, the red line round the map, its head and the
   * figure are one value, eased toward it frame by frame (_draw) - none of them with a CSS transition of its own: the bar's
   * ran on the compositor while the build held the page, so it went on moving while the map's waited, and the two never
   * agreed (the line half the time behind it)
   */
  stage(text, pct) {
    if (!L) return;
    if (pct != null) L.pct = Math.max(L.pct, pct);
    L.el.querySelector('.ld-stage span').textContent = text || '';
    if (L.prog && !L.prog.dead) { L.prog.w.postMessage({ pct: L.pct }); return; }   // (the worker runs up to it)
    if (!L.raf) { const mine = L, tick = () => { if (L !== mine) return; const d = mine.pct - mine.shown; mine.shown = Math.abs(d) < 0.05 ? mine.pct : mine.shown + d * 0.18; this._draw(mine); mine.raf = mine.shown !== mine.pct ? requestAnimationFrame(tick) : 0; }; L.raf = requestAnimationFrame(tick); }
    if (pct >= 100) { L.shown = L.pct; this._draw(L); }
  },
  _draw(l) {
    const f = Math.min(1, l.shown / 100);
    l.el.querySelector('.ld-stage b').textContent = `${Math.round(l.shown)}%`;
    l.el.querySelector('.ld-bar i').style.transform = `scaleX(${f.toFixed(4)})`;
    // (the map: the red line round the lap as far as the bar, its head at the end of it - the same fraction of the lap)
    const run = l.el.querySelector('.ld-map .run'), trk = l.el.querySelector('.ld-map .trk'), head = l.el.querySelector('.ld-map .head');
    if (run) run.style.strokeDashoffset = `${(1000 * (1 - f)).toFixed(2)}`;
    if (trk && head) { try { const p = trk.getPointAtLength(trk.getTotalLength() * Math.min(0.9999, f)); head.setAttribute('cx', p.x); head.setAttribute('cy', p.y); } catch (e) { /* (not laid out yet) */ } }
  },
  /** it went wrong: the reason, and a way back (back()) */
  fail(msg, back) {
    if (!L) return; const e = L.el.querySelector('.ld-err');
    e.innerHTML = `${esc(msg)} <button>BACK</button>`; e.querySelector('button').onclick = () => { this.kill(); back?.(); };
  },
  /** done: the bar to the end, then (after at least a moment on screen) the fade */
  async hide(minMs = 1400) {
    if (!L) return; const mine = L;
    this.stage('Ready', 100);
    const left = minMs - (performance.now() - mine.t0); if (left > 0) await new Promise((r) => setTimeout(r, left));
    if (L !== mine) return;
    // (the fade and the word go together: the sheet waiting behind arrives while this lifts)
    lifting();
    mine.el.classList.remove('on'); mine.el.classList.add('off'); setTimeout(() => this.kill(mine), reduced() ? 0 : 300);
  },
  /** gone at once (quiet: a new loading screen takes its place, so nothing waiting behind is told it lifted) */
  kill(which = L, quiet = false) {
    if (!which) return;
    for (const t of which.timers) clearInterval(t); if (which.raf) cancelAnimationFrame(which.raf);
    if (which.prog) { which.prog.dead = true; try { which.prog.ro?.disconnect(); which.prog.w.terminate(); URL.revokeObjectURL(which.prog.url); } catch (e) { /* gone */ } }
    which.el.remove(); for (const u of which.urls) URL.revokeObjectURL(u);
    // (gone without a fade - a failed build, a scene of its own: nothing may go on waiting for it)
    if (L === which) { L = null; if (!quiet) lifting(); }
  },
};
/** a moment for the page to paint (the build holds it between stages): a frame, or 60 ms if no frame comes */
export function paint() { return new Promise((r) => { let done = false; const f = () => { if (!done) { done = true; r(); } }; requestAnimationFrame(() => setTimeout(f, 0)); setTimeout(f, 60); }); }
