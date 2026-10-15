// The week between rounds (THE WEEK in the career hub): five slots and a tank of energy. Each slot is one thing - a day
// off, the simulator, the gym, the factory, a sponsor's day (one a week is in your contract), a media day with one
// outlet, a fan meet, a charity visit, a day with your team-mate, a night out, a date, an evening out with friends -
// and each costs energy (a rest gives it back) and moves something: your morale and the four moods behind it (focus,
// racecraft, confidence, composure), your public image and following, an outlet's opinion of you, your team-mate's, a
// part arriving a race early, the team's money. A date is a text-only evening (a gallery, a concert, the beach, a
// gala) or a night at one of the venues you walk around in 3D (a private dining room, your flat, a rooftop over the
// Strip, a village pub near Silverstone, a sim-racing lounge, an indoor karting hall); an evening out with drivers or
// friends is booked here once they have said yes on your phone. For the 3D venues the week only books the evening (the
// slot, the energy, the bill) and hands back what to play: how the evening went is the scene's to decide (ui/Hangout.js,
// or a skipped one), and Social.hangoutResult applies it. It stays honest: the same thing twice in a week is worth half
// and a third time nothing, a week's gains are capped (morale +6, each mood +8), you need the energy for what you take
// on, and arriving at the race running on empty costs focus (checked on race day: raceDayCheck). The race night's party
// (career/Party.js) can leave its mark on the week that follows - less energy, the first morning lost to recovery (in Las
// Vegas an IV-hydration clinic), a rough sponsor or media day - and counts as the week's night out; never a trait, for a
// hangover is gone in a day. Hurt, the week shrinks to recovery, the simulator, the
// factory and a quiet visit, and the sponsors wait; banned, it runs as normal. In the week after a grave race nothing
// here is turned into a story: no nights out, no dates beyond a quiet evening in, and no evenings out but a quiet coffee
// with a friend. Your own money (the wallet) can go into the team or to charity. The week lives on the career as plain
// JSON (c.week); the callers save.
import { shiftMorale } from './Morale.js';
import { prEvent, crisisFrom, OUTLETS, OUTLET_BY_ID } from './PR.js';
import { CELEB, bondOf, canDate, dateOptions, goOnDate, relateCeleb, trustCeleb, upsetCeleb, seeing, exposure, venueFit, photoRisk } from './Celebs.js';
import * as Social from './Social.js';

