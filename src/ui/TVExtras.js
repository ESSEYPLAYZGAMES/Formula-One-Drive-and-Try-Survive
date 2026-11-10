// The broadcast's live graphics beyond the tower and the captions (ui/TVGraphics.js), over the world feed in the team
// principal's race - what a real broadcast puts up while the race runs:
//   BATTLE FOR 1ST / FOR P5: two cars inside 1.2 s - the gap as it moves, whether it is closing, DRS, each car's tyre
//     and its age;
//   CATCHING: a car closing on the one ahead (the gap sampled every few seconds, its trend over the last half-minute
//     turned into seconds a lap): the gap, the rate, and the laps until they are together - only when that is before
//     the flag;
//   PIT STOP: the clock on a car stopped in its box, running, then frozen on its time;
//   the onboard's strip (speed, gear, throttle and brake, DRS) while the feed is on an onboard camera;
//   OVERTAKE banners, FINAL LAP;
//   THE SAFETY CAR's own feed: a yellow stinger across the picture as it is called, a yellow frame round the feed and
//     the tower while it is out, and its card in place of the battles (gaps mean nothing behind it) - the laps it has
//     led, who caused it, who has stopped under it (the cheap stop), the order it will release; SAFETY CAR IN THIS
//     LAP flashing as it comes in; the virtual safety car's the same, lighter; GREEN FLAG as the racing starts again;
//   THE RED FLAG's: a red stinger, a red frame, RACE SUSPENDED with what stopped it, then the restart's grid - the
//     order as it was frozen, each car's tyres (they may be changed), the laps still to run - and RACE RESUMES;
//   INSTANT REPLAY: an overtake for a place, a coming-together, a spin or a crash is OFFERED - a chip with a clock on
//     it (R, or a click); taken, the race holds and the last seconds are shown again from a camera by the place it
//     happened (main.js plays it from the director's rolling record: race/Replay.js); left alone, the chip goes.
// Plain DOM inside the graphics' own layer; written only where a value changed.
const CSS = `
#tvg .xr { position: absolute; right: 14px; bottom: calc(var(--pw, 150px) + 16px); display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
#tvg .xc { width: 268px; background: rgba(12,14,20,.9); border-radius: 6px; overflow: hidden; box-shadow: 0 6px 22px rgba(0,0,0,.35); transform: translateX(24px); opacity: 0; transition: opacity .3s, transform .35s cubic-bezier(.2,.7,.2,1); }
#tvg .xc.in { transform: none; opacity: 1; }
#tvg .xc .xh { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; font: 900 11px/1 var(--tvf); letter-spacing: .16em; background: #e10600; }
#tvg .xc.catch .xh { background: #1f6feb; } #tvg .xc.pst .xh { background: #00a3c7; }
#tvg .xc .xh small { font: 700 9px/1 var(--tvf); letter-spacing: .14em; opacity: .9; }
#tvg .xc .xrw { display: grid; grid-template-columns: 26px 4px 1fr auto; gap: 0 8px; align-items: center; padding: 6px 10px; font: 700 13px/1 var(--tvf); }
#tvg .xc .xrw + .xrw { border-top: 1px solid rgba(255,255,255,.08); }
#tvg .xc .xrw .p { font-weight: 900; color: #c9d1db; text-align: right; } #tvg .xc .xrw .tc { height: 15px; border-radius: 2px; }
#tvg .xc .xrw .n { text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#tvg .xc .xrw .t { display: flex; align-items: center; gap: 6px; font: 700 10px/1 var(--tvf); color: #b7c0cc; }
#tvg .xc .xg { display: flex; align-items: baseline; justify-content: space-between; padding: 7px 10px 8px; background: rgba(255,255,255,.06); }
#tvg .xc .xg b { font: 900 24px/1 var(--tvf); font-variant-numeric: tabular-nums; } #tvg .xc .xg b small { font: 700 10px/1 var(--tvf); letter-spacing: .12em; margin-left: 4px; color: #b7c0cc; }
#tvg .xc .xg span { font: 800 11px/1.2 var(--tvf); letter-spacing: .08em; text-align: right; }
#tvg .xc .xg span.cl { color: #3ddc84; } #tvg .xc .xg span.op { color: #ff8a80; } #tvg .xc .xg em { font-style: normal; display: inline-block; background: #3ddc84; color: #06210f; font: 900 9px/1 var(--tvf); letter-spacing: .12em; padding: 3px 5px; border-radius: 3px; margin-left: 6px; }
#tvg .xc .sp { display: flex; align-items: flex-end; gap: 2px; height: 16px; padding: 0 10px 8px; background: rgba(255,255,255,.06); }
#tvg .xc .sp i { flex: 1; background: #1f6feb; border-radius: 1px; min-height: 2px; }
#tvg .xc.pst .xg b { font-size: 30px; } #tvg .xc.pst.done .xg b { color: #3ddc84; }
#tvg .rpo { pointer-events: auto; cursor: pointer; display: flex; align-items: center; gap: 10px; background: rgba(12,14,20,.94); border: 1px solid rgba(255,255,255,.25); border-left: 4px solid #ffd400; border-radius: 6px; padding: 8px 12px; font: 700 12px/1.25 var(--tvf); max-width: 300px; position: relative; overflow: hidden; transform: translateX(24px); opacity: 0; transition: opacity .25s, transform .3s; }
#tvg .rpo.in { transform: none; opacity: 1; } #tvg .rpo:hover { border-color: #fff; }
#tvg .rpo kbd { font: 900 11px/1 var(--tvf); border: 1.5px solid #ffd400; color: #ffd400; border-radius: 4px; padding: 3px 6px; }
#tvg .rpo small { display: block; font: 800 9px/1 var(--tvf); letter-spacing: .2em; color: #ffd400; margin-bottom: 3px; }
#tvg .rpo i { position: absolute; left: 0; bottom: 0; height: 2px; width: 100%; background: #ffd400; transform-origin: 0 50%; }
#tvg .rbug { position: absolute; left: 50%; top: 14px; transform: translateX(-50%); display: none; align-items: center; gap: 10px; background: #e10600; padding: 8px 16px; font: 900 14px/1 var(--tvf); letter-spacing: .3em; border-radius: 4px; pointer-events: auto; cursor: pointer; }
#tvg .rbug.on { display: flex; } #tvg .rbug small { font: 700 10px/1 var(--tvf); letter-spacing: .12em; opacity: .9; }
#tvg .rbug::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: #fff; animation: tvgBlink 1s infinite; }
#tvg .tel { position: absolute; left: 50%; bottom: calc(var(--pw, 150px) + 84px); transform: translateX(-50%); display: none; align-items: center; gap: 14px; background: rgba(12,14,20,.82); border-radius: 6px; padding: 7px 14px; font: 800 12px/1 var(--tvf); }
#tvg .tel.on { display: flex; }
#tvg .tel .sp2 b { font: 900 26px/1 var(--tvf); font-variant-numeric: tabular-nums; } #tvg .tel .sp2 small { font: 700 9px/1 var(--tvf); letter-spacing: .14em; color: #b7c0cc; margin-left: 4px; }
#tvg .tel .gr { font: 900 22px/1 var(--tvf); width: 22px; text-align: center; color: #ffd400; }
#tvg .tel .bars { display: grid; gap: 4px; width: 110px; } #tvg .tel .bars div { height: 6px; background: rgba(255,255,255,.14); border-radius: 3px; overflow: hidden; } #tvg .tel .bars i { display: block; height: 100%; transform-origin: 0 50%; }
#tvg .tel .drs { font: 900 10px/1 var(--tvf); letter-spacing: .14em; padding: 4px 6px; border-radius: 3px; border: 1.5px solid rgba(255,255,255,.3); color: rgba(255,255,255,.4); } #tvg .tel .drs.on { background: #3ddc84; border-color: #3ddc84; color: #06210f; }
#tvg .r .p.up { color: #3ddc84; } #tvg .r .p.dn { color: #ff8a80; }
body.tp #hud-msg { display: none !important; }   /* (the broadcast says it itself - race control's column, the stingers: no second line across the middle of the picture) */
#tvg .frame { position: absolute; inset: 0; pointer-events: none; border: 0 solid transparent; transition: border-width .4s, border-color .4s; box-sizing: border-box; }
#tvg.ph-sc .frame, #tvg.ph-vsc .frame { border-width: 5px; border-color: #ffd400; } #tvg.ph-red .frame { border-width: 6px; border-color: #e10600; }
#tvg.ph-sc .th, #tvg.ph-vsc .th { background: #ffd400; color: #111; } #tvg.ph-red .th { background: #7a0a06; }
#tvg.ph-sc .mode, #tvg.ph-vsc .mode { color: #ffd400; } #tvg.ph-red .mode { color: #ff6b61; }
#tvg .sting { position: absolute; left: 0; right: 0; top: 34%; height: 15vh; min-height: 70px; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateX(-102%); pointer-events: none; font: 900 clamp(26px, 5.2vw, 62px)/1 var(--tvf); letter-spacing: .22em; box-shadow: 0 10px 40px rgba(0,0,0,.45); }
#tvg .sting small { font: 800 clamp(10px, 1.2vw, 15px)/1 var(--tvf); letter-spacing: .3em; margin-top: 10px; opacity: .85; }
#tvg .sting.go { animation: tvxSting 3.1s cubic-bezier(.2,.8,.2,1) forwards; }
#tvg .sting.y { background: repeating-linear-gradient(-45deg, #ffd400 0 34px, #f2c500 34px 68px); color: #111; } #tvg .sting.r { background: repeating-linear-gradient(-45deg, #e10600 0 34px, #c40500 34px 68px); color: #fff; } #tvg .sting.g { background: #1fae64; color: #fff; }
@keyframes tvxSting { 0% { transform: translateX(-102%); } 14% { transform: translateX(0); } 82% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(102%); opacity: 0; } }
#tvg .xc.scc .xh { background: #ffd400; color: #111; } #tvg .xc.scc.red .xh { background: #e10600; color: #fff; } #tvg .xc.scc { width: 286px; }
#tvg .xc.scc .ln { display: flex; justify-content: space-between; gap: 10px; padding: 5px 10px; font: 700 11px/1.25 var(--tvf); letter-spacing: .04em; border-top: 1px solid rgba(255,255,255,.08); }
#tvg .xc.scc .ln small { font: 800 9px/1.4 var(--tvf); letter-spacing: .16em; color: #9aa4b2; white-space: nowrap; } #tvg .xc.scc .ln span { text-align: right; }
#tvg .xc.scc .in2 { padding: 7px 10px; font: 900 12px/1 var(--tvf); letter-spacing: .14em; text-align: center; background: #ffd400; color: #111; animation: tvgBlink 1s infinite; }
#tvg .xc.scc.red .in2 { background: #e10600; color: #fff; }
#tvg .xc.scc .xrw { padding: 4px 10px; font-size: 12px; }
@media (max-width: 900px) { #tvg .xc { width: 220px; } #tvg .tel { display: none !important; } }
`;
const surname = (c) => { const w = String(c?.name || '').trim().split(/\s+/); return w[0] === 'Zhou' ? 'Zhou' : w[w.length - 1]; };
const LETTER = { SOFT: 'S', MEDIUM: 'M', HARD: 'H', INTER: 'I', WET: 'W' }, TCOL = { SOFT: '#e8322e', MEDIUM: '#ffd400', HARD: '#f2f2f2', INTER: '#3ddc84', WET: '#3d8bff' };
const ord = (n) => (n === 1 ? '1ST' : n === 2 ? '2ND' : n === 3 ? '3RD' : `P${n}`);

