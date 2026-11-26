// What lives in Hell (ui/Afterlife.js): the things that watch you, the rats, and what is left of the damned.
//   stalker()  - a figure too tall and too thin: a black body on long legs, arms hanging past its knees with long
//                fingers, a neck too long, and a pale mask of a face - hollow eyes weeping dark, a slit of a mouth, a long
//                nose - under a nest of black tendrils. It does not walk while you look at it. Its head turns to follow
//                you, all the way round if it has to; it twitches. Look away and it comes closer.
//   rats()     - packs of rats running over the rock (one instanced mesh for the bodies, one for the tails), scattering
//                from you, squealing; burst(at, n) pours a pack out of a point (the exorcism: out of the body).
//   gore(sc)   - the dressing: pools of blood, the bodies hanging on chains from the dark, swinging, dripping; bones.
// All of it is drawn plainly (low-poly, dark, lit by the lava) - the dark and the sound do most of it.
import * as THREE from 'three';

const R = (a, b) => a + Math.random() * (b - a);

/** the mask: a pale face on the front of a sphere's texture (u = 0.25 is the front), the rest black */
function maskTex() {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256; const g = cv.getContext('2d');
  g.fillStyle = '#050304'; g.fillRect(0, 0, 512, 256);
  const cx = 128;
  // (the face: a waxy pale oval, grimed at the edges)
  const fg = g.createRadialGradient(cx, 120, 10, cx, 125, 86); fg.addColorStop(0, '#e4d2b8'); fg.addColorStop(0.65, '#c9ae8e'); fg.addColorStop(0.9, '#6d5642'); fg.addColorStop(1, 'rgba(5,3,4,0)');
  g.fillStyle = fg; g.beginPath(); g.ellipse(cx, 125, 70, 108, 0, 0, Math.PI * 2); g.fill();
  // (the sockets: deep, black, weeping down the cheeks)
  for (const sx of [-24, 24]) {
    const sg = g.createRadialGradient(cx + sx, 100, 2, cx + sx, 102, 22); sg.addColorStop(0, '#000'); sg.addColorStop(0.55, '#120806'); sg.addColorStop(1, 'rgba(60,30,20,0)');
    g.fillStyle = sg; g.beginPath(); g.ellipse(cx + sx, 102, 20, 14, sx > 0 ? -0.25 : 0.25, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#000'; g.beginPath(); g.ellipse(cx + sx, 102, 8, 5, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(40,4,2,.85)'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + sx + R(-3, 3), 110); g.bezierCurveTo(cx + sx + R(-6, 6), 140, cx + sx + R(-8, 8), 160, cx + sx + R(-6, 6), 196); g.stroke();
  }
  // (the mouth: a thin dark slit, a little open, wet)
  g.fillStyle = '#1a0503'; g.beginPath(); g.moveTo(cx - 26, 178); g.quadraticCurveTo(cx, 186, cx + 26, 176); g.quadraticCurveTo(cx, 194, cx - 26, 178); g.fill();
  g.strokeStyle = 'rgba(90,10,6,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 4, 190); g.lineTo(cx - 6, 228); g.stroke();
  // (grime, spatter)
  for (let k = 0; k < 160; k++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? '40,10,6' : '20,14,10'},${R(0.1, 0.5).toFixed(2)})`; const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 90; g.fillRect(cx + Math.cos(a) * r * 0.75, 125 + Math.sin(a) * r * 1.1, R(1, 3), R(1, 3)); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

let MASK = null;
/**
 * A stalker. -> { G, head, update(dt, t, eye (Vector3: the camera), seen (bool)), d (distance, after update) }
 * G sits on the ground at its feet; its front is +z.
 */
export function stalker(o = {}) {
  MASK = MASK || maskTex();
  const H = o.h || R(4.4, 5.4), k = H / 3.8;
  const skin = new THREE.MeshStandardMaterial({ color: 0x0a0607, roughness: 0.9, emissive: 0x2a0303, emissiveIntensity: 0.55 });   // (a dull red sheen off the lava: a silhouette you can just make out)
  const G = new THREE.Group(), body = new THREE.Group(); G.add(body); body.scale.setScalar(k);
  const cyl = (r0, r1, L, x, y, z, rx = 0, rz = 0) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, L, 7), skin); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); body.add(m); return m; };
  // (legs, a torso like a stretched ribcage, the shoulders hunched up and forward, the long neck)
  for (const s of [-1, 1]) cyl(0.055, 0.03, 1.95, s * 0.13, 0.98, 0, 0, s * 0.03);
  cyl(0.11, 0.17, 0.5, 0, 2.15, 0); const tor = cyl(0.19, 0.12, 1.2, 0, 2.85, 0.02, -0.08); tor.scale.z = 0.65;
  cyl(0.06, 0.06, 0.62, 0, 3.45, 0.05, 0, Math.PI / 2);
  const neck = cyl(0.035, 0.05, 0.55, 0, 3.72, 0.12, 0.35);
  // (arms hanging to the knees and past, the fingers long)
  const arms = [];
  for (const s of [-1, 1]) {
    const A = new THREE.Group(); A.position.set(s * 0.31, 3.42, 0.05); body.add(A);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 1.15, 6), skin); up.position.y = -0.575; A.add(up);
    const lo = new THREE.Group(); lo.position.y = -1.15; lo.rotation.x = -0.12; A.add(lo);
    const fo = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.018, 1.1, 6), skin); fo.position.y = -0.55; lo.add(fo);
    for (let f = 0; f < 4; f++) { const fi = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.004, R(0.32, 0.46), 4), skin); fi.position.set((f - 1.5) * 0.022, -1.28, 0.01); fi.rotation.x = R(-0.15, 0.25); fi.rotation.z = (f - 1.5) * 0.08; lo.add(fi); }
    A.rotation.z = s * 0.05; arms.push({ A, lo, s, ph: Math.random() * 6 });
  }
  // (the head: the mask, a long nose, the tendrils)
  const head = new THREE.Group(); head.position.set(0, 4.05, 0.2); body.add(head);
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), new THREE.MeshStandardMaterial({ map: MASK, roughness: 0.55, emissive: 0xffffff, emissiveMap: MASK, emissiveIntensity: 0.55, fog: false }));
  face.scale.set(0.82, 1.38, 0.78); head.add(face);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0xcdb293, roughness: 0.6, emissive: 0x6a5a48, emissiveIntensity: 0.5, fog: false })); nose.rotation.x = Math.PI / 2; nose.position.set(0, -0.02, 0.2); head.add(nose);
  const hair = new THREE.MeshStandardMaterial({ color: 0x020102, roughness: 0.9 }), tend = [];
  for (let i = 0; i < 13; i++) {
    const a = (i / 13) * Math.PI * 2, p0 = new THREE.Vector3(Math.cos(a) * 0.09, 0.2, Math.sin(a) * 0.07 - 0.02), out = R(0.18, 0.42);
    const pts = [p0, new THREE.Vector3(Math.cos(a) * out, R(0.1, 0.35), Math.sin(a) * out * 0.8 - 0.06), new THREE.Vector3(Math.cos(a) * out * R(1, 1.5), R(-0.25, 0.15), Math.sin(a) * out - 0.1), new THREE.Vector3(Math.cos(a) * out * R(0.8, 1.6), R(-0.7, -0.2), Math.sin(a) * out * 0.6 - 0.15)];
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, R(0.008, 0.016), 4), hair); head.add(m); tend.push({ m, ph: Math.random() * 6 });
  }
  const twitch = { t: R(1, 4), on: 0, rz: 0, rx: 0 };
  const W = new THREE.Vector3(), tgt = new THREE.Vector3(), Q = new THREE.Quaternion(), Q0 = new THREE.Quaternion();
  const me = { G, head, d: 99, H, frozen: false, onTwitch: null,
    /** each frame: the head on you; the body turning slowly to you; a twitch now and then; the arms swaying */
    update(dt, t, eye) {
      G.getWorldPosition(W); me.d = Math.hypot(eye.x - W.x, eye.z - W.z);
      const want = Math.atan2(eye.x - W.x, eye.z - W.z); let dA = want - G.rotation.y; dA = Math.atan2(Math.sin(dA), Math.cos(dA)); G.rotation.y += dA * Math.min(1, dt * (me.frozen ? 0.2 : 0.8));
      // (the head: straight at your eyes - all the way round if it must)
      head.getWorldPosition(tgt); Q0.copy(head.quaternion); head.lookAt(eye); Q.copy(head.quaternion); head.quaternion.copy(Q0).slerp(Q, Math.min(1, dt * 5));
      twitch.t -= dt; if (twitch.t <= 0) { twitch.on = R(0.12, 0.3); twitch.rz = R(-0.8, 0.8); twitch.rx = R(-0.4, 0.4); twitch.t = R(1.5, 6); me.onTwitch?.(me); }
      if (twitch.on > 0) { twitch.on -= dt; head.rotateZ(twitch.rz); head.rotateX(twitch.rx); }
      for (const a of arms) { a.A.rotation.x = Math.sin(t * 0.7 + a.ph) * 0.06 + (me.reach || 0) * -1.1; a.lo.rotation.x = -0.12 - (me.reach || 0) * 0.5; }
      for (const x of tend) { x.m.rotation.z = Math.sin(t * 1.3 + x.ph) * 0.08; x.m.rotation.x = Math.sin(t * 0.9 + x.ph * 2) * 0.06; }
      body.position.y = Math.sin(t * 0.5 + arms[0].ph) * 0.03;
    },
    dispose() { G.traverse((m) => { m.geometry?.dispose?.(); }); skin.dispose(); hair.dispose(); face.material.dispose(); nose.material.dispose(); },
  };
  return me;
}

/** the rats: packs over the rock. -> { mesh, update(dt, t, me (Vector3: your spirit)), burst(at, n), near (the closest pack's distance) } */
export function rats(n = 150, o = {}) {
  const bodyG = new THREE.SphereGeometry(1, 8, 6), tailG = new THREE.CylinderGeometry(0.008, 0.002, 1, 4); tailG.translate(0, -0.5, 0); tailG.rotateX(Math.PI / 2);
  const mat = new THREE.MeshStandardMaterial({ color: 0x2a1d16, roughness: 0.85 }), tmat = new THREE.MeshStandardMaterial({ color: 0x5a3a34, roughness: 0.7 });
  const B = new THREE.InstancedMesh(bodyG, mat, n), T = new THREE.InstancedMesh(tailG, tmat, n); B.frustumCulled = T.frustumCulled = false;
  const G = new THREE.Group(); G.add(B, T);
  const P = o.packs || 7, packs = Array.from({ length: P }, () => { const a = Math.random() * Math.PI * 2, r = R(8, o.r || 55); return { x: Math.cos(a) * r, z: Math.sin(a) * r, h: Math.random() * 6, v: R(2.4, 4), turn: 0 }; });
  const rat = Array.from({ length: n }, (_, i) => ({ p: i % P, ox: R(-1.4, 1.4), oz: R(-2.2, 2.2), ph: Math.random() * 6, s: R(0.75, 1.25), x: 0, z: 0, h: 0, burst: null }));
  const M = new THREE.Matrix4(), M2 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let near = 99;
  const me = { mesh: G, get near() { return near; },
    update(dt, t, you) {
      near = 99; const R0 = o.r || 60;
      for (const k of packs) {
        k.turn += (Math.random() - 0.5) * dt * 3; k.turn *= 0.98; k.h += k.turn * dt * 2;
        const dx = k.x - you.x, dz = k.z - you.z, d = Math.hypot(dx, dz); near = Math.min(near, d);
        if (d < 7) { const away = Math.atan2(dx, dz); let dA = away - k.h; dA = Math.atan2(Math.sin(dA), Math.cos(dA)); k.h += dA * Math.min(1, dt * 6); k.fast = 1.8; } else k.fast = Math.max(1, (k.fast || 1) - dt);
        if (Math.hypot(k.x, k.z) > R0) { const back = Math.atan2(-k.x, -k.z); let dA = back - k.h; dA = Math.atan2(Math.sin(dA), Math.cos(dA)); k.h += dA * Math.min(1, dt * 2); }
        k.x += Math.sin(k.h) * k.v * k.fast * dt; k.z += Math.cos(k.h) * k.v * k.fast * dt;
      }
      rat.forEach((r, i) => {
        if (r.burst) {
          // (poured out of a point: running outward, then into a pack)
          const b = r.burst; b.t += dt; r.x += Math.sin(b.h) * b.v * dt; r.z += Math.cos(b.h) * b.v * dt; r.h = b.h + Math.sin(t * 20 + r.ph) * 0.3;
          if (b.t > b.T) { r.burst = null; const k = packs[r.p]; r.ox = r.x - k.x; r.oz = r.z - k.z; }
        } else {
          const k = packs[r.p], c = Math.cos(k.h), s = Math.sin(k.h);
          r.ox *= 1 - Math.min(1, dt * 0.3); r.oz += (Math.sin(t * 0.5 + r.ph) * 2 - r.oz) * Math.min(1, dt * 0.3);
          const tx = k.x + r.ox * c + r.oz * s, tz = k.z - r.ox * s + r.oz * c;
          r.x += (tx - r.x) * Math.min(1, dt * 3); r.z += (tz - r.z) * Math.min(1, dt * 3); r.h = k.h + Math.sin(t * 14 + r.ph) * 0.25;
        }
        const y = 0.06 + Math.abs(Math.sin(t * 22 + r.ph)) * 0.03 + (o.y || 0);
        q.setFromEuler(e.set(0, r.h, 0)); M.compose(v.set(r.x, y, r.z), q, sc.set(0.075 * r.s, 0.06 * r.s, 0.17 * r.s)); B.setMatrixAt(i, M);
        M2.compose(v.set(r.x - Math.sin(r.h) * 0.15 * r.s, y - 0.02, r.z - Math.cos(r.h) * 0.15 * r.s), q.setFromEuler(e.set(0, r.h + Math.sin(t * 9 + r.ph) * 0.5, 0)), sc.set(r.s, r.s, 0.3 * r.s)); T.setMatrixAt(i, M2);
      });
      B.instanceMatrix.needsUpdate = true; T.instanceMatrix.needsUpdate = true;
    },
    /** a pack poured out of a point (at: Vector3) - n of them, the nearest-numbered taken */
    burst(at, cnt = 24) {
      const off = (me._b = ((me._b || 0) + cnt) % n);
      for (let j = 0; j < cnt; j++) { const r = rat[(off + j) % n]; r.x = at.x + R(-0.2, 0.2); r.z = at.z + R(-0.2, 0.2); r.burst = { h: Math.random() * Math.PI * 2, v: R(3, 7), t: 0, T: R(1, 2.2) }; }
    },
    dispose() { bodyG.dispose(); tailG.dispose(); mat.dispose(); tmat.dispose(); B.dispose(); T.dispose(); },
  };
  for (const r of rat) { const k = packs[r.p]; r.x = k.x + r.ox; r.z = k.z + r.oz; }
  return me;
}

/** Hell's dressing: blood, the hanging dead, bones. avoid(x, z) -> true to keep a spot clear. -> { update(dt, t), drips } */
export function gore(sc, avoid = () => false, o = {}) {
  const items = [], blood = new THREE.MeshStandardMaterial({ color: 0x3a0202, roughness: 0.12, metalness: 0.25, emissive: 0x1a0000, emissiveIntensity: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
  const spot = (r0, r1) => { for (let k = 0; k < 20; k++) { const a = Math.random() * Math.PI * 2, r = R(r0, r1), x = Math.cos(a) * r, z = Math.sin(a) * r; if (!avoid(x, z)) return [x, z]; } return null; };
  // (pools and smears of blood)
  for (let i = 0; i < (o.pools || 34); i++) { const s = spot(3, 62); if (!s) continue; const m = new THREE.Mesh(new THREE.CircleGeometry(R(0.5, 2.4), 18), blood); m.rotation.x = -Math.PI / 2; m.rotation.z = Math.random() * 6; m.scale.set(1, R(0.4, 1), 1); m.position.set(s[0], 0.03, s[1]); sc.add(m); }
  // (the hanging: a chain from the dark, a hook, a body wrapped and dark with blood, swinging; dripping)
  const chain = new THREE.MeshStandardMaterial({ color: 0x241a16, metalness: 0.8, roughness: 0.4 }), flesh = new THREE.MeshStandardMaterial({ color: 0x3d0f0a, roughness: 0.6, emissive: 0x120000, emissiveIntensity: 0.4 });
  const dropsN = (o.hang || 12) * 6, dpos = new Float32Array(dropsN * 3), dvel = new Float32Array(dropsN), dsrc = [];
  for (let i = 0; i < (o.hang || 12); i++) {
    const s = spot(6, 55); if (!s) continue;
    const top = new THREE.Group(); top.position.set(s[0], 24, s[1]); sc.add(top);
    const L = R(17, 20.5), ch = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, L, 5), chain); ch.position.y = -L / 2; top.add(ch);
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(R(0.24, 0.32), R(1.1, 1.5), 4, 8), flesh); b.position.y = -L - 0.9; b.rotation.z = R(-0.15, 0.15); top.add(b);
    // (an arm hanging loose from some of them)
    if (Math.random() < 0.6) { const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.7, 3, 6), flesh); a.position.set(R(-0.25, 0.25), -L - 1.7, 0.1); a.rotation.z = R(-0.3, 0.3); top.add(a); }
    const ph = Math.random() * 6, amp = R(0.04, 0.1); items.push((t) => { top.rotation.z = Math.sin(t * 0.6 + ph) * amp; top.rotation.x = Math.sin(t * 0.45 + ph * 2) * amp * 0.6; });
    const pool = new THREE.Mesh(new THREE.CircleGeometry(R(0.8, 1.6), 18), blood); pool.rotation.x = -Math.PI / 2; pool.position.set(s[0], 0.035, s[1]); sc.add(pool);
    dsrc.push([s[0], 24 - L - 1.8, s[1]]);
  }
  for (let i = 0; i < dropsN; i++) { const s = dsrc[i % Math.max(1, dsrc.length)] || [0, 3, 0]; dpos.set([s[0], Math.random() * s[1], s[2]], i * 3); dvel[i] = R(4, 7); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  const drops = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x6a0404, size: 0.09, transparent: true, opacity: 0.9 })); sc.add(drops);
  // (bones: skulls and long bones, in heaps here and there)
  const bone = new THREE.MeshStandardMaterial({ color: 0xbfb39a, roughness: 0.8 });
  for (let h = 0; h < (o.heaps || 9); h++) {
    const s = spot(5, 58); if (!s) continue;
    for (let j = 0; j < 7; j++) {
      const x = s[0] + R(-1.2, 1.2), z = s[1] + R(-1.2, 1.2);
      if (j % 3 === 0) { const sk = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), bone); sk.scale.set(1, 0.92, 1.15); sk.position.set(x, 0.12, z); sk.rotation.set(R(-0.6, 0.6), Math.random() * 6, R(-0.4, 0.4)); sc.add(sk);
        for (const ex of [-0.045, 0.045]) { const ey = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), new THREE.MeshBasicMaterial({ color: 0x000000 })); ey.position.set(ex, 0.02, 0.11); sk.add(ey); } }
      else { const bn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, R(0.4, 0.8), 5), bone); bn.position.set(x, 0.04, z); bn.rotation.set(Math.PI / 2 + R(-0.3, 0.3), Math.random() * 6, 0); sc.add(bn); }
    }
  }
  return {
    update(dt, t) {
      for (const f of items) f(t);
      for (let i = 0; i < dropsN; i++) { dpos[i * 3 + 1] -= dvel[i] * dt; if (dpos[i * 3 + 1] < 0.05) { const s = dsrc[i % Math.max(1, dsrc.length)]; if (s) dpos[i * 3 + 1] = s[1]; } }
      dg.attributes.position.needsUpdate = true;
    },
  };
}

/**
 * The thing inside (the exorcism's reveal): a stalker's head on its own - the pale mask, the long nose, the tendrils -
 * to burst out of a doll's face. -> { G, tend, dispose }
 */
export function monsterHead() {
  MASK = MASK || maskTex();
  const G = new THREE.Group(), mats = [];
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), new THREE.MeshStandardMaterial({ map: MASK, roughness: 0.5, emissive: 0xffffff, emissiveMap: MASK, emissiveIntensity: 0.7, fog: false })); face.scale.set(0.82, 1.38, 0.78); G.add(face); mats.push(face.material);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0xcdb293, emissive: 0x6a5a48, emissiveIntensity: 0.6, fog: false })); nose.rotation.x = Math.PI / 2; nose.position.set(0, -0.02, 0.2); G.add(nose); mats.push(nose.material);
  const hair = new THREE.MeshStandardMaterial({ color: 0x020102, roughness: 0.9 }), tend = []; mats.push(hair);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, out = R(0.2, 0.5);
    const pts = [new THREE.Vector3(Math.cos(a) * 0.09, 0.18, Math.sin(a) * 0.07 - 0.02), new THREE.Vector3(Math.cos(a) * out, R(0.1, 0.4), Math.sin(a) * out * 0.8), new THREE.Vector3(Math.cos(a) * out * R(1, 1.6), R(-0.3, 0.2), Math.sin(a) * out), new THREE.Vector3(Math.cos(a) * out * R(0.8, 1.8), R(-0.8, -0.2), Math.sin(a) * out * 0.7)];
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, R(0.008, 0.016), 4), hair); G.add(m); tend.push({ m, ph: Math.random() * 6 });
  }
  return { G, tend, dispose() { G.traverse((m) => m.geometry?.dispose?.()); for (const x of mats) x.dispose(); } };
}

/** a doll's porcelain face (u = 0.25 the front): painted - rosy cheeks, glass-bright eyes, a small red mouth; possessed:
 *  cracked through, black weeping from the eyes and the mouth */
function dollFace(possessed) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256; const g = cv.getContext('2d'), cx = 128;
  g.fillStyle = '#3a2418'; g.fillRect(0, 0, 512, 256);   // (the painted hair, all round)
  const fg = g.createRadialGradient(cx, 140, 10, cx, 140, 92); fg.addColorStop(0, possessed ? '#efe6dc' : '#f6ece2'); fg.addColorStop(0.8, possessed ? '#d8cbbd' : '#ecdccc'); fg.addColorStop(1, 'rgba(236,220,204,0)');
  g.fillStyle = fg; g.beginPath(); g.ellipse(cx, 142, 80, 96, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#3a2418'; g.beginPath(); g.ellipse(cx, 52, 92, 44, 0, 0, Math.PI * 2); g.fill();   // (the fringe)
  for (const sx of [-34, 34]) { const ch = g.createRadialGradient(cx + sx, 168, 2, cx + sx, 168, 26); ch.addColorStop(0, possessed ? 'rgba(120,10,10,.55)' : 'rgba(230,90,90,.5)'); ch.addColorStop(1, 'rgba(230,90,90,0)'); g.fillStyle = ch; g.fillRect(cx + sx - 30, 138, 60, 60); }
  g.fillStyle = possessed ? '#2a0000' : '#b8202a'; g.beginPath(); g.ellipse(cx, 196, 12, 6, 0, 0, Math.PI * 2); g.fill();
  if (possessed) {
    g.strokeStyle = 'rgba(30,6,4,.9)'; g.lineWidth = 2;
    for (let k = 0; k < 7; k++) { let x = cx + R(-60, 60), y = R(70, 220); g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 6; s++) { x += R(-16, 16); y += R(-16, 16); g.lineTo(x, y); } g.stroke(); }
    g.strokeStyle = 'rgba(10,0,0,.95)'; g.lineWidth = 4;
    for (const sx of [-30, 30]) { g.beginPath(); g.moveTo(cx + sx, 140); g.bezierCurveTo(cx + sx + R(-5, 5), 170, cx + sx + R(-8, 8), 200, cx + sx + R(-6, 6), 240); g.stroke(); }
    g.beginPath(); g.moveTo(cx, 200); g.lineTo(cx + R(-4, 4), 250); g.stroke();
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
/** the number on the doll's chest */
function numTex(num, col) {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 128; const g = cv.getContext('2d');
  g.font = '900 78px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(String(num ?? ''), 64, 70);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/**
 * A doll of the driver you would become: a ball-jointed porcelain thing in their racing suit (the team's colours, their
 * number on its chest), hanging from a marionette's strings. Every joint its own, so it can be shaken apart.
 * -> { G, J (the joints), possess(), idle(t, dt), rattle(v, t, dt, hard), crumple(u), snap(), strings(on), headTop, dispose }
 * G's origin is between its feet; its front is +z.
 */
export function doll(c = {}) {
  const mats = [], M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
  const suit = M({ color: c.color || '#ff8000', roughness: 0.55 }), trim = M({ color: c.color2 || '#ffffff', roughness: 0.5 }), skin = M({ color: 0xf0e4d6, roughness: 0.3, metalness: 0.05 }), boot = M({ color: 0x111111, roughness: 0.6 });
  const G = new THREE.Group(), J = {};
  const ball = (r, mat) => new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat);
  const seg = (r0, r1, L, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, L, 8), mat); m.position.y = -L / 2; return m; };
  const pelvis = new THREE.Group(); pelvis.position.y = 0.78; G.add(pelvis); J.pelvis = pelvis;
  pelvis.add(Object.assign(ball(0.11, suit), { scale: new THREE.Vector3(1.25, 0.8, 0.9) }));
  // (the torso and its chest: the suit, a stripe, the number)
  const torso = new THREE.Group(); torso.position.y = 0.05; pelvis.add(torso); J.torso = torso;
  const tb = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.3, 4, 10), suit); tb.position.y = 0.24; tb.scale.z = 0.75; torso.add(tb);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.245, 0.04, 0.19), trim); stripe.position.y = 0.2; torso.add(stripe);
  const nm = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.13), M({ map: numTex(c.number, c.color2 || '#ffffff'), transparent: true, roughness: 0.6 })); nm.position.set(0, 0.32, 0.095); torso.add(nm);
  // (the head on its neck)
  const neck = new THREE.Group(); neck.position.y = 0.52; torso.add(neck); J.neck = neck; neck.add(Object.assign(ball(0.04, skin), {}));
  const head = new THREE.Group(); head.position.y = 0.13; neck.add(head); J.head = head;
  const faceA = dollFace(false), faceB = dollFace(true); const fm = M({ map: faceA, roughness: 0.25, metalness: 0.05 });
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), fm); hd.scale.set(0.92, 1.06, 0.95); head.add(hd);
  const eyeM = M({ color: 0x3a2a1a, roughness: 0.05, metalness: 0.3 }), eyes = [-0.042, 0.042].map((x) => { const e = ball(0.019, eyeM); e.position.set(x, 0.0, 0.105); head.add(e); return e; });
  const jaw = new THREE.Mesh(new THREE.CircleGeometry(0.03, 14), M({ color: 0x050000 })); jaw.position.set(0, -0.058, 0.112); jaw.scale.set(0.6, 0.05, 1); head.add(jaw);
  // (arms: shoulder, elbow, a hand - ball joints showing)
  const limb = (side, y, x, L1, L2, r, mat, foot) => {
    const A = new THREE.Group(); A.position.set(side * x, y, 0); (foot ? pelvis : torso).add(A);
    A.add(ball(r * 1.25, foot ? suit : skin)); A.add(seg(r, r * 0.85, L1, mat));
    const B = new THREE.Group(); B.position.y = -L1; A.add(B); B.add(ball(r * 1.1, skin)); B.add(seg(r * 0.85, r * 0.7, L2, mat));
    const E = foot ? new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.16), boot) : ball(r * 1.15, skin); E.position.set(0, -L2 - (foot ? 0.02 : 0.01), foot ? 0.04 : 0); B.add(E);
    return { A, B, E };
  };
  J.armL = limb(-1, 0.42, 0.17, 0.26, 0.24, 0.035, suit, false); J.armR = limb(1, 0.42, 0.17, 0.26, 0.24, 0.035, suit, false);
  J.legL = limb(-1, -0.02, 0.075, 0.37, 0.36, 0.05, suit, true); J.legR = limb(1, -0.02, 0.075, 0.37, 0.36, 0.05, suit, true);
  for (const a of [J.armL, J.armR]) a.A.rotation.z = (a === J.armL ? -1 : 1) * 0.12;
  // (the marionette's cross and its strings: head, hands, knees)
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.03, 0.03), M({ color: 0x3a2618, roughness: 0.8 })); bar.position.y = 2.45; G.add(bar);
  const bar2 = bar.clone(); bar2.rotation.y = Math.PI / 2; bar2.scale.x = 0.6; G.add(bar2);
  const ends = [[0, 2.45, 0], [-0.3, 2.45, 0], [0.3, 2.45, 0], [-0.18, 2.45, 0], [0.18, 2.45, 0]], at = [head, J.armL.E, J.armR.E, J.legL.B, J.legR.B];
  const sp = new Float32Array(30), sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const lines = new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0xd8d0c0, transparent: true, opacity: 0.55 })); lines.frustumCulled = false; G.add(lines); mats.push(lines.material);
  const W = new THREE.Vector3(), j = () => Math.random() - 0.5;
  const sm = new Map();   // (each joint's shaking, smoothed)
  const shake = (o, k, amp, dt) => { let s = sm.get(o); if (!s) sm.set(o, s = { x: 0, y: 0, z: 0, bx: o.rotation.x, by: o.rotation.y, bz: o.rotation.z }); const f = Math.min(1, dt * 30);
    s.x += (j() * amp * k.x - s.x) * f; s.y += (j() * amp * k.y - s.y) * f; s.z += (j() * amp * k.z - s.z) * f; o.rotation.set(s.bx + s.x, s.by + s.y, s.bz + s.z); };
  let cut = false;
  const me = { G, J, head, headTop: head, eyes, jaw, possessed: false,
    /** the strings drawn from the cross to where they are tied (until cut) */
    strings() { if (cut) return; G.updateMatrixWorld(true); at.forEach((o, i) => { o.getWorldPosition(W); G.worldToLocal(W); sp.set(ends[i], i * 6); sp.set([W.x, W.y + (i === 0 ? 0.12 : 0), W.z], i * 6 + 3); }); sg.attributes.position.needsUpdate = true; },
    /** it is not theirs any more: the face cracked and weeping, the eyes black and lit from inside */
    possess() { if (me.possessed) return; me.possessed = true; fm.map = faceB; fm.needsUpdate = true; eyeM.color.set(0x000000); eyeM.emissive = new THREE.Color(0x6a0000); eyeM.emissiveIntensity = 1.2; },
    /** hanging, waiting: a slow sway, the head down, a twitch now and then */
    idle(t, dt, ph = 0) { pelvis.rotation.z = Math.sin(t * 0.6 + ph) * 0.03; head.rotation.x = 0.55 + Math.sin(t * 0.4 + ph) * 0.05; neck.rotation.z = 0;
      for (const a of [J.armL, J.armR]) { a.A.rotation.x = Math.sin(t * 0.7 + ph) * 0.05; a.B.rotation.x = -0.15; } for (const l of [J.legL, J.legR]) { l.A.rotation.x = 0.05; l.B.rotation.x = 0.1; }
      if (Math.random() < dt * 0.25) head.rotation.z = j() * 1.2; else head.rotation.z *= 1 - Math.min(1, dt * 2); me.strings(); },
    /** shaken - v how hard (0..1+): every joint jerking at once, the head thrown about, the jaw dropping */
    rattle(v, t, dt) {
      const a = 0.35 + v * 1.6;
      shake(head, { x: 1.4, y: 2.2, z: 1.6 }, a, dt); shake(neck, { x: 0.6, y: 0.5, z: 0.8 }, a, dt); shake(torso, { x: 0.5, y: 0.6, z: 0.5 }, a, dt); shake(pelvis, { x: 0.3, y: 0.4, z: 0.3 }, a, dt);
      for (const L of [J.armL, J.armR, J.legL, J.legR]) { shake(L.A, { x: 2, y: 0.8, z: 1.2 }, a, dt); shake(L.B, { x: 1.6, y: 0.3, z: 0.4 }, a, dt); }
      jaw.scale.y = Math.min(1.4, 0.05 + v * (0.6 + Math.random() * 0.8)); me.strings();
    },
    /** fallen off its strings, crumpled on the ground (u 0..1 how far down) - a twitch left in it */
    crumple(u, t) {
      cut = true; lines.visible = false;
      G.position.y = THREE.MathUtils.lerp(G.position.y, -0.4, Math.min(1, u)); G.rotation.x = THREE.MathUtils.lerp(G.rotation.x, 1.35, Math.min(1, u));
      head.rotation.set(0.2, 0.9, 0.5 + (Math.random() < 0.02 ? j() * 0.6 : 0)); J.armL.A.rotation.set(-1.2, 0, -0.9); J.armR.A.rotation.set(-0.4, 0, 1.3); J.legL.A.rotation.set(0.3, 0, -0.3); J.legR.A.rotation.set(-0.2, 0, 0.5); J.legR.B.rotation.x = 1.2;
      jaw.scale.y = 0.5;
    },
    reset() { cut = false; lines.visible = true; G.rotation.set(0, 0, 0); for (const [o, s] of sm) o.rotation.set(s.bx, s.by, s.bz); sm.clear(); jaw.scale.y = 0.05; },
    dispose() { G.traverse((m) => m.geometry?.dispose?.()); for (const x of mats) { x.map?.dispose?.(); x.dispose(); } faceA.dispose(); faceB.dispose(); },
  };
  me.strings();
  return me;
}
