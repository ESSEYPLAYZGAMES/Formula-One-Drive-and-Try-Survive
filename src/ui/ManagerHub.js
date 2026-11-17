// The team principal's HQ (career/Manager.js): between the race weekends, the team's home - made for a laptop's screen
// (ui/HQKit.js: the sheet, its colours, its parts). A bar across the top holds what matters every day - the team, the
// season, the budget, what is left under the cost cap, the constructors' place against the board's target, the board's
// confidence - and the weekend (RACE: watched on the feed and run from the pit wall; SIMULATE: the result at once). A
// rail down the left has every page in five groups: TEAM (overview, inbox, standings, calendar), CAR (factory - the
// tech tree, ui/HubTech.js - design, parts), PEOPLE (drivers, morale, staff, pit crew, academy), BUSINESS (finances,
// sponsors, facilities), PADDOCK (rivals, market). A page is a grid of panels that fills the screen: nothing scrolls
// but the inside of a panel with a long list; what a click says comes back as a line at the foot; the colours are the
// team's (the button by the menu: accent and ground, kept for each team). A new career starts here too.
//   openManagerHub({ career, teams, trackName, onRace(c), onSim(c), onQuick(), onExit(), play }) / closeManagerHub()
import { mailHTML, mailClick, mailHome, mailMark, MAIL_CSS } from './ManagerMail.js';
import { mailBadge } from '../career/ManagerMail.js';
import { TECH_CSS, techHTML, techClick } from './HubTech.js';
import { ManagerCareer, TRACKS_ALL, COST_CAP, PRIZE, TIER_NAME, TIER_BUDGET, RACE_INCOME, POINT_INCOME, STAFF_ROLES } from '../career/Manager.js';
import { techEffects, UP, partsCount } from '../career/TechTree.js';
import { extraHTML, extraClick, homeExtra, EXTRA_CSS } from './ManagerHub2.js';
import { storyHTML, storyHome, storyAct, storyPump, storyAmbientPlay } from './ManagerHub3.js';
import { eraHTML, eraHome, eraClick, driversHTML } from './ManagerHub4.js';
import { storySigning, storyReleased, storyShown, storyApply, inboxOf, decisionsOf, storyPreRace } from '../career/ManagerStory.js';
import { PU, SPARES, allocOf, fitNew, orderSpare, FAC, FAC_MAX, facCost, facRounds, facFx, facUpgrade, facMaintain, maintCost, SPONSOR_SLOTS, acceptOdds, propose, sponsorTargets, marketability } from '../career/ManagerOps.js';
import { TRACK_MAPS } from './TrackMaps.js';
import { HQ_CSS, FAC_CSS, NAV, ICON, esc, money, pct, sur, panel, kv, meter, ring, seg, person, stat, tag, sw, empty, themeApply, themeHTML, themeSet, fitSheet, tween, techSkin } from './HQKit.js';

