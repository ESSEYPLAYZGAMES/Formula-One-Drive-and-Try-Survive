// Generic building extrusion (footprint polygons -> merged mesh) with a
// procedural "lit windows" facade shader. Also exports the shader factory for landmarks.
import * as THREE from 'three';
import { ringArea } from '../core/GeoLoader.js';
import { corridorSigned } from '../track/TrackBuilder.js';

/**
 * Facade shader: dark architectural base, window cells with hashed on/off state and
 * warm/cool tints, simple lambert + ambient, scene fog.
 */
export function makeWindowMaterial({ base = 0x2a2f3a, lit = 0xffd9a0, cool = 0x9fd0ff, litProb = 0.42, cellW = 4.0, cellH = 3.5, roof = 0x1a1d24, emissiveBoost = 1.0, mullion = null, useVertexColor = false } = {}) {
  const mat = new THREE.ShaderMaterial({
    fog: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      uBase: { value: new THREE.Color(base) }, uLit: { value: new THREE.Color(lit) }, uCool: { value: new THREE.Color(cool) },
      uRoof: { value: new THREE.Color(roof) }, uLitProb: { value: litProb }, uCell: { value: new THREE.Vector2(cellW, cellH) },
      uLightDir: { value: new THREE.Vector3(-0.5, 0.8, 0.3).normalize() }, uBoost: { value: emissiveBoost },
      uMullion: { value: mullion ? new THREE.Color(mullion) : new THREE.Color(0) }, uHasMullion: { value: mullion ? 1 : 0 }, uTime: { value: 0 },
      uDay: { value: 0 }, uDayBase: { value: new THREE.Color(base).lerp(new THREE.Color(0xd9d4c7), 0.7) }, uDayGlass: { value: new THREE.Color(0x8fb3d6) }, uDayRoof: { value: new THREE.Color(0x8e8a80) },
    }]),
    vertexShader: `
      #include <common>
      #include <fog_pars_vertex>
      varying vec3 vWorld; varying vec3 vNormalW; varying vec3 vColor;
      ${useVertexColor ? 'attribute vec3 color;' : ''}
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vColor = ${useVertexColor ? 'color' : 'vec3(1.0)'};
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uBase, uLit, uCool, uRoof, uMullion, uDayBase, uDayGlass, uDayRoof; uniform float uLitProb, uBoost, uHasMullion, uTime, uDay; uniform vec2 uCell; uniform vec3 uLightDir;
      varying vec3 vWorld; varying vec3 vNormalW; varying vec3 vColor;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main(){
        vec3 n = normalize(vNormalW);
        float lam = max(dot(n, uLightDir), 0.0);
        vec3 col;
        if (abs(n.y) > 0.6) {
          col = mix(uRoof * (0.35 + 0.5 * lam), uDayRoof * (0.55 + 0.6 * lam), uDay) * vColor;
        } else if (uDay > 0.5) {
          // daytime facade: sunlit concrete / stone with sky-reflecting glass panes and a soft sky fill from above
          vec3 t = normalize(cross(vec3(0.0, 1.0, 0.0), n));
          float u = dot(vWorld, t) + dot(floor(n * 7.0), vec3(13.0, 0.0, 29.0));
          vec2 cell = floor(vec2(u, vWorld.y) / uCell); vec2 f = fract(vec2(u, vWorld.y) / uCell);
          float isWin = step(0.18, f.x) * step(f.x, 0.82) * step(0.22, f.y) * step(f.y, 0.78);
          float skyFill = 0.35 + 0.25 * max(n.y, 0.0) + 0.15 * (0.5 + 0.5 * n.z);
          vec3 facade = uDayBase * (skyFill + 0.75 * lam) * vColor;
          // (the glass reflects the sky - more at a glancing angle - over a dark interior: never a flat pale blue)
          float fres = pow(1.0 - max(dot(n, normalize(cameraPosition - vWorld)), 0.0), 3.0);
          vec3 pane = mix(vec3(0.07, 0.08, 0.095), mix(uDayGlass * 0.42, vec3(0.6, 0.65, 0.7), fres), 0.3 + 0.6 * fres) * (0.85 + 0.3 * hash(cell + 2.7));
          col = mix(facade, pane, isWin);
          if (uHasMullion > 0.5) { float m = step(0.94, f.x) + step(f.x, 0.06); col = mix(col, uMullion * (0.5 + 0.9 * lam), clamp(m, 0.0, 1.0)); }
        } else {
          vec3 t = normalize(cross(vec3(0.0, 1.0, 0.0), n));
          float u = dot(vWorld, t) + dot(floor(n * 7.0), vec3(13.0, 0.0, 29.0)); // decorrelate faces
          float v = vWorld.y;
          vec2 cell = floor(vec2(u, v) / uCell);
          vec2 f = fract(vec2(u, v) / uCell);
          float h = hash(cell);
          float isWin = step(0.18, f.x) * step(f.x, 0.82) * step(0.22, f.y) * step(f.y, 0.78);
          float on = step(1.0 - uLitProb, h);
          float flick = 0.85 + 0.15 * sin(uTime * 0.7 + h * 40.0);
          vec3 tint = mix(uLit, uCool, step(0.72, hash(cell + 7.3)));
          vec3 facade = uBase * (0.28 + 0.55 * lam) * vColor;
          vec3 winDark = uBase * 0.35;
          vec3 winLit = tint * (0.9 + 0.6 * hash(cell + 3.1)) * uBoost * flick;
          col = mix(facade, mix(winDark, winLit, on), isWin);
          if (uHasMullion > 0.5) { float m = step(0.94, f.x) + step(f.x, 0.06); col = mix(col, uMullion * (0.4 + 0.8 * lam), clamp(m, 0.0, 1.0)); }
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
  return mat;
}

/** Shape from rings ([x,z] outer + holes) in the XZ plane, extruded up by h (base at y=0). */
export function extrudeFootprint(rings, h, yBase = 0) {
  const outer = rings[0];
  if (!outer || outer.length < 3) return null;
  const shape = new THREE.Shape(outer.map((p) => new THREE.Vector2(p[0], -p[1])));
  for (let i = 1; i < rings.length; i++) if (rings[i].length >= 3) shape.holes.push(new THREE.Path(rings[i].map((p) => new THREE.Vector2(p[0], -p[1]))));
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 4 });
  g.rotateX(-Math.PI / 2);
  if (yBase) g.translate(0, yBase, 0);
  g.deleteAttribute('uv');
  return g;
}

/** True when any vertex or edge point (5 m steps) of the ring lies inside the racing corridor (track + pit lane). */
export function ringTouchesCorridor(ring, track, pit, margin = 1.5) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]); const steps = Math.max(1, Math.ceil(len / 5));
    for (let k = 0; k < steps; k++) {
      const t = k / steps; const x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
      if (corridorSigned(track, pit, x, z, margin) < 0) return true;
    }
  }
  return false;
}

// ---- the map's own buildings: five kinds, each with its own character -----------------------------------------------
// Every footprint the map carries (and nothing else claims) becomes one of five kinds, by its height and a hash of its
// id, in muted colours - never the poster paint of a toy town:
//   brick  - terraces and warehouses: punched windows with white frames, stone sills and lintels, an arched shop floor,
//            a cornice and a parapet; the low ones under a gabled tile roof
//   modern - rendered blocks with balconies all round (a slab and a glass railing on every floor); the tall ones are
//            curtain-wall towers instead
//   stucco - sandstone, cream, sage: shuttered windows, balconies on some bays (the same bays up the whole facade), the
//            low ones under terracotta
//   tiered - slate and grey-green offices stepping back as they rise, a railed terrace on each step, ribbon windows
//   civic  - limestone: an arcade along the ground floor (columns, arches cut right through), tall arched windows above
// The windows are drawn by one shader (makeFacadeMaterial) from what each vertex carries - its kind and part, its
// storey height, where it is along its facade (every facade holds a whole number of window bays, centred, none cut in
// half at a corner) and the height its storeys count from - so the whole city is still one material, one mesh per
// 400 m cell. By night the windows light as before (uLitProb); shop floors more often.
const KINDS = [
  { name: 'brick', floor: 3.4, cell: 3.2, walls: [0x8a5a46, 0x7d4d3c, 0x96664f, 0x6f4a3b, 0x9c7a62, 0xa48a6c], trim: 0xcfc4ae },
  { name: 'modern', floor: 3.1, cell: 3.6, walls: [0xd9d2c4, 0xcfc8ba, 0xbfc3c2, 0xe1dbd0, 0xb8b2a6, 0xa9aeb0], trim: 0xe9e7e1 },
  { name: 'stucco', floor: 3.3, cell: 4.2, walls: [0xc0a885, 0xb59b78, 0xcdb898, 0xa99474, 0x9ba08a, 0xb89a90], trim: 0xd9cfbb },
  { name: 'tiered', floor: 3.8, cell: 1.6, walls: [0x7f8781, 0x8c918a, 0x747c80, 0x9a9b93, 0x6e7670, 0x857f76], trim: 0x5d6460 },
  { name: 'civic', floor: 4.0, cell: 3.6, walls: [0xd2c9b3, 0xc8bea6, 0xbdb39b, 0xd8d0bd, 0xc4bba8], trim: 0xe3dbc8 },
];
const TILES = [0x8d5440, 0x7a4a3a, 0x4f555c, 0x5c5f63, 0x6e5a4b];   // gabled roofs: terracotta, brown, slate
const PART = { wall: 0, trim: 1, rail: 2, tiles: 3, shop: 4, arch: 5 };

/** the facade shader for the map's buildings (above): same uniforms as makeWindowMaterial, so the time of day drives it */
export function makeFacadeMaterial({ litProb = 0.38, roof = 0x8d8a83 } = {}) {
  const mat = new THREE.ShaderMaterial({
    fog: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      uLit: { value: new THREE.Color(0xffd9a0) }, uCool: { value: new THREE.Color(0x9fd0ff) }, uRoof: { value: new THREE.Color(roof) },
      uLitProb: { value: litProb }, uLightDir: { value: new THREE.Vector3(-0.5, 0.8, 0.3).normalize() }, uBoost: { value: 1.0 }, uTime: { value: 0 }, uDay: { value: 0 },
    }]),
    vertexShader: `
      #include <common>
      #include <fog_pars_vertex>
      attribute vec3 color; attribute vec4 aStyle;
      varying vec3 vWorld; varying vec3 vN; varying vec3 vCol; varying vec4 vSty;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz;
        vN = normalize(mat3(modelMatrix) * normal); vCol = color; vSty = aStyle;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uLit, uCool, uRoof, uLightDir; uniform float uLitProb, uBoost, uTime, uDay;
      varying vec3 vWorld; varying vec3 vN; varying vec3 vCol; varying vec4 vSty;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float box(vec2 f, vec4 r){ return step(r.x, f.x) * step(f.x, r.z) * step(r.y, f.y) * step(f.y, r.w); }
      float ell(vec2 f, vec2 c, vec2 r){ vec2 d = (f - c) / r; return step(dot(d, d), 1.0); }
      void main(){
        float code = floor(vSty.x + 0.5), seed = floor(code / 100.0), rem = code - seed * 100.0, part = floor(rem / 10.0), kind = rem - part * 10.0;
        vec3 n = normalize(vN); float lam = max(dot(n, normalize(uLightDir)), 0.0);
        vec3 V = normalize(cameraPosition - vWorld); float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
        vec3 base = vCol; if (base.r + base.g + base.b < 0.02) base = vec3(0.55);   // (a mesh without colours: pale stone)
        float k = mix(0.10 + 0.20 * lam, 0.40 + 0.18 * max(n.y, 0.0) + 0.62 * lam, uDay);   // (how lit a surface is, night .. day)
        float flick = 0.85 + 0.15 * sin(uTime * 0.7 + seed);
        vec3 col;
        if (part > 0.5 && part < 1.5) col = base * k;   // (trim: cornices, slabs, parapets, columns, soffits)
        else if (part > 1.5 && part < 2.5) {             // (a glass railing with its rail)
          float t = vWorld.y - vSty.w, rail = max(step(0.95, t), step(t, 0.05));
          vec3 g = mix(vec3(0.05, 0.06, 0.065), vec3(0.30, 0.36, 0.38), uDay * (0.45 + 0.5 * fres));
          col = mix(g, vec3(0.62, 0.63, 0.62) * k, rail);
        } else if (part > 2.5 && part < 3.5) {           // (tiles: courses down the slope)
          float row = step(0.8, fract(vWorld.y / 0.3));
          col = base * mix(0.12 + 0.2 * lam, 0.36 + 0.75 * lam, uDay) * (1.0 - 0.18 * row) * (0.92 + 0.08 * hash(floor(vWorld.xz * 1.3)));
        } else if (abs(n.y) > 0.6) {                     // (a flat roof: gravel and patches)
          float nz = hash(floor(vWorld.xz / 3.0)) * 0.12;
          col = uRoof * mix(0.12 + 0.12 * lam, 0.42 + 0.5 * lam, uDay) * (0.94 + nz);
        } else {
          float u = vSty.z, fh = max(vSty.y, 2.4), yy = vWorld.y - vSty.w;
          if (vSty.y < 0.5) { vec3 t = normalize(cross(vec3(0.0, 1.0, 0.0), n)); u = dot(vWorld, t) / 4.0; fh = 3.5; yy = vWorld.y; kind = 2.0; }   // (a mesh without the style: the old city's storeys)
          float fl = floor(yy / fh); vec2 f = vec2(fract(u), fract(yy / fh)); vec2 cell = vec2(floor(u), fl) + seed * 0.37;
          float win = 0.0, frm = 0.0, stone = 0.0, shut = 0.0, groove = 0.0, litP = uLitProb;
          vec3 frameC = vec3(0.82, 0.81, 0.78);
          if (u < -0.5) { win = 0.0; }                  // (a wall too short for a window)
          else if (part > 4.5) {                        // (the arcade's arches: cut right through)
            float t = clamp(yy / fh, 0.0, 1.0), ax = (f.x - 0.5) / 0.42;
            if (abs(ax) < 1.0 && t < 0.84 * sqrt(1.0 - ax * ax)) discard;
            stone = box(f, vec4(0.46, 0.8, 0.54, 1.0));
          } else if (part > 3.5) {                      // (a shop front behind the arcade)
            win = box(f, vec4(0.12, 0.04, 0.88, 0.82)); frm = win * (1.0 - box(f, vec4(0.14, 0.06, 0.86, 0.8))); frameC = vec3(0.16); litP = min(0.95, uLitProb * 1.8 + 0.2 * (1.0 - uDay));
          } else if (kind < 0.5) {                      // brick
            if (fl < 0.5) {
              win = max(box(f, vec4(0.1, 0.05, 0.9, 0.6)), ell(f, vec2(0.5, 0.6), vec2(0.4, 0.26)) * step(0.6, f.y));
              frm = win * (1.0 - max(box(f, vec4(0.13, 0.07, 0.87, 0.6)), ell(f, vec2(0.5, 0.6), vec2(0.36, 0.22)) * step(0.6, f.y)));
              frameC = vec3(0.13, 0.15, 0.14); litP = min(0.95, uLitProb * 1.8 + 0.2 * (1.0 - uDay));
            } else {
              win = box(f, vec4(0.29, 0.22, 0.71, 0.78));
              frm = win * (1.0 - box(f, vec4(0.32, 0.25, 0.68, 0.75))) + box(f, vec4(0.32, 0.49, 0.68, 0.52));
              stone = box(f, vec4(0.25, 0.16, 0.75, 0.22)) + box(f, vec4(0.26, 0.78, 0.74, 0.86));
            }
            float xm = u * 3.2, row = floor(yy / 0.15), aa = clamp(1.0 - fwidth(yy) * 5.0, 0.0, 1.0);
            groove = aa * (0.06 * (hash(vec2(floor(xm / 0.45 + 0.5 * mod(row, 2.0)), row)) - 0.5) - 0.07 * step(0.86, fract(yy / 0.15)));
          } else if (kind < 1.5) {                      // modern (balconies, or a curtain wall)
            win = box(f, vec4(0.06, 0.07, 0.94, 0.9)); frm = win * step(abs(f.x - 0.5), 0.012); frameC = vec3(0.22, 0.23, 0.24);
            stone = step(0.93, f.y);
          } else if (kind < 2.5) {                      // stucco
            if (fl < 0.5) { win = box(f, vec4(0.22, 0.04, 0.78, 0.74)); frameC = vec3(0.2, 0.17, 0.14); litP = min(0.95, uLitProb * 1.6 + 0.15 * (1.0 - uDay)); }
            else { win = box(f, vec4(0.3, 0.2, 0.7, 0.8)); shut = box(f, vec4(0.19, 0.2, 0.29, 0.8)) + box(f, vec4(0.71, 0.2, 0.81, 0.8)); stone = box(f, vec4(0.27, 0.15, 0.73, 0.2)); }
            frm = win * (1.0 - box(f, vec4(0.33, 0.23, 0.67, 0.77))) * step(0.5, fl) + win * step(abs(f.x - 0.5), 0.015);
          } else if (kind < 3.5) {                      // tiered: ribbon windows
            win = fl < 0.5 ? box(f, vec4(0.0, 0.05, 1.0, 0.92)) : box(f, vec4(0.0, 0.3, 1.0, 0.84));
            frm = win * max(step(f.x, 0.05), step(0.95, f.x)); frameC = vec3(0.16, 0.17, 0.18);
          } else {                                      // civic: tall arched windows, a rusticated ground floor
            if (fl < 0.5) { groove = -0.14 * step(0.9, fract(yy / 0.55)); win = box(f, vec4(0.32, 0.04, 0.68, 0.7)) * step(0.7, hash(cell + 5.0)); frameC = vec3(0.2, 0.16, 0.12); }
            else {
              win = max(box(f, vec4(0.33, 0.15, 0.67, 0.66)), ell(f, vec2(0.5, 0.66), vec2(0.17, 0.155)) * step(0.66, f.y));
              frm = win * step(abs(f.x - 0.5), 0.012); frameC = vec3(0.18, 0.17, 0.16);
              stone = box(f, vec4(0.47, 0.82, 0.53, 0.9)) + box(f, vec4(0.29, 0.1, 0.71, 0.15));
            }
          }
          vec3 wall = base * k * (1.0 + groove) * mix(0.8, 1.0, smoothstep(0.0, 1.6, vWorld.y));
          vec3 stoneC = mix(base, vec3(0.86, 0.83, 0.77), 0.65) * k;
          vec3 shutC = mix(vec3(0.24, 0.33, 0.30), vec3(0.30, 0.34, 0.40), step(0.5, hash(vec2(seed, 2.0)))) * k;
          float on = step(1.0 - litP, hash(cell)), hc = hash(cell + 3.1);
          vec3 gDay = mix(vec3(0.07, 0.08, 0.095), mix(vec3(0.34, 0.39, 0.45), vec3(0.58, 0.63, 0.69), fres), 0.25 + 0.6 * fres) * (0.85 + 0.3 * hc);
          vec3 tint = mix(uLit, uCool, step(0.75, hash(cell + 7.3)));
          vec3 gNight = mix(vec3(0.02, 0.025, 0.03) + 0.05 * fres, tint * (0.8 + 0.5 * hc) * uBoost * flick, on);
          vec3 glass = mix(gNight, mix(gDay, tint * 0.7, on * 0.12), uDay);   // (by day a lamp left on barely shows)
          col = mix(wall, stoneC, clamp(stone, 0.0, 1.0));
          col = mix(col, shutC, clamp(shut, 0.0, 1.0));
          col = mix(col, glass, clamp(win, 0.0, 1.0));
          col = mix(col, frameC * k, clamp(frm, 0.0, 1.0));
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
  return mat;
}

/** a footprint ring tidied: no repeated points, no closing duplicate */
function cleanRing(r) {
  const out = [];
  for (const p of r) { const q = out[out.length - 1]; if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05) out.push(p); }
  while (out.length > 2 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < 0.05) out.pop();
  return out;
}
const sArea = (r) => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
function inRing(x, z, r) { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const a = r[i], b = r[j]; if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
/** the ring moved out (d > 0) or in (d < 0) by d metres, square corners mitred (null when an inset folds over itself) */
function offsetRing(r, d) {
  const sg = Math.sign(sArea(r)) || 1, n = r.length, out = [];
  const nrm = (a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1; return [sg * dz / l, -sg * dx / l]; };
  for (let i = 0; i < n; i++) {
    const p = r[i], n1 = nrm(r[(i - 1 + n) % n], p), n2 = nrm(p, r[(i + 1) % n]);
    let mx = n1[0] + n2[0], mz = n1[1] + n2[1]; const ml = Math.hypot(mx, mz);
    if (ml < 1e-6) { mx = n1[0]; mz = n1[1]; } else { mx /= ml; mz /= ml; }
    const k = d / Math.max(0.4, mx * n1[0] + mz * n1[1]);
    out.push([p[0] + mx * k, p[1] + mz * k]);
  }
  if (d < 0) { if (Math.sign(sArea(out)) !== sg || Math.abs(sArea(out)) < 0.25 * Math.abs(sArea(r)) || !out.every((p) => inRing(p[0], p[1], r))) return null; }
  return out;
}
/** the ring scaled about its centroid (a tier), or null if it would not sit inside the floor below */
function scaleRing(r, k) {
  let cx = 0, cz = 0; for (const p of r) { cx += p[0]; cz += p[1]; } cx /= r.length; cz /= r.length;
  const out = r.map((p) => [cx + (p[0] - cx) * k, cz + (p[1] - cz) * k]);
  return out.every((p) => inRing(p[0], p[1], r)) ? out : null;
}
const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };
const lin = (hex, j = 1) => { const c = new THREE.Color(hex); return [c.r * j, c.g * j, c.b * j]; };

