// Track lighting at night. Every floodlight mast on the circuit and the Sphere (an AREA light: four panels around its
// shell throwing the show's colour as a broad glow) are baked into a world-space light field that lights the still
// world (FLOOD, below); the cars also get a small pool of real SpotLights parked on whichever masts are nearest the
// camera every frame, for the highlights in their paint. Everything is switched off in daylight.
import * as THREE from 'three';
import { SPHERE_SEQUENCE, SHOW_SECONDS } from './SphereShow.js';

/** average glow colour of each Sphere show (drives the light it throws onto the track and the cars) */
const SHOW_GLOW = {
  eyeball: [0.85, 0.75, 0.7], planet: [0.25, 0.45, 0.9], smiley: [1.0, 0.72, 0.15], basketball: [1.0, 0.5, 0.12], sign: [0.45, 0.3, 0.9],
  lava: [1.0, 0.35, 0.08], helmet: [0.85, 0.85, 0.95], broadcast: [0.5, 0.5, 0.6], marquee: [1.0, 0.25, 0.4], clouds: [0.35, 0.6, 1.0], off: [0, 0, 0],
};
const SPOT_I = 900, SPOT_ANGLE = Math.PI / 2.3, SPOT_PEN = 0.6, SPOT_RANGE = 95;

// ---- baked light for everything that stands still ---------------------------------------------------------------
// Every lit pixel of every material pays for every light in the scene (8 floodlight spots, the Sphere's 4 area
// lights): on an integrated GPU that was most of a night frame, and nearly all of those pixels are road, run-off,
// barriers and buildings that never move. So the world's materials do not loop over those lights at all: what all the
// masts on the circuit (not just the 8 nearest) and the Sphere throw onto any point is baked once per circuit into a
// world-space field - per texel the light's irradiance vector V = sum(E_i * L_i) (L_i the unit vector to light i, E_i
// what it delivers there: cone, inverse square and cutoff exactly as three.js computes them), at the ground and 14 m
// up. Lit by one light along V with strength |V|, a surface facing the lights gets exactly the diffuse light of all of
// them (sum(E_i * dot(N, L_i)) = dot(N, V)), with one specular highlight for the lot. The cars, which move under the
// lights and show every highlight in their paint, keep the real SpotLights on the nearest masts; the Sphere's glow
// reaches them from the baked field too (its area lights are never in the scene, so nothing recompiles when the camera
// comes near it or goes away).
const FLOOD_Y = 14;
export const FLOOD = {
  floodOn: { value: 0 }, floodA: { value: null }, floodB: { value: null }, floodMin: { value: new THREE.Vector2() }, floodInv: { value: new THREE.Vector2() },
  floodColor: { value: new THREE.Color(0xfff1d6) }, floodY0: { value: 0 }, floodDY: { value: FLOOD_Y },
  sphA: { value: null }, sphB: { value: null }, sphMin: { value: new THREE.Vector2() }, sphInv: { value: new THREE.Vector2() }, sphColor: { value: new THREE.Color(0, 0, 0) },
};
const FLOOD_PARS = 'uniform float floodOn; uniform sampler2D floodA, floodB, sphA, sphB; uniform vec2 floodMin, floodInv, sphMin, sphInv; uniform vec3 floodColor, sphColor; uniform float floodY0, floodDY; varying vec3 vFloodW;';
/** the fragment code added after the scene's lights: the baked fields, each as one light (the floodlights only for the
 *  still world: a car has the real ones) */
const floodFrag = (world) => `
{
  IncidentLight fl; fl.visible = true;
  float fk = clamp( ( vFloodW.y - floodY0 ) / floodDY, 0.0, 1.0 );
  ${world ? `if ( floodOn > 0.5 ) {
    vec2 fuv = ( vFloodW.xz - floodMin ) * floodInv;
    vec3 fv = ( viewMatrix * vec4( mix( texture2D( floodA, fuv ).xyz, texture2D( floodB, fuv ).xyz, fk ), 0.0 ) ).xyz;
    float fm = length( fv );
    if ( fm > 1e-4 ) { fl.direction = fv / fm; fl.color = floodColor * fm; RE_Direct( fl, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight ); }
  }` : ''}
  vec2 suv = ( vFloodW.xz - sphMin ) * sphInv;
  if ( sphColor != vec3( 0.0 ) && suv.x > 0.0 && suv.y > 0.0 && suv.x < 1.0 && suv.y < 1.0 ) {
    vec3 sv = ( viewMatrix * vec4( mix( texture2D( sphA, suv ).xyz, texture2D( sphB, suv ).xyz, fk ), 0.0 ) ).xyz;
    float sm = length( sv );
    if ( sm > 1e-4 ) { fl.direction = sv / sm; fl.color = sphColor * sm; RE_Direct( fl, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight ); }
  }
}
`;
const FLOOD_VERT = `
vec4 floodP = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
floodP = batchingMatrix * floodP;
#endif
#ifdef USE_INSTANCING
floodP = instanceMatrix * floodP;
#endif
vFloodW = ( modelMatrix * floodP ).xyz;
`;
/** three.js's light loop with the spot lights compiled out (its light counts are written into the code after
 *  onBeforeCompile, so the loop's own condition is what is switched off) */
