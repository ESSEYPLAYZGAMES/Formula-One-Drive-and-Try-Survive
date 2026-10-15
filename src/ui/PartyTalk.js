// What people say at the after-party (ui/Hangout.js's party venues: the team's hospitality in the paddock, the Halo Room
// at the Meridian Grand on the Strip, the Ormond Vault in Mayfair): the race just run, the toast, the shoey, the
// mechanics coming in late from the pack-down, the people who work a room - a brand's head of athlete marketing, an
// agent with two drivers to place, the Paddock Post's diary columnist, an influencer filming everything - and the stars
// at the host's table. It is the after-party as it really happens: champagne, cocktails, shots, a bottle with
// sparklers, rounds sent over from another table, and what follows - an indiscreet line about the car, a row, a needle
// from the rival you touched on lap one, the ex walking in with somebody new, a drunk stranger with a full glass, a fan
// who will not take no, a columnist with very good ears. Romance with the twelve stars (all made up, all adults) stays
// PG: a dance, a flirt on the terrace, a kiss shown as a cut-away, leaving together and a goodnight at her hotel. Never
// in: nudity, anything sexual, drugs of any kind (not even implied), drink-driving (it is always a car, a taxi, the team
// car, the helicopter or the hotel), anyone under age drinking (21 in Nevada, 18 in England: the under-age get soft
// drinks), spiking, or anyone hurt in a scuffle. The real drivers come, network, toast with a glass, dance, banter and
// argue about the race - and are never drunk, never in a romance or a scandal, never in a fight: a row with one of them
// is words, and only ever 'a rival driver' in the papers. Drunkenness, romance, scandal and scuffles fall only on you,
// the invented stars, the invented juniors and custom drivers, and the invented people (reps, agents, the press, the
// public). Nothing here writes to the career: it is data and plain reads.
//
// =====================================================================================================================
// PUBLISHED CONTRACT (WP4-party-talk). Coded against by ui/Hangout.js (WP2), ui/PartyPlay.js (WP5) and career/Party.js
// (WP1). Keep it stable; a change goes here first.
// =====================================================================================================================
// VENUES   PARTY_VENUE_IDS = ['teamparty', 'vegasclub', 'londonclub']; isPartyVenue(id) -> bool. ui/HangoutTalk.js
//          switches to the party pool for these: PARTY_TOPICS plus the evening topics PARTY_KEEP lets through (the
//          timeless ones: no coffee, no dessert, no 'last time').
// GUEST    hangoutGuest(c, g, x) (ui/HangoutTalk.js) takes career/Party.js's launch Guest WHOLE (Hangout must pass
//          it through, not just { kind, id, name, team }):
//            g = { kind: 'driver'|'celeb'|'person', id, cid, name, team, role, tier, talk, age, soft, real, why,
//                  brand, clients: [did], title? }
//            role: drivers  'mate' | 'rival' | 'exmate' | 'friend' | 'present'
//                  stars    'partner' | 'celeb' | 'ex' | 'dj' (Jade Okafor on the decks)
//                  people   'rep' | 'agent' | 'press' | 'infl' | 'dj' | 'security' | 'bartender' | 'boss' | 'eng' |
//                           'antagonist' (and 'pr' / 'host' for the paps drama when PartyPlay makes one up)
//            cid:  'd:<did>' | 'c:<celebId>' | 'p:<role>:<id>' (p:rep:<brandId>, p:agent:<agentId>) | 'x:boss' |
//                  'x:eng' | 'x:pr' (a person's role is read from g.role, else the cid)
//          -> n: the evening's fields plus { cid, role, real, under (g.soft), present (talk 1) } and, for a person,
//             partyGuest's { title, why, tag (g.why), brand, brandName, product, likes (the brand's persona:
//             'showman'|'humble'|'confident'|'romance'|null), heatMax, deal (you hold one), offer (one is on your
//             desk), courting, contractual, clients (names), outlet }.
//            real: a real person (g.real; else every F1, Reserve and F2 driver, and unknown drivers to be safe); false
//            for the juniors, custom drivers, the stars and every invented person. under: g.soft, else (a driver at a
//            party) partyUnder(c, did, x) - career/Party.js's birthdays on the race's date.
// EVENING  x.party (read by the topics' when()): partyEvening(c, launch, x) fills the race side once - hangoutEvening
//          calls it for a party venue, with o.party (the launch: pass it) else the career's c.party.cur (partyLaunch's
//          record of the night under way: brand, contractual, act, guest roles, drama plan) and c.party.race; a field
//          nobody knows is left unset for PartyPlay (which fills only unset ones). PartyPlay keeps the live side current
//          on the same object (ev.x.party). Every field optional: a missing one only hides what needs it.
//            race:  { venue, kind: 'team'|'club', city (where you are: 'Silverstone' for its team party), gp, track,
//                     age (21|18), brand, brandName, contractual, act, pos, won, podium, dnf, scored, fought (did),
//                     foughtName, foughtReal, contact: [did], mateId, mateName, matePos (null when he retired),
//                     mateDnf, mateAhead, mateUnder, beatMate, feud, winnerName, exId, exName, exNew (the drama's
//                     invented man), partnerId, partnerHere, djName, under (launch.me.soft), meReal, london, phones
//                     (false in London: stickers on the cameras), plan (launch.drama) }
//            live:  { tier: 'sober'|'merry'|'tipsy'|'drunk', zone: 'floor'|'bar'|'vip'|'dj'|'quiet'|'door'|'garage'|
//                     'table'|null, private (this conversation is private: PartyPlay.isPrivate), clock (hours), late,
//                     lastCall, table, comped, parade, shoey, crewThanked, mechanics (arrived), speech (given),
//                     danced: [cid], flirted: [cid] (the stars you flirted or danced with tonight), kissed, seenDrunk,
//                     drama, dramaCid, photographed }
//          Privacy: at a party a star's romance topics need privacy. x.party.private === true -> private (the
//          terrace, a VIP corner, nobody within 3 m); === false -> in company; unset -> HangoutTalk's own rule (any
//          other name passed in n.other / x.other / x.others means company), so Hangout._open may simply pass no
//          other/others for a private talk, as the spec has it.
// TOPICS   PARTY_TOPICS: the evening topics' shape (who, w, when, where, quiet, crowd, open, opts with t / r / m / end /
//          then), plus:
//            who may hold 'person'; role: a role or [roles] the guest's n.role must be one of;
//            drama: <id> - offered ONLY while x.party.drama === id and (x.party.dramaCid is unset or === n.cid), and
//              while a drama is set for this guest nothing else is offered (the talk panel opens on it);
//            per option: when (x, n) (offered only then); m may be a function (x, n) -> number (a rep's persona: a
//              tone lands by the brand's taste - career/Party.js gives an offer at dm >= 4); act: a scene action for
//              PartyPlay; out: the drama's outcome; quote: the overheard drama's verdict; leak: true (car information).
//          A built tree carries .drama when it is a drama's (so PartyPlay can draw the red rule and record it).
// FX       option.fx (string or list) -> flags counted into g.fx and R.fx by Hangout._choose (HangoutTalk's whitelist
//          keeps them; HANGOUT_FX_TAG labels them; R.party.contacts[cid].fx carries them to career/Party.js):
//            flirt charm deep cover confess invite   (the evening's own)
//            network   a business connection made (the pitch landed, numbers swapped)
//            loose     an indiscreet line (leak: true when it gave away car information)
//            provoke   you escalated a row: PartyPlay -> a scuffle only with a fictional antagonist, else a verbal row
//            dance     you asked / agreed to dance: PartyPlay starts the dance strip with this guest
//            together  you agreed to leave together (a star, flirting or later): PartyPlay arms 'Leave with...'
//            kiss      the PG kiss (private: the cut-away; on the floor: the photographers may get it)
//            clear     the team-mate and you cleared the air (WP1: rapport +10, clears c.party.feud)
//            selfie    a selfie / a video / a photo for the brand: PartyPlay takes it (R.party.selfies)
//            shoey     you did the shoey: PartyPlay plays the moment (R.party.shoey)
//            calm      a row or drama defused (laughed off, apologised, walked away)
//            water     you switched to water for a bit: PartyPlay serves one water
// ACT      option.act (PartyPlay only, after the talk closes): 'side' (the side exit, now), 'front' (out the front, now),
//          'security' (security walks over), 'walk' (you walk away: the drama ends), 'car' (a car is called: drunk ->
//          the 'carried' exit, else the hotel), 'photo' (the wall / the house photographer), 'crew' (off to thank the
//          crew at the garage door), 'dj' (the DJ's shout-out), 'booth' (they come over to your booth), 'toast'
// OUT      option.out - career/Party.js's R.party.drama[].outcome, exactly: 'calm' | 'row' | 'scuffle' | 'walked'. The
//          LAST answer chosen in a drama talk decides it (a first answer's out is replaced by its follow-up's). 'scuffle'
//          is an escalation: PartyPlay starts the scuffle only when the drama's brawl is true (a fictional antagonist),
//          else it records 'row'. For 'feud', 'calm' clears the air (career/Party.js). quote (overheard only): false -
//          the columnist was talked out of it (PartyPlay drops the press cid from R.party.loose[].near); true - it runs.
// DRAMAS   PARTY_DRAMA { id: { label, who, role, brawl, also?, note } } - career/Party.js's planner ids: needle (the
//            rival you touched, a driver), feud (the team-mate, team orders), exnew (your ex walks in with an invented
//            man: drama.cid the man; drama.with the ex, who has her own version, as does a partner who saw you
//            looking), dateex (your date's tabloid ex, an invented man), spill (a drunk stranger), fan (a pushy fan),
//            overheard (the columnist heard a loose line), paps (your PR manager x:pr - or, with none, the door host or
//            security: photographers out front)
//          HangoutTalk.hangoutDrama(x, n, id) -> a built tree for that drama with this guest (or null: none fits); or
//          set x.party.drama / dramaCid and open the talk as usual (Hangout._open -> hangoutTalk offers only the drama;
//          if none fits the guest, the ordinary talk - the tree then has no .drama). Both take either spelling of an id
//          (PARTY_DRAMA_ALIAS: PartyPlay's tabex / selfie / overhear / sidedoor read as dateex / fan / overheard / paps;
//          dramaId(id) converts), and PARTY_DRAMA[alias] reads the same entry (non-enumerable).
// LOOSE    PARTY_LOOSE [{ id, leak, t: [lines], to?: 'celeb', when? }], PARTY_LOOSE_R (reactions by who hears it),
//          partyLooseFor(x, n) (raw); HangoutTalk.hangoutLoose(x, n) -> one built option { t, tone, r, m, fx: { loose:
//          true }, leak, loose: id } for PartyPlay.opts() to swap in (record R.party.loose: { near, leak }).
//          PARTY_SLIP: 'That came out wrong' lines.
// LINES    PARTY_BARK (short lines round the room), PARTY_MOMENT (letterbox captions), PARTY_PHONE (the 3 am text, her
//          reply, the buzz) - fill tokens with HangoutTalk.fillHangout(s, x, n). partyBye(x, n, dm) -> the goodbye line
//          at a party (HangoutTalk.hangoutBye calls it). partyTag(n) -> a person's name-tag line (g.why when given).
// TOKENS   (HangoutTalk's, plus) {brand} {product} {club} {city} {gp} {mate} {mateResult} {rival} {winner} {dj}
//          {client} {client2} {ex} {exnew} {me} {sur} {title} {outlet}
// =====================================================================================================================
import { BRAND_BY_ID } from '../career/PR.js';
import { CELEB } from '../career/Celebs.js';
import { REPS, ageOk } from '../career/Party.js';

// ---- small helpers -----------------------------------------------------------------------------------------------------
const firstOf = (s) => String(s || '').trim().split(' ')[0];
const lastOf = (s) => String(s || '').trim().split(' ').pop();
const pick = (a) => (Array.isArray(a) ? a[(Math.random() * a.length) | 0] : a);
const num = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// ---- the venues --------------------------------------------------------------------------------------------------------
export const PARTY_VENUE_IDS = ['teamparty', 'vegasclub', 'londonclub', 'poolclub'];   // (poolclub: a party only when launched as one - HangoutTalk's isPartyX)
/** a party venue (by id, or { id }) -> bool */
export function isPartyVenue(v) { const id = v && typeof v === 'object' ? v.id : v; return PARTY_VENUE_IDS.includes(id); }
const ALL = PARTY_VENUE_IDS, CLUBS = ['vegasclub', 'londonclub', 'poolclub'], TEAM = ['teamparty'], VEGAS = ['vegasclub'], LONDON = ['londonclub'];
// (how a guest says where you are, mid-sentence; how private each one is, as the venues have it)
export const PARTY_VENUE_WORD = { teamparty: 'the team party', vegasclub: 'Halo', londonclub: 'the Vault', poolclub: 'Tidewater' };
export const PARTY_PRIVACY = { teamparty: 0.65, vegasclub: 0.25, londonclub: 0.6, poolclub: 0.3 };

// ---- how things stand (each reads x.party, which may be missing) -----------------------------------------------------------
/**
 * The party context as the talk reads it -> x.party, with the race side (x.partyRace: partyEvening's, kept by
 * hangoutEvening) folded into it when PartyPlay has put a fresh object there (its constructor builds x.party anew), and
 * PartyPlay's names read as ours (underage -> under). Mutates x.party once per object; never allocates on a later call.
 */
export function partyOf(x) {
  if (!x) return {};
  const a = x.party && typeof x.party === 'object' ? x.party : null, b = x.partyRace && typeof x.partyRace === 'object' ? x.partyRace : null;
  if (!a) return b || {};
  if (b && a !== b && a._race !== b) {
    for (const k of Object.keys(b)) if (a[k] === undefined || (k === 'danced' && !a[k]?.length && b[k]?.length)) a[k] = b[k];
    Object.defineProperty(a, '_race', { value: b, enumerable: false, configurable: true, writable: true });
  }
  if (a.underage !== undefined && a.under !== !!a.underage) a.under = !!a.underage;
  return a;
}
const P = partyOf;
/** the drama ids by other names (ui/PartyPlay.js's spelling, the spec's first draft) -> career/Party.js's */
export const PARTY_DRAMA_ALIAS = { tabloidex: 'dateex', tabex: 'dateex', selfie: 'fan', sidedoor: 'paps', overhear: 'overheard' };
/** a drama id as career/Party.js has it */
export const dramaId = (id) => (id ? PARTY_DRAMA_ALIAS[id] || id : null);
const TIER = { sober: 0, merry: 1, tipsy: 2, drunk: 3 };
/** how far gone you are: 0 sober, 1 merry, 2 tipsy, 3 drunk */
const tier = (x) => TIER[P(x).tier] || 0;
const club = (x) => CLUBS.includes(x.venue);
const team = (x) => x.venue === 'teamparty';
const lpos = (x) => num(P(x).pos) ?? num(x.lastPos);
const dnf = (x) => (P(x).dnf != null ? !!P(x).dnf : !!x.lastDnf || lpos(x) === 0);
const won = (x) => (P(x).won != null ? !!P(x).won : !dnf(x) && lpos(x) === 1);
const podium = (x) => (P(x).podium != null ? !!P(x).podium : !dnf(x) && lpos(x) >= 1 && lpos(x) <= 3);
const points = (x) => !dnf(x) && lpos(x) >= 4 && lpos(x) <= 10;
const backmarker = (x) => !dnf(x) && lpos(x) > 10;
/** you are old enough to drink here */
const adult = (x) => !P(x).under;
/** the guest is old enough to drink here (a driver under 21 in Nevada: soft drinks) */
const grown = (n) => !n.under;
const role = (n, ...r) => r.includes(n.role);
/** a real person (the talk keeps them to the job: never drunk, never romance, never a scandal) */
const real = (n) => n.real !== false;
const isStar = (n) => n.kind === 'celeb' || n.kind === 'star' || !!n.celebId;
const st = (n) => n.stage || (isStar(n) ? 'met' : 'friendly');
const at = (n, ...s) => s.includes(st(n));
/** more than friendship with her */
const rom = (n) => at(n, 'flirting', 'dating', 'partner');
/** not an ex, not someone she has fallen out with */
const easy = (n) => st(n) !== 'ex' && !n.grieving;
/** this conversation is private (the terrace, a VIP corner: nobody within earshot) */
const priv = (x) => P(x).private === true || P(x).zone === 'quiet';
const ok = (x) => !x.grave;
/** the conversation's own guest is the star you are seeing who is here as your partner */
const isPartner = (x, n) => !!n.celebId && (n.role === 'partner' || P(x).partnerId === n.celebId);
const isEx = (x, n) => !!n.celebId && (n.role === 'ex' || st(n) === 'ex' || P(x).exId === n.celebId);
const late = (x) => !!x.late || !!P(x).late || !!P(x).lastCall;

// =====================================================================================================================
// the people: titles, and partyGuest - what the talk knows about a person guest (plain reads)
// =====================================================================================================================
/** what each kind of person does, on the name tag (a rep's title comes from the launch, else this) */
export const PARTY_TITLE = { rep: 'Head of athlete marketing', agent: 'Driver manager', press: 'Diary columnist', infl: 'Content creator', dj: 'Resident DJ', security: 'Security', boss: 'Team principal', eng: 'Race engineer', pr: 'Your PR manager', host: 'Door host', bartender: 'Bartender', antagonist: '' };
/** why they matter, the second line of a name tag ('could offer a deal'; the launch's own g.why wins) */
export const PARTY_WHY = { rep: 'could offer a deal', agent: 'knows who is moving', press: 'writes Monday\'s diary', infl: 'films everything', dj: 'runs the room', security: 'keeps the peace', boss: 'is watching', eng: 'your voice on the radio', pr: 'keeps you out of the papers', host: 'knows your face' };
const realFrom = new Set(['F1', 'Reserve', 'F2']);
/** a driver record (c.drivers[id]) is a real person: the grid, the reserves, F2 - unknown counts as real, to be safe */
export function realDriver(d) { return !d || !d.from ? true : realFrom.has(d.from); }
/**
 * A driver is under the drinking age at this party (21 in Nevada, 18 in England) on the race's date, by career/Party.js's
 * birthdays (an unknown reserve or F2 age counts as under 21 in the US) - for a guest whose launch entry did not say
 * (g.soft). -> bool (no career or no race: false)
 */
export function partyUnder(c, did, x = {}) {
  try { const p = partyOf(x), t = p.track || c?.party?.race?.track; return !!(c && did && t) && !ageOk(c, did, t, c?.party?.race?.season); } catch (_) { return false; }
}

/**
 * A person guest as the talk reads them (n's extra fields), from the launch guest (g) and the career (c): role from
 * g.role else the cid ('p:rep:ampwave' -> 'rep'), a rep's brand (g.brand, the cid, else the night's host brand) with
 * its name, product, persona (likes) and morality clause (heatMax), whether you hold a deal with it or have its offer,
 * whether tonight is a contractual appearance for it; an agent's clients (g.clients: names); the columnist's outlet.
 * -> { kind: 'person', cid, role, id, name, first, title, why, real: false, ... }
 */
export function partyGuest(c, g = {}, x = {}) {
  const cid = String(g.cid || ''), bits = cid.split(':');
  const r = g.role || (bits[0] === 'p' || bits[0] === 'x' ? bits[1] : null) || 'guest';
  const name = g.name || PARTY_TITLE[r] || 'A guest';
  const n = { kind: 'person', cid: cid || `p:${r}${g.id ? ':' + g.id : ''}`, role: r, id: g.id || bits[2] || null, name, first: firstOf(name), real: false,
    title: g.title || PARTY_TITLE[r] || '', why: PARTY_WHY[r] || '', tag: g.why || '', talks: g.talks || 0 };
  if (g.talk === 1) n.present = true;
  try {
    if (r === 'rep') {
      const bid = g.brand || bits[2] || P(x).brand || null, B = bid ? BRAND_BY_ID[bid] : null, PR = c?.pr || {};
      Object.assign(n, { brand: bid, brandName: B?.brand || g.brandName || null, product: B?.kind || null, likes: B ? B.likes ?? null : null, heatMax: B ? B.heatMax : 100,
        deal: !!(PR.deals || []).some((d) => d.bid === bid), offer: !!(PR.offers || []).some((o) => o.bid === bid) });
      if (!g.title && bid && REPS?.[bid]?.title) n.title = REPS[bid].title;
      n.courting = g.courting ?? !n.deal; n.contractual = !!(P(x).contractual && P(x).brand === bid) || !!g.contractual;
    } else if (r === 'agent') {
      n.clients = (Array.isArray(g.clients) ? g.clients : []).map((v) => (typeof v === 'string' && c?.drivers?.[v] ? c.drivers[v].name : v)).filter(Boolean);
    } else if (r === 'press') n.outlet = g.outlet || ({ kemble: 'The Paddock Post', reid: 'Chequered', pryce: 'RACE 24' })[n.id] || 'The Paddock Post';
    else if (r === 'infl') n.followers = g.followers || null;
  } catch (e) { console.warn('PartyTalk: could not read a guest', g, e); }
  return n;
}

/**
 * The party's side of the evening (x.party, race part) from the launch (career/Party.js's Launch: { key: 'party',
 * partyId, venue, brand, brandName, contractual, track, gp, act, me: { soft, ... }, race: RaceSnap, guests, drama })
 * and the career (c.party.race when no launch is passed; c.party.feud; c.drivers). With no launch passed, the career's
 * own record of the night under way stands in for it (c.party.cur, set by partyLaunch: brand, contractual, act, the
 * guests' roles, the drama plan) when it is this venue's, this round's; a field nobody knows is left unset, so
 * PartyPlay's own (it fills only what is unset) can still go in. Keeps whatever live fields x.party already has.
 * -> x.party
 */
export function partyEvening(c, launch = null, x = {}) {
  const Q = (x.party && typeof x.party === 'object') ? x.party : {};
  const v0 = (typeof x.venue === 'string' && x.venue) || (launch && typeof launch === 'object' ? (launch.venue && typeof launch.venue === 'object' ? launch.venue.id : launch.venue) : null) || null;
  const K = !(launch && typeof launch === 'object') && c?.party?.cur && typeof c.party.cur === 'object' ? c.party.cur : null;
  const cur = K && (!v0 || K.venue === v0) && (!K.at || (K.at.season === c.season && K.at.round === c.round)) ? K : null;
  const L = launch && typeof launch === 'object' ? launch : cur ? { partyId: cur.id, venue: cur.venue, brand: cur.brand ?? null, contractual: cur.contractual, act: cur.act, guests: cur.guests, drama: cur.drama } : {};
  const known = !!((launch && typeof launch === 'object') || cur);
  const S = (L.race && typeof L.race === 'object' ? L.race : null) || (c?.party?.race && typeof c.party.race === 'object' ? c.party.race : {}) || {};
  const venue = v0 || (L.venue && typeof L.venue === 'object' ? L.venue.id : L.venue) || null;
  const D = c?.drivers || {}, gs = (Array.isArray(L.guests) ? L.guests : []).filter(Boolean), plan = Array.isArray(L.drama) ? L.drama.filter(Boolean) : (Q.plan || []);
  const idOf = (v) => (v && typeof v === 'object' ? v.id || v.did || null : v || null);
  const track = idOf(L.track) || S.track || null;
  // (the city where you are: the club's, else the circuit's - the team party at Silverstone is at Silverstone, not London)
  const city = venue === 'londonclub' ? 'London' : venue === 'vegasclub' ? 'Las Vegas' : track === 'silverstone' ? 'Silverstone' : track === 'lasvegas' ? 'Las Vegas' : track === 'montreal' ? 'Montreal' : (S.city || x.track || null);
  const gp = L.gp || S.gp || { lasvegas: 'Las Vegas Grand Prix', silverstone: 'British Grand Prix', montreal: 'Canadian Grand Prix' }[track] || null;
  const offer = Array.isArray(c?.party?.offers) ? c.party.offers.find((o) => o && (o.id === L.partyId)) : null;
  const brand = L.brand || offer?.brand || null, B = brand ? BRAND_BY_ID[brand] : null;
  // (under age here - you: the launch says, else the career's birthday on the race's date; a driver guest: his soft drinks)
  const soft = (g) => { try { return g ? (typeof g.soft === 'boolean' ? g.soft : g.kind === 'driver' && g.id && c && track ? !ageOk(c, g.id, track, S.season) : false) : false; } catch (_) { return false; } };
  let meUnder = L.me?.soft ?? L.under ?? S.under;
  if (meUnder == null && c?.playerId && track) { try { meUnder = !ageOk(c, c.playerId, track, S.season); } catch (_) { meUnder = undefined; } }
  const meD = c?.drivers?.[c?.playerId];
  const pos = num(S.pos) ?? num(x.lastPos), sdnf = S.dnf != null ? !!S.dnf : !!x.lastDnf;
  // (the driver you fought, else the first you touched; your team-mate as the snapshot has him: matePos 0 is his DNF)
  const contacts = [].concat(S.contacts ?? S.contact ?? []).map(idOf).filter((v) => typeof v === 'string' && v);
  const fought = idOf(S.fought) || contacts[0] || null;
  const mateId = idOf(S.mate) || (() => { try { const T = c?.teams?.[c.myTeam]; return T ? T.seats.find((i) => i !== c.playerId) || null : null; } catch (_) { return null; } })();
  const mp = num(S.matePos), mateDnf = mp === 0, matePos = mp ? mp : null, mateAhead = S.mateAhead != null ? !!S.mateAhead : (pos != null && matePos != null && !sdnf ? matePos < pos : sdnf && matePos != null);
  const role = (r) => gs.find((v) => v.role === r) || null, byCid = (cid) => (cid ? gs.find((v) => v.cid === cid) || null : null);
  const exG = role('ex'), partG = role('partner'), djG = role('dj');
  const exnewD = plan.find((d) => d && d.id === 'exnew'), exnewG = exnewD ? byCid(exnewD.cid) : null, exOfD = exnewD ? byCid(exnewD.with) : null;
  const winner = idOf(S.winner);
  const R = Object.assign(Q, {
    venue, kind: venue === 'teamparty' ? 'team' : 'club', city, gp, track, age: venue === 'londonclub' || (venue === 'teamparty' && (track === 'silverstone' || track === 'montreal')) ? 18 : 21,
    pos, dnf: sdnf, won: S.won != null ? !!S.won : !sdnf && pos === 1, podium: S.podium != null ? !!S.podium : !sdnf && pos >= 1 && pos <= 3,
    scored: S.points != null ? !!S.points : !sdnf && pos >= 1 && pos <= 10,
    fought, foughtName: fought ? D[fought]?.name || null : null, foughtReal: fought ? realDriver(D[fought]) : true, contact: contacts,
    mateId, mateName: mateId ? D[mateId]?.name || null : null, matePos, mateDnf, mateAhead, mateUnder: soft(role('mate') || (mateId ? { kind: 'driver', id: mateId } : null)),
    beatMate: pos != null && !sdnf && !mateAhead,
    feud: !!(S.feud || (mateId && c?.party?.feud && c.party.feud[mateId] != null)),
    winnerName: S.winnerName || (winner ? D[winner]?.name || null : null),
    exId: (exOfD || exG) ? idOf(exOfD || exG) : null, exName: (exOfD || exG) ? (exOfD || exG).name || CELEB[idOf(exOfD || exG)]?.name || null : null, exNew: exnewG ? exnewG.name || null : null,
    partnerId: partG ? partG.id || null : S.partner || null, djName: djG ? djG.name || null : (Q.djName || null),
    london: venue === 'londonclub', phones: venue !== 'londonclub', plan,
  });
  // (what only the launch knows - set when known, else left for PartyPlay's own to fill; a value already there is kept)
  const put = (k, v) => { if (v !== undefined && v !== null) R[k] = v; else if (R[k] === undefined && known) R[k] = v ?? null; };
  put('brand', brand || (known ? null : undefined)); put('brandName', B?.brand || L.brandName || (brand || known ? null : undefined));
  put('contractual', L.contractual != null || offer?.contractual != null ? !!(L.contractual ?? offer?.contractual) : known ? false : undefined);
  put('act', L.act || (known ? 1 : undefined)); put('partnerHere', known ? !!partG : undefined);
  put('under', meUnder == null ? undefined : !!meUnder); put('meReal', L.me?.real != null ? !!L.me.real : meD ? realFrom.has(meD.from) : undefined);
  for (const k of ['tier', 'zone']) if (R[k] === undefined) R[k] = k === 'tier' ? 'sober' : null;
  if (!Array.isArray(R.danced)) R.danced = []; if (!Array.isArray(R.flirted)) R.flirted = [];
  return R;
}

