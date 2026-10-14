// Trims: the small made pieces on clothes (world/People.js) - a flat strap or a binding laid along a line on the body, a
// metal O-ring, a bow and its tails, a twist knot, a button, a belt loop. Plain geometry, each piece's own (its colour, its
// material and where it goes are People's): no shading of their own but the cloth's thickness read at their edges.
import * as THREE from 'three';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
/** a closed tube through rings (each a loop of the same count) -> geometry, faces out */
function tubeOf(R) {
  const K = R.length, M = R[0].length, pos = new Float32Array(K * M * 3), idx = [];
  for (let k = 0; k < K; k++) for (let j = 0; j < M; j++) { const p = R[k][j], i = (k * M + j) * 3; pos[i] = p.x; pos[i + 1] = p.y; pos[i + 2] = p.z; }
  for (let k = 0; k < K - 1; k++) for (let j = 0; j < M; j++) { const j1 = (j + 1) % M, a = k * M + j, b = k * M + j1, c = (k + 1) * M + j1, d = (k + 1) * M + j; idx.push(a, c, b, a, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  // (facing out: a middle ring's vertices' normals away from that ring's own middle - else turned round)
  const k = K >> 1, c = new THREE.Vector3(); for (let j = 0; j < M; j++) c.add(R[k][j]); c.multiplyScalar(1 / M);
  let s = 0; const N = g.attributes.normal; for (let j = 0; j < M; j++) { const p = R[k][j]; s += (p.x - c.x) * N.getX(k * M + j) + (p.y - c.y) * N.getY(k * M + j) + (p.z - c.z) * N.getZ(k * M + j); }
  if (s < 0) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); }
  return g;
}
/**
 * A flat strip along points (pts), lying on what is under it (nrm[i]: the way out of that surface at each point): w
 * across, t thick - a rectangle in section, its edges a little rounded; its ends closed (a strap, a binding, a tie's tail).
 * tw(u): its width's share along it (a tail narrowing, a twist) -> geometry
 */
export function strip(pts, nrm, w, t, tw = null) {
  const N = pts.length, R = [], T = V(), B = V(), Nn = V();
  const sec = [[-0.5, -0.5], [-0.42, 0.5], [0.42, 0.5], [0.5, -0.5]];
  for (let i = 0; i < N; i++) {
    T.subVectors(pts[Math.min(N - 1, i + 1)], pts[Math.max(0, i - 1)]).normalize();
    Nn.copy(nrm[i]).addScaledVector(T, -nrm[i].dot(T)); if (Nn.lengthSq() < 1e-10) Nn.set(0, 1, 0); Nn.normalize(); B.crossVectors(T, Nn);
    const k = tw ? tw(i / (N - 1)) : 1;
    R.push(sec.map(([a, b]) => pts[i].clone().addScaledVector(B, a * w * k).addScaledVector(Nn, b * t)));
  }
  // (closed at each end: the ring drawn in to its middle)
  R.unshift(Array(4).fill(pts[0].clone())); R.push(Array(4).fill(pts[N - 1].clone()));
  return tubeOf(R);
}
/** a round cord along a closed loop of points (a binding round a cut-out's edge, piping): radius r, m round -> geometry */
export function cord(pts, r, m = 5, closed = true) {
  const cv = new THREE.CatmullRomCurve3(pts, closed, 'centripetal');
  return new THREE.TubeGeometry(cv, Math.max(8, Math.round(pts.length * 1.5)), r, m, closed);
}
/** a metal O-ring at p, lying on the surface whose way out is n: radius r, its wire t -> geometry */
export function oRing(p, n, r = 0.014, t = 0.0026) {
  const g = new THREE.TorusGeometry(r, t, 6, 20); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), n.clone().normalize())); g.translate(p.x, p.y, p.z); return g;
}
/** a button at p on a surface facing n: a flat round, r across -> geometry */
export function button(p, n, r = 0.007) {
  const g = new THREE.CylinderGeometry(r, r * 0.92, r * 0.45, 12, 1); g.rotateX(Math.PI / 2); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), n.clone().normalize())); g.translate(p.x, p.y, p.z); return g;
}
/**
 * A bow tied at p on a surface facing n (up: the way up it), s its size (each loop's length): two loops either side of a
 * small knot, lying a little out from the surface, and two tails hanging from it, narrowing toward their cut ends ->
 * [geometry]
 */
