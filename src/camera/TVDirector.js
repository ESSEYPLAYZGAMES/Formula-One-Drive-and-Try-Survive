// The television director: the race as the world feed shows it, cut shot by shot. Every few seconds it picks the story
// worth watching - a fight for a place (the closer and the higher up the order, the better), an accident or a spin the
// moment it happens, a stop in the pit lane, the leader at the start and at the flag, and the cars of the team you run
// (main.js TP: they come round on the feed more often than the rest, and every time they are in a fight or the pits) -
// and a camera for it: the trackside cameras along the barriers, panning and zooming as the car comes by; the onboard
// T-cam; the helicopter; the rear-facing onboard of the car ahead with the one attacking it behind; the pit
// lane camera. A shot is held 5-9 s (an incident cuts in at once). Or you direct: follow a car (the cameras still cut
// round it), and / or keep to one camera.
//   update(dt, ctx) -> the car the shot is of (the game's S.player: the HUD, the sound and the camera's ground follow it)
// More cameras, as a real feed has: a camera in the kerb at the apex (low, the cars coming at it), a crane that rises
// and swings as they pass, the driver's eye (the helmet camera), the whole circuit
// from high up (under the safety car, now and then), and cutaways - the crowd in a stand when something has happened in
// front of it (cutaway('crowd', car)), the garage of a car of yours that is out (cutaway('garage', car)).
//   ctx: { d (RaceDirector), track, pit, focus: [your cars], camCtl (CockpitCamera: the onboard views), stands (the
//          grandstands: [{ x, z, ex, ez, len }]), clear(px, py,
//          pz, tx, ty, tz) -> true if nothing solid stands between a camera there and a target (main.js tvClear) }
// (No chase camera: television has none. The trackside cameras stand where real ones do - on platforms high over the
//  catch fence, looking down past its top, or in slots in the fence line just over the barrier - never behind the mesh.)
import * as THREE from 'three';
import { HeliCam } from './HeliCam.js';

/** the cameras a viewer can keep to (keys 1-6 in the team principal's race) */
export const TV_CAMS = ['auto', 'track', 'tcam', 'heli', 'rear', 'helmet', 'kerb', 'crane'];
export const TV_CAM_NAME = { auto: 'Director', track: 'Trackside', tcam: 'Onboard', heli: 'Helicopter', rear: 'Rear onboard', pit: 'Pit lane', grid: 'Grid', kerb: 'Kerb camera', crane: 'Crane', helmet: 'Helmet camera', beauty: 'The circuit', crowd: 'The crowd', garage: 'The garage', wall: 'The pit wall', marshal: 'Marshal post', walk: 'The driver' };
/** the shots that are not of a car on the road: cutaways (a key skips one - skipAway) */
export const TV_AWAY = new Set(['crowd', 'garage', 'beauty', 'wall', 'marshal', 'walk']);

const _v = new THREE.Vector3();

export class TVDirector {
  constructor(camera) {
    this.cam = camera;
    this.shot = null;            // { kind, car, other, t, dur, why, pos: Vector3, look: Vector3, s0, side, h }
    this.followCar = null;       // a car chosen to follow (null: the director's choice)
    this.camKind = 'auto';       // a camera kept to ('auto': the director's choice)
    this.lastSeen = new Map();   // car -> time it was last on screen (the team's cars come round again)
    this.seenOut = new Set();    // cars whose retirement has been shown
    this.outAt = new Map();      // car -> when it was first seen retired
    this.spinAt = new Map();     // car -> when its incident became the story
    this.t = 0; this.cuts = 0;
    this._look = new THREE.Vector3(); this._pos = new THREE.Vector3(); this._lookInit = false; this.heli = new HeliCam(); this.heliAt = null; this.heliLook = false;
    this.onCut = null;           // (the graphics: a new shot - its car, its story)
    this.awayQ = [];             // the cutaways asked for, in turn: [{ kind, car, until, view }]
    this.awayNext = 0;           // not another before this (a few seconds of the race between two of them)
    this.forced = null;          // a shot the director is told to hold (the formation lap): { kind, car, other, why }
    this.beautyAt = -99;
  }
  reset() { this.shot = null; this.followCar = null; this.camKind = 'auto'; this.awayQ = []; this.awayNext = 0; this.forced = null; this.lastSeen.clear(); this.seenOut.clear(); this.outAt.clear(); this.spinAt.clear(); this.t = 0; this.cuts = 0; }
  /** follow this car (null: the director chooses again) */
  follow(car) { this.followCar = car || null; this.shot = null; }
  /** a cutaway, at the next cut (for a few seconds from now): kind 'crowd' | 'garage', the car it is about */
  /** (view: a cutaway whose camera the caller places - { pos, look: a Vector3 or () => Vector3, fov, dur }: the pit wall's faces, a marshal's post, a driver walking away) */
  cutaway(kind, car, within = 6, view = null) { if (!car || this.camKind !== 'auto') return; const Q = this.awayQ; if (Q.some((a) => a.kind === kind)) return; Q.push({ kind, car, until: this.t + within, view }); if (Q.length > 3) Q.shift(); }   /* (a camera you keep to is not cut away from; one asked for while another waits takes its turn - at the flag the marshal, the pit wall and the crowd all want the picture) */
  /** the cutaway on screen is over now (a key: back to the race) -> was there one? */
  skipAway() { const sh = this.shot; if (!sh || !TV_AWAY.has(sh.kind)) return false; sh.dur = 0; return true; }
  /** hold this shot until told otherwise (null: the director's own choice again): { kind, car, other, why } */
  force(st) { this.forced = st || null; if (!st) this.shot = null; }
  /** keep to this camera ('auto': the director's choice) */
  setCam(kind) { this.camKind = TV_CAMS.includes(kind) ? kind : 'auto'; this.shot = null; }