const PAGE_CSS = `
#mgr .q-rmw { position: relative; display: inline-flex; }
#mgr .q-rm { position: absolute; right: 0; top: calc(100% + 10px); z-index: 46; width: 336px; padding: 10px; border-radius: 14px; background: var(--panel2); border: 1px solid var(--line2); box-shadow: 0 26px 54px -16px rgba(0,0,0,.85); opacity: 0; transform: translateY(-8px) scale(.98); transform-origin: 100% 0; pointer-events: none; transition: opacity .16s, transform .24s var(--ease); }
#mgr .q-rm.in { opacity: 1; transform: none; pointer-events: auto; }
#mgr .q-rm h4 { margin: 4px 8px 8px; font: 800 9px/1 var(--f); letter-spacing: .2em; color: var(--mute); }
#mgr button.q-rmi { all: unset; box-sizing: border-box; display: block; width: 100%; padding: 10px 12px; border-radius: 9px; cursor: pointer; font-family: var(--f); transition: background .16s var(--ease), transform .16s var(--ease); }
#mgr button.q-rmi + .q-rmi { margin-top: 2px; }
#mgr button.q-rmi b { display: block; font: 800 13px/1.2 var(--f); color: var(--ink); } #mgr button.q-rmi small { display: block; margin-top: 3px; font: 500 11.5px/1.35 var(--f); color: var(--mute); }
#mgr button.q-rmi:hover, #mgr button.q-rmi:focus-visible { background: color-mix(in srgb, var(--ac) 16%, transparent); transform: translateX(2px); } #mgr button.q-rmi:hover b { color: #fff; }
#mgr[data-tone="vice"] .q-rm { background: linear-gradient(180deg, rgba(27,16,58,.98), rgba(20,11,45,.98)) padding-box, linear-gradient(140deg, rgba(255,63,164,.7), rgba(155,92,255,.3) 45%, rgba(35,229,255,.6)) border-box; border-color: transparent; box-shadow: 0 26px 54px -16px rgba(0,0,0,.9), 0 0 40px -18px #ff3fa4; }
#mgr[data-tone="vice"] .q-rm h4 { color: #8fdcf0; text-shadow: 0 0 10px rgba(35,229,255,.5); }

#mgr .q-page { height: 100%; min-height: 0; }
#mgr .q-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 9px 0 10px; }
#mgr .q-map { position: absolute; right: 8px; top: 6px; bottom: 6px; width: 46%; opacity: .5; pointer-events: none; } #mgr .q-map svg { width: 100%; height: 100%; } #mgr .q-map path { fill: none; stroke: var(--ac); stroke-width: 9; stroke-linejoin: round; stroke-linecap: round; filter: drop-shadow(0 0 10px var(--ac)); stroke-dasharray: 1; stroke-dashoffset: 0; } #mgr .q-enter .q-map path { animation: qDraw 1.4s var(--ease) .15s both; }
#mgr .q-p.hero { position: relative; } #mgr .q-p.hero .q-pb { position: relative; }
#mgr .q-duo { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; height: 100%; } #mgr .q-dc { display: flex; flex-direction: column; gap: 7px; min-width: 0; padding: 10px 11px; border-radius: 10px; background: color-mix(in srgb, var(--ink) 4%, transparent); border: 1px solid var(--line); }
#mgr .q-dc .hd { display: flex; align-items: center; gap: 10px; min-width: 0; } #mgr .q-dc .hd b { display: block; font: 800 14px/1.15 var(--f); } #mgr .q-dc .hd small { display: block; margin-top: 3px; font-size: 10.5px; color: var(--mute); }
#mgr .q-dc .no { font: 900 26px/1 var(--f); font-style: italic; color: color-mix(in srgb, var(--ac) 80%, var(--ink)); opacity: .9; margin-left: auto; }
#mgr .q-news > div { padding: 6px 0; border-bottom: 1px solid var(--line); font-size: 12px; line-height: 1.4; color: var(--dim); } #mgr .q-news > div:last-child { border: 0; } #mgr .q-news small { display: block; margin-bottom: 2px; font: 800 9px/1 var(--f); letter-spacing: .14em; color: var(--mute); }
#mgr .q-res { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--line); } #mgr .q-res i { flex: none; width: 46px; text-align: center; font: 900 20px/1 var(--f); font-style: normal; } #mgr .q-res i.dnf { font-size: 13px; color: var(--bad); } #mgr .q-res b { flex: 1; } #mgr .q-res em { font-style: normal; font-weight: 800; color: var(--ac); }
#mgr .q-verdict { margin: 4px 0 10px; padding: 12px 14px; border-radius: 10px; font: 800 19px/1.1 var(--f); } #mgr .q-verdict.good { background: color-mix(in srgb, var(--good) 16%, transparent); color: var(--good); } #mgr .q-verdict.bad { background: color-mix(in srgb, var(--bad) 16%, transparent); color: var(--bad); }
#mgr .q-cal { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: minmax(0, 1fr); gap: 12px; height: 100%; }
#mgr .q-rc { position: relative; display: flex; flex-direction: column; gap: 4px; min-height: 0; padding: 11px 13px; border-radius: var(--r); background: var(--panel); border: 1px solid var(--line); overflow: hidden; animation: qIn .42s var(--ease) both; animation-delay: calc(var(--i) * 30ms); }
#mgr .q-rc.now { border-color: var(--ac); box-shadow: 0 0 0 1px var(--ac), 0 12px 30px -14px var(--ac); background: linear-gradient(135deg, color-mix(in srgb, var(--ac) 22%, var(--panel)), var(--panel) 70%); } #mgr .q-rc.done { opacity: .78; }
#mgr .q-rc .rn { font: 800 9px/1 var(--f); letter-spacing: .2em; color: var(--mute); } #mgr .q-rc.now .rn { color: var(--ac); } #mgr .q-rc h4 { margin: 2px 0 0; font: 800 16px/1.1 var(--f); } #mgr .q-rc small { font-size: 11px; color: var(--mute); } #mgr .q-rc .ft { margin-top: auto; font-size: 11.5px; } #mgr .q-rc .ft b { font-weight: 800; }
#mgr .q-rc svg { position: absolute; right: 6px; top: 8px; width: 34%; height: 62%; opacity: .32; } #mgr .q-rc svg path { fill: none; stroke: var(--ink); stroke-width: 14; stroke-linejoin: round; } #mgr .q-rc.now svg { opacity: .7; } #mgr .q-rc.now svg path { stroke: var(--ac); }
#mgr .q-pips { display: flex; gap: 4px; margin: 6px 0 8px; } #mgr .q-pips i { flex: 1; height: 5px; border-radius: 3px; background: color-mix(in srgb, var(--ink) 10%, transparent); } #mgr .q-pips i.on { background: var(--ac); box-shadow: 0 0 8px color-mix(in srgb, var(--ac) 60%, transparent); } #mgr .q-pips i.bd { background: repeating-linear-gradient(90deg, var(--ac) 0 4px, transparent 4px 8px); }
#mgr .q-col { display: flex; flex-direction: column; gap: 8px; height: 100%; } #mgr .q-col .sp { margin-top: auto; } #mgr .q-col .q-acts { max-width: none; } #mgr .q-col .q-acts button { flex: 1; }
#mgr .q-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; align-content: start; } #mgr .q-card { padding: 11px 12px; border-radius: 10px; background: color-mix(in srgb, var(--ink) 4%, transparent); border: 1px solid var(--line); } #mgr .q-card.open { grid-column: 1 / -1; border-color: color-mix(in srgb, var(--ac) 50%, var(--line)); }
#mgr .q-card h4 { margin: 0 0 2px; font: 800 9px/1 var(--f); letter-spacing: .18em; color: var(--mute); text-transform: uppercase; }
#mgr .q-spr { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; height: 100%; } #mgr .q-sp { display: flex; flex-direction: column; gap: 6px; padding: 11px 12px; border-radius: 10px; background: color-mix(in srgb, var(--ink) 4%, transparent); border: 1px solid var(--line); } #mgr .q-sp h4 { margin: 0; font: 800 13px/1 var(--f); } #mgr .q-sp button { margin-top: auto; }
#mgr .q-prz { display: grid; grid-template-columns: 26px 1fr 56px; gap: 6px 8px; align-items: center; font-size: 11.5px; } #mgr .q-prz b { text-align: right; font-variant-numeric: tabular-nums; } #mgr .q-prz span { color: var(--mute); font-weight: 700; } #mgr .q-prz .me { color: var(--ac); }
/* ---- a new career */
#mgr[data-mode="new"] { grid-template-columns: minmax(0, 1fr); } #mgr[data-mode="new"] .q-rail { display: none; } #mgr[data-mode="new"] .q-toast { left: 50%; }
#mgr .q-teams { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: minmax(0, 1fr); gap: 9px; height: 100%; }
#mgr .q-teams button { position: relative; display: flex; flex-direction: column; justify-content: flex-end; gap: 3px; height: 100%; padding: 10px 12px; text-align: left; border-radius: 11px; letter-spacing: 0; white-space: normal; overflow: hidden; background: linear-gradient(150deg, color-mix(in srgb, var(--c) 34%, var(--panel)), var(--panel) 74%); border: 1px solid color-mix(in srgb, var(--c) 30%, var(--line)); animation: qIn .4s var(--ease) both; animation-delay: calc(var(--i) * 24ms); }
#mgr .q-teams button::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c); } #mgr .q-teams button b { font: 800 14px/1.1 var(--f); } #mgr .q-teams button small { font: 600 10.5px/1.25 var(--f); color: var(--mute); }
#mgr .q-teams button:hover:not(:disabled) { background: linear-gradient(150deg, color-mix(in srgb, var(--c) 46%, var(--panel)), var(--panel) 80%); border-color: var(--c); } #mgr .q-teams button.on { border-color: var(--c); box-shadow: 0 0 0 2px var(--c), 0 14px 30px -14px var(--c); }
@keyframes qDraw { from { stroke-dashoffset: 1; opacity: 0; } 20% { opacity: 1; } to { stroke-dashoffset: 0; } }
`;
const H = { tab: 'home', S: {}, msg: null, ok: true, o: null, c: null, nc: { team: null, rounds: 8, laps: 5 }, kp: {} };
let el = null;

/** the HQ (or, with no career, the new career's set-up) */
export function openManagerHub(o) {
  H.o = o; H.c = o.career || null; H.msg = null; if (!H.c) H.tab = 'new'; else if (H.tab === 'new') H.tab = 'home';
  if (!document.getElementById('mgr-css')) { const st = document.createElement('style'); st.id = 'mgr-css'; st.textContent = HQ_CSS + PAGE_CSS + EXTRA_CSS + MAIL_CSS + techSkin(TECH_CSS.replaceAll('#career', '#mgr .fac')) + FAC_CSS; document.head.appendChild(st); }
  if (!el) { el = document.createElement('div'); el.id = 'mgr'; el.addEventListener('click', onClick); document.body.appendChild(el); let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (managerHubOpen()) { fitSheet(el); rail(); } }, 100); }); }
  el.style.display = 'grid'; H.shown = 0; H._tab = null; el.dataset.mode = ''; render(); pump();
}
/** the story's scenes that play themselves on coming back to the HQ (ui/ManagerHub3.js; o.play shows one) */
let pumping = false;
function pump() {
  if (!H.c || !H.o.play || pumping) return; pumping = true;
  storyPump(H.c, H.o.play).then((lines) => { pumping = false; H.shown = (H.shown || 0) + (lines.n || 0); if (lines.length) say(lines[lines.length - 1]); if (managerHubOpen()) render(); }, () => { pumping = false; });
}
/** a scene asked for from a page (a matter decided, a signing): shown, then the page drawn again with what it said */
function scene(p) { pumping = true; p.then((t) => { pumping = false; if (t) say(t); if (managerHubOpen()) render(); }, () => { pumping = false; }); }
export function closeManagerHub() { if (el) el.style.display = 'none'; }
export function managerHubOpen() { return !!el && el.style.display !== 'none'; }
const trackName = (k) => H.o.trackName?.(k) || k;
/** a circuit's outline (ui/TrackMaps.js), as one path in a box */
function outline(id) { const M = TRACK_MAPS[id]; if (!M) return ''; const P = M.pts; let d = ''; for (let i = 0; i < P.length; i += 3) d += `${i ? 'L' : 'M'}${P[i][0]} ${P[i][1]}`; return `<svg viewBox="-30 -30 ${M.w + 60} ${M.h + 60}" preserveAspectRatio="xMidYMid meet"><path pathLength="1" d="${d}Z"/></svg>`; }

