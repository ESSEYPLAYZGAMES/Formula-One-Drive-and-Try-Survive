// ui/PapsConfront.js - the photographers who follow you (an evening out, the after-party): once a lens has had you - a
// flash at a hangout, the wall or the exit at a party, a picture of a hug or a kiss (Affection), a long lens outside in a
// grave week - P (or the exit's own menu) offers four answers: ignore them, ask for a minute, tell them where to go, or
// push the camera away (your arm, his stagger back - nobody is hurt). papsFallout (CareerHub, after the evening) takes it
// to the press through c.pr: the words make a 'rant' story, the shove a bigger one (and now and then a complaint) - far
// gentler, sometimes sympathetic, when you were grieving or it followed a private moment, harsher when it was unprovoked.
// The photographers are invented people. Grief is never the joke: its lines are about the intrusion, never the loss.
// Everything is behind PAPS_CONFRONT_ON; the hooks in Hangout / PartyPlay / Affection / CareerHub are null-safe one-liners.
import * as THREE from 'three';
import { makePerson, shoveArm } from '../world/People.js';
import { prEnsure, crisisFrom } from '../career/PR.js';

export const PAPS_CONFRONT_ON = true;

const pick = (a) => a[(Math.random() * a.length) | 0];
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ss = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
const flag = (k) => { try { return window[k] ?? null; } catch (_) { return null; } };
const LIVE = 40;   // (seconds a lens stays 'on you' after a flash)
const ON = () => PAPS_CONFRONT_ON || flag('__papsOn') === true;   // (window.__papsOn: the dev lab's switch while the flag is off)

const POLITE = ['Give me a minute, yeah? Please.', 'Not tonight, guys. Come on.', 'Can you give us some space? Thank you.'];
const CUSS = ['Get that fucking camera out of my face.', 'Are you serious? Piss off. Now.', 'Back off, mate. I mean it. Fuck off.', 'Have some fucking decency.', 'Christ. Leave us alone, will you?'];
const CUSS_GRIEF = ['Not this week. Have some fucking respect.', 'Do you have any idea what this week is? Get out of here.', 'Put it down. Just put the fucking camera down.'];
const CUSS_PERSONAL = ['That was private. Fuck off.', 'Seriously? That was nothing to do with you. Back off.'];
const SHOVE = ['You put a hand on the lens and push it away. He stumbles back a step, the camera swinging on its strap.', 'You shove the camera aside. He staggers back, finds his feet, and keeps his distance.'];
const BACK = {
  polite: ['"Alright, alright." He lowers the camera - for now.', 'A shrug. He steps back, the lens down.'],
  cuss: ['"Just doing my job, mate." The shutter keeps going.', 'He fires off three more frames, and smiles.', '"Lovely. Say that again for the video?"'],
  shove: ['"Did you get that?" he shouts to someone behind you.', '"That\'s assault, that is!" He is still shooting.'],
  grief: ['He lowers the camera, and for a moment even he looks away.', 'He hesitates, then backs off into the street.'],
};

// (anyone with a camera counts as a photographer: a party night, a club, or any place with its own pap - there P works
//  at any time, not only just after a flash)
const cams = (ev) => !!(ev?.isParty || ev?.paps || ev?.V?.club || ev?.P?.club || ev?.occ === 'club' || ev?.occ === 'pool');
const fresh = (ev) => !!ev?.papsC && !ev.papsC.done && num(ev.t, 0) - num(ev.papsC.t, -99) < LIVE;
const live = (ev) => fresh(ev) || cams(ev);
const griefOf = (ev) => !!(ev?.quiet || ev?.x?.grave);

