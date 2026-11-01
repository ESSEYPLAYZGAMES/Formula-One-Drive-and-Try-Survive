// The STATS section of the career hub (ui/CareerHub.js draws the frame and routes here; career/Stats.js keeps the book):
// your driver's figures for one season or the whole career, a page at a time. OVERVIEW: the big numbers - wins,
// podiums, points, overtakes, the time at the wheel - the next six, and a chart (the grid against the finish race by
// race; the career's points season by season). DETAILS: every figure in five tables - results, on track, incidents
// and orders, the money, the contracts. RACES: race by race (the career: season by season). TEAM-MATE: the
// head-to-head, the tale of the tape (the career: every team-mate you have had). CIRCUITS: each circuit's bests - the
// best finish, the best race and qualifying laps you drove there. RECORDS: yours and the paddock's. A switch in the
// head picks the season (‹ 2026 ›: the arrow keys step through them) or the career; on a phone it sits at the top of
// the page. In the hub's own look: white tiles and cards, the team's colour, the hub's line charts.
import { statsEnsure, newBook, figures, seasonsOf, aiOf, paddockRecords } from '../career/Stats.js';

const CSS = `
#career .hst { display: flex; flex-direction: column; gap: var(--gap); height: 100%; min-height: 0; font-variant-numeric: tabular-nums; }
#career .hst-sw { display: flex; align-items: center; justify-content: space-between; gap: 6px 12px; flex: none; flex-wrap: wrap; min-height: 34px; }
#career .hst-ttl { min-width: 0; display: flex; align-items: baseline; gap: 10px; }
#career .hst-ttl b { font: 800 16px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .04em; white-space: nowrap; }
#career .hst-ttl small { font-size: 12px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
#career .hst-ctl { display: flex; align-items: center; gap: 8px; flex: none; margin-left: auto; }
#career .hst-ctl .k-seg > button { min-width: 72px; }
#career .hst-ctl .k-pager > span { font-weight: 800; color: #151a22; }
#career .hst-note { flex: none; margin: 0; font-size: 11.5px; line-height: 1.35; color: #6b7480; }
#career .hst-note b { color: #3a4350; }
#career .hst-big { flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(0, 1.3fr); gap: 8px; }
#career .hst-t { position: relative; background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 12px 12px 11px 15px; min-width: 0; box-shadow: 0 2px 10px rgba(25,35,60,.05); overflow: hidden; }
#career .hst-t::before { content: ''; position: absolute; left: 0; top: 12px; bottom: 12px; width: 4px; border-radius: 2px; background: var(--tc); }
#career .hst-t small { display: block; font: 700 10px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .14em; text-transform: uppercase; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-t b { display: block; font: 800 30px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); margin: 6px 0 3px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -.01em; }
#career .hst-t span { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-size: 11.5px; line-height: 1.3; min-height: 2.6em; color: #5d6675; overflow: hidden; }
#career .hst-sm { flex: none; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
#career .hst-sm > div { background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 13px; padding: 8px 10px; min-width: 0; box-shadow: 0 2px 10px rgba(25,35,60,.04); }
#career .hst-sm small { display: block; font: 700 9.5px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .12em; text-transform: uppercase; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-sm b { display: block; font: 800 18px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-sm span { display: block; font-size: 10.5px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-ch { flex: 1; min-height: 0; display: flex; flex-direction: column; }
#career .hst-ch .chart { margin-top: 0; }
#career .hst-ch .chart[style] { flex: 1; display: grid; place-items: center; max-height: 320px; }
#career .hst-ch .lbl { margin: 0 0 6px; flex: none; }
#career .hst-cols { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--gap); align-content: start; overflow-y: auto; overscroll-behavior: contain; }
#career .hst-col { display: flex; flex-direction: column; gap: var(--gap); min-width: 0; }
#career .hst-card { background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 10px 12px 8px; min-width: 0; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .hst-card > h3 { margin: 0 0 4px; font: 800 10.5px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .16em; text-transform: uppercase; color: #6b7480; display: flex; align-items: center; gap: 6px; }
#career .hst-card > h3::before { content: ''; width: 8px; height: 8px; border-radius: 2px; background: var(--tc); flex: none; }
#career .hst-r { display: flex; align-items: baseline; gap: 8px; min-height: 22px; padding: 2px 0; border-bottom: 1px solid #f0f2f5; font-size: 12.5px; min-width: 0; overflow: hidden; }
#career .hst-r:last-child { border-bottom: 0; }
#career .hst-r > span { flex: 1 0 auto; max-width: 100%; color: #3a4350; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-r > em { flex: 0 1 auto; min-width: 0; font-style: normal; font-size: 11px; color: #8a93a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-r > b { flex: none; font-weight: 800; color: #151a22; white-space: nowrap; }
#career .hst-r.sub > span { padding-left: 12px; color: #6b7480; }
#career .hst-r.sub > b { font-weight: 700; color: #3a4350; }
#career .hst-tbw { flex: 1; min-height: 0; display: flex; flex-direction: column; background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 4px 10px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .hst-tb { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
#career .hst-tr { display: grid; grid-template-columns: var(--cols); gap: 8px; align-items: center; height: 34px; padding: 0 4px; border-bottom: 1px solid #f0f2f5; font-size: 12.5px; }
#career .hst-tr > * { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-tr.hd { height: 30px; font: 700 9.5px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .12em; text-transform: uppercase; color: #6b7480; position: sticky; top: 0; background: #fff; z-index: 1; }
#career .hst-tr .n { color: #6b7480; font-weight: 800; }
#career .hst-tr .rt, #career .hst-tr.hd .rt { text-align: right; }
#career .hst-tr b { font-weight: 800; }
#career .hst-tr .p1 { color: #a07a14; } #career .hst-tr .pd { color: color-mix(in srgb, var(--tc) 70%, #151a22); }
#career .hst-tr .dnf { color: #d6202e; font-weight: 700; }
#career .hst-tr .mk { color: #8a93a0; font-size: 11px; }
#career .hst-tr .mk i { font-style: normal; display: inline-block; padding: 1px 5px; border-radius: 999px; background: #eef1f5; color: #3a4350; font-weight: 800; font-size: 9.5px; letter-spacing: .06em; margin-right: 3px; }
#career .hst-tr .mk i.fl { background: #f1e4ff; color: #7a2bd1; } #career .hst-tr .mk i.dd { background: #fff1d6; color: #9a6400; }
#career .hst-tf { flex: none; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 6px 2px 2px; font-size: 11.5px; color: #6b7480; }
#career .hst-vs { flex: none; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 12px; align-items: center; background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 12px 16px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .hst-who { display: flex; align-items: center; gap: 12px; min-width: 0; }
#career .hst-who.r { flex-direction: row-reverse; text-align: right; }
#career .hst-who .face { position: static; flex: none; width: 54px; height: 54px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 2px #fff, 0 0 0 3px var(--c, #ccc); font-size: 15px; }
#career .hst-who b { display: block; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-who small { display: block; color: #6b7480; font-size: 11.5px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-who > div { min-width: 0; }
#career .hst-vsn { font: 800 13px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #8a93a0; letter-spacing: .12em; }
#career .hst-tape { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 6px 16px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .hst-tp { display: grid; grid-template-columns: 64px minmax(0, 1fr) minmax(90px, 150px) minmax(0, 1fr) 64px; gap: 10px; align-items: center; min-height: 34px; border-bottom: 1px solid #f0f2f5; font-size: 12.5px; }
#career .hst-tp:last-child { border-bottom: 0; }
#career .hst-tp > b { font: 800 16px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #5d6675; }
#career .hst-tp > b.r { text-align: right; }
#career .hst-tp > b.win { color: color-mix(in srgb, var(--tc) 75%, #151a22); } #career .hst-tp > b.win2 { color: #151a22; }
#career .hst-tp > span { text-align: center; font: 700 10px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .12em; text-transform: uppercase; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-tp > i { display: flex; height: 8px; border-radius: 4px; overflow: hidden; background: #eef1f5; }
#career .hst-tp > i.l { justify-content: flex-end; }
#career .hst-tp > i > u { display: block; height: 100%; border-radius: 4px; }
#career .hst-mates { flex: none; }
#career .hst-cc { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap); align-content: start; overflow-y: auto; overscroll-behavior: contain; }
#career .hst-cir { position: relative; background: #fff; border: 1px solid rgba(21,26,34,.06); border-radius: 16px; padding: 12px 14px 10px 18px; min-width: 0; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#career .hst-cir::before { content: ''; position: absolute; left: 0; top: 12px; bottom: 12px; width: 4px; border-radius: 2px; background: var(--tc); }
#career .hst-cir.none { opacity: .62; } #career .hst-cir.none::before { background: #c9cfd8; }
#career .hst-cir header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; }
#career .hst-cir header b { font-size: 15px; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-cir header strong { font: 800 22px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); }
#career .hst-cir header strong.p1 { color: #a07a14; }
#career .hst-cir header small { font: 700 9.5px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .12em; text-transform: uppercase; color: #6b7480; }
#career .hst-cir .hst-r { min-height: 20px; font-size: 12px; }
#career .hst-rec { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap); align-content: start; overflow-y: auto; overscroll-behavior: contain; }
#career .hst-rc { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1px 10px; align-items: baseline; padding: 6px 0; border-bottom: 1px solid #f0f2f5; min-width: 0; }
#career .hst-rc:last-child { border-bottom: 0; }
#career .hst-rc > span { font-size: 12.5px; color: #3a4350; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-rc > b { font: 800 15px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); text-align: right; white-space: nowrap; }
#career .hst-rc > small { grid-column: 1 / -1; font-size: 11px; color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .hst-rc > small em { font-style: normal; font-weight: 700; color: color-mix(in srgb, var(--tc) 70%, #151a22); }
#career .hst-empty { margin: auto; text-align: center; max-width: 420px; color: #5d6675; font-size: 13px; line-height: 1.45; }
@media (max-width: 1199px) { #career .hst-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
/* (eight sections on the rail since STATS joined it: a short window keeps them all in view) */
@media (min-width: 1200px) and (max-height: 720px) { #career nav.ch-rail > button { height: 54px; gap: 3px; } }
@media (max-width: 899px) {
  #career .hst { height: auto; }
  #career .hst-big { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  #career .hst-big > .hst-t:last-child { grid-column: 1 / -1; }
  #career .hst-t b { font-size: 26px; }
  #career .hst-sm { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  #career .hst-cols, #career .hst-cc, #career .hst-rec { grid-template-columns: minmax(0, 1fr); overflow: visible; }
  #career .hst-tb, #career .hst-tape { overflow: visible; }
  #career .hst-tr .ph { display: none; }
  #career .hst-tr { grid-template-columns: var(--colsm, var(--cols)); }
  #career .hst-tp { grid-template-columns: 30px minmax(0, 1fr) minmax(104px, 1.7fr) minmax(0, 1fr) 30px; gap: 6px; }
  #career .hst-tp > span { font-size: 9px; letter-spacing: .06em; }
  #career .hst-tp > b { font-size: 14px; }
  #career .hst-vs { padding: 10px 12px; gap: 8px; }
  #career .hst-who { gap: 8px; } #career .hst-who .face { width: 42px; height: 42px; } #career .hst-who small { display: none; }
  #career .hst-who b { white-space: normal; font-size: 13.5px; line-height: 1.2; }
}
`;
const css = () => {
  if (typeof document === 'undefined' || document.getElementById('hub-stats-css')) return;
  const st = document.createElement('style'); st.id = 'hub-stats-css'; st.textContent = CSS; document.head.appendChild(st);
};
// (in at once: the rail's rule above matters before the first stats page is drawn)
css();

