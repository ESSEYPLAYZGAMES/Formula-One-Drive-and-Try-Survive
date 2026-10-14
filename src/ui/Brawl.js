// The scuffle on the grid (ui/GridWalk.js hands it the camera while it plays). F at a driver close by gives him a
// shove - both hands, open, on the chest, nothing more - and he takes it the way people do: laughs it off, gives you a
// look, shoves you back once, or (the third time) squares up to you. Then it is handbags: nose to nose, hands open, the
// crowd's noise rising, three to five quick exchanges played as prompts in a closing ring (SHOVE with Space, SIDESTEP
// with A or D, BRACE with S) - a good one and he staggers back a step, a slow or wrong one and he shoves you back or
// grabs your overalls - while people run in to pull you apart: your team principal, engineer and No. 1 mechanic, his
// team-mate, the mechanics round his car. Last of all the choice: BACK OFF, or KEEP GOING for one more (the stewards
// see that too). If he started it, you can walk away before it begins. Nobody throws a punch and nobody is hurt; it is
// over in about ten seconds, and what it costs (penalty points, rapport, the papers) is the walk's to work out from the
// outcome (ui/WalkFx.js).
// The people are the walk's own, in full detail. Each gets a few extra bodies in the poses of a scuffle (squared up,
// shoving, staggering, held back, holding someone back: world/People.js), built while it plays, one a frame, and
// swapped in like a flipbook with the person's own head carried across - so the face never changes. Your arms are two
// first-person forearms (People.shoveArm) put where the eye is, every frame. Everything runs off update(dt).
import * as THREE from 'three';
import { makePerson, shoveArm, jointsOf, lookOf } from '../world/People.js';

const CSS = `
#brawl { position: fixed; inset: 0; z-index: 50; pointer-events: none; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #fff; opacity: 0; transition: opacity .3s; }
#brawl.in { opacity: 1; }
#brawl .vig { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.5)); }
#brawl .red { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(225,6,0,0) 45%, rgba(225,6,0,.3)); opacity: 0; }
#brawl .hd { position: absolute; left: 50%; top: 7vh; transform: translateX(-50%); text-align: center; white-space: nowrap; }
#brawl .hd b { display: inline-block; background: #e10600; padding: 7px 14px; font: 900 13px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .18em; text-transform: uppercase; box-shadow: 0 2px 10px rgba(0,0,0,.45); }
#brawl .hd i { display: block; margin-top: 9px; font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .24em; font-style: normal; color: #e7eaf0; text-shadow: 0 1px 4px #000, 0 0 10px rgba(0,0,0,.6); }
#brawl .say { position: absolute; left: 50%; top: 16vh; transform: translateX(-50%); max-width: min(620px, 86vw); background: rgba(10,12,18,.8); border-left: 3px solid #e10600; padding: 7px 12px; font: 500 16px/1.35 'Segoe UI', Arial, sans-serif; font-style: italic; text-align: center; opacity: 0; }
#brawl .say b { font: 800 11px/1 'Segoe UI', Arial, sans-serif; font-style: normal; letter-spacing: .14em; text-transform: uppercase; color: #8c93a0; margin-right: 9px; }
#brawl .flash { position: absolute; left: 50%; top: 38%; transform: translate(-50%, -50%); text-align: center; white-space: nowrap; opacity: 0; }
#brawl .flash span { display: block; font: 900 clamp(28px, 4.6vw, 60px)/1 'Segoe UI', Arial, sans-serif; letter-spacing: .08em; text-shadow: 0 3px 18px rgba(0,0,0,.85); }
#brawl .flash small { display: block; margin-top: 8px; font: 800 13px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .26em; color: #c9ced8; text-shadow: 0 1px 4px #000; }
#brawl .flash.good span { color: #41e07a; } #brawl .flash.bad span { color: #ff5a4a; }
#brawl .qte { position: absolute; left: 50%; top: 64%; width: 0; height: 0; }
#brawl .ring { position: absolute; left: -62px; top: -62px; width: 124px; height: 124px; box-sizing: border-box; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 0 16px rgba(255,255,255,.35), inset 0 0 12px rgba(255,255,255,.2); opacity: 0; }
#brawl .ring.late { border-color: #ff5a4a; box-shadow: 0 0 16px rgba(255,90,74,.5); }
#brawl .key { position: absolute; left: -36px; top: -36px; width: 72px; height: 72px; box-sizing: border-box; border-radius: 14px; background: #fff; color: #111; display: flex; align-items: center; justify-content: center; font: 900 30px/1 'Segoe UI', Arial, sans-serif; box-shadow: 0 6px 24px rgba(0,0,0,.55); opacity: 0; transform: scale(.6); transition: opacity .12s, transform .12s; }
#brawl .key.wide { left: -66px; width: 132px; font-size: 19px; letter-spacing: .12em; }
#brawl .lbl { position: absolute; left: -220px; width: 440px; top: 72px; text-align: center; font: 900 24px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; text-shadow: 0 2px 10px #000; opacity: 0; transition: opacity .12s; }
#brawl .lbl small { display: block; margin-top: 8px; font: 600 13px/1.3 'Segoe UI', Arial, sans-serif; letter-spacing: .05em; color: #d5d9e0; }
#brawl .qte.on .key { opacity: 1; transform: none; } #brawl .qte.on .lbl { opacity: 1; }
#brawl .ch { position: absolute; left: 50%; top: 60%; transform: translateX(-50%); display: flex; gap: 14px; opacity: 0; transition: opacity .2s; }
#brawl .ch.in { opacity: 1; }
#brawl .ch div { background: rgba(10,12,18,.88); border: 1px solid rgba(255,255,255,.16); border-radius: 10px; padding: 12px 18px; min-width: min(200px, 38vw); text-align: center; font: 900 16px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; }
#brawl .ch div.def { border-color: rgba(255,255,255,.75); }
#brawl .ch kbd { background: #fff; color: #111; border-radius: 4px; padding: 1px 8px; margin-right: 9px; font: 900 14px/1.4 'Segoe UI', Arial, sans-serif; letter-spacing: 0; }
#brawl .ch small { display: block; margin-top: 7px; font: 600 12px/1.3 'Segoe UI', Arial, sans-serif; letter-spacing: .04em; color: #b9c0cc; }
#brawl .ch p { position: absolute; left: 0; right: 0; bottom: -12px; height: 3px; margin: 0; background: rgba(255,255,255,.18); border-radius: 2px; overflow: hidden; }
#brawl .ch p i { display: block; height: 100%; width: 100%; background: #fff; }
#brawl .pips { position: absolute; left: 50%; bottom: 7vh; transform: translateX(-50%); display: flex; gap: 9px; align-items: center; }
#brawl .pips i { width: 13px; height: 13px; box-sizing: border-box; border-radius: 50%; border: 2px solid rgba(255,255,255,.45); }
#brawl .pips i.x { width: 17px; height: 17px; }
#brawl .pips i.now { border-color: #fff; box-shadow: 0 0 8px rgba(255,255,255,.8); }
#brawl .pips i.good { background: #41e07a; border-color: #41e07a; } #brawl .pips i.bad { background: #ff5a4a; border-color: #ff5a4a; }
@media (prefers-reduced-motion: reduce) { #brawl, #brawl .key, #brawl .lbl, #brawl .ch { transition: none; } }
`;
const pick = (a) => a[(Math.random() * a.length) | 0];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const ss = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const facing = (dx, dz) => Math.atan2(-dz, dx);
/** a test switch on window (window.__forceJab, window.__qteAuto, window.__qteChoice) -> its value or null */
const flag = (k) => { try { return window[k] || null; } catch (_) { return null; } };
// (a player who has asked the system for less motion gets a gentler shake)
const SHAKE = (() => { try { return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 0.35 : 1; } catch (_) { return 1; } })();
const DT = 1 / 30;
// face to face (m, eye to his middle): close enough that his face fills the frame, far enough that his hands stay
// off the lens (the camera's near plane is 0.3 m)
const D0 = 0.9;
// the crowd's level on the grid walk (ui/PreRace.js), which the noise of a scuffle swells from and goes back to
const CROWD = 0.32;
// how fast each of them runs in to split it up (m/s)
const SPEED = { boss: 3.6, eng: 4.1, mech: 4.5, driver: 4.3 };
const REACTIONS = ['laugh', 'glare', 'push', 'square'];
// how long each of a jab's endings plays (s)
const JAB_END = { laugh: 2.1, glare: 2.3, push: 2.4, square: 1.55 };

