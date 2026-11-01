// The people in a crowd seen up close as themselves: everyone near enough to see properly - the nearest few dozen, within
// a few metres of the camera - drawn as world/People.js's full figure (makePerson: their own face painted on, their
// hair, the clothes cut and lit as a star's are); everyone further off the cheap crowd body they always were (a party's
// instanced templates, world/PartyCrowd.js; the grid's, world/CrowdLife.js - the caller's, 'external'), or this module's
// own instanced tube bodies ('own'), coloured as each person dresses. As the camera moves, whoever comes near is built
// and swapped in, whoever falls back is swapped out (kept built a while, for a turn of the head back - then given back).
// A full figure is ~25-30 thousand triangles in eight or nine meshes and some 40-170 ms of work: never done in one go -
// world/People.js makePersonSteps builds it a stage at a time, a few milliseconds of it a frame (budget), one at a time,
// and the cheap body stays shown until it is done, so nothing stalls and nobody is ever missing. Ranked four times a
// second: by distance, those behind the camera counted further off (the view's own are built first), with a margin
// either way so nobody flickers between the two at the line.
// Alive on both levels: dancing on the music's beat (the whole figure swaying side to side from the feet, the shoulders
// turning, the knees giving on every beat, a nod - on the same beat and phase as the instanced crowd's shader, so the two
// move alike), idling (a slow shift of weight, the head looking about), turning their head to you when you come close.
// Everything is in the frame of the group the crowd is given (o.scene: a venue's group): x, z on the floor, y up; a
// person faces +x unturned (yaw: their rotation.y; facing (cos yaw, 0, -sin yaw)).
//
// ==== PUBLISHED API (npc2 foundations: agent A, 2026-11-01) - see scratchpad npc2/FOUNDATIONS_READY.md ===================
// new NpcCrowd(o)
//   o.scene    THREE.Object3D  the figures' group (.group) is added to it - their x/y/z/yaw are in its frame
//   o.people   [{ seed, opts (makePerson's options - e.g. career/Extras.js extraLook(...)), look (= opts), fem, x, y, z,
//              yaw, pose (opts.pose), anim ('dance' | 'idle' | 'talk' | 'still'), scale, data (yours), on (false: not
//              there now) }] - any of them may be added later (add)
//   o.near     m (default 8): within it someone may be drawn in full    o.maxHigh (default 20): at most this many at once
//   o.hyst     m (default 0.75): the margin either way at the line       o.keep (default 8): built figures kept hidden
//   o.budget   ms of building a frame (default 6; one stage at least)   o.far 'external' | 'own' (default: 'external' when
//              o.onLevel is given, else 'own') | 'none' (no far bodies: those not near are not drawn)
//   o.onLevel(P, high)   external far: P shown in full (true - hide your cheap body of them) or not (false - show it)
//   o.prep(person, P)    after a figure is built, before it is shown: your touches (a night's lift, a room's light)
//   o.beat()   -> beats (the music's own clock, a running count) - else its own at o.bpm (default 124)
//   o.look     false: heads never turn to the camera (default true)  o.keepKey  userData flag on what it adds ('hgKeep')
//   o.farMaterial   'own' far: a material for the instanced bodies (default world/Crowd.js crowdMaterial())
//   o.compile(object3d) -> Promise | undefined   a new figure's shaders compiled before it is first shown - use
//              compilerFor(renderer, camera, scene) (below: renderer.compileAsync's way, safe for a figure given back
//              meanwhile); also settable later as .compile
// .group                         THREE.Group of the figures (and the own far bodies)
// .people                        the person records P (below) - read them, change them through the methods
// .update(camera, dt)            every frame: camera a THREE.Camera (world) or { x, y, z, fx?, fz? } in the group's frame
// .pick(raycaster | { x, y } (NDC), camera?, filter?) -> P | null   the person under a ray (a capsule each), nearest
// .nearest(x, z, r = 1.6, filter?) -> P | null                      the nearest person within r of (x, z) in the frame
// .add(spec) -> P   .remove(P)   .move(P, x, z, yaw?, y?)   .setPose(P, pose)   .setAnim(P, anim)   .setOn(P, on)
// .figureOf(P) -> makePerson's person | null (shown in full now)
// .take(P, build = true) -> { person, opts } | null   the figure handed over (a stranger becoming a guest): out of the
//                                crowd for good, the caller's to place and dispose (built at once if it was not yet)
// .warm(n, camera?) -> Array<() => void>   steps building the n nearest now (behind a loading cover: one a frame)
// .stats() -> { people, high, built, building, queued, builds, buildMs, tris, calls }
// .dispose()
// P = { seed, opts, fem, x, y, z, yaw, pose, anim, scale, data, on, high (shown in full now), fig (the built person or
//       null), d (metres from the camera at the last ranking) }
// ===========================================================================================================================
import * as THREE from 'three';
import { makePersonSteps, faceCacheTrim } from './People.js';
import { templateOf, crowdMaterial } from './Crowd.js';