const pick = (a) => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const first = (s) => String(s || '').split(' ')[0];
const last = (s) => String(s || '').split(' ').pop();
/** first names in a sentence: 'Lando' / 'Lando and Oscar' / 'Lando, Oscar and Max' */
const listOf = (names) => { const n = names.map(first).filter(Boolean); return n.length > 1 ? `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : n[0] || 'someone'; };
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal' };
const SLOTS = 5, MORALE_CAP = 6, MOOD_CAP = 8;
// (what the week can still hold while you recover from an injury)
const HURT_OK = ['rest', 'sim', 'factory', 'date'];

// ---- the career around the week ------------------------------------------------------------------------------------------
const meOf = (c) => c?.drivers?.[c.playerId] || null;
/** rounds since a stamp ({ season, round }) -> n (99 for never) */
const ago = (c, at) => (at ? (c.season - at.season) * (c.rounds || 6) + (c.round - at.round) : 99);
/** your driver is out hurt (an injury lay-off, not a ban) */
const hurt = (c) => { const d = meOf(c); return !!d && d.outUntil != null && d.outUntil >= c.round; };
/** a grave week: the race just run brought an injury or a death or was abandoned, or the paddock has just lost someone */
const grave = (c) => !!c.pr?.ctx?.grave || (c.lost || []).some((l) => ago(c, l) <= 0);
const trackOf = (c) => (c.calendar?.length ? c.calendar[(c.round - 1) % c.calendar.length] : null);
const money = (v) => `$${r2(v)}M`;
// (the PR and morale engines are their own modules: a hiccup there never loses a slot half-done)
const pr = (c, kind, data) => { try { return c.pr ? prEvent(c, kind, data) : null; } catch (e) { console.warn('Agenda: PR event failed', kind, e); return null; } };
const crisis = (c, kind, data) => { try { return c.pr ? crisisFrom(c, kind, data) : null; } catch (e) { console.warn('Agenda: crisis failed', kind, e); return null; } };
const mood = (c, v, why, stat = null) => { try { return v ? shiftMorale(c, c.playerId, v, why, stat) : 0; } catch (e) { console.warn('Agenda: morale failed', e); return 0; } };
/** the week's capped gains: morale +6 and each mood +8 at most over a week (what costs you is never capped) -> (v, why, stat) => applied */
const gainOf = (c, w) => (v, why, stat = null) => {
  v = Math.round(v); if (!v) return 0;
  if (v < 0) return mood(c, v, why, stat);
  const k = stat || 'morale', a = Math.min(v, Math.max(0, (stat ? MOOD_CAP : MORALE_CAP) - (w.gain[k] || 0))); if (a <= 0) return 0;
  const got = mood(c, a, why, stat); w.gain[k] = (w.gain[k] || 0) + Math.max(0, got); return got;
};
const LIM = { image: [-100, 100], appeal: [0, 100], fame: [0, 10000] }, DEF = { image: 10, appeal: 50, fame: 0.4 };
/** a PR event for something you did, its effect made at least what the card promised (want: { image, appeal, fame }) -> the event's result */
const prDo = (c, kind, data, want = {}) => {
  const r = pr(c, kind, data), d = r?.d || {}, P = c.pr; if (!P) return r;
  for (const k of Object.keys(want)) {
    const short = want[k] - Math.max(0, d[k] || 0);
    if (short > 0.005) P[k] = clamp(Math.round(((P[k] ?? DEF[k]) + short) * 100) / 100, LIM[k][0], LIM[k][1]);
  }
  return r;
};
/** a little more following: about 1% of it (followers in millions) */
const fameBump = (c) => Math.max(0.02, (c.pr?.fame || 0.5) * 0.01);
/** you did something for charity this week (a 'charity' post is honest now) */
const charityDone = (c) => { if (c.pr) c.pr.ctx = { ...(c.pr.ctx || {}), charityDone: true }; };

// ---- the evening venues (Social.js VENUES) and who is coming ---------------------------------------------------------------
// (Social.js holds the venues; these stand in only if it has none - the same ids, the spec's privacy)
const VENUES_STD = [
  { id: 'rooftop', name: 'A rooftop lounge', blurb: 'Above the Strip at night, the Sphere glowing below.', where: 'lasvegas', privacy: 0.2, cost: 0.2, energy: 15, kinds: ['friend', 'date', 'group'] },
  { id: 'poolclub', name: 'Tidewater Beach Club', blurb: 'The night swim at the Meridian Grand: a lit pool, cabanas and a DJ under the palms.', where: 'lasvegas', privacy: 0.3, cost: 0.2, energy: 14, kinds: ['friend', 'date', 'group'] },
  { id: 'pub', name: 'The village pub', blurb: 'Timber beams, a fire, darts and a pool table, a few miles from the circuit.', where: 'silverstone', privacy: 0.5, cost: 0.05, energy: 10, kinds: ['friend', 'date', 'group'] },
  { id: 'simlounge', name: 'A sim-racing lounge', blurb: 'Three rigs, an arcade cabinet and a fridge of soft drinks.', where: null, privacy: 0.6, cost: 0.1, energy: 10, kinds: ['friend', 'date', 'group'] },
  { id: 'apartment', name: 'Your flat', blurb: 'Cook at home: the sneaky choice.', where: null, privacy: 0.95, cost: 0, energy: 5, kinds: ['friend', 'date', 'group'] },
  { id: 'restaurant', name: 'A private dining room', blurb: 'One table, candles, a view, and a waiter who has seen everything.', where: null, privacy: 0.8, cost: 0.15, energy: 10, kinds: ['date', 'friend', 'group'] },
  { id: 'karting', name: 'An indoor karting hall', blurb: 'A small lit track after hours, and a timing screen that settles arguments.', where: null, privacy: 0.4, cost: 0.1, energy: 15, kinds: ['friend', 'date', 'group'] },
  { id: 'coffee', name: 'A quiet café', blurb: 'Somewhere quiet to sit with a friend.', where: null, privacy: 0.9, cost: 0, energy: 5, kinds: ['friend', 'group'], quiet: true },
];
const venues = () => (Array.isArray(Social.VENUES) && Social.VENUES.length ? Social.VENUES : VENUES_STD);
const venueById = (id) => venues().find((v) => v && v.id === id) || null;
/** a venue's name inside a sentence: 'a rooftop lounge', 'the village pub' (a name without an article is kept as it is) */
const vName = (v) => String(v?.name || 'somewhere').replace(/^(A|An|The) /, (m) => m.toLowerCase());
/** the quiet places: all a grave week offers (a coffee with a friend; no PR, no photographers) */
const quietV = (v) => !!v && (!!v.quiet || !!v.grave || v.id === 'coffee');
/** open this week: a venue tied to a circuit only in that race's week */
const openV = (c, v) => !!v && (!v.where || v.where === trackOf(c));
// (the old date plans that are venues now: dinner is the private dining room, cooking is your flat)
const LEGACY = { dinner: 'restaurant', cooking: 'apartment', rooftop: 'rooftop', karting: 'karting', poolclub: 'poolclub' };
/** a 3D venue she could be taken to this week -> venue | null */
const dateVenue = (c, key) => { const v = venueById(LEGACY[key] || key); return v && openV(c, v) && !quietV(v) && (!Array.isArray(v.kinds) || v.kinds.includes('date')) ? v : null; };
/** a contact id ('d:<driver>', 'c:<celebrity>'), from a contact id or a bare id */
const cidOf = (c, x) => { const s = String(x || ''); return /^[dcx]:/.test(s) ? s : c.drivers?.[s] ? 'd:' + s : CELEB[s] ? 'c:' + s : s; };
/** a guest for the evening (ui/Hangout.js): a driver with his team's colours, or one of the celebrities -> { kind, id, cid, name, ... } | null */
const guestOf = (c, cid) => {
  const k = String(cid).slice(0, 2), id = String(cid).slice(2);
  if (k === 'd:') { const d = c.drivers?.[id]; if (!d || d.alive === false || id === c.playerId) return null; const t = c.teams?.[d.team]; return { kind: 'driver', id, cid, name: d.name, team: d.team || null, color: t?.color || '#6b7480', color2: t?.color2 || '#ffffff' }; }
  if (k === 'c:') { const C = CELEB[id]; return C ? { kind: 'celeb', id, cid, name: C.name, job: C.job } : null; }
  return null;
};
/** this round's invitations that came back yes (Social.js c.social.invites, read as plain JSON) */
const invitesNow = (c) => (Array.isArray(c.social?.invites) ? c.social.invites : []).filter((v) => v && v.status === 'accepted' && v.season === c.season && v.round === c.round);
/** who an invitation brings: the friend who asked you (and anyone with them), or those you asked who said yes -> [cid] */
const guestsOf = (c, v) => (v.to === 'me' ? [v.from, ...(v.guests || [])] : Array.isArray(v.accepted) ? v.accepted : v.guests?.length ? v.guests : [v.to]).filter((g) => g && g !== 'me').map((g) => cidOf(c, g));
/** an evening booked: the invitations it answers are used (they no longer lapse) */
const useInvites = (c, L) => { for (const v of L) { v.status = 'done'; v.booked = { season: c.season, round: c.round }; } };
/** 'venue|cid,cid' -> { V, cids, inv (the accepted invitations it answers) } | null */
const hangArg = (c, arg) => {
  const [vid, list] = String(arg || '').split('|'), V = venueById(vid); if (!V) return null;
  const want = String(list || '').split(',').map((x) => x.trim()).filter(Boolean).map((x) => cidOf(c, x));
  const inv = invitesNow(c).filter((v) => v.venue === V.id && (!want.length || guestsOf(c, v).some((g) => want.includes(g))));
  const cids = [...new Set(want.length ? want : inv.flatMap((v) => guestsOf(c, v)))].filter((g) => guestOf(c, g));
  return cids.length ? { V, cids, inv } : null;
};
/** whether an evening can go ahead this week -> a reason, or null */
const hangWhy = (c, V, cids) => {
  if (hurt(c)) return 'Not while you recover';
  if (!openV(c, V)) return `${V.name.replace(/^(A|An) /, 'That ')} is not on this week`;
  if (grave(c) && (!quietV(V) || cids.some((g) => g.startsWith('c:')))) return 'Not this week: a quiet coffee with a friend, if anything';
  if ((c.wallet ?? 0) < (V.cost || 0)) return `Not enough in your own account (${money(V.cost || 0)})`;
  return null;
};

// ---- what the days are like ------------------------------------------------------------------------------------------
const CORNERS = { lasvegas: ['the stop for Turn 14 at the end of the Strip', 'the Turn 1 hairpin on cold tyres', 'the Sphere section', 'the Turn 12 left onto the Strip'],
  montreal: ['the hairpin', 'the last chicane and the Wall of Champions', 'the Senna S on cold tyres', 'the kerbs at Turns 8 and 9', 'the stop for Turn 10'],
  silverstone: ['Maggotts and Becketts', 'the entry to Copse', 'the stop for Stowe', 'Luffield on cold tyres', 'the Vale and Club complex'], any: ['the slow corners', 'the braking zones'] };
const fill = (s, c, x = {}) => s.replace(/\{(\w+)\}/g, (m, k) => (k === 'track' ? TRACK[trackOf(c)] || 'the next circuit' : k === 'corner' ? pick(CORNERS[trackOf(c)] || CORNERS.any) : x[k] ?? m));
const REST = ['A day off: a long sleep, a walk, your phone in a drawer.', 'Nothing on the calendar for once. You sleep for ten hours.', 'A lazy day at home. The engineers\' emails can wait until tomorrow.'];
const RECOVER = ['A quiet day of rest and physio. The doctors are pleased with the progress.', 'Rest, physio and an early night. One day at a time.'];
const SIM = ['Three hours in the simulator on the {track} layout: {corner} is starting to feel second nature.', 'A long session in the simulator. The engineers want you braking a metre later for {corner}, and by the end you are.',
  'Qualifying runs and long runs in the simulator: {corner} on low fuel, then on old tyres.'];
const SIM_HURT = ['Light work in the simulator, cleared by the doctors: {corner}, at your own pace.', 'An hour in the simulator, no more: the doctors are strict. You talk the engineers through {corner}.'];
const FITNESS = ['Two hours with your trainer: neck work for the g-forces, then reaction drills until the lights blur.', 'Intervals on the bike, then the neck harness. Your trainer says you are in the best shape of the season.',
  'A hard morning in the gym and a long swim. Calm, and tired in the right way.'];
const FACTORY = ['A day at the factory: the design office, the wind-tunnel model, lunch with the machinists.', 'You walk the factory floor and thank everyone by name. It is noticed.',
  'A long debrief with the engineers, then a tour of the composites shop.'];
const SPONSOR = ['a photo shoot, a hot lap for their guests and two hundred signatures.', 'a factory tour for their customers, a speech you mostly remembered, a great many handshakes.',
  'a commercial that takes eleven takes, then dinner with their board.'];
const MEDIA = {
  tv: 'A sit-down with {outlet}: a long interview, a feature on your season, a walk round the factory with a camera.',
  online: 'An afternoon with {outlet}: an interview, a video for their channel, a quick-fire quiz you lose.',
  magazine: 'A long interview and a photo shoot for {outlet}. The writer asks better questions than most.',
  podcast: 'Two hours on the {outlet} podcast. It is looser than you expected, and funnier.',
  radio: 'An hour live on {outlet}: phone-ins from fans, a song of your choosing, a question about your karting days.',
  tabloid: 'You give {outlet} an afternoon. They are on their best behaviour - for now.',
};
const mediaKind = (o) => { const k = String(o.kind || ''); return k.includes('tabloid') ? 'tabloid' : k.includes('podcast') ? 'podcast' : k.includes('radio') ? 'radio' : k.includes('magazine') ? 'magazine' : k.includes('tv') ? 'tv' : 'online'; };
const FANS = ['Two hours of selfies and signatures in a fan zone. A boy in a home-made helmet asks how you brake so late.', 'A Q&A on a stage in town, then a signing that runs an hour over. Nobody minds.',
  'You visit a fan club that has followed you since karting. They have kept every result.'];
const CHARITY = ['A day with a karting programme for kids who could never afford it. Two of them are quick.', 'You spend the day at a food bank near the factory, unloading vans and keeping out of the photos.',
  'A school visit for a science programme: you explain downforce with a paper wing, and it works.'];
const CAUSES = ['a karting programme for kids who could never afford it', 'a food bank near the factory', 'a science scholarship for girls', 'a children\'s reading charity'];
const TEAMBOND = ['Padel with {mate}: you lose, narrowly, and hear about it all week.', 'Golf with {mate}. Neither of you is any good; both of you are very competitive about it.',
  'An evening at the kart track with {mate} and the mechanics. You win; {mate} demands a rematch.', 'Dinner with {mate} and the engineers, no laptops allowed. The best debrief of the season.'];
const NIGHT = ['A late one in London with friends: a club, a late dinner, a taxi at three.', 'Dinner, then a bar, then another bar. You were going to be home by midnight.'];
const NIGHT_VEGAS = ['A late one on the Strip: a club, a show, breakfast at four.', 'A casino floor, a rooftop bar, a club with a queue round the block. Vegas.'];

// ---- the activities ----------------------------------------------------------------------------------------------------
/**
 * What a slot can hold: { key, name, icon, energy (its cost; negative gives energy back), desc, needs?: (c) => bool }.
 * A date takes the energy of the plan or venue you choose (dateChoices), an evening out that of its venue
 * (hangoutsReady). Messages, invitations and social posts are free (not here).
 */
export const ACTIVITIES = [
  { key: 'rest', name: 'Rest', icon: '☾', energy: -30, desc: 'A day off: sleep, a walk, nothing on the calendar. Energy +30, and morale +2 when you were running low.' },
  { key: 'sim', name: 'Simulator session', icon: '▶', energy: 15, desc: 'Laps of the next circuit in the team\'s simulator: focus +6, confidence +3.' },
  { key: 'fitness', name: 'Fitness', icon: '▲', energy: 20, desc: 'Neck, core and reaction work with your trainer: composure +5.' },
  { key: 'factory', name: 'Factory visit', icon: '⚙', energy: 10, desc: 'A day with the engineers: your team-mate\'s rapport +4, and now and then a part arrives a race early.', needs: (c) => !!c.team },
  { key: 'sponsor', name: 'Sponsor day', icon: '$', energy: 20, desc: 'One a week is in your contract: $0.4-1.4M to the team by your appeal, appeal +3. Skip it and appeal drops 6.', needs: (c) => !hurt(c) && !weekOf(c).sponsorDone },
  { key: 'media', name: 'Media day', icon: '✎', energy: 15, desc: 'An afternoon with one outlet: their opinion of you +12 (less once they already like you), image +2. One day per outlet.', needs: (c) => !hurt(c) && mediaOutlets(c).some((o) => !o.used) },
  { key: 'fans', name: 'Fan meet', icon: '☺', energy: 15, desc: 'Selfies, signatures and a Q&A: image +3, more followers.', needs: (c) => !hurt(c) },
  { key: 'charity', name: 'Charity visit', icon: '❀', energy: 10, desc: 'A day for a cause you care about: image +4, morale +2.', needs: (c) => !hurt(c) },
  { key: 'teambond', name: 'Team-mate day', icon: '♣', energy: 10, desc: 'Padel, golf or karting with your team-mate: rapport +6, morale +2.', needs: (c) => !hurt(c) && !!c.teammate?.() },
  { key: 'nightout', name: 'Night out', icon: '♫', energy: 25, desc: 'A late one: morale +5 and a few more followers, focus -6 - and the photographers are about (35%, more in Las Vegas).', needs: (c) => !hurt(c) && !grave(c) },
  { key: 'date', name: 'A date', icon: '❦', energy: 0, desc: 'Time with someone you are seeing - choose her and the place: a gallery, a concert, or an evening at one of the venues, played out in 3D.', needs: (c) => dateTargets(c).length > 0 },
  { key: 'hangout', name: 'Evening out', icon: '☕', energy: 0, desc: 'An evening with friends who said yes on your phone, at the place you chose: friendship, morale - played out in 3D.', needs: (c) => hangoutsReady(c).some((h) => !h.why) },
];
const ACT = Object.fromEntries(ACTIVITIES.map((a) => [a.key, a]));
const WHY = { factory: 'No team to visit', sponsor: 'Done this week', media: 'Every outlet has had its day this week', teambond: 'No team-mate to spend it with', nightout: 'Not this week', date: 'Nobody to take out yet',
  hangout: 'Nobody has said yes yet: make plans on your phone' };

// ---- the week (c.week) -----------------------------------------------------------------------------------------------
/** a new week for the race the career is at: slots, energy (carried over), what is done, the gains so far, the evenings booked to play (launches) */
const freshWeek = (c, energy = 80) => ({ season: c.season, round: c.round, slots: SLOTS, used: [], energy: clamp(Math.round(energy), 0, 100), sponsorDone: false, gain: {}, counts: {}, media: [], invested: 0, donated: false, injured: hurt(c), launches: [] });
/** this round's week (made, or refreshed for a new round: energy +40, up to 100) -> c.week */
export function weekOf(c) {
  let w = c.week;
  if (!w || w.season !== c.season || w.round !== c.round) w = c.week = freshWeek(c, w ? (w.energy ?? 60) + 40 : 80);
  w.used = w.used || []; w.gain = w.gain || {}; w.counts = w.counts || {}; w.media = w.media || []; w.slots = w.slots || SLOTS; w.energy = w.energy ?? 80; w.launches = Array.isArray(w.launches) ? w.launches : [];
  if (hurt(c)) w.injured = true;
  return w;
}
/** slots still free this week */
export function slotsLeft(c) { const w = weekOf(c); return Math.max(0, w.slots - w.used.length); }
/** a morale (stat null) or mood gain inside this week's caps (morale +6, each mood +8 a week; a loss is never capped) -> applied */
export function weekGain(c, v, why = '', stat = null) { return c ? gainOf(c, weekOf(c))(v, why, stat) : 0; }
// (an IV-hydration clinic on the Strip: legal, widely advertised, $500)
const IV_COST = 0.0005;
/**
 * The morning after a party (career/Party.js), into this week: h: { H (0..1, how bad), energy (a loss, negative), slot
 * ('recovery' | 'iv' | null: the first slot goes to recovering - locked, energy +10, nothing gained; in Las Vegas an
 * IV clinic, energy +12, $500 when you can pay), rough (a sponsor or media day in the first two slots goes badly), why }.
 * The night counts as this week's night out. Never a trait: a hangover is gone in a day. -> { H, energy (the net change),
 * slot, rough, text }
 */
export function setHangover(c, h = {}) {
  const w = weekOf(c), H = clamp(Number(h.H) || 0, 0, 1), out = { H: r2(H), energy: 0, slot: null, rough: false, text: '' }, e0 = w.energy;
  w.counts.nightout = (w.counts.nightout || 0) + 1;
  if (Number(h.energy)) w.energy = clamp(Math.round(w.energy + Number(h.energy)), 0, 100);
  if (h.slot && slotsLeft(c) > 0 && !w.used.some((u) => u && u.key === 'recovery')) {
    const iv = h.slot === 'iv' && (c.wallet ?? 0) >= IV_COST;
    if (iv) c.wallet = Math.round(((c.wallet ?? 0) - IV_COST) * 10000) / 10000;
    w.energy = clamp(w.energy + (iv ? 12 : 10), 0, 100);
    const text = iv ? 'An IV-hydration clinic on the Strip first thing: a drip, vitamins and a dark room for an hour. $500.' : 'Recovery: a slow morning, a lot of water, a walk. Nothing else gets done.';
    w.used.unshift({ key: 'recovery', arg: iv ? 'iv' : null, text, locked: true }); out.slot = iv ? 'iv' : 'recovery';
  }
  if (h.rough || H >= 0.8) { w.rough = true; out.rough = true; }
  out.energy = w.energy - e0;
  const bits = [out.energy ? `energy ${out.energy > 0 ? '+' : ''}${out.energy}` : '', out.slot === 'iv' ? 'the morning at an IV clinic' : out.slot ? 'the morning lost to recovery' : '', out.rough ? 'a sponsor or media day this week will be hard going' : ''].filter(Boolean);
  out.text = H > 0.15 ? `The morning after: ${bits.join(', ') || 'a sore head'}.` : '';
  w.hangover = { ...out, why: String(h.why || ''), season: c.season, round: c.round };
  return out;
}
/** a sponsor or media day while still feeling last night: one of the week's first two slots, after a hard night */
const roughNow = (w) => !!w.rough && w.used.length < 2;
/**
 * Race day (main.js careerRace and Career.simRace, before the lights): arriving at the race running on empty costs focus
 * -6 ('Running on empty'), once a round, at the race it is meant for. The week's end reports it. -> { lines }
 */
export function raceDayCheck(c) {
  const lines = [], w = c?.week, me = meOf(c);
  if (!w || !me || !me.alive || w.season !== c.season || w.round !== c.round || w.emptyChecked || hurt(c)) return { lines };
  w.emptyChecked = true;
  if ((w.energy ?? 60) < 30) { mood(c, -6, 'Running on empty', 'focus'); w.emptyLine = `Running on empty: ${energyLabel(w.energy).toLowerCase()} on race day (focus -6).`; lines.push(w.emptyLine); }
  return { lines };
}
/** what a date or an evening out would take (arg: 'celebId|plan or venue', 'venue|cid,cid') -> { energy, cost, why (it is not on: a reason) } */
const argCost = (c, key, arg) => {
  if (key === 'hangout') {
    const H = hangArg(c, arg); if (!H) return { energy: 0, cost: 0, why: 'Nobody has said yes to that' };
    return { energy: H.V.energy || 0, cost: H.V.cost || 0, why: hangWhy(c, H.V, H.cids) };
  }
  const [id, k] = String(arg).split('|'); if (!CELEB[id] || !canDate(c, id)) return { energy: 0, cost: 0, why: 'Nobody to take out' };
  const V = !hurt(c) && !grave(c) ? dateVenue(c, k) : null; if (V) return { energy: V.energy || 0, cost: V.cost || 0, why: null };
  const o = dateOptions(c, id).find((x) => x.key === k) || (hurt(c) || grave(c) ? dateOptions(c, id)[0] : null);
  return { energy: o?.energy || 0, cost: o?.cost || 0, why: o ? null : 'That is not on this week' };
};
/**
 * Whether an activity can go in a slot now, and what it is worth: { ok, why (when not), name ('Recovery' for a rest
 * while hurt), energy (a date's from its plan or venue: arg 'id|key'; an evening out's from its venue), cost ($M from
 * your own account), mul (1, 0.5 the second time this week, 0 the third), done (times this week) }
 */
export function activityState(c, key, arg = null) {
  const A = ACT[key]; if (!A) return { ok: false, why: 'Not something you can do', name: key, energy: 0, cost: 0, mul: 0, done: 0 };
  const w = weekOf(c), me = meOf(c), inj = hurt(c), n = w.counts[key] || 0;
  let energy = A.energy, cost = 0, why = null, bad = null;
  if ((key === 'date' || key === 'hangout') && arg) ({ energy, cost, why: bad } = argCost(c, key, arg));
  if (!me || !me.alive) why = 'Choose your driver first';
  else if (slotsLeft(c) <= 0) why = 'No slots left this week';
  else if (inj && key === 'sponsor') why = 'Waived while you recover';
  else if (inj && !HURT_OK.includes(key)) why = 'Not while you recover';
  else if (bad) why = bad;
  else if (A.needs && !A.needs(c)) why = WHY[key] || 'Not this week';
  else if (energy > 0 && w.energy < energy) why = 'Too tired';
  else if (cost > 0 && (c.wallet ?? 0) < cost) why = 'Not enough in your own account';
  return { ok: !why, why, name: key === 'rest' && inj ? 'Recovery' : A.name, energy, cost, mul: key === 'sponsor' ? 1 : n === 0 ? 1 : n === 1 ? 0.5 : 0, done: n };
}
/** every activity with its state now (for THE WEEK's cards) -> [{ ...activity, ...activityState }] */
export function activitiesFor(c) { return ACTIVITIES.map((A) => ({ ...A, ...activityState(c, A.key) })); }
/** the outlets you can give a media day to (not the social platform) -> [{ id, name, kind, rel, used }] */
export function mediaOutlets(c) {
  const w = c ? weekOf(c) : null;
  return (OUTLETS || []).filter((o) => o.id !== 'feed').map((o) => ({ id: o.id, name: o.name, kind: o.kind, rel: Math.round(c?.pr?.media?.[o.id] || 0), used: !!w && w.media.includes(o.id) }));
}
/**
 * Where you could take her this week: the venues open this week (a 3D evening: venue true) and the text-only dates (a
 * gallery, a concert, the beach, a gala - and an old plan whose venue is not on); while you recover or in a grave week
 * only a quiet visit. Each with its cost, energy, the photographers' chance (risk), whether it is her thing, and warn
 * (who else might hear of it) -> [{ key, name, venue, cost, energy, privacy?, risk, fav, meh, afford, desc, warn }]
 */
export function dateChoices(c, id) {
  const C = CELEB[id]; if (!c || !C || !canDate(c, id)) return [];
  // (whoever else you are seeing who does not know about her - nobody, once the two of you are public)
  const base = dateOptions(c, id), others = bondOf(c, id).public ? [] : seeing(c).filter((k) => k !== id && !(bondOf(c, k).knows || []).includes(id));
  const warn = (risk) => (risk > 0 && others.length ? `${listOf(others.map((k) => CELEB[k].name))} may hear about it.` : '');
  if (hurt(c) || grave(c)) return base.map((o) => ({ ...o, venue: false, warn: '' }));
  const V = venues().filter((v) => dateVenue(c, v.id) === v), have = new Set(V.map((v) => v.id)), cash = c.wallet ?? 0;
  const out = V.map((v) => {
    const F = venueFit(id, v.id), risk = photoRisk(c, id, v.privacy ?? 0.5);
    return { key: v.id, name: v.name, venue: true, cost: v.cost || 0, energy: v.energy || 0, privacy: v.privacy ?? 0.5, risk, fav: F.fav, meh: F.meh, afford: cash >= (v.cost || 0), desc: [v.blurb, F.hint].filter(Boolean).join(' '), warn: warn(risk) };
  });
  for (const o of base) if (!(LEGACY[o.key] && have.has(LEGACY[o.key]))) out.push({ ...o, venue: false, warn: warn(o.risk) });
  return out;
}
/** who you could take out this week, and where -> [{ id, name, stage, accepted, secret, options: dateChoices }] */
export function dateTargets(c) {
  if (!c) return [];
  return Object.keys(CELEB).filter((id) => canDate(c, id)).map((id) => { const b = bondOf(c, id); return { id, name: CELEB[id].name, stage: b.stage, accepted: !!b.accepted, secret: !!b.secret, options: dateChoices(c, id) }; });
}
/**
 * The evenings out ready to book: this round's invitations that came back yes (from your phone, or a friend's that you
 * accepted), one per invitation -> [{ invite, venue, name, cids, names, kind, cost, energy, arg ('venue|cid,cid' for
 * doActivity('hangout', arg)), why (a reason it cannot go ahead, or null) }]
 */
export function hangoutsReady(c) {
  if (!c) return [];
  const out = [];
  for (const v of invitesNow(c)) {
    const V = venueById(v.venue); if (!V) continue;
    const cids = [...new Set(guestsOf(c, v))].filter((g) => guestOf(c, g)); if (!cids.length) continue;
    out.push({ invite: v.id, venue: V.id, name: V.name, cids, names: cids.map((g) => guestOf(c, g).name), kind: v.kind || (cids.some((g) => g.startsWith('c:')) ? 'date' : 'hangout'),
      cost: V.cost || 0, energy: V.energy || 0, arg: `${V.id}|${cids.join(',')}`, why: hangWhy(c, V, cids) });
  }
  return out;
}

// ---- doing them ------------------------------------------------------------------------------------------------------
// (each: (c, week, mul, capped gain, arg) -> the text, { text, launch } for an evening to play, or { fail } before anything has changed)
const DO = {
  rest: (c, w, m, g) => { if (w.energy < 50) g(2 * m, hurt(c) ? 'Rest and recovery' : 'A proper rest'); return pick(hurt(c) ? RECOVER : REST); },
  sim: (c, w, m, g) => { g(6 * m, 'Simulator work', 'focus'); g(3 * m, 'Simulator work', 'confidence'); return fill(pick(hurt(c) ? SIM_HURT : SIM), c); },
  fitness: (c, w, m, g) => { g(5 * m, 'Training', 'composure'); return pick(FITNESS); },
  factory: (c, w, m) => {
    const mate = c.teammate?.(), t = c.team; if (mate && m) c.relate?.(mate.id, Math.round(4 * m));
    let extra = '';
    if (t && m && Math.random() < 0.2 * m) {
      // (a part with two or more rounds to go loses one; with nothing that far off, the next part correlates a little better)
      const dv = (t.dev || []).filter((x) => x.left >= 2).sort((a, b) => a.left - b.left)[0];
      if (dv) { dv.left--; extra = ' The engineers find a shortcut: one of the parts in development is arriving a race early.'; }
      else { t.qBoost = Math.max(t.qBoost || 0, 0.05); extra = ' Nothing is close enough to hurry, but the hours with the engineers will show in how the next part correlates.'; }
    }
    return pick(FACTORY) + extra;
  },
  sponsor: (c, w) => {
    const P = c.pr || {}, cash = r1(0.4 + clamp(P.appeal ?? 50, 0, 100) / 100), deal = (P.deals || [])[0], t = c.team;
    if (t) t.budget = r1(t.budget + cash);
    const rough = roughNow(w);
    w.sponsorDone = true; prDo(c, 'sponsorDay', { brand: deal?.brand || `${c.myTeam}'s partners` }, { appeal: rough ? 1 : 3 });
    // (still feeling the party: you turned up, and that is about all - appeal +1, not +3)
    if (rough && c.pr) c.pr.appeal = clamp(Math.round(((c.pr.appeal ?? 50) - 2) * 10) / 10, 0, 100);
    return `${deal?.brand ? `A day with ${deal.brand}` : 'A day with the team\'s partners'}: ${pick(SPONSOR)} ${money(cash)} to the team.${rough ? ' You were not at your sharpest after the weekend, and they noticed: appeal +1, not +3.' : ''}`;
  },
  media: (c, w, m, g, arg) => {
    const o = OUTLET_BY_ID?.[arg]; if (!o || arg === 'feed') return { fail: 'Choose an outlet for the media day.' };
    if (w.media.includes(arg)) return { fail: `${o.name} have had their day this week.` };
    w.media.push(arg);
    const P = c.pr;
    // (still feeling the party: a rough afternoon, and the outlet thinks a little less of you for it)
    if (roughNow(w)) { if (P) { P.media = P.media || {}; P.media[arg] = clamp(Math.round((P.media[arg] || 0) - 3), -100, 100); } return `A rough afternoon with ${o.name}: you were not at your sharpest after the weekend, and it showed. Their opinion of you -3.`; }
    if (P && m) {
      P.media = P.media || {}; const v0 = P.media[arg] || 0, want = 12 * m * (v0 > 60 ? 0.5 : 1);
      prDo(c, 'mediaDay', { outlet: arg, mul: m }, { image: 2 * m });
      if ((P.media[arg] || 0) - v0 < want) P.media[arg] = clamp(Math.round(v0 + want), -100, 100);
    }
    return fill(MEDIA[mediaKind(o)], c, { outlet: o.name });
  },
  fans: (c, w, m) => { if (m) prDo(c, 'fans', { mul: m }, { image: 3 * m, fame: fameBump(c) * m }); return pick(FANS); },
  charity: (c, w, m, g) => {
    const q = grave(c); charityDone(c);
    if (m) { if (!q) prDo(c, 'charity', { mul: m }, { image: 4 * m }); g(2 * m, 'A day for a good cause'); }
    return pick(CHARITY) + (q ? ' No cameras, no announcement.' : '');
  },
  teambond: (c, w, m, g) => {
    const mate = c.teammate?.(); if (!mate) return { fail: 'No team-mate to spend it with.' };
    if (m) { c.relate?.(mate.id, Math.round(6 * m)); g(2 * m, `A day with ${last(mate.name)}`); }
    return fill(pick(TEAMBOND), c, { mate: last(mate.name) });
  },
  nightout: (c, w, m, g) => {
    const vegas = trackOf(c) === 'lasvegas', caught = Math.random() < (vegas ? 0.45 : 0.35);
    g(5 * m, 'A night out'); g(-6, 'A late night', 'focus');
    prDo(c, 'nightout', { caught, mul: m }, caught || !m ? {} : { fame: fameBump(c) * 0.5 * m });
    let text = pick(vegas ? NIGHT_VEGAS : NIGHT) + (caught ? ' A photographer was outside the door at three in the morning.' : ' Nobody with a camera noticed. Probably.');
    if (caught) {
      if (Math.random() < 0.5) crisis(c, 'nightout', { caught: true });
      // (everyone you are seeing sees the photographs too: the jealous ones take it hardest)
      const calm = [];
      for (const p of seeing(c)) {
        const C = CELEB[p], T = C.traits, f = first(C.name);
        relateCeleb(c, p, -Math.round(2 + 6 * T.jealousy), `${f} saw the photographs from your night out`); trustCeleb(c, p, -3);
        if (T.jealousy >= 0.5) text += ` ${upsetCeleb(c, p, `${f} saw the photographs, and she is upset.`).text}`; else calm.push(C.name);
      }
      if (calm.length) text += ` ${listOf(calm)} saw the photographs.`;
    }
    return text;
  },
  date: (c, w, m, g, arg) => {
    const [id, k0] = String(arg || '').split('|');
    if (!CELEB[id] || !canDate(c, id)) return { fail: 'Choose who to take out, and where.' };
    const C = CELEB[id], f = first(C.name), quiet = hurt(c) || grave(c), V = quiet ? null : dateVenue(c, k0);
    if (!V) {
      // (a text-only evening: it happens here and now; while you recover or in a grave week, only a quiet one)
      const r = goOnDate(c, id, quiet ? 'visit' : k0, { mul: m, morale: g });
      if (r.ok) useInvites(c, invitesNow(c).filter((v) => guestsOf(c, v).includes('c:' + id)));
      return r.ok ? r.text : { fail: r.text };
    }
    // (a 3D venue: booked and paid for here; how it goes is the evening's - ui/Hangout.js, then Social.hangoutResult -> Celebs.dateResult)
    const cost = V.cost || 0; if ((c.wallet ?? 0) < cost) return { fail: `Not enough in your own account (${money(cost)}).` };
    c.wallet = r2((c.wallet ?? 0) - cost);
    useInvites(c, invitesNow(c).filter((v) => guestsOf(c, v).includes('c:' + id)));
    w.launches.push({ key: 'date', venue: V.id, cids: ['c:' + id], mul: m, done: [] });
    return { text: `Booked: ${vName(V)} with ${f}.${cost ? ` ${money(cost)} from your own account.` : ''}`, launch: { venue: V.id, guests: [guestOf(c, 'c:' + id)], key: 'date', mul: m } };
  },
  hangout: (c, w, m, g, arg) => {
    const H = hangArg(c, arg); if (!H) return { fail: 'Choose an evening: the invitations accepted on your phone show up here.' };
    const { V, cids } = H, why = hangWhy(c, V, cids); if (why) return { fail: `${why}.` };
    const gone = cids.find((x) => !H.inv.some((v) => guestsOf(c, v).includes(x)));
    if (gone) return { fail: `${first(guestOf(c, gone).name)} has not said yes to ${vName(V)} this week.` };
    const cost = V.cost || 0; c.wallet = r2((c.wallet ?? 0) - cost);
    useInvites(c, H.inv);
    w.launches.push({ key: 'hangout', venue: V.id, cids, mul: m, done: [] });
    const guests = cids.map((x) => guestOf(c, x)), who = listOf(guests.map((x) => x.name));
    return { text: `Booked: ${grave(c) ? 'a quiet coffee' : 'an evening'} at ${vName(V)} with ${who}.${cost ? ` ${money(cost)} from your own account.` : ''}`, launch: { venue: V.id, guests, key: 'hangout', mul: m } };
  },
};
/**
 * Fill a slot (arg: an outlet id for a media day; 'celebId|plan or venue' for a date; 'venue|cid,cid' for an evening
 * out): the effects through Morale, PR, Celebs and the team's development queue, the energy spent, the slot used. An
 * evening at a 3D venue is only booked here: launch says what to play ({ venue, guests: [{ kind, id, cid, name, ... }],
 * key: 'date' | 'hangout', mul (this week's share: 1, 0.5, 0) }) and its effects come from Social.hangoutResult once it
 * is played or skipped (c.week.launches remembers it) -> { ok, text, launch (null for everything else) }
 */
