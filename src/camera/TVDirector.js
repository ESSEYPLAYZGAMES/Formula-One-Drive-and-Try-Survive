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
// and swings as they pass, the driver's eye (the helmet camera), a drone behind the pack off the line, the whole circuit
// from high up (under the safety car, now and then), and cutaways - the crowd in a stand when something has happened in
// front of it (cutaway('crowd', car)), the garage of a car of yours that is out (cutaway('garage', car)).
//   ctx: { d (RaceDirector), track, pit, focus: [your cars], camCtl (CockpitCamera: the onboard views), stands (the
//          grandstands: [{ x, z, ex, ez, len }]), clear(px, py,
//          pz, tx, ty, tz) -> true if nothing solid stands between a camera there and a target (main.js tvClear) }
// (No chase camera: television has none. The trackside cameras stand where real ones do - on platforms high over the
//  catch fence, looking down past its top, or in slots in the fence line just over the barrier - never behind the mesh.)
import * as THREE from 'three';

/** the cameras a viewer can keep to (keys 1-6 in the team principal's race) */
export const TV_CAMS = ['auto', 'track', 'tcam', 'heli', 'rear', 'helmet', 'kerb', 'crane', 'drone'];
export const TV_CAM_NAME = { auto: 'Director', track: 'Trackside', tcam: 'Onboard', heli: 'Helicopter', rear: 'Rear onboard', pit: 'Pit lane', grid: 'Grid', kerb: 'Kerb camera', crane: 'Crane', drone: 'Drone', helmet: 'Helmet camera', beauty: 'The circuit', crowd: 'The crowd', garage: 'The garage' };