function render() {
  const c = H.c; if (!el) return;
  fitSheet(el);
  const mode = c ? 'hq' : 'new';
  if (el.dataset.mode !== mode) { el.dataset.mode = mode; el.innerHTML = '<div class="q-top"></div><nav class="q-rail"></nav><main class="q-stage"></main><div class="q-toast"></div><div class="q-theme"></div>'; H._tab = null; H.kp = {}; }
  if (!c) { const T = (H.o.teams || []).find((t) => t.name === H.nc.team); themeApply(el, T?.name || null, T?.color || '#e10600', T?.color2); topNew(); stage(newHTML()); toast(); return; }
  themeApply(el, c.myTeam, c.team.color, c.team.color2);
  top(c); rail(); stage(body(c)); toast(); mailMark(el, c);
  // (the scenes waiting to be played - those that come up as you go round the HQ - made ready while you read: they start at once)
  if (H.o.prepare) { clearTimeout(H.prepT); H.prepT = setTimeout(() => { try { for (const m of inboxOf(c).filter((x) => !x.played && !x.done && x.scene).slice(0, 2)) H.o.prepare(m.scene, m.ctx); const pre = storyPreRace(c); if (pre) H.o.prepare(pre.scene, pre.ctx); } catch (e) { /* played from scratch */ } }, 700); }
  el.querySelector('.q-theme').innerHTML = themeHTML(c.myTeam, c.team.color, c.team.color2);
}
/** the bar: the team, the season, the four figures (a figure that has changed counts to its new value), the weekend */
function top(c) {
  const t = c.team, pos = c.posOf(c.myTeam), conf = c.board.conf, trk = trackName(c.track), ready = c.seatsReady(), cap = c.capLeft();
  const ctas = c.seasonDone ? (c.sacked ? '' : '<button class="go" data-a="next">START NEXT SEASON →</button>')
    : `<button class="sim" data-a="sim"${ready ? '' : ' disabled'} title="The weekend's result at once">SIMULATE</button><span class="q-rmw"><button class="go" data-a="racemenu"${ready ? '' : ' disabled title="Both seats need a driver"'} aria-haspopup="menu" aria-expanded="${H.rm ? 'true' : 'false'}">RACE · ${esc(trk.toUpperCase())} ▾</button>
      <div class="q-rm${H.rm && ready ? ' in' : ''}" role="menu"><h4>ROUND ${c.round} · ${esc(trk.toUpperCase())}</h4>
        <button class="q-rmi" data-a="race" data-v=""><b>The full weekend</b><small>Practice and set-up, qualifying, the race</small></button>
        <button class="q-rmi" data-a="race" data-v="quali"><b>Skip practice · qualifying</b><small>Load the circuit and go straight to qualifying on the feed</small></button>
        <button class="q-rmi" data-a="race" data-v="race"><b>Sim qualifying · race</b><small>Qualifying simulated as the circuit loads, then the strategy and the race</small></button>
        <button class="q-rmi" data-a="sim"><b>Sim the whole weekend</b><small>Qualifying and the race simulated here: nothing to load</small></button></div></span>`;
  const ini = t.name.replace(/[^A-Za-z ]/g, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || t.name.slice(0, 2).toUpperCase();
  el.querySelector('.q-top').innerHTML = `<div class="q-brand"><i class="q-mark">${esc(ini)}</i><div style="min-width:0"><b>${esc(t.name)}</b><small>${c.season}${c.seasonDone ? ' · season over' : ` · Round ${c.round} / ${c.rounds}`}</small></div></div>
    <div class="q-kpis"><div class="q-kpi${t.budget < 5 ? ' bad' : ''}"><small>Budget</small><b data-kp="budget"></b>${meter(Math.min(1, t.budget / 60), 'var(--ac)', { thin: true })}</div>
      <div class="q-kpi"><small>Cost cap left</small><b data-kp="cap"></b>${meter(Math.max(0, cap / COST_CAP), cap < COST_CAP * 0.15 ? 'var(--bad)' : 'var(--ac)', { thin: true })}</div>
      <div class="q-kpi${pos <= c.board.target ? ' ok' : ''}"><small>Constructors</small><b>P${pos}<em>target P${c.board.target}</em></b>${meter(1 - (pos - 1) / Math.max(1, Object.keys(c.teams).length - 1), pos <= c.board.target ? 'var(--good)' : 'var(--warn)', { thin: true })}</div>
      <div class="q-kpi${conf < 30 ? ' bad' : conf >= 65 ? ' ok' : ''}"><small>Board confidence</small><b data-kp="conf"></b>${meter(conf / 100, null, { thin: true })}</div></div>
    <span class="q-cta">${ctas}<button class="ic ghost" data-a="theme" title="Colours" aria-label="Colours"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.6"/><path d="M8 2.400v11.200M8 2.400a5.600 5.600 0 0 1 0 11.200" fill="currentColor" stroke="none" opacity=".55"/></svg></button><button class="ghost" data-a="exit">MENU</button></span>`;
  const K = { budget: [t.budget, money], cap: [cap, money], conf: [conf, (v) => `${Math.round(v)}%`] };
  for (const [k, [v, f]] of Object.entries(K)) { tween(el.querySelector(`[data-kp="${k}"]`), v, f, H.kp[k]); H.kp[k] = v; }
}
function topNew() {
  el.querySelector('.q-top').innerHTML = `<div class="q-brand"><i class="q-mark">TP</i><div><b>A new career</b><small>Team principal</small></div></div><div class="q-kpis"></div>
    <span class="q-cta"><button data-a="quick">A SINGLE RACE WEEKEND INSTEAD →</button><button class="ghost" data-a="exit">BACK</button></span>`;
}
/** the rail: made once; the page that is open lit, its light slid to it; what is waiting counted beside INBOX */
function rail() {
  const R = el.querySelector('.q-rail'), c = H.c; if (!R || !c) return;
  if (!R.firstChild) R.innerHTML = `<i class="q-ind"></i>${NAV.map(([g, items]) => `<h5>${g}</h5>${items.map(([k, n]) => `<button data-tab="${k}">${ICON[k] || ''}<span>${n}</span></button>`).join('')}`).join('')}`;
  let on = null; for (const b of R.querySelectorAll('button')) { const is = b.dataset.tab === H.tab; b.classList.toggle('on', is); if (is) on = b; }
  const ind = R.querySelector('.q-ind'); if (on) { ind.style.transform = `translateY(${on.offsetTop}px)`; ind.style.opacity = '1'; } else ind.style.opacity = '0';
  let n = 0; try { n = decisionsOf(c).length + (c.press && !c.press.done ? 1 : 0) + mailBadge(c); } catch (e) { n = 0; }
  const ib = R.querySelector('[data-tab="mail"]'), old = ib.querySelector('.bdg'); if (n) { if (!old) ib.insertAdjacentHTML('beforeend', `<i class="bdg">${n}</i>`); else if (old.textContent !== String(n)) old.textContent = n; } else old?.remove();
  const ap = c.rivals?.approaches?.length || 0, rb = R.querySelector('[data-tab="rivals"]'), ob = rb.querySelector('.bdg'); if (ap) { if (!ob) rb.insertAdjacentHTML('beforeend', `<i class="bdg">${ap}</i>`); else ob.textContent = ap; } else ob?.remove();
}
/** the stage: a page that has just been turned to arrives (its panels one after another); the same page drawn again
 *  after a click stays as it was - each list where it had been scrolled to */
function stage(html) {
  const st = el.querySelector('.q-stage'), same = H._tab === H.tab, keep = {};
  if (same) for (const s of st.querySelectorAll('[data-k], .q-fac')) keep[s.dataset.k || '_fac'] = s.scrollTop;
  st.innerHTML = `<div class="q-page${same ? '' : ' q-enter'}">${html}</div>`; H._tab = H.tab;
  if (same) for (const s of st.querySelectorAll('[data-k], .q-fac')) { const y = keep[s.dataset.k || '_fac']; if (y) s.scrollTop = y; }
}
/** what the last click said: a line at the foot, gone after a few seconds */
let toastT = 0;
function toast() {
  const T = el.querySelector('.q-toast'); if (!T) return; clearTimeout(toastT);
  if (!H.msg) { T.classList.remove('in'); return; }
  T.className = `q-toast in${H.ok ? '' : ' no'}`; T.innerHTML = `<i>${H.ok ? '✓' : '!'}</i><span>${esc(H.msg)}</span>`;
  toastT = setTimeout(() => T.classList.remove('in'), 7000);
}
function body(c) {
  try {
    switch (H.tab) {
      case 'stand': return standHTML(c);
      case 'fac': return `<div class="q-fac fac"><div class="tt-wrap">${techHTML(c, H.S, {})}</div></div>`;
      case 'drv': return driversHTML(c);
      case 'staff': return staffHTML(c);
      case 'fin': return finHTML(c);
      case 'parts': return partsHTML(c);
      case 'facil': return facilHTML(c);
      case 'spons': return sponsHTML(c);
      case 'cal': return calHTML(c);
      default: return mailHTML(c, H.tab, H) ?? extraHTML(c, H.tab, H) ?? eraHTML(c, H.tab) ?? storyHTML(c, H.tab) ?? homeHTML(c);
    }
  } catch (e) { console.warn('[manager hub]', e); return `<div class="q-g">${panel('This page', empty('It could not be drawn.'), { w: 12 })}</div>`; }
}

// ---- the pages -----------------------------------------------------------------------------------------------------------
/** OVERVIEW: the next race (and its circuit), your two drivers side by side, the car; what needs you, the last race, the news */
function homeHTML(c) {
  const t = c.team, D = c.seatsOf(c.myTeam), trk = trackName(c.track), fc = c.fc, L = c.last;
  if (c.seasonDone) return reviewHTML(c);
  const wx = { dry: 'Dry', changeable: 'Changeable', damp: 'Damp', wet: 'Wet' }[fc.weather] || fc.weather, ST = sponsorTargets(c);
  // (before the race: what is ready and what is not - each not-ready line with its page)
  const short = Object.values(t.short || {}).reduce((a, b) => a + (b || 0), 0), worn = D.reduce((n, d) => n + Object.values(t.pu?.[d.id] || {}).filter((u) => (u?.wear || 0) > 0.8).length, 0);
  const chk = (ok, yes, no, tab, btn) => `<div class="q-chk${ok ? '' : ' no'}"><i>${ok ? '✓' : '!'}</i>${ok ? yes : no}${ok ? '' : `<button data-tab="${tab}">${btn}</button>`}</div>`;
  const next = panel(`Round ${c.round} of ${c.rounds} · next`, `<div class="q-map">${outline(c.track)}</div><div class="q-huge">${esc(trk)}</div>
    <div class="q-chips">${tag(`${esc(wx)} · ${fc.time === 'night' ? 'night' : 'day'}`)}${tag(`${c.laps} laps`)}${tag(`Board expects P${c.board.target}`, 'ac')}</div>
    <div style="max-width:56%">${ST.map((x) => kv(`${esc(x.brand)} wants`, `${esc(x.text)} · ${money(x.bonus)}`)).join('') || kv('Sponsors', 'none signed')}
    <div style="margin-top:8px">${chk(c.seatsReady(), 'Both seats filled', 'A seat is empty', 'drv', 'DRIVERS')}${chk(!short, 'Spares in stock', `${short} part${short === 1 ? '' : 's'} raced damaged`, 'parts', 'PARTS')}${chk(!worn, 'Power units healthy', `${worn} element${worn === 1 ? '' : 's'} worn out`, 'parts', 'PARTS')}${chk((t.dev || []).length > 0, `${(t.dev || []).length} part${(t.dev || []).length === 1 ? '' : 's'} in development`, 'The factory is idle', 'fac', 'FACTORY')}</div></div>`, { w: 5, cls: 'hero', scroll: false });
  const drv = panel('Your drivers', `<div class="q-duo">${D.map((d) => `<div class="q-dc"><div class="hd">${ring(d.rating)}<div style="min-width:0"><b>${esc(d.name)}</b><small>${d.points} pts · ${d.wins || 0} wins</small></div><span class="no">${d.number}</span></div>
      <div>${kv('Morale', `${d.morale ?? 60}`)}${meter((d.morale ?? 60) / 100)}</div>${(() => { const m = c.lastRatings?.by?.[d.id], f = (d.marks || []).slice(-5), av = f.length ? f.reduce((x, y) => x + y, 0) / f.length : null; return m ? kv('Last race', `${m.score != null ? `${m.score}/10` : '-'}${av != null ? ` · form ${av.toFixed(1)}` : ''}`, m.score != null && m.score < 5 ? 'bad' : '') : ''; })()}${kv('Contract', `to ${d.until}`, d.until <= c.season ? 'bad' : '')}${kv('Salary', `${money(d.salary)}`)}</div>`).join('') || empty('No drivers.')}</div>`, { w: 4, scroll: false, act: '<button class="ghost" data-tab="drv">MANAGE</button>' });
  const fx = techEffects(t), best = Math.max(...Object.values(c.teams).map((x) => techEffects(x).perf)), gap = (best - fx.perf) * 90, P = partsCount(t);
  const car = panel('The car', `<div class="q-huge">${gap < 0.005 ? 'Fastest' : `+${gap.toFixed(2)}<small style="font-size:13px;color:var(--mute);margin-left:4px">s</small>`}</div><p class="q-fine" style="margin:3px 0 9px">${gap < 0.005 ? 'the quickest car on the grid' : 'a lap to the fastest car'}</p>
    ${kv('Parts', `${P.have} / ${P.total}`)}${meter(P.have / Math.max(1, P.total), 'var(--ac)')}
    <div style="margin-top:8px">${(t.dev || []).length ? t.dev.map((x) => kv(`${esc(UP[x.id]?.short || x.id)} L${x.level}`, `${x.left} race${x.left === 1 ? '' : 's'}`)).join('') : kv('In the factory', 'nothing')}</div>`, { w: 3, act: '<button class="ghost" data-tab="fac">FACTORY</button>' });
  const need = mailHome(c) + storyHome(c) + eraHome(c) + homeExtra(c);
  const needs = panel('Needs you', need || empty('Nothing is waiting for you. The next race is.'), { w: 5, k: 'need' });
  const last = panel(L ? `Last race · round ${L.round}` : 'Last race', L ? `${L.mine.map((m) => `<div class="q-res"><i class="${m.dnf ? 'dnf' : ''}">${m.dnf ? 'DNF' : `P${m.pos}`}</i><b>${esc(m.name)}</b>${m.dnf ? `<small>${esc(m.why || '')}</small>` : `<em>${m.pts} pts</em>`}</div>`).join('')}
    ${kv('Income', `${money(L.income)}${L.sponsor ? ` + ${money(L.sponsor)} sponsors` : ''}`, 'good')}${kv('Wages', `−${money(L.wages)}`)}${kv('Board confidence', `${L.conf0}% → ${L.conf}%`, L.conf > L.conf0 ? 'good' : L.conf < L.conf0 ? 'bad' : '')}
    ${L.parts.length ? kv('New on the car', L.parts.map((x) => `${esc(UP[x.id]?.short || x.id)} L${x.level} (${Math.round(x.q * 100)}%)`).join(', ')) : ''}` : empty('The season has not started.'), { w: 4, k: 'last' });
  const news = panel('News', `<div class="q-news">${c.news.slice(0, 14).map((n) => `<div><small>S${n.season} · R${n.round}</small>${esc(n.text)}</div>`).join('') || empty('Nothing yet.')}</div>`, { w: 3, k: 'news' });
  return `<div class="q-g">${next}${drv}${car}${needs}${last}${news}</div>`;
}
function reviewHTML(c) {
  const r = c.review || c.history[c.history.length - 1] || {};
  const head = r.verdict === 'sacked' ? '<div class="q-verdict bad">The board has let you go.</div>' : r.verdict === 'beaten' ? '<div class="q-verdict good">Target beaten.</div>' : r.verdict === 'met' ? '<div class="q-verdict good">Target met.</div>' : '<div class="q-verdict bad">Target missed.</div>';
  const offers = c.sacked ? `<h3 style="margin:14px 0 6px;font:800 10px/1 var(--f);letter-spacing:.2em;color:var(--dim)">OFFERS</h3>${c.offers.length ? `<p>Not everyone has given up on you.</p><div class="q-acts l">${c.offers.map((n) => `<button class="go" data-a="join" data-v="${esc(n)}">JOIN ${esc(n.toUpperCase())}</button>`).join('')}</div>` : empty('Nobody calls.')}<p><button data-a="erase">END THIS CAREER</button></p>` : '';
  const rev = panel(`Season ${r.season} review`, `${head}${kv('Constructors\' championship', `P${r.pos} (target P${r.target})`)}${kv('Prize money', money(r.prize || 0), 'good')}${kv('Drivers\' champion', esc(r.champ || '-'))}${kv('Constructors\' champions', esc(r.champTeam || '-'))}${kv('Board confidence', `${c.board.conf}%`)}
    ${c.sacked ? '' : '<p class="q-fine">Contracts that end this season run out when the next one starts: extend the ones you want to keep (DRIVERS) before you start it.</p>'}${offers}`, { w: 4, cls: 'hero' });
  return `<div class="q-g">${rev}${conTable(c, 4)}${drvTable(c, 4)}</div>`;
}
function conTable(c, w) {
  const T = c.constructors(), mx = Math.max(1, ...T.map((t) => t.points));
  return panel('Constructors', `<table><thead><tr><th class="n">#</th><th>Team</th><th style="width:28%"></th><th class="n">Pts</th><th class="n">Budget</th></tr></thead><tbody>${T.map((t, i) => `<tr class="${t.name === c.myTeam ? 'me' : ''}"><td class="n">${i + 1}</td><td>${sw(t.color)}<b>${esc(t.name)}</b></td><td>${meter(t.points / mx, t.color, { thin: true })}</td><td class="n"><b>${t.points}</b></td><td class="n">${money(t.budget)}</td></tr>`).join('')}</tbody></table>`, { w, pad: false, k: 'con' });
}
function drvTable(c, w) {
  const D = c.drivers_().slice(0, 22), mx = Math.max(1, ...D.map((d) => d.points));
  return panel('Drivers', `<table><thead><tr><th class="n">#</th><th>Driver</th><th>Team</th><th style="width:22%"></th><th class="n">Pts</th><th class="n">Wins</th></tr></thead><tbody>${D.map((d, i) => `<tr class="${d.team === c.myTeam ? 'me' : ''}"><td class="n">${i + 1}</td><td>${sw(c.teams[d.team]?.color)}<b>${esc(d.name)}</b></td><td><small>${esc(d.team || '-')}</small></td><td>${meter(d.points / mx, c.teams[d.team]?.color, { thin: true })}</td><td class="n"><b>${d.points}</b></td><td class="n">${d.wins || 0}</td></tr>`).join('')}</tbody></table>`, { w, pad: false, k: 'drv' });
}
function standHTML(c) { return `<div class="q-g">${conTable(c, 5)}${drvTable(c, 7)}</div>`; }
/** CALENDAR: every round a card - its circuit, the forecast, what your cars did there, who won */
function calHTML(c) {
  const R = c.results.filter((r) => r.season === c.season);
  return `<div class="q-cal" style="grid-template-columns:repeat(${c.calendar.length > 8 ? 4 : c.calendar.length > 4 ? 4 : c.calendar.length}, minmax(0, 1fr))">${c.calendar.map((k, i) => {
    const r = R.find((x) => x.round === i + 1), w = r ? c.drivers[r.top[0]] : null, fc = c.forecast[i] || {}, now = i + 1 === c.round && !c.seasonDone;
    return `<div class="q-rc${now ? ' now' : r ? ' done' : ''}" style="--i:${i}">${outline(k)}<span class="rn">ROUND ${i + 1}${now ? ' · NEXT' : ''}</span><h4>${esc(trackName(k))}</h4><small>${esc(fc.weather || '')}${fc.time ? ` · ${esc(fc.time)}` : ''}</small>
      <div class="ft">${r ? `${r.mine.map((m) => `<b>${esc(sur(c.drivers[m.id]?.name))}</b> ${m.dnf ? '<span class="bad">DNF</span>' : `P${m.pos}`}`).join(' · ')}<br><small>Won by ${w ? esc(w.name) : '-'}</small>` : now ? `<button class="go" data-a="race"${c.seatsReady() ? '' : ' disabled'}>RACE →</button>` : '<small>to come</small>'}</div></div>`;
  }).join('')}</div>`;
}
/** PARTS: each driver's power unit side by side, the spares under them */
function partsHTML(c) {
  const t = c.team, D = c.seatsOf(c.myTeam), fx = facFx(c, 'factory');
  const pu = D.map((d) => {
    const p = t.pu?.[d.id] || {};
    return panel(`${esc(sur(d.name))} · power unit`, `<table><thead><tr><th>Element</th><th style="width:38%">Wear</th><th class="n">Used</th><th></th></tr></thead><tbody>${Object.entries(PU).map(([k, U]) => {
      const u = p[k] || { used: 1, wear: 0 }, al = allocOf(c, k), over = u.used >= al;
      return `<tr><td><b>${esc(U.short)}</b></td><td>${meter(1 - u.wear, u.wear > 0.8 ? 'var(--bad)' : u.wear > 0.55 ? 'var(--warn)' : 'var(--good)')}<small>${pct(u.wear)} worn${u.wear > 0.7 ? ' · failure risk up' : ''}</small></td><td class="n">${u.used} / ${al}</td>
        <td class="n"><button data-a="fit" data-v="${d.id}|${k}" title="${over ? `Beyond the allocation: a ${Object.keys(PU).some((x) => x !== k && (p[x]?.used || 0) > allocOf(c, x)) ? 5 : 10}-place grid penalty next race` : 'A new unit from the season\'s allocation'}">${over ? 'NEW · PENALTY' : 'FIT NEW'}</button></td></tr>`;
    }).join('')}</tbody></table>`, { w: 6, pad: false, info: 'Each element wears every race weekend - a push fuel mixture wears the ICE faster. A worn unit fails more often (and a worn ICE loses a little power). The allocation per driver per season is the rules\': fit one beyond it and the next race\'s grid costs 10 places (5 for every further element).' });
  }).join('');
  const sp = panel('Spares', `<div class="q-spr">${Object.entries(SPARES).map(([k, S]) => `<div class="q-sp"><h4>${esc(S.name)}</h4><div class="q-sts" style="--n:3">${stat('In stock', t.spares?.[k] ?? 0)}${stat('Damaged', t.short?.[k] || 0, '', t.short?.[k] ? 'bad' : '')}${stat('Being made', (t.making || []).filter((x) => x.part === k).length)}</div><button data-a="spare" data-v="${k}">BUILD · ${money(S.cost * fx.costMul)}</button></div>`).join('')}</div>`, { w: 12, scroll: false, sub: `the factory makes ${fx.perRound} a round`, info: 'Damage and crashes use spares up. A car that needs one with none in stock races the damaged part (a little slower) until the factory has made one. Spares count against the cost cap.' });
  return `<div class="q-g" style="grid-template-rows:minmax(0,1.5fr) minmax(0,1fr)">${pu}${sp}</div>`;
}
/** FACILITIES: the four side by side - its level, its condition, what it does now, what to do with it */
function facilHTML(c) {
  const E = Object.entries(FAC);
  return `<div class="q-g">${E.map(([k, F]) => {
    const f = c.fac[k], nx = f.level + 1, fx = facFx(c, k), eff = k === 'factory' ? `${fx.perRound} spares a round at ${pct(fx.costMul)} of the price` : k === 'hosp' ? `sponsors pay ${pct(fx.sponsorMul)}` : k === 'dil' ? `practice feedback ${pct(fx.setupK)}` : `stops at ${pct(fx.pitMul)} of their time`;
    return panel(esc(F.name), `<div class="q-col"><div><div class="q-huge">${f.level}<small style="font-size:13px;color:var(--mute);margin-left:6px">of ${FAC_MAX}</small></div><div class="q-pips">${Array.from({ length: FAC_MAX }, (_, i) => `<i class="${i < f.level ? 'on' : f.building && i < f.building.to ? 'bd' : ''}"></i>`).join('')}</div>
      ${f.building ? `<p>${tag(`level ${f.building.to} in ${f.building.left} round${f.building.left === 1 ? '' : 's'}`, 'ac')}</p>` : ''}</div>
      <div>${kv('Condition', pct(f.cond), f.cond < 0.5 ? 'bad' : '')}${meter(f.cond)}</div>${kv('Effect now', eff)}<p class="q-fine">${esc(F.what)}</p>
      <div class="q-acts sp"><button data-a="facup" data-v="${k}"${f.building || f.level >= FAC_MAX ? ' disabled' : ''}>UPGRADE · ${money(facCost(k, nx))} · ${facRounds(nx)} rounds</button><button data-a="facmt" data-v="${k}"${f.cond > 0.995 ? ' disabled' : ''}>MAINTAIN · ${money(maintCost(c, k))}</button></div></div>`, { w: 12 / E.length, scroll: false, info: 'A facility wears every round it is used: its effect runs from half (worn out) to full (maintained). An upgrade is capital spending, outside the cost cap; while it is built the facility works at 80 %. The wind tunnel, CFD and the rest that develop the car are in the FACTORY.' });
  }).join('')}</div>`;
}
/** SPONSORS: the contracts you hold on the left, the offers - each to negotiate where it stands - on the right */
function sponsHTML(c) {
  const T = sponsorTargets(c), m = marketability(c), N = H.neg;
  const cur = Object.entries(SPONSOR_SLOTS).map(([k, S]) => { const s = c.sponsors?.[k], tg = T.find((x) => x.slot === k);
    return person({ mark: `<i class="q-mark" style="width:30px;height:30px;font-size:10px;${s ? '' : 'background:color-mix(in srgb, var(--ink) 10%, transparent);box-shadow:none'}">${s ? esc(s.brand.slice(0, 2).toUpperCase()) : '–'}</i>`, name: s ? esc(s.brand) : '<span class="bad">Empty</span>', sub: `${esc(S.name)}${s ? ` · ${money(s.base)} a race · to the end of ${s.until}${tg ? `<br>This weekend: ${esc(tg.text)} · ${money(s.bonus)}` : ''}` : ' · take an offer'}` }); }).join('');
  const offers = (c.spOffers || []).map((o) => {
    const open = N && N.id === o.id, terms = open ? N : { base: 1, bonus: 1, years: o.years }, od = acceptOdds(o, terms);
    return `<div class="q-card${open ? ' open' : ''}"><h4>${esc(SPONSOR_SLOTS[o.slot].name)}</h4><div class="q-big" style="margin-bottom:6px">${esc(o.brand)}</div>
      ${open ? `<div class="q-sts" style="--n:4;margin-bottom:8px">${stat('A race', money(o.base * terms.base))}${stat('On signing', money(o.sign * terms.base))}${stat('Race bonus', money(o.bonus * terms.bonus), o.kind === 'best' ? 'a car near the front' : 'both cars in the points')}${stat('Season bonus', money(o.seasonBonus), 'within one of the target')}</div>
        ${kv('Fee', seg('ng', `base|${N.base}`, [0.9, 1, 1.1, 1.2, 1.35].map((x) => [`base|${x}`, pct(x)])))}${kv('Bonus', seg('ng', `bonus|${N.bonus}`, [0.8, 1, 1.2, 1.4].map((x) => [`bonus|${x}`, pct(x)])))}${kv('Seasons', seg('ng', `years|${N.years}`, [1, 2, 3].map((x) => [`years|${x}`, String(x)])))}
        ${kv('Their answer', od.word, od.p > 0.6 ? 'good' : od.p > 0.4 ? '' : 'bad')}<div class="q-acts l"><button class="go" data-a="prop" data-v="${o.id}"${c.sponsors?.[o.slot] ? ' disabled' : ''}>PROPOSE</button><button data-a="ngx">CLOSE</button><span class="q-fine" style="align-self:center">${o.patience} more proposal${o.patience === 1 ? '' : 's'} before they walk away</span></div>`
      : `${kv('A race', money(o.base))}${kv('On signing', money(o.sign))}${kv('Race bonus', `${money(o.bonus)} · ${o.kind === 'best' ? 'near the front' : 'both in the points'}`)}${kv('Seasons', o.years)}<div class="q-acts l"><button data-a="neg" data-v="${o.id}"${c.sponsors?.[o.slot] ? ' disabled title="That slot is taken"' : ''}>NEGOTIATE</button></div>`}</div>`;
  }).join('');
  return `<div class="q-g">${panel('Contracts', `<div style="margin-bottom:8px">${kv('Marketability', pct(m / 1.7))}${meter(m / 1.7, 'var(--ac)')}</div>${cur}`, { w: 5, k: 'spc' })}${panel('Offers', offers ? `<div class="q-cards">${offers}</div>` : empty('No offers now: new ones come when a slot is empty at the season\'s end.'), { w: 7, k: 'spo' })}</div>`;
}
/** STAFF: the three jobs side by side - who has it, who could */
function staffHTML(c) {
  const E = Object.entries(STAFF_ROLES);
  return `<div class="q-g">${E.map(([k, R]) => {
    const p = c.staff[k], hires = c.hires?.[k] || [];
    return panel(esc(R.name), `<div class="q-dc" style="margin-bottom:10px"><div class="hd">${ring(p?.rating || 0, { big: true })}<div><b>${esc(p?.name || 'Nobody')}</b><small>${money(p?.salary || 0)} a season</small></div></div><p class="q-fine" style="margin:0">${esc(R.what)}</p></div>
      <h3 style="margin:0 0 2px;font:800 9px/1 var(--f);letter-spacing:.2em;color:var(--mute)">AVAILABLE</h3>${hires.map((h, i) => person({ rt: h.rating, sm: true, col: h.rating > (p?.rating || 0) ? 'var(--good)' : 'var(--mute)', name: esc(h.name), sub: `${money(h.salary)} a season · ${money(h.salary * 0.6)} to bring in`, act: `<button data-a="hire" data-v="${k}|${i}">HIRE</button>` })).join('') || empty('Nobody on the market.')}`, { w: 12 / E.length, k: `st${k}` });
  }).join('')}</div>`;
}
/** FINANCES: the season's figures, the cost cap as a ring, the prize money by the constructors' order (yours lit) */
function finHTML(c) {
  const t = c.team, sal = c.salaries(), st = c.staffCost(), spent = c.spent(), pos = c.posOf(c.myTeam), mxp = Math.max(...PRIZE);
  const season = panel('This season', `<div class="q-sts" style="--n:4">${stat('Budget', money(t.budget), '', t.budget < 5 ? 'bad' : '')}${stat('A race pays', money(RACE_INCOME[t.tier]), `+ ${money(POINT_INCOME)} a point`)}${stat('Drivers', money(sal), 'salaries, a season')}${stat('Staff', money(st), 'salaries, a season')}</div>
    <div style="margin-top:14px">${kv('Wages a round', `−${money((sal + st) / Math.max(1, c.rounds))}`)}${kv('Prize money as it stands', `P${pos} · ${money(PRIZE[pos - 1] ?? 1)}`, 'good')}${kv('Rounds left', c.seasonDone ? 0 : c.rounds - c.round + 1)}</div>`, { w: 7, scroll: false });
  const cap = panel('Cost cap', `<div style="display:flex;gap:16px;align-items:center">${ring(Math.min(1, spent / COST_CAP), { big: true, col: spent > COST_CAP * 0.85 ? 'var(--bad)' : 'var(--ac)', text: pct(spent / COST_CAP) })}<div><div class="q-big">${money(spent)}<small>of ${money(COST_CAP)}</small></div><p class="q-fine">Every part and facility built counts against the cap.</p></div></div>
    <div style="margin-top:10px">${kv('Left to spend on development', money(c.capLeft()), c.capLeft() < COST_CAP * 0.15 ? 'bad' : '')}</div>`, { w: 5, scroll: false });
  const prize = panel('Prize money · by the constructors\' order', `<div class="q-prz">${PRIZE.map((p, i) => `<span class="${i + 1 === pos ? 'me' : ''}">P${i + 1}</span>${meter(p / mxp, i + 1 === pos ? 'var(--ac)' : 'color-mix(in srgb, var(--ink) 30%, transparent)')}<b class="${i + 1 === pos ? 'me' : ''}">${money(p)}</b>`).join('')}</div>`, { w: 7, k: 'prz', sub: 'paid at the season\'s end' });
  const out = panel('Where it goes', `${c.seatsOf(c.myTeam).map((d) => kv(esc(d.name), `${money(d.salary)} a season`)).join('')}${Object.entries(STAFF_ROLES).map(([k, R]) => kv(esc(R.name), `${money(c.staff[k]?.salary || 0)} a season`)).join('')}${kv('Development this season', money(spent))}`, { w: 5, k: 'out' });
  return `<div class="q-g">${season}${cap}${prize}${out}</div>`;
}
/** A NEW CAREER: the teams as tiles in their colours (the HQ takes the colours of the one picked), the season, START */
function newHTML() {
  const T = H.o.teams || [], nc = H.nc, cols = T.length > 9 ? 4 : 3;
  const teams = panel('The team you will run', `<div class="q-teams" style="grid-template-columns:repeat(${cols}, minmax(0, 1fr))">${T.map((t, i) => `<button data-a="nteam" data-v="${esc(t.name)}" class="${nc.team === t.name ? 'on' : ''}" style="--c:${t.color};--i:${i}"><b>${esc(t.name)}</b><small>${TIER_NAME[t.tier]} · ${money(TIER_BUDGET[t.tier])} to start</small><small>${esc(t.drivers.join(' & '))}</small></button>`).join('')}</div>`, { w: 8, scroll: false });
  const season = panel('The season', `<div class="q-col">${kv('Rounds', seg('nrounds', nc.rounds, [4, 8, 12].map((n) => [n, String(n)])))}${kv('Race distance', seg('nlaps', nc.laps, [3, 5, 8, 13].map((n) => [n, `${n} laps`])))}
    <p class="q-fine">The calendar cycles ${TRACKS_ALL.map((k) => esc(trackName(k))).join(', ')}. Every team develops its car through the season; you choose what yours builds, who drives it and who runs it - and the board watches the constructors' table.</p>
    <p class="q-fine">Races of 8 laps or more need a pit stop and two dry compounds.</p>
    <button class="go sp" style="padding:14px" data-a="create"${nc.team ? '' : ' disabled'}>${nc.team ? `START WITH ${esc(nc.team.toUpperCase())} →` : 'CHOOSE A TEAM'}</button></div>`, { w: 4, cls: nc.team ? 'hero' : '', scroll: false });
  return `<div class="q-g">${teams}${season}</div>`;
}

// ---- the clicks --------------------------------------------------------------------------------------------------------
function say(text, ok = true) { H.msg = text; H.ok = ok; }
function onClick(e) {
  const b = e.target.closest('button'), th = el.querySelector('.q-theme');
  if (th?.classList.contains('in') && !e.target.closest('.q-theme') && b?.dataset.a !== 'theme') th.classList.remove('in');   // (a click anywhere else puts the colours' panel away)
  // (the RACE menu: opened by its button, put away by a click anywhere else)
  if (H.rm && b?.dataset.a !== 'racemenu') { H.rm = false; el.querySelector('.q-rm')?.classList.remove('in'); }
  if (!b || b.disabled) return;
  const c = H.c, d = b.dataset;
  if (d.a === 'racemenu') { H.rm = !H.rm; el.querySelector('.q-rm')?.classList.toggle('in', H.rm); b.setAttribute('aria-expanded', H.rm ? 'true' : 'false'); return; }
  // (the colours: the panel, and a choice in it - the HQ takes it at once)
  if (d.a === 'theme') { th?.classList.toggle('in'); return; }
  if (d.th) { const [k, v] = d.th.split('|'); themeSet(c?.myTeam || null, k, v); if (c) { themeApply(el, c.myTeam, c.team.color, c.team.color2); th.innerHTML = themeHTML(c.myTeam, c.team.color, c.team.color2); } return; }
  if (d.tab) {
    if (d.tab === H.tab) return;
    H.tab = d.tab; H.msg = null; render();
    // (a matter that belongs to this page comes up here, a moment after the page has: no button asks - ui/ManagerHub3.js storyAmbientPlay)
    if (H.c && H.o.play && !pumping) { const tab = H.tab; clearTimeout(H.ambT); H.ambT = setTimeout(() => { if (!managerHubOpen() || H.tab !== tab || pumping) return; const p = storyAmbientPlay(H.c, tab, H.o.play, H.shown || 0); if (p) { H.shown = (H.shown || 0) + 1; scene(p); } }, 650); }
    return;
  }
  // (the factory: the tech tree's own buttons - ui/HubTech.js)
  if (H.tab === 'fac' && c && Object.keys(d).some((k) => /^t(br|up|dp|lv|dev|re|req)$/.test(k))) {
    const r = techClick(c, d, H.S); if (r) { H.S = r.S || H.S; if (r.S?.tmsg) say(r.S.tmsg, !!r.S.tok); else H.msg = null; render(); }
    return;
  }
  const a = d.a, v = d.v; H.msg = null;
  if (pumping) return;
  if (c && H.o.play) { const p = storyAct(c, a, v, H.o.play); if (p) { scene(p); return; } }   // (the story: ui/ManagerHub3.js)
  if (c) { const r = mailClick(c, a, v, H); if (r !== undefined) { if (r) say(r.text, r.ok); render(); return; } }   // (the mail, and everything that is asked by mail - an approach, a hire, terms: ui/ManagerMail.js)
  if (c) { const r = extraClick(c, a, v); if (r !== undefined) { if (r) say(r.text, r.ok); render(); return; } }   // (the crew, the people, the car: ui/ManagerHub2.js)
  if (c) { const r = eraClick(c, a, v); if (r !== undefined) { if (r) say(r.text, r.ok); render(); return; } }   // (the rivals, the market, the academy: ui/ManagerHub4.js)
  if (a === 'exit') { H.o.onExit?.(); return; }
  if (a === 'quick') { H.o.onQuick?.(); return; }
  if (a === 'nteam') H.nc.team = v; else if (a === 'nrounds') H.nc.rounds = +v; else if (a === 'nlaps') H.nc.laps = +v;
  else if (a === 'create') { H.c = ManagerCareer.create({ team: H.nc.team, rounds: H.nc.rounds, laps: H.nc.laps }); H.tab = 'home'; H.o.onCreate?.(H.c); render(); pump(); return; }
  else if (!c) { /* nothing */ }
  else if (a === 'race') { H.o.onRace?.(c, v || null); return; }
  else if (a === 'sim') { const rep = H.o.onSim?.(c); if (rep) say(`Round ${rep.round} simulated: ${rep.mine.map((m) => `${sur(m.name)} ${m.dnf ? 'DNF' : `P${m.pos}`}`).join(', ')}.`); H.tab = 'home'; H._tab = null; render(); pump(); return; }
  else if (a === 'next') { c.nextSeason(); H.tab = 'home'; H._tab = null; say(`Season ${c.season}: ${c.rounds} rounds. The board expects P${c.board.target}.`); render(); pump(); return; }
  else if (a === 'join') { c.nextSeason(v); H.tab = 'home'; H._tab = null; say(`You are ${v}'s team principal now.`); el.dataset.mode = ''; render(); pump(); return; }
  else if (a === 'erase') { ManagerCareer.erase(); H.c = null; H.tab = 'new'; }
  else if (a === 'extend') { const [id, y] = String(v).split('|'); const r = c.extend(id, +y || 1); say(r, /extends to/.test(r)); }
  else if (a === 'release') { const r = c.release(v), ok = !/^Not/.test(r); say(r, ok); if (ok && H.o.play) { const m = storyReleased(c, v); if (m) { scene(H.o.play(m.scene, m.ctx).then((res) => { storyShown(c, m.key); storyApply(c, m.key, res || {}); return r; })); return; } } }
  else if (a === 'sign') { const [sid, sy] = String(v).split('|'); const r = c.sign(sid, +sy || 2), ok = !/^(Not|Both)/.test(r); say(r, ok); if (ok && H.o.play) { const m = storySigning(c, sid); if (m) { scene(H.o.play(m.scene, m.ctx).then((res) => { storyShown(c, m.key); storyApply(c, m.key, res || {}); return r; })); return; } } }
  else if (a === 'fit') { const [did, pe] = String(v).split('|'); say(fitNew(c, c.myTeam, did, pe)); c.save(); }
  else if (a === 'spare') { const r = orderSpare(c, v); say(r, !/^(Not|Over|No )/.test(r)); c.save(); }
  else if (a === 'facup') { const r = facUpgrade(c, v); say(r, !/^(Not|No |.*already|.*highest)/.test(r)); c.save(); }
  else if (a === 'facmt') { const r = facMaintain(c, v); say(r, !/^Not/.test(r)); c.save(); }
  else if (a === 'neg') { const o = c.spOffers.find((x) => x.id === v); H.neg = o ? { id: o.id, base: 1, bonus: 1, years: o.years } : null; }
  else if (a === 'ng') { const [k, x] = String(v).split('|'); if (H.neg) H.neg[k] = +x; }
  else if (a === 'ngx') H.neg = null;
  else if (a === 'prop') { const r = propose(c, v, H.neg || { base: 1, bonus: 1, years: 1 }); say(r, /signs/.test(r)); if (!c.spOffers.some((x) => x.id === v)) H.neg = null; c.save(); }
  else if (a === 'hire') { const [k, i] = String(v).split('|'); const r = c.hire(k, +i); say(r, !/^(Not|No )/.test(r)); }
  render();
}