const TAU = Math.PI * 2;
const V0 = new THREE.Vector3(), V1 = new THREE.Vector3(), M0 = new THREE.Matrix4(), Q0 = new THREE.Quaternion(), S0 = new THREE.Vector3(), Y0 = new THREE.Vector3(0, 1, 0);
const RAY = new THREE.Ray(), RC = new THREE.Raycaster();
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// ---- what a kit shows at a distance (world/People.js OUTFITS): the far bodies' shape -----------------------------------
// hem (a skirt's: People.js HEMS), sep (the skirt in the accent colour), arms ('skin' bare, 'short' sleeves, 'long'),
// mid (a bare midriff), tr (trousers: their cut), jk (a jacket open over the top: the top beneath in the accent)
export const KIT_SHAPE = {
  cutoutmini: { hem: 'mini', arms: 'skin' }, sidecut: { hem: 'mini', arms: 'skin' }, keyhole: { hem: 'thigh', arms: 'long' },
  backless: { hem: 'mini', arms: 'long' }, diamond: { hem: 'midi', arms: 'skin' }, ribcut: { hem: 'midi', arms: 'long' }, hipcut: { hem: 'micro', arms: 'skin' },
  haltermicro: { hem: 'micro', arms: 'skin', glitz: 1 }, camiskirt: { hem: 'thigh', arms: 'skin', sep: 1 },
  corsettop: { arms: 'skin', tr: 'wide' }, corsetleather: { arms: 'skin', tr: 'leather' }, bandeauset: { hem: 'micro', arms: 'skin', mid: 1 },
  twistset: { hem: 'midi', arms: 'skin', mid: 1 }, tieset: { hem: 'mini', arms: 'skin', mid: 1 }, onecrop: { arms: 'skin', mid: 1, tr: 'jeans' },
  lowrise: { arms: 'short', mid: 1, tr: 'wide' }, cropjeans: { arms: 'skin', mid: 1, tr: 'jeans' }, blazerbra: { hem: 'micro', arms: 'long', mid: 1, jk: 1 },
  blazerbtn: { hem: 'mini', arms: 'long', jk: 1 },
  // (a sheer layer is left off in a crowd - the dress beneath is what shows: the mesh dress's bardot micro slip)
  meshdress: { hem: 'micro', arms: 'skin' }, lacemini: { hem: 'mini', arms: 'skin' }, slipmini: { hem: 'mini', arms: 'skin' },
  // (the lace (world/Lace.js): far off, the lined dress and its colour; sheer lace sleeves read as bare arms)
  lacebustier: { hem: 'mini', arms: 'skin' }, lacecorset: { arms: 'skin', tr: 'leather' }, lacecorsetwide: { arms: 'skin', tr: 'wide' }, lacebody: { arms: 'long', tr: 'wide', jk: 1 },
  laceset: { hem: 'mini', arms: 'skin', mid: 1 }, lacesleeve: { hem: 'mini', arms: 'skin' },
  bodycon: { hem: 'mini', arms: 'skin' }, sequin: { hem: 'mini', arms: 'skin', glitz: 1 }, bardot: { hem: 'short', arms: 'skin' },
  dress: { hem: 'knee', arms: 'short' }, jumpsuit: { arms: 'short', tr: 'wide' }, wrap: { hem: 'knee', arms: 'long' }, coord: { arms: 'short', tr: 'wide' },
  slip: { hem: 'midi', arms: 'skin' }, oneshoulder: { hem: 'short', arms: 'skin' }, halter: { hem: 'floor', arms: 'skin' }, gown: { hem: 'floor', arms: 'skin' }, slitgown: { hem: 'floor', arms: 'skin' },
  corset: { hem: 'midi', arms: 'skin' }, blazerdress: { hem: 'mini', arms: 'long', jk: 1 }, trench: { hem: 'knee', arms: 'long' }, knit: { hem: 'knee', arms: 'long' },
  // his (and anyone's off duty)
  silkshirt: { arms: 'long' }, knitpolo: { arms: 'short' }, teeblazer: { arms: 'long', jk: 1 }, leather: { arms: 'long', jk: 1 }, bomber: { arms: 'long', jk: 1 },
  pantsuit: { arms: 'long', jk: 1 }, blazer: { arms: 'long', jk: 1 }, casual: { arms: 'short', tr: 'jeans' }, sweater: { arms: 'long', tr: 'jeans' },
  polo: { arms: 'short' }, jacket: { arms: 'long' }, athleisure: { arms: 'long' },
};
// (a hem's height on a man's frame, for the far bodies' skirt cone - world/Crowd.js scales it with the body)
export const HEM_Y = { micro: 0.8, mini: 0.74, thigh: 0.69, short: 0.64, knee: 0.5, midi: 0.34, floor: 0.08 };
/** her hair styles that read as short (or up) from afar */
export const SHORT_HAIR_F = new Set(['bob', 'pixie', 'topknot', 'bun', 'highpony', 'curlybun', 'messybun']);
/** the far tube body's spec (world/Crowd.js bakeFarTemplate, club-shaped) for someone wearing makePerson options o; ht the neck's height (default 1.46) */
export function farSpecOf(o, ht = 1.46) {
  const K = KIT_SHAPE[o?.kit] || {}, fem = o?.figure === 'f', pose = o?.pose || 'talk', sit = /^sit/.test(pose);
  return { club: true, far: true, figure: fem ? 'f' : undefined, kit: 'club', pose, cap: !!o?.cap, prop: o?.prop === 'photo' ? 'photo' : undefined, skirt: sit || !K.hem ? 0 : HEM_Y[K.hem], skirtPart: K.sep ? 'accent' : undefined, arms: K.arms || 'long', mid: K.mid ? 'skin' : undefined, hair: fem ? (SHORT_HAIR_F.has(o?.style?.hs) ? 'short' : 'long') : undefined, ht: Math.round(ht / 0.04) * 0.04 };
}
/** the colours someone in makePerson options o wears, for an instanced body: [skin, top, legs, hair, accent, team] as sRGB strings */
export function coloursOf(o) {
  const K = KIT_SHAPE[o?.kit] || {}, skin = o?.skin || '#e3b994', top = o?.color || '#2b2e35', bare = o?.figure === 'f' && !!K.hem && !o?.legs;
  return [skin, top, bare ? skin : o?.legs || '#1b1b1f', o?.hair || '#2b1d14', o?.accent || top, top];
}

