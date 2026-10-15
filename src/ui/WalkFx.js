// What the grid walk leaves behind. ui/GridWalk.js does the walking, the talking and the shoving (with ui/Brawl.js);
// this works out what it all comes to. A shove on a driver - laughed off, a look, a shove back - costs a little rapport,
// sets him against you for the race, and makes the gossip pages if a camera saw it; a scuffle costs penalty points (the
// driver actually in the car this weekend gets them: a stand-in's are his own), composure, rapport with him and his
// team-mate, the front pages and maybe a crisis to answer, and whoever you are seeing at the track may not like what she
// saw. Walking away from a shove he started is the other story: the stewards take it up with him, and the papers like a
// cool head. Talking to the stars (career/Celebs.js) is how you meet them, warm to each other, flirt, ask one out or
// have a word with your partner before you get in - and flirting with one while someone you are seeing is watching is
// how you get found out. Talking to the drivers puts them in your phone (career/Social.js), a good talk makes a friend
// (friends greet you warmly), the cameras make a story of what they catch (career/PR.js) and the reporter's quotes run in
// Paddock Weekly. A quiet moment at the memorial steadies you, and is nobody's story. Afterwards every car whose driver's
// state moved gets its race form brought up to date (career/Morale.js). Quick races (no career) keep only the quick
// licence, the day's grudges and your own composure. None of it touches a memorial weekend: no shoves, no scuffles, no
// flirting, nothing for the press. Nobody is hurt, and nobody on the grid wishes anyone harm.
import { shiftMorale, moodOf, formOf } from '../career/Morale.js';
import { addPoints, activePoints, pointsFor, quickAddPoints, quickPoints, LICENCE_MAX } from '../career/Licence.js';
import { prEvent, crisisFrom } from '../career/PR.js';
import { CELEB, talkTo, flirt, charm, askOut, relateCeleb, jealousyCheck, exposure, seeing, seeingAtRace, stageLabel } from '../career/Celebs.js';
import { meetDriver, relateFriend, friendStage, FRIEND_STAGES } from '../career/Social.js';

const pick = (a) => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const first = (s) => String(s || '').split(' ')[0], last = (s) => String(s || '').split(' ').pop();
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal' };
const REACTIONS = ['laugh', 'glare', 'push'];
// (canJab's answers that need no name in them: made once, as the walk may ask every frame for its prompt)
const YES = { ok: true, why: '' }, NO = { ok: false, why: '' };
const NO_MEM = { ok: false, why: 'Not today.' }, NO_WATCHED = { ok: false, why: 'The officials are watching you now' };
// (how much a tone says about you, for the one line the cameras would run: the worst of it first)
const RANK = { cruel: 6, gossip: 5, cold: 4, kind: 3, sorry: 3, light: 2, show: 2, flirt: 2, firm: 1 };
/** a test switch on window (window.__forceShove: an AI driver comes over at the first chance) -> its value or null */
const flag = (k) => { try { return window[k] || null; } catch (_) { return null; } };
/** a call into a career engine that must never break the walk (an old save, a module still settling in) -> its result | null */
const safe = (what, fn) => { try { return fn(); } catch (e) { console.warn(`WalkFx: ${what}`, e); return null; } };

// ---- the walk as this module sees it ----------------------------------------------------------------------------------
/**
 * This module's own notes on the walk (not saved): the drivers whose morale moved (their form wants a refresh), the
 * drivers already rolled for coming over to shove you, whether one has, the scuffle on this walk, your quick-race
 * composure offset, your relationships you have talked to, the talk context set up at the start -> state
 */
const st = (walk) => walk._wfx || (walk._wfx = { dirty: new Set(), rolled: new Set(), shoved: false, brawled: null, q: 0, mine: [], ctx: null });
/** a memorial weekend: the grid remembers someone (no shoves, no scuffles, no flirting, nothing for the press) */
const memorial = (walk) => !!(walk.x?.L || walk.pre?.mem);
/**
 * Who is who this weekend: the career (null in a quick race), your car, the driver actually in it (a stand-in's own id),
 * a stand-in's weekend (your driver out, hurt or banned), a memorial weekend, a quick race's stand-in -> ctx
 */
