// The after-party's rooms (career/Party.js offers the night, ui/Hangout.js stages it, ui/PartyPlay.js runs it): your
// own team's hospitality unit in the paddock after the debrief, the Halo Room - a casino-resort nightclub sixty-odd
// metres up the Meridian Grand on the Strip, reached through the sky casino, with a terrace facing the Sphere - and the
// Ormond Vault, a Mayfair members' club with a brick basement room, after Silverstone. Every venue, resort and brand
// here is invented. Each builder draws into Hangout's Kit (one mesh per look, the colour in the vertices), so a room is
// a few dozen draw calls, and returns Hangout's usual venue contract plus what a party needs: zones, role spots, the
// crowd's spots and the hour each fills, the beat, the exits, the step-and-repeat, the terrace. Nothing here imports
// Hangout: it hands its own helpers over as ev.lib before it builds. No THREE light is ever made here; the club's
// light is the room's (Hangout's ROOM uniforms), beams and the mirror ball's dots are additive shader meshes, the LED
// floor and wall are small canvases redrawn a few times a second.
//
// ===================================================================================================================
// PUBLISHED CONTRACT (WP2-venues-engine, 2026-10-09). Other packages code against this; change it only with a note.
// ===================================================================================================================
/**
 * DATA
 *  PARTY_VENUE_IDS = ['teamparty', 'vegasclub', 'londonclub']; isPartyVenue(id) -> boolean
 *  PARTY_PLACES[id] = { name, kind, city, where (track id | null), privacy (0..1), hc (bug colour), start, late, close,
 *    lastCall?, rate (game s per real s), cap (principals), sealed ('all' | 'inside' | false), age (21 | 18), host
 *    ('team' | 'club'), occasion (default; use partyOccasion), bpm, build(K, ev) }
 *    Clock values are hours and may run past 24 (24.75 = 00:45, 29 = 05:00). For a venue whose times depend on the
 *    circuit (the team party), read partyClock(id, trackId) instead of the fields.
 *  partyClock(id, trackId) -> { start, late, close, lastCall (or null), rate, night (bool: dark outside) }
 *  PARTY_ALIAS { alias: id }; PARTY_HOSTED[id] = { view, world, room, sphere, near } (Hangout's HOSTED shape);
 *  PARTY_FOOTPRINT[id] = { front, back, side, r } (Hangout's HANGOUT_FOOTPRINT shape, metres about the anchor);
 *  PARTY_ORDERS[id] = [{ id, label, kind: 'champagne' | 'cocktail' | 'shot' | 'beer' | 'wine' | 'water' | 'soft',
 *    units (UK units a serve: realistic pours), cost ($M a serve; 0 = the team's) }]
 *  partyOccasion(id = 'vegasclub', night = true) -> the Celebs occasion: a club -> 'club' when any star has a club
 *    wardrobe (CELEB.wear.club) else 'evening' (never the casual fallback); the team party -> 'night' after a night race,
 *    'grid' after a day race (what she wore in the paddock).
 *  brandLook(brand, venueId) -> { id, name, color, color2, ink } (a sponsor takeover's colours; no brand: the house's)
 *  zoneAt(V, x, z) -> zone name | 'room'; inZone(V, name, x, z) -> boolean (venue-frame metres)
 *  spotFor(V, role, taken: Set) -> spot | null (role aliases and fallbacks, see SPOTS below; marks it taken)
 *
 * BUILDER  build(K, ev) -> V. Before it runs Hangout sets ev.lib = { shell, wallRun, screen, bottles, sofa, rectTable,
 *  stool, chair, plant, buildingMass, roomPatch, ROOM } (its own functions; see Hangout.js). ev.o is the launch ({ key: 'party',
 *  venue, brand, track, night, start, act, carry, drama, guests, race? }), ev.c the career (read only), ev.host /
 *  ev.hx / ev.ay as for any venue. Every position below is in the venue's own frame (the group Hangout stages; x east,
 *  z south, y up, metres; a person's face/yaw is their rotation.y: they face +x at 0, facing(dx, dz) = atan2(-dz, dx)).
 *  V = Hangout's venue contract { light, lift, moods, start, date, group, seats, staff, paps, bed, moment, photoBack,
 *  where } plus:
 *   zones    { floor, bar, vip, dj, quiet, door, vestibule?, casino?, garage? }: each an ARRAY of rects {x0,z0,x1,z1}
 *            (empty if the venue has none) that also carries its bounding rect as x0, z0, x1, z1 - but a zone of two
 *            rects (the L-shaped VIP deck) has a loose bounding rect, so ask zoneAt(V, x, z) / inZone (they check
 *            ZONE_ORDER and every rect) rather than testing the bounding rect. Hangout keeps ev.zone = zoneAt(...) for
 *            where you stand, and api.seal / api.zone from it.
 *   spots    { partner, mate, rival, exmate, friend, celeb, rep, agent, press, infl, present, dj, security,
 *            antagonist, boss }: arrays of spots { x, z, face, pose: 'stand' | 'sit', y (floor height), zone }.
 *   crowdSpots [{ x, z, y, yaw, zone, role, pose, from, brand?, group? }]: role one of dancer | bar | booth | server |
 *            performer | promo | security | photographer | mechanic | staff; pose a hint (dance | stand | drink |
 *            talk | lean | sit | photo | phone); from = the clock hour it fills (people arrive through the night);
 *            brand: true = sponsor nights only. The venue keeps clear of every hero spot (0.75 m).
 *   beat     { bpm }; moods add { energy 0..1, occ (crowd share 0..1), bpm } to Hangout's mood fields (music: null -
 *            the club bed is synthesised by PartyPlay).
 *   exits    { front: { x, z, yaw }, side: { x, z, yaw }, street?: { x, y, z, yaw, cam: {x,y,z}, look: {x,y,z},
 *            paps: [{x,y,z}] } } (yaw: the player's heading, (cos yaw, sin yaw) forward).
 *   wall     { x, y, z, w, h, face, yaw, stand: { x, z, yaw, face }, cams: [{x,y,z}] } the step-and-repeat (null at the
 *            team party): (x, y, z) the backdrop's middle, stand where you pose (yaw: your heading facing the
 *            photographers; face: a person's turn there), cams the photographers' lenses.
 *   club     true: a club (Hangout plays assets/audio clubmusic + clubcrowd under its moods); bartop { x, y, z }: the
 *            bar's top where a served drink appears.
 *   terrace  { zone, vestibule, look } (Vegas; null elsewhere): the world unseals while you are in either rect.
 *   zoneLight { quiet: { sky, ground, hemi, key, keyI, keyDir: [x,y,z], world } }: Hangout eases ROOM to it while you
 *            are in the quiet zone (outside, the club's own wash would be wrong).
 *   heightAt(x, z) -> floor height (raised VIP decks, steps); Hangout keeps the eye 1.66 above it.
 *   booths   [{ id, x, z, y, face, mine?, host? }] (tables; booths[0] is yours), service: {x,z} (where bottle service
 *            comes from), props: { blackjack?: {x,z,dealer:{x,z,face},stand:{x,z,yaw}}, trophy?: bool, screen? }.
 *   led      { say(text, secs), wall (screen handle | null), floor (screen handle | null) } - PartyPlay puts a name
 *            or a table number up on the LED wall; the venue's own animation draws the rest.
 *   people   { dj?: { name, look } (a resident DJ when no guest has role 'dj'), security?: { name, look } } - Hangout
 *            builds these as extras behind the cover when the launch brings none.
 *  Hotspot kinds the venues make (K.hot): bar, table, dj, dance, wall, door, quiet, garage, blackjack, seat. Hangout
 *  offers each to PartyPlay.use(h) first; if PartyPlay does not take it, Hangout falls back (bar: its order menu, dj:
 *  the music, quiet: a quiet minute, door: call it a night, wall: a photo, the rest: a line of text).
 *  Venue animation reads ev.party?.beat = { t (beats elapsed), pulse (0..1, 1 on the beat), energy (0..1) } when
 *  PartyPlay provides it; else it keeps its own beat from ev.t and the mood. REDUCED (prefers-reduced-motion): no
 *  sweeps, no strobing, slow colour fades.
 *
 * HANGOUT FOR A PARTY (ui/Hangout.js '// party hook' blocks): P = PARTY_PLACES[id] merged with partyClock(id, track)
 *  and the launch's own start/close/lastCall; the late cue at P.late, the close (PartyPlay.door(true), else the usual
 *  ask) at P.close; gs = principals (P.cap) + 2 'present' (talks start at 2) + a talkable DJ; each guest carries role,
 *  tier, real, fictional, age, soft, why (the tag's second line), talk, and a 'person' kind with a 'p:'/'x:' cid;
 *  spots by spotFor(V, g.role); a hand drink by role and age (g.drink, g.drinkKind); ev.cast = { dj, bartender,
 *  security, antagonist } (guest-shaped: name, first, role, person, opts, spot, n; the antagonist hidden until shown);
 *  ev.crowd = the PartyCrowd (Hangout builds and disposes it, and drives it every frame: update(dt, camera in the venue
 *  frame, PartyPlay.beat.t, PartyPlay.occupancy, your heading) and push(where you walk - a packed floor slows you);
 *  PartyPlay sets its energy and calls arrive / near / flashes / snap); ev.zone, ev.zoneMix;
 *  api.seal (authoritative for main.js, rev. 10-10: the room ready, P.sealed, you not in quiet/vestibule, ev.unseal not
 *  set, AND PartyPlay.seal - its exits to the street / terrace flag), api.zone, api.party, api.crowd, api.cast, api.venue.
 *  The crowd keeps clear only of the hero spots tonight's guest list really uses (heroSpots: Hangout's assignment
 *  replayed), so an unused bar spot is a patron's.
 *
 * SPOTS: role aliases (star, ex -> celeb; teammate -> mate; exteammate -> exmate; sponsor, host -> rep; columnist,
 *  diarist -> press; influencer -> infl; principal -> boss; guard, bouncer -> security). A role with no free spot falls
 *  back to friend, then V.group, then V.date, then any free spot of any role.
 */
import * as THREE from 'three';
import * as Celebs from '../career/Celebs.js';
import { TRACK_MAPS } from './TrackMaps.js';

// ---- small helpers -------------------------------------------------------------------------------------------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
/** a person's turn (rotation.y) to face along (dx, dz): People face +x */
const facing = (dx, dz) => Math.atan2(-dz, dx);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const REDUCED = (() => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches; } catch (_) { return false; } })();
/** a rect from two corners */
const RC = (x0, z0, x1, z1) => ({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1) });
const inRect = (r, x, z) => x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
/** a zone: its rects as an array, which also carries their bounding rect (x0, z0, x1, z1) for code that wants one rect */
const ZL = (...rs) => Object.assign(rs, rs.length ? { x0: Math.min(...rs.map((r) => r.x0)), z0: Math.min(...rs.map((r) => r.z0)), x1: Math.max(...rs.map((r) => r.x1)), z1: Math.max(...rs.map((r) => r.z1)) } : { x0: 0, z0: 0, x1: -1, z1: -1 });

// ---- the places ----------------------------------------------------------------------------------------------------
export const PARTY_VENUE_IDS = ['teamparty', 'vegasclub', 'londonclub', 'poolclub'];   // (poolclub: ui/PartyPool.js builds it, Hangout's pool hook registers its place)
export const isPartyVenue = (id) => PARTY_VENUE_IDS.includes(String(id || ''));
// (when each night runs: Las Vegas races at 20:00 local and the debrief runs past ten, so the team's party starts at
// half eleven; Silverstone races at 15:00 and the hospitality unit fills at half seven. Nevada has no legal last call
// - the club's lights come up at five; London's licence says last orders at a quarter to three, out by three)
const CLOCK = {
  teamparty: { lasvegas: { start: 23.5, late: 24.9, close: 25.25, lastCall: null, rate: 14, night: true }, silverstone: { start: 19.5, late: 21.6, close: 22, lastCall: null, rate: 14, night: false } },
  vegasclub: { start: 24.75, late: 28, close: 29, lastCall: null, rate: 18, night: true },
  londonclub: { start: 23, late: 26.25, close: 27, lastCall: 26.75, rate: 16, night: true },
  poolclub: { start: 23.75, late: 27.5, close: 28.5, lastCall: null, rate: 18, night: true },
};
export const PARTY_PLACES = {
  teamparty: { name: 'Team hospitality', kind: 'The team celebration', city: '', where: null, privacy: 0.65, hc: '#e10600', start: 23.5, late: 24.9, close: 25.25, rate: 14, cap: 8, sealed: false, age: 21, host: 'team', occasion: 'night', bpm: 118, build: teamparty },
  vegasclub: { name: 'Halo Room', kind: 'Nightclub · Meridian Grand', city: 'Las Vegas', where: 'lasvegas', privacy: 0.25, hc: '#b23cff', start: 24.75, late: 28, close: 29, rate: 18, cap: 8, sealed: 'inside', age: 21, host: 'club', occasion: 'club', bpm: 124, build: vegasclub },
  londonclub: { name: 'The Ormond Vault', kind: "Members' club · Mayfair", city: 'London', where: 'silverstone', privacy: 0.6, hc: '#c8963e', start: 23, late: 26.25, close: 27, lastCall: 26.75, rate: 16, cap: 8, sealed: 'all', age: 18, host: 'club', occasion: 'club', bpm: 128, build: londonclub },
};
export const PARTY_ALIAS = { team: 'teamparty', hospitality: 'teamparty', teamhospitality: 'teamparty', club: 'vegasclub', halo: 'vegasclub', haloroom: 'vegasclub', afterparty: 'vegasclub', ormond: 'londonclub', vault: 'londonclub', london: 'londonclub' };
/** a venue's clock for the circuit just raced -> { start, late, close, lastCall, rate, night } */
export function partyClock(vid, trackId) {
  const C = CLOCK[vid]; if (!C) return null;
  const k = C.start != null ? C : C[trackId] || C.lasvegas;
  return { start: k.start, late: k.late, close: k.close, lastCall: k.lastCall ?? null, rate: k.rate, night: k.night !== false };
}
// (hosted: which way each looks - the team unit's glass front onto the paddock (+z), the club's terrace onto the
// Sphere (-z), the vault anywhere (nothing of the world is ever seen from it) - how much world light gets in, the
// room's own, the Sphere's glow, the camera's near plane)
export const PARTY_HOSTED = {
  teamparty: { view: 1, world: 0.3, room: 1, sphere: 0, near: 0.07 },
  vegasclub: { view: -1, world: 0.04, room: 1, sphere: 0, near: 0.07 },
  londonclub: { view: 1, world: 0, room: 1, sphere: 0, near: 0.07 },
};
// (the ground each covers about its anchor: the unit and its apron; the club's floor of the tower, its sky casino and
// its terrace; the vault and its courtyard - its street set for the way out stands over its own roof, out of sight)
export const PARTY_FOOTPRINT = {
  teamparty: { front: 9.4, back: 6.1, side: 8.6, r: 9.4 },
  vegasclub: { front: 17.8, back: 14.6, side: 12.6, r: 17.8 },
  londonclub: { front: 6.6, back: 6.4, side: 14.6, r: 14.6 },
};
// (realistic pours, UK units: a 125 ml flute of 12% champagne is 1.5; a cocktail with a double measure 2; a 25 ml
// shot of 40% spirit 1, a Las Vegas free pour about 1.7; a 330 ml bottle of 5% beer 1.7 and a pint 2.8 (2 for a
// bottle or a schooner here); a 175 ml glass of 13% wine 2.3. $M a serve: a Strip club's prices, London's about 0.6x)
const D = (id, label, kind, units, cost) => ({ id, label, kind, units, cost });
export const PARTY_ORDERS = {
  vegasclub: [D('flute', 'A glass of champagne', 'champagne', 1.5, 0.00005), D('cocktail', 'A cocktail', 'cocktail', 2, 0.000028), D('shot', 'A round of tequila shots', 'shot', 1.7, 0.00002), D('beer', 'A beer', 'beer', 2, 0.000016), D('wine', 'A glass of wine', 'wine', 2.3, 0.000026), D('water', 'Water, lots of ice', 'water', 0, 0), D('soft', 'A soft drink', 'soft', 0, 0.00001)],
  londonclub: [D('flute', 'A glass of champagne', 'champagne', 1.5, 0.00003), D('cocktail', 'A cocktail', 'cocktail', 2, 0.000019), D('shot', 'A round of shots', 'shot', 1, 0.000011), D('beer', 'A bottle of beer', 'beer', 2, 0.000009), D('wine', 'A glass of red', 'wine', 2.3, 0.000015), D('water', 'Tap water', 'water', 0, 0), D('soft', 'A soft drink', 'soft', 0, 0.000005)],
  teamparty: [D('flute', 'A glass of champagne', 'champagne', 1.5, 0), D('beer', 'A beer from the fridge', 'beer', 2, 0), D('wine', 'A glass of wine', 'wine', 2.3, 0), D('cocktail', 'A gin and tonic', 'cocktail', 2, 0), D('water', 'Water', 'water', 0, 0), D('soft', 'A soft drink', 'soft', 0, 0)],
};
/** what the night calls for (Celebs' occasions): a club -> 'club' if the stars have the clothes for it, else 'evening'; the team party -> what she wore at the circuit */
export function partyOccasion(vid = 'vegasclub', night = true) {
  if (vid === 'teamparty') return night ? 'night' : 'grid';
  let club = false; try { club = (Celebs.CELEBS || []).some((c) => Array.isArray(c?.wear?.club) ? c.wear.club.length > 0 : !!c?.wear?.club); } catch (_) { club = false; }
  return club ? 'club' : 'evening';
}
// (a sponsor's night: its colours on the wall, the step-and-repeat and the LED wall - every brand is invented, the
// names are PR.js BRANDS'; with no brand, the house's own)
const BRAND_LOOK = {
  ampwave: { name: 'Ampwave', color: '#0a0d0b', color2: '#39ff7a', ink: '#39ff7a' }, lanternfish: { name: 'Lanternfish Games', color: '#0b1a2a', color2: '#ff9a2a', ink: '#5af0e6' },
  lumora: { name: 'Lumora Audio', color: '#141018', color2: '#b78cff', ink: '#ffffff' }, vireo: { name: 'Vireo', color: '#0e1f1c', color2: '#c6ff3a', ink: '#c6ff3a' },
  solenne: { name: 'Solenne', color: '#16130c', color2: '#e8c25a', ink: '#e8c25a' }, arlette: { name: 'Maison Arlette', color: '#0d0d0d', color2: '#efe6d6', ink: '#efe6d6' },
  velane: { name: 'Velane Parfums', color: '#101010', color2: '#d9a38a', ink: '#f4efe8' },
};
const HOUSE = { vegasclub: { id: null, name: 'HALO', color: '#0c0a14', color2: '#b23cff', ink: '#ffffff' }, londonclub: { id: null, name: 'ORMOND', color: '#1a120c', color2: '#c8963e', ink: '#f2e6cf' }, teamparty: { id: null, name: 'TEAM', color: '#111214', color2: '#e10600', ink: '#ffffff' } };
/** a brand (an id, or { id, name?, color? }) -> its look; none -> the venue's own */
export function brandLook(b, vid = 'vegasclub') {
  const id = b && typeof b === 'object' ? b.id : b, L = id ? BRAND_LOOK[id] : null;
  if (!L) return { ...(HOUSE[vid] || HOUSE.vegasclub) };
  return { id, ...L, ...(b && typeof b === 'object' ? Object.fromEntries(Object.entries(b).filter(([k, v]) => v != null && k !== 'id')) : {}) };
}
// (the order a point is matched to the zones: the booth on the deck before the floor under it)
const ZONE_ORDER = ['dj', 'vip', 'floor', 'bar', 'garage', 'quiet', 'vestibule', 'door', 'casino'];
export function zoneAt(V, x, z) {
  const Z = V?.zones; if (!Z) return 'room';
  for (const k of ZONE_ORDER) for (const r of Z[k] || []) if (inRect(r, x, z)) return k;
  for (const k of Object.keys(Z)) if (!ZONE_ORDER.includes(k)) for (const r of Z[k] || []) if (inRect(r, x, z)) return k;
  return 'room';
}
export function inZone(V, name, x, z) { return (V?.zones?.[name] || []).some((r) => inRect(r, x, z)); }
const ROLE_ALIAS = { star: 'celeb', ex: 'celeb', teammate: 'mate', 'team-mate': 'mate', exteammate: 'exmate', sponsor: 'rep', host: 'rep', columnist: 'press', diarist: 'press', influencer: 'infl', principal: 'boss', guard: 'security', bouncer: 'security' };
/** the next free spot for a role (aliases, then friend, then the venue's group and date spots, then anyone's) -> spot | null */
export function spotFor(V, role, taken = new Set()) {
  const r = ROLE_ALIAS[role] || role, S = V?.spots || {};
  const lists = [S[r], r !== 'security' && r !== 'antagonist' && r !== 'dj' ? S.friend : null, V?.group, V?.date, ...Object.values(S)];
  for (const L of lists) for (const s of L || []) if (s && !taken.has(s)) { taken.add(s); return s; }
  return null;
}

