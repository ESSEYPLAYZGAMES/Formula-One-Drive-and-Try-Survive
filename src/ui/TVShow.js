// The broadcast as a show (with ui/TVGraphics.js: the tower and captions, and ui/TVExtras.js: battles, replays, the
// safety car's feed) - what makes the world feed sound and read like television:
//   COMMENTARY: two voices, a lead who calls what happens and an analyst who says what it means, as a caption under the
//     top of the picture and - VOICE on - spoken by the browser's own speech (two of its voices). Fed by events (the
//     start, a pass, a stop, the safety car, the flag ...); a line worth more cuts in on one worth less.
//   TEAM RADIO on air: who spoke, the line, a waveform - a driver's words and your orders, not the pit wall's chatter.
//   THE TRACK MAP: the circuit's outline, a dot a car (yours ringed, the car on screen marked, the safety car yellow).
//   CARDS in the column over the pit wall when no battle is on it, in turn: the PIT WINDOW of each of your cars (where
//     a stop now would put it back, behind whom and ahead of whom), the TYRE HISTORY of the car on screen (its stints),
//     the SPEED TRAP, a driver's season (the career's own numbers), the RAIN RADAR when rain is on its way.
//   THE STEWARDS: track limits strike by strike and the black-and-white flag, an incident NOTED and what came of it.
//   THE START: the grid in two columns before the lights, the best reactions after them, who gained most on lap one.
//   THE FLAG: the classification as the cars come home.
//   QUALIFYING: the lap being driven by the car on screen - its sectors' colours, up or down on its best.
//   RAIN ON THE LENS when the track is wet, on the cameras that stand in it.
// Plain DOM in the graphics' own layer; main.js draws the picture-in-picture inside the frame this makes for it.
const CSS = `
#tvg .cm { position: absolute; left: 50%; top: 50px; transform: translate(-50%, -8px); width: min(600px, 46vw); background: rgba(12,14,20,.86); border-radius: 6px; padding: 7px 12px 8px; opacity: 0; transition: opacity .25s, transform .25s; border-left: 4px solid #e10600; }
#tvg .cm.in { opacity: 1; transform: translate(-50%, 0); } #tvg .cm.b { border-left-color: #1f6feb; }
#tvg .cm small { display: block; font: 800 9px/1 var(--tvf); letter-spacing: .2em; color: #9aa4b2; margin-bottom: 4px; }
#tvg .cm span { font: 600 14px/1.3 var(--tvf); }
#tvg .rad { position: absolute; left: 244px; bottom: calc(var(--pw, 150px) + 84px); width: min(330px, 30vw); background: rgba(12,14,20,.9); border-left: 4px solid var(--rc, #fff); border-radius: 6px; padding: 7px 11px 9px; opacity: 0; transform: translateX(-16px); transition: opacity .25s, transform .3s; }
#tvg .rad.in { opacity: 1; transform: none; }
#tvg .rad small { font: 800 9px/1 var(--tvf); letter-spacing: .22em; color: var(--rc, #fff); } #tvg .rad b { display: block; font: 800 12px/1 var(--tvf); letter-spacing: .1em; text-transform: uppercase; margin: 6px 0 3px; }
#tvg .rad p { margin: 0; font: 500 13px/1.3 var(--tvf); } #tvg .rad .w { float: right; display: flex; gap: 2px; height: 12px; align-items: center; } #tvg .rad .w i { width: 3px; height: 3px; background: var(--rc, #fff); border-radius: 1px; animation: tvsW .4s ease-in-out infinite alternate; }
@keyframes tvsW { to { height: 12px; } }
#tvg .map { position: absolute; right: 14px; top: 44px; width: 190px; height: 128px; background: rgba(12,14,20,.72); border-radius: 6px; }
#tvg.has-map .rc { top: 180px; }
#tvg .map { transition: transform .3s; transform-origin: top right; } #tvg.tight .map { transform: scale(.6); }   /* (the column of cards has grown up to it: the map makes room) */
#tvg .xc.inf .xh { background: #2b3040; } #tvg .xc.inf.wx .xh { background: #1f6feb; } #tvg .xc.inf { width: 286px; }
#tvg .xc.inf .ln { display: flex; justify-content: space-between; gap: 10px; padding: 5px 10px; font: 700 11px/1.25 var(--tvf); border-top: 1px solid rgba(255,255,255,.08); }
#tvg .xc.inf .ln small { font: 800 9px/1.4 var(--tvf); letter-spacing: .14em; color: #9aa4b2; white-space: nowrap; } #tvg .xc.inf .ln span { text-align: right; }
#tvg .xc.inf .big { padding: 7px 10px; font: 900 20px/1 var(--tvf); background: rgba(255,255,255,.06); } #tvg .xc.inf .big small { font: 700 10px/1 var(--tvf); letter-spacing: .12em; color: #b7c0cc; margin-left: 6px; }
#tvg .xc.inf .stints { display: flex; gap: 2px; padding: 8px 10px; } #tvg .xc.inf .stints i { height: 16px; border-radius: 3px; min-width: 16px; font: 900 9px/16px var(--tvf); font-style: normal; text-align: center; color: #111; }
#tvg .gridg { position: absolute; left: 50%; top: 104px; transform: translateX(-50%); width: min(620px, 58vw); background: rgba(12,14,20,.9); border-radius: 8px; overflow: hidden; opacity: 0; transition: opacity .4s; pointer-events: none; }
#tvg .gridg.in { opacity: 1; }
#tvg .gridg .gh { display: flex; justify-content: space-between; padding: 8px 12px; background: #e10600; font: 900 12px/1 var(--tvf); letter-spacing: .18em; } #tvg .gridg .gh small { font: 700 10px/1 var(--tvf); letter-spacing: .12em; opacity: .9; }
#tvg .gridg .gb { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; padding: 6px 10px 8px; }
#tvg .gridg .gr { display: grid; grid-template-columns: 22px 4px 1fr 18px; gap: 0 7px; align-items: center; height: 20px; font: 700 12px/1 var(--tvf); } #tvg .gridg .gr.mine { background: rgba(255,255,255,.12); }
#tvg .gridg .gr .p { text-align: right; color: #c9d1db; font-weight: 900; } #tvg .gridg .gr .tc { height: 13px; border-radius: 2px; } #tvg .gridg .gr .n { text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#tvg .gridg .gr.odd { grid-column: 1; } #tvg .gridg .gr.even { grid-column: 2; margin-top: 6px; }
#tvg .gridg .gf { padding: 6px 12px 8px; font: 700 10px/1.3 var(--tvf); letter-spacing: .1em; color: #b7c0cc; border-top: 1px solid rgba(255,255,255,.1); }
#tvg .cls { position: absolute; left: 244px; top: 96px; width: 300px; background: rgba(12,14,20,.9); border-radius: 6px; overflow: hidden; opacity: 0; transform: translateX(-16px); transition: opacity .3s, transform .35s; }
#tvg .cls.in { opacity: 1; transform: none; } #tvg.has-pip .cls.in { opacity: 0; } #tvg .cls .gh { padding: 7px 10px; background: repeating-conic-gradient(#fff 0 25%, #111 0 50%) 0 0 / 14px 14px; color: #111; font: 900 12px/1 var(--tvf); letter-spacing: .18em; text-shadow: 0 0 6px #fff, 0 0 6px #fff, 0 0 6px #fff; }
#tvg .cls .gr { display: grid; grid-template-columns: 22px 4px 1fr auto; gap: 0 7px; align-items: center; height: 22px; padding: 0 10px; font: 700 12px/1 var(--tvf); } #tvg .cls .gr.mine { background: rgba(255,255,255,.12); }
#tvg .cls .gr .p { text-align: right; font-weight: 900; color: #c9d1db; } #tvg .cls .gr .tc { height: 13px; border-radius: 2px; } #tvg .cls .gr .n { text-transform: uppercase; } #tvg .cls .gr .g { font-variant-numeric: tabular-nums; color: #dfe5ec; }
#tvg .pip { position: absolute; left: 244px; top: 126px; width: min(300px, 24vw); aspect-ratio: 16 / 9; border: 2px solid #fff; border-radius: 4px; box-shadow: 0 8px 26px rgba(0,0,0,.5); display: none; }
#tvg .pip.on { display: block; } #tvg .pip.big { width: min(430px, 34vw); border-color: #e10600; }
#tvg .pip b { position: absolute; left: -2px; top: -22px; background: #fff; color: #111; font: 900 10px/1 var(--tvf); letter-spacing: .16em; padding: 5px 8px; border-radius: 4px 4px 0 0; white-space: nowrap; } #tvg .pip.big b { background: #e10600; color: #fff; }
#tvg .cls .dotd { margin-top: 6px; padding: 7px 10px; background: rgba(255,212,0,.14); border-left: 3px solid #ffd400; font: 800 13px/1.2 var(--tvf); color: #fff; }
#tvg .cls .dotd small { display: block; font-size: 9px; letter-spacing: .16em; color: #ffd400; margin-bottom: 3px; }
#tvg .cls .dotd em { display: block; font: 600 10px/1.3 var(--tvf); color: #b7c0cc; font-style: normal; }
body.tp-hl #hud, body.tp-hl #hud-msg { visibility: hidden !important; }   /* (the highlights at the flag: the picture and its tag, nothing of the driver's own display) */
#tvg .vc { position: absolute; right: 214px; top: 14px; pointer-events: auto; cursor: pointer; background: rgba(12,14,20,.75); color: #b7c0cc; border: 1px solid rgba(255,255,255,.2); border-radius: 4px; font: 800 9px/1 var(--tvf); letter-spacing: .16em; padding: 8px 9px; }
#tvg .vc:hover { color: #fff; border-color: #fff; }
#tvg .rain { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 1.2s; overflow: hidden; }
#tvg .rain.on { opacity: 1; }
#tvg .rain i { position: absolute; border-radius: 50%; background: radial-gradient(ellipse at 35% 30%, rgba(255,255,255,.5), rgba(190,210,230,.16) 45%, rgba(255,255,255,.04) 70%, transparent 72%); box-shadow: inset 0 -2px 3px rgba(0,0,0,.18); backdrop-filter: blur(2px); }
#tvg .r .sx { position: absolute; right: 96px; top: 50%; margin-top: -2px; display: flex; gap: 2px; } #tvg .r .sx u { width: 5px; height: 4px; border-radius: 1px; background: rgba(255,255,255,.14); text-decoration: none; }
#tvg .r .sx u.purple { background: #b45cff; } #tvg .r .sx u.green { background: #3ddc84; } #tvg .r .sx u.yellow { background: #ffd400; }
#tvg.hl .tower, #tvg.hl .live, #tvg.hl .xr, #tvg.hl .map, #tvg.hl .cap, #tvg.hl .rc, #tvg.hl .cm, #tvg.hl .rad, #tvg.hl .tel, #tvg.hl .cls, #tvg.hl .gridg, #tvg.hl .pip, #tvg.hl .vc, #tvg.hl .rain, #tvg.hl .sting { display: none !important; }
@media (max-width: 1000px) { #tvg .map, #tvg .rad { display: none; } #tvg .pip { left: 190px; } }
`;
const surname = (c) => { const w = String(c?.name || c || '').trim().split(/\s+/); return w[0] === 'Zhou' ? 'Zhou' : w[w.length - 1]; };
const LETTER = { SOFT: 'S', MEDIUM: 'M', HARD: 'H', INTER: 'I', WET: 'W' }, TCOL = { SOFT: '#e8322e', MEDIUM: '#ffd400', HARD: '#f2f2f2', INTER: '#3ddc84', WET: '#3d8bff' };
const ord = (n) => (n === 1 ? 'first' : n === 2 ? 'second' : n === 3 ? 'third' : `P${n}`);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LEAD = 'ALEX REID', ANALYST = 'SAM OKOYE';   // (invented: nobody's voice)

