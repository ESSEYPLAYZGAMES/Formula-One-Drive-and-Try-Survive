// The career side of a hug, a hand held, a slow dance and a kiss (ui/Affection.js plays them at the evenings out and the
// after-parties): what they come to the morning after. career/Party.js (partyResult) and Social.js (hangoutResult) have
// already settled the night - the first kiss of a party (R.party.kiss), the flirts and charm a party counts per guest, a
// dance, an evening's talk and its photographer - so this settles ONLY what they cannot see: an evening's romance per
// star, a second kiss at a party, who saw what, a no (and a sorry), her own move and how you answered it, looking after
// someone who had too much, a bro-hug with a team-mate, the texts the morning after and, now and then, one story.
// THE LINE: PG romance with the twelve invented adult stars only; real drivers get friendship, never scandal; nothing
// for a player under age; a grave week or a quiet evening settles nothing at all.

/**
 * ============================ THE AFFECTION SETTLE CONTRACT (WP-C, published for WP-A) ============================
 * affectionResult(c, res, launch) -> { ok, lines: [text], story: sub | null, texts: n }
 *   CareerHub.finishEvening calls it once, AFTER Party.partyResult / Social.hangoutResult, before c.save(), with the
 *   same result object (rr || r) and the evening's launch. Never for a failed or summed-up evening (res.failed /
 *   res.auto), a quiet evening (res.quiet), a grave week (Social's rule, copied here), or a party Party.js did not settle
 *   (c.party.last must be this race's, unseen). A second call with the same result does nothing (res.aff.settled).
 *
 * WHAT IT READS: res.aff, else res.party.aff (Affection.resultInto; act 1 and act 2 already merged by Affection):
 * { v: 1, youPeak, meAge (years; null = unknown = under age: no romance is settled), meReal (a real driver as you: no
 *   cosy / stolen / carer story), clock, levels: { cid: units },
 *   with: { [cid]: {
 *     kind, role, top,
 *     acts: [Act],                 every gesture, in order (the source of truth; the summary fields below only fill gaps)
 *     closed, cap, stepped: [k],
 *     sorry: bool,                 you said sorry after her no (the no costs half)
 *     npcKiss: 'back' | 'laugh' | 'step' | { ans, at, priv, photo, seenBy } | null   her own kiss and your answer, when no
 *                                  Act { k: 'kiss', by: 'her' } carries it
 *     npcDone: [k], herPeak, linked (s), danced,
 *     care: [k | { k, at, priv, photo, seenBy }]   'water' | 'seat' | 'stay' | 'car', when no Act carries them
 *     kissRp: bool                 true when this star's kiss was written into R.party.kiss (a hint only: the settle trusts
 *                                  R.party.kiss itself, the one kiss Party.partyResult settles; any other is settled here)
 *   } },
 *   photos: [{ cid, k }],          photographed acts (as Act.photo)
 *   log: [text] }
 * Act: { k: gesture key, at: clock hours (Party.js CLOCK), by: 'me' | 'her' (her: the other person made the move, a driver
 *   included), ans: 'yes' | 'notyet' | 'no' | 'back' | 'laugh' | 'step' | 'veto', priv (nobody else in the room saw it),
 *   photo (a camera had it), seenBy: [cid] (principals who saw it, not her), tier (her drink tier 0..4), you (your tier
 *   0..4), act: what it counts as - 'flirt' | 'charm' | 'kiss' | 'friend' | 'care' | null (left out: worked out here) }
 * Gesture keys: touch, hug, side, lean, hand, reach, arm, cuddle, close, dance, cheek, kiss (stars); bro, celebrate,
 *   mates (drivers; touch and hug too); water, seat, stay, car (care). A yes counts as: kiss (kiss), flirt (hand, reach,
 *   arm, cuddle, close, dance, cheek), charm (a hug with a star you have only just met or are friendly with), friend
 *   (any yes with a driver), care (the four care keys). 'back' is a yes to her kiss.
 *
 * WHAT IT DOES (and what it leaves to the others, so nothing is counted twice):
 *  - Evening (Social.hangoutResult gave every star min(2, R.fx.flirt) flirts and one charm from the AGGREGATE): each star
 *    gets max(0, min(2, talk + hers) - min(2, talk)) more flirts, talk = the aggregate R.fx.flirt, hers = her own
 *    romantic yeses; a charm only when R.fx.charm was 0. A kiss: flirt x2, trust +3 when private, a line; photographed
 *    with a star you are not yet dating: PR 'date' (Social runs that only for dating stars). Romance seen by someone
 *    you are seeing who was there: affection -(4 + 8 jealousy), trust -6, upset at jealousy 0.3 (a kiss); half that for
 *    anything less; a secret one exposed to her ('room'), and paddock gossip when drivers saw it ('friend', 0.6).
 *  - Party (live: g.fx flirt / charm, R.party.danced and the first kiss are Party.js's): a second kiss with another
 *    star (kissRp false) as an evening's kiss, jealousy from res.aff seenBy (half when partyResult already counted her).
 *  - A no: her affection -2, trust -1 (half after a sorry); someone you are seeing saw it: -(2 + 4 jealousy), trust -3.
 *    No press, no text. A not-yet costs nothing.
 *  - Her kiss: back = the mutual kiss (Party.js's when kissRp); laugh: nothing for her, a partner who saw it -(2 + 6
 *    jealousy), trust -3; step: her affection -1, trust +2 (+3 when she knew you were with someone), a partner who saw
 *    it trust +2, affection +1. Photographed at a party: PR 'party' 'stolen', exposure('photo') if you are involved.
 *  - Care for the very drunk: a star trust +4, affection +3; a fictional driver friendship +6; morale +1 once; a partner
 *    who saw it +1; a car home photographed at a party: PR 'party' 'carer'.
 *  - Drivers: friendship +1 a platonic yes (2 a night at most); the celebration hug with your team-mate after a podium:
 *    rapport +2.
 *  - A romance attempt while you were drunk (tier 3+) with a star at flirting or above: one kind text.
 *  - Texts (2 at most, one a person: a partner's first, then hers, then thanks, then the drunk one) through
 *    Social.pushText; at a party also into c.party.last.texts, one timeline line (before the exit line, 6 at most; it
 *    replaces Party.js's own 'A kiss with ...' / 'Danced with ...' for that star), the press line and the people's
 *    deltas, merged.
 *  - The papers: at most ONE story a night (none while your driver is hurt; none at a party whose own stories had a kiss
 *    or 'together'; never cosy / stolen / carer for a real driver as you): stolen > a second kiss ('party' 'kiss') or an
 *    evening's 'date' > cosy (a photographed hand, cuddle, dance, cheek) > carer.
 * Writes only through Celebs (relateCeleb, trustCeleb, upsetCeleb, flirt, charm, exposure), Social (pushText,
 * relateFriend), PR (prEvent), Morale (shiftMorale), c.relate and c.party.last. Bonds are read from c.celebs.bonds as
 * they are. Never c.week, never a race trait. Every call is wrapped: a hiccup never stops an evening being settled.
 * ===================================================================================================================
 */