/** one cell's geometry, built straight into arrays (position, normal, colour, style) */
class FacadeGeo {
  constructor() { this.p = []; this.n = []; this.c = []; this.s = []; }
  tri(a, b, c, hint, col, sa, sb, sc) {
    let ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz); if (l < 1e-9) return;
    nx /= l; ny /= l; nz /= l;
    if (nx * hint[0] + ny * hint[1] + nz * hint[2] < 0) { [b, c] = [c, b]; [sb, sc] = [sc, sb]; nx = -nx; ny = -ny; nz = -nz; }
    for (const [v, st] of [[a, sa], [b, sb], [c, sc]]) { this.p.push(v[0], v[1], v[2]); this.n.push(nx, ny, nz); this.c.push(col[0], col[1], col[2]); this.s.push(st[0], st[1], st[2], st[3]); }
  }
  quad(a, b, c, d, hint, col, sa, sb, sc, sd) { this.tri(a, b, c, hint, col, sa, sb, sc); this.tri(a, c, d, hint, col, sa, sc, sd); }
  /** the walls along a ring from y0 to y1, facing out of it (out -1: into it - a courtyard, a parapet's inner face);
   *  cell: the window bay - every wall a whole number of them (u counts bays; -1: too short for one) */
  walls(ring, y0, y1, out, col, code, fh, cell, yRef, both = false) {
    const sg = (Math.sign(sArea(ring)) || 1) * out, n = ring.length;
    for (let i = 0; i < n; i++) {
      const a = ring[i], b = ring[(i + 1) % n], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz); if (L < 0.05) continue;
      const nn = [sg * dz / L, 0, -sg * dx / L], bays = Math.max(1, Math.round(L / cell)), uB = cell > 0 && L >= cell * 0.55 ? bays : -1, uA = uB < 0 ? -1 : 0;
      const A0 = [a[0], y0, a[1]], B0 = [b[0], y0, b[1]], B1 = [b[0], y1, b[1]], A1 = [a[0], y1, a[1]];
      const sA = [code, fh, uA, yRef], sB = [code, fh, uB, yRef];
      this.quad(A0, B0, B1, A1, nn, col, sA, sB, sB, sA);
      if (both) this.quad(A0, B0, B1, A1, [-nn[0], 0, -nn[2]], col, sA, sB, sB, sA);
    }
  }
  /** a horizontal face over the rings (outer + holes) at height y, facing up (dir 1) or down (-1) */
  cap(rings, y, dir, col, code) {
    const contour = rings[0].map((p) => new THREE.Vector2(p[0], p[1])), holes = rings.slice(1).map((r) => r.map((p) => new THREE.Vector2(p[0], p[1])));
    let tris; try { tris = THREE.ShapeUtils.triangulateShape(contour, holes); } catch (e) { return; }
    const all = contour.concat(...holes), st = [code, 0, 0, y];
    for (const [i, j, k] of tris) this.tri([all[i].x, y, all[i].y], [all[j].x, y, all[j].y], [all[k].x, y, all[k].y], [0, dir, 0], col, st, st, st);
  }
  /** an upright box: centre (x, z), half-sizes along e (hl) and across (hw), from y0 to y1 */
  box(x, z, e, hl, hw, y0, y1, col, code) {
    const p = [-e[1], e[0]], ring = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [x + e[0] * hl * a + p[0] * hw * b, z + e[1] * hl * a + p[1] * hw * b]);
    this.walls(ring, y0, y1, 1, col, code, 0, 0, y0); this.cap([ring], y1, 1, col, code); this.cap([ring], y0, -1, col, code);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3)); g.setAttribute('aStyle', new THREE.Float32BufferAttribute(this.s, 4));
    g.computeBoundingSphere(); return g;
  }
}