export class TVExtras {
  /** root: the graphics' layer (#tvg); o: { tyreLaps(car), onReplay(offer) (a replay taken), onSkip() (a replay playing: ended by hand) } */
  constructor(root, o = {}) {
    this.o = o;
    if (!document.getElementById('tvx-css')) { const st = document.createElement('style'); st.id = 'tvx-css'; st.textContent = CSS; document.head.appendChild(st); }
    const col = this.col = document.createElement('div'); col.className = 'xr'; root.appendChild(col);
    col.innerHTML = '<div class="rpo"><kbd>R</kbd><div><small>INSTANT REPLAY</small><span></span></div><i></i></div><div class="xc pst"></div><div class="xc bt"></div><div class="xc catch"></div>';
    this.rpo = col.children[0]; this.pst = col.children[1]; this.bt = col.children[2]; this.ct = col.children[3];
    this.bug = document.createElement('div'); this.bug.className = 'rbug'; this.bug.innerHTML = 'REPLAY<small></small>'; root.appendChild(this.bug);
    this.tel = document.createElement('div'); this.tel.className = 'tel'; this.tel.innerHTML = '<span class="sp2"><b>0</b><small>KM/H</small></span><span class="gr">1</span><span class="bars"><div><i style="background:#3ddc84"></i></div><div><i style="background:#e10600"></i></div></span><span class="drs">DRS</span>'; root.appendChild(this.tel);
    this.root = root; this.frame = document.createElement('div'); this.frame.className = 'frame'; root.appendChild(this.frame);
    this.sting = document.createElement('div'); this.sting.className = 'sting'; root.appendChild(this.sting);
    this.scc = document.createElement('div'); this.scc.className = 'xc scc'; col.appendChild(this.scc);
    this.rpo.addEventListener('click', () => this.take()); this.bug.addEventListener('click', () => this.o.onSkip?.());
    this.reset();
  }
  reset() {
    this.hist = new Map();      // car -> [{ t, g, ahead }]: its gap to the car ahead, sampled
    this.acc = 0; this.sampT = 0; this.order = null; this.passAt = new Map(); this.offer = null; this.pending = null; this.lastOffer = -99; this.catchK = 0; this.catchT = 0; this.stop = new Map(); this.finalSaid = false; this.spun = new Map(); this.outSeen = new Set(); this.keys = {};
    for (const e of [this.rpo, this.pst, this.bt, this.ct]) e.classList.remove('in'); this.bug.classList.remove('on'); this.tel.classList.remove('on');
    this.ph = 'green'; this.scS = null; this.redGrid = false; if (this.scc) this.scc.classList.remove('in'); if (this.root) this.root.classList.remove('ph-sc', 'ph-vsc', 'ph-red'); if (this.sting) this.sting.className = 'sting';
  }
  /** the stinger across the picture: kind 'y' | 'r' | 'g' */
  stinger(text, sub, kind) { const s = this.sting; s.className = 'sting'; s.innerHTML = `${text}${sub ? `<small>${sub}</small>` : ''}`; void s.offsetWidth; s.className = `sting ${kind} go`; }
  html(el, key, make) { if (this.keys[el.className.split(' ')[1]] === key) return; this.keys[el.className.split(' ')[1]] = key; el.innerHTML = make(); }
  /** something worth a replay: { text, cars: [a, b?], t (race time) } - offered a moment later, once what followed is on record */
  event(e, d) { if (!d || d.time - this.lastOffer < 14 || this.pending || this.offer) return; this.pending = { ...e, t: d.time, due: d.time + (e.wait ?? 2.4) }; }
  /** the offer taken (R, a click) */
  take() { const o = this.offer; if (!o) return false; this.offer = null; this.rpo.classList.remove('in'); this.o.onReplay?.(o); return true; }
  /** a replay is playing (main.js): the bug up, the cards away */
  replaying(on, text = '') { this.bug.classList.toggle('on', !!on); this.bug.querySelector('small').textContent = on ? text : ''; this.col.style.visibility = on ? 'hidden' : ''; if (on) { this.tel.classList.remove('on'); this.root.querySelector('.cap')?.classList.remove('in'); } this.root.querySelector('.live')?.classList.toggle('rp', !!on); }