// the exchanges: the key, what it says, the hint, and the word for how it came out either way (never a punch)
const BEAT = {
  shove: { key: 'Space', kbd: 'SPACE', label: 'SHOVE', hint: `He's right in your face - push him off`, good: 'GOOD SHOVE', bad: 'SHOVED BACK' },
  left: { key: 'KeyA', kbd: 'A', label: 'SIDESTEP', hint: 'He lunges - step left', good: 'SIDESTEPPED', bad: 'SHOVED BACK' },
  right: { key: 'KeyD', kbd: 'D', label: 'SIDESTEP', hint: 'He lunges - step right', good: 'SIDESTEPPED', bad: 'SHOVED BACK' },
  brace: { key: 'KeyS', kbd: 'S', label: 'BRACE', hint: 'He goes for your overalls - plant your feet', good: 'STOOD FIRM', bad: 'GRABBED YOUR OVERALLS' },
};
const BEAT_KEYS = ['Space', 'KeyA', 'KeyD', 'KeyS'];
// what gets said (heated, never hateful: nobody on the grid wishes anyone harm)
const SAY = {
  square: [`You want to do this here? Really?`, `Go on, then.`, `Say that again.`, `Easy. Think about it.`, `Not on the grid, mate.`, `You've got some nerve.`],
  call: [`Oi! A word.`, `Hey! Yeah, you.`, `We need to talk. Now.`, `Got a minute? Didn't think so.`],
  opener: [`That's for Turn 1.`, `You and me need a word.`, `Got something to say to me?`, `I've had enough of you this weekend.`],
  walk: [`Yeah, walk away.`, `That's what I thought.`, `Typical.`],
  after: [`See you out there.`, `Save it for the track.`, `Later.`, `We're not done, you and me. On track.`],
};
// his answer to a shove, by how he takes it (a team-mate's laugh is his own)
const JAB_SAY = {
  laugh: [`Ha! Get off, you muppet.`, `Ha - is that all you've got?`, `Easy, tiger. Save it for Turn 1.`, `Ha! Somebody's had too much coffee.`],
  mate: [`Oi! Behave. The team's watching.`, `Ha. Not in front of the boss.`, `Same garage, mate. Same garage.`],
  glare: [`Don't touch me.`, `Hands off.`, `Really? Here?`, `Do that again. Go on.`],
  push: [`Back off!`, `Hands off me!`, `Don't push me!`, `What's your problem?`],
  square: [`Right. That's it.`, `Do that one more time.`, `Seriously? Again?`],
};
// the people splitting it up, by who they are
const SEP_SAY = {
  boss: [`Enough! Both of you - now!`, `Not here. Not in front of the cameras.`, `Walk away. That's an order.`],
  eng: [`Hey, hey - leave it!`, `Come on. Walk away. It's not worth it.`],
  mech: [`Oi! Pack it in!`, `Leave it, mate - leave it!`],
  driver: [`Leave it. He's not worth a penalty.`, `Come on, come on - walk away.`],
  crew: [`Easy! Easy!`, `Break it up, lads!`, `Not on the grid!`],
};
// the hints under the two choices (SHOVE BACK / WALK AWAY, then BACK OFF / KEEP GOING)
const CHOICE = { shove: 'Give it straight back to him', walk: 'Rise above it - the cameras are rolling', back: 'Let them split it up', keep: 'One more - the stewards are watching' };
/**
 * the words a jab or a scuffle uses: the grid's own, with any of o.lines laid over them (another place's wording - a
 * club's shirt for the overalls, security for the stewards). o.lines: { say: { square, call, opener, walk, after },
 * sep: { <npc kind>: [..], crew }, jab: { laugh, mate, glare, push, square }, beat: { <move>: { hint, good, bad } },
 * choice: { shove, walk, back, keep } } - every part optional
 */
const linesOf = (x) => !x ? { say: SAY, sep: SEP_SAY, jab: JAB_SAY, beat: BEAT, choice: CHOICE } : {
  say: { ...SAY, ...x.say }, sep: { ...SEP_SAY, ...x.sep }, jab: { ...JAB_SAY, ...x.jab }, choice: { ...CHOICE, ...x.choice },
  beat: Object.fromEntries(Object.keys(BEAT).map((k) => [k, { ...BEAT[k], ...(x.beat?.[k] || {}), key: BEAT[k].key, kbd: BEAT[k].kbd }])),
};

/**
 * How a driver takes a shove, by how many he has had from you today (jabs: n.jabbed unless given), how he gets on with
 * you (n.mood), who he is (n.persona, n.mate) and how composed he is (0..100): the first, a laugh between friends (or
 * from the team-mate) or a look (a stirrer short on composure may shove you straight back); the second, a look or a
 * shove back; the third, he squares up (the team-mate, not always). window.__forceJab picks it (tests)
 * -> 'laugh' | 'glare' | 'push' | 'square'
 */
export function jabReaction(n, composure = 50, jabs = n?.jabbed || 1) {
  const f = flag('__forceJab'); if (REACTIONS.includes(f)) return f;
  const c = composure != null && Number.isFinite(+composure) ? clamp(+composure, 0, 100) : 50, mood = n?.mood || 0, mate = !!n?.mate, stir = n?.persona === 'stirrer', cool = (c - 50) / 50;
  if (jabs <= 1) return stir && c < 35 && Math.random() < 0.15 ? 'push' : mood >= 1 || mate ? 'laugh' : 'glare';
  if (jabs === 2) return Math.random() < clamp(0.6 - cool * 0.15 + (stir ? 0.1 : 0) - Math.max(0, mood) * 0.05 - (mate ? 0.3 : 0), 0.15, 0.85) ? 'push' : 'glare';
  return mate && Math.random() < 0.4 + Math.max(0, cool) * 0.3 ? 'push' : 'square';
}

/** his composure, 0..100: from his career record (morale and its composure offset, as career/Morale.js reads it), else his race-day form, else middling */
export function composureOf(walk, n) {
  const d = n?.did ? walk?.career?.drivers?.[n.did] : null;
  if (d && typeof d.morale === 'number') return clamp(d.morale + (d.moodOff?.composure || 0), 0, 100);
  const p = n?.car?.form?.pressure;
  return typeof p === 'number' ? clamp(50 - (p - 1) / 0.45 * 50, 0, 100) : 50;
}

let THUMP = null;
/** the muffled bump of a shove landing on overalls: a short burst of low noise (no sample needed), only with the sound on */
const thump = (A, k = 1) => {
  if (!A?.ready || A.muted || !A.ctx || !A.sfx) return;
  try {
    const c = A.ctx;
    if (!THUMP || THUMP.ctx !== c) { const n = Math.ceil(c.sampleRate * 0.16), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); THUMP = { ctx: c, b }; }
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = THUMP.b; s.playbackRate.value = 0.85 + Math.random() * 0.3;
    f.type = 'lowpass'; f.frequency.value = 380; g.gain.value = 0.45 * k; s.connect(f); f.connect(g); g.connect(A.sfx); s.onended = () => g.disconnect(); s.start();
  } catch (_) { /* (no sound is fine) */ }
};

// ---- the moves ----------------------------------------------------------------------------------------------------------
/**
 * A there-and-back offset (a stagger, a knock, a lunge, a step aside): m metres along d, out over `out` s and home again
 * over `back` s; hit again while still out it carries on from where it is (it never adds up); hold keeps it out until
 * let go -> v 0..1
 */
class Spring {
  constructor() { this.v = 0; this.a = 0; this.u = 1e9; this.out = 0.12; this.back = 0.5; this.m = 0; this.hold = false; this.d = new THREE.Vector3(); }
  hit(m, delay = 0, out = 0.12, back = 0.5) { this.a = this.v; this.u = -delay; this.m = m; this.out = out; this.back = back; return this; }
  step(dt) {
    const u = (this.u += dt), o = this.out;
    this.v = u < 0 ? this.a : u < o ? this.a + (1 - this.a) * Math.sin(u / o * Math.PI / 2) : this.hold ? 1 : u < o + this.back ? 0.5 + 0.5 * Math.cos((u - o) / this.back * Math.PI) : 0;
    return this.v;
  }
  let() { if (this.hold) { this.hold = false; if (this.u > this.out) this.u = this.out; } }   // (held out: home again from here)
}
/** a shove's push (s since it began) -> how far the arm is out, 0..1 */
const thrust = (s) => s < 0.04 ? 0 : s < 0.14 ? ss((s - 0.04) / 0.1) : s < 0.24 ? 1 : 1 - ss((s - 0.24) / 0.18);
/** a head knocked by a shove to the chest (s since): a quick nod forward and back up -> head.rotation.z offset */
const jerk = (u) => u < 0 || u > 1.2 ? 0 : -0.15 * Math.exp(-u * 6) * Math.sin(u * 15);
let REACH = 0;
/** how far a shove's hands reach in front of the body (the 'shove' pose's wrists, and the hands) -> m */
const reach = () => REACH || (REACH = (() => { try { const J = jointsOf('shove'); return Math.max(0.45, Math.max(J.wrR?.x || 0, J.wrL?.x || 0) + 0.1); } catch (_) { return 0.6; } })());
/** inside a car (the walk's own box for people: GridWalk._pushHQ) */
const inCar = (cars, x, z) => { for (const c of cars || []) { const ex = x - c.x, ez = z - c.z, ca = Math.cos(c.th), sa = Math.sin(c.th); if (Math.abs(ex * ca + ez * sa) < 3.0 && Math.abs(-ex * sa + ez * ca) < 1.2) return true; } return false; };
/** a person (their position, or any {x, z}) moved to (x, z) - or as far along one axis as a car allows -> moved at all */
const moveTo = (cars, p, x, z) => { if (!inCar(cars, x, z)) { p.x = x; p.z = z; return true; } if (!inCar(cars, x, p.z)) { p.x = x; return true; } if (!inCar(cars, p.x, z)) { p.z = z; return true; } return false; };
/** the exchanges, in order: n of them, never the same move twice running (nor two sidesteps), at least one shove; the windows from 0.9 s down to 0.55 s (x q) */
const planBeats = (n, q) => {
  const P = [], side = (k) => k === 'left' || k === 'right'; let prev = null;
  for (let i = 0; i < n; i++) {
    let k; do { const r = Math.random(); k = r < 0.4 ? 'shove' : r < 0.575 ? 'left' : r < 0.75 ? 'right' : 'brace'; } while (k === prev || (side(k) && side(prev)));
    P.push({ k, w: clamp((0.9 - 0.35 * (n > 1 ? i / (n - 1) : 0)) * q, 0.4, 1.2), x: false, ok: null }); prev = k;
  }
  if (!P.some((b) => b.k === 'shove')) P[0].k = 'shove';
  return P;
};

// ---- the people in it ------------------------------------------------------------------------------------------------
/**
 * how a walk npc was built (ui/GridWalk.js, ui/PreRace.js), so a body of theirs in another pose matches -> makePerson
 * options (no head is built: the person's own is carried across, so its detail is only a fallback's)
 */