/** a parapet round a flat roof: the outer face, the inner face and its coping (none if the roof is too small for one) */
function parapet(G, ring, y, h, col, code, t = 0.3) {
  const inner = offsetRing(ring, -t); if (!inner) return;
  G.walls(ring, y, y + h, 1, col, code, 0, 0, y); G.walls(inner, y, y + h, -1, col, code, 0, 0, y); G.cap([ring, inner], y + h, 1, col, code);
}
/** a gabled roof over a near-rectangular footprint, the ridge along its length: tiles and the two gable ends */
function gable(G, ring, h, wallCol, tileCol, codeT, codeW) {
  let cx = 0, cz = 0; for (const p of ring) { cx += p[0]; cz += p[1]; } cx /= ring.length; cz /= ring.length;
  let sxx = 0, szz = 0, sxz = 0; for (const p of ring) { const dx = p[0] - cx, dz = p[1] - cz; sxx += dx * dx; szz += dz * dz; sxz += dx * dz; }
  const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz), e = [Math.cos(ang), Math.sin(ang)], q = [-e[1], e[0]];
  let l0 = Infinity, l1 = -Infinity, w0 = Infinity, w1 = -Infinity;
  for (const p of ring) { const dx = p[0] - cx, dz = p[1] - cz, l = dx * e[0] + dz * e[1], w = dx * q[0] + dz * q[1]; l0 = Math.min(l0, l); l1 = Math.max(l1, l); w0 = Math.min(w0, w); w1 = Math.max(w1, w); }
  const L = l1 - l0, W = w1 - w0, mx = cx + e[0] * (l0 + l1) / 2 + q[0] * (w0 + w1) / 2, mz = cz + e[1] * (l0 + l1) / 2 + q[1] * (w0 + w1) / 2;
  const o = 0.35, rise = Math.min(W * 0.36, 4.5), at = (a, b, y) => [mx + e[0] * a + q[0] * b, y, mz + e[1] * a + q[1] * b];
  const st = [codeT, 0, 0, h], sw = [codeW, 0, 0, h];
  for (const s of [1, -1]) {
    G.quad(at(-L / 2 - o, s * (W / 2 + o), h - 0.12), at(L / 2 + o, s * (W / 2 + o), h - 0.12), at(L / 2 + o, 0, h + rise), at(-L / 2 - o, 0, h + rise), [q[0] * s, 1, q[1] * s], tileCol, st, st, st, st);
    G.tri(at(s * L / 2, -W / 2, h), at(s * L / 2, W / 2, h), at(s * L / 2, 0, h + rise * (W / 2) / (W / 2 + o)), [e[0] * s, 0, e[1] * s], wallCol, sw, sw, sw);
  }
}

