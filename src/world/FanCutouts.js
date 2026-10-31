// The crowd's people as cut-outs: one instanced quad each, cut out of an atlas of ten drawn figures (fanAtlas), each
// person coloured in the shader - their own shirt, trousers, skin and hair or hat, from everyday colours (team shirts
// among them, not every one). Thousands of them for the cost of two triangles each: the grandstands' crowds on every
// circuit (world/Grandstands.js) and Austin's banks and plaza (world/Austin.js). The cheering ones bounce (uTime).
import * as THREE from 'three';

/**
 * The fans' atlas: twelve people side by side (48 x 144 px each, the figure's 1.7 m from 16 px down to the bottom), drawn
 * as masks the shader colours per person: red = the shading, green = skin (face, neck, forearms, hands), blue = the top
 * of the head (hair, or a hat); everything else is clothes, coloured by height (the shirt above the waist, the trousers
 * below, the shoes at the bottom). 0 arms down, 1 hands on hips, 2 a fist in the air, 3 both arms up, 4 filming on a
 * phone, 5 long hair, 6 a cap, 7 a Stetson, 8 sitting cross-legged, 9 sitting with the knees up, and 10 / 11 walking, seen
 * from the side facing right: the two frames of a stride (walkerMaterial mirrors them for the ones walking left).
 */
export const CELLS = 12;
export function fanAtlas() {
  const W = 48, H = 144, c = document.createElement('canvas'); c.width = W * CELLS; c.height = H; const x = c.getContext('2d');
  const body = (s) => `rgb(${s},0,0)`, skin = (s) => `rgb(${s},255,0)`, head = (s) => `rgb(${s},0,255)`;
  const R = (f, a, b, w, h) => { x.fillStyle = f; x.fillRect(a, b, w, h); };
  const limb = (f, x0, y0, x1, y1, w) => { x.strokeStyle = f; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); };
  const disc = (f, cx, cy, r, a0 = 0, a1 = Math.PI * 2) => { x.fillStyle = f; x.beginPath(); x.arc(cx, cy, r, a0, a1); x.fill(); };
  for (let v = 0; v < 10; v++) {
    x.save(); x.translate(v * W, 0);
    const sit = v >= 8, dy = sit ? 46 : 0, cx = 24;
    // legs and shoes (standing), or folded in front (sitting)
    if (!sit) { R(body(205), 15, 80, 8, 58); R(body(185), 25, 80, 8, 58); R(body(60), 13, 137, 10, 7); R(body(60), 25, 137, 10, 7); }
    else if (v === 8) { R(body(200), 6, 124, 36, 12); R(body(170), 6, 132, 36, 6); }
    else { limb(body(200), 16, 128, 22, 112, 9); limb(body(185), 32, 128, 26, 112, 9); R(body(60), 12, 134, 10, 6); R(body(60), 27, 134, 10, 6); }
    // torso (a little lighter down its middle)
    x.fillStyle = body(190); x.beginPath(); x.moveTo(14, 36 + dy); x.lineTo(34, 36 + dy); x.lineTo(33, 81 + dy); x.lineTo(15, 81 + dy); x.closePath(); x.fill();
    R(body(225), 19, 38 + dy, 10, 42);
    // arms: a sleeve to the elbow, then the forearm and the hand
    const arm = (sx, ex, ey, hx, hy) => { limb(body(175), sx, 39 + dy, ex, ey, 6); limb(skin(200), ex, ey, hx, hy, 5); disc(skin(210), hx, hy, 3); };
    if (v === 1) { arm(13, 7, 56 + dy, 14, 74 + dy); arm(35, 41, 56 + dy, 34, 74 + dy); }
    else if (v === 2) { arm(13, 10, 58 + dy, 11, 77 + dy); arm(35, 40, 22, 40, 5); }
    else if (v === 3) { arm(13, 7, 22, 10, 4); arm(35, 41, 22, 38, 4); }
    else if (v === 4) { arm(13, 10, 58 + dy, 11, 77 + dy); arm(35, 39, 30, 33, 16); R(body(25), 30, 9, 7, 11); }
    else if (sit) { arm(13, 10, 62 + dy, 16, 76 + dy); arm(35, 38, 62 + dy, 32, 76 + dy); }
    else { arm(13, 10, 58 + dy, 11, 78 + dy); arm(35, 38, 58 + dy, 37, 78 + dy); }
    // neck and head: the face skin, the top of the head the hair or the hat
    R(skin(200), 21, 31 + dy, 6, 6);
    disc(skin(215), cx, 24 + dy, 8);
    if (v === 5) { R(head(200), 15, 20 + dy, 4, 26); R(head(200), 29, 20 + dy, 4, 26); disc(head(210), cx, 22 + dy, 8.6, Math.PI, Math.PI * 2); }
    else if (v === 6) { disc(head(215), cx, 22 + dy, 8.8, Math.PI, Math.PI * 2); R(head(190), 24, 20 + dy, 12, 3); }
    else if (v === 7) { x.fillStyle = head(205); x.beginPath(); x.ellipse(cx, 19 + dy, 15, 3, 0, 0, Math.PI * 2); x.fill(); R(head(220), 17, 9 + dy, 14, 10); }
    else disc(head(205), cx, 21 + dy, 8.4, Math.PI * 1.05, Math.PI * 1.95);
    x.restore();
  }
  // the walkers, in profile (facing right): legs scissored and the arms swinging the other way, then passing
  for (let f = 0; f < 2; f++) {
    x.save(); x.translate((10 + f) * W, 0);
    const legs = f ? [[24, 81, 27, 136], [24, 81, 21, 136]] : [[24, 81, 34, 134], [24, 81, 13, 134]];
    for (const [a, b, c2, d] of legs) { limb(body(f ? 195 : 205), a, b, (a + c2) / 2, (b + d) / 2, 8); limb(body(185), (a + c2) / 2, (b + d) / 2, c2, d, 7); R(body(60), c2 - 3, d - 1, 10, 6); }
    limb(body(165), 22, 40, f ? 22 : 16, f ? 60 : 58, 6); limb(skin(195), f ? 22 : 16, f ? 60 : 58, f ? 23 : 13, f ? 76 : 73, 5);   // (the far arm)
    x.fillStyle = body(190); x.beginPath(); x.moveTo(18, 36); x.lineTo(30, 36); x.lineTo(31, 82); x.lineTo(17, 82); x.closePath(); x.fill();
    R(body(222), 22, 38, 5, 42);
    limb(body(180), 25, 40, f ? 26 : 31, f ? 60 : 57, 6); limb(skin(205), f ? 26 : 31, f ? 60 : 57, f ? 27 : 36, f ? 77 : 72, 5); disc(skin(212), f ? 27 : 36, f ? 77 : 72, 3);   // (the near arm)
    R(skin(200), 21, 31, 6, 6);
    disc(skin(215), 24, 24, 7.6); R(skin(212), 30, 23, 3, 3);   // (the face, the nose)
    disc(head(205), 23, 21, 8.2, Math.PI * 0.95, Math.PI * 2.05); R(head(200), 16, 20, 5, 9);
    x.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; return t;
}