const kitOf = (W, n) => {
  const me = W.player || {};
  if (n.kind === 'driver') return { kit: 'suit', color: n.car?.color, accent: n.car?.color2, driver: n.car?.name || n.name, detail: 0.35 };
  if (n.kind === 'boss') return { kit: 'jacket', color: me.color, accent: me.color2, teamName: me.team, detail: 0.35 };
  return { kit: 'polo', color: me.color, accent: me.color2, teamName: n.kind === 'eng' ? me.team : undefined, detail: 0.35 };
};
const _M = new THREE.Matrix4();
/**
 * Everything a jab or a scuffle puts on the walk's people, and takes off again: for each person a record (their own
 * body, their head and where it sat, what they were doing) with the extra bodies built for them (frames, by pose), and
 * your two arms. A jab that ends with him squaring up hands its kit on to the scuffle (npc._brawlKit): nothing is built
 * twice.
 */
class Kit {
  /**
   * o (all optional; the grid walk passes none): kitOf(W, n) -> makePerson options for n's extra bodies (default: race
   * kit); armsParent (the group your arms hang off - it must be the parent frame the camera's matrix is in: a venue's
   * group when the camera given is a proxy in that group's frame); sleeve, skin (your arms' colours); lit(obj) (called
   * on the arms and on every body built, e.g. a hosted venue's room lighting)
   */
  constructor(W, o = {}) {
    this.W = W; this.recs = new Map(); this.queue = []; this.builds = 0; this.gone = false;
    this.kitOf = typeof o.kitOf === 'function' ? o.kitOf : kitOf; this.lit = typeof o.lit === 'function' ? o.lit : null;
    // (your own sleeve and skin: your race suit's colour - your own if your look has one, else the team's - and your skin)
    const me = W.player || {}, L = lookOf(me.name || ''), sleeve = o.sleeve || L.suit?.primary || me.color || '#2b2e35', skin = o.skin || L.skin;
    // (the arms hang off a rig that is the eye itself: its matrix is the camera's, every frame, while each arm's own
    // group stays free for shoveArm's set(t) to push it out)
    this.rig = new THREE.Group(); this.rig.name = 'brawl-arms'; this.rig.matrixAutoUpdate = false; this.rig.visible = false;
    this.armR = this.armL = null;
    try { this.armR = shoveArm(sleeve, skin, false); this.armL = shoveArm(sleeve, skin, true); } catch (e) { console.warn('Brawl: no first-person arms', e); }
    for (const a of [this.armR, this.armL]) {
      if (!a?.group) continue; a.group.matrixAutoUpdate = true; this.rig.add(a.group);
      a.group.traverse((m) => { if (!m.isMesh) return; m.frustumCulled = false; const M = m.material; if (W.night && M?.emissive && M.color) M.emissive.copy(M.color).multiplyScalar(0.2); });   // (by night the same lift as everyone on the grid)
    }
    (o.armsParent || W.pre?.group || W.scene)?.add(this.rig);
    if (this.lit) this.lit(this.rig);
  }
  /** the record for one of the walk's people (nothing about them changed yet) -> rec */
  rec(n) {
    let r = this.recs.get(n); if (r) return r;
    const P = n.person;
    r = { n, P, body0: P.group.children[0], neck0: P.head ? P.head.position.clone() : new THREE.Vector3(0.02, 1.48, 0), bow: P.bow || 0, fr: {}, cur: null, shown: false, claimed: false, home: P.group.position.clone() };
    this.recs.set(n, r); return r;
  }
  /** theirs now: the walk and the show leave their head and facing alone (n.brawl, person.busy) -> rec */
  claim(r) { if (r.claimed) return r; r.claimed = true; r.busy0 = !!r.P.busy; r.n.brawl = true; r.P.busy = true; return r; }
  /** a body for n in this pose, queued to be built (one a frame, six in all at most) */
  want(n, pose) { const r = this.rec(n); if (pose in r.fr || this.queue.some((q) => q[0] === r && q[1] === pose) || this.builds + this.queue.length >= 6) return; this.queue.push([r, pose]); }
  /** the next queued body built (one a frame at most: each is a few milliseconds), hidden under the person's own group */
  buildOne() {
    const q = this.queue.shift(); if (!q || this.gone) return; const [r, pose] = q; if (pose in r.fr) return;
    let F = null;
    try { F = makePerson({ pose, ...this.kitOf(this.W, r.n), jitter: 0, headless: true }); } catch (e) { console.warn(`Brawl: no '${pose}' body`, e); }
    this.builds++;
    if (!F?.group) { r.fr[pose] = null; return; }
    if (F.head && F.head !== r.P.head) { F.head.parent?.remove(F.head); F.head.traverse((m) => { if (m.isMesh) m.geometry.dispose(); }); }   // (built with a head after all: the person's own goes in instead)
    // (the person's own materials - their colours, the night's lift, shaders already compiled - so the frame is them;
    // its own are never drawn)
    const own = new Map(); for (const k in F.mats || {}) if (r.P.mats?.[k]) own.set(F.mats[k], r.P.mats[k]);
    F.group.traverse((m) => { if (!m.isMesh) return; if (own.has(m.material)) m.material = own.get(m.material); else if (this.W.night && m.material?.emissive && m.material.color) m.material.emissive.copy(m.material.color).multiplyScalar(0.2); });
    for (const M of own.keys()) M.dispose();
    // (under the person's group, which already carries where they stand, their facing and their size)
    F.group.visible = false; F.group.position.set(0, 0, 0); F.group.rotation.set(0, 0, 0); F.group.scale.set(1, 1, 1); r.P.group.add(F.group);
    if (this.lit) this.lit(F.group);
    r.fr[pose] = F;
  }
  /** which body r shows: a frame by pose, or their own (null) - the head goes with it, at its neck -> the frame or null */
  show(r, pose) {
    const F = (pose && r.fr[pose]) || null; if (F === r.cur && r.shown) return F; r.shown = true;
    for (const k in r.fr) if (r.fr[k]) r.fr[k].group.visible = r.fr[k] === F;
    if (r.body0) r.body0.visible = !F;
    const h = r.P.head, b = F ? (F.group.children.find((c) => c.isGroup) || F.group) : r.body0;
    if (h && b) { if (h.parent !== b) b.add(h); h.position.copy(F ? (F.neck || r.neck0) : r.neck0); }
    r.cur = F; r.bow = F && typeof F.bow === 'number' ? F.bow : (r.P.bow || 0); return F;
  }
  /** r as they were: their own body and head (where it sat, level), upright, the frames gone, the walk's again */
  release(r) {
    this.show(r, null); const P = r.P, h = P.head;
    if (h) { h.rotation.z = P.bow || 0; h.rotation.y = 0; }
    P.group.rotation.x = 0; P.group.rotation.z = 0; P.group.position.y = 0;
    for (const k in r.fr) { const F = r.fr[k]; if (!F) continue; P.group.remove(F.group); try { F.dispose(); } catch (_) { /* (already gone with the show) */ } }
    r.fr = {}; this.queue = this.queue.filter((q) => q[0] !== r);
    if (r.claimed) { r.n.brawl = false; P.busy = r.busy0; r.claimed = false; }
    this.recs.delete(r.n);
  }
  /** your arms where the eye is (after the camera's matrix is final): y lifts them into view (0) or lowers them, t pushes them out */
  arms(cam, y, tR, tL, on) {
    const R = this.rig; R.visible = !!on && !!(this.armR || this.armL); if (!R.visible) return;
    R.matrix.multiplyMatrices(cam.matrixWorld, _M.makeTranslation(0, y, 0)); R.matrixWorldNeedsUpdate = true;
    this.armR?.set?.(tR); this.armL?.set?.(tL);
  }
  /** everyone put back (heads first, so no frame takes one with it), the arms gone */
  dispose() {
    if (this.gone) return; this.gone = true;
    for (const r of [...this.recs.values()]) this.release(r);
    this.queue = []; this.rig.parent?.remove(this.rig);
    for (const a of [this.armR, this.armL]) { if (!a) continue; if (a.dispose) a.dispose(); else a.group?.traverse((m) => { if (m.isMesh) { m.geometry.dispose(); m.material?.dispose?.(); } }); }
    this.armR = this.armL = null;
  }
}

// ---- what a jab and a scuffle share --------------------------------------------------------------------------------------
/**
 * The eye (walk.pos, yaw and pitch, plus the knocks and a shake: a jab or a scuffle owns the camera while it plays,
 * and leaves the walk's own pos/yaw/pitch at the final view), your arms, and him: his spot, stagger and lunge, which
 * body, his lean, head and facing. What he says goes up over him (#brawl .say).
 */
