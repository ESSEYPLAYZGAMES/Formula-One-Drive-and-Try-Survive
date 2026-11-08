// The team principal's car set-up (main.js TP: before qualifying), as F1 Manager has it: five controls - the front
// wing, the rear wing, the anti-roll bars' balance, the camber, the toe - and five things the driver feels and tells
// the engineers - oversteer (or understeer), braking stability, cornering, traction, straight-line speed - each made of
// several controls at once. Every circuit has its own ideal for each car (and each driver a preference of their own);
// a team principal's career keeps what was run at each circuit as the next visit's starting point (the ideal moves a
// little with every season's car). A practice run - six a car a weekend - brings the driver's feedback on each of the
// five: how far off, which way, within a window that narrows with every run (narrower with a better driver-in-the-loop
// simulator). The set-up's satisfaction is how close the five are to optimal; in qualifying and the race it is pace
// (a little) and tyre wear (more): setupEffect.
//   showSetup({ cars: [{ name, color, team, x }], track, season, k (feedback quality), runs, onDone(setups) })

export const CONTROLS = [
  { id: 'fw', name: 'Front wing', lo: 'Low', hi: 'High' },
  { id: 'rw', name: 'Rear wing', lo: 'Low', hi: 'High' },
  { id: 'arb', name: 'Anti-roll balance', lo: 'Rear', hi: 'Front' },
  { id: 'cam', name: 'Camber', lo: 'Less', hi: 'More' },
  { id: 'toe', name: 'Toe-out', lo: 'Less', hi: 'More' },
];
// (each aspect, a weighted sum of the controls' distance from the ideal: + one way, - the other)
const M = [
  [0.9, -0.8, 0.4, 0.15, 0], // oversteer: more front wing, less rear, a stiffer front = more oversteer
  [0.35, -0.3, 0.2, 0, -0.7], // braking: the balance and the toe
  [0.35, 0.45, 0, 0.75, 0.2], // cornering: downforce and camber
  [-0.25, 0.65, -0.55, 0.2, 0], // traction: rear downforce, a softer rear
  [-0.45, -0.85, 0, -0.25, -0.35], // straights: the wings' drag, the camber and toe's scrub
];
export const ASPECTS = [
  { id: 'os', name: 'Oversteer', plus: 'too much oversteer', minus: 'too much understeer' },
  { id: 'brk', name: 'Braking stability', plus: 'the rear is nervous under braking', minus: 'the fronts lock under braking' },
  { id: 'cor', name: 'Cornering', plus: 'too much drag through the fast corners', minus: 'not enough grip in the corners' },
  { id: 'tra', name: 'Traction', plus: 'too sluggish out of the slow corners', minus: 'wheelspin on the exits' },
  { id: 'str', name: 'Straights', plus: 'not enough downforce, the car floats', minus: 'too slow on the straights' },
];
export const RUNS = 6;

const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return (h >>> 0) / 4294967295; };
/** the ideal set-up for a car at a circuit (its team's car this season; the driver's own preference on top) -> [5] in 0..1 */
export function idealOf(track, team, driver, season = 2026) {
  return CONTROLS.map((c, i) => {
    const base = 0.2 + 0.6 * hash(`${track}|${c.id}`), car = (hash(`${team}|${c.id}|${season}`) - 0.5) * 0.24, me = (hash(`${driver}|${c.id}`) - 0.5) * 0.08;
    return Math.max(0.03, Math.min(0.97, base + car + me));
  });
}
/** how each aspect sits against optimal for set-up x -> [5] errors (0: optimal; + / -: as ASPECTS) */
export function errorsOf(x, ideal) { return M.map((row) => row.reduce((s, w, i) => s + w * (x[i] - ideal[i]), 0)); }
/** the set-up's satisfaction 0..1 */
export function satisfaction(x, ideal) { const e = errorsOf(x, ideal); return Math.max(0, Math.min(1, 1 - e.reduce((s, v) => s + Math.abs(v), 0) * 0.85)); }
/** what a set-up does in the race: pace (a factor on the car's performance) and tyre wear - neutral at 85 % */
export function setupEffect(sat) { return { perf: 1 + (sat - 0.85) * 0.012, wear: 1 + (0.85 - sat) * 0.5 }; }
/** a practice run's feedback: each aspect's error as the driver reports it, with the window the engineers trust */
export function feedback(x, ideal, runs, k = 1) {
  const e = errorsOf(x, ideal), w = 0.32 / (1 + runs * 0.55 * k);
  return e.map((v, i) => { const est = v + (Math.random() - 0.5) * w; return { est, w, word: wordOf(est, w, ASPECTS[i]) }; });
}
function wordOf(est, w, A) {
  const a = Math.abs(est);
  if (a < Math.max(0.035, w * 0.35)) return 'Optimal';
  const how = a > 0.22 ? 'far ' : a > 0.1 ? '' : 'a little, ';
  return `${how}${est > 0 ? A.plus : A.minus}`.replace(/^a little, /, 'a touch: ');
}

