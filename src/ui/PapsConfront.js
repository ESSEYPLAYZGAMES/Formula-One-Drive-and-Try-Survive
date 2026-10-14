// ui/PapsConfront.js - the photographers who follow you (an evening out, the after-party). Three parts:
// - Who comes, and why (the director): a night's pressure from things you can read - your fame and the week's PR heat,
//   the venue (Las Vegas and the clubs most of all, a private room hardly ever), the hour (kicking-out time is theirs),
//   a story still running, a famous date or a partner on your arm, a confrontation last time - sets a budget (0-3 a
//   night) and the night's triggers: a tip-off, one drifting in, the late shift at the door, raised voices (an argument
//   is a private moment too), a picture of a hug or a kiss (Affection), the front door of a party. Each arrival says
//   why. After a confrontation they keep away for a while (the cooldown). Never on a quiet or grave evening (and the
//   Memorial and Mourning3D scenes never open an evening at all); never inside a private room (privacy 0.75 and up:
//   your flat, the private dining room) - there a long lens from outside is all there is, as before.
// - The photographers themselves (Pap): invented men with invented agencies, real people in the room (makePerson): they
//   walk in, find a spot, turn to follow you, raise the camera, and every flash comes from the lens. A pushy one follows
//   you about; a timid one gets his pictures and goes.
// - The confrontation: walk up to one (or turn to them) and press P, or the party's front door brings it to you. The four
//   answers open it (ignore them, ask for a minute, tell them where to go, push the camera away); then it can go either
//   way. A calm word can end it; swearing and shoving make it worse. He backs off, keeps filming (video now), calls for
//   backup, grabs your arm, or runs. Your date, a driver you came with, security or the car's driver can step in. A shove
//   that meets a grab can turn into a scuffle - ui/Brawl.js's handbags through ui/PartyBrawl.js (open hands, people pulling
//   you apart; nobody is hurt).
// papsFallout (CareerHub, after the evening) takes it to the press through c.pr (image / heat / followers): a calm exit,
// words, a shove, a scuffle, footage gone viral, an assault complaint - its own crisis kind ('paps') when it needs an
// answer. Sympathetic, never a joke, in a grave week; softer after a private moment; harder when you started it.
// Everything is behind PAPS_CONFRONT_ON; the hooks in Hangout / PartyPlay / Affection / CareerHub are null-safe one-liners.
// Test switches (window): __hangoutPaps (an evening's photographers come at once, budget 2), __partyPaps (the party's exit
// is photographed), __papsComplaint (the complaint is always made), __papsViral (the footage always goes viral),
// __papsReact ('back' | 'film' | 'backup' | 'grab' | 'run': his answer, every time), __papsTemper ('timid' | 'pro' |
// 'pushy': every photographer's), __papsGrief (it reads as a grave week's), __papsOn (the dev lab's switch while the
// flag is off).
import * as THREE from 'three';
import { makePerson, shoveArm } from '../world/People.js';
import { prEnsure, crisisFrom, fameIndex } from '../career/PR.js';
import { PartyBrawl } from './PartyBrawl.js';

export const PAPS_CONFRONT_ON = true;

const pick = (a) => a[(Math.random() * a.length) | 0];
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ss = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const facing = (dx, dz) => Math.atan2(-dz, dx);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const flag = (k) => { try { return window[k] ?? null; } catch (_) { return null; } };
const LIVE = 40;   // (seconds a flash, or a private moment, stays 'just now')
const ON = () => PAPS_CONFRONT_ON || flag('__papsOn') === true;   // (window.__papsOn: the dev lab's switch while the flag is off)
const REACT = ['back', 'film', 'backup', 'grab', 'run'];
const LVL = { ignore: 0, polite: 1, cuss: 2, shove: 3, scuffle: 4 };
const worse = (a, b) => (LVL[b] > LVL[a] ? b : a);
const isRealD = (d) => !!d && ['F1', 'Reserve', 'F2'].includes(d.from);

// ---- who they are (invented: no real agency, no real person) ------------------------------------------------------------
const PAP_NAMES = ['Rocco', 'Dale', 'Marty', 'Benny', 'Kev', 'Sal', 'Gus', 'Lenny', 'Vince', 'Ray', 'Nate', 'Terry', 'Moz', 'Dino'];
const AGENCIES = ['FlashPoint Pictures', 'NightLens', 'Velvet Rope Media', 'Shutterline', 'Kerbside Pix', 'Strip Snaps'];
const PAP_LOOKS = [
  { kit: 'jacket', color: '#1d1f24', accent: '#3a3d44', legs: '#22252b' }, { kit: 'bomber', color: '#2b2f26', accent: '#1a1a1a', legs: '#24272d' },
  { kit: 'casual', color: '#3a3f48', accent: '#1d2230', legs: '#2c3e66' }, { kit: 'leather', color: '#1a1a1c', accent: '#3c3c40', legs: '#202226' },
  { kit: 'sweater', color: '#4a3a2e', accent: '#2a2420', legs: '#24272d', acc: ['lanyard'] },
];
// (how far each goes: a timid one takes no for an answer, a pushy one wants the reaction)
const TEMPER = { timid: { heat: 5, shots: 5, follow: 0, speed: 1.3 }, pro: { heat: 20, shots: 9, follow: 11, speed: 1.5 }, pushy: { heat: 35, shots: 14, follow: 7, speed: 1.7 } };

// ---- what gets said (heated, never hateful; grief is never the joke - its lines are about the intrusion) --------------
const POLITE = ['Give me a minute, yeah? Please.', 'Not tonight, guys. Come on.', 'Can you give us some space? Thank you.'];
const CUSS = ['Get that fucking camera out of my face.', 'Are you serious? Piss off. Now.', 'Back off, mate. I mean it. Fuck off.', 'Have some fucking decency.', 'Christ. Leave us alone, will you?'];
const CUSS_GRIEF = ['Not this week. Have some fucking respect.', 'Do you have any idea what this week is? Get out of here.', 'Put it down. Just put the fucking camera down.'];
const CUSS_PERSONAL = ['That was private. Fuck off.', 'Seriously? That was nothing to do with you. Back off.'];
const MORE = ['You lot are parasites. You know that?', 'Is this what you do for a living? Really?', 'Point that thing somewhere else before I do it for you.', 'Get a real job, mate.'];
const CALM = ['Alright. Sorry. Just - give us a minute, yeah?', 'Okay. I lost it. Sorry. Can we leave it there?', 'Look - long night. Get your picture and give us some space. Please.'];
const SHOVE = ['You put a hand on the lens and push it away. {He} stumbles back a step, the camera swinging on its strap.', 'You shove the camera aside. {He} staggers back, finds his feet, and keeps his distance.'];
const BACK = {
  polite: ['"Alright, alright." {He} lowers the camera - for now.', 'A shrug. {He} steps back, the lens down.', '"Fair enough. Have a good night." {He} means it, nearly.'],
  calm: ['{He} lowers the camera. "Yeah. Alright. No harm done."', '"Fine. Fine." The lens comes down.'],
  grief: ['{He} lowers the camera, and for a moment even he looks away.', '{He} hesitates, then backs off into the street.'],
};
const FILM = {
  polite: ['"Just one more! Over here!" The shutter keeps going.', '"Two minutes and I\'m gone, promise." {He} is still shooting.'],
  cuss: ['"Just doing my job, mate." The red light comes on: video now.', '{He} switches to video, and smiles. "Say that again for the camera?"', '"Lovely. Again, for the video?"'],
  shove: ['"Did you get that?" {he} shouts to someone behind you. Still rolling.', '"That\'s assault, that is!" The camera is up again, recording.'],
  more: ['"Keep going. This is gold." The red light stays on.', '{He} grins behind the lens. "Go on. Louder."'],
};
const BACKUP = ['{He} is on the phone already: "Got him. Get over here." Two more are coming.', '{He} whistles down the street. Two more lenses come running.'];
const GRAB = ['{He} grabs your arm. "Where are you going? Say that again."', 'A hand clamps on your sleeve. "No, no - we\'re not done."'];
const RUN = ['{He} takes one look at you and goes - the camera clutched to his chest.', '{He} backs off, then turns and jogs away down the street.'];
const WALK = ['You turn your back on the lens and walk.', 'You leave it there. The shutter follows you a few steps, then stops.'];
const PAPS_LINES = {   // (ui/Brawl.js's wording, laid over the club's: the photographer, his camera, the people pulling you apart)
  say: {
    square: ['Go on, then. I\'m filming all of this.', 'You want to do this? On camera?', 'Touch the camera again. Go on.', 'Easy. Think about it.'],
    call: ['Oi! Over here!', 'Hey! One for the front page!', 'Got a minute for us?'],
    opener: ['That\'s assault, that is!', 'Get your hands off my camera!', 'Go on then, superstar.'],
    walk: ['Yeah, walk away. Got it all.', 'Thanks for the pictures!', 'That\'s the front page sorted.'],
    after: ['See you in the papers.', 'Lovely. Front page, that.', 'You\'ll be hearing from my lawyer.'],
  },
  sep: {
    security: ['Alright, that\'s enough. You - camera down, out.', 'Hands down. Both of you. Now.', 'Not on my door. Break it up.'],
    friend: ['Leave it! He wants this. Walk away.', 'Come on, come on - it\'s what he\'s after.', 'Mate. Mate! The cameras. Leave it.'],
    mate: ['Oi! Think about the team.', 'Leave it - he\'s filming.', 'Not worth it. Come on.'],
    crew: ['Easy! Easy! Get the shot, not a lawsuit.', 'Leave it, leave it! We got it.', 'Back off, back off!'],
    boss: ['Enough! Walk away. Now.'],
  },
  beat: { brace: { hint: 'He grabs for your jacket - plant your feet', bad: 'GRABBED YOUR JACKET' } },
  choice: { walk: 'Rise above it - he is still filming', keep: 'One more - every lens is on you', back: 'Let them pull you apart' },
};
// (the readable causes: the strongest one is said when a photographer turns up)
const WHY_TXT = {
  heat: 'you are all over the papers this week', vegas: 'it is Las Vegas, and the Strip is crawling with lenses', club: 'a club night, and the agencies know it',
  late: 'kicking-out time is when the agencies work the doors', story: 'the story about {story} is still running', partner: 'you and {who}: the picture every paper wants',
  date: 'a famous date is a front page', secret: 'somebody tipped them off', again: 'after last time, they want a reaction', fame: 'you are famous now',
  row: 'raised voices - and a lens finds you', door: 'the front door, where the agencies wait', tip: 'somebody tipped them off',
};