class Act {
  /** o: the host's options (Kit's, plus lines and seps: see Brawl) - none on the grid walk */
  constructor(walk, npc, o = {}) {
    this.W = walk; this.n = npc; this.cam = walk.camera; this.t = 0; this.done = false; this.gone = false; this.kit = null; this.tg = null; this.el = null; this.q = null;
    this.o = o || {}; this.L = linesOf(this.o.lines);
    this.kb = new Spring(); this.ln = new Spring(); this.sd = new Spring();   // (the eye: knocked back, lunging in, a step aside)
    this.sh = 0; this.jAt = null; this.jK = 0; this.cw = 0; this.redT = 0; this.sayT = 0; this.sayD = 2.6; this.noAim = false; this.ev = {};
    this.fov0 = this.cam.fov; this.zoom = 0; this.zoomGoal = 0;
    this.arm = { y: -0.4, t: 0, gy: -0.4, gt: 0, a: 9, y0: -0.4 };
    this.ax = new THREE.Vector3(1, 0, 0); this.rt = new THREE.Vector3(0, 0, 1); this.dist = 1;   // (from you to him, and your right of that line)
  }
  /** his record ready to be moved about */
  _mark(r) { if (!r.st) Object.assign(r, { st: new Spring(), lg: new Spring(), side: 0, sideGoal: 0, sway: 0, lean: 0, leanGoal: 0, hz: 0, hzGoal: 0, jk: 9, osc: 0, look: 0, away: false, pose: null, goal: null, goalV: new THREE.Vector3(), gs: 1.6, walk: 0, stuck: 0, sl: 0 }); return r; }
  _ok(x, z) { return !this.W._free || this.W._free(x, z); }
  /** a step of yours, each way only onto open ground (the walk's own test) -> moved at all */
  _step(dx, dz) { const p = this.W.pos; let m = false; if (dx && this._ok(p.x + dx, p.z)) { p.x += dx; m = true; } if (dz && this._ok(p.x, p.z + dz)) { p.z += dz; m = true; } return m; }
  /** the line between you (from you to his spot) and your right of it, flat */
  _axes() {
    const h = this.tg.home, p = this.W.pos; let dx = h.x - p.x, dz = h.z - p.z, d = Math.hypot(dx, dz);
    if (d < 1e-3) { dx = Math.cos(this.W.yaw); dz = Math.sin(this.W.yaw); d = 1; }
    this.ax.set(dx / d, 0, dz / d); this.rt.set(-this.ax.z, 0, this.ax.x); this.dist = d;
  }
  /** where he means to stand: d metres from you along the line (if that is clear of the cars) */
  _goal(d) { const r = this.tg, e = this.W.pos, x = e.x + this.ax.x * d, z = e.z + this.ax.z * d; r.goal = inCar(this.W.cars, x, z) ? null : r.goalV.set(x, 0, z); }
  /** a step of v for r's spot toward (gx, gz): straight on, else along a car's side (the way it went last, else the other) -> progress */
  _walkStep(r, gx, gz, v) {
    const h = r.home, cars = this.W.cars, dx = gx - h.x, dz = gz - h.z, d = Math.hypot(dx, dz) || 1, ux = dx / d, uz = dz / d;
    if (!inCar(cars, h.x + ux * v, h.z + uz * v)) { h.x += ux * v; h.z += uz * v; return v; }
    const s0 = r.sl || (r.sl = Math.random() < 0.5 ? 1 : -1);
    for (const s of [s0, -s0]) { const x = h.x - uz * s * v, z = h.z + ux * s * v; if (!inCar(cars, x, z)) { h.x = x; h.z = z; r.sl = s; return v * 0.3; } }
    return 0;
  }
  /** the eye turned toward (x, y, z) at rate k */
  _aim(x, y, z, k, dt) { const W = this.W, dx = x - W.pos.x, dz = z - W.pos.z, f = Math.min(1, dt * k); W.yaw += wrap(Math.atan2(dz, dx) - W.yaw) * f; W.pitch += (Math.atan2(y - W.pos.y, Math.hypot(dx, dz)) - W.pitch) * f; }
  /** the crowd's noise up (it goes back down by itself: never the gasps, which belong to the bad days) */
  _crowd(v) { const c = this.W.pre?.crowd; if (!c?.to) return; c.to(v, 0.3); this.cw = 1.6; }
  _crowdTick(dt) { if (this.cw > 0 && (this.cw -= dt) <= 0) this.W.pre?.crowd?.to?.(CROWD, 1.2); }
  /** a jolt at t + delay: the shake, the thump, the crowd (and a red edge for a big one, in the scuffle) */
  _jolt(k, delay = 0) { this.jAt = this.t + delay; this.jK = k; }
  /** you, shoved: knocked back m metres (and back again), shaken, your hands knocked down */
  _knock(m, k, delay = 0) { this.kb.d.copy(this.ax).negate(); this.kb.hit(m, delay, 0.12, 0.5); this._jolt(k, delay); this.arm.y -= 0.1; }
  /** your arms: a two-handed shove from wherever they are */
  _shove() { this.arm.y0 = Math.min(this.arm.y, -0.08); this.arm.a = 0; }
  /** you shove him: both hands out, a half-step into it, and him back a step */
  _youShove() { const r = this.tg; this._shove(); this.ln.d.copy(this.ax); this.ln.hit(0.07, 0.02, 0.1, 0.32); r.st.hit(0.3, 0.09, 0.12, 0.5); r.jk = -0.09; this._jolt(0.22, 0.09); }
  /** a line said, over him (name: who says it), up for dur s */
  _say(name, line, dur = 2.6) { const q = this.q; if (!q?.say) return; q.say.innerHTML = `<b>${esc(name)}</b>${esc(line)}`; this.sayT = this.sayD = dur; }
  _sayTick(dt) { const q = this.q; if (!q?.say || this.sayT <= 0) return; this.sayT = Math.max(0, this.sayT - dt); q.say.style.opacity = Math.max(0, Math.min(1, this.sayT * 2, (this.sayD - this.sayT) * 5)); }
  /** the lens as the walk had it */
  _unzoom() { const c = this.cam; this.zoom = this.zoomGoal = 0; if (c && c.fov !== this.fov0) { c.fov = this.fov0; c.updateProjectionMatrix(); } }

  /** him: his spot (stepping to where he means to stand), pushed back, lunging in, to one side; which body; lean, head, facing */
  _body(dt) {
    const r = this.tg, P = r.P, g = P.group.position, W = this.W, e = this.cam.position, t = this.t;
    if (r.goal) {
      const d = Math.hypot(r.goal.x - r.home.x, r.goal.z - r.home.z);
      if (d < 0.02) { r.goal = null; r.stuck = 0; }
      else { const v = Math.min(d, r.gs * dt), m = this._walkStep(r, r.goal.x, r.goal.z, v); if (m > 0) { r.walk += v; r.stuck = 0; } else r.stuck += dt; }
    }
    this._axes();
    const st = r.st.step(dt), lg = r.lg.step(dt), f = Math.min(1, dt * 7), ax = this.ax, rt = this.rt;
    r.side += (r.sideGoal - r.side) * f; r.lean += (r.leanGoal - r.lean) * f; r.hz += (r.hzGoal - r.hz) * Math.min(1, dt * 8);
    const pose = st > 0.18 ? 'stagger' : lg > 0.18 ? 'shove' : r.pose, F = this.kit.show(r, pose);
    const off = st * r.st.m - lg * r.lg.m, sd = r.side + r.sway * Math.sin(t * 2.6);
    let x = r.home.x + ax.x * off + rt.x * sd, z = r.home.z + ax.z * off + rt.z * sd;
    // (never so close that his hands are at the lens)
    const min = (pose === 'shove' ? reach() : 0.36) + 0.38, dx = x - e.x, dz = z - e.z, d = Math.hypot(dx, dz);
    if (d < min) { const ux = d > 1e-3 ? dx / d : ax.x, uz = d > 1e-3 ? dz / d : ax.z; x = e.x + ux * min; z = e.z + uz * min; }
    moveTo(W.cars, g, x, z);
    g.y = r.goal ? 0.02 * Math.abs(Math.sin(r.walk * Math.PI / 0.7)) : 0;
    // leaning: back when shoved, into it when he lunges (more without a frame for it), shaking with a laugh
    P.group.rotation.z = r.lean + st * (F ? 0.1 : 0.22) - lg * (F ? 0.08 : 0.14) + r.osc * 0.35 * Math.sin(t * 17 + 0.6);
    P.group.rotation.y += wrap(facing(e.x - g.x, e.z - g.z) + (r.away ? Math.PI : 0) - P.group.rotation.y) * Math.min(1, dt * (r.away ? 3 : 8));
    const h = P.head; if (h) { r.jk += dt; h.rotation.z = r.bow + r.hz + jerk(r.jk) + r.osc * Math.sin(t * 17); h.rotation.y += (r.look - h.rotation.y) * Math.min(1, dt * 5); }
  }
  /** the camera: from walk.pos, yaw and pitch (and the walk's own bob), with the knocks (each only onto open ground), the shake and a touch of zoom; then your arms on it */
  _view(dt) {
    const W = this.W, cam = this.cam, p = W.pos, t = this.t;
    if (this.jAt != null && t >= this.jAt) { const k = this.jK; this.jAt = null; this.sh = Math.max(this.sh, k * SHAKE); thump(W.audio, Math.min(1, 0.4 + k * 0.6)); if (k >= 0.6) this.redT = 0.45; this._crowd(0.42 + 0.08 * Math.min(1, k)); }
    const a = this.kb.step(dt) * this.kb.m, b = this.ln.step(dt) * this.ln.m, c = this.sd.step(dt) * this.sd.m;
    let ox = this.kb.d.x * a + this.ln.d.x * b + this.sd.d.x * c, oz = this.kb.d.z * a + this.ln.d.z * b + this.sd.d.z * c;
    if (!this._ok(p.x + ox, p.z)) ox = 0;
    if (!this._ok(p.x + ox, p.z + oz)) oz = 0;
    this.sh *= Math.exp(-dt * 5);
    this.zoom += (this.zoomGoal - this.zoom) * Math.min(1, dt * 2.5);
    const fov = this.fov0 - 3.5 * this.zoom; if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const sh = this.sh, fx = Math.cos(W.yaw), fz = Math.sin(W.yaw), sx = sh * 0.03 * Math.sin(t * 57), sy = sh * 0.02 * Math.sin(t * 71 + 1.3), by = Math.sin(W.bob || 0) * 0.025;
    cam.position.set(p.x + ox - fz * sx, p.y + by + sy - 0.05 * this.kb.v, p.z + oz + fx * sx);
    const yaw = W.yaw + sh * 0.025 * Math.sin(t * 37 + 2.1), pit = W.pitch + sh * 0.02 * Math.sin(t * 49), cp = Math.cos(pit);
    cam.up.set(0, 1, 0); cam.lookAt(cam.position.x + Math.cos(yaw) * cp, cam.position.y + Math.sin(pit), cam.position.z + Math.sin(yaw) * cp);
    const roll = sh * 0.045 * Math.sin(t * 43 + 0.7); if (roll) cam.rotateZ(roll);
    cam.updateMatrixWorld();
    this._arms(dt);
  }
  /** your arms: eased to where they are wanted (gy, gt) with a breath in them, or a shove playing (a < 0.42) */
  _arms(dt) {
    const A = this.arm, K = this.kit; if (!K) return;
    let y, tR, tL;
    if (A.a < 0.42) { A.a += dt; const s = A.a; y = s < 0.08 ? A.y0 * (1 - ss(s / 0.08)) : s < 0.26 ? 0 : A.y0 * ss((s - 0.26) / 0.16); tR = thrust(s); tL = thrust(s - 0.03); A.y = y; A.t = 0; }
    else { const f = Math.min(1, dt * 12); A.y += (A.gy - A.y) * f; A.t += (A.gt - A.t) * f; y = A.y + (A.gy > -0.3 ? 0.006 * Math.sin(this.t * 2.3) : 0); tR = tL = A.t; }
    K.arms(this.cam, y, tR, tL, y > -0.33);
  }
}

