// The paddock's own people you can get to know - not famous, not strangers out on a race night, but the women whose
// work is the sport around you: your own agent, the chief executive of the team you own, a sponsor's brand ambassador
// or brand manager, a rival team's race strategist or partnerships manager, a journalist on the beat, a creator who
// films the paddock - and three of the driver managers you sit across from in contract talks (the same women career/
// Party.js AGENTS seats at the table). Each is made from her id (the same person every time, rebuilt after a reload),
// on top of career/Locals.js's generator: its name, face, wardrobe for every occasion, hobby and tastes, with a working
// life of her own laid over it - her role, her company or team, a desk-to-dinner day wardrobe, a little more fame, a
// personality from career/Persona.js (the Fling among them a good deal more often than out on the town: the paddock is
// full of people who want a good night and nothing that needs managing). She has the stars' shape, so career/Celebs.js
// registers her like a local - bonds, the phone, plans, dates - and says when seeing her is a conflict of interest (your
// own agent; the chief executive of your own team) and when a break-up cools her brand on you. Everyone is invented
// and an adult; no real team's principal or chief executive is ever depicted - at a rival team the people here work
// below the top jobs, and at your own team, which you own (the career's premise), the chief executive is your own
// invented appointee, as the team principal is a generic one. Nothing here touches the career: pure functions.
import { makeLocal, VIBE } from './Locals.js';

const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
/** a seed stirred well (murmur's finaliser): ids that differ by a word still make people who differ in every way */
const mix = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
const POOL = (seed) => { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; s ^= s >>> 12; return (s >>> 0) / 4294967296; }; };
const pk = (R, a) => a[(R() * a.length) | 0];
/** a team's or a brand's name as an id's part: 'Red Bull Racing' -> 'redbullracing' */
export const orgSlug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '') || 'x';
const titleCase = (s) => String(s || '').replace(/\b\w/g, (x) => x.toUpperCase());

// ---- who they are, by role -------------------------------------------------------------------------------------------
/**
 * Each role: title (her job, as the phone and the name tag show it - it reads lower case in her own lines too), where
 * (the org kind: 'team' - a team's name; 'brand' - a sponsor's; 'outlet' - a paper's; null - her own), ages, fame, how
 * much she minds the cameras (privacy), her work (what she is busy with - in the third person, the phone puts it in
 * her voice), a line of bio, and the day kits she wears (world/People's)
 */