// =====================================================================================================================
// which of the evening topics still fit at a party (HangoutTalk merges these: true, or an extra when())
// =====================================================================================================================
export const PARTY_KEEP = {
  // (the drivers: the job and the life, never 'a few days later', never coffee or dessert)
  dSim: true, dGames: true, dMusic: true, dFitness: true, dTravel: true, dNerves: true, dTeamLife: true, dSilly: true, dPranks: true, dWinter: true,
  dCircuits: true, dKarting: true, dMedia: true, dBest: true, dAdvice: true, dWingman: true, dPoints: true, dCrisis: true,
  // (her: who she is, where it is going, the juggling - never the café or the dinner table)
  cWork: true, cJob: true, cAmbition: true, cHome: true, cFamily: true, cWhyRacing: true, cCompliment: true, cUs: true, cOfficial: true, cPartner: true,
  cMoment: true, cInvite: true, cPhoto: true, cWhoTexting: true, cHints: true, cHonest: true, cRules: true, cFree: true,
  cTheOther: (x) => !P(x).partnerHere,
  sigMira: true, sigLena: true, sigNoor: true, sigAva: true, sigElena: true, sigPriya: true, sigTessa: true, sigZoe: true,
};

// =====================================================================================================================
// the dramas (career/Party.js plans at most two; PartyPlay's director opens them)
// =====================================================================================================================
// (career/Party.js's planner ids; who: the kind of guest the drama is had with - drama.cid; also: other guests with their
// own version of it (drama.with); brawl: 'fictional' - an escalation can become the scuffle, never with a real person)
export const PARTY_DRAMA = {
  needle: { label: 'The rival', who: 'driver', role: 'rival', brawl: 'fictional', note: 'the driver you touched or fought in the race needles you; a real driver: words only' },
  feud: { label: 'Team orders', who: 'driver', role: 'mate', brawl: 'fictional', note: 'your team-mate, after the call on the pit wall: clear the air (outcome calm, fx clear) or a cold war' },
  exnew: { label: 'Your ex, and someone new', who: 'person', role: 'antagonist', brawl: 'fictional', also: ['celeb: the ex (drama.with)', 'celeb: your partner, who saw you looking'], note: 'your ex walks in with an invented man' },
  dateex: { label: 'Her tabloid ex', who: 'person', role: 'antagonist', brawl: 'fictional', note: 'your date\'s ex from the tabloids (an invented man) gets mouthy' },
  spill: { label: 'A drunk stranger', who: 'person', role: 'antagonist', brawl: 'fictional', note: 'a full glass down your shirt, then an argument' },
  fan: { label: 'A pushy fan', who: 'person', role: 'antagonist', brawl: 'fictional', note: 'an arm round your neck and a phone in your face' },
  overheard: { label: 'The columnist', who: 'person', role: 'press', brawl: false, note: 'the Paddock Post heard your loose line: the answer\'s quote says whether it runs (false: drop the press from R.party.loose[].near)' },
  paps: { label: 'Photographers out front', who: 'person', role: 'pr', brawl: false, also: ['person: the door host or security when you have no PR manager'], note: 'your PR manager (x:pr): use the side door' },
};
// (the other spellings read the same entry - PARTY_DRAMA.tabex is PARTY_DRAMA.dateex - without showing up in a listing)
for (const [a, id] of Object.entries(PARTY_DRAMA_ALIAS)) if (PARTY_DRAMA[id] && !(a in PARTY_DRAMA)) Object.defineProperty(PARTY_DRAMA, a, { value: PARTY_DRAMA[id], enumerable: false });

// =====================================================================================================================
// the topics
// =====================================================================================================================
// (a rep's persona, as career/PR.js's brand 'likes' has it: what each tone is worth to them; a conservative brand
// (morality clause 60 or under) likes it a point less when you have had a few)
const PM = {
  showman: { show: 3, light: 2, flirt: 1, kind: 1, firm: 0, sorry: 0, gossip: 1, cold: -2, cruel: -4 },
  humble: { kind: 3, firm: 2, sorry: 2, light: 1, show: -2, flirt: -1, gossip: -2, cold: -2, cruel: -5 },
  confident: { firm: 3, show: 2, light: 1, kind: 1, flirt: 0, sorry: 0, gossip: 0, cold: -1, cruel: -4 },
  romance: { flirt: 2, kind: 2, show: 1, light: 1, firm: 1, sorry: 1, gossip: 0, cold: -2, cruel: -4 },
  none: { kind: 2, light: 2, firm: 1, show: 1, flirt: 0, sorry: 1, gossip: 0, cold: -1, cruel: -4 },
};
/** what a tone is worth to this rep -> an m function */
const fitM = (tone, bonus = 0) => (x, n) => ((PM[n.likes] || PM.none)[tone] ?? 0) + bonus - (tier(x) >= 2 && (n.heatMax ?? 100) <= 60 ? 1 : 0);
/** a careful brand's people (morality clause 60 or under) once you have had a few: they are only saying goodnight (repCool) */
const cool = (x, n) => tier(x) >= 2 && (n.heatMax ?? 100) <= 60;