// =====================================================================================================================
// The jab: your shove, his stagger, and his answer (a laugh, a look, a shove back, or squaring up: then a Brawl)
// =====================================================================================================================
export class Jab extends Act {
  /**
   * o: { walk (the GridWalk), npc (the driver in front of you), composure (his, 0..100; from the career or his form if
   *      left out), reaction (to force one), jabs (which jab on him this is; else counted here on npc.jabbed),
   *      onDone(outcome) }
   * outcome: { reaction 'laugh'|'glare'|'push'|'square', jabs, composure, dur }. On 'square' (state.stage 'square') the
   * walk starts a Brawl for the same npc - before disposing this one - and the Brawl takes over his squared-up body,
   * the frames already built and your arms.
   * state: { stage 'shove'|'react'|'reply'|'square'|'done', beat: null, outcome, reaction }
   */
  constructor({ walk, npc, composure = null, reaction = null, jabs = null, onDone = null, kitOf: kf = null, lines = null, armsParent = null, lit = null, sleeve = null, skin = null }) {
    super(walk, npc, { kitOf: kf, lines, armsParent, lit, sleeve, skin });
    this.onDone = onDone;
    const c = composure ?? composureOf(walk, npc), j = npc.jabbed = jabs != null ? Math.max(npc.jabbed || 0, jabs | 0) : (npc.jabbed || 0) + 1;
    this.reaction = REACTIONS.includes(reaction) ? reaction : jabReaction(npc, c, j);
    this.out = { reaction: this.reaction, jabs: j, composure: Math.round(c), dur: 0 };
    this.state = { stage: 'shove', beat: null, outcome: null, reaction: this.reaction };
    const K = this.kit = new Kit(walk, this.o); this.tg = this._mark(K.claim(K.rec(npc)));
    // (squaring up: that body first, the scuffle will want it; otherwise the stagger your shove is about to cause)
    if (this.reaction === 'square') K.want(npc, 'guard');
    K.want(npc, 'stagger'); if (this.reaction === 'push') K.want(npc, 'shove');
    this._axes(); this.close = Math.max(0, this.dist - D0); this.moved = 0;   // (you step in to him as you shove)
    this._shove(); this._dom();
  }
  /** (nothing to press in a jab) */
  key() { return false; }
  update(dt) {
    if (this.done) return;
    dt = Math.min(DT, Math.max(0, dt || 0)); this.t += dt;
    const t = this.t, r = this.tg, x = this.ev, R = this.reaction;
    this.kit.buildOne();
    // you: a step in to him and both hands on his chest
    if (this.moved < this.close) { const v = Math.min(this.close - this.moved, this.close * dt / 0.15); this._step(this.ax.x * v, this.ax.z * v); this.moved += v; }
    if (!x.on && t >= 0.13) { x.on = true; r.st.hit(0.26, 0, 0.12, 0.55); r.jk = 0; this._jolt(0.25); this.state.stage = 'react'; }
    // and how he takes it
    if (!x.reply && t >= 0.75) {
      x.reply = true; this.state.stage = 'reply';
      this._say(this.n.name, pick(R === 'laugh' && this.n.mate ? this.L.jab.mate : this.L.jab[R]), R === 'square' ? 2.6 : JAB_END[R] - 0.8);
      if (R === 'laugh') { r.hzGoal = 0.13; r.osc = 0.045; r.leanGoal = 0.03; }
      else if (R === 'glare') { r.hzGoal = -0.07; r.leanGoal = -0.05; r.gs = 0.8; this._goal(0.8); }
      else if (R === 'push') { r.pose = 'shove'; r.leanGoal = -0.08; }
      else { r.pose = 'guard'; r.hzGoal = 0.05; r.leanGoal = -0.03; r.gs = 1.4; this._goal(D0); this._crowd(0.46); }
    }
    if (R === 'push') {
      // (he shoves you back, once: knocked 0.3 m and back, no more than that)
      if (!x.lunge && t >= 0.82) { x.lunge = true; r.lg.hit(0.22, 0, 0.14, 0.55); this._knock(0.3, 0.75, 0.12); }
      if (!x.calm && t >= 1.55) { x.calm = true; r.pose = null; r.hzGoal = -0.06; r.leanGoal = -0.02; }
    }
    if (R === 'laugh' && t >= 1.8) { r.osc = 0; r.hzGoal = 0; r.leanGoal = 0; }
    if (R === 'glare' && t >= 2.0) { r.hzGoal = 0; r.leanGoal = 0; }
    this._body(dt);
    const g = r.P.group.position; this._aim(g.x, 1.5, g.z, 6, dt);
    this._view(dt); this._sayTick(dt); this._crowdTick(dt);
    if (t >= JAB_END[R]) this._finish();
  }
  _dom() {
    if (!document.getElementById('brawl-css')) { const st = document.createElement('style'); st.id = 'brawl-css'; st.textContent = CSS; document.head.appendChild(st); }
    document.getElementById('brawl')?.remove();
    const el = this.el = document.createElement('div'); el.id = 'brawl'; el.className = 'jab in';
    el.innerHTML = `<div class="say"></div>`; document.body.appendChild(el);
    this.q = { say: el.querySelector('.say') };
  }
  _finish() {
    if (this.done) return; this.done = true; this.out.dur = +this.t.toFixed(2); this.state.outcome = this.out;
    if (this.reaction === 'square' && this.kit && !this.kit.gone) { this.kit.rig.visible = false; this.n._brawlKit = this.handed = this.kit; this.kit = null; this.state.stage = 'square'; }
    else { this.kit?.dispose(); this.kit = null; this.state.stage = 'done'; this.el?.remove(); this.el = this.q = null; if (this.cw > 0) { this.cw = 0; this.W.pre?.crowd?.to?.(CROWD, 1.2); } }
    this.onDone?.(this.out);
  }
  /** gone (a quit, or once done): everything put back - a squared-up kit too, unless a Brawl has taken it on */
  dispose() {
    if (!this.done) { this.done = true; this.state.stage = 'done'; }
    this.kit?.dispose(); this.kit = null; if (this.zoom) this._unzoom();   // (a jab never zooms: a Brawl that took over has the lens now)
    if (this.handed && this.n._brawlKit === this.handed) { this.handed.dispose(); this.n._brawlKit = null; if (this.cw > 0) { this.cw = 0; this.W.pre?.crowd?.to?.(CROWD, 1.2); } }
    this.handed = null; this.el?.remove(); this.el = this.q = null;
  }
}

// =====================================================================================================================
// The scuffle: squaring up, the exchanges, the separators, the last choice, pulled apart
// =====================================================================================================================
export class Brawl extends Act {
  /**
   * o: { walk (the GridWalk), npc (the driver), qte (your FORM.qte: the windows' multiplier), started (true: you started
   *      it with a jab; false: he came over and shoved you), onDone(outcome) }
   *    and, for another host than the grid walk (all optional, defaults unchanged): kitOf(walk, npc) -> makePerson
   *    options for the extra bodies; lines (another place's wording: see linesOf); armsParent (the group the camera's
   *    frame is in - with a proxy camera in a venue group's frame, that group); seps(m, npc) -> 'you' | 'tgt' | null
   *    (who of walk.npcs comes to split it up, holding you or him; replaces the grid's team rule); lit(obj); sleeve,
   *    skin (your arms)
   * outcome: { result 'won'|'lost'|'even', beats, hit, missed, escalated, backedOff, walkedAway, started, separators
   *            [names], dur } (+ aborted: true when he came for you and never got there - nothing happened at all)
   * state: { stage, beat: { key, open, t (s left in the window), w, kind, i, extra, ok } | null, outcome }
   */
  constructor({ walk, npc, qte = 1, started = true, onDone = null, kitOf: kf = null, lines = null, armsParent = null, seps = null, lit = null, sleeve = null, skin = null }) {
    super(walk, npc, { kitOf: kf, lines, armsParent, seps, lit, sleeve, skin });
    this.onDone = onDone; this.qte = clamp(+qte || 1, 0.6, 1.5); this.started = started !== false;
    const K0 = npc._brawlKit; npc._brawlKit = null; this.fromJab = !!(K0 && !K0.gone);
    const K = this.kit = this.fromJab ? K0 : new Kit(walk, this.o); this.tg = this._mark(K.claim(K.rec(npc)));
    for (const p of this.started ? ['guard', 'stagger', 'shove', 'held'] : ['shove', 'guard']) K.want(npc, p);   // (he started it: the rest only if you shove back)
    this.out = { result: 'even', beats: 0, hit: 0, missed: 0, escalated: false, backedOff: false, walkedAway: false, started: this.started, separators: [], dur: 0 };
    this.state = { stage: null, beat: null, outcome: null };
    this.plan = planBeats(3 + ((Math.random() * 3) | 0), this.qte); this.bi = -1; this.B = null; this.ph = null; this.pu = 0; this.su = 0; this.pressed = false;
    this.sc = { h: 0, w: 0 }; this.seps = []; this.crew = []; this.picked = false; this.ua = new THREE.Vector3(); this.ap = null; this.flT = 0; this.chOn = false;
    this._axes(); this._dom();
    this._stage(this.started ? 'square' : this.dist > 1.3 ? 'approach' : 'opener');
  }

