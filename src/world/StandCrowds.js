// Every grandstand in shot, in full 3D, for the cutscenes (the build-up, the news, the finales): the stands near the
// camera have every place filled with a person (world/Crowd.js's instanced templates - team shirts and caps, flags,
// phones, arms up and jumping) and their flat sheet fans hidden; the stands further off keep the sheets until the camera
// comes closer. Each stand is built the first time it is needed (one a tick, so a cut to a new place never stalls) and
// kept for the session. A stand is drawn whole in the light distant bodies (one mesh a body shape for the stand), and
// the 16 m stretches of it near the camera in full detail instead. setActive(false) hands every stand back to its
// sheets (out of a cutscene, or in a scene that wants the stands empty).
import * as THREE from 'three';
import { Crowd, crowdMaterial } from './Crowd.js';

const ON = 150, OFF = 175, NEAR = 30;   // m: a stand comes alive within ON of the camera, goes back to sheets beyond OFF; stretches in full detail within NEAR
const CASUAL = ['#f2f2ef', '#1b1d22', '#2d4a6b', '#9fb6c9', '#d9c7a3', '#b04a4a', '#6d7f5a', '#e9e3d6', '#3a3f48', '#f0c9c9', '#ffd400', '#ff8000'];
const LEGS = ['#22252b', '#2d3a55', '#3b4a66', '#a89a7a', '#1a1a1a', '#5b5f66', '#e8e4da'];
const pick = (a) => a[(Math.random() * a.length) | 0];
const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
// (a person taken out of the picture and put back: counted, the stretch's switch to full detail and a camera among them can overlap)
const hideP = (e) => { if (e.hid++ === 0) { e.mesh.setMatrixAt(e.i, ZERO); e.mesh.instanceMatrix.needsUpdate = true; } };
const showP = (e) => { if (e.hid > 0 && --e.hid === 0) { e.mesh.instanceMatrix.array.set(e.m0, e.i * 16); e.mesh.instanceMatrix.needsUpdate = true; } };