// ---- the page's state: season or career, which season, the list's page (kept while the hub is open) ----------------
const VIEW = { scope: 'season', season: null, page: {} };
/**
 * A click on the stats pages (CareerHub's router, after the tech tree's and the social pages'): the switch
 * (data-stats-scope), the season (data-stats-season), a list's page (data-stats-page) -> { S, region } | null
 */
export function statsClick(c, d, S = {}) {
  if (!d) return null;
  if (d.statsScope) { VIEW.scope = d.statsScope === 'career' ? 'career' : 'season'; VIEW.page = {}; return { S: { ...S }, region: ['stats'] }; }
  if (d.statsSeason) { VIEW.scope = 'season'; VIEW.season = +d.statsSeason; VIEW.page = {}; return { S: { ...S }, region: ['stats'] }; }
  if (d.statsPage != null) { const [k, p] = String(d.statsPage).split(':'); VIEW.page[k] = Math.max(0, +p || 0); return { S: { ...S }, region: ['stats'] }; }
  return null;
}

// ---- small helpers ---------------------------------------------------------------------------------------------------
const esc0 = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TRACK = { silverstone: 'Silverstone', lasvegas: 'Las Vegas', montreal: 'Montreal', austin: 'Austin' };
const TN = (id) => TRACK[id] || String(id || '');
const T3 = (id) => ({ silverstone: 'SIL', lasvegas: 'LVG', montreal: 'MTL', austin: 'COTA' }[id] || String(id || '').slice(0, 3).toUpperCase());
const pct = (v) => (v == null ? '–' : `${Math.round(v * 100)}%`);
const dec = (v, d = 1) => (v == null ? '–' : v.toFixed(d));
const P = (p) => (p ? `P${p}` : '–');
const sgn = (v) => (v > 0 ? `+${v}` : String(v));
/** seconds -> '1h 24m', '38 min', '0 min' */
const dur = (s) => { const m = Math.round(num(s) / 60); return m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m} min`; };
/** a lap time, seconds -> '1:28.512' */
const lapT = (s) => { if (!(num(s) > 0)) return '–'; const m = Math.floor(s / 60), r = s - m * 60; return `${m}:${r.toFixed(3).padStart(6, '0')}`; };
/** where a record was set: { s, r, t } -> 'Las Vegas · R2 2026' */
const atTxt = (a) => (a ? [a.t ? TN(a.t) : '', a.r ? `R${a.r}${a.s ? ` ${a.s}` : ''}` : a.s ? String(a.s) : ''].filter(Boolean).join(' · ') : '');
const kn = (v) => (num(v) >= 1000 ? `${(num(v) / 1000).toFixed(1)}k` : num(v) >= 100 ? String(Math.round(num(v))) : num(v).toFixed(1));

/** the STATS page (S.sub: '' overview | details | races | mate | circuits | records), from the hub's H kit */
export function statsHTML(c, S = {}, H = {}) {
  css();
  const esc = typeof H.esc === 'function' ? H.esc : esc0;
  try {
    const st = statsEnsure(c), me = c?.me;
    if (!st || !me) return `<div class="hst"><div class="hst-empty"><b>No driver just now.</b><br>Choose who you are on the briefing first: the stats follow your driver.</div></div>`;
    const seasons = seasonsOf(c), season = seasons.includes(VIEW.season) ? VIEW.season : c.season, scope = VIEW.scope === 'career' ? 'career' : 'season';
    const B = scope === 'career' ? st.career : st.seasons[String(season)] || { ...newBook(), races: [] };
    const sub = String(H.sub ?? S.sub ?? ''), fit = H.fit || { w: 680, h: 600 };
    const X = { c, st, me, B, F: figures(B), scope, season, seasons, sub, fit, H, esc, ink: typeof H.ink === 'function' ? H.ink : (x) => x, money: typeof H.money === 'function' ? H.money : (m) => `$${(Math.round(num(m) * 10) / 10).toFixed(1)}M` };
    const body = sub === 'details' ? detailsHTML(X) : sub === 'races' ? racesHTML(X) : sub === 'mate' ? mateHTML(X) : sub === 'circuits' ? circuitsHTML(X) : sub === 'records' ? recordsHTML(X) : overviewHTML(X);
    return `<div class="hst hst-p-${esc(sub || 'ov')}" data-region="stats">${switchHTML(X)}${body}</div>`;
  } catch (e) {
    console.warn('HubStats: the page could not be drawn', e);
    return '<div class="hst"><div class="hst-empty"><b>The stats could not be drawn just now.</b><br>The career itself is safe: the other pages work as before.</div></div>';
  }
}
/**
 * The page's top row: what it shows (the season and how far it has gone, the team; the career and its seasons) and the
 * switch - ‹ season › (with more than one) and SEASON | CAREER. In the page, not the head: six sub-tabs leave the head
 * no room for it. The hub's arrow keys find its pager (CareerHub pageStep).
 */
function switchHTML(X) {
  const { c, st, me, scope, season, seasons, esc } = X, i = seasons.indexOf(season), prev = seasons[i - 1], next = seasons[i + 1];
  const pager = scope === 'season' && seasons.length > 1 ? `<span class="k-pager"><button data-stats-season="${prev ?? ''}" ${prev == null ? 'disabled' : ''} aria-label="Previous season">‹</button><span>${season}</span><button data-stats-season="${next ?? ''}" ${next == null ? 'disabled' : ''} aria-label="Next season">›</button></span>` : '';
  const seg = `<div class="k-seg" style="--n:2;--k:${scope === 'career' ? 1 : 0}"><button data-stats-scope="season" class="${scope === 'season' ? 'on' : ''}">Season</button><button data-stats-scope="career" class="${scope === 'career' ? 'on' : ''}">Career</button></div>`;
  let title, sub;
  if (scope === 'career') { const ss = seasons.filter((s) => num(st.seasons[String(s)]?.starts) > 0 || s === c.season); title = 'Career'; sub = `${me.name} · ${ss.length} season${ss.length === 1 ? '' : 's'}${ss.length ? ` since ${ss[0]}` : ''}`; }
  else {
    const teams = [...new Set((X.B.races || []).map((r) => r.tm).filter(Boolean))], live = season === c.season && !c.seasonOver, done = live ? Math.max(0, c.round - 1) : null;
    title = `${season} season`; sub = `${live ? `${done} of ${c.rounds} rounds run` : 'complete'}${teams.length ? ` · ${teams.join(', ')}` : me.team && season === c.season ? ` · ${me.team}` : ''}`;
  }
  return `<div class="hst-sw"><div class="hst-ttl"><b>${esc(title)}</b><small>${esc(sub)}</small></div><span class="hst-ctl">${pager}${seg}</span></div>`;
}
/** what the figures cover, when the book started late (a save from before it) or a season was filled from its log */
function noteHTML(X) {
  const { st, B, scope, esc } = X, s = st.since || {};
  if (B.part && scope === 'season') return `<p class="hst-note">The stats book began at round ${s.round || 1}${s.season ? ` of ${s.season}` : ''}: before it, only what the career's records kept is here - <b>points and wins</b>, and in the season it began, <b>starts and podiums</b> too.</p>`;
  if (st.back && scope === 'career') return `<p class="hst-note">Counted race by race from round ${s.round || 1}, ${esc(s.season)}. <b>Starts, wins, podiums, points, poles and fastest laps</b> reach back to the start of your career.</p>`;
  return '';
}