export function bow(p, n, up, s = 0.035, tail = 0.08) {
  const N = n.clone().normalize(), U = up.clone().addScaledVector(N, -up.dot(N)).normalize(), S = V().crossVectors(U, N), out = [], w = 0.38 * s, t = 0.0022;
  // (each loop: from the knot out to the side and back, a flattened oval standing a little off the surface)
  for (const sd of [-1, 1]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI * 2, x = sd * (0.5 - 0.5 * Math.cos(a)) * s, y = 0.32 * s * Math.sin(a) + 0.08 * s * (x / s) * sd; pts.push(p.clone().addScaledVector(S, x).addScaledVector(U, y).addScaledVector(N, 0.004 + 0.006 * Math.sin(Math.PI * Math.abs(x) / s))); nr.push(N.clone().addScaledVector(U, -0.3 * Math.sin(a)).normalize()); }
    out.push(strip(pts, nr, w, t, (u) => 0.75 + 0.25 * Math.sin(Math.PI * u)));
  }
  // (the knot: a short wrap over the middle)
  const kn = new THREE.SphereGeometry(0.2 * s, 10, 8); kn.scale(0.8, 1.15, 0.6); kn.applyQuaternion(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(S, U, N))); kn.translate(...p.clone().addScaledVector(N, 0.006).toArray()); out.push(kn);
  // (the tails: hanging from the knot, slanting apart, narrowing toward their cut ends)
  for (const sd of [-1, 1]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push(p.clone().addScaledVector(S, sd * (0.05 * s + 0.25 * tail * u)).addScaledVector(U, -tail * u).addScaledVector(N, 0.005 - 0.002 * u)); nr.push(N.clone()); }
    out.push(strip(pts, nr, 0.32 * s, t, (u) => 1 - 0.3 * u));
  }
  return out;
}
/**
 * A twist knot at p on a surface facing n (up: the way up it): the cloth from either side drawn in and twisted round
 * itself - a short round wrap, w across, banded by its twist -> [geometry] (colours: the twist's folds a shade darker)
 */
export function twist(p, n, up, w = 0.04, h = 0.026) {
  // (its rings untwisted - smooth, no facets winding round it - fuller at the middle, flattening into the cloth either side;
  // the twist itself in its shading: two soft folds winding diagonally across it)
  const N = n.clone().normalize(), U = up.clone().addScaledVector(N, -up.dot(N)).normalize(), S = V().crossVectors(U, N), R = [], M = 14, K = 10;
  for (let k = 0; k <= K; k++) {
    const u = k / K, x = (u - 0.5) * w, e = Math.sin(Math.PI * u), r = 0.5 * h * (0.55 + 0.45 * e);
    R.push(Array.from({ length: M }, (_, j) => { const a = (j / M) * 2 * Math.PI; return p.clone().addScaledVector(S, x).addScaledVector(U, r * Math.cos(a)).addScaledVector(N, 0.002 + (0.25 + 0.5 * e) * r * (1 + Math.sin(a)) * 0.5); }));
  }
  const g = tubeOf(R), C = new Float32Array(R.length * M * 3);
  for (let k = 0; k <= K; k++) for (let j = 0; j < M; j++) { const a = (j / M) * 2 * Math.PI, c = 0.8 + 0.2 * (0.5 + 0.5 * Math.cos(2 * a - (k / K) * 2 * Math.PI)); const i = (k * M + j) * 3; C[i] = C[i + 1] = C[i + 2] = c; }
  g.setAttribute('color', new THREE.BufferAttribute(C, 3));
  return [g];
}