// ---- the state on the evening (ev.papsS) and the legacy flash context (ev.papsC) ---------------------------------------
const S_ = (ev) => ev.papsS || (ev.papsS = { paps: [], plan: null, used: 0, budget: 0, cool: -1, enc: null, priv: null, k: 0, why: [], hinted: false, seq: 0 });
const griefOf = (ev) => !!(ev?.quiet || ev?.x?.grave) || !!flag('__papsGrief');
const fresh = (ev) => !!ev?.papsC && num(ev.t, 0) - num(ev.papsC.t, -99) < LIVE;
const busy = (ev) => !!(ev.menu || ev.talk || ev.game || ev.sty || ev.ask || ev.moment || ev.closing);
const realOf = (ev) => (ev.party ? !!ev.party.realMe : isRealD(ev.c?.drivers?.[ev.c?.playerId]));
const floorAt = (ev, x, z) => { const f = ev.V?.heightAt; if (typeof f === 'function') { try { return num(f(x, z), 0); } catch (_) { /* */ } } return Math.max(0, num(ev.pos?.y, 1.66) - 1.66); };
const live = (ev) => S_(ev).paps.some((p) => p.on()) || fresh(ev);
const fill = (s, pap) => String(s || '').replace(/\{He\}/g, pap ? 'He' : 'The photographer').replace(/\{he\}/g, pap ? 'he' : 'the photographer');

/**
 * How much the photographers want you tonight, and why (each a factor you can read) -> { k, why: [[factor, text]] }.
 * k is about 1 at a Las Vegas club on race night with middling fame; a village pub, about 0.2; your own flat, nothing.
 */
function pressure(ev) {
  const c = ev.c, x = ev.x || {}, pr = c?.pr || {}, W = [];
  let me = 40; try { if (c?.pr) me = fameIndex(pr.fame ?? 0.4); } catch (_) { me = 40; }
  if (ev.party && Number.isFinite(+ev.party.fame)) me = +ev.party.fame;
  let gf = 0; try { for (const g of ev._present?.() || []) gf = Math.max(gf, g.kind === 'celeb' ? num(g.C?.fame, 60) : 42); } catch (_) { /* */ }
  const fame = Math.max(me, gf), fk = 0.35 + 0.65 * fame / 100; if (me >= 70) W.push([fk, WHY_TXT.fame]);
  const heat = num(pr.heat, 0), hk = 1 + heat / 70; if (heat >= 35) W.push([hk, WHY_TXT.heat]);
  const VK = { rooftop: 1.3, vegasclub: 1.6, poolclub: 1.5, dayclub: 1.4, londonclub: 0.55, teamparty: 0.6, pub: 0.7, restaurant: 0.9, coffee: 0.8, simlounge: 0.6, karting: 0.7, apartment: 0 };
  let vk = VK[ev.vid] ?? 1; if (ev.trackId === 'lasvegas' && vk) { vk *= 1.2; W.push([1.2, WHY_TXT.vegas]); }
  if (ev.occ === 'club' || /club/.test(ev.vid || '')) { vk *= 1.25; W.push([1.25, WHY_TXT.club]); }
  const priv = clamp(num(ev.isParty ? ev.P?.privacy : ev.privacy, 0.4), 0, 1), pk = Math.pow(1 - priv, 1.5) * 1.6;
  const h = num(ev.clock, 21), tk = h < 21 ? 0.7 : h < 24 ? 1 : h < 27 ? 1.35 : 1.1; if (tk > 1.2) W.push([tk, WHY_TXT.late]);
  let sk = 1;
  const K = pr.crisis, story = K && !K.positive && ['scandal', 'nightout', 'brawl', 'paps', 'feud'].includes(K.kind);
  if (story) { sk *= 1.6; W.push([1.6, WHY_TXT.story.replace('{story}', K.story || 'you')]); }
  const gs = ev._present?.() || [], pid = x.partnerId, P = pid ? gs.find((g) => g.id === pid) : null;
  if (P) { sk *= 1.4; W.push([1.4, WHY_TXT.partner.replace('{who}', P.first)]); } else if (x.date && !x.secret) { sk *= 1.2; W.push([1.2, WHY_TXT.date]); }
  if (x.secret) { sk *= 1.15; W.push([1.15, WHY_TXT.secret]); }
  const again = Array.isArray(pr.feed) && pr.feed.some((f) => f && f.kind === 'paps' && f.season === c?.season && num(f.round, -9) >= num(c?.round, 0) - 1);
  if (again) { sk *= 1.3; W.push([1.3, WHY_TXT.again]); }
  W.sort((a, b) => b[0] - a[0]);
  return { k: fk * hk * vk * pk * tk * sk, why: W.map((w) => w[1]) };
}
/** the night's photographers, planned once the room is up: a budget and the triggers that spend it */
function plan(ev) {
  const S = S_(ev), pr = pressure(ev), force = !!flag('__hangoutPaps'); S.k = pr.k; S.why = pr.why;
  const club = !!ev.isParty || ev.occ === 'club';
  S.budget = closed(ev) ? 0 : force ? 2 : pr.k < 0.15 ? 0 : pr.k < 0.6 ? 1 : pr.k < 1.3 ? 2 : 3; if (club && S.budget && !force) S.budget = Math.min(3, S.budget + 1);
  const T = S.plan = [], top = pr.why[0] || WHY_TXT.tip;
  if (force) T.push({ at: 3, cause: top });
  else if (S.budget) {
    // (a tip-off: they are outside before you have your first drink - a story running, a partner on your arm, the heat)
    if (pr.k >= 1.2 || pr.why.some((w) => /story|picture every paper|tipped/.test(w))) T.push({ at: 18 + Math.random() * 20, cause: top });
    // (one drifting in: sooner the hotter the night - an evening that is barely a picture may never see one)
    T.push({ at: 45 + (110 / Math.max(0.15, pr.k)) * (0.6 + Math.random() * 0.8), cause: top });
    // (the late shift: past half past midnight at a club, or anywhere on the Strip)
    if (club || ev.trackId === 'lasvegas') T.push({ clock: 24.5, cause: WHY_TXT.late });
  }
  T.sort((a, b) => num(a.at, 1e9) - num(b.at, 1e9));
}

// ---- the camera in his hands ----------------------------------------------------------------------------------------
function camKit() {
  const m = new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.45, metalness: 0.25 }), gl = new THREE.MeshStandardMaterial({ color: '#0b111c', roughness: 0.08, metalness: 0.7 });
  const rec = new THREE.MeshBasicMaterial({ color: '#ff2a1a', toneMapped: false });
  const G = new THREE.Group(), geo = [new THREE.BoxGeometry(0.14, 0.095, 0.085), new THREE.CylinderGeometry(0.036, 0.042, 0.14, 14), new THREE.CircleGeometry(0.032, 14), new THREE.BoxGeometry(0.05, 0.04, 0.06), new THREE.SphereGeometry(0.009, 8, 6)];
  const body = new THREE.Mesh(geo[0], m), lens = new THREE.Mesh(geo[1], m), glass = new THREE.Mesh(geo[2], gl), head = new THREE.Mesh(geo[3], m), dot = new THREE.Mesh(geo[4], rec);
  lens.rotation.z = -Math.PI / 2; lens.position.x = 0.1; glass.rotation.y = Math.PI / 2; glass.position.x = 0.171; head.position.set(-0.01, 0.068, 0); dot.position.set(0.03, 0.03, -0.045); dot.visible = false;
  G.add(body, lens, glass, head, dot); G.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
  return { group: G, dot, dispose() { for (const g of geo) g.dispose(); m.dispose(); gl.dispose(); rec.dispose(); } };
}

