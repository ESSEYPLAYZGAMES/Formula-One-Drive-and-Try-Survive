// The after-party: the career's race night. After the round's report, up to two invitations wait - your own team's
// celebration in the paddock hospitality, and a club in the race's city (Las Vegas: a casino-resort club on the Strip;
// Silverstone: a members' club in Mayfair, London), sometimes taken over by a sponsor - and either is played out in 3D
// (ui/Hangout.js with ui/PartyPlay.js) or summed up. This module is the career side: the race snapshot (taken inside
// Career.applyRace before the round moves on, so the race's own city, guests and result are kept), the offers, the guest
// list and its roles, the age gate, and what the night comes to: friendships and rapport, the celebrities, sponsors and
// agents met, money, the hangover in the fresh week, the press and the texts the morning after.
// THE LINE: realistic adult F1 nightlife as it happens - alcohol and its consequences, revealing but realistic clubwear,
// PG romance with the twelve invented adult stars, handbags scuffles with invented people only. Never nudity, sexual
// content, illegal drugs (not even implied), drink-driving or underage drinking (21+ in Nevada, 18+ in the UK). Real
// drivers attend, toast, dance, network and argue about the race, but are never drunk, in romance, scandal or a fight;
// real team principals are never depicted (yours is the generic one). Venues, resorts and brands are invented. A grave
// race (anyone hurt or killed, a stand-in in your car, a memorial week) has no party at all. State: c.party (plain JSON).

/**
 * ==================================== THE PARTY CONTRACT (WP1, published for WP2-WP6) ====================================
 * Everything below is plain JSON. Field names are stable; new optional fields may be added.
 *
 * VENUES: 'teamparty' (your team's hospitality in the paddock) | 'vegasclub' (after Las Vegas) | 'londonclub' (after
 *   Silverstone) | 'poolclub' (the Tidewater Beach Club's night swim: after Las Vegas in even seasons, in the Halo
 *   Room's place). VENUE_OF[track] gives the club for a race's track; clubOf(track, season, round) the one offered tonight.
 * CLOCK: hours on the race day's clock, running on past midnight: 23.5 = 23:30, 24.75 = 00:45 the next morning,
 *   29 = 05:00. Every start / close / leftAt / drinks[].at uses it.
 *
 * ---- c.party (partyEnsure fills an old save; becomeDriver and _grief clear it) -----------------------------------------
 * {
 *   v: 1,
 *   salt: string                   this career's own seed for the night's draws (rev. 2026-10-10: two careers never get
 *                                  the same first party; partyEnsure gives an old save one)
 *   race: RaceSnap | null,         the race just run (snapAfterRace), until the next one
 *   offers: [Offer],               tonight's invitations (read them through partyOffers(c): it drops stale ones)
 *   last: PartyLast | null,        the night just settled, for the morning-after modal; last.unseen true until the hub
 *                                  shows it (WP6 sets c.party.last.unseen = false and saves)
 *   history: [{ season, round, track, venue, brand, exit, peak, score, big }]   newest first, 12 kept
 *   streak: [n]                    round indices (season * rounds + round) of big nights; 3 within 4 rounds: a warning
 *   mates: { did: { season, round } }       the team-mates you raced alongside (ex-team-mates: not your mate now)
 *   met: { agentId: { season, round } }     agents met at a party (negoProfile: patience +1, ask x0.97 that season)
 *   repMet: { brandId: { season, round, dm } }
 *   snub: { brandId: roundIndex }  that brand's rep will not court you until this round index
 *   feud: { did: { season, round } }        a team-mate feud left open (the 'clear the air' talk ends it)
 * }
 *
 * ---- RaceSnap (c.party.race) ---------------------------------------------------------------------------------------------
 * { season, round, track, city ('Las Vegas' | 'London'), gp ('Las Vegas Grand Prix'), date ('YYYY-MM-DD', the race day),
 *   pos (your place or null), won, podium, dnf, points (scored), grave, hurt (you hurt or killed), standIn (someone
 *   else drove your car), live (your own driver raced and nobody was hurt), fought (did | null: the grid scuffle or the
 *   worst contact), contacts: [did], mate (did | null), matePos (null | 0 = DNF | place), mateAhead (bool),
 *   winner (did | null), podium3: [did] (P2 and P3, not you: rev. 2026-10-10), top: [surname] (the first eight home, for the team's replay screen), stars: [celebId] (celebsAtRace before the round moved on: partner and invited included),
 *   partner (celebId | null), exes: [celebId] (at the race, stage 'ex') }
 *
 * ---- Offer (partyOffers(c) -> [Offer], at most 2) ---------------------------------------------------------------------------
 * { id ('<season>|<round>|<venue>'), venue, host: 'team' | 'club', brand (brandId | null: a sponsor takeover),
 *   brandName, color (the host's colour), contractual (the host is one of your deals: it is the week's sponsor day),
 *   title, hostLine, place ('Halo Room, Meridian Grand'), city, start, close, lastCall (or null), dress ('Team kit' |
 *   'Club'), age (21 | 18: the venue's legal age), ok (you may go), why ('' | the reason it is greyed: '21+ in Nevada'),
 *   hook (one line, 2 at most on the card), risk / spend / energy (0..3 pips), cost ($M expected), comped (the club
 *   comps the table: a sponsor's night, fame index 60+, the winner, most podium finishers), people: [{ cid, kind,
 *   name, role, color }] (6 at most, for the avatar discs), more (n not shown), travel: null | { car: '1 h 45',
 *   heli: { min: 25, cost: 0.004 } } (London only), status: 'open' | 'went' | 'summed' | 'skipped' }
 *
 * ---- partyLaunch(c, offerId, act = 1, carry = null, o = {}) -> Launch | null --------------------------------------------------
 * o.travel: 'car' | 'heli' (the London card's toggle; the helicopter's $0.004M is charged by partyResult, not in spend).
 * The object CareerHub.offerEvening / playEvening and main.careerHangout carry (branch on key 'party': never overwrite
 * its track or night):
 * { key: 'party', partyId (the offer id), venue, host, brand, brandName, hostColor, contractual, track (the race's),
 *   city, gp, night (true, but false for the team party at Silverstone: daylight in July), start (act 2: carry.clock, else the venue's), close, lastCall, act (1 | 2), carry (act 2:
 *   act 1's R.party), travel ('car' | 'heli' | null), me: { name, age, soft (soft drinks only), fame (fameIndex 0..100),
 *   comped (the club comps your table), real (a real driver: anonymised copy, never the 'stumble' bank, no 'nightout'
 *   crisis; PartyPlay keeps a real driver below drunk - water from the bar past tipsy - with no stumble and no scuffle) },
 *   race: RaceSnap, guests: [Guest], drama: [Drama] }
 * Guest: { kind: 'driver' | 'celeb' | 'person', id, cid ('d:<id>' | 'c:<id>' | 'p:<role>:<id>' | 'x:boss' | 'x:eng'),
 *   name, first, team, color, color2, role, tier, talk, age, soft, real, fictional, look, why, stage, brand, clients }
 *   role: 'partner' | 'mate' | 'rival' | 'exmate' | 'friend' | 'celeb' | 'ex' | 'boss' | 'eng' | 'rep' | 'agent' |
 *         'press' | 'infl' | 'present' | 'dj' | 'bartender' | 'security' | 'antagonist'
 *   tier: 'principal' (8 at most, built at detail 0.75, 3 talks) | 'present' (4 at most at a club since rev.
 *         2026-10-10 - the winner, the podium, friends, an F2 junior or reserve old enough; 1 at the team party: one quick word, talk 1) |
 *         'staff' (the DJ, the bartender, security: built at 0.6; Jade Okafor as DJ is a celeb at 0.75) |
 *         'reserved' (the drama's antagonist: built behind the cover, hidden until the drama calls him)
 *   talk: conversations on offer (3 | 1 | 0). soft: soft drinks only (under age). real: a real person (no drunk,
 *   romance, scandal or fight copy - a row stays verbal). fictional: !real (the only people a scuffle can involve).
 *   look: makePerson options for a 'person' (figure, kit, color, accent, legs, skin, hair, style: { hs, fh }, seed...),
 *   or null (drivers and celebs dress by the venue's occasion as now). why: the name tag's second line ('Ampwave ·
 *   Head of athlete marketing · could offer a deal'). stage: a celeb's bond stage. brand: a rep's brandId. clients:
 *   an agent's [did].
 * Drama: { id: 'needle' | 'feud' | 'exnew' | 'dateex' | 'spill' | 'fan' | 'overheard' | 'paps', cid (who it is with),
 *   with (a second cid: the ex the man came in with, the date whose ex it is), after (clock hour it may fire from),
 *   chance (0..1 once due), brawl (it may escalate to the handbags scuffle: fictional antagonists only), real }
 *   2 at most a night; at most one 'reserved' antagonist guest.
 *
 * ---- R.party (ui/PartyPlay.js fills it into the Hangout result: r.party) ------------------------------------------------------
 * Act 2 (team party -> 'On to the club'): act 1 ends with exit 'moveon'; WP6 calls partyLaunch(c, clubOfferId, 2,
 * r1.party) and WP5 seeds act 2 from launch.carry, so the act 2 R.party holds the WHOLE night. partyResult is called
 * once, with the final result.
 * { act, venue, brand, drinks: [{ kind ('champagne' | 'cocktail' | 'shot' | 'beer' | 'wine' | 'water' | 'soft'), at }],
 *   units, peak (highest level), level (at the end), water (glasses), leftAt (clock), exit: 'hotel' | 'teamcar' | 'side' |
 *   'front' | 'together:<cid>' | 'breakfast' | 'carried' | 'ejected' | 'moveon', stumble (bool), photographed (bool: the
 *   exit roll), kiss (cid | null), kissSeen (bool: on the floor, the photographers may have it), kissPrivate (bool: nobody
 *   in the room saw it), kissSeenBy ([cid]: who did), spend ($M: everything - table, bottles, rounds, a parade, a lost
 *   hand of blackjack; not the helicopter), table (bool), comped (bool), parade (bool),
 *   danced: [{ cid | null, score 0..1 }], selfies (n), contacts: { cid: { role, score 0..1, dm, talks, fx: { network,
 *   loose, provoke, dance, together, kiss, flirt, charm, deep, clear, selfie, ... }, priv (how many of the romance moments
 *   - flirt, dance, kiss - were in private: none of them seen by anyone else in the room) } }, drama: [{ id, cid, choice, outcome ('calm' |
 *   'cold' | 'row' | 'scuffle' | 'walked') }], brawl: null | ui/PartyBrawl.js partyBrawlFx(...): { result ('won' | 'lost' | 'even' |
 *   'walked'), escalated, started, onCamera, police (rolled there), composure (the change) },
 *   loose: [{ near: [cid], leak (bool: about the car) }], seenDrunkBy: [cid], textedEx (celebId | null), shoey, crewThanked,
 *   toast, speech, mechanics, heli (bool), iv (bool), next ('club' | null) }
 * The rest of the Hangout result (score, per, seen, flashes, selfies, photo (a data URL), moments, fx) is read too:
 * per[cid].score is the fallback for contacts[cid].score.
 * The career side of a scuffle (composure -8, +3 won / -4 lost, the PR story and crisis, the star's reaction, the team
 * principal's text, the rare 'police took statements, no arrests') is applied HERE from R.party.brawl: PartyBrawl's
 * partyBrawlFx only describes it for the scene and must not apply career effects itself.
 *
 * ---- what partyResult(c, r) gives back, and c.party.last (PartyLast) -------------------------------------------------------
 * { ok, lines: [text], last: PartyLast }
 * PartyLast: { unseen, season, round (the race's), track, city, gp, venue, place, brand, exit, title, photo (a data URL or
 *   null; dropped from the save once seen), timeline: [text] (6 at most), press: [{ outlet, name, text, tone }] (3 at most),
 *   crisis (kind | null), people: [{ cid, name, role, delta: [{ k: 'friendship' | 'rapport' | 'affection' | 'offer' |
 *   'snub' | 'appeal' | 'agent', v, text }] }] (6 at most), hangover: { H, energy, slot ('recovery' | 'iv' | null), rough,
 *   text }, money: { spend, comped }, score, peak, texts: [{ cid, name, text }] }
 *
 * ---- the exports -----------------------------------------------------------------------------------------------------------
 * partyEnsure(c), partyReset(c), partySeen(c) (the morning-after shown: unseen false, photo dropped), snapAfterRace(c, o),
 * partyTick(c) -> { lines }, partyOffers(c) -> [Offer],
 * partyLaunch(c, offerId, act, carry, o) -> Launch | null, partyResult(c, r) -> { ok, lines, last }, autoParty(c, offerId)
 * -> the same, skipParty(c) -> { ok, lines }, ageOf(c, d | did, trackId, season) -> years | null (unknown), ageOk(c, d |
 * did, trackId, season) -> may drink and go in (21 in Nevada, 18 in the UK; an unknown reserve or F2 age counts as under
 * 21 in the US), agentFor(did) -> the driver's agent (AGENTS), REPS (brandId -> the rep), AGENTS, BIRTH, RACE_DATE,
 * VENUE_OF, PARTY_TIMES, hhmm(clock) -> '00:45'.
 * =========================================================================================================================
 */
import { CELEB, CELEBS, celebsAtRace, partnerAtRace, bondOf, seeing, meet, flirt, charm, dateResult, relateCeleb, trustCeleb, upsetCeleb, exposure, stageLabel } from './Celebs.js';
import { BRAND_BY_ID, fameIndex, prEvent, crisisFrom, offerFrom } from './PR.js';
import { pushText, relateFriend, meetDriver, friendOf, stageName } from './Social.js';
import { weekOf, weekGain, setHangover } from './Agenda.js';
import { shiftMorale } from './Morale.js';