const who = (walk) => {
  const C = walk.career || null, me = walk.player || {}, did = C ? me.careerId || C.playerId : null;
  return { C, me, did, stand: !!C && did !== C.playerId, mem: memorial(walk), quickOut: !C && (!!me.standInFor || me.outWhy === 'ban') };
};
const trackId = (walk) => walk.track?.def?.id || walk.pre?.trackId || null;
/** the circuit, as the news says it: 'Las Vegas' */
const place = (walk) => TRACK[trackId(walk)] || walk.trackName || 'the circuit';
/** a TV crew or photographer following you is within r m (CrowdLife.watchers: the ones turned to follow you about) -> bool */
const onCamera = (walk, r = 14) => {
  const P = walk.pos; if (!P) return false;
  for (const p of walk.life?.watchers?.() || []) if ((p.x - P.x) ** 2 + (p.z - P.z) ** 2 < r * r) return true;
  return false;
};
const toast = (walk, text, cls = '') => { if (text) walk._toast?.(text, cls); };
/**
 * Penalty points on a licence, through the career's own door where it has one (Career.addPoints also remembers the
 * season, for the clean-licence trophy) -> { total, banned, skipped? } | null
 */
const points = (C, id, p, why, tid) => safe('points', () => (typeof C.addPoints === 'function' ? C.addPoints(id, p, why, tid, C.round + 1) : addPoints(C, id, p, why, tid, C.round + 1)));
/** a driver's morale (stat null) or one trait moved, and his car's form due a refresh -> the change applied */
const mood = (walk, C, did, v, why, stat = null) => {
  if (!C || !did || !v) return 0;
  const a = safe('morale', () => shiftMorale(C, did, v, why, stat)) || 0; if (a) st(walk).dirty.add(did);
  return a;
};
/** the race ahead: he is out to get you today (car.feud, read by ai/AIDriver.js; not saved) - as the walk's own feud() */
const feud = (walk, car, k) => {
  if (!car || car === walk.player || k <= 0) return;
  const was = car.feud || 0; car.feud = Math.min(1, Math.max(was, k));
  if (car.feud >= 0.35 && car.feud > was + 0.15) toast(walk, `${car.name} will be gunning for you today`, 'down');
};
/** back from injury this round (the comeback in the build-up): nobody lays a hand on him */
const returning = (walk, n) => {
  const C = walk.career, d = C && n.did ? C.drivers?.[n.did] : null;
  return !!(d && d.returnRound === C.round) || walk.pre?.back?.car === n.car || (walk.pre?.returning || []).some((b) => b.name === n.name || (b.id != null && b.id === n.did));
};
/** whether he can be shoved at all on this walk, leaving aside what you are doing right now -> YES | { ok: false, why } */
const jabbable = (walk, n) => {
  if (!n || n.kind !== 'driver' || !n.car) return NO;
  if (memorial(walk)) return NO_MEM;
  if (walk.brawled || walk.x?.brawled || st(walk).brawled) return NO_WATCHED;
  if ((n.jabbed || 0) >= 3) return { ok: false, why: `${last(n.name)} has had enough of that` };
  if (returning(walk, n)) return { ok: false, why: `${n.name} is just back from injury` };
  return YES;
};
/** the talk's context kept in line (should the walk build x again after walkSetup, its fields go back in) */
const sync = (walk) => { const S = st(walk), x = walk.x; if (x && S.ctx && !x._wfx) Object.assign(x, S.ctx, { brawled: x.brawled ?? S.brawled ?? null, _wfx: true }); };
/** the line the cameras would run from a talk: the worst of what you said -> { t, tone } */
const worst = (said) => said.reduce((a, s) => ((RANK[s.tone] || 0) > (RANK[a.tone] || 0) ? s : a), said[0]);
/** your relationships among these ids standing within 18 m of you (the stars of the walk) -> [ids] */
const inSight = (walk, ids) => {
  const P = walk.pos; if (!P) return [];
  return ids.filter((id) => (walk.npcs || []).some((m) => m.kind === 'star' && m.celebId === id && (m.person.group.position.x - P.x) ** 2 + (m.person.group.position.z - P.z) ** 2 < 18 * 18));
};

