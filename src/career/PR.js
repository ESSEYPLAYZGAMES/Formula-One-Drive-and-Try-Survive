// Public relations: how the world beyond the pit wall sees your driver. Nine outlets cover the paddock - GP TV (the
// host broadcaster), RACE 24, F1 NEWS, the APEX magazine, the PIT LANE podcast, GRID FM radio, Paddock Weekly, the
// tabloid Paddock Post, and Chequered, the platform where the fans have their say - each with its own reach, its own
// taste (results, humility, drama, romance, charity, candour) and its own opinion of you, so the same afternoon reads
// warmly in one paper and coolly in the next, and an outlet that likes you takes the sting out of a bad day. Everything
// you do feeds it: results and penalties, a shove on the grid, an answer in the media pen, a post, a date, a night out,
// a charity day. Under it sit your following (millions of followers), a public image, the heat of controversy (it cools
// every round) and what sponsors think of you, and the tones you keep choosing build a persona that the image settles
// towards. Now and then a story becomes a crisis that wants an answer before the next race - apologise, explain, say
// nothing, stand by it, laugh it off, ask for privacy - each a real trade-off that the outlets and your persona shade, a
// good PR manager improves and a mate on the grid speaking up for you helps; ignore it and the story runs without you. Invented brands offer personal endorsements with
// clauses (image, morality, exclusivity, bonuses) that pay after every race: 70% to you, 30% to the team. None of it
// ever touches injury, death or the memorial: those are not stories to be managed, and nothing here spins them. Romance
// and gossip copy never pairs a real person with anyone: the celebrities are invented, the men a tabloid links them with
// are invented, and a real driver in a love story is only ever 'the <team> driver'. The state is plain JSON on the career
// (c.pr); the callers save.
import { shiftMorale, moodOf } from './Morale.js';

// ---- small helpers --------------------------------------------------------------------------------------------------
const pick = (a) => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const num = (v, f) => (typeof v === 'number' && isFinite(v) ? v : f);
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const first = (s) => String(s || '').split(' ')[0];
const last = (s) => String(s || '').split(' ').pop();
const usd = (v) => `$${r2(v)}M`;
const sgn = (v) => `${v > 0 ? '+' : ''}${r1(v)}`;
const PR_V = 1, FEED_CAP = 60, POSTS_CAP = 20, HIST_CAP = 80, PAST_CAP = 12, MAX_DEALS = 4, MAX_OFFERS = 3;
const POSTS_A_ROUND = 2, POST_IMAGE_CAP = 3, NEWS_A_ROUND = 3;
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal', austin: 'Austin' };
const GP = { lasvegas: 'Las Vegas Grand Prix', silverstone: 'British Grand Prix', montreal: 'Canadian Grand Prix', austin: 'United States Grand Prix' };
const CITY = { lasvegas: 'Las Vegas', silverstone: 'London', montreal: 'Montreal', austin: 'Austin' };
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth',
  'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third'];