// ---- a photographer (an invented man, in the room) ------------------------------------------------------------------
class Pap {
  constructor(ev, at, o = {}) {
    const S = S_(ev); this.ev = ev; this.id = ++S.seq;
    const used = new Set(S.paps.map((p) => p.name)), names = PAP_NAMES.filter((n) => !used.has(n));
    this.name = pick(names.length ? names : PAP_NAMES); this.agency = o.agency || pick(ev.trackId === 'lasvegas' ? AGENCIES : AGENCIES.filter((a) => a !== 'Strip Snaps'));
    this.temper = TEMPER[flag('__papsTemper')] ? flag('__papsTemper') : o.temper || (Math.random() < 0.2 ? 'timid' : Math.random() < (S.k > 1 ? 0.55 : 0.35) ? 'pushy' : 'pro');
    this.T = TEMPER[this.temper]; this.cause = o.cause || null; this.personal = false; this.video = false; this.enc = null; this.busy = false; this.gone = false;
    this.opts = { pose: 'photo', ...pick(PAP_LOOKS), jitter: 0.01, detail: 0.6, seed: `pap|${this.name}|${this.id}` };
    const p = this.person = makePerson(this.opts), G = p.group;
    try { ev._lift?.(p); } catch (_) { /* */ }
    const y = floorAt(ev, at.x, at.z); G.position.set(at.x, y, at.z); G.rotation.y = facing(ev.pos.x - at.x, ev.pos.z - at.z);
    this.kit = camKit(); G.add(this.kit.group);
    ev.scene.add(G); try { ev._hostLit?.(G); } catch (_) { /* */ }
    this.body0 = G.children[0]; this.neck0 = p.head ? p.head.position.clone() : new THREE.Vector3(0.02, 1.48, 0); this.fr = {}; this.want = ['talk']; this.cur = null; this.shown = false;
    this.disc = { x: at.x, z: at.z, r: 0.3, pp: 1 }; ev.K?.discs?.push(this.disc);
    this.entry = { x: at.x, z: at.z }; this.goal = o.stand || null; this.state = this.goal ? 'arrive' : 'shoot'; this.st = 0; this.shots = 0; this.flashT = 1.0 + Math.random() * 0.8;
    this.far = 0; this.walk = 0; this.hy = 0; this.kick = null; this._show(this.goal ? 'talk' : 'photo');
  }
  on() { return !this.gone && this.state !== 'leave' && this.state !== 'run'; }
  at() { return this.person.group.position; }
  dist() { const g = this.at(), P = this.ev.pos; return Math.hypot(g.x - P.x, g.z - P.z); }
  /** the frames a confrontation may want, queued (one is built a frame) */
  prep() { for (const k of ['talk', 'stagger', 'restrain']) if (!(k in this.fr) && !this.want.includes(k)) this.want.push(k); }
  _build() {
    const pose = this.want.shift(); if (!pose || pose in this.fr) return; let F = null;
    try { F = makePerson({ ...this.opts, pose, jitter: 0, headless: true }); } catch (e) { console.warn(`PapsConfront: no '${pose}' body`, e); }
    if (!F?.group) { this.fr[pose] = null; return; }
    if (F.head && F.head !== this.person.head) { F.head.parent?.remove(F.head); F.head.traverse((m) => { if (m.isMesh) m.geometry.dispose(); }); }
    // (his own materials - the night's lift, shaders compiled - so the frame is him; its own are never drawn)
    const P = this.person, own = new Map(); for (const k in F.mats || {}) if (P.mats?.[k]) own.set(F.mats[k], P.mats[k]);
    F.group.traverse((m) => { if (m.isMesh && own.has(m.material)) m.material = own.get(m.material); });
    for (const M of own.keys()) M.dispose();
    F.group.visible = false; F.group.position.set(0, 0, 0); F.group.rotation.set(0, 0, 0); P.group.add(F.group); try { this.ev._hostLit?.(F.group); } catch (_) { /* */ }
    this.fr[pose] = F;
  }
  /** which body he shows ('photo': his own, the camera up; any other a frame, the camera hanging at his chest) */
  _show(pose) {
    const F = pose === 'photo' ? null : this.fr[pose] || null; this.pose = F ? pose : 'photo';
    if (F !== this.cur || !this.shown) {
      this.shown = true; for (const k in this.fr) if (this.fr[k]) this.fr[k].group.visible = this.fr[k] === F;
      this.body0.visible = !F; const h = this.person.head, b = F ? (F.group.children.find((c) => c.isGroup) || F.group) : this.body0;
      if (h && b) { if (h.parent !== b) b.add(h); h.position.copy(F ? (F.neck || this.neck0) : this.neck0); }
      this.cur = F;
    }
    // (the camera: at his eye in 'photo', hanging on its strap otherwise - 'talk' with no frame yet keeps it up)
    const up = this.pose === 'photo' && pose !== 'talk', K = this.kit.group;
    if (up) { K.position.set(0.25, 1.53, 0); K.rotation.set(0, 0, 0); } else this.hang();
    this.kit.dot.visible = this.video && up;
  }
  /** the camera down on its strap (a frame of his, or the scuffle's bodies) */
  hang() { const K = this.kit.group; K.position.set(0.15, 1.08, 0.03); K.rotation.set(0, 0, -0.9); this.kit.dot.visible = false; }
  /** where his lens is, in the venue's frame -> Vector3 */
  lens(out = new THREE.Vector3()) {
    const G = this.person.group, ry = G.rotation.y, c = Math.cos(ry), s = Math.sin(ry), up = this.pose === 'photo', lx = up ? 0.42 : 0.2, ly = up ? 1.53 : 1.05;
    return out.set(G.position.x + lx * c, G.position.y + ly, G.position.z - lx * s);
  }
  _ok(x, z) { try { return this.ev._free(x, z, 0.26, this.disc); } catch (_) { return true; } }
  /** a step toward (gx, gz) at v m/s, round anything in the way -> arrived */
  _go(gx, gz, v, dt) {
    const g = this.at(), dx = gx - g.x, dz = gz - g.z, d = Math.hypot(dx, dz); if (d < 0.08) return true;
    const st = Math.min(d, v * dt), ux = dx / d, uz = dz / d; let mx = 0, mz = 0;
    if (this._ok(g.x + ux * st, g.z + uz * st)) { mx = ux * st; mz = uz * st; }
    else for (const sd of [1, -1]) { const x = g.x + (ux * 0.5 - uz * sd) * st, z = g.z + (uz * 0.5 + ux * sd) * st; if (this._ok(x, z)) { mx = x - g.x; mz = z - g.z; break; } }
    if (!mx && !mz) { this.stuck = (this.stuck || 0) + dt; return this.stuck > 2.5; }
    this.stuck = 0; g.x += mx; g.z += mz; this.walk += st; g.y = floorAt(this.ev, g.x, g.z) + 0.02 * Math.abs(Math.sin(this.walk * Math.PI / 0.7));
    this.person.group.rotation.y += wrap(facing(mx, mz) - this.person.group.rotation.y) * Math.min(1, dt * 8);
    return false;
  }
  _face(dt, k = 6) { const g = this.at(), P = this.ev.pos, G = this.person.group; G.rotation.y += wrap(facing(P.x - g.x, P.z - g.z) - G.rotation.y) * Math.min(1, dt * k); }
  /** one picture: the flash at his lens (the first one is the evening's own flash: the others glance, she minds) */
  shoot(first = this.shots === 0) {
    const ev = this.ev, p = this.lens(); this.shots++; if (this.enc) this.enc.n++;
    if (first && typeof ev._flash === 'function') { try { ev._flash(p, `A flash: ${this.name}, a photographer${this.cause ? ` - ${this.cause}` : ''}.`); } catch (e) { console.warn('PapsConfront: the flash', e); } }
    else { flashAt(ev, p, 0.7); if (ev.R) { ev.R.flashes = num(ev.R.flashes, 0) + 1; ev.R.seen = true; } }
    papsSeen(ev, p, this.personal ? 'personal' : 'flash', this);
  }
  set(state) { if (this.gone) return; this.state = state; this.st = 0; if (state === 'leave' || state === 'run') { this.video = false; this._show('talk'); this.goal = this._exitSpot(); } }
  _exitSpot() { const P = this.ev.pos, e = this.entry; if (Math.hypot(e.x - P.x, e.z - P.z) > 7) return { ...e }; return spotNear(this.ev, e, { min: 8, max: 22 }) || { ...e }; }
  update(dt) {
    if (this.gone) return; if (this.want.length) this._build(); if (this.busy) return;
    const ev = this.ev, P = ev.pos, g = this.at(), d = this.dist(); this.st += dt;
    if (this.kick) {   // (shoved: back a step, the stagger frame while it lasts)
      const K = this.kick; K.t += dt; const u = ss(K.t / 0.45), x = K.x0 + K.ux * 0.85 * u, z = K.z0 + K.uz * 0.85 * u; if (this._ok(x, z)) { g.x = x; g.z = z; }
      this.person.group.rotation.z = this.cur ? 0 : Math.sin(clamp(K.t / 0.6, 0, 1) * Math.PI) * 0.12;
      if (K.t > 0.9) { this.kick = null; this.person.group.rotation.z = 0; this._show(this.state === 'shoot' || this.state === 'film' ? 'photo' : 'talk'); } else this._show('stagger');
    } else if (this.state === 'arrive') {
      if (this._go(this.goal.x, this.goal.z, this.T.speed, dt) || this.st > 8) { this.goal = null; this.set('shoot'); this._show('photo'); this.flashT = 0.9; }
    } else if (this.state === 'shoot' || this.state === 'film') {
      // (he follows you about - a pushy one closely - and gives up if you stay out of his way long enough)
      const want = this.T.follow; this._face(dt);
      if (want && d > want && !this.enc && !ev.party?.exiting) { const k = (d - want * 0.7) / d; if (!this._go(g.x + (P.x - g.x) * k, g.z + (P.z - g.z) * k, this.T.speed, dt)) this._show('talk'); }
      else this._show('photo');
      this.far = d > 18 ? this.far + dt : 0;
      // (gone when you have shaken him off, he has his pictures, or the video has run long enough)
      if (!this.enc && (this.far > 15 || (this.shots >= this.T.shots && this.st > 4) || (this.state === 'film' && this.st > 14))) { this.set('leave'); return; }
      if (this.state === 'shoot' && !this.enc && !ev.game && !ev.moment && d < 16 && (this.flashT -= dt) <= 0) { this.shoot(); this.flashT = 3 + Math.random() * 4; }
    } else if (this.state === 'lower') { this._face(dt, 3); this._show('talk'); if (this.st > 2.6) this.set('leave'); }
    else if (this.state === 'grab') {   // (at your arm: a step in front of you, the grabbing frame)
      const fx = Math.cos(ev.yaw), fz = Math.sin(ev.yaw), tx = P.x + fx * 0.85, tz = P.z + fz * 0.85; if (Math.hypot(tx - g.x, tz - g.z) > 0.05) { g.x += (tx - g.x) * Math.min(1, dt * 8); g.z += (tz - g.z) * Math.min(1, dt * 8); }
      this._face(dt, 10); this._show('restrain');
    } else if (this.state === 'leave' || this.state === 'run') {
      if (this._go(this.goal.x, this.goal.z, this.state === 'run' ? 3.6 : 1.3, dt) || this.st > 10) { this.dispose(); return; }
    }
    // (his head: on you, except behind the camera)
    const h = this.person.head; if (h) { const ty = this.pose === 'photo' ? 0 : clamp(wrap(facing(P.x - g.x, P.z - g.z) - this.person.group.rotation.y), -1, 1); this.hy += (ty - this.hy) * Math.min(1, dt * 4); h.rotation.y = this.hy; }
    this.disc.x = g.x; this.disc.z = g.z;
  }
  dispose() {
    if (this.gone) return; this.gone = true; const ev = this.ev, G = this.person.group;
    const i = ev.K?.discs?.indexOf(this.disc); if (i >= 0) ev.K.discs.splice(i, 1);
    this._show('photo'); G.parent?.remove(G);
    for (const k in this.fr) { const F = this.fr[k]; if (!F) continue; G.remove(F.group); F.group.traverse((m) => { if (m.isMesh) m.geometry.dispose(); }); }
    this.fr = {}; try { this.kit.dispose(); } catch (_) { /* */ } try { this.person.dispose(); } catch (_) { /* */ }
  }
}
/** a flash at p (the venue's frame): the evening's flash sprite there, a touch of white, the shutter */
function flashAt(ev, p, scale = 0.7) {
  try { if (ev.paps && p) { ev.paps.position.copy(p); ev.paps.scale.setScalar(Math.max(scale, p.distanceTo?.(ev.pos) * 0.05 || scale)); ev.papT = 0; } } catch (_) { /* */ }
  try { ev.snd?.shutter?.(); } catch (_) { /* */ }
  const f = ev.$?.('.hg-flash'); if (!f) return; f.style.transition = 'none'; f.style.opacity = '0.06'; requestAnimationFrame(() => { f.style.transition = 'opacity .2s'; f.style.opacity = '0'; });
}
/**
 * Somewhere a photographer can stand: open floor (the room's own test) between min and max metres from you, as near
 * the candidate c as can be (o.hidden: out of your eyeline if it can, so he walks in; o.front: in front of you) -> {x, z} | null
 */