/** a footprint's height and its storeys, by kind: what it gets (balconies, tiers, an arcade, a gabled roof) */
function buildOne(G, b, rings, yb, h, ctx) {
  const ring = rings[0], holes = rings.slice(1), hgt = h - yb, r = hashStr(String(b.id)), seed = Math.floor(hashStr(String(b.id) + 's') * 999);
  let kind;
  if (hgt >= 30) kind = r < 0.42 ? 3 : r < 0.84 ? 1 : 4;
  else if (hgt >= 12) kind = Math.min(4, Math.floor(r * 5));
  else kind = r < 0.34 ? 0 : r < 0.64 ? 2 : r < 0.78 ? 4 : r < 0.9 ? 1 : 3;
  // (a circuit's taste: Las Vegas is a desert city - little brick, its low blocks stucco and modern instead)
  if (kind === 0 && hashStr(String(b.id) + 'b') > (ctx.style.brick ?? 1)) kind = hashStr(String(b.id) + 'k') < 0.6 ? 2 : 1;
  const K = KINDS[kind], jit = 0.93 + 0.14 * hashStr(String(b.id) + 'j'), wall = lin(K.walls[Math.floor(hashStr(String(b.id) + 'c') * K.walls.length)], jit), trim = lin(K.trim);
  const code = (part) => kind + 10 * part + 100 * seed, fh = K.floor, nf = Math.floor(hgt / fh);
  const info = { n: ring.length, area: Math.abs(sArea(ring)) };
  // (a low near-rectangle - a house, a shed, a terrace - under a gabled roof: brick and stucco)
  let minL = Infinity, maxL = -Infinity, minW = Infinity, maxW = -Infinity;
  { let cx = 0, cz = 0; for (const p of ring) { cx += p[0]; cz += p[1]; } cx /= ring.length; cz /= ring.length; let sxx = 0, szz = 0, sxz = 0; for (const p of ring) { const dx = p[0] - cx, dz = p[1] - cz; sxx += dx * dx; szz += dz * dz; sxz += dx * dz; } const a = 0.5 * Math.atan2(2 * sxz, sxx - szz), ca = Math.cos(a), sa = Math.sin(a); for (const p of ring) { const dx = p[0] - cx, dz = p[1] - cz, l = dx * ca + dz * sa, w = -dx * sa + dz * ca; minL = Math.min(minL, l); maxL = Math.max(maxL, l); minW = Math.min(minW, w); maxW = Math.max(maxW, w); } }
  const rectish = info.n >= 4 && info.n <= 6 && !holes.length && info.area >= 0.88 * (maxL - minL) * (maxW - minW) && maxW - minW <= 16 && maxL - minL <= 45;
  const pitched = (kind === 0 || kind === 2) && hgt <= 11 && rectish;
  const holeWalls = (y0, y1, c, cell, yRef) => { for (const hr of holes) G.walls(hr, y0, y1, -1, wall, c, fh, cell, yRef); };
  const roof = (rr, y) => G.cap(rr, y, 1, wall, code(PART.wall));
  // (on a flat roof of any size: plant boxes, a stair core, a water tank - what a roof seen from the air is made of)
  const kit = (rr, y) => {
    const a = Math.abs(sArea(rr)); if (a < 150) return;
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (const p of rr) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); z0 = Math.min(z0, p[1]); z1 = Math.max(z1, p[1]); }
    const grey = lin(0x9a9893, 0.9 + 0.2 * hashStr(String(b.id) + 'g')), n = Math.min(4, 1 + Math.floor(a / 500));
    for (let i = 0, tries = 0; i < n && tries < 24; tries++) {
      const u = hashStr(`${b.id}r${tries}`), v = hashStr(`${b.id}q${tries}`), w = 1.2 + 2.2 * hashStr(`${b.id}w${tries}`), d = 1.0 + 1.6 * hashStr(`${b.id}d${tries}`);
      const x = x0 + (x1 - x0) * u, z = z0 + (z1 - z0) * v;
      if (![[w + 1.5, 0], [-w - 1.5, 0], [0, d + 1.5], [0, -d - 1.5]].every(([ox, oz]) => inRing(x + ox, z + oz, rr))) continue;
      G.box(x, z, [1, 0], w, d, y, y + 1.4 + 2.2 * hashStr(`${b.id}h${tries}`), grey, code(PART.trim)); i++;
    }
  };
  if (kind === 3 && hgt >= 18) {
    // tiered: stepping back at 55 % and 80 % of the height, a railed terrace on each step
    // (the steps: set in 3 m and 6 m - an L or a T steps back along every wing - or, if the inset folds, scaled down)
    const ins = Math.min(3, 0.12 * Math.sqrt(info.area)), o1 = offsetRing(ring, -ins), o2 = o1 && offsetRing(ring, -2 * ins);
    const r1 = o2 ? o1 : scaleRing(ring, 0.82), r2 = o2 || (r1 && scaleRing(ring, 0.64)), t1 = yb + hgt * 0.55, t2 = yb + hgt * 0.8;
    if (r1 && r2 && !holes.length) {
      G.walls(ring, yb, t1, 1, wall, code(PART.wall), fh, K.cell, yb); roof([ring], t1);
      G.walls(offsetRing(ring, -0.15) || ring, t1, t1 + 1.05, 1, trim, code(PART.rail), 0, 0, t1, true);
      G.walls(r1, t1, t2, 1, wall, code(PART.wall), fh, K.cell, yb); roof([r1], t2);
      G.walls(offsetRing(r1, -0.15) || r1, t2, t2 + 1.05, 1, trim, code(PART.rail), 0, 0, t2, true);
      G.walls(r2, t2, h, 1, wall, code(PART.wall), fh, K.cell, yb); roof([r2], h); kit(r2, h); parapet(G, r2, h, 1.2, trim, code(PART.trim));
      return kind;
    }
  }
  if (kind === 4 && hgt >= 9 && !holes.length) {
    // civic: an arcade - the ground floor set back behind columns, the arches cut right through above them
    const inset = offsetRing(ring, -1.8), gh = 4.6;
    if (inset && ring.every((p, i) => Math.hypot(ring[(i + 1) % ring.length][0] - p[0], ring[(i + 1) % ring.length][1] - p[1]) > 2.5)) {
      G.walls(inset, yb, yb + gh, 1, lin(K.walls[0], 0.9 * jit), code(PART.shop), gh, K.cell, yb);
      G.cap([ring, inset], yb + gh, -1, trim, code(PART.trim));
      G.walls(ring, yb + gh - 1.3, yb + gh, 1, wall, code(PART.arch), 1.3, K.cell, yb + gh - 1.3);
      const sg = Math.sign(sArea(ring)) || 1;
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], c = ring[(i + 1) % ring.length], dx = c[0] - a[0], dz = c[1] - a[1], L = Math.hypot(dx, dz), e = [dx / L, dz / L], out = [sg * e[1], -sg * e[0]], n = Math.max(1, Math.round(L / K.cell));
        for (let j = 0; j < n; j++) { const t = j / n; G.box(a[0] + dx * t - out[0] * 0.35, a[1] + dz * t - out[1] * 0.35, e, 0.28, 0.28, yb, yb + gh - 0.6, trim, code(PART.trim)); }
      }
      G.walls(ring, yb + gh, h, 1, wall, code(PART.wall), fh, K.cell, yb + gh); roof([ring], h); kit(ring, h);
      const cor = offsetRing(ring, 0.3); if (cor) { G.walls(cor, h - 0.9, h - 0.4, 1, trim, code(PART.trim), 0, 0, h); G.cap([cor, ring], h - 0.4, 1, trim, code(PART.trim)); G.cap([cor, ring], h - 0.9, -1, trim, code(PART.trim)); }
      parapet(G, ring, h, 0.9, trim, code(PART.trim));
      return kind;
    }
  }
  // the body
  G.walls(ring, yb, h, 1, wall, code(PART.wall), fh, K.cell, yb); holeWalls(yb, h, code(PART.wall), K.cell, yb);
  if (pitched) gable(G, ring, h, wall, lin(TILES[Math.floor(hashStr(String(b.id) + 't') * TILES.length)]), code(PART.tiles), code(PART.trim));
  else { roof(rings, h); kit(ring, h); }
  if (kind === 0 || kind === 4) {
    // brick and civic: a cornice band and a parapet
    if (!pitched) { const cor = offsetRing(ring, 0.3); if (cor) { G.walls(cor, h - 0.9, h - 0.45, 1, trim, code(PART.trim), 0, 0, h); G.cap([cor, ring], h - 0.45, 1, trim, code(PART.trim)); G.cap([cor, ring], h - 0.9, -1, trim, code(PART.trim)); } parapet(G, ring, h, 0.8, kind === 0 ? wall : trim, code(PART.trim)); }
  } else if (kind === 1) {
    // modern: a balcony all round on every floor (up to 16 storeys; a taller one is a curtain-wall tower), a glass rail on the roof
    const out = offsetRing(ring, 1.25);
    if (nf >= 2 && nf <= 16 && out && !holes.length && info.n <= 28 && !ringTouchesCorridor(out, ctx.track, ctx.pit, 0.3)) {
      const rail = offsetRing(ring, 1.18) || out;
      for (let k = 1; k < nf; k++) {
        const y = yb + k * fh;
        G.cap([out, ring], y + 0.2, 1, trim, code(PART.trim)); G.cap([out, ring], y, -1, trim, code(PART.trim)); G.walls(out, y, y + 0.2, 1, trim, code(PART.trim), 0, 0, y);
        G.walls(rail, y + 0.2, y + 1.25, 1, trim, code(PART.rail), 0, 0, y + 0.2, true);
      }
    }
    G.walls(offsetRing(ring, -0.1) || ring, h, h + 1.1, 1, trim, code(PART.rail), 0, 0, h, true);
  } else if (kind === 2) {
    // stucco: balconies on some bays, the same bays all the way up
    if (!pitched) parapet(G, ring, h, 0.6, trim, code(PART.trim));
    if (nf >= 2) {
      const sg = Math.sign(sArea(ring)) || 1;
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], c = ring[(i + 1) % ring.length], dx = c[0] - a[0], dz = c[1] - a[1], L = Math.hypot(dx, dz); if (L < 6) continue;
        const e = [dx / L, dz / L], o = [sg * e[1], -sg * e[0]], n = Math.max(1, Math.round(L / K.cell)), bw = Math.min(1.4, L / n / 2 - 0.3);
        for (let j = 0; j < n; j++) {
          if (hashStr(`${b.id}:${i}:${j}`) > 0.42) continue;
          const t = (j + 0.5) / n, x = a[0] + dx * t + o[0] * 0.55, z = a[1] + dz * t + o[1] * 0.55;
          for (let k = 1; k < nf; k++) {
            const y = yb + k * fh;
            G.box(x, z, e, bw, 0.55, y, y + 0.18, trim, code(PART.trim));
            const fx = x + o[0] * 0.53, fz = z + o[1] * 0.53, sx = x - o[0] * 0.55, sz = z - o[1] * 0.55, st = [code(PART.rail), 0, 0, y + 0.18];
            const P = (px, pz, yy) => [px, yy, pz];
            G.quad(P(fx - e[0] * bw, fz - e[1] * bw, y + 0.18), P(fx + e[0] * bw, fz + e[1] * bw, y + 0.18), P(fx + e[0] * bw, fz + e[1] * bw, y + 1.2), P(fx - e[0] * bw, fz - e[1] * bw, y + 1.2), [o[0], 0, o[1]], trim, st, st, st, st);
            for (const s of [1, -1]) G.quad(P(sx + e[0] * bw * s, sz + e[1] * bw * s, y + 0.18), P(fx + e[0] * bw * s, fz + e[1] * bw * s, y + 0.18), P(fx + e[0] * bw * s, fz + e[1] * bw * s, y + 1.2), P(sx + e[0] * bw * s, sz + e[1] * bw * s, y + 1.2), [e[0] * s, 0, e[1] * s], trim, st, st, st, st);
          }
        }
      }
    }
  } else if (kind === 3) parapet(G, ring, h, 1.2, trim, code(PART.trim));
  return kind;
}

