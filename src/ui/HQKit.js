// The team principal's HQ, its look and its parts (ui/ManagerHub.js and its page files build every page from these).
// Made for a laptop's screen: the whole HQ is laid out on a 1366 x 768 sheet and scaled to the window (never below
// it), so a page is designed once and is the same everywhere. The sheet: a bar across the top (the team, the season,
// the four figures that matter every day, the weekend's buttons), a rail down the left (every page, in five groups),
// and the STAGE - a twelve-column grid whose rows share the height, so a page fills the screen exactly and nothing
// scrolls but the inside of a panel that holds a long list.
//   panel / kv / meter / ring / seg / person / stat / tag / info: the parts.   NAV, ICON: the rail.
//   themeOf / themeSet / themeApply: the colours - the accent from the team's own (its first or second colour, or one
//   picked), on one of three grounds (MIDNIGHT, CARBON, DAYLIGHT), remembered for each team.
//   techSkin(css): the factory's tech tree (ui/HubTech.js, drawn for a white page) put onto the same colours.
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const money = (m) => `$${(Math.round(m * 10) / 10).toFixed(1)}M`;
export const pct = (x) => `${Math.round(x * 100)}%`;
export const sur = (n) => String(n || '').trim().split(/\s+/).pop();

// ---- the parts ------------------------------------------------------------------------------------------------------
/** a panel of the stage: o.w columns of twelve (default 4), o.h rows (default 1); o.sub beside the title, o.act buttons in its head, o.info a note behind an (i), o.scroll: its body scrolls, o.k: a key (its scroll is kept across a redraw) */
export const panel = (title, body, o = {}) => `<section class="q-p${o.cls ? ` ${o.cls}` : ''}" style="grid-column:span ${o.w || 4};grid-row:span ${o.h || 1}${o.style ? `;${o.style}` : ''}">
  <header><h3>${title}</h3>${o.sub ? `<small>${o.sub}</small>` : ''}<span class="q-hx">${o.act || ''}${o.info ? info(o.info) : ''}</span></header><div class="q-pb${o.scroll === false ? '' : ' q-sc'}${o.pad === false ? ' q-np' : ''}"${o.k ? ` data-k="${o.k}"` : ''}>${body}</div></section>`;
/** a note behind an (i): shown on hover or focus, never taking room on the page */
export const info = (t) => `<span class="q-i" tabindex="0" aria-label="How this works">i<span class="q-tip">${t}</span></span>`;
/** a label and its value on a line */
export const kv = (k, v, cls = '') => `<div class="q-kv${cls ? ` ${cls}` : ''}"><span>${k}</span><b>${v}</b></div>`;
/** a bar, 0..1; col: its colour (default: by its value - o.inv: a high value is the bad one) */
export const meter = (x, col, o = {}) => { const v = Math.max(0, Math.min(1, x || 0)), g = o.inv ? 1 - v : v; return `<div class="q-m${o.thin ? ' thin' : ''}" style="--mc:${col || (g > 0.66 ? 'var(--good)' : g > 0.4 ? 'var(--warn)' : 'var(--bad)')}"><i style="width:${(v * 100).toFixed(0)}%"></i></div>`; };
/** a ring with a number in it (a rating out of 100): v 0..1 */
export const ring = (v, o = {}) => `<div class="q-ring${o.big ? ' big' : ''}${o.sm ? ' sm' : ''}" style="--p:${Math.round(Math.max(0, Math.min(1, v || 0)) * 100)}${o.col ? `;--rc:${o.col}` : ''}"><b>${o.text ?? Math.round((v || 0) * 100)}</b></div>`;
/** a choice of a few: buttons in a row, the current one lit (data-a, data-v as the pages' clicks read them) */
export const seg = (a, cur, opts) => `<span class="q-seg">${opts.map(([v, n, t]) => `<button data-a="${a}" data-v="${esc(v)}" class="${String(cur) === String(v) ? 'on' : ''}"${t ? ` title="${esc(t)}"` : ''}>${esc(n)}</button>`).join('')}</span>`;
/** a person (or a thing) on a row: a ring or a mark, a name, a line under it, buttons at the end */
export const person = (o) => `<div class="q-row${o.cls ? ` ${o.cls}` : ''}">${o.rt != null ? ring(o.rt, { sm: o.sm, col: o.col }) : o.mark || ''}<div class="q-rn"><b>${o.name}</b>${o.sub ? `<small>${o.sub}</small>` : ''}${o.under || ''}</div>${o.act ? `<span class="q-acts">${o.act}</span>` : ''}</div>`;
/** a figure with its label over it */
export const stat = (k, v, sub = '', cls = '') => `<div class="q-st${cls ? ` ${cls}` : ''}"><small>${k}</small><b>${v}</b>${sub ? `<em>${sub}</em>` : ''}</div>`;
export const tag = (t, cls = '') => `<i class="q-tag${cls ? ` ${cls}` : ''}">${t}</i>`;
export const sw = (col) => `<i class="q-sw" style="background:${col || '#888'}"></i>`;
export const empty = (t) => `<p class="q-em">${t}</p>`;