export function doActivity(c, key, arg = null) {
  const st = activityState(c, key, arg); if (!st.ok) return { ok: false, text: `${st.why}.`, launch: null };
  const w = weekOf(c), m = st.mul * (key === 'sim' && hurt(c) ? 0.5 : 1);
  const out = DO[key](c, w, m, gainOf(c, w), arg);
  if (out && out.fail) return { ok: false, text: out.fail, launch: null };
  let text = String(out?.text ?? out ?? '');
  if (!st.mul && key !== 'rest') text += ' (A third time this week: there was nothing more in it.)';
  w.energy = clamp(Math.round(w.energy - st.energy), 0, 100); w.used.push({ key, arg, text }); w.counts[key] = (w.counts[key] || 0) + 1;
  return { ok: true, text, launch: out?.launch || null };
}

// ---- the week's end --------------------------------------------------------------------------------------------------
/**
 * Once a round (Career.applyRace, after the round moves on): the contractual sponsor day skipped costs appeal -6
 * (waived while you were hurt), arriving with energy under 30 costs focus -6 ('Running on empty'); then a fresh week
 * for the next round (energy +40) -> { lines }
 */
export function weekRoundTick(c) {
  const lines = [], w = c.week, me = meOf(c);
  if (w && me && me.alive && ago(c, w) <= 1) {
    const wasHurt = w.injured || (me.outUntil != null && me.outUntil >= w.round) || me.returnRound === c.round;
    if (!w.sponsorDone && !wasHurt && c.pr) { c.pr.appeal = clamp((c.pr.appeal ?? 50) - 6, 0, 100); lines.push('You skipped the contractual sponsor day: sponsor appeal -6.'); }
    // (running on empty is checked on race day itself - raceDayCheck - so it shapes the race it was meant for; a race
    // started without that check still pays here, as it always did)
    if (w.emptyLine) lines.push(w.emptyLine);
    else if (!w.emptyChecked && (w.energy ?? 60) < 30) { mood(c, -6, 'Running on empty', 'focus'); lines.push(`Running on empty: ${energyLabel(w.energy).toLowerCase()} by race day (focus -6).`); }
  }
  c.week = freshWeek(c, w ? (w.energy ?? 60) + 40 : 80);
  return { lines };
}
/** 'Exhausted' | 'Tired' | 'Fresh' | 'Buzzing' */
export function energyLabel(e) { return e <= 20 ? 'Exhausted' : e < 45 ? 'Tired' : e < 80 ? 'Fresh' : 'Buzzing'; }
/** 'low' | 'mid' | 'high' (for CSS) */
export function energyBand(e) { return e < 30 ? 'low' : e < 65 ? 'mid' : 'high'; }