// (the romance roster's fixed ids - each name is its id in title case; PR never imports Celebs.js)
const CELEB_IDS = ['mira-vale', 'lena-marsh', 'sasha-ivers', 'noor-haddad', 'ava-rennick', 'jade-okafor', 'clara-voss', 'elena-marchetti', 'priya-raman', 'tessa-kealoha', 'maya-lindqvist', 'zoe-hartley'];
const celebName = (id) => (CELEB_IDS.includes(id) ? id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') : null);
// (the invented men a tabloid may link her with: the grid show's other guests - never a driver, never anyone real)
const MEN = ['Jonah Reese', 'Dex Okoro', 'Theo Quinn', 'Kai Brennan'];
// (Social.js's hangout venues as a caption puts them; the race-flavoured ones get a busman's-holiday line of their own)
const WHERE = { poolclub: 'at a pool club on the Strip', rooftop: 'on a rooftop lounge over the Strip', pub: 'at a village pub near Silverstone', simlounge: 'at a sim-racing lounge', apartment: 'outside a flat in town', restaurant: 'leaving a private dining room in town', karting: 'at an indoor karting hall' };
const RACY = { simlounge: 'in a sim-racing lounge', karting: 'at an indoor karting hall' };

// ---- the career around the press: stamps, your driver, the grave-content firewall ----------------------------------
const span = (c) => c?.rounds || 6;
const key = (c) => `${c.season}|${c.round}`;
const nowS = (c) => ({ season: c.season, round: c.round });
/** rounds since a stamp ({ season, round }) -> n (99 for never) */
const ago = (c, at) => (at && at.season != null ? (c.season - at.season) * span(c) + (c.round - at.round) : 99);
const cmp = (a, b) => (a.season - b.season) || (a.round - b.round);
/** the race n rounds on from now (a season over: now is the next season's first race) -> { season, round } */
const ahead = (c, n) => {
  const R = span(c); let s = num(c?.season, 2026), r = num(c?.round, 1) + n;
  if (num(c?.round, 1) > R) { s++; r = 1 + n; }
  while (r > R) { r -= R; s++; }
  return { season: s, round: Math.max(1, r) };
};
const meOf = (c) => c?.drivers?.[c.playerId] || null;
/** a driver who is a real person (the grid, the reserves, F2) rather than one of the game's own (custom, juniors) */
const isReal = (d) => !!d && ['F1', 'Reserve', 'F2'].includes(d.from);
const injured = (c) => { const d = meOf(c); return !!d && d.outUntil != null && d.outUntil >= c.round; };
const hurtD = (c, d) => !!d && (d.alive === false || (d.outUntil != null && d.outUntil >= c.round));
const trackIdOf = (c, off = 0) => {
  const L = c?.calendar; if (!L?.length) return null;
  const i = (num(c.round, 1) - 1 + off) % L.length;
  return L[(i + L.length) % L.length];
};
const skillOf = (P) => clamp(num(P?.manager?.skill, 0), 0, 1);
const moodNow = (c) => {
  try { const d = meOf(c); if (d) return moodOf(d); } catch (e) { /* (a record from before morale: neutral) */ }
  return { morale: 60, focus: 60, racecraft: 60, confidence: 60, composure: 60 };
};
const mood = (c, v, why, stat = null) => { try { return v ? shiftMorale(c, c.playerId, v, why, stat) : 0; } catch (e) { console.warn('PR: morale failed', e); return 0; } };
const relate = (c, did, v, why = null) => { try { if (did && typeof c.relate === 'function') c.relate(did, v, why); } catch (e) { /* (a career without rapport: nothing to move) */ } };
// Injury, death and the memorial are never PR: no kind about them exists, and any story that carries them is dropped.
const GRAVE_KINDS = new Set(['respect', 'memorial', 'tribute', 'mourn', 'mourning', 'loss', 'death', 'dead', 'died', 'injury', 'injured', 'hurt', 'comeback', 'grief', 'funeral']);
const GRAVE_TOPICS = new Set(['loss', 'hurt', 'crash', 'back', 'aim', 'comeback', 'memorial', 'tribute']);
const GRAVE_WORDS = /injur|hospital|fatal|died|death|killed|memorial|tribute|condolence|griev|mourn|funeral/i;
const graveData = (x) => !!x && (!!(x.grave || x.injured || x.hurt || x.fate || x.dead || x.killed || x.memorial || x.mourn) || GRAVE_WORDS.test(`${x.why || ''} ${x.reason || ''}`));
/** the paddock lost someone this round (the memorial weekend follows) */
const recentLoss = (c) => (c?.lost || []).some((l) => l && l.season != null && ago(c, l) <= 0);
/** the round's context (postContext), while it is the round just raced or the week after it -> ctx | null */
const ctxLive = (c) => {
  const x = c?.pr?.ctx; if (!x || typeof x !== 'object') return null;
  if (x.season == null || x.round == null) return x;
  const a = ago(c, x); return a >= 0 && a <= 1 ? x : null;
};
/** a grave week: no gossip, no romance stories, no crises, quiet posts only */
const hushed = (c) => !!ctxLive(c)?.grave || recentLoss(c);

// ---- the outlets ----------------------------------------------------------------------------------------------------
/** likes: how much each kind of story pleases the outlet (-1..1) */
const likes = (results, humility, drama, romance, charity, candour) => ({ results, humility, drama, romance, charity, candour });
/**
 * { id, name, kind, group (the voice its headlines fall back on), reach (0..1), likes, color, reporter, blurb, fickle
 * (fair-weather: warms to a winner, cools on a loser) }
 */
const O = (id, name, kind, group, reach, lk, color, reporter, blurb, fickle = false) => ({ id, name, kind, group, reach, likes: lk, color, reporter, blurb, fickle });
export const OUTLETS = [
  O('gptv', 'GP TV', 'tv', 'serious', 0.9, likes(0.8, 0.4, -0.3, 0, 0.3, 0.2), '#0b3d91', 'Sophie Kerr',
    `The host broadcaster: results first, measured in tone, and fond of a driver who keeps a cool head.`),
  O('race24', 'RACE 24', 'tv/online', 'tv', 0.75, likes(0.5, 0, 0.5, 0.3, 0.1, 0.3), '#f2c200', 'Marco Bellini',
    `Rolling coverage on screen and online. Loves a result - and loves a story more.`),
  O('f1news', 'F1 NEWS', 'online', 'serious', 0.8, likes(0.8, 0.1, 0, -0.1, 0.1, 0.2), '#c8102e', 'Jess Okafor',
    `The paddock's paper of record online: straight news, judged on results.`),
  O('apex', 'APEX', 'magazine', 'serious', 0.45, likes(0.4, 0.9, -0.6, -0.3, 0.3, 0.4), '#d4002a', 'Tom Hale',
    `The monthly long read: craft, humility and the engineering behind a lap. No time at all for drama.`),
  O('pitlane', 'PIT LANE', 'podcast', 'pod', 0.4, likes(0.3, 0.2, 0.3, 0.1, 0.2, 0.9), '#1aa34a', 'Ines Duarte',
    `The paddock's favourite podcast: three hosts, strong opinions, and a weakness for candour and a good joke.`),
  O('gridfm', 'GRID FM', 'radio', 'radio', 0.5, likes(0.3, 0.4, -0.1, 0.2, 0.9, 0.3), '#6a1b9a', 'Lukas Weber',
    `Race radio with phone-ins: the fans' station, warm towards anyone who gives the fans time - and charity.`),
  O('weekly', 'Paddock Weekly', 'magazine', 'serious', 0.55, likes(0.6, 0.3, 0.1, 0, 0.2, 0.8), '#8a6a2a', 'Martin Hale',
    `The weekly magazine and its grid-walk reporter: analysis, quotes, and a nose for the story behind the story.`),
  O('post', 'The Paddock Post', 'tabloid', 'tab', 0.85, likes(0.2, -0.2, 1, 1, 0, 0.2), '#e4003a', 'Danny Fitch',
    `The tabloid: drama, romance and grid-walk handbags. Fair-weather - it loves a winner and forgets a loser.`, true),
  O('feed', 'Chequered', 'social', 'feed', 1, likes(0.6, 0.3, 0.6, 0.6, 0.4, 0.5), '#00b3a4', 'the fans',
    `The platform where the fans have their say: the widest reach of all, and the quickest to turn.`),
];
export const OUTLET_BY_ID = Object.fromEntries(OUTLETS.map((o) => [o.id, o]));
const ALL = OUTLETS.map((o) => o.id);
const PRESS = ['gptv', 'race24', 'f1news', 'apex', 'pitlane', 'gridfm'];
const ALIAS = { 'paddock post': 'post', 'the post': 'post', post: 'post', tabloid: 'post', chequered: 'feed', fans: 'feed', 'grid fm': 'gridfm', 'pit lane': 'pitlane', 'race 24': 'race24', 'f1 news': 'f1news', 'gp tv': 'gptv' };
/** an outlet's id from its name as the interview or the grid walk prints it ('GP TV', 'Paddock Weekly'...) -> id | null */
export function outletByName(name) {
  const s = String(name || '').trim().toLowerCase(); if (!s) return null;
  if (OUTLET_BY_ID[s]) return s;
  const o = OUTLETS.find((x) => x.name.toLowerCase() === s); if (o) return o.id;
  return ALIAS[s] || ALIAS[s.replace(/^the /, '')] || null;
}
/** an outlet's display name -> 'GP TV' (an unknown id: the id itself) */
export function outletName(id) { return OUTLET_BY_ID[id]?.name || String(id || ''); }

// ---- the brands and the managers ------------------------------------------------------------------------------------
// (every brand is invented. base: $M a round before your fame, appeal and agent; minImage: the image clause; minFi: the
// fame index it wants (fameIndex below); heatMax: the morality clause (100 = none); bonus: pays on a win and a podium;
// likes: the persona it would rather have on its posters)
const B = (id, brand, kind, base, minImage, minFi, heatMax, bonus, lk, pitch) => ({ id, brand, kind, base, minImage, minFi, heatMax, bonus, likes: lk, pitch });
export const BRANDS = [
  B('kestrel', 'Kestrel Horlogerie', 'watch', 0.55, 25, 50, 55, true, 'humble', `Hand-finished Swiss chronographs. They want a calm face on the dial and a clean record to match.`),
  B('vireo', 'Vireo', 'watch', 0.25, 0, 38, 80, true, 'confident', `A young watch brand with bright dials and a loud launch campaign.`),
  B('ampwave', 'Ampwave', 'energy drink', 0.35, -40, 36, 100, true, 'showman', `A loud energy drink that likes its athletes louder. Controversy is no problem; being dull is.`),
  B('arlette', 'Maison Arlette', 'fashion', 0.45, 20, 46, 70, false, 'showman', `A Paris fashion house that dresses the paddock's best-known faces.`),
  B('northvale', 'Northvale Motors', 'road cars', 0.6, 30, 52, 50, true, 'humble', `Grand tourers for long roads. Their adverts need a driver the public trusts.`),
  B('lumora', 'Lumora Audio', 'headphones', 0.3, 0, 40, 85, false, 'confident', `Noise-cancelling headphones, round every other neck in the paddock.`),
  B('solenne', 'Solenne', 'sunglasses', 0.25, 5, 38, 80, false, 'confident', `Sunglasses for the podium and the harbour. They like a winner's smile.`),
  B('gridline', 'Gridline Sim', 'sim racing', 0.15, -20, 30, 100, false, null, `Wheels, pedals and rigs. They just want you lapping on stream now and then.`),
  B('torrent', 'Torrent Sportswear', 'sportswear', 0.3, 10, 42, 75, true, 'confident', `Training kit and trainers; the campaign is you in the gym at six in the morning.`),
  B('ristra', 'Ristra Coffee', 'coffee', 0.12, -10, 30, 90, false, null, `A roaster with a cart in every paddock. Easy money, and the coffee is good.`),
  B('fjelda', 'Fjelda Water', 'mineral water', 0.2, 15, 36, 60, false, 'humble', `Norwegian spring water: clean, calm and wholesome - and they mean it.`),
  B('orris', 'Orris Private Bank', 'private bank', 0.55, 35, 54, 40, false, 'humble', `A discreet private bank. Generous, conservative, and very nervous about headlines.`),
  B('lanternfish', 'Lanternfish Games', 'video games', 0.25, -25, 38, 100, false, 'showman', `A games studio that wants you on the cover of its racing game. Big personalities welcome.`),
  B('velane', 'Velane Parfums', 'fragrance', 0.4, 20, 47, 70, false, 'romance', `A fragrance house. The campaign is black and white, slow motion and very serious.`),
];
export const BRAND_BY_ID = Object.fromEntries(BRANDS.map((b) => [b.id, b]));
/** where endorsement money goes (Career pays it: the share to your own account, the rest to the team's budget) */
export const DEAL_SPLIT = { wallet: 0.7, team: 0.3 };
/**
 * PR managers (invented): skill softens bad press and sharpens good (crisis answers, image losses, offers), fee is $M a
 * round from your endorsements (your own account when they do not cover it). style: fixer (an ignored crisis hurts half
 * as much), press (an explanation lands better), social (posts reach further), hustle (more offers), old (old friends
 * at APEX and GRID FM).
 */
export const MANAGERS = [
  { name: 'Harriet Quill', skill: 0.95, fee: 0.4, style: 'fixer', blurb: `Ran the press office at two title-winning teams. Expensive, unflappable, and has every editor's number.` },
  { name: 'Marcus Adeyemi', skill: 0.8, fee: 0.25, style: 'press', blurb: `A former paddock journalist who knows exactly what a headline needs - and what it doesn't.` },
  { name: 'Sofia Navarro', skill: 0.65, fee: 0.15, style: 'social', blurb: `Built three athletes' channels from nothing. Brilliant online (your posts reach further); still learning the press room.` },
  { name: 'Dev Malhotra', skill: 0.5, fee: 0.1, style: 'hustle', blurb: `Young, hungry and cheap. Answers emails at three in the morning and turns up the odd extra sponsor.` },
  { name: 'Clive Barrow', skill: 0.3, fee: 0.05, style: 'old', blurb: `Semi-retired, charming, very fond of a long lunch, and old friends with half of APEX and GRID FM. Better than nothing - just.` },
];

// ---- persona ----------------------------------------------------------------------------------------------------------
const PERSONAS = ['humble', 'confident', 'showman', 'controversial'];
/** each persona's share of the tones you have chosen, ramping in over the first six (a new driver is a blank page) */
const shares = (pe) => {
  const t = PERSONAS.reduce((a, k) => a + Math.max(0, num(pe?.[k], 0)), 0), w = Math.min(1, t / 6), o = {};
  for (const k of PERSONAS) o[k] = t ? Math.max(0, num(pe[k], 0)) / t * w : 0;
  return o;
};
const PERSONA_TXT = {
  humble: ['The quiet professional', `You let the driving do the talking. The serious press respects it; the tabloid finds you hard to sell.`],
  confident: ['The racer', `You back yourself, out loud. It plays well while the results come - less well when they don't.`],
  showman: ['The showman', `Good copy, great clips, more followers every week. Not everyone takes you seriously.`],
  controversial: ['The lightning rod', `Every word a headline. The tabloid adores you; the sponsors are nervous.`],
  balanced: ['All-rounder', `No one tone dominates: a little of everything, and nothing the press can pin on you.`],
  none: ['Still finding a voice', `Too early to say what the public makes of you.`],
};
/** what the public makes of you, from the tones you keep choosing -> { key, name, blurb, shares, total } */
export function personaOf(c) {
  const pe = c?.pr?.persona || {}, t = PERSONAS.reduce((a, k) => a + Math.max(0, num(pe[k], 0)), 0), sh = shares(pe);
  let k = 'none';
  if (t >= 4) { const top = PERSONAS.reduce((a, p) => (sh[p] > sh[a] ? p : a), 'humble'); k = sh[top] < 0.4 ? 'balanced' : top; }
  return { key: k, name: PERSONA_TXT[k][0], blurb: PERSONA_TXT[k][1], shares: sh, total: t };
}
/** where your image settles: the persona, and how the results have gone lately (P.form, -1..1) */
const baseline = (P) => { const sh = shares(P.persona); return clamp(10 + 30 * sh.humble + 14 * sh.confident + 5 * sh.showman - 40 * sh.controversial + num(P.form, 0) * 12, -60, 70); };

// ---- the state (c.pr) -------------------------------------------------------------------------------------------------
/** followers in millions as a 0..100 index (0.3M ~32, 10M ~53, 100M ~74) - celebrities' fame is on the same scale */
export function fameIndex(f) { return Math.min(100, Math.round(30 + 22 * Math.log10(1 + Math.max(0, num(f, 0))))); }
/** '850K' / '1.2M' / '120M' */
export function fameText(f) { f = Math.max(0, num(f, 0)); return f >= 100 ? `${Math.round(f)}M` : f >= 1 ? `${f.toFixed(1)}M` : `${Math.max(1, Math.round(f * 1000))}K`; }
/** -100..100 -> 'Villain' | 'Divisive' | 'Neutral' | 'Liked' | 'Beloved' */
export function imageLabel(v) { v = num(v, 0); return v <= -50 ? 'Villain' : v <= -15 ? 'Divisive' : v < 20 ? 'Neutral' : v < 55 ? 'Liked' : 'Beloved'; }
/** 0..100 -> 'Calm' | 'Simmering' | 'Hot' | 'Firestorm' */
export function heatLabel(v) { v = num(v, 0); return v < 20 ? 'Calm' : v < 45 ? 'Simmering' : v < 75 ? 'Hot' : 'Firestorm'; }
/** an outlet's opinion of you (-100..100) -> 'Hostile' | 'Cool' | 'Neutral' | 'Friendly' | 'Close' */
export function relLabel(v) { v = num(v, 0); return v <= -50 ? 'Hostile' : v <= -15 ? 'Cool' : v < 15 ? 'Neutral' : v < 50 ? 'Friendly' : 'Close'; }
/** sponsor appeal (0..100) -> 'Avoided' | 'Cautious' | 'Steady' | 'Attractive' | 'Hot property' */
export function appealLabel(v) { v = num(v, 50); return v < 20 ? 'Avoided' : v < 40 ? 'Cautious' : v < 60 ? 'Steady' : v < 80 ? 'Attractive' : 'Hot property'; }
/** the multiplier on the sponsors' objective rewards, from appeal and image -> 0.8..1.3 (about 1 for a new career) */
export function sponsorMul(c) {
  const P = c?.pr; if (!P) return 1;
  return r2(clamp(0.85 + clamp(num(P.appeal, 50), 0, 100) / 100 * 0.3 + clamp(num(P.image, 10), -100, 100) / 100 * 0.15, 0.8, 1.3));
}
/** a new driver's following: a grid star's millions down to a debutant's few hundred thousand (a custom driver 0.3M) */
const startFame = (d) => {
  if (!d) return 0.4;
  if (d.from === 'Custom') return 0.3;
  const r = clamp(num(d.rating, 0.8), 0.6, 0.995), f = 0.4 + 17.6 * Math.pow(clamp((r - 0.78) / 0.19, 0, 1), 2.2) + Math.min(3, num(d.wins, 0) * 0.15);
  return r2(d.from === 'F1' ? Math.max(0.6, f) : f);
};
/** a career's c.pr for its driver (the caller assigns it: c.pr = prInit(c)); the agent's phone already ringing once */
export function prInit(c) {
  const fame = startFame(meOf(c));
  const P = { v: PR_V, fame, image: 10, heat: 0, appeal: 50, media: Object.fromEntries(OUTLETS.map((o) => [o.id, 0])), persona: { humble: 0, confident: 0, showman: 0, controversial: 0 },
    feed: [], crisis: null, deals: [], offers: [], manager: null, posts: [], hist: [], ctx: null, tally: null, form: 0, past: [], snub: {}, bonusDue: 0, lim: null };
  try {
    const cc = { season: num(c?.season, 2026), round: num(c?.round, 1), rounds: span(c) }, fi = fameIndex(fame);
    const ok = BRANDS.filter((b) => b.minFi <= fi && b.minImage + 5 <= P.image).sort((a, b) => b.base - a.base).slice(0, 3);
    if (ok.length) P.offers.push(makeOffer(cc, P, pick(ok)));
  } catch (e) { console.warn('PR: no opening offer', e); }
  return P;
}
const okDeal = (d) => !!d && typeof d === 'object' && typeof d.brand === 'string' && isFinite(d.value) && d.until && d.until.season != null;
/** an older save's c.pr, filled in and repaired (safe to call again) -> c.pr */
export function prEnsure(c) {
  if (!c || typeof c !== 'object') return null;
  if (!c.pr || typeof c.pr !== 'object' || Array.isArray(c.pr)) { c.pr = prInit(c); return c.pr; }
  const P = c.pr;
  P.fame = r2(Math.max(0.05, num(P.fame, startFame(meOf(c)))));
  P.image = clamp(num(P.image, 10), -100, 100); P.heat = clamp(num(P.heat, 0), 0, 100); P.appeal = clamp(num(P.appeal, 50), 0, 100);
  const M = P.media && typeof P.media === 'object' && !Array.isArray(P.media) ? P.media : {}; P.media = {};
  for (const o of OUTLETS) P.media[o.id] = clamp(num(M[o.id], 0), -100, 100);
  const pe = P.persona && typeof P.persona === 'object' ? P.persona : {}; P.persona = {};
  for (const k of PERSONAS) P.persona[k] = Math.max(0, Math.round(num(pe[k], 0)));
  P.feed = Array.isArray(P.feed) ? P.feed.filter((h) => h && typeof h.text === 'string').slice(0, FEED_CAP) : [];
  P.crisis = P.crisis && typeof P.crisis === 'object' && Array.isArray(P.crisis.options) ? P.crisis : null;
  if (P.crisis) { P.crisis.ticks = num(P.crisis.ticks, 0); P.crisis.also = Array.isArray(P.crisis.also) ? P.crisis.also : []; }
  P.deals = Array.isArray(P.deals) ? P.deals.filter(okDeal) : [];
  P.offers = Array.isArray(P.offers) ? P.offers.filter(okDeal) : [];
  P.manager = P.manager && typeof P.manager === 'object' && P.manager.name ? { ...P.manager, skill: clamp(num(P.manager.skill, 0.3), 0, 1), fee: Math.max(0, num(P.manager.fee, 0)) } : null;
  P.posts = Array.isArray(P.posts) ? P.posts.filter((p) => p && p.key).slice(0, POSTS_CAP) : [];
  P.hist = Array.isArray(P.hist) ? P.hist.filter((h) => h && h.season != null).slice(-HIST_CAP) : [];
  P.past = Array.isArray(P.past) ? P.past.slice(0, PAST_CAP) : [];
  P.snub = P.snub && typeof P.snub === 'object' && !Array.isArray(P.snub) ? P.snub : {};
  P.form = clamp(num(P.form, 0), -1, 1); P.bonusDue = Math.max(0, num(P.bonusDue, 0));
  if (!P.ctx || typeof P.ctx !== 'object') P.ctx = null;
  if (!P.tally || typeof P.tally !== 'object') P.tally = null;
  if (!P.lim || typeof P.lim !== 'object') P.lim = null;
  P.v = PR_V;
  return P;
}
/** c.pr, cheaply when it is already whole (every event calls this) */
const ensure = (c) => {
  const P = c?.pr;
  if (P && P.v === PR_V && P.media && P.persona && Array.isArray(P.feed) && Array.isArray(P.deals) && Array.isArray(P.offers) && Array.isArray(P.posts) && Array.isArray(P.hist) && Array.isArray(P.past)) return P;
  return prEnsure(c);
};

// ---- the headlines ----------------------------------------------------------------------------------------------------
// HL[kind] = { voice: lines }, or { sub: { voice: lines } } where a story comes in kinds (a jab laughed off or shoved
// back, a crash you were blamed for or not). A voice is an outlet id or its group (serious, tv, pod, radio, tab, feed);
// lines are a list, or { 1, 0, -1 } by how the outlet takes it (warm, level, cold). A line whose token the story lacks
// is skipped. Serious outlets stay measured; the Post is cheeky, never cruel; drivers are named only in racing stories.
const HL = {
  win: {
    serious: { 1: [`{sur} wins the {gp}`, `Victory for {sur} at {track} as {team} take the top step`, `{sur} controls the {gp} from the front`, `{sur} wins at {track} and {title}`, `{team}'s {sur} takes the chequered flag at {track}`],
      0: [`{sur} wins at {track} on a day short of challengers`, `{sur} takes a quiet victory at {track}`] },
    apex: [`How {sur} won {track}: patience, tyres and one decisive move`, `The craft behind {sur}'s victory at {track}`, `Inside {team}'s winning weekend at {track}`],
    weekly: [`Analysis: {sur}'s win at {track} was built on Saturday`, `{sur} wins at {track}: the verdict`, `{sur} wins the {gp} and {title}`],
    tv: [`WIN! {sur} delivers for {team} at {track}`, `{sur} wins it at {track} - and the {team} garage goes wild`, `What a drive! {sur} wins the {gp}`],
    pod: [`Ep. {ep}: {sur} wins {track} and we have notes`, `Ep. {ep}: a {sur} win, explained badly by three people who loved it`],
    radio: [`The phones haven't stopped: {track} winner {sur} thanks the fans`, `Our listeners crown {sur}'s win the drive of the season so far`],
    tab: { 1: [`King of {track}! {sur} wins and the party starts now`, `Pop the fizz: {sur} wins at {track}`, `What happens in {vegas}... {sur} wins it`, `{sur} hits the jackpot under the {vegas} lights`],
      0: [`Winner {sur} - now, how about a smile?`, `{sur} wins. Again. We'll find a story somewhere`] },
    feed: [`#{hash}Wins is trending: fans flood Chequered with clips from {track}`, `"Drive of the year" - Chequered reacts to {sur}'s win at {track}`, `{sur}'s team radio after the flag is the most-shared clip of the day`],
  },
  podium: {
    serious: { 1: [`{pos} for {sur} at the {gp}`, `{sur} on the podium at {track}`, `A strong {pos} for {sur} and {team} at {track}`, `{sur} takes {pos} at {track} and {title}`],
      0: [`{sur} settles for {pos} at {track}`, `{pos} for {sur}, but the win was out of reach at {track}`] },
    apex: [`{pos} at {track}: {sur}'s quietly excellent afternoon`, `Why {sur}'s {pos} at {track} was better than it looked`],
    tv: [`Podium! {sur} brings it home in {pos} at {track}`, `{sur} on the podium - {team} celebrate at {track}`],
    pod: [`Ep. {ep}: {sur}'s {pos}, and whether it was secretly better than a win`],
    radio: [`The fans cheer {sur} onto the podium at {track}`],
    tab: { 1: [`Bubbly for {sur}! {posn} at {track}`, `So close! {sur} grabs {posn} at {track}`], 0: [`Always the bridesmaid? {sur} {posn} at {track}`] },
    feed: [`{sur}'s podium celebrations are all over Chequered`, `Fans react to {sur}'s {pos} at {track}: "deserved"`],
  },
  points: {
    serious: { 1: [`{sur} scores at {track} with {pos}`, `Points for {sur} and {team} at the {gp}`, `{pos} at {track}: a solid afternoon for {sur}`], 0: [`{sur} takes {pos} at {track}`, `{sur} scrapes into the points at {track}`] },
    feed: [`Fans hail a "proper racer's" {pos} for {sur} at {track}`, `Quiet points for {sur} at {track} - and Chequered noticed`],
  },
  dnf: {
    serious: { '-1': [`Retirement for {sur} at {track}`, `{sur} out of the {gp}`, `A frustrating afternoon for {sur}: out of the race at {track}`],
      0: [`Cruel luck for {sur} as {why} ends the {gp}`, `{why} forces {sur} out at {track}`, `Retirement for {sur} at {track}: {why}`] },
    tv: { '-1': [`Heartbreak for {sur}! Out at {track}`, `Drama at {track}: {sur} is out`], 0: [`Nightmare for {sur}: {why} at {track}`] },
    tab: { '-1': [`Early bath for {sur} at {track}`, `Not {sur}'s day: out at {track}`], 0: [`Poor {sur}! {why} spoils the party at {track}`] },
    feed: [`"Gutted for him" - fans send support to {sur} after {track}`, `Chequered rallies round {sur} after a retirement at {track}`],
  },
  crash: {
    blame: {
      serious: [`{sur} blamed for collision with {whoSur} at {track}`, `Stewards find {sur} at fault for contact with {whoSur}`, `{sur} at fault for a collision at {track}`, `An expensive afternoon for {team}: {sur} at fault at {track}`],
      tv: [`Contact! {sur} and {whoSur} tangle at {track}`, `{sur} goes for the gap - and it closes at {track}`],
      pod: [`Ep. {ep}: was {sur}'s move on {whoSur} on? We argue for an hour`, `Ep. {ep}: {sur}, one corner and a lot of opinions`],
      tab: [`Oops! {sur} and {whoSur} come together at {track}`, `Bumper cars at {track}: {sur} in the wars`, `Late on the brakes, {sur}? Contact at {track}`],
      feed: [`Fans split over {sur}'s collision with {whoSur}`, `"Lap-one optimism" - fans on {sur}'s collision at {track}`, `Chequered can't agree: was {sur} to blame?`],
    },
    incident: {
      serious: [`Contact between {sur} and {whoSur} at {track}`, `Racing incident: {sur} and {whoSur} tangle at {track}`, `{sur} caught up in contact at {track}`],
      tv: [`Contact at {track}! {sur} involved`],
      tab: [`Who's to blame? {sur} and {whoSur} at odds after contact at {track}`, `Wrong place, wrong time for {sur} at {track}`],
      feed: [`Chequered can't agree: {sur} or {whoSur}?`, `Fans back {sur} after contact at {track}`],
    },
  },
  pole: {
    serious: [`Pole position for {sur} at {track}`, `{sur} takes pole for the {gp}`, `{sur} on pole after a superb lap at {track}`],
    apex: [`Anatomy of a pole lap: {sur} at {track}`],
    tv: [`POLE! {sur} stuns {track}`, `{sur} snatches pole at the death`],
    tab: [`{sur} on pole - and on top of the world`, `Front of the queue: {sur} grabs pole at {track}`],
    feed: [`{sur}'s pole lap onboard is the most-watched clip on Chequered`, `#{hash}Pole trending after a stunning lap at {track}`],
  },
  fastest: {
    serious: [`Fastest lap for {sur} at {track}`, `{sur} goes purple with the fastest lap at {track}`],
    tv: [`Purple patch! {sur} sets the fastest lap at {track}`],
    feed: [`Fans love {sur}'s fastest lap at {track}: "had it in hand"`],
  },
  dotd: {
    serious: [`Fans vote {sur} Driver of the Day at {track}`, `{sur} is Driver of the Day at the {gp}`],
    tv: [`The people's choice: {sur} is Driver of the Day`],
    radio: [`Our listeners called it: {sur} is Driver of the Day`, `Driver of the Day {sur} - and the phones agree`],
    feed: [`Chequered voted: {sur} is Driver of the Day at {track}`, `{sur} wins the fan vote by a distance at {track}`],
  },
  overtakes: {
    serious: [`{sur} makes up ground with {n} overtakes at {track}`, `{n} passes for {sur} on a busy afternoon at {track}`],
    tv: [`{sur} carves through the field at {track} - {n} overtakes!`, `Overtake after overtake: {sur} puts on a show at {track}`],
    pod: [`Ep. {ep}: all {n} of {sur}'s overtakes at {track}, ranked`],
    feed: [`A {n}-overtake compilation of {sur} at {track} is doing the rounds`, `"Send it" - fans on {sur}'s {n} passes at {track}`],
  },
  penalty: {
    serious: { '-1': [`{sur} penalised for {reason} at {track}`, `Stewards hand {sur} {ptsTxt} for {reason}`, `{sur} picks up {ptsTxt} at {track}`], 0: [`A penalty for {sur} at {track}: {reason}`, `{sur} penalised at {track}`] },
    weekly: [`The stewards' notebook: {sur} and {reason}`, `{ptsTxt} for {sur}: the decision explained`],
    tv: [`Penalty! {sur} punished for {reason}`],
    tab: [`Naughty step for {sur}! {ptsTxt} at {track}`, `Teacher's watching: {sur} in trouble with the stewards`],
    feed: [`Fans debate {sur}'s penalty for {reason}: harsh or fair?`, `"Fair call" - most of Chequered agrees with {sur}'s penalty`],
  },
  // (a strategy call that made or cost your race - race/Calls.js: most are the pit wall's, so the team is in the line)
  strategy: {
    late: {
      serious: [`{team} admit {sur} was left out a lap too long at {track}`, `A late call from {team} costs {sur} {n} places at {track}`, `Questions for the {team} pit wall after {sur}'s late stop at {track}`],
      tv: [`Too late! {team} leave {sur} out on worn tyres at {track}`, `Strategy blunder at {track}: {sur} kept out a lap too long`],
      pod: [`Ep. {ep}: the lap {team} left {sur} out, and what it cost`],
      tab: [`Asleep on the pit wall? {team} leave {sur} out too long at {track}`, `Box, box - eventually! {team}'s slow call costs {sur}`],
      feed: [`"Box a lap ago!" - Chequered fumes at {team}'s late call for {sur}`, `Fans want answers from {team} after {sur}'s late stop at {track}`],
    },
    tyre: {
      serious: [`Wrong tyres from {team}: {sur}'s {comp}s fall away at {track}`, `{team}'s tyre choice leaves {sur} struggling at {track}`, `{sur} let down by {team}'s tyre call at {track}`],
      tv: [`The tyres are gone! {team}'s call backfires on {sur} at {track}`],
      tab: [`Wheel of misfortune: {team} pick the wrong {comp}s for {sur}`, `Rubber trouble for {sur} at {track}`],
      feed: [`"Who picked those tyres?" - fans on {team}'s call for {sur} at {track}`],
    },
    unlucky: {
      serious: [`Safety car timing cruel to {sur} at {track}`, `{sur} pits a lap before the safety car and pays for it at {track}`, `Bad luck for {sur}: a stop just before the safety car at {track}`],
      tv: [`Gutted! {sur} pits just before the safety car at {track}`],
      tab: [`Typical! {sur} pits - and out comes the safety car`, `Worst timing at {track}? {sur} stops a lap too soon`],
      feed: [`"Worst timing ever" - fans feel for {sur} after the safety car at {track}`],
    },
    undercutWon: {
      serious: [`{team}'s undercut puts {sur} ahead of {whoSur} at {track}`, `A well-timed stop gets {sur} past {whoSur} at {track}`, `{team} win the strategy battle at {track}`],
      apex: [`The undercut, done right: how {team} got {sur} ahead at {track}`],
      tv: [`Undercut! {sur} jumps {whoSur} in the stops at {track}`],
      pod: [`Ep. {ep}: the {sur} undercut at {track}, lap by lap`],
      tab: [`Pit-stop pickpocket! {sur} steals a place from {whoSur}`, `In and out: {sur} sneaks ahead at {track}`],
      feed: [`"Textbook" - fans hail {team}'s undercut for {sur} at {track}`],
    },
    undercutFailed: {
      serious: [`{sur}'s undercut on {whoSur} falls short at {track}`, `An early stop fails to get {sur} ahead at {track}`],
      tv: [`No dice! {sur}'s undercut doesn't work at {track}`],
      tab: [`Nice try, {sur}: the undercut flops at {track}`],
      feed: [`Fans debate {team}'s early stop for {sur} at {track}`],
    },
    gamblePaid: {
      serious: [`{team}'s safety-car gamble pays off for {sur} at {track}`, `{sur} gains {n} places on one well-timed stop at {track}`, `A long first stint and a cheap stop: {sur} up to {pos} at {track}`],
      apex: [`How {team}'s patient strategy won {sur} {n} places at {track}`],
      tv: [`The gamble pays off! {sur} up to {pos} at {track}`],
      tab: [`Jackpot! {sur}'s strategy gamble comes good at {track}`],
      feed: [`"Big-brain strategy" - fans love {team}'s call for {sur} at {track}`],
    },
    gambleFailed: {
      serious: [`No safety car, no reward: {team}'s gamble fails {sur} at {track}`, `{sur} drops {n} places with a last-lap stop at {track}`, `{team} wait for a safety car that never came at {track}`],
      tv: [`It never came! {sur}'s safety-car gamble fails at {track}`],
      tab: [`Waiting for a miracle: {team}'s gamble leaves {sur} short`],
      feed: [`Fans question {team}'s all-or-nothing strategy for {sur} at {track}`],
    },
  },
  ban: {
    serious: [`{sur} to miss {nextgp} after reaching 12 penalty points`, `Twelve points: {sur} handed a one-race ban`, `{sur} suspended for one race under the penalty-points system`],
    apex: [`How {sur} reached twelve points - and what has to change`],
    weekly: [`Analysis: the run of penalties that led to {sur}'s ban`],
    pod: [`Ep. {ep}: {sur} is banned for a race. We discuss`],
    tab: [`Red card! {sur} banned for a race`, `Benched: {sur} sits out {nextgp}`],
    feed: [`Fans react to {sur}'s one-race ban: "saw it coming"`, `#Free{hash} trends as {sur} faces a race ban`],
  },
  banReturn: {
    serious: [`{sur} returns from a one-race ban`, `Back from suspension: {sur} rejoins {team}`, `{sur} back in the car after serving a one-race ban`],
    tab: [`Back from the naughty step: {sur} returns`],
    feed: [`Welcome back, {sur}: fans glad to see the {team} driver back`],
  },
  standin: { serious: [`{sub} stands in at {team} for the {gp}`, `{sub} deputises in the {team} car at {track}`, `{sub} takes the {team} seat at {track}`] },
  moment: {
    serious: [`{sur} the star of the show at {track}`, `A weekend to remember for {sur} at {track}`],
    tv: [`Everyone's talking about {sur} after {track}`],
    feed: [`{sur}'s weekend at {track}: Chequered can't stop sharing it`],
  },
  jab: {
    laugh: { tab: [`Grid banter: {sur} and {whoSur} share a joke before the start`, `Shove and a smile: {sur} winds up {whoSur} on the grid`], tv: [`All smiles on the grid between {sur} and {whoSur}`],
      feed: [`{sur} and {whoSur} messing about on the grid is the wholesome content we needed`] },
    glare: { tab: [`Frosty! {whoSur} not amused by {sur}'s grid-walk shove`, `{sur} pokes the bear: a cold stare from {whoSur}`], tv: [`Tension on the grid: {sur} and {whoSur}`],
      feed: [`The look {whoSur} gave {sur} on the grid is already a meme`] },
    push: { tab: [`Pushing and shoving! {sur} and {whoSur} on the grid`, `Handbags warm-up: {whoSur} shoves {sur} back on the grid`], tv: [`Tempers flare on the grid: {sur} and {whoSur} trade shoves`],
      feed: [`The grid-walk shove between {sur} and {whoSur} has Chequered buzzing`] },
  },
  brawl: {
    scuffle: {
      serious: [`Stewards look into a scuffle between {sur} and {whoSur} on the grid`, `Grid scuffle: {sur} and {whoSur} separated before the {gp}`, `Tempers flare between {sur} and {whoSur} before the start at {track}`],
      apex: [`A sport losing its manners? The grid scuffle at {track}`, `Why {sur} and {whoSur} need to talk - away from the cameras`],
      weekly: [`The {track} grid scuffle: what we saw, and what the stewards will ask`],
      tv: [`Grid-walk handbags! {sur} and {whoSur} square up at {track}`, `Pushing and shoving on the grid: {sur} v {whoSur}`],
      pod: [`Ep. {ep}: handbags at {track}. Who started it? We have theories`, `Ep. {ep}: {sur}, {whoSur} and the least elegant shove in history`],
      tab: [`Handbags at dawn! {sur} and {whoSur} square up`, `Grid-walk grudge match: {sur} and {whoSur} get shirty`, `Hold me back! {sur} and {whoSur} in grid-walk shoving match`],
      feed: [`The grid-walk shove between {sur} and {whoSur} has been viewed millions of times`, `Fans pick sides after {sur} and {whoSur} square up on the grid`],
    },
    big: {
      serious: [`{sur} and {whoSur} pulled apart twice on the grid at {track}`, `Unedifying scenes as {sur} and {whoSur} have to be separated before the start`],
      apex: [`Enough: the grid scuffle at {track} and the example it sets`],
      tv: [`Round two! {sur} and {whoSur} have to be pulled apart on the grid`],
      pod: [`Ep. {ep}: {sur} would not let it go. Neither will we`],
      tab: [`Round two! {sur} won't back down as the {whoSur} row boils over`, `Hold me back... no, really! {sur} and {whoSur} at it again`],
      feed: [`Fans call for calm after {sur} and {whoSur} square up twice on the grid`],
    },
    defended: {
      serious: [`{whoSur} confronts {sur} on the grid; officials step in`, `{sur} on the receiving end of a grid-walk shove from {whoSur}`],
      tv: [`{whoSur} squares up to {sur} on the grid!`],
      tab: [`Who started it? {whoSur} squares up to {sur}`, `Grid-walk handbags: {whoSur} picks on {sur}`],
      feed: [`Fans back {sur} after {whoSur}'s shove on the grid`],
    },
    heard: {
      tab: [`Whispers of grid-walk handbags between {sur} and {whoSur}`],
      feed: [`Rumours of a grid scuffle between {sur} and {whoSur} spread on Chequered`],
    },
  },
  restraint: {
    serious: [`{sur} walks away from trouble on the grid`, `A cool head from {sur} as tempers flare before the start`],
    apex: [`The shove {sur} didn't return`],
    radio: [`Our listeners praise {sur}'s calm on the grid`],
    feed: [`"That's how you handle it" - fans praise {sur} for walking away`],
  },
  talk: {
    warm: { serious: [`A warm moment between {sur} and {whoSur} on the grid`, `{sur} and {whoSur} share a word before the start`], tv: [`Smiles on the grid: {sur} and {whoSur}`], feed: [`A wholesome grid moment between {sur} and {whoSur}`] },
    firm: { tv: [`Straight talking on the grid: {sur} to {whoSur}`, `{sur} has a firm word with {whoSur} before the start`], feed: [`{sur} not holding back with {whoSur} on the grid`] },
    light: { tv: [`Laughter on the grid: {sur} in good spirits with {whoSur}`, `{sur} relaxed and joking before the {gp}`], pod: [`Ep. {ep}: {sur}'s grid-walk stand-up set, reviewed`],
      feed: [`{sur} cracking jokes on the grid is the content we need`] },
    cold: { tab: [`Brrr! {sur} gives {whoSur} the cold shoulder`, `Frosty on the grid: {sur} and {whoSur}`], tv: [`A frosty exchange between {sur} and {whoSur} on the grid`], feed: [`Awkward: {sur} and {whoSur} on the grid`] },
    cruel: { serious: [`Cameras catch sharp words from {sur} to {whoSur} on the grid`, `{sur}'s grid-walk remark to {whoSur} draws criticism`], tv: [`Caught on mic: {sur} has a go at {whoSur}`],
      tab: [`Ouch! {sur} lets {whoSur} have it on the grid`, `Mean streak? {sur}'s jibe at {whoSur} caught on camera`], feed: [`"Not a good look": fans on {sur}'s grid-walk remark`, `Chequered divided over {sur}'s words to {whoSur}`] },
    gossip: { tab: [`Overheard! {sur} talking behind a rival's back on the grid`], feed: [`A grid-walk microphone catches {sur} gossiping - fans have thoughts`] },
  },
  talkPress: {
    warm: { serious: [`{sur} relaxed and open in a grid-walk chat`, `{sur} on the grid: "{line}"`] },
    firm: { serious: [`{sur} on the grid: "{line}"`, `{sur} in no mood for small talk before the {gp}`] },
    light: { serious: [`{sur} in fine form on the grid before the {gp}`, `{sur} on the grid: "{line}"`] },
    cold: { serious: [`{sur} keeps the press at arm's length on the grid`] },
    cruel: { serious: [`{sur} hits out in a grid-walk interview`, `{sur} on the grid: "{line}"`], tab: [`{sur} lets rip on the grid!`], feed: [`Fans react to {sur}'s grid-walk interview`] },
    gossip: { serious: [`{sur} hints at paddock tensions in a grid-walk chat`] },
  },
  interview: {
    humble: { serious: [`{sur} credits {team} after the {gp}`, `{sur} keeps it modest: "{line}"`, `"It's a team effort" - {sur} after {track}`], apex: [`{sur}, the quiet professional`, `{sur} on the team behind the driver`],
      feed: [`Fans love {sur}'s modest interview after {track}`] },
    confident: { serious: { 1: [`{sur} in bullish mood after the {gp}`, `{sur} confident: "{line}"`, `{sur} sends a message after {track}`],
      '-1': [`Big words from {sur} after a difficult {gp}`, `{sur} talks up {team} despite a tough day at {track}`] }, tv: [`{sur} puts the grid on notice!`],
      tab: [`Mr Modest he is not: {sur}'s big talk`, `Who needs modesty? {sur} talks big after {track}`], feed: [`"Confidence or arrogance?" Chequered debates {sur}'s interview`] },
    diplomatic: { serious: [`{sur} measured in the media pen after {track}`, `{sur} keeps a cool head in the media pen`, `{sur} chooses every word carefully after the {gp}`],
      pod: [`Ep. {ep}: {sur} gave the most diplomatic answers in history and we respect it`] },
    cruel: { serious: [`{sur} hits out after the {gp}`, `Sharp words from {sur} in the media pen`, `{sur}'s post-race comments draw criticism`, `{sur}: "{line}"`], tv: [`{sur} goes on the attack in the media pen`],
      tab: [`{sur} lets rip in the media pen!`, `No holding back! {sur} goes off after {track}`], feed: [`"Not a good look" - fans react to {sur}'s interview`, `Chequered splits over {sur}'s media-pen comments`] },
    funny: { serious: { 1: [`{sur} in good humour after {track}`, `Laughter in the media pen with {sur}`], '-1': [`{sur}'s attempt at humour falls flat after {track}`] },
      pod: { 1: [`Ep. {ep}: {sur} should host this podcast, honestly`, `Ep. {ep}: {sur}'s media-pen one-liners, ranked`], '-1': [`Ep. {ep}: {sur} tried a joke. We need to talk about it`] },
      tab: { 1: [`Laugh a lap! {sur} has the media pen in stitches`], '-1': [`Comedy flop: {sur}'s media-pen gag`] }, feed: { 1: [`{sur}'s interview is the clip of the day on Chequered`], '-1': [`Chequered cringes at {sur}'s media-pen joke`] } },
    evasive: { serious: [`{sur} gives little away after the {gp}`, `{sur} dodges the questions at {track}`], pod: [`Ep. {ep}: we asked {sur} three questions and got no answers`] },
  },
  ivBrawl: {
    humble: { serious: [`{sur} regrets the grid-walk scuffle: "{line}"`, `{sur} owns up to the grid scuffle with {whoSur}`, `{sur} apologises for the scenes on the grid`] },
    diplomatic: { serious: [`{sur}: grid-walk scuffle "sorted between us"`, `{sur} plays down the grid-walk scuffle`] },
    confident: { serious: [`{sur} unrepentant over the grid scuffle`], tab: [`No regrets! {sur} on the grid-walk handbags`] },
    cruel: { serious: [`{sur} unrepentant over the grid scuffle with {whoSur}`, `{sur} unrepentant over the grid scuffle`], tab: [`Round three? {sur} reignites the {whoSur} row`] },
    funny: { serious: [`{sur} laughs off the grid-walk handbags`], pod: [`Ep. {ep}: {sur} on the grid scuffle - funnier than it had any right to be`] },
    evasive: { serious: [`{sur} won't discuss the grid scuffle`] },
  },
  ivPoints: {
    humble: { serious: [`{sur}: "I know I have to be cleaner"`, `{sur} accepts the need for cleaner racing with a ban close`] },
    diplomatic: { serious: [`{sur} calm about the penalty points`] },
    confident: { serious: [`{sur} shrugs off fears of a ban`] },
    cruel: { serious: [`{sur} hits out at the stewards`] },
    funny: { serious: [`{sur} jokes about the penalty points`] },
    evasive: { serious: [`{sur} won't be drawn on penalty points`] },
  },
  post: {
    dig: { feed: [`{sur}'s latest post looks like a dig at {whoSur}`, `Fans think {sur}'s post is aimed at {whoSur}`], tab: [`Subtle as a brick! {sur} has a pop at {whoSur} online`] },
    cryptic: { feed: [`What did {sur} mean? Fans puzzle over a cryptic post`, `Two words from {sur}, a thousand theories on Chequered`], tab: [`{sur}'s mystery post sends fans into a spin`] },
    partner: { feed: [`{sur} shares a photo with {celeb} - and Chequered melts`, `{celeb} and {sur}: the most-liked photo of the week`], tab: [`Loved up! {sur} posts a snap with {celeb}`] },
    backlash: { feed: [`"We see you": Chequered unimpressed by {sur}'s latest post`, `{sur}'s latest post backfires on Chequered`], tab: [`Cringe! {sur}'s post goes down like a lead balloon`] },
    again: { feed: [`Fans call it PR: {sur}'s post backfires`, `Fans call it PR: the same post from {sur}, again`], tab: [`Fans call it PR: {sur} tries the same trick twice`] },
    apology: { feed: [`{sur} posts an apology - most fans accept it`], serious: [`{sur} apologises in a social-media post`] },
    celebrate: { feed: [`{sur}'s celebration post is the most-liked of the weekend`, `Fans pile into {sur}'s celebration post`] },
    charity: { radio: [`{sur} backs a good cause - and our listeners follow`], feed: [`Fans pile in to support {sur}'s charity`] },
    thanks: { feed: [`The {team} garage loves {sur}'s thank-you post`] },
  },
  date: {
    tab: [`Spotted! {sur} and {celeb} out on the town`, `{celeb} and {sur}: just friends?`, `Is it love? {celeb} spotted with {sur}`, `Paddock romance? {sur} and {job} {celeb} step out together`,
      `Spotted! {sur} and {celeb} {where}`, `Table for two? {celeb} and {sur} {where}`],
    feed: [`Chequered is in meltdown over photos of {celeb} and {sur}`, `Fans can't get over photos of {celeb} with {sur}`, `Fans spot {celeb} and {sur} {where}`],
    tv: [`Off-track: {sur} and {celeb} pictured together`],
  },
  official: {
    tab: [`It's official! {sur} and {celeb} go public`, `The paddock's new power couple: {sur} and {celeb}`, `Love is in the air (and the pit lane): {sur} and {celeb} confirm romance`],
    feed: [`{celeb} and {sur} make it official - and Chequered approves`, `The most-liked post on Chequered today: {celeb} and {sur}, official`],
    tv: [`{sur} and {job} {celeb} confirm they are a couple`],
    radio: [`Our listeners send their best to {sur} and {celeb}`],
    pod: [`Ep. {ep}: {sur} and {celeb}? We are, frankly, delighted`],
  },
  breakup: {
    her: { tab: [`Heartbreak for {sur} as {celeb} calls it a day`, `It's over: {celeb} and {sur} split`], tv: [`{celeb} and {sur} go their separate ways`], feed: [`Fans send love to {celeb} and {sur} after the split`] },
    you: { tab: [`{sur} and {celeb} split`, `Splitsville for {sur} and {celeb}`], tv: [`{sur} and {celeb} go their separate ways`], feed: [`"Sad to see it": Chequered reacts to {celeb} and {sur} splitting`] },
  },
  rumour: {
    together: { tab: [`Spotted together again: what's going on with {sur} and {celeb}?`, `{celeb} and {sur}: the not-so-secret romance`], feed: [`Long-lens photos of {celeb} and {sur} are everywhere`] },
    linked: { tab: [`{celeb} spotted with {other} - should the {team} driver be worried?`, `Lunch with {other}: {celeb}'s afternoon sets tongues wagging`],
      feed: [`Chequered speculates about {celeb} and {other}; her team calls it nonsense`] },
  },
  scandal: {
    // (seen on the grid: a flirt in front of her)
    grid: {
      tab: [`Wandering eye? {sur} caught flirting with {other} as {her} looks on`, `Awkward! {sur} charms {other} on the grid - with {her} watching`, `Grid-walk love triangle? {sur}, {her} and {other}`,
        `Awkward on the grid: {sur}, {her} and a very public flirt`],
      feed: [`Fans can't believe the grid-walk clip of {sur} and {other}`, `#Team{her} trends after {sur}'s grid-walk flirting`],
      tv: [`Off-track drama: {sur}'s grid-walk flirting caught on camera`],
    },
    // (a second relationship found out: photographs, messages, a tip-off)
    secret: {
      tab: [`Double life? {sur} linked with {her} - and {other}`, `Caught out! {her} learns of {sur}'s secret romance with {other}`, `Love triangle in the paddock? {sur}, {her} and {other}`,
        `Two at once? The Paddock Post on {sur}, {her} and {other}`],
      feed: [`#Team{her} trends as fans learn about {sur} and {other}`, `Chequered can't believe the story of {sur}, {her} and {other}`],
      tv: [`Off-track drama: reports link {sur} with both {celeb} and {other}`],
    },
  },
  nightout: {
    late: {
      tab: [`Party animal! {sur} out until 3am in {city}`, `Burning the midnight oil: {sur} hits the town in {city}`, `Late night, early grid? {sur} out on the town in {city}`, `Viva {vegas}! {sur} paints the Strip red`],
      feed: [`Fans spot {sur} on a night out in {city}`, `"Drivers are allowed a night off" - Chequered on {sur}'s late one`],
      tv: [`{sur} pictured on a late night out days before the {gp}`],
    },
    // (an evening with friends at one of the hangout venues: light, and nobody else is named)
    friends: {
      tab: [`Night off: {sur} and friends {where}`, `Busman's holiday! {sur} spotted {racy}`, `Who won? {sur} and friends {racy}`],
      feed: [`Fans spot {sur} and friends {where}`, `"A night off, and still racing" - fans spot {sur} {racy}`],
    },
  },
  // (race night, after the race (career/Party.js): {city} and {gp} are the race just run. A rival is never named, and a
  // real-driver player is only ever 'the <team> driver' - this is a personal kind)
  party: {
    glam: { tab: [`{sur} holds court in the VIP booth as the {gp} party rolls on`, `Bottles, sparklers and {sur}: inside the {gp} after-party`, `VIP: {sur} lights up {place} after the {gp}`],
      feed: [`Fans spot {sur} at the {gp} after-party`, `{sur} at {place} after the {gp}: the clips are everywhere`] },
    // ({vegas} only exists for a Las Vegas race: the clubs there close at five, London's at three)
    late: { tab: [`Breakfast at four in {vegas}: {sur}'s {gp} night out`, `Party animal! {sur} out into the small hours after the {gp}`, `No early night for {sur}: the {gp} party goes on until dawn`],
      feed: [`"Drivers are allowed a night off": fans on {sur}'s late one after the {gp}`, `Fans spot {sur} heading home in the small hours in {city}`] },
    stumble: { tab: [`Wobbly exit! {sur} helped into a car outside a {vegas} club at 4am`, `Wobbly exit! {sur} helped into a car outside a {city} club in the early hours`, `Big night! {sur} needs a hand leaving {place}`, `{sur}'s {gp} celebrations end on unsteady feet`],
      feed: [`Fans split over pictures of {sur} leaving a {city} club in the early hours`, `"Let him celebrate" or "not a good look"? Fans on {sur}'s night out`],
      tv: [`{sur} pictured leaving a {city} club in the early hours`] },
    celebrate: { tab: [`Champagne, sparklers, {sur}: a big night in {city}`, `Party time! {sur} toasts the {gp} with the team`],
      feed: [`{sur} and the team celebrate the {gp}, and fans love it`, `Fans can't get enough of {sur}'s {gp} celebrations`], tv: [`The celebrations go on into the night for {sur} after the {gp}`] },
    shoey: { tab: [`Shoey! {sur} celebrates the {gp} podium the hard way`, `Bottoms up: {sur}'s {gp} shoey`],
      feed: [`{sur}'s shoey is the most-shared clip of the night`, `Fans can't decide whether {sur}'s shoey is brilliant or disgusting`] },
    dance: { tab: [`{sur} dances the night away after the {gp}`], feed: [`Fans rate {sur}'s dance moves after the {gp}`] },
    jade: { tab: [`Jade Okafor spins the {gp} after-party, and {sur} is on the dance floor`], feed: [`Jade Okafor's {gp} after-party set has {sur} dancing`] },
    sponsor: { tab: [`{brand}'s {gp} after-party: {sur} the star turn`], feed: [`{sur} is the face of {brand}'s {gp} after-party`, `{brand} shares clips of {sur} at their {gp} after-party`] },
    kiss: { tab: [`Caught on the dance floor: {sur} and {celeb}`, `Sealed with a kiss: {sur} and {celeb} at the {gp} after-party`],
      feed: [`Fans can't stop sharing the clip of {sur} and {celeb} at the {gp} after-party`], tv: [`{sur} and {celeb} pictured together at the {gp} after-party`] },
    together: { tab: [`Leaving together: {sur} and {celeb} after the {gp} party`, `Same car home? {sur} and {celeb} leave {place} together`],
      feed: [`Fans spot {sur} and {celeb} leaving the {gp} after-party together`] },
    row: { tab: [`Words exchanged: {sur} in heated row with a rival driver at {gp} after-party`, `Handbags at the bar: {sur} and a rival trade words in {city}`],
      feed: [`Word is {sur} had words with a rival at the {gp} after-party`], tv: [`Reports of a row between {sur} and a rival driver after the {gp}`] },
    scuffle: { tab: [`Bouncers step in as {sur}'s night ends early`, `Thrown out! {sur}'s {gp} party ends in a scuffle`, `Security called as {sur} squares up at {place}`],
      feed: [`Footage of {sur} being separated by security is everywhere`], tv: [`{sur} involved in a scuffle at a {city} club`],
      serious: [`{sur} asked to leave a {city} club after an altercation`, `{sur} escorted out by security at {place} after the {gp}`, `Club incident in {city}: {sur} shown out after a scuffle`] },
    quiet: { tab: [`Early night for {sur}: "Next race starts now"`], feed: [`{sur} skips the parties, and the fans approve`], apex: [`{sur} goes home early after the {gp}, and means it`] },
    quote: { tab: [`"The car's a pig": {sur}'s late-night verdict`, `Loose lips: {sur} lets slip what the team really thinks of the car`, `Overheard at {place}: {sur} on the car`],
      feed: [`The clips of {sur}'s late-night verdict on the car are everywhere`], pod: [`Ep. {ep}: what {sur} said about the car at the bar, and whether the team will mind`] },
    loose: { tab: [`Loose lips: {sur}'s late-night opinions after the {gp}`, `Overheard at {place}: {sur}, a few drinks in`], feed: [`Everyone is sharing what {sur} said at the {gp} after-party`] },
    club: { feed: [`{place}: "Thank you {sur} for a night to remember"`, `{place} posts {sur} in the VIP booth after the {gp}`] },
    // affection hook (career/AffectionResult.js): the two of you close in public, her own move caught on a phone, a friend
    // seen safely home. {celeb} is one of the twelve; the friend is never named
    cosy: { tab: [`Cosy! {sur} and {celeb} get close at the {gp} after-party`, `Just good friends? {sur} and {celeb} at {place}`, `Spotted: {sur} and {celeb}, very close, after the {gp}`],
      feed: [`Fans spot {sur} and {celeb} looking very cosy at the {gp} after-party`, `Chequered can't decide whether {sur} and {celeb} are a thing`] },
    stolen: { tab: [`Stolen kiss? {celeb} leans in on {sur} at the {gp} after-party`, `Who kissed who? {celeb} and {sur} caught in a moment at {place}`, `Did she or didn't she? {celeb} and {sur} after the {gp}`],
      feed: [`Fans debate the clip of {celeb} and {sur} at the {gp} after-party: a kiss, or not?`, `The clip of {celeb} and {sur} at {place} has Chequered talking`],
      tv: [`{celeb} and {sur} pictured in a close moment at the {gp} after-party`] },
    carer: { tab: [`Gentleman {sur} sees a friend safely into a car after the {gp} party`, `The responsible one: {sur} looks after a friend at {place}`],
      feed: [`Fans love {sur} looking after a friend at the {gp} after-party`, `"That's a good friend": fans on {sur} getting a pal home safely after the {gp}`] },
  },
  charity: {
    day: { radio: [`{sur} gives a day to a good cause - and our listeners pledge too`, `Our listeners rally behind {sur}'s charity day`], apex: [`Away from the cameras: {sur}'s day for charity`],
      serious: [`{sur} spends a day with a local charity`, `{sur} backs a good cause between races`], feed: [`Fans praise {sur}'s charity work: "class act"`] },
    donation: { radio: [`{sur} makes a donation - and our listeners match it`], serious: [`{sur} makes a personal donation to charity`], feed: [`Quietly generous: {sur}'s donation gets a thumbs-up from fans`] },
  },
  fans: {
    radio: [`{sur} meets the fans - and stays for every selfie`, `Two hours of autographs: {sur} delights the fans`],
    feed: [`Fan-meet clips of {sur} are pure joy`, `"Stayed till the last selfie" - fans on meeting {sur}`],
  },
  sponsorDay: { feed: [`{sur} spends the day with {brand}`, `{brand} shares behind-the-scenes clips from their day with {sur}`] },
  mediaDay: {
    serious: [`Exclusive: {sur} on {team}'s season`, `In conversation: {sur} on {team} and the year ahead`],
    apex: [`The long read: {sur} on speed, patience and {team}`],
    weekly: [`Paddock Weekly meets {sur}: the interview`],
    tv: [`{sur} unfiltered: a day at the factory with RACE 24`],
    pod: [`Ep. {ep}: {sur} joins us in the studio (and loses the quiz)`],
    radio: [`{sur} live on GRID FM: your calls, your questions`],
    tab: [`Our day with {sur}: tea, biscuits and very careful answers`],
  },
  signing: {
    serious: [`{sur} joins {newTeam}`, `Confirmed: {sur} signs for {newTeam}`],
    tv: [`Big move! {sur} signs for {newTeam}`],
    tab: [`New colours for {sur}: {newTeam} it is`],
    feed: [`Fans react to {sur}'s move to {newTeam}`],
  },
  trophy: { serious: [`Milestone for {sur}: {trophy}`], feed: [`"{trophy}": fans celebrate a milestone for {sur}`] },
  season: {
    champ: { serious: [`{sur} is World Champion`, `{season} World Champion: {sur}`], apex: [`Champion: the season {sur} got everything right`], tab: [`Champion {sur}! Let the party begin`],
      feed: [`#Champion{hash}: Chequered celebrates {sur}'s title`] },
    year: { serious: [`{sur} ends {season} {posn} in the championship`, `Season review: {sur}, {posn} in {season}`], apex: [`The {season} season of {sur}: a review`],
      tab: [`So long, {season}: {sur}'s year in pictures`], feed: [`{sur}'s season in clips: fans pick the best moments of {season}`] },
  },
  deal: {
    sign: { serious: [`{sur} signs a personal deal with {brand}`], feed: [`{sur} is the new face of {brand}`], tab: [`Kerching! {sur} lands a {brand} deal`] },
    drop: { serious: [`{brand} ends its deal with {sur}`, `{brand} parts company with {sur}`], tab: [`Dropped! {brand} cuts ties with {sur}`] },
    warn: { serious: [`{brand} "monitoring the situation" around {sur}`] },
    done: { feed: [`{sur}'s deal with {brand} comes to an end`] },
  },
  crisis: {
    slump: { weekly: [`Analysis: is {team} losing patience with {sur}?`, `Three races, three disappointments: questions mount for {sur}`], tab: [`Crisis? What crisis? {sur}'s slump goes on`] },
    reckless: { apex: [`A pattern? {sur} and the stewards`, `Too many penalties: the {sur} question`], weekly: [`The stewards' notebook is filling up: {sur} under scrutiny`] },
    clash: { weekly: [`{sur}'s clash with {whoSur}: lunge or racing incident?`, `{sur}'s collision at {track}: lunge or racing incident?`], tab: [`Bad blood? {sur} and {whoSur} after the collision`] },
    feud: { tv: [`War of words: {sur} v {whoSur}`], tab: [`Handbags at ten paces: {sur} and {whoSur} trade barbs`] },
    cruel: { tv: [`{sur}'s remark: the clip everyone is replaying`] },
    moment: { feed: [`{sur} is having a moment - and the sponsors have noticed`] },
  },
  resolve: {
    apologise: { serious: [`{sur} apologises over {story}`, `"I got it wrong": {sur} on {story}`], tab: [`{sur} says sorry - and we're almost disappointed`], feed: [`Most fans accept {sur}'s apology over {story}`] },
    explain: { serious: [`{sur} speaks out on {story}`, `{sur} gives an account of {story}`], feed: [`Fans split over {sur}'s explanation of {story}`] },
    silence: { serious: [`No comment from {sur} on {story}`], tab: [`Silence from {sur} over {story}`] },
    defiant: { serious: [`{sur} unrepentant over {story}`], tab: [`No regrets! {sur} stands firm over {story}`], feed: [`"Respect the honesty" or "not a good look"? Chequered on {sur}'s stance`] },
    joke: { pod: [`Ep. {ep}: {sur} turned {story} into the joke of the year`], feed: [`{sur}'s joke about {story} wins the internet`] },
    jokeBad: { tab: [`Not funny! {sur}'s joke about {story} falls flat`], feed: [`Tone-deaf? Fans unimpressed by {sur}'s joke about {story}`] },
    privacy: { serious: [`{sur} asks for privacy`], tab: [`{sur} asks for privacy. We'll try`], feed: [`Fans respect {sur}'s request for privacy`] },
    capitalise: { feed: [`{sur} rides the wave: followers soar after {story}`], tv: [`Everyone wants a piece of {sur} after {story}`] },
    stayHumble: { serious: [`{sur} credits the team after {story}`], apex: [`{sur}, staying grounded`] },
    expire: { serious: [`Still no answers from {sur} on {story}`], tab: [`{sur} hides as {story} rumbles on`] },
  },
};

// ---- writing a story --------------------------------------------------------------------------------------------------
/** a line with its tokens filled (a missing token: null); a sentence after . ! ? starts with a capital (cap false: a phrase for the middle of one) */
const fill = (s, X, cap = true) => {
  let bad = false;
  const t = s.replace(/\{(\w+)\}/g, (m, k) => { const v = X[k]; if (v == null || v === '') { bad = true; return ''; } return String(v); });
  return bad ? null : cap ? t.replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase()) : t;
};
const pickFill = (arr, X) => { const ok = (arr || []).map((s) => fill(s, X)).filter(Boolean); return ok.length ? pick(ok) : null; };
/** a headline: the bank's lines (a sub-bank where the story has one) in the outlet's voice and take -> text | null */
const headline = (bank, sub, o, tone, evTone, X) => {
  let H = HL[bank]; if (H && sub) H = H[sub]; if (!H) return null;
  const tones = [...new Set([tone, 0, evTone, 1, -1])];
  // (the tabloid and the fans never borrow a broadsheet's voice)
  const voices = o.group === 'tab' || o.group === 'feed' ? [o.id, o.group] : [o.id, o.group, 'serious'];
  for (const v of voices) {
    const L = H[v]; if (!L) continue;
    if (Array.isArray(L)) { const t = pickFill(L, X); if (t) return t; continue; }
    for (const t of tones) { const s = pickFill(L[t], X); if (s) return s; }
  }
  return null;
};
// (the personal side of life: a real driver in these stories is only ever 'the <team> driver')
const PERSONAL = new Set(['date', 'official', 'breakup', 'rumour', 'scandal', 'nightout', 'hangout', 'party']);
/** the driver a story names: { did, name } in data, or target / about / who / rival as an id, a name or such an object - drivers only, never you -> { did, name } | null */
const whoOf = (c, x) => {
  const D = c?.drivers || {}, all = Object.values(D);
  for (const v of [x.did != null ? { did: x.did, name: x.name } : null, x.target, x.about, x.who, x.rival]) {
    if (v == null || v === '') continue;
    const d = typeof v === 'object' ? D[v.did ?? v.id ?? v.careerId] || all.find((q) => q.name === v.name) : D[v] || all.find((q) => q.name === v);
    if (d && d.id !== c.playerId) return { did: d.id, name: d.name };
  }
  return null;
};
/** the other party in a romance story: another celebrity of the roster or one of the invented men - never a driver -> a name | null */
const otherOf = (c, x) => {
  const nm = x.otherName || celebName(x.other); if (!nm) return null;
  if (Object.values(c?.drivers || {}).some((d) => d.name === nm)) return null;
  return MEN.includes(nm) || CELEB_IDS.some((id) => celebName(id) === nm) ? nm : null;
};
/** the celebrity in the story, from the roster only -> her name | null */
const celebOf = (x) => {
  if (CELEB_IDS.includes(x.celeb)) return x.celebName && CELEB_IDS.some((id) => celebName(id) === x.celebName) ? x.celebName : celebName(x.celeb);
  return x.celebName && CELEB_IDS.some((id) => celebName(id) === x.celebName) ? x.celebName : null;
};
const jobText = (j) => { const s = String(j || ''); return !s ? null : /^(Olympic|TV|DJ)\b/.test(s) ? s : s[0].toLowerCase() + s.slice(1); };
/** where you stand in the title race, when it is close -> 'leads the championship by 12 points' | 'is 9 points behind Norris in the championship' */
const titleRace = (c) => {
  try {
    const st = typeof c?.driverStandings === 'function' ? c.driverStandings() : null, me = meOf(c); if (!st || st.length < 2 || !me) return undefined;
    const i = st.findIndex((d) => d.id === me.id); if (i < 0) return undefined;
    const pl = (g) => `${g} point${g === 1 ? '' : 's'}`;
    if (i === 0) { const g = num(me.points, 0) - num(st[1].points, 0); return g > 0 ? `leads the championship by ${pl(g)}` : 'leads the championship'; }
    const g = num(st[0].points, 0) - num(me.points, 0);
    return g === 0 ? `is level on points with ${last(st[0].name)} at the top` : g <= 30 ? `is ${pl(g)} behind ${last(st[0].name)} in the championship` : undefined;
  } catch (e) { return undefined; }
};
/** a quoted answer for a headline (short, no quote marks, no full stop) */
const clip = (s) => { const t = String(s || '').replace(/["“”]/g, '\'').trim().replace(/\.$/, ''); return t && t.length <= 80 ? t : undefined; };
/** the tokens of a story: you (hidden behind your team in a personal story about a real driver), the race, the people in it */
const tokens = (c, kind, x = {}, anon = PERSONAL.has(kind)) => {
  const me = meOf(c), name = me?.name || 'Your driver', team = me?.team || c?.myTeam || 'the team', hide = anon && isReal(me), tag = `the ${team} driver`;
  const xt = typeof x.track === 'string' ? (TRACK[x.track] ? x.track : Object.keys(TRACK).find((k) => TRACK[k] === x.track) || null) : null, tid = xt || trackIdOf(c);
  const track = TRACK[tid] || (typeof x.track === 'string' && x.track ? x.track : undefined), nid = kind === 'ban' && xt ? xt : trackIdOf(c, 1), W = whoOf(c, x);
  let mate = null; try { mate = typeof c?.teammate === 'function' ? c.teammate() : null; } catch (e) { mate = null; }
  const p = num(x.pos, null), pts = num(x.pts, 0), cn = celebOf(x);
  return {
    me: hide ? tag : name, sur: hide ? tag : last(name), team, track, gp: GP[tid] || (track ? `${track} Grand Prix` : undefined), city: CITY[tid] || track, vegas: tid === 'lasvegas' ? 'Vegas' : undefined,
    nextgp: GP[nid] ? `the ${GP[nid]}` : 'the next race', hash: (hide ? team : last(name)).replace(/[^A-Za-z0-9]/g, ''), ep: 140 + (num(c?.season, 2026) - 2026) * 30 + num(c?.round, 1) * 2,
    who: W?.name, whoSur: W ? last(W.name) : undefined, did: W?.did ?? null, mate: mate && mate.id !== W?.did ? last(mate.name) : undefined,
    p, pos: p ? `P${p}` : undefined, posn: p ? ORD[p] : undefined, ptsTxt: pts > 0 ? `${pts} penalty point${pts === 1 ? '' : 's'}` : undefined,
    reason: typeof x.reason === 'string' && x.reason ? x.reason : undefined, n: num(x.n, null) ?? undefined,
    celeb: cn || undefined, her: cn ? first(cn) : undefined, job: cn ? jobText(x.job) || undefined : undefined, other: otherOf(c, x) || undefined,
    brand: x.brand ? String(x.brand) : undefined, trophy: kind === 'trophy' && x.name ? x.name : undefined, newTeam: kind === 'signing' && x.team ? x.team : undefined,
    sub: kind === 'standin' && x.name ? x.name : undefined, line: clip(x.line), season: num(x.season, num(c?.season, 2026)), title: titleRace(c), story: x.story || undefined,
    where: WHERE[x.venue], racy: RACY[x.venue], place: typeof x.place === 'string' && x.place ? x.place : undefined,
    comp: typeof x.comp === 'string' && /^(SOFT|MEDIUM|HARD|INTER|WET)$/i.test(x.comp) ? ({ INTER: 'intermediate', WET: 'wet' }[x.comp.toUpperCase()] || x.comp.toLowerCase()) : undefined,
  };
};
/** how an outlet takes a story: its tone, what it is about against the outlet's taste, its opinion of you, your persona -> about -1.5..1.5 */
const takeOf = (P, o, ev) => {
  const L = o.likes, th = ev.theme || {}, sh = shares(P.persona);
  let s = num(ev.tone, 0);
  for (const k of Object.keys(th)) s += th[k] * (L[k] || 0) * 0.5;
  s += clamp(num(P.media[o.id], 0), -100, 100) / 100 * 0.6;
  s += (sh.humble * L.humility + sh.controversial * (L.drama - L.humility) * 0.6 + sh.showman * (L.drama + L.candour) * 0.25 + sh.confident * L.results * 0.2) * 0.4;
  return s;
};
const toneOf = (s) => (s > 0.3 ? 1 : s < -0.3 ? -1 : 0);
/** move image / heat / appeal / followers, clamped -> what actually moved */
const bump = (P, v) => {
  const i0 = P.image, h0 = P.heat, a0 = P.appeal, f0 = P.fame;
  P.image = r1(clamp(i0 + num(v.image, 0), -100, 100)); P.heat = r1(clamp(h0 + num(v.heat, 0), 0, 100));
  P.appeal = r1(clamp(a0 + num(v.appeal, 0), 0, 100)); P.fame = r2(Math.max(0.05, f0 + num(v.fame, 0)));
  return { image: r1(P.image - i0), fame: r2(P.fame - f0), heat: r1(P.heat - h0), appeal: r1(P.appeal - a0) };
};
const rel = (P, id, v) => { if (!OUTLET_BY_ID[id] || !num(v, 0)) return; P.media[id] = r1(clamp(num(P.media[id], 0) + v, -100, 100)); };
/** this round's counters (headlines a kind may print, news lines, posts): false once max is reached */
const lim = (c, P, k, max) => {
  const kk = key(c); if (!P.lim || P.lim.key !== kk) P.lim = { key: kk };
  if (num(P.lim[k], 0) >= max) return false;
  P.lim[k] = num(P.lim[k], 0) + 1; return true;
};
const feedPush = (c, P, h, kind) => { P.feed.unshift({ season: c.season, round: c.round, outlet: h.outlet, text: h.text, tone: h.tone, kind }); if (P.feed.length > FEED_CAP) P.feed.length = FEED_CAP; };
/** one line in the paddock news, sparingly (three a round at most: the race news must not be pushed out) */
const news = (c, P, text) => { if (typeof c.addNews === 'function' && lim(c, P, 'news', NEWS_A_ROUND)) c.addNews(text); };
const tallyUp = (c, P, res) => { const k = key(c); if (!P.tally || P.tally.key !== k) P.tally = { key: k }; P.tally[res] = true; };
/** the race just run, as the PR desk saw it (its key is that race's, or this one's during the race weekend) */
const recentTally = (c, P) => { const T = P.tally; return T && (T.key === key(c) || T.key === `${c.season}|${c.round - 1}`) ? T : null; };
/**
 * A story, applied (ev: { tone, theme, fx: { image, heat, appeal, fame: [share of your following, + millions] },
 * persona, cover (outlet ids), size (headlines printed), sub, lines (another bank), force (an outlet that must print it),
 * media, res (the result, for the tally), news, limit / limitMax (headlines per round), crisis, quiet }): the outlets'
 * takes shade the image (a friendly press softens a loss), the manager softens it further, positives scale by x.mul
 * (the week's diminishing returns) -> { headlines, d }
 */
const apply = (c, P, kind, ev, X, x = {}) => {
  const mul = clamp(num(x.mul, 1), 0, 2), sk = skillOf(P), fx = ev.fx || {}, theme = ev.theme || {};
  const takes = [...new Set(ev.cover || [])].map((id) => OUTLET_BY_ID[id]).filter(Boolean).map((o) => ({ o, s: takeOf(P, o, ev) }));
  let img = num(fx.image, 0);
  if (img && takes.length) { const R = takes.reduce((a, t) => a + t.o.reach, 0) || 1; img += takes.reduce((a, t) => a + t.o.reach / R * clamp(t.s - num(ev.tone, 0), -1.2, 1.2), 0) * Math.abs(img) * 0.3; }
  img = img > 0 ? img * mul : img * (1 - 0.4 * sk);
  let heat = num(fx.heat, 0); heat = heat > 0 ? heat * (1 - 0.2 * sk) : heat * mul;
  let app = num(fx.appeal, 0); if (app > 0) app *= mul;
  const fz = Array.isArray(fx.fame) ? fx.fame : [0, 0]; let fame = P.fame * num(fz[0], 0) + num(fz[1], 0); if (fame > 0) fame *= mul;
  const d = bump(P, { image: img, heat, appeal: app, fame });
  if (mul > 0) for (const k of Object.keys(ev.persona || {})) if (PERSONAS.includes(k) && ev.persona[k] > 0) P.persona[k] = num(P.persona[k], 0) + ev.persona[k];
  // (each outlet that ran it likes you a little more or less for it; the tabloid follows results)
  for (const t of takes) {
    let m = 0; for (const k of Object.keys(theme)) m += theme[k] * (t.o.likes[k] || 0);
    m = clamp(m * 1.5, -2, 2); if (t.o.fickle && ev.res) m += ev.tone > 0 ? 2 : -1.5;
    rel(P, t.o.id, m);
  }
  for (const id of Object.keys(ev.media || {})) rel(P, id, ev.media[id]);
  if (ev.res) tallyUp(c, P, ev.res);
  const out = [], size = ev.quiet ? 0 : num(ev.size, 1);
  if (size > 0 && (!ev.limit || lim(c, P, ev.limit, ev.limitMax || 2))) {
    const F = ev.force && OUTLET_BY_ID[ev.force], list = takes.map((t) => ({ ...t, w: t.o.reach * (0.6 + Math.random() * 0.8) + (F && t.o === F ? 9 : 0) }));
    if (F && !list.some((t) => t.o === F)) list.push({ o: F, s: takeOf(P, F, ev), w: 9 });
    list.sort((a, b) => b.w - a.w);
    for (const t of list) {
      if (out.length >= size) break;
      const tone = toneOf(t.s), text = headline(ev.lines || kind, ev.sub, t.o, tone, num(ev.tone, 0), X);
      if (text) out.push({ outlet: t.o.id, text, tone });
    }
    // (the most prominent ends up on top of the feed)
    for (let i = out.length - 1; i >= 0; i--) feedPush(c, P, out[i], kind);
    if (ev.news && out[0]) news(c, P, `${OUTLET_BY_ID[out[0].outlet].name}: ${out[0].text}`);
  }
  if (ev.crisis) { try { crisisFrom(c, ev.crisis, { ...x, ...(ev.crisisData || {}) }); } catch (e) { console.warn('PR: crisis failed', e); } }
  return { headlines: out, d };
};
/** a headline with no effect of its own (a deal signed, a crisis answered) -> the headlines */
const story = (c, P, bank, sub, cover, tone, x = {}, anon = false, withNews = false) => apply(c, P, bank, { tone, theme: {}, fx: {}, cover, size: 1, sub, news: withNews }, tokens(c, bank, x, anon), {}).headlines;

// ---- the kinds of story ---------------------------------------------------------------------------------------------
const ACCIDENT = /accident|collision|crash|spun|spin|gravel|barrier|beached|stuck|stopped on track|damage/i;
const WHY = { engine: 'an engine failure', gearbox: 'a gearbox failure', hydraulics: 'a hydraulic failure', brakes: 'a brake failure', 'power unit': 'a power-unit failure', puncture: 'a puncture', mechanical: 'a mechanical problem' };
const whyText = (w) => { const s = String(w || '').trim().toLowerCase(); return WHY[s] || (s ? `${/^[aeiou]/.test(s) ? 'an' : 'a'} ${s} problem` : 'a mechanical problem'); };
const IV = ['humble', 'confident', 'diplomatic', 'cruel', 'funny', 'evasive'];
/** the interviewing outlet when the caller did not say: one for the whole interview */
const ivOutlet = (c, P) => { const k = key(c); if (!P.lim || P.lim.key !== k) P.lim = { key: k }; return P.lim.ivo || (P.lim.ivo = pick(PRESS)); };
// (the grid walk's tones: the group a headline is written for, and the persona each one builds)
const TALK = { kind: 'warm', sorry: 'warm', firm: 'firm', light: 'light', show: 'light', flirt: 'light', cold: 'cold', cruel: 'cruel', gossip: 'gossip' };
const TALK_P = { kind: 'humble', sorry: 'humble', firm: 'confident', light: 'showman', show: 'showman', flirt: 'showman', cruel: 'controversial', gossip: 'controversial' };
const TALK_FX = {
  warm: { tone: 1, theme: { humility: 0.6 }, fx: { image: 1.5, heat: -1 }, cover: ['feed', 'gptv', 'race24'] },
  firm: { tone: 0, theme: { candour: 0.5 }, fx: { image: 0.3 }, cover: ['race24', 'feed'] },
  light: { tone: 1, theme: { candour: 0.6 }, fx: { image: 1, fame: [0.003, 0.005] }, cover: ['race24', 'feed', 'pitlane'] },
  cold: { tone: -1, theme: { drama: 0.4 }, fx: { image: -1, heat: 2 }, cover: ['post', 'feed', 'race24'] },
  cruel: { tone: -1, theme: { drama: 0.8, humility: -0.6 }, fx: { image: -4, heat: 8, fame: [0.005, 0.01] }, cover: ['post', 'race24', 'feed', 'gptv', 'f1news'], size: 2 },
  gossip: { tone: -1, theme: { drama: 0.6 }, fx: { image: -2, heat: 4 }, cover: ['post', 'feed'] },
};
// (the night's stories, by what they do: heat - late +6, stumble +14, scuffle +20, row +8, quote +6, kiss +5, glam +3 -
// and image: a celebration +2, a glamorous night +1, an early night +1)
const PARTY_FX = {
  glam: { tone: 1, theme: { drama: 0.3, romance: 0.2 }, fx: { image: 1, heat: 3, fame: [0.01, 0.01] }, cover: ['post', 'feed'], persona: { showman: 1 } },
  late: { tone: 0, theme: { drama: 0.5 }, fx: { image: -0.5, heat: 6, fame: [0.01, 0.01] }, cover: ['post', 'feed'], persona: { showman: 1 } },
  stumble: { tone: -1, theme: { drama: 0.9 }, fx: { image: -4, heat: 14, appeal: -3, fame: [0.02, 0.02] }, cover: ['post', 'feed', 'race24'], size: 2, persona: { showman: 1 } },
  celebrate: { tone: 1, theme: { results: 0.4, drama: 0.2 }, fx: { image: 2, heat: 1, fame: [0.02, 0.02] }, cover: ['post', 'feed', 'race24'] },
  shoey: { tone: 1, theme: { drama: 0.4, candour: 0.3 }, fx: { image: 0.5, heat: 3, fame: [0.03, 0.03] }, cover: ['feed', 'post'], persona: { showman: 1 } },
  dance: { tone: 0, theme: { drama: 0.2 }, fx: { heat: 2, fame: [0.008, 0.01] }, cover: ['post', 'feed'] },
  jade: { tone: 1, theme: { romance: 0.3 }, fx: { image: 0.5, heat: 2, fame: [0.015, 0.015] }, cover: ['post', 'feed'] },
  sponsor: { tone: 1, theme: {}, fx: { appeal: 2, image: 0.5, fame: [0.01, 0.01] }, cover: ['feed', 'post'] },
  kiss: { tone: 0, theme: { romance: 1 }, fx: { heat: 5, fame: [0.03, 0.03] }, cover: ['post', 'feed', 'race24'], size: 2 },
  together: { tone: 0, theme: { romance: 1 }, fx: { heat: 4, fame: [0.02, 0.02] }, cover: ['post', 'feed'] },
  row: { tone: -1, theme: { drama: 0.8 }, fx: { image: -2, heat: 8 }, cover: ['post', 'feed', 'race24'], persona: { controversial: 1 } },
  scuffle: { tone: -1, theme: { drama: 1, humility: -0.6 }, fx: { image: -5, heat: 20, appeal: -4, fame: [0.03, 0.04] }, cover: ['post', 'race24', 'feed', 'gptv', 'f1news'], size: 2, persona: { controversial: 2 } },
  quiet: { tone: 1, theme: { humility: 0.6 }, fx: { image: 1, heat: -2 }, cover: ['apex', 'feed', 'post'], persona: { humble: 1 } },
  quote: { tone: -1, theme: { candour: 0.6, drama: 0.5 }, fx: { image: -1, heat: 6, fame: [0.01, 0.01] }, cover: ['post', 'feed', 'pitlane'] },
  loose: { tone: -1, theme: { candour: 0.4, drama: 0.4 }, fx: { image: -0.5, heat: 4, fame: [0.005, 0.01] }, cover: ['post', 'feed'] },
  club: { tone: 1, theme: {}, fx: { fame: [0.005, 0.01] }, cover: ['feed'] },
  // affection hook (career/AffectionResult.js): close in public heat +2, her stolen kiss +4, a friend seen home image +1
  cosy: { tone: 0, theme: { romance: 0.6 }, fx: { heat: 2, fame: [0.02, 0.02] }, cover: ['post', 'feed'] },
  stolen: { tone: 0, theme: { romance: 0.6, drama: 0.5 }, fx: { heat: 4, fame: [0.03, 0.03] }, cover: ['post', 'feed', 'race24'], size: 2 },
  carer: { tone: 1, theme: { humility: 0.3 }, fx: { image: 1, heat: 0 }, cover: ['feed', 'post'] },
};
/** win and podium bonuses owed by your deals (paid with the round's money) */
const bonusFor = (P, k) => { for (const D of P.deals) if (D.bonus > 0) P.bonusDue = r2(num(P.bonusDue, 0) + D.bonus * k); };
// Each kind: (c, data, tokens, c.pr) -> ev (see apply) | null for nothing to say.
const EV = {
  win: (c, x, X, P) => { bonusFor(P, 1); return { tone: 1, theme: { results: 1 }, fx: { image: 4, heat: -5, appeal: 5, fame: [0.05, 0.08] }, cover: ALL, size: 3, res: 'won' }; },
  podium: (c, x, X, P) => { bonusFor(P, 0.4); return { tone: 1, theme: { results: 0.7 }, fx: { image: X.p === 2 ? 3 : 2.5, heat: -3, appeal: 3, fame: [0.025, 0.04] }, cover: ['gptv', 'f1news', 'race24', 'weekly', 'apex', 'pitlane', 'gridfm', 'post', 'feed'], size: 2, res: 'podium' }; },
  points: (c, x, X) => ({ tone: X.p && X.p <= 8 ? 1 : 0, theme: { results: 0.35 }, fx: { image: X.p && X.p <= 6 ? 1.2 : 0.6, appeal: 1, fame: [0.006, 0.01] }, cover: ['f1news', 'weekly', 'gptv', 'feed'], size: 1, res: 'points' }),
  dnf: (c, x, X) => {
    const mech = !ACCIDENT.test(String(x.why || '')) && x.crash !== true; X.why = mech ? whyText(x.why) : undefined;
    return { tone: mech ? 0 : -1, theme: { results: -0.5 }, fx: { image: mech ? 0 : -1, appeal: -1, heat: mech ? 0 : 2 }, cover: ['gptv', 'f1news', 'race24', 'weekly', 'post', 'feed'], size: 1, res: mech ? 'dnf' : 'crash' };
  },
  crash: (c, x) => {
    const b = !!x.blame;
    return { tone: b ? -1 : 0, theme: { drama: 0.6, results: -0.4 }, fx: { image: b ? -3 : -0.5, heat: b ? 6 : 1, appeal: b ? -2 : -0.5 }, cover: ['gptv', 'race24', 'f1news', 'weekly', 'pitlane', 'post', 'feed'], size: 2, res: 'crash', sub: b ? 'blame' : 'incident' };
  },
  pole: () => ({ tone: 1, theme: { results: 0.8 }, fx: { image: 2, appeal: 2, fame: [0.02, 0.03] }, cover: ['gptv', 'f1news', 'race24', 'weekly', 'apex', 'post', 'feed'], size: 2, res: 'pole' }),
  fastest: () => ({ tone: 1, theme: { results: 0.3 }, fx: { image: 0.5, fame: [0.005, 0.01] }, cover: ['f1news', 'race24', 'feed'], size: 1 }),
  dotd: () => ({ tone: 1, theme: { results: 0.4, charity: 0.3 }, fx: { image: 3, appeal: 2, fame: [0.03, 0.05] }, cover: ['feed', 'gptv', 'race24', 'gridfm'], size: 2, media: { gridfm: 1 } }),
  overtakes: (c, x, X) => {
    const n = Math.round(clamp(num(x.n, 3), 1, 40)); X.n = n;
    return { tone: 1, theme: { results: 0.5, drama: 0.3 }, fx: { image: Math.min(3, n * 0.4), fame: [0.004 * Math.min(n, 10), 0.01] }, cover: ['race24', 'f1news', 'feed', 'pitlane'], size: n >= 6 ? 2 : 1 };
  },
  penalty: (c, x) => {
    const p = clamp(Math.round(num(x.pts, 0)), 0, 12);
    return { tone: -1, theme: { drama: 0.3, results: -0.3 }, fx: { image: -(0.6 + p * 0.6), heat: 2 + p * 2, appeal: -1 }, cover: p >= 3 ? ['f1news', 'weekly', 'race24', 'gptv', 'post', 'feed'] : ['f1news', 'weekly', 'race24', 'feed'],
      size: p >= 3 ? 2 : 1, persona: p >= 3 ? { controversial: 1 } : null };
  },
  // (a strategy story of your race - race/Calls.js: the pit wall's mistakes cost you little image, it is the team's call)
  strategy: (c, x) => {
    const k = String(x.kind || ''); if (!HL.strategy[k]) return null;
    const good = !!x.good, mine = k === 'undercutFailed' || k === 'gambleFailed';
    return { tone: good ? 1 : -1, theme: { results: good ? 0.3 : -0.2 }, fx: { image: good ? 0.8 : mine ? -0.4 : 0, appeal: good ? 0.5 : 0 }, cover: ['f1news', 'race24', 'gptv', 'apex', 'pitlane', 'post', 'feed'], size: 1, lines: 'strategy', sub: k };
  },
  ban: () => ({ tone: -1, theme: { drama: 0.8, results: -0.4 }, fx: { image: -6, heat: 15, appeal: -6, fame: [0.01, 0.02] }, cover: ['gptv', 'f1news', 'weekly', 'apex', 'pitlane', 'post', 'feed'], size: 3, persona: { controversial: 1 } }),
  banReturn: () => ({ tone: 0, theme: { results: 0.2 }, fx: { image: 1, heat: -5 }, cover: ['f1news', 'weekly', 'gptv', 'feed', 'post'], size: 1 }),
  // (somebody else in your car, for whatever reason: one measured line, nothing about why)
  standin: (c, x, X) => (X.sub ? { tone: 0, theme: {}, fx: {}, cover: ['f1news'], size: 1 } : null),
  moment: () => ({ tone: 1, theme: { results: 0.3, candour: 0.3 }, fx: { image: 1, fame: [0.01, 0.02] }, cover: ['feed', 'race24', 'gptv'], size: 1 }),
  jab: (c, x) => {
    // (the older reaction names: a shove back, or squaring up before it became a scuffle)
    const r0 = x.reaction === 'shove' || x.reaction === 'square' ? 'push' : x.reaction, r = ['laugh', 'glare', 'push'].includes(r0) ? r0 : 'glare', cam = x.onCamera !== false;
    const F = { laugh: { tone: 0, image: 0.5, heat: 0, pe: 'showman' }, glare: { tone: -1, image: -1, heat: 3, pe: 'controversial' }, push: { tone: -1, image: -2, heat: 6, pe: 'controversial' } }[r];
    return { tone: F.tone, theme: { drama: r === 'laugh' ? 0.2 : 0.6, humility: r === 'laugh' ? 0 : -0.3 }, fx: { image: cam ? F.image : F.image * 0.3, heat: cam ? F.heat : 0, fame: r === 'laugh' ? [0, 0] : [0.005, 0.01] },
      cover: ['post', 'feed', 'race24'], size: 1, sub: r, persona: { [F.pe]: 1 }, quiet: !cam };
  },
  brawl: (c, x) => {
    const cam = x.onCamera !== false, esc = !!x.escalated, held = x.started === false && x.result !== 'lost' && !esc, k = cam ? 1 : 0.5;
    return { tone: held ? 0 : -1, theme: { drama: 1, humility: -0.6 }, fx: { image: -(held ? 2 : 5 + (esc ? 3 : 0)) * k, heat: (held ? 8 : 18 + (esc ? 8 : 0)) * k, appeal: -(held ? 1 : 4) * k, fame: [0.03 * k, 0.05 * k] },
      cover: cam ? ['post', 'race24', 'feed', 'gptv', 'f1news', 'weekly', 'pitlane', 'apex'] : ['post', 'feed'], size: cam ? 3 : 1, sub: !cam ? 'heard' : held ? 'defended' : esc ? 'big' : 'scuffle',
      persona: held ? null : { controversial: esc ? 2 : 1 } };
  },
  restraint: (c, x) => (x.onCamera === false ? { tone: 1, theme: {}, fx: { image: 1 }, persona: { humble: 1 }, quiet: true }
    : { tone: 1, theme: { humility: 0.8, drama: 0.2 }, fx: { image: 3, heat: -3, appeal: 1 }, cover: ['gptv', 'apex', 'feed', 'gridfm'], size: 1, persona: { humble: 1 } }),
  talk: (c, x, X) => {
    const g = TALK[x.tone], pk = TALK_P[x.tone], persona = pk ? { [pk]: 1 } : null;
    // (off camera, or a celebrity: it shapes who you are, and makes no story)
    if (!g || !x.onCamera || x.celeb || x.star) return { tone: 0, theme: {}, fx: {}, persona, quiet: true };
    const F = TALK_FX[g], cr = g === 'cruel' && Math.random() < 0.25 ? 'cruel' : null, press = OUTLET_BY_ID[x.outlet] && x.outlet !== 'feed' ? x.outlet : null;
    if (press) return { ...F, cover: g === 'cruel' ? [press, 'post', 'feed'] : [press], force: press, lines: 'talkPress', sub: g, size: g === 'cruel' ? 2 : 1, persona, limit: 'talk', crisis: cr };
    if (!X.who) return { ...F, persona, quiet: true };
    return { ...F, sub: g, size: F.size || 1, persona, limit: 'talk', crisis: cr };
  },
  interview: (c, x, X, P) => {
    const t = IV.includes(x.tone) ? x.tone : 'diplomatic', topic = String(x.topic || '');
    if (GRAVE_TOPICS.has(topic)) return null;
    const o = OUTLET_BY_ID[x.outlet] && x.outlet !== 'feed' && x.outlet !== 'post' ? x.outlet : ivOutlet(c, P);
    const T = recentTally(c, P), good = !!(T && (T.won || T.podium)) || num(P.form, 0) > 0.3, sh = shares(P.persona), m = moodNow(c);
    if (topic === 'brawl' && !X.who) { const d = c.drivers?.[ctxLive(c)?.fought]; if (d && d.id !== c.playerId) { X.who = d.name; X.whoSur = last(d.name); } }
    const lines = topic === 'brawl' ? 'ivBrawl' : topic === 'points' ? 'ivPoints' : 'interview', calm = topic === 'brawl' ? -4 : 0;
    let E;
    if (t === 'humble') E = { tone: 1, theme: { humility: 1 }, fx: { image: 1.5, heat: -2 + calm }, persona: { humble: 1 }, media: { [o]: 2 }, echo: ['apex', 'feed'] };
    else if (t === 'confident') E = { ...(good ? { tone: 1, theme: { results: 0.5 }, fx: { image: 1.5, fame: [0.004, 0.005] } } : { tone: -1, theme: { humility: -0.5 }, fx: { image: -1.2, heat: 2 - calm } }), persona: { confident: 1 }, media: { race24: 1 }, echo: ['race24', 'post', 'feed'] };
    else if (t === 'diplomatic') E = { tone: 0, theme: { humility: 0.3 }, fx: { image: 0.5, heat: -3 + calm }, media: { [o]: 1 }, echo: ['pitlane'] };
    else if (t === 'cruel') E = { tone: -1, theme: { drama: 0.8, humility: -0.6 }, fx: { image: -3, heat: 7 - calm, fame: [0.006, 0.01] }, persona: { controversial: 1 }, media: { apex: -2, gptv: -1, post: 2, [o]: -1 }, echo: ['post', 'feed', 'race24'], size: 2, crisis: Math.random() < 0.25 ? 'cruel' : null };
    else if (t === 'funny') {
      const ok = Math.random() < clamp(0.6 + sh.showman * 0.2 - sh.controversial * 0.2 + num(P.media.pitlane, 0) / 400 + (m.composure - 50) / 300, 0.2, 0.9);
      E = { tone: ok ? 1 : -1, theme: { candour: 0.8 }, fx: ok ? { image: 2, fame: [0.005, 0.01] } : { image: -1 }, persona: { showman: 1 }, media: ok ? { pitlane: 2 } : null, echo: ['pitlane', 'feed', 'post'] };
    } else E = { tone: 0, theme: { candour: -0.8 }, fx: { image: -0.5, heat: P.crisis && !P.crisis.positive ? 3 : 0 }, media: { [o]: -2 }, echo: ['pitlane'] };
    // (the partner question is the couple's business: it shapes who you are, and the papers get nothing)
    return { ...E, cover: [o, ...E.echo], force: o, lines, sub: t, size: E.size || 1, limit: 'iv', limitMax: 2, quiet: topic === 'partner' };
  },
  post: (c, x) => { const D = POSTS[x.key]; return !D || D.quiet ? null : { tone: D.tone, theme: D.theme || {}, fx: D.fx, persona: D.persona, cover: [], size: 0 }; },
  date: (c, x, X) => (X.celeb && x.publicly !== false ? { tone: 0, theme: { romance: 1 }, fx: { image: 1, heat: 4, appeal: 1, fame: [0.04, 0.05] }, cover: ['post', 'feed', 'race24'], size: Math.random() < 0.4 ? 2 : 1 } : null),
  official: (c, x, X) => (X.celeb ? { tone: 1, theme: { romance: 1 }, fx: { image: 3, heat: 3, appeal: 3, fame: [0.08, 0.1] }, cover: ['post', 'feed', 'race24', 'gridfm', 'pitlane'], size: 3, news: true } : null),
  breakup: (c, x, X) => (X.celeb ? { tone: -1, theme: { romance: 1, drama: 0.4 }, fx: { image: x.by === 'her' ? 0 : -1.5, heat: 8, fame: [0.02, 0.03] }, cover: ['post', 'feed', 'race24'], size: 2, sub: x.by === 'her' ? 'her' : 'you' } : null),
  rumour: (c, x, X) => (X.celeb ? { tone: 0, theme: { romance: 1, drama: 0.3 }, fx: { heat: X.other ? 3 : 4, fame: [X.other ? 0.01 : 0.02, 0.02] }, cover: ['post', 'feed'], size: 1, sub: X.other ? 'linked' : 'together' } : null),
  scandal: (c, x, X) => (X.celeb ? { tone: -1, theme: { romance: 1, drama: 1 }, fx: { image: -4, heat: 14, appeal: -3, fame: [0.03, 0.04] }, cover: ['post', 'feed', 'race24'], size: 2, persona: { controversial: 1 },
    sub: !x.source || x.source === 'grid' ? 'grid' : 'secret' } : null),
  nightout: (c, x, X) => {
    // (an evening at a hangout venue with friends is not a late night on the town: a caption, not a story)
    if (WHERE[x.venue]) return EV.hangout(c, { ...x, seen: x.caught ?? x.seen }, X);
    return x.caught ? { tone: -1, theme: { drama: 0.7, romance: 0.3 }, fx: { image: -2, heat: 8, appeal: -2, fame: [0.02, 0.02] }, cover: ['post', 'feed', 'race24'], size: 1, persona: { showman: 1 }, sub: 'late' }
      : { tone: 0, theme: {}, fx: { fame: [0.005, 0.005] }, quiet: true };
  },
  hangout: (c, x, X) => (x.seen === false || !X.where ? { tone: 0, theme: {}, fx: {}, quiet: true }
    : { tone: 0, theme: { drama: 0.1 }, fx: { image: 0.5, heat: 1, fame: [0.006, 0.006] }, cover: ['post', 'feed'], size: 1, lines: 'nightout', sub: 'friends' }),
  // (race night (career/Party.js): x.sub is the story - its weight below; x.track the race just run)
  party: (c, x) => { const F = PARTY_FX[x.sub]; return F ? { ...F, theme: { ...F.theme }, sub: x.sub, size: F.size || 1 } : null; },
  charity: (c, x) => { const don = num(x.donation, 0) > 0; return { tone: 1, theme: { charity: 1, humility: 0.3 }, fx: { image: don ? 2 : 4, heat: -2, appeal: 1 }, cover: ['gridfm', 'feed', 'apex', 'gptv'], size: 1, sub: don ? 'donation' : 'day', persona: { humble: 1 }, media: { gridfm: 2 } }; },
  fans: () => ({ tone: 1, theme: { charity: 0.5, humility: 0.3 }, fx: { image: 3, fame: [0.01, 0.01] }, cover: ['gridfm', 'feed'], size: 1, media: { gridfm: 1 } }),
  sponsorDay: (c, x, X) => ({ tone: 1, theme: {}, fx: { appeal: 3, image: 0.5 }, cover: X.brand ? ['feed'] : [], size: Math.random() < 0.5 ? 1 : 0 }),
  mediaDay: (c, x, X, P) => {
    const o = OUTLET_BY_ID[x.outlet]; if (!o || o.id === 'feed') return null;
    const m = clamp(num(x.mul, 1), 0, 1), v0 = num(P.media[o.id], 0);
    return { tone: 1, theme: { candour: 0.5 }, fx: { image: 2 }, cover: [o.id], force: o.id, size: m ? 1 : 0, media: { [o.id]: 12 * m * (v0 > 60 ? 0.5 : 1) } };
  },
  signing: (c, x, X) => (X.newTeam ? { tone: 1, theme: { results: 0.3 }, fx: { image: 1, appeal: 3, fame: [0.05, 0.05] }, cover: ['f1news', 'gptv', 'weekly', 'race24', 'post', 'feed'], size: 2 } : null),
  trophy: (c, x, X) => (X.trophy ? { tone: 1, theme: { results: 0.4 }, fx: { image: 1, fame: [0.01, 0.01] }, cover: ['f1news', 'feed'], size: 1 } : null),
  season: (c, x, X) => {
    const p = X.p, champ = p === 1, q = hushed(c);
    return { tone: p && p <= 3 ? 1 : 0, theme: { results: p ? (p <= 3 ? 0.8 : p <= 10 ? 0.3 : -0.2) : 0 }, fx: { image: champ ? 6 : p && p <= 3 ? 2 : 0, fame: [champ ? 0.15 : p && p <= 3 ? 0.04 : 0, champ ? 0.3 : 0] },
      cover: q ? ['f1news', 'gptv'] : ['gptv', 'f1news', 'weekly', 'apex', 'post', 'feed'], size: 2, sub: champ ? 'champ' : 'year', news: true };
  },
};
/**
 * A story about you (kind and data: see the spec; drivers as { did, name }, celebrities as { celeb, celebName, job }):
 * its effect on image, following, heat and appeal, the outlets' headlines in c.pr.feed (the top one, now and then, in
 * the paddock news), your persona, each outlet's opinion of you. Anything touching injury, death or the memorial, and in
 * a grave week anything personal, is not a story: nothing happens. -> { headlines: [{ outlet, text, tone }], d }
 */
export function prEvent(c, kind, data = {}) {
  const none = { headlines: [], d: { image: 0, fame: 0, heat: 0, appeal: 0 } };
  if (!c || typeof kind !== 'string' || GRAVE_KINDS.has(kind)) return none;
  const x = data && typeof data === 'object' ? data : {};
  if (graveData(x)) return none;
  const mk = EV[kind]; if (!mk) return none;
  const P = ensure(c); if (!P) return none;
  if (PERSONAL.has(kind) && hushed(c)) return none;
  const X = tokens(c, kind, x), ev = mk(c, x, X, P); if (!ev) return none;
  return apply(c, P, kind, ev, X, x);
}

// ---- crises -----------------------------------------------------------------------------------------------------------
// (the order of severity: a new story more serious than the pending one takes its place; a lesser one folds in)
const SEV = ['nightout', 'slump', 'feud', 'cruel', 'reckless', 'paps', 'clash', 'scandal', 'brawl', 'ban'];
/** each: sev (how hard its answers land), the outlet that runs it, the answers on offer, title / story / text, alt (the same without names) */
const CRISES = {
  ban: { sev: 1.3, outlet: 'f1news', opts: ['apologise', 'explain', 'silence', 'defiant'], title: `A one-race ban`, story: `the ban`,
    text: `You will miss {nextgp} after reaching 12 penalty points. The press wants to know whether anything about your driving will change.`,
    alt: [`A one-race ban`, `the ban`, `Twelve penalty points mean a one-race ban. The press wants to know whether anything about your driving will change.`] },
  brawl: { sev: 1.2, outlet: 'post', opts: ['apologise', 'explain', 'silence', 'defiant', 'joke'], title: `The scuffle with {whoSur}`, story: `the grid scuffle with {whoSur}`,
    text: `Footage of you and {who} pushing and shoving on the grid at {track} is everywhere. The Paddock Post has it on the front page; the serious press wants to know what happened.`,
    alt: [`A scuffle on the grid`, `the grid scuffle`, `Footage of a shoving match on the grid is everywhere. The Paddock Post has it on the front page; the serious press wants to know what happened.`],
    // (a club after the race (career/Party.js): an invented man, never a driver, so nobody is named; the 4th line has no tokens)
    by: { club: [`A scuffle at a club`, `the scuffle at the club`, `Footage of you being separated by security at {place} after the {gp} is all over The Paddock Post. The serious press wants to know what happened.`,
      `Footage of you being separated by security at a club is all over The Paddock Post. The serious press wants to know what happened.`] } },
  // (a photographer (ui/PapsConfront.js papsFallout): an invented man, never named; by how far it went)
  paps: { sev: 1.05, outlet: 'post', opts: ['apologise', 'explain', 'silence', 'defiant', 'joke'], title: `The photographer`, story: `the photographer you pushed`,
    text: `Footage of you pushing a photographer's camera away is all over The Paddock Post. The serious press wants to know what happened.`,
    alt: [`The photographer`, `the photographer you pushed`, `Footage of you pushing a photographer's camera away is all over The Paddock Post. The serious press wants to know what happened.`],
    by: { shove: [`The photographer`, `the photographer you pushed`, `Footage of you pushing a photographer's camera away is all over The Paddock Post. The serious press wants to know what happened.`],
      scuffle: [`A scuffle with a photographer`, `the scuffle with the photographer`, `Footage of you being pulled apart from a photographer is all over The Paddock Post. The serious press wants to know what happened.`],
      viral: [`The clip with the photographer`, `the clip with the photographer`, `A clip of you laying into a photographer has been watched millions of times. The Paddock Post wants a comment.`] } },
  scandal: { sev: 1.1, outlet: 'post', personal: true, opts: ['privacy', 'apologise', 'explain', 'silence', 'joke'], title: `Caught flirting on camera`, story: `the grid-walk flirting`,
    text: `The cameras caught you flirting with {other} on the grid, with {her} looking on. The Paddock Post has the pictures and wants a comment.`,
    alt: [`Caught flirting on camera`, `the grid-walk flirting`, `The cameras caught you flirting on the grid while you are seeing someone. The Paddock Post has the pictures and wants a comment.`],
    // (found out some other way than on the grid: title, story, text by how it came out)
    by: { photo: [`A secret romance in the papers`, `the romance reports`, `The Paddock Post has photographs of you and {other} - and {her} has seen them. The paper wants a comment.`],
      texts: [`A secret romance in the papers`, `the romance reports`, `{her} found the messages, and now The Paddock Post has the story of you and {other}. It wants a comment.`],
      tipoff: [`A secret romance in the papers`, `the romance reports`, `A tip-off has put you, {her} and {other} on the front of The Paddock Post. It wants a comment.`],
      secret: [`A secret romance in the papers`, `the romance reports`, `The Paddock Post says you have been seeing {other} as well as {her}. It wants a comment.`] } },
  clash: { sev: 1, outlet: 'weekly', opts: ['apologise', 'explain', 'silence', 'defiant'], title: `The collision with {whoSur}`, story: `the collision with {whoSur}`,
    text: `A 10-second penalty for the collision with {who} at {track}. Paddock Weekly is asking whether it was a lunge too far.`,
    alt: [`A costly collision`, `the collision`, `A 10-second penalty for a collision. Paddock Weekly is asking whether it was a lunge too far.`] },
  reckless: { sev: 1, outlet: 'apex', opts: ['apologise', 'explain', 'silence', 'defiant'], title: `Questions over your driving`, story: `the penalties`,
    text: `{ptsLine} APEX is asking whether there is a pattern, and the stewards will be watching.`,
    alt: [`Questions over your driving`, `the penalties`, `Penalty after penalty. APEX is asking whether there is a pattern, and the stewards will be watching.`] },
  cruel: { sev: 1, outlet: 'race24', opts: ['apologise', 'explain', 'silence', 'defiant', 'joke'], title: `A remark caught on camera`, story: `the remark about {whoSur}`,
    text: `What you said to {who} was caught on camera, and RACE 24 is replaying it on a loop.`,
    alt: [`A remark caught on camera`, `the remark`, `What you said was caught on camera, and RACE 24 is replaying it on a loop.`] },
  feud: { sev: 0.9, outlet: 'race24', opts: ['apologise', 'explain', 'silence', 'defiant', 'joke'], title: `War of words with {whoSur}`, story: `the war of words with {whoSur}`,
    text: `You and {who} have been trading barbs in public. RACE 24 is running it as a feud, and everyone wants your next line.`,
    alt: [`A war of words`, `the war of words`, `You have been trading barbs with a rival in public. RACE 24 is running it as a feud, and everyone wants your next line.`] },
  slump: { sev: 0.8, outlet: 'weekly', opts: ['explain', 'silence', 'defiant', 'joke', 'apologise'], title: `Questions over your seat`, story: `the slump`,
    text: `Three races below what the car should manage. Paddock Weekly asks whether {team} is losing patience.`,
    alt: [`Questions over your seat`, `the slump`, `Three races below what the car should manage. Paddock Weekly asks whether the team is losing patience.`] },
  nightout: { sev: 0.8, outlet: 'post', personal: true, opts: ['apologise', 'explain', 'silence', 'joke', 'defiant'], title: `Caught on a night out`, story: `the night out`,
    text: `Photographs of a late night out in {city} are in The Paddock Post, days before the {gp}.`,
    alt: [`Caught on a night out`, `the night out`, `Photographs of a late night out are in The Paddock Post, days before a race.`],
    // (after the race (career/Party.js): the morning-after pictures)
    by: { party: [`Caught leaving a club`, `the night out`, `Photographs of you being helped out of a club in {city} in the early hours, after the {gp}, are in The Paddock Post.`,
      `Photographs of you being helped out of a club in the early hours are in The Paddock Post.`] } },
  moment: { sev: 1, outlet: 'feed', positive: true, opts: ['capitalise', 'stayHumble'], title: `Your moment: {momentWhy}`, story: `{momentStory}`,
    text: `{momentText} Chequered is full of your clips and the sponsors are calling. How do you play it?`,
    alt: [`Your moment`, `the weekend`, `Chequered is full of your clips and the sponsors are calling. How do you play it?`] },
};
const OPT = {
  apologise: 'Apologise', explain: 'Explain your side', silence: 'Say nothing', defiant: 'Stand by it', joke: 'Laugh it off', privacy: 'Ask for privacy',
  capitalise: 'Make the most of it', stayHumble: 'Stay humble',
};
/** what an answer is likely to do, for the button's hint */
const optHint = (k, K, P, X) => {
  const o = OUTLET_BY_ID[K.outlet], m = P.manager ? ` ${first(P.manager.name)} will handle the wording.` : '';
  const h = {
    apologise: `Image up, heat down. APEX and GP TV respect it; The Paddock Post finds it dull.`,
    explain: `Your side of it, through ${o.name} (${relLabel(P.media[o.id]).toLowerCase()} towards you): the better they like you, the better it lands. Heat down.`,
    silence: `Let it blow over: a little image lost, and the heat fades slowly.`,
    defiant: `No apology. More followers and more heat, image down - and it steadies you.`,
    joke: `A gamble: charming or tone-deaf. Your persona and PIT LANE decide which.`,
    privacy: `A short statement asking for privacy. The heat drops, and ${X.her || 'she'} will appreciate it.`,
    capitalise: `Interviews, clips, a sponsor shoot: more followers, and sponsor appeal up.`,
    stayHumble: `Credit the team and move on: image up, and APEX approves.`,
  }[k] || '';
  return h + m;
};
/** a crisis is near something grave (a driver in it is hurt, the paddock is mourning): no jokes, no defiance */
const nearGrave = (c, x, X) => !!(x.near || recentLoss(c) || (X.did && hurtD(c, c.drivers?.[X.did])));
const makeCrisis = (c, P, kind, x) => {
  const K = CRISES[kind], X = tokens(c, kind, x, false), n = num(x.n, 0), pts = num(x.points ?? x.total, 0);
  X.ptsLine = n >= 3 ? `${n} penalties in one race.` : pts >= 9 ? `${pts} penalty points on your licence.` : 'Penalty after penalty.';
  const md = x.why === 'dotd' || x.dotd ? 'dotd' : num(x.n, 0) >= 5 ? 'passes' : null;
  X.momentWhy = md === 'dotd' ? 'Driver of the Day' : md ? `${x.n} overtakes` : undefined;
  X.momentStory = md === 'dotd' ? 'Driver of the Day' : md ? `${x.n} overtakes at ${X.track || 'the race'}` : undefined;
  X.momentText = md === 'dotd' ? `The fans voted you Driver of the Day${X.track ? ` at ${X.track}` : ''}.` : md ? `${x.n} overtakes${X.track ? ` at ${X.track}` : ''}.` : undefined;
  const by = K.by && x.source && x.source !== 'grid' ? K.by[x.source] || K.by.secret : null, T = by || [K.title, K.story, K.text];
  // (the version without names: a source's own 4th line, else the scandal's, else the kind's own)
  const near = nearGrave(c, x, X), alt = by ? [by[0], by[1], by[3] || (kind === 'scandal' ? `The Paddock Post says you have been seeing two people at once. It wants a comment.` : K.alt[2])] : K.alt;
  const C = { id: `${kind}-${c.season}-${c.round}-${(Math.random() * 1e6) | 0}`, kind, season: c.season, round: c.round, title: fill(T[0], X) || alt[0], story: fill(T[1], X, false) || alt[1],
    text: fill(T[2], X) || alt[2], outlet: K.outlet, options: [], due: ahead(c, 1), ticks: 0, also: [], positive: !!K.positive, personal: !!K.personal, source: x.source || null,
    celeb: CELEB_IDS.includes(x.celeb) ? x.celeb : null, who: X.did ?? null, near };
  C.options = K.opts.filter((k) => !(near && (k === 'joke' || k === 'defiant'))).map((k) => ({ key: k, label: OPT[k], hint: optHint(k, C, P, X) }));
  return C;
};
// (a voice in the headline bank, as the outlet that speaks with it)
const VOICE_OUT = { serious: 'f1news', tv: 'race24', pod: 'pitlane', radio: 'gridfm', tab: 'post', feed: 'feed' };
/** a crisis that came with no headline of its own gets one (a slump, a pattern of penalties, a feud) */
const announce = (c, P, K, x) => { const H = HL.crisis[K.kind]; if (H) story(c, P, 'crisis', K.kind, Object.keys(H).map((v) => VOICE_OUT[v] || v), K.positive ? 1 : -1, x); };
/**
 * A story that wants an answer (kinds: ban, brawl, scandal, clash, paps, reckless, cruel, feud, slump, nightout, and the
 * positive moment): it waits in c.pr.crisis until answered (resolveCrisis) or until two rounds have passed (then the
 * story runs without you). One at a time: the more severe stays, the lesser folds into it (heat +10). Never for
 * anything touching injury or death, never in a grave week, never while you are out injured. -> the crisis | null
 */
export function crisisFrom(c, kind, data = {}) {
  const K = CRISES[kind]; if (!c || !K) return null;
  const x = data && typeof data === 'object' ? data : {};
  if (graveData(x) || hushed(c) || injured(c)) return null;
  // (an evening with friends at a hangout venue is a caption, never a scandal)
  if (kind === 'nightout' && WHERE[x.venue]) return null;
  const P = ensure(c); if (!P) return null;
  const cur = P.crisis;
  // (the same story twice in one round - the grid walk and the race both seeing it - is one story)
  if (cur && cur.kind === kind && cur.season === c.season && cur.round === c.round) return cur;
  const nw = makeCrisis(c, P, kind, x);
  if (!cur || cur.positive) { P.crisis = nw; announce(c, P, nw, x); return nw; }
  // (nothing to celebrate in the middle of a storm)
  if (K.positive) return cur;
  const up = SEV.indexOf(kind) > SEV.indexOf(cur.kind), hi = up ? nw : cur, lo = up ? cur : nw;
  hi.also = [...(hi.also || []), lo.title, ...(lo.also || [])];
  hi.title = `${hi.title} · ${lo.title}`;
  bump(P, { heat: 10 });
  if (up) { P.crisis = nw; announce(c, P, nw, x); }
  return P.crisis;
}
const RESP = {
  apologise: [`You apologise for {story}, plainly and without excuses.`, `A short statement: you got {story} wrong, and you are sorry.`],
  explain: [`You give {outlet} your account of {story}.`, `You sit down with {outlet} and explain {story} from your side.`],
  silence: [`No statement on {story}. You let it run.`, `You say nothing about {story}.`],
  defiant: [`You stand by every word over {story}.`, `No apology for {story}: you would do it again.`],
  joke: [`You make a joke of {story} in front of the cameras.`],
  privacy: [`You ask, briefly and politely, for privacy.`],
  capitalise: [`You say yes to everything: interviews, clips, a sponsor shoot.`],
  stayHumble: [`You give the credit to the team and keep your head down.`],
};
/**
 * The friends on the grid who back you in public (Social's 'backup' favour): the ids the caller passes in o.backup, or
 * else every driver at 'mate' level or above in c.social; alive and well, never the driver in the story, two at most -
 * and never for a personal story or anything near something grave -> [{ did, name }]
 */
const backersOf = (c, K, o = {}) => {
  if (K.personal || K.positive || K.near || o.backup === false) return [];
  const D = c?.drivers || {}, F = c?.social?.friends || {};
  const ids = Array.isArray(o.backup) ? o.backup.map((v) => (v && typeof v === 'object' ? v.did ?? v.id : v)) : Object.keys(F).filter((id) => num(F[id]?.level, 0) >= 60).sort((a, b) => num(F[b].level, 0) - num(F[a].level, 0));
  return ids.map((id) => D[id]).filter((d) => d && d.id !== c.playerId && d.alive !== false && !hurtD(c, d) && d.id !== K.who).slice(0, 2).map((d) => ({ did: d.id, name: d.name }));
};
/** what the effects come to, in a few words: 'image +7, heat -15, followers +0.4M' */
const fxText = (d) => [d.image ? `image ${sgn(d.image)}` : '', d.heat ? `heat ${sgn(d.heat)}` : '', d.fame ? `followers ${d.fame > 0 ? '+' : '-'}${fameText(Math.abs(d.fame))}` : '', d.appeal ? `sponsor appeal ${sgn(d.appeal)}` : ''].filter(Boolean).join(', ');
/**
 * Answer the pending crisis (key: one of its options). Base effects: apologise image +6, heat -15 (APEX and GP TV warm
 * to it, the Post finds it dull); explain image +2..+8 by how the story's outlet feels about you, heat -10; silence image
 * -2, heat -5; privacy image +2, heat -10 and her trust +5 (d.trust / d.celeb for the caller); defiant image -6, followers
 * up, heat +10, composure +3; joke image +5 or -8 (your persona and PIT LANE shift the odds). The persona and the story's
 * weight shade them; a manager adds skill (positives x(1 + 0.5 skill), negatives x(1 - 0.4 skill)); friends who back you
 * in public add image +1.5 each (opts.backup: their driver ids, false for none; left out, your mates in c.social).
 * -> { ok, text, d, backers }
 */
export function resolveCrisis(c, key, opts = {}) {
  const zero = { image: 0, fame: 0, heat: 0, appeal: 0 };
  const P = ensure(c), K = P?.crisis; if (!K) return { ok: false, text: 'There is nothing to answer.', d: zero };
  if (!K.options.some((o) => o.key === key)) return { ok: false, text: 'That is not an answer to this story.', d: zero };
  const o = OUTLET_BY_ID[K.outlet] || OUTLET_BY_ID.f1news, rv = num(P.media[o.id], 0), sh = shares(P.persona), sk = skillOf(P), sev = CRISES[K.kind]?.sev || 1, m = moodNow(c);
  let image = 0, heat = 0, fame = 0, appeal = 0, persona = null, media = {}, mo = null, extra = {}, sub = key, cover = [], tone = 0, react = '';
  if (key === 'apologise') {
    image = 6 + sh.humble * 2 - sh.controversial * 3 + (num(P.media.apex, 0) + num(P.media.gptv, 0)) / 100; heat = -15; persona = { humble: 1 }; media = { apex: 3, gptv: 3, post: -2 };
    cover = ['gptv', 'apex', 'feed', 'post']; tone = 1;
    react = sh.controversial > 0.4 ? 'Not everyone believes it: The Paddock Post calls it "a PR job".' : sh.humble > 0.4 ? 'It sounds like you, and almost everyone accepts it.' : 'APEX and GP TV call it the right call; The Paddock Post calls it dull.';
  } else if (key === 'explain') {
    image = 2 + (rv + 100) / 200 * 6 + (P.manager?.style === 'press' ? 2 : 0); heat = -10; media = { [o.id]: 2 }; cover = [o.id, 'feed']; tone = rv >= 0 ? 1 : 0;
    react = rv >= 20 ? `${o.name} runs it in full, and it lands.` : rv <= -20 ? `${o.name} prints it - with a raised eyebrow.` : `${o.name} prints it straight.`;
  } else if (key === 'silence') {
    image = -2; heat = -5; cover = ['post', o.id]; tone = 0; react = 'The story runs a little longer, then runs out of road.';
  } else if (key === 'privacy') {
    image = 2; heat = -10; media = { post: -1 }; extra = { trust: 5, celeb: K.celeb }; cover = ['f1news', 'post', 'feed']; tone = 1; react = 'Most outlets respect it; The Paddock Post grumbles.';
  } else if (key === 'defiant') {
    image = -6 + sh.controversial * 2; fame = o.reach * 0.3 * (1 + sh.controversial); heat = 10; persona = { controversial: 1 }; media = { post: 2, apex: -2 }; mo = [3, 'Stood your ground', 'composure'];
    cover = ['post', 'feed', 'f1news']; tone = -1; react = 'Your followers love it; the sponsors go quiet.';
  } else if (key === 'joke') {
    const p = clamp(0.5 + (sh.showman + sh.confident * 0.5 - sh.controversial) * 0.3 + num(P.media.pitlane, 0) / 400 + (m.composure - 50) / 400 - (K.kind === 'ban' ? 0.1 : 0), 0.15, 0.85), ok = Math.random() < p;
    image = ok ? 5 : -8; heat = ok ? -8 : 6; persona = { showman: 1 }; media = { pitlane: ok ? 3 : -1 }; extra = { landed: ok }; mo = ok ? [1, 'The joke landed'] : [-2, 'A joke that fell flat', 'composure'];
    sub = ok ? 'joke' : 'jokeBad'; cover = ok ? ['pitlane', 'feed'] : ['post', 'feed']; tone = ok ? 1 : -1;
    react = ok ? 'It lands: PIT LANE plays it twice and Chequered loves it.' : 'It does not land. Even PIT LANE winces.';
  } else if (key === 'capitalise') {
    fame = Math.max(0.05, P.fame * 0.04) + o.reach * 0.1; appeal = 4; persona = { showman: 1 }; cover = ['feed', 'race24']; tone = 1; react = 'Your following jumps, and the sponsors take note.';
  } else if (key === 'stayHumble') {
    image = 5; persona = { humble: 1 }; media = { apex: 3 }; cover = ['apex', 'gptv']; tone = 1; react = 'APEX runs it as a column.';
  }
  // (the story's weight, then the manager: the good parts land better, the bad parts hurt less)
  const up = (v) => (v > 0 ? v * (1 + 0.5 * sk) : v * (1 - 0.4 * sk));
  image = up(image * sev); heat = heat < 0 ? heat * (1 + 0.5 * sk) : heat * (1 - 0.4 * sk); fame = up(fame); appeal = up(appeal);
  const backers = backersOf(c, K, opts && typeof opts === 'object' ? opts : {}); image += 1.5 * backers.length;
  const d = bump(P, { image, heat, fame, appeal });
  if (persona) for (const k of Object.keys(persona)) P.persona[k] = num(P.persona[k], 0) + persona[k];
  for (const id of Object.keys(media)) rel(P, id, media[id]);
  if (mo) mood(c, mo[0], mo[1], mo[2] || null);
  const X = { story: K.story, outlet: o.name };
  // (in a grave week the papers have other things to write about: the answer lands, quietly)
  if (!hushed(c)) story(c, P, 'resolve', sub, cover, tone, { story: K.story }, K.personal, true);
  P.past.unshift({ kind: K.kind, title: K.title, key, season: c.season, round: c.round, d });
  if (P.past.length > PAST_CAP) P.past.length = PAST_CAP;
  P.crisis = null;
  const bk = backers.length ? ` ${backers.map((b) => last(b.name)).join(' and ')} back${backers.length === 1 ? 's' : ''} you in public.` : '';
  const fxs = fxText(d), mg = P.manager ? ` ${P.manager.name} handled the wording.` : '';
  return { ok: true, text: `${pickFill(RESP[key], X) || ''} ${react}${bk}${mg}${fxs ? ` (${fxs})` : ''}`.trim(), d: { ...d, ...extra }, backers };
}
/**
 * What your PR manager (or, without one, plain common sense) would answer to the pending story, from its kind, the
 * outlet that runs it, your persona and your mood - for the hub's crisis card and the manager's text on your phone ->
 * { key, label, text, from (the manager's name | null) } | null
 */
export function crisisAdvice(c) {
  const P = c?.pr, K = P?.crisis; if (!K || !Array.isArray(K.options) || !K.options.length) return null;
  const has = (k) => K.options.some((o) => o.key === k), sh = shares(P.persona), rv = num(P.media?.[K.outlet], 0), m = moodNow(c), O = OUTLET_BY_ID[K.outlet];
  let k;
  if (K.positive) k = num(P.image, 0) < 25 || sh.humble > 0.4 ? 'stayHumble' : 'capitalise';
  else if (has('privacy')) k = 'privacy';
  else if (['ban', 'brawl', 'clash', 'reckless', 'paps'].includes(K.kind)) k = rv >= 25 && has('explain') ? 'explain' : 'apologise';
  else if (has('joke') && sh.showman > 0.4 && num(P.media?.pitlane, 0) >= 20 && m.composure >= 55 && !K.near) k = 'joke';
  else if (K.kind === 'slump') k = rv >= 0 ? 'explain' : 'silence';
  else k = rv >= 25 && has('explain') ? 'explain' : 'apologise';
  if (!has(k)) k = K.options[0].key;
  const WHY = {
    apologise: `Apologise: short, plain, no excuses. It takes the heat out fastest, and the serious press will respect it.`,
    explain: `Explain your side to ${O?.name || 'the outlet running it'} - they ${rv >= 25 ? 'like you, and it will land' : 'will print it straight'}.`,
    silence: `Say nothing. It will run a little longer, then run out of road.`,
    privacy: `Ask for privacy: one short statement. The heat drops, and she will appreciate it.`,
    joke: `Laugh it off - your audience will take it from you, and PIT LANE is on side.`,
    defiant: `Stand by it, if you must. More followers, more heat, and the sponsors go quiet.`,
    capitalise: `Make the most of it: say yes to the interviews and the sponsor shoot while everyone wants you.`,
    stayHumble: `Stay humble: credit the team and move on. It does more for your image than any clip.`,
  };
  const from = P.manager?.name || null;
  return { key: k, label: OPT[k] || k, text: WHY[k] || '', from };
}

// ---- social -----------------------------------------------------------------------------------------------------------
const CAUSES = [`a karting programme for kids who could never afford it`, `a local food bank`, `a science scholarship for girls`, `a children's reading charity`, `a mental-health helpline for young people`];
const WIN_POSTS = [`Winner at {lt}. Still sinking in. Thank you, {team} - every single one of you.`, `P1 at {lt}! The car was on rails. This one is for the factory.`, `Top step. Still can't quite believe it. Thank you, {team}.`];
const POD_POSTS = [`{lp} at {lt}. Good points, better team. On to the next one.`, `On the podium at {lt}. The team earned this one.`, `Podium. Not the top step - yet. Proud of this team.`];
const THANKS_POSTS = [`Huge effort from everyone at {team} this weekend: the factory, the garage, the people nobody films. Thank you.`, `To the mechanics who worked through the night: I see you. Thank you, {team}.`,
  `Whatever the result, this team never stops. Proud to drive for {team}.`];
const DIG_POSTS = [`Some of us brake before the corner. Just saying.`, `Hard but fair is a choice. Shame not everyone makes it.`, `Mirrors are standard equipment, I'm told.`, `Respect on track is earned. Some people are still saving up.`];
const PARTNER_POSTS = [`Best pit crew I know. (With {her}.)`, `Weekend sorted. {her} beat me at cards again.`, `My favourite person in the paddock. Sorry, {team}.`];
const CHARITY_POSTS = [`Proud to support {cause}. If you can, have a look at what they do.`, `Spent time with {cause} this week. The best part of the job. Link in my profile.`];
const BEHIND_POSTS = [`Simulator, gym, debrief, repeat. The part of the job nobody films.`, `Six in the morning and the factory is already busy. That's why we're quick.`, `Seat fitting, again. Three millimetres make all the difference.`];
const FAN_POSTS = [`To everyone in the grandstands and everyone up at silly o'clock to watch: you are the reason. Thank you.`, `Every flag, every banner, every message. I read more of them than you think. Thank you.`];
const THROWBACK_POSTS = [`Eight years old, a kart two sizes too big and a helmet that was even bigger. Throwback.`, `First trophy. Plastic, slightly bent, still my favourite.`, `Found this in a box at my parents' house. The overalls were my cousin's.`];
const CRYPTIC_POSTS = [`Some things are better left unsaid.`, `Interesting week.`, `Patience.`, `Noted.`, `Watch this space.`];
// (the morning after the race's party: the photo from last night)
const PARTY_POSTS = [`What a night in {lt}. Thank you to everyone who made it.`, `Celebrated properly. Back to work tomorrow.`, `{team}, you know how to throw a party.`, `Some nights you just have to enjoy it.`, `Last night. No further questions.`];
const APOLOGY_POSTS = [`I got some things wrong this week. I know it, and I'll be better. Sorry.`, `Not my finest moment. I've apologised to the people I needed to, and I'm sorry to all of you too.`];
const TRIBUTE_POSTS = [`Thinking of everyone affected this weekend.`, `Some weekends are bigger than racing. Thinking of the people who matter.`];
/** the driver you fought this weekend, if he can be posted about (alive, not hurt) -> driver | null */
const rivalOf = (c, x) => { const d = x.fought ? c?.drivers?.[x.fought] : null; return d && d.id !== c.playerId && !hurtD(c, d) ? d : null; };
/**
 * the partner you could post a photo with: your public partner, or the one at the race (context) when the two of you
 * are public - never a secret relationship, never someone in mourning -> celeb id | null
 */
const partnerOf = (c, x) => {
  const B = c?.celebs?.bonds || {}, main = c?.celebs?.partner;
  const ok = (id) => CELEB_IDS.includes(id) && !B[id]?.grieving && !B[id]?.secret && (id === main || (!!B[id]?.public && ['dating', 'partner'].includes(B[id]?.stage)));
  return [x.partner, main].find(ok) || null;
};
/**
 * What you can post: { tone, risk (a backlash chance), eng (likes per follower), fx, persona, cover (who notices), when,
 * label, desc, text (the pool) }. Notable posts make a headline; the rest are for the fans.
 */
const POSTS = {
  celebrate: { tone: 1, risk: 0.04, eng: 0.05, fx: { image: 1.5, appeal: 1, fame: [0.03, 0.03] }, persona: { confident: 1 }, cover: ['feed'], when: (c, x) => !!(x.won || x.podium),
    label: (c, x) => (x.won ? 'Celebrate the win' : 'Celebrate the podium'), desc: `A photo from the podium and a thank-you: followers up, a little image.`, text: (x) => (x.won ? WIN_POSTS : POD_POSTS) },
  thanks: { tone: 1, risk: 0, eng: 0.025, fx: { image: 2 }, persona: { humble: 1 }, cover: ['feed'], when: () => true,
    label: () => 'Thank the team', desc: `The factory, the garage, the people nobody films: image up, and your team-mate notices.`, text: () => THANKS_POSTS },
  dig: { tone: -1, risk: 0.5, eng: 0.06, fx: { image: -2, heat: 10, fame: [0.04, 0.03] }, persona: { controversial: 1 }, cover: ['feed', 'post'], when: (c, x) => !!rivalOf(c, x),
    label: (c, x) => `A dig at ${last(rivalOf(c, x)?.name)}`, desc: `A pointed post about the driver you fought: followers and heat up, image down, his rapport too. Risky.`, text: () => DIG_POSTS },
  partner: { tone: 1, risk: 0.1, eng: 0.08, fx: { image: 1, heat: 3, appeal: 1, fame: [0.05, 0.05] }, persona: { showman: 1 }, theme: { romance: 1 }, cover: ['feed', 'post'], when: (c, x) => !!partnerOf(c, x),
    label: (c, x) => `A photo with ${first(celebName(partnerOf(c, x)))}`, desc: `The two of you, off duty: lots of likes, a little heat - and the tabloids will notice.`, text: () => PARTNER_POSTS },
  charity: { tone: 1, risk: 0.05, eng: 0.03, fx: { image: 3 }, persona: { humble: 1 }, theme: { charity: 1 }, cover: ['feed', 'gridfm'], when: () => true, riskFn: (c, x) => (x.charityDone ? 0.05 : 0.4),
    label: () => 'A charity shout-out', desc: (c, x) => (x.charityDone ? `Your charity work this week, shared: image up.` : `With no charity work this week, the fans may ask what you actually did.`), text: () => CHARITY_POSTS },
  behind: { tone: 1, risk: 0.03, eng: 0.035, fx: { image: 1, fame: [0.02, 0.02] }, cover: ['feed'], when: () => true,
    label: () => 'Behind the scenes', desc: `The gym, the simulator, the factory: a few more followers.`, text: () => BEHIND_POSTS },
  fans: { tone: 1, risk: 0.02, eng: 0.035, fx: { image: 2, fame: [0.015, 0.015] }, cover: ['feed', 'gridfm'], when: () => true,
    label: () => 'Thank the fans', desc: `A thank-you to everyone who watches: image up, a few more followers.`, text: () => FAN_POSTS },
  throwback: { tone: 1, risk: 0.02, eng: 0.03, fx: { image: 1, fame: [0.01, 0.01] }, cover: ['feed'], when: () => true,
    label: () => 'A karting throwback', desc: `A photo from your karting days: harmless, warm, a few likes.`, text: () => THROWBACK_POSTS },
  cryptic: { tone: 0, risk: 0.35, eng: 0.045, fx: { image: -1, heat: 8, fame: [0.03, 0.03] }, persona: { showman: 1 }, cover: ['feed', 'post'], when: () => true,
    label: () => 'A cryptic post', desc: `Two words and no context: followers and heat up, and everyone guessing.`, text: () => CRYPTIC_POSTS },
  apology: { tone: 1, risk: 0.1, eng: 0.03, fx: { image: 2, heat: -8 }, persona: { humble: 1 }, cover: ['feed', 'gptv'], when: (c, x, P) => !!(P.crisis && !P.crisis.positive) || P.heat >= 25,
    label: () => 'An apology', desc: `Sorry, in your own words: heat down, image up - and a story waiting for an answer loses some of its sting.`, text: () => APOLOGY_POSTS },
  tribute: { tone: 0, quiet: true, risk: 0, eng: 0, fx: {}, cover: [], when: (c) => hushed(c),
    label: () => 'A quiet tribute', desc: `A few words for the people who matter this week. No likes counted, no story.`, text: () => TRIBUTE_POSTS },
  // (the race's party, while its week is live: ctx.party is set by career/Party.js; the post carries last night's photo)
  party: { tone: 1, risk: 0.12, eng: 0.05, fx: { image: 1, fame: [0.02, 0.02] }, persona: { showman: 1 }, cover: ['feed'], when: (c, x) => !!x.party,
    label: () => 'A photo from last night', desc: `The night in one picture: followers up - and The Paddock Post will look closely.`, text: () => PARTY_POSTS },
};
// (posts that make a story of their own)
const NOTABLE = new Set(['dig', 'cryptic', 'partner', 'apology']);
const postTokens = (c, x) => {
  const tid = x.track && TRACK[x.track] ? x.track : trackIdOf(c, -1), lg = Array.isArray(c.log) ? c.log[c.log.length - 1] : null, p = num(x.pos, null) ?? num(lg?.you, null), pid = partnerOf(c, x);
  return { lt: TRACK[tid] || undefined, lp: p ? `P${p}` : undefined, team: meOf(c)?.team || c.myTeam || 'the team', her: pid ? first(celebName(pid)) : undefined, cause: pick(CAUSES) };
};
/**
 * The round's context for social posts (and the PR desk's sense of a grave week), set by the career in applyRace
 * BEFORE that race's own PR events (it replaces last week's, so a grave week never hushes the next race's stories):
 * { won, podium, pos, track, fought (the driver you clashed with), partner (celeb id), charityDone, grave }. It stays
 * live for the race just run and the week after it (Agenda marks charityDone in it). -> c.pr.ctx
 */
export function postContext(c, ctx = {}) {
  const P = ensure(c); if (!P) return null;
  const x = ctx && typeof ctx === 'object' ? ctx : {};
  P.ctx = { won: !!x.won, podium: !!x.podium, pos: num(x.pos, null), track: x.track || null, fought: x.fought || null, partner: x.partner || null, charityDone: !!x.charityDone, grave: !!x.grave, season: c.season, round: c.round };
  return P.ctx;
}
/**
 * What you can post now (two a round): context posts only after what they are about (a win or a podium, a driver you
 * fought, your partner), plus the everyday ones. A grave week: only thanks to the team and a quiet tribute, with no
 * effect and no likes. -> [{ key, label, desc, risk, ok, why, quiet, recent (times in the last three rounds) }]
 */
export function socialPosts(c) {
  const P = ensure(c); if (!P) return [];
  const x = ctxLive(c) || {}, grave = hushed(c), used = P.lim && P.lim.key === key(c) ? num(P.lim.posts, 0) : 0, left = Math.max(0, POSTS_A_ROUND - used);
  const keys = grave ? ['thanks', 'tribute'] : ['celebrate', 'party', 'thanks', 'dig', 'partner', 'charity', 'behind', 'fans', 'throwback', 'cryptic', 'apology'];
  const out = [];
  for (const k of keys) {
    const D = POSTS[k]; if (!D.when(c, x, P)) continue;
    const recent = P.posts.filter((p) => p.key === k && !p.quiet && ago(c, p) >= 0 && ago(c, p) < 3).length;
    out.push({ key: k, label: D.label(c, x), desc: typeof D.desc === 'function' ? D.desc(c, x) : D.desc, risk: grave ? 0 : D.riskFn ? D.riskFn(c, x) : D.risk, ok: left > 0, why: left > 0 ? null : 'Two posts a round is plenty', quiet: grave || !!D.quiet, recent });
  }
  return out;
}
const likesFor = (P, eng, k) => Math.max(10, Math.round(P.fame * 1e6 * eng * k * (0.75 + Math.random() * 0.5) * (1 + clamp(P.image, -100, 100) / 250)));
/**
 * Post (key from socialPosts): the post's text, likes and comments (from your following, your image, the kind of post),
 * its effect - the same post again within three rounds is worth half, a third time the fans call it PR (image -2); image
 * from posts is capped at +3 a round; a risky post may backfire. -> { ok, text (the post), likes, comments, d, backlash,
 * quiet, headline, msg (a line for the hub) }
 */
export function postSocial(c, key) {
  const zero = { image: 0, fame: 0, heat: 0, appeal: 0 }, fail = (text) => ({ ok: false, text, likes: 0, comments: 0, d: zero, msg: text });
  const P = ensure(c); if (!P) return fail('No career to post from.');
  const S = socialPosts(c).find((s) => s.key === key); if (!S) return fail('That is not something to post this week.');
  if (!S.ok) return fail(`${S.why}.`);
  const D = POSTS[key], x = ctxLive(c) || {}, quiet = S.quiet, stamp = { season: c.season, round: c.round };
  const text = pickFill(D.text(x), postTokens(c, x)) || pick(D.text(x)).replace(/\{\w+\}/g, '').trim();
  lim(c, P, 'posts', POSTS_A_ROUND);
  const keep = (e) => { P.posts.unshift(e); if (P.posts.length > POSTS_CAP) P.posts.length = POSTS_CAP; };
  if (quiet) { keep({ ...stamp, key, text, likes: 0, comments: 0, tone: 0, quiet: true }); return { ok: true, text, likes: 0, comments: 0, d: zero, quiet: true, msg: `Posted: "${text}"` }; }
  const again = S.recent >= 2, mul = S.recent === 1 ? 0.5 : 1, back = again || Math.random() < S.risk;
  const rv = key === 'dig' ? rivalOf(c, x) : null, pid = key === 'partner' ? partnerOf(c, x) : null;
  const X = tokens(c, 'post', { did: rv?.id, celeb: pid || undefined }, key === 'partner');
  let fx, room = 0;
  if (back) fx = { image: again ? -2 : -3, heat: again ? 2 : 6, fame: [0.005, 0] };
  else {
    const f = D.fx || {}, fz = Array.isArray(f.fame) ? f.fame : [0, 0];
    fx = { image: num(f.image, 0) > 0 ? f.image * mul : num(f.image, 0), heat: num(f.heat, 0) < 0 ? f.heat * mul : num(f.heat, 0), appeal: num(f.appeal, 0) * mul, fame: [fz[0] * mul, fz[1] * mul] };
    // (image from posts: three a round at most, however warmly the outlets take them)
    room = Math.max(0, POST_IMAGE_CAP - num(P.lim?.postImg, 0)); if (fx.image > 0) fx.image = Math.min(fx.image, room);
  }
  const ev = { tone: back ? -1 : D.tone, theme: back ? { candour: -0.5 } : D.theme || {}, fx, persona: back ? null : D.persona, cover: back ? ['feed', 'post'] : D.cover, sub: again ? 'again' : back ? 'backlash' : key,
    size: back || NOTABLE.has(key) ? 1 : Math.random() < 0.35 ? 1 : 0, force: again ? 'feed' : null };
  const r = apply(c, P, 'post', ev, X, {});
  if (!back && r.d.image > 0) {
    if (r.d.image > room) { P.image = r1(P.image - (r.d.image - room)); r.d.image = r1(room); }
    P.lim.postImg = r1(num(P.lim.postImg, 0) + r.d.image);
  }
  if (!back && key === 'dig' && rv) relate(c, rv.id, -6, null);
  if (!back && key === 'thanks') { let m = null; try { m = c.teammate?.(); } catch (e) { m = null; } if (m) relate(c, m.id, 2, null); }
  if (!back && key === 'apology' && P.crisis && !P.crisis.positive) P.crisis.softened = true;
  const k = (back ? 0.6 : 1) * (mul < 1 ? 0.6 : 1) * (P.manager?.style === 'social' ? 1.25 : 1), likes = likesFor(P, D.eng, k);
  const comments = Math.round(likes * (back ? 0.12 + Math.random() * 0.06 : 0.02 + Math.random() * 0.025));
  // (a party post shows last night's photo: c.party.last.photo, while the morning-after still has it - flagged, never copied into the save twice)
  keep({ ...stamp, key, text, likes, comments, tone: back ? -1 : D.tone, ...(key === 'party' && c.party?.last?.photo ? { photo: 'party' } : {}) });
  const n = (v) => (v >= 1e6 ? `${r1(v / 1e6)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : String(v));
  const msg = `Posted: "${text}" - ${n(likes)} likes, ${n(comments)} comments.${again ? ' Fans call it PR: the same post three times in a few rounds.' : back ? ' It did not go down well.' : ''}`;
  return { ok: true, text, likes, comments, d: r.d, backlash: back, quiet: false, headline: r.headlines[0] || null, msg };
}

// ---- endorsements and the manager ------------------------------------------------------------------------------------
/** what a brand will pay you a round: its base, your fame, your appeal, your agent, whether you fit its posters */
const valueOf = (c, P, b) => {
  const fit = b.likes === 'romance' ? !!c?.celebs?.partner : b.likes && b.likes === personaOf(c).key;
  return r2(b.base * (0.75 + fameIndex(P.fame) / 100 * 0.5) * (0.9 + clamp(num(P.appeal, 50), 0, 100) / 100 * 0.2) * (1 + 0.1 * skillOf(P)) * (fit ? 1.1 : 1));
};
/** an offer from a brand: { id, bid, brand, kind, value, rounds, until, minImage, heatMax, bonus, text, clauses, expires } */
const makeOffer = (c, P, b, mul = 1) => {
  const len = 4 + ((Math.random() * 5) | 0), value = r2(valueOf(c, P, b) * mul), bonus = b.bonus ? r2(b.base * 0.6) : 0;
  const clauses = [`Image clause: the deal ends if your public image falls below ${b.minImage}.`];
  if (b.heatMax < 100) clauses.push(`Morality clause: controversy above ${b.heatMax} for a round brings a warning; a second time, the deal ends.`);
  if (bonus) clauses.push(`Bonuses: ${usd(bonus)} for a win, ${usd(bonus * 0.4)} for a podium.`);
  clauses.push(`Exclusive: no other ${b.kind} deal while it runs.`, `Appearances: as your headline partner, the contractual sponsor day is theirs (+$0.1M).`);
  return { id: `${b.id}-${c.season}-${c.round}-${(Math.random() * 1e4) | 0}`, bid: b.id, brand: b.brand, kind: b.kind, value, rounds: len, until: ahead(c, len), since: null,
    minImage: b.minImage, heatMax: b.heatMax, bonus, text: b.pitch, clauses, expires: ahead(c, 1), strikes: 0, paid: 0 };
};
const snubbed = (c, P, id) => !!P.snub[id] && cmp(nowS(c), P.snub[id]) < 0;
/**
 * A brand you met in person puts an offer on the table (career/Party.js: its rep at a party; why: 'met at the party'):
 * the usual terms a little warmer, open for two rounds. Not when the table is full (three offers), your diary is
 * (four deals), you already have its kind (exclusivity), it is offering already, it snubbed you, or your image is below
 * its clause. -> the offer | null
 */
export function offerFrom(c, brandId, why = '') {
  const P = ensure(c), b = BRAND_BY_ID[brandId]; if (!P || !b) return null;
  if (P.offers.length >= MAX_OFFERS || P.deals.length >= MAX_DEALS) return null;
  if (P.deals.some((d) => d.bid === b.id || d.kind === b.kind) || P.offers.some((o) => o.bid === b.id) || snubbed(c, P, b.id) || P.image < b.minImage) return null;
  const O = makeOffer(c, P, b, 1.05); O.expires = ahead(c, 2);
  if (why) { O.why = String(why); O.text = `${b.pitch} (${O.why[0].toUpperCase()}${O.why.slice(1)}.)`; }
  P.offers.push(O);
  return O;
}
/**
 * Sign an offer (from c.pr.offers): four personal deals at most, one per kind (exclusivity), and only while your image
 * meets the clause. Paid after every race until it runs out: 70% to your own account, 30% to the team. -> { ok, text }
 */
export function acceptDeal(c, id) {
  const P = ensure(c); if (!P) return { ok: false, text: 'No career.' };
  const O = P.offers.find((o) => o.id === id); if (!O) return { ok: false, text: 'That offer is no longer on the table.' };
  if (O.expires && cmp(nowS(c), O.expires) > 0) { P.offers = P.offers.filter((o) => o !== O); return { ok: false, text: `${O.brand}'s offer has lapsed.` }; }
  if (P.deals.length >= MAX_DEALS) return { ok: false, text: 'Your diary is full: four personal deals is as many as your agent can fit round the racing.' };
  const same = P.deals.find((d) => d.kind === O.kind); if (same) return { ok: false, text: `Your deal with ${same.brand} is exclusive: no other ${O.kind} deal while it runs.` };
  if (P.image < O.minImage) return { ok: false, text: `${O.brand} has gone cold: your image is below their clause (${O.minImage}).` };
  P.offers = P.offers.filter((o) => o !== O);
  const D = { ...O, since: nowS(c), until: ahead(c, Math.max(1, num(O.rounds, 4)) - 1) }; delete D.expires;
  P.deals.push(D); bump(P, { appeal: 2 });
  story(c, P, 'deal', 'sign', ['f1news', 'feed', 'post'], 1, { brand: D.brand }, false, true);
  return { ok: true, text: `Signed with ${D.brand} (${D.kind}): ${usd(D.value)} a round for ${D.rounds} rounds${D.bonus ? `, ${usd(D.bonus)} for a win` : ''}. Paid after every race - 70% to your own account, 30% to the team.` };
}
/** turn an offer down (the brand will not ask again for three rounds) -> { ok, text } */
export function declineDeal(c, id) {
  const P = ensure(c); if (!P) return { ok: false, text: 'No career.' };
  const O = P.offers.find((o) => o.id === id); if (!O) return { ok: false, text: 'That offer is no longer on the table.' };
  P.offers = P.offers.filter((o) => o !== O); P.snub[O.bid] = ahead(c, 3);
  return { ok: true, text: `You turn ${O.brand} down. They say the door stays open - just not for a while.` };
}
/** hire MANAGERS[i] (the first round's fee up front from your own account; replaces anyone you had) -> { ok, text } */
export function hireManager(c, i) {
  const P = ensure(c), M = MANAGERS[Number(i)]; if (!P || !M) return { ok: false, text: 'No such manager.' };
  if (P.manager?.name === M.name) return { ok: false, text: `${M.name} already works for you.` };
  const cash = num(c.wallet, 0); if (cash < M.fee) return { ok: false, text: `Not enough in your own account: ${M.name} wants ${usd(M.fee)} a round, the first up front.` };
  const was = P.manager?.name; c.wallet = r2(cash - M.fee);
  P.manager = { i: Number(i), name: M.name, skill: M.skill, fee: M.fee, style: M.style, since: nowS(c), paidTo: ahead(c, 0) };
  const me = meOf(c); if (me) news(c, P, `${me.name} hires ${M.name} to handle the media.`);
  return { ok: true, text: `${M.name} takes over your PR${was ? ` from ${was}` : ''}: ${usd(M.fee)} a round, paid from your endorsements first.` };
}
/** let your PR manager go -> { ok, text } */
export function fireManager(c) {
  const P = ensure(c); if (!P?.manager) return { ok: false, text: 'You have no PR manager.' };
  const n = P.manager.name; P.manager = null;
  return { ok: true, text: `${n} packs up the press folders. You're on your own with the media again.` };
}

// ---- the round ---------------------------------------------------------------------------------------------------------
/** a brand's ending: off your books, appeal down, a headline (news too: it is a story) */
const endDeal = (c, P, D) => { P.deals = P.deals.filter((d) => d !== D); bump(P, { appeal: -3 }); story(c, P, 'deal', 'drop', ['f1news', 'post'], -1, { brand: D.brand }, false, true); };
/** a weighted pick from a list (w: item -> weight) */
const weighted = (list, w) => { const ws = list.map(w), t = ws.reduce((a, v) => a + v, 0); let r = Math.random() * t; for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r <= 0) return list[i]; } return list[list.length - 1]; };
/**
 * Once a round (Career.applyRace, after the race's events and the round moving on): your following grows or shrinks with
 * your image, the heat and the result; the heat cools (x0.65); the image drifts 8% towards where your persona and form
 * put it; sponsor appeal follows image and fame; outlets' opinions settle a little. The deals pay (bonuses, an
 * appearance fee), their clauses bite (image: at once; morality: a warning, then the end), finished deals end (a renewal
 * offer when you still fit), new offers arrive when your fame and image allow; a crisis left unanswered for two rounds
 * runs without you (image -8, heat +10); your manager is paid; the public mood reaches your morale (image > 40 +1,
 * < -30 -3, heat > 60 composure -4); the round goes in the history. -> { lines, money (the endorsements after the
 * manager's fee: Career splits it 70/30), gross, fee }
 */
export function prRoundTick(c) {
  const lines = [], P = ensure(c); if (!P) return { lines, money: 0, gross: 0, fee: 0 };
  const sk = skillOf(P), hurtNow = injured(c), quiet = hushed(c), prev = { season: c.season, round: Math.max(1, num(c.round, 1) - 1) };
  const T = P.tally && P.tally.key === `${prev.season}|${prev.round}` ? P.tally : null, heat0 = P.heat, fame0 = P.fame, label0 = imageLabel(P.image), sh = shares(P.persona);
  // ---- the results colour everything else (form: -1..1, slow to change)
  const res = T ? (T.won ? 1 : T.podium ? 0.6 : T.points ? 0.25 : T.crash ? -0.4 : T.dnf ? -0.15 : 0) : 0;
  P.form = r2(clamp(num(P.form, 0) * 0.65 + res * 0.35, -1, 1));
  // ---- followers, heat, image, appeal
  const g = 0.003 + P.image / 100 * 0.01 + heat0 / 100 * 0.008 + (T?.won ? 0.02 : T?.podium ? 0.01 : T?.points ? 0.003 : 0) + sh.showman * 0.004 + sh.controversial * 0.003 - (P.image < -30 ? 0.008 : 0);
  P.fame = r2(Math.max(0.05, P.fame * (1 + g) + (g > 0 ? 0.004 : -0.002)));
  P.heat = r1(P.heat * 0.65);
  P.image = r1(clamp(P.image + (baseline(P) - P.image) * 0.08, -100, 100));
  const tgt = clamp(30 + P.image * 0.35 + (fameIndex(P.fame) - 40) * 0.8 - P.heat * 0.2 + P.form * 10, 5, 95);
  P.appeal = r1(clamp(P.appeal + (tgt - P.appeal) * 0.12, 0, 100));
  // ---- the outlets settle; a manager works on the coolest of them
  for (const o of OUTLETS) P.media[o.id] = r1(num(P.media[o.id], 0) * 0.95);
  if (P.manager) {
    const lo = OUTLETS.filter((o) => o.id !== 'feed').reduce((a, o) => (P.media[o.id] < P.media[a.id] ? o : a));
    rel(P, lo.id, 1 + 2 * sk);
    if (P.manager.style === 'old') { rel(P, 'apex', 1); rel(P, 'gridfm', 1); }
  }
  // ---- the deals: clauses, pay, endings
  let gross = 0;
  for (const D of P.deals.slice()) {
    if (P.image < D.minImage) { endDeal(c, P, D); lines.push(`${D.brand} has ended your deal: your image fell below their clause (${D.minImage}).`); continue; }
    if (num(D.heatMax, 100) < 100 && heat0 > D.heatMax) {
      D.strikes = num(D.strikes, 0) + 1;
      if (D.strikes >= 2) { endDeal(c, P, D); lines.push(`${D.brand} has invoked the morality clause and ended your deal.`); continue; }
      lines.push(`${D.brand} has written to your agent: one more round like this and the morality clause ends the deal.`);
      story(c, P, 'deal', 'warn', ['f1news'], -1, { brand: D.brand });
    }
    if (D.since && cmp(prev, D.since) < 0) continue;
    gross += D.value; D.paid = r2(num(D.paid, 0) + D.value);
    if (cmp(prev, D.until) >= 0) {
      P.deals = P.deals.filter((d) => d !== D);
      const b = BRAND_BY_ID[D.bid], again = b && P.image >= b.minImage + 5 && P.offers.length < MAX_OFFERS;
      if (again) P.offers.push(makeOffer(c, P, b, 1.1));
      lines.push(`Your deal with ${D.brand} has run its course${again ? ': they want to renew, and there is an offer waiting' : ''}.`);
      story(c, P, 'deal', 'done', ['feed'], 0, { brand: D.brand });
    }
  }
  const due = num(P.bonusDue, 0); P.bonusDue = 0;
  if (due > 0) { gross += due; lines.push(`Endorsement bonuses for the result: ${usd(due)}.`); }
  const w = c.week, head = P.deals[0];
  if (head && w && w.sponsorDone && w.season === prev.season && w.round === prev.round) { gross += 0.1; lines.push(`${head.brand} paid an appearance fee for the sponsor day: ${usd(0.1)}.`); }
  // ---- new offers (not in a grave week, nor while you recover)
  P.offers = P.offers.filter((o) => !o.expires || cmp(nowS(c), o.expires) <= 0);
  for (const id of Object.keys(P.snub)) if (!snubbed(c, P, id)) delete P.snub[id];
  if (!hurtNow && !quiet && P.offers.length < MAX_OFFERS && P.deals.length < MAX_DEALS) {
    const fi = fameIndex(P.fame), held = new Set([...P.deals, ...P.offers].map((d) => d.bid)), pk = personaOf(c).key;
    let pool = BRANDS.filter((b) => !held.has(b.id) && !snubbed(c, P, b.id) && P.image >= b.minImage + 5 && fi >= b.minFi && P.heat <= b.heatMax);
    const p = clamp(0.22 + P.appeal / 400 + sk * 0.12 + (P.manager?.style === 'hustle' ? 0.08 : 0) + (T?.won ? 0.15 : T?.podium ? 0.08 : 0), 0, 0.85);
    for (let k = sk >= 0.7 ? 2 : 1; k > 0 && pool.length && P.offers.length < MAX_OFFERS && Math.random() < p; k--) {
      const b = weighted(pool, (q) => q.base * (q.likes && q.likes === pk ? 1.5 : 1)); pool = pool.filter((q) => q !== b);
      const O = makeOffer(c, P, b); P.offers.push(O);
      lines.push(`${b.brand} would like you for ${/^[aeiou]/i.test(b.kind) ? 'an' : 'a'} ${b.kind} campaign: ${usd(O.value)} a round for ${O.rounds} rounds.`);
    }
  }
  // ---- a crisis left unanswered (paused while you recover, or in a grave week)
  const K = P.crisis;
  if (K && !hurtNow && !quiet) {
    // (a story that broke after the round moved on has had no week yet: it waits for the next race)
    if (!(K.season === c.season && K.round === c.round)) K.ticks = num(K.ticks, 0) + 1;
    if (K.ticks >= 2) {
      P.crisis = null;
      if (K.positive) { lines.push(`The moment passed: the clips have moved on.`); P.past.unshift({ kind: K.kind, title: K.title, key: 'faded', season: c.season, round: c.round, d: null }); }
      else {
        const pen = (P.manager?.style === 'fixer' ? 0.5 : 1) * (K.softened ? 0.5 : 1), d = bump(P, { image: -8 * pen * (1 - 0.4 * sk), heat: 10 * pen });
        story(c, P, 'resolve', 'expire', ['post', K.outlet], -1, { story: K.story }, K.personal, true);
        lines.push(`You never answered ${K.story}: the story ran without you (${fxText(d)}).`);
        P.past.unshift({ kind: K.kind, title: K.title, key: 'expired', season: c.season, round: c.round, d });
      }
      if (P.past.length > PAST_CAP) P.past.length = PAST_CAP;
    }
  }
  // ---- the manager's fee: from the endorsements, the rest from your own account (or the manager walks)
  let fee = 0;
  // (the round you hired them in was paid up front)
  if (P.manager && !(P.manager.paidTo && cmp(prev, P.manager.paidTo) <= 0)) {
    const f = num(P.manager.fee, 0), short = r2(f - gross);
    if (short <= 0 || num(c.wallet, 0) >= short) {
      fee = f;
      if (short > 0) { c.wallet = r2(num(c.wallet, 0) - short); lines.push(`${P.manager.name}'s fee: ${usd(short)} from your own account (the endorsements did not cover it).`); }
    }
    else { lines.push(`${P.manager.name} has walked: the fees went unpaid.`); P.manager = null; }
  }
  const money = r2(Math.max(0, gross - fee));
  if (gross > 0) lines.push(`Endorsements: ${usd(gross)} this round${fee ? `, ${usd(Math.min(fee, gross))} of it to ${P.manager?.name || 'your manager'}` : ''}.`);
  // ---- the public mood reaches you
  if (P.image > 40) mood(c, 1, 'The public is behind you');
  else if (P.image < -30 && !quiet) mood(c, -3, 'Bad press');
  if (heat0 > 60) mood(c, -4, 'The noise around you', 'composure');
  const label1 = imageLabel(P.image); if (label1 !== label0) lines.push(`Public image: ${label1} (was ${label0}).`);
  if (Math.abs(P.fame - fame0) >= 0.05) lines.push(`Followers: ${fameText(P.fame)} (${P.fame > fame0 ? '+' : '-'}${fameText(Math.abs(P.fame - fame0))}).`);
  // ---- the history (one point per race, for the charts)
  const h = { season: prev.season, round: prev.round, fame: P.fame, image: P.image, heat: P.heat, appeal: P.appeal };
  const i = P.hist.findIndex((e) => e.season === h.season && e.round === h.round);
  if (i >= 0) P.hist[i] = h; else P.hist.push(h);
  if (P.hist.length > HIST_CAP) P.hist.splice(0, P.hist.length - HIST_CAP);
  return { lines, money, gross: r2(gross), fee: r2(fee) };
}
/**
 * The season's end (an extra for Career.nextSeason, before the new season begins; review: seasonReview()): one
 * summary headline (measured only, after a grave last race), the persona counts halved (a partly clean slate), the
 * round's counters cleared. -> { lines }
 */
export function prSeasonEnd(c, review = null) {
  const P = ensure(c); if (!P) return { lines: [] };
  const pos = num(review?.youPos, null), r = pos ? prEvent(c, 'season', { pos, season: num(review?.season, c.season) }) : null;
  for (const k of PERSONAS) P.persona[k] = Math.floor(num(P.persona[k], 0) / 2);
  P.tally = null; P.lim = null; P.form = r2(num(P.form, 0) * 0.5);
  const h = r?.headlines?.[0];
  return { lines: h ? [`${outletName(h.outlet)}: ${h.text}`] : [] };
}
