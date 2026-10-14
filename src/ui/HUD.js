// DOM HUD: timing, position, tyre/damage, gear/speed/rpm, lights, messages, minimap, pit menu, results.
// The two menus it owns move through the motion kit (ui/Motion.js). The pit menu fades in above the HUD: five tyre
// tiles (1-5), three repair tiles (7-9), the stop time counting to its new value, CONFIRM (Enter). The results are a
// sheet that fits the screen with nothing to scroll: a header (what it was, your position in big figures, chips for
// the points, a penalty, Driver of the Day, a ban), up to three pages - the classification in two columns, the race
// story (the fans' vote and the race in numbers), the championship - and a footer with the way on. Pages turn with the
// tabs, left/right, Q/E or 1-3; Enter carries on.
import { COMPOUNDS } from '../vehicle/Tyres.js';
import { ensureMotion, open, close, page, keys, countUp } from './Motion.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const last = (n) => String(n || '').split(' ').pop();

// ---- the menus' look (the results sheet, the pit menu); the live HUD's is style.css's ------------------------------
const HUD_CSS = `
#L-results { --w: 1180px; --k-scrim: rgba(3,4,8,.72); }
#L-results > #results { height: min(620px, calc(100vh - 32px)); grid-template-rows: 64px minmax(0,1fr) 56px; padding: 0; }
#L-results > #results.panel { position: relative; left: auto; top: auto; min-width: 0; max-width: none; max-height: 100%; overflow: hidden; backdrop-filter: none; -webkit-backdrop-filter: none; animation: none; }
/* (no layer around it yet: the sheet centres itself, as the old panel did) */
#results.res-solo { width: min(1180px, calc(100vw - 32px)); height: min(620px, calc(100vh - 32px)); min-width: 0; max-width: none; max-height: none; padding: 0; z-index: 30;
  display: grid; grid-template-rows: 64px minmax(0,1fr) 56px; overflow: hidden; background: rgba(10,12,20,.95); backdrop-filter: none; -webkit-backdrop-filter: none; border-radius: 14px;
  animation: hudResIn var(--m-base) var(--ease-out) both; }
@keyframes hudResIn { from { opacity: 0; transform: translate(-50%, -50%) translate3d(0, 10px, 0) scale(.985); } }
#results { font-family: var(--k-font); color: var(--k-fg); text-align: left; grid-template-columns: minmax(0,1fr); }
#results .res-head { display: grid; grid-template-columns: minmax(0,1fr) auto; grid-template-rows: auto auto; column-gap: 18px; align-content: center; padding: 8px 22px 0; border-bottom: 1px solid var(--k-line); min-width: 0; }
#results #results-title { grid-area: 1 / 1; margin: 0; font: 700 11px/1.3 var(--k-font); letter-spacing: .16em; color: var(--k-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#results #results-title::before { display: none; }
#results .res-chips { grid-area: 2 / 1; display: flex; align-items: center; gap: 8px; min-width: 0; overflow: hidden; height: 38px; }
#results .res-pos { flex: none; font: 900 30px/1 var(--k-font); letter-spacing: .02em; font-variant-numeric: tabular-nums; margin-right: 4px; }
#results .res-chip { flex: none; display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 11px; font: 800 11px/1 var(--k-font); letter-spacing: .1em; white-space: nowrap;
  background: rgba(255,255,255,.07); color: var(--k-fg); font-variant-numeric: tabular-nums; }
#results .res-chip.up { background: rgba(51,209,122,.16); color: #5be39a; } #results .res-chip.warn { background: rgba(255,176,32,.16); color: #ffc65a; }
#results .res-chip.down { background: rgba(255,90,79,.16); color: #ff8178; } #results .res-chip.gold { background: rgba(255,207,58,.16); color: #ffd862; }
#results #res-tabs { grid-area: 1 / 2 / 3 / 3; align-self: end; }
#results #res-tabs.hidden { display: none; }
#results #res-pages { min-height: 0; overflow: hidden; padding: 12px 22px 10px; }
#results #res-pages > .m-pg { min-height: 0; overflow: hidden; }
#results .res-foot { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 0 22px; border-top: 1px solid var(--k-line); min-width: 0; }
#results .res-keys { min-width: 0; font: 600 11px/1.2 var(--k-font); color: var(--k-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#results .res-keys kbd { margin: 0 2px; }
#results .res-foot .row { flex: none; margin: 0; gap: 10px; justify-content: flex-end; }
#results .res-foot .row button { height: 40px; padding: 0 18px; border-radius: 10px; font-size: 12.5px; box-shadow: none; }
#results .res-foot #btn-next { order: 3; } #results .res-foot #btn-res-tel { order: 1; } #results .res-foot #btn-menu { order: 2; }
/* the classification and the championship: rows of 26 px, two columns of eleven on a wide sheet */
#results { --rh: clamp(26px, calc((100vh - 300px) / 12), 34px); }
#results .rr-list { display: grid; grid-template-columns: minmax(0,1fr); align-content: start; }
#results .rr-list.c2 { grid-auto-flow: column; grid-template-rows: repeat(var(--rn), var(--rh)); grid-template-columns: repeat(2, minmax(0,1fr)); column-gap: 28px; }
#results .rr { display: grid; grid-template-columns: 26px 10px minmax(0,1fr) 112px 72px 42px 32px; column-gap: 6px; align-items: center; height: var(--rh); padding: 0 8px; border-radius: 6px;
  border-bottom: 1px solid rgba(255,255,255,.04); font-size: 12.5px; font-variant-numeric: tabular-nums; min-width: 0; }
#results .rr > * { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#results .rr .sw { width: 10px; height: 10px; margin: 0; border-radius: 2px; }
#results .rr .n b { font-weight: 600; } #results .rr .n small { margin-left: 8px; color: var(--k-dim); font-size: 11px; }
#results .rr .g, #results .rr .b, #results .rr .s, #results .rr .pt { text-align: right; }
#results .rr .pt { font-weight: 800; }
#results .rr.rh { border-bottom-color: var(--k-line); color: var(--k-dim); font: 700 10px/1 var(--k-font); letter-spacing: .12em; }
#results .rr.me { background: rgba(0,212,255,.08); box-shadow: inset 3px 0 0 #00d4ff; color: #9be9ff; }
#results .rr.out { color: #a3aab8; }
#results .rr.a { animation: m-in-left var(--m-base) var(--ease-out) both; animation-delay: calc(var(--i) * .67 * var(--m-stagger)); }
#results.m-calm .rr.a { animation: none; }
#results .rr.rc { grid-template-columns: 26px 10px minmax(0,1fr) 120px 44px; }
#results .rr.rc u { display: block; height: 6px; border-radius: 3px; background: rgba(255,255,255,.06); overflow: hidden; }
#results .rr.rc u i { display: block; height: 100%; transform-origin: left center; transform: scaleX(var(--v, 0)); }
@media (max-width: 899px) {
  #results .rr-list.c2 { grid-auto-flow: row; grid-template-rows: none; grid-template-columns: minmax(0,1fr); }
  #results .rr-list.c2 .rh2 { display: none; }
  #results #results-table, #results #champ-table { overflow-y: auto; overscroll-behavior: contain; }
  #results .rr { grid-template-columns: 22px 10px minmax(0,1fr) 84px 0 0 30px; } #results .rr.rc { grid-template-columns: 22px 10px minmax(0,1fr) 70px 40px; }
  #results .res-keys { display: none; }
}
/* the race story: the fans' vote, then the race in numbers */
#results #res-story { display: grid; grid-template-rows: auto auto; align-content: start; gap: 12px; }
#results .rs-dotd { display: grid; grid-template-columns: minmax(200px, 1fr) 1.4fr; gap: 18px; padding: 18px 18px; border-radius: 12px; background: rgba(255,255,255,.045); border: 1px solid var(--k-line); }
#results .rs-dh small { display: block; font: 700 11px/1 var(--k-font); letter-spacing: .18em; color: #ffcf3a; }
#results .rs-dh b { display: block; margin: 8px 0 4px; padding-left: 8px; border-left: 4px solid var(--c, #fff); font: 800 22px/1.15 var(--k-font); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#results .rs-dh span { color: var(--k-dim); font-size: 12px; }
#results .rs-bars { display: grid; gap: 8px; align-content: center; }
#results .rs-bars > div { display: grid; grid-template-columns: 96px minmax(0,1fr) 40px; align-items: center; gap: 8px; font-size: 12px; }
#results .rs-bars > div.me span { color: #00d4ff; font-weight: 700; }
#results .rs-bars span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#results .rs-bars u { display: block; height: 8px; border-radius: 4px; background: rgba(255,255,255,.06); overflow: hidden; }
#results .rs-bars u i { display: block; height: 100%; border-radius: 4px; transform-origin: left center; transform: scaleX(var(--v, 0)); }
#results #res-story.grown .rs-bars u i { animation: m-grow var(--m-slow) var(--ease-out) both; }
#results .rs-bars em { font-style: normal; color: rgba(255,255,255,.7); text-align: right; }
#results .rs-facts { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
#results .rs-facts .k-tile { align-content: start; gap: 6px; min-height: clamp(64px, calc((100vh - 420px) / 4), 84px); border-left: 3px solid var(--c, rgba(255,255,255,.25)); border-radius: 10px; }
#results .rs-facts .k-tile > b { font: 600 13px/1.35 var(--k-font); white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
@media (max-width: 899px) { #results .rs-dotd { grid-template-columns: 1fr; } #results .rs-facts { grid-template-columns: repeat(2, minmax(0,1fr)); } #results #res-story { overflow-y: auto; } #results #res-story { overscroll-behavior: contain; } }
/* a phone: the sheet from the bottom, the tabs on a row of their own, the buttons sharing the footer */
@media (max-width: 640px) {
  #L-results > #results { height: calc(100dvh - 24px); grid-template-rows: auto auto minmax(0,1fr) 56px; }
  #results.res-solo { height: calc(100dvh - 24px); grid-template-rows: auto minmax(0,1fr) 56px; }
  #results .res-head { grid-template-columns: minmax(0,1fr); grid-template-rows: auto auto auto; padding: 8px 14px 0; }
  #results #res-tabs { grid-area: 3 / 1; justify-self: start; } #results #res-tabs > button { padding: 8px 7px 10px; font-size: 10.5px; }
  #results #res-pages { padding: 10px 14px 8px; }
  #results .res-foot { padding: 0 12px; } #results .res-foot .row { flex: 1; min-width: 0; gap: 6px; }
  #results .res-foot .row button { min-width: 0; padding: 0 10px; font-size: 11px; letter-spacing: .06em; } #results .res-foot #btn-next { flex: 1; justify-content: center; }
}
/* the pit menu: docked above the HUD, solid (no blur), tiles with their keys */
#pit-menu.panel { left: 50%; top: auto; bottom: 96px; transform: translateX(-50%); width: min(640px, calc(100vw - 32px)); min-width: 0; max-height: none; overflow: hidden;
  padding: 14px 16px 12px; background: rgba(10,12,20,.9); backdrop-filter: none; -webkit-backdrop-filter: none; font-family: var(--k-font); }
#pit-menu.panel:not(.m-opening):not(.m-closing) { animation: none; }
#pit-menu h2 { margin: 0 0 10px; font-size: 14px; }
#pit-menu .row { display: grid; grid-template-columns: 64px minmax(0,1fr); align-items: center; gap: 10px; margin: 8px 0; }
#pit-menu .row > span:first-child { width: auto; }
#pit-menu #pit-tyres, #pit-menu #pit-repairs { display: grid; gap: 6px; padding: 0; background: none; border: 0; }
#pit-menu #pit-tyres { grid-template-columns: repeat(5, minmax(0,1fr)); } #pit-menu #pit-repairs { grid-template-columns: repeat(3, minmax(0,1fr)); }
#pit-menu #pit-tyres button, #pit-menu #pit-repairs button { position: relative; display: grid; place-items: center; min-width: 0; padding: 0 6px; border: 1px solid rgba(255,255,255,.12); border-radius: 10px;
  background: rgba(255,255,255,.04); color: var(--fg, #eef1f7); font: 700 12px/1.2 var(--k-font); text-align: center; transition: background-color var(--m-fast), border-color var(--m-fast), transform var(--m-press) var(--ease-out); }
#pit-menu #pit-tyres button { height: 64px; border-top: 4px solid var(--tc, #888); letter-spacing: .08em; }
#pit-menu #pit-repairs button { height: 46px; font-weight: 600; }
#pit-menu #pit-tyres button.c-soft { --tc: var(--soft); } #pit-menu #pit-tyres button.c-medium { --tc: var(--medium); } #pit-menu #pit-tyres button.c-hard { --tc: var(--hard); }
#pit-menu #pit-tyres button.c-inter { --tc: var(--inter); } #pit-menu #pit-tyres button.c-wet { --tc: var(--wet); }
#pit-menu #pit-tyres button.sel { background: color-mix(in srgb, var(--tc) 22%, transparent); border-color: var(--tc); color: #fff; }
#pit-menu #pit-repairs button.sel { background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.6); color: #fff; }
#pit-menu #pit-tyres button kbd, #pit-menu #pit-repairs button kbd { position: absolute; top: 4px; right: 4px; padding: 2px 4px; font-size: 9px; }
#pit-menu .pit-foot { grid-template-columns: minmax(0,1fr) auto; margin-bottom: 0; }
#pit-menu #pit-eta { width: auto; font: 700 13px/1 var(--k-font); letter-spacing: .08em; color: var(--fg, #eef1f7); text-transform: none; font-variant-numeric: tabular-nums; }
#pit-menu #pit-confirm { display: inline-flex; align-items: center; gap: 10px; }
#pit-menu #pit-confirm kbd { color: rgba(255,255,255,.8); border-color: rgba(255,255,255,.4); }
#pit-menu .hint { display: none; }
`;
/** the menus' CSS, once (after the kit's, so it wins over it) */
function hudCSS() {
  ensureMotion();
  if (document.getElementById('hud-menus-css')) return;
  const st = document.createElement('style'); st.id = 'hud-menus-css'; st.textContent = HUD_CSS; document.head.appendChild(st);
}
export function fmtTime(t) {
  if (!isFinite(t) || t <= 0) return '--';
  const m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s.toFixed(3).padStart(6, '0')}`;
}
export function fmtGap(t) { return isFinite(t) ? `+${t.toFixed(3)}` : '--'; }
const dmgColor = (v) => v < 0.25 ? '#33d17a' : v < 0.6 ? '#ffb020' : '#e10600';

export class HUD {
  constructor() {
    this.root = $('hud'); this.lights = [...document.querySelectorAll('#hud-lights .light')];
    this.msgEl = $('hud-msg'); this.msgTimer = 0;
    this.mm = $('minimap'); this.mmCtx = this.mm.getContext('2d'); this.mmPath = null;
    this.pit = { el: $('pit-menu'), open: false, compound: 'SOFT', repair: 'none', onConfirm: null };
    for (const b of document.querySelectorAll('#pit-tyres button')) b.addEventListener('click', () => this.pitSelect('compound', b.dataset.c));
    for (const b of document.querySelectorAll('#pit-repairs button')) b.addEventListener('click', () => this.pitSelect('repair', b.dataset.r));
    $('pit-confirm').addEventListener('click', () => this.pitConfirm());
    this.help = $('hud-help'); setTimeout(() => this.help.classList.add('hidden'), 25000);
    hudCSS();
    // (the pit tiles carry their keys; markup that already has them is left as it is)
    const kb = (b, k) => { if (b && !b.querySelector('kbd')) b.insertAdjacentHTML('beforeend', ` <kbd class="k-kbd">${k}</kbd>`); };
    document.querySelectorAll('#pit-tyres button').forEach((b, i) => kb(b, i + 1));
    document.querySelectorAll('#pit-repairs button').forEach((b, i) => kb(b, i + 7));
    kb($('pit-confirm'), 'Enter'); $('pit-eta')?.parentElement?.classList.add('pit-foot');
  }
  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); this.showLights(false); this.showReset(false); }

  showLights(v) { $('hud-lights').classList.toggle('hidden', !v); }
  setLights(n) { this.lights.forEach((l, i) => l.classList.toggle('on', i < n)); }
  msg(text, cls = '', dur = 2.5) { this.msgEl.textContent = text; this.msgEl.className = cls; this.msgTimer = dur; }
  showReset(v) { $('hud-reset').classList.toggle('hidden', !v); }
  setLimiter(v) { $('limiter').classList.toggle('hidden', !v); }
  /** pit-box cue while in the pit lane: distance to your box (null hides it) */
  boxCue(dist, color) {
    const el = $('box-cue'); if (dist == null) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden'); el.style.borderColor = color || '#00d4ff';
    $('box-dist').textContent = dist > 4 ? `${Math.round(dist)} m` : dist < -8 ? 'MISSED' : 'STOP HERE';
    el.classList.toggle('near', dist <= 25 && dist >= -8);
  }
  /** engineer radio message (auto-hides) */
  radio(text) {
    const el = $('radio'); el.querySelector('span').textContent = text; el.classList.remove('hidden'); el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    clearTimeout(this._radioT); this._radioT = setTimeout(() => el.classList.add('hidden'), 6500);
  }

  /** write a text / style value only when it changed (DOM writes are the expensive part) */
  _t(id, v) { const c = this._cache || (this._cache = {}); if (c[id] !== v) { c[id] = v; $(id).textContent = v; } }
  _s(id, prop, v) { const c = this._cache || (this._cache = {}); const k = id + '.' + prop; if (c[k] !== v) { c[k] = v; $(id).style[prop] = v; } }

  update(p, race, dt) {
    if (this.msgTimer > 0) { this.msgTimer -= dt; if (this.msgTimer <= 0) this.msgEl.textContent = ''; }
    const mode = race.mode;
    // fast telemetry every frame (only changed values touch the DOM)
    this._t('lap-time', fmtTime(race.time - p.lapStart));
    // the live delta to your best lap, 20 times a second (the bar spans a second either way)
    this._dT = (this._dT || 0) + dt;
    if (this._dT >= 0.05) {
      this._dT = 0; const dl = race.delta?.(p), el = $('hud-delta');
      const txt = dl == null ? '--' : `${dl < 0 ? '−' : '+'}${Math.abs(dl).toFixed(2)}`, cls = dl == null || Math.abs(dl) < 0.005 ? '' : dl < 0 ? 'fast' : 'slow';
      if (txt !== this._dTxt) {
        this._dTxt = txt; el.className = cls; el.querySelector('b').textContent = txt;
        const w = dl == null ? 0 : Math.min(1, Math.abs(dl)) * 50, u = el.querySelector('u'); u.style.width = `${w}%`; u.style.left = cls === 'fast' ? `${50 - w}%` : '50%';
      }
    }
    this._t('gear', p.inPit ? 'P' : p.gear === 0 ? 'R' : p.speed < 0.3 && p.throttle < 0.05 ? 'N' : String(p.gear));
    this._t('speed-num', String(Math.round(p.speedKmh)));
    const rpmN = Math.max(0, Math.min(1, (p.rpm - 3000) / 9200)); this._s('rpm-fill', 'width', `${(rpmN * 100).toFixed(1)}%`);
    this._s('thr-fill', 'height', `${(p.throttle * 100).toFixed(0)}%`); this._s('brk-fill', 'height', `${(p.brake * 100).toFixed(0)}%`);
    // slow telemetry at 10 Hz: position, gaps, tyres, damage, limiter
    this._slowT = (this._slowT || 0) + dt;
    if (this._slowT >= 0.1) {
      this._slowT = 0;
      this._t('lap-num', mode === 'race' ? `${Math.min(race.lapsTotal, p.lap + 1)}/${race.lapsTotal}` : mode === 'quali' ? (race.qualiStarted ? 'FLYING' : 'OUT LAP') : `${p.lap + 1}`);
      const pos = race.positions.indexOf(p) + 1;
      this._t('pos-num', mode === 'race' ? `P${pos}` : mode === 'quali' ? 'Q' : 'TT');
      this._t('last-time', fmtTime(p.lapTimes[p.lapTimes.length - 1]));
      this._t('best-time', fmtTime(p.bestLap));
      // the live sectors: this lap's as they come, the last lap's (faded) until then
      const S = race.sectors?.of(p);
      if (S) {
        const cells = [0, 1, 2].map((k) => (S.cur[k] != null ? [S.cur[k], S.col[k], ''] : S.last?.[k] != null ? [S.last[k], S.lastCol[k], ' old'] : null));
        const key = cells.map((c) => (c ? c.join() : '-')).join('|');
        if (key !== this._secKey) {
          this._secKey = key; const els = $('hud-sectors').children;
          cells.forEach((c, k) => { els[k].className = c ? c[1] + c[2] : ''; els[k].textContent = c ? c[0].toFixed(3) : `S${k + 1}`; });
        }
      } else if (this._secKey !== 'none') { this._secKey = 'none'; [...$('hud-sectors').children].forEach((el, k) => { el.className = ''; el.textContent = `S${k + 1}`; }); }
      const ahead = race.positions[pos - 2], behind = race.positions[pos];
      // (time gaps from the timing loops when there are any; else distance over speed)
      const gap = (a, b) => { if (!a || !b) return NaN; const g = race.gap?.(b, a); return g != null ? Math.abs(g) : Math.abs(a.totalDist - b.totalDist) / Math.max(12, (a.speed + b.speed) / 2); };
      this._t('gap-ahead', ahead ? fmtGap(gap(ahead, p)) : '--');
      this._t('gap-behind', behind ? fmtGap(gap(p, behind)) : '--');
      const t = p.tyres; this._t('tyre-compound', t.compound); this._s('tyre-compound', 'background', COMPOUNDS[t.compound].color); this._s('tyre-compound', 'color', t.compound === 'HARD' || t.compound === 'MEDIUM' ? '#000' : '#fff');
      const life = 1 - t.wear; this._s('tyre-wear', 'width', `${(life * 100).toFixed(0)}%`); this._s('tyre-wear', 'background', life > 0.5 ? '#33d17a' : life > 0.3 ? '#ffb020' : '#e10600');
      this._t('tyre-temp', t.wear > 0.7 ? 'CLIFF!' : t.temp < 0.5 ? 'COLD' : t.temp > 0.95 ? 'HOT' : 'TEMP OK');
      const d = p.dmg; const set = (id, v) => this._s(id, 'fill', dmgColor(v));
      set('dmg-fwl', d.fwL); set('dmg-fwr', d.fwR); set('dmg-rw', d.rw); set('dmg-susp', p.suspSide > 0 ? d.susp : d.susp * 0.4); set('dmg-susp2', p.suspSide < 0 ? d.susp : d.susp * 0.4); set('dmg-eng', Math.max(d.eng, p.engTemp > 0.85 ? 0.6 : 0)); set('dmg-body', p.damageTotal() * 0.8);
      this._t('dmg-label', p.retired ? 'RETIRED' : d.susp > 0.5 ? 'SUSPENSION' : d.rw > 0.5 ? 'REAR WING' : (d.fwL > 0.4 || d.fwR > 0.4) ? 'FRONT WING' : p.engTemp > 0.85 ? 'ENGINE HOT' : 'CAR OK');
      this._s('ers-fill', 'width', `${(p.ersEnergy * 100).toFixed(0)}%`);
      const ers = p.ersDeploying ? 'deploy' : p.ersHarvesting ? 'harvest' : '', drs = race.drs ? race.drs(p) : 'disabled';
      if (this._ersC !== ers) { this._ersC = ers; const el = $('ers-lbl'); if (el) { el.className = ers; el.textContent = ers === 'deploy' ? 'ERS ▲' : ers === 'harvest' ? 'ERS ▼' : 'ERS'; } }
      if (this._drsC !== drs) { this._drsC = drs; const el = $('drs-lbl'); if (el) el.className = drs; }
      const lim = !!(p.inPit || p.pitLimiter); if (this._lim !== lim) { this._lim = lim; this.setLimiter(lim); }
    }
    // standings
    if (mode === 'race' && (this._stT = (this._stT || 0) + dt) > 0.5) {
      this._stT = 0; let html = '';
      // (safety car out: a banner row on top)
      // (and the player's delta under the SC / VSC: + is slower than the reference, which is what it must be)
      if (race.sc) {
        const dl = race.sc.delta, dTxt = dl == null ? '' : `<span class="delta${dl < 0 ? ' neg' : ''}">${dl >= 0 ? '+' : ''}${dl.toFixed(1)}</span>`;
        html += `<div class="srow sc ${race.sc.phase}"><span>${race.sc.phase === 'yellow' ? '⚑' : race.sc.phase === 'restart' ? '⚐' : 'SC'}</span><span></span><span>${race.sc.label}</span><span></span><span style="text-align:right">${dTxt}</span></div>`;
      }
      race.positions.forEach((c, i) => {
        const gl = i > 0 ? race.gap?.(c, race.positions[0]) : null;
        const g = i === 0 ? (c.finished ? 'FIN' : `L${Math.min(race.lapsTotal, c.lap + 1)}`) : c.retired ? 'OUT' : fmtGap(gl != null ? gl : Math.abs(race.positions[0].totalDist - c.totalDist) / Math.max(12, race.positions[0].speed || 60)).slice(0, 7);
        // the tyre: compound letter in its colour; penalties still to serve (+5s / +10s / drive-through) beside the name
        const cmp = COMPOUNDS[c.tyres.compound], letter = c.tyres.compound[0];
        const pen = c.dsq ? '<span class="pen dsq">DSQ</span>' : c.penalties > 0 ? `<span class="pen">+${Math.round(c.penalties)}s</span>` : c.driveThrough ? '<span class="pen">DT</span>' : '';
        html += `<div class="srow${c === p ? ' me' : ''}"><span>${i + 1}</span><span class="sw" style="background:${c.color}"></span><span>${c.short}${c.inPit || c.pitLane ? ' ⛽' : ''}${pen}</span><span class="tyre" style="color:${cmp.color}">${letter}</span><span style="text-align:right">${g}</span></div>`;
      });
      if (html !== this._stHTML) { this._stHTML = html; $('standings').innerHTML = html; }   // (the DOM only touched when it changed)
    } else if (mode !== 'race' && this._stHTML !== '') { this._stHTML = ''; $('standings').innerHTML = ''; }
  }

  // ---- minimap ---------------------------------------------------------------
  initMinimap(track, pit) {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < track.n; i++) { minX = Math.min(minX, track.px[i]); maxX = Math.max(maxX, track.px[i]); minZ = Math.min(minZ, track.pz[i]); maxZ = Math.max(maxZ, track.pz[i]); }
    const pad = 14, W = this.mm.width; const sc = Math.min((W - 2 * pad) / (maxX - minX), (W - 2 * pad) / (maxZ - minZ));
    this.mmT = { sc, ox: pad + ((W - 2 * pad) - (maxX - minX) * sc) / 2 - minX * sc, oz: pad + ((W - 2 * pad) - (maxZ - minZ) * sc) / 2 - minZ * sc };
    const P = new Path2D(); for (let i = 0; i < track.n; i += 3) { const [x, y] = this.mmXY(track.px[i], track.pz[i]); i === 0 ? P.moveTo(x, y) : P.lineTo(x, y); } P.closePath(); this.mmPath = P;
    if (pit) { const Q = new Path2D(); for (let i = 0; i < pit.samples.n; i += 3) { const [x, y] = this.mmXY(pit.samples.px[i], pit.samples.pz[i]); i === 0 ? Q.moveTo(x, y) : Q.lineTo(x, y); } this.mmPit = Q; }
    const [sx, sy] = this.mmXY(track.px[0], track.pz[0]); this.mmSF = [sx, sy];
  }
  mmXY(x, z) { return [x * this.mmT.sc + this.mmT.ox, z * this.mmT.sc + this.mmT.oz]; }
  drawMinimap(cars, player) {
    const c = this.mmCtx; if (!this.mmPath) return;
    const now = performance.now(); if (now - (this._mmT || 0) < 50) return; this._mmT = now;   // 20 Hz is plenty for a 220 px map
    c.clearRect(0, 0, this.mm.width, this.mm.height);
    c.lineWidth = 4; c.strokeStyle = '#3a4152'; c.stroke(this.mmPath);
    if (this.mmPit) { c.lineWidth = 2; c.strokeStyle = '#6a5a2a'; c.stroke(this.mmPit); }
    c.fillStyle = '#fff'; c.fillRect(this.mmSF[0] - 3, this.mmSF[1] - 3, 6, 6);
    for (const car of cars) {
      if (car === player) continue; const [x, y] = this.mmXY(car.x, car.z);
      c.fillStyle = car.retired ? '#555' : car.color; c.beginPath(); c.arc(x, y, 3.2, 0, Math.PI * 2); c.fill();
    }
    const [px, py] = this.mmXY(player.x, player.z);
    c.fillStyle = '#fff'; c.strokeStyle = '#00d4ff'; c.lineWidth = 2; c.beginPath(); c.arc(px, py, 4.5, 0, Math.PI * 2); c.fill(); c.stroke();
  }

  // ---- pit menu --------------------------------------------------------------
  openPit(car, onConfirm) {
    const p = this.pit; p.open = true; p.onConfirm = onConfirm; p.compound = car.tyres.compound;
    p.repair = (car.dmg.rw > 0.3 || car.dmg.susp > 0.3) ? 'full' : (car.dmg.fwL > 0.3 || car.dmg.fwR > 0.3) ? 'wing' : 'none';
    this._eta = null; this.pitSelect('compound', p.compound); this._eta = null; this.pitSelect('repair', p.repair);
    open(p.el, 'fade', { now: true });
  }
  pitSelect(kind, v) {
    const p = this.pit; p[kind] = v;
    const sel = kind === 'compound' ? '#pit-tyres button' : '#pit-repairs button', attr = kind === 'compound' ? 'c' : 'r';
    for (const b of document.querySelectorAll(sel)) b.classList.toggle('sel', b.dataset[attr] === v);
    // (the stop time runs to its new value; the first one of a stop simply shows)
    const t = 2.4 + this.repairTime(p.repair), el = $('pit-eta'), f = (x) => `Stop time: ${x.toFixed(1)}s`;
    el.textContent = f(t); if (p.open) countUp(el, this._eta, t, { dur: 200, fmt: f }); this._eta = t;
  }
  repairTime(r) { return r === 'wing' ? 4.0 : r === 'full' ? 7.0 : 0; }
  pitConfirm() { const p = this.pit; if (!p.open) return; this._pitShut(); p.onConfirm?.({ compound: p.compound, repair: p.repair }); }
  closePit() { if (this.pit.open) this._pitShut(); else this.pit.el.classList.add('hidden'); }
  /** the pit menu fades away (opened again before it has gone: it stays) */
  _pitShut() { const p = this.pit; p.open = false; close(p.el, () => { if (p.open) p.el.classList.remove('hidden'); }); }
  handlePitKey(code) {
    if (!this.pit.open) return false;
    const m = { Digit1: ['compound', 'SOFT'], Digit2: ['compound', 'MEDIUM'], Digit3: ['compound', 'HARD'], Digit4: ['compound', 'INTER'], Digit5: ['compound', 'WET'], Digit7: ['repair', 'none'], Digit8: ['repair', 'wing'], Digit9: ['repair', 'full'] };
    if (m[code]) { this.pitSelect(...m[code]); return true; }
    if (code === 'Enter') { this.pitConfirm(); return true; }
    return false;
  }

  // ---- results ---------------------------------------------------------------
  /**
   * The results sheet's parts: the markup's own when it has them (the header, #res-tabs, #res-pages with its three
   * pages, the footer); the old single panel is put into those parts the first time. Wired once.
   * -> { sheet, lay, pages, tabs, ind, story, chips, title, tbl, champ }
   */
  _resDOM() {
    const sheet = $('results'), title = $('results-title'), tbl = $('results-table'), champ = $('champ-table');
    let pages = $('res-pages'), tabs = $('res-tabs'), story = $('res-story'), chips = sheet.querySelector('.res-chips');
    if (!pages) {
      // (the old markup: a title, two tables and a row of buttons, one under the other - made a header, pages, a footer)
      const head = document.createElement('header'); head.className = 'res-head';
      pages = document.createElement('div'); pages.id = 'res-pages'; pages.className = 'm-pages';
      if (!story) { story = document.createElement('div'); story.id = 'res-story'; }
      for (const p of [tbl, story, champ]) { p.classList.add('m-pg'); pages.appendChild(p); }
      const foot = document.createElement('footer'); foot.className = 'res-foot';
      foot.innerHTML = '<span class="res-keys"><kbd class="k-kbd">←</kbd><kbd class="k-kbd">→</kbd> pages · <kbd class="k-kbd">Enter</kbd> continue · <kbd class="k-kbd">T</kbd> telemetry</span>';
      const row = $('btn-next')?.closest('.row'); if (row) foot.appendChild(row);
      head.appendChild(title); sheet.prepend(head); sheet.insertBefore(pages, head.nextSibling); sheet.appendChild(foot);
    }
    if (!story) {
      // (the pages are there but the story's is not: it goes between the classification and the championship)
      story = document.createElement('div'); story.id = 'res-story';
      const P = [...pages.children]; const at = P.find((p) => p === tbl || p.contains(tbl));
      story.classList.add('m-pg'); pages.insertBefore(story, at ? at.nextSibling : null);
    }
    if (!chips) { chips = document.createElement('div'); chips.className = 'res-chips'; title.after(chips); }
    if (!tabs) { tabs = document.createElement('nav'); tabs.id = 'res-tabs'; tabs.className = 'k-tabs'; chips.after(tabs); }
    if (!tabs.querySelector('button')) tabs.innerHTML = '<button data-p="0">CLASSIFICATION</button><button data-p="1">RACE STORY</button><button data-p="2">CHAMPIONSHIP</button>';
    let ind = tabs.querySelector('.k-ind'); if (!ind) { ind = document.createElement('span'); ind.className = 'k-ind'; tabs.appendChild(ind); }
    const lay = $('L-results');
    if (!sheet.dataset.wired) {
      sheet.dataset.wired = '1';
      tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) this.resPage([...tabs.querySelectorAll('button')].indexOf(b)); });
      // (in a layer: whatever hides the sheet the old way - .hidden on #results - closes the layer instead, so its scrim
      //  never stays behind)
      if (lay) new MutationObserver(() => { if (sheet.classList.contains('hidden') && lay.classList.contains('open')) { sheet.classList.remove('hidden'); this._resClose(); } }).observe(sheet, { attributes: true, attributeFilter: ['class'] });
    }
    return { sheet, lay, pages, tabs, ind, story, chips, title, tbl, champ };
  }
  /** results page i (0 the classification, 1 the race story, 2 the championship) when it has something to show */
  resPage(i) {
    const R = this._res; if (!R || !this._resAvail?.[i]) return;
    const P = [...R.pages.children].filter((x) => x.classList.contains('m-pg')), want = [R.tbl, R.story, R.champ][i];
    const k = P.findIndex((p) => p === want || p.contains(want)); if (k < 0) return;
    page(R.pages, k, { tabs: R.tabs, ind: R.ind }); this._resAt = i;
    // (the fans' vote grows the first time the story is turned to - not on a quiet sheet)
    if (i === 1 && !R.story.classList.contains('grown') && !R.sheet.classList.contains('m-calm')) R.story.classList.add('grown');
  }
  /** the next (+1) or previous (-1) page that has something to show */
  resTab(d) {
    const A = this._resAvail || [true]; let i = this._resAt || 0;
    do { i += d; } while (i >= 0 && i < A.length && !A[i]);
    if (i >= 0 && i < A.length) this.resPage(i);
  }
  _resClose() { const R = this._res; this._resKeys?.(); this._resKeys = null; if (R?.lay) close(R.lay); }

  results(title, rows, champRows, facts = null) {
    hudCSS();
    const R = this._res = this._resDOM(), me = rows.find((r) => r.me), race = rows.some((r) => r.pts != null);
    // the header: what it was (the position and the penalty come off it: they are the big figure and a chip), then the chips
    const parts = String(title || '').split(' · ').map((s) => s.trim()).filter(Boolean);
    const ban = parts.find((s) => /SUSPENDED/i.test(s));
    R.title.textContent = parts.filter((s) => s !== ban && !/^P\d+\b/.test(s)).join(' · ') || 'RESULTS';
    R.title.setAttribute('aria-label', String(title || ''));
    const big = !me ? '' : me.car?.retired ? 'DNF' : race ? `P${me.pos}` : me.best || '';
    // (a race stopped or called off after an accident: the sheet is quiet - no sweep, no count, no award chip)
    const calm = /CANCELLED|ABANDONED/i.test(String(title || '')); R.sheet.classList.toggle('m-calm', calm);
    const pts = race && me ? me.pts || 0 : null, pen = me?.penalties || 0, dotd = !calm && !!facts?.dotd?.[0]?.me;
    R.chips.innerHTML = `${big ? `<b class="res-pos">${esc(big)}</b>` : ''}${pts != null ? `<span class="res-chip${pts > 0 ? ' up' : ''}" data-pts>+${pts} PTS</span>` : ''}`
      + `${pen > 0 ? `<span class="res-chip warn">+${Math.round(pen)}s PEN</span>` : ''}${dotd ? '<span class="res-chip gold">DRIVER OF THE DAY</span>' : ''}`
      + `${ban ? `<span class="res-chip down" title="${esc(ban)}">SUSPENDED NEXT RACE</span>` : ''}`;
    // the classification: two columns of eleven when the field is bigger than one
    const HEAD = '<span>#</span><span></span><span>DRIVER</span><span class="g">TIME / GAP</span><span class="b">BEST</span><span class="s">STOPS</span><span class="pt">PTS</span>';
    const two = rows.length > 11, half = Math.ceil(rows.length / 2);
    const row = (r, i) => `<div class="rr${r.me ? ' me' : ''}${r.car?.retired ? ' out' : ''}${i < 7 ? ' a' : ''}" style="--i:${i}" title="${esc(`P${r.pos} ${r.name} · ${r.team} · ${r.gap}`)}">`
      + `<span>${r.pos}</span><i class="sw" style="background:${esc(r.color)}"></i><span class="n"><b>${esc(r.name)}</b><small>${esc(r.team)}</small></span>`
      + `<span class="g">${esc(r.gap)}</span><span class="b">${esc(r.best)}</span><span class="s">${r.stops ?? ''}</span><span class="pt">${r.pts ?? ''}</span></div>`;
    R.tbl.innerHTML = `<div class="rr-list${two ? ' c2' : ''}" style="--rn:${two ? half + 1 : rows.length + 1}"><div class="rr rh">${HEAD}</div>`
      + rows.map((r, i) => (two && i === half ? `<div class="rr rh rh2">${HEAD}</div>` : '') + row(r, i)).join('') + '</div>';
    // (narrow sheets only - one column, below 900 px - let the pages scroll; on a laptop they fit)
    for (const x of [R.tbl, R.story, R.champ]) x.setAttribute('data-scroll-ok', '');
    // the race story: the fans' vote and the race in numbers
    R.story.classList.remove('grown');
    if (facts) {
      const D = facts.dotd?.[0];
      R.story.innerHTML = (D ? `<div class="rs-dotd"><div class="rs-dh"><small>DRIVER OF THE DAY</small><b style="--c:${esc(D.color)}">${esc(D.name)}${D.me ? ' · YOU' : ''}</b><span>${D.pct}% of the fans' vote · ${esc(D.why)}</span></div>
        <div class="rs-bars">${facts.dotd.map((x) => `<div class="${x.me ? 'me' : ''}"><span>${esc(last(x.name))}</span><u><i style="--v:${(x.pct / 100).toFixed(3)};background:${esc(x.color)}"></i></u><em>${x.pct}%</em></div>`).join('')}</div></div>` : '')
        + `<div class="rs-facts">${(facts.facts || []).slice(0, 8).map(([k, v, c]) => `<div class="k-tile"${c ? ` style="--c:${esc(c)}"` : ''}><small>${esc(k)}</small><b title="${esc(v)}">${esc(v)}</b></div>`).join('')}</div>`;
    } else R.story.innerHTML = '';
    // the championship: the points as bars against the leader's
    if (champRows?.length) {
      const top = Math.max(1, ...champRows.map((r) => r.points)), ctwo = champRows.length > 11, ch = Math.ceil(champRows.length / 2);
      const CH = '<span>#</span><span></span><span>DRIVER</span><span></span><span class="pt">PTS</span>';
      R.champ.innerHTML = `<div class="rr-list${ctwo ? ' c2' : ''}" style="--rn:${ctwo ? ch + 1 : champRows.length + 1}"><div class="rr rc rh">${CH}</div>`
        + champRows.map((r, i) => (ctwo && i === ch ? `<div class="rr rc rh rh2">${CH}</div>` : '')
          + `<div class="rr rc${r.me ? ' me' : ''}"><span>${i + 1}</span><i class="sw" style="background:${esc(r.color)}"></i><span class="n"><b>${esc(r.name)}</b></span><u><i style="--v:${(r.points / top).toFixed(3)};background:${esc(r.color)}"></i></u><span class="pt">${r.points}</span></div>`).join('') + '</div>';
    } else R.champ.innerHTML = '';
    // the tabs: only the pages there is something for (none at all when there is one page)
    this._resAvail = [true, !!facts, !!champRows?.length];
    const B = [...R.tabs.querySelectorAll('button')];
    B.forEach((b, i) => b.classList.toggle('hidden', !this._resAvail[i]));
    R.tabs.classList.toggle('hidden', this._resAvail.filter(Boolean).length < 2);
    // open: the layer when the markup has one, else the sheet on its own
    R.sheet.classList.remove('hidden');
    if (R.lay) open(R.lay, 'layer', { now: true });
    else R.sheet.classList.add('res-solo');
    this._resAt = 0; this.resPage(0);
    if (pts && !calm) countUp(R.chips.querySelector('[data-pts]'), 0, pts, { fmt: (x) => `+${Math.round(x)} PTS` });
    // the keys: pages, and Enter for the way on (not a held one, nor in the first moment)
    const t0 = performance.now();
    this._resKeys?.();
    this._resKeys = keys(R.lay || R.sheet, {
      ArrowLeft: () => this.resTab(-1), ArrowRight: () => this.resTab(1), q: () => this.resTab(-1), e: () => this.resTab(1), PageUp: () => this.resTab(-1), PageDown: () => this.resTab(1),
      1: () => this.resPage(0), 2: () => this.resPage(1), 3: () => this.resPage(2),
      Enter: (e) => { if (e.repeat || performance.now() - t0 < 350) return; const b = $('btn-next'); if (b && b.getClientRects().length && !b.disabled) b.click(); },
    });
  }
}