// =====================================================================================================================
// paint: canvases for the rooms (seeded, so a room looks the same every night)
// =====================================================================================================================
function ctex(w, h, draw, rep = null, nearest = false) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d'); draw(x, w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  if (nearest) { t.magFilter = THREE.NearestFilter; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; }
  t.userData.cv = cv; t.userData.x = x; return t;
}
function speck(x, w, h, R, n, cols, s = 2) { for (let i = 0; i < n; i++) { x.fillStyle = cols[(R() * cols.length) | 0]; const r = 0.5 + R() * s; x.globalAlpha = 0.05 + R() * 0.12; x.fillRect(R() * w, R() * h, r, r * (0.5 + R())); } x.globalAlpha = 1; }
function vgrad(x, w, h, stops) { const g = x.createLinearGradient(0, 0, 0, h); for (const [p, c] of stops) g.addColorStop(p, c); x.fillStyle = g; x.fillRect(0, 0, w, h); }
function words(x, s, cx, cy, font, col, glow = 0) { x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle'; if (glow) { x.shadowColor = col; x.shadowBlur = glow; } x.fillStyle = col; x.fillText(s, cx, cy); x.shadowBlur = 0; }
/** black terrazzo: a polished dark ground, white and brass chips */
function terrazzo(x, w, h, R, base = '#0d0c10') {
  x.fillStyle = base; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) { const c = R(); x.fillStyle = c < 0.55 ? `rgba(220,220,230,${0.08 + R() * 0.22})` : c < 0.8 ? `rgba(200,160,90,${0.1 + R() * 0.25})` : `rgba(90,80,110,${0.2 + R() * 0.3})`; const r = 0.6 + R() * 2.2; x.beginPath(); x.ellipse(R() * w, R() * h, r, r * (0.5 + R() * 0.5), R() * 3, 0, 7); x.fill(); }
  x.strokeStyle = 'rgba(200,170,110,.18)'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, h - 2);
}
/** wall panels: dark upholstered panels in a grid, a seam between each */
function panels(x, w, h, R, base = '#1a1620', seam = 'rgba(0,0,0,.6)') {
  x.fillStyle = base; x.fillRect(0, 0, w, h);
  const nx = 4, ny = 4, cw = w / nx, ch = h / ny;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const g = x.createRadialGradient(i * cw + cw / 2, j * ch + ch / 2, 2, i * cw + cw / 2, j * ch + ch / 2, cw * 0.7); g.addColorStop(0, 'rgba(255,255,255,.05)'); g.addColorStop(1, 'rgba(0,0,0,.18)'); x.fillStyle = g; x.fillRect(i * cw, j * ch, cw, ch); x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.arc(i * cw + cw / 2, j * ch + ch / 2, 2.5, 0, 7); x.fill(); }
  x.fillStyle = seam; for (let i = 0; i <= nx; i++) x.fillRect(i * cw - 1, 0, 2, h); for (let j = 0; j <= ny; j++) x.fillRect(0, j * ch - 1, w, 2);
  speck(x, w, h, R, 900, ['#000', '#fff'], 1.4);
}
/** back-lit onyx: honey and cream veins on amber (for a glowing bar front) */
function onyx(x, w, h, R) {
  vgrad(x, w, h, [[0, '#f0b060'], [0.5, '#ffd08a'], [1, '#e89a48']]);
  for (let i = 0; i < 46; i++) { x.strokeStyle = R() < 0.5 ? `rgba(255,240,210,${0.2 + R() * 0.4})` : `rgba(150,70,20,${0.15 + R() * 0.3})`; x.lineWidth = 1 + R() * 6; x.beginPath(); let px = R() * w, py = R() * h; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (R() - 0.5) * 120; py += (R() - 0.3) * 50; x.lineTo(px, py); } x.stroke(); }
  speck(x, w, h, R, 1200, ['#fff4d8', '#a05a20'], 2);
}
/** a casino carpet: deep red ground, gold and purple swirls, a repeat that hides the dirt */
function carpet(x, w, h, R) {
  x.fillStyle = '#4a0d1c'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) { const cx = R() * w, cy = R() * h, r = 10 + R() * 34; x.strokeStyle = ['#c8963e', '#7a2a8a', '#d84a3a', '#1f3f7a'][(R() * 4) | 0]; x.lineWidth = 2 + R() * 4; x.beginPath(); x.arc(cx, cy, r, R() * 6, R() * 6 + 2 + R() * 3); x.stroke(); x.beginPath(); x.arc(cx + r * 0.6, cy, r * 0.45, 0, 4); x.stroke(); }
  for (let i = 0; i < 60; i++) { x.fillStyle = ['#e0b050', '#9a3aaa', '#f0e0c0'][(R() * 3) | 0]; const cx = R() * w, cy = R() * h; x.beginPath(); x.moveTo(cx, cy - 6); x.lineTo(cx + 5, cy); x.lineTo(cx, cy + 6); x.lineTo(cx - 5, cy); x.fill(); }
  speck(x, w, h, R, 2400, ['#000', '#ffcc88'], 1.5);
}
/** light stone flags (a foyer, a terrace) */
function flags(x, w, h, R, cols = ['#d8d3ca', '#cfc8bc', '#e0dbd2', '#c9c2b6'], n = 4) {
  x.fillStyle = '#8a857c'; x.fillRect(0, 0, w, h); const cw = w / n, ch = h / n;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { x.fillStyle = cols[(R() * cols.length) | 0]; x.fillRect(i * cw + 2, j * ch + 2, cw - 4, ch - 4); }
  speck(x, w, h, R, 1800, ['#000', '#fff', '#777'], 2.2);
}
/** London stock brick: yellow-grey bricks, sooted, lime mortar, the odd red one */
function bricks(x, w, h, R, warm = 0) {
  x.fillStyle = '#6a6252'; x.fillRect(0, 0, w, h); const bw = w / 8, bh = h / 22;
  for (let j = 0; j < 22; j++) for (let i = -1; i < 9; i++) {
    const off = j % 2 ? bw / 2 : 0, c = R(); x.fillStyle = c < 0.08 ? '#7a3a2a' : c < 0.5 ? `hsl(${38 + R() * 8},${18 + warm * 10 + R() * 10}%,${28 + R() * 12}%)` : `hsl(${30 + R() * 10},${12 + R() * 8}%,${20 + R() * 10}%)`;
    x.fillRect(i * bw + off + 1.5, j * bh + 1.5, bw - 3, bh - 3);
  }
  speck(x, w, h, R, 2600, ['#000', '#3a3228', '#c8b890'], 2);
}
/** parquet: herringbone-ish oak in dark tones */
function parquet(x, w, h, R) {
  x.fillStyle = '#2a1a10'; x.fillRect(0, 0, w, h); const s = w / 16;
  for (let j = -1; j < 17; j++) for (let i = -1; i < 17; i++) { x.fillStyle = `hsl(${24 + R() * 8},${40 + R() * 10}%,${16 + R() * 10}%)`; if ((i + j) % 2) x.fillRect(i * s + 1, j * s + 1, s * 2 - 2, s - 2); else x.fillRect(i * s + 1, j * s + 1, s - 2, s * 2 - 2); }
  speck(x, w, h, R, 1400, ['#000', '#d8a868'], 1.6);
}
/** a step-and-repeat: the host's name (and the venue's) in a staggered grid */
function stepRepeat(x, w, h, brand, venue) {
  // (as the real ones are: a light vinyl, the host's mark and the venue's in a staggered grid, each in a cell of its own
  // - nothing overlapping - so any crop of a photograph carries both)
  x.fillStyle = '#f4f2ee'; x.fillRect(0, 0, w, h);
  const lum = (c) => { const n = parseInt(String(c).slice(1), 16); return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255); };
  const ink = brand.id ? (lum(brand.color) < lum(brand.color2) ? brand.color : brand.color2) : brand.color2, ink2 = '#4a4650';
  const cols = 4, rows = 6, cw = w / cols, ch = h / rows;
  const fit = (s, f, maxW, px) => { x.font = f(px); const m = x.measureText(s).width; return m > maxW ? Math.floor((px * maxW) / m) : px; };
  const A = (px) => `900 ${px}px 'Segoe UI', Arial`, B = (px) => `italic 600 ${px}px Georgia, serif`;
  const sA = brand.name.toUpperCase(), sB = String(venue).toUpperCase(), pA = fit(sA, A, cw * 0.8, ch * 0.42), pB = fit(sB, B, cw * 0.84, ch * 0.26);
  for (let j = 0; j < rows; j++) for (let i = -1; i <= cols; i++) {
    const cx = (i + 0.5 + (j % 2 ? 0.5 : 0)) * cw, cy = (j + 0.5) * ch, a = (((i + j) % 2) + 2) % 2 === 0;
    if (a) words(x, sA, cx, cy, A(pA), ink); else words(x, sB, cx, cy, B(pB), ink2);
  }
}
/** slot machines' screens: reels and a win line, eight to an atlas */
function slots(x, w, h, R) {
  const cw = w / 4, ch = h / 2, SYM = ['7', 'BAR', '♦', '★', '$', '♣'];
  for (let k = 0; k < 8; k++) {
    const ox = (k % 4) * cw, oy = Math.floor(k / 4) * ch, hue = (k * 47) % 360;
    const g = x.createLinearGradient(0, oy, 0, oy + ch); g.addColorStop(0, `hsl(${hue},70%,30%)`); g.addColorStop(1, `hsl(${hue + 40},80%,14%)`); x.fillStyle = g; x.fillRect(ox, oy, cw, ch);
    words(x, ['LUCKY 7s', 'DIAMOND', 'GOLD RUSH', 'TRIPLE', 'NEON NIGHTS', 'STAR CASH', 'JACKPOT', 'FORTUNE'][k], ox + cw / 2, oy + ch * 0.13, `900 ${ch * 0.11}px 'Segoe UI', Arial`, '#ffe9a0', 6);
    for (let r = 0; r < 3; r++) { const rx = ox + cw * (0.12 + r * 0.27), ry = oy + ch * 0.28; x.fillStyle = '#f4f0e6'; x.fillRect(rx, ry, cw * 0.22, ch * 0.48); for (let s = 0; s < 3; s++) words(x, SYM[(R() * SYM.length) | 0], rx + cw * 0.11, ry + ch * (0.08 + s * 0.16), `900 ${ch * 0.1}px 'Segoe UI', Arial`, ['#c8102e', '#1f4fa8', '#1f8a52', '#c8963e'][(R() * 4) | 0]); }
    x.fillStyle = 'rgba(255,40,40,.8)'; x.fillRect(ox + cw * 0.08, oy + ch * 0.515, cw * 0.84, 2);
    words(x, `CREDIT ${((R() * 9000) | 0) + 100}`, ox + cw / 2, oy + ch * 0.86, `700 ${ch * 0.08}px Consolas, monospace`, '#7fff9a');
  }
}
/** a city at night on a band around the view (unhosted only: the real one is outside when hosted) */
function cityBand(x, w, h, R, warm = 0.6) {
  vgrad(x, w, h, [[0, '#04050c'], [0.45, '#0f1430'], [0.6, '#3a2a4c'], [0.62, '#120f1c'], [1, '#050507']]);
  for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(255,255,255,${0.15 + R() * 0.5})`; x.fillRect(R() * w, R() * h * 0.45, 1, 1); }
  for (let i = 0; i < 90; i++) {
    const bw = 14 + R() * 50, bh = 30 + R() * 150, bx = R() * w, base = h * 0.62; x.fillStyle = R() < 0.5 ? '#0c0e16' : '#121522'; x.fillRect(bx, base - bh, bw, bh + h);
    for (let yy = base - bh + 4; yy < base - 3; yy += 6) for (let xx = bx + 3; xx < bx + bw - 3; xx += 5) if (R() < 0.4) { x.fillStyle = R() < warm ? `rgba(255,${190 + (R() * 50) | 0},130,${0.5 + R() * 0.5})` : `rgba(180,215,255,${0.5 + R() * 0.4})`; x.fillRect(xx, yy, 2, 3); }
  }
}
/** a night sky over London: low cloud lit orange from below, a few chimneys against it */
function londonSky(x, w, h, R) {
  vgrad(x, w, h, [[0, '#14161e'], [0.6, '#2a2630'], [1, '#4a3a34']]);
  for (let i = 0; i < 40; i++) { const cx = R() * w, cy = R() * h, g = x.createRadialGradient(cx, cy, 0, cx, cy, 40 + R() * 90); g.addColorStop(0, 'rgba(120,90,70,.18)'); g.addColorStop(1, 'rgba(120,90,70,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
}
/** UVs of a geometry squeezed into one cell of an atlas (u0..u1, v0..v1) */
const uvCell = (g, u0, v0, u1, v1) => { const a = g.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, u0 + a.getX(i) * (u1 - u0), v0 + a.getY(i) * (v1 - v0)); return g; };

// =====================================================================================================================
// the beat, as the room reads it (PartyPlay's when it runs; else the room keeps its own from the clock)
// =====================================================================================================================
const _B = { t: 0, pulse: 0, energy: 0.6 };
function beatOf(E, bpm) {
  let B = null; try { B = E.party ? E.party.beat : null; } catch (_) { B = null; }
  const m = E.V?.moods?.[E.moodI];
  if (B && typeof B.t === 'number') { _B.t = B.t; _B.pulse = B.pulse ?? Math.pow(1 - (B.phase ?? (((B.t % 1) + 1) % 1)), 3); _B.energy = B.energy ?? m?.energy ?? 0.6; return _B; }
  _B.t = (E.t || 0) * (m?.bpm || bpm) / 60; _B.pulse = Math.pow(1 - (_B.t % 1), 3); _B.energy = m?.energy ?? 0.6;
  return _B;
}
/** a palette for the mood (its tint, its partner colour) */
const MOOD_COLS = { 'Warm-up': ['#7a4cff', '#ff4fb4'], 'Peak time': ['#ff2a9a', '#2ad7ff'], Throwbacks: ['#ffb04a', '#ff4a6a'], 'Last hour': ['#3a7cff', '#9a5cff'], Lounge: ['#ff9a40', '#c8963e'], 'Garage classics': ['#2ad7ff', '#ff4fb4'], 'Last orders': ['#ffb070', '#ff6a4a'], 'Party playlist': ['#ffffff', '#ffd34d'], Celebration: ['#ffd34d', '#ffffff'] };
const _c1 = new THREE.Color(), _c2 = new THREE.Color();
function moodCols(E) { const n = E.V?.moods?.[E.moodI]?.name, P = MOOD_COLS[n] || MOOD_COLS['Peak time']; return [P[0], P[1]]; }

// =====================================================================================================================
// light rigs: beams swept in the vertex shader, a mirror ball's dots thrown onto the room's box, an LED floor and wall
// =====================================================================================================================
/**
 * Moving-head beams: two crossed planes a head, all in one mesh, swung by pan and tilt in the vertex shader (one draw
 * call; no light). heads: [{ x, y, z, col }] -> { mesh, set(t (beats), amp, intensity) }
 */
function beamRig(K, heads, len = 7) {
  const P = [], O = [], I = [], C = [], U = [];
  heads.forEach((h, k) => {
    const col = new THREE.Color(h.col || '#ffffff');
    for (const rot of [0, Math.PI / 2]) {
      // (a tapered quad hanging down from the head: 0.08 m at the lens, 0.9 m at its end)
      const q = [[-0.04, 0, 0, 0], [0.04, 0, 1, 0], [0.45, -len, 1, 1], [-0.45, -len, 0, 1]], c = Math.cos(rot), s = Math.sin(rot);
      for (const id of [0, 1, 2, 0, 2, 3]) { const [a, y, u, v] = q[id]; P.push(a * c, y, a * s); O.push(h.x, h.y, h.z); I.push(k); C.push(col.r, col.g, col.b); U.push(u, v); }
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('aOrigin', new THREE.Float32BufferAttribute(O, 3)); g.setAttribute('aIdx', new THREE.Float32BufferAttribute(I, 1)); g.setAttribute('aCol', new THREE.Float32BufferAttribute(C, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
  const m = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uAmp: { value: 1 }, uI: { value: 0.5 }, uTint: { value: new THREE.Color('#ffffff') } },
    vertexShader: `attribute vec3 aOrigin; attribute float aIdx; attribute vec3 aCol; uniform float uT, uAmp; varying vec2 vUv; varying vec3 vCol;
      void main() { vUv = uv; vCol = aCol; float ph = aIdx * 1.93;
        float pan = sin(uT * 0.125 * 6.2832 + ph) * 0.9 * uAmp + ph; float tilt = 0.42 + 0.28 * sin(uT * 0.0625 * 6.2832 + ph * 1.7) * uAmp;
        vec3 p = position; float ct = cos(tilt), st = sin(tilt); p = vec3(p.x, p.y * ct - p.z * st, p.y * st + p.z * ct);
        float cp = cos(pan), sp = sin(pan); p = vec3(p.x * cp + p.z * sp, p.y, -p.x * sp + p.z * cp);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aOrigin + p, 1.0); }`,
    fragmentShader: `uniform float uI; uniform vec3 uTint; varying vec2 vUv; varying vec3 vCol;
      void main() { float e = 1.0 - abs(vUv.x * 2.0 - 1.0); float a = pow(e, 1.6) * (1.0 - vUv.y) * (1.0 - vUv.y * 0.4) * uI; gl_FragColor = vec4(vCol * uTint * a, 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
  });
  const mesh = K.obj(new THREE.Mesh(g, m)); mesh.renderOrder = 4; mesh.frustumCulled = false; mesh.position.copy(K.P(0, 0, 0)); mesh.rotation.y = K.ry;
  return { mesh, set(t, amp, I, tint) { m.uniforms.uT.value = t; m.uniforms.uAmp.value = amp; m.uniforms.uI.value = I; if (tint) m.uniforms.uTint.value.copy(tint); } };
}
/**
 * A mirror ball's dots: n directions turned about the ball and run out to the room's box, in the vertex shader (one
 * draw call). c: the ball's centre, box: [x0, y0, z0, x1, y1, z1] (frame) -> { pts, set(angle, intensity, scale) }
 */