// ---- the start ----------------------------------------------------------------------------------------------------------
/**
 * After the walk's people exist: the stars told who they are (n.celebId, n.job, n.work, and where you stand with each -
 * n.stage, n.grieving, n.accepted; a stand-in's weekend or a quick race: strangers), the drivers' shove count (n.jabbed),
 * friends (Social: a friend or closer) greeting you warmly (mood +1), and the talk's context: x.partner / x.partnerName
 * (your public partner), x.crisis (the one waiting for an answer), x.points (the licence of the driver in the car),
 * x.brawled (null: nothing yet), x.flirted, x.jabbable(n) (GridTalk.js offers a shove only at someone who can be shoved)
 */
export function walkSetup(walk) {
  if (!walk) return;
  const S = st(walk), { C, did, stand } = who(walk), x = walk.x || (walk.x = {}), real = !!C && !stand;
  const pid = real ? C.celebs?.partner || null : null, P = pid ? CELEB[pid] : null;
  const pts = C ? safe('points', () => activePoints(C, did)) : safe('quick points', () => quickPoints());
  S.ctx = { partner: !!P, partnerName: P ? first(P.name) : null, crisis: real ? C.pr?.crisis?.kind || null : null, points: pts || 0, flirted: false, jabbable: (n) => jabbable(walk, n) === YES };
  S.brawled = null; Object.assign(x, S.ctx, { brawled: null, _wfx: true });
  const stars = walk.pre?.stars || [];
  for (const n of walk.npcs || []) {
    if (n.kind === 'star') {
      const s = stars.find((q) => q.person === n.person) || stars.find((q) => q.id === n.celebId || q.name === n.name);
      const id = n.celebId || s?.id || Object.keys(CELEB).find((k) => CELEB[k].name === n.name) || null, K = CELEB[id]; if (!K) continue;
      // (read, not made: a stranger she stays until you talk - no bond is kept for someone you only walked past)
      const b = real ? C.celebs?.bonds?.[id] || null : null;
      n.celebId = id; n.job = n.job || K.job; n.work = K.work; n.partner = !!pid && id === pid; n.persona = n.persona || 'decent';
      n.stage = b?.stage || 'stranger'; n.grieving = !!b?.grieving; n.accepted = !!b?.accepted;
    } else if (n.kind === 'driver') {
      n.jabbed = n.jabbed || 0;
      // (a friend greets you like one)
      const f = real && n.did ? C.social?.friends?.[n.did] : null, k = f ? FRIEND_STAGES.indexOf(f.stage || friendStage(f.level)) : -1;
      if (k >= 2 && !n.warm) { n.warm = true; n.mood = (n.mood || 0) + 1; if (n.mood0 != null) n.mood0 += 1; }
    }
  }
}

// ---- a shove --------------------------------------------------------------------------------------------------------------
/**
 * Whether F gives him a shove now: a driver, and not on a memorial weekend, not after a scuffle on this walk (the
 * officials are watching), not a fourth time, not a driver back from injury, not while you are talking, paying your
 * respects or already at it -> { ok, why } (why: a line to show; empty when there is nothing to say)
 */
export function canJab(walk, n) {
  if (!walk || walk.done || walk.talk || walk.respect || walk.brawl || n?.brawl) return NO;
  sync(walk);
  return jabbable(walk, n);
}
/**
 * How a shove went (reaction: 'laugh' | 'glare' | 'push', or the Jab's outcome { reaction }; 'square' is the scuffle's,
 * brawlFx): a laugh between friends warms things a little; a look costs mood and rapport (-4) and sets him against you
 * today; a shove back a little more (rapport -6) and your composure. On camera the stewards have a word (no points for
 * a shove) and the gossip pages have it (PR 'jab'); a quick race keeps the grudge and the toasts.
 */
