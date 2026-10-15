// The scuffle at an after-party (WP5): ui/Brawl.js's handbags - open hands, shoves, people pulling you apart, nobody hurt -
// hosted in a Hangout venue instead of on the grid. Only ever with an invented antagonist (a drunk stranger, a star's
// tabloid ex, an ex's new man): a real driver gets words, never this (ui/PartyPlay.js decides). It runs as a Hangout
// pseudo-game (ev.game), so Hangout leaves the camera, the walking and the keys to it while it plays.
// The adapter: Brawl drives a proxy PerspectiveCamera as if the venue group's own frame were the world (the evening's
// pos, yaw and pitch are in that frame); after every Brawl update the real camera becomes M x proxy.matrixWorld (and the
// proxy's fov), and your first-person arms hang off the venue group, so their matrix (proxy-relative) lands in the same
// place. The extra bodies (squared up, shoving, held back) are built from each person's own makePerson options (g.opts:
// their club clothes), lit by the room. What it costs is data (partyBrawlFx) for the career to settle - no licence
// points (it is not the grid), composure, the papers if a camera caught it, an ejection.
import * as THREE from 'three';
import { Brawl } from './Brawl.js';

/** a club's wording laid over the grid's (Brawl linesOf): a shirt for the overalls, security for the stewards; heated, never hateful */
export const CLUB_LINES = {
  say: {
    square: [`You want to do this here? Really?`, `Go on, then.`, `Say that again.`, `Easy. Think about it.`, `Not in here, mate.`, `You've got some nerve.`],
    call: [`Oi! A word.`, `Hey! Yeah, you.`, `Got a problem, mate?`, `Don't walk off when I'm talking to you.`],
    opener: [`Think you're special, do you?`, `Yeah, I know who you are.`, `Go on then, big man.`, `Watch where you're going.`],
    walk: [`Yeah, walk away.`, `That's what I thought.`, `Typical.`],
    after: [`You got lucky.`, `Enjoy your night, superstar.`, `Yeah, go on.`, `Later.`],
  },
  sep: {
    security: [`Alright, that's enough. Both of you.`, `Hands down. Now.`, `Not in my club. Break it up.`],
    friend: [`Leave it! He's not worth it.`, `Come on, come on - walk away.`, `Mate. Mate! Leave it.`],
    mate: [`Oi! Think about the team.`, `Leave it - the phones are out.`, `Not worth it. Come on.`],
    boss: [`Enough! Both of you - now!`, `Not here. Walk away. That's an order.`],
    crew: [`Easy! Easy!`, `Break it up!`, `Not in here!`],
  },
  beat: { brace: { hint: 'He goes for your shirt - plant your feet', bad: 'GRABBED YOUR SHIRT' } },
  choice: { walk: 'Rise above it - the phones are out', keep: 'One more - security is right there', back: 'Let security split it up' },
};

const _m = new THREE.Matrix4(), _s = new THREE.Vector3();

/**
 * The scuffle, as a Hangout pseudo-game: ev.game = new PartyBrawl({...}).
 * o: { ev (the Evening), foe: { name, person, opts, cid, disc? } (the invented antagonist), started (true: you squared
 *      up to him; false: he shoved you first - then you choose to shove back or walk away), seps: [{ name, kind
 *      ('security' | 'friend' | 'mate' | 'boss'), person, opts, holds: 'you' | 'tgt', disc? }] (who may run in to split
 *      it up; disc: their standing room in the room's discs, which never blocks the scuffle's own moves), qte
 *      (your windows' multiplier), sleeve, skin (your arms), noise(level, tc) (the room's crowd noise, optional),
 *      lines (Brawl's wording to lay over the grid's; default CLUB_LINES - ui/PapsConfront.js has a photographer's),
 *      onDone(outcome) (Brawl's outcome) }
 * Game shape for Hangout: name, done, result (always null: Hangout's _gameOver drops it), update(dt), key(code, down),
 * mouse(), skip() (Q/Esc: back off / walk away at a choice), info(), dispose().
 */