/** the commentary's lines: kind -> [prio, who (0 lead, 1 analyst), (x, n) => text | [texts]] ; n: a count that turns the variants */
const LINES = {
  grid: [3, 0, (x) => [`Twenty-two cars on the grid at ${x.track}. ${x.pole} on pole.`, `${x.track}. ${x.laps} laps. ${x.pole} starts from the front.`]],
  gridMine: [2, 1, (x) => [`${x.team} line up ${x.a}${x.b ? ` and ${x.b}` : ''}. A big afternoon for them.`]],
  lights: [9, 0, () => ['Five lights... and away we go!', 'It is lights out, and we are racing!']],
  lap1: [5, 1, (x) => [`${x.who} the big winner on the first lap: up ${x.n} place${x.n === 1 ? '' : 's'}.`]],
  pass: [6, 0, (x) => [`${x.a} goes through on ${x.b}! That is ${ord(x.pos)}.`, `${x.a} is past ${x.b} for ${ord(x.pos)}!`, `Down the inside goes ${x.a}. ${x.b} can do nothing about it.`]],
  passLead: [9, 0, (x) => [`${x.a} takes the lead! ${x.b} has been passed for first!`, `A new leader! ${x.a} is through on ${x.b}.`]],
  battle: [3, 0, (x) => [`${x.b} is all over the back of ${x.a}. ${x.g} tenths in it.`, `Watch this: ${x.b} right with ${x.a}, for ${ord(x.pos)}.`]],
  battleA: [2, 1, (x) => [x.drs ? `And ${x.b} has DRS. ${x.a} is a sitting target down the straight.` : `${x.a} has to be perfect now. One mistake and ${x.b} is through.`]],
  catching: [3, 1, (x) => [`Keep an eye on ${x.b}: taking ${x.r} a lap out of ${x.a}. He is with him in about ${x.laps}.`, `${x.b} is coming. ${x.g} seconds back from ${x.a} and closing by ${x.r} every lap.`]],
  stop: [4, 0, (x) => [`${x.who} is in. ${x.t} seconds. ${x.t < 2.6 ? 'That is a great stop.' : x.t > 4 ? 'Oh, that is slow. That has cost him.' : 'Clean enough.'}`]],
  stopA: [2, 1, (x) => [`${x.comp}s on for ${x.who}. ${x.pos ? `He comes back out ${ord(x.pos)}.` : ''}`]],
  fl: [4, 1, (x) => [`Fastest lap of the race for ${x.who}: ${x.t}.`, `${x.who} goes purple. ${x.t}.`]],
  spin: [7, 0, (x) => [`${x.who} is round! He has lost it!`, `Oh, ${x.who} has spun!`]],
  out: [8, 0, (x) => [`${x.who} is out of the race. ${x.why}.`, `That is the end of ${x.who}'s afternoon. ${x.why}.`]],
  outMine: [8, 1, (x) => [`A blow for ${x.team}. ${x.fact || 'They needed that car at the finish.'}`]],
  touch: [6, 0, (x) => [`Contact! ${x.a} and ${x.b} have touched!`, `They have come together, ${x.a} and ${x.b}!`]],
  sc: [9, 0, (x) => [`Safety car. ${x.cause ? `${x.cause} has stopped on the circuit. ` : ''}The race is neutralised.`]],
  scA: [5, 1, () => ['A cheap stop for anyone brave enough. Watch the pit lane now.', 'This closes everything up. The gaps they spent an hour building are gone.']],
  vsc: [7, 0, () => ['Virtual safety car. Everybody slows to the delta.']],
  red: [10, 0, (x) => [`Red flag. The race is stopped${x.cause ? ` for ${x.cause}'s accident` : ''}.`]],
  green: [8, 0, () => ['Green flag! We are racing again!', 'The safety car is in. Go, go, go!']],
  resume: [8, 0, () => ['A standing restart. Lights out again, and they are away!']],
  final: [7, 0, (x) => [`The last lap. ${x.who} leads${x.g ? ` by ${x.g} seconds` : ''}.`]],
  flag: [10, 0, (x) => [`${x.who} wins${x.track ? ` at ${x.track}` : ''}! ${x.team} take the victory!`, `The chequered flag: ${x.who} wins it for ${x.team}!`]],
  flagA: [6, 1, (x) => [x.fact ? `${x.fact[0].toUpperCase()}${x.fact.slice(1)}.` : `${x.second} second, ${x.third} third. What a race.`]],
  pen: [6, 0, (x) => [`A penalty for ${x.who}: ${x.sec} seconds.`]],
  tl: [3, 1, (x) => [`${x.who} over the white line again. Strike ${x.n}. ${x.left > 0 ? `${x.left} more and it is a penalty.` : 'The next one costs him time.'}`]],
  noted: [3, 1, (x) => [`The stewards have noted that, ${x.a} and ${x.b}.`]],
  nfa: [2, 1, () => ['No further action. A racing incident, they say.']],
  rain: [6, 1, (x) => [`The radar has rain ${x.eta < 30 ? 'arriving now' : `about ${Math.round(x.eta / 60) || 1} minute${Math.round(x.eta / 60) > 1 ? 's' : ''} away`}. Who blinks first?`]],
  order: [5, 1, (x) => [`That is a team order. ${x.who} told to move over.`]],
  refuse: [8, 0, (x) => [`${x.who} is not moving over! He has ignored the pit wall!`]],
  replay: [1, 0, () => ['Let us see that again.']],
  quali: [3, 0, (x) => [`${x.who} is on a lap. ${x.up ? 'Up on his best so far.' : 'He needs to find time in the last sector.'}`]],
  pole: [6, 0, (x) => [`${x.who} goes fastest! ${x.t}.`]],
};

export class TVShow {
  /** root: #tvg; o: { tyreLaps(car), audio } */
  constructor(root, o = {}) {
    this.root = root; this.o = o;
    if (!document.getElementById('tvs-css')) { const st = document.createElement('style'); st.id = 'tvs-css'; st.textContent = CSS; document.head.appendChild(st); }
    const mk = (cls, html = '') => { const e = document.createElement('div'); e.className = cls; e.innerHTML = html; root.appendChild(e); return e; };
    this.rain = mk('rain'); root.insertBefore(this.rain, root.firstChild);   /* (the drops are on the lens: under every graphic) */ this.cm = mk('cm', '<small></small><span></span>'); this.rad = mk('rad'); this.gridg = mk('gridg'); this.cls = mk('cls'); this.pipEl = mk('pip', '<b></b>');
    this.mapEl = document.createElement('canvas'); this.mapEl.className = 'map'; this.mapEl.width = 380; this.mapEl.height = 256; root.appendChild(this.mapEl);
    this.inf = document.createElement('div'); this.inf.className = 'xc inf'; (root.querySelector('.xr') || root).appendChild(this.inf);
    this.voice = false; try { this.voice = localStorage.getItem('f1sim-tv-voice') === '1'; } catch (e) { this.voice = false; }
    this.vc = document.createElement('button'); this.vc.className = 'vc'; this.vc.title = 'The commentary spoken aloud by the browser (V)'; root.appendChild(this.vc); this.vc.addEventListener('click', () => { this.setVoice(!this.voice); });
    this.vc.textContent = this.voice ? 'VOICE ON' : 'VOICE OFF'; this.reset();
  }
  reset() {
    this.q = []; this.cur = null; this.curT = 0; this.n = 0; this.said = new Map(); this.radT = 0; this.acc = 0; this.mapPts = null; this.mapFor = null;
    this.infT = 99; this.infK = 0; this.stints = new Map(); this.vmax = new Map(); this.tl = new Map(); this.logN = 0; this.notes = []; this.offN = 0;
    this.phase = 'pre'; this.t0 = 0; this.lap1 = false; this.react = false; this.flag = false; this.flagA = false; this.clsK = -1; this.infHold = 0; this.rainOn = false; this.rainSaid = -99; this.best = Infinity; this.pb = new Map(); this.drops = 0;
    for (const e of [this.cm, this.rad, this.gridg, this.cls, this.inf]) e.classList.remove('in'); this.rain.classList.remove('on'); this.pipEl.classList.remove('on', 'big'); this.root.classList.remove('hl', 'has-pip', 'tight');
    try { window.speechSynthesis?.cancel(); } catch (e) { /* no speech */ }
  }
  setVoice(on) { this.voice = !!on; if (this.vc) this.vc.textContent = on ? 'VOICE ON' : 'VOICE OFF'; try { localStorage.setItem('f1sim-tv-voice', on ? '1' : '0'); if (!on) window.speechSynthesis?.cancel(); } catch (e) { /* not kept */ } }

  // ---- commentary ------------------------------------------------------------------------------------------------------
  /** something happened: a line for it (kind: LINES' keys; x: its words) - said when its turn comes, or at once if it matters more than what is being said */
  say(kind, x = {}) {
    const L = LINES[kind]; if (!L) return;
    const key = `${kind}|${x.a || x.who || ''}|${x.b || ''}`, now = performance.now(); if (now - (this.said.get(key) ?? -1e9) < (L[0] >= 8 ? 4000 : 24000)) return; this.said.set(key, now);
    const v = L[2](x), text = Array.isArray(v) ? v[(this.n++ + (x.pos || 0)) % v.length] : v; if (!text) return;
    const it = { prio: L[0], who: L[1], text, at: now };
    if (this.cur && it.prio >= 8 && it.prio > this.cur.prio) { this.q = this.q.filter((y) => y.prio >= 6); this.q.unshift(it); this.curT = 0; }
    else { this.q.push(it); this.q.sort((a, b) => b.prio - a.prio || a.at - b.at); if (this.q.length > 4) this.q.length = 4; }
  }
  speak(it) {
    if (!this.voice || typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') return;
    try {
      const V = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)), u = new SpeechSynthesisUtterance(it.text);
      if (V.length) u.voice = V[it.who ? Math.min(V.length - 1, 1 + ((V.length / 2) | 0)) : 0]; u.rate = it.prio >= 8 ? 1.2 : 1.08; u.pitch = it.who ? 0.9 : 1.05; u.volume = 0.9;
      if (it.prio >= 8) speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { /* no speech */ }
  }
  /** a line on the radio, on air: who (a driver's surname, 'You'), the words, the team's colour */
  radio(who, text, color) {
    if (!text || /^(Pit wall|Strategy|Race control)$/.test(who)) return;
    this.rad.style.setProperty('--rc', color || '#ffffff');
    this.rad.innerHTML = `<span class="w">${'<i></i>'.repeat(8).replace(/<i>/g, () => `<i style="animation-delay:${(Math.random() * 0.4).toFixed(2)}s">`)}</span><small>TEAM RADIO</small><b>${esc(who === 'You' ? 'Pit wall' : who)}</b><p>${esc(text)}</p>`;
    this.rad.classList.add('in'); this.radT = 2.2 + Math.min(4, String(text).length * 0.05);
    try { this.o.audio?.beep?.(1320, 0.06, 0.1); } catch (e) { /* no sound */ }
  }
  /** the stewards have seen a contact: noted - and, if no penalty follows, no further action */
  noted(a, b, d) { if (!d || this.notes.some((n) => n.a === a && n.b === b && d.time - n.t < 30)) return; this.notes.push({ a, b, t: d.time, pen: (a.penalties || 0) + (b.penalties || 0) }); this.rcSay?.(`${surname(a)} · ${surname(b)} · incident noted`, 'warn', 'STEWARDS'); this.say('noted', { a: surname(a), b: surname(b) }); }
  /** the picture-in-picture's frame: label (null: off), big (a replay's window) -> its rectangle on the page, or null */
  pip(label, big = false) { this.root.classList.toggle('has-pip', !!label); if (!label) { this.pipEl.classList.remove('on', 'big'); return null; } this.pipEl.classList.add('on'); this.pipEl.classList.toggle('big', !!big); const b = this.pipEl.firstChild; if (b.textContent !== label) b.textContent = label; return this.pipEl.getBoundingClientRect(); }

  /**
   * every frame. ctx: { d, focus, shot, halted, len, track (the circuit: px, pz, n), trackName, stat(car) -> a line of
   * its season | '', wet (0..1), fact (the season's line for your team, for the flag), rc(text, kind, head), battle
   * (a battle card is up: the column is its), replaying }
   */
  update(dt, ctx) {
    const d = ctx.d; if (!d) return; this.rcSay = ctx.rc;
    // the caption being said, the next one
    if (this.cur) { this.curT -= dt; if (this.curT <= 0) { this.cur = null; this.cm.classList.remove('in'); } }
    if (!this.cur && this.q.length && !ctx.halted) { const it = this.q.shift(); if (performance.now() - it.at < 9000) { this.cur = it; this.curT = 1.6 + Math.min(4.2, it.text.length * 0.055); this.cm.className = `cm in${it.who ? ' b' : ''}`; this.cm.firstChild.textContent = it.who ? ANALYST : LEAD; this.cm.lastChild.textContent = it.text; this.speak(it); } }
    if (this.radT > 0) { this.radT -= dt; if (this.radT <= 0) this.rad.classList.remove('in'); }
    this.acc += dt; if (this.acc < 0.2) return; const step = this.acc; this.acc = 0;
    const P = d.positions, mine = (c) => (ctx.focus || []).includes(c), lead = P.find((c) => !c.retired), race = d.mode === 'race', racing = d.world.racing && !d.done;
    const onTrack = (c) => c && !c.retired && !c.finished && !c.inPit && !c.pitLane && !c.isSC && !c.hiddenAway, gap = (a, b) => d.radio?.gap?.(a, b);
    this.map(d, ctx, mine);
    { const xr = this.inf.parentElement, on = xr && xr.querySelector('.xc.in'); this.root.classList.toggle('tight', !!on && xr.getBoundingClientRect().top - this.root.getBoundingClientRect().top < 182); }
    // rain on the lens of a camera that stands in it
    const wet = ctx.wet || 0, lens = wet > 0.12 && ctx.shot && ctx.shot.kind !== 'heli';
    if (lens !== this.rainOn || (lens && this.drops !== ctx.cuts)) { this.rainOn = lens; this.drops = ctx.cuts; if (lens) { const n = Math.round(10 + wet * 34); this.rain.innerHTML = Array.from({ length: n }, () => { const s = 8 + Math.random() * 30 * (0.5 + wet); return `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;width:${s.toFixed(0)}px;height:${(s * (1.1 + Math.random() * 0.5)).toFixed(0)}px"></i>`; }).join(''); } this.rain.classList.toggle('on', !!lens); }
    if (!race) { this.gridg.classList.remove('in'); this.cls.classList.remove('in'); this.quali(d, ctx); return; }
    // ---- before the lights: the grid --------------------------------------------------------------------------------------
    const pre = !d.world.racing && !d.leaderFinished && (lead?.lap || 0) === 0 && !(d.sc?.redCount > 0);
    if (pre) {
      if (this.phase !== 'grid') {
        this.phase = 'grid';
        const G0 = [...P].sort((a, b) => (a.gridPos || 99) - (b.gridPos || 99)); const cnt = {}; for (const c of P) { const k = c.tyres?.compound || 'SOFT'; cnt[k] = (cnt[k] || 0) + 1; }
        this.gridg.innerHTML = `<div class="gh">STARTING GRID<small>${esc(String(ctx.trackName || '').toUpperCase())} · ${d.lapsTotal} LAPS</small></div><div class="gb">${G0.map((c, i) => `<div class="gr ${i % 2 ? 'even' : 'odd'}${mine(c) ? ' mine' : ''}"><span class="p">${i + 1}</span><span class="tc" style="background:${c.color}"></span><span class="n">${esc(surname(c))}</span><span class="ty2" style="border-color:${TCOL[c.tyres?.compound] || '#fff'};width:16px;height:16px;border-width:3px;font-size:7px">${LETTER[c.tyres?.compound] || ''}</span></div>`).join('')}</div><div class="gf">${Object.entries(cnt).map(([k, n]) => `${n} ON ${k}S`).join(' · ')}${wet > 0.12 ? ' · WET TRACK' : ''}</div>`;
        this.gridg.classList.add('in');
        this.say('grid', { track: ctx.trackName, pole: surname(G0[0]), laps: d.lapsTotal }); const M = (ctx.focus || []); if (M.length) this.say('gridMine', { team: M[0].team, a: `${surname(M[0])} ${ord(G0.indexOf(M[0]) + 1)}`, b: M[1] ? `${surname(M[1])} ${ord(G0.indexOf(M[1]) + 1)}` : '' });
      }
      return;
    }
    if (this.phase === 'grid') { this.phase = 'race'; this.t0 = d.time; this.infT = 0; this.gridg.classList.remove('in'); this.say('lights'); try { this.o.audio?.play?.('crowd', { gain: 0.5, fadeIn: 0.3 })?.stop?.(5); } catch (e) { /* no sound */ } for (const c of P) { this.stints.set(c, [{ comp: c.tyres?.compound || 'SOFT', from: 0 }]); c._tvGrid = c.gridPos ? c.gridPos - 1 : P.indexOf(c); } }
    if (this.phase === 'pre') { this.phase = 'race'; this.t0 = d.time; this.infT = 0; for (const c of P) if (!this.stints.has(c)) { this.stints.set(c, [{ comp: c.tyres?.compound || 'SOFT', from: c.lap || 0 }]); c._tvGrid = c.gridPos ? c.gridPos - 1 : P.indexOf(c); } }
    // the best reactions, a few seconds in; who gained on lap one
    if (!this.react && racing && d.time - this.t0 > 3.5 && d.time - this.t0 < 12 && d.ai) { this.react = true; const R = d.ai.filter((a) => a.react0 > 0 && isFinite(a.react0) && !a.jumped && a.car && !a.car.isSC).sort((a, b) => a.react0 - b.react0).slice(0, 3);   /* (react0: the reaction as the lights went out - race/RaceDirector.js; a.reaction itself counts down) */ if (R.length) this.card('inf', 'BEST REACTIONS', 'LIGHTS OUT', R.map((a, i) => `<div class="ln"><small>${i + 1}</small><span>${esc(surname(a.car))} · ${a.react0.toFixed(3)} s</span></div>`).join(''), 7); }
    if (!this.lap1 && lead && lead.lap >= 1) { this.lap1 = true; const G = P.filter((c) => !c.retired && c._tvGrid != null).map((c) => ({ c, n: c._tvGrid - P.indexOf(c) })).sort((a, b) => b.n - a.n); if (G[0] && G[0].n >= 2) { this.say('lap1', { who: surname(G[0].c), n: G[0].n }); this.card('inf', 'LAP 1 · PLACES GAINED', '', G.slice(0, 3).filter((g) => g.n > 0).map((g) => `<div class="ln"><small>+${g.n}</small><span>${esc(surname(g.c))} · now P${P.indexOf(g.c) + 1}</span></div>`).join('') + (G[G.length - 1].n < -1 ? `<div class="ln"><small>${G[G.length - 1].n}</small><span>${esc(surname(G[G.length - 1].c))} · now P${P.indexOf(G[G.length - 1].c) + 1}</span></div>` : ''), 8); } }
    // stints, top speeds, the stewards
    for (const c of P) {
      const S0 = this.stints.get(c); if (S0) { const k = c.tyres?.compound; if (k && S0[S0.length - 1].comp !== k) { S0[S0.length - 1].to = c.lap; S0.push({ comp: k, from: c.lap }); } else if (S0[S0.length - 1].n !== c.pitStops && c.pitStops > (S0[S0.length - 1].n ?? 0) && S0[S0.length - 1].from !== c.lap) { S0[S0.length - 1].to = c.lap; S0.push({ comp: k, from: c.lap, n: c.pitStops }); } S0[S0.length - 1].n = c.pitStops; }
      if (onTrack(c)) { const v = Math.abs(c.speed) * 3.6; if (v > (this.vmax.get(c) || 0)) this.vmax.set(c, v); }
      const tl = c.tlStrikes || 0, was = this.tl.get(c) || 0; if (tl > was) { this.tl.set(c, tl); const allow = d.stewards?.strikes ?? 3; ctx.rc?.(`${surname(c)} · track limits · strike ${tl}${tl <= allow ? ` of ${allow}` : ''}`, tl >= allow ? 'bad' : 'warn', tl === allow ? 'BLACK AND WHITE FLAG' : 'TRACK LIMITS'); if (mine(c) || P.indexOf(c) < 6) this.say('tl', { who: surname(c), n: tl, left: allow - tl }); }
    }
    const SL = d.stewards?.log || []; for (; this.logN < SL.length; this.logN++) { const e = SL[this.logN], c = P.find((x) => x.short === e.car); if (c && e.sec) this.say('pen', { who: surname(c), sec: e.sec }); }
    const OP = d.stewards?.offPasses || []; if (OP.length > this.offN) { this.offN = OP.length; ctx.rc?.('overtake off the track · under investigation', 'warn', 'STEWARDS'); } else this.offN = OP.length;
    this.notes = this.notes.filter((n) => { if (d.time - n.t < 9) return true; if ((n.a.penalties || 0) + (n.b.penalties || 0) <= n.pen) { ctx.rc?.(`${surname(n.a)} · ${surname(n.b)} · no further action`, '', 'STEWARDS'); this.say('nfa'); } return false; });
    // rain on the radar
    const O = d.weather?.outlook?.(); if (O && O.p > 0.45 && O.eta != null && O.eta > 0 && O.eta < 300 && d.time - this.rainSaid > 240 && racing) { this.rainSaid = d.time; this.say('rain', { eta: O.eta }); this.card('inf wx', 'RAIN RADAR', `${Math.round(O.p * 100)}%`, `<div class="big">${O.eta < 45 ? 'NOW' : `${Math.max(1, Math.round(O.eta / 60))} MIN`}<small>UNTIL IT ARRIVES</small></div><div class="ln"><small>HOW HARD</small><span>${O.peak > 0.6 ? 'heavy' : O.peak > 0.3 ? 'steady' : 'light'}</span></div>`, 9); }
    // ---- the flag ----------------------------------------------------------------------------------------------------------
    if (d.leaderFinished) {
      const F = P.filter((c) => c.finished && !c.retired);
      if (!this.flag && F.length) { this.flag = true; this.flagAt = performance.now(); this.inf.classList.remove('in'); this.say('flag', { who: surname(F[0]), team: F[0].team, track: ctx.trackName }); try { this.o.audio?.play?.('crowd', { gain: 0.7, fadeIn: 0.2 })?.stop?.(7); } catch (e) { /* no sound */ } }
      if (F.length >= 3 && !this.flagA) { this.flagA = true; try { this.o.on?.('podium'); } catch (e) { /* no one listening */ } this.say('flagA', { fact: ctx.fact, second: surname(F[1]), third: surname(F[2]) }); }
      const key = F.length; if (this.clsK !== key && performance.now() - (this.flagAt || 0) > 4200) { this.clsK = key; const w = F[0];   /* (after the flag's own banner has gone) */ this.cls.innerHTML = `<div class="gh">CLASSIFICATION</div>${F.slice(0, 10).map((c, i) => { const dl = (w.lap || 0) - (c.lap || 0), g = i ? (dl > 0 ? `+${dl} LAP${dl > 1 ? 'S' : ''}` : isFinite(c.finishTime) && isFinite(w.finishTime) ? `+${Math.max(0, c.finishTime - w.finishTime).toFixed(3)}` : '') : 'WINNER'; return `<div class="gr${mine(c) ? ' mine' : ''}"><span class="p">${i + 1}</span><span class="tc" style="background:${c.color}"></span><span class="n">${esc(surname(c))}</span><span class="g">${g}</span></div>`; }).join('')}${(() => { const G = P.filter((c) => !c.retired && c._tvGrid != null).map((c) => ({ c, n: c._tvGrid - P.indexOf(c) })).sort((x, y) => y.n - x.n || P.indexOf(x.c) - P.indexOf(y.c))[0]; return G && F.length >= 3 ? `<div class="dotd"><small>DRIVER OF THE DAY</small>${esc(surname(G.c))}<em>${G.n > 0 ? `+${G.n} place${G.n === 1 ? '' : 's'} from P${G.c._tvGrid + 1}` : `led from P${G.c._tvGrid + 1}`}</em></div>` : ''; })()}`; this.cls.classList.add('in'); }
      return;
    }
    if (!racing || ctx.replaying) return;
    // ---- the cards' turn: when no battle has the column -------------------------------------------------------------------
    this.infT += step; if (this.infHold > 0) { this.infHold -= step; if (this.infHold <= 0) this.inf.classList.remove('in'); return; }
    if (ctx.neutral || (ctx.battle && (ctx.catching || innerHeight < 600))) { if (!this.infHold) this.inf.classList.remove('in'); return; }   // (the column is the safety car's; or a fight's and a chase's both: no room under them)
    if (this.infT < 16) return; this.infT = 0;
    const M = (ctx.focus || []).filter(onTrack), sh = ctx.shot?.car, kinds = ['pit0', 'tyres', 'speed', 'pit1', 'stat'];
    for (let tries = 0; tries < kinds.length; tries++) {
      const k = kinds[this.infK++ % kinds.length];
      if ((k === 'pit0' || k === 'pit1') && M[k === 'pit0' ? 0 : 1] && lead && lead.lap >= 1 && lead.lap < d.lapsTotal - 1) {
        const c = M[k === 'pit0' ? 0 : 1], T = (d.world.pitLoss || 22) * (d.sc?.cheapStop ? 0.55 : 1), i = P.indexOf(c), B = P.slice(i + 1).filter(onTrack).map((x) => ({ x, g: gap(x, c) })).filter((b) => b.g != null && b.g > 0);
        const ahead = B.filter((b) => b.g < T), nx = B.find((b) => b.g >= T), pos = i + 1 + ahead.length, la = ahead[ahead.length - 1];
        this.card('inf', `PIT WINDOW · ${surname(c).toUpperCase()}`, `STOP ≈ ${T.toFixed(0)} S`, `<div class="big">P${pos}<small>IF HE STOPS NOW</small></div>${la ? `<div class="ln"><small>BEHIND</small><span>${esc(surname(la.x))} by ${(T - la.g).toFixed(1)} s</span></div>` : '<div class="ln"><small>KEEPS</small><span>his place</span></div>'}${nx ? `<div class="ln"><small>AHEAD OF</small><span>${esc(surname(nx.x))} by ${(nx.g - T).toFixed(1)} s</span></div>` : '<div class="ln"><small>BEHIND HIM</small><span>clear air</span></div>'}`, 8); return;
      }
      if (k === 'tyres' && sh && this.stints.get(sh)) {
        const S0 = this.stints.get(sh), tot = Math.max(1, d.lapsTotal);
        this.card('inf', `TYRES · ${surname(sh).toUpperCase()}`, `${S0.length - 1} STOP${S0.length === 2 ? '' : 'S'}`, `<div class="stints">${S0.map((s) => { const n = Math.max(1, (s.to ?? sh.lap + 1) - s.from); return `<i style="flex:${n};background:${TCOL[s.comp] || '#fff'}">${n}</i>`; }).join('')}<i style="flex:${Math.max(0.01, tot - sh.lap - 1)};background:rgba(255,255,255,.1);min-width:0"></i></div><div class="ln"><small>ON NOW</small><span>${sh.tyres?.compound || ''} · ${this.o.tyreLaps ? this.o.tyreLaps(sh) : 0} laps · ${Math.round((sh.tyres?.wear || 0) * 100)}% worn</span></div>`, 7); return;
      }
      if (k === 'speed' && this.vmax.size > 4) {
        const V = [...this.vmax.entries()].filter(([c]) => !c.retired).sort((a, b) => b[1] - a[1]).slice(0, 4);
        this.card('inf', 'SPEED TRAP', 'KM/H', V.map(([c, v], i) => `<div class="ln"><small>${i + 1}</small><span>${esc(surname(c))} · ${v.toFixed(0)}</span></div>`).join(''), 7); return;
      }
      if (k === 'stat' && sh && ctx.stat) { const t = ctx.stat(sh); if (t) { this.card('inf', surname(sh).toUpperCase(), sh.team ? String(sh.team).toUpperCase() : '', t.split(' · ').map((x) => `<div class="ln"><span style="text-align:left">${esc(x)}</span></div>`).join(''), 7); return; } }
    }
  }
  /** a card in the column for `hold` seconds */
  card(cls, head, sub, body, hold = 7) { this.inf.className = `xc ${cls} in`; this.inf.innerHTML = `<div class="xh">${esc(head)}<small>${esc(sub || '')}</small></div>${body}`; this.infHold = hold; this.infT = 0; }
  /** qualifying: the lap the car on screen is on */
  quali(d, ctx) {
    if (d.mode !== 'quali') { this.inf.classList.remove('in'); return; }
    const P = d.positions, c = ctx.shot?.car; if (P[0] && isFinite(P[0].bestLap) && P[0].bestLap < this.best - 1e-6) { const first = this.best === Infinity; this.best = P[0].bestLap; if (!first) this.say('pole', { who: surname(P[0]), t: fmt(P[0].bestLap) }); }
    const st = c && d.sectors?.of?.(c); if (!c || !st || c.pitLane || c.inPit || st.k == null) { this.inf.classList.remove('in'); return; }
    let dl = null; try { dl = d.telemetry?.liveDelta?.(c, d.time); } catch (e) { dl = null; }
    const col = { purple: '#b45cff', green: '#3ddc84', yellow: '#ffd400' };
    this.inf.className = 'xc inf in'; this.inf.innerHTML = `<div class="xh">ON A LAP · ${esc(surname(c).toUpperCase())}<small>P${P.indexOf(c) + 1}</small></div><div class="stints">${[0, 1, 2].map((k) => `<i style="flex:1;background:${st.col[k] ? col[st.col[k]] : 'rgba(255,255,255,.12)'}">S${k + 1}</i>`).join('')}</div>${dl != null && isFinite(dl) ? `<div class="big" style="color:${dl <= 0 ? '#3ddc84' : '#ff8a80'}">${dl <= 0 ? '−' : '+'}${Math.abs(dl).toFixed(3)}<small>${dl <= 0 ? 'IMPROVING' : 'NOT IMPROVING'}</small></div>` : ''}`;
    if (st.k === 2 && !st._said) { st._said = true; this.say('quali', { who: surname(c), up: dl != null && dl <= 0 }); } if (st.k === 0) st._said = false;
  }
  /** the track map */
  map(d, ctx, mine) {
    const tr = ctx.track, cv = this.mapEl; if (!tr || !tr.px) { cv.style.display = 'none'; this.root.classList.remove('has-map'); return; }
    if (this.mapFor !== tr) {
      this.mapFor = tr; let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; const step = Math.max(1, Math.round(tr.n / 400)), pts = [];
      for (let i = 0; i < tr.n; i += step) { const x = tr.px[i], z = tr.pz[i]; pts.push([x, z]); x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
      const W = cv.width, H = cv.height, m = 22, k = Math.min((W - 2 * m) / Math.max(1, x1 - x0), (H - 2 * m) / Math.max(1, z1 - z0));
      this.mapT = (x, z) => [W / 2 + (x - (x0 + x1) / 2) * k, H / 2 + (z - (z0 + z1) / 2) * k]; this.mapPts = pts.map(([x, z]) => this.mapT(x, z));
    }
    cv.style.display = ''; this.root.classList.add('has-map');
    const g = cv.getContext('2d'), W = cv.width, H = cv.height; g.clearRect(0, 0, W, H);
    const ph = d.sc?.phase || 'green'; g.lineJoin = 'round'; g.lineCap = 'round';
    g.strokeStyle = ph === 'red' ? '#e10600' : ph !== 'green' && ph !== 'restart' && ph !== 'yellow' ? '#ffd400' : 'rgba(255,255,255,.55)'; g.lineWidth = 5; g.beginPath(); this.mapPts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke();
    const [sx, sy] = this.mapPts[0]; g.fillStyle = '#fff'; g.fillRect(sx - 2, sy - 7, 4, 14);
    const on = ctx.shot?.car, dot = (c, r, col, ring) => { const [x, y] = this.mapT(c.x, c.z); g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fillStyle = col; g.fill(); if (ring) { g.lineWidth = 2.5; g.strokeStyle = ring; g.stroke(); } };
    for (const c of d.positions) { if (c.retired || c.hiddenAway || mine(c) || c === on) continue; dot(c, 5, c.color || '#aaa', null); }
    if (d.sc?.car && !d.sc.car.pitLane) dot(d.sc.car, 6, '#ffd400', '#111');
    for (const c of d.positions) if (!c.retired && !c.hiddenAway && (mine(c) || c === on)) dot(c, mine(c) ? 8 : 7, c.color || '#fff', c === on ? '#ffffff' : '#111');
  }
}
const fmt = (t) => { const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s < 10 ? '0' : ''}${s.toFixed(3)}`; };
/** the sector's colours of a car for the tower: three chips' classes (ui/TVGraphics.js) */
export function sectorChips(d, c) { const st = d.sectors?.of?.(c); if (!st) return ''; const col = st.k == null || st.cur.every((x) => x == null) ? st.lastCol || st.col : st.col; return [0, 1, 2].map((k) => col?.[k] || '').join(','); }
