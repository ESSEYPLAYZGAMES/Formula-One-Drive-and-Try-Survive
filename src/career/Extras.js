// Everyone else: the people in a room who are on nobody's list - the dancers on a club's floor, the bar's crowd, the
// guests milling about a party, the faces on the grid and at the next table on an evening out. Each of them is somebody,
// made from a seed (the same person every time it is asked): a name, an age, a face and a body of their own, what they
// wear, a personality (career/Persona.js's nine - the Fling among them). A woman among them is a local the game has not
// met yet: her seed is a local's (career/Locals.js makeLocal - the same name, the same face, the same wardrobe and the
// same personality), so walking up to her and talking makes her one (promoteExtra: career/Celebs.js registerLocal), and
// from then on she is exactly what a local met at a party is - bonds, the phone, plans and dates. A man among them has a
// name, a look and a personality of his own, and stays an extra: the social systems are hers (career/Celebs.js), so
// nobody promotes him. Everyone here is invented and an adult (23-36 for her, as a local is; 24-47 for him).
// The seeds by place (extraSeed): a club's floor, a party's guests, the grid, a bar - scope 'club:vegasclub',
// 'party:teamparty:<team>', 'grid:<track>', 'hangout:<venue>' - so the same people tend to be at the same places: a
// share of every room its regulars (the same person at that place every night), the rest that night's own.
// Pure and deterministic (nothing here touches the career but promoteExtra, which only registers her and notes where you
// met), cached by seed. Never imports THREE: node-testable (scratchpad npc2/test-extras.mjs).
import { makeLocal, localId, isLocalId } from './Locals.js';
import { CELEB, registerLocal, celebLook, celebEnsure, meet } from './Celebs.js';

// ---- seeds ---------------------------------------------------------------------------------------------------------
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const mix = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
/** the share (percent) of a place's people who are its regulars, the same at that place every night */
export const REGULARS = 35;
/**
 * The seed of the index-th person at a place (scope: 'club:vegasclub', 'party:teamparty:<team>', 'grid:<track>',
 * 'hangout:<venue>' - any string). o.night (a key for the night, e.g. `${season}.${round}`): given, about REGULARS
 * percent of the indices are the place's regulars (always the same person there) and the rest that night's own; not
 * given, every index is always the same person. o.fem (boolean): a woman (true) or a man (false) - the seed's lowest bit
 * is who they are (extraFem); not given, the hash's own bit (half and half) -> a 32-bit seed (never 0)
 */
export function extraSeed(scope, index, o = {}) {
  const base = `${scope}|${index | 0}`, reg = o.night == null || hash(base + '|regular') % 100 < REGULARS;
  // (the hash finished off (murmur3's fmix32): neighbouring indices' hashes differ mostly in a few bits, and a local's
  // first draws - her name - would then repeat round a room more often than chance)
  let h = mix(hash(reg ? base : `${base}|${o.night}`));
  if (o.fem === true) h = (h | 1) >>> 0; else if (o.fem === false) h = (h & ~1) >>> 0;
  return h || 2;
}
/** a seed's person is a woman: its lowest bit (extraSeed sets it) */
export const extraFem = (seed) => ((seed >>> 0) & 1) === 1;
/** the id an extra goes by before she is anyone's: 'x:<seed>' (a man's always) */
export const extraId = (seed) => `x:${seed >>> 0}`;
export const isExtraId = (id) => /^x:\d+$/.test(String(id || ''));
/** an extra's id ('x:<seed>'), a local's ('l-<base36>') or a seed -> the seed | null */
export function seedOfExtra(idOrSeed) {
  if (typeof idOrSeed === 'number' && Number.isFinite(idOrSeed)) return idOrSeed >>> 0;
  const s = String(idOrSeed ?? '');
  if (isExtraId(s)) return parseInt(s.slice(2), 10) >>> 0;
  if (isLocalId(s)) return parseInt(s.slice(2), 36) >>> 0;
  return null;
}

// ---- him: a name, a look, a personality (hers is a local's: career/Locals.js) ----------------------------------------
const POOL = (seed) => { let s = (seed ^ 0x9e3779b9) >>> 0 || 1; return () => { s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; s ^= s >>> 12; return (s >>> 0) / 4294967296; }; };
const pk = (R, a) => a[(R() * a.length) | 0];
const FIRST_M = ['Adrian', 'Ben', 'Callum', 'Dario', 'Elias', 'Felix', 'Gabriel', 'Hugo', 'Idris', 'Jonah', 'Kai', 'Luca', 'Marcus', 'Nico', 'Oscar', 'Pablo', 'Rafael', 'Samir', 'Theo', 'Viktor',
  'Wes', 'Yusuf', 'Zane', 'Anders', 'Bastian', 'Cormac', 'Dev', 'Emeka', 'Finn', 'Gideon', 'Hamish', 'Ivo', 'Jules', 'Kofi', 'Leon', 'Mateo', 'Noah', 'Omar', 'Piers', 'Quentin', 'Ronan',
  'Stellan', 'Tomas', 'Umar', 'Vince', 'Will', 'Xavier', 'Yann', 'Ziggy', 'Alfie', 'Bruno', 'Cyrus', 'Dmitri', 'Ezra', 'Florian', 'Gus', 'Hiro', 'Jasper', 'Kenji', 'Lars', 'Milo', 'Nate'];