// ---- OVERVIEW ------------------------------------------------------------------------------------------------------------
function overviewHTML(X) {
  const { B, F, c, st, scope, season, esc, fit } = X, N = (k, v) => `data-n="st-${k}" data-v="${Math.round(num(v))}"`;
  const big = [
    ['Wins', B.wins, B.starts ? `${pct(F.winRate)} of ${B.starts} start${B.starts === 1 ? '' : 's'}` : 'no starts yet', 'w'],
    ['Podiums', B.podiums, B.starts ? `${pct(F.podRate)} of starts` : '–', 'p'],
    ['Points', B.pts, B.starts ? `${dec(F.ptsPer)} a start · ${B.ptsFin} in the points` : '–', 'pts'],
    ['Overtakes', B.ovt, B.starts ? `${dec(F.ovtPer)} a race, on track` : 'on track', 'o'],
  ].map(([n, v, s, k]) => `<div class="hst-t"><small>${n}</small><b ${N(k, v)}>${Math.round(num(v))}</b><span>${esc(s)}</span></div>`).join('');
  const time = `<div class="hst-t"><small>Time at the wheel</small><b>${dur(F.sec)}</b><span>racing ${dur(B.sec.race)} · qualifying ${dur(B.sec.quali)} · practice ${dur(B.sec.prac)}</span></div>`;
  const small = [
    ['Starts', B.starts, `${B.fin} finished`], ['Poles', B.poles, `${B.fronts} front row${B.fronts === 1 ? '' : 's'}`], ['Fastest laps', B.fl, B.hat ? `${B.hat} hat-trick${B.hat === 1 ? '' : 's'}` : 'purple'],
    ['Laps led', B.led, `${B.laps} completed`], ['Avg finish', dec(F.avgFin), `grid ${dec(F.avgGrid)} · best ${P(B.best)}`], ['Retirements', F.dnf, F.dnf ? [[B.dnf.acc, 'accident'], [B.dnf.mech, 'mech.'], [B.dnf.other, 'other']].filter(([n]) => n).map(([n, w]) => `${n} ${w}`).join(' · ') : 'none'],
  ].map(([n, v, s]) => `<div><small>${n}</small><b>${esc(v)}</b><span>${esc(s)}</span></div>`).join('');
  // (the chart: the season's grid and finish race by race; the career's points season by season, once there are two)
  const note = noteHTML(X), room = clamp(fit.h - 40 - 116 - 70 - (note ? 30 : 0) - 4 * 10 - 76, 150, 420), w = Math.max(420, fit.w - 18);
  const mine = X.ink(c.teams?.[X.me.team]?.color || c.team?.color || '#e10600');
  let chart = '', title = '';
  const sns = Object.keys(st.seasons).map(Number).filter((s) => st.seasons[s]?.starts > 0).sort((a, b) => a - b);
  if (scope === 'career' && sns.length >= 2) {
    title = 'Points, season by season';
    chart = X.H.chartHTML ? X.H.chartHTML('hst-car', [{ key: 'pts', name: 'Points', short: 'PTS', color: mine, bold: true, pts: sns.map((s) => num(st.seasons[s].pts)) }], sns.map(String), { int: true, fmt: (v) => String(Math.round(v)), w, h: room }) : '';
  } else {
    const R = scope === 'career' ? sns.flatMap((s) => (st.seasons[s].races || []).map((r) => ({ ...r, s }))) : B.races || [];
    title = scope === 'career' ? 'Grid and finish, every race of the career' : `Grid and finish, race by race · ${season}`;
    const xs = R.map((r) => (scope === 'career' && sns.length > 1 ? `${String(r.s).slice(2)} R${r.r}` : `R${r.r} ${T3(r.t)}`));
    chart = X.H.chartHTML ? X.H.chartHTML(`hst-gf-${scope}`, [{ key: 'fin', name: 'Finish', short: 'FIN', color: mine, bold: true, pts: R.map((r) => (r.d ? null : num(r.p) || null)) },
      { key: 'grid', name: 'Grid', short: 'GRID', color: '#9aa3ae', bold: false, pts: R.map((r) => num(r.g) || null) }], xs, { invert: true, int: true, fmt: (v) => `P${Math.round(v)}`, w, h: room }) : '';
  }
  return `<div class="hst-big">${big}${time}</div><div class="hst-sm">${small}</div>${note}<div class="hst-ch"><span class="lbl">${esc(title)}</span>${chart}</div>`;
}