export class StandCrowds {
  /** o: { scene, stands (world/Grandstands.js), night, teams: [team colours] } */
  constructor(o) {
    Object.assign(this, o);
    this.group = new THREE.Group(); this.group.name = 'stand-crowds'; this.scene.add(this.group);
    this.built = new Map(); this.active = false; this._t = 0; this._far = new Map(); this._moved = new Set(); this._last = new THREE.Vector3(1e9, 0, 0);
  }
  _distTo(p, cam) {
    // to the stand's front edge (its middle, and either end)
    let best = Infinity; for (const f of [-0.5, 0, 0.5]) { const [x, z] = p.world(f * p.len, 0); best = Math.min(best, Math.hypot(x - cam.x, z - cam.z)); }
    return best;
  }
  _farSpec(s) { let f = this._far.get(s); if (!f) { f = { ...s, far: true }; this._far.set(s, f); } return f; }
  /** one stand's people: the whole stand in distant bodies, each stretch of it in full detail */
  _build(p) {
    const g = new THREE.Group(), chunks = [], byChunk = new Map(), far = new Crowd({ night: this.night });
    for (const f of this.stands.seats(p)) { const k = Math.floor((f.lx + p.len / 2) / 16); if (!byChunk.has(k)) byChunk.set(k, []); byChunk.get(k).push(f); }
    for (const seats of byChunk.values()) {
      const near = new Crowd({ night: this.night }), n0 = far.list.length;
      let cx = 0, cz = 0;
      for (const f of seats) {
        const front = f.tier < 3, spec = near.spec(front ? 'fanF' : 'fanB', front ? 16 : 12), team = Math.random() < 0.55, c = team ? pick(this.teams) : pick(CASUAL);
        const col = { top: c, team: team ? c : pick(this.teams), acc: team ? '#ffffff' : pick(CASUAL), legs: pick(LEGS) };
        const x = f.x + (Math.random() - 0.5) * 0.08, z = f.z + (Math.random() - 0.5) * 0.08, rot = f.ang - Math.PI / 2 + (Math.random() - 0.5) * 0.45, sc = 0.93 + Math.random() * 0.1, jump = spec.pose === 'cheer' && Math.random() < 0.75 ? 0.6 + Math.random() * 0.6 : 0;
        near.add(spec, x, z, rot, col, sc, f.y, jump); far.add(this._farSpec(spec), x, z, rot, col, sc, f.y, jump);
        cx += f.x; cz += f.z;
      }
      const gN = new THREE.Group(); near.build(gN); gN.visible = false; g.add(gN);
      chunks.push({ gN, n: false, x: cx / seats.length, z: cz / seats.length, near: near.list, far: null, f0: n0, f1: far.list.length });
    }
    far.build(g);
    for (const C of chunks) C.far = far.list.slice(C.f0, C.f1);
    for (const C of chunks) for (const e of C.near.concat(C.far)) { e.hid = 0; e.m0 = e.mesh.instanceMatrix.array.slice(e.i * 16, e.i * 16 + 16); }
    g.visible = false; this.group.add(g);
    const S = { p, g, chunks, on: false, undo: null };
    this.built.set(p, S); return S;
  }
  /** in a cutscene (true) or not (false: every stand back to its sheets) */
  setActive(v) {
    if (v === this.active) return; this.active = v; this._t = 0;
    if (v) crowdMaterial().userData.lift.value = this.night ? 0.2 : 0;   // (the night lift is the shared material's)
    else for (const S of this.built.values()) this._off(S);
  }
  _on(S) { if (S.on) return; S.on = true; S.g.visible = true; S.undo = this.stands.hide((q) => q === S.p); }
  _off(S) { if (!S.on) return; S.on = false; S.g.visible = false; S.undo?.(); S.undo = null; }
  _near(C, n) { if (n === C.n) return; C.n = n; C.gN.visible = n; for (const e of C.far) (n ? hideP : showP)(e); }
  /** every frame of a cutscene, with where the camera is */
  update(cam, dt = 1 / 30) {
    if (!this.active || !this.stands?.stands) return;
    this._t -= dt;
    if (this._t <= 0 || cam.distanceToSquared(this._last) > 400) {   // (4 times a second, and at once on a cut)
      this._t = 0.25; this._last.copy(cam);
      let builds = 0;
      for (const p of this.stands.stands) {
        const d = this._distTo(p, cam); let S = this.built.get(p);
        if (d < ON) {
          if (!S) { if (builds++ >= 1) continue; S = this._build(p); }
          this._on(S);
          for (const C of S.chunks) this._near(C, Math.hypot(C.x - cam.x, C.z - cam.z) < NEAR);
        } else if (S && d > OFF) this._off(S);
      }
    }
    this._clearAt(cam);
  }
  /** a camera among the crowd (a phone filming from the stand, a shot from the steps): nobody where it stands */
  _clearAt(cam) {
    const keep = new Set();
    for (const S of this.built.values()) {
      if (!S.on) continue;
      for (const C of S.chunks) {
        if (Math.hypot(C.x - cam.x, C.z - cam.z) > 14) continue;
        for (const e of C.near) if (Math.hypot(e.x - cam.x, e.z - cam.z) < 1.1 && cam.y > e.y - 0.3 && cam.y < e.y + 2.6) keep.add(e);
      }
    }
    for (const e of this._moved) if (!keep.has(e)) showP(e);
    for (const e of keep) if (!this._moved.has(e)) hideP(e);
    this._moved = keep;
  }
  dispose() {
    this.setActive(false);
    this.scene.remove(this.group);
    this.group.traverse((o) => { if (o.isInstancedMesh) o.geometry.dispose(); });   // (the template material is shared: kept)
    this.built.clear();
  }
}
