// The team principal's HQ (career/Manager.js): between the race weekends, the team's home. The header holds what
// matters every day - the budget, what is left under the cost cap, the board's confidence, where the team stands - and
// the next weekend (RACE: watched on the feed and run from the pit wall; SIMULATE: the result at once). The tabs:
// OVERVIEW (the next round, its forecast and the sponsor's target, your drivers, the last race, the news; at the
// season's end, its review and the board's verdict), STANDINGS (both championships), FACTORY (the tech tree - ui/
// HubTech.js, where you BUILD), DRIVERS (your two: extend, release; the free agents: sign), STAFF (the technical
// director, the head of strategy, the pit crew chief: who you have, who you could hire), FINANCES and CALENDAR. A new
// career starts here too: the team, the season's length, the race distance.
//   openManagerHub({ career, teams, trackName, onRace(c), onSim(c), onQuick(), onExit() }) / closeManagerHub()
import { TECH_CSS, techHTML, techClick } from './HubTech.js';
import { ManagerCareer, TRACKS_ALL, COST_CAP, PRIZE, TIER_NAME, TIER_BUDGET, RACE_INCOME, POINT_INCOME, STAFF_ROLES, askOf } from '../career/Manager.js';
import { techEffects, UP, upgradeName, partsCount } from '../career/TechTree.js';
import { EXTRA_TABS, extraHTML, extraClick, homeExtra } from './ManagerHub2.js';
import { STORY_TABS, storyHTML, storyHome, storyAct, storyPump } from './ManagerHub3.js';
import { storySigning, storyReleased, storyShown, storyApply } from '../career/ManagerStory.js';
import { PU, SPARES, allocOf, fitNew, orderSpare, FAC, FAC_MAX, facCost, facRounds, facFx, facUpgrade, facMaintain, maintCost, SPONSOR_SLOTS, acceptOdds, propose, sponsorTargets, marketability } from '../career/ManagerOps.js';

