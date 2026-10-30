// Pit crews: a real stop, choreographed. A pool of crews (21 people each - people, world/PersonRig.js: the person model
// in the team's suit and a crew helmet, skinned to CrewRig's bones so every limb moves) is sent to the stops that can be
// seen, one crew to a box: a double stack (the team-mate queued behind, RaceDirector.boxBusy) is the same crew again -
// the old tyres to the stack at the garage front, a fresh set from it, back to their places. When a car is coming in,
// its crew always runs out of the garage with the new tyres (never put at its places) and takes them up: the gunners kneeling at the wheels, a tyre-off and a tyre-on at each, the front
// jack in the car's path - the car drives into its cradle - and the rear jack waiting at the side, the two holding
// the car steady at the sidepods, the two at the front wing, the chief who releases it. The stop itself is timed to
// the stationary time the race gives it (RaceDirector.stopTime: ~2.0-2.6 s, a slow wheel, a wing change, a penalty
// served first with nobody touching the car): front jack up, the rear jack in behind the car - its handle under the
// rear wing, never through it - and up, the guns on the nuts, the old wheels off and away, the new ones on, the guns
// again, a hand up at each wheel, the jacks down, the front jack swung clear, released. A wing change: the wing men
// take the old wing off and away and fit the spare from its stand beside the box. Then the crew carries the old tyres
// back into the garage. All in the car's own frame where it actually stopped. A car that hits one of them (over 9 km/h)
// knocks them down - a ragdoll (world/Ragdoll.js): over the nose, across the car, off the back - and what they held falls
// free; whoever is down stays down until the crew goes back in.
import * as THREE from 'three';
import { POSE, gait, blendPose } from './CrewRig.js';
import { makePersonRig, warmPersonRigs } from './PersonRig.js';
import { Ragdoll, carTopR } from './Ragdoll.js';
import { COMPOUNDS } from '../vehicle/Tyres.js';

const NOSE_X = 3.09, REAR_X = -2.31, AXLE = { F: 1.855, R: -1.548 }, HUBW = { F: 0.775, R: 0.736 }, TYRE_W = { F: 0.332, R: 0.414 };   // (the 2026 car model's, about the centre of mass)
const LIFT_F = 0.085, LIFT_R = 0.08, NEAR = 220, RUN = 3.8, WALK = 1.5, STACK_W = 3.5;   // (STACK_W: the tyres stacked at the garage front)
const WHEELS = [['F', 1], ['F', -1], ['R', 1], ['R', -1]];   // (w side: +1 the garage side)
const smooth = (a, b, t) => { const u = Math.max(0, Math.min(1, (t - a) / Math.max(1e-6, b - a))); return u * u * (3 - 2 * u); };
const lerp = (a, b, f) => a + (b - a) * f;

// ---- the kit ---------------------------------------------------------------------------------------------------------
const G = {};
function geos() {
  if (G.tyre) return G;
  G.tyre = new THREE.CylinderGeometry(0.36, 0.36, 1, 26, 1, false).rotateX(Math.PI / 2);
  G.rim = new THREE.CircleGeometry(0.23, 18);
  G.ring = new THREE.RingGeometry(0.285, 0.312, 26);
  G.gun = new THREE.CylinderGeometry(0.052, 0.058, 0.3, 10).rotateZ(Math.PI / 2);
  G.socket = new THREE.CylinderGeometry(0.036, 0.036, 0.09, 8).rotateZ(Math.PI / 2);
  G.grip = new THREE.BoxGeometry(0.05, 0.16, 0.05);
  G.hose = new THREE.CylinderGeometry(0.013, 0.013, 1, 6).translate(0, 0.5, 0);
  G.bar = new THREE.BoxGeometry(1, 0.05, 0.05).translate(0.5, 0, 0);
  G.cradle = new THREE.BoxGeometry(0.12, 0.07, 0.36);
  G.jwheel = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 10).rotateX(Math.PI / 2);
  G.tbar = new THREE.BoxGeometry(0.05, 0.05, 0.42);
  G.stand = new THREE.BoxGeometry(0.9, 0.5, 0.5);
  return G;
}
const MAT = {};
function mats() {
  if (MAT.rubber) return MAT;
  MAT.rubber = new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.92 });
  MAT.rim = new THREE.MeshStandardMaterial({ color: '#8f949b', roughness: 0.35, metalness: 0.7, side: THREE.DoubleSide });
  MAT.steel = new THREE.MeshStandardMaterial({ color: '#b9bec6', roughness: 0.3, metalness: 0.8 });
  MAT.black = new THREE.MeshStandardMaterial({ color: '#111214', roughness: 0.6 });
  MAT.hose = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.8 });
  for (const k of Object.keys(COMPOUNDS)) MAT['c' + k] = new THREE.MeshStandardMaterial({ color: COMPOUNDS[k].color, roughness: 0.5, side: THREE.DoubleSide });
  return MAT;
}
function makeTyre(front) {
  const g = geos(), m = mats(), w = front ? TYRE_W.F : TYRE_W.R, T = new THREE.Group();
  const body = new THREE.Mesh(g.tyre, m.rubber); body.scale.z = w; T.add(body);
  const rings = [];
  for (const s of [1, -1]) {
    const rim = new THREE.Mesh(g.rim, m.rim); rim.position.z = s * (w / 2 + 0.003); if (s < 0) rim.rotation.y = Math.PI; T.add(rim);
    const ring = new THREE.Mesh(g.ring, m.cSOFT); ring.position.z = s * (w / 2 + 0.005); if (s < 0) ring.rotation.y = Math.PI; T.add(ring); rings.push(ring);
  }
  T.userData.setCompound = (c) => { const mm = m['c' + c] || m.cSOFT; for (const r of rings) r.material = mm; T.userData.compound = c; };
  T.visible = false; return T;
}
function makeGun(team) {
  const g = geos(), m = mats(), Gp = new THREE.Group();
  const body = new THREE.Mesh(g.gun, new THREE.MeshStandardMaterial({ color: team, roughness: 0.4, metalness: 0.4 })); Gp.add(body);
  const sock = new THREE.Mesh(g.socket, m.steel); sock.position.x = 0.19; Gp.add(sock); Gp.userData.sock = sock;
  const grip = new THREE.Mesh(g.grip, m.black); grip.position.set(-0.05, -0.1, 0); Gp.add(grip);
  return Gp;
}
function makeJack(team) {
  const g = geos(), m = mats(), J = new THREE.Group();
  const bar = new THREE.Mesh(g.bar, new THREE.MeshStandardMaterial({ color: team, roughness: 0.45, metalness: 0.3 })); J.add(bar);
  const cradle = new THREE.Mesh(g.cradle, m.black); J.add(cradle);
  const wheels = [new THREE.Mesh(g.jwheel, m.black), new THREE.Mesh(g.jwheel, m.black)]; J.add(...wheels);
  const tbar = new THREE.Mesh(g.tbar, m.black); J.add(tbar);
  J.userData = { bar, cradle, wheels, tbar };
  return J;
}

