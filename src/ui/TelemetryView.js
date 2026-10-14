// The lap telemetry report: pick a lap, compare it with the reference lap (fastest AI lap, else the ideal lap).
// Charts share a distance axis (speed, delta time, throttle / brake, steering); hovering any of them puts a
// cursor on all of them and on the track map. The map is coloured by where time is gained or lost, and the corner
// table gives braking points, minimum speeds and time per corner. Export writes the whole session as JSON.
// One screen with nothing to scroll: a lap stepper on one row (the chips run sideways under a soft edge), the lap's
// numbers on one row, the four charts sharing what height there is (sized as their boxes change), and beside them the
// map or the corner table (C swaps them; only that table scrolls). It opens and closes through the motion kit, and asks
// for the 3D behind to be held still while it is up (data-freeze).
import { timeAt, valueAt } from '../race/Telemetry.js';
import { ensureMotion, reduced, open as openEl, close as closeEl, page, keys, underline } from './Motion.js';

const C = { you: '#27d3ff', ref: '#ff9f1a', ideal: 'rgba(255,255,255,0.35)', grid: 'rgba(255,255,255,0.07)', axis: 'rgba(255,255,255,0.45)', gain: '#2fd27a', loss: '#ff4d4d', thr: '#2fd27a', brk: '#ff4d4d' };
const fmt = (t) => { if (t == null || !isFinite(t)) return '—'; const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s.toFixed(3).padStart(6, '0')}`; };
const sgn = (x, d = 3) => (x == null || !isFinite(x) ? '—' : `${x > 0 ? '+' : x < 0 ? '−' : '±'}${Math.abs(x).toFixed(d)}`);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CSS = `
#telemetry { position: fixed; inset: 16px; z-index: 40; display: grid; grid-template-rows: auto auto minmax(0,1fr) auto; grid-template-columns: minmax(0,1fr); gap: 10px; overflow: hidden; padding: 14px 18px 10px;
  background: rgba(8,9,14,.97); border: 1px solid rgba(255,255,255,.09); border-radius: 16px; backdrop-filter: none; -webkit-backdrop-filter: none; box-shadow: 0 30px 80px rgba(0,0,0,.6); font-family: var(--k-font); color: var(--k-fg); }
