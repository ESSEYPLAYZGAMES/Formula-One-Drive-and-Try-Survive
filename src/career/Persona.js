// Who they are, and where you left things. Everyone you can date has one of three personalities (to start) - the Spark
// (bubbly, playful, a dare in everything), the Ice (cool, sharp, makes you earn it) and the Sunshine (warm, sincere, a
// bit of a dork) - each with its own conversations and texts (career/talk/<persona>.js: written as trees, nothing shared
// between them). Every answer you give has a tone - cold, passive, flirty and, now and then, risque - and where you
// steer a conversation is the mood it ends in; the next one, in person or on the phone, opens in that mood: leave it
// flirty and they come back flirting, leave it cold and you have some ground to make up. Nothing is said twice until
// everything for that moment has been (then the least recent first), and the texts come in order - a thread at a time,
// answered or not, about the week, your race, the date you just had - never a shuffled pool. The state is plain JSON on
// the career (c.persona.npcs['c:<celebId>' | 'n:<localId>']: the personality, the mood, what has been said); the callers
// save.
import { CELEB } from './Celebs.js';
import spark from './talk/spark.js';
import ice from './talk/ice.js';
import sunny from './talk/sunny.js';

export const PERSONAS = {
  spark: { id: 'spark', name: 'The Spark', blurb: 'Bubbly, playful, impulsive. Loves a flirt and a dare; coldness stings.', data: spark },
  ice: { id: 'ice', name: 'The Ice', blurb: 'Cool, sharp, guarded. Respects confidence; eagerness reads as cheap - until it does not.', data: ice },
  sunny: { id: 'sunny', name: 'The Sunshine', blurb: 'Warm, sincere, a little dorky. Easy company; flirting makes them blush, coldness hurts.', data: sunny },
};
export const PERSONA_IDS = Object.keys(PERSONAS);
export const MOODS = ['cold', 'passive', 'flirty'];
export const TONE_TAG = { cold: 'COLD', passive: 'PASSIVE', flirty: 'FLIRTY', risque: 'RISQUÉ' };
// (the twelve stars: four of each)
const CELEB_PERSONA = {
  'jade-okafor': 'spark', 'zoe-hartley': 'spark', 'tessa-kealoha': 'spark', 'ava-rennick': 'spark',
  'noor-haddad': 'ice', 'sasha-ivers': 'ice', 'clara-voss': 'ice', 'priya-raman': 'ice',
  'mira-vale': 'sunny', 'lena-marsh': 'sunny', 'maya-lindqvist': 'sunny', 'elena-marchetti': 'sunny',
};
// how each personality takes a tone, by stage (the affinity an answer is worth when the line itself says nothing else)
const TAKE = {
  spark: { cold: [-3, -3, -4], passive: [0, 0, 1], flirty: [3, 3, 3], risque: [1, 4, 4] },
  ice: { cold: [1, 0, -3], passive: [1, 1, 1], flirty: [-1, 2, 3], risque: [-3, 1, 4] },
  sunny: { cold: [-4, -4, -5], passive: [2, 2, 2], flirty: [2, 2, 3], risque: [0, 0, 2] },
};
const STAGE_I = { new: 0, warm: 1, close: 2 };
const TONE_V = { cold: -1, passive: 0, flirty: 1, risque: 2 };

// ---- small helpers ---------------------------------------------------------------------------------------------------
const arr = (a) => (Array.isArray(a) ? a : []);
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const pickS = (v, seed) => (Array.isArray(v) ? v[hash(seed) % v.length] : v);
const first = (s) => String(s || '').trim().split(' ')[0];
const rk = (c) => `${c?.season ?? 0}:${c?.round ?? 0}`;
/** the tokens: {me} {first} {job} {work} {track} {last} {result} {venue} */
// (a token with nothing to fill it: a word that still reads - never the token's own name)
const FALL = { me: 'you', first: 'you', job: 'work', work: 'work', track: 'the next race', last: 'the last race', result: 'that result', venue: 'here' };
export function fillPersona(s, T = {}) { return String(s ?? '').replace(/\{(\w+)\}/g, (m, k) => (T[k] != null && T[k] !== '' ? T[k] : FALL[k] ?? '')).replace(/ {2,}/g, ' '); }