export const PARTY_TOPICS = [
  // =====================================================================================================================
  // the drivers: the race just run, the night, the job (a real driver is never drunk, never in a romance or a scandal)
  // =====================================================================================================================
  // ---- you won tonight ------------------------------------------------------------------------------------------------------
  { id: 'pdWin', who: ['driver'], where: ALL, w: 7, when: (x, n) => ok(x) && won(x) && !(n.talks > 1), open: [
    "There he is. Race winner. Can I touch you, or is there a fee now?", "{city}! You actually did it. I've been trying to get to you for an hour.", "Look at you. Nobody's getting any sense out of you tonight, are they?", "I watched the last ten laps on the screen in our garage. Everyone went quiet. Then everyone shouted." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Thanks. Honestly, the team did it. I just steered.", "Couldn't have done it without the crew. Or that strategy call."], r: ["Rubbish. You drove it like it was stolen. Fair play.", "That's the right answer. The wrong one is more fun."], then: { say: ["Go on - when did you know? Really know?", "When did you let yourself believe it?"], opts: [
        { tone: 'firm', t: ["The flag. Not one corner before.", "Not until I crossed the line. Never before."], r: ["Proper. Never count it.", "Ha. Same superstition."] },
        { tone: 'light', t: ["About lap three. Then I panicked for the rest of it.", "When my engineer's voice went funny on the radio."], r: ["Ha! Lap three!", "Ha. That's the best radio there is."] },
        { tone: 'kind', fx: 'deep', t: ["Honestly? It hasn't landed. Not even now.", "I don't think it's sunk in yet. Ask me tomorrow."], r: ["It lands at about four in the morning. Enjoy that.", "It lands on the plane. Every time."] },
        { tone: 'show', t: ["Before the start. I knew.", "When I saw the gap after the first stop. The rest was paperwork."], r: ["Course you did.", "Ha. Listen to him."] } ] } },
      { tone: 'show', t: ["Get used to it. I'm going to be insufferable.", "First of many. Write it down."], r: ["You already are.", "Noted. Shocking handwriting, though."] },
      { tone: 'light', t: ["A fee, yes. Selfies are extra.", "One touch. Then you go through my agent."], r: ["Ha. Put it on my tab.", "Ha. Unbelievable."] },
      { tone: 'firm', t: ["Tonight's tonight. Monday it's the next one.", "Enjoy it tonight. Back to work on Monday."], r: ["Sensible. Boring. Respect.", "Fair. But tonight is tonight."] },
    ] },
  // ---- a podium tonight -------------------------------------------------------------------------------------------------------
  { id: 'pdPodium', who: ['driver'], where: ALL, w: 6, when: (x, n) => ok(x) && podium(x) && !won(x) && !(n.talks > 1), open: [
    "{result}! Look at you. Trophy and everything.", "Podium. Did you spray the champagne or drink it?", "Proper drive tonight. Proper.", "Saw you on the podium. You looked like you'd been told a joke you didn't get." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Thanks. The car was mega tonight. The team deserve it.", "Thanks. I'll take it. The team earned that one."], r: ["Still had to drive it, though.", "Yeah. They did. So did you."], then: { say: ["Was there a win in it? Honestly?", "Could you have had the top step?"], opts: [
        { tone: 'firm', t: ["No. Not tonight. Next time.", "Maybe with a better restart. Maybe."], r: ["Honest.", "There's always a maybe."] },
        { tone: 'show', t: ["Two more laps and I'd have had him.", "Ten more laps and it's mine."], r: ["Ten laps. Sure.", "Course it is."] },
        { tone: 'light', t: ["Only if everyone ahead had got lost.", "If I'd started a lap earlier."], r: ["Ha. Valid.", "Ha. Cheating."] } ] } },
      { tone: 'light', t: ["Sprayed it. Most of it went in my ear.", "Both. Mostly up my nose."], r: ["Ha! Rookie.", "Ha. Classic."] },
      { tone: 'show', t: ["Wrong step. I'll fix that.", "The top step's next. Mark my words."], r: ["Ooh. Confident.", "Ha. Big words."] },
      { tone: 'firm', t: ["Good points. That's what counts.", "Good points. It's a long season."], r: ["Spoken like a champion. A boring one.", "True."] },
    ] },
  // ---- points tonight -----------------------------------------------------------------------------------------------------------
  { id: 'pdPoints', who: ['driver'], where: ALL, w: 5, when: (x, n) => ok(x) && points(x) && !(n.talks > 1), open: [
    "{result} tonight. Solid. Points are points.", "Decent drive. Did you see anything of the front?", "{result}. Quiet night at the office?", "You and me were in the same postcode for half that race." ],
    opts: [
      { tone: 'firm', t: ["Took what the car had. Happy enough.", "That was the maximum tonight. I'll take it."], r: ["That's all you can do.", "Fair. Maximum's maximum."], then: { say: ["Where was the time? Honestly?", "What was missing?"], opts: [
        { tone: 'firm', t: ["Qualifying. Start higher and the race looks after itself.", "Traction out of the slow stuff. We're nowhere there."], r: ["Always qualifying.", "Same as us, then."] },
        { tone: 'light', t: ["The driver. Mostly the driver. A bit the car.", "Somewhere between the pit wall and my right foot."], r: ["Ha. Honest.", "Ha. Narrows it down."] },
        { tone: 'kind', t: ["Nowhere. We got everything out of it. The team were spot on.", "Nothing. Good stops, good call. Proud of them."], r: ["Then that's a good night.", "Fair."] } ] } },
      { tone: 'light', t: ["Quiet? I was shouting in my helmet for an hour and a half.", "Saw the front once. On the big screen after the flag."], r: ["Ha! I bet you were.", "Ha. Same."] },
      { tone: 'show', t: ["Ten more laps and I'm on the podium.", "That middle stint was the best driving on the grid. Write it down."], r: ["Ten more laps. Sure.", "Noted. In very small writing."] },
      { tone: 'kind', t: ["Good points for the team. That's tonight done.", "Every point counts by the end of the year."], r: ["True. They add up.", "Yeah. They do."] },
    ] },
  // ---- a long night at the back -----------------------------------------------------------------------------------------------------
  { id: 'pdBack', who: ['driver'], where: ALL, w: 4, when: (x, n) => ok(x) && backmarker(x) && !(n.talks > 1), open: [
    "{result}? Rough. What happened?", "You looked like you were fighting it all night.", "Not your night, was it?" ],
    opts: [
      { tone: 'kind', t: ["Not our night. We'll find it. Being here helps.", "Rough one. Thanks for asking."], r: ["Good. That's what tonight's for.", "Course."] },
      { tone: 'firm', t: ["No grip, no pace, no excuses. Next one.", "We were slow. Simple as that. We'll fix it."], r: ["Proper answer.", "Fair."] },
      { tone: 'light', t: ["I had a lovely view of everyone's rear wing.", "I've seen more of the pit lane than my own flat this year."], r: ["Ha. Grim.", "Ha. Glamorous."] },
      { tone: 'cold', t: ["I'd rather not, tonight.", "Can we talk about anything else?"], r: ["Course.", "Course. Anything."] },
    ] },
  // ---- a retirement tonight: drinks to forget ----------------------------------------------------------------------------------------
  { id: 'pdDnf', who: ['driver'], where: ALL, w: 7, when: (x, n) => ok(x) && dnf(x) && !(n.talks > 1), open: [
    "Sorry about tonight, mate. Rotten luck.", "I saw you parked up. Grim. Come on - tonight's for forgetting.", "What happened out there? Actually, don't tell me. Tomorrow.", "Retirement's the worst. You do all that and walk back with your helmet in your hand." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Thanks. It stings. Being out helps, honestly.", "It hurts more than I'm letting on. Thanks for saying something."], r: ["Course. That's what tonight's for.", "It always does. You'll be alright."], then: { say: ["Car or you? You don't have to answer.", "Was it the car, or one of those?"], opts: [
        { tone: 'firm', t: ["The car. Nothing I could do.", "Car. It just stopped. No warning."], r: ["Then it's not on you. Remember that.", "Brutal. Nothing you can do with that."] },
        { tone: 'sorry', t: ["Me. I got it wrong. I'll own it.", "Me, honestly. I asked too much of it."], r: ["Takes a lot to say that. Respect.", "We've all done it. Next one."] },
        { tone: 'light', t: ["Neither. A pigeon. I'm sticking with the pigeon.", "Gremlins. Small ones. With spanners."], r: ["Ha. The pigeon did it.", "Ha. Always gremlins."] } ] } },
      { tone: 'light', t: ["I've decided it didn't happen. Tonight I'm a race winner.", "Retired? I prefer 'saved the tyres for next time'."], r: ["Ha. That's the spirit.", "Ha! Strategy."] },
      { tone: 'firm', t: ["It's done. Next race.", "Nothing to say. We go again."], r: ["Right attitude.", "That's the only way."] },
      { tone: 'cold', t: ["Can we not talk about it?", "Not tonight. Please."], r: ["Yeah. Fair. Sorry.", "Course."] },
    ] },
  // ---- the winner, when it was not you ---------------------------------------------------------------------------------------------
  { id: 'pdWinner', who: ['driver'], where: ALL, w: 2, when: (x, n) => ok(x) && !won(x) && !!P(x).winnerName && P(x).winnerName !== n.name, open: [
    "Did you see {winner}'s last stint? Unreal pace.", "{winner} again. Somebody has to beat him eventually.", "Be honest: could anyone have lived with {winner} tonight?" ],
    opts: [
      { tone: 'kind', t: ["Fair play to him. Quicker than all of us tonight.", "He earned that one. Credit where it's due."], r: ["Yeah. Annoyingly.", "Yeah. Credit where it's due."] },
      { tone: 'firm', t: ["Next time. We're closer than it looked.", "Gap's coming down. You'll see."], r: ["Hope so. For all our sakes.", "We'll see."] },
      { tone: 'light', t: ["I'm going to ask him what he eats. Then eat that.", "I'm hiding his car keys before the next one."], r: ["Ha. Probably porridge.", "Ha. Not the worst plan."] },
      { tone: 'gossip', t: ["Did you see the team celebrating? Like they'd never won before.", "His engineer was crying on the pit wall. Crying."], r: ["Ha. Fair, though.", "Ha. Leave the man alone."] },
    ] },
  // ---- the first corner ---------------------------------------------------------------------------------------------------------
  { id: 'pdTurnOne', who: ['driver'], where: ALL, w: 2, when: (x) => ok(x), open: [
    "That first corner tonight. Did anyone actually see what happened?", "I went into Turn 1 fourth and came out of it ninth. I still don't know how.", "Is it me, or does everyone forget how to brake on lap one?" ],
    opts: [
      { tone: 'light', t: ["I closed my eyes. When I opened them, I was in the lead. Briefly.", "I saw a lot of wing endplates. In the air."], r: ["Ha. The only way.", "Ha. Carnage."] },
      { tone: 'firm', t: ["Everyone braked late and hoped. Same every week.", "Lap one's a lottery. You just try not to be the one who causes it."], r: ["Yeah. Pretty much.", "True. Every week."] },
      { tone: 'show', t: ["I made up three places. Watch the replay.", "Best start of the night. Not even close."], r: ["Ha. I watched it. You made up one.", "Big claims."] },
      { tone: 'kind', t: ["Glad everyone got through it in one piece.", "Messy, but everyone walked away. That's what matters."], r: ["Yeah. Always.", "True."] },
    ] },
  // ---- the club ----------------------------------------------------------------------------------------------------------------------
  { id: 'pdClub', who: ['driver'], where: CLUBS, w: 2.5, when: (x) => ok(x), open: [
    "Who picked this place? It's mental. In a good way.", "The DJ's actually good. I came for twenty minutes. That was an hour ago.", "I've lost my team-mate. Again. If you see him, he owes me a drink.", "Is it just me, or is every driver on the grid in this room?" ],
    opts: [
      { tone: 'light', t: ["Twenty minutes. That's what everyone says.", "We're all in here. The paddock just moved indoors."], r: ["Ha. Then it's four in the morning.", "Ha. Same faces, louder music."] },
      { tone: 'kind', t: ["Good to see you away from the track. Properly.", "It's nice. Everyone actually talking to each other."], r: ["Yeah. Same. Without the helmets.", "Yeah. Rare, that."] },
      { tone: 'firm', t: ["One more hour, then I'm gone. Flying tomorrow.", "I'm pacing myself. Long week."], r: ["Sensible. Boring, but sensible.", "Fair."] },
      { tone: 'show', t: ["They gave me the best table. Come and see.", "The DJ shouted me out earlier. Did you hear?"], r: ["Ha. Course they did.", "Ha. I heard. Everyone heard."] },
    ] },
  // ---- dancing (with a driver it is just mates) ---------------------------------------------------------------------------------------
  { id: 'pdDance', who: ['driver'], where: CLUBS, w: 2, when: (x, n) => ok(x) && (P(x).zone === 'floor' || n.talks > 0), open: [
    "Are you dancing, or are you just going to stand there holding that?", "Come on. One song. Nobody's filming. ...Everyone's filming.", "I've been told I dance like I drive. Smooth and slightly too late." ],
    opts: [
      { tone: 'light', fx: 'dance', t: ["Go on, then. One song.", "Fine. But if anyone films it, I'm blaming you."], r: ["Ha! Get in.", "Deal."] },
      { tone: 'show', fx: 'dance', t: ["Watch and learn.", "Try and keep up."], r: ["Ha. Here we go.", "Oh, it's on."] },
      { tone: 'firm', t: ["Not a chance. I'm a professional.", "I don't dance. I've got a reputation."], r: ["Boring.", "Ha. What reputation?"] },
      { tone: 'kind', t: ["Later. I promise. After this one.", "Give me ten minutes. I'll find you."], r: ["You'd better.", "I'm holding you to it."] },
    ] },
  // ---- the flight home (everyone flies tomorrow) ------------------------------------------------------------------------------------------
  { id: 'pdFlight', who: ['driver'], where: ALL, w: 1.6, when: (x) => ok(x), open: [
    "What time's your flight? Mine's at nine. I'm going to regret every minute of this.", "Where are you off to tomorrow? Home, or the simulator?", "Sim on Tuesday, then a factory day. Glamorous life, this." ],
    opts: [
      { tone: 'firm', t: ["Early. Then straight into the simulator.", "Seven. Sleep on the plane, debrief on the way in."], r: ["Brutal.", "Professional. Respect."] },
      { tone: 'light', t: ["I've decided flights are optional.", "I'm sleeping on the plane. And in the car. And in the debrief."], r: ["Ha. Tell your team that.", "Ha. Skill."] },
      { tone: 'kind', t: ["Home for two days. Seeing everyone.", "Home. Proper bed. Can't wait."], r: ["Lucky. Enjoy it.", "Nice."] },
      { tone: 'show', t: ["Private. Leaving whenever I like.", "Whenever I fancy. One of the perks."], r: ["Ha. Course it is.", "Listen to this."] },
    ] },
  // ---- the table (when you have one) --------------------------------------------------------------------------------------------------
  { id: 'pdTable', who: ['driver'], where: CLUBS, w: 2, when: (x) => ok(x) && !!P(x).table, open: [
    "Nice table. Did they comp it, or are you paying for all this?", "Sparklers, a sign with your number on it - subtle as ever.", "Your table's got a better view than my hotel room." ],
    opts: [
      { tone: 'light', t: ["Comped. Apparently my face is worth a table.", "Don't ask. My accountant will find out on Monday."], r: ["Ha. Your face. Wow.", "Ha. Poor accountant."] },
      { tone: 'kind', fx: 'invite', t: ["Sit down. It's your table too tonight.", "Grab a seat. Bring whoever you like."], r: ["Don't mind if I do.", "Legend."] },
      { tone: 'show', t: ["Biggest table in the room. Obviously.", "They wanted me here. Who am I to argue?"], r: ["Ha. Obviously.", "Ha. Course they did."] },
      { tone: 'firm', t: ["Sponsor's table. I'm working, technically.", "It's for the team. I'm just keeping it warm."], r: ["Hard life.", "Ha. Very generous."] },
    ] },
  // ---- a sober friend, watching your pace ---------------------------------------------------------------------------------------------
  { id: 'pdPace', who: ['driver'], where: ALL, w: 6, when: (x) => ok(x) && tier(x) >= 2, open: [
    "How many's that? Honestly. You've got the face.", "You alright? You're... very happy.", "Mate. Water. Trust me.", "You're going to feel this in the morning. Just saying." ],
    opts: [
      { tone: 'kind', fx: 'water', t: ["You're right. Water. Then one more. Then water.", "Fair. I'll get a water."], r: ["Good man.", "Smart."] },
      { tone: 'light', t: ["I'm fine. I'm brilliant. I love this song.", "This is my qualifying pace. Watch."], r: ["...Course you are.", "Ha. That's what worries me."] },
      { tone: 'firm', t: ["I know my limit. I'm nowhere near it.", "I've got it under control."], r: ["If you say so.", "Famous last words."], m: -1 },
      { tone: 'sorry', act: 'car', t: ["...You're right. Get me a car?", "Yeah. I think I'm done. Car?"], r: ["On it. Stay there.", "Good call. I'll walk you out."], when: (x) => tier(x) >= 3 },
    ] },
  // ---- getting late --------------------------------------------------------------------------------------------------------------------
  { id: 'pdLate', who: ['driver'], where: ALL, w: 6, when: (x) => ok(x) && late(x), open: [
    "I'm calling it. Some of us have a debrief at ten.", "That's me done. Good night, this. Proper good.", "Right. If I stay any longer my engineer will hear about it." ],
    opts: [
      { tone: 'kind', fx: 'invite', t: ["Same again after the next one?", "Good night. We should do this more."], r: ["Deal. Your shout.", "Yeah. We should."] },
      { tone: 'firm', t: ["Go on. Sleep. See you on the grid.", "Get some rest. See you at the track."], r: ["See you there.", "Yeah. See you there."] },
      { tone: 'light', t: ["Lightweight.", "Leaving before the good bit. Typical."], r: ["Ha. Proudly.", "Ha. The good bit's my bed."] },
      { tone: 'show', t: ["Leaving already? I'm just getting started.", "Amateurs. Every one of you."], r: ["Ha. See you at breakfast, then.", "Ha. Enjoy that tomorrow."] },
    ] },
  // ---- a photo ------------------------------------------------------------------------------------------------------------------------------
  { id: 'pdPhoto', who: ['driver'], where: ALL, w: 1.2, when: (x) => ok(x) && P(x).phones !== false, open: [
    "Photo? For the group chat. Nobody posts it.", "Quick one before we both look any worse.", "My team want a picture of me looking sociable. Help me out." ],
    opts: [
      { tone: 'kind', fx: 'selfie', t: ["Go on. Come here.", "Yeah. Squeeze in."], r: ["Nice. Look at us.", "Lovely."] },
      { tone: 'light', fx: 'selfie', t: ["Only if I can do my podium face.", "Wait - good side. It's the left."], r: ["Ha. Go on.", "Ha. Neither of them."] },
      { tone: 'show', fx: 'selfie', t: ["Give it here. I know my angles.", "I'll take it. Long arms."], r: ["Ha. Go on.", "Ha. Fine."] },
      { tone: 'cold', t: ["No photos tonight, please.", "Can we not? Just tonight."], r: ["Course.", "Fair enough."] },
    ] },
  // ---- the agent working the room (gossip about invented people) ------------------------------------------------------------------------
  // (three openers, each with its own answers - and the agent unnamed and ungendered: half of them are women)
  { id: 'pdRoom', who: ['driver'], where: CLUBS, w: 0.5, when: (x) => ok(x), open: [
    "That agent by the DJ booth has been round half the grid tonight. Who's the seat for?", "Every driver manager in the paddock is in here. Somebody's moving teams.", "Seen the business cards going round? Silly season starts at the bar." ],
    opts: [
      { tone: 'gossip', t: ["One of their drivers wants a better seat. They always do.", "Somebody's moving teams. You can smell it."], r: ["Ha. Silly season's early.", "Ha. Always."] },
      { tone: 'light', t: ["Not me. I like my seat. Mostly.", "Tell them I'm not available. Unless I am."], r: ["Ha. 'Mostly'.", "Ha. Very subtle."] },
      { tone: 'firm', t: ["Talk to them all. You never know.", "It's part of the job. Smile and swap numbers."], r: ["Fair.", "Spoken like a businessman."] },
      { tone: 'cold', t: ["Not tonight. I'm off duty.", "I'm not working tonight."], r: ["Fair.", "Lucky you."] },
    ] },
  { id: 'pdBrands', who: ['driver'], where: CLUBS, w: 0.35, when: (x) => ok(x), open: [
    "Every brand in the paddock has someone in here with a business card.", "I've been handed three business cards and a free watch. Is that normal?" ],
    opts: [
      { tone: 'firm', t: ["It's part of the job. Smile and swap numbers.", "Take the cards. Read them on Monday."], r: ["Fair.", "Spoken like a businessman."] },
      { tone: 'light', t: ["Keep the watch. Lose the cards.", "Free watch? Where's my free watch?"], r: ["Ha. Exactly.", "Ha. Get in line."] },
      { tone: 'gossip', t: ["The energy-drink lot are throwing money about tonight.", "Half of them are here to poach somebody's sponsor."], r: ["...They always are.", "Ha. Probably yours."] },
      { tone: 'cold', t: ["I'm not working tonight.", "Not interested."], r: ["Fair.", "Lucky you."] },
    ] },
  { id: 'pdFilmed', who: ['driver'], where: CLUBS, w: 0.35, when: (x) => ok(x), open: [
    "That influencer's filmed me three times. I haven't said anything interesting once.", "There's a phone on a stick following me round the room." ],
    opts: [
      { tone: 'light', t: ["Hide behind me. I'm very wide.", "Stand still long enough and they get bored."], r: ["Ha. Cheers.", "Ha. Noted."] },
      { tone: 'firm', t: ["Say something boring. That's my method.", "Smile, say nothing, keep walking."], r: ["Ha. It works for you.", "Fair."] },
      { tone: 'kind', t: ["Give them thirty seconds. They leave you alone after.", "Do one clip and they'll move on."], r: ["...Fine. Thirty seconds.", "Hm. Maybe."] },
      { tone: 'cold', t: ["No filming. Simple.", "Ask security to have a word."], r: ["Fair enough.", "Ha. Harsh."] },
    ] },

  // ---- the team party (your own team's celebration) ------------------------------------------------------------------------------------
  { id: 'ptScreen', who: ['driver'], where: TEAM, w: 3, when: (x) => ok(x), open: [
    "They're replaying the race on the big screen. Your start's coming up. Watch this.", "Somebody keeps rewinding the restart. The mechanics are commentating.", "Have you seen your onboard yet? The lads have it on a loop." ],
    opts: [
      { tone: 'light', t: ["I'm not watching. I'll find something to criticise.", "Turn it off before the bit where I miss the apex."], r: ["Ha. Too late. Everyone's seen it.", "Ha. They're pausing on it."] },
      { tone: 'kind', t: ["Look at the crew on the pit wall. That's the bit I love.", "Watch the stop. Two seconds. Those lads are heroes."], r: ["Yeah. Proper.", "Yeah. Two seconds."] },
      { tone: 'show', t: ["Watch this bit. Look at that.", "That move. Look at it. Beautiful."], r: ["Ha. Here we go.", "Ha. Humble as ever."] },
      { tone: 'firm', t: ["I'll watch it with my engineer tomorrow. Not tonight.", "Tomorrow. Tonight's tonight."], r: ["Sensible.", "Fair."] },
    ] },
  { id: 'ptSpeech', who: ['driver'], where: TEAM, w: 3, when: (x) => ok(x) && !P(x).speech, open: [
    "Boss is going to say a few words. Pray it's short.", "There's a microphone on the table. Nobody touch it.", "Has anyone told the boss there's a time limit on speeches?" ],
    opts: [
      { tone: 'light', t: ["He's got notes. I saw notes. Plural.", "Five minutes. I've got a bet on."], r: ["Ha. We're here till two.", "Ha. Take the over."] },
      { tone: 'kind', t: ["Let him have it. He's earned a speech.", "It's nice, though. He means it."], r: ["Yeah. Fair.", "He does."] },
      { tone: 'firm', t: ["Short and sweet. Then the food.", "Speech, food, home. In that order."], r: ["Ha. Priorities.", "Agreed."] },
    ] },
  { id: 'ptFood', who: ['driver'], where: TEAM, w: 1.6, when: (x) => ok(x), open: [
    "Have you eaten? The hospitality lot have done a proper spread.", "There's a whole tray of sliders. I've had four. Don't tell my trainer.", "Eat something. You'll thank me tomorrow." ],
    opts: [
      { tone: 'kind', t: ["Good shout. I'm starving, actually.", "Yeah. Lead the way."], r: ["Come on, then.", "Get the sliders before the mechanics arrive."] },
      { tone: 'light', t: ["Four? Amateur. I'm on six.", "Your trainer's on the next table, mate."], r: ["Ha! Respect.", "...He's not. Is he?"] },
      { tone: 'firm', t: ["Later. I'm not hungry yet.", "I'll eat at the hotel."], r: ["Your call.", "Fair."] },
    ] },
  { id: 'ptMechs', who: ['driver'], where: TEAM, w: 4, when: (x) => ok(x) && !!P(x).mechanics, open: [
    "Here they come - the lads have finished the pack-down!", "The mechanics are in. Somebody get them a drink, they've earned it.", "Listen to that cheer. The freight's on the trucks, the party starts now." ],
    opts: [
      { tone: 'kind', fx: 'charm', act: 'toast', t: ["Glasses up. To the crew.", "Go on - to the lads in the garage."], r: ["To the crew!", "To the crew."] },
      { tone: 'light', t: ["They still smell of brake dust. Love them.", "Hide the sliders. They'll eat everything."], r: ["Ha. Badge of honour.", "Ha. Too late."] },
      { tone: 'firm', t: ["Best stop of the year today. They deserve this.", "Two-second stop. Every one of them gets a drink from me."], r: ["Yeah. They do.", "Legend."] },
    ] },

  // ---- your team-mate ------------------------------------------------------------------------------------------------------------------
  { id: 'pmBeat', who: ['driver'], role: 'mate', where: ALL, w: 5, when: (x, n) => ok(x) && !!P(x).beatMate && (P(x).matePos != null || !!P(x).mateDnf) && !(n.talks > 1), open: [
    "Go on. Say it. You beat me.", "Ahead of me tonight. Enjoy it. Don't get used to it.", "I'm not talking about the race. ...Fine. Fair play." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Close one. You were quick tonight too.", "Good for the team. That's what counts."], r: ["...Cheers. Appreciated.", "Yeah. It is."] },
      { tone: 'show', t: ["Ahead tonight. Ahead next time.", "Get used to the view."], r: ["We'll see.", "Ha. Steady."], m: -1 },
      { tone: 'light', t: ["Say what? I didn't notice. Were you in the race?", "I'll buy the next round. Winner's tax."], r: ["Ha. Cheeky.", "Ha. Deal."] },
      { tone: 'firm', t: ["Next race starts on Monday. For both of us.", "Tonight's done. We go again."], r: ["Yeah. Fair.", "True."] },
    ] },
  { id: 'pmLost', who: ['driver'], role: 'mate', where: ALL, w: 5, when: (x, n) => ok(x) && P(x).mateAhead === true && P(x).matePos != null && !(n.talks > 1), open: [
    "Don't. I know. I was ahead. Let me enjoy it.", "{mateResult} for me tonight. Just mentioning it.", "Good race tonight. For one of us." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["You were quicker. Fair play.", "Well driven. Genuinely."], r: ["...Thanks. Means something, that.", "Cheers. It does."] },
      { tone: 'light', t: ["Enjoy it. You've got about a week.", "I let you have that one. Team spirit."], r: ["Ha. A week's plenty.", "Ha. Sure you did."] },
      { tone: 'firm', t: ["I'll have you next time.", "Next one's mine."], r: ["Good. I'd be bored otherwise.", "We'll see."] },
      { tone: 'cold', t: ["Leave it.", "Not tonight."], r: ["...Alright. Touchy.", "Fine."], m: -1 },
    ] },
  { id: 'pmShoey', who: ['driver'], role: 'mate', where: ALL, w: 7, when: (x, n) => ok(x) && podium(x) && adult(x) && !P(x).shoey, open: [
    "You know the rules. Podium means a shoey.", "Somebody's taking their boot off. It's not going to be me.", "The mechanics are chanting. You know what they want." ],
    opts: [
      { tone: 'show', fx: 'shoey', t: ["Give me the shoe.", "Fine. Hand it over. Whose shoe?"], r: ["LEGEND!", "Ha! Here we go!"] },
      { tone: 'light', fx: 'shoey', t: ["Only if it's your shoe.", "Fine. But I'm not cleaning it."], r: ["Ha! Deal.", "Ha! Get it down you!"] },
      { tone: 'firm', t: ["Absolutely not. I've seen the inside of those boots.", "No. I have standards. Low ones, but standards."], r: ["Boring!", "Ha. Spoilsport."] },
      { tone: 'kind', fx: 'shoey', t: ["Only if you do one with me. Both of us.", "Together. Team effort."], r: ["...Go on, then. Team effort.", "Ha. Fine. Together."], when: (x, n) => grown(n) },
    ] },
  { id: 'pmCrew', who: ['driver'], role: 'mate', where: TEAM, w: 4, when: (x) => ok(x) && !P(x).crewThanked, open: [
    "Have you been down to the garage yet? The lads are still packing the freight.", "Before you get comfortable - the mechanics are still working. Go and say thanks.", "I went down to the garage. They were taping up crates. Go and see them." ],
    opts: [
      { tone: 'kind', fx: 'charm', act: 'crew', t: ["Good shout. Come with me.", "Going now. They deserve it."], r: ["Right behind you.", "They'll love that."] },
      { tone: 'firm', act: 'crew', t: ["On my way.", "Right. Now."], r: ["Good.", "Good man."] },
      { tone: 'light', t: ["In a minute. I've got a slider in each hand.", "After this. They'll be hours yet."], r: ["Ha. Don't forget.", "Ha. Fine."] },
    ] },
  { id: 'pmBoth', who: ['driver'], role: 'mate', where: ALL, w: 3, when: (x) => ok(x) && !!P(x).scored && P(x).matePos != null && P(x).matePos <= 10 && !P(x).mateDnf, open: [
    "Both cars in the points. The boss is actually smiling.", "Double points. When did that last happen?", "Good night for the garage. Both of us home." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["That's the bit I like. Both of us, for the team.", "Best feeling there is. Whole garage happy."], r: ["Yeah. Same.", "...Yeah. Agreed."] },
      { tone: 'light', t: ["Don't tell him. He'll start expecting it.", "Somebody check the boss for a temperature."], r: ["Ha. Too late.", "Ha. He's fine. He's just happy."] },
      { tone: 'firm', t: ["Again next time. And higher.", "That's the standard now."], r: ["Agreed.", "Deal."] },
    ] },
  { id: 'pmOut', who: ['driver'], role: 'mate', where: CLUBS, w: 2, when: (x) => ok(x), open: [
    "Right. Team-mates' night out. No data. Promise?", "If the boss asks, we left at midnight.", "I reckon the garage is happier when we get on. Do you?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Much happier. We're a better team like this.", "I think so too. And I think we're quicker for it."], r: ["Yeah. Me too.", "...Yeah. I reckon we are."] },
      { tone: 'light', t: ["Promise. ...But your braking into the last corner, though.", "No data. Except one tiny bit. About your throttle."], r: ["Two minutes! You lasted two minutes.", "Ha. Unbelievable."] },
      { tone: 'firm', t: ["On track we're rivals. In here, we're not.", "We race hard and we're fine. That's the deal."], r: ["Good.", "Fair."] },
      { tone: 'show', t: ["The garage is happiest when I'm in front. Sorry.", "They're happy. I'm quicker. Everyone wins."], r: ["Ha. We'll see.", "Steady."] },
    ] },
  { id: 'pmClear', who: ['driver'], role: 'mate', where: ALL, w: 6, when: (x) => ok(x) && !!P(x).feud, open: [
    "Look - about the call. I didn't ask for it. I want you to know that.", "Can we talk? Away from the cameras. About today.", "I know you're angry about today. I would be too." ],
    opts: [
      { tone: 'kind', fx: ['clear', 'deep'], t: ["Let's sort it. Properly. We're better than this.", "I'm angry at the call, not at you. Let's clear it."], r: ["...Yeah. I'd like that.", "...Good. Me too."], then: { say: ["So what do we tell the boss?", "How do we stop it happening again?"], opts: [
        { tone: 'firm', fx: 'clear', t: ["We go to him together. Monday. Clear rules.", "Rules before the next race. Written down."], r: ["Together. Deal.", "Agreed. Written down."] },
        { tone: 'kind', fx: 'clear', t: ["Nothing. It's between us, and it's done.", "We just race. Clean. Like before."], r: ["Done. Shake on it.", "...Like before. Yeah."] },
        { tone: 'light', fx: 'clear', t: ["We tell him we've made up and he owes us both dinner.", "We tell him the cameras loved it."], r: ["Ha. I like that.", "Ha. They did."] } ] } },
      { tone: 'firm', t: ["The team made the call. I'd have done the same in your seat.", "It's the job. Neither of us picked it."], r: ["...Maybe. Still stings.", "...Yeah. Still."] },
      { tone: 'cold', t: ["Not tonight.", "There's nothing to talk about."], r: ["...Fine. Cold war it is.", "...Right."], m: -3 },
      { tone: 'sorry', fx: 'clear', t: ["I should've said something on the radio. I'm sorry.", "I could have handled it better. Sorry."], r: ["...Appreciated. Really.", "...Okay. Thanks for saying it."] },
    ] },
  { id: 'pmLook', who: ['driver'], role: ['mate', 'friend'], where: ALL, w: 8, when: (x) => ok(x) && tier(x) >= 3, open: [
    "Right. That's enough. I'm getting you a car.", "Mate. You're done. I'm walking you out.", "Look at me. How many fingers? ...That's what I thought. Car." ],
    opts: [
      { tone: 'kind', act: 'car', t: ["...Yeah. Thanks. You're a good mate.", "Okay. Okay. Car."], r: ["Come on. I've got you.", "Good lad. This way."] },
      { tone: 'light', t: ["One more song. Then car. Promise.", "Three fingers. ...Four? Final answer."], r: ["...One. Then I'm carrying you.", "Ha. No. Car."], m: -1 },
      { tone: 'cold', t: ["I'm fine. Leave it.", "I don't need a babysitter."], r: ["...Fine. I'm right here, though.", "...Alright. I'm watching you."], m: -2 },
      { tone: 'sorry', act: 'car', fx: 'water', t: ["Sorry. Water, then car.", "You're right. Sorry. Get me out of here."], r: ["Water, then car. Good.", "No sorry. Come on."] },
    ] },

  // ---- the driver you raced (a sporting word: the hostile version is the 'needle' drama) ----------------------------------------------------
  { id: 'pvBattle', who: ['driver'], role: 'rival', where: ALL, w: 5, when: (x, n) => ok(x) && !(n.talks > 1), open: [
    "That battle tonight. You know the one. Fair play.", "We were side by side for three corners. My heart's still going.", "The stewards are going to love the replay of us two." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Hard but fair. Best racing I've had all year.", "Racing you's the fun bit, honestly."], r: ["Yeah. It was.", "...Same. Cheers."], then: { say: ["Same again next time, then?", "Next time, then?"], opts: [
        { tone: 'firm', t: ["Same again. A car's width, always.", "Same again. May the quicker one win."], r: ["Deal.", "Deal."] },
        { tone: 'light', t: ["Only if you leave the door open again.", "Same again. You'll still be behind."], r: ["Ha. Never.", "Ha. We'll see."] },
        { tone: 'kind', t: ["Always. Shake on it.", "Every time. Good racing."], r: ["Shaken.", "Good racing."] } ] } },
      { tone: 'sorry', t: ["I squeezed you a bit into the chicane. Sorry about that.", "That one was tight. My fault."], r: ["Appreciated. Water under the bridge.", "Cheers. Respect."] },
      { tone: 'show', t: ["You'll get used to the view of my gearbox.", "That's what it looks like when someone's quicker."], r: ["We'll see.", "Ha. We'll see."], m: -1 },
      { tone: 'light', t: ["I think about it most nights. Fondly. Starting tonight.", "Next time I'm bringing a bigger car."], r: ["Ha. Course you do.", "Ha. Bring two."] },
    ] },
  { id: 'pvTouch', who: ['driver'], role: 'rival', where: ALL, w: 5, when: (x, n) => ok(x) && (P(x).contact || []).includes(n.id), open: [
    "You know we touched, right? I've got a lovely tyre mark on my sidepod.", "Our little bump tonight. No hard feelings. Mostly.", "Did you see me in your mirrors? Because I saw you in my sidepod." ],
    opts: [
      { tone: 'sorry', fx: 'calm', t: ["Yeah - that was me. Sorry. I was late on the brakes.", "My fault. I'll own it. Sorry."], r: ["...Appreciated. Takes a lot to say that.", "Cheers. Done. Forgotten."] },
      { tone: 'light', t: ["Free pinstripe. You're welcome.", "I was just saying hello. Firmly."], r: ["Ha. Cheeky.", "Ha. Say it softer next time."] },
      { tone: 'firm', t: ["Racing incident. Stewards agreed.", "Two cars, one gap. It happens."], r: ["...If you say so.", "Hm. Maybe."] },
      { tone: 'cold', t: ["You left the door open.", "Should've left more room."], r: ["...Right. Noted.", "Wow. Okay."], m: -2 },
    ] },
  { id: 'pvNext', who: ['driver'], role: 'rival', where: ALL, w: 2, when: (x) => ok(x), open: [
    "Next race, I'm coming for you. Just so you know.", "I've got you circled for the next one.", "You're my target now. Congratulations." ],
    opts: [
      { tone: 'show', t: ["Bring it. You know where I'll be. In front.", "Good. I like a challenge."], r: ["Ha. We'll see.", "Ha. You'll get one."] },
      { tone: 'kind', t: ["Good. Clean and hard. Like tonight.", "Looking forward to it. Honestly."], r: ["Clean and hard.", "Me too."] },
      { tone: 'light', t: ["Circled in what? Crayon?", "I'm flattered. Should I be scared?"], r: ["Ha. Red crayon.", "Ha. A bit."] },
      { tone: 'firm', t: ["Fine. See you on the grid.", "Talk's cheap. See you out there."], r: ["See you there.", "Fair."] },
    ] },
  { id: 'pvRespect', who: ['driver'], role: 'rival', where: ALL, w: 1.5, when: (x) => ok(x), open: [
    "Whatever happens out there - good to race you. Genuinely.", "My engineer was shouting about you all night. Takes some doing.", "You're quicker in the slow stuff than I thought. Annoying." ],
    opts: [
      { tone: 'kind', t: ["Likewise. Means a lot from you.", "Same. Good racing."], r: ["Cheers.", "Good racing."] },
      { tone: 'light', t: ["Tell your engineer I said hello.", "Annoying is my best feature."], r: ["Ha. He'll love that.", "Ha. It is."] },
      { tone: 'show', t: ["Wait till you see me in the fast stuff.", "I'm quicker everywhere. Pay attention."], r: ["Ha. Steady.", "We'll see."] },
      { tone: 'firm', t: ["Respect. See you next time.", "Thanks. Same."], r: ["See you.", "Cheers."] },
    ] },

  // ---- an ex-team-mate ----------------------------------------------------------------------------------------------------------------------
  { id: 'pxMiss', who: ['driver'], role: 'exmate', where: ALL, w: 4, when: (x, n) => ok(x) && !(n.talks > 0), open: [
    "Miss me? Go on. A bit.", "How's the new team-mate? Better than me? Don't answer that.", "Funny seeing you without our old garage between us." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Course I miss you. Garage is quieter.", "Every day. Mostly your jokes."], r: ["...Cheers. Same, honestly.", "Ha. They were good jokes."] },
      { tone: 'light', t: ["Miss you? I barely noticed you'd gone.", "He's quieter. And quicker. Kidding. Mostly."], r: ["Ha. Charming.", "Ha. Mostly."] },
      { tone: 'firm', t: ["Different team, same respect.", "We're rivals now. Still mates."], r: ["Yeah. Good.", "Agreed."] },
      { tone: 'gossip', t: ["Between us, the coffee's got worse since you left.", "Your old engineer still talks about you."], r: ["Ha. I knew it.", "...Does he? Nice."] },
    ] },
  { id: 'pxCar', who: ['driver'], role: 'exmate', where: ALL, w: 2.5, when: (x) => ok(x), open: [
    "Your car looked handy tonight. You've found something.", "How's life at the new place? Honestly.", "Bet our old mechanics are glad to see the back of me." ],
    opts: [
      { tone: 'firm', t: ["We're getting there. Long way to go.", "Step by step. It's coming."], r: ["Looked like it.", "Good."] },
      { tone: 'kind', t: ["The lads ask after you, you know. All the time.", "They miss you. They'd never say it."], r: ["...That's nice to hear.", "...Tell them I said hi."] },
      { tone: 'light', t: ["Glad? They threw a party.", "They've framed your seat setup. As a warning."], r: ["Ha! Harsh.", "Ha. Fair."] },
      { tone: 'gossip', t: ["Don't tell anyone, but we've got an upgrade coming.", "Wait till you see what we bring next."], r: ["...Ooh. Interesting.", "Ha. I'll watch for it."] },
    ] },
  { id: 'pxOld', who: ['driver'], role: 'exmate', where: ALL, w: 2, when: (x) => ok(x), open: [
    "Remember the debrief that went four hours? I still dream about it.", "Remember our first race as team-mates? Neither of us finished.", "Best moment from our time together. Go." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["That double podium. The whole garage crying.", "The night we fixed the setup together at two in the morning."], r: ["...Yeah. That one.", "...Yeah. Proper."] },
      { tone: 'light', t: ["You falling off the scooter in the paddock.", "The time you asked for the wrong tyres. Twice."], r: ["Ha! It was wet!", "Ha. Slander."] },
      { tone: 'firm', t: ["Every race we beat the cars ahead.", "Learning from you. I mean that."], r: ["Good times.", "...Cheers."] },
    ] },
  { id: 'pxTrade', who: ['driver'], role: 'exmate', where: CLUBS, w: 1.5, when: (x) => ok(x), open: [
    "Your sponsor's rep has been eyeing me all night. Should I be worried?", "Your new team-mate keeps asking about you. What did you tell him?", "We should get a photo. The old firm." ],
    opts: [
      { tone: 'light', fx: 'selfie', t: ["Photo. Old firm. Go.", "Come here. For the old garage."], r: ["Ha. Nice.", "Lovely. They'll love that."] },
      { tone: 'gossip', t: ["Very worried. They like your hair.", "I told him you snore on flights."], r: ["Ha. My hair is good.", "Ha. Rude. True."] },
      { tone: 'kind', t: ["Only good things. Promise.", "Nothing but nice stuff."], r: ["...Cheers.", "Good."] },
    ] },

  // ---- a good friend on the grid --------------------------------------------------------------------------------------------------------------
  { id: 'pfRules', who: ['driver'], role: 'friend', where: CLUBS, w: 4, when: (x, n) => ok(x) && !(n.talks > 0), open: [
    "Two rules tonight: no data, no regrets.", "There you are. I've been guarding a spot by the DJ for twenty minutes.", "Finally. I was about to start dancing on my own. Nobody wants that." ],
    opts: [
      { tone: 'light', fx: 'dance', t: ["No data. Some regrets. Let's go.", "Nobody wants that. Come on, then."], r: ["Ha! That's the spirit.", "Ha. Come on."] },
      { tone: 'kind', fx: 'charm', t: ["Good to see you. Properly.", "This is exactly what I needed tonight."], r: ["Same. Same.", "Yeah. Me too."] },
      { tone: 'firm', t: ["One rule. Home by three.", "No data. Agreed. Regrets are optional."], r: ["Three? Ambitious.", "Ha. Fair."] },
      { tone: 'show', t: ["I'm the best dancer on the grid. Let me show you.", "Stand back. I've been practising."], r: ["Ha. Prove it.", "Ha. In the sim?"] },
    ] },
  { id: 'pfFriend', who: ['driver'], role: 'friend', where: ALL, w: 2.5, when: (x) => ok(x), open: [
    "You know what? This is the best bit of the weekend.", "Proper night, this. Glad you came.", "I'm glad you're here. Most of the room's sponsors." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Same. I don't say it enough - I'm glad we're mates.", "It helps, having someone on the grid I can talk to."], r: ["...Yeah. Me too. Don't make it weird.", "Same. More than you know."] },
      { tone: 'light', t: ["You're only saying that because I'm buying.", "Sponsors are people too. Some of them."], r: ["Ha. Partly.", "Ha. Some."] },
      { tone: 'firm', t: ["Whatever happens on track, this stays.", "We look out for each other. That's the deal."], r: ["Right.", "Always."] },
      { tone: 'show', t: ["Best bit because I'm here.", "You're lucky to have me. I'm a great mate."], r: ["Ha. And modest.", "Ha. Sure."] },
    ] },
  { id: 'pfWing', who: ['driver'], role: 'friend', where: CLUBS, w: 3, when: (x) => ok(x) && !!P(x).flirted?.length, open: [
    "Saw you talking to someone at the host's table. Smooth.", "I'm not saying anything. ...I'm saying something. Who was that?", "You've been smiling at your phone all night." ],
    opts: [
      { tone: 'firm', fx: 'cover', t: ["Just being friendly. That's all.", "Networking. Very professional."], r: ["Networking. Sure.", "Ha. Very professional."] },
      { tone: 'kind', fx: 'deep', t: ["Keep it between us? I like her.", "Honestly? I don't know what it is yet."], r: ["Vault. Be careful, though.", "Then work it out before the papers do."] },
      { tone: 'light', t: ["What can I say? I'm charming.", "She laughed at my joke. I'm in love."], r: ["Ha. Calm down.", "Ha. Steady."] },
      { tone: 'cold', t: ["Not your business, mate.", "Leave it."], r: ["Fair. Touchy, though.", "Alright, alright."] },
    ] },
  { id: 'pfLate', who: ['driver'], role: 'friend', where: VEGAS, w: 3, when: (x) => ok(x) && late(x), open: [
    "Four am breakfast? There's a diner round the back that does pancakes the size of a tyre.", "Nobody's going home yet. Breakfast. I'm buying.", "If we leave now we can beat the sunrise to the pancakes." ],
    opts: [
      { tone: 'kind', fx: 'invite', t: ["Pancakes. Now. Lead the way.", "Breakfast. Yes. Best idea all night."], r: ["Get in.", "Legend."] },
      { tone: 'firm', t: ["Hotel for me. Flight in five hours.", "Bed. Some of us have a debrief."], r: ["Boring!", "Fair. Lightweight."] },
      { tone: 'light', t: ["Only if they do them with bacon.", "Size of a tyre? Which compound?"], r: ["Ha. They do.", "Ha. Hards. They last."] },
    ] },
  { id: 'pfChips', who: ['driver'], role: 'friend', where: LONDON, w: 3, when: (x) => ok(x) && late(x), open: [
    "Chicken shop. It's tradition. Don't argue.", "There's a chicken shop round the corner open till five. I'm just saying.", "Nobody leaves London without a box of wings at three in the morning." ],
    opts: [
      { tone: 'kind', fx: 'invite', t: ["Wings. Now. You're a genius.", "Tradition's tradition. Let's go."], r: ["Get in.", "Legend."] },
      { tone: 'firm', t: ["Hotel. My trainer's at nine.", "Bed. I'll regret the wings more than the drinks."], r: ["Boring.", "Fair."] },
      { tone: 'light', t: ["Only if you're buying.", "Do they do a nutritionist's portion?"], r: ["Ha. Deal.", "Ha. No."] },
    ] },

  // ---- a driver who is only passing through (one conversation) ----------------------------------------------------------------------------------
  { id: 'ppHello', who: ['driver'], role: 'present', where: ALL, w: 4, when: (x) => ok(x), open: [
    "Good race tonight. Can't stop - our car's waiting.", "Quick hello, then I'm off. Flying at eight.", "Saw you come in. Just wanted to say: good drive." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Thanks. Safe trip.", "Cheers. Means a lot."], r: ["See you next time.", "Course. See you there."] },
      { tone: 'light', t: ["Leaving already? Lightweight.", "Flying at eight? Brave."], r: ["Ha. Proudly.", "Ha. Very."] },
      { tone: 'firm', t: ["See you on the grid.", "See you next time."], r: ["See you there.", "Yeah."] },
      { tone: 'show', t: ["You'll be saying that a lot this year.", "Get used to it."], r: ["Ha. Steady.", "Ha. We'll see."] },
    ] },
  { id: 'ppTeam', who: ['driver'], role: 'present', where: CLUBS, w: 2, when: (x) => ok(x), open: [
    "Our lot are in the corner. Come and say hello later?", "My team's doing a toast in a minute. Free champagne if you're quick.", "One drink with the team, then I'm gone. Promise." ],
    opts: [
      { tone: 'kind', fx: 'network', t: ["I'll come over. Say hi to the lads.", "Go on. I'll pop over."], r: ["They'll like that.", "Good."] },
      { tone: 'light', t: ["Free champagne? I'm already walking.", "One drink. Famous last words."], r: ["Ha. Quick, then.", "Ha. We'll see."] },
      { tone: 'firm', t: ["Another time. I'm with my lot tonight.", "Maybe later."], r: ["Fair.", "No worries."] },
    ] },
  { id: 'ppNod', who: ['driver'], role: 'present', where: CLUBS, w: 1.5, when: (x) => ok(x), open: [
    "Mad in here. Good, though.", "Didn't think I'd see you out tonight.", "You alright? Good race." ],
    opts: [
      { tone: 'kind', t: ["Good to see you out.", "All good. You?"], r: ["Yeah. Good.", "All good."] },
      { tone: 'light', t: ["I'm everywhere. Like a safety car.", "Can't keep me in."], r: ["Ha.", "Ha. Clearly."] },
      { tone: 'firm', t: ["One hour. Then bed.", "Just a quick one."], r: ["Fair.", "Same."] },
    ] },
  { id: 'ppRace', who: ['driver'], role: 'present', where: ALL, w: 2, when: (x) => ok(x) && (podium(x) || dnf(x)), open: [
    "Hell of a race, that. Well done.", "Rough luck tonight. You'll be back.", "Saw the end on the screens. Mad." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Thanks. Means a lot.", "Appreciate that."], r: ["Course.", "Any time."] },
      { tone: 'firm', t: ["Next one.", "On to the next one."], r: ["That's it.", "Yeah."] },
      { tone: 'light', t: ["Mad's the word.", "I'm still shaking."], r: ["Ha.", "Ha. Enjoy it."] },
    ] },

  // ---- three or more of you ({other}: someone else in the conversation) ------------------------------------------------------------------------
  { id: 'pgToast', who: ['group'], where: ALL, w: 3, when: (x) => ok(x) && adult(x), open: [
    "Glasses up. {other}, you do the honours.", "Right, a toast. Keep it short. {other} gets emotional.", "We should toast something. What've we got?" ],
    opts: [
      { tone: 'kind', act: 'toast', t: ["To everyone home safe. That's the one.", "To the mechanics. They're still working."], r: ["To that.", "To the mechanics."] },
      { tone: 'light', act: 'toast', t: ["To {other}'s parking.", "To the DJ, who doesn't know who any of us are."], r: ["Ha! Rude.", "Ha. To the DJ."] },
      { tone: 'show', act: 'toast', t: ["To me. Why not?", "To tonight's result. Mine, specifically."], r: ["Ha. Fine. To you.", "Ha. We'll drink to the attempt."] },
      { tone: 'firm', act: 'toast', t: ["To the next one. Points for all of us.", "To clean racing."], r: ["To the next one.", "Hear, hear."] },
    ] },
  { id: 'pgDebate', who: ['group'], where: ALL, w: 2.5, when: (x, n) => ok(x) && !isStar(n), open: [
    "Settle this. {other} says the Safety Car came out too late tonight.", "{other} reckons the stewards got it wrong on lap one. Discuss.", "Best move of the race - not yours. {other} thinks my answer's wrong." ],
    opts: [
      { tone: 'firm', t: ["Too late. Every week, too late.", "Stewards got it right. Annoyingly."], r: ["See? {other}, told you.", "Hm. Strong answer."] },
      { tone: 'kind', t: ["You're both right. I hate saying it.", "Honestly, it was a tough call either way."], r: ["Diplomatic.", "Boring answer."] },
      { tone: 'light', t: ["I'm with whoever's holding the next round.", "I didn't see it. I was busy being overtaken."], r: ["Ha. Bribery.", "Ha. Honest."] },
      { tone: 'show', t: ["Best move? Mine. You know the one.", "The best move tonight was my start."], r: ["Ha. Course.", "Ha. Steady."] },
    ] },
  { id: 'pgRadio', who: ['group'], where: ALL, w: 2, when: (x) => ok(x), open: [
    "{other} says your radio after the flag was 'emotional'.", "We're swapping radio stories. Your turn.", "{other} reckons you asked what lap it was. On the last lap." ],
    opts: [
      { tone: 'light', t: ["I asked what lap it was. On the last lap. It's true.", "I once said 'is that rain?' It was a pigeon."], r: ["Ha! It's true!", "Ha. A pigeon!"] },
      { tone: 'kind', t: ["I thanked the wrong team. Twice.", "I told my engineer I loved him. Meant to say 'copy'."], r: ["Ha! Twice!", "Ha. Aw."] },
      { tone: 'firm', t: ["What's said on the radio stays on the radio.", "Not telling. Ever."], r: ["Boring.", "Spoilsport."] },
    ] },
  { id: 'pgDance', who: ['group'], where: CLUBS, w: 2, when: (x) => ok(x), open: [
    "{other} wants everyone on the dance floor. Resistance is pointless.", "We're going to dance. All of us. It's been decided.", "Nobody leaves until {other} has danced. That's the rule." ],
    opts: [
      { tone: 'light', fx: 'dance', t: ["Fine. One song. For {other}.", "Go on. Lead the way."], r: ["Ha! Get in.", "Come on, then."] },
      { tone: 'show', fx: 'dance', t: ["Stand back, everyone.", "Watch this."], r: ["Ha. Here we go.", "Oh no."] },
      { tone: 'firm', t: ["I'll hold the drinks. Somebody has to.", "I'm guarding the table."], r: ["Coward.", "Ha. Very brave."] },
    ] },

  // =====================================================================================================================
  // the stars (all twelve made up, all adults; PG). crowd: fine with people around; the rest need privacy
  // =====================================================================================================================
  // ---- she watched the race ------------------------------------------------------------------------------------------------------
  { id: 'pcSawWin', who: ['celeb'], where: ALL, crowd: true, w: 6, when: (x, n) => ok(x) && easy(n) && podium(x) && !(n.talks > 1), open: [
    "I watched from the Paddock Club. Ten laps to go I stopped breathing.", "{result}! I screamed. A man in a very expensive suit asked me to sit down.", "I don't understand half the rules, but I understood that." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["You watched? That's the best bit of it.", "Thank you. Honestly, that means a lot."], r: ["Every lap. Well - most laps.", "I mean it."], then: { say: ["What's it like, up there? On the podium?", "What did it feel like, standing up there?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Like the whole team was up there with me.", "Like every early morning was worth it."], r: ["...That's lovely.", "I could see it on your face."] },
        { tone: 'light', t: ["Loud. Very loud. And sticky.", "Like my face was going to break from smiling."], r: ["Ha. It looked sticky.", "Ha. It nearly did."] },
        { tone: 'flirt', fx: 'flirt', t: ["Better, knowing you were watching.", "Good. Not as good as this, though."], r: ["...Stop it.", "Smooth."] },
        { tone: 'firm', t: ["Like the start of something.", "Like I want to do it again. Soon."], r: ["Then do it again.", "I believe you."] } ] } },
      { tone: 'light', t: ["Was the man in the suit right? Were you standing on a chair?", "You screamed? I need to see the footage."], r: ["...There was a chair. Briefly.", "There is footage. You're not seeing it."] },
      { tone: 'show', t: ["Get used to it. There's more where that came from.", "That was the warm-up."], r: ["Oh, is there?", "Hm. Big words."] },
      { tone: 'flirt', fx: 'flirt', t: ["I looked for you from the podium. Just so you know.", "I'd have got up there faster if I'd known you were watching."], r: ["...Stop it.", "Ha. Liar. Keep going."] },
    ] },
  { id: 'pcSawBad', who: ['celeb'], where: ALL, crowd: true, w: 6, when: (x, n) => ok(x) && easy(n) && dnf(x) && !(n.talks > 1), open: [
    "I saw what happened tonight. Are you alright?", "I wanted to text, but I didn't know what to say. So I came instead.", "Everyone in the Paddock Club went quiet when your car stopped." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["I'm alright now. You being here helps.", "It stung. Thank you for coming."], r: ["Good. That's what I'm here for.", "Of course."], then: { say: ["Talk about it, or forget it for a night?", "Do you want to talk about it, or dance it off?"], opts: [
        { tone: 'light', fx: 'dance', t: ["Dance it off. Definitely.", "Forget it. Come and dance."], r: ["Good answer. Come on.", "Ha. Okay."] },
        { tone: 'kind', fx: 'deep', t: ["A bit. Then never again.", "Maybe a little. It helps saying it out loud."], r: ["Okay. A bit.", "Then say it."] },
        { tone: 'firm', t: ["It's done. Next one.", "Nothing to talk about. I'll fix it on track."], r: ["Okay.", "Okay. I believe you."] } ] } },
      { tone: 'firm', t: ["It happens. You go again.", "One bad night. It won't be the last."], r: ["That's very grown-up of you.", "Okay."] },
      { tone: 'light', t: ["I've decided it never happened. Keep up.", "My car needed a rest. Long season."], r: ["Ha. Okay. Never happened.", "Ha. Poor car."] },
      { tone: 'cold', t: ["I'd rather not talk about racing tonight.", "Can we not?"], r: ["Of course. Sorry.", "Of course."] },
    ] },
  { id: 'pcSawMid', who: ['celeb'], where: ALL, crowd: true, w: 3, when: (x, n) => ok(x) && easy(n) && (points(x) || backmarker(x)) && !(n.talks > 1), open: [
    "I don't understand the points, but '{result}' sounded good when they said it.", "I watched. I think you were the one in the middle? For ages?", "Someone explained tyre strategy to me for twenty minutes. I've forgotten all of it." ],
    opts: [
      { tone: 'light', t: ["The middle. For ages. That's racing.", "{result}. It's like a bronze medal, but further down."], r: ["Ha. Glamorous.", "Ha. I'll take your word for it."] },
      { tone: 'kind', fx: 'charm', t: ["You watched? That's really nice.", "Thank you for coming. Honestly."], r: ["Course. I wanted to.", "...Of course."] },
      { tone: 'show', t: ["Watch the next one. I'll be at the front.", "Next time you'll see me on the podium."], r: ["Promise?", "Hm. I'll hold you to it."] },
      { tone: 'flirt', fx: 'flirt', t: ["I'll explain the tyres. Slowly. Over a drink.", "Forget the tyres. You're here."], r: ["...That's a line.", "...Good answer."] },
    ] },
  // ---- what she is wearing (a compliment, nothing more) ------------------------------------------------------------------------------------
  { id: 'pcLook', who: ['celeb'], where: ALL, crowd: true, w: 3, when: (x, n) => ok(x) && easy(n), open: [
    "Be honest. Too much? My stylist said 'it's an after-party, go big'.", "I wasn't sure about the boots. Tell me the boots are right.", "I changed three times. This is the one that survived." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Not too much. You look great. Your stylist was right.", "It's perfect. Honestly."], r: ["...Thank you. I'll tell her she's won.", "...Okay. Good. Thank you."] },
      { tone: 'flirt', fx: 'flirt', t: ["You look incredible. I nearly walked into a pillar.", "The boots are right. Everything's right."], r: ["...You did, a bit. I saw.", "...Okay. Stop. Keep going."] },
      { tone: 'light', t: ["The boots are right. I'm in a suit I borrowed from my engineer.", "You survived better than me. I've got champagne on my shoe."], r: ["Ha. It shows.", "Ha. That's a racing driver's shoe."] },
      { tone: 'show', t: ["We match. We're the best-dressed pair in here.", "Stand next to me. We'll make every photo."], r: ["Hm. You're very sure of yourself.", "Ha. We'll see."] },
    ] },
  // ---- the music ----------------------------------------------------------------------------------------------------------------------
  { id: 'pcDJ', who: ['celeb'], where: CLUBS, crowd: true, w: 3, when: (x, n) => ok(x) && easy(n), open: [
    "This DJ is unreal. Are you a dancer, or one of those people who stands at the side?", "I love this one. Don't you dare say you don't know it.", "I've been on my feet since the race finished. My shoes hate me. I don't care." ],
    opts: [
      { tone: 'flirt', fx: ['dance', 'flirt'], t: ["I'm a dancer now. Come on.", "Show me how it's done."], r: ["...Okay. Come on.", "Ha. Try and keep up."] },
      { tone: 'light', fx: 'dance', t: ["I stand at the side. Professionally. ...Fine. One song.", "I dance like I drive. Late on the brakes."], r: ["Ha. One song.", "Ha. Prove it."] },
      { tone: 'kind', t: ["Never heard it. Tell me what it is.", "Your shoes have earned a sit down. Booth?"], r: ["Ha. You're hopeless. I love it.", "...Yes. Please."] },
      { tone: 'cold', t: ["Not really my music.", "I'm not a dancer."], r: ["...Shame.", "...Okay, then."], m: -1 },
    ] },
  // ---- her night -----------------------------------------------------------------------------------------------------------------------
  { id: 'pcNight', who: ['celeb'], where: CLUBS, crowd: true, w: 2.5, when: (x, n) => ok(x) && easy(n), open: [
    "I came with friends. They've vanished. You'll have to do.", "Somebody's paying for that table and it isn't me. I love it.", "My publicist told me to be seen. So. I'm being seen. With you." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Happy to do. Want a drink?", "Stay. I'll introduce you to everyone."], r: ["...Go on, then.", "Okay. Everyone."] },
      { tone: 'light', t: ["I'll do. Barely.", "I've been told I'm excellent at being seen."], r: ["Ha. You'll do.", "Ha. Prove it."] },
      { tone: 'flirt', fx: 'flirt', t: ["Lucky me, then.", "I'll take being seen with you."], r: ["...Smooth.", "...Okay."] },
      { tone: 'show', t: ["Being seen with me is very good for your publicist.", "Smart publicist."], r: ["Hm. Confident.", "Ha. Very."] },
    ] },
  // ---- a drink (only for someone old enough) ------------------------------------------------------------------------------------------------
  { id: 'pcDrink', who: ['celeb'], where: ALL, crowd: true, w: 2.5, when: (x, n) => ok(x) && easy(n) && adult(x), open: [
    "What are you drinking? No - let me guess. Something sensible.", "Champagne? You're the one with the result, you choose.", "I'm on my second of these. They're very pink and very strong." ],
    opts: [
      { tone: 'light', t: ["Water. I'm a professional athlete.", "Whatever's free. I'm a racing driver, not a millionaire."], r: ["Ha. Liar.", "Ha. Sure."] },
      { tone: 'kind', fx: 'charm', t: ["Whatever you're having.", "You pick. I trust you."], r: ["Dangerous. Okay.", "...Two pink ones, then."] },
      { tone: 'flirt', fx: 'flirt', t: ["Something that makes this last longer.", "I'll have what makes you smile like that."], r: ["...Smooth.", "...Careful."] },
      { tone: 'show', t: ["The best bottle in the house. Watch.", "Champagne. I've earned it."], r: ["Ooh. Okay.", "Ha. Of course."] },
    ] },
  // ---- you have had a few ----------------------------------------------------------------------------------------------------------------
  { id: 'pcWobbly', who: ['celeb'], where: ALL, crowd: true, w: 6, when: (x, n) => ok(x) && easy(n) && tier(x) >= 2, open: [
    "You're a bit wobbly, champion.", "How many have you had? You're doing the face.", "Someone's having a good night. Water?" ],
    opts: [
      { tone: 'kind', fx: 'water', t: ["You're right. Water. Will you mind me?", "Fair. Water, then I'm all yours."], r: ["...I'll mind you.", "Good. I'll wait."] },
      { tone: 'light', t: ["Wobbly is my natural state.", "I'm not wobbly. The floor's wobbly."], r: ["Ha. Sure.", "Ha. Is it?"] },
      { tone: 'flirt', fx: 'flirt', t: ["I'm wobbly because you're here.", "It's not the drink. It's you."], r: ["...Nice try.", "...That's the drink talking."], m: 0 },
      { tone: 'cold', t: ["I'm fine. Stop fussing.", "I can handle it."], r: ["...Okay.", "...Right."], m: -2 },
    ] },
  // ---- everyone is looking ----------------------------------------------------------------------------------------------------------------
  { id: 'pcLooked', who: ['celeb'], where: CLUBS, crowd: true, w: 2, when: (x, n) => ok(x) && easy(n) && !priv(x), open: [
    "Everyone keeps looking over here. Is it you or me?", "There were about forty photographers on the way in. I counted.", "Someone just filmed us. Smile." ],
    opts: [
      { tone: 'light', t: ["Definitely you. Nobody knows who I am out of the helmet.", "Forty? I counted forty-one. One was a lamppost."], r: ["Ha. Liar. Everyone knows.", "Ha. The lamppost had a good lens."] },
      { tone: 'kind', fx: 'charm', t: ["Want to go somewhere quieter? There's a terrace.", "Say the word and we'll get out of the way."], r: ["...In a bit. Maybe.", "...Maybe. Not yet."] },
      { tone: 'show', t: ["Let them look. We're the best thing in here.", "Smile. Give them a good one."], r: ["Hm. You enjoy this.", "Ha. Fine."] },
      { tone: 'firm', t: ["Let them. We're not doing anything.", "Ignore it. It's their job."], r: ["...Okay.", "...You're right."] },
    ] },
  // ---- the terrace: just the two of you (private) ----------------------------------------------------------------------------------------
  { id: 'pcTerrace', who: ['celeb'], where: ALL, w: 6, when: (x, n) => ok(x) && easy(n) && priv(x) && at(n, 'friendly', 'flirting', 'dating', 'partner'), open: [
    "It's so much quieter out here. I needed that.", "I can actually hear myself think. Don't make me regret it.", "Look at that. All those lights, and we're the only ones looking." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Me too. Inside's a lot.", "We can stay out here as long as you like."], r: ["...Good.", "Okay. A long time, then."], then: { say: ["Can I tell you something? I nearly didn't come tonight.", "Do you ever just want to disappear for an hour?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["I'm glad you did.", "All the time. Except right now."], r: ["...So am I.", "...Yeah. Except right now."] },
        { tone: 'flirt', fx: 'flirt', t: ["Disappear with me, then.", "I'd have come looking for you."], r: ["...Careful.", "...Would you?"] },
        { tone: 'light', t: ["We could. There's a fire exit. I checked.", "I disappear every Sunday. In a car, very fast."], r: ["Ha. Of course you checked.", "Ha. That's cheating."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["The only one I'm looking at is you.", "Better view out here. And I don't mean the lights."], r: ["...That was cheesy. It worked.", "...Stop it."] },
      { tone: 'light', t: ["It's quieter. Apart from the man throwing up in the plant pot.", "I came out here to hide from the influencer."], r: ["Ha! Don't look.", "Ha. Me too."] },
      { tone: 'firm', t: ["Take your time. I'm not going anywhere.", "No rush. Inside can wait."], r: ["...Thank you.", "Okay."] },
    ] },
  // ---- the kiss (PG: a cut-away and a caption; private, or brave on the floor) ---------------------------------------------------------------
  { id: 'pcKiss', who: ['celeb'], where: ALL, w: 7, when: (x, n) => ok(x) && easy(n) && priv(x) && rom(n) && !P(x).kissed, open: [
    "Come here. ...Is this alright?", "I've wanted to do this all night. Is that terrible?", "Nobody's watching. For once." ],
    opts: [
      { tone: 'flirt', fx: ['kiss', 'flirt'], t: ["[Kiss her]", "[Lean in]"], r: ["...Well. That was worth the wait.", "...Okay. Yes. That."] },
      { tone: 'kind', fx: 'charm', t: ["Not tonight. I want to do this properly. Not after a party.", "Let's not rush it. I like this too much."], r: ["...Okay. I like that, actually.", "...Okay. Properly."] },
      { tone: 'light', t: ["Hold on. Is that a photographer in that plant?", "Wait - I've got champagne on my lip."], r: ["Ha! It's a plant.", "Ha. Come here."] },
      { tone: 'cold', t: ["I don't think that's a good idea.", "We should go back in."], r: ["...Right. Sorry.", "...Okay."], m: -3 },
    ] },
  { id: 'pcKissFloor', who: ['celeb'], where: CLUBS, crowd: true, w: 5, when: (x, n) => ok(x) && easy(n) && rom(n) && !priv(x) && !P(x).kissed && (P(x).danced || []).includes(n.cid), open: [
    "That was fun. ...Everyone's watching, aren't they?", "You're a better dancer than you let on.", "Don't stop yet. One more." ],
    opts: [
      { tone: 'flirt', fx: ['kiss', 'flirt'], t: ["[Kiss her anyway]", "[Kiss her, right there]"], r: ["...Oh. Well. Everyone saw that.", "...You realise there are cameras."] },
      { tone: 'kind', fx: 'charm', t: ["[Take her hand] Terrace?", "Let's find somewhere quieter."], r: ["...Lead the way.", "...Yes."] },
      { tone: 'flirt', fx: ['dance', 'flirt'], t: ["One more. Then another.", "One more. I'm not done."], r: ["Ha. Come on, then.", "...Good."] },
      { tone: 'firm', t: ["Drink? I'm parched.", "Let's grab a drink."], r: ["...Okay.", "Sure."] },
    ] },
  // ---- leaving together (a shared car to her hotel; PG fade) -------------------------------------------------------------------------------
  { id: 'pcTogether', who: ['celeb'], where: ALL, w: 8, when: (x, n) => ok(x) && easy(n) && rom(n) && late(x), open: [
    "My hotel's on your way. Share a car?", "I'm going to call it. Walk me out?", "If I stay any longer I'll be here till the lights come up. Come with me?" ],
    opts: [
      { tone: 'kind', fx: 'together', t: ["I'll get us a car.", "Of course. Let's go."], r: ["...Good.", "...Okay. Come on."] },
      { tone: 'flirt', fx: ['together', 'flirt'], t: ["Lead the way.", "I was hoping you'd ask."], r: ["...Were you?", "...Come on, then."] },
      { tone: 'firm', t: ["I'll walk you to the car. Then I'm going back to my lot.", "Let me get you a car. I've got the team to see."], r: ["...Okay. That's sweet.", "...Okay."] },
      { tone: 'light', t: ["Only if I can pick the music.", "Ten more minutes. I'm winning at being here."], r: ["Ha. No.", "Ha. Fine. Ten."] },
    ] },
  // ---- the other woman you danced with (she noticed) -------------------------------------------------------------------------------------
  { id: 'pcSeen', who: ['celeb'], where: ALL, crowd: true, w: 9, when: (x, n) => ok(x) && rom(n) && (P(x).flirted || []).some((c) => c !== n.cid), open: [
    "Having fun? You looked like you were having fun. Over there.", "I saw you dancing. You looked very... happy.", "Who was that? Don't say 'nobody'." ],
    opts: [
      { tone: 'sorry', t: ["You're right. I got carried away. I'm sorry.", "That was thoughtless. Sorry."], r: ["...Okay. Thank you for saying it.", "...Okay."] },
      { tone: 'firm', fx: 'cover', t: ["A friend. That's all.", "Just a dance. Nothing more."], r: ["...A friend. Right.", "...If you say so."], m: -1 },
      { tone: 'kind', fx: 'charm', t: ["I'm here with you. That's what matters.", "You're the one I'm leaving with."], r: ["...Are you?", "...Good."] },
      { tone: 'cold', t: ["I'm allowed to dance.", "Don't start."], r: ["...Wow. Okay.", "...Right."], m: -3 },
    ] },
  // ---- your partner, out with you in public ------------------------------------------------------------------------------------------------
  { id: 'pcPartnerOut', who: ['celeb'], where: ALL, crowd: true, w: 4, when: (x, n) => ok(x) && isPartner(x, n), open: [
    "Our first after-party together. Everyone's staring.", "I'm proud of you. I'm allowed to say that in public now.", "Stay near me tonight. I don't know half these people." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["I'm not going anywhere.", "I'm proud you're here."], r: ["...Good.", "...Me too."] },
      { tone: 'flirt', fx: ['dance', 'flirt'], t: ["Let them stare. Dance with me.", "Come on. Give them something to look at."], r: ["...Okay.", "Ha. Come on, then."] },
      { tone: 'light', t: ["I don't know half these people either. I'm faking it.", "Stare back. It works."], r: ["Ha. Good.", "Ha. Okay."] },
      { tone: 'firm', t: ["I'll introduce you round. Starting with the boss.", "Stick with me. I'll do the names."], r: ["Okay. Deep breath.", "Okay."] },
    ] },
  // ---- an ex, here tonight (an awkward hello; the 'exnew' drama is the hard version) -------------------------------------------------------
  { id: 'pcExHello', who: ['celeb'], where: ALL, crowd: true, w: 6, when: (x, n) => ok(x) && isEx(x, n), open: [
    "Hi. This is... strange. Good strange?", "I didn't know you'd be here. I mean - obviously you'd be here.", "Well done tonight. I watched. Old habit." ],
    opts: [
      { tone: 'kind', fx: 'calm', t: ["Good to see you. Really.", "Thank you. You look well."], r: ["...You too.", "...Thanks. I am."] },
      { tone: 'light', t: ["Strange's my favourite kind.", "Old habits. I still check your work, too."], r: ["Ha. Yeah.", "...Do you? Ha."] },
      { tone: 'flirt', fx: 'flirt', t: ["I miss this. Is that allowed?", "You look amazing. That's allowed, right?"], r: ["Don't. Not tonight.", "...Please don't."], m: -2 },
      { tone: 'firm', t: ["Enjoy your night.", "Good to see you. Take care."], r: ["You too.", "You too."] },
    ] },
  // ---- the dance floor (an invitation, nothing more) --------------------------------------------------------------------------------------
  { id: 'pcDanceAsk', who: ['celeb'], where: CLUBS, crowd: true, w: 3, when: (x, n) => ok(x) && easy(n) && at(n, 'friendly', 'flirting', 'dating', 'partner') && n.talks > 0, open: [
    "One song. That's all I'm asking.", "You owe me a dance. I've decided.", "Come on. Nobody's watching. ...Everybody's watching." ],
    opts: [
      { tone: 'flirt', fx: ['dance', 'flirt'], t: ["One song. Then another.", "I've been waiting for you to ask."], r: ["...Good.", "Ha. Come on."] },
      { tone: 'light', fx: 'dance', t: ["I'm warning you, I dance like a pit stop. Fast and confusing.", "Fine. But I lead. Badly."], r: ["Ha. Perfect.", "Ha. Come on."] },
      { tone: 'kind', fx: 'dance', t: ["I'd love to.", "Of course."], r: ["...Good.", "Come on, then."] },
      { tone: 'firm', t: ["After this drink.", "Give me five minutes."], r: ["...Five. I'm counting.", "Okay. Five."] },
    ] },

  // ---- the stars, their own party lines ----------------------------------------------------------------------------------------------------
  { id: 'psJade', who: ['celeb'], where: VEGAS, crowd: true, w: 9, when: (x, n) => ok(x) && n.celebId === 'jade-okafor' && st(n) !== 'ex', open: [
    "Any requests? Don't say anything off the radio.", "Come up to the booth. Thirty seconds. Don't touch anything.", "I saw the race on my phone between soundchecks. Want your walk-on song?" ],
    opts: [
      { tone: 'kind', fx: 'charm', act: 'dj', t: ["Play something for the mechanics. They earned it.", "Something for the team. Whatever you like."], r: ["Ooh. I've got just the one.", "...Nice. For the team."] },
      { tone: 'show', act: 'dj', t: ["My walk-on song. Loud.", "Something with a drop. Then say my name."], r: ["Ha. Course.", "Ha. Watch this."] },
      { tone: 'flirt', fx: 'flirt', t: ["Play the one you'd put on for me.", "Surprise me. You usually do."], r: ["...Careful.", "...I will."] },
      { tone: 'light', t: ["Anything without bagpipes.", "The pit-lane speed-limiter beep. On repeat."], r: ["Ha. No promises.", "Ha! I'm sampling that."] },
    ] },
  { id: 'psMira', who: ['celeb'], where: VEGAS, crowd: true, w: 7, when: (x, n) => ok(x) && n.celebId === 'mira-vale' && st(n) !== 'ex', open: [
    "My residency's three floors down. I came up in my stage shoes. Big mistake.", "I've sung every night this week and I'd still rather be dancing.", "Two encores and a quick change. I'm still glittery." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Sit down. I'll get you a drink.", "Two encores and you still came? I'm honoured."], r: ["...You're a saint.", "...You should be."] },
      { tone: 'flirt', fx: ['dance', 'flirt'], t: ["Then dance. Shoes off if you need to.", "Dance with me. I'll carry the shoes."], r: ["...Okay. Shoes off.", "Ha. Deal."] },
      { tone: 'light', t: ["Glittery's a good look. Very podium.", "Stage shoes? I'm in race boots. Practically."], r: ["Ha. Thank you.", "Ha. Liar."] },
      { tone: 'show', t: ["Sing one for me later.", "Put tonight in a song."], r: ["Hm. Maybe.", "Ha. The ego."] },
    ] },
  { id: 'psAva', who: ['celeb'], where: CLUBS, crowd: true, w: 7, when: (x, n) => ok(x) && n.celebId === 'ava-rennick' && st(n) !== 'ex', open: [
    "Six cameras on the way in. I counted. Smile, they're still at the window.", "Everyone in here has seen the spy thing. Every single one.", "If anyone asks, we're discussing a role. I'm playing you." ],
    opts: [
      { tone: 'light', t: ["Playing me? You'll need a much bigger helmet.", "Do I get final cut?"], r: ["Ha. I'll manage.", "Ha. Absolutely not."] },
      { tone: 'flirt', fx: 'flirt', t: ["Let them look. You're worth looking at.", "Smile for them. Then come and dance."], r: ["...Smooth.", "...Okay. One."] },
      { tone: 'kind', fx: 'charm', t: ["Is it tiring? All of that?", "Do you ever get a night off from it?"], r: ["...Sometimes. Not tonight. Tonight's fun.", "...Tonight, sort of. Thanks for asking."] },
      { tone: 'show', t: ["Stand next to me. Best photo of the night.", "They're photographing me, actually."], r: ["Ha. Are they?", "Ha. Sure."] },
    ] },
  { id: 'psZoe', who: ['celeb'], where: CLUBS, crowd: true, w: 7, when: (x, n) => ok(x) && n.celebId === 'zoe-hartley' && st(n) !== 'ex', open: [
    "Chat wants to know if you're dancing. I told them you're a coward. Prove me wrong.", "I've clipped your onboard from tonight already. Chat has opinions.", "Is this what you lot do after a race? I thought you all went to bed." ],
    opts: [
      { tone: 'show', fx: 'dance', t: ["Tell chat to watch this.", "A coward? Hold my glass."], r: ["Ha! Chat's going mad.", "Ha. Here we go."] },
      { tone: 'light', t: ["Tell chat I brake for no one. Except stewards.", "Chat can come and say it to my face."], r: ["Ha. Clipping that.", "Ha. They're coming."] },
      { tone: 'kind', fx: 'charm', t: ["Tell chat I said hello.", "What does chat say? Be gentle."], r: ["They love you. Mostly.", "Ha. Gentle. Okay."] },
      { tone: 'flirt', fx: ['dance', 'flirt'], t: ["Turn the stream off and dance with me.", "No chat. Just us. One song."], r: ["...Chat would hate that. I don't.", "...Okay."] },
    ] },

  // =====================================================================================================================
  // the people who work the room (all invented). A rep's answers land by the brand's persona (fitM)
  // =====================================================================================================================
  // ---- a brand that wants you (no deal yet) ------------------------------------------------------------------------------------
  { id: 'repPitch', who: ['person'], role: 'rep', where: ALL, w: 6, when: (x, n) => ok(x) && !n.deal && !(tier(x) >= 2 && (n.heatMax ?? 100) <= 60), open: [
    "I'm {first} - {title} at {brand}. We want someone people actually talk about.", "Can I steal five minutes? {brand} is looking for a face for next season.", "I've been told you're the one to talk to tonight. {brand}. We should talk." ],
    opts: [
      { tone: 'show', fx: 'network', m: fitM('show'), t: ["Then you've found him. People never stop talking about me.", "Put me on a billboard and watch what happens."], r: ["Ha. That's the energy.", "...Okay. I like that."], then: { say: ["What would you do with a camera crew for a day?", "If we gave you a crew for a day, what's the film?"], opts: [
        { tone: 'show', fx: 'network', m: fitM('show'), t: ["Me, a car, the Strip at three in the morning. Loud.", "The onboard, no music. Then I take the helmet off and grin."], r: ["...I can see it. Loud is good.", "...That's a campaign."] },
        { tone: 'kind', fx: 'network', m: fitM('kind'), t: ["Film the mechanics. I'd just stand next to them.", "The fans at the fence. The kids. That's the film."], r: ["...That's lovely. Genuinely.", "Hm. Warm. I like warm."] },
        { tone: 'firm', fx: 'network', m: fitM('firm'), t: ["The work. Six in the morning in the gym. No filters.", "Nobody films the work. Film the work."], r: ["Serious. Okay.", "...Honest. Good."] },
        { tone: 'light', m: fitM('light'), t: ["A cooking show. I can't cook. That's the show.", "Twelve hours of me failing to parallel park."], r: ["Ha. I'd watch it.", "Ha. Somebody would."] } ] } },
      { tone: 'kind', fx: 'network', m: fitM('kind'), t: ["I'm flattered. Tell me about {brand}.", "I'd love to hear it. What are you building?"], r: ["A {product} people actually care about. With the right face.", "Something bigger than an advert. Ask me what."], then: { say: ["What do you want out of a partner? Honestly.", "What matters to you, in a deal?"], opts: [
        { tone: 'kind', fx: 'network', m: fitM('kind'), t: ["People I like working with. The money's second.", "Something I'd actually use. I won't fake it."], r: ["...That's rare. And good.", "Good. We'd never ask you to."] },
        { tone: 'firm', fx: 'network', m: fitM('firm'), t: ["Clear terms. No surprises. I deliver, you deliver.", "Respect for race weeks. The racing comes first."], r: ["Clear. I like clear.", "Of course. Always."] },
        { tone: 'show', fx: 'network', m: fitM('show'), t: ["Big. If I'm doing it, it's everywhere.", "Freedom. Let me be myself and you'll sell out."], r: ["Ha. Big we can do.", "...Bold. Okay."] },
        { tone: 'flirt', m: fitM('flirt'), t: ["A launch party like this one. Every month.", "Free {product}. For life."], r: ["Ha. Nice try.", "Ha. Negotiable."] } ] } },
      { tone: 'firm', fx: 'network', m: fitM('firm'), t: ["Send it to my people. But I'm listening.", "I'm listening. What does it look like?"], r: ["Good. I'll send it on Monday.", "Two years, global, and a launch. Interested?"] },
      { tone: 'light', m: fitM('light'), t: ["Five minutes. Then I want to dance.", "Is this the part where you hand me a free {product}?"], r: ["Ha. Four, then.", "Ha. There's a box in the car."] },
      { tone: 'cold', m: fitM('cold'), t: ["Not tonight. I'm off duty.", "Talk to my agent."], r: ["...Of course. Enjoy your night.", "...Right. We will."] },
    ] },
  // ---- the brand you are with (thank-you, and a photo for the brand) ---------------------------------------------------------------------
  { id: 'repDeal', who: ['person'], role: 'rep', where: ALL, w: 6, when: (x, n) => ok(x) && !!n.deal && !cool(x, n), open: [
    "Thank you for coming tonight. It means a lot to us.", "There he is. Our favourite driver. Don't tell the others.", "{result}! The office went mad. I've had forty messages." ],
    opts: [
      { tone: 'kind', fx: 'network', m: fitM('kind'), t: ["Wouldn't miss it. You've been brilliant to work with.", "Thank you for having me. Honestly."], r: ["...That's very kind. Same.", "Any time. You're family now."], then: { say: ["Can we grab a photo for the brand? Two minutes.", "One for our socials? You and the {product}?"], opts: [
        { tone: 'kind', fx: ['selfie', 'network'], act: 'photo', m: fitM('kind'), t: ["Of course. Where do you want me?", "Go on. Make me look good."], r: ["By the wall. Perfect.", "Easy. You always do."] },
        { tone: 'show', fx: ['selfie', 'network'], act: 'photo', m: fitM('show'), t: ["Two? Give me one. I'm a natural.", "Get the good camera."], r: ["Ha. You are.", "Ha. Done."] },
        { tone: 'firm', m: fitM('firm'), t: ["Monday. Not tonight. I look like a race.", "Let me do it properly on Monday."], r: ["...Okay. Monday.", "Fair. Monday."] } ] } },
      { tone: 'show', fx: 'network', m: fitM('show'), t: ["Best decision you ever made, signing me.", "Your sales are about to go through the roof."], r: ["Ha. Let's hope.", "Ha. From your mouth."] },
      { tone: 'light', m: fitM('light'), t: ["Forty? Only forty? I'm disappointed.", "Tell the office I want a statue."], r: ["Ha. Forty-one now.", "Ha. A small one."] },
      { tone: 'firm', fx: 'network', m: fitM('firm'), t: ["Glad it's working. Let's talk next season soon.", "Good. Let's keep it going."], r: ["...Yes. Let's.", "Definitely."] },
    ] },
  // ---- tonight is the brand's own party (a contractual appearance) ---------------------------------------------------------------------
  { id: 'repHost', who: ['person'], role: 'rep', where: CLUBS, w: 8, when: (x, n) => ok(x) && !!n.contractual, open: [
    "It's our night. Do you mind doing the wall with our CEO? Two minutes.", "Thank you for showing up. The CEO's in the third booth. She wants to meet you.", "Everyone's here for you tonight. No pressure." ],
    opts: [
      { tone: 'kind', fx: ['network', 'selfie'], act: 'photo', m: fitM('kind', 1), t: ["Of course. Lead the way.", "Happy to. Introduce me."], r: ["You're a star. Thank you.", "Perfect. This way."] },
      { tone: 'show', fx: ['network', 'selfie'], act: 'photo', m: fitM('show', 1), t: ["Two minutes? I'll do ten. Let's give them a show.", "Point me at the cameras."], r: ["Ha. That's the spirit.", "...She's going to love you."] },
      { tone: 'firm', fx: 'network', m: fitM('firm'), t: ["Wall, CEO, then I'm off duty. Deal?", "Two minutes. Then I'm with my team."], r: ["Deal.", "Fair."] },
      { tone: 'cold', m: fitM('cold', -2), t: ["Can it wait? I've just got here.", "Later. I need a drink first."], r: ["...Of course. She's leaving at one.", "...Right. Soon, please."] },
    ] },
  // ---- the product ---------------------------------------------------------------------------------------------------------------------
  { id: 'repProduct', who: ['person'], role: 'rep', where: ALL, w: 3, when: (x, n) => ok(x) && !!n.brandName && !cool(x, n), open: [
    "Have you tried the new {product}? Be honest. I won't tell the board.", "Everyone in here's wearing, holding or drinking something of ours. Look.", "What would make you use a {product} every day? Asking for a strategy deck." ],
    opts: [
      { tone: 'kind', fx: 'network', m: fitM('kind'), t: ["I have. It's good. I'm not just saying that.", "It's genuinely good. My trainer's got one."], r: ["...Thank you. You've made my week.", "Ha. Tell your trainer thanks."] },
      { tone: 'show', m: fitM('show'), t: ["Put my face on it and you'll sell twice as many.", "It'd look better with my number on it."], r: ["Ha. That's the plan.", "...Write that down, somebody."] },
      { tone: 'light', m: fitM('light'), t: ["I've tried it. I don't understand it. That's on me.", "I'd use it every day if it came with a nap."], r: ["Ha. Fair.", "Ha. We're working on it."] },
      { tone: 'firm', m: fitM('firm'), t: ["Make it last. People want things that last.", "Quality. Everyone says it. Few deliver."], r: ["...Noted. Seriously.", "Fair point."] },
    ] },
  // ---- the persona test (they are deciding what you are) ----------------------------------------------------------------------------------
  { id: 'repTest', who: ['person'], role: 'rep', where: ALL, w: 4, when: (x, n) => ok(x) && !n.deal && n.talks > 0 && !cool(x, n), open: [
    "Quick question, and there's no wrong answer. ...There's a wrong answer.", "What do you do the night before a race? Our audience wants to know.", "If you weren't a driver, what would you be? Gut answer." ],
    opts: [
      { tone: 'show', fx: 'network', m: fitM('show'), t: ["A rock star. Same job, worse helmets.", "Famous for something else. Same face."], r: ["Ha. I can sell that.", "...Okay. That's a poster."] },
      { tone: 'kind', fx: 'network', m: fitM('kind'), t: ["A teacher. My old coach changed my life.", "Something with kids. Karting, probably. Teaching it."], r: ["...That's lovely.", "...I didn't expect that. Good."] },
      { tone: 'firm', fx: 'network', m: fitM('firm'), t: ["An engineer. I'd still be at the track.", "Training someone else to win. Same obsession."], r: ["Serious. Good.", "Driven. I like driven."] },
      { tone: 'flirt', fx: 'network', m: fitM('flirt'), t: ["Something slow, black and white, with a lot of staring.", "A man in an advert, walking out of the sea in a shirt."], r: ["...Ha. You've seen our campaigns.", "...That's oddly specific. Keep talking."] },
    ] },
  // ---- they have seen you have a few (a conservative brand) -------------------------------------------------------------------------------
  { id: 'repCool', who: ['person'], role: 'rep', where: ALL, w: 12, when: (x, n) => ok(x) && tier(x) >= 2 && (n.heatMax ?? 100) <= 60, open: [
    "Lovely to see you. We'll pick this up another time, I think.", "You're... enjoying yourself. Good. Shall we talk on Monday?", "I'm heading off. Do drink some water." ],
    opts: [
      { tone: 'sorry', m: -1, t: ["You're right. Monday. Sorry - big night.", "Fair. I'll call you. Properly."], r: ["Monday. Look after yourself.", "...Yes. Monday."] },
      { tone: 'firm', m: -2, t: ["I'm fine. Honestly. Five minutes.", "Let's talk now. I'm sharp."], r: ["...Monday, I think.", "...Another time."] },
      { tone: 'light', m: -2, t: ["Is it that obvious?", "I'm celebrating. It's in the contract."], r: ["...A little.", "...It isn't, actually."] },
      { tone: 'show', m: -3, t: ["Relax. It's a party. You should try it.", "Loosen up. Have a drink with me."], r: ["...Goodnight.", "...I don't think so."] },
    ] },
  // ---- the race, as their guests saw it from the brand's suite ----------------------------------------------------------------------------
  { id: 'repRace', who: ['person'], role: 'rep', where: ALL, w: 3, when: (x, n) => ok(x) && !cool(x, n), open: [
    "We had two hundred guests watching in our suite tonight. You made them very loud.", "I watched the whole {gp} from our hospitality. Talk me through the start?", "Our guests couldn't take their eyes off the screens. What's it like from inside?" ],
    opts: [
      { tone: 'kind', fx: 'network', m: fitM('kind'), t: ["Tell them thank you. The noise gets through, honestly.", "I'd love to come up and say hello to them one day."], r: ["...Would you? They'd lose their minds.", "...I'm holding you to that."] },
      { tone: 'show', fx: 'network', m: fitM('show'), t: ["The start? I just decided nobody was getting past.", "Inside it's simple. Brake later than everyone else."], r: ["Ha. That's a line we could use.", "...Can I quote you on that? Officially."] },
      { tone: 'firm', m: fitM('firm'), t: ["Busy. Tyres, fuel, the gaps. You don't hear the crowd.", "It's work. Two hours of it. Then this."], r: ["...Fascinating. Genuinely.", "Hm. Serious. I like that."] },
      { tone: 'light', m: fitM('light'), t: ["Mostly I'm thinking about the next corner. And dinner.", "Loud. Very loud. And my neck hurts."], r: ["Ha. Relatable.", "Ha. We'll send a masseur."] },
    ] },
  // ---- a photo for the brand's socials (a brand still courting you; never in London, where the cameras are stickered) ----------------------
  { id: 'repPhoto', who: ['person'], role: 'rep', where: ALL, w: 3, when: (x, n) => ok(x) && P(x).phones !== false && !n.deal && !n.contractual && !cool(x, n), open: [
    "Would you mind one photo with me? For our socials. The team would be thrilled.", "Our content lead is right there. One picture? Thirty seconds, I promise.", "Could we get a quick photo? No logos, just the night." ],
    opts: [
      { tone: 'kind', fx: ['selfie', 'network'], act: 'photo', m: fitM('kind'), t: ["Of course. Come on.", "Sure. Where's the light best?"], r: ["Thank you. That's very generous.", "By the bar. Perfect."] },
      { tone: 'show', fx: ['selfie', 'network'], act: 'photo', m: fitM('show'), t: ["One? Take ten. Get my good side.", "Get the whole booth in. Make it look like a party."], r: ["Ha. Both sides are good.", "...Now that's content."] },
      { tone: 'firm', m: fitM('firm'), t: ["Not tonight. Nothing branded until we've signed something.", "My agent would kill me. Monday."], r: ["...Fair. Very professional.", "...Monday it is."] },
      { tone: 'cold', m: fitM('cold'), t: ["I'm off the clock. Sorry.", "No photos tonight."], r: ["...Of course. Enjoy your night.", "...Understood."] },
    ] },
  // ---- a glass at the brand's table (you are old enough, and still standing) -------------------------------------------------------------
  { id: 'repDrink', who: ['person'], role: 'rep', where: ALL, w: 3, when: (x, n) => ok(x) && adult(x) && !cool(x, n) && tier(x) < 3, open: [
    "Come and have a glass at our table. We've got far too much champagne.", "What are you drinking? It's on {brand} tonight.", "There's a bottle open in our booth with your name on it. Literally - the server wrote it on." ],
    opts: [
      { tone: 'kind', fx: 'network', m: fitM('kind'), t: ["Go on then. One glass.", "Lovely. Just the one - it's been a long day."], r: ["Perfect. This way.", "...One. We'll see."] },
      { tone: 'show', fx: 'network', m: fitM('show'), t: ["Bring it to my booth. Bring the whole table.", "Only if it's the big bottle."], r: ["Ha. Done.", "...I like your style."] },
      { tone: 'firm', fx: 'water', m: fitM('firm', 1), t: ["Water for me, thanks. But I'll sit with you.", "Something soft. I'm pacing myself."], r: ["...Sensible. I respect that.", "...Of course. Sparkling?"] },
      { tone: 'light', m: fitM('light'), t: ["Is this how you sign people? Champagne and flattery?", "Careful. I agree to things after two glasses."], r: ["Ha. It usually works.", "...Noted. Three, then."] },
    ] },

  // ---- an agent (market gossip about invented people; your own drivers are the business) -------------------------------------------------
  { id: 'agtMarket', who: ['person'], role: 'agent', where: ALL, w: 5, when: (x) => ok(x), open: [
    "Market's moving. Two teams want a seat filled before the summer. I know which two.", "Silly season's early this year. Somebody in this room is moving. Several somebodies.", "I've had three teams call me since the flag. Three. Tonight." ],
    opts: [
      { tone: 'gossip', fx: 'network', t: ["Go on. Who?", "Off the record. Which two?"], r: ["Off the record? ...I'll text you.", "Ha. Buy me a drink and I'll tell you one."], then: { say: ["What are you after, as a team? Speed, or someone the sponsors love?", "If I brought you someone, what would you want?"], opts: [
        { tone: 'firm', fx: 'network', t: ["Speed. Everything else follows.", "Someone hungry. Quick and hungry."], r: ["Speed costs.", "Hungry I've got. Two of them."] },
        { tone: 'kind', fx: 'network', t: ["Someone who'll fit in the garage. The team matters.", "A good team-mate. I've had the other kind."], r: ["...Rare thing to ask for. I like it.", "Ha. Haven't we all."] },
        { tone: 'show', t: ["Someone almost as good as me.", "Someone who makes me look even better."], r: ["Ha. Short list.", "Ha. Shorter list."] } ] } },
      { tone: 'firm', fx: 'network', t: ["Send me names. I'm always listening.", "Put it in an email. I read everything."], r: ["Monday morning.", "You'll have it before you land."] },
      { tone: 'light', t: ["Three teams? Was one of them mine?", "Do agents ever sleep?"], r: ["Ha. Maybe.", "Ha. Never. It's bad for business."] },
      { tone: 'cold', t: ["I don't talk business at parties.", "Not tonight."], r: ["...Everyone talks business at parties.", "...Fair enough."] },
    ] },
  { id: 'agtClients', who: ['person'], role: 'agent', where: ALL, w: 5, when: (x, n) => ok(x) && (n.clients || []).length > 0, open: [
    "Two of my lads would take a call from you. {client} for one.", "You should talk to {client}. Fast, cheap, and he'd crawl over glass for a seat.", "{client}'s contract is up at the end of the year. Just saying." ],
    opts: [
      { tone: 'kind', fx: 'network', t: ["I'll call. Seriously. Send me his numbers.", "I'd like to meet him. Properly."], r: ["Done. You won't regret it.", "I'll set it up."] },
      { tone: 'firm', fx: 'network', t: ["What's he asking?", "How much, and how long?"], r: ["Less than you think. Two years.", "Reasonable. For you, very reasonable."] },
      { tone: 'light', t: ["Over glass? I'll hold you to that.", "Does he come with a discount?"], r: ["Ha. Figure of speech.", "Ha. Buy two, get one free."] },
      { tone: 'cold', t: ["I'm happy with my drivers.", "Not interested."], r: ["...For now.", "...Everyone says that."], m: -1 },
    ] },
  { id: 'agtYou', who: ['person'], role: 'agent', where: ALL, w: 3, when: (x) => ok(x), open: [
    "Who looks after you these days? Just asking.", "If you ever want representation, I'm told I'm very annoying on a client's behalf.", "Driver and owner. Brave. Who negotiates with you? You?" ],
    opts: [
      { tone: 'light', t: ["I do. I'm a nightmare. I keep saying no to myself.", "Myself. I'm very tough on me."], r: ["Ha. Classic.", "Ha. You need me."] },
      { tone: 'kind', fx: 'network', t: ["Good to know. Keep my number.", "I might take you up on that one day."], r: ["Always.", "I'll be here."] },
      { tone: 'firm', t: ["I'm covered. Thanks.", "All sorted."], r: ["Of course.", "The offer stands."] },
      { tone: 'show', t: ["Nobody can afford me. Including me.", "I'd be your biggest client."], r: ["Ha. Try me.", "Ha. You would."] },
    ] },
  { id: 'agtDrink', who: ['person'], role: 'agent', where: ALL, w: 2, when: (x) => ok(x) && adult(x), open: [
    "Let me buy you a drink. I buy everyone a drink. It's how I work.", "You've got the face of a man who needs a drink and a contract.", "What are you on? I'll get the next one." ],
    opts: [
      { tone: 'kind', fx: 'network', t: ["Go on, then. Thanks.", "Very kind. Cheers."], r: ["Pleasure.", "Cheers."] },
      { tone: 'firm', t: ["I'm fine. Water's good.", "I'm pacing myself."], r: ["Sensible.", "Smart."] },
      { tone: 'light', t: ["A drink, yes. The contract, maybe.", "A drink. Hold the contract."], r: ["Ha. One at a time.", "Ha. Fair."] },
    ] },

  // ---- the Paddock Post's diary columnist ------------------------------------------------------------------------------------------------
  { id: 'colCar', who: ['person'], role: 'press', where: ALL, w: 6, when: (x) => ok(x), open: [
    "Off the record. How's the car, really?", "Strictly between us - is the new floor working?", "Everyone says your car's a handful in the slow stuff. Is it?" ],
    opts: [
      { tone: 'firm', t: ["It's a racing car. It goes round corners.", "We're happy with the direction. On and off the record."], r: ["...Spoken like a press release.", "...Of course you are."] },
      { tone: 'kind', fx: 'network', t: ["Off the record? It's getting better every week. On the record too.", "Ask me after the next race. I'll have something for you."], r: ["...Charming. I'll hold you to that.", "Deal. I'll find you."] },
      { tone: 'gossip', fx: 'loose', leak: true, m: 2, t: ["Between us? It's a pig in the slow stuff.", "Between us, the upgrade's done nothing. Nothing."], r: ["...Is it now? Interesting.", "...Between us. Of course."] },
      { tone: 'cold', t: ["Nice try.", "Ask the team."], r: ["Worth a go.", "I did. They said ask you."], m: -1 },
    ] },
  { id: 'colWho', who: ['person'], role: 'press', where: CLUBS, w: 4, when: (x) => ok(x), open: [
    "Who's the lady at the host's table? For the diary. I'm joking. Mostly.", "You arrived with a smile and a very famous plus-one. Care to comment?", "Somebody's very popular tonight. The diary has a space on Monday." ],
    opts: [
      { tone: 'firm', fx: 'cover', t: ["Friends. Lots of them. Good night for it.", "Just friends celebrating. Write that."], r: ["...Friends. Lovely.", "...I'll write something."] },
      { tone: 'light', t: ["My plus-one's my engineer. He scrubs up.", "The lady is my mum. Hi, Mum."], r: ["Ha. Nice try.", "Ha. Very good."] },
      { tone: 'kind', fx: 'network', t: ["Write about the team. They deserve the column.", "Give the mechanics a paragraph. They earned it."], r: ["...That's actually a nice line.", "Hm. Maybe I will."] },
      { tone: 'cold', t: ["No comment.", "Leave my private life out of it."], r: ["That's a comment.", "Of course."], m: -1 },
    ] },
  { id: 'colLine', who: ['person'], role: 'press', where: ALL, w: 4, when: (x) => ok(x), open: [
    "Give me one line for Monday's diary. Anything. Make it good.", "What's the after-party like from the inside? One sentence.", "My editor wants colour. Give me colour." ],
    opts: [
      { tone: 'show', fx: 'network', t: ["'The best party on the calendar, and I'm the reason.' Print that.", "'Get used to seeing me here.'"], r: ["...Oh, that'll go.", "Ha. That'll do nicely."] },
      { tone: 'kind', fx: 'network', t: ["'Proud of every person in that garage tonight.'", "'The mechanics are the stars. Write their names.'"], r: ["...Nice. Wholesome.", "...You're very good at this."] },
      { tone: 'light', fx: 'network', t: ["'Racing driver dances. Badly. More at eleven.'", "'Driver seen near a buffet. Sources say sliders.'"], r: ["Ha. Perfect.", "Ha. Running it."] },
      { tone: 'firm', t: ["'Focused on the next race.' There you go.", "'No comment, but nicely.'"], r: ["...Riveting.", "...Thank you so much."] },
    ] },
  { id: 'colMate', who: ['person'], role: 'press', where: ALL, w: 3, when: (x) => ok(x) && !!P(x).mateName, open: [
    "Your team-mate looked furious on the slow-down lap. Anything I should know?", "Is everything alright between you and {mate}? Asking for my readers.", "{mate} said something interesting to me earlier. Want to hear it?" ],
    opts: [
      { tone: 'firm', t: ["We're fine. We race hard. That's all it is.", "All good. Ask him yourself."], r: ["...Of course.", "I did. He said ask you."] },
      { tone: 'gossip', fx: 'loose', m: 2, t: ["Between us? He's not happy with the call. Nor would I be.", "He's been quiet since lap forty. Don't print that."], r: ["...Thank you.", "...Wouldn't dream of it."] },
      { tone: 'kind', t: ["He drove brilliantly. Write that.", "We're good. Best team-mate I've had."], r: ["...How nice.", "...Noted."] },
      { tone: 'cold', t: ["Nice try.", "No."], r: ["Worth a go.", "Fair."], m: -1 },
    ] },
  { id: 'colFun', who: ['person'], role: 'press', where: ALL, w: 6, when: (x) => ok(x) && tier(x) >= 2, open: [
    "You're in good form tonight. Can I quote you on anything?", "Having fun? You look like you're having fun.", "My favourite part of the night: when everyone starts being honest." ],
    opts: [
      { tone: 'firm', fx: 'water', t: ["I'll quote you: 'he was drinking water'. Watch.", "Nice try. Water, please, barman."], r: ["...Very disciplined.", "...Ha. Spoilsport."] },
      { tone: 'gossip', fx: 'loose', m: 2, t: ["Honest? The stewards flip a coin. I've seen it.", "Honestly? Half this paddock couldn't find the apex with a map."], r: ["...Thank you. Genuinely.", "...Oh, that's lovely."] },
      { tone: 'light', t: ["Quote me: 'what a night'. That's it.", "I'm always in good form."], r: ["...You're no fun.", "Ha. So I see."] },
      { tone: 'cold', t: ["Off the record. All of it.", "Nothing's on the record tonight."], r: ["...Of course.", "...As you say."] },
    ] },

  // ---- an influencer, filming -------------------------------------------------------------------------------------------------------------
  { id: 'infVideo', who: ['person'], role: 'infl', where: ALL, w: 6, when: (x) => ok(x) && P(x).phones !== false, open: [
    "One video, thirty seconds. My followers would die.", "Can you say hi to my followers? It's a lot of followers.", "Okay, I'm live. Say something racing-y." ],
    opts: [
      { tone: 'show', fx: ['selfie', 'network'], t: ["Hello, everyone. Yes, it's me. Yes, I'm that good.", "Thirty seconds? I'll do a minute."], r: ["Oh my god. Perfect.", "Ha! They're going mad."] },
      { tone: 'kind', fx: 'selfie', t: ["Go on. Hi, everyone - thanks for watching tonight.", "Course. Hi, everyone. Good night, wasn't it?"], r: ["Aw. They love you.", "Aw. Perfect."] },
      { tone: 'light', fx: 'selfie', t: ["Racing-y? ...Vroom.", "Brake late, turn in, hope."], r: ["Ha! Iconic.", "Ha. That's going viral."] },
      { tone: 'firm', t: ["Not tonight, sorry. No phones.", "I'm off duty. Another time."], r: ["...Oh. Okay.", "...Fair."], m: -1 },
    ] },
  { id: 'infRate', who: ['person'], role: 'infl', where: CLUBS, w: 3, when: (x) => ok(x) && P(x).phones !== false, open: [
    "Rate the club out of ten. On camera. Go.", "Who's the best dancer on the grid? Be honest, I'm recording.", "Tell my followers one secret. A small one." ],
    opts: [
      { tone: 'light', fx: 'selfie', t: ["Eight. Minus two for the lighting on my face.", "The best dancer on the grid is me. Next question."], r: ["Ha! Love it.", "Ha. Clip of the night."] },
      { tone: 'show', fx: 'selfie', t: ["Ten. Because I'm here.", "Secret: I'm the quickest person in this room. On foot, too."], r: ["Oh my god.", "Ha. Iconic."] },
      { tone: 'kind', fx: 'selfie', t: ["Ten. Great people, great music.", "Secret: the mechanics are the real heroes."], r: ["Aw. Wholesome.", "Aw."] },
      { tone: 'cold', t: ["Put it away, please.", "Not on camera."], r: ["...Fine.", "...Okay."], m: -1 },
    ] },
  { id: 'infShoey', who: ['person'], role: 'infl', where: ALL, w: 6, when: (x) => ok(x) && podium(x) && adult(x) && !P(x).shoey && P(x).phones !== false, open: [
    "Shoey. On camera. Please. It'll do ten million.", "You know what my followers want. The shoe.", "Podium means shoey. Those are the rules. I'm recording." ],
    opts: [
      { tone: 'show', fx: ['shoey', 'selfie'], t: ["Give me a shoe. Anyone's.", "For ten million? Hand it over."], r: ["OH MY GOD.", "Ha! Here we go!"] },
      { tone: 'light', fx: ['shoey', 'selfie'], t: ["Only if it's your shoe.", "Fine. But I'm wearing the shoe after."], r: ["Ha! Deal!", "Ha! Gross! Do it!"] },
      { tone: 'firm', t: ["Absolutely not.", "No shoes. I have a sponsor dinner tomorrow."], r: ["Boo!", "...Boring!"], m: -1 },
      { tone: 'kind', t: ["Later, with the team. That one's for them.", "I'm saving it for the mechanics."], r: ["...Aw. Fair.", "...Respect."] },
    ] },
  { id: 'infDrive', who: ['person'], role: 'infl', where: ALL, w: 3, when: (x) => ok(x), open: [
    "Teach me how to drive fast. One sentence. Go.", "What's the scariest bit of a race? Be honest.", "Do you ever look at your phone during a race? Joking. Unless?" ],
    opts: [
      { tone: 'firm', fx: 'network', t: ["Look where you want to go, not where you're going.", "Brake once, brake hard, then trust it."], r: ["...That's deep.", "...Wow. Okay. Clip."] },
      { tone: 'light', t: ["Go left, then right, then left. Faster than everyone.", "Phone? I check the group chat at every red flag."], r: ["Ha!", "Ha. Is that true?"] },
      { tone: 'kind', fx: 'network', t: ["Lap one. Twenty cars, one corner. Every time.", "The start. Your heart's going like this."], r: ["...Okay, that's scary.", "...Oh my god."] },
      { tone: 'show', t: ["Nothing scares me. That's why I'm fast.", "Scary? For the others, maybe."], r: ["Ha. Confident.", "Ooh."] },
    ] },
  { id: 'infBack', who: ['person'], role: 'infl', where: ALL, w: 2, when: (x) => ok(x), open: [
    "Will you follow me back? It's for my mum. She's a huge fan.", "Can I tag you? Just once. Okay, three times.", "I've filmed you four times tonight and you look good in all of them." ],
    opts: [
      { tone: 'kind', fx: 'network', t: ["Course. Say hi to your mum.", "Tag away."], r: ["Aw! She'll cry.", "Yes!"] },
      { tone: 'light', t: ["Four? Delete the one where I'm eating.", "Only the good ones. If there are any."], r: ["Ha. Never.", "Ha. They're all good."] },
      { tone: 'firm', t: ["Maybe. Let's see the videos first.", "Send me what you post."], r: ["Deal.", "Okay!"] },
    ] },
  // ---- London: a stickered camera (no phones inside the Vault) -----------------------------------------------------------------------------
  { id: 'infStickers', who: ['person'], role: 'infl', where: ALL, w: 6, when: (x) => ok(x) && P(x).phones === false, open: [
    "They put a sticker over my camera at the door. My followers think I've been kidnapped.", "No phones, no content. I've never felt so free. ...I hate it.", "Do you know how hard it is to be an influencer in a room with no cameras?" ],
    opts: [
      { tone: 'light', t: ["Welcome to real life. It's quite nice here.", "You'll survive. Probably."], r: ["Ha. It's terrifying.", "...Ha. Barely."] },
      { tone: 'kind', fx: 'network', t: ["Come to a race. I'll get you in the paddock - cameras allowed.", "Give me your handle. We'll do something properly another time."], r: ["...Wait, really? Deal.", "...You're actually nice. Annoying."] },
      { tone: 'show', t: ["Just describe me to them. Use big words.", "Tell them you met me. They'll believe you."], r: ["Ha. 'Tall-ish.'", "...They will. Sadly."] },
      { tone: 'firm', t: ["Good. Some nights should just happen.", "I like it. Nobody filming means everybody talks."], r: ["...Hm. Fair.", "...That's quite deep for a nightclub."] },
    ] },

  // ---- the resident DJ (Jade Okafor plays it when she is in town: she has her own lines above) ------------------------------------------------
  { id: 'djReq', who: ['person'], role: 'dj', where: CLUBS, w: 5, when: (x) => ok(x), open: [
    "Any requests? Don't say anything off the radio.", "You're the driver, right? Got a walk-on song?", "I'll play anything except the one you're about to ask for." ],
    opts: [
      { tone: 'kind', act: 'dj', t: ["Something for the team. They earned it.", "Play something for the mechanics."], r: ["Got just the one.", "Nice. For the crew."] },
      { tone: 'show', act: 'dj', t: ["My walk-on song. Loud. Say my name.", "Something with a drop. Then shout me out."], r: ["Ha. Course.", "Ha. You got it."] },
      { tone: 'light', t: ["Anything with a key change.", "The pit-lane speed limiter. On repeat."], r: ["Ha. No.", "Ha. I'll sample it."] },
      { tone: 'firm', t: ["Whatever keeps the floor full.", "You're the expert. Your call."], r: ["Respect.", "Good answer."] },
    ] },
  { id: 'djRace', who: ['person'], role: 'dj', where: CLUBS, w: 3, when: (x) => ok(x), open: [
    "Watched the race on my phone between soundchecks. That restart!", "I had the race on the monitor all night. Missed a cue. Worth it.", "The whole room was watching the screens at the end. Mad." ],
    opts: [
      { tone: 'kind', t: ["Thanks for watching. Means a lot.", "Glad you enjoyed it."], r: ["Course.", "Loved it."] },
      { tone: 'light', t: ["You missed a cue? I missed a braking point.", "Sorry about the cue."], r: ["Ha. Even.", "Ha. Worth it."] },
      { tone: 'show', t: ["Best restart of the year. Mine.", "Wait till next time."], r: ["Ha. Big night for you.", "Ha. Can't wait."] },
    ] },
  { id: 'djBooth', who: ['person'], role: 'dj', where: CLUBS, w: 3, when: (x) => ok(x), open: [
    "Come up. Hit this button when I point. Don't touch anything else.", "Want to drop the next one? It's one button. Even a driver can do it.", "Stand here. Wave. They'll go mad." ],
    opts: [
      { tone: 'show', act: 'dj', t: ["Point. I'm ready.", "Watch this. Lights out."], r: ["Three, two... now!", "Ha! Listen to them!"] },
      { tone: 'light', t: ["What if I press the wrong one?", "Is there a pit limiter on this?"], r: ["Then we have a silent disco.", "Ha. No."] },
      { tone: 'kind', t: ["Thanks. That's brilliant.", "Go on, then. Thanks."], r: ["Pleasure.", "Any time."] },
      { tone: 'firm', t: ["Better not. I'll leave it to the pro.", "Your booth. Your job."], r: ["Respect.", "Fair."] },
    ] },
  { id: 'djLate', who: ['person'], role: 'dj', where: CLUBS, w: 5, when: (x) => ok(x) && late(x), open: [
    "Last hour. I'm playing the ones everyone pretends not to know.", "This is the bit of the night where everyone becomes best friends.", "Lights up soon. Anything you want to hear before then?" ],
    opts: [
      { tone: 'light', t: ["The cheesiest one you've got.", "Something everyone can shout."], r: ["Ha. You asked for it.", "Coming up."] },
      { tone: 'kind', t: ["Whatever you like. Great set.", "You've been brilliant. Thank you."], r: ["Cheers.", "Means a lot."] },
      { tone: 'show', act: 'dj', t: ["One more shout-out. For luck.", "Say my name once more."], r: ["Ha. Last one.", "Ha. Go on, then."] },
    ] },

  // ---- security --------------------------------------------------------------------------------------------------------------------------
  { id: 'secTable', who: ['person'], role: 'security', where: CLUBS, w: 3, when: (x) => ok(x), open: [
    "Your table's this way, sir. Anything you need, you find me.", "Evening. Anyone bothers you, you let me know.", "Good race tonight. My lad's a big fan." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Thanks. Tell your lad hello from me.", "Appreciate it. Thank you."], r: ["He'll be made up.", "Pleasure."] },
      { tone: 'light', t: ["Can you stop me dancing? That'd help.", "Is the buffet on your watch too?"], r: ["Ha. Can't help you there.", "Ha. No buffet here, sir."] },
      { tone: 'firm', t: ["Thanks. Will do.", "Good to know."], r: ["Sir.", "Sir."] },
    ] },
  { id: 'secEasy', who: ['person'], role: 'security', where: ALL, w: 8, when: (x) => ok(x) && tier(x) >= 2, open: [
    "Easy, champ. Maybe a water, yeah?", "You alright, sir? Let's get you some air.", "Sir. I'd slow down. Photographers out front." ],
    opts: [
      { tone: 'kind', fx: 'water', t: ["Yeah. Water. Thanks.", "You're right. Water."], r: ["Good man.", "That's it."] },
      { tone: 'sorry', act: 'car', t: ["...Can you get me a car?", "I think I'm done. Car?"], r: ["Leave it with me. Side door.", "Two minutes. Stay with me."], when: (x) => tier(x) >= 3 },
      { tone: 'light', t: ["I'm fine. I'm a professional athlete.", "Air? I've had plenty of air."], r: ["Course you are, sir.", "...Right you are."], m: -1 },
      { tone: 'cold', t: ["I'm fine. Back off.", "Leave me alone."], r: ["...I'll be right here, sir.", "...Sir."], m: -2 },
    ] },
  { id: 'secPaps', who: ['person'], role: 'security', where: ALL, w: 4, when: (x) => ok(x) && late(x), open: [
    "Photographers out the front are three deep. Side door's yours when you want it.", "Couple of fans at the rope asking for you. Want me to bring them in for a picture?", "Car's out the back whenever you need it." ],
    opts: [
      { tone: 'kind', fx: 'selfie', t: ["Bring the fans in. Quick photo.", "Go on. Two minutes with the fans."], r: ["They'll love that.", "Right you are."] },
      { tone: 'firm', act: 'side', t: ["Side door. Thanks.", "Back way. Cheers."], r: ["This way, sir.", "Follow me."] },
      { tone: 'show', act: 'front', t: ["Front door. Let them have it.", "I'll go out the front. Wave to them."], r: ["Your call, sir.", "...Right you are."] },
      { tone: 'light', t: ["Tell them I left an hour ago.", "Tell the photographers I'm a lookalike."], r: ["Ha. Will do.", "Ha. Good luck."] },
    ] },
  { id: 'secLondon', who: ['person'], role: 'security', where: LONDON, w: 4, when: (x) => ok(x), open: [
    "Phones get a sticker in here. House rules. Nothing leaves this room.", "Evening, sir. Members only downstairs. You're on the list.", "No photos past this point. It's why people come here." ],
    opts: [
      { tone: 'kind', t: ["Perfect. That's why I'm here.", "Good rule. Thanks."], r: ["Enjoy your evening, sir.", "Sir."] },
      { tone: 'light', t: ["Can I keep the sticker? It's a souvenir.", "Even for a selfie with my mum?"], r: ["Ha. Take two.", "Ha. Especially your mum."] },
      { tone: 'firm', t: ["Understood.", "Fine by me."], r: ["Sir.", "Thank you, sir."] },
    ] },

  // ---- the team principal (your own team's: the game's generic boss) --------------------------------------------------------------------
  { id: 'bosWin', who: ['person'], role: 'boss', where: ALL, w: 7, when: (x) => ok(x) && podium(x), open: [
    "Proud of you. All of us are. Go and enjoy it - and be at the debrief at ten.", "That's what we've been working for. Every one of us.", "I'm going to say something nice. Don't get used to it." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["It's the team. Every one of them.", "Thank you. Couldn't do it without this lot."], r: ["...Right answer. They'll hear it from me too.", "...Good. Say it to them as well."] },
      { tone: 'firm', t: ["Ten o'clock. I'll be there.", "Debrief at ten. Understood."], r: ["Good.", "Good. Enjoy tonight."] },
      { tone: 'show', t: ["More where that came from, boss.", "Get used to it."], r: ["...I'll hold you to that.", "Ha. Steady."] },
      { tone: 'light', t: ["Can the debrief be at eleven?", "Is ten a.m. or ten p.m.?"], r: ["Ten. A.m.", "Ha. Ten. Morning. Hydrate."] },
    ] },
  { id: 'bosBad', who: ['person'], role: 'boss', where: ALL, w: 7, when: (x) => ok(x) && (dnf(x) || backmarker(x)), open: [
    "Tonight's not on you. We go again.", "Have a drink. Tomorrow we find out what happened. Tonight we don't.", "I've seen the data. Nothing you could do. Enjoy the evening." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Thanks, boss. That helps.", "Appreciate you saying it."], r: ["Meant it.", "Course."] },
      { tone: 'firm', t: ["We'll fix it. I'll be in early.", "Tomorrow, then. Let's find it."], r: ["That's the spirit.", "Good."] },
      { tone: 'sorry', t: ["Sorry. I let the team down.", "I should have done better."], r: ["You didn't. Don't carry that.", "We win and lose together."] },
      { tone: 'cold', t: ["I'd rather not talk about it.", "Not tonight."], r: ["Fair. Tomorrow.", "Fine."] },
    ] },
  { id: 'bosEasy', who: ['person'], role: 'boss', where: ALL, w: 10, when: (x) => ok(x) && tier(x) >= 2, open: [
    "Go easy. The sponsors are watching. So am I.", "A word. You're enjoying yourself a bit too visibly.", "Water. Then a car. That's not a suggestion." ],
    opts: [
      { tone: 'sorry', fx: 'water', t: ["You're right. Water.", "Understood. I'll slow down."], r: ["Good.", "Thank you."] },
      { tone: 'firm', t: ["I'm fine, boss. Honestly.", "I've got it under control."], r: ["...See that you have.", "...We'll see."], m: -2 },
      { tone: 'light', t: ["It's a party, boss. You're allowed to smile.", "I'm celebrating. On behalf of the team."], r: ["...My office. Tuesday.", "...Very funny."], m: -3 },
      { tone: 'kind', act: 'car', t: ["Fair. Get me a car?", "You're right. I'll head off."], r: ["Good call. I'll sort it.", "Good. See you at ten."], when: (x) => tier(x) >= 3 },
    ] },
  { id: 'bosCrew', who: ['person'], role: 'boss', where: TEAM, w: 6, when: (x) => ok(x) && !P(x).crewThanked, open: [
    "Before you get comfortable: the mechanics are still in the garage. Go and say thank you.", "The crew are packing the freight. Five minutes of your time would mean a lot.", "The lads won't be in for an hour. Go to them." ],
    opts: [
      { tone: 'kind', fx: 'charm', act: 'crew', t: ["On my way. They deserve it.", "Going now."], r: ["Good man.", "Good."] },
      { tone: 'firm', act: 'crew', t: ["Right. Now.", "Of course."], r: ["Good.", "Thank you."] },
      { tone: 'light', t: ["After this slider.", "Five minutes. Promise."], r: ["...Now would be better.", "...I'm timing you."], m: -1 },
    ] },
  { id: 'bosNext', who: ['person'], role: 'boss', where: ALL, w: 3, when: (x) => ok(x), open: [
    "Enjoy tonight. Monday we start on the next one.", "The factory's already on the next upgrade. You'll like it.", "How's the car feel to you, honestly? Not on the radio. Here." ],
    opts: [
      { tone: 'firm', t: ["Good. Rear's a bit nervous in the long corners.", "Getting there. Traction's the thing."], r: ["...We know. It's coming.", "Noted. Monday."] },
      { tone: 'kind', fx: 'deep', t: ["Better every week. The team's flying.", "I love driving it. Honestly."], r: ["...Good to hear.", "Good. That matters."] },
      { tone: 'light', t: ["It's red and it goes fast. Love it.", "It's lovely. Like a shopping trolley with a rocket."], r: ["Ha. Monday, then.", "...I'll tell the engineers you said that."] },
    ] },

  // ---- your race engineer (the voice on the radio, off the radio) ----------------------------------------------------------------------
  { id: 'engDebrief', who: ['person'], role: 'eng', where: ALL, w: 5, when: (x) => ok(x), open: [
    "Debrief call at ten. Hydrate. That's not a suggestion.", "Enjoy tonight. Tomorrow I want every corner of that race in your head.", "I've already got the data open on my laptop. Don't tell anyone." ],
    opts: [
      { tone: 'firm', t: ["Ten o'clock. I'll be sharp.", "Copy. Ten."], r: ["Copy.", "Good."] },
      { tone: 'light', t: ["Copy. Box, box. For a drink.", "Close the laptop. That's an instruction from the driver."], r: ["Ha. Copy that.", "Ha. Negative."] },
      { tone: 'kind', fx: 'charm', t: ["Thanks for today. You were brilliant on the radio.", "Couldn't do it without you in my ear."], r: ["...Cheers. Means a lot.", "...We're a good team."] },
      { tone: 'cold', t: ["Not tonight. Tomorrow.", "Can it wait?"], r: ["Course. Sorry.", "Fair."] },
    ] },
  { id: 'engRace', who: ['person'], role: 'eng', where: ALL, w: 6, when: (x) => ok(x) && !dnf(x), open: [
    "That middle stint. Best I've seen you drive. The deg was right on the model.", "The tyre data from that last stint is beautiful. I'm not joking.", "You were half a tenth off the leader in the last sector. Half a tenth." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["It felt good. Like the car was talking to me.", "It's your setup. I just drove it."], r: ["...That's what we work for.", "...Rubbish. But thanks."] },
      { tone: 'firm', t: ["Rear's still nervous in the long corners. Write it down.", "Traction out of the slow stuff. That's the next thing."], r: ["Already written.", "Top of the list."] },
      { tone: 'show', t: ["Half a tenth? Next time it's half a tenth the other way.", "Give me the car and I'll give you the win."], r: ["Ha. Deal.", "We're working on it."] },
      { tone: 'light', t: ["Was that you singing on the in-lap?", "Did you see me wave at the pit wall?"], r: ["Ha. That was me, yes.", "Ha. We all saw."] },
    ] },
  { id: 'engRadio', who: ['person'], role: 'eng', where: ALL, w: 3, when: (x) => ok(x), open: [
    "Lap twenty. I said 'box', you said 'what'. I've got it saved.", "You called me 'mate' fourteen times today. I counted.", "Your radio after the flag's already on the internet." ],
    opts: [
      { tone: 'light', t: ["I said 'what' because you said 'box' in a funny voice.", "Fourteen? I was holding back."], r: ["Ha. Fair.", "Ha. Copy."] },
      { tone: 'kind', t: ["Best voice in the pit lane.", "You keep me calm. Honestly."], r: ["...Cheers.", "...That's the job."] },
      { tone: 'firm', t: ["Radio stays on the radio.", "Delete it."], r: ["Never.", "It's evidence."] },
    ] },
  { id: 'engDnf', who: ['person'], role: 'eng', where: ALL, w: 6, when: (x) => ok(x) && dnf(x), open: [
    "We'll know more when the car's back at the factory. Nothing you could've done.", "Rough one. The data says it wasn't you, for what it's worth.", "I've looked at it three times. It wasn't you." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Thanks. I needed to hear that.", "Means a lot. Honestly."], r: ["...We go again.", "...Next one's ours."] },
      { tone: 'firm', t: ["Find out what broke. I want to know before the flight.", "Whatever it was, it can't happen twice."], r: ["Already on it.", "It won't."] },
      { tone: 'light', t: ["Can I blame the car in the press? Just once?", "So it was the car. I'll tell my mum."], r: ["Ha. Just once.", "Ha. Tell her."] },
      { tone: 'cold', m: -1, t: ["Not tonight. I don't want to talk about it.", "Leave it till tomorrow."], r: ["...Course.", "...Fair enough."] },
    ] },
  { id: 'engNext', who: ['person'], role: 'eng', where: ALL, w: 3, when: (x) => ok(x), open: [
    "New floor arrives for the next race. Should be two tenths. Should.", "The sim team wants you on Tuesday for the next track. I said yes for you.", "Next race, I want a cleaner first lap. Then we talk about wins." ],
    opts: [
      { tone: 'firm', t: ["Tuesday's fine. Book the sim.", "Two tenths would change everything. Push them."], r: ["Booked.", "I'll push."] },
      { tone: 'show', t: ["Two tenths and I'm on pole.", "Clean first lap, then watch me go."], r: ["Ha. Let's see.", "That's the plan."] },
      { tone: 'light', t: ["You said yes for me? Bold.", "Should. I love 'should'."], r: ["Ha. You'd have said yes.", "Ha. Engineers love 'should'."] },
      { tone: 'kind', fx: 'charm', t: ["Thanks for fighting for the parts. I know it's not easy.", "Whatever you need from me, say it."], r: ["...That's what I'm here for.", "...Just keep doing what you do."] },
    ] },
  { id: 'engPace', who: ['person'], role: 'eng', where: ALL, w: 8, when: (x) => ok(x) && tier(x) >= 2, open: [
    "Hey. Water. I need your brain working at ten.", "How many's that? I'm asking as your engineer.", "You're over the limit on fun. Box, box." ],
    opts: [
      { tone: 'kind', fx: 'water', t: ["Copy. Water.", "You're right. Water."], r: ["Good lad.", "Copy."] },
      { tone: 'light', t: ["Negative. Staying out.", "I'm saving the tyres."], r: ["...Box this lap.", "Ha. You're not."], m: -1 },
      { tone: 'sorry', act: 'car', t: ["Box confirmed. Get me a car?", "Okay. Car. Thank you."], r: ["On it.", "Good call."], when: (x) => tier(x) >= 3 },
    ] },

  // ---- your PR manager -------------------------------------------------------------------------------------------------------------------
  { id: 'prmSmile', who: ['person'], role: 'pr', where: ALL, w: 4, when: (x) => ok(x), open: [
    "Smile for the house photographer. Don't post anything after two.", "If anyone asks about the race: proud of the team, on to the next one.", "Two rules: no phones out after midnight, and nothing about the car." ],
    opts: [
      { tone: 'kind', t: ["Got it. Thank you.", "Understood. You're a star."], r: ["Good.", "I know."] },
      { tone: 'light', t: ["What about after one-fifty-nine?", "Can I post the sliders?"], r: ["Ha. No.", "...Fine. The sliders."] },
      { tone: 'firm', t: ["Proud of the team, next one. Done.", "Nothing about the car. Promise."], r: ["Perfect.", "Good."] },
    ] },
  { id: 'prmNight', who: ['person'], role: 'pr', where: CLUBS, w: 3, when: (x) => ok(x), open: [
    "The Post's diary man is by the bar. Be charming. Briefly.", "There's an influencer filming everything. Assume you're always on.", "The brand people are watching. Be lovely." ],
    opts: [
      { tone: 'kind', t: ["Charming. Briefly. Got it.", "Always on. Understood."], r: ["Good.", "Good."] },
      { tone: 'light', t: ["I'm always charming.", "Assume I'm always on? I am always on."], r: ["...Briefly.", "Ha. Sadly."] },
      { tone: 'firm', t: ["I'll stay away from the bar.", "I'll keep it short."], r: ["Perfect.", "Good."] },
    ] },
  { id: 'prmWorry', who: ['person'], role: 'pr', where: ALL, w: 8, when: (x) => ok(x) && tier(x) >= 2, open: [
    "Okay. Here's what's happening: water, a smile, and home in twenty minutes.", "You're getting loud. Loud is how stories start.", "I've just spent ten minutes talking a photographer down. Please." ],
    opts: [
      { tone: 'sorry', fx: 'water', t: ["Sorry. Water. You're right.", "Okay. Twenty minutes."], r: ["Thank you.", "Good."] },
      { tone: 'firm', t: ["I'm fine. Let me enjoy it.", "I'm allowed to celebrate."], r: ["...Celebrate quieter.", "...You are. Quietly."], m: -1 },
      { tone: 'kind', act: 'car', t: ["Get me a car. You're a lifesaver.", "Okay. Car. Thank you."], r: ["Side door. Two minutes.", "Already done."] },
    ] },

  // ---- anyone else in the room (a person with no lines of their own yet) -----------------------------------------------------------------
  { id: 'pnHello', who: ['person'], where: ALL, w: 1, when: (x, n) => ok(x) && !['rep', 'agent', 'press', 'infl', 'dj', 'boss', 'eng', 'pr'].includes(n.role), open: [
    "Great night, isn't it?", "You're the driver, aren't you? Good race.", "Mad in here. Good, though." ],
    opts: [
      { tone: 'kind', t: ["It is. Enjoy it.", "Thanks. Have a good night."], r: ["You too.", "Cheers."] },
      { tone: 'light', t: ["The driver? Never heard of him.", "Mad's the word."], r: ["Ha.", "Ha. Yeah."] },
      { tone: 'firm', t: ["Thanks. Excuse me.", "Cheers. Have a good one."], r: ["Sure.", "You too."] },
    ] },
  { id: 'pnStory', who: ['person'], where: ALL, w: 1, when: (x, n) => ok(x) && !['rep', 'agent', 'press', 'infl', 'dj', 'boss', 'eng', 'pr'].includes(n.role), open: [
    "I was in the grandstand tonight. Turn 1. What a start.", "My mate bet on you. He's buying everyone drinks.", "First race I've ever been to. Is it always like this?" ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Thanks for coming. The fans make it.", "Glad you enjoyed it."], r: ["Loved it.", "Best night ever."] },
      { tone: 'light', t: ["Tell your mate I want a cut.", "Always. Every week. Exhausting."], r: ["Ha. I'll tell him.", "Ha."] },
      { tone: 'show', t: ["Only when I'm racing.", "It's always like this when I win."], r: ["Ha. Course.", "Ha."] },
    ] },

  // =====================================================================================================================
  // the dramas (only while PartyPlay has one open on this guest). provoke = escalation: a scuffle only ever with a
  // fictional antagonist (PartyPlay checks); a real driver's row stays words, and his lines never threaten anyone
  // =====================================================================================================================
  // ---- needle: the rival you touched, needling you (a driver: words only) ------------------------------------------------------
  { id: 'drama-needle-1', drama: 'needle', who: ['driver'], where: ALL, w: 1, open: [
    "Enjoy your little move tonight? Because I'll remember it.", "Hope the view of my wheel was nice. Up close." ],
    opts: [
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Ha. Racing incident. See you at the next one.", "I'll send you a signed copy of the replay."], r: ["...Funny. Very funny.", "...Keep laughing."] },
      { tone: 'sorry', fx: 'calm', out: 'calm', t: ["Fair. I was late on the brakes. Sorry.", "That one's on me. I'll own it."], r: ["...Right. Appreciated.", "...Okay. Fair enough."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -3, t: ["You were in the wrong place. Again.", "Learn to defend and it won't keep happening."], r: ["Say that again.", "Oh, it's like that?"], then: { say: ["Go on, then. Say it to my face.", "Really? In front of everyone? Go on."], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "Not here. Not tonight."], r: ["That's what I thought.", "...Yeah. Walk away."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -5, t: ["Any time. You'd still be second.", "Here's fine. You can't find the inside line anyway."], r: ["...You're unbelievable.", "...We're done."] },
        { tone: 'kind', fx: 'calm', out: 'calm', t: ["Look - we're both wound up. Same again next time, clean?", "Let's leave it on the track. Truce?"], r: ["...Fine. Clean. Next time.", "...Truce. For now."] } ] } },
      { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "[Turn your back and go to the bar]"], r: ["...Typical.", "Yeah, go on."] },
    ] },
  { id: 'drama-needle-2', drama: 'needle', who: ['driver'], where: ALL, w: 1, open: [
    "You know you hit me, right? On camera. Everyone saw.", "Stewards let you off, then. Must be nice." ],
    opts: [
      { tone: 'firm', out: 'calm', t: ["Stewards looked at it. Racing incident. Done.", "They looked, they decided. That's the system."], r: ["...The system. Right.", "...Lucky system."] },
      { tone: 'sorry', fx: 'calm', out: 'calm', t: ["You're right. I misjudged it. Sorry.", "I'd have been annoyed too. Sorry, mate."], r: ["...Okay. Thanks.", "...Fine. Appreciated."] },
      { tone: 'show', fx: 'provoke', out: 'row', m: -2, t: ["You should've left a gap, then.", "That's what happens when you're in my way."], r: ["Your way? Who do you think you are?", "Unbelievable."], then: { say: ["You're going to be a problem this year, aren't you?", "Next race. Watch yourself."], opts: [
        { tone: 'firm', fx: 'calm', out: 'calm', t: ["Only on track. Never off it.", "Hard and fair. Like always."], r: ["...We'll see.", "...Fine."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -5, t: ["Watch yourself. In my mirrors.", "You won't see me. You never do."], r: ["...Right. We're done.", "...Unbelievable."] },
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "[Leave him to it]"], r: ["...Yeah.", "...Typical."] } ] } },
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Free pinstripe. You're welcome.", "I was just saying hello. Firmly."], r: ["...Not funny.", "...A bit funny. Still annoyed."] },
    ] },
  { id: 'drama-needle-3', drama: 'needle', who: ['driver'], where: ALL, w: 1, open: [
    "So. Are we going to talk about lap one, or pretend it didn't happen?", "My engineer wants a word with you. I said I'd pass it on. Idiot. That's the word." ],
    opts: [
      { tone: 'kind', fx: 'calm', out: 'calm', t: ["Let's talk about it. Properly. Not here.", "Fair. Let's sort it on Monday, with the footage."], r: ["...Okay. Monday.", "...Fine. Footage."] },
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Tell your engineer I said hello.", "Pretend it didn't happen. I'm good at that."], r: ["...Ha. He'll love that.", "...Course you are."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -3, t: ["Tell your engineer to teach you to defend.", "Nothing to talk about. You were slow."], r: ["...Wow.", "Slow? Say that again."], then: { say: ["Really? You're going there?", "Go on. Again. Louder."], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "Not worth it. [Go]"], r: ["...Thought so.", "...Yeah. Go."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -5, t: ["You were slow. And in the way.", "Slow. In the way. Every week."], r: ["...We're done.", "...Right."] },
        { tone: 'sorry', fx: 'calm', out: 'calm', t: ["...Look. That was out of order. Sorry.", "Sorry. Heat of the moment."], r: ["...Fine.", "...Okay. Accepted."] } ] } },
      { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "[Smile and walk off]"], r: ["...Yeah. Go on.", "...Typical."] },
    ] },

  // ---- feud: the team-mate, after the call from the pit wall -----------------------------------------------------------------------
  { id: 'drama-feud-1', drama: 'feud', who: ['driver'], where: ALL, w: 1, open: [
    "Lap forty. The call. You and I need to talk about it.", "Smile for the cameras, team-mate. Then we're having words." ],
    opts: [
      { tone: 'kind', fx: ['clear', 'deep', 'calm'], out: 'calm', t: ["You're right. Let's talk. Properly. Not on the radio.", "I didn't make the call. But I'd be angry too. Let's sort it."], r: ["...Okay. Yeah.", "...Fine. Let's."] },
      { tone: 'firm', out: 'walked', t: ["The team made a call. I followed it. You'd have done the same.", "It's the job. We both signed up for it."], r: ["...Would I? I'm not sure.", "...That's not good enough."], m: -1 },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -4, t: ["Be quicker and there's no call to make.", "Maybe ask yourself why they chose me."], r: ["...Right. That's how it is.", "...Noted. Cold war, then."] },
      { tone: 'sorry', fx: ['clear', 'calm'], out: 'calm', t: ["I should have said something on the radio. Sorry.", "I could have given it back. I didn't. Sorry."], r: ["...Okay. That helps.", "...Appreciated."] },
    ] },
  { id: 'drama-feud-2', drama: 'feud', who: ['driver'], where: ALL, w: 1, open: [
    "I'm not doing the team photo next to you tonight. Just so you know.", "Everyone's being very nice to you. Funny, that." ],
    opts: [
      { tone: 'kind', fx: ['clear', 'calm'], out: 'calm', t: ["Then let's fix it before the photo.", "Come on. Five minutes, outside. Just us."], r: ["...Five minutes.", "...Fine."], then: { say: ["So? Say it.", "Go on, then."], opts: [
        { tone: 'sorry', fx: ['clear', 'deep'], out: 'calm', t: ["It wasn't fair on you. I know that. I'll say so to the boss.", "You deserved that result. I'm sorry."], r: ["...Thanks. Really.", "...Okay. We're okay."] },
        { tone: 'firm', fx: 'clear', out: 'calm', t: ["Next time, we race. No calls. I'll ask for it.", "We get it in writing. Free racing."], r: ["...In writing. Deal.", "...Deal."] },
        { tone: 'cold', out: 'row', m: -3, t: ["It was the right call. Get over it.", "You'll get over it."], r: ["...Right.", "...Wow."] } ] } },
      { tone: 'light', out: 'walked', t: ["Stand behind me, then. You'll look taller.", "Fine. I'll photoshop you in."], r: ["...Not funny.", "...Ha. A bit funny. Still not over it."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -3, t: ["Suits me.", "Fine. Stand somewhere else."], r: ["...Fine.", "...Right."] },
    ] },
  { id: 'drama-feud-3', drama: 'feud', who: ['driver'], where: ALL, w: 1, open: [
    "Did you ask for that call? Look me in the eye.", "I thought we had a deal. Both cars, fair racing." ],
    opts: [
      { tone: 'kind', fx: ['clear', 'deep', 'calm'], out: 'calm', t: ["I didn't ask. I swear. Let's go to the boss together.", "We do have a deal. I'll fight for it with you."], r: ["...Okay. Together.", "...Okay. I believe you."] },
      { tone: 'firm', out: 'walked', m: -1, t: ["I didn't ask. I didn't argue either.", "The team decided. Not me."], r: ["...That's the problem.", "...Convenient."] },
      { tone: 'show', fx: 'provoke', out: 'row', m: -4, t: ["Didn't need to ask. They know who's quicker.", "The team backs the faster car."], r: ["...Right. Cold war it is.", "...We'll see."] },
      { tone: 'leave', act: 'walk', out: 'walked', t: ["[Walk away]", "Not tonight."], r: ["...Course.", "...Fine."] },
    ] },

  // ---- exnew: your ex, and the new man (an invented man; she and your partner have their own versions) --------------------------------
  { id: 'drama-exnew-her', drama: 'exnew', who: ['celeb'], where: ALL, w: 1, when: (x, n) => isEx(x, n), open: [
    "Hi. Didn't expect to see you here. This is {exnew}.", "Oh. Hi. You've met {exnew}? No. Of course you haven't." ],
    opts: [
      { tone: 'kind', fx: 'calm', out: 'calm', t: ["Hi. Good to see you. Nice to meet you, {exnew}.", "You look happy. That's good. Really."], r: ["...Thank you. That's kind.", "...I am. Thank you."] },
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Small paddock, isn't it?", "Everyone ends up at the same party eventually."], r: ["Ha. Very small.", "Ha. Apparently."] },
      { tone: 'cold', out: 'row', m: -3, t: ["Didn't take you long.", "Moved on quickly, then."], r: ["...Don't. Not tonight.", "...That's not fair, and you know it."] },
      { tone: 'flirt', out: 'calm', m: -3, t: ["You look amazing. Just saying.", "I miss you. Is that allowed?"], r: ["...Please don't.", "...Not here. Not now."] },
    ] },
  { id: 'drama-exnew-him', drama: 'exnew', who: ['person'], where: ALL, w: 1, open: [
    "So you're the racing driver. She's told me all about you. Not much of it good.", "Alright, mate? I'm {first}. I'm with her now. Just so we're clear." ],
    opts: [
      { tone: 'kind', fx: 'calm', out: 'calm', t: ["Good to meet you. Look after her.", "Nice to meet you. Enjoy your night."], r: ["...Right. Will do.", "...Yeah. You too."] },
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Not much of it good? She's being generous.", "Clear as a qualifying lap. Enjoy the party."], r: ["...Ha. Okay.", "...Ha. Right."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -3, t: ["Funny. She never mentioned you.", "Clear? You're standing in my way."], r: ["...What did you say?", "...Want to try that again?"], then: { say: ["Say that again. Go on.", "You think you're something, don't you?"], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "Not worth it. [Go to the bar]"], r: ["...Yeah. Off you go.", "...Thought so."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -5, t: ["[Step up to him] Say it again, then.", "[Square up] Go on."], r: ["...[He shoves you]", "...[He grabs your collar]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security? Bit of help here."], r: ["...Unbelievable.", "...Whatever."] } ] } },
      { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "[Nod and walk past him]"], r: ["...Yeah.", "...Right."] },
    ] },
  { id: 'drama-exnew-seen', drama: 'exnew', who: ['celeb'], where: ALL, w: 1, when: (x, n) => !isEx(x, n), open: [
    "You keep looking over there. Is that her?", "Your ex is here. With someone. And you've been staring for five minutes." ],
    opts: [
      { tone: 'sorry', fx: 'calm', out: 'calm', t: ["Sorry. It's just strange seeing her. I'm here with you.", "You're right. That was rude of me. Sorry."], r: ["...Okay. Just... be here.", "...Okay. Thank you."] },
      { tone: 'kind', fx: 'charm', out: 'calm', t: ["[Take her hand] Let's go somewhere else.", "Dance with me. Away from all that."], r: ["...Okay.", "...Yes."] },
      { tone: 'firm', fx: 'cover', out: 'calm', m: -1, t: ["I wasn't looking. I was watching the DJ.", "Wasn't staring. Just surprised."], r: ["...The DJ. Right.", "...Okay."] },
      { tone: 'cold', out: 'row', m: -4, t: ["I can look where I like.", "Don't start."], r: ["...Fine. Look all night.", "...Right."] },
    ] },

  // ---- tabex: your date's tabloid ex (an invented man) ---------------------------------------------------------------------------------
  { id: 'drama-dateex-tabloidex-1', drama: 'dateex', who: ['person'], where: ALL, w: 1, open: [
    "Look who it is. She's moved on to drivers now?", "Careful, mate. She gets bored. Ask me how I know." ],
    opts: [
      { tone: 'firm', fx: 'calm', out: 'calm', t: ["She's with me tonight. Have a good evening.", "Enjoy your night, mate. We will."], r: ["...Whatever.", "...Yeah, yeah."] },
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Bored? She's been laughing all night. At you, mostly.", "Ask you? I'd rather not."], r: ["...Funny man.", "...Ha. Right."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -3, t: ["Jealous? Must be hard, being yesterday's news.", "Nobody's asking you, mate."], r: ["...What did you say to me?", "...Say that again."], then: { say: ["Go on. Say it again.", "You want to do this? Here?"], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away with her]", "Not worth it."], r: ["...Yeah, walk away.", "...Thought so."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -5, t: ["[Step up to him] Yesterday's news.", "[Square up] Here's fine."], r: ["...[He swings an arm at you]", "...[He shoves you back]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security. He's leaving."], r: ["...Unbelievable.", "...Fine. I'm going."] } ] } },
      { tone: 'firm', act: 'security', out: 'calm', t: ["[Catch the security guard's eye]", "[Nod to security]"], r: ["...Oh, here we go.", "...Fine."] },
    ] },
  { id: 'drama-dateex-tabloidex-2', drama: 'dateex', who: ['person'], where: ALL, w: 1, open: [
    "Enjoy the papers on Monday. I know a few people at the Post.", "You know she only goes out with people who get her photographed?" ],
    opts: [
      { tone: 'firm', fx: 'calm', out: 'calm', t: ["Say what you like. Have a good night.", "Fine. Enjoy the party."], r: ["...Oh, I will.", "...Yeah."] },
      { tone: 'kind', fx: 'calm', out: 'calm', t: ["I hope you find what you're after, mate. Honestly.", "Sounds like it's been a hard year. Look after yourself."], r: ["...What?", "...Right. Whatever."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -3, t: ["The Post? They only print you when you fall over.", "Photographed? You'd know. You're always in the back of the shot."], r: ["...You little...", "...Say that again."], then: { say: ["Say that again. Go on.", "Outside. Now."], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "No. [Go]"], r: ["...Coward.", "...Yeah. Go."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -5, t: ["[Square up] Here's fine.", "[Step into him]"], r: ["...[He shoves you]", "...[He grabs your arm]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security. Please."], r: ["...Fine. Whatever.", "...Unbelievable."] } ] } },
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Monday? I'll frame it.", "Make sure they get my good side."], r: ["...Funny.", "...Ha. We'll see."] },
    ] },
  { id: 'drama-dateex-tabloidex-3', drama: 'dateex', who: ['person'], where: ALL, w: 1, open: [
    "Is that her drink you're holding? Classic. She did that to me.", "Mate. Mate. Word of advice. Run." ],
    opts: [
      { tone: 'light', fx: 'calm', out: 'calm', t: ["I'll run. Very fast. It's my job.", "Thanks. I'll take it under advisement."], r: ["...Ha. Okay.", "...Funny."] },
      { tone: 'firm', fx: 'calm', out: 'calm', t: ["That's between you and her. Not me.", "Have a good night, mate."], r: ["...Whatever.", "...Fine."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -3, t: ["Run? From you?", "Maybe you're the reason she ran."], r: ["...What did you say?", "...Careful."], then: { say: ["Say that again.", "Come on, then."], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "[Turn away]"], r: ["...Yeah.", "...Go on."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -5, t: ["[Square up]", "[Step into him] Come on, then."], r: ["...[He shoves you]", "...[He swings at you and misses]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security."], r: ["...Fine.", "...Whatever."] } ] } },
      { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "[Smile and leave him there]"], r: ["...Yeah. Run.", "...Ha."] },
    ] },

  // ---- spill: a drunk stranger --------------------------------------------------------------------------------------------------------
  { id: 'drama-spill-1', drama: 'spill', who: ['person'], where: CLUBS, w: 1, open: [
    "Whoa - sorry, mate. ...Actually, you walked into me.", "[A full glass goes down your shirt] Oops. Ha. Oops." ],
    opts: [
      { tone: 'light', fx: 'calm', out: 'calm', t: ["It's fine. It's only a shirt. And my dignity.", "Ha. I needed cooling down anyway."], r: ["...Ha. Fair play, mate.", "...Ha. Legend."] },
      { tone: 'firm', fx: 'calm', out: 'calm', t: ["Watch where you're going. Enjoy your night.", "No harm done. Easy, though."], r: ["...Yeah, yeah.", "...Whatever."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -2, t: ["You owe me a shirt.", "Are you serious?"], r: ["Or what?", "...You what?"], then: { say: ["Or what, mate? Go on.", "Do you know who you're talking to?"], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "Forget it."], r: ["...Yeah, forget it.", "...Thought so."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -4, t: ["[Push his hand off your chest]", "[Shove him back]"], r: ["...[He shoves you again]", "...[He stumbles, then comes at you]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security - he's had enough."], r: ["...Oh, come on.", "...Fine. Whatever."] } ] } },
      { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "[Catch the bouncer's eye]"], r: ["...Oh, come on.", "...Snitch."] },
    ] },
  { id: 'drama-spill-2', drama: 'spill', who: ['person'], where: CLUBS, w: 1, open: [
    "Oi! You're that driver! I bet on you tonight! You owe me money!", "You! You cost me two hundred dollars! On lap one!" ],
    opts: [
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Should've bet on the other bloke.", "I'll pay you back in exposure."], r: ["...Ha. Funny.", "...Ha. Cheeky."] },
      { tone: 'kind', fx: 'calm', out: 'calm', t: ["Sorry, mate. Next time. Drink some water, yeah?", "Unlucky. Have a good night."], r: ["...Yeah, alright.", "...Whatever. Good race, though."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -2, t: ["Not my problem.", "Bet better."], r: ["...Not your problem?", "...Say that again."], then: { say: ["Say that again, superstar.", "You think you're better than me?"], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "Goodnight, mate."], r: ["...Yeah, run.", "...Whatever."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -4, t: ["[Push past him]", "[Shove him away]"], r: ["...[He grabs your shirt]", "...[He shoves back]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security."], r: ["...Unbelievable.", "...Fine."] } ] } },
      { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "[Nod to the bouncer]"], r: ["...Oh, here we go.", "...Typical."] },
    ] },
  { id: 'drama-spill-3', drama: 'spill', who: ['person'], where: CLUBS, w: 1, open: [
    "Do you know who I am? No? Exactly. Nobody does. Unlike you, mister famous.", "You think you're special? You're not special. You just drive in circles." ],
    opts: [
      { tone: 'light', fx: 'calm', out: 'calm', t: ["Very fast circles, to be fair.", "You're right. I'm not special. I'm just quick."], r: ["...Ha. Fair.", "...Ha. Okay."] },
      { tone: 'kind', fx: 'calm', out: 'calm', t: ["Rough night? Get yourself a water, mate.", "Go easy. Have a good one."], r: ["...Yeah. Maybe.", "...Whatever."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -2, t: ["You're right. Nobody knows who you are.", "Go home, mate."], r: ["...What did you say?", "...Make me."], then: { say: ["Go on. Make me.", "Say that again."], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "Not worth it."], r: ["...Yeah.", "...Coward."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -4, t: ["[Step up to him]", "[Push him back]"], r: ["...[He lunges at you]", "...[He shoves you]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security."], r: ["...Oh, great.", "...Fine."] } ] } },
      { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "[Leave him to it]"], r: ["...Yeah. Go on.", "...Whatever."] },
    ] },

  // ---- selfie: a pushy fan ------------------------------------------------------------------------------------------------------------
  { id: 'drama-fan-selfie-1', drama: 'fan', who: ['person'], where: ALL, w: 1, open: [
    "Selfie! Come on, one selfie! [He already has an arm round your neck]", "Smile! Smile! Look at the camera! No - this camera!" ],
    opts: [
      { tone: 'kind', fx: ['selfie', 'calm'], out: 'calm', t: ["Go on. One. Then I'm off.", "Quick one. Arm off the neck, though."], r: ["Yes! Legend!", "Ha. Sorry. Legend."] },
      { tone: 'firm', fx: 'calm', out: 'calm', t: ["Not tonight, mate. Have a good one.", "Arm off, please. Not tonight."], r: ["...Fine. Whatever.", "...Wow. Okay."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -2, t: ["Get off me.", "[Push his phone away]"], r: ["Whoa! Okay! Don't touch the phone!", "...Rude!"], then: { say: ["What's your problem? I'm a fan!", "I'm filming this, by the way."], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "Have a good night."], r: ["...Unbelievable.", "...Never buying your merch again."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -4, t: ["[Grab the phone]", "[Shove him off you]"], r: ["...[He grabs you back]", "...[He shoves you]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security."], r: ["...Seriously?", "...Fine!"] } ] } },
      { tone: 'firm', act: 'security', out: 'calm', t: ["[Look for security]", "[Wave the bouncer over]"], r: ["...Oh, come on.", "...Seriously?"] },
    ] },
  { id: 'drama-fan-selfie-2', drama: 'fan', who: ['person'], where: ALL, w: 1, open: [
    "My kid's your biggest fan. Video message? Please? Ten seconds?", "I've driven from Utah for this. One photo. That's all." ],
    opts: [
      { tone: 'kind', fx: ['selfie', 'calm'], out: 'calm', t: ["Course. What's their name?", "Go on. Ten seconds."], r: ["...Thank you. Thank you so much.", "...You're a legend."] },
      { tone: 'light', fx: ['selfie', 'calm'], out: 'calm', t: ["Utah? Then you get two.", "Ten seconds. Starting now. Go."], r: ["Ha! Thank you!", "Ha! Okay! Okay!"] },
      { tone: 'firm', fx: 'calm', out: 'calm', t: ["Not in here, sorry. Find me at the next race.", "Another time. Sorry."], r: ["...Okay. Next race.", "...Right. Okay."], m: -1 },
      { tone: 'cold', out: 'row', m: -2, t: ["I'm off duty.", "No."], r: ["...Wow. Okay.", "...Charming."] },
    ] },
  { id: 'drama-fan-selfie-3', drama: 'fan', who: ['person'], where: ALL, w: 1, open: [
    "I've been waiting at the rope for two hours. Two hours! One photo!", "Everyone else got one! Why not me?" ],
    opts: [
      { tone: 'kind', fx: ['selfie', 'calm'], out: 'calm', t: ["Two hours? Come here. Thank you for waiting.", "Course. Sorry for the wait."], r: ["...Oh my god. Thank you.", "...Thank you!"] },
      { tone: 'firm', fx: 'calm', out: 'calm', t: ["Quick one. Then I have to go.", "One. Then I've got people waiting."], r: ["...Okay. Thank you.", "...Fine. Yes. Thank you."] },
      { tone: 'cold', fx: 'provoke', out: 'row', m: -2, t: ["Should have waited somewhere else.", "Not my problem."], r: ["...Unbelievable.", "...What?"], then: { say: ["You think you're too good for us?", "Say that again."], opts: [
        { tone: 'leave', fx: 'calm', act: 'walk', out: 'walked', t: ["[Walk away]", "Goodnight."], r: ["...Unbelievable.", "...Fine."] },
        { tone: 'cruel', fx: 'provoke', out: 'scuffle', end: true, m: -4, t: ["[Push past him]", "[Shove him off]"], r: ["...[He grabs your arm]", "...[He shoves you back]"] },
        { tone: 'firm', act: 'security', out: 'calm', t: ["[Wave security over]", "Security."], r: ["...Seriously?", "...Fine."] } ] } },
      { tone: 'firm', act: 'security', out: 'calm', t: ["[Look for security]", "[Signal to the bouncer]"], r: ["...Oh, come on.", "...Typical."] },
    ] },

  // ---- overheard: the columnist heard your loose line (quote: false - talked out of it; true - it runs on Monday) -------------------------
  { id: 'drama-overheard-1', drama: 'overheard', who: ['person'], where: ALL, w: 1, open: [
    "Lovely line, that. Shall I spell your name right?", "You know I heard that, don't you? I've got very good ears and a Monday deadline." ],
    opts: [
      { tone: 'sorry', out: 'calm', quote: false, m: 1, t: ["Please. Off the record. It was the champagne talking.", "That was off the record. You know it was."], r: ["...Was it? ...Fine. You owe me.", "...Hm. This once."] },
      { tone: 'kind', fx: 'network', out: 'calm', quote: false, m: 2, t: ["Give me a break and I'll give you a better story on Monday.", "Bin that and I'll ring you first with the next one."], r: ["...Deal. A better story. First.", "...You're good at this."] },
      { tone: 'firm', out: 'calm', quote: true, m: -1, t: ["I never said that.", "You misheard."], r: ["...Then you won't mind it in print.", "...Of course."] },
      { tone: 'cold', out: 'row', quote: true, m: -3, t: ["Print that and you'll never get another word from me.", "Try it."], r: ["...Is that a threat? Lovely. That's going in too.", "...I will."] },
    ] },
  { id: 'drama-overheard-2', drama: 'overheard', who: ['person'], where: ALL, w: 1, open: [
    "Funny thing about clubs: everyone thinks the music's louder than it is.", "That was a very honest thing to say about your own team. Busy night?" ],
    opts: [
      { tone: 'light', out: 'calm', quote: false, m: 1, t: ["That was a joke. We're very close, the car and me.", "I was quoting a film. Badly."], r: ["...Ha. Nice try. I'll think about it.", "...Very good. This once."] },
      { tone: 'kind', fx: 'network', out: 'calm', quote: false, m: 2, t: ["Lunch on Monday. On me. Anything you want - except that.", "Let me give you something better. Exclusive."], r: ["...You've got yourself a lunch.", "...Exclusive. Deal."] },
      { tone: 'sorry', out: 'calm', quote: false, t: ["I'm asking nicely. Please.", "Please. It'll land on people who don't deserve it."], r: ["...Fine. You owe me.", "...That's not my problem. But fine."] },
      { tone: 'show', out: 'calm', quote: true, m: -1, t: ["Print it. I meant every word.", "Run it. Someone has to say it."], r: ["...Oh, I will.", "...Thank you."] },
    ] },
  { id: 'drama-overheard-3', drama: 'overheard', who: ['person'], where: ALL, w: 1, open: [
    "I didn't hear anything. ...Unless you'd like me to have heard something.", "That was very honest. My editor loves honest." ],
    opts: [
      { tone: 'kind', fx: 'network', out: 'calm', quote: false, m: 2, t: ["You didn't hear anything. And I'll remember that.", "Thank you. Genuinely. You'll get the first interview."], r: ["...Good. I'll hold you to it.", "...Lovely."] },
      { tone: 'firm', out: 'calm', quote: false, t: ["You didn't hear anything.", "Nothing to hear."], r: ["...Hm. We'll see.", "...If you say so."] },
      { tone: 'cold', out: 'row', quote: true, m: -2, t: ["Write what you want.", "Do what you like."], r: ["...I will.", "...Thank you."] },
    ] },

  // ---- paps: photographers out front (your PR manager - role 'pr'; else the door host or security) -------------------------------------------
  { id: 'drama-paps-sidedoor-1', drama: 'paps', who: ['person'], where: ALL, w: 1, when: (x, n) => n.role === 'pr', open: [
    "Photographers out front. Six of them. Use the side door.", "The front's a wall of lenses. I've got you a car at the side. Your call." ],
    opts: [
      { tone: 'firm', act: 'side', out: 'calm', t: ["Side door. Thanks.", "Side. You're a lifesaver."], r: ["Two minutes. Follow me.", "This way."] },
      { tone: 'show', act: 'front', out: 'calm', t: ["Let them. I'll give them a wave.", "Front door. Give them a picture."], r: ["...Your funeral.", "...Smile, then."] },
      { tone: 'light', out: 'calm', t: ["Give it an hour. They get bored.", "Not leaving yet. They'll freeze first."], r: ["...They won't. But okay.", "...They never get bored."] },
      { tone: 'kind', fx: 'network', act: 'side', out: 'calm', t: ["You think of everything. Lead the way.", "Thank you. Seriously."], r: ["I know. Come on.", "That's the job."] },
    ] },
  { id: 'drama-paps-sidedoor-2', drama: 'paps', who: ['person'], where: ALL, w: 1, when: (x, n) => n.role !== 'pr', open: [
    "There's a crowd at the front for you. Want the kitchen exit? Nobody'll see a thing.", "Sir - a word. It's busy out front. There's another way." ],
    opts: [
      { tone: 'firm', act: 'side', out: 'calm', t: ["Kitchen exit. Perfect.", "Another way, please."], r: ["Through here.", "Follow me, sir."] },
      { tone: 'show', act: 'front', out: 'calm', t: ["Front door. Let's give them a show.", "I'll go out the front. Wave to the fans."], r: ["...Very good, sir.", "...As you like."] },
      { tone: 'light', out: 'calm', t: ["Not leaving yet. Keep the kitchen warm.", "Later. I'm having too much fun."], r: ["...Of course.", "...It'll be here."] },
    ] },
  { id: 'drama-paps-sidedoor-3', drama: 'paps', who: ['person'], where: ALL, w: 1, when: (x, n) => tier(x) >= 2 && n.role === 'pr', open: [
    "You are not walking past those cameras like that. Side door. Now.", "Look at me. You're wobbling. The front is not an option." ],
    opts: [
      { tone: 'sorry', act: 'side', out: 'calm', t: ["You're right. Side door. Sorry.", "Okay. Okay. Side."], r: ["Thank you. Arm. Hold my arm.", "Good. Come on."] },
      { tone: 'show', act: 'front', out: 'calm', m: -3, t: ["I'm fine. Front door.", "Watch me walk in a straight line."], r: ["...I'm writing my resignation.", "...God help us."] },
      { tone: 'kind', act: 'car', out: 'calm', t: ["Get me a car. Back way. Thank you.", "Car, side door. You're right."], r: ["Already outside.", "Done. Come on."] },
    ] },
  { id: 'drama-paps-sidedoor-4', drama: 'paps', who: ['person'], where: ALL, w: 1, when: (x, n) => n.role !== 'pr' && tier(x) >= 2, open: [
    "Sir. Photographers three deep at the front, and you've had a few. Back way.", "Let's not give them the picture they want, sir. This way." ],
    opts: [
      { tone: 'sorry', act: 'side', out: 'calm', t: ["Back way. Thank you.", "You're right. Lead on."], r: ["Good man. Follow me.", "This way, sir."] },
      { tone: 'show', act: 'front', out: 'calm', m: -2, t: ["Front door. I'm fine.", "Let them have it."], r: ["...Your call, sir.", "...Very good, sir."] },
      { tone: 'kind', act: 'car', out: 'calm', t: ["And a car, please. I'm done.", "Car out the back? Thank you."], r: ["Already there, sir.", "Two minutes."] },
    ] },
];

