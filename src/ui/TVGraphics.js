// The broadcast's graphics, over the world feed (camera/TVDirector.js) in the team principal's race (main.js TP): the
// timing tower down the left (the order, each car's interval to the car ahead or its gap to the leader - the two
// alternate, as on television - its tyre and the laps on it, the pit lane, the cars out; your team's two cars marked,
// the car on screen pointed at; a row clicked follows that car), the lap count and the flag over it; the caption of the
// car on screen at every cut (its place, its name and team, its tyre) or of the fight it is in (the two cars and the
// gap); race control's messages (the safety car, a retirement, a stop and its time, the fastest lap, a penalty); and the
// camera's name. Plain DOM, built once and only written where a value changed.
import { COMPOUNDS } from '../vehicle/Tyres.js';

const CSS = `
#tvg { --tvf: "Segoe UI Variable", "Segoe UI", Inter, system-ui, Roboto, sans-serif; position: fixed; inset: 0; pointer-events: none; z-index: 22; font-family: "Segoe UI Variable", "Segoe UI", Inter, system-ui, Roboto, sans-serif; color: #fff; }
#tvg.hidden { display: none; }
#tvg .tower { position: absolute; left: 14px; top: 14px; width: 214px; background: rgba(12,14,20,.86); border-radius: 6px; overflow: hidden; pointer-events: auto; box-shadow: 0 6px 22px rgba(0,0,0,.35); }
#tvg .th { display: flex; align-items: center; justify-content: space-between; padding: 7px 10px 6px; background: #e10600; font: 800 13px/1 var(--tvf); letter-spacing: .06em; }
#tvg .th b { font-weight: 900; } #tvg .th small { font-weight: 700; font-size: 10px; letter-spacing: .14em; opacity: .9; }
#tvg .flag { height: 4px; background: transparent; transition: background .3s; }
#tvg .flag.sc, #tvg .flag.vsc, #tvg .flag.vscEnd, #tvg .flag.scIn, #tvg .flag.yellow { background: #ffd400; }
#tvg .flag.red { background: #e10600; } #tvg .flag.restart { background: #2fbf4f; }
#tvg .mode { padding: 3px 10px; font: 700 9px/1.4 var(--tvf); letter-spacing: .18em; color: #9aa4b2; border-bottom: 1px solid rgba(255,255,255,.08); }
#tvg .rows { max-height: calc(100vh - var(--pw, 0px) - 110px); overflow: hidden; }
#tvg .r { position: relative; display: grid; grid-template-columns: 22px 4px 38px 1fr 22px; align-items: center; gap: 0 6px; height: 21px; padding: 0 8px 0 6px; font: 600 12px/1 var(--tvf); cursor: pointer; border-top: 1px solid rgba(255,255,255,.04); }
#tvg .r:hover { background: rgba(255,255,255,.08); }
#tvg .r.mine { background: rgba(255,255,255,.12); }
#tvg .r.on::before { content: ''; position: absolute; left: 0; top: 3px; bottom: 3px; width: 3px; background: #fff; border-radius: 0 2px 2px 0; }
#tvg .r .p { text-align: right; font-weight: 800; color: #c9d1db; }
#tvg .r .tc { height: 13px; border-radius: 2px; }
#tvg .r .cd { font-weight: 800; letter-spacing: .04em; }
#tvg .r .g { text-align: right; font-variant-numeric: tabular-nums; color: #dfe5ec; white-space: nowrap; overflow: hidden; }
#tvg .r .g.pit { color: #00d2ff; font-weight: 800; letter-spacing: .08em; } #tvg .r .g.out { color: #ff5a4f; font-weight: 800; letter-spacing: .08em; }
#tvg .r .ty { width: 16px; height: 16px; border-radius: 50%; border: 3px solid #e8322e; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; font: 900 7px/1 var(--tvf); color: #fff; justify-self: end; }
#tvg .r.dnf { opacity: .5; }
#tvg .cap { position: absolute; left: 50%; bottom: calc(var(--pw, 150px) + 18px); transform: translate(-50%, 12px); opacity: 0; transition: opacity .25s, transform .25s; display: flex; align-items: stretch; background: rgba(12,14,20,.9); border-radius: 6px; overflow: hidden; box-shadow: 0 6px 22px rgba(0,0,0,.35); white-space: nowrap; }
#tvg .cap.in { opacity: 1; transform: translate(-50%, 0); }
#tvg .cap .cp { background: #fff; color: #111; font: 900 22px/1 var(--tvf); padding: 10px 12px; display: flex; align-items: center; }
#tvg .cap .cb { width: 5px; }
#tvg .cap .cn { padding: 7px 14px 7px 11px; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
#tvg .cap .cn b { font: 800 19px/1 var(--tvf); letter-spacing: .03em; text-transform: uppercase; } #tvg .cap .cn small { font: 600 11px/1 var(--tvf); color: #b7c0cc; letter-spacing: .1em; text-transform: uppercase; }
#tvg .cap .ct { padding: 0 14px; display: flex; align-items: center; gap: 8px; font: 700 12px/1 var(--tvf); color: #dfe5ec; border-left: 1px solid rgba(255,255,255,.1); }
#tvg .cap .vs { padding: 0 14px; display: flex; flex-direction: column; justify-content: center; align-items: center; font: 900 18px/1 var(--tvf); background: #e10600; }
#tvg .cap .vs small { font: 700 9px/1.4 var(--tvf); letter-spacing: .18em; opacity: .9; }
#tvg .ty2 { width: 20px; height: 20px; border-radius: 50%; border: 4px solid #e8322e; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; font: 900 9px/1 var(--tvf); }
#tvg .rc { position: absolute; right: 14px; top: 52px; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
#tvg .rc div { background: rgba(12,14,20,.9); border-left: 4px solid #fff; padding: 7px 12px; font: 700 12px/1.25 var(--tvf); letter-spacing: .06em; max-width: 360px; animation: tvgIn .3s ease-out; text-transform: uppercase; }
#tvg .rc div small { display: block; font-size: 9px; letter-spacing: .2em; color: #9aa4b2; margin-bottom: 2px; }
#tvg .rc div.warn { border-color: #ffd400; } #tvg .rc div.bad { border-color: #e10600; } #tvg .rc div.good { border-color: #2fbf4f; } #tvg .rc div.purple { border-color: #a24bff; }
#tvg .live { position: absolute; right: 14px; top: 14px; display: flex; gap: 8px; align-items: center; font: 800 11px/1 var(--tvf); letter-spacing: .18em; background: rgba(12,14,20,.75); padding: 7px 10px; border-radius: 4px; }
#tvg .live i { width: 8px; height: 8px; border-radius: 50%; background: #e10600; animation: tvgBlink 1.6s infinite; }
#tvg .live em { font-style: normal; color: #b7c0cc; }
#tvg .banner { position: absolute; left: 50%; top: 14px; transform: translateX(-50%); padding: 8px 22px; font: 900 15px/1 var(--tvf); letter-spacing: .2em; color: #111; background: #ffd400; border-radius: 4px; display: none; }
#tvg .banner.red { background: #e10600; color: #fff; } #tvg .banner.on { display: block; }
@keyframes tvgIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
@keyframes tvgBlink { 50% { opacity: .25; } }
@media (max-width: 640px) { #tvg .tower { width: 168px; transform: scale(.85); transform-origin: top left; } #tvg .rc { display: none; } }
`;