/**
 * NpcCrowd's o.compile for a renderer: a figure's materials compiled (renderer.compile) and waited for off the frame -
 * renderer.compileAsync's way, but a material given back meanwhile (a figure disposed before it was ever shown) counts as
 * done instead of failing the wait. camera, scene (the scene whose lights it is drawn under; a hosted venue's world's)
 * may be functions, read at each call -> (object3d) => Promise
 */
export function compilerFor(renderer, camera, scene = null) {
  return (o) => {
    const cam = typeof camera === 'function' ? camera() : camera, sc = typeof scene === 'function' ? scene() : scene;
    const mats = renderer.compile(o, cam, sc || null);
    return new Promise((res) => {
      const tick = () => {
        for (const m of mats) { let pr = null; try { pr = renderer.properties.get(m)?.currentProgram; } catch (_) { pr = null; } if (!pr || typeof pr.isReady !== 'function' || pr.isReady()) mats.delete(m); }
        if (!mats.size) res(o); else setTimeout(tick, 10);
      };
      tick();
    });
  };
}

const ATTR = ['iSkin', 'iTop', 'iLegs', 'iHair', 'iAcc', 'iTeam'];
const ANIMS = new Set(['dance', 'idle', 'talk', 'still']);

export class NpcCrowd {
  constructor(o = {}) {
    this.keepKey = o.keepKey || 'hgKeep';
    this.group = new THREE.Group(); this.group.name = 'npc-figures'; this.group.userData[this.keepKey] = true;
    if (o.scene) o.scene.add(this.group);
    this.near = o.near ?? 8; this.maxHigh = o.maxHigh ?? 20; this.hyst = o.hyst ?? 0.75; this.keepN = o.keep ?? 8; this.budget = o.budget ?? 6;
    this.far = o.far || (o.onLevel ? 'external' : 'own'); this.onLevel = o.onLevel || null; this.prep = o.prep || null;
    this.compile = typeof o.compile === 'function' ? o.compile : null;
    this.beatFn = typeof o.beat === 'function' ? o.beat : null; this.bpm = o.bpm || 124; this.looks = o.look !== false; this.farMat = o.farMaterial || null;
    this.people = []; this.gone = false; this.B = 0; this.t = 0;
    this._rankT = 0; this._cam = new THREE.Vector3(1e9, 1.6, 0); this._camR = new THREE.Vector3(1e9, 0, 0); this._fw = { x: 1, z: 0 }; this._inv = new THREE.Matrix4();
    this.job = null; this.jobP = null; this.queue = []; this.builds = 0; this.buildMs = 0; this.fails = 0; this._disposed = 0;
    this._farDirty = true; this._farRecs = new Map();
    for (const s of o.people || []) this.add(s);
  }

