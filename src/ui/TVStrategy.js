// STRATEGY on the broadcast (the team principal's race: main.js TP.strat): a small card in the right-hand column, up
// only when there is something in it for one of your cars - a stop window open on a rival within three seconds of it,
// or on the car itself; an undercut that is on (yours on the car ahead, or the car behind's on you); a rival pit
// wall's move against you (race/RivalWall.js: covered, the overcut, the dummy taken). It shows the three cars - the
// one ahead, yours, the one behind - each with its tyre and the laps on it, and a strip of the laps left with the
// window in which that car is expected to stop (from its wear a lap and where its strategy stops: an estimate, as a
// broadcast's is) - and under them the one line that matters: UNDERCUT THREAT · NOR 1.4 s behind, window open.
// Not up all the time: ten seconds, then quiet for that car for most of a minute; never under a safety car's own
// graphics, in a replay or before the start. Plain DOM in the graphics' layer, written only where a value changed.
const CSS = `
#tvg .xc.stg .xh { background: linear-gradient(90deg, #6d3bff, #b98cff); }
#tvg .xc.stg .xrw { grid-template-columns: 22px 4px 38px 50px 1fr; padding: 5px 10px; font-size: 12px; }
#tvg .xc.stg .xrw.me { background: rgba(255,255,255,.1); }
#tvg .xc.stg .xrw .t { gap: 4px; }
#tvg .xc.stg .wb { position: relative; height: 9px; background: rgba(255,255,255,.1); border-radius: 2px; overflow: hidden; }
#tvg .xc.stg .wb i { position: absolute; top: 0; bottom: 0; background: #b98cff; border-radius: 2px; box-shadow: 0 0 8px rgba(185,140,255,.8); transition: left .5s, width .5s; }
#tvg .xc.stg .wb i.now { background: #ffb300; box-shadow: 0 0 8px rgba(255,179,0,.9); animation: stgNow 1s ease-in-out infinite alternate; }
#tvg .xc.stg .wb i.end { background: rgba(255,255,255,.22); box-shadow: none; }
#tvg .xc.stg .wl { grid-column: 5; font: 700 9px/1 var(--tvf); letter-spacing: .1em; color: #b7c0cc; margin-top: 3px; white-space: nowrap; }
#tvg .xc.stg .ft { padding: 7px 10px 8px; background: rgba(255,255,255,.06); font: 800 11px/1.25 var(--tvf); letter-spacing: .06em; text-transform: uppercase; }
#tvg .xc.stg .ft b { display: inline-block; margin-right: 6px; padding: 2px 5px; border-radius: 3px; font: 900 9px/1 var(--tvf); letter-spacing: .12em; vertical-align: 1px; background: #b98cff; color: #160a33; }
#tvg .xc.stg .ft.bad b { background: #ff2d55; color: #fff; } #tvg .xc.stg .ft.good b { background: #3ddc84; color: #06210f; } #tvg .xc.stg .ft.rw b { background: #ffb300; color: #201400; }
@keyframes stgNow { from { opacity: .55; } to { opacity: 1; } }
`;
const LETTER = { SOFT: 'S', MEDIUM: 'M', HARD: 'H', INTER: 'I', WET: 'W' }, TCOL = { SOFT: '#ff3b30', MEDIUM: '#ffd60a', HARD: '#f2f2f7', INTER: '#34c759', WET: '#0a84ff' };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sur = (c) => c.name.split(' ').pop();
const KIND = { cover: ['COVERED', 'bad'], undercut: ['UNDERCUT', 'bad'], overcut: ['OVERCUT', 'bad'], split: ['SPLIT', 'rw'], dummy: ['DUMMY TAKEN', 'good'], 'called-off': ['NOT FOOLED', 'rw'], 'sc-stay': ['STAYS OUT', 'rw'], 'sc-pit': ['PITS', 'rw'] };