export function jabFx(walk, n, reaction) {
  const r = typeof reaction === 'string' ? reaction : reaction?.reaction; if (!walk || !n || !REACTIONS.includes(r)) return;
  sync(walk);
  const S = st(walk), { C, me, did, stand, mem } = who(walk), cam = onCamera(walk), at = place(walk), rap = !!C && !!n.did && !stand;
  if (r === 'laugh') {
    if ((n.mood || 0) >= 1 || n.mate) n.mood = (n.mood || 0) + 1;
    toast(walk, `${n.name} laughs it off`, (n.mood || 0) >= 1 ? 'up' : '');
  } else {
    const push = r === 'push', dr = push ? -6 : -4;
    n.mood = (n.mood || 0) - (push ? 3 : 2);
    if (rap) safe('rapport', () => C.relate(n.did, dr, null));
    toast(walk, `${n.name}${push ? ' shoved you back' : ' is not amused'}${rap ? ` · rapport ${dr}` : ''}`, 'down');
    feud(walk, n.car, push ? 0.5 : 0.35);
    if (C) { mood(walk, C, n.did, -2, 'Shoved on the grid', 'composure'); if (push) mood(walk, C, did, -3, 'Shoved back on the grid', 'composure'); }
    else if (push) S.q -= 3;
    // (the cameras saw it: a word from the stewards, no points for a shove)
    if (cam && !mem) {
      if (C) C.addNews?.(push ? `${me.name} and ${n.name} traded shoves on the grid at ${at}; the stewards had a word with both.` : `The stewards had a word with ${me.name} after a shove on ${n.name} on the grid at ${at}.`);
      toast(walk, 'The stewards saw that', '');
    }
  }
  if (rap && !mem) safe('PR jab', () => prEvent(C, 'jab', { did: n.did, name: n.name, reaction: r, onCamera: cam }));
  if (C) C.save?.();
}

// ---- a scuffle ------------------------------------------------------------------------------------------------------------
/** whoever you are seeing at this race saw it on the grid's screens: most of them do not like it; one who likes a kind or humble man liked you walking away */
const theySaw = (walk, C, calm) => {
  for (const id of safe('seeing', () => seeingAtRace(C)) || []) {
    const K = CELEB[id], f = first(K?.name); if (!K) continue;
    if (calm) { if (K.traits.likes.includes('kind') || K.traits.likes.includes('humble')) { safe('celeb', () => relateCeleb(C, id, 3, `${f} liked how you handled the shove on the grid`)); toast(walk, `${f} liked how you handled that`, 'up'); } }
    else if ((K.traits.drama || 0) < 0.5) { safe('celeb', () => relateCeleb(C, id, -10, `${f} saw the scuffle on the grid`)); toast(walk, `${f} saw that, and she is not impressed`, 'down'); }
  }
};
/**
 * What a scuffle comes to (outcome: ui/Brawl.js's { result, escalated, walkedAway, started, aborted, ... }). Never
 * reached him (aborted): nothing at all. You walked away from his shove: the stewards give him points for unsportsmanlike
 * conduct (once a season for the same driver), you keep your cool (composure +2), and on camera it is a 'restraint'
 * story. A scuffle: penalty points for the driver in your car - 3, +2 if you would not stop, +1 if you started it and
 * came out on top (a quick race: the quick licence) - and for him too if he started it; rapport with him -25..-40 and
 * his team-mate -6; he is out to get you today; composure -12 (and +3 won / -4 lost), his composure -8; the stewards in
 * the news, the papers' story and (on camera) a crisis; whoever you are seeing at the race; the other drivers cooler;
 * the handbags trophy (C.award({ brawl })) -> brawled { did, id, name, result, escalated, onCamera, started, walkedAway }
 * | null
 */
