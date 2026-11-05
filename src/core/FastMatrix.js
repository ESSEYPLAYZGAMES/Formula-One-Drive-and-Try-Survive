// three.js recomputes every object's local matrix from its position / rotation / scale, and multiplies it into its world
// matrix, on every frame - for the ~7,500 objects of a race (the stands, the buildings, every part of every car) that
// is the biggest single cost of a frame on the CPU, and most of them never move. Here the same walk does only what has
// changed: an object's local matrix is recomposed when its position, rotation or scale differ from the values it was
// last composed from, and its world matrix is recomputed when that local matrix or its parent's world matrix changed.
// And in the renderer's walk of the whole scene, a level of detail that is not shown (THREE.LOD: a car far off shows its
// simple model, and its ~190-part close model is hidden) is not walked: it is marked out of date, and brought up to date
// the moment it is shown again (LOD.update, inside the render, before it is drawn). A direct call - the game's own
// updateMatrixWorld(true) before it reads a part's position - still walks everything.
// The matrices drawn are exactly the ones three.js would have computed (the same arithmetic on the same values), so
// nothing drawn changes; only work whose result would be identical, or never be seen, is skipped.
//   (three.js's own rule, kept: an object with matrixAutoUpdate false keeps the matrix it was given; matrixWorldNeedsUpdate
//    or a parent that moved still forces the world matrix; a matrix changed by hand on an object that updates its own is
//    replaced as before - its position / rotation / scale are what count.)
import * as THREE from 'three';

const P = THREE.Object3D.prototype, orig = P.updateMatrixWorld;
// (the renderer's own walk starts at the scene: only inside it are hidden levels of detail left out)
let sceneWalk = false;
const walk = function (force) {
  if (this.isScene === true && !sceneWalk) { sceneWalk = true; try { walk.call(this, force); } finally { sceneWalk = false; } return; }
  if (this.matrixAutoUpdate) {
    const p = this.position, q = this.quaternion, s = this.scale;
    let c = this._trs;
    if (c === undefined || c === null || c[0] !== p.x || c[1] !== p.y || c[2] !== p.z || c[3] !== q._x || c[4] !== q._y || c[5] !== q._z || c[6] !== q._w || c[7] !== s.x || c[8] !== s.y || c[9] !== s.z) {
      if (!c) this._trs = new Float64Array(10);
      this.updateMatrix();   // (records the values it composed from, below; sets matrixWorldNeedsUpdate)
    }
  } else if (this._trs) this._trs = null;   // (its matrix is its own now: composed afresh if it ever updates itself again)
  if (this.matrixWorldNeedsUpdate || force) {
    if (this.matrixWorldAutoUpdate === true) {
      if (this.parent === null) this.matrixWorld.copy(this.matrix);
      else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
    }
    this.matrixWorldNeedsUpdate = false;
    force = true;
  }
  const children = this.children;
  if (this.isLOD === true && sceneWalk) {
    // (the levels not shown: left for when they are)
    for (let i = 0, l = children.length; i < l; i++) {
      const c = children[i];
      if (c.visible) { c._lodStale = false; c.updateMatrixWorld(force); } else { c._lodStale = true; if (force) c.matrixWorldNeedsUpdate = true; }
    }
    return;
  }
  for (let i = 0, l = children.length; i < l; i++) children[i].updateMatrixWorld(force);
};
P.updateMatrixWorld = walk;
// a level shown this frame that was left out of the walk: brought up to date before the renderer draws it
const lodUpdate = THREE.LOD.prototype.update;
THREE.LOD.prototype.update = function (camera) {
  lodUpdate.call(this, camera);
  const L = this.levels;
  for (let i = 0; i < L.length; i++) { const o = L[i].object; if (o.visible && o._lodStale) { o._lodStale = false; o.updateMatrixWorld(false); } }
};
// (updateMatrix() called directly - three.js's own helpers, the game's code - composes from the current values: the next
//  walk compares against what it composed, so it must know)
const updateMatrix = P.updateMatrix;
P.updateMatrix = function () {
  updateMatrix.call(this);
  const c = this._trs;
  if (c) { const p = this.position, q = this.quaternion, s = this.scale; c[0] = p.x; c[1] = p.y; c[2] = p.z; c[3] = q._x; c[4] = q._y; c[5] = q._z; c[6] = q._w; c[7] = s.x; c[8] = s.y; c[9] = s.z; }
};
/** (imported by main.js before anything is built: the patch above is in place from the first frame) */
export const FAST_MATRIX = true;
/** (tests - tools/regress.mjs: three.js's own walk back for a frame, to compare the pictures from the same state) */
export function fastMatrix(on) { P.updateMatrixWorld = on ? walk : orig; }