// ---- DETAILS -------------------------------------------------------------------------------------------------------------
/** a figure on a card: the label, a note in grey (a rate, where it was set), the value; cls 'sub' indents it under the one above */
const row = (label, val, sub = '', cls = '') => `<div class="hst-r${cls ? ` ${cls}` : ''}"><span>${label}</span>${sub ? `<em>${sub}</em>` : ''}<b>${val}</b></div>`;
const card = (title, rows) => `<div class="hst-card"><h3>${title}</h3>${rows.join('')}</div>`;
const wl = (a) => `${num(a?.[0])}–${num(a?.[1])}`;
function detailsHTML(X) {
  const { B, F, st, me, scope, esc, money } = X, k = me.contract;
  const results = card('Results', [
    row('Starts', B.starts), row('Wins', B.wins, pct(F.winRate)), row('Podiums', B.podiums, pct(F.podRate)), row('Pole positions', B.poles), row('Front-row starts', B.fronts),
    row('Fastest laps', B.fl), row('Hat-tricks', B.hat, 'pole, win, fastest lap'), row('Points', B.pts, F.ptsPer == null ? '' : `${dec(F.ptsPer)} a start`), row('Points finishes', B.ptsFin),
    row('Best finish', P(B.best)), row('Average finish', dec(F.avgFin)), row('Average grid', dec(F.avgGrid), B.bestGrid ? `best ${P(B.bestGrid)}` : ''),
    row('Places gained', B.nGain ? sgn(B.gain) : '–', F.avgGain == null ? '' : `${F.avgGain >= 0 ? '+' : ''}${dec(F.avgGain)} a finish`), row('Driver of the Day', B.dotd)]);
  const track = card('On track', [
    row('Laps completed', B.laps), row('Laps led', B.led, B.ledRaces ? `in ${B.ledRaces} race${B.ledRaces === 1 ? '' : 's'}` : ''), row('Distance', `${kn(B.km)} km`),
    row('Time at the wheel', dur(F.sec)), row('Racing', dur(B.sec.race), '', 'sub'), row('Qualifying', dur(B.sec.quali), B.sess.quali ? `${B.sess.quali} session${B.sess.quali === 1 ? '' : 's'}` : '', 'sub'),
    row('Practice', dur(B.sec.prac), B.sess.prac ? `${B.sess.prac} session${B.sess.prac === 1 ? '' : 's'}` : '', 'sub'), row('On-track overtakes', B.ovt, F.ovtPer == null ? '' : `${dec(F.ovtPer)} a race`), row('Pit stops', B.stops)]);
  const inc = card('Incidents & orders', [
    row('Retirements', F.dnf, F.finRate == null ? '' : `${pct(F.finRate)} finished`), row('Accident', B.dnf.acc, '', 'sub'), row('Mechanical', B.dnf.mech, '', 'sub'), row('Other', B.dnf.other, '', 'sub'),
    row('Crashes', B.crashes), row('Penalties', B.pens, B.penS ? `${Math.round(B.penS)} s added` : ''), row('Penalty points', B.pp),
    row('Team orders obeyed', B.orders.ok), row('Team orders defied', B.orders.no), row('Team-mate · qualifying', wl(B.h2h.q)), row('Team-mate · races', wl(B.h2h.r))]);
  const money0 = card('Money', [row('Earned', money(F.earn)), row('Salary', money(B.earn.salary), '', 'sub'), row('Bonuses', money(B.earn.bonus), '', 'sub'), row('Personal deals', money(B.earn.deals), '', 'sub')]);
  // (the contracts and the teams are the career's: the season shows the team or teams it was driven for)
  const teams = scope === 'career' ? Object.entries(st.teams || {}) : [...new Set((B.races || []).map((r) => r.tm).filter(Boolean))].map((t) => [t, st.teams?.[t] || {}]);
  const held = k && (me.team || me.reserveOf) ? [row('Contract', esc(me.team || me.reserveOf), me.team ? '' : 'reserve'), row('Salary · to', `${money(k.salary)} · ${esc(k.until)}`, '', 'sub')] : [row('Contract', 'none')];
  const con = card('Contracts & teams', [row('Contracts signed', num(st.contracts)), ...held, row(scope === 'career' ? 'Teams driven for' : 'Driven for', teams.length || '–'),
    ...teams.slice(0, 5).map(([t, x]) => row(esc(t), x.starts ? `${x.starts} start${x.starts === 1 ? '' : 's'}` : '–', x.wins ? `${x.wins} win${x.wins === 1 ? '' : 's'}` : '', 'sub'))]);
  return `${noteHTML(X)}<div class="hst-cols" data-scroll-ok><div class="hst-col">${results}</div><div class="hst-col">${track}${money0}</div><div class="hst-col">${inc}${con}</div></div>`;
}

