// Flashbacks: the last 15 s of the race, rewindable. The physics can't run backwards (friction, contacts and the
// integration are not reversible), so the whole simulation state is recorded - 4 snapshots a second in a ring - and
// one of them is written back into the live objects to resume from it.
//
// A snapshot is a deep copy of the race's dynamic state, taken from a set of ANCHOR objects - the race director, its
// world, every car (and its tyres and wheel state), every AI driver, the safety car (and its driver), the stewards,
// race control, timing, DRS, failures. An anchor is restored IN PLACE (the same object, its fields written back), so
// every reference between them - a car's AI, a penalty's culprit, the safety car in the field - stays valid; any field
// the anchor gained since (a new flag) is removed. Static data (track, racing line, pit lane, obstacles, the HUD,
// audio, telemetry) is not part of it, and the AI's path plans are not either: they are simply made again.
const KEEP = 15, RATE = 4;
/** fields never copied: static data, renderers, callbacks owned elsewhere, scratch objects */
const SKIP = new Set(['track', 'line', 'profile', 'pit', 'hud', 'audio', 'engineer', 'telemetry', 'obstacles', 'planner', 'flashback', 'replay', 'injuryClip', '_halfTrack',
  'onFinish', 'onPitDone', 'onRedFlag', 'events', 'sectors', 'passes', 'gLog', '_f', '_fr', '_fp', '_q', '_pq', '_po', '_oh', '_t2', '_v2', '_sa', '_sb', '_v3a', '_v3b', '_va', '_vb']);

class Ref { constructor(o) { this.o = o; } }

function copy(v, A, seen, live) {
  if (v === null || typeof v !== 'object') return v;
  if (v instanceof Ref) return live ? v.o : v;                 // (a snapshot's anchor reference: the live object on restore)
  if (!live && A.has(v)) return new Ref(v);                    // (an anchor met inside another one's state: by reference)
  if (v.isObject3D || v.isMaterial || v.isTexture || v instanceof Node) return v;   // (renderer objects: never copied)
  const hit = seen.get(v); if (hit) return hit;
  if (ArrayBuffer.isView(v)) { const c = v.slice(); seen.set(v, c); return c; }
  if (Array.isArray(v)) { const c = new Array(v.length); seen.set(v, c); for (let i = 0; i < v.length; i++) c[i] = copy(v[i], A, seen, live); return c; }
  if (v instanceof Map) { const c = new Map(); seen.set(v, c); for (const [k, x] of v) c.set(copy(k, A, seen, live), copy(x, A, seen, live)); return c; }
  if (v instanceof Set) { const c = new Set(); seen.set(v, c); for (const x of v) c.add(copy(x, A, seen, live)); return c; }
  const c = Object.create(Object.getPrototypeOf(v)); seen.set(v, c);
  for (const k of Object.keys(v)) if (!SKIP.has(k)) c[k] = copy(v[k], A, seen, live);
  return c;
}

export class Flashback {
  constructor(director, uses = 3) {
    this.d = director; this.buf = []; this.acc = 0; this.uses = uses;   // uses: how many are left (Infinity: unlimited)
  }
  /** every live anchor of the race right now */
  anchors() {
    const d = this.d, A = new Set([d, d.world, d.stewards, d.sc, d.radio, d.drs, d.failures]);
    const cars = new Set([...d.cars, ...(d.simCars || [])]); if (d.sc?.car) cars.add(d.sc.car);
    for (const c of cars) { A.add(c); A.add(c.tyres); A.add(c.wh); }
    for (const a of d.ai) A.add(a); if (d.sc?.driver) A.add(d.sc.driver);
    A.delete(undefined); A.delete(null);
    return A;
  }
  /** the race state now: [anchor, state] pairs */
  snap() {
    const A = this.anchors(), seen = new Map(), out = [];
    for (const a of A) { const s = {}; for (const k of Object.keys(a)) if (!SKIP.has(k)) s[k] = copy(a[k], A, seen, false); out.push([a, s]); }
    return { t: this.d.time, state: out };
  }
  /** write a snapshot back into the live objects (it stays usable: everything is copied again) */
  restore(snap) {
    const seen = new Map();
    for (const [a, s] of snap.state) {
      for (const k of Object.keys(a)) if (!SKIP.has(k) && !(k in s)) delete a[k];   // (fields gained since: gone)
      for (const k of Object.keys(s)) a[k] = copy(s[k], null, seen, true);
    }
    for (const [a] of snap.state) { if (a.planner) { a.planner.best.n = 0; a.planner.best.spec = null; a.planT = 0; } if (Object.prototype.hasOwnProperty.call(a, 'events') && Array.isArray(a.events)) a.events = []; }   // (a car's render events; not the director's events() method)
  }
  /** after every update: a snapshot every 1/RATE s, the last KEEP s of them */
  record(dt) {
    this.acc += dt; if (this.acc < 1 / RATE) return; this.acc = 0;
    this.buf.push(this.snap()); if (this.buf.length > KEEP * RATE + 1) this.buf.shift();
  }
  get span() { return this.buf.length ? this.d.time - this.buf[0].t : 0; }
  /** the snapshot at or just before race time t */
  at(t) { let best = this.buf[0]; for (const s of this.buf) if (s.t <= t) best = s; return best; }
  /** drop everything recorded after race time t (the timeline branches from there) */
  cut(t) { this.buf = this.buf.filter((s) => s.t <= t + 1e-6); }
}
export const FLASHBACK_SECONDS = KEEP;