  /** every frame. ctx: { d, focus, shot (the director's), halted, say(text, kind, head) (race control's line) } */
  update(dt, ctx) {
    const d = ctx.d; if (!d || d.mode !== 'race') { for (const e of [this.rpo, this.pst, this.bt, this.ct]) e.classList.remove('in'); this.tel.classList.remove('on'); return; }
    const P = d.positions, racing = d.world.racing && !d.done, mine = (c) => (ctx.focus || []).includes(c), gap = (a, b) => d.radio?.gap?.(a, b);
    const onTrack = (c) => c && !c.retired && !c.finished && !c.inPit && !c.pitLane && !c.isSC && !c.hiddenAway;
    // the onboard's strip: live, every frame
    const sh = ctx.shot, ob = sh && (sh.kind === 'tcam' || sh.kind === 'rear') && sh.car && !ctx.halted;
    this.tel.classList.toggle('on', !!ob);
    if (ob) { const c = sh.car, k = Math.round(Math.abs(c.speed) * 3.6); const b = this.tel.querySelector('.sp2 b'); if (b.textContent !== String(k)) b.textContent = k; const g = this.tel.querySelector('.gr'); if (g.textContent !== String(c.gear || 1)) g.textContent = c.gear || 1; const I = this.tel.querySelectorAll('.bars i'); I[0].style.transform = `scaleX(${Math.max(0, Math.min(1, c.throttle || 0)).toFixed(2)})`; I[1].style.transform = `scaleX(${Math.max(0, Math.min(1, c.brake || 0)).toFixed(2)})`; this.tel.querySelector('.drs').classList.toggle('on', !!c.drs); }
    // the replay's offer: its clock
    if (this.offer) { const left = 1 - (performance.now() - this.offer.shown) / 7000; this.rpo.querySelector('i').style.transform = `scaleX(${Math.max(0, left)})`; if (left <= 0) { this.offer = null; this.rpo.classList.remove('in'); } }
    if (ctx.halted) return;
    if (this.pending && d.time >= this.pending.due) { const e = this.pending; this.pending = null; if (racing || d.leaderFinished) { this.offer = { ...e, shown: performance.now() }; this.lastOffer = d.time; this.rpo.querySelector('span').textContent = e.text; this.rpo.classList.add('in'); } }
    this.acc += dt; if (this.acc < 0.2) return; this.acc = 0;
    // ---- the safety car's and the red flag's own feed ------------------------------------------------------------
    const ph = d.sc?.phase || 'green', lead0 = P.find((c) => !c.retired), neutral = ph === 'sc' || ph === 'scIn' || ph === 'vsc' || ph === 'vscEnd';
    const rowQ = (c, i) => { const k = c.tyres?.compound || 'SOFT'; return `<div class="xrw"><span class="p">${i + 1}</span><span class="tc" style="background:${c.color}"></span><span class="n">${surname(c)}</span><span class="t"><span class="ty2" style="border-color:${TCOL[k]};width:17px;height:17px;border-width:3px;font-size:8px">${LETTER[k] || ''}</span>${this.o.tyreLaps ? this.o.tyreLaps(c) : ''}L</span></div>`; };
    const cause = () => { const S0 = d.sc?.incident?.cars; const n = S0 ? [...S0].map((c) => surname(c)).filter(Boolean) : []; return n.length ? n.slice(0, 3).join(', ') : ''; };
    if (ph !== this.ph) {
      const was = this.ph; this.ph = ph;
      if (ph === 'sc' && was !== 'scIn') { this.scS = { kind: 'sc', t0: d.time, lap0: lead0?.lap || 0, stops: new Map(P.map((c) => [c, c.pitStops])), cause: cause() }; this.stinger('SAFETY CAR', this.scS.cause ? `${this.scS.cause.toUpperCase()} · NO OVERTAKING` : 'NO OVERTAKING', 'y'); if (d.sc?.incident?.cars?.size) this.event({ text: `the incident: ${this.scS.cause}`, cars: [...d.sc.incident.cars].slice(0, 2), wait: 1.5 }, d); }
      else if (ph === 'vsc') { this.scS = { kind: 'vsc', t0: d.time, lap0: lead0?.lap || 0, stops: new Map(P.map((c) => [c, c.pitStops])), cause: cause() }; this.stinger('VIRTUAL SAFETY CAR', 'HOLD THE DELTA · NO OVERTAKING', 'y'); }
      else if (ph === 'red') { this.scS = { kind: 'red', t0: d.time, lap0: lead0?.lap || 0, stops: new Map(), cause: cause() }; this.redGrid = true; this.stinger('RED FLAG', this.scS.cause ? `RACE SUSPENDED · ${this.scS.cause.toUpperCase()}` : 'RACE SUSPENDED', 'r'); if (d.sc?.incident?.cars?.size) this.event({ text: `what stopped the race: ${this.scS.cause}`, cars: [...d.sc.incident.cars].slice(0, 2), wait: 1.2 }, d); }
      else if ((ph === 'green' || ph === 'restart') && (was === 'sc' || was === 'scIn' || was === 'vsc' || was === 'vscEnd')) { this.stinger('GREEN FLAG', was.startsWith('vsc') ? 'VIRTUAL SAFETY CAR ENDED' : 'RACING RESUMES', 'g'); }
      this.root.classList.toggle('ph-sc', ph === 'sc' || ph === 'scIn'); this.root.classList.toggle('ph-vsc', ph === 'vsc' || ph === 'vscEnd');
    }
    // (the red flag: its frame stays over the restart's grid until the lights go out again)
    if (this.redGrid && ph !== 'red' && d.world.racing) { this.redGrid = false; this.stinger('RACE RESUMES', `LAP ${Math.min(d.lapsTotal, (lead0?.lap || 0) + 1)} OF ${d.lapsTotal}`, 'g'); this.scS = null; }
    this.root.classList.toggle('ph-red', ph === 'red' || this.redGrid);
    if (neutral && this.scS) {
      const S0 = this.scS, laps = Math.max(0, (lead0?.lap || 0) - S0.lap0) + 1, boxed = P.filter((c) => !c.retired && c.pitStops > (S0.stops.get(c) ?? c.pitStops)).map((c) => surname(c)), inLane = P.filter((c) => !c.retired && (c.pitLane || c.inPit)).map((c) => surname(c));
      this.scc.className = 'xc scc in'; this.bt.classList.remove('in'); this.ct.classList.remove('in');
      this.scc.innerHTML = `<div class="xh">${S0.kind === 'vsc' ? 'VIRTUAL SAFETY CAR' : 'SAFETY CAR'}<small>LAP ${Math.min(d.lapsTotal, (lead0?.lap || 0) + 1)}/${d.lapsTotal}</small></div>`
        + (ph === 'scIn' ? '<div class="in2">SAFETY CAR IN THIS LAP</div>' : ph === 'vscEnd' ? '<div class="in2">VSC ENDING</div>' : '')
        + `<div class="ln"><small>${S0.kind === 'vsc' ? 'VSC' : 'SC'} LAP</small><span>${laps}</span></div>`
        + (S0.cause ? `<div class="ln"><small>CAUSE</small><span>${S0.cause}</span></div>` : '')
        + `<div class="ln"><small>STOPPED UNDER IT</small><span>${boxed.length ? `${boxed.slice(0, 4).join(', ')}${boxed.length > 4 ? ` +${boxed.length - 4}` : ''}` : 'nobody yet'}</span></div>`
        + (inLane.length ? `<div class="ln"><small>IN THE PIT LANE</small><span>${inLane.slice(0, 3).join(', ')}${inLane.length > 3 ? ` +${inLane.length - 3}` : ''}</span></div>` : '')
        + (S0.kind === 'sc' ? `<div class="ln"><small>THE QUEUE</small><span></span></div>${P.filter((c) => !c.retired && !c.pitLane && !c.inPit).slice(0, 3).map((c) => rowQ(c, P.indexOf(c))).join('')}` : '');
    } else if ((ph === 'red' || this.redGrid) && this.scS) {
      const S0 = this.scS, left = Math.max(0, d.lapsTotal - (lead0?.lap || 0));
      this.scc.className = 'xc scc red in'; this.bt.classList.remove('in'); this.ct.classList.remove('in');
      this.scc.innerHTML = `<div class="xh">RED FLAG<small>${ph === 'red' ? 'RACE SUSPENDED' : 'STANDING RESTART'}</small></div>`
        + (ph === 'red' ? '<div class="in2">ALL CARS TO THE GRID</div>' : '<div class="in2">THE RESTART</div>')
        + (S0.cause ? `<div class="ln"><small>STOPPED BY</small><span>${S0.cause}</span></div>` : '')
        + `<div class="ln"><small>STILL TO RUN</small><span>${left} lap${left === 1 ? '' : 's'}</span></div><div class="ln"><small>TYRES</small><span>may be changed</span></div>`
        + `<div class="ln"><small>THE ORDER</small><span></span></div>${P.filter((c) => !c.retired).slice(0, 5).map((c) => rowQ(c, P.indexOf(c))).join('')}`;
    } else this.scc.classList.remove('in');
    this.neutral = neutral || ph === 'red' || this.redGrid;
    if (!racing) { this.bt.classList.remove('in'); this.ct.classList.remove('in'); if (!d.leaderFinished) return; }
    // overtakes on the road (not a stop, not a car out): a banner, and a replay offered
    const idx = new Map(P.map((c, i) => [c, i]));
    if (this.order && racing && !this.neutral) for (let i = 0; i < Math.min(P.length - 1, 12); i++) {
      const a = P[i], b = P[i + 1], was = this.order;
      if (was.get(a) > was.get(b) && onTrack(a) && onTrack(b) && a.lap === b.lap && d.time - (this.passAt.get(a) ?? -99) > 12 && (a.lap > 0 || a.lapDist > 600)) {
        this.passAt.set(a, d.time); if (i < 10 || mine(a) || mine(b)) { ctx.say?.(`${surname(a)} PASSES ${surname(b)} FOR ${ord(i + 1)}`, mine(a) ? 'good' : mine(b) ? 'bad' : '', 'OVERTAKE'); if (i < 6 || mine(a) || mine(b)) this.event({ text: `${surname(a)} passes ${surname(b)} for ${ord(i + 1).toLowerCase()}`, cars: [a, b], wait: 1.6 }, d); }
      }
    }
    this.order = idx;
    // a spin, a car out in an accident: a replay offered
    for (const c of P) {
      if (c.spinning && c.speed > 8 && d.time - (this.spun.get(c) ?? -99) > 20) { this.spun.set(c, d.time); this.event({ text: `${surname(c)} spins`, cars: [c], wait: 2.8 }, d); }
      if (c.retired && !this.outSeen.has(c)) { this.outSeen.add(c); if (/accident|crash|collision|torn|wall/i.test(c.retireReason || '') && racing) this.event({ text: `${surname(c)} is out: ${String(c.retireReason || 'an accident').toLowerCase()}`, cars: [c], wait: 3.2 }, d); }
    }
    // the final lap
    const lead = P.find((c) => !c.retired); if (lead && !this.finalSaid && racing && lead.lap >= d.lapsTotal - 1 && d.lapsTotal > 1) { this.finalSaid = true; ctx.say?.(`${surname(lead)} STARTS THE LAST LAP`, 'purple', 'FINAL LAP'); }
    // the gaps, sampled: each car to the one ahead of it
    this.sampT += 0.2;
    if (this.sampT >= 3 && racing) {
      this.sampT = 0;
      for (let i = 1; i < P.length; i++) { const c = P[i], a = P[i - 1]; if (!onTrack(c) || !onTrack(a) || c.lap !== a.lap) { this.hist.delete(c); continue; } const g = gap(c, a); if (g == null || !(g > 0)) continue; let H = this.hist.get(c); if (!H || H[H.length - 1].ahead !== a) this.hist.set(c, (H = [])); H.push({ t: d.time, g, ahead: a }); if (H.length > 14) H.shift(); }
    }
    const lapT = isFinite(lead?.bestLap) ? lead.bestLap : (ctx.lapTime || 90), left = lead ? Math.max(0, d.lapsTotal - lead.lap - Math.min(1, Math.max(0, lead.lapDist) / Math.max(1, ctx.len || 5000))) : 0;
    /** seconds a lap the gap to the car ahead is closing by (+: closing), over its samples -> null with too few */
    const rate = (c) => { const H = this.hist.get(c); if (!H || H.length < 4) return null; const n = H.length, t0 = H[0].t; let sx = 0, sy = 0, sxx = 0, sxy = 0; for (const h of H) { const x = h.t - t0; sx += x; sy += h.g; sxx += x * x; sxy += x * h.g; } const den = n * sxx - sx * sx; if (!(den > 1e-6)) return null; return -((n * sxy - sx * sy) / den) * lapT; };
    const tyre = (c) => { const k = c.tyres?.compound || 'SOFT'; return `<span class="ty2" style="border-color:${TCOL[k]};width:17px;height:17px;border-width:3px;font-size:8px">${LETTER[k] || ''}</span>${this.o.tyreLaps ? this.o.tyreLaps(c) : ''}L`; };
    const row = (c, i) => `<div class="xrw"><span class="p">${i + 1}</span><span class="tc" style="background:${c.color}"></span><span class="n">${surname(c)}</span><span class="t">${tyre(c)}</span></div>`;
    // a stop: the clock on a car of yours (or the car on screen) in its box
    let stopCar = null;
    for (const c of P) { let s = this.stop.get(c); if (c.inPit && !c.retired) { if (!s || s.done) this.stop.set(c, (s = { t0: d.time, done: false, n: c.pitStops })); if (mine(c) || sh?.car === c) stopCar = stopCar || c; } else if (s && !s.done) { s.done = true; s.time = c._stopDur ?? d.time - s.t0; s.until = d.time + 4; if (mine(c) || sh?.car === c) stopCar = stopCar || c; } else if (s && s.done && d.time < s.until && (mine(c) || sh?.car === c)) stopCar = stopCar || c; }
    if (stopCar) { const s = this.stop.get(stopCar), v = s.done ? s.time : d.time - s.t0; this.pst.className = `xc pst in${s.done ? ' done' : ''}`; this.pst.innerHTML = `<div class="xh">PIT STOP<small>${surname(stopCar).toUpperCase()}</small></div><div class="xg"><b>${v.toFixed(1)}<small>SEC</small></b><span>${stopCar.tyres?.compound || ''}</span></div>`; } else this.pst.classList.remove('in');
    if (!racing || this.neutral) { this.bt.classList.remove('in'); this.ct.classList.remove('in'); this.hist.clear(); return; }
    // the battle: the closest pair worth showing (the fight on screen first, then the highest up, yours ahead of others)
    let best = null;
    for (let i = 1; i < P.length; i++) { const c = P[i], a = P[i - 1]; if (!onTrack(c) || !onTrack(a) || c.lap !== a.lap || (c.lap === 0 && c.lapDist < 900)) continue; const g = gap(c, a); if (g == null || !(g > 0) || g > 1.2) continue; const sc = (sh && sh.why === 'battle' && (sh.car === c || sh.other === c) ? 40 : 0) + (i === 1 ? 14 : Math.max(0, 9 - i)) + (mine(c) || mine(a) ? 8 : 0) + (1.2 - g) * 4; if (i > 8 && !mine(c) && !mine(a) && sc < 40) continue; if (!best || sc > best.sc) best = { c, a, i, g, sc }; }
    if (best) {
      const r = rate(best.c), drs = best.g < 1 && (best.c.drs || best.c.drsOk);
      this.bt.classList.add('in');
      this.bt.innerHTML = `<div class="xh">BATTLE FOR ${ord(best.i)}<small>LAP ${Math.min(d.lapsTotal, best.a.lap + 1)}/${d.lapsTotal}</small></div>${row(best.a, best.i - 1)}${row(best.c, best.i)}<div class="xg"><b>${best.g.toFixed(2)}<small>SEC</small></b><span class="${r != null && r > 0.05 ? 'cl' : r != null && r < -0.05 ? 'op' : ''}">${r == null ? '' : r > 0.05 ? `CLOSING ${r.toFixed(1)}/LAP` : r < -0.05 ? `PULLING AWAY ${(-r).toFixed(1)}/LAP` : 'HOLDING'}${drs ? '<em>DRS</em>' : ''}</span></div>`;
    } else this.bt.classList.remove('in');
    // catching: who is closing on whom, and when they meet (one at a time, the next every twelve seconds)
    const C = [];
    for (let i = 1; i < P.length; i++) { const c = P[i], a = P[i - 1]; if (best && (best.c === c || best.a === c)) continue; const H = this.hist.get(c); if (!H) continue; const g = H[H.length - 1].g, r = rate(c); if (r == null || r < 0.12 || g < 1.2 || g > 18) continue; const laps = (g - 0.8) / r; if (laps > left - 0.3 || laps < 0.4) continue; if (i > 9 && !mine(c) && !mine(a)) continue; C.push({ c, a, i, g, r, laps, sc: (i === 1 ? 14 : Math.max(0, 9 - i)) + (mine(c) || mine(a) ? 8 : 0) - laps * 0.5, H }); }
    C.sort((x, y) => y.sc - x.sc);
    this.catchT += 0.2; if (this.catchT > 12) { this.catchT = 0; this.catchK++; }
    const k = C.length ? C[this.catchK % Math.min(C.length, 3)] : null;
    if (k) {
      const mx = Math.max(...k.H.map((h) => h.g), 0.1);
      this.ct.classList.add('in');
      this.ct.innerHTML = `<div class="xh">CATCHING · FOR ${ord(k.i)}<small>${Math.ceil(left)} LAP${Math.ceil(left) === 1 ? '' : 'S'} LEFT</small></div>${row(k.a, k.i - 1)}${row(k.c, k.i)}<div class="xg"><b>${k.g.toFixed(1)}<small>SEC</small></b><span class="cl">−${k.r.toFixed(1)}/LAP<br>FIGHT IN ~${k.laps < 1.5 ? '1 LAP' : `${Math.round(k.laps)} LAPS`}</span></div><div class="sp">${k.H.slice(-12).map((h) => `<i style="height:${Math.max(12, h.g / mx * 100).toFixed(0)}%"></i>`).join('')}</div>`;
    } else this.ct.classList.remove('in');
  }
}
