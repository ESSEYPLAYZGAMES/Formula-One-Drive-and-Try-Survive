// The after-party, played (WP5): what you do in the room once Hangout (ui/Hangout.js) has built it - the bar and the pace
// you drink at, the table and its bottle service, the DJ, a one-key dance, the step-and-repeat at the door, rounds sent
// over from other tables, the 3 am text, a PG kiss, the drama the night brings and the door at the end of it (with the
// photographers outside). Hangout stays the engine (walking, talking, menus, the cover, the hosted world); this module
// rides on it through a handful of hooks, and hands back R.party for the career (career/Party.js partyResult) to
// settle. Nothing here writes to the career. The words are PartyTalk's (ui/PartyTalk.js: the barks, the moments'
// captions, the phone, the dramas and the loose lines), the rooms PartyVenues' (ui/PartyVenues.js), the crowd and the
// dancers' extra bodies PartyCrowd's (world/PartyCrowd.js).
// Content line (the lead's): realistic adult F1 nightlife as it happens - alcohol and its consequences, revealing but
// realistic clubwear, PG romance with the 12 invented adult stars, handbags scuffles with invented people only. Never
// nudity, sexual content or poses, illegal drugs (not even implied), drink-driving or underage drinking. Real drivers
// attend, toast, dance and network, but are never drunk, never in romance or scandal, and never in a fight.
// Built for the Intel UHD laptop: no light is ever added (the beat washes multiply the room's uniforms), nothing is
// allocated per frame, the drink model and the director run at 10 Hz, and nobody is built once the cover has lifted.
//
// =====================================================================================================================
// PARTYPLAY CONTRACT (WP5, published 2026-10-09 21:25; rev. 22:30 to WP1's launch / R.party, WP2's venue fields, WP3's
// HeroFrames and WP4's x.party; rev. 2026-10-10: R.party adds kissPrivate and minimum and keeps WP1's 'teamcar' exit,
// drama ids are the planner's own - the hook list itself is unchanged since 21:25)
// =====================================================================================================================
//
// Construction - in the Evening constructor, AFTER this.gs, this.x (_context) and this.R exist and BEFORE _dom():
//     if (o.key === 'party') this.party = new PartyPlay(this, o);
//   ev  the Evening. o  the launch (career/Party.js partyLaunch: { key: 'party', partyId, venue, host, brand,
//   contractual, track, city, gp, night, start, close, lastCall, act, carry (act 2: act 1's R.party), travel, me: {
//   name, age, soft, fame, comped, real }, race: RaceSnap, guests, drama }). It builds nothing in 3D and makes no DOM
//   yet; it fills the live side of ev.x.party (PartyTalk's) and opens ev.R.party (WP1's). The evening's clock should
//   start at o.start (act 2 carries the team party's clock on).
//
// Hooks Hangout calls (every one is safe at any time; call each as `this.party?.hook(...)`):
//   steps() -> [fn]        _build, AFTER every person/crowd step is queued: PartyPlay's own one-a-frame build steps
//                          (its HUD, the parade's servers and sparklers, the hero dance frames for at most 2 partners).
//                          Push each onto this.queue (they run behind the cover, before _compile).
//   ready()                _ready, after Hangout's own opening mood: the opening DJ mood, the music, the arrival.
//   update(dt)             once per Evening.update, after _people(dt) and before _tags() (ready, not closing).
//   light()                _tick, right after the `_roomSync()` line - hosted AND unhosted (then it eases the real
//                          sun's colour instead of the ROOM uniforms). Post-multiplies ROOM.hgKey / hgSky by the beat
//                          wash, adds the tipsy camera sway, and trims the name tags (the nearest 5 within 8 m).
//   use(h) -> bool         first thing in _use(h): true = handled. Takes bar, order, table, dj, dance, wall, door (by
//                          h.id: 'side' the side exit, 'lift' the front, else the door menu), garage, blackjack,
//                          drama, and 'photo' in London. 'quiet', 'seat', 'flavour' are left to Hangout.
//   opts(opts, g) -> opts  right before every _showOpts(opts) (the first options and a `then` step): may swap one
//                          option for a loose line (fx.loose, leak) and reorder when drunk (DRUNK tag on the panel).
//   chosen(o, g)           in _choose, right after the fx accounting and BEFORE the reply lines are built: it may
//                          rewrite o.t / o.r (a drunk pick coming out as the loose line) and set o.end (a row ends it);
//                          it acts on PartyTalk's o.act / o.out / fx (dance, kiss, together, provoke, selfie, shoey,
//                          water, calm, clear) once the talk has closed.
//   isPrivate(g) -> bool   in _open: true -> the talk gets no other/others; it also sets x.party.private (true/false).
//   buzzHer() -> g | null  in _buzzPlan/_buzz/_buzzPick in place of this.gs[0] (null: no buzz tonight).
//   key(e) -> bool         in _kd right after the `!this.ready || this.closing` guard: true = taken (Hangout
//                          preventDefaults and returns). Takes KeyC (Who's here), Digit/Numpad 1-2 while a phone or
//                          round card is up, and every key while Who's here is open. KeyC must be in OWN_KEYS.
//   door(auto) -> bool     at the top of _askLeave(auto) (Q, Esc, LEAVE) and at the venue's close: the DOOR menu
//                          (hotel now / side exit / front door / leave with... / breakfast / one more; at the team
//                          party: team car / on to the club / one more). false -> Hangout's own ask.
//   why(g) -> string       optional, for _sub(g) / the tags: the role and why they matter (g.why from the launch first).
//   seal (getter) -> bool  the world outside may be hidden: a sealed venue and you are not on the terrace / vestibule.
//   zone (getter) -> str   PartyVenues' zone name where you stand ('floor' | 'bar' | 'vip' | 'dj' | 'quiet' | ... | '').
//   beat (getter)          { t (beats so far), phase 0..1, pulse 0..1 (1 on the beat), bar 0..3, bpm, mood (index),
//                          energy 0..1 } - on the music's own clock (the club track's, else the audio clock).
//   occupancy (getter)     0..1: the share of the patrons in the room (the clock's fill x the mood's occ): Hangout passes
//                          it to ev.crowd.update(dt, cam, beat.t, occupancy) - Hangout drives the crowd, PartyPlay
//                          only calls crowd.arrive / near / flashes and sets crowd.energy.
//   resultInto(res)        in result(): res.party = R.party (WP1's contract); res.left is 'moveon' for act 2.
//   dispose()              first thing in _dispose.
// Everything else PartyPlay shows is a Hangout-style pseudo-game set on ev.game ({ name, done, result: null, update,
// key, mouse, skip, info, dispose }): the dance strip, the letterboxed moments (arrival, wall, shout-out, parade,
// speech, champagne, shoey, crew, kiss, the exits) and the scuffle (ui/PartyBrawl.js). Hangout already locks walking,
// the camera, tags and paparazzi for a game, routes its keys (Q/Esc -> skip) and drops a null result.
//
// What PartyPlay reads from the Evening (Hangout's own fields): o, c, P (start / late / lastCall / close / sealed /
//   age), V, vid, gs, xs (the extras: resident DJ, security, the reserved antagonist - an array or an object by role),
//   x, R, K, scene (the venue group), cam, host, M, pos, yaw, pitch, bob, clock, t, talk, menu, game, moment, ask, sty,
//   closing, ready, el, $, cover, snd, audio, tagEls, staff, me, meName, myColor, night, trackId, crowd, lib, hots, mus;
//   and calls _free, _look, _camera, _menu, _menuClose, _toast, _bark, _caption, _queue, _finish, _moodSet, _hostLit,
//   _lift, _gscore, _walkOut, _lock, _unlock.
// What it uses of a venue (PartyVenues' contract): zones (via zoneAt / inZone), spots, beat, moods (+ energy, occ, bpm),
//   exits (front, side, street with cam / look), wall (stand, cams), terrace (zone, vestibule), heightAt, booths
//   (booths[0] yours), service, props, led.say, people. A guest g: role, kind, cid, real / fictional, soft, tier
//   ('principal' | 'present' | 'staff' | 'reserved'), why, stage, brand.
// x.party (PartyTalk's) - the live side PartyPlay keeps (10 Hz and as things happen): tier, level, zone, private,
//   clock, late, lastCall, table, comped, parade, shoey, crewThanked, mechanics, speech, danced, flirted, kissed,
//   seenDrunk, drama, dramaCid, photographed, djName (and act, under, loose when not already set).
// Dramas: the launch's plan [{ id, cid, with, after, chance, brawl, real }] with WP1's ids (needle, feud, exnew,
//   dateex, spill, fan, overheard, paps), opened through HangoutTalk.hangoutDrama with the same ids (PartyTalk's
//   PARTY_DRAMA_ALIAS folds older names in; paps is a text from your PR manager, no talk); x.party.drama /
//   dramaCid are set while it is open; escalation (fx.provoke / out 'scuffle') -> the scuffle with a fictional
//   antagonist only, a verbal row with anyone real. R.party.drama[] keeps the plan's id.
// R.party (WP1's contract; this module writes): { act, venue, brand, drinks: [{ kind, at, units }], units, peak, level,
//   pending, clock, water, leftAt (clock h past midnight as 24+; breakfast adds its hour), early, exit ('hotel' |
//   'teamcar' | 'side' | 'front' | 'together:<cid>' | 'breakfast' | 'carried' | 'ejected' | 'moveon'), stumble,
//   photographed, flashes, kiss (cid | null), kissSeen, kissPrivate, kissSeenBy, spend ($M: a booked table's unmet
//   minimum included), minimum (a booked table's, not comped), table, comped, bottle, parade, posed, sideIn, stickers,
//   shout, danced: [{ cid | null, score }], selfies, contacts: { cid: { role, score, dm, talks (actually had), fx,
//   gone, priv } },
//   drama: [{ id, cid, choice, outcome ('calm' | 'cold' | 'row' | 'scuffle' | 'walked'), out }], brawl (only if it came to a
//   scuffle: partyBrawlFx), loose: [{ near, leak, line }], seenDrunkBy, textedEx (celebId | null), shoey, crewThanked,
//   toast, speech, champagne, mechanics, rounds: { took, declined, sent }, blackjack, fans, breakfast, invited,
//   underage, next ('club' on 'moveon', else null), photoUrl / photoRank (the night's best picture of you, a JPEG data
//   URL - a selfie with a star or the influencer, the team's shoey picture; resultInto also sets it as res.photo, which
//   career/Party.js keeps for the morning after) }. Act 2 seeds itself from launch.carry (act 1's R.party: units,
//   drinks, spend, level, pending, peak, contacts, the flags), so act 2's R.party is the whole night.
// =====================================================================================================================
import * as THREE from 'three';
import * as Celebs from '../career/Celebs.js';
import { fameIndex, BRAND_BY_ID } from '../career/PR.js';
import * as HT from './HangoutTalk.js';
import { PARTY_BARK, PARTY_MOMENT, PARTY_PHONE, PARTY_SLIP, PARTY_DRAMA, PARTY_DRAMA_ALIAS } from './PartyTalk.js';
import { zoneAt, inZone } from './PartyVenues.js';
import { HeroFrames } from '../world/PartyCrowd.js';
import { makePerson } from '../world/People.js';
import { PartyBrawl, partyBrawlFx } from './PartyBrawl.js';
import { papsSeen, papsExit, papsDoor, papsNote } from './PapsConfront.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ss = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
const pick = (a) => (Array.isArray(a) ? a[(Math.random() * a.length) | 0] : a);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const firstOf = (s) => String(s || '').trim().split(' ')[0];
const lastOf = (s) => String(s || '').trim().split(' ').pop();
const facing = (dx, dz) => Math.atan2(-dz, dx);
const num = (v, d) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const REDUCED = (() => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches; } catch (_) { return false; } })();
/** a test switch on window (__partyDrunk, __partyBrawl, __partyPaps, __partyFast) -> its value or null */
const flag = (k) => { try { return window[k] ?? null; } catch (_) { return null; } };
const hhmm = (h) => { const m = Math.floor((((h % 24) + 24) % 24) * 60 + 1e-6); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
const money = (m) => m >= 0.001 ? `$${+(m * 1000).toFixed(m >= 0.0095 ? 0 : 1)}k` : `$${Math.max(1, Math.round(m * 1e6))}`;
/** a point in a rect, or in any of a list of rects ({ x0, z0, x1, z1 }) */
const inR = (r, x, z) => !!r && (Array.isArray(r) ? r.some((q) => inR(q, x, z)) : x >= Math.min(r.x0, r.x1) && x <= Math.max(r.x0, r.x1) && z >= Math.min(r.z0, r.z1) && z <= Math.max(r.z0, r.z1));
const mid = (r) => { const a = Array.isArray(r) ? r[0] : r; return a ? { x: (a.x0 + a.x1) / 2, z: (a.z0 + a.z1) / 2 } : null; };
const GP = { lasvegas: 'Las Vegas Grand Prix', silverstone: 'British Grand Prix' };
const STAGE_I = { stranger: 0, met: 1, friendly: 2, flirting: 3, dating: 4, partner: 5, ex: -1 };

// ---- the drinks: real pours (UK units: 10 ml of alcohol) --------------------------------------------------------------
// a champagne flute 1.5, a cocktail 2, a shot 1 (London's 25 ml) or 1.7 (a Vegas pour), a beer 2, a 175 ml glass of
// wine 2.3; water and soft drinks none. Bar prices in $M (a Strip club's; London about 0.6x; the team pays at its own).
const DRINKS = {
  champagne: { name: 'Champagne', units: 1.5, cost: 0.00005 },
  cocktail: { name: 'A cocktail', units: 2, cost: 0.000028 },
  shot: { name: 'A shot', units: 1, vegas: 1.7, cost: 0.00002 },
  beer: { name: 'A beer', units: 2, cost: 0.000016 },
  wine: { name: 'A glass of wine', units: 2.3, cost: 0.000026 },
  water: { name: 'Water', units: 0, cost: 0 },
  soft: { name: 'A soft drink', units: 0, cost: 0.00001 },
};
// the pace: units in the blood (absorbed - eliminated) at which you are merry, tipsy, drunk, past the line
const TIER = [0, 3, 5.5, 8.5, 12];
const TIER_NAME = ['SOBER', 'MERRY', 'TIPSY', 'DRUNK', 'DRUNK'];
const TIER_KEY = ['sober', 'merry', 'tipsy', 'drunk', 'drunk'];
const GLASS = 12;          // the pace glass is full at the line
const ELIM = 1;            // the liver: a unit an hour
const PRICE = { table: 0.01, bottle: 0.003, parade: 0.025, round: 0.001 };
// (a drama's id as the planner (career/Party.js) and PartyTalk both have it - older names folded in)
const talkId = (id) => PARTY_DRAMA_ALIAS?.[id] || id;
// (a drama talk's outcome: PartyTalk's out is already the career's; the fallback trees' older words folded in)
const OUTCOME = { calm: 'calm', cold: 'cold', calmed: 'calm', laughed: 'calm', apology: 'calm', deflected: 'calm', leaked: 'calm', walked: 'walked', side: 'walked', front: 'walked', security: 'walked', row: 'row', scuffle: 'scuffle' };

// ---- the music: the user's own club track (assets/audio/clubmusic.mp3, a 27.3 s loop), its tempo and first downbeat
// measured from the file (onset autocorrelation, low, high and full band all agree: a beat every 0.469 s - 128 bpm - the
// first kick 0.035 s in), so the dance and the lights keep the beat you hear -----------------------------------------
const TRACK = { name: 'clubmusic', bpm: 128, first: 0.035 };
const moodKind = (name) => { const s = String(name || '').toLowerCase(); return /peak|celebrat/.test(s) ? 'peak' : /throw|garage|classic/.test(s) ? 'throw' : /last|wind/.test(s) ? 'last' : 'warm'; };
const MOOD_FX = {
  // (wash: how far the room's key light goes to the wash's colour - at peak time well over half, so skin and clothes take
  //  the room's magenta and blue as they do in any club photograph; the darkness lift on the people keeps faces readable)
  warm: { occ: 0.4, energy: 0.4, wash: 0.24, pulse: 0.05, cols: ['#ff9a4a', '#ff5fa2', '#ffc06a'], strobe: false },
  peak: { occ: 1, energy: 1, wash: 0.58, pulse: 0.2, cols: ['#ff3fb4', '#3fd8ff', '#6b5bff', '#ffb43f'], strobe: true },
  throw: { occ: 0.85, energy: 0.8, wash: 0.38, pulse: 0.14, cols: ['#ffcf6a', '#ff7aa8', '#9a7aff'], strobe: false },
  last: { occ: 0.55, energy: 0.5, wash: 0.42, pulse: 0.08, cols: ['#4a5bff', '#9a4aff', '#3a8aff'], strobe: false },
};
/** a strobe's own colour: a cold white-blue, whatever the wash (never a red full-field flash) */
const STROBE_C = new THREE.Color('#e6eeff');
/** a wash colour, its brightness evened out (a blue wash must not black the room out): linear, ~0.85 luminance */
const washCol = (hex) => { const c = new THREE.Color(hex), L = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b, k = 0.85 / Math.max(0.12, L); return c.setRGB(Math.min(2.2, c.r * k), Math.min(2.2, c.g * k), Math.min(2.2, c.b * k)); };
const WASH = Object.fromEntries(Object.entries(MOOD_FX).map(([k, m]) => [k, m.cols.map(washCol)]));

// ---- a fallback loose line and drama, only when PartyTalk has none for this guest --------------------------------------
const LOOSE = [{ t: `Between us, the car's a pig in the slow stuff.`, leak: true, r: `...Right. I didn't hear that.` }, { t: `Honestly? I'd sign for them tomorrow.`, leak: true, r: `Careful. People talk.` }, { t: `I love this team. I love everyone. Who's buying?`, leak: false, r: `Not you, clearly.` }];
const DRAMA_FALLBACK = {
  spill: { say: `Whoa - sorry, mate. Oh. You're that driver, aren't you?`, opts: [{ t: `No harm done. Enjoy your night.`, tone: 'kind', r: `Yeah... cheers. Sorry again.`, out: 'calmed' }, { t: `Watch where you're going.`, tone: 'firm', r: `Alright, alright. Relax.`, out: 'calmed' }, { t: `That shirt cost more than your night out, you clown.`, tone: 'cruel', fx: ['provoke'], r: `What did you just call me?`, out: 'scuffle' }, { t: `[Walk off to the bar]`, tone: 'leave', r: `Yeah, go on. Superstar.`, out: 'walked' }] },
  dateex: { say: `So you're the new one. She'll get bored of you too, mate.`, opts: [{ t: `[Laugh it off] Have a good night.`, tone: 'light', r: `...Whatever.`, out: 'laughed' }, { t: `She's with me tonight. Leave it.`, tone: 'firm', r: `For now.`, out: 'calmed' }, { t: `At least I'm not the one still following her round parties.`, tone: 'cruel', fx: ['provoke'], r: `Say that again. Go on.`, out: 'scuffle' }, { t: `[Walk away]`, tone: 'leave', r: `That's right, walk.`, out: 'walked' }] },
  exnew: { say: `So you're the driver. No hard feelings, yeah? She's with me now.`, opts: [{ t: `No hard feelings. Look after her.`, tone: 'kind', r: `...Yeah. I will.`, out: 'calmed' }, { t: `Give it a month.`, tone: 'cruel', fx: ['provoke'], r: `What's that supposed to mean?`, out: 'scuffle' }, { t: `[Walk away]`, tone: 'leave', r: '', out: 'walked' }] },
  fan: { say: `Mate! MATE. One photo, come on, my brother loves you -`, opts: [{ t: `Go on then, quick one.`, tone: 'kind', r: `Legend. Absolute legend.`, fx: ['selfie'], out: 'calmed' }, { t: `Not now, sorry. Enjoy the night.`, tone: 'firm', r: `Oh, come on...`, out: 'calmed' }, { t: `Get your hand off me.`, tone: 'cold', fx: ['provoke'], r: `Whoa. Who do you think you are?`, out: 'scuffle' }] },
  needle: { say: `Turn one. Do you want to explain that, or shall I?`, opts: [{ t: `[Laugh] Racing incident. Buy you a drink?`, tone: 'light', r: `...Go on, then. But you owe me.`, out: 'laughed' }, { t: `Fair. That one's on me. Sorry.`, tone: 'sorry', r: `Appreciated.`, out: 'apology' }, { t: `You left the door open. Learn to defend.`, tone: 'cold', fx: ['provoke'], r: `Right. See you on track, then.`, out: 'row' }, { t: `[Walk away]`, tone: 'leave', r: `Yeah. Typical.`, out: 'walked' }] },
  feud: { say: `Are we going to talk about the call today, or pretend it didn't happen?`, opts: [{ t: `Let's clear the air. I'd have been furious too.`, tone: 'kind', fx: ['clear'], r: `...Okay. Thanks for saying it.`, out: 'calmed' }, { t: `It was the team's call, not mine.`, tone: 'firm', r: `You didn't exactly argue.`, out: 'calmed' }, { t: `You'd have done exactly the same.`, tone: 'cold', fx: ['provoke'], r: `Don't. Just don't.`, out: 'row' }] },
  overheard: { say: `Did I just hear what I think I heard? That's a story, you know.`, opts: [{ t: `Off the record. Please.`, tone: 'sorry', r: `...Fine. You owe me one.`, out: 'calm', quote: false }, { t: `[Laugh] I say a lot of things at this time of night.`, tone: 'light', r: `You do. I write some of them down.`, out: 'calm', quote: true }, { t: `[Walk away]`, tone: 'leave', r: '', out: 'walked', quote: true }] },
};
const fxOf = (a) => { if (!a) return undefined; const o = {}; for (const k of [].concat(a)) o[k] = true; return o; };

// =====================================================================================================================
// the music: Hangout plays the club's track and its crowd under every mood (_moodSet: assets/audio clubmusic and
// clubcrowd, its own handles ev.mus / ev.crowdBed); this follows them - the beat on the track's own <audio> clock, so
// the dance and the lights keep the beat you hear; ducked about 6 dB while you talk, muffled through the doors outside.
// A synthesised 4/4 only when there is no track to play (the file missing, or it will not load).
// =====================================================================================================================
class ClubMusic {
  constructor(ev, o) {
    const A = ev.audio; this.ev = ev; this.A = A && A.ready && A.ctx ? A : null; this.o = o; this.bpm = o.bpm; this.lvl = o.level; this.cl = o.crowd;
    this.t = 0; this.loops = 0; this.lastT = null; this.el0 = null; this.duck = 1; this.muf = 0; this.on = false; this.synth = null; this.h0 = null; this.c0 = null; this.chk = 0;
    this.t0p = performance.now() / 1000;
  }
  /** Hangout's live handles (a mood change may replace them) */
  get mus() { const m = this.ev.mus; return m && !m.stopped && /club/.test(String(this.ev.musName || '')) ? m : null; }
  get crowd() { const m = this.ev.crowdBed; return m && !m.stopped ? m : null; }
  start() { this.on = true; this._check(); }
  /** a track that cannot play (a missing file, an error): the synthesised bed instead; a track back: the bed off */
  _check() {
    if (!this.on) return; const m = this.mus, bad = !m || !!m.el?.error, want = bad && !!this.A && this.ev.V?.moods?.[this.ev.moodI]?.music !== null;
    if (want && !this.synth) { this.synth = new ClubBed(this.A, this.o.bpm); this.synth.start(this.lvl * 0.7); this.duck = -1; }
    else if (!want && this.synth) { this.synth.stop(); this.synth = null; }
  }
  /** beats so far: the track's element clock (a smooth clock eased onto it), else the synth's audio clock, else the page's */
  beats(dt) {
    if ((this.chk += dt) > 0.5) { this.chk = 0; this._check(); }
    const el = this.mus?.el;
    if (el && !el.paused && el.readyState >= 2 && !el.error) {
      if (el !== this.el0) { this.el0 = el; this.loops = 0; this.lastT = null; this.duck = -1; this.b = null; }
      const T = el.currentTime, D = el.duration, k = TRACK.bpm / 60;
      if (this.lastT != null && T < this.lastT - 1 && Number.isFinite(D)) this.loops++;   // (the loop came round)
      this.lastT = T;
      // (the beat on the track's own grid: each time round the loop it starts again from its first downbeat, so a loop
      // that is not a whole number of beats skips the remainder - as the music does; a smooth count eased onto it)
      const per = Number.isFinite(D) ? Math.ceil((D - TRACK.first) * k) : 0, tb = this.loops * per + (T - TRACK.first) * k;
      if (this.b == null) this.b = tb; else { this.b += dt * k; const err = tb - this.b; this.b = Math.abs(err) > 0.5 ? tb : this.b + err * 0.12; }
      this.bpm = TRACK.bpm; return Math.max(0, this.b);
    }
    if (this.synth) { this.synth.pump(); this.bpm = this.synth.bpm; return this.synth.beats(); }
    this.bpm = this.o.bpm; return Math.max(0, (performance.now() / 1000 - this.t0p) * this.bpm / 60);
  }
  mix(duck, muf) {
    const m = this.mus, c = this.crowd;
    if (!this.on || (m === this.h0 && c === this.c0 && Math.abs(duck - this.duck) < 0.01 && Math.abs(muf - this.muf) < 0.01)) return; this.duck = duck; this.muf = muf; this.h0 = m; this.c0 = c;
    m?.to?.(this.lvl * duck * (1 - 0.55 * muf), 0.3); c?.to?.(this.cl * (1 - 0.6 * muf) * (0.7 + 0.3 * duck), 0.4); this.synth?.mix(duck, muf);
  }
  /** the synthesised bed off (the track and the crowd are Hangout's: it stops them as the evening closes) */
  stop() { if (!this.on) return; this.on = false; this.synth?.stop(); this.synth = null; }
}
// (the fallback: a 4/4 - kick, hats, clap, offbeat bass, a pad - scheduled ~120 ms ahead on the audio clock)
const CHORDS = [[110, 130.81, 164.81], [87.31, 110, 130.81], [130.81, 164.81, 196], [98, 123.47, 146.83]];   // Am F C G
class ClubBed {
  constructor(A, bpm) {
    this.A = A; this.bpm = bpm; this.step = 0; this.next = 0; this.lvl = 0.25; this.on = false; this.duck = 1; this.muf = 0; this.t0p = performance.now() / 1000;
    const x = this.x = A.ctx; this.out = x.createGain(); this.out.gain.value = 0; this.lp = x.createBiquadFilter(); this.lp.type = 'lowpass'; this.lp.frequency.value = 18000;
    this.lp.connect(this.out); this.out.connect(A.sfx || x.destination);
    const n = x.sampleRate, b = x.createBuffer(1, n, n), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.nb = b;
  }
  start(level) { this.lvl = level; this.on = true; const x = this.x; this.t0 = x.currentTime + 0.12; this.next = this.t0; this.step = 0; this.out.gain.setTargetAtTime(level, x.currentTime, 0.9); }
  beats() { return this.t0 != null && this.x.state === 'running' ? Math.max(0, (this.x.currentTime - this.t0) * this.bpm / 60) : Math.max(0, (performance.now() / 1000 - this.t0p) * this.bpm / 60); }
  mix(duck, muf) { const t = this.x.currentTime; this.out.gain.setTargetAtTime(this.lvl * duck * (1 - 0.45 * muf), t, 0.25); this.lp.frequency.setTargetAtTime(18000 - 17400 * muf, t, 0.3); }
  pump() {
    if (!this.on) return; const x = this.x, sp = 60 / this.bpm / 4;
    if (this.next < x.currentTime - 0.25) { const k = Math.ceil((x.currentTime - this.next) / sp); this.next += k * sp; this.step += k; }
    while (this.next < x.currentTime + 0.12) { if (!this.A.muted) this._note(this.step, this.next); this.next += sp; this.step++; }
  }
  _note(s, t) {
    const q = s % 16, ch = CHORDS[Math.floor(s / 16) % 4];
    if (q % 4 === 0) this._kick(t); if (q === 4 || q === 12) this._noise(t, 1800, 0.13, 0.2, 'bandpass'); if (q % 4 === 2) this._noise(t, 7500, 0.07, 0.1, 'highpass');
    if (q % 4 === 2) this._tone(t, ch[0] / 2, 60 / this.bpm * 0.22, 0.18, 'sawtooth', 320); if (q === 0) for (const f of ch) this._tone(t, f, 60 / this.bpm * 4, 0.03, 'sawtooth', 1200);
  }
  _kick(t) { const x = this.x, o = x.createOscillator(), g = x.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.12); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.85, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34); o.connect(g); g.connect(this.lp); o.start(t); o.stop(t + 0.36); }
  _noise(t, f, dur, v, type) { const x = this.x, s = x.createBufferSource(), fl = x.createBiquadFilter(), g = x.createGain(); s.buffer = this.nb; fl.type = type; fl.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(fl); fl.connect(g); g.connect(this.lp); s.start(t, Math.random() * 0.8); s.stop(t + dur + 0.02); }
  _tone(t, f, dur, v, type, cut) { const x = this.x, o = x.createOscillator(), fl = x.createBiquadFilter(), g = x.createGain(); o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = cut; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.2, dur * 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(fl); fl.connect(g); g.connect(this.lp); o.start(t); o.stop(t + dur + 0.02); }
  stop() { if (!this.on) return; this.on = false; this.out.gain.setTargetAtTime(0, this.x.currentTime, 0.3); const out = this.out; setTimeout(() => { try { out.disconnect(); } catch (_) { /* */ } }, 1500); }
}