function spotNear(ev, c, o = {}) {
  const K = ev.K; if (!K?.areas?.length) return null;
  const P = ev.pos, min = o.min ?? 4, max = o.max ?? 13, fx = Math.cos(ev.yaw), fz = Math.sin(ev.yaw); let best = null, bs = Infinity;
  for (const a of K.areas) {
    const step = clamp(Math.max(a.x1 - a.x0, a.z1 - a.z0) / 28, 0.45, 1.2);
    for (let x = a.x0 + 0.4; x <= a.x1 - 0.4; x += step) for (let z = a.z0 + 0.4; z <= a.z1 - 0.4; z += step) {
      const d = Math.hypot(x - P.x, z - P.z); if (d < min || d > max) continue;
      let ok = false; try { ok = ev._free(x, z, 0.34); } catch (_) { ok = false; } if (!ok) continue;
      const v = ((x - P.x) * fx + (z - P.z) * fz) / d, s = (c ? Math.hypot(x - c.x, z - c.z) : d) + (o.hidden ? Math.max(0, v) * 5 : 0) + (o.front ? (1 - v) * 4 : 0) + Math.random() * 1.2;
      if (s < bs) { bs = s; best = { x, z }; }
    }
  }
  return best;
}
/** where one comes in: a long lens's own spot when it is on the floor, the door you came in by, the party's front door */
function entryOf(ev) {
  const V = ev.V || {}, P = ev.pos, C = [];
  for (const p of V.paps || []) if (p && num(p.y, 0) < 3 && Math.hypot(p.x - P.x, p.z - P.z) < 45) C.push(p);
  if (V.start) C.push(V.start); if (V.exits?.front) C.push(V.exits.front);
  return C.length ? pick(C) : null;
}
/** a private room (your flat, a private dining room, the quiet café): a lens from outside at most, never a man inside */
const closed = (ev) => clamp(num(ev.isParty ? ev.P?.privacy : ev.privacy, 0.4), 0, 1) >= 0.75;
/** a photographer comes in (cause: why, said aloud) -> the Pap | null */
function spawn(ev, cause, o = {}) {
  const S = S_(ev); if (ev.quiet || closed(ev) || !ev.scene || !ev.K || S.paps.filter((p) => p.on()).length >= 4) return null;
  const e = o.at || entryOf(ev), a = o.spot || spotNear(ev, e, { min: o.min ?? 7, max: o.max ?? 16, hidden: !o.front, front: !!o.front }) || spotNear(ev, null, { min: 3.5, max: 12 });
  if (!a) return null;
  const P = ev.pos, d = Math.hypot(a.x - P.x, a.z - P.z), k = d > 6.5 ? (d - 5) / d : 0;
  let stand = k ? { x: P.x + (a.x - P.x) * (1 - k), z: P.z + (a.z - P.z) * (1 - k) } : null; if (stand) { try { if (!ev._free(stand.x, stand.z, 0.3)) stand = spotNear(ev, a, { min: 3.5, max: 7 }); } catch (_) { stand = null; } }
  let pap = null; try { pap = new Pap(ev, a, { cause, stand, temper: o.temper }); } catch (e) { console.warn('PapsConfront: no photographer', e); return null; }
  S.paps.push(pap);
  if (o.say !== false) { const where = o.where || (pap.goal ? 'coming over' : 'by you'); try { ev._toast?.(`A photographer, ${where}, the lens on you${cause ? ` - ${cause}` : ''}.`, 'warn'); } catch (_) { /* */ } }
  if (!S.hint) { S.hint = true; setTimeout(() => { try { if (!ev.closing && live(ev) && !S.enc) ev._toast?.('P: walk up to the photographer and deal with it', ''); } catch (_) { /* */ } }, 2600); }
  return pap;
}
/** the photographer you mean: the nearest you are facing, close; else the nearest at all within reach (r m) */
function nearest(ev, r = 18, facingOnly = false) {
  const P = ev.pos, fx = Math.cos(ev.yaw), fz = Math.sin(ev.yaw); let best = null, bs = Infinity;
  for (const p of S_(ev).paps) {
    if (!p.on() || p.busy) continue; const g = p.at(), d = Math.hypot(g.x - P.x, g.z - P.z); if (d > r) continue;
    const v = d < 0.4 ? 1 : ((g.x - P.x) * fx + (g.z - P.z) * fz) / d; if (facingOnly && v < 0.6) continue;
    const s = d - v * 2; if (s < bs) { bs = s; best = p; }
  }
  return best;
}

// ---- the hooks ------------------------------------------------------------------------------------------------------
/** a lens has you (Hangout._flash, PartyPlay._flashDom, Affection's picture: why 'personal'). pap: whose lens */
export function papsSeen(ev, p = null, why = 'flash', pap = null) {
  if (!ON() || !ev) return;
  const C0 = ev.papsC, keep = C0 && C0.why === 'personal' && num(ev.t, 0) - num(C0.t, 0) < LIVE;
  ev.papsC = { t: num(ev.t, 0), at: p && Number.isFinite(+p.x) ? { x: +p.x, y: +(p.y ?? 1.6), z: +p.z } : C0?.at || null, why: keep ? 'personal' : why, n: num(C0?.n, 0) + 1, exit: false };
  if (why === 'personal') { const S = S_(ev); S.priv = { t: num(ev.t, 0), kind: 'photo' }; const q = pap || nearest(ev, 25); if (q) q.personal = true; }
}
/** an argument in public (a guest who has had enough of you, a row at the party): a private moment too - a lens
 *  that sees it has it as 'personal', and raised voices draw one in (cooldown and budget allowing) */
export function papsNote(ev, kind = 'row', g = null) {
  if (!ON() || !ev || ev.quiet || ev.closing) return;
  const S = S_(ev), again = S.priv && num(ev.t, 0) - S.priv.t < 3; S.priv = { t: num(ev.t, 0), kind, who: g?.first || null };
  if (again) return;   // (one argument, told by both the talk and the party's drama)
  const q = nearest(ev, 22); if (q) { q.personal = true; if (!q.enc && !q.busy) { q._show('photo'); q.shoot(q.shots === 0); try { ev._toast?.(`${q.name} got that${S.priv.who ? `: you and ${S.priv.who}` : ''}. Every second of it.`, 'warn'); } catch (_) { /* */ } } return; }
  if (num(ev.t, 0) < S.cool) return;
  const force = !!flag('__hangoutPaps') || !!flag('__partyPaps'), chance = clamp((S.k || pressure(ev).k) * 0.5, 0, 0.8);
  if (!force && Math.random() >= chance) return;
  const pap = spawn(ev, WHY_TXT.row); if (pap) { pap.personal = true; S.used++; }
}
/** Hangout._flash's lens: a photographer you can see (one steps in when there is none: the flash has a person behind it) -> Vector3 | null */
export function papsLens(ev) {
  if (!ON() || !ev || ev.quiet) return null;
  let pap = nearest(ev, 30); if (!pap) { pap = spawn(ev, null, { say: false }); if (pap) { pap.goal = null; pap.set('shoot'); pap._show('photo'); pap.shots = 1; pap.flashT = 3; } }
  return pap ? pap.lens() : null;
}
/** the prompt line: 'P Face <him>' near one, 'P The photographers' while any are about (or a flash was just now) */
export function papsPrompt(ev, html) {
  if (!ON() || !ev || ev.menu || ev.talk || ev.game || S_(ev).enc) return html;
  const n = nearest(ev, 2.8, true);
  if (n) return `${html ? html + ' ' : ''}<span><kbd>P</kbd>Face ${esc(n.name)}</span><small>${esc(n.agency)} · photographer</small>`;
  if (!live(ev)) return html;
  return `${html ? html + ' ' : ''}<span><kbd>P</kbd>The photographers</span>`;
}
/** Hangout's keydown, first: P while a photographer is about -> handled */
export function papsKey(ev, e) {
  if (!ON() || !ev || e.code !== 'KeyP') return false;
  if (e.repeat || busy(ev) || S_(ev).enc || !live(ev)) return false;
  try { e.stopImmediatePropagation(); } catch (_) { /* */ }
  encOpen(ev, nearest(ev, 2.8, true) || nearest(ev, 18)); return true;
}
/**
 * Every frame (Hangout._events): each photographer's own frame, the confrontation's, and the director - who comes when.
 * -> true while this module drives the photographers (Hangout keeps its own long-lens roll only when it is off)
 */
