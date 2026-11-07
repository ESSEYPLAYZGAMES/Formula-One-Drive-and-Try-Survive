// The television director: the race as the world feed shows it, cut shot by shot. Every few seconds it picks the story
// worth watching - a fight for a place (the closer and the higher up the order, the better), an accident or a spin the
// moment it happens, a stop in the pit lane, the leader at the start and at the flag, and the cars of the team you run
// (main.js TP: they come round on the feed more often than the rest, and every time they are in a fight or the pits) -
// and a camera for it: the trackside cameras along the barriers, panning and zooming as the car comes by; the onboard
// T-cam; the chase; the helicopter; the rear-facing onboard of the car ahead with the one attacking it behind; the pit
// lane camera. A shot is held 5-9 s (an incident cuts in at once). Or you direct: follow a car (the cameras still cut
// round it), and / or keep to one camera.
//   update(dt, ctx) -> the car the shot is of (the game's S.player: the HUD, the sound and the camera's ground follow it)
//   ctx: { d (RaceDirector), track, pit, focus: [your cars], camCtl (CockpitCamera: the onboard and chase views) }
import * as THREE from 'three';

/** the cameras a viewer can keep to (keys 1-6 in the team principal's race) */
export const TV_CAMS = ['auto', 'track', 'tcam', 'chase', 'heli', 'rear'];
export const TV_CAM_NAME = { auto: 'Director', track: 'Trackside', tcam: 'Onboard', chase: 'Chase', heli: 'Helicopter', rear: 'Rear onboard', pit: 'Pit lane', grid: 'Grid' };

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
    this.t = 0; this.cuts = 0;
    this._look = new THREE.Vector3(); this._pos = new THREE.Vector3(); this._lookInit = false;
    this.onCut = null;           // (the graphics: a new shot - its car, its story)
  }
  reset() { this.shot = null; this.followCar = null; this.camKind = 'auto'; this.lastSeen.clear(); this.seenOut.clear(); this.outAt.clear(); this.t = 0; this.cuts = 0; }
  /** follow this car (null: the director chooses again) */
  follow(car) { this.followCar = car || null; this.shot = null; }
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
    // the flag: the leader coming to it, then the cars after it
    const lead = P.find((c) => !c.retired);
    if (lead && lead.lap >= d.lapsTotal - 1 && !lead.finished) out.push({ car: lead, score: 16, why: 'leader' });
    for (let i = 0; i < P.length; i++) {
      const c = P[i];
      // an accident, a spin, a car stopped: at once (once per retirement)
      if (c.retired && !this.outAt.has(c)) this.outAt.set(c, t);
      if (c.retired && !c.hiddenAway && !this.seenOut.has(c) && t - this.outAt.get(c) < 12) { out.push({ car: c, score: 40 + (mine(c) ? 10 : 0), why: 'out', urgent: true }); continue; }
      if (!c.retired && (c.air || c.wreck || (c.spinning && c.speed > 3))) { out.push({ car: c, score: 34 + (mine(c) ? 10 : 0), why: 'spin', urgent: true }); continue; }
      // a stop: in the lane
      if (!c.retired && (c.pitLane || c.inPit) && !c.isSC) { out.push({ car: c, score: mine(c) ? 22 : 3 + Math.max(0, 6 - i), why: 'pit' }); continue; }
      // a fight for a place: within a second of the car ahead, both on track
      const a = P[i - 1];
      if (i > 0 && d.mode === 'race' && onTrack(c) && onTrack(a) && c.lap === a.lap) {
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
    if (this.camKind !== 'auto') return st.why === 'pit' && this.camKind !== 'tcam' ? 'pit' : this.camKind;
    if (st.why === 'grid') return 'grid';
    if (st.why === 'pit') return 'pit';
    if (st.why === 'out' || st.why === 'spin') return this.cuts % 3 === 2 ? 'heli' : 'track';
    const r = (this.cuts * 0.618034) % 1;   // (a steady spread, not a die: the same race cuts the same way)
    if (st.why === 'battle') return r < 0.42 ? 'track' : r < 0.62 ? 'chase' : r < 0.82 ? 'tcam' : 'rear';
    return r < 0.4 ? 'track' : r < 0.62 ? 'tcam' : r < 0.8 ? 'chase' : 'heli';
  }

  // ---- a cut ---------------------------------------------------------------------------------------------------------
  cut(ctx, st) {
    const kind = this.pickKind(st, ctx), tr = ctx.track, car = st.car;
    // (the rear onboard is the car ahead's, the one behind in its mirror)
    const subject = kind === 'rear' && st.other ? st.other : car;
    const sh = { kind, car: subject, other: kind === 'rear' ? car : st.other || null, why: st.why, t: 0, dur: st.why === 'grid' ? 7 : st.urgent ? 7 : 5 + ((this.cuts * 0.3819) % 1) * 4, s0: 0, side: 1, h: 6 };
    if (kind === 'track') {
      // a camera along the barrier ahead of the car: it comes toward it, passes, and the shot ends a little after
      const ahead = st.urgent ? 25 : 90 + ((this.cuts * 0.7548) % 1) * 110, s0 = tr.wrapS(subject.s + Math.max(20, ahead * Math.min(1.6, Math.max(0.5, subject.speed / 55))));
      const side = (this.cuts & 1) ? 1 : -1, i = tr.idxAtS(s0), f = tr.sample(s0, side * (tr.wallAt(i, side) + 5));
      sh.s0 = s0; sh.side = side; sh.h = st.urgent ? 9 : 4.5 + ((this.cuts * 0.271) % 1) * 4; sh.pos = new THREE.Vector3(f.x, sh.h, f.z);
    } else if (kind === 'grid') {
      // high over the start line, looking down the grid
      const f = tr.sample(tr.wrapS(40), 0), b = tr.sample(tr.wrapS(-160), 0);
      sh.pos = new THREE.Vector3(f.x + (f.x - b.x) * 0.15, 22, f.z + (f.z - b.z) * 0.15); sh.lookAt = new THREE.Vector3(b.x, 0, b.z);
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
    const ended = !sh || gone(sh.car) || sh.t > sh.dur || (sh.kind === 'track' && this.passed(ctx, sh)) || (sh.kind === 'pit' && !sh.car.pitLane && !sh.car.inPit && sh.t > 2)
      || (sh.why === 'grid' && d.world.racing && sh.t > 3);
    const urgent = want.urgent && sh && sh.car !== want.car && sh.t > 1.2 && !(sh.why === 'out' || sh.why === 'spin');
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
    if (sh.kind === 'tcam' || sh.kind === 'chase' || sh.kind === 'rear') {
      cc.mode = sh.kind === 'chase' ? 'chase' : 'tcam'; cc.back = sh.kind === 'rear'; cc.lookIn = 0;
      // (a cut, not a swoop: the chase camera starts where it settles behind this car)
      if (sh.kind === 'chase' && !sh.placed) { const a = car.th, b = 8.5 + car.speed * 0.03; cc._chase.set(car.x - Math.cos(a) * b, 2.6 + car.speed * 0.006, car.z - Math.sin(a) * b); }
      sh.placed = true;
      cc.update(car, dt, ctx.track); cc.back = false;
      return;
    }
    let fov = 40;
    const tgt = _v.set(car.x, 0.7, car.z);
    if (sh.kind === 'track') {
      cam.position.copy(sh.pos);
      const dist = Math.hypot(car.x - sh.pos.x, car.z - sh.pos.z);
      fov = Math.max(9, Math.min(55, 1500 / Math.max(18, dist)));
      if (sh.other) { tgt.x = (car.x * 2 + sh.other.x) / 3; tgt.z = (car.z * 2 + sh.other.z) / 3; fov = Math.max(fov, Math.min(55, 2400 / Math.max(18, dist))); }
    } else if (sh.kind === 'heli') {
      const c = Math.cos(car.th), s = Math.sin(car.th);
      this._pos.set(car.x - c * 70 - s * 40, 55, car.z - s * 70 + c * 40);
      if (!this._lookInit) cam.position.copy(this._pos); else cam.position.lerp(this._pos, Math.min(1, dt * 1.6));
      tgt.set(car.x + c * 15, 0, car.z + s * 15); fov = 30;
    } else if (sh.kind === 'pit') {
      const P = ctx.pit;
      if (P && P.samples) {
        // along the lane, a little ahead of the car, on the garage side, looking back at it
        const ps = P.samples; let bi = 0, bd = Infinity;
        for (let i = 0; i < ps.n; i += 4) { const dd = (ps.px[i] - car.x) ** 2 + (ps.pz[i] - car.z) ** 2; if (dd < bd) { bd = dd; bi = i; } }
        if (!sh.pos) { const j = Math.min(ps.n - 1, bi + Math.round(28 / ps.ds)), off = -P.trackSide * (P.halfWidth + 2.5); sh.pos = new THREE.Vector3(ps.px[j] + ps.nx[j] * off, 3.6, ps.pz[j] + ps.nz[j] * off); }
        cam.position.copy(sh.pos);
        fov = Math.max(14, Math.min(50, 900 / Math.max(10, Math.hypot(car.x - sh.pos.x, car.z - sh.pos.z))));
      } else { this.shot.kind = 'track'; return; }
    } else if (sh.kind === 'grid') {
      cam.position.copy(sh.pos); tgt.copy(sh.lookAt); fov = 34;
    }
    // the operator's pan: the aim eases after the car (a long lens never snaps)
    if (!this._lookInit) { this._look.copy(tgt); this._lookInit = true; } else this._look.lerp(tgt, Math.min(1, dt * (sh.kind === 'track' ? 9 : 4)));
    cam.up.set(0, 1, 0); cam.lookAt(this._look);
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov += (fov - cam.fov) * Math.min(1, dt * (sh.t < 0.05 ? 99 : 3)); cam.updateProjectionMatrix(); }
  }
}