// ---- the rail: every page, in its group --------------------------------------------------------------------------------
export const NAV = [
  ['TEAM', [['home', 'Overview'], ['story', 'Inbox'], ['stand', 'Standings'], ['cal', 'Calendar']]],
  ['CAR', [['fac', 'Factory'], ['car', 'Design'], ['parts', 'Parts']]],
  ['PEOPLE', [['drv', 'Drivers'], ['people', 'Morale'], ['staff', 'Staff'], ['crew', 'Pit crew'], ['academy', 'Academy']]],
  ['BUSINESS', [['fin', 'Finances'], ['spons', 'Sponsors'], ['facil', 'Facilities']]],
  ['PADDOCK', [['rivals', 'Rivals'], ['market', 'Market']]],
];
const P = (d) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${d}"/></svg>`;
export const ICON = {
  home: P('M2 7.5 8 2.5l6 5M3.5 6.5V13h3.2V9.5h2.6V13h3.2V6.5'), story: P('M2 4h12v8H2zM2 4.5l6 4.2 6-4.2'), stand: P('M3 13V8.5M8 13V3M13 13V6'), cal: P('M2.5 4h11v9h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3'),
  fac: P('M2 13V7l3.5 2V7L9 9V4h4.5v9z'), car: P('M2 10.5h12M3.5 10.5 5 6.5h6l1.5 4M4.5 12.5v-2M11.5 12.5v-2'), parts: P('M8 5.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM8 1.8v2M8 12.2v2M1.8 8h2M12.2 8h2M3.6 3.6 5 5M11 11l1.4 1.4M12.4 3.6 11 5M5 11l-1.4 1.4'),
  drv: P('M8 2.5a5.5 5.5 0 0 0-5.5 5.5v2.5h11V8A5.5 5.5 0 0 0 8 2.5zM6 8h7.4M2.5 10.5v1.5h8'), people: P('M8 13.2s-5-2.9-5-6.4a2.7 2.7 0 0 1 5-1.4 2.7 2.7 0 0 1 5 1.4c0 3.5-5 6.4-5 6.4z'), staff: P('M5.5 7.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM1.8 13c.3-2.4 1.8-3.6 3.7-3.6S8.9 10.600 9.2 13M11 7.6a1.8 1.8 0 1 0 0-3.600M11.300 9.600c1.600.2 2.600 1.300 2.900 3.400'),
  crew: P('M4 2.5 6.5 5 5 6.5 2.500 4a3 3 0 0 0 4 3.600l5.200 5.200 1.500-1.500L8 6.100A3 3 0 0 0 4 2.500z'), academy: P('M1.500 6 8 3l6.500 3L8 9zM4 7.300V11c1 .900 2.400 1.400 4 1.400s3-.500 4-1.400V7.300M14.500 6v4'),
  fin: P('M8 1.800v12.400M11 4.500c-.500-.900-1.600-1.400-3-1.400-1.700 0-3 .800-3 2.200 0 3 6.200 1.400 6.200 4.500 0 1.400-1.400 2.300-3.200 2.300-1.600 0-2.800-.600-3.300-1.600'), spons: P('M2.500 9.500 6 6l2.500 2.500L13.500 3.500M10 3.500h3.500V7M2.500 13h11'), facil: P('M2.500 13.500v-8l5.500-3 5.500 3v8zM6 13.500v-4h4v4M5.500 7h1M9.500 7h1'),
  rivals: P('M3 2.500v11M3 3.200h9l-2 2.800 2 2.800H3'), market: P('M2.500 5.500h9l-2.200-2.200M13.500 10.500h-9l2.200 2.200'),
};