export function papsTick(ev, dt) {
  if (!ON() || !ev) return false;
  const S = S_(ev);
  for (const p of S.paps) { try { p.update(dt); } catch (e) { if (!S.err) { S.err = true; console.warn('PapsConfront: a photographer', e); } p.dispose(); } }
  if (S.paps.some((p) => p.gone)) S.paps = S.paps.filter((p) => !p.gone);
  try { encTick(ev, dt); } catch (e) { console.warn('PapsConfront: the confrontation', e); }
  if (ev.quiet || ev.closing || !ev.ready) return true;
  if (!S.plan) plan(ev);
  if (!S.hinted && S.budget >= 2 && num(ev.t, 0) > 8 && !busy(ev)) { S.hinted = true; ev._toast?.(`Photographers are about tonight: ${S.why[0] || WHY_TXT.tip}.`, ''); }
  if (S.enc || ev.game || ev.moment || ev.party?.exiting || num(ev.t, 0) < S.cool || S.used >= S.budget) return true;
  const t = num(ev.t, 0), h = num(ev.clock, 0), T = S.plan.find((x) => !x.done && (x.at != null ? t >= x.at : h >= x.clock && t > 20));
  if (T) { T.done = true; if (spawn(ev, T.cause)) S.used++; }
  return true;
}
/** the party's front door, photographed (PartyPlay's exit moment, as it starts): the photographers waiting there */
export function papsDoor(ev) {
  if (!ON() || !ev || ev.quiet) return;
  const S = S_(ev); if (S.paps.some((p) => p.on() && p.dist() < 7)) return;
  const a = spawn(ev, WHY_TXT.door, { front: true, min: 2.2, max: 5.5, say: false, temper: 'pushy' });
  if (a) { a.goal = null; a.set('shoot'); a._show('photo'); a.shots = 1; a.flashT = 0.6; }
  const b = spawn(ev, WHY_TXT.door, { front: true, min: 2.6, max: 6.5, say: false });
  if (b) { b.goal = null; b.set('shoot'); b._show('photo'); b.shots = 1; b.flashT = 1.4; }
}
/** the party's exit, photographed: the photographers at the door, the confrontation, then the night ends (done) -> taken over */
export function papsExit(ev, done) {
  if (!ON() || !ev || ev.closing) return false;
  papsDoor(ev);
  papsSeen(ev, ev.papsC?.at || null, ev.papsC?.why === 'personal' ? 'personal' : 'flash'); ev.papsC.exit = true;
  return !!encOpen(ev, nearest(ev, 9), { exit: true, done });
}
/** the confrontation's menu (kept for the dev lab and old callers): with the nearest photographer -> opened */
export function papsMenu(ev, done = null) { if (!ON() || !ev?._menu) return false; return !!encOpen(ev, nearest(ev, 18), { done }); }
/** what you did, without the menu (the test's way in): the open confrontation's next answer, else a new one's first */
export function papsAct(ev, kind) {
  if (!ON() || !ev) return;
  const S = S_(ev), E = S.enc || encOpen(ev, nearest(ev, 18), { quiet: true }); if (!E) return;
  if (ev.menu) { E.menu = false; ev._menuClose?.(false); }
  act(ev, E, kind);
}
/** Hangout.result: the night's confrontations into res.paps (one still open is settled as it stands) */
export function papsResultInto(ev, res) {
  if (!ON() || !res || !ev) return;
  const E = ev.papsS?.enc; if (E && !E.over) encEnd(ev, E, 'cut');
  if (Array.isArray(ev.papsR) && ev.papsR.length) res.paps = ev.papsR.slice(0, 8);
}
/** Hangout._dispose: every photographer out of the room, his bodies freed */
export function papsDispose(ev) { const S = ev?.papsS; if (!S) return; for (const p of S.paps) { try { p.dispose(); } catch (_) { /* */ } } S.paps = []; }
/** for tests (Hangout's api.paps): the night as the director has it, and a way to call one in */
export function papsLab(ev) {
  if (!ON() || !ev) return null; const S = S_(ev);
  return { k: +num(S.k, 0).toFixed(2), why: S.why.slice(), budget: S.budget, used: S.used, cool: S.cool, plan: (S.plan || []).map((x) => ({ ...x })),
    paps: S.paps.map((p) => ({ name: p.name, agency: p.agency, temper: p.temper, state: p.state, pose: p.pose, shots: p.shots, video: p.video, personal: p.personal, d: +p.dist().toFixed(2), at: { x: +p.at().x.toFixed(2), z: +p.at().z.toFixed(2) }, busy: p.busy })),
    enc: S.enc ? { heat: S.enc.heat, worst: S.enc.worst, step: S.enc.step, menu: S.enc.menu, video: S.enc.video, grabbed: S.enc.grabbed, scuffle: !!S.enc.scuffle } : null,
    R: (ev.papsR || []).slice(), spawn: (cause = 'test', o = {}) => !!spawn(ev, cause, o), act: (k) => papsAct(ev, k), clear: () => papsDispose(ev), note: (k = 'row') => papsNote(ev, k) };
}