export function brawlFx(walk, n, outcome) {
  const o = outcome || {}; if (!walk || !n) return null;
  if (o.aborted) { toast(walk, `${n.name} thought better of it`, ''); return null; }
  sync(walk);
  const S = st(walk), { C, me, did, stand, mem, quickOut } = who(walk), real = !!C && !stand && !mem, cam = onCamera(walk, 20), at = place(walk), tid = trackId(walk);
  const started = o.started !== false, walked = !!o.walkedAway && !started, esc = !!o.escalated, res = ['won', 'lost', 'even'].includes(o.result) ? o.result : 'even';
  const B = { did: n.did || null, id: n.did || null, name: n.name, result: res, escalated: esc, onCamera: cam, started, walkedAway: walked };
  const conduct = () => {
    // (he started it: the stewards' view of that - the instigator rule counts once a season for the same driver)
    const p = pointsFor('unsportsmanlike conduct'), r = C && n.did ? points(C, n.did, p, 'unsportsmanlike conduct', tid) : null;
    if (r && !r.skipped) { S.dirty.add(n.did); toast(walk, `${n.name}: ${p} penalty points`, ''); }
    return !!r && !r.skipped;
  };
  if (walked) {
    const gave = conduct();
    if (C) C.addNews?.(gave ? `Stewards hand ${n.name} ${pointsFor('unsportsmanlike conduct')} penalty points for unsportsmanlike conduct after shoving ${me.name} on the grid at ${at}; ${last(me.name)} walked away.` : `${n.name} shoved ${me.name} on the grid at ${at}; ${last(me.name)} walked away.`);
    if (C && n.did && !stand) safe('rapport', () => C.relate(n.did, -10, null));
    feud(walk, n.car, 0.6);
    if (C) mood(walk, C, did, 2, 'Walked away from a shove on the grid', 'composure');
    if (real) { safe('PR restraint', () => prEvent(C, 'restraint', { did: n.did, name: n.name, onCamera: cam })); theySaw(walk, C, true); }
    toast(walk, 'You walked away', 'up');
  } else {
    // the stewards: in the news first, then the points (the news reads newest first)
    if (C) C.addNews?.(esc ? `Stewards summon ${me.name} and ${n.name} after the pair would not be separated on the grid at ${at}.` : started ? `Stewards summon ${me.name} and ${n.name} after a scuffle on the grid at ${at}.` : `Stewards summon ${n.name} and ${me.name} after ${last(n.name)} squared up to ${last(me.name)} on the grid at ${at}.`);
    const pts = pointsFor('a scuffle on the grid') + (esc ? 2 : 0) + (started && res === 'won' ? 1 : 0);
    const r = C ? points(C, did, pts, 'a scuffle on the grid', tid) : quickOut ? null : safe('quick points', () => quickAddPoints(pts, 'a scuffle on the grid', tid));
    if (r) {
      toast(walk, `+${pts} penalty points · ${r.total}/${LICENCE_MAX}`, 'down');
      if (r.banned) toast(walk, C ? `${LICENCE_MAX} points: a one-race ban` : `${LICENCE_MAX} points: you sit out the next race`, 'down');
      // (a stand-in's licence makes no news of its own short of a ban)
      if (stand && !r.banned) C.addNews?.(`${me.name}: ${pts} penalty points for a scuffle on the grid at ${at} - ${r.total} of ${LICENCE_MAX} on the licence.`);
    }
    if (!started) conduct();
    // rapport: with him (a lot), with his team-mate (a little)
    if (C && !stand) {
      if (n.did) safe('rapport', () => C.relate(n.did, -(25 + (esc ? 8 : 0) + (started ? 7 : 0)), null));
      const mate = (walk.cars || []).find((c) => c !== n.car && c !== walk.player && n.car && c.team === n.car.team);
      if (mate?.careerId && mate.careerId !== C.playerId) safe('rapport', () => C.relate(mate.careerId, -6, null));
    }
    feud(walk, n.car, 0.9);
    // composure, and how it came out (yours: the driver in the car); his composure
    if (C) {
      mood(walk, C, did, -12, 'A scuffle on the grid', 'composure');
      if (res === 'won') mood(walk, C, did, 3, 'Stood your ground on the grid'); else if (res === 'lost') mood(walk, C, did, -4, 'Came off worse in a scuffle on the grid');
      mood(walk, C, n.did, -8, 'A scuffle on the grid', 'composure');
    } else S.q -= 12;
    // the papers (yours, not a stand-in's): the story, and a crisis when the cameras had it
    if (real) {
      safe('PR brawl', () => prEvent(C, 'brawl', { did: n.did, name: n.name, result: res, escalated: esc, onCamera: cam, started }));
      if (cam) safe('PR crisis', () => crisisFrom(C, 'brawl', { did: n.did, name: n.name, track: tid }));
      theySaw(walk, C, false);
    }
    // the grid saw it: the other drivers cooler, your team principal not pleased if you started it
    for (const m of walk.npcs || []) { if (m !== n && m.kind === 'driver') m.mood = (m.mood || 0) - 1; if (started && m.kind === 'boss') m.mood = (m.mood || 0) - 2; }
    // (handbags on the grid: a scuffle you didn't start, and didn't lose)
    if (real) { const T = safe('award', () => C.award?.({ brawl: B })); if (Array.isArray(T)) for (const t of T) toast(walk, `Trophy: ${t}`, 'up'); }
  }
  S.brawled = B; if (walk.x) walk.x.brawled = B;
  if (C) C.save?.();
  return B;
}
/**
 * Once a walk at most: a stirrer within 8 m of you with something against you (rapport -60 or worse, or a grudge for
 * today of 0.6+) may come over and shove you (20%, rolled once for each such driver); never on a memorial weekend,
 * never your team-mate, never a driver back from injury, never after a scuffle, never in the first 12 s, never while you
 * talk. window.__forceShove (true, or his name) makes it certain (tests) -> the driver npc | null
 */