// =====================================================================================================================
// loose lines (tipsy: PartyPlay swaps one answer for one of these; drunk: 1 pick in 4 comes out as one)
// =====================================================================================================================
/** the indiscreet things you say (leak: car information - the engineer and the boss will hear about it) */
export const PARTY_LOOSE = [
  { id: 'pig', leak: true, t: ["Between us, the car's a pig in the slow stuff.", "Don't tell anyone, but the car's a pig in the slow corners."] },
  { id: 'floor', leak: true, t: ["The new floor's done nothing. Nothing. Don't write that down.", "We brought an upgrade this weekend and it's worse. Shh."] },
  { id: 'tyres', leak: true, t: ["Our tyre model's guesswork. Educated guesswork. Mostly guesswork.", "Honestly? We don't understand the tyres. Nobody does. We understand them least."] },
  { id: 'rear', leak: true, t: ["The rear just lets go in the long corners. Every lap. I'm a passenger.", "I've got no rear end in the fast stuff. None. I'm just hanging on."] },
  { id: 'sign', leak: false, t: ["I'd sign for another team tomorrow. Don't tell mine.", "If the right team called, I'd go. Is that bad? That's bad."] },
  { id: 'boss', leak: false, t: ["The boss couldn't pick a strategy out of a hat.", "Our strategy calls are decided by a coin. A cheap coin."] },
  { id: 'mate', leak: false, t: ["My team-mate gets the new parts first. Every time.", "They like him more in the garage. I can tell."], when: (x) => !!P(x).mateName },
  { id: 'stewards', leak: false, t: ["The stewards wouldn't know a racing incident if it bit them.", "The stewards flip a coin. I've seen the coin."] },
  { id: 'rivals', leak: false, t: ["Half this grid drives like they're the only car out there.", "Some of them out there couldn't find the apex with a map."] },
  { id: 'heart', leak: false, to: 'celeb', when: (x, n) => isStar(n) && easy(n) && at(n, 'friendly', 'flirting', 'dating', 'partner'), t: ["I've been looking at you all night. Is that weird? That's weird.", "You're the best thing that's happened to me all season. Including tonight."] },
];
/** how it lands, by who hears it (a real driver hears it sober) */
export const PARTY_LOOSE_R = {
  driver: ["...Mate. Water. Now.", "I'm going to pretend I didn't hear that.", "Ha. You'll regret that in the morning.", "...Not in here, mate. Walls have ears."],
  celeb: ["Ha! Okay. Someone's had a few.", "...I'm going to remember you said that.", "Shh! You can't say that out loud!"],
  heart: ["...You're sweet when you've had a drink.", "...Ask me again when you're sober. I might say yes.", "...Okay. That was cute. Water."],
  rep: ["...Interesting.", "I'll... pretend that was off the record.", "Ha. Right. Well."],
  agent: ["Noted. Very much noted.", "Ha. Don't say that to anyone else."],
  press: ["Can I quote you on that?", "...Go on.", "That's going straight in the diary."],
  infl: ["Wait - was I recording? I think I was recording.", "Oh my god. Say that again for the camera."],
  boss: ["...We'll talk about that on Monday.", "Water. Now. Then bed."],
  eng: ["...We'll talk about that in the debrief. Not here.", "Not in here. Walls have ears."],
  pr: ["...Please stop talking.", "I'm going to need you to never say that again."],
  person: ["Heard nothing, sir.", "Ha. Not my business."],
};
/** when a drunk pick comes out as the loose line: what you think as it leaves your mouth */
export const PARTY_SLIP = ["That came out wrong.", "...That is not what I meant to say.", "Brain, mouth: not connected tonight.", "Why did I say that out loud?"];
/**
 * One loose line for this guest, raw (tokens unfilled: HangoutTalk.hangoutLoose fills them) -> { id, leak, t, r, m, tone }
 * | null. m: how it lands - the press and an influencer love it, a driver or your boss do not, a conservative brand
 * least of all.
 */