// ---- the confrontation ------------------------------------------------------------------------------------------------
/** who might step in: security (the party's, a venue's staff), a driver you came with, your date, the car at the door */
function bystanders(ev, E) {
  const P = ev.pos, near = (q, r) => { const g = q?.person?.group?.position; return !!g && q.person.group.visible !== false && Math.hypot(g.x - P.x, g.z - P.z) < r; };
  const gs = (ev.gs || []).filter((q) => q.person && !q.gone);
  const sec = gs.find((q) => q.role === 'security' && near(q, 16)) || (near(ev.cast?.security, 16) ? ev.cast.security : null) || (ev.staff?.person && near(ev.staff, 14) ? { ...ev.staff, name: ev.staff.name || 'The manager', first: ev.staff.name || 'the manager', staff: true } : null);
  const friends = gs.filter((q) => q.kind === 'driver' && q.role !== 'security' && near(q, 9)).concat(gs.filter((q) => ['mate', 'friend', 'boss'].includes(q.role) && q.kind !== 'driver' && q.kind !== 'celeb' && near(q, 9))).slice(0, 2);
  const date = gs.find((q) => q.kind === 'celeb' && q.role !== 'dj' && near(q, 7)) || null;
  return { sec, friends, date, car: E.exit && !ev.party?.team };
}
function encOpen(ev, pap, o = {}) {
  const S = S_(ev); if (S.enc && !S.enc.over) return S.enc;
  const C = ev.papsC, grief = griefOf(ev) || C?.why === 'grief';
  const personal = !!(pap?.personal || (C?.why === 'personal' && fresh(ev)) || (S.priv && num(ev.t, 0) - S.priv.t < LIVE));
  const T = pap?.T || TEMPER.pro, story = !!ev.c?.pr?.crisis && !ev.c.pr.crisis.positive;
  const E = S.enc = { pap, t0: num(ev.t, 0), heat: T.heat + (story ? 10 : 0), step: 0, worst: 'ignore', calm: false, video: !!pap?.video, backup: 0, by: null, grabbed: false, grief, personal,
    exit: !!o.exit, done: o.done || null, n: (pap?.shots || 0) + (pap ? 0 : num(C?.n, 1)), line: null, cause: pap?.cause || null, over: false, result: null, menu: false, walk: null, scuffle: null };
  if (pap) { pap.enc = E; pap.prep(); if (pap.state === 'arrive') { pap.goal = null; pap.set('shoot'); } }
  if (!o.quiet) first(ev, E);
  return E;
}
/** a menu of the confrontation's (Hangout's own): Esc closing it is walking away */
function menu(ev, E, line, items) {
  const who = E.pap ? `${E.pap.name} · ${E.pap.agency}` : 'The photographers';
  E.menu = true; ev._menu(who, line, items.map((x) => x[0]), (i) => { E.menu = false; const f = items[i]?.[1]; if (f) f(); });
}
function first(ev, E) {
  const pap = E.pap, far = pap && pap.dist() > 2.8;
  const line = E.grief ? 'A long lens, this week of all weeks. He is still shooting.' : E.personal ? 'They got that. Of course they did. The shutter is still going.' : E.exit ? 'The photographers crowd the door, the flashes going.' : pap ? `${pap.name}, the lens right on you.` : 'A photographer, the lens right on you.';
  menu(ev, E, line, [['Ignore them', () => act(ev, E, 'ignore')], ['"Give me a minute"', () => act(ev, E, 'polite')], ['Tell them where to go', () => act(ev, E, 'cuss')], [far ? 'Walk over and push the camera away' : 'Push the camera away', () => act(ev, E, 'shove')]]);
}
/** your answer, and the room's (k: ignore | polite | cuss | shove | calm | more | walk) */
function act(ev, E, k) {
  if (E.over) return; const pap = E.pap;
  if (k === 'ignore') { ev._toast?.('You keep your head down and let them shoot.', ''); if (pap && pap.temper === 'pushy' && pap.T.follow) pap.T = { ...pap.T, follow: 4.5 }; encEnd(ev, E, 'ignore'); return; }
  if (k === 'walk') { ev._toast?.(pick(WALK), ''); encEnd(ev, E, 'walk'); return; }
  if (k === 'shove') { if (pap && pap.dist() > 1.6) walkUp(ev, E, () => shove(ev, E)); else shove(ev, E); return; }
  const say = k === 'polite' ? pick(POLITE) : k === 'calm' ? pick(CALM) : k === 'cuss' ? pick(E.grief ? CUSS_GRIEF : E.personal ? [...CUSS_PERSONAL, ...CUSS] : CUSS) : pick(MORE);
  ev._toast?.(`You: "${say}"`, k === 'cuss' || k === 'more' ? 'warn' : '');
  if (k === 'polite') { E.worst = worse(E.worst, 'polite'); E.heat -= 10; }
  else if (k === 'calm') { E.heat -= 25; E.calm = true; }
  else { E.worst = worse(E.worst, 'cuss'); E.heat += k === 'cuss' ? 20 : 15; if (!E.line) E.line = say; glance(ev, E); }
  later(ev, E, 1300, () => answer(ev, E, react(E, k), k));
}
/** everyone looks round (and, but for grief or a private moment, likes it less) */
function glance(ev, E, dm = 0) { try { for (const g of ev._present?.() || []) { g.glance = 2; if (E.pap) g.glanceAt = E.pap.at().clone(); if (dm && !E.grief && !E.personal) g.dm = num(g.dm, 0) - dm; } } catch (_) { /* */ } }
const later = (ev, E, ms, f) => setTimeout(() => { try { if (!E.over && !ev.closing && !ev.disposed) f(); } catch (e) { console.warn('PapsConfront', e); } }, ms);
/** his answer, by his temper, the night and what you just did -> back | film | backup | grab | run */
function react(E, k) {
  const f = flag('__papsReact'); if (REACT.includes(f) && (f !== 'grab' || E.pap)) return f;
  const T = E.pap?.temper || 'pro', g = E.grief ? 0.3 : 0, pe = E.personal ? 0.12 : 0, I = { timid: 0, pro: 1, pushy: 2 }[T], h = E.heat;
  const W = {
    polite: { back: [0.8, 0.6, 0.3][I] + g + pe - h / 300, film: 1 },
    calm: { back: [0.75, 0.55, 0.35][I] + g - Math.max(0, h) / 400, film: 1 },
    cuss: { back: [0.45, 0.15, 0.05][I] + g, film: [0.5, 0.6, 0.5][I], backup: [0, 0.15, 0.3][I], grab: h > 60 ? [0, 0, 0.12][I] : 0 },
    more: { back: [0.4, 0.12, 0.04][I] + g, film: [0.4, 0.55, 0.45][I], backup: [0, 0.12, 0.2][I], grab: h > 55 ? [0, 0.06, 0.3][I] : 0 },
    shove: { run: [0.65, 0.25, 0.08][I] + g, film: [0.35, 0.6, 0.35][I], backup: [0, 0.1, 0.15][I], grab: [0, 0.05, 0.42][I] },
  }[k] || { film: 1 };
  if (!E.pap) delete W.grab; if (E.backup) delete W.backup;
  let s = 0; for (const v of Object.values(W)) s += Math.max(0, v); let u = Math.random() * s;
  for (const [r, v] of Object.entries(W)) { u -= Math.max(0, v); if (u <= 0) return r; }
  return 'film';
}
function answer(ev, E, r, k) {
  const pap = E.pap, F = (a) => fill(pick(a), pap);
  if (r === 'back') { ev._toast?.(F(E.grief ? BACK.grief : k === 'calm' ? BACK.calm : BACK.polite), ''); if (k === 'polite' || k === 'calm') E.calm = true; pap?.set('lower'); later(ev, E, 900, () => encEnd(ev, E, 'back')); return; }
  if (r === 'run') { ev._toast?.(F(RUN), 'warn'); pap?.set('run'); later(ev, E, 900, () => encEnd(ev, E, 'run')); return; }
  if (r === 'grab') { grab(ev, E); return; }
  if (r === 'backup') { ev._toast?.(F(BACKUP), 'warn'); E.backup += backup(ev, E); }
  else { ev._toast?.(F(FILM[k] || FILM.cuss), k === 'polite' ? '' : 'warn'); if (k !== 'polite') E.video = true; }
  if (pap && k !== 'polite') { pap.video = true; pap.set('film'); pap._show('photo'); }
  if (k === 'calm') { later(ev, E, 1200, () => { ev._toast?.('He keeps rolling, but you have said your piece. You leave it.', ''); encEnd(ev, E, 'calm'); }); return; }
  later(ev, E, 1100, () => escalate(ev, E));
}
/** two more come running (he called them), into spots near him -> how many */
function backup(ev, E) {
  let n = 0; const at = E.pap ? E.pap.at() : ev.pos;
  for (let i = 0; i < 2; i++) { const p = spawn(ev, 'he called them', { at: { x: at.x, z: at.z }, min: 3, max: 9, say: false, temper: 'pro' }); if (p) { p.video = true; p.enc = E; n++; } }
  return n || 1;
}
/** what now: say sorry, keep at him, push the camera, let someone take you away, walk */
function escalate(ev, E) {
  E.step++; const pap = E.pap, B = bystanders(ev, E), far = pap && pap.dist() > 2.8, items = [];
  items.push([`"${pick(CALM)}"`, () => act(ev, E, 'calm')]);
  if (E.step < 4) items.push(['Keep at him', () => act(ev, E, 'more')]);
  if (E.worst !== 'shove') items.push([far ? 'Walk over and push the camera away' : 'Push the camera away', () => act(ev, E, 'shove')]);
  const by = bystander(ev, E, B); if (by) items.push(by);
  items.push(['Walk away', () => act(ev, E, 'walk')]);
  if (B.date && !E.dateSaid) { E.dateSaid = true; ev._toast?.(`${B.date.first}: "${pick(['Hey. Hey - leave it. Please.', 'It\'s not worth it. Come on.', 'Look at me, not him. Let\'s go.'])}"`, ''); }
  const line = E.video ? `${pap ? pap.name : 'He'} is filming now, the red light on, waiting for the next thing you say.` : E.backup ? 'Three lenses now. They are all waiting for you.' : `${pap ? pap.name : 'He'} is still shooting.`;
  menu(ev, E, line, items.slice(0, 6));
}
/** the one who can take you out of it, as a menu item -> [label, fn] | null */
function bystander(ev, E, B) {
  const off = (who, line) => () => { E.by = who; ev._toast?.(line, 'up');   // (taken out of it - not words taken back)
    E.pap?.set(E.pap.temper === 'pushy' ? 'shoot' : 'lower'); later(ev, E, 600, () => encEnd(ev, E, 'by')); };
  if (B.car) return ['Get in the car', off('driver', 'Your driver has the door open. "In you get. Leave them to it." The door shuts on the flashes.')];
  if (B.date) return [`Let ${B.date.first} take you away`, off(B.date.first, `${B.date.first} takes your hand and steers you away from the lens.`)];
  if (B.friends[0]) return [`Let ${B.friends[0].first} pull you away`, off(B.friends[0].first, `${B.friends[0].first} gets between you and the camera. "Leave it. He wants this."`)];
  if (B.sec) return [B.sec.staff ? `Ask ${B.sec.first} to deal with him` : 'Get security', () => { E.by = 'security'; ev._toast?.(`${B.sec.staff ? B.sec.first : 'Security'} walks ${E.pap ? E.pap.name : 'the photographer'} out, a hand on his shoulder.`, 'up'); E.pap?.set('leave'); later(ev, E, 600, () => encEnd(ev, E, 'by')); }];
  return null;
}
/** he grabs your arm: pull free, shove him off (the scuffle), or let someone deal with it */
function grab(ev, E) {
  const pap = E.pap; E.grabbed = true; E.heat += 15; pap?.set('grab'); ev._toast?.(fill(pick(GRAB), pap), 'warn');
  const B = bystanders(ev, E), items = [['Pull free and walk away', () => { ev._toast?.('You twist your arm free and walk. He is still shouting after you.', ''); pap?.set('film'); encEnd(ev, E, 'free'); }]];
  if (!realOf(ev) && pap) items.push(['Shove him off', () => scuffle(ev, E)]);
  const by = bystander(ev, E, B); if (by) items.push(by);
  if (B.sec && !B.sec.staff) ev._toast?.('Security has seen it, and is on the way over.', '');
  later(ev, E, 700, () => menu(ev, E, `${pap ? pap.name : 'He'} has your arm, his face a foot from yours. The camera is still running on its strap.`, items));
}
/** across to him first (a shove needs a hand on the lens): a few steps, the eye on him */
function walkUp(ev, E, then) {
  const g = E.pap.at(), P = ev.pos, d = Math.hypot(g.x - P.x, g.z - P.z), ux = (g.x - P.x) / d, uz = (g.z - P.z) / d;
  E.walk = { x0: P.x, z0: P.z, x1: g.x - ux * 0.95, z1: g.z - uz * 0.95, t: 0, dur: clamp(d / 3.2, 0.35, 2.2), then };
  try { ev.keys?.clear?.(); } catch (_) { /* */ }
}
/** your arm out, the camera pushed away, him back a step */
function shove(ev, E) {
  const pap = E.pap; E.worst = worse(E.worst, 'shove'); E.heat += 30;
  ev._toast?.(fill(pick(SHOVE), pap), 'warn'); try { shoveArmAnim(ev); } catch (e) { console.warn('PapsConfront: the shove', e); }
  if (pap) { const g = pap.at(), P = ev.pos, d = Math.hypot(g.x - P.x, g.z - P.z) || 1; pap.kick = { t: 0, x0: g.x, z0: g.z, ux: (g.x - P.x) / d, uz: (g.z - P.z) / d }; }
  glance(ev, E, 0.5);
  later(ev, E, 1100, () => answer(ev, E, react(E, 'shove'), 'shove'));
}
/** the scuffle: ui/Brawl.js through ui/PartyBrawl.js - him, the people who pull you apart, nobody hurt */
function scuffle(ev, E) {
  const pap = E.pap; if (!pap?.person || ev.game) { encEnd(ev, E, 'free'); return; }
  const B = bystanders(ev, E), seps = [];
  if (B.sec?.person?.head) seps.push({ name: B.sec.name || 'Security', kind: 'security', person: B.sec.person, opts: B.sec.opts || B.sec.look || {}, holds: 'tgt', disc: B.sec.disc || null });
  for (const q of B.friends) if (q.person?.head) seps.push({ name: q.first, kind: q.role === 'mate' ? 'mate' : q.role === 'boss' ? 'boss' : 'friend', person: q.person, opts: q.opts || {}, holds: 'you', disc: q.disc || null });
  const others = S_(ev).paps.filter((p) => p !== pap && p.on() && !p.busy && p.dist() < 10).slice(0, 2);
  for (const o of others) { o._show('photo'); o.busy = true; seps.push({ name: o.name, kind: 'crew', person: o.person, opts: o.opts, holds: 'tgt', disc: o.disc }); }
  // (the people in it are the scuffle's while it plays: Hangout's own turning of heads leaves them alone)
  const stash = (ev.gs || []).filter((q) => q.person && seps.some((s) => s.person === q.person)); for (const q of stash) { q._pcPerson = q.person; q.person = null; }
  let sleeve = null; try { const m = ev.me?.mats || {}; const k = ['top', 'shirt', 'jacket', 'cloth', 'suit'].find((x) => m[x]?.color); if (k) sleeve = '#' + m[k].color.getHexString(); } catch (_) { /* */ }
  pap.state = 'shoot'; pap.kick = null; pap.person.group.rotation.z = 0; pap._show('photo'); pap.hang(); pap.busy = true;
  const undo = () => { for (const q of stash) if (q._pcPerson) { q.person = q._pcPerson; q._pcPerson = null; } for (const o of others) o.busy = false; pap.busy = false; pap.shown = false; pap._show('talk'); };
  try {
    E.scuffle = new PartyBrawl({ ev, foe: { name: pap.name, person: pap.person, opts: pap.opts, cid: null, disc: pap.disc }, started: true, seps, qte: 1, sleeve, lines: PAPS_LINES,
      onDone: (out) => { E.sOut = out || { aborted: true }; setTimeout(() => scuffleDone(ev, E, E.sOut, undo), 0); } });   // (its outcome kept now: Hangout drops the game this same frame)
    E.undo = undo; ev.game = E.scuffle; ev.helpT = 0; const h = ev.$?.('.hg-help'); if (h) h.style.opacity = '0'; ev.$?.('.hg-prompt')?.classList.remove('in'); ev.prHtml = null;
  } catch (e) { console.warn('PapsConfront: the scuffle could not start', e); undo(); E.scuffle = null; encEnd(ev, E, 'free'); }
}
function scuffleDone(ev, E, out, undo) {
  if (E.sDone) return; E.sDone = true; try { undo?.(); } catch (_) { /* */ }
  const pap = E.pap, o = out || { aborted: true };
  if (!o.aborted) {
    E.result = o.result || 'even'; E.worst = o.walkedAway ? worse(E.worst, 'shove') : 'scuffle'; E.video = true; if (o.separators?.length) E.by = o.separators[0];
    ev._toast?.(o.walkedAway ? 'You walk away before it goes any further. He is still filming.' : o.separators?.length ? `${o.separators[0]} pulls you apart. ${pap.name} is hustled off down the street, still shouting.` : `It is over in seconds. ${pap.name} backs off, still filming.`, o.walkedAway ? '' : 'warn');
  }
  pap?.set(o.walkedAway ? 'film' : 'run'); encEnd(ev, E, 'scuffle');
}
/** the confrontation's own frame: the walk across to him, the menu closed with Esc, a scuffle someone else ended */
function encTick(ev, dt) {
  const E = S_(ev).enc; if (!E || E.over) return;
  if (E.walk) {
    const W = E.walk, P = ev.pos; W.t += dt; const u = ss(W.t / W.dur); P.x = W.x0 + (W.x1 - W.x0) * u; P.z = W.z0 + (W.z1 - W.z0) * u;
    const g = E.pap?.at(); if (g) ev.yaw += wrap(Math.atan2(g.z - P.z, g.x - P.x) - ev.yaw) * Math.min(1, dt * 8);
    if (W.t >= W.dur) { E.walk = null; W.then(); }
    return;
  }
  if (E.menu && !ev.menu) { E.menu = false; act(ev, E, E.step ? 'walk' : 'ignore'); return; }   // (Esc: you walk away)
  if (E.scuffle && !E.sDone && !E.sOut && ev.game !== E.scuffle) scuffleDone(ev, E, { aborted: true }, E.undo);   // (the night ended it before it finished)
}
/** it is over: what happened goes in the night's record; the photographers keep away for a while */
function encEnd(ev, E, how) {
  if (E.over) return; E.over = true; const S = S_(ev); if (S.enc === E) S.enc = null;
  if (E.menu && ev.menu) { try { ev._menuClose?.(); } catch (_) { /* */ } } E.menu = false;
  // (his hand off your arm: he films you going; anyone still filming runs the clip out a while, then goes)
  for (const p of S.paps) if (p.enc === E) { p.enc = null; if (p.state === 'grab') { p.set('film'); p._show('photo'); } }
  const R = ev.papsR || (ev.papsR = []);
  R.push({ kind: E.worst, calm: !!E.calm, video: !!E.video, backup: E.backup, by: E.by, grabbed: !!E.grabbed, grief: !!E.grief, personal: !!E.personal, n: Math.max(1, num(E.n, 1)), exit: !!E.exit, line: E.line, cause: E.cause, temper: E.pap?.temper || null, result: E.result, how });
  S.cool = num(ev.t, 0) + ({ scuffle: 300, shove: 240, cuss: 150, polite: 90, ignore: 60 }[E.worst] || 60);
  if (E.done) setTimeout(() => { try { E.done(); } catch (e) { console.warn('PapsConfront: done', e); } }, how === 'cut' ? 0 : 1500);
}
/** your arm, pushing the lens away (first person: People.shoveArm at the eye) */
function shoveArmAnim(ev) {
  const cam = ev.cam; let root = ev.scene; if (!cam || !root) return; while (root.parent) root = root.parent;
  const rig = new THREE.Group(); rig.matrixAutoUpdate = false; let arm = null;
  try { arm = shoveArm('#2b2e35', '#e3b994', false); arm.group.matrixAutoUpdate = true; rig.add(arm.group); arm.group.traverse((o) => { if (o.isMesh) o.frustumCulled = false; }); root.add(rig); } catch (e) { return; }
  try { ev.snd?.hit?.(140, 0.12, 0.2, 1); } catch (_) { /* */ }
  const t0 = performance.now(), M = new THREE.Matrix4();
  const step = () => {
    const s = (performance.now() - t0) / 1000, u = s < 0.04 ? 0 : s < 0.14 ? ss((s - 0.04) / 0.1) : s < 0.3 ? 1 : 1 - ss((s - 0.3) / 0.2);
    rig.matrix.multiplyMatrices(cam.matrixWorld, M.identity()); rig.matrixWorldNeedsUpdate = true; arm.set?.(u); rig.visible = s < 0.55;
    if (s < 0.6 && !ev.closing) { requestAnimationFrame(step); return; }
    rig.parent?.remove(rig); try { arm?.dispose?.(); } catch (_) { /* */ }
  };
  requestAnimationFrame(step);
}
try { if (flag('__papsOn') === true) window.__papsLab = { papsFallout: (c, r) => papsFallout(c, r), papsTick: (e, d) => papsTick(e, d), papsMenu: (e, d) => papsMenu(e, d) }; } catch (_) { /* */ }   // (the dev lab's handle, only with its switch)