const LAST_M = ['Abbott', 'Beaumont', 'Carrick', 'Dalton', 'Everett', 'Fairbairn', 'Garrido', 'Holloway', 'Ingram', 'Jovanovic', 'Kessler', 'Lombardi', 'Mbeki', 'Nordqvist', 'Ortega', 'Petrov',
  'Quinlan', 'Romano', 'Sheridan', 'Tanaka', 'Ueda', 'Vance', 'Wilder', 'Yeats', 'Zamora', 'Asante', 'Brandt', 'Calloway', 'Duval', 'Eriksen', 'Ferrante', 'Gallagher', 'Hayashi', 'Ilunga',
  'Kowalski', 'Laurent', 'Mendes', 'Nakashima', 'Okafor', 'Pires', 'Rinaldi', 'Strand', 'Toussaint', 'Varela', 'Webb', 'Achebe', 'Bergman', 'Cruz', 'Devereux', 'Faulkner', 'Haas', 'Moretti'];
// (skin light to deep, hair as men have it, the styles and the facial hair world/People.js builds)
const SKIN_M = ['#f1d2b6', '#ead0b8', '#e3b994', '#d8a47f', '#cf9a72', '#c18a63', '#a8714b', '#8a5a3b', '#7a4e33', '#6b442c', '#563522', '#4f3122'];
const HAIR_M = ['#17110d', '#2b1d14', '#4a3222', '#6b4a2b', '#141414', '#8a6a44', '#3b2a1e', '#8f8f8f', '#a77d4c', '#1b1512'];
const HS_M = ['short', 'short', 'buzz', 'side', 'quiff', 'swept', 'curly', 'wavy', 'locs', 'mullet'];
const FH_M = [null, null, null, 'stubble', 'stubble', 'beard', 'mustache'];
// (his colours: a shirt and what goes with it; trousers)
const TOP_M = ['#111114', '#1b2440', '#f2f0ea', '#2e3a2c', '#5a1422', '#3a3f48', '#e8e4dc', '#2a2420', '#1e2a44', '#8a6a44', '#3a2a4a', '#c9c3b8'];
const ACC_M = ['#f1f0ec', '#111114', '#8a8f99', '#d4af37', '#c9c3b8'];
const LEGS_M = ['#111114', '#1c1f26', '#24272d', '#2c3e66', '#1e2a44', '#3a3a3e', '#c9bba0'];
const PERSONA_IDS = ['spark', 'ice', 'sunny', 'flirtatious', 'emotional', 'rude', 'dominant', 'shy'];
const JOBS_M = ['Architect', 'Sommelier', 'Photographer', 'Software engineer', 'Chef', 'Barrister', 'Personal trainer', 'Music producer', 'Hotel manager', 'Aerospace engineer', 'Brewer', 'Radio DJ',
  'Stunt performer', 'Vet', 'Data scientist', 'Sailing instructor', 'Travel writer', 'Event planner', 'Physiotherapist', 'Tattoo artist'];
/** what he wears for an occasion (world/People.js kits) */
const KITS_M = { grid: ['polo', 'jacket', 'casual', 'blazer'], club: ['silkshirt', 'knitpolo', 'teeblazer', 'leather', 'bomber', 'pantsuit'], evening: ['pantsuit', 'blazer'], dinner: ['blazer', 'pantsuit', 'sweater'],
  casual: ['casual', 'bomber', 'leather', 'sweater'], sporty: ['athleisure', 'casual'], home: ['sweater', 'casual'], night: ['blazer', 'silkshirt', 'pantsuit', 'jacket'] };
function makeHim(seed) {
  const R = POOL(seed), name = `${pk(R, FIRST_M)} ${pk(R, LAST_M)}`, age = 24 + ((R() * 24) | 0), job = pk(R, JOBS_M);
  const persona0 = PERSONA_IDS[(R() * PERSONA_IDS.length) | 0], persona = hash(`fling|${seed}`) % 100 < 15 ? 'fling' : persona0;
  const deep = R() < 0.3, skin = deep ? pk(R, SKIN_M.slice(7)) : pk(R, SKIN_M.slice(0, 9)), hair = R() < 0.1 ? '#8f8f8f' : pk(R, HAIR_M.slice(0, 9));
  const look = { skin, hair, hs: pk(R, HS_M), fh: pk(R, FH_M), outfit: pk(R, TOP_M), accent: pk(R, ACC_M), legs: pk(R, LEGS_M), build: R() < 0.5 ? 'average' : 'athletic', len: 0.95 + R() * 0.1, wid: 0.92 + R() * 0.12, jaw: 0.35 + R() * 0.3, pick: (R() * 1e9) | 0 };
  return { name, age, job, persona, persona0, look };
}