const _v = new THREE.Vector3();
/** where the helicopter may fly, relative to the car: [along its heading (m, - behind), to its left, up] - tried in turn */
const HELI = [[-70, 40, 55], [-70, -40, 55], [-45, 26, 95], [-45, -26, 95], [-20, 12, 140], [-6, 0, 190]];

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
    this._look = new THREE.Vector3(); this._pos = new THREE.Vector3(); this._lookInit = false;
    this.onCut = null;           // (the graphics: a new shot - its car, its story)
    this.away = null;            // a cutaway asked for: { kind, car, until }
    this.beautyAt = -99;
  }
  reset() { this.shot = null; this.followCar = null; this.camKind = 'auto'; this.lastSeen.clear(); this.seenOut.clear(); this.outAt.clear(); this.spinAt.clear(); this.t = 0; this.cuts = 0; }
  /** follow this car (null: the director chooses again) */
  follow(car) { this.followCar = car || null; this.shot = null; }
  /** a cutaway, at the next cut (for a few seconds from now): kind 'crowd' | 'garage', the car it is about */
  cutaway(kind, car, within = 6) { if (car && this.camKind === 'auto') this.away = { kind, car, until: this.t + within }; }   /* (a camera you keep to is not cut away from) */
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
    if ((ph === 'sc' || ph === 'scIn') && d.sc.car && !d.sc.car.pitLane) out.push({ car: d.sc.car, other: P.find((c) => onTrack(c)) || null, score: 19 + ((this.cuts * 0.618034) % 1) * 6, why: 'sc' });
    if (ph === 'red') { const l0 = P.find((c) => !c.retired); if (l0) out.push({ car: l0, score: 18, why: 'red' }); }
    // the start: the pack off the line, from the drone behind it
    if (d.world.racing && d.mode === 'race' && P[0] && (P.find((c) => !c.retired)?.lap || 0) === 0 && d.time - (d.world.raceStart ?? d.time) < 8 && !(d.sc?.redCount > 0)) out.push({ car: P[0], score: 46, why: 'start' });
    // a cutaway asked for (the crowd, a garage): once, soon, briefly
    if (this.away && t < this.away.until && this.camKind === 'auto' && !this.followCar) out.push({ car: this.away.car, score: 31, why: this.away.kind, away: true });
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
    if (this.camKind !== 'auto') return st.why === 'pit' && this.camKind === 'track' ? 'pit' : this.camKind;
    if (st.why === 'grid') return 'grid';
    if (st.why === 'start') return 'drone';
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
    if (st.away) this.away = null; if (kind === 'beauty') this.beautyAt = this.t;
    // (a circuit that is not flat - Austin: every camera stands on the ground where it is, and looks at the car where
    //  the car is; heights are above that ground, never above zero)
    const G = (x, z) => (ctx.ground ? ctx.ground(x, z) : 0), cy = (c) => G(c.x, c.z) + ((c.air || c.wreck) && c.p ? Math.max(0, c.p[1]) : 0);
    // (the rear onboard is the car ahead's, the one behind in its mirror)
    const subject = kind === 'rear' && st.other ? st.other : car;
    const sh = { kind, car: subject, other: kind === 'rear' ? car : st.other || null, why: st.why, t: 0, dur: st.why === 'grid' ? 7 : st.why === 'start' ? 8 : kind === 'crowd' ? 3.2 : kind === 'garage' ? 4.2 : kind === 'beauty' ? 5 : st.urgent ? 7 : 5 + ((this.cuts * 0.3819) % 1) * 4, s0: 0, side: 1, h: 6 };
    // ---- the kerb camera: in the kerb at the apex of the next corner, the cars coming at it. No corner near, or no view
    //      from it (a wall on the kerb): a trackside camera instead
    if (kind === 'kerb') {
      let s0 = null, side = 1;
      for (let ds = 70; ds < 460; ds += 12) { const i = tr.idxAtS(tr.wrapS(subject.s + ds)); if (!tr.inCornerZone(i)) continue; let e = ds; while (e < ds + 220 && tr.inCornerZone(tr.idxAtS(tr.wrapS(subject.s + e)))) e += 12; const sm = tr.wrapS(subject.s + (ds + e) / 2), im = tr.idxAtS(sm), n = tr.n, a = (im - 6 + n) % n, b = (im + 6) % n; side = (tr.tx[b] - tr.tx[a]) * tr.nx[im] + (tr.tz[b] - tr.tz[a]) * tr.nz[im] > 0 ? 1 : -1; s0 = sm; break; }
      if (s0 != null) { const i = tr.idxAtS(s0), off = side * ((tr.edgeAt ? tr.edgeAt(i, side) : tr.wallAt(i, side) - 2) + (tr.kerbWidth || 1) * 0.6), f = tr.sample(s0, off), p = new THREE.Vector3(f.x, G(f.x, f.z) + 0.55, f.z); if (!ctx.clear || ctx.clear(p.x, p.y, p.z, subject.x, cy(subject) + 0.8, subject.z)) { sh.s0 = s0; sh.side = side; sh.pos = p; sh.kerb = true; } }
      if (!sh.pos) { kind = 'track'; sh.kind = 'track'; } else sh.kind = 'track';   // (placed: from here it is a trackside camera, a low one)
    }
    if (kind === 'track') {
      // a camera along the barrier ahead of the car: it comes toward it, passes, and the shot ends a little after
      const ahead = st.urgent ? 25 : 90 + ((this.cuts * 0.7548) % 1) * 110, s0 = tr.wrapS(subject.s + Math.max(20, ahead * Math.min(1.6, Math.max(0.5, subject.speed / 55))));
      // (two kinds of trackside camera, as at a real circuit: on a pole over the barrier - 10-13 m up, 0.6 m behind the
      //  wall's face: the line down to a car even 1 m off that wall clears the top of a 5.5 m catch fence cranked in over
      //  the road - or in a slot cut in the fence line, the lens just over the concrete, the mesh beside it, none in front)
      const side = (this.cuts & 1) ? 1 : -1, i = tr.idxAtS(s0), slot = !st.urgent && ((this.cuts * 0.4142) % 1) < 0.4;
      const off = slot ? 0.05 : 0.6, f = tr.sample(s0, side * (tr.wallAt(i, side) + off));
      sh.s0 = s0; sh.side = side; sh.slot = slot;
      sh.h = slot ? Math.max(1.9, (tr.barrierHeight?.(i, side) > 2 ? 1.3 : tr.barrierHeight?.(i, side) || 1.2) + 0.7) : 10 + ((this.cuts * 0.271) % 1) * 3;
      sh.pos = new THREE.Vector3(f.x, G(f.x, f.z) + sh.h, f.z);
      // (the camera must SEE the car: from where it stands to the car now and to the road it will pass on, nothing
      //  in the way - a wall or a fence where the track bends, a building, a stand. The first of a few places that
      //  does: this one, the other side of the road, a pole instead of a slot, nearer, further, higher)
      if (ctx.clear) {
        // (a slot in the fence line: the fence's own mesh in the ray too - on a bend the line along the wall leaves through it a metre from the lens)
        const cl = sh.slot && ctx.clearFull ? ctx.clearFull : ctx.clear;
        const sees = (p) => { const m = tr.sample(tr.wrapS(s0 - 22), 0); return cl(p.x, p.y, p.z, subject.x, cy(subject) + 0.8, subject.z) && ctx.clear(p.x, p.y, p.z, m.x, G(m.x, m.z) + 0.8, m.z); };
        if (!sees(sh.pos)) {
          let found = false;
          for (const [sd, sl, k, hh] of [[-side, false, 1, 11], [side, false, 1, 12.5], [side, false, 0.55, 11], [-side, false, 0.55, 12], [side, false, 1.5, 13], [-side, false, 1.5, 13], [side, false, 1, 17], [-side, false, 1, 17]]) {
            const sq = tr.wrapS(subject.s + Math.max(20, ahead * k * Math.min(1.6, Math.max(0.5, subject.speed / 55)))), iq = tr.idxAtS(sq), fq = tr.sample(sq, sd * (tr.wallAt(iq, sd) + 0.6)), p = new THREE.Vector3(fq.x, G(fq.x, fq.z) + hh, fq.z);
            const m = tr.sample(tr.wrapS(sq - 22), 0);
            if (ctx.clear(p.x, p.y, p.z, subject.x, cy(subject) + 0.8, subject.z) && ctx.clear(p.x, p.y, p.z, m.x, G(m.x, m.z) + 0.8, m.z)) { sh.pos = p; sh.s0 = sq; sh.side = sd; sh.slot = sl; sh.h = hh; found = true; break; }
          }
          // (nowhere along here has a view - between buildings, under a bridge: the helicopter has it)
          if (!found) { sh.kind = 'heli'; sh.pos = null; }
        }
      }
    } else if (kind === 'crane') {
      // a crane at the fence: its head low and near as the car comes, rising and swinging out as it passes
      const side = (this.cuts & 1) ? 1 : -1, s0 = tr.wrapS(subject.s + Math.max(40, 110 * Math.min(1.5, Math.max(0.5, subject.speed / 55)))), i = tr.idxAtS(s0), w = tr.wallAt(i, side);
      const a = tr.sample(s0, side * (w - 0.8)), b = tr.sample(tr.wrapS(s0 + 14), side * (w + 2.5)), p0 = new THREE.Vector3(a.x, G(a.x, a.z) + 3.2, a.z), p1 = new THREE.Vector3(b.x, G(b.x, b.z) + 13, b.z);
      if (!ctx.clear || (ctx.clear(p1.x, p1.y, p1.z, subject.x, cy(subject) + 0.8, subject.z) && ctx.clear(p0.x, p0.y + 1.5, p0.z, subject.x, cy(subject) + 0.8, subject.z))) { sh.kind = 'track'; sh.s0 = s0; sh.side = side; sh.pos = p0.clone(); sh.pos0 = p0; sh.pos1 = p1; sh.crane = true; }
      else { sh.kind = 'heli'; }
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
    this.shot = sh; this.cuts++; this._lookInit = false;
    this.lastSeen.set(subject, this.t); if (sh.other) this.lastSeen.set(sh.other, this.t);
    if (st.why === 'out') this.seenOut.add(car);
    this.onCut?.(sh);
  }

  update(dt, ctx) {
    this.t += dt;
    const d = ctx.d, sh = this.shot;
    const gone = (c) => !c || (c.hiddenAway && c.retired);
    let want = null;
    if (this.followCar && !gone(this.followCar)) {
      // a car followed: its own story (in the pits, in a fight) - the cameras still cut round it
      const S = this.stories(ctx).filter((x) => x.car === this.followCar || x.other === this.followCar).sort((a, b) => b.score - a.score);
      want = S[0] ? { ...S[0], car: this.followCar, other: S[0].car === this.followCar ? S[0].other : S[0].car } : { car: this.followCar, score: 1, why: 'team' };
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
    const ended = !sh || (gone(sh.car) && sh.kind !== 'garage' && sh.kind !== 'crowd' && sh.kind !== 'beauty') || sh.t > sh.dur || (sh.kind === 'track' && this.passed(ctx, sh)) || (sh.kind === 'pit' && !sh.car.pitLane && !sh.car.inPit && sh.t > 2)
      || (sh.why === 'grid' && d.world.racing && sh.t > 3);
    const urgent = (want.urgent && sh && sh.car !== want.car && sh.t > 1.2 && !(sh.why === 'out' || sh.why === 'spin')) || (want.away && sh && sh.why !== want.why && sh.t > 1.5) || (want.why === 'start' && sh && sh.why !== 'start');
    if (ended || urgent || (this.followCar && sh && sh.car !== want.car && sh.other !== want.car && sh.car !== this.followCar)) this.cut(ctx, want);
    this.shot.t += dt;
    this.place(dt, ctx);
    return this.shot.car;
  }
  /** a trackside shot: the car has gone by the camera, and on */
  passed(ctx, sh) {
    const L = ctx.track.length; let ds = sh.car.s - sh.s0; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L;
    return ds > 45 || (ds < -400 && sh.t > 3);
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
    if (sh.kind === 'drone') {
      // behind the pack and over it, flying with it
      const c = Math.cos(car.th), s = Math.sin(car.th); this._pos.set(car.x - c * 34, carY + 11, car.z - s * 34);
      if (!this._lookInit) cam.position.copy(this._pos); else cam.position.lerp(this._pos, Math.min(1, dt * 4));
      tgt.set(car.x + c * 6, carY + 0.5, car.z + s * 6); fov = 52;
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
      if (ctx.clear && !sh.crane) { sh.chk = (sh.chk || 0) + dt; if (sh.chk > 0.55) { sh.chk = 0; if (!(ctx.clearFull || ctx.clear)(sh.pos.x, sh.pos.y, sh.pos.z, car.x, carY + 0.8, car.z)) { sh.lostN = (sh.lostN || 0) + 1; if (sh.lostN >= 2 && sh.t > 1.3) { sh.dur = Math.min(sh.dur, sh.t); this.lostCuts = (this.lostCuts || 0) + 1; } } else sh.lostN = 0; } }
      fov = sh.kerb ? Math.max(24, Math.min(62, 900 / Math.max(10, dist))) : Math.max(9, Math.min(55, 1500 / Math.max(18, dist)));
      if (sh.other) { tgt.x = (car.x * 2 + sh.other.x) / 3; tgt.z = (car.z * 2 + sh.other.z) / 3; tgt.y = (carY * 2 + G(sh.other.x, sh.other.z)) / 3 + 0.7; fov = Math.max(fov, Math.min(55, 2400 / Math.max(18, dist))); }
    } else if (sh.kind === 'heli') {
      const c = Math.cos(car.th), s = Math.sin(car.th);
      // (the helicopter flies where it can see the car: behind and to one side - or the other side, or higher and
      //  closer over it where towers stand along the road; looked at again a few times a second)
      // (over the pit lane: from nearly overhead - the pit wall, its fence and the garages' roof stand either side of it)
      if ((car.pitLane || car.inPit) && (sh.hk ?? 0) < 4) sh.hk = 4;
      const H = HELI[sh.hk || 0];
      this._pos.set(car.x + c * H[0] - s * H[1], carY + H[2], car.z + s * H[0] + c * H[1]);
      if (ctx.clear && (sh.hk == null || sh.t - (sh.ht ?? -9) > 0.45)) {
        sh.ht = sh.t;
        // (judged from where it would be AND from where it is now - it trails the car a little as it flies)
        if (sh.hk == null || !ctx.clear(this._pos.x, this._pos.y, this._pos.z, car.x, carY + 1.0, car.z) || (this._lookInit && !ctx.clear(cam.position.x, cam.position.y, cam.position.z, car.x, carY + 1.0, car.z))) {
          // (over the pit lane only the steep places are tried - the low ones see the pit wall, and trying them set
          //  the helicopter swinging between a low place and a high one; with no view at all - a car in its box under
          //  the pit building's roof - it stays overhead)
          const from = car.pitLane || car.inPit ? 4 : 0, cnt = HELI.length - from, k0 = Math.max(from, sh.hk ?? from);
          for (let q = 0; q < cnt; q++) { const k = from + ((k0 - from + q) % cnt), Hq = HELI[k], px = car.x + c * Hq[0] - s * Hq[1], pz = car.z + s * Hq[0] + c * Hq[1]; if (ctx.clear(px, carY + Hq[2], pz, car.x, carY + 1.0, car.z)) { sh.hk = k; this._pos.set(px, carY + Hq[2], pz); break; } if (q === cnt - 1) { sh.hk = HELI.length - 1; if (from === 4) { /* (in its box under the pit building's roof: nothing in the air sees it - the pit lane's own camera has it until it is out again) */ sh.kind = 'pit'; sh.pos = null; this._lookInit = false; return this.place(dt, ctx); } } }
        }
        if (sh.hk == null) sh.hk = 0;
      }
      if (!this._lookInit || cam.position.distanceTo(this._pos) > 160) cam.position.copy(this._pos); else cam.position.lerp(this._pos, Math.min(1, dt * 3.5));   // (it keeps up: a second behind at most; a jump of more than 160 m is a cut)
      tgt.set(car.x + c * 15, carY, car.z + s * 15); fov = H[2] > 120 ? 16 : H[2] > 80 ? 22 : 30;
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
          const C = [at(30, 0.75, 5.2), at(-26, 0.75, 5.2), at(22, 0.2, 9), at(-18, 0.2, 9), at(12, 0, 14)];
          sh.pos = C.find((p) => !ctx.clear || ctx.clear(p.x, p.y, p.z, car.x, carY + 0.9, car.z)) || C[C.length - 1];
        }
        // (the car moves on down the lane: a camera that has lost it behind a gantry or the next garage's awning is
        //  placed again, a second or so apart)
        if (ctx.clear && sh.t - (sh.pt ?? 0) > 1.0) { sh.pt = sh.t; if (!ctx.clear(sh.pos.x, sh.pos.y, sh.pos.z, car.x, carY + 0.9, car.z)) { sh.pos = null; this._lookInit = false; return this.place(0, ctx); } }
        cam.position.copy(sh.pos);
        fov = Math.max(14, Math.min(50, 900 / Math.max(10, Math.hypot(car.x - sh.pos.x, car.z - sh.pos.z))));
      } else { this.shot.kind = 'track'; return; }
    } else if (sh.kind === 'grid') {
      cam.position.copy(sh.pos); tgt.copy(sh.lookAt); fov = 34;
    }
    // the operator's pan: the aim eases after the car (a long lens never snaps)
    if (!this._lookInit) { this._look.copy(tgt); this._lookInit = true; } else this._look.lerp(tgt, Math.min(1, dt * (sh.kind === 'track' || sh.kind === 'drone' ? 9 : 4)));
    cam.up.set(0, 1, 0); cam.lookAt(this._look);
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov += (fov - cam.fov) * Math.min(1, dt * (sh.t < 0.05 ? 99 : 3)); cam.updateProjectionMatrix(); }
  }
}
