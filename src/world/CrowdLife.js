// The grid's crowd, alive (ui/PreRace.js builds it, ui/GridWalk.js carries on with it). Each person is somebody with
// something to do, and then something else: the team's crew round their car - standing, arms folded, hands on the
// car, wandering round it; guests and VIPs in groups talking (one making a point with a hand up while the others
// listen and nod), filming the cars on their phones, taking selfies with a car behind them, then walking off down the
// middle of the grid to somewhere else; photographers working the front rows (their flashes going off); the TV crews.
// Drawn as world/Crowd.js's instanced templates, flipbook-style: a person in a pose is an instance of that pose's
// template for their look (a three-frame walk cycle), re-sorted into the templates every frame. Templates are baked
// the first time they are needed, a couple a frame at most. You can push through them (push()).
import * as THREE from 'three';
import { bakeTemplate, bakeFarTemplate, crowdMaterial, SKINS, HAIRS } from './Crowd.js';

const pick = (a) => a[(Math.random() * a.length) | 0];
const rnd = (a, b) => a + Math.random() * (b - a);
const HS = ['short', 'short', 'buzz', 'side', 'quiff', 'swept', 'curly', 'wavy', 'mullet', 'locs'];
const FH = [null, null, null, 'stubble', 'beard', 'mustache'];
const LOOKS = { crew: 4, guest: 7, photo: 2, tv: 2 };
const STEP = ['walk1', 'walk2', 'walk3', 'walk2'];
const PROPS = { phone: 'phone', selfie: 'selfie', photo: 'photo', tvcam: 'tvcam' };
const ATTR = ['iSkin', 'iTop', 'iLegs', 'iHair', 'iAcc', 'iTeam'];
const FAR = 18;
// every pose a role can be seen in (built ahead of time in the background: _prebake)
const ROLE_POSES = { crew: ['talk', 'cross', 'hips', 'gesture', 'reach', 'walk1', 'walk2', 'walk3'], guest: ['talk', 'gesture', 'phone', 'selfie', 'cross', 'hips', 'walk1', 'walk2', 'walk3'], photo: ['photo', 'talk', 'gesture', 'cross', 'hips', 'walk1', 'walk2', 'walk3'], tv: ['tvcam', 'walk1', 'walk2', 'walk3'] };   // m: beyond it, the light version of each template