export function buildGenericBuildings(geo, track, skipIds, pit = null) {
  const cells = new Map(), rings = [], kinds = [0, 0, 0, 0, 0], samples = [[], [], [], [], []];   // (samples: a few of each kind, for the tools)
  let count = 0, dropped = 0;
  for (const b of geo.buildings) {
    if (skipIds.has(b.id)) continue;
    const ring0 = b.rings[0];
    if (!ring0 || ring0.length < 4 || Math.abs(ringArea(ring0)) < 12) continue;
    // never let a footprint overlap the circuit or the pit lane
    if (ringTouchesCorridor(ring0, track, pit)) { dropped++; continue; }
    rings.push(ring0);
    const rs = b.rings.map(cleanRing).filter((r, i) => r.length >= 3 && (i === 0 || Math.abs(sArea(r)) > 1)); if (!rs.length || rs[0].length < 3) continue;
    const minLevel = parseFloat(b.props['building:min_level']); const yBase = isFinite(minLevel) ? minLevel * 3.5 : 0;
    const h = yBase + Math.max(3.5, b.height - yBase);
    // spatial cell of the footprint (400 m grid): one merged mesh per cell, so cells behind the camera are culled
    let cx = 0, cz = 0; for (const p of ring0) { cx += p[0]; cz += p[1]; } cx /= ring0.length; cz /= ring0.length;
    const key = `${Math.floor(cx / 400)},${Math.floor(cz / 400)}`; if (!cells.has(key)) cells.set(key, new FacadeGeo());
    try { const k = buildOne(cells.get(key), b, rs, yBase, h, { track, pit, style: geo.def.buildingStyle || {} }); kinds[k]++; count++; if (samples[k].length < 8) samples[k].push({ x: cx, z: cz, h, r: Math.sqrt(Math.abs(sArea(rs[0]))) }); } catch (e) { console.warn('[buildings]', b.id, e); }
  }
  const style = geo.def.buildingStyle || {};
  const mat = makeFacadeMaterial({ litProb: style.litProb ?? 0.38 });
  const group = new THREE.Group(); group.name = 'buildings'; group.material = mat;   // shared material (uTime is driven from main)
  for (const G of cells.values()) if (G.p.length) group.add(new THREE.Mesh(G.geometry(), mat));
  group.userData.count = count; group.userData.dropped = dropped; group.userData.rings = rings; group.userData.cells = cells.size; group.userData.kinds = kinds; group.userData.samples = samples;   // kept footprints (grandstand placement avoids them)
  return group;
}
