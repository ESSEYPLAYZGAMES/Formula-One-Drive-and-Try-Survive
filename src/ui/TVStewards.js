// The stewards on the broadcast (the team principal's race: main.js TP): small cards under the LIVE tag, one a case,
// that change as the case does - INCIDENT NOTED, UNDER INVESTIGATION, then what came of it (a time penalty, NO FURTHER
// ACTION), a place to be given back with its clock running down, POSITION RETURNED, track limits (a strike, the black
// and white flag), a penalty served at a stop - and, on the timing tower, a mark by each car the stewards have in
// hand: a magnifying glass (under investigation), two arrows (a place to give back), the seconds it has still to
// serve, the black and white flag - and a chequered flag by each car that has finished its race (ui/TVGraphics.js). Nothing of the race is changed here: it reads the stewards (race/Stewards.js: the
// collisions being judged, the overtakes off the track, the places taken under the safety car, the log of penalties)
// and the cars (strikes, seconds to serve, seconds served) and tells it. A collision's verdict is held back a few
// seconds on the screen so the note and the investigation can be read before it.
const CSS = `
/* (race control's place on a broadcast: the top of the picture, in the middle - clear of the tower, the map and every card on the right. The commentary's line and the window under it move down by its height: --stwh) */
#tvg .stw { position: absolute; left: 50%; top: 6px; transform: translateX(-50%); display: flex; flex-direction: row; justify-content: center; align-items: flex-start; gap: 8px; max-width: calc(100% - 520px); pointer-events: none; z-index: 3; }   /* (side by side in the strip above the commentary's line: the window under it is the action's, and nothing here moves it) */
@media (max-width: 900px) { #tvg .stw { left: 262px; transform: none; justify-content: flex-start; max-width: calc(100% - 270px); } }
#tvg .xr:has(.xc.stg.in) .xc.inf { display: none; }   /* (the strategy up: the filler cards make room) */
#tvg .stc { --c: #ffb300; position: relative; display: flex; align-items: stretch; height: 44px; min-width: 0; max-width: 380px; filter: drop-shadow(0 6px 16px rgba(0,0,0,.45)); }
#tvg .stc .ic { width: 44px; display: flex; align-items: center; justify-content: center; background: linear-gradient(160deg, color-mix(in srgb, var(--c) 34%, #0b0d13), #0b0d13 75%); color: #fff; border: 1px solid var(--c); border-radius: 0 7px 7px 0; box-shadow: inset 0 0 14px color-mix(in srgb, var(--c) 35%, transparent), 0 0 12px color-mix(in srgb, var(--c) 45%, transparent); order: 2; transform: scale(0); transition: transform .28s cubic-bezier(.3,1.5,.5,1), color .3s, border-color .3s, box-shadow .3s; }
#tvg .stc .ic svg { width: 22px; height: 22px; filter: drop-shadow(0 0 5px var(--c)); }
#tvg .stc .bd { position: relative; order: 1; min-width: 150px; max-width: 330px; padding: 6px 12px 6px 14px; background: linear-gradient(90deg, rgba(9,11,17,.78), rgba(9,11,17,.95)); border: 1px solid color-mix(in srgb, var(--c) 55%, transparent); border-right: 0; border-radius: 7px 0 0 7px; overflow: hidden; clip-path: inset(0 0 0 100%); transition: clip-path .42s cubic-bezier(.2,.8,.2,1) .12s, border-color .3s; }
#tvg .stc.in .ic { transform: none; } #tvg .stc.in .bd { clip-path: inset(0 0 0 0); }
#tvg .stc.out .bd { clip-path: inset(0 0 0 100%); transition-delay: 0s; transition-duration: .3s; } #tvg .stc.out .ic { transform: scale(0); transition: transform .22s ease-in .26s; }
#tvg .stc.out { max-width: 0; margin-left: -8px; transition: max-width .3s ease .5s, margin-left .3s ease .5s; }
#tvg .stc .hd { display: flex; align-items: center; gap: 7px; font: 900 9px/1 var(--tvf); letter-spacing: .24em; color: var(--c); text-shadow: 0 0 9px color-mix(in srgb, var(--c) 70%, transparent); white-space: nowrap; transition: color .3s; }
#tvg .stc .hd .clk { margin-left: auto; padding-left: 10px; font: 800 10px/1 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .06em; color: #fff; text-shadow: none; }
#tvg .stc[data-st="a"] { --c: #b98cff; }
#tvg .stc .hd em { font-style: normal; color: #7d8794; letter-spacing: .2em; text-shadow: none; }
#tvg .stc .ln { display: flex; align-items: center; gap: 7px; margin-top: 6px; font: 800 14px/1 var(--tvf); letter-spacing: .05em; text-transform: uppercase; white-space: nowrap; }
#tvg .stc .ln i { width: 4px; height: 13px; border-radius: 1px; display: inline-block; } #tvg .stc .ln u { text-decoration: none; color: #7d8794; font-weight: 700; }
#tvg .stc .ln small { font: 700 10px/1 var(--tvf); letter-spacing: .1em; color: #aab3bf; margin-left: 4px; }
#tvg .stc .ln b.sec { font: 900 14px/1 var(--tvf); color: #0b0d13; background: var(--c); border-radius: 3px; padding: 2px 5px; margin-right: 2px; box-shadow: 0 0 10px color-mix(in srgb, var(--c) 60%, transparent); }
/* (a case that changes: its words slide out and the new ones in, a bar of light across it) */
#tvg .stc .tx { transition: transform .22s ease, opacity .22s ease; } #tvg .stc.stc-flip .tx { transform: translateY(-9px); opacity: 0; }
#tvg .stc .bd::after { content: ''; position: absolute; top: 0; bottom: 0; left: -40%; width: 34%; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--c) 55%, transparent), transparent); transform: skewX(-18deg); opacity: 0; }
#tvg .stc.sweep .bd::after { animation: stwSweep .55s ease-out; }
#tvg .stc[data-st="i"] .bd::after, #tvg .stc[data-st="o"] .bd::after { animation: stwScan 2.6s linear infinite; opacity: .5; }
#tvg .stc[data-st="i"] .ic svg { animation: stwSeek 1.8s ease-in-out infinite; }
#tvg .stc .cd { position: absolute; left: 0; bottom: 0; height: 2px; width: 100%; background: var(--c); box-shadow: 0 0 8px var(--c); transform-origin: 100% 50%; transform: scaleX(0); }
#tvg .stc[data-st="n"] { --c: #c9d1db; } #tvg .stc[data-st="i"] { --c: #ffb300; } #tvg .stc[data-st="o"] { --c: #ff7a1a; } #tvg .stc[data-st="p"] { --c: #ff2d55; }
#tvg .stc[data-st="c"] { --c: #2ee6a6; } #tvg .stc[data-st="s"] { --c: #2ee6a6; } #tvg .stc[data-st="t"] { --c: #ffd400; } #tvg .stc[data-st="f"] { --c: #f2f4f7; }
@keyframes stwSweep { from { left: -40%; opacity: .9; } to { left: 110%; opacity: 0; } }
@keyframes stwScan { from { left: -40%; } to { left: 110%; } }
@keyframes stwSeek { 0%, 100% { transform: translate(-1.5px, 1px) rotate(-6deg); } 50% { transform: translate(1.5px, -1px) rotate(6deg); } }
/* the tower: a mark by a car the stewards have in hand */
#tvg .r .st { position: absolute; left: 84px; top: 50%; transform: translateY(-50%); display: flex; gap: 3px; align-items: center; pointer-events: none; }
#tvg .r .st b { display: inline-flex; align-items: center; justify-content: center; height: 14px; min-width: 14px; border-radius: 3px; font: 900 9px/1 var(--tvf); letter-spacing: 0; animation: stwPop .3s cubic-bezier(.3,1.6,.5,1); }
#tvg .r .st b svg { width: 12px; height: 12px; }
#tvg .r .st b.inv { color: #ffb300; filter: drop-shadow(0 0 4px rgba(255,179,0,.8)); animation: stwPop .3s cubic-bezier(.3,1.6,.5,1), tvgBlink 1.3s .3s infinite; }
#tvg .r .st b.owe { color: #ff7a1a; filter: drop-shadow(0 0 4px rgba(255,122,26,.8)); }
#tvg .r .st b.pen { background: #ff2d55; color: #fff; padding: 0 3px; box-shadow: 0 0 7px rgba(255,45,85,.7); }
#tvg .r .st b.flag { color: #fff; }
#tvg .r .st b.fin { color: #fff; filter: drop-shadow(0 0 3px rgba(255,255,255,.55)); } #tvg .r .st b.fin svg { width: 13px; height: 13px; }
#tvg .r.fin .cd { color: #aeb7c3; } #tvg .r.fin .g { color: #8f99a6; }
@keyframes stwPop { from { transform: scale(0); } to { transform: scale(1); } }
`;
const I = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
export const STW_ICON = {
  noted: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.4" r=".6" fill="currentColor"/>'),
  inv: I('<circle cx="10.5" cy="10.5" r="6.2"/><path d="M15.2 15.2 21 21"/>'),
  owe: I('<path d="M4 8.5h15l-3.6-3.6M20 15.5H5l3.6 3.6"/>'),
  pen: I('<circle cx="12" cy="13.5" r="7.2"/><path d="M12 13.5V9.6M9.6 3h4.8M12 3v3.2M18.4 7.2l1.5-1.5"/>'),
  clear: I('<path d="M4.5 12.5 10 18 19.5 6.5"/>'),
  limits: I('<path d="M4 20 20 4" stroke-dasharray="3.2 3.2"/><path d="M5 9c4 0 6 2 6 6M11 15l-3.2-.6M11 15l.5-3.2"/>'),
  fin: `<svg viewBox="0 0 24 24"><path d="M4 2.5v19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M5.5 4h15v11h-15z" fill="#f2f4f7"/><path d="M5.5 4h5v3.67h-5zM15.5 4h5v3.67h-5zM10.5 7.67h5v3.66h-5zM5.5 11.33h5V15h-5zM15.5 11.33h5V15h-5z" fill="#0b0d13"/></svg>`,
  flag: `<svg viewBox="0 0 24 24"><path d="M5 3v18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M6 4h14v10H6z" fill="#f2f4f7"/><path d="M6 4h14L6 14z" fill="#0b0d13"/><path d="M6 4h14v10H6z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`,
};
const HEAD = { a: 'INVESTIGATION AFTER THE RACE', x: 'RACING INCIDENT', y: 'NO INVESTIGATION NECESSARY', n: 'INCIDENT NOTED', i: 'UNDER INVESTIGATION', o: 'GIVE THE POSITION BACK', p: 'TIME PENALTY', c: 'NO FURTHER ACTION', s: 'PENALTY SERVED', t: 'TRACK LIMITS', f: 'BLACK AND WHITE FLAG', r: 'POSITION RETURNED' };
const ICON_OF = { a: 'inv', x: 'clear', y: 'clear', n: 'noted', i: 'inv', o: 'owe', p: 'pen', c: 'clear', s: 'clear', t: 'limits', f: 'flag' };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const code = (c) => String(c.short || c.name || '???').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
const SHORT = { 'causing a collision': 'CAUSING A COLLISION', 'track limits': 'TRACK LIMITS', 'leaving the track and gaining an advantage': 'GAINING AN ADVANTAGE OFF TRACK', 'a jump start': 'JUMP START', 'overtaking under the safety car': 'OVERTAKING UNDER THE SAFETY CAR',
  'overtaking under yellow flags': 'OVERTAKING UNDER YELLOWS', 'overtaking under the VSC': 'OVERTAKING UNDER THE VSC', 'overtaking before the control line': 'OVERTAKING BEFORE THE LINE', 'missed mandatory pit stop': 'NO MANDATORY STOP' };