// =====================================================================================================================
// the pseudo-games (Hangout's game shape): a letterboxed moment, and the dance
// =====================================================================================================================
class Moment {
  /** o: { id, caption, dur, min (s before a key ends it), flashes: [s], cam(t, m) (the camera, venue frame), start(m), tick(t, dt, m), then() (after it, next frame), dispose() } */
  constructor(pp, o) {
    this.pp = pp; this.ev = pp.ev; this.o = o; this.name = 'moment'; this.done = false; this.result = null; this.t = 0; this.dur = o.dur || 3.5; this.min = o.min ?? 1.2; this.fl = (o.flashes || []).slice().sort((a, b) => a - b);
    const ev = this.ev; ev._unlock?.(); ev.keys?.clear(); ev.$?.('.hg-bars')?.classList.add('in'); if (o.caption) ev._caption?.(o.caption);
    try { o.start?.(this); } catch (e) { console.warn('PartyPlay: a moment could not start', e); }
  }
  update(dt) {
    if (this.done) return; this.t += dt; const o = this.o;
    try { if (o.cam) o.cam(this.t, this); else this.ev._camera(dt); o.tick?.(this.t, dt, this); } catch (e) { console.warn('PartyPlay: a moment failed', e); this.t = this.dur; }
    while (this.fl.length && this.t >= this.fl[0]) { this.fl.shift(); const A = o.flashAt; this.pp._flashDom(A?.length ? A[(this.nf = (this.nf || 0) + 1) % A.length] : null); }
    if (this.t >= this.dur) this._end();
  }
  _end() { if (this.done) return; this.done = true; const ev = this.ev; ev.$?.('.hg-bars')?.classList.remove('in'); ev._caption?.(null); if (this.o.then) this.pp.after.push(this.o.then); }
  key(c, down) { if (down && this.t > this.min && (c === 'Space' || c === 'KeyE' || c === 'Enter' || c === 'NumpadEnter')) this._end(); }
  skip() { if (this.t > this.min) this._end(); }
  mouse() {}
  info() { return { moment: this.o.id || 'moment', t: +this.t.toFixed(2) }; }
  dispose() { if (!this.done) { this.done = true; this.ev.$?.('.hg-bars')?.classList.remove('in'); this.ev._caption?.(null); } try { this.o.dispose?.(); } catch (_) { /* gone */ } }
}

const GRADES = [['PERFECT', 1, 'gold'], ['GREAT', 0.8, 'good'], ['GOOD', 0.55, 'good'], ['OFF', 0, 'bad']];
const DANCE_SEQ = ['dance1', 'dance2', 'dance1', 'dance3'];
class Dance {
  /** 20 s on the beat: Space (or E) as each beat lands; with g, they dance with you (their own extra bodies on the beat) */
  constructor(pp, g) {
    this.pp = pp; this.ev = pp.ev; this.g = g || null; this.name = 'dance'; this.done = false; this.result = null; this.t = 0; this.dur = flag('__partyFast') ? 4 : 20;
    const tier = pp.tier, k = tier >= 3 ? 0.72 : tier === 1 ? 1.1 : 1, kp = tier >= 3 ? 0.8 : 1;   // (merry: the window 10% wider; drunk: narrower)
    this.win = [0.04 * kp, 0.075 * kp, 0.13 * k];
    this.b0 = Math.floor(pp.beat.t) + 1; this.hits = new Map(); this.miss = new Set(); this.sum = 0; this.n = 0; this.lastK = -1;
    const ev = this.ev; ev._unlock?.(); ev.keys?.clear();
    // (their glass put down while they dance: it hangs off the standing pose's hand)
    const P = this.g?.person; if (P) { this.y0 = P.group.position.y; this.r0 = P.group.rotation.y; this.bow0 = P.bow; this.hf = pp.hf.get(this.g) || null; this.dk = this.g.drink || null; if (this.dk) this.dk.visible = false; }
    pp._danceDom(true, this.g ? `Dancing with ${this.g.first}` : 'Dancing');
    if (this.g) this.ev._bark?.(this.g, pp._say('dance.ask'), 1.6);
  }
  update(dt) {
    if (this.done) return; this.t += dt; const pp = this.pp, B = pp.beat, bt = B.t, sp = 60 / (B.bpm || 124), ev = this.ev;
    for (let k = this.b0; k <= bt - this.win[2] / sp; k++) if (!this.hits.has(k) && !this.miss.has(k)) { this.miss.add(k); this.n++; }   // (beats that went by unpressed: off)
    const bob = REDUCED ? 0 : 0.03 * Math.abs(Math.sin(Math.PI * B.phase)), P = ev.pos, gp = this.g?.person;
    // (a partner with dance bodies of her own is the one you watch; anyone else dances at your side, out of the shot - the
    //  floor and the lights ahead - never a body standing still in front of you on a dancing floor)
    if (gp && this.hf) {
      const p = gp.group.position; ev._look(pp._v1.set(P.x, P.y + bob, P.z), pp._v2.set(p.x, 1.5 + (p.y || 0), p.z));
      const k = Math.floor(bt); if (k !== this.lastK) { this.lastK = k; if (this.hf) { this.hf.show(DANCE_SEQ[((k % 4) + 4) % 4]); if (typeof this.hf.bow === 'number') gp.bow = this.hf.bow; } }
      gp.group.position.y = this.y0 + (REDUCED ? 0 : 0.022 * Math.abs(Math.sin(Math.PI * B.phase)));
      gp.group.rotation.y = this.r0 + (REDUCED ? 0 : 0.09 * Math.sin(Math.PI * bt / 2));
    } else {
      const cp = Math.cos(ev.pitch); ev._look(pp._v1.set(P.x, P.y + bob, P.z), pp._v2.set(P.x + Math.cos(ev.yaw) * cp, P.y + bob + Math.sin(ev.pitch), P.z + Math.sin(ev.yaw) * cp));
      if (gp) { gp.group.position.y = this.y0 + (REDUCED ? 0 : 0.022 * Math.abs(Math.sin(Math.PI * B.phase))); gp.group.rotation.y = this.r0 + (REDUCED ? 0 : 0.12 * Math.sin(Math.PI * bt / 2)); }
    }
    pp._danceTick(this, bt, dt);
    if (this.t >= this.dur) this._end();
  }
  _hit() {
    const B = this.pp.beat, sp = 60 / (B.bpm || 124), k = Math.round(B.t); if (k < this.b0 || this.hits.has(k) || this.miss.has(k)) return;
    const err = Math.abs(B.t - k) * sp, gi = err <= this.win[0] ? 0 : err <= this.win[1] ? 1 : err <= this.win[2] ? 2 : 3;
    this.hits.set(k, gi); this.n++; this.sum += GRADES[gi][1]; this.pp._danceGrade(GRADES[gi]);
    if (gi < 3) this.ev.snd?.tone?.(gi === 0 ? 1320 : 990, 0.06, 0.025, 'sine');
  }
  score() { return this.n ? clamp(this.sum / this.n, 0, 1) : 0; }
  _restore() { const gp = this.g?.person; if (!gp) return; try { this.hf?.show(null); } catch (_) { /* */ } gp.bow = this.bow0; gp.group.position.y = this.y0; gp.group.rotation.y = this.r0; if (this.dk) this.dk.visible = true; }
  _end() { if (this.done) return; this.done = true; this._restore(); this.pp._danceDom(false); const g = this.g, s = this.score(), k = !!this.counted; this.pp.after.push(() => this.pp._danced(g, s, k)); }
  key(c, down) { if (down && (c === 'Space' || c === 'KeyE' || c === 'Enter')) this._hit(); }
  skip() { this._end(); }
  mouse() {}
  info() { return { dance: this.g?.cid || null, t: +this.t.toFixed(2), score: +this.score().toFixed(2), hits: this.hits.size, beats: this.n }; }
  dispose() { if (!this.done) { this.done = true; this._restore(); this.pp._danceDom(false); } }
}

// =====================================================================================================================
// the page: pace glass, closing notice, Who's here, the dance strip, the phone / round card, DRUNK on the talk panel
// =====================================================================================================================
const CSS = `
#hangout .pp-glass { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 72px; box-sizing: border-box; padding: 9px 4px 7px; background: rgba(8,10,16,.58); border-radius: 8px; display: flex; flex-direction: column; align-items: center; gap: 5px; pointer-events: none; opacity: 0; transition: opacity .26s; }
#hangout .pp-glass.in { opacity: 1; }
#hangout .pp-glass .g { position: relative; width: 40px; height: 160px; box-sizing: border-box; border: 2px solid rgba(255,255,255,.6); border-top: 0; border-radius: 0 0 13px 13px; background: rgba(10,12,18,.55); overflow: hidden; }
#hangout .pp-glass .g i { position: absolute; left: 0; right: 0; bottom: 0; height: 100%; transform-origin: bottom; transform: scaleY(0); transition: transform .4s ease; }
#hangout .pp-glass .g i.p { background: rgba(245,206,110,.32); }
#hangout .pp-glass .g i.f { background: linear-gradient(#f7d77a, #e3a52a); }
#hangout .pp-glass .g u { position: absolute; left: 0; width: 9px; height: 2px; background: rgba(255,255,255,.75); text-decoration: none; }
#hangout .pp-glass b { font: 900 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #e8ebf0; text-shadow: 0 1px 3px #000; }
#hangout .pp-glass b.t1 { color: #6cd08f; } #hangout .pp-glass b.t2 { color: #f5c04a; } #hangout .pp-glass b.t3 { color: #ff7a6a; }
#hangout .pp-glass small { font: 600 10.5px/1.3 'Segoe UI', Arial, sans-serif; color: #c9ced8; text-align: center; white-space: nowrap; text-shadow: 0 1px 3px #000; }
#hangout .pp-close { position: absolute; left: 22px; top: 54px; background: rgba(10,12,18,.88); border-left: 3px solid var(--hc); padding: 4px 9px; font: 800 10.5px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #e8ebf0; opacity: 0; transition: opacity .26s; }
#hangout .pp-close.in { opacity: 1; }
#hangout .pp-card { position: absolute; left: 96px; top: 50%; transform: translate(-12px, -50%); width: min(280px, calc(100vw - 120px)); background: rgba(12,14,20,.95); border: 1px solid rgba(255,255,255,.14); border-left: 3px solid var(--pc, #f5b400); border-radius: 10px; padding: 11px 12px; box-sizing: border-box; opacity: 0; transition: opacity .2s, transform .2s; pointer-events: none; box-shadow: 0 12px 34px rgba(0,0,0,.5); }
#hangout .pp-card.in { opacity: 1; transform: translate(0, -50%); pointer-events: auto; }
#hangout .pp-card header { font: 800 10.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; color: #8c93a0; text-transform: uppercase; }
#hangout .pp-card p { margin: 7px 0 9px; font: 500 14px/1.35 'Segoe UI', Arial, sans-serif; }
#hangout .pp-card div { display: flex; gap: 6px; }
#hangout .pp-card button { flex: 1; background: rgba(255,255,255,.06); color: #fff; border: 1px solid rgba(255,255,255,.16); border-radius: 7px; padding: 7px 6px; font: 700 12px/1.2 'Segoe UI', Arial, sans-serif; cursor: pointer; }
#hangout .pp-card button:hover { background: rgba(255,255,255,.14); }
#hangout .pp-card s { display: block; height: 3px; margin-top: 8px; border-radius: 2px; background: rgba(255,255,255,.14); overflow: hidden; text-decoration: none; }
#hangout .pp-card s u { display: block; height: 100%; background: #fff; transform-origin: left; text-decoration: none; }
#hangout .pp-who { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -47%); width: min(600px, calc(100vw - 32px)); background: rgba(12,14,20,.96); border: 1px solid rgba(255,255,255,.14); border-radius: 12px; padding: 14px 16px 10px; box-sizing: border-box; opacity: 0; transition: opacity .18s, transform .18s; pointer-events: none; box-shadow: 0 16px 44px rgba(0,0,0,.6); }
#hangout .pp-who.in { opacity: 1; transform: translate(-50%, -50%); pointer-events: auto; }
#hangout .pp-who h3 { margin: 0 0 8px; display: flex; justify-content: space-between; font: 900 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; color: var(--hc); text-transform: uppercase; }
#hangout .pp-who h3 span { color: #8c93a0; letter-spacing: .08em; }
#hangout .pp-who ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; min-height: 290px; }
#hangout .pp-who li { display: grid; grid-template-columns: 30px 1fr auto; gap: 10px; align-items: center; background: rgba(255,255,255,.04); border-radius: 8px; padding: 7px 10px; }
#hangout .pp-who li i { width: 30px; height: 30px; border-radius: 50%; background: var(--c, #3a4150); display: flex; align-items: center; justify-content: center; font: 900 12px/1 'Segoe UI', Arial, sans-serif; font-style: normal; }
#hangout .pp-who li b { display: block; font: 700 14px/1.2 'Segoe UI', Arial, sans-serif; }
#hangout .pp-who li small { display: block; font: 500 12px/1.3 'Segoe UI', Arial, sans-serif; color: #aeb5c2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 380px; }
#hangout .pp-who li em { font: 700 11px/1.3 'Segoe UI', Arial, sans-serif; font-style: normal; color: #c9ced8; text-align: right; white-space: nowrap; }
#hangout .pp-who li em u { display: block; text-decoration: none; color: #6cd08f; font-weight: 600; }
#hangout .pp-who footer { margin-top: 8px; text-align: right; font: 600 11px/1 'Segoe UI', Arial, sans-serif; color: #7d8592; letter-spacing: .08em; }
#hangout .pp-dance { position: absolute; left: 50%; bottom: 26px; width: min(480px, calc(100vw - 32px)); height: 72px; transform: translate(-50%, 12px); background: rgba(12,14,20,.92); border: 1px solid rgba(255,255,255,.14); border-radius: 10px; box-sizing: border-box; opacity: 0; transition: opacity .2s, transform .2s; overflow: hidden; }
#hangout .pp-dance.in { opacity: 1; transform: translate(-50%, 0); }
#hangout .pp-dance header { position: absolute; left: 12px; top: 8px; right: 12px; display: flex; justify-content: space-between; font: 800 10.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #c9ced8; text-transform: uppercase; }
#hangout .pp-dance header span { color: #7d8592; }
#hangout .pp-dance .lane { position: absolute; left: 12px; right: 12px; top: 26px; height: 28px; border-radius: 14px; background: rgba(255,255,255,.05); overflow: hidden; }
#hangout .pp-dance .hit { position: absolute; left: 22%; top: 2px; width: 24px; height: 24px; margin-left: -12px; border-radius: 50%; border: 2px solid rgba(255,255,255,.8); box-sizing: border-box; }
#hangout .pp-dance .dot { position: absolute; left: 0; top: 7px; width: 14px; height: 14px; margin-left: -7px; border-radius: 50%; background: var(--hc); box-shadow: 0 0 8px var(--hc); will-change: transform; }
#hangout .pp-dance .gr { position: absolute; left: 22%; top: 28px; transform: translateX(-50%); font: 900 13px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; opacity: 0; transition: opacity .3s; }
#hangout .pp-dance .gr.gold { color: #ffd34d; } #hangout .pp-dance .gr.good { color: #41e07a; } #hangout .pp-dance .gr.bad { color: #ff6a5a; }
#hangout .pp-dance s { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(255,255,255,.12); text-decoration: none; }
#hangout .pp-dance s u { display: block; height: 100%; background: #fff; transform-origin: left; text-decoration: none; }
#hangout .pp-drunk { position: absolute; left: 18px; bottom: 6px; background: #e5484d; color: #fff; border-radius: 4px; padding: 1px 7px; font: 900 9.5px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; display: none; pointer-events: none; }
#hangout .hg-talk.pp-isdrunk .pp-drunk { display: block; }
#hangout .hg-talk.pp-drama { border-top: 3px solid #e5484d; }
#hangout .hg-talk.pp-swim .opts button span { animation: ppswim 2.6s ease-in-out infinite alternate; }
#hangout .hg-talk.pp-swim .opts button:nth-child(2n) span { animation-delay: -1.3s; }
@keyframes ppswim { from { transform: translateX(-2px) skewX(-1.5deg); } to { transform: translateX(3px) skewX(1.5deg); } }
@media (prefers-reduced-motion: reduce) { #hangout .hg-talk.pp-swim .opts button span { animation: none; } }
@media (max-height: 560px) { #hangout .pp-glass .g { height: 120px; } #hangout .pp-who ol { min-height: 250px; } #hangout .pp-who li { padding: 5px 9px; } }
`;

