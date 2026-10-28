// Generic building extrusion (footprint polygons -> merged mesh) with a
// procedural "lit windows" facade shader. Also exports the shader factory for landmarks.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
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
          vec3 pane = uDayGlass * (0.55 + 0.6 * lam + 0.25 * hash(cell + 2.7)) * (0.9 + 0.2 * hash(cell + 9.1));
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

/**
 * Builds the merged generic-building mesh. `skipIds` are footprints claimed by the landmark engine.
 * Footprints whose bounding circle overlaps the track corridor are dropped (OSM noise / construction).
 */
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

export function buildGenericBuildings(geo, track, skipIds, pit = null) {
  const geos = []; const rings = [];
  let count = 0, dropped = 0;
  for (const b of geo.buildings) {
    if (skipIds.has(b.id)) continue;
    const ring = b.rings[0];
    if (!ring || ring.length < 4 || Math.abs(ringArea(ring)) < 12) continue;
    // never let a footprint overlap the circuit or the pit lane
    if (ringTouchesCorridor(ring, track, pit)) { dropped++; continue; }
    rings.push(ring);
    const minLevel = parseFloat(b.props['building:min_level']); const yBase = isFinite(minLevel) ? minLevel * 3.5 : 0;
    const h = Math.max(3.5, b.height - yBase);
    const g = extrudeFootprint(b.rings, h, yBase);
    if (!g) continue;
    // per-building slate tint
    const t = 0.8 + Math.random() * 0.4; const tint = [t * (0.9 + Math.random() * 0.15), t, t * (1.05 + Math.random() * 0.1)];
    const n = g.getAttribute('position').count; const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { col[i * 3] = tint[0]; col[i * 3 + 1] = tint[1]; col[i * 3 + 2] = tint[2]; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    // spatial cell of the footprint (400 m grid): one merged mesh per cell, so cells behind the camera are culled
    let cx = 0, cz = 0; for (const p of ring) { cx += p[0]; cz += p[1]; } cx /= ring.length; cz /= ring.length;
    g.userData.cell = `${Math.floor(cx / 400)},${Math.floor(cz / 400)}`;
    geos.push(g); count++;
  }
  const style = geo.def.buildingStyle || {};
  const mat = makeWindowMaterial({ base: style.base ?? 0x2b303b, litProb: style.litProb ?? 0.38, cellW: style.cellW ?? 4.0, cellH: style.cellH ?? 3.5, useVertexColor: true });
  const group = new THREE.Group(); group.name = 'buildings'; group.material = mat;   // shared material (uTime is driven from main)
  const cells = new Map(); for (const g of geos) { const k = g.userData.cell; if (!cells.has(k)) cells.set(k, []); cells.get(k).push(g); }
  for (const gs of cells.values()) { const mesh = new THREE.Mesh(mergeGeometries(gs, false), mat); mesh.geometry.computeBoundingSphere(); group.add(mesh); }
  group.userData.count = count; group.userData.dropped = dropped; group.userData.rings = rings; group.userData.cells = cells.size;   // kept footprints (grandstand placement avoids them)
  return group;
}