// ---- RACES ---------------------------------------------------------------------------------------------------------------
/** a list's page from the room it has (rows of h px, chrome px), its pager -> { L, pager } */
function paged(X, key, list, h, chrome) {
  const per = Math.max(4, Math.floor((X.fit.h - chrome) / h)), pages = Math.max(1, Math.ceil(list.length / per)), p = clamp(VIEW.page[key] || 0, 0, pages - 1);
  const pager = pages > 1 ? `<span class="k-pager"><button data-stats-page="${key}:${p - 1}" ${p <= 0 ? 'disabled' : ''} aria-label="Previous page">‹</button><span>${p + 1} / ${pages}</span><button data-stats-page="${key}:${p + 1}" ${p >= pages - 1 ? 'disabled' : ''} aria-label="Next page">›</button></span>` : '';
  return { L: list.slice(p * per, p * per + per), pager };
}
const resTxt = (r) => (r.d ? `<span class="dnf">DNF${r.d === 'acc' ? ' · accident' : r.d === 'mech' ? ' · mech.' : ''}</span>` : `<b class="${r.p === 1 ? 'p1' : r.p <= 3 ? 'pd' : ''}">${P(r.p)}</b>`);
function racesHTML(X) {
  const { B, st, c, scope, season, esc } = X;
  if (scope === 'career') {
    const champ = (s) => { const a = (c.seasons || []).find((x) => x && x.season === s); if (a) return a.youPos ? `P${a.youPos}` : '–'; if (s === c.season) { const i = c.driverStandings().indexOf(X.me); return i >= 0 ? `P${i + 1}${c.seasonOver ? '' : ' now'}` : '–'; } return '–'; };
    const L0 = X.seasons.map((s) => [s, st.seasons[String(s)]]).filter(([, b]) => b).reverse();
    const { L, pager } = paged(X, 'seasons', L0, 34, 134);
    const cols = '54px minmax(0, 1.5fr) 64px repeat(4, minmax(34px, .5fr)) 52px 50px 40px', colsm = '44px minmax(0, 1fr) 54px 34px 34px 46px';
    const teamOf = (s, b) => [...new Set((b.races || []).map((r) => r.tm).filter(Boolean))].join(', ') || (c.seasons || []).find((x) => x?.season === s)?.team || (s === c.season ? X.me.team || '' : '');
    const rows = L.map(([s, b]) => { const dnf = num(b.dnf?.acc) + num(b.dnf?.mech) + num(b.dnf?.other);
      return `<div class="hst-tr"><span class="n">${s}</span><span>${esc(teamOf(s, b)) || '<span class="mk">–</span>'}</span><b>${esc(champ(s))}</b><span class="rt">${b.starts}</span><span class="rt">${b.wins}</span><span class="rt ph">${b.podiums}</span><span class="rt ph">${b.poles}</span><b class="rt">${b.pts}</b><span class="rt ph">${P(b.best)}</span><span class="rt ph">${b.part ? '–' : dnf}</span></div>`; }).join('');
    return `<div class="hst-tbw" style="--cols:${cols};--colsm:${colsm}"><div class="hst-tb" data-scroll-ok><div class="hst-tr hd"><span>Season</span><span>Team</span><span>Champ.</span><span class="rt">Starts</span><span class="rt">Wins</span><span class="rt ph">Pod.</span><span class="rt ph">Poles</span><span class="rt">Points</span><span class="rt ph">Best</span><span class="rt ph">DNF</span></div>${rows || '<div class="hst-empty" style="padding:18px">No seasons yet.</div>'}</div>
      <div class="hst-tf"><span>${L0.length} season${L0.length === 1 ? '' : 's'} · ${st.career.starts} starts · ${st.career.pts} points</span>${pager}</div></div>`;
  }
  const R0 = [...(B.races || [])].reverse(), { L, pager } = paged(X, `r${season}`, R0, 34, 134);
  const cols = '40px minmax(0, 1.3fr) 46px minmax(64px, 1fr) 40px 44px 40px 40px minmax(60px, .9fr)', colsm = '34px minmax(0, 1fr) 40px minmax(56px, 1fr) 34px 40px';
  const rows = L.map((r) => `<div class="hst-tr"><span class="n">R${r.r}</span><span>${esc(TN(r.t))}</span><span>${r.g ? P(r.g) : '<span class="mk">–</span>'}</span>${resTxt(r)}<span class="rt">${r.b ? '–' : num(r.pts)}</span><span class="rt">${r.b ? '–' : num(r.o)}</span><span class="rt ph">${r.b ? '–' : num(r.l)}</span><span class="rt ph">${r.b ? '–' : num(r.n)}</span><span class="mk ph">${r.f ? '<i class="fl">FL</i>' : ''}${r.v ? '<i class="dd">DOTD</i>' : ''}${r.c ? '<i>CRASH</i>' : ''}</span></div>`).join('');
  return `${noteHTML(X)}<div class="hst-tbw" style="--cols:${cols};--colsm:${colsm}"><div class="hst-tb" data-scroll-ok><div class="hst-tr hd"><span>Rnd</span><span>Circuit</span><span>Grid</span><span>Result</span><span class="rt">Pts</span><span class="rt">Ovt</span><span class="rt ph">Led</span><span class="rt ph">Laps</span><span class="ph"></span></div>${rows || `<div class="hst-empty" style="padding:18px">No races yet in ${season}.</div>`}</div>
    <div class="hst-tf"><span>${B.starts} start${B.starts === 1 ? '' : 's'} · ${B.pts} points · ${B.ovt} overtakes · ${B.led} laps led</span>${pager}</div></div>`;
}

