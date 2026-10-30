// People: drivers, team staff, marshals - for the news broadcast after a bad accident (ui/NewsBroadcast.js): the grid
// taking a knee, the interviews in front of the garages. A body shaped between the joints of a pose, proportioned by its
// build (a driver's athletic V, her slim figure, a mechanic's broad frame) - a torso lofted through its sections (hips,
// waist, chest, the trapezius up to the neck; a woman's bust and waist), limbs following their muscles (a deltoid capping
// each shoulder, a calf), hands, shoes on their soles - merged into one mesh per material, shaded by each vertex (a crease,
// a sole) and lit warm at the skin's edges; the head is its own group so it can nod and bow: one sculpted surface, its
// face painted on (almond eyes, brows, lips, a man's shaving shadow - kept per face). Facing +x, feet on y = 0. Also a
// helmet (the mourning screen).
// The guests on the grid before a start as well (ui/PreRace.js, ui/GridWalk.js) and in the hangouts (ui/Hangout.js): a
// woman's figure (o.figure 'f') in her own clothes (OUTFITS: gowns, slip and wrap dresses, a knit dress, a tennis dress, a
// trench coat, a jumpsuit, a trouser suit, a blazer, a co-ord, a leather or a bomber jacket over jeans, knitwear, a track
// top, a T-shirt; for an evening, a fitted mini, a gown slit to the thigh, a backless halter, off the shoulder, a corset
// bodice, a cropped top over a high waist, sequins) with her hair worn long (in locks, falling over the shoulders and down the back - those near the head
// turning with it), in a bob, a ponytail, a bun or a pixie cut; sunglasses, a pass, a watch, a clutch. And a scuffle on
// the grid (ui/Brawl.js): squared up with open hands, a two-handed shove, knocked back a step, holding someone back, being
// held - and the arm you shove with, seen from your own eyes (shoveArm). Nobody here ever makes a fist.
import * as THREE from 'three';
import { helmetDesign, helmetTexture } from './HelmetDesigns.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { fabricOn } from './Fabric.js';
import { midriff, waistband, shellOut, bralette, bindHoles, hemY as clubHemY, BAND_NECKS, frontKnot, napeBow } from './Clubwear.js';
import * as SW from './Swimwear.js';
import { laceSheer, laceEdgeMat, laceOn, liningOf, lacePiece, laceHem, laceTrim, laceOf, laceWaist as laceWaistLit, LACE_OUTFITS, LACE_FINISHES } from './Lace.js';

const SKIN = ['#f1d2b6', '#e3b994', '#cf9a72', '#a8714b', '#7a4e33', '#563522'];
const HAIR = ['#17110d', '#2b1d14', '#4a3222', '#6b4a2b', '#141414', '#8a6a44'];
/**
 * The F1 drivers as they look: skin tone, hair colour, and the shape of it all - hs: hair style (short, buzz, quiff,
 * swept, side, curly, wavy, locs, mullet), fh: facial hair (stubble, beard, mustache), len / wid: the face longer or
 * shorter, wider or narrower (1 = average), jaw: how much it narrows to the chin (0.22 average). Anyone else: picked
 * from their name, the same every time.
 */
export const DRIVER_LOOKS = {
  'Lando Norris': ['#f0cfb2', '#4a3222', { hs: 'quiff', len: 0.97, wid: 1.03, jaw: 0.17 }],
  'Oscar Piastri': ['#f1d2b6', '#2b1d14', { hs: 'swept', len: 1.05, wid: 0.96, jaw: 0.25 }],
  'George Russell': ['#f1d2b6', '#4a3222', { hs: 'side', len: 1.07, wid: 0.97, jaw: 0.2 }],
  'Kimi Antonelli': ['#ecc7a6', '#17110d', { hs: 'wavy', len: 0.98, wid: 1.0, jaw: 0.24 }],
  'Max Verstappen': ['#f1d2b6', '#6b4a2b', { hs: 'short', fh: 'stubble', len: 1.0, wid: 1.04, jaw: 0.16 }],
  'Isack Hadjar': ['#d6a47c', '#17110d', { hs: 'curly', fh: 'mustache', len: 1.0, wid: 0.98, jaw: 0.24 }],
  'Charles Leclerc': ['#f0cfb2', '#4a3222', { hs: 'swept', len: 1.03, wid: 0.98, jaw: 0.24 }],
  'Lewis Hamilton': ['#8d5a3b', '#141414', { hs: 'locs', fh: 'beard', len: 1.02, wid: 1.0, jaw: 0.2 }],
  'Carlos Sainz': ['#e6bb95', '#17110d', { hs: 'side', fh: 'beard', len: 1.03, wid: 1.0, jaw: 0.19 }],
  'Alexander Albon': ['#e3b994', '#141414', { hs: 'short', len: 0.98, wid: 1.02, jaw: 0.21 }],
  'Liam Lawson': ['#f1d2b6', '#8a6a44', { hs: 'swept', len: 1.02, wid: 0.99, jaw: 0.23 }],
  'Arvid Lindblad': ['#cf9a72', '#141414', { hs: 'short', len: 1.0, wid: 1.0, jaw: 0.23 }],
  'Fernando Alonso': ['#e3b994', '#17110d', { hs: 'short', fh: 'stubble', len: 1.02, wid: 1.0, jaw: 0.21 }],
  'Lance Stroll': ['#f1d2b6', '#4a3222', { hs: 'short', fh: 'stubble', len: 1.03, wid: 1.02, jaw: 0.19 }],
  'Esteban Ocon': ['#f1d2b6', '#2b1d14', { hs: 'short', len: 1.08, wid: 0.95, jaw: 0.24 }],
  'Oliver Bearman': ['#f1d2b6', '#4a3222', { hs: 'quiff', len: 0.98, wid: 1.03, jaw: 0.19 }],
  'Nico Hulkenberg': ['#f1d2b6', '#a88458', { hs: 'short', fh: 'stubble', len: 1.04, wid: 1.02, jaw: 0.17 }],
  'Gabriel Bortoleto': ['#e8c3a0', '#2b1d14', { hs: 'wavy', len: 1.0, wid: 0.99, jaw: 0.23 }],
  'Pierre Gasly': ['#f0cfb2', '#2b1d14', { hs: 'quiff', fh: 'stubble', len: 1.02, wid: 0.98, jaw: 0.21 }],
  'Franco Colapinto': ['#ecc7a6', '#17110d', { hs: 'swept', len: 1.01, wid: 0.99, jaw: 0.23 }],
  'Valtteri Bottas': ['#f1d2b6', '#b89060', { hs: 'mullet', fh: 'mustache', len: 1.04, wid: 0.98, jaw: 0.2 }],
  'Sergio Perez': ['#d9a77c', '#141414', { hs: 'short', fh: 'stubble', len: 1.0, wid: 1.03, jaw: 0.18 }],
};
const HAIR_STYLES = ['short', 'short', 'swept', 'side', 'quiff', 'buzz', 'wavy'];
/** the game's own pick for a name: { skin, hair, style } - a driver's as they look, anyone else's from the name */
export function baseLook(name) {
  const L = DRIVER_LOOKS[name]; if (L) return { skin: L[0], hair: L[1], style: L[2] || {} };
  let h = 7; for (const ch of String(name || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { skin: SKIN[h % SKIN.length], hair: HAIR[(h >>> 4) % HAIR.length], style: { hs: HAIR_STYLES[(h >>> 8) % HAIR_STYLES.length], fh: [null, null, null, 'stubble', 'beard'][(h >>> 12) % 5] } };
}
// (looks of their own, registered by name - a custom driver's, from the career: career/Avatar.js personOpts, set by the
// hub - { skin, hair, style: { hs, fh, part (1 left, -1 right), iris, len, wid, jaw, chin, cheek, brow, nose }, seed,
// suit: { primary, secondary } | null, stamp }. Never one of the grid's own; a choice left undefined is the name's own
// pick, a null counts (fh: null - clean-shaven))
const DRIVER_REG = new Map();   // (not LOOKS: that is the make-up looks' table further down)
/** name's own look (L: as above; null: none again) -> false for one of the grid's own drivers */
export function setDriverLook(name, L) { if (!name || DRIVER_LOOKS[name]) return false; if (L) DRIVER_REG.set(name, L); else DRIVER_REG.delete(name); return true; }
/** every registered look gone */
export function clearDriverLooks() { DRIVER_REG.clear(); }
/**
 * a registered look's stamp (it changes whenever the look does: what caches of a driver's figure key on) -> '' for none.
 * all: the whole look's, its helmet's design too (a helmet's picture); else the figure's own (pstamp: no figure wears the
 * helmet - its paint changed never rebuilds one)
 */
export const lookStamp = (name, all = false) => { const R = DRIVER_REG.get(name); return (R && (all ? R.stamp : R.pstamp ?? R.stamp)) || ''; };
/** { skin, hair, style, seed, suit, stamp } for a driver by name: a registered look over the name's own pick */
export function lookOf(name) {
  const B = baseLook(name), R = DRIVER_REG.get(name); if (!R) return B;
  const style = { ...B.style }; for (const [k, v] of Object.entries(R.style || {})) if (v !== undefined) style[k] = v;
  return { skin: R.skin || B.skin, hair: R.hair || B.hair, style, seed: R.seed ?? null, suit: R.suit || null, stamp: R.stamp || '' };
}
/** a person's options with their driver's registered look applied: its seed (the small things), its race suit's own colours */
const withLook = (o) => {
  const R = o.driver ? DRIVER_REG.get(o.driver) : null; if (!R) return o;
  const suit = R.suit && (o.kit || 'suit') === 'suit' && o.figure !== 'f';
  return { ...o, seed: o.seed ?? R.seed ?? undefined, ...(suit ? { color: R.suit.primary, accent: R.suit.secondary } : {}) };
};
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
// (segment counts scaled for a lighter person - segQ, a crowd template: world/Crowd.js)
let Q = 1;
const n = (k, min = 3) => Math.max(min, Math.round(k * Q));

/** joints of each pose (right = -z, left = +z) */
const POSES = {
  // one knee down, the other raised; both hands on the raised knee; head bowed
  kneel: () => ({
    pelvis: V(0, 0.56, 0), torsoA: V(0.01, 0.64, 0), torsoB: V(0.1, 0.92, 0), neck: V(0.14, 1.04, 0), head: V(0.2, 1.15, 0), bow: 0.6,
    hipR: V(0, 0.54, -0.1), kneeR: V(0.42, 0.5, -0.12), ankleR: V(0.42, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.54, 0.1), kneeL: V(0.04, 0.07, 0.12), ankleL: V(-0.345, 0.17, 0.12), footL: 'toes',
    shR: V(0.1, 0.98, -0.19), elR: V(0.3, 0.74, -0.21), wrR: V(0.41, 0.58, -0.15),
    shL: V(0.1, 0.98, 0.19), elL: V(0.24, 0.72, 0.21), wrL: V(0.38, 0.6, -0.02),
  }),
  // standing, hands clasped in front, head bowed
  mourn: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.02, 1.34, 0), neck: V(0.04, 1.48, 0), head: V(0.07, 1.6, 0), bow: 0.45,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.02, 0.5, -0.1), ankleR: V(0, 0.09, -0.1), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.02, 0.5, 0.1), ankleL: V(0, 0.09, 0.1), footL: 'flat',
    shR: V(0.01, 1.4, -0.19), elR: V(0.06, 1.14, -0.21), wrR: V(0.19, 0.98, -0.05),
    shL: V(0.01, 1.4, 0.19), elL: V(0.06, 1.14, 0.21), wrL: V(0.19, 0.98, 0.05),
  }),
  // on the podium: both arms up, head up
  cheer: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(-0.01, 1.34, 0), neck: V(-0.01, 1.48, 0), head: V(-0.01, 1.61, 0), bow: -0.12,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.12), ankleR: V(0, 0.09, -0.13), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.12), ankleL: V(0, 0.09, 0.13), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0.03, 1.6, -0.31), wrR: V(0.07, 1.84, -0.25),
    shL: V(0, 1.4, 0.19), elL: V(0.03, 1.6, 0.31), wrL: V(0.07, 1.84, 0.25),
  }),
  // sitting at a table (a 0.48 m chair, the table top at 0.74 m in front): forearms on the table, leaning in a little
  sit: () => ({
    pelvis: V(0, 0.52, 0), torsoA: V(0.01, 0.6, 0), torsoB: V(0.06, 0.88, 0), neck: V(0.08, 1.02, 0), head: V(0.1, 1.15, 0), bow: 0.08,
    hipR: V(0.02, 0.52, -0.1), kneeR: V(0.45, 0.52, -0.12), ankleR: V(0.47, 0.09, -0.13), footR: 'flat',
    hipL: V(0.02, 0.52, 0.1), kneeL: V(0.45, 0.52, 0.12), ankleL: V(0.47, 0.09, 0.13), footL: 'flat',
    shR: V(0.07, 0.94, -0.19), elR: V(0.26, 0.77, -0.24), wrR: V(0.5, 0.79, -0.12),
    shL: V(0.07, 0.94, 0.19), elL: V(0.26, 0.77, 0.24), wrL: V(0.5, 0.79, 0.12),
  }),
  // reaching out to touch something in front at waist height (a car on the grid): the right arm forward, leaning in
  reach: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0.01, 1.04, 0), torsoB: V(0.07, 1.33, 0), neck: V(0.1, 1.46, 0), head: V(0.13, 1.58, 0), bow: 0.3,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.02, 0.5, -0.12), ankleR: V(-0.02, 0.09, -0.14), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.05, 0.5, 0.12), ankleL: V(0.06, 0.09, 0.14), footL: 'flat',
    shR: V(0.06, 1.38, -0.19), elR: V(0.3, 1.2, -0.22), wrR: V(0.55, 1.02, -0.17),
    shL: V(0.06, 1.38, 0.19), elL: V(0.06, 1.12, 0.23), wrL: V(0.1, 0.9, 0.2),
  }),
  // a marshal showing a flag: the right arm up holding the pole, the left at the side
  flag: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.01, 1.34, 0), neck: V(0.02, 1.48, 0), head: V(0.03, 1.61, 0), bow: 0.02,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.12), ankleR: V(0, 0.09, -0.14), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.12), ankleL: V(0, 0.09, 0.14), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0.08, 1.58, -0.27), wrR: V(0.12, 1.8, -0.24),
    shL: V(0, 1.4, 0.19), elL: V(0.02, 1.13, 0.23), wrL: V(0.07, 0.92, 0.2),
  }),
  // filming on a phone held up in the right hand, the left at the side
  phone: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.01, 1.34, 0), neck: V(0.02, 1.48, 0), head: V(0.04, 1.6, 0), bow: 0.05,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0.01, 1.4, -0.19), elR: V(0.2, 1.3, -0.24), wrR: V(0.38, 1.5, -0.12),
    shL: V(0, 1.4, 0.19), elL: V(0.03, 1.13, 0.23), wrL: V(0.07, 0.92, 0.2),
  }),
  // recording on a phone held in both hands in front of the chest (a press officer): standing upright, the shoulders
  // back, only the head bowed a little to its screen - the neck bending to it (buildPerson), no stoop
  record: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.01, 1.34, 0), neck: V(0.02, 1.48, 0), head: V(0.04, 1.6, 0), bow: 0.3,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0.01, 1.4, -0.19), elR: V(0.05, 1.14, -0.215), wrR: V(0.25, 1.13, -0.05),
    shL: V(0.01, 1.4, 0.19), elL: V(0.05, 1.14, 0.215), wrL: V(0.25, 1.13, 0.05),
  }),
  // a photographer: the camera up to the eye in both hands, elbows out
  photo: () => ({
    pelvis: V(0, 0.94, 0), torsoA: V(0.01, 1.02, 0), torsoB: V(0.05, 1.31, 0), neck: V(0.07, 1.44, 0), head: V(0.1, 1.56, 0), bow: 0.05,
    hipR: V(0, 0.91, -0.1), kneeR: V(0.06, 0.5, -0.13), ankleR: V(-0.02, 0.09, -0.15), footR: 'flat',
    hipL: V(0, 0.91, 0.1), kneeL: V(0.06, 0.5, 0.13), ankleL: V(0.08, 0.09, 0.15), footL: 'flat',
    shR: V(0.05, 1.37, -0.19), elR: V(0.2, 1.32, -0.3), wrR: V(0.3, 1.52, -0.08),
    shL: V(0.05, 1.37, 0.19), elL: V(0.22, 1.3, 0.27), wrL: V(0.33, 1.47, 0.07),
  }),
  // hands on the hips, elbows out
  hips: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(-0.01, 1.34, 0), neck: V(0, 1.48, 0), head: V(0.01, 1.61, 0), bow: 0,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.13), ankleR: V(0, 0.09, -0.15), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.13), ankleL: V(0, 0.09, 0.15), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(-0.06, 1.18, -0.33), wrR: V(0.02, 1.0, -0.17),
    shL: V(0, 1.4, 0.19), elL: V(-0.06, 1.18, 0.33), wrL: V(0.02, 1.0, 0.17),
  }),
  // arms folded across the chest
  cross: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0, 1.34, 0), neck: V(0.01, 1.48, 0), head: V(0.02, 1.61, 0), bow: 0.03,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0.14, 1.16, -0.2), wrR: V(0.19, 1.24, 0.12),
    shL: V(0, 1.4, 0.19), elL: V(0.15, 1.19, 0.2), wrL: V(0.2, 1.27, -0.1),
  }),
  // a shoulder-mounted TV camera: the right hand up at the camera's grip, the left steadying it in front
  tvcam: () => ({
    pelvis: V(0, 0.95, 0), torsoA: V(0, 1.03, 0), torsoB: V(0.02, 1.33, 0), neck: V(0.04, 1.46, 0), head: V(0.07, 1.58, 0), bow: 0.03,
    hipR: V(0, 0.92, -0.1), kneeR: V(0.04, 0.5, -0.13), ankleR: V(-0.04, 0.09, -0.15), footR: 'flat',
    hipL: V(0, 0.92, 0.1), kneeL: V(0.06, 0.5, 0.13), ankleL: V(0.1, 0.09, 0.15), footL: 'flat',
    shR: V(0.02, 1.39, -0.19), elR: V(0.12, 1.3, -0.3), wrR: V(0.25, 1.42, -0.2),
    shL: V(0.02, 1.39, 0.19), elL: V(0.22, 1.25, 0.2), wrL: V(0.42, 1.35, 0.06),
  }),
  // talking: the right hand up in front of the chest, making a point
  gesture: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.02, 1.34, 0), neck: V(0.03, 1.48, 0), head: V(0.05, 1.61, 0), bow: 0.0,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.12), ankleR: V(0, 0.09, -0.13), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.02, 0.5, 0.11), ankleL: V(0.03, 0.09, 0.12), footL: 'flat',
    shR: V(0.01, 1.4, -0.19), elR: V(0.07, 1.13, -0.26), wrR: V(0.3, 1.23, -0.19),
    shL: V(0, 1.4, 0.19), elL: V(0.03, 1.13, 0.23), wrL: V(0.09, 0.93, 0.19),
  }),
  // a selfie: the phone held up at arm's length in front, a little to the right, the head tilted to it
  selfie: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0, 1.34, 0.01), neck: V(0.01, 1.48, 0.01), head: V(0.03, 1.61, 0.0), bow: -0.08,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.12), ankleR: V(0, 0.09, -0.13), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.03, 0.5, 0.12), ankleL: V(0.04, 0.09, 0.13), footL: 'flat',
    shR: V(0.01, 1.4, -0.19), elR: V(0.2, 1.47, -0.32), wrR: V(0.43, 1.66, -0.25),
    shL: V(0, 1.4, 0.19), elL: V(0.02, 1.13, 0.23), wrL: V(0.06, 0.92, 0.2),
  }),
  // walking, a three-frame cycle (1, 2, 3, 2): the left foot forward, passing, the right foot forward
  walk1: () => ({
    pelvis: V(0, 0.94, 0), torsoA: V(0.01, 1.02, 0), torsoB: V(0.04, 1.32, 0), neck: V(0.06, 1.46, 0), head: V(0.08, 1.59, 0), bow: 0.05,
    hipL: V(0, 0.91, 0.1), kneeL: V(0.17, 0.5, 0.11), ankleL: V(0.2, 0.09, 0.12), footL: 'flat',
    hipR: V(0, 0.91, -0.1), kneeR: V(-0.12, 0.5, -0.11), ankleR: V(-0.27, 0.12, -0.12), footR: 'flat',
    shR: V(0.02, 1.38, -0.19), elR: V(0.1, 1.13, -0.22), wrR: V(0.21, 0.93, -0.19),
    shL: V(0.02, 1.38, 0.19), elL: V(-0.07, 1.13, 0.22), wrL: V(-0.13, 0.92, 0.19),
  }),
  walk2: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0.01, 1.04, 0), torsoB: V(0.03, 1.34, 0), neck: V(0.05, 1.48, 0), head: V(0.07, 1.61, 0), bow: 0.05,
    hipL: V(0, 0.93, 0.1), kneeL: V(0.04, 0.5, 0.11), ankleL: V(0.0, 0.09, 0.12), footL: 'flat',
    hipR: V(0, 0.93, -0.1), kneeR: V(0.08, 0.52, -0.11), ankleR: V(-0.06, 0.17, -0.12), footR: 'flat',
    shR: V(0.01, 1.4, -0.19), elR: V(0.02, 1.13, -0.22), wrR: V(0.05, 0.91, -0.2),
    shL: V(0.01, 1.4, 0.19), elL: V(0.02, 1.13, 0.22), wrL: V(0.05, 0.91, 0.2),
  }),
  walk3: () => ({
    pelvis: V(0, 0.94, 0), torsoA: V(0.01, 1.02, 0), torsoB: V(0.04, 1.32, 0), neck: V(0.06, 1.46, 0), head: V(0.08, 1.59, 0), bow: 0.05,
    hipR: V(0, 0.91, -0.1), kneeR: V(0.17, 0.5, -0.11), ankleR: V(0.2, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.91, 0.1), kneeL: V(-0.12, 0.5, 0.11), ankleL: V(-0.27, 0.12, 0.12), footL: 'flat',
    shL: V(0.02, 1.38, 0.19), elL: V(0.1, 1.13, 0.22), wrL: V(0.21, 0.93, 0.19),
    shR: V(0.02, 1.38, -0.19), elR: V(-0.07, 1.13, -0.22), wrR: V(-0.13, 0.92, -0.19),
  }),
  // the bind pose of a skinned figure (world/PersonRig.js - a pit crew that moves): standing straight, the arms held
  // out and down at 40 degrees, clear of the body, so that every part of it can be told whose bone it moves with
  rig: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0, 1.34, 0), neck: V(0, 1.48, 0), head: V(0, 1.61, 0), bow: 0,
    hipR: V(0, 0.93, -0.1), kneeR: V(0, 0.5, -0.105), ankleR: V(0, 0.09, -0.11), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0, 0.5, 0.105), ankleL: V(0, 0.09, 0.11), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0, 1.19, -0.366), wrR: V(0, 1.011, -0.516),
    shL: V(0, 1.4, 0.19), elL: V(0, 1.19, 0.366), wrL: V(0, 1.011, 0.516),
  }),
  // standing, talking to a reporter: arms at the sides
  talk: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.01, 1.34, 0), neck: V(0.02, 1.48, 0), head: V(0.03, 1.61, 0), bow: 0.02,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0.02, 1.13, -0.23), wrR: V(0.06, 0.9, -0.22),
    shL: V(0, 1.4, 0.19), elL: V(0.02, 1.13, 0.23), wrL: V(0.08, 0.92, 0.2),
  }),
  // ---- a scuffle on the grid (ui/Brawl.js): open hands only - fingR / palmR, where a hand's fingers point and which
  // way its palm faces (when given; otherwise the hand carries on along the forearm, as everywhere else) ----
  // squared up: chest out, chin up, the feet apart with the left forward, both hands up at chest height, open, palms out
  guard: () => ({
    pelvis: V(0, 0.95, 0), torsoA: V(0, 1.03, 0), torsoB: V(-0.015, 1.34, 0), neck: V(0, 1.48, 0), head: V(0.02, 1.61, 0), bow: -0.06,
    hipR: V(0, 0.92, -0.1), kneeR: V(-0.04, 0.5, -0.15), ankleR: V(-0.12, 0.09, -0.18), footR: 'flat',
    hipL: V(0, 0.92, 0.1), kneeL: V(0.1, 0.5, 0.14), ankleL: V(0.14, 0.09, 0.16), footL: 'flat',
    shR: V(0.01, 1.41, -0.19), elR: V(0.1, 1.17, -0.27), wrR: V(0.28, 1.31, -0.215), fingR: V(0.25, 1, 0.08), palmR: V(1, -0.15, 0.3),
    shL: V(0.01, 1.41, 0.19), elL: V(0.09, 1.16, 0.27), wrL: V(0.27, 1.3, 0.215), fingL: V(0.25, 1, -0.08), palmL: V(1, -0.15, -0.3),
  }),
  // a two-handed shove: leaning in off the back foot, both arms out straight at chest height, the palms flat on the
  // other man's chest, fingers up
  shove: () => ({
    pelvis: V(0, 0.94, 0), torsoA: V(0.02, 1.02, 0), torsoB: V(0.12, 1.3, 0), neck: V(0.17, 1.43, 0), head: V(0.22, 1.55, 0), bow: -0.08,
    hipR: V(0, 0.91, -0.1), kneeR: V(-0.08, 0.5, -0.12), ankleR: V(-0.27, 0.12, -0.13), footR: 'flat',
    hipL: V(0, 0.91, 0.1), kneeL: V(0.19, 0.52, 0.12), ankleL: V(0.2, 0.09, 0.13), footL: 'flat',
    shR: V(0.13, 1.37, -0.18), elR: V(0.39, 1.31, -0.22), wrR: V(0.61, 1.33, -0.15), fingR: V(0.35, 1, 0.05), palmR: V(1, -0.3, 0.1),
    shL: V(0.13, 1.37, 0.18), elL: V(0.39, 1.31, 0.22), wrL: V(0.61, 1.33, 0.15), fingL: V(0.35, 1, -0.05), palmL: V(1, -0.3, -0.1),
  }),
  // knocked back a step: leaning away, the chin tucked, the right foot gone back to catch it, arms out for balance,
  // palms down
  stagger: () => ({
    pelvis: V(-0.05, 0.93, 0), torsoA: V(-0.06, 1.01, 0), torsoB: V(-0.15, 1.29, 0), neck: V(-0.19, 1.42, 0), head: V(-0.2, 1.55, 0), bow: 0.18,
    hipR: V(-0.05, 0.9, -0.1), kneeR: V(-0.16, 0.5, -0.14), ankleR: V(-0.31, 0.1, -0.17), footR: 'flat',
    hipL: V(-0.05, 0.9, 0.1), kneeL: V(0.06, 0.5, 0.14), ankleL: V(0.1, 0.09, 0.16), footL: 'flat',
    shR: V(-0.13, 1.35, -0.19), elR: V(-0.08, 1.21, -0.42), wrR: V(0.02, 1.19, -0.62), fingR: V(0.5, 0.1, -0.86), palmR: V(0, -1, 0),
    shL: V(-0.13, 1.35, 0.19), elL: V(-0.06, 1.25, 0.42), wrL: V(0.05, 1.29, 0.61), fingL: V(0.5, 0.15, 0.85), palmL: V(0, -1, 0),
  }),
  // holding someone back: braced, leaning in, both arms forward and low round the other's arms or waist, gripping
  restrain: () => ({
    pelvis: V(0, 0.93, 0), torsoA: V(0.01, 1.01, 0), torsoB: V(0.1, 1.3, 0), neck: V(0.14, 1.43, 0), head: V(0.18, 1.55, 0), bow: 0.12,
    hipR: V(0, 0.9, -0.1), kneeR: V(-0.03, 0.49, -0.14), ankleR: V(-0.17, 0.1, -0.18), footR: 'flat',
    hipL: V(0, 0.9, 0.1), kneeL: V(0.15, 0.5, 0.14), ankleL: V(0.17, 0.09, 0.16), footL: 'flat',
    shR: V(0.11, 1.37, -0.19), elR: V(0.3, 1.18, -0.26), wrR: V(0.5, 1.1, -0.15),
    shL: V(0.11, 1.37, 0.19), elL: V(0.3, 1.18, 0.26), wrL: V(0.5, 1.1, 0.15),
  }),
  // held back from behind: both arms pinned back at the elbows, leaning forward against it, the head up
  held: () => ({
    pelvis: V(0.02, 0.94, 0), torsoA: V(0.03, 1.02, 0), torsoB: V(0.1, 1.31, 0), neck: V(0.14, 1.44, 0), head: V(0.18, 1.56, 0), bow: -0.04,
    hipR: V(0.02, 0.91, -0.1), kneeR: V(0.0, 0.5, -0.13), ankleR: V(-0.12, 0.09, -0.15), footR: 'flat',
    hipL: V(0.02, 0.91, 0.1), kneeL: V(0.14, 0.5, 0.13), ankleL: V(0.16, 0.09, 0.15), footL: 'flat',
    shR: V(0.06, 1.38, -0.2), elR: V(-0.14, 1.2, -0.25), wrR: V(-0.2, 1.0, -0.15),
    shL: V(0.06, 1.38, 0.2), elL: V(-0.14, 1.2, 0.25), wrL: V(-0.2, 1.0, 0.15),
  }),
  // standing easy for the cameras: the weight on the right leg, the left knee bent in, the right hand on the hip, the
  // hips and shoulders tilted against each other, the head a little to one side
  pose: () => ({
    pelvis: V(0, 0.955, -0.025), torsoA: V(0, 1.035, -0.02), torsoB: V(0.01, 1.335, -0.004), neck: V(0.02, 1.475, 0.002), head: V(0.035, 1.605, 0.008), bow: 0.02,
    hipR: V(0, 0.935, -0.12), kneeR: V(0.01, 0.51, -0.105), ankleR: V(0, 0.09, -0.09), footR: 'flat',
    hipL: V(0, 0.915, 0.08), kneeL: V(0.08, 0.49, 0.03), ankleL: V(0.07, 0.09, 0.07), footL: 'flat',
    shR: V(0, 1.385, -0.19), elR: V(-0.07, 1.17, -0.33), wrR: V(0.0, 1.0, -0.19),
    shL: V(0.005, 1.41, 0.19), elL: V(0.04, 1.14, 0.23), wrL: V(0.09, 0.92, 0.19),
  }),
  // ---- a party (world/PartyCrowd.js, ui/PartyPlay.js): ordinary club dancing and standing about with a drink - the
  // feet always flat and under the hips (a skirt's standing fall holds), the shoulders where they always are, each limb
  // as long as in 'talk' ----
  // dancing, swaying: the weight on the left foot, the right knee given a little; both forearms up in front, loose,
  // the hands at the chest, the chin up a touch
  dance1: () => ({
    pelvis: V(0, 0.955, 0.02), torsoA: V(0, 1.035, 0.018), torsoB: V(0.015, 1.335, 0.004), neck: V(0.03, 1.475, -0.005), head: V(0.045, 1.605, -0.012), bow: -0.06,
    hipR: V(0, 0.92, -0.085), kneeR: V(0.077, 0.495, -0.088), ankleR: V(0.03, 0.09, -0.105), footR: 'flat',
    hipL: V(0, 0.935, 0.115), kneeL: V(0.01, 0.505, 0.118), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0.01, 1.39, -0.19), elR: V(0, 1.13, -0.24), wrR: V(0.2, 1.2, -0.16), fingR: V(0.75, -0.3, 0.3), palmR: V(0, -0.55, 0.85),
    shL: V(0.01, 1.41, 0.19), elL: V(0, 1.15, 0.245), wrL: V(0.2, 1.23, 0.165), fingL: V(0.75, -0.3, -0.3), palmL: V(0, -0.55, -0.85),
  }),
  // dancing, arms up (the drop, a song everyone knows): both hands up over the head, the elbows soft, the head back
  dance2: () => ({
    pelvis: V(0, 0.955, 0), torsoA: V(0, 1.035, 0), torsoB: V(-0.01, 1.335, 0), neck: V(-0.01, 1.475, 0), head: V(-0.015, 1.605, 0), bow: -0.16,
    hipR: V(0, 0.925, -0.1), kneeR: V(0.03, 0.5, -0.115), ankleR: V(0, 0.09, -0.125), footR: 'flat',
    hipL: V(0, 0.925, 0.1), kneeL: V(0.015, 0.5, 0.115), ankleL: V(0, 0.09, 0.125), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0.04, 1.64, -0.31), wrR: V(0.07, 1.87, -0.3),
    shL: V(0, 1.4, 0.19), elL: V(0.035, 1.645, 0.305), wrL: V(0.075, 1.875, 0.29),
  }),
  // dancing, a two-step: the left foot a little forward, the left hand up in the air out to the side, the right low in
  // front at the waist (a drink in it, as often as not)
  dance3: () => ({
    pelvis: V(0, 0.95, 0), torsoA: V(0.005, 1.03, 0), torsoB: V(0.02, 1.33, 0.01), neck: V(0.035, 1.47, 0.01), head: V(0.05, 1.6, 0.015), bow: 0.0,
    hipR: V(-0.005, 0.925, -0.1), kneeR: V(-0.02, 0.5, -0.11), ankleR: V(-0.05, 0.09, -0.12), footR: 'flat',
    hipL: V(0.01, 0.92, 0.1), kneeL: V(0.1, 0.495, 0.108), ankleL: V(0.08, 0.09, 0.115), footL: 'flat',
    shR: V(0.015, 1.39, -0.19), elR: V(0.0, 1.13, -0.245), wrR: V(0.205, 1.195, -0.16), fingR: V(0.8, -0.3, 0.5), palmR: V(-0.48, -0.12, 0.7),
    shL: V(0.01, 1.41, 0.19), elL: V(0.025, 1.56, 0.415), wrL: V(0.045, 1.785, 0.345),
  }),
  // a drink in the right hand at the chest, the left arm easy at the side
  drink: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.01, 1.34, 0), neck: V(0.02, 1.48, 0), head: V(0.03, 1.61, 0), bow: 0.04,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0, 1.13, -0.23), wrR: V(0.2, 1.24, -0.18),
    shL: V(0, 1.4, 0.19), elL: V(0.02, 1.13, 0.23), wrL: V(0.08, 0.92, 0.2),
  }),
  // a toast: the glass raised in front at the shoulder's height, leaning in a little
  toast: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.02, 1.34, 0), neck: V(0.035, 1.48, 0), head: V(0.05, 1.61, 0), bow: -0.02,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0.01, 1.4, -0.19), elR: V(0.2, 1.22, -0.27), wrR: V(0.36, 1.36, -0.17),
    shL: V(0, 1.4, 0.19), elL: V(0.02, 1.13, 0.23), wrL: V(0.08, 0.92, 0.2),
  }),
  // at the bar: both forearms on the counter in front (its top ~1.1 m, its edge ~0.12 m ahead), standing straight
  // over the feet, the shoulders a little forward to it
  lean: () => ({
    pelvis: V(0, 0.955, 0), torsoA: V(0, 1.035, 0), torsoB: V(0.045, 1.33, 0), neck: V(0.075, 1.465, 0), head: V(0.1, 1.59, 0), bow: 0.1,
    hipR: V(0, 0.925, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.925, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0.045, 1.39, -0.19), elR: V(0.14, 1.14, -0.22), wrR: V(0.35, 1.14, -0.11),
    shL: V(0.045, 1.39, 0.19), elL: V(0.14, 1.14, 0.22), wrL: V(0.34, 1.14, 0.1),
  }),
  // sitting back on a lounge sofa (its seat ~0.48 m, the back cushion's face ~0.2 m behind the hips): leaning back,
  // the knees together, the feet flat; a drink in the right hand over the lap, the left hand resting on the thigh
  sitBooth: () => ({
    pelvis: V(0, 0.52, 0), torsoA: V(-0.01, 0.6, 0), torsoB: V(-0.075, 0.88, 0), neck: V(-0.08, 1.015, 0), head: V(-0.065, 1.145, 0), bow: 0.14,
    hipR: V(0.02, 0.52, -0.095), kneeR: V(0.45, 0.5, -0.075), ankleR: V(0.5, 0.09, -0.08), footR: 'flat',
    hipL: V(0.02, 0.52, 0.095), kneeL: V(0.45, 0.5, 0.075), ankleL: V(0.5, 0.09, 0.08), footL: 'flat',
    shR: V(-0.07, 0.94, -0.19), elR: V(-0.05, 0.68, -0.23), wrR: V(0.17, 0.76, -0.16),
    shL: V(-0.07, 0.94, 0.19), elL: V(-0.04, 0.68, 0.23), wrL: V(0.17, 0.6, 0.15),
  }),
  // ---- two people together (world/PairFrames.js, ui/Affection.js): each pose is one of a pair, the other person
  // ~0.3 m ahead facing back (a hug, an embrace) or beside (on the right, -z) - placed and fitted by PairFrames ----
  // a hug, criss-cross (both the same pose): the left arm high over the other's right shoulder, the right low round
  // the waist, leaning in a touch
  hug: () => ({
    pelvis: V(0, 0.955, 0), torsoA: V(0.005, 1.035, 0), torsoB: V(0.03, 1.335, 0), neck: V(0.045, 1.47, 0), head: V(0.06, 1.6, 0), bow: 0.06,
    hipR: V(0, 0.925, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(-0.02, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.925, 0.1), kneeL: V(0.02, 0.5, 0.11), ankleL: V(0.01, 0.09, 0.12), footL: 'flat',
    shR: V(0.03, 1.39, -0.19), elR: V(0.17, 1.18, -0.3), wrR: V(0.33, 1.1, -0.15),
    shL: V(0.03, 1.39, 0.19), elL: V(0.27, 1.36, 0.31), wrL: V(0.4, 1.32, 0.12),
  }),
  // a long hug / a slow dance / a kiss, his side: both arms round her lower back
  embraceM: () => ({
    pelvis: V(0, 0.955, 0), torsoA: V(0.005, 1.035, 0), torsoB: V(0.03, 1.335, 0), neck: V(0.05, 1.47, 0), head: V(0.07, 1.6, 0), bow: 0.1,
    hipR: V(0, 0.925, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(-0.01, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.925, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(-0.01, 0.09, 0.12), footL: 'flat',
    shR: V(0.03, 1.39, -0.19), elR: V(0.18, 1.18, -0.28), wrR: V(0.33, 1.09, -0.13),
    shL: V(0.03, 1.39, 0.19), elL: V(0.18, 1.18, 0.28), wrL: V(0.33, 1.09, 0.13),
  }),
  // the same, her side: both arms up over his shoulders, the hands behind his neck, the chin up
  embraceF: () => ({
    pelvis: V(0, 0.955, 0), torsoA: V(0.005, 1.035, 0), torsoB: V(0.02, 1.335, 0), neck: V(0.03, 1.475, 0), head: V(0.04, 1.605, 0), bow: -0.12,
    hipR: V(0, 0.925, -0.1), kneeR: V(0.02, 0.5, -0.105), ankleR: V(0, 0.09, -0.11), footR: 'flat',
    hipL: V(0, 0.925, 0.1), kneeL: V(0.02, 0.5, 0.105), ankleL: V(0, 0.09, 0.11), footL: 'flat',
    shR: V(0.02, 1.39, -0.19), elR: V(0.25, 1.46, -0.3), wrR: V(0.4, 1.5, -0.11),
    shL: V(0.02, 1.39, 0.19), elL: V(0.25, 1.46, 0.3), wrL: V(0.4, 1.5, 0.11),
  }),
  // side by side, she on his right: his right arm round her shoulders, the hand over her far shoulder
  sideOut: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0, 1.34, -0.01), neck: V(0.01, 1.48, -0.015), head: V(0.02, 1.61, -0.02), bow: 0.04,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0, 1.41, -0.19), elR: V(-0.2, 1.43, -0.38), wrR: V(-0.04, 1.37, -0.55),
    shL: V(0, 1.4, 0.19), elL: V(0.02, 1.13, 0.23), wrL: V(0.08, 0.92, 0.2),
  }),
  // side by side, he on her left: her left arm round his waist, behind him
  sideIn: () => ({
    pelvis: V(0, 0.955, 0.01), torsoA: V(0, 1.035, 0.01), torsoB: V(0, 1.335, 0.015), neck: V(0.01, 1.475, 0.02), head: V(0.02, 1.605, 0.03), bow: 0.02,
    hipR: V(0, 0.925, -0.09), kneeR: V(0.01, 0.5, -0.1), ankleR: V(0, 0.09, -0.11), footR: 'flat',
    hipL: V(0, 0.925, 0.11), kneeL: V(0.03, 0.5, 0.1), ankleL: V(0.02, 0.09, 0.1), footL: 'flat',
    shR: V(0, 1.39, -0.19), elR: V(0.02, 1.13, -0.23), wrR: V(0.08, 0.92, -0.2),
    shL: V(0, 1.39, 0.19), elL: V(-0.09, 1.18, 0.34), wrL: V(-0.13, 1.06, 0.52),
  }),
  // holding hands, she on his right: his right hand a little forward and out to hers
  handOut: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.01, 1.34, 0), neck: V(0.02, 1.48, 0), head: V(0.03, 1.61, 0), bow: 0.02,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0.03, 1.13, -0.24), wrR: V(0.1, 0.92, -0.3),
    shL: V(0, 1.4, 0.19), elL: V(0.02, 1.13, 0.23), wrL: V(0.08, 0.92, 0.2),
  }),
  // holding hands, he on her left: her left hand out to his
  handIn: () => ({
    pelvis: V(0, 0.96, 0), torsoA: V(0, 1.04, 0), torsoB: V(0.01, 1.34, 0), neck: V(0.02, 1.48, 0), head: V(0.03, 1.61, 0), bow: 0.02,
    hipR: V(0, 0.93, -0.1), kneeR: V(0.01, 0.5, -0.11), ankleR: V(0, 0.09, -0.12), footR: 'flat',
    hipL: V(0, 0.93, 0.1), kneeL: V(0.01, 0.5, 0.11), ankleL: V(0, 0.09, 0.12), footL: 'flat',
    shR: V(0, 1.4, -0.19), elR: V(0.02, 1.13, -0.23), wrR: V(0.08, 0.92, -0.2),
    shL: V(0, 1.4, 0.19), elL: V(0.03, 1.13, 0.24), wrL: V(0.06, 0.92, 0.32),
  }),
  // a bro hug (two men): the left arm over the other's shoulder, the right hand at his side, a clap on the back
  brohug: () => ({
    pelvis: V(0, 0.955, 0), torsoA: V(0.005, 1.035, 0), torsoB: V(0.035, 1.335, 0), neck: V(0.05, 1.47, 0), head: V(0.065, 1.6, 0), bow: 0.08,
    hipR: V(0, 0.925, -0.1), kneeR: V(-0.01, 0.5, -0.12), ankleR: V(-0.06, 0.09, -0.13), footR: 'flat',
    hipL: V(0, 0.925, 0.1), kneeL: V(0.05, 0.5, 0.12), ankleL: V(0.05, 0.09, 0.13), footL: 'flat',
    shR: V(0.035, 1.39, -0.19), elR: V(0.12, 1.15, -0.27), wrR: V(0.33, 1.11, -0.19),
    shL: V(0.035, 1.39, 0.19), elL: V(0.27, 1.36, 0.31), wrL: V(0.4, 1.32, 0.12),
  }),
  // on a sofa beside someone (on her left, +z): leaning in to him, the head toward his shoulder, hands in the lap
  sitLean: () => ({
    pelvis: V(0, 0.52, 0), torsoA: V(-0.01, 0.6, 0.01), torsoB: V(-0.075, 0.87, 0.05), neck: V(-0.08, 1.0, 0.08), head: V(-0.065, 1.125, 0.11), bow: 0.1,
    hipR: V(0.02, 0.52, -0.095), kneeR: V(0.45, 0.5, -0.075), ankleR: V(0.5, 0.09, -0.08), footR: 'flat',
    hipL: V(0.02, 0.52, 0.095), kneeL: V(0.45, 0.5, 0.075), ankleL: V(0.5, 0.09, 0.08), footL: 'flat',
    shR: V(-0.07, 0.95, -0.14), elR: V(-0.04, 0.69, -0.19), wrR: V(0.17, 0.6, -0.1),
    shL: V(-0.07, 0.91, 0.23), elL: V(-0.05, 0.645, 0.26), wrL: V(0.17, 0.6, 0.16),
  }),
  // on a sofa, she on his right (-z): his right arm along the back of it, round her shoulders
  sitArm: () => ({
    pelvis: V(0, 0.52, 0), torsoA: V(-0.01, 0.6, 0), torsoB: V(-0.075, 0.88, -0.01), neck: V(-0.08, 1.015, -0.015), head: V(-0.065, 1.145, -0.02), bow: 0.12,
    hipR: V(0.02, 0.52, -0.095), kneeR: V(0.45, 0.5, -0.085), ankleR: V(0.5, 0.09, -0.09), footR: 'flat',
    hipL: V(0.02, 0.52, 0.095), kneeL: V(0.45, 0.5, 0.1), ankleL: V(0.5, 0.09, 0.12), footL: 'flat',
    shR: V(-0.07, 0.95, -0.19), elR: V(-0.2, 1.0, -0.42), wrR: V(-0.04, 0.955, -0.58),
    shL: V(-0.07, 0.94, 0.19), elL: V(-0.04, 0.68, 0.23), wrL: V(0.17, 0.6, 0.15),
  }),
  // at a table, reaching her right hand across it to the other's
  sitReach: () => ({
    pelvis: V(0, 0.52, 0), torsoA: V(0.01, 0.6, 0), torsoB: V(0.09, 0.88, 0), neck: V(0.12, 1.01, 0), head: V(0.15, 1.14, 0), bow: 0.05,
    hipR: V(0.02, 0.52, -0.1), kneeR: V(0.45, 0.52, -0.12), ankleR: V(0.47, 0.09, -0.13), footR: 'flat',
    hipL: V(0.02, 0.52, 0.1), kneeL: V(0.45, 0.52, 0.12), ankleL: V(0.47, 0.09, 0.13), footL: 'flat',
    shR: V(0.1, 0.94, -0.19), elR: V(0.34, 0.83, -0.2), wrR: V(0.56, 0.79, -0.13),
    shL: V(0.1, 0.94, 0.19), elL: V(0.27, 0.77, 0.24), wrL: V(0.5, 0.79, 0.12),
  }),
  // sat down, unwell after too much: a glass of water held in both hands at the chest, the head down
  sitWater: () => ({
    pelvis: V(0, 0.52, 0), torsoA: V(0, 0.6, 0), torsoB: V(-0.04, 0.87, 0), neck: V(-0.03, 1.0, 0), head: V(0, 1.12, 0), bow: 0.35,
    hipR: V(0.02, 0.52, -0.095), kneeR: V(0.45, 0.5, -0.075), ankleR: V(0.5, 0.09, -0.08), footR: 'flat',
    hipL: V(0.02, 0.52, 0.095), kneeL: V(0.45, 0.5, 0.075), ankleL: V(0.5, 0.09, 0.08), footL: 'flat',
    shR: V(-0.04, 0.93, -0.19), elR: V(-0.01, 0.67, -0.22), wrR: V(0.19, 0.78, -0.06),
    shL: V(-0.04, 0.93, 0.19), elL: V(-0.01, 0.67, 0.22), wrL: V(0.19, 0.78, 0.06),
  }),
};
// (directions in a pose, not places: never jittered, never moved with the figure)
const DIRS = new Set(['fingR', 'fingL', 'palmR', 'palmL']);

/** a pose's joints (for a crowd's distant, simplified bodies: world/Crowd.js) */
export function jointsOf(pose) { return (POSES[pose] || POSES.talk)(); }

/** a capsule from a to b (radius r), its cross-section scaled (sx across the body's depth, sz across its width) */
function seg(a, b, r, sx = 1, sz = 1) {
  const d = new THREE.Vector3().subVectors(b, a), L = Math.max(0.001, d.length());
  const g = new THREE.CapsuleGeometry(r, L, n(6, 1), n(18)); g.scale(sx, 1, sz);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()));
  g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  return g;
}
const ss3 = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const gau = (x, s) => Math.exp(-((x / s) ** 2));
/** rows [[x, a, b, ...]] (x rising) read at x: each value on a smooth curve through them (Catmull-Rom) -> [a, b, ...] */
function spline(R, x) {
  const N = R.length, w = R[0].length, out = [];
  if (x <= R[0][0]) return R[0].slice(1); if (x >= R[N - 1][0]) return R[N - 1].slice(1);
  let i = 1; while (R[i][0] < x) i++;
  const p0 = R[Math.max(0, i - 2)], p1 = R[i - 1], p2 = R[i], p3 = R[Math.min(N - 1, i + 1)], h = p2[0] - p1[0], u = (x - p1[0]) / h, u2 = u * u, u3 = u2 * u;
  for (let k = 1; k < w; k++) { const m1 = (p2[k] - p0[k]) / (p2[0] - p0[0]) * h, m2 = (p3[k] - p1[k]) / (p3[0] - p1[0]) * h; out.push((2 * u3 - 3 * u2 + 1) * p1[k] + (u3 - 2 * u2 + u) * m1 + (3 * u2 - 2 * u3) * p2[k] + (u3 - u2) * m2); }
  return out;
}
/** the same curve, worked out once at N points from x0 to x1 and read straight between them (quick: read many thousands of times) -> fn(x) -> [a, b, ...] (one array, reused) */
function lut(R, x0, x1, N = 256) {
  const w = R[0].length - 1, T = new Float32Array((N + 1) * w), out = new Array(w).fill(0);
  for (let i = 0; i <= N; i++) { const v = spline(R, x0 + (x1 - x0) * i / N); for (let k = 0; k < w; k++) T[i * w + k] = v[k]; }
  return (x) => { const u = Math.max(0, Math.min(N, (x - x0) / (x1 - x0) * N)), i = Math.min(N - 1, Math.floor(u)), f = u - i; for (let k = 0; k < w; k++) out[k] = T[i * w + k] + (T[(i + 1) * w + k] - T[i * w + k]) * f; return out; };
}

// ---- how a person is lit ------------------------------------------------------------------------------------------------
// (skin: warmer at its edges, where the light comes through it; cloth: a soft sheen as it turns away from the eye.
// Written once into three.js's own light code behind a define each (PPL_SKIN, PPL_CLOTH) rather than as a shader hook
// of each material's own, so every person shares the same few programs - skin, a painted face, cloth (and long hair's,
// skinned) - and a person's material lit some other way still takes its own hook: a hosted room's light (ui/Hangout.js)
// and the baked floodlight (world/Lighting.js) only ever patch a material that has none, and key their programs by it)
// (skin dewy, not dry: the lights' own sheen on it broadened and lifted, a touch warm - a soft glow where a floodlight
// catches a cheekbone or a shoulder, never a doll's hot spot; velvet (PPL_VELVET, its strength): its pile dark face-on,
// bright at its edges; metal (PPL_METAL, its share): a glint of its own colour as the studio overhead would give it,
// whatever the room - a gold earring in a dim bar is still gold, never black)
if (!THREE.ShaderChunk.lights_fragment_end.includes('PPL_SKIN')) THREE.ShaderChunk.lights_fragment_end += `
#if defined( PPL_SKIN ) || defined( PPL_CLOTH )
{
	float pplF = 1.0 - saturate( dot( geometryNormal, geometryViewDir ) );
	vec3 pplL = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	#ifdef PPL_SKIN
	reflectedLight.indirectDiffuse += pplL * ( pplF * pplF * pplF ) * vec3( 0.5, 0.24, 0.13 );
	#ifdef PPL_DEWY
	// (the sheen lifted the less the deeper her skin's own colour: on deep skin a lifted broad sheen reads as an ashy grey
	// wash over the chest and the shoulders, not a glow - its highlights kept, the wash gone)
	float pplK = smoothstep( 0.02, 0.16, dot( diffuseColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) ) );
	reflectedLight.directSpecular *= mix( vec3( 1.1, 1.06, 1.0 ), vec3( 1.9, 1.78, 1.58 ), pplK );
	reflectedLight.indirectSpecular *= ( 1.0 + 0.8 * pplF * pplF ) * ( 0.7 + 0.3 * pplK );
	#endif
	#elif defined( PPL_VELVET )
	reflectedLight.indirectDiffuse += pplL * ( PPL_VELVET * pplF * pplF - 0.22 * ( 1.0 - pplF ) * ( 1.0 - pplF ) );
	#else
	reflectedLight.indirectDiffuse += pplL * ( pplF * pplF ) * 0.16;
	#endif
}
#endif
#ifdef PPL_METAL
{
	vec3 pplR = inverseTransformDirection( reflect( - geometryViewDir, geometryNormal ), viewMatrix );
	float pplG = 0.3 + 0.7 * smoothstep( - 0.2, 0.9, pplR.y ) + 1.8 * pow( saturate( dot( pplR, vec3( 0.48, 0.8, 0.36 ) ) ), 24.0 );
	totalEmissiveRadiance += material.specularColor * pplG * PPL_METAL;
}
#endif
`;
// (her skin dewy (PPL_DEWY: a woman's - DEWY, while she is built; a man's skin as it was): a little smoother than its
// material says, its own variations kept - the face's and the neck's alike, no step in the light where they meet; deep
// skin the less smoothed the deeper its colour: its sheen soft, never an ashy grey wash over the chest)
if (!THREE.ShaderChunk.lights_physical_fragment.includes('PPL_DEWY')) THREE.ShaderChunk.lights_physical_fragment += `
#ifdef PPL_DEWY
material.roughness *= mix( 1.0, 0.68, smoothstep( 0.02, 0.16, dot( diffuseColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) ) ) );
#endif
`;
// (a glossy cloth - satin, sequins, leather, patent - lit by its own studio (pplEnv): its sheen from it, and, three.js's
// way, its soft light too - which, under a curve turned down (beneath the bust, a fold), would come from the studio's dim
// floor alone: a dark stain on a pale satin. That light kept at least near what the cloth would have turned a little up,
// as a room's light bounced back up to it does - its gloss, its reflections, its form's soft shade all as they were.
// PPL_GLOSS: cloth with that studio of its own; any other cloth lit by the scene's own room, as it always was)
if (!THREE.ShaderChunk.lights_fragment_maps.includes('PPL_GLOSS')) THREE.ShaderChunk.lights_fragment_maps += `
#if defined( PPL_GLOSS ) && defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV ) && defined( RE_IndirectDiffuse )
{
	vec3 pplUp = normalize( geometryNormal + 1.4 * normalize( ( viewMatrix * vec4( 0.0, 1.0, 0.0, 0.0 ) ).xyz ) );
	iblIrradiance = max( iblIrradiance, 0.75 * getIBLIrradiance( pplUp ) );
}
#endif
`;
// (liquid satin (PPL_SATIN with its own studio): a lamp's own highlight a fifth of a plain gloss's, and broad (FINISHES:
// rough 0.55) - over the bust's upper slope, which faces the key, a narrow lobe printed a hard-edged pale rectangle, on red
// it read as vinyl; the sheen satin is known by is its long highlight along the
// warp down the folds (world/Fabric.js), and the soft studio in it)
if (!THREE.ShaderChunk.lights_fragment_maps.includes('PPL_SATSPEC')) THREE.ShaderChunk.lights_fragment_maps += `
#if defined( PPL_SATIN ) && defined( PPL_GLOSS )
reflectedLight.directSpecular *= 0.2; // PPL_SATSPEC
#endif
`;
// (a sheer net (PPL_SHEER, how much): denser the more edge on it is seen - folds and edges dark, the skin seen through it
// face on - as a mesh or a lace is, never an even tinted film)
if (!THREE.ShaderChunk.lights_fragment_end.includes('PPL_SHEER')) THREE.ShaderChunk.lights_fragment_end += `
#ifdef PPL_SHEER
{
	float pplS = 1.0 - abs( dot( geometryNormal, geometryViewDir ) );
	diffuseColor.a = mix( diffuseColor.a, 1.0, PPL_SHEER * pplS * pplS * pplS );
}
#endif
`;
let DEWY = false;
/**
 * a person's material: 'skin', 'cloth', 'velvet' (v: its edges' sheen) or 'metal' (near fully metal, the studio in it -
 * its colour gold or silver), its colour multiplied by each vertex's own (the shading baked into a body, a shoe's sole)
 */
function pplMat(kind, color, roughness, o = {}, v = 0.6) {
  const metal = kind === 'metal', m = new THREE.MeshStandardMaterial({ color, roughness, metalness: kind === 'skin' ? 0 : metal ? 0.96 : 0.05, vertexColors: true, ...(metal ? { envMap: pplEnv(), envMapIntensity: 1.25 } : {}), ...o });
  m.defines = { STANDARD: '', ...(kind === 'skin' ? { PPL_SKIN: '', ...(DEWY ? { PPL_DEWY: '' } : {}) } : metal ? { PPL_METAL: '0.12' } : { PPL_CLOTH: '', ...(o.envMap ? { PPL_GLOSS: '' } : {}) }), ...(kind === 'velvet' ? { PPL_VELVET: v.toFixed(2) } : {}) }; return m;
}
let PPL_ENV = null;
/**
 * A small studio for a glossy finish to show (satin, patent, sequins, metal): a broad soft box overhead, strip lights
 * round about at eye height, warm and cool, a dim floor - painted once and shared, whatever the scene's own (a night's sky
 * gives a gold earring nothing to shine with); three.js filters it once per renderer
 */
function pplEnv() {
  if (PPL_ENV) return PPL_ENV;
  const W = 256, H = 128, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9a9ea6'); g.addColorStop(0.3, '#6a6c72'); g.addColorStop(0.5, '#3c3a38'); g.addColorStop(0.56, '#24221f'); g.addColorStop(1, '#121110'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const glow = (cx, cy, rx, ry, c) => { x.save(); x.translate(cx, cy); x.scale(1, ry / rx); const r = x.createRadialGradient(0, 0, 0, 0, 0, rx); r.addColorStop(0, c); r.addColorStop(0.55, c.replace(/[\d.]+\)$/, '0.5)')); r.addColorStop(1, c.replace(/[\d.]+\)$/, '0)')); x.fillStyle = r; x.fillRect(-rx, -rx, 2 * rx, 2 * rx); x.restore(); };
  glow(W * 0.5, 6, W * 0.6, 16, 'rgba(255,252,246,1)');
  for (const [u, c] of [[0.1, 'rgba(255,236,212,1)'], [0.36, 'rgba(232,240,255,1)'], [0.6, 'rgba(255,246,232,1)'], [0.86, 'rgba(255,226,196,1)']]) glow(u * W, H * 0.4, 7, 22, c);
  const t = new THREE.CanvasTexture(cv); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
  return (PPL_ENV = t);
}
let PPL_ENV_SOFT = null;
/**
 * The same studio for a cloth's sheen (liquid satin): no strip lights - a soft band of light all round at eye height,
 * warm and cool melting into one another, under the broad overhead box. A flat bodice reflects a smooth gradient, its
 * highlights drawn by its folds and curves - never a strip light's rectangle printed on the chest
 */
function pplEnvSoft() {
  if (PPL_ENV_SOFT) return PPL_ENV_SOFT;
  const W = 256, H = 128, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8e929a'); g.addColorStop(0.22, '#7a7c82'); g.addColorStop(0.4, '#77766f'); g.addColorStop(0.52, '#3c3a38'); g.addColorStop(0.6, '#24221f'); g.addColorStop(1, '#121110'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  // (the band: wide soft glows overlapping all the way round, so no single source stands out)
  for (let i = 0; i < 8; i++) { const cx = (i + 0.5) / 8 * W, r = x.createRadialGradient(cx, H * 0.38, 0, cx, H * 0.38, W * 0.16); r.addColorStop(0, i % 2 ? 'rgba(236,240,250,0.28)' : 'rgba(255,240,224,0.3)'); r.addColorStop(1, 'rgba(255,255,255,0)'); x.save(); x.translate(0, H * 0.38); x.scale(1, 0.45); x.translate(0, -H * 0.38); x.fillStyle = r; x.fillRect(0, 0, W, H); x.restore(); }
  const t = new THREE.CanvasTexture(cv); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
  return (PPL_ENV_SOFT = t);
}
/**
 * Each kit's finish (FINISH: by kit; any other - one new to the wardrobe - its own sheen, OUTFITS' rough): liquid satin,
 * glossy, its highlight broad and the room seen in it; velvet, matt - its pile dark face-on, catching the light at its
 * edges; sequins half metal and glittering; leather a soft gloss -> the top's material
 */
const FINISH = { slip: 'satin', slitgown: 'satin', halter: 'satin', corset: 'satin', oneshoulder: 'satin', gown: 'velvet', cropset: 'velvet', sequin: 'sequin', leather: 'leather', plunge: 'satin', wrapgown: 'satin', galaslip: 'satin' };
// (and structured crepe: matt, dense, no sheen to speak of - a tailored dress's)
// (each answering the light as its cloth does - world/Fabric.js, in the shader, nothing per frame: w its weave or surface
// - a leather's pebbled grain, sequins each tilted their own way, a lame's crinkled foil, a rib knit's ribs, a denim's
// twill - an its sheen drawn along its warp, satin's long highlights down its folds. And, a kit's own only: a jersey's soft
// matt sheen, a rib knit, denim)
const FINISHES = { satin: { r: 0.55, env: 0.32, an: 0.5 }, velvet: { r: 0.92, velvet: 0.62 }, sequin: { r: 0.26, metal: 0.55, env: 1.2, w: 'sequin' }, leather: { r: 0.46, env: 0.28, w: 'leather' }, crepe: { r: 0.84 }, metallic: { r: 0.26, metal: 0.72, env: 1.1, w: 'lame' },
  jersey: { r: 0.66, env: 0.08 }, rib: { r: 0.88, w: 'rib' }, denim: { r: 0.93, w: 'denim' } };
/** the fabrics a dress can be made in (o.fabric: liquid satin, velvet, structured crepe, sequins, leather, a liquid metallic lamé) - in place of its kit's own */
export const FABRICS = Object.freeze(['satin', 'velvet', 'crepe', 'sequin', 'leather', 'metallic']);
/**
 * The jewellery's metals (linear colour, roughness): polished gold, bright silver, rose gold - one spec for all, each
 * person's own material made from it (a night's lift is written into each person's materials, and each is disposed with
 * its person: never one material shared between people)
 */
const METALS = Object.freeze({ gold: Object.freeze({ c: [1, 0.74, 0.36], r: 0.16 }), silver: Object.freeze({ c: [0.9, 0.91, 0.93], r: 0.16 }), rose: Object.freeze({ c: [0.95, 0.62, 0.52], r: 0.18 }) });
export const METAL_FINISHES = Object.freeze(Object.keys(METALS));
/** shoes' finishes (o.shoeFinish): patent (a mirror's gloss, the room in it - heels' own), satin, matte, suede (a soft nap), metallic (in her jewellery's metal) */
const SHOE_FINISHES = Object.freeze({ patent: { r: 0.1, env: 1 }, satin: { r: 0.3, env: 0.5 }, matte: { r: 0.55 }, suede: { r: 0.92, velvet: 0.35 }, metallic: 'metal' });
export const SHOE_FINISH_KEYS = Object.freeze(Object.keys(SHOE_FINISHES));
/** the top's material: its kit's finish (FINISH, or the kit's own: OF.fin), or a fabric of her own (o.fabric) */
function finishMat(kit, color, OF, fabric = null) {
  const f = FINISHES[(FINISHES[fabric] && fabric) || FINISH[kit] || OF.fin];
  if (!f) return fabricOn(pplMat('cloth', color, OF.rough ?? 0.6, OF.sparkle ? { metalness: 0.45 } : {}), { weave: OF.sparkle ? 'sequin' : OF.ribs ? 'rib' : null });
  // (satin's sheen from the soft studio: its highlights the folds', no strip light printed on a flat bodice)
  return fabricOn(pplMat(f.velvet ? 'velvet' : 'cloth', color, f.r, { ...(f.metal ? { metalness: f.metal } : {}), ...(f.env ? { envMap: f.an ? pplEnvSoft() : pplEnv(), envMapIntensity: f.env } : {}) }, f.velvet), { weave: f.w, satin: f.an });
}

// ---- builds: how a body is proportioned ---------------------------------------------------------------------------------
/**
 * A torso, from the seat (f < 0) up through the hips, the waist and the chest to the base of the neck (f = 1, and a
 * little past it, inside the neck): its sections - [f, half its width, half its depth, how far its middle sits forward] -
 * a smooth curve between them. A man's chest broad and deep over a waist not much narrower, the shoulders' slope of
 * the trapezius up to the neck, slim hips; a woman's waist drawn in between her ribs and her hips. Its top closes inside
 * the neck
 */
const TOR_M = [[-0.25, 0.04, 0.034, -0.004], [-0.19, 0.118, 0.08, -0.008], [-0.1, 0.162, 0.098, -0.013], [0.02, 0.164, 0.097, -0.01], [0.16, 0.15, 0.093, -0.002], [0.3, 0.142, 0.093, 0.004], [0.45, 0.151, 0.099, 0.008], [0.6, 0.165, 0.108, 0.012], [0.72, 0.172, 0.106, 0.01], [0.83, 0.168, 0.097, 0.002], [0.91, 0.152, 0.082, -0.006], [0.965, 0.118, 0.068, -0.008], [0.995, 0.066, 0.056, -0.006], [1.03, 0.04, 0.036, -0.004]];
// (hers a model's, every measure a share of her height (H): the crotch at 0.48 H - its seat no deeper below the hips'
// joints than that; the waist at 0.635 H, 0.35 H round (0.68 of her hips, 0.51 H round); the ribs 0.42 H round under the
// bust, broad enough at its height that over it (F.bust) she measures nearly as she does round the hips)
const TOR_F = [[-0.218, 0.05, 0.036, -0.008], [-0.165, 0.147, 0.085, -0.014], [-0.08, 0.1735, 0.106, -0.019], [0.02, 0.164, 0.102, -0.012], [0.12, 0.15, 0.093, -0.004], [0.19, 0.138, 0.089, 0], [0.275, 0.1245, 0.0855, 0.002], [0.44, 0.1335, 0.087, 0.004], [0.6, 0.149, 0.094, 0.006], [0.72, 0.154, 0.093, 0.004], [0.83, 0.14, 0.083, 0], [0.91, 0.13, 0.071, -0.006], [0.965, 0.1, 0.058, -0.007], [0.995, 0.054, 0.047, -0.005], [1.03, 0.035, 0.032, -0.003]];
/**
 * The measures of a figure ('m' as everyone has always been built, 'f' a woman's): tor (the torso), sh (how far out the
 * shoulders' joints are), del (the deltoid capping each shoulder), arm (a bare arm's radii: upper arm, elbow, forearm,
 * wrist), leg (thigh, mid-thigh, knee, calf, ankle), nk (the neck, at its base and under the head), hk (the hands'
 * size), bust, pec and seat (how much they round the torso), ht (height: the body's scale), hd (the head's own)
 */
const FIG = {
  m: { tor: TOR_M, sh: 0.84, del: 0.056, arm: [0.046, 0.037, 0.043, 0.028], leg: [0.088, 0.077, 0.054, 0.058, 0.035], nk: [0.061, 0.056], hk: 1, bust: 0, pec: 0.008, seat: 0.012, ht: 1, hd: 1.03 },
  // (hers a model's: about 7.8 heads tall (hd: her head 0.128 of her height, crown to chin); shoulders 0.245 of her height
  // across the deltoids; hands as long as her face (0.8 of her head); bust (as a share of her chest's depth, figureOf)
  // fullest at bf - 0.735 H up, a bodice's lift (F.lift: torsoOf) carrying it a little higher; full and round - a
  // glamour model's, not a runway's; seat: her glutes' own projection behind the hips' sections, generous and lifted,
  // fullest at gz (f: a little below the hips' joints): torsoOf - each build's and each person's a share more or less:
  // figureOf)
  f: { tor: TOR_F, sh: 0.805, del: 0.046, arm: [0.038, 0.029, 0.034, 0.023], leg: [0.084, 0.071, 0.047, 0.052, 0.031], nk: [0.052, 0.047], hk: 1.05, bust: 0.071, bf: 0.6, pec: 0, seat: 0.045, gz: -0.055, ht: 0.95, hd: 1.14 },
};
/** her arms' segments - the upper arm, the forearm - against a pose's own: a model's reach, her span her height (buildPerson) */
const ARM_F = [1.11, 1.06];
/**
 * A build: the figure's measures scaled together (shoulders, chest, waist, hips, arms, legs, neck, height, head) -
 * 'athletic' (a driver: a V from the shoulders to the waist, a strong neck), 'slim' (her: a defined waist, slender
 * toned arms), 'broad' (a mechanic, a marshal), 'average'. Hers also (her neck as slim's - a swan's, whatever her build):
 * 'curvy' (full hips, thighs and seat, a full bust, the waist still drawn in), 'hourglass' (the bust and the hips full,
 * the narrowest waist), 'fit' (an athlete's: toned, a lighter bust, the seat a share less but high and round - its
 * fullest higher, gz). bu, se: her bust's and her seat's share of the figure's (hers only - his chest and seat as they
 * always were) - seen from the side as clearly as from the front: the seat behind the small of her back about 7.5 cm
 * fit (its fullest higher, gz), 7.7 slim, 8.1 average, 9.2 hourglass, 10 curvy (of 176 cm)
 */
const BUILDS = {
  average: { sh: 1, ch: 1, wa: 1, hi: 1, arm: 1, leg: 1, nk: 1, ht: 1, hd: 1, bu: 1.05, se: 1 },
  athletic: { sh: 1.03, ch: 1.03, wa: 0.95, hi: 0.96, arm: 1.06, leg: 1.03, nk: 1.1, ht: 1, hd: 1 },
  slim: { sh: 0.99, ch: 0.97, wa: 0.94, hi: 0.97, arm: 0.96, leg: 0.96, nk: 0.97, ht: 1, hd: 1, bu: 1, se: 0.85, gz: -0.052 },
  broad: { sh: 1.05, ch: 1.08, wa: 1.13, hi: 1.05, arm: 1.1, leg: 1.06, nk: 1.08, ht: 1.01, hd: 0.99 },
  curvy: { sh: 0.995, ch: 0.985, wa: 0.97, hi: 1.04, arm: 0.98, leg: 1.03, nk: 0.97, ht: 1, hd: 1, bu: 1.18, se: 1.36, gz: -0.062 },
  hourglass: { sh: 0.99, ch: 0.98, wa: 0.93, hi: 1.01, arm: 0.96, leg: 0.98, nk: 0.97, ht: 1, hd: 1, bu: 1.14, se: 1.18 },
  fit: { sh: 1.005, ch: 0.975, wa: 0.93, hi: 0.98, arm: 0.99, leg: 1.0, nk: 0.97, ht: 1, hd: 1, bu: 0.86, se: 0.75, gz: -0.045 },
};
/** her figure's builds (the rest are his, or anyone's) */
export const BUILDS_F = Object.freeze(['slim', 'average', 'curvy', 'hourglass', 'fit']);
/**
 * figure fig ('m' | 'f') in build b -> its measures; cv (hers only): her own share more or less of the build's bust and
 * seat ({ bust, seat }, or one number for both) - two women of one build never quite alike
 */
function figureOf(fig, b, cv = null) {
  const F = FIG[fig], B = BUILDS[b] || BUILDS.average, cb = fig === 'f' ? (typeof cv === 'number' ? cv : cv?.bust ?? 1) : 1, cs = fig === 'f' ? (typeof cv === 'number' ? cv : cv?.seat ?? 1) : 1;
  const k = (f) => { const h = 1 - ss3(0.05, 0.25, f), c = ss3(0.4, 0.6, f), top = ss3(0.95, 1.0, f); return (h * B.hi + c * B.ch + (1 - h - c) * B.wa) * (1 - top) + B.nk * top; };
  const tor = F.tor.map(([f, w, d, x]) => [f, w * k(f), d * k(f) ** 0.8, x]), nk = F.nk.map((r) => r * B.nk);
  // (the shoulder girdle, the trapezius and the neck's base are shaped per person, from the pose's own shoulders and
  // the neck in proportion to the head: girdleOf)
  const dl = F.del * Math.sqrt(B.sh * B.arm);
  return { ...F, build: b in BUILDS ? b : 'average', bust: F.bust * k(0.66) ** 0.8 * (fig === 'f' ? (B.bu ?? 1) * Math.min(1.35, Math.max(0.7, cb)) : 1), seat: F.seat * (fig === 'f' ? (B.se ?? 1) * Math.min(1.4, Math.max(0.7, cs)) : 1), gz: B.gz ?? F.gz, tor: tor.filter((r) => r[0] < 0.86), sh: F.sh * B.sh, del: dl, arm: F.arm.map((r) => r * B.arm), leg: F.leg.map((r) => r * B.leg), nk, ht: F.ht * B.ht, hd: F.hd * B.hd };
}
/** how far out the shoulders' joints are in every pose (POSES: shR.z, before the figure's own F.sh) */
const SH_Z = 0.19;
/** the neck's seam (f) the necklines (NECK) were drawn against: they follow it wherever a person's seam is */
const NECK_SEAM = 0.965;
/**
 * The neck, in proportion to the head it carries (S: the head's shape; F: the figure; fem) - nothing in it a fixed size.
 * The head measured off its own shape: its height (crown to chin), its width, its girth (round it at its widest), the
 * jaw's width as it is seen, how far back the skull's base reaches. The neck's girth round its middle a share of the
 * head's: hers slender (0.52 - a swan's), his 0.65, a driver's or a broad build's more (~0.71) - an ellipse a little
 * less deep than wide, well inside the head's width, about as wide as his jaw at most (a strong neck rounder instead).
 * Near a cylinder along all but its lowest part - a touch slimmer at its middle than up under the jaw - flaring only
 * over its lowest centimetre or so (a share of its radius) into the trapezius at the seam (wider than deep there, rS),
 * on the trapezius' own slope. The chin Lv above the line of the collarbones (hers 36% of her head's height - a long,
 * slender neck, the chin some way above the seam at the sides; his 33%) - the jaw never sunk into the shoulders.
 * It leans forward only a little (lean: a share of its rise - hers held upright, his a little more); its back straight
 * up from its flare into the base of the skull. The head carried over it, not ahead of it: its centre no further ahead
 * of the neck's top than a share of the neck's radius there (fw) - over a slender neck the skull's base reaching a
 * little past the nape, as it does.
 * -> { rTop (under the jaw), rBase, rS, dS (across and deep at the seam), rJ (where the trapezius' line reaches it: the
 * seam's height), dk0 (its depth to its width), girth, HG (the
 * head's), HW, JW (the head's width, the jaw's), Lv, chin (below the head's centre), occ (the skull's back, behind its
 * centre, at its base), fw, headH, lean, prof(Ls, D, hB) -> { r(h, c), dk(h), rF(h, c), rB(h, c) }: h up the neck from the
 * seam over its length Ls (c: the cosine of the way round from the front - the flare is level, a ring round the leaning
 * neck lower in front); at the seam D deep each way (fitted to the chest: nS), rS across, flaring in to its own by hB }
 */
function neckOf(S, F, fem) {
  const HS = headShape(S), m = 0.1 * F.hd;
  let cy = 0, cr = 0, hw = 0, jw = 0, ob = 0;
  for (let i = 0; i <= 28; i++) for (let j = 0; j < 32; j++) {
    const th = Math.PI * i / 28 - Math.PI / 2, ny = Math.sin(th), rr = Math.cos(th), ph = 2 * Math.PI * j / 32, nx = rr * Math.cos(ph), nz = rr * Math.sin(ph), [x, y, z] = HS(nx, ny, nz);
    cy = Math.min(cy, y); cr = Math.max(cr, y); hw = Math.max(hw, Math.abs(z));
    // (the jawline as it is seen: the lower face's width from the mouth down toward the chin)
    if (ny > -0.74 && ny < -0.62 && Math.abs(nx) < 0.5) jw = Math.max(jw, Math.abs(z));
    // (the base of the skull behind: how far back the head reaches just above the nape)
    if (ny > -0.6 && ny < -0.35 && nx < -0.5 && Math.abs(nz) < 0.3) ob = Math.max(ob, -x);
  }
  // (the head's girth: round it at its widest - a level ring of its shape above the ears, its features left off)
  let hg = 0;
  for (let i = 0; i <= 10; i++) { const ny = -0.1 + 0.05 * i, rr = Math.sqrt(1 - ny * ny); let g = 0, p = null; for (let j = 0; j <= 48; j++) { const ph = 2 * Math.PI * j / 48, [x, , z] = HS(rr * Math.cos(ph), ny, rr * Math.sin(ph), false); if (p) g += Math.hypot(x - p[0], z - p[1]); p = [x, z]; } hg = Math.max(hg, g); }
  const headH = (cr - cy) * m, HW = 2 * hw * m, JW = 2 * jw * m, HG = hg * m;
  // (its girth round its middle - where it is slimmest - a share of the head's: hers 0.52 - slender, a swan's; his 0.65, a
  // stronger build's more (a driver's, athletic: ~0.71) - an ellipse rN across, dk of that deep (hers 0.92, his 0.94).
  // Its middle never more than a little past the jaw's width as it is seen (1.1 JW across - up under the jaw, with its
  // fullness there, ~1.15 JW: about the width at the jaw's angles, a driver's strong neck) nor near the head's own width
  // (0.86 HW): a strong neck's girth beyond that is in its depth, up to round)
  const ell = (k) => Math.PI * (3 * (1 + k) - Math.sqrt((3 + k) * (1 + 3 * k))), girth = (fem ? 0.52 : 0.65) * (BUILDS[F.build]?.nk / (fem ? BUILDS.slim.nk : 1) || 1) ** 0.9 * HG;
  let dk = fem ? 0.92 : 0.94; const rN = Math.min(girth / ell(dk), 0.55 * JW, 0.43 * HW);
  while (dk < 1 && rN * ell(dk) < girth) dk += 0.005;
  // (all but its lowest part near a cylinder, a touch fuller up under the jaw (rTop); over its lowest part (hB: a share
  // of its own radius, not of its length - a longer neck no more flared) flaring into the trapezius at the seam - wider
  // than deep there (rS, dS), the flare easing in, at the trapezius' own slope where it reaches the neck. The seam's
  // height up the trapezius from the line of the collarbones goes by rJ - where the trapezius' line reaches the neck,
  // not the flare's own width: a slimmer flare never a shorter neck)
  const rTop = 1.04 * rN, rBase = 1.06 * rN, rS = rN * (fem ? 1.18 : 1.2), rJ = rN * (fem ? 1.4 : 1.33), dS = 1.1 * dk * rN, lean = fem ? 0.05 : 0.12;
  const prof = (Ls, D = dS, hB = 0.55 * rN) => {
    // (bl: the flare's share - all of it at the seam and below, none from hB up - by height, level: a ring round the
    // leaning neck lower in front than behind (c: the cosine of the way round from the front), the flare where the
    // chest's level section at the seam meets it all round. A cubic over half the neck's radius: the trapezius sweeping
    // up into the neck along a broad curve (its tightest round about half the neck's radius), straightening into the
    // neck's own line with no change in its curvature there - no ring of light where the flare ends)
    // (cloth up to its foot (bare(k): k the share of the trapezius' sweep bare above the neckline at its sides - a crew's
    // none): the flare over a shorter rise, under the cloth's edge - never a cone of skin standing out of a crew neckline)
    const sT = lean / Math.hypot(1, lean), bl = (h, c) => { const t = clamp01((h - c * dk * rN * sT) / hB); return (1 - t) ** 3; };
    // (hers, up under the skull behind the ears (c: round toward the back), widening into its base as the muscles from the
    // mastoids do - a share of its own radius over its upper share - so the skull's underside comes down to it in one curve,
    // never a ledge over a peg; none at the nape itself, its back straight up into the skull)
    const mf = (h, c) => (fem ? 0.2 * ss3(0.5 * Ls, 1.02 * Ls, h) * gau(c + 0.4, 0.38) : 0);
    const jf = (h) => 1 + 0.04 * ss3(0.2 * Ls, 0.7 * Ls, h), r = (h, c = 0) => rN * (jf(h) + mf(h, c)) + (rS - rN) * bl(h, c), d = (h, c = 0) => dk * rN * jf(h) + (D - dk * rN) * bl(h, c);
    return { r, dk: (h) => d(h) / r(h), rF: d, rB: d, bare: (k) => { hB = rN * (0.25 + 0.3 * clamp01(k)); } };
  };
  return { rTop, rBase, rS, rJ, dS, dk0: dk, girth, HG, HW, JW, Lv: (fem ? 0.36 : 0.33) * headH, chin: -cy * m, occ: ob * m, fw: 0.3 * rTop, headH, lean, prof };
}

// ---- the body's surfaces ------------------------------------------------------------------------------------------------
/**
 * A closed surface through rings of points (each ring a loop, all of the same count, in order along the surface; a ring
 * of one point repeated closes an end), its faces turned outward, smooth all round (no seam) -> geometry
 */
function loft(R, closed = false) {
  const K = R.length, M = R[0].length, pos = new Float32Array(K * M * 3), uv = new Float32Array(K * M * 2), idx = [];
  for (let k = 0; k < K; k++) for (let j = 0; j < M; j++) { const p = R[k][j], i = k * M + j; pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z; uv[i * 2] = j / M; uv[i * 2 + 1] = k / Math.max(1, K - 1); }
  for (let k = 0; k < (closed ? K : K - 1); k++) { const k1 = (k + 1) % K; for (let j = 0; j < M; j++) { const j1 = (j + 1) % M, a = k * M + j, b = k * M + j1, c = k1 * M + j1, d = k1 * M + j; idx.push(a, c, b, a, d, c); } }
  // (turned outward: the volume it encloses comes out positive)
  let cx = 0, cy = 0, cz = 0, vol = 0; const nv = K * M;
  for (let i = 0; i < nv; i++) { cx += pos[i * 3] / nv; cy += pos[i * 3 + 1] / nv; cz += pos[i * 3 + 2] / nv; }
  for (let i = 0; i < idx.length; i += 3) {
    const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3, ax = pos[a] - cx, ay = pos[a + 1] - cy, az = pos[a + 2] - cz, bx = pos[b] - cx, by = pos[b + 1] - cy, bz = pos[b + 2] - cz, qx = pos[c] - cx, qy = pos[c + 1] - cy, qz = pos[c + 2] - cz;
    vol += ax * (by * qz - bz * qy) + ay * (bz * qx - bx * qz) + az * (bx * qy - by * qx);
  }
  if (vol < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/** a ring of m points round c in the plane of e1 and e2 (radii r1, r2; k(angle) shapes it) -> [Vector3] */
const ringOf = (c, e1, e2, r1, r2, m, k = null) => Array.from({ length: m }, (_, j) => { const a = j / m * Math.PI * 2, f = k ? k(a) : 1; return c.clone().addScaledVector(e1, Math.cos(a) * r1 * f).addScaledVector(e2, Math.sin(a) * r2 * f); });
/**
 * Under a bust lifted in a structured bodice (torsoOf): over the skin's firm under-curve to its clean fold, the bodice's
 * cloth running down from the fullest as boning holds it - round over the fullest (r: its radius, in f), then a straight
 * line at s (its slope, the bust's projection per f) down to the ribs a quarter of her torso below (1 / s + r), eased on
 * to them (k) - never turned straight down; everywhere at or over the skin's own curve. A fuller bust (F.bust over b)
 * its line as steep as this one's, so reaching the ribs the lower (torsoOf) -> { s, r, k, b }
 */
const LIFT_UC = { s: 5, r: 0.05, k: 0.05, b: 0.058 };

/**
 * A torso in its pose, from J.torsoA (the hips; its own foot 0.11 below) to J.torsoB (the chest): pt(f, ang, out) - a
 * point of its surface at f (0 the hips .. 1 the base of the neck; below 0 the seat), ang round from the front (+pi/2 the
 * left side), lifted by out (a piece of cloth on it) - with the bust (her figure: two soft rounds, bridged as any cloth
 * over them bridges them) or a man's chest, the shoulder blades and the seat; c(f) the middle of its section -> frame
 */
function torsoOf(J, F) {
  const A = J.torsoA, d = new THREE.Vector3().subVectors(J.torsoB, A), H = d.length() + 0.24, q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
  // (sitting, the seat no deeper than the hips allow: the thighs carry on forward from it)
  const sit = clamp01(1 - (Math.min(J.hipR.y - J.kneeR.y, J.hipL.y - J.kneeL.y)) / 0.3), sk = 1 - 0.45 * sit, fem = F.bust > 0;
  // (her spine's curve, seen from the side - each a share of the section's own depth: the upper back gently rounded and
  // the chest lifted above the bust, the small of the back drawn in, the pelvis tipped forward a little - the seat out
  // behind (F.seat), the front tucked under below the belly. More in heels (F.arch), less sitting)
  const ar = fem ? (F.arch ?? 1) * (1 - 0.6 * sit) : 0, S = lut(F.tor, -0.3, 1.1, 280);
  const sec = (f) => {
    const g = f < 0 ? f / sk : f, s = S(g); if (!ar) return s;
    const fr = ar * (0.12 * gau(g - 0.77, 0.08) + 0.04 * gau(g - 0.5, 0.1) - 0.09 * gau(g + 0.17, 0.07)), bk = ar * (0.16 * gau(g - 0.68, 0.13) - 0.24 * gau(g - 0.27, 0.12));
    return [s[0], s[1] * (1 + (fr + bk) / 2), s[2] + s[1] * (fr - bk) / 2];
  };
  // (her hips tilted, her weight on one foot (F.roll): their sections rolled about the forward axis with the line through
  // the hips' joints, back level with the chest by the waist)
  const zl = V(0, 0, 1).applyQuaternion(q), hv = new THREE.Vector3().subVectors(J.hipL, J.hipR), roll = F.roll ? Math.atan2(hv.y, hv.z) - Math.atan2(zl.y, zl.z) : 0;
  // (her shoulders' girdle tilted the same way with the line through their joints (F.shF: the joints' f, the neck's seam's
  // half-width, the shoulders' span) - each shoulder's round over its own arm, however the pose carries them: full from
  // below the round over the joints and out from the neck - the neck's base level, the trapezius rising from it to each
  // shoulder as high as that one is)
  const sF = fem && F.shF, sv = new THREE.Vector3().subVectors(J.shL, J.shR), sro = sF ? Math.atan2(sv.y, sv.z * F.sh) - Math.atan2(zl.y, zl.z) : 0;
  const rollAt = (f, z = 1) => roll * (1 - ss3(0.04, 0.3, f)) + (sro ? sro * ss3(sF[0] - 0.22, sF[0] - 0.08, f) * ss3(sF[1], sF[1] + 0.4 * (sF[2] - sF[1]), Math.abs(z)) : 0);
  // (and each shoulder's round out over its arm only as far as that arm hangs under it (rz: 0 hanging .. 1 raised or
  // reaching out): beside a raised arm the side runs straight up from the chest's under the arm (F.shF[3]) to the
  // acromion's (F.shF[4]) - no shelf of the round left under it, the arm's own round carrying the shoulder's)
  const rz = sF ? ['R', 'L'].map((s) => 0.7 * ss3(-0.8, -0.2, new THREE.Vector3().subVectors(J['el' + s], J['sh' + s]).normalize().y)) : null, wU = sF ? sec(sF[3])[0] : 0, wA = sF ? sec(sF[4])[0] : 0;
  const wSide = (f, w, z) => { const k = rz && f > sF[3] && f < sF[4] ? rz[z > 0 ? 1 : 0] : 0; return k ? w - Math.max(0, w - wU - (wA - wU) * (f - sF[3]) / (sF[4] - sF[3])) * k : w; };
  // (two soft rounds bridged: a + b - ab - never a crease where one gives way to the other)
  const orS = (a, b) => a + b - a * b;
  const pt = (f, ang, out = 0) => {
    // (the angle taken round the same way whichever way it was counted - a jacket's body goes on past pi round the back)
    if (ang > Math.PI) ang -= 2 * Math.PI; else if (ang < -Math.PI) ang += 2 * Math.PI;
    const [w, dd, xf] = sec(f), c = Math.cos(ang), s = Math.sin(ang), back = Math.PI - Math.abs(ang);
    // (a man's chest a little square in section, flatter across its front and its back, his hips squarer still; hers
    // round all the way down - no corners at the hips)
    const e = fem ? 1 : 1 - 0.16 * ss3(0.4, 0.62, f) * ss3(0.99, 0.86, f) - 0.14 * ss3(0.22, 0.02, f), cs = Math.sign(c) * Math.abs(c) ** e, sn = Math.sign(s) * Math.abs(s) ** e;
    // (her hip's side hollow: a soft dip behind the hip bone where the glute's round gives way to the side of the hip -
    // a share of her seat's own fullness; bridged by any cloth over it, gone sitting. And below the seat's round toward the
    // side, the hips drawn in to the backs of the thighs' tops (a share of the section's width): the lower, outer seat
    // running smoothly on down into the thigh - no corner of the hips standing out over it)
    const dn = fem && c < 0 ? (1 - sit) * (F.seat * 0.2 * gau(back - 1.32, 0.24) * gau((f < 0 ? f / sk : f) + 0.01, 0.075) + w * 0.09 * gau(back - 1.05, 0.38) * ss3(-0.07, -0.17, f < 0 ? f / sk : f)) * (1 - clamp01(out / 0.008)) : 0;
    let x = xf + (dd + out - dn) * cs;
    // (her bust: two rounds, full below and sloping gently above, either side of the breastbone - a soft hollow between
    // them, bridged as cloth over them bridges it: more the looser it is)
    // (each a teardrop: narrower toward its top, where it slopes into the chest)
    // (in a structured bodice (F.lift: a corset's, a sweetheart's, a plunge's) lifted and drawn in, as its boning and its
    // cups hold them: higher, a share more forward, each round's middle nearer the breastbone; its under-curve firm and
    // round to a clean fold (an underwire's), its top a full dome; its inner side pressed full nearly to the midline, the
    // two meeting in a narrow crease - the cloth over them bridging it above their fullest; below it the bodice's centre
    // back in on the breastbone between the cups (a corset's gore), its cloth under them running straight on down to the
    // ribs (LIFT_UC). Along its edge (F.edgeD: how far from the neckline) the cloth pressed to her, lying as her skin does)
    if (c > 0) {
      const L = F.lift || 0, fb = f - (F.bf ?? 0.655) - 0.02 * L, aa = Math.abs(ang), c0 = 0.5 - 0.08 * L, so = 0.32 - 0.075 * ss3(0, 0.16, fb);
      // (cloth over her natural shape draping a little under the rounds - not drawn in to their fold)
      // (its weight in its lower half: full below the fullest and rounding under to the fold - a teardrop's, not a
      // ball's; its upper slope long and gentle into the chest. The lower half's round as long as her projection asks -
      // seen in profile round at its fullest, never a point where the two halves meet)
      let m = orS(gau(aa - c0, so), (0.45 + 0.4 * clamp01(out / 0.012)) * gau(ang, 0.5)), vb = fb < 0 ? Math.exp(-((-fb / (0.095 + 0.02 * clamp01(out / 0.006))) ** 2.5)) : gau(fb, 0.13);
      if (L) {
        const u = clamp01(1 - Math.sqrt(ang * ang + 0.000625) / c0), pr = aa < c0 ? 0.4 + 0.6 * Math.sqrt(1 - u * u) : Math.exp(-(((aa - c0) / so) ** 2.4));
        const wc = out > 0 && fb > -0.32 && fb < 0.3 ? clamp01(out / 0.006) * (F.edgeD ? ss3(0.004, 0.03, F.edgeD(f, ang)) : 1) * (F.crop ? ss3(F.crop, F.crop + 0.1, f) : 1) : 0;
        m += (orS(pr, 0.9 * wc * gau(ang, 0.3) * (fb < 0 ? 0.35 + 0.65 * ss3(-0.06, 0, fb) : 1)) - m) * L;
        // (the fold firm under each round, fading toward the breastbone - the inner sides' foot easing down on to it, as
        // the fold does there: no shelf at the cleavage's foot)
        // (the cloth's line under a fuller bust no flatter than under a lighter one: its slope a share of her own bust's
        // projection - falling from the fullest as steeply, and reaching the ribs the lower)
        const h = fb < 0 ? Math.max(0, 1 - (fb / 0.095) ** 2) ** 0.8 : Math.exp(-((fb / 0.135) ** 2.2)), U = LIFT_UC, sU = U.s * Math.min(1, U.b / Math.max(0.01, F.bust)), ws = Math.max(wc, 0.85 * gau(ang, 0.22));
        vb += (h + (fb < 0 ? U.k * Math.log1p(Math.exp((1 - sU * U.r * (Math.sqrt(1 + (fb / U.r) ** 2) - 1)) / U.k)) - h : 0) * ws - vb) * L;
      }
      x += c * (F.bust * (1 + 0.06 * L) * vb * m + F.pec * gau(f - 0.66, f < 0.66 ? 0.06 : 0.11) * gau(aa - 0.45, 0.45));
    }
    // (the shoulder blades; the seat - hers two rounds, highest a little below the hips' joints, curving under into the
    // backs of the thighs, bridged as the bust is)
    // (sitting, the seat's rounds taken up with it as its sections are (sk) - full where the seat is, not on down below it)
    // (hers sitting, pressed on the seat under her: spread, not standing out behind as a shelf - a share of it, sitting)
    // (hers generous, round and lifted - in profile an egg, never a ledge: its fullest (gz) a little below the middle of
    // the cheeks, the round there broad. Above, the upper shelf grows out of the small of the back over a long, soft rise
    // - a bell's falloff (a gaussian's, eased in a little above the fullest: no onset, no cutoff), nothing of it at the
    // waist, then easing out more steeply and rounding over (no step, no corner where it leaves the lower back); its top
    // edge drawn in, the volume carried in the middle of the cheek. Where the hips' own sections are fullest, under it,
    // the round eased off a share (dip) - the two together one broad curve, not a point. Below, held full - rounder than
    // above - then turning under (vS) to the gluteal fold on the backs of the thighs, the thighs' backs full up to meet it
    // (legForm: gl): a crease near the cleft, easing out toward the side - the lower, outer round running on smoothly
    // into the thigh (lo shorter and the turn softer there) - each round's under-curve lowest a share out from the cleft
    // and rising toward it and toward the hip. Across, two rounds, each's middle a share out from the spine (its fullest
    // well inside the hips' width), wrapping round toward the hip; the cleft between them a soft groove on the skin,
    // opening a little toward the fold, bridged by cloth - the envelope across the back nearly flat, never a ridge down
    // the middle. Sitting, spread on the seat under her: a softer round, never a crease where its halves meet)
    else if (fem) { const fs = f < 0 ? f / sk : f, u = fs - (F.gz ?? -0.055), lat = ss3(0.45, 1.15, back), lo = 0.14 * (1 - 0.6 * lat) * (1 - 0.3 * gau(back, 0.25)), vS = (u >= 0 ? Math.exp(-((0.012 * Math.log1p(Math.exp((u - 0.04) / 0.012)) / 0.16) ** 2)) : Math.exp(-((-u / lo) ** Math.max(2, (3.5 - 1.3 * lat) * (1 - 0.5 * sit))))) * (1 - 0.1 * gau(u + 0.01, 0.05)), cl = (0.55 + 0.17 * clamp01(out / 0.006)) * gau(back, 0.3) * (1 - 0.45 * ss3(-0.02, -0.1, u)); x += c * (0.006 * gau(f - 0.78, 0.08) * gau(back - 0.6, 0.4) + F.seat * (1 - 0.45 * sit) * vS * orS(gau(back - 0.4, back < 0.4 ? 0.28 : 0.42), cl)); }
    else { const fs = f < 0 ? f / sk : f; x += c * (0.006 * gau(f - 0.78, 0.08) * gau(back - 0.6, 0.4) + F.seat * gau(fs + 0.05, fs < -0.05 ? 0.06 : 0.13) * Math.max(gau(back - 0.5, 0.42), 0.82 * gau(back, 0.4))); }
    const z = (wSide(f, w, sn) + out - dn) * sn, ro = rollAt(f, z);
    return V(x, f * H - 0.11 + z * Math.sin(ro), z * Math.cos(ro)).applyQuaternion(q).add(A);
  };
  const c = (f) => V(sec(f)[2], f * H - 0.11, 0).applyQuaternion(q).add(A);
  // (the torso's way out at f, an: across its surface there)
  const nT = (f, an) => { const e = 0.004, n = new THREE.Vector3().subVectors(pt(f + e, an), pt(f - e, an)).cross(new THREE.Vector3().subVectors(pt(f, an + e), pt(f, an - e))).normalize(); return n.dot(pt(f, an).sub(c(f))) < 0 ? n.negate() : n; };
  // (the nearest point of the torso's surface to p - lifted by off, cloth on it: its section (f), the angle round it
  // (an), its way out there (n) and how far p is out of it along that (s; inside: < 0). Found across the section from its
  // middle, then along the surface's own way out - over the shoulder's round and up the trapezius, where it slopes)
  const qi = q.clone().invert();
  // (its rolls undone: the section a point is in, its own height before it was rolled)
  const across = (p) => { const v = p.clone().sub(A).applyQuaternion(qi); let f = (v.y + 0.11) / H, z = v.z; for (let i = 0; i < 3; i++) { const ro = rollAt(f, z); z = v.z / Math.cos(ro); f = (v.y - z * Math.sin(ro) + 0.11) / H; } const [w, dd, xf] = sec(f); return [f, Math.atan2(z / wSide(f, w, z), (v.x - xf) / dd)]; };
  const near = (p, off = 0) => {
    let [f, an] = across(p), n = nT(f, an), s = p.clone().sub(pt(f, an, off)).dot(n);
    for (let i = 0; i < 3; i++) { [f, an] = across(p.clone().addScaledVector(n, -s)); n = nT(f, an); s = p.clone().sub(pt(f, an, off)).dot(n); }
    return { f, an, n, s };
  };
  /**
   * Her arms grown out of her shoulders (AR: each { S (the shoulder's joint), u (down the upper arm), L (its length) };
   * k: the fillet's size, a share of the deltoid) -> arm(g, i, off, o): an arm's surface (AR[i]'s - its skin, or a sleeve
   * over cloth off the torso) made one with the shoulder's: along the line where it comes out of the torso a smooth union
   * of the two - a fillet as wide as a share of k either side of that line, as high as the arm leaves the torso steeply
   * (none where the two only lie close together: no swelling, no rim) - its torso's half laid over the torso's surface,
   * the rest of the arm in the torso left there, unseen; lit and shaded as the torso is where it lies on it (o.col(x, y, z):
   * the skin's own shading) - no crease, no line where one would cross the other, neither showing through the other
   * (o.bare(f, an): how bare the torso is there - no fillet onto cloth, the arm crossing a bodice's edge cleanly). Near its
   * top only - fading out from 0.12 to 0.4 of the upper arm: the armpit's fold, never a web between the arm and the side
   */
  // (AS: each arm's own surface out of the torso by where it leaves it - points, their way out, the fillet's size there and
  // the cloth it was laid on (off) - for the torso's side of the same join: side(g, off))
  const arms = (AR, k) => { const AS = [[], []], arm = (g, i, off = 0, o = {}) => {
    const a = AR[i], P = g.attributes.position, N = g.attributes.normal, C = g.attributes.color, UV = g.attributes.uv, nv = P.count, e = 0.03 * k, W = new Float32Array(nv).fill(-1), p = V(0, 0, 0), u = V(0, 0, 0);
    // (each point near its top: how far it is out of the torso (S; inside < 0) and the torso's nearest point (MM); its rings
    // of M points each, the first its dome's pole - so each column runs up the arm from its end over the top)
    const S = new Float32Array(nv).fill(NaN), MM = [], KQ = new Float32Array(nv), P0 = Float32Array.from(P.array), NA = Float32Array.from(N.array);
    let M = 1; while (M < nv && UV.getY(M) === UV.getY(0)) M++;
    // (a hem's rings - turned back in under its end, after its last (KH) - left out: each follows the ring it lies under)
    const K = nv / M, ax = (r) => { let t = 0; for (let c = 0; c < M; c++) { p.fromBufferAttribute(P, r * M + c); t += u.subVectors(p, a.S).dot(a.u); } return t / M; };
    let KH = K; for (let r = 1, t0 = ax(0); r < K; r++) { const t1 = ax(r); if (t1 <= t0 + 1e-6) { KH = r; break; } t0 = t1; }
    for (let j = 0; j < KH * M; j++) { p.fromBufferAttribute(P, j); const kq = k * (1 - ss3(0.12 * a.L, 0.4 * a.L, u.subVectors(p, a.S).dot(a.u))); if (kq < 1e-4) continue; MM[j] = near(p, off); S[j] = MM[j].s; KQ[j] = kq; }
    // (where it goes in and out of the torso: each step up a column from a point outside to one inside or back - between the
    // two the crossing (x), in order up the column (i), and how steeply the arm leaves the torso there (tn, its slope: from
    // the next point out))
    const XC = [], q = V(0, 0, 0);
    for (let c = 0; c < M; c++) {
      XC[c] = [];
      for (let r = K - 2; r >= 0; r--) {
        const v = r * M + c, w = v + M; if (isNaN(S[v]) || isNaN(S[w]) || (S[v] < 0) === (S[w] < 0)) continue;
        const [vi, vo] = S[v] < 0 ? [v, w] : [w, v], pi = V(P.getX(vi), P.getY(vi), P.getZ(vi)), po = V(P.getX(vo), P.getY(vo), P.getZ(vo)), x = po.clone().lerp(pi, S[vo] / (S[vo] - S[vi]));
        const vo2 = vo + (vo - vi), o2 = vo2 >= 0 && vo2 < nv && S[vo2] >= S[vo] ? vo2 : vo; q.fromBufferAttribute(P, o2);
        const sn = clamp01(S[o2] / Math.max(1e-6, q.distanceTo(x))); XC[c].push({ x, tn: Math.min(1, sn / Math.sqrt(Math.max(0.01, 1 - sn * sn))) });
      }
    }
    // (the crossings' lines: each from a column's crossing to the next column's, the same in order up them -> how far p is
    // from the nearest, and the slope there)
    const seg = (p) => {
      let best = 9, tb = 0;
      for (let c = 0; c < M; c++) for (let i = 0; i < XC[c].length; i++) {
        const A0 = XC[c][i], B0 = XC[(c + 1) % M][i] || A0, ab = B0.x.clone().sub(A0.x), l2 = ab.lengthSq(), t = l2 > 1e-12 ? clamp01(p.clone().sub(A0.x).dot(ab) / l2) : 0, dd = p.distanceTo(A0.x.clone().addScaledVector(ab, t));
        if (dd < best) { best = dd; tb = A0.tn + (B0.tn - A0.tn) * t; }
      }
      return [best, tb];
    };
    for (let j = 0; j < nv; j++) {
      const s = S[j]; if (!(s < KQ[j])) continue;
      // (the fillet over the corner where the two meet - its round a share of k (kq) either side of the crossing, as high
      // as the arm leaves steeply: a smooth max of the two, m(kq - x)²/4kq, x across the torso from the crossing - none
      // where they run on together, so no swelling where the arm only lies close along the torso; none onto cloth
      // (o.bare). Inside: its own half of the fillet laid over the torso's surface by the corner, the arm under it beyond
      // that - where the fillet is thinner than a hair (2e) a hair under the surface, unseen: the torso's own skin and its
      // light shown there, never a patch of the arm's over it)
      // (a floor to its height where the two meet at a shallow angle - the armpit's folds, under a raised arm: a share of
      // the full round, never a bare crease there; a raised arm's (up past level) the narrower - its torso's half under the
      // skin, no ring standing round the arm's root)
      const m = MM[j], nt = m.n, kq = KQ[j] * (1 - 0.4 * ss3(-0.1, 0.4, a.u.y)), na = V(N.getX(j), N.getY(j), N.getZ(j)), fa = ss3(0.995, 0.8, na.dot(nt)); p.fromBufferAttribute(P, j);
      if (s < 0) p.addScaledVector(nt, -s);
      const [d, tn] = seg(p), xh = s > 0 ? d / Math.sqrt(1 + tn * tn) : d;
      // (beyond the fillet, inside: kept a few hairs under the surface - the torso's faces between its points never
      // uncovering it - and lit as the torso is, should they)
      // (a sleeve's (o.sink: laid on a bodice that lies a hair under off) sunk under that bodice by sink: never the two
      // cloths within a hair of each other, crossing in torn steps)
      const sn = o.sink || 0;
      if (s < 0 && xh >= kq) { p.addScaledVector(nt, Math.min(s, -3 * e - sn)); P.setXYZ(j, p.x, p.y, p.z); W[j] = 1; continue; }
      const bw = o.bare ? o.bare(m.f, m.an) : 1, fl = xh < kq ? Math.max(tn, 0.35) * (kq - xh) ** 2 / (4 * kq) * bw : 0;
      // (inside: its half laid on the surface, as high as the fillet there - under it by a hair where the fillet is thinner,
      // none at the crossing itself, so the two halves meet there; lit as the torso is until it rises clear of it. A
      // sleeve's going on under the bodice beneath it over the whole of the fillet's width - one smooth line where the
      // bodice closes over it)
      const hg = s < 0 ? fl - (2 * e + sn) * ss3(0, sn ? kq : 0.4 * kq, xh) : fl;
      p.addScaledVector(nt, hg);
      if (s >= 0) { const m2 = near(p, off); if (m2.s < e) p.addScaledVector(m2.n, e - m2.s); }
      // (its light across the join a smooth union's: by the crossing half the torso's and half its own, on both sides of it
      // - its half laid on the torso, the torso's own beside it (side) - each easing back to its own over the fillet's
      // width: no line of light or shade where one leaves the other)
      P.setXYZ(j, p.x, p.y, p.z); W[j] = s < 0 ? 1 - 0.5 * bw * ss3(kq, 0, xh) : Math.max((1 - fa) * ss3(0.5 * kq, -0.1 * kq, s), 0.5 * bw * ss3(kq, 0, d));
    }
    for (let r = KH; r < K; r++) { const pr = Math.max(0, 2 * KH - 1 - r); for (let c = 0; c < M; c++) { const j = r * M + c, jp = pr * M + c; P.setXYZ(j, P.getX(j) + P.getX(jp) - P0[jp * 3], P.getY(j) + P.getY(jp) - P0[jp * 3 + 1], P.getZ(j) + P.getZ(jp) - P0[jp * 3 + 2]); W[j] = W[jp]; } }
    g.computeVertexNormals();
    // (its own surface by the join, where it ends up - its own round's light there and how much of it it shows (1 - W):
    // the torso's side of the join lit the same where they meet - side)
    if (o.rec !== false) { const kA = 1 - 0.4 * ss3(-0.1, 0.4, a.u.y); for (let j = 0; j < KH * M; j++) if (!isNaN(S[j])) AS[i].push([P.getX(j), P.getY(j), P.getZ(j), NA[j * 3], NA[j * 3 + 1], NA[j * 3 + 2], KQ[j] * kA, off, W[j] < 0 ? 1 : 1 - W[j]]); }
    // (where it lies on the torso, its light the torso's and its colour too - a sleeve's its bodice's; where the two run on
    // together, so little apart that no fillet is asked, the torso's light carried on out over it - no line where they meet)
    for (let j = 0; j < nv; j++) {
      p.fromBufferAttribute(P, j);
      // (its own light there its own round's, as it was before it was laid on the torso)
      if (W[j] > 0) { const n2 = near(p, off).n, w = W[j], B0 = isNaN(S[j]) ? N.array : NA, x = B0[j * 3] * (1 - w) + n2.x * w, y = B0[j * 3 + 1] * (1 - w) + n2.y * w, z = B0[j * 3 + 2] * (1 - w) + n2.z * w, l = Math.hypot(x, y, z) || 1; N.setXYZ(j, x / l, y / l, z / l); if (C && !o.col) C.setXYZ(j, C.getX(j) + (1 - C.getX(j)) * w, C.getY(j) + (1 - C.getY(j)) * w, C.getZ(j) + (1 - C.getZ(j)) * w); }
      if (C && o.col) { const c3 = o.col(p.x, p.y, p.z); C.setXYZ(j, C.getX(j) * c3[0], C.getY(j) * c3[1], C.getZ(j) * c3[2]); }    }
    return g;
  };
  /**
   * The torso's side of each arm's join (g: its skin, or the bodice an arm's sleeve was laid on - off): its light eased
   * toward the arm's own round as the arm's nearest point there is (half of each by the line where the arm leaves it,
   * less toward where the arm's half laid on it goes under it) - fading out over the fillet's width; never toward an arm
   * lying close beside it facing the other way (under it)
   */
  // (its own light first eased into the torso's true round - by the join itself, and, ez, over the shoulder's round about
  // the joint (a bodice's, as the skin's already is): what the arm's half laid on it is lit as)
  arm.side = (g, off = 0, ez = 0) => {
    const P = g.attributes.position, N = g.attributes.normal, q = V(0, 0, 0), bl = (j, n, w) => { const x = N.getX(j) + (n[0] - N.getX(j)) * w, y = N.getY(j) + (n[1] - N.getY(j)) * w, z = N.getZ(j) + (n[2] - N.getZ(j)) * w, l = Math.hypot(x, y, z) || 1; N.setXYZ(j, x / l, y / l, z / l); };
    for (let i = 0; i < 2; i++) {
      const a = AR[i], L = AS[i].filter((x) => Math.abs(x[7] - off) < 0.0025); if (!L.length) continue;
      // (only what lies within reach of it: its points' box, out by twice the fillet's width)
      const bx = new THREE.Box3(); for (const x of L) bx.expandByPoint(q.set(x[0], x[1], x[2])); bx.expandByScalar(2 * k);
      for (let j = 0; j < P.count; j++) {
        q.fromBufferAttribute(P, j); const dS = ez ? q.distanceTo(a.S) : 9; if (dS > 3 * k && !bx.containsPoint(q)) continue;
        let b = null, bd = 1e9; for (const x of L) { const dd = (q.x - x[0]) ** 2 + (q.y - x[1]) ** 2 + (q.z - x[2]) ** 2; if (dd < bd) { bd = dd; b = x; } }
        const db = Math.sqrt(bd), wT = Math.max(ss3(3 * k, 1.75 * k, dS), ss3(2 * b[6], b[6], db)); if (wT > 0) { const n2 = near(q, off).n; bl(j, [n2.x, n2.y, n2.z], wT); }
        const w = b[8] * ss3(b[6], 0, db) * ss3(0, 0.5, N.getX(j) * b[3] + N.getY(j) * b[4] + N.getZ(j) * b[5]); if (w > 0) bl(j, [b[3], b[4], b[5]], w);
      }
    }
    return g;
  };
  return arm; };
  return { pt, c, sec: (f) => sec(f).slice(), H, q, A, fLo: F.tor[0][0] * sk, arms, near };
}
/**
 * A band of a torso's surface (or of cloth on it), all the way round: from lo up to hi (f: numbers, or functions of the
 * angle round from the front - a neckline, a hem), lifted by out (a number or out(f, ang)); o: { m (points round), rows,
 * hem ('lo' | 'hi' | 'both': a cloth's edge, turned under it by th), cap ('lo' | 'hi' | 'both': the band closed there) }
 * -> geometry
 */
/**
 * Rows down a torso from f0 to f1 gathered where den(f) asks (how many times as close as elsewhere - over a shoulder's
 * round, where the cloth turns from the arm's side to the trapezius), evenly in f elsewhere, the spacing easing smoothly
 * between - never one row close and the next far, a stripe of light between them -> (u: 0..1, evenly) -> that row's
 * share of the way from f0 to f1
 */
function rowsBy(f0, f1, den) {
  const N = 128, C = [0];
  for (let i = 0; i < N; i++) C.push(C[i] + den(f0 + ((f1 - f0) * (i + 0.5)) / N));
  // (k: how many more rows that asks for, the rest as close as before)
  const map = (u) => { const c = u * C[N]; let i = 0; while (i < N - 1 && C[i + 1] < c) i++; return (i + clamp01((c - C[i]) / (C[i + 1] - C[i] || 1))) / N; };
  map.k = C[N] / N; return map;
}
function band(T, lo, hi, out = 0, o = {}) {
  // (curv: its rows gathered where curv(f) asks (rowsBy) - more of them over his shoulders' round, the cloth as round
  // there as he is, never a chamfer for a sleeve's top to stand out of; measured down its sides, between its edges there)
  let M = n(o.m ?? 44, 8); const L = typeof lo === 'function' ? lo : () => lo, U = typeof hi === 'function' ? hi : () => hi, O = typeof out === 'function' ? out : () => out, th = o.th ?? 0.004;
  const cv = o.curv && Q >= 0.6 ? rowsBy(L(Math.PI / 2), U(Math.PI / 2), o.curv) : null, R = n(Math.round((o.rows ?? 12) * (cv ? cv.k : 1)), 2);
  // (dense: its columns closer together toward the front, by that share; level: its rows level across the front - a low
  // neckline's steep sides then cut across them, never long slivers of cloth slanting up to it across the bust - until
  // a little short of the edge (eZ), then each column's last rows spread on up to it, every column ending on the edge
  // itself: no row stepping on to it from one column to the next; round the sides and the back its rows spaced from the
  // lower edge to the upper. level a number (an f): its rows gathered closer there - over a bust's fullest - by a
  // density's quantiles (W), as many as ever)
  // (follow: where its upper edge climbs steeply across the front - a plunge's sides - more columns, each one's top within
  // ~0.04 of the next's, half of them taken from the rest of the way round: never a long straight sliver of cloth from one
  // column's top to the next's, cut across the bust's curve and sunk under the skin there)
  const dn = (u) => u - (o.dense || 0) * Math.sin(u);
  let angs = Array.from({ length: M }, (_, j) => dn((j / M) * 2 * Math.PI - Math.PI));
  if (o.follow && typeof hi === 'function' && Q >= 0.6) {
    const G = 720, du = (2 * Math.PI) / G, st = []; let tv = 0;
    for (let i = 0; i < G; i++) { const u = -Math.PI + i * du, s = Math.abs(U(dn(u + du)) - U(dn(u))) * ss3(1.1, 0.7, Math.abs(dn(u + du / 2))); st.push(s); tv += s; }
    const X = Math.min(Math.round(0.45 * M), Math.round((o.follow * tv) / 0.04));
    if (X >= 2) {
      const Mt = M + Math.round(X / 2), C = [0]; for (let i = 0; i < G; i++) C.push(C[i] + (Mt - X) / G + (X * st[i]) / tv);
      angs = []; for (let j = 0, i = 0; j < Mt; j++) { const c = (j * C[G]) / Mt; while (C[i + 1] < c) i++; angs.push(dn(-Math.PI + (i + (c - C[i]) / (C[i + 1] - C[i])) * du)); }
      M = Mt;
    }
  }
  const hem = Q < 0.6 ? '' : o.hem || '', cap = o.cap || '';
  const uM = o.level ? Math.max(...angs.map(U)) : 0, f00 = L(0), eZ = 0.045;
  const W = (() => {
    if (typeof o.level !== 'number' || !(uM > f00)) return (s) => s;
    const N = 128, C = [0]; for (let i = 0; i < N; i++) C.push(C[i] + 1 + 1.4 * gau(f00 + ((uM - f00) * (i + 0.5)) / N - o.level, 0.08));
    return (s) => { const c = s * C[N]; let i = 0; while (i < N - 1 && C[i + 1] < c) i++; return (i + (c - C[i]) / (C[i + 1] - C[i])) / N; };
  })();
  const ring = (s, dOut = 0) => {
    const w = W(s);
    return angs.map((a) => {
      const f0 = L(a), u = U(a), fc = f0 + (u - f0) * s, wl = o.level ? ss3(1.5, 0.9, Math.abs(a)) : 0; let f = fc;
      if (wl) { const wg = clamp01((u - eZ - f0) / (uM - f0)), gf = f0 + (uM - f0) * wg, fv = w <= wg ? f0 + (uM - f0) * w : gf + ((u - gf) * (w - wg)) / (1 - wg); f = fc + (fv - fc) * wl; }
      return T.pt(f, a, O(f, a) + dOut);
    });
  };
  const rings = [];
  if (cap === 'lo' || cap === 'both') rings.push(Array(M).fill(T.c(L(0) - 0.01)));
  if (hem === 'lo' || hem === 'both') rings.push(ring(0, -th));
  for (let i = 0; i <= R; i++) rings.push(ring(cv ? cv(i / R) : i / R));
  if (hem === 'hi' || hem === 'both') rings.push(ring(1, -th));
  if (cap === 'hi' || cap === 'both') rings.push(Array(M).fill(T.c(U(0) + 0.01)));
  // (top(a): its upper edge as built - straight from one column's top to the next - for the skin above a low neckline
  // to meet the cloth's own edge, not the line it was cut to between its columns; angs: its columns, for the skin's along
  // that edge)
  const g = loft(rings), UA = angs.map(U); g.userData.m = M; g.userData.angs = angs;
  g.userData.top =(a) => { const b = a - 2 * Math.PI * Math.floor((a + Math.PI) / (2 * Math.PI)); let j = 0; while (j < M - 1 && angs[j + 1] <= b) j++; const a0 = angs[j], a1 = j < M - 1 ? angs[j + 1] : angs[0] + 2 * Math.PI, u1 = j < M - 1 ? UA[j + 1] : UA[0]; return UA[j] + (u1 - UA[j]) * clamp01((b - a0) / (a1 - a0)); };
  return g;
}
/**
 * A loft (g, of R rows of A's columns) whose columns marked in A.ins were wanted only up to its row rS: above it each one's
 * points gathered on to the nearest column of the rest - the faces between them gone, its light the other's -> g
 */
function gatherCols(g, A, rS) {
  if (!A.ins || !(rS >= 0)) return g;
  const W = A.length, dw = (x, y) => Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y)));
  const CO = A.ins.map((v, j) => { if (!v) return j; let b = j, d = 9; for (let q = 0; q < W; q++) if (!A.ins[q] && dw(A[q], A[j]) < d) { d = dw(A[q], A[j]); b = q; } return b; });
  const ix = g.index.array, nx = [], re = (i) => { const k = Math.floor(i / W); return k > rS ? k * W + CO[i - k * W] : i; };
  for (let t = 0; t < ix.length; t += 3) { const a = re(ix[t]), b = re(ix[t + 1]), c = re(ix[t + 2]); if (a !== b && b !== c && a !== c) nx.push(a, b, c); }
  g.setIndex(nx); g.computeVertexNormals(); return g;
}
/**
 * A piece of cloth on a torso between two angles round it (a blazer's body, its lapels): rows from f0 to f1, at each the
 * angles from a0(f) to a1(f) (a1 past pi goes on round the back), lifted by out(f, ang), its edges turned under -> geometry
 */
function panel(T, f0, f1, a0, a1, out, o = {}) {
  const O = typeof out === 'function' ? out : () => out, cv = o.curv && Q >= 0.6 ? rowsBy(f0, f1, o.curv) : null;   // (curv: as a band's - rowsBy)
  return sheet((u, v, s) => { const f = f0 + (f1 - f0) * (cv ? cv(u) : u), A0 = a0(f), a = A0 + (a1(f) - A0) * v; return T.pt(f, a, O(f, a) - s); }, n(Math.round((o.rows ?? 14) * (cv ? cv.k : 1)), 3), n(o.cols ?? 30, 6), o.th ?? 0.004, T.c(f0 + (f1 - f0) * 0.5));
}
/**
 * A piece of cloth through P(u, v, sink) (u, v: 0..1 down and across it; sink: how far under its face): R rows, C columns,
 * a rim - the outer rows and columns again, sunk by th: the cloth's thickness at its edges - facing away from mid -> geometry
 */
function sheet(P, R, C, th, mid) {
  const pos = [], idx = [], W = C + 3;
  for (let i = -1; i <= R + 1; i++) for (let j = -1; j <= C + 1; j++) { const p = P(clamp01(i / R), clamp01(j / C), i < 0 || i > R || j < 0 || j > C ? th : 0); pos.push(p.x, p.y, p.z); }
  for (let i = 0; i < R + 2; i++) for (let j = 0; j < C + 2; j++) { const a = i * W + j, b = a + 1, c = a + W + 1, d = a + W; idx.push(a, b, c, a, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  // (facing out: away from the middle - the torso's, the neck's)
  g.computeVertexNormals(); const P2 = g.attributes.position, N = g.attributes.normal, m = Math.floor((R + 2) / 2) * W + Math.floor(W / 2);
  return (P2.getX(m) - mid.x) * N.getX(m) + (P2.getZ(m) - mid.z) * N.getZ(m) < 0 ? inward(g) : g;
}
/** g's faces turned the other way round -> g */
const inward = (g) => { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); return g; };
/** a piece's lining: the same a hair inside it (g), facing in, in shadow -> g */
const lining = (g) => tint(inward(g), 0.45);

/**
 * A limb along joints P (shoulder, elbow, wrist; hip, knee, ankle), from t0 to t1 of the way along: rings round it, bent
 * smoothly through the middle joint; rad(t) its radius, back(t) how far its middle is pushed behind (a calf), ka(t, a)
 * its radius' share round it (a from its back: a muscle's round), sq its section's depth to its width; domed at its start
 * (dome 'a'), its end ('b') or both -> geometry
 */
function limbAlong(P, rad, o = {}) {
  const [P0, P1, P2] = P, d1 = new THREE.Vector3().subVectors(P1, P0), d2 = new THREE.Vector3().subVectors(P2, P1), L1 = Math.max(0.01, d1.length()), L2 = Math.max(0.01, d2.length()), L = L1 + L2, tj = L1 / L; d1.normalize(); d2.normalize();
  // (a dome hidden inside something else - a thigh's top in the hips, a wrist's end in the hand - left off a lighter person)
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1, K = n(o.k ?? 16, Math.min(4, o.k ?? 16)), M = n(o.m ?? 16, Math.min(6, o.m ?? 16)), bw = 0.05 + 0.06 * (1 - d1.dot(d2)), sq = o.sq ?? 1, dome = Q < 0.6 && o.hidden ? '' : o.dome ?? '';
  const at = (t) => t <= tj ? P0.clone().addScaledVector(d1, t * L) : P1.clone().addScaledVector(d2, (t - tj) * L);
  const tan = (t) => d1.clone().lerp(d2, ss3(tj - bw, tj + bw, t)).normalize();
  // (a frame carried along it: N toward the limb's back - side, the axis a leg bends about - B across)
  const side = o.side || V(0, 0, 1), fr = [];
  let N = new THREE.Vector3().crossVectors(tan(t0), side); if (N.lengthSq() < 0.01) N = new THREE.Vector3().crossVectors(tan(t0), V(1, 0, 0)); N.normalize();
  // (dense: its rings closer together toward its start, by that power - where an arm grows out of the shoulder)
  const ts = Array.from({ length: K + 1 }, (_, i) => t0 + (t1 - t0) * (i / K) ** (o.dense ?? 1)); let Tp = tan(t0);
  for (const t of ts) { const T = tan(t); N.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Tp, T)); N.addScaledVector(T, -N.dot(T)).normalize(); Tp = T; fr.push([T, N.clone(), new THREE.Vector3().crossVectors(T, N)]); }
  const ring = (i, k = 1, h = 0) => { const [T, Nn, B] = fr[i], t = ts[i], r = rad(t) * k, c = at(t).addScaledVector(Nn, o.back ? o.back(t) : 0).addScaledVector(T, h); return ringOf(c, Nn, B, r * sq, r, M, o.ka ? (a) => o.ka(t, a) : null); };
  const rings = ts.map((_, i) => ring(i));
  // (a dome: rings drawn in to a point - fewer on a lighter person)
  // (capA: how high the start's dome rises for its width - an arm's at the shoulder low, under the shoulder's round)
  const cap = (i, sgn, h = 0.85) => { const r = rad(ts[i]); return (Q < 0.6 ? [0.72] : [0.94, 0.75, 0.42]).map((k) => ring(i, k, sgn * r * h * Math.sqrt(1 - k * k))).concat([Array(M).fill(at(ts[i]).addScaledVector(fr[i][1], o.back ? o.back(ts[i]) : 0).addScaledVector(fr[i][0], sgn * r * h))]); };
  if (dome.includes('a')) rings.unshift(...cap(0, -1, o.capA ?? 0.85).reverse());
  if (dome.includes('b')) rings.push(...cap(K, 1));
  // (a hem: the cloth's end turned in under itself, so its edge has a thickness - in to what is under it (hemTo: its
  // radius), nothing to see up into)
  // (seal: closed a little up inside its hem - nothing to see through looking in at its end)
  else if (o.hem && Q >= 0.6) { const kIn = (i) => { const r = rad(ts[i]); return Math.max(0.5, Math.min(1 - 0.0035 / r, o.hemTo ? (o.hemTo(ts[i]) - 0.0005) / r : 1)); }; rings.push(ring(K, kIn(K)), ring(K - 1, kIn(K - 1))); if (o.seal) rings.push(Array(M).fill(at(ts[K - 1]).addScaledVector(fr[K - 1][1], o.back ? o.back(ts[K - 1]) : 0))); }
  return loft(rings);
}
/** the joint between a and b (a hip and an ankle) on limbs L1 and L2 long, bent out toward dir - straight when they only just reach -> Vector3 */
function midJoint(a, b, L1, L2, dir) {
  const u = new THREE.Vector3().subVectors(b, a), d = Math.max(1e-4, u.length()); u.multiplyScalar(1 / d);
  const al = Math.min(L1, (L1 * L1 - L2 * L2 + d * d) / (2 * d)), w = dir.clone().addScaledVector(u, -dir.dot(u)).normalize();
  return a.clone().addScaledVector(u, al).addScaledVector(w, Math.sqrt(Math.max(0, L1 * L1 - al * al)));
}
/**
 * an arm's radius along it: the deltoid capping the shoulder, the upper arm, the elbow, the forearm full below it, the
 * wrist (R: the figure's arm, tj: where the elbow is; fem: her deltoid rounding out a little below the top of the shoulder,
 * its fullest a fifth of the way down the upper arm, slimming into the arm by halfway - its top within the shoulder's
 * round; his top a little within it too, no rim of a sleeve's top standing out at the shoulder's tip - but a jacket's sleeve (pad)
 * full at its top, set on under its padding) -> rad(t)
 */
function armRad(R, tj, del, fem = false, pad = false) {
  const [ru, re, rf, rw] = R;
  const rows = fem ? [[0, del * 0.72], [0.05 * tj, del * 0.78], [0.12 * tj, del], [0.22 * tj, del * 1.03], [0.45 * tj, ru * 1.02], [0.6 * tj, ru], [0.82 * tj, ru * 0.88], [tj, re], [tj + 0.22 * (1 - tj), rf], [tj + 0.55 * (1 - tj), rf * 0.82], [1, rw]]
    : [[0, del * (pad ? 1 : 0.8)], [0.06 * tj, del * (pad ? 0.98 : 0.95)], [0.12 * tj, del * 0.96], [0.32 * tj, ru * 1.04], [0.55 * tj, ru], [0.82 * tj, ru * 0.88], [tj, re], [tj + 0.22 * (1 - tj), rf], [tj + 0.55 * (1 - tj), rf * 0.82], [1, rw]];
  return (t) => spline(rows, t)[0];
}
/**
 * a leg's: the thigh, the knee, the calf, the ankle (R: the figure's leg, tj: where the knee is; fem: hers fullest at
 * its top, just under the seat - the hips' line carried on down into it, tapering to a slim knee; below it the calf,
 * then a long taper to the slimmest just above the ankle's bones) -> rad(t)
 */
function legRad(R, tj, fem = false) {
  const [rt, rm, rk, rc, ra] = R, sh = (u) => tj + u * (1 - tj);
  const rows = fem ? [[0, rt * 0.82], [0.1 * tj, rt * 0.97], [0.22 * tj, rt], [0.42 * tj, rt * 0.93], [0.64 * tj, rm], [0.86 * tj, rk * 1.1], [tj, rk], [sh(0.1), rk * 1.02], [sh(0.3), rc], [sh(0.52), rc * 0.84], [sh(0.72), ra * 1.1], [sh(0.86), ra * 0.92], [1, ra]]
    : [[0, rt * 0.7], [0.18 * tj, rt * 0.9], [0.36 * tj, rt * 0.9], [0.62 * tj, rm], [0.9 * tj, rk * 1.08], [tj, rk], [sh(0.08), rk * 1.03], [sh(0.3), rc], [sh(0.62), rc * 0.74], [0.97, ra], [1, ra]];
  return (t) => spline(rows, t)[0];
}
/**
 * Her leg's form beyond its round (R: her leg's radii, tj: where the knee is, s: its side - -1 right, 1 left): the thigh
 * bowed a little forward and full down its front (the quadriceps), the inner one rounding just above the knee; the back
 * of the thigh full under the seat (the hamstrings: hb), and fuller still at its very top behind (gl: the lower glute
 * on the thigh - its back alone, the front of the thigh as it was), rising to meet the seat's under-curve so the
 * gluteal fold is a soft crease into the thigh, never a step; the calf rounding out behind and to the sides below the
 * knee - its inner head the lower and the fuller - then slimming into the tendon above the ankle. All shares of her own
 * radii -> { back(t) (its middle behind the joints' line, ahead where < 0), hb(t), ka(t, a) (its radius' share round
 * it, a from the back: limbAlong), out(t) (the most it stands beyond its round anywhere round it) }
 */
function legForm(R, tj, s) {
  const sh = (u) => tj + u * (1 - tj), wc = 0.13 * (1 - tj), quad = (t) => 0.07 * gau(t - 0.5 * tj, 0.3 * tj), vmo = (t) => 0.05 * gau(t - 0.87 * tj, 0.07 * tj);
  const calf = (t, m) => 0.12 * gau(t - sh(0.22 + 0.08 * m), wc), med = (t) => 0.05 * gau(t - sh(0.32), wc), gl = (t) => 0.25 * gau(t - 0.06 * tj, 0.14 * tj);
  return {
    back: (t) => -0.09 * R[0] * Math.sin(Math.PI * clamp01(t / tj)) + 0.1 * R[3] * gau(t - sh(0.3), wc), hb: (t) => 0.12 * R[0] * gau(t - 0.2 * tj, 0.16 * tj),
    ka: (t, a) => { const c = Math.cos(a), m = Math.max(0, s * Math.sin(a)); return 1 + quad(t) * Math.max(0, -c) ** 1.5 + (vmo(t) * (1 - c) / 2 + med(t)) * m + calf(t, m) * (Math.max(0, c + 0.6) / 1.6) ** 1.2 + gl(t) * Math.max(0, c) ** 1.5; },
    // (gl left out of it: behind only, and under the seat's own round - a skirt's hang round the thighs as it was)
    out: (t) => 1 + quad(t) + vmo(t) + med(t) + calf(t, 1),
  };
}

/**
 * A hand at the wrist w: palm and fingers together, wider at the knuckles, the fingers curled a little toward the palm,
 * the thumb along the palm's side nearer the body's middle; dir: where the fingers point, pn: which way the palm faces,
 * k: its size, th: the side the thumb is on -> [geometries]
 */
function handAt(w, dir, pn, k, th) {
  const D = dir.clone().normalize(), Pn = pn.clone().addScaledVector(D, -pn.dot(D)).normalize(), X = new THREE.Vector3().crossVectors(D, Pn), M = n(14, 5), K = n(10, 3), rings = [];
  // (a crowd's: palm and fingers in one, no thumb)
  if (Q < 0.6) { const g = new THREE.SphereGeometry(1, 5, 3); g.scale(0.022 * k, 0.07 * k, 0.012 * k); g.applyMatrix4(new THREE.Matrix4().makeBasis(X, D, Pn)); g.translate(w.x + D.x * 0.065 * k, w.y + D.y * 0.065 * k, w.z + D.z * 0.065 * k); return [g]; }
  // (its full width and half its thickness along it: the wrist, the heel of the hand, the knuckles, the fingers, their tips)
  const prof = [[0, 0.04, 0.012], [0.12, 0.056, 0.0145], [0.4, 0.07, 0.0145], [0.55, 0.071, 0.0125], [0.7, 0.066, 0.0105], [0.88, 0.058, 0.009], [1, 0.046, 0.0075]];
  for (let i = 0; i <= K; i++) {
    const u = i / K, [wd, tk] = spline(prof, u), curl = 0.024 * ss3(0.5, 1, u) ** 1.6, c = w.clone().addScaledVector(D, (0.005 + 0.165 * u) * k).addScaledVector(Pn, curl * k);
    rings.push(Array.from({ length: M }, (_, j) => { const a = j / M * Math.PI * 2, cx = Math.cos(a), cy = Math.sin(a); return c.clone().addScaledVector(X, Math.sign(cx) * Math.abs(cx) ** 0.7 * wd * 0.5 * k).addScaledVector(Pn, Math.sign(cy) * Math.abs(cy) ** 0.8 * tk * k); }));
  }
  const tip = w.clone().addScaledVector(D, 0.176 * k).addScaledVector(Pn, 0.028 * k);
  rings.push(rings[K].map((p) => p.clone().lerp(tip, 0.55)), Array(M).fill(tip)); rings.unshift(Array(M).fill(w.clone().addScaledVector(D, -0.004 * k)));
  const g = [loft(rings)];
  // (the thumb: from the heel of the hand along the index finger's side, toward the palm)
  const t0 = w.clone().addScaledVector(D, 0.03 * k).addScaledVector(X, th * 0.016 * k).addScaledVector(Pn, 0.006 * k), td = D.clone().multiplyScalar(0.72).addScaledVector(X, th * 0.5).addScaledVector(Pn, 0.42).normalize();
  const t1 = t0.clone().addScaledVector(td, 0.035 * k), t2 = t1.clone().addScaledVector(D.clone().multiplyScalar(0.8).addScaledVector(Pn, 0.55).normalize(), 0.03 * k);
  g.push(limbAlong([t0, t1, t2], (t) => (0.0115 - 0.003 * t) * k, { k: 6, m: 8, dome: 'ab' }));
  return g;
}

/**
 * A shoe under the ankle, its toe along +x (kneeling, 'toes': stood on its toes behind): the upper, rounded at the heel and
 * low at the toe, on a sole a little wider than it, in its own colour (scol: the sole's colour as a multiple of the
 * upper's - each vertex's colour); kind 'boot' (a racing boot: slim, high at the ankle, a thin sole), 'trainer' (a thick
 * white sole), 'shoe' (leather), 'work' (a heavy sole); fl: the foot's own length -> [geometries]
 */
/** a shoe's height along it (u: 0 the heel .. 1 the toe), in shares of the foot's length: a racing boot's shaft up round
 *  the ankle, then a slim, low front; a dress shoe low over the heel, rising to its laces over the instep, falling away to
 *  a low toe; a trainer's and a work shoe's the fuller */
const SHOE_H = {
  boot: [[0, 0.5], [0.14, 0.52], [0.3, 0.48], [0.42, 0.31], [0.6, 0.205], [0.8, 0.152], [0.93, 0.122], [1, 0.072]],
  shoe: [[0, 0.27], [0.15, 0.285], [0.3, 0.3], [0.42, 0.262], [0.6, 0.198], [0.8, 0.15], [0.93, 0.12], [1, 0.07]],
  full: [[0, 0.3], [0.15, 0.325], [0.3, 0.34], [0.42, 0.29], [0.6, 0.215], [0.8, 0.165], [0.93, 0.135], [1, 0.08]],
};
function shoeAt(ankle, foot, kind, fl, scol) {
  // (every measure a share of the foot's own length: the shoe a little longer than the foot - a racing boot snug, a
  // trainer the roomiest - its heel a quarter of its length behind the ankle; its sole a welt's width proud of the upper,
  // no wider: a shoe, not a slipper on a platform; the toe sprung up a little off the ground)
  const boot = kind === 'boot', full = kind === 'trainer' || kind === 'work', len = fl * (boot ? 1 : full ? 1.06 : 1.04), sole = fl * (kind === 'trainer' ? 0.09 : kind === 'work' ? 0.08 : boot ? 0.024 : 0.044), x0 = -0.24 * len, M = n(13, 4), MS = n(8, 4), K = n(12, 4);
  // (its half-width: a narrow heel, widest at the ball of the foot, then drawn in to a rounded toe - a racing boot's the slimmest)
  const wk = fl * (boot ? 0.92 : full ? 1.05 : 1), W = [[0, 0.095], [0.12, 0.13], [0.35, 0.148], [0.62, 0.166], [0.8, 0.15], [0.9, 0.12], [0.96, 0.082], [1, 0.03]], Hh = SHOE_H[boot ? 'boot' : full ? 'full' : 'shoe'];
  const spring = (u) => 0.025 * fl * ss3(0.78, 1, u) ** 1.5, welt = fl * (full ? 0.012 : 0.006), h0 = Hh[0][1] * fl, hT = Hh[Hh.length - 1][1] * fl;
  const ringAt = (u, wd, bot, top, e, m = M) => { const x = x0 + u * len, yc = (bot + top) / 2 + spring(u), hh = (top - bot) / 2; return Array.from({ length: m }, (_, j) => { const a = j / m * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); return V(x, yc + Math.sign(s) * Math.abs(s) ** e * hh, Math.sign(c) * Math.abs(c) ** e * wd); }); };
  // (the upper's section: flat on the sole, widest there, its sides rising from it and curving in over the top - a dome
  // over the foot, not a tube; nearly upright round a boot's shaft (q: the steeper the taller it is for its width))
  const upAt = (u, wd, bot, top) => { const x = x0 + u * len, h = top - bot, q = Math.max(0.3, Math.min(1, 1.3 * wd / Math.max(1e-4, h))), b = bot + spring(u); return Array.from({ length: M }, (_, j) => { const a = j / M * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); return s >= 0 ? V(x, b + h * s ** q, Math.sign(c) * Math.abs(c) ** 0.8 * wd) : V(x, b + 0.004 * fl * s, Math.sign(c) * Math.abs(c) ** 0.25 * wd); }); };
  const up = [], so = [], lite = Q < 0.6;
  for (let i = 0; i <= K; i++) { const u = i / K, wd = spline(W, u)[0] * wk, top = spline(Hh, u)[0] * fl; up.push(upAt(u, wd, lite ? 0 : sole - 0.008 * fl, top)); so.push(ringAt(u, wd + welt, 0, sole, 0.3, MS)); }
  // ('toes', kneeling: turned about its own ankle - a third of the foot's length up over its sole, where a standing foot's
  // is - on to the ankle, heel up and sole to the back, its toe just reaching the ground: the shaft's opening on the
  // ankle, under the trouser's hem, never a paddle beside it)
  const aY = 0.33 * fl, tR = Math.hypot(x0 + len, aY), tPh = Math.atan2(-aY, x0 + len);
  const place = (g) => { if (foot === 'toes') { const th = Math.max(-0.78 * Math.PI, Math.min(-0.45 * Math.PI, Math.asin(Math.min(1, Math.max(0.02, ankle.y - 0.006) / tR)) - Math.PI - tPh)); g.translate(0, -aY, 0); g.rotateZ(th); g.translate(ankle.x, ankle.y, ankle.z); } else g.translate(ankle.x, 0, ankle.z); return g; };
  // (a crowd's: the upper down to the ground, no sole of its own)
  if (lite) { up.unshift(Array(M).fill(V(x0 - 0.016 * fl, h0 * 0.45, 0))); up.push(Array(M).fill(V(x0 + len + 0.016 * fl, 0.044 * fl + spring(1), 0))); return [place(loft(up))]; }
  up.unshift(up[0].map((p) => p.clone().lerp(V(x0 - 0.016 * fl, (sole + h0 * 0.9) / 2, 0), 0.6)), Array(M).fill(V(x0 - 0.024 * fl, (sole + h0 * 0.9) / 2, 0))); up.push(Array(M).fill(V(x0 + len + 0.016 * fl, (sole + hT) / 2 + spring(1), 0)));
  so.unshift(Array(MS).fill(V(x0 - 0.024 * fl, sole / 2, 0))); so.push(Array(MS).fill(V(x0 + len + 0.02 * fl, sole / 2 + spring(1), 0)));
  const gU = loft(up), gS = loft(so); tint(gS, scol);
  return [place(gU), place(gS)];
}
/**
 * A court shoe on a slim heel: her foot (in the legs' colour - tights, or bare) arched from the heel down to the ball of
 * the foot, the shoe low-cut round it - a heel cup, the sides, a pointed toe - its sole and a slim heel -> { foot, shoe }
 */
function courtShoe(ankle, k = 1) {
  const ball = V(ankle.x + 0.105, 0.014, ankle.z), toe = V(ankle.x + 0.17, 0.012, ankle.z);
  const foot = limbAlong([V(ankle.x - 0.01, 0.11, ankle.z), ball, toe], (t) => spline([[0, 0.03], [0.25, 0.028], [0.6, 0.024], [0.85, 0.02], [1, 0.012]], t)[0] * k, { k: 10, m: 12, sq: 0.62, side: V(0, 0, 1), dome: 'b' });
  // (lit as the leg it carries on from: up at the ankle its normals the shin's - out from its middle, level - so no line of
  // light runs round the ankle where the two surfaces cross; over the instep a little less turned up to the sky than its
  // shape says - one tone with the leg, never a paler sock)
  { const FN = foot.attributes.normal, FP = foot.attributes.position, ax = ankle.x - 0.01;
    for (let i = 0; i < FN.count; i++) { const y = FP.getY(i), w = ss3(0.06, 0.105, y); let nx = FN.getX(i), ny = FN.getY(i), nz = FN.getZ(i); if (ny > 0) ny *= 0.5; const rx = FP.getX(i) - ax, rz = FP.getZ(i) - ankle.z, rl = Math.hypot(rx, rz) || 1; nx += (rx / rl - nx) * w; ny += (0 - ny) * w; nz += (rz / rl - nz) * w; const l = Math.hypot(nx, ny, nz) || 1; FN.setXYZ(i, nx / l, ny / l, nz / l); } }
  const cup = limbAlong([V(ankle.x - 0.032, 0.085, ankle.z), V(ankle.x + 0.105, 0.016, ankle.z), V(ankle.x + 0.18, 0.011, ankle.z)], (t) => spline([[0, 0.028], [0.3, 0.029], [0.62, 0.027], [0.85, 0.022], [1, 0.01]], t)[0] * k, { k: 12, m: 14, sq: 0.7, side: V(0, 0, 1), dome: 'ab' });
  // (low-cut: what of the shoe would be over the instep is drawn down below the foot's top)
  const P = cup.attributes.position;
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), u = clamp01((x - (ankle.x - 0.04)) / 0.22), base = 0.075 + (0.012 - 0.075) * ss3(0, 0.62, u), lim = base + (u > 0.72 ? 0.024 : u < 0.12 ? 0.03 : 0.008); if (P.getY(i) > lim) P.setY(i, lim + (P.getY(i) - lim) * 0.15); }
  cup.computeVertexNormals();
  const post = new THREE.CylinderGeometry(0.0085, 0.005, 0.075, n(10), 1, false); post.translate(ankle.x - 0.042, 0.0375, ankle.z);
  return { foot, shoe: [cup, post] };
}
/** a geometry's colour per vertex: all c (a number, or a colour per vertex from fn(x, y, z)) */
function tint(g, c = 1) {
  const P = g.attributes.position, a = new Float32Array(P.count * 3);
  for (let i = 0; i < P.count; i++) { const v = typeof c === 'function' ? c(P.getX(i), P.getY(i), P.getZ(i)) : c; if (typeof v === 'number') a[i * 3] = a[i * 3 + 1] = a[i * 3 + 2] = v; else { a[i * 3] = v[0]; a[i * 3 + 1] = v[1]; a[i * 3 + 2] = v[2]; } }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g;
}
/** geometries merged into one, each with a colour per vertex (white where it has none) and no other attributes but those kept (keep: ['uv'], the skin's weights) -> geometry */
function mergeParts(gs, keep = []) {
  for (const g of gs) { if (!g.attributes.color) tint(g, 1); if (!g.attributes.normal) g.computeVertexNormals(); for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color' && !keep.includes(k)) g.deleteAttribute(k); }
  const all = gs.every((g) => g.index); return mergeGeometries(all ? gs : gs.map((g) => g.index ? g.toNonIndexed() : g));
}

// ---- the head -----------------------------------------------------------------------------------------------------------
// (where the face's features are, as directions from the head's centre: nz across (+ the left), ny up - the geometry
// raises them there, and the paint draws them there)
const FACE = { eyeY: 0.005, eyeZ: 0.4, browY: 0.215, tipY: -0.3, baseY: -0.37, mouthY: -0.565, mouthZ: 0.3, chinY: -0.86 };
// (how far the face is brought forward, by height: the forehead and the chin both nearly over the line of the face, not
// curving away from it as a sphere would)
const A_FW = [[-1, 0.42], [-0.95, 0.38], [-0.87, 0.3], [-0.72, 0.16], [-0.56, 0.07], [-0.37, 0.02], [-0.2, 0], [0.05, 0], [0.3, 0.04], [0.52, 0.075], [0.75, 0.05], [0.95, 0], [1, 0]], FW = lut(A_FW, -1, 1, 400);
/**
 * The head's shape (S: fem, len, wid, jaw - how much it narrows to the chin -, nose, lip, sock, brow, cheek, chin; hers
 * muz): a unit direction (+x the face) -> its point, in tenths of a metre from the head's centre (so every feature a share
 * of the head's own size): an egg of a cranium, the lower face brought forward and narrowing to the chin (a man's jaw
 * square at its angle, a woman's a clean line tapering to her chin); bumps: the features raised on it - his brow, shallow
 * eye sockets, cheekbones and full cheeks, the nose, the lips with the line of the mouth between them, the chin; her face
 * sculpted in planes - orbits recessed under a soft brow bone, high cheekbones over a hollow, a natural bridge to a small
 * nose, the mouth's arch with the lips' volume on it, a small pointed chin
 */
function headShape(S) {
  const { fem, len, wid, jaw } = S;
  return (nx, ny, nz, bumps = true) => {
    // (hx: how far round toward the face - none right at the poles, so the point under the jaw is one point, not smeared
    // into a sawtooth along the underside where a slender neck leaves it in view)
    const rh = Math.sqrt(nx * nx + nz * nz) || 1e-6, hx = nx / rh * ss3(0.02, 0.12, rh), az = Math.abs(nz);
    let x = nx * (nx > 0 ? 0.93 : 1 + 0.05 * ss3(-0.6, 0.2, ny)), y = ny * (ny > 0 ? 1.08 : 1) * len, z = nz * 0.82 * wid;
    x += FW(ny)[0] * ss3(-0.5, 0.9, hx);
    const t = clamp01((-ny - 0.12) / 0.88);
    z *= 1 - jaw * (fem ? 0.8 * t ** 1.7 : 0.35 * t + 0.9 * ss3(0.45, 1, t));
    // (under the jaw, behind the chin: drawn up and in to the neck - the jaw's line rising to its angle below the ear)
    x *= 1 - 0.3 * t * ss3(0.15, -0.85, hx); y *= 1 - 0.36 * t * ss3(0.7, -0.5, hx);
    // (hers drawn clean: the jaw's line from under the chin back, gently rising, to its angle (go) below the ear and up the
    // ramus behind it toward the lobe (a: the angle round from the front; d: how far above the line) - the face's side kept
    // full down to it, then turned under it, taut, in to the neck: the lower face tapering to her chin in a line with a
    // defined angle at its back, not rounding off as an egg's end does - the ramus rising gently from it, so no knot at the
    // angle where the two meet. Its hair follows it: in the shape, not a bump)
    if (fem) {
      const a = Math.atan2(az, nx), go = 1.52, d = ny + 0.93 - 0.23 * ss3(0.05, go, a) - 0.3 * ss3(go, go + 0.45, a), wa = ss3(0.15, 0.7, a) * ss3(go + 0.43, go + 0.18, a) * ss3(0.1, 0.3, rh);
      const k = 1 + 0.015 * gau(d - 0.05, 0.09) * wa - 0.16 * ss3(0.04, -0.16, d) * wa;
      x *= k; z *= k;
    }
    // (the features are all on the face: none behind the ears)
    if (!bumps || nx < -0.15) return [x, y, z];
    const fr = ss3(0.25, 0.75, hx), mw = Math.exp(-((nz / FACE.mouthZ) ** 4));
    let dx = 0, dz = 0;
    if (fem) {
      // her face's planes, each a share of the head's own size (S: sock, brow, cheek, muz, nose, lip, chin) and all gone by
      // the ears: the orbits - a hollow under the brow, deepest in the crease above the lid and toward the inner corner, the
      // eye itself rounded in it (where the paint draws it, its lids over the globe) - under a soft ridge of brow bone, the
      // bridge of the nose rising out of it between them
      const ey = ny - FACE.eyeY;
      dx -= S.sock * (gau(ey - 0.05, 0.12) * gau(az - 0.36, 0.17) + 0.3 * gau(ey - 0.02, 0.07) * gau(az - 0.2, 0.07) - 0.5 * gau(ey + 0.005, 0.075) * gau(az - FACE.eyeZ, 0.14)) * fr;
      dx += S.brow * gau(ny - FACE.browY - 0.02, 0.085) * gau(az - 0.28, 0.26) * fr;
      // (the cheekbones: a broad round under the outer corner of the eye, where her highlight is painted - out, and forward
      // to catch the light - and the arch going on back from it toward the ear, the face widest there; under them a long
      // shallow sweep from the ear down toward the corner of the mouth, where her contour is painted, and the cheek below
      // it drawn in flat to the jaw's angle (a: the angle round from the front) - in toward the head's middle, the face's
      // outline curving in under the cheekbone. Each broad and soft: the light falls away under the cheekbone, never a
      // crease or a dimple)
      const ridge = S.cheek * (gau(ny + 0.1 - 0.15 * (az - 0.6), 0.15) * gau(az - 0.6, 0.16) + 0.4 * gau(ny + 0.04, 0.1) * gau(az - 0.88, 0.12) * ss3(-0.1, 0.25, nx));
      const cu = az - 0.74, a = Math.atan2(az, nx), hol = S.cheek * (0.3 * gau(ny + 0.35 - 0.35 * cu, 0.11) * gau(cu, 0.22) + 0.6 * gau(ny + 0.48, 0.17) * gau(a - 1.1, 0.32));
      dz += 0.85 * ridge - hol * az / rh; dx += 0.45 * ridge * fr - hol * Math.max(0, nx) / rh;
      // (the muzzle: the mouth's arch brought forward, the lips on it - the upper's fullness under the nose, the lower
      // fuller, both rounding back toward the corners - so they have their volume in profile, not flat on the skull)
      dx += S.muz * gau(ny - FACE.mouthY + 0.02, 0.17) * gau(nz, 0.3) * fr;
      dx += S.lip * (0.036 * gau(ny - FACE.mouthY - 0.03, 0.03) * gau(nz, 0.2) + 0.046 * gau(ny - FACE.mouthY + 0.035, 0.034) * gau(nz, 0.19));
      // (the nose: its bridge rising from between the eyes, out of the sockets either side, to a rounded tip; its wings)
      if (ny < 0.14 && ny > -0.45) { const p = ny > FACE.tipY ? ss3(0.12, FACE.tipY, ny) ** 1.15 : ss3(FACE.baseY - 0.02, FACE.tipY, ny), w = 0.05 + 0.05 * ss3(0, FACE.tipY, ny); dx += S.nose * p * gau(nz, w) * fr; }
      dx += 0.3 * S.nose * gau(ny - FACE.baseY - 0.025, 0.035) * gau(az - 0.085, 0.045);
      // (her chin: small and a little pointed, brought forward nearly under the lower lip - a soft fold between them - and
      // turned under to the jaw's line)
      dx += S.chin * gau(ny - FACE.chinY - 0.07, 0.11) * gau(nz, 0.16) - 0.01 * gau(ny - FACE.mouthY + 0.14, 0.045) * gau(nz, 0.18);
      return [x + dx, y, z + (nz < 0 ? -dz : dz)];
    }
    // (his: the eye sockets, and the brow over them)
    dx -= S.sock * gau(ny - FACE.eyeY, 0.1) * gau(az - FACE.eyeZ, 0.15) * fr;
    dx += S.brow * gau(ny - FACE.browY, 0.07) * gau(az - 0.33, 0.2) * fr;
    // (the cheekbones, out to the sides; the cheeks, full and forward)
    dz += (fem ? 0.016 : 0.022) * gau(ny + 0.08, 0.16) * gau(az - 0.7, 0.2) + (fem ? 0.014 : 0.006) * gau(ny + 0.42, 0.2) * gau(az - 0.74, 0.2);
    dx += S.cheek * (gau(ny + 0.24, 0.17) * gau(az - 0.45, 0.2) + 0.55 * gau(ny + 0.46, 0.15) * gau(az - 0.5, 0.18)) * fr;
    // (the nose: from the bridge, narrow between the eyes, to a rounded tip; the wings of the nostrils either side)
    if (ny < 0.12 && ny > -0.45) { const p = ny > FACE.tipY ? ss3(0.06, FACE.tipY, ny) ** 1.3 : ss3(FACE.baseY - 0.02, FACE.tipY, ny), w = 0.045 + 0.055 * ss3(0, FACE.tipY, ny); dx += S.nose * p * gau(nz, w) * fr; }
    dx += 0.3 * S.nose * gau(ny - FACE.baseY - 0.025, 0.035) * gau(az - 0.085, 0.04);
    // (the lips - the upper's fullness under the nose, the lower fuller still - and the line of the mouth between them)
    dx += S.lip * (0.036 * gau(ny - FACE.mouthY - 0.05, 0.04) + 0.046 * gau(ny - FACE.mouthY + 0.06, 0.045)) * mw - 0.014 * gau(ny - FACE.mouthY, 0.012) * mw;
    // (the chin, and the hollow above it)
    dx += S.chin * gau(ny - FACE.chinY, 0.1) * gau(nz, fem ? 0.17 : 0.23) - 0.01 * gau(ny - FACE.mouthY + 0.15, 0.04) * gau(nz, 0.16);
    return [x + dx, y, z + (nz < 0 ? -dz : dz)];
  };
}
// (the face's paint, laid on by direction: an angle round from the front, an angle up - plain skin past its edges)
const UVF = { phi: 1.3, t0: -1.42, t1: 1.0 };
const faceUV = (nx, ny, nz) => [clamp01(0.5 + Math.atan2(nz, nx) / (2 * UVF.phi)), clamp01((Math.asin(Math.max(-1, Math.min(1, ny))) - UVF.t0) / (UVF.t1 - UVF.t0))];
/** a sphere of unit directions (nu round, nv from pole to pole), its rows and columns closer together over the face (face: closer still across it - a painted face's own skin, where the nose's bridge, the lips and the eyes' sockets need them; the back of the head, under the hair, the coarser for it), with the face's paint's uv -> geometry */
const GRIDS = new Map();
function headGrid(nu, nv, face = false) {
  // (each size worked out once: its directions, its uv, its faces - copied for each head)
  const key = nu * 1000 + nv + (face ? 1e6 : 0), cf = face ? 0.42 : 0.55;
  let G = GRIDS.get(key);
  if (!G) {
    const pos = [], uv = [], idx = [], W = nu + 1;
    for (let i = 0; i <= nv; i++) {
      const t = i / nv * 2 - 1, th = Math.PI / 2 * (0.62 * t + 0.38 * t ** 3) - 0.18 * (1 - t * t), cy = Math.sin(th), cr = Math.cos(th);
      for (let j = 0; j <= nu; j++) { const s = j / nu * 2 - 1, ph = Math.PI * (cf * s + (1 - cf) * s ** 3), x = cr * Math.cos(ph), z = cr * Math.sin(ph); pos.push(x, cy, z); uv.push(...faceUV(x, cy, z)); }
    }
    for (let i = 0; i < nv; i++) for (let j = 0; j < nu; j++) { const a = i * W + j, b = a + 1, c = a + W + 1, d = a + W; if (i > 0) idx.push(a, c, b); if (i < nv - 1) idx.push(a, d, c); }
    G = { pos: new Float32Array(pos), uv: new Float32Array(uv), idx: new Uint16Array(idx) }; GRIDS.set(key, G);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(G.pos.slice(), 3)); g.setAttribute('uv', new THREE.BufferAttribute(G.uv.slice(), 2)); g.setIndex(new THREE.BufferAttribute(G.idx, 1));
  g.userData.grid = [nu, nv]; return g;
}
/** a head grid's normals made one where its seam (at the back) and its poles meet themselves */
function weldGrid(g) {
  const [nu, nv] = g.userData.grid, N = g.attributes.normal, W = nu + 1, avg = (ids) => { let x = 0, y = 0, z = 0; for (const i of ids) { x += N.getX(i); y += N.getY(i); z += N.getZ(i); } const l = Math.hypot(x, y, z) || 1; for (const i of ids) N.setXYZ(i, x / l, y / l, z / l); };
  for (let i = 1; i < nv; i++) avg([i * W, i * W + nu]);
  avg(Array.from({ length: W }, (_, j) => j)); avg(Array.from({ length: W }, (_, j) => nv * W + j));
}

// ---- the face's paint ---------------------------------------------------------------------------------------------------
const FACE_TEX = new Map();
// (a face's canvases kept in the CPU's memory (willReadFrequently): a GPU reset - a laptop waking from sleep - never blanks
// a cached paint, and painting never waits on the GPU's queue to read a canvas back - about 5x quicker with a scene drawing)
const ctx2d = (c) => c.getContext('2d', { willReadFrequently: true });
let GRAIN = null;
/** a tile of fine grain (the skin's, stubble's), made once -> canvas */
function grainTile() {
  if (GRAIN) return GRAIN; const c = document.createElement('canvas'); c.width = c.height = 64; const x = ctx2d(c), d = x.createImageData(64, 64), r = seeded('grain');
  for (let i = 0; i < 64 * 64; i++) { const v = r(); d.data[i * 4 + 3] = v > 0.6 ? Math.round(255 * (v - 0.6) / 0.4) : 0; }
  x.putImageData(d, 0, 0); return (GRAIN = c);
}
/** a CSS colour with alpha a, from any colour (its sRGB value) */
const rgba = (c, a) => { const k = new THREE.Color(c).getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace); return `rgba(${Math.round(k.r * 255)},${Math.round(k.g * 255)},${Math.round(k.b * 255)},${a})`; };
const hexOf = (c) => '#' + c.getHexString();
/**
 * Her make-up, by look (style.makeup: a name, or { look, lip } - a lip colour of her own; none: 'soft', light and everyday):
 * shares 0..1 and colours. contour - the face carved (hollows under the cheekbones, the jaw falling away below its line, the
 * temples, a slimmer bridge to the nose); glow - light on the high points (the cheekbones, the bridge and the tip of the nose,
 * under the brows' arch, the cupid's bow); blush (blushC); dew - a sheen on the T-zone and the cheekbones; lid, smoke - the
 * shadow's colour (none: one of a few, by her seed) and how deep it goes at the lash line and the outer corner; liner - its
 * weight, wing - its flick (mm); lash - how full; lower - the lower lash line smoked; brow - 'soft', 'brushed' (up, feathery)
 * or 'sculpted' (a clean arch, a sharp tail); lip - [her own skin's colour tinted (linear rgb; none: not tinted), a colour it
 * goes toward, how far] (none: her own lips' colour); deep - the lip liner's depth, an ombre to a softer middle; gloss - matt
 * 0 .. glass 1. Clean Girl: fresh and dewy, brushed brows, a fine liner, a peachy-nude gloss; Snatched Baddie: high glam - a
 * sharp contour, a dramatic wing, full lashes, a deep-lined ombre lip; Siren: bold red carpet - a smoky eye, a winged liner,
 * a classic red glossy lip
 */
const LOOKS = {
  soft: { contour: 0.3, glow: 0.35, blush: 0.35, blushC: '#d8675c', dew: 0.3, lid: null, smoke: 0.2, liner: 0.4, wing: 2, lash: 0.55, lower: 0.12, brow: 'soft', lip: null, deep: 0.3, gloss: 0.4 },
  clean: { contour: 0.45, glow: 0.8, blush: 0.75, blushC: '#ee8a70', dew: 1, lid: '#b48770', smoke: 0.15, liner: 0.45, wing: 3, lash: 0.8, lower: 0.05, brow: 'brushed', lip: [[1, 0.8, 0.7], '#e0846c', 0.3], deep: 0.35, gloss: 0.85 },
  baddie: { contour: 1, glow: 0.85, blush: 0.35, blushC: '#c47a62', dew: 0.5, lid: '#5c3626', smoke: 0.75, liner: 1, wing: 7.5, lash: 1, lower: 0.45, brow: 'sculpted', lip: [[0.82, 0.58, 0.54], '#a5605a', 0.25], lipK: 0.52, deep: 0.9, gloss: 0.8 },
  siren: { contour: 0.75, glow: 0.65, blush: 0.35, blushC: '#c85a66', dew: 0.4, lid: '#3c2c30', smoke: 0.95, liner: 0.9, wing: 6, lash: 1, lower: 0.6, brow: 'sculpted', lip: [null, '#b0122a', 0.95], deep: 0.5, gloss: 1 },
};
const lumOf = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
/** the looks by name: soft, clean (Clean Girl), baddie (Snatched Baddie), siren (Siren) */
export const MAKEUP_LOOKS = Object.keys(LOOKS);
// ---- her make-up as parameters (a style editor's): a look, each of its measures and colours her own ----
/** a colour kept to 5 bits a channel (sRGB: each a multiple of 8) - a picked colour as it is stored, painted and shown -> '#rrggbb' (null: not a colour) */
export const qHex = (c) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(c ?? '')); if (!m) return null; const v = parseInt(m[1], 16); return '#' + [16, 8, 0].map((s) => Math.min(255, Math.round(((v >> s) & 255) / 8) * 8).toString(16).padStart(2, '0')).join(''); };
const qN = (v, step, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v / step) * step)), q2 = (v) => Math.round(v * 1000) / 1000;
/**
 * A look's measures by their place in a make-up spec - [the look's own field, min, max, step] or [field, 'hex']: the
 * liner (thickness: its weight; wing: its flick, mm; angle: the flick's, degrees - none: as its weight has it; color: its
 * shade - none: the look's ink), the lashes (volume), the shadow (intensity: the smoky wash; color: its tone - none: the
 * look's; under: the lower lash line smoked), the lips (fill: the colour inside; liner: the line's - none: a deeper
 * tone of the fill; ombre: how far the liner's tone reaches in - the blend's radius; gloss), the sculpt (contour: its
 * depth; highlight: light on the cheekbones, the bridge and the tip of the nose; blush, blushColor; dew)
 */
const MK_SPEC = {
  liner: { thickness: ['liner', 0, 1, 0.05], wing: ['wing', 0, 10, 0.5], angle: ['wingA', 5, 40, 2], color: ['ink', 'hex'] },
  lashes: { volume: ['lash', 0, 1, 0.05] },
  shadow: { intensity: ['smoke', 0, 1, 0.05], color: ['lid', 'hex'], under: ['lower', 0, 1, 0.05] },
  lips: { fill: ['lipF', 'hex'], liner: ['lipL', 'hex'], ombre: ['deep', 0, 1, 0.05], gloss: ['gloss', 0, 1, 0.05] },
  sculpt: { contour: ['contour', 0, 1, 0.05], highlight: ['glow', 0, 1, 0.05], blush: ['blush', 0, 1, 0.05], blushColor: ['blushC', 'hex'], dew: ['dew', 0, 1, 0.05] },
};
const BROW_KEYS = ['soft', 'brushed', 'sculpted'];
/**
 * A make-up spec's own values over its look's (L), each kept to its step and range; one the same as the look's own (at
 * that step) is no override at all -> { field: value } (colours '#rrggbb', wingA degrees)
 */
function flatMakeup(o, L) {
  const out = {};
  for (const g in MK_SPEC) {
    const src = o?.[g]; if (!src || typeof src !== 'object') continue;
    for (const f in MK_SPEC[g]) {
      const [k, a, b, st] = MK_SPEC[g][f], v = src[f]; if (v == null) continue;
      if (a === 'hex') { const h = qHex(v); if (h && h !== (L[k] ? qHex(L[k]) : null)) out[k] = h; continue; }
      if (typeof v !== 'number' || !isFinite(v)) continue;
      const qv = q2(qN(v, st, a, b)); if (L[k] == null || qv !== q2(qN(L[k], st, a, b))) out[k] = qv;
    }
  }
  if (BROW_KEYS.includes(o?.brows) && o.brows !== L.brow) out.brow = o.brows;
  return out;
}
/** a look's own make-up as a spec (a style editor's starting point; a colour of null: the look's own, worked out on her skin) */
export function makeupPreset(name) {
  const L = LOOKS[name] || LOOKS.soft;
  return { look: LOOKS[name] ? name : 'soft', liner: { thickness: L.liner, wing: L.wing, angle: null, color: null }, lashes: { volume: L.lash }, shadow: { intensity: L.smoke, color: L.lid, under: L.lower },
    lips: { fill: null, liner: null, ombre: L.deep, gloss: L.gloss }, sculpt: { contour: L.contour, highlight: L.glow, blush: L.blush, blushColor: L.blushC, dew: L.dew }, brows: L.brow };
}
/**
 * her make-up worked out on her skin (skinC) -> the look with its colours (lipC - none: her own -, lidC, lidD, inkC (the
 * liner's), lashC (the lashes'), blushC, cC (contour), hl (highlight), lipLine (the lip liner's - none: a deeper tone of
 * the lip), wingA (the wing's angle, degrees - none: by the liner's weight)), base (the look's own lip and lid colours),
 * deep0 (the look's own liner depth), ov (its overrides, in a word - '' none) and a key. m: a look's name, { look, lip } or
 * a make-up spec (MK_SPEC: { look, lip, liner, lashes, shadow, lips, sculpt, brows })
 */
function makeupOf(m, skinC, seed) {
  const o = typeof m === 'string' ? { look: m } : m || {}, name = LOOKS[o.look] ? o.look : 'soft', L = LOOKS[name], sl = lumOf(skinC), dark = sl < 0.12;
  // (no lighter than her skin, at most k of it: shadow, contour, a nude lip - always deeper)
  const deeper = (c, k) => { const l = lumOf(c); return l > sl * k ? c.multiplyScalar(sl * k / l) : c; };
  // (on deep skin the lid deeper still and a little richer - at 0.55 of her skin a smoky wash read as nothing)
  const rich = (c) => { if (dark) { const h = {}; c.getHSL(h); c.setHSL(h.h, Math.min(1, h.s * 1.3), h.l); } return c; };
  const lid = rich(deeper(new THREE.Color(L.lid || ['#8a5a4a', '#7a4f5a', '#6b5444', '#8c6a5a'][(seed >>> 4) % 4]), dark ? 0.35 : 0.55));
  let lip = o.lip ? new THREE.Color(o.lip) : null;
  if (!lip && L.lip) { const [t, to, k] = L.lip; lip = (t ? skinC.clone().multiply(new THREE.Color(t[0], t[1], t[2])) : skinC.clone()).lerp(new THREE.Color(to), k); if (t) deeper(lip, L.lipK ?? 0.72); else if (dark) lip.multiplyScalar(0.75); }
  // (her contour a share deeper than her skin: on deep skin deeper still, or it reads as nothing)
  const blush = new THREE.Color(L.blushC); if (dark) blush.multiplyScalar(0.6);
  const R = { ...L, look: name, lipC: lip ? hexOf(lip) : null, lidC: hexOf(lid), lidD: hexOf(lid.clone().multiplyScalar(0.4)), inkC: L.liner >= 0.8 ? '#0d0908' : '#1f130e', blushC: hexOf(blush),
    // (the contour a cool taupe - deeper, less orange than her skin: a shadow, not a tan; the highlight pearl, champagne-gold on deep skin)
    cC: hexOf(skinC.clone().multiply(new THREE.Color(0.45, 0.38, 0.39)).multiplyScalar(dark ? 0.8 : 1)), hl: hexOf(skinC.clone().lerp(new THREE.Color(dark ? '#f0c88c' : '#fff6ee'), dark ? 0.6 : 0.7)), dark };
  R.key = `${name}|${R.lipC}|${R.lidC}`; R.base = { lipC: R.lipC, lidC: R.lidC }; R.lashC = R.inkC; R.deep0 = L.deep; R.ov = '';
  // (her own measures and colours over the look's)
  const F = flatMakeup(o, L), ks = Object.keys(F).sort(); if (!ks.length) return R;
  for (const k of ks) {
    const v = F[k];
    // (on deep skin a picked shadow or liner kept deeper than her skin - a soft chocolate wing still a wing)
    if (k === 'lid') { const c = dark ? rich(deeper(new THREE.Color(v), 0.45)) : new THREE.Color(v); R.lidC = dark ? hexOf(c) : v; R.lidD = hexOf(c.multiplyScalar(0.4)); }
    else if (k === 'ink') R.inkC = dark ? hexOf(deeper(new THREE.Color(v), 0.4)) : v;
    else if (k === 'lipF') { R.lipC = v; R.lipSet = true; }
    else if (k === 'lipL') R.lipLine = v;
    else if (k === 'blushC') R.blushC = hexOf(new THREE.Color(v).multiplyScalar(dark ? 0.6 : 1));
    else R[k] = v;
  }
  R.ov = ks.map((k) => `${k}=${F[k]}`).join(';'); return R;
}
/** a make-up's colours as they will be painted on this skin (a style editor's swatches: the look's own where none is picked) -> { lip, lipLine, lid, ink, lash, blush } */
export function makeupColours(m, skin, seed = 0) {
  const sd = typeof seed === 'number' ? seed : (() => { let h = 11; for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; })(), sk = new THREE.Color(skin || '#e3b994'), R = makeupOf(m, sk, sd);
  return { lip: R.lipC || hexOf(sk.clone().lerp(new THREE.Color('#b0404f'), 0.62).multiplyScalar(0.95)), lipLine: R.lipLine || null, lid: R.lidC, ink: R.inkC, lash: R.lashC, blush: R.blushC };
}
// (her brows by look: the stroke's points [x, y, thickness] (mm, from its inner end), how soft its edge, how dark, how many hairs; up: brushed up)
const BROWS = {
  soft: { B: [[-12, -1.4, 2.4], [-3, 1.0, 2.2], [5, 2.1, 1.7], [13.5, -1.2, 0.5]], blur: 0.7, a: 0.8, n: 46, up: 0 },
  brushed: { B: [[-12.6, -1.7, 3.1], [-6, -0.1, 2.8], [0, 1.2, 2.4], [5.5, 2.1, 1.9], [10, 0.9, 1.2], [13.8, -1.1, 0.5]], blur: 0.85, a: 0.55, n: 96, up: 1 },
  sculpted: { B: [[-12.4, -1.3, 3.2], [-6, 0.4, 3], [0, 1.8, 2.65], [5.8, 3.2, 2], [10.2, 1.5, 1.2], [14.2, -1.4, 0.4]], blur: 0.45, a: 0.88, n: 64, up: 0 },
};
let ROUGH1 = null;
/** a finish all the skin's own (a man's face): one shared texel - every painted face the same program */
const roughFlat = () => ROUGH1 || (ROUGH1 = Object.assign(new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1), { needsUpdate: true }));
/**
 * A face's paint, kept and shared (by everything it shows; refs: how many people wear it): the skin with its grain, warmer
 * on the cheeks and the nose, soft shading at the sockets, under the cheekbones, down the sides of the nose and along the
 * jaw; the eyes - almond-shaped, their whites, an iris of its colour with a darker rim, the pupil, a catchlight, the upper
 * lid's shadow on them, its line and lashes (darker and winged a little on her), a softer line below; the brows, hair by
 * hair; the nostrils; the lips - the upper with its bow, the lower fuller with a highlight - and the line between them; a
 * man's shaving shadow or stubble. Her make-up (mk: makeupOf) in place of the plain lids, liner and lips: contour and light,
 * a smoky lid, a winged liner and full lashes, her brows by the look, an ombre lip with a glass finish, baby hairs along her
 * hairline; and its finish (rough: a roughnessMap - the lips glossy, the eyes wet, a dewy T-zone; a man's all the skin's).
 * P: { size, skin, iris, brow, lip, fem, shadow (her lids' colour), stub (0..1), beard (its colour), S (the head's shape),
 * mk, hair (its colour), line (the hairline: (nx, nz) -> its height), lip0 / shadow0 (her look's own lip and lid colours,
 * when her make-up has colours of its own) } -> { tex, rough, key, base, refs }. surf (faceSurface): painted into a
 * person's own canvases instead - a style editor's quick paint while a slider moves, nothing new made, nothing cached
 */
function faceTexture(P, surf = null) {
  const S = P.S, M = P.mk || null;
  // (her hairline, the same each side: its height at angles round from the front, as far as the paint reaches - her baby hairs grow along it)
  const HL = M && P.line ? Array.from({ length: 29 }, (_, i) => +P.line(Math.cos(i / 28 * 1.2), Math.sin(i / 28 * 1.2)).toFixed(3)) : null;
  // (base: the face as its look has it - its brows' and baby hairs' scatter seeded by it, so a lip or a liner of her own
  // never moves a hair; the key: that and her make-up's own values, and the rest of the head's shape)
  const base = [P.size, P.skin, P.iris, P.brow, P.lip0 ?? P.lip, P.fem ? 1 : 0, P.stub, P.beard, P.shadow0 ?? P.shadow, S.len, S.wid, S.jaw, S.nose, S.lip, M ? M.key + '|' + P.hair : '', HL ? HL.join(',') : ''].join('|');
  const key = base + '|' + [S.sock, S.brow, S.cheek, S.chin, S.muz].join(',') + (M?.ov ? '§' + M.ov + '|' + P.lip + '|' + P.shadow : '');
  let E = surf ? null : FACE_TEX.get(key); if (E) { E.refs++; FACE_TEX.delete(key); FACE_TEX.set(key, E); return E; }
  if (typeof window !== 'undefined') window.__FX = window.__FX || {}, window.__FX.facePaints = (window.__FX.facePaints || 0) + 1;
  // (K: the scale drawn at - the finish's canvas is half the size)
  // (a surface of a person's own: drawn over - its size never changes (the texture's storage is fixed), its state reset)
  const Z = surf ? surf.Z : P.size, cv = surf ? surf.cv : document.createElement('canvas'); cv.width = cv.height = Z; let x = ctx2d(cv), K = 1; const HS = headShape(S), kp = Z / 512;
  const px = (nz, ny) => { const nx = Math.sqrt(Math.max(0, 1 - nz * nz - ny * ny)), [u, v] = faceUV(nx, ny, nz); return [u * Z, (1 - v) * Z]; };
  /** drawing in millimetres of the face round the direction (nz, ny): x away from the middle of the face on side s, y up */
  const at = (nz, ny, s = 1) => {
    const e = 0.004, p0 = px(nz, ny), pz = px(nz + e, ny), py = px(nz, ny + e), h = (a, b) => HS(Math.sqrt(Math.max(0, 1 - a * a - b * b)), b, a, false), q0 = h(nz, ny), qz = h(nz + e, ny), qy = h(nz, ny + e);
    x.setTransform((pz[0] - p0[0]) / ((qz[2] - q0[2]) * 100) * s * K, 0, 0, -(p0[1] - py[1]) / ((qy[1] - q0[1]) * 100) * K, p0[0] * K, p0[1] * K);
  };
  const blob = (cx, cy, rx, ry, col, a, rot = 0) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(rx, ry); const g = x.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); x.fillStyle = g; x.beginPath(); x.arc(0, 0, 1, 0, Math.PI * 2); x.fill(); x.restore(); };
  const sk = new THREE.Color(P.skin), shade = (k) => hexOf(sk.clone().multiplyScalar(k)), warm = hexOf(sk.clone().lerp(new THREE.Color('#d2585a'), 0.55)), dark = sk.r + sk.g + sk.b < 0.5;
  x.fillStyle = P.skin; x.fillRect(0, 0, Z, Z);
  // the skin's grain, and its warmth on the cheeks, the nose and the chin
  x.save(); x.globalAlpha = dark ? 0.05 : 0.035; x.fillStyle = x.createPattern(grainTile(), 'repeat'); x.scale(kp, kp); x.fillRect(0, 0, 512, 512); x.restore();
  for (const s of [-1, 1]) { at(s * 0.44, -0.2, s); blob(0, 0, 17, 13, warm, P.fem ? 0.2 : 0.09); }
  at(0, FACE.tipY + 0.02); blob(0, 0, 7, 8, warm, 0.12); at(0, FACE.chinY); blob(0, 0, 12, 8, warm, 0.06);
  // shading: the sockets, down the sides of the nose, under the cheekbones, under the nose and the lower lip, the jaw
  for (const s of [-1, 1]) {
    at(s * FACE.eyeZ, FACE.eyeY + 0.01, s); blob(-1, 0.5, 19, 12, shade(0.74), 0.14);
    at(s * 0.085, -0.13, s); blob(0, 0, 3.4, 12, shade(0.76), 0.1);
    at(s * 0.62, -0.32, s); blob(0, 0, 16, 5, shade(0.75), P.fem ? 0.12 : 0.08, 0.35);
    at(s * 0.7, -0.75, s); blob(0, 0, 14, 20, shade(0.7), 0.14, -0.2);
  }
  at(0, FACE.mouthY - 0.12); blob(0, 0, 10, 3.5, shade(0.72), 0.16);
  at(0, -0.97); blob(0, 0, 40, 10, shade(0.6), 0.25);
  // her make-up's shaping: soft gradients of a deeper tone carving the face - hollows under the cheekbones, rising to the
  // ears; the temples; the jaw falling away below its line; a fine shadow down each side of a slim bridge, a little under
  // the tip lifting it - and light on the high points: the cheekbones, under the brows' arch, down the bridge to the tip,
  // the middle of the forehead and the chin, the cupid's bow; her blush on the apples, swept up toward the temples
  if (M) {
    // (placed by angle round from the front, angle up: atA)
    const ct = M.contour, gl = M.glow, cC = M.cC, hl = M.hl, atA = (az, el, s) => at(s * Math.sin(az) * Math.cos(el), Math.sin(el), s);
    for (const s of [-1, 1]) {
      // (each a share from almost none at 0 to a carved, lit face at 1: the sliders' whole range reads)
      // (no shadow painted in the hollow under the cheekbones: the user asked for the dark cheek lines gone, at any setting)
      atA(0.66, -0.1, s); blob(0, 0.5, 14, 4.5, hl, 0.03 + 0.37 * gl, 0.4);
      atA(1.0, 0.35, s); blob(0, 0, 7, 13, cC, 0.02 + 0.26 * ct);
      for (const [az, el] of [[0.3, -1.06], [0.6, -0.98], [0.85, -0.9], [1.08, -0.8]]) { atA(az, el, s); blob(0, 0, 10, 6, cC, 0.03 + 0.34 * ct, 0.3); }
      at(s * 0.068, -0.13, s); blob(0, 0, 1.4, 12, cC, 0.03 + 0.3 * ct);
      at(s * 0.4, FACE.browY - 0.07, s); blob(2, 0, 7, 1.8, hl, 0.04 + 0.26 * gl, -0.12);
      atA(0.55, -0.21, s); blob(0, 0, 13, 8, M.blushC, 0.04 + 0.18 * M.blush, 0.45);
    }
    at(0, -0.11); blob(0, 0, 1.3, 11, hl, 0.05 + 0.3 * gl); at(0, FACE.tipY + 0.025); blob(0, 0.4, 2.4, 2, hl, 0.08 + 0.42 * gl);
    at(0, FACE.tipY - 0.045); blob(0, 0, 5, 1.6, cC, 0.03 + 0.14 * ct);
    at(0, 0.4); blob(0, 0, 8, 12, hl, 0.03 + 0.12 * gl); at(0, FACE.chinY + 0.04); blob(0, 0, 5.5, 3.5, hl, 0.04 + 0.18 * gl);
    at(0, FACE.mouthY + 0.075); blob(0, 0, 3.2, 1.2, hl, 0.06 + 0.3 * gl);
  }
  x.setTransform(1, 0, 0, 1, 0, 0);
  // her eyeshadow: a soft colour over the lids, up toward the brow (with her make-up: with the eyes)
  if (P.shadow && !M) for (const s of [-1, 1]) { at(s * FACE.eyeZ, FACE.eyeY, s); blob(1.5, 5, 16, 8, P.shadow, 0.3); blob(4, 3, 9, 5, P.shadow, 0.22); }
  // a man's shaving shadow, or stubble: along the jaw, round the chin and the mouth, up the cheeks to the sideburns
  if (P.stub > 0) {
    // (its edges feathered: the shadow and its grain drawn apart, then kept only where a softened outline of it is)
    const c2 = document.createElement('canvas'); c2.width = c2.height = Z; const y = ctx2d(c2);
    y.fillStyle = rgba(P.beard, 0.1 + 0.3 * P.stub); y.fillRect(0, 0, Z, Z);
    y.globalAlpha = 0.15 + 0.55 * P.stub; y.fillStyle = y.createPattern(grainTile(), 'repeat'); y.scale(kp * 0.6, kp * 0.6); y.fillRect(0, 0, Z / kp / 0.6, Z / kp / 0.6); y.setTransform(1, 0, 0, 1, 0, 0); y.globalAlpha = 1;
    const pts = [[0.95, -0.02], [0.88, -0.2], [0.66, -0.34], [0.4, -0.38], [0.17, FACE.baseY - 0.035], [0, FACE.baseY - 0.03]], all = [...pts.map(([z, v]) => [-z, v]), ...pts.slice().reverse(), [0.97, -0.4], [0.75, -1], [-0.75, -1], [-0.97, -0.4]];
    y.globalCompositeOperation = 'destination-in'; y.filter = `blur(${(12 * kp).toFixed(1)}px)`; y.fillStyle = '#000'; y.beginPath();
    all.forEach(([z, v], i) => { const [u, w] = px(z, v); if (i) y.lineTo(u, w); else y.moveTo(u, w); }); y.closePath(); y.fill();
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(c2, 0, 0);
  }
  // the brows: a tapered stroke, hair by hair - hers arched and fine (by her look: brushed up and feathery, or sculpted -
  // a clean arch, a sharp tail, a little deeper), a man's straighter and fuller
  const rb = seeded(base + 'b'), BW = M ? BROWS[M.brow] || BROWS.soft : null, browC = M?.brow === 'sculpted' ? hexOf(new THREE.Color(P.brow).multiplyScalar(0.8)) : P.brow;
  for (const s of [-1, 1]) {
    at(s * (FACE.eyeZ - 0.02), FACE.browY, s);
    const B = BW ? BW.B : P.fem ? [[-12, -1.4, 2.4], [-3, 1.0, 2.2], [5, 2.1, 1.7], [13.5, -1.2, 0.5]] : [[-12.5, -0.8, 3.6], [-3, 0.7, 3.4], [5, 1.3, 3], [14, -0.6, 1.2]], nB = B.length - 1;
    const at3 = (u) => { const i = Math.min(nB - 1, Math.floor(u * nB)), f = u * nB - i, a = B[i], b = B[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; };
    x.save(); x.filter = `blur(${((BW ? BW.blur : 0.7) * kp).toFixed(1)}px)`; x.fillStyle = rgba(browC, BW ? BW.a : 0.82); x.beginPath();
    for (let i = 0; i <= 12; i++) { const [bx, by, bt] = at3(i / 12); if (i) x.lineTo(bx, by + bt / 2); else x.moveTo(bx, by + bt / 2); }
    for (let i = 12; i >= 0; i--) { const [bx, by, bt] = at3(i / 12); x.lineTo(bx, by - bt / 2 + (i === 0 ? 0.6 : 0)); }
    x.closePath(); x.fill(); x.restore();
    x.strokeStyle = rgba(browC, 0.55); x.lineWidth = BW?.up ? 0.28 : 0.35; x.lineCap = 'round';
    // (brushed up: the hairs steeper, longer at the front, some reaching past its edge)
    for (let i = 0, n = BW ? BW.n : 46; i < n; i++) { const u = BW?.up ? rb() ** 1.4 : rb(), [bx, by, bt] = at3(u), ang = (BW?.up ? 0.5 + 1.0 * (1 - u) : 0.35 + 0.9 * (1 - u)) + (rb() - 0.5) * 0.3, l = (1.6 + rb() * 1.4) * (BW?.up ? 1.25 : 1), oy = (rb() - 0.5) * bt * 0.9; x.beginPath(); x.moveTo(bx - Math.cos(ang) * l * 0.5, by + oy - Math.sin(ang) * l * 0.5); x.lineTo(bx + Math.cos(ang) * l * 0.5, by + oy + Math.sin(ang) * l * 0.5); x.stroke(); }
  }
  // the eyes
  const ic = new THREE.Color(P.iris), icL = hexOf(ic.clone().lerp(new THREE.Color('#e8d6a8'), 0.22)), icD = hexOf(ic.clone().multiplyScalar(0.3)), ink = P.fem ? '#120c0a' : '#1d1410';
  // (the iris about half the eye's width - most of what shows between the lids, its top and bottom under them;
  // its white never paper: a soft off-white as light as the skin round it allows - its lightness a share of the skin's, the
  // darker the skin the deeper - shaded under the lid; from a few metres an eye reads as a dark almond with its catchlight,
  // not a white spot)
  const EW = P.fem ? 14.8 : 13.8, EH = P.fem ? 6.2 : 5.1, tilt = P.fem ? 1.2 : 0.3, IR = P.fem ? 7.4 : 6.8, scW = new THREE.Color('#e9e2dc'), scl = hexOf(scW.clone().multiplyScalar(Math.min(0.66, (0.13 + 1.35 * lumOf(sk)) / lumOf(scW)))), scD = hexOf(scW.clone().lerp(sk, 0.5).multiplyScalar(0.3));
  const almond = () => { x.beginPath(); x.moveTo(-EW, -0.5); x.bezierCurveTo(-EW * 0.55, EH * 1.22, EW * 0.4, EH * 1.28, EW, tilt); x.bezierCurveTo(EW * 0.45, -EH * 0.8, -EW * 0.5, -EH * 0.86, -EW, -0.5); x.closePath(); };
  // (her upper lid's line, the almond's own: from the inner corner (t 0) to the outer (1); its normal, up off the eye; her
  // liner's weight along it (LW at the outer corner) and its top edge; the lower lid's line, from the outer corner (0) in)
  const LW = M ? 0.35 + 1.5 * M.liner : 0;
  const bz = (t) => { const u = 1 - t; return [-EW * u * u * u - 1.65 * EW * u * u * t + 1.2 * EW * u * t * t + EW * t * t * t, -0.5 * u * u * u + 3.66 * EH * u * u * t + 3.84 * EH * u * t * t + tilt * t * t * t]; };
  const nrm = (t) => { const a = bz(Math.max(0, t - 0.01)), b = bz(Math.min(1, t + 0.01)), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  const th = (t) => 0.2 + LW * t ** 1.6, up = (t, k = 1) => { const p = bz(t), q = nrm(t), o = th(t) * k; return [p[0] + q[0] * o, p[1] + q[1] * o]; };
  const lb = (t) => { const u = 1 - t; return [EW * u * u * u + 1.35 * EW * u * u * t - 1.5 * EW * u * t * t - EW * t * t * t, tilt * u * u * u - 2.4 * EH * u * u * t - 2.58 * EH * u * t * t - 0.5 * t * t * t]; };
  for (const s of [-1, 1]) {
    at(s * FACE.eyeZ, FACE.eyeY, s);
    // (the lid's crease above)
    x.save(); x.filter = `blur(${(0.9 * kp).toFixed(1)}px)`; x.strokeStyle = rgba(shade(0.55), 0.35); x.lineWidth = 0.9; x.beginPath(); x.moveTo(-EW * 0.75, EH * 0.95); x.bezierCurveTo(-EW * 0.3, EH * 2.1, EW * 0.45, EH * 2.05, EW * 0.98, EH * 0.75); x.stroke(); x.restore();
    if (M) {
      // (her shadow: a wash over the lid up into the crease; smoked along the lash line - as deep as the look is - deepest
      // at the outer corner and swept out and up with the wing; light in the inner corner)
      // (on deep skin the wash's range wider: its depth has less to show against)
      blob(1, 5, 17, 9, M.lidC, M.dark ? 0.12 + 0.5 * M.smoke : 0.18 + 0.32 * M.smoke);
      for (const [w, a, o] of [[9, 0.26, 4.4], [4.4, 0.4, 2]]) {
        x.save(); x.filter = `blur(${(w * 0.75 * kp).toFixed(1)}px)`; x.strokeStyle = rgba(M.lidD, Math.min(0.9, a * (M.dark ? 0.2 + 1.3 * M.smoke : 0.25 + M.smoke)).toFixed(2)); x.lineWidth = w; x.lineCap = 'round'; x.beginPath();
        for (let i = 3; i <= 20; i++) { const t = i / 20, p = bz(t), q = nrm(t), k = o * (0.5 + 0.5 * t); if (i > 3) x.lineTo(p[0] + q[0] * k, p[1] + q[1] * k); else x.moveTo(p[0] + q[0] * k, p[1] + q[1] * k); }
        x.lineTo(EW + 0.4 * M.wing + o * 0.3, tilt + 0.35 * M.wing + o); x.stroke(); x.restore();
      }
      blob(EW * 0.82, 3.2, 7, 5, M.lidD, 0.1 + 0.45 * M.smoke, 0.5); blob(-EW * 0.82, 1.1, 3.4, 2.6, M.hl, 0.14 + 0.26 * M.glow);
    }
    x.save(); almond(); x.clip();
    x.fillStyle = scl; x.fillRect(-EW - 2, -EH - 3, 2 * EW + 4, 2 * EH + 6);
    // (the globe turning away toward the corners, in the lids' shadow there: only the white beside the iris catches the light)
    { const sg = x.createRadialGradient(-0.4, 0.8, IR * 0.9, -0.4, 0.8, EW * 1.05); sg.addColorStop(0, rgba(scD, 0)); sg.addColorStop(1, rgba(scD, 0.7)); x.fillStyle = sg; x.fillRect(-EW - 2, -EH - 3, 2 * EW + 4, 2 * EH + 6); }
    blob(-EW * 0.95, -0.3, 5.5, 5, '#c9938c', 0.55); blob(EW, 0, 6, 5, '#b9a39b', 0.5);
    const cx0 = -0.4, cy0 = 0.3, g = x.createRadialGradient(cx0, cy0, IR * 0.3, cx0, cy0, IR);
    g.addColorStop(0, icL); g.addColorStop(0.55, P.iris); g.addColorStop(0.8, hexOf(ic.clone().multiplyScalar(0.72))); g.addColorStop(1, icD);
    x.fillStyle = g; x.beginPath(); x.arc(cx0, cy0, IR, 0, Math.PI * 2); x.fill();
    x.strokeStyle = rgba(icL, 0.35); x.lineWidth = 0.3; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2 + rb() * 0.2; x.beginPath(); x.moveTo(cx0 + Math.cos(a) * IR * 0.42, cy0 + Math.sin(a) * IR * 0.42); x.lineTo(cx0 + Math.cos(a) * IR * 0.85, cy0 + Math.sin(a) * IR * 0.85); x.stroke(); }
    x.fillStyle = '#0b0807'; x.beginPath(); x.arc(cx0, cy0, IR * 0.4, 0, Math.PI * 2); x.fill();
    // (the upper lid's shadow on the eye)
    const lg = x.createLinearGradient(0, EH * 1.3, 0, -EH * 0.4); lg.addColorStop(0, 'rgba(45,25,20,0.82)'); lg.addColorStop(1, 'rgba(45,25,20,0)'); x.fillStyle = lg; x.fillRect(-EW - 2, -EH - 3, 2 * EW + 4, 2 * EH + 6);
    // (and the whole eye set back under the brow and the lids, a little in their shade - only its catchlights as bright as the light)
    x.fillStyle = rgba(scD, 0.3); x.fillRect(-EW - 2, -EH - 3, 2 * EW + 4, 2 * EH + 6);
    // (the catchlights: both eyes lit from the same side)
    x.fillStyle = 'rgba(255,255,255,0.92)'; x.beginPath(); x.arc(cx0 - 1.7 * s, cy0 + 1.9, 1.15, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.45)'; x.beginPath(); x.arc(cx0 + 1.6 * s, cy0 - 1.7, 0.55, 0, Math.PI * 2); x.fill();
    x.restore();
    // (the lash line's soft shadow along the upper lid, under any liner: from a few metres the eye's top edge reads dark)
    x.save(); x.filter = `blur(${(0.8 * kp).toFixed(2)}px)`; x.strokeStyle = rgba(ink, P.fem ? 0.5 : 0.42); x.lineWidth = P.fem ? 1.7 : 1.3; x.lineCap = 'round'; x.beginPath(); for (let i = 1; i <= 20; i++) { const p = bz(i / 20), q = nrm(i / 20), o = 0.35 + 0.4 * (i / 20); if (i > 1) x.lineTo(p[0] + q[0] * o, p[1] + q[1] * o); else x.moveTo(p[0] + q[0] * o, p[1] + q[1] * o); } x.stroke(); x.restore();
    // (the upper lid's line and its lashes, thicker toward the outer corner - hers winged a little; the lower lid softer)
    if (M) {
      // (her liner: fine at the inner corner, heavier along the lash line toward the outer, flicked out to a sharp wing
      // along the line of the lower lashes; her lashes full - longer toward the outer corner, curling up and out - over a
      // soft line of mascara at their roots; the lower lash line smoked toward the outer corner, a few fine lashes there)
      // (the wing's angle: her own (wingA, degrees), or lifting the more the heavier the liner; the lashes and their mascara
      // in the look's own ink, the liner in its own shade - a soft chocolate wing over black lashes)
      const wa = M.wingA != null ? M.wingA * Math.PI / 180 : 0.36 + 0.14 * M.liner, tip = [EW + M.wing * Math.cos(wa), tilt + M.wing * Math.sin(wa)], tw = Math.min(0.86, 0.86 - 0.022 * M.wing), lashC = M.lashC || M.inkC;
      x.save(); x.filter = `blur(${(0.6 * kp).toFixed(2)}px)`; x.strokeStyle = rgba(lashC, 0.42 + 0.38 * M.lash); x.lineWidth = 1.1 + 0.8 * M.lash; x.beginPath();
      for (let i = 2; i <= 20; i++) { const p = up(i / 20, 0.9); if (i > 2) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); } x.stroke(); x.restore();
      x.save(); x.filter = `blur(${(0.25 * kp).toFixed(2)}px)`; x.fillStyle = M.inkC; x.beginPath(); x.moveTo(-EW - 0.2, -0.45);
      for (let i = 1; i <= 24; i++) { const p = bz(i / 24); x.lineTo(p[0], p[1]); }
      const pw = up(tw); x.lineTo(tip[0], tip[1]); x.quadraticCurveTo((tip[0] + pw[0]) / 2 - 0.2, (tip[1] + pw[1]) / 2 - 0.25, pw[0], pw[1]);
      for (let i = Math.floor(tw * 24); i >= 0; i--) { const p = up(i / 24); x.lineTo(p[0], p[1]); }
      x.closePath(); x.fill(); x.restore();
      const nL = Math.round(16 + 26 * M.lash), lw = 0.36 * (0.7 + 0.3 * M.lash); x.strokeStyle = rgba(lashC, 0.88); x.lineCap = 'round';
      for (let i = 0; i < nL; i++) {
        const t = 0.1 + 0.88 * (i + rb() * 0.7) / nL, q = nrm(t), lean = 0.2 + 1.0 * t ** 1.5, L = (1.5 + 3.4 * t ** 1.3) * (0.6 + 0.4 * M.lash) * (0.85 + 0.3 * rb());
        const dx = q[0] * Math.cos(lean) + q[1] * Math.sin(lean), dy = -q[0] * Math.sin(lean) + q[1] * Math.cos(lean), [sx, sy] = up(t, 0.5), ex = sx + dx * L, ey = sy + dy * L + 0.25 * L * t;
        x.lineWidth = lw; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + dx * L * 0.6, sy + dy * L * 0.6, (sx + ex) / 2 + dx * L * 0.1, (sy + ey) / 2 + dy * L * 0.1); x.stroke();
        x.lineWidth = lw * 0.5; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + dx * L * 0.6, sy + dy * L * 0.6, ex, ey); x.stroke();
      }
      x.save(); x.filter = `blur(${((0.6 + 0.5 * M.lower) * kp).toFixed(2)}px)`; x.strokeStyle = rgba(M.lidD, 0.1 + 0.5 * M.lower); x.lineWidth = 0.9 + 1.6 * M.lower; x.beginPath();
      for (let i = 0; i <= 12; i++) { const p = lb(i / 12 * 0.68); if (i) x.lineTo(p[0], p[1] - 0.6); else x.moveTo(p[0] + 0.8, p[1] - 0.2); } x.stroke(); x.restore();
      if (M.lash >= 0.8) { x.strokeStyle = rgba(lashC, 0.5); x.lineWidth = 0.18; for (let i = 0; i < 7; i++) { const t = 0.04 + i * 0.075, p = lb(t); x.beginPath(); x.moveTo(p[0], p[1] - 0.3); x.lineTo(p[0] + 0.4 + (1 - t) * 0.6, p[1] - 1.1 - 0.6 * (1 - t)); x.stroke(); } }
    } else {
      const LT = P.fem ? 1.7 : 0.95;
      x.fillStyle = ink; x.beginPath(); x.moveTo(-EW - 0.3, -0.5); x.bezierCurveTo(-EW * 0.55, EH * 1.22, EW * 0.4, EH * 1.28, EW, tilt);
      if (P.fem) { x.lineTo(EW + 3, tilt + 1.8); x.lineTo(EW + 0.6, tilt + 1.0); }
      x.bezierCurveTo(EW * 0.42, EH * 1.28 + LT * 1.4, -EW * 0.55, EH * 1.22 + LT * 0.7, -EW * 0.9, 0.2); x.closePath(); x.fill();
      if (P.fem) { x.strokeStyle = rgba(ink, 0.8); x.lineWidth = 0.4; for (let i = 0; i < 9; i++) { const u = 0.35 + i * 0.075, bx = -EW + 2 * EW * u, by = EH * 1.2 * Math.sin(Math.PI * Math.min(1, u * 1.05)) + tilt * u + LT * 0.5; x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(bx + 0.8 + u, by + 1.4, bx + 1.6 + u * 1.5, by + 1.9); x.stroke(); } }
    }
    x.save(); x.filter = `blur(${(0.5 * kp).toFixed(1)}px)`; x.strokeStyle = rgba(P.fem ? '#3a2620' : shade(0.45), P.fem ? 0.6 : 0.4); x.lineWidth = P.fem ? 0.55 : 0.45; x.beginPath(); x.moveTo(-EW * 0.55, -EH * 0.72); x.bezierCurveTo(-EW * 0.1, -EH * 0.95, EW * 0.5, -EH * 0.8, EW * 0.98, tilt - 0.1); x.stroke(); x.restore();
    blob(-EW + 1.1, -0.3, 1.5, 1.2, '#d88884', 0.75);
  }
  // the nose: its nostrils, a shadow under its tip, light on its bridge and its tip
  at(0, FACE.baseY + 0.005);
  for (const s of [-1, 1]) { blob(s * 5, 0.8, 1.8, 0.85, shade(0.5), 0.42, s * 0.4); blob(s * 4.9, 0.7, 0.9, 0.45, shade(0.35), 0.35, s * 0.4); }
  at(0, FACE.tipY + 0.06); blob(0, 2, 3.2, 3, '#ffffff', 0.1); at(0, -0.12); blob(0, 0, 2, 8, '#ffffff', 0.06);
  // the lips: the upper with its bow, the lower fuller, darker toward the line between them, a highlight on the lower
  at(0, FACE.mouthY); const lk = S.lip, MW = P.fem ? 21 : 22, UH = (P.fem ? 5.4 : 3.8) * lk, LH = (P.fem ? 6.8 : 4.9) * lk;
  const lc = new THREE.Color(P.lip), lD = hexOf(lc.clone().multiplyScalar(0.62)), lL = hexOf(lc.clone().lerp(new THREE.Color('#ffffff'), 0.12));
  const lipU = () => { x.beginPath(); x.moveTo(-MW, 0.3); x.bezierCurveTo(-MW * 0.6, UH * 0.55, -MW * 0.38, UH * 1.04, -MW * 0.13, UH); x.quadraticCurveTo(0, UH * 0.68, MW * 0.13, UH); x.bezierCurveTo(MW * 0.38, UH * 1.04, MW * 0.6, UH * 0.55, MW, 0.3); x.bezierCurveTo(MW * 0.5, -0.35, -MW * 0.5, -0.35, -MW, 0.3); };
  const lipL = () => { x.beginPath(); x.moveTo(-MW * 0.96, 0.15); x.bezierCurveTo(-MW * 0.5, -0.45, MW * 0.5, -0.45, MW * 0.96, 0.15); x.bezierCurveTo(MW * 0.62, -LH * 1.18, -MW * 0.62, -LH * 1.18, -MW * 0.96, 0.15); };
  // (her liner: a colour of her own (lipLine), or the lip's own deepened)
  const deepC = M ? M.lipLine || hexOf(lc.clone().multiplyScalar(1 - 0.62 * M.deep)) : null;
  if (M) {
    // (her lips: lined in a deeper tone fading to a softer middle - an ombre - and darker toward the line between them)
    // (the fill's reach - the ombre's radius - narrowing as the liner reaches further in: by the look's own depth (deep0),
    // and, depth of her own, more steeply from there)
    const mid = hexOf(lc.clone().lerp(new THREE.Color('#ffffff'), 0.05 + 0.1 * M.deep)), d0 = M.deep0 ?? M.deep, dd = M.deep - d0;
    const oX = Math.max(0.42, Math.min(1.3, 0.98 - 0.12 * d0 - 0.5 * dd)), oY = Math.max(0.3, Math.min(0.9, 0.66 - 0.1 * d0 - 0.34 * dd));
    x.save(); x.filter = `blur(${(0.4 * kp).toFixed(2)}px)`; x.fillStyle = deepC; lipU(); x.fill(); lipL(); x.fill(); x.restore();
    for (const [path, cy, h, dn] of [[lipU, UH * 0.52, UH, 1], [lipL, -LH * 0.5, LH, -1]]) {
      x.save(); path(); x.clip(); x.save(); x.translate(0, cy); x.scale(MW * oX, h * oY);
      const g = x.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, rgba(mid, 1)); g.addColorStop(0.45, rgba(P.lip, 1)); g.addColorStop(0.8, rgba(P.lip, 0.55)); g.addColorStop(1, rgba(P.lip, 0)); x.fillStyle = g; x.fillRect(-1.3, -1.6, 2.6, 3.2); x.restore();
      const g2 = x.createLinearGradient(0, 0, 0, dn * h * 0.4); g2.addColorStop(0, rgba(deepC, 0.55)); g2.addColorStop(1, rgba(deepC, 0)); x.fillStyle = g2; x.fillRect(-MW - 1, -LH * 1.3, 2 * MW + 2, UH * 1.2 + LH * 1.3); x.restore();
    }
    // (its edge crisply lined: in her liner's own colour, a touch deeper, when she has one - always showing)
    x.save(); x.filter = `blur(${(0.3 * kp).toFixed(2)}px)`; x.strokeStyle = M.lipLine ? rgba(hexOf(new THREE.Color(M.lipLine).multiplyScalar(0.82)), Math.max(0.6, 0.2 + 0.6 * M.deep)) : rgba(hexOf(lc.clone().multiplyScalar(0.5 - 0.22 * M.deep)), 0.2 + 0.6 * M.deep); x.lineWidth = 0.3 + 0.4 * M.deep; lipU(); x.stroke(); lipL(); x.stroke(); x.restore();
  } else {
    x.save(); x.filter = `blur(${(0.45 * kp).toFixed(1)}px)`;
    let g = x.createLinearGradient(0, UH, 0, -0.2); g.addColorStop(0, lL); g.addColorStop(0.6, P.lip); g.addColorStop(1, lD); x.fillStyle = g;
    lipU(); x.fill();
    g = x.createLinearGradient(0, -0.3, 0, -LH); g.addColorStop(0, lD); g.addColorStop(0.35, P.lip); g.addColorStop(1, hexOf(lc.clone().multiplyScalar(0.88))); x.fillStyle = g;
    lipL(); x.fill();
    x.restore();
  }
  x.save(); x.filter = `blur(${(0.4 * kp).toFixed(1)}px)`; x.strokeStyle = rgba(hexOf(lc.clone().multiplyScalar(0.3)), 0.85); x.lineWidth = 0.55; x.beginPath(); x.moveTo(-MW * 0.98, 0.35); x.bezierCurveTo(-MW * 0.5, -0.4, MW * 0.5, -0.4, MW * 0.98, 0.35); x.stroke(); x.restore();
  for (const s of [-1, 1]) blob(s * MW * 0.98, 0.2, 1.4, 1.1, hexOf(lc.clone().multiplyScalar(0.35)), 0.5);
  if (!M) { blob(0, -LH * 0.45, MW * 0.32, LH * 0.22, '#ffffff', P.fem ? 0.3 : 0.14); for (const s of [-1, 1]) blob(s * MW * 0.3, UH * 0.55, 3, 0.9, '#ffffff', 0.12); }
  else {
    // (her gloss, a glass finish as wet as the look: a broad sheen across the lower lip over a deeper band below it, crisp
    // points of light along it - the floodlights caught - and small ones on the upper lip's fullness)
    const G = M.gloss;
    x.save(); lipL(); x.clip(); blob(0, -LH * 0.84, MW * 0.45, LH * 0.16, deepC, 0.3 * G); blob(-MW * 0.04, -LH * 0.44, MW * 0.36, LH * 0.2, '#ffffff', 0.2 + 0.28 * G); x.restore();
    x.save(); x.filter = `blur(${(0.2 * kp).toFixed(2)}px)`; x.fillStyle = `rgba(255,255,255,${(0.3 + 0.6 * G).toFixed(2)})`;
    x.beginPath(); x.ellipse(-MW * 0.08, -LH * 0.4, MW * 0.15, LH * 0.075, -0.06, 0, Math.PI * 2); x.fill();
    for (const [dx, dy, r] of [[MW * 0.2, -LH * 0.36, 0.55], [-MW * 0.32, -LH * 0.46, 0.4], [MW * 0.36, -LH * 0.5, 0.32], [MW * 0.07, -LH * 0.57, 0.28]]) { x.beginPath(); x.arc(dx, dy, r, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = `rgba(255,255,255,${(0.15 + 0.45 * G).toFixed(2)})`; for (const s of [-1, 1]) { x.beginPath(); x.ellipse(s * MW * 0.3, UH * 0.6, 2.2, 0.5, s * 0.22, 0, Math.PI * 2); x.fill(); }
    x.restore();
  }
  x.setTransform(1, 0, 0, 1, 0, 0);
  // her baby hairs: fine wisps in her hair's colour along her hairline at the forehead and the temples, down and out toward
  // the ears, over a soft shadow of it where the hair comes out of the skin - the skin and the hair one
  if (M && HL) {
    const rh = seeded(base + 'h'), lineAt = (ph) => { const f = Math.min(27.999, ph / 1.2 * 28), i = Math.floor(f); return HL[i] + (HL[i + 1] - HL[i]) * (f - i); };
    const dir = (ph, ny) => [Math.sin(ph) * Math.sqrt(Math.max(0, 1 - ny * ny)), ny];
    // (where the hair is seen to leave the skin: a little below the line, by the hair's own thickness over the skin - a
    // sleek style's a little higher, worn long a little lower: the wisps long enough to come out from under it either way)
    const edge = (ph) => lineAt(ph) - 0.07;
    for (const s of [-1, 1]) {
      for (let ph = 0.03; ph < 1.12; ph += 0.06) { const [nz, ny] = dir(ph, edge(ph) + 0.004); at(s * nz, ny, s); blob(0, 0, 4.5, 2.2, P.hair, 0.1); }
      x.lineCap = 'round';
      // (each a short curve from just under the hair, all lying the same way - down at the forehead, swept back toward the
      // ears at the temples)
      for (let i = 0; i < 52; i++) {
        const ph = 0.04 + 1.02 * rh() ** 0.7, [nz, ny] = dir(ph, edge(ph) + 0.02 + 0.015 * rh()); at(s * nz, ny, s);
        const L = 3.5 + 3 * rh(), a = -Math.PI / 2 + 0.5 * ph + (rh() - 0.5) * 0.25, b = (0.12 + 0.3 * rh()) * (ph > 0.5 || rh() < 0.6 ? 1 : -1);
        x.strokeStyle = rgba(P.hair, (0.18 + 0.2 * rh()).toFixed(2)); x.lineWidth = 0.1 + 0.08 * rh();
        x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(Math.cos(a) * L * 0.5, Math.sin(a) * L * 0.5, Math.cos(a + b) * L, Math.sin(a + b) * L); x.stroke();
      }
    }
    x.setTransform(1, 0, 0, 1, 0, 0);
  }
  // (its sides, in front of the ears, eased back to the plain skin: the paint's edge is carried on round the back of the
  // head as it is there - a stubble's or a contour's last column would be drawn out into streaks round the nape)
  for (const [x0, x1] of [[0, 0.07 * Z], [Z, 0.93 * Z]]) { const g = x.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, rgba(P.skin, 1)); g.addColorStop(0.35, rgba(P.skin, 0.85)); g.addColorStop(1, rgba(P.skin, 0)); x.fillStyle = g; x.fillRect(Math.min(x0, x1), 0, 0.07 * Z, Z); }
  const tex = surf ? surf.tex : new THREE.CanvasTexture(cv); if (surf) tex.needsUpdate = true; else tex.colorSpace = THREE.SRGBColorSpace;
  // the paint's finish (a roughnessMap: its green the share of the skin's roughness): her lips as glossy as her look, her
  // eyes wet, a dewy sheen on the T-zone and the cheekbones; everywhere else - and all of a man's face - the skin's own
  let rough = roughFlat(), eyeN = null, eyeK = null;
  if (M) {
    const rc = surf ? surf.rc : document.createElement('canvas'); rc.width = rc.height = Z >> 1; const fx = x; x = ctx2d(rc); K = 0.5;
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, Z, Z);
    const d = 0.22 * M.dew, gr = (m) => { const v = Math.round(255 * m); return `rgb(${v},${v},${v})`; };
    at(0, 0.32); blob(0, 0, 9, 15, '#000000', d); at(0, -0.12); blob(0, 0, 4, 14, '#000000', d); at(0, FACE.chinY + 0.04); blob(0, 0, 5, 3.5, '#000000', d * 0.8);
    for (const s of [-1, 1]) { at(s * 0.55, -0.13, s); blob(0, 0, 12, 5, '#000000', d, 0.4); }
    // (a highlighter's sheen: the cheekbones, the bridge and the cupid's bow catching the light as it goes up)
    { const g2 = 0.34 * M.glow, atA = (az, el, s) => at(s * Math.sin(az) * Math.cos(el), Math.sin(el), s); for (const s of [-1, 1]) { atA(0.66, -0.1, s); blob(0, 0.5, 13, 4, '#000000', g2, 0.4); } at(0, -0.11); blob(0, 0, 1.4, 10, '#000000', g2); at(0, FACE.mouthY + 0.075); blob(0, 0, 3, 1.1, '#000000', g2 * 0.8); }
    // (wet - glossy as an eye is: its highlights the room's lights as small sharp glints, the rest of it as dark as the
    // eye's own colour. Half-glossy, as the skin is, its broad sheen washed the whole iris white at three-quarter and
    // smeared the eye into a white slit from a few metres)
    for (const s of [-1, 1]) { at(s * FACE.eyeZ, FACE.eyeY, s); x.fillStyle = gr(0.15); almond(); x.fill(); }
    at(0, FACE.mouthY); x.filter = `blur(${(0.5 * kp).toFixed(2)}px)`; x.fillStyle = gr(1 - 0.72 * M.gloss); lipU(); x.fill(); lipL(); x.fill(); x.filter = 'none';
    // (its red the paint's own shade from the room's light - the face's aoMap; the green alone is the roughness: all the
    // skin's own, the eye set back under its lids and brow - the room no broad white sheen over it, only its glints)
    // (red added at full: it saturates to 255, the green and blue untouched - no read back of the canvas)
    { x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'lighter'; x.fillStyle = '#ff0000'; x.fillRect(0, 0, rc.width, rc.width); x.globalCompositeOperation = 'source-over'; }
    x.globalCompositeOperation = 'multiply'; x.fillStyle = 'rgb(90,255,255)'; for (const s of [-1, 1]) { at(s * FACE.eyeZ, FACE.eyeY, s); almond(); x.fill(); } x.globalCompositeOperation = 'source-over';
    // (and the eye's own round (a normalMap, tangent space): between the lids its surface turned as a globe's is, about the
    // iris - the light's and the room's reflections in it small glints, never a sheet of light across a flat eye)
    // (it is the head's shape alone - never her make-up's: one for every paint of that head, kept while any of them is)
    const nk = !surf && `${rc.width}|${P.fem ? 1 : 0}|${Object.keys(S).sort().map((k) => (typeof S[k] === 'number' ? `${k}${S[k].toFixed(4)}` : '')).join(',')}`, nE = nk && EYE_N.get(nk); eyeK = nk || null;
    if (nE) { nE.refs++; eyeN = nE.tex; }
    else if (!surf) {
      const nc = document.createElement('canvas'); nc.width = nc.height = rc.width; const y2 = ctx2d(nc); y2.fillStyle = 'rgb(128,128,255)'; y2.fillRect(0, 0, nc.width, nc.width);
      const id = y2.getImageData(0, 0, nc.width, nc.width), a = id.data, Rg = 1.4 * EW, NW = nc.width;
      for (const s of [-1, 1]) {
        at(s * FACE.eyeZ, FACE.eyeY, s); almond(); const T = x.getTransform(), ca = Math.abs(T.a), cd = Math.abs(T.d), cxp = -0.4 * T.a + T.e, cyp = 0.3 * T.d + T.f;
        const xa = T.e - ca * EW - 2, xb = T.e + ca * EW + 2, ya = T.f - cd * EH * 1.5 - 2, yb = T.f + cd * EH * 1.5 + 2;
        for (let py = Math.max(0, Math.floor(ya)); py <= Math.min(NW - 1, Math.ceil(yb)); py++) for (let px = Math.max(0, Math.floor(xa)); px <= Math.min(NW - 1, Math.ceil(xb)); px++) {
          if (!x.isPointInPath(px + 0.5, py + 0.5)) continue;
          const tx = (px + 0.5 - cxp) / (ca * Rg), ty = -(py + 0.5 - cyp) / (cd * Rg), tz = Math.sqrt(Math.max(0.1, 1 - tx * tx - ty * ty)), l = Math.hypot(tx, ty, tz), i = (py * NW + px) * 4;
          a[i] = 128 + 127 * tx / l; a[i + 1] = 128 + 127 * ty / l; a[i + 2] = 128 + 127 * tz / l;
        }
      }
      y2.putImageData(id, 0, 0); eyeN = new THREE.CanvasTexture(nc); EYE_N.set(nk, { tex: eyeN, refs: 1 });
    }
    x.setTransform(1, 0, 0, 1, 0, 0); x = fx; K = 1;
    if (surf) { rough = surf.rough; rough.needsUpdate = true; } else rough = new THREE.CanvasTexture(rc);
  }
  if (surf) return { tex, rough, key, base, surf };
  E = { tex, rough, nrm: eyeN, nk: eyeN ? eyeK : null, key, base, refs: 1 }; FACE_TEX.set(key, E); return E;
}
/** the eye normal maps by head shape (faceTexture), shared by every paint of that head (refs: how many) */
const EYE_N = new Map();
/** a face's paint disposed: its textures, its share of the eye normal map */
function faceDrop(v) {
  v.tex.dispose(); if (v.rough !== ROUGH1) v.rough.dispose();
  const n = v.nk && EYE_N.get(v.nk); if (n) { if (--n.refs <= 0) { n.tex.dispose(); EYE_N.delete(v.nk); } } else v.nrm?.dispose();
}
/**
 * A person's own canvases for her face's paint, Z square (and its finish's, half that): drawn over again and again while a
 * style editor's slider moves - the same two textures re-sent, nothing new made, nothing in the cache -> { Z, cv, rc, tex,
 * rough, dispose() }
 */
function faceSurface(Z) {
  const cv = document.createElement('canvas'), rc = document.createElement('canvas'); cv.width = cv.height = Z; rc.width = rc.height = Z >> 1;
  const tex = new THREE.CanvasTexture(cv), rough = new THREE.CanvasTexture(rc); tex.colorSpace = THREE.SRGBColorSpace;
  return { Z, cv, rc, tex, rough, dispose() { tex.dispose(); rough.dispose(); } };
}
/** a face's paint given back: kept while anyone wears it, and a few dozen more besides (the next build may want it) */
function faceRelease(E) {
  if (!E || --E.refs > 0) return;
  let idle = 0; for (const v of FACE_TEX.values()) if (v.refs <= 0) idle++;
  if (idle > FACE_IDLE) for (const [k, v] of FACE_TEX) if (v.refs <= 0) { faceDrop(v); FACE_TEX.delete(k); if (--idle <= FACE_IDLE) break; }
}
const FACE_IDLE = 24;
/** the face cache trimmed: idle paints (nobody wearing them) beyond maxIdle disposed, least recently used first (a style editor closing: 4) */
export function faceCacheTrim(maxIdle = 0) {
  let idle = 0; for (const v of FACE_TEX.values()) if (v.refs <= 0) idle++;
  for (const [k, v] of FACE_TEX) { if (idle <= maxIdle) break; if (v.refs <= 0) { faceDrop(v); FACE_TEX.delete(k); idle--; } }
}
/** -> { entries, idle, live } of the face cache (tests, a style editor) */
export function faceCacheStats() {
  let idle = 0, live = 0; for (const v of FACE_TEX.values()) { if (v.refs <= 0) idle++; else live += v.refs; }
  return { entries: FACE_TEX.size, idle, live, eyes: EYE_N.size };
}

// ---- hair ---------------------------------------------------------------------------------------------------------------
/** the body's own shape, to keep hair clear of it: inside(x, y, z, c) - within c of the torso, the shoulders, the neck, the arms */
function bodyClear(J, F, T) {
  const B = [], ball = (p, r) => B.push([p.x, p.y, p.z, r]), dn = new THREE.Vector3().subVectors(J.torsoB, J.torsoA).normalize();
  for (const s of ['R', 'L']) {
    const sh = J['sh' + s].clone().setZ(J['sh' + s].z * F.sh), el = J['el' + s], wr = J['wr' + s];
    ball(sh, F.del * 1.05); for (let i = 1; i <= 4; i++) ball(sh.clone().lerp(el, i / 4), F.arm[0] * 1.2); for (let i = 1; i <= 3; i++) ball(el.clone().lerp(wr, i / 3), F.arm[2] * 1.15);
  }
  for (let i = 0; i <= 3; i++) ball(J.torsoB.clone().lerp(J.neck, i / 3), F.neckR ?? F.nk[0]);
  // (the torso's section by height, worked out once a millimetre)
  const SEC = new Map(), at = (y) => {
    const key = Math.round(y * 1000); if (SEC.has(key)) return SEC.get(key);
    const f = ((key / 1000 - T.A.y) / Math.max(0.3, dn.y) + 0.11) / T.H, c = f < T.fLo || f > 1.08 ? null : T.c(f), s = c && { x: c.x, z: c.z, xf: T.pt(f, 0).x, xb: T.pt(f, Math.PI).x, rz: Math.abs(T.pt(f, Math.PI / 2).z - c.z) };
    // (her bust rounds out beyond an ellipse through the front and the sides: the front's reach grown to take it in)
    if (s && F.bust > 0) for (let a = 0.2; a <= 1.21; a += 0.2) { const p = T.pt(f, a), w = (p.z - c.z) / s.rz; if (w * w < 0.95) s.xf = Math.max(s.xf, c.x + (p.x - c.x) / Math.sqrt(1 - w * w)); }
    SEC.set(key, s); return s;
  };
  const inside = (x, y, z, c) => {
    const t = at(y); if (t) { const u = x > t.x ? (x - t.x) / (t.xf - t.x + c) : (t.x - x) / (t.x - t.xb + c), w = (z - t.z) / (t.rz + c); if (u * u + w * w < 1) return true; }
    for (const [bx, by, bz, br] of B) { const R = br + c; if ((x - bx) ** 2 + (y - by) ** 2 + (z - bz) ** 2 < R * R) return true; }
    return false;
  };
  return { at, inside };
}
/**
 * One lock of hair (a strand-clump) along points: wide across, thin through - a lens in section, two strands raised along
 * its outer face - from inside the scalp at its root to a point at its tip; o: { w, t (its width, thickness), away(p) (where
 * its outer face looks), shade (its colour: darker at the root, lighter toward the tip), wt(p) (the head's share of each
 * vertex: the hair near the head nods and turns with it, the ends lie still; none: all the head's), k (rings along), flat (one
 * shade all along: a strap) } -> geometry
 */
const LOCK = new Map();
function lockGeo(pts, o) {
  const K = n(o.k ?? 14, 5), M = n(o.m ?? 8, 5), Rn = K + 3, cv = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), P = Array.from({ length: K + 1 }, (_, i) => cv.getPoint(i / K));
  // (its section and its faces, the same for every lock of its size: worked out once)
  // (round: an ellipse in section, w across and t through - a strand of a spiral curl, a full lock - not a lens)
  const key = (Rn * 100 + M) * 2 + (o.round ? 1 : 0);
  if (!LOCK.has(key)) {
    const sec = Array.from({ length: M }, (_, j) => { const a = j / M * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a); return o.round ? [ca / 2, sa / 2] : [ca / 2, sa / 2 * (sa > 0 ? 1 + 0.25 * Math.cos(ca * Math.PI * 2) : 0.8)]; }), ix = [];
    for (let k = 0; k < Rn - 1; k++) for (let j = 0; j < M; j++) { const j1 = (j + 1) % M, a = k * M + j, b = k * M + j1, c = (k + 1) * M + j1, d = (k + 1) * M + j; if (k > 0) ix.push(a, c, b); if (k < Rn - 2) ix.push(a, d, c); }
    LOCK.set(key, { sec, ix: new Uint16Array(ix) });
  }
  const { sec, ix } = LOCK.get(key), nv = Rn * M, pos = new Float32Array(nv * 3), col = new Float32Array(nv * 3), si = new Uint16Array(nv * 4), sw = new Float32Array(nv * 4), T = new THREE.Vector3(), B = new THREE.Vector3(), NA = [];
  const put = (r, x, y, z, c, w) => { const i = r * M; for (let j = 0; j < M; j++) { const v = (i + j) * 3; pos[v] = x; pos[v + 1] = y; pos[v + 2] = z; if (typeof c === 'number') col[v] = col[v + 1] = col[v + 2] = c; else { col[v] = c[0]; col[v + 1] = c[1]; col[v + 2] = c[2]; } si[(i + j) * 4 + 1] = 1; sw[(i + j) * 4] = 1 - w; sw[(i + j) * 4 + 1] = w; } };
  // (her hair's own tones (o.tint: { root, ends - shares of its colour per channel - melt }): a shadow root melting into the
  // colour over melt metres from the lock's root, the ends turning toward theirs over its last half)
  const TI = o.tint || null, DL = TI ? P.reduce((a, p, i) => (a.push(i ? a[i - 1] + p.distanceTo(P[i - 1]) : 0), a), []) : null;
  // (the root at most four fifths of the way to its shade, melting over twice melt - the scalp's shell as deep where the
  // lock leaves it: never a hard dark band)
  const tcol = (i, u, sh) => { const kr = 1 - 0.8 * ss3(2 * (TI.melt ?? 0.07), 0, DL[i]), ke = ss3(0.55, 1, u); return [0, 1, 2].map((ch) => sh * (TI.root ? TI.root[ch] + (1 - TI.root[ch]) * kr : 1) * (TI.ends ? 1 + (TI.ends[ch] - 1) * ke : 1)); };
  for (let i = 0; i <= K; i++) {
    const u = i / K, c = P[i]; T.subVectors(P[Math.min(K, i + 1)], P[Math.max(0, i - 1)]).normalize();
    const Nn = o.away(c, u), Nr = Nn.clone().normalize(); Nn.addScaledVector(T, -Nn.dot(T)); if (Nn.lengthSq() < 1e-8) Nn.set(0, 1, 0).cross(T); Nn.normalize(); B.crossVectors(T, Nn);
    // (blendRoot: near its root lit all but wholly as what it comes out of faces (away itself) - no line where it leaves it)
    NA[i + 1] = o.blendRoot == null ? Nn.clone() : Nn.clone().lerp(Nr, ss3(0.4, 0.05, u)).normalize();
    const tip = ss3(1 - Math.max(0.001, o.tip ?? 0.35), 1, u), w = o.w * (0.12 + 0.88 * ss3(0, o.root ?? 0.16, u)) * (1 - (o.blunt ?? 0.88) * tip), t = o.t * (0.25 + 0.75 * ss3(0, (o.root ?? 0.16) * 0.8, u)) * (1 - 0.7 * tip) * (o.tk ? o.tk(u) : 1);
    // (rootSh(c): the shade of what its root comes out of, melting into its own)
    const dk = o.dark ?? 0.26, sh1 = o.flat ? o.shade : o.shade * (1 - dk + dk * ss3(0, 0.3, u) + 0.08 * ss3(0.55, 1, u)), sh0 = o.rootSh && u < 0.4 ? sh1 + (o.rootSh(c) - sh1) * ss3(0.4, 0.06, u) : sh1, sh = TI ? tcol(i, u, sh0) : sh0, wt = o.wt ? o.wt(c, u) : 1, r = i + 1;
    for (let j = 0; j < M; j++) { const [a, b] = sec[j], v = (r * M + j) * 3, q = r * M + j; pos[v] = c.x + B.x * a * w + Nn.x * b * t; pos[v + 1] = c.y + B.y * a * w + Nn.y * b * t; pos[v + 2] = c.z + B.z * a * w + Nn.z * b * t; if (TI) { col[v] = sh[0]; col[v + 1] = sh[1]; col[v + 2] = sh[2]; } else col[v] = col[v + 1] = col[v + 2] = sh; si[q * 4 + 1] = 1; sw[q * 4] = 1 - wt; sw[q * 4 + 1] = wt; }
    if (i === 0) put(0, c.x, c.y, c.z, sh, wt); if (i === K) put(K + 2, c.x, c.y, c.z, sh, wt);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
  g.setIndex(new THREE.BufferAttribute(ix, 1)); g.computeVertexNormals();
  // (lit as the mass of hair it lies in, not as a strip of its own: its normals drawn most of the way to the way out from
  // the head (or the body) - no step of light and shade at each lock's edge, only its outline)
  NA[0] = NA[1]; NA[K + 2] = NA[K + 1]; const Nm = g.attributes.normal, bl0 = o.blend ?? 0.62;
  for (let r = 0; r < Rn; r++) { const a = NA[r], bl = o.blendRoot == null ? bl0 : bl0 + (o.blendRoot - bl0) * ss3(0.4, 0.05, Math.max(0, r - 1) / K); for (let j = 0; j < M; j++) { const q = r * M + j; let x = Nm.getX(q) * (1 - bl) + a.x * bl, y = Nm.getY(q) * (1 - bl) + a.y * bl, z = Nm.getZ(q) * (1 - bl) + a.z * bl; const l = Math.hypot(x, y, z) || 1; Nm.setXYZ(q, x / l, y / l, z / l); } }
  return g;
}
/**
 * Hair beyond the scalp's own shell (see the head): locks from the parting over the head, the two sides falling away from
 * it, past the widest of the head and down - framing the face, over the ears, then (worn long) on to the shoulders: those
 * beside the face in front of them, the rest behind and down the back, clear of the body - in layers, lifted at the roots
 * (a blowout's the fullest, in broad waves); a fringe swept across the forehead from the parting; tendrils framing the face;
 * a bob's ends turned under at the jaw; a pixie's, short and tousled; a ponytail's, pulled back to its tie, and its tail; a
 * high ponytail's tail arching from its cuff on the crown; a bun's. H: { hs, seed, side (the parting's), hc, R0, shape, out (the shell's growth), toBody
 * (head space to the body's), J, C (bodyClear), fringe, line (the hairline), tie ({ p, d, dir }: where a ponytail or a bun
 * is tied) } -> { head: [geometries in the head's space], body: [geometries in the body's, with the head's share of each
 * vertex] }
 */
function hairLocks(H) {
  const { hc, hs, J, side } = H, rnd = seeded('hair|' + H.seed), res = { head: [], body: [] }, ysh = Math.min(J.shR.y, J.shL.y);
  // (her hair's own tones (H.tint: a shadow root, lighter ends) on the locks grown from the scalp - a tail's ends only; and
  // how much one lock's shade differs from the next (H.sk: 0 all alike .. 1 as ever .. 2 bold strands) - the same draws
  // from rnd as ever, so a style without them is just as it was)
  const tR = H.tint || null, tE = tR?.ends ? { ends: tR.ends, root: null, melt: tR.melt } : null, sk = H.sk ?? 1, jv = (a, b) => { const r = rnd(); return a + b * (sk === 1 ? r : 0.5 + (r - 0.5) * sk); };
  const dirOf = (ph, be) => V(Math.cos(be) * Math.cos(ph), Math.sin(be), Math.cos(be) * Math.sin(ph));
  /** the hair's surface (head space) in direction d - its shell where it grows, else the skin - lifted by lift */
  const capPt = (d, lift = 0) => { const [a, b, c] = H.shape(d.x, d.y, d.z), r = Math.hypot(a, b, c), k = H.R0 * (1 + H.out(d.x, d.y, d.z)) + lift / r; return V(hc.x + a * k, hc.y + b * k, hc.z + c * k); };
  /** p (head space) kept c clear of the head and its hair: pushed out sideways */
  const clear = (p, c) => {
    // (how far inside it is, along the way out from the head's middle: stepped out by that, twice at most)
    for (let i = 0; i < 3; i++) { const v = p.clone().sub(hc), L = v.length(), d = v.clone().multiplyScalar(1 / L), [a, b, cc] = H.shape(d.x, d.y, d.z), R = Math.hypot(a, b, cc) * H.R0 * (1 + H.out(d.x, d.y, d.z)); if (L >= R + c) break; const hz = V(v.x, 0, v.z), hl = Math.max(0.02, hz.length()); p.addScaledVector(hz, (R + c - L + 0.0005) * L / (hl * hl)); }
    return p;
  };
  const hcB = hc.clone().applyMatrix4(H.toBody), wt = (p) => ss3(J.neck.y - 0.1, J.neck.y + 0.035, p.y);
  /** away from the head (above the jaw), or from the body below it */
  const awayB = (p) => { const k = ss3(J.neck.y - 0.06, J.neck.y + 0.02, p.y), a = p.clone().sub(hcB).normalize(), sec = H.C.at(p.y), b = V(p.x - (sec ? sec.x : J.torsoB.x), 0, (p.z - (sec ? sec.z : 0)) * 0.6).normalize(); return b.lerp(a, k).normalize(); };
  const awayH = (p) => p.clone().sub(hc).normalize();
  // (the scalp's shell as it is in the direction of p (body space): its normal - its grooves smoothed over - and its shade
  // (see the head): a lock or a sheet coming out of it lit and coloured as it is there, so no line shows where they cross)
  const toHead = H.toBody.clone().invert();
  const shellAt = (p) => {
    const d = p.clone().applyMatrix4(toHead).sub(hc).normalize(), ph = phOf(d), be = Math.max(-1.3, Math.min(1.3, beOf(d))), e = 0.05;
    const a = capPt(dirOf(ph + e, be)).sub(capPt(dirOf(ph - e, be))), b = capPt(dirOf(ph, be + e)).sub(capPt(dirOf(ph, be - e))), nn = new THREE.Vector3().crossVectors(a, b).normalize();
    if (nn.dot(d) < 0) nn.negate(); return { n: nn.transformDirection(H.toBody), sh: 0.86 + 0.18 * clamp01(d.y + 0.2) };
  };
  /** away from the head - over it, the way its shell faces - or from the body below it; below the head's middle never
   * turned down as the shell under the occiput is: hair hanging there faces out, not down (no dark band at the nape) */
  const awayS = (p) => { const k = ss3(J.neck.y - 0.06, J.neck.y + 0.02, p.y), v = k > 0 ? awayB(p).lerp(shellAt(p).n, k).normalize() : awayB(p), f = ss3(hcB.y + 0.04, hcB.y - 0.03, p.y); if (f > 0 && v.y < 0) { v.y *= 1 - f; v.normalize(); } return v; };
  const shS = (p) => shellAt(p).sh, shSH = (p) => shS(p.clone().applyMatrix4(H.toBody));
  /** on down from S (body space) to ye: hanging straight, pushed clear of the body in front (dir 1) or behind (-1), never in toward it */
  const fall = (S, ye, dir, c) => {
    const pts = [], N = Math.max(2, Math.ceil((S.y - ye) / 0.028)); let p = S.clone();
    for (let i = 1; i <= N; i++) {
      p = V(p.x, S.y + (ye - S.y) * i / N, p.z + Math.sign(p.z - J.torsoB.z) * 0.002);
      // (out in 16 mm steps, then back in 4 mm ones: the least push that clears it)
      if (H.C.inside(p.x, p.y, p.z, c)) { let j = 0; while (j++ < 30 && H.C.inside(p.x, p.y, p.z, c)) p.x += dir * 0.016; for (let k = 0; k < 3 && !H.C.inside(p.x - dir * 0.004, p.y, p.z, c); k++) p.x -= dir * 0.004; }
      pts.push(p.clone());
    }
    return pts;
  };
  /**
   * a path over the head from direction (ph0, be0) round to (ph1, be1), staying high until late, lift above the hair -
   * from s0 of the way along it, its root sunk in the hair there (the scalp's shell carries the rest); rl: lifted off the
   * scalp near its root - standing up from the parting before it falls, settling lower as it goes -> [points, head space]
   */
  const over = (ph0, be0, ph1, be1, lift, ns = 7, e = 1.6, s0 = 0, rl = 0) => Array.from({ length: ns }, (_, i) => {
    const s = s0 + (1 - s0) * i / (ns - 1), ph = ph0 + (ph1 - ph0) * s, be = be0 + (be1 - be0) * s ** e, u = i / (ns - 1);
    // (its root well under the hair's surface, coming up out of it gradually: no ledge where it starts)
    return capPt(dirOf(ph, be), i === 0 ? -0.018 : lift * ss3(s0, s0 + (1 - s0) * 0.7, s) - 0.011 * (1 - ss3(s0, s0 + (1 - s0) * 0.55, s)) + rl * ss3(0, 0.3, u) * (1 - 0.6 * ss3(0.35, 1, u)));
  });
  const pf = V(0.66, 0.7, 0.17 * side).normalize(), pc = V(-0.45, 0.87, 0.07 * side).normalize(), phOf = (d) => Math.atan2(d.z, d.x), beOf = (d) => Math.asin(d.y);
  /** a sheet's column down the head at al from be0 to past the widest: its root deep in the scalp's shell, rising out of it slowly over most of the way (no ledge where it comes out), lift over it there -> ns head-space points */
  // (one from high on the crown (be0 > 0.8) only just under the shell, out of it within the first half: it crosses the
  // shell where the head is all but flat to it, seen edge-on - no line where the mass takes over from the shell)
  // (dd: how deep its root instead - a sheet that dives out of the shell itself (sheet's o.dive) laid lift over it from the root)
  const rise = (al, be0, lift, ns = 7, dd) => Array.from({ length: ns }, (_, i) => { const s = i / (ns - 1), hi = be0 > 0.8, d0 = dd ?? (hi ? 0.005 : 0.017); return capPt(dirOf(al, be0 + (-0.1 - be0) * s), -d0 + (d0 + lift) * ss3(0, hi ? 0.5 : 0.85, s)); });
  /** a lock's path over the head smoothed (its root left where it is), and kept c clear of the head again -> pts */
  const smooth = (pts, c) => { for (let it = 0; it < 3; it++) { const q = pts.map((p) => p.clone()); for (let i = 2; i < pts.length - 1; i++) pts[i] = q[i - 1].clone().multiplyScalar(0.25).addScaledVector(q[i], 0.5).addScaledVector(q[i + 1], 0.25); } for (let i = 2; i < pts.length; i++) clear(pts[i], c); return pts; };
  // ---- a fringe, swept across the forehead from the parting to the far temple ----
  const fringe = (len, drop = 1, lift = 0) => {
    // (one soft mass of hair, not locks laid side by side: from the front of the parting - its root sunk in the scalp's
    // shell there - across the forehead to the far temple, where it tucks into the hair at the side; its upper edge on
    // the hair above the hairline (no forehead showing between them), its lower one a soft curve dipping across the brow
    // - the deeper the longer it is worn (len, drop) - thinning to its end; lit and coloured at its root as the shell)
    const NC = n(6, 4), C = [], ph0 = side * 0.22, ph1 = -side * (0.98 + 0.4 * len), D = (0.2 + len) * drop;
    for (let j = 0; j < NC; j++) {
      const x = j / (NC - 1), pts = [];
      for (let i = 0; i <= 12; i++) {
        const s = i / 12, ph = ph0 + (ph1 - ph0) * s, bl = Math.asin(Math.max(-0.5, Math.min(0.9, H.line(Math.cos(ph), Math.sin(ph)))));
        const be = bl + 0.09 * (1 - x) - D * x * ss3(0, 0.5, s) * (1 - 0.3 * ss3(0.7, 1, s)) + 0.02 * x * Math.sin(5 * s + j);
        // (lying on the hair and the forehead, not standing off them: a few millimetres over the hair at its top, its lower
        // edge on the skin itself, thinning to it - hair laid across, never a band's or a roll's edge)
        // (lift: a long style's swept fringe stands a few millimetres proud of the hair it crosses - over the lifted mass of
        // a long style it would otherwise sink into it unseen)
        pts.push(capPt(dirOf(ph, be), -0.012 + (0.009 - 0.004 * x + lift * (1 - 0.5 * x)) * ss3(0, 0.16, s)));
      }
      C.push(pts);
    }
    // (lit as the shell it lies on faces, not as a sphere round the head's middle: no band of shade across the brow)
    res.head.push(sheet(C, { t: 0.007, k: n(14, 8), away: (p) => shellAt(p.clone().applyMatrix4(H.toBody)).n.transformDirection(toHead), rootSh: shSH, wt: () => 1, thx: (x) => (0.45 + 0.55 * ss3(0, 0.2, x)) * (1 - 0.8 * ss3(0.55, 1, x)) }));
  };
  // ---- face-framing tendrils: a slender ribbon or two (nk) left out at each temple, down the side of the face close by
  // it - the cheek keeps it out - past the jaw and, worn long, on down in front of the shoulder to the collarbone at most (a
  // second, behind it, to the neck); left out of an updo or a ponytail, to just below the chin (up: never a long noodle
  // down the chest); beside the face, never over the eyes; a wave along each (A): a ribbon, not a string ----
  // (cU: from the head's middle down to its pivot - half the way to the chin: the measure they end by)
  const cU = hcB.y - J.neck.y, chinY = hcB.y - 2 * cU;
  const tendrils = (A, nk = 2, up = false) => {
    // (each a pair of fine wisps a few millimetres apart at the hairline, the second a little shorter: soft strands, never
    // one thick noodle; the first pair to the jaw (worn long, the chin), the second, further back, to the cheekbone's foot
    // (worn long, the jaw) - beside the face, following the cheek in a soft S)
    for (const sg of [-1, 1]) for (let k = 0; k < nk; k++) for (let f = 0; f < 2; f++) {
      const ph = sg * (1.1 + 0.14 * k + 0.045 * f), be0 = Math.asin(Math.min(0.85, H.line(Math.cos(ph), Math.sin(ph)) + 0.06 - 0.02 * f)), c = 0.003 + 0.003 * k + 0.0025 * f;
      const pts = [capPt(dirOf(ph, be0 + 0.07), -0.014), capPt(dirOf(ph, be0 - 0.03), 0.002)];
      let q = pts[1].clone();
      // (curving in on to the cheek down to the jaw - the face keeps it out - then hanging straight on past it)
      for (let y = q.y - 0.018; y > hc.y - 0.1; y -= 0.018) { q = clear(V(q.x + 0.001, y, q.z - Math.sign(q.z - hc.z) * (y > hc.y - 0.06 ? 0.006 : 0)), c); pts.push(q.clone()); }
      smooth(pts, c);
      const bp = pts.map((p) => p.applyMatrix4(H.toBody)), yE = hcB.y - cU * (up ? (k ? 1.05 : 1.5) : k ? 1.5 : 2.05) + f * 0.22 * cU;
      // (cut to its length, or carried on down to it)
      const e = bp.findIndex((p) => p.y < yE);
      if (e >= 0 && e < 3) continue;
      if (e > 0) { const a = bp[e - 1], b = bp[e]; bp.length = e; bp.push(a.clone().lerp(b, (a.y - yE) / Math.max(1e-6, a.y - b.y))); } else if (bp[bp.length - 1].y - yE > 0.02) bp.push(...fall(bp[bp.length - 1], yE, 1, 0.012));
      // (a soft S along it, growing from the temple: forward and back beside the face, side to side below it)
      let d = 0; const ph2 = rnd() * 6.28;
      for (let j = 2; j < bp.length; j++) { d += bp[j].distanceTo(bp[j - 1]); const s = Math.sin(d / 0.09 * 6.28 + ph2) * ss3(0.02, 0.08, d) * A * 1.8, b = ss3(J.neck.y + 0.02, J.neck.y - 0.06, bp[j].y); bp[j].x += s * (1 - b); bp[j].z += s * b; }
      // (fine and round, fullest near the temple, drawn out to a point a fifth as wide over most of its length)
      // (her shadow root in them at half its depth: a wisp all root would read as a dark string against the cheek)
      res.body.push(lockGeo(bp, { round: 1, w: (k ? 0.0085 : 0.0105) * (f ? 0.8 : 1), t: (k ? 0.0046 : 0.0055) * (f ? 0.85 : 1), away: awayB, shade: jv(1.06, 0.06), wt, k: n(11, 7), m: 5, tip: 0.85, blunt: 0.8, root: 0.1, blend: 0.5, tint: tR?.root ? { ...tR, root: tR.root.map((r) => 1 - 0.45 * (1 - r)) } : tR }));
    }
  };
  /** a tail of locks round an axis (body space, from its tie): R(s) its radius a share s along it, nt locks, wt the head's share */
  const tail = (ax, R, nt, wt2) => {
    // (a swing of its own: a soft S sideways down its length, its end curling a little away from the back - never a
    // straight tube)
    { const L0 = [0]; for (let k = 1; k < ax.length; k++) L0.push(L0[k - 1] + ax[k].distanceTo(ax[k - 1])); const Lt0 = L0[L0.length - 1] || 1, sw = side || 1;
      for (let k = 1; k < ax.length; k++) { const s = L0[k] / Lt0; ax[k] = ax[k].clone().add(V(-0.022 * ss3(0.7, 1, s) ** 2, 0.01 * ss3(0.8, 1, s) ** 2, sw * 0.017 * Math.sin(Math.PI * 1.5 * s) * ss3(0.12, 0.45, s))); } }
    const L = [0]; for (let k = 1; k < ax.length; k++) L.push(L[k - 1] + ax[k].distanceTo(ax[k - 1]));
    const near = (p) => { let b = ax[0], bd = 9; for (const a of ax) { const dd = a.distanceToSquared(p); if (dd < bd) { bd = dd; b = a; } } return p.clone().sub(b); };
    const Lt = L[L.length - 1], axAt = (s) => { const d = s * Lt; let k = 1; while (k < ax.length - 1 && L[k] < d) k++; return ax[k - 1].clone().lerp(ax[k], clamp01((d - L[k - 1]) / Math.max(1e-6, L[k] - L[k - 1]))); };
    // (plaited in three (H.braid - a pool's, a sporty day's; seen from a few metres or more, a tail as ever): three strands
    // about the axis, each in turn crossing over the middle from its side - the classic plait's path, across sin t and
    // through sin 2t, a third of a turn apart - a stitch every centimetre and a quarter down each side; fullest a hand below
    // its tie, drawn in toward its end, the last tenth the three together in a short soft tuft. Each strand round and lit
    // more as itself than a lock is, so the stitches show their roundness)
    if (H.braid && (H.dq ?? 1) >= 0.5) {
      // (TIE: where the plait is tied off - an elastic in a deeper shade of the hair - the three drawn together into it,
      // and below it a short soft tuft of finer locks, drawn in to one tapered point: never three prongs)
      const PER = 0.075, TIE = 0.86, SE = TIE + 0.015, nS = Math.max(20, Math.round((Lt * SE / PER) * 9.5)), frame = (s) => { const T = axAt(Math.min(1, s + 0.02)).sub(axAt(Math.max(0, s - 0.02))).normalize(), Bz = V(0, 0, 1).addScaledVector(T, -T.z).normalize(); return [T, Bz, new THREE.Vector3().crossVectors(Bz, T)]; };
      for (let i = 0; i < 3; i++) {
        const ph = (i * 2 * Math.PI) / 3, pts = [], rad = [];
        for (let k = 0; k <= nS; k++) {
          const s = (k / nS) * SE, p = axAt(s), [, Bz, N] = frame(s), r = R(s) * ss3(0, 0.07, s) * (1 - ss3(TIE - 0.06, TIE, s)), t = (2 * Math.PI * s * Lt) / PER + ph;
          const d = Bz.multiplyScalar(Math.sin(t) * 0.56 * r).addScaledVector(N, Math.sin(2 * t) * 0.3 * r);
          pts.push(p.add(d)); rad.push(d.addScaledVector(N, -0.004).normalize());
        }
        res.body.push(lockGeo(pts, { round: 1, w: 0.022, t: 0.015, away: (c, u) => rad[Math.min(nS, Math.round(u * nS))].clone(), shade: jv(0.9, 0.12), wt: wt2, k: nS, m: 6, tip: 0.06, blunt: 0.5, root: 0.05, blend: 0.3, tint: tE }));
      }
      for (let i = 0; i < 4; i++) {
        const th = (i / 4) * Math.PI * 2 + rnd() * 0.4, e = 1 - 0.12 * rnd(), pts = Array.from({ length: 8 }, (_, k) => { const s = TIE - 0.012 + (k / 7) * (e - TIE + 0.012), p = axAt(s), [, Bz, N] = frame(s), r = R(s) * 0.3 * ss3(TIE - 0.01, TIE + 0.05, s) * (1 - 0.75 * ss3(TIE + 0.05, 1, s)); return p.addScaledVector(Bz, Math.sin(th) * r * 1.1).addScaledVector(N, Math.cos(th) * r); });
        res.body.push(lockGeo(pts, { round: 1, w: 0.015, t: 0.01, away: near, shade: jv(0.88, 0.16), wt: wt2, k: 9, m: 5, tip: 0.5, blunt: 0.92, root: 0.12, tint: tE }));
      }
      { const c0 = axAt(TIE), [, Bz, N] = frame(TIE), ring = Array.from({ length: 13 }, (_, j) => { const a = (j / 12) * Math.PI * 2; return c0.clone().addScaledVector(Bz, Math.cos(a) * 0.0094).addScaledVector(N, Math.sin(a) * 0.0068); });
        res.body.push(lockGeo(ring, { round: 1, w: 0.0045, t: 0.004, away: (c) => c.clone().sub(c0), shade: 0.34, flat: 1, wt: wt2, k: 24, m: 5, tip: 0.001, blunt: 0, root: 0.001, blend: 0.2 })); }
      return;
    }
    for (let i = 0; i < nt; i++) {
      // (round its axis: across it, and sideways - the one way that is never along it)
      // (its ends drawn in together toward the axis, each lock ending a little short of its neighbour (e: up to a share of
      // the tail's length, by its place round it) - a tail's soft taper, never a comb's row of teeth cut level)
      // (their ends staggered two to six centimetres and all drawn in to the axis: one soft tapered point, never a fork of
      // parallel prongs)
      const e = 1 - 0.05 - 0.1 * ((((Math.sin((i + 1) * 12.9898) * 43758.5453) % 1) + 1) % 1);
      const th = (i / nt) * Math.PI * 2 + rnd() * 0.3, pts = ax.map((_, k) => { const s = L[k] / Lt, se = s * (1 - (1 - e) * ss3(0.5, 1, s)), p = axAt(se), T = axAt(Math.min(1, se + 0.02)).sub(axAt(Math.max(0, se - 0.02))).normalize(), Bz = V(0, 0, 1).addScaledVector(T, -T.z).normalize(), N = new THREE.Vector3().crossVectors(Bz, T), r = R(se) * (1 - 0.9 * ss3(0.58, 1, s)); return p.addScaledVector(N, Math.cos(th) * r).addScaledVector(Bz, Math.sin(th) * r * 1.1); });
      // (each a full, rounded lock - an oval in section - the tail one soft rope of hair, never a sheaf of flat strips; drawn
      // through more rings than its axis has points, so a high one's arch over the crown stays a curve, never an elbow - six
      // sides each, lit round the tail's own axis, pay for them)
      res.body.push(lockGeo(pts, { round: 1, w: 0.03, t: 0.017, away: near, shade: jv(0.88, 0.16), wt: wt2, k: Math.max(15, ax.length + 6), m: 6, tip: 0.5, blunt: 0.92, tint: tE }));
    }
  };
  /**
   * a mass of hair as one thick sheet (body space) through columns of points side by side (C[j]: from its root, sunk in
   * the hair, to its end), each evenly resampled to k + 1 points: its outer face out from them (away), its inner face a
   * little in - t through, thinning toward its two sides (rounded there) and over its last quarter to its end; lit as the
   * mass it is (its outer normals drawn toward away, the more near its root: no line where it leaves the scalp's shell),
   * each column a shade of its own blended with its neighbours' (the strands), the root as light as the shell it leaves
   */
  const sheet = (C, o) => {
    // (o.dive [depth, length]: its root sunk that far under the hair it comes out of, rising out of it within that length
    // (its shortest column's) - two rings more there - so it crosses that surface steeply along a clean curve, never
    // wandering over and under it in a sawtooth where the two lie nearly level; its thickness grows as slowly as ever)
    let NC = C.length; const E = 3, LJ = C.map((p) => p.reduce((s, q, i) => s + (i ? q.distanceTo(p[i - 1]) : 0), 0)), US = Array.from({ length: o.k + 1 }, (_, k) => k / o.k);
    const DU = o.dive ? Math.min(0.5, o.dive[1] / Math.max(1e-3, Math.min(...LJ))) : 0; if (DU && DU < US[1]) US.splice(1, 0, 0.4 * DU, 0.8 * DU);
    const K = US.length - 1, R = C.map((p) => { const cv = new THREE.CatmullRomCurve3(p, false, 'centripetal'); return US.map((u) => cv.getPointAt(u)); });
    const s0 = C.map(() => jv(0.9, 0.18));
    // (o.diveX [depth, share, side]: a column more just in from its side - that share of the way to the next - and the side
    // itself sunk that far, over the head (its weight there): it comes out of the hair beneath steeply, along a clean line
    // beside the columns, never a ragged one where the two lie nearly level; side -1 its first column's only, 1 its last's,
    // none both - the other lying over its neighbour)
    // (JO: each column's place among those it was given - its share across (x) and its clump as ever)
    const NC0 = NC, JO = Array.from({ length: NC }, (_, j) => j), XS = o.diveX ? o.diveX[2] || 0 : 0, X0 = o.diveX && XS !== 1, X1 = o.diveX && XS !== -1;
    if (o.diveX && NC > 2) { const f = o.diveX[1], ins = (a, b) => R[a].map((p, k) => p.clone().lerp(R[b][k], f)); if (X1) { R.splice(NC - 1, 0, ins(NC - 1, NC - 2)); for (const X of [LJ, s0, JO]) X.splice(NC - 1, 0, X[NC - 1] + (X[NC - 2] - X[NC - 1]) * f); NC++; } if (X0) { R.splice(1, 0, ins(0, 1)); for (const X of [LJ, s0, JO]) X.splice(1, 0, X[0] + (X[1] - X[0]) * f); NC++; } }
    const M = 2 * NC + 2 * E, KC = K + (o.cap ? 1 : 0), nv = (KC + 1) * M, shj = s0.map((v, j) => 0.5 * v + 0.25 * (s0[Math.max(0, j - 1)] + s0[Math.min(NC - 1, j + 1)]));
    // (bolder strands (H.sk over 1): each column's own streak, unblended - lighter ones a touch warmer, as sun-lifted strands
    // are - growing in below the root; a hash of the column, so the draws from rnd stay as ever)
    const SX = Array.from({ length: NC }, (_, j) => { const h = (((Math.sin((Math.round(JO[j]) + 1) * 78.233 + NC0 * 1.7) * 43758.5453) % 1) + 1) % 1, x = (h - 0.5) * 2 * Math.max(0, sk - 1); return [1 + 0.36 * x, 1 + 0.3 * x, 1 + 0.2 * x]; });
    const pos = new Float32Array(nv * 3), col = new Float32Array(nv * 3), si = new Uint16Array(nv * 4), sw = new Float32Array(nv * 4), AW = [], BL = new Float32Array(nv), ix = [];
    let RS = [];
    const set = (q, p, j, u, f, w, a, bl) => {
      const L = u * LJ[j], c0 = shj[j] * (o.shx ? o.shx(JO[j], u) : 1) * (0.92 + 0.08 * ss3(0.6, 1, u)), sh = (u < 0.4 ? c0 + (RS[j] - c0) * ss3(0.4, 0.06, u) : c0) * f;
      const c = tR ? [0, 1, 2].map((ch) => sh * (tR.root ? tR.root[ch] + (1 - tR.root[ch]) * (1 - 0.8 * ss3(2 * (tR.melt ?? 0.07), 0, L)) : 1) * (tR.ends ? 1 + (tR.ends[ch] - 1) * ss3(0.55, 1, u) : 1)) : [sh, sh, sh];
      if (sk > 1) { const g = ss3(0.04, 0.3, u); for (let ch = 0; ch < 3; ch++) c[ch] *= 1 + (SX[j][ch] - 1) * g; }
      pos[q * 3] = p.x; pos[q * 3 + 1] = p.y; pos[q * 3 + 2] = p.z; col[q * 3] = c[0]; col[q * 3 + 1] = c[1]; col[q * 3 + 2] = c[2]; si[q * 4 + 1] = 1; sw[q * 4] = 1 - w; sw[q * 4 + 1] = w; AW[q] = a; BL[q] = bl;
    };
    for (let k = 0; k <= K; k++) {
      const u = US[k], A = [], Bx = [], th = [], W = [], bl = 0.62 + 0.34 * ss3(0.35, 0.04, u);
      for (let j = 0; j < NC; j++) { const p = R[j][k], x = JO[j] / (NC0 - 1); A.push(o.away(p)); Bx.push(R[Math.min(NC - 1, j + 1)][k].clone().sub(R[Math.max(0, j - 1)][k]).normalize()); W.push(o.wt(p)); th.push(o.t * (1 - (o.tipK ?? 0.8) * ss3(o.tipS ?? 0.72, 1, u)) * (o.rootT ? 0.15 + 0.85 * ss3(0, o.rootT, u) : 1) * (o.thx ? o.thx(x, u) : 0.45 + 0.55 * ss3(0, 0.2, x) * ss3(1, 0.8, x))); }
      RS = u < 0.4 ? R.map((c) => o.rootSh(c[k])) : RS;
      const dv = DU ? -o.dive[0] * (1 - ss3(0, DU, u)) : 0, Pk = R.map((c, j) => c[k].clone().addScaledVector(A[j], dv - ((j === 0 && X0) || (j === NC - 1 && X1) ? o.diveX[0] * W[j] : 0)));
      let q = k * M;
      for (let j = 0; j < NC; j++) set(q++, Pk[j].clone().addScaledVector(A[j], 0.7 * th[j]), j, u, 1, W[j], A[j], bl);
      for (let e = 1, j = NC - 1; e <= E; e++) { const f = Math.PI * e / (E + 1); set(q++, Pk[j].clone().addScaledVector(A[j], (0.2 + 0.5 * Math.cos(f)) * th[j]).addScaledVector(Bx[j], 0.6 * Math.sin(f) * th[j]), j, u, 0.92, W[j], A[j], 0.3 + 0.6 * ss3(0.35, 0.04, u)); }
      // (its inner face in shade - o.inSh(u): deeper where it hangs over the neck, the hollow under a bob)
      for (let j = NC - 1; j >= 0; j--) set(q++, Pk[j].clone().addScaledVector(A[j], -0.3 * th[j]), j, u, o.inSh ? o.inSh(u) : 0.72, W[j], A[j], 0);
      for (let e = 1, j = 0; e <= E; e++) { const f = Math.PI * (1 - e / (E + 1)); set(q++, Pk[j].clone().addScaledVector(A[j], (0.2 + 0.5 * Math.cos(f)) * th[j]).addScaledVector(Bx[j], -0.6 * Math.sin(f) * th[j]), j, u, 0.92, W[j], A[j], 0.3 + 0.6 * ss3(0.35, 0.04, u)); }
      // (o.cap: its end closed - its outer face turned round to the inner one a little past the last ring, the column's
      // own way on, in the underside's shade: a cut end's thickness, never an open tube to see through from below)
      if (o.cap && k === K) {
        const mid = (j) => R[j][K].clone().addScaledVector(A[j], 0.2 * th[j]).addScaledVector(R[j][K].clone().sub(R[j][K - 1]).normalize(), 0.45 * th[j]), sIn = o.inSh ? o.inSh(1) : 0.72;
        for (let j = 0; j < NC; j++) set(q++, mid(j), j, 1, 0.5 * (0.92 + sIn), W[j], A[j], 0);
        for (let e = 1; e <= E; e++) set(q++, mid(NC - 1), NC - 1, 1, 0.5 * (0.92 + sIn), W[NC - 1], A[NC - 1], 0);
        for (let j = NC - 1; j >= 0; j--) set(q++, mid(j), j, 1, sIn, W[j], A[j], 0);
        for (let e = 1; e <= E; e++) set(q++, mid(0), 0, 1, 0.5 * (0.92 + sIn), W[0], A[0], 0);
      }
    }
    for (let k = 0; k < KC; k++) for (let j = 0; j < M; j++) { const j1 = (j + 1) % M, a = k * M + j, b = k * M + j1, c = (k + 1) * M + j1, d = (k + 1) * M + j; ix.push(a, b, c, a, c, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
    g.setIndex(ix); g.computeVertexNormals();
    // (its faces wound to look out: checked on its outer face's middle)
    const Nm = g.attributes.normal, qm = (K >> 1) * M + (NC >> 1);
    if (Nm.getX(qm) * AW[qm].x + Nm.getY(qm) * AW[qm].y + Nm.getZ(qm) * AW[qm].z < 0) { for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.setIndex(ix); g.computeVertexNormals(); }
    for (let q = 0; q < nv; q++) { const a = AW[q], b = BL[q]; if (!b) continue; const x = Nm.getX(q) * (1 - b) + a.x * b, y = Nm.getY(q) * (1 - b) + a.y * b, z = Nm.getZ(q) * (1 - b) + a.z * b, l = Math.hypot(x, y, z) || 1; Nm.setXYZ(q, x / l, y / l, z / l); }
    return g;
  };
  const LEN = { long: 0.27, waves: 0.24, curlyLong: 0.2, blowout: 0.25 }[hs];
  if (LEN) {
    // ---- worn long, in layers: an under layer, wide and darker; over it the main fall; over that, from the parting, a
    // shorter top layer lifted off the scalp at its roots and falling over the rest - the volume at the crown, its ends a
    // tier above the others' (a blowout the fullest: its roots the highest, its waves broad and all swept the same way,
    // its ends turned out) ----
    // (fl: how far it flares out from the head below its widest - a blowout's the fullest; worn straight it falls close
    // beside the face, never out like a hood's sides)
    const curly = hs === 'curlyLong', blow = hs === 'blowout', wav = hs === 'waves' || blow, cu = curly ? 0.012 : 0, fl = blow ? 0.12 : curly ? 0.03 : 0.016;
    // (a wave's length; how finely a lock is divided along it - six or seven rings to a wave, a straight one's every few
    // centimetres - and a path's own length)
    // (WV: the locks' waves - their size, their length, curls each their own way; the mass beneath a curly head's only
    // waved, its curls in the locks over it (WS))
    const lamW = curly ? 0.085 : blow ? 0.18 : 0.13, WV = { A: curly ? 0.012 : blow ? 0.017 : wav ? 0.011 : 0, lam: lamW, curl: curly }, WS = curly ? { A: 0.009, lam: 0.13, curl: false } : WV;
    const SP = (w) => (!w.A ? 0.032 : w.lam / 6), lenOf = (P) => P.reduce((s, p, i) => s + (i ? p.distanceTo(P[i - 1]) : 0), 0);
    /**
     * a path from the hair at (ph0, be0) over the head to (al, past the widest) - its root sunk in the scalp's shell from
     * s0 of the way, coming up out of it - then hanging beside the face and over the ears, flaring a little (a blowout
     * the more), and on down on to the body to ye, in front of the shoulder (dir 1) or behind (-1), c clear of it; waved
     * as wv has it (wph: where its waves start) -> body-space points
     */
    const hang = (ph0, be0, al, ye, dir, lift, c, ns, s0, wph, wv = WV, dd) => {
      const hp = s0 < 0 ? rise(al, be0, lift, ns, dd) : over(ph0, be0, al, -0.1, lift, ns, 1.6, s0); let q = hp[hp.length - 1].clone();
      for (let y = q.y - 0.028; y > hc.y - 0.1; y -= 0.028) { q = clear(V(q.x + (q.x - hc.x) * fl, y, q.z + (q.z - hc.z) * (fl + 0.006)), c); hp.push(q.clone()); }
      // (smoothed - but over the head left at the depth it was laid at: its root sunk, never pushed out sideways off the
      // scalp to stand clear of it)
      for (let it = 0; it < 3; it++) { const Q0 = hp.map((p) => p.clone()); for (let i = 2; i < hp.length - 1; i++) hp[i] = Q0[i - 1].clone().multiplyScalar(0.25).addScaledVector(Q0[i], 0.5).addScaledVector(Q0[i + 1], 0.25); }
      for (let i = ns - 1; i < hp.length; i++) clear(hp[i], c);
      const bp = hp.map((p) => p.applyMatrix4(H.toBody)), nh = bp.length; bp.push(...fall(bp[nh - 1], ye, dir, c + 0.008));
      // (its fall eased a few times - smoothed, then kept clear of the body again: draped over the shoulder, never jogging
      // round it in a sharp elbow)
      for (let it = 0; it < 4; it++) { const Q0 = bp.map((p) => p.clone()); for (let k = nh; k < bp.length - 1; k++) bp[k] = Q0[k - 1].clone().multiplyScalar(0.25).addScaledVector(Q0[k], 0.5).addScaledVector(Q0[k + 1], 0.25); for (let k = nh; k < bp.length; k++) { const p = bp[k]; for (let j = 0; j < 12 && H.C.inside(p.x, p.y, p.z, c + 0.008); j++) p.x += dir * 0.004; } }
      // (waved or curled: its fall twice as finely divided first - each wave drawn through a good few points, a smooth S,
      // never a zigzag of straight pieces)
      if (wv.A) for (let k = bp.length - 1; k >= nh; k--) bp.splice(k, 0, bp[k - 1].clone().lerp(bp[k], 0.5));
      // (waves and curls: swinging to and fro across the fall and out from it, more toward the ends - curls each lock its
      // own way; waves all in step by height, the mass waving as one - a blowout's the broadest, its ends flicked out)
      // (a blowout's waves the broader the further down - big brushed barrel curls in its lower third, never a straight
      // sheet with a ripple)
      let LF = 0; if (blow) for (let k = nh; k < bp.length; k++) LF += bp[k].distanceTo(bp[k - 1]);
      if (wv.A) { const A = wv.A, lam2 = wv.lam, cr = wv.curl; let d = 0; for (let k = nh; k < bp.length; k++) { d += bp[k].distanceTo(bp[k - 1]); const a = awayB(bp[k]), tg = V(-a.z, 0, a.x).normalize(), m = Math.min(1, d / 0.08) * A * (blow ? 0.7 + 1.2 * ss3(0.35, 1, d / Math.max(0.05, LF)) : 1), w0 = (cr ? d : hcB.y - bp[k].y) / lam2 * 6.28 + wph; bp[k].addScaledVector(tg, Math.sin(w0) * m * (cr ? 1 : 0.6)).addScaledVector(a, (0.5 + 0.5 * Math.cos(w0)) * m * (cr ? 0.8 : 0.7)); } }
      // (its ends turned: out and up off the shoulders, every other lock the other way round - a brushed curl, not a cut)
      if (blow) { const sw = Math.sin(wph * 3.1) < 0 ? -1 : 1, fk = dir > 0 ? 0.5 : 1; for (let m = bp.length, k = Math.max(nh, m - 5); k < m; k++) { const u = (k - m + 6) / 5, a = awayB(bp[k]), tg = V(-a.z, 0, a.x).normalize(); bp[k].addScaledVector(a, 0.024 * fk * u * u).addScaledVector(tg, sw * 0.012 * u * u * u); bp[k].y += 0.016 * fk * u * u; } }
      return bp;
    };
    // ---- the mass of it: one soft curtain from high on the crown round the back and over the ears to its soft U of a
    // length, and one each side from the temple, falling in front of the shoulder - no parting or gap down the back, no
    // locks' edges standing out of it as plates; worn straight or waved it is the curtain alone at the back and the sides,
    // its strands' clumps in its swell and shade, drawn to soft points at its ends (curls: their locks over it) ----
    const front0 = curly ? 1.15 : 1.32, wv0 = rnd() * 1.4, BA = curly ? 1.42 : 1.25;
    // (worn straight or waved, each laid a share of its thickness (tt) over the scalp's shell from its very root - the side
    // ones the more, over the curtain's edge - its root and the sides that come out of the shell dived under it (sheet's
    // dive, diveX): each crosses it steeply along a clean curve high on the crown, never shallowly in a sawtooth across the
    // back of the head or a torn edge down its side; the side ones from as high as the curtain, a little over its edge)
    const OV = curly ? 0 : 0.08;
    for (const S of [{ a0: BA, a1: 2 * Math.PI - BA, nc: n(curly ? 11 : 19, curly ? 7 : 9), dir: -1, len: 1, be: curly ? 0.2 : 1.3 }, { a0: 1.04, a1: front0 + OV, nc: n(4, 3), dir: 1, len: 0.62, be: curly ? 0.3 : 1.15 }, { a0: -front0 - OV, a1: -1.04, nc: n(4, 3), dir: 1, len: 0.62, be: curly ? 0.3 : 1.15 }]) {
      const C = [], CL = S.dir < 0 && !curly, tt = (CL ? 0.018 : 0.012) + 0.6 * cu, lf = curly ? 0 : (CL ? 0.08 : 0.25) * tt;
      for (let j = 0; j < S.nc; j++) {
        // (its length a soft U down the back - each column a touch longer or shorter than the next, never a straight cut -
        // and in front of the shoulder drawn to a soft point, its sides shorter)
        // (the length's variation slow across the columns - soft scallops, never every column its own: a comb's teeth; the
        // curtain's every third column its clump's middle, a little longer - the clump's soft point)
        const al = S.a0 + (S.a1 - S.a0) * j / (S.nc - 1), af = Math.abs(Math.atan2(Math.sin(al), Math.cos(al))), x = 2 * j / (S.nc - 1) - 1, lj = S.dir > 0 ? 1 - 0.22 * x * x : 1 + (blow ? 0.3 : 0.6) * ((CL ? 0.035 * Math.cos(2 * Math.PI * j / 3) : 0) + 0.03 * Math.sin(0.9 * j + wv0 * 4));   // (a blowout's hem one smooth curve: its curled ends make its edge)
        // (a little short of the locks over it, its end thinning away among theirs: the hair's ends their soft points, never
        // the mass's straight cut)
        C.push(hang(al, S.be, al, ysh - 0.86 * LEN * S.len * lj * (0.84 + 0.16 * ss3(1.4, 2.9, af)) - 0.01, S.dir, lf, 0.006 + cu, 7, -1, wv0 + 0.12 * j, WS, curly ? undefined : -lf));
      }
      // (the curtain: thin where it comes out of the shell, its clumps - three columns each - swelling and a shade lighter
      // at their middles down its length)
      const clump = (j) => Math.cos(2 * Math.PI * j / 3);
      res.body.push(sheet(C, { t: tt, k: n(Math.max(24, Math.ceil(Math.max(...C.map(lenOf)) / SP(WS))), 10), away: awayS, rootSh: shS, wt, tipS: 0.62, tipK: 0.94, ...(curly ? {} : { dive: [lf + 0.225 * tt, 0.65 * tt], diveX: [lf + 0.2 * tt, 0.25, S.dir < 0 ? 0 : S.a0 > 0 ? -1 : 1], rootT: 0.25 }), ...(CL ? { rootT: 0.25, shx: (j, u) => 1 + (blow ? 0.19 : 0.12) * ss3(0.1, 0.5, u) * clump(j), thx: (x, u) => (0.45 + 0.55 * ss3(0, 0.12, x) * ss3(1, 0.88, x)) * (1 + (blow ? 0.9 : 0.5) * ss3(0.12, 0.55, u) * clump(Math.round(x * (S.nc - 1)))) } : {}) }));   // (a blowout's brushed sections the bolder)
    }
    // ---- over it, from the parting: the main fall, and a shorter top layer - from the front of the parting back to the
    // crown only (top: how far back) - its ends a tier above the others'; each lock a soft, full mass, an oval in section a
    // little under half as thick as it is wide, coming up out of the scalp's shell down the side of the head (never lying
    // thin over the crown), tapering to its ends ----
    const LAY = [
      // (curls: each lock nearly round - a fat spiral curl, never a twisted ribbon - on six sides, its normals the mass's:
      // the budget's for the curls along it)
      // (a blowout's rounder - brushed through, full - never a flat ribbon)
      { nl: n(curly ? 4 : 5, 3), lam0: 0.5, lift: 0.008, w: curly ? 0.056 : blow ? 0.05 : 0.06, t: curly ? 0.034 : blow ? 0.033 : 0.027, shade: 1, s0: 0.58, len: 1, k: 17, m: curly ? 6 : 7 },
    ];
    LAY.forEach((Ly, li) => {
      for (let i = 0; i < Ly.nl; i++) for (const sg of [-1, 1]) {
        const lam = (i + Ly.lam0) / Ly.nl * (Ly.top || 1), far = sg !== side;
        if (far && lam < 0.16 && H.fringe) continue;
        // (worn straight or waved, only those framing the face - in front of the shoulders - over the curtain: the rest is
        // the curtain's, never plates with their edges standing out of it over the crown and down the back)
        if (!curly && 0.98 + 2.26 * lam ** 0.85 > front0 + 0.05) continue;
        // (the last each side reaching the middle of the back - the two sides meeting there, no parting down it)
        const r = pf.clone().lerp(pc, lam).normalize().add(V(0, 0, sg * 0.04)).normalize(), al = sg * Math.min(Math.PI - 0.03, 0.98 + 2.26 * lam ** 0.85 + (rnd() - 0.5) * 0.14);
        // (those by the forehead start late, beyond it at the temple - they frame the face, never crossing it or standing
        // up off the top of the forehead)
        const s0 = lam < 0.3 ? Math.max(far ? 0.72 : 0.68, Ly.s0) : Ly.s0, front = Math.abs(al) < front0, cl = Ly.lift + Ly.t / 2 + cu;
        // (its length by where it falls - longest down the middle of the back, a little shorter toward the sides: a cut's
        // soft U, each lock a little longer or shorter than its neighbours, not a ragged comb)
        const ye = ysh - LEN * Ly.len * (front ? 0.62 : 1) * (0.84 + 0.16 * ss3(1.4, 2.9, Math.abs(al))) * (0.95 + 0.1 * rnd());
        const bp = hang(phOf(r), beOf(r), al, ye, front ? 1 : -1, Ly.lift + (curly ? 0.006 : 0), cl + 0.004 * li, Ly.top ? 8 : 7, s0, curly ? rnd() * 6.28 : blow ? li * 0.5 : wv0 + rnd() * 0.5);
        // (every other lock lying over its neighbours, not through them: the overlap reads as one lock over the next)
        const nO = Ly.top ? 8 : 7;
        if (i % 2) for (let k = nO; k < bp.length; k++) bp[k].addScaledVector(awayB(bp[k]), 0.45 * Ly.t * ss3(nO - 1, nO + 2, k));
        // (its root as light as the hair it comes out of: no darker patch where it crosses the mass beneath; lying close down
        // the side of the head - half as full there, pressed to it, no lump at the temple - full only where it leaves it)
        const uO = lenOf(bp.slice(0, nO)) / lenOf(bp);
        res.body.push(lockGeo(bp, { round: 1, w: Ly.w * (0.85 + 0.3 * rnd()), t: Ly.t, tk: (u) => 0.5 + 0.5 * ss3(0.6 * uO, uO + 0.1, u), away: awayS, rootSh: shS, blendRoot: 0.96, shade: Ly.shade * jv(0.94, 0.12), dark: 0.06, tint: tR, wt, k: Math.max(curly ? Ly.k + 2 : Ly.k, Math.ceil(lenOf(bp) / SP(WV) * (curly ? 0.85 : 1)), WV.A ? 0 : bp.length + 4), m: Ly.m, tip: Ly.top ? 0.5 : curly ? 0.3 : 0.36, blunt: 0.92, root: 0.3, blend: Ly.top ? 0.78 : 0.7 }));
      }
    });
    // (worn long: a curtain of a fringe swept from the parting, its lower edge down to the brow, standing proud of the mass)
    if (H.fringe) fringe(0.15, 1, blow ? 0.009 : 0.006);
    // (two each side, unless she wants fewer - H.tendrils)
    { const nk = H.tendrils ?? 2; if (nk) tendrils(curly ? 0.007 : wav ? 0.005 : 0.003, nk); }
  } else if (hs === 'bob' || hs === 'pixie') {
    // ---- a bob: to the jaw, its ends turned under; a pixie: short, swept forward and to one side ----
    const bob = hs === 'bob', NL = n(bob ? 5 : 6, bob ? 3 : 4);
    /**
     * a bob's line: from the hair at (ph0, be0) over the head (from s0 of the way, its root sunk in the scalp's shell -
     * left at the depth it was laid at, never pushed out sideways off it) to (al, past the widest), on down to the jaw,
     * flaring a little, c clear; its end turned under -> head-space points
     */
    // (s0 < 0: from near the crown, its root only just under the scalp's shell, coming out of it at once - thin there,
    // thickening as it goes (the sheet's rootT) - no ledge where the mass leaves the crown)
    const riseB = (al, be0, lift) => Array.from({ length: 8 }, (_, i) => { const s = i / 7; return capPt(dirOf(al, be0 + (-0.1 - be0) * s), -0.005 + (0.005 + lift) * ss3(0, 0.55, s)); });
    const bobPath = (ph0, be0, al, lift, s0, c) => {
      const hp = s0 < 0 ? riseB(al, be0, lift) : over(ph0, be0, al, -0.1, lift, 7, 1.6, s0), nH = hp.length; let q = hp[nH - 1].clone(); const yEnd = hc.y - 0.078 - 0.008 * Math.abs(Math.cos(al));
      for (let y = q.y - 0.028; y > yEnd; y -= 0.028) { q = clear(V(q.x + (q.x - hc.x) * 0.03, y, q.z + (q.z - hc.z) * 0.04), c); hp.push(q.clone()); }
      for (let it = 0; it < 3; it++) { const Q0 = hp.map((p) => p.clone()); for (let i = 2; i < hp.length - 1; i++) hp[i] = Q0[i - 1].clone().multiplyScalar(0.25).addScaledVector(Q0[i], 0.5).addScaledVector(Q0[i + 1], 0.25); }
      for (let i = nH - 1; i < hp.length; i++) clear(hp[i], c);
      const e = hp[hp.length - 1], inw = V(hc.x - e.x, 0, hc.z - e.z).normalize(); hp.push(e.clone().add(V(0, -0.016, 0)).addScaledVector(inw, 0.006), e.clone().add(V(0, -0.02, 0)).addScaledVector(inw, 0.016));
      return hp;
    };
    if (bob) {
      // (the mass of it: one sheet from beside the face at one temple round the back to the other - no gap at the nape,
      // no seam down the back - coming out of the scalp's shell from near the crown, lit as the shell is where it leaves
      // it (its normals the shell's), its ends turned under at the jaw; its strands' groups a soft swell and a shade each)
      const NB = n(21, 9), C = [], awaySH = (p) => shellAt(p.clone().applyMatrix4(H.toBody)).n.transformDirection(toHead);
      for (let j = 0; j < NB; j++) { const al = 1.02 + (2 * Math.PI - 2.04) * j / (NB - 1), fr = ss3(0.5, 0, Math.min(al - 1.02, 2 * Math.PI - 1.02 - al)); C.push(bobPath(al, 1.08 - 0.5 * fr, al, 0.004 + 0.0025 * Math.sin(1.7 * j + side) + 0.005 * fr, -1, 0.006)); }
      res.head.push(sheet(C, { t: 0.016, k: n(18, 8), away: awaySH, rootSh: shSH, wt: () => 1, tipS: 0.82, tipK: 0.45, rootT: 0.3, cap: true, inSh: (u) => 0.72 - 0.26 * ss3(0.35, 1, u) }));
    }
    for (let li = bob ? 1 : 0; li < 2; li++) for (let i = 0; i < NL; i++) for (const sg of [-1, 1]) {
      const lam = (i + (li ? 0.5 : 0.1)) / NL, far = sg !== side;
      if (far && lam < (bob ? 0.07 : 0.18) && H.fringe) continue;
      // (a bob the smooth mass alone, its strands in its shading - no locks over it to stand out as scales or petals)
      if (bob) continue;
      const r = pf.clone().lerp(pc, lam).normalize().add(V(0, 0, sg * 0.04)).normalize(), lift = li ? 0.008 : 0.003;
      if (bob) {
        // (over it, a few full, soft locks from the parting - an oval in section a little over a third as thick as it is
        // wide - coming out of the shell down the side of the head (those by the forehead at the temple), lit and coloured
        // at their roots as it is: one mass, its ends turned under together)
        const al = sg * (1.0 + 2.0 * lam ** 0.85 + (rnd() - 0.5) * 0.1), hp = bobPath(phOf(r), beOf(r), al, lift, lam < 0.3 ? 0.68 : 0.55, lift + 0.009);
        res.head.push(lockGeo(hp, { round: 1, w: 0.05, t: 0.018, away: awayH, rootSh: shSH, blendRoot: 0.96, shade: jv(0.94, 0.12), dark: 0.06, k: 14, m: 8, tip: 0.12, root: 0.3, blend: 0.62, tint: tR }));
      } else {
        const al = sg * (0.5 + 1.7 * lam + (rnd() - 0.5) * 0.2), hp = over(phOf(r) - 0.25 * lam * sg, beOf(r), al - side * 0.25, 0.4 - 0.22 * lam, lift + 0.002, 6, 1.2, 0.15);
        res.head.push(lockGeo(hp, { round: 1, w: 0.044, t: 0.009, away: awayH, shade: (li ? 1 : 0.82) * jv(0.94, 0.12), k: 9, m: 7, tip: 0.45, blunt: 0.7, blend: 0.6, tint: tR }));
      }
    }
    if (H.fringe) fringe(bob ? 0 : 0.12, bob ? 1 : 0.35);
  } else if (hs === 'ponytail' || hs === 'bun' || SLEEK.has(hs)) {
    // ---- pulled back to a tie (a ponytail's, or a bun's) from all round the hairline, tight to the head; pulled up sleek
    // (a high ponytail, a topknot) - all of them the scalp's shell alone, combed smooth to its tie, its grooves in it (see
    // the head): no locks laid over it to stand off it as plates beside the tie ----
    if (hs === 'ponytail' && H.tie) {
      // (the tail: from its tie out behind the head and down the back, round and full, its locks about its middle - fullest
      // a hand below the tie, then drawn to its ends; the head's at the tie, the body's at its end)
      const tB = H.tie.p.clone().applyMatrix4(H.toBody), dB = H.tie.d.clone().transformDirection(H.toBody), ye = ysh - 0.15, s1 = tB.clone().addScaledVector(dB, 0.05);
      tail([tB.clone().addScaledVector(dB, -0.012), s1, ...fall(s1, ye, -1, 0.032)], (s) => 0.007 + 0.021 * ss3(0, 0.22, s) * (1 - 0.55 * ss3(0.55, 1, s)), n(8, 5), (p) => 1 - 0.7 * ss3(tB.y, ye, p.y));
    }
    if (hs === 'highpony') {
      // (a high one's: up and back out of its cuff, arching over behind the crown and down - resting against the back of
      // the head, clear of it - then on down the back to between the shoulder blades; fullest just past the arch)
      const d0 = H.tie.d, P = [H.tie.p.clone().addScaledVector(d0, -0.012), H.tie.p.clone().addScaledVector(d0, 0.032)], dn = V(-0.1, -1, 0).normalize(), dir = d0.clone();
      let p = P[1].clone();
      for (let i = 0; i < 5; i++) { dir.lerp(dn, 0.42).normalize(); p = clear(p.clone().addScaledVector(dir, 0.024), 0.03); P.push(p); }
      for (let y = p.y - 0.028; y > hc.y - 0.1; y -= 0.028) { p = clear(V(p.x + (y > hc.y - 0.03 ? 0.006 : 0), y, p.z), 0.03); P.push(p.clone()); }
      const ax = P.map((q) => q.applyMatrix4(H.toBody)), ye = ysh - 0.17; ax.push(...fall(ax[ax.length - 1], ye, -1, 0.032));
      tail(ax, (s) => 0.008 + 0.019 * ss3(0.03, 0.2, s) * (1 - 0.5 * ss3(0.5, 1, s)), n(9, 5), (q) => 1 - 0.75 * ss3(hcB.y - 0.05, ye, q.y));
    }
    // (a ponytail's face framed by tendrils left out at the temples; a bun's and a topknot's clean - or as she wants them,
    // H.tendrils: none, one or two each side)
    { const nk = H.tendrils ?? (hs === 'ponytail' || hs === 'highpony' ? 1 : 0); if (nk) tendrils(0.004, nk, true); }
  } else if (CURLBUN.has(hs)) {
    // ---- a curly updo (after the user's photos): dark spiral curls swept up from the whole hairline into a big, loose bun
    // high on the crown, ringlets left hanging - framing the face from the temples, before and behind the ears, at the
    // nape; or fair waves twisted up into a messy one, a long loose curl down from each temple. Never slicked: a soft rise
    // at the front, the texture of the curls in what is swept up. (H.dq: the head's detail; H.lum: the hair's lightness;
    // H.cap: under a cap, a smaller bun low at the back) ----
    const curly = hs === 'curlybun', td = H.tie.dir, dq = H.dq ?? 1, lite = Q < 1, cap = !!H.cap, fq = (k) => Math.max(1, Math.round(k * (0.55 + 0.45 * dq)));
    // (how tight its curls: spirals, or loose S-waves - the darker the hair the tighter, the fairer the looser)
    // (a messy one's looser still: waves twisted, its loose curls an open S, never a spring)
    const kink = clamp01((curly ? 0.88 : 0.32) + 0.14 * (0.5 - clamp01((H.lum ?? 0.05) / 0.45))), mix = (a, b) => a + (b - a) * kink;
    // (the hair swept up from the hairline to the bun is the scalp's shell alone - lifted softly at the front, its ridges
    // running up to the bun and the curls' texture in them: see the head - no locks over it to show their edges)
    // ---- the bun: big and round but loose - a fuller core, locks coiled round it, small curls all over it (a curly one's),
    // a twist up over its top (a messy one's), loops and ends breaking its outline ----
    const rb = cap ? 0.036 : curly ? 0.058 : 0.054, bc = H.tie.p.clone().addScaledVector(td, rb * 0.4), e2 = V(0, 0, 1), e1 = new THREE.Vector3().crossVectors(td, e2);
    /** a point of the bun: unit direction d (head space), r out from its middle - a little squashed along its axis */
    const bunAt = (d, r) => bc.clone().addScaledVector(d, r).addScaledVector(td, -0.14 * r * d.dot(td)), outB = (p) => p.clone().sub(bc);
    const dirB = (y, az) => { const rr = Math.sqrt(Math.max(0, 1 - y * y)); return e1.clone().multiplyScalar(rr * Math.cos(az)).addScaledVector(td, y).addScaledVector(e2, rr * Math.sin(az)).normalize(); };
    // (its core lumpy with the curls it is made of - a curly one's a cloud of them - and the most of its volume: what lies
    // over it half sunk in it, never loose loops round a small ball)
    const core = new THREE.SphereGeometry(1, lite ? 8 : Math.round(10 + 4 * dq), lite ? 6 : Math.round(7 + 3 * dq)), cp = core.attributes.position;
    for (let i = 0; i < cp.count; i++) { const x = cp.getX(i), y = cp.getY(i), z = cp.getZ(i), p = bunAt(e1.clone().multiplyScalar(x).addScaledVector(td, y).addScaledVector(e2, z), rb * 0.9 * (1 + (curly ? 0.11 : 0.07) * Math.sin(x * 6 + 1) * Math.sin(y * 5 + 2) * Math.sin(z * 7 + 0.5) + (curly && !lite ? 0.07 * Math.sin(x * 13) * Math.sin(y * 11 + 1) * Math.sin(z * 12 + 2) : 0))); cp.setXYZ(i, p.x, p.y, p.z); }
    core.deleteAttribute('uv'); core.computeVertexNormals(); res.head.push(tint(core, 0.84));
    // (coiled round it: the first round its own axis, spiralling up it - a messy one's two, twisted up over its top - the
    // rest any way over it; a curly one's undulating with the curls in it - a few, full and short, the bun's twists: never
    // a pile of thin pipes looped round it)
    for (let i = 0, NC = lite ? 3 : fq(curly ? 3 : 4); i < NC; i++) {
      const wrap = i < (curly ? 1 : 2), ax = wrap ? td.clone().addScaledVector(e1, (rnd() - 0.5) * 0.5).addScaledVector(e2, (rnd() - 0.5) * 0.5).normalize() : e1.clone().multiplyScalar(rnd() - 0.5).addScaledVector(td, (rnd() - 0.5) * 0.7).addScaledVector(e2, rnd() - 0.5).normalize();
      const q1 = new THREE.Vector3().crossVectors(ax, Math.abs(ax.dot(e2)) > 0.9 ? td : e2).normalize(), q2 = new THREE.Vector3().crossVectors(ax, q1), a0 = rnd() * 6.28, span = (wrap ? 3.6 : 2.4) + rnd() * 1.0;
      const lat0 = wrap ? 0.1 + 0.35 * i : (rnd() - 0.5) * 0.3, lat1 = wrap ? 0.45 + 0.3 * i : (rnd() - 0.5) * 0.5, NP = lite ? 9 : 17, pts = [];
      for (let k = 0; k < NP; k++) {
        const s = k / (NP - 1), a = a0 + span * s, d = q1.clone().multiplyScalar(Math.cos(a)).addScaledVector(q2, Math.sin(a)).addScaledVector(ax, lat0 + (lat1 - lat0) * s).normalize();
        // (its swell along it slow - two or three soft waves round the bun, drawn through enough rings to stay round: never
        // a pipe bent at elbows)
        pts.push(bunAt(d, rb * (0.74 + 0.25 * Math.sin(Math.PI * s) ** 0.5) * (1 + (curly ? 0.06 : 0.035) * Math.sin((curly ? 2.5 : 1.5) * Math.PI * 2 * s + i))));
      }
      // (each a full, rounded lock - nearly round in section - never a flat ribbon seen edge-on)
      res.head.push(lockGeo(pts, { round: 1, w: curly ? 0.026 : 0.028, t: curly ? 0.021 : 0.02, away: outB, shade: 0.95 + 0.12 * rnd(), k: lite ? 8 : Math.round(13 + 5 * dq), m: lite ? 5 : curly ? 6 : 7, tip: 0.3, blunt: 0.6, root: 0.1, blend: 0.4 }));
    }
    // (small curls all over it, close over its surface, a little tilted out of it - from its top down its sides, a golden
    // angle apart: a cloud of curls)
    /** a small curl: a loop and a little more, spiralling in, round c0 - tilted tl up out of the surface there (nm) */
    const curl = (c0, nm, rc, tl, w, t) => {
      const t1 = new THREE.Vector3().crossVectors(nm, Math.abs(nm.dot(e2)) > 0.9 ? td : e2).normalize(), b = new THREE.Vector3().crossVectors(nm, t1).multiplyScalar(Math.cos(tl)).addScaledVector(nm, Math.sin(tl)), a0 = rnd() * 6.28, pts = [];
      // (a round strand, drawn through rings close enough round its loop to keep it a curl - not an octagon of flat faces)
      for (let k = 0; k <= 12; k++) { const s = k / 12, a = a0 + s * 2.2 * Math.PI, r = rc * (1 - 0.35 * s); pts.push(c0.clone().addScaledVector(t1, Math.cos(a) * r).addScaledVector(b, Math.sin(a) * r)); }
      res.head.push(lockGeo(pts, { round: 1, w, t, away: (p) => p.clone().sub(c0).normalize().add(nm), shade: 0.98 + 0.08 * rnd(), k: 14, m: 6, tip: 0.3, blunt: 0.5, root: 0.08, blend: 0.4 }));
    };
    // (a curly one's many - its texture; a messy one's a few among its twists - each half sunk in it, lying close along
    // its surface: curls the bun is made of, never rings standing up off it)
    for (let j = 0, NO = lite ? 0 : cap ? fq(curly ? 5 : 3) : fq(curly ? 11 : 4); j < NO; j++) { const nm = dirB(1 - 1.3 * (j + 0.5) / NO, j * 2.4 + rnd() * 0.6), rc = (curly ? 0.015 : 0.017) + 0.007 * rnd(); curl(bunAt(nm, rb * (curly ? 0.86 : 0.9)), nm, rc, 0.12 + rnd() * 0.3, curly ? 0.013 : 0.014, 0.011); }
    // (loose loops out past its outline and back in; a messy one's loose ends too, falling a little)
    for (let j = 0, NL = lite || cap ? 0 : curly ? 1 : 2; j < NL; j++) {
      const dm = dirB(0.15 + 0.7 * rnd(), rnd() * 6.28), ax = new THREE.Vector3().crossVectors(dm, V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5)).normalize(), ox = new THREE.Vector3().crossVectors(ax, dm), sp = 0.4 + 0.25 * rnd(), ro = 1.06 + 0.1 * rnd(), pts = [];
      for (let k = 0; k <= 8; k++) { const s = k / 8, an = (s - 0.5) * 2 * sp; pts.push(bunAt(dm.clone().multiplyScalar(Math.cos(an)).addScaledVector(ox, Math.sin(an)), rb * (0.72 + (ro - 0.72) * Math.sin(Math.PI * s) ** 0.7) * (1 + (curly ? 0.05 * Math.sin(s * 19) : 0)))); }
      res.head.push(lockGeo(pts, { round: 1, w: curly ? 0.013 : 0.014, t: 0.011, away: outB, shade: 1.02 + 0.06 * rnd(), k: 12, m: 6, tip: 0.12, blunt: 0.4, root: 0.1, blend: 0.35 }));
    }
    if (!curly && !lite && !cap) for (let j = 0; j < 3; j++) {
      // (out of it, down, and curling back under at its end)
      const d = dirB(0.2 + 0.5 * rnd(), rnd() * 6.28), p2 = bunAt(d, rb * 1.24).add(V(0, -0.01, 0)), h = V(d.x, 0, d.z).normalize(), p3 = p2.clone().add(V(0, -0.02, 0)).addScaledVector(h, 0.004);
      res.head.push(lockGeo([bunAt(d, rb * 0.75), bunAt(d, rb * 1.05), p2, p3, p3.clone().add(V(0, -0.006, 0)).addScaledVector(h, -0.011)], { round: 1, w: 0.011, t: 0.009, away: outB, shade: 1.04, k: 10, m: 6, tip: 0.35, blunt: 0.6, root: 0.1, blend: 0.35 }));
    }
    // ---- ringlets left out: framing the face from the temples (the first the longest, toward the collarbone; the others
    // past the jaw), before and behind the ears, at the nape - a spiral curl round each one's line (the looser, a wave),
    // clear of the eyes, the face and the body; those hanging below the jaw on the body's bone, nodding with the head at
    // their roots, the rest the head's own ----
    // (spt: points to a turn - at full detail seven, a smooth helix, never a corner every half turn)
    const pi0 = mix(0.075, 0.034), pi1 = mix(0.06, 0.024), rad = mix(0.0125, 0.0072), eN = mix(0.42, 0.95), spt = dq >= 0.7 ? 7 : 5;
    const inv = H.toBody.clone().invert(), yJaw = V(hc.x, hc.y - 0.09, hc.z).applyMatrix4(H.toBody).y;
    const ringlet = (ph, ye, sc = 1, dir = 1) => {
      const be0 = Math.asin(Math.max(-0.6, Math.min(0.85, H.line(Math.cos(ph), Math.sin(ph)) + 0.05))), R = rad * sc, c = R * eN + 0.004;
      // (its root sunk in the hair, coming out of it along the head - no hook standing off the hairline)
      const hp = [capPt(dirOf(ph, be0 + 0.07), -0.016), capPt(dirOf(ph, be0 - 0.02), 0.001)];
      let q = hp[1].clone();
      // (leaving the hair gently - its clearance grown over its first few centimetres, never kinked straight out)
      for (let y = q.y - 0.016, m = 1; y > hc.y - 0.11; y -= 0.016, m++) { q = clear(V(q.x + 0.0006 * dir, y, q.z), c * Math.min(1, 0.35 + 0.22 * m)); hp.push(q.clone()); }
      smooth(hp, c);
      const A = hp.map((p) => p.applyMatrix4(H.toBody));
      // (below the head, clear of the neck; then on down, clear of the body; cut to its length)
      for (const p of A) for (let j = 0; j < 25 && p.y < J.neck.y + 0.06 && H.C.inside(p.x, p.y, p.z, c + 0.004); j++) p.x += dir * 0.004;
      if (ye < A[A.length - 1].y) A.push(...fall(A[A.length - 1], ye, dir, c + 0.006));
      const e = A.findIndex((p) => p.y < ye);
      if (e >= 0 && e < 3) return;
      if (e > 0) { const a = A[e - 1], b = A[e]; A.length = e; A.push(a.clone().lerp(b, (a.y - ye) / Math.max(1e-6, a.y - b.y))); }
      // (its line evenly divided, the curl round it: none for the first few centimetres out of the hairline, narrowing a
      // little at its end; its pitch tightening toward the end, where it is not pulled straight by its own weight)
      const Ls = [0]; for (let i = 1; i < A.length; i++) Ls.push(Ls[i - 1] + A[i].distanceTo(A[i - 1]));
      const LT = Ls[Ls.length - 1], axAt = (s) => { let i = 1; while (i < A.length - 1 && Ls[i] < s) i++; return A[i - 1].clone().lerp(A[i], clamp01((s - Ls[i - 1]) / Math.max(1e-6, Ls[i] - Ls[i - 1]))); };
      const NSg = lite ? Math.max(4, Math.round(LT / 0.03)) : Math.max(6, Math.ceil(LT / ((pi0 + pi1) / 2) * spt)), P = [], OD = []; let th = rnd() * 6.28;
      for (let i = 0; i <= NSg; i++) {
        const s = LT * i / NSg, f = s / LT, pt = axAt(s), T = axAt(Math.min(LT, s + 0.005)).sub(axAt(Math.max(0, s - 0.005))).normalize(), N = awayB(pt); N.addScaledVector(T, -N.dot(T)).normalize();
        const B = new THREE.Vector3().crossVectors(T, N), r = lite ? 0 : R * ss3(0.03, 0.09, s) * (1 - 0.3 * ss3(0.8, 1, f)), od = N.clone().multiplyScalar(eN * Math.cos(th)).addScaledVector(B, Math.sin(th));
        // (a spiral's flat turned out from its middle, round with it; a loose wave's out from the face, the body - no twist)
        P.push(pt.addScaledVector(od, r));
        const ow = lite || r < 1e-5 ? N : od.normalize().multiplyScalar(kink).addScaledVector(N, 1 - kink); OD.push(ow.lengthSq() > 1e-6 ? ow.normalize() : N);
        th += 2 * Math.PI * (LT / NSg) / (pi0 + (pi1 - pi0) * f);
      }
      const head = A[A.length - 1].y > J.neck.y + 0.04, pts = head ? P.map((p) => p.applyMatrix4(inv)) : P, ODx = head ? OD.map((d) => d.transformDirection(inv)) : OD;
      // (the strand itself round - a springy coil, not a twisted ribbon - nearly as thick as the coil is wide, so the turns
      // read as one spiral column; lit as a strand: its own round kept, drawn a little toward the coil's outside)
      (head ? res.head : res.body).push(lockGeo(pts, { round: 1, w: (lite ? 0.014 : mix(0.0118, 0.0108)) * sc, t: (lite ? 0.01 : mix(0.0088, 0.0098)) * sc, away: (cc, u) => { const f = u * (ODx.length - 1), i = Math.min(ODx.length - 2, Math.floor(f)); return ODx[i].clone().lerp(ODx[i + 1], f - i); }, shade: 1 + 0.08 * rnd(), wt: head ? null : wt, k: lite ? n(8, 5) : (pts.length - 1) * (kink < 0.5 ? 2 : 1), m: dq >= 0.9 && !lite ? 6 : 5, tip: 0.22, blunt: 0.6, root: 0.05, blend: 0.22 }));
    };
    // (those framing the face as she wants them, H.tendrils: none, the temple's alone (1), or all of them (2, as ever))
    const nkR = H.tendrils ?? 2;
    for (const sg of [-1, 1]) {
      if (curly) {
        // (spread along the hairline round the face - the temple, beside the cheek, before the ear - each its own length:
        // none bunched together at the side of the face; behind the ears only the nape's)
        if (nkR > 0) ringlet(sg * 1.0, ysh - 0.02 - 0.04 * rnd(), 1, 1);
        if (nkR > 1) { ringlet(sg * 1.23, yJaw - 0.03 - 0.03 * rnd(), 0.95, 1); if (!lite) ringlet(sg * 1.48, yJaw + 0.012 + 0.02 * rnd(), 0.86, 1); }
      } else {
        // (one from the temple, the other well back by the ear - apart, each its own length: never one bundle by the cheek)
        // (the temple's to a little past the jaw, toward the chin - a loose curl framing the face, never a corkscrew down to
        // the shoulder)
        if (nkR > 0) ringlet(sg * 1.0, yJaw - 0.035 - 0.03 * rnd(), 1.08, 1);
        if (nkR > 1 && !lite) ringlet(sg * 1.6, yJaw + 0.01 - 0.05 * rnd(), 0.95, 1);
      }
    }
    // (and at the nape)
    if (curly) { ringlet(2.72, J.neck.y - 0.02 - 0.04 * rnd(), 0.9, -1); if (!lite) ringlet(-2.72, J.neck.y - 0.02 - 0.04 * rnd(), 0.9, -1); }
    else if (!lite) ringlet(rnd() < 0.5 ? 2.85 : -2.85, J.neck.y - 0.02 - 0.03 * rnd(), 0.9, -1);
  }
  return res;
}

// ---- clothes ------------------------------------------------------------------------------------------------------------
// (the poses a skirt is worn in: standing, the feet near together)
const DRESS_POSES = new Set(['talk', 'pose', 'hips', 'cross', 'phone', 'record', 'selfie', 'gesture', 'mourn', 'cheer', 'reach', 'dance1', 'dance2', 'dance3', 'drink', 'toast', 'lean', 'hug', 'embraceM', 'embraceF', 'sideOut', 'sideIn', 'handOut', 'handIn', 'brohug']);
// (standing at ease: her carriage - tall, the weight on one foot - in these)
const IDLE_POSES = new Set(['talk', 'pose', 'hips', 'cross', 'phone', 'selfie', 'gesture', 'dance1', 'dance2', 'dance3', 'drink', 'toast']);
// (hair worn long, past the nape: its ends on the body; or down to the jaw - both cover the ears)
const LONG_HS = new Set(['long', 'waves', 'curlyLong', 'blowout']);
// (pulled up sleek and tight: a snatched high ponytail, a gala topknot)
const SLEEK = new Set(['highpony', 'topknot']);
// (a curly updo: a big, loose bun high on the crown with ringlets left hanging - spiral curls, or a fair messy one's waves)
const CURLBUN = new Set(['curlybun', 'messybun']);
/** necklines: where a top ends round the neck (f), by the angle round from the front */
const NECK = {
  // (a V-neck gown's: a plunge - PL_V; a day dress's or a jumpsuit's V and a wrap's crossover, by day: to just above the
  // bust's fullest - PL_VD, PL_WRAP)
  scoop: (a) => 0.835 + 0.13 * ss3(0, 1.55, Math.abs(a)), crew: (a) => 0.962 + 0.03 * ss3(0, 1.4, Math.abs(a)), v: (a) => PL_V.f(Math.abs(a)), vd: (a) => PL_VD.f(Math.abs(a)),
  square: (a) => 0.85 + 0.12 * ss3(0.5, 0.78, Math.abs(a)), shell: (a) => 0.86 + 0.11 * ss3(0, 1.5, Math.abs(a)), wrap: (a) => PL_WRAP.f(Math.abs(a)),
  slip: (a) => 0.785 + 0.055 * gau(Math.abs(a) - 0.45, 0.22) + 0.015 * ss3(1.8, 2.6, Math.abs(a)), shirt: (a) => 0.9 + 0.075 * ss3(0, 0.5, Math.abs(a)),
  // (a sweetheart's - a corset bodice's: low, two curves framing the tops of the bust, a notch at the middle dipping to the
  // cleavage, each side curving up and over a round, down again toward the arm; a camisole's V between its straps; an
  // off-the-shoulder's: straight round, low across the chest and the back)
  sweet: (a) => { const b = Math.abs(a), u = Math.min(1, b / 0.4); return 0.64 + 0.086 * u * (2 - u) - 0.008 * ss3(0.55, 1.35, b) + 0.02 * ss3(1.8, 2.5, b); },
  cami: (a) => { const u = Math.min(1, Math.abs(a) / 0.55); return 0.765 + 0.065 * (u + u * (2 - u)) / 2; },
  bardot: (a) => 0.828 - 0.014 * gau(a, 0.35) + 0.01 * ss3(1.6, 2.6, Math.abs(a)),
  // (cut against the person's own shoulders - ac: the collarbones' line, sm: the neck's seam (f) - and to one side, a's
  // sign the side: a halter's plunge (PL_HALTER) from below the bust up to the neck either side of the throat, the arms'
  // holes cut in deep and the back open to the waist; a one-shoulder's line from under the bare arm diagonally up across
  // the chest to the other shoulder, over its top - a broad strap - and down the back again; a blazer's plunge, from just
  // above its belt to the neck's sides (PL_BV), high round the back)
  halter: (a, ac, sm) => { const b = Math.abs(a), p = PL_HALTER.f(b); return (b < 0.42 ? p + (sm - NECK_SEAM) * ss3(0.85, NECK_SEAM, p) : 0.86 + (sm - 0.864) * ss3(0.04, 0.42, b)) - (sm - 0.834) * ss3(0.55, 1.05, b) - 0.36 * ss3(1.75, 2.7, b); },
  one: (a, ac, sm) => { const t = ac + 0.45 * (sm - ac); return spline([[-3.74, 0.81], [-Math.PI, 0.845], [-2.3, 0.812], [-1.6, 0.8], [-0.6, 0.8], [0, 0.826], [0.55, 0.875], [0.95, t], [2.25, t], [2.7, 0.885], [Math.PI, 0.845], [3.74, 0.82]], a)[0]; },
  bv: (a, ac, sm) => { const f = PL_BV.f(Math.abs(a)); return f + (sm - NECK_SEAM) * ss3(0.85, NECK_SEAM, f); },
};
/**
 * A plunge, cut against her bust (its rounds' middles ~0.42 rad either side of the breastbone, fullest at f ~0.62 - as a
 * structured bodice lifts and draws them in: F.lift): R, its edge's [f, angle round from the front] up from its point -
 * just above a belt - close together up the breastbone, opening along the inside of each round, on it and well inside
 * its fullest (the cloth always over that), out over its top and on to the neck's side at the seam (R's last) ->
 * { f(b): where its edge is (f) b round from the front (past the last: there), a(f): how far round it is at f }
 */
function plungeOf(R) {
  const N = 240, f0 = R[0][0], f1 = R[R.length - 1][0], Fs = [], As = [];
  for (let i = 0; i <= N; i++) { const f = f0 + (f1 - f0) * i / N; Fs.push(f); As.push(Math.max(i ? As[i - 1] + 1e-6 : 0, spline(R, f)[0])); }
  return {
    f: (b) => { if (b >= As[N]) return f1; let lo = 0, hi = N; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (As[m] <= b) lo = m; else hi = m; } return Fs[lo] + (Fs[hi] - Fs[lo]) * clamp01((b - As[lo]) / (As[hi] - As[lo])); },
    a: (f) => { const u = clamp01((f - f0) / (f1 - f0)) * N, i = Math.min(N - 1, Math.floor(u)); return As[i] + (As[i + 1] - As[i]) * (u - i); },
  };
}
// (an evening V-neck gown's to just above its belt, on to the shoulders; a blazer dress's to just above its buttons and
// belt, to the neck's sides; a halter's from below the bust up to the neck either side of the throat - each against her
// bust as a structured bodice lifts it, its fullest at f ~0.62. By day a jumpsuit's V and a wrap dress's crossover end
// just above her natural bust's fullest (f ~0.6), wider at the top)
const PL_V = plungeOf([[0.4, 0], [0.455, 0.035], [0.545, 0.09], [0.63, 0.18], [0.72, 0.29], [0.82, 0.47], [0.91, 0.69], [0.97, 0.9]]);
const PL_VD = plungeOf([[0.64, 0], [0.69, 0.06], [0.75, 0.15], [0.83, 0.3], [0.91, 0.56], [0.97, 0.9]]);
const PL_WRAP = plungeOf([[0.66, 0], [0.71, 0.07], [0.77, 0.17], [0.85, 0.37], [0.92, 0.7], [0.97, 1.05]]);
const PL_BV = plungeOf([[0.43, 0], [0.485, 0.035], [0.545, 0.09], [0.63, 0.18], [0.72, 0.3], [0.82, 0.51], [0.915, 0.77], [NECK_SEAM - 0.002, 1.0]]);
const PL_HALTER = plungeOf([[0.53, 0], [0.57, 0.055], [0.625, 0.14], [0.69, 0.205], [0.77, 0.26], [0.86, 0.31], [0.925, 0.35], [NECK_SEAM - 0.004, 0.4]]);
/**
 * the necklines a structured bodice is cut to - a corset's, a sweetheart's, an evening plunge's - and the kits built so
 * (an evening gown, a slit gown, a halter, a corset, a bodycon, a blazer dress, a plunge mini): her bust lifted in it
 * (F.lift) only in both; by day and in anything softer (a slip, sequins, a one-shoulder, a jumpsuit, a wrap dress - or a
 * casual kit cut to a V) her own natural shape
 */
const LIFT_NECKS = new Set(['v', 'sweet', 'halter', 'bv']), LIFT_KITS = new Set(['gown', 'slitgown', 'halter', 'corset', 'bodycon', 'blazerdress', 'plunge']);
/**
 * What each of the clothes kits is made of - her wardrobe, and anyone's off duty: neck (the neckline - a NECK, or 'mock'
 * (a high knitted neck), 'collar' (a tennis dress's polo collar), 'zip' (a track jacket's stand collar and zip)), sleeve
 * (how far down the arm: 0 sleeveless .. 1 to the wrist), fit (how loose the top), hem (where a top over trousers ends),
 * skirt ({ hem: 'mini' | 'short' | 'knee' | 'midi' | 'floor', asym (the hem on the diagonal: hem on one side, this on the
 * other), flare, cling (0..1: how closely it follows the legs below the seat - a fitted cut's), pleats, wrap (an overlap),
 * slit, over (worn over trousers) } - a coat's skirt, below its waist), trousers ('skinny' | 'jeans' | 'straight' |
 * 'wide'; under: worn beneath a coat), jacket (worn open over the top, the top beneath it in the accent colour), lapels
 * (the top's own, either side of its V: a blazer dress's), belt (1, or 'tie': a sash of its own cloth), chain, straps,
 * ribs (a knit's), the shoes ('heel', 'trainer', 'shoe', 'boot'), rough (the cloth's sheen: satin glossy, knit matt)
 */
const OUTFITS = {
  dress: { neck: 'scoop', sleeve: 0.17, skirt: { hem: 'knee', flare: 0, cling: 0.3 }, belt: 1, chain: 1, shoe: 'heel', rough: 0.36 },
  gown: { neck: 'v', sleeve: 0.1, skirt: { hem: 'floor', flare: 0.42, cling: 0.25 }, belt: 1, chain: 1, shoe: 'heel', rough: 0.3 },
  slip: { neck: 'slip', sleeve: 0, straps: 1, skirt: { hem: 'midi', flare: 0.1, cling: 0.3 }, chain: 1, shoe: 'heel', rough: 0.24 },
  wrap: { neck: 'wrap', sleeve: 0.97, skirt: { hem: 'knee', flare: 0.14, wrap: 1, cling: 0.2 }, belt: 'tie', shoe: 'heel', rough: 0.55 },
  knit: { neck: 'mock', sleeve: 0.97, skirt: { hem: 'midi', flare: 0.02, cling: 0.4 }, ribs: 1, shoe: 'heel', rough: 0.92 },
  tennis: { neck: 'collar', sleeve: 0.1, skirt: { hem: 'short', flare: 0.4, pleats: 16 }, shoe: 'trainer', rough: 0.75 },
  trench: { neck: 'crew', jacket: 'trench', skirt: { hem: 'knee', flare: 0.16, wrap: 1, over: 1 }, under: 'skinny', belt: 'tie', shoe: 'boot', rough: 0.62 },
  jumpsuit: { neck: 'vd', sleeve: 0.1, trousers: 'wide', belt: 1, shoe: 'heel', rough: 0.55 },
  pantsuit: { neck: 'shirt', jacket: 'blazer', trousers: 'straight', shoe: 'shoe', rough: 0.68 },
  blazer: { neck: 'shell', jacket: 'blazer', trousers: 'straight', shoe: 'shoe', rough: 0.72 },
  coord: { neck: 'square', sleeve: 0.42, hem: 0.08, fit: 0.012, trousers: 'wide', shoe: 'shoe', rough: 0.82 },
  leather: { neck: 'crew', jacket: 'leather', trousers: 'skinny', shoe: 'boot', rough: 0.36 },
  bomber: { neck: 'crew', jacket: 'bomber', trousers: 'jeans', shoe: 'trainer', rough: 0.55 },
  sweater: { neck: 'crew', sleeve: 1, hem: -0.07, fit: 0.013, ribs: 1, trousers: 'jeans', shoe: 'boot', rough: 0.95 },
  athleisure: { neck: 'zip', sleeve: 1, hem: -0.05, fit: 0.006, trousers: 'skinny', shoe: 'trainer', rough: 0.5 },
  casual: { neck: 'crew', sleeve: 0.33, hem: -0.05, fit: 0.008, trousers: 'jeans', shoe: 'trainer', rough: 0.86 },
  // (a night out's, a red carpet's: a fitted mini, a gown slit to the thigh, a backless halter, off the shoulder, a corset
  // bodice, a cropped top over a high waist, sequins, a one-shoulder dress cut on the diagonal - its hem too - and a
  // blazer worn as a dress, belted, its lapels in a deep V)
  bodycon: { neck: 'sweet', sleeve: 0, straps: 1, skirt: { hem: 'thigh', flare: 0, cling: 0.6 }, chain: 1, shoe: 'heel', rough: 0.32 },
  slitgown: { neck: 'sweet', sleeve: 0, straps: 1, skirt: { hem: 'floor', flare: 0.2, slit: 1, cling: 0.4 }, chain: 1, shoe: 'heel', rough: 0.24 },
  halter: { neck: 'halter', sleeve: 0, halter: 1, skirt: { hem: 'floor', flare: 0.26, slit: 1, cling: 0.4 }, shoe: 'heel', rough: 0.28 },
  bardot: { neck: 'bardot', sleeve: 0, bardot: 1, skirt: { hem: 'short', flare: 0.03, cling: 0.45 }, shoe: 'heel', rough: 0.4 },
  corset: { neck: 'sweet', sleeve: 0, boned: 1, skirt: { hem: 'midi', flare: 0.06, slit: 1, cling: 0.45 }, shoe: 'heel', rough: 0.3 },
  cropset: { neck: 'square', sleeve: 0.97, crop: 0.5, skirt: { hem: 'midi', flare: 0.04, cling: 0.3 }, shoe: 'heel', rough: 0.45 },
  croppants: { neck: 'bardot', sleeve: 0, bardot: 1, crop: 0.52, trousers: 'wide', shoe: 'heel', rough: 0.4 },
  sequin: { neck: 'cami', sleeve: 0, straps: 1, skirt: { hem: 'thigh', flare: 0.05, cling: 0.45 }, sparkle: 1, shoe: 'heel', rough: 0.3 },
  oneshoulder: { neck: 'one', sleeve: 0, skirt: { hem: 'short', asym: 'midi', flare: 0.05, cling: 0.45 }, shoe: 'heel', rough: 0.34 },
  blazerdress: { neck: 'bv', sleeve: 0.97, lapels: 1, skirt: { hem: 'thigh', flare: 0.04, wrap: 1, cling: 0.45 }, belt: 1, shoe: 'heel', rough: 0.6 },
  // (a gala's, cut from the necklines above: a plunge mini - a clean deep V from below the bust up to a halter band at the
  // neck, the shoulders bare and the back open, no lapels and no belt, its short skirt flared a little from the hips: never
  // the blazer dress again; an asymmetric wrap gown - one shoulder, its skirt wrapped over and slit high, a sash of its own
  // cloth tied at the waist; a bias-cut slip to the floor on fine straps)
  plunge: { neck: 'halter', sleeve: 0, halter: 1, skirt: { hem: 'thigh', flare: 0.13, cling: 0.38 }, shoe: 'heel', rough: 0.3 },
  wrapgown: { neck: 'one', sleeve: 0, wrapLine: 1, skirt: { hem: 'floor', flare: 0.16, slit: 1, wrap: 1, cling: 0.42 }, belt: 'tie', shoe: 'heel', rough: 0.26 },
  galaslip: { neck: 'slip', sleeve: 0, straps: 1, skirt: { hem: 'floor', flare: 0.12, cling: 0.32 }, chain: 1, shoe: 'heel', rough: 0.22 },
  // (a club's, an after-party's - what is really worn out at night: a bodycon mini cut out at the waist, a ruched
  // one-shoulder mini cut out at its bare side, a long-sleeved mini cut out under the bust or open down the back, a halter
  // mini with a diamond cut out at the midriff, a strappy mini cut out at the hips, a sequin halter micro-mini bare to the
  // waist behind, a satin cowl cami over a leather mini, a corset worn as a top over wide or leather trousers, a bandeau
  // crop over a high-waisted mini, a crop over low-rise trousers or jeans, a bralette under an open oversized blazer, a
  // sheer mesh or lace dress over an opaque one, a plunging slip mini. Opaque wherever it covers her - the sheer only
  // ever over a dress of its own. Their pieces: holes (cut-outs: HOLES), back (open to f), sheer, sep (the skirt a
  // separate, in the accent colour and its own cloth), legFab (the trousers' cloth), rise (low-rise: their top), ruched,
  // cowl, lift (a structured bodice: her bust lifted), fin (the kit's own finish), 'micro' (a hem), the shoes; nape (an
  // open back closed by a narrow band across the nape), point (a corset's hem dipping to a point at the front), inseam (wide
  // trousers' two legs read down their inseams standing), a sheer's drop (its hem a little below the dress's); band (a
  // bandeau: stretch cloth hugging her, gathered - its own ruched material), knot ('twist' at its neckline, 'tie' at its
  // hem), bra (a bralette's band, gore and cup seams), jkBtn (the jacket closed with one button at that height), cross /
  // ring (a cut-out's criss-cross straps, its O-ring), tie (an open back's nape tied in a bow), accFin (the top beneath a
  // jacket in its own cloth), a skirt's slit < 1 (a mini's: that share of the thigh up from its hem))
  cutoutmini:{ neck: 'sweet', sleeve: 0, straps: 1, lift: 1, holes: 'waist', ring: 1, skirt: { hem: 'mini', flare: 0, cling: 0.6 }, shoe: 'heel', fin: 'jersey', rough: 0.4 },
  sidecut: { neck: 'one', sleeve: 0, holes: 'side', ruched: 1, skirt: { hem: 'mini', slit: 0.12, flare: 0.02, cling: 0.55 }, shoe: 'heel', fin: 'satin', rough: 0.34 },
  keyhole: { neck: 'crew', sleeve: 0.97, holes: 'under', skirt: { hem: 'thigh', flare: 0, cling: 0.6 }, shoe: 'heel', fin: 'jersey', rough: 0.45 },
  backless: { neck: 'crew', sleeve: 0.97, back: 0.3, nape: 1, tie: 1, skirt: { hem: 'mini', flare: 0.02, cling: 0.55 }, shoe: 'heel', fin: 'satin', rough: 0.35 },
  diamond: { neck: 'halter', sleeve: 0, halter: 1, holes: 'front', cross: 2, skirt: { hem: 'midi', slit: 1, m: 60, flare: 0.02, cling: 0.5 }, shoe: 'heel', fin: 'jersey', rough: 0.36 },
  // (a long-sleeved jersey midi cut out over the ribs either side, slit high)
  ribcut: { neck: 'crew', sleeve: 0.97, holes: 'rib', skirt: { hem: 'midi', slit: 1, m: 60, flare: 0.02, cling: 0.55 }, shoe: 'heel', fin: 'jersey', rough: 0.6 },
  hipcut: { neck: 'cami', sleeve: 0, straps: 1, holes: 'hip', skirt: { hem: 'micro', flare: 0, cling: 0.6, rise: 0.115 }, shoe: 'heel', fin: 'jersey', rough: 0.38 },
  haltermicro: { neck: 'halter', sleeve: 0, halter: 1, sparkle: 1, skirt: { hem: 'micro', flare: 0.03, cling: 0.45 }, shoe: 'sandal', fin: 'sequin', rough: 0.3 },
  camiskirt: { neck: 'cowl', sleeve: 0, straps: 1, cowl: 1, sep: 'leather', skirt: { hem: 'thigh', slit: 0.14, flare: 0.02, cling: 0.55 }, shoe: 'heel', fin: 'satin', rough: 0.3 },
  corsettop: { neck: 'sweet', sleeve: 0, boned: 1, lift: 1, hem: 0.1, point: 1, trousers: 'wide', inseam: 1, shoe: 'heel', fin: 'satin', rough: 0.3 },
  corsetleather: { neck: 'sweet', sleeve: 0, boned: 1, lift: 1, hem: 0.1, point: 1, trousers: 'skinny', legFab: 'leather', shoe: 'heel', fin: 'satin', rough: 0.3 },
  bandeauset: { neck: 'straight', sleeve: 0, band: 1, crop: 0.52, skirt: { hem: 'micro', flare: 0, cling: 0.55, rise: 0.2 }, shoe: 'heel', fin: 'rib', rough: 0.45 },
  // (and the bandeau's other cuts: a satin twist-front bandeau over a slit midi set low; a tie-front sweetheart crop on
  // fine straps over a mini; a one-shoulder rib crop over low-rise jeans)
  twistset: { neck: 'twist', sleeve: 0, band: 1, knot: 'twist', crop: 0.53, skirt: { hem: 'midi', slit: 1, m: 60, flare: 0.03, cling: 0.5, rise: 0.2 }, shoe: 'sandal', fin: 'satin', rough: 0.3 },
  tieset: { neck: 'tiefront', sleeve: 0, straps: 1, band: 1, knot: 'tie', crop: 0.55, skirt: { hem: 'mini', flare: 0.02, cling: 0.55, rise: 0.21 }, shoe: 'heel', fin: 'jersey', rough: 0.6 },
  onecrop: { neck: 'one', sleeve: 0, crop: 0.5, rise: 0.14, trousers: 'jeans', shoe: 'heel', fin: 'rib', rough: 0.8 },
  lowrise: { neck: 'square', sleeve: 0.28, crop: 0.46, rise: 0.13, trousers: 'wide', inseam: 1, shoe: 'heel', rough: 0.5 },
  cropjeans: { neck: 'sweet', sleeve: 0, band: 1, crop: 0.48, rise: 0.14, trousers: 'jeans', shoe: 'heel', fin: 'satin', rough: 0.35 },
  blazerbra: { neck: 'bralette', sleeve: 0, straps: 1, bra: 1, crop: 0.53, jacket: 'oversize', skirt: { hem: 'micro', flare: 0.02, cling: 0.5 }, shoe: 'heel', fin: 'crepe', accFin: 'satin', rough: 0.62 },
  // (the same blazer closed with a single button at the waist over the bralette - the V above it open to the button)
  blazerbtn: { neck: 'bralette', sleeve: 0, straps: 1, bra: 1, crop: 0.53, jacket: 'oversize', jkBtn: 0.34, skirt: { hem: 'mini', flare: 0.02, cling: 0.5 }, shoe: 'heel', fin: 'crepe', accFin: 'satin', rough: 0.62 },
  // (a fitted power-mesh dress to the knee, close on her all the way down, over an opaque bandeau micro slip)
  meshdress: { neck: 'bardot', sleeve: 0, skirt: { hem: 'micro', flare: 0, cling: 0.5 }, sheer: { neck: 'crew', sleeve: 0.97, hem: 'knee', flare: 0, cling: 0.95, taper: 0.1 }, shoe: 'heel', fin: 'jersey', rough: 0.4 },
  // (the lace mini - lace on its own slip, its sleeves and yoke sheer - with the rest of the lace: world/Lace.js)
  slipmini: { neck: 'plungeslip', sleeve: 0, straps: 1, back: 0.5, skirt: { hem: 'mini', flare: 0.05, cling: 0.4 }, shoe: 'sandal', fin: 'satin', rough: 0.26 },
  // (his, out at night: an open-necked silk shirt - a camp collar, unbuttoned low - a fine knitted polo, a T-shirt under
  // a blazer; with the leather jacket over a T-shirt and the bomber above, and a blazer over an open shirt (pantsuit))
  silkshirt: { neck: 'camp', camp: 1, drape: 1, sleeve: 0.97, hem: 0.0, fit: 0.01, trousers: 'straight', shoe: 'shoe', fin: 'satin', rough: 0.3 },
  knitpolo: { neck: 'collar', sleeve: 0.33, hem: 0.02, fit: 0.008, ribs: 1, trousers: 'straight', shoe: 'shoe', rough: 0.9 },
  teeblazer: { neck: 'crew', jacket: 'blazer', trousers: 'skinny', shoe: 'trainer', rough: 0.62 },
};
/** the clubwear kits (OUTFITS above): hers, and his */
export const CLUB_KITS = Object.freeze(['cutoutmini', 'sidecut', 'keyhole', 'backless', 'diamond', 'ribcut', 'hipcut', 'haltermicro', 'camiskirt', 'corsettop', 'corsetleather', 'bandeauset', 'twistset', 'tieset', 'onecrop', 'lowrise', 'cropjeans', 'blazerbra', 'blazerbtn', 'meshdress', 'lacemini', 'slipmini', 'lacebustier', 'lacecorset', 'lacecorsetwide', 'lacebody', 'laceset', 'lacesleeve']);
export const CLUB_KITS_M = Object.freeze(['silkshirt', 'knitpolo', 'teeblazer', 'leather', 'bomber', 'pantsuit']);
// (and the swimwear's - a pool club's, a beach club's, a yacht's: bikinis, monokinis, one-pieces and what goes over them,
// his swim shorts and an open shirt - world/Swimwear.js, its own pieces built there; their necklines lifting her bust as
// a structured top does, their cloths)
Object.assign(OUTFITS, SW.SWIM_OUTFITS); Object.assign(FINISHES, SW.SWIM_FINISHES); for (const k of SW.SWIM_LIFT) LIFT_NECKS.add(k);
// (and the lace collection's - world/Lace.js: lace on a lining, sheer lace sleeves and yokes, scalloped hems, trims; a
// broderie's cotton)
Object.assign(OUTFITS, LACE_OUTFITS); Object.assign(FINISHES, LACE_FINISHES);
/** the lace kits (each OUTFITS' own, its lace in world/Lace.js) */
export const LACE_KITS = Object.freeze(Object.keys(LACE_OUTFITS));
/** the swimwear kits: hers, his; and how each covers (SWIM_INFO: a crowd's colours, its far bodies) */
export const SWIM_KITS = SW.SWIM_F;
export const SWIM_KITS_M = SW.SWIM_M;
export const SWIM_INFO = SW.SWIM_INFO;
/** every clothes kit (makePerson's o.kit besides 'suit', 'polo', 'jacket', 'marshal') */
export const OUTFIT_KITS = Object.freeze(Object.keys(OUTFITS));
/** the four red-carpet silhouettes a style editor offers first, by kit */
export const SILHOUETTES = Object.freeze({ blazerdress: 'Deep-V blazer dress', wrapgown: 'Asymmetric slit wrap gown', plunge: 'Plunge mini', galaslip: 'Gala slip' });
// (the necklines a cut of her own may take - those that stand on their own, without a kit's own pieces: a halter's band,
// an off-the-shoulder's sleeves)
const CUT_NECKS = ['scoop', 'v', 'slip', 'wrap', 'sweet', 'cami', 'square', 'one', 'bv'], HEMS = ['micro', 'mini', 'thigh', 'short', 'knee', 'midi', 'floor'];
/** a hem's place along the leg sitting (a share of it from the hip; tk: the knee's) - a little higher up the thigh than standing */
const lapHem = (hm, tk) => (hm === 'micro' ? 0.42 * tk : hm === 'mini' ? 0.5 * tk : hm === 'thigh' ? 0.62 * tk : hm === 'short' ? 0.85 * tk : hm === 'knee' ? tk + 0.06 * (1 - tk) : hm === 'midi' ? tk + 0.45 * (1 - tk) : 0.95);
/**
 * A kit as she wears it: cut her own way (cut: { neck (CUT_NECKS - straps with a slip's, a camisole's or a sweetheart's;
 * lapels only round a blazer dress's V), sleeve 0..1, hem, asym (the hem on the diagonal), slit, flare 0..0.5, cling
 * 0..0.7, wrap }) and in a fabric of her own (sequins glitter, nothing else does) -> a new kit (the kit itself never
 * changed); neither: the kit as it is
 */
function applyCut(K, cut, fabric) {
  if (!cut && !fabric) return K;
  const R = { ...K, ...(K.skirt ? { skirt: { ...K.skirt } } : {}) };
  if (fabric) R.sparkle = fabric === 'sequin' ? 1 : 0;
  if (cut && typeof cut === 'object') {
    if (CUT_NECKS.includes(cut.neck) && cut.neck !== R.neck) { R.neck = cut.neck; R.straps = ['slip', 'cami', 'sweet'].includes(cut.neck) ? 1 : 0; if (cut.neck !== 'bv') R.lapels = 0; R.halter = 0; R.bardot = 0; }
    if (typeof cut.sleeve === 'number' && isFinite(cut.sleeve) && !R.jacket) R.sleeve = clamp01(cut.sleeve);
    const S = R.skirt;
    if (S) {
      if (HEMS.includes(cut.hem)) S.hem = cut.hem;
      if (cut.asym === null || cut.asym === false) delete S.asym; else if (HEMS.includes(cut.asym)) S.asym = cut.asym;
      for (const [k, hi] of [['flare', 0.5], ['cling', 0.7]]) if (typeof cut[k] === 'number' && isFinite(cut[k])) S[k] = Math.max(0, Math.min(hi, cut[k]));
      for (const k of ['slit', 'wrap']) if (typeof cut[k] === 'boolean' || cut[k] === 0 || cut[k] === 1) S[k] = cut[k] ? 1 : 0;
    }
  }
  return R;
}
// ---- a night out's own pieces (the clubwear kits): cut-outs, an open back, a sheer layer, a camp collar, gathers, boots
// and strappy sandals ----------------------------------------------------------------------------------------------------
/** the shoes (o.shoe, or a kit's own): a court heel, a strappy sandal, a boot to the knee or over it, a platform sandal - heeled ones hers only - trainers, boots, shoes; slides (by the pool, anyone's); none - barefoot (bare: in the water, on its edge) */
const HEELS = new Set(['heel', 'sandal', 'kneeboot', 'thighboot', 'platform']);
export const SHOE_KINDS = Object.freeze(['heel', 'sandal', 'kneeboot', 'thighboot', 'trainer', 'boot', 'shoe', 'platform', 'slide', 'bare']);
/** a superellipse's half-width across u in [0, 1] (p: its squareness) - a cut-out's rounded ends */
const sEll = (u, p = 2.4) => Math.pow(Math.max(0, 1 - Math.abs(2 * u - 1) ** p), 1 / p);
/**
 * Cut-outs (OF.holes), by side s (a one-sided cut's - a one-shoulder's bare side): each { f0, f1 (how high on the
 * torso), c(u) (its middle, the angle round from the front, u up it 0..1), w(u) (its half-width there, rad) } - at the
 * waist either side, toward the front; at one side, slanting up toward the back; under the bust, below its rounds (the
 * bust always covered); a diamond at the midriff; either hip, between the bodice and a skirt set lower (its rise)
 */
const HOLES = {
  waist: () => [1, -1].map((k) => ({ f0: 0.315, f1: 0.47, c: () => k * 1.2, w: (u) => 0.4 * sEll(u) })),
  side: (s) => [{ f0: 0.3, f1: 0.56, c: (u) => s * (0.95 + 0.5 * u), w: (u) => 0.36 * sEll(u, 2) }],
  under: () => [{ f0: 0.43, f1: 0.515, c: () => 0, w: (u) => 0.52 * sEll(u, 1.8) }],
  front: () => [{ f0: 0.295, f1: 0.435, c: () => 0, w: (u) => 0.3 * sEll(u, 1.4) }],
  // (over the hip bone, below the waist - a slanted oval each side, its top turned toward the back, well clear of the
  // front; the skirt set low beneath them)
  hip: () => [1, -1].map((k) => ({ f0: 0.135, f1: 0.255, c: (u) => k * (1.12 + 0.2 * u), w: (u) => 0.24 * sEll(u, 2) })),
  // (over the ribs either side, below the bust's side - a long narrow slant, its top toward the back)
  rib: () => [1, -1].map((k) => ({ f0: 0.38, f1: 0.52, c: (u) => k * (0.95 + 0.22 * u), w: (u) => 0.16 * sEll(u, 2) })),
  // (the back open from the small of the back up between the shoulder blades - a U, rounded at its foot - closed across
  // the nape above it)
  back: () => [{ f0: 0.34, f1: 0.86, c: () => Math.PI, w: (u) => 0.6 * Math.sqrt(1 - Math.max(0, (0.3 - u) / 0.3) ** 2) * Math.sqrt(1 - Math.max(0, (u - 0.8) / 0.2) ** 2) }],
};
export const HOLE_KINDS = Object.freeze(Object.keys(HOLES));
/** a piece on the torso T facing out (its middle vertex m's normal away from the section's middle at f) -> g */
const outward = (g, T, m, f) => { const P = g.attributes.position, N = g.attributes.normal, c = T.c(f); return (P.getX(m) - c.x) * N.getX(m) + (P.getZ(m) - c.z) * N.getZ(m) < 0 ? inward(g) : g; };
/** a grid of points on the torso (P(i, j) -> [x, y, z], K + 1 rows of W), coloured (cols: [r, g, b] each) -> geometry, facing out */
function torsoGrid(T, K, W, P, cols, fMid) {
  const pos = [], idx = [];
  for (let i = 0; i <= K; i++) for (let j = 0; j < W; j++) pos.push(...P(i, j));
  for (let i = 0; i < K; i++) for (let j = 0; j < W - 1; j++) { const a = i * W + j, b = a + 1, c = a + W + 1, d = a + W; idx.push(a, b, c, a, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.setIndex(idx); g.computeVertexNormals();
  return outward(g, T, (K >> 1) * W + (W >> 1), fMid);
}
/**
 * A band (band's lo, hi, out, o) with holes cut in it (H: HOLES') - whole below and above them; between them, panels
 * from one hole's edge round to the next's, those edges turned under (a rim, a shade darker: the cloth's thickness at a
 * cut-out's edge); beneath each hole the skin, in the cloth's shadow at its edges (lum: her skin's luminance). Returns
 * the band above (its neckline's); the other pieces go in outP ([geometry, points a row, skin?]). Holes it cannot hold
 * (the band too short for them): the band whole
 */
function holedBand(T, lo, hi, out, o, H, outP, lum = 0.35) {
  const f0 = Math.min(...H.map((h) => h.f0)), f1 = Math.max(...H.map((h) => h.f1)), AS = [-Math.PI, -2, -1.2, -0.6, 0, 0.6, 1.2, 2];
  const l0 = typeof lo === 'function' ? Math.max(...AS.map(lo)) : lo, h0 = typeof hi === 'function' ? Math.min(...AS.map(hi)) : hi;
  if (l0 > f0 - 0.015 || h0 < f1 + 0.015) return band(T, lo, hi, out, o);
  // (its rows by its longest reach below the holes - a one-piece's leg line dips to the crotch: lM)
  const lM = typeof lo === 'function' ? Math.min(...AS.map(lo)) : lo, R = o.rows ?? 12, per = R / Math.max(0.1, h0 - lM), hm = o.hem || '', th = o.th ?? 0.004, M = n(o.m ?? 44, 8), O = typeof out === 'function' ? out : () => out;
  outP.push([band(T, lo, f0, out, { m: o.m, rows: Math.max(2, Math.round(per * (f0 - lM))), hem: hm === 'both' || hm === 'lo' ? 'lo' : '', th, dense: typeof lo === 'function' ? o.dense ?? 0 : 0 }), M]);
  // (round between the holes: each panel from one's edge to the next's, its rows close enough for their curves)
  const Hs = H.map((h) => ({ ...h, u: (f) => clamp01((f - h.f0) / (h.f1 - h.f0)) })).sort((a, b) => a.c(0.5) - b.c(0.5)), K = n(Math.max(8, Math.round(per * (f1 - f0) * 2)), 4);
  for (let i = 0; i < Hs.length; i++) {
    const A = Hs[i], Bh = Hs[(i + 1) % Hs.length], wr = i + 1 >= Hs.length ? 2 * Math.PI : 0, a0 = (f) => A.c(A.u(f)) + A.w(A.u(f)), a1 = (f) => Bh.c(Bh.u(f)) - Bh.w(Bh.u(f)) + wr, fm = (f0 + f1) / 2;
    const C = Math.max(4, Math.round(M * (a1(fm) - a0(fm)) / (2 * Math.PI))), W = C + 3, cols = [];
    // (each panel carried a little on under the bands above and below it (a row past each end, a hair beneath them):
    // their edges and its never meeting edge to edge on their own columns - no crack of the background along the seam)
    for (let k = -1; k <= K + 1; k++) for (let j = -1; j <= C + 1; j++) { const e = j < 0 || j > C ? 0.6 : j === 0 || j === C ? 0.86 : 1; cols.push(e, e, e); }
    outP.push([torsoGrid(T, K + 2, W, (kk, jj) => { const k = kk - 1, f = k < 0 ? f0 - 0.006 : k > K ? f1 + 0.006 : f0 + (f1 - f0) * k / K, j = jj - 1, A0 = a0(f), a = A0 + (a1(f) - A0) * clamp01(j / C), p = T.pt(f, a, O(f, a) - (j < 0 || j > C ? th : 0) - (k < 0 || k > K ? 0.0008 : 0)); return [p.x, p.y, p.z]; }, cols, fm), W]);
  }
  // (the skin under each hole: a patch round it, the cloth's shadow on it at the edges - a tight dark core where its
  // edge lies on the skin, a short soft tail - warm, the skin's own red kept, never near black)
  const sMin = 0.42 + 0.13 * ss3(0.3, 0.08, lum);
  for (const h of Hs) {
    const KS = n(10, 4), CS = n(12, 4), cs = [0, 0.25, 0.5, 0.75, 1].map((x) => h.c(x)), wm = Math.max(...[0.25, 0.5, 0.75].map(h.w)) + 0.05, aL = Math.min(...cs) - wm, aR = Math.max(...cs) + wm, F0 = h.f0 - 0.012, F1 = h.f1 + 0.012, cols = [];
    const at = (i, j) => [F0 + (F1 - F0) * i / KS, aL + (aR - aL) * j / CS];
    for (let i = 0; i <= KS; i++) for (let j = 0; j <= CS; j++) {
      const [f, a] = at(i, j), q = h.u(f), [w, d] = T.sec(f), r = Math.hypot(w * Math.sin(a), d * Math.cos(a)), e = Math.max(0, Math.min((h.w(q) - Math.abs(a - h.c(q))) * r, Math.min(f - h.f0, h.f1 - f) * T.H));
      const s0 = (1 - 0.55 * Math.exp(-e / 0.004)) * (1 - 0.16 / (1 + (e / 0.014) ** 2) ** 2), s = s0 + sMin * (1 - s0) ** 2.4; cols.push(s ** 0.8, s, s ** 1.18);
    }
    outP.push([torsoGrid(T, KS, CS + 1, (i, j) => { const [f, a] = at(i, j), p = T.pt(f, a, 0); return [p.x, p.y, p.z]; }, cols, (F0 + F1) / 2), 0, 1]);
  }
  return band(T, f1, hi, out, { ...o, rows: Math.max(3, Math.round(per * (h0 - f1))), hem: hm === 'both' || hm === 'hi' ? 'hi' : '', follow: 0 });
}
/**
 * A neckline (fn: NECK's) with the back cut open to f b: a deep U from between the shoulder blades down to the small of
 * the back, rounded across the spine at its foot - the same arity as fn (cut against her shoulders or not); no b: fn
 */
const withBack = (fn, b) => {
  if (!b || !fn) return fn;
  // (its sides rising to the shoulders' seam well in from the arms - between the shoulder blades, never out over a
  // sleeve's or a strap's top)
  const bk = (a) => b + (1 - b) * ss3(0.3, 0.64, Math.PI - Math.abs(Math.atan2(Math.sin(a), Math.cos(a))));
  return fn.length > 1 ? (a, ac, sm) => Math.min(fn(a, ac, sm), bk(a)) : (a) => Math.min(fn(a), bk(a));
};
/** an open-necked shirt's V (a camp collar's): from its top button, open low on the chest, up to the neck's sides */
const PL_CAMP = plungeOf([[0.735, 0], [0.77, 0.06], [0.81, 0.13], [0.855, 0.22], [0.9, 0.36], [0.935, 0.55], [NECK_SEAM - 0.002, 0.95]]);
// (and a slip's plunge: the V-neck's down the middle to just above the waist, opening to the straps, then a slip's low
// line under the arms and round the back)
const CLUB_NECK = {
  camp: (a, ac, sm) => { const f = PL_CAMP.f(Math.abs(a)); return f + (sm - NECK_SEAM) * ss3(0.85, NECK_SEAM, f); },
  plungeslip: (a) => { const b = Math.abs(a); return PL_V.f(b) + (NECK.slip(a) - PL_V.f(b)) * ss3(0.55, 0.85, b); },
  // (a cowl: the cami's line at the straps, between them the cloth hanging in one soft U - round at its foot, no point)
  cowl: (a) => { const u = Math.min(1, Math.abs(a) / 0.62); return u < 1 ? 0.83 - 0.083 * (1 - u * u) ** 1.3 : NECK.cami(a); },
};
/**
 * Gathers shaded into a piece on the torso T (its colours, per vertex): 'ruched' - fine folds slanting up toward the side
 * s, the cloth drawn in along them; 'cowl' - soft drapes hanging in loops in front under its neckline (nl(a)) -> g
 */
function gathers(g, T, kind, s, nl) {
  const P = g.attributes.position, C = g.attributes.color || tint(g, 1).attributes.color, qi = T.q.clone().invert(), v = V(0, 0, 0);
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i).sub(T.A).applyQuaternion(qi); const f = (v.y + 0.11) / T.H, a = Math.atan2(v.z, v.x - T.sec(f)[2]);
    let k = 1;
    if (kind === 'ruched') { const ph = (v.y * 0.86 - s * v.z * 0.5) / 0.022; k = 1 - 0.36 * Math.max(0, Math.sin(ph * 2 * Math.PI)) ** 2 * (0.65 + 0.35 * Math.sin(ph * 0.9 + 1.3)); }
    // (a cowl's folds (COWL): a soft shadow just under each, on the cloth below it - a few per cent, never a stain)
    else if (nl) for (const [A, D] of COWL) { const u = Math.abs(a) / A; if (u >= 1) continue; const d = nl(a) - D * (1 - u * u) ** 1.2 - f; k *= 1 - 0.09 * gau(d - 0.0175, 0.008) * (1 - u ** 4); }
    C.setXYZ(i, C.getX(i) * k, C.getY(i) * k, C.getZ(i) * k);
  }
  return g;
}
/** a cowl's folds, each [half-width where it meets the neckline (rad), how far below it it hangs at the middle (f)] */
const COWL = [[0.5, 0.032], [0.4, 0.068]];
/**
 * A soft fold of cloth lying along a piece on the torso T: along f(a) from a0 to a1, out(f, a) off the torso, r round,
 * tapering to nothing at both ends (into the cloth it is part of) -> geometry
 */
// (flat in section (fl: its thickness a share of its width) and lying on the cloth - a soft roll of it, never a cord
// standing on it, read as a chain)
function foldTube(T, fa, a0, a1, out, r, k = 14, fl = 0.42) {
  const P = [], Nn = []; for (let i = 0; i <= k; i++) { const a = a0 + (a1 - a0) * i / k, f = fa(a), o = out(f, a), q = T.pt(f, a, o); Nn.push(T.pt(f, a, o + 0.01).sub(q).normalize()); P.push(q.addScaledVector(Nn[i], 0.8 * fl * r)); }
  const cv = new THREE.CatmullRomCurve3(P), S = n(k + 4, 6), Rr = n(6, 4), g = new THREE.TubeGeometry(cv, S, r, Rr, false), G = g.attributes.position, c = V(0, 0, 0), p = V(0, 0, 0), nn = V(0, 0, 0);
  for (let i = 0; i <= S; i++) {
    const u = i / S, x = u * k, i0 = Math.min(k - 1, Math.floor(x)); cv.getPointAt(u, c); nn.copy(Nn[i0]).lerp(Nn[i0 + 1], x - i0).normalize(); const w = Math.sin(Math.PI * u) ** 0.6;
    for (let j = 0; j <= Rr; j++) { const q = i * (Rr + 1) + j; p.fromBufferAttribute(G, q).sub(c); p.addScaledVector(nn, p.dot(nn) * (fl - 1)).multiplyScalar(w).add(c); G.setXYZ(q, p.x, p.y, p.z); }
  }
  g.deleteAttribute('uv'); g.computeVertexNormals(); return g;
}
/**
 * Trousers' top (a band on the torso, g) shaded as the legs it runs into (LG: each leg's thigh as the legs below build
 * it - { P0 (its hip), d1 (down it, to the knee), L (the leg's length), tj (the knee's share), rad(t), back(t), ka(t, a)
 * }): near a leg's own surface - where that leg comes out of it - its normals that leg's round there (between the two
 * legs, both, weighted by how near each is): the two shaded as one surface, only the soft fold of the hip's crease
 * between them, never an edge of one piece on another -> g
 */
/**
 * Trousers' top (g) tucked a few millimetres in behind the legs below the hips, in front (LG: legBlend's legs; yH: the
 * hips' height; c(y): the torso's middle there): wherever it lies just outside a thigh's round it is drawn in under it -
 * the thighs' own cloth the front of each leg, the top seen only between them (the crotch's seam) and over the seat:
 * never a panel of it standing proud over the tops of the thighs -> g (its normals made again)
 */
function legTuck(g, LG, yH, fw, c) {
  const P = g.attributes.position, p = V(0, 0, 0), e = V(0, 0, 0), q = V(0, 0, 0);
  for (let i = 0; i < P.count; i++) {
    p.fromBufferAttribute(P, i); const wy = ss3(yH + 0.02, yH - 0.035, p.y); if (wy <= 0) continue;
    const ctr = c(p.y), fr = ss3(0.15, 0.6, e.copy(p).sub(ctr).setY(0).normalize().dot(fw)); if (fr <= 0) continue;
    let best = 9;
    for (const lg of LG) {
      const u = e.copy(p).sub(lg.P0).dot(lg.d1), t = Math.max(0, Math.min(lg.tj, u / lg.L));
      q.copy(lg.P0).addScaledVector(lg.d1, t * lg.L); e.copy(p).sub(q); if (u > 0) e.addScaledVector(lg.d1, -e.dot(lg.d1));
      best = Math.min(best, e.length() - lg.rad(t));
    }
    const k = wy * fr * Math.max(0, Math.min(0.012, 0.014 - best)) * ss3(0.03, 0.008, best); if (k <= 0) continue;
    e.copy(p).sub(ctr).setY(0).normalize(); P.setXYZ(i, p.x - e.x * k, p.y, p.z - e.z * k);
  }
  g.computeVertexNormals(); return g;
}
function legBlend(g, LG) {
  const P = g.attributes.position, N = g.attributes.normal, p = V(0, 0, 0), e = V(0, 0, 0), c = V(0, 0, 0), nn = V(0, 0, 0);
  for (const lg of LG) { lg.N = new THREE.Vector3().crossVectors(lg.d1, V(0, 0, 1)).normalize(); lg.B = new THREE.Vector3().crossVectors(lg.d1, lg.N); }
  for (let i = 0; i < P.count; i++) {
    p.fromBufferAttribute(P, i); nn.set(0, 0, 0); let best = 9;
    for (const lg of LG) {
      const u = e.copy(p).sub(lg.P0).dot(lg.d1), t = Math.max(0, Math.min(lg.tj, u / lg.L));
      c.copy(lg.P0).addScaledVector(lg.d1, t * lg.L).addScaledVector(lg.N, lg.back ? lg.back(t) : 0); e.copy(p).sub(c); if (u > 0) e.addScaledVector(lg.d1, -e.dot(lg.d1));
      const el = e.length(); if (el < 1e-6) continue; e.multiplyScalar(1 / el);
      const x = el - lg.rad(t) * (lg.ka ? lg.ka(t, Math.atan2(e.dot(lg.B), e.dot(lg.N))) : 1);
      best = Math.min(best, x); nn.addScaledVector(e, Math.exp(-Math.max(0, x) / 0.008));
    }
    const w = ss3(0.03, 0.004, best), l = nn.length(); if (w <= 0 || l < 1e-6) continue; nn.multiplyScalar(1 / l);
    const x = N.getX(i) + (nn.x - N.getX(i)) * w, y = N.getY(i) + (nn.y - N.getY(i)) * w, z = N.getZ(i) + (nn.z - N.getZ(i)) * w, m = Math.hypot(x, y, z) || 1; N.setXYZ(i, x / m, y / m, z / m);
  }
  return g;
}
/** lace: carried by its texture - the vertices left as they are; each piece laid out for it as she is finished (world/Lace.js: lacePiece) -> g */
const lacey = (g) => g;
/**
 * A boot's shaft (lp: the leg's hip, knee and ankle; lr: its radius; fm: her leg's form) from its top (t0: below the
 * knee, or over it) down into the shoe: the leg's own shape a little out from it - further off over its top few
 * centimetres, the leg never through it there - its top edge turned in to the leg, its foot closed in the shoe; round its
 * top a narrow rim, the leather turned in, a shade darker (ao: their shading) -> [shaft, rim]
 */
function bootShaft(lp, lr, fm, t0, ao = 1) {
  const L = lp[0].distanceTo(lp[1]) + lp[1].distanceTo(lp[2]), tE = t0 + 0.06 / L, R = (t) => lr(t) * (fm ? 1 + 0.6 * (fm.out(t) - 1) : 1) + 0.0035 + 0.0035 * ss3(tE, t0, t) + 0.0015 * ss3(t0 + 0.1, 1, t);
  const back = fm ? (t) => fm.back(t) + fm.hb(t) : null, ka = fm ? (t, a) => 1 + 0.4 * (fm.ka(t, a) - 1) : null;
  const shaft = tint(limbAlong(lp, R, { t0, t1: 1, k: Math.max(8, Math.round(22 * (1 - t0))), m: 16, dome: 'ab', capA: 0.4, back, ka }), ao);
  const rim = tint(limbAlong(lp, (t) => R(t) + 0.0014, { t0, t1: t0 + 0.008 / L, k: 2, m: 16, back, ka }), 0.74);
  return [shaft, rim];
}
/** a strappy sandal on a slim heel: her foot bare on a thin footbed, a strap over the toes and one over the instep, a fine one round the ankle -> { foot, shoe } */
function sandalAt(ankle) {
  const { foot } = courtShoe(ankle, 1), FP = [V(ankle.x - 0.01, 0.11, ankle.z), V(ankle.x + 0.105, 0.014, ankle.z), V(ankle.x + 0.17, 0.012, ankle.z)], fr = (t) => spline([[0, 0.03], [0.25, 0.028], [0.6, 0.024], [0.85, 0.02], [1, 0.012]], t)[0];
  const bed = limbAlong([V(ankle.x - 0.034, 0.088, ankle.z), V(ankle.x + 0.105, 0.0035, ankle.z), V(ankle.x + 0.182, 0.0035, ankle.z)], (t) => spline([[0, 0.026], [0.3, 0.027], [0.62, 0.03], [0.85, 0.027], [1, 0.016]], t)[0], { k: 12, m: 10, sq: 0.12, side: V(0, 0, 1), dome: 'ab' });
  const strap = (t0, t1) => limbAlong(FP, (t) => fr(t) + 0.0022, { t0, t1, k: 2, m: 12, sq: 0.66, side: V(0, 0, 1) });
  const ank = new THREE.TorusGeometry(0.034, 0.0028, n(5, 3), n(18, 8)); ank.rotateX(Math.PI / 2); ank.scale(1.05, 1, 0.95); ank.translate(ankle.x - 0.006, 0.128, ankle.z);
  const post = new THREE.CylinderGeometry(0.0072, 0.0042, 0.082, n(10), 1, false); post.translate(ankle.x - 0.044, 0.041, ankle.z);
  return { foot, shoe: [bed, post, strap(0.74, 0.8), strap(0.48, 0.53), ank] };
}
/** a heeled boot's vamp: its leather closed over the instep from the shaft down to the toe - no court shoe's opening on the foot -> geometry */
function bootVamp(ankle) {
  const FP = [V(ankle.x - 0.012, 0.118, ankle.z), V(ankle.x + 0.105, 0.016, ankle.z), V(ankle.x + 0.17, 0.013, ankle.z)], fr = (t) => spline([[0, 0.033], [0.25, 0.03], [0.6, 0.026], [0.85, 0.021], [1, 0.012]], t)[0];
  return limbAlong(FP, (t) => fr(t) + 0.0035, { t0: 0, t1: 0.74, k: 6, m: 12, sq: 0.74, side: V(0, 0, 1), dome: 'b' });
}
/**
 * jackets worn open (a coat buttoned to the chest): where each ends (f; a coat with its skirt, at the waist), its
 * opening's half-width round the front by f, its lapels (lapel: their width at the notch, rad; lapV: where they start,
 * at the top button), how far it stands off the body (out; flare: more toward its hem, over the seat; the sleeves' loose),
 * her (her own cut, closer to her figure: the top beneath it the closer too - top - a tailored blazer nipped in to the
 * waist, ending at the hip, a biker's cropped)
 */
const JACKETS = {
  blazer: { hem: -0.09, open: (f) => 0.06 + 0.5 * ss3(0.48, 0.97, f) + 0.26 * ss3(0.12, -0.09, f), lapel: 0.24, lapV: 0.47, out: 0.013, flare: 0.012, loose: 0.008, button: 1,
    her: { hem: -0.035, open: (f) => 0.05 + 0.48 * ss3(0.42, 0.97, f) + 0.2 * ss3(0.1, -0.035, f), lapel: 0.22, lapV: 0.44, out: 0.0105, flare: 0.003, loose: 0.006, top: 0.004, tuck: 1 } },
  leather: { hem: 0.0, open: (f) => 0.16 + 0.3 * ss3(0.62, 0.97, f), lapel: 0.15, lapV: 0.6, out: 0.015, flare: 0.012, loose: 0.01, her: { hem: 0.05, out: 0.0115, flare: 0.004, loose: 0.007, top: 0.004 } },
  bomber: { hem: 0.12, open: (f) => 0.2 + 0.12 * ss3(0.75, 0.97, f), out: 0.02, flare: 0.012, loose: 0.016, rib: 1, her: { out: 0.016, loose: 0.012 } },
  trench: { hem: -0.08, open: (f) => 0.03 + 0.44 * ss3(0.6, 0.97, f), lapel: 0.28, lapV: 0.5, out: 0.013, flare: 0.012, loose: 0.012, coat: 1 },
  // (an oversized blazer worn open over a bralette: long, boxy, dropped at the shoulder, wide open down the front)
  // (its body in fewer rows and columns - boxy, nothing of her figure to follow; its collar close round the neck as a
  // blazer's (nOut: how far off it stands there), never standing out at the nape)
  // (hers cut sharper: slim notched lapels, a padded shoulder squared out over the arm (sh), the body falling straight
  // and close - long, not a box)
  oversize: { hem: -0.13, open: (f) => 0.3 + 0.24 * ss3(0.55, 0.97, f), lapel: 0.22, lapV: 0.52, out: 0.022, flare: 0.016, loose: 0.02, nOut: 0.012, cols: 24, her: { hem: -0.11, lapel: 0.15, out: 0.015, flare: 0.007, loose: 0.012, top: 0.004, rows: 14, nOut: 0.0105, sh: 0.005 } },
};
/** trousers' cuts: [how much of the leg's own shape they follow, ease, the hem's radius] (wide: down to the floor) */
const CUTS = { skinny: [0.92, 0.004, 0.04], jeans: [0.75, 0.006, 0.05], straight: [0.5, 0.01, 0.058], wide: [0.3, 0.014, 0.115], suit: [0.45, 0.014, 0.06] };
// (the swimwear's own (world/Swimwear.js): a monokini's cut-outs, the shirts worn open over it, swim shorts' cut; and the
// helpers its pieces are built with - People's own, nothing of them copied)
Object.assign(HOLES, SW.SWIM_HOLES); Object.assign(JACKETS, SW.SWIM_JACKETS); CUTS.swim = SW.SWIM_CUT;
const SWH = { band, panel, limbAlong, loft, spline, courtShoe, n: (k, min) => n(k, min) };
/**
 * A skirt (a dress's, a coat's), sp: { hem: 'mini' (mid-thigh) | 'short' (above the knee) | 'knee' | 'midi' (mid-calf) |
 * 'floor', asym + side (on the diagonal: hem on one side, asym on the other, the long one on the side -side), flare (how
 * much wider it falls than the hips), cling (a fitted cut's: how closely it follows the legs), pleats, wrap (an overlap's
 * edge down its front), slit, bare (under a cropped top) }: from the waist (under its belt, or tucked under the bodice's
 * edge) close over the hips and the seat, then falling cleanly - drawn in, clinging or flaring as cut, soft folds toward
 * the hem, never in against the legs; a closed shell, the hem turned under; every ring holds both legs whatever the
 * stance -> geometry, or null when the legs are not under it (kneeling, sitting, walking)
 */
function skirt(J, F, T, sp, out0 = 0.005) {
  const kn = J.kneeR.clone().lerp(J.kneeL, 0.5), hip = J.hipR.clone().lerp(J.hipL, 0.5);
  // (stride: a short skirt held as one round both thighs in a step - a lined lace mini's - while each thigh is still
  // well below the hips)
  if (hip.y - kn.y < 0.3 || J.kneeR.distanceTo(J.kneeL) > (sp.stride ? 0.62 : 0.4) || (sp.stride && Math.min(J.hipR.y - J.kneeR.y, J.hipL.y - J.kneeL.y) < 0.28)) return null;
  const pl = sp.pleats || 0, M = pl && Q >= 0.6 ? pl * 3 : n(sp.m || (sp.slit ? (sp.slit < 1 ? 56 : 72) : 44), 10), angs = Array.from({ length: M }, (_, j) => (j / M) * 2 * Math.PI - Math.PI);
  // (each ring's points kept clear of the legs at its height - the thigh, the knee or the shin there, with room: the leg
  // as it is built, from just inside the hip's joint, slim at its top within the hips - no fullness pushed out at them)
  // (hers in her leg's own form: its bow, the hamstrings, its rounds at their fullest - legForm)
  const LR = {}; for (const s of ['R', 'L']) { const h = J['hip' + s].clone().setZ(J['hip' + s].z * (F.bust > 0 ? 0.94 : 0.86)), L1 = h.distanceTo(J['knee' + s]), tk = L1 / (L1 + J['knee' + s].distanceTo(J['ankle' + s])); LR[s] = [h, tk, legRad(F.leg, tk, F.bust > 0), F.bust > 0 ? legForm(F.leg, tk, s === 'R' ? -1 : 1) : null]; }
  // (above the hip's joint only the thigh's domed top, as the leg is built (limbAlong's dome, 0.85 of its radius high) -
  // rounding in to nothing: never a full thigh standing on up through the hips, pushing a low waist out off them)
  const legAt = (s, y) => { const [h, tk, lr, fm] = LR[s], k = J['knee' + s], a = J['ankle' + s], u = (y - h.y) / ((k.y - h.y) || -1), w = Math.max(0, Math.min(1, u)), t = w * tk; if (u <= 1) { const r0 = lr(t) * (fm ? fm.out(t) : 1) + 0.006 * Math.sin(Math.PI * w); return [h.clone().lerp(k, w).add(V(fm ? -fm.back(t) - fm.hb(t) : 0, 0, 0)), u < 0 ? r0 * Math.sqrt(Math.max(0, 1 - ((y - h.y) / (0.85 * r0)) ** 2)) : r0]; } return [k.clone().lerp(a, Math.min(1, (y - k.y) / ((a.y - k.y) || -1))), F.leg[2] + 0.02]; };
  const room = sp.over ? 0.016 : 0.012, clearOf = (c, y, e, r) => { for (const s of ['R', 'L']) { const [q, rr] = legAt(s, y), v = V(q.x - c.x, 0, q.z - c.z), pr = v.dot(e), pd = Math.hypot(v.x - pr * e.x, v.z - pr * e.z), R = rr + room; if (pd < R) r = Math.max(r, pr + Math.sqrt(R * R - pd * pd)); } return r; };
  // (fitted: the torso's own sections from the waist down over the hips and the seat, eased a little more as it goes -
  // less, the closer its cut - its top tucked just under the bodice's edge)
  // (its top edge turned in under the bodice's, into the waist: nothing to see into between them; just below that edge
  // nearly level with the bodice - one dress, hardly a step at its waist)
  // (under a cropped top (bare) its top edge tucked in to the skin of the waist instead)
  // (set lower (rise: its top's f - low-rise trousers, a skirt under hip cut-outs): its fitted rings from there down)
  const tu = sp.bare ? (sp.rise ? [sp.rise, 0.0015, 0.0035] : [0.272, -0.006, 0.001]) : [sp.rise || 0.29, Math.min(out0, 0.0055) - 0.003, Math.min(out0, 0.0055) - 0.002];
  // (a short one's fitted rings only down to a little above its hem (hTop: its highest) - none at or below it, where the
  // fall to the hem would fold back up on itself)
  const hTop = Math.max(...[sp.hem, sp.asym].filter(Boolean).map((h) => clubHemY(h, kn.y, hip.y - kn.y, kn.y - (J.ankleR.y + J.ankleL.y) / 2) ?? -9)) - (sp.drop || 0);
  const rings = (sp.rise ? [tu[0], sp.rise - 0.02, sp.rise - 0.035, ...[0.14, 0.08, 0.02, -0.04, -0.09].filter((f) => f < sp.rise - 0.06)] : [tu[0], 0.265, 0.25, 0.2, 0.14, 0.08, 0.02, -0.04, -0.09]).filter((f, i) => i < 3 || T.c(f).y > hTop + 0.04).map((f, i) => {
    // (set low (rise), its waistband and the ring just under it - its top three - on her hips as they are: a band sits on
    // the body, never pushed out by the legs beneath it (open at the sides to look down into), and flush with a bodice
    // ending over it - no ledge of skirt standing out under its hem; out over the thighs' tops only below that)
    const R = angs.map((a) => T.pt(f, a, i < 2 ? tu[i + 1] : out0 + 0.006 * (1 - 0.5 * (sp.cling || 0)) * ss3(0.25, -0.09, f))), c = T.c(f); if (f > 0.15 || (sp.rise && i < 3)) return R;
    // (clear of the legs - and bridging the dip between them in front and behind, as cloth over the tops of the thighs
    // does: never a groove down its middle, nor a pinch where it meets its fall below)
    const E = R.map((p) => { const d = V(p.x - c.x, 0, p.z - c.z), r = d.length(), e = d.normalize(); return [p.y, e, clearOf(c, p.y, e, r)]; }), nE = E.length;
    for (let it = 0; it < 4; it++) for (let j = 0; j < nE; j++) E[j][2] = Math.max(E[j][2], (E[(j + 1) % nE][2] + E[(j + nE - 1) % nE][2]) / 2);
    return E.map(([y, e, r]) => V(c.x, y, c.z).addScaledVector(e, r));
  });
  // (then falling: the last fitted ring's shape drawn in, or flaring, toward the hem; folds the fuller it is, or pleats)
  const R0 = rings[rings.length - 1], c0 = R0.reduce((s, p) => s.add(p), V(0, 0, 0)).multiplyScalar(1 / M);
  // (its hem a share of the thigh above the knee, or of the shin below it - or on the diagonal (asym): from the hem on one
  // side to asym's on the other, the long side away from the shoulder its neckline climbs to (sp.side): near straight
  // across the front, easing level toward the long side - rounded through its lowest, never a point there)
  // (micro: a hand's breadth under the seat's fold - the seat always covered; mini: high on the thigh; thigh: mid-thigh;
  // short: above the knee - Clubwear.hemY)
  const Lt = hip.y - kn.y, Ls = kn.y - (J.ankleR.y + J.ankleL.y) / 2, hemOf = (h) => clubHemY(h, kn.y, Lt, Ls) ?? kn.y - 0.12 * Ls;
  // (a sheer layer's: a little below the dress's own hem (drop), its edge not quite straight - a net's, a lace's (edge))
  const hm0 = hemOf(sp.hem) - (sp.drop || 0), hm1 = sp.asym ? hemOf(sp.asym) : hm0, hemAt = (a) => { const w = 0.5 - 0.5 * (sp.side || 1) * Math.sin(a); return hm0 + (hm1 - hm0) * (w + 0.8 * w * (1 - w)) + (sp.edge ? sp.edge * (0.6 * Math.sin(a * 9 + 0.7) + 0.4 * Math.sin(a * 23 + 2.1)) : 0); }, hemY = Math.min(hm0, hm1);
  const K = n(Math.round(5 + 12 * (c0.y - hemY) / 0.9), 3), fl = sp.flare || 0;
  const mid = (y) => legAt('R', y)[0].lerp(legAt('L', y)[0], 0.5);
  // (a wrapped skirt's slit (wrap and slit: a wrap gown's) where its overlap's free edge falls - on the side the neckline
  // leaves bare (sp.side the other), down from the crossover's knot; any other over the leg further forward)
  const fwd = J.kneeL.x - J.hipL.x > J.kneeR.x - J.hipR.x ? 'L' : 'R', slitAt = sp.wrap && sp.slit && sp.side ? -sp.side * 0.42 : Math.sign(J['knee' + fwd].z - hip.z || (fwd === 'L' ? 1 : -1)) * 0.42, slitTop = sp.slit > 0 && sp.slit < 1 ? Math.min(hm0 + sp.slit * Lt, kn.y + 0.64 * Lt) : kn.y + 0.52 * Lt;   // (a mini's slit (sp.slit < 1): that share of the thigh up from its hem, never up past the seat's fold)
  // (a fitted cut (cling) closer to the legs below the seat, from a share of the thigh down: toward their outline taken
  // together - the cloth bridging between them, never in between them - a flared one's only as far as the knee)
  const cg = sp.cling || 0, rm = 0.6 * room, clw = (y) => cg * ss3(0, 0.3 * Lt, c0.y - y) * (1 - Math.min(1, 3 * fl) * ss3(kn.y + 0.2 * Lt, kn.y - 0.3 * Ls, y));
  const hull = (c, y, e) => { const [[q1, r1], [q2, r2]] = [legAt('R', y), legAt('L', y)]; let r = 9; for (let k = 0; k < 36; k++) { const nx = Math.cos(k * Math.PI / 18), nz = Math.sin(k * Math.PI / 18), en = e.x * nx + e.z * nz; if (en > 0.2) r = Math.min(r, (Math.max(q1.x * nx + q1.z * nz + r1, q2.x * nx + q2.z * nz + r2) + rm - c.x * nx - c.z * nz) / en); } return r; };
  for (let i = 1; i <= K; i++) {
    const u = i / K, k = 1 - 0.11 * u * (1 - Math.min(1, fl * 4)) + fl * u ** 1.4 - (sp.taper || 0) * u;   // (taper: a pencil cut's, narrowing on to the legs toward its hem)
    // (a diagonal hem's long side falling a little freer and fuller: a soft drape at its corner, not a point)
    let pts = R0.map((p, j) => {
      const a = angs[j], lg = sp.asym ? (hemAt(a) - hm0) / (hm1 - hm0 || 1) : 0, y = c0.y + (hemAt(a) - c0.y) * u, m = mid(y), c = V(c0.x + (m.x - c0.x) * 0.6 * u, y, c0.z + (m.z - c0.z) * u), d = V(p.x - c0.x, 0, p.z - c0.z), r0 = d.length() * (1 + 0.07 * lg * u * u), e = d.normalize(), w = clw(y) * (1 - 0.55 * lg);
      let f = 1 + (1 - w) * (0.014 + 0.05 * fl) * (Math.sin(a * 7 + 1) + 0.5 * Math.sin(a * 11 + 2.3)) * u * u;
      if (pl) { const q = (((a + Math.PI) / (2 * Math.PI)) * pl) % 1; f += 0.035 * (Math.abs(q - 0.5) * 2 - 0.5) * ss3(0, 0.25, u); }
      // (slit too: the overlap's free edge from the knot at the waist curving down toward the slit, the front panel lying over
      // the one beneath - a clear step along it, the slit opening along that edge)
      if (sp.wrap && sp.slit && sp.side) { const aw = -a * sp.side, ed = 0.42 + 0.53 * (1 - u) ** 2; f += 0.028 * ss3(ed + 0.06, ed - 0.06, aw) * ss3(ed - 1.7, ed - 1.3, aw); }
      else if (sp.wrap) { const ed = 0.3 + 0.45 * u; f += 0.012 * ss3(ed - 0.06, ed + 0.06, a) * ss3(ed + 1.7, ed + 1.3, a); }
      const rb = r0 * k; return [e, clearOf(c, y, e, w > 0 ? rb + (hull(c, y, e) - rb) * w : rb) * f, c, y];
    });
    if (!pl) pts = pts.map(([e, r, c, y], j) => [e, Math.max(r, (pts[(j + 1) % M][1] + pts[(j + M - 1) % M][1]) / 2), c, y]);
    // (a slit up to mid-thigh over the leg further forward: the cloth parted either side of it, the leg through it)
    // (to a point at its top, opening wider toward the hem)
    // (its top one soft rounded apex - eased in over a good few centimetres, never a notch between two rings)
    if (sp.slit) pts = pts.map(([e, r, c, y], j) => { const wy = ss3(slitTop + 0.02, slitTop - 0.12, y), sw = 0.1 + 0.14 * ss3(slitTop, slitTop - 0.32, y); return [e, r * (1 - 0.55 * wy * gau(angs[j] - slitAt, sw)), c, y]; });
    // (wide trousers, standing: one fall of cloth, folded in along the seams between the legs, in front and behind)
    // (deeper toward the hem, where the two legs part)
    // (split 2: two legs read from the crotch down - its inseams folded in deeper, from higher up)
    // (split 2: below the knee nearly to the middle, the two legs parted toward the hem - wide trousers, never a maxi skirt)
    if (sp.split) pts = pts.map(([e, r, c, y], j) => { const s2 = sp.split > 1, wc = s2 ? ss3(hip.y - 0.08, hip.y - 0.2, y) * (0.24 + 0.62 * ss3(kn.y + 0.2, hemY + 0.04, y)) : ss3(hip.y - 0.1, hip.y - 0.26, y) * (0.07 + 0.3 * ss3(kn.y + 0.1, hemY, y)), sw = s2 ? 0.13 + 0.09 * ss3(kn.y + 0.1, hemY, y) : 0.13; return [e, r * (1 - wc * Math.max(gau(angs[j], sw), gau(Math.abs(angs[j]) - Math.PI, sw))), c, y]; });
    rings.push(pts.map(([e, r, c]) => c.clone().addScaledVector(e, r)));
  }
  const L = rings[rings.length - 1], cL = L.reduce((s, p) => s.add(p), V(0, 0, 0)).multiplyScalar(1 / M), inn = (k, dy) => L.map((p) => cL.clone().lerp(p, k).add(V(0, dy, 0)));
  // (a sheer's hem turned up only a little - a narrow doubled band seen through it, not a lip)
  rings.push(inn(0.965, 0.002), inn(0.955, sp.over && !sp.edge ? 0.014 : 0.05), Array(M).fill(cL.clone().add(V(0, sp.over && !sp.edge ? 0.02 : 0.06, 0))));
  const g = loft(rings);
  // (the seams' shade, down from between the legs)
  if (sp.split) { const P = g.attributes.position, C = new Float32Array(P.count * 3); for (let i = 0; i < P.count; i++) { const a = angs[i % M], y = P.getY(i), sw = sp.split > 1 ? 0.07 + 0.05 * ss3(kn.y + 0.1, hemY, y) : 0.07, k = 1 - (sp.split > 1 ? (0.5 + 0.15 * ss3(kn.y + 0.1, hemY, y)) * ss3(hip.y - 0.09, hip.y - 0.19, y) : 0.42 * ss3(hip.y - 0.12, hip.y - 0.24, y)) * Math.max(gau(a, sw), gau(Math.abs(a) - Math.PI, sw)); C[i * 3] = C[i * 3 + 1] = C[i * 3 + 2] = k; } g.setAttribute('color', new THREE.BufferAttribute(C, 3)); }
  return g;
}
/** a sleeve's (or a trouser leg's) colour per vertex: a shade darker in the crook of the joint, toward the body (ao) -> fn */
const crease = (P, k = 0.82) => (x, y, z) => { const d = Math.min(...P.map((p) => Math.hypot(x - p.x, y - p.y, z - p.z))); return k + (1 - k) * ss3(0.02, 0.09, d); };
/** a knit's ribs: every other column of a loft (m round) a shade darker -> g */
const ribbed = (g, m, k = 0.88) => { const C = g.attributes.color || tint(g, 1).attributes.color; for (let i = 0; i < C.count; i++) if ((i % m) % 2) C.setXYZ(i, C.getX(i) * k, C.getY(i) * k, C.getZ(i) * k); return g; };
/** a corset's boning: a seam a shade darker every few columns round it -> g */
const boning = (g, m, k = 0.74) => { const C = g.attributes.color || tint(g, 1).attributes.color; for (let i = 0; i < C.count; i++) if ((i % m) % 5 === 0) C.setXYZ(i, C.getX(i) * k, C.getY(i) * k, C.getZ(i) * k); return g; };
/** sequins: each vertex a little brighter or darker than the next, the light caught unevenly -> g */
const sparkle = (g) => { const C = g.attributes.color || tint(g, 1).attributes.color; for (let i = 0; i < C.count; i++) { const k = 0.85 + 0.3 *((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1; C.setXYZ(i, C.getX(i) * k, C.getY(i) * k, C.getZ(i) * k); } return g; };
/** a band's cloth edge turned in under it (its hem 'hi': the band's last ring, m round) a shade darker by k - the cloth's thickness read at its edge, where it meets the skin -> g */
const turnedIn = (g, m, k) => { const C = g.attributes.color || tint(g, 1).attributes.color; for (let i = C.count - m; i < C.count; i++) C.setXYZ(i, C.getX(i) * k, C.getY(i) * k, C.getZ(i) * k); return g; };
/** a sheet's colour (cols: its columns, panel's): k, its edge along v = 0 turned in a shade darker - its rim by e, the edge itself a little -> g */
const edgeIn = (g, cols, k, e) => { const W = cols + 3, C = tint(g, k).attributes.color; for (let i = 0; i < C.count; i++) { const j = i % W, q = j === 0 ? e : j === 1 ? 1 - 0.3 * (1 - e) : 1; if (q < 1) C.setXYZ(i, k * q, k * q, k * q); } return g; };
/**
 * Where her bare arms grow out of her shoulders (gs: the skin there - over the shoulders, and the arms laid on it; S: the
 * shoulders' joints; d: the deltoid's size): one light over all of it - each point's normal and colour the average of
 * every point's near it (within a share of d) facing much the same way, whichever surface it is on - so where one passes
 * under the other, at a shallow angle over the shoulder's round, no jagged line of light or shade between them; the
 * armpit's two sides (facing apart) kept apart. Fading out by 2.5 d from the joint -> nothing (gs changed in place)
 */
function joinLight(gs, S, d) {
  const r = 0.35 * d, s2 = 2 * (0.5 * r) ** 2, Rg = 2.5 * d, Pt = [], H = new Map(), key = (x, y, z) => `${Math.floor(x / r)},${Math.floor(y / r)},${Math.floor(z / r)}`, q = V(0, 0, 0);
  for (const g of gs) {
    const P = g.attributes.position, N = g.attributes.normal, C = g.attributes.color;
    for (let j = 0; j < P.count; j++) {
      q.fromBufferAttribute(P, j); const dS = Math.min(...S.map((s) => s.distanceTo(q))); if (dS > Rg + r) continue;
      const e = [g, j, q.x, q.y, q.z, N.getX(j), N.getY(j), N.getZ(j), C ? C.getX(j) : 1, C ? C.getY(j) : 1, C ? C.getZ(j) : 1, ss3(Rg, 0.7 * Rg, dS)], k = key(q.x, q.y, q.z);
      Pt.push(e); if (!H.has(k)) H.set(k, []); H.get(k).push(e);
    }
  }
  const out = Pt.map((e) => {
    if (e[11] <= 0) return null;
    const cx = Math.floor(e[2] / r), cy = Math.floor(e[3] / r), cz = Math.floor(e[4] / r); let nx = 0, ny = 0, nz = 0, cr = 0, cg = 0, cb = 0, sw = 0;
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) for (const f of H.get(`${cx + i},${cy + j},${cz + k}`) || []) {
      const dd = (f[2] - e[2]) ** 2 + (f[3] - e[3]) ** 2 + (f[4] - e[4]) ** 2, al = f[5] * e[5] + f[6] * e[6] + f[7] * e[7]; if (dd > r * r || al < 0.3) continue;
      const w = Math.exp(-dd / s2) * ss3(0.3, 0.7, al); nx += w * f[5]; ny += w * f[6]; nz += w * f[7]; cr += w * f[8]; cg += w * f[9]; cb += w * f[10]; sw += w;
    }
    return sw > 0 ? [nx, ny, nz, cr / sw, cg / sw, cb / sw] : null;
  });
  Pt.forEach((e, i) => {
    const o = out[i]; if (!o) return; const w = e[11], g = e[0], j = e[1], l = Math.hypot(o[0], o[1], o[2]) || 1, x = e[5] + (o[0] / l - e[5]) * w, y = e[6] + (o[1] / l - e[6]) * w, z = e[7] + (o[2] / l - e[7]) * w, m = Math.hypot(x, y, z) || 1;
    g.attributes.normal.setXYZ(j, x / m, y / m, z / m); const C = g.attributes.color; if (C) C.setXYZ(j, e[8] + (o[3] - e[8]) * w, e[9] + (o[4] - e[9]) * w, e[10] + (o[5] - e[10]) * w);
  });
}
/**
 * Her chest's shading above a low neckline, or inside a blazer dress's lapels (T: her torso; F: her figure; edge(a): the
 * cloth's edge (f) round her; out: how far the cloth there stands off the skin; fTop: the neck's seam; lum: her skin's
 * luminance) - a fitted dress's form, every measure a share of her own: a narrow crease down the midline between the
 * bust's rounds, deepest where the V's two edges close on it, fading up the breastbone; the cloth's contact shadow on
 * the skin right along its edge - a tight dark core, a short soft tail; the light caught along each round's upper curve,
 * either side of the crease. Shadows warm (the skin's own red kept), the light keeping the skin's own hue
 * -> (x, y, z, f, ang, e: the edge there, when known) -> [r, g, b] (f null: a point of the neck - the cloth's shadow only)
 */
function chestShade(T, F, edge, out, fTop, lum = 0.35) {
  // (the cloth's shadow: a tight, dark core where it presses on the skin (wC: a share of her torso's length, a little more
  // the further the cloth stands off) and a short soft tail beyond it (wS); the crease and the light caught deeper and
  // brighter over a fuller bust (bk), but less than in proportion - never a black line, never a pale patch)
  const N = 180, E = [], bk = Math.min(1.35, (F.bust / 0.055) ** 0.6), wC = 0.005 * T.H + 0.08 * out, aC = Math.min(0.62, 0.5 + 8 * out), wS = 0.012 * T.H + 0.35 * out, aS = 0.16;
  // (the light caught: less on fair skin (lum: the skin's own luminance) - already near white in a bright light - and less
  // again on deep skin: a share of its own tone lifted half again reads as a paler, coppery chest under a deeper face and
  // neck, the bare V a patch of other skin)
  const hk = bk * (1 - 0.5 * ss3(0.3, 0.7, lum)) * (1 - 0.4 * ss3(0.2, 0.05, lum)), sMin = 0.42 + 0.13 * ss3(0.3, 0.08, lum);
  // (the V: its point (fV) and how sharply its two edges close on it there (vn: 0 a straight or round neckline .. 1 a V);
  // the crease between the rounds deepest at that point - the more so the nearer it lies to their fullest - fading up the
  // breastbone over cL, by the bust's upper slopes. Lifted in a structured bodice (L: F.lift) the rounds higher (fA: their
  // fullest) and drawn in (c0: their middles) - their crease wherever they meet, whatever the V)
  const L = F.lift || 0, fA = (F.bf ?? 0.655) + 0.02 * L, c0 = 0.5 - 0.08 * L;
  const fV = Math.min(edge(0), fTop), vn = ss3(0.035, 0.11, (edge(0.22) + edge(-0.22) - 2 * edge(0)) / 0.44), cA = bk * (0.26 + 0.4 * vn) * gau(fV - fA - 0.025, 0.15), cL = 0.03 + 0.35 * Math.max(0, 0.83 - fV);
  for (let k = 0; k <= N; k++) { const a = -Math.PI + (2 * Math.PI * k) / N, f = edge(a); E.push(f < fTop - 0.004 ? T.pt(f, a) : null); }
  // (how near the edge comes: to the line through its points; a point well beyond its shadow's reach not measured)
  // (each piece of it: its start, its run, 1 / its length squared)
  const bb = new THREE.Box3().setFromPoints(E.filter(Boolean)).expandByScalar(5 * wS), S0 = [];
  for (let k = 0; k < N; k++) { const A = E[k], B = E[k + 1]; if (!A || !B) continue; const ux = B.x - A.x, uy = B.y - A.y, uz = B.z - A.z, L = ux * ux + uy * uy + uz * uz; S0.push(A.x, A.y, A.z, ux, uy, uz, L > 0 ? 1 / L : 0); }
  const SG = Float64Array.from(S0);
  const dist = (x, y, z) => {
    if (x < bb.min.x || x > bb.max.x || y < bb.min.y || y > bb.max.y || z < bb.min.z || z > bb.max.z) return Infinity;
    let m = Infinity;
    for (let i = 0; i < SG.length; i += 7) {
      const wx = x - SG[i], wy = y - SG[i + 1], wz = z - SG[i + 2], ux = SG[i + 3], uy = SG[i + 4], uz = SG[i + 5];
      let t = (wx * ux + wy * uy + wz * uz) * SG[i + 6]; t = t < 0 ? 0 : t > 1 ? 1 : t;
      const dx = wx - t * ux, dy = wy - t * uy, dz = wz - t * uz, q = dx * dx + dy * dy + dz * dz; if (q < m) m = q;
    }
    return Math.sqrt(m);
  };
  return (x, y, z, f, a, e = edge(a)) => {
    // (under the cloth - out of sight - or at its edge (e): as deep as its shadow goes; falling away softly from it)
    const d = f !== null && f <= e + 1e-4 ? 0 : dist(x, y, z), sD = 1 - (1 - aC * Math.exp(-d / wC)) * (1 - aS / (1 + (d / wS) ** 2) ** 2);
    let sS = 0, hL = 0, bS = 0, bH = 0;
    if (f !== null) {
      // (the crease: a narrow core down the midline - narrowest at the V's point, opening a little above - in a soft
      // skirt of the rounds' inner slopes turning away from the light)
      // (lifted: where the pressed rounds meet, a narrow, dark line from the cleavage's foot up between them, opening and
      // fading over their tops (tc: from their fullest); below, on a deep plunge, only a faint line down the breastbone)
      const t = Math.max(0, f - fV), sg = 0.022 + 0.11 * Math.min(t, 0.2), tc = f - fA, env = ss3(-0.08, -0.04, tc) * (1 - ss3(0.03, 0.1, tc)), sc = 0.017 + 0.045 * clamp01(tc + 0.04);
      sS = (1 - L) * cA * gau(t, cL) * (0.7 * gau(a, sg) + 0.3 * gau(a, 2.6 * sg)) * ss3(0.94, 0.84, f) + L * bk * (env * (0.46 * gau(a, sc) + 0.16 * gau(a, 3.2 * sc)) + 0.1 * gau(a, 0.045) * ss3(fV, fV + 0.05, f) * ss3(fA - 0.03, fA - 0.1, f));
      // (the light caught along each round's upper curve - lifted, drawn in toward the middle - its inner side and top,
      // where it turns up toward the light, either side of the crease; more faintly over the whole upper slope; none
      // below its fullest)
      const dx = (Math.abs(a) - c0 + 0.1) / 0.26, dy = (f - fA - 0.015) / 0.1, rho = Math.hypot(dx, dy), cr = gau(rho - 0.85, 0.3) * ss3(0.15, 0.85, (0.94 * dy - 0.34 * dx) / Math.max(rho, 0.05));
      const u = (f - fA) / 0.13, lat = gau(Math.abs(a) - c0, 0.3) + 0.45 * gau(a, 0.5) * (1 - gau(Math.abs(a) - c0, 0.3));
      hL = hk * ((0.42 + 0.12 * L) * cr + (u > 0 ? 0.08 * 2.33 * u * Math.exp(-u * u) * lat : 0));
      // (her bare back - a halter's, an open back's: the spine's groove down its middle (deepest low in the back), each
      // shoulder blade's round catching the light, a soft shadow along its lower, inner edge - all by angle from the spine
      // and height up her torso, shares of her own; never a flat, pale plane)
      const bq = Math.PI - Math.abs(a);
      if (bq < 1.4) {
        const uB = ((bq - 0.55) / 0.3) ** 2 + ((f - 0.81) / 0.1) ** 2;
        bS = 0.4 * gau(bq, 0.1) * ss3(fTop - 0.01, fTop - 0.1, f) * (0.65 + 0.35 * ss3(0.62, 0.42, f)) + 0.32 * gau(Math.sqrt(uB) - 1, 0.3) * clamp01(0.35 + 0.7 * (0.55 - bq) / 0.3 + 0.9 * (0.81 - f) / 0.1) + 0.13 * gau(bq, 0.4) * ss3(0.66, 0.46, f);
        bH = 0.15 * Math.exp(-1.5 * uB);
      }
    }
    // (the deepest of it a share of her own skin's colour, never near black - eased toward that floor, not cut at it: a
    // little more of her own tone kept on deep skin, where a dark share of an already deep colour reads as black)
    const s0 = (1 - sD) * (1 - sS) * (1 - bS), s = s0 + sMin * (1 - s0) ** 2.4, h = 1 + hL + bH;
    return [s ** 0.8 * h ** 0.96, s * h, s ** 1.18 * h];
  };
}

/**
 * A person: { group, head (its own group, for nodding; null when headless), bow, neck, headTop, wrR (the body's own
 * points), mats, restyle(patch) (changed in place where it can be - her make-up, the colours, the metal: see restyle),
 * dispose() }. Rebuilt leak-free (the new one first, then the old one disposed): rebuildPerson.
 * o: { pose: 'kneel' | 'mourn' | 'talk' | 'cheer' | ... | 'guard' | 'shove' | 'stagger' | 'restrain' | 'held' | 'pose' (an
 *      unknown one: 'talk'), kit: 'suit' | 'polo' | 'jacket' | 'marshal' or one of the clothes (OUTFITS: 'dress', 'gown',
 *      'slip', 'wrap', 'knit', 'tennis', 'trench', 'jumpsuit', 'pantsuit', 'blazer', 'coord', 'leather', 'bomber',
 *      'sweater', 'athleisure', 'casual', and a night out's: 'bodycon', 'slitgown', 'halter', 'bardot', 'corset', 'cropset',
 *      'croppants', 'sequin', 'oneshoulder' (cut on the diagonal, its hem too), 'blazerdress' (a belted blazer worn as a
 *      short dress, lapels in a deep V), and a gala's: 'plunge' (a halter mini plunging below the bust, shoulders and back bare, its skirt flared),
 *      'wrapgown' (one shoulder, wrapped over and slit high, a sash), 'galaslip' (a bias-cut slip to the floor) - a skirt
 *      falling free only standing, DRESS_POSES; in any other pose over the thighs, the legs bare below it; wide trousers
 *      standing fall as one to the floor), fabric ('satin' | 'velvet' | 'crepe' | 'sequin' | 'leather': the kit made in
 *      it - FABRICS), cut ({ neck, sleeve, hem, asym, slit, flare, cling, wrap }: the kit cut her own way - applyCut),
 *      clubwear (CLUB_KITS, hers; CLUB_KITS_M, his: OUTFITS), shoe (the kit's shoes swapped - SHOE_KINDS: 'heel',
 *      'sandal', 'kneeboot', 'thighboot' hers; 'trainer', 'boot', 'shoe'),
 *      shoeFinish ('patent' | 'satin' | 'matte' | 'suede' | 'metallic' - SHOE_FINISH_KEYS), jewel ({ metal: 'auto' |
 *      'gold' | 'silver' | 'rose', earrings: 'drop' | 'stud' | 'hoop' | 'long', chain (boolean: over the kit's own),
 *      choker: 'metal' | 'ribbon', cuffs: 0..2, clutchColor, clutchMetal }),
 *      color (the team's; the clothes' own colour), accent (the top beneath a jacket, a belt, trims), legs (trousers,
 *      jeans; under a skirt, sheer tights of that colour - none: bare legs), cap (a team cap), jitter, driver (a driver's
 *      name: their skin tone, hair and face, DRIVER_LOOKS), seed (anyone else's face, the same every time), skin, hair,
 *      style ({ hs, fh, len, wid, jaw, lip: true or a colour, makeup (a look's name, { look, lip }, or a make-up spec:
 *      { look, liner: { thickness, wing, angle, color }, lashes: { volume }, shadow: { intensity, color, under }, lips:
 *      { fill, liner, ombre, gloss }, sculpt: { contour, highlight, blush, blushColor, dew }, brows } - MK_SPEC), fringe
 *      (boolean), tendrils (0..2 each side, or boolean), tone ({ root, ends, melt (m), strands 0..2 }), shine 0..1 }),
 *      figure ('f': a woman's), build ('athletic', 'slim', 'broad', 'average' - by default a driver's athletic, hers slim,
 *      a mechanic's or a marshal's broad), acc (['shades' (sunglasses worn), 'shadesUp' (pushed up on the head),
 *      'lanyard' (a paddock pass), 'watch', 'clutch', 'bag' (a mini bag on a chain), 'earrings', 'choker', 'cuff', 'cuffs']), shoes (their colour), teamName (on the chest), crewHelmet (a pit-crew helmet instead of a face),
 *      headless (the body only: no head built), segQ, detail (lighter: a crowd's template, world/Crowd.js - no paint on
 *      the face) }
 */
export function makePerson(o = {}) {
  Q = o.segQ || 1; DEWY = o.figure === 'f';
  try { return buildPerson(withLook(o)); } finally { Q = 1; DEWY = false; }
}
/**
 * A person built again with new options, leak-free: the new one first (a face's paint they share never let go in
 * between), stood where the old one stood - its place, its turn, its scale, shown or not, in the same parent - then the
 * old one disposed; after(p): the caller's own touches (a scene's night lift, its light) -> the new person
 */
export function rebuildPerson(old, o, after) {
  const p = makePerson(o), g = old?.group;
  if (g) { p.group.position.copy(g.position); p.group.quaternion.copy(g.quaternion); p.group.scale.copy(g.scale); p.group.visible = g.visible; const par = g.parent; if (par) { par.add(p.group); par.remove(g); } }
  old?.dispose?.(); after?.(p); return p;
}
/** her hair styles (a style editor's): worn down, pulled up, short */
export const HAIR_STYLES_F = Object.freeze(['blowout', 'waves', 'long', 'curlyLong', 'highpony', 'ponytail', 'topknot', 'bun', 'curlybun', 'messybun', 'bob', 'pixie']);
const HAIR_STYLES_M = ['short', 'buzz', 'side', 'quiff', 'swept', 'curly', 'wavy', 'locs', 'mullet'];
/**
 * A style of her own (a save's, a style editor's), made safe to build - every value checked, kept to its range and step
 * (the step it is painted at: what is stored is what is seen), anything unknown dropped, never a throw -> { makeup, hair:
 * { hs, color, tone: { root, ends, melt, strands }, tendrils, fringe, shine }, wear: { kit, color, accent, legs (null:
 * bare), shoes, fabric, shoeFinish, cut }, jewel: { metal, earrings, chain, choker, cuffs, clutchColor, clutchMetal }, acc:
 * { earrings, clutch } } (empty parts left out). Its top-level fabric, shoeFinish and cut are taken as the wear's
 */
export function sanitizeStyle(s) {
  try {
    if (!s || typeof s !== 'object') return {};
    const out = {}, num = (v, lo, hi, st) => (typeof v === 'number' && isFinite(v) ? q2(qN(v, st, lo, hi)) : undefined), en = (v, L) => (L.includes(v) ? v : undefined), bool = (v) => (typeof v === 'boolean' ? v : undefined);
    const put = (o, k, v) => { if (v !== undefined) o[k] = v; }, some = (o) => Object.keys(o).length > 0;
    // make-up: a look's name, or a spec - each measure at its step, each colour at its 5 bits
    const m = s.makeup;
    if (typeof m === 'string') { if (LOOKS[m]) out.makeup = m; }
    else if (m && typeof m === 'object') {
      const M = {}; put(M, 'look', LOOKS[m.look] ? m.look : undefined); put(M, 'lip', qHex(m.lip) || undefined); put(M, 'brows', en(m.brows, BROW_KEYS));
      for (const g in MK_SPEC) {
        const src = m[g]; if (!src || typeof src !== 'object') continue; const G = {};
        for (const f in MK_SPEC[g]) { const [, a, b, st] = MK_SPEC[g][f], v = src[f]; if (a === 'hex') { if (v === null) G[f] = null; else put(G, f, qHex(v) || undefined); } else if (v === null && f === 'angle') G[f] = null; else put(G, f, num(v, a, b, st)); }
        if (some(G)) M[g] = G;
      }
      if (some(M)) out.makeup = M;
    }
    // hair
    const h = s.hair;
    if (h && typeof h === 'object') {
      const H = {}; put(H, 'hs', en(h.hs, [...HAIR_STYLES_F, ...HAIR_STYLES_M])); put(H, 'color', qHex(h.color) || undefined); put(H, 'fringe', bool(h.fringe)); put(H, 'shine', num(h.shine, 0, 1, 0.05));
      if (typeof h.tendrils === 'boolean') H.tendrils = h.tendrils ? 2 : 0; else put(H, 'tendrils', num(h.tendrils, 0, 2, 1));
      if (h.tone === null) H.tone = null;
      else if (h.tone && typeof h.tone === 'object') { const T = {}; put(T, 'root', qHex(h.tone.root) || undefined); put(T, 'ends', qHex(h.tone.ends) || undefined); put(T, 'melt', num(h.tone.melt, 0.02, 0.2, 0.01)); put(T, 'strands', num(h.tone.strands, 0, 2, 0.05)); if (T.root || T.ends || T.strands !== undefined) H.tone = T; }
      if (some(H)) out.hair = H;
    }
    // what she wears
    const w = { ...(s.wear && typeof s.wear === 'object' ? s.wear : {}) }; for (const k of ['fabric', 'shoeFinish', 'cut']) if (s[k] !== undefined && w[k] === undefined) w[k] = s[k];
    {
      const W = {}; put(W, 'kit', en(w.kit, OUTFIT_KITS)); for (const k of ['color', 'accent', 'shoes']) put(W, k, qHex(w[k]) || undefined);
      if (w.legs === null) W.legs = null; else put(W, 'legs', qHex(w.legs) || undefined);
      put(W, 'fabric', en(w.fabric, FABRICS)); put(W, 'shoeFinish', en(w.shoeFinish, SHOE_FINISH_KEYS)); put(W, 'shoe', en(w.shoe, SHOE_KINDS));
      const c = w.cut;
      if (c && typeof c === 'object') {
        const C = {}; put(C, 'neck', en(c.neck, CUT_NECKS)); put(C, 'sleeve', num(c.sleeve, 0, 1, 0.01)); put(C, 'hem', en(c.hem, HEMS));
        if (c.asym === null || c.asym === false) C.asym = null; else put(C, 'asym', en(c.asym, HEMS));
        put(C, 'flare', num(c.flare, 0, 0.5, 0.01)); put(C, 'cling', num(c.cling, 0, 0.7, 0.01)); for (const k of ['slit', 'wrap']) put(C, k, c[k] === 1 || c[k] === 0 ? !!c[k] : bool(c[k]));
        if (some(C)) W.cut = C;
      }
      if (some(W)) out.wear = W;
    }
    // jewellery
    const j = s.jewel;
    if (j && typeof j === 'object') {
      const J = {}; put(J, 'metal', j.metal === 'auto' ? 'auto' : en(j.metal, METAL_FINISHES)); put(J, 'earrings', en(j.earrings, ['drop', 'stud', 'hoop', 'long'])); put(J, 'chain', bool(j.chain));
      if (j.choker === false || j.choker === null) J.choker = false; else put(J, 'choker', en(j.choker, ['metal', 'ribbon']));
      put(J, 'cuffs', num(j.cuffs, 0, 2, 1)); put(J, 'clutchColor', qHex(j.clutchColor) || undefined); put(J, 'clutchMetal', en(j.clutchMetal, METAL_FINISHES));
      if (some(J)) out.jewel = J;
    }
    // what she carries and wears beyond them: earrings, a clutch - on or off
    const a = s.acc;
    if (a && typeof a === 'object' && !Array.isArray(a)) { const A = {}; put(A, 'earrings', bool(a.earrings)); put(A, 'clutch', bool(a.clutch)); if (some(A)) out.acc = A; }
    return out;
  } catch (e) { return {}; }
}
/**
 * Her carriage standing at ease (IDLE_POSES; J: the pose's joints, changed in place; F: her figure; seed: her own): tall -
 * the body above the hips brought upright over them, a touch back, the chest lifted; the shoulders back, never rolled
 * forward of the chest's middle. And her weight on one foot - the same one for the same person ('pose' has its own, on
 * the right): the hips shifted toward the standing foot, its hip up and the other down; that leg straight, its foot drawn
 * in under her; the free knee bent forward and in as far as its hip's drop asks, its foot a little ahead; above the waist
 * the shoulders tilted against the hips, the standing side's lower. Every move a share of her own measures (the hips'
 * span, the leg's length, the chest's depth); the hips' sections roll with them (F.roll: torsoOf)
 */
function idleStance(J, F, pose, seed) {
  const UPB = ['torsoB', 'neck', 'head', 'shR', 'shL', 'elR', 'elL', 'wrR', 'wrL'], A = J.torsoA.clone(), up = J.torsoB.clone().sub(A);
  for (const k of UPB) J[k].sub(A).applyAxisAngle(V(0, 0, 1), Math.atan2(up.x, up.y) + 0.01).add(A);
  // (the shoulders' joints a share of the chest's depth behind the torso's line - back, never rolled forward; the arms
  // back with them)
  const B = J.torsoB, chD = 2 * spline(F.tor, 0.72)[1];
  for (const s of ['R', 'L']) { const sh = J['sh' + s], dx = Math.min(0, A.x + (B.x - A.x) * (sh.y - A.y) / (B.y - A.y) - 0.06 * chD - sh.x); for (const k of ['sh', 'el', 'wr']) J[k + s].x += dx; }
  F.roll = 1;
  if (pose === 'pose') return;
  const ws = (seed >>> 7) & 1 ? 1 : -1, W = ws > 0 ? 'L' : 'R', E = ws > 0 ? 'R' : 'L', hW = J['hip' + W], hE = J['hip' + E], kW = J['knee' + W], kE = J['knee' + E], aW = J['ankle' + W], aE = J['ankle' + E];
  const hz = Math.abs(hW.z - hE.z) / 2, Lw = hW.distanceTo(aW), L1 = hE.distanceTo(kE), L2 = kE.distanceTo(aE), kt = (kW.y - hW.y) / (aW.y - hW.y), kx = kW.x - (hW.x + (aW.x - hW.x) * kt), hy = (hW.y + hE.y) / 2;
  // (the hips toward the standing side; the body above them turned about them the other way, its shoulder lower - the
  // hands on the hips going with the hips)
  for (const k of ['pelvis', 'torsoA', 'hipR', 'hipL', ...UPB]) J[k].z += ws * 0.3 * hz;
  hW.y = hy + 0.07 * hz; hE.y = hy - 0.07 * hz;
  const A2 = J.torsoA.clone();
  for (const k of UPB) if (k[0] !== 'w' || J[k].y > A2.y) J[k].sub(A2).applyAxisAngle(V(1, 0, 0), ws * 0.035).add(A2);
  // (the standing leg straight down to its foot, drawn in under her - the body as high as that leg is long)
  aW.z = ws * 0.45 * Math.abs(aW.z);
  const dv = hW.clone().sub(aW), dy = Math.sqrt(Math.max(0, Lw * Lw - dv.x * dv.x - dv.z * dv.z)) - dv.y;
  for (const k of Object.keys(J)) if (J[k] instanceof THREE.Vector3 && !DIRS.has(k) && !k.startsWith('ankle')) J[k].y += dy;
  kW.copy(hW).lerp(aW, kt).add(V(kx, 0, 0));
  aE.x += 0.04 * Lw;
  kE.copy(midJoint(hE, aE, L1, L2, V(1, 0, ws * 0.35)));
  // (her shoulders' joints are spread by her figure (F.sh) about the ground's middle: their middle set so that, spread,
  // it is on the torso's own line - wherever her hips have carried it - each shoulder as far out from it as the other)
  const tA = J.torsoA, tB = J.torsoB, ys = (J.shR.y + J.shL.y) / 2, dz = (tA.z + (tB.z - tA.z) * (ys - tA.y) / (tB.y - tA.y)) / F.sh - (J.shR.z + J.shL.z) / 2;
  J.shR.z += dz; J.shL.z += dz;
}
function buildPerson(o) {
  const pose = POSES[o.pose || 'mourn'] ? o.pose || 'mourn' : 'talk', J = POSES[pose](), jit = o.jitter ?? 0.02, r = () => (Math.random() - 0.5) * 2 * jit;
  for (const k of Object.keys(J)) if (J[k] instanceof THREE.Vector3 && !k.startsWith('ankle') && k !== 'pelvis' && !DIRS.has(k)) J[k].add(V(r(), r() * 0.5, r() * 0.5));
  // (the kit as she wears it: cut and made her own way - o.cut, o.fabric)
  const fem = o.figure === 'f', kit = o.kit || 'suit', fabric = FINISHES[o.fabric] ? o.fabric : null, OF = OUTFITS[kit] ? applyCut(OUTFITS[kit], o.cut, fabric) : null;
  // (her own curves (o.curves: { bust, seat } shares of her build's, or one number - a star's own, Celebs); else a little
  // more or less of each from her seed - no two women in a crowd quite alike)
  const cvOf = () => { if (o.curves != null) return o.curves; if (o.seed == null) return null; let h = 17; for (const ch of String(o.seed)) h = (h * 131 + ch.charCodeAt(0)) >>> 0; return { bust: 0.9 + 0.22 * ((h % 97) / 96), seat: 0.88 + 0.28 * (((h >>> 9) % 89) / 88) }; };
  const build = o.build || (fem ? 'slim' : o.driver || kit === 'suit' ? 'athletic' : kit === 'polo' || kit === 'marshal' ? 'broad' : 'average'), F = figureOf(fem ? 'f' : 'm', build, fem ? cvOf() : null);
  // (the shoes: the kit's, or her own for it (o.shoe: SHOE_KINDS) - strappy sandals, boots to the knee or over it)
  const SHK = OF ? (SHOE_KINDS.includes(o.shoe) ? o.shoe : OF.shoe) : null;
  // (the person's own numbers - a face, a stance: from the driver's name, a seed, or chance - worked out once, when first needed)
  let SEED = null; const seedOf = () => SEED ?? (SEED = (() => { let h = 11; for (const ch of String(o.seed ?? (o.driver || Math.random()))) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; })());
  if (fem) {
    // (a woman's stance: the knees and feet nearer together, the arms nearer the body; standing, her legs and her neck a little longer)
    for (const s of ['R', 'L']) { J['hip' + s].z *= 0.85; J['knee' + s].z *= 0.8; J['ankle' + s].z *= 0.75; J['el' + s].z *= 0.94; J['wr' + s].z *= 0.94; }
    if (J.pelvis.y > 0.85) for (const k of Object.keys(J)) if (J[k] instanceof THREE.Vector3 && !DIRS.has(k) && !k.startsWith('ankle')) J[k].y += k.startsWith('knee') ? 0.014 : k === 'neck' || k === 'head' ? 0.034 : 0.028;
    // (her arms a model's, each segment a share longer than the pose's (ARM_F): the hand where the pose puts it - on a hip,
    // clasped, at the ear - its elbow found again for the longer arm, bent the way it was; an arm held straight reaching
    // the further - hanging, the fingertips to mid-thigh)
    for (const s of ['R', 'L']) {
      const S = J['sh' + s].clone().setZ(J['sh' + s].z * F.sh), E = J['el' + s], W = J['wr' + s], l1 = S.distanceTo(E), l2 = E.distanceTo(W);
      if (S.distanceTo(W) > 0.97 * (l1 + l2)) { const e2 = E.clone().sub(S).multiplyScalar(ARM_F[0]).add(S); W.sub(E).multiplyScalar(ARM_F[1]).add(e2); E.copy(e2); }
      else { const u = W.clone().sub(S).normalize(), b = E.clone().sub(S); b.addScaledVector(u, -b.dot(u)); E.copy(midJoint(S, W, ARM_F[0] * l1, ARM_F[1] * l2, b.lengthSq() > 1e-8 ? b.normalize() : V(-1, 0, 0))); }
    }
    // (her spine's curve the more for heels: torsoOf; her bust lifted in a structured bodice - a kit built so (LIFT_KITS,
    // or one of its own: OF.lift), cut to its neckline: torsoOf, chestShade)
    F.arch = HEELS.has(SHK) ? 1 : 0.75; F.lift = (LIFT_KITS.has(kit) || OF?.lift) && LIFT_NECKS.has(OF?.neck) ? 1 : 0;
    if (IDLE_POSES.has(pose)) idleStance(J, F, pose, seedOf());
  }
  // ---- the head's shape, and the neck in proportion to it ----
  const DL = o.driver ? lookOf(o.driver) : null, ST = o.style || DL?.style || lookOf(String(Math.random())).style;
  const FS = (() => { const sd = seedOf(), vary = (k) => (((sd >>> k) % 100) / 100 - 0.5); return { fem, len: ST.len || 1, wid: ST.wid || 1, jaw: ST.jaw ?? 0.22 + vary(3) * 0.1, nose: (fem ? 0.125 : 0.17) * (ST.nose ?? (1 + vary(5) * 0.35)), lip: ST.lip ? 1.15 : 1, sock: fem ? (o.segQ ? 0.055 : 0.085) : 0.04, brow: (fem ? 0.026 : 0.03) * (ST.brow ?? 1), cheek: (fem ? (o.segQ ? 0.04 : 0.05) : 0.028) * (ST.cheek ?? 1), chin: (fem ? (o.segQ ? 0.045 : 0.085) : 0.04) * (ST.chin ?? 1), muz: fem && !o.segQ ? 0.045 : 0 }; })();
  const NK = neckOf(FS, F, fem);
  // ---- the shoulders' girdle, the trapezius and the neck's base: from the pose's own shoulders ----
  // (every height in shares of the deltoid (dl) and of the shoulders' span (sz) against the neck's flared base (NK.rS):
  // over the joint the deltoid's round, closing in to the top of the shoulder (the acromion - the collarbones' line);
  // from there the trapezius rising toward the neck, steeper near it, to the seam where the neck's flare meets it -
  // its rise a share of how far it runs (to where its line reaches the neck: NK.rJ), more for her sloping shoulders;
  // above the seam the torso closes inside the neck)
  const tH = J.torsoA.distanceTo(J.torsoB) + 0.24, tAx = new THREE.Vector3().subVectors(J.torsoB, J.torsoA).normalize(), fOf = (p) => (p.clone().sub(J.torsoA).dot(tAx) + 0.11) / tH;
  const fJ = fOf(J.shR.clone().lerp(J.shL, 0.5)), sz = SH_Z * F.sh, dl = F.del, fAc = fJ + 0.66 * dl / tH, fSeam = fAc + (fem ? 0.55 : 0.5) * (sz - NK.rJ) / tH;
  // (where a collar comes to in front: down from the seam toward the collarbones - its plackets end there)
  const fFront = fSeam - 0.6 * (fSeam - fAc) - 0.01;
  // (his tops' rows gathered over his shoulders' round - from the armpit up over the deltoid to the acromion, a share of
  // the deltoid either side of the joint - two and a half times as close there: band's / panel's curv)
  const shD = (f) => 1 + 1.5 * gau(f - fJ + (0.1 * dl) / tH, (0.6 * dl) / tH);
  // (the neck's foot at the seam, fitted to the chest it rises from: its middle a little back of the chest's, as deep as
  // the chest there (its back near the line of the upper back) but no deeper than the neck's own flare (NK.dS) - the
  // chest's front and the upper back coming in to it below the seam, the throat's base back from the chest's front;
  // nS: { D (half its depth there), x (its middle), m (how far inside the torso it is kept, deeper below the seam) })
  const d0 = (F.tor.find((r) => r[0] === 0.83) || F.tor[F.tor.length - 1])[2] * 0.8, nS = { D: Math.min(0.92 * d0, NK.dS), x: -0.006 - 0.08 * d0, m: 0.03 * NK.rS };
  {
    // (the shoulder's round: a quarter of an ellipse over the deltoid, from beside the joint up to the acromion - over the
    // top of the arm, whose own cap stays under it)
    // (hers out over the whole top of the arm, and as far back or forward as the joints are (xJ: their middle, in the
    // torso's own frame - carried back by her carriage) - each section grown to hold both, its chest's front where it was;
    // easing back to the neck's toward the seam: the arm grows out of it (T.arms))
    const xJ = J.shR.clone().lerp(J.shL, 0.5).sub(J.torsoA).dot(V(1, 0, 0).applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, tAx)));
    const held = (f, w, dd, xo, k = 1) => (fem ? [f, w, dd + k * Math.abs(xo - xJ) / 2, xo + k * (xJ - xo) / 2] : [f, w, dd, xo]);
    let rows;
    if (fem) {
      // (hers one curve, seen from the front: from the deltoid's fullest, a little below the joint (hW), a broad round (rd,
      // a share of the deltoid) over the top of the arm, on up the trapezius' slope - al, the slope that reaches the neck -
      // and turning up into the neck's own flare at the seam, at its slope there (be): no corner anywhere along it, no
      // shelf; under the fullest it curves on in toward the armpit, inside the arm - a share of the deltoid below it (fU)
      // the chest's own side, no wider than the chest or the joints: the arm's own round carries the shoulder's on down
      // (T.arms), a bodice's edge under the arm lying on her side, not out over the arm. Each section as deep and as far
      // forward as its height asks: the chest's, the deltoid's, the acromion's (hA up), the neck's)
      const hA = 0.66 * dl, hW = -0.4 * dl, hS = (fSeam - fJ) * tH - hW, rd = 1.2 * dl, zc = sz + 0.95 * dl - rd, P0 = NK.prof(Math.max(NK.Lv + 0.5 * NK.chin - (fSeam - fAc) * tH, 0.6 * NK.rTop)), be = Math.atan2(0.004, P0.r(0) - P0.r(0.004));
      let al = Math.atan2(hS, zc + rd - NK.rS);
      for (let i = 0; i < 8; i++) { const te = Math.PI / 2 - al; al = Math.atan2(hS - rd * Math.sin(te), zc + rd * Math.cos(te) - NK.rS); }
      const te = Math.PI / 2 - al, E = [zc + rd * Math.cos(te), rd * Math.sin(te)], SN = [NK.rS, hS], L = Math.hypot(E[0] - SN[0], SN[1] - E[1]);
      const C1 = [E[0] - 0.35 * L * Math.cos(al), E[1] + 0.35 * L * Math.sin(al)], C2 = [SN[0] + 0.1 * L * Math.cos(be), SN[1] - 0.1 * L * Math.sin(be)];
      const bz = (u) => { const v = 1 - u; return [0, 1].map((k) => v * v * v * E[k] + 3 * v * v * u * C1[k] + 3 * v * u * u * C2[k] + u * u * u * SN[k]); };
      const row = ([z, h0]) => { const h = h0 + hW, s = clamp01((h - hA) / (hS + hW - hA)), b = clamp01(h / hA); return held(fJ + h / tH, z, h < hA ? d0 * (1.15 - 0.15 * b) : d0 + (nS.D - d0) * s, h < hA ? -0.002 - 0.004 * b : -0.006 + (nS.x + 0.006) * s, 1 - s); };
      const fU = fJ + (hW - 0.85 * dl) / tH, cU = spline(F.tor, fU);
      rows = [held(fU, Math.max(cU[0], sz - 0.1 * dl), cU[1], cU[2]), ...[...[-0.25, 0, 0.3, 0.6, 0.85, 1].map((u) => [zc + rd * Math.cos(te * u), rd * Math.sin(te * u)]), ...[0.3, 0.55, 0.75, 0.88, 0.96].map(bz)].map(row)];
    } else {
      // (his round on down below the joint too, curving in to the chest's own side under the arm (fU, a share of the
      // deltoid below it) - inside the arm there: no corner of the shoulder jutting out past the sleeve's top)
      const fU = fJ - 0.85 * dl / tH, cU = spline(F.tor, fU), lw = (th) => -Math.sin(th);
      rows = [[fU, Math.max(cU[0], sz - 0.25 * dl), cU[1], cU[2]], ...[-1, -0.5].map((th) => [fJ + 0.66 * dl * Math.sin(th) / tH, sz + 0.8 * dl * Math.cos(th), d0 * 1.15 + (cU[1] - d0 * 1.15) * lw(th) ** 2, -0.002 + (cU[2] + 0.002) * lw(th) ** 2])];
      rows.push(...[0, 0.6, 1.05, 1.4].map((th) => [fJ + 0.66 * dl * Math.sin(th) / tH, sz + 0.8 * dl * Math.cos(th), d0 * (1.15 - 0.15 * Math.sin(th)), -0.002 - 0.004 * Math.sin(th)]));
      rows.push([fAc, sz, d0, -0.006]);
      // (up to the seam: the back straight on up, the front sloping back toward the throat's base)
      for (const u of [0.3, 0.6, 0.82]) rows.push([fAc + (fSeam - fAc) * u, sz + (NK.rS - sz) * u ** 0.8, d0 + (nS.D - d0) * u, -0.006 + (nS.x + 0.006) * u]);
    }
    // (at the seam the neck's own section - the neck rises out of it there, no shelf round it, no crease: the torso's
    // section just above it carried on from the row below at the neck's own slope there (its flare across and deep, its
    // lean) - the chest's surface and the neck's one curve through the seam; above that the torso closes well inside the
    // neck, its rows' middles carried forward with the neck's lean)
    const rb = rows.reduce((a, r) => (r[0] < fSeam && (!a || r[0] > a[0]) ? r : a), null), Ls0 = Math.max(NK.Lv + 0.5 * NK.chin - (fSeam - fAc) * tH, 0.6 * NK.rTop), P1 = NK.prof(Ls0, nS.D);
    const sW = (P1.r(0.002) - P1.r(0)) / 0.002, sD = (P1.rF(0.002) - P1.rF(0)) / 0.002, fa = fSeam + 0.07 * Ls0 / tH, ua = (fa - rb[0]) * tH;
    rows.push([fSeam, NK.rS, nS.D, nS.x], [fa, rb[1] + sW * ua, rb[2] + sD * ua, rb[3] + NK.lean * ua], [fSeam + 1.1 * NK.rTop / tH, 0.5 * NK.rTop, 0.45 * NK.rTop, nS.x + 1.1 * NK.lean * NK.rTop]);
    F.tor = F.tor.filter((r) => r[0] < Math.min(fJ, rows[0][0]) - 0.012).concat(rows).sort((a, c) => a[0] - c[0]);
    F.neckR = NK.rBase * 1.1;
    // (her girdle tilted with her shoulders: torsoOf)
    if (fem) F.shF = [fJ, NK.rS, sz, fJ - 1.25 * dl / tH, fAc];
  }
  const T = torsoOf(J, F);  // (a jacket in its cut - hers her own; the side a one-sided cut climbs to, the same for the same person)
  const JK = OF?.jacket ? { ...JACKETS[OF.jacket], ...(fem && JACKETS[OF.jacket].her) } : null, oSide = (seedOf() >>> 5) & 1 ? 1 : -1;
  // (her arms hanging easy, standing: each upper arm down from the shoulder just clear of the waist, the elbow softly bent
  // - its own bend, side to side, person to person - the forearm a little forward, the hand clear of the hip; each as long
  // as it was)
  if (fem && IDLE_POSES.has(pose)) for (const s of ['R', 'L']) {
    const sg = s === 'R' ? -1 : 1, sh = J['sh' + s].clone().setZ(J['sh' + s].z * F.sh), el = J['el' + s], wr = J['wr' + s], L1 = sh.distanceTo(el), L2 = el.distanceTo(wr);
    if (el.y > sh.y - 0.6 * L1 || wr.y > el.y - 0.6 * L2 || (wr.z - el.z) * sg < -0.3 * L2) continue;
    // (clear of the torso's side at a height by what she wears there and a share of the arm's own radius)
    const cl = JK ? JK.out + 0.006 : OF?.skirt ? 0.012 : 0.006, sideAt = (y, r) => T.pt((y - T.A.y + 0.11) / T.H, sg * Math.PI / 2).z + sg * (cl + 1.5 * r);
    const dz = sg * Math.min(0.35 * L1, Math.max(0.03 * L1, sg * (sideAt(sh.y - L1, F.arm[1]) - sh.z)));
    el.set(sh.x - 0.02 * L1, sh.y - Math.sqrt(L1 * L1 - dz * dz - (0.02 * L1) ** 2), sh.z + dz);
    const d2 = el.clone().sub(sh).normalize().applyAxisAngle(V(0, 0, 1), 0.2 + 0.14 * ((seedOf() >>> (s === 'R' ? 9 : 12)) & 7) / 7);
    wr.copy(el).addScaledVector(d2, L2);
    const wz = sideAt(wr.y, F.arm[3]); if ((wz - wr.z) * sg > 0) { wr.z = wz; wr.y = el.y - Math.sqrt(Math.max(0, L2 * L2 - (wr.x - el.x) ** 2 - (wr.z - el.z) ** 2)); }
  }
  // (her arms, now they hang where they will, grown out of her shoulders - one surface, the shoulder's round carried on
  // into the deltoid's, its fillet a share of the deltoid: T.arms - armB(g, i, off, o) for each arm's own surface)
  // (his the same bare-chested by the pool (OF.bareTop): no doll's joint at a bare shoulder)
  const armB = fem || (OF?.bareTop && !OF.jacket) ? T.arms(['R', 'L'].map((s) => { const S = J['sh' + s].clone().setZ(J['sh' + s].z * F.sh), el = J['el' + s]; return { S, u: el.clone().sub(S).normalize(), L: S.distanceTo(el) }; }), 0.8 * F.del) : null;
  // (his sleeves grown out of the cloth they are sewn to the same way - a shirt's, a suit's, a jacket's: one cloth over
  // the shoulder's round, never a sleeve's cap standing on it as a box (armM: only his sleeves, laid on that cloth))
  const armM = !armB && Q >= 0.6 ? T.arms(['R', 'L'].map((s) => { const S = J['sh' + s].clone().setZ(J['sh' + s].z * F.sh), el = J['el' + s]; return { S, u: el.clone().sub(S).normalize(), L: S.distanceTo(el) }; }), 0.8 * F.del) : null;
  // (her trousers' legs grown out of their top the same way - one cloth over the hips and the tops of the thighs, no line
  // where each leg leaves it: legB(g, i, off))
  const legB = fem && Q >= 0.6 ? T.arms(['R', 'L'].map((s) => { const S = J['hip' + s].clone().setZ(J['hip' + s].z * 0.94), k = J['knee' + s]; return { S, u: k.clone().sub(S).normalize(), L: S.distanceTo(k) }; }), 0.06) : null;
  // (a skirt only standing, where the legs are under it; sitting, kneeling, walking or in a scuffle the top over trousers)
  // (a dress sitting, walking or in a scuffle: its skirt over the thighs as far as it reaches, the legs bare below it)
  // (a sheer mini over its own short dress, stepping: both kept whole round her thighs (stride) - never the dress beneath
  // parted leg by leg under the lace)
  const SHORT = ['micro', 'mini', 'thigh', 'short'], stride = !DRESS_POSES.has(pose) && !!OF?.sheer && SHORT.includes(OF.skirt?.hem) && SHORT.includes(OF.sheer.hem);
  // (a lace dress on its lining, skirt from the waist (laceWaist): one cloth - the skirt carried on up a hair over the
  // bodice's own foot, which reaches down under it: no seam's ledge and shadow round the waist under the lace)
  const laceWaist = !!OF?.lace?.on && !!OF.skirt && !OF.skirt.rise && !OF.crop;
  const sk = OF?.skirt && (DRESS_POSES.has(pose) || stride) ? skirt(J, F, T, { ...OF.skirt, side: oSide, bare: !!OF.crop, stride }, kit === 'trench' ? 0.014 : laceWaist ? 0.0072 : 0.005) : null, lap = !!OF?.skirt && !sk && !OF.under, swLap = OF?.swim === 1 && !!OF.sheer && !DRESS_POSES.has(pose);   // (swLap: a cover-up's sheer dress over swimwear, sitting - over her lap as a dress's is)
  const cut = OF?.swim === 1 ? null : sk || lap ? OF.under || null : OF ? OF.trousers || OF.under || 'straight' : null, bare = OF?.swim === 1 || ((!!sk || lap) && !OF.under);   // (in swimwear her legs bare: world/Swimwear.js; his in swim shorts - CUTS.swim - bare below them)
  // (wide-legged trousers, standing: falling as one from the hips to the floor, the seams between the legs folded in)
  const pz = !sk && cut === 'wide' && DRESS_POSES.has(pose) ? skirt(J, F, T, { hem: 'floor', flare: 0.14, split: OF?.inseam ? 2 : 1, bare: !!OF?.crop, rise: OF?.rise }, 0.004) : null;
  const team = new THREE.Color(o.color || '#3a6fd8'), acc = new THREE.Color(o.accent || '#ffffff');
  // (the team jacket: dark, the team's colour across the shoulders)
  // (under a sheer layer of her colour, a dress of the accent's - lace over nude - if the kit has it so)
  // (and a lace laid on its lining (OF.lace.on): the dress itself the lining, in the accent - the lace in her colour)
  const top = kit === 'marshal' ? new THREE.Color('#f2661b') : kit === 'jacket' ? new THREE.Color('#202329') : OF?.sheer?.base === 'accent' || (OF?.lace?.on === 'top' && OF.lace.lining === 'accent') ? acc : team;
  // (her skirt's legs bare or in sheer tights; trousers worn in place of a skirt dark, unless she has her own)
  const legs = kit === 'suit' ? team.clone().multiplyScalar(0.82) : kit === 'marshal' ? new THREE.Color('#e05a14') : OF && o.legs && (!OF.skirt || sk || OF.under) ? new THREE.Color(o.legs) : OF?.skirt && !sk && !OF.under ? new THREE.Color('#1e2027') : OF?.swim === 'm' ? (OF.jacket ? acc : team).clone() : kit === 'casual' || cut === 'jeans' ? new THREE.Color('#3d5172') : new THREE.Color('#24272d');   // (his swim shorts, unless given: his colour - the accent under a shirt of his colour)
  const skinC = new THREE.Color(o.skin || DL?.skin || SKIN[(Math.random() * SKIN.length) | 0]), hairC = new THREE.Color(o.hair || DL?.hair || HAIR[(Math.random() * HAIR.length) | 0]);
  const shoeKind = OF ? (HEELS.has(SHK) && !fem ? 'shoe' : SHK) : kit === 'suit' ? 'boot' : kit === 'polo' || kit === 'marshal' ? 'work' : 'shoe';
  const shoeC = new THREE.Color(o.shoes || (kit === 'suit' ? '#111214' : shoeKind === 'trainer' ? '#e6e3dc' : shoeKind === 'boot' && OF ? '#17171a' : shoeKind === 'shoe' && OF && fem ? '#2a2420' : '#1b1b1b'));
  // (jewellery, a hair cuff, a clutch's clasp: one metal of their own - o.jewel.metal: polished gold, bright silver, rose
  // gold; none ('auto'): gold for her by her accent's warmth, else silver (a man's steel) - its own colour, not each
  // vertex's: a night's lift (emissive, ui/PreRace.js) is then gold too; made when first wanted. JW: her jewellery's other
  // wishes - { earrings, chain, choker, cuffs, clutchColor, clutchMetal })
  const JW = o.jewel && typeof o.jewel === 'object' ? o.jewel : {};
  const autoMetal = (() => { const h = acc.getHSL({ h: 0, s: 0, l: 0 }); return fem && h.s > 0.22 && h.h > 0.05 && h.h < 0.17 ? 'gold' : 'silver'; })();
  let jm = METALS[JW.metal] ? JW.metal : autoMetal;
  // (shoes in a finish of their own (o.shoeFinish) - metallic in her jewellery's metal, heels only)
  const shoeFin = SHOE_FINISHES[o.shoeFinish] && (o.shoeFinish !== 'metallic' || HEELS.has(shoeKind)) ? o.shoeFinish : null;
  const shoeMat = () => {
    const f = shoeFin && SHOE_FINISHES[shoeFin];
    if (f === 'metal') return pplMat('metal', new THREE.Color(...METALS[jm].c), METALS[jm].r + 0.04);
    if (f) return pplMat(f.velvet ? 'velvet' : 'cloth', shoeC, f.r, f.env ? { envMap: pplEnv(), envMapIntensity: f.env } : {}, f.velvet || 0.6);
    // (heels in patent: a mirror's gloss, the room in it)
    // (boots to the knee or over it in soft leather, a gloss of their own)
    if (shoeKind === 'kneeboot' || shoeKind === 'thighboot') return pplMat('cloth', shoeC, 0.26, { envMap: pplEnv(), envMapIntensity: 0.85 });
    return HEELS.has(shoeKind) ? pplMat('cloth', shoeC, 0.1, { envMap: pplEnv(), envMapIntensity: 1 }) : pplMat('cloth', shoeC, kit === 'suit' ? 0.5 : shoeKind === 'boot' ? 0.4 : 0.55);
  };
  // (her hair's own tones (style.tone: { root, ends, melt, strands }): a shadow root melting into its colour over melt
  // (m), lighter or warmer ends, and how much the locks differ one from the next (strands, 0..2) - each tone a share of
  // the hair's colour, channel by channel, carried by each vertex: its material keeps the one colour)
  const TN = ST.tone && typeof ST.tone === 'object' ? ST.tone : null, isHex = (h) => /^#[0-9a-f]{6}$/i.test(h || '');
  const ratioOf = (h) => { if (!isHex(h)) return null; const c = new THREE.Color(h); return [c.r / Math.max(0.002, hairC.r), c.g / Math.max(0.002, hairC.g), c.b / Math.max(0.002, hairC.b)].map((v) => Math.min(200, v)); };
  const HT = TN && (isHex(TN.root) || isHex(TN.ends)) ? { root: ratioOf(TN.root), ends: ratioOf(TN.ends), melt: Math.max(0.02, Math.min(0.2, +TN.melt || 0.07)) } : null;
  const hSk = TN && typeof TN.strands === 'number' && isFinite(TN.strands) ? Math.max(0, Math.min(2, TN.strands)) : 1;
  // (each fabric its own sheen: satin the glossiest, a race suit's weave, leather, wool, cotton, a knit and denim the most
  // matt - or a fabric of her own; her hair's shine her own (style.shine 0..1), else a touch glossier than a man's, pulled
  // sleek the more)
  // (the opaque layer under a sheer one (OF.sheer) never in her own skin's tone - a nude lining reads as bare skin through
  // lace or mesh, near and far, in a club's light: one that close to hers worn in the sheer's own colour (black lace over
  // black), or, that close too, in black)
  const nearSkin = (c) => { const a = c.clone().convertLinearToSRGB(), b = skinC.clone().convertLinearToSRGB(), h = {}; a.getHSL(h); const lb = b.getHSL({}).l; return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b) < 0.2 || (Math.abs(h.l - lb) < 0.16 && h.h > 0.02 && h.h < 0.13 && h.s > 0.12 && h.s < 0.8); };
  // (and no swimwear in her skin's tone either - a nude bikini reads as bare skin at a glance: a deeper, richer shade of her
  // pick in its place (a pale pink a raspberry, a pale gold a bronze), black only when that too is near her skin)
  const deepOf = (c) => { const h = {}; c.getHSL(h); return new THREE.Color().setHSL(h.h, Math.min(1, 0.25 + 1.2 * h.s), Math.max(0.03, 0.3 * h.l)); };
  // (a lace's own lining its own way: world/Lace.js liningOf, below)
  const topC = ((OF?.sheer && !OF.lace?.on) || (OF?.swim === 1 && !OF.cover)) && nearSkin(top) ? (nearSkin(team) ? (OF.swim === 1 && !nearSkin(deepOf(top)) ? deepOf(top) : new THREE.Color('#141414')) : team.clone()) : top;
  const mats = {
    top: OF ? finishMat(kit, topC, OF, fabric) : pplMat('cloth', top, kit === 'suit' ? 0.5 : kit === 'jacket' ? 0.55 : 0.86),
    // (bare legs under a skirt; sheer tights only by choice - o.tights (a colour, or true: o.legs') - or, outside a club
    // kit, o.legs as ever: a club mini's legs bare, never a day look's trouser colour carried over as tights)
    legs: bare ? ((tc) => pplMat('skin', skinC.clone().lerp(tc || skinC, tc ? 0.45 : 0), tc ? 0.5 : 0.66))(o.tights ? new THREE.Color(typeof o.tights === 'string' ? o.tights : o.legs || '#1b1b1f') : o.legs && !CLUB_KITS.includes(kit) && !OF?.swim ? new THREE.Color(o.legs) : null) : OF?.legFab ? finishMat(null, OF.swim === 'm' && nearSkin(legs) ? new THREE.Color('#1b2440') : legs, OF, OF.legFab) : pplMat('cloth', legs, cut === 'jeans' ? 0.92 : cut === 'skinny' && kit === 'athleisure' ? 0.5 : 0.72),
    accent: pplMat('cloth', kit === 'marshal' ? new THREE.Color('#e8e8e8') : acc, kit === 'marshal' ? 0.35 : 0.5),
    skin: pplMat('skin', skinC, fem ? 0.66 : 0.72),   // (hers dewy - a soft broad sheen, PPL_DEWY - as her face's: not a doll's plastic)
    hair: pplMat('cloth', hairC, typeof ST.shine === 'number' && isFinite(ST.shine) ? 0.62 - 0.28 * clamp01(ST.shine) : !fem ? 0.5 : SLEEK.has(ST.hs) ? 0.4 : 0.47),
    shoe: shoeMat(),
    team: pplMat('cloth', team, 0.5),
  };
  // (a separate skirt in the accent colour and its own cloth (OF.sep: leather under a satin cami); a sheer layer - mesh,
  // or lace - in her colour, the dress beneath seen through it)
  // (jeans in denim's twill, wherever they are worn; the top beneath a jacket in a cloth of its own (OF.accFin: a
  // bralette's satin under a crepe blazer))
  if (cut === 'jeans' && !bare && !OF?.legFab) fabricOn(mats.legs, { weave: 'denim' });
  if (OF?.accFin) { mats.accent.dispose(); mats.accent = finishMat(null, acc, OF, OF.accFin); }
  if (OF?.sep) mats.bottom = finishMat(null, acc, OF, OF.sep);
  // (sheer: it darkens and tints what is beneath it, a matt net with no gloss of its own - mesh evenly, lace by its own
  // pattern: close-worked flowers near opaque in a faint net (laceTex))
  // (and, as a fine net is, the closer the more it is seen edge on: dense along every edge it turns away at, the skin
  // clear through it face on - PPL_SHEER)
  // (a mesh's own fine diamond net in it (PPL_NET 1: its threads and its holes; finer than a pixel, their average) - a
  // little denser for it, the same sheerness seen from afar)
  // (over swimwear (world/Swimwear.js): a crochet's own open stitches (net 3: opaque but for its holes), a mesh, or a plain
  // chiffon (net 0) as sheer as it is (op); the swimwear beneath in the accent - never in her skin's tone; a sarong's skirt
  // itself sheer (cover 'sheer': the top's material))
  if (OF?.sheer) { mats.sheer = pplMat('cloth', team, 0.88, { transparent: true, opacity: OF.sheer.lace ? 1 : OF.sheer.op ?? (OF.sheer.net === 3 ? 1 : 0.62), depthWrite: false, envMapIntensity: 0 }); mats.sheer.defines.PPL_SHEER = '0.85'; if (!OF.sheer.lace) fabricOn(mats.sheer, { net: OF.sheer.net ?? 1 }); }
  if (OF?.cover && nearSkin(acc)) mats.accent.color.set(nearSkin(team) ? '#141414' : team);
  if (OF?.cover === 'sheer') { const m = mats.top; m.transparent = true; m.opacity = OF.coverOp ?? 0.5; m.depthWrite = false; m.defines.PPL_SHEER = '0.7'; m.needsUpdate = true; }
  // (lace (world/Lace.js - LK: the kit's lace; laceC: its colour): laid on its lining (LK.on: the dress's own cloth, or the
  // top beneath a jacket) - drawn in the lining's own material, the lining's colour never her skin's tone nor lost under
  // the lace's own (liningOf); sheer over the skin (sleeves, a yoke, a cover-up); its edges - a scalloped hem, a trim,
  // a deep lace hem - a material of their own)
  const LK = laceOf(OF), laceC = LK ? (LK.col === 'accent' ? acc : team).clone() : null;
  if (LK) {
    if (LK.on && mats[LK.on]) { const m = mats[LK.on]; m.color.copy(liningOf(laceC, LK.lining === 'tone' ? laceC : m.color, nearSkin, LK.kind, LK.lining === 'tone', skinC)); laceOn(m, LK.kind); }
    if (!mats.sheer && LK.hemBand) mats.sheer = pplMat('cloth', laceC, 0.85, { transparent: true, depthWrite: false, envMapIntensity: 0 });
    if (mats.sheer) { mats.sheer.color.copy(laceC); laceSheer(mats.sheer, LK.kind); }
    if (Q >= 0.6 && fem && (LK.edge || LK.trim || LK.hemBand)) mats.laceEdge = laceEdgeMat(pplMat('cloth', laceC, 0.85, { transparent: true, depthWrite: false, envMapIntensity: 0 }), LK.kind);
  }
  // (a bandeau's own cloth (OF.band): the kit's, gathered - its ruching in the shader (Fabric's 'ruche'), a matching skirt
  // left smooth)
  if (OF?.band && fem && Q >= 0.6 && !OF.jacket) mats.band = fabricOn(finishMat(kit, topC, OF, fabric), { weave: 'ruche' });
  // (wet from the water (o.wet 0..1 - by a pool): once, as built - the skin's sheen the brighter, the hair darker and
  // slicker, the swimwear a shade darker with the water's gloss on it; nothing per frame)
  if (o.wet > 0 && OF?.swim) {
    const w = Math.min(1, +o.wet); mats.skin.roughness *= 1 - 0.45 * w; if (bare) mats.legs.roughness *= 1 - 0.45 * w;
    mats.hair.color.multiplyScalar(1 - 0.3 * w); mats.hair.roughness = Math.min(mats.hair.roughness, 0.5 - 0.22 * w);
    for (const k of ['top', 'accent', 'band', 'bottom', ...(bare ? [] : ['legs'])]) { const m = mats[k]; if (!m || m.transparent) continue; m.color.multiplyScalar(1 - 0.22 * w); m.roughness *= 1 - 0.4 * w; }
  }
  // (her hair in the wet look, combed straight back (style.slick - a pool's, a gel's): darker and glossy as wet hair is,
  // once as built - the water's own darkening is enough when she is wet from the pool)
  else if (fem && ST.slick && mats.hair) { mats.hair.color.multiplyScalar(0.8); mats.hair.roughness = Math.min(mats.hair.roughness, 0.3); }
  const parts = { top: [], legs: [], accent: [], skin: [], hair: [], shoe: [], team: [], acc: [], metal: [], metal2: [], bottom: [], sheer: [], band: [], laceEdge: [] }, skP = OF?.sep ? 'bottom' : 'top';
  /** the jewellery's metal, f (none: hers); a second finish (a clutch's own hardware) its own material */
  const metalM = (f = jm) => {
    if (f === jm || !METALS[f]) return mats.metal || (mats.metal = pplMat('metal', new THREE.Color(...METALS[jm].c), METALS[jm].r));
    return mats.metal2 || (mats.metal2 = pplMat('metal', new THREE.Color(...METALS[f].c), METALS[f].r));
  };
  const shR = J.shR.clone().setZ(J.shR.z * F.sh), shL = J.shL.clone().setZ(J.shL.z * F.sh), TOP = fSeam + 0.7 * NK.rTop / tH, B = (lo, hi, out, o2) => band(T, lo, hi, out, o2);
  // ---- the neck, and the head set down on it ----
  // (rising out of the torso's own section at the seam - its back on the line of the back, its front on the throat's -
  // leaning forward only a little (NK.lean), its back a straight line up into the base of the skull; below the seam sunk
  // deep in the chest, down past the collarbones, and kept inside it however the neck leans. Up to the pivot it bends,
  // evenly along it, as far as the head is bowed (or lifted) from the way the neck leans - its top as the head is set.
  // The head on it: its chin NK.Lv above the collarbones' line; the neck's top - the head's pivot - halfway between the
  // chin's height and the head's centre, at the base of the skull; the skull's back there flush with the neck's back
  // line - no ledge under it, the head not slid forward off the neck - or, over a slender neck, the head's centre held
  // over the neck (NK.fw), the skull's base reaching a little past the nape. A crew helmet sits a little higher than a head)
  const nAx = V(0, 1, 0).applyQuaternion(T.q), nFw = V(1, 0, 0).applyQuaternion(T.q), nSd = V(0, 0, 1).applyQuaternion(T.q), rotZ = -(J.bow + r());
  const nb = T.c(fSeam), an = nAx.clone().addScaledVector(nFw, NK.lean).normalize(), fwN = nFw.clone().addScaledVector(an, -nFw.dot(an)).normalize();
  const tChin = T.c(fAc).dot(nAx) + NK.Lv + (o.crewHelmet ? 0.35 * NK.chin : 0), tCtr = tChin + NK.chin, tPiv = tChin + 0.5 * NK.chin;
  const sPiv = (tPiv - nb.dot(nAx)) / an.dot(nAx), sChin = (tChin - nb.dot(nAx)) / an.dot(nAx), NP = NK.prof(Math.max(sPiv, 0.6 * NK.rTop), nS.D);
  // (the bend: its angle a share of the way up to the pivot, all of it there and above)
  const bK = (-rotZ - Math.atan2(an.x, an.y)) / Math.max(0.01, sPiv), bend = (h) => bK * Math.min(Math.max(h, 0), sPiv);
  /** the neck's middle h up it from the seam; its forward there; a point a round it from the front, out beyond its surface */
  const nAt = (h) => {
    if (h <= 0 || Math.abs(bK) < 1e-4) return nb.clone().addScaledVector(an, h);
    const t = bend(h), p = nb.clone().addScaledVector(an, Math.sin(t) / bK).addScaledVector(fwN, (1 - Math.cos(t)) / bK);
    return h > sPiv ? p.addScaledVector(an, (h - sPiv) * Math.cos(t)).addScaledVector(fwN, (h - sPiv) * Math.sin(t)) : p;
  };
  const fwAt = (h) => { const t = bend(h); return fwN.clone().multiplyScalar(Math.cos(t)).addScaledVector(an, -Math.sin(t)); };
  // (the sternocleidomastoids: a soft ridge either side, from under the ear - the mastoid, at the pivot's height, well
  // round toward the back - down and forward to either side of the notch at the throat's foot, above the collarbones'
  // line: a V seen from the front; between their feet the notch, a shallow hollow. A shade more on him; none in a
  // crowd's. scm(h, a) -> how far out of the neck's own surface - its skin's, and all that lies on it (nRing))
  const hLo = -0.85 * (fSeam - fAc) * tH, scA = n(32, 10) >= 28 ? (fem ? 0.032 : 0.036) * NK.rTop : 0;
  const scm = (h, a) => {
    if (!scA) return 0;
    const am = a > Math.PI ? 2 * Math.PI - a : Math.abs(a), u = clamp01((h - hLo) / (sPiv - hLo));
    return scA * gau(am - 0.22 - 1.43 * u ** 1.2, 0.18) * ss3(hLo - 0.004, hLo + 0.012, h) * ss3(sPiv + 0.01, sPiv - 0.01, h) - 2.2 * scA * gau(am, 0.22) * gau(h - hLo - 0.004, 0.012);
  };
  const nRing0 = (h, a, out = 0) => { const c = Math.cos(a), o2 = out + scm(h, a); return nAt(h).addScaledVector(fwAt(h), c * ((c > 0 ? NP.rF(h, c) : NP.rB(h, c)) + o2)).addScaledVector(nSd, Math.sin(a) * (NP.r(h, c) + o2)); };
  // (and over its foot, where she is bare there, eased along the curve her skin takes from the chest into it (nFil, below) -
  // all that lies on the neck following it)
  const NF0 = V(0, 0, 0); let nFil = () => NF0; const nRing = (h, a, out = 0) => { const p = nRing0(h, a, out); return p.add(nFil(p, a)); };
  // (the head's centre, in the head's own frame - upright on the neck's top, as its own group carries it: turned by the
  // bow and scaled about the pivot by the head's size)
  J.neck.copy(nAt(sPiv)); J.head.copy(J.neck).add(V(Math.min(NK.occ - NP.rB(sPiv), NK.fw), tCtr - tPiv, 0).multiplyScalar(1 / F.hd));  /** p kept inside the chest below the seam: within the torso's section at its height, nS.m in from it */
  const inT = (p) => {
    const q = p.clone().sub(T.A), f = (q.dot(nAx) + 0.11) / T.H; if (f >= fSeam) return p;
    const [w, d, xf] = T.sec(f), m = nS.m, x = q.dot(nFw) - xf, z = q.dot(nSd), e = Math.hypot(x / Math.max(m, d - m), z / Math.max(m, w - m));
    return e > 1 ? p.addScaledVector(nFw, x / e - x).addScaledVector(nSd, z / e - z) : p;
  };
  /**
   * a collar round the neck, following it: lower in front - down toward the collarbones - than at the back (drop), from
   * h0 up it rising h (its front never past the chin), standing off it by out (more by flare toward its top: turned down)
   */
  const collar = (h, out, flare = 0, h0 = -0.006, drop = 0.6 * (fSeam - fAc) * tH, sink = 0.2 * NK.rTop, on = null) => {
    // (sewn into what it is on: its lowest ring on the neck, sink below its edge - below the seam, inside the chest, under
    // the shirt or the suit; its top edge turned in and down to the neck, the inside of it in shadow - no gap round the
    // neck to see through from any side. Its foot - where the chest stands out past the neck's own, in front - laid just
    // on the cloth it is sewn to (on: how far that lies off the torso), the seam one clean line, never a ragged crossing)
    const M = n(28, 10), K = 4, hh = Math.max(0.006, Math.min(h, sChin - 0.012 + drop - h0)), oT = out + flare, dl = Math.min(1.2 * oT, 0.7 * hh), R = [];
    const ring = (dh, o2) => Array.from({ length: M }, (_, j) => { const a = (j / M) * 2 * Math.PI; return nRing(h0 - drop * Math.max(0, Math.cos(a)) ** 1.5 + dh, a, o2); });
    R.push(ring(-sink, -0.003).map(inT));
    for (let k = 0; k <= K; k++) {
      const t = k / K, rg = ring(hh * t, out + flare * t * t);
      if (on != null) for (const p of rg) { if (fOf(p) >= fSeam) continue; const m = T.near(p, on); if (m.s < 0.0015) p.addScaledVector(m.n, 0.0015 - m.s); }
      R.push(rg);
    }
    R.push(ring(hh - 0.3 * dl, 0.45 * oT), ring(hh - dl, -0.002));
    const g = loft(R), C = new Float32Array(R.length * M * 3);
    for (let i = 0; i < R.length * M; i++) C[i * 3] = C[i * 3 + 1] = C[i * 3 + 2] = i >= (K + 2) * M ? 0.6 : 1;
    g.setAttribute('color', new THREE.BufferAttribute(C, 3)); return g;
  };
  /**
   * notched lapels either side of a front's opening (ed(f): its edge, the angle round from the front), laid on the cloth
   * at out(f): each from its point at fV widening straight out to the notch at fN (W across), then the collar's end above
   * it - narrower, the notch a step between them - up toward the neck's side at fT; and (back) the collar on round the back
   * of the neck from there, standing a share of the neck's radius, turned down. Every piece lined, in shadow - looking in
   * under an edge finds cloth - the lapels a shade darker than the cloth they lie on, their shape read at a glance
   */
  // (rim: their inner edges, over the skin, turned in a shade darker - by rim)
  const lapels = (ed, fV, fN, fT, W, out, back = true, rim = 0) => {
    // (a long lapel - down a plunge, over the bust - in more rows and columns: lying on her curves, never cut into by them)
    const pc = (f0, f1, w, R, C = 6) => { for (const s of [-1, 1]) { const a0 = (f) => s * (ed(f) - 0.012), a1 = (f) => s * (ed(f) + w(f)), pg = panel(T, f0, f1, a0, a1, out, { rows: R, cols: C }); parts.top.push(rim ? edgeIn(pg, n(C, 6), 0.93, rim) : tint(pg, 0.93), lining(panel(T, f0, f1, a0, a1, (f) => out(f) - 0.0025, { rows: R, cols: C, th: 0.0015 }))); } };
    pc(fV, fN, (f) => W * (f - fV) / (fN - fV), rim ? Math.max(9, Math.round(30 * (fN - fV))) : 9, rim && fN - fV > 0.3 ? 8 : 6);
    pc(fN + 0.008, fT, (f) => W * (0.55 - 0.45 * ss3(fN, fT, f)), 4);
    if (!back) return;
    // (lower toward its ends in front, where it comes down to the lapels' collar ends, and narrower there; its top edge
    // folded in to the neck - nothing to see down into behind it. Its foot on what it lies on: below the seam the
    // shoulders' own surface, over the cloth's top as far off as the cloth (out), above it the neck's, coming in to it
    // (oN, a share of the neck's radius: over a shirt's collar, under its fold); its ends on the collar ends' tops at fT,
    // edge to edge - no spur of it on down the chest. Behind, its foot a little above fT, still over the cloth's top)
    const aS = ed(fT) + 0.08 * W, h0 = -(fSeam - fT) * tH, hh = 0.5 * NK.rTop, dr = 0.24 * (fSeam - fAc) * tH, frS = Math.max(0, Math.cos(aS)) ** 1.5, o0 = out(fT), oN = 0.16 * NK.rTop, cm = nAt(h0 + dr * frS + 0.5 * hh);
    const cl = (sk2) => (u, v, s) => {
      const a = aS + v * (2 * Math.PI - 2 * aS), fr = Math.max(0, Math.cos(a)) ** 1.5, k = Math.min(1, u / 0.8), L = h0 + dr * (frS - fr) + hh * k * (1 - 0.4 * fr);
      const oc = o0 + (oN - o0) * ss3(-0.4 * hh, 0.3 * hh, L) + 0.25 * hh * k * k, o = oc - (oc - 0.002) * clamp01((u - 0.8) / 0.2) - s - sk2;
      return L < 0 ? T.pt(fSeam + L / tH, a, o) : nRing(L, a, o);
    };
    parts.top.push(tint(sheet(cl(0), 5, n(18, 6), 0.004, cm), 0.93), lining(sheet(cl(0.0025), 5, n(18, 6), 0.0015, cm)));
  };
  // ---- the torso, in its clothes ----
  // (bod: the bodice her arms grow out of - how far it stands off her, its neckline; skinSh: the shading of her skin above it)
  // (topOver: a top hanging loose over trousers - where its hem is (fH), how far it stands off (out(f)): the legs' tops kept under it)
  // (sideG: what her arms grow out of - the skin over her shoulders, a bodice her sleeves are laid on - and how far off her: lit
  // with the arms at the join once they are built (armB.side))
  let tS = 1, loose = 0.004, skinFoot = null, skinEdge = null, bod = null, skinSh = null, topOver = null, SWB = null; const sideG = [];
  // (the neck's foot where she is bare there (skinFoot well below the seam): each way round, along the skin from the
  // trapezius - or the chest - up into the neck, a curve tangent to both with no change of curvature at either end, as the
  // muscles there sweep up into the neck - over a share of the neck's radius either side of the seam, wider at the sides
  // and the back than at the throat - never a ring of light round its foot. nFil(p, a): how far a point of the base
  // surface (p: the chest's, or the neck's - a ring level with the seam's and up) moves to lie on that curve, by its height
  // over the seam - the skin's rows and all that lies on the skin there alike (nRing: a halter's band, a choker; a chain).
  // Worked out when first wanted, once skinFoot is known; none for a crowd's)
  {
    const NA = 32, yN = (p) => (p.x - nb.x) * nAx.x + (p.y - nb.y) * nAx.y + (p.z - nb.z) * nAx.z, ay = an.dot(nAx); let tab = null, sf0 = null;
    const build = () => {
      tab = []; sf0 = skinFoot; const tq0 = performance.now(); globalThis.__JNB = (globalThis.__JNB || 0) + 1;
      for (let i = 0; i < NA; i++) {
        const a = (i / NA) * 2 * Math.PI, wa = a > Math.PI ? a - 2 * Math.PI : a, lo = skinFoot(wa), k0 = ss3(0, 0.15 * (fSeam - fAc), fSeam - lo - 0.3 * (fSeam - fAc));
        if (k0 < 0.05) { tab.push(null); continue; }
        const wS = ss3(0.4, 1.2, Math.abs(wa)), dA = k0 * NK.rTop * (0.35 + 0.3 * wS), dB = k0 * NK.rTop * (0.3 + 0.25 * wS), du = 0.0015;
        // (its base: the chest's surface up to the seam, then the neck's from the ring of it level with the seam (h0: lower
        // behind than in front, as the neck leans) - each point by its height over the seam)
        const tp = (u) => T.pt(fSeam + u / tH, a, scm(u, a)), uLo = (lo - fSeam) * tH + 0.004; let h0 = 0; for (let t = 0; t < 4; t++) h0 -= yN(nRing0(h0, a)) / ay;
        const P = [tp(0)]; let uB = 0;
        for (let u = -du, s = 0; u > uLo && s < dA; u -= du) { const p = tp(u); s += p.distanceTo(P[0]); P.unshift(p); uB = u; }
        const nA = P.length; let hT = h0;
        for (let h = h0 + du, s = 0; s < dB && h < 0.9 * sChin; h += du) { const p = nRing0(h, a); s += p.distanceTo(P[P.length - 1]); P.push(p); hT = h; }
        if (P.length < 6 || nA < 2) { tab.push(null); continue; }
        // (the curve: a quintic from the window's foot to its top, its first and last three points each on the line the
        // surface runs along there - meeting it with its own slope and no curvature - drawn toward the corner between them)
        const pA = P[0], pB = P[P.length - 1], tA = pA.clone().sub(tp(uB - 0.002)).normalize(), tB = nRing0(hT + 0.002, a).sub(pB).normalize(), L = pA.distanceTo(pB);
        const w0 = pA.clone().sub(pB), b = tA.dot(tB), d0 = tA.dot(w0), e0 = tB.dot(w0), den = 1 - b * b; let C = null;
        if (den > 0.06) { const sa = (b * e0 - d0) / den, sb = (e0 - b * d0) / den; if (sa > 0.05 * L && -sb > 0.05 * L && sa < 1.5 * L && -sb < 1.5 * L) { const X = pA.clone().addScaledVector(tA, sa).lerp(pB.clone().addScaledVector(tB, sb), 0.5); C = [pA, pA.clone().lerp(X, 0.4), pA.clone().lerp(X, 0.75), pB.clone().lerp(X, 0.75), pB.clone().lerp(X, 0.4), pB]; } }
        if (!C) C = [pA, pA.clone().addScaledVector(tA, 0.2 * L), pA.clone().addScaledVector(tA, 0.4 * L), pB.clone().addScaledVector(tB, -0.4 * L), pB.clone().addScaledVector(tB, -0.2 * L), pB];
        const NB = 32, Bz = [], cb = [0], sb = [0];
        for (let k = 0; k <= NB; k++) { const u = k / NB, v = 1 - u, c = [v ** 5, 5 * u * v ** 4, 10 * u * u * v ** 3, 10 * u ** 3 * v * v, 5 * u ** 4 * v, u ** 5], p = V(0, 0, 0); for (let q = 0; q < 6; q++) p.addScaledVector(C[q], c[q]); Bz.push(p); if (k) cb.push(cb[k - 1] + p.distanceTo(Bz[k - 1])); }
        for (let k = 1; k < P.length; k++) sb.push(sb[k - 1] + P[k].distanceTo(P[k - 1]));
        // (each point of the base to the curve's at the same share of the way along)
        // (the base's heights rising along it: each kept above the last, so that a height finds one place on it)
        const Y = P.map(yN); for (let k = 1; k < Y.length; k++) Y[k] = Math.max(Y[k], Y[k - 1] + 1e-6);
        tab.push({ Y, D: P.map((p, k) => { const t = (sb[k] / sb[sb.length - 1]) * cb[NB]; let q = 1; while (q < NB && cb[q] < t) q++; return Bz[q - 1].clone().lerp(Bz[q], clamp01((t - cb[q - 1]) / Math.max(1e-9, cb[q] - cb[q - 1]))).sub(p); }) });
      }
      globalThis.__JNT = (globalThis.__JNT || 0) + performance.now() - tq0;
    };
    const at = (e, y) => { if (!e || !(y > e.Y[0] && y < e.Y[e.Y.length - 1])) return null; let l = 0, h = e.Y.length - 1; while (h - l > 1) { const m = (l + h) >> 1; if (e.Y[m] <= y) l = m; else h = m; } return e.D[l].clone().lerp(e.D[h], (y - e.Y[l]) / (e.Y[h] - e.Y[l])); };
    nFil = (p, a) => {
      if (!skinFoot || Q < 0.6 || globalThis.__JNoff) return NF0;
      if (sf0 !== skinFoot) build();
      const x = ((((a / (2 * Math.PI)) % 1) + 1) % 1) * NA, i0 = Math.floor(x) % NA, t = x - Math.floor(x), y = yN(p), d0 = at(tab[i0], y), d1 = at(tab[(i0 + 1) % NA], y);
      return !d0 && !d1 ? NF0 : (d0 || V(0, 0, 0)).multiplyScalar(1 - t).addScaledVector(d1 || NF0, t);
    };
  }
  if (OF) {
    // (the top: a bodice down to the waist over a skirt or a jumpsuit's trousers; else a top over trousers, to its hem.
    // Beneath a jacket, the top's in the accent colour; above its neckline the skin)
    // (a neckline near the neck follows its seam - all the way at the back and the sides, less in front, where the
    // collarbones are; one cut low across the chest stays where it is)
    // (one cut against her own shoulders - a halter's, a one-shoulder's, a blazer's V - is already where it belongs; a
    // one-sided one turned to her side)
    // (a night out's own: an open shirt's V (CLUB_NECK); any of them with the back cut open (OF.back: withBack))
    // (swimwear's lines worked out first (world/Swimwear.js: SWL) - a one-piece's bodice down to its own leg line, a
    // monokini's front carried down to its bottoms)
    const SWL = OF.swim === 1 ? SW.swimLines({ T, J, F, OF, fem, legRad, legForm }) : null;
    const neck0 = withBack(CLUB_NECK[OF.neck] || BAND_NECKS[OF.neck] || SW.SWIM_NECKS[OF.neck] || NECK[OF.neck] || (OF.neck === 'trench' ? NECK.v : NECK.crew), OF.back), nShift = fSeam - NECK_SEAM, neckN = neck0.length > 1 ? (a) => neck0(a * oSide, fAc, fSeam) : (a) => { const v = neck0(a); return Math.min(v + nShift * ss3(0.85, 0.95, v) * (0.35 + 0.65 * ss3(0.3, 1.4, Math.abs(a))), fSeam - 0.04 * (fSeam - fAc)); };   // (never above the seam: its edge on the chest's rows, the neck rising clear out of it)
    // (sleeveless and cut below the shoulders at the sides: its armholes cut in under the arms (fArm: below the shoulder's
    // round, a share of the deltoid under the joint) - the cloth never over the deltoid, the arm free of it. Off the
    // shoulder, straight on round in front and behind to meet the bands on the arms, dipping under each arm only where
    // the arm hides it - no edge of it left standing in the armpit when an arm is held out). Either side of the arm, in
    // front and behind, never up on to the shoulder's round where it widens out over the arm (fU: the chest's own side
    // under it, the shoulder's rows) - its corners lying on her side, not standing out over the arm as wings)
    const fArm = fJ - 1.4 * dl / tH, fU = fJ - 1.25 * dl / tH;
    // (a halter's armholes (hA): from the band round her neck down the front of each shoulder and round under the arm,
    // never out on to the shoulder's round - where her torso widens out past her chest's own side at the armpit, less half
    // the deltoid (zL) - each kept under that round's lower edge, coming down steeply in front of it (kH: its slope at
    // most, a share of her torso's length a radian) and easing round it, one curve: no wedge of cloth standing out over
    // the arm, no notch under it)
    const hA = OF.halter && OF.sleeve === 0 && !JK ? (() => {
      const sd = V(0, 0, 1).applyQuaternion(T.q), zL = T.sec(fArm)[0] - 0.5 * F.del, NB = 96, b0 = 0.4, bS = 2.4, kH = 3, fl = [], lat = (f, b) => Math.abs(T.pt(f, b, 0).sub(T.c(f)).dot(sd));
      for (let i = 0; i <= NB; i++) {
        const b = b0 + (bS * i) / NB, df = (fSeam - fArm) / 40; let f0 = null, l0 = lat(fArm, b);
        if (l0 > zL) f0 = fArm; else for (let k = 1; k <= 40; k++) { const f = fArm + df * k, l1 = lat(f, b); if (l1 > zL) { f0 = f - df + (df * (zL - l0)) / (l1 - l0); break; } l0 = l1; }
        fl.push(f0);
      }
      const cap = fl.map((_, i) => { let m = 9; for (let j = 0; j <= NB; j++) if (fl[j] != null) m = Math.min(m, fl[j] + (kH * Math.abs(i - j) * bS) / NB); return m; });
      for (let it = 0; it < 10; it++) { const c0 = cap.slice(); for (let i = 1; i < NB; i++) cap[i] = 0.25 * c0[i - 1] + 0.5 * c0[i] + 0.25 * c0[i + 1]; }
      return (b) => { const x = Math.max(0, Math.min(NB, ((b - b0) / bS) * NB)), i = Math.min(NB - 1, Math.floor(x)); return cap[i] + (cap[i + 1] - cap[i]) * (x - i); };
    })() : null;
    const neck = OF.sleeve === 0 && !JK ? (a) => {
      const v = neckN(a), b = Math.abs(a), lo = ss3(fAc + 0.01, fAc - 0.02, v), u = v - Math.max(0, v - fArm) * gau(b - Math.PI / 2, OF.bardot ? 0.28 : 0.5) * lo;
      const c0 = OF.bardot ? u : Math.min(u, fU + (u - fU) * (1 - ss3(0.55, 1.35, b) * ss3(2.65, 1.85, b) * lo));
      if (!hA) return c0;
      const c1 = hA(b); return 0.5 * (c0 + c1 - Math.sqrt((c0 - c1) ** 2 + 0.012 ** 2));   // (the two met in a soft round)
    } : neckN;
    const tight = OF.fit ?? JK?.top ?? 0.006, toBelt = sk || kit === 'jumpsuit' || (OF.skirt && !OF.under); bod = OF.bareTop ? null : { off: tight, nl: neck };    // (a structured bodice pressed to her along its neckline (torsoOf): how far a point is from that edge - round her, an
    // angle; up her, f in the same measure (a share of her torso's length to an angle's arc over her bust: 4.5) - to the
    // nearest piece of the edge across her front. Cropped (F.crop: its hem), the cloth easing back on to her toward its
    // hem - a bustier's band hugging her ribs)
    if (fem && F.lift) {
      const E = []; for (let a = -1.6; a <= 1.6001; a += 0.02) E.push(a, 4.5 * neck(a));
      F.crop = OF.crop || 0;
      F.edgeD = (f, a) => {
        const y = 4.5 * f; let m = 9;
        for (let i = 0; i + 3 < E.length; i += 2) { const ux = E[i + 2] - E[i], uy = E[i + 3] - E[i + 1], wx = a - E[i], wy = y - E[i + 1], t = clamp01((wx * ux + wy * uy) / (ux * ux + uy * uy || 1)), dx = wx - t * ux, dy = wy - t * uy, q = dx * dx + dy * dy; if (q < m) m = q; }
        return Math.sqrt(m);
      };
    }
    // (over wide trousers standing, the top tucked in at the waist)
    // (beneath a tailored jacket of hers, tucked in: ending well above its hem; beneath a coat, down to its belt - its
    // buttoned front never open on to nothing)
    const lo = JK?.coat && sk ? 0.3 : OF.crop || (toBelt || pz ? (OF.skirt?.rise ? OF.skirt.rise - 0.02 : laceWaist && sk ? 0.235 : 0.27) : OF.skirt ? -0.06 : Math.max(OF.hem ?? -0.05, JK?.tuck ? JK.hem + 0.035 : -1)), mat = JK || OF.cover ? 'accent' : 'top';   // (swimwear under what goes over it in the accent too)
    // (a knit's ribs; a corset's boning, every few columns a seam a shade darker; sequins catching the light unevenly)
    const ribs = (g, m = 44) => (Q < 0.6 ? g : OF.ribs ? ribbed(g, g.userData.m || n(m, 8)) : OF.boned ? boning(g, g.userData.m || n(m, 8)) : OF.sparkle ? sparkle(g) : g);
    // (a top over trousers stands a little off them at its hem, clear of the thighs' tops - not a cropped one; a tailored
    // one (lapels) a little off over the shoulders' round, its structure)
    // (a corset worn as a top (boned) close to her hips to its hem - no peplum's flare)
    const ease = (f) => tight + (toBelt || OF.crop || pz || JK?.tuck || OF.boned ? 0 : 0.008 * ss3(lo + 0.14, lo, f)) + (OF.lapels ? 0.004 * ss3(0.8, 0.93, f) : 0);
    // (and under an open jacket worn short - a bomber's, a leather one's - the top beneath it over the jeans just the same:
    // their waistband never through its hem at the hips as she stands on one leg)
    if (cut && (!JK || !JK.tuck) && !toBelt && !OF.crop && !pz && !OF.bareTop) topOver = { fH: lo, out: ease };
    const rows = Math.max(5, Math.round(22 * (0.95 - lo)));
    // (cut out to the skin (OF.holes: HOLES - a one-sided one on her bare side): the bodice in pieces round them, the skin
    // beneath each in the cloth's shadow - holedBand; HP: those pieces)
    const HP = [], BH = OF.holes && HOLES[OF.holes] ? (l, h, out, o2) => holedBand(T, l, h, out, o2, HOLES[OF.holes](-oSide), HP, 0.2126 * skinC.r + 0.7152 * skinC.g + 0.0722 * skinC.b) : B;
    if (OF.neck === 'mock' || OF.neck === 'zip') { const bg = B(lo, TOP, ease, { rows, hem: 'lo', cap: 'hi', curv: fem ? null : shD }); parts[mat].push(ribs(bg)); parts.top.push(collar(0.045, tight + 0.013)); if (fem && !JK) sideG.push([bg, tight + 0.001, 1]); }
    // (the skin above its neckline: the neck's own surface carried on down over the chest to it, and a little on under
    // the cloth's edge - nothing to see through between them - built with the neck)
    // (its edges turned under right in to the skin)
    // (hers cut low across the chest (skinEdge): the skin above it shaded - the neck's, below - its edge turned in a shade
    // darker, cloth with a thickness lying on the skin; a lapel's standing further off it)
    // (his bare torso by the pool (OF.bareTop): no bodice at all - the neck's skin carried on down over his chest and his
    // belly to his shorts' waistband, under it: one surface (the neck's, below))
    else if (OF.bareTop) skinFoot = () => (OF.rise ?? 0.17) - 0.03;
    else {
      let low = 1; if (fem && Q >= 0.6) for (let a = -0.6; a <= 0.61; a += 0.15) low = Math.min(low, neck(a));
      // (cut low: its columns closer across the front and its rows level there - band; its edge pressed to the skin, half
      // as far off it as the rest - a bodice's faced edge, not a thick wall of cloth standing along the plunge)
      // (a corset worn as a top (OF.point): its hem dipping to a shallow point at the front, the bodice's own edge)
      // (a one-piece's own foot its leg line; a monokini's its front carried down to its bottoms - SWL.bodLo)
      const loB = SWL?.bodLo || (OF.point && !toBelt && !OF.crop ? (a) => lo - 0.04 * (1 - Math.min(1, Math.abs(a) / 0.5)) ** 1.4 : lo);
      // (a bandeau (OF.band): stretch cloth hugging her - pressed in to her along both its edges, top and bottom, each a
      // fine turned edge, not a thick rim)
      const bE = OF.band ? (f) => 0.5 * tight * ss3(lo + 0.03, lo, f) : () => 0;
      // (silk draping (OF.drape): below the chest the cloth hangs from its fullness, not in to the waist - in front and at
      // the sides most, a little behind - in soft folds down to its hem)
      const c7 = T.sec(0.7), drp = OF.drape && Q >= 0.6 ? (f, a) => { const s = T.sec(f), ca = Math.cos(a), sa = Math.abs(Math.sin(a)), hang = ss3(0.72, 0.45, f); return ease(f) + hang * (0.6 * Math.max(0, c7[0] - s[0]) * sa + (ca > 0 ? 0.55 : 0.3) * Math.max(0, c7[1] - s[1]) * Math.abs(ca)) + 0.0032 * (Math.sin(7 * a + 1) + 0.5 * Math.sin(11 * a + 2.3)) * ss3(0.6, 0.15, f); } : null;
      const bm = low < 0.87 ? 48 : 44, bg = BH(loB, neck, low < 0.87 ? (f, a) => ease(f) - (OF.band ? 0.7 : 0.5) * tight * ss3(neck(a) - 0.035, neck(a), f) - bE(f) + (OF.suit && SWL ? SWL.wrap(f, a, tight) : 0) : drp || ease, low < 0.87 ? { rows: Math.max(rows, Math.round(24 * (0.97 - lo)), SWL?.rows || 0), hem: 'both', th: OF.swim ? 0.0016 : OF.band ? 0.003 : tight + 0.009, m: bm, dense: 0.6, follow: fem ? 1 : 0, level: fem ? (F.bf ?? 0.6) + 0.02 * (F.lift || 0) : true } : { rows, hem: 'both', th: OF.back ? 0.005 : tight + 0.009, curv: fem ? null : shD });
      // (the skin above it from the cloth's edge as built (top: straight between its columns) - along a plunge's steep
      // sides the line it was cut to runs above that, and the skin's foot, laid for under the cloth, showed in torn slivers;
      // its foot (skinFoot) under the lowest of the edge either side of it (~0.1 rad): on a steep side the cloth is beside
      // it, not above it, and a foot only a little lower left a gap between the two to see through)
      const nE = low < 0.87 && bg.userData.top ? bg.userData.top : neck;
      if (low < 0.87) { turnedIn(bg, bg.userData.m || n(bm, 8), OF.band ? 0.82 : 0.62); skinEdge = { f: nE, out: OF.lapels ? tight + 0.0065 : tight, angs: nE === neck ? null : bg.userData.angs }; }
      parts[mats.band && mat === 'top' ? 'band' : mat].push(ribs(bg, bm)); skinFoot = (a) => Math.min(...[-0.07, -0.035, 0, 0.035, 0.07].map((d) => Math.min(neck(a + d), nE(a + d))), fSeam) - 0.3 * (fSeam - fAc); if (fem && !JK) sideG.push([bg, tight + 0.001, 1]);
      // (the neck's flare by how much of the trapezius' sweep shows above the neckline at her sides)
      NP.bare(0.5 * [-1, 1].reduce((s, k) => s + ss3(0.05, 0.25, (fSeam - skinFoot(k * Math.PI / 2)) / (fSeam - fAc) - 0.3), 0));
      // (where it comes up near the neck's foot - a one-shoulder's over her shoulder, a halter's sides - on the curve her
      // skin takes there into the neck (nFil), as the skin beneath it is: never that skin up through its top edge in teeth)
      if (Q >= 0.6 && bg.userData.angs) {
        const Pb = bg.attributes.position, AB = bg.userData.angs, mb = AB.length, q = V(0, 0, 0); let nm = 0;
        for (let j = 0; j < Pb.count; j++) { q.fromBufferAttribute(Pb, j); const d = nFil(q, AB[j % mb]); if (d !== NF0 && d.lengthSq() > 0) { q.add(d); Pb.setXYZ(j, q.x, q.y, q.z); nm++; } }
        if (nm) bg.computeVertexNormals();
      }
      for (const [g, m, sk2] of HP) parts[sk2 ? 'skin' : mat].push(sk2 ? g : ribs(g, m));
      // (ruched: fine gathers slanting across it; a cowl's soft drapes hanging in front under its neckline)
      if (OF.ruched || OF.cowl) for (const g of [bg, ...HP.filter((x) => !x[2]).map((x) => x[0])]) gathers(g, T, OF.ruched ? 'ruched' : 'cowl', -oSide, neck);
      // (a bandeau's gathers: fine folds across it, drawn in toward the middle of its front - or toward its knot; a twist
      // knot at its neckline's dip, or the hem's two ends tied at the middle - Clubwear.ruche, frontKnot)
      if (OF.band && Q >= 0.6) {
        if (OF.knot) { const fk = OF.knot === 'tie' ? lo + 0.006 : neck(0) - 0.012; parts[mat].push(...frontKnot(T, fk, ease(fk), OF.knot)); }
      }
      // (a cowl's folds themselves: soft rolls of the cloth hanging one below the other between the straps (COWL), lying on
      // it; ruched: a few soft ridges of the gathered cloth slanting across her front, up toward its gathered side - its
      // cut-out's edge)
      const onB = low < 0.87 ? (f, a) => ease(f) - 0.5 * tight * ss3(neck(a) - 0.035, neck(a), f) : (f) => ease(f);
      if (OF.cowl && Q >= 0.6) for (const [A, D] of COWL) parts[mat].push(foldTube(T, (a) => neck(a) - D * (1 - (a / A) ** 2) ** 1.2 - 0.004, -0.94 * A, 0.94 * A, (f, a) => onB(f, a) + 0.0004, 0.0075, 16));
      if (OF.ruched && Q >= 0.6) { const s = -oSide; for (let i = 0; i < 5; i++) { const fk = 0.29 + 0.06 * i; parts[mat].push(foldTube(T, (a) => fk + 0.1 * (s * a + 1.25) / 1.95, -s * 1.25, s * 0.7, (f, a) => onB(f, a) + 0.0003, 0.0042, 12, 0.5)); } }
      // (a wrap gown's crossover (OF.wrapLine): the overlap's edge - a soft roll of its cloth from under the high shoulder's
      // neckline diagonally down across the bodice, curving a little, to the waist on the bare side, where its sash is
      // knotted and the skirt's own overlap and slit carry on down from it)
      if (OF.wrapLine && Q >= 0.6) { const a0 = oSide * 0.5, a1 = -oSide * 0.95, f0 = neck(a0) - 0.035, f1 = lo + 0.012; parts[mat].push(foldTube(T, (a) => { const u = (a - a0) / (a1 - a0); return f0 + (f1 - f0) * (u + 0.14 * Math.sin(Math.PI * u)); }, a0, a1, (f, a) => onB(f, a) + 0.0006, 0.0058, 18, 0.5)); }
      // (a bralette (OF.bra): its elastic band under the bust, the gore between its cups, each cup's seam - Clubwear.bralette)
      if (OF.bra && fem && Q >= 0.6) parts[mat].push(...bralette(T, neck, lo, onB, { n, Q }));
      // (a lace trim along its neckline (OF.lace.trim): the lace's scalloped edge lying on the cloth just under it - world/Lace.js)
      if (LK?.trim && mats.laceEdge) { const tg = laceTrim(T, band, neck, onB, LK.kind); if (tg) parts.laceEdge.push(tg); }
      // (cut-outs finished as they are made: each edge bound - a fine cord of the cloth round it; straps criss-crossing one
      // (OF.cross), or a metal ring at its middle, strapped to its sides (OF.ring) - Clubwear.bindHoles; only holes cut)
      if (HP.length && Q >= 0.6) { const BB = bindHoles(T, HOLES[OF.holes](-oSide), onB, { cross: OF.cross, ring: OF.ring }, { Q }); parts[mat].push(...BB.cloth); if (BB.metal.length) { metalM(); parts.metal.push(...BB.metal); } }
    }
    // (an open back closed across the nape (OF.nape): a narrow band of the cloth from one side of the opening to the other
    // at the neck's seam, lying on her skin - over the bodice at its ends - following the slope of her shoulders)
    if (OF.nape && OF.back) { const fT = fSeam - 0.04 * (fSeam - fAc) - 0.004; parts[mat].push(panel(T, fT - 0.04, fT, () => Math.PI - 0.98, () => Math.PI + 0.98, (f, a) => 0.0022 + (tight - 0.0014) * ss3(-0.004, 0.01, neck(a) - f), { rows: 4, cols: 18, th: 0.002 })); if (OF.tie && Q >= 0.6) parts[mat].push(...napeBow(T, fT - 0.02, 0.0024)); }   // (tied in a bow at its middle (OF.tie))
    // (cropped: the waist bare between its hem and the high waist of the skirt or the trousers - or, low-rise (OF.rise),
    // down to their top at the hips)
    // (her midriff its own quiet form - the navel, the line down the belly, the lower belly's round, low on the hips the
    // hip bones where low-rise shows them: Clubwear.midriff, shares of her own torso; a crowd's plain)
    const cRise = OF.rise || OF.skirt?.rise || 0, cLo = cRise ? cRise - 0.02 : 0.24;
    if (OF.crop) parts.skin.push(fem && Q >= 0.6 && !OF.jkBtn ? midriff(T, cLo, OF.crop + 0.012, 0.2126 * skinC.r + 0.7152 * skinC.g + 0.0722 * skinC.b, { n, Q }) : B(cLo, OF.crop + 0.012, 0, { rows: cRise ? 8 : 5 }));
    // (a halter's band round the neck; off the shoulder, the sleeves' band low round each upper arm (the arms, below))
    // (a halter's band: round the base of the neck, where the V's two sides come up to it either side of the throat)
    if (OF.halter) parts.top.push(collar(0.02, 0.003, 0, 0.1 * sChin, 0.12 * (fSeam - fAc) * tH, 0));
    // (a blazer dress: its lapels down the plunge to its point, along the inside of the bust, its collar round the back of
    // the neck; buttoned double-breasted between the point and the belt)
    if (OF.lapels) {
      const fV = PL_BV.f(0), ed = (f) => PL_BV.a(f);
      lapels(ed, fV + 0.006, 0.85, fSeam - 0.3 * (fSeam - fAc), 0.26, (f) => ease(f) + 0.0045, true, skinEdge ? 0.52 : 0);
      if (Q >= 0.6) for (const f of [fV - 0.045]) for (const s of [-1, 1]) { const bp = T.pt(f, s * 0.13, ease(f) + 0.003), bt = new THREE.SphereGeometry(0.0075, n(10), n(8, 2)); bt.scale(0.45, 1, 1); bt.translate(bp.x, bp.y, bp.z); parts.accent.push(bt); }
    }
    // (an open-necked shirt's camp collar (OF.camp): flat revers either side of its V from the top button, open low on
    // the chest, up to the collar round the back of the neck - of the shirt's own cloth)
    if (OF.camp) lapels((f) => PL_CAMP.a(f), PL_CAMP.f(0) + 0.006, Math.min(0.9, fAc - 0.01), fSeam - 0.3 * (fSeam - fAc), 0.2, (f) => ease(f) + 0.004, true);
    if (OF.neck === 'collar') { parts.accent.push(collar(0.03, 0.008, 0.009)); if (Q >= 0.6) parts.accent.push(panel(T, 0.84, fFront, () => -0.06, () => 0.06, tight + 0.003, { rows: 4, cols: 3 })); }
    if (OF.neck === 'shirt') parts.accent.push(collar(0.6 * NK.rTop, 0.08 * NK.rTop, 0.12 * NK.rTop));   // (snug on the neck, turned a little down at its top: shares of the neck)
    if (OF.neck === 'zip' && Q >= 0.6) parts.accent.push(panel(T, lo + 0.01, fFront, () => -0.014, () => 0.014, tight + 0.003, { rows: 10, cols: 2 }));
    // (straps over the middle of each shoulder, halfway out from the neck's seam to the joint (zS) and keeping to it: up
    // the chest from the bodice's own edge, over the top where the shoulder is no wider than that (fT), down the back to
    // its edge there - each end tucked under it; lying on her, never in to the arm or out over it)
    if (OF.straps) {
      const zS = NK.rS + 0.45 * (sz - NK.rS), wOf = (f) => T.sec(f)[0], aOf = (f, back) => { const k = Math.asin(Math.min(1, zS / wOf(f))); return back ? Math.PI - k : k; };
      let fT = fAc; while (fT < fSeam && wOf(fT) > zS) fT += 0.002;
      for (const s of [-1, 1]) {
        const end = (back) => { let f = fT - 0.1; for (let i = 0; i < 6; i++) f = neck(s * aOf(f, back)) - 0.005; return f; }, f0 = end(false), f1 = end(true), S = [], c = T.c(0.9);
        // (each point's own way out of the surface it lies on - over the top of the shoulder, up: lying flat on it there, not
        // standing on its edge out of the shoulder's slope)
        const NS = [];
        for (let i = 0; i <= 12; i++) {
          // (on the bare skin its own half-thickness off it and a hair more - lying on the shoulder, never standing proud of
          // its line; over the bodice's cloth, on that)
          const back = i > 6, u = back ? (12 - i) / 6 : i / 6, fe = back ? f1 : f0, f = fT - (fT - fe) * (1 - u) ** 2, a = s * aOf(f, back), o2 = 0.0018 + (tight + 0.0007) * ss3(neck(a) + 0.02, neck(a) - 0.002, f), p = T.pt(f, a, o2);
          const nn = new THREE.Vector3().crossVectors(T.pt(f + 0.003, a, o2).sub(T.pt(f - 0.003, a, o2)), T.pt(f, a + 0.02, o2).sub(T.pt(f, a - 0.02, o2))).normalize();
          S.push(p); NS.push(nn.dot(p.clone().sub(c)) < 0 ? nn.negate() : nn);
        }
        parts[OF.cover ? 'accent' : 'top'].push(lockGeo(S, { w: OF.strapW || 0.009, t: 0.0025, away: (cc, u) => { const k = u * 12, i = Math.min(11, Math.floor(k)); return NS[i].clone().lerp(NS[i + 1], k - i); }, shade: 1, flat: 1, k: 16, m: 5, tip: 0, blunt: 0, root: 0.02 }));
      }
    }
    // (a jumpsuit's trousers, or trousers under a top: from the waist (a jumpsuit's, under its belt) down over the seat)
    // (trousers' top shaded as the legs it runs into (legBlend: TH, the hips' joints) - no line where they come out of it;
    // a separate's, where it shows - under a cropped top, a corset worn over them - with its waistband (cropped: a shade
    // darker, a hair proud; jeans' button) and its fly down the front - the placket's stitched edge to one side, curving in
    // at its foot to the seam on down to the crotch: trousers, never a leotard's line)
    // (in swimwear: her bottoms on her bare hips - a bikini's, a one-piece's leg line and gusset - with the skin of her hips
    // and seat beside them, her ties, what goes over it; his swim shorts - world/Swimwear.js)
    if (OF.swim) { SWB = SW.swimBody({ T, J, F, OF, fem, Q, n, band, legRad, legForm, neck, lo, tight, fS: fSeam, oSide, L: SWL }); parts[mat].push(...SWB.cloth); parts.skin.push(...SWB.skin); parts.sheer.push(...SWB.sheer); parts.top.push(...SWB.top); parts.legs.push(...SWB.legs); if (SWB.bottom.length) (mats.bottom ? parts.bottom : parts[mat]).push(...SWB.bottom); if (SWB.metal.length) { metalM(); parts.metal.push(...SWB.metal); } }
    const TH = ['R', 'L'].map((s) => J['hip' + s].clone().setZ(J['hip' + s].z * (fem ? 0.94 : 0.86))), yH = (TH[0].y + TH[1].y) / 2;
    const trFront = (top, out, noFly) => {
      // (jeans: their waistband level on the hip bones, its five belt loops, the shank button, the fly's stitched placket,
      // the front pockets' curved openings and their rivets; tailored trousers the same band, loops, button and fly, their
      // pockets slanted, no rivets - Clubwear.waistband)
      if (OF.crop) { const W = waistband(T, top, out, { n, Q, tailored: cut !== 'jeans' }); parts.legs.push(...W.band); if (W.metal.length) { metalM(); parts.metal.push(...W.metal); } return; }
      if (noFly) return;
      const f1 = OF.crop ? top - 0.034 : lo + 0.004, f0 = fOf(TH[0].clone().lerp(TH[1], 0.5)) - 0.015, ax = (f) => 0.075 * ss3(f0, f0 + 0.05, f);
      if (!(f1 > f0 + 0.04)) return;
      parts.legs.push(tint(panel(T, f0, f1, (f) => ax(f) - 0.006, (f) => ax(f) + 0.006, (f, a) => out(f, a) + 0.0011, { rows: 6, cols: 2, th: 0.001 }), 0.6), tint(panel(T, f0 - 0.06, f0 + 0.02, () => -0.006, () => 0.006, (f, a) => out(f, a) + 0.0011, { rows: 4, cols: 2, th: 0.001 }), 0.6));
    };
    if (pz) { parts.legs.push(pz); if (Q >= 0.6 && OF.rise) trFront(OF.rise, OF.crop ? shellOut(T, pz, 0.0035) : () => 0.0035, true); }   // (its band on the wide legs' own shell - Clubwear.shellOut)
    // (sitting under a sheer layer: the dress beneath close on her, the sheer's own seat over it - nothing of it through)
    // (a lace laid on its lining has no sheer skirt of its own: no sheer seat either - the lining's own is the lace's)
    else if (lap) { parts[skP].push(B(T.fLo, OF.skirt.rise ?? 0.29, OF.sheer?.hem ? 0.0035 : 0.006, { rows: 9, cap: 'lo', hem: 'hi' })); if (OF.sheer?.hem) parts.sheer.push(B(T.fLo, 0.27, 0.009, { rows: 7, m: 32, cap: 'lo', hem: 'hi', th: 0.003 })); }
    // (a cover-up's sheer dress over swimwear, sitting: its own seat over the bottoms - world/Swimwear.js)
    else if (swLap) parts.sheer.push(B(T.fLo, OF.sheer.lo ?? 0.27, 0.009 + (OF.sheer.ease || 0), { rows: 7, m: 32, cap: 'lo', hem: 'hi', th: 0.003 }));
    else if (cut) {
      // (his swim shorts (OF.swim 'm'): low on the hips at their own rise, standing a little off him)
      const tTop = toBelt ? 0.29 : OF.crop || OF.swim ? OF.rise ?? 0.31 : Math.min(0.2, lo + 0.22), tOut = (f) => (toBelt ? 0.004 : 0.002) + (cut === 'wide' ? 0.004 * ss3(0.1, -0.2, f) : 0) + (OF.swim ? 0.004 : 0);
      // (each thigh as the legs below build it: their cut's radius, her leg's own form)
      const fit = CUTS[cut] || CUTS.straight, LG = TH.map((h, i) => {
        const k = i ? J.kneeL : J.kneeR, L1 = h.distanceTo(k), L = L1 + k.distanceTo(i ? J.ankleL : J.ankleR), tk = L1 / L, lr = legRad(F.leg, tk, fem), fm = fem ? legForm(F.leg, tk, i ? 1 : -1) : null;
        const tr = (t) => fit[0] * lr(t) + (1 - fit[0]) * (F.leg[0] * (1 - t) + fit[2] * t) * (cut === 'wide' ? 1 + 0.25 * t * t : 1) + fit[1];
        return { P0: h, d1: k.clone().sub(h).normalize(), L, tj: tk, rad: cut === 'wide' ? (t) => { const w = ss3(0.04, 0.42, t); return (lr(t) + 0.005) * (1 - w) + tr(t) * w; } : tr,
          back: (t) => 0.004 * gau(t - tk - 0.25, 0.15) + (fm ? fm.hb(t) + fit[0] * fm.back(t) : 0), ka: fm ? (t, a) => 1 + fit[0] * (fm.ka(t, a) - 1) : null };
      });
      parts.legs.push(legBlend(legTuck(B(T.fLo, tTop, tOut, { rows: 9, cap: 'lo', hem: 'hi' }), LG, yH, nFw, (y) => T.c((y - T.A.y + 0.11) / T.H)), LG));
      if (Q >= 0.6 && !toBelt && !OF.swim && (OF.rise || OF.point)) trFront(tTop, tOut);
    }
    // (a belt at the waist: a band in the accent colour, or a sash of the cloth tied at the side)
    if (OF.belt === 1) { const bo = (sk ? 0.006 : 0) + 0.009; parts.accent.push(B(0.27, 0.335, bo, { rows: 3, hem: 'both', th: Math.max(0.004, bo - tight + 0.001) })); }
    // (its edges turned in to the cloth beneath it - the coat, the dress - nothing to see into from above)
    if (OF.belt === 'tie') { const bo = kit === 'trench' && sk ? 0.026 : 0.012; parts.top.push(tint(B(0.27, 0.33, bo, { rows: 3, hem: 'both', th: Math.max(0.004, bo - (JK && sk ? JK.out : tight) + 0.001) }), 0.82)); if (Q >= 0.6) {
      // (a wrap gown's knot where its crossover ends, on the bare side's hip, its two ends hanging down the skirt a hand's
      // length - flat ribbons of its cloth, one a little longer)
      const ka = OF.wrapLine ? -oSide * 0.95 : 0.75, kp = T.pt(0.3, ka, 0.02); for (const s of [-1, 1]) { const g = new THREE.SphereGeometry(0.016, n(10), n(6, 2)); g.scale(0.5, 1, 1.5); g.rotateX(s * 0.7); g.translate(kp.x, kp.y - 0.01, kp.z + s * 0.018); parts.top.push(tint(g, 0.82)); }
      if (OF.wrapLine) {
        const rd = T.pt(0.3, ka, 0.03).sub(T.pt(0.3, ka, 0.02)).normalize();
        for (const s of [-1, 1]) {
          const cv = new THREE.CatmullRomCurve3([0.285, 0.2, 0.11, 0.02, -0.05 - 0.03 * s].map((f, i) => T.pt(f, ka + s * 0.07 * (0.4 + 0.15 * i), 0.016 + 0.003 * i))), S = n(12, 6), R = 5, g = new THREE.TubeGeometry(cv, S, 0.012, R, false), G = g.attributes.position, c = V(0, 0, 0), p = V(0, 0, 0);
          for (let i = 0; i <= S; i++) { cv.getPointAt(i / S, c); const w = 1 - 0.3 * (i / S); for (let j = 0; j <= R; j++) { const q = i * (R + 1) + j; p.fromBufferAttribute(G, q).sub(c); p.addScaledVector(rd, -0.72 * p.dot(rd)).multiplyScalar(w).add(c); G.setXYZ(q, p.x, p.y, p.z); } }
          g.deleteAttribute('uv'); g.computeVertexNormals(); parts.top.push(tint(g, 0.86));
        }
      }
    } }
    if (JK) {
      // the jacket: open at the front, its lapels laid back either side (a blazer's button at the waist; a bomber's ribbed hem, cuffs and collar)
      // (closed with one button at the waist (OF.jkBtn: its height): its fronts meeting there, opening in a V above it to its
      // lapels, cut away below it toward the hem)
      const jh = JK.coat && sk ? 0.22 : JK.hem, jB = OF.jkBtn, hw = jB ? (f) => (f < jB ? 0.03 + 0.2 * ss3(jB, jh, f) : 0.03 + (JK.open(f) - 0.03) * ss3(jB, jB + 0.24, f)) : JK.open;
      // (lined: the same a hair inside it, facing in, in shadow - looking in at its open front or its top by the collar
      // finds cloth, never the far side's back)
      // (standing a little further off over the shoulders' round - its padding - the top beneath kept under it there; and
      // toward its hem, over the seat - as its cut has it)
      // (hers falling clear of the tops of her thighs and her hips at its hem, in front and at the sides, a share of the
      // thigh's own round - straight behind, off the seat; its rows closer over her bust, the cloth beneath never through it)
      // (one cut to stand well off her (nOut) drawn in round the base of the neck, where its collar sits)
      // (a loose shirt over her swimwear (JK.fall) hanging straight down behind from the fullest round of her seat - never
      // drawn in under it, where the swimwear beneath would come through it: the most her torso stands out at that angle
      // anywhere from there up)
      const fallR = (f, a) => T.pt(f, a, 0).sub(T.c(f)).setY(0).length(), jFall = JK.fall && fem ? (f, a) => { const b = Math.abs(Math.atan2(Math.sin(a), Math.cos(a))), w = ss3(1.5, 2.3, b); if (w <= 0 || f > 0.06) return 0; let r = 0; for (let g = 0.06; g > f; g -= 0.012) r = Math.max(r, fallR(g, a)); return w * Math.max(0, r - fallR(f, a)); } : null;
      const jOut = (f, a = 0) => JK.out + 0.005 * ss3(0.8, 0.93, f) + (JK.nOut != null ? (JK.nOut - JK.out - 0.005) * ss3(0.94, 0.99, f) : 0) + JK.flare * ss3(0.16, -0.09, f) + (jFall ? jFall(f, a) : 0) + (fem ? 0.2 * F.leg[0] * ss3(0.14, jh, f) * (1 - ss3(1.7, 2.3, Math.abs(Math.atan2(Math.sin(a), Math.cos(a))))) : 0)
        + (JK.sh ? JK.sh * ss3(0.84, 0.94, f) * ss3(0.995, 0.965, f) * gau(Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) - Math.PI / 2, 0.5) : 0);   // (a padded shoulder: squared out over the arm)
      parts.top.push(panel(T, jh, 0.99, hw, (f) => 2 * Math.PI - hw(f), jOut, { rows: JK.rows || (JK.coat && sk ? 13 : fem ? 24 : 19), cols: JK.cols || 32, curv: fem ? null : shD }), lining(panel(T, jh, 0.99, hw, (f) => 2 * Math.PI - hw(f), (f, a) => jOut(f, a) - 0.0025, { rows: fem ? 12 : 10, cols: 20, th: 0 })));
      // (notched lapels from the top button, their collar round the back of the neck)
      // (a coat's the same, its collar lying round the back of the neck on its shoulders - no funnel standing off the neck)
      if (JK.lapel) lapels(hw, jB ? jB + 0.02 : JK.lapV, 0.84, 0.97, JK.lapel, (f) => jOut(f) + 0.004, true);
      if (jB) { const bp = T.pt(jB, 0, jOut(jB) + 0.004), bt = new THREE.SphereGeometry(0.0085, n(10), n(8, 2)); bt.scale(0.45, 1, 1); bt.translate(bp.x, bp.y, bp.z); parts.shoe.push(bt); }
      else if (JK.coat) parts.top.push(collar(0.04, JK.out + 0.004, 0.022));
      if (JK.rib) { parts.top.push(tint(panel(T, JK.hem - 0.012, JK.hem + 0.05, hw, (f) => 2 * Math.PI - hw(f), JK.out - 0.003, { rows: 3, cols: 34 }), 0.75)); parts.top.push(tint(collar(0.03, 0.014), 0.75)); }
      if (JK.button) { const bp = T.pt(0.45, 0, JK.out + 0.004), bt = new THREE.SphereGeometry(0.0085, n(10), n(8, 2)); bt.scale(0.45, 1, 1); bt.translate(bp.x, bp.y, bp.z); parts.shoe.push(bt); }
      loose = JK.loose;
    }
    tS = JK ? JK.sleeve ?? 1 : OF.sleeve ?? 1; if (!JK) loose = tight;   // (an open shirt's sleeves rolled to the forearm, a resort shirt's short: JK.sleeve)
    if (sk && laceWaist) laceWaistLit(sk);   // (lit as one cloth where it comes out from under the bodice - world/Lace.js)
    if (sk) parts[skP].push(OF.ribs && Q >= 0.6 ? ribbed(sk, n(44, 10)) : OF.sparkle && Q >= 0.6 ? sparkle(sk) : OF.ruched && Q >= 0.6 ? gathers(sk, T, 'ruched', -oSide) : sk);
    // (a sheer layer over it all (OF.sheer: mesh, or lace) - its own neckline, lying on her skin above the dress beneath
    // and on the dress below that; its sleeves (the arms, below); its own hem over the dress's, falling as a skirt does)
    if (OF.sheer) {
      const SH = OF.sheer, n1 = NECK[SH.neck] || NECK.crew, sNeck = (a) => { const v = n1(a); return v + nShift * ss3(0.85, 0.95, v) * (0.35 + 0.65 * ss3(0.3, 1.4, Math.abs(a))); };
      // (over swimwear (OF.swim): from its own foot (SH.lo) - the dress itself, a bikini's midriff bare under it - standing
      // as far off her as it is cut (SH.ease: a kaftan's loose))
      // (a lace's yoke (OF.lace, not over swimwear): only above the dress's own neckline - the lace laid on the dress below
      // it - from the dress's edge up to its own, lying on the skin a few millimetres off it, so the skin's own facets never
      // come through it: no second layer standing off the dress)
      const yoke = !!OF.lace && !OF.swim;
      parts.sheer.push(lacey(B(yoke ? (a) => neck(a) - 0.002 : OF.swim ? SH.lo ?? 0.27 : toBelt ? 0.27 : lo, sNeck, yoke ? (f, a) => 0.0042 + 0.012 * gau(Math.abs(a) - Math.PI / 2, 0.55) * ss3(fArm - 0.06, fAc, f) * (1 - ss3(fAc, fSeam, f)) : (f, a) => 0.0035 + (SH.ease || 0) + (tight + 0.003) * ss3(neck(a) + 0.03, neck(a) + 0.006, f) + 0.012 * gau(Math.abs(a) - Math.PI / 2, 0.55) * ss3(fArm - 0.06, fAc, f) * (1 - ss3(fAc, fSeam, f)), { rows: fem ? (yoke ? 10 : OF.swim ? 15 : 18) : 8, m: fem ? 40 : 30, hem: 'both', th: 0.003 }), SH.lace));   // (a yoke's few rows over its short span; a cover-up's a few less, loose over swimwear)   // (hers fine enough to follow the bust's round over the dress beneath - never a flat facet with the dress through it)
      // (over the dress's own skirt, clear of it however closely both follow the legs: worn over it - its own room)
      // (close over it - a couple of millimetres off the dress, never a shell standing off her - its hem a net's, uneven)
      // (a lace's hem its own scallops; a mesh's a clean turned hem - a sheer skirt only where it has a hem of its own)
      const ss = SH.hem && (sk || (OF.swim === 1 && DRESS_POSES.has(pose))) && skirt(J, F, T, { hem: SH.hem, drop: SH.drop || 0, edge: SH.lace ? 0.006 : 0, taper: SH.taper || 0, flare: SH.flare ?? 0.05, cling: SH.cling ?? 0.4, slit: SH.slit || 0, side: oSide, m: 32, over: 1, stride }, 0.0075 + (SH.ease || 0));
      if (ss) parts.sheer.push(lacey(ss, SH.lace));
    }
    // (a lace's scalloped hem past its lining (OF.lace.edge), or a deep lace hem below a slip's satin (hemBand) - hanging on
    // from the skirt's own hem as it falls: world/Lace.js)
    if (sk && mats.laceEdge && (LK.edge || LK.hemBand)) { const h = laceHem(sk, LK.kind, { field: LK.hemBand || 0 }); if (h) { if (h.field) parts.sheer.push(h.field); parts.laceEdge.push(h.edge); } }
    // (a fine chain round the base of the neck, resting on the skin there: higher behind, dipping in front, its pendant at the dip
    // - as the kit has it, or as she wants it (jewel.chain))
    // (a kit's own chain left off under a choker - one piece at the throat, never two stacked; one she asks for kept)
    if (typeof JW.chain === 'boolean' ? JW.chain : OF.chain && !(JW.choker === 'metal' || JW.choker === 'ribbon' || [].concat(o.acc || []).includes('choker'))) {
      // (lying on her all round: on the base of the neck behind and at the sides, just under the seam (Lb - a share of the
      // seam's height over the collarbones: on the skin there, never on the neck's flare, where the neck's and the chest's
      // surfaces meet and a curve crossing between them kinks out), dipping only toward the front to the collarbones (Lf),
      // where its pendant hangs on the chest - over the cloth where she is covered, eased over its edge, never stepping up
      // on to it. A closed curve on the skin, smoothed as a chain's weight lays it, a fine round wire along it)
      // (his longer: hanging down into an open shirt's V (camp) - under its collar either side, seen in the V - or lying on
      // a T-shirt below its neckline)
      const Lb = -0.08 * (fSeam - fAc) * tH, Lf = fem ? -0.5 * (fSeam - fAc) * tH : OF.camp ? (0.86 - fSeam) * tH : -(fSeam - fAc) * tH, oc = 0.0026, on = (f, a) => oc + (!fem && OF.camp ? -0.005 : tight + 0.004) * ss3(-0.006, 0.012, neck(a > Math.PI ? a - 2 * Math.PI : a) - f), CP = [];
      for (let j = 0; j < 40; j++) {
        const a = (j / 40) * 2 * Math.PI, c = Math.cos(a), L = Lf + (Lb - Lf) * (1 - ((1 + c) / 2) ** 3.5), f = fSeam + L / tH;
        CP.push(L >= 0 ? nRing(L + c * NP.rF(L) * NK.lean, a, oc) : ((q) => q.add(nFil(q, a)))(T.pt(f, a, on(f, a) + scm(L, a))));
      }
      for (let it = 0; it < 6; it++) { const Q0 = CP.map((p) => p.clone()); for (let j = 0; j < 40; j++) CP[j] = Q0[(j + 39) % 40].clone().add(Q0[(j + 1) % 40]).multiplyScalar(0.25).addScaledVector(Q0[j], 0.5); }
      const ch = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(CP, true), n(32, 12), 0.0022, n(4, 3), true); metalM(); parts.metal.push(ch);
      const fp = fSeam + (Lf - 0.008) / tH, pp = T.pt(fp, 0, on(fp, 0) + 0.005 + scm(Lf - 0.008, 0)), pd = new THREE.SphereGeometry(0.0062, n(8), n(6, 2)); pd.translate(pp.x, pp.y, pp.z); parts.metal.push(pd);
    }
  } else {
    // (a race suit, a marshal's overalls: one piece - the legs' darker shade below the waist; a polo shirt or a team
    // jacket over trousers)
    const one = kit === 'suit' || kit === 'marshal';
    parts.legs.push(B(T.fLo, one ? 0.31 : 0.24, one ? 0 : 0.004, { rows: 9, cap: 'lo' }));
    // (its body, a polo's, a jacket's, ending under its collar - sewn into it at the seam, never on up the neck's flare
    // under its skin)
    // (a one-piece's: over the legs' shade at the waist by a hair (its lowest few centimetres), its edge turned under to it -
    // one clean line where the shade starts, never the two crossing in a ragged one)
    // (his tops' rows closer over his shoulders' round, as round there as he is: curv - his sleeves grown out of it, armM)
    if (one) parts.top.push(B(0.29, fSeam - 0.004, (f) => 0.0016 * ss3(0.34, 0.3, f), { rows: 18, hem: 'lo', cap: 'hi', th: 0.002, curv: shD }));
    // (its hem standing off the trousers turned in under itself all the way to them (th: its stand-off less theirs, and a
    // hair) - looking up under it, the cloth's underside in its shadow, never a slot through to whatever is behind him)
    else { topOver = { fH: -0.08, out: (f) => (kit === 'jacket' ? 0.014 : 0.008) + 0.01 * ss3(0.06, -0.08, f) }; parts.top.push(B(-0.08, fSeam - 0.004, topOver.out, { rows: 20, hem: 'lo', cap: 'hi', th: topOver.out(-0.08) - 0.004 - 0.0015, curv: shD })); }
    if (one) for (const f of kit === 'marshal' ? [0.62, 0.38] : [0.6]) parts.accent.push(B(f, f + 0.055, 0.004, { rows: 2, hem: 'both' }));
    if (kit === 'jacket') parts.team.push(B(0.8, fSeam, 0.018, { rows: 6, hem: 'lo', cap: 'hi', curv: shD }));
    if (kit === 'polo' && Q >= 0.6) parts.accent.push(panel(T, 0.84, fFront, () => -0.07, () => 0.07, 0.011, { rows: 4, cols: 3 }));
    // the collar: a race suit's stand-up collar, a polo's turned down, a jacket's
    // (its foot on the cloth it is sewn to: the suit's own, the shirt's or the jacket's yoke, standing off the torso)
    const onC = one ? 0 : kit === 'jacket' ? 0.018 : 0.008;
    if (kit === 'polo') parts.accent.push(collar(0.03, 0.008, 0.009, undefined, undefined, undefined, onC)); else parts.top.push(collar(0.04, 0.008, -0.003, undefined, undefined, undefined, onC));
    if (kit === 'suit' && Q >= 0.6) for (const s of [shR, shL]) { const e = new THREE.BoxGeometry(0.075, 0.007, 0.024); e.rotateY(Math.PI / 2); e.rotateX(Math.sign(s.z) * 0.3); const p = s.clone().lerp(nb, 0.42); e.translate(p.x - 0.004, p.y + F.del * 0.55, p.z); parts.top.push(tint(e, 0.8)); }   // (the epaulettes a marshal lifts a driver out by)
    tS = kit === 'polo' ? 0.31 : 1; loose = kit === 'suit' ? 0.003 : kit === 'jacket' || kit === 'marshal' ? 0.008 : 0.004;
  }
  // the neck: up from the seam - flared there into the collarbones and the trapezius - slimming, past the chin into the
  // head: one smooth surface (no seam round it, its normals smooth all along), in the jaw's shadow under the chin. Under
  // clothes up to it, its foot sunk deep in the chest, below the collarbones, filling the torso's top there; over a bare
  // neckline the same surface carried on down over the chest to the neckline - no line where neck and chest meet
  {
    // (her chest bare above a low neckline (skinEdge): its columns closer together across the front, its rows closer by the
    // cloth's edge - room for its shading to be smooth (chestShade); FA: each of the chest's points' f, angle and the cloth's edge there)
    // (her bust lifted in a structured bodice (F.lift): the closer still at the midline, for the narrow crease where its
    // rounds meet - ~0.01 rad apart there - and the fewer behind the neck)
    // (his bare torso (OF.bareTop): the same surface on down to his shorts - its columns closer across his front, its rows
    // by its form (BS: closest about the navel, over the chest); his belly's own quiet form on it (BL: Swimwear.bellyOf))
    const bT = !!OF?.bareTop && !!skinFoot, dp = !!skinEdge, LF = dp ? F.lift || 0 : 0, K = n(16, 6), M = n(dp ? (LF ? 42 : 48) : bT ? 48 : 32, 10), h0 =-((fSeam - fAc) * tH + 0.5 * NK.rBase), h1 = sPiv + 0.45 * NK.rTop, R = [], FA = [], FB = [];
    const BL = bT && Q >= 0.6 ? SW.bellyOf(T, skinFoot(0) + 0.03, 0.2126 * skinC.r + 0.7152 * skinC.g + 0.0722 * skinC.b) : null;
    // (bare to a low neckline, closer still either side of the midline - for the crease between the rounds, ~0.02 rad
    // apart there - their spacing changing smoothly round (no steps in it: none in the light on the skin))
    const A = bT ? Array.from({ length: M }, (_, j) => { const u = (j / M) * 2 * Math.PI - Math.PI; return u - 0.55 * Math.sin(u); }) : !dp ? Array.from({ length: M }, (_, j) => (j / M) * 2 * Math.PI) : (() => {
      const G = 1024, du = (2 * Math.PI) / G, C = [0], out = [];
      for (let i = 0; i < G; i++) { const u = (i + 0.5) * du, a = u - 0.45 * Math.sin(u), am = Math.min(a, 2 * Math.PI - a); C.push(C[i] + du * (M / (2 * Math.PI) + (40 * gau(am, 0.15) + 50 * LF * gau(am, 0.05)) * (1 - 0.45 * Math.cos(u)))); }
      const m = Math.round(C[G]);
      for (let k = 0, i = 0; k < m; k++) { const c = (k * C[G]) / m; while (C[i + 1] < c) i++; const u = (i + (c - C[i]) / (C[i + 1] - C[i])) * du; out.push(u - 0.45 * Math.sin(u)); }
      // (up a steep side of it - a halter's, a plunge's V - the cloth's own columns (skinEdge.angs: closer there, band's
      // follow), the skin's edge on the cloth's edge point for point: never a long straight span from one column's edge to
      // the next's, far up the V, across the hollow under the collarbones - standing out through the cloth and through
      // the skin's own rows above it in a pale facet, slivers along the edge. Only as many as keep each span's rise under
      // a share of her torso (dF) and the cloth's edge beside each from leaving a gap wider than a share of its stand-off
      // between them; above the seam each gathered on to its neighbour (gatherCols) - the neck's own columns)
      const BA = skinEdge.angs; if (!BA || Q < 0.6) return out;
      const w2 = (a) => (a < 0 ? a + 2 * Math.PI : a), dw = (x, y) => Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y))), E = (a) => Math.min(skinEdge.f(a), fSeam), nb = BA.length, ins = [];
      for (let k = 0; k < nb; k++) {
        const a = BA[k]; if (Math.abs(a) > 1.25) continue;
        const ap = BA[(k + 1) % nb], am = BA[(k + nb - 1) % nb], sp = 0.5 * dw(ap, am);
        if (Math.abs(E(ap) - E(am)) < 0.6 * sp) continue;
        const b = w2(a); if (out.every((o) => dw(o, b) > 0.5 * sp)) ins.push([b, sp]);
      }
      if (!ins.length) return out;
      const all = out.filter((o) => !ins.some(([b, sp]) => dw(o, b) < 0.45 * sp)).map((a) => [a, 0]).concat(ins.map(([b]) => [b, 1])).sort((x, y) => x[0] - y[0]), kl = [], dF = 0.06, tP = 0.15 * skinEdge.out;
      for (let j = 0; j < all.length; j++) {
        if (all[j][1] && kl.length && j + 1 < all.length) {
          const a0 = kl[kl.length - 1][0], a1 = all[j + 1][0], e0 = E(a0), e1 = E(a1), sc = T.sec(0.5 * (e0 + e1)), kP = tH / Math.sqrt(1 + (((e1 - e0) / Math.max(1e-4, a1 - a0)) * tH / (0.5 * (sc[0] + sc[1]))) ** 2);
          let ok = Math.abs(e1 - e0) <= dF;
          for (const b0 of BA) { if (!ok) break; const b = w2(b0); if (b > a0 && b < a1) ok = (e0 + ((e1 - e0) * (b - a0)) / (a1 - a0) - E(b0)) * kP <= tP; }
          if (ok) continue;
        }
        kl.push(all[j]);
      }
      const A2 = kl.map((x) => x[0]); A2.ins = kl.map((x) => x[1]); return A2;
    })();
    const up = (i) => h1 * (i / K) ** 1.25;
    if (skinFoot) {
      // (the chest's rows, closer together toward the seam; then the neck's, level across at first - from the seam's own
      // ring - turning to the neck's own toward the chin)
      // (deep: a row under the cloth, the next along its edge, then closer together toward the edge and the seam than between)
      const wa = A.map((a) => (a > Math.PI ? a - 2 * Math.PI : a)), lo = wa.map(skinFoot), ed = dp ? wa.map((a) => Math.min(skinEdge.f(a), fSeam)) : null, yOf = (p) => p.clone().sub(nb).dot(nAx), ay = an.dot(nAx);
      const BS = bT ? (() => { const l0 = lo[0], N = 96, cum = [0], sp = (f) => 0.028 - 0.019 * gau(f - 0.235, 0.03) - 0.008 * gau(f - 0.66, 0.1) - 0.01 * ss3(fSeam - 0.15, fSeam, f); for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + (fSeam - l0) / N / sp(l0 + (fSeam - l0) * (i - 0.5) / N)); const Rn = Math.max(6, Math.round(cum[N] * Q)), us = []; for (let r = 0; r <= Rn; r++) { const t = cum[N] * r / Rn; let i = 1; while (i < N && cum[i] < t) i++; us.push(Math.min(1, (i - 1 + (t - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])) / N)); } return us; })() : null;
      const r1 = BS ? BS.length - 1 : dp ? n(skinEdge.f(0) < 0.62 ? 20 : 18, 6) : n(Math.min(12, Math.max(3, Math.round(30 * (fSeam - Math.min(...lo))))) + 2, 3);
      // (within a low neckline's front - a plunge's V - its rows level across from the edge's lowest (fm) up, but for each
      // column's first few, along its own edge (eZ): no long slivers slanting up a V's sides for the shading across it)
      const fm = dp ? Math.min(...ed) : 0, eZ = 0.045, sF = dp ? skinEdge.out + 0.004 : 0, colF =(e, w) => { const wg = (e + eZ - fm) / (fSeam - fm); return !(wg < 1) ? e + (fSeam - e) * w : w <= wg ? e + (eZ * w) / wg : fm + (fSeam - fm) * w; };
      for (let i = 0; i <= r1; i++) {
        const s = BS ? BS[i] : 1 - (1 - i / r1) ** 2, t = (i - 1) / (r1 - 1), w = 0.75 * t * t * (3 - 2 * t) + 0.25 * t;
        R.push(wa.map((a, j) => { const f = !dp ? lo[j] + (fSeam - lo[j]) * s : i ? colF(ed[j], w) : lo[j]; if (dp) FA.push(f, a, ed[j]); if (BL) FB.push(f, a); const p = T.pt(f, a, (i ? scm((f - fSeam) * tH, a) : dp ? -sF : 0) + (BL ? BL.out(f, a) : 0)); return i ? p.add(nFil(p, a)) : p; }));
        // (and halfway from its foot to the cloth's edge, under the cloth: the foot reaching well down beside a steep edge,
        // never one long straight span across the hollow under the collarbones, standing out through the cloth - and sunk
        // under her skin toward the foot (sF: the cloth's own stand-off and a little): across the hollow between the bust's
        // rounds its straight spans stay under the cloth too)
        if (dp && !i) R.push(wa.map((a, j) => { const f = 0.5 * (lo[j] + ed[j]); FA.push(f, a, ed[j]); return T.pt(f, a, -0.5 * sF); }));
      }
      const iS = R.length - 1;
      for (let i = 1; i <= K; i++) {
        const h = up(i), w = 1 - ss3(0.5 * sChin, 1.5 * sChin, h);
        R.push(A.map((a) => { let hh = h; for (let t = 0; t < 3; t++) hh += w * (h * ay - yOf(nRing(hh, a))) / ay; return nRing(hh, a); }));
      }
      // (no crease where the neck rises out of the chest: its rows, the chest's and the neck's, on the curve the skin takes
      // from the one into the other - nFil, nRing; none where cloth covers her up to the seam)
    } else {
      // (a few rings down its sunk foot; the rest from just under the seam up, where it shows)
      const hs = [h0, 0.6 * h0, 0.3 * h0, 0.16 * h0, ...Array.from({ length: K + 1 }, (_, i) => 0.08 * h0 * (1 - i / K) + up(i))];
      for (const h of hs) R.push(A.map((a) => inT(nRing(h, a))));
      R.unshift(Array(M).fill(inT(nAt(h0 - 0.008))));
    }
    R.push(Array(A.length).fill(nAt(h1 + 0.008)));
    globalThis.__JNR?.({ R, A, NK, NP, sChin, sPiv, fSeam, fAc, tH, nb, an, fwN, nSd, T, J, F });   // TEMP joins fixer hook - REMOVE
    // (its shading kept for her arms, where they grow out of it: T.arms; the cloth's columns up a steep neckline's side only
    // as far as the seam, the last of the chest's rows (FA))
    const g = gatherCols(loft(R), A, FA.length / (3 * A.length) - 1), P = g.attributes.position, C = new Float32Array(P.count * 3), p = V(0, 0, 0), sh = skinSh = dp ? chestShade(T, F, skinEdge.f, skinEdge.out, fSeam, 0.2126 * skinC.r + 0.7152 * skinC.g + 0.0722 * skinC.b) : null;
    for (let i = 0; i < P.count; i++) {
      p.set(P.getX(i), P.getY(i), P.getZ(i)).sub(nb); const h = p.dot(an), fr = p.dot(fwN) / Math.max(0.01, NP.r(h));
      const k = 1 - (0.08 + 0.14 * ss3(-0.2, 0.7, fr)) * ss3(sChin - 0.03, sChin + 0.006, h); C[i * 3] = C[i * 3 + 1] = C[i * 3 + 2] = k;
      if (sh) { const c = 3 * i < FA.length ? sh(P.getX(i), P.getY(i), P.getZ(i), FA[3 * i], FA[3 * i + 1], FA[3 * i + 2]) : sh(P.getX(i), P.getY(i), P.getZ(i), null, 0, 0); C[i * 3] *= c[0]; C[i * 3 + 1] *= c[1]; C[i * 3 + 2] *= c[2]; }
      if (BL && 2 * i < FB.length) { const c = BL.col(FB[2 * i], FB[2 * i + 1]); C[i * 3] *= c[0]; C[i * 3 + 1] *= c[1]; C[i * 3 + 2] *= c[2]; }
    }
    g.setAttribute('color', new THREE.BufferAttribute(C, 3)); parts.skin.push(g);
    // (bare to a low neckline: the chest's normals eased into their neighbours' - its closely spaced rows by the cloth's
    // edge and its columns across the midline otherwise catch a dewy skin's light as thin lines over the chest)
    if (dp) {
      const Nm = g.attributes.normal.array, W = A.length, rows = Math.min(R.length - 2, FA.length / 3 / W + 2);
      for (let it = 0; it < 6; it++) {
        const N0 = Nm.slice();
        for (let k = 1; k < rows; k++) for (let j = 0; j < W; j++) {
          const i3 = (k * W + j) * 3; let x = 2 * N0[i3], y = 2 * N0[i3 + 1], z = 2 * N0[i3 + 2];
          for (const q of [((k - 1) * W + j) * 3, ((k + 1) * W + j) * 3, (k * W + (j + 1) % W) * 3, (k * W + (j + W - 1) % W) * 3]) { x += N0[q]; y += N0[q + 1]; z += N0[q + 2]; }
          const l = Math.hypot(x, y, z) || 1; Nm[i3] = x / l; Nm[i3 + 1] = y / l; Nm[i3 + 2] = z / l;
        }
      }
    }
    // (by her shoulders, where her arms grow out of it (T.arms: a share of the deltoid round each joint), its light the
    // torso's own true round - as the arms' is, laid over it there: no patch of other light where they meet)
    if (armB && skinFoot) {
      const Pn = g.attributes.position, Nn = g.attributes.normal, q = V(0, 0, 0), SJ = ['R', 'L'].map((s) => J['sh' + s].clone().setZ(J['sh' + s].z * F.sh));
      for (let i = 0; i < Pn.count; i++) {
        q.fromBufferAttribute(Pn, i); const w = ss3(2.4 * F.del, 1.4 * F.del, Math.min(SJ[0].distanceTo(q), SJ[1].distanceTo(q))) * ss3(fSeam, fAc, fOf(q)); if (w <= 0) continue;
        const n2 = T.near(q).n, x = Nn.getX(i) + (n2.x - Nn.getX(i)) * w, y = Nn.getY(i) + (n2.y - Nn.getY(i)) * w, z = Nn.getZ(i) + (n2.z - Nn.getZ(i)) * w, l = Math.hypot(x, y, z) || 1; Nn.setXYZ(i, x / l, y / l, z / l);
      }
      sideG.push([g, 0]);
    }
    // (lifted (LF): only where the pressed rounds meet, the crease's own light - its midline points' averaged normals
    // otherwise face straight out and catch the sheen as a bright line - turned a little down, as narrow as the crease's
    // shading (chestShade), from the cleavage's foot to its top; below it, down the breastbone between a plunge's edges,
    // the skin's own light: the crease's dark there is its colour's alone, a share of her skin's)
    if (LF) {
      const N = g.attributes.normal, fA = (F.bf ?? 0.655) + 0.02, nn = V(0, 0, 0);
      for (let i = 0; 3 * i < FA.length; i++) {
        const tc = FA[3 * i] - fA, w = ss3(-0.08, -0.045, tc) * (1 - ss3(0.03, 0.1, tc)) * gau(FA[3 * i + 1], 0.025 + 0.03 * clamp01(tc + 0.04)); if (w < 0.01) continue;
        nn.fromBufferAttribute(N, i).multiplyScalar(1 - 0.4 * w).addScaledVector(nAx, -0.28 * w).normalize(); N.setXYZ(i, nn.x, nn.y, nn.z);
      }
    }
  }
  // ---- arms and hands ----
  // (handOn: the hands laid on the body - on a hip - which hold nothing: a clutch goes in a hand left free)
  // (sitting - each thigh near level, each shin hanging near upright: a skirt past the knee falls from the knees (laps))
  const hangs = ['R', 'L'].every((s) => { const h = J['hip' + s], k = J['knee' + s], a = J['ankle' + s]; return (k.y - a.y) > 0.8 * k.distanceTo(a) && Math.abs(h.y - k.y) < 0.4 * h.distanceTo(k); });
  // (lapsS: a sheer layer's own over the dress's, sitting - over the thighs, across the lap, falling from the knees)
  const hk = F.hk, laps = {}, lapsS = {}, tS0 = tS, handOn = {}, armSk = [];
  for (const s of ['R', 'L']) {
    const sh = s === 'R' ? shR : shL, el = J['el' + s], wr = J['wr' + s], P = [sh, el, wr], L1 = sh.distanceTo(el), tj = L1 / (L1 + el.distanceTo(wr)), rad = armRad(F.arm, tj, F.del, fem, (!!JK && !JK.soft) || kit === 'jacket');   // (a shirt's soft shoulder: no padding)
    // (a one-shoulder's covered side: the dress's own cap over the top of that arm, wrapping the deltoid - the other bare)
    const tS = OF?.neck === 'one' ? (s === (oSide > 0 ? 'L' : 'R') ? 0.1 : 0) : tS0;
    // (the top of her arm deeper in her shoulder the higher it is raised (cA: its dome's height for its width) - no end of it
    // showing under the arm, the shoulder's round taken in beside it: torsoOf)
    const cA = fem ? 0.5 + 0.8 * ss3(-0.8, -0.2, el.clone().sub(sh).normalize().y) : 0.5;
    // (cloth over an arm: smoother than the arm, a little looser, a crease's shade in the crook of the elbow)
    const cloth = (t) => 0.7 * rad(t) + 0.3 * (F.del * (1 - t) + (F.arm[3] + 0.008) * t) + loose + (tS < 1 ? 0.005 * t / Math.max(0.05, tS) : 0), ao = crease([el], 0.8), rib = (g) => (OF?.ribs && !JK && Q >= 0.6 ? ribbed(g, n(14, 6)) : g);
    // (her arm grown out of her shoulder - its skin (shaded as the skin it grows from, no fillet onto the bodice: crossing
    // its edge cleanly), or the top's sleeve over the bodice; a jacket's its own)
    const bA = (g, off = 0, oo = { col: skinSh ? (x, y, z) => skinSh(x, y, z, null, 0, 0) : null, bare: bod ? (f, a) => ss3(bod.nl(a) - 0.004, bod.nl(a) + 0.012, f) : null }) => { if (!(armB && !JK)) return armM && off ? armM(g, s === 'R' ? 0 : 1, offM, { sink: Math.min(0.6 * offM, 0.005) }) : g; armB(g, s === 'R' ? 0 : 1, off, oo); if (!off) armSk.push(g); return g; }, onBod = (bod?.off ?? 0) + 0.001;
    // (his sleeve laid on the cloth it is sewn to, as far off him as that is over the shoulder: a jacket's (its padding's
    // lift there), a shirt's standing off the trousers (topOver), a fitted top's, a one-piece's own)
    const offM = (JK ? JK.out + 0.005 * ss3(0.8, 0.93, fJ) : topOver ? topOver.out(fJ) : bod?.off ?? 0) + 0.001;
    if (tS >= 0.95) {
      const sl = kit === 'jacket' ? [[0, 0.24, 'team'], [0.22, 0.965, 'top']] : [[0, 0.965, 'top']];
      // (the team jacket's colour over its shoulders: its sleeve's top a hair over the sleeve below, its edge turned in to it)
      for (const [a, b, m] of sl) parts[m].push(rib(bA(tint(limbAlong(P, m === 'team' ? (t) => cloth(t) + 0.0015 : cloth, { t0: a, t1: b, dome: a === 0 ? 'a' : '', capA: cA, hem: b > 0.9 || m === 'team', hemTo: m === 'team' ? (t) => cloth(t) - 0.001 : rad, k: Math.round(16 * (b - a)) + (((fem && !JK) || armM) && a === 0 ? 8 : 3), m: 14, dense: ((fem && !JK) || armM) && a === 0 ? 1.5 : 1 }), ao), onBod, { sink: 0.6 * onBod })));
      if (kit === 'suit') parts.shoe.push(limbAlong(P, (t) => rad(t) + 0.006, { t0: 0.915, t1: 0.975, k: 2, m: 16, hem: true, hemTo: rad }));
      if (JK?.rib) parts.top.push(tint(limbAlong(P, (t) => rad(t) + 0.007, { t0: 0.9, t1: 0.975, k: 2, m: 16, hem: true, hemTo: rad }), 0.75));
      if (OF?.jacket === 'blazer') parts.accent.push(limbAlong(P, (t) => rad(t) + 0.004, { t0: 0.93, t1: 0.985, k: 2, m: 16, hem: true, hemTo: rad }));
      parts.skin.push(limbAlong(P, rad, { t0: 0.9, t1: 1, k: 3, dome: 'b', hidden: true }));
    } else if (tS > 0) {
      // (a short sleeve its own piece, set on at the shoulder's seam - over the bodice where they meet, as cloth is; hers
      // fitted to the arm, as close as her bodice is to her, easing a little toward its hem: no puff at the shoulder)
      // (hers grown out of the bodice as a long sleeve is - one surface with it over the shoulder's round (T.arms, laid on the
      // bodice's cloth): no seam of one through the other, no step at its top - and drawn in toward its hem, fitted to the
      // arm there: no puff, no gap to see up into)
      const sv = limbAlong(P, fem && !JK ? (t) => rad(t) + onBod * (1 - 0.6 * ss3(0.3 * tS, tS, t)) + 0.0005 : cloth, { t1: tS, dome: 'a', capA: cA, hem: true, hemTo: rad, k: Math.max(4, Math.round(16 * tS)) + (fem || armM ? 3 : 0), m: fem ? 14 : 16, dense: fem || armM ? 1.5 : 1 });
      parts.top.push((fem && armB && !JK) || armM ? bA(sv, onBod, { sink: 0.6 * onBod }) : tint(sv, crease([sh], 0.86)));
      parts.skin.push(bA(tint(limbAlong(P, rad, { t0: tS - 0.06, dome: 'b', hidden: true, k: 16 }), ao)));
      // (an open shirt's sleeve rolled up (JK.roll): its cuff turned back twice over the forearm, a band a shade darker)
      if (JK?.roll) parts.top.push(tint(limbAlong(P, (t) => cloth(t) + 0.004, { t0: tS - 0.07, t1: tS + 0.004, k: 3, m: 16, hem: true, hemTo: rad }), 0.9));
    } else {
      parts.skin.push(bA(tint(limbAlong(P, rad, { dome: 'ab', capA: cA, k: fem ? 20 : 18, m: fem ? 18 : 16, dense: fem ? 1.6 : 1 }), ao)));
      // (off the shoulder: its band's top edge drawn in to the arm, its lower one turned in to it - nothing to see into)
      // (its top edge level with the bodice's, under the arm - one neckline round her - a hair in under the skin there, so
      // the skin closes over it; where it is on her, a hair off her arm - its own piece over the arm, as a sleeve is)
      // (each column of it from where the bodice's own neckline crosses the arm (x0: rings down a fine tube of it) - its top
      // edge level with the bodice's across her front and her back, the two one line; an arm raised above it carrying the
      // band up with it, as far down the arm as ever)
      if (OF?.bardot) {
        const KB = 24, MB = n(18, 8), t1 = 0.2, bo = 0.0065, tb = limbAlong(P, (t) => rad(t) + bo, { t1, k: KB, m: MB }), BP = tb.attributes.position, xt = KB / t1;
        const at = (i, j) => V(BP.getX(i * MB + j), BP.getY(i * MB + j), BP.getZ(i * MB + j)), C0 = Array.from({ length: KB + 1 }, (_, i) => { const c = V(0, 0, 0); for (let j = 0; j < MB; j++) c.add(at(i, j)); return c.multiplyScalar(1 / MB); });
        const dOf = (i, j) => { const q = at(i, j); return fOf(q) - bod.nl(T.near(q).an); };
        let x0 = [];
        for (let j = 0; j < MB; j++) { let x = 0.05 * xt, d0 = dOf(0, j); for (let i = 1; i <= 0.12 * xt; i++) { const d1 = dOf(i, j); if (d0 > 0 && d1 <= 0) { x = i - 1 + d0 / (d0 - d1); break; } d0 = d1; } x0.push(x); }
        for (let it = 0; it < 2; it++) x0 = x0.map((x, j) => 0.5 * x + 0.25 * (x0[(j + 1) % MB] + x0[(j + MB - 1) % MB]));
        // (its top edge drawn in to the arm, its hem turned in under itself to it - nothing to see into)
        const pq = (j, x, k = 1) => { const i = Math.min(KB - 1, Math.floor(x)), u = x - i, c = C0[i].clone().lerp(C0[i + 1], u); return at(i, j).lerp(at(i + 1, j), u).sub(c).multiplyScalar(k).add(c); };
        const kr = (x, r) => (r(x / xt) - 0.0015) / (rad(x / xt) + bo), d = 0.006 * xt, R = [x0.map((x, j) => pq(j, Math.max(0, x - d), kr(Math.max(0, x - d), rad)))];
        for (let i = 0; i <= 7; i++) R.push(x0.map((x, j) => pq(j, x + d + (KB - x - d) * i / 7)));
        if (Q >= 0.6) R.push(x0.map((x, j) => pq(j, KB, kr(KB, (t) => rad(t) + 0.001))), x0.map((x, j) => pq(j, KB - 1.5, kr(KB - 1.5, (t) => rad(t) + 0.001))));
        parts.top.push(tint(loft(R), 0.94));
      }
    }
    // (a sheer layer's sleeves (OF.sheer): close over the bare arm, set in at the shoulder - its seam seen through it)
    // (a kaftan's, a crochet cover-up's wide (sheer.wide): flaring from the elbow to an open bell at the hem - its edge turned, not drawn in to the arm)
    if (OF?.sheer?.sleeve && tS0 < 0.95) {
      const sw = OF.sheer.wide || 0, wx = (t) => sw * ss3(0.25, 1, t / OF.sheer.sleeve) ** 1.4, rS = (t) => rad(t) + 0.0035 + 0.01 * (1 - ss3(0, 0.3, t)) + wx(t), sg = limbAlong(P, rS, { t1: OF.sheer.sleeve, dome: 'a', capA: cA, hem: true, hemTo: sw ? (t) => rS(t) - 0.003 : rad, k: sw ? 14 : 10, m: sw ? 16 : 10 });
      // (a wide one's fullness falling below the arm, as soft cloth does - its top on the arm, the bell hanging under it: a
      // forearm held out carries a drape, never a hoop standing round it; an arm hanging down, the same as built)
      if (sw) {
        const GP = sg.attributes.position, q = V(0, 0, 0), e = V(0, 0, 0), dv = V(0, 0, 0), g = V(0, 0, 0), Ls = [L1, el.distanceTo(wr)], tot = Ls[0] + Ls[1];
        for (let i = 0; i < GP.count; i++) {
          q.fromBufferAttribute(GP, i); let best = 9, tb = 0, s0 = 0;
          for (let s2 = 1; s2 < 3; s2++) { dv.subVectors(P[s2], P[s2 - 1]); const l = Ls[s2 - 1], u = clamp01(e.subVectors(q, P[s2 - 1]).dot(dv) / (l * l)), dd = e.copy(P[s2 - 1]).addScaledVector(dv, u).distanceTo(q); if (dd < best) { best = dd; tb = (s0 + u * l) / tot; g.set(0, -1, 0).addScaledVector(dv, dv.y / (l * l)); } s0 += l; }
          const x = wx(tb); if (x < 1e-5) continue; q.addScaledVector(g, 0.85 * x); GP.setXYZ(i, q.x, q.y, q.z);
        }
        sg.computeVertexNormals();
      }
      parts.sheer.push(lacey(sg, OF.sheer.lace));
    }
    const fg = J['fing' + s], pm = J['palm' + s], dirH = (fg ? fg.clone() : new THREE.Vector3().subVectors(wr, el)).normalize(), hw = wr.clone().addScaledVector(dirH, -0.008);
    // (the palm as the pose has it, or toward the body's middle; a hand that would go into the body - on the hip - lies
    // along it instead, its palm on it; hands clasped out in front of it are left as they are)
    let pn = pm ? pm.clone() : V(0, 0, wr.z < 0 ? 1 : -1);
    // (arms folded: each hand round the other arm, its fingers turned back to the body, not out past it)
    if (pose === 'cross') { dirH.set(dirH.x * 0.35 - 0.85, dirH.y * 0.35 - 0.2, dirH.z * 0.35).normalize(); pn = V(0, 0, wr.z > 0 ? 1 : -1); }
    const fw = (wr.y - T.A.y + 0.11) / T.H, sec = T.sec(fw), cw = T.c(fw), nOut = V(0, 0, wr.z - cw.z).normalize();
    if (!pm && fw > -0.2 && fw < 1 && Math.abs(wr.z - cw.z) < sec[0] + 0.06 && Math.abs(wr.x - cw.x) < sec[1] + 0.03 && dirH.dot(nOut) < 0) { dirH.addScaledVector(nOut, -dirH.dot(nOut)).normalize(); pn = nOut.clone().negate(); hw.z = cw.z + nOut.z * Math.max(Math.abs(hw.z - cw.z), sec[0] + (JK ? 0.034 : 0.026)); handOn[s] = 1; }
    const Pn = pn.clone().addScaledVector(dirH, -pn.dot(dirH)).normalize(), X = new THREE.Vector3().crossVectors(dirH, Pn);
    const th = Math.abs(X.z) > 0.5 ? (X.z * wr.z > 0 ? -1 : 1) : (X.x > 0 ? 1 : -1);
    parts.skin.push(...handAt(hw, dirH, Pn, hk, th));
    // ---- legs and shoes ----
    // (the thigh from just inside the hip's joint: its top within the hips, not standing out beside them)
    // (the foot's length a share of the leg's - hers a touch less - every shoe sized from it; trousers over a low shoe down
    // to its top at the ankle, resting on it)
    const footL = (fem ? 0.29 : 0.3) * ['R', 'L'].reduce((a, q) => a + (J['hip' + q].distanceTo(J['knee' + q]) + J['knee' + q].distanceTo(J['ankle' + q])) / 2, 0);
    const lowShoe = !bare && J['foot' + s] === 'flat' && (shoeKind === 'shoe' || shoeKind === 'trainer' || shoeKind === 'work');
    const ank = J['ankle' + s], lp = [J['hip' + s].clone().setZ(J['hip' + s].z * (fem ? 0.94 : 0.86)), J['knee' + s], cut === 'wide' && J['foot' + s] === 'flat' ? ank.clone().setY(0.03) : lowShoe ? ank.clone().setY(Math.min(ank.y + 0.012, (SHOE_H[shoeKind === 'shoe' ? 'shoe' : 'full'][2][1] + 0.01) * footL)) : J['foot' + s] === 'toes' ? ank.clone().addScaledVector(ank.clone().sub(J['knee' + s]).normalize(), 0.014) : ank.clone().add(V(0, 0.012, 0))], tk = lp[0].distanceTo(lp[1]) / (lp[0].distanceTo(lp[1]) + lp[1].distanceTo(lp[2])), lr = legRad(F.leg, tk, fem), lao = crease([J['knee' + s]], 0.85);
    // (her leg's own form - the thigh's forward bow and its front, the hamstrings full under the seat (the seat's curve
    // carried on down into them), the calf's round: legForm - followed by what she wears over it)
    const fm = fem ? legForm(F.leg, tk, s === 'R' ? -1 : 1) : null, hb = (t) => (fm ? fm.hb(t) : 0), fb = fm && ((t) => fm.back(t) + fm.hb(t));
    // (in boots, the leg only down to a little inside their tops (bootT): below that the boot is all there is to see)
    const bootT = shoeKind === 'thighboot' ? 0.7 * tk : shoeKind === 'kneeboot' ? tk + 0.07 * (1 - tk) : 1;
    if (bare) {
      // (closed at the ankle too, inside the shoe: nothing to see up into over a shoe's back)
      // (in swimwear her hip's join seen bare: the leg's rings closer toward its top and more round it, the crease under the
      // cloth's edge one smooth line - never the thigh's facets through it)
      const sw = SWB && fem && Q >= 0.6, bl = tint(limbAlong(lp, lr, { back: fb || ((t) => F.leg[3] * 0.28 * gau(t - tk - 0.3 * (1 - tk), 0.13)), ka: SWB?.ka ? SWB.ka(s, fm?.ka) : fm?.ka, k: bootT < 1 ? Math.max(8, Math.round((fm ? 26 : 22) * (bootT + 0.025))) : fm ? (sw ? 28 : 26) : 22, t1: Math.min(1, bootT + 0.025), dome: 'ab', ...(sw ? { m: 22, dense: 1.35 } : {}) }), lao);
      // (in swimwear, standing: her thigh grown out of her bare hip - one surface where the skin shows, filleted as her arms
      // are at her shoulders; never on to the cloth: SWB.bare)
      if (SWB?.bare && legB && J['knee' + s].y < J['hip' + s].y - 0.25) legB(bl, s === 'R' ? 0 : 1, 0, { bare: SWB.bare });
      if (SWB?.tuck) SWB.tuck(bl);   // (and kept under the cloth where it covers her)
      parts.legs.push(bl);
      // (a hem on the diagonal: each thigh's as far as it reaches on that side; the hem turned in right to the leg -
      // nothing to see into at its end)
      // (a sheer layer's own hem over the thigh, sitting (OF.sheer): over the dress's, the leg seen through it)
      // (a little past the dress's (drop); past the knee, sitting, only to the knee - from there it falls as one, as a
      // skirt does (lapsS): never a tube round the shins)
      if ((lap || swLap) && OF.sheer?.hem) {
        const t2 = lapHem(OF.sheer.hem, tk) + (OF.sheer.drop ? 0.05 * tk : 0);
        const flS = 0.04 * (OF.sheer.flare || 0), rS = (t) => lr(t) + 0.015 + flS * t / t2, hS = hangs && t2 > tk + 0.03, tE = hS ? tk + 0.03 : t2;
        parts.sheer.push(lacey(limbAlong(lp, rS, { t1: tE, k: Math.max(6, Math.round(12 * tE)), m: 12, dome: 'a', hem: true, hemTo: lr, back: fb || hb, ka: fm?.ka }), OF.sheer.lace));
        lapsS[s] = { lp, rr: rS, lr, tk, T1: t2, hang: hS, fl: flS, t1: Math.min(t2, tk) };
      }
      // (sitting, past the knee on both sides: over the thigh only to the knee - from there it falls as one (laps, below))
      if (lap) { const tOf = (q) => { const hm = OF.skirt.asym && (q === 'R') === (oSide > 0) ? OF.skirt.asym : OF.skirt.hem; return lapHem(hm, tk); }, t1 = tOf(s), fl = 0.04 * (OF.skirt.flare || 0), rr = (t) => lr(t) + 0.01 + fl * t / t1, hang = hangs && Math.min(tOf('R'), tOf('L')) > tk + 0.03, tE = hang ? tk + 0.03 : t1; parts[skP].push(tint(limbAlong(lp, rr, { t1: tE, k: Math.max(6, Math.round(18 * tE)), dome: 'a', hem: true, hemTo: lr, back: fb || hb, ka: fm?.ka }), lao)); laps[s] = { lp, rr, lr, tk, T1: t1, hang, fl, t1: Math.min(t1, tk) }; }
    } else if (!pz) {
      // (trousers fall straight from the seat; jeans and leggings follow the leg; wide ones flare to the floor; a race
      // suit's legs and overalls fuller)
      const fit = CUTS[cut || (kit === 'suit' || kit === 'marshal' ? 'suit' : 'straight')], wide = cut === 'wide';
      // (wide ones close over the hips and the tops of the thighs, then falling away from them - no fullness standing out at the hips)
      const tr = (t) => fit[0] * lr(t) + (1 - fit[0]) * (F.leg[0] * (1 - t) + fit[2] * t) * (wide ? 1 + 0.25 * t * t : 1) + fit[1];
      // (its hem turned in to the leg and closed a little up inside it - kneeling, its end seen from behind is cloth in
      // shadow, never the floor through an open tube)
      // (swim shorts (OF.shorts: their hem, a share of the thigh): to there, the leg bare below them)
      const tSh = OF?.shorts ? OF.shorts * tk : 0, tg = limbAlong(lp, wide ? (t) => { const k = ss3(0.04, 0.42, t); return (lr(t) + 0.005) * (1 - k) + tr(t) * k; } : tr, { k: tSh ? 10 : 18, dome: 'a', hem: true, hemTo: lr, seal: true, back: (t) => 0.004 * gau(t - tk - 0.25, 0.15) + hb(t) + (fm ? fit[0] * fm.back(t) : 0), ka: fm ? (t, a) => 1 + fit[0] * (fm.ka(t, a) - 1) : null, ...(tSh ? { t1: tSh } : {}), ...(!OF ? { dense: 1.3 } : {}) });   // (his: its rings closer toward its top, where it goes in under the band over his hips (below))
      if (tSh) parts.skin.push(tint(limbAlong(lp, lr, { t0: Math.max(0, tSh - 0.05), back: fb || ((t) => F.leg[3] * 0.28 * gau(t - tk - 0.3 * (1 - tk), 0.13)), ka: fm?.ka, k: 20, dome: 'b' }), lao));
      // (standing or walking - the thigh not carried far forward: one surface with the trousers' top, filleted where it
      // leaves it, as the arms are at the shoulders - no line round the top of each thigh)
      if (legB && J['knee' + s].y < J['hip' + s].y - 0.25) legB(tg, s === 'R' ? 0 : 1, 0.002);
      // (under a top worn loose over them, the tops of the legs - each thigh's round, its top inside the hips - kept under
      // the top down to a little below its hem: never showing through it)
      if (topOver) {
        const TP = tg.attributes.position, q = V(0, 0, 0), fH = topOver.fH;
        // (only what stands just out of the hips - a share of the thigh's round: a leg carried away from them, sitting or
        // kneeling, left as it is)
        for (let i = 0; i < TP.count; i++) { q.fromBufferAttribute(TP, i); const f = fOf(q), w = ss3(fH - 0.045, fH - 0.01, f); if (w <= 0) continue; const m = T.near(q, topOver.out(Math.max(f, fH)) - 0.005), k = w * ss3(0.9 * F.leg[0], 0.5 * F.leg[0], m.s); if (m.s > 0 && k > 0) { q.addScaledVector(m.n, -m.s * k); TP.setXYZ(i, q.x, q.y, q.z); } }
        tg.computeVertexNormals();
      }
      // (his - a race suit's, overalls', the trousers under a polo or a jacket: the legs' tops drawn in on to the band over
      // his hips (the legs' own shade on the torso, B(T.fLo, ...), a hair inside it) wherever they would stand out of it -
      // never two domes of the thighs' tops below the waist, nor the seat's round lobes either side of a dark V behind; the
      // legs carried out of it from the crotch down, and a leg carried well away from the hips - sitting, kneeling - as it is)
      if (!OF) {
        // (and lit as the band where it goes in under it (NB: the band's own normal there, by how far drawn in) - no line of
        // light where the two cross)
        const TP = tg.attributes.position, q = V(0, 0, 0), oB = (kit === 'suit' || kit === 'marshal' ? 0 : 0.004) - 0.002, f0 = T.fLo + 0.03, f1 = T.fLo + 0.12, NB = new Map();
        // (lit as the band too wherever it lies close to it, either side, over the hips: the two crossing unseen)
        for (let i = 0; i < TP.count; i++) {
          q.fromBufferAttribute(TP, i); const f = fOf(q), w = ss3(f0, f1, f), wn = ss3(T.fLo - 0.04, T.fLo + 0.02, f); if (wn <= 0) continue;
          const m = T.near(q, oB), k = w * ss3(0.9 * F.leg[0], 0.5 * F.leg[0], m.s), s1 = m.s > 0 ? m.s * (1 - k) : m.s;
          if (m.s > 0 && k > 0) { q.addScaledVector(m.n, -m.s * k); TP.setXYZ(i, q.x, q.y, q.z); }
          const t = Math.max(Math.sqrt(k), wn * ss3(0.015, 0.002, Math.abs(s1))); if (t > 0) NB.set(i, [m.n, t]);
        }
        tg.computeVertexNormals();
        { const Nn = tg.attributes.normal; for (const [i, [nb2, t]] of NB) { const x = Nn.getX(i) + (nb2.x - Nn.getX(i)) * t, y = Nn.getY(i) + (nb2.y - Nn.getY(i)) * t, z = Nn.getZ(i) + (nb2.z - Nn.getZ(i)) * t, l = Math.hypot(x, y, z) || 1; Nn.setXYZ(i, x / l, y / l, z / l); } }
      }
      parts.legs.push(tint(tg, lao));
    }
    if (HEELS.has(shoeKind)) {
      // (a strappy sandal: her foot bare on it - in her tights, or her own skin under trousers; boots: the foot the boot's,
      // its shaft up the leg to below the knee, or over it)
      const boot = shoeKind === 'kneeboot' || shoeKind === 'thighboot', cs = shoeKind === 'sandal' ? sandalAt(ank) : shoeKind === 'platform' ? SW.platformAt(ank, SWH) : courtShoe(ank, 1);
      if (boot) cs.shoe.push(bootVamp(ank));
      // (kneeling on her toes: the shoe turned about its ankle on to hers, heel up, its toe just reaching the ground - as a shoe's)
      if (J['foot' + s] === 'toes') { const th = Math.max(-0.78 * Math.PI, Math.min(-0.45 * Math.PI, Math.asin(Math.min(1, Math.max(0.02, ank.y - 0.006) / 0.2)) - Math.PI + 0.46)); for (const g of [cs.foot, ...cs.shoe]) { g.translate(-ank.x, -0.1, -ank.z); g.rotateZ(th); g.translate(ank.x, ank.y, ank.z); } }
      // (the back foot of a stride or a shove, its ankle lifted (above a standing one's, 0.09): the shoe pitched up about its
      // toe with her heel, the heel cup carried up under the leg's end - never the leg ending over an empty shoe flat on the
      // floor; lifted further than the foot can pitch, the shoe off the floor with it)
      else if (ank.y > 0.094) {
        const tx = 0.17, ay = 0.09, R = Math.hypot(tx, ay), y1 = Math.min(ank.y, 0.95 * R), al = Math.PI - Math.asin(y1 / R), ph = al - Math.atan2(ay, -tx), dx = -(R * Math.cos(al) + tx);
        for (const g of [cs.foot, ...cs.shoe]) { g.translate(-(ank.x + tx), 0, 0); g.rotateZ(ph); g.translate(ank.x + tx + dx, ank.y - y1, 0); }
      }
      // (in a boot the foot is the boot's: its vamp over it, nothing of the foot itself to see)
      if (!boot) (bare ? parts.legs : shoeKind === 'sandal' || shoeKind === 'platform' ? parts.skin : parts.shoe).push(cs.foot); parts.shoe.push(...cs.shoe);
      if (boot && bare) parts.shoe.push(...bootShaft(lp, lr, fm, bootT, lao));
    }
    // (slides by the pool: the foot bare and flat on its footbed, a broad strap over it - world/Swimwear.js; barefoot (in
    // the water, on its edge): the same foot, on the ground, nothing under it)
    else if (shoeKind === 'slide' || shoeKind === 'bare') { const cs = SW.slideAt(ank, J['foot' + s], footL, SWH, shoeKind === 'bare'); (bare ? parts.legs : parts.skin).push(cs.foot); parts.shoe.push(...cs.shoe); }
    else {
      const sole = new THREE.Color(shoeKind === 'trainer' ? '#f4f2ec' : shoeKind === 'boot' ? '#2c2d30' : '#3b3530');
      parts.shoe.push(...shoeAt(ank, J['foot' + s], shoeKind, footL, [sole.r / Math.max(0.002, shoeC.r), sole.g / Math.max(0.002, shoeC.g), sole.b / Math.max(0.002, shoeC.b)]));
    }
    // (an anklet (acc 'anklet'): a fine chain round her left leg just above the ankle, on the bare skin)
    if (s === 'L' && bare && Q >= 0.6 && [].concat(o.acc || []).includes('anklet')) { metalM(); parts.metal.push(SW.anklet(lp, lr(0.965))); }
  }
  // (the skirt across the lap: from over one thigh to over the other, a little slack between them - sitting, over the
  // tops of them; standing in a scuffle, down the front) - the dress's, and a sheer layer's own over it (lapsS: no lining,
  // the net alone)
  const LAPS = [[laps, (lin, g) => parts[skP].push(lin, g)], [lapsS, (lin, g) => parts.sheer.push(lacey(g))]];
  for (const [laps, put] of LAPS) if (laps.R && laps.L) {
    const along =(P, t) => { const L1 = P[0].distanceTo(P[1]), L2 = P[1].distanceTo(P[2]), d = t * (L1 + L2); return d <= L1 ? P[0].clone().lerp(P[1], d / L1) : P[1].clone().lerp(P[2], Math.min(1, (d - L1) / L2)); };
    // (the thighs apart - one knelt on, one up: only so far down them as they run together, a share of the thigh - no sail
    // of it stretched on between the knees)
    const dTh = laps.R.lp[1].clone().sub(laps.R.lp[0]).normalize().dot(laps.L.lp[1].clone().sub(laps.L.lp[0]).normalize());
    const KR = n(8, 3), C = n(6, 2), t1 = Math.min(laps.R.t1, laps.L.t1, laps.R.tk * (0.3 + 0.7 * ss3(0.55, 0.9, dTh))), pos = [], idx = []; let nm = null;
    for (let i = 0; i <= KR; i++) {
      const t = 0.04 + (t1 - 0.04) * i / KR, a = along(laps.R.lp, t), b = along(laps.L.lp, t), ax = along(laps.R.lp, Math.min(1, t + 0.02)).sub(a).normalize();
      const nn = new THREE.Vector3().crossVectors(ax, new THREE.Vector3().subVectors(b, a)).normalize(); if (nn.y + nn.x < 0) nn.negate(); if (i === KR >> 1) nm = nn.clone();
      const A = a.addScaledVector(nn, laps.R.rr(t) * 0.92), Bp = b.addScaledVector(nn, laps.L.rr(t) * 0.92);
      for (let j = 0; j <= C; j++) { const u = j / C, p = A.clone().lerp(Bp, u).addScaledVector(nn, -0.012 * Math.sin(Math.PI * u)); pos.push(p.x, p.y, p.z); }
    }
    for (let i = 0; i < KR; i++) for (let j = 0; j < C; j++) { const a = i * (C + 1) + j, b = a + 1, c = a + C + 2, d = a + C + 1; idx.push(a, b, c, a, c, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const mi = (KR >> 1) * (C + 1) + (C >> 1), N = g.attributes.normal;
    if (N.getX(mi) * nm.x + N.getY(mi) * nm.y + N.getZ(mi) * nm.z < 0) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); }
    // (lined: seen from behind or below, its inside in shadow - never the floor through it)
    put(lining(g.clone()), OF.sparkle && Q >= 0.6 ? sparkle(g) : g);
    // (sitting, a skirt past the knee: from the knees it falls as one - in front straight down from them, round the shins
    // at the sides and behind them, flaring a little as its cut does - to its hem, each side as long as it is there (a
    // diagonal hem's long side lower); its top round the knees, under the thighs behind them; hem turned in, lined)
    if (laps.R.hang && laps.L.hang) {
      // (clear of the shins by the calf's own round - a share of the leg's radius - and the cloth's allowance)
      const LR = laps.R, LL = laps.L, kn = (Lp) => Lp.lp[1], an = (Lp) => Lp.lp[2], rk = (Lp) => Lp.rr(Lp.tk);
      const shin = (Lp, y) => { const u = clamp01((kn(Lp).y - y) / Math.max(0.01, kn(Lp).y - an(Lp).y)); return [kn(Lp).clone().lerp(an(Lp), u), 1.2 * Lp.lr(Lp.tk + u * (1 - Lp.tk)) + 0.01]; };
      const yH = (Lp) => kn(Lp).y - clamp01((Lp.T1 - Lp.tk) / (1 - Lp.tk)) * (kn(Lp).y - an(Lp).y), yHR = yH(LR), yHL = yH(LL), ky = (kn(LR).y + kn(LL).y) / 2, rK = (rk(LR) + rk(LL)) / 2;
      // (a gown to the floor (its hem past nine tenths of the shin): wider round both legs as one, flaring toward the floor in
      // soft folds - a gown's skirt fallen from the knees, never a column round the shins read as trousers or a slab)
      const gw = Math.max(LR.T1, LL.T1) > 0.9 ? 1 : 0;
      const xF = Math.max(kn(LR).x + rk(LR), kn(LL).x + rk(LL)), fl = Math.max(LR.fl, LL.fl) + 0.006 + 0.032 * gw, M = n(28 + 8 * gw, 12), NR = n(9, 4), R = [];
      const ring = (v, k = 1, dy = 0) => {
        const ym = ky + ((yHR + yHL) / 2 - ky) * v, [pR, rR] = shin(LR, ym), [pL, rL] = shin(LL, ym), xB = Math.min(pR.x - rR, pL.x - rL) - 0.5 * fl * v, zR = pR.z - rR - fl * v - 0.014 * gw, zL = pL.z + rL + fl * v + 0.014 * gw;
        // (a gown's front falling from the knees forward of the shins to its hem by the feet, as the cloth's own weight takes it)
        const xFv = xF + fl * v + gw * 0.055 * v ** 1.5, cx = (xFv + xB - 0.02 * gw * v) / 2, ax = (xFv - xB + 0.02 * gw * v) / 2 * k, cz = (zR + zL) / 2, az = (zL - zR) / 2 * k, ex = gw ? 0.95 : 0.8;
        return Array.from({ length: M }, (_, j) => {
          const a = (j / M) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a), yT = ky + rK * (0.2 + 0.7 * c), yB = yHR + (yHL - yHR) * (s + 1) / 2, fo = 1 + gw * 0.05 * v * v * (Math.sin(a * 9 + 1) + 0.5 * Math.sin(a * 5 + 2.3));
          return V(cx + ax * fo * Math.sign(c) * Math.abs(c) ** ex, yT + (yB - yT) * v + dy, cz + az * fo * Math.sign(s) * Math.abs(s) ** ex);
        });
      };
      R.push(ring(0, 0.82, -0.3 * rK)); for (let i = 0; i <= NR; i++) R.push(ring(i / NR)); if (Q >= 0.6) R.push(ring(1, 0.88, 0.012));
      const dg = loft(R); put(lining(dg.clone()), tint(dg, 0.97));
    }
  }
  // (the skin over her shoulders and a bodice her sleeves are laid on lit with her arms where they grow out of them)
  if (armB) for (const [g, off, ez] of sideG) armB.side(g, off, ez);
  if (SWB?.side && legB) legB.side(SWB.side, 0);   // (and her hips' skin where her thighs grow out of it)
  if (SWB?.over) SWB.over(parts.legs, [parts.top, parts.accent, parts.bottom]);   // (her swimwear lifted out over her thighs' tops as built - world/Swimwear.js)
  // (and her bare skin there one light, whichever surface it is on: joinLight)
  if (armB && armSk.length && Q >= 0.6) joinLight([...sideG.filter((x) => !x[1]).map((x) => x[0]), ...armSk], [shR, shL], F.del);
  let chest = null;
  if (o.teamName && (kit === 'suit' || kit === 'polo' || kit === 'jacket')) {
    // (the whole name, measured: as large as the patch's height allows, smaller for a long one so it fits its width - never
    // cut off at either end)
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64; const cx = cv.getContext('2d'), name = String(o.teamName).toUpperCase(), font = (px) => `900 ${px}px "Segoe UI", Arial, sans-serif`;
    cx.font = font(34); const px = Math.max(10, Math.min(34, Math.floor(34 * 0.92 * cv.width / Math.max(1, cx.measureText(name).width))));
    cx.fillStyle = kit === 'jacket' ? '#' + team.getHexString() : '#' + acc.getHexString(); cx.font = font(px); cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(name, 128, 34);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    // (printed on the cloth: across the chest by its length round the chest's section, up it by its height - following
    // the chest's round, not a flat card standing off it at its ends)
    const off = (kit === 'jacket' ? 0.014 : kit === 'polo' ? 0.008 : 0) + 0.003, fL = 0.74, LW = 0.17, LH = 0.0425, AL = [];
    for (let k = -70, s = 0; k <= 70; k++) { const a = k * 0.02; if (k > -70) s += T.pt(fL, a, off).distanceTo(T.pt(fL, a - 0.02, off)); AL.push([a, s]); }
    const s0 = AL[70][1], aAt = (d) => { const s = s0 + d; let i = 1; while (i < AL.length - 1 && AL[i][1] < s) i++; const [a0, l0] = AL[i - 1], [a1, l1] = AL[i]; return a0 + (a1 - a0) * clamp01((s - l0) / Math.max(1e-6, l1 - l0)); };
    const lg = new THREE.PlaneGeometry(1, 1, 12, 2), LP = lg.attributes.position;
    for (let i = 0; i < LP.count; i++) { const p = T.pt(fL + LP.getY(i) * LH / T.H, aAt(-LP.getX(i) * LW), off); LP.setXYZ(i, p.x, p.y, p.z); }
    lg.computeVertexNormals();
    chest = new THREE.Mesh(lg, new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.6 })); chest.userData.tex = tex;
  }
  // ---- accessories ----
  const ACC = new Set([].concat(o.acc || [])), accCol = (c) => { const k = new THREE.Color(c); return [k.r / 0.25, k.g / 0.25, k.b / 0.25]; };
  // (all of them one material, their colours each vertex's own: a pass, a clutch, sunglasses; the metal ones - a watch,
  // earrings, a clutch's clasp - the metal's, METAL)
  if (ACC.size) mats.acc = pplMat('cloth', '#8a8a8a', 0.3);
  if (ACC.has('lanyard')) {
    // a paddock pass on its lanyard: the cord round the back of the neck and down the chest, the card at the end of it
    // (a flat strap, over the chest as it lies, then hanging straight from the furthest it comes forward - the card below it)
    const lo = (JK ? JK.out : OF?.fit ?? 0.004) + 0.008, cord = [], cc = T.c(0.78), ends = [];
    for (const s of [-1, 1]) {
      // (round the back of the neck at its base, then down over the collarbones)
      const pts = [nRing(0.012, s * 2.6, 0.003), nRing(0.006, s * 1.9, 0.003), ...[[0.92, 0.75, lo], [0.84, 0.55, lo], [0.76, 0.38, lo], [0.68, 0.24, lo], [0.62, 0.13, lo], [0.585, 0.07, lo]].map(([f, a, o2]) => T.pt(f, s * a, o2))];
      let ap = 2; for (let i = 3; i < pts.length; i++) if (pts[i].x > pts[ap].x) ap = i;
      for (let i = ap + 1; i < pts.length; i++) pts[i].x = Math.max(pts[i].x, pts[ap].x - 0.12 * (pts[ap].y - pts[i].y));
      ends.push(pts[pts.length - 1]);
      cord.push(tint(lockGeo(pts, { w: 0.011, t: 0.0022, away: (p) => p.clone().sub(cc), shade: 1, flat: 1, k: 14, m: 5, tip: 0, blunt: 0 }), accCol(OF ? '#1d1d22' : '#' + team.getHexString())));
    }
    // (the card: small, off-white in its clear sleeve, a band of colour across its top)
    const cp = ends[0].clone().lerp(ends[1], 0.5).add(V(0.004, -0.042, 0));
    const card = new THREE.BoxGeometry(0.005, 0.074, 0.05); card.translate(cp.x, cp.y, cp.z); tint(card, accCol('#cfccc2'));
    const stripe = new THREE.BoxGeometry(0.0056, 0.018, 0.0505); stripe.translate(cp.x, cp.y + 0.028, cp.z); tint(stripe, accCol(OF ? '#262a33' : '#' + team.getHexString()));
    parts.acc.push(...cord, card, stripe);
  }
  if (ACC.has('watch')) { const w = J.wrL, e = J.elL, d = new THREE.Vector3().subVectors(w, e).normalize(), wp = w.clone().addScaledVector(d, -0.03), g = limbAlong([wp.clone().addScaledVector(d, -0.008), wp, wp.clone().addScaledVector(d, 0.008)], () => F.arm[3] + 0.003, { k: 2, m: 14 }); metalM(); parts.metal.push(g); }
  // (cuffs: a broad band of her metal round the right wrist (jewel.cuffs 1, acc 'cuff'), and the left too (2, 'cuffs') -
  // above a watch there)
  const nCuff = Math.max(JW.cuffs === 2 || JW.cuffs === 1 ? JW.cuffs : 0, ACC.has('cuffs') ? 2 : ACC.has('cuff') ? 1 : 0);
  for (const s of ['R', 'L'].slice(0, nCuff)) { const w = J['wr' + s], d = new THREE.Vector3().subVectors(w, J['el' + s]).normalize(), wp = w.clone().addScaledVector(d, s === 'L' && ACC.has('watch') ? -0.06 : -0.024); parts.metal.push(limbAlong([wp.clone().addScaledVector(d, -0.012), wp, wp.clone().addScaledVector(d, 0.012)], () => F.arm[3] + 0.0035, { k: 2, m: 12 })); metalM(); }
  // (a choker (jewel.choker - 'metal' or 'ribbon' - or acc 'choker'): a narrow band close round the middle of the neck,
  // level all round - in her metal, or black velvet ribbon)
  const chk = JW.choker === 'metal' || JW.choker === 'ribbon' ? JW.choker : ACC.has('choker') ? 'metal' : null;
  // (on the throat seen under the chin, halfway down it to the seam - above the flare, never tucked up under the jaw)
  if (chk && fem) { const g = collar(0.009, 0.0018, 0, Math.max(0.5 * sChin, 0.3 * NK.rTop) - 0.0045, 0, 0); if (chk === 'metal') { metalM(); parts.metal.push(g); } else { mats.acc = mats.acc || pplMat('cloth', '#8a8a8a', 0.3); parts.acc.push(tint(g, accCol('#141414'))); } }
  // (a clutch, held in a hand hanging free at her side - the left, or the right when the left rests on her hip (handOn);
  // none when neither hangs free, never pressed into her under a hand - in her accent colour, or one of its own; its
  // hardware in her metal, or one of its own (jewel.clutchMetal))
  let clutchHW = false;
  const cS = ACC.has('clutch') ? ['L', 'R'].find((s) => !handOn[s] && J['wr' + s].y < 1.05 && J['wr' + s].z * (s === 'L' ? 1 : -1) > 0.12) : null, cg = cS === 'R' ? -1 : 1;
  if (cS) {
    // (held in the hand, not beside it: in the curl of the fingers, a little into the palm)
    const d = new THREE.Vector3().subVectors(J['wr' + cS], J['el' + cS]).normalize(), c = J['wr' + cS].clone().addScaledVector(d, 0.082 * F.hk).add(V(0, 0, cg * 0.009));
    // (its body a soft oblong: rounded corners, its edges bevelled to a slight pillow - never a box's sharp corners)
    const W2 = 0.093, H2 = 0.048, rc = 0.018, sh = new THREE.Shape();
    sh.moveTo(-W2 + rc, -H2); sh.lineTo(W2 - rc, -H2); sh.quadraticCurveTo(W2, -H2, W2, -H2 + rc); sh.lineTo(W2, H2 - rc); sh.quadraticCurveTo(W2, H2, W2 - rc, H2); sh.lineTo(-W2 + rc, H2); sh.quadraticCurveTo(-W2, H2, -W2, H2 - rc); sh.lineTo(-W2, -H2 + rc); sh.quadraticCurveTo(-W2, -H2, -W2 + rc, -H2);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.007, bevelSize: 0.006, bevelSegments: n(2, 1), curveSegments: n(3, 2) }); g.clearGroups(); g.translate(c.x + 0.03, c.y, c.z - 0.006);
    parts.acc.push(tint(g, accCol(isHex(JW.clutchColor) ? JW.clutchColor : o.accent || '#1b1b1b')));
    // (its hardware: a fine rounded frame along the top edge of each face - a curve to catch the light, never a flat lid - and
    // a kiss-lock clasp's two balls at the middle)
    const hf = METALS[JW.clutchMetal] ? JW.clutchMetal : jm, hp = hf === jm ? parts.metal : parts.metal2; clutchHW = true; metalM(hf);
    const yT = c.y + H2 + 0.004;
    for (const s of [-1, 1]) { const cv = new THREE.CatmullRomCurve3([-0.09, -0.045, 0, 0.045, 0.09].map((x, i) => V(c.x + 0.03 + x, yT + [-0.007, 0.001, 0.003, 0.001, -0.007][i], c.z + s * 0.0105))); hp.push(new THREE.TubeGeometry(cv, n(10, 6), 0.0028, 4, false)); }
    for (const s of [-1, 1]) { const b = new THREE.SphereGeometry(0.0044, n(6, 5), n(5, 4)); b.translate(c.x + 0.03 + s * 0.0047, yT + 0.0068, c.z); hp.push(b); }
  }
  // (a mini bag instead (acc 'bag'): small and structured, on its fine chain strap over her left shoulder, hanging at her
  // hip a little behind her side - clear of whatever she wears there, a sheer layer's or a jacket's too - in her accent
  // colour or one of its own, its flap a shade darker; the chain and the clasp in her metal, or the bag's own. Sitting,
  // set down beside her)
  if (ACC.has('bag') && !ACC.has('clutch') && OF && !hangs) {
    const sL = Math.sign(J.hipL.z - J.hipR.z) || 1, aB = sL * (Math.PI / 2 + 0.5), fC = 0.13, oB = 0.03 + (JK ? JK.out : 0) + (OF.sheer ? 0.008 : 0) + 0.024, ctr = T.pt(fC, aB, oB), bcol = accCol(isHex(JW.clutchColor) ? JW.clutchColor : o.accent || '#1b1b1b');
    const rd = T.pt(fC, aB, oB + 0.01).sub(ctr).normalize(), up = V(0, 1, 0).addScaledVector(rd, -rd.y).normalize(), tg = new THREE.Vector3().crossVectors(up, rd), M4 = new THREE.Matrix4().makeBasis(tg, up, rd).setPosition(ctr);
    const g = new THREE.BoxGeometry(0.15, 0.105, 0.046, 2, 1, 1), fl = new THREE.BoxGeometry(0.152, 0.052, 0.006); fl.translate(0, 0.028, 0.0235);
    parts.acc.push(tint(g.applyMatrix4(M4), bcol), tint(fl.applyMatrix4(M4), bcol.map((v) => v * 0.8)));
    const hf = METALS[JW.clutchMetal] ? JW.clutchMetal : jm, hp = hf === jm ? parts.metal : parts.metal2; clutchHW = true; metalM(hf);
    const cl = new THREE.BoxGeometry(0.016, 0.012, 0.004); cl.translate(0, 0.006, 0.0265); hp.push(cl.applyMatrix4(M4));
    // (the strap: from the bag's two top corners up her front and her back - under the arm - over the top of the shoulder,
    // between the neck and its point; on her, over whatever she wears)
    const k0 = ctr.clone().addScaledVector(up, 0.05).addScaledVector(tg, -0.068), k1 = ctr.clone().addScaledVector(up, 0.05).addScaledVector(tg, 0.068), [cF, cB] = k0.dot(nFw) > k1.dot(nFw) ? [k0, k1] : [k1, k0];
    const zB = NK.rS + 0.62 * (sz - NK.rS); let fT = fAc; while (fT < fSeam && T.sec(fT)[0] > zB) fT += 0.002;
    const oS = (f, a) => (JK ? JK.out + 0.008 : 0.0022 + ((bod?.off ?? 0.006) + 0.001) * (bod ? ss3(bod.nl(a) + 0.02, bod.nl(a) - 0.002, f) : 1)), sp = (f, a) => T.pt(f, a, oS(f, a));
    const SP = [cF, sp(0.4, sL * 1.3), sp(0.66, sL * 1.22), sp(fT - 0.03, sL * 1.3), sp(fT, sL * Math.PI / 2), sp(fT - 0.03, sL * 1.84), sp(0.66, sL * 1.95), sp(0.4, sL * 2.0), cB];
    hp.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(SP), n(34, 12), 0.0019, n(4, 3), false));
  }
  // (a beach tote (acc 'tote'): woven straw, roomy, on its two leather handles over her left shoulder, hanging at her hip a
  // little behind her side, clear of what she wears; sitting, set down beside her - the straw its own matt weave)
  if (ACC.has('tote') && !ACC.has('bag') && OF && !hangs && fem) {
    const sL = Math.sign(J.hipL.z - J.hipR.z) || 1, aB = sL * (Math.PI / 2 + 0.85), fC = 0.1, oB = 0.065 + (JK ? JK.out : 0) + (OF.sheer ? 0.012 : 0), ctr = T.pt(fC, aB, oB);
    const rd = T.pt(fC, aB, oB + 0.01).sub(ctr).normalize(), up = V(0, 1, 0).addScaledVector(rd, -rd.y).normalize(), tg = new THREE.Vector3().crossVectors(up, rd), M4 = new THREE.Matrix4().makeBasis(tg, up, rd).setPosition(ctr);
    const g = new THREE.BoxGeometry(0.3, 0.25, 0.1, 3, 2, 1), GP = g.attributes.position; for (let i = 0; i < GP.count; i++) { const y = GP.getY(i), k = 1 + 0.12 * (y / 0.125); GP.setX(i, GP.getX(i) * k); GP.setZ(i, GP.getZ(i) * (0.75 + 0.25 * (y / 0.125 + 1) / 2)); } g.computeVertexNormals();
    mats.straw = mats.straw || fabricOn(pplMat('cloth', '#c9ad78', 0.86), { weave: 'crinkle' }); (parts.straw = parts.straw || []).push(g.applyMatrix4(M4));
    const zB = NK.rS + 0.62 * (sz - NK.rS); let fT = fAc; while (fT < fSeam && T.sec(fT)[0] > zB) fT += 0.002;
    const oS = (f, a) => (JK ? JK.out + 0.01 : 0.004 + ((bod?.off ?? 0.006) + 0.001) * (bod ? ss3(bod.nl(a) + 0.02, bod.nl(a) - 0.002, f) : 1)) + (OF.sheer ? 0.008 : 0), sp = (f, a, d = 0) => T.pt(f, a + d, oS(f, a));
    for (const d of [-0.05, 0.05]) {
      const c0 = ctr.clone().addScaledVector(up, 0.12).addScaledVector(tg, -0.09).addScaledVector(rd, d * 0.4), c1 = ctr.clone().addScaledVector(up, 0.12).addScaledVector(tg, 0.09).addScaledVector(rd, d * 0.4), [cF, cB] = c0.dot(nFw) > c1.dot(nFw) ? [c0, c1] : [c1, c0];
      const SP = [cF, sp(0.42, sL * 1.25, d), sp(0.68, sL * 1.2, d), sp(fT - 0.03, sL * 1.3, d), sp(fT, sL * Math.PI / 2, d * 0.3), sp(fT - 0.03, sL * 1.84, d), sp(0.66, sL * 1.98, d), sp(0.4, sL * 2.1, d), cB];
      parts.acc.push(tint(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(SP), n(24, 10), 0.0042, n(4, 3), false), accCol('#4a2f1e')));
    }
  }
  // (a belly chain (acc 'bodychain'): two fine strands low round her hips, on her skin - over what she wears where it covers
  // her there - dipping at the front, a drop at the lower one's dip - world/Swimwear.js)
  if (ACC.has('bodychain') && fem && OF && Q >= 0.6) {
    const L = SWB?.lines, cov = !OF.swim || !L ? () => true : OF.suit ? (f, a) => f >= L.lo(a) - 0.004 : (f, a) => f <= L.hi(a) + 0.004 || f >= (OF.crop ?? 9) - 0.004 || (OF.mono ? Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < OF.mono.w0 + 0.15 : false);
    metalM(); parts.metal.push(...SW.bodyChain(T, cov, (OF.fit ?? 0.006) + (OF.sheer && !OF.swim ? 0.01 : 0)));
  }
  const body = new THREE.Group(); if (chest) body.add(chest);
  // (a figure's height: the body scaled, so whatever is fixed to it - a head, a prop at the wrist - goes with it)
  body.scale.setScalar(F.ht);
  const skel = [];
  // (her face's paint (a share of the cache's); painting it again (restyle: her make-up); her own canvases for its drafts)
  let faceTex = null, paintFace = null, faceSurf = null;
  /**
   * Changed in place, nothing rebuilt (a style editor's live preview): patch { makeup (a make-up spec: painted again -
   * draft: a quick one while a slider moves), color (the clothes'), accent, shoes (heels'), hair (its colour; her brows and
   * baby hairs painted again with it), metal (the jewellery's: gold, silver, rose), clutchMetal, shine (the hair's) } - each colour keeping
   * the light a scene lent it (its emissive the same share of it) -> true; false (nothing changed) when any of it needs the
   * person built again: a man's or a crowd's face, a headless body, a hair with tones of its own, a clutch in the accent...
   */
  const restyle = (pt = {}) => {
    const has = (f) => pt[f] !== undefined, mt = (k) => METALS[k] ? k : null;
    for (const f in pt) if (!['makeup', 'draft', 'color', 'accent', 'shoes', 'hair', 'metal', 'clutchMetal', 'shine'].includes(f)) return false;
    if (has('shine') && !mats.hair) return false;
    if (has('makeup') && !paintFace) return false;
    if (has('color') && !(OF || kit === 'suit')) return false;
    if (has('accent') && (chest || ((ACC.has('clutch') || ACC.has('bag')) && !JW.clutchColor))) return false;
    // (a sheer layer over a dress of another colour, a separate skirt in the accent: built again)
    if ((has('color') || has('accent')) && (OF?.sheer || OF?.sep || OF?.swim || OF?.lace)) return false;   // (swimwear: built again - never in her skin's tone; a lace's colour is carried by its pieces)
    if (has('shoes') && (!HEELS.has(shoeKind) || shoeFin === 'metallic')) return false;
    // (bolder or softer strands alone are shares of whatever colour it is: recoloured as any; tones (a root, ends of their
    // own colours) are shares of the colour it was built in - built again)
    if (has('hair') && (!paintFace || HT || CURLBUN.has(ST.hs) || !pt.hair)) return false;
    if (has('metal') && !mt(pt.metal ?? 'auto') && pt.metal !== 'auto' && pt.metal != null) return false;
    if (has('clutchMetal') && clutchHW && mats.metal2 == null && (mt(pt.clutchMetal) || jm) !== jm) return false;
    const recol = (m, c) => { if (!m) return; const l0 = lumOf(m.color), k = l0 > 1e-6 ? lumOf(m.emissive) / l0 : 0; m.color.set(c); if (k > 0) m.emissive.copy(m.color).multiplyScalar(k); };
    const remetal = (m, k) => { if (!m || !METALS[k]) return; const l0 = lumOf(m.color), e = l0 > 1e-6 ? lumOf(m.emissive) / l0 : 0; m.color.setRGB(...METALS[k].c); m.roughness = METALS[k].r; if (e > 0) m.emissive.copy(m.color).multiplyScalar(e); };
    if (has('color')) { const c = new THREE.Color(pt.color || '#3a6fd8'); recol(mats.top, c); recol(mats.band, c); recol(mats.team, c); if (kit === 'suit') recol(mats.legs, c.clone().multiplyScalar(0.82)); }
    if (has('accent')) recol(mats.accent, new THREE.Color(pt.accent || '#ffffff'));
    if (has('shoes')) recol(mats.shoe, new THREE.Color(pt.shoes || '#1b1b1b'));
    if (has('metal')) { const k = mt(pt.metal) || autoMetal; remetal(mats.metal, k); if (shoeFin === 'metallic') remetal(mats.shoe, k); jm = k; }
    if (has('clutchMetal') && clutchHW) remetal(mats.metal2 || mats.metal, mt(pt.clutchMetal) || jm);
    // (her hair's shine: its roughness, as built - style.shine 0..1, none: the style's own)
    if (has('shine')) mats.hair.roughness = typeof pt.shine === 'number' && isFinite(pt.shine) ? 0.62 - 0.28 * clamp01(pt.shine) : !fem ? 0.5 : SLEEK.has(ST.hs) ? 0.4 : 0.47;
    if (has('hair')) { recol(mats.hair, new THREE.Color(pt.hair)); paintFace(has('makeup') ? pt.makeup : undefined, false, pt.hair); }
    else if (has('makeup')) paintFace(pt.makeup, !!pt.draft);
    return true;
  };
  /** the person, finished: the body in its group (neck, headTop and wrR are the body's own - where a head or a prop
   *  goes when it is added to the body) -> { group, head, bow, neck, headTop, wrR, mats, restyle, dispose } */
  const done = (head, bow) => {
    // (a lace's pieces each laid out for it - its sheer layer, its edges, the lining it lies on, that one's pieces carrying
    // the lace's colour - world/Lace.js: lacePiece; an edge's own strips laid out as they were made)
    const lk = (k) => LK && (k === 'sheer' || k === 'laceEdge' || k === LK.on);
    for (const k in parts) if (parts[k].length && mats[k]) { const g = lk(k) ? mergeParts(parts[k].map((p) => (p.userData.laced ? (p.index ? p.toNonIndexed() : p) : lacePiece(p, T, LK.kind, k === LK.on ? laceC : null))), k === LK.on ? ['uv', 'pplLace'] : ['uv']) : mergeParts(parts[k]), m = new THREE.Mesh(g, mats[k]); m.castShadow = false; body.add(m); }
    const group = new THREE.Group(); group.add(body); group.userData.isPerson = true;
    if (skel.length) { group.updateMatrixWorld(true); for (const [sm, bones] of skel) sm.bind(new THREE.Skeleton(bones)); }
    return { group, head, bow, neck: J.neck.clone(), headTop: J.head.clone(), wrR: J.wrR.clone(), mats, restyle, dispose() { group.traverse((m) => { if (m.isMesh) { m.geometry.dispose(); if (m === chest) { m.material.map.dispose(); m.material.dispose(); } } }); for (const [sm] of skel) sm.skeleton?.dispose(); for (const k in mats) mats[k].dispose(); faceRelease(faceTex); faceTex = null; faceSurf?.dispose(); faceSurf = null; paintFace = null; } };
  };
  // (the body alone, in this pose: a scuffle's frames take the person's own head - ui/Brawl.js; hair on the body - long
  // locks, a tail, the nape's own (NAPE) - built with it)
  if (o.headless && !(LONG_HS.has(ST.hs) || ST.hs === 'ponytail' || ST.hs === 'highpony' || ST.hs === 'bun' || ST.hs === 'topknot' || ST.hs === 'pixie' || CURLBUN.has(ST.hs))) return done(null, -J.bow);
  // the head (its own group at the neck, bowed): one sculpted surface - the cranium, the jaw and the chin, cheekbones and
  // cheeks, shallow eye sockets under the brow, a small nose and the lips raised out of it - its features painted on
  // (or, in a crowd, eyes, brows and a mouth of their own), ears, hair grown over the skull to a hairline and hair beyond
  const head = new THREE.Group(); head.position.copy(J.neck); head.rotation.z = rotZ; head.scale.setScalar(F.hd);
  const hc = new THREE.Vector3().subVectors(J.head, J.neck), R0 = 0.1;
  const M = (gs, mat, keep) => { const m = new THREE.Mesh(mergeParts(gs, keep), mat); m.castShadow = false; return m; };
  let lockBody = [];
  if (o.crewHelmet) {
    // a pit-crew member: an open-face helmet in the team's colour and a dark visor, no face to build (quick: a crew is
    // a dozen people)
    const shellG = new THREE.SphereGeometry(0.135, 20, 14); shellG.scale(1.02, 1.05, 0.95); shellG.translate(hc.x - 0.01, hc.y + 0.01, hc.z);
    // (the visor across the front - a sphere's angle 0 is its -x, the back of the head: centred on pi, the face's +x - and
    // a chin guard under it in the shell's colour, so it reads as a helmet with someone in it, not a ball)
    const visorG = new THREE.SphereGeometry(0.139, 24, 10, Math.PI - 1.05, 2.1, Math.PI * 0.34, Math.PI * 0.24); visorG.scale(1.02, 1.05, 0.95); visorG.translate(hc.x - 0.008, hc.y + 0.01, hc.z);
    const chinG = new THREE.SphereGeometry(0.137, 20, 6, Math.PI - 0.95, 1.9, Math.PI * 0.58, Math.PI * 0.16); chinG.scale(1.04, 1.05, 0.95); chinG.translate(hc.x - 0.006, hc.y + 0.01, hc.z);
    mats.visor = new THREE.MeshStandardMaterial({ color: '#0d0f14', roughness: 0.15, metalness: 0.6 });
    head.add(M([shellG, chinG], mats.team), M([visorG], mats.visor));
  } else {
  const seed = seedOf();
  const vary = (k) => (((seed >>> k) % 100) / 100 - 0.5);   // (a face of its own: small differences, the same for the same name)
  const fLen = ST.len || 1, fWid = ST.wid || 1, jaw = ST.jaw ?? 0.22 + vary(3) * 0.1;
  // (its shape: worked out with the neck, where it told the head how low to sit)
  // (and seated on it: behind, the skull's underside drawn down into the back of the neck along a curve - the nape rising
  // into the head as one surface, never a peg under a ledge. napeAt(P): for a point of the skull (tenths, from its centre)
  // how far it lies out past the neck's own outline at its height (s) and how much it is the skull's underside behind
  // (w: fading out round the sides toward the jaw), or null. Drawn down k(1 - s/k)^p - all of k at the neck's surface, none
  // from k out (k a share of the neck's radius) - meeting the neck at a clean angle (p) and on into it, drawn in toward its
  // middle as well, well clear of its skin. Part of the head: nodding or turning, the curve still runs on into the neck)
  const S = FS, HS0 = headShape(S), kN = 0.3 * NK.rTop / F.hd, pN = 1.3;
  const napeAt = (P) => {
    const qx = hc.x + 0.1 * P[0], qy = hc.y + 0.1 * P[1], qz = hc.z + 0.1 * P[2], rh = Math.hypot(qx, qz) || 1e-6, c = qx / rh, pl = Math.hypot(P[0], P[1], P[2]) || 1, w = ss3(0.1, -0.75, c) * ss3(-0.1, -0.4, P[1] / pl);
    if (w <= 0) return null;
    const h = sPiv + qy * F.hd, e = Math.hypot(qx / (NP.rB(h, c) / F.hd), qz / (NP.r(h, c) / F.hd));
    return { s: rh * (1 - 1 / e), w, qx, qz, rh };
  };
  const HSf = (nx, ny, nz, bumps = true) => {
    const P = HS0(nx, ny, nz, bumps); if (nx > 0.3 || ny > -0.1) return P;
    const N = napeAt(P); if (!N || N.s >= kN) return P;
    const { s, w } = N, A = s >= 0 ? kN * (1 - s / kN) ** pN : kN + pN * Math.min(-s, kN), kx = s < 0 ? 1 - (w * Math.min(-s, kN)) / N.rh : 1;
    return [(N.qx * kx - hc.x) * 10, P[1] - 10 * w * Math.min(A, 1.6 * kN), (N.qz * kx - hc.z) * 10];
  };
  // (its skin's light there turned to the neck's as it comes down to it: no line of light where the two meet - by each
  // vertex's own direction, the grid's, before the skull was laid on it: dirs)
  const napeLight = (geo, dirs) => {
    const Nm = geo.attributes.normal;
    for (let i = 0; i < Nm.count; i++) {
      const nx = dirs[i * 3], ny = dirs[i * 3 + 1], nz = dirs[i * 3 + 2];
      if (nx > 0.3 || ny > -0.1) continue;
      const N = napeAt(HS0(nx, ny, nz, false)); if (!N || N.s >= 0.7 * kN) continue;
      const t = N.w * (N.s < 0 ? 1 : (1 - N.s / (0.7 * kN)) ** 2), x = Nm.getX(i) + (N.qx / N.rh - Nm.getX(i)) * t, y = Nm.getY(i) * (1 - t), z = Nm.getZ(i) + (N.qz / N.rh - Nm.getZ(i)) * t, l = Math.hypot(x, y, z) || 1;
      Nm.setXYZ(i, x / l, y / l, z / l);
    }
  };
  // (detail: a person seen from a few metres or more - a crowd - is built on coarser spheres, far quicker; a crowd's
  // faces carry no paint, their features made of their own few parts in the crowd's colours)
  const DQ = Math.max(o.segQ ? 0.2 : 0.35, Math.min(1, o.detail ?? 1)), sg = (k) => Math.max(o.segQ ? 9 : 12, Math.round(k * DQ)), painted = !o.segQ;
  /** the head's surface: out (a number, or a function of the direction) grows it outward (hair, a beard); bumps: the face's features on it */
  const skull = (geo, out = 0, bumps = !out) => {
    const p = geo.attributes.position, A = p.array, fn = typeof out === 'function';
    const dirs = !out ? new Float32Array(p.count * 3) : null;
    for (let i = 0; i < p.count; i++) { const ax = A[i * 3], ay = A[i * 3 + 1], az = A[i * 3 + 2], il = 1 / (Math.hypot(ax, ay, az) || 1), nx = ax * il, ny = ay * il, nz = az * il, [x, y, z] = HSf(nx, ny, nz, bumps), k = R0 * (1 + (fn ? out(nx, ny, nz) : out)); if (dirs) { dirs[i * 3] = nx; dirs[i * 3 + 1] = ny; dirs[i * 3 + 2] = nz; } A[i * 3] = hc.x + x * k; A[i * 3 + 1] = hc.y + y * k; A[i * 3 + 2] = hc.z + z * k; }
    geo.computeVertexNormals(); if (geo.userData.grid) weldGrid(geo);
    // (its bare skin - not the hair grown from it - lit as the neck where it comes down into it)
    if (dirs) napeLight(geo, dirs);
    return geo;
  };
  // (her painted face sculpted in planes - its sockets, bridge and lips - on a grid closer over the face, never coarser
  // than a full one's where she is seen near)
  const fg = fem && painted, fq = fg && DQ >= 0.6 ? (k) => Math.max(k, sg(k)) : sg;
  const face = skull(headGrid(fq(o.segQ ? 64 : 72), fq(52), fg));
  // the hair: the skull grown outward by the style (volume where it is worn up or long), kept above its hairline (high at
  // the forehead, round the temples, over or behind the ears, low at the nape); worn long, it covers the ears
  const hs = ST.hs || 'short', crown = (ny) => clamp01(ny), frontTop = (nx, ny) => clamp01(nx) * clamp01((ny - 0.3) / 0.7);
  const base = hs === 'buzz' ? 0.03 : 0.05 + (seed % 3) * 0.01, DOWN = LONG_HS.has(hs) || hs === 'bob', side = ST.part === 1 || ST.part === -1 ? ST.part : (seed >>> 6) & 1 ? 1 : -1;
  // (the parting: on one side, from the forehead back to the crown)
  const parting = (nx, ny, nz) => 0.016 * gau(nz - side * (0.07 + 0.1 * clamp01((nx + 0.45) / 1.1)), 0.05) * clamp01((ny - 0.35) / 0.35) * clamp01(nx + 0.6);
  // (and the strands combed away from it: soft grooves running from the parting down the sides and the back - worn long,
  // smooth where its curtain comes out of it, from the crown back and down: the curtain crosses it there along a smooth
  // line, never a scalloped one)
  const strands = (nx, ny, nz) => 0.012 * Math.abs(Math.sin(Math.atan2(ny + 0.35, -nx) * 14 + nz * 3 * side)) * clamp01((ny + 0.3) / 0.5) * (LONG_HS.has(hs) ? 1 - ss3(0.35, -0.15, nx) * ss3(1.02, 0.7, ny) : 1);
  // (a high ponytail's tied up on the crown, a topknot's on top of the head)
  // (a curly updo's bun high on the crown - under a cap, low at the back below its rim)
  const tieDir = CURLBUN.has(hs) ? (o.cap ? V(-0.985, 0.1, 0) : hs === 'curlybun' ? V(-0.4, 0.917, 0) : V(-0.3, 0.954, 0)).normalize() : hs === 'ponytail' || (hs === 'highpony' && o.cap) ? V(o.cap ? -0.97 : -0.89, o.cap ? 0.22 : 0.45, 0).normalize() : hs === 'highpony' ? V(-0.5, 0.866, 0) : hs === 'topknot' ? V(-0.2, 0.98, 0).normalize() : V(-0.652, 0.758, 0);
  // (pulled up sleek: fine grooves combed straight from the hairline to the tie, the shortest way - by the angle round
  // the tie's axis - fading out where it is gathered)
  const comb = (nx, ny, nz) => 0.009 * Math.abs(Math.sin(26 * Math.atan2(nz, nx * tieDir.y - ny * tieDir.x))) * ss3(0.97, 0.75, nx * tieDir.x + ny * tieDir.y);
  // (a curly updo's: soft ridges swept up from the hairline to its bun, round its axis - a messy one's wandering - fading
  // out where they are gathered: in [-0.5, 0.5], up on a ridge)
  const ridge = (nx, ny, nz) => { const t = nx * tieDir.x + ny * tieDir.y, a = Math.atan2(nz, nx * tieDir.y - ny * tieDir.x); return 0.5 * Math.cos(hs === 'curlybun' ? 16 * a + 0.6 * Math.sin(7 * t) : 14 * a + 1.5 * Math.sin(5 * t + 1) + 0.7 * Math.sin(9 * t + 3 * a)) * ss3(0.96, 0.72, t); };
  // (a man's short styles: short at the sides and the back, fuller on top, combed - a side parting, swept back, a quiff)
  const cut = (nx, ny, nz) => base * (0.62 + 0.38 * ss3(0.15, 0.6, ny)) + 0.012 * crown(ny) + 0.008 * Math.abs(Math.sin(nz * 24 + nx * 5 * side)) * clamp01((ny + 0.1) / 0.4);
  const HAIR_OUT = {
    short: cut, buzz: () => base, side: (nx, ny, nz) => cut(nx, ny, nz) + 0.02 * crown(ny) - parting(nx, ny, nz) * 0.6,
    quiff: (nx, ny, nz) => cut(nx, ny, nz) + 0.75 * frontTop(nx, ny) ** 1.6, swept: (nx, ny, nz) => cut(nx, ny, nz) + 0.35 * frontTop(nx, ny) ** 1.3 + 0.02 * crown(ny),
    curly: (nx, ny, nz) => 0.085 + 0.03 * Math.sin(nx * 26) * Math.sin(ny * 23 + 1) * Math.sin(nz * 25 + 2) + 0.04 * crown(ny),
    wavy: (nx, ny, nz) => 0.075 + 0.012 * Math.sin(ny * 18 + nz * 9) + 0.04 * crown(ny),
    locs: (nx, ny, nz) => 0.07 + 0.018 * Math.abs(Math.sin(nz * 38 + ny * 5)) + 0.03 * crown(ny),
    mullet: (nx, ny) => base + 0.02 * crown(ny) + 0.07 * clamp01(-nx) * clamp01(0.3 - ny),
    // (worn long: lifted at the roots, fullest at the crown - a blowout the most)
    long: (nx, ny, nz) => 0.058 + 0.05 * crown(ny) ** 1.3 - parting(nx, ny, nz) + strands(nx, ny, nz), waves: (nx, ny, nz) => 0.064 + 0.056 * crown(ny) ** 1.3 - parting(nx, ny, nz) + strands(nx, ny, nz), curlyLong: (nx, ny) => 0.078 + 0.055 * crown(ny),
    // (a blowout: brushed up off the roots - two to three centimetres of lift at the crown, the front lifted off the brow
    // and swept back, full over the temples - never a cap close to the skull)
    blowout: (nx, ny, nz) => 0.09 + 0.19 * crown(ny) ** 1.4 + 0.05 * clamp01(nx) * ss3(0.3, 0.8, ny) + 0.085 * nz * nz * ss3(-0.6, 0.25, ny) - 1.2 * parting(nx, ny, nz) + 0.8 * strands(nx, ny, nz),
    // (pulled up sleek: close to the head, a little fuller where it is gathered)
    highpony: (nx, ny, nz) => 0.03 + 0.006 * crown(ny) + 0.014 * Math.max(0, 1 - Math.hypot(nx - tieDir.x, ny - tieDir.y, nz) / 0.4) - comb(nx, ny, nz), topknot: (nx, ny, nz) => 0.03 + 0.007 * crown(ny) - comb(nx, ny, nz),
    bob: (nx, ny, nz) => 0.05 + 0.03 * crown(ny) - parting(nx, ny, nz) + strands(nx, ny, nz), pixie: (nx, ny, nz) => base * 0.7 + 0.015 * crown(ny) + strands(nx, ny, nz) * 0.6,
    // (a ponytail's and a bun's combed back to the tie as the sleek ones are, a little fuller: its grooves in the shell)
    ponytail: (nx, ny, nz) => 0.032 + 0.008 * crown(ny) + 0.02 * Math.max(0, 1 - Math.hypot(nx - tieDir.x, ny - tieDir.y, nz) / 0.45) - comb(nx, ny, nz), bun: (nx, ny, nz) => 0.032 + 0.008 * crown(ny) - comb(nx, ny, nz),
    // (a curly updo's: swept up to its bun, never slicked - a soft rise at the front, fuller where it is gathered, the
    // texture of the curls beneath (a messy one's, waves combed up) - its ridges low, mostly in the shading: never a
    // pumpkin's lobes round the back of the head)
    curlybun: (nx, ny, nz) => 0.042 + 0.008 * crown(ny) + 0.03 * clamp01(nx) ** 1.5 * ss3(0.2, 0.7, ny) + 0.012 * Math.max(0, 1 - Math.hypot(nx - tieDir.x, ny - tieDir.y, nz) / 0.45) + 0.005 * ridge(nx, ny, nz) + 0.003 * Math.sin(nx * 17) * Math.sin(ny * 15 + 1) * Math.sin(nz * 19 + 2),
    messybun: (nx, ny, nz) => 0.04 + 0.008 * crown(ny) + 0.026 * clamp01(nx) ** 1.5 * ss3(0.2, 0.7, ny) + 0.012 * Math.max(0, 1 - Math.hypot(nx - tieDir.x, ny - tieDir.y, nz) / 0.45) + 0.005 * ridge(nx, ny, nz),
  };
  // (the hairline by the angle round from the front: a man's a little higher at the temples, the sideburns in front of
  // his ears; worn down, it carries on below the ears; pulled back, it shows them)
  const LINE = DOWN ? [[0, 0.6], [0.45, 0.56], [0.8, 0.42], [1.0, 0.24], [1.22, -0.08], [1.55, -0.4], [2.2, -0.55], [Math.PI, -0.6]]
    // (pulled back: down behind the ear a finger's width back from it, then sweeping on down to the nape - behind and
    // below the base of the skull, where the shell stops at the neck (NAPE) and the nape's own hair carries it on down
    // the neck: never a shaved-looking occiput under a bun or a ponytail)
    : hs === 'ponytail' || hs === 'bun' || hs === 'pixie' || SLEEK.has(hs) || CURLBUN.has(hs) ? [[0, 0.6], [0.45, 0.55], [0.8, 0.42], [1.15, 0.27], [1.4, 0.16], [1.75, 0.04], [2.05, -0.22], [2.35, -0.6], [2.7, -0.85], [Math.PI, -0.9]]
      : [[0, 0.57], [0.3, 0.58], [0.55, 0.6], [0.8, 0.5], [1.05, 0.32], [1.27, 0.2], [1.37, -0.06], [1.47, 0.14], [1.75, 0.06], [2.3, -0.33], [Math.PI, -0.48]];
  // (level across the middle of the forehead - rounded there, never a peak or a notch where its two sides meet)
  const LL = lut(LINE, 0, Math.PI, 160), L0 = LL(0)[0], hairLine = (nx, nz) => { const ph = Math.abs(Math.atan2(nz, nx)); let l = L0 + (LL(ph)[0] - L0) * ss3(0, 0.35, ph) + (DOWN ? 0 : 0.018 * ss3(0.2, 0.75, ph) * (fem ? ss3(2.6, 2.0, ph) : 1) * Math.sin(ph * 11 + (seed % 7))); if (hs === 'mullet') l -= 0.3 * ss3(1.9, 2.6, ph); if (hs === 'curly' || hs === 'wavy' || hs === 'locs') l -= 0.04 * ss3(1.2, 0.3, ph) + 0.1 * ss3(2, 2.8, ph); return l; };
  const ss = ss3, hairW = (nx, ny, nz) => { const l = hairLine(nx, nz); return ss(l - 0.15, l + 0.05, ny); };
  // (under a cap the hair is pressed flat: only what shows below its rim keeps the style's volume)
  const hairOut0 = HAIR_OUT[hs] || HAIR_OUT.short, hairOut = o.cap ? (nx, ny, nz) => (ny > 0.05 ? Math.min(0.055, hairOut0(nx, ny, nz)) : hairOut0(nx, ny, nz)) : hairOut0;
  /**
   * A shell over the head: grown by out x weight (following the face's features, or not), weight in [0, 1] by where on
   * the head (unit-sphere direction). Where the weight runs out the shell sinks just under the skin, so its visible edge
   * is the smooth line where it comes out of the face (a hairline, the edge of a beard), not the triangles' steps.
   * Only the triangles with some weight are kept; each vertex shaded by tone(direction, weight) - a shade darker toward
   * the edge, lighter on top
   */
  const shell = (out, bumps, weight, tone = (nx, ny, nz, w) => 0.86 + 0.14 * w, res = 1, edge = null) => {
    const g0 = headGrid(sg((edge ? (fem ? 72 : 96) : 80) * res), sg((edge ? 26 : 56) * res)), U = g0.attributes.position.array, nv = g0.attributes.position.count, W = new Float32Array(nv), [gu, gv] = g0.userData.grid, Wd = gu + 1;
    // (an edge of its own - edge(nx, nz): its height (ny) by the way round from the front: the grid's rows drawn from it up
    // to the crown, the third of them on it and the two under it sunk beneath the skin, so the shell comes out of the skin
    // steeply just under that row - the hairline the clean curve the row follows, never the ragged line a thin shell
    // makes through its triangles where it meets the skin at a shallow angle; and every row on the hair, none wasted on
    // the face)
    if (edge) for (let j = 0; j <= gu; j++) {
      // (its columns nearly evenly round the head - a little closer at the hairline in front - the hair's combed or curled
      // texture drawn as finely at the back as anywhere, never aliased into broad lobes there)
      const sj = 2 * j / gu - 1, ph = Math.PI * (0.8 * sj + 0.2 * sj ** 3), cp = Math.cos(ph), sp = Math.sin(ph), e = Math.asin(Math.max(-0.95, Math.min(0.95, edge(cp, sp))));
      for (let i = 0; i <= gv; i++) { const u = (i - 2) / (gv - 2), th = i < 2 ? e - (2 - i) * 0.012 : e + (Math.PI / 2 - e) * u * (0.4 + 0.6 * u), c = Math.cos(th), k = (i * Wd + j) * 3; U[k] = c * cp; U[k + 1] = Math.sin(th); U[k + 2] = c * sp; }
    }
    const U0 = Float32Array.from(U);
    // (each vertex's weight, once, from where it is on the unit sphere - before the skull moves it; under an edge, none)
    for (let i = 0; i < nv; i++) W[i] = edge && i < 2 * Wd ? -1 : weight(U[i * 3], U[i * 3 + 1], U[i * 3 + 2]);
    // (with an edge: from just over the skin there (EL) out to the full growth)
    // (an edge's own row a few millimetres clear of the skin, the rows under it only just under it: the shell crosses the
    // skin on the steep step between them all along the line, never wandering up into the shallow rows above as a sawtooth)
    let wi = 0; const SINK = -0.03, EL = 0.005, SE = -0.007, of = (nx, ny, nz) => { const w = W[wi++]; return w < 0 ? (edge ? SE : SINK) : edge ? EL + (out(nx, ny, nz) - EL) * w : SINK + (out(nx, ny, nz) - SINK) * w; };
    skull(g0, of, bumps);
    const idx = g0.index.array, P = g0.attributes.position.array, Nn = g0.attributes.normal.array, map = new Int32Array(nv).fill(-1), pos = [], nor = [], col = [], ix = [], kept = edge ? (w) => w >= 0 : (w) => w > 0;
    // (the steep rise out of the skin lit as the hair just beyond it: no line of light or shade along the hairline)
    if (edge) for (let j = 0; j <= gu; j++) for (const i of [1, 2]) for (let a = 0; a < 3; a++) Nn[(i * Wd + j) * 3 + a] = Nn[(3 * Wd + j) * 3 + a];
    for (let i = 0; i < idx.length; i += 3) {
      const t = [idx[i], idx[i + 1], idx[i + 2]]; if (!(kept(W[t[0]]) || kept(W[t[1]]) || kept(W[t[2]]))) continue;
      for (const v of t) { if (map[v] < 0) { map[v] = pos.length / 3; pos.push(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]); nor.push(Nn[v * 3], Nn[v * 3 + 1], Nn[v * 3 + 2]); const c = tone(U0[v * 3], U0[v * 3 + 1], U0[v * 3 + 2], Math.max(0, W[v])); if (typeof c === 'number') col.push(c, c, c); else col.push(c[0], c[1], c[2]); } ix.push(map[v]); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(ix); g0.dispose(); return g;
  };
  // (its edge the hairline itself, a clean curve round the head (shell's edge): a little below the line, where the painted
  // baby hairs come out from under it (faceTexture) - the hair thin there, filling out over a little more than a
  // centimetre above it - never the ragged line a shell makes through its triangles where it sinks into the skin; the
  // fuller the style there, the longer its rise (rw): a long one's mass rising gently off the brow, never a ledge whose
  // face reads as a dark band across the forehead)
  const hEdge0 = (nx, nz) => hairLine(nx, nz) - 0.065;
  // (pulled back, a pixie: the nape. The skull's base found against the neck's own surface (nRing0): the scalp's shell
  // ends a little above it (edge: a share of the way up the occiput) - never running on down inside the neck along it in
  // a sawtooth, nor stopping short over a bare occiput - and the nape's own hair carries on from there in two parts:
  // across the hollow where the occiput meets the neck, from the shell's edge over the corner (the head's, turning with
  // it), diving into the neck below the base; and on the neck itself (the body's), down to its hairline - lowest at the
  // middle, a share of the neck's radius below the base (about the jaw's angle), rising behind the ears - thinning to its
  // edge and sunk into the skin there, a clean line; well above any collar. Never a shaved occiput over a bare peg)
  const NAPE = !DOWN && (hs === 'ponytail' || hs === 'bun' || hs === 'pixie' || SLEEK.has(hs) || CURLBUN.has(hs)) ? (() => {
    const toB = new THREE.Matrix4().compose(J.neck, new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), rotZ), V(F.hd, F.hd, F.hd)), toHd = toB.clone().invert();
    // (a point of the body's frame against the neck: how far up it (h), the way round (a), how far out of its surface (d))
    const neckPar = (p) => { let h = p.clone().sub(nb).dot(an); for (let it = 0; it < 2; it++) { const c = nAt(h), t = nAt(h + 0.002).sub(nAt(h - 0.002)).normalize(); h += p.clone().sub(c).dot(t); } const c = nAt(h), fw = fwAt(h), d = p.clone().sub(c), u = d.dot(fw), v = d.dot(nSd), a = Math.atan2(v, u), rr = nRing0(h, a).sub(c); return { h, a, d: Math.hypot(u, v) - Math.hypot(rr.dot(fw), rr.dot(nSd)) }; };
    // (the skull's surface in the head's frame: the way round (ph), the height (ny), o2 out from it; tN: the nape's hair
    // through, a share of the neck's radius)
    const tN = 0.035 * NK.rTop, EL = 0.0005, skH = (ph, ny, o2) => { const cb = Math.sqrt(Math.max(0, 1 - ny * ny)), [a, b, c] = HSf(cb * Math.cos(ph), ny, cb * Math.sin(ph), false), k = R0 + o2; return V(hc.x + a * k, hc.y + b * k, hc.z + c * k); };
    const inN = (ph, ny) => neckPar(skH(ph, ny, EL).applyMatrix4(toB)).d < tN;
    // (the base's height on the skull every way round behind the face: up from under it to where it leaves the neck)
    const JL = [];
    for (let k = 0; k <= 24; k++) {
      const ph = 1.3 + (Math.PI - 1.3) * k / 24; let lo = -0.96, hi = lo;
      if (!inN(ph, lo)) { JL.push([ph, -1]); continue; }
      while (hi < -0.1 && inN(ph, hi)) { lo = hi; hi += 0.05; }
      for (let it = 0; it < 6; it++) { const m = 0.5 * (lo + hi); if (inN(ph, m)) lo = m; else hi = m; }
      JL.push([ph, 0.5 * (lo + hi)]);
    }
    const nyJ = (ph) => { ph = Math.abs(ph); if (ph <= JL[0][0]) return -1; const f = (ph - JL[0][0]) / (JL[1][0] - JL[0][0]), i = Math.min(JL.length - 2, Math.floor(f)); return JL[i][1] + (JL[i + 1][1] - JL[i][1]) * (f - i); };
    const ph0 = 2.0, dl = 0.12, edge = (ph) => (Math.abs(ph) < ph0 ? -1 : nyJ(ph) + dl);
    /** columns of points (each from its top down) as a surface, a colour each; skin: the body's (its weights all the body's); inner: a face beneath from that row on */
    const grid = (C, cols, skin, inner = false) => {
      const NC = C.length, KR = C[0].length, nv = NC * KR, pos = new Float32Array(nv * 3), cc = new Float32Array(nv * 3), ix = [];
      for (let j = 0; j < NC; j++) for (let k = 0; k < KR; k++) { const i = j * KR + k, p = C[j][k]; pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z; cc.set(cols[j], i * 3); }
      for (let j = 0; j < NC - 1; j++) for (let k = 0; k < KR - 1; k++) { const a = j * KR + k, b = a + KR; ix.push(a, b, b + 1, a, b + 1, a + 1); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(cc, 3));
      if (skin) { const si = new Uint16Array(nv * 4), sw = new Float32Array(nv * 4); for (let i = 0; i < nv; i++) { si[i * 4 + 1] = 1; sw[i * 4] = 1; } g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4)); }
      g.setIndex(ix); g.computeVertexNormals();
      // (its faces wound to look out, away from the neck: the back of it is the head's -x)
      const fl = g.attributes.normal.getX((NC >> 1) * KR + (KR >> 1)) > 0;
      if (fl) { for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.setIndex(ix); g.computeVertexNormals(); }
      if (inner === false) return g;
      // (where it may stand off the neck as the head turns: hair beneath it too, a shade darker - never a gap to see through)
      const N = g.attributes.normal.array, p2 = new Float32Array(nv * 6), c2 = new Float32Array(nv * 6), n2 = new Float32Array(nv * 6), i2 = ix.slice();
      p2.set(pos); c2.set(cc); n2.set(N);
      for (let i = 0; i < nv; i++) for (let k = 0; k < 3; k++) { p2[(nv + i) * 3 + k] = pos[i * 3 + k] - 0.0008 * N[i * 3 + k]; c2[(nv + i) * 3 + k] = 0.72 * cc[i * 3 + k]; n2[(nv + i) * 3 + k] = -N[i * 3 + k]; }
      for (let j = 0; j < NC - 1; j++) for (let k = inner; k < KR - 1; k++) { const a = nv + j * KR + k, b = a + KR; if (fl) i2.push(a, b, b + 1, a, b + 1, a + 1); else i2.push(a, b + 1, b, a, a + 1, b + 1); }
      const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.BufferAttribute(p2, 3)); g2.setAttribute('normal', new THREE.BufferAttribute(n2, 3)); g2.setAttribute('color', new THREE.BufferAttribute(c2, 3)); g2.setIndex(i2); g.dispose();
      return g2;
    };
    /** the nape's hair, coloured by the shell's own tone -> { head (the head's frame), body (the body's, skinned all to it) } */
    const strip = (tone) => {
      const D = 0.36 * NK.rTop, f1 = 0.15 * NK.rTop, U = 0.3 * NK.rTop, NC = n(15, 7), NB = n(5, 2), NN = n(3, 1), XB = 0.35, hMin = sChin + 0.2 * NK.rTop, at = (h, a, o2) => nRing(h, a, o2).applyMatrix4(toHd), CH = [], CB = [], colH = [], colB = [];
      // (a way round (ph): the base there - its height on the skull (nJ), up the neck (hJ) and round it (a) - how far across
      // the hollow it bridges (bw) and how far below the base the hairline (c): none behind the ear, all from the middle out)
      const colAt = (ph) => { const ap = Math.abs(Math.atan2(Math.sin(ph), Math.cos(ph))), nJ = Math.max(nyJ(Math.max(ap, 1.31)), -0.95), J0 = skH(ph, nJ, EL), np = neckPar(J0.clone().applyMatrix4(toB)), d = J0.clone().sub(hc).normalize(), tc = tone(d.x, d.y, d.z, 1); return { nJ, hJ: np.h, a: np.a, bw: ss3(ph0, ph0 + 0.4, ap), c: ss3(ph0 + 0.05, ph0 + 0.6, ap), col: typeof tc === 'number' ? [tc, tc, tc] : tc }; };
      // (the head's part: tucked under the shell's edge (e), over the corner along a curve (a quadratic through the base's
      // own point - lying on the skull and the neck where it does not bridge), into the neck a little below the base)
      for (let j = 0; j < NC; j++) {
        const ph = ph0 + (2 * Math.PI - 2 * ph0) * j / (NC - 1), { nJ, hJ, a, bw, col } = colAt(ph), e = Math.max(hEdge0(Math.cos(ph), Math.sin(ph)), nJ + dl);
        const qj = at(hJ, a, tN), B2 = skH(ph, e, 0.6 * EL), B0 = at(hJ - f1 * bw, a, tN), ch = [skH(ph, Math.min(0.95, e + 0.05), 0.4 * EL)];
        for (let k = 0; k <= NB; k++) { const t = k / NB, bz = B2.clone().multiplyScalar((1 - t) ** 2).addScaledVector(qj, 2 * t * (1 - t)).addScaledVector(B0, t * t), sf = t < 0.5 ? skH(ph, e + (nJ - e) * 2 * t, 0.6 * EL + (tN - 0.6 * EL) * 2 * t) : at(hJ - f1 * bw * (2 * t - 1), a, tN); ch.push(sf.lerp(bz, bw)); }
        ch.push(at(hJ - f1 * bw - 0.03 * NK.rTop, a, -0.05 * NK.rTop));
        CH.push(ch); colH.push(col);
      }
      // (the body's: on the neck from under the skull down to the hairline, a little wider round than the head's - hidden
      // under the skull, it shows where the head turns from over it)
      const NCB = NC + 2 * Math.max(1, Math.round(XB / ((2 * Math.PI - 2 * ph0) / (NC - 1))));
      for (let j = 0; j < NCB; j++) {
        const ph = ph0 - XB + (2 * Math.PI - 2 * ph0 + 2 * XB) * j / (NCB - 1), { hJ, a, bw, c, col } = colAt(ph);
        const hL = Math.max(hMin, hJ - Math.max((f1 + 0.06 * NK.rTop) * bw, D * c)), cb = [nRing(hJ + U, a, 0.8 * tN), nRing(hJ, a, 0.8 * tN)];
        for (let k = 1; k <= NN; k++) { const t = k / NN; cb.push(nRing(hJ + (hL - hJ) * t, a, 0.8 * tN * (1 - 0.5 * ss3(0.3, 1, t)))); }
        cb.push(nRing(hL - 0.02 * NK.rTop, a, -0.06 * NK.rTop));
        CB.push(cb); colB.push(col);
      }
      return { head: grid(CH, colH, false, Q >= 1 ? 1 + (NB >> 1) : false), body: grid(CB, colB, true) };
    };
    return { edge, strip };
  })() : null;
  const hEdge = (nx, nz) => { const e = hEdge0(nx, nz); return NAPE ? Math.max(e, NAPE.edge(Math.atan2(nz, nx))) : e; }, hairWe = (nx, ny, nz) => { const e = hEdge(nx, nz), rw = 0.12 + (DOWN || CURLBUN.has(hs) ? 3 * Math.max(0, hairOut0(nx, Math.max(-0.9, e), nz) - 0.03) : 0); return hairW(nx, ny, nz) * (0.25 + 0.75 * ss(e, e + rw, ny)); };
  // (worn long, its locks cover most of it: a coarser shell beneath them)
  // (her own shadow root (style.tone): worn down, the scalp's hair deepest at the parting and the crown, melting away down
  // the head to none by its middle - where the lengths come out over it, their own root's melt carrying on from it, never a
  // dark cap with an edge; pulled back, a soft gradient from the hairline and the nape (at most a little over half the
  // root's depth: dimension, never a dark band) to none at the tie, where the tail's own lengths begin)
  const rootTone = (fn) => (!HT?.root ? fn : (nx, ny, nz, w) => { const v = fn(nx, ny, nz, w), a = DOWN || hs === 'pixie' || !(hs === 'ponytail' || hs === 'bun' || SLEEK.has(hs) || CURLBUN.has(hs)) ? 0.75 * ss3(0.1, 0.85, ny) : 0.55 * (1 - ss3(-0.2, 0.95, nx * tieDir.x + ny * tieDir.y)); return HT.root.map((r) => v * (r + (1 - r) * (1 - a))); });
  // (the nape's hair in the shell's own tone; its head part with the shell, its body part with the locks on the body)
  const hTone = rootTone((nx, ny, nz, w) => (0.84 + 0.16 * hairW(nx, ny, nz)) * (0.86 + 0.18 * clamp01(ny + 0.2)) * (CURLBUN.has(hs) ? 1 + (hs === 'curlybun' ? 0.06 : 0.05) * ridge(nx, ny, nz) : 1)), napeH = NAPE ? NAPE.strip(hTone) : null;
  const hair = shell(hairOut, false, hairWe, hTone, LONG_HS.has(hs) || CURLBUN.has(hs) ? 0.8 : 1, hEdge), hairExtra = napeH ? [napeH.head] : [];
  // (the skin under the hair - more than a share of the head's height inside its edge - never seen: the scalp's shell lies
  // over it, its own size out from it, and turns with it whatever the head does. Left out: some two to three thousand
  // triangles fewer for every head, nothing to see for it; by the grid's own directions, the shell's edge's measure)
  {
    const U = headGrid(fq(o.segQ ? 64 : 72), fq(52), fg).attributes.position.array, ix = face.index.array, nv = U.length / 3, under = new Uint8Array(nv), keep = [];
    for (let i = 0; i < nv; i++) under[i] = U[i * 3 + 1] > hEdge(U[i * 3], U[i * 3 + 2]) + 0.1 ? 1 : 0;
    for (let t = 0; t < ix.length; t += 3) if (!(under[ix[t]] && under[ix[t + 1]] && under[ix[t + 2]])) keep.push(ix[t], ix[t + 1], ix[t + 2]);
    face.setIndex(keep);
  }
  const capOut = (nx, ny, nz) => hairOut(nx, ny, nz) * hairWe(nx, ny, nz);
  if (hs === 'locs') {
    // locs gathered at the crown and falling down the back of the head
    // (under a cap: from below its rim at the back)
    const y0 = o.cap ? 0.035 : 0.1, x0 = o.cap ? -0.115 : -0.075;
    // (each closed at both ends: drawn in to a point at its root, under the hair, and tapering to a rounded tip - never an
    // open tube to see into from above or below)
    for (let k = -4; k <= 4; k++) {
      const z = hc.z + k * 0.011, sw = k * 0.003, TS = n(14, 4), RS = n(6, 3), cv = new THREE.CatmullRomCurve3([V(hc.x + x0, hc.y + y0, z), V(hc.x - 0.13, hc.y + Math.min(y0, 0.06), z + sw), V(hc.x - 0.145, hc.y - 0.03, z + sw * 2), V(hc.x - 0.138, hc.y - 0.11 - Math.abs(k) * 0.004, z + sw * 3)]), lg = new THREE.TubeGeometry(cv, TS, 0.0072, RS, false), LP = lg.attributes.position, q = V(0, 0, 0);
      for (let i = 0; i <= TS; i++) { const u = i / TS, s = Math.min(Math.sqrt(clamp01(u * TS / 1.5)), Math.sqrt(clamp01((1 - u) * TS / 2.2))); if (s >= 1) continue; const c = cv.getPointAt(u); for (let j = 0; j <= RS; j++) { const ix = i * (RS + 1) + j; q.fromBufferAttribute(LP, ix).sub(c).multiplyScalar(s).add(c); LP.setXYZ(ix, q.x, q.y, q.z); } }
      hairExtra.push(lg);
    }
    if (!o.cap) { const tie = new THREE.TorusGeometry(0.035, 0.007, 6, 16); tie.rotateZ(Math.PI / 2 - 0.5); tie.translate(hc.x - 0.112, hc.y + 0.078, hc.z); hairExtra.push(tie); }
  }
  // (where a ponytail or a bun is tied: on the hair at the back of the head, the way the tail leaves)
  const tieP = (() => { const [a, b, c] = HSf(tieDir.x, tieDir.y, tieDir.z, false), k = R0 * (1 + hairOut(tieDir.x, tieDir.y, tieDir.z)); return V(hc.x + a * k, hc.y + b * k, hc.z + c * k); })();
  let band2 = null;
  if ((hs === 'bun' || hs === 'topknot') && !o.cap) {
    // a bun coiled at the back of the crown, a band round its base; a topknot high on top, smaller, neater and taller -
    // its coil wound round it, its base wrapped in a strand of its own hair
    const top = hs === 'topknot', u = tieDir, bc = tieP.clone().addScaledVector(u, top ? 0.03 : 0.026), e2 = V(0, 0, 1), e1 = new THREE.Vector3().crossVectors(u, e2), R = [], K = sg(18);
    const r1 = top ? 0.034 : 0.04, r2 = top ? 0.037 : 0.046, hh = top ? 0.034 : 0.031, ridge = top ? (a, b) => 1 + 0.06 * Math.sin(2 * a - b * 7) * Math.sin(b) : (a, b) => 1 + 0.06 * Math.sin(4 * a + b * 7) + 0.03 * Math.sin(11 * a);
    for (let k = 0; k <= K; k++) { const b = Math.PI * k / K, c = bc.clone().addScaledVector(u, -Math.cos(b) * hh); R.push(ringOf(c, e1, e2, Math.sin(b) ** (top ? 0.8 : 1) * r1, Math.sin(b) ** (top ? 0.8 : 1) * r2, sg(24), (a) => ridge(a, b))); }
    hairExtra.push(loft(R));
    const bd = new THREE.TorusGeometry(top ? 0.026 : 0.03, top ? 0.0075 : 0.0055, n(6), n(20)); bd.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), u)); bd.translate(bc.x - u.x * (top ? 0.026 : 0.022), bc.y - u.y * (top ? 0.026 : 0.022), bc.z);
    if (top) hairExtra.push(tint(bd, 0.9)); else band2 = bd;
  }
  // (the way the tail leaves its tie: down and back; a high one's up and back, arching over)
  const tieD = hs === 'highpony' && !o.cap ? V(-0.75, 0.66, 0).normalize() : V(-0.8, -0.6, 0).normalize();
  let cuff = null;
  if (hs === 'ponytail' || hs === 'highpony') {
    // the ponytail's root, gathered where it is tied (its tail hangs from the body), and the tie - a cuff in the accent
    // colour; a high one's snatched tight into a metal cuff, a band of gold or silver round it
    const hi = hs === 'highpony', rb = new THREE.SphereGeometry(hi ? 0.018 : 0.024, n(14), n(10, 2)); if (!hi) rb.scale(1, 1.3, 1.05); rb.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, tieD)); rb.translate(tieP.x - tieD.x * (hi ? 0.006 : 0.002), tieP.y - tieD.y * (hi ? 0.006 : 0.002), tieP.z); hairExtra.push(rb);
    if (!hi) { band2 = new THREE.TorusGeometry(0.02, 0.0065, n(8), n(18)); band2.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), tieD)); band2.translate(tieP.x + tieD.x * 0.012, tieP.y + tieD.y * 0.012, tieP.z); }
    else { cuff = new THREE.LatheGeometry([[0.0166, -0.0135], [0.0184, -0.0124], [0.0191, -0.0095], [0.0191, 0.0095], [0.0184, 0.0124], [0.0166, 0.0135]].map(([x, y]) => new THREE.Vector2(x, y)), n(24, 8)); cuff.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, tieD)); cuff.translate(tieP.x + tieD.x * 0.014, tieP.y + tieD.y * 0.014, tieP.z); }
  }
  // (worn long, a bob, a pixie, pulled back: its locks - those that fall on to the body nod and turn with the head where
  // they leave it and lie still where they rest: a skinned mesh, its two bones the body and the head)
  if (DOWN || hs === 'pixie' || hs === 'ponytail' || hs === 'bun' || SLEEK.has(hs) || CURLBUN.has(hs)) {
    const toBody = new THREE.Matrix4().compose(J.neck, new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), rotZ), V(F.hd, F.hd, F.hd));
    // (her own choices (style): a fringe or none, face-framing tendrils - none, one or two each side - her hair's tones)
    const tdN = ST.tendrils === true ? 2 : ST.tendrils === false ? 0 : typeof ST.tendrils === 'number' && isFinite(ST.tendrils) ? Math.max(0, Math.min(2, Math.round(ST.tendrils))) : null;
    const L = hairLocks({ hs, seed, side, hc, R0, shape: HSf, out: capOut, toBody, J, C: bodyClear(J, F, T), fringe: typeof ST.fringe === 'boolean' ? ST.fringe : hs === 'pixie' || (hs !== 'curlyLong' && !((seed >>> 9) & 1)), line: hairLine, tie: { p: tieP, d: tieD, dir: tieDir }, dq: DQ, lum: 0.2126 * hairC.r + 0.7152 * hairC.g + 0.0722 * hairC.b, cap: !!o.cap, tendrils: tdN, tint: HT, sk: hSk, braid: !!ST.braid && !o.cap });
    hairExtra.push(...L.head); lockBody = L.body;
  }
  if (napeH) lockBody.push(napeH.body);
  if (o.headless) { for (const g of lockBody) { g.deleteAttribute('skinIndex'); g.deleteAttribute('skinWeight'); } parts.hair.push(...lockBody); return done(null, -J.bow); }
  // facial hair: a shell that follows the face's features, thinning out at its edges - a beard over the jaw, the chin
  // and up the cheeks to the sideburns with the lips left clear; a mustache over the upper lip (stubble: painted on, or
  // in a crowd a thin shadow of the beard in a colour between the skin and the hair)
  let beard = null;
  if (ST.fh && !(painted && ST.fh === 'stubble')) {
    // (a moustache a soft chevron over the upper lip: fullest under the nose, its top and its lower edge both following the
    // lip's curve down toward the corners, thinning there - its lower edge soft; never a block)
    const stache = (nx, ny, nz) => { const a = Math.abs(nz), top = FACE.baseY - 0.006 - 0.55 * a * a, bot = FACE.mouthY + 0.02 - 0.16 * a * a; return ss(0.6, 0.72, nx) * ss(0.42, 0.3, a) * ss(bot - 0.012, bot + 0.024, ny) * ss(top + 0.006, top - 0.03, ny); };
    // (only the lips left clear - the chin under them bearded, a full beard not a strap along the jaw; its edge up the cheek
    // thinning out over a few centimetres, never a mask's line)
    const lip = (nx, ny, nz) => ss(0.55, 0.7, nx) * ss(0.27, 0.2, Math.abs(nz)) * ss(FACE.mouthY - 0.075, FACE.mouthY - 0.035, ny) * ss(FACE.mouthY + 0.1, FACE.mouthY + 0.04, ny);
    const jw = (nx, ny, nz) => { const line = -0.54 + 0.56 * nz * nz; return ss(line + 0.09, line - 0.1, ny) * ss(-0.32, -0.05, nx) * ss(-0.995, -0.94, ny); };
    const w = ST.fh === 'mustache' ? stache : (nx, ny, nz) => Math.max(jw(nx, ny, nz) * (1 - lip(nx, ny, nz)), stache(nx, ny, nz));
    // (its colour each vertex's own: the hair's - a shade toward the skin, never a flat black - melting into the skin's own
    // toward its edges, and a fine grain of lighter and darker hairs through it: a beard, not a painted mask)
    const bC = hairC.clone().lerp(skinC, 0.15), grain = (nx, ny, nz) => { const h = Math.sin(nx * 127.1 + ny * 311.7 + nz * 74.7) * 43758.5453; return h - Math.floor(h); };
    // (stored as multipliers of the beard's own colour, which its material carries: what is drawn is the same, and every
    //  scene that lifts people in the dark (emissive = colour x lift) lifts it in the beard's colour, not white)
    const bB = [bC.r, bC.g, bC.b].map((v) => Math.max(1e-4, v));
    const bTone = ST.fh === 'stubble' ? undefined : (nx, ny, nz, wt) => { const k = ss(0.12, 0.7, wt), g = 0.78 + 0.34 * grain(nx, ny, nz); return [0, 1, 2].map((i) => { const b = [bC.r, bC.g, bC.b][i] * g, s = [skinC.r, skinC.g, skinC.b][i]; return (s + (b - s) * k) / bB[i]; }); };
    beard = shell(() => (ST.fh === 'beard' ? 0.008 : ST.fh === 'mustache' ? 0.007 : 0.007), true, w, bTone);
  }
  // (hair over the ears: none built)
  // (the ears, by the face's own measures: from the line of the upper lids down to the nose's base (FACE) - a man's a
  // little longer - about half as wide as long, broadest at the top of the helix and narrowing to the lobe, a shallow bowl
  // in each (the concha) - in its own shade - inside a rolled rim (the helix), a shade lighter; set just behind the jaw,
  // tilted back a little, their backs rounded, standing off the head - never a flat paddle seen from behind)
  const eTop = (FACE.eyeY + 0.08) * 1.08 * fLen * R0, eBot = FACE.baseY * fLen * R0, eLh = 0.5 * (eTop - eBot) * (fem ? 1 : 1.06), eCy = hc.y + 0.5 * (eTop + eBot) - (fem ? 0 : 0.002), eTilt = 0.22;
  const ears = DOWN ? [] : [-1, 1].map((s) => {
    const e = new THREE.SphereGeometry(1, n(12, 5), n(10, 3)), P = e.attributes.position, SH = new Float32Array(P.count);
    for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i), zo = z * s, bw = zo > 0 ? zo * Math.exp(-(x * x + (y + 0.1) ** 2) / 0.3) : 0, rim = Math.exp(-((Math.hypot(x, y) - 0.86) ** 2) / 0.02) * clamp01(zo + 0.3); SH[i] = 0.84 * (1 - 0.42 * clamp01(bw / 0.55) + 0.08 * rim); P.setXYZ(i, x * 0.56 * eLh * (0.8 + 0.2 * y), y * eLh, (z - s * 0.7 * bw + s * 0.22 * rim) * (zo < 0 ? 0.44 : 0.34) * eLh); }
    e.computeVertexNormals(); e.rotateY(s * 0.3); e.rotateZ(eTilt); e.translate(hc.x - 0.014, eCy, hc.z + s * 0.08 * fWid);
    const uv = e.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.002, 0.5); const g = tint(e, 0.84), C = g.attributes.color; if (C) for (let i = 0; i < C.count; i++) C.setXYZ(i, SH[i], SH[i], SH[i]); return g;
  });
  if (painted) {
    // the face's paint: her eyes lined and her lids shaded, her lips coloured; his a shaving shadow, or stubble
    const fair = skinC.r + skinC.g + skinC.b > 1.2, IRIS = fair ? ['#4a3020', '#5a4028', '#6a5a32', '#4e6a3c', '#4a6f96', '#6c8094'] : ['#3a2416', '#2e1c12', '#4e3420'];
    // (her make-up by her look - style.makeup; none: a light everyday one - its lip colour hers unless she has her own; her
    // baby hairs along the style's own hairline)
    const MK = fem ? makeupOf(ST.makeup, skinC, seed) : null;
    // (her lips: a fill of her make-up's own, else her style's own colour, else the look's, else her own lips tinted)
    const lipDef = hexOf(skinC.clone().lerp(new THREE.Color(fem ? '#b0404f' : '#9c584f'), fem ? 0.62 : 0.3).multiplyScalar(fem ? 0.95 : 0.93));
    const lipOf = (mk) => (mk?.lipSet ? mk.lipC : typeof ST.lip === 'string' ? ST.lip : mk?.lipC || lipDef);
    // (the brows and the baby hairs in the hair's colour at its roots - a darker root of her own (style.tone), else the hair's)
    const hR = /^#[0-9a-f]{6}$/i.test(ST.tone?.root || '') ? new THREE.Color(ST.tone.root) : hairC, browOf = (c) => hexOf(c.clone().lerp(new THREE.Color('#2a1d16'), fair ? 0.35 : 0.1));
    const faceP = { size: (o.seed != null || o.driver) && DQ >= 0.6 ? 512 : 256, S, skin: hexOf(skinC), iris: ST.iris || IRIS[seed % IRIS.length], brow: browOf(hR), fem,
      stub: fem ? 0 : ST.fh === 'stubble' || ST.fh === 'beard' ? 1 : ST.fh === 'mustache' ? 0.3 : 0.1, beard: hexOf(hairC), hair: hexOf(hR), line: MK ? hairLine : null, lip0: typeof ST.lip === 'string' ? ST.lip : MK?.base.lipC || lipDef };
    faceTex = faceTexture({ ...faceP, lip: lipOf(MK), shadow: MK ? MK.lidC : null, shadow0: MK ? MK.base.lidC : null, mk: MK });
    // (its finish a share of the skin's roughness, the paint's finish map over it)
    mats.face = pplMat('skin', '#ffffff', (mats.skin.roughness ?? 0.72) * 0.92, { map: faceTex.tex, emissiveMap: faceTex.tex, roughnessMap: faceTex.rough, aoMap: faceTex.rough, normalMap: faceTex.nrm || null });
    head.add(M([face, ...ears], mats.face, ['uv']));
    // (her make-up, painted again (restyle): a quick draft into her own canvases while a slider moves, the full paint - the
    // shared cache's - when it stops, the one before given back; or her hair's colour changed, her brows and baby hairs with it)
    if (fem) {
      let curMk = ST.makeup;
      paintFace = (spec, draft = false, hairHex = null) => {
        if (hairHex) { const hc2 = new THREE.Color(hairHex); faceP.brow = browOf(hc2); faceP.hair = hexOf(hc2); faceP.beard = faceP.hair; }
        if (spec === undefined) spec = curMk;
        const MK2 = makeupOf(spec, skinC, seed), P2 = { ...faceP, mk: MK2, lip: lipOf(MK2), shadow: MK2.lidC, shadow0: MK2.base.lidC };
        if (draft) { faceSurf = faceSurf || faceSurface(256); const D = faceTexture(P2, faceSurf); mats.face.map = mats.face.emissiveMap = D.tex; mats.face.roughnessMap = mats.face.aoMap = D.rough; return; }
        curMk = spec; const E2 = faceTexture(P2);
        mats.face.map = mats.face.emissiveMap = E2.tex; mats.face.roughnessMap = mats.face.aoMap = E2.rough; if (!mats.face.normalMap !== !E2.nrm) mats.face.needsUpdate = true; mats.face.normalMap = E2.nrm || null; faceRelease(faceTex); faceTex = E2;
      };
    }
  } else {
    // (a crowd's face: eyes, brows and a mouth of their own)
    const white = [], iris = [], feat = [], mouth = [], P = (nz, ny, d = 0) => { const nx = Math.sqrt(Math.max(0, 1 - nz * nz - ny * ny)), [x, y, z] = HSf(nx, ny, nz); return V(hc.x + x * R0 + d, hc.y + y * R0, hc.z + z * R0); };
    for (const s of [-1, 1]) {
      const e = P(s * FACE.eyeZ, FACE.eyeY, -0.004), sc = new THREE.SphereGeometry(0.0125, n(14), n(10, 2)); sc.scale(0.7, 0.8, 1); sc.translate(e.x, e.y, e.z); white.push(sc);
      const ir = new THREE.SphereGeometry(0.0062, n(12), n(8, 2)); ir.scale(0.5, 1, 1); ir.translate(e.x + 0.0085, e.y, e.z); iris.push(ir);
      feat.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([P(s * 0.17, FACE.browY - 0.02, 0.002), P(s * 0.36, FACE.browY + 0.02, 0.002), P(s * 0.56, FACE.browY - 0.03, 0.001)]), n(8, 2), 0.0034, n(5), false));
    }
    mouth.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([P(-0.22, FACE.mouthY + 0.01, 0.001), P(0, FACE.mouthY - 0.01, 0.002), P(0.22, FACE.mouthY + 0.01, 0.001)]), n(8, 2), 0.0021, n(5), false));
    mats.feat = new THREE.MeshStandardMaterial({ color: hairC, roughness: 0.85 });
    mats.white = new THREE.MeshStandardMaterial({ color: '#f2efe9', roughness: 0.35 });
    mats.iris = new THREE.MeshStandardMaterial({ color: ['#3b2a1e', '#4a6b8a', '#2a1c14', '#5a6e4a'][seed % 4], roughness: 0.25 });
    mats.lip = new THREE.MeshStandardMaterial({ color: skinC.clone().multiplyScalar(0.62), roughness: 0.6 });
    head.add(M([face, ...ears], mats.skin), M(feat, mats.feat), M(white, mats.white), M(iris, mats.iris), M(mouth, mats.lip));
  }
  head.add(M([hair, ...hairExtra], mats.hair));
  // (a straw sun hat (acc 'sunhat'): wide-brimmed, its crown over her hair as she wears it - none over hair pinned up high
  // or too full for one - world/Swimwear.js)
  if (ACC.has('sunhat') && !o.cap && !o.crewHelmet) {
    const hp = [hair, ...hairExtra].filter((g) => g?.attributes?.position).map((g) => g.attributes.position.array), all = new Float32Array(hp.reduce((s, a) => s + a.length, 0)); let off = 0; for (const a of hp) { all.set(a, off); off += a.length; }
    const hat = SW.sunHat(hc, all, SWH); if (hat) { mats.straw = mats.straw || fabricOn(pplMat('cloth', '#c9ad78', 0.86), { weave: 'crinkle' }); head.add(M([hat], mats.straw)); }
  }
  if (band2) head.add(M([band2], mats.accent));
  if (beard) {
    // (a beard's, a moustache's colour in its vertices - the hair's, melting into the skin's at its edges: its material white, matt)
    mats.beard = ST.fh === 'stubble' ? pplMat('cloth', skinC.clone().lerp(hairC, 0.24).multiplyScalar(0.9), 0.95) : pplMat('cloth', hairC.clone().lerp(skinC, 0.15), 0.88);   // (its colour bC: the vertices carry multipliers of it)
    head.add(M([beard], mats.beard));
  }
  // (sunglasses: worn, or pushed up on the head)
  const headAcc = [];
  if (ACC.has('shades') || ACC.has('shadesUp')) {
    const up = !ACC.has('shades'), gl = [], at = (nz, ny, d) => { const nx = Math.sqrt(Math.max(0, 1 - nz * nz - ny * ny)), [x, y, z] = HSf(nx, ny, nz), k = R0 * (1 + (up ? capOut(nx, ny, nz) : 0)); return V(hc.x + x * k + d, hc.y + y * k, hc.z + z * k); };
    for (const s of [-1, 1]) { const c = at(s * FACE.eyeZ, FACE.eyeY + 0.01, 0.012), l = new THREE.SphereGeometry(0.021, n(12), n(6, 2)); l.scale(0.28, 0.8, 1); l.translate(c.x, c.y, c.z); gl.push(tint(l, accCol('#1a1716'))); gl.push(tint(limbAlong([at(s * 0.62, FACE.eyeY + 0.03, 0.008), at(s * 0.9, FACE.eyeY + 0.04, 0.004), at(s * 0.99, FACE.eyeY + 0.03, -0.012)], () => 0.0022, { k: 6, m: 5 }), accCol('#2a2420'))); }
    gl.push(tint(limbAlong([at(-0.24, FACE.eyeY + 0.04, 0.014), at(0, FACE.eyeY + 0.03, 0.017), at(0.24, FACE.eyeY + 0.04, 0.014)], () => 0.002, { k: 6, m: 5 }), accCol('#2a2420')));
    // (pushed up: over the hair above the forehead, turned back with it)
    if (up) { const pv = hc.clone(), m4 = new THREE.Matrix4().makeTranslation(pv.x, pv.y, pv.z).multiply(new THREE.Matrix4().makeRotationZ(0.62)).multiply(new THREE.Matrix4().makeTranslation(-pv.x, -pv.y, -pv.z)); for (const g of gl) g.applyMatrix4(m4); }
    headAcc.push(...gl);
  }
  // (earrings: a stud at each lobe and a drop beneath it, where the hair shows them - in metal, with a high ponytail's cuff)
  const headMetal = cuff ? [cuff] : [];
  // (or as she wants them, jewel.earrings: 'stud' alone, 'hoop' - a fine hoop through the lobe - or 'long': a stud, a fine
  // bar hanging from it and a teardrop at its end)
  const ear = ['stud', 'hoop', 'long'].includes(JW.earrings) ? JW.earrings : 'drop';
  if (ACC.has('earrings') && !DOWN) for (const s of [-1, 1]) {
    const z = hc.z + s * (0.08 * fWid + 0.0035), lx = hc.x - 0.014 + 0.8 * eLh * Math.sin(eTilt), ly = eCy - 0.8 * eLh * Math.cos(eTilt), st = new THREE.SphereGeometry(0.0036, n(8, 4), n(6, 3));
    if (ear === 'hoop') { const hp = new THREE.TorusGeometry(0.011, 0.0013, n(4, 3), n(16, 10)); hp.translate(lx, ly - 0.0105, z + s * 0.0012); headMetal.push(hp); continue; }
    st.translate(lx, ly, z); headMetal.push(st); if (ear === 'stud') continue;
    if (ear === 'long') { const bar = new THREE.CylinderGeometry(0.0009, 0.0009, 0.03, n(6, 4)), td = new THREE.SphereGeometry(0.0046, n(8, 4), n(6, 3)); bar.translate(lx, ly - 0.017, z); td.scale(1, 1.9, 0.8); td.translate(lx, ly - 0.036, z); headMetal.push(bar, td); continue; }
    const dr = new THREE.SphereGeometry(0.0052, n(8, 4), n(6, 3)); dr.scale(1, 2.1, 0.8); dr.translate(lx, ly - 0.016, z); headMetal.push(dr);
  }
  if (headAcc.length) head.add(M(headAcc, mats.acc));
  if (headMetal.length) head.add(M(headMetal, metalM()));
  }
  if (o.cap && !o.crewHelmet) {
    // a team cap: the crown over the hair, a curved peak to the front
    const crownG = new THREE.SphereGeometry(0.117, n(28), n(12, 2), 0, Math.PI * 2, 0, Math.PI * 0.5); crownG.scale(1, 0.82, 0.95); crownG.translate(hc.x - 0.008, hc.y + 0.05, hc.z);
    const peak = new THREE.CylinderGeometry(0.115, 0.115, 0.006, n(28), 1, false, Math.PI * 0.5 - 1.15, 2.3); peak.scale(1.15, 1, 1.02);
    const pp = peak.attributes.position; for (let i = 0; i < pp.count; i++) { const zz = pp.getZ(i); pp.setY(i, pp.getY(i) - 1.6 * zz * zz); }   // (curved down at the sides)
    peak.computeVertexNormals(); peak.rotateZ(-0.12); peak.translate(hc.x + 0.03, hc.y + 0.066, hc.z);
    head.add(M([crownG], mats.team), M([peak], mats.accent));
  }
  body.add(head);
  if (lockBody.length) {
    const sm = new THREE.SkinnedMesh(mergeParts(lockBody, ['skinIndex', 'skinWeight']), mats.hair), bB = new THREE.Bone(), bH = new THREE.Bone();
    sm.castShadow = false; body.add(sm, bB); head.add(bH); skel.push([sm, [bB, bH]]);
  }
  return done(head, head.rotation.z);
}

/** a reporter's microphone with the broadcaster's flag (its name on the sides), its head at the origin, pointing along +x */
export function makeMic(flag = '#c8102e', label = 'F1 NEWS', ink = '#ffffff') {
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.95 }));
  const h = new THREE.CylinderGeometry(0.016, 0.013, 0.26, 10); h.rotateZ(Math.PI / 2); h.translate(-0.16, 0, 0);
  const handle = new THREE.Mesh(h, new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.4, metalness: 0.4 }));
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d');
  x.fillStyle = flag; x.fillRect(0, 0, 128, 128); x.fillStyle = ink; x.textAlign = 'center'; x.textBaseline = 'middle';
  const words = label.split(' '); x.font = `900 ${words.length > 1 ? 34 : 44}px "Segoe UI", Arial, sans-serif`;
  words.forEach((w, i) => x.fillText(w, 64, 64 + (i - (words.length - 1) / 2) * 38));
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const f = new THREE.BoxGeometry(0.058, 0.058, 0.058); f.translate(-0.07, 0, 0);
  const cube = new THREE.Mesh(f, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 }));
  g.add(head, handle, cube);
  g.userData.dispose = () => { tex.dispose(); };
  return g;
}
/** a phone held up to record, screen toward the holder */
export function makePhone() {
  const g = new THREE.BoxGeometry(0.008, 0.15, 0.072);
  return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: '#15161a', roughness: 0.3, metalness: 0.5 }));
}
/** a journalist's arm reaching in from below: from the shoulder (out of shot) to the hand (at the hand point), sleeve and hand */
export function makeArm(shoulder, hand, sleeve = '#2b2e35', skin = '#e3b994') {
  const grp = new THREE.Group();
  const s = new THREE.Mesh(seg(shoulder, hand, 0.034), new THREE.MeshStandardMaterial({ color: sleeve, roughness: 0.85 }));
  const hg = new THREE.SphereGeometry(0.04, 10, 8); hg.scale(1.1, 0.85, 0.75); hg.translate(hand.x, hand.y, hand.z);
  grp.add(s, new THREE.Mesh(hg, new THREE.MeshStandardMaterial({ color: skin, roughness: 0.65 })));
  return grp;
}

// ---- your own arms in a scuffle, from your own eyes (ui/Brawl.js) ---------------------------------------------------
/**
 * The arm you shove with, as you see it: the overalls' sleeve coming up from below the frame (the bend of the elbow just
 * out of sight) to its knitted cuff, the bare wrist, and an open hand turned back at the wrist - the palm flat toward
 * whoever is in front of you, the fingers together and pointing up, the thumb along the inside - so what you see is its
 * back: the knuckles, the nails. In the camera's own space (-z ahead, +y up, +x right): the palm about 0.62 m in front
 * of the eye, a little below it and to the right (left: mirrored, to the left). No part of it ever comes nearer the eye
 * than 0.33 m (the camera's near plane is at 0.3 m). set(t): 0 drawn back .. 1 pushed 0.15 m further out (the group
 * moves, nothing is rebuilt) -> { group, set(t), dispose() }
 */
export function shoveArm(sleeve = '#2b2e35', skin = '#e3b994', left = false) {
  const s = left ? -1 : 1, P = (x, y, z) => V(x * s, y, z), D = (x, y, z) => P(x, y, z).normalize(), sub = (a, b) => new THREE.Vector3().subVectors(a, b);
  // (the elbow and the wrist, the forearm's line between them; the hand's own axes - pn the way the palm faces, fu the
  // way the fingers point, ac across the back of it toward the little finger)
  const E = P(0.2, -0.3, -0.396), W = P(0.108, -0.172, -0.612), d = sub(W, E).normalize();
  const pn = D(-0.12, -0.1, -1), fu = P(-0.1, 1, 0); fu.addScaledVector(pn, -fu.dot(pn)).normalize();
  const ac = new THREE.Vector3().crossVectors(pn, fu).multiplyScalar(s).normalize();
  /** sum(v, k, w, j, ...) -> v k + w j + ...; at(p, v, k, ...) -> p + v k + ... */
  const sum = (...t) => { const p = new THREE.Vector3(); for (let i = 0; i < t.length; i += 2) p.addScaledVector(t[i], t[i + 1]); return p; };
  const at = (p, ...t) => sum(...t).add(p);
  /**
   * a closed tube along pts: radius rad(t) (t 0..1 along it), its section squashed by sq toward ref, k rings along it
   * and m round, both ends domed (cap: how far a dome reaches, in radii), wob(a, t) rippling it -> geometry
   */
  const tube = (pts, rad, k, m, ref, sq = 1, cap = 1, wob = null) => {
    const cv = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), F = [];
    for (let i = 0; i <= k; i++) { const t = i / k, c = cv.getPointAt(t), T = cv.getTangentAt(t), e2 = ref.clone().addScaledVector(T, -ref.dot(T)).normalize(); F.push({ t, c, T, e1: new THREE.Vector3().crossVectors(e2, T), e2 }); }
    const ring = (f, rr, h = 0) => ringOf(f.c.clone().addScaledVector(f.T, h), f.e1, f.e2, rr, rr * sq, m, wob ? (a) => wob(a, f.t) : null);
    const dome = (f, sg) => { const r0 = rad(f.t); return [0, 0.42, 0.72, 0.92].map((sv) => sv ? ring(f, r0 * sv, sg * r0 * cap * Math.sqrt(1 - sv * sv)) : Array(m).fill(f.c.clone().addScaledVector(f.T, sg * r0 * cap))); };
    return loft([...dome(F[0], -1), ...F.map((f) => ring(f, rad(f.t))), ...dome(F[k], 1).reverse()]);
  };
  /** a little ellipsoid (half-sizes hx across, hy along y, hz) set on the axes x, y (made square to each other) at c -> geometry */
  const pad = (c, x, y, hx, hy, hz, w = 10, h = 8) => {
    const Y = y.clone().normalize(), X = x.clone().addScaledVector(Y, -x.dot(Y)).normalize(), Z = new THREE.Vector3().crossVectors(X, Y);
    const g = new THREE.SphereGeometry(1, w, h); g.scale(hx, hy, hz); g.applyMatrix4(new THREE.Matrix4().makeBasis(X, Y, Z)); g.translate(c.x, c.y, c.z); return g;
  };
  const sleeveG = [], cuffG = [], skinG = [], nailG = [];
  // the sleeve: from below the frame (the upper arm going down out of sight) round the elbow and along the forearm to
  // its hem over the cuff, a few soft folds at the crook of the elbow
  const U = P(0.236, -0.6, -0.404), U1 = P(0.222, -0.45, -0.399), F1 = at(E, d, 0.08), C0 = at(W, d, -0.062);
  const ls = [U.distanceTo(U1), U1.distanceTo(E), E.distanceTo(F1), F1.distanceTo(C0)], uE = (ls[0] + ls[1]) / (ls[0] + ls[1] + ls[2] + ls[3]);
  const sRad = (t) => t < uE ? 0.051 - 0.002 * ss3(uE - 0.12, uE, t) : 0.049 - 0.012 * ss3(uE + 0.1 * (1 - uE), 1, t);
  const fold = (a, t) => { const w = Math.exp(-(((t - uE) / 0.09) ** 2)); return 1 + w * (0.035 * Math.sin(3 * a + 1.3) + 0.018 * Math.sin(7 * a + 0.4)) + 0.01 * Math.sin(4 * a + 9 * t); };
  sleeveG.push(tube([U, U1, E, F1, C0], sRad, 26, 30, P(1, 0, 0), 0.94, 0.9, fold));
  // the knitted cuff, gathered round the wrist (its back inside the sleeve; its front a rolled edge the wrist comes out of)
  cuffG.push(tube([at(W, d, -0.076), at(W, d, -0.03)], (t) => 0.0345 - 0.0055 * ss3(0.55, 1, t), 5, 30, pn, 0.9, 0.32));
  // the wrist, out of the cuff and turned up into the hand
  skinG.push(tube([at(W, d, -0.05), at(W, d, -0.012), at(W, fu, 0.006)], (t) => 0.0262 + 0.0025 * t, 6, 24, pn, 0.78, 0.6));
  // the hand: wider and flatter toward the knuckles, its back gently arched with the tendons' ridges and the knuckles
  // standing out along its top, the knuckle line slanting down to the little finger (x across it: + toward the little
  // finger), its top rounded over into the fingers
  const FX = [-0.0285, -0.0095, 0.0095, 0.0285], PR = [], KP = 12, MP = 32, slant = (x, f) => -0.18 * x * ss3(0.55, 1, f);
  const knuckles = (x) => FX.reduce((q, fx) => q + Math.exp(-(((x - fx) / 0.0075) ** 2)), 0);
  for (let k = 0; k <= KP + 2; k++) {
    const f = Math.min(1, k / KP), e = k - KP, sh = e <= 0 ? 1 : e === 1 ? 0.84 : 0.55, a = (0.027 + 0.0125 * ss3(0, 0.75, f)) * (e <= 0 ? 1 : e === 1 ? 0.94 : 0.8), bB = (0.0185 - 0.0065 * f) * sh, bP = (0.017 - 0.005 * f) * sh;
    const c = at(W, fu, 0.006 + 0.09 * f + (e > 0 ? [0, 0.006, 0.0105][e] : 0));
    PR.push(Array.from({ length: MP }, (_, j) => {
      const th = j / MP * Math.PI * 2, cx = Math.cos(th), sy = Math.sin(th), x = a * Math.sign(cx) * Math.abs(cx) ** 0.78;
      const back = bB * (1 + 0.05 * Math.cos(x / 0.0395 * 4 * Math.PI) * ss3(0.3, 0.85, f)) + 0.004 * knuckles(x) * ss3(0.78, 1, f) * sh;
      const y = Math.sign(sy) * Math.abs(sy) ** 0.85 * (sy > 0 ? bP : back);
      // (its top corners rounded off, down into the sides)
      return at(c, ac, x, pn, y, fu, slant(x, f) - 0.016 * Math.abs(x / 0.0395) ** 3 * ss3(0.7, 1, f));
    }));
  }
  PR.unshift(Array(MP).fill(at(W, fu, -0.004))); PR.push(Array(MP).fill(at(W, fu, 0.1075)));
  skinG.push(loft(PR));
  // the fingers, together: from inside the top of the hand, straight but for a slight curl, tapering, a little fuller
  // at the middle joint, each with its nail (index, middle, ring, little)
  const FL = [0.072, 0.08, 0.075, 0.059], FR = [0.0099, 0.0103, 0.0097, 0.0087], SPL = [-0.018, -0.004, 0.01, 0.03], UP2 = [0, 0.002, 0, -0.002];
  FX.forEach((x, i) => {
    const B = at(W, fu, 0.094 + slant(x, 1) + UP2[i], ac, x, pn, 0.001), f0 = at(fu, ac, SPL[i], pn, 0.04).normalize(), f1 = at(f0, pn, 0.12).normalize(), L = FL[i], R = FR[i];
    const p1 = at(B, f0, 0.47 * L), p2 = at(p1, f1, 0.53 * L);
    skinG.push(tube([at(B, f0, -0.016), p1, p2], (t) => R * (1 - 0.16 * t + 0.05 * Math.exp(-(((t - 0.52) / 0.07) ** 2))), 9, 14, pn, 0.82, 1));
    const rt = R * 0.84; nailG.push(pad(at(p2, f1, -0.0098, pn, -(rt * 0.82 - 0.0007)), ac, f1, rt * 0.66, 0.0062, 0.0012));
  });
  // the thumb: from the heel of the hand on the inside, up along the index finger's side, tucked a little behind the
  // hand toward the palm's side, its nail on its back
  const t1 = sum(fu, 0.72, ac, -0.42, pn, 0.5).normalize(), t2 = sum(fu, 0.9, ac, -0.16, pn, 0.36).normalize(), t3 = sum(fu, 0.95, ac, -0.05, pn, 0.28).normalize();
  const T0 = at(W, fu, 0.018, ac, -0.019, pn, 0.007), T1 = at(T0, t1, 0.04), T2 = at(T1, t2, 0.032), T3 = at(T2, t3, 0.026);
  skinG.push(tube([at(T0, t1, -0.01), T1, T2, T3], (t) => 0.0158 - 0.006 * ss3(0, 0.45, t), 10, 14, pn, 0.88, 1));
  const dorsal = sum(pn, -0.7, ac, -0.7).normalize(); dorsal.addScaledVector(t3, -dorsal.dot(t3)).normalize();
  nailG.push(pad(at(T3, t3, -0.0088, dorsal, 0.0098 * 0.9 - 0.0007), new THREE.Vector3().crossVectors(t3, dorsal), t3, 0.0064, 0.0066, 0.0012));
  // (never nearer the eye than 0.33 m, whatever the curves did: pushed back if any of it is)
  let zMax = -Infinity; for (const g of [...sleeveG, ...cuffG, ...skinG, ...nailG]) { const A = g.attributes.position.array; for (let i = 2; i < A.length; i += 3) zMax = Math.max(zMax, A[i]); }
  if (zMax > -0.335) for (const g of [...sleeveG, ...cuffG, ...skinG, ...nailG]) g.translate(0, 0, -0.335 - zMax);
  const sl = new THREE.Color(sleeve), sk = new THREE.Color(skin), group = new THREE.Group(); group.name = left ? 'shove-arm-L' : 'shove-arm-R';
  const mats = [
    new THREE.MeshStandardMaterial({ color: sl, roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ color: sl.clone().multiplyScalar(0.42), roughness: 0.95 }),
    new THREE.MeshStandardMaterial({ color: sk, roughness: 0.58 }),
    new THREE.MeshStandardMaterial({ color: sk.clone().lerp(new THREE.Color('#e8c4bc'), 0.35), roughness: 0.42 }),
  ];
  [sleeveG, cuffG, skinG, nailG].forEach((gs, i) => { const m = new THREE.Mesh(mergeGeometries(gs.map((g) => g.index ? g.toNonIndexed() : g)), mats[i]); m.castShadow = false; group.add(m); });
  const set = (t) => { const k = Math.max(0, Math.min(1, +t || 0)); group.position.set(-0.012 * s * k, 0, -0.15 * k); };
  set(0);
  return { group, set, dispose() { group.traverse((m) => { if (m.isMesh) m.geometry.dispose(); }); for (const m of mats) m.dispose(); } };
}

/**
 * A racing helmet, front toward +x: the shell in the driver's colour, the dark visor, a stripe in the team's colour,
 * the number on the side, a small spoiler at the back. o.driver: an F1 driver's own design painted on the shell
 * (world/HelmetDesigns.js) and their visor's tint; o.mono: in greys; o.blood: see helmetBlood.
 */
export function makeHelmet(color = '#ffffff', accent = '#777777', number = '', o = {}) {
  const g = new THREE.Group(), R = 0.15, SX = 1.12, SZ = 0.92;
  // the shell: a little longer than it is wide, open at the neck, the lower front swept down into the chin guard
  const shell = new THREE.SphereGeometry(R, 72, 48, 0, Math.PI * 2, 0, Math.PI * 0.78);
  const p = shell.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); if (x < -0.04 && y < 0) p.setY(i, y * (1 + Math.min(0.35, (-x - 0.04) * 4))); }   // (the chin guard: front is -x here, turned below)
  shell.computeVertexNormals(); shell.scale(SX, 1, SZ); shell.rotateY(Math.PI);   // (front to +x)
  const D = o.driver ? helmetDesign(o.driver) : null, map = D ? helmetTexture(o.driver, { mono: !!o.mono }) : null;
  g.add(new THREE.Mesh(shell, new THREE.MeshStandardMaterial(map ? { map, roughness: 0.18, metalness: 0.12 } : { color, roughness: 0.2, metalness: 0.15 })));
  // the visor: a wide, curved, dark glossy band across the front (an iridium tint on a driver's own)
  const visor = new THREE.SphereGeometry(R * 1.012, 64, 16, Math.PI - 1.1, 2.2, 1.0, 0.5); visor.scale(SX, 1, SZ);
  const vt = D && !o.mono ? new THREE.Color('#08090c').lerp(new THREE.Color(D.visor), 0.55) : new THREE.Color('#08090c');
  g.add(new THREE.Mesh(visor, new THREE.MeshStandardMaterial({ color: vt, roughness: 0.04, metalness: 0.75 })));
  // a stripe round the crown in the team's colour, sitting on the shell; the lower edge
  const am = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.3 });
  // (bands painted on the shell: a sliver of a sphere just outside it, between two heights)
  const ring = (y, w, mat) => { const th = Math.acos(Math.max(-1, Math.min(1, y / R))); const bg = new THREE.SphereGeometry(R * 1.006, 96, 2, 0, Math.PI * 2, th - w / 2, w); bg.scale(SX, 1, SZ); g.add(new THREE.Mesh(bg, mat)); };
  if (!D) { ring(0.08, 0.09, am); ring(0.105, 0.03, am); }   // (a driver's own design paints its own)
  if (!D) ring(-0.1, 0.12, new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.6 }));   // (the trim: painted into a design)
  // the spoiler on top at the back
  const sp = new THREE.BoxGeometry(0.06, 0.01, 0.12); sp.rotateZ(-0.25); sp.translate(-0.13, 0.105, 0); g.add(new THREE.Mesh(sp, am));
  // the number, on the side facing the camera
  if (number !== '' && number != null) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d');
    x.fillStyle = accent; x.font = 'italic 900 84px "Segoe UI", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(number), 64, 68);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.06), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.3 }));
    pl.position.set(-0.045, 0.01, R * SZ + 0.002); g.add(pl);
  }
  if (o.blood != null) g.add(helmetBlood(R, SX, SZ, o.blood));
  return g;
}

/** a seeded random stream (the same name, the same pattern) */
function seeded(seed) {
  let h = 2166136261; for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}
/**
 * Blood on a helmet's shell: a wide smear at the brow above the visor, runs down the side toward the camera - some
 * merging, all the way to the bottom edge where it gathers - wet and glossy. Painted on a sliver of a sphere just
 * outside the shell; seed (a name) fixes the pattern.
 */
function helmetBlood(R, SX, SZ, seed) {
  const rnd = seeded(seed);
  const W = 512, H = 512, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff'; x.strokeStyle = '#fff'; x.lineCap = 'round';
  // (u runs round from the side (+z) to the front (+x); v from the crown down to the shell's lower edge)
  const u0 = 0.3 + rnd() * 0.08, v0 = 0.22 + rnd() * 0.04;
  x.filter = 'blur(2px)';
  for (let i = 0; i < 16; i++) { x.beginPath(); x.ellipse(W * (u0 + (rnd() - 0.5) * 0.26), H * (v0 + (rnd() - 0.5) * 0.09), 14 + rnd() * 26, 8 + rnd() * 14, rnd() * 3, 0, Math.PI * 2); x.fill(); }
  x.filter = 'blur(1px)';
  for (let i = 0; i < 3; i++) { x.beginPath(); x.ellipse(W * (u0 + (rnd() - 0.5) * 0.08), H * (v0 + (rnd() - 0.5) * 0.03), 18 + rnd() * 10, 10 + rnd() * 6, rnd(), 0, Math.PI * 2); x.fill(); }   // (the heart of it, thick)
  // the runs: from the smear down the shell, thinning, the long ones reaching the bottom edge
  const n = 7 + Math.floor(rnd() * 4), ends = [];
  for (let i = 0; i < n; i++) {
    let u = W * (u0 + (rnd() - 0.5) * 0.28), v = H * (v0 + 0.03), w = 6 + rnd() * 7; const len = H * (i < 4 ? 0.7 + rnd() * 0.06 : 0.2 + rnd() * 0.45);
    x.beginPath(); x.moveTo(u, v);
    for (let s = 0; s < len; s += 5) { u += (rnd() - 0.5) * 2.4; v += 5; x.lineWidth = w * (1 - (s / len) * 0.4); x.lineTo(u, v); x.stroke(); x.beginPath(); x.moveTo(u, v); }
    x.beginPath(); x.ellipse(u, v + 2, w * 0.75, w, 0, 0, Math.PI * 2); x.fill(); ends.push([u, v]);
  }
  // where the long runs reach the lower edge, it gathers
  x.filter = 'blur(3px)';
  for (const [u, v] of ends) if (v > H * 0.8) { x.beginPath(); x.ellipse(u, H * 0.97, 22 + rnd() * 20, 14, 0, 0, Math.PI * 2); x.fill(); }
  const tex = new THREE.CanvasTexture(cv);
  const geo = new THREE.SphereGeometry(R * 1.018, 64, 48, Math.PI * 0.42, Math.PI * 0.62, Math.PI * 0.1, Math.PI * 0.69); geo.scale(SX, 1, SZ);
  const m = new THREE.MeshPhysicalMaterial({ color: '#4a0306', roughness: 0.22, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.22, alphaMap: tex, transparent: true, bumpMap: tex, bumpScale: 1.4, depthWrite: false });
  return new THREE.Mesh(geo, m);
}
/**
 * The pool beneath a helmet left where it was set down: blood that has run off the shell and spread across the floor
 * toward the camera, a few drops beyond it - dark, still, glossy under the light. A flat mesh for the floor at y.
 */
export function bloodPool(seed, y = 0) {
  const rnd = seeded(seed + '|pool');
  const S = 512, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, S, S); x.fillStyle = '#fff';
  // (the canvas's +x points toward the camera: the pool starts under the helmet at the left and spreads right)
  x.filter = 'blur(4px)';
  for (let i = 0; i < 26; i++) { const k = rnd(); x.beginPath(); x.ellipse(S * (0.24 + k * 0.42), S * (0.5 + (rnd() - 0.5) * (0.12 + k * 0.22)), S * (0.05 + rnd() * 0.08) * (1.1 - k * 0.4), S * (0.04 + rnd() * 0.06), rnd() * 3, 0, Math.PI * 2); x.fill(); }
  x.filter = 'blur(2px)';
  for (let i = 0; i < 4; i++) { x.beginPath(); let px = S * 0.6, py = S * (0.45 + rnd() * 0.1); x.moveTo(px, py); x.lineWidth = 6 + rnd() * 8; x.strokeStyle = '#fff'; x.lineCap = 'round'; for (let s = 0; s < 8; s++) { px += S * 0.025; py += (rnd() - 0.5) * S * 0.03; x.lineTo(px, py); } x.stroke(); }   // (fingers of it, still creeping)
  for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(S * (0.72 + rnd() * 0.2), S * (0.3 + rnd() * 0.4), 2 + rnd() * 5, 0, Math.PI * 2); x.fill(); }   // (drops beyond)
  const tex = new THREE.CanvasTexture(cv);
  const g = new THREE.PlaneGeometry(0.62, 0.62); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: '#3a0305', roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, alphaMap: tex, transparent: true, bumpMap: tex, bumpScale: 0.6, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.position.y = y; m.renderOrder = 3;
  return m;
}