// =====================================================================================================================
// PartyPlay
// =====================================================================================================================
/** the after-party's play layer (see the contract above) */
export class PartyPlay {
  constructor(ev, o = {}) {
    this.ev = ev; this.o = o || {}; this.on = true; this.after = []; this.acc = 0; this.hf = new Map(); this.hfSteps = [];
    this._v1 = new THREE.Vector3(); this._v2 = new THREE.Vector3(); this._wk = new THREE.Color(1, 1, 1); this._ws = new THREE.Color(1, 1, 1); this._wc = new THREE.Color(); this._tg = [];
    const c = ev.c || null, P = ev.P || {}, race = this.o.race || c?.party?.race || {}, me = this.o.me || {};
    this.vid = ev.vid || String(this.o.venue?.id || this.o.venue || ''); this.club = /club/.test(this.vid); this.team = this.vid === 'teamparty'; this.london = this.vid === 'londonclub'; this.vegas = this.vid === 'vegasclub';
    this.act = this.o.act || 1; this.brand = this.o.brand || null; this.race = race; this.track = this.o.track || race.track || ev.trackId || null;
    // (the venue's hours, in the clock's own run: after midnight carries on past 24)
    const s0 = num(+P.start, num(+this.o.start, 23)); this.s0 = s0;
    this.start = Number.isFinite(+this.o.start) ? this._un(+this.o.start, s0) : s0; this.late = this._un(this.o.late ?? P.late, s0 + 3); this.close = this._un(this.o.close ?? P.close, this.late + 1);
    const lc = this.o.lastCall !== undefined ? this.o.lastCall : P.lastCall; this.lastCall = lc != null ? this._un(lc, null) : null;
    this.underage = !!(me.soft ?? this.o.underage ?? false);
    // (you as a real driver: never shown drunk - the bar pours water past tipsy, no stumble on the way out, a row stays words)
    this.realMe = !!me.real;
    let fame = num(me.fame, null); if (fame == null) { try { fame = c?.pr ? fameIndex(c.pr.fame ?? 0.4) : 40; } catch (_) { fame = 40; } } this.fame = fame;
    this.price = this.team ? 0 : this.london ? 0.6 : 1;
    // (the drink model: serves still being absorbed, what is done, what the liver has taken)
    this.serves = []; this.absDone = 0; this.elim = 0; this.level = 0; this.pending = 0; this.peak = 0; this.tier = 0; this.lastClock = null; this.waterTill = -1;
    this.zoneK = ''; this.outside = false; this.moodI = -1; this.moodK = 'warm'; this.reqAt = -9; this.B = { t: 0, phase: 0, pulse: 0, bar: 0, bpm: 124, mood: 0, energy: 0.4 };
    this.card = null; this.who = null; this.whoPage = 0; this.drama = null; this.pend = []; this.exiting = null; this.brawl = null; this.ant = null; this.revealT = null; this.arrived = false; this.doorAuto = 0;
    this.seenDrunk = new Set(); this.flags = {}; this.repLeaving = new Map(); this.plan = []; this.roundsAt = [];
    const R = ev.R || (ev.R = {});
    const Rp = this.Rp = R.party = { act: this.act, venue: this.vid, brand: this.brand, drinks: [], units: 0, peak: 0, level: 0, pending: 0, clock: this.start, water: 0, leftAt: null, early: false, exit: null, stumble: false, photographed: false, flashes: 0,
      kiss: null, kissSeen: false, kissPrivate: false, kissSeenBy: [], spend: 0, table: false, comped: false, bottle: 0, parade: false, posed: false, sideIn: false, stickers: false, shout: false, danced: [], selfies: 0, contacts: {}, drama: [], brawl: null,
      loose: [], seenDrunkBy: [], textedEx: null, shoey: false, crewThanked: false, toast: false, speech: false, champagne: false, mechanics: false, rounds: { took: 0, declined: 0, sent: 0 }, blackjack: null, fans: false, breakfast: null, invited: [], underage: this.underage, next: null };
    // (act 2: the night so far carries on - act 1's R.party: what is in the blood and still to come through, the money, the people, the flags)
    const C = this.o.carry && typeof this.o.carry === 'object' ? this.o.carry : null;
    if (C) {
      this.absDone = Math.max(0, num(+C.level, 0)); this.peak = Math.max(0, num(+C.peak, 0)); if (num(+C.pending, 0) > 0) this.serves.push({ units: +C.pending, at: this.start, ab: 0.75 });
      Rp.units = num(+C.units, 0); Rp.drinks = Array.isArray(C.drinks) ? C.drinks.slice() : []; Rp.spend = num(+C.spend, 0); Rp.water = num(+C.water, 0); Rp.flashes = num(+C.flashes, 0); Rp.selfies = num(+C.selfies, 0);
      for (const k of ['shoey', 'crewThanked', 'toast', 'speech', 'champagne', 'mechanics', 'posed', 'shout', 'textedEx', 'kiss', 'kissSeen', 'kissPrivate', 'photographed', 'stumble']) if (C[k]) Rp[k] = C[k];
      for (const k of ['danced', 'drama', 'loose', 'kissSeenBy', 'invited']) if (Array.isArray(C[k])) Rp[k] = C[k].slice();
      if (C.rounds) Rp.rounds = { ...Rp.rounds, ...C.rounds };
      if (typeof C.photoUrl === 'string') { Rp.photoUrl = C.photoUrl; this.photoRank = num(+C.photoRank, 1); Rp.photoRank = this.photoRank; }
      for (const id of Array.isArray(C.seenDrunkBy) ? C.seenDrunkBy : []) this.seenDrunk.add(id);
      this.carried = C.contacts && typeof C.contacts === 'object' ? C.contacts : null; Rp.act = 2;
    }
    // (the talk's context: PartyTalk's x.party, its race side filled by hangoutEvening; the live side is kept here)
    const X = ev.x || (ev.x = {}), XP = X.party || (X.party = {});
    const set = (k, v) => { if (XP[k] === undefined) XP[k] = v; };
    set('venue', this.vid); set('act', Rp.act); set('brand', this.brand); set('contractual', !!this.o.contractual); set('under', this.underage);
    set('pos', race.pos ?? null); set('won', !!race.won); set('podium', !!race.podium); set('dnf', !!race.dnf); set('fought', race.fought ?? null);
    Object.assign(XP, { tier: 'sober', level: 0, zone: '', private: false, clock: this.start, late: false, lastCall: false, table: !!Rp.table, comped: !!Rp.comped, parade: !!Rp.parade, shoey: !!Rp.shoey, crewThanked: !!Rp.crewThanked, mechanics: !!Rp.mechanics, speech: !!Rp.speech,
      danced: Rp.danced.map((d) => d?.cid).filter(Boolean), flirted: [], kissed: Rp.kiss || null, seenDrunk: false, drama: null, dramaCid: null, photographed: !!Rp.photographed, djName: null, loose: Rp.loose.length > 0 });
    this.XP = XP;
    try { window.__partyPlay = this; } catch (_) { /* (no window) */ }
  }
  /** an hour of the venue's into the clock's own run */
  _un(h, d) { const v = Number.isFinite(+h) && h !== null ? +h : d; return v != null && v < this.s0 - 6 ? v + 24 : v; }
  /** the night's timetable, from the clock as it opened: the drama plan (at most two), rounds sent over */
  _schedule() {
    const span = Math.max(0.6, this.late - this.start);
    this.plan = (Array.isArray(this.o.drama) ? this.o.drama : []).filter(Boolean).slice(0, 2).map((d, i) => {
      const D = typeof d === 'string' ? { id: d } : { ...d }, a = Number.isFinite(+D.after) ? this._un(+D.after, this.start) : null;
      D.at = Number.isFinite(+D.at) ? this._un(+D.at, this.start) : a != null ? Math.max(a, this.start + 0.15) + Math.random() * 0.3 : this.start + span * (0.3 + 0.35 * i + Math.random() * 0.15);
      D.done = false; return D;
    });
    // (up to three a club night, never to someone under age; none at the team's own)
    this.roundsAt = this.underage || this.team ? [] : [0.45, 1.45, 2.4].map((h) => this.start + h * Math.min(1, span / 3) + Math.random() * 0.3).filter((h) => h < this.close - 0.2);
  }

