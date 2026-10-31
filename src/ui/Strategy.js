// Race strategy, before the start: the plans worked out from the same tyre model the cars race on (vehicle/Tyres.js -
// each compound's life for this race distance, the seconds it loses a lap as it wears, the cliff, its pace, and the cold
// out-lap on a new set), the pit lane's time loss here,
// the race length and the rules (a dry race of 12 laps or more must use two dry compounds). Every no-stop, one-stop
// and two-stop plan is timed lap by lap and the best of each are offered: Plan A (the quickest), B and C, with the
// stint bars, the predicted race time against A, the box laps (the first stop's lap can be moved), and what the rest
// of the field is starting on. Chosen, it is yours for the race: you start on its tyre and the engineer calls each
// stop on its lap (main.js strategyCalls) - box this lap, the next compound already set; P stays out.
import { COMPOUNDS, cliffLaps, lapLoss, outLapLoss } from '../vehicle/Tyres.js';
import { ensureMotion, reduced, keys, open, close } from './Motion.js';

const DRY = ['SOFT', 'MEDIUM', 'HARD'];
const RATE = 1.05;   // (the wear rate on a racing lap, against the nominal: the AI's, measured 0.98-1.08 - TyreSet.update)

/**
 * The plans. o: { laps, trackLength, pace (a clean lap, s), pitLoss (s), wet (0..1) } -> [{ name, label, stints:
 * [{ compound, start, end }], time, stops }] (the best three, quickest first), and the stint model for re-timing
 */
export function planRace(o) {
  const L = Math.max(1, Math.round(o.laps)), T0 = o.pace, wet = o.wet || 0;
  const comps = wet > 0.5 ? ['WET', 'INTER'] : wet > 0.2 ? ['INTER', 'WET', 'SOFT'] : DRY;
  const wearMul = (c) => { const k = COMPOUNDS[c]; return k.dryWear ? 1 + (k.dryWear - 1) * Math.max(0, Math.min(1, (k.wetFrom - wet) / k.wetFrom)) : 1; };   // (a rain tyre on a track too dry for it - TyreSet.update)
  const life = (c) => cliffLaps(c, L) / (RATE * wearMul(c));   // (laps to the cliff)
  const gripIn = (c) => { const s = COMPOUNDS[c]; return s.grip * (1 - wet) + s.wetGrip * wet * s.grip; };
  const best = Math.max(...comps.map(gripIn));
  // (a compound's pace: its grip against the best for the conditions, as a lap time answers grip - vehicle/Tyres.js)
  const paceOf = (c) => { const g = 1 - gripIn(c) / best; return T0 * (0.405 * g + 1.53 * g * g); };
  // a stint's lap times: the pace, the seconds lost as the set wears (to the cliff, then the ramp; a set worn through
  // is not a plan), and its cold start - a new set off the blankets, the first stint as the formation lap leaves it
  const pre = {};
  for (const c of comps) {
    const a = [0], per = 0.7 / life(c);
    for (let n = 1; n <= L; n++) { const w = (n - 0.5) * per; a.push(w > 1 ? Infinity : a[n - 1] + T0 + paceOf(c) + lapLoss(c, w, L)); }
    pre[c] = { sum: a, life: life(c) };
  }
  const stint = (c, n, first) => pre[c].sum[n] + (first ? outLapLoss(c, T0, COMPOUNDS[c].start) : outLapLoss(c, T0));
  const two = wet < 0.2 && L >= 12;   // (the rule: two dry compounds in a dry race of any length)
  const out = [];
  // (8 laps or more: a stop is mandatory - RaceDirector adds 30 s at the flag to a car that never made one)
  const add = (stints, time) => { if (!isFinite(time)) return; if (L >= 8 && stints.length < 2) return; if (two && new Set(stints.map((s) => s.compound)).size < 2) return; out.push({ stints, time, stops: stints.length - 1 }); };
  for (const c of comps) add([{ compound: c, start: 1, end: L }], stint(c, L, true));
  for (const a of comps) for (const b of comps) {
    let best = Infinity, bk = 0; for (let k = 1; k < L; k++) { const t = stint(a, k, true) + stint(b, L - k, false) + o.pitLoss; if (t < best) { best = t; bk = k; } }
    if (bk) add([{ compound: a, start: 1, end: bk }, { compound: b, start: bk + 1, end: L }], best);
  }
  if (L >= 8) for (const a of comps) for (const b of comps) for (const c of comps) {
    let best = Infinity, k1b = 0, k2b = 0;
    for (let k1 = 2; k1 < L - 2; k1++) for (let k2 = k1 + 2; k2 < L; k2++) { const t = stint(a, k1, true) + stint(b, k2 - k1, false) + stint(c, L - k2, false) + 2 * o.pitLoss; if (t < best) { best = t; k1b = k1; k2b = k2; } }
    if (k1b) add([{ compound: a, start: 1, end: k1b }, { compound: b, start: k1b + 1, end: k2b }, { compound: c, start: k2b + 1, end: L }], best);
  }
  out.sort((p, q) => p.time - q.time);
  if (L < 8 && out.some((p) => !p.stops)) for (let i = out.length - 1; i >= 0; i--) if (out[i].stops) out.splice(i, 1);   // (a sprint: nobody stops if they don't have to)
  // A: the quickest; B: the quickest with a different number of stops; C: the quickest with a different start tyre
  const picks = [];
  if (out[0]) picks.push(out[0]);
  const b = out.find((p) => p.stops !== picks[0]?.stops) || out.find((p) => p !== picks[0]); if (b) picks.push(b);
  const c = out.find((p) => !picks.includes(p) && p.stints[0].compound !== picks[0]?.stints[0].compound); if (c) picks.push(c);
  for (const p of out) { if (picks.length >= 3) break; if (!picks.includes(p)) picks.push(p); }
  picks.forEach((p, i) => { p.name = 'ABC'[i]; p.label = label(p); p.laps = L; });
  return { plans: picks, retime: (stints) => stints.reduce((t, s, i) => t + stint(s.compound, s.end - s.start + 1, i === 0), 0) + (stints.length - 1) * o.pitLoss, life: (c) => pre[c]?.life || life(c), two };
}
function label(p) {
  const n = ['No-stop', 'One-stop', 'Two-stop', 'Three-stop'][p.stops] || `${p.stops}-stop`;
  return `${n}: ${p.stints.map((s) => s.compound.toLowerCase()).join(' → ')}`;
}