const ROLE = {
  ceo: { title: 'Chief executive', where: 'team', age: [38, 49], fame: [30, 42], privacy: 0.7, kits: ['pantsuit', 'blazer', 'blazerdress'],
    work: ['the board meeting on Thursday', 'next season\'s budget', 'a title sponsor she is close to signing', 'the new factory wing'],
    bio: (o) => `Runs ${o} as a business: the budget, the board, the sponsors and the cost cap. Reports to its owner - you - and has opinions about your expense claims.` },
  // (at a rival team - a real one, as often as not - never the one at the top: the pit wall and the commercial side)
  dtp: { title: 'Race strategist', where: 'team', age: [29, 42], fame: [12, 22], privacy: 0.55, kits: ['pantsuit', 'blazer', 'coord'],
    work: ['the tyre plan for the next race', 'a simulation that will not converge', 'the undercut she is sure will work', 'a wind-tunnel programme that is running late'],
    bio: (o) => `Calls the strategy on the pit wall at ${o}: tyres, stops, the undercut. Knows exactly how fast your car is, and will never tell you how fast hers is.` },
  com: { title: 'Partnerships manager', where: 'team', age: [29, 42], fame: [14, 26], privacy: 0.5, kits: ['blazer', 'blazerdress', 'coord', 'pantsuit'],
    work: ['a sponsor renewal', 'the hospitality programme for the season', 'a deal she is not allowed to mention', 'a partner launch next week'],
    bio: (o) => `Looks after ${o}'s sponsors: the logos on the car, the guests in the garage. Can tell you what every square inch of a sidepod is worth.` },
  staff: { title: 'Head of hospitality', where: 'team', age: [26, 38], fame: [8, 16], privacy: 0.45, kits: ['blazer', 'coord', 'jumpsuit'],
    work: ['the guest list for the next race', 'a sponsor\'s VIP weekend', 'the team\'s end-of-season party', 'a motorhome that will not stay cold'],
    bio: (o) => `Runs ${o}'s hospitality: the motorhome, the guests, the parties. Knows everyone in the paddock by their first name and their coffee order.` },
  myagent: { title: 'Driver manager', where: null, age: [30, 44], fame: [14, 24], privacy: 0.65, kits: ['pantsuit', 'blazer', 'trench'],
    work: ['your next contract', 'three sponsors who want you for a shoot', 'a client in F2 who will not listen', 'the agency\'s new office'],
    bio: (o) => `Your agent, at ${o}: your contract, your deals, your diary and, now and then, your conscience. Takes ten per cent of everything and earns it.` },
  agent: { title: 'Driver manager', where: null, age: [33, 46], fame: [14, 24], privacy: 0.65, kits: ['pantsuit', 'blazer'],
    work: ['a contract renewal she is stalling on purpose', 'a client who wants a seat at a bigger team', 'the driver market', 'a sponsor deal for a client'],
    bio: () => 'Manages drivers for a living - some of the ones you race against. The same person across the table in contract talks, and very good at it.' },
  amb: { title: 'Brand ambassador', where: 'brand', age: [24, 34], fame: [28, 45], privacy: 0.3, kits: ['blazerdress', 'coord', 'jumpsuit', 'dress'],
    work: ['a campaign shoot next week', 'the brand\'s launch party', 'a content trip she is filming', 'the new collection'],
    bio: (o) => `The face of ${o}: the campaigns, the launches, the race-weekend appearances. Paid to be photographed, and very good at choosing when.` },
  bm: { title: 'Brand manager', where: 'brand', age: [28, 40], fame: [10, 20], privacy: 0.5, kits: ['blazer', 'pantsuit', 'coord'],
    work: ['the race-weekend activation', 'a budget review she is dreading', 'the athlete roster for next year', 'a campaign that needs a driver'],
    bio: (o) => `Runs ${o}'s motorsport programme: which drivers it backs, what they post and what it pays them. Reads every contract twice.` },
  press: { title: 'Motorsport journalist', where: 'outlet', age: [26, 42], fame: [15, 26], privacy: 0.4, kits: ['blazer', 'trench', 'coord', 'casual'],
    work: ['a long read about the driver market', 'Thursday\'s press conferences', 'a podcast episode she is editing', 'a scoop she is sitting on'],
    bio: (o) => `Covers the paddock for ${o}. Never off the record, unless she says so - and she might.` },
  infl: { title: 'Content creator', where: null, age: [23, 31], fame: [32, 48], privacy: 0.2, kits: ['coord', 'jumpsuit', 'casual', 'dress'],
    work: ['a paddock vlog', 'a brand collaboration', 'a video that is doing numbers', 'a podcast she is launching'],
    bio: () => 'Films the paddock for a couple of million followers: the fashion, the grid, the parties. Knows exactly which angle you look best from.' },
};
/** the role and org parts of a paddock id: ('ceo', 'mclaren') */
export const ROLES = Object.keys(ROLE);
// (your agent's agency, and the creator's channel: invented)
const AGENCY = ['Halden Sport Management', 'Northline Talent', 'Corvo Management', 'Ashgrove & Lane', 'Vantage Driver Management', 'Kestle Partners'];
/** the three driver managers from contract talks (career/Party.js AGENTS - the women among them): fixed names */
export const PADDOCK_AGENTS = { marchetti: 'Sofia Marchetti', brooks: 'Hannah Brooks', dubois: 'Claire Dubois' };
// (the personality - career/Persona.js's nine, the Fling weighted in twice: the ids only, so this stays pure)
const PERSONAS = ['spark', 'ice', 'sunny', 'flirtatious', 'emotional', 'rude', 'dominant', 'shy', 'fling', 'fling'];

// ---- ids -------------------------------------------------------------------------------------------------------------
/** a paddock person's id: 'k-<role>-<org>-<seed>' (the org: a team's or a brand's slug, an outlet's id, an agent's key, or 'x') */
export const paddockId = (role, org, seed) => `k-${role}-${orgSlug(org)}-${(seed >>> 0).toString(36)}`;
export const isPaddockId = (id) => /^k-[a-z]+-[a-z0-9]+-[0-9a-z]+$/.test(String(id || ''));
/** an id's parts -> { role, org, seed } | null */
export function paddockParts(id) {
  const m = /^k-([a-z]+)-([a-z0-9]+)-([0-9a-z]+)$/.exec(String(id || '')); if (!m || !ROLE[m[1]]) return null;
  return { role: m[1], org: m[2], seed: parseInt(m[3], 36) >>> 0 };
}
/** a sponsor's ambassador and brand manager (the same women in every career, like the brands' reps) */
export const ambassadorId = (bid) => paddockId('amb', bid, hash(`amb|${bid}`));
export const brandManagerId = (bid) => paddockId('bm', bid, hash(`bm|${bid}`));
/** one of the contract-talk agents, as the paddock knows her (key: career/Party.js AGENTS id) */
export const agentPaddockId = (key) => (PADDOCK_AGENTS[key] ? paddockId('agent', key, 0) : null);