export const FAN_COLOURS = {
  SHIRT: [0xe9e9e6, 0xe9e9e6, 0xe9e9e6, 0x1c1c1e, 0x1c1c1e, 0x1c1c1e, 0x23304a, 0x23304a, 0x8d9096, 0x8d9096, 0x3b3d42, 0x8fb0cf, 0xb8a888, 0x5c6246, 0x6e2a33,
    0xd0702c, 0xd0702c, 0xd0702c, 0xa82a32, 0xa82a32, 0x1f2c5a, 0x3fa596, 0x1f5a4c, 0x2b4f9e, 0xb5551a, 0xb5551a, 0xc98aa2, 0xcdb75a, 0xf2e6d0],
  PANTS: [0x3b4d6b, 0x3b4d6b, 0x2f3c55, 0x52688a, 0x52688a, 0xa89a7a, 0xa89a7a, 0x1f1f22, 0x1f1f22, 0x5a5d63, 0x6b6b4e, 0xcfc7b5],
  SKIN: [0xf0cfb4, 0xe7c0a0, 0xdcae8a, 0xc99572, 0xb07b55, 0x8f5d3e, 0x6b432b, 0x523221],
  HAIR: [0x231811, 0x2e2018, 0x4a3221, 0x6b4a2e, 0x9c7b52, 0xc4a473, 0x141414, 0x7d7a76],
  HAT: [0xd0702c, 0x1c1c1e, 0xe9e9e6, 0xa82a32, 0x23304a, 0x8d9096],
  STETSON: [0xc9a97a, 0xe2d6bc, 0x6e5238, 0x2a2a2a],
};
/** the standing figures, weighted (0-7: 8 and 9 are sitting) */
export const STANDING = [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7];

