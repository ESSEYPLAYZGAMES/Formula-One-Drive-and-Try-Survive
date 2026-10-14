// Flag marshals: when race control neutralises the race, the marshal posts around the incident show it. A yellow at
// the post 190 m before it, a double-waved yellow (faster, both ways) at the post just before it, a green at the post
// after it (the end of the yellow zone); a red at every post near the camera under a red flag; and for 10 s after the
// track goes green again, a green where the incident was. They stand on their post's platform behind the barrier on
// the incident's side, facing the oncoming cars, and each post's light panel on the barrier flashes the same colour
// (as the FIA's do: what a driver actually sees first at night). Also: a blue flag at the next post ahead of you when a
// car is about to lap you (RaceDirector.blueFlags), and the chequered flag, waved from the pit wall at the line from
// the moment the winner crosses it. Only drawn near the camera.
import * as THREE from 'three';
import { makePerson } from './People.js';

const COLORS = { yellow: '#ffd400', green: '#16c45a', red: '#e3141b', blue: '#1f6bff', chequered: '#ffffff' };
const POSTS = [[-190, 'yellow', 1], [-60, 'yellow', 2], [70, 'green', 1]];   // [m from the incident, flag, waves: 1 single, 2 double]
const NEAR = 380, POST_EVERY = 250;

let chequerTex = null;
function chequer() {
  if (chequerTex) return chequerTex;
  const c = document.createElement('canvas'); c.width = 160; c.height = 120; const x = c.getContext('2d');
  for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { x.fillStyle = (i + j) % 2 ? '#111' : '#f4f4f4'; x.fillRect(i * 20, j * 20, 20, 20); }
  chequerTex = new THREE.CanvasTexture(c); chequerTex.colorSpace = THREE.SRGBColorSpace; return chequerTex;
}

/** a marshal on a platform holding a flag on a pole (and, optionally, the post's light panel) */
function marshal(scene, { panel = true, w = 0.85, h = 0.6, map = null, standH = 0.75 } = {}) {
  const p = makePerson({ pose: 'flag', kit: 'marshal', jitter: 0.01 });
  const pivot = new THREE.Group(); pivot.position.copy(p.wrR); p.group.children[0].add(pivot);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.25, 6), new THREE.MeshStandardMaterial({ color: '#c9ccd2', roughness: 0.5 }));
  pole.position.y = 0.42; pivot.add(pole);
  const geo = new THREE.PlaneGeometry(w, h, 10, 4); geo.translate(w / 2, 0, 0);
  const mat = new THREE.MeshStandardMaterial(map ? { map, emissive: '#ffffff', emissiveMap: map, emissiveIntensity: 0.18, roughness: 0.8, side: THREE.DoubleSide } : { color: COLORS.yellow, emissive: COLORS.yellow, emissiveIntensity: 0.22, roughness: 0.8, side: THREE.DoubleSide });
  const cloth = new THREE.Mesh(geo, mat); cloth.rotation.y = Math.PI / 2; cloth.position.y = 1.02 - h / 2; pivot.add(cloth);
  p.group.visible = false; scene.add(p.group);
  const dark = new THREE.MeshStandardMaterial({ color: '#15171c', roughness: 0.6 });
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.9, standH, 0.9), dark); stand.position.y = -standH / 2; p.group.add(stand);   // (the post's platform)
  // the light panel: a dark housing, the lit face toward the cars coming (+x of its group)
  let pg = null, lamp = null;
  if (panel) {
    pg = new THREE.Group(); lamp = new THREE.MeshBasicMaterial({ color: COLORS.yellow });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.5), lamp); face.rotation.y = Math.PI / 2; face.position.x = 0.065;
    pg.add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, 0.95), dark), face); pg.visible = false; scene.add(pg);
  }
  return { p, pivot, cloth, mat, panel: pg, lamp, dark, base: geo.attributes.position.array.slice(), phase: Math.random() * 6, color: null };
}

export class Marshals {
  constructor(scene, track, pit = null) {
    this.scene = scene; this.track = track; this.pit = pit; this.lastS = null; this.side = 1; this.greenUntil = -1;
    this.posts = POSTS.map(() => marshal(scene));
    this.blue = marshal(scene);
    this.line = marshal(scene, { panel: false, w: 1.1, h: 0.8, map: chequer(), standH: 4.6 });   // (on the flag platform above the pit wall's fence) this.line.color = 'chequered';
  }
  dispose() {
    for (const q of [...this.posts, this.blue, this.line]) {
      if (!q) continue;
      this.scene.remove(q.p.group); if (q.panel) { this.scene.remove(q.panel); q.panel.traverse((o) => { if (o.isMesh) o.geometry.dispose(); }); q.lamp.dispose(); }
      q.p.dispose(); q.cloth.geometry.dispose(); q.mat.dispose(); q.dark.dispose(); q.pivot.children[0].geometry.dispose(); q.pivot.children[0].material.dispose();
    }
    this.posts = []; this.blue = this.line = null;
  }