// ---- the colours ------------------------------------------------------------------------------------------------------
const KEY = 'f1sim-hq-theme';
export const TONES = { midnight: 'Midnight', carbon: 'Carbon', daylight: 'Daylight' };
export const ACCENTS = ['#ff2d55', '#ff8a00', '#ffd400', '#2ee6a6', '#19c8ff', '#4d7cff', '#b98cff', '#ffffff'];
const all = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } };
/** the theme kept for a team -> { accent: 'team' | 'team2' | '#rrggbb', tone } */
export function themeOf(team) { const t = all()[team || '_'] || {}; return { accent: t.accent || 'team', tone: TONES[t.tone] ? t.tone : 'midnight' }; }
export function themeSet(team, k, v) { const A = all(), t = A[team || '_'] || {}; t[k] = v; A[team || '_'] = t; try { localStorage.setItem(KEY, JSON.stringify(A)); } catch (e) { /* not kept */ } }
const rgb = (h) => { const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(h || '').trim()); if (!m) return [136, 136, 136]; let x = m[1]; if (x.length === 3) x = x.replace(/./g, '$&$&'); return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16)); };
const hex = (c) => `#${c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
/** a colour that reads on the ground: a dark team colour is lifted on the dark grounds, a pale one deepened on DAYLIGHT */
function readable(h, light) { let c = rgb(h); for (let i = 0; i < 12; i++) { const L = lum(c); if (light ? L < 0.42 : L > 0.2) break; c = mix(c, light ? [0, 0, 0] : [255, 255, 255], 0.14); } return hex(c); }
/** the theme onto the HQ's element: its accent (and what is written on it), the team's two colours, the ground */
export function themeApply(el, team, c1, c2) {
  const T = themeOf(team), light = T.tone === 'daylight', raw = T.accent === 'team' ? c1 : T.accent === 'team2' ? (c2 || c1) : T.accent, ac = readable(raw || '#e10600', light);
  el.dataset.tone = T.tone;
  el.style.setProperty('--ac', ac); el.style.setProperty('--ac-ink', lum(rgb(ac)) > 0.5 ? '#0d1017' : '#ffffff');
  el.style.setProperty('--tc', c1 || '#e10600'); el.style.setProperty('--tc2', c2 || c1 || '#888');
  return T;
}
/** the theme's own panel: the accent (the team's first colour, its second, or one of eight) and the ground */
export function themeHTML(team, c1, c2) {
  const T = themeOf(team), sws = [['team', c1, 'Team colour'], ['team2', c2 || c1, 'Second colour'], ...ACCENTS.map((a) => [a, a, a])];
  return `<h4>ACCENT</h4><div class="q-thc">${sws.map(([v, col, n]) => `<button data-th="accent|${v}" class="${T.accent === v ? 'on' : ''}" style="--c:${esc(col)}" title="${esc(n)}"></button>`).join('')}</div>
    <h4>GROUND</h4><div class="q-seg">${Object.entries(TONES).map(([k, n]) => `<button data-th="tone|${k}" class="${T.tone === k ? 'on' : ''}">${n}</button>`).join('')}</div><p>Kept for ${esc(team || 'this team')}.</p>`;
}

// ---- the sheet's scale: 1366 x 768 fitted into the window, never smaller than it was drawn ----------------------------
export function fitSheet(el) { const z = Math.max(0.8, Math.min(1.6, Math.min(innerWidth / 1366, innerHeight / 768))); el.style.zoom = String(Math.round(z * 1000) / 1000); el.style.setProperty('--z', String(z)); }
/** a figure that changes counts to its new value (el.dataset.n: the number; fmt: how it is written) */
export function tween(el, to, fmt, from) {
  const a = Number.isFinite(from) ? from : to; if (!el || Math.abs(to - a) < 1e-6 || matchMedia('(prefers-reduced-motion: reduce)').matches) { if (el) el.textContent = fmt(to); return; }
  const t0 = performance.now(), D = 520; const step = (t) => { const u = Math.min(1, (t - t0) / D), e = 1 - (1 - u) ** 3; el.textContent = fmt(a + (to - a) * e); if (u < 1 && el.isConnected) requestAnimationFrame(step); }; requestAnimationFrame(step);
}

// ---- the factory's tech tree, on these colours ------------------------------------------------------------------------
const TMAP = [
  [/rgba\(255,255,255,\.5\)/g, 'color-mix(in srgb, var(--ink) 4%, transparent)'],
  [/#151a22/gi, 'var(--ink)'], [/#(3a4350|4a5361|5d6675)/gi, 'var(--dim)'], [/#(6b7480|8a93a0|9aa3ae)/gi, 'var(--mute)'],
  [/#(c9cfd8|e3e7ed|e6e9ee)/gi, 'var(--line2)'], [/#(eef1f5|e8ebf0|fbfcfd|f7f8fa|f8f9fb|f6f7f9|f3f5f8|f2f4f7|f1f3f7|f0f2f5|edf0f4|eceff3)/gi, 'var(--panel2)'],
  [/#(e5f6ec|effaf3)/gi, 'color-mix(in srgb, var(--good) 16%, var(--panel))'], [/#bfe8cf/gi, 'color-mix(in srgb, var(--good) 40%, var(--panel))'], [/#(1f7a4a|1d5e3c)/gi, 'var(--good)'],
  [/#(fff0ec|fff4f2)/gi, 'color-mix(in srgb, var(--bad) 15%, var(--panel))'], [/#(ffc9c1|f2c4bd)/gi, 'color-mix(in srgb, var(--bad) 42%, var(--panel))'], [/#(c2412f|8f2a20)/gi, 'var(--bad)'],
  [/#(fffaf0|fff6e0|fff4e0|fff1d6|ffeadb)/gi, 'color-mix(in srgb, var(--warn) 15%, var(--panel))'], [/#(f4c37a|f0c27a)/gi, 'color-mix(in srgb, var(--warn) 45%, var(--panel))'], [/#8a5a00/gi, 'var(--warn)'],
  [/rgba\(25,35,60,/g, 'rgba(0,0,0,'], [/rgba\(21,26,34,/g, 'rgba(var(--inkrgb),'], [/#000\b/g, 'var(--deep)'], [/#fff\b/gi, 'var(--panel)'],
];
/** HubTech's stylesheet (written for a white page) onto the HQ's colours: white text on a colour stays white */
export function techSkin(css) {
  let s = css.replace(/((?:^|[;{\s])(?:color|fill|stroke|text-shadow)\s*:[^;}]*)/g, (m) => m.replace(/#fff\b/gi, '\u0001'));
  for (const [re, to] of TMAP) s = s.replace(re, to);
  return s.replace(/\u0001/g, '#fff');
}

// ---- the stylesheet ----------------------------------------------------------------------------------------------------
export const HQ_CSS = `
#mgr { --bg: #090c13; --bg2: #0d111b; --panel: #121724; --panel2: #1a2030; --line: rgba(255,255,255,.07); --line2: rgba(255,255,255,.14); --ink: #eef1f6; --dim: #a9b2c0; --mute: #717b8c; --inkrgb: 255,255,255; --deep: #fff;
  --good: #2fd08a; --warn: #f0b429; --bad: #ff5468; --ac: #e10600; --ac-ink: #fff; --tc: #e10600; --tc2: #888; --r: 12px; --ease: cubic-bezier(.2,.8,.2,1);
  position: fixed; inset: 0; z-index: 60; display: grid; grid-template: 64px minmax(0, 1fr) / 196px minmax(0, 1fr); background: var(--bg); color: var(--ink); overflow: hidden;
  --f: "Segoe UI Variable", "Segoe UI", Inter, system-ui, Roboto, sans-serif; font: 500 13px/1.35 var(--f); -webkit-font-smoothing: antialiased; }
