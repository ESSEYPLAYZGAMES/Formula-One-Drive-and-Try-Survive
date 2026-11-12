// The pit wall: the team principal's race (main.js TP), your two cars run from here while the world feed plays above
// (camera/TVDirector.js, ui/TVGraphics.js). For each car: its place and the gaps either side, its tyres (the set, the
// laps on it, the wear and the laps to the cliff), damage, the last and best laps; its pace mode - PUSH (quicker, the
// tyres and the engine pay), STANDARD, CONSERVE (slower, they last); who makes the strategy calls - the AI strategist
// (it boxes the car when the tyres, the weather, a safety car or the undercut say so; you can still call a stop or keep
// the car out a lap) or you (nothing happens unless you call it); and the stop - the set to fit, BOX, or call it off.
// Before the lights the same buttons choose the set each car starts on. Between the two cars: the time (pause, x1, x2,
// x4; simulate a lap, five, or to the flag - the race model, then live again from where it leaves the cars), the
// cameras (the director's choice, or one camera kept), the team orders (swap the cars, hold position, let them race),
// and the radio - what your engineers tell you.
//   new PitWall({ act(name, ...args) }) - the buttons call act: 'pace' (car, mode), 'strat' (car, manual), 'box' (car,
//   compound), 'stay' (car), 'start' (car, compound), 'speed' (x), 'pause', 'sim' (laps | 0: to the flag), 'cam' (kind),
//   'follow' (car), 'order' (type)
import { COMPOUNDS, cliffLaps, CLIFF } from '../vehicle/Tyres.js';
import { TV_CAM_NAME } from '../camera/TVDirector.js';
import { ORDERS } from '../race/TeamTactics.js';

