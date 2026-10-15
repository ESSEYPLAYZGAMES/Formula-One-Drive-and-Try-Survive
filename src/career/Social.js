// Your life between the races, as your phone keeps it: the people in the paddock you get on with, and the messages that
// go back and forth between rounds. Every driver you talk to on the grid walk becomes someone you can text (your
// team-mate always is), and the closer you get the more they text back - congratulations after a podium, a word after a
// retirement, a wind-up about the move you made on them, an invitation to the karting hall or the sim lounge, a tip for
// the next circuit. Who they are decides how they say it: a stirrer (the grid walk's rule, from the name) needles you,
// the rest are straight with you, and someone you barely know is polite where a mate is rude in the way only mates are.
// A friendship has stages - an acquaintance, friendly, a friend, a mate, a best mate (two of those at most) - and fades
// if you never see each other; mates steady you (a little morale every round) and do you favours: they back you when
// the press comes after you, pass on a tip for the weekend and race you hard but clean. The celebrities you have met are
// in the phone too: small talk with someone you have just met, flirting once there is a spark, check-ins with someone
// you are seeing, a cover story when she asks who keeps texting you (and the chat you would rather delete); the team
// principal, your race engineer and your PR manager answer as the people they are. Plans are made here - who, where (the
// rooftop over the Strip in Las Vegas week, the village pub at Silverstone, a sim lounge, your flat, a private dining
// room, a karting hall, a quiet coffee) - and the answer comes from how well you get on, what they like and how they
// feel; a yes is booked in THE WEEK and played out (ui/Hangout.js) or summed up. The drivers are real people, so these
// seven evening venues stay light: racing, games, food, music, training, travel, nerves and team life - nothing about
// their private lives, and their tastes are the game's, never facts about them; everyone is in season, so the drinks
// there are coffee, juices and soft drinks. The after-party on race night is another matter (career/Party.js): realistic
// adult F1 nightlife as it happens - alcohol and its consequences for you, revealing but realistic clubwear, PG romance
// with the invented stars, handbags scuffles with invented people only; never nudity, sexual content, illegal drugs,
// drink-driving or underage drinking, and the real drivers there network and toast but are never drunk, in romance,
// scandal or a fight. Its people - a sponsor's rep, an agent, your trainer - text you here too ('p:' contacts). In a
// grave week the phone goes quiet: kind words only, no plans but a coffee with a friend, nothing for the papers, no
// party. The state is plain JSON on the career (c.social); the callers save.
import { shiftMorale, moodOf } from './Morale.js';
import { prEvent, fameIndex, fameText, imageLabel, heatLabel, socialPosts, crisisAdvice } from './PR.js';
import * as Celebs from './Celebs.js';