export function partyLooseFor(x = {}, n = {}) {
  const L = PARTY_LOOSE.filter((d) => { try { return (!d.to || (d.to === 'celeb' && isStar(n))) && (!d.when || d.when(x, n)); } catch (_) { return false; } });
  if (!L.length) return null;
  const heart = L.filter((d) => d.id === 'heart'), d = heart.length && Math.random() < 0.6 ? heart[0] : pick(L);
  const who = d.id === 'heart' ? 'heart' : n.kind === 'person' ? (PARTY_LOOSE_R[n.role] ? n.role : 'person') : isStar(n) ? 'celeb' : 'driver';
  const m = d.id === 'heart' ? 1 : who === 'press' || who === 'infl' ? 1 : who === 'agent' ? 1 : who === 'boss' ? -4 : who === 'pr' || who === 'eng' ? -2
    : who === 'rep' ? (n.likes === 'showman' && !d.leak ? 1 : (n.heatMax ?? 100) <= 60 ? -3 : -1) : who === 'driver' ? -1 : 0;
  return { id: d.id, leak: !!d.leak, t: pick(d.t), r: pick(PARTY_LOOSE_R[who]), m, tone: d.id === 'heart' ? 'flirt' : d.leak ? 'gossip' : 'show' };
}

// =====================================================================================================================
// lines round the room (fill tokens with HangoutTalk.fillHangout; real drivers never drunk, never anything but the job)
// =====================================================================================================================
export const PARTY_BARK = {
  // (the first thing they say as you walk up: by role, then kind)
  hello: {
    mate: ["There he is. Took your time.", "Finally. The boss was asking where you were.", "Get over here. They're doing the photo."],
    friend: ["Look who it is!", "Finally. I've been guarding this spot for you.", "There he is. The man himself."],
    rival: ["Oh. You.", "Evening.", "Look who's here."],
    exmate: ["Oi! Old team-mate!", "Look at you. Different colours, same face.", "Miss me?"],
    present: ["Alright?", "Good race.", "Hey. Quick hello."],
    driver: ["Alright? Good night for it.", "Look at you, out in the wild.", "Finally. A familiar face."],
    partner: ["There you are. I was starting to think you'd forgotten me.", "Hi, you. Come here.", "You found me."],
    ex: ["Oh. Hi.", "...Hi.", "Well. Hello."],
    celeb: ["Hi. You must be the driver everyone's talking about.", "There you are. I was hoping I'd find you.", "Hey. Good race tonight."],
    rep: ["There he is. Have you got five minutes?", "Ah - just the man I wanted to see.", "Good evening. Lovely to meet you properly."],
    agent: ["There he is. My favourite team owner.", "Got a minute? I've always got a minute.", "Evening. Busy night."],
    press: ["Evening. Don't worry, I'm off duty. Mostly.", "Lovely party. Lovely, lovely party.", "Ah. The man of the moment."],
    infl: ["Oh my god, hi! Hi! Can I film this?", "Hiii! Okay, act natural.", "No way. Hi!"],
    dj: ["Big night! Enjoying it?", "Alright, champ!", "Good to see you up here."],
    security: ["Evening, sir.", "Sir.", "All good, sir?"],
    boss: ["There you are. Good.", "Ah. A word, when you have a minute.", "Enjoying it? You should be."],
    eng: ["There he is. Radio check.", "Copy. You made it.", "Evening, driver."],
    pr: ["Smile. You're always on.", "There you are. Behave.", "Right. Ground rules."],
    person: ["Hi!", "Oh - hello!", "Good race!"],
  },
  // (the bartender, and a companion when you order)
  bar: { ask: ["What can I get you?", "What are we having?", "Evening. What'll it be?"], served: ["There you go.", "Enjoy.", "On the table's tab."], id: ["Can I see some ID? ...Sorry. House rules. Soft drinks only, I'm afraid."] },
  order: ["Good shout.", "Ooh. Yes please.", "Now we're talking.", "Make it two."],
  soft: ["Good man. Pace yourself.", "Smart.", "Very professional.", "Sensible. Boring, but sensible."],
  cheers: ["Cheers!", "To tonight.", "To the result.", "Cheers - to the team.", "Here's to the next one."],
  // (rounds sent over: the card's line, and the room's response)
  round: { offer: ["Shots, sent over from {brand}.","A bottle, from the table by the DJ.", "A round from the lads at the bar.", "Champagne, compliments of the house."], yes: ["Get in!", "Cheers to them!", "Down the hatch."], no: ["Ooh. Cold.", "...Sensible. Boring.", "They'll take that personally."] },
  late: ["Is it really that late?", "Where did the night go?", "My phone says it's late. My phone's a killjoy."],
  lightsUp: ["That's it - lights up!", "Five o'clock. They're turning the lights on us.", "Oof. The house lights. Nobody look at anybody."],
  lastOrders: ["Last orders! Last orders at the bar!", "That's the bell. Last orders.", "Quick - last orders."],
  // (the DJ on the mic; tokens: {city} {me} {sur} {result} {team})
  shout: ["{city}, make some noise for {me} {sur}!", "Big up {me} {sur} in the house tonight! {result}!", "We've got a race driver in the building - {me} {sur}, everybody!", "Hands up for {team}! {me} {sur}, ladies and gentlemen!"],
  mood: {
    warm: ["Easing you in, {city}. Plenty of night left.", "Warm-up set. Get a drink, find your people."], peak: ["This is it. Peak time. Hands up!", "Turn it up! {city}, let me hear you!"],
    throwback: ["Going back now. You know this one.", "Throwbacks! Everyone knows the words to this."], last: ["Last hour, {city}. Make it count.", "Lights up soon. One more tune, then home safe."],
    lounge: ["Something smooth to start.", "Easy does it."], garage: ["Garage classics. London, this one's yours.", "Taking it back to the old days."], lastOrders: ["Last orders, people. Last orders.", "Bell's gone. One more tune."],
  },
  // (the door)
  door: { greet: ["Good evening, sir. Straight through.", "Mr {sur}. Welcome. You're expected.", "Evening. Your table's ready."], comp: ["The club wants your picture, sir. The table's on us.", "Tonight's on the house. Enjoy."], min: ["Table minimum's ten thousand tonight, sir.", "Tables start at ten thousand. Bottle service included."], side: ["This way, sir. Nobody out here.", "Side door. Car's waiting."], id: ["Sorry, sir. Twenty-one and over, I'm afraid. State law."] },
  paps: ["{sur}! Over here! Left! Left!", "One more! One more!", "{sur}! Who are you here with?", "Big smile! Over here!"],
  flash: ["Was that a camera?", "Did you see that flash?", "Someone's got a long lens out there.", "Smile. We're being watched."],
  // (the team party)
  crew: { arrive: ["Here they are!", "The lads are in!", "Make some noise for the crew!"], thanks: ["Cheers, mate. Means a lot.", "Proper job today. All of us.", "Go and enjoy it. We'll be in soon.", "That's alright. Bring us the trophy later."] },
  speech: {
    win: ["Everyone - a minute. Tonight, this team won a Grand Prix. Every one of you did that. Enjoy it. Debrief at ten.", "I'll keep it short, because you've earned the champagne. A win. A proper, hard-fought win. Thank you, all of you."],
    podium: ["A podium. In a field like this. Every one of you should be proud. Glasses up.", "A few words, I promise. Tonight was a team result - from the factory to the pit wall. Thank you."],
    points: ["Good points tonight. Not the headline, but the kind that win championships. Thank you, everyone.", "Solid work, everyone. We took what was there. Enjoy tonight."],
    // (a finish outside the points: no pretending it was a good result - the work was, and the next race is)
    back: ["Not our night on the board. The work you all did was. Have a drink - we go again at the next one.", "No points tonight, and nobody here is happy about that. But I saw how hard this garage worked. Thank you. We go again."],
    dnf: ["Not the night we wanted. But we stand together on the bad nights too. Have a drink. Tomorrow we find out why.", "Tonight hurt. That's because it matters. Thank you for every hour you put in. We go again."],
  },
  champagne: ["Spray it! Spray it!", "Get the engineers!", "Mind the trophy!", "Somebody save some to drink!"],
  shoey: { chant: ["Shoey! Shoey! Shoey!", "Get it down you!", "Boot! Boot! Boot!"], after: ["LEGEND!", "That's disgusting. Again!", "Somebody get that on camera. ...Everyone got that on camera."] },
  parade: ["Make way! Make way!", "Table nine! Coming through!", "Sparklers! Mind your hair!"],
  // (dancing: the partner during the beat)
  dance: { ask: ["Come on, then.", "One song.", "Show me what you've got."], good: ["Not bad!", "Ha! You can actually move!", "Okay, okay. I'm impressed."], great: ["Who taught you that?", "Ha! Again!", "You've been practising."], off: ["...We'll work on it.", "Ha. Two left feet.", "It's fine. It's charming. Mostly."] },
  // (drivers talking among themselves nearby: the race and the job only)
  group: ["Did you see the restart?", "That Safety Car was late. Again.", "What time's your flight?", "Their straight-line speed's ridiculous.", "Ha. Go on, tell him.", "Don't start about the stewards.", "Who's on the sim on Tuesday?", "My engineer's still talking about lap one."],
  // (to a drunk player)
  drunk: { mate: ["Right. Water. Now.", "Mate. Sit down for a bit.", "You're done. I'm calling you a car."], friend: ["Easy, easy.", "How many fingers?", "Let's get some air."], security: ["Easy, champ.", "Sir, let's get you some air.", "This way, sir. Car's out back."] },
  stumble: ["Whoa! Got him!", "Did he just...?", "Get that! Get that!"],
  fans: ["{sur}! Sign my cap!", "Can I get a photo? Please!", "Great race! Great race!", "We waited all night!"],
  // (one hand of blackjack: the dealer)
  blackjack: { deal: ["Cards are in. Good luck, sir.", "Place your bet."], win: ["Twenty-one. Congratulations, sir.", "The house pays. Well played."], lose: ["The house wins. Better luck next time.", "Bust. Sorry, sir."], push: ["Push. Your bet stands."] },
  heli: ["Twenty-five minutes to Battersea, sir. Headsets on.", "Clear skies. Should be a smooth one."],
  cab: ["Where to, mate?", "Busy night? Hotel, is it?", "Saw the race on the radio. Good effort."],
  breakfast: { vegas: ["Pancakes for the table?", "Coffee? Lots of coffee?"], london: ["Wings and chips? Coming up.", "Six wings, two chips, extra sauce. Coming up."] },
};