const CSS = `
#pw { --tvf: "Segoe UI Variable", "Segoe UI", Inter, system-ui, Roboto, sans-serif; position: fixed; left: 0; right: 0; bottom: 0; z-index: 23; display: grid; grid-template-columns: minmax(0,1fr) minmax(250px, 330px) minmax(0,1fr); gap: 6px; padding: 6px 8px 7px; background: linear-gradient(to top, rgba(8,10,14,.94), rgba(8,10,14,.8)); font-family: "Segoe UI Variable", "Segoe UI", Inter, system-ui, Roboto, sans-serif; color: #eef1f5; border-top: 1px solid rgba(255,255,255,.08); font-size: 11px; }
#pw.hidden { display: none; }
#pw.min .body, #pw.min .mid .row:not([data-g="time"]), #pw.min .radio { display: none; }
#pw button { font: inherit; color: inherit; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 10px; font-weight: 700; letter-spacing: .05em; line-height: 1.25; }
#pw button:hover { background: rgba(255,255,255,.15); }
#pw button.on { background: #eef1f5; color: #0b0d12; border-color: #eef1f5; }
#pw button.pbx { background: #e10600; border-color: #e10600; color: #fff; padding: 2px 10px; }
#pw button.pbx.on { background: #ffb000; border-color: #ffb000; color: #111; }
#pw button:disabled { opacity: .35; cursor: default; }
#pw .car { position: relative; background: rgba(255,255,255,.04); border-radius: 6px; padding: 5px 8px 5px 11px; min-width: 0; overflow: hidden; display: flex; flex-direction: column; gap: 4px; }
#pw .car::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c, #888); }
#pw .hd { display: flex; align-items: center; gap: 7px; white-space: nowrap; min-width: 0; }
#pw .hd .ps { font: 900 17px/1 var(--tvf); min-width: 32px; flex: none; }
#pw .hd .nm { font: 800 13px/1 var(--tvf); text-transform: uppercase; letter-spacing: .03em; flex: 0 1 auto; min-width: 40px; overflow: hidden; text-overflow: ellipsis; }
#pw .hd .gp { margin-left: auto; flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-weight: 600; color: #b7c0cc; font-variant-numeric: tabular-nums; }
#pw .hd .fw { flex: none; }
#pw .body { display: flex; flex-direction: column; gap: 4px; }
#pw .st { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 10px; font-weight: 600; color: #c9d1db; font-variant-numeric: tabular-nums; }
#pw .tyre { display: inline-flex; align-items: center; gap: 5px; }
#pw .tyre i { width: 15px; height: 15px; border-radius: 50%; border: 3px solid #e8322e; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; font: 900 7px/1 var(--tvf); font-style: normal; color: #fff; }
#pw .wear { width: 54px; height: 5px; border-radius: 3px; background: rgba(255,255,255,.12); overflow: hidden; display: inline-block; }
#pw .wear u { display: block; height: 100%; background: #2fbf4f; transform-origin: left; }
#pw .dmg { color: #ff8a80; } #pw .warnc { color: #ffd400; }
#pw .ctl { display: flex; flex-wrap: wrap; gap: 3px 9px; align-items: center; }
#pw .grp { display: inline-flex; gap: 2px; align-items: center; }
#pw .grp > span { font: 700 8.5px/1 var(--tvf); letter-spacing: .14em; color: #8b95a3; margin-right: 3px; }
#pw .cmp button { width: 20px; padding: 2px 0; text-align: center; border-color: var(--tc); }
#pw .cmp button.on { background: var(--tc); color: #111; }
#pw .cmp button[data-n]::after { content: attr(data-n); font-size: 7px; vertical-align: super; margin-left: 1px; opacity: .8; }
#pw .pgs { display: inline-flex; gap: 2px; margin-left: 6px; flex: none; } #pw .pgs button { padding: 1px 6px; font-size: 9px; }
#pw .car[data-pg="drive"] .pg-race, #pw .car[data-pg="drive"] .pg-car, #pw .car[data-pg="race"] .pg-drive, #pw .car[data-pg="race"] .pg-car, #pw .car[data-pg="car"] .pg-drive, #pw .car[data-pg="car"] .pg-race { display: none; }
#pw .alert { display: none; align-items: center; gap: 6px; background: rgba(255,176,0,.16); border: 1px solid rgba(255,176,0,.5); border-radius: 5px; padding: 2px 6px; font-size: 10.5px; } #pw .alert.on { display: flex; } #pw .alert span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#pw .note { font-size: 10px; color: #9aa4b2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: none; }
#pw .car:hover .note { display: block; }   /* (the card's footnote only when the card is pointed at: less to read while the race runs) */
#pw .mid { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
#pw .mid .row { display: flex; gap: 2px; flex-wrap: wrap; align-items: center; margin: 0; }   /* (not the menus' .row) */
#pw .mid .row > span { font: 700 8.5px/1 var(--tvf); letter-spacing: .12em; color: #8b95a3; width: 34px; text-transform: none; }
#pw .radio { font-size: 10.5px; line-height: 1.3; color: #c9d1db; background: rgba(255,255,255,.04); border-radius: 4px; padding: 3px 6px; height: 28px; overflow: hidden; }
#pw .radio b { color: #fff; }
#pw.q .ctl, #pw.q .note, #pw.q [data-g="order"], #pw.q [data-a="sim"]:not([data-v="0"]) { display: none; }
#pw .tog { position: absolute; right: 8px; top: -22px; font-size: 9px !important; padding: 2px 8px !important; background: rgba(8,10,14,.85) !important; }
#pw .tog.tg2 { right: 96px; }
/* COMPACT (the default on a laptop's screen): each instruction shows only what it is set to - point at it and its
   choices open; the box-for tyres and the fuel load stay as they are. Less to read while the race runs. */
#pw.cpt .grp:not(.cmp):not(.fl):not([data-g="replan"]):not(:hover):not(:focus-within) button:not(.on) { display: none; }
#pw.cpt .ctl { gap: 3px 10px; }
#pw.cpt .st .lt { display: none; }
#pw-sim { position: fixed; inset: 0; z-index: 48; display: none; align-items: center; justify-content: center; flex-direction: column; gap: 10px; background: rgba(4,6,10,.72); color: #eef1f5; font: 600 14px/1.4 "Segoe UI", Arial, sans-serif; letter-spacing: .2em; text-align: center; }
#pw-sim small { color: #9aa4b2; letter-spacing: .1em; }
@media (max-width: 900px) { #pw { grid-template-columns: 1fr 1fr; } #pw .mid { grid-column: 1 / -1; grid-row: 1; flex-direction: row; flex-wrap: wrap; } #pw .radio { display: none; } }
`;
const LETTER = { SOFT: 'S', MEDIUM: 'M', HARD: 'H', INTER: 'I', WET: 'W' };
const ORDER = ['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'];
/**
 * The driving instructions, three of them (as F1 Manager has them): TYRES - how hard the driver leans on them (cornering
 * commitment against wear); FUEL - the engine's mixture (power against consumption; lift and coast: off the throttle
 * before each braking zone - the most saved, the most lost); ERS - when the battery is spent (harvest: never, and it fills;
 * overtake: every straight, a fight above all). Each: { label, short, title, pace (cornering, AIDriver.vScale), wear
 * (tyres), power (engine, Car.enginePower), burn (fuel), rel (failure risk) }
 */