// ---- small helpers --------------------------------------------------------------------------------------------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const num = (v, f) => (typeof v === 'number' && isFinite(v) ? v : f);
const obj = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? o : {});
const arr = (a) => (Array.isArray(a) ? a : []);
const first = (s) => String(s || '').trim().split(/\s+/)[0] || '';
const cap = (s) => String(s || '').replace(/^\w/, (x) => x.toUpperCase());
/** 'Lando' / 'Lando and Oscar' / 'Lando, Oscar and Max' */
const list = (a) => (a.length <= 1 ? a[0] || '' : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
/** the grid walk's string hash (FNV-1a): a driver is the same person there and here */
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
/** a small seeded random: the same words for the same moment, however often the phone redraws */
const rng = (s) => { let h = hash(s) | 0; return () => { h = (h + 0x6d2b79f5) | 0; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const pick = (a, R = Math.random) => (Array.isArray(a) ? (a.length ? a[(R() * a.length) | 0] : '') : a ?? '');
const chance = (p) => Math.random() < p;
/** a line's {tokens} from T (an unknown one reads as nothing rather than as a brace) */
const fill = (s, T = {}) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => (T[k] != null ? String(T[k]) : '')).replace(/ {2,}/g, ' ').trim();
const warn = (what, e) => console.warn(`Social: ${what}`, e);

// ---- the career around the phone: stamps, your driver, the grave-content firewall -------------------------------------
const SPAN = (c) => c?.rounds || 6;
const now = (c) => ({ season: c.season, round: c.round });
const rk = (c) => `${c.season}|${c.round}`;
/** rounds since a stamp ({ season, round }) -> n (99 for never) */
const ago = (c, at) => (at && at.season != null && at.round != null ? (c.season - at.season) * SPAN(c) + (c.round - at.round) : 99);
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal' };
const trackName = (id) => TRACK[id] || cap(id || '');
/** this week's circuit - the race about to be run - counted the way the phone counts it */
const trackOf = (c) => (c?.calendar?.length ? c.calendar[(Math.max(1, c.round) - 1) % c.calendar.length] : null);
const nextName = (c) => (c.round > SPAN(c) ? 'the first race' : trackName(trackOf(c)) || 'the next race');
const meOf = (c) => c?.drivers?.[c.playerId] || null;
const live = (d) => !!d && d.alive !== false;
/** a driver out hurt this week (an injury lay-off, not a ban) */
const hurtNow = (c, d) => !!d && d.outUntil != null && d.outUntil >= c.round;
/** a grave week: the race just run hurt someone or was abandoned (the career's PR context), or the paddock lost someone in the last two weeks */
const grave = (c) => { const x = c?.pr?.ctx; return (!!x?.grave && (x.season == null || ago(c, x) <= 1)) || arr(c?.lost).some((l) => l && ago(c, l) <= 1); };
const moodNow = (c, d = meOf(c)) => {
  try { if (d) return moodOf(d); } catch (e) { /* (a record from before morale: neutral) */ }
  return { morale: 60, focus: 60, racecraft: 60, confidence: 60, composure: 60 };
};
// (the morale, PR and celebrity engines are their own modules: a hiccup there never breaks a text)
const mood = (c, v, why, stat = null) => { try { return v && c?.playerId ? shiftMorale(c, c.playerId, v, why, stat) : 0; } catch (e) { warn('morale failed', e); return 0; } };
const press = (c, kind, data) => { try { return c?.pr ? prEvent(c, kind, data) : null; } catch (e) { warn(`PR event ${kind} failed`, e); return null; } };
const relate = (c, did, v) => { try { if (v && typeof c?.relate === 'function') c.relate(did, v); } catch (e) { warn('rapport failed', e); } };
const rapportOf = (c, did) => num(c?.rapport?.[did], 0);
/** your team-mate's id (the career's seats, or whoever shares your driver's team) -> id | null */
const mateIdOf = (c) => {
  try { const m = typeof c?.teammate === 'function' ? c.teammate() : null; if (m) return m.id; } catch (e) { /* (a mock without seats) */ }
  const me = meOf(c); return Object.values(obj(c?.drivers)).find((d) => live(d) && d.id !== c.playerId && me?.team && d.team === me.team)?.id || null;
};

// ---- the celebrities (Celebs.js): the newer calls are optional, with a plain stand-in until they exist -----------------
const CEL = (id) => Celebs.CELEB?.[id] || null;
// (her work is written about her - 'a duet she is not allowed to talk about yet' - so it is turned round for her own
// messages, and for yours to her)
const toMe = (w) => String(w || '').replace(/\bshe is\b/g, 'I am').replace(/\bherself\b/g, 'myself').replace(/\bher\b/g, 'my').replace(/\bshe\b/g, 'I');
const toYou = (w) => String(w || '').replace(/\bshe is\b/g, 'you are').replace(/\bherself\b/g, 'yourself').replace(/\bher\b/g, 'your').replace(/\bshe\b/g, 'you');
/** a Celebs function if it exists (seeing, exposure, dateResult are the newest) -> its result, or undefined */
const call = (f, ...a) => { try { return typeof Celebs[f] === 'function' ? Celebs[f](...a) : undefined; } catch (e) { warn(`Celebs.${f} failed`, e); return undefined; } };
const bondOf = (c, id) => (CEL(id) && c?.celebs ? call('bondOf', c, id) || null : null);
const peek = (c, id) => c?.celebs?.bonds?.[id] || null;
const ROM = ['dating', 'partner'];
/** the people you are seeing (dating or official) -> [celeb ids] */
const seeingIds = (c) => {
  const v = call('seeing', c); if (Array.isArray(v)) return v.filter((id) => CEL(id));
  const B = obj(c?.celebs?.bonds); return Object.keys(B).filter((id) => CEL(id) && !B[id].grieving && ROM.includes(B[id].stage));
};
/** her suspicion that there is someone else (0..100), moved */
const suspect = (c, id, d) => { const b = peek(c, id); if (b && d) b.suspicion = clamp(Math.round(num(b.suspicion, 0) + d), 0, 100); };
/** something that could give a secret away (Celebs decides whether it does) -> { caught, text } | null */
const expose = (c, source, ids, w = 1) => { const r = call('exposure', c, source, ids, w); return r && typeof r === 'object' ? r : null; };

// ---- the places -----------------------------------------------------------------------------------------------------
/**
 * Where you can go: { id, name, blurb, where (that circuit's week only, or null), privacy (0..1: how unlikely a long
 * lens is), cost ($M from your own account), energy (what the evening takes out of you), kinds ('friend' an evening with
 * one driver, 'date', 'group'), tastes (who it suits), games (what there is to play), date (the date it replaces: Celebs'
 * fav / meh), quiet (right for a grave week: a coffee, nothing more), scene (ui/Hangout.js has the room) }
 */
const V = (id, name, blurb, where, privacy, cost, energy, kinds, tastes, o = {}) => ({ id, name, blurb, where, privacy, cost, energy, kinds, tastes, games: o.games || [], date: o.date || null, quiet: !!o.quiet, scene: o.scene !== false });
export const VENUES = [
  V('rooftop', 'Rooftop over the Strip', 'A rooftop lounge above the Strip at night: the Sphere glowing across the city, low sofas, mocktails and a plunge pool that comes alive on pool nights.', 'lasvegas', 0.2, 0.15, 12,
    ['friend', 'date', 'group'], ['views', 'music'], { date: 'rooftop' }),
  V('poolclub', 'Tidewater Beach Club', 'The night swim at the Meridian Grand: a lit pool, cabanas and daybeds, a DJ under the palms and the Strip glowing beyond. Swimwear, mocktails, late.', 'lasvegas', 0.3, 0.2, 14,
    ['friend', 'date', 'group'], ['music', 'views'], { date: 'beach' }),
  V('pub', 'The village pub', 'A timber-beamed pub a few miles from the circuit: a fire, a dartboard, a pool table and a proper roast. Soft drinks in season.', 'silverstone', 0.5, 0, 10,
    ['friend', 'group', 'date'], ['food', 'competition'], { games: ['darts', 'pool'] }),
  V('simlounge', 'Sim-racing lounge', 'Three full-motion rigs, an arcade cabinet in the corner and a fridge of soft drinks, booked out for the evening.', null, 0.6, 0.02, 10,
    ['friend', 'group', 'date'], ['gaming', 'competition'], { games: ['sim', 'arcade'] }),
  V('apartment', 'Your flat', 'Your own kitchen, a sofa, a record player and a balcony over the city. Nobody sees who comes and goes.', null, 0.95, 0, 6,
    ['friend', 'date', 'group'], ['food', 'quiet'], { games: ['cooking'], date: 'cooking' }),
  V('restaurant', 'A private dining room', 'One table, candlelight and a window over the city. The staff have signed more confidentiality forms than the team has.', null, 0.8, 0.05, 8,
    ['date', 'friend', 'group'], ['food', 'quiet', 'views'], { date: 'dinner' }),
  V('karting', 'Indoor karting hall', 'An indoor kart track hired after hours: a timing screen, a pit wall and a rack of helmets that mostly fit.', null, 0.4, 0.05, 16,
    ['friend', 'group', 'date'], ['competition', 'gaming'], { games: ['karting'], date: 'karting' }),
  V('coffee', 'A quiet coffee', 'A corner table in a café away from the circuit. Nobody to perform for, and no need to talk.', null, 0.9, 0, 3,
    ['friend'], ['coffee', 'quiet'], { quiet: true }),
];
export const VENUE_BY_ID = Object.fromEntries(VENUES.map((v) => [v.id, v]));
/** why a place cannot be booked for this kind of evening this week -> '' when it can */
const venueWhy = (c, v, k, g) => (v.where && v.where !== trackOf(c) ? `${trackName(v.where)} week only` : !v.kinds.includes(k) ? (k === 'date' ? 'Not for a date' : k === 'group' ? 'Not for a group' : 'Not for this')
  : g && !v.quiet ? 'Not this week' : num(c?.wallet, 0) < v.cost ? `Needs $${v.cost}M of your own` : '');

// ---- friendship (c.social.friends) ------------------------------------------------------------------------------------
export const FRIEND_STAGES = ['acquaintance', 'friendly', 'friend', 'mate', 'best'];
const FS = (st) => Math.max(0, FRIEND_STAGES.indexOf(st));
const STAGE_NAME = { acquaintance: 'Acquaintance', friendly: 'Friendly', friend: 'Friend', mate: 'Mate', best: 'Best mate' };
export const TASTES = ['gaming', 'food', 'music', 'competition', 'quiet', 'views', 'coffee'];
// (a game mechanic, shown lightly: never a claim about the real person)
const TASTE_TXT = { gaming: 'likes a game or two', food: 'likes good food', music: 'into music', competition: 'loves a bit of competition', quiet: 'likes quieter spots', views: 'likes a view', coffee: 'lives on coffee' };
/** a friendship's stage from its level: acquaintance (under 15), friendly, friend (35), mate (60), best (85) */
export function friendStage(level) { const v = num(level, 0); return v >= 85 ? 'best' : v >= 60 ? 'mate' : v >= 35 ? 'friend' : v >= 15 ? 'friendly' : 'acquaintance'; }
/** 'Acquaintance' | 'Friendly' | 'Friend' | 'Mate' | 'Best mate' */
export function stageName(stage) { return STAGE_NAME[stage] || 'Acquaintance'; }
/** a driver's two tastes, hashed from the id (the same every career) -> ['quiet', 'coffee'] */
export function tastesOf(did) { const h = hash(`taste|${did}`), a = h % 7, b = (a + 1 + ((h >>> 8) % 6)) % 7; return [TASTES[a], TASTES[b]]; }
/** a taste as the hub shows it: 'likes quieter spots' */
export function tasteText(t) { return TASTE_TXT[t] || ''; }
/** the grid walk's persona rule (from the driver's name): 'stirrer' | 'decent' */
export function driverPersona(name) { return hash(name) % 3 === 0 ? 'stirrer' : 'decent'; }
/**
 * A friendship: level (0..100), stage, last (the last time you saw each other: a hangout, a talk on the grid), hangouts,
 * texts, met (talked on the grid walk), tastes, metAt, texted (your last text), textRound / textN (texts this round), idle
 */
const newFriend = (c, did) => {
  const lv = clamp(Math.round(4 + Math.max(0, rapportOf(c, did)) * 0.25 + (c?.drivers?.[did] && c.drivers[did].team && c.drivers[did].team === meOf(c)?.team ? 8 : 0)), 0, 30);
  return { level: lv, stage: friendStage(lv), last: null, hangouts: 0, texts: 0, met: false, tastes: tastesOf(did), metAt: null, texted: null, textRound: null, textN: 0, idle: 0 };
};
/** a line in the social log (newest first, 40 kept) */
const note = (c, text) => { const S = c.social; if (!S || !text) return; S.log.unshift({ season: c.season, round: c.round, text }); S.log.length = Math.min(S.log.length, LOG_CAP); };
/** the stage follows the level - two best mates at most (a third stays a mate) */
const restage = (c, S, did, f) => {
  const was = f.stage; let st = friendStage(f.level);
  if (st === 'best' && was !== 'best' && Object.entries(S.friends).filter(([k, x]) => k !== did && x.stage === 'best').length >= 2) st = 'mate';
  f.stage = st;
  if (FS(st) > FS(was) && FS(st) >= 2) { const n = c.drivers?.[did]?.name || 'A driver'; note(c, st === 'best' ? `${n} is one of your best mates in the paddock now.` : st === 'mate' ? `${n} is a proper mate now.` : `${n} counts you as a friend now.`); }
};
/** the level moved without touching rapport (drift, a small nudge) */
const bump = (c, S, did, f, dv) => { if (!dv) return 0; const v0 = f.level; f.level = clamp(Math.round(v0 + dv), 0, 100); restage(c, S, did, f); return f.level - v0; };
/** your friendship with a driver (made on first ask; a quick race or an unknown id gets a loose one, not kept) -> record */
export function friendOf(c, did) {
  if (!c?.drivers?.[did] || did === c.playerId) return { ...newFriend(c || {}, did), loose: true };
  const S = ensure(c); return S.friends[did] || (S.friends[did] = newFriend(c, did));
}
/**
 * Friendship with a driver moved (clamped 0..100, the stage follows; why goes to the log). Rapport moves with it at half
 * the size (Career.relate): the two travel together but are not the same thing -> the change in friendship
 */
export function relateFriend(c, did, delta, why = '') {
  const d = c?.drivers?.[did]; if (!d || did === c.playerId || !live(d) || !num(delta, 0)) return 0;
  const S = ensure(c), f = friendOf(c, did), dv = bump(c, S, did, f, delta);
  relate(c, did, delta * 0.5);
  if (why && dv) note(c, why.endsWith('.') ? why : `${why}.`);
  return dv;
}
/** a first proper talk on the grid walk: now in your phone (friendship +3 the first time); every talk counts as seeing them -> record */
export function meetDriver(c, did) {
  const d = c?.drivers?.[did]; if (!d || did === c.playerId) return null;
  const S = ensure(c), f = friendOf(c, did);
  if (!f.met) { f.met = true; f.metAt = now(c); bump(c, S, did, f, 3); note(c, `Got talking to ${d.name} on the grid.`); }
  f.last = now(c); f.idle = 0;
  return f;
}
const friendsBy = (c) => Object.entries(ensure(c).friends).sort((a, b) => b[1].level - a[1].level);

// ---- the state (c.social) -----------------------------------------------------------------------------------------------
const V_SOCIAL = 1, MAX_SENDS = 8, THREAD_CAP = 60, INV_CAP = 30, LOG_CAP = 40;
// (the phone: threads by contact; sent: messages a round (the battery); deleted: chats cleared; said: what you have
// already said to whom this round; trail: messages with someone you are seeing on the quiet, since the chat was last
// cleared; keen: who said yes or no to 'free this week?')
const freshPhone = () => ({ threads: {}, sent: {}, deleted: {}, said: {}, trail: {}, keen: {}, seq: 0 });
/** a new career's c.social */
export function socialState() { return { v: V_SOCIAL, friends: {}, phone: freshPhone(), invites: [], log: [], race: null, seq: 0, tipRound: null, engRound: null, people: {} }; }
const okMsg = (m) => !!m && typeof m === 'object' && typeof m.text === 'string' && ['me', 'them', 'sys'].includes(m.from);
/** an older save's c.social, filled in and repaired (unknown drivers dropped; safe to call again) -> c.social */
export function socialEnsure(c) {
  if (!c || typeof c !== 'object') return null;
  const S = c.social && typeof c.social === 'object' && !Array.isArray(c.social) ? c.social : (c.social = socialState());
  S.v = V_SOCIAL; S.seq = Math.max(0, num(S.seq, 0) | 0);
  const F = obj(S.friends); S.friends = {};
  for (const [did, f] of Object.entries(F)) {
    if (!c.drivers?.[did]) { console.warn('Social: dropping an unknown driver', did); continue; }
    if (did === c.playerId || !f || typeof f !== 'object') continue;
    const x = { ...newFriend(c, did), ...f };
    x.level = clamp(Math.round(num(x.level, 0)), 0, 100); x.hangouts = Math.max(0, num(x.hangouts, 0) | 0); x.texts = Math.max(0, num(x.texts, 0) | 0); x.textN = Math.max(0, num(x.textN, 0) | 0); x.met = !!x.met;
    x.tastes = arr(x.tastes).filter((t) => TASTES.includes(t)).slice(0, 2); if (x.tastes.length < 2) x.tastes = tastesOf(did);
    S.friends[did] = x;
  }
  // (two best mates at most, however an old save got there)
  let nb = 0; for (const [, x] of Object.entries(S.friends).sort((a, b) => b[1].level - a[1].level)) { let st = friendStage(x.level); if (st === 'best' && ++nb > 2) st = 'mate'; x.stage = st; }
  const P = { ...freshPhone(), ...obj(S.phone) }; S.phone = P;
  const TH = obj(P.threads); P.threads = {};
  for (const [cid, T] of Object.entries(TH)) { const L = arr(T).filter(okMsg).slice(-THREAD_CAP); if (L.length && /^[dcxp]:/.test(cid)) P.threads[cid] = L; }
  // (the party's people who have texted you - a sponsor's rep, an agent, your trainer: { name, sub } by 'p:' contact id)
  const PE = obj(S.people); S.people = {};
  for (const [cid, x] of Object.entries(PE)) if (/^p:/.test(cid) && x && typeof x.name === 'string') S.people[cid] = { name: String(x.name).slice(0, 60), sub: String(x.sub || '').slice(0, 80) };
  for (const k of ['sent', 'deleted', 'said', 'trail', 'keen']) P[k] = obj(P[k]);
  P.seq = Math.max(0, num(P.seq, 0) | 0);
  S.invites = arr(S.invites).filter((v) => v && typeof v === 'object' && v.id != null && typeof v.venue === 'string').slice(-INV_CAP);
  S.log = arr(S.log).filter((l) => l && typeof l.text === 'string').slice(0, LOG_CAP);
  if (!S.race || typeof S.race !== 'object') S.race = null;
  return S;
}
const ensure = (c) => (c.social && c.social.friends && c.social.phone?.threads && Array.isArray(c.social.invites) && Array.isArray(c.social.log) && c.social.people ? c.social : socialEnsure(c));
/** a message into a chat (yours and the system's are read already) -> the message */
const push = (c, cid, from, text, kind = 'text') => {
  const P = ensure(c).phone, T = P.threads[cid] || (P.threads[cid] = []);
  P.seq++;
  const m = { from, text: String(text || ''), season: c.season, round: c.round, read: from !== 'them', kind, n: P.seq };
  T.push(m); if (T.length > THREAD_CAP) T.splice(0, T.length - THREAD_CAP);
  return m;
};
/**
 * A text from someone into your phone (career/Party.js: the invitations for tonight, the morning-after texts): cid a
 * driver 'd:', a celebrity 'c:', your team 'x:boss' / 'x:eng' / 'x:pr', or one of the party's people 'p:<role>:<id>'
 * (o.name and o.sub put them in your phone book: a sponsor's rep, an agent, your trainer); o.kind ('text' | 'invite').
 * Never in a grave week. -> the message | null
 */
export function pushText(c, cid, text, o = {}) {
  if (!c?.drivers || !text || grave(c)) return null;
  const id = String(cid || ''); if (!/^[dcxp]:/.test(id)) return null;
  if (id.startsWith('p:')) { const S = ensure(c), x = S.people[id] || {}; S.people[id] = { name: String(o.name || x.name || 'Someone').slice(0, 60), sub: String(o.sub || x.sub || '').slice(0, 80) }; }
  return push(c, id, 'them', text, o.kind || 'text');
}

// ---- words: what the drivers text you -----------------------------------------------------------------------------------
// (each pool by who is texting: cd / cs someone you barely know, decent or a stirrer; wd / ws a friend - the stirrer
// needles, the decent one is straight with you, and a mate is rude in the way only mates are; a missing one falls back)
const W = (cd, cs, wd, ws) => ({ cd, cs: cs || cd, wd: wd || cd, ws: ws || cs || wd || cd });
const voice = (P, X) => (X.warm ? (X.persona === 'stirrer' ? P.ws : P.wd) : X.persona === 'stirrer' ? P.cs : P.cd) || P.cd;
const IN = {
  won: W([`Congrats on the win today. Well driven.`, `Great drive at {track}. Deserved.`, `Well done today. Strong all race.`, `Congratulations, {me}. Proper drive.`],
    [`Nice win. Don't get used to it.`, `Congrats. I'll let you have that one.`, `Well done. Enjoy it, it won't last.`, `Fine, you were quick. Congrats.`],
    [`{me}! What a drive. So happy for you.`, `Massive win, mate. You deserved every bit of it.`, `That was special today. Enjoy tonight, you earned it.`, `Proper drive. Proud of you, honestly.`],
    [`Alright, you won. Do you want a medal as well? (Well done, mate.)`, `Saw the trophy lift. Your technique needs work. Great drive though.`, `Enjoy it while it lasts, I'm coming for you at {next}. Seriously though, mega.`,
      `Congrats. I'm telling everyone I taught you that move.`]),
  podium: W([`Nice podium today. Well driven.`, `{pos} at {track}. Good result, well done.`, `Good drive today. Deserved podium.`],
    [`A podium. Not bad. Not a win, though.`, `{pos}. Respectable. Barely.`, `Nice one today. Nearly the top step. Nearly.`],
    [`Podium! Great job today, mate.`, `Brilliant drive. That podium was all you.`, `{pos}! Get in. You were mighty today.`],
    [`A podium? Who are you and what have you done with {me}?`, `Nice podium. The top step's lonely without you, apparently.`, `{pos}. I'll allow it. Great drive.`]),
  points: W([`Solid points today. Well done.`, `Good race at {track}.`, `{pos}, a decent haul. Well driven.`],
    [`{pos}. Fine. Points are points.`, `Saw you in {pos}. Steady. A bit boring, but steady.`, `Points. Look at you.`],
    [`Good job today, mate. Those points matter.`, `Tidy race. {pos} in that car is a proper result.`, `Nice one. Quietly very good today.`],
    [`{pos}. Quiet but effective, like a good haircut.`, `Points! The bar was low and you cleared it. Well done though.`, `Decent drive. I'd have got {posUp}, but decent.`]),
  low: W([`Tough one today. On to the next.`, `Not your day at {track}. Plenty of season left.`, `Hard race. Heads up for {next}.`],
    [`Rough one. Happens to the best of us. And to you.`, `Saw the result. Ouch. Next one.`, `Not your day, was it.`],
    [`Rubbish luck today. You had more in you than that.`, `Don't dwell on it, mate. {next} will suit you.`, `That wasn't on you. Shake it off, back at it next week.`],
    [`Well. That happened. Pizza helps, I'm told.`, `Bad day? I've had worse. Not many, but some.`, `Shake it off. I need you quick at {next} so I can beat you properly.`]),
  dnf: W([`Shame about today. Bad luck.`, `Unlucky at {track}. Next one.`, `Sorry about the retirement. Hope you're okay.`],
    [`Saw you parked it. Unlucky.`, `A short day at the office.`, `Out early. Next week, then.`],
    [`Gutted for you today. You deserved more.`, `That's racing, mate. You'll bounce back.`, `Rough one. Call me if you want to talk it through.`],
    [`An early shower today? Unlucky, mate.`, `At least you got a good seat for the rest of it. Gutted for you though.`, `That's one way to save the tyres. Seriously, unlucky.`]),
  mine: W([`Good day for us at {track}. {their}, finally.`, `{their} today. The car was finally working. Yours looked like hard work.`, `Happy with {their}. Hope yours was better than it looked.`],
    [`Saw you in my mirrors today. Briefly.`, `{their}. Not to brag. (Bragging.)`, `Did you get a good view of my rear wing?`],
    [`{their} today! Still buzzing. How was yours?`, `What a day. {their}. Wish you'd been up there with me.`, `{their}! The car was on rails. Your turn next week.`],
    [`{their}. I'll be signing autographs in the hotel lobby if you need me.`, `{their}. Just leaving that here.`, `Did you see me on the podium? I waved. You were busy.`]),
  banOut: W([`Strange race without you out there. See you at {next}.`, `Not the same without you on the grid. Back at {next}?`, `Quiet out there today. See you back soon.`],
    [`Enjoyed the extra space on track today. Back at {next}, I suppose?`, `Nobody to complain about today. Weird.`, `The grid was suspiciously calm without you.`],
    [`Missed you out there today. Back at it at {next}.`, `The grid wasn't the same. Keep your head down and come back quick.`],
    [`Nobody to wind up on the grid today. Hurry back.`, `Peaceful out there without you. Too peaceful. Come back.`]),
  rival: W([`Can we talk about today? Not happy with that move.`, `That move was too much. You know it was.`, `Not cool today, {me}. I left you room and you took more.`],
    [`That move. Really?`, `Nice dive-bomb. Do you use the brakes at all?`, `Mirrors are standard on these cars, you know.`],
    [`Mate. That move today. We need to talk.`, `Honestly not happy about today. Call me when you've calmed down. Or when I have.`],
    [`Still picking bits of your front wing out of my sidepod. Thanks for that.`, `That move. We're still friends. Just about.`]),
  tip: W([`Thought of you for {next}. {tip}`, `Something for {next}. {tip}`], [`Free advice, don't get used to it. {tip}`, `Don't tell anyone I told you. {tip}`],
    [`For {next}, from me. {tip}`, `One thing for {next}. {tip}`], [`Don't say I never help you. {tip}`, `You'll owe me for this one. {tip}`]),
  finale: W([`Good season, {me}. Enjoy the break.`, `That's a wrap. Well raced this year.`, `Season done. Good battles this year. See you in the winter.`],
    [`Season over. You survived. Just about.`, `Enjoy the break. You'll need it to get quicker.`],
    [`What a season. Proud to have raced you. Enjoy the break, mate.`, `Season done! Holiday plans? Mine involve a sofa.`],
    [`The season's over, so I can finally stop being nice to you.`, `Enjoy the winter. Come back slower, please.`]),
};
// (small talk by what they like - the game's tastes, never a claim about the person)
const IN_TASTE = {
  gaming: [`Online later? I need someone to beat.`, `Found a new game. You'll hate it. You'll be terrible at it. Come and play.`, `Settle something: the best racing game ever made. Go.`],
  food: [`Found a place near the hotel that does proper pasta. Life-changing.`, `Best thing you've eaten this season? Wrong answers only.`, `The team nutritionist caught me with a croissant. Send help.`],
  music: [`Send me something for the pre-race playlist. Mine's stale.`, `Whoever picks the music in our garage needs stopping.`, `Headphones on, world off. What are you listening to this week?`],
  competition: [`The gym leaderboard says I'm ahead of you. Just so you know.`, `Bet you can't beat my time on that reaction-light app.`, `Padel this week? Loser carries the bags.`],
  quiet: [`Found a quiet spot at the hotel nobody knows about. Not telling you where.`, `Day off today. Phone off. Except for this.`, `Media day survived. Barely. How was yours?`],
  views: [`The view from my hotel room is ridiculous. Jealous?`, `Went for a walk at sunrise. Worth the alarm.`, `Flew in over the city last night. Never gets old.`],
  coffee: [`Who has the best coffee in the paddock? Go.`, `Third espresso and it's not even ten. Send help.`, `Found a café near the circuit that does a proper flat white. Telling nobody but you.`],
};
// (tips worth having: Las Vegas is cold at night and low on grip, with a huge stop at the end of the Strip; Silverstone
// is fast, windy and hard on the front-left through Maggotts, Becketts and Copse)
const TIPS = {
  lasvegas: [`The tyres take an age to switch on in the cold. Don't panic on the out-lap.`, `The run down the Strip is all about the exit before it. Get the slow corner right.`,
    `The grip comes in a lot over the weekend there. Don't chase the set-up on Friday.`, `The stop at the end of the Strip is huge and it catches people out. Brake in a straight line.`],
  silverstone: [`Maggotts and Becketts: commit early and let the car flow.`, `Watch the wind at Silverstone. It changes the balance more than you'd think.`, `Copse is flat if the car's right. Trust it.`,
    `It's hard on the front-left there. Look after it through the quick stuff.`],
  montreal: [`Use every bit of the exit kerb at the last chicane, and not a centimetre more. The wall is right there.`, `It's all braking and traction there. Get the car stopped for the hairpin and the final chicane and the lap comes to you.`,
    `The track's green on Friday and rubbers in fast. Don't chase the balance too early.`, `Ride the kerbs at Turns 8 and 9, they're your friend. The ones at 3 and 4 will launch you.`],
  any: [`The out-lap matters more than you think. Get the tyres in properly.`, `Stay off the dirty side at the start.`, `Don't overthink it. You're quicker when you're relaxed.`, `Look after the rears in the first stint. It pays back later.`],
};
const tipOf = (c, R = Math.random) => pick(TIPS[trackOf(c)] || TIPS.any, R);
// (a grave week: no jokes, no plans; only kind words)
const SUPPORT = {
  killed: [`I can't believe it about {lost}. Thinking of everyone at {lostTeam}.`, `Still can't take it in about {lost}. Look after yourself this week.`, `{lost}. No words. I'm here if you need anything.`],
  injured: [`Thinking of {hurt}. Hope there's good news soon.`, `Scary one today. Thinking of {hurt}. Take care of yourself.`, `Heard about {hurt}. Fingers crossed for good news.`],
  you: [`Thinking of you. Take all the time you need.`, `Heard what happened. Rest. Nothing else matters this week.`, `Look after yourself. We'll all be here when you're back.`],
  any: [`Rough weekend for everyone. Look after yourself.`, `Thinking of everyone affected today. Here if you need anything.`, `No words today. Take care of yourself.`],
};
const CONDOLE = [`Thinking of {lost} this week. I'm here if you need anything.`, `No words. Look after yourself.`, `Everyone's thinking of {lost}. Take care of yourself this week.`, `Here if you need anything at all. Any time.`];
const HURT_YOU = [`The race wasn't the same without you. Rest up.`, `Thinking of you. See you back on the grid when you're ready.`, `Hope you're doing okay. No need to reply.`];
// (their invitations, by place)
const IN_INV = {
  pub: W([`There's a village pub near the circuit that does a proper roast. Darts after? This week?`, `Pub quiz near the track this week? Soft drinks, I promise. You in?`],
    [`Darts at the pub this week. Loser buys the chips. Or are you scared?`, `Village pub, pool table, you losing. This week?`]),
  simlounge: W([`I've booked the sim lounge this week. Want to join? Bring your A game.`, `Sim lounge this week? A few laps, a few games, nothing serious.`],
    [`Sim lounge this week. I'll even give you a head start.`, `Fancy losing to me on the sim this week? The lounge is booked.`]),
  karting: W([`Got the karting hall after hours this week. A proper race. Fancy it?`, `Indoor karting this week? Like the old days.`],
    [`Karting hall this week. Bring your excuses.`, `Karting this week. I've been practising. You haven't. You in?`]),
  rooftop: W([`There's a rooftop lounge over the Strip. Great view, decent mocktails. Come along this week?`, `Found a rooftop with the whole Strip below it. This week?`],
    [`Rooftop this week. You can pretend you're in a film.`, `Rooftop lounge over the Strip. Dress code: not your team kit. You in?`]),
  poolclub: W([`Got a cabana at Tidewater for the night swim this week. Pool, DJ, mocktails. Coming?`, `Night swim at the Meridian Grand this week? Bring shorts.`],
    [`Tidewater night swim this week. Race you to the far wall.`, `Pool party at Tidewater this week. Leave the team kit at home. In?`]),
  restaurant: W([`I've booked a private room at a good restaurant this week. Want to come? Proper food.`, `Dinner this week? Quiet place, good food, no cameras.`],
    [`Dinner this week. You're paying, obviously.`, `Dinner this week, somewhere you can pretend you've been before. In?`]),
  coffee: W([`Fancy a quiet coffee this week? No need to talk about anything.`, `Coffee this week? Just to sit for a bit.`, `There's a quiet café away from the circuit. This week, if you want.`]),
};
const GROUP_ADD = [`{other} is coming too.`, `Bringing {other}.`, `{other} is in already.`];

// ---- words: what you can say to a driver, and what comes back ---------------------------------------------------------
const MY = {
  congrats: [`Great drive today. Deserved.`, `Mega result, {first}. Enjoy it.`, `Congrats on {their}. Properly quick out there.`],
  commiserate: [`Unlucky today. You had the pace.`, `Rough one. On to the next.`, `Gutted for you today. Head up.`],
  thanks: [`Cheers, {first}. Appreciate it.`, `Thanks! Good weekend for us.`, `Thank you. Still buzzing.`],
  thanksBad: [`Thanks. Not our day.`, `Cheers. Onwards.`, `Appreciate it. Next one.`],
  thanksSoft: [`Thanks. Appreciate it.`, `Cheers. Back soon.`, `Thanks, that means a lot.`],
  thanksSeason: [`Thanks! Good battles this year.`, `Cheers. Enjoy the break.`, `Thanks, you too. See you in the winter.`],
  shrug: [`It's done. {next} is what matters now.`, `Already over it. Next one.`, `Bad days make the good ones better.`],
  cold: [`Don't really want to talk about it.`, `Not in the mood, sorry.`, `Leave it, yeah?`],
  banterBack: [`Wait till you see what I do at {next}.`, `Keep talking. See you on track.`, `Noted. Screenshotted. Framed.`],
  kindBack: [`Ha. Good to hear from you. How's your week?`, `Haha. Fair. All good with you?`, `Love it. See you at {next}.`],
  show: [`Did you see that move? Clean.`, `Told you I'd get you this week.`, `Easy. Well, nearly easy.`],
  beat: [`Enjoy the view of my gearbox?`, `Close, but not close enough.`, `Same again at {next}?`],
  beaten: [`Fine. You were quicker today. Today.`, `Enjoy it. It won't happen again.`, `I let you have that one.`],
  sorry: [`About today. That was on me. Sorry.`, `My fault. I misjudged it. Sorry, mate.`, `I owe you an apology for that move.`],
  firm: [`Racing incident. You left the door open.`, `Hard but fair. You'd have done the same.`, `I was alongside. It was my corner.`],
  dig: [`Maybe try your mirrors next time.`, `Nice of you to keep me company at the back.`, `Is it the car that's slow, or...?`],
  advice: [`How are you finding {next}? Any tips?`, `Where do you find time at {next}?`, `Got any tricks for {next}?`],
  plan: [`Free this week? We should do something.`, `Fancy doing something this week?`, `We should hang out before {next}.`],
  check: [`Good racing today.`, `Hope the week's going well.`, `Good to chat on the grid.`],
  accept: [`Count me in.`, `Yes! See you there.`, `Go on, then. I'm in.`],
  acceptQ: [`Yes. I'd like that.`, `Thank you. Yes.`, `That would help. Yes.`],
  decline: [`Can't this week, sorry. Next time?`, `Not this week, I'm wiped. Rain check?`, `Wish I could. Next week?`],
  support: [`Thinking of everyone this week. You okay?`, `Rough few days. Here if you need anything.`, `Look after yourself this week.`],
  thanksQuiet: [`Thanks. Means a lot. You too.`, `Appreciate it. Look after yourself.`, `Thank you. Speak soon.`],
  getwell: [`Thinking of you. No need to reply.`, `Here if you need anything. Take your time.`, `Hope you're doing okay. Rest.`],
  thanksTip: [`Thanks, that helps.`, `Noted. Owe you one.`, `Good shout. Thanks.`],
};
const MY_TASTE = {
  gaming: [`Online tonight? I've been practising.`, `You're still terrible at that game, right?`], food: [`Found a place that does proper pasta. You're not invited.`, `Settle it: the best food at any circuit?`],
  music: [`Your garage playlist is a crime.`, `Send me something for the pre-race playlist.`], competition: [`Rematch at something. Anything. Your choice.`, `Gym leaderboard. Check it. I'm coming.`],
  quiet: [`Survived the media day?`, `Quiet week? Same here, finally.`], views: [`The hotel view today is unreal. Yours?`, `Up early for the sunrise. Worth it.`],
  coffee: [`Who's got the best coffee in the paddock? Wrong answers only.`, `Fourth coffee. Is that a problem?`],
};
const REP = {
  congrats: W([`Thanks, {me}. Appreciate it.`, `Cheers! The car was mega today.`, `Thanks. Your turn next time.`], [`I know. But thanks.`, `Ha, cheers. Screenshot taken, obviously.`, `Thanks. The coffees are on you next week.`],
    [`Cheers, mate. Means a lot.`, `Thank you! Still buzzing.`, `Ha, thanks. Wish you'd been up there with me.`]),
  commiserate: W([`Thanks. A bad day at the office.`, `Cheers. Already looking at {next}.`, `Appreciate it. Not much I could do.`], [`Yeah, yeah. Don't enjoy it too much.`, `Thanks. I'll take it out on you next week.`, `Cheers. Don't tell anyone I said thanks.`],
    [`Thanks, mate. Needed that.`, `Cheers. Back stronger at {next}.`]),
  thanks: W([`Deserved. Enjoy it.`, `Any time. See you at {next}.`, `Go and celebrate. Quietly.`], [`Don't get used to it.`, `That's the last nice thing I say this season.`, `Yeah, yeah. See you at {next}.`]),
  thanksBad: W([`You'll be fine. See you at {next}.`, `Head up. Plenty of season left.`, `Any time.`], [`Chin up. It's only sport. (It's not, I know.)`, `You'll bounce back. Unfortunately.`, `Next time. Maybe.`]),
  thanksSoft: W([`Any time.`, `See you soon.`, `Look after yourself.`]),
  thanksSeason: W([`Enjoy the winter.`, `See you next year.`, `Rest up. Big year next year.`], [`Enjoy it. Come back slower.`, `See you next year. Bring your A game.`]),
  shrug: W([`That's the spirit.`, `Good attitude. See you there.`], [`Big words. Let's see.`, `We'll see at {next}.`]),
  cold: W([`Fair enough. Here if you change your mind.`, `No worries. Speak soon.`], [`Touchy. Fine.`, `Okay, okay. Sulk away.`]),
  banterBack: W([`Ha. We'll see.`, `Haha. Fair.`, `You wish.`], [`Bold words. Very bold.`, `Ha! Screenshot. Evidence.`, `Keep talking. See you at {next}.`], null,
    [`Ha! Love it. See you there, loser.`, `Mate. You're dreaming. See you at {next}.`, `Bold. I'll remind you of this at {next}.`]),
  banter: W([`Ha. Okay.`, `Ha. Right. See you at {next}.`, `Who gave you this number? (Kidding.)`], [`Ha! I like you already.`, `Bold. See you on track.`, `Ha. Keep it coming.`],
    [`Ha. Fair.`, `Haha. We'll see.`, `You wish.`], [`Bold words. Very bold.`, `Ha! Screenshot. Evidence.`, `Keep talking. See you at {next}.`]),
  kindBack: W([`All good, thanks. See you at {next}.`, `Good, cheers. Busy week.`], [`Fine. Annoyingly fine.`, `Good. Better than your lap times.`], [`All good, mate. You?`, `Good! We should do something this week.`]),
  show: W([`Yes, we all saw. Twice. On the big screen.`, `Modest as ever.`, `It was good, to be fair.`], [`Calm down. It was one race.`, `Yeah, yeah. Frame it.`, `I've seen better. Not recently.`]),
  sorry: W([`Appreciate you saying it. We're good.`, `Thanks. Honestly, that means a lot.`, `Okay. Clean fight next time.`], [`Fine. You're buying the coffees for a month.`, `Accepted. Grudgingly.`, `Okay. I'm still annoyed for one more day.`]),
  firm: W([`We'll have to disagree, then.`, `Not how I saw it. Let's leave it.`, `Okay. I'll remember that.`], [`Ha. Sure. Keep telling yourself that.`, `Fine. Next time I leave no door.`, `See you at {next}, then.`]),
  dig: W([`Wow. Okay.`, `Grow up, {me}.`, `Not worth a reply.`], [`Ha. Says you.`, `Bold. See you on track.`, `Keep it coming. It makes beating you sweeter.`]),
  check: W([`Thanks, you too.`, `Cheers. See you at {next}.`, `Likewise. Good luck this week.`], [`Who is this? (Kidding. Cheers.)`, `Ha, thanks. See you on track.`]),
  support: W([`Thanks. Taking it day by day.`, `Appreciate that. You too.`, `Thanks. Look after yourself.`]),
  thanksQuiet: W([`Always.`, `Any time. Take care.`, `Speak soon.`]),
  getwell: W([`Thanks. Means a lot.`, `Appreciate it. See you soon.`, `Thank you. It helps.`]),
  thanksTip: W([`Any time. Don't tell anyone.`, `No worries. You'd do the same.`], [`You owe me. I'm keeping count.`, `Use it wisely. Not against me.`]),
};
const PLAN_YES = W([`Yeah, go on. Send me a plan.`, `Definitely. You pick the place.`], [`If you're paying. Send me a plan.`, `Fine. But I'm picking the game.`]);
const PLAN_NO = W([`Busy week, sorry. Next one?`, `Can't this week. Rain check?`], [`Can't. Washing my helmet.`, `Busy. Ask me again when you're quicker.`]);
const ADVICE = W([`Honestly? {tip}`, `Happy to help. {tip}`], [`Why would I help you? Fine. {tip}`, `This one's free. {tip}`], [`For you? {tip}`, `Easy. {tip}`], [`Don't tell anyone I told you. {tip}`, `You owe me. {tip}`]);
const ACCEPT_R = W([`Great. See you there.`, `Perfect. It's a plan.`, `Brilliant. Book it in.`], [`Bring your excuses.`, `Good. Prepare to lose.`, `Excellent. I'll go easy. (I won't.)`]);
const ACCEPT_Q = [`Good. I'll see you there.`, `Thanks. See you then.`, `Good. No rush, whenever suits.`];
const DECLINE_R = W([`No worries. Next time.`, `All good. Another week.`, `Shame. Next one, then.`], [`Scared. Understood.`, `Your loss.`, `Fine. More for me.`]);
const DECLINE_Q = [`Of course. Another time.`, `No problem at all. Take care.`];
// (your invitations, by place: an evening with a driver or friends, or a date)
const MY_INV = {
  pub: { friend: [`Village pub near the circuit this week? Darts, pool, a proper roast.`, `Pub this week? Soft drinks, darts, no media.`], date: [`There's a lovely village pub near the circuit. This week?`, `A quiet pub dinner this week? Corner table, no cameras.`] },
  simlounge: { friend: [`Sim lounge this week? A few laps, a few games, nothing serious.`, `I've booked the sim lounge this week. You in?`, `Fancy the sim lounge this week? Loser buys the smoothies.`],
    date: [`Fancy learning the sim this week? I'll go easy on you.`, `Sim lounge this week? I'll show you the racing line.`] },
  karting: { friend: [`I've got the karting hall after hours this week. A proper race. You in?`, `Indoor karting this week? Like the old days.`], date: [`Karting this week? I promise to let you win. Once.`, `Fancy a kart race this week? Fair warning: I'm competitive.`] },
  rooftop: { friend: [`Rooftop lounge over the Strip this week? Best view in Vegas.`, `Found a rooftop with the whole Strip below it. This week?`], date: [`Rooftop over the Strip this week? Just us and the lights.`, `Let me show you the Strip from above this week.`] },
  poolclub: { friend: [`Night swim at Tidewater this week? I've got a cabana.`, `Tidewater Beach Club this week? Pool, DJ, no media.`], date: [`A night swim at Tidewater this week? I've booked a cabana.`, `The pool at the Meridian Grand after midnight this week? Just us and the lights.`] },
  restaurant: { friend: [`Dinner this week? Private room, good food, no cameras.`, `I've booked a private room somewhere good this week. Coming?`], date: [`Dinner this week? I've booked somewhere quiet.`, `Let me take you to dinner this week. A private room, phones away.`] },
  apartment: { friend: [`Come round to mine this week? I'll cook. Lower your expectations.`, `Mine this week? Food, a film, nobody filming.`], date: [`Come over this week? I'll cook for you.`, `Dinner at mine this week? I've been practising one dish.`] },
  coffee: { friend: [`Fancy a quiet coffee this week? No need to talk about anything.`, `Coffee this week? Just to sit for a bit.`] },
};
const OTHERS = [`{others} are coming too.`, `{others} are in already.`];
const OTHER1 = [`{others} is coming too.`, `{others} is in already.`];
const YES_D = W([`Yes! Count me in.`, `Go on, then. See you there.`, `Love that. I'm in.`], [`Only if you're ready to lose.`, `In. Prepare yourself.`, `Obviously. Bring your excuses.`]);
const YES_V = { simlounge: [`In. I'll bring my own wheel.`], karting: [`In. I've been practising.`], pub: [`In. The darts are mine.`] };
const NO_D = W([`Can't this week, sorry. Next time?`, `Wish I could. Busy week with the team.`, `Not this week, I'm wiped. Rain check?`], [`Can't this week. You got lucky.`, `Busy. Ask me again when you've practised.`]);
const NO_TASTE = [`Not really my thing, to be honest. Something else another week?`, `Not my kind of place, if I'm honest. Another time?`];
const YES_Q = [`Yes. That would be good.`, `I'd like that. Thanks for asking.`];
const NO_Q = [`Not this week. But thank you for asking.`, `I can't face it yet. Thank you, though.`];
const RESTING = [`Taking it easy this week. Another time.`, `Not this week, I'm resting up. Thanks, though.`];

// ---- words: the celebrities ---------------------------------------------------------------------------------------------
const CIN = {
  tvWin: [`Saw the win! I stopped {work} to watch the last lap.`, `You won! I may have shouted at a screen.`, `Congratulations! That last lap was a lot.`],
  tvPod: [`Saw you on the podium. Very nice.`, `A podium! Well done, you.`, `I watched the race. {pos}! Is that good? It looked good.`],
  tvOther: [`Watched the race. You looked fast. Is that the right word?`, `Caught the race between {work} meetings. Well driven.`, `I watched! I understood about half of it. You were great in the half I understood.`],
  tvDnf: [`Saw the race. Sorry it ended early.`, `That was a short day for you. Chin up.`, `Saw what happened. Bad luck. Hope you're okay.`],
  partnerWin: [`You WON. I'm so proud of you.`, `I may have cried a little. Don't tell anyone. Well done.`, `Winner! Call me the second you're free.`],
  partnerPod: [`Podium! I'm so proud of you.`, `{pos}! I watched every lap with my hands over my eyes.`, `You were brilliant today. Call me later?`],
  partnerOk: [`Good race. Proud of you. Call me later?`, `{pos}. I'll take it. Will you?`, `Watched every lap. You looked calm out there. Are you?`],
  partnerBad: [`Rough one. Call me when you're done with the team?`, `Not your day. I'm here if you want to talk, or not talk.`, `I'm sorry about today. Come and see me when you can.`],
  check: [`Thinking of you. How's the week?`, `Back from {work}. Tell me something good.`, `Call me tonight? I miss your voice.`],
  flirt: [`Still thinking about that grid-walk conversation.`, `You're distracting, you know that? I have {work} to finish.`, `Is it strange that I watch the timing screens now?`],
  jealous: [`Who keeps texting you? You were on your phone all night.`, `You've been distant. Is there something you're not telling me?`, `Be honest with me. Is there someone else?`],
  banOut: [`Strange watching without you out there. I missed your car.`, `A weekend off? Come and see me, then.`],
  support: [`Thinking of you. Call me when you can.`, `I saw the news. I'm here, whenever you need me.`, `No need to reply. Just know I'm thinking of you.`],
  youHurt: [`I saw. I'm here. Call me when you can.`, `Rest. I'll come whenever you want me there.`, `No need to reply. Just know I'm here.`],
};
const CIN_INV = {
  restaurant: [`I'm free this week. Dinner somewhere quiet?`, `Let me take you to dinner this week. I know a place with a private room.`], apartment: [`Your place this week? You cook, I'll judge.`, `Cook for me this week? I'll bring dessert.`],
  rooftop: [`A rooftop this week? The Strip at night, just us.`, `There's a rooftop over the Strip I love. This week?`], poolclub: [`Tidewater has a night swim this week. Get us a cabana?`, `Pool at the Meridian Grand after midnight this week? I'm packing my swimsuit.`], karting: [`Karting this week. I want a rematch. Or a first match.`, `Kart race this week? Loser cooks.`],
  simlounge: [`Teach me the sim this week? I'm a quick learner.`], pub: [`There's a village pub near the circuit. Corner table, this week?`],
  visit: [`Can I come over this week? I'll bring food. No arguments.`, `I'm coming over this week. You rest, I'll cook.`],
};
const MYC = {
  hello: [`Good to meet you at {track}.`, `Nice to meet you on the grid. Hope {ywork} is going well.`, `Hi, it's {me}. From the grid. The one in the overalls.`],
  work: [`How's {ywork} going?`, `Tell me about {ywork}.`, `Still busy with {ywork}?`],
  race: [`Did you watch the race? Be honest.`, `So... did you see it?`, `Verdict on the race?`],
  flirtFr: [`Still thinking about our chat on the grid. In a good way.`, `I'd rather be talking to you than sitting in the debrief.`, `You made the grid walk the best part of the weekend.`],
  flirtF: [`Is it weird that I check my phone hoping it's you?`, `Tell me your plans this week. I want to be in them.`, `You're very distracting. Just so you know.`],
  flirtD: [`Counting the days till I see you.`, `Missing you. That's the whole message.`, `I keep thinking about our last evening.`],
  check: [`Thinking of you. How's your day?`, `How's {ywork}? Tell me everything.`, `Missing you. How are you?`],
  deep: [`Can I say something? This weekend was easier knowing you were watching.`, `I've been thinking about us. In a good way.`, `You make the noise go quiet. Does that make sense?`],
  plan: [`Free this week? I'll book somewhere.`, `Let me take you out this week.`, `Can I steal you for an evening this week?`],
  reassure: [`There's no one else. I promise.`, `It's just you. I'm sorry I've been distracted.`, `Nothing's going on. I promise. Can I call you?`],
  cover: [`Work stuff. The team never stops texting.`, `Just the drivers' group chat. Twenty people moaning about tyres.`, `My engineer. He sends data at midnight.`],
  sorry: [`I'm sorry. I've been rubbish lately.`, `I know I've been distant. I'm sorry.`, `I'm sorry. I'll do better.`],
  thanks: [`Thank you! Wish you'd been there.`, `Thanks. It means more coming from you.`, `Thank you. Celebrating with a very large pizza.`],
  thanksBad: [`Thanks. Not my day.`, `Thank you. I'll call you later.`, `Thanks. Better next time.`],
  checkBack: [`Better now you've texted. How's {ywork}?`, `Good week. Better if I see you.`, `All good. Missing you, though.`],
  flirtBack: [`Is that so? Tell me more.`, `Good. I'd hate to be the only one.`, `You're trouble, you know that?`],
  exKind: [`Hope you're doing well.`, `Saw {ywork} is going well. Pleased for you.`],
  exSorry: [`I handled things badly. I'm sorry.`, `For what it's worth, I'm sorry about how it ended.`],
  quietKind: [`Thinking of you. No need to reply.`, `Here if you ever want to talk. No pressure.`],
  support: [`Rough few days. I'm okay. Thinking of you.`, `Can I call you tonight? I could use your voice.`],
  accept: [`Yes. I'd love that.`, `Definitely. Can't wait.`, `That sounds perfect. Yes.`],
  decline: [`I can't this week. Can we do next week?`, `This week's impossible. Rain check?`],
};
const REPC = {
  hello: [`Hi! Good to meet you too. Good luck this week.`, `Ha, I remember. Nice to hear from you.`, `Hi, {me}. Busy with {work}, but hi.`],
  work: [`It's chaos. Good chaos. {Work} is nearly there.`, `Long days, but I love it. Thanks for asking.`, `Honestly? Exhausting. But it's going to be good.`],
  raceWin: [`I saw! I may have shouted at a screen.`, `Everyone saw. Congratulations!`, `I watched the last ten laps standing up.`],
  raceOk: [`I did. You were brave. Is that the word?`, `I saw it. The overtake was my favourite bit.`, `I watched! Well done.`],
  raceBad: [`I saw. I'm sorry. You didn't deserve that.`, `I did. Bad luck. Next one.`, `I did. You'll get them next time.`],
  flirtYes: { friendly: [`Smooth. Slightly. Keep going.`, `Ha! Is that a line? It's working a bit.`, `Careful. I might start to like you.`], flirting: [`You're trouble. I like it.`, `Then ask me out properly.`, `Maybe I am too. Don't tell anyone.`],
    dating: [`Me too. Hurry up and win so I can see you.`, `Stop it, I'm smiling in a meeting.`, `Miss you too.`] },
  flirtNo: [`Ha. Okay. Let's not get ahead of ourselves.`, `That's a lot for a Tuesday.`, `Slow down, racing driver.`],
  check: [`Better now. {Work} is a lot this week.`, `Long day. Your message helped.`, `Good! Busy. Missing you too.`],
  deep: [`It makes sense. You do the same for me.`, `That might be the nicest thing anyone's said to me.`, `I've been thinking about us too.`],
  planYes: [`Yes. Somewhere without cameras, if you can.`, `I'd love that. You choose.`, `Finally. Yes.`],
  planNo: [`This week's impossible with {work}. Next week?`, `I can't, I'm away for {work}. Soon, though.`],
  believe: [`Okay. I believe you.`, `Okay. Call me later?`, `Thank you. I needed to hear that.`],
  doubt: [`I want to believe you.`, `Okay. We'll talk properly soon.`, `...Okay.`],
  coverYes: [`Ha. Okay. Tell your engineer to sleep.`, `Fine. Tell the group chat I said hello.`, `Okay. Sorry. I'm just tired.`],
  coverNo: [`At two in the morning?`, `That's a lot of work stuff.`, `Right. Okay.`],
  sorry: [`Thank you for saying it.`, `Okay. Show me, then.`, `I appreciate that. We're okay.`],
  thanks: [`Next time I will be.`, `Proud of you.`, `You deserve it. Call me later?`],
  thanksBad: [`Call me. Whenever.`, `Next time. I'll be watching.`, `Proud of you anyway.`],
  checkBack: [`{Work} is fine. You're better.`, `Then come and see me.`, `Missing you too.`],
  flirtBack: [`More later. In person.`, `Maybe. Ask me nicely.`, `Ha. Good answer.`],
  exKind: [`Thanks. You too.`, `That's kind. Thanks.`, `Thanks. Good luck this week.`],
  exSorry: [`Thank you. That means something.`, `It's okay. Water under the bridge.`, `Thanks for saying it.`],
  quietKind: [`Thank you. That's kind.`, `Thank you.`],
  support: [`Thinking of you too. Call me tonight.`, `Of course. Any time.`, `I'm here. Call whenever.`],
};
const CYES = [`I'd love that.`, `Yes. Somewhere without cameras, if you can manage it.`, `Finally. Yes.`];
const CYES_FAV = [`Yes! That's my favourite kind of evening.`, `You know me too well. Yes.`];
const CYES_MEH = [`Okay. Not really my thing, but okay. For you.`, `Hm. Not my usual. But yes.`];
const CNO = [`I can't this week, {work} has me. Soon?`, `Not this week. Ask me again?`, `I'm away for {work}. Next week?`];
const CNO_ASK = [`You're sweet. But not yet.`, `Let me get to know you a bit better first.`, `Ask me again some time.`];
const CYES_GROUP = [`Sounds fun. Count me in.`, `Why not? See you there.`];
const CACCEPT_R = [`Perfect. See you then.`, `It's a date.`, `Can't wait.`];
const CDECLINE_R = [`Oh. Okay. Next week, then.`, `Fine. But you owe me.`, `That's a shame. Soon?`];

// ---- words: the team ----------------------------------------------------------------------------------------------------
const BOSS = {
  won: [`Fantastic drive. The whole factory's celebrating.`, `That's what we come here for. Well done, {me}.`, `Superb today. Enjoy it, then back to work.`],
  podium: [`Great result today. Podiums like that keep the factory going.`, `Strong drive. Good points for the team.`, `Well done today. That's the level.`],
  good: [`Good job today. Solid points.`, `A tidy, professional race. That's what we need.`, `Good work. Keep stacking those points.`],
  under: [`Not the result we wanted. We'll go through it together on Tuesday.`, `We need more from both of us. The engineers are on it.`, `A tough one. Reset, and we go again at {next}.`],
  mech: [`That retirement is on us. I'm sorry. We'll find out what happened.`, `Painful day. The car let you down, and we'll fix it.`],
  crash: [`Let's talk about today. Calmly. Tuesday.`, `Disappointing. Learn from it and move on.`, `Not ideal. We'll go through the data together.`],
  ban: [`Strange watching from the garage without you. Back to it at {next}.`, `Lesson learnt, I hope. We need you at {next}.`],
  finale: [`That's the season. Thank you for everything this year. Enjoy the break.`, `Season done. We'll sit down soon and talk about next year. Rest first.`],
  grave: [`Take care of yourself this week. Everything else can wait.`, `Thinking of everyone affected. The team is with you.`, `No debrief this week. Look after yourself and each other.`],
  you: [`Take all the time you need. Your seat is waiting.`, `Don't think about the car. Just rest. We're all behind you.`],
};
const ENG = {
  normal: [`Data's in. We found a bit in the slow corners for {next}.`, `Good job on the tyres today. The plan for {next} lands tomorrow.`, `Debrief notes are in your inbox. Short version: braking stability, then traction.`],
  bad: [`Rough one. Don't read too much into it. We'll sort the balance for {next}.`, `We learned a lot today, even if it didn't feel like it.`, `Not our day. The car's better than that result. See you on the sim.`],
  grave: [`Thinking of you. Nothing about the car this week.`, `No debrief this week. Look after yourself.`],
};
const PRN = {
  calm: [`Quiet week in the press. A thank-you post wouldn't hurt.`, `Nothing on fire. Enjoy it.`],
  heat: [`The Paddock Post is sniffing around. Keep your evenings quiet this week.`, `Things are a bit warm out there. No cryptic posts, please.`],
  good: [`They love you at the moment. Don't change a thing.`, `Followers up again. Whatever you're doing, keep doing it.`],
  grave: [`No posts, no statements this week. I've told the outlets you won't be commenting.`],
};
const MYS = {
  car: [`What's coming for the car at {next}?`, `Any upgrades on the way?`, `What are we bringing to {next}?`],
  thanksBoss: [`Thanks for the car this weekend.`, `Good job by the whole team today.`, `Thank the factory for me.`],
  push: [`I need more pace. What's the plan?`, `We're losing time on the straights. What are we doing about it?`, `How do we close the gap to the front?`],
  future: [`Are we talking about next year soon?`, `Where are we on my contract?`],
  debrief: [`Where was I losing time?`, `Anything in the data I should know?`, `Where's the time for me?`],
  setup: [`Ideas for {next}?`, `What's the plan for {next}?`, `Anything I should practise on the sim for {next}?`],
  thanksEng: [`Thanks for today. Good calls.`, `Great strategy call today.`, `Thanks for the help this weekend.`],
  crisis: [`How do we play this one?`, `What do we say about {story}?`, `Advice on {story}?`],
  posts: [`What should I post this week?`, `Anything I should post?`],
  image: [`How are we doing out there?`, `How's my image looking?`],
  quiet: [`Thanks for looking after everyone this week.`, `Thank you for this week.`],
  quietPr: [`Nothing from us this week, please. No posts, no statements.`],
};
const REPS = {
  thanksBoss: [`The guys will be glad to hear it.`, `Tell the mechanics yourself on Thursday. They'd love that.`, `I'll pass it on. Well driven.`],
  push: [`The plan is in the factory. Patience, and keep scoring.`, `We're on it. Bring me points and I'll bring you parts.`, `I know. Trust the process for a few more races.`],
  future: [`Soon. Keep driving like this and it's an easy conversation.`, `After the next couple of races. Keep your head down.`],
  debrief: [`Mostly traction out of the slow corners. Short-shift a touch.`, `Your braking's good. The minimum speeds are where the time is.`, `Tyre management was spot on. The out-laps cost you a bit.`],
  setup: [`For {next}?`, `Right, {next}.`, `Sim homework for {next}.`],
  thanksEng: [`Team effort. See you on the sim.`, `Thanks. Rest up.`, `Any time. Now go and sleep.`],
  quiet: [`Of course. Look after yourself.`, `Thank you. We're all here for each other.`],
  quietPr: [`Agreed. I've told the outlets you won't be commenting.`],
};
// (what a development is called on the phone - the factory's word for it, not the catalogue's)
const PART = { ice: 'the engine update', turbo: 'the turbo revision', mguk: 'the MGU-K update', es: 'the battery update', fuel: 'the new fuel blend', deploy: 'the new deployment maps', fwing: 'the new front wing',
  rwing: 'the new rear wing', floor: 'the floor upgrade', diffuser: 'the diffuser', sidepods: 'the sidepod update', beam: 'the beam wing', drsact: 'the DRS actuator', flap: 'the new DRS flap', weight: 'the weight saving',
  mono: 'the chassis revision', fsusp: 'the front suspension', rsusp: 'the rear suspension', ride: 'the ride-height package', discs: 'the new brake package', bbw: 'the brake-by-wire update', bcool: 'the brake cooling',
  therm: 'the tyre thermal work', tmodel: 'the new tyre model', rims: 'the hub revision', gearbox: 'the gearbox revision', hydraulics: 'the hydraulics update', elec: 'the electronics update', qc: 'the quality work',
  guns: 'the new wheel guns', jacks: 'the new jacks', crew: 'the crew training', strat: 'the strategy software', tunnel: 'the wind-tunnel upgrade', cfd: 'the CFD cluster', dyno: 'the dyno upgrade', sim: 'the simulator upgrade', tooling: 'the new tooling' };

// ---- the race just run, as the phone remembers it ----------------------------------------------------------------------
const ACCIDENT = /accident|suspension damage|beached|stuck|gravel|stopped on track/i;
/**
 * What happened at the race just run (c.round has moved on): rows when the career passes them (the classification),
 * else read back from the drivers' morale notes and the career's log -> { season, round, track, pos: { did: place (0 a
 * retirement) }, mech: { did: true }, hurt: [{ did, name, team, fate }], fought, grave, fresh, me: { pos, dnf, mech, out } }
 */
const memo = (c, rows = null) => {
  const R = c.round - 1, M = { season: c.season, round: R, track: null, pos: {}, mech: {}, hurt: [], fought: null, grave: false, fresh: false, me: {} };
  const L = arr(c.log), lg = L.length ? L[L.length - 1] : null;
  M.track = lg && lg.round === R ? lg.track : c.calendar?.length && R >= 1 ? c.calendar[(R - 1) % c.calendar.length] : null;
  if (Array.isArray(rows) && rows.length) {
    for (const r of rows) {
      const car = r?.car, did = car?.careerId; if (!did) continue;
      M.pos[did] = car.retired ? 0 : num(r.pos, 0) || 0;
      if (car.retired && !car.wreck && !car.injured && !ACCIDENT.test(car.retireReason || '')) M.mech[did] = true;
      if (car.injured || car.fate) M.hurt.push({ did, name: c.drivers?.[did]?.name || car.name || '', team: car.team || c.drivers?.[did]?.team || '', fate: car.fate === 'killed' ? 'killed' : 'injured' });
    }
  } else {
    // (the morale engine notes every finisher's place - 'P7 at Silverstone, expected P9' - and every retirement)
    for (const d of Object.values(obj(c.drivers))) for (const w of arr(d?.moodWhy)) {
      if (w.season !== c.season || w.round !== R || M.pos[d.id] != null) continue;
      const why = String(w.why || ''), m = /^P(\d+)\b/.exec(why);
      if (m) M.pos[d.id] = +m[1]; else if (/^Won\b/.test(why)) M.pos[d.id] = 1; else if (/^Retired\b/.test(why)) { M.pos[d.id] = 0; M.mech[d.id] = true; } else if (/accident/i.test(why)) M.pos[d.id] = 0;
    }
  }
  const x = c.pr?.ctx; M.fought = x && x.fought && ago(c, x) <= 1 ? x.fought : null;
  M.grave = M.hurt.length > 0 || grave(c);
  // (you: a weekend sat out - banned, or still hurt - is not a result. The classification, when there is one, says
  // whether you raced: the ban just served is already off the licence by now, and the log's place is the stand-in's)
  const pid = c.playerId, md = meOf(c), seen = Array.isArray(rows) && rows.length > 0, sat = seen && !!md && md.alive !== false && !!md.team && !rows.some((r) => r?.car?.careerId === pid);
  const hurtR = !!md && ((md.outUntil != null && md.outUntil >= R) || md.returnRound === c.round);
  const banR = !!md && ((!!md.ban && md.ban.season === c.season && md.ban.round === R) || (sat && !hurtR));
  const outR = !!md && (seen ? sat : banR || hurtR) && !M.hurt.some((h) => h.did === pid);
  let p = M.pos[pid];
  if (p == null && !outR && lg && lg.round === R && lg.you != null) p = c.report && c.report.round === R && c.report.dnf ? 0 : lg.you;
  M.me = { pos: outR ? null : p ?? null, dnf: !outR && p === 0, mech: !!M.mech[pid], out: outR ? (banR ? 'ban' : 'injury') : null };
  M.fresh = R >= 1 && ((lg && lg.round === R) || Object.keys(M.pos).length > 0);
  return M;
};
const memoOf = (c) => { const M = c.social?.race; return M && M.season === c.season && M.round === c.round - 1 ? M : memo(c); };
/** a place in words: 'P4' / 'the retirement' */
const posTxt = (p) => (p > 0 ? `P${p}` : p === 0 ? 'the retirement' : 'that result');
/** the words every text can use: {me} {track} (the race just run) {next} {pos} {posUp} */
const baseT = (c, M) => { const p = M?.me?.pos; return { me: first(meOf(c)?.name) || 'mate', track: trackName(M?.track) || 'the last race', next: nextName(c), pos: posTxt(p), posUp: p > 1 ? `P${p - 1}` : 'P1' }; };
/** a grave week's names: the driver lost, the driver hurt, their team */
const graveT = (c, M) => {
  const k = M.hurt.find((h) => h.fate === 'killed' && h.did !== c.playerId), h = M.hurt.find((x) => x.fate === 'injured' && x.did !== c.playerId);
  return { lost: first(k?.name), lostTeam: k?.team || 'the team', hurt: first(h?.name) };
};

// ---- the phone book -------------------------------------------------------------------------------------------------------
/** a contact id's kind: 'd:<driver>' a driver, 'c:<celeb>' a celebrity, 'x:boss' / 'x:eng' / 'x:pr' your team, 'p:<role>:<id>' one of the party's people */
const kindOf = (cid) => (String(cid).startsWith('d:') ? 'driver' : String(cid).startsWith('c:') ? 'celeb' : String(cid).startsWith('p:') ? 'person' : 'staff');
const STAFF = { boss: 'Team principal', eng: 'Race engineer' };
/** who a contact is, by name -> 'Lando Norris' / 'Mira Vale' / 'your race engineer' */
const nameOf = (c, cid) => {
  const k = kindOf(cid), id = String(cid).slice(2);
  if (k === 'person') return c.social?.people?.[cid]?.name || 'Someone';
  return k === 'driver' ? c.drivers?.[id]?.name || 'Someone' : k === 'celeb' ? CEL(id)?.name || 'Someone' : id === 'boss' ? 'your team principal' : id === 'eng' ? 'your race engineer' : c.pr?.manager?.name || 'your PR manager';
};
const shortOf = (c, cid) => (kindOf(cid) === 'staff' && cid !== 'x:pr' ? nameOf(c, cid) : first(nameOf(c, cid)));
/** a chat the phone shows: a living driver (not you), a celebrity, your team (the PR manager while you have one) */
const visible = (c, cid) => {
  const k = kindOf(cid), id = String(cid).slice(2);
  if (k === 'person') return !!c.social?.people?.[cid];
  return k === 'driver' ? live(c.drivers?.[id]) && id !== c.playerId : k === 'celeb' ? !!CEL(id) : id === 'pr' ? !!c.pr?.manager : id === 'boss' || id === 'eng';
};
const unreadOf = (T) => arr(T).reduce((a, m) => a + (m.from === 'them' && !m.read ? 1 : 0), 0);
/**
 * Everyone you can text: the drivers you met on the grid walk or get on with (friendship or rapport 20+), your
 * team-mate always, the celebrities you have met, your team principal, your race engineer, your PR manager if you hired
 * one -> [{ cid, kind, name, sub, stage, unread, last ({ season, round } of the last message | null), secret }], unread first,
 * then the latest chats, then the people closest to you
 */
export function contactsOf(c) {
  if (!c?.drivers) return [];
  const S = ensure(c), TH = S.phone.threads, out = [], pid = c.playerId, mid = mateIdOf(c), rank = {};
  const ids = new Set([...Object.keys(S.friends), ...Object.keys(TH).filter((k) => k.startsWith('d:')).map((k) => k.slice(2)), ...Object.keys(obj(c.rapport)).filter((k) => rapportOf(c, k) >= 20)]);
  if (mid) ids.add(mid);
  const add = (cid, kind, name, sub, stage, secret, r) => { const T = TH[cid], m = T?.length ? T[T.length - 1] : null; rank[cid] = r; out.push({ cid, kind, name, sub, stage, unread: unreadOf(T), last: m ? { season: m.season, round: m.round } : null, secret }); };
  for (const did of ids) {
    const d = c.drivers[did]; if (!live(d) || did === pid) continue;
    const f0 = S.friends[did], mate = did === mid, cid = `d:${did}`;
    if (!(mate || f0?.met || num(f0?.level, 0) >= 20 || rapportOf(c, did) >= 20 || TH[cid]?.length)) continue;
    const f = friendOf(c, did);
    add(cid, 'driver', d.name, `${d.team || 'Free agent'}${mate ? ' · team-mate' : ''}`, f.stage, false, mate ? 1 : 7 - FS(f.stage));
  }
  const met = new Set(arr(c.celebs?.met));
  for (const C of arr(Celebs.CELEBS)) {
    const b = peek(c, C.id), cid = `c:${C.id}`;
    if (!((b && b.stage !== 'stranger') || met.has(C.id) || TH[cid]?.length)) continue;
    const st = b?.stage && b.stage !== 'stranger' ? b.stage : 'met';
    add(cid, 'celeb', C.name, C.job, st, !!b?.secret, ROM.includes(st) ? 2 : st === 'flirting' ? 3 : 9);
  }
  const team = c.myTeam || meOf(c)?.team || 'Your team';
  add('x:boss', 'staff', STAFF.boss, team, null, false, 20); add('x:eng', 'staff', STAFF.eng, team, null, false, 21);
  if (c.pr?.manager?.name) add('x:pr', 'staff', c.pr.manager.name, 'PR manager', null, false, 22);
  // (the party's people who have texted you: a sponsor's rep, an agent, your trainer - the phone files them with the team)
  for (const [cid, x] of Object.entries(obj(S.people))) if (TH[cid]?.length) add(cid, 'person', x.name, x.sub || '', null, false, 30);
  const lastN = (cid) => { const T = TH[cid]; return T?.length ? num(T[T.length - 1].n, 0) : 0; };
  return out.sort((a, b) => (b.unread > 0) - (a.unread > 0) || lastN(b.cid) - lastN(a.cid) || rank[a.cid] - rank[b.cid] || a.name.localeCompare(b.name));
}
/** a chat, oldest first -> [{ from: 'me' | 'them' | 'sys', text, season, round, read, kind, n }] */
export function threadOf(c, cid) { return arr(c?.social?.phone?.threads?.[cid]); }
/** everything in a chat read */
export function markRead(c, cid) { for (const m of arr(c?.social?.phone?.threads?.[cid])) m.read = true; }
/** messages waiting to be read, across every chat the phone shows -> n */
export function unreadCount(c) {
  const TH = c?.social?.phone?.threads; if (!TH || !c.drivers) return 0;
  let n = 0; for (const [cid, T] of Object.entries(TH)) if (visible(c, cid)) n += unreadOf(T);
  return n;
}
/** how many messages with her are sitting on your phone while it is a secret, or one of several (for the 'texts' exposure) -> n */
export function textTrail(c, id) { return num(c?.social?.phone?.trail?.[id], 0); }

// ---- what you can say ----------------------------------------------------------------------------------------------------
// (the last word in a chat, if it is theirs, from this week, and wants an answer)
const PENDING = new Set(['won', 'podium', 'points', 'low', 'dnf', 'mine', 'banter', 'rival', 'support', 'invite', 'tip', 'finale', 'banOut', 'hurtYou',
  'tvWin', 'tvPod', 'tvOther', 'tvDnf', 'partnerWin', 'partnerPod', 'partnerOk', 'partnerBad', 'check', 'flirt', 'jealous', 'youHurt']);
const pendOf = (c, T) => {
  for (let i = T.length - 1; i >= 0; i--) { const m = T[i]; if (m.from === 'sys' || m.kind === 'system') continue; return m.from === 'them' && PENDING.has(m.kind) && ago(c, m) <= 0 ? m.kind : null; }
  return null;
};
/** everything a text to this contact needs to know, now -> X | null (nobody to text) */
const ctxOf = (c, cid) => {
  const S = ensure(c), k = kindOf(cid), id = String(cid).slice(2), T = arr(S.phone.threads[cid]), M = memoOf(c), sd = S.phone.said[cid];
  const X = { cid, k, id, T: baseT(c, M), thread: T, pend: pendOf(c, T), g: grave(c), M, my: M.me || {}, fresh: !!M.fresh, said: sd && sd.r === rk(c) ? sd.k : [], seed: `${cid}|${rk(c)}|${T.length}`, hurtMe: hurtNow(c, meOf(c)) };
  X.inv = S.invites.find((v) => v.to === 'me' && v.from === cid && v.status === 'pending' && ago(c, v) <= 0) || null; X.planned = liveFor(c, cid);
  if (k === 'driver') {
    const d = c.drivers?.[id]; if (!live(d) || id === c.playerId) return null;
    const f = friendOf(c, id), tp = M.pos?.[id];
    Object.assign(X, { d, f, stage: f.stage, warm: FS(f.stage) >= 2, persona: driverPersona(d.name), mate: id === mateIdOf(c), out: hurtNow(c, d), fought: M.fought === id, rival: rapportOf(c, id) <= -25, their: tp, taste: f.tastes[hash(X.seed) % f.tastes.length] });
    Object.assign(X.T, { first: first(d.name), team: d.team || 'the team', their: posTxt(tp) });
  } else if (k === 'celeb') {
    const C = CEL(id); if (!C) return null;
    const b = bondOf(c, id) || {}, w = pick(C.work, rng(`${X.seed}|w`));
    Object.assign(X, { C, b, stage: b.stage && b.stage !== 'stranger' ? b.stage : 'met', others: seeingIds(c).filter((x) => x !== id), sus: num(b.suspicion, 0), secret: !!b.secret });
    Object.assign(X.T, { her: first(C.name), first: first(C.name), work: toMe(w), Work: cap(toMe(w)), ywork: toYou(w), hobby: C.hobby });
  } else {
    if (!(id === 'boss' || id === 'eng' || (id === 'pr' && c.pr?.manager))) return null;
    Object.assign(X.T, { story: c.pr?.crisis?.story || 'this', title: c.pr?.crisis?.title || '' });
  }
  return X;
};
/** an option: the same words for the same moment (seeded), so the button says what will be sent */
const mk = (X, key, tone, pool) => ({ key, tone, text: fill(pick(pool, rng(`${X.seed}|${key}`)), X.T) });
const adder = (X, o) => (key, tone, pool) => { if (o.length < 4 && !X.said.includes(key) && !o.some((x) => x.key === key) && arr(pool).length) o.push(mk(X, key, tone, pool)); };
/** to a driver: an answer to what they sent first, then something for the moment */
const driverOpts = (c, X) => {
  const o = [], add = adder(X, o), P = X.pend, my = X.my, tp = X.their, st = FS(X.stage);
  if (X.out) { add('getwell', 'kind', MY.getwell); return o; }
  if (X.g) { add(P === 'support' ? 'thanksQuiet' : 'support', 'kind', P === 'support' ? MY.thanksQuiet : MY.support); if (X.inv?.venue === 'coffee') { add('accept', 'kind', MY.acceptQ); add('decline', 'leave', MY.decline); } return o; }
  if (X.inv) { add('accept', 'kind', MY.accept); add('decline', 'leave', MY.decline); }
  if (P === 'won' || P === 'podium' || P === 'points') { add('thanks', 'kind', MY.thanks); if (P !== 'points') add('show', 'show', MY.show); if (X.persona === 'stirrer') add('banterBack', 'banter', MY.banterBack); }
  else if (P === 'finale') add('thanksSeason', 'kind', MY.thanksSeason);
  else if (P === 'banOut' || P === 'hurtYou') add('thanksSoft', 'kind', MY.thanksSoft);
  else if (P === 'low' || P === 'dnf') { add('thanksBad', 'kind', MY.thanksBad); add('shrug', 'firm', MY.shrug); add('cold', 'cold', MY.cold); }
  else if (P === 'rival') { add('sorry', 'sorry', MY.sorry); add('firm', 'firm', MY.firm); add('dig', 'cruel', MY.dig); }
  else if (P === 'mine') { add('congrats', 'kind', MY.congrats); add('banterBack', 'banter', MY.banterBack); }
  else if (P === 'banter') { add('banterBack', 'banter', MY.banterBack); add('kindBack', 'kind', MY.kindBack); add('cold', 'cold', MY.cold); }
  else if (P === 'tip') add('thanksTip', 'kind', MY.thanksTip);
  // (then something for the moment: their race, a fight, a wind-up, a question, a plan)
  if (X.fresh && tp >= 1 && tp <= 3) add('congrats', 'kind', MY.congrats);
  else if (X.fresh && (tp === 0 || tp >= 14) && !X.fought) add('commiserate', 'kind', MY.commiserate);
  if (X.fought) { add('sorry', 'sorry', MY.sorry); add('firm', 'firm', MY.firm); }
  if (st >= 1 && !X.fought) add('banter', 'banter', X.fresh && my.pos > 0 && tp > 0 ? (my.pos < tp ? MY.beat : MY.beaten) : MY_TASTE[X.taste]);
  if ((st >= 2 || X.mate) && c.round <= SPAN(c)) add('advice', 'advice', MY.advice);
  if (st >= 1 && !X.hurtMe && !X.inv && !X.planned) add('plan', 'light', MY.plan);
  if (X.rival && !X.fought) add('dig', 'cruel', MY.dig);
  if (!o.length) add('check', 'kind', MY.check);
  return o;
};
/** to a celebrity: kind words in a grave week or to someone grieving; otherwise what you are to each other decides */
const celebOpts = (c, X) => {
  const o = [], add = adder(X, o), b = X.b, st = X.stage, P = X.pend || '', rom = ROM.includes(st), si = arr(Celebs.STAGES).indexOf(st);
  if (b.grieving) { add('quietKind', 'kind', MYC.quietKind); return o; }
  if (X.g) { add(rom ? 'support' : 'quietKind', 'kind', rom ? MYC.support : MYC.quietKind); return o; }
  if (st === 'ex') { add('exKind', 'kind', MYC.exKind); add('exSorry', 'sorry', MYC.exSorry); return o; }
  if (X.inv) { add('accept', 'kind', MYC.accept); add('decline', 'leave', MYC.decline); }
  if (P === 'jealous' || (rom && X.sus >= 40)) { add('reassure', 'kind', MYC.reassure); if (X.others.length) add('cover', 'cover', MYC.cover); add('sorry', 'sorry', MYC.sorry); }
  if (['tvWin', 'tvPod', 'tvOther', 'partnerWin', 'partnerPod', 'partnerOk'].includes(P)) add('thanks', 'kind', MYC.thanks);
  else if (P === 'tvDnf' || P === 'partnerBad') add('thanksBad', 'kind', MYC.thanksBad);
  else if (P === 'check' || P === 'banOut') add('checkBack', 'kind', MYC.checkBack);
  else if (P === 'flirt') add('flirtBack', 'flirt', MYC.flirtBack);
  if (si <= 1 && !X.thread.some((m) => m.from === 'me')) add('hello', 'kind', MYC.hello);
  if (X.fresh && X.my.pos != null && !P) add('race', 'light', MYC.race);
  if (rom) { add('check', 'kind', MYC.check); add('deep', 'deep', MYC.deep); add('flirt', 'flirt', MYC.flirtD); if (!X.hurtMe && !X.planned) add('plan', 'light', MYC.plan); }
  else { add('work', 'kind', MYC.work); if (si >= 2) add('flirt', 'flirt', st === 'flirting' ? MYC.flirtF : MYC.flirtFr); }
  if (rom && num(b.upset, 0) >= 1) add('sorry', 'sorry', MYC.sorry);
  return o;
};
/** to your team: the car, the debrief, the press (and in a grave week, only thanks) */
const staffOpts = (c, X) => {
  const o = [], add = adder(X, o);
  if (X.id === 'pr') {
    if (X.g) { add('quietPr', 'kind', MYS.quietPr); return o; }
    if (c.pr?.crisis) add('crisis', 'advice', MYS.crisis);
    add('posts', 'advice', MYS.posts); add('image', 'advice', MYS.image);
    return o;
  }
  if (X.g) { add('quiet', 'kind', MYS.quiet); return o; }
  if (X.id === 'boss') { add('car', 'advice', MYS.car); if (X.fresh) add('thanksBoss', 'kind', MYS.thanksBoss); add('push', 'firm', MYS.push); const k = meOf(c)?.contract; if (k && k.until <= c.season) add('future', 'advice', MYS.future); }
  else { if (c.round <= SPAN(c)) add('setup', 'advice', MYS.setup); if (X.fresh) { add('debrief', 'advice', MYS.debrief); add('thanksEng', 'kind', MYS.thanksEng); } }
  return o;
};
const optsOf = (c, X) => { try { return (X.k === 'driver' ? driverOpts : X.k === 'celeb' ? celebOpts : staffOpts)(c, X).slice(0, 4); } catch (e) { warn('reply options failed', e); return []; } };
/**
 * What you could text them now (2-4): answers to what they sent (thanks, banter back, an apology after a clash, yes or no
 * to an invitation, a reassurance or a cover story when she asks who keeps texting you) and things for the moment (a word
 * on their race, a wind-up, a question about the next circuit, 'free this week?', a flirt, a check-in; your boss about
 * the car, your engineer about the set-up, your PR manager about the story of the week). Each is said once a round. A
 * grave week leaves only kind words -> [{ key, text, tone }]
 */
export function replyOptions(c, cid) {
  if (!c?.drivers) return [];
  const X = ctxOf(c, cid); return X ? optsOf(c, X) : [];
}

// ---- sending ---------------------------------------------------------------------------------------------------------------
// (what a text does to a friendship, [decent, stirrer]: the first two to someone in a round count)
const FXD = { congrats: [3, 2], commiserate: [3, 3], thanks: [2, 1], thanksBad: [1, 1], thanksSoft: [2, 2], thanksSeason: [2, 2], shrug: [1, 1], cold: [-2, -1], banter: [1, 3], banterBack: [1, 3], kindBack: [2, 1], show: [-1, 1],
  sorry: [4, 3], firm: [-2, -1], dig: [-6, -3], advice: [2, 1], plan: [1, 1], check: [2, 1], support: [3, 3], thanksQuiet: [2, 2], getwell: [3, 3], thanksTip: [2, 1] };
/** how likely a driver is to say yes to an evening out (where: the place, if known) -> 0.05..0.95 */
const fitOf = (f, v) => arr(f?.tastes).filter((t) => arr(v?.tastes).includes(t)).length;
const yesChance = (c, did, v = null) => {
  const d = c.drivers[did], f = friendOf(c, did), m = moodNow(c, d), kn = ensure(c).phone.keen[`d:${did}`], keen = kn && ago(c, kn) <= 0 ? (kn.yes ? 0.2 : -0.4) : 0;
  return clamp(0.3 + f.level / 100 * 0.5 + (v ? Math.min(0.2, fitOf(f, v) * 0.12) : 0.05) + (m.morale - 55) / 200 + (did === mateIdOf(c) ? 0.05 : 0) + keen - (rapportOf(c, did) <= -40 ? 0.3 : 0), 0.05, 0.95);
};
/** how likely she is to say yes to an evening with you (someone you are seeing, or who has said yes already) */
const dateChance = (c, id, v = null) => {
  const C = CEL(id), b = peek(c, id) || {}, kn = ensure(c).phone.keen[`c:${id}`], keen = kn && ago(c, kn) <= 0 ? (kn.yes ? 0.15 : -0.4) : 0;
  if (b.accepted && !kn) return 0.95;
  const fav = v && v.date && C?.fav === v.date, meh = v && v.date && C?.meh === v.date;
  return clamp(0.7 + num(b.aff, 0) / 300 + (num(b.trust, 30) - 30) / 400 - num(b.upset, 0) * 0.15 + (fav ? 0.1 : meh ? -0.1 : 0) + keen, 0.1, 0.97);
};
const textDriver = (c, X, o) => {
  const key = o.key, f = X.f, S = ensure(c), k = rk(c), s = X.persona === 'stirrer' ? 1 : 0;
  if (f.textRound !== k) { f.textRound = k; f.textN = 0; }
  f.textN++; f.texts++; f.texted = now(c);
  let dv = (FXD[key] || [1, 1])[s];
  if ((key === 'banter' || key === 'banterBack') && X.stage === 'acquaintance') dv = s;
  if (f.textN <= 2 && dv) relateFriend(c, X.id, dv);
  // (an apology mends more than the friendship; a dig costs more than it)
  if (key === 'sorry' && X.fought && f.textN <= 2) relate(c, X.id, 4);
  if (key === 'dig') relate(c, X.id, -4);
  let pool;
  if (key === 'plan') { const yes = chance(yesChance(c, X.id)); S.phone.keen[X.cid] = { season: c.season, round: c.round, yes }; pool = voice(yes ? PLAN_YES : PLAN_NO, X); }
  else if (key === 'advice') {
    X.T.tip = tipOf(c); pool = voice(ADVICE, X);
    if ((X.warm || X.mate) && S.tipRound !== k) { S.tipRound = k; mood(c, 1, `A tip from ${first(X.d.name)}`, 'focus'); }
  } else pool = REP[key] ? voice(REP[key], X) : [`Ha. Okay.`];
  return fill(pick(pool), X.T);
};
// (the texts that count as keeping in touch with her: Celebs.message's once-a-round warmth)
const WARM = new Set(['hello', 'work', 'race', 'flirt', 'check', 'deep', 'plan', 'reassure', 'sorry', 'thanks', 'thanksBad', 'checkBack', 'flirtBack', 'exKind', 'exSorry', 'quietKind', 'support']);
const textCeleb = (c, X, o) => {
  const key = o.key, id = X.id, b = X.b, P = ensure(c).phone, rom = ROM.includes(X.stage), n = arr(P.said[X.cid]?.k).length;
  if (WARM.has(key)) call('message', c, id);
  let pool;
  if (key === 'flirt' || key === 'flirtBack') {
    call('flirt', c, id);
    const d = num(call('talkEffect', c, id, 'flirt'), 2);
    if (n <= 2) call('relateCeleb', c, id, Math.round(d * 0.5));
    pool = d < 2 ? REPC.flirtNo : key === 'flirtBack' ? REPC.flirtBack : REPC.flirtYes[rom ? 'dating' : X.stage === 'flirting' ? 'flirting' : 'friendly'];
  } else if (key === 'deep') { if (n <= 2) call('trustCeleb', c, id, 3); pool = REPC.deep; }
  else if (key === 'reassure') {
    const honest = !X.others.length, yes = chance(clamp(0.35 + num(b.trust, 30) / 150 - X.sus / 200 + (honest ? 0.25 : 0), 0.1, 0.95));
    suspect(c, id, yes ? (honest ? -15 : -10) : -3); if (yes) call('trustCeleb', c, id, 1);
    pool = yes ? REPC.believe : REPC.doubt;
  } else if (key === 'cover') {
    const yes = chance(clamp(0.6 + num(b.trust, 30) / 250 - X.sus / 120, 0.1, 0.9));
    suspect(c, id, yes ? -12 : 6); if (!yes) call('trustCeleb', c, id, -3);
    pool = yes ? REPC.coverYes : REPC.coverNo;
  } else if (key === 'sorry') { if (n <= 2) { call('relateCeleb', c, id, 2); call('trustCeleb', c, id, 1); } pool = REPC.sorry; }
  else if (key === 'plan') { const yes = chance(dateChance(c, id)); P.keen[X.cid] = { season: c.season, round: c.round, yes }; pool = yes ? REPC.planYes : REPC.planNo; }
  else if (key === 'race') pool = X.my.pos === 1 ? REPC.raceWin : X.my.dnf || X.my.pos >= 11 ? REPC.raceBad : REPC.raceOk;
  else pool = REPC[key] || REPC.work;
  // (a romance you keep quiet, or one of several: every message is a trail someone could find, until the chat is deleted)
  if ((b.secret || X.others.length) && ['flirting', 'dating', 'partner'].includes(X.stage)) P.trail[id] = num(P.trail[id], 0) + 1;
  return fill(pick(pool), X.T);
};
/** the factory's next arrival, as the team principal puts it */
const devLine = (c) => {
  const L = arr(c.teams?.[c.myTeam]?.dev).slice().sort((a, b) => num(a.left, 9) - num(b.left, 9));
  if (!L.length) return pick([`Nothing in the pipeline this week. Get me points and I'll get you parts.`, `Nothing new yet. The budget's committed elsewhere for now.`]);
  const x = L[0], nm = PART[x.id] || 'the next upgrade', when = num(x.left, 1) <= 1 ? 'straight after this weekend' : `in ${x.left} races`;
  return `${pick([`${cap(nm)} should be on the car ${when}.`, `The factory's on ${nm}. Expect it ${when}.`])}${L[1] ? ` Then ${PART[L[1].id] || 'more'}.` : ''}`;
};
/** your PR manager's word on what to post (the safest post that is not stale) */
const postTip = (c) => {
  let L = []; try { L = arr(socialPosts(c)); } catch (e) { warn('posts failed', e); }
  const ok = L.filter((p) => p.ok !== false && !p.quiet && !num(p.recent, 0)).sort((a, b) => num(a.risk, 0) - num(b.risk, 0));
  if (!ok.length) return pick([`You've posted enough this week. Leave it.`, `Nothing this week. Let the driving do the talking.`]);
  return pick([`"${ok[0].label}". Low risk, and the fans like it.`, `I'd go with "${ok[0].label}". Safe, and it lands well.`]);
};
/** your PR manager's read of the week: image, heat, following */
const imageTip = (c) => {
  const P = c.pr || {}, im = num(P.image, 0), ht = num(P.heat, 0), tail = ht >= 45 ? pick(PRN.heat) : im >= 55 ? pick(PRN.good) : pick(PRN.calm);
  return `Image: ${imageLabel(im).toLowerCase()}. Heat: ${heatLabel(ht).toLowerCase()}. ${fameText(num(P.fame, 0))} followers. ${tail}`;
};
/** the PR manager on the story waiting for an answer (PR.crisisAdvice) */
const advise = (c) => { let a = null; try { a = crisisAdvice(c); } catch (e) { warn('advice failed', e); } return a?.text ? `${c.pr?.crisis?.title || 'This one'}. ${a.text}` : null; };
const textStaff = (c, X, o) => {
  const key = o.key, S = ensure(c);
  if (key === 'car') return fill(devLine(c), X.T);
  if (key === 'setup') {
    if (S.engRound !== rk(c)) { S.engRound = rk(c); mood(c, 2, `A plan for ${nextName(c)} with your engineer`, 'focus'); }
    return `${fill(pick(REPS.setup), X.T)} ${tipOf(c)}`;
  }
  if (key === 'crisis') return advise(c) || `Nothing to answer right now. Enjoy it.`;
  if (key === 'posts') return postTip(c);
  if (key === 'image') return imageTip(c);
  return fill(pick(REPS[key] || [`Noted.`]), X.T);
};
/**
 * Send one of replyOptions' texts (key): yours and their answer go into the chat at once (the phone types it out), and
 * it does what it does - friendship and rapport with a driver (the first two texts a round count), affection, trust and
 * suspicion with her (a secret romance leaves a trail until the chat is deleted), a tip or a plan from your team.
 * Eight messages a round, then the battery has had enough -> { ok, text (yours), reply (theirs) }
 */
export function sendText(c, cid, key) {
  if (!c?.drivers) return { ok: false, text: 'No signal.', reply: null };
  const X = ctxOf(c, cid); if (!X) return { ok: false, text: 'You cannot text them now.', reply: null };
  const o = optsOf(c, X).find((x) => x.key === key); if (!o) return { ok: false, text: 'That moment has passed.', reply: null };
  if ((key === 'accept' || key === 'decline') && X.inv) { const r = answer(c, X.inv, key === 'accept', o.text); return r.ok ? { ok: true, text: o.text, reply: r.reply } : { ok: false, text: r.text, reply: null }; }
  const S = ensure(c), P = S.phone, k = rk(c), n = num(P.sent[k], 0);
  if (n >= MAX_SENDS) return { ok: false, text: `Your phone's at 1%. It'll keep until next week.`, reply: null };
  P.sent[k] = n + 1;
  const sd = P.said[cid] && P.said[cid].r === k ? P.said[cid] : (P.said[cid] = { r: k, k: [] }); sd.k.push(key);
  push(c, cid, 'me', o.text, 'text');
  let reply;
  try { reply = X.k === 'driver' ? textDriver(c, X, o) : X.k === 'celeb' ? textCeleb(c, X, o) : textStaff(c, X, o); } catch (e) { warn('the reply failed', e); reply = ''; }
  if (!reply) reply = pick([`Ha. Okay.`, `Noted.`, `Speak soon.`]);
  push(c, cid, 'them', reply, 'reply');
  return { ok: true, text: o.text, reply };
}
/** clear a chat for good: nothing left on your phone (a secret one no longer leaves a trail) -> { text } */
export function deleteThread(c, cid) {
  if (!c) return { text: 'Nothing to delete.' };
  const S = ensure(c), P = S.phone, had = arr(P.threads[cid]).length;
  delete P.threads[cid]; delete P.said[cid];
  if (!had) return { text: 'Nothing to delete.' };
  P.deleted[cid] = num(P.deleted[cid], 0) + 1;
  if (kindOf(cid) === 'celeb') { const id = cid.slice(2); P.trail[id] = 0; if (peek(c, id)?.secret || seeingIds(c).length > 1) return { text: 'Deleted. Not a trace of it on your phone.' }; }
  return { text: 'Chat deleted.' };
}

// ---- plans: invitations out and in ---------------------------------------------------------------------------------------
/** who an invitation is for: yours, the guests who said yes; theirs, the host and anyone they are bringing */
const partyOf = (v) => (v.to === 'me' ? [v.from, ...arr(v.guests).filter((g) => g !== v.from)] : arr(v.guests));
const liveFor = (c, cid) => ensure(c).invites.some((v) => ago(c, v) <= 0 && ['pending', 'accepted'].includes(v.status) && partyOf(v).includes(cid));
const newId = (c) => `inv-${c.season}-${c.round}-${++ensure(c).seq}`;
const trimInvites = (S) => { if (S.invites.length > INV_CAP) S.invites.splice(0, S.invites.length - INV_CAP); };
/** one guest's answer -> { cid, yes, text (their reply) } | { cid, hard: 'why not' } (no question was ever put) */
const guestAnswer = (c, cid, v, k, g) => {
  const id = cid.slice(2);
  if (kindOf(cid) === 'driver') {
    const d = c.drivers?.[id]; if (!live(d) || id === c.playerId) return { cid, hard: 'They are not around.' };
    const X = { persona: driverPersona(d.name), warm: FS(friendOf(c, id).stage) >= 2 };
    if (hurtNow(c, d)) return { cid, yes: false, text: pick(RESTING) };
    const f = friendOf(c, id), yes = chance(g || v.quiet ? clamp(0.55 + f.level / 100 * 0.4, 0.3, 0.95) : yesChance(c, id, v));
    if (v.quiet) return { cid, yes, text: pick(yes ? YES_Q : NO_Q) };
    if (yes) return { cid, yes, text: X.persona === 'stirrer' && YES_V[v.id] && chance(0.4) ? pick(YES_V[v.id]) : pick(voice(YES_D, X)) };
    return { cid, yes, text: !fitOf(f, v) && chance(0.5) ? pick(NO_TASTE) : pick(voice(NO_D, X)) };
  }
  const C = CEL(id); if (!C) return { cid, hard: 'Nobody to ask.' };
  const b = bondOf(c, id) || {}, F = first(C.name), T = { work: toMe(pick(C.work)), her: F }, st = b.stage || 'met';
  if (b.grieving) return { cid, hard: 'Not now.' };
  if (st === 'ex') return { cid, hard: `${F} is not ready for that.` };
  if (k !== 'date') {
    // (a night out with friends: she comes along as a friend, if you are friends)
    if (arr(Celebs.STAGES).indexOf(st) < 2) return { cid, hard: `You do not know ${F} well enough yet.` };
    const yes = chance(clamp(0.35 + num(b.aff, 0) / 150, 0.15, 0.85)); return { cid, yes, text: fill(pick(yes ? CYES_GROUP : CNO), T) };
  }
  const fav = v.date && C.fav === v.date, meh = v.date && C.meh === v.date;
  if (ROM.includes(st) || b.accepted) { const yes = chance(dateChance(c, id, v)); return { cid, yes, text: fill(pick(yes ? (fav ? CYES_FAV : meh ? CYES_MEH : CYES) : CNO), T) }; }
  if (st !== 'flirting') return { cid, hard: `Get to know ${F} a little better first.` };
  // (someone you are flirting with: the invitation is asking her out, and Celebs decides)
  const why = call('askOutWhy', c, id); if (why) return { cid, hard: `${why}.` };
  const r = call('askOut', c, id), yes = !!r?.ok;
  return { cid, yes, text: fill(pick(yes ? (fav ? CYES_FAV : CYES) : CNO_ASK), T), soft: !yes };
};
/**
 * Ask one or more people out (cids: 'd:' drivers - up to three, a night out together - or 'c:' a celebrity for a date)
 * to a place this week (venue: an id). Each answers for themselves: a driver by how well you get on, whether it is their
 * kind of place, how they feel and whether they said they were free; she by where you stand (asking out someone you are
 * flirting with is Celebs' askOut). The question and the answer land in each chat. A yes is booked in THE WEEK (an
 * accepted invitation not used this round lapses). A grave week: a quiet coffee with a driver, nothing else -> { ok,
 * text, invite }
 */
export function inviteOut(c, cids, venue) {
  const no = (text) => ({ ok: false, text, invite: null });
  if (!c?.drivers) return no('No signal.');
  const S = ensure(c), v = VENUE_BY_ID[venue && typeof venue === 'object' ? venue.id : venue], L = [...new Set(arr(cids).map(String))].filter((x) => /^[dc]:/.test(x));
  if (!v) return no('Pick somewhere to go.');
  if (!L.length) return no('Pick someone to ask.');
  if (L.length > 3) return no('Three at most: it is an evening out, not a party.');
  const cel = L.filter((x) => x.startsWith('c:')), k = L.length > 1 ? 'group' : cel.length ? 'date' : 'friend', g = grave(c), me = meOf(c);
  if (!live(me)) return no('Choose your driver first.');
  if (g && cel.length) return no('Not this week.');
  if (hurtNow(c, me) && (k !== 'date' || v.id !== 'apartment')) return no(k === 'date' ? 'You are meant to be resting: a quiet evening at home, at most.' : 'You are meant to be resting this week.');
  const why = venueWhy(c, v, k, g); if (why) return no(`${why}.`);
  const theirs = L.find((x) => S.invites.some((w) => w.to === 'me' && w.from === x && w.status === 'pending' && ago(c, w) <= 0));
  if (theirs) return no(`${shortOf(c, theirs)} has already asked you out this week: answer in PLANS.`);
  const asked = L.find((x) => S.invites.some((w) => w.to !== 'me' && ago(c, w) <= 0 && arr(w.asked).includes(x)) || liveFor(c, x));
  if (asked) return no(`You already have plans with ${shortOf(c, asked)} this week.`);
  const n = num(S.phone.sent[rk(c)], 0); if (n >= MAX_SENDS) return no(`Your phone's at 1%. It'll keep until next week.`);
  const A = L.map((x) => guestAnswer(c, x, v, k, g)), hard = A.filter((a) => a.hard), asks = A.filter((a) => !a.hard);
  if (!asks.length) return no(hard[0]?.hard || 'Nobody to ask.');
  S.phone.sent[rk(c)] = n + 1;
  const yes = asks.filter((a) => a.yes).map((a) => a.cid), nope = asks.filter((a) => !a.yes).map((a) => a.cid), pool = MY_INV[v.id] || MY_INV.simlounge, base = pick(k === 'date' ? pool.date || pool.friend : pool.friend);
  const inv = { id: newId(c), from: 'me', to: asks[0].cid, kind: k === 'date' ? 'date' : 'hangout', venue: v.id, guests: yes.length ? yes : asks.map((a) => a.cid), asked: asks.map((a) => a.cid), declined: nope, msg: '', season: c.season, round: c.round, status: yes.length ? 'accepted' : 'declined' };
  for (const a of asks) {
    const others = asks.filter((b) => b !== a).map((b) => shortOf(c, b.cid)), msg = others.length ? `${base} ${fill(pick(others.length > 1 ? OTHERS : OTHER1), { others: list(others) })}` : base;
    if (!inv.msg) inv.msg = msg;
    push(c, a.cid, 'me', msg, 'invite'); push(c, a.cid, 'them', a.text, 'reply');
  }
  S.invites.push(inv); trimInvites(S);
  const Y = yes.map((x) => shortOf(c, x)), N = [...nope, ...hard.map((a) => a.cid)].map((x) => shortOf(c, x));
  let text;
  if (asks.length === 1 && !hard.length) text = yes.length ? `${Y[0]} is in: ${v.name.toLowerCase()}. Book it in THE WEEK.` : asks[0].soft ? `${N[0]} said not yet. Give it a little time.` : `${N[0]} can't make it this week.`;
  else text = yes.length ? `${list(Y)} ${Y.length > 1 ? 'are' : 'is'} in${N.length ? `; ${list(N)} can't make it` : ''}. Book it in THE WEEK.` : 'Nobody can make it this week.';
  if (yes.length) note(c, `Plans this week: ${v.name.toLowerCase()} with ${list(Y)}.`);
  return { ok: yes.length > 0, text, invite: inv };
}
/** your answer to an invitation (my: the words, when it came from a reply in the chat) -> { ok, text, reply } */
const answer = (c, v, yes, my = null) => {
  const cid = v.from, k = kindOf(cid), id = cid.slice(2), venue = VENUE_BY_ID[v.venue], meHurt = hurtNow(c, meOf(c));
  if (yes && grave(c) && !venue?.quiet) return { ok: false, text: 'Not this week.' };
  if (yes && meHurt && !(v.kind === 'date' && v.venue === 'apartment')) return { ok: false, text: 'You are meant to be resting this week.' };
  v.status = yes ? 'accepted' : 'declined';
  let X = { persona: 'decent', warm: false };
  if (k === 'driver' && c.drivers?.[id]) X = { persona: driverPersona(c.drivers[id].name), warm: FS(friendOf(c, id).stage) >= 2 };
  const mine = my || pick(yes ? (k === 'celeb' ? MYC.accept : venue?.quiet ? MY.acceptQ : MY.accept) : k === 'celeb' ? MYC.decline : MY.decline);
  const reply = k === 'celeb' ? pick(yes ? CACCEPT_R : CDECLINE_R) : venue?.quiet ? pick(yes ? ACCEPT_Q : DECLINE_Q) : pick(voice(yes ? ACCEPT_R : DECLINE_R, X));
  push(c, cid, 'me', mine, 'text'); push(c, cid, 'them', reply, 'reply');
  if (k === 'driver') { const f = friendOf(c, id); bump(c, ensure(c), id, f, yes ? 2 : -1); }
  else if (k === 'celeb') call('relateCeleb', c, id, yes ? 2 : -2);
  if (yes) note(c, `Plans this week: ${venue ? venue.name.toLowerCase() : 'an evening out'} with ${shortOf(c, cid)}.`);
  return { ok: true, text: yes ? `Accepted: ${venue ? venue.name.toLowerCase() : 'an evening out'}. Book it in THE WEEK.` : 'Turned down. Maybe next time.', reply };
};
/** answer an invitation sent to you (accept: true / false): the reply goes into their chat, a yes waits in THE WEEK -> { text } */
export function respondInvite(c, id, accept) {
  if (!c?.social) return { text: 'Nothing to answer.' };
  const S = ensure(c), v = S.invites.find((x) => String(x.id) === String(id));
  if (!v || v.to !== 'me') return { text: 'That invitation has gone.' };
  if (v.status !== 'pending') return { text: v.status === 'accepted' ? 'Already accepted. Book it in THE WEEK.' : 'That invitation has lapsed.' };
  if (ago(c, v) >= 1) { v.status = 'expired'; return { text: 'That invitation has lapsed.' }; }
  return { text: answer(c, v, !!accept).text };
}
/** whether a place suits these guests: her favourite evening, or a driver's taste -> 'Lando likes a game or two' | null */
const fitText = (c, L, v) => {
  if (L.length === 1 && L[0].startsWith('c:')) { const C = CEL(L[0].slice(2)); if (!C || !v.date) return null; return C.fav === v.date ? `${first(C.name)} would love this` : C.meh === v.date ? `Not really ${first(C.name)}'s thing` : null; }
  for (const x of L) { if (!x.startsWith('d:')) continue; const f = c.social?.friends?.[x.slice(2)], t = arr(f?.tastes).find((q) => v.tastes.includes(q)); if (t) return `${first(c.drivers?.[x.slice(2)]?.name)} ${TASTE_TXT[t]}`; }
  return null;
};
/** the places for these guests this week, each with why it cannot be booked ('' when it can) and whether it suits them -> [{ venue, why, fit }] */
export function venuesFor(c, cids = []) {
  const L = arr(cids).map(String), k = L.length > 1 ? 'group' : L.some((x) => x.startsWith('c:')) ? 'date' : 'friend', g = c ? grave(c) : false;
  return VENUES.map((v) => ({ venue: v, why: c ? venueWhy(c, v, k, g) : v.where ? `${trackName(v.where)} week only` : '', fit: c ? fitText(c, L, v) : null }));
}
/**
 * The evenings arranged for this week, ready for THE WEEK to book: { id, kind ('hangout' | 'date'), venue, guests
 * [cids], arg (Agenda's: 'venue|cid,cid' for a hangout, 'celebId|venue' for a date), label, scene } -> [..]
 */
export function bookable(c) {
  if (!c?.social) return [];
  return ensure(c).invites.filter((v) => v.status === 'accepted' && ago(c, v) <= 0).map((v) => {
    const gs = partyOf(v), V0 = VENUE_BY_ID[v.venue], date = v.kind === 'date' && gs.length === 1 && gs[0].startsWith('c:');
    return { id: v.id, kind: v.kind, venue: v.venue, guests: gs, arg: date ? `${gs[0].slice(2)}|${v.venue}` : `${v.venue}|${gs.join(',')}`, label: `${V0?.name || v.venue} with ${list(gs.map((x) => shortOf(c, x)))}`, scene: !!V0?.scene };
  });
}

// ---- the inbox: after every race ---------------------------------------------------------------------------------------------
/** the place a driver would suggest: open this week, affordable, theirs (never your flat; a coffee only in a grave week) */
const venueFor = (c, f, k) => {
  const L = VENUES.filter((v) => !v.quiet && v.id !== 'apartment' && !venueWhy(c, v, k, false)); if (!L.length) return null;
  let x = Math.random() * L.reduce((a, v) => a + 1 + 2 * fitOf(f, v), 0);
  for (const v of L) { x -= 1 + 2 * fitOf(f, v); if (x <= 0) return v; }
  return L[L.length - 1];
};
/** her idea of an evening: her favourite if it is open this week, else somewhere quiet and good */
const dateVenueFor = (c, C) => {
  const ok = (v) => v && !venueWhy(c, v, 'date', false), fav = VENUES.find((v) => v.date && v.date === C.fav);
  if (ok(fav)) return fav;
  return ['restaurant', 'apartment', 'karting', 'simlounge', 'pub', 'rooftop'].map((id) => VENUE_BY_ID[id]).find((v) => ok(v) && v.date !== C.meh) || null;
};
const inviteIn = (c, cid, v, kind, guests, text) => {
  const S = ensure(c), inv = { id: newId(c), from: cid, to: 'me', kind, venue: v.id, guests: [cid, ...guests], msg: text, season: c.season, round: c.round, status: 'pending' };
  S.invites.push(inv); trimInvites(S); push(c, cid, 'them', text, 'invite');
  return inv;
};
/**
 * After each race (Career.applyRace, after the round moves on; rows: the classification, for richer texts): the messages
 * that come in - friends on your result or theirs, a wind-up, a tip, someone you clashed with; your team principal,
 * your engineer, your PR manager (on the story waiting for an answer); the celebrities (who saw you on TV, the one you
 * are seeing, and the one who wants to know who keeps texting you); and an invitation or two. A grave round: only kind
 * words and, from a close friend, the offer of a quiet coffee. If your driver was killed, nothing (the career turns to
 * whoever you become) -> { lines } (for the report)
 */
export function inboxTick(c, rows = null) {
  const lines = []; if (!c?.drivers || !c.playerId) return { lines };
  const S = ensure(c), M = S.race = memo(c, rows), pid = c.playerId;
  if (M.hurt.some((h) => h.did === pid && h.fate === 'killed')) return { lines };
  const g = M.grave, me = M.me, out = me.out, hurtIds = new Set(M.hurt.map((h) => h.did)), youHurt = hurtIds.has(pid), got = [], invs = [], T0 = baseT(c, M), mid = mateIdOf(c);
  const said = new Set(), say = (cid, text, kind) => { if (!text) return; push(c, cid, 'them', text, kind); got.push(cid); said.add(text); };
  // (two people never send the very same words in one round)
  const fresh = (pool, T) => { const L = arr(pool).map((s) => fill(s, T)), u = L.filter((s) => !said.has(s)); return pick(u.length ? u : L); };
  const ok = (did) => { const d = c.drivers[did]; return live(d) && did !== pid && !hurtIds.has(did) && !hurtNow(c, d); };
  const XD = (did) => { const d = c.drivers[did], f = friendOf(c, did), tp = M.pos[did]; return { d, f, persona: driverPersona(d.name), warm: FS(f.stage) >= 2, T: { ...T0, first: first(d.name), team: d.team || 'the team', their: posTxt(tp) } }; };
  if (mid) friendOf(c, mid);
  const F = friendsBy(c).filter(([did]) => ok(did));
  if (g) {
    // (a grave round: the team, the people closest to you and the ones you are seeing - kind words, nothing else)
    const gT = graveT(c, M), pool = youHurt ? SUPPORT.you : gT.lost ? SUPPORT.killed : gT.hurt ? SUPPORT.injured : SUPPORT.any;
    say('x:boss', fill(pick(youHurt ? BOSS.you : BOSS.grave), T0), 'support');
    if (chance(0.6)) say('x:eng', fill(pick(ENG.grave), T0), 'support');
    if (c.pr?.manager) say('x:pr', pick(PRN.grave), 'support');
    let n = 0;
    for (const [did, f] of F) { if (n >= 4) break; if (did !== mid && FS(f.stage) < 2) continue; if (chance(did === mid ? 0.85 : 0.6)) { say(`d:${did}`, fresh(pool, { ...T0, ...gT }), 'support'); n++; } }
    for (const id of seeingIds(c)) if (!peek(c, id)?.grieving && chance(0.9)) say(`c:${id}`, fresh(youHurt ? CIN.youHurt : CIN.support, T0), 'support');
    if (!youHurt && !hurtNow(c, meOf(c))) { const m = F.find(([did, f]) => FS(f.stage) >= 3 && !liveFor(c, `d:${did}`) && chance(0.45)); if (m) { inviteIn(c, `d:${m[0]}`, VENUE_BY_ID.coffee, 'hangout', [], pick(IN_INV.coffee.cd)); got.push(`d:${m[0]}`); } }
    if (got.length) lines.push(youHurt ? 'Messages of support from the team and your friends in the paddock.' : 'Messages of support from around the paddock.');
    return { lines };
  }
  const fin = c.round > SPAN(c), p = me.pos;
  let exp = 10; try { exp = num(c.expectedPos?.(pid), 10); } catch (e) { /* (a career without an expectation: mid-grid) */ }
  // (the team)
  const bp = fin ? BOSS.finale : out === 'ban' ? BOSS.ban : out === 'injury' ? BOSS.you : p === 1 ? BOSS.won : p >= 2 && p <= 3 ? BOSS.podium : me.dnf ? (me.mech ? BOSS.mech : BOSS.crash) : p != null && p > exp + 2 ? BOSS.under : BOSS.good;
  if ((p != null || out || fin) && chance(p === 1 || (me.dnf && me.mech) || fin || out ? 1 : 0.7)) say('x:boss', fill(pick(bp), T0), 'boss');
  if (!out && !fin && p != null && chance(0.45)) say('x:eng', fill(pick(me.dnf || p >= 12 ? ENG.bad : ENG.normal), T0), 'eng');
  if (c.pr?.manager) { const a = c.pr.crisis ? advise(c) : null; if (a) say('x:pr', a, 'pr'); else if (chance(0.25)) say('x:pr', imageTip(c), 'pr'); }
  // (your friends, the team-mate first: on your race, on theirs, a wind-up or a tip)
  const P_ST = [0, 0.2, 0.4, 0.6, 0.8];
  let n = 0;
  for (const [did, f] of F) {
    if (n >= 4) break;
    const mate = did === mid, st = FS(f.stage); if (!mate && st < 1) continue;
    if (!chance(Math.min(0.95, P_ST[st] + (mate ? 0.3 : 0)))) continue;
    const X = XD(did), t = typeFor(c, M, did, X); if (!t) continue;
    let pool;
    if (t === 'banter') pool = IN_TASTE[pick(f.tastes)] || IN_TASTE.coffee;
    else if (t === 'hurtYou') pool = HURT_YOU;
    else { if (t === 'tip') X.T.tip = tipOf(c); pool = voice(IN[t], X); }
    say(`d:${did}`, fresh(pool, X.T), t); n++;
  }
  // (someone you clashed with on track has something to say about it)
  const fo = M.fought;
  if (fo && ok(fo) && !got.includes(`d:${fo}`) && chance(0.7)) { const X = XD(fo); say(`d:${fo}`, fresh(voice(IN.rival, X), X.T), 'rival'); bump(c, S, fo, X.f, -2); }
  // (the celebrities: the one you are seeing, someone you are flirting with, someone who caught the race on TV)
  const seeing = seeingIds(c);
  let nc = 0;
  for (const C of arr(Celebs.CELEBS)) {
    if (nc >= 3) break;
    const b = peek(c, C.id); if (!b || b.grieving || b.stage === 'stranger' || b.stage === 'ex') continue;
    const rom = ROM.includes(b.stage), others = seeing.filter((x) => x !== C.id), w = toMe(pick(C.work)), T = { ...T0, her: first(C.name), work: w, Work: cap(w), hobby: C.hobby };
    const tv = p === 1 ? 'tvWin' : p >= 2 && p <= 3 ? 'tvPod' : me.dnf ? 'tvDnf' : 'tvOther';
    let kind = null;
    if (rom && others.length && num(b.suspicion, 0) >= 40 && chance(0.6)) kind = 'jealous';
    else if (rom && chance(0.8)) kind = out === 'ban' ? 'banOut' : out || fin || p == null ? 'check' : p === 1 ? 'partnerWin' : me.dnf || p >= 11 ? 'partnerBad' : p <= 3 ? 'partnerPod' : 'partnerOk';
    else if (b.stage === 'flirting' && chance(0.45)) kind = p != null && !out && chance(0.5) ? tv : 'flirt';
    else if (!rom && p != null && !out && chance(p === 1 ? 0.3 : p >= 2 && p <= 3 ? 0.18 : 0.06)) kind = tv;
    if (!kind) continue;
    say(`c:${C.id}`, fresh(CIN[kind], T), kind); nc++;
  }
  // (an invitation, one a round at most - likelier the closer your friends are - or an evening from the one you are seeing)
  const meHurt = out === 'injury' || hurtNow(c, meOf(c)), cand = F.filter(([did, f]) => FS(f.stage) >= 2 && !liveFor(c, `d:${did}`));
  if (!meHurt && !fin && cand.length && chance(0.15 + 0.08 * FS(cand[0][1].stage))) {
    let x = Math.random() * cand.reduce((a, [, f]) => a + f.level, 0), [did, f] = cand[0];
    for (const e of cand) { x -= e[1].level; if (x <= 0) { [did, f] = e; break; } }
    const X = XD(did), v = venueFor(c, f, 'friend');
    if (v) {
      const o2 = v.kinds.includes('group') && chance(0.3) ? F.find(([d2, f2]) => d2 !== did && FS(f2.stage) >= 1 && !liveFor(c, `d:${d2}`)) : null;
      const txt = `${fill(pick(voice(IN_INV[v.id] || IN_INV.simlounge, X)), X.T)}${o2 ? ` ${fill(pick(GROUP_ADD), { other: first(c.drivers[o2[0]].name) })}` : ''}`;
      inviteIn(c, `d:${did}`, v, 'hangout', o2 ? [`d:${o2[0]}`] : [], txt); got.push(`d:${did}`); invs.push(`d:${did}`);
    }
  }
  if (!fin) for (const id of seeing) {
    const b = peek(c, id), C = CEL(id); if (!b || !C || num(b.upset, 0) >= 2 || liveFor(c, `c:${id}`) || !chance(meHurt ? 0.5 : 0.25)) continue;
    const v = meHurt ? VENUE_BY_ID.apartment : dateVenueFor(c, C); if (!v) continue;
    inviteIn(c, `c:${id}`, v, 'date', [], fill(pick(meHurt ? CIN_INV.visit : CIN_INV[v.id] || CIN_INV.restaurant), { her: first(C.name), work: toMe(pick(C.work)) })); got.push(`c:${id}`); invs.push(`c:${id}`);
    break;
  }
  const who = [...new Set(got)];
  const nm = who.slice(0, 3).map((x) => shortOf(c, x));
  if (who.length) lines.push(`${who.length} new message${who.length > 1 ? 's' : ''} on your phone: ${who.length > 3 ? `${nm.join(', ')} and others` : list(nm)}.`);
  for (const x of invs) { const v = [...S.invites].reverse().find((w) => w.from === x); if (v) lines.push(`${shortOf(c, x)} ${v.kind === 'date' ? 'wants an evening with you' : 'has invited you out'} this week: ${VENUE_BY_ID[v.venue]?.name.toLowerCase() || 'somewhere'}.`); }
  return { lines };
}
/** what a friend texts about after a race (null: nothing this time) */
const typeFor = (c, M, did, X) => {
  const me = M.me, p = me.pos, t = M.pos[did];
  if (c.round > SPAN(c)) return 'finale';
  if (me.out === 'ban') return 'banOut';
  if (me.out === 'injury') return X.warm && chance(0.6) ? 'hurtYou' : null;
  if (X.warm && chance(0.12)) return 'tip';
  if (p === 1) return 'won';
  if (p >= 2 && p <= 3) return 'podium';
  if (me.dnf) return 'dnf';
  if (t >= 1 && t <= 3 && chance(0.5)) return 'mine';
  if (p >= 4 && p <= 10) return chance(0.6) ? 'points' : 'banter';
  if (p >= 11) return chance(0.55) ? 'low' : 'banter';
  return 'banter';
};

// ---- the round's end ---------------------------------------------------------------------------------------------------------
/**
 * Once a round (Career.applyRace, after the round moves on): a friendship (friend or closer) with no time together for
 * three rounds fades (2 a round, 1 if you kept texting); plans not taken up lapse (a yes you never booked costs a
 * little); good mates steady you (morale +1 for each mate or best mate, +3 at most) and getting on with your team-mate
 * keeps you composed; a word gets around the paddock about someone you are seeing on the quiet, now and then. Paused
 * while you recover from an injury, and in a grave week nothing fades -> { lines }
 */
export function friendsRoundTick(c) {
  const lines = []; if (!c?.drivers) return { lines };
  const S = ensure(c), g = grave(c), me = meOf(c), resting = hurtNow(c, me) || (!!me && me.returnRound === c.round), mid = mateIdOf(c);
  let mates = 0, mateOk = false;
  for (const [did, f] of Object.entries(S.friends)) {
    const d = c.drivers[did]; if (!live(d) || did === c.playerId) continue;
    f.idle = ago(c, f.last);
    if (!g && !resting && FS(f.stage) >= 2 && f.idle >= 3) bump(c, S, did, f, ago(c, f.texted) <= 1 ? -1 : -2);
    if (FS(f.stage) >= 3 && !hurtNow(c, d)) mates++;
    if (did === mid && FS(f.stage) >= 2) mateOk = true;
  }
  // (plans: an unanswered invitation expires; a yes never booked lapses, and they notice)
  for (const v of S.invites) {
    if (ago(c, v) < 1) continue;
    if (v.status === 'pending') v.status = 'expired';
    else if (v.status === 'accepted') {
      v.status = 'lapsed';
      if (g || resting) continue;
      const gs = partyOf(v).filter((x) => x !== 'me'), names = gs.map((x) => shortOf(c, x));
      for (const x of gs) { if (x.startsWith('d:') && c.drivers?.[x.slice(2)]) bump(c, S, x.slice(2), friendOf(c, x.slice(2)), -2); else if (x.startsWith('c:')) call('relateCeleb', c, x.slice(2), -2); }
      if (names.length) { const t = `You never followed up the plans with ${list(names)}.`; note(c, t); lines.push(t); }
    }
  }
  S.invites = S.invites.filter((v) => ago(c, v) <= 3); trimInvites(S);
  // (the phone's housekeeping: this round's counts only)
  for (const k of Object.keys(S.phone.sent)) if (k !== rk(c)) delete S.phone.sent[k];
  for (const k of Object.keys(S.phone.said)) if (S.phone.said[k]?.r !== rk(c)) delete S.phone.said[k];
  for (const k of Object.keys(S.phone.keen)) if (ago(c, S.phone.keen[k]) > 0) delete S.phone.keen[k];
  // (good friends steady you)
  if (!resting && me) {
    if (mates) mood(c, Math.min(3, mates), mates > 1 ? 'Good friends in the paddock' : 'A good friend in the paddock');
    if (mateOk && c.drivers[mid]) mood(c, 2, `Getting on well with ${first(c.drivers[mid].name)}`, 'composure');
  }
  // (a secret is hard to keep in a paddock: a mate who likes a wind-up may let something slip - nobody says who)
  if (!g && !resting) {
    const loose = Object.entries(S.friends).some(([did, f]) => FS(f.stage) >= 3 && ago(c, f.last) <= 2 && live(c.drivers[did]) && driverPersona(c.drivers[did].name) === 'stirrer');
    if (loose) for (const id of seeingIds(c)) if (peek(c, id)?.secret && chance(0.04)) { const r = expose(c, 'friend', [id], 1); if (r?.text) lines.push(r.text); break; }
  }
  return { lines };
}

// ---- an evening out ---------------------------------------------------------------------------------------------------------
const MOMENTS = {
  pub: { d: [`{first} wins at darts and will not stop talking about it.`, `You beat {first} at pool on the black. A rematch is demanded, and lost.`, `The landlord recognises nobody, which is exactly the point.`, `A roast, a pot of tea and an hour of nobody talking about tyres.`],
    c: [`A corner table by the fire. {her} wins at darts twice and pretends to be surprised.`, `A pub quiz near the circuit: {her} carries the music round, you carry the sport.`] },
  simlounge: { d: [`{first} sets a lap record on the sim and makes everyone watch the replay.`, `You trade fastest laps with {first} until the staff start switching the lights off.`, `The arcade cabinet in the corner settles the argument. Badly, for {first}.`],
    c: [`You show {her} the sim. She is quicker than she has any right to be by the third lap.`, `{her} spins at the first corner, laughs, and asks for another go. And another.`] },
  karting: { d: [`Ten laps in the karts. You win by a bumper, and {first} calls for the stewards.`, `{first} out-brakes you at the hairpin and does not let it go all evening.`, `A photo finish in the karts, then a rematch, then another.`],
    c: [`{her} out-brakes you into the hairpin on the last lap and does not let it go all evening.`, `Ten laps, a photo finish, a rematch. {her} is properly quick.`] },
  rooftop: { d: [`The Strip lit up below, mocktails, and {first} doing an impression of their race engineer.`, `You watch the Sphere change colour for longer than either of you admits.`, `A quiet hour above the city. The calmest the week has been.`],
    c: [`Above the Strip after dark, the Sphere glowing below. {her} says it looks like a racing line from up here.`, `A rooftop, the city lit up, and very little need to talk.`] },
  poolclub: { d: [`A cabana at Tidewater, the pool lit turquoise. {first} loses a race to the far wall and demands a recount.`, `The DJ plays past two. {first} talks tyres in the water until everyone tells them to stop.`, `A night swim under the palms, the Strip glowing past the hotel. Nobody mentions the championship.`],
    c: [`A night swim at Tidewater, the pool lit turquoise. {her} wins the race to the far wall and will not let it go.`, `Daybeds, mocktails and the Strip glowing past the palms. {her} stays in the water until the music stops.`] },
  restaurant: { d: [`A long dinner in a private room. {first} orders for the table and gets it right.`, `Three courses and not one word about set-ups. Nearly.`, `The waiter is a fan and pretends not to be. Everyone appreciates it.`],
    c: [`A private dining room, phones face down. {her} tells you about {work}.`, `Dinner runs late. {her} steals your dessert and calls it a test.`] },
  apartment: { d: [`You cook. {first} washes up. A fair trade.`, `A film neither of you finishes and a very good bowl of pasta.`, `The record player gets more use than it has all year.`],
    c: [`You cook. {her} judges, kindly. The risotto very nearly burns.`, `A quiet night in, a record on, {her} telling you about {hobby}.`] },
  coffee: { d: [`You sit with {first} over coffee. Neither of you says much, and that is fine.`, `A quiet coffee and a walk. A few words about the people who matter.`, `{first} talks for a while; you mostly listen. It helps, a little.`] },
};
const CLOSE = { hi: [`A great evening.`, `One to remember.`], mid: [`A good evening.`, `Time well spent.`], lo: [`An awkward evening, if you are honest.`, `Not the evening you hoped for.`] };
/** the guests as contact ids, from ids or the WEEK's { kind, id } -> ['d:..', 'c:..'] */
const cidsOf = (c, guests) => [...new Set(arr(guests).map((x) => {
  if (x && typeof x === 'object') return x.kind === 'celeb' || x.kind === 'star' ? `c:${x.id}` : x.kind === 'driver' ? `d:${x.id}` : x.cid || null;
  const s = String(x || ''); return /^[dc]:/.test(s) ? s : c?.drivers?.[s] ? `d:${s}` : CEL(s) ? `c:${s}` : null;
}).filter(Boolean))];
/**
 * An evening summed up instead of played (the hub's 'skip'): a score from how well you get on, whether it is their kind
 * of place, how everyone is feeling and a little luck; the evening's game won or lost; whether a long lens caught you; one
 * or two moments in words -> a result for hangoutResult ({ venue, guests, score, moments, minigames, seen, tones, dur,
 * left, auto })
 */
export function autoHangout(c, venue, guests = []) {
  const v = VENUE_BY_ID[venue && typeof venue === 'object' ? venue.id : venue] || VENUE_BY_ID.simlounge, L = cidsOf(c, guests), quiet = v.quiet || (c ? grave(c) : false);
  const my = c ? moodNow(c) : { morale: 60, confidence: 60 }, sc = [];
  let fame = c?.pr ? fameIndex(num(c.pr.fame, 0.4)) : 40;
  for (const x of L) {
    const id = x.slice(2);
    if (x.startsWith('d:') && c?.drivers?.[id]) {
      const f = friendOf(c, id), m = moodNow(c, c.drivers[id]);
      sc.push(0.35 + f.level / 100 * 0.35 + Math.min(0.15, fitOf(f, v) * 0.1) + (m.morale - 55) / 200 + (my.morale - 55) / 250 + (Math.random() - 0.5) * 0.24);
    } else if (x.startsWith('c:') && CEL(id)) {
      const C = CEL(id), b = peek(c, id) || {}; fame = Math.max(fame, C.fame);
      sc.push(0.4 + num(b.aff, 0) / 100 * 0.3 + (v.date && C.fav === v.date ? 0.15 : v.date && C.meh === v.date ? -0.15 : 0) + (num(b.trust, 30) - 30) / 400 - num(b.upset, 0) * 0.08 + (Math.random() - 0.5) * 0.24);
    }
  }
  let score = sc.length ? sc.reduce((a, s) => a + s, 0) / sc.length : 0.5;
  // (two of the people you are seeing at one table is not a relaxing evening)
  if (c && L.filter((x) => x.startsWith('c:') && seeingIds(c).includes(x.slice(2))).length >= 2) score -= 0.25;
  score = Math.round(clamp(score, 0.05, 0.98) * 100) / 100;
  const won = v.games.length && !quiet ? (Math.random() < 0.5 + (num(my.confidence, 60) - 50) / 200 ? 1 : 0) : 0, lost = v.games.length && !quiet ? 1 - won : 0;
  const seen = !quiet && !!c && !hurtNow(c, meOf(c)) && Math.random() < (1 - v.privacy) * (fame / 100) * 0.55;
  const g0 = L[0] || '', c0 = L.find((x) => x.startsWith('c:')), C = c0 ? CEL(c0.slice(2)) : null, d0 = L.find((x) => x.startsWith('d:'));
  const T = { first: d0 && c?.drivers ? first(c.drivers[d0.slice(2)]?.name) : 'everyone', her: C ? first(C.name) : '', work: C ? pick(C.work) : '', hobby: C?.hobby || '' };
  const P = MOMENTS[v.id] || MOMENTS.simlounge, moments = [fill(pick(g0.startsWith('c:') && P.c ? P.c : P.d), T)];
  if (!quiet) moments.push(pick(score >= 0.7 ? CLOSE.hi : score >= 0.4 ? CLOSE.mid : CLOSE.lo));
  return { venue: v.id, guests: L, score, moments, minigames: { won, lost }, seen, tones: quiet ? { kind: 1 } : { light: 1, kind: 1 }, dur: 0, left: 'normal', auto: true };
}
/** a count from the evening's talk (fx: { flirt: n } for everyone, or { [cid]: { flirt: n } } by guest) */
const fxOf = (R, cid, k) => { const F = obj(R.fx), per = Object.keys(F).some((x) => x.includes(':')); return num(per ? obj(F[cid])[k] : F[k], 0); };
/** a date, as Celebs records it - its own dateResult when there is one, else the plain version here -> { text } */
const dateFx = (c, id, score, v, seen, R) => {
  if (typeof Celebs.dateResult === 'function') { const r = call('dateResult', c, id, score, v?.id || null, seen, R); return r && typeof r === 'object' ? r : { text: '' }; }
  const C = CEL(id), b = bondOf(c, id); if (!C || !b) return { text: '' };
  const f = first(C.name), fav = v?.date && C.fav === v.date, meh = v?.date && C.meh === v.date;
  const gain = Math.round(clamp(-3 + score * 16 + (fav ? 3 : meh ? -3 : 0), -4, 14));
  if (b.accepted && !ROM.includes(b.stage)) { b.stage = 'dating'; b.since = now(c); b.accepted = null; }
  b.dates = num(b.dates, 0) + 1; b.last = now(c); b.lastDate = now(c); b.idle = 0;
  call('relateCeleb', c, id, gain, `${v ? v.name : 'An evening'} with ${f}`); if (score >= 0.5) call('trustCeleb', c, id, 3);
  mood(c, Math.round(1 + 3 * score), `An evening with ${f}`);
  if (seen) {
    b.photos = num(b.photos, 0) + 1; press(c, 'date', { celeb: id, celebName: C.name, job: C.job, publicly: true });
    if (C.traits?.privacy >= 0.6) call('trustCeleb', c, id, -4);
    if (b.secret) expose(c, 'photo', [id], 1);
    return { text: `A photographer was waiting outside${C.traits?.privacy >= 0.6 ? `; ${f} hates that` : ''}.` };
  }
  return { text: '' };
};
/**
 * The evening's result (played in ui/Hangout.js, or autoHangout's) applied: drivers - friendship by how it went (-6..+14,
 * more when it was their kind of place; cruel lines and leaving early cost), rapport with it, your morale (+2..+6); a
 * celebrity - Celebs' date result (affection, trust, a photographer); the talk's effects (flirt, charm, a deep talk, a
 * cover story, an invitation); a phone that buzzed on a secret date; two of the people you are seeing in one room;
 * photographers at a night out with drivers. The arranged plan is marked done. A quiet coffee in a grave week is only
 * kindness: friendship up, a little composure, no cameras, nothing for the press. result: { venue, guests [cids], score
 * 0..1, moments, minigames, seen, tones, dur, left: 'normal' | 'early', fx?, buzz?: 'ignore' | 'answer' | 'excuse' (or
 * { choice }) } -> { lines }
 */
export function hangoutResult(c, result) {
  const lines = []; if (!c?.drivers || !result || typeof result !== 'object') return { lines };
  const S = ensure(c), v = VENUE_BY_ID[result.venue] || null, L = cidsOf(c, result.guests), quiet = !!v?.quiet || grave(c), score = clamp(num(result.score, 0.5), 0, 1);
  const seen = !quiet && !!result.seen && !hurtNow(c, meOf(c)), tones = obj(result.tones), early = result.left === 'early';
  const ds = L.filter((x) => x.startsWith('d:') && live(c.drivers[x.slice(2)]) && x.slice(2) !== c.playerId), cs = L.filter((x) => x.startsWith('c:') && CEL(x.slice(2)));
  const names = list([...ds, ...cs].map((x) => shortOf(c, x)));
  // (the drivers: friendship, rapport with it, and an evening that did you good)
  for (const x of ds) {
    const did = x.slice(2), d = c.drivers[did], f = friendOf(c, did);
    let dv = quiet ? Math.max(3, Math.round(3 + score * 5))
      : Math.round(-6 + score * 20) + Math.min(3, fitOf(f, v) * 2) - 3 * num(tones.cruel, 0) + Math.min(2, num(tones.kind, 0)) - (early ? 3 : 0) + 2 * Math.min(1, fxOf(result, x, 'invite')) + 2 * Math.min(1, fxOf(result, x, 'deep'));
    dv = clamp(dv, -8, 16);
    relateFriend(c, did, dv, quiet ? `A quiet coffee with ${d.name}` : dv >= 8 ? `A great evening with ${d.name}` : dv <= -3 ? `An awkward evening with ${d.name}` : '');
    f.hangouts++; f.last = now(c); f.met = true; f.idle = 0;
  }
  if (ds.length) quiet ? mood(c, 2, `A quiet coffee with ${names}`, 'composure') : mood(c, Math.round(2 + 4 * score), `An evening out with ${names}`);
  // (the celebrities: a date is Celebs' business; a friend on a night out is simply time together)
  for (const x of cs) {
    const id = x.slice(2), b = bondOf(c, id) || {}, F = first(CEL(id).name);
    if (!quiet && (ROM.includes(b.stage) || b.accepted)) { const r = dateFx(c, id, score, v, seen, result); if (r?.text) lines.push(r.text); }
    else { call('meet', c, id); call('relateCeleb', c, id, Math.round(-2 + score * 10), score >= 0.6 ? `A good evening with ${F}` : ''); }
    if (quiet) continue;
    for (let i = Math.min(2, fxOf(result, x, 'flirt')); i > 0; i--) call('flirt', c, id);
    if (fxOf(result, x, 'charm')) call('charm', c, id);
    if (fxOf(result, x, 'deep')) call('trustCeleb', c, id, 3);
    if (fxOf(result, x, 'cover')) suspect(c, id, -6);
    if (fxOf(result, x, 'invite')) { const r = call('invite', c, id); if (r?.ok && r.text) lines.push(r.text); }
  }
  // (a phone that would not stop buzzing on a secret date)
  const bz = result.buzz && typeof result.buzz === 'object' ? result.buzz.choice : result.buzz;
  if (bz && cs.length && !quiet) {
    const id = cs[0].slice(2); suspect(c, id, bz === 'answer' ? 12 : bz === 'excuse' ? 6 : 3);
    if (bz === 'excuse' && num(peek(c, id)?.suspicion, 0) >= 60) call('trustCeleb', c, id, -2);
  }
  // (two of the people you are seeing in one room)
  const both = cs.map((x) => x.slice(2)).filter((id) => seeingIds(c).includes(id));
  if (both.length >= 2 && !quiet) { const r = expose(c, 'grid', both, 1.5); if (r?.text) lines.push(r.text); }
  // (a long lens at a night out with the drivers: only the Strip after dark makes a story of it)
  if (seen && ds.length && !cs.length) press(c, 'nightout', { caught: v?.id === 'rooftop' || v?.id === 'poolclub' });
  // (the plan is used)
  const inv = S.invites.find((w) => w.status === 'accepted' && ago(c, w) <= 0 && w.venue === v?.id && L.every((x) => partyOf(w).includes(x)));
  if (inv) inv.status = 'done';
  // (her look, planned together in the room (the evening's L sheet): kept - styling only, no stat moves)
  if (result.style && typeof result.style === 'object' && result.style.id) call('styleFromEvening', c, result.style);
  S.last = { season: c.season, round: c.round, venue: v?.id || null, guests: L, score };
  const what = quiet ? `A quiet coffee with ${names}.` : `${v ? v.name : 'An evening out'} with ${names}: ${pick(score >= 0.7 ? CLOSE.hi : score >= 0.4 ? CLOSE.mid : CLOSE.lo).toLowerCase()}`;
  note(c, what); lines.unshift(what);
  return { lines };
}

// ---- favours -----------------------------------------------------------------------------------------------------------------
/**
 * What your friends do for you this weekend: 'backup' (mates who would back you in public over the story waiting for an
 * answer - PR.resolveCrisis reads the same rule: image +1.5 each, two at most), 'tip' (a line for the weekend brief, from
 * mates and a friendly team-mate), 'room' (mates race you hard but clean: careerField multiplies their car.aggrMul by
 * mul, 0.92 for a best mate, 0.96 for a mate). Nothing for a personal story or a grave week but the room -> [{ did,
 * kind, text, image?, mul? }]
 */
export function friendFavours(c) {
  const out = []; if (!c?.social?.friends || !c.drivers) return out;
  const g = grave(c), K = c.pr?.crisis, mid = mateIdOf(c); let nb = 0, nt = 0;
  for (const [did, f] of friendsBy(c)) {
    const d = c.drivers[did]; if (!live(d) || did === c.playerId || hurtNow(c, d)) continue;
    const st = FS(f.stage), F = first(d.name);
    if (K && !K.positive && !K.personal && !K.near && !g && st >= 3 && nb < 2 && did !== K.who) { out.push({ did, kind: 'backup', text: `${F} has your back if the press asks about ${K.story || 'it'}.`, image: 1.5 }); nb++; }
    if (!g && nt < 2 && c.round <= SPAN(c) && (st >= 3 || (did === mid && st >= 2))) { out.push({ did, kind: 'tip', text: `${F}: "${pick(TIPS[trackOf(c)] || TIPS.any, rng(`${did}|${rk(c)}`))}"` }); nt++; }
    if (st >= 3) out.push({ did, kind: 'room', text: `${F} will race you hard, but clean.`, mul: f.stage === 'best' ? 0.92 : 0.96 });
  }
  return out;
}

// ---- a new driver ------------------------------------------------------------------------------------------------------------
/**
 * Your driver changes. A voluntary switch (died false): a fresh phone and no friends yet. Your driver died (died true):
 * the paddock still knows you, so friendships stay, but the chats and the plans are cleared, and each friend sends one
 * quiet message - no jokes, no plans -> c.social
 */
export function socialResetForNewDriver(c, died = false) {
  if (!c) return null;
  // (tonight's party, if one was waiting, is off: career/Party.js keeps it as plain JSON, and Career resets the rest)
  if (c.party && typeof c.party === 'object') { c.party.offers = []; c.party.cur = null; c.party.last = null; }
  if (!died) { c.social = socialState(); return c.social; }
  const S = ensure(c), L = arr(c.lost).slice(-1)[0], lost = L && ago(c, L) <= 1 ? L : null, pid = c.playerId;
  S.phone = freshPhone(); S.invites = []; S.race = null; S.last = null; delete S.friends[pid];
  if (lost) delete S.friends[lost.id];
  const T = { lost: first(lost?.name) || 'him', lostTeam: lost?.team || 'the team' };
  let n = 0, left = [];
  for (const [did, f] of friendsBy(c)) {
    const d = c.drivers[did]; if (n >= 6) break;
    if (!live(d) || did === pid || f.level < 15) continue;
    // (each friend in their own words: the pool is dealt out before any line comes round again)
    if (!left.length) left = CONDOLE.slice().sort(() => Math.random() - 0.5);
    push(c, `d:${did}`, 'them', fill(left.pop(), T), 'support'); n++;
  }
  if (meOf(c)?.team) push(c, 'x:boss', 'them', fill(pick([`Everyone here is thinking of {lost}. Take whatever time you need.`, `We are all thinking of {lost} this week. The car can wait.`]), T), 'support');
  note(c, 'Quiet messages of support from the paddock.');
  return S;
}