function ballDots(K, c, box, n = 280, seed = 9) {
  const R = rng(seed), d = [];
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, a = R() * 6.2832, s = Math.sqrt(1 - u * u); d.push(Math.cos(a) * s, u * 0.85 - 0.1, Math.sin(a) * s); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(d, 3));
  const m = new THREE.ShaderMaterial({
    uniforms: { uC: { value: V3(c.x, c.y, c.z) }, uMin: { value: V3(box[0], box[1], box[2]) }, uMax: { value: V3(box[3], box[4], box[5]) }, uRot: { value: 0 }, uI: { value: 0.6 }, uScale: { value: 700 } },
    vertexShader: `uniform vec3 uC, uMin, uMax; uniform float uRot, uScale; varying float vF;
      void main() { float c = cos(uRot), s = sin(uRot); vec3 d = normalize(vec3(position.x * c + position.z * s, position.y, -position.x * s + position.z * c));
        vec3 dd = mix(d, vec3(1e-4), step(abs(d), vec3(1e-4))); vec3 tA = (uMin - uC) / dd, tB = (uMax - uC) / dd, tM = max(tA, tB); float t = min(min(tM.x, tM.y), tM.z) * 0.995;
        vec4 mv = modelViewMatrix * vec4(uC + dd * t, 1.0); vF = clamp(5.0 / t, 0.3, 1.0); gl_PointSize = clamp(0.07 * uScale / -mv.z, 1.0, 22.0); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uI; varying float vF; void main() { float r = length(gl_PointCoord - 0.5); float a = (1.0 - smoothstep(0.15, 0.5, r)) * uI * vF; gl_FragColor = vec4(vec3(1.0, 0.96, 0.9) * a, 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  });
  const pts = K.obj(new THREE.Points(g, m)); pts.renderOrder = 4; pts.frustumCulled = false; pts.position.copy(K.P(0, 0, 0)); pts.rotation.y = K.ry;
  return { pts, set(a, I, scale) { m.uniforms.uRot.value = a; m.uniforms.uI.value = I; if (scale) m.uniforms.uScale.value = scale; } };
}
/** an LED dance floor: nx x nz one-metre tiles on a small canvas, redrawn eight times a second (nearest: crisp tiles) */
function ledFloor(K, E, x0, z0, nx, nz, y = 0.014, px = 8) {
  const tex = K.t(ctex(nx * px, nz * px, (x, w, h) => { x.fillStyle = '#000'; x.fillRect(0, 0, w, h); }, null, true)), cv = tex.userData.x;
  const m = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: '#ffffff' }), mesh = K.obj(new THREE.Mesh(new THREE.PlaneGeometry(nx, nz), m));
  mesh.rotation.set(-Math.PI / 2, 0, 0); mesh.rotation.order = 'YXZ'; mesh.rotation.y = K.ry; mesh.position.copy(K.P(x0 + nx / 2, y, z0 + nz / 2)); mesh.position.y = y;
  K.glows.push({ m, base: m.color.clone() });
  let acc = 0, last = -1;
  const draw = (B) => {
    const [a, b] = moodCols(E); _c1.set(a); _c2.set(b); const e = 0.35 + 0.65 * (B.energy ?? 0.6), bar = Math.floor(B.t), pat = REDUCED ? 3 : Math.floor(bar / 16) % 3;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      let k;
      const dx = i - (nx - 1) / 2, dz = j - (nz - 1) / 2, r = Math.hypot(dx, dz);
      if (pat === 0) k = 0.5 + 0.5 * Math.cos((r - B.t * 1.5) * 1.6);   // (a ripple out from the middle)
      else if (pat === 1) k = ((i + j + bar) % 2) ? 0.9 : 0.15;            // (a chequer flipping on the beat)
      else if (pat === 2) k = Math.max(0, 1 - Math.abs(((i + B.t * 2) % nx) - nx / 2) / 2.2);   // (a bar sweeping across)
      else k = 0.5 + 0.5 * Math.sin(i * 0.5 + j * 0.4 + (E.t || 0) * 0.6);   // (a slow drift)
      const mix = (i + j) % 3 === 0 ? 1 : 0, c = mix ? _c2 : _c1, L = clamp(k * e * (REDUCED ? 0.6 : 0.75 + 0.25 * (B.pulse ?? 0)), 0, 1);
      cv.fillStyle = `rgb(${(c.r * 255 * L) | 0},${(c.g * 255 * L) | 0},${(c.b * 255 * L) | 0})`; cv.fillRect(i * px + 1, j * px + 1, px - 2, px - 2);
    }
    tex.needsUpdate = true;
  };
  K.anim((t, dt) => { acc += dt; if (acc < (REDUCED ? 0.5 : 0.125)) return; acc = 0; const B = beatOf(E, E.V?.beat?.bpm || 124); const k = Math.floor(B.t * 4); if (k === last && !REDUCED) return; last = k; draw(B); });
  return { mesh, tex };
}
/** the LED wall behind the decks: the mood's colours in rings on the beat, the house's name (or the sponsor's), and a line PartyPlay puts up (say) */
function ledWall(K, E, x, y, z, w, h, ry, brand) {
  const cw = 384, ch = Math.round(384 * h / w), tex = K.t(ctex(cw, ch, (c) => { c.fillStyle = '#000'; c.fillRect(0, 0, cw, ch); })), cv = tex.userData.x;
  const m = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: '#ffffff' }), mesh = K.obj(new THREE.Mesh(new THREE.PlaneGeometry(w, h), m));
  mesh.position.copy(K.P(x, y, z)); mesh.rotation.y = K.ry + ry; K.glows.push({ m, base: m.color.clone() });
  const msg = { text: null, until: 0 };
  let acc = 0;
  K.anim((t, dt) => {
    acc += dt; if (acc < (REDUCED ? 0.4 : 0.125)) return; acc = 0;
    const B = beatOf(E, E.V?.beat?.bpm || 124), [a, b] = moodCols(E), e = 0.35 + 0.65 * (B.energy ?? 0.6);
    cv.globalAlpha = 1; cv.fillStyle = '#000'; cv.fillRect(0, 0, cw, ch);
    const g = cv.createRadialGradient(cw / 2, ch / 2, 4, cw / 2, ch / 2, cw * 0.6); g.addColorStop(0, a); g.addColorStop(1, '#000'); cv.globalAlpha = 0.55 * e; cv.fillStyle = g; cv.fillRect(0, 0, cw, ch);
    if (!REDUCED) { cv.strokeStyle = b; cv.lineWidth = 6; for (let k = 0; k < 4; k++) { const r = ((B.t % 1) + k) * cw * 0.16; cv.globalAlpha = Math.max(0, 0.8 - k * 0.2) * e; cv.beginPath(); cv.arc(cw / 2, ch / 2, r, 0, 7); cv.stroke(); } }
    cv.globalAlpha = 0.9; for (let i = 0; i < 24; i++) { const v = REDUCED ? 0.3 : Math.abs(Math.sin(i * 1.7 + B.t * 3.1)) * (0.4 + 0.6 * (B.pulse ?? 0)) * e; cv.fillStyle = i % 2 ? a : b; cv.fillRect(i * (cw / 24) + 2, ch - v * ch * 0.3, cw / 24 - 4, v * ch * 0.3); }
    cv.globalAlpha = 1; const now = E.t || 0, say = msg.text && now < msg.until;
    words(cv, say ? msg.text : brand.name.toUpperCase(), cw / 2, ch * 0.45, `900 ${say ? Math.min(ch * 0.22, (cw * 1.5) / Math.max(6, msg.text.length)) : ch * 0.28}px 'Segoe UI', Arial`, say ? '#ffffff' : brand.ink || '#ffffff', 14);
    tex.needsUpdate = true;
  });
  return { mesh, tex, msg, say(text, secs = 6) { msg.text = String(text || '').toUpperCase(); msg.until = (E.t || 0) + secs; } };
}

// =====================================================================================================================
// furniture of a club (its own, with a floor height: the VIP deck stands 45 cm up)
// =====================================================================================================================
/** run fn with everything K adds lifted y (furniture on a raised deck) */
function raised(K, y, fn) { if (!y) return fn(); const add0 = K.add; K.add = (m, g, x, yy, z, ...r) => add0.call(K, m, g, x, (yy || 0) + y, z, ...r); try { fn(); } finally { K.add = add0; } }
/**
 * A VIP booth: a U of tufted banquette (back w long, two short wings), its seat facing +x in its frame, turned face;
 * the oval table in front with an ice bucket, two bottles and a lit table number; on a floor y up -> { x, z, y, face }
 */
function booth(K, M, x, z, face, w = 2.8, y = 0, num = 1) {
  raised(K, y, () => K.at(x, z, face, () => {
    K.box(M.base, -0.95, 0, 0, 0.6, 0.42, w); K.box(M.seat, -0.92, 0.42, 0, 0.58, 0.08, w - 0.06);
    K.box(M.back, -1.18, 0.42, 0, 0.18, 0.62, w); K.box(M.trim, -1.18, 1.04, 0, 0.2, 0.04, w + 0.02);
    for (let i = 0; i < Math.round(w / 0.45); i++) K.box(M.tuft, -1.085, 0.5, -w / 2 + 0.22 + i * 0.45, 0.02, 0.5, 0.03);
    for (const s of [-1, 1]) { K.box(M.base, -0.55, 0, s * (w / 2 - 0.3), 0.9, 0.42, 0.6); K.box(M.seat, -0.55, 0.42, s * (w / 2 - 0.3), 0.86, 0.08, 0.56); K.box(M.back, -0.55, 0.42, s * (w / 2 + 0.06), 0.9, 0.5, 0.14); }
    K.add(M.top, new THREE.CylinderGeometry(0.55, 0.55, 0.04, 28).scale(1, 1, 1.5), 0.05, 0.52, 0); K.cyl(M.gold, 0.05, 0, 0, 0.18, 0.22, 0.04, 16); K.cyl(M.gold, 0.05, 0.04, 0, 0.04, 0.05, 0.46, 10);
    K.lathe(M.steel, 0.05, 0.54, -0.25, [[0, 0], [0.1, 0], [0.13, 0.22], [0.12, 0.22], [0, 0.02]], 16); K.pool('#7fd0ff', 0.05, -0.25, 0.24, 0.5, 0.546);
    for (const dz of [-0.31, -0.2]) { K.cyl(M.bottle, 0.07 + (dz + 0.25) * 0.4, 0.62, dz, 0.038, 0.038, 0.22, 10); K.cyl(M.foil, 0.07 + (dz + 0.25) * 0.4, 0.84, dz, 0.016, 0.03, 0.09, 8); }
    K.box(M.num, 0.05, 0.56, 0.32, 0.12, 0.08, 0.02);
  }));
  K.at(x, z, face, () => { K.solid(-1.3, -w / 2 - 0.1, -0.12, w / 2 + 0.1); K.solid(-0.12, -w / 2 - 0.1, 0.0, -w / 2 + 0.55); K.solid(-0.12, w / 2 - 0.55, 0.0, w / 2 + 0.1); });
  const p = K.P(0.05, 0, 0); K.at(x, z, face, () => { const q = K.P(0.05, 0, 0); p.copy(q); }); K.disc(p.x, p.z, 0.62);
  return { x: p.x, z: p.z, y, face: face + K.ry, num };
}
/** a brass-and-glass rail along a deck's edge from (a0) to (a1) on axis ('x' | 'z') at c, standing on y */
function rail(K, M, axis, c, a0, a1, y, solid = true) {
  const L = a1 - a0, m = (a0 + a1) / 2;
  raised(K, y, () => {
    if (axis === 'x') { K.plane(M.glass, m, 0.55, c, L, 0.8); K.bar(M.brass, m, 1.02, c, 0.026, L); K.bar(M.brass, m, 0.12, c, 0.015, L); for (let p = a0; p <= a1 + 1e-6; p += Math.max(0.6, L / Math.max(1, Math.round(L / 1.5)))) K.cyl(M.brass, p, 0, c, 0.022, 0.022, 1.02, 8); }
    else { K.plane(M.glass, c, 0.55, m, L, 0.8, Math.PI / 2); K.bar(M.brass, c, 1.02, m, 0.026, L, Math.PI / 2); K.bar(M.brass, c, 0.12, m, 0.015, L, Math.PI / 2); for (let p = a0; p <= a1 + 1e-6; p += Math.max(0.6, L / Math.max(1, Math.round(L / 1.5)))) K.cyl(M.brass, c, 0, p, 0.022, 0.022, 1.02, 8); }
  });
  if (solid) { if (axis === 'x') K.solid(a0, c - 0.12, a1, c + 0.12); else K.solid(c - 0.12, a0, c + 0.12, a1); }
}
/** a DJ's desk: two decks and a mixer, a laptop, the booth's lit front; on a stage y up, facing +x in its frame */
function djDesk(K, M, x, z, face, y, w = 2.4) {
  raised(K, y, () => K.at(x, z, face, () => {
    K.box(M.black, 0, 0, 0, 0.75, 1.02, w); K.box(M.front, 0.38, 0.14, 0, 0.01, 0.72, w - 0.1);
    for (const dz of [-0.62, 0.62]) { K.box(M.gear, 0, 1.02, dz, 0.42, 0.05, 0.36); K.cyl(M.platter, 0.02, 1.07, dz, 0.13, 0.13, 0.012, 24); K.add(M.ring, new THREE.TorusGeometry(0.135, 0.005, 6, 32), 0.02, 1.08, dz, 0, Math.PI / 2); }
    K.box(M.gear, 0, 1.02, 0, 0.4, 0.06, 0.34); for (let i = 0; i < 4; i++) K.box(M.led, 0.06, 1.085, -0.12 + i * 0.08, 0.15, 0.005, 0.012);
    K.box(M.gear, -0.18, 1.02, 0.25, 0.22, 0.015, 0.3); K.box(M.screen, -0.27, 1.04, 0.25, 0.01, 0.17, 0.28);
    K.solid(-0.4, -w / 2, 0.4, w / 2);
  }));
}
/** a speaker stack: two cabinets, their cones */
function speaker(K, M, x, z, face) {
  K.at(x, z, face, () => { K.box(M.black, 0, 0, 0, 0.8, 1.0, 0.9); K.box(M.black, 0, 1.0, 0, 0.7, 0.9, 0.8); for (const [yy, r] of [[0.5, 0.3], [1.3, 0.2], [1.72, 0.08]]) K.add(M.cone, new THREE.CircleGeometry(r, 20), 0.41, yy, 0, Math.PI / 2); K.solid(-0.45, -0.5, 0.45, 0.5); });
}
/** a stack of flight cases (the freight going home) */
function cases(K, M, x, z, n, R) { for (let i = 0; i < n; i++) { const w = 0.8 + R() * 0.6, h = 0.5 + R() * 0.5, d = 0.6 + R() * 0.3, yy = i % 2 ? 0.62 : 0; K.box(i % 3 ? M.case : M.case2, x + (R() - 0.5) * 0.3, yy, z + (i >> 1) * 0.95, w, h, d); K.box(M.metal, x, yy + h - 0.03, z + (i >> 1) * 0.95, w + 0.02, 0.04, d + 0.02); } K.solid(x - 0.8, z - 0.5, x + 0.8, z + n * 0.5 + 0.4); }

// =====================================================================================================================
// the crowd's spots: a generator that keeps clear of the heroes
// =====================================================================================================================
/**
 * The hero spots the night will really use: Hangout's own assignment replayed on tonight's guest list (spotFor by each
 * guest's role, in order, then the cast: a resident DJ, security, the drama's antagonist) -> [spot]. The crowd keeps
 * clear of these only, so a bar spot nobody was given tonight is a patron's. No guest list (a bare test): all of them.
 */
function heroSpots(E, spots, group = [], date = []) {
  const all = () => Object.values(spots).flat().concat(group, date).filter(Boolean);
  const gs = Array.isArray(E?.gs) ? E.gs : null; if (!gs || !gs.length) return all();
  const V = { spots, group, date }, taken = new Set();
  try {
    for (const g of gs) spotFor(V, g.role || 'friend', taken);
    if (!gs.some((g) => g.role === 'dj') && (spots.dj || []).length) spotFor(V, 'dj', taken);
    if ((spots.security || []).length) spotFor(V, 'security', taken);
    if (E.castSpec?.antagonist) spotFor(V, 'antagonist', taken);
  } catch (_) { return all(); }
  return [...taken];
}
function crowdList(heroes) {
  const L = [], H = heroes.flat().filter(Boolean);
  const free = (x, z, r = 0.75) => !H.some((s) => (s.x - x) ** 2 + (s.z - z) ** 2 < r * r) && !L.some((s) => (s.x - x) ** 2 + (s.z - z) ** 2 < 0.36);
  return { L, add(x, z, yaw, role, zone, pose, from, o = {}) { if (!o.force && !free(x, z, o.r)) return false; L.push({ x: +x.toFixed(2), z: +z.toFixed(2), y: o.y || 0, yaw: +yaw.toFixed(3), zone, role, pose, from, ...(o.brand ? { brand: true } : {}), ...(o.group != null ? { group: o.group } : {}) }); return true; } };
}
/** a level map: decks (y) and ramps (y0 -> y1 along an axis) -> heightAt(x, z) */
function levels(decks, ramps = []) {
  return (x, z) => {
    let y = 0;
    for (const d of decks) if (x >= d.x0 && x <= d.x1 && z >= d.z0 && z <= d.z1) y = Math.max(y, d.y);
    for (const r of ramps) if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) { const u = r.axis === 'x' ? (x - r.x0) / (r.x1 - r.x0) : (z - r.z0) / (r.z1 - r.z0); y = Math.max(y, r.y0 + (r.y1 - r.y0) * clamp(u, 0, 1)); }
    return y;
  };
}

// =====================================================================================================================
// the Halo Room: a nightclub on a high floor of the Meridian Grand (an invented resort on the Strip). You come up in the
// lift to the sky casino - slot banks, one blackjack table - past the velvet rope and the host, along the step-and-
// repeat with the photographers behind their rope, into a 24 x 18 m room 5.5 m high: an LED dance floor under a ring of
// light (the halo), a DJ stage with an LED wall, two go-go podiums, a twelve-metre back-lit bar, a raised VIP deck
// with six booths behind a brass rail, a mirror ball. A dog-leg vestibule behind a curtain leads out to a terrace on
// the tower's north face, with the Sphere across the way. x east, z south; the terrace (and the Sphere) to -z.
// =====================================================================================================================
function vegasclub(K, E) {
  const L = E.lib || {}, R = rng(7311), hosted = !!E.host, brand = brandLook(E.o?.brand, 'vegasclub'), start = partyClock('vegasclub').start;
  const H = 5.5, deckY = 0.45;
  // ---- materials
  const terrT = K.t(ctex(512, 512, (x, w, h) => terrazzo(x, w, h, R), [1, 1])), panT = K.t(ctex(256, 256, (x, w, h) => panels(x, w, h, R, '#2e2638'), [1, 1]));
  const onyxT = K.t(ctex(512, 128, (x, w, h) => onyx(x, w, h, R), [3, 1])), carpT = K.t(ctex(512, 512, (x, w, h) => carpet(x, w, h, R), [1, 1])), stoneT = K.t(ctex(256, 256, (x, w, h) => flags(x, w, h, R), [1, 1]));
  const terrM = K.mt(terrT, 0.3, 0.1), wallM = K.mt(panT, 0.85), ceilM = K.m('#08070b', 0.95), deckM = K.m('#2a1426', 0.95), riseM = K.m('#0b0a0e', 0.25, 0.2);
  const black = K.m('#0c0c0f', 0.4, 0.2), gloss = K.m('#111015', 0.15, 0.3), brass = K.m('#c8a24a', 0.28, 0.85), steel = K.m('#b8bec6', 0.25, 0.85), velvet = K.m('#3a1238', 0.92), velvet2 = K.m('#24102a', 0.95);
  const granite = K.m('#141216', 0.18, 0.15), glassR = K.glass('#c8d8ff', 0.1), mirror = K.m('#8a8f9a', 0.08, 0.5), wood = K.m('#2a1810', 0.55);
  const BM = { base: K.m('#151018', 0.6), seat: velvet, back: velvet, trim: brass, tuft: velvet2, top: K.m('#0e0d10', 0.12, 0.2), gold: brass, steel, bottle: K.m('#0e2a1a', 0.15, 0.1), foil: K.m('#d8b04a', 0.3, 0.8), num: K.e('#ff5ad0') };
  const RM = { glass: glassR, brass };
  // ---- the room: a black shell, the door to the foyer (south), the curtain to the vestibule (north)
  L.shell(K, -12, -9, 12, 9, H, { floor: terrM, ceil: ceilM, wall: wallM }, { s: [[-7.6, -5.6, 0, 2.8]], n: [[3.0, 4.4, 0, 2.5]] }, { floor: 2, wall: 2.4, ceil: 3 });
  K.area(-7.6, 8.2, -5.6, 10.2); K.area(3.0, -10.0, 4.4, -8.4);
  // (cornice glow round the ceiling, and the wall strips between the panels)
  for (const [x0, z0, x1, z1] of [[-12, -8.94, 12, -8.94], [-12, 8.94, 12, 8.94]]) K.box(K.e('#6a2aff'), (x0 + x1) / 2, H - 0.12, z0, x1 - x0, 0.04, 0.03);
  for (const x of [-11.94, 11.94]) K.box(K.e('#6a2aff'), x, H - 0.12, 0, 0.03, 0.04, 18);
  // (gold lines run across the walls either side of the LED wall, never up them: an upright strip behind a go-go podium reads as a pole)
  for (const z of [-6.2, 6.2]) for (const y of [0.9, 2.6, 4.3]) K.box(K.e('#c8963e'), -11.93, y, z, 0.02, 0.04, 2.6);
  for (const x of [-9.6, -4.8, -1.2, 2.3, 5.6, 8.6]) K.box(K.e('#c8963e'), x, 1.4, -8.93, 0.04, 3.6, 0.02);   // (between the booths' niches)
  K.wash('#7a2aff', -11.9, 2.6, -6.5, 4, 4.5, Math.PI / 2, 0.22); K.wash('#7a2aff', -11.9, 2.6, 6.5, 4, 4.5, Math.PI / 2, 0.22); K.wash('#ff3aa0', 11.9, 2.6, -1, 6, 4.5, -Math.PI / 2, 0.16);
  // ---- the DJ stage (west): raised 0.8 m, the LED wall behind, speaker stacks either side, the decks
  K.box(gloss, -10.6, 0, 0, 2.8, 0.8, 6.8); K.box(K.e('#b23cff'), -9.19, 0.74, 0, 0.02, 0.04, 6.8); K.box(K.e('#b23cff'), -9.19, 0.05, 0, 0.02, 0.03, 6.8);
  K.solid(-12, -3.4, -9.15, 3.4);
  djDesk(K, { black, front: K.e('#2a0a3a'), gear: K.m('#1a1b1f', 0.4, 0.3), platter: K.m('#2a2b30', 0.3, 0.6), ring: K.e('#3ad7ff'), led: K.e('#ff3a8a'), screen: K.e('#9fb4ff') }, -9.75, 0, 0, 0.8);
  for (const s of [-1, 1]) speaker(K, { black, cone: K.m('#1c1c20', 0.6) }, -10.7, s * 4.3, 0);
  const led = ledWall(K, E, -11.89, 3.0, 0, 6.6, 3.3, Math.PI / 2, brand);   // (in front of its black frame, -11.98..-11.92)
  K.box(black, -11.95, 1.3, 0, 0.06, 3.5, 6.9);
  // ---- the dance floor: LED tiles under the halo ring, the mirror ball, two go-go podiums
  const floor = ledFloor(K, E, -8.8, -3.5, 9, 7, 0.014, 16);
  K.box(brass, -4.3, 0, -3.56, 9.1, 0.02, 0.06); K.box(brass, -4.3, 0, 3.56, 9.1, 0.02, 0.06); K.box(brass, -8.86, 0, 0, 0.06, 0.02, 7.1); K.box(brass, 0.26, 0, 0, 0.06, 0.02, 7.1);
  for (const s of [-1, 1]) { K.cyl(gloss, -8.0, 0, s * 4.45, 0.55, 0.6, 1.0, 28); K.add(K.e('#ff3ab4'), new THREE.TorusGeometry(0.56, 0.015, 6, 40), -8.0, 0.99, s * 4.45, 0, Math.PI / 2); K.pool('#ff3ab4', -8.0, s * 4.45, 1.1, 0.25); K.solid(-8.6, s * 4.45 - 0.6, -7.4, s * 4.45 + 0.6); }
  // (the truss over the floor, six moving heads on it, the beams they throw)
  const tY = 5.0;
  for (const z of [-3.2, 3.2]) K.box(black, -4.3, tY, z, 9.2, 0.3, 0.3); for (const x of [-8.6, 0.0]) K.box(black, x, tY, 0, 0.3, 0.3, 6.7);
  for (const [x, z] of [[-8.6, -3.2], [-8.6, 3.2], [0, -3.2], [0, 3.2]]) K.cyl(black, x, tY + 0.3, z, 0.03, 0.03, H - tY - 0.3, 6);
  const heads = [[-7.6, -3.2], [-4.3, -3.2], [-1.0, -3.2], [-7.6, 3.2], [-4.3, 3.2], [-1.0, 3.2]].map(([x, z], i) => { K.box(K.m('#1a1a1e', 0.4, 0.4), x, tY - 0.32, z, 0.26, 0.3, 0.26); K.cyl(K.e('#ffffff'), x, tY - 0.4, z, 0.07, 0.07, 0.04, 12); return { x, y: tY - 0.42, z, col: ['#ff3ab4', '#3ad7ff', '#ffffff', '#b23cff', '#3ad7ff', '#ff3ab4'][i] }; });
  const beams = beamRig(K, heads, 6.2);
  const haloM = new THREE.MeshBasicMaterial({ color: '#d8b0ff', toneMapped: false }), halo = K.obj(new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.07, 8, 120), haloM)), halo2 = K.obj(new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.05, 8, 96), haloM));
  for (const o of [halo, halo2]) { o.position.copy(K.P(-4.3, 4.4, 0)); o.rotation.x = Math.PI / 2; }
  halo2.position.y = 4.2; K.glows.push({ m: haloM, base: haloM.color.clone() });
  const ballT = K.t(ctex(128, 64, (x, w, h) => { x.fillStyle = '#5a5e68'; x.fillRect(0, 0, w, h); for (let j = 0; j < h; j += 4) for (let i = 0; i < w; i += 4) { const v = 120 + ((R() * 135) | 0); x.fillStyle = `rgb(${v},${v},${v + 10})`; x.fillRect(i, j, 3, 3); } }));
  const ball = K.obj(new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 16), new THREE.MeshBasicMaterial({ map: ballT, toneMapped: false })));
  ball.position.copy(K.P(-4.3, 4.6, 0)); K.cyl(steel, -4.3, 4.94, 0, 0.008, 0.008, H - 4.94, 4); K.glows.push({ m: ball.material, base: ball.material.color.clone() });
  const dots = ballDots(K, { x: -4.3, y: 4.6, z: 0 }, [-12, 0.02, -9, 12, H - 0.02, 9], 300);
  // (haze in the beams: two faint layers)
  K.plane(K.g('#6a4aff', 0.05), -4.3, 3.4, 0, 12, 9, 0, true); K.plane(K.g('#ff4ab4', 0.035), -4.3, 2.2, 0, 10, 8, 0, true);
  K.pool('#b23cff', -4.3, 0, 6.5, 0.12);
  // ---- the bar (south wall): back-lit onyx front, a black granite top with a brass edge, the back bar's lit shelves
  const onyxM = K.e('#ffffff', { map: onyxT });
  K.box(black, 5.5, 0, 6.98, 12.0, 1.05, 0.7); K.plane(onyxM, 5.5, 0.55, 6.62, 11.9, 0.9, Math.PI);
  K.box(granite, 5.5, 1.05, 6.95, 12.2, 0.06, 0.95); K.bar(brass, 5.5, 1.08, 6.47, 0.02, 12.2); K.bar(brass, 5.5, 0.2, 6.5, 0.022, 12.0);
  K.box(black, 5.5, 0, 8.65, 12.0, 0.95, 0.65); K.box(granite, 5.5, 0.95, 8.65, 12.0, 0.04, 0.68);
  // (the back bar: bronze-framed mirror panels, lit warm from under each shelf and fading up into the dark)
  const backT = K.t(ctex(1024, 192, (x, w, h) => {
    vgrad(x, w, h, [[0, '#120a06'], [0.3, '#4a2c12'], [0.62, '#a8702e'], [0.8, '#d89a4a'], [1, '#6a3e16']]);
    for (let i = 0; i < 8; i++) { const g = x.createRadialGradient((i + 0.5) * w / 8, h * 0.78, 4, (i + 0.5) * w / 8, h * 0.78, w / 11); g.addColorStop(0, 'rgba(255,226,170,.45)'); g.addColorStop(1, 'rgba(255,226,170,0)'); x.fillStyle = g; x.fillRect(i * w / 8, 0, w / 8, h); }
    for (let i = 0; i <= 8; i++) { x.fillStyle = '#24160a'; x.fillRect(i * w / 8 - 4, 0, 8, h); x.fillStyle = 'rgba(255,200,120,.25)'; x.fillRect(i * w / 8 - 4, 0, 1, h); }
  }));
  K.plane(K.e('#ffffff', { map: backT }), 5.5, 2.1, 8.97, 11.6, 2.1, Math.PI);
  for (const yy of [1.45, 1.95, 2.45]) { K.box(K.glass('#ffffff', 0.25), 5.5, yy, 8.78, 11.6, 0.02, 0.36); for (let s = 0; s < 4; s++) L.bottles?.(K, -0.3 + s * 2.95, 2.45 + s * 2.95, yy + 0.02, 8.78, R, ['#d8862a', '#9fbf4a', '#c23a3a', '#e8d9a0', '#5a8fa8', '#f0c040', '#1a3a2a', '#e8e8f0'], 12); }
  const neonT = K.t(ctex(512, 128, (x, w, h) => { x.clearRect(0, 0, w, h); words(x, brand.id ? brand.name.toUpperCase() : 'HALO ROOM', w / 2, h / 2, `italic 700 ${h * 0.5}px Georgia, serif`, brand.id ? brand.color2 : '#e8c6ff', 18); }));
  K.plane(K.e('#ffffff', { map: neonT, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), 5.5, 3.75, 8.9, 4.2, 1.05, Math.PI);
  for (let i = 0; i < 6; i++) K.pool('#ffb060', 0.4 + i * 2.1, 6.2, 1.1, 0.16);
  K.solid(-0.5, 6.45, 11.5, 9.0);
  // (the open ground between the floor, the bar and the deck: high-top tables, a candle on each, people round them)
  const HT = [[2.6, -2.8], [5.6, -1.6], [3.4, 0.6], [6.4, 1.8]];
  for (const [x, z] of HT) { K.cyl(black, x, 0, z, 0.24, 0.27, 0.03, 18); K.cyl(brass, x, 0.03, z, 0.03, 0.03, 1.02, 8); K.cyl(granite, x, 1.05, z, 0.32, 0.32, 0.035, 24); K.cyl(K.e('#ffcf8a'), x, 1.085, z, 0.028, 0.028, 0.06, 10); K.pool('#ffc070', x, z, 0.5, 0.18, 1.087); K.disc(x, z, 0.36); }
  // ---- the VIP deck: north and east, 45 cm up, a lit riser, a brass-and-glass rail, two flights of steps
  K.box(deckM, 1.7, 0, -7.2, 20.6, deckY, 3.6); K.box(deckM, 10.1, 0, -0.6, 3.8, deckY, 9.6);
  K.box(riseM, -2.0, 0, -5.42, 13.2, deckY - 0.01, 0.04); K.box(riseM, 7.3, 0, -5.42, 1.8, deckY - 0.01, 0.04); K.box(riseM, 8.18, 0, -0.6, 0.04, deckY - 0.01, 9.6); K.box(riseM, 8.9, 0, 4.18, 1.4, deckY - 0.01, 0.04); K.box(riseM, -8.62, 0, -7.2, 0.04, deckY - 0.01, 3.6);
  for (const [x, z, w, d] of [[-2.0, -5.39, 13.2, 0.02], [7.3, -5.39, 1.8, 0.02], [8.21, -0.6, 0.02, 9.6], [8.9, 4.21, 1.4, 0.02]]) K.box(K.e('#ff3ab4'), x, deckY - 0.06, z, w, 0.025, d);
  K.solid(11.6, 4.1, 12, 4.3);
  for (const [x0, x1] of [[4.6, 6.4]]) for (let k = 0; k < 3; k++) K.box(gloss, (x0 + x1) / 2, 0, -5.4 + 0.2 + k * 0.4 - 0.2, x1 - x0, deckY - 0.15 * (k + 1) + 0.15, 0.4);
  for (let k = 0; k < 3; k++) K.box(gloss, 10.6, 0, 4.2 + 0.2 + k * 0.4, 2.0, deckY - 0.15 * (k + 1) + 0.15, 0.4);
  rail(K, RM, 'x', -5.4, -8.6, 4.6, deckY); rail(K, RM, 'x', -5.4, 6.4, 8.2, deckY); rail(K, RM, 'z', 8.2, -5.4, 4.2, deckY); rail(K, RM, 'x', 4.2, 8.2, 9.6, deckY); rail(K, RM, 'z', -8.6, -9, -5.4, deckY);
  // (each booth's back against the wall: the frame's -x is the back, its table to +x)
  const BO = [booth(K, BM, -3.0, -7.75, -Math.PI / 2, 2.9, deckY, 1), booth(K, BM, -6.6, -7.75, -Math.PI / 2, 2.9, deckY, 2), booth(K, BM, 0.6, -7.75, -Math.PI / 2, 2.9, deckY, 3),
    booth(K, BM, 10.4, -7.75, -Math.PI / 2, 2.9, deckY, 4), booth(K, BM, 10.75, -2.2, Math.PI, 2.9, deckY, 5), booth(K, BM, 10.75, 1.8, Math.PI, 2.9, deckY, 6)];
  for (const b of BO) K.pool('#ffb060', b.x, b.z, 1.4, 0.18, deckY + 0.012);
  // (each booth in its own back-lit niche - a glowing panel of pleated fabric on the wall behind the banquette, the
  // Strip clubs' signature - and an LED-lit ice bucket's glow on the table)
  const nicheT = K.t(ctex(256, 128, (x, w, h) => {
    const g = x.createRadialGradient(w / 2, h * 0.55, 6, w / 2, h * 0.55, w * 0.62); g.addColorStop(0, '#ff8ad8'); g.addColorStop(0.55, '#8a2a9a'); g.addColorStop(1, '#1a0618'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 32; i++) { x.fillStyle = i % 2 ? 'rgba(0,0,0,.22)' : 'rgba(255,255,255,.06)'; x.fillRect(i * w / 32, 0, w / 32, h); }
    x.strokeStyle = '#c8a24a'; x.lineWidth = 4; x.strokeRect(2, 2, w - 4, h - 4);
  }));
  const nicheM = K.e('#ffffff', { map: nicheT });
  for (const b of BO) {
    if (Math.abs(b.z + 7.75) < 0.2) K.plane(nicheM, b.x, deckY + 1.5, -8.96, 2.7, 1.3, 0);
    else K.plane(nicheM, 11.96, deckY + 1.5, b.z, 2.7, 1.3, -Math.PI / 2);
  }
  // ---- the curtain to the vestibule, the side exit (a door in the east wall), the doorway to the foyer
  for (const s of [-1, 1]) K.box(K.m('#2a0a1a', 0.95), 3.7 + s * 0.95, 0, -8.85, 0.5, 2.7, 0.12);
  K.bar(brass, 3.7, 2.72, -8.85, 0.02, 2.6);
  K.box(K.m('#16141a', 0.5, 0.3), 11.97, 0, 5.95, 0.04, 2.2, 1.0); K.box(K.e('#3aff6a'), 11.95, 2.35, 5.95, 0.02, 0.14, 0.4); K.bar(steel, 11.9, 1.0, 5.95, 0.018, 0.6, Math.PI / 2);
  K.box(brass, -7.65, 0, 9.0, 0.08, 2.85, 0.44); K.box(brass, -5.55, 0, 9.0, 0.08, 2.85, 0.44); K.box(brass, -6.6, 2.8, 9.0, 2.18, 0.08, 0.44);
  // ---- the vestibule: a dark dog-leg - in by the curtain at the west end, out at the east end - so the club never sees the night
  L.shell(K, 2.6, -11.6, 8.6, -9.4, 2.8, { floor: K.m('#141016', 0.9), ceil: ceilM, wall: K.m('#16121a', 0.9) }, { s: [[3.0, 4.4, 0, 2.5]], n: [[7.0, 8.4, 0, 2.5]] }, {});
  K.area(7.0, -12.4, 8.4, -11.0);
  K.box(K.e('#ff5ad0'), 5.6, 2.55, -11.56, 1.6, 0.05, 0.03); K.wash('#ff5ad0', 5.6, 1.6, -11.55, 3, 2.2, 0, 0.12); K.pool('#ff6ad0', 5.6, -10.5, 1.4, 0.12);
  // ---- the terrace: stone, a glass balustrade, two lounges, heaters, planters, the night to the north
  const terrFloor = K.mt(stoneT, 0.8); K.floor(terrFloor, -2, -17.4, 12, -11.8, 2.2);
  K.box(K.m('#3a3a40', 0.7), 5, -0.4, -17.55, 14.4, 0.4, 0.3); K.box(K.m('#3a3a40', 0.7), -2.15, -0.4, -14.6, 0.3, 0.4, 5.9); K.box(K.m('#3a3a40', 0.7), 12.15, -0.4, -14.6, 0.3, 0.4, 5.9);
  const balu = (axis, c, a0, a1) => { const Lh = a1 - a0, m = (a0 + a1) / 2; if (axis === 'x') { K.box(K.m('#2a2a30', 0.6), m, 0, c, Lh, 0.18, 0.24); K.plane(glassR, m, 0.66, c, Lh, 0.95); K.bar(steel, m, 1.14, c, 0.03, Lh); K.solid(a0, c - 0.15, a1, c + 0.15); } else { K.box(K.m('#2a2a30', 0.6), c, 0, m, 0.24, 0.18, Lh); K.plane(glassR, c, 0.66, m, Lh, 0.95, Math.PI / 2); K.bar(steel, c, 1.14, m, 0.03, Lh, Math.PI / 2); K.solid(c - 0.15, a0, c + 0.15, a1); } };
  balu('x', -17.4, -2, 12); balu('z', -2, -17.4, -11.8); balu('z', 12, -17.4, -11.8);
  K.area(-2, -17.4, 12, -11.8);
  const SM = { frame: K.m('#d8d2c6', 0.9), cushion: K.m('#2a3a4a', 0.92), foot: steel };
  if (L.sofa) { L.sofa(K, SM, 2.2, -15.2, 2.4, Math.PI / 2); L.sofa(K, SM, 6.6, -15.2, 2.4, Math.PI / 2); }
  K.box(K.m('#141418', 0.4, 0.3), 2.2, 0, -16.35, 1.2, 0.38, 0.6); K.box(K.m('#141418', 0.4, 0.3), 6.6, 0, -16.35, 1.2, 0.38, 0.6); K.solid(1.5, -16.7, 2.9, -16.0); K.solid(5.9, -16.7, 7.3, -16.0);
  for (const [x, z] of [[-0.8, -13.0], [10.8, -13.0], [9.4, -16.5]]) { K.cyl(steel, x, 0, z, 0.22, 0.26, 0.06, 16); K.cyl(steel, x, 0.06, z, 0.035, 0.035, 2.0, 8); K.cyl(K.e('#ff6a1a'), x, 0.5, z, 0.05, 0.05, 1.4, 10); K.lathe(steel, x, 2.06, z, [[0.02, 0], [0.4, 0.06], [0.42, 0.1], [0, 0.14]], 18); K.pool('#ff7a2a', x, z, 1.6, 0.22); K.disc(x, z, 0.3); }
  if (L.plant) { const TM = { pot: K.m('#2a2b2f', 0.7), soil: K.m('#2b2118', 1), leaf: K.m('#3d6a3a', 0.9), leaf2: K.m('#557e45', 0.9), stem: K.m('#4a3a2a', 0.9) }; for (const [x, z] of [[-1.4, -16.8], [11.4, -16.8], [-1.4, -12.4], [11.4, -12.4]]) L.plant(K, TM, x, z, 1.4, R); }
  for (let x = -1.6; x <= 11.6; x += 1.65) { K.sph(K.e('#ffcf8a'), x, 1.24, -17.4, 0.05, 8, 6); }
  for (let i = 0; i < 5; i++) K.pool('#ffc27a', -0.6 + i * 3.0, -14.6, 1.6, 0.08);
  // (the tower's face over the terrace: the stone between the club and the night, closed above the vestibule)
  const faceM = K.m('#1c1c22', 0.75);
  K.box(faceM, -5.0, 0, -10.5, 14.8, 5.75, 2.6); K.box(faceM, 10.6, 0, -10.5, 3.6, 5.75, 2.6); K.box(faceM, 5.6, 3.0, -10.5, 6.4, 2.75, 2.6);
  K.box(K.m('#2a2a30', 0.6), 5, 5.75, -12.4, 14.4, 0.25, 1.4); K.box(K.e('#ffd59a'), 5, 5.72, -13.08, 14.0, 0.03, 0.04);
  // ---- the foyer and the sky casino (south): the lift, the slot banks, the blackjack table, the rope and the host, the
  // step-and-repeat and the photographers' pen
  L.shell(K, -8, 9.4, 12, 14.2, 3.4, { floor: null, ceil: K.m('#120e10', 0.9), wall: K.m('#2a1a16', 0.7) }, { n: [[-7.6, -5.6, 0, 2.8]] }, {});
  K.floor(K.mt(carpT, 0.95), 2, 9.4, 12, 14.2, 3); K.floor(K.mt(stoneT, 0.35, 0.05), -8, 9.4, 2, 14.2, 2);
  K.box(K.e('#ffb070'), 2, 3.32, 9.45, 20, 0.04, 0.04); K.box(K.e('#ffb070'), 2, 3.32, 14.15, 20, 0.04, 0.04);
  for (let x = -6; x <= 10; x += 4) { K.box(K.e('#ffd8a0'), x, 2.1, 9.42, 0.3, 0.4, 0.04); K.wash('#ffb060', x, 2.2, 9.43, 1.6, 1.8, 0, 0.18); }
  // (the lift lobby: two pairs of steel doors, the floor numbers glowing)
  for (const z of [10.6, 12.9]) { K.box(steel, 11.97, 0, z, 0.04, 2.5, 1.3); K.box(K.m('#2a2c30', 0.3, 0.6), 11.95, 0, z, 0.02, 2.5, 0.01); K.box(K.e('#ffb060'), 11.95, 2.7, z, 0.02, 0.16, 0.42); }
  // (eleven slot machines along the south wall, their screens one atlas, toppers glowing)
  const slotT = K.t(ctex(512, 256, (x, w, h) => slots(x, w, h, R))), slotM = K.e('#ffffff', { map: slotT });
  for (let i = 0; i < 11; i++) {
    const x = 2.9 + i * 0.82, k = i % 8; K.box(K.m('#1a1420', 0.4, 0.3), x, 0, 13.75, 0.74, 1.05, 0.7); K.box(K.m('#24182a', 0.3, 0.4), x, 1.05, 13.85, 0.74, 0.95, 0.5);
    const g = uvCell(new THREE.PlaneGeometry(0.6, 0.62), (k % 4) / 4, 1 - (Math.floor(k / 4) + 1) / 2, (k % 4 + 1) / 4, 1 - Math.floor(k / 4) / 2); K.add(slotM, g, x, 1.42, 13.58, Math.PI);
    K.box(K.e(['#ff3a6a', '#3ad7ff', '#ffd34d', '#b23cff'][i % 4]), x, 2.05, 13.9, 0.7, 0.24, 0.4); K.box(K.e('#ffe0a0'), x, 0.98, 13.42, 0.5, 0.04, 0.06);
    K.cyl(K.m('#2a1a22', 0.6), x, 0, 12.95, 0.17, 0.19, 0.62, 14); K.disc(x, 12.95, 0.2);
  }
  K.solid(2.5, 13.4, 11.9, 14.2); K.pool('#ff6aa0', 7, 13.0, 3.0, 0.14);
  // (the blackjack table: half a disc of green baize, its padded rail, the chip rack, the dealer's side to the north)
  const feltT = K.t(ctex(256, 128, (x, w, h) => { x.fillStyle = '#0f5a34'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(240,220,160,.75)'; x.lineWidth = 2; x.beginPath(); x.arc(w / 2, 0, h * 0.78, 0.25, Math.PI - 0.25); x.stroke(); words(x, 'BLACKJACK PAYS 3 TO 2', w / 2, h * 0.5, `700 ${h * 0.09}px Georgia, serif`, 'rgba(240,220,160,.85)'); words(x, 'Dealer must draw to 16 and stand on all 17s', w / 2, h * 0.64, `italic ${h * 0.06}px Georgia, serif`, 'rgba(240,220,160,.7)'); }));
  const half = new THREE.CylinderGeometry(1.05, 1.05, 0.05, 32, 1, false, -Math.PI / 2, Math.PI);   // (the curve to the players, +z; the straight edge the dealer's)
  K.add(K.mt(feltT, 0.95, 0, { emissive: '#5a6a5a', emissiveMap: feltT }), half, 5.2, 0.88, 10.55);   // (the felt bright under the table's own lamp)
  K.cyl(K.m('#141416', 0.5, 0.3), 5.2, 2.55, 10.75, 0.42, 0.3, 0.16, 20, { open: true }); K.cyl(K.e('#fff0d0'), 5.2, 2.54, 10.75, 0.28, 0.28, 0.01, 20); K.cyl(steel, 5.2, 2.71, 10.75, 0.006, 0.006, 0.7, 4); K.add(K.m('#3a1a12', 0.6), new THREE.TorusGeometry(1.05, 0.06, 8, 32, Math.PI), 5.2, 0.9, 10.55, 0, Math.PI / 2, Math.PI);
  K.box(K.m('#3a1a12', 0.6), 5.2, 0, 10.5, 1.8, 0.86, 0.2); K.cyl(K.m('#2a1a12', 0.6), 5.2, 0, 10.85, 0.3, 0.35, 0.86, 16); K.box(K.m('#1a1a1c', 0.4), 5.2, 0.9, 10.38, 0.7, 0.05, 0.16);
  for (let i = 0; i < 6; i++) K.cyl(K.m(['#c8102e', '#1f4fa8', '#1f8a52', '#111', '#f2f2f2', '#c8963e'][i], 0.4), 4.93 + i * 0.1, 0.95, 10.38, 0.02, 0.02, 0.04, 10);
  K.solid(4.2, 10.3, 6.2, 11.55); K.pool('#ffe0a0', 5.2, 10.9, 1.6, 0.18); K.pool('#fff0c0', 5.2, 10.85, 0.9, 0.22, 0.912);
  // (the rope and the host's stand at the end of the casino)
  for (const z of [9.8, 10.8, 11.8]) { K.cyl(brass, 2.0, 0, z, 0.15, 0.15, 0.03, 16); K.cyl(brass, 2.0, 0.03, z, 0.025, 0.025, 0.95, 8); K.sph(brass, 2.0, 1.0, z, 0.045, 10, 8); K.disc(2.0, z, 0.18); }
  K.tube(K.m('#7a0d1e', 0.7), [[2.0, 0.92, 9.8], [2.0, 0.78, 10.3], [2.0, 0.92, 10.8]], 0.025, 12, 6); K.tube(K.m('#7a0d1e', 0.7), [[2.0, 0.92, 10.8], [2.0, 0.78, 11.3], [2.0, 0.92, 11.8]], 0.025, 12, 6);
  K.box(K.m('#1a1416', 0.4, 0.2), 1.2, 0, 10.35, 0.55, 1.1, 0.5); K.box(K.e('#9fd0ff'), 1.2, 1.12, 10.35, 0.3, 0.02, 0.22); K.solid(0.9, 10.05, 1.5, 10.65);
  // (the step-and-repeat on the foyer's south wall, the carpet runner in front, the pen opposite)
  const srT = K.t(ctex(1024, 512, (x, w, h) => stepRepeat(x, w, h, brand, brand.id ? 'Halo Room' : 'Meridian Grand')));
  // (lit flat and bright by the photographers' softboxes, as it is in every red-carpet picture)
  K.plane(K.m('#ffffff', 0.7, 0, { map: srT, emissive: '#9a9894', emissiveMap: srT }), -2.2, 1.45, 14.12, 5.6, 2.9, Math.PI); K.box(black, -2.2, 2.9, 14.1, 5.8, 0.12, 0.12); for (const x of [-5.05, 0.65]) K.box(black, x, 0, 14.1, 0.1, 3.0, 0.1);
  for (const x of [-5.6, 1.2]) { K.cyl(black, x, 0, 11.0, 0.18, 0.2, 0.03, 12); K.cyl(steel, x, 0.03, 11.0, 0.016, 0.016, 2.0, 6); K.at(x, 11.0, facing(-2.2 - x, 3.1), () => { K.box(K.m('#141416', 0.6), -0.05, 1.75, 0, 0.12, 0.62, 0.62); K.box(K.e('#fff8ec', { fixed: true }), 0.015, 1.78, 0, 0.01, 0.56, 0.56); }); K.disc(x, 11.0, 0.22); }
  K.floor(K.m(brand.id ? brand.color2 : '#5a0d1e', 0.9), -5.6, 12.6, 1.2, 14.15, 2, 0.006);
  for (let x = -4.8; x <= 0.41; x += 1.3) { K.cyl(brass, x, 0, 11.35, 0.14, 0.14, 0.03, 14); K.cyl(brass, x, 0.03, 11.35, 0.022, 0.022, 0.9, 8); }
  K.tube(K.m('#111114', 0.7), [[-4.8, 0.86, 11.35], [-2.2, 0.72, 11.35], [0.4, 0.86, 11.35]], 0.02, 16, 6); K.solid(-4.9, 11.25, 0.5, 11.45);
  for (const x of [-4.4, -2.2, 0]) { K.wash('#ffffff', x, 1.6, 14.08, 2.2, 2.2, Math.PI, 0.1); }
  K.area(-8, 9.4, 12, 14.2);
  // ---- the tower: under the club (down to the street) and over it (hosted: one more tower on the Strip)
  if (hosted && L.buildingMass) L.buildingMass(K, E, [[-12.6, -(E.ay || 60), -17.8, 12.6, -0.02, 14.6], [-12.6, 5.75, -11.8, 12.6, 5.75 + 42, 14.6]]);
  else if (!hosted) {
    // (no world: a painted Strip round the terrace's view, a dark street far below)
    const band = K.obj(new THREE.Mesh(new THREE.CylinderGeometry(260, 260, 220, 48, 1, true, Math.PI * 0.55, Math.PI * 0.9), new THREE.MeshBasicMaterial({ map: K.t(ctex(2048, 256, (x, w, h) => cityBand(x, w, h, R))), side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false })));
    band.position.copy(K.P(5, -40, -14)); band.rotation.y = K.ry; band.renderOrder = -1;
    const sph = K.obj(new THREE.Mesh(new THREE.SphereGeometry(55, 32, 20), new THREE.MeshBasicMaterial({ color: '#3a7bff', fog: false, toneMapped: false }))); sph.position.copy(K.P(-60, -20, -230));
    K.anim((t) => { sph.material.color.setHSL(((t / 40) % 1), 0.8, 0.55); });
  }
  // ---- the people's places
  const S = (x, z, face, zone, y = 0, pose = 'stand') => K.spot(x, z, face, pose, y, { zone });
  const toward = (x, z, tx, tz) => facing(tx - x, tz - z);
  const B0 = BO[0], B1 = BO[1];
  const spots = {
    partner: [S(-1.7, -6.75, toward(-1.7, -6.75, B0.x, B0.z), 'vip', deckY), S(-4.3, -6.7, toward(-4.3, -6.7, B0.x, B0.z), 'vip', deckY)],
    mate: [S(2.0, -6.35, toward(2.0, -6.35, 0.6, -7.4), 'vip', deckY), S(7.2, 5.85, facing(-0.4, 1), 'bar')],
    rival: [S(3.6, 5.75, facing(0.3, 1), 'bar'), S(-0.6, 4.4, toward(-0.6, 4.4, -4.3, 0), 'floor')],
    exmate: [S(8.6, 5.8, facing(-0.3, 1), 'bar'), S(1.6, 5.9, facing(0.2, 1), 'bar')],
    friend: [S(0.6, -6.3, toward(0.6, -6.3, 0.6, -7.5), 'vip', deckY), S(-0.6, -6.55, toward(-0.6, -6.55, 0.6, -7.5), 'vip', deckY), S(9.6, -1.0, toward(9.6, -1.0, 10.4, -2.2), 'vip', deckY)],
    celeb: [S(-5.25, -6.5, toward(-5.25, -6.5, B1.x, B1.z), 'vip', deckY), S(-7.95, -6.5, toward(-7.95, -6.5, B1.x, B1.z), 'vip', deckY), S(-6.1, -6.1, toward(-6.1, -6.1, B1.x, B1.z), 'vip', deckY), S(-7.1, -6.1, toward(-7.1, -6.1, B1.x, B1.z), 'vip', deckY), S(-2.6, 2.9, toward(-2.6, 2.9, -4.3, 0), 'floor')],
    rep: [S(-4.75, -7.1, toward(-4.75, -7.1, B1.x, B1.z), 'vip', deckY), S(9.4, 2.6, toward(9.4, 2.6, 10.4, 1.8), 'vip', deckY)],
    agent: [S(-8.6, 2.7, toward(-8.6, 2.7, -4.3, 0.5), 'floor'), S(-8.6, -2.7, toward(-8.6, -2.7, -4.3, -0.5), 'floor')],
    press: [S(0.3, 5.85, facing(0.5, 1), 'bar'), S(10.6, 5.8, facing(-0.4, 1), 'bar')],
    infl: [S(-2.4, -1.9, toward(-2.4, -1.9, -9, 0), 'floor'), S(-3.2, 2.2, toward(-3.2, 2.2, -9, 0), 'floor')],
    present: [S(9.7, -4.0, toward(9.7, -4.0, 10.4, -7.4), 'vip', deckY), S(4.5, 5.8, facing(0.2, 1), 'bar')],   // (a metre off the bar's service point at x 5.5: never between you and a drink)
    dj: [S(-10.5, 0, 0, 'dj', 0.8)],
    security: [S(6.95, -4.2, toward(6.95, -4.2, 3, -2), 'floor'), S(-6.6, 8.2, toward(-6.6, 8.2, -6.6, 5), 'door')],
    antagonist: [S(2.2, 4.7, toward(2.2, 4.7, -1, 3), 'bar'), S(-0.4, 3.0, toward(-0.4, 3.0, -4, 1), 'floor')],
    boss: [],
  };
  const group = [S(0.8, 3.9, toward(0.8, 3.9, -3, 0), 'floor'), S(2.0, 3.3, toward(2.0, 3.3, -3, 0), 'floor'), S(1.3, 2.5, toward(1.3, 2.5, -3, 0), 'floor')];
  // ---- the crowd: dancers filling the floor from the front, the bar two deep, the booths, the staff, the photographers
  const C = crowdList(heroSpots(E, spots, group, [spots.partner[0]])), djx = -9.2;
  const fl = []; for (let i = 0; i < 9; i++) for (let j = 0; j < 7; j++) fl.push([-8.35 + i * 0.98 + (R() - 0.5) * 0.4, -3.05 + j * 1.0 + (R() - 0.5) * 0.35]);
  fl.sort((a, b) => (a[0] - djx) + Math.abs(a[1]) * 0.4 - ((b[0] - djx) + Math.abs(b[1]) * 0.4));
  let n = 0; for (const [x, z] of fl) { if (n >= 44 || R() < 0.08) continue; if (C.add(x, z, facing(djx - x, -z * 0.3) + (R() - 0.5) * 0.9, 'dancer', 'floor', 'dance', +(start - 0.05 + Math.pow(n / 44, 1.3) * 1.25).toFixed(2), { group: (n / 3) | 0 })) n++; }
  for (let i = 0; i < 12; i++) { const x = 0.1 + i * 0.95 + (R() - 0.5) * 0.2; C.add(x, 6.05, facing(0, 1) + (R() - 0.5) * 0.5, 'bar', 'bar', i % 3 ? 'lean' : 'drink', +(start + R() * 0.6).toFixed(2)); }
  for (let i = 0; i < 7; i++) { const x = 0.6 + i * 1.6 + (R() - 0.5) * 0.4; C.add(x, 5.0 + (R() - 0.5) * 0.3, R() * 6.28, 'bar', 'bar', i % 2 ? 'talk' : 'drink', +(start + 0.3 + R() * 0.9).toFixed(2), { group: 100 + (i >> 1) }); }
  for (const b of BO.slice(2)) { const f = b.face, cx = Math.cos(f), sz = -Math.sin(f); for (let k = -1; k <= 1; k++) { const px = b.x - cx * 0.95 + sz * k * 0.75, pz = b.z - sz * 0.95 - cx * k * 0.75; C.add(px, pz, f, 'booth', 'vip', 'sit', +(start + R() * 1.0).toFixed(2), { y: deckY, force: false }); } C.add(b.x + cx * 0.75, b.z + sz * 0.75, f + Math.PI, 'booth', 'vip', 'dance', +(start + 0.5 + R()).toFixed(2), { y: deckY }); }
  C.add(B1.x - Math.cos(B1.face) * 0.95, B1.z + Math.sin(B1.face) * 0.95, B1.face, 'booth', 'vip', 'sit', start, { y: deckY });
  HT.forEach(([x, z], k) => { const a0 = R() * 6.28, n = 2 + (k % 2); for (let i = 0; i < n; i++) { const a = a0 + (i * 6.28) / n + (R() - 0.5) * 0.4; C.add(x + Math.cos(a) * 0.62, z + Math.sin(a) * 0.62, facing(-Math.cos(a), -Math.sin(a)) + (R() - 0.5) * 0.4, 'bar', 'tables', i % 2 ? 'talk' : 'drink', +(start + 0.15 + R() * 0.9).toFixed(2), { group: 150 + k }); } });
  // (behind the bar and at the tables: the house's own, in its black)
  for (const [x, z, f] of [[2.6, 7.75, facing(0, -1)], [8.8, 7.75, facing(0, -1)]]) C.add(x, z, f, 'server', 'bar', 'stand', start - 1, { force: true });
  for (const [x, z, y] of [[6.6, -6.4, deckY], [9.3, 3.1, deckY], [-2.0, 5.0, 0]]) C.add(x, z, R() * 6.28, 'server', y ? 'vip' : 'bar', 'stand', start - 0.5, { y });
  for (const s of [-1, 1]) C.add(-8.0, s * 4.45, facing(1, -s * 0.3), 'performer', 'floor', 'dance', start + 0.5, { y: 1.0, force: true });
  for (const [x, z, zn] of [[10.4, 5.6, 'bar'], [-1.6, 12.3, 'door'], [0.8, -3.9, 'floor']]) C.add(x, z, R() * 6.28, 'promo', zn, 'stand', start, { brand: true });
  for (let i = 0; i < 4; i++) C.add(-4.2 + i * 1.35, 10.75 + (R() - 0.5) * 0.15, facing(0, 1) + (R() - 0.5) * 0.3, 'photographer', 'door', 'photo', start - 1, { force: true });
  C.add(-1.4, -4.3, toward(-1.4, -4.3, -4.3, 0), 'photographer', 'floor', 'photo', start + 0.3);
  C.add(2.4, 12.6, facing(-1, 0), 'security', 'casino', 'stand', start - 1, { force: true }); C.add(-5.2, 8.1, facing(0, -1), 'security', 'door', 'stand', start - 1);
  C.add(0.7, 10.4, facing(1, 0), 'server', 'door', 'stand', start - 1, { force: true }); C.add(5.2, 10.0, facing(0, 1), 'server', 'casino', 'stand', start - 1, { force: true });
  for (let i = 0; i < 11; i += 2) C.add(2.9 + i * 0.82, 12.95, facing(0, 1), 'bar', 'casino', 'sit', start - 1, { force: true });
  // ---- what there is to do
  const sph = E.hx?.sphere ? E.hx.sphere.clone() : V3(5, 20, -400);
  K.hot({ id: 'bar', kind: 'bar', x: 5.5, y: 1.2, z: 6.45, reach: 2.4, label: 'The bar', sub: 'Champagne, cocktails, shots, beer, water' });
  K.hot({ id: 'bar-w', kind: 'bar', x: 1.0, y: 1.2, z: 6.45, reach: 2.1, label: 'The bar', sub: 'Champagne, cocktails, shots, beer, water' });
  K.hot({ id: 'bar-e', kind: 'bar', x: 10.0, y: 1.2, z: 6.45, reach: 2.1, label: 'The bar', sub: 'Champagne, cocktails, shots, beer, water' });
  K.hot({ id: 'table', kind: 'table', x: B0.x, y: deckY + 0.6, z: B0.z, reach: 2.2, label: 'Your table', sub: 'Bottle service, invite someone over, send a round' });
  K.hot({ id: 'dj', kind: 'dj', x: -8.8, y: 1.3, z: 0, reach: 2.3, label: 'The DJ booth', sub: 'Ask for something' });
  K.hot({ id: 'dance', kind: 'dance', x: -4.3, y: 1.0, z: 0, reach: 4.4, label: 'Dance' });
  K.hot({ id: 'wall', kind: 'wall', x: -2.2, y: 1.4, z: 13.3, reach: 2.4, label: 'The step-and-repeat', sub: 'Stop for the photographers' });
  K.hot({ id: 'door', kind: 'door', x: -6.6, y: 1.2, z: 8.3, reach: 1.8, label: 'The door', sub: 'Leave, or step out' });
  K.hot({ id: 'lift', kind: 'door', x: 11.3, y: 1.2, z: 11.75, reach: 1.9, label: 'The lifts', sub: 'Down to the porte-cochère' });
  K.hot({ id: 'side', kind: 'door', x: 11.5, y: 1.2, z: 5.95, reach: 1.7, label: 'The side exit', sub: 'Staff and VIP tables only' });
  K.hot({ id: 'blackjack', kind: 'blackjack', x: 5.2, y: 1.0, z: 11.75, reach: 1.8, label: 'The blackjack table', sub: 'One hand' });
  K.hot({ id: 'terrace', kind: 'quiet', x: 4.4, y: 1.3, z: -17.1, reach: 2.6, label: 'Take in the view', look: sph });
  // (the moment out there, the floor's numbers, the Sphere's glow on the faces)
  return {
    light: { hemi: ['#7058c0', '#1a1024', 0.62], dir: ['#ff8ad8', 0.55, [-6, 5, 1]], exposure: 1.05, bg: '#05040a' }, lift: 0.08,
    moods: [{ name: 'Warm-up', music: 'clubmusic', hemi: 0.9, glow: 0.8, tint: '#7a4cff', energy: 0.45, occ: 0.4, bpm: 122 }, { name: 'Peak time', music: 'clubmusic', hemi: 0.72, glow: 1.25, tint: '#ff3ab4', energy: 1, occ: 1, bpm: 126 },
      { name: 'Throwbacks', music: 'clubmusic', hemi: 0.82, glow: 1.1, tint: '#ffb04a', energy: 0.8, occ: 0.85, bpm: 120 }, { name: 'Last hour', music: 'clubmusic', hemi: 0.78, glow: 0.9, tint: '#3a7cff', energy: 0.6, occ: 0.55, bpm: 124 }],
    start: { x: 11.0, z: 11.8, yaw: Math.PI },
    date: [spots.partner[0]], group,
    seats: [{ x: B0.x, z: B0.z - 0.95, yaw: Math.PI / 2, eye: deckY + 1.18 }, { x: 2.2, z: -15.3, yaw: -Math.PI / 2, eye: 1.15 }],
    staff: { name: 'Marco', role: 'Bartender', x: 5.5, z: 7.8, face: facing(0, -1), hot: 'bar', look: { kit: 'blazer', color: '#0e0e10', accent: '#e9e4da', legs: '#101012', pose: 'talk', seed: 'halo-bartender' } },
    paps: [V3(-4.2, 1.7, 10.75), V3(-1.5, 1.7, 10.75), V3(-1.4, 1.75, -4.3)], bed: 'room',
    moment: ['Out on the terrace the music is a dull thud behind the glass. Across the road the Sphere cycles through its colours, and the Strip runs gold to the horizon.', 'Cold desert air, eighteen floors up - late November on the Strip, and it bites. Below, the circuit is being put to bed: the grandstands empty, the barriers still lining the Strip.'],
    where: 'out on the terrace', photoBack: 'the Halo Room wall',
    zones: { floor: ZL(RC(-8.9, -4.2, 0.6, 4.2)), dj: ZL(RC(-12, -3.6, -8.9, 3.6)), bar: ZL(RC(-0.5, 4.6, 11.6, 9)), vip: ZL(RC(-8.6, -9, 12, -5.4), RC(8.2, -5.4, 12, 4.2)), quiet: ZL(RC(-2, -17.4, 12, -11.8)), vestibule: ZL(RC(2.6, -11.8, 8.6, -9.0)), door: ZL(RC(-8, 9.0, 2.0, 14.2), RC(-8.4, 7.4, -4.8, 9.0)), casino: ZL(RC(2.0, 9.4, 12, 14.2)) },
    spots, crowdSpots: C.L, beat: { bpm: 124 }, club: true, bartop: { x: 5.5, y: 1.11, z: 6.6 },
    exits: { front: { x: 11.0, z: 11.8, yaw: 0 }, side: { x: 11.5, z: 5.95, yaw: 0 }, street: null },
    wall: { x: -2.2, y: 1.45, z: 14.12, w: 5.6, h: 2.9, face: facing(0, -1), yaw: -Math.PI / 2, stand: { x: -2.2, z: 13.3, yaw: -Math.PI / 2, face: facing(0, -1) }, cams: [V3(-4.2, 1.6, 10.75), V3(-2.85, 1.6, 10.75), V3(-1.5, 1.6, 10.75), V3(-0.15, 1.6, 10.75)] },
    terrace: { zone: RC(-2, -17.4, 12, -11.8), vestibule: RC(2.6, -11.8, 8.6, -9.0), look: sph },
    zoneLight: { quiet: { sky: '#3a4470', ground: '#20160e', hemi: 0.6, key: '#ffb47a', keyI: 0.55, keyDir: [-2, 5, 4], world: 0.55 } },
    heightAt: levels([RC(-8.6, -9, 12, -5.4), RC(8.2, -5.4, 12, 4.2)].map((r) => ({ ...r, y: deckY })), [{ ...RC(4.6, -5.4, 6.4, -4.2), axis: 'z', y0: deckY, y1: 0 }, { ...RC(9.6, 4.2, 11.6, 5.4), axis: 'z', y0: deckY, y1: 0 }]),
    booths: BO.map((b, i) => ({ id: 'b' + (i + 1), x: b.x, z: b.z, y: b.y, face: b.face, mine: i === 0, host: i === 1 })), service: { x: 10.8, z: 6.0 },
    props: { blackjack: { x: 5.2, z: 10.55, dealer: { x: 5.2, z: 10.05, face: facing(0, 1) }, stand: { x: 5.2, z: 11.85, yaw: -Math.PI / 2 } } },
    led: { wall: led, floor, say: (t, s) => led?.say(t, s) },
    people: { dj: { name: 'DJ Kova', look: { kit: 'teeblazer', color: '#111114', accent: '#111114', legs: '#111114', shoe: 'trainer', shoes: '#ecebe6', pose: 'talk', seed: 'halo-resident-dj', acc: ['watch'] } },
      security: { name: 'Security', look: { kit: 'pantsuit', color: '#0c0c0e', accent: '#0c0c0e', legs: '#0c0c0e', pose: 'cross', seed: 'halo-security', jitter: 0.02 } } },
    fx: { beams, dots, halo: haloM, ball },
    _anim: (() => { K.anim((t, dt) => {
      const B = beatOf(E, 124), e = B.energy ?? 0.6, g = E.mk?.glow ?? 1;
      beams.set(B.t, REDUCED ? 0 : 0.6 + 0.4 * e, (REDUCED ? 0.18 : 0.22 + 0.3 * e * (0.7 + 0.3 * (B.pulse ?? 0))) * g, null);
      const sc = (E.renderer?.domElement?.height || 900) / (2 * Math.tan(((E.cam?.fov || 64) * Math.PI) / 360));
      dots.set(t * (REDUCED ? 0.08 : 0.32), (0.35 + 0.35 * e) * g, sc); ball.rotation.y = t * (REDUCED ? 0.08 : 0.32);
      const [a, b] = moodCols(E); _c1.set(a).lerp(_c2.set(b), REDUCED ? 0.5 + 0.5 * Math.sin(t * 0.2) : (B.t / 8) % 1); haloM.color.copy(_c1).multiplyScalar((0.55 + 0.45 * (REDUCED ? 0.5 : B.pulse ?? 0.5)) * g);
    }); return null; })(),
  };
}

// =====================================================================================================================
// the team's hospitality unit in the paddock after the debrief: long tables of food, the race on a big screen, a bar
// with the team's fridge, the trophy on its plinth after a podium, the glass front onto the paddock and the garages'
// back doors, an apron outside with the freight going home. x east, z south; the glass front (and the paddock) to +z.
// =====================================================================================================================
function teamparty(K, E) {
  const L = E.lib || {}, R = rng(5150), hosted = !!E.host, c = E.c, T = c?.teams?.[c?.myTeam] || {}, col = T.color || '#c8102e', col2 = T.color2 || '#f2f2f2', tname = T.name || 'The team';
  const track = E.trackId || 'lasvegas', clk = partyClock('teamparty', track), start = clk.start, race = E.o?.race || c?.party?.race || null;
  const podium = !!(race && (race.podium || race.won || (race.pos && race.pos <= 3))), won = !!(race && (race.won || race.pos === 1));
  const H = 3.2;
  // ---- materials
  const plankT = K.t(ctex(512, 512, (x, w, h) => { x.fillStyle = '#8a8478'; x.fillRect(0, 0, w, h); for (let j = 0; j < 8; j++) for (let i = 0; i < 2; i++) { x.fillStyle = `hsl(36,${6 + R() * 6}%,${44 + R() * 10}%)`; x.fillRect(i * w / 2 + ((j % 2) * w) / 4, j * h / 8 + 1, w / 2 - 2, h / 8 - 2); } speck(x, w, h, R, 900, ['#000', '#fff'], 1.4); }, [1, 1]));
  const wallT = K.t(ctex(1024, 256, (x, w, h) => { x.fillStyle = '#f4f4f2'; x.fillRect(0, 0, w, h); const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, col); g.addColorStop(1, '#111'); x.fillStyle = g; x.fillRect(0, h * 0.7, w, h * 0.3); x.fillStyle = col2; x.fillRect(0, h * 0.68, w, 4); words(x, tname.toUpperCase(), w * 0.3, h * 0.36, `italic 900 ${h * 0.26}px 'Segoe UI', Arial`, col); words(x, E.night !== false ? 'RACE NIGHT' : 'THANK YOU, TEAM', w * 0.78, h * 0.4, `800 ${h * 0.13}px 'Segoe UI', Arial`, '#222'); }));
  const floorM = K.mt(plankT, 0.7), wallM = K.m('#eeeeea', 0.85), ceilM = K.m('#f6f6f4', 0.9, 0, { emissive: '#8c8c88' }), teamM = K.m(col, 0.5), black = K.m('#18191c', 0.5, 0.2), steel = K.m('#b8bec6', 0.3, 0.8), glass = K.glass('#cfe6f0', 0.14);
  const cloth = K.m('#f6f4ee', 0.95), chrome = K.m('#d8dde4', 0.2, 0.9);
  // ---- the unit: a light box, the team's wall at the back, the glass front with its doors, the apron outside
  L.shell(K, -8, -5.5, 8, 5.5, H, { floor: floorM, ceil: ceilM, wall: null }, {}, { floor: 2.4 });
  if (L.wallRun) { L.wallRun(K, wallM, 'x', -5.6, -8.2, 8.2, H, 0.2, [], 2.4); L.wallRun(K, wallM, 'z', -8.1, -5.5, 5.5, H, 0.2, [], 2.4); L.wallRun(K, wallM, 'z', 8.1, -5.5, 5.5, H, 0.2, [], 2.4); }
  K.plane(K.mt(wallT, 0.8), 0, H / 2, -5.48, 16, H);
  for (let x = -7.6; x <= 7.61; x += 1.9) { K.box(black, x, 0, 5.6, 0.08, H, 0.12); } K.box(black, 0, H - 0.1, 5.6, 16, 0.2, 0.14); K.box(black, 0, 0, 5.6, 16, 0.08, 0.14);
  for (let i = 0; i < 8; i++) { const x = -7.6 + i * 1.9 + 0.95; if (Math.abs(x - 4.7) < 0.8) continue; K.plane(glass, x, H / 2, 5.6, 1.82, H - 0.2); }
  K.solid(-8, 5.5, 3.8, 5.7); K.solid(5.6, 5.5, 8, 5.7); K.area(3.8, 4.8, 5.6, 6.4);
  for (let x = -7.4; x <= 7.4; x += 2.2) { K.box(K.e('#fff2dc'), x, H - 0.03, 0, 1.2, 0.02, 0.18); K.pool('#fff0d0', x, 0, 2.2, 0.08); }
  // (the team's stripe round the side walls - stopping either side of the big screen on the west wall, not across it)
  for (const s of [-1, 1]) K.box(teamM, -7.94, 0.9, s * 3.7, 0.04, 0.12, 3.6); K.box(teamM, 7.94, 0.9, 0, 0.04, 0.12, 11);
  // (the apron outside: paving, flags, high tables, the freight being packed)
  K.floor(K.m('#6a6a6e', 0.9), -8, 5.7, 8, 9.2, 2, -0.002); K.area(-7.8, 5.6, 7.8, 9.0);
  for (const x of [-7.4, 7.4]) { K.cyl(steel, x, 0, 9.0, 0.025, 0.025, 4.2, 8); K.box(teamM, x + 0.32, 2.6, 9.0, 0.6, 1.5, 0.01); K.disc(x, 9.0, 0.1); }
  for (const x of [-4.4, -1.6]) { K.cyl(black, x, 0, 7.4, 0.25, 0.28, 0.03, 18); K.cyl(black, x, 0.03, 7.4, 0.035, 0.035, 1.05, 8); K.cyl(cloth, x, 1.08, 7.4, 0.38, 0.38, 0.03, 24); K.disc(x, 7.4, 0.4); }
  cases(K, { case: K.m('#1a1b1e', 0.6), case2: K.m(col, 0.55), metal: steel }, 6.4, 6.4, 4, R);
  // ---- the unit as the paddock sees it (rev. 10-10): offices upstairs behind tinted glass, the team's name along the
  // fascia, a terrace over the glass front - the two- and three-storey team buildings of a real paddock, not a cabin; the
  // paddock's tarmac all round (the circuit's own ground is grass there) with its painted lines and a kerb at the verge;
  // two light masts at the apron's corners, on over the garages by night. Its own seed, so the room's layout stays put.
  {
    const RX = rng(5151), night = E.night !== false, top = H + 0.02;
    const tarT = K.t(ctex(512, 512, (x, w, h) => {
      x.fillStyle = '#4a4b4e'; x.fillRect(0, 0, w, h); speck(x, w, h, RX, 6000, ['#26272a', '#66676a', '#3a3b3e', '#7c7d80'], 1.5);
      // (a few old sealed cracks: long, meandering, faint)
      for (let i = 0; i < 3; i++) { x.strokeStyle = `rgba(24,24,26,${0.07 + RX() * 0.07})`; x.lineWidth = 1 + RX(); x.beginPath(); let px = RX() * w, py = RX() * h, a = RX() * 6.28; x.moveTo(px, py); for (let k = 0; k < 9; k++) { a += (RX() - 0.5) * 0.7; px += Math.cos(a) * 36; py += Math.sin(a) * 36; x.lineTo(px, py); } x.stroke(); }
    }, [1, 1]));
    K.floor(K.mt(tarT, 0.94), -30, -14, 30, 18, 6, -0.02);
    const kerb = K.m('#b4b2ac', 0.9); for (const [x0, z0, x1, z1] of [[-30.25, -14.25, 30.25, -14], [-30.25, -14, -30, 18], [30, -14, 30.25, 18], [-30.25, 18, 30.25, 18.25]]) K.box(kerb, (x0 + x1) / 2, -0.05, (z0 + z1) / 2, x1 - x0, 0.15, z1 - z0);
    // (the walkway line in front of the team buildings, and the bays' white lines between them)
    K.plane(K.m('#d9c23a', 0.8), 0, -0.014, 10.4, 60, 0.12, 0, true); for (const x of [-10.2, 10.2]) K.plane(K.m('#d8d8d4', 0.85), x, -0.014, -1.8, 0.1, 24.4, 0, true);
    // (the roof over the room - clear of its ceiling, so the two never fight - and the offices upstairs, set back for the terrace)
    K.box(K.m('#2a2b2e', 0.8), 0, top, 0.1, 16.4, 0.28, 11.4);
    const up = top + 0.28, uh = 2.9, tint = K.m(night ? '#1a222c' : '#3a4856', 0.12, 0.5);
    K.box(tint, 0, up, -1.0, 16.0, uh, 9.0);
    for (let x = -8; x <= 8.01; x += 1.6) K.box(black, x, up, 3.52, 0.07, uh, 0.08);
    for (let z = -5.5; z <= 3.51; z += 1.8) for (const s of [-1, 1]) K.box(black, s * 8.02, up, z, 0.08, uh, 0.07);
    K.box(black, 0, up + 1.45, 3.52, 16.0, 0.1, 0.08);
    // (by night a few offices still lit behind the tint: a ceiling light, the blinds half down, desks and screens)
    if (night) {
      const winT = K.t(ctex(128, 128, (x, w, h) => {
        vgrad(x, w, h, [[0, '#d8c09a'], [0.3, '#a88a62'], [1, '#3a2e22']]); x.fillStyle = '#fff2d8'; x.fillRect(w * 0.12, 18, w * 0.76, 4);
        x.fillStyle = 'rgba(40,32,24,.55)'; for (let y = 0; y < h * 0.22; y += 5) x.fillRect(0, y, w, 3);
        x.fillStyle = 'rgba(24,18,14,.9)'; x.fillRect(0, h * 0.72, w, h * 0.28); for (let i = 0; i < 3; i++) x.fillRect(w * (0.1 + i * 0.3), h * 0.54, w * 0.16, h * 0.18);
      }));
      const lit = K.e('#c8b496', { map: winT, fixed: true }); for (const i of [1, 2, 5, 8]) K.plane(lit, -7.2 + i * 1.6, up + 0.75, 3.525, 1.5, 1.3);
    }
    // (the fascia: the team's name in its colour on charcoal, a stripe beneath - front and both ends)
    const fasT = K.t(ctex(2048, 96, (x, w, h) => { x.fillStyle = '#1a1b1e'; x.fillRect(0, 0, w, h); x.fillStyle = col; x.fillRect(0, h - 8, w, 8); words(x, tname.toUpperCase(), w / 2, h * 0.46, `italic 900 ${h * 0.62}px 'Segoe UI', Arial`, col); }));
    const fasM = K.mt(fasT, 0.6, 0, { emissive: night ? '#ffffff' : '#000000', emissiveMap: night ? fasT : null, ei: night ? 0.55 : 1 });
    K.box(K.m('#1a1b1e', 0.6), 0, up + uh, -1.0, 16.3, 0.75, 9.3); K.plane(fasM, 0, up + uh + 0.375, 3.66, 16.3, 0.75);
    // (the terrace over the glass front: a glass balustrade with its rail)
    K.plane(glass, 0, up + 0.5, 5.7, 16.2, 1.0); for (const s of [-1, 1]) K.plane(glass, s * 8.1, up + 0.5, 4.6, 2.2, 1.0, s * Math.PI / 2);
    K.box(steel, 0, up + 1.0, 5.7, 16.2, 0.05, 0.06); for (const s of [-1, 1]) K.box(steel, s * 8.1, up + 1.0, 4.6, 0.06, 0.05, 2.2);
    // (the light masts; by night their pools on the tarmac)
    for (const s of [-1, 1]) {
      const x = s * 11.2, z = 12.6; K.cyl(steel, x, 0, z, 0.09, 0.13, 9.0, 10); K.box(black, x, 8.75, z - 0.2, 1.3, 0.12, 0.5);
      K.box(night ? K.e('#fff4e2', { fixed: true }) : K.m('#c8ccd0', 0.4, 0.3), x, 8.6, z - 0.2, 1.2, 0.14, 0.4);
      if (night) { K.pool('#fff1d8', x * 0.7, z - 3.5, 7.5, 0.16, -0.008); K.pool('#fff1d8', x * 0.8, z + 1.5, 5.0, 0.12, -0.008); }
    }
  }
  // ---- the long tables, laid; the buffet along the back; the bar and the team's fridge in the corner
  for (const z of [-1.0, 1.35]) {
    if (L.rectTable) L.rectTable(K, { top: cloth, leg: black }, -2.8, z, 5.4, 0.95, 0.75);
    for (let i = 0; i < 5; i++) { const x = -5.0 + i * 1.1; if (L.chair) { L.chair(K, { wood: black, seat: teamM }, x, z - 0.75, -Math.PI / 2, 0.46, 0.45); L.chair(K, { wood: black, seat: teamM }, x, z + 0.75, Math.PI / 2, 0.46, 0.45); } K.cyl(K.m('#fafafa', 0.3), x, 0.75, z - 0.25, 0.13, 0.13, 0.01, 20); K.cyl(K.m('#fafafa', 0.3), x, 0.75, z + 0.25, 0.13, 0.13, 0.01, 20); }
    for (let i = 0; i < 4; i++) { const x = -4.4 + i * 1.3; K.cyl(K.m(['#d8a040', '#6a9a3a', '#c8503a', '#e8d8b0'][i], 0.8), x, 0.76, z, 0.16, 0.12, 0.05, 16); K.cyl(K.m('#0e2a1a', 0.15), x + 0.45, 0.75, z + 0.1, 0.038, 0.038, 0.3, 10); K.cyl(K.e('#ffcf8a'), x + 0.2, 0.75, z - 0.1, 0.02, 0.02, 0.05, 8); }
  }
  K.box(black, -2.5, 0, -4.95, 8.6, 0.88, 0.7); K.box(cloth, -2.5, 0.88, -4.95, 8.7, 0.03, 0.75); for (let i = 0; i < 7; i++) { const x = -6.2 + i * 1.2; K.box(chrome, x, 0.91, -4.95, 0.6, 0.12, 0.4); K.box(K.m(['#c8823a', '#e8d090', '#6a8a3a', '#b04030'][i % 4], 0.8), x, 1.03, -4.95, 0.56, 0.02, 0.36); }
  K.solid(-6.9, -5.4, 1.9, -4.55);
  K.box(black, 5.6, 0, -3.6, 0.7, 1.05, 3.4); K.box(K.m('#f4f4f2', 0.3), 5.6, 1.05, -3.6, 0.8, 0.05, 3.5); K.box(teamM, 5.26, 0.15, -3.6, 0.02, 0.75, 3.3);
  K.box(K.m('#1a1b1e', 0.3, 0.4), 7.55, 0, -4.2, 0.8, 2.1, 1.6); K.box(K.e(col2 === '#f2f2f2' ? '#e8f4ff' : col2), 7.14, 0.15, -4.2, 0.02, 1.8, 1.4);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) K.cyl(K.m(['#2a5a2a', '#c8a040', '#e8e8e8', '#7a2a1a'][(i + r) % 4], 0.2), 7.12, 0.25 + r * 0.45, -4.75 + i * 0.22, 0.03, 0.03, 0.22, 8);
  K.solid(5.2, -5.4, 8, -1.85); K.pool('#fff2dc', 5.4, -3.6, 1.6, 0.12);
  // ---- the big screen: the race again, on a loop
  const scr = L.screen ? L.screen(K, 512, 288, -7.92, 1.75, 0, 3.6, 2.02, Math.PI / 2) : null; K.box(black, -7.96, 0.7, 0, 0.06, 2.12, 3.72);
  if (scr) { let acc = 0; const tk = String(track === 'silverstone' ? 'SILVERSTONE' : 'LAS VEGAS'); K.anim((t, dt) => { acc += dt; if (acc < 0.16) return; acc = 0; replay(scr, t, tk, race, col, E.meName || 'You', track === 'silverstone' ? 'silverstone' : 'lasvegas'); }); }
  // ---- the trophy on its plinth (a podium tonight), the lounge corner by the glass
  if (podium) { K.box(K.m('#f4f4f2', 0.4), -6.2, 0, 3.8, 0.55, 1.0, 0.55); K.lathe(K.m('#d8b04a', 0.22, 0.85), -6.2, 1.0, 3.8, won ? [[0, 0], [0.12, 0], [0.12, 0.05], [0.04, 0.08], [0.035, 0.3], [0.17, 0.42], [0.2, 0.62], [0.02, 0.6]] : [[0, 0], [0.1, 0], [0.1, 0.04], [0.03, 0.07], [0.03, 0.22], [0.12, 0.3], [0.14, 0.44], [0.02, 0.42]], 24); K.pool('#fff4d0', -6.2, 3.8, 1.2, 0.2); K.solid(-6.5, 3.5, -5.9, 4.1); }
  if (L.sofa) L.sofa(K, { frame: K.m('#2a2c30', 0.9), cushion: teamM, foot: steel }, 2.0, 4.4, 2.6, -Math.PI / 2);
  // ---- the people's places
  const S = (x, z, face, zone, y = 0, pose = 'stand') => K.spot(x, z, face, pose, y, { zone });
  const toward = (x, z, tx, tz) => facing(tx - x, tz - z);
  const spots = {
    boss: [S(-6.4, 1.9, toward(-6.4, 1.9, 0, 2.5), 'floor'), S(4.4, -1.4, toward(4.4, -1.4, 0, 0), 'bar')],
    mate: [S(0.9, 2.7, toward(0.9, 2.7, 2.4, 3.6), 'floor'), S(3.4, -2.6, toward(3.4, -2.6, 5.6, -3), 'bar')],
    partner: [S(1.6, 3.35, toward(1.6, 3.35, 0, 2), 'floor'), S(-0.6, 3.5, toward(-0.6, 3.5, 1, 2.5), 'floor')],
    friend: [S(2.7, 2.2, toward(2.7, 2.2, 1, 2.8), 'floor'), S(3.4, -0.3, toward(3.4, -0.3, 2, 1), 'floor')],
    celeb: [S(3.3, 3.1, toward(3.3, 3.1, 1.8, 2.8), 'floor'), S(-0.4, -3.4, toward(-0.4, -3.4, 0.8, -3.0), 'floor'), S(0.8, -3.15, toward(0.8, -3.15, -0.4, -3.4), 'floor')],
    rep: [S(4.6, -0.4, toward(4.6, -0.4, 3.4, -0.3), 'bar'), S(-1.4, 4.4, toward(-1.4, 4.4, 0, 3.5), 'floor')],
    agent: [S(3.9, 4.1, toward(3.9, 4.1, 2.5, 3), 'floor')], press: [S(-1.6, 3.0, toward(-1.6, 3.0, 0, 2.7), 'floor')], infl: [S(0.2, 0.2, toward(0.2, 0.2, -2.8, 0.2), 'floor')],
    present: [S(5.6, 1.6, toward(5.6, 1.6, 4, 1), 'floor'), S(-3.6, 3.6, toward(-3.6, 3.6, -2, 3), 'floor')],
    rival: [], exmate: [S(4.2, 2.4, toward(4.2, 2.4, 2.8, 2.6), 'floor')], dj: [], security: [], antagonist: [S(6.4, 3.9, toward(6.4, 3.9, 4, 3), 'floor')],
  };
  const group = [S(0.4, 3.6, toward(0.4, 3.6, 1.5, 2.6), 'floor'), S(2.2, 3.7, toward(2.2, 3.7, 1.5, 2.6), 'floor'), S(1.4, 1.9, toward(1.4, 1.9, 1.5, 2.6), 'floor')];
  // ---- the crowd: the team (polos), its guests, the mechanics coming in from the pack-down. Dinner is long over: they
  // stand about the tables with a drink (and nobody sits through a party), a few at the ends of the benches
  const C = crowdList(heroSpots(E, spots, group, [spots.partner[0]])), mechAt = track === 'silverstone' ? 20.75 : 24.5;
  for (const [z, s] of [[-2.3, -1], [2.6, 1]]) for (let i = 0; i < 5; i++) if (R() < 0.75) C.add(-5.0 + i * 1.1 + (R() - 0.5) * 0.3, z, facing(0, -s) + (R() - 0.5) * 0.9, 'staff', 'vip', R() < 0.5 ? 'drink' : 'talk', start - 0.2 + R() * 0.4, { group: 400 + i });
  for (const [x, z] of [[-6.3, -1.0], [0.55, -1.0], [-6.3, 1.35], [0.55, 1.35]]) C.add(x + (R() - 0.5) * 0.2, z, facing(x < -3 ? 1 : -1, 0), 'staff', 'vip', 'drink', start + R() * 0.3);
  for (const [x, z] of [[-4.6, -3.6], [-2.4, -3.7], [-0.2, -3.6], [1.6, -3.9], [2.6, 0.6], [1.2, -0.4], [-6.6, -2.6], [-6.4, 4.6], [-4.6, 4.2], [-3.0, 4.6], [4.6, 1.2], [6.6, 0.8]]) C.add(x + (R() - 0.5) * 0.3, z + (R() - 0.5) * 0.3, R() * 6.28, 'staff', 'floor', R() < 0.5 ? 'talk' : 'drink', start - 0.2 + R() * 0.5, { group: Math.round(x) });
  for (let i = 0; i < 10; i++) C.add(-0.5 + (i % 5) * 0.9 + (R() - 0.5) * 0.3, 0.9 + Math.floor(i / 5) * 0.9 + (R() - 0.5) * 0.2, R() * 6.28, 'mechanic', 'floor', R() < 0.6 ? 'drink' : 'talk', mechAt + R() * 0.15, { group: 200 + (i >> 1) });
  for (const [x, z] of [[5.6, 7.0], [6.8, 7.6], [4.8, 8.2]]) C.add(x, z, R() * 6.28, 'mechanic', 'quiet', 'stand', start - 1, { force: true });
  C.add(6.2, -3.6, facing(-1, 0), 'staff', 'bar', 'stand', start - 1, { force: true });
  // ---- what there is to do
  K.hot({ id: 'bar', kind: 'bar', x: 5.1, y: 1.2, z: -3.4, reach: 2.2, label: 'The bar', sub: 'Champagne, beer from the fridge, wine, soft drinks' });
  K.hot({ id: 'garage', kind: 'garage', x: 4.7, y: 1.2, z: 5.6, reach: 2.0, label: 'Go and thank the crew', sub: 'The garage is still being packed' });
  K.hot({ id: 'door', kind: 'door', x: 0, y: 1.2, z: 8.6, reach: 2.2, label: 'The team car', sub: 'Back to the hotel, or on to the club' });
  K.hot({ id: 'screen', kind: 'flavour', x: -7.3, y: 1.6, z: 0, reach: 3.2, label: 'Watch the race again', text: 'The start again, on a loop. Someone cheers every time the lights go out.' });
  K.hot({ id: 'apron', kind: 'quiet', x: -3.0, y: 1.3, z: 8.6, reach: 2.4, label: 'Step outside for a minute', look: V3(-60, 3, 12) });   // (down the paddock, along the pit building's back - not into its wall)
  if (podium) K.hot({ id: 'trophy', kind: 'flavour', x: -6.2, y: 1.3, z: 3.8, reach: 1.8, label: 'The trophy', text: won ? 'The winner\'s trophy, heavier than it looks, already smudged with fingerprints.' : 'The trophy on its plinth, already smudged with fingerprints.' });
  return {
    light: { hemi: ['#fff2e2', '#5a5048', 0.95], dir: ['#fff6ea', 0.85, [2, 6, 3]], exposure: 1.0, bg: '#1a1a1e' }, lift: 0.05,
    moods: [{ name: 'Party playlist', music: 'clubmusic', hemi: 1, glow: 1, energy: 0.55, occ: 1, bpm: 118 }, { name: 'Celebration', music: 'clubmusic', hemi: 1.05, glow: 1.15, energy: 0.9, occ: 1, bpm: 124 }, { name: 'Wind-down', music: 'clubmusic', hemi: 0.85, glow: 0.85, tint: '#ffb070', energy: 0.3, occ: 0.8, bpm: 104 }, { name: 'Quiet', music: null, hemi: 0.95, glow: 0.9, energy: 0, occ: 0.8, bpm: 0 }],
    start: { x: 0, z: 4.5, yaw: -Math.PI / 2 },   // (a step inside the door, not behind the glass and its mullions)
    date: [spots.partner[0]], group,
    seats: [{ x: -2.8, z: -1.75, yaw: Math.PI / 2, eye: 1.2 }],
    staff: { name: 'Josie', role: 'Hospitality', x: 6.2, z: -2.6, face: facing(-1, 0), hot: 'bar', look: { kit: 'casual', color: col, accent: col2, legs: '#1c1f26', pose: 'talk', seed: 'team-hospitality', figure: 'f' } },
    // (the photographers on the paddock's tarmac, short of the pit building: it can stand from 20 m out)
    paps: [V3(-6, 3, 15), V3(9, 2, 16.5)], bed: hosted ? 'cityfar' : 'room',
    moment: [E.night !== false ? `Out on the apron the paddock is half packed already: forklifts, flight cases, the floodlights still on over the garages.` : `Out on the apron the paddock is half packed already: forklifts, flight cases, the evening sun low over the motorhomes.`, `The air outside smells of rubber and generator diesel. Somewhere a team is singing.`],
    where: 'out on the apron', photoBack: podium ? 'the trophy' : 'the team wall',
    zones: { floor: ZL(RC(-0.4, -3.8, 5.0, 5.4), RC(-8, 2.2, -0.4, 5.4)), bar: ZL(RC(4.8, -5.5, 8, -1.6)), vip: ZL(RC(-6, -2.2, 0.4, 2.4)), dj: ZL(), quiet: ZL(RC(-8, 5.7, 8, 9.2)), door: ZL(RC(3.8, 4.6, 5.6, 6.4)), garage: ZL(RC(3.0, 5.2, 6.4, 7.0)) },
    spots, crowdSpots: C.L, beat: { bpm: 118 }, club: false, bartop: { x: 5.3, y: 1.1, z: -3.6 },
    exits: { front: { x: 0, z: 8.8, yaw: Math.PI / 2 }, side: { x: -7.0, z: 8.8, yaw: Math.PI / 2 }, street: null },
    wall: null, terrace: null, zoneLight: null, heightAt: null,
    booths: [], service: { x: 5.4, z: -2.0 }, props: { trophy: podium, won, screen: scr },
    led: { wall: null, floor: null, say: () => {} },
    people: {},
  };
}
/** the team's screen: the race replayed - a circuit from above, the cars going round, the order down the side */
function replay(S, t, track, race, col, me, tid = null) {
  S.draw((x, w, h) => {
    x.fillStyle = '#0a0c10'; x.fillRect(0, 0, w, h);
    // (the real circuit from above - ui/TrackMaps.js's outline of the lap, north up - fitted to the screen right of the order)
    const TM = TRACK_MAPS[tid] || null, cx = w * 0.6, cy = h * 0.52, rx = w * 0.3, ry = h * 0.32; let P;
    if (TM && Array.isArray(TM.pts) && TM.pts.length > 20) {
      const pts = TM.pts, n = pts.length, bw = w * 0.68, bh = h * 0.84, s = Math.min(bw / TM.w, bh / TM.h), ox = w * 0.29 + (bw - TM.w * s) / 2, oy = h * 0.08 + (bh - TM.h * s) / 2;
      P = (u) => { const f = ((((u / 6.2832) % 1) + 1) % 1) * n, i = Math.floor(f) % n, j = (i + 1) % n, a = f - Math.floor(f); return [ox + (pts[i][0] + (pts[j][0] - pts[i][0]) * a) * s, oy + (pts[i][1] + (pts[j][1] - pts[i][1]) * a) * s]; };
    } else P = (u) => [cx + Math.cos(u) * rx * (1 + 0.18 * Math.sin(u * 3)), cy + Math.sin(u) * ry * (1 - 0.15 * Math.cos(u * 2))];
    x.strokeStyle = '#3a3e46'; x.lineWidth = 10; x.lineJoin = 'round'; x.beginPath(); for (let i = 0; i <= 160; i++) { const [px, py] = P((i / 160) * 6.2832); i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); x.strokeStyle = '#e8e8ea'; x.lineWidth = 2; x.stroke();
    // (the cars in the order the race finished: you where you finished - leading only when you won)
    const cols = ['#ff8000', '#00d2be', '#1e41ff', '#dc0000', '#2b4562', '#006f62', '#ffffff', '#b6babd'], rp = race?.pos || null, myK = rp ? Math.min(7, Math.max(0, rp - 1)) : 0;
    const dot = (k) => { const [px, py] = P(((t * 0.22 - k * 0.07) % 1) * 6.2832), mine = k === myK; x.fillStyle = mine ? col : cols[k]; x.beginPath(); x.arc(px, py, mine ? 7 : 5, 0, 7); x.fill(); if (mine) { x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke(); } };
    for (let k = 7; k >= 0; k--) if (k !== myK) dot(k); dot(myK);
    x.fillStyle = 'rgba(10,12,18,.9)'; x.fillRect(0, 0, w * 0.26, h); x.fillStyle = '#e10600'; x.fillRect(0, 0, w * 0.26, 30);
    words(x, 'REPLAY', w * 0.13, 15, "800 16px 'Segoe UI', Arial", '#fff');
    // (the classification as the race snapshot keeps it - career/Party.js RaceSnap.top - and you on the last row when you were further back)
    const pos = race?.pos || null, top = Array.isArray(race?.top) ? race.top : [], low = pos && pos > 8;
    for (let i = 0; i < 8; i++) {
      const p = low && i === 7 ? pos : i + 1, mine = pos ? p === pos : i === 0, nm = (mine ? me.split(' ').pop() : String(top[i] || '')).toUpperCase().slice(0, 11) || '-';
      x.fillStyle = mine ? 'rgba(255,211,77,.18)' : 'transparent'; x.fillRect(0, 34 + i * 30, w * 0.26, 28); words(x, `${p}`, 18, 48 + i * 30, "700 14px 'Segoe UI', Arial", '#9aa'); words(x, nm, w * 0.14, 48 + i * 30, `700 ${nm.length > 9 ? 12 : 14}px 'Segoe UI', Arial`, mine ? '#ffd34d' : '#dfe3ea');
    }
    x.fillStyle = 'rgba(10,12,18,.85)'; x.fillRect(w * 0.26, h - 34, w * 0.74, 34); words(x, `${String(race?.gp || `${track} Grand Prix`).toUpperCase()} · ${race?.dnf ? 'DNF' : pos ? 'P' + pos : 'THE RACE'}`, w * 0.63, h - 17, "800 16px 'Segoe UI', Arial", '#fff');
  });
}

// =====================================================================================================================
// the Ormond Vault: a Mayfair members' club (invented) - a Georgian house over a brick basement. You come down the
// stairs from the street to a 16 x 12 m vault, 2.7 m at its walls and 3.6 m at the crown: a small floor before the DJ's
// arched alcove, a brass bar along one side with a mirrored back, four velvet banquettes with their lamps, a door to
// the smoking courtyard. The host puts a sticker over every phone's camera on the way in. Sealed throughout - the
// street outside (Georgian railings, a black cab, the photographers) is a set of its own, over the vault's roof, used
// only for the way out. x east, z south.
// =====================================================================================================================
function londonclub(K, E) {
  const L = E.lib || {}, R = rng(2718), hosted = !!E.host, brand = brandLook(E.o?.brand, 'londonclub'), start = partyClock('londonclub').start;
  const Hw = 2.7, Hc = 3.6, SY = 14;
  // ---- materials
  const brickT = K.t(ctex(512, 512, (x, w, h) => bricks(x, w, h, R), [1, 1])), parqT = K.t(ctex(512, 512, (x, w, h) => parquet(x, w, h, R), [1, 1])), flagT = K.t(ctex(256, 256, (x, w, h) => flags(x, w, h, R, ['#6a665e', '#5e5a52', '#726e64', '#585448']), [1, 1]));
  const brickM = K.mt(brickT, 0.9), parqM = K.mt(parqT, 0.45), brass = K.m('#c8963e', 0.3, 0.85), black = K.m('#111013', 0.45, 0.2), velvetG = K.m('#1f3a2c', 0.92), velvetR = K.m('#5a1424', 0.92), wood = K.m('#2a1a10', 0.5);
  const mirror = K.m('#9aa0a8', 0.06, 0.5), leather = K.m('#2a1810', 0.55), lampG = K.e('#ffcf8a');
  // ---- the vault: brick walls, a shallow brick barrel overhead, the parquet floor
  L.shell(K, -8, -6, 8, 6, Hw, { floor: parqM, ceil: null, wall: brickM }, { e: [[3.4, 4.6, 0, 2.3]], s: [[-7.5, -5.7, 0, 2.6]] }, { floor: 2.2, wall: 2.2 });
  for (const x of [-8.1, 8.1]) K.box(brickM, x, Hw, 0, 0.2, Hc - Hw + 0.05, 12.4);
  const span = 12, sag = Hc - Hw, rad = (span * span) / (8 * sag) + sag / 2, th = 2 * Math.asin(span / 2 / rad);
  const vg = new THREE.CylinderGeometry(rad, rad, 16.4, 48, 1, true, -th / 2, th); vg.rotateZ(Math.PI / 2); vg.rotateX(-Math.PI / 2);
  // (the barrel lit from below by the wall lamps and the bar: warm brick overhead, not a black hole - its own faint glow,
  // since a surface facing down gets little of the room's sky light)
  // (16.4 m by ~13 m of barrel: a brick about 0.26 m long)
  const vaultT = K.t(ctex(512, 512, (x, w, h) => bricks(x, w, h, R, 0.3), [8, 6])); K.add(K.mt(vaultT, 0.92, 0, { side: THREE.BackSide, emissive: '#6a4430', emissiveMap: vaultT }), vg, 0, Hc - rad, 0);
  for (let x = -6; x <= 6; x += 4) K.bar(K.m('#1a1a1c', 0.6, 0.6), x, Hw - 0.05, 0, 0.018, 12, Math.PI / 2);
  K.area(7.2, 3.4, 9.2, 4.6);
  // (the DJ's alcove: an arched niche in the west wall, raised a step, a neon script on the brick behind)
  K.box(K.m('#1a1416', 0.7), -7.2, 0, 0, 1.6, 0.3, 3.4); K.box(brass, -6.41, 0.27, 0, 0.02, 0.03, 3.4); K.solid(-8, -1.7, -6.4, 1.7);
  djDesk(K, { black, front: K.m('#2a1a10', 0.5), gear: K.m('#1a1b1f', 0.4, 0.3), platter: K.m('#2a2b30', 0.3, 0.6), ring: K.e('#ffb070'), led: K.e('#ff6a4a'), screen: K.e('#9fb4ff') }, -6.8, 0, 0, 0.3, 1.9);
  const neonT = K.t(ctex(512, 128, (x, w, h) => { x.clearRect(0, 0, w, h); words(x, brand.id ? brand.name : 'Ormond', w / 2, h / 2, `italic 400 ${h * 0.62}px 'Brush Script MT', 'Segoe Script', Georgia, cursive`, brand.id ? brand.color2 : '#ff7ab4', 16); }));
  K.plane(K.e('#ffffff', { map: neonT, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), -7.95, 2.05, 0, 2.6, 0.65, Math.PI / 2);
  K.wash('#ff6aa0', -7.94, 1.9, 0, 3.2, 2.0, Math.PI / 2, 0.16);
  // (the floor: darker boards, a small mirror ball over it, a couple of soft beams)
  const dfT = K.t(ctex(256, 256, (x, w, h) => { x.fillStyle = '#0c0a0a'; x.fillRect(0, 0, w, h); speck(x, w, h, R, 1500, ['#3a2a20', '#fff'], 1.5); })); K.floor(K.mt(dfT, 0.25, 0.1), -6.3, -3.2, -1.0, 3.2, 2, 0.006);
  const ballT = K.t(ctex(128, 64, (x, w, h) => { x.fillStyle = '#4a4e58'; x.fillRect(0, 0, w, h); for (let j = 0; j < h; j += 4) for (let i = 0; i < w; i += 4) { const v = 110 + ((R() * 145) | 0); x.fillStyle = `rgb(${v},${v},${v + 8})`; x.fillRect(i, j, 3, 3); } }));
  const ballM = new THREE.MeshBasicMaterial({ map: ballT, color: '#c8ccd4', toneMapped: false }), ball = K.obj(new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 12), ballM)); ball.position.copy(K.P(-3.6, 3.15, 0)); K.glows.push({ m: ballM, base: ballM.color.clone() });
  const dots = ballDots(K, { x: -3.6, y: 3.15, z: 0 }, [-8, 0.02, -6, 8, Hw + 0.4, 6], 200, 31);
  const beams = beamRig(K, [{ x: -6.0, y: Hw + 0.2, z: -2.6, col: '#ffb070' }, { x: -6.0, y: Hw + 0.2, z: 2.6, col: '#ff6aa0' }, { x: -1.4, y: Hw + 0.4, z: 0, col: '#ffffff' }], 3.6);
  // ---- the brass bar (north wall): a quilted leather front, a brass top, the mirrored back with its bottles and lamps
  K.box(leather, 3.3, 0, -4.9, 6.6, 1.05, 0.62); for (let i = 0; i < 22; i++) K.box(K.m('#1e120a', 0.6), 0.2 + i * 0.3, 0.1, -4.58, 0.02, 0.85, 0.02);
  K.box(brass, 3.3, 1.05, -4.95, 6.8, 0.05, 0.86); K.bar(brass, 3.3, 0.18, -4.45, 0.02, 6.6);
  K.box(wood, 3.3, 0, -5.75, 6.6, 0.9, 0.48); K.plane(mirror, 3.3, 1.9, -5.97, 6.4, 1.6); for (const yy of [1.3, 1.85]) { K.box(K.glass('#ffffff', 0.3), 3.3, yy, -5.82, 6.4, 0.02, 0.3); L.bottles?.(K, 0.3, 6.3, yy + 0.02, -5.82, R, ['#d8862a', '#9fbf4a', '#c23a3a', '#e8d9a0', '#5a8fa8', '#7a2a10'], 26); }
  for (let i = 0; i < 4; i++) { const x = 0.8 + i * 1.7; K.cyl(K.m('#1a1a1c', 0.5, 0.5), x, 2.35, -5.6, 0.004, 0.004, 0.3, 4); K.lathe(brass, x, 2.25, -5.6, [[0.02, 0.12], [0.12, 0.02], [0.13, 0], [0.001, 0.1]], 14); K.sph(lampG, x, 2.26, -5.6, 0.04, 8, 6); }
  for (let i = 0; i < 6; i++) { const x = 0.6 + i * 1.1; if (L.stool) L.stool(K, { metal: brass, seat: leather }, x, -4.05, 0.76); }
  K.solid(0, -6, 6.6, -4.5); for (let i = 0; i < 5; i++) K.pool('#ffb060', 0.8 + i * 1.4, -4.2, 0.9, 0.18);
  // ---- four velvet banquettes, their tables and lamps
  const bm = (v, tuft) => ({ base: K.m('#141012', 0.6), seat: v, back: v, trim: brass, tuft: K.m(tuft, 0.95), top: K.m('#1a120c', 0.3, 0.3), gold: brass, steel: K.m('#b8bec6', 0.25, 0.85), bottle: K.m('#0e2a1a', 0.15, 0.1), foil: K.m('#d8b04a', 0.3, 0.8), num: lampG });
  const BV = [booth(K, bm(velvetG, '#152a20'), 1.2, 4.75, Math.PI / 2, 2.6, 0, 1), booth(K, bm(velvetR, '#3a0e18'), 4.6, 4.75, Math.PI / 2, 2.6, 0, 2),
    booth(K, bm(velvetG, '#152a20'), 6.75, 1.3, Math.PI, 2.4, 0, 3), booth(K, bm(velvetR, '#3a0e18'), 6.75, -2.1, Math.PI, 2.4, 0, 4)];
  for (const b of BV) { K.pool('#ffb060', b.x, b.z, 1.3, 0.22); K.lathe(K.m('#d8b890', 0.9), b.x, 0.56, b.z + 0.0, [[0.07, 0.3], [0.12, 0.12], [0.13, 0.1], [0.001, 0.28]], 14); K.sph(lampG, b.x, 0.68, b.z, 0.05, 8, 6); }
  // (wall lamps between the arches)
  for (const [x, z, ry] of [[-4, -5.95, 0], [-1, -5.95, 0], [-4, 5.95, Math.PI], [-1, 5.95, Math.PI]]) { K.box(brass, x, 1.8, z, 0.12, 0.25, 0.06); K.sph(lampG, x, 2.0, z + (ry ? -0.08 : 0.08), 0.06, 8, 6); K.wash('#ffb070', x, 2.0, z + (ry ? -0.02 : 0.02), 1.4, 1.6, ry, 0.2); }
  // ---- the stairs up to the street (the way in; nobody walks back up them - the door is the way out), the host's stand
  for (let k = 0; k < 8; k++) K.box(K.m('#2a2622', 0.85), -6.6, k * 0.32, 6.2 + k * 0.3, 1.8, 0.32, 0.3);
  K.box(brickM, -7.6, 0, 7.4, 0.2, 4.5, 2.6); K.box(brickM, -5.6, 0, 7.4, 0.2, 4.5, 2.6); K.box(K.m('#0a0a0c', 0.9), -6.6, 2.7, 7.6, 2.2, 1.8, 0.2);
  K.bar(brass, -7.4, 1.1, 7.2, 0.02, 2.6, -Math.PI / 2 + 0.83);
  K.box(K.m('#1a1416', 0.4, 0.2), -4.6, 0, 5.4, 0.5, 1.05, 0.45); K.box(lampG, -4.6, 1.07, 5.4, 0.08, 0.06, 0.08); K.solid(-4.9, 5.15, -4.3, 5.65);
  // ---- the courtyard (east, through the door): high brick walls, a painted sky, heaters, string lights, bistro tables
  // (its brick in the warm spill of the string lights and the heaters, all round - not only the wall facing the moon)
  L.shell(K, 8.4, -4.6, 14.2, 5.2, 6.4, { floor: K.mt(flagT, 0.85), ceil: null, wall: K.mt(brickT, 0.9, 0, { emissive: '#4a3020', emissiveMap: brickT }) }, { w: [[3.4, 4.6, 0, 2.3]] }, { floor: 1.8, wall: 2.2 });
  const skyM = K.e('#6e6e76', { map: K.t(ctex(256, 256, (x, w, h) => londonSky(x, w, h, R))), fixed: true, side: THREE.DoubleSide });
  // (the brick walls in the string lights' and the heaters' warm light)
  for (const [x, z, ry, w] of [[11.3, -4.55, 0, 5.4], [14.15, 0.3, -Math.PI / 2, 9.4], [11.3, 5.15, Math.PI, 5.4]]) { K.wash('#ffb070', x, 2.6, z, w, 3.4, ry, 0.2); K.wash('#ff8a40', x, 1.0, z, w * 0.7, 1.6, ry, 0.12); }
  K.plane(skyM, 11.3, 6.6, 0.3, 6.2, 10.2, 0, true);
  for (let i = 0; i < 6; i++) K.box(K.e('#ffcf8a', { fixed: true }), 8.42, 3.6 + (i % 2) * 1.2, -3.8 + i * 1.5, 0.02, 0.5, 0.3);
  for (const [x, z] of [[9.4, -3.6], [13.3, 4.2]]) { K.cyl(K.m('#6a6e74', 0.4, 0.6), x, 0, z, 0.2, 0.24, 0.06, 14); K.cyl(K.m('#6a6e74', 0.4, 0.6), x, 0.06, z, 0.03, 0.03, 2.1, 8); K.lathe(K.m('#6a6e74', 0.4, 0.6), x, 2.12, z, [[0.02, 0], [0.38, 0.06], [0.4, 0.1], [0, 0.14]], 16); K.cyl(K.e('#ff6a1a'), x, 0.5, z, 0.05, 0.05, 1.4, 10); K.pool('#ff7a2a', x, z, 1.5, 0.22); K.disc(x, z, 0.3); }
  for (const [x, z] of [[10.6, 1.2], [12.6, -1.6], [12.6, 2.2]]) { K.cyl(black, x, 0, z, 0.22, 0.25, 0.03, 16); K.cyl(black, x, 0.03, z, 0.03, 0.03, 0.72, 8); K.cyl(K.m('#2a2a2c', 0.4, 0.5), x, 0.75, z, 0.32, 0.32, 0.025, 20); K.disc(x, z, 0.35); }
  const bulbs = []; for (let i = 0; i <= 12; i++) { const u = i / 12, x = 8.6 + u * 5.4, z = -4.4 + (i % 2 ? 9.4 : 0) * 0 + u * 9.4, y = 3.2 - Math.sin(u * Math.PI) * 0.35; K.sph(K.e('#ffd59a'), x, y, z, 0.035, 8, 6); bulbs.push(x, y, z); }
  K.tube(K.m('#101012', 0.6), [[8.6, 3.2, -4.4], [11.3, 2.85, 0.3], [14.0, 3.2, 5.0]], 0.006, 24, 4);
  for (let i = 0; i < 4; i++) K.pool('#ffc27a', 9.6 + i * 1.3, -3 + i * 2.2, 1.4, 0.1);
  if (L.plant) { const TM = { pot: K.m('#3a3a3c', 0.7), soil: K.m('#2b2118', 1), leaf: K.m('#2d5a2a', 0.9), leaf2: K.m('#456e35', 0.9) }; for (const [x, z] of [[13.6, -4.0], [8.9, 4.6]]) L.plant(K, TM, x, z, 1.3, R); }
  // ---- the street set for the way out (over the vault's roof, nothing of it seen from inside): a Georgian house front -
  // stucco below, London stock above, a black door under its fanlight - railings, the pavement, the kerb, a black cab
  // waiting, the street lamps, the houses opposite painted
  const stuccoM = K.m('#ece8de', 0.8), railM = K.m('#0e0e10', 0.4, 0.5), paveM = K.mt(K.t(ctex(256, 256, (x, w, h) => flags(x, w, h, R, ['#8a8a86', '#7e7e7a', '#94948e']), [1, 1])), 0.85), roadM = K.m('#2a2a2e', 0.9);
  K.at(0, 0, 0, () => {
    K.box(stuccoM, 0, SY, -3.2, 26, 3.4, 0.4); K.box(brickM, 0, SY + 3.4, -3.2, 26, 6.6, 0.4); for (let j = 0; j < 4; j++) K.box(K.m('#d8d2c4', 0.8), 0, SY + 0.6 + j * 0.7, -2.99, 26, 0.03, 0.02);
    for (let i = 0; i < 7; i++) { const x = -12.25 + i * 3.5; if (i === 3) continue; for (const yy of [SY + 4.0, SY + 6.8]) { K.box(K.e(R() < 0.7 ? '#ffd8a0' : '#c8d8ff'), x, yy, -2.98, 1.1, 1.8, 0.02); K.box(K.m('#f4f2ec', 0.6), x, yy + 0.88, -2.97, 1.2, 0.05, 0.03); K.box(K.m('#f4f2ec', 0.6), x, yy, -2.97, 0.04, 1.8, 0.03); } K.box(K.e('#ffd8a0'), x, SY + 1.0, -2.98, 1.1, 1.6, 0.02); }
    K.box(K.m('#0c0c0e', 0.3, 0.3), -1.75, SY, -2.98, 1.2, 2.5, 0.06); K.box(brass, -1.4, SY + 1.1, -2.94, 0.08, 0.08, 0.04); K.box(K.e('#ffe0a0'), -1.75, SY + 2.75, -2.98, 1.1, 0.4, 0.02); K.box(brass, -0.95, SY + 1.4, -2.96, 0.22, 0.28, 0.02);
    for (let x = -12.9; x <= 12.91; x += 0.12) { if (Math.abs(x + 1.75) < 0.7) continue; K.cyl(railM, x, SY, -1.6, 0.008, 0.008, 1.0, 5); K.cyl(railM, x, SY + 1.0, -1.6, 0.001, 0.02, 0.08, 5); }
    K.bar(railM, -4.3, SY + 0.95, -1.6, 0.012, 5.2); K.bar(railM, 2.8, SY + 0.95, -1.6, 0.012, 8.2);
    K.floor(paveM, -13, -3.0, 13, 1.6, 1.2, SY); K.box(K.m('#9a9a96', 0.8), 0, SY - 0.15, 1.7, 26, 0.15, 0.22); K.floor(roadM, -13, 1.8, 13, 9, 3, SY - 0.14);
    for (let x = -11.4; x <= 11.4; x += 3.8) { K.box(K.m('#e8e4d6', 0.9), x, SY - 0.13, 5.4, 1.6, 0.005, 0.12); }
    // (a black cab: the body, its windows, the roof light)
    // (glossy black paint that catches the street light, chrome grille, bumpers and rub strips, a lit cabin behind the glass)
    K.at(2.6, 2.9, 0, () => { const paint = K.m('#1a1b21', 0.22, 0.2), chrome = K.m('#d8dbe0', 0.2, 0.3); /* (little metalness: no sky to reflect out here) */ K.box(paint, 0, SY + 0.3, 0, 4.4, 0.9, 1.8); K.box(paint, -0.2, SY + 1.2, 0, 2.6, 0.7, 1.7);
      K.box(chrome, 2.21, SY + 0.32, 0, 0.04, 0.42, 0.66); K.box(chrome, 2.24, SY + 0.12, 0, 0.06, 0.12, 1.82); K.box(chrome, -2.24, SY + 0.12, 0, 0.06, 0.12, 1.82); for (const s of [-1, 1]) K.box(chrome, 0, SY + 0.62, s * 0.905, 3.9, 0.04, 0.01);
      K.box(K.e('#3a2a18'), -0.2, SY + 1.28, 0, 2.5, 0.42, 1.6); K.box(K.glass('#3a4a5a', 0.6), -0.2, SY + 1.25, 0, 2.62, 0.55, 1.72); K.box(K.e('#ffb020'), 0.2, SY + 1.92, 0, 0.5, 0.12, 0.22); for (const [dx, dz] of [[-1.4, -0.9], [-1.4, 0.9], [1.4, -0.9], [1.4, 0.9]]) K.cyl(K.m('#111', 0.8), dx, SY + 0.05, dz, 0.34, 0.34, 0.24, 16, { rx: Math.PI / 2 }); K.box(K.e('#fff6e0'), 2.21, SY + 0.6, -0.6, 0.02, 0.14, 0.3); K.box(K.e('#fff6e0'), 2.21, SY + 0.6, 0.6, 0.02, 0.14, 0.3); });
    for (const x of [-6, 6]) { K.cyl(railM, x, SY, 1.3, 0.06, 0.08, 3.6, 10); K.box(railM, x, SY + 3.56, 1.3, 0.2, 0.08, 0.2); K.box(K.e('#ffd59a'), x, SY + 3.64, 1.3, 0.4, 0.34, 0.4); K.box(railM, x, SY + 3.98, 1.3, 0.48, 0.08, 0.48); /* (the lantern's lit glass wider than its frame: a cap above, a collar below) */ K.pool('#ffcf8a', x, 1.3, 3, 0.25, SY + 0.012); }
    const opp = K.t(ctex(1024, 256, (x, w, h) => cityBand(x, w, h, R, 0.85))); K.plane(K.e('#ffffff', { map: opp, fixed: true }), 0, SY + 5, 11, 40, 10, Math.PI);
  });
  // ---- the people's places
  const S = (x, z, face, zone, y = 0, pose = 'stand') => K.spot(x, z, face, pose, y, { zone });
  const toward = (x, z, tx, tz) => facing(tx - x, tz - z);
  const [b1, b2, b3, b4] = BV;
  const spots = {
    partner: [S(b1.x + 0.9, b1.z - 1.2, toward(b1.x + 0.9, b1.z - 1.2, b1.x, b1.z), 'vip'), S(b1.x - 0.9, b1.z - 1.2, toward(b1.x - 0.9, b1.z - 1.2, b1.x, b1.z), 'vip')],
    mate: [S(1.6, -3.6, facing(0.2, -1), 'bar'), S(0.2, 2.4, toward(0.2, 2.4, -3, 0), 'floor')],
    rival: [S(4.8, -3.7, facing(-0.2, -1), 'bar'), S(-0.6, -2.4, toward(-0.6, -2.4, -3, 0), 'floor')],
    exmate: [S(6.2, -3.5, facing(-0.5, -1), 'bar')],
    friend: [S(b1.x - 0.4, b1.z - 1.35, toward(b1.x - 0.4, b1.z - 1.35, b1.x, b1.z), 'vip'), S(0.0, 0.6, toward(0.0, 0.6, -3, 0), 'floor')],
    celeb: [S(b2.x - 0.8, b2.z - 1.25, toward(b2.x - 0.8, b2.z - 1.25, b2.x, b2.z), 'vip'), S(b2.x + 0.8, b2.z - 1.25, toward(b2.x + 0.8, b2.z - 1.25, b2.x, b2.z), 'vip'), S(b3.x - 1.3, b3.z + 0.7, toward(b3.x - 1.3, b3.z + 0.7, b3.x, b3.z), 'vip'), S(-2.4, 2.1, toward(-2.4, 2.1, -3.6, 0), 'floor')],
    rep: [S(b2.x + 0.1, b2.z - 1.45, toward(b2.x + 0.1, b2.z - 1.45, b2.x, b2.z), 'vip'), S(b4.x - 1.3, b4.z - 0.6, toward(b4.x - 1.3, b4.z - 0.6, b4.x, b4.z), 'vip')],
    agent: [S(-5.9, 2.4, toward(-5.9, 2.4, -3, 0.5), 'floor')], press: [S(3.2, -3.75, facing(0, -1), 'bar')], infl: [S(2.6, -3.5, facing(0.4, -1), 'bar'), S(-2.8, -1.8, toward(-2.8, -1.8, -6, 0), 'floor')],
    present: [S(b4.x - 1.3, b4.z + 0.8, toward(b4.x - 1.3, b4.z + 0.8, b4.x, b4.z), 'vip'), S(5.6, -3.6, facing(0, -1), 'bar')],
    dj: [S(-7.55, 0, 0, 'dj', 0.3)], security: [S(-5.4, 4.6, toward(-5.4, 4.6, -3, 2), 'door'), S(7.6, 4.0, toward(7.6, 4.0, 5, 3), 'vip')], antagonist: [S(0.4, -1.6, toward(0.4, -1.6, -3, 0), 'floor')], boss: [],
  };
  const group = [S(0.0, 2.2, toward(0.0, 2.2, -3, 0), 'floor'), S(0.8, 1.2, toward(0.8, 1.2, -3, 0), 'floor'), S(-0.6, 1.6, toward(-0.6, 1.6, -3, 0), 'floor')];
  // ---- the crowd: the floor, the bar, the banquettes, the courtyard's smokers and talkers, the host and the doorman
  const C = crowdList(heroSpots(E, spots, group, [spots.partner[0]])), djx = -6.4;
  const fl = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) fl.push([-5.9 + i * 1.0 + (R() - 0.5) * 0.35, -2.7 + j * 1.05 + (R() - 0.5) * 0.3]);
  fl.sort((a, b) => a[0] - b[0] + Math.abs(a[1]) * 0.3 - (b[0] + Math.abs(b[1]) * 0.3));
  let n = 0; for (const [x, z] of fl) { if (n >= 26) break; if (C.add(x, z, facing(djx - x, -z * 0.3) + (R() - 0.5) * 0.9, 'dancer', 'floor', 'dance', +(start + 0.2 + Math.pow(n / 26, 1.2) * 1.4).toFixed(2), { group: (n / 3) | 0 })) n++; }
  for (let i = 0; i < 10; i++) C.add(0.5 + i * 0.62, -3.95 + (i % 2) * 0.55, facing(0, -1) + (R() - 0.5) * 0.6, 'bar', 'bar', i % 3 ? 'drink' : 'lean', +(start + R() * 0.8).toFixed(2));
  for (const b of BV) { const f = b.face, cx = Math.cos(f), sz = -Math.sin(f); for (let k = -1; k <= 1; k += 2) C.add(b.x - cx * 0.9 + sz * k * 0.6, b.z - sz * 0.9 - cx * k * 0.6, f, 'booth', 'vip', 'sit', +(start + R() * 1.2).toFixed(2)); }
  for (let i = 0; i < 9; i++) C.add(9.2 + (i % 3) * 1.6 + (R() - 0.5) * 0.4, -3.6 + Math.floor(i / 3) * 3.2 + (R() - 0.5) * 0.6, R() * 6.28, 'bar', 'quiet', i % 2 ? 'talk' : 'drink', +(start + 0.4 + R() * 1.4).toFixed(2), { group: 300 + Math.floor(i / 3) });
  C.add(-4.95, 5.0, facing(1, -0.3), 'staff', 'door', 'stand', start - 1, { force: true }); C.add(3.3, -5.45, facing(0, 1), 'staff', 'bar', 'stand', start - 1, { force: true });
  for (const [x, z] of [[5.6, 2.2], [-0.4, 4.6]]) C.add(x, z, R() * 6.28, 'server', 'vip', 'stand', start - 0.5);
  for (const [x, z] of [[-0.6, -2.2], [2.2, 3.2]]) C.add(x, z, R() * 6.28, 'promo', 'floor', 'stand', start, { brand: true });
  for (const x of [-4.4, -3.3, 0.0, 1.1]) C.add(x, 0.9 + (R() - 0.5) * 0.4, toward(x, 0.9, -1.75, -2.6) + (R() - 0.5) * 0.2, 'photographer', 'street', 'photo', start - 1, { y: SY, force: true });
  C.add(-0.6, -2.5, facing(0.3, 1), 'staff', 'street', 'stand', start - 1, { y: SY, force: true });
  // ---- what there is to do
  K.hot({ id: 'bar', kind: 'bar', x: 3.3, y: 1.2, z: -4.4, reach: 2.4, label: 'The bar', sub: 'Champagne, cocktails, shots, beer, wine' });
  K.hot({ id: 'table', kind: 'table', x: b1.x, y: 0.6, z: b1.z, reach: 2.0, label: 'Your table', sub: 'A bottle, invite someone over, send a round' });
  K.hot({ id: 'dj', kind: 'dj', x: -6.2, y: 1.2, z: 0, reach: 2.0, label: 'The DJ alcove', sub: 'Ask for something' });
  K.hot({ id: 'dance', kind: 'dance', x: -3.6, y: 1.0, z: 0, reach: 3.2, label: 'Dance' });
  K.hot({ id: 'door', kind: 'door', x: -5.6, y: 1.2, z: 5.3, reach: 1.8, label: 'The stairs up to the street', sub: 'Leave' });
  K.hot({ id: 'courtyard', kind: 'quiet', x: 11.3, y: 1.3, z: 0.3, reach: 3.0, label: 'A quiet minute in the courtyard', look: V3(11.3, 6, -4.6) });
  return {
    light: { hemi: ['#c8a088', '#2a1a12', 0.68], dir: ['#ffb880', 0.5, [2, 5, 3]], exposure: 1.0, bg: '#0a0806' }, lift: 0.07,
    moods: [{ name: 'Lounge', music: 'clubmusic', hemi: 1, glow: 0.9, tint: '#ffa860', energy: 0.4, occ: 0.5, bpm: 118 }, { name: 'Peak time', music: 'clubmusic', hemi: 0.86, glow: 1.15, tint: '#c878ff', energy: 1, occ: 1, bpm: 128 },
      { name: 'Garage classics', music: 'clubmusic', hemi: 0.86, glow: 1.1, tint: '#4ab0ff', energy: 0.85, occ: 0.9, bpm: 132 }, { name: 'Last orders', music: 'clubmusic', hemi: 0.92, glow: 0.9, tint: '#ffb070', energy: 0.5, occ: 0.6, bpm: 122 }],
    start: { x: -6.6, z: 5.1, yaw: -Math.PI / 2 },
    date: [spots.partner[0]], group,
    seats: [{ x: b1.x, z: b1.z + 0.9, yaw: -Math.PI / 2, eye: 1.16 }],
    staff: { name: 'Teddy', role: 'Bartender', x: 3.3, z: -5.35, face: facing(0, 1), hot: 'bar', look: { kit: 'blazer', color: '#1a1410', accent: '#ece6da', legs: '#121012', pose: 'talk', seed: 'ormond-bartender' } },
    paps: [], bed: 'room',
    moment: ['The courtyard smells of rain on old brick and somebody\'s cigar. Up past the walls the London sky glows orange; a taxi idles somewhere in the mews.', 'Heaters ticking, a burst of laughter from a table in the corner, the bass a muffled pulse through the door.'],
    where: 'out in the courtyard', photoBack: 'the vault',
    zones: { floor: ZL(RC(-6.4, -3.4, -0.8, 3.4)), dj: ZL(RC(-8, -1.8, -6.3, 1.8)), bar: ZL(RC(0, -6, 6.8, -3.2)), vip: ZL(RC(-0.4, 3.6, 6.2, 6), RC(5.6, -3.6, 8, 3.0)), quiet: ZL(RC(8.2, -4.6, 14.2, 5.2)), door: ZL(RC(-8, 3.6, -4.2, 6)) },
    spots, crowdSpots: C.L, beat: { bpm: 128 }, club: true, bartop: { x: 3.3, y: 1.1, z: -4.5 },
    exits: { front: { x: -6.6, z: 5.4, yaw: Math.PI / 2 }, side: { x: 8.6, z: 4.0, yaw: 0 }, street: { x: -1.75, y: SY, z: -2.2, yaw: Math.PI / 2, cam: { x: 0.8, y: SY + 1.6, z: 4.6 }, look: { x: -1.75, y: SY + 1.2, z: -2.4 }, paps: [{ x: -4.4, y: SY + 1.65, z: 0.8 }, { x: -3.3, y: SY + 1.7, z: 0.9 }, { x: 0.0, y: SY + 1.65, z: 0.8 }, { x: 1.1, y: SY + 1.7, z: 0.9 }] } },
    wall: null, terrace: null,
    zoneLight: { quiet: { sky: '#4a4450', ground: '#3a2418', hemi: 0.62, key: '#ffb070', keyI: 0.6, keyDir: [2.5, 5, -1], world: 0 } },
    heightAt: levels([{ ...RC(-8, -1.7, -6.4, 1.7), y: 0.3 }]),
    booths: BV.map((b, i) => ({ id: 'b' + (i + 1), x: b.x, z: b.z, y: 0, face: b.face, mine: i === 0, host: i === 1 })), service: { x: 6.4, z: -3.8 }, props: {},
    led: { wall: null, floor: null, say: () => {} },
    people: { dj: { name: 'Lou Marchant', look: { kit: 'silkshirt', color: '#111114', accent: '#111114', legs: '#111114', pose: 'talk', seed: 'ormond-resident-dj', acc: ['watch'], jewel: { chain: true } } },
      security: { name: 'Door staff', look: { kit: 'pantsuit', color: '#0c0c0e', accent: '#0c0c0e', legs: '#0c0c0e', pose: 'cross', seed: 'ormond-security', jitter: 0.02 } } },
    fx: { beams, dots, ball },
    _anim: (() => { K.anim((t) => {
      const B = beatOf(E, 128), e = B.energy ?? 0.5, g = E.mk?.glow ?? 1;
      beams.set(B.t, REDUCED ? 0 : 0.35 + 0.3 * e, (REDUCED ? 0.12 : 0.14 + 0.18 * e) * g, null);
      const sc = (E.renderer?.domElement?.height || 900) / (2 * Math.tan(((E.cam?.fov || 64) * Math.PI) / 360));
      dots.set(t * (REDUCED ? 0.06 : 0.22), (0.25 + 0.3 * e) * g, sc); ball.rotation.y = t * 0.22;
    }); return null; })(),
  };
}