export class TVStewards {
  constructor(root) {
    if (!document.getElementById('tvstw-css')) { const st = document.createElement('style'); st.id = 'tvstw-css'; st.textContent = CSS; document.head.appendChild(st); }
    this.root = root; this.el = document.createElement('div'); this.el.className = 'stw'; root.appendChild(this.el);
    this.reset();
  }
  reset() { this.deepCases = null; this._h = 0; this.root.style.setProperty('--stwh', '0px'); this.el.innerHTML = ''; this.cases = []; this.seen = new Map(); this.logN = 0; this.cars = new Map(); this.acc = 0; this.h = -1; }
  /** a car's marks on the tower: 'inv' | 'owe' | 'pen:<s>' | 'flag', the two that matter most, comma-joined ('' none) */
  status(c) {
    const out = [];
    if (this.cases.some((k) => !k.closed && (k.st === 'n' || k.st === 'i') && k.cars.includes(c)) || (this.deepCases || []).some((q) => !q.done && q.stage !== 'seen' && (q.a === c || q.b === c))) out.push('inv');
    if (c.driveThrough > 0 && !c.retired) out.push('dt');
    if (this.cases.some((k) => !k.closed && k.st === 'o' && k.cars[0] === c)) out.push('owe');
    const st = this.cars.get(c); if (st && st.shown > 0 && !c.retired) out.push(`pen:${st.shown}`);
    if (out.length < 2 && st && st.flag && !c.retired) out.push('flag');
    return out.slice(0, 2).join(',');
  }
  /** the tower row's marks as HTML (ui/TVGraphics.js writes it when the key changes) */
  static marks(key) {
    if (!key) return '';
    return key.split(',').map((k) => k === 'fin' ? `<b class="fin" title="Has taken the chequered flag">${STW_ICON.fin}</b>` : k === 'inv' ? `<b class="inv" title="Under investigation">${STW_ICON.inv}</b>` : k === 'owe' ? `<b class="owe" title="Must give the position back">${STW_ICON.owe}</b>`
      : k === 'dt' ? '<b class="pen" title="Drive-through penalty to serve">DT</b>' : k === 'flag' ? `<b class="flag" title="Black and white flag: track limits">${STW_ICON.flag}</b>` : `<b class="pen" title="Time penalty to serve">${esc(k.slice(4))}s</b>`).join('');
  }
  _open(o) {
    const k = { st: null, closed: false, until: Infinity, ...o }; const el = k.el = document.createElement('div'); el.className = 'stc';
    el.innerHTML = '<div class="bd"><div class="tx"><div class="hd"></div><div class="ln"></div></div><i class="cd"></i></div><div class="ic"></div>';
    this.el.appendChild(el); this.cases.push(k); void el.offsetWidth; el.classList.add('in');
    while (this.cases.filter((x) => !x.gone).length > 2) { const old = this.cases.find((x) => !x.gone && x.closed) || this.cases.find((x) => !x.gone); this._gone(old); }
    return k;
  }
  _names(k) {
    const [a, b] = k.cars, one = (c) => `<i style="background:${esc(c.color || '#888')}"></i>${code(c)}`;
    const sec = k.st === 'p' || k.st === 's' ? `<b class="sec">${k.dt ? 'DRIVE-THROUGH' : `${k.st === 's' ? '' : '+'}${k.sec}s`}</b>` : '';
    const why = k.why ? `<small>${esc(k.why)}</small>` : '';
    if (k.st === 'o' && b) return `${one(a)}<u>→</u>${one(b)}${why}`;
    return `${sec}${one(a)}${b && k.st !== 'p' && k.st !== 's' && k.st !== 't' && k.st !== 'f' ? `<u>·</u>${one(b)}` : ''}${why}`;
  }
  /** a case's stage: its colour, icon and words (changed with a slide and a bar of light) */
  _set(k, st, o = {}) {
    Object.assign(k, o); const first = k.st == null, el = k.el; k.st = st === 'r' || st === 'x' || st === 'y' ? 'c' : st; k.head = st === 'p' && k.dt ? 'DRIVE-THROUGH PENALTY' : st === 's' && k.dt ? 'DRIVE-THROUGH SERVED' : HEAD[st];
    const write = () => { el.dataset.st = k.st; el.querySelector('.ic').innerHTML = STW_ICON[ICON_OF[k.st]]; el.querySelector('.hd').innerHTML = `<em>RACE CONTROL</em>${esc(k.head)}${k.st === 'i' && k.kind === 'case' ? '<span class="clk">0:00</span>' : ''}`; el.querySelector('.ln').innerHTML = this._names(k); el.classList.remove('stc-flip'); };
    if (first) { write(); return; }
    el.classList.add('stc-flip'); el.classList.remove('sweep'); void el.offsetWidth; el.classList.add('sweep'); setTimeout(write, 200);
  }
  _close(k, now, hold = 6.5) { k.closed = true; k.until = now + hold; }
  _gone(k) { if (!k || k.gone) return; k.gone = true; k.closed = true; k.el.classList.add('out'); k.el.classList.remove('in'); setTimeout(() => { k.el.remove(); this.cases = this.cases.filter((x) => x !== k); }, 900); }