export function aiShover(walk) {
  if (!walk) return null;
  const S = st(walk);
  if (S.shoved || walk.done || walk.brawl || walk.talk || walk.respect || walk.brawled || S.brawled || memorial(walk) || (walk.t || 0) < 12) return null;
  sync(walk);
  const C = walk.career || null, P = walk.pos, force = flag('__forceShove'); if (!P) return null;
  for (const n of walk.npcs || []) {
    if (n.kind !== 'driver' || n.mate || n.brawl || S.rolled.has(n) || !n.car) continue;
    if (force && force !== true && force !== n.name) continue;
    if (!force) {
      if (n.persona !== 'stirrer') continue;
      const rap = C && n.did ? C.rapportOf?.(n.did) ?? 0 : 0;
      if (!(rap <= -60 || (n.car.feud || 0) >= 0.6)) continue;
    }
    const g = n.person?.group?.position; if (!g || (g.x - P.x) ** 2 + (g.z - P.z) ** 2 > 64 || returning(walk, n)) continue;
    S.rolled.add(n);
    if (force || Math.random() < 0.2) { S.shoved = true; return n; }
  }
  return null;
}

// ---- talking ----------------------------------------------------------------------------------------------------------------
/** a talk with a star: meeting her, how each line landed, a flirt, a charm, asking her out, your partner's good luck - and who saw it (cam: the cameras did) */
const starTalk = (walk, n, said, tones, has, cam) => {
  const { C, did, stand, mem } = who(walk), id = n.celebId, K = CELEB[id], f = first(n.name); if (!K) return;
  const flirted = tones.includes('flirt') || has('flirt');
  // (a quick race, a stand-in's weekend, a memorial weekend: a conversation, and nothing more)
  if (!C || stand || mem) {
    if (has('askout') && !mem) toast(walk, pick([`${f} laughs. "Ask me again after the race."`, `${f} smiles. "Win something first. Then we'll see."`]), '');
    return;
  }
  const S = st(walk), was = n.stage || 'stranger', quiet = !!n.grieving;
  const r = safe('talk', () => talkTo(C, id, tones)) || { delta: 0, met: false };
  if (!quiet) {
    if (has('flirt') && !tones.includes('flirt')) safe('flirt', () => flirt(C, id));
    if (has('charm')) safe('charm', () => charm(C, id));
  }
  const b = C.celebs?.bonds?.[id] || null, now = b?.stage || was;
  const sign = (v) => `affection ${v > 0 ? '+' : ''}${v}`;
  if (r.met) toast(walk, `Met ${n.name}${r.delta ? ` · ${sign(r.delta)}` : ''}`, 'up');
  else if (r.delta) toast(walk, `${f} · ${sign(r.delta)}`, r.delta > 0 ? 'up' : 'down');
  if (now !== was && (now === 'friendly' || now === 'flirting')) toast(walk, `${f}: ${stageLabel(now)}`, 'up');
  if (!quiet) {
    // your partner (or the one you are seeing) wishing you luck before you get in
    if (has('partner') && (now === 'partner' || now === 'dating')) { mood(walk, C, did, 3, `A word with ${f} before the start`); mood(walk, C, did, 3, `A word with ${f} before the start`, 'focus'); toast(walk, `${f} wished you luck`, 'up'); }
    if (has('askout')) { const a = safe('ask out', () => askOut(C, id)); if (a?.text) toast(walk, a.text, a.ok ? 'up' : ''); }
    // who saw it: flirting with her while you are seeing someone else (jealousyCheck: whoever is here or on camera) -
    // or a talk with one of yours in sight of another, or with two of yours on one walk (Celebs.exposure 'grid')
    const all = safe('seeing', () => seeing(C)) || [], others = all.filter((k) => k !== id);
    if (flirted && others.length) {
      if (walk.x) walk.x.flirted = true; if (S.ctx) S.ctx.flirted = true;
      const j =safe('jealousy', () => jealousyCheck(C, id, cam)); if (j?.text) toast(walk, j.text, 'down');
    } else if (all.includes(id) && others.length) {
      const near = inSight(walk, others);
      if (near.length) { const e = safe('exposure', () => exposure(C, 'grid', [id], flirted ? 1 : 0.6, near)); if (e?.text) toast(walk, e.text, 'down'); }
      const two = S.mine.filter((k) => k !== id && others.includes(k));
      if (two.length) { const e = safe('exposure', () => exposure(C, 'grid', [id, ...two], 0.8)); if (e?.text) toast(walk, e.text, 'down'); }
    }
    if (all.includes(id) && !S.mine.includes(id)) S.mine.push(id);
  }
  // (a star's talk is no story: it shapes who you are, quietly - and with one in mourning, not even that)
  if (said.length && !quiet) safe('PR talk', () => prEvent(C, 'talk', { tone: worst(said).tone, onCamera: cam, celeb: id, star: true }));
  n.stage = now; n.accepted = !!b?.accepted;
};
/**
 * What a finished talk adds to the walk's own consequences (T0: the talk - dm, said [{ t, tone }], fx [{ ...flags,
 * line, tone }], tones if the walk keeps every chosen tone). A star: starTalk. A driver: in your phone (meetDriver), a
 * friend for a good talk (relateFriend +2..+5), a good word with your team-mate steadies you (composure +2, the driver in
 * the car), and the cameras' story of the worst of it (PR 'talk'). The reporter's quotes: PR 'talk' through Paddock
 * Weekly. A stand-in's weekend: only the composure; a memorial weekend, a talk of the dead (fx.dead, or the walk's
 * T.mourn tree: T0.mourn) - no PR at all. T0.onCamera, where the walk set it, is what the cameras caught.
 */