export class PartyBrawl {
  constructor(o) {
    const ev = this.ev = o.ev; this.o = o; this.name = 'scuffle'; this.done = false; this.result = null; this.out = null;
    const cam = ev.cam; this.fov0 = cam.fov;
    // (the proxy: Brawl's camera, in the venue group's frame)
    const P = this.proxy = new THREE.PerspectiveCamera(cam.fov, cam.aspect || 1.6, cam.near, cam.far); P.position.set(ev.pos.x, ev.pos.y, ev.pos.z);
    const walk = this.walk = {
      camera: P, pos: ev.pos, cars: [], life: null, audio: ev.audio || null, night: ev.night !== false,
      get yaw() { return ev.yaw; }, set yaw(v) { ev.yaw = v; }, get pitch() { return ev.pitch; }, set pitch(v) { ev.pitch = v; }, get bob() { return ev.bob || 0; },
      _free: (x, z) => this._free(x, z), pre: { group: null, crowd: { to: (v, tc) => { try { o.noise?.(v, tc); } catch (_) { /* (no room noise) */ } } } },
      player: { name: ev.meName || 'You', color: ev.myColor || '#c8102e', color2: '#e8e8e8', team: null }, npcs: [],
    };
    const F = o.foe || {};
    // (the floor as Brawl sees it: the room's own test, but the people in the scuffle never block each other - their
    // standing discs move with them)
    this.skip = new Set([F.disc, ...(o.seps || []).map((s) => s?.disc)].filter(Boolean));
    this.foe = { kind: 'person', name: F.name || 'Stranger', person: F.person, opts: F.opts || {}, cid: F.cid || null, mate: false, persona: 'stirrer', mood: -2, did: null, car: null };
    walk.npcs = [this.foe, ...(o.seps || []).filter((s) => s?.person?.head).map((s) => ({ kind: s.kind || 'security', name: s.name || 'Security', person: s.person, opts: s.opts || {}, holds: s.holds === 'tgt' ? 'tgt' : 'you', car: null }))];
    // (Brawl puts everyone it moves on the floor: a raised booth's people get their own height back afterwards)
    this.y0 = walk.npcs.map((n) => [n, n.person?.group?.position.y || 0]);
    this.b = new Brawl({
      walk, npc: this.foe, qte: o.qte ?? 1, started: o.started !== false, onDone: (out) => this._end(out),
      // (their extra bodies in their own clothes tonight - the pose and the head are Brawl's)
      kitOf: (W, n) => { const { pose, headless, ...k } = n.opts || {}; return { ...k, detail: 0.35 }; },
      lines: o.lines || CLUB_LINES, armsParent: ev.scene, seps: (m) => m.holds || null,
      lit: (obj) => { try { ev._hostLit?.(obj); } catch (_) { /* (unhosted: the room's own lights) */ } },
      sleeve: o.sleeve || null, skin: o.skin || null,
    });
    this._sync();
  }
  update(dt) { if (this.done) return; this.b.update(dt); if (!this.done) this._sync(); }
  /** open floor at (x, z) for Brawl: the room's areas and furniture, everyone's standing room but the scuffle's own */
  _free(x, z) {
    const ev = this.ev, K = ev.K, r = 0.22; if (!K?.areas) return ev._free(x, z);
    if (!K.areas.some((a) => x > a.x0 + r && x < a.x1 - r && z > a.z0 + r && z < a.z1 - r)) return false;
    for (const s of K.solids || []) if (x > s.x0 - r && x < s.x1 + r && z > s.z0 - r && z < s.z1 + r) return false;
    for (const d of K.discs || []) if (!this.skip.has(d) && (x - d.x) ** 2 + (z - d.z) ** 2 < (d.r + r) ** 2) return false;
    return true;
  }
  /** the real camera from the proxy: into the world's frame (hosted), the zoom with it */
  _sync() {
    const ev = this.ev, cam = ev.cam, P = this.proxy; P.updateMatrixWorld();
    if (ev.host && ev.M) _m.multiplyMatrices(ev.M, P.matrixWorld); else _m.copy(P.matrixWorld);
    _m.decompose(cam.position, cam.quaternion, _s);
    if (Math.abs(cam.fov - P.fov) > 0.001) { cam.fov = P.fov; cam.updateProjectionMatrix(); }
    cam.updateMatrixWorld();
  }
  _restore() {
    for (const [n, y] of this.y0) if (n.person?.group) n.person.group.position.y = y;
    const cam = this.ev.cam; if (cam && cam.fov !== this.fov0) { cam.fov = this.fov0; cam.updateProjectionMatrix(); }
  }
  _end(out) { if (this.done) return; this.done = true; this.out = out; this._restore(); try { this.o.onDone?.(out); } catch (e) { console.warn('PartyBrawl: onDone failed', e); } }
  key(code, down = true) { if (down && !this.done) this.b.key(code); }
  mouse() {}
  /** Q / Esc: at a choice, the calm one (walk away, back off); otherwise nothing - it is over in seconds */
  skip() { const s = this.b?.state?.stage; if (s === 'choose0' || s === 'final') this.b.key('KeyE'); }
  info() { return { stage: this.b?.state?.stage || null, beat: this.b?.state?.beat || null }; }
  dispose() { if (!this.done) { this.done = true; try { this.b.dispose(); } catch (_) { /* gone */ } this._restore(); } }
}