// ---- TEAM-MATE -----------------------------------------------------------------------------------------------------------
/** one line of the tale of the tape: you on the left, them on the right, each bar your share of the two (o.lo: fewer is better) */
const tape = (label, a, b, o = {}) => {
  const A = num(a), Bv = num(b), tot = A + Bv, mine = o.lo ? A < Bv : A > Bv, theirs = o.lo ? Bv < A : Bv > A, fa = o.fmt || ((v) => String(Math.round(v)));
  const wa = tot > 0 ? (A / tot) * 100 : 0, wb = tot > 0 ? (Bv / tot) * 100 : 0;
  return `<div class="hst-tp"><b class="${mine ? 'win' : ''}">${fa(A)}</b><i class="l"><u style="width:${wa.toFixed(1)}%;background:var(--tc)"></u></i><span>${label}</span><i><u style="width:${wb.toFixed(1)}%;background:#9aa3ae"></u></i><b class="r${theirs ? ' win2' : ''}">${fa(Bv)}</b></div>`;
};
function mateHTML(X) {
  const { c, st, B, scope, season, esc, me } = X;
  const faceOf = (d) => { const t = c.teams?.[d?.team] || c.team, f = typeof X.H.face === 'function' && d ? X.H.face(d, t?.color, t?.color2) : ''; return f || `<span class="face k-ava" style="--c:${esc(X.ink(t?.color || '#8a93a0'))}"><b>${esc(String(d?.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</b></span>`; };
  const who = (d, sub, r = false) => `<div class="hst-who${r ? ' r' : ''}" style="--c:${esc(X.ink(c.teams?.[d?.team]?.color || c.team?.color || '#8a93a0'))}">${faceOf(d)}<div><b>${esc(d?.name || '—')}</b><small>${esc(sub)}</small></div></div>`;
  const mates = Object.entries(B.mates || {}).filter(([, m]) => m && (m.n || m.q?.[0] + m.q?.[1]));
  if (scope === 'career') {
    const L = mates.sort((a, b) => num(b[1].n) - num(a[1].n));
    const head = `<div class="hst-vs">${who(me, `${st.career.starts} starts`)}<span class="hst-vsn">VS</span><div class="hst-who r"><div><b>${L.length} team-mate${L.length === 1 ? '' : 's'}</b><small>the whole career</small></div></div></div>`;
    const tot = `<div class="hst-tape" data-scroll-ok>${tape('Qualifying', B.h2h.q[0], B.h2h.q[1])}${tape('Races', B.h2h.r[0], B.h2h.r[1])}${tape('Points together', L.reduce((a, [, m]) => a + num(m.pts?.[0]), 0), L.reduce((a, [, m]) => a + num(m.pts?.[1]), 0))}
      ${L.length ? L.map(([id, m]) => `<div class="hst-r"><span><b style="color:#151a22">${esc(m.name || c.drivers?.[id]?.name || id)}</b> · ${num(m.n)} race${num(m.n) === 1 ? '' : 's'} together</span><em>quali ${wl(m.q)} · races ${wl(m.r)}</em><b>${num(m.pts?.[0])}–${num(m.pts?.[1])} pts</b></div>`).join('') : '<p class="hst-note" style="margin:10px 0">No team-mate yet: the head-to-head starts with your first race in a team.</p>'}</div>`;
    return `${noteHTML(X)}${head}${tot}`;
  }
  // (the season: this season's team-mate - the current one, else the one you raced most - and both of your full seasons)
  const cur = season === c.season ? c.teammate?.() : null;
  const mid = cur?.id || mates.sort((a, b) => num(b[1].n) - num(a[1].n))[0]?.[0] || null, md = mid ? c.drivers?.[mid] : null;
  if (!md) return `<div class="hst-empty"><b>No team-mate ${season === c.season ? 'this season' : `in ${season}`}.</b><br>The head-to-head starts with your first race in a team.</div>`;
  const m = B.mates?.[mid] || { q: [0, 0], r: [0, 0], n: 0, pts: [0, 0] }, a = aiOf(c, season, c.playerId) || {}, b = aiOf(c, season, mid) || {};
  const head = `<div class="hst-vs">${who(me, `${num(a.starts)} starts · ${num(a.pts)} pts`)}<span class="hst-vsn">VS</span>${who(md, `${num(b.starts)} starts · ${num(b.pts)} pts`, true)}</div>`;
  const rows = [tape('Qualifying', m.q[0], m.q[1]), tape('Races', m.r[0], m.r[1]), tape('Points', a.pts, b.pts), tape('Wins', a.wins, b.wins), tape('Podiums', a.podiums, b.podiums), tape('Poles', a.poles, b.poles),
    tape('Fastest laps', a.fl, b.fl), tape('Laps led', a.led, b.led), tape('Retirements', a.dnf, b.dnf, { lo: true }), tape('Points together', m.pts[0], m.pts[1])].join('');
  const note = c.stats?.aiPart === season ? '<p class="hst-note">Their figures before the stats book began come from the season\'s records: points and wins.</p>' : '';
  return `${head}<div class="hst-tape" data-scroll-ok>${rows}</div>${note}<p class="hst-note">${num(m.n)} race${num(m.n) === 1 ? '' : 's'} together in ${season}. The full season's figures for each of you; the head-to-head counts the races you both started.</p>`;
}