// ---- the letterbox captions (a moment: Georgia, under the bars) ---------------------------------------------------------------
export const PARTY_MOMENT = {
  arrival: ["The rope lifts before you reach it. The door host already knows your name.", "Through the casino floor, past the slot machines and their glow, to the velvet rope."],
  wall: ["The step-and-repeat in {brand}'s colours, and a wall of lenses. 'Left! Over here! One more!'", "Flashbulbs, a printed wall, and every photographer calling your name at once."],
  shout: ["The DJ cuts the track. '{city}, make some noise for {me} {sur}!' The whole room turns.", "Your name over the sound system, and a cheer from every corner of the room."],
  parade: ["Servers in house black come through the crowd: sparklers, a three-litre bottle, and a lit-up sign with your number on it.", "Sparklers, a bottle the size of a toddler, and every phone in the room turned your way."],
  champagne: ["The trophy on the table, champagne over the engineers, and somebody's phone filming all of it.", "Corks, cheers, and the engineers drenched to the skin. Nobody minds."],
  shoey: ["Somebody's race boot, a pour of champagne, and a garage chanting your name. You drink it. Everyone films it."],
  speech: ["The boss taps a glass. The room goes quiet."],
  crew: ["The garage door is half down. The mechanics are taping crates for the trucks. You shake every hand.", "Freight boxes, tool chests, tired faces. You thank every one of them by name."],
  mechanics: ["A cheer from the door: the mechanics are in, still in team kit, the freight on the trucks."],
  kiss: { private: ["Out here, away from all of it, {her} leans in. The city keeps its distance.", "The music is a long way off. {her} kisses you, and for a moment there is nobody else."], floor: ["On the dance floor, in front of everyone, {her} kisses you. Somewhere, a phone is already up.", "Under the lights, in the middle of the floor. A hundred people see it. So does at least one lens."] },
  together: ["You leave together. A car to her hotel, a goodnight at the door, and the car takes you on to yours.", "Out of the side door, into a car, and a quiet ride to her hotel. Goodnight."],
  carried: ["An arm round your shoulders, a car at the kerb, and a long night ending sooner than you planned.", "The cool air outside, somebody steering you by the elbow, and a car door held open."],
  ejected: ["Security walks you to the door. The night is over.", "Two doormen, a firm hand on each arm, and the street. That's the night done."],
  breakfast: { vegas: ["Four in the morning: pancakes in a diner off the Strip, still in your party clothes, laughing at nothing."], london: ["Three in the morning: a chicken shop on the way back, wings in a box, the best meal of the weekend."] },
  heli: ["The helicopter lifts off the circuit's pad as the light goes. Twenty-five minutes later: the river, and the lights of Battersea."],
  car: ["A car from the circuit. An hour and three quarters down the M40 and into London, the race replaying in your head."],
  lightsUp: ["Five in the morning. The music stops, the house lights come up, and everyone looks a little worse than they did."],
  lastOrders: ["Last orders at the bar. A bell, a groan, and a rush."],
  police: ["Two police officers take statements by the door. No arrests. Your PR manager's phone is already ringing."],
  fans: ["Outside, at four in the morning, a handful of fans are still at the barrier with caps and pens."],
  hotel: ["Back to the hotel. Blackout curtains, a glass of water, and the race on your phone one more time."],
};