export function talkFx(walk, n, T0) {
  if (!walk || !n || !T0) return;
  sync(walk);
  const { C, did, stand, mem } = who(walk), fx = Array.isArray(T0.fx) ? T0.fx : [], said = Array.isArray(T0.said) ? T0.said : [], dm = T0.dm || 0;
  // (a word about the dead is never news, nor anything said at the memorial - the walk marks its T.mourn trees)
  const dead = fx.some((f) => f.dead), mourn = dead || !!T0.mourn || T0.topic === 'mourn', has = (k) => fx.some((f) => f[k]);
  // (what the cameras caught: the walk's own reading of it, where it made one)
  const cam = typeof T0.onCamera === 'boolean' ? T0.onCamera : onCamera(walk);
  // (every tone you chose: the walk's own list if it keeps one, else what you said plus your [actions] that did something)
  const tones = Array.isArray(T0.tones) ? T0.tones : [...said.map((s) => s.tone), ...fx.filter((f) => f.tone && String(f.line || '').startsWith('[')).map((f) => f.tone)];
  if (n.kind === 'star') { starTalk(walk, n, said, tones, has, cam && !mourn); if (C) C.save?.(); return; }
  if (!C) return;
  const press = !stand && !mem && !mourn;
  if (n.kind === 'driver' && n.did) {
    if (!stand) {
      safe('meet', () => meetDriver(C, n.did));
      if (dm >= 3 && !dead) safe('friend', () => relateFriend(C, n.did, clamp(Math.round(dm * 0.8), 2, 5), dm >= 5 ? `A good talk with ${n.name} on the grid` : ''));
    }
    if (n.mate && dm >= 3 && !dead) mood(walk, C, did, 2, `A good word with ${last(n.name)} before the start`, 'composure');
    if (press && said.length) { const w = worst(said); safe('PR talk', () => prEvent(C, 'talk', { tone: w.tone, onCamera: cam, did: n.did, name: n.name, line: w.t })); }
  }
  // the quotes on the record: Paddock Weekly's (the worst of them, if there were several)
  const q = press ? fx.filter((f) => f.press && f.line && !String(f.line).startsWith('[')) : [];
  if (q.length) { const w = q.find((f) => f.tone === 'cruel') || q[0]; safe('PR press', () => prEvent(C, 'talk', { tone: w.tone, onCamera: true, outlet: 'weekly', line: w.line, about: w.about?.careerId ?? null })); }
  C.save?.();
}
/** a quiet moment at the memorial: composure +2 for the driver in the car (no PR: it is nobody's story) */
export function respectFx(walk) {
  if (!walk) return;
  const S = st(walk), { C, did } = who(walk);
  if (C) { mood(walk, C, did, 2, 'A quiet moment at the memorial', 'composure'); C.save?.(); }
  else S.q += 2;
}