  update(dt, ctx) {
    const d = ctx.d, S = d?.stewards; if (!d || !S || d.mode !== 'race') { if (this.cases.length) this.reset(); return; }
    this.deepCases = S.deep ? S.cases : null;
    const t = d.time;
    // (the clocks on the cards run every frame; the rest is looked at a few times a second)
    for (const k of this.cases) if (k.st === 'o' && k.deadline != null && !k.gone) k.el.querySelector('.cd').style.transform = `scaleX(${Math.max(0, Math.min(1, (k.deadline - t) / k.span)).toFixed(3)})`;
    this.acc += dt; if (this.acc < 0.15) return; this.acc = 0;
    const log = S.log || [], newLog = log.slice(this.logN); this.logN = log.length;
    const penFor = (c, re) => { const i = newLog.findIndex((e) => e.car === c.short && re.test(e.reason)); return i >= 0 ? newLog.splice(i, 1)[0] : null; };
    const carOf = (short) => d.cars.find((c) => c.short === short);
    // ---- a collision: the stewards' own cases where the race keeps them (the team principal's: race/Stewards.js openCase -
    //      noted when race control gets to it, under investigation with its clock running, after the race, the verdict)
    if (S.deep) {
      // (each step of a case is a card of its own, up for a few seconds and away - noted; under investigation; after
      //  the race; the decision. Between them the case is the magnifying glass by the cars on the tower: an
      //  investigation runs for minutes, and a card does not sit on the picture that long)
      const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
      for (const q of S.cases || []) {
        let k = this.seen.get(q);
        const mk = (st, stg, why) => { const n = this._setNew({ kind: 'case', cars: [q.a, q.b], t0: t, src: q, stg, why }, st); this.seen.set(q, n); return n; };
        const to = (st, stg, why, hold) => { if (!k || k.gone) k = mk(st, stg, why); else { k.closed = false; this._set(k, st, { why }); k.stg = stg; } this._close(k, t, hold); };
        const where = q.lap1 ? 'LAP 1' : q.where || '';
        if (!k) { if (q.stage === 'seen' || q.verdict?.kind === 'gone') continue; to('n', 'noted', `${where ? `${where} · ` : ''}COLLISION`, 7); }
        if (q.stage === 'inv' && k.stg !== 'inv') to('i', 'inv', `${where ? `${where} · ` : ''}COLLISION`, 9);
        if (q.stage === 'inv' && !k.gone) { const c = k.el.querySelector('.clk'); if (c) c.textContent = clock(Math.max(0, t - q.invAt)); }
        if (q.stage === 'post' && k.stg !== 'post') to('a', 'post', 'COLLISION', 7);
        if (q.done && k.stg !== 'done') {
          const v = q.verdict || { kind: 'nfa' }; if (v.kind === 'gone') { k.stg = 'done'; this._gone(k); continue; }
          penFor(q.a, /collision/);   // (its penalty is this card's: not a second one)
          if (!k || k.gone) k = mk('i', 'done', ''); k.closed = false; k.stg = 'done';
          if (v.kind === 'pen') { this._set(k, 'p', { sec: v.sec, why: 'CAUSING A COLLISION' }); this._reveal(q.a, v.sec); }
          else if (v.kind === 'dt') this._set(k, 'p', { dt: true, why: 'CAUSING A COLLISION' });
          else this._set(k, v.kind === 'racing' ? 'x' : v.kind === 'none' ? 'y' : 'c', { why: v.kind === 'racing' ? 'NO FURTHER ACTION' : 'COLLISION' });
          this._close(k, t, 8);
        }
      }
    } else {
    // ---- a collision being judged: noted, under investigation, then the verdict - no sooner than it can be read
    for (const p of S.pending || []) if (!this.seen.has(p)) this.seen.set(p, this._setNew({ kind: 'col', cars: [p.culprit, p.victim], t0: t, src: p, why: 'COLLISION' }, 'n'));
    for (const k of this.cases) {
      if (k.kind !== 'col' || k.closed) continue;
      if (k.st === 'n' && t - k.t0 > 1.6) this._set(k, 'i');
      if (k.verdict === undefined && !(S.pending || []).includes(k.src)) { const e = penFor(k.cars[0], /collision/); k.verdict = e ? e.sec : 0; }
      if (k.verdict !== undefined && t - k.t0 > 5.5) { if (k.verdict) { this._set(k, 'p', { sec: k.verdict, why: 'CAUSING A COLLISION' }); this._reveal(k.cars[0], k.verdict); } else this._set(k, 'c', { why: 'COLLISION' }); this._close(k, t); }
    }
    }
    // ---- an overtake off the track: under investigation, the place to go back (its clock), returned - or the penalty
    for (const p of S.offPasses || []) if (!this.seen.has(p)) this.seen.set(p, this._setNew({ kind: 'off', cars: [p.passer, p.passed], t0: t, src: p, why: 'OVERTAKE OFF TRACK' }, 'i'));
    // (the team principal's race: a place that is handed straight back - most are, within three or four seconds - is
    //  never a card; one that still stands after that is)
    for (const p of S.scPasses || []) if (!this.seen.has(p) && (!S.deep || t - p.t > 4)) this.seen.set(p, this._setNew({ kind: 'sc', cars: [p.passer, p.passed], t0: t, src: p, why: '', deadline: p.t + 8, span: 8 }, 'o'));
    for (const k of this.cases) {
      if ((k.kind !== 'off' && k.kind !== 'sc') || k.closed) continue;
      const live = (k.kind === 'off' ? S.offPasses : S.scPasses || []).includes(k.src);
      if (live) { if (k.kind === 'off' && k.st === 'i' && k.src.stage === 'order') this._set(k, 'o', { deadline: k.src.deadline, span: 30, why: '' }); continue; }
      const e = penFor(k.cars[0], k.kind === 'off' ? /advantage/ : /overtaking/);
      if (e) { this._set(k, 'p', { sec: e.sec, why: SHORT[e.reason] || e.reason.toUpperCase() }); this._reveal(k.cars[0], e.sec); }
      else if (k.st === 'o') this._set(k, 'r', { why: '' });
      else this._set(k, 'c', { why: 'OVERTAKE OFF TRACK' });
      this._close(k, t);
    }
    // ---- every other penalty (track limits, a jump start, a big cut): its own card
    for (const e of newLog) { const c = carOf(e.car); if (c && e.dtServed) { const k = this._setNew({ kind: 'srv', cars: [c], t0: t, dt: true, why: '' }, 's'); this._close(k, t, 5); continue; } if (!c || !e.sec) continue; const k = this._setNew({ kind: 'pen', cars: [c], t0: t, sec: e.sec, why: SHORT[e.reason] || String(e.reason).toUpperCase() }, 'p'); this._reveal(c, e.sec); this._close(k, t); }
    // ---- each car: its strikes, the flag, what it has served
    const allow = S.strikes ?? 3;
    for (const c of d.cars) {
      if (c.isSC) continue; let st = this.cars.get(c);
      if (!st) { this.cars.set(c, (st = { tl: c.tlStrikes || 0, served: c.penaltyServed || 0, shown: c.penalties || 0, flag: (c.tlStrikes || 0) >= allow })); continue; }
      const tl = c.tlStrikes || 0;
      if (tl > st.tl) { st.tl = tl; if (tl <= allow) { const flag = tl === allow; st.flag = flag || st.flag; const k = this._setNew({ kind: 'tl', cars: [c], t0: t, why: flag ? 'TRACK LIMITS' : `STRIKE ${tl} OF ${allow}` }, flag ? 'f' : 't'); this._close(k, t, flag ? 6 : 4.5); } }
      const sv = c.penaltyServed || 0;
      if (sv > st.served) { const sec = sv - st.served; st.served = sv; st.shown = Math.max(0, Math.min(st.shown, c.penalties || 0)); if (d.world.racing) { const k = this._setNew({ kind: 'srv', cars: [c], t0: t, sec, why: 'AT THE STOP' }, 's'); this._close(k, t, 5); } }
      // (what it has to serve, as the broadcast has told it: never more than the car really carries; a penalty whose
      //  card has not come up yet is not on the tower either - but with no case of its own open, the tower has it)
      const pen = c.penalties || 0; if (pen < st.shown || (pen > st.shown && !this.cases.some((k) => !k.closed && k.cars[0] === c))) st.shown = pen;
    }
    for (const k of [...this.cases]) if (k.closed && !k.gone && t > k.until) this._gone(k);
    // (race control's own messages sit under these cards)
  }
  _setNew(o, st) { const k = this._open(o); this._set(k, st); return k; }
  /** a penalty told on the screen: from now the tower shows it (and at the latest a little after it was given, card or no card) */
  _reveal(c, sec) { const st = this.cars.get(c); if (st) st.shown = Math.min(c.penalties || 0, st.shown + sec); }
}
