// The driver career's hub in the team principal's look (ui/CareerHub.js keeps its pages, its router and its studio;
// this puts them on the HQ's ground): the HQ's own stylesheet (ui/HQKit.js HQ_CSS - its colours, its four grounds with
// VICE the one it opens on, the team's colour as the accent, its buttons, its panels and their parts) on #career; the
// frame laid out as the HQ's - a bar across the top, a rail down the left in groups with the HQ's line icons, the
// stage, the side card on the right - and every page's own stylesheet (written for the old white hub) moved onto the
// HQ's colours by what each colour IS (hqSkin: a white ground becomes the panel, a near-black ink the ink, a grey line
// the line, a team or tyre colour stays). The 3D studio shows only where your looks are being changed.

import { HQ_CSS, ICON, themeApply } from './HQKit.js';
import { MAIL_CSS } from './ManagerMail.js';
import { SCENE_CSS } from './ViceScene.js';

const P = (d) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${d}"/></svg>`;
/** the rail's icons, by section (the HQ's own where one fits) */
export const DRV_ICON = {
  mail: ICON.mail, race: ICON.cal, team: ICON.fac, driver: ICON.drv, life: ICON.people, media: P('M2.5 3.5h11v7H7.5l-3 2.5v-2.5h-2zM5 6.2h6M5 8.2h4'),
  season: ICON.stand, stats: P('M2.5 13.5h11M4 11V8M7 11V5M10 11V7M13 11V3'), lost: P('M8 2v12M4.5 5.5h7'),
};
/** the rail's groups: [title, [section keys]] (In Memoriam alone at the foot) */
export const DRV_GROUPS = [['WEEKEND', ['mail', 'race']], ['CAREER', ['team', 'driver']], ['OFF TRACK', ['life', 'media']], ['RECORD', ['season', 'stats']]];

