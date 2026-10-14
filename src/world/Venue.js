// Permanent-circuit venue pieces taken straight from the OSM footprints: the pit building (Silverstone's Wing) and
// the real grandstands. Returns the ids it claims (so the generic extruder skips them), the grandstand placements
// for Grandstands.js and the footprints that the run-off layout must not run into.
import * as THREE from 'three';
import { footprintInfo, ringCentroid } from '../core/GeoLoader.js';
import { corridorSigned } from '../track/TrackBuilder.js';
import { extrudeFootprint } from './Buildings.js';
import { fitRingOutsideCorridor } from './Landmarks.js';

/** footprints of the venue's grandstands (building=grandstand, plus stands mapped as building=yes by name) */
export function standFootprints(geo, def) {
  const out = [];
  for (const b of geo.buildings) {
    const kind = b.props.building || '';
    const isStand = (def.osmStands && def.osmStands.test(kind)) || (def.standNames && def.standNames.test(b.name));
    if (!isStand || !b.rings[0] || b.rings[0].length < 4) continue;
    out.push(b);
  }
  return out;
}

/**
 * @returns { group, claimed:Set<id>, stands:[{x,z,ex,ez,len,tiers,name}] }
 */
export function buildVenue(geo, track, def, pit) {
  const group = new THREE.Group(); group.name = 'venue';
  const claimed = new Set(); const stands = [];

  // ---- grandstands: an oriented box per footprint, low edge toward the circuit; pushed back if it would touch the corridor
  for (const b of standFootprints(geo, def)) {
    const info = footprintInfo(b.rings[0]); if (info.length < 14 || info.width < 5) continue;
    claimed.add(b.id);
    const ax = Math.cos(info.angle), az = Math.sin(info.angle);            // long axis
    let px = -az, pz = ax;                                                   // across
    const q = track.nearest(info.c[0], info.c[1]); const f = track.sample(q.s);
    const tx = f.x - info.c[0], tz = f.z - info.c[1];
    if (px * tx + pz * tz > 0) { px = -px; pz = -pz; }                       // (px, pz) now points AWAY from the track
    const len = Math.min(info.length, 170), depth = Math.max(8, Math.min(info.width, 24));
    let cx = info.c[0], cz = info.c[1];
    // front edge must clear the barrier by 3 m: slide the stand away from the track until it does (max 40 m)
    for (let k = 0; k < 20; k++) {
      let worst = Infinity;
      for (let u = -len / 2; u <= len / 2; u += 6) worst = Math.min(worst, corridorSigned(track, pit, cx - px * depth / 2 + ax * u, cz - pz * depth / 2 + az * u, 3));
      if (worst >= 0) break; cx += px * 2; cz += pz * 2;
    }
    const tiers = Math.max(4, Math.min(15, Math.round((depth - 1.4) / 1.35)));
    stands.push({ x: cx - px * depth / 2, z: cz - pz * depth / 2, ex: [ax, az], ez: [px, pz], len, tiers, name: b.name });
  }

  // ---- the pit building (the Wing): the real footprint fitted outside the pit corridor, a white body with dark glass
  //      bands and the blade roof rising toward one end
  const wing = def.pitBuilding && geo.buildings.find((b) => b.name === def.pitBuilding);
  if (wing) {
    claimed.add(wing.id);
    const ring = fitRingOutsideCorridor(wing.rings[0], track, pit, 2);
    const g = new THREE.Group(); g.name = 'venue:wing';
    const H = 13;
    const white = new THREE.MeshStandardMaterial({ color: 0xf1f3f6, roughness: 0.4, metalness: 0.15, emissive: 0x1a1c20, emissiveIntensity: 1 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x0b1118, roughness: 0.08, metalness: 0.7, envMapIntensity: 1.4, emissive: 0x2a3340, emissiveIntensity: 0.9 });
    const body = new THREE.Mesh(extrudeFootprint([ring], H), white); body.geometry.computeVertexNormals(); g.add(body);
    const c = ringCentroid(ring); const grown = ring.map((p) => [c[0] + (p[0] - c[0]) * 1.004, c[1] + (p[1] - c[1]) * 1.004]);
    for (const y of [4.2, 8.4]) { const band = new THREE.Mesh(extrudeFootprint([grown], 2.6, y), glass); band.geometry.computeVertexNormals(); g.add(band); }
    // the blade: a thin slab over the building, tilted along its long axis (14 m at one end, ~30 m at the other)
    const info = footprintInfo(ring);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(info.length * 1.04, 0.9, info.width * 1.25), white);
    blade.rotation.order = 'YZX'; blade.rotation.y = -info.angle; blade.rotation.z = Math.atan2(16, info.length);
    blade.position.set(info.c[0], H + 9, info.c[1]); g.add(blade);
    for (const u of [-0.42, -0.14, 0.14, 0.42]) {   // struts under the blade
      const h = 9 + u * 16; const s = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, Math.max(1, h), 8), white);
      s.position.set(info.c[0] + Math.cos(info.angle) * info.length * u, H + Math.max(1, h) / 2, info.c[1] + Math.sin(info.angle) * info.length * u); g.add(s);
    }
    g.userData.ring = ring; group.add(g);
  }
  return { group, claimed, stands };
}