const CSS = `
#mgr { position: fixed; inset: 0; z-index: 60; background: #eef1f5; color: #151a22; font-family: "Segoe UI Variable", "Segoe UI", Inter, system-ui, Roboto, sans-serif; display: flex; flex-direction: column; overflow: hidden; }
#mgr button { font: inherit; cursor: pointer; border-radius: 9px; border: 1px solid rgba(21,26,34,.14); background: #fff; color: #151a22; padding: 7px 12px; font-size: 12px; font-weight: 700; letter-spacing: .04em; }
#mgr button:hover:not(:disabled) { border-color: rgba(21,26,34,.35); }
#mgr button:disabled { opacity: .45; cursor: default; }
#mgr button.m-go { background: #e10600; border-color: #e10600; color: #fff; }
#mgr button.m-dark { background: #151a22; border-color: #151a22; color: #fff; }
#mgr .m-mh { display: flex; flex-wrap: wrap; row-gap: 8px; align-items: center; gap: 16px; padding: 12px 20px; background: #fff; border-bottom: 1px solid rgba(21,26,34,.08); position: relative; }
#mgr .m-mh::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--tc, #888); }
#mgr .m-mh .m-tn { display: flex; flex-direction: column; min-width: 0; }
#mgr .m-mh .m-tn small { font-size: 10px; font-weight: 700; letter-spacing: .18em; color: #6b7480; text-transform: uppercase; }
#mgr .m-mh .m-tn b { font-size: 22px; font-weight: 900; letter-spacing: .01em; white-space: nowrap; }
#mgr .m-kp { display: flex; gap: 8px; margin-left: auto; flex-wrap: wrap; }
#mgr .m-k { background: #f4f6f9; border-radius: 10px; padding: 6px 10px; min-width: 78px; }
#mgr .m-k small { display: block; font-size: 9px; font-weight: 700; letter-spacing: .16em; color: #6b7480; text-transform: uppercase; }
#mgr .m-k b { display: block; font-size: 16px; font-weight: 800; margin-top: 3px; white-space: nowrap; }
#mgr .m-k b.m-bad { color: #d4351c; } #mgr .m-k b.m-ok { color: #1d8a4e; }
#mgr .m-mn { display: flex; gap: 2px; padding: 0 16px; background: #fff; border-bottom: 1px solid rgba(21,26,34,.08); overflow-x: auto; }
#mgr .m-mn button { border: 0; border-radius: 0; background: none; padding: 11px 9px; font-size: 10.5px; letter-spacing: .1em; color: #6b7480; border-bottom: 3px solid transparent; }
#mgr .m-mn button.m-on { color: #151a22; border-bottom-color: var(--tc, #e10600); }
#mgr .m-mn .m-sp { flex: 1; }
#mgr .m-ctas { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
#mgr .m-ctas button { border: 1px solid rgba(21,26,34,.14); border-radius: 9px; background: #fff; color: #151a22; padding: 7px 12px; font-size: 11px; letter-spacing: .08em; }
#mgr .m-ctas button.m-go { background: #e10600; border-color: #e10600; color: #fff; }
#mgr .m-ctas button.m-dark { background: #151a22; border-color: #151a22; color: #fff; }
#mgr .m-mb { flex: 1; overflow-y: auto; padding: 18px 20px 30px; }
#mgr .m-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 14px; align-items: start; }
#mgr .m-card { background: #fff; border-radius: 14px; padding: 14px 16px; box-shadow: 0 2px 12px rgba(25,35,60,.05); border: 1px solid rgba(21,26,34,.06); }
#mgr .m-card h3 { margin: 0 0 10px; font-size: 11px; letter-spacing: .18em; color: #6b7480; text-transform: uppercase; }
#mgr .m-card .m-big { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
#mgr .m-card p { margin: 6px 0; font-size: 13px; line-height: 1.45; color: #303846; }
#mgr .m-row2 { display: flex; justify-content: space-between; gap: 10px; padding: 5px 0; font-size: 13px; border-bottom: 1px solid rgba(21,26,34,.05); }
#mgr .m-row2 span { color: #6b7480; } #mgr .m-row2 b { text-align: right; }
#mgr table { width: 100%; border-collapse: collapse; font-size: 13px; }
#mgr th { text-align: left; font-size: 10px; letter-spacing: .14em; color: #6b7480; text-transform: uppercase; padding: 6px 6px; border-bottom: 1px solid rgba(21,26,34,.1); }
#mgr td { padding: 6px; border-bottom: 1px solid rgba(21,26,34,.05); white-space: nowrap; }
#mgr tr.m-me td { background: #fff7e6; font-weight: 700; }
#mgr .m-sw { display: inline-block; width: 4px; height: 14px; border-radius: 2px; margin-right: 7px; vertical-align: -2px; }
#mgr .m-news div { padding: 6px 0; font-size: 13px; border-bottom: 1px solid rgba(21,26,34,.05); line-height: 1.4; }
#mgr .m-news small { color: #8a93a0; font-weight: 700; margin-right: 6px; }
#mgr .m-msg { margin: 0 0 12px; padding: 10px 13px; border-radius: 10px; font-size: 13px; background: #effaf3; border: 1px solid #bfe8cf; color: #1d5e3c; }
#mgr .m-msg.m-no { background: #fff4f2; border-color: #ffc9c1; color: #8f2a20; }
#mgr .m-bar { height: 7px; border-radius: 4px; background: #e6e9ee; overflow: hidden; margin-top: 6px; } #mgr .m-bar i { display: block; height: 100%; background: var(--bc, #1fae64); }
#mgr .m-drv { display: flex; align-items: center; gap: 12px; padding: 9px 0; border-bottom: 1px solid rgba(21,26,34,.06); }
#mgr .m-drv .m-nm { flex: 1; min-width: 0; } #mgr .m-drv .m-nm b { display: block; font-size: 15px; } #mgr .m-drv .m-nm small { color: #6b7480; font-size: 12px; }
#mgr .m-drv .m-rt { font: 900 20px/1 inherit; width: 44px; text-align: center; }
#mgr .m-acts { display: flex; gap: 6px; flex-wrap: wrap; }
#mgr .m-teams { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; }
#mgr .m-teams button { text-align: left; padding: 10px 12px; border-left: 5px solid var(--c); }
#mgr .m-teams button.m-on { outline: 2px solid #151a22; }
#mgr .m-teams button small { display: block; color: #6b7480; font-weight: 600; font-size: 11px; margin-top: 3px; letter-spacing: 0; }
#mgr .m-seg { display: inline-flex; gap: 4px; flex-wrap: wrap; } #mgr .m-seg button.m-on { background: #151a22; color: #fff; border-color: #151a22; }
#mgr .fac { max-width: 860px; }
#mgr .m-verdict { font-size: 26px; font-weight: 900; margin: 4px 0 8px; } #mgr .m-verdict.m-bad { color: #d4351c; } #mgr .m-verdict.m-good { color: #1d8a4e; }
@media (max-width: 700px) { #mgr .m-mh { flex-wrap: wrap; } #mgr .m-kp { margin-left: 0; } }
/* less to read at a glance: a row's explanation is one line until the row is pointed at; the long notes fold away */
#mgr .m-drv .m-nm small:not([style]) { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden; }
#mgr .m-drv:hover .m-nm small:not([style]), #mgr .m-drv:focus-within .m-nm small:not([style]) { -webkit-line-clamp: 8; }
#mgr details.m-note { margin-top: 8px; font-size: 12px; color: #6b7480; }
#mgr details.m-note summary { cursor: pointer; list-style: none; font: 700 10px/1.4 inherit; letter-spacing: .1em; text-transform: uppercase; color: #8a93a0; user-select: none; }
#mgr details.m-note summary::-webkit-details-marker { display: none; } #mgr details.m-note summary::before { content: 'ⓘ  '; } #mgr details.m-note summary:hover { color: #151a22; }
#mgr details.m-note p { margin: 6px 0 0; }
/* a laptop's height: the header and the cards drawn tighter, more of the page on the screen */
@media (max-height: 860px) { #mgr .m-mh { padding: 7px 16px; gap: 10px; row-gap: 5px; } #mgr .m-mh .m-tn b { font-size: 17px; } #mgr .m-mh .m-tn small { font-size: 9px; } #mgr .m-k { padding: 4px 9px; } #mgr .m-k b { font-size: 14px; } #mgr .m-mn button { padding: 8px 9px; } #mgr .m-mb { padding: 12px 14px 20px; } #mgr .m-card { padding: 10px 12px; } #mgr .m-drv { padding: 6px 0; gap: 9px; } #mgr .m-grid { gap: 10px; } #mgr .m-card h3 { margin-bottom: 6px; } #mgr .m-go, #mgr .m-dark { padding-top: 7px; padding-bottom: 7px; } }
`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (m) => `$${(Math.round(m * 10) / 10).toFixed(1)}M`;
const sur = (n) => String(n || '').split(' ').pop();
const H = { tab: 'home', S: {}, msg: null, ok: true, o: null, c: null, nc: { team: null, rounds: 8, laps: 5 } };
let el = null;