/**
 * What a party scuffle costs, as data for career/Party.js partyResult (nothing here writes to the career).
 * out: Brawl's outcome; ctx: { venue ('vegasclub' | 'londonclub' | 'teamparty'), cid (the antagonist's), leak (London's
 * chance a phone got it, 0..1), rnd } ->
 * null (nothing happened) | { result 'won'|'lost'|'even'|'walked', started, escalated, backedOff, onCamera, police,
 *   ejected (you), foeEjected, composure (delta), licence: 0, heat, story ('scuffle' | null), crisis ({ id: 'brawl',
 *   source: 'club' } | null), separators, antagonist }
 * Rules (the spec): no licence points; composure -8 (+3 won / -4 lost); on camera always at the Vegas club, half the time
 * at the team party, in London only if it leaked; 10% of escalated scuffles you started: 'police took statements, no
 * arrests' (heat +6). Walking away when he shoved you: he is the one walked out.
 */
export function partyBrawlFx(out, ctx = {}) {
  if (!out || out.aborted) return null;
  const rnd = typeof ctx.rnd === 'function' ? ctx.rnd : Math.random, v = ctx.venue || '';
  if (out.walkedAway) return { result: 'walked', started: false, escalated: false, backedOff: false, onCamera: false, police: false, ejected: false, foeEjected: true, composure: 1, licence: 0, heat: 0, story: null, crisis: null, separators: out.separators || [], antagonist: ctx.cid || null };
  const onCamera = v === 'vegasclub' ? true : v === 'teamparty' ? rnd() < 0.5 : v === 'londonclub' ? rnd() < (ctx.leak ?? 0.3) : rnd() < 0.7;
  const police = !!(out.escalated && out.started && rnd() < 0.1);
  const composure = -8 + (out.result === 'won' ? 3 : out.result === 'lost' ? -4 : 0);
  return { result: out.result || 'even', started: !!out.started, escalated: !!out.escalated, backedOff: !!out.backedOff, onCamera, police, ejected: true, foeEjected: true, composure, licence: 0,
    heat: (onCamera ? 20 : 0) + (police ? 6 : 0), story: onCamera ? 'scuffle' : null, crisis: onCamera ? { id: 'brawl', source: 'club' } : null, separators: out.separators || [], antagonist: ctx.cid || null };
}