// ---- the person, cached ------------------------------------------------------------------------------------------------
const CACHE = new Map(), CAP = 4096;
const deepFreeze = (o) => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; };
/**
 * The person a seed makes -> { id ('x:<seed>'), seed, name, first, fem, age, job, look, persona, vibe, lid (her local
 * id when she is promoted: 'l-<base36>', null for him), local (her local's def, unregistered - career/Locals.js
 * makeLocal: wear, traits, bio; null for him) } - frozen, shared: never change it. Her look is her local's own look
 * (makeLocal's: skin, hair, hs, kit, outfit, accent, legs, pose, len, wid, jaw); his is { skin, hair, hs, fh, outfit,
 * accent, legs, build, len, wid, jaw, pick }. Dress either for a scene with extraLook. opts.fem (boolean): the seed
 * re-keyed to a woman (true) or a man (false) when its bit says otherwise (the returned seed is the one used)
 */
export function extraFor(seed, opts = {}) {
  let s = seed >>> 0 || 2;
  if (opts.fem === true) s = (s | 1) >>> 0; else if (opts.fem === false) s = (s & ~1) >>> 0 || 2;
  const hit = CACHE.get(s); if (hit) return hit;
  const fem = extraFem(s);
  let e;
  if (fem) {
    const L = makeLocal(s);
    e = { id: extraId(s), seed: s, name: L.name, first: L.name.split(' ')[0], fem: true, age: L.age, job: L.job, look: L.look, persona: L.persona, vibe: L.vibe, lid: L.id, local: L };
  } else {
    const M = makeHim(s);
    e = { id: extraId(s), seed: s, name: M.name, first: M.name.split(' ')[0], fem: false, age: M.age, job: M.job, look: M.look, persona: M.persona, vibe: null, lid: null, local: null };
  }
  deepFreeze(e);
  if (CACHE.size >= CAP) CACHE.delete(CACHE.keys().next().value);
  CACHE.set(s, e); return e;
}

/**
 * world/People.js makePerson's options for an extra dressed for a scene - hers through career/Celebs.js celebLook from
 * her local's wardrobe (exactly as she is drawn once promoted: her face is her local id's), his from his own look ->
 * makePerson options (a new object: the caller's to change). o: { occasion ('grid' | 'club' | 'evening' | 'dinner' |
 * 'casual' | 'sporty' | 'home' | 'pool' | 'night'), pose, night, track, wet, detail, vary (which of her outfits for it),
 * kit (the scene's own kit over hers or his - a crowd's template; the colours stay theirs), team ({ color, accent, name }:
 * a team's polo, his), jitter }
 */
export function extraLook(e, o = {}) {
  if (typeof e === 'number') e = extraFor(e);
  if (!e) return null;
  const occ = o.occasion || 'grid';
  if (e.fem) {
    const P = celebLook(e.local, { occasion: occ, pose: o.pose, night: o.night, track: o.track, wet: o.wet, detail: o.detail ?? 0.6, vary: o.vary ?? 0 });
    if (o.kit && o.kit !== P.kit) { P.kit = o.kit; for (const k of ['cut', 'fabric']) delete P[k]; if (o.legs !== undefined) P.legs = o.legs || undefined; }
    if (o.jitter != null) P.jitter = o.jitter;
    return P;
  }
  const L = e.look, h = L.pick >>> 0, list = KITS_M[occ] || KITS_M.casual, kit = o.kit || (o.team && occ === 'grid' ? 'polo' : list[h % list.length]);
  const smart = kit === 'blazer' || kit === 'pantsuit', team = o.team || null;
  const P = { pose: o.pose || ['talk', 'cross', 'hips', 'gesture', 'talk'][(h >>> 5) % 5], kit, color: team && (kit === 'polo' || kit === 'jacket') ? team.color : L.outfit, accent: team && (kit === 'polo' || kit === 'jacket') ? team.accent || '#ffffff' : L.accent,
    legs: kit === 'pantsuit' ? L.outfit : smart ? '#1c1f26' : L.legs, skin: L.skin, hair: L.hair, style: { hs: L.hs, fh: L.fh, len: L.len, wid: L.wid, jaw: L.jaw }, build: L.build, seed: e.id, jitter: o.jitter ?? 0.01, detail: o.detail ?? 0.6 };
  if (team?.name && kit === 'polo') P.teamName = team.name;
  if (occ === 'club') { const sh = kit === 'teeblazer' || kit === 'bomber' ? ['trainer', 'trainer', 'boot'][(h >>> 9) % 3] : kit === 'leather' ? 'boot' : ['shoe', 'shoe', 'boot'][(h >>> 9) % 3]; P.shoe = sh; P.shoes = sh === 'trainer' ? '#ecebe6' : '#141416'; P.acc = ['watch']; if (kit === 'silkshirt' || (h >>> 15) % 3 === 0) P.jewel = { chain: true }; }
  return P;
}
/** the colours an extra wears in a scene (a crowd's instanced far body): { skin, top, legs, hair, acc } from extraLook's options */
export function extraColours(P) {
  if (!P) return null;
  return { skin: P.skin || '#e3b994', top: P.color || '#2b2e35', legs: P.legs || P.skin || '#1b1b1f', hair: P.hair || '#2b1d14', acc: P.accent || P.color || '#2b2e35' };
}