  // ---- the stories ---------------------------------------------------------------------------------------------------
  /** what is worth a shot now -> [{ car, other, score, why }] */
  stories(ctx) {
    const d = ctx.d, P = d.positions, out = [], focus = ctx.focus || [], t = this.t;
    const mine = (c) => focus.includes(c);
    const onTrack = (c) => c && !c.retired && !c.finished && !c.inPit && !c.pitLane && !c.isSC && !c.hiddenAway;
    // (before the start: the front of the grid, the lights)
    if (!d.world.racing && !d.leaderFinished) { if (P[0]) out.push({ car: P[0], score: 50, why: 'grid' }); return out; }
    // (the safety car's own feed: the car itself at the head of the queue, the stops under it, the wreck that called
    //  it - no "battles": nobody may pass; the red flag's: the cars stopped, the leader, yours)
    const ph = d.sc?.phase || 'green', neutral = ph === 'sc' || ph === 'scIn' || ph === 'vsc' || ph === 'vscEnd' || ph === 'red';
    if ((ph === 'sc' || ph === 'scIn') && d.sc.car && !d.sc.car.pitLane) {
      // (the leader is in its picture only when he is right behind it: before he is picked up the two may be half a
      //  lap apart, and a camera aimed between them shows neither)
      const lead = P.find((c) => onTrack(c)) || null, gap = lead ? d.planDs(lead.s, d.sc.car.s) : 1e9;
      out.push({ car: d.sc.car, other: gap > 0 && gap < 200 ? lead : null, score: 19 + ((this.cuts * 0.618034) % 1) * 6, why: 'sc' });
    }
    if (ph === 'red') { const l0 = P.find((c) => !c.retired); if (l0) out.push({ car: l0, score: 18, why: 'red' }); }
    // the start: the pack off the line, from the helicopter behind it
    if (d.world.racing && d.mode === 'race' && P[0] && (P.find((c) => !c.retired)?.lap || 0) === 0 && d.time - (d.world.raceStart ?? d.time) < 8 && !(d.sc?.redCount > 0)) out.push({ car: P[0], score: 46, why: 'start' });
    // a cutaway asked for (the crowd, a garage): once, soon, briefly
    { const Q = this.awayQ; while (Q.length && t >= Q[0].until) Q.shift(); const A = Q[0]; if (A && t >= this.awayNext && this.camKind === 'auto' && !this.followCar) out.push({ car: A.car, score: 31, why: A.kind, away: true, view: A.view || null }); }
    // the whole circuit from high up: under the safety car, and now and then when nothing is happening
    if (this.camKind === 'auto' && !this.followCar && ctx.center && d.world.racing && t - this.beautyAt > (neutral ? 45 : 170) && (P.find((c) => !c.retired)?.lap || 0) >= 1) out.push({ car: P.find((c) => onTrack(c)) || P[0], score: neutral ? 17 : 7.5, why: 'beauty' });
    // the flag: the leader coming to it, then the cars after it
    const lead = P.find((c) => !c.retired);
    if (lead && lead.lap >= d.lapsTotal - 1 && !lead.finished) out.push({ car: lead, score: 16, why: 'leader' });
    for (let i = 0; i < P.length; i++) {
      const c = P[i];
      // an accident, a spin, a car stopped: at once (once per retirement)
      if (c.retired && !this.outAt.has(c)) this.outAt.set(c, t);
      if (c.retired && !c.hiddenAway && !this.seenOut.has(c) && t - this.outAt.get(c) < 12) { out.push({ car: c, score: 40 + (mine(c) ? 10 : 0), why: 'out', urgent: true }); continue; }
      if (!c.retired && (c.air || c.wreck || (c.spinning && c.speed > 3))) {
        // (an incident is the story for ten seconds - not for as long as the car sits there: then the race again, and
        //  the same car's next one only half a minute on)
        const t0 = this.spinAt.get(c); if (t0 == null || t - t0 > 40) this.spinAt.set(c, t);
        if (t - this.spinAt.get(c) < 10) { out.push({ car: c, score: 34 + (mine(c) ? 10 : 0), why: 'spin', urgent: true }); continue; }
      }
      // a stop: in the lane
      if (!c.retired && (c.pitLane || c.inPit) && !c.isSC && ph !== 'red') { out.push({ car: c, score: (mine(c) ? 22 : 3 + Math.max(0, 6 - i)) + (neutral ? 9 : 0), why: 'pit' }); continue; }   // (under the safety car the stops are the story)
      // a fight for a place: within a second of the car ahead, both on track
      const a = P[i - 1];
      if (i > 0 && d.mode === 'race' && !neutral && onTrack(c) && onTrack(a) && c.lap === a.lap) {
        const g = d.radio?.gap?.(c, a);
        if (g != null && g > 0 && g < 1.0) out.push({ car: c, other: a, score: 14 - i * 0.45 + (1 - g) * 5 + (mine(c) || mine(a) ? 9 : 0), why: 'battle' });
      }
    }
    // the leader, now and then; the first lap
    if (onTrack(lead)) out.push({ car: lead, score: lead.lap < 1 ? 15 : 6, why: 'leader' });
    // your cars: on screen again when they have not been for a while
    for (const c of focus) if (onTrack(c)) { const ago = t - (this.lastSeen.get(c) ?? -99); out.push({ car: c, score: 5 + Math.min(10, ago / 4), why: 'team' }); }
    // and someone at random down the order (the feed is not only the front)
    const r = P.filter(onTrack); if (r.length) out.push({ car: r[(this.cuts * 7) % r.length], score: 4, why: 'field' });
    return out;
  }
  /** the camera for a story */
  pickKind(st, ctx) {
    // (a camera you keep to stays yours in the pit lane too: the helicopter over it, the onboards on the car - only
    //  the trackside cameras hand over to the pit lane's own)
    if (st.kind) return st.kind;   // (a shot asked for by name: the formation lap's)
    if (st.view) return st.why;    // (a cutaway with its own camera)
    if (this.camKind !== 'auto') return st.why === 'pit' && this.camKind === 'track' ? 'pit' : this.camKind;
    if (st.why === 'grid') return 'grid';
    if (st.why === 'start') return 'heli';
    if (st.why === 'crowd' || st.why === 'garage' || st.why === 'beauty') return st.why;
    if (st.why === 'pit') return 'pit';
    if (st.why === 'out' || st.why === 'spin') return this.cuts % 3 === 2 ? 'heli' : 'track';
    if (st.why === 'sc') return this.cuts % 2 ? 'heli' : 'track';   // (the safety car and the queue behind it: from the air, from the fence)
    if (st.why === 'red') return 'heli';
    const r = (this.cuts * 0.618034) % 1;   // (a steady spread, not a die: the same race cuts the same way)
    if (st.why === 'battle') return r < 0.42 ? 'track' : r < 0.52 ? 'kerb' : r < 0.6 ? 'crane' : r < 0.78 ? 'tcam' : r < 0.86 ? 'helmet' : 'rear';
    return r < 0.34 ? 'track' : r < 0.44 ? 'crane' : r < 0.52 ? 'kerb' : r < 0.7 ? 'tcam' : r < 0.78 ? 'helmet' : 'heli';
  }