let ATLAS = null;
/** the cut-outs' material (one per caller: its uTime is its own - userData.shader once compiled) */
export function fanMaterial() {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, map: ATLAS || (ATLAS = fanAtlas()), side: THREE.DoubleSide, alphaTest: 0.45 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = { value: 0 }; mat.userData.shader = sh;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aPhase; attribute float aVar; attribute vec3 aPants; attribute vec3 aSkin; attribute vec3 aHead; uniform float uTime; varying float vYr; varying float vWaist; varying vec3 vPants; varying vec3 vSkin; varying vec3 vHead;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\n vYr = uv.y; vMapUv = vec2((uv.x + aVar) / 12.0, uv.y); vWaist = aVar > 7.5 && aVar < 9.5 ? 0.19 : 0.444; vPants = aPants; vSkin = aSkin; vHead = aHead;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n float cheer = (abs(aVar - 2.5) < 1.0 ? 1.0 : 0.0) * step(0.4, fract(aPhase * 7.13)); transformed.y += 0.16 * cheer * max(0.0, sin(uTime * 5.5 + aPhase));');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vYr; varying float vWaist; varying vec3 vPants; varying vec3 vSkin; varying vec3 vHead;')
      .replace('#include <map_fragment>', `vec4 T = texture2D( map, vMapUv );
        vec3 body = mix( vec3( 0.06 ), vPants, smoothstep( 0.03, 0.05, vYr ) );
        body = mix( body, vColor, smoothstep( vWaist - 0.012, vWaist + 0.012, vYr ) );
        vec3 c = mix( body, vSkin, T.g );
        c = mix( c, vHead, T.b );
        diffuseColor.rgb = c * ( 0.5 + 0.5 * T.r ); diffuseColor.a = T.a;`)
      .replace('#include <color_fragment>', '');
  };
  mat.customProgramCacheKey = () => 'fan-cutouts';
  return mat;
}

/**
 * The people on the move: each walks to and fro along its own stretch of path [A, B] (world positions, the ground's
 * height in them) at its own pace - the cut-out turned to face the camera, in the stride frames (10 / 11) mirrored to
 * the way it is heading, bobbing a little with each step. All of it in the vertex shader: one draw for thousands.
 */
export function walkerMaterial() {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, map: ATLAS || (ATLAS = fanAtlas()), side: THREE.DoubleSide, alphaTest: 0.45 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = { value: 0 }; mat.userData.shader = sh;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 aA; attribute vec3 aB; attribute float aSpd; attribute float aPhase; attribute vec3 aPants; attribute vec3 aSkin; attribute vec3 aHead; uniform float uTime; varying float vYr; varying float vWaist; varying vec3 vPants; varying vec3 vSkin; varying vec3 vHead;')
      .replace('#include <beginnormal_vertex>', 'vec3 toC0 = cameraPosition - aA; toC0.y = 0.0; vec3 objectNormal = normalize(toC0 + vec3(1e-4, 0.0, 0.0));')
      .replace('#include <begin_vertex>', `vec3 transformed = vec3( position );
        vec3 AB = aB - aA; float L = max(0.5, length(AB));
        float w = (uTime * aSpd) / L + aPhase;
        float fw2 = fract(w * 0.5), u = abs(fw2 * 2.0 - 1.0), dirS = fw2 < 0.5 ? 1.0 : -1.0;
        vec3 P = aA + AB * u;
        float stp = uTime * aSpd * 1.6 + aPhase * 17.0;
        P.y += 0.05 * abs(sin(stp * 3.14159));
        vec3 toC = cameraPosition - P; toC.y = 0.0; vec3 fwd = normalize(toC + vec3(1e-4, 0.0, 0.0)); vec3 rgt = vec3(fwd.z, 0.0, -fwd.x);
        float mir = dot(AB * dirS, rgt) < 0.0 ? 1.0 : 0.0;
        float frame = 10.0 + mod(floor(stp), 2.0);
        vYr = uv.y; vMapUv = vec2((mix(uv.x, 1.0 - uv.x, mir) + frame) / 12.0, uv.y); vWaist = 0.444; vPants = aPants; vSkin = aSkin; vHead = aHead;
        vec3 wp = P + rgt * transformed.x + vec3(0.0, transformed.y, 0.0);`)
      .replace('#include <project_vertex>', 'vec4 mvPosition = viewMatrix * vec4( wp, 1.0 ); gl_Position = projectionMatrix * mvPosition;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vYr; varying float vWaist; varying vec3 vPants; varying vec3 vSkin; varying vec3 vHead;')
      .replace('#include <map_fragment>', `vec4 T = texture2D( map, vMapUv );
        vec3 body = mix( vec3( 0.06 ), vPants, smoothstep( 0.03, 0.05, vYr ) );
        body = mix( body, vColor, smoothstep( vWaist - 0.012, vWaist + 0.012, vYr ) );
        vec3 c = mix( body, vSkin, T.g );
        c = mix( c, vHead, T.b );
        diffuseColor.rgb = c * ( 0.5 + 0.5 * T.r ); diffuseColor.a = T.a;`)
      .replace('#include <color_fragment>', '');
  };
  mat.customProgramCacheKey = () => 'fan-walkers';
  return mat;
}