#mgr[data-tone="carbon"] { --bg: #0c0c0d; --bg2: #121213; --panel: #18181a; --panel2: #222225; }
#mgr[data-tone="daylight"] { --bg: #e9edf2; --bg2: #f3f5f8; --panel: #ffffff; --panel2: #f1f4f8; --line: rgba(21,26,34,.08); --line2: rgba(21,26,34,.18); --ink: #141922; --dim: #4a5361; --mute: #7d8695; --inkrgb: 21,26,34; --deep: #000; --good: #12925b; --warn: #a06b00; --bad: #d4253c; }
#mgr::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(900px 520px at 100% 0, color-mix(in srgb, var(--ac) 14%, transparent), transparent 70%), radial-gradient(700px 500px at 0 100%, color-mix(in srgb, var(--tc2) 9%, transparent), transparent 70%); transition: background .5s; }
#mgr * { box-sizing: border-box; } #mgr > * { position: relative; }
#mgr button { font: 700 11px/1 var(--f); letter-spacing: .06em; color: var(--ink); background: color-mix(in srgb, var(--panel2) 80%, transparent); border: 1px solid var(--line2); border-radius: 8px; padding: 7px 11px; cursor: pointer; white-space: nowrap;
  transition: background .16s, border-color .16s, color .16s, transform .12s var(--ease), box-shadow .2s; }