export class TVStrategy {
  /** root: #tvg; o: { tyreLaps(car) } */
  constructor(root, o = {}) {
    this.o = o;
    if (!document.getElementById('tvstg-css')) { const st = document.createElement('style'); st.id = 'tvstg-css'; st.textContent = CSS; document.head.appendChild(st); }
    this.el = document.createElement('div'); this.el.className = 'xc stg'; (root.querySelector('.xr') || root).appendChild(this.el);
    this.reset();
  }
  reset() { this.up = null; this.t = 0; this.acc = 0; this.last = new Map(); this.logN = 0; this.html = ''; this.el.classList.remove('in'); }
  /** the laps from now in which a car is expected to stop -> { a, b } (laps from now; a <= 0: open now), or null: to the flag */
  window(d, c) {
    const t = c.tyres, ai = c.ai, left = d.lapsTotal - c.lap; if (!t || c.retired || c.finished || left < 1) return null;
    if (c.pitRequested || c.pitLane || c.inPit) return { a: 0, b: 0, inNow: true };
    const per = ai && ai._wPerLap > 0 && ai._wTyres === t ? ai._wPerLap : 0.75 * d.track.length / Math.max(1, t.lifeMeters || 1e5);
    // (where it stops: its strategy's wear - your own car's: the plan's next stop, or its tyres' three quarters)
    let n;
    if (c.mgr?.plan && c.mgr.calls === 'plan') { const st = c.mgr.plan.stints[Math.min(c.pitStops, c.mgr.plan.stints.length - 1)]; if (c.pitStops >= c.mgr.plan.stints.length - 1) return null; n = st.end - c.lap; }
    else n = ((c.mgr ? 0.72 : ai?.strat?.wear ?? 0.65) - t.wear) / Math.max(0.004, per);
    const owes = d.lapsTotal >= 8 && c.pitStops === 0;
    if (n > left - 1.5 && !owes) return null;   // (its set sees the flag)
    n = Math.max(0, Math.min(left - 1, n));
    return { a: n - 1, b: n + 1 };
  }
  update(dt, ctx) {
    const d = ctx.d; this.t += dt; this.acc += dt;
    const quiet = !d || d.mode !== 'race' || d.done || !d.world?.racing || d.leaderFinished || ctx.halted || (d.sc && d.sc.phase && d.sc.phase !== 'green');
    if (quiet) { if (this.up) { this.up = null; this.el.classList.remove('in'); } if (d?.rivalWall) this.logN = d.rivalWall.log.length; return; }
    if (this.acc < 0.5) return; this.acc = 0;
    const P = d.positions, gap = (a, b) => d.world.gap?.(a, b);
    // ---- a rival wall's move against one of yours: the card for that car, now, with the move as its line
    const log = d.rivalWall?.log || []; let move = null;
    for (; this.logN < log.length; this.logN++) { const e = log[this.logN], T = ctx.focus.find((c) => c.short === e.T), c = d.cars.find((x) => x.short === e.c); if (T && c && KIND[e.kind]) move = { T, c, kind: e.kind }; }
    if (move) { this.up = { car: move.T, until: this.t + 11, move }; this.last.set(move.T, this.t); }
    // ---- else: a car of yours with a window open near it, not shown lately
    if (!this.up) {
      for (const c of ctx.focus) {
        if (c.retired || c.finished || c.pitLane || this.t - (this.last.get(c) ?? -99) < 55 || d.lapsTotal - c.lap < 2 || c.lap < 2) continue;
        const L = this.line(d, c, P, gap); if (!L || !L.hot) continue;
        this.up = { car: c, until: this.t + 10 }; this.last.set(c, this.t); break;
      }
    }
    const U = this.up; if (!U) return;
    if (this.t > U.until || U.car.retired || U.car.finished) { this.up = null; this.el.classList.remove('in'); return; }
    // ---- drawn
    const c = U.car, i = P.indexOf(c), ahead = P[i - 1] && !P[i - 1].retired ? P[i - 1] : null, behind = P[i + 1] && !P[i + 1].retired ? P[i + 1] : null, left = Math.max(1, d.lapsTotal - c.lap);
    const row = (x) => {
      const w = this.window(d, x), k = x.tyres?.compound || 'SOFT', pct = (n) => Math.max(0, Math.min(100, 100 * n / left));
      const bar = !w ? '<i class="end" style="left:0;width:100%"></i>' : w.inNow ? '<i class="now" style="left:0;width:9%"></i>' : `<i class="${w.a <= 0 ? 'now' : ''}" style="left:${pct(Math.max(0, w.a)).toFixed(1)}%;width:${Math.max(7, pct(w.b) - pct(Math.max(0, w.a))).toFixed(1)}%"></i>`;
      const lab = !w ? 'TO THE FLAG' : w.inNow ? 'BOX THIS LAP' : w.a <= 0 ? 'WINDOW OPEN' : `LAP ${Math.round(x.lap + 1 + Math.max(0, w.a))}–${Math.round(x.lap + 1 + w.b)}`;
      return `<div class="xrw${x === c ? ' me' : ''}"><span class="p">${P.indexOf(x) + 1}</span><span class="tc" style="background:${esc(x.color)}"></span><span class="n">${esc(x.short)}</span><span class="t"><span class="ty2" style="border-color:${TCOL[k]};width:15px;height:15px;border-width:3px;font-size:7px">${LETTER[k] || ''}</span>${this.o.tyreLaps ? this.o.tyreLaps(x) : ''}L</span><div class="wb">${bar}</div><span class="wl">${lab}</span></div>`;
    };
    const L = U.move ? null : this.line(d, c, P, gap);
    const ft = U.move ? `<div class="ft ${KIND[U.move.kind][1]}"><b>${KIND[U.move.kind][0]}</b>${esc(this.moveText(U.move))}</div>` : L ? `<div class="ft ${L.cls}"><b>${L.tag}</b>${esc(L.text)}</div>` : '';
    const html = `<div class="xh"><span>STRATEGY · ${esc(sur(c).toUpperCase())}</span><small>${left} LAP${left === 1 ? '' : 'S'} LEFT</small></div>${ahead ? row(ahead) : ''}${row(c)}${behind ? row(behind) : ''}${ft}`;
    if (html !== this.html) { this.html = html; this.el.innerHTML = html; }
    this.el.classList.add('in');
  }
  moveText(m) {
    const a = sur(m.c), T = sur(m.T), tm = m.c.team;
    return m.kind === 'cover' ? `${tm} bring ${a} in to cover ${T}` : m.kind === 'undercut' ? `${a} pits from behind ${T}` : m.kind === 'overcut' ? `${a} stays out and pushes on ${T}` : m.kind === 'split' ? `${tm} split: ${a} runs long`
      : m.kind === 'dummy' ? `${a} pitted for nothing: ${T} stayed out` : m.kind === 'called-off' ? `${a} stays out as well` : m.kind === 'sc-stay' ? `${a} takes track position from ${T}` : `${a} takes new tyres behind ${T}`;
  }
  /** the one line for a car of yours -> { tag, text, cls, hot } (hot: worth putting the card up for), or null */
  line(d, c, P, gap) {
    const i = P.indexOf(c), A = P[i - 1], B = P[i + 1], same = (x) => x && !x.retired && !x.finished && !x.pitLane && x.pitStops === c.pitStops;
    const gA = same(A) ? gap(c, A) : null, gB = same(B) ? gap(B, c) : null, wC = this.window(d, c), wB = same(B) ? this.window(d, B) : null, wA = same(A) ? this.window(d, A) : null;
    // (the undercut's worth: a lap on a new set against the old one's wear)
    const worth = (x) => 0.6 + 2.4 * (x.tyres?.wear || 0);
    if (gB != null && gB > 0 && gB < 3 && wB && wB.a <= 1 && c.tyres.wear > 0.2 && !c.pitRequested) { const strong = worth(c) > gB + 0.3; return { tag: strong ? 'UNDERCUT THREAT' : 'UNDERCUT WATCH', cls: strong ? 'bad' : '', hot: true, text: `${sur(B)} ${gB.toFixed(1)}s behind, ${wB.inNow ? 'in this lap' : 'window open'}` }; }
    if (gA != null && gA > 0 && gA < 3 && wC && wC.a <= 1 && A.tyres.wear > 0.2 && !A.pitRequested) { const strong = worth(A) > gA + 0.3; return { tag: strong ? 'UNDERCUT ON' : 'UNDERCUT CHANCE', cls: strong ? 'good' : '', hot: true, text: `${sur(A)} ${gA.toFixed(1)}s ahead on ${this.o.tyreLaps ? this.o.tyreLaps(A) : '?'}-lap ${String(A.tyres.compound).toLowerCase()}s` }; }
    if (gA != null && gA > 0 && gA < 3 && wA && wA.inNow) return { tag: 'OVERCUT', cls: '', hot: true, text: `${sur(A)} pits this lap: clear air for ${sur(c)}` };
    if (wC && wC.a <= 0 && !wC.inNow) return { tag: 'WINDOW OPEN', cls: '', hot: false, text: `${sur(c)} can stop from now` };
    return null;
  }
}