/** the HQ (or, with no career, the new career's set-up) */
export function openManagerHub(o) {
  H.o = o; H.c = o.career || null; H.msg = null; if (!H.c) H.tab = 'new'; else if (H.tab === 'new') H.tab = 'home';
  if (!document.getElementById('mgr-css')) { const st = document.createElement('style'); st.id = 'mgr-css'; st.textContent = CSS + TECH_CSS.replaceAll('#career', '#mgr .fac'); document.head.appendChild(st); }
  if (!el) { el = document.createElement('div'); el.id = 'mgr'; el.addEventListener('click', onClick); document.body.appendChild(el); }
  el.style.display = 'flex'; render(); pump();
}
/** the story's scenes that play themselves on coming back to the HQ (ui/ManagerHub3.js; o.play shows one) */
let pumping = false;
function pump() {
  if (!H.c || !H.o.play || pumping) return; pumping = true;
  storyPump(H.c, H.o.play).then((lines) => { pumping = false; if (lines.length) say(lines[lines.length - 1]); if (managerHubOpen()) render(); }, () => { pumping = false; });
}
/** a scene asked for from a page (a matter watched, a signing): shown, then the page drawn again with what it said */
function scene(p) { pumping = true; p.then((t) => { pumping = false; if (t) say(t); if (managerHubOpen()) render(); }, () => { pumping = false; }); }
export function closeManagerHub() { if (el) el.style.display = 'none'; }
export function managerHubOpen() { return !!el && el.style.display !== 'none'; }

function render() {
  const c = H.c;
  // (the page stays where it was scrolled to when a button on it redraws it - only a change of page starts at the top)
  const mb0 = el.querySelector('.m-mb'), keep = mb0 && H._tab === H.tab ? mb0.scrollTop : 0; H._tab = H.tab;
  requestAnimationFrame(() => { const mb = el.querySelector('.m-mb'); if (mb && keep) mb.scrollTop = keep; }); queueMicrotask(() => { const mb = el.querySelector('.m-mb'); if (mb && keep) mb.scrollTop = keep; });
  if (!c) { el.innerHTML = newHTML(); el.style.setProperty('--tc', '#e10600'); return; }
  const t = c.team, pos = c.posOf(c.myTeam), conf = c.board.conf;
  el.style.setProperty('--tc', t.color);
  const trk = H.o.trackName?.(c.track) || c.track, ready = c.seatsReady();
  const ctas = c.seasonDone ? (c.sacked ? '' : '<button class="m-go" data-a="next">START NEXT SEASON →</button>')
    : `<button class="m-dark" data-a="sim"${ready ? '' : ' disabled'} title="The weekend's result at once">SIMULATE</button><button class="m-go" data-a="race"${ready ? '' : ' disabled title="Both seats need a driver"'}>RACE · ${esc(trk.toUpperCase())} →</button>`;
  el.innerHTML = `<div class="m-mh"><div class="m-tn"><small>Team principal · Season ${c.season}${c.seasonDone ? ' · over' : ` · Round ${c.round} of ${c.rounds}`}</small><b>${esc(t.name)}</b></div>
    <div class="m-kp"><div class="m-k"><small>Budget</small><b class="${t.budget < 5 ? 'm-bad' : ''}">${money(t.budget)}</b></div><div class="m-k"><small>Cost cap left</small><b>${money(c.capLeft())}</b></div>
    <div class="m-k"><small>Constructors</small><b>P${pos}<span style="font-size:11px;color:#8a93a0"> · target P${c.board.target}</span></b></div><div class="m-k"><small>Board</small><b class="${conf < 30 ? 'm-bad' : conf >= 65 ? 'm-ok' : ''}">${conf}%</b></div></div><span class="m-ctas">${ctas}<button data-a="exit">MENU</button></span></div>
    <div class="m-mn">${[['home', 'OVERVIEW'], ['stand', 'STANDINGS'], ['fac', 'FACTORY'], ['drv', 'DRIVERS'], ['parts', 'PARTS'], ['facil', 'FACILITIES'], ['spons', 'SPONSORS'], ['staff', 'STAFF'], ...EXTRA_TABS, ...STORY_TABS, ['fin', 'FINANCES'], ['cal', 'CALENDAR']].map(([k, n]) => `<button data-tab="${k}" class="${H.tab === k ? 'm-on' : ''}">${n}</button>`).join('')}</div>
    <div class="m-mb">${H.msg ? `<div class="m-msg ${H.ok ? '' : 'm-no'}">${esc(H.msg)}</div>` : ''}${body(c)}</div>`;
}
function body(c) {
  try {
    switch (H.tab) {
      case 'stand': return standHTML(c);
      case 'fac': return `<div class="fac"><div class="tt-wrap">${techHTML(c, H.S, {})}</div></div>`;
      case 'drv': return drvHTML(c);
      case 'staff': return staffHTML(c);
      case 'fin': return finHTML(c);
      case 'parts': return partsHTML(c);
      case 'facil': return facilHTML(c);
      case 'spons': return sponsHTML(c);
      case 'cal': return calHTML(c);
      default: return extraHTML(c, H.tab, H) ?? storyHTML(c, H.tab) ?? homeHTML(c);
    }
  } catch (e) { console.warn('[manager hub]', e); return '<div class="m-card"><p>This page could not be drawn.</p></div>'; }
}