  // ---- the people ------------------------------------------------------------------------------------------------------
  add(s = {}) {
    const opts = { ...(s.opts || s.look || {}) }; if (s.pose) opts.pose = s.pose;
    const seed = s.seed ?? hash(JSON.stringify([opts.seed, s.x, s.z])), h = hash('npc|' + seed);
    const P = {
      seed, opts, fem: s.fem ?? opts.figure === 'f', x: +s.x || 0, y: +s.y || 0, z: +s.z || 0, yaw: +s.yaw || 0, pose: opts.pose || 'talk', anim: ANIMS.has(s.anim) ? s.anim : 'idle', scale: s.scale ?? 1, data: s.data ?? null, on: s.on !== false,
      high: false, fig: null, d: 1e9, key: 1e9, want: false, stale: false,
      // (their own way of moving: the phase against the beat - most on it, some on the off-beat - how hard, a nod, the shoulders' turn)
      ph: ((h & 7) === 0 ? Math.PI : 0) + (((h >>> 3) & 255) / 255 - 0.5) * 0.5, en: s.energy ?? 0.7 + ((h >>> 11) & 255) / 255 * 0.3, nod: 0.05 + ((h >>> 19) & 63) / 63 * 0.05, tw: 0.3 + ((h >>> 25) & 127) / 127 * 0.7,
      hy: 0, hz: 0, look: ((h >>> 13) & 1023) / 1023 * TAU,
    };
    this.people.push(P); this._farDirty = true; return P;
  }
  remove(P) {
    const i = this.people.indexOf(P); if (i < 0) return;
    this._lower(P); this.people.splice(i, 1);
    if (this.jobP === P) this._finishJob(true);
    this.queue = this.queue.filter((q) => q !== P);
    if (P.fig) { this._dispose(P.fig); P.fig = null; }
    this._farDirty = true;
  }
  move(P, x, z, yaw, y) { P.x = +x || 0; P.z = +z || 0; if (yaw != null) P.yaw = +yaw || 0; if (y != null) P.y = +y || 0; this._farMoved = true; }
  setAnim(P, anim) { if (ANIMS.has(anim)) P.anim = anim; }
  setOn(P, on) { on = !!on; if (P.on === on) return; P.on = on; if (!on) this._lower(P); this._farDirty = true; this._rankT = 0; }
  /** a new pose: the figure built again in it (the old one shown until the new is ready) */
  setPose(P, pose) {
    if (!pose || pose === P.pose) return; P.pose = pose; P.opts = { ...P.opts, pose }; this._farDirty = true;
    if (P.fig || this.jobP === P) P.stale = true;
  }
  figureOf(P) { return P?.high ? P.fig : null; }
  /** the figure handed over: out of the crowd for good (see the API) */
  take(P, build = true) {
    if (!P || !this.people.includes(P)) return null;
    if (this.jobP === P) this._finishJob(false);
    if (!P.fig && build) { const J = makePersonSteps(P.opts); try { while (!J.step(1e9)); P.fig = J.person; this._ready(P, false); } catch (e) { console.warn('NpcFigures: a figure could not be built', e); } }
    const fig = P.fig, opts = P.opts; P.fig = null;
    if (fig) { fig.group.parent?.remove(fig.group); fig.group.visible = true; fig.group.position.set(P.x, P.y, P.z); fig.group.rotation.set(0, P.yaw, 0); fig.group.scale.setScalar(P.scale); if (fig.head) fig.head.rotation.set(0, 0, fig.bow0 ?? fig.bow ?? 0); }
    this._lower(P); this.people.splice(this.people.indexOf(P), 1); this.queue = this.queue.filter((q) => q !== P); this._farDirty = true;
    return fig ? { person: fig, opts } : null;
  }