// ---- promotion ----------------------------------------------------------------------------------------------------------
/** she has been promoted - a local the game knows (registered) - and c (optional) has a bond with her past a stranger's */
export function isPromoted(c, idOrSeed) {
  const s = seedOfExtra(idOrSeed); if (s == null || !extraFem(s)) return false;
  const lid = localId(s); if (!CELEB[lid]) return false;
  if (!c) return true;
  const b = c.celebs?.bonds?.[lid]; return !!b && b.stage !== 'stranger';
}
/** whoever is behind an id the social systems use for an extra ('x:<seed>' or her 'l-...') -> the extra (extraFor) | null */
export function extraOf(id) { const s = seedOfExtra(id); return s == null ? null : extraFor(s); }
/** promoteExtra's record of where you met someone from the crowd: c.extras.met (kept to MET_CAP, the oldest dropped) */
const MET_CAP = 300;
/**
 * An extra made someone you know, the first time you meaningfully interact (talk, flirt, swap numbers): she is
 * registered as the local her seed already is (career/Celebs.js registerLocal - the same name, face, wardrobe and
 * personality extraFor read: nothing about her changes) -> her local id ('l-<base36>'), the id the social systems use
 * (bonds, the phone, Persona's 'c:<id>'); null for a man (the social systems are hers: he stays an extra) or a bad seed.
 * Idempotent: a second call registers nothing and returns the same id. c (optional: the career) - where you met is noted
 * (c.extras.met[lid] = { seed, scope, season, round }, the first time only) and, opts.meet true, she is met (Celebs.meet:
 * stranger -> 'met', the round's talk counted - meet is itself idempotent within a round). opts: { scope (the place:
 * extraSeed's), meet }. What is saved: only the bond the social systems make (c.celebs.bonds[lid] - celebEnsure rebuilds
 * her from her id's seed on load) and the c.extras.met note; the extra herself is the seed, never stored
 */
export function promoteExtra(c, seed, opts = {}) {
  const s = seedOfExtra(seed); if (s == null || !extraFem(s)) return null;
  const L = registerLocal(s), lid = L.id;
  if (c && typeof c === 'object') {
    try { celebEnsure(c); } catch (_) { /* (a career without celebs yet: its first ensure makes them) */ }
    const X = c.extras && typeof c.extras === 'object' ? c.extras : (c.extras = { v: 1, met: {} });
    if (!X.met || typeof X.met !== 'object') X.met = {};
    if (!X.met[lid]) {
      X.met[lid] = { seed: s, scope: opts.scope ? String(opts.scope).slice(0, 80) : null, season: c.season ?? null, round: c.round ?? null };
      const ks = Object.keys(X.met); if (ks.length > MET_CAP) for (const k of ks.slice(0, ks.length - MET_CAP)) delete X.met[k];
    }
    if (opts.meet) { try { meet(c, lid); } catch (e) { console.warn('Extras: could not meet', lid, e); } }
  }
  return lid;
}
/** c.extras made safe (an older save has none): { v: 1, met: { lid: { seed, scope, season, round } } } -> c.extras */
export function extrasEnsure(c) {
  if (!c || typeof c !== 'object') return null;
  const X = c.extras && typeof c.extras === 'object' ? c.extras : (c.extras = { v: 1, met: {} });
  if (!X.met || typeof X.met !== 'object') X.met = {};
  for (const [k, v] of Object.entries(X.met)) if (!isLocalId(k) || !v || typeof v !== 'object' || seedOfExtra(k) !== (v.seed >>> 0)) delete X.met[k];
  X.v = 1; return X;
}
/** where you met a local from the crowd (promoteExtra's note) -> { seed, scope, season, round } | null */
export function metWhere(c, lid) { return c?.extras?.met?.[lid] || null; }
