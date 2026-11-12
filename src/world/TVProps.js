// The broadcast's own people (the Team Principal's race - main.js TP): what its cutaways look at when they are not
// looking at a car.
//   - the pit wall's stand: your team's three on their stools at the wall, opposite your garage, their screens before
//     them - calm, on their feet (a result), heads down (a car lost); seen from a camera fixed to the stand itself
//   - a driver walking away from a car that has stopped out on the circuit: over to the barrier and off along it
// The marshals with their flags are the race's own (world/Marshals.js: spot()).
import * as THREE from 'three';
import { makePerson } from './People.js';
import { makePersonRig } from './PersonRig.js';
import { POSE, gait, blendPose } from './CrewRig.js';
import { staff } from '../ui/CineScenes.js';

const MOODS = { calm: ['sitLean', 'sit', 'sitArm'], good: ['cheer', 'cheer', 'cheer'], bad: ['sitLean', 'mourn', 'sit'] };
const WHO = ['race engineer one', 'the-principal', 'strategist'];

export class TVProps {
  /** scene; ground(x, z) -> the ground's height there */
  constructor(scene, ground) { this.scene = scene; this.G = ground || (() => 0); this.wall = null; this.walkers = []; this.t = 0; }

  // ---- the pit wall --------------------------------------------------------------------------------------------------
  /** the stand built at the wall opposite box `boxIdx` (pit: the track's pit lane; team: { name, color, color2 }) */
  buildWall(pit, team, boxIdx = 0) {
    this.dropWall(); if (!pit?.samples || !pit.boxFor) return null;
    const ps = pit.samples, b = pit.boxFor(boxIdx), i = Math.max(0, Math.min(ps.n - 1, b.i)), ts = pit.trackSide;
    const wp = isFinite(pit.wallIn?.[i]) ? pit.wallIn[i] : pit.wallOff ?? pit.halfWidth;   // (the wall's face on the lane's side: world/PitLane.js)
    const off = ts * (wp - 1.0), x = ps.px[i] + ps.nx[i] * off, z = ps.pz[i] + ps.nz[i] * off;
    const g = new THREE.Group(); g.name = 'tv-pitwall'; g.position.set(x, this.G(x, z), z); g.rotation.y = Math.atan2(ps.nx[i] * ts, ps.nz[i] * ts);   // (its own +z: toward the track)
    const own = [], mat = (c, r = 0.6, m = 0.1, e = null) => { const k = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m }); if (e) { k.emissive.set(e); k.emissiveIntensity = 0.9; } own.push(k); return k; };
    const box = (w, h, d, m, px, py, pz) => { const geo = new THREE.BoxGeometry(w, h, d); own.push(geo); const q = new THREE.Mesh(geo, m); q.position.set(px, py, pz); g.add(q); return q; };
    const cyl = (r, h, m, px, py, pz) => { const geo = new THREE.CylinderGeometry(r, r, h, 10); own.push(geo); const q = new THREE.Mesh(geo, m); q.position.set(px, py, pz); g.add(q); return q; };
    const grey = mat('#2b2e35'), steel = mat('#9aa0aa', 0.35, 0.7), col = mat(team.color || '#e10600', 0.5), dark = mat('#0d0e11', 0.5), scr = mat('#0b1a2c', 0.4, 0, '#2f7fd6');
    box(3.3, 0.2, 1.9, grey, 0, 0.1, -0.2);                       // the platform
    box(3.1, 0.06, 0.5, dark, 0, 1.04, 0.42);                     // the desk at the wall
    for (const sx of [-0.95, 0, 0.95]) {
      cyl(0.035, 0.84, steel, sx, 0.62, -0.42); cyl(0.19, 0.06, grey, sx, 1.06, -0.42);   // a stool
      const m = box(0.56, 0.34, 0.04, dark, sx, 1.26, 0.56); m.rotation.x = 0.32; const f = box(0.5, 0.28, 0.01, scr, sx, 1.26, 0.535); f.rotation.x = 0.32;   // its screen, leant back
    }
    for (const [px, pz] of [[-1.6, -1.05], [1.6, -1.05], [-1.6, 0.6], [1.6, 0.6]]) cyl(0.04, 2.55, steel, px, 1.47, pz);
    box(3.5, 0.08, 2.0, col, 0, 2.78, -0.2);                      // the canopy, in the team's colour
    // the three, in each of their moods (built once: only one mood is shown)
    const people = [], sets = {};
    const seat = (who, pose, sx) => {
      let P = null; try { P = makePerson({ jitter: 0.004, ...staff(who, team, pose) }); } catch (e) { return null; }
      this._headset(P, own);   // (while the person still stands at the origin: measured there)
      const standing = !pose.startsWith('sit');   /* (on their feet: cheering, or the one who cannot watch) */ P.group.position.set(sx, standing ? 0.2 : 0.57, standing ? -0.62 : -0.42); P.group.rotation.y = -Math.PI / 2;   // (a person faces +x: turned to the track)
      // (under the canopy, their backs to the light: a little of their own, so a face is a face)
      P.group.traverse((o) => { if (o.isMesh && o.material && o.material.emissive) { o.material = o.material.clone(); own.push(o.material); o.material.emissive.setRGB(0.06, 0.055, 0.05); o.material.emissiveIntensity = 1; } });
      g.add(P.group); people.push(P); return P;
    };
    for (const [mood, poses] of Object.entries(MOODS)) sets[mood] = poses.map((pose, k) => seat(WHO[k], pose, [-0.95, 0, 0.95][k])).filter(Boolean);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.frustumCulled = false; } });
    this.scene.add(g); g.updateMatrixWorld(true);
    this.wall = { g, own, people, sets, mood: null, team };
    this.setMood('calm');
    return this.wall;
  }
  /** a headset on a person: the band over the head, a cup at each ear, the microphone's boom */
  _headset(P, own) {
    // (where the head is: its own group's box, the person still at the origin - hair and all, so the cups sit at its middle)
    if (!P.head) return; P.group.updateMatrixWorld(true); const bx = new THREE.Box3().setFromObject(P.head); if (bx.isEmpty()) return;
    const h = { x: (bx.min.x + bx.max.x) / 2, y: (bx.min.y + bx.max.y) / 2 + 0.115, z: (bx.min.z + bx.max.z) / 2 };
    const m = new THREE.MeshStandardMaterial({ color: '#15171b', roughness: 0.5 }); own.push(m);
    const band = new THREE.TorusGeometry(0.108, 0.011, 6, 14, Math.PI), cup = new THREE.CylinderGeometry(0.043, 0.043, 0.035, 12), boom = new THREE.CylinderGeometry(0.006, 0.006, 0.12, 6); own.push(band, cup, boom);
    const y = h.y - 0.125, k = new THREE.Group(); k.position.set(h.x - 0.01, y, h.z);
    const bd = new THREE.Mesh(band, m); bd.rotation.y = Math.PI / 2; k.add(bd);
    for (const s of [-1, 1]) { const c = new THREE.Mesh(cup, m); c.rotation.x = Math.PI / 2; c.position.set(0, 0, s * 0.108); k.add(c); }
    const bm = new THREE.Mesh(boom, m); bm.rotation.z = Math.PI / 2 - 0.5; bm.position.set(0.055, -0.045, 0.108); k.add(bm);
    P.group.add(k);
  }
  /** 'calm' | 'good' | 'bad' */
  setMood(mood) { const w = this.wall; if (!w) return; w.mood = MOODS[mood] ? mood : 'calm'; for (const [k, L] of Object.entries(w.sets)) for (const P of L) P.group.visible = k === w.mood; }
  /** the stand's own camera, for the mood shown: { pos, look, fov } (world) | null */
  wallView() {
    const w = this.wall; if (!w) return null; const up = w.mood === 'good';
    const bad = w.mood === 'bad';
    const pos = w.g.localToWorld(new THREE.Vector3(0.22, up ? 1.5 : 1.62, 0.78)), look = w.g.localToWorld(new THREE.Vector3(0, up ? 1.72 : bad ? 1.6 : 1.5, -0.5));
    return { pos, look, fov: up ? 66 : bad ? 64 : 60 };
  }
  dropWall() {
    const w = this.wall; if (!w) return; this.wall = null; this.scene.remove(w.g);
    for (const P of w.people) { try { P.dispose(); } catch (e) { /* gone */ } } for (const o of w.own) o.dispose?.();
  }

  // ---- a driver walking away ------------------------------------------------------------------------------------------
  /** the driver of `car` (stopped out on the circuit) climbs out and walks: to the barrier on his side, then along it */
  walker(car, track) {
    if (!car || !track || this.walkers.some((w) => w.car === car)) return null;
    let rig = null; try { rig = makePersonRig({ build: 'athletic', team: car.color || '#555b66', accent: car.color2 || '#ffffff' }); } catch (e) { return null; }
    const q = track.nearest(car.x, car.z, -1, {}), side = Math.sign(q.d) || 1, wall = track.wallAt(q.i, side);
    const at = (s, d) => { const f = track.sample(track.wrapS(s), d); return [f.x, f.z]; };
    const d0 = q.d + side * 1.4, dw = side * Math.max(Math.abs(q.d) + 2.5, wall - 1.3);
    const path = [at(q.s + 1.5, d0), at(q.s + 6, dw), at(q.s + 40, side * Math.max(Math.abs(dw), track.wallAt(track.idxAtS(track.wrapS(q.s + 40)), side) - 1.3))];
    const g = new THREE.Group(); g.name = 'tv-walker'; g.add(rig.mesh); rig.mesh.castShadow = false;
    const [x0, z0] = at(q.s + 0.4, q.d + side * 1.1); g.position.set(x0, this.G(x0, z0), z0); this.scene.add(g);
    const w = { car, rig, g, path, cur: {}, ph: 0, t: 0, speed: 1.55, pos: g.position, side, s: q.s, d: q.d };
    blendPose(w.cur, POSE.stand, 1); rig.apply(w.cur); this.walkers.push(w); return w;
  }
  /** where a camera can stand to watch him go: on the road's side of the car, behind it -> [[x, y, z], ...] to try in turn */
  walkCams(w, track) {
    const out = [], G = this.G;
    for (const [ds, dd, h] of [[-10, -7, 2.4], [14, -6, 2.4], [-16, -3, 3.2], [22, -2, 3.2]]) { const f = track.sample(track.wrapS(w.s + ds), w.d + w.side * dd); out.push(new THREE.Vector3(f.x, G(f.x, f.z) + h, f.z)); }
    return out;
  }

  update(dt) {
    this.t += dt;
    const W = this.wall;
    if (W) {
      // (on their feet: a bounce; on their stools: the small movements of people watching screens)
      (W.sets[W.mood] || []).forEach((P, k) => { const g = P.group; if (W.mood === 'good') { g.position.y = 0.2 + Math.abs(Math.sin(this.t * 6.4 + k * 1.1)) * 0.07; g.rotation.z = Math.sin(this.t * 3.1 + k) * 0.03; } else { g.rotation.z = Math.sin(this.t * 0.9 + k * 2.1) * 0.012; g.rotation.y = -Math.PI / 2 + Math.sin(this.t * 0.5 + k * 1.7) * 0.05; } });
    }
    for (let n = this.walkers.length - 1; n >= 0; n--) {
      const w = this.walkers[n]; w.t += dt;
      if (w.t > 34 || !w.path.length) { if (w.t > 34 || w.t > w.doneAt + 3) { this.scene.remove(w.g); w.rig.dispose(); this.walkers.splice(n, 1); continue; } blendPose(w.cur, POSE.stand, 1 - Math.exp(-dt * 6)); w.rig.apply(w.cur); continue; }
      if (w.t < 1.1) { blendPose(w.cur, POSE.stand, 1); w.rig.apply(w.cur); continue; }   // (a moment by the car first)
      const [tx, tz] = w.path[0], dx = tx - w.g.position.x, dz = tz - w.g.position.z, dist = Math.hypot(dx, dz), st = w.speed * dt;
      if (dist <= st) { w.g.position.x = tx; w.g.position.z = tz; w.path.shift(); if (!w.path.length) w.doneAt = w.t; }
      else { w.g.position.x += dx / dist * st; w.g.position.z += dz / dist * st; w.g.rotation.y = Math.atan2(dx, dz) - Math.PI / 2; }
      w.g.position.y = this.G(w.g.position.x, w.g.position.z);
      w.ph += dt * w.speed * 4.4; blendPose(w.cur, gait(w.ph, 0.5), 1 - Math.exp(-dt * 12)); w.rig.apply(w.cur);
    }
  }
  dispose() { this.dropWall(); for (const w of this.walkers) { this.scene.remove(w.g); w.rig.dispose(); } this.walkers = []; }
}