/** the personality of someone you could date: a star's own, a local's from their seed -> 'spark' | 'ice' | 'sunny' */
export function personaOf(cid) {
  const s = String(cid || ''), id = s.replace(/^[cn]:/, '');
  if (CELEB_PERSONA[id]) return CELEB_PERSONA[id];
  if (PERSONAS[CELEB[id]?.persona]) return CELEB[id].persona;   // (someone met on a race night: career/Locals.js)
  return PERSONA_IDS[hash(`persona|${id}`) % PERSONA_IDS.length];
}
/** the state kept for one person (made on first sight) */
export function psOf(c, cid) {
  if (!c) return null;
  const P = c.persona && typeof c.persona === 'object' ? c.persona : (c.persona = { v: 1, npcs: {} });
  if (!P.npcs || typeof P.npcs !== 'object') P.npcs = {};
  let s = P.npcs[cid];
  if (!s || typeof s !== 'object') s = P.npcs[cid] = { p: personaOf(cid), mood: 'passive', heat: 0, seen: [], tseen: [], thread: null, talks: 0, texts: 0 };
  if (!PERSONAS[s.p]) s.p = personaOf(cid);
  if (!MOODS.includes(s.mood)) s.mood = 'passive';
  for (const k of ['seen', 'tseen']) if (!Array.isArray(s[k])) s[k] = [];
  return s;
}
/** where you are with them: new (just met), warm (friendly, flirting), close (dating, together) */
export function stageOf(c, cid) {
  const s = String(cid || ''), id = s.slice(2);
  const st = c?.celebs?.bonds?.[id]?.stage;
  return st === 'dating' || st === 'partner' ? 'close' : st === 'friendly' || st === 'flirting' ? 'warm' : 'new';
}
/** the tokens for them (T: the caller's own - track, last, result, venue - merged in) */
function tokens(c, cid, T = {}) {
  const C = CELEB[String(cid).slice(2)] || null, me = c?.drivers?.[c?.playerId]?.name || c?.me?.name || '';
  const T1 = { ...T }; for (const k of Object.keys(T1)) if (T1[k] == null || T1[k] === '') delete T1[k];
  return { me: first(me) || 'you', ...T1, first: first(T.name || C?.name || ''), job: (T.job || C?.job || '').toLowerCase(), work: T.work || '' };
}
/** an answer's worth to this person at this stage (its own m if it has one) */
export function toneWorth(p, stage, tone, m) { if (typeof m === 'number' && isFinite(m)) return m; const t = TAKE[p] || TAKE.sunny; return (t[tone] || [0, 0, 0])[STAGE_I[stage] ?? 0]; }
/** where a run of answers leaves the mood: the last word counts most (steering it is the point) */
export function moodAfter(tones) {
  const v = arr(tones).map((t) => TONE_V[t] ?? 0); if (!v.length) return null;
  const s = v.length === 1 ? v[0] : 0.35 * v[0] + 0.65 * v[v.length - 1];
  return s >= 0.5 ? 'flirty' : s <= -0.5 ? 'cold' : 'passive';
}
/** the least-recently-said first: the ones never said, else the oldest said (seen: ids in the order said) */
function freshest(L, seen) {
  const never = L.filter((d) => !seen.includes(d.id)); if (never.length) return never[hash(`${seen.length}|${never.length}`) % never.length];
  return L.slice().sort((a, b) => seen.lastIndexOf(a.id) - seen.lastIndexOf(b.id))[0] || null;
}
const ORDER = { cold: 0, passive: 1, flirty: 2, risque: 3 };
const byTone = (os) => arr(os).slice().sort((a, b) => (ORDER[a.tone] ?? 9) - (ORDER[b.tone] ?? 9));