import { CELEB, relateCeleb, trustCeleb, upsetCeleb, flirt, charm, exposure } from './Celebs.js';
import { pushText, relateFriend, VENUE_BY_ID } from './Social.js';
import { prEvent } from './PR.js';
import { shiftMorale } from './Morale.js';

// ---- small helpers ------------------------------------------------------------------------------------------------------
const num = (v, f) => (typeof v === 'number' && isFinite(v) ? v : f);
const arr = (a) => (Array.isArray(a) ? a : []);
const obj = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? o : {});
const first = (s) => String(s || '').trim().split(/\s+/)[0] || '';
const lastName = (s) => String(s || '').trim().split(/\s+/).pop() || '';
const pick = (a) => a[(Math.random() * a.length) | 0];
const fill = (s, T = {}) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => (T[k] != null ? String(T[k]) : '')).replace(/ {2,}/g, ' ').trim();
/** a call into another engine that must never stop an evening being settled -> its result, or d */
const safe = (what, f, d = null) => { try { const v = f(); return v === undefined || v === null ? d : v; } catch (e) { console.warn(`AffectionResult: ${what} failed`, e); return d; } };
const SPAN = (c) => c?.rounds || 6;
const ago = (c, at) => (at && at.season != null && at.round != null ? (c.season - at.season) * SPAN(c) + (c.round - at.round) : 99);
/** a grave week (Social.js's rule, which it does not export): the race just run hurt someone, or the paddock lost someone in the last two weeks */
const grave = (c) => { const x = c?.pr?.ctx; return (!!x?.grave && (x.season == null || ago(c, x) <= 1)) || arr(c?.lost).some((l) => l && ago(c, l) <= 1); };
const meOf = (c) => c?.drivers?.[c.playerId] || null;
/** a real person (the grid, the reserves, F2) rather than one of the game's own */
const isReal = (d) => !!d && ['F1', 'Reserve', 'F2'].includes(d.from);
const live = (d) => !!d && d.alive !== false;
const hurtNow = (c, d) => !!d && d.outUntil != null && d.outUntil >= c.round;
const TOGETHER = ['dating', 'partner'];
/** you are in something with her (Celebs' rule): together, or she said yes to a date you have not had yet */
const involved = (b) => !!b && !b.grieving && (TOGETHER.includes(b.stage) || (!!b.accepted && b.stage !== 'ex'));
/** clock hours as a time: 26.25 -> '02:15' */
const hhmm = (h) => { const m = Math.floor(((num(h, 0) % 24) + 24) % 24 * 60 + 1e-6); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
/** 'c:mira-vale' or 'mira-vale' -> 'mira-vale' */
const bare = (k) => String(k || '').replace(/^c:/, '');

// ---- the gestures -------------------------------------------------------------------------------------------------------
/** how far each gesture goes (ui/Affection.js's ladder): romance from 3 */
const I = { touch: 0.5, hug: 1, side: 1.5, lean: 2, hand: 3, reach: 3, arm: 3, cuddle: 3.5, close: 3.5, dance: 3.5, cheek: 4, kiss: 5, bro: 1, celebrate: 1, mates: 1.5 };
const CARE = ['water', 'seat', 'stay', 'car'];
/** the romantic gestures short of a kiss (a yes is a flirt; photographed at a party, a 'cosy' story) */
const COSY = ['hand', 'reach', 'arm', 'cuddle', 'close', 'dance', 'cheek'];
/** the platonic gestures a driver's yes counts as friendship for (never Affection's own 'sorry' / 'space' / 'release' records) */
const MATE = ['touch', 'hug', 'side', 'bro', 'celebrate', 'mates', 'selfie'];
const YES = ['yes', 'back'];
const HER_ANS = ['back', 'laugh', 'step'];
/** where an evening's kiss happened, for the line */
const EVE_WHERE = { rooftop: 'on the rooftop', pub: 'at the pub', simlounge: 'at the sim lounge', apartment: 'at your flat', restaurant: 'over dinner', karting: 'at the karting hall', coffee: 'over coffee', poolclub: 'by the pool' };
const OUTLET_NAME = { post: 'The Paddock Post', feed: 'Chequered', race24: 'RACE 24', gptv: 'GP TV', f1news: 'F1 NEWS', apex: 'APEX', pitlane: 'PIT LANE', gridfm: 'GRID FM', weekly: 'Paddock Weekly' };

// ---- the texts the morning after (tokens: {her} the other woman's first name, {sur} you, {gp}, {place}) --------------------
const TEXTS = {
  // (she kissed you, and you kissed her back)
  sweet: ["So. Last night. I'd do it again. Sober, even. x", 'I kissed you. You kissed me back. Just checking I did not dream that. x', 'Morning. No regrets here. Coffee later? x'],
  // (you both laughed it off)
  awkward: ['About last night - friends? Please say friends.', 'Blame the cocktails. And me. Mostly me. Still friends?', 'Okay. That happened. Can we pretend it was the tequila\'s idea?'],
  // (you stepped back, gently)
  embarrassed: ["I'm so embarrassed. Thank you for being decent about it.", 'Last night was not my finest moment. Thank you for being kind about it.', 'Mortified. Thank you for being lovely about it. Can we never mention it again?'],
  // (you looked after her)
  grateful: ["I don't remember much. I remember you got me home. Thank you. x", 'Thank you for looking after me last night. I did not make it easy. x', 'The water, the seat, the car. I owe you one. Thank you. x'],
  // (you looked after him: a driver friend)
  gratefulMate: ["Cheers for last night. Don't remember much, but I remember you sorting me a car. I owe you one.", "Head's pounding. Thanks for looking out for me last night, mate."],
  // (you tried your luck while very drunk)
  drunkKind: ['You were sweet last night. Also very drunk. Water next time? x', 'Drink some water today. You were sweet, and very, very drunk. x'],
  // (someone you are seeing saw it)
  partnerSawStep: ['I saw you step back. Thank you.', 'I saw what {her} did. And I saw what you did. Thank you.'],
  partnerSawLaugh: ['We need to talk about your friend.', '{her} kissed you and you laughed. We need to talk.'],
  partnerSawKiss: ["I saw you with {her}. Don't call me today.", 'I was there. I saw. We need to talk.'],
};
// (the order the two texts are chosen in: what someone you are seeing has to say first)
const TEXT_PRI = { partnerSawKiss: 0, partnerSawLaugh: 0, partnerSawStep: 1, sweet: 2, awkward: 2, embarrassed: 2, grateful: 3, gratefulMate: 4, drunkKind: 5 };

/** an act as this module reads it (tolerant of what an older or partial record leaves out) */
const actOf = (a, photoed) => ({ k: String(a.k), at: num(a.at, null), by: a.by === 'her' ? 'her' : 'me', ans: String(a.ans || ''), priv: !!a.priv, photo: !!a.photo || photoed(String(a.k)),
  seenBy: arr(a.seenBy).map(String), tier: num(a.tier, 0), you: num(a.you, 0), act: typeof a.act === 'string' ? a.act : null });
/** a guest's acts tonight: the record's own, and her move or the care from the summary when no act carries them */
const actsOf = (A, cid, W) => {
  const photoed = (k) => arr(A.photos).some((p) => p && String(p.cid) === cid && p.k === k);
  const L = arr(W.acts).filter((a) => a && typeof a === 'object' && typeof a.k === 'string').map((a) => actOf(a, photoed));
  const nk = W.npcKiss && typeof W.npcKiss === 'object' ? W.npcKiss : typeof W.npcKiss === 'string' ? { ans: W.npcKiss } : null;
  if (nk && HER_ANS.includes(nk.ans) && !L.some((a) => a.by === 'her' && a.k === 'kiss')) L.push(actOf({ ...nk, k: 'kiss', by: 'her' }, photoed));
  for (const x of arr(W.care)) {
    const o = typeof x === 'string' ? { k: x } : obj(x);
    if (CARE.includes(o.k) && !L.some((a) => a.k === o.k && YES.includes(a.ans))) L.push(actOf({ ...o, ans: 'yes', act: 'care' }, photoed));
  }
  return L;
};
/** what a yes counts as (star: one of the twelve; stage: hers now) -> 'kiss' | 'flirt' | 'charm' | 'friend' | 'care' | null */
const countsAs = (a, star, stage) => {
  if (!YES.includes(a.ans)) return null;
  if (a.act) return a.act;
  if (CARE.includes(a.k)) return 'care';
  if (!star) return MATE.includes(a.k) ? 'friend' : null;
  if (a.k === 'kiss') return 'kiss';
  if (COSY.includes(a.k)) return 'flirt';
  if (a.k === 'hug' && ['stranger', 'met', 'friendly'].includes(stage || 'met')) return 'charm';
  return null;
};
/** a count from an evening's talk, as Social.hangoutResult reads it (fx: { flirt: n } for everyone, or { [cid]: { flirt: n } }) */
const fxOf = (R, cid, k) => { const F = obj(R.fx), per = Object.keys(F).some((x) => x.includes(':')); return num(per ? obj(F[cid])[k] : F[k], 0); };

/**
 * What the evening's affection came to (see THE AFFECTION SETTLE CONTRACT above): c the career, res the Hangout result
 * as CareerHub settled it (rr || r), launch the evening's launch -> { ok, lines, story, texts }
 */
export function affectionResult(c, res, launch = null) {
  const lines = [], out = { ok: false, lines, story: null, texts: 0 };
  if (!c || typeof c !== 'object' || !c.drivers || !res || typeof res !== 'object' || res.failed || res.auto) return out;
  const A = res.aff && typeof res.aff === 'object' ? res.aff : res.party?.aff && typeof res.party.aff === 'object' ? res.party.aff : null;
  if (!A || A.settled) return out;
  const WITH = obj(A.with); if (!Object.keys(WITH).length) return out;
  if (res.quiet || grave(c)) return out;
  const party = launch?.key === 'party' || (!!res.party && typeof res.party === 'object');
  const Rp = obj(res.party), PT = c.party && typeof c.party === 'object' ? c.party : null, S = PT?.race || null, Lst = PT?.last || null;
  // (a night career/Party.js did not settle - a grave race, a night refused, act 1 still going on to the club - nothing here either)
  if (party && (Rp.exit === 'moveon' || !S || !Lst || !Lst.unseen || Lst.season !== S.season || Lst.round !== S.round || Lst.aff)) return out;
  A.settled = true; if (party) Lst.aff = true;
  out.ok = true;

  const bonds = obj(c.celebs?.bonds), me = meOf(c), pid = c.playerId;
  const meReal = typeof A.meReal === 'boolean' ? A.meReal : typeof launch?.me?.real === 'boolean' ? launch.me.real : isReal(me);
  // (under age, or an age nobody has on file: no romance either way - only kindness and friendship are settled)
  const minor = A.meAge !== undefined ? !(num(A.meAge, -1) >= 18) : launch?.me && launch.me.age !== undefined ? !(num(launch.me.age, -1) >= 18) : false;
  const pressOk = !hurtNow(c, me);
  const seeingNow = Object.keys(bonds).filter((id) => CELEB[id] && TOGETHER.includes(bonds[id]?.stage) && !bonds[id]?.grieving);
  const present = new Set(party ? [...Object.keys(obj(res.per)), ...Object.keys(obj(Rp.contacts)), ...Object.keys(WITH)] : arr(res.guests).map(String));
  const venue = party ? Rp.venue || Lst?.venue || res.venue || 'teamparty' : res.venue || launch?.venue || null;
  const team = c.myTeam || me?.team || 'the team';
  // ('at the Halo Room', 'at the Ormond Vault': the club's own name, with its article, mid-headline)
  const club = String(Lst?.place || '').split(',')[0].trim().replace(/^The\s+/, '');
  const place = party ? (venue === 'teamparty' ? `the ${team} hospitality` : club ? `the ${club}` : 'the club') : VENUE_BY_ID[venue]?.name || 'the evening';
  const T0 = { sur: meReal ? `the ${team} driver` : lastName(me?.name), gp: S?.gp || '', place };
  // (snapshots, for the morning-after's people: what this settle moved)
  const aff0 = Object.fromEntries(Object.keys(bonds).map((id) => [id, num(bonds[id]?.aff, 0)]));
  const fr0 = Object.fromEntries(Object.entries(obj(c.social?.friends)).map(([did, f]) => [did, num(f?.level, 0)]));
  const touched = new Set();
  const texts = [], stories = [], moments = [];
  const say = (cid, bank, T = {}) => { if (TEXTS[bank]) texts.push({ cid, bank, T: { ...T0, ...T }, pri: TEXT_PRI[bank] ?? 9 }); };
  const hit = new Set();   // ('w|id': someone you are seeing has already reacted to you and her tonight)
  const sawIt = (a, id) => [...new Set(a.seenBy.map(bare))].filter((w) => w !== id && CELEB[w] && seeingNow.includes(w) && present.has(`c:${w}`));

  // (party: what Party.partyResult's own jealousy already counted - its 'romanced' rule - so a second offence is not the same one twice)
  const C = {};
  if (party) {
    for (const [cid, x] of Object.entries(obj(res.per))) C[cid] = { fx: obj(x?.fx), priv: 0 };
    for (const [cid, x] of Object.entries(obj(Rp.contacts))) C[cid] = { ...(C[cid] || {}), ...obj(x), fx: { ...obj(C[cid]?.fx), ...obj(x?.fx) } };
  }
  const prKiss = bare(Rp.kiss), prSeenBy = arr(Rp.kissSeenBy).map(bare);
  const partyCounted = (id, w) => {
    if (!party) return false;
    const x = C[`c:${id}`]; if (!x) return false;
    const fl = Math.min(2, num(x.fx?.flirt, 0)), dn = arr(Rp.danced).some((d) => d && d.cid === `c:${id}`), kiss = prKiss === id;
    const n = fl + (dn ? 1 : 0) + (kiss && !Rp.kissPrivate ? 1 : 0);
    return (fl > 0 || dn || kiss || num(x.fx?.together, 0) > 0) && (n > num(x.priv, 0) || (kiss && prSeenBy.includes(w)));
  };
  /** someone you are seeing (w) saw you with her (id): mul 1 for a kiss, 0.5 for less -> the line */
  const jealous = (w, id, mul, what) => {
    const key = `${w}|${id}`; if (hit.has(key)) return; hit.add(key);
    const Cw = CELEB[w], Tw = Cw.traits || {}, fw = first(Cw.name), o = first(CELEB[id].name), j = num(Tw.jealousy, 0.3);
    safe('relateCeleb', () => relateCeleb(c, w, -Math.round((4 + 8 * j) * mul), `${fw} saw you ${what} ${o}`)); safe('trustCeleb', () => trustCeleb(c, w, -Math.round(6 * mul)));
    touched.add(w);
    let t = j >= 0.4 && mul >= 1 ? `${fw} saw you ${what} ${o}, and she is not amused.` : `${fw} saw you ${what} ${o}. She raises an eyebrow.`;
    if (j >= 0.3 && mul >= 1) { const u = safe('upsetCeleb', () => upsetCeleb(c, w, `${fw} is upset about ${o}.`), null); if (u?.text) t += ` ${u.text}`; }
    lines.push(t);
  };
  let careDone = false, drunkSent = false, mateHug = false;

  for (const [cid, W1] of Object.entries(WITH)) {
    const W = obj(W1);
    // ---- the stars --------------------------------------------------------------------------------------------------
    if (cid.startsWith('c:')) {
      const id = cid.slice(2), Ce = CELEB[id], b = bonds[id]; if (!Ce || b?.grieving) continue;
      const f = first(Ce.name), stage = b?.stage || 'met', acts = actsOf(A, cid, W);
      // (looking after her when she had had too much: kindness is settled whatever your age)
      const care = acts.filter((a) => countsAs(a, true, stage) === 'care');
      if (care.length) {
        safe('trustCeleb', () => trustCeleb(c, id, 4)); safe('relateCeleb', () => relateCeleb(c, id, 3, `${f} remembers who looked after her`)); touched.add(id);
        careDone = true;
        for (const w of [...new Set(care.flatMap((a) => sawIt(a, id)))]) { const fw = first(CELEB[w].name); safe('relateCeleb', () => relateCeleb(c, w, 1, `${fw} saw you look after ${f}`)); touched.add(w); }
        const ks = care.map((a) => a.k), top = ks.includes('car') ? 'car' : ks.includes('seat') ? 'seat' : ks.includes('stay') ? 'stay' : 'water';
        const t = { car: `${f} had had far too much. You got her water and a car home.`, seat: `${f} had had far too much. You found her a seat and some water.`, stay: `You sat with ${f} until she felt better.`, water: `You got ${f} some water when she needed it.` }[top];
        lines.push(t); moments.push({ pri: 2, at: care[0].at, text: t, f });
        say(cid, 'grateful');
        const car = care.find((a) => a.k === 'car' && a.photo);
        if (party && car) stories.push({ pri: 4, sub: 'carer' });
      }
      if (minor) continue;
      const yesR = acts.filter((a) => countsAs(a, true, stage) === 'flirt');
      const kisses = acts.filter((a) => countsAs(a, true, stage) === 'kiss');
      const herK = acts.find((a) => a.by === 'her' && a.k === 'kiss' && HER_ANS.includes(a.ans)) || null;
      const no = acts.find((a) => a.by === 'me' && a.ans === 'no') || null;
      const charmA = acts.find((a) => countsAs(a, true, stage) === 'charm') || null;

      // -- an evening's own romance, per star (the aggregate already went to everyone)
      if (!party) {
        const talk = fxOf(res, cid, 'flirt'), extra = Math.max(0, Math.min(2, talk + yesR.length) - Math.min(2, talk));
        for (let i = 0; i < extra; i++) safe('flirt', () => flirt(c, id));
        if (charmA && !fxOf(res, cid, 'charm')) { safe('charm', () => charm(c, id)); touched.add(id); }
      }

      // -- a kiss (a mutual one: yours with a yes, or hers kissed back)
      // (Party.js settles only the kiss R.party.kiss names at the end of the night - PartyPlay's own talk kiss can take it
      //  over from an earlier one, so W.kissRp alone is not enough)
      const kissA = kisses[0] || null, viaRp = party && !!kissA && prKiss === id;
      if (kissA && !viaRp) {
        const priv = kisses.some((a) => a.priv), photo = kisses.some((a) => a.photo);
        safe('flirt', () => flirt(c, id)); safe('flirt', () => flirt(c, id));
        if (priv) safe('trustCeleb', () => trustCeleb(c, id, 3));
        touched.add(id);
        const where = party ? (priv ? ', away from everyone' : venue === 'teamparty' ? ', in the middle of the party' : ', on the dance floor') : EVE_WHERE[venue] ? ` ${EVE_WHERE[venue]}` : '';
        const t = herK?.ans === 'back' ? `${f} kissed you, out of the blue. You kissed her back.` : `A kiss with ${f}${where}.`;
        lines.push(t); moments.push({ pri: herK?.ans === 'back' ? 0 : 1, at: (herK?.ans === 'back' ? herK : kissA).at, text: t, f, kiss: true });
        if (photo) {
          if (party) { if (!(herK?.ans === 'back' && herK.photo)) stories.push({ pri: 1, sub: 'kiss', celeb: id }); }
          else if (!TOGETHER.includes(stage) && !b?.accepted) stories.push({ pri: 1, kind: 'date', celeb: id });
          // (the photographs exist whatever the papers print: someone you are seeing in secret is given away; a jealous
          //  one who was not there sees them)
          if (involved(b) && party) { const e = safe('exposure', () => exposure(c, 'photo', [id], 1.5), null); if (e?.text) lines.push(e.text); }
          for (const w of seeingNow) {
            if (w === id || present.has(`c:${w}`) || num(CELEB[w].traits?.jealousy, 0) < 0.4) continue;
            safe('relateCeleb', () => relateCeleb(c, w, -3, `${first(CELEB[w].name)} saw the photographs of you and ${f}`)); touched.add(w);
          }
        }
        const saw = [...new Set(kisses.flatMap((a) => sawIt(a, id)))];
        for (const w of saw) {
          jealous(w, id, partyCounted(id, w) ? 0.5 : 1, 'kiss');
          if (involved(b)) { const e = safe('exposure', () => exposure(c, 'room', [id], 1.2, [w]), null); if (e?.text) lines.push(e.text); }
        }
        if (saw.length) say(`c:${saw[0]}`, 'partnerSawKiss', { her: f });
        if (herK?.ans === 'back') say(cid, 'sweet');
      } else if (kissA && viaRp) {
        // (Party.partyResult settled this one - flirts, trust, the story, jealousy from who saw it, her text: the morning
        //  after can still tell it as it happened, and someone you are seeing who saw it has something to say)
        if (herK?.ans === 'back') moments.push({ pri: 0, at: herK.at, text: `${f} kissed you, out of the blue. You kissed her back.`, f, kiss: true });
        const saw = [...new Set(kisses.flatMap((a) => sawIt(a, id)))];
        for (const w of saw) hit.add(`${w}|${id}`);
        if (saw.length) say(`c:${saw[0]}`, 'partnerSawKiss', { her: f });
      }

      // -- her kiss, laughed off or stepped back from (kissed back is the kiss above)
      if (herK && herK.ans !== 'back') {
        const knew = seeingNow.some((w) => w !== id && (bonds[w]?.public || arr(b?.knows).includes(w)));
        if (herK.ans === 'step') { safe('relateCeleb', () => relateCeleb(c, id, -1)); safe('trustCeleb', () => trustCeleb(c, id, knew ? 3 : 2)); say(cid, 'embarrassed'); }
        else say(cid, 'awkward');
        touched.add(id);
        const t = `${f} kissed you, out of the blue. ${herK.ans === 'step' ? 'You stepped back, gently.' : 'You both laughed it off.'}`;
        lines.push(t); moments.push({ pri: 0, at: herK.at, text: t, f, kiss: true });
        for (const w of sawIt(herK, id)) {
          const key = `${w}|${id}`; if (hit.has(key)) continue; hit.add(key);
          const Cw = CELEB[w], fw = first(Cw.name), j = num(Cw.traits?.jealousy, 0.3); touched.add(w);
          if (herK.ans === 'step') { safe('trustCeleb', () => trustCeleb(c, w, 2)); safe('relateCeleb', () => relateCeleb(c, w, 1, `${fw} saw you step back from ${f}`)); say(`c:${w}`, 'partnerSawStep', { her: f }); lines.push(`${fw} saw ${f} kiss you, and saw you step back.`); }
          else { safe('relateCeleb', () => relateCeleb(c, w, -Math.round(2 + 6 * j), `${fw} saw ${f} kiss you`)); safe('trustCeleb', () => trustCeleb(c, w, -3)); say(`c:${w}`, 'partnerSawLaugh', { her: f }); lines.push(`${fw} saw ${f} kiss you, and you laughing about it. She is not laughing.`); }
        }
      }
      // (her move on camera at a party: the 'stolen' story, and the photographs give a secret away)
      if (herK && herK.photo && party) {
        stories.push({ pri: 0, sub: 'stolen', celeb: id });
        if (involved(b)) { const e = safe('exposure', () => exposure(c, 'photo', [id], 1.0), null); if (e?.text) lines.push(e.text); }
      }

      // -- an evening's romance short of a kiss, seen by someone you are seeing (half a kiss's jealousy); gossip from drivers
      if (!party) {
        for (const a of yesR) for (const w of sawIt(a, id)) jealous(w, id, 0.5, 'getting close to');
        const romSeen = [...yesR, ...kisses];
        if (involved(b) && b?.secret && romSeen.some((a) => a.seenBy.some((k) => k.startsWith('d:')))) { const e = safe('exposure', () => exposure(c, 'friend', [id], 0.6), null); if (e?.text) lines.push(e.text); }
      }
      // -- a party's photographed cosy moment (the flirt itself was counted live)
      if (party) { const ph = yesR.find((a) => a.photo); if (ph) stories.push({ pri: 3, sub: 'cosy', celeb: id }); }
      if (yesR.length && !kissA) {
        const a = yesR.find((x) => x.k === 'dance') || yesR.find((x) => ['cuddle', 'arm'].includes(x.k)) || yesR.find((x) => x.k === 'hand') || yesR.find((x) => x.k === 'cheek') || yesR[0];
        const t = a.k === 'dance' ? `A slow dance with ${f}, close.` : ['cuddle', 'arm'].includes(a.k) ? `Curled up on a sofa with ${f}.` : a.k === 'hand' ? `Hand in hand with ${f}.` : a.k === 'cheek' ? (a.by === 'her' ? `${f} kissed you on the cheek.` : `A kiss on the cheek for ${f}, and a smile back.`) : `Close to ${f} all evening.`;
        moments.push({ pri: 3, at: a.at, text: t, f, dance: a.k === 'dance' });
      }

      // -- a no: an awkward moment, and someone you are seeing who saw it
      if (no) {
        const half = !!W.sorry;
        safe('relateCeleb', () => relateCeleb(c, id, half ? -1 : -2, `An awkward moment with ${f}`)); if (!half) safe('trustCeleb', () => trustCeleb(c, id, -1));
        touched.add(id);
        const t = `${f} pulled away. An awkward moment${half ? ', and you said sorry' : ''}.`;
        lines.push(t); moments.push({ pri: 4, at: no.at, text: t, f });
        for (const w of sawIt(no, id)) {
          const key = `${w}|${id}`; if (hit.has(key)) continue; hit.add(key);
          const Cw = CELEB[w], fw = first(Cw.name), j = num(Cw.traits?.jealousy, 0.3); touched.add(w);
          safe('relateCeleb', () => relateCeleb(c, w, -Math.round(2 + 4 * j), `${fw} saw you make a move on ${f}`)); safe('trustCeleb', () => trustCeleb(c, w, -3));
          lines.push(`${fw} saw you make a move on ${f}.`);
        }
      }
      // -- a romantic try while you were very drunk, with someone you are close to: one kind text
      if (!drunkSent && ['flirting', 'dating', 'partner'].includes(stage) && acts.some((a) => a.by === 'me' && num(I[a.k], 0) >= 3 && ['notyet', 'no'].includes(a.ans) && a.you >= 3)) { say(cid, 'drunkKind'); drunkSent = true; }
      continue;
    }
    // ---- the drivers: friendship for a bro-hug, thanks for a car home --------------------------------------------------
    if (cid.startsWith('d:')) {
      const did = cid.slice(2), d = c.drivers?.[did]; if (!d || !live(d) || did === pid) continue;
      const acts = actsOf(A, cid, W), real = isReal(d), nm = first(d.name);
      const care = real ? [] : acts.filter((a) => countsAs(a, false) === 'care');
      if (care.length) {
        safe('relateFriend', () => relateFriend(c, did, 6, `Looked after ${d.name} after a big night`)); careDone = true;
        for (const w of [...new Set(care.flatMap((a) => sawIt(a, null)))]) { safe('relateCeleb', () => relateCeleb(c, w, 1, `${first(CELEB[w].name)} saw you look after ${nm}`)); touched.add(w); }
        const t = care.some((a) => a.k === 'car') ? `${nm} had had far too much. You got him a car back to the hotel.` : `You looked after ${nm} when he had had too much.`;
        lines.push(t); moments.push({ pri: 2, at: care[0].at, text: t, f: nm });
        say(cid, 'gratefulMate');
        if (party && care.some((a) => a.k === 'car' && a.photo)) stories.push({ pri: 4, sub: 'carer' });
      }
      const n = acts.filter((a) => countsAs(a, false) === 'friend').length;
      if (n) safe('relateFriend', () => relateFriend(c, did, Math.min(2, n), ''));
      if (party && !mateHug && S && did === S.mate && (S.won || S.podium) && acts.some((a) => a.k === 'celebrate' && YES.includes(a.ans))) { safe('relate', () => c.relate?.(did, 2, null)); mateHug = true; }
    }
  }
  if (careDone) safe('shiftMorale', () => shiftMorale(c, pid, 1, 'Looked after a friend'));

  // ---- the papers: one story at most ----------------------------------------------------------------------------------
  const romStory = party && ((!!prKiss && !!Rp.kissSeen) || (String(Rp.exit || '').startsWith('together:') && !!Rp.photographed));
  let head = null;
  if (pressOk && stories.length && !romStory) {
    stories.sort((a, b) => a.pri - b.pri);
    for (const s of stories) {
      if (meReal && ['cosy', 'stolen', 'carer'].includes(s.sub)) continue;
      const Ce = s.celeb ? CELEB[s.celeb] : null;
      const r = s.kind === 'date' ? safe('PR date', () => prEvent(c, 'date', { celeb: Ce.id, celebName: Ce.name, job: Ce.job, venue, publicly: true }), null)
        : safe(`PR party ${s.sub}`, () => prEvent(c, 'party', { sub: s.sub, track: S?.track, venue, place, celeb: Ce?.id, celebName: Ce?.name, job: Ce?.job }), null);
      const h = arr(r?.headlines).find((x) => x?.text);
      if (!r) continue;
      out.story = s.kind === 'date' ? 'date' : s.sub;
      if (h) { head = h; lines.push(`In the papers: ${h.text}`); }
      break;
    }
  }

  // ---- the texts: two at most, one each ---------------------------------------------------------------------------------
  texts.sort((a, b) => a.pri - b.pri);
  const sent = [], who = new Set();
  for (const x of texts) {
    if (sent.length >= 2 || who.has(x.cid)) continue;
    const t = fill(pick(TEXTS[x.bank]), x.T); if (!t) continue;
    const m = safe('pushText', () => pushText(c, x.cid, t), null); if (!m) continue;
    who.add(x.cid);
    const id = x.cid.slice(2), name = x.cid.startsWith('c:') ? CELEB[id]?.name : c.drivers?.[id]?.name;
    sent.push({ cid: x.cid, name: name || 'Someone', text: t });
  }
  out.texts = sent.length;

  // ---- the morning after (a party: c.party.last, as PartyCards shows it) ----------------------------------------------
  if (party && Lst) {
    // (one line in the night's timeline: before the exit line, six at most; it tells Party.js's own line for her better)
    moments.sort((a, b) => a.pri - b.pri);
    const M = moments[0];
    if (M) {
      const TL = Lst.timeline = arr(Lst.timeline).slice(), line = `${M.at != null ? `${hhmm(M.at)} ` : ''}${M.text}`;
      const mine = TL.findIndex((x) => typeof x === 'string' && ((M.kiss && x.startsWith(`A kiss with ${M.f}`)) || (M.dance && x === `Danced with ${M.f}.`)));
      if (mine >= 0) TL[mine] = line;
      else if (TL.length < 6) TL.splice(Math.max(0, TL.length - 1), 0, line);
      else {
        // (full: the least of the lines before the way home makes room - never the opening, the drinks or a kiss)
        for (let i = TL.length - 2; i >= 1; i--) { const x = String(TL[i] || ''); if (/^A kiss with /.test(x) || /^\d+ drinks?\b/.test(x)) continue; TL[i] = line; break; }
      }
    }
    if (sent.length) Lst.texts = [...arr(Lst.texts), ...sent].slice(0, 10);
    if (head) {
      const P0 = arr(Lst.press);
      if (P0.length < 3 && !P0.some((p) => p?.text === head.text)) Lst.press = [...P0, { outlet: head.outlet, name: OUTLET_NAME[head.outlet] || head.outlet, text: head.text, tone: head.tone }];
    }
    // (the people: what this moved, merged into Party.js's own deltas for them)
    const ppl = Lst.people = arr(Lst.people).slice();
    const add = (cid, name, role, k, v, text = '') => {
      if (!v) return;
      let p = ppl.find((q) => q && q.cid === cid);
      if (!p && ppl.length < 6) ppl.push(p = { cid, name, role, delta: [] });
      if (!p) return;
      p.delta = arr(p.delta); const d = p.delta.find((q) => q && q.k === k);
      if (d) d.v = Math.round((num(d.v, 0) + v) * 10) / 10; else p.delta.push({ k, v: Math.round(v * 10) / 10, text });
    };
    for (const id of touched) { const v = num(c.celebs?.bonds?.[id]?.aff, 0) - num(aff0[id], 0); if (CELEB[id]) add(`c:${id}`, CELEB[id].name, seeingNow.includes(id) ? 'partner' : 'celeb', 'affection', v); }
    for (const [did, f] of Object.entries(obj(c.social?.friends))) { if (!(did in fr0)) continue; const v = num(f?.level, 0) - num(fr0[did], 0); if (v && WITH[`d:${did}`]) add(`d:${did}`, c.drivers?.[did]?.name || 'A driver', 'friend', 'friendship', v); }
  }
  return out;
}