// ---- one crew ------------------------------------------------------------------------------------------------------
const ROLES = [];
WHEELS.forEach(([a, s], j) => ROLES.push({ r: 'gun', j }, { r: 'off', j }, { r: 'on', j }));
ROLES.push({ r: 'fj' }, { r: 'rj' }, { r: 'stab', s: 1 }, { r: 'stab', s: -1 }, { r: 'wing', s: 1 }, { r: 'wing', s: -1 }, { r: 'chief' });

class Crew {
  constructor(scene, night) {
    this.group = new THREE.Group(); this.group.name = 'pit-crew'; this.group.visible = false; scene.add(this.group);
    const builds = ['broad', 'athletic', 'average'];
    this.men = ROLES.map((ro, n) => { const rig = makePersonRig({ team: '#555b66', build: builds[(n * 7) % 3] }); void night; this.group.add(rig.mesh); return { ...ro, rig, cur: {}, x: 0, z: 0, yaw: 0, ph: Math.random() * 6, ox: 0, oz: 0 }; });
    this.guns = WHEELS.map(() => { const g = makeGun('#333'); this.group.add(g); return g; });
    this.hoses = WHEELS.map(() => { const h = new THREE.Mesh(geos().hose, mats().hose); this.group.add(h); return h; });
    this.oldT = WHEELS.map(([a]) => { const t = makeTyre(a === 'F'); this.group.add(t); return t; });
    this.newT = WHEELS.map(([a]) => { const t = makeTyre(a === 'F'); this.group.add(t); return t; });
    this.stackT = WHEELS.map(([a]) => { const t = makeTyre(a === 'F'); this.group.add(t); return t; });   // (a double stack's first set of old tyres, put down at the garage front)
    this.fjack = makeJack('#333'); this.rjack = makeJack('#333'); this.group.add(this.fjack, this.rjack);
    this.stand = new THREE.Mesh(geos().stand, mats().black); this.group.add(this.stand);
    // the overhead gantry the guns' air lines hang from: two beams over the wheels, booms back to the garage front
    const gm = new THREE.MeshStandardMaterial({ color: '#2a2d33', roughness: 0.6, metalness: 0.4 });
    this.gantry = new THREE.Group();
    for (const s of [1, -1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.12, 0.12), gm); b.position.set(0.15, 3.55, s * 1.0); this.gantry.add(b); }
    const boom = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 4.6), gm); boom.position.set(0.15, 3.62, 1.3); this.gantry.add(boom);
    const boom2 = boom.clone(); boom2.position.x = 2.2; const boom3 = boom.clone(); boom3.position.x = -1.9; this.gantry.add(boom2, boom3);
    this.gantry.userData.mat = gm; this.group.add(this.gantry);
    this.car = null; this.team = null; this.wingOld = null; this.wingNew = null;
  }
  paint(color, color2) {
    for (const m of this.men) m.rig.recolor(color, color2);
    for (const g of this.guns) g.children[0].material.color.set(color2 && color2 !== '#ffffff' ? color2 : color);
    this.fjack.userData.bar.material.color.set(color); this.rjack.userData.bar.material.color.set(color);
  }
  dispose(scene) {
    scene.remove(this.group);
    for (const m of this.men) m.rig.dispose();
    for (const g of this.guns) g.children[0].material.dispose();
    this.fjack.userData.bar.material.dispose(); this.rjack.userData.bar.material.dispose(); this.gantry.userData.mat.dispose();
  }
}

export class PitCrews {
  /** meshes: the cars' CarMeshes (main.js S.meshes) - the crew lifts the car, takes its wheels and wing */
  constructor(scene, n = 3, meshes = null, night = false) {
    warmPersonRigs();
    this.scene = scene; this.meshes = meshes; this.crews = []; for (let k = 0; k < n; k++) this.crews.push(new Crew(scene, night));
    this._v = new THREE.Vector3(); this._v2 = new THREE.Vector3(); this.loose = []; this._prev = new Map();
  }
  dispose() { for (const k of this.crews) { this._free(k); k.dispose(this.scene); } this.crews = []; }

  /** the cars coming into their box, stopped in it, or just gone from it */
  static stops(d) {
    const out = [], P = d.pit; if (!P || d.cancelled) return out;
    for (const c of d.cars) {
      if (c.retired) continue;
      const box = P.boxFor(c.boxIdx ?? c.number + c.id);
      let st = null;
      if (c.manualPit && c.pitLane) {
        if (c.pitLaneState === 'stop') st = 'stop';
        else if (c.pitLaneState === 'in' && (c.pitRequested || c.isPlayer)) { const ahead = box.u - c.pitU; if (ahead > -8) st = { ahead }; }
      } else if (c.inPit) {
        const s = d.pitStates?.get(c); if (!s) continue;
        if (s.phase === 'stop') st = 'stop'; else if (s.phase === 'in') st = { ahead: s.boxU - s.u };
      }
      if (st) out.push({ c, box, stop: st === 'stop', ahead: st === 'stop' ? 0 : st.ahead });
    }
    return out;
  }

