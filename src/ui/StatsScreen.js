// STATS from the title menu (the ∑ STATS button beside RACE AGAIN): the lifetime book of everything played on this
// device (core/PlayStats.js) - kept apart from any career, so it is there with no career at all, and stays when one is
// abandoned. The big numbers (your time at the wheel and the time the game has been open, races, wins and podiums,
// laps and distance, overtakes and crashes), then every mode on its own line - Career, Quick race, Time trial,
// Practice: its sessions, its share of your time, its results - and each circuit's best laps, a time trial's first.
// A career's own, deeper figures are in its hub (STATS). In the menu's look: dark glass, the cyan accent; on a phone
// the tiles go two by two and the table drops its minor columns. Esc or ← closes it.
import { playLoad, playTotal, playDur, playTick, PLAY_MODES } from '../core/PlayStats.js';

const CSS = `
.home-acts { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
#stats-open { display: flex; align-items: center; gap: 12px; height: 44px; padding: 0 22px; font-size: 12px; font-weight: 600; letter-spacing: .06em; color: var(--dim); min-width: 0; }
#stats-open b { color: var(--fg); letter-spacing: .14em; white-space: nowrap; }
#stats-open span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#playstats { position: fixed; inset: 0; z-index: 60; overflow-y: auto; overscroll-behavior: contain; color: var(--fg, #eef1f7); font-variant-numeric: tabular-nums;
  background: radial-gradient(1200px 700px at 75% 30%, rgba(225,6,0,.14), transparent 60%), radial-gradient(900px 600px at 15% 95%, rgba(45,140,255,.12), transparent 60%), #05060c; animation: ps-in .22s ease both; }
@keyframes ps-in { from { opacity: 0; } }
#playstats .ps-in { width: min(1180px, 100%); margin: 0 auto; padding: 28px 40px 32px; display: flex; flex-direction: column; gap: 18px; }
#playstats .ps-head { display: flex; align-items: center; gap: 14px; }
#playstats .ps-head .crumb { flex: 1; }
#playstats .ps-since { font-size: 12px; color: var(--dim, #8d95a8); text-align: right; }
#playstats .ps-lbl { font-size: 10px; letter-spacing: .2em; color: var(--dim, #8d95a8); text-transform: uppercase; margin: 0 0 8px; display: block; font-weight: 700; }
#playstats .ps-hero { display: grid; grid-template-columns: 1.5fr repeat(4, minmax(0, 1fr)); gap: 12px; }
#playstats .ps-t { position: relative; background: rgba(255,255,255,.04); border: 1px solid var(--line, rgba(255,255,255,.09)); border-radius: 14px; padding: 16px 18px; min-width: 0; overflow: hidden; }
#playstats .ps-t::before { content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 3px; border-radius: 2px; background: var(--accent2, #00d4ff); }
#playstats .ps-t.big::before { background: var(--accent, #e10600); }
#playstats .ps-t small { display: block; font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--dim, #8d95a8); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#playstats .ps-t b { display: block; font-size: 32px; font-weight: 800; letter-spacing: -.01em; margin: 8px 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#playstats .ps-t.big b { font-size: 40px; }
#playstats .ps-t span { display: block; font-size: 12px; color: var(--dim, #8d95a8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#playstats .ps-tb { background: rgba(255,255,255,.03); border: 1px solid var(--line, rgba(255,255,255,.09)); border-radius: 14px; padding: 4px 16px; }
#playstats .ps-tr { display: grid; grid-template-columns: minmax(110px, 1.4fr) 70px minmax(120px, 1.6fr) repeat(7, minmax(44px, .6fr)); gap: 10px; align-items: center; min-height: 44px; border-bottom: 1px solid var(--line, rgba(255,255,255,.09)); font-size: 13.5px; }
#playstats .ps-tr:last-child { border-bottom: 0; }
#playstats .ps-tr > * { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#playstats .ps-tr.hd i { font-style: normal; } #playstats .ps-tr.hd .ps-s { display: none; }
#playstats .ps-tr.hd { min-height: 34px; font-size: 9.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--dim, #8d95a8); font-weight: 700; }
#playstats .ps-tr .r { text-align: right; }
#playstats .ps-tr.tot { font-weight: 800; }
#playstats .ps-tr.tot > :first-child { color: var(--accent2, #00d4ff); letter-spacing: .14em; font-size: 11px; }
#playstats .ps-tr .m { font-weight: 700; display: flex; align-items: center; gap: 8px; }
#playstats .ps-tr .m i { width: 8px; height: 8px; border-radius: 2px; flex: none; background: var(--c); }
#playstats .ps-share { display: flex; align-items: center; gap: 8px; }
#playstats .ps-share u { flex: 1; height: 6px; border-radius: 3px; background: rgba(255,255,255,.07); overflow: hidden; display: block; text-decoration: none; }
#playstats .ps-share u i { display: block; height: 100%; border-radius: 3px; background: var(--c); }
#playstats .ps-share em { font-style: normal; width: 64px; text-align: right; flex: none; }
#playstats .ps-dim { color: var(--dim, #8d95a8); }
#playstats .ps-cc { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
#playstats .ps-c { background: rgba(255,255,255,.03); border: 1px solid var(--line, rgba(255,255,255,.09)); border-radius: 14px; padding: 14px 16px; min-width: 0; }
#playstats .ps-c.none { opacity: .55; }
#playstats .ps-c header { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
#playstats .ps-c header b { font-size: 15px; letter-spacing: .04em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#playstats .ps-c header small { font-size: 11px; color: var(--dim, #8d95a8); white-space: nowrap; }
#playstats .ps-tt { font-size: 10px; letter-spacing: .18em; color: var(--accent2, #00d4ff); font-weight: 700; text-transform: uppercase; }
#playstats .ps-ttv { font-size: 26px; font-weight: 800; margin: 4px 0 10px; }
#playstats .ps-r { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; padding: 4px 0; border-top: 1px solid var(--line, rgba(255,255,255,.09)); }
#playstats .ps-r span { color: var(--dim, #8d95a8); white-space: nowrap; } #playstats .ps-r b { font-weight: 700; white-space: nowrap; }
#playstats .ps-foot { font-size: 12px; color: var(--dim, #8d95a8); line-height: 1.5; margin: 0; }
@media (max-width: 1000px) { #playstats .ps-cc { grid-template-columns: repeat(2, minmax(0, 1fr)); } #playstats .ps-tr .ph2 { display: none; } #playstats .ps-tr { grid-template-columns: minmax(100px, 1.3fr) 60px minmax(100px, 1.4fr) repeat(4, minmax(40px, .6fr)); } }
@media (max-width: 700px) {
  #playstats .ps-in { padding: 14px 16px 24px; gap: 14px; }
  #playstats .ps-since { display: none; }
  #playstats .ps-hero { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  #playstats .ps-hero .ps-t.big { grid-column: 1 / -1; }
  #playstats .ps-t { padding: 12px 14px; } #playstats .ps-t b { font-size: 26px; } #playstats .ps-t.big b { font-size: 32px; }
  #playstats .ps-tb { padding: 2px 10px; }
  #playstats .ps-tr { grid-template-columns: minmax(84px, 1.2fr) 44px minmax(64px, 1fr) 46px 40px; gap: 6px; font-size: 12.5px; }
  #playstats .ps-tr.hd .ps-l { display: none; } #playstats .ps-tr.hd .ps-s { display: inline; }
  #playstats .ps-tr .ph { display: none; }
  #playstats .ps-share u { display: none; } #playstats .ps-share em { width: auto; text-align: left; }
  #playstats .ps-cc { grid-template-columns: minmax(0, 1fr); }
}
`;
const css = () => {
  if (typeof document === 'undefined' || document.getElementById('playstats-css')) return;
  const st = document.createElement('style'); st.id = 'playstats-css'; st.textContent = CSS; document.head.appendChild(st);
};
// (in at once: the menu's button is styled before the screen is ever opened)
css();

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const TRACK = { silverstone: 'Silverstone', lasvegas: 'Las Vegas', montreal: 'Montreal', austin: 'Austin' };
const MODE_COL = { career: '#e10600', quick: '#00d4ff', tt: '#ffb020', practice: '#33d17a' };
/** a lap time, seconds -> '1:28.512' */
const lapT = (s) => { if (!(num(s) > 0)) return '–'; const m = Math.floor(s / 60), r = s - m * 60; return `${m}:${r.toFixed(3).padStart(6, '0')}`; };
const km = (v) => (num(v) >= 100 ? Math.round(num(v)).toLocaleString('en-GB') : num(v).toFixed(1));