#mgr button:hover:not(:disabled) { border-color: color-mix(in srgb, var(--ac) 70%, var(--line2)); background: color-mix(in srgb, var(--ac) 14%, var(--panel2)); }
#mgr button:active:not(:disabled) { transform: scale(.96); } #mgr button:disabled { opacity: .38; cursor: default; }
#mgr button:focus-visible, #mgr .q-i:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
#mgr button.go { background: var(--ac); border-color: var(--ac); color: var(--ac-ink); box-shadow: 0 6px 18px -6px color-mix(in srgb, var(--ac) 70%, transparent); }
#mgr button.go:hover:not(:disabled) { background: color-mix(in srgb, var(--ac) 86%, #fff); box-shadow: 0 8px 24px -6px color-mix(in srgb, var(--ac) 85%, transparent); }
#mgr button.ghost { background: transparent; }
/* ---- the bar */
#mgr .q-top { grid-column: 1 / -1; display: flex; align-items: center; gap: 18px; padding: 0 16px 0 0; background: color-mix(in srgb, var(--bg2) 86%, transparent); border-bottom: 1px solid var(--line); backdrop-filter: blur(8px); z-index: 3; }
#mgr .q-brand { width: 196px; flex: none; height: 100%; display: flex; align-items: center; gap: 10px; padding: 0 14px; background: linear-gradient(100deg, color-mix(in srgb, var(--tc) 30%, transparent), transparent); border-right: 1px solid var(--line); min-width: 0; }
#mgr .q-mark { flex: none; width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; font: 900 12px/1 var(--f); font-style: normal; letter-spacing: .04em; color: #fff; background: linear-gradient(140deg, var(--tc), color-mix(in srgb, var(--tc) 55%, var(--tc2))); box-shadow: 0 0 0 1px rgba(255,255,255,.18) inset, 0 6px 16px -6px var(--tc); text-shadow: 0 1px 2px rgba(0,0,0,.5); }
#mgr .q-brand b { display: block; font: 800 14px/1.1 var(--f); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #mgr .q-brand small { display: block; margin-top: 4px; font: 700 9px/1 var(--f); letter-spacing: .07em; color: var(--mute); text-transform: uppercase; white-space: nowrap; }
#mgr .q-kpis { display: flex; gap: 8px; flex: 1; min-width: 0; }
#mgr .q-kpi { flex: 1; min-width: 0; max-width: 190px; padding: 6px 11px 5px; border-radius: 10px; background: color-mix(in srgb, var(--panel) 80%, transparent); border: 1px solid var(--line); }
#mgr .q-kpi small { display: block; font: 700 9px/1 var(--f); letter-spacing: .16em; color: var(--mute); text-transform: uppercase; } #mgr .q-kpi b { display: block; margin: 4px 0 3px; font: 800 15px/1 var(--f); font-variant-numeric: tabular-nums; white-space: nowrap; }
#mgr .q-kpi b em { font: 600 10px/1 var(--f); font-style: normal; color: var(--mute); margin-left: 5px; } #mgr .q-kpi.bad b { color: var(--bad); } #mgr .q-kpi.ok b { color: var(--good); }
#mgr .q-cta { display: flex; gap: 8px; align-items: center; flex: none; } #mgr .q-cta .go { padding: 11px 16px; font-size: 12px; } #mgr .q-cta .sim { padding: 11px 12px; }
#mgr .q-cta .ic { width: 34px; height: 34px; padding: 0; display: grid; place-items: center; border-radius: 50%; } #mgr .q-cta .ic svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.4; }
/* ---- the rail */
#mgr .q-rail { position: relative; padding: 10px 8px; background: color-mix(in srgb, var(--bg2) 70%, transparent); border-right: 1px solid var(--line); overflow: hidden auto; scrollbar-width: none; display: flex; flex-direction: column; }
#mgr .q-rail h5 { margin: 9px 10px 4px; font: 800 8.5px/1 var(--f); letter-spacing: .22em; color: var(--mute); } #mgr .q-rail h5:first-child { margin-top: 2px; }
#mgr .q-rail button { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; width: 100%; height: 29px; padding: 0 10px; border: 0; border-radius: 8px; background: transparent; color: var(--dim); font: 600 12.5px/1 var(--f); letter-spacing: .01em; text-align: left; }
#mgr .q-rail button:hover:not(:disabled) { background: color-mix(in srgb, var(--ink) 6%, transparent); color: var(--ink); }
#mgr .q-rail button.on { color: var(--ink); font-weight: 800; background: transparent; }
#mgr .q-rail svg { flex: none; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.35; stroke-linecap: round; stroke-linejoin: round; opacity: .8; transition: color .2s, opacity .2s; } #mgr .q-rail button.on svg { color: var(--ac); opacity: 1; }
#mgr .q-rail .bdg { margin-left: auto; min-width: 17px; height: 17px; padding: 0 5px; border-radius: 9px; display: grid; place-items: center; font: 800 9.5px/1 var(--f); background: var(--ac); color: var(--ac-ink); animation: qPop .35s var(--ease); }
#mgr .q-ind { position: absolute; left: 8px; right: 8px; top: 0; height: 29px; border-radius: 8px; background: linear-gradient(90deg, color-mix(in srgb, var(--ac) 24%, transparent), color-mix(in srgb, var(--ac) 6%, transparent)); box-shadow: inset 2px 0 0 var(--ac); transition: transform .34s var(--ease), opacity .2s; pointer-events: none; }
/* ---- the stage */
#mgr .q-stage { position: relative; min-width: 0; min-height: 0; padding: 14px 16px 16px; overflow: hidden; }
#mgr .q-g { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-rows: minmax(0, 1fr); gap: 12px; height: 100%; min-height: 0; }
#mgr .q-p { display: flex; flex-direction: column; min-width: 0; min-height: 0; background: linear-gradient(180deg, color-mix(in srgb, var(--panel) 96%, transparent), color-mix(in srgb, var(--panel) 88%, transparent)); border: 1px solid var(--line); border-radius: var(--r); box-shadow: 0 10px 30px -18px rgba(0,0,0,.6); overflow: hidden; transition: border-color .25s; }
#mgr .q-p:hover { border-color: var(--line2); }
#mgr .q-p > header { flex: none; display: flex; align-items: center; gap: 8px; padding: 10px 14px 0; min-height: 30px; }
#mgr .q-p > header h3 { margin: 0; font: 800 10px/1 var(--f); letter-spacing: .2em; text-transform: uppercase; color: var(--dim); white-space: nowrap; } #mgr .q-p > header h3::before { content: ''; display: inline-block; width: 6px; height: 6px; margin-right: 8px; border-radius: 2px; background: var(--ac); vertical-align: 1px; box-shadow: 0 0 8px var(--ac); }
#mgr .q-p > header small { font: 600 10.5px/1 var(--f); color: var(--mute); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #mgr .q-hx { margin-left: auto; display: flex; gap: 6px; align-items: center; }
#mgr .q-pb { flex: 1; min-height: 0; padding: 9px 14px 12px; } #mgr .q-pb.q-np { padding: 6px 0 0; } #mgr .q-sc { overflow: hidden auto; scrollbar-width: thin; scrollbar-color: var(--line2) transparent; }
#mgr .q-p.hero { background: linear-gradient(135deg, color-mix(in srgb, var(--ac) 30%, var(--panel)), var(--panel) 62%); border-color: color-mix(in srgb, var(--ac) 35%, var(--line)); }
#mgr .q-p.flat { background: transparent; border: 0; box-shadow: none; overflow: visible; } #mgr .q-p.flat > header { padding: 0 2px; } #mgr .q-p.flat .q-pb { padding: 8px 0 0; }
#mgr .q-enter .q-p { animation: qIn .42s var(--ease) both; animation-delay: calc(var(--i, 0) * 38ms); }
${Array.from({ length: 10 }, (_, i) => `#mgr .q-g > .q-p:nth-child(${i + 1}) { --i: ${i}; }`).join(' ')}
/* ---- the parts */
#mgr .q-big { font: 800 22px/1.1 var(--f); letter-spacing: -.01em; } #mgr .q-big small { font: 600 11.5px/1 var(--f); color: var(--mute); letter-spacing: 0; margin-left: 6px; } #mgr .q-huge { font: 800 30px/1 var(--f); letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
#mgr .q-kv { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 5px 0; border-bottom: 1px solid var(--line); font-size: 12px; } #mgr .q-kv:last-child { border-bottom: 0; }
#mgr .q-kv span { color: var(--dim); min-width: 0; } #mgr .q-kv b { font-weight: 700; text-align: right; } #mgr .q-kv.good b, #mgr .good { color: var(--good); } #mgr .q-kv.bad b, #mgr .bad { color: var(--bad); } #mgr .warn { color: var(--warn); }
#mgr .q-m { height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--ink) 10%, transparent); overflow: hidden; margin: 3px 0; } #mgr .q-m.thin { height: 3px; }
#mgr .q-m i { display: block; height: 100%; border-radius: 3px; background: var(--mc, var(--ac)); box-shadow: 0 0 8px color-mix(in srgb, var(--mc, var(--ac)) 60%, transparent); transition: width .6s var(--ease); animation: qGrow .7s var(--ease) both; transform-origin: 0 50%; }
#mgr .q-ring { --rc: var(--ac); flex: none; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: conic-gradient(var(--rc) calc(var(--p) * 1%), color-mix(in srgb, var(--ink) 10%, transparent) 0); }
#mgr .q-ring::before { content: ''; grid-area: 1 / 1; width: calc(100% - 7px); height: calc(100% - 7px); border-radius: 50%; background: var(--panel); } #mgr .q-ring b { grid-area: 1 / 1; position: relative; font: 800 13px/1 var(--f); font-variant-numeric: tabular-nums; }
#mgr .q-ring.sm { width: 32px; height: 32px; } #mgr .q-ring.sm b { font-size: 11px; } #mgr .q-ring.big { width: 64px; height: 64px; } #mgr .q-ring.big::before { width: calc(100% - 10px); height: calc(100% - 10px); } #mgr .q-ring.big b { font-size: 21px; }
#mgr .q-seg { display: inline-flex; padding: 2px; gap: 2px; border-radius: 9px; background: color-mix(in srgb, var(--ink) 7%, transparent); border: 1px solid var(--line); } #mgr .q-seg button { border: 0; background: transparent; padding: 6px 9px; border-radius: 7px; color: var(--dim); font-size: 10.5px; }
#mgr .q-seg button.on { background: var(--ac); color: var(--ac-ink); box-shadow: 0 3px 10px -3px var(--ac); } #mgr .q-seg button:hover:not(.on):not(:disabled) { background: color-mix(in srgb, var(--ink) 10%, transparent); color: var(--ink); }
#mgr .q-row { display: flex; align-items: center; gap: 11px; padding: 8px 0; border-bottom: 1px solid var(--line); min-width: 0; } #mgr .q-row:last-child { border-bottom: 0; } #mgr .q-row.top { align-items: flex-start; }
#mgr .q-rn { flex: 1; min-width: 0; } #mgr .q-rn b { display: block; font: 700 13px/1.25 var(--f); } #mgr .q-rn small { display: block; margin-top: 2px; font: 500 11px/1.35 var(--f); color: var(--mute); } #mgr .q-rn small b { display: inline; font: var(--f); font-weight: 700; }
#mgr .q-acts { display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-end; flex: none; max-width: 56%; } #mgr .q-acts.l { justify-content: flex-start; max-width: none; margin-top: 8px; }
#mgr .q-st { min-width: 0; } #mgr .q-st small { display: block; font: 700 9px/1 var(--f); letter-spacing: .16em; color: var(--mute); text-transform: uppercase; } #mgr .q-st b { display: block; margin-top: 5px; font: 800 19px/1 var(--f); font-variant-numeric: tabular-nums; white-space: nowrap; } #mgr .q-st em { display: block; margin-top: 4px; font: 500 10.5px/1.2 var(--f); font-style: normal; color: var(--mute); }
#mgr .q-sts { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); gap: 10px 14px; }
#mgr .q-tag { display: inline-block; padding: 3px 7px; border-radius: 5px; font: 800 9px/1 var(--f); font-style: normal; letter-spacing: .12em; text-transform: uppercase; background: color-mix(in srgb, var(--ink) 10%, transparent); color: var(--dim); white-space: nowrap; }
#mgr .q-tag.ac { background: color-mix(in srgb, var(--ac) 22%, transparent); color: var(--ac); } #mgr .q-tag.good { background: color-mix(in srgb, var(--good) 20%, transparent); color: var(--good); } #mgr .q-tag.bad { background: color-mix(in srgb, var(--bad) 20%, transparent); color: var(--bad); } #mgr .q-tag.warn { background: color-mix(in srgb, var(--warn) 20%, transparent); color: var(--warn); }
#mgr .q-sw { display: inline-block; width: 4px; height: 13px; border-radius: 2px; margin-right: 8px; vertical-align: -2px; }
#mgr .q-em { margin: 6px 0; color: var(--mute); font-size: 12px; } #mgr p { margin: 6px 0; } #mgr .q-fine { font-size: 11px; color: var(--mute); line-height: 1.4; }
#mgr .q-i { position: relative; flex: none; width: 17px; height: 17px; border-radius: 50%; display: inline-grid; place-items: center; font: 800 10px/1 Georgia, serif; font-style: italic; color: var(--mute); border: 1px solid var(--line2); cursor: help; transition: color .15s, border-color .15s; }
#mgr .q-i:hover, #mgr .q-i:focus { color: var(--ac); border-color: var(--ac); }
#mgr .q-tip { position: absolute; right: -6px; top: 24px; z-index: 30; width: 300px; padding: 10px 12px; border-radius: 10px; background: var(--panel2); border: 1px solid var(--line2); box-shadow: 0 18px 40px -12px rgba(0,0,0,.7); font: 500 11.5px/1.45 "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; font-style: normal; color: var(--dim); text-align: left; letter-spacing: 0; text-transform: none; white-space: normal; opacity: 0; transform: translateY(-4px); pointer-events: none; transition: opacity .16s, transform .2s var(--ease); }
#mgr .q-i:hover .q-tip, #mgr .q-i:focus .q-tip { opacity: 1; transform: none; }
#mgr table { width: 100%; border-collapse: collapse; font-size: 12px; } #mgr th { position: sticky; top: 0; z-index: 1; background: var(--panel); text-align: left; padding: 6px 10px; font: 800 9px/1 var(--f); letter-spacing: .16em; text-transform: uppercase; color: var(--mute); border-bottom: 1px solid var(--line2); white-space: nowrap; }
#mgr td { padding: 6px 10px; border-bottom: 1px solid var(--line); vertical-align: middle; } #mgr tr:last-child td { border-bottom: 0; } #mgr td small { color: var(--mute); font-size: 10.5px; } #mgr td.n, #mgr th.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
#mgr tr.me td { background: color-mix(in srgb, var(--ac) 13%, transparent); } #mgr tr.me td:first-child { box-shadow: inset 2px 0 0 var(--ac); } #mgr tbody tr { transition: background .15s; } #mgr tbody tr:hover td { background: color-mix(in srgb, var(--ink) 4%, transparent); } #mgr tbody tr.me:hover td { background: color-mix(in srgb, var(--ac) 18%, transparent); }
/* ---- the word back from a click, and the theme's panel */
#mgr .q-chk { display: flex; align-items: center; gap: 9px; padding: 5px 0; font-size: 12px; color: var(--dim); } #mgr .q-chk i { flex: none; width: 16px; height: 16px; border-radius: 50%; display: grid; place-items: center; font: 900 9px/1 var(--f); font-style: normal; background: color-mix(in srgb, var(--good) 22%, transparent); color: var(--good); } #mgr .q-chk.no i { background: color-mix(in srgb, var(--warn) 24%, transparent); color: var(--warn); } #mgr .q-chk.no { color: var(--ink); } #mgr .q-chk button { margin-left: auto; padding: 4px 8px; font-size: 9.5px; }
#mgr .q-toast { position: absolute; left: calc(196px + (100% - 196px) / 2); bottom: 18px; z-index: 40; max-width: 640px; transform: translate(-50%, 16px); padding: 10px 16px 10px 12px; border-radius: 11px; display: flex; gap: 10px; align-items: center; background: var(--panel2); border: 1px solid color-mix(in srgb, var(--good) 55%, var(--line2)); box-shadow: 0 18px 44px -14px rgba(0,0,0,.75), 0 0 22px -8px var(--good); font-size: 12.5px; opacity: 0; pointer-events: none; transition: opacity .2s, transform .34s var(--ease); }
#mgr .q-toast.in { opacity: 1; transform: translate(-50%, 0); } #mgr .q-toast i { flex: none; width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; font: 900 10px/1 var(--f); font-style: normal; background: var(--good); color: #06150d; }
#mgr .q-toast.no { border-color: color-mix(in srgb, var(--bad) 55%, var(--line2)); box-shadow: 0 18px 44px -14px rgba(0,0,0,.75), 0 0 22px -8px var(--bad); } #mgr .q-toast.no i { background: var(--bad); color: #fff; }
#mgr .q-theme { position: absolute; right: 14px; top: 70px; z-index: 45; width: 268px; padding: 12px 14px 10px; border-radius: 12px; background: var(--panel2); border: 1px solid var(--line2); box-shadow: 0 24px 50px -16px rgba(0,0,0,.8); opacity: 0; transform: translateY(-8px) scale(.98); transform-origin: 100% 0; pointer-events: none; transition: opacity .16s, transform .24s var(--ease); }
#mgr .q-theme.in { opacity: 1; transform: none; pointer-events: auto; } #mgr .q-theme h4 { margin: 2px 0 7px; font: 800 9px/1 var(--f); letter-spacing: .2em; color: var(--mute); } #mgr .q-theme p { margin: 9px 0 0; font-size: 10.5px; color: var(--mute); } #mgr .q-theme .q-seg { display: flex; margin-bottom: 2px; } #mgr .q-theme .q-seg button { flex: 1; }
#mgr .q-thc { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; } #mgr .q-thc button { width: 22px; height: 22px; padding: 0; border-radius: 50%; background: var(--c); border: 2px solid var(--panel2); box-shadow: 0 0 0 1px var(--line2); } #mgr .q-thc button.on { box-shadow: 0 0 0 2px var(--ink); } #mgr .q-thc button:hover:not(:disabled) { background: var(--c); transform: scale(1.15); }
/* ---- the factory's tree sits in the stage as one panel */
#mgr .q-fac { height: 100%; overflow: hidden auto; scrollbar-width: thin; scrollbar-color: var(--line2) transparent; border-radius: var(--r); background: color-mix(in srgb, var(--panel) 92%, transparent); border: 1px solid var(--line); padding: 14px 16px; } #mgr .q-fac .tt-wrap { max-width: none; margin: 0 auto; }
#mgr .q-enter .q-fac { animation: qIn .42s var(--ease) both; } #mgr .q-fac button { letter-spacing: 0; }
@keyframes qIn { from { opacity: 0; transform: translateY(14px) scale(.985); } to { opacity: 1; transform: none; } }
@keyframes qGrow { from { transform: scaleX(0); } to { transform: none; } }
@keyframes qPop { from { transform: scale(0); } to { transform: none; } }
@media (prefers-reduced-motion: reduce) { #mgr *, #mgr *::before, #mgr *::after { animation-duration: .01s !important; transition-duration: .01s !important; } }
`;