/** one instanced mesh of walkers: list [[ax, ay, az, bx, by, bz, speed], ...] (world positions: put it on the terrain's
 *  own, userData.onTerrain), o.shirts / o.pants: palettes of its own */
export function walkerMesh(list, mat, rnd = Math.random, o = {}) {
  const C = FAN_COLOURS, n = list.length, shirts = o.shirts || C.SHIRT, pants = o.pants || C.PANTS;
  const g = new THREE.PlaneGeometry(0.64, 1.91); g.translate(0, 0.955, 0);
  const im = new THREE.InstancedMesh(g, mat, n), A = new Float32Array(n * 3), B = new Float32Array(n * 3), sp = new Float32Array(n), ph = new Float32Array(n), pa = new Float32Array(n * 3), sk = new Float32Array(n * 3), hd = new Float32Array(n * 3);
  const pick = (a) => _c.setHex(a[(rnd() * a.length) | 0]).offsetHSL(0, (rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.06);
  let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
  list.forEach(([ax, ay, az, bx, by, bz, v], i) => {
    A.set([ax, ay, az], i * 3); B.set([bx, by, bz], i * 3); sp[i] = v; ph[i] = rnd() * 2;
    im.setColorAt(i, pick(shirts)); pick(pants).toArray(pa, i * 3); pick(C.SKIN).toArray(sk, i * 3); pick(C.HAIR).toArray(hd, i * 3);
    x0 = Math.min(x0, ax, bx); x1 = Math.max(x1, ax, bx); y0 = Math.min(y0, ay, by); y1 = Math.max(y1, ay, by); z0 = Math.min(z0, az, bz); z1 = Math.max(z1, az, bz);
  });
  for (const [k, a, sz] of [['aA', A, 3], ['aB', B, 3], ['aSpd', sp, 1], ['aPhase', ph, 1], ['aPants', pa, 3], ['aSkin', sk, 3], ['aHead', hd, 3]]) g.setAttribute(k, new THREE.InstancedBufferAttribute(a, sz));
  im.boundingSphere = new THREE.Sphere(new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), Math.hypot(x1 - x0, y1 - y0, z1 - z0) / 2 + 3);
  im.userData.onTerrain = true; im.frustumCulled = true;
  return im;
}

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _up = new THREE.Vector3(0, 1, 0), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _c = new THREE.Color();
/**
 * One instanced mesh of cut-outs: list [[x, y, z, angle, variant], ...] (the quad faces +z turned by angle), rnd the
 * caller's random (seeded: the same crowd every time); o.shirts: a shirt palette of its own (a grandstand's: more team
 * shirts)
 */
export function fanMesh(list, mat, rnd = Math.random, o = {}) {
  const C = FAN_COLOURS, shirts = o.shirts || C.SHIRT, pants = o.pants || C.PANTS, n = list.length;
  const g = new THREE.PlaneGeometry(0.64, 1.91); g.translate(0, 0.955, 0);
  const im = new THREE.InstancedMesh(g, mat, n), ph = new Float32Array(n), vr = new Float32Array(n), pa = new Float32Array(n * 3), sk = new Float32Array(n * 3), hd = new Float32Array(n * 3);
  const pick = (a) => _c.setHex(a[(rnd() * a.length) | 0]).offsetHSL(0, (rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.06);
  list.forEach(([x, y, z, a, v], i) => {
    const s = 0.9 + rnd() * 0.18; _m.compose(_p.set(x, y, z), _q.setFromAxisAngle(_up, a), _s.set(s, s, 1)); im.setMatrixAt(i, _m);
    im.setColorAt(i, pick(shirts)); pick(pants).toArray(pa, i * 3); pick(C.SKIN).toArray(sk, i * 3);
    (v === 6 ? pick(C.HAT) : v === 7 ? pick(C.STETSON) : pick(C.HAIR)).toArray(hd, i * 3);
    ph[i] = rnd() * 6.283; vr[i] = v;
  });
  g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(ph, 1)); g.setAttribute('aVar', new THREE.InstancedBufferAttribute(vr, 1));
  g.setAttribute('aPants', new THREE.InstancedBufferAttribute(pa, 3)); g.setAttribute('aSkin', new THREE.InstancedBufferAttribute(sk, 3)); g.setAttribute('aHead', new THREE.InstancedBufferAttribute(hd, 3));
  im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.frustumCulled = true;
  return im;
}