// ---- the pages -----------------------------------------------------------------------------------------------------------
function homeHTML(c) {
  const t = c.team, D = c.seatsOf(c.myTeam), trk = H.o.trackName?.(c.track) || c.track, fc = c.fc, L = c.last;
  if (c.seasonDone) return reviewHTML(c);
  const nextCard = `<div class="m-card"><h3>Next · Round ${c.round}</h3><div class="m-big">${esc(trk)}</div>
    <div class="m-row2"><span>Forecast</span><b>${esc({ dry: 'Dry', changeable: 'Changeable', damp: 'Damp', wet: 'Wet' }[fc.weather] || fc.weather)} · ${fc.time === 'night' ? 'night' : 'day'}</b></div>
    <div class="m-row2"><span>Distance</span><b>${c.laps} laps</b></div>
    ${sponsorTargets(c).map((x) => `<div class="m-row2"><span>${esc(x.brand)}'s target</span><b>${esc(x.text)} · ${money(x.bonus)}</b></div>`).join('') || '<div class="m-row2"><span>Sponsors</span><b>none signed - SPONSORS</b></div>'}
    <div class="m-row2"><span>The board expects</span><b>P${c.board.target} in the constructors'</b></div>
    ${c.seatsReady() ? '' : '<p style="color:#d4351c"><b>A seat is empty:</b> sign a driver (DRIVERS) before the race.</p>'}</div>`;
  const fx = techEffects(t), best = Math.max(...Object.values(c.teams).map((x) => techEffects(x).perf)), gap = (best - fx.perf) * 90, P = partsCount(t);
  const carCard = `<div class="m-card"><h3>The car</h3><div class="m-row2"><span>Pace</span><b>${gap < 0.005 ? 'the fastest car' : `+${gap.toFixed(2)} s a lap to the fastest`}</b></div>
    <div class="m-row2"><span>Parts</span><b>${P.have} / ${P.total}</b></div><div class="m-row2"><span>In the factory</span><b>${(t.dev || []).length ? t.dev.map((x) => `${esc(UP[x.id]?.short || x.id)} L${x.level} (${x.left})`).join(', ') : 'nothing - FACTORY to build'}</b></div></div>`;
  const drvCard = `<div class="m-card"><h3>Your drivers</h3>${D.map((d) => `<div class="m-drv"><div class="m-rt">${Math.round(d.rating * 100)}</div><div class="m-nm"><b>${esc(d.name)}</b><small>#${d.number} · ${d.points} pts · contract to ${d.until} · ${money(d.salary)}/season</small></div></div>`).join('') || '<p>No drivers.</p>'}</div>`;
  const lastCard = L ? `<div class="m-card"><h3>Last race · Round ${L.round}</h3>${L.mine.map((m) => `<div class="m-row2"><span>${esc(m.name)}</span><b>${m.dnf ? `DNF${m.why ? ` · ${esc(m.why)}` : ''}` : `P${m.pos} · ${m.pts} pts`}</b></div>`).join('')}
    <div class="m-row2"><span>Income</span><b>${money(L.income)}${L.sponsor ? ` + sponsor ${money(L.sponsor)}` : ''}</b></div><div class="m-row2"><span>Wages</span><b>-${money(L.wages)}</b></div>
    <div class="m-row2"><span>Board confidence</span><b>${L.conf0}% → ${L.conf}%</b></div>${L.parts.length ? `<div class="m-row2"><span>New on the car</span><b>${L.parts.map((x) => `${esc(UP[x.id]?.short || x.id)} L${x.level} (${Math.round(x.q * 100)}%)`).join(', ')}</b></div>` : ''}</div>` : '';
  const news = `<div class="m-card"><h3>News</h3><div class="m-news">${c.news.slice(0, 10).map((n) => `<div><small>S${n.season} R${n.round}</small>${esc(n.text)}</div>`).join('')}</div></div>`;
  return `<div class="m-grid">${nextCard}${storyHome(c)}${homeExtra(c)}${lastCard}${drvCard}${carCard}${news}</div>`;
}
function reviewHTML(c) {
  const r = c.review || c.history[c.history.length - 1] || {};
  const head = r.verdict === 'sacked' ? '<div class="m-verdict m-bad">The board has let you go.</div>' : r.verdict === 'beaten' ? '<div class="m-verdict m-good">Target beaten.</div>' : r.verdict === 'met' ? '<div class="m-verdict m-good">Target met.</div>' : '<div class="m-verdict m-bad">Target missed.</div>';
  const offers = c.sacked ? `<div class="m-card"><h3>Offers</h3>${c.offers.length ? `<p>Not everyone has given up on you.</p><div class="m-acts">${c.offers.map((n) => `<button class="m-go" data-a="join" data-v="${esc(n)}">JOIN ${esc(n.toUpperCase())}</button>`).join('')}</div>` : '<p>Nobody calls.</p>'}<p><button data-a="erase">END THIS CAREER</button></p></div>` : '';
  return `<div class="m-grid"><div class="m-card"><h3>Season ${r.season} review</h3>${head}
    <div class="m-row2"><span>Constructors' championship</span><b>P${r.pos} (target P${r.target})</b></div><div class="m-row2"><span>Prize money</span><b>${money(r.prize || 0)}</b></div>
    <div class="m-row2"><span>Drivers' champion</span><b>${esc(r.champ || '-')}</b></div><div class="m-row2"><span>Constructors' champions</span><b>${esc(r.champTeam || '-')}</b></div>
    <div class="m-row2"><span>Board confidence</span><b>${c.board.conf}%</b></div>
    ${c.sacked ? '' : `<p>Contracts that end this season run out when the next one starts: extend the ones you want to keep (DRIVERS) before you start it.</p>`}</div>${offers}${standHTML(c)}</div>`;
}
function standHTML(c) {
  const T = c.constructors(), D = c.drivers_().slice(0, 22);
  return `<div class="m-grid"><div class="m-card"><h3>Constructors</h3><table><tr><th>#</th><th>Team</th><th>Pts</th><th>Budget</th></tr>${T.map((t, i) => `<tr class="${t.name === c.myTeam ? 'm-me' : ''}"><td>${i + 1}</td><td><span class="m-sw" style="background:${t.color}"></span>${esc(t.name)}</td><td>${t.points}</td><td>${money(t.budget)}</td></tr>`).join('')}</table></div>
    <div class="m-card"><h3>Drivers</h3><table><tr><th>#</th><th>Driver</th><th>Team</th><th>Pts</th><th>W</th></tr>${D.map((d, i) => `<tr class="${d.team === c.myTeam ? 'm-me' : ''}"><td>${i + 1}</td><td><span class="m-sw" style="background:${c.teams[d.team]?.color || '#bbb'}"></span>${esc(d.name)}</td><td>${esc(d.team || '-')}</td><td>${d.points}</td><td>${d.wins || 0}</td></tr>`).join('')}</table></div></div>`;
}
function drvHTML(c) {
  const D = c.seatsOf(c.myTeam), F = c.freeAgents().slice(0, 14), empty = !c.seatsReady();
  const mine = D.map((d) => `<div class="m-drv"><div class="m-rt">${Math.round(d.rating * 100)}</div><div class="m-nm"><b>${esc(d.name)}</b><small>#${d.number} · ${d.points} pts · ${d.starts || 0} starts, ${d.wins || 0} wins · ${money(d.salary)}/season to the end of ${d.until}</small></div>
    <div class="m-acts"><button data-a="extend" data-v="${d.id}" title="One more season; they will ask ${money(Math.max(d.salary * 1.08, askOf(d.rating)))}">EXTEND</button><button data-a="release" data-v="${d.id}" title="Paying off the contract: ${money(c.releaseCost(d))}">RELEASE · ${money(c.releaseCost(d))}</button></div></div>`).join('');
  const free = F.map((d) => `<div class="m-drv"><div class="m-rt">${Math.round(d.rating * 100)}</div><div class="m-nm"><b>${esc(d.name)}</b><small>${esc(d.from)} · asks ${money(askOf(d.rating))}/season · signing fee ${money(askOf(d.rating) * 0.5)}</small></div>
    <div class="m-acts"><button class="${empty ? 'm-go' : ''}" data-a="sign" data-v="${d.id}"${empty ? '' : ' disabled title="Both seats are taken: release a driver first"'}>SIGN</button></div></div>`).join('');
  return `<div class="m-grid"><div class="m-card"><h3>Your drivers</h3>${mine || '<p>No drivers.</p>'}<p style="font-size:12px;color:#6b7480">Rating: their pace and racecraft (out of 100). A contract that ends this season runs out when the next starts - extend to keep them.</p></div>
    <div class="m-card"><h3>Free agents</h3>${free || '<p>Nobody is free.</p>'}</div></div>`;
}
const pct = (x) => `${Math.round(x * 100)}%`;
const bar = (x, bad) => `<div class="m-bar" style="--bc:${bad ? '#d4351c' : x > 0.5 ? '#1fae64' : '#e0a100'}"><i style="width:${(Math.max(0, Math.min(1, x)) * 100).toFixed(0)}%"></i></div>`;
function partsHTML(c) {
  const t = c.team, D = c.seatsOf(c.myTeam), fx = facFx(c, 'factory');
  const pu = D.map((d) => {
    const p = t.pu?.[d.id] || {};
    return `<div class="m-card"><h3>${esc(d.name)} · power unit</h3><table><tr><th>Element</th><th>Wear</th><th>Used</th><th></th></tr>${Object.entries(PU).map(([k, P]) => {
      const u = p[k] || { used: 1, wear: 0 }, al = allocOf(c, k), over = u.used >= al;
      return `<tr><td>${esc(P.short)}</td><td style="width:40%">${bar(1 - u.wear, u.wear > 0.8)}<small style="color:#6b7480">${pct(u.wear)} worn${u.wear > 0.7 ? ' · failure risk up' : ''}</small></td><td>${u.used} / ${al}</td>
        <td><button data-a="fit" data-v="${d.id}|${k}" title="${over ? `Beyond the allocation: a ${Object.keys(PU).some((x) => x !== k && (p[x]?.used || 0) > allocOf(c, x)) ? 5 : 10}-place grid penalty next race` : 'A new unit from the season\'s allocation'}">${over ? 'NEW · PENALTY' : 'FIT NEW'}</button></td></tr>`;
    }).join('')}</table></div>`;
  }).join('');
  const sp = `<div class="m-card"><h3>Spares</h3><table><tr><th>Part</th><th>In stock</th><th>Racing damaged</th><th>Being made</th><th></th></tr>${Object.entries(SPARES).map(([k, S]) => `<tr><td>${esc(S.name)}</td><td>${t.spares?.[k] ?? 0}</td><td style="color:${t.short?.[k] ? '#d4351c' : 'inherit'}">${t.short?.[k] || 0}</td><td>${(t.making || []).filter((x) => x.part === k).length}</td><td><button data-a="spare" data-v="${k}">BUILD · ${money(S.cost * fx.costMul)}</button></td></tr>`).join('')}</table>
    <p style="font-size:12px;color:#6b7480">Damage and crashes use spares up. A car that needs one with none in stock races the damaged part (a little slower) until the factory has made one. The factory makes ${fx.perRound} a round (FACILITIES); spares count against the cost cap.</p></div>`;
  return `<div class="m-grid">${pu}${sp}</div><p style="font-size:12px;color:#6b7480;margin-top:12px">Each element wears every race weekend - a push fuel mixture wears the ICE faster. A worn unit fails more often (and a worn ICE loses a little power). The allocation per driver per season is the rules': fit one beyond it and the next race's grid costs 10 places (5 for every further element).</p>`;
}
function facilHTML(c) {
  const cards = Object.entries(FAC).map(([k, F]) => {
    const f = c.fac[k], nx = f.level + 1, fx = facFx(c, k), eff = k === 'factory' ? `${fx.perRound} spares a round at ${pct(fx.costMul)} of the price` : k === 'hosp' ? `sponsors pay ${pct(fx.sponsorMul)}` : k === 'dil' ? `practice feedback ${pct(fx.setupK)}` : `stops at ${pct(fx.pitMul)} of their time`;
    return `<div class="m-card"><h3>${esc(F.name)}</h3><div class="m-big">Level ${f.level}<span style="font-size:13px;color:#6b7480;font-weight:600"> of ${FAC_MAX}${f.building ? ` · level ${f.building.to} in ${f.building.left} round${f.building.left === 1 ? '' : 's'}` : ''}</span></div>
      <div class="m-row2"><span>Condition</span><b>${pct(f.cond)}</b></div>${bar(f.cond, f.cond < 0.5)}<div class="m-row2"><span>Effect now</span><b>${eff}</b></div>
      <p style="font-size:12px;color:#6b7480">${esc(F.what)}</p><div class="m-acts"><button data-a="facup" data-v="${k}"${f.building || f.level >= FAC_MAX ? ' disabled' : ''}>UPGRADE · ${money(facCost(k, nx))} · ${facRounds(nx)} rounds</button><button data-a="facmt" data-v="${k}"${f.cond > 0.995 ? ' disabled' : ''}>MAINTAIN · ${money(maintCost(c, k))}</button></div></div>`;
  }).join('');
  return `<div class="m-grid">${cards}</div><p style="font-size:12px;color:#6b7480;margin-top:12px">A facility wears every round it is used: its effect runs from half (worn out) to full (maintained). An upgrade is capital spending, outside the cost cap; while it is built the facility works at 80 %. The wind tunnel, CFD and the rest that develop the car are in the FACTORY's tech tree.</p>`;
}
function sponsHTML(c) {
  const T = sponsorTargets(c), m = marketability(c);
  const cur = Object.entries(SPONSOR_SLOTS).map(([k, S]) => { const s = c.sponsors?.[k], tg = T.find((x) => x.slot === k);
    return `<tr><td>${esc(S.name)}</td><td>${s ? `<b>${esc(s.brand)}</b>` : '<span style="color:#d4351c">empty</span>'}</td><td>${s ? money(s.base) : ''}</td><td>${s && tg ? `${esc(tg.text)} · ${money(s.bonus)}` : ''}</td><td>${s ? `to the end of ${s.until}` : ''}</td></tr>`; }).join('');
  const N = H.neg;
  const offers = (c.spOffers || []).map((o) => {
    const open = N && N.id === o.id, terms = open ? N : { base: 1, bonus: 1, years: o.years }, od = acceptOdds(o, terms);
    return `<div class="m-card"><h3>${esc(SPONSOR_SLOTS[o.slot].name)} · offer</h3><div class="m-big">${esc(o.brand)}</div>
      <div class="m-row2"><span>A race</span><b>${money(o.base * terms.base)}</b></div><div class="m-row2"><span>On signing</span><b>${money(o.sign * terms.base)}</b></div>
      <div class="m-row2"><span>Race target bonus</span><b>${money(o.bonus * terms.bonus)} · ${o.kind === 'best' ? 'a car near the front' : 'both cars in the points'}</b></div>
      <div class="m-row2"><span>Season bonus (constructors within one of the board's target)</span><b>${money(o.seasonBonus)}</b></div><div class="m-row2"><span>Seasons</span><b>${terms.years}</b></div>
      ${open ? `<div class="m-row2"><span>Fee</span><span class="m-seg">${[0.9, 1, 1.1, 1.2, 1.35].map((x) => `<button data-a="ng" data-v="base|${x}" class="${Math.abs(N.base - x) < 1e-6 ? 'm-on' : ''}">${pct(x)}</button>`).join('')}</span></div>
        <div class="m-row2"><span>Bonus</span><span class="m-seg">${[0.8, 1, 1.2, 1.4].map((x) => `<button data-a="ng" data-v="bonus|${x}" class="${Math.abs(N.bonus - x) < 1e-6 ? 'm-on' : ''}">${pct(x)}</button>`).join('')}</span></div>
        <div class="m-row2"><span>Seasons</span><span class="m-seg">${[1, 2, 3].map((x) => `<button data-a="ng" data-v="years|${x}" class="${N.years === x ? 'm-on' : ''}">${x}</button>`).join('')}</span></div>
        <div class="m-row2"><span>Their answer</span><b style="color:${od.p > 0.6 ? '#1d8a4e' : od.p > 0.4 ? '#b07b00' : '#d4351c'}">${od.word}</b></div>
        <div class="m-acts"><button class="m-go" data-a="prop" data-v="${o.id}"${c.sponsors?.[o.slot] ? ' disabled' : ''}>PROPOSE</button><button data-a="ngx">CLOSE</button></div><p style="font-size:12px;color:#6b7480">${o.patience} more proposal${o.patience === 1 ? '' : 's'} before they walk away.</p>`
      : `<div class="m-acts"><button data-a="neg" data-v="${o.id}"${c.sponsors?.[o.slot] ? ' disabled title="That slot is taken"' : ''}>NEGOTIATE</button></div>`}</div>`;
  }).join('');
  return `<div class="m-card"><h3>Contracts · marketability ${pct(m / 1.7)}</h3><table><tr><th>Slot</th><th>Sponsor</th><th>A race</th><th>This weekend's target</th><th></th></tr>${cur}</table></div>
    <h3 style="margin:16px 0 8px;font-size:11px;letter-spacing:.18em;color:#6b7480">OFFERS</h3><div class="m-grid">${offers || '<div class="m-card"><p>No offers now: new ones come when a slot is empty at the season\'s end.</p></div>'}</div>`;
}
function staffHTML(c) {
  const cards = Object.entries(STAFF_ROLES).map(([k, R]) => {
    const p = c.staff[k], hires = c.hires?.[k] || [];
    return `<div class="m-card"><h3>${esc(R.name)}</h3><div class="m-drv"><div class="m-rt">${Math.round((p?.rating || 0) * 100)}</div><div class="m-nm"><b>${esc(p?.name || 'Nobody')}</b><small>${money(p?.salary || 0)}/season</small></div></div>
      <p style="font-size:12px;color:#6b7480">${esc(R.what)}</p>${hires.map((h, i) => `<div class="m-drv"><div class="m-rt" style="font-size:16px">${Math.round(h.rating * 100)}</div><div class="m-nm"><b>${esc(h.name)}</b><small>${money(h.salary)}/season · ${money(h.salary * 0.6)} to bring in</small></div><button data-a="hire" data-v="${k}|${i}">HIRE</button></div>`).join('')}</div>`;
  }).join('');
  return `<div class="m-grid">${cards}</div>`;
}
function finHTML(c) {
  const t = c.team, sal = c.salaries(), st = c.staffCost(), spent = c.spent(), pos = c.posOf(c.myTeam);
  return `<div class="m-grid"><div class="m-card"><h3>This season</h3><div class="m-row2"><span>Budget</span><b>${money(t.budget)}</b></div>
    <div class="m-row2"><span>Commercial rights (a race)</span><b>${money(RACE_INCOME[t.tier])} + ${money(POINT_INCOME)} a point</b></div>
    <div class="m-row2"><span>Drivers' salaries (a season)</span><b>${money(sal)}</b></div><div class="m-row2"><span>Staff salaries (a season)</span><b>${money(st)}</b></div>
    <div class="m-row2"><span>Prize money now (P${pos})</span><b>${money(PRIZE[pos - 1] ?? 1)}</b></div></div>
    <div class="m-card"><h3>Cost cap</h3><div class="m-row2"><span>Development spent this season</span><b>${money(spent)} of ${money(COST_CAP)}</b></div><div class="m-bar" style="--bc:${spent > COST_CAP * 0.85 ? '#d4351c' : '#1fae64'}"><i style="width:${Math.min(100, (spent / COST_CAP) * 100).toFixed(1)}%"></i></div>
    <p style="font-size:12px;color:#6b7480">Every part and facility built counts against the cap. The prize money by the constructors' order comes at the season's end: ${PRIZE.slice(0, 5).map((p, i) => `P${i + 1} ${money(p)}`).join(', ')} …</p></div></div>`;
}
function calHTML(c) {
  const R = c.results.filter((r) => r.season === c.season);
  return `<div class="m-card"><h3>Season ${c.season}</h3><table><tr><th>Round</th><th>Circuit</th><th>Forecast</th><th>Your cars</th><th>Winner</th></tr>${c.calendar.map((k, i) => {
    const r = R.find((x) => x.round === i + 1), w = r ? c.drivers[r.top[0]] : null, fc = c.forecast[i] || {};
    return `<tr class="${i + 1 === c.round && !c.seasonDone ? 'm-me' : ''}"><td>${i + 1}</td><td>${esc(H.o.trackName?.(k) || k)}</td><td>${esc(fc.weather || '')} · ${esc(fc.time || '')}</td><td>${r ? r.mine.map((m) => `${esc(sur(c.drivers[m.id]?.name))} ${m.dnf ? 'DNF' : `P${m.pos}`}`).join(', ') : ''}</td><td>${w ? esc(w.name) : ''}</td></tr>`;
  }).join('')}</table></div>`;
}
function newHTML() {
  const T = H.o.teams || [], nc = H.nc;
  return `<div class="m-mh"><div class="m-tn"><small>Team principal</small><b>A new career</b></div><div class="m-kp"><button data-a="quick">A SINGLE RACE WEEKEND INSTEAD →</button><button data-a="exit">BACK</button></div></div>
    <div class="m-mb"><div class="m-card" style="max-width:980px"><h3>The team you will run</h3><div class="m-teams">${T.map((t) => `<button data-a="nteam" data-v="${esc(t.name)}" class="${nc.team === t.name ? 'm-on' : ''}" style="--c:${t.color}">${esc(t.name)}<small>${TIER_NAME[t.tier]} · ${money(TIER_BUDGET[t.tier])} to start</small><small>${esc(t.drivers.join(' & '))}</small></button>`).join('')}</div>
    <h3 style="margin-top:18px">The season</h3><div class="m-row2"><span>Rounds</span><span class="m-seg">${[4, 8, 12].map((n) => `<button data-a="nrounds" data-v="${n}" class="${nc.rounds === n ? 'm-on' : ''}">${n}</button>`).join('')}</span></div>
    <div class="m-row2"><span>Race distance</span><span class="m-seg">${[3, 5, 8, 13].map((n) => `<button data-a="nlaps" data-v="${n}" class="${nc.laps === n ? 'm-on' : ''}">${n} laps</button>`).join('')}</span></div>
    <p>The calendar cycles ${TRACKS_ALL.map((k) => esc(H.o.trackName?.(k) || k)).join(', ')}. Every team develops its car through the season; you choose what yours builds, who drives it and who runs it - and the board watches the constructors' table.</p>
    <p><button class="m-go" data-a="create"${nc.team ? '' : ' disabled'}>${nc.team ? `START WITH ${esc(nc.team.toUpperCase())} →` : 'CHOOSE A TEAM'}</button></p></div></div>`;
}