// ---- the press (career): c.pr directly - a grave week's sympathy is printed too, where prEvent would stay silent -------
const graveNow = (c) => !!c?.pr?.ctx?.grave || (Array.isArray(c?.lost) && c.lost.some((l) => l && l.season === c.season && l.round >= c.round - 1));
// (what each comes to, by why: image, heat, followers share. 'calm' is a polite word; 'cooled' is words taken back)
const FX = {
  calm: { grief: [3, -2, 0.002], personal: [2, 0, 0.001], hounded: [1, 0, 0], unprovoked: [1, 0, 0] },
  cooled: { grief: [2, 1, 0.002], personal: [0, 3, 0.002], hounded: [-1, 4, 0.002], unprovoked: [-2, 5, 0.001] },
  cuss: { grief: [3, 4, 0.004], personal: [-1, 6, 0.003], hounded: [-3, 9, 0.003], unprovoked: [-6, 12, 0.002] },
  shove: { grief: [1, 8, 0.006], personal: [-3, 12, 0.004], hounded: [-7, 16, 0.004], unprovoked: [-12, 22, 0.003] },
  scuffle: { grief: [-1, 12, 0.008], personal: [-6, 18, 0.006], hounded: [-10, 22, 0.006], unprovoked: [-16, 28, 0.005] },
};
// (the headlines: never a pronoun for you - the save does not say which - and grief never the joke)
const HL = {
  calm: { grief: [['f1news', '{name} quietly asks photographers for space in a week of mourning', 1]], personal: [['feed', '"Give me a minute": {sur} keeps it classy with the photographers', 1]], hounded: [['feed', '{sur} stays polite as the photographers swarm', 1]], unprovoked: [['feed', '{sur} asks the photographers for a minute', 0]] },
  cooled: { grief: [['feed', 'A sharp word, then an apology: a grieving {sur} and the long lens', 1]], personal: [['feed', 'Heated, then sorry: {sur} and the photographer who got too close', 0]], hounded: [['feed', 'A heated word, then an apology: {sur} and the photographers', 0]], unprovoked: [['post', '{SUR} SNAPS AT PHOTOGRAPHER - THEN SAYS SORRY', 0]] },
  cuss: {
    grief: [['f1news', '"Have some respect": a grieving {name} turns on a long lens - and the paddock is on side', 1], ['post', '{SUR} SNAPS AT PHOTOGRAPHER IN WEEK OF MOURNING', 0], ['feed', 'Fans rally round {sur} after a photographer followed the grieving driver', 1]],
    personal: [['post', '{SUR} LOSES IT WITH PHOTOGRAPHERS AFTER PRIVATE MOMENT', -1], ['feed', '"That was private": fans side with {sur} over the long lens', 1]],
    hounded: [['post', '{SUR}\'S FOUL-MOUTHED RANT AT PHOTOGRAPHERS', -1], ['feed', 'Fans split over {sur} rant: "they were on that driver all night"', 0]],
    unprovoked: [['post', '{SUR}\'S FOUL-MOUTHED RANT AT PHOTOGRAPHERS', -1], ['race24', '{name} caught on camera swearing at photographers', -1]],
  },
  shove: {
    grief: [['f1news', 'The paddock stands by {name} after a photographer followed the grieving driver', 1], ['post', '{SUR} PUSHES CAMERA AWAY IN WEEK OF MOURNING', 0], ['race24', 'Calls for the agencies to give grieving drivers space', 1]],
    personal: [['post', '{SUR} SHOVES CAMERA AFTER PRIVATE MOMENT SNAPPED', -1], ['race24', 'Was {sur} wrong to push the camera away? The debate rages', 0]],
    hounded: [['post', '{SUR} SHOVES PHOTOGRAPHER AFTER NIGHT OF FLASHES', -1], ['f1news', '{name} under pressure after an altercation with a photographer', -1]],
    unprovoked: [['post', '{SUR} SHOVES PHOTOGRAPHER', -1], ['f1news', '{name} under pressure after an altercation with a photographer', -1], ['race24', 'Footage shows {name} pushing a photographer', -1]],
  },
  scuffle: {
    grief: [['f1news', 'A grieving {name} is pulled away from a photographer; the paddock asks the agencies for space', 0], ['post', '{SUR} IN SCUFFLE WITH PHOTOGRAPHER IN WEEK OF MOURNING', 0]],
    personal: [['post', '{SUR} GRAPPLES WITH PHOTOGRAPHER AFTER PRIVATE MOMENT', -1], ['race24', 'Pulled apart: {sur} and a photographer', -1]],
    hounded: [['post', 'HANDBAGS ON THE PAVEMENT: {SUR} AND THE PHOTOGRAPHERS', -1], ['f1news', '{name} separated from a photographer after a night of flashes', -1]],
    unprovoked: [['post', '{SUR} IN SCUFFLE WITH PHOTOGRAPHER', -1], ['f1news', '{name} faces questions after a scuffle with a photographer', -1], ['race24', 'Footage shows {name} grappling with a photographer', -1]],
  },
};
const VIRAL = {
  grief: ['feed', 'The clip of a long lens following a grieving {sur} has the internet on the driver\'s side', 1],
  personal: ['feed', 'Millions have now watched {sur} and the photographer - and most say: fair enough', 0],
  hounded: ['feed', 'The clip of {sur} and the photographers passes ten million views', 0],
  unprovoked: ['feed', 'The clip of {sur} and the photographer passes ten million views. Not the good kind', -1],
};
const GRABBED = ['feed', 'New angle: the photographer grabbed {sur} first', 1];
const COMPLAINT = { grief: 0.03, personal: 0.08, hounded: 0.15, unprovoked: 0.25 };
/**
 * The evening's photographers in the press (CareerHub, after hangoutResult / partyResult): r.paps from the scene ->
 * lines for the evening's summary. The worst of the night decides: a calm exit (a polite word, or words taken back),
 * words, a shove, a scuffle; footage that went viral (he was filming, or his backup was) adds heat and followers; a
 * shove or a scuffle can bring an assault complaint (less likely when he grabbed you first). A shove or a scuffle that
 * was neither grief nor a private moment - or viral words, unprovoked - is a story to answer on the PR page (the 'paps'
 * crisis). window.__papsComplaint / __papsViral force those (tests).
 */