  /** a key (its code) -> whether the scuffle took it (inside a window: its key a success, any other move a miss; outside, nothing) */
  key(code) {
    if (this.done) return false;
    if (this.st === 'choose0' || this.st === 'final') {
      if (code !== 'KeyE' && code !== 'KeyF') return false;
      if (this.su >= 0.35) this._choose(code === 'KeyF');   // (not in the first moment: a key still down from the last exchange)
      return true;
    }
    if (!BEAT_KEYS.includes(code)) return false;
    if (this.st === 'beats' && this.ph === 'open' && !this.pressed) this._press(code === this.L.beat[this.B.k].key);
    return true;
  }

  update(dt) {
    if (this.done) return;
    dt = Math.min(DT, Math.max(0, dt || 0)); this.t += dt; this.su += dt;
    this.kit.buildOne();
    const r = this.tg, W = this.W;
    switch (this.st) {
      case 'approach':
        // he comes over to you, round the cars if he has to (if he cannot get to you, it never happens)
        this._goal(D0 + 0.05);
        if (this.dist <= D0 + 0.15) this._stage('opener');
        else if (this.su > 6 || r.stuck > 0.8) { if (this.dist < 1.5) this._stage('opener'); else { this.out.aborted = true; this._finish(); } }
        break;
      case 'opener': if (this.su >= 0.85) this._stage('choose0'); break;
      case 'choose0': case 'final': {
        const a = flag('__qteChoice');
        if (a && this.su >= 0.6) this._choose(a === 'go'); else if (this.su >= 2.5) this._choose(false);
        break;
      }
      case 'shoveback': if (this.su >= 0.7) this._stage('square'); break;
      case 'walkaway': {
        // (it is over at once: you turn on your heel and step off, his parting shot behind you)
        const A = this.ap, want = 0.45 * ss(this.su / 0.7), v = want - A.you, f = Math.min(1, dt * 3.5);
        if (v > 1e-4) { this._step(-this.ua.x * v, -this.ua.z * v); A.you = want; }
        W.yaw += wrap(A.yaw0 + A.dir * 1.1 - W.yaw) * f; W.pitch += (-0.05 - W.pitch) * f;
        if (this.su > 0.4) this.arm.gy = -0.4;
        if (this.su >= 1) this._finish();
        break;
      }
      case 'square': if (this.su >= 1) this._beat(0); break;
      case 'beats': this._beatTick(dt); break;
      case 'seps': {
        // (the last few strides of whoever is coming: the choice when they have hold of you both, or soon after)
        const coming = this.seps.some((s) => s.st === 'run' || s.st === 'wait') || this.crew.some((c) => c.sent && c.p.path);
        if (this.su >= 1.8 || (this.su >= 0.3 && !coming)) this._stage('final');
        break;
      }
      case 'apart': this._apartTick(dt); break;
    }
    if (this.done) return;
    this._body(dt); this._seps(dt);
    if (!this.noAim) { const g = r.P.group.position; this._aim(g.x, 1.5, g.z, this.st === 'approach' ? 3 : 6, dt); }
    this._view(dt); this._hud(dt); this._crowdTick(dt);
  }

  // ---- the running order ---------------------------------------------------------------------------------------------
  _stage(s) {
    const r = this.tg; this.st = s; this.su = 0; this.state.stage = s; this.state.beat = null;
    switch (s) {
      case 'approach': r.pose = null; r.gs = 2.3; this.arm.gy = -0.4; this._cap('COMING YOUR WAY'); this._say(this.n.name, pick(this.L.say.call)); break;
      case 'opener': r.goal = null; r.pose = 'shove'; r.leanGoal = -0.08; r.lg.hit(0.22, 0, 0.14, 0.55); this._knock(0.4, 1, 0.12); this.zoomGoal = 0.5; this._cap('HE SHOVED YOU'); this._say(this.n.name, pick(this.L.say.opener)); break;
      case 'choose0': r.pose = 'guard'; r.leanGoal = -0.03; r.hzGoal = 0.05; this.arm.gy = -0.12; this.zoomGoal = 0.6; this._choice(['SHOVE BACK', 'F', this.L.choice.shove], ['WALK AWAY', 'E', this.L.choice.walk], 'E'); break;
      case 'shoveback': this.kit.want(this.n, 'stagger'); this.kit.want(this.n, 'held'); this._youShove(); this._flash('GOOD SHOVE', 'good'); break;
      case 'walkaway':
        this.noAim = true; this.ua.copy(this.ax); this.ap = { dir: Math.random() < 0.5 ? -1 : 1, yaw0: this.W.yaw, you: 0 }; this.zoomGoal = 0;
        r.pose = null; r.hzGoal = -0.05; r.leanGoal = 0; this.arm.gy = -0.03; this.arm.gt = 0;
        this._cap('WALKING AWAY'); this._flash('WALKED AWAY', ''); this._say(this.n.name, pick(this.L.say.walk));
        break;
      case 'square':
        if (!this.picked) { this.picked = true; this._pickSeps(); }
        r.pose = 'guard'; r.hzGoal = 0.05; r.leanGoal = -0.03; r.gs = 1.4; r.sway = 0.03; this._goal(D0); this.arm.gy = -0.1; this.arm.gt = 0; this.zoomGoal = 1;
        this._cap('SQUARING UP'); if (this.started) this._say(this.n.name, pick(this.L.say.square)); this._crowd(0.46); this._pips();
        break;
      case 'seps':
        // (anyone still to set off goes now)
        for (const x of this.seps) if (x.st === 'wait') x.at = this.t;
        for (const c of this.crew) if (!c.sent && !c.dead) c.at = this.t;
        r.pose = 'guard'; r.leanGoal = -0.03; r.sideGoal = 0; r.hzGoal = 0.04; r.sway = 0.025; this.zoomGoal = 0.8;
        break;
      case 'final': {
        // held apart: him held back by his own people, you by yours (if anyone came) - and the choice
        const hold = this.seps.filter((x) => x.st === 'hold'), crew = this.crew.some((c) => c.sent && !c.p.path);
        const heldHim = crew || hold.some((x) => x.holds === 'tgt'), heldYou = hold.some((x) => x.holds === 'you'), s0 = hold[0];
        r.pose = heldHim ? 'held' : 'guard'; r.leanGoal = heldHim ? 0.05 : -0.02; r.hzGoal = 0.03; r.sideGoal = 0; r.sway = heldHim ? 0 : 0.02;
        if (heldHim) this._goal(D0 + 0.15);
        if (heldYou) { this.kb.d.copy(this.ax).negate(); this.kb.hold = true; this.kb.hit(0.1, 0, 0.3, 0.5); }
        this._cap(heldHim || heldYou ? 'HELD APART' : 'STAND-OFF'); this.zoomGoal = 0.6;
        const SP = this.L.sep;
        if (s0) this._say(s0.m.name, pick(SP[s0.m.kind] || SP.crew)); else if (crew) this._say('Mechanic', pick(SP.crew)); else this._say(this.n.name, pick(this.L.say.square));
        this._choice(['BACK OFF', 'E', this.L.choice.back], ['KEEP GOING', 'F', this.L.choice.keep], 'E');
        break;
      }
      case 'apart': {
        this.kb.let(); this._promptOff(); this._choiceOff(); this.ua.copy(this.ax); this.zoomGoal = 0;
        this.ap = { dir: Math.random() < 0.5 ? -1 : 1, yaw0: this.W.yaw, you: 0 };
        r.leanGoal = 0; r.hzGoal = 0; r.sideGoal = 0; r.sway = 0; r.gs = 1.0; r.goal = r.goalV.set(r.home.x + this.ax.x, 0, r.home.z + this.ax.z);
        if (inCar(this.W.cars, r.goal.x, r.goal.z)) r.goal = null;
        this.arm.gy = this.out.backedOff ? -0.03 : -0.4; this.arm.gt = 0;
        this._cap(this.out.backedOff ? 'BACKING OFF' : 'PULLED APART');
        break;
      }
    }
  }
  /** BACK OFF / WALK AWAY (false) or KEEP GOING / SHOVE BACK (true) */
  _choose(go) {
    this._choiceOff();
    if (this.st === 'choose0') { if (go) this._stage('shoveback'); else { this.out.walkedAway = true; this._stage('walkaway'); } return; }
    if (go) {
      // one more: you shake off whoever has hold of you and go again (the last exchange counts double)
      this.out.escalated = true; this.kb.let(); this.tg.pose = 'guard'; this.tg.leanGoal = -0.04; this.zoomGoal = 1;
      this.plan.push({ k: Math.random() < 0.55 ? 'shove' : 'brace', w: clamp(0.62 * this.qte, 0.4, 1), x: true, ok: null });
      this._beat(this.plan.length - 1);
    } else { this.out.backedOff = true; this._stage('apart'); }
  }