/** a lens has you (Hangout._flash, PartyPlay._flashDom, Affection's picture: why 'personal'; the grave week's: 'grief') */
export function papsSeen(ev, p = null, why = 'flash') {
  if (!ON() || !ev) return;
  const C0 = ev.papsC, keep = C0 && !C0.done && C0.why === 'personal' && num(ev.t, 0) - num(C0.t, 0) < LIVE;
  ev.papsC = { t: num(ev.t, 0), at: p && Number.isFinite(+p.x) ? { x: +p.x, y: +(p.y ?? 1.6), z: +p.z } : C0?.at || null, why: keep ? 'personal' : why, n: num(C0?.n, 0) + 1, exit: false };
  if (!ev.papsHint) { ev.papsHint = true; setTimeout(() => { try { if (!ev.closing && live(ev)) ev._toast?.('P: deal with the photographers', ''); } catch (_) { /* */ } }, 1700); }
}
/** the prompt line gets 'P The photographers' while a lens is on you */
export function papsPrompt(ev, html) {
  if (!ON() || !live(ev) || ev.menu || ev.talk || ev.game) return html;
  return `${html ? html + ' ' : ''}<span><kbd>P</kbd>The photographers</span>`;
}
/** Hangout's keydown, first: P opens the menu while a lens is on you -> handled */
export function papsKey(ev, e) {
  if (!ON() || !ev || e.code !== 'KeyP') return false;
  if (e.repeat || !live(ev) || ev.menu || ev.talk || ev.game || ev.sty || ev.ask || ev.moment || ev.closing) return false;
  try { e.stopImmediatePropagation(); } catch (_) { /* */ }
  if (!fresh(ev)) papsSeen(ev, null, 'flash');   // (no flash yet: the nearest camera is the one you turn on)
  papsMenu(ev); return true;
}
/** a grave week's quiet evening: once, a long lens outside (then P, like anywhere else) */
export function papsTick(ev, dt) {
  if (!ON() || !ev || ev.papsGrief || !griefOf(ev) || num(ev.t, 0) < 30 || ev.game || ev.menu || ev.talk) return;
  if (!(flag('__papsGrief') || Math.random() < dt * 0.012)) return;
  ev.papsGrief = true;
  const fx = Math.cos(ev.yaw || 0), fz = Math.sin(ev.yaw || 0), p = { x: ev.pos.x + fx * 6, y: 1.7, z: ev.pos.z + fz * 6 };
  try { if (ev.paps) { ev.paps.position.set(p.x, p.y, p.z); ev.paps.scale.setScalar(2.2); ev.papT = 0; } ev.snd?.shutter?.(); } catch (_) { /* */ }
  ev._toast?.('A photographer outside, the lens on you. This week, of all weeks.', 'warn');
  papsSeen(ev, p, 'grief');
}
/** the menu (Hangout's own); done: called once it is over (the party's exit, which then finishes the night) -> opened */
export function papsMenu(ev, done = null) {
  if (!ON() || !ev?._menu) return false;
  const C = ev.papsC || (ev.papsC = { t: num(ev.t, 0), at: null, why: 'flash', n: 1 }), grief = griefOf(ev) || C.why === 'grief', personal = C.why === 'personal';
  const line = grief ? 'A long lens, this week of all weeks. He is still shooting.' : personal ? 'They got that. Of course they did. The shutter is still going.' : C.exit ? 'The photographers crowd the door, the flashes going.' : 'A photographer, the lens right on you.';
  let acted = false;
  ev._menu('The photographers', line, ['Ignore them', '"Give me a minute"', 'Tell them where to go', 'Push the camera away'], (i) => {
    acted = true; const k = ['ignore', 'polite', 'cuss', 'shove'][i] || 'ignore'; papsAct(ev, k, C, grief, personal);
    if (done) setTimeout(done, k === 'shove' ? 2800 : k === 'ignore' ? 300 : 1800);
  });
  if (done) { const iv = setInterval(() => { if (ev.closing || acted) { clearInterval(iv); return; } if (!ev.menu) { clearInterval(iv); done(); } }, 200); }
  return true;
}
/** the party's exit, photographed: the menu first, then the night ends (done) -> taken over */
export function papsExit(ev, done) {
  if (!ON() || !ev || ev.closing) return false;
  papsSeen(ev, ev.papsC?.at || null, ev.papsC?.why === 'personal' ? 'personal' : 'flash'); ev.papsC.exit = true;
  return papsMenu(ev, done);
}
/** what you did, and the room's answer (no menu) - also the test's way in */
export function papsAct(ev, kind, C = ev.papsC || { n: 1, why: 'flash' }, grief = griefOf(ev), personal = C?.why === 'personal') {
  const R = ev.papsR || (ev.papsR = []);
  if (kind !== 'ignore' && C) C.done = true;
  if (kind === 'ignore') { ev._toast?.('You keep your head down and let them shoot.', ''); R.push({ kind, grief, personal, n: num(C?.n, 1) }); return; }
  const say = kind === 'polite' ? pick(POLITE) : kind === 'cuss' ? pick(grief ? CUSS_GRIEF : personal ? [...CUSS_PERSONAL, ...CUSS] : CUSS) : null;
  if (say) ev._toast?.(`You: "${say}"`, kind === 'cuss' ? 'warn' : '');
  if (kind === 'shove') { ev._toast?.(pick(SHOVE), 'warn'); try { shoveAnim(ev, C); } catch (e) { console.warn('PapsConfront: the shove', e); } }
  setTimeout(() => { try { if (!ev.closing) ev._toast?.(pick(grief && kind !== 'polite' ? BACK.grief : BACK[kind]), kind === 'polite' ? '' : 'warn'); } catch (_) { /* */ } }, 1400);
  try { for (const g of ev._present?.() || []) { g.glance = 2; if (kind === 'shove' && !grief && !personal) g.dm = num(g.dm, 0) - 0.5; } } catch (_) { /* */ }
  R.push({ kind, grief, personal, n: num(C?.n, 1), exit: !!C?.exit, line: say || null });
}
/** your arm, the shove, and the photographer (an invented man) stumbling back a step - then off into the night */
function shoveAnim(ev, C) {
  const cam = ev.cam; let root = ev.scene; if (!cam || !root) return;
  while (root.parent) root = root.parent;
  const yaw = num(ev.yaw, 0), fx = Math.cos(yaw), fz = Math.sin(yaw), y0 = Math.max(0, num(ev.pos?.y, 1.66) - 1.66);
  let man = null, kit = null;
  try {
    man = makePerson({ pose: 'talk', kit: 'jacket', color: '#1d1f24', accent: '#3a3d44', legs: '#22252b', jitter: 0.01, detail: 0.6, seed: 'pap' + ((Math.random() * 1e4) | 0) });
    ev._lift?.(man); const G = man.group; G.position.set(ev.pos.x + fx * 0.85, y0, ev.pos.z + fz * 0.85); G.rotation.y = Math.atan2(-fx, -fz);
    const m = new THREE.MeshStandardMaterial({ color: '#111214', roughness: 0.5 }); kit = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.09), m), lens = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 10), m);
    lens.rotation.x = Math.PI / 2; lens.position.z = 0.09; kit.add(body, lens); kit.position.set(0, 1.58, 0.16); G.add(kit);
    ev.scene.add(G); ev._hostLit?.(G);
  } catch (e) { console.warn('PapsConfront: no photographer', e); man = null; }
  const rig = new THREE.Group(); rig.matrixAutoUpdate = false; let arm = null;
  try { arm = shoveArm('#2b2e35', '#e3b994', false); arm.group.matrixAutoUpdate = true; rig.add(arm.group); arm.group.traverse((o) => { if (o.isMesh) o.frustumCulled = false; }); root.add(rig); } catch (e) { arm = null; }
  try { ev.snd?.hit?.(140, 0.12, 0.2, 1); } catch (_) { /* */ }
  const t0 = performance.now(), M = new THREE.Matrix4(), base = man ? man.group.position.clone() : null;
  const step = () => {
    const s = (performance.now() - t0) / 1000;
    if (arm) { const u = s < 0.04 ? 0 : s < 0.14 ? ss((s - 0.04) / 0.1) : s < 0.3 ? 1 : 1 - ss((s - 0.3) / 0.2); rig.matrix.multiplyMatrices(cam.matrixWorld, M.makeTranslation(0, 0, 0)); rig.matrixWorldNeedsUpdate = true; arm.set?.(u); rig.visible = s < 0.55; }
    if (man && base) { const b = ss((s - 0.12) / 0.45) * 0.9 + (s > 1.6 ? (s - 1.6) * 1.4 : 0); man.group.position.set(base.x + fx * b, base.y, base.z + fz * b); man.group.rotation.z = Math.sin(clamp((s - 0.12) / 0.6, 0, 1) * Math.PI) * 0.12; }
    if (s < 3.2 && !ev.closing) { requestAnimationFrame(step); return; }
    rig.parent?.remove(rig); try { arm?.dispose?.(); } catch (_) { /* */ }
    if (man) { man.group.parent?.remove(man.group); }
  };
  ev.papsAnim = { t0, man, base }; requestAnimationFrame(step);
}
/** Hangout.result: the night's acts into res.paps */
try { if (flag('__papsOn') === true) window.__papsLab = { papsFallout: (c, r) => papsFallout(c, r), papsTick: (e, d) => papsTick(e, d), papsMenu: (e, d) => papsMenu(e, d) }; } catch (_) { /* */ }   // (the dev lab's handle, only with its switch)
export function papsResultInto(ev, res) { if (ON() && res && Array.isArray(ev?.papsR) && ev.papsR.length) res.paps = ev.papsR.slice(0, 8); }