export const MODES = {
  tyre: {
    aggr: { label: 'Aggressive', short: 'AGGR', pace: 1.008, wear: 1.3, rel: 1, title: 'Aggressive: on the limit in every corner - the quickest, the tyres go fastest' },
    std: { label: 'Standard', short: 'STD', pace: 1, wear: 1, rel: 1, title: 'Standard: the pace the car is set up for' },
    light: { label: 'Light', short: 'LIGHT', pace: 0.995, wear: 0.84, rel: 1, title: 'Light: a little off the limit - the tyres last longer' },
    cons: { label: 'Conserve', short: 'CONS', pace: 0.989, wear: 0.68, rel: 1, title: 'Conserve: well off the limit - the tyres last much longer, the laps are slower' },
  },
  fuel: {
    push: { label: 'Push', short: 'PUSH', power: 1.012, burn: 1.08, wear: 1.03, rel: 1.15, title: 'Push: the richest mixture - more power, more fuel, the engine works harder' },
    std: { label: 'Standard', short: 'STD', power: 1, burn: 1, wear: 1, rel: 1, title: 'Standard mixture' },
    save: { label: 'Save', short: 'SAVE', power: 0.988, burn: 0.93, wear: 1, rel: 0.95, title: 'Save: a leaner mixture - less power, less fuel' },
    lico: { label: 'Lift & coast', short: 'L&C', power: 0.972, burn: 0.85, wear: 0.97, rel: 0.9, title: 'Lift and coast: off the throttle before every braking zone - the most fuel saved, the most time lost' },
  },
  ers: {
    harvest: { label: 'Harvest', short: 'HARV', wear: 0.98, title: 'Harvest: no deployment - the battery fills (an easy target from behind)' },
    bal: { label: 'Balanced', short: 'BAL', wear: 1, title: 'Balanced: the battery spent where it pays, as the driver sees fit' },
    deploy: { label: 'Deploy', short: 'DEPL', wear: 1.02, title: 'Deploy: spent readily on every straight' },
    ovt: { label: 'Overtake', short: 'OVT', wear: 1.04, title: 'Overtake: everything, now - attack or defend; it runs flat in a lap or two' },
  },
};
/** (the old name of the tyre modes: their labels, for the radio) */
export const PACE = MODES.tyre;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const surname = (c) => { const w = String(c?.name || '').trim().split(/\s+/); return w[0] === 'Zhou' ? 'Zhou' : w[w.length - 1]; };
const fmtLap = (t) => { if (!isFinite(t)) return '-'; const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s.toFixed(3).padStart(6, '0')}`; };

export class PitWall {
  constructor(o) {
    this.act = o.act;
    if (!document.getElementById('pw-css')) { const st = document.createElement('style'); st.id = 'pw-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = this.el = document.createElement('div'); el.id = 'pw'; el.className = 'hidden';
    // (compact on a laptop's screen unless you chose otherwise)
    { let pref = null; try { pref = localStorage.getItem('f1sim-pw-compact'); } catch (e) { pref = null; } if (pref === '1' || (pref == null && innerHeight < 900)) el.classList.add('cpt'); }
    document.body.appendChild(el);
    this.sim = document.createElement('div'); this.sim.id = 'pw-sim'; document.body.appendChild(this.sim);
    el.addEventListener('click', (e) => this.click(e));
    this.cars = []; this.acc = 1; this.keys = new Map(); this.radioLines = [];
  }
  /** a race: your two cars (built anew) */
  open(cars) {
    this.cars = cars; this.keys.clear(); this.radioLines = [];
    const ordRow = (pg) => Object.entries(ORDERS).filter(([, O]) => O.page === pg).map(([g, O]) => `<span class="grp" data-g="o-${g}"><span>${O.name}</span>${Object.entries(O.opts).map(([m, p]) => `<button data-a="ord" data-g="${g}" data-k="${k0}" data-v="${m}" title="${esc(p.title)}">${p.short}</button>`).join('')}</span>`).join('');
    let k0 = 0;
    const card = (c, k) => { k0 = k; return `<div class="car" data-k="${k}" data-pg="drive" style="--c:${esc(c.color)}">
      <div class="hd"><span class="ps">P-</span><span class="nm">${esc(c.name)}</span><span class="pgs"><button data-a="pg" data-k="${k}" data-v="drive" title="Tyres, fuel, ERS, the stops">DRIVE</button><button data-a="pg" data-k="${k}" data-v="race" title="How the car is raced">RACECRAFT</button><button data-a="pg" data-k="${k}" data-v="car" title="Brake bias, differential, cooling">CAR</button></span><span class="gp"></span><button class="fw" data-a="follow" data-k="${k}" title="Watch this car">◉</button></div>
      <div class="body">
      <div class="st"><span class="tyre"><i></i><span class="tl"></span><span class="wear"><u></u></span><span class="wp"></span></span><span class="lt"></span><span class="fu"></span><span class="dm dmg"></span></div>
      <div class="alert"><span></span><button data-a="alert" data-k="${k}" data-v="yes">YES</button><button data-a="alert" data-k="${k}" data-v="no">NO</button></div>
      <div class="ctl pg-race">${ordRow('race')}</div>
      <div class="ctl pg-car">${ordRow('car')}<span class="grp" data-g="replan"><button data-a="replan" data-k="${k}" title="Work the strategy out again from here: the stops still worth making">RE-PLAN</button></span></div>
      <div class="ctl pg-drive">
        ${['tyre', 'fuel', 'ers'].map((g) => `<span class="grp" data-g="${g}"><span>${g === 'tyre' ? 'TYRES' : g.toUpperCase()}</span>${Object.entries(MODES[g]).map(([m, p]) => `<button data-a="mode" data-g="${g}" data-k="${k}" data-v="${m}" title="${esc(p.title)}">${p.short}</button>`).join('')}</span>`).join('')}
        <span class="grp" data-g="strat"><span>CALLS</span><button data-a="strat" data-k="${k}" data-v="ai" title="The AI strategist boxes the car when it should - you can still call a stop or keep it out">AI</button><button data-a="strat" data-k="${k}" data-v="plan" title="The plan chosen before the race: the pit wall boxes the car on its laps (STAY OUT on a call: a lap later)">PLAN</button><button data-a="strat" data-k="${k}" data-v="you" title="Nothing happens unless you call it">YOU</button></span>
        <span class="grp cmp" data-g="cmp"><span class="cl">BOX FOR</span>${ORDER.map((x) => `<button data-a="cmp" data-k="${k}" data-v="${x}" style="--tc:${COMPOUNDS[x].color}">${LETTER[x]}</button>`).join('')}</span>
        <button class="pbx bx" data-a="box" data-k="${k}">BOX</button>
        <span class="grp fl" data-g="fload"><span>FUEL LOAD</span><button data-a="fuel" data-k="${k}" data-v="-0.5" title="Half a lap's fuel less: lighter, quicker - and it must be saved later">−</button><button data-a="fuel" data-k="${k}" data-v="0.5" title="Half a lap's fuel more: heavier, slower - and a margin">+</button></span>
      </div>
      <div class="note"></div>
      </div></div>`; };
    {
      const C = cars;
      this.el.innerHTML = `${card(C[0], 0)}<div class="mid">
        <div class="row" data-g="time"><span>TIME</span><button data-a="pause">❚❚</button><button data-a="speed" data-v="1">×1</button><button data-a="speed" data-v="2">×2</button><button data-a="speed" data-v="4">×4</button></div>
        <div class="row" data-g="sim"><span>SIM</span><button data-a="sim" data-v="1">1 LAP</button><button data-a="sim" data-v="5">5 LAPS</button><button data-a="sim" data-v="0">TO FLAG</button></div>
        <div class="row" data-g="cam"><span>CAM</span>${['auto', 'track', 'tcam', 'heli', 'rear'].map((k) => `<button data-a="cam" data-v="${k}" title="${TV_CAM_NAME[k]}">${{ auto: 'DIRECTOR', track: 'TRACK', tcam: 'ONBOARD', heli: 'HELI', rear: 'REAR' }[k]}</button>`).join('')}</div>
        <div class="row" data-g="cam2"><span></span>${['helmet', 'kerb', 'crane', 'drone'].map((k) => `<button data-a="cam" data-v="${k}" title="${TV_CAM_NAME[k]}">${{ helmet: 'HELMET', kerb: 'KERB', crane: 'CRANE', drone: 'DRONE' }[k]}</button>`).join('')}</div>
        <div class="row" data-g="def"><span>SET-UP</span><button data-a="def" data-v="save" title="Keep the pit wall as it is now - tyres, fuel, ERS, every order, who makes the calls, the camera - for the start of every race from here on">SAVE AS MY DEFAULT</button><button data-a="def" data-v="clear" title="Forget the saved set-up: every race starts on the standard one again">RESET</button></div>
        <div class="row" data-g="order"><span>TEAM</span><button data-a="order" data-v="swap" title="The car ahead lets its team-mate through">SWAP</button><button data-a="order" data-v="hold" title="The car behind stays behind">HOLD</button><button data-a="order" data-v="free" title="Call the order off: race each other">RACE</button></div>
        <div class="radio"></div>
      </div>${card(C[1] || C[0], 1)}<button class="tog" data-a="min">PIT WALL ▾</button><button class="tog tg2" data-a="cpt" title="Compact: each instruction shows only its setting until you point at it">${this.el.classList.contains('cpt') ? 'FULL' : 'COMPACT'}</button>`;
    }
    this.el.classList.remove('hidden', 'min');
    this.radio('Pit wall', `Both cars on the grid. ${this.cars.map((c) => `${surname(c)} on ${c.tyres.compound.toLowerCase()}s`).join(', ')}.`);
  }
  close() { this.el.classList.add('hidden'); this.simCard(null); }
  /** the height the panel takes (the caption sits above it) */
  height() { return this.el.classList.contains('hidden') ? 0 : this.el.offsetHeight; }
  click(e) {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.a, car = b.dataset.k != null ? this.cars[+b.dataset.k] : null;
    if (a === 'cpt') { const on = this.el.classList.toggle('cpt'); b.textContent = on ? 'FULL' : 'COMPACT'; try { localStorage.setItem('f1sim-pw-compact', on ? '1' : '0'); } catch (e) { /* not kept */ } return; }
    if (a === 'min') { this.el.classList.toggle('min'); b.textContent = this.el.classList.contains('min') ? 'PIT WALL ▴' : 'PIT WALL ▾'; return; }
    if (a === 'cmp') { car.mgr.next = b.dataset.v; if (car.mgr.preRace) this.act('start', car, b.dataset.v); this.acc = 1; return; }
    if (a === 'box') { if (car.pitRequested && !car.pitLane) this.act('stay', car); else this.act('box', car, car.mgr.next); this.acc = 1; return; }
    if (a === 'pg') { b.closest('.car').dataset.pg = b.dataset.v; this.acc = 1; return; }
    if (a === 'ord') this.act('ord', car, b.dataset.g, b.dataset.v);
    else if (a === 'alert') this.act('alert', car, b.dataset.v);
    else if (a === 'replan') this.act('replan', car);
    else if (a === 'mode') this.act('mode', car, b.dataset.g, b.dataset.v);
    else if (a === 'fuel') this.act('fuel', car, +b.dataset.v);
    else if (a === 'strat') this.act('strat', car, b.dataset.v);
    else if (a === 'speed') this.act('speed', +b.dataset.v);
    else if (a === 'pause') this.act('pause');
    else if (a === 'sim') this.act('sim', +b.dataset.v);
    else if (a === 'cam') this.act('cam', b.dataset.v);
    else if (a === 'def') this.act('def', b.dataset.v);
    else if (a === 'follow') this.act('follow', car);
    else if (a === 'order') this.act('order', b.dataset.v);
    this.acc = 1;
  }
  /** a line on the radio (who, what) - the last two kept */
  radio(who, text) {
    this.radioLines.push(`<b>${esc(who)}:</b> ${esc(text)}`); if (this.radioLines.length > 2) this.radioLines.shift();
    const r = this.el.querySelector('.radio'); if (r) r.innerHTML = this.radioLines.join('<br>');
  }
  /** the "simulating" card (text, or null to take it down) */
  simCard(text, sub = 'every car from where it is now') {
    if (!text) { this.sim.style.display = 'none'; return; }
    this.sim.innerHTML = `${esc(text)}<small>${esc(sub)}</small>`; this.sim.style.display = 'flex';
  }
  /** a button group's selection */
  mark(scope, sel, pred) { for (const b of scope.querySelectorAll(sel)) { const on = !!pred(b); if (b.classList.contains('on') !== on) b.classList.toggle('on', on); } }
  setText(el, t) { if (el && el.textContent !== t) el.textContent = t; }
  /** 4 times a second: the cards and the controls from the race */
  update(dt, st) {
    this.acc += dt; if (this.acc < 0.25) return; this.acc = 0;
    const d = st.d; if (!d) return;
    const P = d.positions, racing = d.world.racing;
    this.mark(this.el, '[data-a="speed"]', (b) => !st.paused && +b.dataset.v === st.speed);
    this.mark(this.el, '[data-a="pause"]', () => st.paused);
    this.mark(this.el, '[data-a="cam"]', (b) => b.dataset.v === st.cam);
    const green = !d.sc || d.sc.phase === 'green';
    for (const b of this.el.querySelectorAll('[data-a="sim"]')) b.disabled = !racing || d.done || (+b.dataset.v > 0 && !green);
    const order = st.order;
    this.mark(this.el, '[data-a="order"]', (b) => order && order.type === b.dataset.v);
    for (let k = 0; k < this.cars.length && k < 2; k++) {
      const c = this.cars[k], card = this.el.querySelector(`.car[data-k="${k}"]`); if (!card) continue;
      const i = P.indexOf(c), m = c.mgr;
      this.setText(card.querySelector('.ps'), c.retired ? 'OUT' : `P${i + 1}`);
      const ahead = i > 0 ? P[i - 1] : null, behind = P[i + 1];
      const ga = ahead && !c.retired ? d.radio?.gap?.(c, ahead) : null, gb = behind && !behind.retired && !c.retired ? d.radio?.gap?.(behind, c) : null;
      this.setText(card.querySelector('.gp'), c.retired ? (c.retireReason || 'Retired') : `${ahead ? `▲ ${ga != null && ga > 0 ? ga.toFixed(1) : '-'} ${surname(ahead)}` : 'LEADING'}${behind ? `   ▼ ${gb != null && gb > 0 ? gb.toFixed(1) : '-'} ${surname(behind)}` : ''}`);
      const t = c.tyres, comp = t.compound, laps = st.tyreLaps(c), wear = Math.min(1, t.wear || 0);
      const ty = card.querySelector('.tyre i'); ty.style.borderColor = COMPOUNDS[comp].color; this.setText(ty, LETTER[comp]);
      this.setText(card.querySelector('.tl'), `${laps} LAP${laps === 1 ? '' : 'S'}`);
      const u = card.querySelector('.wear u'); u.style.transform = `scaleX(${(1 - wear).toFixed(3)})`; u.style.background = wear > CLIFF ? '#e10600' : wear > 0.5 ? '#ffd400' : '#2fbf4f';
      // (laps to the cliff at the rate this set is wearing: the AI's measure of its last lap, else the nominal rate)
      const per = c.ai?._wPerLap > 0 && c.ai._wTyres === t ? c.ai._wPerLap : 1 / Math.max(1, cliffLaps(comp, c.raceLaps) / CLIFF);
      const kb = st.lifeK ? st.lifeK(c) : 1, toCliff = Math.max(0, (CLIFF - wear) / Math.max(1e-4, per)) * kb, sure = kb === 1;   // (lifeK: without a tyre run in practice the pit wall's idea of the life is off - race/TeamWeekend.js)
      this.setText(card.querySelector('.wp'), `${Math.round(wear * 100)}%${!c.retired && racing ? ` · cliff ${wear >= CLIFF ? 'NOW' : `~${toCliff < 10 ? toCliff.toFixed(sure ? 1 : 0) : Math.round(toCliff)} laps${sure ? '' : '?'}`}` : ''}`);
      card.querySelector('.wp').className = `wp${wear > 0.6 ? ' warnc' : ''}`;
      const last = c.lapTimes?.[c.lapTimes.length - 1];
      this.setText(card.querySelector('.lt'), `LAST ${fmtLap(last)} · BEST ${fmtLap(c.bestLap)}`);
      const dm = c.dmg || {}, worst = Math.max(dm.fwL || 0, dm.fwR || 0, dm.rw || 0, dm.susp || 0, dm.eng || 0);
      this.setText(card.querySelector('.dm'), worst > 0.12 ? `DAMAGE ${[(dm.fwL || 0) + (dm.fwR || 0) > 0.2 ? 'front wing' : null, dm.rw > 0.12 ? 'rear wing' : null, dm.susp > 0.12 ? 'suspension' : null, dm.eng > 0.12 ? 'engine' : null].filter(Boolean).join(', ')}` : c.punct != null ? 'PUNCTURE' : '');
      this.mark(card, '[data-a="mode"]', (b) => b.dataset.v === m.modes?.[b.dataset.g]);
      this.mark(card, '[data-a="ord"]', (b) => b.dataset.v === m.orders?.[b.dataset.g]);
      this.mark(card, '[data-a="pg"]', (b) => b.dataset.v === card.dataset.pg);
      // (a question from the pit wall or the driver: an undercut on, rain coming, "are you sure?" - YES / NO)
      { const al = card.querySelector('.alert'), A = m.alert; al.classList.toggle('on', !!A); if (A) { this.setText(al.firstElementChild, A.text); al.children[1].textContent = A.yes || 'YES'; al.children[2].textContent = A.no || 'NO'; } }
      // fuel: what is in the car against what the rest of the race needs at the standard mixture, in laps (+: a margin)
      if (c.fuel != null) {
        const fu = card.querySelector('.fu'), dl = st.fuelDelta?.(c) ?? 0;
        const fk = st.fuelSure ? st.fuelSure(c) : true;
        this.setText(fu, `FUEL ${c.fuel.toFixed(1)} kg · ${fk ? '' : '~'}${dl >= 0 ? '+' : ''}${dl.toFixed(1)} lap${Math.abs(dl) === 1 ? '' : 's'}`); fu.className = `fu${dl < -0.15 ? ' dmg' : dl < 0.1 ? ' warnc' : ''}`;
      }
      card.querySelector('[data-g="fload"]').style.display = m.preRace && c.fuel != null ? '' : 'none';
      this.mark(card, '[data-a="strat"]', (b) => b.dataset.v === (m.calls || (m.manual ? 'you' : 'ai')));
      m.preRace = !racing && !d.leaderFinished;
      this.setText(card.querySelector('.cl'), m.preRace ? 'START ON' : 'BOX FOR');
      this.mark(card, '[data-a="cmp"]', (b) => b.dataset.v === (m.preRace ? comp : m.next));
      if (st.sets) { const S = st.sets(c); if (S) for (const b of card.querySelectorAll('[data-a="cmp"]')) { const n = String((S[b.dataset.v] || []).length); if (b.dataset.n !== n) b.dataset.n = n; } }
      const bx = card.querySelector('.bx'), inLane = c.pitLane || c.inPit;
      bx.disabled = c.retired || c.finished || m.preRace || (inLane && !c.pitRequested) || d.done;
      this.setText(bx, inLane ? 'IN PIT' : c.pitRequested ? 'STAY OUT' : 'BOX');
      bx.classList.toggle('on', !!c.pitRequested);
      for (const b of card.querySelectorAll('[data-a="mode"],[data-a="ord"],[data-a="strat"],[data-a="cmp"]')) b.disabled = c.retired || c.finished || (b.dataset.a !== 'cmp' && d.done) || (b.dataset.v === 'plan' && !m.plan);
      // the note: what is going on with this car
      const plan = c.pitPlan || c.ai?.pitPlan;
      // (the plan, short: 'Plan B · S → M L9 → H L17' - the stops still to come)
      const PL = m.plan, k0 = PL ? Math.min(c.pitStops, PL.stints.length - 1) : 0;
      const planTxt = PL ? `${PL.name} · ${PL.stints.slice(k0).map((x, j) => (j ? `${LETTER[x.compound]} L${x.start}` : LETTER[x.compound])).join(' → ')}` : '';
      const who = m.calls === 'plan' ? `following ${planTxt}` : m.calls === 'you' ? 'you make the calls' : 'the AI strategist makes the calls';
      const note = c.retired ? `Out of the race · ${c.retireReason || ''}` : c.finished ? 'Finished' : m.preRace ? `Starts on ${comp.toLowerCase()}s · ${who}`
        : inLane ? `In the pit lane${plan ? ` · ${plan.compound.toLowerCase()}s${plan.repair && plan.repair !== 'none' ? ' and repairs' : ''}` : ''}`
        : c.pitRequested ? `Boxing this lap for ${(plan?.compound || m.next).toLowerCase()}s${!m.manual && c.ai?.pitReason && c.ai.pitReason !== 'manager' ? ` · the strategist's call (${c.ai.pitReason})` : ''}`
        : m.holdLap === c.lap ? 'Staying out this lap' : m.calls === 'plan' && PL ? `${c.pitStops} stop${c.pitStops === 1 ? '' : 's'} · ${planTxt}` : st.mustStop(c) ? `${c.pitStops} stops · the mandatory stop is still to make` : `${c.pitStops} stop${c.pitStops === 1 ? '' : 's'} · tyres ${MODES.tyre[m.modes?.tyre || 'std'].label.toLowerCase()}, fuel ${MODES.fuel[m.modes?.fuel || 'std'].label.toLowerCase()}, ERS ${MODES.ers[m.modes?.ers || 'bal'].label.toLowerCase()}`;
      this.setText(card.querySelector('.note'), note);
    }
  }
}