// ---- small helpers ----------------------------------------------------------------------------------------------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const num = (v, f) => (typeof v === 'number' && isFinite(v) ? v : f);
const arr = (a) => (Array.isArray(a) ? a : []);
const obj = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? o : {});
const r2 = (v) => Math.round(v * 100) / 100;
const r4 = (v) => Math.round(v * 10000) / 10000;
/** money in $M to the dollar (a night's tab is dollars, not hundreds of them) */
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const first =(s) => String(s || '').trim().split(/\s+/)[0] || '';
const last = (s) => String(s || '').trim().split(/\s+/).pop() || '';
/** 'Lando' / 'Lando and Oscar' / 'Lando, Oscar and Max' */
const list = (a) => (a.length <= 1 ? a[0] || '' : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
/** the paddock's string hash (FNV-1a) */
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
/** a small seeded random: the same guest list for the same night, however often it is asked */
const rng = (s) => { let h = hash(s) | 0; return () => { h = (h + 0x6d2b79f5) | 0; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const pickR = (a, R) => a[(R() * a.length) | 0];
const pick = (a) => a[(Math.random() * a.length) | 0];
const fill = (s, T) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => (T[k] != null ? String(T[k]) : ''));
/** a call into another engine that must never stop a night being settled -> its result, or d */
const safe = (what, f, d = null) => { try { const v = f(); return v === undefined || v === null ? d : v; } catch (e) { console.warn(`Party: ${what} failed`, e); return d; } };
const SPAN = (c) => c?.rounds || 6;
/** rounds since a stamp ({ season, round }) -> n (99 for never) */
const ago = (c, at) => (at && at.season != null && at.round != null ? (c.season - at.season) * SPAN(c) + (c.round - at.round) : 99);
/** a race's place in the whole career (season by season): for the streak and the snubs */
const ridx = (c, season, round) => season * SPAN(c) + round;
/** the race n rounds on from now, as the press desk stamps it (a season over: now is the next season's first race) */
const aheadOf = (c, n) => {
  const R = SPAN(c); let s = num(c?.season, 2026), r = num(c?.round, 1) + n;
  if (num(c?.round, 1) > R) { s++; r = 1 + n; }
  while (r > R) { r -= R; s++; }
  return { season: s, round: Math.max(1, r) };
};
const meOf = (c) => c?.drivers?.[c.playerId] || null;
/** a real person (the grid, the reserves, F2) rather than one of the game's own (custom, juniors) */
const isReal = (d) => !!d && ['F1', 'Reserve', 'F2'].includes(d.from);
const live = (d) => !!d && d.alive !== false;
const hurtNow = (c, d) => !!d && d.outUntil != null && d.outUntil >= c.round;
const TOGETHER = ['dating', 'partner'];
/** you are in something with her (Celebs' rule): together, or she said yes to a date you have not had yet */
const involved = (b) => !!b && !b.grieving && (TOGETHER.includes(b.stage) || (!!b.accepted && b.stage !== 'ex'));
/** clock hours as a time: 24.75 -> '00:45' */
export function hhmm(h) { const m = Math.floor(((num(h, 0) % 24) + 24) % 24 * 60 + 1e-6); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; }

// ---- the places and the calendar ----------------------------------------------------------------------------------------
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal' };
const CITY = { lasvegas: 'Las Vegas', silverstone: 'London', montreal: 'Montreal' };
const GP = { lasvegas: 'Las Vegas Grand Prix', silverstone: 'British Grand Prix', montreal: 'Canadian Grand Prix' };
const GPS = { lasvegas: 'Las Vegas GP', silverstone: 'British GP', montreal: 'Canadian GP' };
/** the club after each race: keyed by the race's track (only the circuits that exist; no data waits for others) */
export const VENUE_OF = { lasvegas: 'vegasclub', silverstone: 'londonclub' };
/** the club offered tonight: in Las Vegas the Tidewater Beach Club's night swim (ui/PartyPool.js 'poolclub') and the
 *  Halo Room take turns from one Vegas race to the next, so a season has both (the TONIGHT sheet holds two cards: the
 *  team's party and one club) */
const clubOf = (track, season, round) => (track === 'lasvegas' && (num(season, 0) + Math.floor(num(round, 1) / 2)) % 2 === 0 ? 'poolclub' : VENUE_OF[track] || null);
/** race day (month-day) for the age gate: Las Vegas is a Saturday night race (20:00 local), Silverstone a Sunday (15:00) */
export const RACE_DATE = { lasvegas: '11-21', silverstone: '07-05', montreal: '06-14' };
/** the legal age to go in and drink: Nevada 21, the UK 18 */
const LEGAL = { lasvegas: 21, silverstone: 18, montreal: 18 };
/**
 * Each night's clock (CLOCK hours): the team party after the debrief (Las Vegas 23:30-01:15; Silverstone 19:30-22:00);
 * the Strip's club from 00:45, the lights up at 05:00 - Nevada has no legal last call; the Mayfair club 23:00-03:00,
 * last orders 02:45. late: when it starts to feel late. (ui/PartyVenues.js PARTY_PLACES carries the same for the scene.)
 */
export const PARTY_TIMES = {
  teamparty: { lasvegas: { start: 23.5, late: 24.9, close: 25.25, lastCall: null }, silverstone: { start: 19.5, late: 21.5, close: 22, lastCall: null }, montreal: { start: 21, late: 23.5, close: 24, lastCall: null } },
  vegasclub: { start: 24.75, late: 28, close: 29, lastCall: null },
  londonclub: { start: 23, late: 26.25, close: 27, lastCall: 26.75 },
  poolclub: { start: 23.75, late: 27.5, close: 28.5, lastCall: null },
};
const timesOf = (venue, track) => (venue === 'teamparty' ? PARTY_TIMES.teamparty[track] || PARTY_TIMES.teamparty.lasvegas : PARTY_TIMES[venue] || PARTY_TIMES.vegasclub);
const PLACE = {
  vegasclub: { name: 'Halo Room', where: 'Meridian Grand', place: 'Halo Room, Meridian Grand', kind: 'Casino-resort nightclub', privacy: 0.25 },
  londonclub: { name: 'The Ormond Vault', where: 'Mayfair', place: 'The Ormond Vault, Mayfair', kind: "Members' club", privacy: 0.6 },
  poolclub: { name: 'Tidewater Beach Club', where: 'Meridian Grand', place: 'Tidewater Beach Club, Meridian Grand', kind: 'Pool party', privacy: 0.3 },
  teamparty: { name: 'Team hospitality', where: 'the paddock', place: 'the team hospitality', kind: 'Team celebration', privacy: 0.65 },
};
/** a sponsor takeover: the invented brands that throw parties (heatMax 70 and up), and their colours */
const HOSTS = ['ampwave', 'lanternfish', 'lumora', 'vireo', 'solenne', 'arlette', 'velane'];
const BRAND_COL = { ampwave: '#b8f000', lanternfish: '#00b8f0', lumora: '#8a5cff', vireo: '#ff6b3d', solenne: '#ffb000', arlette: '#d9c39a', velane: '#c9a24a' };
// (the money, $M: Las Vegas; London about 0.6 of it)
const MONEY = { table: 0.01, bottle: 0.0025, parade: 0.025, heli: 0.004 };

// ---- ages: the real drivers' birthdays (checked against their official profiles), the game's own juniors' invented ones -----
export const BIRTH = {
  'Lando Norris': '1999-11-13', 'Oscar Piastri': '2001-04-06', 'Charles Leclerc': '1997-10-16', 'Lewis Hamilton': '1985-01-07', 'Max Verstappen': '1997-09-30', 'Isack Hadjar': '2004-09-28',
  'George Russell': '1998-02-15', 'Kimi Antonelli': '2006-08-25', 'Fernando Alonso': '1981-07-29', 'Lance Stroll': '1998-10-29', 'Alexander Albon': '1996-03-23', 'Carlos Sainz': '1994-09-01',
  'Liam Lawson': '2002-02-11', 'Arvid Lindblad': '2007-08-08', 'Esteban Ocon': '1996-09-17', 'Oliver Bearman': '2005-05-08', 'Pierre Gasly': '1996-02-07', 'Franco Colapinto': '2003-05-27',
  'Nico Hulkenberg': '1987-08-19', 'Gabriel Bortoleto': '2004-10-14', 'Valtteri Bottas': '1989-08-28', 'Sergio Perez': '1990-01-26',
  "Pato O'Ward": '1999-05-06', 'Antonio Giovinazzi': '1993-12-14', 'Yuki Tsunoda': '2000-05-11', 'Frederik Vesti': '2002-01-13', 'Felipe Drugovich': '2000-05-23', 'Luke Browning': '2002-01-31',
  'Ayumu Iwasa': '2001-09-22', 'Ryo Hirakawa': '1994-03-07', 'Kush Maini': '2000-09-22', 'Paul Aron': '2004-02-04', 'Zhou Guanyu': '1999-05-30',
  'Leonardo Fornaroli': '2004-12-03', 'Richard Verschoor': '2000-12-17', 'Jak Crawford': '2005-05-02', 'Dino Beganovic': '2004-01-19', 'Victor Martins': '2001-06-16', 'Joshua Durksen': '2003-10-27',
  // (the game's own juniors: invented, like them)
  'Tomás Rivera': '2007-03-14', 'Kenji Morita': '2006-06-02', 'Elias Brandt': '2005-02-20', 'Noah Lindqvist': '2008-01-09', 'Rafael Costa': '2004-09-30', 'Ivan Petrov': '2006-11-27',
};
/**
 * A driver's age on a race day (d: the record or its id; trackId: the race's circuit, for the date; season: the year)
 * -> years, or null when unknown (a reserve or F2 driver without a birthday on file). A driver you made yourself with no
 * age is an adult; a stored d.birth ('YYYY-MM-DD') or d.age (with d.ageSeason) wins over the table.
 */
export function ageOf(c, d, trackId = null, season = null) {
  if (typeof d === 'string') d = c?.drivers?.[d];
  if (!d) return null;
  const s = num(season, num(c?.party?.race?.season, num(c?.season, 2026))), md = RACE_DATE[trackId] || '07-01', b = typeof d.birth === 'string' ? d.birth : BIRTH[d.name];
  if (b && /^\d{4}-\d{2}-\d{2}$/.test(b)) { const [y, m, dd] = b.split('-'); return s - +y - (md < `${m}-${dd}` ? 1 : 0); }
  if (Number.isFinite(d.age)) return d.age + (s - num(d.ageSeason, s));
  if (['Reserve', 'F2', 'Junior'].includes(d.from)) return null;
  return 30;
}
/** may go in and drink in that race's city (21 in Nevada, 18 in the UK; an unknown age: under 21 in the US) */
export function ageOk(c, d, trackId = null, season = null) {
  const a = ageOf(c, d, trackId, season), legal = LEGAL[trackId] || 18;
  return a == null ? legal < 21 : a >= legal;
}

// ---- the invented people of the night: looks for People.makePerson ------------------------------------------------------
const SKIN = ['#f1d3bd', '#e7bf9f', '#d8a47f', '#c18a63', '#a4704c', '#8a5a3b', '#6b442c', '#4f3122'];
const HAIR = ['#1b1512', '#2a1e17', '#3b2a1e', '#5a3d27', '#7a5434', '#a77d4c', '#c9a46c'];
const HS_M = ['short', 'buzz', 'side', 'quiff', 'swept', 'curly', 'wavy'], FH = [null, null, 'stubble', 'beard', null];
const HS_F = ['blowout', 'waves', 'long', 'highpony', 'ponytail', 'bun', 'bob', 'curlyLong'];
const F_COL = ['#111114', '#c8102e', '#1f4d3a', '#d4af6a', '#e8e4dc', '#6a1f2e', '#2a3a6a', '#c86a9a', '#b8925e', '#5a2a6a'];
const M_COL = ['#111114', '#1b2440', '#2a2420', '#e8e4dc', '#3a2a4a', '#5a1422', '#2e3a2c'];
// (her club kits from People's CLUB_KITS that a guest on the list might wear; the trousered ones get trouser colours)
const F_CLUB = ['cutoutmini', 'bandeauset', 'cropjeans', 'haltermicro', 'sidecut', 'slipmini', 'meshdress', 'blazerbra', 'corsettop', 'lacemini', 'lacebustier', 'laceset'];
const TROUSERED = { cropjeans: '#2b3a5a', corsettop: '#111114' };
/** a person's look (makePerson options): the same face, hair and colours for the same seed, every night */
const lookOf = (seed, fem, kit, color, accent, x = {}) => {
  const h = hash(seed), k = (L, s) => L[(h >>> s) % L.length];
  const o = { kit, color, accent: accent ?? color, seed: String(seed), skin: k(SKIN, 1), hair: k(HAIR, 5), jitter: 0.01 };
  if (fem) Object.assign(o, { figure: 'f', legs: TROUSERED[kit] ?? (['pantsuit', 'blazer'].includes(kit) ? color : null), style: { hs: k(HS_F, 9), fh: null, lip: true }, acc: ['earrings'] });
  else Object.assign(o, { legs: kit === 'pantsuit' ? color : k(['#111114', '#1c1f26', '#1a1a1e', '#2a2c33'], 7), style: { hs: k(HS_M, 9), fh: k(FH, 13) } });
  return Object.assign(o, x);
};
/** a club look for a guest on the list: hers from the club kits, his an open silk shirt, a fine knit, a T-shirt under a blazer, leather */
const clubLook = (seed, fem, x = {}) => {
  const h = hash(`${seed}|club`);
  return fem ? lookOf(seed, true, F_CLUB[h % F_CLUB.length], F_COL[(h >>> 4) % F_COL.length], F_COL[(h >>> 8) % F_COL.length], { acc: ['earrings', 'bag'], ...x })
    : lookOf(seed, false, ['silkshirt', 'knitpolo', 'teeblazer', 'leather'][h % 4], M_COL[(h >>> 4) % M_COL.length], (h >>> 8) % 2 ? '#f1f0ec' : '#111114', x);
};
/** smart for business (a rep or an agent at a party): a trouser suit or a blazer; a T-shirt under a blazer for him */
const smartLook = (seed, fem, x = {}) => {
  const h = hash(`${seed}|smart`);
  return fem ? lookOf(seed, true, h % 2 ? 'pantsuit' : 'blazer', ['#1a1d24', '#2a2420', '#e8e4dc', '#1e2a44'][(h >>> 3) % 4], '#e8e6e0', x)
    : lookOf(seed, false, h % 2 ? 'teeblazer' : 'pantsuit', ['#111114', '#1a1d24', '#1e2a44'][(h >>> 3) % 3], '#f1f0ec', x);
};
const P_ = (id, name, title, fem) => ({ id, name, title, fem });
/** the brands' people: one rep each (every brand is invented, and so is everyone who works for it) */
export const REPS = {
  ampwave: P_('kessler', 'Brody Kessler', 'Head of athlete marketing', false), lanternfish: P_('hart', 'Kenzo Hart', 'Head of marketing', false),
  lumora: P_('sato', 'Nina Sato', 'Head of partnerships', true), vireo: P_('navarre', 'Jules Navarre', 'Marketing director', true),
  solenne: P_('ferri', 'Luca Ferri', 'Brand director', false), arlette: P_('roussel', 'Camille Roussel', 'Head of celebrity relations', true),
  velane: P_('laurent', 'Amélie Laurent', 'Creative director', true), kestrel: P_('aalto', 'Henrik Aalto', 'Head of brand partnerships', false),
  northvale: P_('pell', 'Graham Pell', 'Sponsorship manager', false), fjelda: P_('solberg', 'Ingrid Solberg', 'Brand manager', true),
  orris: P_('lyle', 'Edward Lyle', 'Director, private clients', false), gridline: P_('okonjo', 'Sam Okonjo', 'Community lead', false),
  torrent: P_('doyle', 'Megan Doyle', 'Athlete marketing manager', true), ristra: P_('ortega', 'Pablo Ortega', 'Founder', false),
};
/** the drivers' agents (invented; ui/Negotiation.js seats the same one at the table): each driver has one, by a hash of his id */
export const AGENTS = [P_('webb', 'Daniel Webb', 'Driver manager', false), P_('marchetti', 'Sofia Marchetti', 'Driver manager', true), P_('kapoor', 'Ravi Kapoor', 'Driver manager', false),
  P_('brooks', 'Hannah Brooks', 'Driver manager', true), P_('ruiz', 'Mateo Ruiz', 'Driver manager', false), P_('dubois', 'Claire Dubois', 'Driver manager', true)]
  // (dressed for business, her hair up or short: a trouser suit at the table and at a party alike)
  .map((a) => ({ ...a, look: a.fem ? lookOf(`agent|${a.id}`, true, 'pantsuit', '#1c2a44', '#e8e6e0', { style: { hs: hash(a.id) % 2 ? 'bun' : 'bob', fh: null, lip: true } }) : lookOf(`agent|${a.id}`, false, 'jacket', '#1c2a44', '#e8e6e0') }));
/** a driver's agent (the same one in a contract talk and at a party) -> { id, name, title, fem, look } */
export function agentFor(did) { return AGENTS[hash(`agent|${did}`) % AGENTS.length]; }
const DIARIST = P_('kemble', 'Rosie Kemble', "The Paddock Post's diary columnist", true);
/** the gossip writers who work the after-parties (invented, like their columns): one some nights, never every night */
const PRESS_POOL = [{ ...DIARIST, outlet: 'post' }, { ...P_('reid', 'Callum Reid', "Chequered's nightlife writer", false), outlet: 'feed' }, { ...P_('pryce', 'Imogen Pryce', "RACE 24's paddock diarist", true), outlet: 'race24' }];
/** the writer a press cid names ('p:press:kemble') -> the pool's entry (the Post's columnist if unknown) */
const pressOf = (cid) => PRESS_POOL.find((p) => `p:press:${p.id}` === String(cid)) || PRESS_POOL[0];
const INFLS = [P_('lark', 'Kiki Lark', 'Influencer', true), P_('monroe', 'Jaz Monroe', 'Influencer', true), P_('vance', 'Remy Vance', 'Creator', false), P_('moreno', 'Tia Moreno', 'Influencer', true), P_('banks', 'Ollie Banks', 'Creator', false)];
const RESIDENT = { vegasclub: P_('sola', 'DJ Sola', 'Resident DJ', false), londonclub: P_('grey', 'Ellis Grey', 'Resident DJ', true), poolclub: P_('coralie', 'DJ Coralie', 'Resident DJ', true) };
// (the men a tabloid links the stars with: Celebs' and PR's own invented list - never a driver, never anyone real)
const MEN = ['Jonah Reese', 'Dex Okoro', 'Theo Quinn', 'Kai Brennan'];
const STRANGER = { spill: P_('dunmore', 'Craig Dunmore', 'A man at the bar', false), fan: P_('pennant', 'Josh Pennant', 'A fan', false) };

// ---- the state (c.party) ---------------------------------------------------------------------------------------------------
const V_PARTY = 1, HIST_CAP = 12, CAP = 8;
/** 'present' drivers at a club (one quick word each): half the grid goes out after a race - men build cheaply (~0.2 s) */
const PRESENT_CLUB = 4;
/** this career's own salt for the night's draws (two careers never get the same first party) */
const newSalt = () => Math.random().toString(36).slice(2, 10);
const fresh = () => ({ v: V_PARTY, salt: newSalt(), race: null, offers: [], last: null, cur: null, history: [], streak: [], mates: {}, met: {}, repMet: {}, snub: {}, feud: {} });
/** a seeded draw for this career's night (salted per career: the same night every time it is asked, a different one in another career) */
const crng = (c, s) => rng(`${c?.party?.salt || ''}|${s}`);
/** the morning-after modal has shown the night: no longer unseen, and its photo leaves the save (WP6 calls this) */
export function partySeen(c) { const L = c?.party?.last; if (L) { L.unseen = false; L.photo = null; } return L || null; }
/** an older save's c.party, filled in and repaired (safe to call again) -> c.party */
export function partyEnsure(c) {
  if (!c || typeof c !== 'object') return null;
  const P = c.party && typeof c.party === 'object' && !Array.isArray(c.party) ? c.party : (c.party = fresh());
  P.v = V_PARTY;
  if (typeof P.salt !== 'string' || !P.salt) P.salt = newSalt();
  if (!P.race || typeof P.race !== 'object') P.race = null;
  P.offers = arr(P.offers).filter((o) => o && typeof o.id === 'string' && typeof o.venue === 'string');
  if (!P.last || typeof P.last !== 'object') P.last = null;
  if (P.last && !P.last.unseen) P.last.photo = null;   // (a photo is kept only until the morning-after has shown it)
  if (!P.cur || typeof P.cur !== 'object') P.cur = null;
  P.history = arr(P.history).filter((h) => h && typeof h === 'object').slice(0, HIST_CAP);
  P.streak = arr(P.streak).filter((n) => Number.isFinite(n)).slice(-8);
  for (const k of ['mates', 'met', 'repMet', 'snub', 'feud']) P[k] = obj(P[k]);
  for (const k of [...Object.keys(P.mates), ...Object.keys(P.feud)]) if (!c.drivers?.[k]) { delete P.mates[k]; delete P.feud[k]; }
  for (const k of Object.keys(P.met)) if (!AGENTS.some((a) => a.id === k)) delete P.met[k];
  return P;
}
const ensure = (c) => (c.party && c.party.v === V_PARTY && Array.isArray(c.party.offers) && c.party.mates && c.party.feud ? c.party : partyEnsure(c));
/** a new driver, or your driver gone: the party side starts again (Career.becomeDriver and _grief) */
export function partyReset(c) { if (!c) return null; c.party = fresh(); return c.party; }

// ---- 1. the snapshot: the race just run, taken inside applyRace before the round moves on --------------------------------
/**
 * o: { trackId, rows, X (applyRace's extra), meRow, mateRow, contacts, grave, live } (Career.applyRace, just before
 * this.round++). Driven and simulated races both pass through here. -> the RaceSnap
 */
export function snapAfterRace(c, o = {}) {
  const P = ensure(c); if (!P) return null;
  const X = obj(o.X), rows = arr(o.rows), tid = o.trackId || null, meRow = o.meRow || null, mateRow = o.mateRow || null, pid = c.playerId, me = meOf(c);
  const mine = !!meRow && meRow.car?.careerId === pid, fin = !!meRow && !meRow.car?.retired, pos = meRow ? num(meRow.pos, null) : null;
  const hurt = !live(me) || arr(X.hurtIds).includes(pid) || (!!meRow && (!!meRow.car?.injured || !!meRow.car?.fate));
  const contacts = [...new Set(arr(o.contacts).slice().sort((a, b) => num(b?.sev, 0) - num(a?.sev, 0)).map((k) => k?.id).filter((id) => id && id !== pid && c.drivers?.[id]))];
  const cx = c.pr?.ctx, fx = cx && cx.season === c.season && cx.round === c.round ? cx.fought : null;
  const fought = [fx, X.fought].find((id) => typeof id === 'string' && id !== pid && c.drivers?.[id]) || contacts[0] || null;
  const mate = safe('teammate', () => c.teammate?.(), null), mateId = mate?.id || null;
  const matePos = mateRow ? (mateRow.car?.retired ? 0 : num(mateRow.pos, null)) : null;
  const winner = rows.find((r) => r?.pos === 1)?.car?.careerId || null;
  // (the other two on the podium, for the club's list: the night's faces)
  const podium3 = rows.filter((r) => r && (r.pos === 2 || r.pos === 3) && !r.car?.retired).map((r) => r.car?.careerId).filter((id) => id && id !== pid && c.drivers?.[id]);
  // (the first eight home by surname, for the team's replay screen; Zhou Guanyu's family name comes first)
  const sur = (n) => { const w = String(n || '').trim().split(/\s+/); return w[0] === 'Zhou' ? 'Zhou' : w[w.length - 1] || ''; };
  const top = rows.filter((r) => r && r.pos != null).sort((a, b) => a.pos - b.pos).slice(0, 8).map((r) => sur(c.drivers?.[r.car?.careerId]?.name || r.car?.name || r.name || ''));
  const stars =arr(safe('celebsAtRace', () => celebsAtRace(c, tid), [])).filter((id) => CELEB[id]), partner = safe('partnerAtRace', () => partnerAtRace(c), null);
  if (partner && CELEB[partner] && !stars.includes(partner)) stars.unshift(partner);
  const B = obj(c.celebs?.bonds), exes = stars.filter((id) => B[id]?.stage === 'ex');
  const S = { season: c.season, round: c.round, track: tid, city: CITY[tid] || TRACK[tid] || '', gp: GP[tid] || `${TRACK[tid] || ''} Grand Prix`, date: `${c.season}-${RACE_DATE[tid] || '07-01'}`,
    pos, won: mine && fin && pos === 1, podium: mine && fin && pos != null && pos <= 3, dnf: !!meRow && !!meRow.car?.retired, grave: !!o.grave, hurt, standIn: !mine, live: !!o.live && mine,
    fought, contacts, mate: mateId, matePos, mateAhead: matePos != null && matePos > 0 && (!fin || (pos != null && matePos < pos)), winner, podium3, top, stars,partner: partner && CELEB[partner] ? partner : null, exes };
  if (mateId && mine) P.mates[mateId] = { season: c.season, round: c.round };
  P.race = S; P.offers = []; P.cur = null; P.last = null;
  return S;
}

// ---- 2. the offers ------------------------------------------------------------------------------------------------------------
/** a grave week right now (the race just run, or the paddock lost someone in the last two weeks) */
const graveNow = (c) => { const x = c?.pr?.ctx; return (!!x?.grave && ago(c, x) <= 1) || arr(c?.lost).some((l) => l && ago(c, l) <= 1); };
/** a party is on at all after this race: your own driver raced it, nobody was hurt or killed, no memorial week, you are well */
const allowed = (c, S) => !!S && S.live && !S.grave && !S.hurt && !S.standIn && live(meOf(c)) && !hurtNow(c, meOf(c)) && !graveNow(c) && ago(c, S) === 1;
/** that brand will not court you now (a snub from a party) */
const snubbed = (c, bid) => num(ensure(c).snub[bid], -1) > ridx(c, c.season, c.round);
/** tonight's takeover, if any: a brand you hold a deal with (60%), else one courting you that you suit (35%) -> { id, contractual } | null */
const hostOf = (c, S) => {
  const Pr = c.pr; if (!Pr) return null;
  const R = crng(c, `${S.season}|${S.round}|host`), held = arr(Pr.deals).map((d) => d.bid).filter((b) => HOSTS.includes(b));
  if (held.length && R() < 0.6) return { id: pickR(held, R), contractual: true };
  const fi = fameIndex(Pr.fame), court = HOSTS.filter((b) => { const B = BRAND_BY_ID[b]; return B && !held.includes(b) && !snubbed(c, b) && (arr(Pr.offers).some((o) => o.bid === b) || (num(Pr.image, 0) >= B.minImage && fi >= B.minFi)); });
  if (court.length && R() < 0.35) return { id: pickR(court, R), contractual: false };
  return null;
};
const TEAM_HOOK = {
  win: ['Champagne over the engineers, the team photo with the trophy, and the mechanics in after the pack-down.', 'The trophy is on the table. The mechanics join after the pack-down.'],
  podium: ['The trophy is on the table. The mechanics join after the pack-down.', 'A podium to toast. The mechanics come in when the freight is packed.'],
  dnf: ['Drinks to forget. The boss says a few words.', 'Not the day anyone wanted. Food, a drink, and the boss says a few words.'],
  any: ['Food, the race on the big screen, and the whole team.', 'Long tables, the race replaying on the screen, partners and guests.'],
};
/** the people on a card (6 at most) and how many more */
/**
 * The club comps your table (clubs pay for famous faces): a sponsor's night, a famous enough name, tonight's winner
 * always, a podium finisher most nights (seeded: the same answer on the card and at the door)
 */
const compedFor = (c, S, B, fi) => !!B || fi >= 60 || !!S.won || (!!S.podium && crng(c, `${S.season}|${S.round}|comp`)() < 0.7);
const peopleOf = (G) => { const L = [...G.principals, ...G.present]; return { people: L.slice(0, 6).map((g) => ({ cid: g.cid, kind: g.kind, name: g.name, role: g.role, color: g.color })), more: Math.max(0, L.length - 6) }; };
const makeOffer = (c, S, venue, host) => {
  const T = timesOf(venue, S.track), PL = PLACE[venue], team = c.team, me = meOf(c), fi = fameIndex(c.pr?.fame), club = venue !== 'teamparty', london = venue === 'londonclub';
  const B = host ? BRAND_BY_ID[host.id] : null, legal = LEGAL[S.track] || 18, ok = club ? ageOk(c, me, S.track, S.season) : true;
  const O = { id: `${S.season}|${S.round}|${venue}`, season: c.season, round: c.round, venue, host: club ? 'club' : 'team', brand: B ? B.id : null, brandName: B ? B.brand : null,
    color: B ? BRAND_COL[B.id] || '#c9a24a' : club ? (london ? '#7a1f2b' : venue === 'poolclub' ? '#19c3d6' : '#7b5cff') : team?.color || '#e10600', contractual: !!host?.contractual,
    title: '', hostLine: '', place: club ? PL.place : `${c.myTeam} hospitality`, city: club ? CITY[S.track] : TRACK[S.track], start: T.start, close: T.close, lastCall: T.lastCall ?? null,
    dress: venue === 'poolclub' ? 'Poolside' : club ? 'Club' : 'Team kit', age: club ? legal : 0, ok, why: ok ? '' : `${legal}+ in ${S.track === 'lasvegas' ? 'Nevada' : 'the UK'}`, hook: '',
    risk: club ? (london ? 1 : 3) : 1, spend: club ? (compedFor(c, S, B, fi) ? 1 : london ? 2 : 3) : 0, energy: club ? 3 : 1, cost: 0, comped: club && compedFor(c, S, B, fi), people: [], more: 0,
    travel: london ? { car: '1 h 45', heli: { min: 25, cost: MONEY.heli } } : null, status: 'open' };
  if (!club) {
    O.title = S.won || S.podium ? `${c.myTeam} celebration` : S.dnf ? `${c.myTeam}: drinks after the race` : `${c.myTeam}: the team's night`;
    O.hostLine = `${c.myTeam} hospitality · the paddock · after the debrief`;
    O.hook = pickR(S.won ? TEAM_HOOK.win : S.podium ? TEAM_HOOK.podium : S.dnf ? TEAM_HOOK.dnf : TEAM_HOOK.any, crng(c, `${O.id}|hook`));
  } else {
    O.title = B ? `${B.brand} presents: the ${GPS[S.track]} after-party` : `The ${GPS[S.track]} after-party`;
    O.hostLine = `${PL.name} · ${PL.where}${O.contractual ? ' · contractual appearance' : ''}`;
    const m = (london ? 0.6 : 1), comped = O.comped;
    O.cost = r4((comped ? 0 : MONEY.table * m) + MONEY.bottle * m);
  }
  const G = guestsFor(c, S, O); Object.assign(O, peopleOf(G));
  if (club) {
    const dj = G.staff.find((g) => g.role === 'dj'), st = G.principals.filter((g) => g.kind === 'celeb' && g.role !== 'partner').slice(0, 2).map((g) => g.name), rep = G.principals.find((g) => g.role === 'rep');
    // (the networking reason to go first - the hook is cut at two lines on a small screen - then the stars, then the DJ)
    const bits = [rep ? `${B && rep.brand === B.id ? B.brand : BRAND_BY_ID[rep.brand]?.brand || 'A sponsor'}'s ${String(REPS[rep.brand]?.title || 'marketing head').toLowerCase()} wants five minutes` : '', st.length ? `${list(st)} on the list` : '', dj ? `${dj.name} on the decks` : ''].filter(Boolean);
    O.hook = london ? `Phones taped at the door: no photos inside.${bits.length ? ` ${bits[0]}.` : ''}` : `${bits.join('; ')}.`.replace(/^\.$/, venue === 'poolclub' ? 'A night swim on the Strip: the pool stays open till half four.' : 'No last call on the Strip: the lights go up at five.');
  }
  return O;
};

// ---- 3. who is there: the guest list, ranked, with roles (seeded: the same night every time it is asked) ---------------------
const posTxt = (p) => (p == null ? '' : p === 0 ? 'out of the race' : `P${p}`);
const driverG = (c, S, did, role, o = {}) => {
  const d = c.drivers[did], t = c.teams?.[d.team], real = isReal(d), f = safe('friendOf', () => friendOf(c, did), null);
  const why = o.why || (role === 'mate' ? `Your team-mate · ${posTxt(S.matePos) || d.team}` : role === 'rival' ? `${d.team || 'Free agent'} · ${S.fought === did ? 'you clashed today' : 'you touched wheels today'}`
    : role === 'exmate' ? `${d.team || 'Free agent'} · your old team-mate` : role === 'friend' ? `${d.team || 'Free agent'} · ${stageName(f?.stage)}` : role === 'winner' ? `${d.team} · won today` : d.team || 'Free agent');
  return { kind: 'driver', id: did, cid: `d:${did}`, name: d.name, first: first(d.name), team: d.team || null, color: t?.color || '#6b7480', color2: t?.color2 || '#ffffff', role: role === 'winner' ? 'present' : role,
    tier: o.tier || 'principal', talk: o.talk ?? 3, age: ageOf(c, d, S.track, S.season), soft: !ageOk(c, d, S.track, S.season), real, fictional: !real, look: null, why, stage: f?.stage || null, brand: null, clients: null };
};
const celebG = (c, S, id, role, o = {}) => {
  const C = CELEB[id], b = c.celebs?.bonds?.[id], st = b?.stage || 'stranger';
  return { kind: 'celeb', id, cid: `c:${id}`, name: C.name, first: first(C.name), team: null, color: C.look?.outfit || '#8a6a9a', color2: C.look?.accent || '#d4af6a', role, tier: o.tier || 'principal', talk: o.talk ?? 3,
    age: C.age, soft: false, real: false, fictional: true, look: null, why: o.why || `${C.job} · ${role === 'dj' ? 'on the decks tonight' : st === 'stranger' ? 'not met yet' : stageLabel(st)}`, stage: st, brand: null, clients: null };
};
const personG = (cid, name, role, look, why, o = {}) => ({ kind: 'person', id: cid.split(':').pop(), cid, name, first: first(name), team: o.team || null, color: look?.color || '#20252e', color2: look?.accent || '#f1f0ec',
  role, tier: o.tier || 'principal', talk: o.talk ?? 3, age: o.age ?? 30, soft: false, real: false, fictional: true, look, why, stage: null, brand: o.brand || null, clients: o.clients || null });
const repG = (c, S, bid, club, why = '') => {
  const R0 = REPS[bid], B = BRAND_BY_ID[bid]; if (!R0 || !B) return null;
  const held = arr(c.pr?.deals).some((d) => d.bid === bid), wild = B.heatMax >= 80, seed = `rep|${bid}`;
  const look = club && wild ? clubLook(seed, R0.fem) : smartLook(seed, R0.fem);
  return personG(`p:rep:${bid}`, R0.name, 'rep', look, why || `${B.brand} · ${R0.title} · ${held ? 'one of your sponsors' : 'could offer a deal'}`, { brand: bid });
};
/** the agent worth meeting tonight: one whose drivers you might sign (a free agent, a contract running out, a good one) */
const agentG = (c, S, R) => {
  const pid = c.playerId, ds = Object.values(obj(c.drivers)).filter((d) => live(d) && d.id !== pid);
  const score = (d) => (d.team ? 0 : 0.3) + (d.contract && d.contract.until <= c.season ? 0.2 : 0) + num(d.rating, 0.8);
  const by = {}; for (const d of ds) { const a = agentFor(d.id).id; (by[a] = by[a] || []).push(d); }
  const ranked = AGENTS.filter((a) => by[a.id]?.length).map((a) => ({ a, v: Math.max(...by[a.id].map(score)) + R() * 0.2 })).sort((x, y) => y.v - x.v);
  const A = ranked[0]?.a; if (!A) return null;
  const clients = by[A.id].sort((x, y) => score(y) - score(x)).map((d) => d.id), top = c.drivers[clients[0]];
  return personG(`p:agent:${A.id}`, A.name, 'agent', smartLook(`agent|${A.id}`, A.fem, { style: A.look.style }), `Driver manager · looks after ${last(top?.name)}${clients.length > 1 ? ` and ${clients.length - 1} more` : ''}`, { clients });
};
/**
 * The night's guest list -> { principals (8 at most, ranked), present (2 at most), staff, reserved, drama }. The club:
 * your partner, your team-mate, the host brand's rep, the stars (those at the race topped up to four by those often
 * here), the driver you clashed with, an agent, a friend, the Post's diary columnist, an influencer filming, more stars,
 * another sponsor's rep, another friend, an old team-mate - networking ranks a little above the gossip, and nobody under
 * the city's legal age is on a club list. The team party: your partner, your team-mate (soft drinks if under age), the
 * team principal, your race engineer, a star or two who know you, your sponsor's rep; the team's reserve driver is there too.
 */
function guestsFor(c, S, O) {
  const R = crng(c, `${S.season}|${S.round}|${O.venue}|guests`), club = O.host === 'club', tid = S.track, pid = c.playerId, B = obj(c.celebs?.bonds), team = c.myTeam, T = c.team;
  const cand = [], present = [], staff = [], reserved = [], used = new Set([`d:${pid}`]);
  const okD = (did, adult = club) => { const d = c.drivers?.[did]; return !!d && live(d) && did !== pid && !hurtNow(c, d) && (!adult || ageOk(c, d, tid, S.season)); };
  const okC = (id) => !!CELEB[id] && !B[id]?.grieving;
  const put = (p, g) => { if (g && !used.has(g.cid)) { used.add(g.cid); cand.push({ p, g }); } };
  // (the DJ in Las Vegas: Jade Okafor plays the race-weekend after-party when she is in town)
  const jade = O.venue === 'vegasclub' && okC('jade-okafor') && (S.stars.includes('jade-okafor') || R() < 0.7);
  if (jade) used.add('c:jade-okafor');
  if (S.partner && okC(S.partner)) put(100, celebG(c, S, S.partner, 'partner'));
  if (S.mate && okD(S.mate, club)) put(95, driverG(c, S, S.mate, 'mate'));
  // (the stars: those at the race, then - at a club - topped up to four by those often at this circuit)
  const stars = S.stars.filter((id) => okC(id) && id !== S.partner && !used.has(`c:${id}`));
  if (club) for (const C of [...CELEBS].sort(() => R() - 0.5)) { if (stars.length + (S.partner ? 1 : 0) >= 4) break; if (C.often.includes(tid) && okC(C.id) && !stars.includes(C.id) && C.id !== S.partner && !used.has(`c:${C.id}`)) stars.push(C.id); }
  if (club) {
    if (O.brand) put(90, repG(c, S, O.brand, true));
    stars.forEach((id, i) => put([85, 72, 55, 40][i] ?? 30, celebG(c, S, id, S.exes.includes(id) ? 'ex' : 'celeb')));
    const rv = [S.fought, ...S.contacts].find((did) => did && did !== S.mate && okD(did));
    if (rv) put(80, driverG(c, S, rv, 'rival'));
    put(75, agentG(c, S, R));
    const fr = Object.entries(obj(c.social?.friends)).filter(([did, f]) => num(f?.level, 0) >= 15 && okD(did) && !used.has(`d:${did}`)).sort((a, b) => num(b[1].level, 0) - num(a[1].level, 0));
    if (fr[0]) put(70, driverG(c, S, fr[0][0], 'friend'));
    // (a gossip writer some nights, not every night - likelier on the Strip and at a sponsor's party; one of a few, in turn)
    if (R() < (O.venue === 'vegasclub' ? 0.5 : 0.35) + (O.brand ? 0.2 : 0)) { const W0 = pickR(PRESS_POOL, R); put(65, personG(`p:press:${W0.id}`, W0.name, 'press', smartLook(`press|${W0.id}`, W0.fem), `${W0.title} · hears everything`)); }
    const inf = pickR(INFLS, R); put(60, personG(`p:infl:${inf.id}`, inf.name, 'infl', clubLook(`infl|${inf.id}`, inf.fem, { pose: 'selfie' }), `${inf.title} · filming for 2M followers`));
    if (!O.brand) { const held = arr(c.pr?.deals).map((d) => d.bid).filter((b) => REPS[b]), courting = arr(c.pr?.offers).map((o) => o.bid).filter((b) => REPS[b]); const b = held[0] || courting[0] || (R() < 0.5 ? pickR(HOSTS, R) : null); if (b && !snubbed(c, b)) put(54, repG(c, S, b, true)); }
    if (fr[1]) put(50, driverG(c, S, fr[1][0], 'friend'));
    const ex = Object.keys(ensure(c).mates).find((did) => did !== S.mate && okD(did) && !used.has(`d:${did}`));
    if (ex) put(45, driverG(c, S, ex, 'exmate'));
  } else {
    put(90, personG('x:boss', 'Team principal', 'boss', lookOf(`boss|${team}`, false, 'polo', T?.color || '#1c1f26', T?.color2 || '#ffffff', { teamName: team, hair: '#8f8f8f', style: { hs: 'side', fh: 'stubble' } }), `${team} · says a few words tonight`, { team }));
    put(85, personG('x:eng', 'Race engineer', 'eng', lookOf(`eng|${team}|${pid}`, false, 'polo', T?.color || '#1c1f26', T?.color2 || '#ffffff', { teamName: team }), `${team} · your voice on the radio`, { team }));
    stars.filter((id) => B[id] && B[id].stage !== 'stranger').slice(0, 2).forEach((id, i) => put(80 - i * 5, celebG(c, S, id, S.exes.includes(id) ? 'ex' : 'celeb')));
    const deal = arr(c.pr?.deals)[0]; if (deal && REPS[deal.bid]) put(70, repG(c, S, deal.bid, false, `${deal.brand} · ${REPS[deal.bid].title} · one of your sponsors`));
  }
  cand.sort((a, b) => b.p - a.p);
  const principals = cand.slice(0, CAP).map((x) => x.g);
  for (const x of cand.slice(CAP)) used.delete(x.g.cid);
  // (a word with: at a club, half the grid is out - today's winner and the podium, friends, other drivers, a reserve or
  //  an F2 junior old enough to be in; at the team party, the team's reserve driver)
  if (club) {
    const all = Object.values(obj(c.drivers)), f1 = all.filter((d) => d.team && d.from === 'F1').map((d) => d.id).sort(() => R() - 0.5), young = all.filter((d) => ['Reserve', 'F2'].includes(d.from)).map((d) => d.id).sort(() => R() - 0.5);
    const pool = [S.winner, ...arr(S.podium3), ...Object.keys(obj(c.social?.friends)), ...f1.slice(0, 2), ...young.slice(0, 2), ...f1.slice(2)];
    for (const did of pool) {
      if (present.length >= PRESENT_CLUB) break;
      // (one junior at most, and only once there is somebody else's word to be had)
      if (did && young.includes(did) && (present.length < 2 || present.some((g) => young.includes(g.id)))) continue;
      if (did && okD(did) && !used.has(`d:${did}`)) { used.add(`d:${did}`); const d = c.drivers[did]; present.push(driverG(c, S, did, did === S.winner ? 'winner' : 'present', { tier: 'present', talk: 1, why: did === S.winner ? null : arr(S.podium3).includes(did) ? `${d.team} · on the podium today` : ['Reserve', 'F2'].includes(d.from) ? `${d.team || d.reserveOf || 'F2'} · ${d.from === 'F2' ? 'F2, a name to watch' : 'reserve driver'}` : null })); }
    }
  } else {
    const rs = Object.values(obj(c.drivers)).find((d) => d.reserveOf === team && okD(d.id, false) && !d.team);
    if (rs && !used.has(`d:${rs.id}`)) { used.add(`d:${rs.id}`); present.push(driverG(c, S, rs.id, 'present', { tier: 'present', talk: 1, why: `${team} · reserve driver` })); }
  }
  // (the staff: the DJ, the bartender, security at a club)
  if (club) {
    if (jade) staff.push(celebG(c, S, 'jade-okafor', 'dj', { tier: 'staff', talk: 3 }));
    else { const D = RESIDENT[O.venue]; staff.push(personG(`p:dj:${D.id}`, D.name, 'dj', clubLook(`dj|${D.id}`, D.fem), `${D.title} · takes requests, sometimes`, { tier: 'staff', talk: 1 })); }
    const fb = R() < 0.5;
    staff.push(personG('p:bartender:bar', 'Bartender', 'bartender', lookOf(`bar|${O.venue}|${S.round}`, fb, fb ? 'corsettop' : 'silkshirt', '#111114', '#111114'), 'Behind the bar', { tier: 'staff', talk: 0 }));
    staff.push(personG('p:security:door', 'Security', 'security', lookOf(`sec|${O.venue}`, false, 'jacket', '#111114', '#111114', { style: { hs: 'buzz', fh: 'beard' } }), 'Security · keeps the peace', { tier: 'staff', talk: 0 }));
  } else staff.push(personG('p:bartender:bar', 'Bar staff', 'bartender', lookOf(`bar|team|${team}`, R() < 0.5, 'polo', '#111114', T?.color || '#111114', { teamName: team }), 'Hospitality staff', { tier: 'staff', talk: 0 }));
  const drama = planDrama(c, S, O, principals, R, reserved);
  return { principals, present, staff, reserved, drama };
}

// ---- the drama director's plan: two incidents at most, one invented antagonist at most (built behind the cover) --------------
function planDrama(c, S, O, principals, R, reserved) {
  const club = O.host === 'club', start = timesOf(O.venue, S.track).start, real = (g) => !!g && g.kind === 'driver' && g.real;
  const by = (role) => principals.find((g) => g.role === role), out = [];
  const add = (d) => { if (out.length < 2 && !(d.antagonist && reserved.length)) { if (d.antagonist) { reserved.push(d.antagonist); d.cid = d.antagonist.cid; } delete d.antagonist; out.push(d); } };
  const man = (key, why) => { const nm = MEN[hash(`${c?.party?.salt || ''}|${S.season}|${S.round}|${key}`) % MEN.length]; return personG(`p:antagonist:${nm.toLowerCase().replace(/[^a-z]/g, '-')}`, nm, 'antagonist', clubLook(`man|${nm}`, false), why, { tier: 'reserved', talk: 0 }); };
  const rival = by('rival'), mate = by('mate'), ex = by('ex'), partner = by('partner'), press = by('press'), P = ensure(c);
  if (rival && R() < 0.65) add({ id: 'needle', cid: rival.cid, after: start + 0.6, chance: 0.6, brawl: !real(rival) && club, real: real(rival) });
  if (mate && (P.feud[mate.id] || num(c.rapport?.[mate.id], 0) <= -25 || S.contacts.includes(mate.id)) && R() < 0.75) add({ id: 'feud', cid: mate.cid, after: start + 0.5, chance: 0.7, brawl: false, real: real(mate) });
  if (ex && club && R() < 0.6) add({ id: 'exnew', with: ex.cid, after: start + 1, chance: 0.7, brawl: true, real: false, antagonist: man(`exnew|${ex.id}`, `Came in with ${ex.first}`) });
  if (partner && club && R() < 0.2) add({ id: 'dateex', with: partner.cid, after: start + 1.2, chance: 0.6, brawl: true, real: false, antagonist: man(`dateex|${partner.id}`, `${partner.first}'s ex · the tabloids love him`) });
  if (club && R() < 0.3) add({ id: 'spill', after: start + 1.5, chance: 0.5, brawl: true, real: false, antagonist: personG(`p:antagonist:${STRANGER.spill.id}`, STRANGER.spill.name, 'antagonist', clubLook(`stranger|${S.round}`, false), 'Had a few. Wants your attention.', { tier: 'reserved', talk: 0 }) });
  // (the columnist overhearing you is not planned: it only happens once you have said something loose near the press -
  //  ui/PartyPlay.js adds it then, outside the two planned incidents - so a slot here goes to the paps, a fan or a spill)
  void press;
  if (club && (O.venue === 'vegasclub' || O.venue === 'poolclub') && (num(c.pr?.heat, 0) >= 35 || fameIndex(c.pr?.fame) >= 55) && R() < 0.6) add({ id: 'paps', cid: c.pr?.manager ? 'x:pr' : null, after: timesOf(O.venue, S.track).late - 0.5, chance: 0.8, brawl: false, real: false });
  if (club && R() < 0.2) add({ id: 'fan', after: start + 2, chance: 0.5, brawl: false, real: false, antagonist: personG(`p:antagonist:${STRANGER.fan.id}`, STRANGER.fan.name, 'antagonist', clubLook(`fan|${S.round}`, false), 'A fan who will not take no for an answer', { tier: 'reserved', talk: 0 }) });
  return out;
}

/**
 * After the round turns over (Career.applyRace, right after inboxTick): tonight's invitations (at most two: the team's
 * celebration, and the club in the race's city - a sponsor's takeover now and then), their texts on your phone and a line
 * for the report. Never after a grave race, when you were hurt, or when someone else drove your car. -> { lines }
 */
export function partyTick(c) {
  const lines = [], P = ensure(c); if (!P) return { lines };
  const S = P.race; P.offers = [];
  if (!allowed(c, S)) return { lines };
  const host = hostOf(c, S), team = makeOffer(c, S, 'teamparty', null), V = clubOf(S.track, S.season, S.round), club = V ? makeOffer(c, S, V, host) : null;
  P.offers = [team, club].filter(Boolean);
  // (the invitations, on your phone)
  const T = { team: c.myTeam, t: hhmm(team.start) };
  safe('invite text', () => pushText(c, 'x:boss', fill(S.won ? 'Hospitality from {t}, after the debrief. Bring the trophy.' : S.podium ? 'Hospitality from {t}, after the debrief. The mechanics will be in once the freight is packed.' : S.dnf ? 'Drinks in hospitality from {t}. Not the day we wanted, but we stick together.' : 'Hospitality from {t}, after the debrief. Food, a drink, the whole team.', T), { kind: 'invite' }));
  if (club) {
    const C = { place: PLACE[club.venue].name, t: hhmm(club.start) }, rep = club.brand && REPS[club.brand];
    if (rep) safe('invite text', () => pushText(c, `p:rep:${club.brand}`, fill(club.contractual ? 'Tonight at {place}, from {t}. Our party, your appearance. The table is ready.' : 'We would love you at our after-party tonight at {place}, from {t}. Table is on us.', C), { name: rep.name, sub: `${club.brandName} · ${rep.title}`, kind: 'invite' }));
    else if (c.pr?.manager && club.ok) safe('invite text', () => pushText(c, 'x:pr', fill('{place} want you tonight, from {t}. The photographers will be out front. Your call.', C), { kind: 'invite' }));
    else {
      const fr = Object.entries(obj(c.social?.friends)).filter(([did, f]) => num(f?.level, 0) >= 35 && live(c.drivers?.[did]) && ageOk(c, did, S.track, S.season)).sort((a, b) => b[1].level - a[1].level)[0];
      if (fr && club.ok) safe('invite text', () => pushText(c, `d:${fr[0]}`, fill(pick(['Club later? {place}. Half the grid is going.', '{place} tonight. You in?', 'Heading to {place} after. Come.']), C), { kind: 'invite' }));
    }
  }
  const names = P.offers.map((o) => (o.venue === 'teamparty' ? `the team's celebration from ${hhmm(o.start)}` : `${o.brandName ? `${o.brandName}'s party at ` : ''}${PLACE[o.venue].name} from ${hhmm(o.start)}${o.ok ? '' : ` (${o.why})`}`));
  lines.push(`Tonight: ${list(names)}. Your call after the report.`);
  return { lines };
}
/** tonight's open invitations (lazy expiry: none once the week has begun - a slot used - or the round has moved on) -> [Offer] */
export function partyOffers(c) {
  const P = ensure(c); if (!P) return [];
  const S = P.race; if (!allowed(c, S)) return [];
  const w = c.week; if (w && w.season === c.season && w.round === c.round && arr(w.used).some((u) => u && u.key !== 'recovery')) return [];
  return P.offers.filter((o) => o.status === 'open' && o.season === c.season && o.round === c.round);
}

// ---- 4. the launch ------------------------------------------------------------------------------------------------------------
/** the night to play (see the contract above) -> Launch | null (not on, or not for you) */
export function partyLaunch(c, offerId, act = 1, carry = null, o = {}) {
  const P = ensure(c); if (!P) return null;
  const S = P.race; if (!allowed(c, S)) return null;
  const O = P.offers.find((x) => x.id === offerId); if (!O || !O.ok || O.season !== c.season || O.round !== c.round) return null;
  if (O.status !== 'open' && !(O.status === 'went' && P.cur?.id === O.id)) return null;
  const G = guestsFor(c, S, O), me = meOf(c), T = timesOf(O.venue, S.track), B = O.brand ? BRAND_BY_ID[O.brand] : null, fi = fameIndex(c.pr?.fame);
  const travel = O.venue === 'londonclub' ? (o.travel === 'heli' ? 'heli' : 'car') : null, k = act === 2 && carry ? carry : null;
  // (on from the team party: the club's door after the drive - a short ride on the Strip; from Silverstone, the road or the helicopter to Battersea)
  const hop = O.venue === 'londonclub' ? (travel === 'heli' ? 0.75 : 1.75) : 0.3, start = k ? Math.max(T.start, num(k.leftAt, T.start) + hop) : T.start;
  const guests = [...G.principals, ...G.present, ...G.staff, ...G.reserved];
  O.status = 'went';
  P.cur = { id: O.id, venue: O.venue, act: act === 2 ? 2 : 1, brand: O.brand, contractual: O.contractual, travel, start, at: { season: c.season, round: c.round },
    guests: guests.map((g) => ({ cid: g.cid, kind: g.kind, id: g.id, name: g.name, role: g.role, tier: g.tier, real: g.real, brand: g.brand, clients: g.clients })), drama: G.drama.map((d) => ({ ...d })) };
  return { key: 'party', partyId: O.id, venue: O.venue, host: O.host, brand: O.brand, brandName: O.brandName, hostColor: O.color, contractual: O.contractual, track: S.track, city: O.city, gp: S.gp,
    // (by night - but the team's party at Silverstone, 19:30-22:00 in early July, is in daylight: sunset is about 21:30)
    night: !(O.venue === 'teamparty' && S.track === 'silverstone'), start, close: T.close, lastCall: T.lastCall ?? null, late: T.late, act: act === 2 ? 2 : 1, carry: k, travel, place: O.place, title: O.title,
    me: { name: me?.name || 'You', age: ageOf(c, me, S.track, S.season), soft: !ageOk(c, me, S.track, S.season), fame: fi, comped: O.host === 'club' && compedFor(c, S, B, fi), real: isReal(me) },
    race: { ...S }, guests, drama: G.drama };
}

// ---- 5. what the night came to ------------------------------------------------------------------------------------------------
const EXIT_TXT = {
  hotel: 'Back at the hotel by {t}.', teamcar: 'The team car back to the hotel at {t}.', side: 'Out of the side door at {t}, past the photographers.', front: 'Out of the front door at {t}, into the flashes.',
  breakfast: { lasvegas: 'Breakfast at four with friends, then the hotel.', silverstone: 'A chicken shop at three with friends, then a taxi.', montreal: 'Poutine at three on Saint-Laurent with friends, then a taxi.' }, carried: 'Put in a car at {t} by {who}.',
  ejected: 'Shown the door by security at {t}.', together: 'Shared a car with {her} to her hotel. A goodnight at the door.',
};
/** the stories of the night, in the press desk's order of what sells (two at most) */
const ORDER = ['scuffle', 'stumble', 'kiss', 'together', 'row', 'quote', 'loose', 'celebrate', 'shoey', 'glam', 'jade', 'sponsor', 'late', 'quiet', 'dance'];
const TEXTS = {
  bossBad: 'Saw the pictures. My office, Tuesday.', bossGood: 'Great night. Earned.', bossBrawl: 'I have seen the footage. Call me. Now.', bossWarn: 'Three big nights in four races. Enough. Rest this week.',
  bossLeak: "What's said in the garage stays in the garage.", pr: "I've spoken to the Post. Say nothing.", eng: 'Debrief call at 10. Hydrate.', engLeak: 'Heard what you said about the car last night. We need to talk.',
  trainer: 'Ice bath, 9 am. No excuses.', repWarm: 'Lovely to see you last night. The team loved having you there.', repMeet: "Lovely to meet you. We'll be in touch.", repCool: 'Thank you for your time last night.',
  repLegal: 'Our legal team has seen the photographs.', ex: "It's 3am. Go to sleep.", missed: 'Missed you tonight.',
  friend: ['Good night. Same again next time.', 'Proper night. Head okay?', 'That was a good one.'], her: ['Home safe. Tonight was fun.', 'Thank you for tonight. Call me later?'], herKiss: ['So. Last night. Call me later?', 'I keep thinking about last night.'],
};
/** the morale of the week (inside THE WEEK's caps: Agenda.weekGain) and a loss (never capped) */
const gain = (c, v, why, stat = null) => (v > 0 ? safe('weekGain', () => weekGain(c, v, why, stat), 0) : safe('shiftMorale', () => shiftMorale(c, c.playerId, v, why, stat), 0));
/**
 * The night settled (r: the Hangout result with r.party - see the contract): friendships and rapport per guest, the
 * stars (a date only with real time together; jealousy only from those in the room and in sight), sponsors and agents
 * met, the money, the hangover into the fresh week, at most two stories with the race's city, crises, the texts the
 * morning after, c.party.last for the morning-after modal. -> { ok, lines, last }
 */
export function partyResult(c, r) {
  const lines = [], P = ensure(c); if (!P || !r || typeof r !== 'object') return { ok: false, lines, last: null };
  const S = P.race, L = obj(r.party), cur = P.cur || {};
  if (L.exit === 'moveon') return { ok: false, pending: true, lines, last: null };
  if (!allowed(c, S)) { P.cur = null; return { ok: false, lines, last: null }; }
  const venue = L.venue || cur.venue || r.venue || 'teamparty', club = venue !== 'teamparty', london = venue === 'londonclub', vegas = venue === 'vegasclub' || venue === 'poolclub', PL = PLACE[venue] || PLACE.teamparty;
  const brand = L.brand ?? cur.brand ?? null, Bd = brand ? BRAND_BY_ID[brand] : null, me = meOf(c), realMe = isReal(me), score = clamp(num(r.score, 0.5), 0, 1);
  const roles = Object.fromEntries(arr(cur.guests).map((g) => [g.cid, g])), place = club ? PL.place : `${c.myTeam} hospitality`;
  const T = timesOf(venue, S.track), leftAt = num(L.leftAt, T.start + 2), peak = num(L.peak, 0), exit = String(L.exit || 'hotel');
  const seenDrunk = new Set(arr(L.seenDrunkBy)), danced = arr(L.danced), loose = arr(L.loose), drama = arr(L.drama), br = L.brawl && typeof L.brawl === 'object' ? L.brawl : null;
  const people = {}, texts = [], timeline = [], heads = [];
  const delta = (cid, name, role, k, v, text = '') => { if (!v && !text) return; const p = people[cid] || (people[cid] = { cid, name, role, delta: [] }); p.delta.push({ k, v: Math.round(num(v, 0) * 10) / 10, text }); };
  const say = (cid, text, o = {}) => { if (!text) return; safe('pushText', () => pushText(c, cid, text, o)); texts.push({ cid, name: o.name || nameOfCid(c, cid), text }); };
  // (who you spent time with: the scene's per-guest record, its party contacts over it)
  const C = {};
  for (const [cid, x] of Object.entries(obj(r.per))) C[cid] = { role: roles[cid]?.role || null, score: num(x?.score, 0.5), dm: num(x?.mood, 0), talks: num(x?.talks, 0), fx: obj(x?.fx), gone: !!x?.gone, priv: 0 };
  for (const [cid, x] of Object.entries(obj(L.contacts))) C[cid] = { ...(C[cid] || { role: roles[cid]?.role || null, score: 0.5, dm: 0, talks: 0, fx: {}, priv: 0 }), ...obj(x), fx: { ...obj(C[cid]?.fx), ...obj(x?.fx) } };
  const dancedWith = (cid) => danced.some((d) => d && d.cid === cid);
  const fxn = (cid, k) => num(C[cid]?.fx?.[k], 0);
  const R = Math.random;

  // -- the drivers: friendship by their own evening, rapport at half; a row costs, a cleared air mends
  const mateId = S.mate;
  for (const [cid, x] of Object.entries(C)) {
    if (!cid.startsWith('d:')) continue;
    const did = cid.slice(2), d = c.drivers?.[did]; if (!d || !live(d) || did === c.playerId) continue;
    const talks = num(x.talks, 0), dn = dancedWith(cid), tg = fxn(cid, 'together') > 0;
    if (!talks && !dn && !tg) continue;
    safe('meetDriver', () => meetDriver(c, did));
    const dv = clamp(Math.round(-6 + num(x.score, 0.5) * 20), -8, 16) + (dn || tg ? 2 : 0) - (fxn(cid, 'provoke') ? 3 : 0);
    const got = safe('relateFriend', () => relateFriend(c, did, dv, dv >= 8 ? `A great night with ${d.name} after the ${S.gp}` : dv <= -3 ? `A night with ${d.name} that went wrong` : ''), 0);
    delta(cid, d.name, x.role || roles[cid]?.role || 'driver', 'friendship', got);
    if (got >= 8 && R() < 0.6) say(cid, pick(TEXTS.friend));
  }
  for (const D of drama) {
    const cid = String(D?.cid || ''), did = cid.startsWith('d:') ? cid.slice(2) : null, d = did ? c.drivers?.[did] : null;
    if (d && D.outcome === 'row') { const v = -Math.round(10 + 15 * R()); safe('relate', () => c.relate?.(did, v, null)); delta(cid, d.name, roles[cid]?.role || 'driver', 'rapport', v, 'Words exchanged'); if (D.id === 'feud') P.feud[did] = { season: c.season, round: c.round }; }
    if (d && D.outcome === 'cold') { safe('relate', () => c.relate?.(did, -5, null)); delta(cid, d.name, roles[cid]?.role || 'driver', 'rapport', -5, 'A frosty word'); }
    if (d && D.id === 'feud' && D.outcome === 'calm') { safe('relate', () => c.relate?.(did, 10, null)); delete P.feud[did]; delta(cid, d.name, 'mate', 'rapport', 10, 'Cleared the air'); }
  }
  if (mateId && fxn(`d:${mateId}`, 'clear') && P.feud[mateId]) { safe('relate', () => c.relate?.(mateId, 10, null)); delete P.feud[mateId]; delta(`d:${mateId}`, c.drivers?.[mateId]?.name || 'Your team-mate', 'mate', 'rapport', 10, 'Cleared the air'); }

  // -- the stars: met, how it went, flirts and charm, a dance, a kiss; a date only with real time together
  const kissId = typeof L.kiss === 'string' ? L.kiss.replace(/^c:/, '') : null, togetherId = exit.startsWith('together:') ? exit.slice(9).replace(/^c:/, '') : null;
  const inRoom = new Set([...Object.keys(roles), ...Object.keys(C)].filter((k) => k.startsWith('c:')).map((k) => k.slice(2)).filter((id) => CELEB[id]));
  const seeingNow = arr(safe('seeing', () => seeing(c), [])), inRoomSeeing = seeingNow.filter((id) => inRoom.has(id)), romanced = [];
  for (const [cid, x] of Object.entries(C)) {
    if (!cid.startsWith('c:')) continue;
    const id = cid.slice(2), Ce = CELEB[id]; if (!Ce || c.celebs?.bonds?.[id]?.grieving) continue;
    const talks = num(x.talks, 0), dn = dancedWith(cid), kiss = kissId === id, left = togetherId === id, f = first(Ce.name);
    if (!talks && !dn && !kiss && !left) continue;
    meetAt(c, id, S);
    const fl = Math.min(2, fxn(cid, 'flirt')), b = bondOf(c, id), a0 = num(b.aff, 0);
    for (let i = 0; i < fl; i++) safe('flirt', () => flirt(c, id));
    if (fxn(cid, 'charm')) safe('charm', () => charm(c, id));
    if (dn) { safe('charm', () => charm(c, id)); safe('flirt', () => flirt(c, id)); }
    if (kiss) { safe('flirt', () => flirt(c, id)); safe('flirt', () => flirt(c, id)); if (!L.kissSeen) safe('trust', () => trustCeleb(c, id, 3)); }
    const time = talks >= 2 || dn || left || kiss, seenTogether = (left && !!L.photographed) || (kiss && !!L.kissSeen && !london);
    if (time) { const dr = safe('dateResult', () => dateResult(c, id, num(x.score, 0.5), venue, seenTogether, { flirt: fl > 0 }), null); if (dr?.text && (dr.gain >= 5 || dr.started)) lines.push(dr.text); }
    else safe('relateCeleb', () => relateCeleb(c, id, Math.round(-2 + num(x.score, 0.5) * 8), num(x.score, 0.5) >= 0.6 ? `A good talk with ${f} at the ${S.gp} after-party` : ''));
    delta(cid, Ce.name, x.role || roles[cid]?.role || 'celeb', 'affection', num(bondOf(c, id).aff, 0) - a0);
    // (what others could see: a dance is on the floor; a kiss in private nobody saw - unless the scene names who did)
    if (fl || dn || kiss || fxn(cid, 'together') || left) romanced.push({ id, n: fl + (dn ? 1 : 0) + (kiss && !L.kissPrivate ? 1 : 0), priv: num(x.priv, 0), by: kiss ? arr(L.kissSeenBy).map((k) => String(k).replace(/^c:/, '')) : [] });
    if (left) say(cid, pick(TEXTS.her)); else if (kiss) say(cid, pick(TEXTS.herKiss));
  }
  // (jealousy from those in the room who saw it - never from anyone who was not there)
  for (const w of inRoomSeeing) {
    const seen = romanced.filter((x) => x.id !== w && (x.n > x.priv || x.by.includes(w))); if (!seen.length) continue;
    const Cw = CELEB[w], Tw = Cw.traits, f = first(Cw.name), o = first(CELEB[seen[0].id].name);
    safe('relateCeleb', () => relateCeleb(c, w, -Math.round(4 + 8 * Tw.jealousy), `${f} saw you with ${o} at the party`)); safe('trustCeleb', () => trustCeleb(c, w, -6));
    let t = Tw.jealousy >= 0.4 ? `${f} saw you with ${o} at the party, and she is not amused.` : `${f} saw you with ${o} at the party. She raises an eyebrow.`;
    if (Tw.jealousy >= 0.3) { const u = safe('upsetCeleb', () => upsetCeleb(c, w, `${f} is upset about ${o}.`), null); if (u?.text) t += ` ${u.text}`; }
    lines.push(t); delta(`c:${w}`, Cw.name, roles[`c:${w}`]?.role || 'partner', 'affection', -Math.round(4 + 8 * Tw.jealousy), `Saw you with ${o}`);
    const sec = seen.map((x) => x.id).filter((id) => seeingNow.includes(id));
    if (sec.length) { const e = safe('exposure', () => exposure(c, 'room', sec, 1.2, [w]), null); if (e?.text) lines.push(e.text); }
  }
  if (inRoomSeeing.length >= 2) { const e = safe('exposure', () => exposure(c, 'room', inRoomSeeing, 1.2, inRoomSeeing), null); if (e?.text) lines.push(e.text); }
  // (the 3 am text to an ex: she answers in the morning)
  const exT = typeof L.textedEx === 'string' ? L.textedEx.replace(/^c:/, '') : null;
  if (exT && CELEB[exT]) { say(`c:${exT}`, TEXTS.ex); safe('relateCeleb', () => relateCeleb(c, exT, -1)); timeline.push(`A text to ${first(CELEB[exT].name)} at three in the morning.`); }

  // -- the business: sponsors' reps, agents, the press, the influencer, the team principal
  const Pr = c.pr, heldIds = new Set(arr(Pr?.deals).map((d) => d.bid));
  for (const [cid, x] of Object.entries(C)) {
    const m = /^p:rep:(\w+)$/.exec(cid); if (!m) continue;
    const bid = m[1], B = BRAND_BY_ID[bid], R0 = REPS[bid]; if (!B || !R0 || !num(x.talks, 0)) continue;
    const dm = num(x.dm, 0), held = heldIds.has(bid), drunkSeen = seenDrunk.has(cid) && B.heatMax <= 60, o = { name: R0.name, sub: `${B.brand} · ${R0.title}` };
    P.repMet[bid] = { season: c.season, round: c.round, dm };
    if (dm <= -3 || drunkSeen) {
      P.snub[bid] = ridx(c, c.season, c.round) + 4; if (Pr?.snub && typeof Pr.snub === 'object') Pr.snub[bid] = aheadOf(c, 4);
      say(cid, TEXTS.repCool, o); delta(cid, R0.name, 'rep', 'snub', -1, `${B.brand} cooled on you`);
    } else if (held && dm >= 3) {
      if (Pr) Pr.appeal = clamp(Math.round((num(Pr.appeal, 50) + 3) * 10) / 10, 0, 100);
      say(cid, TEXTS.repWarm, o); delta(cid, R0.name, 'rep', 'appeal', 3, 'Sponsor appeal');
    } else if (!held && dm >= 4 && (peak < 5.5 || B.heatMax >= 85) && !snubbed(c, bid)) {
      const O = safe('offerFrom', () => offerFrom(c, bid, 'met at the party'), null);
      if (O) { say(cid, TEXTS.repMeet, o); delta(cid, R0.name, 'rep', 'offer', 1, `An offer from ${B.brand}`); lines.push(`Sponsor offer from ${B.brand} (met at the party): $${O.value}M a round.`); }
    }
  }
  for (const [cid, x] of Object.entries(C)) {
    const m = /^p:agent:(\w+)$/.exec(cid); if (!m || num(x.dm, 0) < 3) continue;
    const A = AGENTS.find((a) => a.id === m[1]); if (!A) continue;
    P.met[A.id] = { season: c.season, round: c.round }; delete c._nego;   // (the table's terms are worked out afresh: Career.negoProfile)
    const clients = arr(roles[cid]?.clients).filter((did) => live(c.drivers?.[did]) && did !== c.playerId);
    for (const did of clients) safe('relate', () => c.relate?.(did, 4, null));
    const open = clients.map((did) => c.drivers[did]).find((d) => !d.team || (d.contract && d.contract.until <= c.season)) || c.drivers[clients[0]];
    if (open) say(cid, `Good to meet you properly. ${open.name} would take a call from you, by the way.`, { name: A.name, sub: A.title });
    delta(cid, A.name, 'agent', 'agent', 4, `Rapport +4 with ${clients.length} of ${A.fem ? 'her' : 'his'} drivers`);
  }
  const pressCid = Object.keys(C).find((k) => k.startsWith('p:press:')), pressDm = pressCid ? num(C[pressCid].dm, 0) : 0;
  if (pressCid && pressDm >= 3 && Pr?.media) { const W0 = pressOf(pressCid); Pr.media[W0.outlet] = clamp(num(Pr.media[W0.outlet], 0) + 4, -100, 100); delta(pressCid, W0.name, 'press', 'appeal', 4, `${outletOf(W0.outlet)} likes you a little more`); }
  const inflCid = Object.keys(C).find((k) => k.startsWith('p:infl:')), selfies = Math.min(2, inflCid ? Math.max(fxn(inflCid, 'selfie'), num(L.selfies, 0) > 0 && num(C[inflCid].talks, 0) ? 1 : 0) : 0);
  if (selfies && Pr) Pr.fame = r2(num(Pr.fame, 0.4) + Math.max(0.02, num(Pr.fame, 0.4) * 0.01) * selfies);
  if (!club && (S.won || S.podium) && num(C['x:boss']?.talks, 0)) gain(c, 3, 'The team celebrated together');
  if (seenDrunk.has('x:boss') && !realMe) { gain(c, -2, 'The boss saw you the worse for wear', 'composure'); say('x:boss', TEXTS.bossBad); }
  if (L.crewThanked) { gain(c, 1, 'You thanked the crew'); if (mateId) safe('relate', () => c.relate?.(mateId, 2, null)); timeline.push('Down to the garage to thank the mechanics, still packing freight.'); }
  // (a loose line within earshot of the columnist or a phone that was filming)
  const quoted = loose.find((q) => arr(q?.near).some((k) => /^p:(press|infl):/.test(String(k))));
  if (quoted?.leak) { gain(c, -2, 'Talked about the car in public'); say('x:eng', TEXTS.engLeak); say('x:boss', TEXTS.bossLeak); }

  // -- the money: the tab (comps, bottles, a parade, a hand of blackjack), the helicopter
  const spend = r6(num(L.spend, 0) + (cur.travel === 'heli' ? MONEY.heli : 0));
  if (spend) c.wallet = r6(Math.max(0, num(c.wallet, 0) - spend));
  // (a contractual appearance is the week's sponsor day: appeal +3; an open one not taken costs appeal -3)
  const w = weekOf(c);
  if (cur.contractual && Pr) { w.sponsorDone = true; Pr.appeal = clamp(num(Pr.appeal, 50) + 3, 0, 100); lines.push(`${Bd?.brand || 'Your sponsor'}'s party counts as this week's sponsor day: appeal +3.`); }
  for (const O of P.offers) if (O.status === 'open') {
    if (O.contractual && Pr) { Pr.appeal = clamp(num(Pr.appeal, 50) - 3, 0, 100); lines.push(`You skipped ${O.brandName}'s party, a contractual appearance: appeal -3.`); }
    if (O.venue === 'teamparty' && S.podium && mateId && live(c.drivers?.[mateId])) { safe('relate', () => c.relate?.(mateId, -2, null)); say(`d:${mateId}`, TEXTS.missed); }
    O.status = 'skipped';
  }

  // -- the hangover: into the fresh week (energy, a lost morning, a rough sponsor or media day); never the race traits
  const water = Math.min(0.3, 0.05 * Math.max(num(L.water, 0), arr(L.drinks).filter((d) => d?.kind === 'water').length)), second = num(w.counts?.nightout, 0) >= 1;
  const H = clamp(0.08 * (peak - 3) + 0.12 * Math.max(0, leftAt - 25) - water + (second ? 0.2 : 0), 0, 1);
  const hang = safe('setHangover', () => setHangover(c, { H, energy: H > 0.15 ? -Math.round(8 + 30 * H) : 0, slot: H >= 0.6 ? (S.track === 'lasvegas' ? 'iv' : 'recovery') : null, rough: H >= 0.8, why: `After the ${S.gp}` }), { H, energy: 0, slot: null, rough: false, text: '' });
  if (score >= 0.6 && H < 0.4) gain(c, Math.round(2 + 3 * clamp((score - 0.6) / 0.4, 0, 1)), `A good night after the ${S.gp}`);
  if (H >= 0.3) say('x:eng', TEXTS.eng);
  if (H >= 0.45) say('p:trainer', TEXTS.trainer, { name: 'Your trainer', sub: 'Performance coach' });
  // (a pattern: three big nights in four rounds)
  const big = peak >= 5.5 || leftAt >= 26, here = ridx(c, S.season, S.round);
  if (big) { P.streak.push(here); P.streak = P.streak.filter((n) => here - n < 4).slice(-6); }
  if (big && P.streak.length >= 3) {
    gain(c, -3, 'Burning the candle', 'focus'); say('x:boss', TEXTS.bossWarn);
    if (Pr?.persona) Pr.persona.showman = num(Pr.persona.showman, 0) + 1;
    lines.push('Three big nights in four races: focus -3, and the team principal has noticed.');
  }

  // -- the scuffle (invented people only): composure, the star with you, ejected
  if (br && br.result === 'walked') { gain(c, 1, 'Walked away from trouble', 'composure'); timeline.push(`Walked away before it became anything.${club ? ' Security showed him out.' : ''}`); }
  else if (br) {
    gain(c, num(br.composure, -8 + (br.result === 'won' ? 3 : br.result === 'lost' ? -4 : 0)), 'A scuffle at the party', 'composure');
    const her = [S.partner, ...inRoomSeeing].find((id) => id && inRoom.has(id));
    if (her && CELEB[her]) { const Th = CELEB[her].traits, f = first(CELEB[her].name); if (Th.privacy >= 0.6) { safe('relateCeleb', () => relateCeleb(c, her, -4, `${f} hated the scene at the club`)); safe('trustCeleb', () => trustCeleb(c, her, -3)); } else if (Th.drama < 0.45) safe('relateCeleb', () => relateCeleb(c, her, -2, `${f} did not enjoy the scene at the club`)); }
    say('x:boss', TEXTS.bossBrawl);
    if (typeof br.police === 'boolean' ? br.police : br.escalated && br.started && R() < 0.1) { if (Pr) Pr.heat = clamp(num(Pr.heat, 0) + 6, 0, 100); timeline.push('The police took statements. No arrests.'); }
  }

  // -- the press: at most two stories, the race's own city on them
  const subs = [], add = (sub, x = {}) => { if (!subs.some((s) => s.sub === sub)) subs.push({ sub, ...x }); };
  const photographed = !!L.photographed, onCam = br && br.result !== 'walked' ? (typeof br.onCamera === 'boolean' ? br.onCamera : vegas ? true : london ? R() < 0.3 : R() < 0.5) : false;
  if (br && onCam) add('scuffle');
  if (L.stumble && photographed) add(realMe ? 'late' : 'stumble');
  if (kissId && CELEB[kissId] && L.kissSeen && (!london || R() < 0.3)) add('kiss', { celeb: kissId });
  if (togetherId && CELEB[togetherId] && photographed) add('together', { celeb: togetherId });
  // (the 'row' bank is a row with a rival driver: words with the columnist, a rep or a stranger are not that story)
  if (drama.some((d) => d?.outcome === 'row' && String(d.cid || '').startsWith('d:')) && R() < (london ? 0.3 : 0.6)) add('row');
  if (quoted) add(quoted.leak ? 'quote' : 'loose');
  if ((S.won || S.podium) && !L.stumble) add(L.shoey ? 'shoey' : 'celebrate'); else if (L.shoey) add('shoey');
  if (club && !london && (L.parade || ((L.table || pressDm >= 3) && photographed))) add('glam');
  if (vegas && arr(cur.guests).some((g) => g.role === 'dj' && g.id === 'jade-okafor') && danced.length) add('jade');
  if (Bd && (cur.contractual || num(C[`p:rep:${brand}`]?.dm, 0) >= 3)) add('sponsor', { brand: Bd.brand });
  if (leftAt >= 26 && (photographed || exit === 'breakfast') && !br && exit !== 'ejected') add('late');
  if (exit === 'hotel' && leftAt < T.start + 1.25 && peak < 3 && R() < 0.5) add('quiet');
  subs.sort((a, b) => ORDER.indexOf(a.sub) - ORDER.indexOf(b.sub));
  const chosen = subs.filter((s) => !(s.sub === 'late' && subs.some((q) => q.sub === 'stumble'))).slice(0, 2);
  for (const s of chosen) {
    const C2 = s.celeb ? CELEB[s.celeb] : s.sub === 'jade' ? CELEB['jade-okafor'] : null;
    const res = safe(`PR party ${s.sub}`, () => prEvent(c, 'party', { sub: s.sub, track: S.track, venue, place: club ? PL.name : `the ${c.myTeam} hospitality`, brand: s.brand, celeb: C2?.id, celebName: C2?.name, job: C2?.job }), null);
    for (const h of arr(res?.headlines)) if (h?.text && !heads.some((q) => q.text === h.text)) heads.push(h);   // (two outlets, one wording: once)
    if (s.celeb && (s.sub === 'kiss' || s.sub === 'together')) { const e = safe('exposure', () => exposure(c, 'photo', [s.celeb], 1.5), null); if (e?.text) lines.push(e.text); }
  }
  let crisis = null;
  if (chosen.some((s) => s.sub === 'scuffle')) crisis = safe('crisis brawl', () => crisisFrom(c, 'brawl', { source: 'club', track: S.track, place, onCamera: true }), null);
  // (a real driver as you: never 'helped out of a club' - the late-night story only, and no crisis over it)
  else if (L.stumble && photographed && !realMe && R() < 0.6) crisis = safe('crisis nightout', () => crisisFrom(c, 'nightout', { source: 'party', track: S.track, place, caught: true }), null);
  if (crisis && c.pr?.manager) say('x:pr', TEXTS.pr);
  // (the morality clauses act at the next round's tick; the brand's lawyers write at once)
  if (Pr && heads.length) for (const D of arr(Pr.deals)) if (num(D.heatMax, 100) < 100 && num(Pr.heat, 0) > D.heatMax && REPS[D.bid]) say(`p:rep:${D.bid}`, TEXTS.repLegal, { name: REPS[D.bid].name, sub: `${D.brand} · ${REPS[D.bid].title}` });
  if (!seenDrunk.has('x:boss') && !br && L.stumble && photographed && !realMe) say('x:boss', TEXTS.bossBad);
  else if (!br && score >= 0.6 && (S.won || S.podium) && !texts.some((t) => t.cid === 'x:boss')) say('x:boss', TEXTS.bossGood);
  // (your posts can show last night: a 'party' post while the race's week is live)
  if (Pr?.ctx && typeof Pr.ctx === 'object') Pr.ctx = { ...Pr.ctx, party: { venue, track: S.track, won: !!S.won, podium: !!S.podium, place } };

  // -- the morning after: the night in six lines, the papers, the people, the hangover
  const brief = arr(r.moments).filter((m) => typeof m === 'string').slice(0, 2), n = arr(L.drinks).length, tab = r6(num(L.spend, 0));   // (the tab: the helicopter is not on it)
  const drinksLine = n ? `${n} drink${n === 1 ? '' : 's'}${tab > 0 ? `, $${Math.round(tab * 1e6).toLocaleString('en-US')} on the tab` : L.comped ? ', the table comped' : ''}.` : '';
  timeline.unshift(cur.act === 2 ? `${c.myTeam} hospitality first, then ${PL.place} from ${hhmm(num(cur.start, T.start))}.` : `${club ? PL.place : `${c.myTeam} hospitality`}, ${hhmm(num(cur.start, T.start))}.`, ...brief, drinksLine);
  if (kissId && CELEB[kissId]) timeline.push(`A kiss with ${first(CELEB[kissId].name)}${L.kissSeen ? ', on the dance floor' : ', away from everyone'}.`);
  for (const D of drama) if (D?.outcome && D.outcome !== 'calm') timeline.push(D.outcome === 'row' ? 'Words exchanged, and not quietly.' : D.outcome === 'scuffle' ? 'A scuffle, broken up by security.' : D.outcome === 'cold' ? 'An awkward exchange that went nowhere.' : 'Someone walked away before it got worse.');
  // (the night's own beats, as the six lines allow - after what mattered more: the shoey, the photographers, the DJ, the
  //  parade, a dance, a hand of blackjack)
  const nameOf = (cid) => { const s = String(cid || ''), g = arr(cur.guests).find((q) => q.cid === s), id = s.slice(2); return g?.name ? first(g.name) : s.startsWith('c:') && CELEB[id] ? first(CELEB[id].name) : s.startsWith('d:') && c.drivers?.[id] ? first(c.drivers[id].name) : ''; };
  const beats = [];
  if (cur.travel === 'heli') beats.push(`The helicopter from the circuit to Battersea: $${Math.round(MONEY.heli * 1000)}K.`);
  if (L.shoey) beats.push('A shoey for the podium, and everybody filmed it.'); else if (L.champagne) beats.push('Champagne over the engineers, then the team photo with the trophy.');
  if (L.posed && club) beats.push('Stopped for the photographers at the step-and-repeat.');
  if (L.shout) beats.push('The DJ called your name over the mic, and the room turned round.');
  if (L.parade) beats.push('The bottle parade: sparklers, three litres and your number in lights.');
  const dn = arr(L.danced).filter((d) => d && d.cid && nameOf(d.cid)).sort((a, b) => num(b.score, 0) - num(a.score, 0))[0];
  if (dn && !(kissId && `c:${kissId}` === dn.cid)) beats.push(`Danced with ${nameOf(dn.cid)}.`); else if (!dn && arr(L.danced).length) beats.push('Out on the dance floor, on your own.');
  const bj = obj(L.blackjack); if (num(bj.stake, 0) > 0) beats.push(`One hand of blackjack: ${num(bj.net, 0) >= 0 ? 'up' : 'down'} $${Math.round(Math.abs(num(bj.net, bj.stake)) * 1000)}K.`);
  // (in the night's order: after the opening lines and the drinks, before the texts, the drama and the way out)
  timeline.splice(2 + brief.length, 0, ...beats.slice(0, Math.max(0, 5 - timeline.filter(Boolean).length)));
  // (a real driver as you is never 'put in a car' by anybody: the team car takes you back)
  const et = exit.startsWith('together:') ? EXIT_TXT.together : exit === 'breakfast' ? EXIT_TXT.breakfast[S.track] || EXIT_TXT.breakfast.lasvegas : realMe && exit === 'carried' ? EXIT_TXT.teamcar : EXIT_TXT[exit] || EXIT_TXT.hotel;
  const carrier = c.drivers?.[mateId] && !isReal(c.drivers[mateId]) ? first(c.drivers[mateId].name) : 'a friend';
  timeline.push(fill(et, { t: hhmm(leftAt), her: togetherId && CELEB[togetherId] ? first(CELEB[togetherId].name) : 'her', who: exit === 'carried' ? (R() < 0.5 ? 'security' : carrier) : '' }));
  const P0 = Object.values(people).sort((a, b) => b.delta.length - a.delta.length).slice(0, 6);
  const press = heads.slice(0, 3).map((h) => ({ outlet: h.outlet, name: outletOf(h.outlet), text: h.text, tone: h.tone }));
  const title = club ? (Bd ? `${Bd.brand}'s ${GPS[S.track]} after-party` : `The ${GPS[S.track]} after-party`) : S.won || S.podium ? `${c.myTeam} celebration` : `${c.myTeam}: the team's night`;
  const lastN = { unseen: true, season: S.season, round: S.round, track: S.track, city: S.city, gp: S.gp, venue, place, brand, exit, title, photo: typeof r.photo === 'string' && r.photo.length < 400000 ? r.photo : null,
    timeline: ((t) => (t.length > 6 ? [...t.slice(0, 5), t[t.length - 1]] : t))(timeline.filter(Boolean)), press, crisis: crisis?.kind || null, people: P0, hangover: hang, money: { spend, comped: !!L.comped }, score, peak, texts: texts.slice(0, 8) };
  P.last = lastN;
  P.history.unshift({ season: S.season, round: S.round, track: S.track, venue, brand, exit, peak, score, big }); P.history.length = Math.min(P.history.length, HIST_CAP);
  for (const O of P.offers) if (O.status === 'open') O.status = 'skipped';
  P.cur = null;
  lines.unshift(`${title}. ${timeline[timeline.length - 1]}`);
  if (hang?.text) lines.push(hang.text);
  safe('save', () => c.save?.());
  return { ok: true, lines, last: lastN };
}
/** Celebs.meet, said the way it happened: a first meeting at the after-party (not on the grid) */
const meetAt = (c, id, S) => {
  const b = bondOf(c, id), C = CELEB[id];
  if (b.stage === 'stranger') {
    b.stage = 'met'; b.metAt = { season: c.season, round: c.round };
    if (c.celebs && Array.isArray(c.celebs.met) && !c.celebs.met.includes(id)) c.celebs.met.push(id);
    safe('relateCeleb', () => relateCeleb(c, id, 5, `Met ${C.name} (${String(C.job).toLowerCase()}) at the ${S.gp} after-party`));
  }
  safe('meet', () => meet(c, id));
};
const OUTLET_NAME = { post: 'The Paddock Post', feed: 'Chequered', race24: 'RACE 24', gptv: 'GP TV', f1news: 'F1 NEWS', apex: 'APEX', pitlane: 'PIT LANE', gridfm: 'GRID FM', weekly: 'Paddock Weekly' };
const outletOf = (id) => OUTLET_NAME[id] || String(id || '');
const nameOfCid = (c, cid) => {
  const k = String(cid);
  if (k.startsWith('d:')) return c.drivers?.[k.slice(2)]?.name || 'A driver';
  if (k.startsWith('c:')) return CELEB[k.slice(2)]?.name || 'Someone';
  if (k === 'x:boss') return 'Team principal'; if (k === 'x:eng') return 'Race engineer'; if (k === 'x:pr') return c.pr?.manager?.name || 'PR manager';
  const m = /^p:rep:(\w+)$/.exec(k); if (m && REPS[m[1]]) return REPS[m[1]].name;
  return 'Someone';
};

// ---- 6. summed up, or an early night ----------------------------------------------------------------------------------------
/**
 * The night summed up instead of played (SUM IT UP): a sensible night - drinks to a peak of 4-6 (soft drinks under age),
 * half the people met, no drama, the club's photographers at the door one time in five - settled as a played one. -> the
 * partyResult
 */
export function autoParty(c, offerId) {
  const Lh = partyLaunch(c, offerId, 1); if (!Lh) return { ok: false, lines: [], last: null };
  const R = Math.random, club = Lh.host === 'club', soft = Lh.me.soft, T = timesOf(Lh.venue, Lh.track), Pc = ensure(c);
  const princ = Lh.guests.filter((g) => g.tier === 'principal' && g.talk > 0), keep = princ.filter((g) => g.role === 'partner' || g.role === 'mate');
  for (const g of princ.slice().sort(() => R() - 0.5)) { if (keep.length >= Math.max(2, Math.ceil(princ.length / 2))) break; if (!keep.includes(g)) keep.push(g); }
  const per = {}, contacts = {};
  for (const g of keep) {
    const b = g.kind === 'celeb' ? c.celebs?.bonds?.[g.id] : null, f = g.kind === 'driver' ? safe('friendOf', () => friendOf(c, g.id), null) : null;
    const s = clamp((g.kind === 'driver' ? 0.4 + num(f?.level, 0) / 100 * 0.35 : g.kind === 'celeb' ? 0.42 + num(b?.aff, 0) / 100 * 0.3 : 0.5) + (R() - 0.5) * 0.24, 0.05, 0.95);
    const dm = Math.round((s - 0.5) * 10), talks = 1 + ((R() * 2) | 0);
    per[g.cid] = { name: g.name, kind: g.kind, score: r2(s), mood: dm, talks, fx: {} };
    contacts[g.cid] = { role: g.role, score: r2(s), dm, talks, fx: {}, priv: 0 };
  }
  const target = soft ? 0 : 4 + 2 * R(), drinks = [];
  for (let u = 0, t = Lh.start + 0.2; !soft && u < target + 1; t += 0.45) { const k = pick(club ? ['champagne', 'cocktail', 'champagne', 'beer'] : ['champagne', 'beer', 'wine']); drinks.push({ kind: k, at: r2(t) }); u += { champagne: 1.5, cocktail: 2, beer: 2, wine: 2.3 }[k]; }
  if (soft) drinks.push({ kind: 'soft', at: Lh.start + 0.3 }, { kind: 'soft', at: Lh.start + 1 });
  if (!soft) drinks.push({ kind: 'water', at: r2(Lh.start + 1.2) });
  const leftAt = r2(club ? (Lh.venue === 'londonclub' ? 26 + 0.75 * R() : 27.5 + R()) : T.close - 0.25 * R()), photo = club && R() < 0.2;
  const m = Lh.venue === 'londonclub' ? 0.6 : 1, spend = club ? r4((Lh.me.comped ? 0 : MONEY.table * m) + MONEY.bottle * m) : 0;
  const score = keep.length ? r2(keep.reduce((a, g) => a + per[g.cid].score, 0) / keep.length) : 0.55;
  const moments = [club ? 'A booth, a bottle, and more people than you could talk to.' : 'Food, the race on the big screen, and the boss says a few words.'];
  const res = { venue: Lh.venue, score, per, moments, auto: true, seen: photo,
    party: { act: 1, venue: Lh.venue, brand: Lh.brand, drinks, units: r2(target), peak: r2(target), level: r2(Math.max(0, target - 2)), leftAt, exit: photo ? 'front' : 'hotel', stumble: false, photographed: photo,
      kiss: null, kissSeen: false, spend, table: club, comped: club && Lh.me.comped, parade: false, danced: [], selfies: 0, contacts, drama: [], brawl: null, loose: [], seenDrunkBy: [], textedEx: null } };
  const out = partyResult(c, res);
  const O = Pc.offers.find((x) => x.id === offerId); if (O) O.status = 'summed';
  return out;
}
/** CALL IT A NIGHT: back to the hotel (energy +10; a contractual party skipped costs appeal -3; skipping your team's celebration after a podium is noticed) -> { ok, lines } */
export function skipParty(c) {
  const P = ensure(c), lines = []; if (!P) return { ok: false, lines };
  const open = partyOffers(c); if (!open.length) return { ok: false, lines };
  const S = P.race, w = weekOf(c), Pr = c.pr, mateId = S?.mate;
  w.energy = clamp(Math.round(num(w.energy, 80) + 10), 0, 100);
  for (const O of open) {
    if (O.contractual && Pr) { Pr.appeal = clamp(num(Pr.appeal, 50) - 3, 0, 100); lines.push(`You skipped ${O.brandName}'s party, a contractual appearance: appeal -3.`); }
    if (O.venue === 'teamparty' && S?.podium && mateId && live(c.drivers?.[mateId])) { safe('relate', () => c.relate?.(mateId, -2, null)); safe('pushText', () => pushText(c, `d:${mateId}`, TEXTS.missed)); }
    O.status = 'skipped';
  }
  if (Math.random() < 0.4) safe('PR party quiet', () => prEvent(c, 'party', { sub: 'quiet', track: S?.track }));
  P.history.unshift({ season: S?.season, round: S?.round, track: S?.track, venue: null, brand: null, exit: 'hotel', peak: 0, score: 0.5, big: false }); P.history.length = Math.min(P.history.length, HIST_CAP);
  P.cur = null;
  lines.unshift('An early night: back to the hotel. Energy +10.');
  safe('save', () => c.save?.());
  return { ok: true, lines };
}