// ---- the skin: a stylesheet for a white page onto the HQ's colours --------------------------------------------------
const toRGB = (s) => {
  let m = /^#([0-9a-f]{3,8})$/i.exec(s);
  if (m) { let x = m[1]; if (x.length === 3 || x.length === 4) x = x.replace(/./g, '$&$&'); return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16), x.length === 8 ? parseInt(x.slice(6, 8), 16) / 255 : 1]; }
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(s);
  return m ? [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]] : null;
};
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const alpha = (v, a) => (a >= 0.999 ? v : `color-mix(in srgb, ${v} ${Math.round(a * 100)}%, transparent)`);
/** one colour, by the part it plays (bg | fg | line | any) */
function skinColour(tok, role) {
  const c = toRGB(tok); if (!c) return tok;
  const [r, g, b, a] = c, chroma = Math.max(r, g, b) - Math.min(r, g, b), L = lum(c);
  if (/^#e10600$|^#f0150c$/i.test(tok)) return 'var(--ac)';   // (the old hub's red: the HQ's accent - the team's colour)
  if (chroma > 70) return tok;   // (a team's, a tyre's, a state's colour: as it is)
  if (role === 'fg') return L < 0.06 ? alpha('var(--ink)', a) : L < 0.2 ? alpha('var(--dim)', a) : L < 0.6 ? alpha('var(--mute)', a) : tok;
  if (role === 'line') return L > 0.5 ? alpha('var(--line2)', Math.max(0.6, a)) : tok;
  if (role === 'bg') return L > 0.82 ? alpha('var(--panel)', a) : L > 0.45 ? alpha('var(--panel2)', a) : L < 0.05 ? alpha('color-mix(in srgb, var(--ac) 82%, var(--panel))', a) : tok;
  return L > 0.82 ? alpha('var(--panel)', a) : L < 0.06 ? alpha('var(--ink)', a) : tok;
}
const COL = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;
/** the stylesheet's colours onto the HQ's (white text on a colour stays white: a pure white in a colour rule is kept) */
export function hqSkin(css) {
  return css.replace(/([\w-]+)\s*:\s*([^;{}]+)/g, (m, prop, val) => {
    if (!COL.test(val)) { COL.lastIndex = 0; return m; } COL.lastIndex = 0;
    const p = prop.toLowerCase(), role = /^(background|background-color|background-image)$/.test(p) ? 'bg' : /^(color|fill|stroke|caret-color|-webkit-text-fill-color)$/.test(p) ? 'fg'
      : /^(border|outline|box-shadow)|^border-/.test(p) ? 'line' : p.startsWith('--') ? 'any' : p === 'text-shadow' ? 'keep' : 'any';
    if (role === 'keep') return m;
    return `${prop}: ${val.replace(COL, (t) => (role === 'fg' && /^#fff(fff)?$/i.test(t) ? t : skinColour(t, role)))}`;
  });
}

// ---- the HQ's stylesheet on #career, and the frame in the HQ's places -----------------------------------------------
const HQ_ON_CAREER = (HQ_CSS + MAIL_CSS).replace(/#mgr\b/g, '#career');   // (and its mail client's: ui/ManagerMail.js)
const FRAME = `
/* (the HQ's root rule laid the HQ out as a grid: the career's own frame is placed by hand, the studio and the UI over it) */
#career[data-hq] { z-index: 40; display: block; grid-template: none; }
#career[data-hq] > .ch-3d, #career[data-hq] > .ch-ui { position: absolute; inset: 0; }
#career[data-hq] > .ch-ui { z-index: 2; }
#career[data-hq] .ch-3d { opacity: 0; pointer-events: none; transition: opacity .4s ease; }
#career[data-hq][data-studio] .ch-3d { opacity: 1; pointer-events: auto; }
#career[data-hq][data-studio]::before, #career[data-hq][data-studio]::after { opacity: 0; }
#career[data-hq] { --top: 64px; --rail: 196px; --pad: 0px; --gap: 10px; }
/* the bar */
#career[data-hq] .ch-top { left: 0; right: 0; top: 0; height: 64px; border-radius: 0; padding: 0 16px 0 0; gap: 14px; border: 0; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--bg2) 86%, transparent); box-shadow: none; backdrop-filter: blur(8px); z-index: 3; }
#career[data-hq][data-tone="vice"] .ch-top::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: linear-gradient(90deg, var(--n1), var(--n3) 45%, var(--n2)); box-shadow: 0 0 12px rgba(255,63,164,.7), 0 0 26px rgba(35,229,255,.35); opacity: .9; }
#career[data-hq] .ch-top .ch-badge { width: 34px; height: 34px; margin-left: 14px; border-radius: 9px; background: linear-gradient(140deg, var(--tc), color-mix(in srgb, var(--tc) 55%, var(--tc2))); color: #fff; box-shadow: 0 0 0 1px rgba(255,255,255,.18) inset, 0 6px 16px -6px var(--tc); font: 900 13px/34px var(--f); text-align: center; }
#career[data-hq] .ch-title { width: 148px; flex: none; min-width: 0; } #career[data-hq] .ch-title h1 { font: 800 14px/1.1 var(--f); letter-spacing: .02em; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career[data-hq] .ch-title small { font: 700 9px/1.3 var(--f); letter-spacing: .07em; text-transform: uppercase; color: var(--mute); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
#career[data-hq] .ch-pill { background: color-mix(in srgb, var(--panel2) 80%, transparent); border: 1px solid var(--line2); color: var(--ink); border-radius: 8px; font: 700 11.5px/1 var(--f); }
#career[data-hq] .ch-ico { color: var(--dim); }
/* the rail: the HQ's - groups, line icons, the light that slides to the page */
#career[data-hq] .ch-rail { left: 0; top: 64px; bottom: 0; width: 196px; padding: 10px 8px; gap: 0; border-radius: 0; border: 0; border-right: 1px solid var(--line); background: color-mix(in srgb, var(--bg2) 70%, transparent); box-shadow: none; overflow: hidden auto; scrollbar-width: none; }
#career[data-hq][data-tone="vice"] .ch-rail { background: linear-gradient(180deg, rgba(19,10,44,.82), rgba(28,12,58,.7)); border-right-color: rgba(200,165,255,.14); }
#career[data-hq] .ch-rail h5 { margin: 9px 10px 4px; font: 800 8.5px/1 var(--f); letter-spacing: .22em; color: var(--mute); } #career[data-hq] .ch-rail h5:first-of-type { margin-top: 2px; }
#career[data-hq][data-tone="vice"] .ch-rail h5 { color: #8f7cc4; }
#career[data-hq] .ch-rail button { flex-direction: row; justify-content: flex-start; gap: 10px; width: 100%; height: 30px; min-height: 30px; padding: 0 10px; border: 0; border-radius: 8px; background: transparent; color: var(--dim); font: 600 12.5px/1 var(--f); letter-spacing: .01em; text-transform: none; box-shadow: none; }
#career[data-hq] .ch-rail button > i { font-style: normal; display: inline-flex; width: 16px; height: 16px; margin: 0; font-size: 0; }
#career[data-hq] .ch-rail button svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.35; stroke-linecap: round; stroke-linejoin: round; opacity: .8; }
#career[data-hq] .ch-rail button:hover:not(:disabled) { background: color-mix(in srgb, var(--ink) 6%, transparent); color: var(--ink); transform: none; }
#career[data-hq] .ch-rail button.on { color: var(--ink); font-weight: 800; background: transparent; }
#career[data-hq] .ch-rail button.on svg { color: var(--ac); opacity: 1; }
#career[data-hq][data-tone="vice"] .ch-rail button.on { text-shadow: 0 0 12px rgba(255,160,215,.75); } #career[data-hq][data-tone="vice"] .ch-rail button.on svg { color: var(--n2); filter: drop-shadow(0 0 5px var(--n2)); }
#career[data-hq] .ch-rail .ind { left: 8px; right: 8px; width: auto; height: 30px; border-radius: 8px; background: color-mix(in srgb, var(--ac) 16%, transparent); box-shadow: inset 3px 0 0 var(--ac); }
#career[data-hq][data-tone="vice"] .ch-rail .ind { background: linear-gradient(90deg, rgba(255,63,164,.24), rgba(155,92,255,.10)); box-shadow: inset 3px 0 0 var(--n1), 0 0 18px -6px var(--n1); }
#career[data-hq] .ch-rail button em { position: static; margin-left: auto; min-width: 17px; height: 17px; padding: 0 5px; border-radius: 9px; display: grid; place-items: center; font: 800 9.5px/1 var(--f); font-style: normal; background: var(--ac); color: var(--ac-ink); }
#career[data-hq][data-tone="vice"] .ch-rail button em { background: var(--n1); color: #fff; box-shadow: 0 0 10px var(--n1); }
#career[data-hq] .ch-rail .sp { flex: 1; } #career[data-hq] .ch-rail .dv { display: none; }
/* the stage: no sheet of its own - the panels stand on the ground, as the HQ's do */
#career[data-hq] .ch-panel { left: 196px; top: 64px; bottom: 0; right: 0; width: auto; padding: 14px 16px 16px; border: 0; border-radius: 0; background: transparent; box-shadow: none; }
/* (no side card: the HQ has none - what it said is on the pages and the bar - and the stage has the width) */
#career[data-hq] .ch-side { display: none !important; }
#career[data-hq] .glass { background: linear-gradient(180deg, color-mix(in srgb, var(--panel) 96%, transparent), color-mix(in srgb, var(--panel) 88%, transparent)); border: 1px solid var(--line); box-shadow: 0 10px 30px -18px rgba(0,0,0,.6); }
#career[data-hq][data-tone="vice"] .glass, #career[data-hq][data-tone="vice"] .ch-pages :is(.tile, .dcard, .seat, .cl-card, .obj, .chart, .tro, .lostcard, .review, .wk-alw, .al, .st-rw, .rs-row, .teamrow) { border: 1px solid transparent; background: linear-gradient(180deg, rgba(27,16,58,.93), rgba(20,11,45,.9)) padding-box, linear-gradient(140deg, rgba(255,63,164,.45), rgba(155,92,255,.14) 38%, rgba(155,92,255,.1) 62%, rgba(35,229,255,.4)) border-box; box-shadow: 0 14px 34px -20px rgba(0,0,0,.8); }
#career[data-hq][data-tone="vice"] .ch-top.glass, #career[data-hq][data-tone="vice"] .ch-rail.glass, #career[data-hq] .ch-panel.glass { background: transparent; border-color: transparent; box-shadow: none; }
#career[data-hq][data-tone="vice"] .ch-top.glass { background: color-mix(in srgb, var(--bg2) 86%, transparent); }
#career[data-hq][data-tone="vice"] .ch-rail.glass { background: linear-gradient(180deg, rgba(19,10,44,.82), rgba(28,12,58,.7)); }
#career[data-hq] .ch-pages :is(h2, h3, h4) { color: var(--ink); }
#career[data-hq] .ch-head .k-seg, #career[data-hq] .ch-sub { background: color-mix(in srgb, var(--panel2) 80%, transparent); border: 1px solid var(--line2); }
#career[data-hq] .ch-sub button.on, #career[data-hq] .ch-sub button.sel { color: var(--ac-ink); }
#career[data-hq] .ch-sub::before { background: var(--ac) !important; }
`;
/* (the driver hub's own cards as the HQ's panels on VICE: smoked glass, the tubes) */
const VICE_CARDS = `
/* (the menus off the bar - the race caret, the gear: a pane of dark glass with a neon tube round it, every line readable) */
#career[data-hq] .k-pop { background: linear-gradient(180deg, rgba(24,12,48,.97), rgba(14,7,32,.97)) padding-box, linear-gradient(140deg, #ff3fa4, rgba(155,92,255,.55) 45%, #23e5ff) border-box !important;
  border: 2px solid transparent !important; border-radius: 14px; color: #f4ecff !important; box-shadow: 0 18px 44px -14px rgba(0,0,0,.85), 0 0 18px 0 rgba(255,63,164,.55), 0 0 42px -4px rgba(255,63,164,.45), 0 0 60px -10px rgba(35,229,255,.5) !important; backdrop-filter: blur(14px) saturate(1.3); }
#career[data-hq] .k-pop::before { content: ''; position: absolute; left: 14px; right: 14px; top: -1px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff3fa4, #23e5ff, transparent); box-shadow: 0 0 12px #ff3fa4, 0 0 22px rgba(35,229,255,.7); pointer-events: none; }
#career[data-hq] .k-pop .pop-row b { color: #ffffff !important; text-shadow: 0 0 10px rgba(255,63,164,.55); }
#career[data-hq] .k-pop .pop-row small { color: #c9b8ec !important; }
#career[data-hq] .k-pop .pop-row { border-radius: 10px; transition: background .15s, box-shadow .15s; }
#career[data-hq] .k-pop .pop-row:hover:not(:disabled), #career[data-hq] .k-pop .pop-row:focus-visible { background: linear-gradient(90deg, rgba(255,63,164,.22), rgba(35,229,255,.12)) !important; box-shadow: inset 0 0 0 1px rgba(255,63,164,.6), 0 0 16px -4px rgba(255,63,164,.8) !important; }
#career[data-hq] .k-pop .pop-row:hover:not(:disabled) b { text-shadow: 0 0 8px #fff, 0 0 16px #ff3fa4; }
#career[data-hq] .k-pop .pop-row.danger b, #career[data-hq] .k-pop .pop-row.k-armed { color: #ff5a7a !important; }
#career[data-hq] .k-pop .pop-note { color: #ffd1f0 !important; border-bottom: 1px solid rgba(255,63,164,.35) !important; }
#career[data-hq] .k-pop .pop-sec { border-bottom: 1px solid rgba(255,63,164,.3) !important; color: #e8dcff; }
#career[data-hq] .k-pop hr, #career[data-hq] .k-pop .pop-sep { border-color: rgba(255,63,164,.3) !important; background: rgba(255,63,164,.3) !important; }

#career[data-hq][data-tone="vice"] .ch-pages :is(.tile, .dcard, .seat, .cl-card, .obj, .chart, .tro, .lostcard, .review, .wk-alw, .al, .st-rw, .rs-row, .teamrow), #career[data-hq][data-tone="vice"] .glass:not(.ch-top):not(.ch-rail):not(.ch-panel) {
  background: linear-gradient(180deg, rgba(27,16,58,.80), rgba(20,11,45,.76)) padding-box, linear-gradient(140deg, rgba(255,63,164,.75), rgba(155,92,255,.2) 38%, rgba(155,92,255,.16) 62%, rgba(35,229,255,.7)) border-box;
  box-shadow: 0 14px 34px -20px rgba(0,0,0,.8), 0 0 18px -10px rgba(255,63,164,.7), 0 0 24px -14px rgba(35,229,255,.55); backdrop-filter: blur(10px) saturate(1.25); }
#career[data-hq] .ch-ui > .q-theme { top: 70px; right: 14px; }
/* (RACE WEEK > Briefing in panels: the circuit as a neon tube, the race-day boxes under it, the figures, the targets, the week, the calendar) */
#career[data-hq] .dbr { height: 100%; }
#career[data-hq] .dbr .q-pb { padding: 10px 14px 12px; display: flex; flex-direction: column; min-height: 0; }
#career[data-hq] .dbr-next { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 14px; align-items: center; }
#career[data-hq] .dbr-map { height: 100%; min-height: 0; display: grid; place-items: center; }
#career[data-hq] .dbr-map svg { width: 100%; height: 100%; max-height: 300px; overflow: visible; }
#career[data-hq] .dbr-map path { fill: none; stroke-linejoin: round; stroke-linecap: round; vector-effect: non-scaling-stroke; }
#career[data-hq] .dbr-map path.g { stroke: var(--ac); stroke-width: 9; opacity: .25; filter: blur(4px); }
#career[data-hq] .dbr-map path.t { stroke: var(--ac); stroke-width: 3.2; filter: drop-shadow(0 0 6px var(--ac)); stroke-dasharray: 1; stroke-dashoffset: 1; animation: dbrDraw 1.6s var(--ease) .15s forwards; }
#career[data-hq][data-tone="vice"] .dbr-map path.t { stroke: #ff3fa4; filter: drop-shadow(0 0 5px #ff3fa4) drop-shadow(0 0 14px rgba(35,229,255,.6)); }
@keyframes dbrDraw { to { stroke-dashoffset: 0; } }
#career[data-hq] .dbr-tt b { display: block; font: 900 30px/1.05 var(--f); letter-spacing: .01em; color: var(--ink); text-transform: uppercase; }
#career[data-hq][data-tone="vice"] .dbr-tt b { color: #fff; text-shadow: 0 0 10px rgba(255,63,164,.9), 0 0 26px rgba(255,63,164,.5), 0 0 40px rgba(35,229,255,.35); }
#career[data-hq] .dbr-tt small { display: block; margin-top: 10px; font-size: 13px; line-height: 1.45; color: var(--dim); }
#career[data-hq] .dbr-boxes { flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 10px; }
#career[data-hq] .dbr .tiles, #career[data-hq] .dbr .wk-tiles { height: 100%; display: grid; grid-auto-flow: row; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: minmax(0, 1fr); gap: 8px; }
#career[data-hq] .dbr .wk-brief { height: auto; grid-template-columns: repeat(4, minmax(0, 1fr)); }
#career[data-hq] .dbr .wk-brief > div { min-height: 64px; }
#career[data-hq] .dbr .obj span, #career[data-hq] .dbr .wk-al span { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
#career[data-hq] .dbr .obj, #career[data-hq] .dbr .wk-al { display: flex; flex-direction: column; gap: 6px; }
#career[data-hq] .dbr .q-p:last-child .q-pb > * { height: 100%; }

#career[data-hq][data-tone="vice"] .ch-title h1 { text-shadow: 0 0 10px rgba(255,63,164,.65); }
`;
/** the driver hub's whole stylesheet: its own on the HQ's colours, then the HQ's, then the frame */
export const driverHQCSS = (own) => `${hqSkin(own)}\n${HQ_ON_CAREER}\n${FRAME}\n${SCENE_CSS('#career')}\n${VICE_CARDS}`;
/** the HQ's colours onto the hub (the team's colour the accent, the ground kept for the team - ui/HQKit.js) */
export function driverTheme(el, c) {
  const t = c?.team || c?.teams?.[c?.myTeam] || null;
  el.dataset.hq = '1'; themeApply(el, t?.name || 'driver', t?.color || '#e10600', t?.color2);
}