// ---- CIRCUITS ------------------------------------------------------------------------------------------------------------
function circuitsHTML(X) {
  const { c, st, B, scope, season, esc } = X, ids = [...new Set([...(c.calendar || []), ...Object.keys(st.tracks || {})])];
  const cards = ids.map((id) => {
    const T = st.tracks?.[id] || {}, mine = (B.races || []).filter((r) => r.t === id), none = !num(T.starts) && !T.q;
    const avg = num(T.fin) ? (T.sumFin / T.fin).toFixed(1) : '–';
    const yr = scope === 'season' ? row(`In ${season}`, mine.length ? mine.map((r) => (r.d ? 'DNF' : P(r.p))).join(', ') : 'not yet') : '';
    return `<div class="hst-cir${none ? ' none' : ''}"><header><b>${esc(TN(id))}</b><small>best finish</small><strong class="${T.best === 1 ? 'p1' : ''}">${P(T.best)}</strong></header>
      ${yr}${row('Starts · wins · podiums', `${num(T.starts)} · ${num(T.wins)} · ${num(T.podiums)}`)}${row('Poles · best grid', `${num(T.poles)} · ${P(T.bestGrid)}`)}${row('Average finish', avg, T.dnf ? `${T.dnf} DNF` : '')}
      ${row('Best race lap', lapT(T.lap), esc(atTxt(T.lapAt).replace(/^[^·]+· /, '')))}${row('Best qualifying lap', lapT(T.q), esc(atTxt(T.qAt).replace(/^[^·]+· /, '')))}${row('Laps', num(T.laps))}</div>`;
  }).join('');
  return `<p class="hst-note">Each circuit's bests over the whole career${scope === 'season' ? `, with your results there in ${season}` : ''}. The laps are the ones you drove yourself: a lap the simulation ran for you is not counted.</p><div class="hst-cc" data-scroll-ok>${cards}</div>`;
}