// ---- your own money (c.wallet) ---------------------------------------------------------------------------------------
/** $1M of your own money into the team's budget ($3M a round at most) -> { ok, text } */
export function investInTeam(c) {
  const w = weekOf(c), t = c.team, cash = c.wallet ?? 0;
  if (!t) return { ok: false, text: 'No team to invest in.' };
  if ((w.invested || 0) >= 3) return { ok: false, text: 'You have put $3M in this round already: that is the limit.' };
  if (cash < 1) return { ok: false, text: `Not enough in your own account (${money(cash)}).` };
  c.wallet = r2(cash - 1); t.budget = r1(t.budget + 1); w.invested = (w.invested || 0) + 1;
  return { ok: true, text: `$1M of your own money goes into ${t.name}: the budget is now ${money(t.budget)}.` };
}
/** $0.5M of your own money to a good cause, once a round: image +2 (given quietly, with no story, in a grave week) -> { ok, text } */
export function donate(c) {
  const w = weekOf(c), cash = c.wallet ?? 0;
  if (w.donated) return { ok: false, text: 'You have given this round already.' };
  if (cash < 0.5) return { ok: false, text: `Not enough in your own account (${money(cash)}).` };
  c.wallet = r2(cash - 0.5); w.donated = true; charityDone(c);
  if (grave(c)) return { ok: true, text: '$0.5M to charity, given quietly: no announcement.' };
  prDo(c, 'charity', { donation: 0.5 }, { image: 2 });
  return { ok: true, text: `$0.5M to ${pick(CAUSES)}. Word gets round; image +2.` };
}