// ---- in person ---------------------------------------------------------------------------------------------------------
/**
 * A conversation with them now (they open in the mood you left them in), as ui/HangoutTalk builds a topic -> { id, say,
 * opts: [{ t, tone, r, m, then? }], persona, done(tones) } | null. o: { party (an after-party), T (tokens: track, last,
 * result, venue...) }. done(tones) - the tones you chose, in order - records it: the mood it ended in, what was said.
 */
export function personaTalk(c, cid, o = {}) {
  const s = psOf(c, cid); if (!s) return null;
  const D = PERSONAS[s.p]?.data, L0 = arr(D?.convos); if (!L0.length) return null;
  const st = stageOf(c, cid), where = o.party ? 'party' : 'evening';
  const ok = (d, stage, mood) => d.stage === stage && d.mood === mood && (!d.where || d.where === where);
  // (the mood you left them in at this stage; else the nearest stage that has it; else any mood)
  let L = L0.filter((d) => ok(d, st, s.mood));
  if (!L.length) for (const st2 of ['warm', 'new', 'close']) { L = L0.filter((d) => ok(d, st2, s.mood)); if (L.length) break; }
  if (!L.length) L = L0.filter((d) => d.stage === st && (!d.where || d.where === where));
  const d = freshest(L, s.seen); if (!d) return null;
  const T = tokens(c, cid, o.T), seed = `${cid}|${d.id}|${s.talks}`;
  const opt = (x, depth) => {
    const m = toneWorth(s.p, d.stage, x.tone, x.m), more = depth === 0 && arr(x.opts).length;
    return { t: fillPersona(x.t, T), tone: x.tone, m, fx: x.tone === 'flirty' || x.tone === 'risque' ? { flirt: true } : undefined, r: more ? '' : fillPersona(x.r, T), then: more ? { say: fillPersona(x.r, T), opts: byTone(x.opts).slice(0, 4).map((y) => opt(y, 1)) } : undefined };
  };
  return {
    id: `persona:${d.id}`, persona: s.p, mood: s.mood, say: fillPersona(pickS(d.say, seed), T), opts: byTone(d.opts).slice(0, 4).map((x) => opt(x, 0)),
    done(tones) {
      const mood = moodAfter(tones); if (!mood) return;
      s.mood = mood; s.talks++; s.seen.push(d.id); if (s.seen.length > 400) s.seen.splice(0, s.seen.length - 400);
      if (arr(tones).includes('risque')) s.heat = Math.min(9, (s.heat || 0) + 1);
      s.last = { mood, how: 'talk', at: rk(c) };
    },
  };
}

// ---- the phone -----------------------------------------------------------------------------------------------------------
// (a thread: { id, path: [the option index at each step], tones: [], at }; open until you answer its last step)
const findThread = (D, id) => arr(D?.texts).find((t) => t.id === id) || null;
const nodeAt = (th, path) => { let n = th; for (const i of path) { n = arr(n?.opts)[i]; if (!n) return null; } return n; };
/**
 * Their next text, in order: what this moment is about (on: 'met' | 'week' | 'date' | 'win' | 'podium' | 'points' |
 * 'bad' | 'dnf'), in the mood you left them in, never one they have sent before until all of those are used -> the text
 * | null (nothing for it). It opens a thread (an answer waits for you; a new one replaces an unanswered one: they have
 * moved on).
 */