  update(d, camera, time, dt) {
    this.frame = (this.frame || 0) + 1;
    if (!d || !this.crews.length) { for (const k of this.crews) k.group.visible = false; return; }
    const cam = camera.position, stops = PitCrews.stops(d);
    // a crew at a car keeps it until it has gone back into the garage; the free ones go to the stops that can be seen
    for (const k of this.crews) {
      if (!k.car) continue;
      const s = stops.find((q) => q.c === k.car);
      if (s) { k.stop = s; stops.splice(stops.indexOf(s), 1); }
      else { k.stop = null; if (k.phase === 'approach') k.phase = 'abort'; }   // (gone past the box / out of the race: back inside)
      // (the team-mate queued behind: this crew's next car - never a second crew at the same box)
      const nx = stops.filter((q) => q.box.i === k.box.i).sort((a, b) => a.ahead - b.ahead)[0];
      k.next = nx || null; for (const q of stops.filter((q) => q.box.i === k.box.i)) stops.splice(stops.indexOf(q), 1);
    }
    const mine = (q) => q.c.isPlayer ? -1e3 : q.ahead;
    for (const s of stops.filter((q) => Math.hypot(q.box.x - cam.x, q.box.z - cam.z) < NEAR).sort((a, b) => mine(a) - mine(b))) {
      if (this.crews.some((q) => q.car && q.box.i === s.box.i)) continue;
      let k = this.crews.find((q) => !q.car);
      // (your own stop always has its crew: one sent to a stop out of sight is called back for it)
      if (!k && s.c.isPlayer) { k = this.crews.filter((q) => q.car).sort((a, b) => Math.hypot(b.box.x - cam.x, b.box.z - cam.z) - Math.hypot(a.box.x - cam.x, a.box.z - cam.z))[0]; if (k) this._free(k); }
      if (!k) break;
      this._assign(k, s, d, time);
    }
    // the cars as the people meet them: where they are, where they were a frame ago, how fast they go
    const cars = [];
    for (const c of d.cars) {
      if (c.cleared || c.hiddenAway) continue;
      const pv = this._prev.get(c), vx = pv && dt > 0 ? (c.x - pv[0]) / dt : 0, vz = pv && dt > 0 ? (c.z - pv[1]) / dt : 0;
      if (Math.hypot(vx, vz) < 60) cars.push({ c, x: c.x, z: c.z, px: pv ? pv[0] : c.x, pz: pv ? pv[1] : c.z, th: c.th, vx, vz });
      this._prev.set(c, [c.x, c.z]);
    }
    for (const k of this.crews) {
      if (!k.car) { k.group.visible = false; continue; }
      k.group.visible = true;
      this._tick(k, d, time, dt);
      if (k.car) this._hits(k, cars, dt);
    }
    this._loose(cars, dt);
  }

  /** a car into one of the crew: knocked down (a ragdoll from the pose they are in), what they held let go; the ones down, moved */
  _hits(k, cars, dt) {
    const near = cars.filter((q) => Math.hypot(q.x - k.F0.ox, q.z - k.F0.oz) < 16);
    for (const m of k.men) {
      if (m.rd) { m.rd.step(dt, near); m.rd.write(); continue; }
      if (!near.length) continue;
      const p = m.rig.mesh.position;
      for (const q of near) {
        const co = Math.cos(q.th), sn = Math.sin(q.th), dx = p.x - q.x, dz = p.z - q.z, lx = dx * co + dz * sn, lz = -dx * sn + dz * co;
        if (Math.abs(lx) > 3.5 || Math.abs(lz) > 1.4 || carTopR(lx, lz, 0.2) <= 0 || Math.hypot(q.vx, q.vz) < 2.5) continue;
        m.rd = new Ragdoll(m.rig); m.rd.start(); this._letGo(k, m, q);
        if (q.c.isPlayer) k.hitBy = q.c;
        break;
      }
    }
  }
  /** what a knocked-down man had in his hands: falling free (a tyre, a wheel gun) */
  _letGo(k, m, q) {
    const add = (o) => { if (!o || !o.visible || this.loose.some((l) => l.o === o)) return; this.loose.push({ k, o, v: new THREE.Vector3(q.vx * 0.6, 1.5, q.vz * 0.6), spin: 6, r: o.userData.setCompound ? 0.36 : 0.08 }); };
    add(m.held);
    if (m.r === 'gun') { add(k.guns[m.j]); k.hoses[m.j].visible = false; }
  }
  _loose(cars, dt) {
    if (dt <= 0) return;
    for (const L of this.loose) {
      const o = L.o, v = L.v; v.y -= 9.81 * dt; o.position.addScaledVector(v, dt);
      if (o.position.y < L.r) { o.position.y = L.r; v.y = Math.abs(v.y) > 1 ? -v.y * 0.3 : 0; const f = Math.max(0, 1 - 4 * dt); v.x *= f; v.z *= f; L.spin *= f; }
      o.rotation.x += L.spin * dt;
      for (const q of cars) {
        const co = Math.cos(q.th), sn = Math.sin(q.th), dx = o.position.x - q.x, dz = o.position.z - q.z, lx = dx * co + dz * sn, lz = -dx * sn + dz * co;
        if (Math.abs(lx) < 3.5 && Math.abs(lz) < 1.4 && o.position.y - L.r < carTopR(lx, lz, L.r) && Math.hypot(q.vx - v.x, q.vz - v.z) > 1) { v.set(q.vx * 1.05, 2 + Math.random(), q.vz * 1.05); L.spin = 10; }
      }
    }
  }