  // ---- the frame -------------------------------------------------------------------------------------------------------
  update(camera, dt = 1 / 60) {
    if (this.gone) return;
    dt = clamp(dt || 0, 0, 0.1); this.t += dt;
    this.B = this.beatFn ? +this.beatFn() || 0 : this.B + dt * this.bpm / 60;
    this._camera(camera);
    // (ranked four times a second, or at once when the camera jumps)
    this._rankT -= dt;
    if (this._rankT <= 0 || this._cam.distanceToSquared(this._camR) > 0.5) { this._rankT = 0.25; this._camR.copy(this._cam); this._rank(); }
    this._build(dt);
    for (const P of this.people) if (P.high && P.fig) this._pose(P.fig, P, false, dt);
    if (this.far === 'own') this._farUpdate();
  }
  _camera(c) {
    if (c?.isCamera) {
      this.group.updateWorldMatrix(true, false); this._inv.copy(this.group.matrixWorld).invert();
      c.getWorldPosition(V0); this._cam.copy(V0.applyMatrix4(this._inv));
      c.getWorldDirection(V1); V1.transformDirection(this._inv); const h = Math.hypot(V1.x, V1.z); if (h > 1e-3) { this._fw.x = V1.x / h; this._fw.z = V1.z / h; }
    } else if (c) {
      this._cam.set(+c.x || 0, +(c.y ?? 1.6) || 1.6, +c.z || 0);
      if (Number.isFinite(+c.fx) && Number.isFinite(+c.fz)) { const h = Math.hypot(c.fx, c.fz) || 1; this._fw.x = c.fx / h; this._fw.z = c.fz / h; }
    }
  }
  /** who is drawn in full: the nearest (behind the camera counted further), at most maxHigh, within near - a margin kept */
  _rank() {
    const cx = this._cam.x, cz = this._cam.z, F = this._fw, cand = [];
    for (const P of this.people) {
      const dx = P.x - cx, dz = P.z - cz, d = Math.hypot(dx, dz); P.d = d;
      const behind = d > 1.2 && (dx * F.x + dz * F.z) < 0.2 * d;
      P.key = d * (behind ? 1.8 : 1) - (P.high ? this.hyst : 0);
      if (P.on && P.key < this.near) cand.push(P);
    }
    cand.sort((a, b) => a.key - b.key);
    const want = new Set(cand.slice(0, this.maxHigh));
    for (const P of this.people) {
      P.want = want.has(P);
      if (P.want && P.fig && !P.high && !P.stale && P.ok !== false) this._raise(P);
      else if (!P.want && P.high) this._lower(P);
    }
    // (the queue: the wanted with no figure (or one in an old pose), nearest first)
    this.queue = [...want].filter((P) => (!P.fig || P.stale) && P !== this.jobP).sort((a, b) => a.key - b.key);
    // (the figures built and not wanted: the nearest few kept for a turn back, the rest given back)
    const idle = this.people.filter((P) => P.fig && !P.high && P !== this.jobP && P.ok !== false).sort((a, b) => a.key - b.key);
    for (const P of idle.slice(this.keepN)) { this._dispose(P.fig); P.fig = null; }
  }
  _raise(P) {
    if (P.high || !P.fig || P.ok === false) return; P.high = true; P.fig.group.visible = true; this._pose(P.fig, P, true);
    if (this.far === 'external') { try { this.onLevel?.(P, true); } catch (e) { console.warn('NpcFigures: onLevel', e); } } else this._farDirty = true;
  }
  _lower(P) {
    if (!P.high) return; P.high = false; if (P.fig) P.fig.group.visible = false;
    if (this.far === 'external') { try { this.onLevel?.(P, false); } catch (e) { console.warn('NpcFigures: onLevel', e); } } else this._farDirty = true;
  }
  /** a few milliseconds of building a frame: one figure at a time, stage by stage */
  _build(dt) {
    if (!this.job) {
      const P = this.queue.shift(); if (!P) return;
      this.jobP = P; P.stale = false;
      try { this.job = makePersonSteps(P.opts); } catch (e) { this.jobP = null; this.fails++; console.warn('NpcFigures: a figure could not be started', e); return; }
      this.job.t = 0;
    }
    // (a slow frame already: one stage only; else stages until the budget is spent)
    const t0 = performance.now();
    try { this.job.step(dt > 0.05 ? 0 : this.budget); } catch (e) { this.fails++; console.warn('NpcFigures: a figure could not be built', e); this.job = null; this.jobP = null; return; }
    this.job.t += performance.now() - t0;
    if (this.job.done) this._finishJob(false);
  }
  /** the figure being built: finished (drop: and given back at once) */
  _finishJob(drop) {
    const J = this.job, P = this.jobP; this.job = null; this.jobP = null; if (!J) return;
    if (!J.done && !J.failed) { try { while (!J.step(1e9)); } catch (e) { this.fails++; return; } }
    if (!J.person) return;
    this.builds++; this.buildMs += J.t || 0;
    if (drop || !P || !this.people.includes(P)) { this._dispose(J.person); return; }
    const old = P.fig, wasHigh = P.high; P.fig = J.person; this._ready(P);
    if (old) { old.group.parent?.remove(old.group); this._dispose(old); }
    if (wasHigh) { P.fig.group.visible = true; this._pose(P.fig, P, true); } else if (P.want && P.on) this._raise(P);
  }
  /** a new figure: the caller's touches, placed, hidden until raised */
  _ready(P, compile = true) {
    const p = P.fig; p.group.visible = false;
    p.group.traverse((m) => { if (m.isMesh) { m.frustumCulled = true; m.castShadow = false; m.receiveShadow = false; } });
    try { this.prep?.(p, P); } catch (e) { console.warn('NpcFigures: prep', e); }
    p.group.rotation.order = 'YXZ'; p.bow0 = p.head ? p.head.rotation.z : p.bow || 0;
    this.group.add(p.group); this._pose(p, P, true);
    // (its shaders compiled off the frame first where the renderer can (o.compile: renderer.compileAsync) - a look new
    // to the room, a sequin or a lace, would otherwise stall the frame it is first drawn in; the cheap body stays shown
    // until then, three seconds at most)
    if (!compile || typeof this.compile !== 'function') return;
    P.ok = false; let pr = null, k = false; const done = () => { if (k) return; k = true; if (P.fig !== p) return; P.ok = true; if (P.want && P.on && !P.high && !this.gone) this._raise(P); };
    p.group.visible = true; try { pr = this.compile(p.group); } catch (e) { pr = null; } p.group.visible = false;
    if (pr?.then) { pr.then(done, done); setTimeout(done, 3000); } else done();
  }
  _dispose(p) { try { p.group.parent?.remove(p.group); p.dispose(); } catch (e) { /* (gone already) */ } if (++this._disposed % 12 === 0) { try { faceCacheTrim(); } catch (_) { /* */ } } }
  /** a figure where its person stands, moving as they do: the dance on the beat, the idle's weight, the head */
  _pose(p, P, snap = false, dt = 0) {
    const g = p.group, B = this.B, t = this.t; let roll = 0, tw = 0, bob = 0, nod = 0;
    if (P.anim === 'dance') {
      const e = P.en, ph = Math.PI * B + P.ph;
      roll = 0.045 * e * Math.sin(ph); tw = 0.05 * e * P.tw * Math.cos(ph); bob = -0.018 * e * (0.5 + 0.5 * Math.cos(TAU * B + P.ph)); nod = -P.nod * (0.5 + 0.5 * Math.sin(2 * ph));
    } else if (P.anim === 'idle' || P.anim === 'talk') {
      roll = 0.01 * Math.sin(t * 0.7 + P.ph); tw = 0.02 * Math.sin(t * 0.31 + P.look);
      if (P.anim === 'talk') nod = -0.04 * Math.max(0, Math.sin(t * 2.3 + P.look));
    }
    g.position.set(P.x, P.y + bob * P.scale, P.z); g.rotation.set(roll, P.yaw + tw, 0); g.scale.setScalar(P.scale);
    const h = p.head; if (!h) return;
    // (the head: looking about, or at you when you are close and in front of them)
    let ty = P.anim === 'still' ? 0 : 0.35 * Math.sin(t * 0.23 + P.look) + 0.12 * Math.sin(t * 0.61 + P.look * 2), tz = 0;
    if (this.looks && P.anim !== 'still') {
      const dx = this._cam.x - P.x, dz = this._cam.z - P.z, d = Math.hypot(dx, dz), face = Math.atan2(-dz, dx), off = wrap(face - P.yaw - tw);
      if (d < 3.6 && Math.abs(off) < 1.9) { ty = clamp(off, -1.0, 1.0); tz = clamp(Math.atan2(this._cam.y - (P.y + 1.55 * P.scale), Math.max(0.4, d)), -0.35, 0.45) * 0.7; }
    }
    const k = snap ? 1 : Math.min(1, dt * 4); P.hy += (ty - P.hy) * k; P.hz += (tz - P.hz) * k;
    h.rotation.y = P.hy; h.rotation.z = (p.bow0 ?? 0) + P.hz + nod;
  }