export function personaIncoming(c, cid, on = 'week', T0 = {}) {
  const s = psOf(c, cid); if (!s) return null;
  const D = PERSONAS[s.p]?.data, L0 = arr(D?.texts); if (!L0.length) return null;
  const st = stageOf(c, cid), stOk = (t) => t.stage === 'any' || t.stage === st;
  let L = L0.filter((t) => t.on === on && t.mood === s.mood && stOk(t));
  if (!L.length) L = L0.filter((t) => t.on === on && stOk(t));
  if (!L.length) L = L0.filter((t) => t.on === on);
  const t = freshest(L, s.tseen); if (!t) return null;
  s.thread = { id: t.id, path: [], tones: [], at: rk(c) }; s.tseen.push(t.id); if (s.tseen.length > 400) s.tseen.splice(0, s.tseen.length - 400); s.texts++;
  return fillPersona(pickS(t.say, `${cid}|${t.id}|${s.texts}`), tokens(c, cid, T0));
}
/** is a thread of theirs waiting for your answer */
export function personaPending(c, cid) { const s = c?.persona?.npcs?.[cid]; return !!(s && s.thread); }
/** what you can answer now (the open thread's step) -> [{ key: 'pt:<i>', tone, text }] */
export function personaTextOpts(c, cid, T0 = {}) {
  const s = psOf(c, cid); if (!s?.thread) return [];
  const th = findThread(PERSONAS[s.p]?.data, s.thread.id), n = th && nodeAt(th, s.thread.path); if (!n) { s.thread = null; return []; }
  const T = tokens(c, cid, T0), os = arr(n.opts);
  return byTone(os).slice(0, 4).map((x) => ({ key: `pt:${os.indexOf(x)}`, tone: x.tone, text: fillPersona(x.t, T) }));
}
/**
 * Send one of personaTextOpts' answers -> { ok, text (yours), reply (theirs), tone, worth (affinity), more (the thread
 * goes on: new options), mood (where it ended, when it did) }
 */
export function personaTextSend(c, cid, key, T0 = {}) {
  const s = psOf(c, cid); if (!s?.thread) return { ok: false };
  const th = findThread(PERSONAS[s.p]?.data, s.thread.id), n = th && nodeAt(th, s.thread.path), i = Number(String(key).split(':')[1]), x = arr(n?.opts)[i];
  if (!x) return { ok: false };
  const T = tokens(c, cid, T0), stage = th.stage === 'any' ? stageOf(c, cid) : th.stage;
  s.thread.tones.push(x.tone);
  const res = { ok: true, text: fillPersona(x.t, T), reply: fillPersona(x.r, T), tone: x.tone, worth: toneWorth(s.p, stage, x.tone, x.m), more: arr(x.opts).length > 0 };
  if (res.more) s.thread.path.push(i);
  else { const mood = moodAfter(s.thread.tones); if (mood) { s.mood = mood; res.mood = mood; s.last = { mood, how: 'text', at: rk(c) }; } if (x.tone === 'risque') s.heat = Math.min(9, (s.heat || 0) + 1); s.thread = null; }
  return res;
}
/** the line you open with when there is no thread (a hello in the mood you are in with them) -> { key: 'pt:hi', tone, text } */
const HI = {
  cold: ['Hey.', 'You around?', 'Got a minute?'],
  passive: ['Hey, how is your week going?', 'Hi! What are you up to?', 'Hey you. Busy week?'],
  flirty: ['I keep thinking about the other night.', 'Tell me you are as bored as I am.', 'Hi trouble. Miss me?'],
};
export function personaHello(c, cid) { const s = psOf(c, cid); if (!s) return null; return { key: 'pt:hi', tone: s.mood, text: pickS(HI[s.mood], `${cid}|${s.texts}`) }; }
/** your hello sent: they answer with the week's next thread (the hello's tone nudges nothing - the mood is the last talk's) */
export function personaHelloSend(c, cid, T0 = {}) { const t = personaIncoming(c, cid, 'week', T0); return t ? { ok: true, reply: t, more: true } : { ok: false }; }
/** for the phone's list and the hub: the personality's name and the mood you left them in */
export function personaLabel(c, cid) { const s = c?.persona?.npcs?.[cid]; if (!s) return null; return { name: PERSONAS[s.p]?.name || '', mood: s.mood }; }