// ---- the phone (the 3 am text, her reply, someone else's buzz) ---------------------------------------------------------------------
export const PARTY_PHONE = {
  exDraft: ["You up?", "Saw you tonight. You looked happy. Good.", "I miss you. Is that allowed?", "Can we talk? Not now. Sometime."],
  exReply: ["It's 3am. Go to sleep.", "...Drink some water. Goodnight.", "Don't do this to either of us. Night.", "Text me when you're sober. Or don't."],
  exNone: ["Delivered. Read. Nothing.", "Delivered."],
  buzz: ["Saw you on someone's story. Who's that you're with?", "Having fun? Looks like it.", "Text me when you're back at the hotel.", "Are you at the after-party? Without me?"],
};

// ---- goodbyes at a party (HangoutTalk.hangoutBye calls this for a party venue) -------------------------------------------------
const BYE_P = {
  rep: { good: ["Lovely to meet you properly. We'll be in touch.", "Let's talk next week. I mean it.", "This was great. Monday, then."], ok: ["Enjoy the rest of your night.", "Good to meet you."], bad: ["I'll let you get back to it.", "Enjoy your evening."] },
  agent: { good: ["You've got my number. Use it.", "We'll talk. Soon."], ok: ["Enjoy the party.", "Catch you later."], bad: ["Another time.", "Right. Enjoy."] },
  press: { good: ["Thanks. Enjoy the rest of the night. I will.", "Lovely. You've made my Monday."], ok: ["Off the record. Promise.", "Enjoy yourself."], bad: ["Mm. Enjoy your night.", "Noted."] },
  infl: { good: ["You're a legend. I'm tagging you.", "Ahh, thank you! Posting it now!"], ok: ["Okay! Bye!", "Thanks!"], bad: ["...Okay. Bye.", "Whatever."] },
  dj: { good: ["Back to the decks. Don't stop dancing.", "Big love. Enjoy it."], ok: ["Catch you later.", "Enjoy the set."], bad: ["Right.", "Sure."] },
  security: { good: ["Shout if you need me, sir.", "Enjoy your night, sir."], ok: ["Sir.", "Sir."], bad: ["Sir.", "I'll be right here."] },
  boss: { good: ["Enjoy it. You earned it. Debrief at ten.", "Good. Now go and have fun. Sensibly."], ok: ["Debrief at ten. Hydrate.", "Enjoy tonight."], bad: ["Ten o'clock. Don't be late.", "We'll talk on Monday."] },
  pr: { good: ["Perfect. Smile, say nothing.", "Good. You're doing great."], ok: ["Remember: no posts after two.", "Behave."], bad: ["Please behave.", "I'm watching you."] },
  eng: { good: ["Copy. Enjoy it. Ten o'clock.", "Good chat. Debrief at ten."], ok: ["Copy.", "See you at ten."], bad: ["Copy. Ten.", "Right. Ten o'clock."] },
  person: { good: ["Great to meet you!", "Have a great night!"], ok: ["Bye!", "Have a good one."], bad: ["Whatever, mate.", "Right."] },
};
const BYE_D = {
  good: ["Proper night, this.", "Right, I'm going to find the bar. Back in a bit.", "Good chat. Don't go anywhere."], ok: ["Back in a bit.", "Catch you in a minute.", "Right. I'm going to find my lot."],
  bad: ["Right. I'm going to find my team.", "...Okay. Later.", "Fine."], drunk: ["Drink some water, yeah?", "Go easy, mate.", "I'm watching you. Water."],
};
const BYE_C = { warm: ["Don't disappear. I mean it.", "Come and find me. I'll be on the dance floor.", "Don't be long."], cold: ["...I'm going to find my friends.", "Right. Okay.", "...I need a minute."], drunk: ["Water. Then come and find me.", "You're sweet. Go and drink some water."] };
/** the guest's line as a conversation at a party closes, by how it went (dm) and how far gone you are -> string */
export function partyBye(x = {}, n = {}, dm = 0) {
  if (n.kind === 'person') { const B = BYE_P[n.role] || BYE_P.person; return pick(dm >= 3 ? B.good : dm >= 0 ? B.ok : B.bad); }
  if (isStar(n)) return pick(tier(x) >= 3 && dm >= 0 ? BYE_C.drunk : dm < 0 ? BYE_C.cold : BYE_C.warm);
  if (tier(x) >= 3) return pick(BYE_D.drunk);
  return pick(dm >= 3 ? BYE_D.good : dm >= 0 ? BYE_D.ok : BYE_D.bad);
}

/** a name tag's second line for a person at a party: their title and why they matter ('Ampwave · Head of athlete marketing · could offer a deal') */
export function partyTag(n = {}) {
  if (n.kind !== 'person') return '';
  if (n.tag) return n.tag;
  return [n.role === 'rep' ? n.brandName : n.role === 'press' ? n.outlet : null, n.title, n.role === 'rep' && n.deal ? 'your sponsor' : n.why].filter(Boolean).join(' · ');
}