// ---- the person ------------------------------------------------------------------------------------------------------
/**
 * The person for an id (orgName: her team's, brand's or outlet's name as the career knows it - else the slug, title
 * cased) -> Locals' shape (career/Celebs.js registers it), with paddock: { role, org (the slug), orgName, agent (a
 * contract-talk agent's key) } and org (the name, for the phone and the name tag) | null (not a paddock id)
 */
export function makePaddock(id, orgName = null) {
  const P = paddockParts(id); if (!P) return null;
  const Rl = ROLE[P.role], seed = mix(hash(`paddock|${id}`)), base = makeLocal(seed), R = POOL(mix(hash(`paddock-extra|${id}`)));
  const fixed = P.role === 'agent' ? PADDOCK_AGENTS[P.org] : null;
  const org = orgName || (Rl.where ? titleCase(P.org) : P.role === 'myagent' || P.role === 'agent' ? pk(POOL(hash(`agency|${id}`)), AGENCY) : 'Independent');
  const name = fixed || base.name, age = Rl.age[0] + ((R() * (Rl.age[1] - Rl.age[0] + 1)) | 0), fame = Rl.fame[0] + ((R() * (Rl.fame[1] - Rl.fame[0] + 1)) | 0);
  const persona = pk(R, PERSONAS), fling = persona === 'fling';
  // (her tastes as the night's generator drew them; a Fling expects nobody to be the only one, and never wants to be the one)
  const traits = { ...base.traits, privacy: Math.min(0.9, Math.max(0.15, Rl.privacy + (R() - 0.5) * 0.2)) };
  if (fling) Object.assign(traits, { free: 0.65 + R() * 0.2, jealousy: 0.1 + R() * 0.2, wreck: 0, dislikes: [...new Set([...traits.dislikes.filter((d) => d !== 'neglect'), 'scandal'])].slice(0, 2) });
  // (by day she dresses for work: a trouser suit, a blazer, a co-ord in her colours - the evenings are her own)
  const kit = pk(R, Rl.kits), wear = { ...base.wear, grid: { ...base.wear.grid, kit, acc: ['lanyard', R() < 0.5 ? 'watch' : 'earrings'] } };
  const look = { ...base.look, kit, pose: pk(R, ['talk', 'cross', 'hips']) };
  return {
    ...base, id, name, job: Rl.title, org, age, fame, often: [], local: false, persona, persona0: undefined,
    vibe: VIBE[persona] || base.vibe, bio: `${Rl.bio(org)} From ${base.from}; lives in ${base.home}. Off duty: ${base.hobby}.`,
    work: Rl.work, traits, look, wear, paddock: { role: P.role, org: P.org, orgName: org, agent: fixed ? P.org : null },
  };
}

// ---- who is in this career's paddock ----------------------------------------------------------------------------------
/**
 * The standing roster of a career (o: { playerId, myTeam, teams (every team's name) }): your agent, your team's chief
 * executive and its head of hospitality, the three contract-talk agents, two people at rival teams (a race strategist
 * and a partnerships manager), a journalist and a creator. Seeded by who you are and the team you own: the same people
 * however often it is asked. -> { ids: [id], ceo, staff, myagent, agents: [id], rivals: [id], press, infl }
 */
export function paddockRoster(o = {}) {
  const me = String(o.playerId || 'you'), team = String(o.myTeam || 'Independent'), h = (k) => hash(`${me}|${team}|${k}`);
  const rivalTeams = (Array.isArray(o.teams) ? o.teams : []).filter((t) => t && t !== team).sort((a, b) => hash(`${me}|r|${a}`) - hash(`${me}|r|${b}`));
  const out = { ceo: paddockId('ceo', team, h('ceo')), staff: paddockId('staff', team, h('staff')), myagent: paddockId('myagent', 'x', h('agent')),
    agents: Object.keys(PADDOCK_AGENTS).map(agentPaddockId), rivals: [], press: paddockId('press', ['weekly', 'race24', 'apex', 'post'][h('press') % 4], h('press|p')), infl: paddockId('infl', 'x', h('infl')) };
  if (rivalTeams[0]) out.rivals.push(paddockId('dtp', rivalTeams[0], h(`dtp|${rivalTeams[0]}`)));
  if (rivalTeams[1]) out.rivals.push(paddockId('com', rivalTeams[1], h(`com|${rivalTeams[1]}`)));
  out.ids = [out.ceo, out.staff, out.myagent, ...out.agents, ...out.rivals, out.press, out.infl];
  return out;
}
/** seeing her is a conflict of interest for you (myTeam: the team you own) -> 'agent' (your own agent) | 'ceo' (your team's chief executive) | null */
export function conflictKind(def, myTeam) {
  const K = def?.paddock; if (!K) return null;
  if (K.role === 'myagent') return 'agent';
  if (K.role === 'ceo' && K.org === orgSlug(myTeam)) return 'ceo';
  return null;
}