  _assign(k, s, d, time, again = false) {
    const c = s.c, old = again ? k.F : null; k.car = c; k.stop = s; k.box = s.box; k.at = time; k.wingDone = false; k.fitted = [false, false, false, false]; k.next = null; k.D = k.P = k.rep = 0;
    if (k.team !== c.team) { k.team = c.team; k.paint(c.color, c.color2); }
    const P = d.pit, ps = P.samples, i = s.box.i, gx = ps.nx[i] * -P.trackSide, gz = ps.nz[i] * -P.trackSide;
    // the box's frame: along the lane, +w toward the garage
    const th = s.box.th, bz = [-Math.sin(th), Math.cos(th)];
    k.gz = Math.sign(bz[0] * gx + bz[1] * gz) || 1;
    k.F = { ox: s.box.x, oz: s.box.z, th, gz: k.gz };
    // (the gantry is the garage's: it stays in the box's frame, wherever the car stops; body z = w * gz)
    k.F0 = { ...k.F }; this._place(k, k.gantry, 0, 0, 0, 0); k.gantry.scale.set(1, 1, k.gz);
    // out of the garage at a run, always - however late (never put at their places); a double stack: from where they
    // are, the old tyres to the stack at the garage front, a fresh set from it
    k.phase = s.stop ? 'stop' : 'approach'; k.ran = false; k.again = again;
    k.men.forEach((m, n) => {
      if (again) { const [x, z] = this._wF(old, m.u, m.w); [m.u, m.w] = this._inv(k, x, z); m.go = 0; m.fetch = m.r === 'on'; m.dump = m.r === 'off' && k.oldT[m.j].visible; return; }
      m.u = (Math.random() - 0.5) * 8; m.w = 4.4 + Math.random() * 2.2; m.go = 0.15 * (n % 7) + Math.random() * 0.4; m.fetch = m.dump = false; if (n === 0) for (const t of k.stackT) t.visible = false;
      m.cur = {}; m.home = { u: m.u, w: m.w }; m.ox = m.oz = 0;
    });
    const comp = c.pitPlan?.compound || c.ai?.pitPlan?.compound || c.tyres.compound;
    k.newT.forEach((t) => t.userData.setCompound(comp)); if (!again) k.oldT.forEach((t) => t.userData.setCompound(c.tyres.compound));
    k.comp = comp;
    // the spare wing on its stand by the box (a wing change brings it into play)
    const mesh = this.meshes?.get(c);
    k.wingNew = this._wingClone(mesh, k.wingNew, true); k.wingOld = this._wingClone(mesh, k.wingOld, false);
    k.group.add(k.wingNew, k.wingOld); k.wingOld.visible = false;
  }
  /** a front wing like the car's (a clone sharing its geometry), centred on a holder; fresh = undamaged */
  _wingClone(mesh, old, fresh) {
    if (old) { old.parent?.remove(old); }
    const H = new THREE.Group(); if (!mesh) return H;
    const w = mesh.frontWing.clone(true); w.position.copy(mesh.fwHold); w.rotation.set(0, 0, 0); w.visible = true;
    // (the car's detail states - CarMesh: the spare is only ever seen close by, its finest meshes shown, the others not)
    const near = (o) => o.userData.lod === 0;
    w.traverse((o) => { if (o.userData.lod != null) o.visible = near(o); });
    if (fresh) w.traverse((o) => { if (near(o)) o.visible = true; if (o !== w) o.rotation.x = 0; if (o.isMesh && mesh.undented) o.material = mesh.undented(o); });   // (a new wing: none of the car's dents)
    H.add(w); return H;
  }
  /** car meshes back as they were */
  _free(k) {
    const m = k.car && this.meshes?.get(k.car);
    if (m) { for (const w of m.wheels) if (!w.gone) w.hub.visible = true; }
    k.car = null; k.stop = null; k.phase = null; k.next = null; k.group.visible = false; k.hitBy = null;
    for (const t of k.stackT) t.visible = false;
    // (back on their feet for the next stop; what they dropped picked up)
    for (const m of k.men) if (m.rd) { m.rd = null; m.cur = {}; m.held = null; }
    this.loose = this.loose.filter((L) => { if (L.k !== k) return true; L.o.rotation.set(0, 0, 0); L.o.visible = false; return false; });
  }

  // the frame: world from (u along the car, w toward the garage)
  _w(k, u, w) { const F = k.F, c = Math.cos(F.th), s = Math.sin(F.th), z = w * F.gz; return [F.ox + u * c - z * s, F.oz + u * s + z * c]; }
  _wF(F, u, w) { const c = Math.cos(F.th), s = Math.sin(F.th), z = w * F.gz; return [F.ox + u * c - z * s, F.oz + u * s + z * c]; }
  /** (u, w) in the crew's frame of a world point */
  _inv(k, x, z) { const F = k.F, c = Math.cos(F.th), s = Math.sin(F.th), dx = x - F.ox, dz = z - F.oz; return [dx * c + dz * s, (-dx * s + dz * c) * F.gz]; }
  /** the frame changed (the box's to the car's where it really stopped): everyone stays where they stand in the world */
  _reframe(k, F) { const old = k.F; k.F = F; for (const m of k.men) { const [x, z] = this._wF(old, m.u, m.w); [m.u, m.w] = this._inv(k, x, z); } }
  /** a carried thing to (x, y, z): eased there (a tyre is never in one place one frame and another the next); snapped
   *  when it has just been shown */
  _glide(o, x, y, z, yaw, dt, rate = 16) {
    const U = o.userData, fresh = U.frame !== this.frame - 1 && U.frame !== this.frame; U.frame = this.frame;
    if (fresh) { o.position.set(x, y, z); o.rotation.set(0, yaw, 0); return; }
    const f = 1 - Math.exp(-dt * rate); o.position.x += (x - o.position.x) * f; o.position.y += (y - o.position.y) * f; o.position.z += (z - o.position.z) * f;
    let dy = yaw - o.rotation.y; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI; o.rotation.set(0, o.rotation.y + dy * f, 0);
  }
  /** a tyre at (u, w, y) in the frame, eased there */
  _placeT(k, o, u, w, y, dt, rate) { const [x, z] = this._w(k, u, w); o.visible = true; this._glide(o, x, y, z, -k.F.th, dt, rate); }
  _w0(k, u, w) { const F = k.F0 || k.F, c = Math.cos(F.th), s = Math.sin(F.th), z = w * F.gz; return [F.ox + u * c - z * s, F.oz + u * s + z * c]; }
  _yaw(k, du, dw) { const F = k.F, c = Math.cos(F.th), s = Math.sin(F.th), z = dw * F.gz; return Math.atan2(-(du * s + z * c), du * c - z * s); }

  /** where each one stands, facing which way, in what pose - before the car is stopped (t < 0) */
  _station(k, m, t) {
    const j = m.j;
    if (m.r === 'gun' || m.r === 'off' || m.r === 'on') {
      const [a, s] = WHEELS[j], u0 = AXLE[a], hw = HUBW[a] + TYRE_W[a] / 2;
      if (m.r === 'gun') return { u: u0, w: s * (hw + 0.72), fu: 0, fw: -s, pose: POSE.gun };
      const toward = (m.r === 'off') === (a === 'F') ? -1 : 1;   // (off toward the middle of the car, on toward its end)
      return { u: u0 + toward * 0.82, w: s * (hw + 0.62), fu: -toward * 0.5, fw: -s, pose: m.r === 'on' ? POSE.hold : POSE.ready };
    }
    if (m.r === 'fj') return { u: NOSE_X + 1.9, w: 0, fu: -1, fw: 0, pose: POSE.jack };
    if (m.r === 'rj') return { u: REAR_X - 0.9, w: 1.55, fu: 0.3, fw: -1, pose: POSE.jack };   // (waiting at the side until the car is in)
    if (m.r === 'stab') return { u: -0.35, w: m.s * 1.6, fu: 0, fw: -m.s, pose: POSE.ready };   // (back from the car's line while it swings in; in to it once it is stopped)
    if (m.r === 'wing') return { u: NOSE_X + 0.55, w: m.s * 0.78, fu: -1, fw: 0, pose: POSE.wing };
    return { u: NOSE_X + 1.1, w: 2.4, fu: -1, fw: -0.4, pose: POSE.stand };   // (the chief, by the garage, looking up the lane)
  }