  // ---- for the caller ---------------------------------------------------------------------------------------------------
  /** the person under a ray (a THREE.Raycaster in the world, or { x, y } NDC with the camera) -> P | null */
  pick(r, camera = null, filter = null) {
    if (!r) return null;
    if (!(r.isRaycaster || r.ray)) { if (!camera) return null; RC.setFromCamera(new THREE.Vector2(r.x, r.y), camera); r = RC; }
    this.group.updateWorldMatrix(true, false); this._inv.copy(this.group.matrixWorld).invert();
    RAY.copy(r.ray).applyMatrix4(this._inv);
    let best = null, bt = Infinity;
    for (const P of this.people) {
      if (!P.on || (filter && !filter(P))) continue;
      const t = capsule(RAY, P.x, P.y + 0.15 * P.scale, P.y + (P.fem ? 1.68 : 1.76) * P.scale, P.z, 0.26 * P.scale);
      if (t >= 0 && t < bt) { bt = t; best = P; }
    }
    return best;
  }
  /** the nearest person to (x, z) within r m (the frame's) -> P | null */
  nearest(x, z, r = 1.6, filter = null) {
    let best = null, bd = r * r;
    for (const P of this.people) { if (!P.on || (filter && !filter(P))) continue; const d = (P.x - x) ** 2 + (P.z - z) ** 2; if (d < bd) { bd = d; best = P; } }
    return best;
  }
  /** steps building the n nearest to the camera now (one a step: behind a loading cover) */
  warm(n = this.maxHigh, camera = null) {
    if (camera) this._camera(camera);
    this._rank();
    const list = this.people.filter((P) => P.want && !P.fig).sort((a, b) => a.key - b.key).slice(0, n);
    return list.map((P) => () => {
      if (this.gone || P.fig || !this.people.includes(P)) return;
      if (this.jobP === P) { this._finishJob(false); return; }
      const t0 = performance.now(), J = makePersonSteps(P.opts);
      try { while (!J.step(1e9)); } catch (e) { this.fails++; console.warn('NpcFigures: a figure could not be built', e); return; }
      this.builds++; this.buildMs += performance.now() - t0;
      P.fig = J.person; this._ready(P); if (P.want && P.on) this._raise(P);
      this.queue = this.queue.filter((q) => q !== P);
    });
  }
  stats() {
    let high = 0, built = 0, tris = 0, calls = 0;
    for (const P of this.people) {
      if (P.fig) built++;
      if (P.high && P.fig) { high++; P.fig.group.traverse((m) => { if (m.isMesh && m.visible) { calls++; const g = m.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } }); }
    }
    let farCalls = 0, farTris = 0; for (const R of this._farRecs.values()) if (R.mesh.visible && R.mesh.count) { farCalls++; farTris += R.mesh.count * R.tris; }
    return { people: this.people.length, high, built, building: this.jobP ? 1 : 0, queued: this.queue.length, builds: this.builds, buildMs: Math.round(this.buildMs), avgMs: this.builds ? Math.round(this.buildMs / this.builds) : 0, tris: Math.round(tris), calls, farCalls, farTris: Math.round(farTris), fails: this.fails };
  }
  dispose() {
    if (this.gone) return; this.gone = true;
    if (this.job) this._finishJob(true);
    for (const P of this.people) if (P.fig) { try { P.fig.dispose(); } catch (_) { /* */ } P.fig = null; }
    for (const R of this._farRecs.values()) { R.mesh.geometry.dispose(); R.src.userData.users = Math.max(0, (R.src.userData.users || 1) - 1); }
    this._farRecs.clear(); this.people = []; this.queue = [];
    this.group.parent?.remove(this.group); this.group.clear();
    try { faceCacheTrim(); } catch (_) { /* */ }
  }