  update(d, camera, time) {
    const sc = d?.sc, ph = sc?.phase, inc = sc?.incident, tr = this.track; if (!this.posts.length) return;
    let mode = null;
    if (ph === 'red') mode = 'red';
    else if (inc && ph && ph !== 'green') mode = 'incident';
    if (mode === 'incident') {
      this.lastS = inc.s; this.greenUntil = time + 10;
      const car = inc.cars && [...inc.cars][0]; if (car) this.side = Math.sign(car.d) || 1;
    } else if (!mode && this.lastS != null && time < this.greenUntil) mode = 'clear';
    const cam = camera.position;
    for (let k = 0; k < this.posts.length; k++) {
      const q = this.posts[k];
      let s = null, flag = null, waves = 1;
      if (mode === 'incident') { s = this.lastS + POSTS[k][0]; flag = POSTS[k][1]; waves = POSTS[k][2]; }
      else if (mode === 'clear' && k === 1) { s = this.lastS; flag = 'green'; }
      else if (mode === 'red') {
        // (the posts nearest the camera: around where it looks from)
        const q0 = tr.nearest(cam.x, cam.z); s = q0.s - 120 + k * 120; flag = 'red'; waves = 2;
      }
      this._show(q, s, this.side, flag, waves, time, k, cam);
    }
    // blue: at the next post ahead of you (at least 40 m on), on your side of the road
    const b = d?.blue, p = d?.player;
    if (b && p) { let s = (Math.floor(p.s / POST_EVERY) + 1) * POST_EVERY; if (s - p.s < 40) s += POST_EVERY; this._show(this.blue, s, p.d >= 0 ? 1 : -1, 'blue', 2, time, 7, cam); }
    else this._show(this.blue, null);
    // the chequered flag: on the pit wall at the line, once the winner has crossed it, until the session is over
    if (d && d.mode === 'race' && d.leaderFinished && !d.done && !d.cancelled) {
      const side = this.pit?.sideSign || 1;
      this._show(this.line, 0, side, 'chequered', 3, time, 9, cam, { lift: 3.85, inset: -0.2 });
    } else this._show(this.line, null);
  }

  /** a marshal at arc length s (null: hidden) behind the barrier on that side, showing flag */
  _show(q, s, side, flag, waves, time, k, cam, o = {}) {
    const P = q.p.group, tr = this.track;
    if (s == null) { P.visible = false; if (q.panel) q.panel.visible = false; return; }
    s = tr.wrapS(s);
    const i = tr.idxAtS(s), wall = tr.wallAt(i, side), f = tr.sample(s, side * (wall + 1.1 + (o.inset || 0))), c = tr.sample(s, 0), w = tr.sample(s, side * (wall - 0.05));
    if (Math.hypot(f.x - cam.x, f.z - cam.z) > NEAR) { P.visible = false; if (q.panel) q.panel.visible = false; return; }
    P.visible = true; P.position.set(f.x, 0.75 + (o.lift || 0), f.z);   // (on the post's platform: head and flag above the barrier)
    // facing the cars coming: toward the road and back up it
    let fx = (c.x - f.x), fz = (c.z - f.z); const l = Math.hypot(fx, fz) || 1; fx = fx / l * 0.55 - c.tx * 0.85; fz = fz / l * 0.55 - c.tz * 0.85;
    P.rotation.y = Math.atan2(-fz, fx);
    if (q.color !== flag && flag !== 'chequered') { q.color = flag; q.mat.color.set(COLORS[flag]); q.mat.emissive.set(COLORS[flag]); }
    // the light panel on the barrier top, facing back up the road; flashing
    if (q.panel) {
      q.panel.visible = true; q.panel.position.set(w.x, 1.55, w.z); q.panel.rotation.y = Math.atan2(c.tz, -c.tx);
      const on = (time * 2.2 + k * 0.3) % 1 < 0.6; q.lamp.color.set(on ? COLORS[flag] : '#111214');
    }
    // waving: side to side across the body (a double wave: faster and wider; the chequered flag in big sweeps), the
    // cloth rippling
    const rate = waves === 3 ? 5.2 : waves === 2 ? 7.5 : 4.2, amp = waves === 3 ? 1.05 : waves === 2 ? 0.85 : 0.6;
    q.pivot.rotation.x = Math.sin(time * rate + q.phase) * amp;
    const a = q.cloth.geometry.attributes.position, b = q.base;
    for (let j = 0; j < a.count; j++) { const x = b[j * 3]; a.array[j * 3 + 2] = b[j * 3 + 2] + Math.sin(x * 7 - time * 13 + q.phase) * 0.07 * x; }
    a.needsUpdate = true;
  }
}