#telemetry .tl-head { display: flex; align-items: center; gap: 12px; min-width: 0; }
#telemetry .tl-head h2 { flex: none; margin: 0; font: 800 15px/1 var(--k-font); letter-spacing: .22em; }
#telemetry .tl-step { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }
#telemetry .tl-step > button { flex: none; width: 30px; height: 30px; padding: 0; border-radius: 8px; font-size: 11px; line-height: 1; }
#telemetry .tl-step > button:disabled { opacity: .35; cursor: default; }
#telemetry .tl-pill { flex: none; display: inline-flex; align-items: center; gap: 8px; height: 30px; padding: 0 12px; border-radius: 15px; background: rgba(39,211,255,.12); border: 1px solid rgba(39,211,255,.7); font: 600 12px/1 var(--k-font); white-space: nowrap; font-variant-numeric: tabular-nums; }
#telemetry .tl-pill b { font-weight: 800; font-size: 13px; } #telemetry .tl-pill small { color: var(--k-dim); font-size: 10.5px; }
/* (the lap chips: one row that runs sideways, its ends faded) */
#telemetry .tl-laps { flex: 1; min-width: 0; display: flex; gap: 6px; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; scroll-snap-type: x proximity; padding: 0 24px;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 24px, #000 calc(100% - 24px), transparent); mask-image: linear-gradient(90deg, transparent, #000 24px, #000 calc(100% - 24px), transparent); }
#telemetry .tl-laps::-webkit-scrollbar { display: none; }
#telemetry .tl-laps button { flex: none; scroll-snap-align: center; white-space: nowrap; font-size: 11px; padding: 5px 9px; font-weight: 500; font-variant-numeric: tabular-nums; }
#telemetry .tl-laps button b { font-weight: 800; margin-left: 4px; }
#telemetry .tl-laps button.sel { border-color: #27d3ff; background: rgba(39,211,255,0.14); }
#telemetry .tl-laps button.inv { opacity: .6; }
#telemetry .tl-empty { color: var(--k-dim); font-size: 12px; white-space: nowrap; align-self: center; }
#telemetry .tl-actions { flex: none; display: flex; gap: 6px; }
#telemetry .tl-actions button { padding: 8px 12px; font-size: 11px; letter-spacing: .12em; border-radius: 8px; }
#telemetry .tl-sum { display: flex; gap: 18px; flex-wrap: nowrap; overflow: hidden; min-width: 0; font-size: 12px; }
#telemetry .tl-sum > div { flex: none; display: flex; flex-direction: column; gap: 2px; }
#telemetry .tl-sum span { font-size: 10px; letter-spacing: .14em; color: var(--k-dim); white-space: nowrap; }
#telemetry .tl-sum b { font-size: 15px; font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }
#telemetry .tl-sum i { font-style: normal; font-size: 12px; }
#telemetry .g { color: #2fd27a; } #telemetry .r { color: #ff4d4d; }
#telemetry .tl-body { display: grid; grid-template-columns: minmax(0, 2.2fr) minmax(260px, 1fr); gap: 14px; min-height: 0; }
#telemetry .tl-charts { display: grid; grid-template-rows: 3fr 2fr 2fr 2fr; gap: 6px; min-width: 0; min-height: 0; }
#telemetry .tl-chart { display: grid; grid-template-rows: auto minmax(0,1fr); gap: 2px; min-height: 0; }
#telemetry .tl-lbl { font-size: 10px; letter-spacing: .12em; color: var(--k-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#telemetry .tl-lbl i { font-style: normal; margin-left: 8px; }
/* (a canvas laid over its box, so its own pixel size never pushes the layout) */
#telemetry .tl-cv { position: relative; min-width: 0; min-height: 0; }
#telemetry .tl-cv canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
#telemetry .tl-chart canvas { cursor: crosshair; }
#telemetry .tl-side { display: grid; grid-template-rows: auto minmax(0,1fr); gap: 8px; min-width: 0; min-height: 0; }
#telemetry .tl-stabs { border-bottom: 1px solid rgba(255,255,255,.08); }
#telemetry .tl-sp { min-height: 0; }
#telemetry .tl-sp > .m-pg { display: grid; min-height: 0; }
#telemetry .tl-mapp { grid-template-rows: minmax(0,1fr); }
#telemetry .tl-cor { grid-template-rows: minmax(0,1fr) auto; gap: 6px; }
#telemetry .tl-table { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
#telemetry .tl-table table { width: 100%; border-collapse: collapse; font-size: 11.5px; font-variant-numeric: tabular-nums; }
#telemetry .tl-table th { position: sticky; top: 0; z-index: 1; height: 21px; padding: 0 4px; background: #0b0d13; text-align: left; font-size: 9.5px; letter-spacing: .12em; color: var(--k-dim); font-weight: 500; }
#telemetry .tl-table td { height: 21px; padding: 0 4px; border-top: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
#telemetry .tl-table td small { color: var(--k-dim); margin-left: 5px; }
#telemetry .tl-note { font-size: 10px; color: var(--k-dim); }
#telemetry .tl-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 0; min-height: 20px; }
#telemetry .tl-readout { flex: 1; min-width: 0; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#telemetry .tl-keys { flex: none; font-size: 11px; color: var(--k-dim); white-space: nowrap; }
#telemetry .tl-keys kbd { margin: 0 2px; }
#telemetry .tl-ptabs { display: none; }
@media (max-height: 700px) { #telemetry { inset: 10px; padding: 10px 14px 8px; gap: 8px; } #telemetry .tl-sum b { font-size: 14px; } }
@media (max-width: 899px) {
  #telemetry { inset: 0; border-radius: 0; padding: 10px 12px 8px; }
  #telemetry .tl-head { flex-wrap: wrap; row-gap: 8px; }
  #telemetry .tl-ptabs { display: flex; order: 2; }
  #telemetry .tl-actions { order: 3; margin-left: auto; }
  #telemetry .tl-step { order: 4; flex-basis: 100%; }
  #telemetry .tl-sum { flex-wrap: wrap; gap: 6px 14px; }
  #telemetry .tl-body { grid-template-columns: minmax(0,1fr); }
  #telemetry .tl-body.pv-charts .tl-side, #telemetry .tl-body.pv-side .tl-charts { display: none; }
  #telemetry .tl-stabs { display: none; } #telemetry .tl-side { grid-template-rows: minmax(0,1fr); }
  #telemetry .tl-keys { display: none; }
}
`;

export class TelemetryView {
  constructor(saveFile) { this.saveFile = saveFile; this.el = null; this.hover = null; this._shown = false; this.side = 0; this._raf = 0; }

  _build() {
    ensureMotion();
    if (!document.getElementById('tl-css')) { const st = document.createElement('style'); st.id = 'tl-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = document.createElement('div'); el.id = 'telemetry'; el.className = 'hidden';
    // (the 3D behind is held still while the report is up: main.js reads data-freeze on m:open)
    el.dataset.freeze = 'still'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Lap telemetry');
    const cv = (id) => `<div class="tl-cv"><canvas id="${id}"></canvas></div>`;
    el.innerHTML = `
      <div class="tl-head">
        <h2>TELEMETRY</h2>
        <nav class="k-tabs tl-ptabs" aria-label="View"><button data-pv="charts" class="on">CHARTS</button><button data-pv="0">MAP</button><button data-pv="1">CORNERS</button><span class="k-ind"></span></nav>
        <div class="tl-step"><button class="tl-prev" aria-label="Previous lap">◀</button><div class="tl-pill" id="tl-pill"></div><button class="tl-next" aria-label="Next lap">▶</button><div class="tl-laps" id="tl-laps" data-scroll-ok></div></div>
        <div class="tl-actions"><button id="tl-export" class="ghost">EXPORT JSON</button><button id="tl-close" class="ghost">CLOSE ✕</button></div>
      </div>
      <div class="tl-sum" id="tl-sum"></div>
      <div class="tl-body pv-charts">
        <div class="tl-charts">
          <div class="tl-chart"><span class="tl-lbl">SPEED km/h <i style="color:${C.you}">● you</i> <i style="color:${C.ref}">● <b id="tl-reflbl">reference</b></i> <i style="color:#aaa">┄ ideal</i></span>${cv('tl-speed')}</div>
          <div class="tl-chart"><span class="tl-lbl">DELTA s <i style="color:${C.gain}">gaining</i> <i style="color:${C.loss}">losing</i></span>${cv('tl-delta')}</div>
          <div class="tl-chart"><span class="tl-lbl">THROTTLE <i style="color:${C.thr}">▲</i> / BRAKE <i style="color:${C.brk}">▼</i> (reference faint)</span>${cv('tl-pedals')}</div>
          <div class="tl-chart"><span class="tl-lbl">STEERING <i style="color:#fff">—</i> · DISTANCE FROM THE RACING LINE <i style="color:${C.you}">— you</i> <i style="color:${C.ref}">— ref</i> (up = left)</span>${cv('tl-steer')}</div>
        </div>
        <div class="tl-side">
          <nav class="k-tabs tl-stabs" aria-label="Map or corners"><button data-side="0" class="on">MAP</button><button data-side="1">CORNERS</button><span class="k-ind"></span></nav>
          <div class="m-pages tl-sp"><section class="m-pg tl-mapp on">${cv('tl-map')}</section><section class="m-pg tl-cor"><div class="tl-table" id="tl-table" data-scroll-ok></div><div class="tl-note">brake: metres before the apex where the brake passes 30 % · small figures: reference</div></section></div>
        </div>
      </div>
      <div class="tl-foot"><div class="tl-readout" id="tl-readout">Hover a chart for values at that point of the lap</div>
        <div class="tl-keys"><kbd class="k-kbd">←</kbd><kbd class="k-kbd">→</kbd> lap · <kbd class="k-kbd">Home</kbd> best · <kbd class="k-kbd">C</kbd> map / corners · <kbd class="k-kbd">T</kbd> close</div></div>`;
    document.body.appendChild(el); this.el = el;
    el.querySelector('#tl-close').addEventListener('click', () => this.close());
    el.querySelector('#tl-export').addEventListener('click', () => this._export());
    el.querySelector('#tl-laps').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) this._select(+b.dataset.i); });
    el.querySelector('.tl-prev').addEventListener('click', () => this._step(-1));
    el.querySelector('.tl-next').addEventListener('click', () => this._step(1));
    el.querySelector('.tl-stabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-side]'); if (b) this._side(+b.dataset.side); });
    el.querySelector('.tl-ptabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-pv]'); if (b) this._view(b.dataset.pv); });
    for (const id of ['tl-speed', 'tl-delta', 'tl-pedals', 'tl-steer']) {
      const c = el.querySelector('#' + id);
      c.addEventListener('mousemove', (e) => { const r = c.getBoundingClientRect(); this.hover = this._dAtX(e.clientX - r.left, r.width); this._queue(); });
      c.addEventListener('mouseleave', () => { this.hover = null; this._queue(); });
    }
    // (the charts follow their own boxes: a resized window, the phone's view switch, the first layout after opening)
    if (typeof ResizeObserver !== 'undefined') { this._ro = new ResizeObserver(() => { if (this._shown) { this._ul(); this._queue(); } }); this._ro.observe(el.querySelector('.tl-body')); }
    else window.addEventListener('resize', () => { if (this._shown) { this._ul(); this._queue(); } });
  }
  /** the tab underlines under their chosen tabs (after a resize: a phone's tabs appear, the side's go) */
  _ul() {
    for (const nav of this.el.querySelectorAll('.k-tabs')) { const b = nav.querySelector('button.on'), ind = nav.querySelector('.k-ind'); if (b && ind && nav.offsetParent) underline(ind, b); }
  }

  get open() { return !!this.el && this._shown; }

  /** @param tel Telemetry; meta: { driver, team, onClose } */
  show(tel, meta = {}) {
    if (!this.el) this._build();
    this.tel = tel; this.meta = meta; this.hover = null;
    const laps = tel.laps; const best = tel.bestLap();
    this.sel = best ? laps.indexOf(best) : laps.length - 1;
    this._shown = true;
    openEl(this.el, 'pop', { now: true });
    // (its keys on top of the stack while it is up: the lap, the best lap, map or corners; T and Esc are main.js's)
    this._unkeys?.();
    this._unkeys = keys(this.el, {
      ArrowLeft: () => this._step(-1), ArrowRight: () => this._step(1),
      Home: () => { const b = this.tel.bestLap(); if (b) this._select(this.tel.laps.indexOf(b)); },
      c: () => this._side(this.side ? 0 : 1),
    });
    this._side(this.side, true);
    // (a phone: the top-level view as it was left, its underline set now the report has a size)
    this._view(this.el.querySelector('.tl-body').classList.contains('pv-charts') ? 'charts' : String(this.side));
    this._render(true);
  }
  close() {
    if (!this.el || !this._shown) return;
    this._shown = false; this._unkeys?.(); this._unkeys = null;
    // (opened again before the fade was over: it stays)
    closeEl(this.el, () => { if (this._shown) this.el.classList.remove('hidden'); });
    const f = this.meta?.onClose; this.meta = null; f && f();
  }

  _export() {
    const t = this.tel; if (!t) return;
    const text = t.exportJSON({ driver: this.meta?.driver || null, team: this.meta?.team || null });
    const name = `telemetry-${t.track.def.id}-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.json`;
    this.saveFile(name, text);
  }

  /** lap i chosen (a chip, the arrows, Home) */
  _select(i) {
    const n = this.tel?.laps.length || 0; if (!n) return;
    i = Math.max(0, Math.min(n - 1, i)); if (i === this.sel) return;
    this.sel = i; this._render(false);
  }
  _step(d) { if (this.sel == null || this.sel < 0) this._select(0); else this._select(this.sel + d); }
  /** the side panel: 0 the map, 1 the corner table */
  _side(i, now = false) {
    this.side = i;
    const nav = this.el.querySelector('.tl-stabs');
    page(this.el.querySelector('.tl-sp'), i, { tabs: nav, ind: nav.querySelector('.k-ind') });
    // (on a phone the side is one of the top-level views: follow it there when it is the one showing)
    if (!now && !this.el.querySelector('.tl-body').classList.contains('pv-charts')) this._view(String(i));
    if (i === 0) this._queue();
  }
  /** a phone's top-level view: 'charts', '0' (the map) or '1' (the corners) */
  _view(v) {
    const body = this.el.querySelector('.tl-body'), nav = this.el.querySelector('.tl-ptabs'), B = [...nav.querySelectorAll('button')];
    body.classList.toggle('pv-charts', v === 'charts'); body.classList.toggle('pv-side', v !== 'charts');
    const k = B.findIndex((b) => b.dataset.pv === v); B.forEach((b, j) => b.classList.toggle('on', j === k));
    if (v !== 'charts' && +v !== this.side) this._side(+v, true);
    this._ul(); this._queue();
  }

  _render(first) {
    const t = this.tel, laps = t.laps, el = this.el, bestLap = t.bestLap();
    el.querySelector('#tl-laps').innerHTML = laps.length ? laps.map((l, i) => {
      const best = l === bestLap;
      return `<button data-i="${i}" class="${i === this.sel ? 'sel' : ''} ${l.valid ? '' : 'inv'}"${l.valid ? '' : ` title="${esc(l.flags.join(' '))}"`}>L${l.n}<b>${l.time != null ? fmt(l.time) : '…'}</b>${best ? ' ★' : ''}</button>`;
    }).join('') : '<span class="tl-empty">No lap recorded yet: cross the timing line to start one.</span>';
    this.lap = laps[this.sel] || null;
    const L0 = this.lap;
    el.querySelector('#tl-pill').innerHTML = L0 ? `LAP ${L0.n} <b>${L0.time != null ? fmt(L0.time) : 'in progress'}</b>${L0 === bestLap ? ' ★' : ''}${L0.valid ? '' : ` <small>${esc(L0.flags.join(' '))}</small>`}` : 'NO LAP';
    el.querySelector('.tl-prev').disabled = !laps.length || this.sel <= 0; el.querySelector('.tl-next').disabled = !laps.length || this.sel >= laps.length - 1;
    // (the chosen chip brought into the middle of the strip)
    const chip = el.querySelector('#tl-laps button.sel');
    if (chip) { const strip = el.querySelector('#tl-laps'); if (strip.scrollWidth > strip.clientWidth + 1) chip.scrollIntoView({ inline: 'center', block: 'nearest', behavior: first || reduced() ? 'auto' : 'smooth' }); }
    this.ref = t.reference();
    el.querySelector('#tl-reflbl').textContent = this.ref.label;
    this.dl = this.lap ? t.delta(this.lap, this.ref.lap, 10) : [];
    const L = this.lap, R = this.ref.lap;
    if (L) {
      const lapT = L.time != null ? L.time : L.samples.t[L.samples.t.length - 1];
      const sec = L.sectors || [], rsec = sectorsOf(t, R);
      const cell = (a, b) => `${fmt(a).replace(/^0:/, '')} <i class="${a - b <= 0 ? 'g' : 'r'}">${sgn(a - b)}</i>`;
      el.querySelector('#tl-sum').innerHTML = `
        <div><span>LAP ${L.n}</span><b>${L.time != null ? fmt(lapT) : 'in progress'}</b></div>
        <div><span>REFERENCE</span><b>${fmt(R.time)}</b></div>
        <div><span>DELTA</span><b class="${L.time != null && L.time - R.time <= 0 ? 'g' : 'r'}">${L.time != null ? sgn(L.time - R.time) : '—'}</b></div>
        ${sec.length ? sec.map((s, k) => `<div><span>SECTOR ${k + 1}</span><b>${cell(s, rsec[k])}</b></div>`).join('') : ''}
        <div><span>OFF TRACK</span><b>${L.offTrack.toFixed(1)} s</b></div>
        <div><span>TOP SPEED</span><b>${Math.round(Math.max(...L.samples.v))} km/h</b></div>`;
      const rows = t.corners(L, R);
      el.querySelector('#tl-table').innerHTML = `<table><thead><tr><th>TURN</th><th>BRAKE</th><th>MIN km/h</th><th>TIME</th></tr></thead><tbody>${rows.map((r) => `
        <tr><td>${r.n} <small>${esc(r.name)}</small></td>
        <td>${r.you?.brake != null ? Math.round(r.you.brake) + ' m' : 'lift'}<small>${r.ref?.brake != null ? Math.round(r.ref.brake) + ' m' : 'lift'}</small></td>
        <td>${r.you ? Math.round(r.you.vMin) : '—'}<small>${r.ref ? Math.round(r.ref.vMin) : '—'}</small></td>
        <td class="${r.dt == null ? '' : r.dt <= 0 ? 'g' : 'r'}">${sgn(r.dt, 2)}</td></tr>`).join('')}</tbody></table>`;
    } else { el.querySelector('#tl-sum').innerHTML = ''; el.querySelector('#tl-table').innerHTML = ''; }
    this._draw();
  }

  /** a redraw on the next frame (mouse moves and box resizes come many to a frame) */
  _queue() {
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => { this._raf = 0; if (this._shown) this._draw(); });
  }

  /** x pixel -> lap distance */
  _dAtX(x, w) { const pad = 34; return Math.max(0, Math.min(this.tel.track.length, (x - pad) / (w - pad - 6) * this.tel.track.length)); }

  _draw() {
    if (!this.el || !this.tel) return;
    const L = this.lap, R = this.ref?.lap, t = this.tel, len = t.track.length;
    const prof = t.profile, tr = t.track;
    const ideal = (d) => prof[tr.idxAtS(Math.max(0, Math.min(len - 0.01, d)))] * 3.6;
    this._chart('tl-speed', 0, 360, [60, 120, 180, 240, 300], (ctx, X, Y) => {
      line(ctx, X, Y, (f) => ideal(f), len, C.ideal, 1, [4, 4]);
      if (R) series(ctx, X, Y, R, 'v', C.ref, 1.5);
      if (L) series(ctx, X, Y, L, 'v', C.you, 2);
    });
    const dmax = Math.max(0.5, ...this.dl.map((p) => Math.abs(p.dt))) * 1.1;
    this._chart('tl-delta', -dmax, dmax, [0], (ctx, X, Y) => {
      if (!this.dl.length) return;
      // filled: above zero (behind) red, below (ahead) green
      for (let k = 1; k < this.dl.length; k++) {
        const a = this.dl[k - 1], b = this.dl[k];
        ctx.fillStyle = (a.dt + b.dt) / 2 > 0 ? 'rgba(255,77,77,0.35)' : 'rgba(47,210,122,0.35)';
        ctx.beginPath(); ctx.moveTo(X(a.d), Y(0)); ctx.lineTo(X(a.d), Y(a.dt)); ctx.lineTo(X(b.d), Y(b.dt)); ctx.lineTo(X(b.d), Y(0)); ctx.fill();
      }
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); this.dl.forEach((p, k) => (k ? ctx.lineTo(X(p.d), Y(p.dt)) : ctx.moveTo(X(p.d), Y(p.dt)))); ctx.stroke();
    });
    this._chart('tl-pedals', -1, 1, [0], (ctx, X, Y) => {
      if (R) { series(ctx, X, Y, R, 'thr', 'rgba(47,210,122,0.35)', 1); series(ctx, X, Y, R, 'brk', 'rgba(255,77,77,0.35)', 1, -1); }
      if (L) { area(ctx, X, Y, L, 'thr', 'rgba(47,210,122,0.75)', 1); area(ctx, X, Y, L, 'brk', 'rgba(255,77,77,0.85)', -1); }
    }, (v) => (v > 0 ? 'thr' : v < 0 ? 'brk' : ''));
    this._chart('tl-steer', -1, 1, [0], (ctx, X, Y) => {
      if (R) series(ctx, X, Y, R, 'lat', 'rgba(255,159,26,0.5)', 1, 1 / 8);
      if (L) { series(ctx, X, Y, L, 'lat', 'rgba(39,211,255,0.5)', 1, 1 / 8); series(ctx, X, Y, L, 'steer', '#fff', 1.2); }
    }, (v) => (v === 1 ? 'L / 8 m' : v === -1 ? 'R / −8 m' : ''));
    this._map();
    // readout
    const ro = this.el.querySelector('#tl-readout');
    if (this.hover != null && L) {
      const d = this.hover, v = valueAt(L, 'v', d), rv = R ? valueAt(R, 'v', d) : null, dt = timeAt(L, d) - (R ? timeAt(R, d) : 0);
      ro.innerHTML = `<b>${Math.round(d)} m</b> · you <b style="color:${C.you}">${Math.round(v)} km/h</b> gear ${Math.round(valueAt(L, 'gear', d))} · throttle ${Math.round(valueAt(L, 'thr', d) * 100)} % · brake ${Math.round(valueAt(L, 'brk', d) * 100)} % · ${(valueAt(L, 'gLat', d)).toFixed(1)} g lat · ref <b style="color:${C.ref}">${rv == null ? '—' : Math.round(rv)} km/h</b> · delta <b class="${dt <= 0 ? 'g' : 'r'}">${sgn(dt)}</b>`;
    } else ro.textContent = 'Hover a chart for values at that point of the lap';
  }

  /** one chart: axes, grid at `ticks`, corner markers, the drawing callback, the hover cursor */
  _chart(id, y0, y1, ticks, fn, tickLabel = (v) => String(v)) {
    const cv = this.el.querySelector('#' + id), dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const len = this.tel.track.length, pad = 34;
    const X = (d) => pad + (d / len) * (w - pad - 6), Y = (v) => 4 + (1 - (v - y0) / (y1 - y0)) * (h - 18);
    ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = C.axis; ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (const v of ticks) { ctx.beginPath(); ctx.moveTo(pad, Y(v)); ctx.lineTo(w - 6, Y(v)); ctx.stroke(); const lb = tickLabel(v); if (lb) ctx.fillText(lb, 2, Y(v) + 3); }
    for (const c of this.tel.track.def.corners || []) { if (c.s == null) continue; ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(X(c.s), 4); ctx.lineTo(X(c.s), h - 14); ctx.stroke(); ctx.fillStyle = C.axis; ctx.fillText(String(c.n), X(c.s) - 3, h - 3); }
    ctx.save(); ctx.beginPath(); ctx.rect(pad, 0, w - pad, h - 14); ctx.clip(); fn(ctx, X, Y); ctx.restore();
    if (this.hover != null) { ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(this.hover), 0); ctx.lineTo(X(this.hover), h - 14); ctx.stroke(); ctx.setLineDash([]); }
  }

  /** the circuit, each 50 m coloured by time gained (green) or lost (red) against the reference over that stretch */
  _map() {
    const cv = this.el.querySelector('#tl-map'), dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const tr = this.tel.track, n = tr.n;
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (let i = 0; i < n; i++) { x0 = Math.min(x0, tr.px[i]); x1 = Math.max(x1, tr.px[i]); z0 = Math.min(z0, tr.pz[i]); z1 = Math.max(z1, tr.pz[i]); }
    const sc = Math.min((w - 20) / (x1 - x0), (h - 20) / (z1 - z0)), ox = (w - (x1 - x0) * sc) / 2, oz = (h - (z1 - z0) * sc) / 2;
    const P = (i) => [ox + (tr.px[i] - x0) * sc, oz + (tr.pz[i] - z0) * sc];
    ctx.lineCap = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath();
    for (let i = 0; i <= n; i++) { const [x, y] = P(i % n); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    const dl = this.dl; if (dl.length) {
      const step = 5;   // 5 x 10 m = 50 m stretches
      for (let k = 0; k + step < dl.length; k += step) {
        const g = dl[k + step].dt - dl[k].dt, m = Math.min(1, Math.abs(g) / 0.08);
        ctx.strokeStyle = g <= 0 ? `rgba(47,210,122,${0.25 + 0.75 * m})` : `rgba(255,77,77,${0.25 + 0.75 * m})`; ctx.lineWidth = 4;
        ctx.beginPath();
        for (let d = dl[k].d; d <= dl[k + step].d; d += 4) { const [x, y] = P(tr.idxAtS(d)); d === dl[k].d ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
      }
    }
    const [sx, sy] = P(0); ctx.fillStyle = '#fff'; ctx.fillRect(sx - 3, sy - 3, 6, 6);
    if (this.hover != null) { const [hx, hy] = P(tr.idxAtS(this.hover)); ctx.fillStyle = C.you; ctx.beginPath(); ctx.arc(hx, hy, 5, 0, 7); ctx.fill(); }
    ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = C.axis;
    for (const c of tr.def.corners || []) { if (c.s == null) continue; const [cx, cy] = P(tr.idxAtS(c.s)); ctx.fillText(String(c.n), cx + 6, cy - 4); }
  }
}

function sectorsOf(t, L) {
  if (!L) return [null, null, null]; const len = t.track.length, a = timeAt(L, len / 3), b = timeAt(L, 2 * len / 3);
  return [a, b - a, L.time - b];
}
/** a lap channel against distance (scale: 1 = as is, -1 flips it below zero for brake / steering) */
function series(ctx, X, Y, L, ch, color, w, scale = 1) {
  const D = L.samples.d, V = L.samples[ch]; if (!V || !V.length) return;
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath();
  for (let i = 0; i < D.length; i++) { const x = X(Math.max(0, D[i])), y = Y(V[i] * scale); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
}
/** a lap channel as a filled area from zero (up for throttle, down for brake) */
function area(ctx, X, Y, L, ch, color, scale) {
  const D = L.samples.d, V = L.samples[ch]; if (!V || !V.length) return;
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(X(Math.max(0, D[0])), Y(0));
  for (let i = 0; i < D.length; i++) ctx.lineTo(X(Math.max(0, D[i])), Y(V[i] * scale));
  ctx.lineTo(X(Math.max(0, D[D.length - 1])), Y(0)); ctx.closePath(); ctx.fill();
}
function line(ctx, X, Y, f, len, color, w, dash) {
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath();
  for (let d = 0; d <= len; d += 10) { const x = X(d), y = Y(f(d)); d ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); ctx.setLineDash([]);
}
