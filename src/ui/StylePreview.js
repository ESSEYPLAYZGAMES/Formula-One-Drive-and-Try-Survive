// A live 3D preview of one person being styled - the partner's style suite, your own look in the career wizard - stood in
// a host's scene (the hub's studio: no second WebGL context, its compiled programs and its light shared). It owns the
// preview person's whole life: built once, then every change either applied in place where People can (make-up - a
// quick draft paint while a slider moves, the full one when it stops -, the clothes', the shoes', the hair's and the
// metal's colours: person.restyle) or, for anything that changes her shape (a hairstyle, a cut, a fabric), rebuilt a
// moment after the last change: the new person built and its shaders compiled before it is swapped in, the old one
// disposed only then - never a blank frame, nothing leaked (its face's paint handed back to People's cache). Draws
// nothing itself: the host redraws when told (dirty) - a still preview leaves the GPU idle.
import * as THREE from 'three';
import { makePerson, faceCacheTrim } from '../world/People.js';

// (what restyle can change in place - People's makePerson options -> its patch's field)
const CHEAP = [['style.makeup', 'makeup'], ['color', 'color'], ['accent', 'accent'], ['shoes', 'shoes'], ['hair', 'hair'], ['jewel.metal', 'metal'], ['jewel.clutchMetal', 'clutchMetal'], ['style.shine', 'shine']];
// (a pointer held down anywhere - a slider being dragged: its quick paint is not finished off until it is let go)
let PTR = false;
if (typeof window !== 'undefined') { const dn = () => { PTR = true; }, up = () => { PTR = false; }; window.addEventListener('pointerdown', dn, true); window.addEventListener('pointerup', up, true); window.addEventListener('pointercancel', up, true); window.addEventListener('blur', up); }
/** an object with its empty objects taken out, all the way down (a jewel: {} left once its metal is out is no jewel at all) */
const prune = (v) => { if (!v || typeof v !== 'object' || Array.isArray(v)) return v; for (const k of Object.keys(v)) { const x = prune(v[k]); if (x && typeof x === 'object' && !Array.isArray(x) && !Object.keys(x).length) delete v[k]; } return v; };
const get = (o, path) => path.split('.').reduce((v, k) => (v == null ? undefined : v[k]), o);
/** JSON with its keys sorted (the same options always the same string, however they were put together) */
const stable = (v) => (Array.isArray(v) ? `[${v.map(stable).join(',')}]` : v && typeof v === 'object' ? `{${Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}` : JSON.stringify(v ?? null));
/** the options without the fields restyle can change: two people with the same structure key differ only in those */
const structKey = (o) => {
  const c = JSON.parse(JSON.stringify(o || {}));
  for (const [path] of CHEAP) { const ks = path.split('.'), last = ks.pop(), par = ks.reduce((v, k) => v?.[k], c); if (par && typeof par === 'object') delete par[last]; }
  return stable(prune(c));
};
/** the next frame (or 50 ms, whichever first: a hidden page draws no frames, and the work must not wait on one) -> cancel() */
const nextFrame = (fn) => { let done = false; const go = () => { if (!done) { done = true; cancelAnimationFrame(a); clearTimeout(t); fn(); } }, a = requestAnimationFrame(go), t = setTimeout(go, 50); return () => { done = true; cancelAnimationFrame(a); clearTimeout(t); }; };
const raf = () => new Promise((r) => nextFrame(r));
/** how many people she was a moment ago are kept, out of sight, to come back at once */
const SPARES = 2;
const rm = (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
/** a person let go: disposed now, or - its shaders still compiling (p.comp) - as soon as that settles (three's compileAsync
 *  reads each material's program while it waits: a material disposed under it throws) */
const gone = (p) => { if (!p) return; if (p.comp) p.comp.then(() => p.dispose()); else p.dispose(); };
const lumC = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
/**
 * Her hair's new colour shown at once on the person she is, where restyle cannot give it exactly (hair with tones of its
 * own: a root, ends - built again a moment later): the hair's material recoloured, its root and ends going with it for
 * that moment; the colour it had kept (p._hair0) to be put back before she is kept as a spare -> true when shown
 */
export const tintHair = (p, hex) => {
  const m = p?.mats?.hair; if (!m?.color || !/^#[0-9a-f]{6}$/i.test(hex || '')) return false;
  if (!p._hair0) p._hair0 = { c: m.color.clone(), e: m.emissive?.clone() };
  const l0 = lumC(m.color), k = l0 > 1e-6 && m.emissive ? lumC(m.emissive) / l0 : 0;
  m.color.set(hex); if (k > 0) m.emissive.copy(m.color).multiplyScalar(k);
  return true;
};
/** her hair's own colour back (tintHair undone) */
const untintHair = (p) => { const h = p?._hair0, m = p?.mats?.hair; if (!h || !m) return; m.color.copy(h.c); if (h.e && m.emissive) m.emissive.copy(h.e); p._hair0 = null; };

/**
 * new StylePreview(host, o)
 * host: { scene, renderer (for compileAsync; optional), camera (optional), parent (an Object3D to stand her in; default
 *   scene), dirty() (redraw the host's view), onBuild(person) (after every build - a hangout's night lift, its own light) }
 * o: { at: [x, y, z] (where she stands), yaw (the way she faces, rad), debounce (ms after the last structural change,
 *   180), disc (a white stand under her: its radius, 0 none), shadow (cast shadows: false), jitter (0: the same pose every
 *   build) }
 * Use: show(opts) (makePerson's options - celebLook's, or your own), update(opts, { draft }) on every change (draft: a
 * slider still moving - a quick paint), peek(opts) / unpeek() (a swatch hovered), turn(yaw, ms), headWorld(), hide({ keep })
 * (keep: out of sight, kept for an instant show()), dispose(). Anything outside the options that changes the person (a
 * driver's registered look) - put a stamp of it in opts.rev so the preview knows to rebuild. The last two people she was
 * are kept hidden (spares): going back to one of them (UNDO, a tile picked before) swaps it in at once, restyled.
 */
export class StylePreview {
  constructor(host, o = {}) {
    this.host = host; this.o = { at: [0, 0, 0], yaw: 0, debounce: 180, disc: 0, shadow: false, ...o };
    this.person = null; this.shown = null; this.want = null; this.key = null;
    this.timer = 0; this.token = 0; this.building = null; this.pend = null; this.raf = null; this.turnRaf = 0;
    this.yaw = this.o.yaw; this.stats = { builds: 0, restyles: 0, drafts: 0, lastBuildMs: 0, lastPaintMs: 0 };
    this.disc = null; this.dead = false; this.gen = 0;
    // (showing: on stage (show() to hide()); hidden: put away but kept - hide({ keep }) - for an instant way back in;
    // spares: the last few people she was, kept out of sight - UNDO, an occasion back and forth, the tile picked before)
    this.showing = false; this.hidden = false; this.spares = [];
  }
  get parent() { return this.host.parent || this.host.scene; }
  _dirty() { this.host.dirty?.(); }
  /** the person with these options: built now if nobody is shown yet, else as update() */
  show(opts) {
    this.showing = true;
    if (this.hidden) {
      // (back on stage: the one kept, when she is still that shape - else hidden until the one wanted is in)
      this.hidden = false; if (this.disc) this.disc.visible = true;
      if (this.person && structKey(opts) === this.key) { this.person.group.visible = true; this.person.group.rotation.y = this.yaw; this._dirty(); return this.update(opts); }
      if (this.person) { this._spare(this.person, this.key, this.shown); this.person = null; this.key = null; this.shown = null; }
    }
    if (!this.person && !this.building) { this.want = opts; const s = this._take(opts); this._swap(s || this._build(opts), opts); return s ? 'spare' : 'built'; }
    return this.update(opts);
  }
  /**
   * The options changed: in place when only restyle's fields did (a draft: at most one paint a frame, the latest wins),
   * else a rebuild queued for when the changes stop -> 'same' | 'restyled' | 'queued'
   */
  update(opts, { draft = false } = {}) {
    this.want = opts; this.peeked = false;
    // (off stage: the options kept for show())
    if (this.hidden || this.dead) return 'hidden';
    if (!this.person && !this.building) { this._swap(this._build(opts), opts); return 'built'; }
    // (one building: whatever is wanted when it is in is looked at then)
    if (this.building) return 'queued';
    const k = structKey(opts);
    if (k !== this.key) { this._queue(); return 'queued'; }
    // (back to the shape she has: no rebuild after all)
    clearTimeout(this.timer); this.token++;
    let patch = this._patch(this.shown, opts, draft);
    // (the slider let go: the face shown is a quick draft - painted in full now, even with nothing else changed)
    if (!draft && this.drafty) (patch = patch || {}).makeup ??= get(opts, 'style.makeup') ?? null;
    // (her hair's colour shown for a moment (tintHair) and then taken back before she was built again: her own again)
    if (this.person?._hair0 && patch?.hair === undefined) { untintHair(this.person); this._dirty(); }
    if (!patch) { this.shown = opts; return 'same'; }
    if (draft && patch.makeup !== undefined) {
      // (a slider moving: the newest values painted at the next frame, never more often; and when it stops without a
      // word, painted in full a moment later)
      this.pend = { patch, opts };
      if (!this.raf) this.raf = nextFrame(() => { this.raf = null; const p = this.pend; this.pend = null; if (p && !this.dead) this._restyle(p.patch, p.opts); });
      // (never while the pointer is still held: a pause mid-drag is not the end of it - the slider's 'change' is)
      const fin = () => { if (this.dead || !this.drafty || !this.want || this.building) return; if (PTR) { this.fin = setTimeout(fin, 320); return; } this.update(this.want); };
      clearTimeout(this.fin); this.fin = setTimeout(fin, 320);
      return 'restyled';
    }
    if (this.raf) { this.raf(); this.raf = null; this.pend = null; }
    return this._restyle(patch, opts) ? 'restyled' : 'queued';
  }
  /** a look tried on for a moment (a swatch under the pointer): in place only - nothing that needs a rebuild */
  peek(opts) {
    if (!this.person || this.hidden || this.building || structKey(opts) !== this.key) return false;
    const patch = this._patch(this.shown, opts, false); if (!patch || patch.makeup !== undefined) return false;
    const ok = this.person.restyle?.(patch); if (ok) { this.shown = opts; this.peeked = true; this._dirty(); } return !!ok;
  }
  /** back to the look being edited */
  unpeek() { if (this.peeked && this.want) { this.peeked = false; this.update(this.want); } }
  /** the fields restyle changes, those that differ between a and b -> a patch, or null */
  _patch(a, b, draft) {
    let p = null;
    for (const [path, f] of CHEAP) { const x = get(a, path), y = get(b, path); if (stable(x) !== stable(y)) (p = p || {})[f] = y === undefined ? null : y; }
    if (p && draft) p.draft = true;
    return p;
  }
  _restyle(patch, opts) {
    const t0 = performance.now(), ok = !!this.person?.restyle?.(patch);
    // (her hair's colour where it has tones of its own: shown at once, exact once she is built again)
    if (!ok) { if (patch.hair && tintHair(this.person, patch.hair)) this._dirty(); this._queue(); return false; }
    this.shown = opts; this.stats.restyles++; if (patch.draft) this.stats.drafts++; this.stats.lastPaintMs = performance.now() - t0;
    if (patch.makeup !== undefined) this.drafty = !!patch.draft;
    this._dirty(); return true;
  }
  /** a rebuild, debounce ms after the last change */
  _queue() {
    clearTimeout(this.timer); const tk = ++this.token;
    this.timer = setTimeout(() => { if (tk === this.token && !this.dead) this._rebuild(tk); }, this.o.debounce);
  }
  async _rebuild(tk) {
    if (this.building) { await this.building; if (tk !== this.token || this.dead) return; }
    let done; this.building = new Promise((r) => (done = r)); const gen = this.gen;
    try {
      // (after the frame the click was drawn in: the page's own transition first, then the build)
      await raf(); await raf();
      if (!this.dead && gen === this.gen) {
        // (one she was a moment ago: back at once, nothing built)
        const opts = this.want, sp = this._take(opts);
        if (sp) this._swap(sp, opts);
        else {
          const p = this._build(opts);
          // (its shaders compiled before it is shown - a fabric or a finish new to the scene - at most 300 ms)
          const R = this.host.renderer, cam = this.host.camera;
          // (p.comp: that compile, until it settles - three's compileAsync polls each material's program, so a person is
          // never disposed under it: gone() waits for it)
          if (R?.compileAsync && cam) { try { p.comp = R.compileAsync(p.group, cam, this.host.scene).catch(() => {}).finally(() => { p.comp = null; }); await Promise.race([p.comp, new Promise((r) => setTimeout(r, 300))]); } catch (e) { /* (compiled on first draw instead) */ } }
          // (put away while it was building - the page left: never stood in the scene after all)
          if (this.dead || gen !== this.gen) gone(p); else this._swap(p, opts);
        }
      }
    } finally { this.building = null; done(); }
    if (this.dead) return;
    // (put away and shown again while it was building: built now for the stage it is back on)
    if (!this.person || this.hidden) { if (this.showing && !this.hidden && this.want) this._queue(); return; }
    // (a change while it was building that needs another: the next one now)
    if (this.want && structKey(this.want) !== this.key) this._queue();
    else if (!this.dead && this.want !== this.shown) this.update(this.want);
  }
  _build(opts) {
    // (standing still: the same pose build after build, whatever jitter the options carry - o.jitter to differ)
    const t0 = performance.now(), p = makePerson({ ...opts, jitter: this.o.jitter ?? 0 });
    this.stats.lastBuildMs = performance.now() - t0; this.stats.builds++;
    if (!this.o.shadow) p.group.traverse((m) => { if (m.isMesh) m.castShadow = false; });
    return p;
  }
  /** the new person in, where the old one stood (the old one disposed only now: its face's paint never let go in between) */
  _swap(p, opts) {
    const [x, y, z] = this.o.at, old = this.person;
    p.group.position.set(x, y + (this.disc ? this.disc.userData.h : 0), z); p.group.rotation.y = this.yaw;
    if (this.o.disc && !this.disc) this._stand();
    if (this.disc) p.group.position.y = y + this.disc.userData.h;
    this.parent.add(p.group); p.group.visible = true;
    if (old && old !== p) this._spare(old, this.key, this.shown, this.drafty);
    this.person = p; this.shown = opts; this.key = structKey(opts); this.drafty = false;
    this.host.onBuild?.(p); this._dirty();
  }
  /** a person stood down, kept out of sight for a while (the last SPARES of them; older ones disposed) */
  _spare(p, key, opts, drafty = false) {
    untintHair(p); p.group.visible = false; this.spares = this.spares.filter((s) => { if (s.key !== key) return true; this.parent.remove(s.p.group); gone(s.p); return false; });
    this.spares.unshift({ p, key, opts, drafty });
    while (this.spares.length > SPARES) { const s = this.spares.pop(); this.parent.remove(s.p.group); gone(s.p); }
  }
  /** a spare of this shape, restyled to these options (null: none, or it could not be) */
  _take(opts) {
    const k = structKey(opts), i = this.spares.findIndex((s) => s.key === k); if (i < 0) return null;
    const [s] = this.spares.splice(i, 1);
    let patch = this._patch(s.opts, opts, false); if (s.drafty) (patch = patch || {}).makeup ??= get(opts, 'style.makeup') ?? null;
    if (patch && !s.p.restyle?.(patch)) { this.parent.remove(s.p.group); gone(s.p); return null; }
    this.stats.spares = (this.stats.spares || 0) + 1; return s.p;
  }
  _dropSpares() { for (const s of this.spares) { this.parent.remove(s.p.group); gone(s.p); } this.spares = []; }
  /** a low white stand under her, and a soft shadow round its foot */
  _stand() {
    const [x, y, z] = this.o.at, r = this.o.disc, h = 0.05, g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.02, h, 64), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 })); top.position.y = h / 2; top.receiveShadow = true;
    const blob = new THREE.Mesh(new THREE.CircleGeometry(r * 1.35, 48), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.07, depthWrite: false })); blob.rotation.x = -Math.PI / 2; blob.position.y = 0.004;
    g.add(top, blob); g.position.set(x, y, z); g.userData.h = h; this.parent.add(g); this.disc = g;
  }
  /** turn her to face yaw (rad), over ms (none: at once; reduced motion: at once) */
  turn(yaw, ms = 220) {
    cancelAnimationFrame(this.turnRaf); const P = this.person, y0 = this.yaw; this.yaw = yaw;
    if (!P) return;
    if (!ms || rm) { P.group.rotation.y = yaw; this._dirty(); return; }
    const t0 = performance.now(), step = (now) => { const u = Math.min(1, (now - t0) / ms), e = u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2; if (this.person) this.person.group.rotation.y = y0 + (yaw - y0) * e; this._dirty(); if (u < 1) this.turnRaf = requestAnimationFrame(step); };
    this.turnRaf = requestAnimationFrame(step);
  }
  /** where her head is (world) -> [x, y, z] (for a close camera), or null */
  headWorld() { const P = this.person; if (!P?.head) return null; P.group.updateMatrixWorld(true); const v = new THREE.Vector3(); P.head.getWorldPosition(v); return [v.x, v.y, v.z]; }
  /**
   * She leaves the stage (the stand too); the options kept for show(). keep: she (and the spares) kept out of sight - an
   * instant way back in (nothing drawn while hidden); else all of it disposed
   */
  hide({ keep = false } = {}) {
    clearTimeout(this.timer); clearTimeout(this.fin); this.token++; this.gen = (this.gen || 0) + 1; if (this.raf) this.raf(); this.raf = null; this.pend = null; cancelAnimationFrame(this.turnRaf);
    this.showing = false;
    if (keep && this.person) {
      // (a quick paint still on her face: the full one now, while nobody is looking)
      const tgt = this.want && structKey(this.want) === this.key ? this.want : this.shown;
      let patch = this._patch(this.shown, tgt, false); if (this.drafty && tgt) (patch = patch || {}).makeup ??= get(tgt, 'style.makeup') ?? null;
      if (patch && this.person.restyle?.(patch)) { this.shown = tgt; this.drafty = false; }
      this.person.group.visible = false; if (this.disc) this.disc.visible = false; this.hidden = true;
    } else {
      this.drafty = false; this.hidden = false;
      if (this.person) { this.parent.remove(this.person.group); gone(this.person); this.person = null; this.key = null; this.shown = null; }
      this._dropSpares();
      if (this.disc) { this.parent.remove(this.disc); this.disc.traverse((m) => { if (m.isMesh) { m.geometry.dispose(); m.material.dispose(); } }); this.disc = null; }
    }
    // (the paints tried while editing given back, a few kept for the way back in)
    faceCacheTrim(4); this._dirty();
  }
  /** for good */
  dispose() { this.hide(); this.dead = true; this.want = null; }
}
export { structKey as previewKey, CHEAP as previewCheap };
/** is a pointer held down (a slider being dragged)? - a quick paint is finished off only once it is let go */
export const pointerHeld = () => PTR;