let noSpots = null;
const NO_SPOTS = () => {
  if (noSpots) return noSpots;
  const c = THREE.ShaderChunk.lights_fragment_begin, key = '#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )';
  if (!c.includes(key)) console.warn('[lights] spot loop not found: the still world keeps the real spot lights');
  return (noSpots = c.replace(key, '#if 0'));
};
const FLOODLIT = new WeakSet();
/** a material of the still world: lit by the baked fields instead of the scene's spot lights (car: keeps them, and only
 *  takes the Sphere's glow from its field) */
export function floodlit(mat, car = false) {
  if (!mat || FLOODLIT.has(mat) || !(mat.isMeshStandardMaterial || mat.isMeshLambertMaterial || mat.isMeshPhongMaterial)) return;
  FLOODLIT.add(mat);
  const prev = mat.onBeforeCompile, pk = mat.customProgramCacheKey, ps = prev ? prev.toString() : '';
  mat.onBeforeCompile = function (sh, r) {
    prev?.call(this, sh, r);
    Object.assign(sh.uniforms, FLOOD);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vFloodW;').replace('#include <project_vertex>', '#include <project_vertex>' + FLOOD_VERT);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + FLOOD_PARS)
      .replace('#include <lights_fragment_begin>', (car ? THREE.ShaderChunk.lights_fragment_begin : NO_SPOTS()) + floodFrag(!car));
  };
  mat.customProgramCacheKey = function () { return (pk === THREE.Material.prototype.customProgramCacheKey ? ps : pk.call(this)) + (car ? '|sph' : '|flood'); };
  mat.needsUpdate = true;
}
/** every lit material under root (the world as built; a car - userData.isCar - keeps the real floodlights) */
export function floodlitAll(root) {
  const walk = (o, car) => { car = car || !!o.userData.isCar; if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) floodlit(m, car); for (const k of o.children) walk(k, car); };
  walk(root, false);
}