// ---- into the race --------------------------------------------------------------------------------------------------------
/**
 * The race form brought up to date: your car (the driver in it: formOf(moodOf(his record)), its licence points, and its
 * tyre wear where the race set it from the form - car.baseWear x form.wear) and every driver whose morale moved on the
 * walk; a quick race: your composure (a scuffle -12, a shove back -3, the memorial +2) on a neutral form, and the quick
 * licence
 */
export function refreshForm(walk) {
  if (!walk) return;
  const S = st(walk), { C, me, did, quickOut } = who(walk);
  if (C) {
    const put = (car, id) => { const d = C.drivers?.[id]; if (!car || !d) return; car.form = formOf(moodOf(d)); car.licencePts = activePoints(C, d); };
    safe('form', () => put(me, did));
    for (const id of S.dirty) if (id !== did) safe('form', () => put((walk.cars || []).find((c) => c.careerId === id), id));
    S.dirty.clear();
  } else {
    if (S.q) me.form = formOf({ morale: 50, focus: 50, racecraft: 50, confidence: 50, composure: clamp(50 + S.q, 0, 100) });
    if (!quickOut) { const p = safe('quick points', () => quickPoints()); if (p != null) me.licencePts = p; }
  }
  if (me.form && me.baseWear != null) { me.wearMul = me.baseWear * (me.form.wear || 1); if (me.tyres) me.tyres.wearMul = me.wearMul; }
}