  _tick(k, d, time, dt) {
    const c = k.car, mesh = this.meshes?.get(c);
    // ---- where we are in the stop
    let t = -1, D = 2.2, P = 0, rep = 0;
    if (k.stop?.stop) {
      if (k.phase !== 'stop') { k.phase = 'stop'; this._reframe(k, { ox: c.x, oz: c.z, th: c.th, gz: k.gz }); }   // (the car's own frame, where it really stopped)
      D = c._stopDur || 2.2; P = c._stopServe || 0; t = time - (c._stopAt ?? time);
      const plan = c._stopPlan || {}; rep = plan.repair === 'wing' ? 6 : plan.repair === 'full' ? 10 : 0;
      k.D = D; k.P = P; k.rep = rep;
    } else if (k.phase === 'stop' || k.phase === 'after') {
      if (k.phase === 'stop') { k.phase = 'after'; k.left = time; }
      D = k.D; P = k.P; rep = k.rep; t = D + (time - k.left);
    }
    const tw = t - P, work = D - P, tyreWork = Math.max(1.6, work - rep), nominal = Math.min(tyreWork, 2.4), slow = Math.max(0, tyreWork - nominal), q = nominal / 2.1;
    const jackDown = Math.max(work - 0.42, 1.45 * q + slow), released = t >= D;
    k.slow = slow; k.q = q;
    // ---- the car: lifted, its wheels taken off and put on, its wing
    let fl = 0, rl = 0;
    if (t >= 0 && tw > 0) {
      fl = LIFT_F * smooth(0, 0.22 * q, tw) * (1 - smooth(jackDown, jackDown + 0.15, tw));
      rl = LIFT_R * smooth(0.1 * q, 0.32 * q, tw) * (1 - smooth(jackDown, jackDown + 0.15, tw));
    }
    k.fl = fl; k.rl = rl;
    if (mesh && (k.phase === 'stop')) {
      mesh.group.position.y += rl + -AXLE.R * (fl - rl) / (AXLE.F - AXLE.R); mesh.group.rotation.z += Math.atan((fl - rl) / (AXLE.F - AXLE.R));
      mesh.group.updateMatrixWorld(true);
    }
    const yAt = (u) => rl + (u - AXLE.R) * (fl - rl) / (AXLE.F - AXLE.R);
    // per wheel: off at, on at, tight until
    const tl = WHEELS.map((wh, j) => {
      const extra = j === 3 ? slow : 0;
      return { gunOn: 0.1 * q, loose: [0.12 * q, 0.4 * q], off: [0.4 * q, 0.74 * q], on: [0.7 * q, 1.02 * q], tight: [1.02 * q, 1.3 * q + extra], up: 1.33 * q + extra };
    });
    if (mesh && k.phase === 'stop') {
      WHEELS.forEach(([a, s], j) => {
        const mw = mesh.wheels.find((w) => w.front === (a === 'F') && w.side === s * k.gz); if (!mw || mw.gone) return;
        const T = tl[j], off = tw >= T.off[0] && tw < T.on[1];
        mw.hub.visible = !off;
        if (tw >= T.on[1] && !k.fitted[j]) { k.fitted[j] = true; if (j === 0) mesh.setCompound(k.comp); }
      });
    } else if (mesh && k.phase === 'after') for (const w of mesh.wheels) if (!w.gone) w.hub.visible = true;
    // ---- the wing change: old wing off and aside, the spare from its stand, fitted
    const W = rep > 0 && t >= 0;
    const wingOff = W ? smooth(0.25, 1.1, tw) : 0, wingAway = W ? smooth(1.1, 2.4, tw) : 0, wingFetch = W ? smooth(3.0, 4.2, tw) : 0, wingFit = W ? smooth(4.2, Math.min(work - 0.7, 5.6), tw) : 0;
    if (mesh && k.phase === 'stop' && W && wingOff > 0 && !released) mesh.frontWing.visible = false;   // (the spare, fitted, stands in for it until the stop is over)
    {
      const wy = yAt(2.66) + 0.22, standU = NOSE_X + 0.9, standW = 3.0;
      // the old wing: from the car, forward, then away to the garage side and down
      const ou = 2.66 + 0.55 * wingOff + (standU - 0.6 - 2.66 - 0.55) * wingAway, ow = 0 + 2.6 * wingAway, oy = wy + 0.08 * wingOff - (wy - 0.2) * wingAway;
      k.wingOld.visible = W && wingOff > 0;
      this._place(k, k.wingOld, ou, ow - 0.0, oy, 0);
      // the spare: on its stand until fetched, carried in, fitted (and it is the car's again once the stop is over)
      const su = lerp(standU, 2.66 + 0.4, wingFetch) - 0.4 * wingFit, sw = lerp(standW, 0, wingFetch), sy = lerp(0.62, wy + 0.06, wingFetch) - 0.06 * wingFit;
      k.wingNew.visible = !(released && W) && !(W && k.phase === 'after');
      this._place(k, k.wingNew, su, sw, sy, 0);
      this._place(k, k.stand, standU, standW, 0.25, 0);
      if (mesh && released && W) mesh.frontWing.visible = true;
    }
    // ---- the people
    for (const m of k.men) if (!m.rd) this._man(k, m, t, tw, D, P, tl, jackDown, released, dt, time, yAt, { wingOff, wingAway, wingFetch, wingFit, W });
    // ---- the jacks
    this._jacks(k, t, tw, jackDown, released, yAt);
    // ---- done: everyone back inside
    // (the team-mate, queued behind: same crew - once the car before it is well clear of the box, never back into its path)
    if (k.phase === 'after' && k.next && (Math.hypot(c.x - k.F.ox, c.z - k.F.oz) > 9 || t > D + 6)) { const s = k.next; this._assign(k, s, d, time, true); return; }
    if (k.phase === 'after' && t > D + (k.men.some((m) => m.rd) ? 30 : 9)) this._free(k);   // (someone down: the others stay out with them a while)
    if (k.phase === 'abort' && time - (k.abortAt || (k.abortAt = time)) > 6) { k.abortAt = 0; this._free(k); }
  }