  // ---- a cut ---------------------------------------------------------------------------------------------------------
  cut(ctx, st) {
    let kind = this.pickKind(st, ctx); const tr = ctx.track, car = st.car;
    // (the director's own choice: after a shot that lasted under four seconds, not the same kind of camera again - a
    //  fence camera then another fence camera two seconds on reads as one shot stuttering)
    { const was = this.shot; if (was && this.camKind === 'auto' && !st.kind && !st.view && !st.urgent && was.t < 4 && !TV_AWAY.has(kind)) { const fam = (k, s) => (k === 'kerb' || k === 'crane' || (k === 'track' && s) ? 'track' : k), wk = fam(was.kind, true), nk = fam(kind, true); if (wk === nk && (nk === 'track' || nk === 'heli' || nk === 'tcam' || nk === 'helmet' || nk === 'rear')) kind = nk === 'track' ? (this.cuts & 1 ? 'tcam' : 'heli') : 'track'; } }
    if (st.away) this.awayQ.shift(); if (kind === 'beauty') this.beautyAt = this.t;
    // (a circuit that is not flat - Austin: every camera stands on the ground where it is, and looks at the car where
    //  the car is; heights are above that ground, never above zero)
    const G = (x, z) => (ctx.ground ? ctx.ground(x, z) : 0), cy = (c) => G(c.x, c.z) + ((c.air || c.wreck) && c.p ? Math.max(0, c.p[1]) : 0);
    // (the rear onboard is the car ahead's, the one behind in its mirror)
    // (the safety car's story: REAR is from its own tail, the leader behind it; an onboard is the leader's - it has none)
    const subject = st.why === 'sc' ? ((kind === 'tcam' || kind === 'helmet') && st.other ? st.other : car) : kind === 'rear' && st.other ? st.other : car;
    const sh = { kind, car: subject, other: st.why === 'sc' ? (subject === car ? st.other || null : car) : kind === 'rear' ? car : st.other || null, why: st.why, t: 0, dur: st.why === 'grid' ? 7 : st.why === 'start' ? 8 : st.view ? st.view.dur || 4.2 : kind === 'crowd' ? 3.2 : kind === 'garage' ? 4.2 : kind === 'beauty' ? 5 : st.urgent ? 7 : 5 + ((this.cuts * 0.3819) % 1) * 4, s0: 0, side: 1, h: 6 };
    if (st.away) this.awayNext = this.t + sh.dur + 4;
    // ---- the kerb camera: in the kerb at the apex of the next corner, the cars coming at it. No corner near, or no view
    //      from it (a wall on the kerb): a trackside camera instead
    if (kind === 'kerb') {
      // (a camera set in the kerb itself, as the real ones are: it does not move and it does not pan. A very wide lens
      //  a hand's height off the kerb, looking up the road at the cars coming - they grow from nothing and go over it -
      //  and then its twin looking down the road after them. Nothing is asked of the walls and fences: it is inside
      //  them, on the road's own edge. The next corner within reach - further when the kerb camera is the one asked
      //  for - or a trackside camera instead.)
      let s0 = null, side = 1; const reach = this.camKind === 'kerb' ? 720 : 330;
      for (let ds = 45; ds < reach; ds += 12) { const i = tr.idxAtS(tr.wrapS(subject.s + ds)); if (!tr.inCornerZone(i)) continue; let e = ds; while (e < ds + 220 && tr.inCornerZone(tr.idxAtS(tr.wrapS(subject.s + e)))) e += 12; const sm = tr.wrapS(subject.s + (ds + e) / 2), im = tr.idxAtS(sm), n = tr.n, a = (im - 6 + n) % n, b = (im + 6) % n; side = (tr.tx[b] - tr.tx[a]) * tr.nx[im] + (tr.tz[b] - tr.tz[a]) * tr.nz[im] > 0 ? 1 : -1; s0 = sm; break; }
      if (s0 != null) {
        const i = tr.idxAtS(s0), edge = tr.edgeAt ? tr.edgeAt(i, side) : tr.wallAt(i, side) - 2, off = side * Math.min(tr.wallAt(i, side) - 0.5, edge + (tr.kerbWidth || 1) * 0.3), f = tr.sample(s0, off);
        const a = tr.sample(tr.wrapS(s0 - 28), off * 0.7), b = tr.sample(tr.wrapS(s0 + 28), off * 0.7);   // (along its own side of the road, tipped up a little: the cars come through the middle of the picture, the horizon under it)
        sh.s0 = s0; sh.side = side; sh.kerb = true; sh.pos = new THREE.Vector3(f.x, G(f.x, f.z) + 0.3, f.z);
        sh.lookA = new THREE.Vector3(a.x, G(a.x, a.z) + 2.7, a.z); sh.lookB = new THREE.Vector3(b.x, G(b.x, b.z) + 2.7, b.z); sh.dur = 15;
      }
      if (!sh.pos) { kind = 'track'; sh.kind = 'track'; } else sh.kind = 'track';   // (placed: from here it is a trackside camera, a fixed one)
    }
    // ---- the crane: its head low and near as the car comes, rising and swinging out as it passes. The first place
    //      with a view - the car now and the road it comes down, then the road alone (the car is round the bend yet:
    //      it comes into the picture) - on either side, nearer or further; none: a trackside camera, not the helicopter
    if (kind === 'crane') {
      const s1 = (this.cuts & 1) ? 1 : -1, base = Math.max(40, 110 * Math.min(1.5, Math.max(0.5, subject.speed / 55)));
      // (first the places whose lines stay on the road's side of the fences - ins - then any; and how far past the
      //  crane the road stays in clear view - a tree, the bend - is kept: the shot ends there)
      for (const [ins, strict] of [[true, true], [true, false], [false, true], [false, false]]) {
        const see = (p, py, x, y, z) => ctx.clear(p.x, py, p.z, x, y, z) && (!ins || !ctx.inside || ctx.inside(p.x, py, p.z, x, y, z));
        for (const [sd, k] of [[s1, 1], [-s1, 1], [s1, 0.6], [-s1, 0.6], [s1, 1.5], [-s1, 1.5]]) {
          const s0 = tr.wrapS(subject.s + base * k), i = tr.idxAtS(s0), w = tr.wallAt(i, sd);
          const a = tr.sample(s0, sd * (w - 0.8)), b = tr.sample(tr.wrapS(s0 + 14), sd * (w - 1.2)) /* (the head stays on the road's side of the fence as it rises: the mesh is never seen from behind) */, p0 = new THREE.Vector3(a.x, G(a.x, a.z) + 3.2, a.z), p1 = new THREE.Vector3(b.x, G(b.x, b.z) + 13, b.z);
          const m = tr.sample(tr.wrapS(s0 - 25), 0), my = G(m.x, m.z) + 0.8;
          let ok = !ctx.clear || (see(p1, p1.y, m.x, my, m.z) && see(p0, p0.y + 1.5, m.x, my, m.z) && (!strict || (see(p1, p1.y, subject.x, cy(subject) + 0.8, subject.z) && see(p0, p0.y + 1.5, subject.x, cy(subject) + 0.8, subject.z)))), end = null;
          if (ok && ctx.clear) {   // (how far past it: by arithmetic every 14 m - walls, trees, the fence line - and the meshes' ray at the end of that)
            const lt = ctx.lite || ctx.clear; end = 0;
            for (let x = 6; x <= 300; x += 14) { const q = tr.sample(tr.wrapS(s0 + x), 0), qy = G(q.x, q.z) + 0.8; if (!lt(p1.x, p1.y, p1.z, q.x, qy, q.z) || (ins && ctx.inside && !ctx.inside(p1.x, p1.y, p1.z, q.x, qy, q.z))) break; end = x; }
            while (end >= 22) { const q = tr.sample(tr.wrapS(s0 + end), 0); if (ctx.clear(p1.x, p1.y, p1.z, q.x, G(q.x, q.z) + 0.8, q.z)) break; end = Math.floor(end * 0.5); }
            if (end < 22) ok = false;
          }
          if (ok) { sh.s0 = s0; sh.side = sd; sh.pos = p0.clone(); sh.pos0 = p0; sh.pos1 = p1; sh.crane = true; sh.endAt = end != null && end < 300 ? end : null; break; }
        }
        if (sh.crane) break;
      }
      if (!sh.crane) kind = 'track';
      sh.kind = 'track';
    }
    if (kind === 'track') {
      // a camera along the barrier ahead of the car: it comes toward it, passes, and the shot ends a little after
      const ahead = st.urgent ? 25 : 110 + ((this.cuts * 0.7548) % 1) * 110, s0 = tr.wrapS(subject.s + Math.max(20, ahead * Math.min(1.6, Math.max(0.5, subject.speed / 55))));
      // (two kinds of trackside camera, as at a real circuit: on a pole 10-13 m up, or in a slot cut in the fence
      //  line, the lens just over the concrete, the mesh beside it, none in front)
      // (the pole stands on the ROAD'S side of the wall - a metre and a half in, over the verge: the catch fence is
      //  behind the lens, never between it and a car, and never seen from behind. The slot is in the fence line itself.)
      const side = (this.cuts & 1) ? 1 : -1, slot = !st.urgent && ((this.cuts * 0.4142) % 1) < 0.4, kv = Math.min(1.6, Math.max(0.5, subject.speed / 55));
      const at = (k, sd, sl, hh) => {
        const sq = tr.wrapS(subject.s + Math.max(20, ahead * k * kv)), iq = tr.idxAtS(sq), fq = tr.sample(sq, sd * (tr.wallAt(iq, sd) + (sl ? 0.05 : -1.5)));
        const h = sl ? Math.max(1.9, (tr.barrierHeight?.(iq, sd) > 2 ? 1.3 : tr.barrierHeight?.(iq, sd) || 1.2) + 0.7) : hh;
        return { p: new THREE.Vector3(fq.x, G(fq.x, fq.z) + h, fq.z), sq, sd, sl, h };
      };
      const use = (c, end) => { sh.pos = c.p; sh.s0 = c.sq; sh.side = c.sd; sh.slot = c.sl; sh.h = c.h; sh.endAt = end; };
      const h0 = 10 + ((this.cuts * 0.271) % 1) * 3, first = at(1, side, slot, h0);
      use(first, null);
      // (the camera must SEE the car - and go on seeing it. Its whole sweep is looked along before it is taken: from
      //  the car now, down the road to the camera, and on past it - a wall or a fence where the track bends, a
      //  building, a stand, a TREE (a shot that began clean and ended behind one). A place whose view of the road up
      //  to it is not clear is not taken; how far past it the view holds is kept (endAt) and the shot is cut there,
      //  with the car still in clear sight. First the places whose every line stays on the road's side of the fences
      //  (inside: no fence from behind), then any with a clear view; none - between buildings, under a bridge: the
      //  helicopter has it.)
      if (ctx.clear) {
        const fwd = (a, b2) => { let x = b2 - a; if (x < 0) x += tr.length; return x; };
        // (a place's sweep, looked along in two steps. First by arithmetic alone, every 16 m of it - the walls and
        //  fences of the road, the trees, and whether the line stays inside the fence line: ok / end, okIn / endIn.
        //  Then the ray against the buildings and the stands - which costs - at a few points only: the car, half
        //  way down the road to the camera, and the far end of what the arithmetic allowed. A cut must not hold
        //  the picture up.)
        const lite = ctx.lite || ctx.clear, dS = (subject.d || 0) * 0.6;
        const pre = (c) => {
          const p = c.p, r = { ok: false, end: 0, okIn: false, endIn: 0 }, ins = (x, y, z) => !ctx.inside || ctx.inside(p.x, p.y, p.z, x, y, z);
          const sy = cy(subject) + 0.8; if (!lite(p.x, p.y, p.z, subject.x, sy, subject.z)) return r;
          let allIn = ins(subject.x, sy, subject.z);
          const a = fwd(subject.s, c.sq);
          for (let x = 16; x < a - 6; x += 16) { const m = tr.sample(tr.wrapS(subject.s + x), dS), y = G(m.x, m.z) + 0.8; if (!lite(p.x, p.y, p.z, m.x, y, m.z)) return r; if (allIn && !ins(m.x, y, m.z)) allIn = false; }
          r.ok = true; r.okIn = allIn;
          for (let x = 8; x <= 264; x += 16) { const m = tr.sample(tr.wrapS(c.sq + x), 0), y = G(m.x, m.z) + 0.8; if (!lite(p.x, p.y, p.z, m.x, y, m.z)) break; r.end = x; if (allIn && ins(m.x, y, m.z)) r.endIn = x; else allIn = false; }
          return r;
        };
        const verify = (c, end) => {   // -> how far past the camera the view holds with the meshes in the ray too (0: not at all)
          const p = c.p, cl = c.sl && ctx.clearFull ? ctx.clearFull : ctx.clear, at = (sv, d) => { const m = tr.sample(tr.wrapS(sv), d); return cl(p.x, p.y, p.z, m.x, G(m.x, m.z) + 0.8, m.z); };
          if (!cl(p.x, p.y, p.z, subject.x, cy(subject) + 0.8, subject.z)) return 0;
          const a = fwd(subject.s, c.sq); if (a > 90 && !at(subject.s + a * 0.5, dS)) return 0;
          for (const k of [1, 0.55, 0.25]) { const e = Math.max(24, end * k); if (at(c.sq + e, 0)) return e; if (e <= 24) break; }
          return 0;
        };
        const C = [first];
        for (const [k, sd, hh] of [[1, -side, 11], [1, side, 12.5], [0.55, side, 11], [0.55, -side, 12], [1.5, side, 13], [1.5, -side, 13], [0.3, side, 11.5], [0.3, -side, 11.5], [2.1, side, 14], [2.1, -side, 14], [1, side, 17], [1, -side, 17], [0.75, side, 15], [0.75, -side, 15]]) C.push(at(k, sd, false, hh));
        // (inside the fences with a long view past it: taken at once. Else the best of the rest - the ones inside
        //  the fences first, then any with a clear view - the first few of them that the rays bear out.)
        let found = false; const rest = [];
        for (const c of C) {
          const e = pre(c);
          if (e.okIn && e.endIn >= 72) { const v = verify(c, e.endIn); if (v >= 24) { use(c, v < 264 ? v : null); found = true; break; } continue; }
          if (e.okIn && e.endIn >= 24) rest.push({ c, end: e.endIn, k: 1000 + e.endIn }); else if (e.ok && e.end >= 24) rest.push({ c, end: e.end, k: e.end });
        }
        if (!found) { rest.sort((x, y) => y.k - x.k); for (const o of rest.slice(0, 5)) { const v = verify(o.c, o.end); if (v >= 24) { use(o.c, v < 264 ? v : null); found = true; break; } } }
        if (!found) { sh.kind = 'heli'; sh.pos = null; }
      }
    } else if (st.view) {
      sh.view = st.view;   // (placed each frame from it: place())
    } else if (kind === 'crowd' || kind === 'garage' || kind === 'beauty') {
      let ok = false;
      if (kind === 'crowd' && ctx.stands?.length) {
        // the nearest stand to the car: from the track's side of it, up at its middle rows
        let best = null, bd = 500 * 500; for (const s of ctx.stands) { const dd = (s.x - subject.x) ** 2 + (s.z - subject.z) ** 2; if (dd < bd && (s.len || 0) > 20) { bd = dd; best = s; } }
        if (best) { const gx = best.x - best.ez[0] * 13 + best.ex[0] * 6, gz = best.z - best.ez[1] * 13 + best.ex[1] * 6; sh.pos = new THREE.Vector3(gx, G(gx, gz) + 4.5, gz); sh.lookAt = new THREE.Vector3(best.x + best.ez[0] * 6, G(best.x, best.z) + 5, best.z + best.ez[1] * 6); sh.pan = [best.ex[0] * 9, best.ex[1] * 9]; ok = true; }
      } else if (kind === 'garage' && ctx.pit?.boxFor && ctx.pit.samples) {
        // the garage of a car that is out: from the lane, square on
        // (the camera in the lane, by the pit wall; the garage is across the lane from the track)
        const f = ctx.pit.boxFor(subject.boxIdx ?? 0), ps = ctx.pit.samples, i = Math.max(0, Math.min(ps.n - 1, f.i)), ts = ctx.pit.trackSide, hw = ctx.pit.halfWidth || 6;
        const gx = ps.px[i] + ps.nx[i] * ts * hw * 0.7, gz = ps.pz[i] + ps.nz[i] * ts * hw * 0.7, lx = ps.px[i] - ps.nx[i] * ts * (hw + 5), lz = ps.pz[i] - ps.nz[i] * ts * (hw + 5);
        sh.pos = new THREE.Vector3(gx, G(gx, gz) + 1.9, gz); sh.lookAt = new THREE.Vector3(lx, G(lx, lz) + 1.7, lz); sh.pan = [-ps.nz[i] * 5, ps.nx[i] * 5]; ok = true;
      } else if (kind === 'beauty' && ctx.center) {
        const C = ctx.center, a0 = (this.cuts * 2.399) % 6.283; sh.orbit = { a: a0, r: C.r * 0.95 + 120, h: 150 + C.r * 0.12 }; sh.lookAt = new THREE.Vector3(C.x, G(C.x, C.z), C.z); sh.pos = new THREE.Vector3(C.x + Math.cos(a0) * sh.orbit.r, sh.lookAt.y + sh.orbit.h, C.z + Math.sin(a0) * sh.orbit.r); ok = true;
      }
      if (!ok) sh.kind = 'heli';
    } else if (kind === 'grid') {
      // high over the start line, looking down the grid
      const f = tr.sample(tr.wrapS(40), 0), b = tr.sample(tr.wrapS(-160), 0);
      sh.pos = new THREE.Vector3(f.x + (f.x - b.x) * 0.15, G(f.x, f.z) + 22, f.z + (f.z - b.z) * 0.15); sh.lookAt = new THREE.Vector3(b.x, G(b.x, b.z), b.z);
    }
    this.heliLook = this._lookInit && this.shot?.kind === 'heli';   // (the helicopter on to a new subject near it: its aim pans across, the flight carries on)
    this.shot = sh; this.cuts++; this._lookInit = false;
    this.lastSeen.set(subject, this.t); if (sh.other) this.lastSeen.set(sh.other, this.t);
    if (st.why === 'out') this.seenOut.add(car);
    this.onCut?.(sh);
  }