  // ---- the exchanges -------------------------------------------------------------------------------------------------
  _beat(i) {
    const b = this.B = this.plan[i], D = this.L.beat[b.k], r = this.tg; this.bi = i; this.ph = 'tell'; this.pu = 0; this.pressed = false;
    this.st = 'beats'; this.su = 0; this.state.stage = 'beats';
    this.state.beat = { key: D.key, open: false, t: b.w, w: b.w, kind: b.k, i, extra: b.x, ok: null };
    // his tell: leaning in (your chance to shove him off), his weight going to one side (a lunge coming), his hands coming for you (a grab)
    r.pose = b.k === 'shove' ? 'guard' : 'shove'; r.leanGoal = b.k === 'shove' ? -0.06 : -0.1; r.sideGoal = b.k === 'left' ? 0.12 : b.k === 'right' ? -0.12 : 0; r.hzGoal = b.k === 'brace' ? -0.03 : 0.04; r.sway = 0.015;
    if (i === 0) this.seps.slice(0, 2).forEach((s) => this.kit.want(s.m, 'restrain'));
    this._retime(i);
    if (b.x) this._cap('ONE MORE'); else if (!this.ev.run) this._cap('NOSE TO NOSE');
    this._pips();
  }
  /** when each of them sets off: so as to get there as the exchanges run out (worked out again at every exchange, as they go quicker or slower) */
  _retime(i) {
    let T = 0; for (let j = i; j < this.plan.length; j++) T += 0.9 + this.plan[j].w * 0.7;
    for (const s of this.seps) if (s.st === 'wait') s.at = this.t + Math.max(0.2, T - s.travel - 0.35);
    for (const c of this.crew) if (!c.sent && !c.dead) c.at = this.t + Math.max(0.15, T - c.est - 0.5);
  }
  _beatTick(dt) {
    const b = this.B, D = this.L.beat[b.k], S = this.state.beat, r = this.tg; this.pu += dt;
    if (this.ph === 'tell') { if (this.pu >= 0.25) { this.ph = 'open'; this.pu = 0; S.open = true; this._prompt(D); this.auto = flag('__qteAuto'); } }
    else if (this.ph === 'open') {
      S.t = Math.max(0, b.w - this.pu);
      if (this.auto && this.pu >= b.w * 0.5) this.key(this.auto === 'miss' ? (D.key === 'Space' ? 'KeyS' : 'Space') : D.key);   // (tests: window.__qteAuto presses for you, mid-window)
      else if (this.pu >= b.w) this._press(false, true);
    } else if (this.ph === 'res') {
      if (this.pu >= 0.5) { this.ph = 'gap'; this.pu = 0; r.pose = 'guard'; r.leanGoal = -0.03; r.sideGoal = 0; r.hzGoal = 0.04; this.arm.gy = -0.1; this.arm.gt = 0; }
    } else if (this.pu >= 0.15) {
      if (this.bi + 1 < this.plan.length) this._beat(this.bi + 1);
      else this._stage(b.x ? 'apart' : this.seps.length || this.crew.length ? 'seps' : 'final');
    }
  }
  /** an exchange decided: ok (the right move inside the window) or not (the wrong one, or too slow) */
  _press(ok, late = false) {
    const b = this.B, D = this.L.beat[b.k], S = this.state.beat, o = this.out, k = b.x ? 2 : 1;
    this.pressed = true; this.ph = 'res'; this.pu = 0; S.open = false; S.t = 0; S.ok = ok; b.ok = ok; this._promptOff();
    o.beats++; if (ok) o.hit++; else o.missed++; this.sc.w += k; if (ok) this.sc.h += k;
    this._flash(ok ? D.good : D.bad, ok ? 'good' : 'bad', late ? 'TOO SLOW' : ok ? '' : 'WRONG MOVE');
    this._play(b.k, ok); this._pips();
  }
  /** how an exchange plays out: yours (a shove landing, a sidestep, standing firm) or his (you shoved back, grabbed) */
  _play(k, ok) {
    const r = this.tg;
    if (k === 'shove' && ok) this._youShove();
    else if (k === 'brace' && ok) {
      // he grabs, you don't budge: your hands on his wrists, and him shrugged off
      r.lg.hit(0.12, 0, 0.12, 0.45); this.arm.gy = -0.04; this.arm.gt = 0.35; r.st.hit(0.16, 0.32, 0.12, 0.5); r.jk = -0.32; this._jolt(0.35, 0.08);
    } else if (k !== 'shove' && k !== 'brace' && ok) {
      // a step aside as he lunges past (no contact at all)
      this.sd.d.copy(this.rt).multiplyScalar(k === 'left' ? -1 : 1); this.sd.hit(0.34, 0, 0.14, 0.6); r.lg.hit(0.3, 0.05, 0.16, 0.6); r.leanGoal = -0.16; this._crowd(0.46);
    } else if (k === 'brace') {
      // grabbed by the overalls: pulled in, shaken about, shoved off
      r.lg.hit(0.16, 0, 0.1, 0.5); this.ln.d.copy(this.ax); this.ln.hit(0.12, 0.04, 0.1, 0.35);
      this.sd.d.copy(this.rt).multiplyScalar(Math.random() < 0.5 ? -1 : 1); this.sd.hit(0.1, 0.04, 0.08, 0.4);
      this._jolt(0.9, 0.05); this.kb.d.copy(this.ax).negate(); this.kb.hit(0.28, 0.3, 0.12, 0.5); this.arm.y -= 0.12;
    } else { r.lg.hit(0.2, 0, 0.12, 0.55); this._knock(0.4, 1, 0.1); }
  }
  /** how it came out: the share of the exchanges that went your way (the last one, if you kept going, counts double) */
  _result() { const { h, w } = this.sc; if (!w) return 'even'; const k = h / w; return k >= 0.65 ? 'won' : k <= 0.35 ? 'lost' : 'even'; }

  // ---- pulled apart ----------------------------------------------------------------------------------------------------
  /** you walked back along open ground and turned away; him led off the other way by his own people, his back to you; everyone let go */
  _apartTick(dt) {
    const k = this.su, r = this.tg, W = this.W, A = this.ap, a = this.ua;
    const want = 1.5 * ss(k / 1.05), v = want - A.you;
    if (v > 1e-4) {
      if (!this._step(-a.x * v, -a.z * v)) { const c = Math.cos(0.7 * A.dir), s = Math.sin(0.7 * A.dir); this._step((-a.x * c + a.z * s) * v, (-a.x * s - a.z * c) * v); }   // (a wall or a car behind: back off at an angle)
      A.you = want;
    }
    if (k > 0.25) { this.noAim = true; const f = Math.min(1, dt * 2.6); W.yaw += wrap(A.yaw0 + A.dir * 1.25 - W.yaw) * f; W.pitch += (-0.05 - W.pitch) * f; }
    if (k > 0.5 && !this.ev.free) {
      this.ev.free = true; r.pose = null; r.away = true; r.look = -A.dir * 0.45;
      for (const s of this.seps) if (s.st === 'hold') s.st = s.holds === 'tgt' ? 'lead' : 'free';
      if (this.out.backedOff) this._say(this.n.name, pick(this.L.say.after));
    }
    if (k > 0.95 && this.out.backedOff) this.arm.gy = -0.4;
    if (k >= 1.3) this._finish();
  }
  _finish() {
    if (this.done) return; this.done = true;
    const o = this.out, r = this.tg, g = r.P.group.position, e = this.W.pos;
    o.dur = +this.t.toFixed(2); o.result = this._result();
    if (r.away) this.n.turn = facing(g.x - e.x, g.z - e.z);   // (his back to you, as the walk keeps him)
    this._clean();
    this.state.stage = 'done'; this.state.beat = null; this.state.outcome = o;
    this.onDone?.(o);
  }
  _clean() {
    if (this.gone) return; this.gone = true;
    // (the mechanics who came over: free to go back to their car - and to look where they like again)
    for (const c of this.crew) if (c.sent && c.p.target === c.T) { c.p.target = c.t0 ?? null; c.p.t = Math.min(c.p.t, 1 + Math.random() * 3); }
    this.kit?.dispose(); this.kit = null; this._unzoom(); this.el?.remove(); this.el = null; this.q = null;
    this.cw = 0; this.W.pre?.crowd?.to?.(CROWD, 1.2);
  }
  /** gone (done, or a quit mid-scuffle: no onDone then) - everyone put back where they stand */
  dispose() { if (!this.done) { this.done = true; this.state.stage = 'done'; } this._clean(); }

