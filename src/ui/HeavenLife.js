// What makes Heaven Heaven (ui/Afterlife.js): the light and the life of it, round the marble way.
//   God's light slanting down in great soft rays, a low warm sun; meadows of flowers on banks of cloud along the way;
//   trees in white and pink blossom, their petals drifting down; doves wheeling overhead; a still lake shining with the
//   sky; a rainbow standing over the gates and a radiance beyond them.
// heavenDecor(sc, { frozen }) -> { update(t, dt) }. frozen: the false Heaven (the way into Hell) - all of it there, and
// all of it stopped: the doves held mid-wingbeat, the petals hanging in the air, the light not moving.
import * as THREE from 'three';

const R = (a, b) => a + Math.random() * (b - a);
const keep = (x, z) => Math.abs(x) < 3.6 || z > 12 || z < -100;   // (off the way itself)

/** a soft round glow (sprites: blossom, sun, radiance) */
function glowTex(inner, outer = 'rgba(255,255,255,0)', size = 128) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size; const g = cv.getContext('2d'), h = size / 2;
  const gr = g.createRadialGradient(h, h, 0, h, h, h); gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
/** a five-petalled flower, white (tinted per flower) */
function flowerTex() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d');
  g.fillStyle = '#fff'; for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; g.beginPath(); g.ellipse(32 + Math.cos(a) * 13, 32 + Math.sin(a) * 13, 12, 8, a, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#ffd860'; g.beginPath(); g.arc(32, 32, 7, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function heavenDecor(sc, o = {}) {
  const frozen = !!o.frozen, upd = [];
  // GOD'S LIGHT: tall soft rays slanting down through the air, and the sun low and warm behind them
  const rayMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { t: { value: 0 } },
    vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform float t; varying vec2 vU; void main(){ float edge = sin(vU.x * 3.14159); float a = pow(edge, 3.0) * smoothstep(0.0, 0.5, vU.y) * (0.75 + 0.25 * sin(t * 0.4 + vU.x * 20.0)); gl_FragColor = vec4(1.0, 0.93, 0.72, a * 0.16); }' });
  for (let k = 0; k < 9; k++) {
    const ray = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 9 + Math.random() * 6, 140, 24, 1, true), rayMat);
    ray.position.set(R(-50, 50), 40, R(-130, 0)); ray.rotation.set(0.35 + R(-0.08, 0.08), 0, -0.4 + R(-0.1, 0.1)); sc.add(ray);
  }
  upd.push((t) => { rayMat.uniforms.t.value = t; });
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,244,210,1)', 'rgba(255,200,120,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  sun.position.set(-120, 90, -320); sun.scale.setScalar(160); sc.add(sun);
  // the radiance beyond the gates, and the rainbow standing over them
  const beyond = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,255,240,1)', 'rgba(255,230,170,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.95 }));
  beyond.position.set(0, 7, -112); beyond.scale.set(46, 34, 1); sc.add(beyond);
  const bow = new THREE.Mesh(new THREE.TorusGeometry(44, 2.2, 8, 120, Math.PI), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
    vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying vec2 vU; vec3 h(float x){ return clamp(abs(fract(x + vec3(0.0, 0.666, 0.333)) * 6.0 - 3.0) - 1.0, 0.0, 1.0); } void main(){ float v = vU.y; float a = sin(v * 3.14159) * 0.32 * smoothstep(0.0, 0.08, vU.x) * smoothstep(1.0, 0.92, vU.x); gl_FragColor = vec4(h(v * 0.8), a); }' }));
  bow.position.set(0, -2, -150); sc.add(bow);
  // MEADOWS on banks of cloud, along both sides of the way: thousands of flowers - white, blush, gold, lilac
  const bank = new THREE.MeshStandardMaterial({ map: glowTex('rgba(255,255,255,1)', 'rgba(255,252,244,0)', 256), transparent: true, depthWrite: false, roughness: 1, emissive: 0xfff6e6, emissiveIntensity: 0.35 });
  for (let k = 0; k < 22; k++) { const side = k % 2 ? 1 : -1, m = new THREE.Mesh(new THREE.CircleGeometry(1, 32), bank); m.rotation.x = -Math.PI / 2; m.position.set(side * R(9, 20), -0.32, 8 - k * 4.6 - R(0, 3)); m.scale.set(R(9, 15), R(7, 11), 1); sc.add(m); }
  const fg = new THREE.PlaneGeometry(0.34, 0.34); fg.translate(0, 0.17, 0); const fg2 = fg.clone(); fg2.rotateY(Math.PI / 2);
  const FN = 1600, fmat = new THREE.MeshStandardMaterial({ map: flowerTex(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.8, emissive: 0xffffff, emissiveIntensity: 0.25 });
  const pal = [0xffffff, 0xffe0ec, 0xfff0b0, 0xe6dcff, 0xffd6e6, 0xffffff];
  for (const geo of [fg, fg2]) {
    const F = new THREE.InstancedMesh(geo, fmat, FN), M = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
    for (let i = 0; i < FN; i++) { let x, z; do { x = (Math.random() < 0.5 ? -1 : 1) * R(4.2, 26); z = R(-98, 10); } while (keep(x, z));
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * 6); M.compose(p.set(x, -0.3, z), q, s.setScalar(R(0.7, 1.5))); F.setMatrixAt(i, M); F.setColorAt(i, c.setHex(pal[i % pal.length])); }
    sc.add(F);
  }
  // TREES in blossom along the way, petals coming down off them
  const bark = new THREE.MeshStandardMaterial({ color: 0xf2e6cf, roughness: 0.7, emissive: 0x6a5a40, emissiveIntensity: 0.2 });
  const bloom = [glowTex('rgba(255,236,244,1)', 'rgba(255,214,232,0)'), glowTex('rgba(255,255,255,1)', 'rgba(255,248,236,0)')];
  const trees = [];
  for (let k = 0; k < 12; k++) {
    const side = k % 2 ? 1 : -1, x = side * R(8.5, 13), z = -2 - k * 7.6, T = new THREE.Group(); T.position.set(x, -0.3, z);
    const lean = R(-0.4, 0.4), pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(lean * 0.4, 2.2, 0.2), new THREE.Vector3(lean, 4.2, -0.2), new THREE.Vector3(lean * 1.4, 5.6, 0)];
    T.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.22, 7), bark));
    for (let b = 0; b < 46; b++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: bloom[b % 2], transparent: true, depthWrite: false, opacity: 0.92 })); const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * 3;
      s.position.set(lean * 1.3 + Math.cos(a) * r, 5.4 + R(-1.2, 1.4), Math.sin(a) * r); s.scale.setScalar(R(1.4, 2.4)); T.add(s); }
    sc.add(T); trees.push(T);
  }
  const PN = 700, pp = new Float32Array(PN * 3), pv = new Float32Array(PN * 3);
  for (let i = 0; i < PN; i++) { const T = trees[i % trees.length]; pp.set([T.position.x + R(-4, 4), R(0, 7), T.position.z + R(-4, 4)], i * 3); pv.set([R(0.2, 0.7), R(-0.9, -0.4), R(-0.2, 0.2)], i * 3); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  sc.add(new THREE.Points(pg, new THREE.PointsMaterial({ map: bloom[0], size: 0.22, transparent: true, depthWrite: false, color: 0xffe6ef })));
  if (!frozen) upd.push((t, dt) => { for (let i = 0; i < PN; i++) { const k = i * 3; pp[k] += (pv[k] + Math.sin(t * 1.3 + i) * 0.4) * dt; pp[k + 1] += pv[k + 1] * dt; pp[k + 2] += (pv[k + 2] + Math.cos(t * 1.1 + i) * 0.3) * dt;
    if (pp[k + 1] < -0.3) { const T = trees[i % trees.length]; pp[k] = T.position.x + R(-3, 3); pp[k + 1] = R(5, 7); pp[k + 2] = T.position.z + R(-3, 3); } } pg.attributes.position.needsUpdate = true; });
  // DOVES wheeling overhead
  const dove = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, emissive: 0xffffff, emissiveIntensity: 0.35, side: THREE.DoubleSide });
  for (let k = 0; k < 16; k++) {
    const D = new THREE.Group(), body = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), dove); body.scale.set(0.8, 0.8, 2); D.add(body);
    const wings = [-1, 1].map((s) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.3), dove); w.geometry.translate(s * 0.35, 0, 0); D.add(w); return { w, s }; });
    D.scale.setScalar(1.6); sc.add(D);
    const cx = R(-20, 20), cz = R(-90, -10), r = R(10, 30), y = R(8, 22), w0 = R(0.15, 0.3) * (Math.random() < 0.5 ? -1 : 1), ph = Math.random() * 6;
    const place = (t) => { const a = ph + t * w0; D.position.set(cx + Math.cos(a) * r, y + Math.sin(t * 0.7 + ph) * 1.5, cz + Math.sin(a) * r); D.rotation.y = -a + (w0 > 0 ? 0 : Math.PI); };
    place(0); for (const x of wings) x.w.rotation.z = x.s * 0.5;
    if (!frozen) upd.push((t) => { place(t); for (const x of wings) x.w.rotation.z = x.s * Math.sin(t * 9 + ph) * 0.8; });
  }
  // a still LAKE, shining with the sky
  const lake = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.ShaderMaterial({ transparent: true, uniforms: { t: { value: 0 } },
    vertexShader: 'varying vec3 vW; varying vec2 vU; void main(){ vU = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float t; varying vec3 vW; varying vec2 vU;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){ float r = length(vU - 0.5) * 2.0; vec3 c = mix(vec3(0.72, 0.86, 1.0), vec3(1.0, 0.94, 0.8), 0.5 + 0.5 * sin(vW.x * 0.08 + t * 0.2));
        float sp = step(0.996, h(floor(vW.xz * 6.0) + floor(t * 3.0))); c += sp * 0.8;
        gl_FragColor = vec4(c, (1.0 - smoothstep(0.85, 1.0, r)) * 0.85); }` }));
  lake.rotation.x = -Math.PI / 2; lake.position.set(-24, -0.28, -46); lake.scale.set(13, 24, 1); sc.add(lake);
  if (!frozen) upd.push((t) => { lake.material.uniforms.t.value = t; });
  return { update(t, dt) { for (const f of upd) f(t, dt); } };
}