  /** an object at (u, w, y) in the frame, turned with the car */
  _place(k, o, u, w, y, yawExtra) { const [x, z] = this._w(k, u, w); o.position.set(x, y, z); o.rotation.set(0, -k.F.th + (yawExtra || 0), 0); if (k.F.gz < 0 && o.userData.flipZ) o.rotation.y += Math.PI; }

  _man(k, m, t, tw, D, P, tl, jackDown, released, dt, time, yAt, wg) {
    const st = this._station(k, m, t), rig = m.rig;
    let tu = st.u, tw_ = st.w, fu = st.fu, fw = st.fw, pose = st.pose, hands = null, holds = null, holdPos = null, speed = RUN;
    const after = t > D ? t - D : -1, j = m.j;
    // ---- out of the garage (before the car), back into it (after)
    if (k.phase === 'approach' && !k.ran) speed = RUN;
    if (after > 2.2 || k.phase === 'abort') { tu = m.home.u * 0.6; tw_ = 5.2 + (m.home.w - 4.4); speed = WALK; pose = POSE.stand; }
    // ---- the wheels
    if (m.r === 'gun' || m.r === 'off' || m.r === 'on') {
      const [a, s] = WHEELS[j], u0 = AXLE[a], hw = HUBW[a] + TYRE_W[a] / 2, T = tl[j], hubY = 0.36 + yAt(u0);
      if (m.r === 'gun') {
        const done = t >= 0 && tw >= T.up && !released, spin = t >= 0 && ((tw >= T.loose[0] && tw < T.loose[1]) || (tw >= T.tight[0] && tw < T.tight[1]));
        if (k.phase === 'approach' && !this._arrived(m)) { holds = k.guns[j]; k.guns[j].visible = true; k.hoses[j].visible = false; pose = POSE.stand; }
        else if (after < 0.4) {
          pose = done ? POSE.gunUp : POSE.gun;
          const gunW = s * (hw + (t >= 0 && tw >= T.gunOn && tw < T.up ? 0.1 : 0.3));
          hands = { u: u0, w: gunW + s * 0.17, y: hubY };
          const gun = k.guns[j]; this._place(k, gun, u0, gunW + s * 0.15, hubY, s > 0 ? Math.PI : 0);
          // (the gun points at the hub: along -w on the garage side)
          gun.rotation.y = this._yaw(k, 0, -s);
          if (spin) gun.userData.sock.rotation.x += dt * 60;
          gun.visible = true;
          const hose = k.hoses[j], [hx, hz] = this._w(k, u0, gunW + s * 0.35), top = this._w0(k, u0, s * 1.0);
          hose.visible = true; hose.position.set(hx, hubY, hz); const dv = this._v.set(top[0] - hx, 3.5 - hubY, top[1] - hz), L = dv.length(); hose.scale.set(1, L, 1); hose.quaternion.setFromUnitVectors(this._v2.set(0, 1, 0), dv.normalize());
        } else { k.guns[j].visible = false; k.hoses[j].visible = false; }
      } else if (m.r === 'off') {
        // the old wheel: pulled straight off the hub, out and down beside him; carried into the garage after
        const oT = k.oldT[j];
        if (m.dump) {
          // (a double stack: the first car's old tyre to the stack at the garage front, put down there, and back)
          holds = oT; pose = POSE.carry; tu = st.u; tw_ = STACK_W; speed = RUN;
          if (Math.hypot(m.u - tu, m.w - tw_) < 0.4) { m.dump = false; const sT = k.stackT[j]; sT.userData.setCompound(oT.userData.compound || k.comp); this._placeT(k, sT, st.u, STACK_W + 0.45 * s, 0.36, dt); sT.position.copy(oT.position); oT.visible = false; oT.userData.setCompound(k.car.tyres.compound); holds = null; }
        } else if (k.stackT[j].visible && k.again) this._placeT(k, k.stackT[j], st.u, STACK_W + 0.45 * s, 0.36, dt, 6);
        if (m.dump) { /* carrying it */ }
        else if (after > 2.2 || (k.phase === 'after' && after < 0)) { holds = oT; pose = POSE.carry; oT.visible = true; }
        else if (t >= 0 && tw >= T.off[0]) {
          const pull = smooth(T.off[0], T.off[0] + 0.12 * k.q, tw), away = smooth(T.off[0] + 0.12 * k.q, T.off[1], tw);
          const pu = lerp(u0, lerp(u0, st.u, 0.55), away), pw = lerp(s * (HUBW[a] + 0.42 * pull), s * (hw + 0.28), away), py = lerp(hubY, 0.36, away);
          this._placeT(k, oT, pu, pw, py, dt);
          if (away < 1) { holds = oT; holdPos = { u: pu, w: pw, y: py }; pose = POSE.hold; }
          else pose = released ? POSE.stand : POSE.ready;
        } else if (!m.dump) {
          oT.visible = false;
          if (t >= 0 && tw > T.loose[0] - 0.1) { pose = POSE.hold; hands = { u: u0 + (st.u - u0) * 0.22, w: s * (hw + 0.04), y: hubY }; }
        }
      } else {
        // the new wheel: held ready, pushed onto the hub, let go
        const nT = k.newT[j], fit = t >= 0 ? smooth(T.on[0], T.on[1], tw) : 0, fitted = t >= 0 && tw >= T.on[1];
        if (m.fetch) {
          // (a double stack: a fresh tyre from the stack at the garage front - it sits there until he has it)
          tu = st.u; tw_ = STACK_W - 0.15 * s; pose = POSE.ready; speed = RUN;
          this._placeT(k, nT, st.u, STACK_W + 0.1 * s, 0.36, dt);
          if (Math.hypot(m.u - tu, m.w - tw_) < 0.4) m.fetch = false;
        } else if (!fitted && !(k.phase === 'after')) {
          const pu = lerp(st.u - (st.u - u0) * 0.25, u0, fit), pw = lerp(st.w - s * 0.35, s * (hw - TYRE_W[a] / 2), fit), py = lerp(0.42, hubY, fit);
          holds = nT; pose = POSE.hold; tu = lerp(st.u, u0 + (st.u - u0) * 0.55, fit);
          // (on the way to his place: carried at the waist; there, held out ready - eased from one to the other)
          if (k.phase === 'approach' && Math.hypot(m.u - st.u, m.w - st.w) > 0.5) pose = POSE.carry;
          else { this._placeT(k, nT, pu, pw, py, dt, fit > 0 ? 30 : 10); holdPos = { u: pu, w: pw, y: py }; }
        } else { nT.visible = false; pose = released ? POSE.stand : POSE.ready; }
      }
    }
    // ---- the jacks' men: their hands on the handles (set by _jacks)
    if (m.r === 'fj') { const J = k.fjI; if (J) { hands = J.handle; pose = J.up > 0.3 ? POSE.jackUp : POSE.jack; tu = J.man.u; tw_ = J.man.w; fu = J.man.fu; fw = J.man.fw; } }
    if (m.r === 'rj') { const J = k.rjI; if (J) { hands = J.handle; pose = J.up > 0.3 ? POSE.jackUp : POSE.jack; tu = J.man.u; tw_ = J.man.w; fu = J.man.fu; fw = J.man.fw; } }
    // ---- holding the car steady; the wing men
    if (m.r === 'stab' && t >= 0 && !released) { pose = POSE.steady; tu = -0.35; tw_ = m.s * 1.18; hands = { u: -0.35, w: m.s * 0.66, y: 0.62 + yAt(-0.35) }; }
    else if (m.r === 'stab' && released && after < 2.2) { tu = -0.35; tw_ = m.s * 1.95; pose = POSE.stand; }   // (a step back: the car leaves on the lane side)
    if (m.r === 'wing' && !(after > 2.2)) {
      if (wg.W && t >= 0 && (wg.wingOff > 0 && wg.wingFit < 1)) {
        // carrying a wing between them (the old one away, then the spare in)
        const carryingOld = wg.wingAway < 1, cw = carryingOld ? k.wingOld : k.wingNew;
        const p = cw.position, wf = carryingOld ? wg.wingAway : wg.wingFetch;
        const cu = carryingOld ? lerp(2.66 + 0.55, NOSE_X + 0.3, wg.wingAway) : lerp(NOSE_X + 0.9, 2.66 + 0.4, wg.wingFetch), cwv = carryingOld ? 2.6 * wg.wingAway : lerp(3.0, 0, wg.wingFetch);
        pose = wf > 0 && wf < 1 ? POSE.wingCarry : POSE.wing; tu = cu + 0.75; tw_ = cwv + m.s * 0.7; fu = -1; fw = 0; hands = { u: cu + 0.25, w: cwv + m.s * 0.62, y: p.y };
        if (!carryingOld && wg.wingFetch <= 0) { tu = NOSE_X + 1.5; tw_ = 3.0 + m.s * 0.6; pose = POSE.ready; hands = null; }
      } else if (t >= 0 && t < D - 0.5) { pose = POSE.wing; hands = { u: NOSE_X - 0.02, w: m.s * 0.82, y: 0.2 + yAt(NOSE_X) }; }
      else if (t >= D - 0.5) { pose = POSE.stand; tu = m.s > 0 ? NOSE_X + 1.3 : NOSE_X + 0.3; tw_ = m.s > 0 ? 2.15 : -2.6; }   // (out of the car's way before it goes: each to his own side, never across its nose)
    }
    if (m.r === 'chief') { pose = t >= D - 0.3 && after < 1 ? POSE.release : POSE.stand; fu = t >= D - 0.3 ? -0.2 : -1; fw = t >= D - 0.3 ? -1 : -0.4; }
    // (a crew out late, the car nearly in: whoever's place is on the lane side waits on the garage side of its path
    //  until it has stopped - never across the front of a car still rolling in)
    if (k.phase === 'approach' && st.w < 0 && m.w > -0.6 && k.stop && !k.stop.stop && k.stop.ahead / Math.max(1, k.car.speed) < 3) { tw_ = Math.max(tw_, 1.7); tu = Math.min(Math.max(tu, REAR_X), NOSE_X); }
    // ---- move toward where they should be (a run or a walk, the legs going with it)
    const du = tu - m.u, dwv = tw_ - m.w, dist = Math.hypot(du, dwv);
    const go = k.phase === 'approach' && !k.ran ? (time - k.at) > (m.go || 0) : true;
    let moving = false;
    if (dist > 0.04 && go) {
      const fast = dist > 0.6, v = Math.min(dist, (fast ? speed : 2.2) * dt);
      m.u += du / dist * v; m.w += dwv / dist * v; moving = fast;
      if (fast) { fu = du; fw = dwv; m.ph += v * (speed === WALK ? 5.2 : 3.4); m.du = du / dist; m.dw = dwv / dist; }
    }
    let target = pose;
    if (moving) { const gk = speed === WALK ? 0.5 : 1; const g2 = gait(m.ph, gk, !(holds || pose === POSE.carry)); target = (holds || pose === POSE.carry) ? { ...g2, ...pick(POSE.carry, ['shL', 'shR', 'elL', 'elR', 'spine']) } : g2; }
    blendPose(m.cur, target, Math.min(1, dt * (moving ? 14 : 10)));
    rig.apply(m.cur);
    // facing
    const want = this._yaw(k, fu, fw); let dy = want - m.yaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI; m.yaw += dy * Math.min(1, dt * 9);
    const [x, z] = this._w(k, m.u, m.w); rig.mesh.position.set(x, 0, z); rig.mesh.rotation.set(0, m.yaw, 0);
    // hands where the work is: the whole body shuffled so that the hands' midpoint is over the target (feet slide a little)
    // (eased: a body that stepped a metre in one frame to put its hands on a tyre is what this was)
    const tgt = holdPos || hands; let ex = 0, ez = 0;
    if (tgt && !moving) {
      rig.mesh.updateMatrixWorld(true);
      const a = rig.b.haL.getWorldPosition(this._v), b = rig.b.haR.getWorldPosition(this._v2), mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
      const [hx, hz] = this._w(k, tgt.u, tgt.w); ex = hx - mx; ez = hz - mz; const e = Math.hypot(ex, ez); if (e > 0.6) { ex *= 0.6 / e; ez *= 0.6 / e; }
    }
    const fo = 1 - Math.exp(-dt * 9); m.ox += (ex - m.ox) * fo; m.oz += (ez - m.oz) * fo;
    rig.mesh.position.x += m.ox; rig.mesh.position.z += m.oz;
    m.held = holds;
    // something carried while walking or running: at the hands
    if (holds && !holdPos) {
      rig.mesh.updateMatrixWorld(true);
      const a = rig.b.haL.getWorldPosition(this._v), b = rig.b.haR.getWorldPosition(this._v2);
      if (holds.isGroup && holds.userData.setCompound) { holds.visible = true; this._glide(holds, (a.x + b.x) / 2, Math.max(0.36, (a.y + b.y) / 2), (a.z + b.z) / 2, m.yaw + Math.PI / 2, dt, 18); }
      else { holds.position.set((a.x + b.x) / 2, Math.max(0.36, (a.y + b.y) / 2), (a.z + b.z) / 2); holds.rotation.set(0, m.yaw + Math.PI / 2, 0); holds.visible = true; }
    }
  }
  _arrived(m) { return m.w < 4.0; }