/** the screen's html from the book */
export function playStatsHTML(S = playLoad()) {
  const T = playTotal(S), M = PLAY_MODES.map(([k, n]) => [k, n, S.modes[k]]), top = Math.max(1, ...M.map(([, , b]) => num(b.sec)));
  const tile = (label, val, sub, big = false) => `<div class="ps-t${big ? ' big' : ''}"><small>${label}</small><b>${val}</b><span>${sub}</span></div>`;
  const hero = [tile('At the wheel', playDur(T.sec), `${playDur(S.game)} with the game open`, true),
    tile('Races', T.races, `${T.fin} to the flag · ${T.dnf} out`), tile('Wins', T.wins, `${T.podiums} podium${T.podiums === 1 ? '' : 's'}`),
    tile('Laps', T.laps.toLocaleString('en-GB'), `${km(T.km)} km driven`), tile('Overtakes', T.ovt, `${T.crashes} crash${T.crashes === 1 ? '' : 'es'}`)].join('');
  const row = (name, b, col, cls = '') => `<div class="ps-tr${cls ? ` ${cls}` : ''}">${cls === 'tot' ? `<span>${name}</span>` : `<span class="m" style="--c:${col}"><i></i>${name}</span>`}<span class="r">${b.sessions}</span>
    <span class="ps-share" style="--c:${col}"><u><i style="width:${cls === 'tot' ? 100 : ((num(b.sec) / top) * 100).toFixed(1)}%"></i></u><em>${playDur(b.sec)}</em></span><span class="r">${b.races}</span><span class="r">${b.wins}</span>
    <span class="r ph">${b.podiums}</span><span class="r ph ph2">${num(b.laps).toLocaleString('en-GB')}</span><span class="r ph ph2">${km(b.km)}</span><span class="r ph">${b.ovt}</span><span class="r ph ph2">${b.crashes}</span></div>`;
  const table = `<div class="ps-tb"><div class="ps-tr hd"><span>Mode</span><span class="r"><i class="ps-l">Sessions</i><i class="ps-s">Sess.</i></span><span><i class="ps-l">At the wheel</i><i class="ps-s">Time</i></span><span class="r">Races</span><span class="r">Wins</span><span class="r ph">Podiums</span><span class="r ph ph2">Laps</span><span class="r ph ph2">Km</span><span class="r ph">Overtakes</span><span class="r ph ph2">Crashes</span></div>
    ${M.map(([k, n, b]) => row(n, b, MODE_COL[k] || '#8d95a8')).join('')}${row('ALL', T, '#eef1f7', 'tot')}</div>`;
  const ids = [...new Set([...Object.keys(TRACK), ...Object.keys(S.tracks || {})])];
  const cards = ids.map((id) => {
    const C = S.tracks?.[id] || {}, none = !num(C.laps) && !C.tt && !C.race && !C.quali && !C.practice;
    return `<div class="ps-c${none ? ' none' : ''}"><header><b>${esc(TRACK[id] || id)}</b><small>${num(C.laps)} laps · ${km(C.km)} km</small></header><div class="ps-tt">Time trial best</div><div class="ps-ttv">${lapT(C.tt)}</div>
      <div class="ps-r"><span>Race lap</span><b>${lapT(C.race)}</b></div><div class="ps-r"><span>Qualifying lap</span><b>${lapT(C.quali)}</b></div><div class="ps-r"><span>Practice lap</span><b>${lapT(C.practice)}</b></div>
      <div class="ps-r"><span>Races · wins · best</span><b>${num(C.races)} · ${num(C.wins)} · ${C.bestPos ? `P${C.bestPos}` : '–'}</b></div></div>`;
  }).join('');
  return `<div class="ps-in"><header class="ps-head"><button class="back ps-x" title="Back (Esc)" aria-label="Back">←</button><div class="crumb"><small>FORMULA 1 SIMULATOR</small><b>STATS</b></div><span class="ps-since">Everything you have played on this device since ${esc(S.since)} · every mode</span></header>
    <section class="ps-hero">${hero}</section>
    <section><span class="ps-lbl">Every mode</span>${table}</section>
    <section><span class="ps-lbl">Each circuit · the best laps you drove</span><div class="ps-cc">${cards}</div></section>
    <p class="ps-foot">Time trials, quick races, practice and qualifying, and your career's races: all of it, kept on this device apart from any career - abandoning one leaves this as it is. A career's own figures, season by season, are in its hub under STATS. Time at the wheel runs from the start of a session (lights out in a race) until the car is no longer yours; the time with the game open counts while it is in front of you.</p></div>`;
}
/** open the screen over whatever is showing (the menu); Esc or ← closes it. -> its element */
export function showPlayStats() {
  css(); playTick();
  document.getElementById('playstats')?.remove();
  const el = document.createElement('div'); el.id = 'playstats'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Stats');
  el.innerHTML = playStatsHTML(playLoad());
  const close = () => { removeEventListener('keydown', onKey, true); el.remove(); };
  // (the keys are the screen's while it is up: Esc closes it, and nothing reaches the menu under it - 1/2/3 would start a mode)
  const onKey = (e) => { if (e.key === 'Tab') return; e.stopPropagation(); if (e.key === 'Escape') { e.preventDefault(); close(); } };
  el.addEventListener('click', (e) => { if (e.target.closest('.ps-x')) close(); });
  addEventListener('keydown', onKey, true);
  document.body.appendChild(el);
  el.querySelector('.ps-x')?.focus({ preventScroll: true });
  return el;
}