  // ---- hooks ------------------------------------------------------------------------------------------------------------
  steps() {
    const S = [() => this._hud()];
    if (this.club) S.push(() => this._paradeBuild());
    // (the two most likely to dance with you get their dance bodies, one a frame behind the cover: the people are
    // built by then - the first step lines the bodies up, the rest build them)
    S.push(() => { try { for (const g of this._dancers()) { const H = new HeroFrames(g.person, g.opts || {}, { prep: (o) => this.ev._hostLit?.(o) }); this.hf.set(g, H); this.hfSteps.push(...(H.steps?.() || [])); } } catch (e) { console.warn('PartyPlay: no dance frames', e); } });
    for (let j = 0; j < 6; j++) S.push(() => { const f = this.hfSteps.shift(); if (f) { try { f(); } catch (e) { console.warn('PartyPlay: a dance frame', e); } } if (j === 5) while (this.hfSteps.length) { try { this.hfSteps.shift()(); } catch (_) { /* */ } } });
    return S;
  }
  ready() {
    const ev = this.ev, V = ev.V || {};
    // (the clock as the evening actually opened: act 2 carries the team party's on)
    const c0 = +ev.clock; if (Number.isFinite(c0)) { const s = this._un(c0, this.start); if (Math.abs(s - this.start) > 0.01) this.start = s; }
    this._schedule();
    const bpm = num(+V.beat?.bpm, num(+ev.P?.bpm, this.london ? 128 : this.team ? 118 : 124));
    // (Hangout's own levels for a club's track and its crowd - what the ducking eases from)
    const clubby = ev.occ === 'club' || !!V.club || !!ev.P?.club;
    this.music = new ClubMusic(ev, { bpm, level: clubby ? 0.42 : 0.3, crowd: 0.24 });
    const i = this._autoMood(); if (i >= 0) this._mood(i, true);
    this.music.start(); this.B.bpm = this.music.bpm;
    if (!ev.host && ev.sun) this._sun0 = ev.sun.color.clone();
    this.revealT = ev.t || 0; this.lastClock = this._clock(); this.XP.djName = this._djName();
    // (tests: window.__partyDrunk starts the night that far gone - true: drunk (9 units in), a number: that many units in)
    const fd = flag('__partyDrunk'); if (fd && !this.underage) { const u = typeof fd === 'number' ? fd : 9; this.absDone = Math.max(this.absDone, u); if (u > this.peak) this.peak = u; }
    this._drinkTick(); this._glass();
  }
  update(dt) {
    if (!this.on) return; const ev = this.ev;
    // (an action deferred until a pseudo-game has ended runs the frame after it)
    if (this.after.length && !ev.game) { const f = this.after.shift(); try { f(); } catch (e) { console.warn('PartyPlay: a step failed', e); } }
    this._beat(dt);
    this.acc += dt; if (this.acc >= 0.1) { const d = this.acc; this.acc = 0; this._tick(d); }
    // (a card's clock waits while you are busy with something else - a talk, a menu, a moment)
    if (this.card && !(ev.talk || ev.menu || ev.game || ev.ask || ev.moment || this.who)) this._cardTick(dt);
    // (a scuffle: the dancers around it step back - a ring opens round you and him, as a floor does)
    if (this.brawl && ev.game === this.brawl && ev.crowd?.push) { try { const P = ev.pos, f = this.brawl.foe?.person?.group?.position; ev.crowd.push(P.x, P.z, 1.6); if (f) ev.crowd.push(f.x, f.z, 1.4); } catch (_) { /* (no crowd) */ } }
  }
  light() {
    if (!this.on) return; const ev = this.ev;
    this._tagTrim();
    if (!REDUCED && this.tier >= 2 && !ev.game && !ev.moment && ev.cam) { const a = this.tier >= 3 ? 0.02 : 0.009, t = ev.t || 0; ev.cam.rotateZ(a * Math.sin(t * 0.9)); ev.cam.rotateX(a * 0.35 * Math.sin(t * 0.63 + 1.1)); ev.cam.updateMatrixWorld(); }
    if (!this.club || !this.music?.on) return;
    const M = MOOD_FX[this.moodK] || MOOD_FX.warm, cols = WASH[this.moodK] || WASH.warm, B = this.B, out = this.outside ? 0.12 : 1, talk = ev.talk ? 0.6 : 1;
    const per = REDUCED ? 32 : 16, seg = B.t / per, i = Math.floor(seg) % cols.length, f = ss((seg % 1) * 6 - 5);
    this._wc.copy(cols[(i + cols.length) % cols.length]).lerp(cols[(i + 1) % cols.length], f);
    const amt = M.wash * out * talk, pulse = REDUCED ? 0 : M.pulse * B.pulse * out;
    // (a strobe: the last two bars of every 32, on the beat - two flashes a second at 122-128 bpm, never three; white-blue, never red)
    const bar32 = Math.floor(B.t / 4) % 32, strobe = !REDUCED && M.strobe && bar32 >= 30 && B.phase < 0.08 && !ev.talk ? 1.1 * out : 0;
    this._wk.setRGB(1, 1, 1).lerp(this._wc, amt); this._ws.setRGB(1, 1, 1).lerp(this._wc, amt * 0.5);
    // (a strobe frame: the wash gives way to the strobe's white-blue, and the room flares with it)
    if (strobe > 0) { const s = Math.min(1, strobe); this._wk.lerp(STROBE_C, s); this._ws.lerp(STROBE_C, s * 0.6); }
    this._wk.multiplyScalar(1 + pulse + 1.5 * strobe); this._ws.multiplyScalar(1 + pulse * 0.4 + strobe * 0.45);
    if (ev.host) { const R = ev.lib?.ROOM; if (!R?.hgKey) return; R.hgKey.value.multiply(this._wk); R.hgSky.value.multiply(this._ws); }
    else if (ev.sun && this._sun0) ev.sun.color.copy(this._sun0).multiply(this._wk);
  }
  use(h) {
    if (!h || !this.on) return false;
    switch (h.kind) {
      case 'bar': case 'order': this._bar(h); return true;
      case 'table': this._table(h); return true;
      case 'dj': this._dj(h); return true;
      case 'dance': this._danceMenu(h); return true;
      case 'wall': this._wall(true); return true;
      case 'door': this._doorAt(h); return true;
      case 'garage': this._crew(); return true;
      case 'blackjack': this._blackjack(); return true;
      case 'drama': { const a = this._antagonist(); if (a && !a.gone && !a.talked) this._dramaTalk(a, h.drama || a.drama || 'spill', h.plan || null); return true; }
      case 'photo': if (this.london) { this.ev._toast('Stickers on every camera in here: no photos inside.', ''); return true; } return false;
      case 'quiet': this._outWith(); return false;   // (Hangout's quiet minute follows, with whoever came out with you)
      default: return false;
    }
  }
  /**
   * Out on the terrace (the courtyard in London): the one you were just talking to - a star, your partner, your
   * team-mate or a friend - comes out with you, so the quiet minute has them beside you and a talk out there can be
   * private (isPrivate). Placed within Hangout's companion reach under its own blink; nobody seated, nobody you upset.
   */
  _outWith() {
    const ev = this.ev, g = ev.lastG, P = ev.pos;
    if (!g?.person || g.gone || g.offended || g._ppPerson || ev.moment || ev.game || this._ant(g) || g.spot?.pose === 'sit') return;
    if (!((g.kind === 'celeb' && g.role !== 'dj') || ['partner', 'mate', 'friend', 'exmate'].includes(g.role))) return;
    const q = g.person.group.position; if (Math.hypot(q.x - P.x, q.z - P.z) < 5.5) return;   // (already out here with you)
    this._place(g, P.x - Math.cos(ev.yaw) * 1.6, P.z - Math.sin(ev.yaw) * 1.6, 1.2);
  }
  opts(opts, g) {
    if (!Array.isArray(opts) || !opts.length || !g || !this.on) return opts;
    const panel = this.ev.$?.('.hg-talk'), drunk = this.tier >= 3 && !this.drama;
    panel?.classList.toggle('pp-isdrunk', drunk); panel?.classList.toggle('pp-swim', drunk && !REDUCED);
    if (this.tier < 2 || this.drama || this._ant(g)) return opts;
    const out = opts.slice();
    // (tipsy: one answer is the thing you should not say)
    const at = out.map((o, i) => (o.end || o.fx?.loose || o.tone === 'leave' || o.act ? -1 : i)).filter((i) => i >= 0);
    if (at.length) out[pick(at)] = this._loose(g);
    if (drunk) for (let i = out.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  chosen(o, g) {
    if (!o || !g || !this.on) return; const ev = this.ev, Rp = this.Rp, D = this.drama;
    if (g.kind === 'celeb') this._metNow(g);
    // merry: the easy tones land better
    if (this.tier >= 1 && (o.tone === 'light' || o.tone === 'show' || o.tone === 'flirt')) { g.dm += 1; if (ev.talk) ev.talk.dm += 1; }
    // drunk: one pick in four comes out as the loose line
    if (this.tier >= 3 && !o.fx?.loose && !D && !o.end && !o.act && o.tone !== 'leave' && Math.random() < 0.25) {
      const L = this._loose(g); o.t = L.t; o.r = L.r; o.leak = L.leak; o.fx = { ...(o.fx || {}), loose: true }; g.fx.loose = (g.fx.loose || 0) + 1; ev.R.fx.loose = (ev.R.fx.loose || 0) + 1; g.dm -= 1;
      ev._toast(pick(PARTY_SLIP) || 'That came out wrong.', 'warn');
    }
    const fx = o.fx || {};
    if (fx.loose) this._looseSaid(o, g);
    if (fx.flirt && g.kind === 'celeb') { if (this.XP.private) g.ppPriv = (g.ppPriv || 0) + 1; if (!this.XP.flirted.includes(g.cid)) this.XP.flirted.push(g.cid); }
    // (talk: true - Hangout has counted the fx already)
    if (fx.dance) this.pend.push({ kind: 'dance', g, talk: true });
    if (fx.kiss && g.kind === 'celeb') this.pend.push({ kind: 'kiss', g, talk: true });
    if (fx.together && g.kind === 'celeb') { g.together = true; ev._toast(`${g.first} would share a car later.`, 'up'); }
    if (fx.selfie) { Rp.selfies++; ev.snd?.shutter?.(); this.after.push(() => this._keepPhoto(g, g.kind === 'celeb' ? 3 : this._ant(g) ? 1 : 2)); }
    if (fx.shoey && !Rp.shoey) this.pend.push({ kind: 'shoey' });
    if (fx.water) this._serve('water', { quiet: true });
    if (o.act) this.pend.push({ kind: 'act', act: o.act, g });
    if (D && D.g === g) { D.choice = o.tone || null; if (o.out) D.out = o.out; if (o.quote !== undefined) D.quote = !!o.quote; if (fx.calm && !D.out) D.out = 'calmed'; if (fx.provoke || o.out === 'scuffle') this._provoked(g, o); else if (o.out === 'row') { D.row = true; } }
    else if (fx.provoke && this._real(g)) { this.flags.row = g.cid; o.end = true; }
  }
  isPrivate(g) {
    const ev = this.ev, p = g?.person?.group?.position; let priv = false;
    if (p) {
      const z = this._zoneAt(p.x, p.z);
      if (z === 'quiet' || z === 'vip') {
        priv = true;
        for (const o of ev.gs || []) { if (o === g || o.gone || !o.person?.group?.visible) continue; const q = o.person.group.position; if (Math.hypot(q.x - p.x, q.z - p.z) < 3) { priv = false; break; } }
        if (priv) for (const x of this._extras()) { const q = x.person?.group; if (q?.visible && Math.hypot(q.position.x - p.x, q.position.z - p.z) < 3) { priv = false; break; } }
        if (priv && ev.crowd?.near) { try { if (ev.crowd.near(p.x, p.z, 3) > 0) priv = false; } catch (_) { /* (no crowd) */ } }
      }
    }
    this.XP.private = priv; return priv;
  }
  buzzHer() {
    const P = (this.ev.gs || []).filter((g) => g.kind === 'celeb' && g.person && !g.gone && g.role !== 'dj');
    const her = P.find((g) => g.role === 'partner') || P.slice().sort((a, b) => this._stage(b) - this._stage(a))[0];
    return her && this._stage(her) >= STAGE_I.dating ? her : null;
  }
  key(e) {
    if (!this.on) return false; const ev = this.ev, c = e.code;
    if (this.who) {
      if (!e.repeat) { if (c === 'KeyC' || c === 'Escape' || c === 'KeyQ') this._whoClose(); else if (c === 'ArrowRight' || c === 'KeyD') this._whoPage(1); else if (c === 'ArrowLeft' || c === 'KeyA') this._whoPage(-1); }
      return true;
    }
    const open = ev.talk || ev.menu || ev.game || ev.ask || ev.moment || ev.sty;
    if (this.card && !open && /^(Digit|Numpad)[12]$/.test(c)) { if (!e.repeat) this._cardPick(+c.slice(-1) - 1); return true; }
    // (Esc on a card that is up: it is the card you are waving away - a polite no - never the door behind it)
    if (this.card && !open && c === 'Escape') { if (!e.repeat) this._cardPick(1); return true; }
    if (c === 'KeyC' && !open) { if (!e.repeat) this._whoOpen(); return true; }
    return false;
  }
  door(auto = false) {
    const ev = this.ev; if (!this.on || this.exiting || ev.closing) return true;
    if (ev.game || ev.ask || ev.talk || ev.menu?.door) return true;
    if (this.who) this._whoClose();
    // (a card still up - a round, a text - goes away without an answer: the door's keys are 1-6 too, never both at once)
    if (this.card) this._cardDrop();
    this.doorLast = ev.t;
    const closed = this._clock() >= this.close, I = [], A = [], T = [];
    // (each way out with what it means, as the talk's options carry their tone: tag, and the tone its colour is)
    const add = (label, fn, tag = '', tone = '') => { if (I.length < 6) { I.push(label); A.push(fn); T.push([tag, tone]); } };
    const likely = this.Rp.posed || this.tier >= 2 || this.Rp.flashes >= 3;
    if (this.team) {
      add('The team car to the hotel', () => this._exit('teamcar'), 'QUIET · RECOVERY', 'kind');
      if (this._canMoveOn()) {
        add(`On to the club${this.o.clubName ? ` · ${this.o.clubName}` : ''}${this.track === 'silverstone' ? ' · by car, 1 h 45' : ''}`, () => this._exit('moveon'), 'THE NIGHT GOES ON', 'show');
        // (from Silverstone the helicopter goes from the circuit's own helipad to Battersea: 25 minutes, $4K - career/Party.js charges it)
        if (this.track === 'silverstone') add('On to the club · the helicopter, 25 min, $4K', () => { this.Rp.heli = true; this._exit('moveon'); }, '$4K', 'show');
      }
      if (!this.Rp.crewThanked && (ev.hots || []).some((h) => h.kind === 'garage')) add('Thank the crew on the way out', () => this._crew(() => this._exit('teamcar')), 'TEAM MORALE', 'kind');
    } else {
      const early = this._clock() < this.late;
      add(early ? 'The hotel, now · an early night' : 'The hotel, now', () => this._exit('hotel'), early ? 'QUIET · RECOVERY+' : 'QUIET', 'kind');
      if (this._sideOk()) add(`The side exit${this.flags.sideTip ? ' · as your PR said' : ''}`, () => this._exit('side'), 'FEW CAMERAS', 'firm');
      add(this.london ? 'Up the stairs and out the front' : 'Down to the front door', () => this._exit('front'), likely ? 'PHOTOGRAPHERS · LIKELY' : 'PHOTOGRAPHERS', 'cruel');
      const stars = this._leaveWith(); if (stars.length) add('Leave with...', () => this._leaveWithMenu(stars), 'TOGETHER · PHOTOGRAPHERS', 'flirt');
      if (this._friends().length && this._h24() >= 26) add(this.london ? 'A chicken shop with the others' : 'Breakfast with the others', () => this._exit('breakfast'), 'LATE · WITH FRIENDS', 'light');
    }
    if (!closed) add('One more', () => {});
    const line = closed ? (this.lastCall != null ? 'Out by three: that is the licence. Everybody out.' : 'The house lights are up. That is the night.') : auto ? 'The night is winding down.' : this.team ? 'Calling it?' : 'Where to?';
    ev._menu(this.team ? 'Team hospitality · the way out' : `${ev.P?.name || 'The club'} · the door`, line, I, (i) => A[i]?.());
    if (ev.menu) {
      ev.menu.door = true; ev.menu.auto = closed;
      try { ev.$('.hg-talk .opts').querySelectorAll('button').forEach((b, i) => { const [tag, tone] = T[i] || []; if (!tag) return; b.dataset.tone = tone; const el = b.querySelector('i'); if (el) el.textContent = tag; }); } catch (_) { /* (the labels alone) */ }
    }
    // (at closing time the menu waits a while, the time left shown - then the quiet way: the hotel, never the cameras)
    this.doorAuto = closed ? 14 : 0; this.doorShownT = -1;
    return true;
  }
  why(g) {
    if (!g) return ''; if (g.why) return g.why; const n = g.n || {}, r = g.role, XP = this.XP || {};
    if (r === 'partner') return 'Your partner';
    if (r === 'mate') return XP.feud ? 'Your team-mate · there is something to clear up' : 'Your team-mate';
    if (r === 'rival') return XP.fought && (g.id === XP.fought) ? 'You touched in the race' : 'A rival on track';
    if (r === 'exmate') return 'Your old team-mate';
    if (r === 'friend') return 'A friend in the paddock';
    if (r === 'present') return `${g.team || 'Driver'} · a quick word`;
    if (r === 'dj') return 'On the decks tonight';
    if (r === 'boss') return 'Your team principal';
    if (r === 'rep') { const b = this._brandOf(g), B = b ? BRAND_BY_ID[b] : null; return [B?.brand || 'Sponsor', n.title || 'Head of athlete marketing', this._deal(b) ? 'your sponsor: keep them sweet' : 'could offer a deal'].join(' · '); }
    if (r === 'agent') return 'Agent · knows who is moving';
    if (r === 'press') return 'Paddock Post diary · careful what you say';
    if (r === 'infl') return 'Influencer · filming everything';
    if (g.kind === 'celeb') { const st = n.stage || g.stage; const s = st ? Celebs.stageLabel(st) : ''; return [g.C?.job, s && s !== 'Not met' ? s : ''].filter(Boolean).join(' · '); }
    return g.team || '';
  }
  get seal() { const s = this.ev.P?.sealed; if (this.exitOpen) return false; return s === 'all' || s === true || (s === 'inside' && !this.outside); }
  get zone() { return this.zoneK; }
  get beat() { return this.B; }
  get occupancy() { return this._occupancy(); }
  resultInto(res) {
    if (!res) return; const ev = this.ev, Rp = this.Rp;
    this._drinkTick();
    Rp.level = +this.level.toFixed(2); Rp.peak = +this.peak.toFixed(2); Rp.pending = +this.pending.toFixed(2); Rp.clock = +this._clock().toFixed(3); Rp.units = +(+Rp.units).toFixed(2); Rp.spend = +(+Rp.spend).toFixed(5);
    if (Rp.leftAt == null) Rp.leftAt = +this._h24().toFixed(2);
    // (a booked table's minimum: whatever the table did not spend toward it is paid on the way out)
    if (this.minSpend > 0 && !Rp.comped) { const top = Math.max(0, this.minSpend - (this.tabSpend || 0)); Rp.spend += top; Rp.minimum = this.minSpend; this.minSpend = 0; }
    Rp.selfies = Math.max(Rp.selfies || 0, ev.R?.selfies || 0); Rp.toast = Rp.toast || (ev.R?.toasts || 0) > 0;
    Rp.seenDrunkBy = [...this.seenDrunk];
    Rp.contacts = this._contacts();
    // (the night's best picture for the morning after: Hangout keeps only who was in its photo, career/Party.js wants the image)
    if (typeof Rp.photoUrl === 'string') res.photo = Rp.photoUrl;
    res.party = Rp;
    if (Rp.exit === 'moveon') res.left = 'moveon';
  }
  dispose() {
    if (!this.on) return; this.on = false; const ev = this.ev;
    try { this.brawl?.dispose(); } catch (_) { /* */ } this.brawl = null; this._unstash();
    if (ev.game && (ev.game instanceof Moment || ev.game instanceof Dance || ev.game instanceof PartyBrawl)) { try { ev.game.dispose(); } catch (_) { /* */ } ev.game = null; }
    this.music?.stop();
    for (const H of this.hf.values()) { try { H.dispose(); } catch (_) { /* */ } } this.hf.clear();
    const PR = this.parade; if (PR) { for (const p of PR.people) { p.group.parent?.remove(p.group); try { p.dispose(); } catch (_) { /* */ } } PR.group.parent?.remove(PR.group); PR.group.traverse((o) => { if (o.isMesh || o.isSprite) { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); } }); PR.tex?.dispose(); this.parade = null; }
    for (const el of this.dom ? Object.values(this.dom) : []) el?.remove?.();
    ev.$?.('.hg-talk')?.classList.remove('pp-isdrunk', 'pp-swim', 'pp-drama');
    if (ev.sun && this._sun0) ev.sun.color.copy(this._sun0);
    try { if (window.__partyPlay === this) window.__partyPlay = null; } catch (_) { /* */ }
  }

  // ---- time, place, the beat ---------------------------------------------------------------------------------------------
  /** the clock in the venue's own run (past midnight as 24+ for a venue that opened before it) */
  _clock() { const h = +this.ev.clock; return Number.isFinite(h) ? this._un(h, this.start) : this.start; }
  /** the clock as the career reads it: after midnight as 24+ */
  _h24() { const h = this._clock(); return h < 12 ? h + 24 : h; }
  _beat(dt) {
    const B = this.B, m = this.music; if (!m) return;
    const t = m.beats(dt), M = this.ev.V?.moods?.[this.moodI];
    B.t = t; B.phase = t - Math.floor(t); B.pulse = Math.exp(-B.phase * 5); B.bar = Math.floor(t) % 4; B.bpm = m.bpm; B.mood = this.moodI; B.energy = num(M?.energy, (MOOD_FX[this.moodK] || MOOD_FX.warm).energy);
  }
  _zoneAt(x, z) { const V = this.ev.V; if (!V) return ''; if (V.terrace && (inR(V.terrace.zone, x, z) || inR(V.terrace.vestibule, x, z))) return 'quiet'; let k = ''; try { k = zoneAt(V, x, z); } catch (_) { k = ''; } return k === 'room' ? '' : k === 'vestibule' ? 'quiet' : k || ''; }
  _floorY(x, z) { const f = this.ev.V?.heightAt; if (typeof f === 'function') { try { return num(f(x, z), 0); } catch (_) { return 0; } } return 0; }
  _autoMood() {
    const M = this.ev.V?.moods || []; if (!M.length) return -1; const h = this._clock(), find = (k) => M.findIndex((m) => moodKind(m.name) === k);
    if (this.team) { if (h >= this.late) return Math.max(0, find('last')); if (this.flags.mechanics || this.Rp.speech) return Math.max(0, find('peak')); return Math.max(0, find('warm')); }
    if (h >= this.late || (this.lastCall != null && h >= this.lastCall - 0.25)) return Math.max(0, find('last'));
    if (h < this.start + 0.6 && this.start < 24.5) return Math.max(0, find('warm'));
    return Math.max(0, find('peak'));
  }
  _mood(i, first = false) {
    const ev = this.ev, M = ev.V?.moods?.[i]; if (!M) return;
    this.moodI = i; this.moodK = moodKind(M.name);
    try { ev._moodSet(i, first); } catch (_) { /* (Hangout's own) */ }
    if (first && ev.mt && ev.hemi && ev.base) { ev.mk = { hemi: ev.mt.hemi, glow: ev.mt.glow }; ev.hemi.intensity = ev.base.hemi * ev.mk.hemi; if (ev.mt.sky) ev.hemi.color.copy(ev.mt.sky); for (const G of ev.K?.glows || []) G.m.color.copy(G.base).multiplyScalar(ev.mk.glow); }
    if (ev.crowd && 'energy' in ev.crowd) ev.crowd.energy = num(M.energy, (MOOD_FX[this.moodK] || MOOD_FX.warm).energy);
  }
  _occupancy() {
    const M = this.ev.V?.moods?.[this.moodI], occ = num(M?.occ, (MOOD_FX[this.moodK] || MOOD_FX.warm).occ), h = this._clock();
    if (this.team) return clamp(0.6 + (this.flags.mechanics ? 0.4 : 0), 0, 1) * (h >= this.close - 0.25 ? 0.6 : 1);
    const ramp = 0.55 + 0.45 * ss((h - this.start) / 1.0), out = h >= this.close - 0.5 ? 1 - 0.6 * ss((h - (this.close - 0.5)) / 0.5) : 1;
    return clamp(occ * ramp * out, 0.08, 1);
  }

  // ---- the 10 Hz tick: the drink model, where you are, the talk's context, the director --------------------------------
  _tick(d) {
    const ev = this.ev, XP = this.XP, h = this._clock();
    this._drinkTick();
    this.zoneK = this._zoneAt(ev.pos.x, ev.pos.z); const V = ev.V; this.outside = !!(V?.terrace && (inR(V.terrace.zone, ev.pos.x, ev.pos.z) || inR(V.terrace.vestibule, ev.pos.x, ev.pos.z)));
    XP.tier = TIER_KEY[this.tier]; XP.level = +this.level.toFixed(2); XP.zone = this.zoneK || null; XP.clock = +h.toFixed(3); XP.late = h >= this.late; XP.lastCall = this.lastCall != null && h >= this.lastCall; XP.seenDrunk = this.seenDrunk.size > 0;
    XP.table = !!this.Rp.table; XP.comped = !!this.Rp.comped; XP.parade = !!this.Rp.parade; XP.photographed = !!this.Rp.photographed || this.Rp.flashes > 0; if (!ev.talk) XP.private = false;
    this.music?.mix(ev.talk ? 0.5 : 1, this.outside ? 1 : 0);
    this._seenDrunk(); this._flashes(); this._talkWatch(); this._glass(); this._closeNote();
    if (this.doorAuto > 0 && ev.menu?.door) {
      this.doorAuto -= d; const s = Math.max(0, Math.ceil(this.doorAuto));
      if (s !== this.doorShownT) { this.doorShownT = s; const nx = ev.$?.('.hg-talk .next'); if (nx) nx.textContent = `1-${ev.menu.items?.length || 1} · ${this.team ? 'THE TEAM CAR' : 'THE HOTEL'} IN ${s} S`; }
      if (this.doorAuto <= 0) { ev._menuClose?.(false); this._exit(this.team ? 'teamcar' : 'hotel'); }
    }
    this._director();
  }
  _drinkTick() {
    const now = this._clock(); if (this.lastClock == null) this.lastClock = now; const dH = Math.max(0, now - this.lastClock); this.lastClock = now;
    let abs = this.absDone, pend = 0;
    for (let i = this.serves.length - 1; i >= 0; i--) { const s = this.serves[i], f = clamp((now - s.at) / s.ab, 0, 1); if (f >= 1) { this.absDone += s.units; abs += s.units; this.serves.splice(i, 1); } else { abs += s.units * f; pend += s.units * (1 - f); } }
    this.elim += Math.min(Math.max(0, abs - this.elim), ELIM * dH);
    this.level = Math.max(0, abs - this.elim); this.pending = pend; if (this.level > this.peak) this.peak = this.level;
    const L = this.level; this.tier = L >= TIER[4] ? 4 : L >= TIER[3] ? 3 : L >= TIER[2] ? 2 : L >= TIER[1] ? 1 : 0;
    if (this.realMe && this.tier > 2) this.tier = 2;
  }
  /** a real driver as you, at the line he keeps to: water from here (what is in the glass and still to come is tipsy at most) */
  _capped() { return this.realMe && this.level + this.pending >= TIER[3] - 0.7; }
  _seenDrunk() {
    if (this.tier < 3) return; const ev = this.ev, P = ev.pos;
    for (const g of ev.gs || []) { if (!g.person?.group?.visible || g.gone || !g.cid) continue; const q = g.person.group.position; if (Math.hypot(q.x - P.x, q.z - P.z) < 8 && !this.seenDrunk.has(g.cid)) { this.seenDrunk.add(g.cid); if (g.role === 'rep') this._repSaw(g); } }
  }
  /** a careful brand's people see you drunk, and go home (heatMax 60 or less) */
  _repSaw(g) { const b = BRAND_BY_ID[this._brandOf(g)]; if (b && b.heatMax <= 60 && !this.repLeaving.has(g)) this.repLeaving.set(g, this.ev.t + 12 + Math.random() * 10); }
  /** the house photographers' flashes (PartyCrowd): one near you is a picture of you */
  _flashes() { const C = this.ev.crowd; if (!C?.flashes) return; let F = null; try { F = C.flashes(); } catch (_) { return; } if (!F?.length || this.london) return; const P = this.ev.pos; for (const f of F) if (f && Math.hypot(f.x - P.x, f.z - P.z) < 7) this.Rp.flashes++; }
  /** a conversation that has just closed: an incident's outcome; what was agreed in it, now */
  _talkWatch() {
    const ev = this.ev, D = this.drama, panel = ev.$?.('.hg-talk');
    if (!ev.talk) { panel?.classList.remove('pp-isdrunk', 'pp-swim', 'pp-drama'); }
    if (D && D.open && ev.talk?.g !== D.g) {
      D.open = false; this.XP.drama = null; this.XP.dramaCid = null;
      const real = this._real(D.g), raw = D.scuffle ? 'scuffle' : D.out || (D.row ? 'row' : D.g.offended ? 'row' : 'calmed');
      let outcome = OUTCOME[raw] || (D.row ? 'row' : 'calm'); if (outcome === 'scuffle' && (real || !D.scuffle)) outcome = 'row';
      // (the columnist: talked out of it - the diary never heard a thing; or it runs)
      if (D.id === 'overheard') { const pc = D.g.cid; if (D.quote === false) { for (const L of this.Rp.loose) L.near = (L.near || []).filter((q) => q !== pc); } else if (!this.Rp.loose.some((L) => (L.near || []).includes(pc))) { const L = this.Rp.loose[this.Rp.loose.length - 1]; if (L) (L.near || (L.near = [])).push(pc); } }
      this.Rp.drama.push({ id: D.planId || D.id, cid: D.g.cid, choice: D.choice || null, outcome, out: raw });
      if (outcome === 'row' || outcome === 'scuffle') { try { papsNote(ev, 'row', D.g); } catch (_) { /* */ } }   // (paps hook: an argument in public is a private moment too)
      if (D.g === this.ant || this._ant(D.g)) D.g.talked = true;
      if (D.scuffle) this.pend.push({ kind: 'scuffle', g: D.g, started: true });
      else if (outcome === 'walked' && raw === 'security') this.pend.push({ kind: 'act', act: 'security', g: D.g });
      this.drama = null;
    }
  }
  _free() { const ev = this.ev; return !!(ev.ready && !ev.closing && !ev.talk && !ev.menu && !ev.game && !ev.ask && !ev.moment && !ev.sty && !this.who && !this.card && !this.exiting); }

  /** what happens next, one thing at a time and only when you are free (the forced exit first) */
  _director() {
    const ev = this.ev, h = this._clock();
    if (this.exiting) return;
    if (this.tier >= 4 && !ev.game && !ev.talk) { ev._menuClose?.(false); this._exit('carried'); return; }
    for (const [g, at] of this.repLeaving) if (ev.t >= at && !g.gone && !ev.talk) { this.repLeaving.delete(g); try { ev._walkOut(g); } catch (_) { g.gone = true; } ev._toast(`The ${BRAND_BY_ID[this._brandOf(g)]?.brand || 'sponsor'} people have called it a night. They saw you.`, 'down'); }
    if (!this._free()) return;
    if (this.revealT == null || ev.t - this.revealT < 0.8) return;
    if (!this.arrived) { this.arrived = true; this._arrival(); return; }
    if (this.pend.length) { this._pending(this.pend.shift()); return; }
    if (flag('__partyBrawl') && !this.flags.forcedBrawl) { const a = this._antagonist(); if (a) { this.flags.forcedBrawl = true; this._approach(a, () => this._scuffle(a, false)); return; } }
    if (h >= this.close && !this.doorShown) { this.doorShown = true; this._say('lightsUp'); this.door(true); return; }
    if (this.doorShown && h >= this.close && ev.t - (this.doorLast || 0) > 20) { this.door(true); return; }
    if (this.lastCall != null && h >= this.lastCall && !this.flags.lastCall) { this.flags.lastCall = true; ev._toast(this._say('lastOrders') || 'Last orders at the bar.', 'warn'); return; }
    if (this.team) {
      if (!this.Rp.speech && h >= this.start + 0.12) { this._speech(); return; }
      if (!this.flags.mechanics && h >= this.start + (this.start < 22 ? 1.4 : 1.0)) { this._mechanics(); return; }
    }
    // (the DJ's shout-out, once the room has seen you)
    if (this.club && !this.Rp.shout && h >= this.start + 0.3 && this._djName()) { this._shout(); return; }
    // (the DJ moves the night on, unless you asked for something)
    if (h - this.reqAt > 0.35) { const i = this._autoMood(); if (i >= 0 && i !== this.moodI) this._mood(i); }
    for (const D of this.plan) if (!D.done && h >= D.at) { if (talkId(D.id) === 'overheard' && !this._heard() && h < this.late) continue; D.done = true; const k = this.tier >= 3 ? 1.5 : this.tier >= 2 ? 1.2 : 1; if (Math.random() < Math.min(1, num(+D.chance, 0.75) * k) || flag('__partyBrawl')) { if (this._incident(D)) return; } }
    // (a round due while you were busy is dropped once the bar has closed or the night is nearly over - never sent late)
    if (this.roundsAt.length && h >= this.roundsAt[0]) { this.roundsAt.shift(); if ((this.lastCall == null || h < this.lastCall) && h < this.close - 0.25) { this._roundOver(); return; } }
    if (!this.flags.exText && this.tier >= 2 && this._h24() >= 26.9 && !this.team) { this.flags.exText = true; if (this._exText()) return; }
  }
  _pending(p) {
    const ev = this.ev;
    switch (p.kind) {
      case 'dance': this._dance(p.g, !!p.talk); break;
      case 'kiss': this._kiss(p.g, !!p.talk); break;
      case 'shoey': this._shoey(); break;
      case 'scuffle': this._scuffle(p.g, p.started); break;
      case 'act': this._act(p.act, p.g); break;
      default: break;
    }
    void ev;
  }
  /** PartyTalk's scene actions, once the talk has closed */
  _act(a, g) {
    const ev = this.ev;
    switch (a) {
      case 'side': this._exit(this._sideOk() ? 'side' : 'front'); break;
      case 'front': this._exit('front'); break;
      case 'car': this._exit(this.tier >= 3 ? 'carried' : this.team ? 'teamcar' : 'hotel'); break;
      case 'security': { const S = this._extra('security'); ev._toast(`${S?.name ? firstOf(S.name) + ' from' : ''} Security walks ${g?.first || 'him'} away${S ? '' : ' from you'}.`.replace(/^ /, ''), 'up'); if (g && this._ant(g)) this._blink(() => { if (g.person) g.person.group.visible = false; g.gone = true; }); break; }
      case 'walk': this._blink(() => { const P = ev.pos, b = ev.yaw + Math.PI; for (const d of [2.2, 1.6, 1.1]) { const x = P.x + Math.cos(b) * d, z = P.z + Math.sin(b) * d; if (ev._free(x, z)) { P.x = x; P.z = z; ev.yaw = b; break; } } }); break;
      case 'photo': this.Rp.flashes++; this.Rp.selfies++; this._flashDom(); break;
      case 'crew': this._crew(); break;
      case 'dj': if (!this.Rp.shout) this._shout(); break;
      case 'booth': if (g?.person) { const T = this._tableAt(); this._blink(() => { if (this._place(g, T.x, T.z, 1.3)) { g.dm += 0.5; this.Rp.invited.push(g.cid); } }); } break;
      case 'toast': this.Rp.toast = true; ev.snd?.clink?.(); ev._toast(this._say('cheers') || 'Cheers!', 'up'); break;
      default: break;
    }
  }

  // ---- the drink model: a serve, and what it does to you ----------------------------------------------------------------
  _serve(kind, o = {}) {
    const ev = this.ev, D = DRINKS[kind]; if (!D) return;
    if (this.underage && D.units > 0) { ev._toast(this.team ? 'Soft drinks for you tonight: you are under age here.' : (this._say('bar.id') || 'Soft drinks only for you tonight.'), 'warn'); return; }
    const u = kind === 'shot' && !this.london ? D.vegas : D.units, h = this._clock(), Rp = this.Rp;
    if (u > 0) { this.serves.push({ units: u, at: h, ab: this.team ? 1.25 : 0.75 }); Rp.units = +(Rp.units + u).toFixed(2); }
    Rp.drinks.push({ kind, at: +this._h24().toFixed(2), units: u });
    if (kind === 'water') { Rp.water++; this.waterTill = h + 20 / 60; }
    const cost = o.free ? 0 : D.cost * this.price; if (cost > 0) Rp.spend += cost;
    ev.R.orders = (ev.R.orders || 0) + 1;
    if (ev.R.orders <= 2) for (const g of ev.gs || []) if (g.person && !g.gone && Math.hypot(g.person.group.position.x - ev.pos.x, g.person.group.position.z - ev.pos.z) < 6) g.dm += 0.5;
    if (!o.quiet) ev._toast(o.text || `${D.name}.${kind === 'water' ? ' Good idea.' : this.team && u > 0 ? ' On the team.' : ''}`, '');
    this._drinkTick(); this._glass();
  }
  _loose(g) {
    let L = null; try { L = HT.hangoutLoose?.(this.ev.x || {}, g.n || { kind: g.kind, role: g.role, name: g.name }) || null; } catch (_) { L = null; }
    if (L) return { ...L, fx: { ...(L.fx || {}), loose: true } };
    const F = pick(LOOSE); return { t: F.t, tone: 'gossip', r: F.r, m: -1, fx: { loose: true }, leak: F.leak };
  }
  /** a loose line of yours the columnist was near enough to hear */
  _heard() { const P = (this.ev.gs || []).find((q) => q.role === 'press'); return !!P && this.Rp.loose.some((L) => (L.near || []).includes(P.cid)); }
  _looseSaid(o, g) {
    const ev = this.ev, P = ev.pos, near = [];
    for (const q of ev.gs || []) { if (!q.person?.group?.visible || q.gone || !q.cid) continue; const p = q.person.group.position; if (Math.hypot(p.x - P.x, p.z - P.z) < 4) near.push(q.cid); }
    this.Rp.loose.push({ near, leak: !!o.leak, line: o.t }); this.XP.loose = true;
    // (the columnist heard it: the diary may come asking, if the night has not got that planned already)
    const ear = (ev.gs || []).find((q) => q.role === 'press' && near.includes(q.cid) && q !== g);
    if (ear && !this.plan.some((D) => D.id === 'overheard' || D.id === 'overhear')) this.plan.push({ id: 'overheard', cid: ear.cid, at: this._clock() + 0.15, done: false, chance: 0.8 });
  }

  // ---- the bar ------------------------------------------------------------------------------------------------------------
  _bar() {
    const ev = this.ev, S = this._extra('bartender') || ev.staff, nm = S?.name && !/^(the )?bar(tender)?$/i.test(S.name) ? S.name : null, who = this.team ? 'The team bar' : nm ? `${nm} · the bar` : 'The bar';
    if (ev.staff) ev.staff.nod = 1;
    if (this.lastCall != null && this._clock() >= this.lastCall) { ev._menu(who, 'Last orders have been and gone. Water?', ['Water', 'Nothing, thanks'], (i) => { if (i === 0) this._serve('water'); }); return; }
    const hold = this._clock() < this.waterTill ? ' (a water still on the go)' : '';
    let L;
    if (this._capped()) { ev._menu(who, 'You know where your line is. Water from here - the next race starts tomorrow.', ['Water', 'A soft drink', 'Nothing, thanks'], (i) => { if (i < 2) this._serve(i ? 'soft' : 'water'); }); return; }
    if (this.underage) L = [['water', 'Water'], ['soft', 'A soft drink']];
    else if (this.team) { L = [['champagne', 'Champagne'], ['beer', 'A beer from the fridge'], ['wine', 'A glass of wine'], ['water', 'Water'], ['soft', 'A soft drink']]; if (this.XP.podium && !this.Rp.shoey) L.push(['shoey', 'A shoey, for the podium']); }
    else L = [['champagne', 'A glass of champagne'], ['cocktail', 'A cocktail'], ['shot', this.london ? 'A shot' : 'A shot (a Vegas pour)'], ['bw', 'Beer or wine...'], ['water', 'Water'], ['soft', 'A soft drink']];
    ev._menu(who, (this.team ? 'Help yourself - it is all on the team tonight.' : (this._say('bar.ask') || 'What can I get you?')) + hold, L.map((x) => x[1]), (i) => {
      const k = L[i]?.[0]; if (!k) return;
      if (k === 'bw') { ev._menu(who, 'Beer or wine?', ['A beer', 'A glass of wine'], (j) => this._serve(j ? 'wine' : 'beer')); return; }
      if (k === 'shoey') { this._shoey(); return; }
      this._serve(k);
      if (k === 'water' || k === 'soft') { const g = ev._companion?.(6); if (g && Math.random() < 0.5) setTimeout(() => this.on && !ev.talk && ev._bark(g, this._say('soft')), 900); }
    });
  }

  // ---- the table: booking, a bottle, the parade, someone over, a round -----------------------------------------------------
  _comp() { return !!(this.o.me?.comped || this.brand || this.o.contractual || this.fame >= 60); }
  _table() {
    const ev = this.ev, Rp = this.Rp, I = [], A = [], p = this.price;
    if (this.team) { ev._toast("The long tables are the team's - sit anywhere.", ''); return; }
    const add = (s, f) => { if (I.length < 6) { I.push(s); A.push(f); } };
    if (!Rp.table) add(this._comp() ? 'Take your table · on the house' : `Book the table · ${money(PRICE.table * p)} minimum`, () => this._book());
    add(`A bottle of champagne · ${Rp.comped && !Rp.bottle ? 'on the house' : money(PRICE.bottle * p)}`, () => this._bottle());
    if (!Rp.parade) add(`The parade · 3 litres, sparklers, your number · ${money(PRICE.parade * p)}`, () => this._parade());
    add('Invite someone over...', () => this._invite());
    add(`Send a round · ${money(PRICE.round * p)}`, () => this._sendRound());
    if (Rp.bottle > 0) add('Pour yourself a glass', () => this._serve('champagne', { free: true, text: 'A glass from the bottle on your table.' }));
    ev._menu(Rp.table ? 'Your table' : 'The VIP booths', Rp.table ? (Rp.comped ? 'On the house tonight.' : 'Your table, your minimum.') : 'A booth up on the rail, over the floor.', I, (i) => A[i]?.());
  }
  _book() {
    const Rp = this.Rp, ev = this.ev; if (Rp.table) return; Rp.table = true;
    if (this._comp()) { Rp.comped = true; ev._toast(this.brand ? "The host has you on their table tonight." : (this._say('door.comp') || 'The club wants your picture: the table is on the house.'), 'up'); }
    else { this.minSpend = PRICE.table * this.price; this.tabSpend = 0; ev._toast(`Table booked: a ${money(this.minSpend)} minimum spend. Bottles count toward it.`, ''); }
  }
  /** money spent at the table (it counts toward a booked table's minimum) */
  _tab(m) { this.Rp.spend += m; this.tabSpend = (this.tabSpend || 0) + m; }
  _bottle() {
    const Rp = this.Rp, ev = this.ev; if (!Rp.table) { ev._toast('Bottle service is for tables. Book one first.', 'warn'); return; }
    const free = Rp.comped && !Rp.bottle; Rp.bottle++; if (!free) this._tab(PRICE.bottle * this.price);
    for (const g of this._atTable()) g.dm += 1;
    ev._toast(free ? 'A bottle arrives, compliments of the house.' : `A bottle of champagne on ice: ${money(PRICE.bottle * this.price)}.`, 'up');
    this._serve('champagne', { free: true, quiet: true });
  }
  _sendRound() {
    const ev = this.ev, L = this._people().slice(0, 6);
    if (!L.length) { ev._toast('Nobody to send one to.', ''); return; }
    ev._menu('Send a round', 'To whom?', L.map((g) => `${g.name}${g.role ? ` · ${this._roleWord(g)}` : ''}`), (i) => {
      const g = L[i]; if (!g) return; this.Rp.rounds.sent++; this._tab(PRICE.round * this.price);
      const peace = this.XP.fought && g.id === this.XP.fought; g.dm += peace ? 2 : 1.5; g.fx.round = (g.fx.round || 0) + 1;
      ev._toast(`A round sent over to ${g.first}${peace ? ' - a peace offering' : ''}.`, 'up'); setTimeout(() => { if (this.on && !ev.talk) ev._bark(g, this._say('cheers') || 'Cheers!'); }, 1400);
    });
  }
  _invite() {
    const ev = this.ev, at = this._tableAt(), L = this._people().filter((g) => !g.offended && !this._near(g, at, 2.6)).slice(0, 6);
    if (!L.length) { ev._toast('Everyone you would ask is already here.', ''); return; }
    ev._menu('Invite someone over', 'Who do you want at the table?', L.map((g) => `${g.name}${g.role ? ` · ${this._roleWord(g)}` : ''}`), (i) => {
      const g = L[i]; if (!g) return;
      this._blink(() => { if (this._place(g, at.x, at.z, 1.3)) { g.dm += 1; g.fx.invited = (g.fx.invited || 0) + 1; this.Rp.invited.push(g.cid); ev._toast(`${g.first} comes over to your table.`, 'up'); } else ev._toast(`No room round the table for ${g.first}.`, ''); });
    });
  }

  // ---- the parade: servers in house black, sparklers, a light-up sign with your number ---------------------------------
  _paradeBuild() {
    const ev = this.ev, G = new THREE.Group(); G.name = 'pp-parade'; G.visible = false; ev.scene.add(G);
    const people = [];
    for (const o of [{ figure: 'f', kit: 'bodycon', color: '#0d0d10', accent: '#1a1a1f', pose: 'cheer', seed: 'server-a', style: { hs: 'ponytail', fh: null, lip: true } }, { kit: 'pantsuit', color: '#0f1014', accent: '#e8e6e0', legs: '#0f1014', pose: 'cheer', seed: 'server-b' }]) {
      try { const p = makePersonSafe({ ...o, jitter: 0.01, detail: 0.6 }); if (!p) continue; p.group.visible = false; ev.scene.add(p.group); ev._lift?.(p); ev._hostLit?.(p.group); people.push(p); } catch (e) { console.warn('PartyPlay: no parade server', e); }
    }
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,230,160,.9)'); gr.addColorStop(1, 'rgba(255,180,60,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const sm = new THREE.SpriteMaterial({ map: tex, color: '#fff2d0', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false });
    const sparks = []; for (let i = 0; i < 4; i++) { const s = new THREE.Sprite(sm); s.scale.setScalar(0.32); G.add(s); sparks.push(s); }
    const nm = String(ev.c?.drivers?.[ev.c?.playerId]?.number ?? '');
    const sc = document.createElement('canvas'); sc.width = 256; sc.height = 96; const y = sc.getContext('2d'); y.fillStyle = '#05050a'; y.fillRect(0, 0, 256, 96); y.shadowColor = '#ff3fb4'; y.shadowBlur = 18; y.fillStyle = '#ffd6f0'; y.font = "900 54px 'Segoe UI', Arial"; y.textAlign = 'center'; y.textBaseline = 'middle'; y.fillText(nm ? `#${nm}` : lastOf(ev.meName).toUpperCase().slice(0, 8), 128, 50);
    const st = new THREE.CanvasTexture(sc); st.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.23), new THREE.MeshBasicMaterial({ map: st, toneMapped: false, transparent: true, side: THREE.DoubleSide })); G.add(sign);
    this.parade = { group: G, people, sparks, sign, tex, num: nm };
  }
  _parade() {
    const ev = this.ev, Rp = this.Rp, PR = this.parade;
    if (!Rp.table) { ev._toast('The parade comes to a table. Book one first.', 'warn'); return; }
    if (Rp.parade) { ev._toast('One parade a night is plenty.', ''); return; }
    Rp.parade = true; this._tab(PRICE.parade * this.price); Rp.bottle++; if (this.vegas) Rp.flashes += 2;
    const V = ev.V || {}, to = this._tableAt(), from = V.service || mid(V.zones?.bar) || { x: to.x - 6, z: to.z }, people = PR?.people || [];
    try { V.led?.say?.(PR?.num ? `#${PR.num}` : lastOf(ev.meName).toUpperCase(), 9); } catch (_) { /* */ }
    this._moment({ id: 'parade', dur: 7, min: 2.5, flashes: this.vegas ? [2.2, 3.1, 4.4] : [], caption: this._moment_('parade') || 'Here it comes: three litres of champagne, sparklers fizzing, your number in lights.',
      start: () => { if (PR) { PR.group.visible = true; for (const p of people) p.group.visible = true; } ev.snd?.hit?.(4200, 1.2, 0.02, 0.5, 0, 'highpass'); },
      tick: (t) => {
        if (!PR) return; const k = ss(t / 5.5), f = facing(to.x - from.x, to.z - from.z), fx = Math.cos(f), fz = -Math.sin(f);
        people.forEach((p, i) => { const back = i ? 0.75 : 0, x = from.x + (to.x - from.x) * k - fx * back, z = from.z + (to.z - from.z) * k - fz * back; p.group.position.set(x, this._floorY(x, z) + (k < 1 ? 0.02 * Math.abs(Math.sin(t * 6 + i)) : 0), z); p.group.rotation.y = f; });
        const lead = people[0]?.group.position || to, sp = 0.18 + 0.08 * Math.sin(t * 40);
        PR.sparks.forEach((s, i) => { s.position.set(lead.x + (i - 1.5) * 0.12, (lead.y || 0) + 2.05 + 0.04 * Math.sin(t * 31 + i), lead.z); s.scale.setScalar(sp + 0.05 * Math.sin(t * 23 + i * 2)); });
        const b = people[1]?.group.position || lead; PR.sign.position.set(b.x, (b.y || 0) + 2.1, b.z); PR.sign.rotation.y = Math.atan2(ev.pos.x - b.x, ev.pos.z - b.z);
      },
      cam: () => { const p = people[0]?.group.position || to; ev._look(this._v1.set(ev.pos.x, ev.pos.y, ev.pos.z), this._v2.set(p.x, 1.8, p.z)); },
      then: () => { this._paradeOff(); for (const g of this._atTable()) g.dm += 1.5; ev._toast('The bottle is on your table, and the DJ gives it a shout.', 'up'); this._serve('champagne', { free: true, quiet: true }); },
      dispose: () => this._paradeOff() });
  }
  _paradeOff() { const PR = this.parade; if (!PR) return; PR.group.visible = false; for (const p of PR.people) p.group.visible = false; }

  // ---- the DJ, the floor, the dance --------------------------------------------------------------------------------------
  _djName() { const d = (this.ev.gs || []).find((q) => q.role === 'dj' && !q.gone) || this._extra('dj'); return d?.name || null; }
  _djAt() { const d = (this.ev.gs || []).find((q) => q.role === 'dj') || this._extra('dj'), p = d?.person?.group?.position; if (p) return p; const z = mid(this.ev.V?.zones?.dj); return z ? { ...z, y: 0 } : null; }
  _dj() {
    const ev = this.ev, M = ev.V?.moods || []; if (!M.length) { ev._toast('The DJ waves you off with a grin: no requests.', ''); return; }
    const dj = this._djName() || 'The DJ';
    ev._menu(`${dj} · the decks`, pick(['What do you want to hear?', 'Requests? Go on then.', 'Tell me what the room wants.']), M.map((m, i) => `${m.name}${i === this.moodI ? '  (on now)' : ''}`), (i) => {
      if (i === this.moodI) return; this._mood(i); this.reqAt = this._clock(); ev.R.mood = M[i].name;
      const k = moodKind(M[i].name), key = this.london ? { warm: 'lounge', throw: 'garage', last: 'lastOrders', peak: 'peak' }[k] : { throw: 'throwback' }[k] || k;
      ev._toast(`${/^dj\s/i.test(dj) ? dj : firstOf(dj)}: "${this._say('mood.' + key) || `${M[i].name}, coming up.`}"`, '');
    });
  }
  _danceMenu() {
    // (who is near you on the floor - and the one you were just talking to, wherever she is: she comes with you)
    const ev = this.ev, P = ev.pos, far = (g) => Math.hypot(g.person.group.position.x - P.x, g.person.group.position.z - P.z), last = ev.lastG;
    const L = this._people().filter((g) => !g.offended && !['dj', 'security', 'rep', 'agent', 'press', 'boss', 'eng'].includes(g.role) && (g === last || far(g) < 8)).sort((a, b) => (a === last ? -1 : b === last ? 1 : far(a) - far(b))).slice(0, 4);
    ev._menu('The dance floor', 'Twenty seconds on the beat: Space as each one lands.', ['On your own', ...L.map((g) => `With ${g.first}`), 'Not now'], (i) => { if (i === 0) this._dance(null); else if (i <= L.length) this._dance(L[i - 1]); });
  }
  _dance(g, counted = false) {
    const ev = this.ev; if (ev.game) return;
    const go = () => { const D = new Dance(this, g); D.counted = counted; this._play(D); };
    if (g) {
      if (g.gone || !g.person) return; const P = ev.pos, q = g.person.group.position;
      // (no dance bodies of her own: at your side, a little ahead, facing the floor with you)
      if (!this.hf.has(g)) { const sx = -Math.sin(ev.yaw), sz = Math.cos(ev.yaw); this._blink(() => { this._place(g, P.x + sx * 0.75 + Math.cos(ev.yaw) * 0.15, P.z + sz * 0.75 + Math.sin(ev.yaw) * 0.15, 0.3, ev.yaw); go(); }); return; }
      if (Math.hypot(q.x - P.x, q.z - P.z) > 1.6) { this._blink(() => { this._placeFront(g, 1.05); go(); }); return; }
    }
    go();
  }
  _danced(g, s, counted = false) {
    const ev = this.ev, Rp = this.Rp; s = Math.round(s * 100) / 100;
    Rp.danced.push({ cid: g?.cid || null, score: s });
    if (g) this._metNow(g);
    if (g) { if (g.cid && !this.XP.danced.includes(g.cid)) this.XP.danced.push(g.cid); g.dm += s * 3 - 0.5; if (!counted) { g.fx.dance = (g.fx.dance || 0) + 1; ev.R.fx.dance = (ev.R.fx.dance || 0) + 1; } if (g.kind === 'celeb' && !this.XP.flirted.includes(g.cid)) this.XP.flirted.push(g.cid); }
    ev._toast(s >= 0.75 ? (g ? `You and ${g.first} can actually dance.` : 'You can actually dance.') : s >= 0.45 ? (g ? `Not bad. ${g.first} is laughing.` : 'Not bad at all.') : (g ? `${g.first} is very kind about it.` : 'The less said, the better.'), s >= 0.45 ? 'up' : '');
    if (g) setTimeout(() => { if (this.on && !ev.talk) ev._bark(g, this._say(s >= 0.75 ? 'dance.great' : s >= 0.45 ? 'dance.good' : 'dance.off')); }, 700);
  }

  // ---- arriving: the rope, the step-and-repeat, the comp; the vault's stickers; the team's unit -------------------------
  _arrival() {
    const ev = this.ev, Rp = this.Rp, V = ev.V || {};
    if (this.team) { ev._toast(this.underage ? 'Team hospitality. Soft drinks for you tonight: you are under age here.' : 'The debrief is done. Team hospitality, the race on the big screen.', ''); return; }
    if (this._comp() && !Rp.table) { Rp.table = true; Rp.comped = true; setTimeout(() => this.on && ev._toast(this.brand ? "You are on the host's table tonight." : (this._say('door.comp') || 'The club wants your picture: the table is on the house.'), 'up'), 2600); }
    if (this.london) { Rp.stickers = true; this._moment({ id: 'arrive', dur: 4, min: 1.5, caption: "Down the stairs to the vault. The host puts a little sticker over your phone's camera: nothing gets out of here." }); return; }
    if (V.wall) this._wall(false); else this._moment({ id: 'arrive', dur: 3.5, min: 1.2, caption: this._moment_('arrival') || 'The rope lifts before you reach it.' });
  }
  _sideOk() { return !!(this.brand || this.o.contractual || this.Rp.table || this.Rp.comped || this.fame >= 70); }
  _wall(again) {
    const ev = this.ev, Rp = this.Rp;
    if (again && Rp.wallAgain) { ev._toast('They have their pictures.', ''); return; }
    const I = ['Stop and pose', 'A wave, and straight in'], A = [() => this._pose(again), () => ev._toast('A wave to the photographers, and straight in.', '')];
    if (!again && this._sideOk()) { I.push('The side entrance'); A.push(() => { Rp.sideIn = true; ev._toast('In through the side, past the kitchens. Nobody saw a thing.', ''); }); }
    const brand = this.brand ? (BRAND_BY_ID[this.brand]?.brand || 'the host') + "'s" : "the club's";
    ev._menu(again ? 'The step-and-repeat' : 'The step-and-repeat · the way in', again ? 'They are still out there, three deep.' : `Photographers three deep behind the barrier, ${brand} logo on the wall. The door host already knows your face.`, I, (i) => A[i]?.());
  }
  _pose(again) {
    const ev = this.ev, Rp = this.Rp, W = ev.V?.wall, S = W?.stand;
    Rp.posed = true; if (again) Rp.wallAgain = true; Rp.flashes += 3;
    const cams = Array.isArray(W?.cams) && W.cams.length ? W.cams : null, look = cams ? cams[(cams.length / 2) | 0] : null;
    if (S) this._blink(() => { ev.pos.x = S.x; ev.pos.z = S.z; if (S.yaw != null) ev.yaw = S.yaw; ev.pitch = -0.02; });
    this._moment({ id: 'wall', dur: 4.2, min: 1.6, flashes: [0.6, 1.2, 1.8, 2.6, 3.3], flashAt: cams, caption: this._moment_('wall') || 'Three steps, a turn, a smile.',
      cam: look ? () => ev._look(this._v1.set(ev.pos.x, ev.pos.y, ev.pos.z), this._v2.set(look.x, look.y ?? 1.6, look.z)) : null,
      start: () => { const p = this._say('paps'); if (p) setTimeout(() => this.on && ev._toast(p, ''), 500); },
      then: () => { if (look) this._shotOfMe(look, 5); ev._toast('Photographers remember a face. They will be waiting later, too.', ''); } });   // (the agency's frame of you at the wall: the morning's picture)
  }

  // ---- the team's own night: the few words, the mechanics, the crew, the champagne, the shoey -----------------------------
  _bossAt() { const b = (this.ev.gs || []).find((g) => g.role === 'boss') || this._extra('boss'); return b?.person?.group?.position || null; }
  _speech() {
    const ev = this.ev, XP = this.XP, Rp = this.Rp; Rp.speech = true; XP.speech = true;
    // (points only when there were points: a finish outside the top ten has its own few words)
    const p = XP.pos == null ? null : num(+XP.pos, null), k = XP.won ? 'win' : XP.podium ? 'podium' : XP.dnf ? 'dnf' : p == null || (p >= 1 && p <= 10) ? 'points' : 'back', at = this._bossAt();
    const line = this._say('speech.' + k) || 'Thank you, everyone.';
    const go = () => this._moment({ id: 'speech', dur: 6.5, min: 2, caption: `${this._moment_('speech') || 'The boss taps a glass.'} '${line}'`, cam: at ? () => ev._look(this._v1.set(ev.pos.x, ev.pos.y, ev.pos.z), this._v2.set(at.x, 1.6 + (at.y || 0), at.z)) : null,
      then: () => {
        Rp.toast = true; ev.snd?.clink?.();
        if (XP.won && !Rp.champagne) { Rp.champagne = true; Rp.selfies++; this._moment({ id: 'champagne', dur: 5, min: 1.6, flashes: [1.2, 2.4], caption: this._moment_('champagne') || 'Champagne over the engineers, then the team photo with the trophy.' }); this.after.push(() => this._keepPhoto(this._teamPic(), 3)); }
      } });
    // (you are in the room for it: still by the door, you are a few steps in front of him by the time he taps the glass)
    const B = (ev.gs || []).find((g) => g.role === 'boss' && g.person), spot = at && B && Math.hypot(at.x - ev.pos.x, at.z - ev.pos.z) > 5 ? this._before(B, at) : null;
    if (spot) this._blink(() => { ev.pos.x = spot.x; ev.pos.z = spot.z; ev.yaw = Math.atan2(at.z - spot.z, at.x - spot.x); ev.pitch = -0.05; go(); });
    else go();
  }
  /** a free place a few steps in front of a person (where they face), for you to stand -> { x, z } | null */
  _before(g, at) {
    const ev = this.ev, f = g.face0 ?? g.person.group.rotation.y, fx = Math.cos(f), fz = -Math.sin(f);
    for (const d of [2.6, 3.2, 2.1, 3.8]) for (const s of [0, 0.7, -0.7, 1.3, -1.3]) { const x = at.x + fx * d - fz * s, z = at.z + fz * d + fx * s; if (ev._free(x, z, 0.3)) return { x, z }; }
    return null;
  }
  _mechanics() {
    const ev = this.ev; this.flags.mechanics = true; this.Rp.mechanics = true; this.XP.mechanics = true;
    this._blink(() => { try { ev.crowd?.arrive?.('mechanic'); ev.crowd?.snap?.(); } catch (_) { /* */ } });
    ev._toast(this._moment_('mechanics') || 'The mechanics are here - the pack-down is done.', 'up'); ev.snd?.hit?.(900, 0.5, 0.05, 0.6);
    const i = this._autoMood(); if (i >= 0 && i !== this.moodI) this._mood(i);
  }
  _crew(then = null) {
    const ev = this.ev, Rp = this.Rp; if (Rp.crewThanked) { if (then) then(); else ev._toast('You have thanked them all. They are nearly packed.', ''); return; }
    Rp.crewThanked = true; this.XP.crewThanked = true;
    // (the camera on the garage door and the crates being taped up behind it)
    let G = mid(ev.V?.zones?.garage) || (ev.hots || []).find((h) => h.kind === 'garage')?.p || null; if (G && Math.hypot(G.x - ev.pos.x, G.z - ev.pos.z) < 1.5) G = null;
    this._moment({ id: 'crew', dur: 5, min: 1.6, caption: this._moment_('crew') || 'You thank every one of them by name.', cam: G ? () => ev._look(this._v1.set(ev.pos.x, ev.pos.y, ev.pos.z), this._v2.set(G.x, 1.3, G.z)) : null, then: then || (() => ev._toast(`"${this._say('crew.thanks') || 'Cheers. Means a lot.'}"`, 'up')) });
  }
  _shoey() {
    const Rp = this.Rp; if (Rp.shoey || this.underage) return; Rp.shoey = true; this.XP.shoey = true;
    this._serve('champagne', { free: true, quiet: true }); Rp.selfies++;
    // (framed on your own people: your team-mate (else the engineer, the boss) in front of you, phones up round you)
    const ev = this.ev, m = this._teamPic(), mp = m?.person?.group?.position || null;
    const cam = mp ? () => ev._look(this._v1.set(ev.pos.x, ev.pos.y, ev.pos.z), this._v2.set(mp.x, 1.5 + (mp.y || 0), mp.z)) : null;
    const go = () => this._moment({ id: 'shoey', dur: 4.5, min: 1.5, flashes: [1.6, 2.4], cam, caption: this._moment_('shoey') || 'A race boot, a pour of champagne, and down in one.' });
    if (mp && Math.hypot(mp.x - ev.pos.x, mp.z - ev.pos.z) > 2.2) this._blink(() => { this._placeFront(m, 1.2); go(); }); else go();
    this.after.push(() => this._keepPhoto(this._teamPic(), 4));   // (everyone filmed it: the picture with your team-mate - over any selfie)
  }
  /** who is in the team's picture with you: your team-mate, else your engineer, else the boss */
  _teamPic() { const gs = (this.ev.gs || []).filter((g) => g.person && !g.gone); return gs.find((g) => g.role === 'mate') || gs.find((g) => g.role === 'eng') || gs.find((g) => g.role === 'boss') || null; }
  /**
   * A picture to keep from the night, for the morning after's NIGHT tab: you and g side by side (Hangout's own photo,
   * _snap), the best so far by rank (3 a star's selfie, 2 the influencer's or the team's, 1 a fan's) - nothing from
   * inside the London club (stickers on every lens). Kept as R.party.photoUrl, scaled down to 560 px once decoded.
   */
  _keepPhoto(g, rank = 1) {
    const ev = this.ev; if (!this.on || this.london || !g?.person || g.gone || typeof ev._snap !== 'function' || (this.photoRank || 0) >= rank) return;
    // (the people round you make room for the phone - nobody's arm across your face)
    try { const P = ev.pos; for (let i = 0; i < 24 && ev.crowd?.push; i++) ev.crowd.push(P.x, P.z, 1.4); } catch (_) { /* (no crowd) */ }
    let url = null; try { url = ev._snap(g); } catch (e) { url = null; } this._storePhoto(url, rank);
  }
  /**
   * The photographers' picture of you (the step-and-repeat, the front door): you, as their lens at `from` (the place's
   * frame: { x, y?, z }) sees you where you stand - the picture the papers and the agencies have in the morning. Ranks
   * over a selfie (5 the wall, 6 the exit); outside (the street) even in London, where the stickers are only on the inside.
   */
  _shotOfMe(from, rank, outside = false, at = null) {
    const ev = this.ev, me = ev.me; if (!this.on || !me?.group || !from || (this.london && !outside) || (this.photoRank || 0) >= rank || !ev.renderer) return;
    const R = ev.renderer, W3 = ev.host ? ev.host.scene : ev.scene, cam = ev.photoCam || (ev.photoCam = new THREE.PerspectiveCamera(60, 1, ev.host ? 0.08 : 0.05, ev.host ? ev.cam.far : 2600));
    const P = at && Number.isFinite(+at.x) ? { x: +at.x, z: +at.z } : ev.pos, g = me.group, was = [g.position.clone(), g.rotation.y, g.visible], fov = cam.fov;
    // (the flash: you lit as their strobes light you - every material's own colour as its glow for this one frame; no
    // light is added, so nothing compiles again)
    const lit = []; for (const m of Object.values(me.mats || {})) if (m?.emissive && m.color) { lit.push([m, m.emissive.clone()]); m.emissive.copy(m.color).multiplyScalar(0.5); }
    let url = null;
    try {
      try { for (let i = 0; i < 12 && ev.crowd?.push; i++) ev.crowd.push(P.x, P.z, 1.2); } catch (_) { /* (no crowd) */ }
      g.position.set(P.x, this._floorY(P.x, P.z) || 0, P.z); g.rotation.y = facing(+from.x - P.x, +from.z - P.z); g.visible = true; g.updateMatrixWorld(true);
      // (the lens a step in front of the photographers, over their heads - not inside one of them)
      const dx = P.x - +from.x, dz = P.z - +from.z, d = Math.hypot(dx, dz) || 1, k = Math.min(0.7, d * 0.4) / d;
      cam.aspect = ev.cam.aspect; cam.fov = 38; cam.position.copy(ev._toW(this._v1.set(+from.x + dx * k, Math.max(1.6, from.y ?? 1.6) + (g.position.y || 0), +from.z + dz * k))); cam.lookAt(ev._toW(this._v2.set(P.x, 1.15 + (g.position.y || 0), P.z))); cam.updateProjectionMatrix();
      ev.scene.updateMatrixWorld(true); R.render(W3, cam); url = ev.glc.toDataURL('image/jpeg', 0.82);
    } catch (e) { url = null; }
    for (const [m, e] of lit) m.emissive.copy(e);
    g.position.copy(was[0]); g.rotation.y = was[1]; g.visible = was[2]; cam.fov = fov; cam.updateProjectionMatrix();
    try { R.render(W3, ev.cam); } catch (_) { /* */ }
    this._storePhoto(url, rank);
  }
  _storePhoto(url, rank) {
    if (typeof url !== 'string' || url.length < 2000) return;
    const Rp = this.Rp; this.photoRank = rank; Rp.photoRank = rank; Rp.photoUrl = url;
    const im = new Image();
    im.onload = () => { try { if (Rp.photoUrl !== url) return; const w = Math.min(560, im.width), h = Math.round((im.height * w) / im.width), cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').drawImage(im, 0, 0, w, h); Rp.photoUrl = cv.toDataURL('image/jpeg', 0.8); } catch (_) { /* (kept full size) */ } };
    im.src = url;
  }

  // ---- out of the night: the shout-out, rounds sent over, the 3 am text, the blackjack hand ------------------------------
  _shout() {
    const ev = this.ev, Rp = this.Rp, XP = this.XP, at = this._djAt();
    Rp.shout = true; if (this.vegas) Rp.flashes += 1;
    try { ev.V?.led?.say?.(lastOf(ev.meName).toUpperCase(), 8); } catch (_) { /* */ }
    this._moment({ id: 'shout', dur: 4.2, min: 1.4, flashes: this.vegas ? [1.4] : [], caption: this._moment_('shout') || `The DJ cuts the track and says your name. The room turns.`,
      cam: at ? () => ev._look(this._v1.set(ev.pos.x, ev.pos.y, ev.pos.z), this._v2.set(at.x, 1.9 + (at.y || 0), at.z)) : null });
    void XP;
  }
  _roundOver() {
    const ev = this.ev, busy = this._clock() < this.waterTill || this._capped();
    // (a brand's table only on a brand's night; what comes over is what the line says)
    const L = (PARTY_BARK.round?.offer || []).filter((s) => this.brand || !/\{brand\}/.test(s)), text = this._fill(pick(L)) || 'Shots, from another table.';
    const kind = /shot/i.test(text) ? 'shot' : /lads|round/i.test(text) ? (this.london ? 'beer' : 'shot') : 'champagne';
    this._card({ head: 'Sent over', text: `${text}${busy ? ' You still have a water on the go.' : ''}`, a: busy ? 'Hold up the water' : 'Accept', b: 'Decline politely', color: '#f5b400',
      pick: (i) => {
        if (i === 0 && !busy) { this.Rp.rounds.took++; this._serve(kind, { free: true, text: `${this._say('round.yes') || 'Cheers to them!'}` }); }
        else { this.Rp.rounds.declined++; if (!busy) for (const g of ev.gs || []) if (!g.gone && this._showy(g)) g.dm -= 0.5; ev._toast(busy ? 'You raise the water. They laugh.' : (this._say('round.no') || 'A polite no.'), ''); }
      } });
  }
  _exText() {
    const ev = this.ev, c = ev.c; let id = null;
    try { const B = c?.celebs?.bonds || {}; id = Object.keys(B).find((k) => B[k]?.stage === 'ex' && !(ev.gs || []).some((g) => g.cid === 'c:' + k)) || null; } catch (_) { id = null; }
    if (!id) return false; const C = Celebs.CELEB?.[id]; if (!C) return false;
    const draft = pick(PARTY_PHONE?.exDraft) || 'You up?';
    this._card({ head: `Messages · ${hhmm(this._clock())}`, text: `${firstOf(C.name)}. Your thumb over the keyboard: "${draft}"`, a: 'Send it', b: 'Put the phone away', color: '#c83a6a',
      pick: (i) => { if (i === 0) { this.Rp.textedEx = id; ev._toast(pick(PARTY_PHONE?.exNone) || 'Delivered. Read. Nothing.', 'warn'); } else ev._toast('Phone away. Good call.', 'up'); } });
    return true;
  }
  _blackjack() {
    const ev = this.ev, Rp = this.Rp;
    if (this.underage) { ev._toast('The dealer shakes her head. Twenty-one and over.', 'warn'); return; }
    if (Rp.blackjack) { ev._toast('You have had your hand. Walk on, while you can.', ''); return; }
    const S = [0.005, 0.01, 0.025, 0.05];
    ev._menu('Blackjack · one hand', 'The dealer squares the shoe. "Want in?"', [...S.map(money), 'Walk on by'], (i) => {
      const st = S[i]; if (!st) return;
      // (a single hand at a fair table: a natural pays 3:2; the house keeps about half a percent)
      const r = Math.random(), net = r < 0.045 ? st * 1.5 : r < 0.445 ? st : r < 0.5275 ? 0 : -st;
      Rp.blackjack = { stake: st, net: +net.toFixed(4) }; if (net < 0) Rp.spend += -net; else if (net > 0) Rp.spend -= net;
      ev._toast(net > st ? `Blackjack! ${money(net)} up - you settle it with a toast.` : net > 0 ? `Twenty beats eighteen: ${money(net)} up. A toast, and you walk.` : net === 0 ? 'A push. Your chips back, and a toast to nothing.' : `Dealer makes twenty-one. ${money(st)} gone - you toast it anyway.`, net > 0 ? 'up' : net < 0 ? 'down' : '');
    });
  }
  _card(o) {
    const ev = this.ev, el = this.dom?.card; if (!el) { o.pick?.(1); return; }
    this.card = { ...o, t: 0, dur: 10 };
    el.style.setProperty('--pc', o.color || '#f5b400');
    el.innerHTML = `<header>${esc(o.head)}</header><p>${esc(o.text)}</p><div><button type="button" data-b="0"><kbd>1</kbd>${esc(o.a)}</button><button type="button" data-b="1"><kbd>2</kbd>${esc(o.b)}</button></div><s><u></u></s>`;
    el.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => this._cardPick(+b.dataset.b)));
    el.classList.add('in'); ev.snd?.buzz?.();
  }
  _cardTick(dt) { const C = this.card; C.t += dt; const u = this.dom?.card?.querySelector('s u'); if (u) u.style.transform = `scaleX(${Math.max(0, 1 - C.t / C.dur).toFixed(3)})`; if (C.t >= C.dur) this._cardPick(1); }
  _cardPick(i) { const C = this.card; if (!C) return; this.card = null; this.dom?.card?.classList.remove('in'); try { C.pick?.(i); } catch (e) { console.warn('PartyPlay: a card', e); } }
  /** a card put away unanswered (the door opening, the night ending): no yes, no polite no - nobody is snubbed */
  _cardDrop() { if (!this.card) return; this.card = null; this.dom?.card?.classList.remove('in'); }

  // ---- drama: the incidents, the approach, the talk, the row or the scuffle ----------------------------------------------
  /** the night's extras (a resident DJ, security, the reserved antagonist): Hangout's ev.xs (a list or by role), else none */
  _extras() {
    const out = [], add = (k, v) => { if (v && !out.includes(v) && !(this.ev.gs || []).includes(v)) out.push(v.role ? v : Object.assign(v, { role: k })); };
    for (const S of [this.ev.cast, this.ev.xs]) { if (!S) continue; if (Array.isArray(S)) S.forEach((v) => add(v?.role, v)); else for (const [k, v] of Object.entries(S)) add(k, v); }
    return out;
  }
  _extra(role) { return (this.ev.gs || []).find((g) => g.role === role && !g.gone) || this._extras().find((x) => x.role === role) || this.ev.cast?.[role] || null; }
  _ant(g) { return !!g && (g.role === 'antagonist' || g.tier === 'reserved' || ['stranger', 'fan', 'exnew', 'dateex'].includes(g.role)); }
  _antagonist() {
    if (this.ant) return this.ant.gone ? null : this.ant;
    const g = (this.ev.gs || []).find((q) => this._ant(q) && q.person);
    if (g) return (this.ant = g);
    const A = this._extras().find((x) => this._ant(x) && x.person) || this.ev.cast?.antagonist;
    if (!A?.person) return null;
    // (Hangout's cast is guest-shaped already: him, as he is - invented, never a real person)
    if (A.fx && typeof A.dm === 'number' && Array.isArray(A.used)) { A.real = false; A.fictional = true; A.tier = A.tier || 'reserved'; if (A.n) A.n.real = false; return (this.ant = A); }
    const name = A.name || 'A stranger', P = A.person.group;
    this.ant = { kind: 'person', role: A.role || 'antagonist', tier: 'reserved', id: A.id || 'antagonist', cid: A.cid || 'p:antagonist', name, first: A.first || firstOf(name), person: A.person, opts: A.opts || A.look || {}, spot: A.spot || { x: P.position.x, z: P.position.z, face: P.rotation.y, y: P.position.y },
      n: { kind: 'person', role: A.role || 'antagonist', name, first: A.first || firstOf(name), real: false }, dm: 0, talks: 0, used: [], fx: {}, gone: false, offended: false, shaken: 0, real: false, fictional: true, disc: null, face0: P.rotation.y, talked: false };
    return this.ant;
  }
  _dramaPerson(D) {
    const gs = this.ev.gs || [], XP = this.XP, tid = talkId(D.id);
    if (D.cid) { const g = gs.find((q) => q.cid === D.cid); if (g?.person) return g; const x = this._extras().find((q) => q.cid === D.cid); if (x?.person) return this._antagonist(); }
    switch (tid) {
      case 'needle': return gs.find((q) => q.role === 'rival' && !q.gone && (!XP.fought || q.id === XP.fought)) || gs.find((q) => q.role === 'rival' && !q.gone) || null;
      case 'feud': return gs.find((q) => q.role === 'mate' && !q.gone) || null;
      case 'overheard': return gs.find((q) => q.role === 'press' && !q.gone) || null;
      case 'spill': case 'dateex': case 'exnew': case 'fan': return this._antagonist();
      default: return null;
    }
  }
  /** an incident from the plan: false when it could not happen after all (nobody to have it with) */
  _incident(D) {
    const ev = this.ev, tid = talkId(D.id);
    if (tid === 'paps') { this.flags.sideTip = true; this._card({ head: 'Messages · your PR manager', text: 'Photographers out front, a lot of them. Use the side door when you go.', a: 'Thumbs up', b: 'Ignore it', color: '#3fb0ff', pick: () => {} }); this.Rp.drama.push({ id: D.id, cid: 'p:pr', choice: null, outcome: 'calm', out: 'side' }); return true; }
    if (tid === 'overheard' && !this._heard()) return false;
    const g = this._dramaPerson(D); if (!g?.person) return false;
    if (tid === 'exnew') { this.XP.exHere = true; const ex = (ev.gs || []).find((q) => q.cid === D.with) || (ev.gs || []).find((q) => q.kind === 'celeb' && (q.role === 'ex' || this._stage(q) === -1)); ev._toast(`${ex ? ex.first : 'Your ex'} has just walked in - with someone new.`, 'warn'); }
    if (tid === 'spill') ev._toast('Someone lurches into you: a drink down your shirt.', 'warn');
    if (tid === 'fan') ev._toast('A hand on your arm, a phone already up for a selfie.', 'warn');
    this._approach(g, () => this._dramaTalk(g, D.id, D));
    return true;
  }
  /** someone comes over to you (a blink, and they are in front of you - the reserved antagonist shown now) */
  _approach(g, then) { this._blink(() => { if (g.person) g.person.group.visible = true; g.gone = false; this._placeFront(g, this._ant(g) ? 0.95 : 1.15); if (this._ant(g)) this._securityNear(); then?.(); }); }
  /** the security man has seen it start: he is a few metres off by the time it might kick off (under a blink) */
  _securityNear() {
    const S = this._extra('security'), ev = this.ev, P = ev.pos; if (!S?.person?.group?.visible) return;
    const p = S.person.group.position; if (Math.hypot(p.x - P.x, p.z - P.z) < 6.5) return;
    const sx = -Math.sin(ev.yaw), sz = Math.cos(ev.yaw);   // (to your side, so he is not in the stare-down's frame)
    for (const s of [1, -1]) if (this._place(S, P.x + sx * 4.2 * s - Math.cos(ev.yaw) * 0.8, P.z + sz * 4.2 * s - Math.sin(ev.yaw) * 0.8, 0.8, null)) { S.person.group.rotation.y = facing(P.x - S.person.group.position.x, P.z - S.person.group.position.z); return; }
  }
  _dramaTalk(g, id, D = null) {
    const ev = this.ev, x = ev.x || {}; if (ev.talk || ev.game || !g?.person) return;
    const tid = talkId(id), role = this._ant(g) ? (PARTY_DRAMA?.[tid]?.role || g.role) : g.role;
    const n = { ...(g.n || { kind: g.kind, name: g.name, first: g.first }), role, cid: g.cid, talks: 0, other: null };
    x.other = null; x.others = (ev.gs || []).map((o) => o.name); this.XP.drama = tid; this.XP.dramaCid = g.cid; this.XP.private = false;
    let tree = null; try { tree = HT.hangoutDrama?.(x, n, tid, g.used || []) || null; } catch (e) { console.warn('PartyPlay: a drama talk', e); tree = null; }
    if (!tree) {
      const F = DRAMA_FALLBACK[tid]; if (!F) { this.XP.drama = null; this.XP.dramaCid = null; return; }
      tree = { id: 'drama-' + tid + '-builtin', drama: tid, say: F.say, opts: F.opts.map((o) => ({ t: o.t, tone: o.tone, r: o.r, fx: fxOf(o.fx), out: o.out, quote: o.quote, m: o.m })) };
    }
    (g.used || (g.used = [])).push(tree.id);
    ev._unlock(); ev.keys?.clear(); ev.$('.hg-sub')?.classList.remove('in'); ev.subT = 0;
    ev.talk = { g, step: 0, queue: [], after: null, opts: null, typed: 0, line: null, hold: 0, dm: 0, closing: false };
    const P = ev.$('.hg-talk'); P.querySelector('.who').innerHTML = `${esc(g.name)}<small>${esc(this.why(g) || PARTY_DRAMA?.[tid]?.label || '')}</small>`; P.classList.add('in', 'pp-drama');
    this.drama = { id: tid, planId: D?.id || id, g, open: true, choice: null, scuffle: false, row: false, out: null, brawl: D?.brawl !== false && !(D?.real) };
    ev._queue([tree.say], tree.opts);
  }
  _real(g) { if (!g) return false; if (g.fictional === true || g.real === false || this._ant(g)) return false; if (g.real === true) return true; return g.kind === 'driver'; }
  _provoked(g, o) {
    const D = this.drama; if (!D) return;
    // (a row: the talk goes on to its second level when the tree has one - walk away, a truce, security waved over - and
    //  ends there otherwise; only a scuffle cuts it short)
    const more = !!o.then && (this.ev.talk?.step || 0) === 0;
    // (a real driver on either side - him, or you - keeps it to words)
    if (this._real(g) || !D.brawl || this.realMe) { D.row = true; if (!more) o.end = true; this.flags.row = g.cid; return; }
    const p = flag('__partyBrawl') ? 1 : 0.55 + (this.tier >= 3 ? 0.3 : this.tier >= 2 ? 0.15 : 0) + (D.id === 'spill' || D.id === 'dateex' ? 0.1 : 0);
    if (Math.random() < p) { D.scuffle = true; o.end = true; } else D.row = true;
  }
  _scuffle(g, started) {
    const ev = this.ev; if (ev.game || !g?.person || this._real(g) || (this.realMe && !flag('__partyBrawl'))) return;
    const seps = [], S = this._extra('security'), P = ev.pos;
    if (S?.person) seps.push({ name: S.name || 'Security', kind: 'security', person: S.person, opts: S.opts || S.look, holds: 'tgt', disc: S.disc || null });
    for (const q of ev.gs || []) {
      if (q === g || q.gone || !q.person?.group?.visible || seps.length >= 4) continue; const k = q.role === 'mate' ? 'mate' : (q.role === 'friend' || q.role === 'exmate') ? 'friend' : q.role === 'boss' ? 'boss' : null; if (!k) continue;
      if (Math.hypot(q.person.group.position.x - P.x, q.person.group.position.z - P.z) < 10) seps.push({ name: q.first, kind: k, person: q.person, opts: q.opts, holds: 'you', disc: q.disc || null });
    }
    // (the principals in it are the scuffle's while it plays: Hangout's own turning of heads and bodies leaves them alone)
    const stash = (ev.gs || []).filter((q) => q.person && (q === g || seps.some((s) => s.person === q.person))); for (const q of stash) { q._ppPerson = q.person; q.person = null; } this.stash = stash;
    let sleeve = null; try { const m = ev.me?.mats || {}; const k = ['top', 'shirt', 'jacket', 'cloth', 'suit'].find((x) => m[x]?.color); if (k) sleeve = '#' + m[k].color.getHexString(); } catch (_) { /* */ }
    try {
      this.brawl = new PartyBrawl({ ev, foe: { name: g.name, person: g.person || g._ppPerson, opts: g.opts, cid: g.cid, disc: g.disc || null }, started: !!started, seps, qte: this.tier >= 3 ? 0.8 : 1, sleeve, onDone: (out) => this.after.push(() => this._afterBrawl(g, out)) });
      this._play(this.brawl);
    } catch (e) { console.warn('PartyPlay: the scuffle could not start', e); this._unstash(); this.brawl = null; }
  }
  _unstash() { for (const q of this.stash || []) { if (q._ppPerson) { q.person = q._ppPerson; q._ppPerson = null; } } this.stash = null; }
  _afterBrawl(g, out) {
    const ev = this.ev; this._unstash(); this.brawl = null;
    const fx = partyBrawlFx(out, { venue: this.vid, cid: g.cid, leak: 0.35 }); if (!fx) return;
    const last = this.Rp.drama[this.Rp.drama.length - 1];
    if (!fx.ejected) { if (last && last.cid === g.cid) last.outcome = 'walked'; this._blink(() => { if (g.person) g.person.group.visible = false; g.gone = true; }); ev._toast(`Security walks ${g.first} out. A few people clap.`, 'up'); return; }
    this.Rp.brawl = fx; if (last && last.cid === g.cid) last.outcome = 'scuffle'; else this.Rp.drama.push({ id: 'scuffle', cid: g.cid, choice: null, outcome: 'scuffle', out: 'scuffle' });
    if (fx.police) setTimeout(() => this.on && ev._toast(this._moment_('police') || 'Two police officers take statements by the door. No arrests.', 'warn'), 600);
    this._exit('ejected');
  }

  // ---- the kiss, leaving together ---------------------------------------------------------------------------------------
  _kiss(g, counted = false) {
    const ev = this.ev, Rp = this.Rp; if (!g?.person || g.gone || g.kind !== 'celeb' || this._stage(g) < STAGE_I.flirting) return;
    try { if (ev.aff?.talkKiss?.(g, counted)) return; } catch (_) { /* affection hook */ }
    const priv = this.isPrivate(g), z = this.zoneK, P = ev.pos, privacy = num(ev.P?.privacy, 0.25);
    const seen = flag('__partyPaps') ? !priv : this.london ? Math.random() < 0.06 : priv ? false : Math.random() < (z === 'floor' ? 0.6 : 0.35) * (1 - privacy) + 0.1;
    const by = priv ? [] : (ev.gs || []).filter((q) => q !== g && q.person?.group?.visible && !q.gone && Math.hypot(q.person.group.position.x - P.x, q.person.group.position.z - P.z) < 12).map((q) => q.cid);
    Rp.kiss = g.cid; Rp.kissSeen = !!seen; Rp.kissSeenBy = by; Rp.kissPrivate = !!priv; this.XP.kissed = g.cid; g.dm += 2; if (!counted) { g.fx.kiss = (g.fx.kiss || 0) + 1; ev.R.fx.kiss = (ev.R.fx.kiss || 0) + 1; } if (priv) g.ppPriv = (g.ppPriv || 0) + 1;
    const cap = this._moment_(priv ? 'kiss.private' : 'kiss.floor', g) || `${g.first} leans in. A kiss - brief, and then she is laughing at something you said.`;
    this._moment({ id: 'kiss', dur: 5, min: 2, caption: cap,
      // (the cut-away: out on the terrace the city it looks over, inside the lights over the floor - never the two of you)
      // (outside: along the skyline, well clear of the Sphere - whatever its show is doing, never in this shot)
      cam: (t) => { const TL = this.outside ? ev.V?.terrace?.look : null; if (TL && Number.isFinite(+TL.x) && !this.vegas) { ev._look(this._v1.set(P.x, P.y, P.z), this._v2.set(+TL.x, num(+TL.y, P.y) + t * 0.6, +TL.z)); return; } if (TL && Number.isFinite(+TL.x)) { const a = Math.atan2(+TL.z - P.z, +TL.x - P.x) + 0.8; ev._look(this._v1.set(P.x, P.y, P.z), this._v2.set(P.x + Math.cos(a) * 40, P.y + 1.5 + t * 0.6, P.z + Math.sin(a) * 40)); return; } const a = ev.yaw + 0.9; ev._look(this._v1.set(P.x, P.y, P.z), this._v2.set(P.x + Math.cos(a) * 6, P.y + 3.5 + t * 0.15, P.z + Math.sin(a) * 6)); },
      then: () => { if (seen) ev._toast(this.london ? 'Somebody in here has a phone without a sticker.' : 'A phone came up somewhere on the floor.', 'warn'); } });
  }
  _leaveWith() { return (this.ev.gs || []).filter((g) => g.kind === 'celeb' && g.role !== 'dj' && g.person && !g.gone && !g.offended && !this.ev.aff?.leaveHold?.(g) && (g.together || this._stage(g) >= STAGE_I.flirting)); }
  _leaveWithMenu(L) { this.ev._menu('Leave with...', 'Who is sharing your car?', L.slice(0, 6).map((g) => g.name), (i) => { const g = L[i]; if (g) this._exit('together', g); }); }
  _friends() { return (this.ev.gs || []).filter((g) => g.person && !g.gone && !g.offended && (g.role === 'mate' || g.role === 'friend' || g.role === 'exmate' || (g.kind === 'celeb' && g.role !== 'dj' && this._stage(g) >= STAGE_I.friendly))); }

  // ---- the way out --------------------------------------------------------------------------------------------------------
  /** a door hotspot: the side exit, the lifts to the front, or the door's menu */
  _doorAt(h) {
    if (h?.id === 'side' && !this.team) { if (this._sideOk()) this.ev._menu('The side exit', 'Staff and the VIP tables only. Out this way?', ['Out through the side', 'Not yet'], (i) => { if (i === 0) this._exit('side'); }); else this.ev._toast('Staff and the VIP tables only, sir.', ''); return; }
    this.door(false);
  }
  /** 'On to the club' from the team party: the launch says a club is on tonight, or a club offer is still open - never under age */
  _canMoveOn() {
    if (!this.team || this.Rp.act !== 1 || this.underage) return false; if (this.o.next === false || this.o.moveOn === false) return false; if (this.o.next || this.o.moveOn) return true;
    const F = this.ev.c?.party?.offers; return Array.isArray(F) && F.some((f) => f && f.venue && f.venue !== 'teamparty' && (f.status == null || f.status === 'open') && f.ok !== false);
  }
  /** how likely a photographer gets you on the way out: drink x fame x lateness x the arrival pose x (1 - privacy) */
  _exitRoll(kind) {
    if (kind === 'moveon') return { photographed: false, stumble: false };
    const base = { front: 0.95, side: 0.25, hotel: 0.6, together: 0.85, breakfast: 0.7, carried: 0.9, ejected: 0.85, teamcar: 0.15 }[kind] ?? 0.5;
    const out = this.team ? 0.35 : this.london ? 0.55 : 0.75, fameK = 0.35 + this.fame / 100, lateK = 1 + 0.1 * Math.max(0, this._h24() - 26), poseK = this.Rp.posed ? 1.3 : this.Rp.sideIn ? 0.6 : 1, lvK = 0.85 + 0.05 * Math.min(8, this.level);
    const p = flag('__partyPaps') ? 1 : clamp(base * out * fameK * lateK * poseK * lvK, 0, 0.95);
    const st = this.realMe ? 0 : this.tier >= 4 || kind === 'carried' ? 1 : this.tier >= 3 ? 0.6 : this.tier >= 2 ? 0.25 : 0;
    return { photographed: Math.random() < p, stumble: Math.random() < st };
  }
  _exit(kind, g = null) {
    const ev = this.ev, Rp = this.Rp; if (this.exiting || ev.closing) return; this.exiting = kind;
    if (this.card) this._cardDrop(); if (this.who) this._whoClose();
    const h = this._clock(), h24 = this._h24(), V = ev.V || {};
    Rp.exit = kind === 'together' && g ? 'together:' + g.cid : kind; Rp.early = (kind === 'hotel' || kind === 'teamcar') && h < this.late;
    Rp.leftAt = +(h24 + (kind === 'breakfast' ? 1 : 0)).toFixed(2);
    const roll = this._exitRoll(kind); Rp.photographed = Rp.photographed || roll.photographed; Rp.stumble = Rp.stumble || (roll.stumble && kind !== 'moveon' && kind !== 'teamcar' && this.tier >= 2);
    this.XP.photographed = !!Rp.photographed;
    if (kind === 'carried' || kind === 'ejected') for (const q of ev.gs || []) if (q.person?.group?.visible && !q.gone && q.cid) this.seenDrunk.add(q.cid);
    Rp.fans = !this.team && h24 >= 27.5 && kind !== 'moveon';
    if (kind === 'breakfast') Rp.breakfast = this._friends().map((q) => q.cid);
    if (kind === 'moveon') Rp.next = 'club';
    const mate = (ev.gs || []).find((q) => q.role === 'mate' && !q.gone), fr = this._friends()[0], helper = mate?.first || fr?.first || null;
    const fans = Rp.fans ? ` ${this._moment_('fans') || 'Fans at the barrier with caps and pens, even now.'}` : '';
    const flashes = roll.photographed && !this.team && kind !== 'moveon' ? (REDUCED ? [0.9] : [0.8, 1.3, 2.0]) : kind === 'front' && !this.team ? [1.4] : [];
    const M = (k, d) => this._moment_(k, g) || d;
    const cap = {
      hotel: Rp.early ? 'Home before the night really starts. Tomorrow will thank you.' : M('hotel', 'A car to the hotel, and the quiet of the lift.'),
      side: 'Out through the side, into a car with the engine running.',
      front: (this.london ? 'Up the stairs and out onto the street. ' : 'Down in the lift and out under the porte-cochère lights. ') + (roll.photographed ? 'The photographers are waiting, and they get you.' : 'A few flashes, nothing much.') + (Rp.stumble ? ' Your foot misses the kerb - just for a second.' : ''),
      together: M('together', g ? `${g.first} shares your car to her hotel. A goodnight at the door.` : 'A shared car into the night.'),
      breakfast: M(this.london ? 'breakfast.london' : 'breakfast.vegas', 'Breakfast with the others, and the race all over again.'),
      carried: `${helper ? helper + ' gets' : 'Security gets'} an arm round you. ${M('carried', 'A car door held open, and a long night ending.')}`,
      ejected: M('ejected', 'Security walks you out. The night is over.'),
      teamcar: 'The team car takes you back to the hotel. Somebody in the back is still singing.',
      moveon: this.track === 'silverstone' ? (Rp.heli ? 'Up from the circuit\'s helipad and south over the Chilterns: Battersea in twenty-five minutes, then a car to Mayfair.' : 'On to London, and the club: an hour and three quarters down the M40.') : 'On to the club: ten minutes up the Strip.',
    }[kind] + (kind === 'front' || kind === 'together' || kind === 'breakfast' ? fans : '');
    const E = V.exits || {}, at = { front: E.street || E.front, side: E.side, ejected: E.side, carried: E.side || E.front, together: E.street || E.front, breakfast: E.street || E.front, hotel: E.street || E.front, teamcar: E.front }[kind] || null;
    const left = kind === 'moveon' ? 'moveon' : Rp.early ? 'early' : 'normal';
    const cam = at?.cam && at?.look ? () => ev._look(this._v1.set(at.cam.x, at.cam.y, at.cam.z), this._v2.set(at.look.x, at.look.y, at.look.z)) : null;
    const go = () => this._moment({ id: 'exit-' + kind, dur: kind === 'moveon' ? 2.2 : 4.6, min: 1.4, flashes, flashAt: at?.paps || null, caption: cap, cam,
      start: () => {
        if (roll.photographed && !this.team && kind !== 'moveon') { try { papsDoor(ev); } catch (_) { /* */ } }   // (paps hook: the photographers waiting at the door, in the shot)
        if (at === E.street || at?.open) this.exitOpen = !!at?.open; if (Rp.stumble && kind === 'front') { const s = this._say('stumble'); if (s) setTimeout(() => this.on && ev._toast(s, 'warn'), 1600); }
        // (photographed on the way out: their frame is the picture the papers have - outside, so London's too)
        const pz = Array.isArray(at?.paps) && at.paps.length ? at.paps[(at.paps.length / 2) | 0] : at?.cam || null;
        // (the Halo Room's lift opens under the porte-cochère, which is not built: the agencies' frame is the one at the wall on the way down)
        const WL = ev.V?.wall, wc = Array.isArray(WL?.cams) && WL.cams.length ? WL.cams[(WL.cams.length / 2) | 0] : null;
        if (roll.photographed && !this.team && kind !== 'moveon') { if (pz) setTimeout(() => { if (this.on) this._shotOfMe(pz, 6, true); }, 1100); else if (wc && WL.stand) setTimeout(() => { if (this.on) this._shotOfMe(wc, 6, true, WL.stand); }, 1100); }
      },
      then: () => { this.after.push(() => { const fin = () => { try { ev._finish(left); } catch (e) { console.warn('PartyPlay: finish', e); } }; let took = false; try { took = roll.photographed && !this.team && kind !== 'moveon' && papsExit(ev, fin); } catch (_) { took = false; } if (!took) fin(); }); } });   // (paps hook: the photographers at the door first)
    if (at && Number.isFinite(+at.x) && kind !== 'moveon') this._blink(() => { ev.pos.x = +at.x; ev.pos.z = +at.z; if (at.yaw != null) ev.yaw = +at.yaw; ev.pitch = -0.04; go(); });
    else go();
  }
  /** everyone you spent time with, by cid (act 1's carried over and merged) */
  _contacts() {
    const ev = this.ev, C = {};
    if (this.carried) for (const [cid, v] of Object.entries(this.carried)) C[cid] = { ...v, fx: { ...(v?.fx || {}) } };
    const add = (g, role) => {
      if (!g?.cid) return; let sc = 0.5; try { sc = Math.round(ev._gscore(g) * 100) / 100; } catch (_) { sc = clamp(0.5 + (g.dm || 0) * 0.04, 0, 1); } if (!Number.isFinite(sc)) sc = clamp(0.5 + (g.dm || 0) * 0.04, 0, 1);
      const now = { role: role || g.role || null, score: sc, dm: +(+g.dm || 0).toFixed(1), talks: this._talked(g), fx: { ...(g.fx || {}) }, gone: !!g.gone, priv: g.ppPriv || 0 }, was = C[g.cid];
      if (!was) { C[g.cid] = now; return; }
      const fx = { ...was.fx }; for (const [k, v] of Object.entries(now.fx)) fx[k] = (fx[k] || 0) + v;
      const w0 = Math.max(0, was.talks || 0), w1 = Math.max(1, now.talks);
      C[g.cid] = { role: now.role || was.role, score: Math.round(((was.score ?? sc) * w0 + sc * w1) / (w0 + w1) * 100) / 100, dm: +((+was.dm || 0) + now.dm).toFixed(1), talks: w0 + now.talks, fx, gone: now.gone, priv: (was.priv || 0) + now.priv };
    };
    for (const g of ev.gs || []) add(g);
    if (this.ant && !(ev.gs || []).includes(this.ant) && (this.ant.talked || this._talked(this.ant) > 0)) add(this.ant, 'antagonist');
    return C;
  }

  // ---- small helpers ----------------------------------------------------------------------------------------------------
  /** a line from PartyTalk's PARTY_BARK by path ('dance.ask', 'speech.win'), filled -> string | '' */
  _say(path, g = null) { let v = PARTY_BARK; for (const k of String(path).split('.')) v = v?.[k]; return this._fill(this._pickT(v), g); }
  /** a caption from PartyTalk's PARTY_MOMENT by path ('kiss.private'), filled -> string | '' */
  _moment_(path, g = null) { let v = PARTY_MOMENT; for (const k of String(path).split('.')) v = v?.[k]; return this._fill(this._pickT(v), g); }
  /** one line of a pool - a sponsor's ({brand}) only on a sponsor's night */
  _pickT(v) { if (typeof v === 'string') return v; if (!Array.isArray(v) || !v.length) return ''; const L = this.brand ? v : v.filter((s) => !/\{brand\}/.test(s)); return pick(L.length ? L : v) || ''; }
  _fill(s, g = null) { if (!s) return ''; try { return HT.fillHangout(s, this.ev.x || {}, g?.n ? { ...g.n, first: g.first, name: g.name } : g ? { first: g.first, name: g.name } : {}); } catch (_) { return String(s).replace(/\{\w+\}/g, ''); } }
  _play(game) { const ev = this.ev; if (ev.game) return false; ev.game = game; ev.helpT = 0; const h = ev.$?.('.hg-help'); if (h) h.style.opacity = '0'; ev.$?.('.hg-prompt')?.classList.remove('in'); ev.prHtml = null; return true; }
  _moment(o) { if (this.ev.game) { this.after.push(() => this._moment(o)); return; } this._play(new Moment(this, o)); }
  _blink(fn) {
    const ev = this.ev, C = ev.cover; if (!C) { fn(); return; }
    C.classList.add('fast'); C.classList.remove('off');
    setTimeout(() => { try { if (this.on) fn(); } finally { if (!ev.closing) C.classList.add('off'); } }, 220);
  }
  /** a camera flash: the white of it on the screen and, at p (a lens in the venue's frame), the flash itself (Hangout's paps sprite) */
  _flashDom(p = null) {
    const ev = this.ev, f = ev.$?.('.hg-flash'); ev.snd?.shutter?.();
    if (p && ev.paps && Number.isFinite(+p.x)) { ev.paps.position.set(+p.x, +(p.y ?? 1.65), +p.z); ev.papT = 0; }
    try { if (p) papsSeen(ev, p); } catch (_) { /* */ }   // paps hook
    if (!f) return;
    f.style.transition = 'none'; f.style.opacity = REDUCED ? '0.18' : '0.7'; setTimeout(() => { f.style.transition = 'opacity .24s'; f.style.opacity = '0'; }, 40);
  }
  _people() { return (this.ev.gs || []).filter((g) => g.person?.group?.visible && !g.gone && !this._ant(g) && g.role !== 'bartender' && g.role !== 'security' && g.tier !== 'staff'); }
  /** a star you have now talked or danced with is someone you have met: her tag and Who's here no longer say 'not met yet' */
  _metNow(g) {
    if (!g || g.kind !== 'celeb' || this._stage(g) !== STAGE_I.stranger || (g.n?.stage || g.stage) === 'ex') return;
    g.stage = 'met'; if (g.n) g.n.stage = 'met';
    if (typeof g.why === 'string') g.why = g.why.replace(/not met yet$/, 'met tonight');
    const ev = this.ev, i = (ev.gs || []).indexOf(g), el = i >= 0 ? ev.tagEls?.[i]?.querySelector?.('small') : null;
    if (el) { try { el.textContent = ev._sub ? ev._sub(g) : g.why || ''; } catch (_) { /* (the tag as it was) */ } }
  }
  _stage(g) { const s = g?.n?.stage || g?.stage || (g?.id && g.kind === 'celeb' && this.ev.c ? (() => { try { return Celebs.bondOf(this.ev.c, g.id)?.stage; } catch (_) { return null; } })() : null); return STAGE_I[s] ?? 0; }
  _brandOf(g) { const m = /^p:rep:([\w-]+)/.exec(g?.cid || ''); return m ? m[1] : g?.brand || g?.n?.brand || null; }
  _deal(b) { const P = this.ev.c?.pr; return !!(b && P && Array.isArray(P.deals) && P.deals.some((d) => d && (d.bid === b || d.id === b))); }
  _showy(g) { const b = this._brandOf(g); return g.n?.persona === 'showman' || g.n?.likes === 'showman' || (g.C?.traits?.show ?? 0) >= 0.6 || (g.role === 'rep' && (b === 'ampwave' || b === 'lanternfish')); }
  _roleWord(g) { return { partner: 'your partner', mate: 'team-mate', rival: 'rival', exmate: 'old team-mate', friend: 'friend', celeb: g.C?.job || 'guest', ex: 'your ex', rep: BRAND_BY_ID[this._brandOf(g)]?.brand || 'sponsor', agent: 'agent', press: 'press', infl: 'influencer', present: g.team || 'driver', dj: 'DJ', boss: 'team principal', eng: 'your engineer' }[g.role] || ''; }
  /** the conversations actually had (a 'present' driver, the DJ or the cast start with fewer on offer: Hangout counts the rest as had) */
  _talked(g) { return Math.max(0, (g?.talks || 0) - clamp(3 - num(g?.talk, 3), 0, 3)); }
  _near(g, at, r) { const p = g.person?.group?.position; return !!p && Math.hypot(p.x - at.x, p.z - at.z) < r; }
  _tableAt() { const B = this.ev.V?.booths?.find?.((b) => b.mine) || this.ev.V?.booths?.[0]; if (B) return { x: B.x, z: B.z }; const h = (this.ev.hots || []).find((q) => q.kind === 'table'); if (h?.p) return { x: h.p.x, z: h.p.z }; const z = mid(this.ev.V?.zones?.vip); return z || { x: this.ev.pos.x, z: this.ev.pos.z }; }
  _atTable() { const T = this._tableAt(); return this._people().filter((g) => this._near(g, T, 3)); }
  _dancers() {
    const P = (this.ev.gs || []).filter((g) => g.person && g.tier !== 'staff' && g.tier !== 'reserved' && !['dj', 'rep', 'press', 'agent', 'security', 'bartender', 'boss', 'eng', 'antagonist'].includes(g.role));
    const k = (g) => (g.role === 'partner' ? 100 : 0) + (g.kind === 'celeb' ? 20 + this._stage(g) * 5 : 0) + (g.role === 'mate' || g.role === 'friend' ? 10 : 0);
    return P.sort((a, b) => k(b) - k(a)).slice(0, 2);
  }
  /** a guest moved to a free place by (x, z), within about r m (their spot, disc and facing with them) -> moved */
  _place(g, x, z, r = 1.3, face = null, minP = 0.8) {
    // (rev. 10-11: never on top of you - at least minP m from where you stand - and first try for a clear 0.8 m from
    // everyone else as well; only then just clear of their bodies)
    const ev = this.ev, P = ev.pos, D = ev.K?.discs || []; if (!g?.person) return false;
    const roomy = (px, pz) => { for (const q of D) if (q.pp && q !== g.disc && (q.x - px) ** 2 + (q.z - pz) ** 2 < 0.64) return false; return true; };
    for (const pass of [0, 1]) for (const d of [r, r * 0.75, r * 1.3, r * 1.6, r * 2]) for (let k = 0; k < 10; k++) {
      const a = k * 2.399 + d, px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d; if ((px - P.x) ** 2 + (pz - P.z) ** 2 < minP * minP || !ev._free(px, pz, 0.26, g.disc) || (!pass && !roomy(px, pz))) continue;
      const y = this._floorY(px, pz), f = face ?? facing(x - px, z - pz); g.person.group.position.set(px, y, pz); g.person.group.rotation.y = f;
      g.spot = { ...(g.spot || {}), x: px, z: pz, y, face: f, pose: 'stand' }; g.face0 = f; if (g.disc) { g.disc.x = px; g.disc.z = pz; } return true;
    }
    return false;
  }
  /** a guest put in front of you, facing you */
  _placeFront(g, d = 1.05) {
    const ev = this.ev, P = ev.pos, fx = Math.cos(ev.yaw), fz = Math.sin(ev.yaw);
    for (const [s, k] of [[0, d], [0.5, d], [-0.5, d], [0, d + 0.4], [0.9, d * 0.8], [-0.9, d * 0.8]]) {
      const x = P.x + fx * k - fz * s, z = P.z + fz * k + fx * s; if (!ev._free(x, z, 0.26, g.disc)) continue;
      const f = facing(P.x - x, P.z - z), y = this._floorY(x, z); g.person.group.position.set(x, y, z); g.person.group.rotation.y = f; g.spot = { ...(g.spot || {}), x, z, y, face: f, pose: 'stand' }; g.face0 = f; if (g.disc) { g.disc.x = x; g.disc.z = z; }
      ev.yaw = Math.atan2(z - P.z, x - P.x); return true;
    }
    return false;
  }
  /** the name tags: the nearest five within 8 m (Hangout places them; any past five are hidden) */
  _tagTrim() {
    const ev = this.ev, els = ev.tagEls, gs = ev.gs; if (!els || !gs || gs.length <= 5) return;
    const T = this._tg; T.length = 0; const P = ev.pos;
    for (let i = 0; i < gs.length && i < 128; i++) { const el = els[i], g = gs[i]; if (!el || !g?.person || el.style.opacity === '0' || el.style.opacity === '') continue; const p = g.person.group.position, d = Math.hypot(p.x - P.x, p.z - P.z); if (d > 8) { el.style.opacity = '0'; continue; } T.push(Math.floor(d * 100) * 128 + i); }
    if (T.length <= 5) return; T.sort((a, b) => a - b); for (let j = 5; j < T.length; j++) { const el = els[T[j] % 128]; if (el) el.style.opacity = '0'; }
  }

  // ---- the page -----------------------------------------------------------------------------------------------------------
  _hud() {
    const ev = this.ev, ui = ev.$?.('.hg-ui'); if (!ui) return;
    if (!document.getElementById('party-css')) { const st = document.createElement('style'); st.id = 'party-css'; st.textContent = CSS; document.head.appendChild(st); }
    const mk = (cls, html = '') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; ui.appendChild(d); return d; };
    const ticks = [3, 5.5, 8.5].map((u) => `<u style="bottom:${(u / GLASS * 100).toFixed(1)}%"></u>`).join('');
    this.dom = {
      glass: mk('pp-glass', `<div class="g"><i class="p"></i><i class="f"></i>${ticks}</div><b>SOBER</b><small></small>`),
      close: mk('pp-close'), card: mk('pp-card'), who: mk('pp-who'),
      dance: mk('pp-dance', `<header><b></b><span>SPACE ON THE BEAT · ESC</span></header><div class="lane"><div class="hit"></div>${'<i class="dot"></i>'.repeat(6)}<div class="gr"></div></div><s><u></u></s>`),
    };
    const talk = ev.$('.hg-talk'); if (talk && !talk.querySelector('.pp-drunk')) { const t = document.createElement('div'); t.className = 'pp-drunk'; t.textContent = 'YOU ARE DRUNK · AN ANSWER MAY COME OUT WRONG'; talk.appendChild(t); this.dom.drunk = t; }
    this.dom.glass.classList.add('in'); this.glassKey = '';
  }
  _glass() {
    const D = this.dom; if (!D?.glass) return;
    const f = clamp(this.level / GLASS, 0, 1), p = clamp((this.level + this.pending) / GLASS, 0, 1), t = this.tier, Rp = this.Rp, n = Rp.drinks.filter((d) => d.units > 0).length;
    const key = `${f.toFixed(3)}|${p.toFixed(3)}|${t}|${n}|${Rp.spend.toFixed(4)}`; if (key === this.glassKey) return; this.glassKey = key;
    const g = D.glass; g.querySelector('i.f').style.transform = `scaleY(${f.toFixed(3)})`; g.querySelector('i.p').style.transform = `scaleY(${p.toFixed(3)})`;
    const b = g.querySelector('b'); b.textContent = TIER_NAME[t]; b.className = t ? 't' + Math.min(3, t) : '';
    g.querySelector('small').textContent = `${n} drink${n === 1 ? '' : 's'}${Rp.spend > 0 ? ` · ${money(Rp.spend)}` : ''}`;
  }
  _closeNote() {
    const el = this.dom?.close; if (!el) return; const h = this._clock(); let s = '';
    if (this.lastCall != null && h >= this.lastCall - 0.5 && h < this.lastCall) s = `LAST ORDERS ${hhmm(this.lastCall)}`;
    else if (this.lastCall != null && h >= this.lastCall) s = `BAR CLOSED · OUT BY ${hhmm(this.close)}`;
    else if (h >= this.close - 0.5) s = `${this.team ? 'WINDING DOWN' : 'LIGHTS UP'} ${hhmm(this.close)}`;
    if (s !== this.closeTxt) { this.closeTxt = s; el.textContent = s; el.classList.toggle('in', !!s); }
  }
  _whoRows() {
    const R = this._people().filter((g) => g.tier !== 'staff' || g.role === 'dj');
    const dj = this._extra('dj'); if (dj?.name && !R.some((g) => g.role === 'dj')) R.push({ name: dj.name, first: firstOf(dj.name), role: 'dj', talks: 0, n: {}, color: '#7a5cff' });
    return R;
  }
  _whoOpen() { const ev = this.ev; if (!this.dom?.who) return; ev._unlock(); ev.keys?.clear(); this.who = this._whoRows(); this.whoPage = 0; this._whoDraw(); this.dom.who.classList.add('in'); }
  _whoPage(d) { const n = Math.max(1, Math.ceil(this.who.length / 5)); this.whoPage = (this.whoPage + d + n) % n; this._whoDraw(); }
  _whoDraw() {
    const L = this.who || [], n = Math.max(1, Math.ceil(L.length / 5)), pg = L.slice(this.whoPage * 5, this.whoPage * 5 + 5), ev = this.ev;
    const talked = (g) => this._talked(g);
    const stand = (g) => { const s = g.n?.stage || g.stage; if (g.kind === 'celeb') return s ? Celebs.stageLabel(s) : 'Not met'; if (g.kind === 'driver') return g.role === 'mate' ? 'Team-mate' : ({ acquaintance: 'Acquaintance', friendly: 'Friendly', friend: 'Friend', mate: 'Mate', best: 'Best mate' }[s] || 'Acquaintance'); return g.dm >= 3 ? 'Warming to you' : g.dm <= -3 ? 'Cool on you' : '-'; };
    this.dom.who.innerHTML = `<h3>Who's here<span>${esc(ev.P?.name || '')} · ${this.whoPage + 1}/${n}</span></h3><ol>${pg.map((g) => `<li><i style="--c:${esc(g.color || '#3a4150')}">${esc((g.first || g.name || '?')[0])}</i><div><b>${esc(g.name)}</b><small>${esc(this.why(g) || this._roleWord(g))}</small></div><em>${esc(stand(g))}<u>${talked(g) > 0 ? `Talked${talked(g) > 1 ? ` x${talked(g)}` : ''}` : ''}</u></em></li>`).join('') || '<li><div><b>Nobody yet</b></div></li>'}</ol><footer>${n > 1 ? '← → PAGE · ' : ''}C OR ESC TO CLOSE</footer>`;
  }
  _whoClose() { this.who = null; this.dom?.who?.classList.remove('in'); this.ev._lock?.(); }
  _danceDom(on, title = '') {
    const el = this.dom?.dance; if (!el) return;
    if (on) { el.querySelector('header b').textContent = title; el.querySelector('.gr').style.opacity = 0; el.classList.add('in'); this.laneW = el.querySelector('.lane').clientWidth || 456; } else el.classList.remove('in');
  }
  _danceTick(D, bt, dt) {
    const el = this.dom?.dance; if (!el) return; const W = this.laneW || 456, hx = W * 0.22, ppb = 92;
    const dots = this._dots || (this._dots = [...el.querySelectorAll('.lane .dot')]), u = this._dbar || (this._dbar = el.querySelector('s u'));
    for (let j = 0; j < dots.length; j++) { const k = Math.floor(bt) - 1 + j, x = hx + (k - bt) * ppb, hit = D.hits.has(k); dots[j].style.transform = `translateX(${x.toFixed(1)}px) scale(${hit ? 0.5 : 1})`; dots[j].style.opacity = x < -10 || x > W + 10 || k < D.b0 ? 0 : hit ? 0.35 : 1; }
    u.style.transform = `scaleX(${Math.max(0, 1 - D.t / D.dur).toFixed(3)})`;
    if (this.grT > 0) { this.grT -= dt; if (this.grT <= 0) el.querySelector('.gr').style.opacity = 0; }
  }
  _danceGrade(G) { const el = this.dom?.dance?.querySelector('.gr'); if (!el) return; el.textContent = G[0]; el.className = 'gr ' + G[2]; el.style.opacity = 1; this.grT = 0.5; }

  // ---- tests and tools (not part of the contract) -------------------------------------------------------------------------
  get state() {
    return { venue: this.vid, act: this.Rp.act, clock: hhmm(this._clock()), level: +this.level.toFixed(2), pending: +this.pending.toFixed(2), peak: +this.peak.toFixed(2), tier: TIER_KEY[this.tier], zone: this.zoneK, seal: this.seal, mood: this.ev.V?.moods?.[this.moodI]?.name || null, beat: +this.B.t.toFixed(2), bpm: this.B.bpm,
      music: this.music ? (this.music.mus ? 'track' : this.music.synth ? 'synth' : 'clock') : null, card: this.card ? this.card.text : null, who: !!this.who, drama: this.drama ? this.drama.id : null, plan: this.plan.map((D) => ({ id: D.id, at: hhmm(D.at), done: D.done })), exiting: this.exiting, game: this.ev.game?.name || null, frames: this.hf.size, party: this.Rp };
  }
  /** tests: a serve straight in (kind as DRINKS) */
  serve(kind) { this._serve(kind); return this.state; }
  /** tests: an incident now (a plan id) */
  incident(id, cid = null) { return this._incident({ id, cid, done: true, brawl: true }); }
  /** tests: the scuffle now, against the antagonist */
  brawlNow(started = false) { const a = this._antagonist(); if (a) { if (a.person) a.person.group.visible = true; this._placeFront(a, 0.95); this._securityNear(); this._scuffle(a, started); } return !!this.brawl; }
  /** tests: dance now (i: a guest index, or null alone) */
  danceNow(i = null) { this._dance(i == null ? null : this.ev.gs?.[i] || null); return this.ev.game?.name || null; }
  /** tests: leave now by an exit */
  exitNow(kind, i = null) { this._exit(kind, i == null ? null : this.ev.gs?.[i] || null); return this.exiting; }
}

// (a person, or null if they cannot be made: the parade's servers are a nicety, never a reason for the night to fail)
function makePersonSafe(o) { try { return makePerson(o); } catch (e) { console.warn('PartyPlay: a person could not be made', e); return null; } }