  /** the front and rear jacks: cradles under the nose and the rear crash structure, handles to their men */
  _jacks(k, t, tw, jackDown, released, yAt) {
    // the front jack: in the car's path (it drives into the cradle), pulled down to lift, swung clear for the release
    const swing = t >= 0 ? smooth(jackDown + 0.1, jackDown + 0.5, tw) : 0, back = t > k.D + 2.2 ? 1 : 0;
    const upF = k.fl / LIFT_F, cu = NOSE_X + 0.04 + swing * 0.9, cw = swing * 1.9;
    const cy = 0.105 + (t >= 0 && k.phase === 'stop' ? yAt(NOSE_X) : 0);
    const hu = cu + 1.45 * Math.cos(swing * 0.9), hw = cw + 1.45 * Math.sin(swing * 0.9), hy = 0.84 - 2.4 * (cy - 0.105);
    const fm = k.men.find((m) => m.r === 'fj'), bm = k.men.find((m) => m.r === 'rj');
    if (k.phase === 'approach' && !this._arrived(fm)) this._drawJack(k, k.fjack, [fm.u + (fm.du || 0) * 1.9, fm.w + (fm.dw ?? -1) * 1.9, 0.12], [fm.u + (fm.du || 0) * 0.45, fm.w + (fm.dw ?? -1) * 0.45, 0.84]);
    else this._drawJack(k, k.fjack, [cu, cw, cy + 0.035], [hu, hw, hy]);
    const away = Math.atan2(hw - cw, hu - cu);
    k.fjI = { handle: { u: hu + 0.04 * Math.cos(away), w: hw + 0.04 * Math.sin(away), y: hy }, up: upF, man: { u: hu + 0.42 * Math.cos(away), w: hw + 0.42 * Math.sin(away), fu: -Math.cos(away), fw: -Math.sin(away) } };
    if (back) { k.fjI.man = { u: 0, w: 5.2, fu: 0, fw: 1 }; k.fjI.handle = null; }
    k.fjack.visible = !(k.phase === 'after' && t > k.D + 2.2) || true;
    // the rear jack: waiting at the side, in behind the car as it stops (the handle low under the rear wing), up, down
    const inn = t >= 0 ? smooth(-0.05, 0.12 * k.q, tw) : 0, outr = released ? smooth(0, 0.4, t - k.D) : 0;
    const upR = k.rl / LIFT_R, ry = 0.2 + (t >= 0 && k.phase === 'stop' ? yAt(REAR_X) : 0);
    const rcu = lerp(REAR_X - 0.75, REAR_X, inn) - outr * 0.6, rcw = lerp(1.25, 0, inn) + outr * 0.0;
    const rhu = rcu - 1.5, rhw = rcw, rhy = 0.8 - 2.4 * (ry - 0.2);
    if (k.phase === 'approach' && !this._arrived(bm)) this._drawJack(k, k.rjack, [bm.u + (bm.du || 0) * 1.9, bm.w + (bm.dw ?? -1) * 1.9, 0.12], [bm.u + (bm.du || 0) * 0.45, bm.w + (bm.dw ?? -1) * 0.45, 0.84]);
    else this._drawJack(k, k.rjack, [rcu, rcw, ry + 0.035], [rhu, rhw, rhy]);
    k.rjI = { handle: { u: rhu - 0.04, w: rhw, y: rhy }, up: upR, man: { u: rhu - 0.42, w: rhw, fu: 1, fw: 0 } };
    if (back) { k.rjI.man = { u: -2, w: 5.2, fu: 0, fw: 1 }; k.rjI.handle = null; }
  }
  _drawJack(k, J, C, H) {
    const U = J.userData, [cx, cz] = this._w(k, C[0], C[1]), [hx, hz] = this._w(k, H[0], H[1]);
    const d = this._v.set(hx - cx, H[2] - C[2], hz - cz), L = d.length();
    U.bar.position.set(cx, C[2], cz); U.bar.scale.set(L, 1, 1); U.bar.quaternion.setFromUnitVectors(this._v2.set(1, 0, 0), d.normalize());
    U.cradle.position.set(cx, C[2] - 0.01, cz); U.cradle.rotation.set(0, Math.atan2(-(hz - cz), hx - cx), 0);
    // (the wheels it rolls on, a third of the way along; the T-handle at the end)
    const wx = cx + (hx - cx) * 0.25, wz = cz + (hz - cz) * 0.25, ang = Math.atan2(-(hz - cz), hx - cx);
    U.wheels.forEach((w, i) => { const s = i ? 1 : -1; w.position.set(wx + Math.sin(ang) * s * 0.0 - Math.sin(-ang) * 0 + (i ? 1 : -1) * Math.sin(ang) * 0.13, 0.06, wz + (i ? 1 : -1) * Math.cos(ang) * 0.13); w.rotation.set(0, ang, 0); });
    U.tbar.position.set(hx, H[2], hz); U.tbar.rotation.set(0, ang, 0);
  }
}
function pick(o, keys) { const r = {}; for (const k of keys) if (o[k]) r[k] = o[k]; return r; }