// ---- the press (career): c.pr directly - a grave week's sympathy is printed too, where prEvent would stay silent -------
const graveNow = (c) => !!c?.pr?.ctx?.grave || (Array.isArray(c?.lost) && c.lost.some((l) => l && l.season === c.season && l.round >= c.round - 1));
const FX = {   // image, heat, followers share
  polite: { grief: [3, -2, 0.002], personal: [2, 0, 0.001], hounded: [1, 0, 0], unprovoked: [1, 0, 0] },
  cuss: { grief: [3, 4, 0.004], personal: [-1, 6, 0.003], hounded: [-3, 9, 0.003], unprovoked: [-6, 12, 0.002] },
  shove: { grief: [1, 8, 0.006], personal: [-3, 12, 0.004], hounded: [-7, 16, 0.004], unprovoked: [-12, 22, 0.003] },
};
const HL = {
  polite: { grief: [['f1news', '{name} quietly asks photographers for space in a week of mourning', 1]], personal: [['feed', '"Give me a minute": {sur} keeps it classy with the photographers', 1]], hounded: [['feed', '{sur} stays polite as the photographers swarm', 1]], unprovoked: [['feed', '{sur} asks the photographers for a minute', 0]] },
  cuss: {
    grief: [['f1news', '"Have some respect": a grieving {name} turns on a long lens - and the paddock backs him', 1], ['post', '{SUR} SNAPS AT PHOTOGRAPHER IN WEEK OF MOURNING', 0], ['feed', 'Fans rally round {sur} after a photographer followed him in a week of grief', 1]],
    personal: [['post', '{SUR} LOSES IT WITH PHOTOGRAPHERS AFTER PRIVATE MOMENT', -1], ['feed', '"That was private": fans side with {sur} over the long lens', 1]],
    hounded: [['post', '{SUR}\'S FOUL-MOUTHED RANT AT PHOTOGRAPHERS', -1], ['feed', 'Fans split over {sur} rant: "they were on him all night"', 0]],
    unprovoked: [['post', '{SUR}\'S FOUL-MOUTHED RANT AT PHOTOGRAPHERS', -1], ['race24', '{name} caught on camera swearing at photographers', -1]],
  },
  shove: {
    grief: [['f1news', 'The paddock stands by {name} after a photographer followed him in a week of grief', 1], ['post', '{SUR} PUSHES CAMERA AWAY IN WEEK OF MOURNING', 0], ['race24', 'Calls for the agencies to give grieving drivers space', 1]],
    personal: [['post', '{SUR} SHOVES CAMERA AFTER PRIVATE MOMENT SNAPPED', -1], ['race24', 'Was {sur} wrong to push the camera away? The debate rages', 0]],
    hounded: [['post', '{SUR} SHOVES PHOTOGRAPHER AFTER NIGHT OF FLASHES', -1], ['f1news', '{name} under pressure after an altercation with a photographer', -1]],
    unprovoked: [['post', '{SUR} SHOVES PHOTOGRAPHER', -1], ['f1news', '{name} under pressure after an altercation with a photographer', -1], ['race24', 'Footage shows {name} pushing a photographer', -1]],
  },
};
const COMPLAINT = { grief: 0.03, personal: 0.08, hounded: 0.15, unprovoked: 0.25 };
/**
 * The evening's photographers in the press (CareerHub, after hangoutResult / partyResult): r.paps from the scene ->
 * lines for the evening's summary. A shove that was neither grief nor a private moment makes a crisis (the brawl kind, as
 * the club's scuffle: answered from the PR page), and sometimes a complaint. window.__papsComplaint forces it (tests).
 */