  update(dt, ctx) {
    this.t += dt;
    const d = ctx.d, sh = this.shot;
    const gone = (c) => !c || (c.hiddenAway && c.retired);
    // (a shot held by order - the formation lap: cut to once, kept until the order changes)
    if (this.forced) { const f = this.forced; if (!sh || sh.forced !== f) { this.cut(ctx, { car: f.car, other: f.other || null, why: f.why || 'form', kind: f.kind, score: 99 }); this.shot.forced = f; this.shot.dur = 1e9; } this.shot.t += dt; this.place(dt, ctx); return this.shot.car; }
    let want = null;
    if (this.followCar && !gone(this.followCar)) {
      // a car followed: its own story (in the pits, in a fight) - the cameras still cut round it
      // (not the safety car's story: following the leader behind it put the safety car in the picture and the
      //  camera between the two. The car followed is the picture; only the REAR camera asked for looks back at it
      //  from the safety car's tail, when that is the car right ahead)
      const S = this.stories(ctx).filter((x) => x.why !== 'sc' && (x.car === this.followCar || x.other === this.followCar)).sort((a, b) => b.score - a.score);
      want = S[0] ? { ...S[0], car: this.followCar, other: S[0].car === this.followCar ? S[0].other : S[0].car } : { car: this.followCar, score: 1, why: 'team' };
      if (!want.other && this.camKind === 'rear') { const sc = d.sc?.car, g = sc && !sc.pitLane ? d.planDs(this.followCar.s, sc.s) : -1; if (g > 0 && g < 160 && !d.cars.some((o) => o !== this.followCar && !o.retired && !o.pitLane && d.planDs(this.followCar.s, o.s) > 0 && d.planDs(this.followCar.s, o.s) < g)) want.other = sc; }
      if (want.why === 'battle' && want.other && d.positions.indexOf(want.other) > d.positions.indexOf(this.followCar)) {
        // (the car followed is the one ahead: the fight is the one behind it attacking)
        want = { ...want, car: want.other, other: this.followCar };
      }
    } else {
      if (this.followCar) this.followCar = null;
      const S = this.stories(ctx).sort((a, b) => b.score - a.score);
      want = S[0] || null;
    }
    if (!want) return sh?.car || null;
    const ended = !sh || (gone(sh.car) && !TV_AWAY.has(sh.kind)) || sh.t > sh.dur || (sh.kind === 'track' && this.passed(ctx, sh)) || (sh.kind === 'pit' && !sh.car.pitLane && !sh.car.inPit && sh.t > 2)
      || (sh.why === 'grid' && d.world.racing && sh.t > 3);
    const urgent = (want.urgent && sh && sh.car !== want.car && sh.t > 1.2 && !(sh.why === 'out' || sh.why === 'spin')) || (want.away && sh && sh.why !== want.why && sh.t > 1.5) || (want.why === 'start' && sh && sh.why !== 'start');
    if (ended || urgent || (this.followCar && sh && sh.car !== want.car && sh.other !== want.car && sh.car !== this.followCar)) this.cut(ctx, want);
    this.shot.t += dt;
    this.place(dt, ctx);
    // (the car the picture is ABOUT - the timing under it, the sound: the camera on the safety car's tail is the leader's shot, not the safety car's)
    return this.shot.car?.isSC && this.shot.other ? this.shot.other : this.shot.car;
  }
  /** a trackside shot: the car has gone by the camera, and on */
  passed(ctx, sh) {
    const L = ctx.track.length; let ds = sh.car.s - sh.s0; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L;
    // (followed on down the road for a couple of seconds - 70 to 220 m - not dropped 45 m past the pole: at speed that
    //  was a new camera every two seconds; a view lost round the bend ends it sooner - place())
    return ds > Math.max(70, Math.min(220, Math.abs(sh.car.speed) * 2.3)) || (ds < -400 && sh.t > 3);
  }