// ---- RECORDS -------------------------------------------------------------------------------------------------------------
/** a record: what it is, the figure, and who or where on the line under */
const rc = (label, val, sub = '') => `<div class="hst-rc"><span>${label}</span><b>${val}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
function recordsHTML(X) {
  const { c, st, B, scope, season, esc, me } = X, R = st.rec || {}, S = st.streak || {};
  const nm = (id, who) => (id === c.playerId ? '<em>you</em>' : esc(who || c.drivers?.[id]?.name || ''));
  let mine = '', pad = '';
  if (scope === 'season') {
    const L = (B.races || []).filter((r) => !r.b), best = (f) => L.reduce((a, r) => (f(r) > (a ? f(a) : 0) ? r : a), null), w = (r) => (r ? `${TN(r.t)} · R${r.r}` : '');
    const g = best((r) => (!r.d && r.g ? r.g - r.p : 0)), o = best((r) => num(r.o)), l = best((r) => num(r.l)), h = best((r) => num(r.pts));
    mine = [rc('Best finish', P(B.best)), rc('Most places gained', g ? `+${g.g - g.p}` : '–', g ? `${esc(w(g))}: P${g.g} → P${g.p}` : ''), rc('Most overtakes in a race', o ? num(o.o) : '–', esc(w(o))),
      rc('Most laps led in a race', l ? num(l.l) : '–', esc(w(l))), rc('Biggest haul', h ? `${num(h.pts)} pts` : '–', esc(w(h))), rc('Points finishes', `${B.ptsFin} of ${B.starts}`)].join('');
    // (the paddock this season: the leaders in the tallies)
    const A = st.ai?.[String(season)] || {}, lead = (i, label, unit = '') => { const e = Object.entries(A).filter(([, a]) => Array.isArray(a) && num(a[i]) > 0).sort((x, y) => num(y[1][i]) - num(x[1][i])); const you = num(A[c.playerId]?.[i]), rank = you > 0 ? 1 + e.filter(([, a]) => num(a[i]) > you).length : null;
      return rc(label, e.length ? `${num(e[0][1][i])}${unit}` : '–', e.length ? `${nm(e[0][0])}${e[0][0] !== c.playerId ? ` · you ${you}${rank ? ` (${ordinal(rank)})` : ''}` : ''}` : ''); };
    pad = [lead(3, 'Most points'), lead(1, 'Most wins'), lead(2, 'Most podiums'), lead(4, 'Most poles'), lead(5, 'Most fastest laps'), lead(7, 'Most laps led'), lead(6, 'Most retirements')].join('');
    return `<div class="hst-rec" data-scroll-ok>${card(`Your ${season}`, [mine])}${card(`The paddock in ${season}`, [pad])}</div>`;
  }
  const S0 = (c.seasons || []).filter((s) => s && s.youPos), champ = S0.length ? S0.reduce((a, s) => (s.youPos < a.youPos ? s : a)) : null;
  const sb = (k) => { let out = null; for (const [s, b] of Object.entries(st.seasons || {})) if (num(b?.[k]) > num(out?.n)) out = { n: num(b[k]), s }; return out; };
  const sp = sb('pts'), sw = sb('wins'), tro = (id) => c.trophies?.find((t) => t.id === id), ms = (id, label) => { const t = tro(id); return t ? rc(label, `${t.round ? `R${t.round} ` : ''}${t.season}`) : rc(label, '<span style="color:#9aa3ae">not yet</span>'); };
  mine = [rc('Best championship', champ ? `P${champ.youPos}` : '–', champ ? `${champ.season}${champ.team ? ` · ${esc(champ.team)}` : ''}` : 'no season finished yet'),
    rc('Most points in a season', sp ? sp.n : '–', sp ? sp.s : ''), rc('Most wins in a season', sw && sw.n ? sw.n : '–', sw && sw.n ? sw.s : ''),
    rc('Most places gained in a race', R.gain ? `+${R.gain.n}` : '–', R.gain ? `${esc(atTxt(R.gain.at))}: P${R.gain.from} → P${R.gain.to}` : ''),
    rc('Most overtakes in a race', R.ovt ? R.ovt.n : '–', esc(atTxt(R.ovt?.at))), rc('Most laps led in a race', R.led ? R.led.n : '–', esc(atTxt(R.led?.at))),
    rc('Quickest pit stop', R.stop ? `${num(R.stop.n).toFixed(2)} s` : '–', R.stop ? `${esc(atTxt(R.stop.at))} · standing still` : ''),
    rc('Longest run of wins', num(S.win?.[1]), S.win?.[0] ? `${S.win[0]} now` : ''), rc('Longest run of podiums', num(S.pod?.[1]), S.pod?.[0] ? `${S.pod[0]} now` : ''),
    rc('Longest run in the points', num(S.pts?.[1]), S.pts?.[0] ? `${S.pts[0]} now` : ''), rc('Longest run of finishes', num(S.fin?.[1]), S.fin?.[0] ? `${S.fin[0]} now` : '')].join('');
  const miles = [ms('start', 'First start'), ms('points', 'First points'), ms('podium', 'First podium'), ms('win', 'First win'), ms('pole', 'First pole'), ms('fl', 'First fastest lap')].join('');
  pad = paddockRecords(c).map((x) => rc(esc(x.label), x.n ? `${Math.round(x.n)}` : '–', x.who ? `${nm(x.id, x.who)}${x.season ? ` · ${x.season}` : ''}${x.id !== c.playerId ? ` · you ${Math.round(num(x.you))}${x.rank ? ` (${ordinal(x.rank)})` : ''}` : ''}` : '')).join('');
  const past = (st.past || []).length ? card('Before', st.past.map((p) => rc(esc(p.name), `${num(p.career?.wins)} wins`, `${num(p.career?.starts)} starts · ${num(p.career?.podiums)} podiums · ${num(p.career?.pts)} pts · to ${p.until?.season ?? ''}`))) : '';
  return `${noteHTML(X)}<div class="hst-rec" data-scroll-ok><div class="hst-col">${card('Your records', [mine])}</div><div class="hst-col">${card('Milestones', [miles])}${card('The paddock since the career began', [pad])}${past}</div></div>`;
}
const ordinal = (n) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`;