export function papsFallout(c, r) {
  const out = []; if (!ON() || !c || !Array.isArray(r?.paps)) return out;
  const acts = r.paps.filter((a) => a && a.kind && a.kind !== 'ignore'); if (!acts.length) return out;
  let P = null; try { P = prEnsure(c); } catch (_) { P = c.pr || null; } if (!P || !Array.isArray(P.feed)) return out;
  const worst = acts.some((a) => a.kind === 'shove') ? 'shove' : acts.some((a) => a.kind === 'cuss') ? 'cuss' : 'polite';
  const grief = acts.some((a) => a.grief) || graveNow(c), personal = acts.some((a) => a.personal), hounded = acts.some((a) => num(a.n, 1) >= 3) || acts.some((a) => a.exit);
  const why = grief ? 'grief' : personal ? 'personal' : hounded ? 'hounded' : 'unprovoked';
  const me = c.drivers?.[c.playerId]?.name || 'The driver', sur = String(me).split(' ').slice(-1)[0];
  const T = (s) => s.replace(/\{name\}/g, me).replace(/\{sur\}/g, sur).replace(/\{SUR\}/g, sur.toUpperCase());
  const [di, dh, df] = FX[worst][why];
  const i0 = num(P.image, 0), h0 = num(P.heat, 0);
  P.image = Math.round(clamp(i0 + di, -100, 100) * 10) / 10; P.heat = Math.round(clamp(h0 + dh, 0, 100) * 10) / 10; P.fame = Math.max(0.05, num(P.fame, 1) * (1 + df));
  const H = HL[worst][why], printed = worst === 'polite' && why === 'unprovoked' && Math.random() < 0.5 ? [] : H;
  for (let i = printed.length - 1; i >= 0; i--) P.feed.unshift({ season: c.season, round: c.round, outlet: printed[i][0], text: T(printed[i][1]), tone: printed[i][2], kind: 'paps' });
  if (P.feed.length > 60) P.feed.length = 60;
  if (printed[0]) out.push(`In the papers: "${T(printed[0][1])}"`);
  const fxl = [di ? `image ${di > 0 ? '+' : ''}${Math.round((P.image - i0) * 10) / 10}` : '', dh ? `heat ${dh > 0 ? '+' : ''}${Math.round((P.heat - h0) * 10) / 10}` : ''].filter(Boolean).join(', ');
  if (fxl) out.push(why === 'grief' && worst !== 'polite' ? `The photographers: most of the press is on your side this week (${fxl}).` : `The photographers: ${fxl}.`);
  if (worst === 'shove' && (why === 'hounded' || why === 'unprovoked')) {
    try {
      const K = crisisFrom(c, 'brawl', { source: 'club' });
      if (K && K.kind === 'brawl' && K.season === c.season && K.round === c.round && !num(K.ticks, 0) && !(K.also || []).length) {
        K.title = 'The photographer you pushed'; K.story = 'the photographer you pushed';
        K.text = 'Footage of you pushing a photographer\'s camera away is all over The Paddock Post. The serious press wants to know what happened.';
        out.push('A story to answer on the PR page: the photographer you pushed.');
      }
    } catch (e) { console.warn('PapsConfront: the crisis', e); }
  }
  if (worst === 'shove' && (flag('__papsComplaint') || Math.random() < COMPLAINT[why])) {
    P.heat = Math.round(clamp(P.heat + 8, 0, 100) * 10) / 10; P.image = Math.round(clamp(P.image - (grief ? 0 : 3), -100, 100) * 10) / 10;
    P.feed.unshift({ season: c.season, round: c.round, outlet: 'post', text: T(grief ? 'Photographer files complaint against grieving {sur}' : 'PHOTOGRAPHER FILES ASSAULT COMPLAINT AGAINST {SUR}'), tone: -1, kind: 'paps' });
    out.push('The photographer has made a complaint to the police. Your lawyers expect it to go nowhere, but it is in the papers.');
  }
  return out;
}