// ---- the screen ---------------------------------------------------------------------------------------------------
// A kit sheet over the grid (no backdrop blur): the weekend's rail on top (STRATEGY now), the engineer's word, the three
// plans as cards built once and then changed in place (the stint bars grow and shrink, the box-lap labels glide, the
// times cross-fade), what the field starts on, and CONFIRM pinned at the foot. Everything fits a 1366x768 screen; on a
// phone the cards become a strip to swipe.
const CSS = `
#strategy.k-layer { z-index: 46; --k-scrim: rgba(3,4,8,.86); text-align: left; font-family: var(--k-font); }
#strategy * { box-sizing: border-box; }
#strategy .st-box { --w: 1000px; grid-template-rows: auto minmax(0,1fr) auto; grid-template-columns: minmax(0,1fr); padding: 18px 24px 0; color: #eef1f5; }
#strategy .st-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; flex-wrap: wrap; padding-bottom: 12px; border-bottom: 1px solid var(--k-line); }
#strategy .st-ttl { min-width: 0; }
#strategy .st-h { font: 900 28px/1 var(--k-font); letter-spacing: .08em; margin: 0; }
#strategy .st-h span { color: #e10600; }
#strategy .st-sub { color: #9aa3b2; font: 600 12.5px/1.4 var(--k-font); letter-spacing: .12em; margin-top: 6px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#strategy .st-rail { display: flex; align-items: center; gap: 6px; list-style: none; margin: 4px 0 0; padding: 0; font: 700 10.5px/1 var(--k-font); letter-spacing: .14em; text-transform: uppercase; color: var(--k-dim); }
#strategy .st-rail li { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
#strategy .st-rail li + li::before { content: ""; width: 22px; height: 2px; border-radius: 1px; background: var(--k-line); margin-right: 2px; transform-origin: left center; }
#strategy .st-rail li.done::before, #strategy .st-rail li.on::before { background: #e10600; }
#strategy .st-rail li.on::before { animation: m-grow var(--m-slow) var(--ease-out) both; }
#strategy .st-rail i { width: 8px; height: 8px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--k-dim); }
#strategy .st-rail li.done { color: #b9c0cc; } #strategy .st-rail li.done i { background: #b9c0cc; box-shadow: none; }
#strategy .st-rail li.on { color: #fff; } #strategy .st-rail li.on i { background: #e10600; box-shadow: 0 0 0 3px rgba(225,6,0,.3); }
#strategy .st-body { display: flex; flex-direction: column; gap: 12px; min-height: 0; overflow: hidden; padding: 14px 0; }
#strategy .st-eng { flex: none; background: rgba(255,255,255,.05); border-left: 3px solid #e10600; border-radius: 0 8px 8px 0; padding: 9px 12px; font: 500 14.5px/1.45 var(--k-font); }
#strategy .st-eng b { color: #e10600; letter-spacing: .1em; font-size: 11px; display: block; margin-bottom: 2px; }
#strategy .st-cards { flex: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; align-items: stretch; padding-top: 4px; }
#strategy .st-card { display: flex; flex-direction: column; position: relative; min-width: 0; margin: 0; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 14px; cursor: pointer; outline: none;
  transition: transform var(--m-fast) var(--ease-out), border-color var(--m-fast), background-color var(--m-fast); }
#strategy .st-card.in { animation: m-in-up var(--m-base) var(--ease-out) both; animation-delay: calc(var(--n, 0) * 2.5 * var(--m-stagger)); }
#strategy .st-card:hover { background-color: rgba(255,255,255,.075); }
#strategy .st-card.st-sel { border-color: #e10600; background-color: rgba(225,6,0,.1); transform: translate3d(0,-3px,0); }
#strategy .st-card:focus-visible { border-color: var(--k-focus); }
#strategy .st-nm { display: flex; align-items: center; gap: 10px; min-height: 26px; }
#strategy .st-nm b { flex: none; font: 900 24px/1 var(--k-font); color: #e10600; }
#strategy .st-nm span { flex: 1; min-width: 0; font: 700 14px/1.25 var(--k-font); }
#strategy .st-nm kbd { flex: none; align-self: flex-start; }
#strategy .st-bar { display: flex; width: 100%; height: 22px; border-radius: 5px; overflow: hidden; margin: 12px 0 0; background: #111; }
#strategy .st-bar i { display: flex; align-items: center; justify-content: center; flex: 1 1 0; min-width: 0; font: 800 11px/1 var(--k-font); font-style: normal; color: #111; border-right: 2px solid #0b0c0f; overflow: hidden;
  transition: flex-grow var(--m-base) var(--ease-out); }
#strategy .st-bar i:last-child { border-right: 0; }
#strategy .st-win { position: relative; height: 4px; margin: 3px 0 4px; }
#strategy .st-win u { position: absolute; top: 0; bottom: 0; border-radius: 2px; background: rgba(255,255,255,.22); }
#strategy .st-laps { position: relative; height: 13px; font: 600 11px/1 var(--k-font); color: #8c93a0; white-space: nowrap; }
#strategy .st-laps > b { position: absolute; top: 0; font-weight: 600; } #strategy .st-laps > b.a { left: 0; } #strategy .st-laps > b.z { right: 0; }
/* (a box-lap label: a full-width layer moved by transform, so its position glides without animating 'left') */
#strategy .st-stop { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; transform: translate3d(calc(var(--p, 0) * 100%), 0, 0); transition: transform var(--m-base) var(--ease-out); }
#strategy .st-stop em { position: absolute; left: 0; top: 0; transform: translateX(-50%); font-style: normal; color: #cfd5df; }
#strategy .st-t { margin-top: 10px; font: 800 16px/1.3 var(--k-font); }
#strategy .st-t.sw { animation: m-fade 120ms var(--ease-out) both; }
#strategy .st-t small { display: block; color: #9aa3b2; font-weight: 500; font-size: 12.5px; margin-top: 3px; }
#strategy .st-adj { display: flex; align-items: center; gap: 8px; margin-top: auto; padding-top: 12px; font: 600 12px/1 var(--k-font); color: #b9c0cc; white-space: nowrap; }
#strategy .st-adj b { font: 800 13px/1 var(--k-font); color: #fff; min-width: 44px; text-align: center; }
#strategy .st-adj small { margin-left: auto; color: #8c93a0; font: 600 11px/1 var(--k-font); overflow: hidden; text-overflow: ellipsis; }
#strategy .st-adj button { display: inline-flex; align-items: center; justify-content: center; flex: none; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.18); color: #fff; border-radius: 6px; width: 26px; height: 24px; min-width: 0; padding: 0; margin: 0; cursor: pointer; font: 800 14px/1 var(--k-font); box-shadow: none; }
#strategy .st-field { flex: none; font: 600 12.5px/1.5 var(--k-font); color: #b9c0cc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#strategy .st-field i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin: 0 5px 0 12px; vertical-align: -1px; }
#strategy .st-foot { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 12px 0 16px; border-top: 1px solid var(--k-line); }
#strategy .st-keys { font: 600 11.5px/1.2 var(--k-font); color: var(--k-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#strategy .st-keys kbd { margin: 0 2px; }
#strategy .st-ok { display: inline-flex; align-items: center; flex: none; width: auto; height: 46px; min-width: 0; margin: 0; background: #e10600; color: #fff; border: 0; border-radius: 10px; padding: 0 24px; font: 900 13px/1 var(--k-font); letter-spacing: .14em; cursor: pointer; box-shadow: none; transition: transform var(--m-press) var(--ease-out); }
#strategy .st-ok:active { transform: scale(.97); }
@media (max-height: 640px) { #strategy .st-eng { font-size: 13.5px; padding: 7px 10px; } #strategy .st-t { margin-top: 6px; } #strategy .st-body { gap: 8px; padding: 10px 0; } }
@media (max-width: 640px) {
  #strategy .st-box { grid-template-rows: auto auto minmax(0,1fr) auto; padding: 0 16px; }
  #strategy .st-cards { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 86%; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; scrollbar-width: none; padding: 4px 0 2px; }
  #strategy .st-card { scroll-snap-align: center; }
  #strategy .st-keys { display: none; } #strategy .st-ok { flex: 1; justify-content: center; }
  #strategy .st-rail { gap: 4px; letter-spacing: .06em; font-size: 10px; } #strategy .st-rail li { gap: 4px; } #strategy .st-rail li + li::before { width: 10px; }
  #strategy .st-field { white-space: normal; }
}
`;
const fmt = (s) => { const m = Math.floor(s / 60), r = s - m * 60; return `${m}:${r.toFixed(1).padStart(4, '0')}`; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/**
 * The laps the first stop could be moved to for less than a second (the other stops held where they are), the pit
 * window under the bar -> { a, b } (laps) or null
 */
function pitWindow(R, p) {
  if (!p.stops) return null;
  const s0 = p.stints[0], s1 = p.stints[1], T = [];
  for (let k = 1; k < s1.end; k++) {
    const t = R.retime([{ ...s0, end: k }, { ...s1, start: k + 1 }, ...p.stints.slice(2)]);
    if (isFinite(t)) T.push([k, t]);
  }
  if (!T.length) return null;
  const best = Math.min(...T.map((x) => x[1])), ok = T.filter((x) => x[1] - best < 1.0).map((x) => x[0]);
  return { a: Math.min(...ok), b: Math.max(...ok) };
}

/**
 * The strategy screen. o: { laps, trackName, trackLength, pace, pitLoss, wet, night, field: [compounds the others start
 * on], gridPos, onDone(plan) } - Enter confirms; 1-3 or up/down choose a plan; left/right move its first stop; click.
 */
export function showStrategy(o) {
  ensureMotion();
  if (!document.getElementById('strategy-css')) { const st = document.createElement('style'); st.id = 'strategy-css'; st.textContent = CSS; document.head.appendChild(st); }
  const R = planRace(o), plans = R.plans; if (!plans.length) { o.onDone?.(null); return; }
  const el = document.createElement('div'); el.id = 'strategy'; el.className = 'k-layer hidden'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Race strategy');
  // (the grid behind needs drawing only every other frame while this covers it: main.js reads data-freeze on m:open)
  el.dataset.freeze = 'slow';
  const cond = o.wet > 0.5 ? 'wet' : o.wet > 0.2 ? 'damp' : 'dry';
  const counts = {}; for (const c of o.field || []) counts[c] = (counts[c] || 0) + 1;
  const A = plans[0], softLife = Math.round(R.life(o.wet > 0.2 ? (o.wet > 0.5 ? 'WET' : 'INTER') : 'SOFT'));
  const advice = o.laps < 6 ? `It's a sprint. The tyres will just about last it - nobody should be stopping. Start on what gives you the best first lap.`
    : `We like Plan A: ${A.label.toLowerCase()}${A.stops ? `, boxing on lap ${A.stints[0].end}` : ''}. The ${o.wet > 0.2 ? 'inters' : 'softs'} are good for about ${softLife} laps before they fall away${R.two ? ', and the rules say two different dry compounds' : ''}. The stop costs us about ${o.pitLoss.toFixed(0)} seconds here.`;
  // (each card once: the bars, the box-lap labels, the window; sync() changes them in place after that)
  const card = (p, i) => {
    const w = pitWindow(R, p), L = p.laps;
    return `<div class="st-card in" role="button" tabindex="0" data-i="${i}" style="--n:${i}" aria-pressed="false">
      <div class="st-nm"><b>${p.name}</b><span class="st-lb"></span><kbd class="k-kbd">${i + 1}</kbd></div>
      <div class="st-bar">${p.stints.map((s) => `<i style="flex-grow:${s.end - s.start + 1};background:${COMPOUNDS[s.compound].color}">${s.compound[0]}</i>`).join('')}</div>
      <div class="st-win">${w ? `<u style="left:${((w.a - 0.5) / L) * 100}%;width:${(Math.max(1, w.b - w.a + 1) / L) * 100}%" title="Pit window: box between laps ${w.a} and ${w.b} for less than a second"></u>` : ''}</div>
      <div class="st-laps"><b class="a">L1</b>${p.stints.slice(0, -1).map(() => '<span class="st-stop"><em></em></span>').join('')}<b class="z">L${L}</b></div>
      <div class="st-t"><span class="st-dt"></span><small class="st-pt"></small></div>
      ${p.stops ? `<div class="st-adj">First stop <button data-d="-1" aria-label="Box a lap earlier">−</button><b></b><button data-d="1" aria-label="Box a lap later">+</button>${w ? `<small>window L${w.a}${w.b > w.a ? `-${w.b}` : ''}</small>` : ''}</div>` : ''}
    </div>`;
  };
  el.innerHTML = `<div class="k-sheet st-box">
    <header class="st-head"><div class="st-ttl"><div class="st-h">RACE <span>STRATEGY</span></div><div class="st-sub">${esc(o.trackName)} · ${o.laps} laps · ${cond}${o.night ? ' · night' : ''}${o.gridPos ? ` · starting P${o.gridPos}` : ''}</div></div>
      <ol class="st-rail" aria-label="The weekend"><li class="done"><i></i>Practice</li><li class="done"><i></i>Qualifying</li><li class="on" aria-current="step"><i></i>Strategy</li><li><i></i>Race</li></ol></header>
    <div class="st-body"><div class="st-eng"><b>RACE ENGINEER</b>${esc(advice)}</div>
      <div class="st-cards" data-scroll-ok>${plans.map(card).join('')}</div>
      <div class="st-field">The field starts on:${Object.entries(counts).map(([c, n]) => `<i style="background:${COMPOUNDS[c]?.color || '#888'}"></i>${n} ${c.toLowerCase()}`).join('')}</div></div>
    <footer class="st-foot"><span class="st-keys"><kbd class="k-kbd">1</kbd><kbd class="k-kbd">2</kbd><kbd class="k-kbd">3</kbd> plan · <kbd class="k-kbd">←</kbd><kbd class="k-kbd">→</kbd> first stop · <kbd class="k-kbd">Enter</kbd> confirm</span><button class="st-ok">CONFIRM · TO THE GRID ▸</button></footer></div>`;
  document.body.appendChild(el);
  const cards = [...el.querySelectorAll('.st-card')], strip = el.querySelector('.st-cards'), t0 = performance.now();
  // (the entrance comes off once played, so the chosen card's lift can move freely)
  setTimeout(() => cards.forEach((c) => c.classList.remove('in')), 420);
  let sel = 0;
  const sync = (fadeTimes) => {
    for (const p of plans) p.time = R.retime(p.stints);
    const best = Math.min(...plans.map((q) => q.time));
    plans.forEach((p, i) => {
      const C = cards[i], d = p.time - best;
      C.querySelector('.st-lb').textContent = label(p);
      C.querySelectorAll('.st-bar i').forEach((x, k) => { x.style.flexGrow = String(p.stints[k].end - p.stints[k].start + 1); });
      C.querySelectorAll('.st-stop').forEach((x, k) => { x.style.setProperty('--p', String(p.stints[k].end / p.laps)); x.firstChild.textContent = `box L${p.stints[k].end}`; });
      const lap = C.querySelector('.st-adj b'); if (lap) lap.textContent = `lap ${p.stints[0].end}`;
      const dt = d < 0.05 ? 'Quickest' : `+${d.toFixed(1)} s`;
      const pt = `Predicted race time ${fmt(p.time)}${p.stops ? ` · ${p.stops} stop${p.stops > 1 ? 's' : ''}` : ' · no stop'}${p.stints.some((s) => s.end - s.start + 1 > R.life(s.compound) * 0.92) ? ' · on the edge of the tyres' : ''}`;
      const T = C.querySelector('.st-t');
      if (T.dataset.k !== dt + pt) {
        T.dataset.k = dt + pt; T.querySelector('.st-dt').textContent = dt; T.querySelector('.st-pt').textContent = pt;
        if (fadeTimes && !reduced()) { T.classList.remove('sw'); void T.offsetWidth; T.classList.add('sw'); }
      }
      C.classList.toggle('st-sel', i === sel); C.setAttribute('aria-pressed', String(i === sel));
    });
  };
  const choose = (i) => {
    if (!plans[i] || i === sel) return;
    sel = i; sync(false);
    // (on a phone the cards are a strip: bring the chosen one into view)
    if (strip.scrollWidth > strip.clientWidth + 1) cards[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
  };
  /** the chosen plan's first stop a lap earlier (-1) or later (+1), never past its second stint's last lap */
  const move = (i, dd) => {
    const p = plans[i]; if (!p?.stops) return;
    const s0 = p.stints[0], s1 = p.stints[1], ne = Math.max(1, Math.min(s1.end - 1, s0.end + dd)); if (ne === s0.end) return;
    s0.end = ne; s1.start = ne + 1; sync(true);
  };
  sync(false);
  el.addEventListener('click', (e) => {
    if (e.target.closest('.st-ok')) { done(); return; }
    const C = e.target.closest('.st-card'); if (!C) return;
    const i = +C.dataset.i, b = e.target.closest('button[data-d]');
    if (b) { if (i !== sel) choose(i); move(i, +b.dataset.d); } else choose(i);
  });
  let over = false, unkeys = null;   // (once: Enter on the focused button is a key and a click, a double click is two)
  const done = () => {
    if (over) return; over = true; unkeys?.();
    close(el, () => el.remove());
    const p = plans[sel]; p.label = label(p); o.onDone?.(p);
  };
  // (the keys: only this screen hears them while it is up; a held Enter from the screen before does not confirm it)
  unkeys = keys(el, {
    Enter: (e) => { if (e.repeat || performance.now() - t0 < 400) return; done(); },
    ' ': (e) => { const C = e.target?.closest?.('.st-card'); if (C) choose(+C.dataset.i); else return 'pass'; },
    ArrowUp: () => choose((sel + plans.length - 1) % plans.length), ArrowDown: () => choose((sel + 1) % plans.length),
    ArrowLeft: () => move(sel, -1), ArrowRight: () => move(sel, 1),
    1: () => choose(0), 2: () => choose(1), 3: () => choose(2),
  });
  // (from the hub's "sim qualifying" the loading screen may still be up: the sheet then arrives as it lifts)
  open(el, 'layer');
}