// ---- the clicks --------------------------------------------------------------------------------------------------------
function say(text, ok = true) { H.msg = text; H.ok = ok; }
function onClick(e) {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  const c = H.c, d = b.dataset;
  if (d.tab) { H.tab = d.tab; H.msg = null; render(); el.querySelector('.m-mb')?.scrollTo(0, 0); return; }
  // (the factory: the tech tree's own buttons - ui/HubTech.js)
  if (H.tab === 'fac' && c && Object.keys(d).some((k) => /^t(br|up|dp|lv|dev|re|req)$/.test(k))) {
    const r = techClick(c, d, H.S); if (r) { H.S = r.S || H.S; if (r.S?.tmsg) say(r.S.tmsg, !!r.S.tok); else H.msg = null; render(); }
    return;
  }
  const a = d.a, v = d.v; H.msg = null;
  if (pumping) return;
  if (c && H.o.play) { const p = storyAct(c, a, v, H.o.play); if (p) { scene(p); return; } }   // (the story: ui/ManagerHub3.js)
  if (c) { const r = extraClick(c, a, v); if (r !== undefined) { if (r) say(r.text, r.ok); render(); return; } }   // (the crew, the people, the car: ui/ManagerHub2.js)
  if (a === 'exit') { H.o.onExit?.(); return; }
  if (a === 'quick') { H.o.onQuick?.(); return; }
  if (a === 'nteam') H.nc.team = v; else if (a === 'nrounds') H.nc.rounds = +v; else if (a === 'nlaps') H.nc.laps = +v;
  else if (a === 'create') { H.c = ManagerCareer.create({ team: H.nc.team, rounds: H.nc.rounds, laps: H.nc.laps }); H.tab = 'home'; H.o.onCreate?.(H.c); render(); pump(); return; }
  else if (!c) { /* nothing */ }
  else if (a === 'race') { H.o.onRace?.(c); return; }
  else if (a === 'sim') { const rep = H.o.onSim?.(c); if (rep) say(`Round ${rep.round} simulated: ${rep.mine.map((m) => `${sur(m.name)} ${m.dnf ? 'DNF' : `P${m.pos}`}`).join(', ')}.`); H.tab = 'home'; render(); pump(); return; }
  else if (a === 'next') { c.nextSeason(); H.tab = 'home'; say(`Season ${c.season}: ${c.rounds} rounds. The board expects P${c.board.target}.`); render(); pump(); return; }
  else if (a === 'join') { c.nextSeason(v); H.tab = 'home'; say(`You are ${v}'s team principal now.`); render(); pump(); return; }
  else if (a === 'erase') { ManagerCareer.erase(); H.c = null; H.tab = 'new'; }
  else if (a === 'extend') say(c.extend(v));
  else if (a === 'release') { const r = c.release(v), ok = !/^Not/.test(r); say(r, ok); if (ok && H.o.play) { const m = storyReleased(c, v); if (m) { scene(H.o.play(m.scene, m.ctx).then((res) => { storyShown(c, m.key); storyApply(c, m.key, res || {}); return r; })); return; } } }
  else if (a === 'sign') { const r = c.sign(v), ok = !/^(Not|Both)/.test(r); say(r, ok); if (ok && H.o.play) { const m = storySigning(c, v); if (m) { scene(H.o.play(m.scene, m.ctx).then((res) => { storyShown(c, m.key); storyApply(c, m.key, res || {}); return r; })); return; } } }
  else if (a === 'fit') { const [did, el] = String(v).split('|'); say(fitNew(c, c.myTeam, did, el)); c.save(); }
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