/** a half-float RGBA field texture from xyz vectors (w x h) */
function fieldTexture(v, w, h) {
  const d = new Uint16Array(w * h * 4);
  for (let i = 0, j = 0; i < w * h; i++, j += 3) { d[i * 4] = THREE.DataUtils.toHalfFloat(v[j]); d[i * 4 + 1] = THREE.DataUtils.toHalfFloat(v[j + 1]); d[i * 4 + 2] = THREE.DataUtils.toHalfFloat(v[j + 2]); d[i * 4 + 3] = 0; }
  const t = new THREE.DataTexture(d, w, h, THREE.RGBAFormat, THREE.HalfFloatType);
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.generateMipmaps = false; t.needsUpdate = true;
  return t;
}
const smoothstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export class TrackLights {
  /**
   * @param scene
   * @param masts [{x,y,z,tx,tz}] mast head positions + aim points (from buildTrackMeshes)
   * @param sphere { center: Vector3 (shell centre), radius } or null
   */
  constructor(scene, masts, sphere, count = 10) {
    this.masts = masts; this.spots = []; this.day = false;
    for (let i = 0; i < count; i++) {
      const s = new THREE.SpotLight(0xfff1d6, SPOT_I, SPOT_RANGE, SPOT_ANGLE, SPOT_PEN, 2);   // wide, overlapping pools: an evenly floodlit road
      s.castShadow = false; scene.add(s); scene.add(s.target); this.spots.push(s);
    }
    this.rects = []; this.sphereBase = 5.5; this.sphere = sphere;
    if (sphere) {
      // (the four panels are only the shape of the glow for the bake: never added to the scene)
      const { center: c, radius: r } = sphere;
      for (let k = 0; k < 4; k++) {
        const a = k * Math.PI / 2;
        const l = new THREE.RectAreaLight(0xffffff, 0, r * 1.7, r * 1.1);
        l.position.set(c.x + Math.cos(a) * r * 0.92, c.y - r * 0.15, c.z + Math.sin(a) * r * 0.92);
        l.lookAt(c.x + Math.cos(a) * (r + 200), c.y - r * 0.15 - 60, c.z + Math.sin(a) * (r + 200));   // facing outward and slightly down
        this.rects.push(l);
      }
    }
    this._tmp = new THREE.Color();
    this.bake(); FLOOD.floodOn.value = FLOOD.floodA.value ? 1 : 0;
  }

  /** the baked fields (see FLOOD): every mast's spot, and the Sphere's four panels */
  bake() {
    const t0 = performance.now(), m = this.masts || [];
    for (const k of ['floodA', 'floodB', 'sphA', 'sphB']) { FLOOD[k].value?.dispose(); FLOOD[k].value = null; }
    const layers = [0, FLOOD_Y];
    if (m.length) {
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (const p of m) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); }
      x0 -= SPOT_RANGE + 10; z0 -= SPOT_RANGE + 10; x1 += SPOT_RANGE + 10; z1 += SPOT_RANGE + 10;
      const cell = Math.max(2, Math.max(x1 - x0, z1 - z0) / 1400), w = Math.ceil((x1 - x0) / cell) + 1, h = Math.ceil((z1 - z0) / cell) + 1;
      const coneCos = Math.cos(SPOT_ANGLE), penCos = Math.cos(SPOT_ANGLE * (1 - SPOT_PEN));
      const tex = layers.map((y) => {
        const v = new Float32Array(w * h * 3);
        for (const p of m) {
          // the spot's axis: from its aim point on the ground up to the lamp (three.js's spotLight.direction)
          let ax = p.x - p.tx, ay = p.y, az = p.z - p.tz; const al = Math.hypot(ax, ay, az) || 1; ax /= al; ay /= al; az /= al;
          const i0 = Math.max(0, Math.floor((p.x - SPOT_RANGE - x0) / cell)), i1 = Math.min(w - 1, Math.ceil((p.x + SPOT_RANGE - x0) / cell));
          const j0 = Math.max(0, Math.floor((p.z - SPOT_RANGE - z0) / cell)), j1 = Math.min(h - 1, Math.ceil((p.z + SPOT_RANGE - z0) / cell));
          for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
            const lx = p.x - (x0 + i * cell), ly = p.y - y, lz = p.z - (z0 + j * cell), d = Math.hypot(lx, ly, lz);
            if (d >= SPOT_RANGE || d < 1e-3) continue;
            const nx = lx / d, ny = ly / d, nz = lz / d, sp = smoothstep(coneCos, penCos, nx * ax + ny * ay + nz * az); if (sp <= 0) continue;
            const r = d / SPOT_RANGE, cut = Math.max(0, 1 - r * r * r * r), E = SPOT_I * sp / Math.max(d * d, 0.01) * cut * cut;
            const o = (j * w + i) * 3; v[o] += E * nx; v[o + 1] += E * ny; v[o + 2] += E * nz;
          }
        }
        return fieldTexture(v, w, h);
      });
      FLOOD.floodA.value = tex[0]; FLOOD.floodB.value = tex[1];
      FLOOD.floodMin.value.set(x0 - cell / 2, z0 - cell / 2); FLOOD.floodInv.value.set(1 / (w * cell), 1 / (h * cell));
    }
    if (this.rects.length) {
      // each panel as 4 x 4 patches near it (a point further away), one-sided, outward: E = cos(at the panel) dA / d^2
      const R = 900, cell = 6, n = Math.ceil(2 * R / cell) + 1, c = this.sphere.center, sx0 = c.x - R, sz0 = c.z - R;
      const panels = this.rects.map((l) => {
        l.updateMatrixWorld(true); const e = l.matrixWorld.elements, X = [e[0], e[1], e[2]], Y = [e[4], e[5], e[6]], Zf = [-e[8], -e[9], -e[10]];
        const pts = []; for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) { const u = ((a + 0.5) / 4 - 0.5) * l.width, w = ((b + 0.5) / 4 - 0.5) * l.height; pts.push([l.position.x + X[0] * u + Y[0] * w, l.position.y + X[1] * u + Y[1] * w, l.position.z + X[2] * u + Y[2] * w]); }
        return { p: l.position.clone(), n: Zf, A: l.width * l.height, pts, size: Math.max(l.width, l.height) };
      });
      const tex = layers.map((y) => {
        const v = new Float32Array(n * n * 3);
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
          const qx = sx0 + i * cell, qz = sz0 + j * cell; let vx = 0, vy = 0, vz = 0;
          for (const P of panels) {
            const near = Math.hypot(P.p.x - qx, P.p.y - y, P.p.z - qz) < 3 * P.size, pts = near ? P.pts : [[P.p.x, P.p.y, P.p.z]], dA = P.A / pts.length;
            for (const q of pts) {
              const lx = q[0] - qx, ly = q[1] - y, lz = q[2] - qz, d2 = lx * lx + ly * ly + lz * lz, d = Math.sqrt(d2);
              const cp = -(P.n[0] * lx + P.n[1] * ly + P.n[2] * lz) / d; if (cp <= 0) continue;
              const E = cp * dA / Math.max(d2, 1); vx += E * lx / d; vy += E * ly / d; vz += E * lz / d;
            }
          }
          const o = (j * n + i) * 3; v[o] = vx; v[o + 1] = vy; v[o + 2] = vz;
        }
        return fieldTexture(v, n, n);
      });
      FLOOD.sphA.value = tex[0]; FLOOD.sphB.value = tex[1];
      FLOOD.sphMin.value.set(sx0 - cell / 2, sz0 - cell / 2); FLOOD.sphInv.value.set(1 / (n * cell), 1 / (n * cell));
    } else FLOOD.sphColor.value.setRGB(0, 0, 0);
    console.info(`[lights] baked ${m.length} floodlights${this.rects.length ? ' and the Sphere' : ''} in ${(performance.now() - t0).toFixed(0)} ms`);
  }

  /**
   * Daylight: the lights are taken out of the scene's lighting altogether (an invisible light is not compiled into
   * the shaders; one at zero intensity still costs its loop on every lit pixel).
   */
  setDay(day) {
    this.day = day; for (const s of this.spots) s.visible = !day;
    FLOOD.floodOn.value = day || !FLOOD.floodA.value ? 0 : 1; if (day) FLOOD.sphColor.value.setRGB(0, 0, 0);
  }
  /** remove every light from the scene (the world is being unloaded for another track) */
  dispose(scene) {
    for (const s of this.spots) { scene.remove(s); scene.remove(s.target); } this.spots = []; this.rects = [];
    for (const k of ['floodA', 'floodB', 'sphA', 'sphB']) { FLOOD[k].value?.dispose(); FLOOD[k].value = null; } FLOOD.floodOn.value = 0; FLOOD.sphColor.value.setRGB(0, 0, 0);
  }

  /** @param camPos camera position; @param t sphere show time (simTime) */
  update(camPos, t) {
    if (this.day) return;
    // nearest masts to the camera get the lights (insertion into fixed scratch arrays: no per-frame allocation)
    const m = this.masts; const n = this.spots.length;
    if (!this._bd) { this._bd = new Float64Array(n).fill(Infinity); this._bi = new Int32Array(n).fill(-1); }
    const bd = this._bd, bi = this._bi; bd.fill(Infinity); bi.fill(-1);
    for (let i = 0; i < m.length; i++) {
      const d = (m[i].x - camPos.x) ** 2 + (m[i].z - camPos.z) ** 2;
      if (d >= bd[n - 1]) continue;
      let k = n - 1; while (k > 0 && bd[k - 1] > d) { bd[k] = bd[k - 1]; bi[k] = bi[k - 1]; k--; } bd[k] = d; bi[k] = i;
    }
    for (let k = 0; k < n; k++) {
      const s = this.spots[k]; if (bi[k] < 0) { s.intensity = 0; continue; }
      const mm = m[bi[k]]; s.position.set(mm.x, mm.y, mm.z); s.target.position.set(mm.tx, 0, mm.tz); s.target.updateMatrixWorld();
      s.intensity = SPOT_I;
    }
    if (this.rects.length) {
      // same show timing as the shader: 24 s per show, 3 s crossfade at the end of each
      const L = SPHERE_SEQUENCE.length; const tt = isFinite(t) && t > 0 ? t : 0; const cyc = tt % (L * SHOW_SECONDS); const k = Math.floor(cyc / SHOW_SECONDS); const tin = cyc - k * SHOW_SECONDS;
      const x = Math.max(0, Math.min(1, (tin - 21) / 3)); const blend = x * x * (3 - 2 * x);
      const a = SHOW_GLOW[SPHERE_SEQUENCE[k]], b = SHOW_GLOW[SPHERE_SEQUENCE[(k + 1) % L]];
      this._tmp.setRGB(a[0] + (b[0] - a[0]) * blend, a[1] + (b[1] - a[1]) * blend, a[2] + (b[2] - a[2]) * blend);
      const lum = 0.3 * this._tmp.r + 0.6 * this._tmp.g + 0.1 * this._tmp.b;
      const I = lum > 0.01 ? this.sphereBase * Math.min(1, lum + 0.25) : 0;
      FLOOD.sphColor.value.copy(this._tmp).multiplyScalar(I);   // (the baked glow: on everything, at any distance)
    }
  }
}