export function papsFallout(c, r) {
  const out = []; if (!ON() || !c || !Array.isArray(r?.paps)) return out;
  const acts = r.paps.filter((a) => a && a.kind && a.kind !== 'ignore'); if (!acts.length) return out;
  let P = null; try { P = prEnsure(c); } catch (_) { P = c.pr || null; } if (!P || !Array.isArray(P.feed)) return out;
  const worst = acts.reduce((w, a) => (LVL[a.kind] > LVL[w] ? a.kind : w), 'polite');
  const grief = acts.some((a) => a.grief) || graveNow(c), personal = acts.some((a) => a.personal), grabbed = acts.some((a) => a.grabbed);
  const hounded = grabbed || acts.some((a) => num(a.n, 1) >= 3 || a.exit || num(a.backup, 0) > 0);
  const why = grief ? 'grief' : personal ? 'personal' : hounded ? 'hounded' : 'unprovoked';
  const cooled = worst === 'cuss' && acts.filter((a) => a.kind === 'cuss').every((a) => a.calm);
  const lvl = worst === 'polite' ? 'calm' : cooled ? 'cooled' : worst;
  // (a real driver as the player: in the papers as their team's driver, as PR's own personal stories have it)
  const meD = c.drivers?.[c.playerId], real = isRealD(meD), team = c.teams?.[meD?.team]?.name || meD?.team || 'the team';
  const me = real ? `the ${team} driver` : meD?.name || 'The driver', sur = real ? `the ${team} driver` : String(me).split(' ').slice(-1)[0];
  const T = (s) => { const t = s.replace(/\{name\}/g, me).replace(/\{sur\}/g, sur).replace(/\{SUR\}/g, sur.toUpperCase()); return t.charAt(0).toUpperCase() + t.slice(1); };
  let [di, dh, df] = FX[lvl][why]; if (grabbed && di < 0) di = Math.round(di * 0.5);
  const i0 = num(P.image, 0), h0 = num(P.heat, 0), f0 = num(P.fame, 1);
  const put = (d) => { P.image = Math.round(clamp(num(P.image, 0) + num(d.i, 0), -100, 100) * 10) / 10; P.heat = Math.round(clamp(num(P.heat, 0) + num(d.h, 0), 0, 100) * 10) / 10; if (d.f) P.fame = Math.max(0.05, num(P.fame, 1) * (1 + d.f)); };
  const feed = (h) => P.feed.unshift({ season: c.season, round: c.round, outlet: h[0], text: T(h[1]), tone: h[2], kind: 'paps' });
  put({ i: di, h: dh, f: df });
  const H = HL[lvl][why], printed = lvl === 'calm' && why === 'unprovoked' && Math.random() < 0.5 ? [] : H;
  for (let i = printed.length - 1; i >= 0; i--) feed(printed[i]);
  if (printed[0]) out.push(`In the papers: "${T(printed[0][1])}"`);
  if (grabbed && LVL[worst] >= LVL.cuss) { feed(GRABBED); put({ i: 2 }); out.push('Another angle shows the photographer grabbing you first. It helps.'); }
  // (the footage: his video, his backup's, a phone in the crowd - the worse it was, the further it goes)
  const video = acts.some((a) => a.video || num(a.backup, 0) > 0), fame = (() => { try { return fameIndex(P.fame); } catch (_) { return 40; } })();
  const viral = LVL[worst] >= LVL.cuss && !cooled && (!!flag('__papsViral') || Math.random() < (video ? 0.5 : 0.12) * (0.5 + fame / 100) * (worst === 'scuffle' ? 1.5 : 1));
  if (viral) { feed(VIRAL[why]); put({ i: why === 'grief' ? 3 : why === 'personal' ? 0 : grabbed ? 1 : -3, h: 8, f: 0.012 }); out.push(why === 'grief' ? 'The clip has gone round the world - and almost everyone is on your side.' : 'The footage has gone viral: millions of views by the morning.'); }
  // (a story to answer: a shove or a scuffle you had no reason for, or words that went round the world)
  if ((LVL[worst] >= LVL.shove && (why === 'hounded' || why === 'unprovoked')) || (viral && why === 'unprovoked')) {
    try {
      const K = crisisFrom(c, 'paps', { source: worst === 'scuffle' ? 'scuffle' : LVL[worst] >= LVL.shove ? 'shove' : 'viral', track: r.track || undefined });
      if (K && (K.kind === 'paps' || (K.also || []).some((t) => /photographer/i.test(String(t))))) out.push(`A story to answer on the PR page: ${K.kind === 'paps' ? K.story : 'the photographer, folded into the story already running'}.`);
    } catch (e) { console.warn('PapsConfront: the crisis', e); }
  }
  if (LVL[worst] >= LVL.shove && (flag('__papsComplaint') || Math.random() < COMPLAINT[why] * (worst === 'scuffle' ? 1.6 : 1) * (grabbed ? 0.4 : 1))) {
    put({ h: 8, i: grief ? 0 : -3 });
    P.feed.unshift({ season: c.season, round: c.round, outlet: 'post', text: T(grief ? 'Photographer files complaint against grieving {sur}' : 'PHOTOGRAPHER FILES ASSAULT COMPLAINT AGAINST {SUR}'), tone: -1, kind: 'paps' });
    out.push('The photographer has made a complaint to the police. Your lawyers expect it to go nowhere, but it is in the papers.');
  }
  // (what it all came to, the complaint's share too)
  const fxl = [Math.round((P.image - i0) * 10) / 10, Math.round((P.heat - h0) * 10) / 10], fl = num(P.fame, 1) - f0;
  const fxt = [fxl[0] ? `image ${fxl[0] > 0 ? '+' : ''}${fxl[0]}` : '', fxl[1] ? `heat ${fxl[1] > 0 ? '+' : ''}${fxl[1]}` : '', fl > 0.0005 ? `followers +${(fl * 100 / Math.max(0.05, f0)).toFixed(1)}%` : ''].filter(Boolean).join(', ');
  if (fxt) out.push(why === 'grief' && lvl !== 'calm' ? `The photographers: most of the press is on your side this week (${fxt}).` : `The photographers: ${fxt}.`);
  if (P.feed.length > 60) P.feed.length = 60;
  return out;
}