  // ---- the separators ------------------------------------------------------------------------------------------------
  /**
   * Who comes to split it up: your team principal, engineer and No. 1 mechanic and his team-mate - those within 10 m of
   * it with a straight run there (open ground every half metre) and there inside 2.5 s, three at most (your own people
   * hold you; his team-mate holds him; when he is your team-mate the team principal gets between you) - and up to three
   * of the mechanics round his car (the crowd), his own car's first, from within 15 m.
   */
  _pickSeps() {
    const W = this.W, n = this.n, e = W.pos, T = this.tg.home, mx = (e.x + T.x) / 2, mz = (e.z + T.z) / 2, cand = [], sepOf = typeof this.o.seps === 'function' ? this.o.seps : null;
    for (const m of W.npcs || []) {
      if (m === n || m.brawl || !m.person?.group?.visible || !m.person.head) continue;
      let holds;
      if (sepOf) { holds = sepOf(m, n); if (holds !== 'you' && holds !== 'tgt') continue; }   // (another host's rule: security, friends, the team-mate)
      else {
        const mine = m.kind === 'boss' || m.kind === 'eng' || m.kind === 'mech', his = m.kind === 'driver' && !!n.car && !!m.car && m.car !== n.car && m.car.team === n.car.team;
        if (!mine && !his) continue;
        holds = his || (n.mate && m.kind === 'boss') ? 'tgt' : 'you';
      }
      const g = m.person.group.position, d = Math.hypot(g.x - mx, g.z - mz); if (d > 10) continue;
      cand.push({ m, d, holds });
    }
    cand.sort((a, b) => a.d - b.d);
    // (where each stands, by whoever they hold: [to the right of the line, toward him] - yours at your shoulders, in
    // the edge of the frame, one behind you; his at his)
    const slots = { you: [[0.48, 0.42], [-0.48, 0.42], [0, -0.55]], tgt: [[0.55, 0.25], [-0.55, 0.25]] };
    for (const c of cand) {
      if (this.seps.length >= 3) break;
      const g = c.m.person.group.position, sp = SPEED[c.m.kind] || 4, S = slots[c.holds];
      for (let i = 0; i < S.length; i++) {
        const s = { m: c.m, holds: c.holds, off: S[i], sp, to: new THREE.Vector3(), st: 'wait', at: null, walk: 0, r: null, dist: 0, travel: 0 };
        this._spot(s, s.to); const d = Math.hypot(s.to.x - g.x, s.to.z - g.z);
        if (inCar(W.cars, s.to.x, s.to.z) || !this._ok(s.to.x, s.to.z) || d / sp > 2.5 || !this._clear(g, s.to)) continue;   // (no straight run, or too far: they do not come)
        s.dist = d; s.travel = d / sp; s.r = this.kit.rec(c.m); S.splice(i, 1); this.seps.push(s);
        break;
      }
    }
    const L = W.life; if (!L?.people || !L._walkTo) return;
    const near = L.people.filter((p) => p.role === 'crew' && !p._watch && (p.x - T.x) ** 2 + (p.z - T.z) ** 2 < 225).map((p) => ({ p, k: (p.home && p.home === n.car ? 0 : 30) + Math.hypot(p.x - T.x, p.z - T.z) })).sort((a, b) => a.k - b.k).slice(0, 3);
    near.forEach(({ p }, i) => this.crew.push({ p, i, at: null, sent: false, dead: false, est: Math.hypot(p.x - T.x, p.z - T.z) / 3.2 * 1.25, T: null, t0: null }));
  }
  /** open ground all the way from a to b (every half metre, the walk's own test) */
  _clear(a, b) { const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 0.5)); for (let i = 1; i <= n; i++) { const f = i / n; if (!this._ok(a.x + (b.x - a.x) * f, a.z + (b.z - a.z) * f)) return false; } return true; }
  /** where separator s wants to be: by whoever they hold, along the line between you and to its side -> out */
  _spot(s, out) { const H = s.holds === 'you' ? this.W.pos : this.tg.P.group.position, a = this.ax, rt = this.rt; return out.set(H.x + rt.x * s.off[0] + a.x * s.off[1], 0, H.z + rt.z * s.off[0] + a.z * s.off[1]); }
  /** one of the mechanics sent running over (CrowdLife), to stand by him, turned to him (no open ground by him: they stay put) */
  _sendCrew(c) {
    const L = this.W.life, T = this.tg.P.group.position, a = this.ax, rt = this.rt, p = c.p, k = c.i; c.at = null;
    for (const side of k % 2 ? [-1, 1] : [1, -1]) {
      const x = T.x + rt.x * side * (0.85 + 0.2 * k) + a.x * (0.35 + 0.15 * k), z = T.z + rt.z * side * (0.85 + 0.2 * k) + a.z * (0.35 + 0.15 * k);
      if (inCar(this.W.cars, x, z) || (L.free && !L.free(x, z))) continue;
      // (at a run; on arrival they stand by, looking at him: CrowdLife turns an idle crew member to its target)
      L._walkTo(p, [x, z]); p.speed = 3.2; p.after = 'idle'; c.t0 = p.target ?? null; c.T = T; p.target = T; c.sent = true;
      if (!this.ev.crew) { this.ev.crew = true; this.out.separators.push(`${p.home?.team ? p.home.team + ' ' : ''}mechanics`); }
      if (!this.ev.run) { this.ev.run = true; this._cap(`THEY'RE RUNNING IN TO SPLIT IT UP`); }
      return;
    }
    c.dead = true;
  }
  /** the separators: off when it is their time, at a run, then holding on to whoever is theirs (and let go, or leading him off, at the end) */
  _seps(dt) {
    const e = this.W.pos, T = this.tg.P.group.position, cars = this.W.cars;
    for (const s of this.seps) {
      if (s.st === 'wait') {
        if (s.at == null || this.t < s.at) continue;
        s.st = 'run'; this.kit.claim(s.r); this.out.separators.push(s.m.name);
        if (!this.ev.run) { this.ev.run = true; this._cap(`THEY'RE RUNNING IN TO SPLIT IT UP`); }
      }
      const P = s.r.P, g = P.group.position, H = s.holds === 'you' ? e : T; this._spot(s, s.to);
      const dx = s.to.x - g.x, dz = s.to.z - g.z, d = Math.hypot(dx, dz);
      if (s.st === 'run') {
        if (d > 0.07) { const v = Math.min(d, s.sp * dt); moveTo(cars, g, g.x + dx / d * v, g.z + dz / d * v); s.walk += v; g.y = 0.028 * Math.abs(Math.sin(s.walk * Math.PI / 0.8)); P.group.rotation.y += wrap(facing(dx, dz) - P.group.rotation.y) * Math.min(1, dt * 10); P.group.rotation.z = -0.1; }
        if (d <= 0.07 || s.walk > s.dist + 1.5) { s.st = 'hold'; g.y = 0; P.group.rotation.z = 0; }
      } else {
        if ((s.st === 'hold' || s.st === 'lead') && d > 0.02) { const f = Math.min(1, dt * 7); moveTo(cars, g, g.x + dx * f, g.z + dz * f); }
        // (holding: turned to whoever they hold; leading him off: turned the way they are going)
        const want = s.st === 'lead' ? facing(this.ax.x, this.ax.z) : facing(H.x - g.x, H.z - g.z);
        P.group.rotation.y += wrap(want - P.group.rotation.y) * Math.min(1, dt * 8);
        this.kit.show(s.r, s.st === 'hold' ? 'restrain' : null);
      }
      const h = P.head; if (h) h.rotation.z = s.r.bow + (s.st === 'hold' ? -0.08 : 0);
    }
    for (const c of this.crew) if (!c.sent && c.at != null && this.t >= c.at) this._sendCrew(c);
  }

  // ---- on screen ---------------------------------------------------------------------------------------------------------
  _dom() {
    if (!document.getElementById('brawl-css')) { const st = document.createElement('style'); st.id = 'brawl-css'; st.textContent = CSS; document.head.appendChild(st); }
    document.getElementById('brawl')?.remove();
    const el = this.el = document.createElement('div'); el.id = 'brawl';
    el.innerHTML = `<div class="vig"></div><div class="red"></div><div class="hd"><b></b><i></i></div><div class="say"></div><div class="flash"><span></span><small></small></div><div class="qte"><div class="ring"></div><div class="key"></div><div class="lbl"></div></div><div class="ch"></div><div class="pips"></div>`;
    document.body.appendChild(el);
    const $ = (s) => el.querySelector(s);
    this.q = { cap: $('.hd i'), say: $('.say'), flash: $('.flash'), fl1: $('.flash span'), fl2: $('.flash small'), qte: $('.qte'), ring: $('.ring'), key: $('.key'), lbl: $('.lbl'), ch: $('.ch'), bar: null, pips: $('.pips'), red: $('.red') };
    $('.hd b').textContent = this.n.name || 'Driver';
  }
  _cap(text) { if (!this.q || this.capT === text) return; this.capT = text; this.q.cap.textContent = text; }
  _flash(text, cls, sub = '') { if (!this.q) return; this.q.flash.className = `flash ${cls || ''}`; this.q.fl1.textContent = text; this.q.fl2.textContent = sub; this.flT = 0.95; }
  _prompt(D) { const q = this.q; if (!q) return; q.key.textContent = D.kbd; q.key.classList.toggle('wide', D.kbd.length > 1); q.lbl.innerHTML = `${esc(D.label)}<small>${esc(D.hint)}</small>`; q.qte.classList.add('on'); }
  _promptOff() { this.q?.qte.classList.remove('on'); }
  /** two choices, a and b ([label, key, hint]), the default (by key) outlined, a bar running down to it */
  _choice(a, b, def) {
    const q = this.q; if (!q) return;
    q.ch.innerHTML = [a, b].map(([l, k, h]) => `<div class="${k === def ? 'def' : ''}"><kbd>${k}</kbd>${esc(l)}<small>${esc(h)}</small></div>`).join('') + '<p><i></i></p>';
    q.bar = q.ch.querySelector('p i'); q.ch.classList.add('in'); this.chOn = true;
  }
  _choiceOff() { this.chOn = false; this.q?.ch.classList.remove('in'); }
  _pips() { if (!this.q) return; this.q.pips.innerHTML = this.plan.map((b, i) => `<i class="${b.x ? 'x ' : ''}${b.ok === true ? 'good' : b.ok === false ? 'bad' : i === this.bi && this.st === 'beats' ? 'now' : ''}"></i>`).join(''); }
  /** the ring closing on the key as the window runs out, the flashes, the red edge of a shove, the line said, the choice's bar */
  _hud(dt) {
    const q = this.q; if (!q) return;
    if (!this.shown) { this.shown = true; this.el.classList.add('in'); }
    if (this.st === 'beats' && this.ph === 'open') { const k = clamp(this.pu / this.B.w, 0, 1); q.ring.style.opacity = 0.95; q.ring.style.transform = `scale(${(2.1 - 1.1 * k).toFixed(3)})`; q.ring.classList.toggle('late', k > 0.7); }
    else if (q.ring.style.opacity !== '0') q.ring.style.opacity = 0;
    if (this.flT > 0) { this.flT = Math.max(0, this.flT - dt); q.flash.style.opacity = Math.min(1, this.flT * 3.5); q.flash.style.transform = `translate(-50%, -50%) scale(${(1 + 0.4 * Math.max(0, this.flT - 0.7)).toFixed(3)})`; }
    if (this.redT > 0) { this.redT = Math.max(0, this.redT - dt); q.red.style.opacity = this.redT / 0.45; }
    this._sayTick(dt);
    if (this.chOn && q.bar) q.bar.style.width = `${Math.max(0, 1 - this.su / 2.5) * 100}%`;
    const fade = this.st === 'apart' ? 0.95 : this.st === 'walkaway' ? 0.65 : null;
    if (fade != null && this.su > fade) this.el.style.opacity = Math.max(0, 1 - (this.su - fade) / 0.35);
  }
}