const code = (c) => String(c.short || c.name || '???').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
const surname = (c) => { const w = String(c?.name || '').trim().split(/\s+/); return w[0] === 'Zhou' ? 'Zhou' : w[w.length - 1]; };
const LETTER = { SOFT: 'S', MEDIUM: 'M', HARD: 'H', INTER: 'I', WET: 'W' };
const fmtLap = (t) => { if (!isFinite(t)) return '-'; const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s.toFixed(3).padStart(6, '0')}`; };

export class TVGraphics {
  constructor(o = {}) {
    this.onPick = o.onPick || null;
    if (!document.getElementById('tvg-css')) { const st = document.createElement('style'); st.id = 'tvg-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = this.el = document.createElement('div'); el.id = 'tvg'; el.className = 'hidden';
    el.innerHTML = '<div class="tower"><div class="th"><b class="lap">LAP 0/0</b><small class="trk"></small></div><div class="flag"></div><div class="mode">INTERVAL</div><div class="rows"></div></div>'
      + '<div class="live"><i></i>LIVE<em class="cam"></em></div><div class="banner"></div><div class="rc"></div><div class="cap"></div>';
    document.body.appendChild(el);
    this.rowsEl = el.querySelector('.rows'); this.rows = []; this.capEl = el.querySelector('.cap'); this.rcEl = el.querySelector('.rc');
    this.rowsEl.addEventListener('click', (e) => { const r = e.target.closest('.r'); if (r && this.onPick) this.onPick(this.cars[+r.dataset.i]); });
    this.cars = []; this.acc = 1; this.modeT = 0; this.gapMode = 'INTERVAL'; this.capT = 0; this.capKey = '';
    this.age = new Map(); this.prev = new Map(); this.best = Infinity; this.phase = 'green'; this.rcQ = [];
  }
  show(on) { this.el.classList.toggle('hidden', !on); if (!on) { this.capEl.classList.remove('in'); this.rcEl.innerHTML = ''; } }
  reset() { this.pidx = new Map(); this.pfl = new Map(); this.age.clear(); this.prev.clear(); this.best = Infinity; this.phase = 'green'; this.rcEl.innerHTML = ''; this.capEl.classList.remove('in'); this.capT = 0; this.acc = 1; }
  /** laps on this car's set of tyres */
  tyreLaps(c) { const a = this.age.get(c); return a ? Math.max(0, c.lap - a.lap) : c.lap; }
  /** a message from race control (kind: '' | warn | bad | good | purple) */
  rc(text, kind = '', head = 'RACE CONTROL') {
    const d = document.createElement('div'); d.className = kind; d.innerHTML = `<small>${head}</small>`; d.appendChild(document.createTextNode(text));
    this.rcEl.appendChild(d); while (this.rcEl.children.length > 4) this.rcEl.firstChild.remove();
    setTimeout(() => d.remove(), 6500);
  }
  /** a cut (camera/TVDirector.js): the caption for the car on screen, or the fight */
  cut(sh, d) {
    if (!sh || !d || sh.why === 'grid') return;
    const c = sh.car, P = d.positions, o = sh.other;
    const tyre = (x) => { const k = x.tyres?.compound || 'SOFT'; return `<span class="ty2" style="border-color:${COMPOUNDS[k]?.color || '#fff'}">${LETTER[k] || '?'}</span>`; };
    let html;
    if (sh.why === 'sc' || sh.why === 'red') { this.capEl.innerHTML = `<div class="cp" style="background:${sh.why === 'red' ? '#e10600' : '#ffd400'};color:${sh.why === 'red' ? '#fff' : '#111'}">${sh.why === 'red' ? 'RED' : 'SC'}</div><div class="cn"><b>${sh.why === 'red' ? 'Race suspended' : 'The safety car'}</b><small>${sh.why === 'red' ? 'the field returns to the grid' : o ? `leads ${surname(o)} and the field` : 'on the circuit'}</small></div>`; this.capEl.classList.add('in'); this.capT = 4.5; return; }
    if (o && sh.why === 'battle') {
      const front = P.indexOf(c) < P.indexOf(o) ? c : o, back = front === c ? o : c, g = d.radio?.gap?.(back, front);
      html = `<div class="cp">P${P.indexOf(front) + 1}</div><div class="cb" style="background:${front.color}"></div><div class="cn"><b>${surname(front)}</b><small>${front.team || ''}</small></div>`
        + `<div class="vs">${g != null && g > 0 ? g.toFixed(1) : '-'}<small>GAP</small></div>`
        + `<div class="cn" style="padding-left:14px"><b>${surname(back)}</b><small>${back.team || ''}</small></div><div class="cb" style="background:${back.color}"></div><div class="cp">P${P.indexOf(back) + 1}</div>`;
    } else {
      const why = sh.why === 'pit' ? 'IN THE PIT LANE' : sh.why === 'out' ? (c.retireReason ? `OUT · ${c.retireReason}` : 'OUT OF THE RACE') : sh.why === 'spin' ? 'INCIDENT' : null;
      html = `<div class="cp">${c.retired ? 'OUT' : `P${P.indexOf(c) + 1}`}</div><div class="cb" style="background:${c.color}"></div><div class="cn"><b>${c.name}</b><small>${why || c.team || ''}</small></div>`
        + (c.retired ? '' : `<div class="ct">${tyre(c)}<span>${this.tyreLaps(c)} LAPS</span>${isFinite(c.bestLap) ? `<span style="opacity:.7">BEST ${fmtLap(c.bestLap)}</span>` : ''}</div>`);
    }
    this.capEl.innerHTML = html; this.capEl.classList.add('in'); this.capT = 4.5;
  }
  /** the race control banner, the tower, the events: every frame (the tower rewritten 4 times a second) */
  update(dt, ctx) {
    const d = ctx.d; if (!d) return;
    if (this.capT > 0) { this.capT -= dt; if (this.capT <= 0) this.capEl.classList.remove('in'); }
    this.events(d);
    this.acc += dt; this.modeT += dt;
    if (this.modeT > 12) { this.modeT = 0; this.gapMode = this.gapMode === 'INTERVAL' ? 'LEADER' : 'INTERVAL'; this.el.querySelector('.mode').textContent = this.gapMode; }
    if (this.acc < 0.25) return; this.acc = 0;
    const P = d.positions, lead = P[0], focus = ctx.focus || [], on = ctx.shot?.car;
    const lapNow = lead ? Math.min(d.lapsTotal, lead.lap + (lead.finished ? 0 : 1)) : 0;
    this.set(this.el.querySelector('.lap'), d.mode === 'quali' ? 'QUALIFYING' : d.world.racing || d.leaderFinished ? `LAP ${Math.max(1, lapNow)}/${d.lapsTotal}` : 'GRID');
    this.set(this.el.querySelector('.trk'), ctx.track || '');
    this.set(this.el.querySelector('.cam'), ctx.camName ? ` · ${ctx.camName.toUpperCase()}${ctx.speed && ctx.speed !== 1 ? ` · ×${ctx.speed}` : ''}` : '');
    const ph = d.sc?.phase || 'green', fl = this.el.querySelector('.flag'); if (fl.dataset.p !== ph) { fl.dataset.p = ph; fl.className = `flag ${ph}`; }
    const bn = this.el.querySelector('.banner'), lbl = d.sc?.hudState?.()?.label;
    if (bn.dataset.l !== (lbl || '')) { bn.dataset.l = lbl || ''; bn.textContent = lbl || ''; bn.className = `banner${lbl && ph !== 'yellow' ? ' on' : ''}${ph === 'red' ? ' red' : ''}`; }
    // the rows
    while (this.rows.length < P.length) {
      const r = document.createElement('div'); r.className = 'r'; r.dataset.i = this.rows.length;
      r.innerHTML = '<span class="p"></span><span class="tc"></span><span class="cd"></span><span class="g"></span><span class="ty"></span><span class="sx"><u></u><u></u><u></u></span>';
      this.rowsEl.appendChild(r); this.rows.push({ el: r, p: r.children[0], tc: r.children[1], cd: r.children[2], g: r.children[3], ty: r.children[4], sx: r.children[5], k: '' });
    }
    this.cars = P.slice();
    const nowMs = performance.now(); if (!this.pidx) { this.pidx = new Map(); this.pfl = new Map(); }
    for (let i = 0; i < P.length; i++) {
      const c = P[i], R = this.rows[i];
      // (a place won or lost: the number gives way to an arrow for three seconds)
      const was = this.pidx.get(c); if (was != null && was !== i && d.world.racing && d.mode === 'race' && !c.retired) this.pfl.set(c, { dir: i < was ? 'up' : 'dn', until: nowMs + 3000 }); this.pidx.set(c, i);
      const fl = this.pfl.get(c), fd = fl && fl.until > nowMs ? fl.dir : '';
      let g, gc = '';
      if (d.mode === 'quali') { g = !isFinite(c.bestLap) ? (c.retired ? 'OUT' : c.pitLane || c.inPit ? 'PIT' : 'NO TIME') : i === 0 ? fmtLap(c.bestLap) : `+${(c.bestLap - lead.bestLap).toFixed(3)}`; gc = !isFinite(c.bestLap) && c.retired ? 'out' : ''; }   // (qualifying: by the best lap)
      else if (c.retired) { g = 'OUT'; gc = 'out'; } else if (c.pitLane || c.inPit) { g = 'PIT'; gc = 'pit'; }
      else if (i === 0) g = c.finished ? 'FINISH' : 'LEADER';
      else {
        const ref = this.gapMode === 'INTERVAL' ? P[i - 1] : lead, laps = ref.lap - c.lap - (ref.lapDist < c.lapDist ? 1 : 0);
        if (laps >= 1 && !ref.retired) g = `+${laps} LAP${laps > 1 ? 'S' : ''}`;
        else { const x = d.radio?.gap?.(c, ref); g = x != null && x > 0 ? `+${x.toFixed(x < 10 ? 3 : 1)}` : '-'; }
      }
      const k = c.tyres?.compound || 'SOFT';
      const sxk = ctx.sectors ? ctx.sectors(c) : '';   // (its sectors' colours: purple, green, yellow - ui/TVShow.js sectorChips)
      const key = `${i}|${c.name}|${g}|${gc}|${k}|${focus.includes(c) ? 1 : 0}|${c === on ? 1 : 0}|${c.retired ? 1 : 0}|${fd}|${sxk}`;
      if (key === R.k) continue; R.k = key;
      R.p.textContent = fd === 'up' ? '▲' : fd === 'dn' ? '▼' : i + 1; R.p.className = `p ${fd}`; R.tc.style.background = c.color; R.cd.textContent = code(c); R.g.textContent = g; R.g.className = `g ${gc}`;
      R.ty.style.borderColor = COMPOUNDS[k]?.color || '#fff'; R.ty.textContent = c.retired ? '' : LETTER[k] || '';
      { const S3 = sxk.split(','); for (let q = 0; q < 3; q++) R.sx.children[q].className = c.retired ? '' : S3[q] || ''; }
      R.el.className = `r${focus.includes(c) ? ' mine' : ''}${c === on ? ' on' : ''}${c.retired ? ' dnf' : ''}`;
    }
    for (let i = P.length; i < this.rows.length; i++) this.rows[i].el.style.display = 'none';
  }
  set(el, t) { if (el.textContent !== t) el.textContent = t; }
  /** what race control and the graphics tell: a stop and its time, a car out, the fastest lap, the safety car, a penalty */
  events(d) {
    const racing = d.world.racing || d.leaderFinished;
    for (const c of d.cars) {
      if (c.isSC) continue;
      let p = this.prev.get(c);
      if (!p) { p = { stops: c.pitStops, retired: c.retired, pen: c.penalties || 0 }; this.prev.set(c, p); this.age.set(c, { lap: 0 }); continue; }
      if (c.pitStops !== p.stops) {
        this.age.set(c, { lap: c.lap });
        if (c.pitStops === p.stops + 1 && c._stopDur != null && racing && !(this.extras && (d.sc?.phase || 'green') !== 'green')) this.rc(`${surname(c)} · ${c.tyres.compound} · STOP ${c._stopDur.toFixed(1)}s`, '', 'PIT STOP');
        p.stops = c.pitStops;
      }
      if (c.retired && !p.retired) { p.retired = true; if (racing) this.rc(`${c.name} · ${c.retireReason || 'retired'}`, 'bad', 'RETIREMENT'); }
      const pen = c.penalties || 0; if (pen > p.pen) this.rc(`${c.name} · ${pen - p.pen} s time penalty`, 'warn', 'PENALTY'); p.pen = pen;
      if (racing && isFinite(c.bestLap) && c.bestLap < this.best - 1e-6 && c.lapTimes?.length >= 2) {
        const first = this.best === Infinity; this.best = c.bestLap;
        if (!first) { this.rc(`${c.name} · ${fmtLap(c.bestLap)}`, 'purple', 'FASTEST LAP'); this.onFastest?.(c, fmtLap(c.bestLap)); }
      }
    }
    const ph = d.sc?.phase || 'green';
    if (ph !== this.phase) {
      const T = { sc: ['SAFETY CAR DEPLOYED', 'warn'], vsc: ['VIRTUAL SAFETY CAR DEPLOYED', 'warn'], red: ['RED FLAG · SESSION SUSPENDED', 'bad'], scIn: ['SAFETY CAR IN THIS LAP', 'warn'], vscEnd: ['VSC ENDING', 'warn'] }[ph];
      if (!this.extras) { if (T) this.rc(T[0], T[1]); else if (ph === 'green' && this.phase !== 'yellow') this.rc('GREEN FLAG · TRACK CLEAR', 'good'); }   // (extras: ui/TVExtras.js has the safety car's and the red flag's own stingers and cards)
      this.phase = ph;
    }
  }
}