export class CrowdLife {
  /** o: { night, cars, track, free(x, z) (open ground for a person to stand: not a car, not off the grid), walkway(x, z) -> [x, z] } */
  constructor(o) {
    Object.assign(this, o);
    this.people = []; this.spots = []; this.meshes = new Map(); this.group = new THREE.Group(); this.group.name = 'crowd-life';
    this.looks = {};
    for (const [role, n] of Object.entries(LOOKS)) this.looks[role] = Array.from({ length: n }, () => ({ kit: role === 'guest' ? pick(['jacket', 'polo', 'jacket']) : role === 'tv' ? 'polo' : role === 'photo' ? pick(['polo', 'jacket']) : 'polo', hs: pick(HS), fh: pick(FH), cap: role === 'crew' ? Math.random() < 0.55 : Math.random() < 0.18, lanyard: role === 'guest' && Math.random() < 0.5 }));
    this.M = new THREE.Matrix4(); this.Q = new THREE.Quaternion(); this.P = new THREE.Vector3(); this.S = new THREE.Vector3(); this.Y = new THREE.Vector3(0, 1, 0);
    this.t = 0; this.bakes = 0;
  }
  /** a person: role crew | guest | photo | tv; home: the car they belong by; act: what they start doing */
  add(role, x, z, face, col, scale, home, act) {
    const c = new THREE.Color(), cols = new Float32Array(18);
    const set = (k, v) => { c.set(v); cols[k * 3] = c.r; cols[k * 3 + 1] = c.g; cols[k * 3 + 2] = c.b; };
    set(0, col.skin || pick(SKINS)); set(1, col.top || '#2b2e35'); set(2, col.legs || '#23262c'); set(3, col.hair || pick(HAIRS)); set(4, col.acc || '#ffffff'); set(5, col.team || col.top || '#2b2e35');
    const p = { role, li: (Math.random() * this.looks[role].length) | 0, x, z, yaw: face, want: face, cols, scale, home, act: act || 'idle', t: rnd(2, 9), pose: role === 'photo' ? 'photo' : role === 'tv' ? 'tvcam' : 'talk', ph: Math.random() * 6.28, step: Math.random() * 4, nod: 0, look: 0, speak: false, path: null, by: 0 };
    p.idlePose = role === 'crew' ? pick(['talk', 'cross', 'hips', 'talk']) : pick(['talk', 'talk', 'cross', 'hips']);
    this.people.push(p); return p;
  }
  /** one queued template built (every other frame, never alongside one built on demand) */
  _prebake() {
    if (!this._queue?.length || (this._tick = (this._tick || 0) + 1) % 2) return;
    while (this._queue.length) { const [p, pose, far] = this._queue.shift(); if (this.meshes.has(this._key(p, pose, far))) continue; this._mesh(p, pose, true, far); break; }
  }
  _key(p, pose, far) { return `${p.role}:${p.li}:${pose}${far ? ':far' : ''}`; }
  // (far: the same person on far fewer triangles, for anyone more than FAR metres from the camera)
  _spec(p, pose, far) { const L = this.looks[p.role][p.li]; return { pose, kit: L.kit, hs: L.hs, fh: L.fh, cap: L.cap, prop: PROPS[pose] || (p.role === 'tv' && pose.startsWith('walk') ? 'tvcam' : null), props: L.lanyard && !far ? ['lanyard'] : [], q: far ? 0.14 : 0.27, detail: far ? 0.1 : 0.18 }; }
  /** the template mesh for this person in this pose (baked now if allowed, else null) */
  _mesh(p, pose, allow, far = false) {
    const k = this._key(p, pose, far); let e = this.meshes.get(k);
    if (e) return e;
    if (!allow) return null;
    const cap = this.people.filter((q) => q.role === p.role && q.li === p.li).length;
    const geo = far ? bakeFarTemplate(this._spec(p, pose, far)) : bakeTemplate(this._spec(p, pose, far));
    for (const a of ATTR) geo.setAttribute(a, new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3));
    geo.setAttribute('iMisc', new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4));
    const mesh = new THREE.InstancedMesh(geo, crowdMaterial(), cap); mesh.frustumCulled = false; mesh.count = 0; mesh.name = 'life:' + k;
    this.group.add(mesh); e = { mesh, n: 0 }; this.meshes.set(k, e); this.bakes++;
    return e;
  }
  /** into group, with the templates everyone starts in baked (the rest as they are needed) */
  build(group) {
    crowdMaterial().userData.lift.value = this.night ? 0.2 : 0;
    for (const p of this.people) this._mesh(p, this._pose(p), true);
    // the photographers' flashes
    const n = Math.max(1, this.people.filter((p) => p.role === 'photo').length);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3).fill(-100), 3));
    this.flash = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.flash.frustumCulled = false; this.group.add(this.flash);
    // the rest of the templates (every look in every pose, near and far), queued to be built in the background - so
    // nothing is built on the spot when somebody starts walking or comes into range (a hitch)
    const seen = new Set(); this._queue = [];
    for (const p of this.people) { const k = `${p.role}:${p.li}`; if (seen.has(k)) continue; seen.add(k); for (const pose of ROLE_POSES[p.role] || ['talk']) for (const far of [true, false]) this._queue.push([p, pose, far]); }
    this._tick = 0;
    group.add(this.group);
    this._write();
  }

  // ---- what they do -------------------------------------------------------------------------------------------------
  _pose(p) {
    if (p.path) return STEP[Math.floor(p.step) % 4];
    switch (p.act) {
      case 'phone': return 'phone';
      case 'selfie': return 'selfie';
      case 'work': return 'reach';
      case 'shoot': return 'photo';
      case 'tv': return 'tvcam';
      case 'chat': return p.speak && Math.sin(p.ph * 2.2) > -0.2 ? 'gesture' : p.idlePose;
      default: return p.role === 'photo' ? 'photo' : p.idlePose;
    }
  }
  _next(p) {
    const r = Math.random(), home = p.home;
    p.speak = false; p.nod = 0; p.look = 0;
    if (p.role === 'tv') { p.act = 'tv'; p.t = 1e9; return; }
    if (p.role === 'photo') {
      if (r < 0.55) { p.act = 'shoot'; p.t = rnd(5, 11); p.target = this._nearCar(p, true); }
      else { this._walkTo(p, this._spotNear(pick(this.cars.slice(0, 10)), 3.6, 5)); p.after = 'shoot'; }
      return;
    }
    if (p.role === 'crew') {
      if (r < 0.55) { p.act = 'idle'; p.t = rnd(6, 14); p.idlePose = pick(['talk', 'cross', 'hips', 'talk']); }
      else if (r < 0.68) { const s = this._spotNear(home, 1.75, 2.1); if (s) { this._walkTo(p, s); p.after = 'work'; } else { p.act = 'idle'; p.t = 4; } }
      else if (r < 0.9) { p.act = 'chat'; p.t = rnd(6, 14); }
      else { const s = this._spotNear(home, 2.6, 4.2); if (s) this._walkTo(p, s); p.after = 'idle'; }
      return;
    }
    // a guest
    if (r < 0.44) { p.act = 'chat'; p.t = rnd(8, 18); p.idlePose = pick(['talk', 'talk', 'cross', 'hips']); }
    else if (r < 0.64) { p.act = 'phone'; p.t = rnd(4, 9); p.target = this._nearCar(p); }
    else if (r < 0.8) { p.act = 'selfie'; p.t = rnd(3, 6); p.target = this._nearCar(p); }
    else {
      // somewhere else on the grid: another car, often one near the front - or out by the walls
      const car = Math.random() < 0.6 ? pick(this.cars.slice(0, 8)) : pick(this.cars);
      let s = null;
      if (this.spots.length && Math.random() < 0.35) { const [sx, sz] = pick(this.spots); for (let k = 0; k < 8 && !s; k++) { const x = sx + rnd(-1.2, 1.2), z = sz + rnd(-1.2, 1.2); if (this.free(x, z) && !this.people.some((q) => (q.x - x) ** 2 + (q.z - z) ** 2 < 0.42)) s = [x, z]; } }
      if (!s) s = this._spotNear(car, 3.6, 6); if (s) { this._walkTo(p, s); p.after = Math.random() < 0.5 ? 'chat' : 'phone'; p.home = car; } else { p.act = 'chat'; p.t = 5; }
    }
  }
  _nearCar(p, front) {
    let best = null, bd = 1e9;
    for (const c of front ? this.cars.slice(0, 12) : this.cars) { const d = (c.x - p.x) ** 2 + (c.z - p.z) ** 2; if (d < bd) { bd = d; best = c; } }
    return best;
  }
  /** an open spot round car c, between rmin and rmax from its centre (an ellipse round the car), nobody on it */
  _spotNear(c, rmin, rmax) {
    if (!c) return null;
    for (let k = 0; k < 24; k++) {
      const a = Math.random() * 6.283, r = rnd(rmin, rmax), u = Math.cos(a) * r * 1.35, v = Math.sin(a) * r * 0.75;
      const x = c.x + Math.cos(c.th) * u + Math.sin(c.th) * v, z = c.z + Math.sin(c.th) * u - Math.cos(c.th) * v;
      if (!this.free(x, z)) continue;
      if (this.people.some((q) => (q.x - x) ** 2 + (q.z - z) ** 2 < 0.42)) continue;
      return [x, z];
    }
    return null;
  }
  /** set off for (x, z): straight there if no car is in the way, else via the walkway down the middle of the grid */
  _walkTo(p, to) {
    if (!to) { p.act = 'idle'; p.t = 3; return; }
    const pts = [];
    if (this._blocked(p.x, p.z, to[0], to[1])) { const a = this.walkway(p.x, p.z), b = this.walkway(to[0], to[1]); pts.push(a, b); }
    pts.push(to); p.path = pts; p.act = 'walk'; p.speed = rnd(1.0, 1.45); p.t = 60;
  }
  _blocked(x0, z0, x1, z1) {
    const n = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 0.5);
    for (let i = 1; i < n; i++) { const f = i / n; if (this._inCar(x0 + (x1 - x0) * f, z0 + (z1 - z0) * f, 0.35)) return true; }
    return false;
  }
  _inCar(x, z, m = 0) {
    for (const c of this.cars) { const dx = x - c.x, dz = z - c.z, ca = Math.cos(c.th), sa = Math.sin(c.th), u = dx * ca + dz * sa, v = -dx * sa + dz * ca; if (Math.abs(u) < 2.95 + m && Math.abs(v) < 1.15 + m) return true; }
    return false;
  }

  /**
   * You on the grid (the walk): the nearest few TV crews and photographers within range turn to follow you - facing
   * you, filming, and walking after you to keep you in shot. Called every frame with where you are.
   */
  follow(pos, n = 3, range = 30) {
    this._fp = pos;
    if ((this._fpT = (this._fpT || 0) - 1 / 30) > 0) return; this._fpT = 1;
    const cand = this.people.filter((p) => (p.role === 'tv' || p.role === 'photo') && (p.x - pos.x) ** 2 + (p.z - pos.z) ** 2 < range * range).sort((a, b) => ((a.x - pos.x) ** 2 + (a.z - pos.z) ** 2) - ((b.x - pos.x) ** 2 + (b.z - pos.z) ** 2)).slice(0, n);
    for (const p of this.people) if (p._watch && !cand.includes(p)) { p._watch = false; p.t = Math.min(p.t, 2); }
    for (const p of cand) p._watch = true;
  }
  /** the ones following you now */
  watchers() { return this.people.filter((p) => p._watch); }
  /** every frame (dt s, t: the show's clock) */
  update(dt, t, cam) {
    this.cam = cam || null;
    this.t = t; this.bakes = 0;
    this._prebake();
    const ppl = this.people;
    for (const p of ppl) {
      p.ph += dt;
      if (p.path) {
        // walking: along the path, the legs going with the distance
        const [tx, tz] = p.path[0], dx = tx - p.x, dz = tz - p.z, d = Math.hypot(dx, dz);
        if (d < 0.15) { p.path.shift(); if (!p.path.length) { p.path = null; p.act = p.after || 'idle'; p.after = null; p.t = rnd(5, 11); if (p.act === 'phone' || p.act === 'shoot') p.target = this._nearCar(p, p.act === 'shoot'); } }
        else {
          const v = Math.min(d, p.speed * dt); p.x += dx / d * v; p.z += dz / d * v; p.step += v / 0.36;
          p.want = Math.atan2(-dz, dx); p.by = 0.022 * Math.abs(Math.sin(p.step * Math.PI / 2));
        }
      } else if (p._watch && this._fp) {
        // following you: keep you in shot from four or five metres, turned to you, camera up
        const P = this._fp, dx = P.x - p.x, dz = P.z - p.z, d = Math.hypot(dx, dz) || 1;
        p.by = 0; p.act = p.role === 'tv' ? 'tv' : 'shoot'; p.want = Math.atan2(-dz, dx); p.nod = 0;
        if (d > 7.5 && (p._wt = (p._wt || 0) - dt) <= 0) { p._wt = 2.2; const to = [P.x - dx / d * 4.6 + rnd(-1, 1), P.z - dz / d * 4.6 + rnd(-1, 1)]; if (this.free(to[0], to[1]) || !this._inCar(to[0], to[1], 0.3)) { this._walkTo(p, to); p.after = p.act; p.speed = 1.6; } }
      } else {
        p.by = 0;
        p.t -= dt; if (p.t <= 0) this._next(p);
        // facing: the car for filming and working, away from it for a selfie, the others in the group for a chat
        const tc = p.target || p.home;
        if ((p.act === 'phone' || p.act === 'shoot' || p.act === 'work' || (p.act === 'idle' && p.role === 'crew')) && tc) p.want = Math.atan2(-(tc.z - p.z), tc.x - p.x);
        else if (p.act === 'selfie' && tc) p.want = Math.atan2(-(p.z - tc.z), p.x - tc.x);
        else if (p.act === 'chat') {
          // (who they are talking to: looked for now and then, not every frame)
          if ((p._fc = (p._fc || 0) - dt) <= 0) {
            p._fc = rnd(0.6, 1.1); let cx = 0, cz = 0, n = 0;
            for (const q of ppl) { if (q === p || q.path) continue; const d2 = (q.x - p.x) ** 2 + (q.z - p.z) ** 2; if (d2 < 3.2 && d2 > 0.04) { cx += q.x; cz += q.z; n++; } }
            p._cw = n ? Math.atan2(-(cz / n - p.z), cx / n - p.x) : p.want;
          }
          p.want = p._cw ?? p.want;
          // taking turns: now speaking (a hand up, a nod), now listening (a slower nod)
          if ((p._sw = (p._sw || 0) - dt) <= 0) { p._sw = rnd(1.8, 4.5); p.speak = Math.random() < 0.38; }
          p.nod = p.speak ? 0.07 : 0.045;
        } else p.nod = p.act === 'idle' ? 0.02 : 0;
        p.look = p.act === 'phone' ? 0.05 : 0;
      }
      let dy = p.want - p.yaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
      p.yaw += dy * Math.min(1, dt * (p.path ? 6 : 3));
    }
    // the flashes: a photographer at work, every second or two
    if (this.flash) {
      const a = this.flash.geometry.attributes.position; let k = 0;
      for (const p of ppl) {
        if (p.role !== 'photo') continue;
        const on = p.act === 'shoot' && !p.path && ((p.ph * 0.73 + p.li) % 1.6) < 0.07;
        if (on) { const c = Math.cos(p.yaw), s = Math.sin(p.yaw); a.setXYZ(k, p.x + c * 0.52 * p.scale, 1.52 * p.scale, p.z - s * 0.52 * p.scale); } else a.setXYZ(k, 0, -100, 0);
        k++;
      }
      a.needsUpdate = true;
    }
    this._write();
  }
  /** everyone into the templates for the pose they are in now */
  _write() {
    for (const e of this.meshes.values()) e.n = 0;
    const { M, Q, P, S, Y } = this;
    for (const p of this.people) {
      const far = !!this.cam && (p.x - this.cam.x) ** 2 + (p.z - this.cam.z) ** 2 > FAR * FAR;
      let pose = this._pose(p), e = (far && (this._mesh(p, pose, this.bakes < 2, true) || this._mesh(p, pose, false))) || this._mesh(p, pose, this.bakes < 2);
      if (!e) { pose = p.path ? 'talk' : p.idlePose; e = this._mesh(p, pose, true) || this._mesh(p, 'talk', true); }
      const i = e.n++, m = e.mesh, g = m.geometry;
      M.compose(P.set(p.x, p.by, p.z), Q.setFromAxisAngle(Y, p.yaw), S.setScalar(p.scale)); m.setMatrixAt(i, M);
      for (let k = 0; k < 6; k++) { const A = g.attributes[ATTR[k]].array; A[i * 3] = p.cols[k * 3]; A[i * 3 + 1] = p.cols[k * 3 + 1]; A[i * 3 + 2] = p.cols[k * 3 + 2]; }
      const mi = g.attributes.iMisc.array; mi[i * 4] = p.ph0 ?? (p.ph0 = Math.random() * 6.28); mi[i * 4 + 1] = 0; mi[i * 4 + 2] = p.nod; mi[i * 4 + 3] = p.look;
    }
    for (const e of this.meshes.values()) {
      const m = e.mesh; m.count = e.n; m.visible = e.n > 0; if (!e.n) continue;
      m.instanceMatrix.needsUpdate = true; for (const a of ATTR) m.geometry.attributes[a].needsUpdate = true; m.geometry.attributes.iMisc.needsUpdate = true;
    }
  }
  /**
   * You, pushing through at (x, z) with radius r: anyone in the way is moved aside, gently (never into a car) ->
   * how hard it was (0: nobody there), to slow you down
   */
  push(x, z, r = 0.5) {
    let hard = 0;
    for (const p of this.people) {
      const dx = p.x - x, dz = p.z - z, d = Math.hypot(dx, dz); if (d >= r || p.role === 'tv') continue;
      const k = Math.min(0.06, (r - d) * 0.35), ux = d > 1e-3 ? dx / d : Math.random() - 0.5, uz = d > 1e-3 ? dz / d : Math.random() - 0.5;
      const nx = p.x + ux * k, nz = p.z + uz * k;
      if (!this._inCar(nx, nz, 0.1)) { p.x = nx; p.z = nz; }
      // (bumped: they look round at you, and give way for a moment)
      if (!p.path) { p.want = Math.atan2(dz, -dx); p.t = Math.max(p.t, 1.2); }
      hard = Math.max(hard, (r - d) / r);
    }
    return hard;
  }
}