  // ---- 'own': the far bodies, instanced (world/Crowd.js's tube bodies, each person's colours) -------------------------------
  _farUpdate() {
    if (this._farDirty) { this._farDirty = false; this._farMoved = false; this._farPack(); return; }
    if (this._farMoved) { this._farMoved = false; for (const R of this._farRecs.values()) { R.ps.forEach((P, i) => this._farPut(R, i, P)); R.mesh.instanceMatrix.needsUpdate = true; } }
  }
  _farPack() {
    const by = new Map();
    for (const P of this.people) {
      if (!P.on || P.high) continue;
      const spec = P._fs || (P._fs = farSpecOf(P.opts)); const k = JSON.stringify(spec);
      if (!by.has(k)) by.set(k, { spec, ps: [] }); by.get(k).ps.push(P);
    }
    for (const R of this._farRecs.values()) { R.ps = []; R.mesh.count = 0; R.mesh.visible = false; }
    const mat = this.farMat || crowdMaterial(), c = new THREE.Color();
    for (const [k, { spec, ps }] of by) {
      let R = this._farRecs.get(k);
      if (R && R.cap < ps.length) { this.group.remove(R.mesh); R.mesh.geometry.dispose(); R.src.userData.users = Math.max(0, (R.src.userData.users || 1) - 1); this._farRecs.delete(k); R = null; }
      if (!R) {
        let src; try { src = templateOf(spec); } catch (e) { console.warn('NpcFigures: a far body could not be baked', e); continue; }
        src.userData.users = (src.userData.users || 0) + 1;
        const cap = Math.max(4, Math.ceil(ps.length * 1.5)), g = new THREE.BufferGeometry(); for (const a in src.attributes) g.setAttribute(a, src.attributes[a]); if (src.index) g.setIndex(src.index);
        g.boundingSphere = src.boundingSphere?.clone() || null;
        for (const a of ATTR) g.setAttribute(a, new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3));
        g.setAttribute('iMisc', new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4));
        const mesh = new THREE.InstancedMesh(g, mat, cap); mesh.userData[this.keepKey] = true; mesh.name = 'npc-far:' + spec.pose; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        R = { mesh, src, cap, ps: [], tris: (src.index ? src.index.count : src.attributes.position.count) / 3 }; this._farRecs.set(k, R); this.group.add(mesh);
      }
      R.ps = ps; const g = R.mesh.geometry;
      ps.forEach((P, i) => {
        this._farPut(R, i, P);
        coloursOf(P.opts).forEach((v, a) => { c.set(v); const A = g.attributes[ATTR[a]].array; A[i * 3] = c.r; A[i * 3 + 1] = c.g; A[i * 3 + 2] = c.b; });
        // (crowdMaterial's: a phase, a bounce on the beat for a dancer, a nod; a club material's: the phase, how hard, a nod, the shoulders' turn)
        const M = g.attributes.iMisc.array; M[i * 4] = P.ph; M[i * 4 + 1] = this.farMat ? (P.anim === 'dance' ? P.en : 0.12) : P.anim === 'dance' ? 0.12 * P.en : 0; M[i * 4 + 2] = P.anim === 'still' ? 0 : this.farMat ? P.nod : 0.03; M[i * 4 + 3] = this.farMat ? P.tw : 0;
      });
      R.mesh.count = ps.length; R.mesh.visible = ps.length > 0; R.mesh.instanceMatrix.needsUpdate = true;
      for (const a of ATTR) g.attributes[a].needsUpdate = true; g.attributes.iMisc.needsUpdate = true;
      R.mesh.computeBoundingSphere(); if (R.mesh.boundingSphere) R.mesh.boundingSphere.radius += 1;
    }
  }
  _farPut(R, i, P) { M0.compose(S0.set(P.x, P.y, P.z), Q0.setFromAxisAngle(Y0, P.yaw), V1.setScalar(P.scale)); R.mesh.setMatrixAt(i, M0); }
}

/** a ray against an upright capsule (x, z; y0..y1; radius r) -> the ray's t at the hit, or -1 */
function capsule(ray, x, y0, y1, z, r) {
  const o = ray.origin, d = ray.direction;
  // (the infinite cylinder about the axis, then the segment's ends as spheres)
  const ox = o.x - x, oz = o.z - z, a = d.x * d.x + d.z * d.z, b = 2 * (ox * d.x + oz * d.z), c = ox * ox + oz * oz - r * r;
  let best = -1;
  if (a > 1e-9) {
    const disc = b * b - 4 * a * c;
    if (disc >= 0) { const s = Math.sqrt(disc), t = (-b - s) / (2 * a), y = o.y + t * d.y; if (t >= 0 && y >= y0 && y <= y1) best = t; }
  }
  for (const yc of [y0, y1]) {
    const px = o.x - x, py = o.y - yc, pz = o.z - z, bb = px * d.x + py * d.y + pz * d.z, cc = px * px + py * py + pz * pz - r * r, D = bb * bb - cc;
    if (D >= 0) { const t = -bb - Math.sqrt(D); if (t >= 0 && (best < 0 || t < best)) best = t; }
  }
  return best;
}