const CSS = `
#setup { position: fixed; inset: 0; z-index: 47; display: flex; align-items: center; justify-content: center; background: rgba(4,6,10,.72); font-family: "Segoe UI Variable", "Segoe UI", Inter, system-ui, Roboto, sans-serif; color: #eef1f5; }
#setup .sb { width: min(1100px, calc(100vw - 24px)); max-height: calc(100vh - 24px); overflow-y: auto; background: #10131a; border: 1px solid rgba(255,255,255,.1); border-radius: 14px; padding: 16px 18px; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
#setup h2 { margin: 0; font-size: 13px; letter-spacing: .2em; color: #9aa4b2; } #setup h2 b { color: #fff; }
#setup .sp { font-size: 12.5px; color: #b7c0cc; margin: 6px 0 12px; line-height: 1.45; }
#setup .cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); gap: 12px; }
#setup .col { background: rgba(255,255,255,.04); border-radius: 10px; padding: 12px 14px; position: relative; overflow: hidden; }
#setup .col::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c); }
#setup .hd { display: flex; align-items: baseline; gap: 10px; } #setup .hd b { font-size: 16px; text-transform: uppercase; letter-spacing: .03em; }
#setup .hd .sat { margin-left: auto; font-size: 22px; font-weight: 900; } #setup .hd small { color: #9aa4b2; font-size: 11px; letter-spacing: .1em; }
#setup .ctl { display: grid; grid-template-columns: 112px 1fr 34px; gap: 4px 8px; align-items: center; margin: 10px 0; font-size: 12px; }
#setup .ctl span { color: #b7c0cc; } #setup .ctl em { font-style: normal; color: #8b95a3; font-size: 11px; text-align: right; }
#setup input[type=range] { width: 100%; accent-color: var(--c); }
#setup .fb { display: grid; grid-template-columns: 112px 1fr; gap: 5px 8px; align-items: center; font-size: 12px; }
#setup .fb span { color: #b7c0cc; }
#setup .fbb { position: relative; height: 16px; background: rgba(255,255,255,.06); border-radius: 4px; }
#setup .fbb i { position: absolute; top: 0; bottom: 0; background: rgba(54,163,255,.35); border-radius: 4px; }
#setup .fbb u { position: absolute; top: -2px; bottom: -2px; width: 3px; margin-left: -1px; background: #fff; }
#setup .fbb s { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(47,191,79,.9); }
#setup .fbt { grid-column: 2; font-size: 11px; color: #9aa4b2; margin-top: -3px; }
#setup .fbt.ok { color: #2fbf4f; }
#setup button { font: inherit; cursor: pointer; border-radius: 7px; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.06); color: #eef1f5; padding: 7px 12px; font-size: 11.5px; font-weight: 700; letter-spacing: .06em; }
#setup button.go { background: #e10600; border-color: #e10600; }
#setup button:disabled { opacity: .4; cursor: default; }
#setup .acts { display: flex; gap: 6px; margin-top: 10px; align-items: center; } #setup .acts small { color: #8b95a3; font-size: 11px; margin-left: auto; }
#setup .ft { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** the set-up screen for the team's cars; onDone([{ name, x, sat, runs }]) */
export function showSetup(o) {
  if (!document.getElementById('setup-css')) { const st = document.createElement('style'); st.id = 'setup-css'; st.textContent = CSS; document.head.appendChild(st); }
  const el = document.createElement('div'); el.id = 'setup'; document.body.appendChild(el);
  const k = o.k || 1;
  const S = o.cars.map((c) => ({ ...c, x: (c.x || [0.5, 0.5, 0.5, 0.5, 0.5]).slice(), ideal: idealOf(o.track, c.team, c.name, o.season), runs: c.runs || 0, fb: null }));
  const fbHTML = (s) => ASPECTS.map((A, i) => {
    const f = s.fb?.[i]; if (!f) return `<span>${A.name}</span><div class="fbb"><s></s></div><div class="fbt">No run yet: the driver has no feedback</div>`;
    const sc = (v) => 50 + Math.max(-48, Math.min(48, v * 120));
    return `<span>${A.name}</span><div class="fbb"><s></s><i style="left:${sc(f.est - f.w)}%;width:${Math.max(2, sc(f.est + f.w) - sc(f.est - f.w))}%"></i><u style="left:${sc(f.est)}%"></u></div><div class="fbt${f.word === 'Optimal' ? ' ok' : ''}">${esc(f.word.charAt(0).toUpperCase() + f.word.slice(1))}</div>`;
  }).join('');
  const colHTML = (s, j) => `<div class="col" data-j="${j}" style="--c:${esc(s.color)}"><div class="hd"><b>${esc(s.name)}</b><small>SET-UP SATISFACTION</small><span class="sat">${s.fb ? `${Math.round(s.shown * 100)}%` : '?'}</span></div>
    ${CONTROLS.map((c, i) => `<div class="ctl"><span>${c.name}</span><input type="range" min="0" max="100" value="${Math.round(s.x[i] * 100)}" data-i="${i}" aria-label="${c.name}"><em>${Math.round(s.x[i] * 100)}</em></div>`).join('')}
    <div class="fb">${fbHTML(s)}</div>
    <div class="acts"><button data-a="run" ${s.runs >= RUNS ? 'disabled' : ''}>PRACTICE RUN</button><small>${RUNS - s.runs} of ${RUNS} runs left</small></div></div>`;
  const draw = () => {
    el.innerHTML = `<div class="sb"><h2>PRACTICE · <b>CAR SET-UP</b> · ${esc(o.trackName || '')}</h2>
      <div class="sp">Set each car up, send it out, and read the driver's feedback: the white mark is where they feel the car is on each of the five - the green line is optimal - and the blue window how sure the engineers are (it narrows with every run${k > 1.05 ? ', faster with your simulator' : ''}). The set-up's satisfaction is pace and, more, tyre life in qualifying and the race. ${o.note || ''}</div>
      <div class="cols">${S.map(colHTML).join('')}</div><div class="ft"><button class="go" data-a="done">DONE · TO QUALIFYING ▸</button></div></div>`;
  };
  // (the satisfaction shown: the engineers' read of the last run - it is only known after a run)
  const run = (s) => { if (s.runs >= RUNS) return; s.runs++; s.fb = feedback(s.x, s.ideal, s.runs, k); const e = s.fb.reduce((a, f) => a + Math.abs(f.est), 0); s.shown = Math.max(0, Math.min(1, 1 - e * 0.85)); };
  draw();
  el.addEventListener('input', (e) => {
    const r = e.target.closest('input[type=range]'); if (!r) return;
    const s = S[+r.closest('.col').dataset.j]; s.x[+r.dataset.i] = +r.value / 100; r.nextElementSibling.textContent = r.value;
  });
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.a === 'run') { run(S[+b.closest('.col').dataset.j]); draw(); }
    else if (b.dataset.a === 'done') { el.remove(); o.onDone?.(S.map((s) => ({ name: s.name, x: s.x, runs: s.runs, sat: satisfaction(s.x, s.ideal) }))); }
  });
}
