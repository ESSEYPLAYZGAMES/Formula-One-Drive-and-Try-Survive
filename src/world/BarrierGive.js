// The barriers' give, drawn: where a car presses into a tyre wall, a SAFER / TecPro wall or Armco (vehicle/Car.js
// BARRIER), the panels round it are pushed back with it - linked, as the blocks of a TecPro run are, the deepest at the
// car and easing out over a few metres either side - and spring back over a second and a half once it has gone. No
// mesh is changed: the barrier materials' vertex shaders move their vertices by the dents the physics writes
// (Car.js GIVE_DENTS, 8 at a time). Concrete never gives, so its panels never move.
import * as THREE from 'three';
import { GIVE_DENTS } from '../vehicle/Car.js';

const N = 8, REACH = 3.2, BACK = 1.5;   // (dents at a time; how far along the barrier a dent reaches (m); how long it takes to spring back (s))
const U = { uGiveA: { value: Array.from({ length: N }, () => new THREE.Vector4()) }, uGiveB: { value: Array.from({ length: N }, () => new THREE.Vector4()) } };
let ver = -1, tLast = -1;

/**
 * A barrier material that gives: its vertices pushed back by the dents (once per material). blocks: solid blocks
 * (TecPro, track/TrackBuilder.js tecproBlocks) whose vertices carry aGive - 1 on the face a car presses, ~0.1 at the
 * back: the face goes back, the back stays, and what is squashed bulges up a little.
 */
export function giveMaterial(mat, { blocks = false } = {}) {
  if (!mat || mat.userData.give) return mat;
  mat.userData.give = true;
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    prev?.(sh, r);
    sh.uniforms.uGiveA = U.uGiveA; sh.uniforms.uGiveB = U.uGiveB;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\nuniform vec4 uGiveA[${N}];\nuniform vec4 uGiveB[${N}];${blocks ? '\nattribute float aGive;' : ''}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      {
        // (the barrier meshes are laid in world coordinates: position is the world point)
        vec2 gp = transformed.xz; float gk = ${blocks ? 'aGive' : '1.0'}, gy = transformed.y;
        for (int i = 0; i < ${N}; i++) {
          vec4 a = uGiveA[i]; vec4 b = uGiveB[i];
          if (b.x <= 0.0) continue;
          vec2 d = gp - a.xy; float across = dot(d, a.zw);
          if (across > 0.6 || across < -1.8) continue;                  // (the barrier's own face and what stands behind it, not one across the road)
          float along = length(d - across * a.zw), w = exp(-along * along / ${(REACH * REACH).toFixed(2)}), sq = b.x * b.y * w;
          transformed.xz -= a.zw * (sq * gk);                              // (pushed back, away from the road)
          ${blocks ? 'transformed.y += sq * 0.22 * smoothstep(0.5, 1.1, gy) * (1.0 - 0.6 * gk) * step(0.2, gk);   // (squashed: the top bulges)' : ''}
        }
      }`);
  };
  mat.customProgramCacheKey = () => (blocks ? 'giveB' : 'give') + (mat.type || '');
  mat.needsUpdate = true;
  return mat;
}

/** the dents for this frame (time: the race clock the physics stamps them with) */
export function updateGive(time) {
  if (ver === GIVE_DENTS.ver && time === tLast) return;
  ver = GIVE_DENTS.ver; tLast = time;
  const a = GIVE_DENTS.a;
  for (let k = 0; k < N; k++) {
    const o = k * 8, end = a[o + 5];
    // (while the car is in it: all of it; after: springing back - a tyre wall a little slower than it went in)
    const f = end < 0 ? 1 : time < end ? 0 : Math.max(0, 1 - (time - end) / BACK);
    U.uGiveA.value[k].set(a[o], a[o + 1], a[o + 2], a[o + 3]);
    U.uGiveB.value[k].set(Math.min(1, a[o + 4]), f * f * (3 - 2 * f), 0, 0);
  }
}