  // ---- the camera ----------------------------------------------------------------------------------------------------
  place(dt, ctx) {
    const sh = this.shot, cam = this.cam, car = sh.car, cc = ctx.camCtl;
    if (sh.kind === 'tcam' || sh.kind === 'rear' || sh.kind === 'helmet') {
      cc.mode = sh.kind === 'helmet' ? 'cockpit' : 'tcam'; cc.back = sh.kind === 'rear'; cc.lookIn = 0;
      cc.update(car, dt, ctx.track); cc.back = false;
      return;
    }
    let fov = 40;
    const G = (x, z) => (ctx.ground ? ctx.ground(x, z) : 0), carY = G(car.x, car.z) + ((car.air || car.wreck) && car.p ? Math.max(0, car.p[1]) : 0);   // (the ground the car is on: not flat everywhere)
    const tgt = _v.set(car.x, carY + 0.7, car.z);
    if (sh.view) {
      const v = sh.view, vp = typeof v.pos === 'function' ? v.pos() : v.pos, vl = typeof v.look === 'function' ? v.look() : v.look;
      cam.position.copy(vp); tgt.copy(vl); fov = v.fov || 40;
    } else if (sh.kind === 'crowd' || sh.kind === 'garage' || sh.kind === 'beauty') {
      if (sh.orbit) { const a = sh.orbit.a + sh.t * 0.035; sh.pos.set(sh.lookAt.x + Math.cos(a) * sh.orbit.r, sh.lookAt.y + sh.orbit.h, sh.lookAt.z + Math.sin(a) * sh.orbit.r); }
      cam.position.copy(sh.pos); tgt.copy(sh.lookAt); if (sh.pan) { const u = Math.min(1, sh.t / sh.dur) - 0.5; tgt.x += sh.pan[0] * u; tgt.z += sh.pan[1] * u; }
      fov = sh.kind === 'beauty' ? 40 : sh.kind === 'crowd' ? 30 : 52;
    } else if (sh.kind === 'track') {
      if (sh.crane) { const u = Math.min(1, sh.t / Math.max(1, sh.dur * 0.8)), e = u * u * (3 - 2 * u); sh.pos.lerpVectors(sh.pos0, sh.pos1, e); }
      cam.position.copy(sh.pos);
      const dist = Math.hypot(car.x - sh.pos.x, car.z - sh.pos.z);
      // (with the circuit's own walls and fences in the ray - clearFull - whatever the walls' arithmetic says)
      // (a camera that stands still is looked through again as the shot runs: the car it has may have spun on, rolled
      //  away behind a fence line, gone round the bend - twice running with something in the way, and the shot is over)
      // (the view past the camera holds only so far - a tree, the bend: the shot ends there, the car still in sight)
      if (sh.endAt != null && !sh.kerb && sh.t > 1.2) { const L = ctx.track.length; let ds = car.s - sh.s0; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L; if (ds > sh.endAt - Math.max(4, car.speed * 0.25)) sh.dur = Math.min(sh.dur, sh.t); }
      // (and a tree between the lens and the car - it left the road, the crane's head swung behind one: over at once)
      if (ctx.tree && !sh.kerb && sh.t > 1) { sh.tchk = (sh.tchk || 0) + dt; if (sh.tchk > 0.25) { sh.tchk = 0; if (ctx.tree(sh.pos.x, sh.pos.y, sh.pos.z, car.x, carY + 0.8, car.z)) sh.dur = Math.min(sh.dur, sh.t); } }
      if (ctx.clear && !sh.crane && !sh.kerb) { sh.chk = (sh.chk || 0) + dt; if (sh.chk > 0.55) { sh.chk = 0; if (!(ctx.clearFull || ctx.clear)(sh.pos.x, sh.pos.y, sh.pos.z, car.x, carY + 0.8, car.z)) { sh.lostN = (sh.lostN || 0) + 1; if (sh.lostN >= 2 && sh.t > 1.3) { sh.dur = Math.min(sh.dur, sh.t); this.lostCuts = (this.lostCuts || 0) + 1; } } else sh.lostN = 0; } }
      fov = sh.kerb ? Math.max(24, Math.min(62, 900 / Math.max(10, dist))) : Math.max(9, Math.min(55, 1500 / Math.max(18, dist)));
      // (the kerb's camera: fixed, wide; up the road until the car is over it, then down the road after it - a cut, as
      //  between two cameras - and the shot ends a second and a half on)
      if (sh.kerb) {
        const L = ctx.track.length; let ds = car.s - sh.s0; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L;
        if (ds > 1.2 && sh.pastT == null) { sh.pastT = sh.t; this._lookInit = false; }
        tgt.copy(sh.pastT != null ? sh.lookB : sh.lookA); fov = 72;
        if (sh.pastT != null) sh.dur = Math.min(sh.dur, sh.pastT + 1.6); else if (ds < -900 || sh.t > 14) sh.dur = Math.min(sh.dur, sh.t);
      } else
      if (sh.other) { tgt.x = (car.x * 2 + sh.other.x) / 3; tgt.z = (car.z * 2 + sh.other.z) / 3; tgt.y = (carY * 2 + G(sh.other.x, sh.other.z)) / 3 + 0.7; fov = Math.max(fov, Math.min(55, 2400 / Math.max(18, dist))); }
    } else if (sh.kind === 'heli') {
      // (an aircraft of its own - camera/HeliCam.js: it chases the car at a helicopter's pace, drops back down the
      //  straights and catches up through the corners, climbs where something stands in the way - one long shot,
      //  never a jump to another side. A new subject near where it is flying is the same flight carried on)
      const H = this.heli, over = !!(car.pitLane || car.inPit);
      const vel = car.air ? [car.wvx || 0, car.wvz || 0] : car.worldVel ? car.worldVel() : [Math.cos(car.th) * (car.speed || 0), Math.sin(car.th) * (car.speed || 0)];
      const sub = this._heliCar || (this._heliCar = {}); sub.x = car.x; sub.y = carY; sub.z = car.z; sub.th = car.th; sub.vx = vel[0] || 0; sub.vz = vel[1] || 0;
      const env = this._heliEnv || (this._heliEnv = {}); env.clear = ctx.clear || null; env.ground = ctx.ground || null; env.overhead = over;
      if (!sh.heliOn) { sh.heliOn = true; if (H.near(car.x, car.z) && this.heliAt != null && this.t - this.heliAt < 1.5) this._lookInit = this._lookInit || this.heliLook; else { H.start(sub, env); this.heliLook = false; } }
      else if (Math.hypot(H.p.x - car.x, H.p.z - car.z) > 700) { H.start(sub, env); this._lookInit = false; }   // (the car is somewhere else altogether - put back on the road: a cut)
      H.update(dt, sub, env); this.heliAt = this.t;
      // (in its box under the pit building's roof: nothing in the air sees it - the pit lane's own camera has it until it is out again)
      if (over && H.blockT > 2.2 && H.up > 60) { sh.kind = 'pit'; sh.pos = null; sh.heliOn = false; this._lookInit = false; return this.place(dt, ctx); }
      cam.position.copy(H.p);
      // (the aim: a little ahead of the car, by its speed; two cars fighting: between them)
      const ld = Math.min(0.22, 14 / Math.max(1, Math.hypot(sub.vx, sub.vz))); tgt.set(car.x + sub.vx * ld, carY + 0.4, car.z + sub.vz * ld);
      if (sh.other && !sh.other.retired && Math.hypot(sh.other.x - car.x, sh.other.z - car.z) < 70) { tgt.x = (tgt.x * 2 + sh.other.x) / 3; tgt.z = (tgt.z * 2 + sh.other.z) / 3; }
      fov = H.fov(car.x, carY, car.z);
    } else if (sh.kind === 'pit') {
      const P = ctx.pit;
      if (P && P.samples) {
        // along the lane, a little ahead of the car, on the garage side, looking back at it
        const ps = P.samples; let bi = 0, bd = Infinity;
        for (let i = 0; i < ps.n; i += 4) { const dd = (ps.px[i] - car.x) ** 2 + (ps.pz[i] - car.z) ** 2; if (dd < bd) { bd = dd; bi = i; } }
        if (!sh.pos) {
          // (the pit lane's cameras hang over the lane itself, on the pit wall's side - the garages and the pit
          //  building stand at the other edge: a camera "on the garage side" was inside them. The first with a view:
          //  ahead of the car on the wall's side, behind it, high over the middle of the lane)
          const at = (dj, k, h) => { const j = Math.max(0, Math.min(ps.n - 1, bi + Math.round(dj / ps.ds))), off = P.trackSide * P.halfWidth * k; const x = ps.px[j] + ps.nx[j] * off, z = ps.pz[j] + ps.nz[j] * off; return new THREE.Vector3(x, G(x, z) + h, z); };
          // (well ahead and high: the car comes all the way to it and on past - one camera for a hundred and fifty metres
          //  of lane, not one every thirty)
          const C = [at(70, 0.7, 7.5), at(-60, 0.7, 7.5), at(45, 0.3, 10), at(30, 0.75, 5.2), at(-26, 0.75, 5.2), at(22, 0.2, 9), at(-18, 0.2, 9), at(12, 0, 14)];
          sh.placedAt = sh.t; sh.lostN = 0;
          // (one that sees the car now AND the lane fifty metres on: it will still have it in three seconds)
          const on = at(50, 0, 0.9), seesOn = (p) => !ctx.clear || (ctx.clear(p.x, p.y, p.z, car.x, carY + 0.9, car.z) && ctx.clear(p.x, p.y, p.z, on.x, on.y, on.z));
          sh.pos = C.find(seesOn) || C.find((p) => !ctx.clear || ctx.clear(p.x, p.y, p.z, car.x, carY + 0.9, car.z)) || C[C.length - 1];
        }
        // (the car moves on down the lane: a camera that has lost it behind a gantry or the next garage's awning is
        //  placed again, a second or so apart)
        // (placed again only when it has really lost the car - three looks running, and not within five seconds of being
        //  put there - or the car has gone a long way down the lane from it)
        if (ctx.clear && sh.t - (sh.pt ?? 0) > 1.0) { sh.pt = sh.t; const far = Math.hypot(car.x - sh.pos.x, car.z - sh.pos.z) > 125; sh.lostN = ctx.clear(sh.pos.x, sh.pos.y, sh.pos.z, car.x, carY + 0.9, car.z) ? 0 : (sh.lostN || 0) + 1; if ((far && sh.t - (sh.placedAt ?? 0) > 3) || (sh.lostN >= 3 && sh.t - (sh.placedAt ?? 0) > 5)) { sh.pos = null; this._lookInit = false; return this.place(0, ctx); } }
        cam.position.copy(sh.pos);
        fov = Math.max(9, Math.min(50, 900 / Math.max(10, Math.hypot(car.x - sh.pos.x, car.z - sh.pos.z))));
      } else { this.shot.kind = 'track'; return; }
    } else if (sh.kind === 'grid') {
      cam.position.copy(sh.pos); tgt.copy(sh.lookAt); fov = 34;
    }
    // the operator's pan: the aim eases after the car (a long lens never snaps)
    if (!this._lookInit) { this._look.copy(tgt); this._lookInit = true; } else this._look.lerp(tgt, Math.min(1, dt * (sh.kind === 'track' ? 9 : sh.kind === 'heli' ? 3 : 4)));
    cam.up.set(0, 1, 0); cam.lookAt(this._look);
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov += (fov - cam.fov) * Math.min(1, dt * (sh.t < 0.05 && !(sh.kind === 'heli' && this.heliLook) ? 99 : sh.kind === 'heli' ? 1.3 : 3)); cam.updateProjectionMatrix(); }   // (the helicopter's zoom is slow: the car grows and shrinks in the picture as it pulls away and is caught)
  }
}
