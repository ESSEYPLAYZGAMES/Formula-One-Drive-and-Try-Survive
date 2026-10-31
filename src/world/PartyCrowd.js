// The crowd at a party (ui/PartyVenues.js's rooms, run by ui/Hangout.js and ui/PartyPlay.js): the dance floor full of
// people in their clubwear swaying to the music - some with a drink in the hand, now and then a few of them with their
// arms up - the bar crowd with their drinks, guests in the VIP booths, bottle-service servers in house black, go-go
// dancers on the podiums, the brand's promo staff on a sponsor's night, a security man at the door, the house
// photographer's flash; at the team's own party its staff in their polos and the mechanics coming in late. Everybody is
// one of a few templates (world/Crowd.js's, baked with spec.club: indexed, a woman's own figure and kit, the cloth's
// shading, a nod about each head's own neck), instanced, each person's colours their own: some three dozen draw calls
// for a hundred people. Three levels of detail by distance from the camera (near, mid - skirts and hair kept - and the
// far tube bodies with a skirt's cone), re-sorted twice a second. The dancing is the shader's: the body above the hips
// swung side to side on the music's beat, the shoulders turned against the hips, the knees giving on every beat - all
// of it a smooth share of each vertex's height, so a skirt's seam never parts - and every 4-8 beats some of the floor
// throw their arms up (a template swap). No light is added anywhere: the room's light is chained into the crowd's
// material (Hangout's roomPatch) when hosted, the scene's own when not.
//
// ==== PUBLISHED CONTRACT (WP3: PartyCrowd) - WP2 (Hangout/PartyVenues) and WP5 (PartyPlay) code against this =========
//
// import { PartyCrowd, HeroFrames } from '../world/PartyCrowd.js';
//
// new PartyCrowd(o)
//   o.night    boolean   a night's lift for the dark (default true)
//   o.bpm      number    the music's tempo, beats a minute (default 124) - only used when update() gets no beat
//   o.patch    function|null  ui/Hangout.js's roomPatch when hosted (the room's light into the crowd's shader); null
//                       unhosted (the scene's own lights). The material is cached per (patched, side) for the session
//   o.keepKey  string    the userData flag set true on every object the crowd adds, so the host's dispose leaves its
//                       shared materials alone (default 'hgKeep' - Hangout._dispose reads o.userData.hgKeep)
//   o.lift     number    the venue's lift for people (default 0.08): emissive = colour x lift, more for dark colours
// .group : THREE.Group - add it to the venue's group. Everything below (spots, the camera, x/z) is in that group's frame
//
// .build(spots, pools) -> Array<() => void> - the bake steps, in order: push each into Hangout's one-a-frame queue
//   before _compile (each bakes at most 2 templates - 0.1-0.4 s each for hers, a few tens of ms for his, measured
//   2026-10-10 under load; a template baked before (prewarm, an earlier party) is not baked again; the
//   last step makes the meshes and stands everyone - so compileAsync sees the crowd's material). Nothing is drawn and
//   update() does nothing until the last step has run.
//   spots: [{ x, z,                  where (the venue's frame, metres)
//            yaw | face,             the turn about y as Hangout's spots' face (a person faces +x unturned: facing
//                                    (cos yaw, 0, -sin yaw)); or look: { x, z } - the point they face (the DJ, a table)
//            zone,                   'floor' | 'dj' | 'bar' | 'vip' | 'quiet' | 'door' | 'podium' | 'tables' | 'garage' |
//                                    anything else (a patron standing with a drink)
//            from,                   the clock hour it fills from (past midnight as 24+: 00:30 = 24.5); patrons fill
//                                    in this order as occupancy rises
//            role?,                  'dancer' | 'bar' | 'booth' | 'server' | 'performer' | 'promo' | 'security' |
//                                    'photographer' | 'mechanic' | 'staff' - by zone if not given (floor/dj dancer,
//                                    bar/quiet bar, vip booth, door security, podium performer, garage mechanic,
//                                    tables staff (team) or bar (club)); a club's 'staff' is security at the door, the
//                                    street or the casino, else a server
//            y?,                     the floor's height there (a raised booth 0.45, a podium, the DJ's stage)
//            seat?,                  true: sitting on a sofa or a chair (seat 0.44-0.48 m, its back 0.3 m behind) - a
//                                    woman or a man sitting back, a drink in the hand
//            lean? }]                true: a counter or rail at ~1.05 m, 0.4 m in front - forearms on it (men)
//   pools: { kind: 'club' | 'team',  the room's crowd: a club's clubwear, or the team's party (polos, guests)
//            brand?: { name, color, accent }   a sponsor's takeover: its promo staff in its colours
//            team?: { color, accent }          the team's colours (its staff, the mechanics)
//            seed?,                  which kits and hair the night's templates wear (default: one of three sets by kind,
//                                    in turn - the next party wears another, the fourth bakes nothing new; pass
//                                    season*100+round for a set of its own)
//            women?,                 the share of women among the patrons (club 0.55, team 0.3)
//            occ?,                   the share in the room when it first stands (default 0.5)
//            cam?: { x, z } }        where the camera first is (default the spots' middle)
// .update(dt, cam, beat, occupancy, fwd?)  every frame while the room is shown
//   cam: { x, y, z } the camera in the group's frame; beat: the music's beat clock in beats (a running count, float -
//   a 0..1 phase that wraps works too; undefined: the crowd keeps its own at o.bpm); occupancy 0..1: the share of the
//   patrons in the room (the clock's fill x the mood: Warm-up 0.4, Peak 1, Last hour 0.55) - staff are always there;
//   fwd (optional { x, z }): the camera's facing in the group's frame - people only come and go out of its sight; given,
//   only the people in front of it are drawn (rev. 10-11: beyond 1.6 m and over ~70 degrees off it they are left out of
//   the meshes, re-packed whenever the view turns ~10 degrees)
// .viewCull  boolean (default true): false draws everyone whatever the view (an off-camera render, a test)
// .zoneOnly  string | null (rev. 10-11): a zone ('quiet') whose people alone are drawn, plus anyone within 5 m of the
//   camera - Hangout sets it out on a club's terrace or courtyard, where the room is behind its walls
// .energy  number 0..1 (default 1): how hard the room dances (a slow set, the lights up)
// .push(x, z, r = 0.45) -> 0..1  you pushing through at (x, z): the people in the way stepped aside (they drift back
//   to their places), how hard it was - to slow you down
// .near(x, z, r) -> number  how many of the crowd stand within r of (x, z) now (privacy: PartyPlay.isPrivate)
// .flashes() -> [{ x, y, z }]  the photographers' flashes fired since the last call (the group's frame; the array and
//   its entries are reused: read them before the next call)
// .arrive(role) / .leave(role)  everyone of a role in (out) at once - the mechanics arriving in a body after the
//   pack-down (call it under a blink: nobody walks in)
// .snap()  every pending arrival and departure made now (under a blink, or a cut)
// .stats() -> { people, active, meshes, calls, tris, templates, baked } (tests, perf)
// PartyCrowd.prewarm(kind = 'club', o = {}, pools = {}) -> bake(): boolean  (static; optional) the next party's templates
//   ahead of its cover - the set build() will take next, so its steps then cost nothing. Each bake() call bakes one
//   template (0.1-0.4 s on the main thread - call it only while nothing moves: a static menu, between pages), false once
//   all are baked. A subclass's own: PoolCrowd.prewarm('club', { night }) bakes the pool's
// .dispose()  out of its parent, its geometry and the flashes' material given back (the templates and the shared
//   material are kept for the session); safe to call twice, and after Hangout._dispose has run
//
// new HeroFrames(person, opts, o?) - a principal's dance (or other) poses as bodies of their own (WP5's dance partner):
//   person: makePerson's result (g.person); opts: the options it was made with (g.opts); o: { poses (default
//   ['dance1', 'dance2', 'dance3']), prep(group) (the caller's own touches to a new body's materials - a night lift,
//   roomLit - for any the person has not got) }
//   .steps() -> Array<() => void>  one body built a step (behind the cover: ~10k triangles, 15-35 ms each)
//   .show(pose | null)  that pose's body shown with the person's own head on it (its face, hair, make-up), or their own
//                       body back (null); -> the frame shown or null
//   .bow   the head's bow (rotation.z) for the body shown - the host's nods add to it
//   .dispose()  their own body and head back as they were, the frames given back (the person's materials are kept)
// ==========================================================================================================================
import * as THREE from 'three';
import { templateOf, hasTemplate, SKINS } from './Crowd.js';
import { makePerson, CLUB_KITS, CLUB_KITS_M } from './People.js';

const NEAR = 7, MID = 14, HYST = 0.5;   // m: near detail within NEAR, mid to MID, the tube bodies beyond (a margin either way against flicker)
const MAXP = 96;
const SETS = 3, NIGHTS = {};   // (the nights' sets of kits taken in turn by kind, when the caller gives no seed)
const TAU = Math.PI * 2;
/** a seeded generator (mulberry32) -> () => 0..1 */
const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const hashS = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const pickR = (R, a) => a[Math.floor(R() * a.length) % a.length];

// ---- the clothes: what each kit shows at a distance (People.js OUTFITS) -------------------------------------------------
// hem (a skirt's: People.js HEMS), sep (the skirt in the accent colour), arms ('skin' bare, 'short' sleeves, 'long'),
// mid (a bare midriff), tr (trousers: their cut), jk (a jacket open over the top: the top beneath in the accent)
const KIT = {
  cutoutmini: { hem: 'mini', arms: 'skin' }, sidecut: { hem: 'mini', arms: 'skin' }, keyhole: { hem: 'thigh', arms: 'long' },
  backless: { hem: 'mini', arms: 'long' }, diamond: { hem: 'midi', arms: 'skin' }, ribcut: { hem: 'midi', arms: 'long' }, hipcut: { hem: 'micro', arms: 'skin' },
  haltermicro: { hem: 'micro', arms: 'skin', glitz: 1 }, camiskirt: { hem: 'thigh', arms: 'skin', sep: 1 },
  corsettop: { arms: 'skin', tr: 'wide' }, corsetleather: { arms: 'skin', tr: 'leather' }, bandeauset: { hem: 'micro', arms: 'skin', mid: 1 },
  twistset: { hem: 'midi', arms: 'skin', mid: 1 }, tieset: { hem: 'mini', arms: 'skin', mid: 1 }, onecrop: { arms: 'skin', mid: 1, tr: 'jeans' },
  lowrise: { arms: 'short', mid: 1, tr: 'wide' }, cropjeans: { arms: 'skin', mid: 1, tr: 'jeans' }, blazerbra: { hem: 'micro', arms: 'long', mid: 1, jk: 1 },
  blazerbtn: { hem: 'mini', arms: 'long', jk: 1 },
  // (a sheer layer is left off in a crowd - the dress beneath is what shows: the mesh dress's bardot micro slip)
  meshdress: { hem: 'micro', arms: 'skin' }, lacemini: { hem: 'mini', arms: 'skin' }, slipmini: { hem: 'mini', arms: 'skin' },
  // (the lace (world/Lace.js): far off, the lined dress and its colour; sheer lace sleeves read as bare arms)
  lacebustier: { hem: 'mini', arms: 'skin' }, lacecorset: { arms: 'skin', tr: 'leather' }, lacecorsetwide: { arms: 'skin', tr: 'wide' }, lacebody: { arms: 'long', tr: 'wide', jk: 1 },
  laceset: { hem: 'mini', arms: 'skin', mid: 1 }, lacesleeve: { hem: 'mini', arms: 'skin' },
  bodycon: { hem: 'mini', arms: 'skin' }, sequin: { hem: 'mini', arms: 'skin', glitz: 1 }, bardot: { hem: 'short', arms: 'skin' },
  dress: { hem: 'knee', arms: 'short' }, jumpsuit: { arms: 'short', tr: 'wide' }, wrap: { hem: 'knee', arms: 'long' }, coord: { arms: 'short', tr: 'wide' },
  slip: { hem: 'midi', arms: 'skin' }, oneshoulder: { hem: 'short', arms: 'skin' },
  // his (and anyone's off duty)
  silkshirt: { arms: 'long' }, knitpolo: { arms: 'short' }, teeblazer: { arms: 'long', jk: 1 }, leather: { arms: 'long', jk: 1 }, bomber: { arms: 'long', jk: 1 },
  pantsuit: { arms: 'long', jk: 1 }, blazer: { arms: 'long', jk: 1 }, casual: { arms: 'short', tr: 'jeans' }, sweater: { arms: 'long', tr: 'jeans' },
  polo: { arms: 'short' }, jacket: { arms: 'long' },
};
// (a hem's height on a man's frame, for the far bodies' skirt cone - world/Crowd.js scales it with the body)
const HEM_Y = { micro: 0.8, mini: 0.74, thigh: 0.69, short: 0.64, knee: 0.5, midi: 0.34, floor: 0.08 };
// (her clubwear sorted: the bare midriff of a bandeau or a crop, the minis and micros, the rest (slit midis, corsets) -
// a night's floor has all of them)
const MIDRIFF = ['bandeauset', 'twistset', 'tieset', 'onecrop', 'cropjeans', 'lowrise', 'blazerbra', 'laceset'];
const MINIS = ['cutoutmini', 'sidecut', 'keyhole', 'backless', 'hipcut', 'haltermicro', 'camiskirt', 'slipmini', 'lacemini', 'meshdress', 'blazerbtn', 'lacebustier', 'lacesleeve'];
// (her hair: worn down most often out at night, some up, a few short)
const HS_F = ['long', 'waves', 'blowout', 'long', 'waves', 'curlyLong', 'highpony', 'ponytail', 'messybun', 'blowout', 'bob', 'curlybun', 'topknot', 'pixie'];
const SHORT_F = new Set(['bob', 'pixie', 'topknot', 'bun', 'highpony', 'curlybun', 'messybun']);
const HS_M = ['short', 'short', 'buzz', 'side', 'quiff', 'swept', 'curly', 'wavy', 'locs'], FH_M = [null, null, null, 'stubble', 'stubble', 'beard'];
// the colours people wear out at night (sRGB): black most of all, then the rest
const COL = {
  dress: ['#0d0d10', '#0d0d10', '#0d0d10', '#0d0d10', '#f4f1ea', '#b5121b', '#e0218a', '#0f6b4f', '#1f3fae', '#c9c3b8', '#d4af37', '#c0c0c8', '#d9c08a', '#7d5ba6', '#5a0f1e', '#3b2416', '#ff5ea8', '#111a3a', '#e85d2a', '#9fd3c7'],
  acc: ['#0d0d10', '#0d0d10', '#f4f1ea', '#d4af37', '#c0c0c8', '#5a0f1e', '#3b2416'],
  trousers: ['#0d0d10', '#0d0d10', '#f4f1ea', '#e8dcc8', '#b5121b', '#1b2440', '#5a5f66'],
  denim: ['#2c3e66', '#3d5172', '#1e2a44', '#6f87a8', '#d8d8d4', '#141414'],
  shirt: ['#0d0d10', '#0d0d10', '#f4f1ea', '#1b2440', '#e9e2d0', '#5a0f1e', '#0f3b2e', '#d9a6b0', '#2a4d8f', '#3a3f48', '#8a6a44', '#c9c3b8'],
  tee: ['#f4f1ea', '#0d0d10', '#e9e2d0', '#3a3f48'],
  mlegs: ['#0d0d10', '#1c1f26', '#24272d', '#3a3a3e', '#2c3e66', '#1e2a44', '#c9bba0'],
  hairF: ['#1b1512', '#2a1e17', '#3b2a1e', '#5a3d27', '#7a5434', '#a77d4c', '#c9a46c', '#e3cf9e', '#8a3b1e', '#121212', '#d8c7a8', '#2a1e17'],
  hairM: ['#1b1512', '#2a1e17', '#3b2a1e', '#5a3d27', '#121212', '#8f8f8f', '#7a5434', '#1b1512'],
  perf: ['#c0c0c8', '#d4af37', '#0d0d10', '#f4f1ea', '#ff2f8a', '#21e0d0', '#e0218a'],
  smart: ['#0d0d10', '#1b2440', '#f4f1ea', '#5a0f1e', '#0f3b2e', '#c9c3b8', '#7d5ba6', '#b5121b', '#d98fa0'],
};
// (a garment never the wearer's own skin tone: in club light a nude top reads as bare skin - CIELAB distance from the
// skin at least SKIN_DE, else picked again, else black)
const SKIN_DE = 20;
function labOf(hex) {
  const n = parseInt(String(hex).slice(1), 16), f = (v) => { v /= 255; v = v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; return v; };
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.9505, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.089;
  const h = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116), fx = h(X), fy = h(Y), fz = h(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
function farFromSkin(R, list, skin, first) {
  const s = labOf(skin), ok = (v) => { const l = labOf(v); return Math.hypot(l[0] - s[0], l[1] - s[1], l[2] - s[2]) >= SKIN_DE; };
  let v = first; for (let k = 0; k < 6 && !ok(v); k++) v = pickR(R, list);
  return ok(v) ? v : '#0d0d10';
}
const HOUSE = '#0b0b0e';   // (the house's black: servers, security)

// ---- the crowd's material: the room's light, the music --------------------------------------------------------------------
const VERT_PARS = 'attribute float part; attribute vec4 aux; attribute vec3 iSkin; attribute vec3 iTop; attribute vec3 iLegs; attribute vec3 iHair; attribute vec3 iAcc; attribute vec3 iTeam; attribute vec4 iMisc; uniform float uBeat; uniform float uSway; uniform float uEnergy; varying vec3 vPC; varying float vFl;';
const VERT = `
  vec3 pc = vec3(0.03);
  if (part < 0.5) pc = iSkin; else if (part < 1.5) pc = iTop; else if (part < 2.5) pc = iLegs; else if (part < 3.5) pc = iHair;
  else if (part < 4.5) pc = vec3(0.02); else if (part < 5.5) pc = iAcc; else if (part < 6.5) pc = iTeam; else if (part < 7.5) pc = vec3(0.82, 0.8, 0.76);
  else if (part < 8.5) pc = vec3(0.03, 0.022, 0.015); else if (part < 9.5) pc = iSkin * 0.5; else if (part < 10.5) pc = vec3(0.01);
  else if (part < 11.5) pc = vec3(0.022, 0.03, 0.026); else if (part < 12.5) pc = mix(vec3(0.95, 0.74, 0.4), vec3(0.85, 0.86, 0.88), step(0.5, fract(iMisc.x * 0.37)));
  else if (part < 13.5) pc = mix(iSkin * 0.55, vec3(0.42, 0.05, 0.08), 0.55);
  else if (part < 14.5) { float gq = fract(iMisc.x * 2.3 + 0.13); pc = gq < 0.3 ? vec3(0.9, 0.8, 0.48) : gq < 0.55 ? vec3(0.78, 0.48, 0.2) : gq < 0.75 ? vec3(0.88, 0.42, 0.5) : vec3(0.8, 0.86, 0.9); }   // (the drink in it: champagne, a whisky or a cola, a pink cocktail, a clear one)
  else pc = vec3(1.0, 0.86, 0.6);
  vPC = pc * aux.x; vFl = step(14.5, part) + 0.12 * step(13.5, part) * step(part, 14.5);
  float e = iMisc.y * uEnergy, ph = 3.14159265 * uBeat + iMisc.x;
  // (a nod on the beat: the head turned about its own neck - aux.zw - by as much of each vertex as is the head's, aux.y)
  float nd = -aux.y * iMisc.z * (0.5 + 0.5 * sin(2.0 * ph));
  vec2 nq = transformed.xy - aux.zw; transformed.xy = vec2(nq.x * cos(nd) - nq.y * sin(nd), nq.x * sin(nd) + nq.y * cos(nd)) + aux.zw;
  // (the sway: the body above the hips swung side to side about them, a swing every two beats - none of it below the
  // hips, all of it by the chest, a smooth share between: a skirt's seam never parts)
  float hw = smoothstep(0.88, 1.36, position.y) * e, sa = uSway * hw * sin(ph);
  vec2 sq = transformed.zy - vec2(0.0, 0.9); transformed.zy = vec2(sq.x * cos(sa) - sq.y * sin(sa), sq.x * sin(sa) + sq.y * cos(sa)) + vec2(0.0, 0.9);
  // (the shoulders turned against the hips, a little)
  float tw = uSway * 0.7 * hw * iMisc.w * cos(ph);
  vec2 tq = transformed.xz; transformed.xz = vec2(tq.x * cos(tw) - tq.y * sin(tw), tq.x * sin(tw) + tq.y * cos(tw));
  // (the knees giving on every beat, the feet planted)
  transformed.y -= e * 0.024 * (0.5 + 0.5 * cos(6.2831853 * uBeat + iMisc.x)) * smoothstep(0.06, 0.55, position.y);
`;
const FRAG_PARS = 'varying vec3 vPC; varying float vFl; uniform float uLift;';
// (a dark room's lift: a share of each colour, the more the darker it is - a black dress, deep skin still read - and a
// sparkler's light its own)
const FRAG_EM = `
  float lmC = dot(vPC, vec3(0.2126, 0.7152, 0.0722));
  totalEmissiveRadiance += vPC * uLift * (1.0 + 1.4 * (1.0 - smoothstep(0.03, 0.35, lmC))) + (vFl > 0.5 ? vec3(1.0, 0.8, 0.5) * 3.0 : vPC * vFl);
`;
const MATS = new Map();
/** the crowd's material - cached for the session by (patched, double-sided): one program each, nothing recompiled at a second party */
export function clubMaterial(patch, double = false) {
  const k = (patch ? 'room' : 'own') + (double ? ':2' : ':1'); let m = MATS.get(k); if (m) return m;
  m = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0 }); m.side = double ? THREE.DoubleSide : THREE.FrontSide;
  const U = { uLift: { value: 0.08 }, uBeat: { value: 0 }, uSway: { value: 0.07 }, uEnergy: { value: 1 } };   // (uSway: 4 degrees at most)
  m.userData.u = U; m.userData.timeSkip = true;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + VERT_PARS).replace('#include <begin_vertex>', '#include <begin_vertex>\n' + VERT);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + FRAG_PARS).replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb *= vPC;').replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + FRAG_EM);
    if (patch) patch(sh);
  };
  m.customProgramCacheKey = () => 'crowd-club-v1' + (patch ? '-room' : '');
  MATS.set(k, m); return m;
}
// (kits whose cut-outs or open backs would show through to nothing from some side: drawn double-sided - none found so far)
const DOUBLE = new Set();

const ATTR = ['iSkin', 'iTop', 'iLegs', 'iHair', 'iAcc', 'iTeam'];
const STAFF = new Set(['server', 'performer', 'promo', 'security', 'photographer']);
const STILL = new Set(['security', 'performer', 'photographer']);   // (never pushed aside)

export class PartyCrowd {
  constructor(o = {}) {
    this.night = o.night !== false; this.bpm = o.bpm || 124; this.patch = o.patch || null; this.keepKey = o.keepKey || 'hgKeep'; this.lift = o.lift ?? 0.08;
    this.group = new THREE.Group(); this.group.name = 'party-crowd'; this.group.userData[this.keepKey] = true;
    this.people = []; this.tpl = []; this.recs = []; this.ready = false; this.gone = false; this.energy = 1;
    this.B = 0; this._bPrev = null; this._bOff = 0; this._bInt = -1; this._lodT = 0; this._yawT = 0; this._cam = new THREE.Vector3(1e9, 0, 0); this._camL = new THREE.Vector3(1e9, 0, 0); this._dirty = true;
    this._M = new THREE.Matrix4(); this._Q = new THREE.Quaternion(); this._P = new THREE.Vector3(); this._S = new THREE.Vector3(); this._Y = new THREE.Vector3(0, 1, 0);
    this._fl = []; this._flN = 0; this._flOut = []; this._flT = 0; this._baked = 0;
    this.mat = clubMaterial(this.patch, false);
  }

  // ---- the night's templates ------------------------------------------------------------------------------------------
  /** the templates a kind of room wears, by role and figure: [{ role, fig, near (spec), alt (a pair's other pose), w (its share of the role) }] */
  _plan(pools, R) {
    const T = [], club = pools.kind !== 'team';
    const add = (role, fig, kit, pose, extra = {}) => { const t = { role, fig, kit, pose, hs: extra.hs, alt: null, w: extra.w ?? 1, spec: null, ...extra }; T.push(t); return t; };
    const hsF = () => pickR(R, HS_F), hsM = () => pickR(R, HS_M), fhM = () => pickR(R, FH_M);
    const earF = () => ({ earrings: pickR(R, ['drop', 'hoop', 'stud', 'long']), chain: R() < 0.4 });
    if (club) {
      // (her kits for the night: a bandeau or a crop, a mini, and more besides - no two the same)
      const left = CLUB_KITS.slice(), take = (from) => { const c = from.filter((k) => left.includes(k)); const k = c.length ? pickR(R, c) : pickR(R, left); left.splice(left.indexOf(k), 1); return k; };
      const kA = take(MIDRIFF), kB = take(MINIS), kC = take(R() < 0.5 ? MIDRIFF : MINIS), kD = take(left), kE = take(left), kF = take(MINIS), kG = take(MIDRIFF), kH = take(left);
      const holdD = () => (R() < 0.6 ? pickR(R, ['glass', 'coupe', 'flute']) : null);
      // (on the floor: one kit in a pair of poses - arms down, arms up - and three more)
      const a1 = add('dancer', 'f', kA, 'dance1', { hs: hsF(), hold: holdD(), w: 1.3 }); const a2 = add('dancer', 'f', kA, 'dance2', { hs: a1.hs, hold: a1.hold, w: 0, pair: true }); a1.alt = a2;
      add('dancer', 'f', kB, 'dance3', { hs: hsF(), hold: holdD() }); add('dancer', 'f', kC, 'dance1', { hs: hsF(), hold: holdD() }); add('dancer', 'f', kG, 'dance3', { hs: hsF(), hold: holdD(), w: 0.9 });
      add('bar', 'f', kD, 'drink', { hs: hsF(), hold: pickR(R, ['glass', 'coupe']), acc: R() < 0.5 ? ['clutch'] : [] }); add('bar', 'f', kE, 'toast', { hs: hsF(), hold: 'flute' }); add('bar', 'f', kH, 'drink', { hs: hsF(), hold: pickR(R, ['flute', 'glass', 'coupe']), w: 0.8 });
      add('booth', 'f', kF, 'sitBooth', { hs: hsF(), hold: pickR(R, ['flute', 'coupe']), seat: true });
      // (his: a pair, one more on the floor; at the bar a drink, or his forearms on the counter; sitting back in a booth)
      const mk = CLUB_KITS_M.slice(), takeM = () => mk.splice(Math.floor(R() * mk.length) % mk.length, 1)[0] || pickR(R, CLUB_KITS_M);
      const g1 = add('dancer', 'm', takeM(), 'dance1', { hs: hsM(), fh: fhM(), hold: R() < 0.5 ? 'glass' : null, w: 1.2 }); const g2 = add('dancer', 'm', g1.kit, 'dance2', { hs: g1.hs, fh: g1.fh, hold: g1.hold, w: 0, pair: true }); g1.alt = g2;
      add('dancer', 'm', takeM(), 'dance3', { hs: hsM(), fh: fhM() });
      add('bar', 'm', takeM(), 'drink', { hs: hsM(), fh: fhM(), hold: 'glass' }); add('bar', 'm', takeM(), 'lean', { hs: hsM(), fh: fhM(), hold: 'glass', lean: true });
      add('booth', 'm', takeM(), 'sitBooth', { hs: hsM(), fh: fhM(), hold: 'glass', seat: true });
      // (the house: a bottle-service server, a go-go dancer, security, the house photographer)
      add('server', 'f', 'bodycon', 'drink', { hs: pickR(R, ['highpony', 'ponytail', 'long', 'waves']), hold: 'bottle', staff: 1 });
      // (the go-go dancers: their own pair of poses, so their arms go up and come down with the music)
      const pf = add('performer', 'f', pickR(R, ['haltermicro', 'bandeauset']), 'dance1', { hs: pickR(R, ['long', 'waves', 'highpony', 'blowout']), staff: 1 });
      pf.alt = add('performer', 'f', pf.kit, 'dance2', { hs: pf.hs, staff: 1, w: 0, pair: true });
      add('security', 'm', 'pantsuit', 'cross', { hs: pickR(R, ['buzz', 'short']), fh: pickR(R, [null, 'beard', 'stubble']), staff: 1 });
      add('photographer', 'm', 'bomber', 'photo', { hs: hsM(), fh: fhM(), prop: 'photo', staff: 1 });
      for (const t of T) if (t.fig === 'f') t.jewel = earF();
    } else {
      // (the team's own: its staff in the team's polo, a team jacket; the mechanics, caps on, coming in late; partners
      // and guests in what they wore to the track that evening; the hospitality's own staff)
      add('staff', 'm', 'polo', 'talk', { hs: hsM(), fh: fhM(), w: 1.2 }); add('staff', 'm', 'polo', 'drink', { hs: hsM(), fh: fhM(), hold: 'glass', cap: R() < 0.3 });
      add('staff', 'm', 'jacket', 'drink', { hs: hsM(), fh: fhM(), hold: 'flute' }); add('staff', 'f', 'casual', 'drink', { hs: hsF(), hold: 'glass' });
      add('mechanic', 'm', 'polo', 'cheer', { hs: hsM(), fh: fhM(), cap: true, w: 0.8 }); add('mechanic', 'm', 'polo', 'drink', { hs: hsM(), fh: fhM(), cap: true, hold: 'glass' });
      const gk = ['dress', 'jumpsuit', 'wrap', 'coord', 'slip', 'bardot', 'sequin', 'oneshoulder'], g1 = pickR(R, gk);
      add('bar', 'f', g1, 'drink', { hs: hsF(), hold: pickR(R, ['glass', 'flute']), acc: ['clutch'] }); add('bar', 'f', pickR(R, gk.filter((k) => k !== g1)), 'toast', { hs: hsF(), hold: 'flute' });
      add('bar', 'm', pickR(R, ['blazer', 'knitpolo', 'silkshirt']), 'drink', { hs: hsM(), fh: fhM(), hold: 'glass' }); add('bar', 'm', pickR(R, ['casual', 'teeblazer', 'sweater']), 'talk', { hs: hsM(), fh: fhM() });
      add('server', 'm', 'silkshirt', 'drink', { hs: 'short', fh: null, hold: 'bottle', staff: 1 });
      add('photographer', 'm', 'polo', 'photo', { hs: hsM(), fh: fhM(), prop: 'photo', staff: 1 });
      // (a sofa or a chair, where the room has them: a guest of either sitting back, a drink in the hand)
      add('booth', 'f', pickR(R, gk), 'sitBooth', { hs: hsF(), hold: 'flute', seat: true }); add('booth', 'm', 'casual', 'sitBooth', { hs: hsM(), fh: fhM(), hold: 'glass', seat: true });
      for (const t of T) if (t.fig === 'f') t.jewel = earF();
    }
    // (each its makePerson spec; a woman's build her own - slim or not - a man's average or athletic)
    for (const t of T) {
      const fem = t.fig === 'f', seed = Math.floor(R() * 1e9);
      t.spec = { club: true, figure: fem ? 'f' : undefined, build: fem ? (R() < 0.6 ? 'slim' : 'average') : R() < 0.5 ? 'average' : 'athletic', kit: t.kit, pose: t.pose, hs: t.hs, fh: fem ? null : t.fh || null, cap: !!t.cap, hold: t.hold || undefined, prop: t.prop || undefined, acc: fem ? ['earrings', ...(t.acc || [])] : t.acc?.length ? t.acc : undefined, jewel: t.jewel, seed, q: 0.45, detail: 0.25 };
    }
    // (a pair's poses the same person: one seed, one build)
    for (const t of T) if (t.alt) Object.assign(t.alt.spec, { seed: t.spec.seed, build: t.spec.build, jewel: t.spec.jewel, acc: t.spec.acc, fh: t.spec.fh, hold: t.spec.hold });
    return T;
  }
  _farSpec(t, ht) {
    const K = KIT[t.kit] || {}, hem = K.hem ? HEM_Y[K.hem] : 0;
    return { club: true, far: true, figure: t.fig === 'f' ? 'f' : undefined, kit: 'club', pose: t.pose, cap: !!t.cap, prop: t.prop === 'photo' ? 'photo' : undefined, skirt: t.pose === 'sitBooth' ? 0 : hem, skirtPart: K.sep ? 'accent' : undefined, arms: K.arms || 'long', mid: K.mid ? 'skin' : undefined, hair: t.fig === 'f' ? (SHORT_F.has(t.hs) ? 'short' : 'long') : undefined, ht };
  }

  /**
   * The next party's templates baked ahead (see the contract): kind 'club' | 'team'; o the constructor's options (a
   * subclass's own too: PoolCrowd's swim, its day); pools as build's (seed, women) -> () => boolean: each call bakes one
   * template not baked yet (0.1-0.4 s), false once there is none left
   */
  static prewarm(kind = 'club', o = {}, pools = {}) {
    const c = new this(o), k = kind === 'team' ? 'team' : 'club';
    const set = pools.seed != null ? String(pools.seed) : 'party:' + k + ':' + (((NIGHTS[k] ?? -1) + 1) % SETS);
    const specs = [];
    try { for (const t of c._plan({ ...pools, kind: k }, rng(hashS(set)))) { specs.push(t.spec); if (!STAFF.has(t.role) && !t.seat) specs.push({ ...t.spec, q: 0.32, detail: 0.2 }); } } catch (e) { console.warn('PartyCrowd: nothing to prewarm', e); }
    let i = 0;
    return () => { while (i < specs.length && hasTemplate(specs[i])) i++; if (i >= specs.length) return false; try { templateOf(specs[i++]); } catch (e) { console.warn('PartyCrowd: a template could not be baked', e); } return true; };
  }

  /** the room's crowd: who stands where, which template each wears -> the bake steps (see the contract) */
  build(spots, pools = {}) {
    const kind = pools.kind === 'team' ? 'team' : 'club';
    // (the night's kits and hair: the caller's seed, else one of a few sets in turn - the next party wears another, and
    // from the fourth on nothing new is baked)
    const set = pools.seed != null ? String(pools.seed) : 'party:' + kind + ':' + (NIGHTS[kind] = ((NIGHTS[kind] ?? -1) + 1) % SETS);
    const R = rng(hashS(set)), Rp = rng(hashS(Math.random()));
    this.set = set;
    this.kind = kind; this.pools = pools;
    const T = this.tpl = this._plan({ ...pools, kind }, R);
    // ---- the people, one a spot (staff first, then the patrons by the hour their spot fills)
    const zoneRole = (z) => (z === 'floor' || z === 'dj' ? (kind === 'team' ? 'staff' : 'dancer') : z === 'bar' || z === 'quiet' ? 'bar' : z === 'vip' ? 'booth' : z === 'door' ? 'security' : z === 'podium' || z === 'stage' ? 'performer' : z === 'garage' ? 'mechanic' : z === 'tables' ? (kind === 'team' ? 'staff' : 'bar') : 'bar');
    // (a club's own 'staff': the door's in the house black of security, the bar's a server)
    const roleOf = (s) => { const r = s.role || zoneRole(s.zone); return r === 'staff' && kind === 'club' ? (s.zone === 'door' || s.zone === 'street' || s.zone === 'casino' ? 'security' : 'server') : r; };
    const list = (spots || []).filter((s) => s && Number.isFinite(+s.x) && Number.isFinite(+s.z)).map((s, i) => ({ s, i, role: roleOf(s), ord: (Number.isFinite(+s.from) ? +s.from : 0) + Rp() * 0.25 }));
    list.sort((a, b) => (STAFF.has(b.role) - STAFF.has(a.role)) || a.ord - b.ord);
    const women = pools.women ?? (kind === 'team' ? 0.3 : 0.55);
    const byRole = (role, fig) => T.filter((t) => t.role === role && t.fig === fig && t.w > 0);
    for (const { s, role: r0, ord } of list.slice(0, this.maxP || MAXP)) {   // (a subclass may hold more: the pool club's maxP)
      let role = r0, fig = role === 'security' || role === 'photographer' || role === 'mechanic' ? 'm' : role === 'performer' || role === 'promo' || role === 'server' ? (kind === 'team' && role === 'server' ? 'm' : 'f') : Rp() < women ? 'f' : 'm';
      // (a sofa's seat: a woman sitting back on it; a counter: a man's forearms on it, else a drink in his hand)
      let cand;
      if (s.seat) { cand = T.filter((t) => t.seat && t.fig === fig); if (!cand.length) cand = T.filter((t) => t.seat); if (cand.length) fig = cand[0].fig; }
      else if (role === 'promo') cand = T.filter((t) => t.role === 'bar' && t.fig === 'f');
      else if (role === 'booth') cand = T.filter((t) => t.role === 'bar' && t.fig === fig);
      else cand = byRole(role, fig).filter((t) => !t.lean || s.lean);
      if (!cand.length) cand = byRole(role, fig === 'f' ? 'm' : 'f'), fig = cand.length ? cand[0].fig : fig;
      if (!cand.length) cand = T.filter((t) => t.role === 'bar' && !t.lean && t.fig === fig);
      if (!cand.length) cand = T.filter((t) => !t.seat && !t.pair && t.w > 0);
      if (s.lean && fig === 'm' && cand.some((t) => t.lean) && Rp() < 0.7) cand = cand.filter((t) => t.lean);
      let tot = 0; for (const t of cand) tot += t.w; let u = Rp() * tot, t = cand[cand.length - 1]; for (const c of cand) { u -= c.w; if (u <= 0) { t = c; break; } }
      const yaw = s.look && Number.isFinite(+s.look.x) ? Math.atan2(-(s.look.z - s.z), s.look.x - s.x) : +(s.yaw ?? s.face ?? 0) || 0;
      const dancer = role === 'dancer' || role === 'performer', fem = t.fig === 'f';
      const p = {
        role, fig: t.fig, t: T.indexOf(t), alt: t.alt ? T.indexOf(t.alt) : -1, cur: 0, x: +s.x, z: +s.z, hx: +s.x, hz: +s.z, y: +s.y || 0, base: yaw, zone: s.zone || '', yaw: yaw + (dancer && !STILL.has(role) ? (Rp() - 0.5) * 0.9 : (Rp() - 0.5) * 0.3), want: 0, turnT: 4 + Rp() * 10,
        scale: fem ? 0.97 + Rp() * 0.07 : 0.96 + Rp() * 0.09, ord, staff: STAFF.has(role), on: false, wantOn: false, lod: 1, mesh: null, slot: -1, seat: !!s.seat,
        swap: t.alt ? role === 'performer' || Rp() < 0.55 : false, swapAt: 4 + Math.floor(Rp() * 12), cols: new Float32Array(18), misc: new Float32Array(4), flashT: 2 + Rp() * 6,
      };
      p.want = p.yaw;
      this._colours(p, t, pools, Rp);
      this._wardrobe?.(p, t, s, Rp);   // (a subclass's own: everything else this person can wear - p.can, the templates' indices)
      // (iMisc: x - the phase against the beat (most on it, some on the off-beat); y - how hard they dance; z - a nod;
      // w - how much the shoulders turn)
      const off = Rp() < 0.8 ? 0 : Math.PI;
      p.misc[0] = off + (Rp() - 0.5) * 0.5; p.misc[1] = role === 'performer' ? 1 : role === 'dancer' ? 0.7 + Rp() * 0.3 : role === 'security' ? 0 : p.seat ? 0.15 + Rp() * 0.1 : 0.1 + Rp() * 0.22;
      p.misc[2] = role === 'security' || role === 'photographer' ? 0 : role === 'dancer' || role === 'performer' ? 0.05 + Rp() * 0.05 : 0.02 + Rp() * 0.03; p.misc[3] = 0.3 + Rp() * 0.7;
      this.people.push(p);
    }
    // ---- the steps: each template near and mid, then its far one (as tall as the near one), two bakes a step - one
    // baked before costs nothing (no step of its own); a far body is a quarter of one
    const used = new Map(); for (const p of this.people) { used.set(p.t, (used.get(p.t) || 0) + 1); if (p.alt >= 0) used.set(p.alt, (used.get(p.alt) || 0) + 1); for (const i of p.can || []) if (i !== p.t && i !== p.alt) used.set(i, (used.get(i) || 0) + 1); }
    this.tpl.forEach((t, i) => { t.used = used.has(i); t.few = (used.get(i) || 0) <= 3 || !!t.rare; });   // (t.rare: a pose worn only now and then - no middle body of its own)
    const steps = []; let cur = [], cost = 0;
    const put = (f, c) => { cur.push(f); cost += c; if (cost >= 2) { const fs = cur; steps.push(() => { for (const g of fs) g(); }); cur = []; cost = 0; } };
    for (const t of T) {
      if (!t.used) continue;
      // (near: a crowd's best - q 0.45, ~5k triangles; mid: q 0.32, ~3.5k - fewer segments than that and a skirt's cloth
      // no longer covers the thigh beneath it; far: the tube body. A template worn by three or fewer - the house's
      // staff, a pair's few - wears its near body in the middle distance too: a bake saved for a few hundred triangles)
      t.specs = [t.spec, t.few ? null : { ...t.spec, q: 0.32, detail: 0.2 }, null]; t.geo = [null, null, null];
      put(() => { t.geo[0] = templateOf(t.specs[0]); }, hasTemplate(t.specs[0]) ? 0 : 1);
      if (t.specs[1]) put(() => { t.geo[1] = templateOf(t.specs[1]); }, hasTemplate(t.specs[1]) ? 0 : 1);
      put(() => { const a = t.geo[0]?.attributes.aux, ht = a ? Math.round(a.getW(0) / 0.04) * 0.04 : 1.46; t.specs[2] = this._farSpec(t, ht); t.geo[2] = templateOf(t.specs[2]); }, 0.25);
    }
    const last = cur;
    steps.push(() => { for (const f of last) f(); this._make(); });
    return steps;
  }
  /** each person's own colours, by what they wear */
  _colours(p, t, pools, R) {
    const c = new THREE.Color(), set = (k, v) => { c.set(v); p.cols[k * 3] = c.r; p.cols[k * 3 + 1] = c.g; p.cols[k * 3 + 2] = c.b; };
    const K = KIT[t.kit] || {}, fem = t.fig === 'f', role = p.role, team = pools.team || {}, brand = pools.brand || null;
    const skin = pickR(R, SKINS), bare = fem && !!K.hem;
    let top, legs, acc, hair = fem ? pickR(R, COL.hairF) : pickR(R, COL.hairM);
    if (role === 'server') { top = HOUSE; acc = HOUSE; legs = fem ? skin : HOUSE; }
    else if (role === 'security') { top = HOUSE; acc = HOUSE; legs = HOUSE; }
    else if (role === 'performer') { top = pickR(R, COL.perf); acc = R() < 0.5 ? top : pickR(R, COL.perf); legs = skin; }
    else if (role === 'promo' && brand) { top = brand.color || '#e0218a'; acc = brand.accent || '#ffffff'; legs = bare ? skin : HOUSE; }
    else if ((role === 'staff' || role === 'mechanic') && (t.kit === 'polo' || t.kit === 'jacket' || t.kit === 'casual')) { top = team.color || '#2b2e35'; acc = team.accent || '#ffffff'; legs = t.kit === 'casual' ? pickR(R, COL.denim) : '#24272d'; }
    else if (fem) {
      const TL = this.kind === 'team' ? COL.smart : COL.dress; top = farFromSkin(R, TL, skin, pickR(R, TL));
      acc = farFromSkin(R, COL.dress, skin, K.sep ? (R() < 0.6 ? '#0d0d10' : pickR(R, COL.dress)) : K.jk ? (R() < 0.5 ? top : pickR(R, COL.acc)) : pickR(R, COL.acc));
      legs = bare ? skin : K.tr === 'jeans' ? pickR(R, COL.denim) : K.tr === 'leather' ? '#0d0d10' : pickR(R, COL.trousers);
    } else {
      const TL = K.jk ? COL.mlegs.concat(['#3b2416', '#5a3d27', '#0d0d10']) : COL.shirt; top = farFromSkin(R, TL, skin, pickR(R, TL));
      acc = K.jk ? farFromSkin(R, COL.tee, skin, pickR(R, COL.tee)) : pickR(R, COL.acc); legs = pickR(R, COL.mlegs);
    }
    // (bare legs: her skin, now and then sheer black tights over it)
    if (fem && bare && role !== 'server' && R() < 0.12) { c.set(skin).lerp(new THREE.Color('#141414'), 0.55); legs = '#' + c.getHexString(); }
    set(0, skin); set(1, top); set(2, legs); set(3, hair); set(4, acc); set(5, (role === 'staff' || role === 'mechanic') && team.color ? team.color : top);
  }

  /** the meshes: one per template and detail, as many places as can wear it */
  _make() {
    if (this.gone) return;
    const cap = new Map();
    for (const p of this.people) { cap.set(p.t, (cap.get(p.t) || 0) + 1); if (p.alt >= 0) cap.set(p.alt, (cap.get(p.alt) || 0) + 1); for (const i of p.can || []) if (i !== p.t && i !== p.alt) cap.set(i, (cap.get(i) || 0) + 1); }
    this.recs = [];
    this.tpl.forEach((t, i) => {
      const n = cap.get(i) || 0; t.M = [null, null, null]; if (!n || !t.geo) return;
      for (let l = 0; l < 3; l++) {
        const src = t.geo[l]; if (!src) continue;
        src.userData.users = (src.userData.users || 0) + 1;
        // (the template's own arrays shared - never copied, never changed - each mesh its people's own)
        const g = new THREE.BufferGeometry(); for (const a in src.attributes) g.setAttribute(a, src.attributes[a]); if (src.index) g.setIndex(src.index);
        g.boundingSphere = src.boundingSphere?.clone() || null;
        for (const a of ATTR) g.setAttribute(a, new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3));
        g.setAttribute('iMisc', new THREE.InstancedBufferAttribute(new Float32Array(n * 4), 4));
        const mat = DOUBLE.has(t.kit) && l < 2 ? clubMaterial(this.patch, true) : this.mat;
        const mesh = new THREE.InstancedMesh(g, mat, n); mesh.count = 0; mesh.visible = false; mesh.name = `party-crowd:${t.role}:${t.kit}:${t.pose}:${['near', 'mid', 'far'][l]}`;
        mesh.userData[this.keepKey] = true; mesh.castShadow = false; mesh.receiveShadow = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.renderOrder = l - 3;
        const rec = { mesh, n: 0, src, tris: (src.index ? src.index.count : src.attributes.position.count) / 3, moved: false };
        t.M[l] = rec; this.recs.push(rec); this.group.add(mesh);
      }
    });
    // (the photographers' flashes: a point each)
    const nph = Math.max(1, this.people.filter((p) => p.role === 'photographer').length);
    const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nph * 3).fill(-100), 3));
    this.flash = new THREE.Points(fg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    this.flash.frustumCulled = false; this.flash.userData[this.keepKey] = true; this.flash.name = 'party-crowd:flash'; this.group.add(this.flash);
    for (let i = 0; i < nph; i++) this._fl.push({ x: 0, y: 0, z: 0 });
    // (stood for the first time: the share in the room it opens with, the camera where it first is - every mesh that
    // will be needed has people in it, so the material is compiled with the room)
    const P0 = this.pools.cam || this._mid();
    this._cam.set(+P0.x || 0, 1.6, +P0.z || 0);
    this._occ(this.pools.occ ?? 0.5); for (const p of this.people) { p.on = p.wantOn; p.lod = this._lodOf(p, -1); }
    this.mat.userData.u.uLift.value = this.night ? this.lift : this.lift * 0.4;
    this._repack(); this.ready = true;
  }
  _mid() { let x = 0, z = 0; for (const p of this.people) { x += p.x; z += p.z; } const n = Math.max(1, this.people.length); return { x: x / n, z: z / n }; }
  /** who should be in the room at this share: the staff always, the patrons in their spots' order */
  _occ(occ) {
    const pat = this.people.filter((p) => !p.staff), n = Math.round(Math.max(0, Math.min(1, occ)) * pat.length);
    let i = 0; for (const p of pat) { if (p.forced != null) p.wantOn = p.forced; else p.wantOn = i < n; i++; }
    for (const p of this.people) if (p.staff) p.wantOn = p.forced ?? true;
  }
  _lodOf(p, cur) {
    const d = Math.hypot(p.x - this._cam.x, p.z - this._cam.z);
    if (cur === 0) return d < NEAR + HYST ? 0 : d < MID + HYST ? 1 : 2;
    if (cur === 1) return d < NEAR - HYST ? 0 : d < MID + HYST ? 1 : 2;
    if (cur === 2) return d < NEAR - HYST ? 0 : d < MID - HYST ? 1 : 2;
    return d < NEAR ? 0 : d < MID ? 1 : 2;
  }
  /** the template a person wears now (a pair's other pose when their arms are up) */
  _tOf(p) { return this.tpl[p.cur && p.alt >= 0 ? p.alt : p.t]; }
  /** everyone in the room into the meshes for what they wear and how near they are - nearest first, each mesh's people in
   *  that order and the near meshes drawn before the rest (renderOrder): whoever stands behind someone is then mostly
   *  turned away by the depth test before it is shaded (a packed floor is all overlap) */
  _repack() {
    for (const r of this.recs) r.n = 0;
    const cx = this._cam.x, cz = this._cam.z, ord = this._ord || (this._ord = this.people.slice());
    for (const p of ord) p._d2 = (p.x - cx) * (p.x - cx) + (p.z - cz) * (p.z - cz);
    ord.sort((a, b) => a._d2 - b._d2);
    // (only the people in front of the lens: anyone more than 1.6 m off and over ~70 degrees from where it looks is not
    // drawn at all - the view's own half-width is ~48 degrees, the rest is margin for a turn before the next packing)
    const F = this.viewCull !== false && this._fw?.on ? this._fw : null; if (F) { F.px = F.x; F.pz = F.z; }
    // (out in a quiet zone - the terrace, the courtyard - the room inside is behind its walls: only that zone's people,
    // and anyone within 5 m of you, by the door)
    const Z = this._zo || null;
    for (const p of ord) {
      p.mesh = null; p.slot = -1; if (!p.on) continue;
      if (Z && p.zone !== Z && p._d2 > 25) continue;
      if (F && p._d2 > 2.56) { const d = Math.sqrt(p._d2); if ((p.x - cx) * F.x + (p.z - cz) * F.z < 0.34 * d) continue; }
      const t = this._tOf(p), rec = t?.M?.[p.lod] || t?.M?.[1] || t?.M?.[0] || t?.M?.[2]; if (!rec) continue;
      p.mesh = rec; p.slot = rec.n++; this._write(p, true);
    }
    for (const r of this.recs) {
      const m = r.mesh; m.count = r.n; m.visible = r.n > 0; if (!r.n) continue;
      m.instanceMatrix.needsUpdate = true; const g = m.geometry; for (const a of ATTR) g.attributes[a].needsUpdate = true; g.attributes.iMisc.needsUpdate = true;
      m.computeBoundingSphere(); if (m.boundingSphere) m.boundingSphere.radius += 1.2;   // (room for the sway, and for people stepping aside)
    }
    this._dirty = false;
  }
  /** a person's place into their mesh (all: their colours too) */
  _write(p, all = false) {
    const r = p.mesh; if (!r) return; const i = p.slot, m = r.mesh, { _M: M, _Q: Q, _P: P, _S: S, _Y: Y } = this;
    M.compose(P.set(p.x, p.y, p.z), Q.setFromAxisAngle(Y, p.yaw), S.setScalar(p.scale)); m.setMatrixAt(i, M); r.moved = true;
    if (!all) return;
    const g = m.geometry;
    for (let k = 0; k < 6; k++) { const A = g.attributes[ATTR[k]].array; A[i * 3] = p.cols[k * 3]; A[i * 3 + 1] = p.cols[k * 3 + 1]; A[i * 3 + 2] = p.cols[k * 3 + 2]; }
    g.attributes.iMisc.array.set(p.misc, i * 4);
  }

  // ---- every frame --------------------------------------------------------------------------------------------------------
  update(dt, cam, beat, occupancy = 1, fwd = null) {
    if (!this.ready || this.gone) return;
    dt = Math.min(0.1, Math.max(0, dt || 0));
    // (the beat: the music's own clock - a running count, or a phase that wraps - else our own at the tempo)
    if (beat == null || !Number.isFinite(beat)) this.B += dt * this.bpm / 60;
    else { if (this._bPrev != null && beat < this._bPrev - 0.5) this._bOff += Math.max(1, Math.round(this._bPrev - beat)); this._bPrev = beat; this.B = beat + this._bOff; }
    const U = this.mat.userData.u; U.uBeat.value = this.B; U.uEnergy.value = Math.max(0, Math.min(1, this.energy));
    const D = MATS.get((this.patch ? 'room' : 'own') + ':2'); if (D) { D.userData.u.uBeat.value = this.B; D.userData.u.uEnergy.value = U.uEnergy.value; D.userData.u.uLift.value = U.uLift.value; }
    if (cam) this._cam.set(+cam.x || 0, +cam.y || 1.6, +cam.z || 0);
    // (which way the lens looks: turned more than ~10 degrees since the last packing -> packed again for the new view)
    if ((this.zoneOnly || null) !== (this._zo || null)) { this._zo = this.zoneOnly || null; this._dirty = true; }   // (Hangout sets zoneOnly: see _repack)
    if (fwd && Number.isFinite(+fwd.x) && Number.isFinite(+fwd.z)) { const F = this._fw || (this._fw = { x: 1, z: 0, px: 0, pz: 0, on: true }); F.x = +fwd.x; F.z = +fwd.z; F.on = true; if (F.x * F.px + F.z * F.pz < 0.985) this._dirty = true; }
    // (who comes and goes, and how near everyone is: twice a second, or at once when the camera jumps)
    this._lodT -= dt;
    if (this._lodT <= 0 || this._cam.distanceToSquared(this._camL) > 1) {
      this._lodT = 0.5; this._camL.copy(this._cam);
      if (!this._camR || this._camR.distanceToSquared(this._cam) > 2.25) { (this._camR = this._camR || new THREE.Vector3()).copy(this._cam); this._dirty = true; }   // (nearest first again)
      this._occ(occupancy);
      for (const p of this.people) {
        // (out of sight - or, kept waiting half a minute while you watch, further off than 6 m among the others)
        if (p.wantOn !== p.on && !this.walkIn) { p.waitT = (p.waitT || 0) + 0.5; if (this._unseen(p, fwd) || (p.waitT > 30 && Math.hypot(p.hx - this._cam.x, p.hz - this._cam.z) > 6)) { p.on = p.wantOn; p.waitT = 0; this._dirty = true; if (p.on) { p.x = p.hx; p.z = p.hz; } } }
        const l = this._lodOf(p, p.lod); if (l !== p.lod) { p.lod = l; if (p.on) this._dirty = true; }
      }
    }
    // (arms up: on a bar's first beat some of the floor throw them up, or bring them down again - every 4-8 beats each)
    const bi = Math.floor(this.B);
    if (this._bInt < 0) for (const p of this.people) p.swapAt += bi;   // (the music already playing: each still on their own count from now)
    if (bi !== this._bInt) {
      this._bInt = bi;
      if (bi % 2 === 0) for (const p of this.people) if (p.swap && p.on && bi >= p.swapAt) { p.cur ^= 1; p.swapAt = bi + (p.cur ? 4 : 4 + 2 * Math.floor(Math.random() * 3)); this._dirty = true; }
    }
    if (this._dirty) this._repack();
    // (turning a little now and then; drifting back to their places once out of your way)
    this._yawT -= dt; const tick = this._yawT <= 0; if (tick) this._yawT = 0.1;
    for (const p of this.people) {
      if (!p.on) continue;
      let moved = false;
      if (tick && !STILL.has(p.role) && !p.seat) {
        p.turnT -= 0.1; if (p.turnT <= 0) { p.turnT = 5 + Math.random() * 10; p.want = p.base + (p.role === 'dancer' ? (Math.random() - 0.5) * 1.2 : (Math.random() - 0.5) * 0.5); }
      }
      let dy = p.want - p.yaw; if (Math.abs(dy) > 0.002) { p.yaw += Math.sign(dy) * Math.min(Math.abs(dy), dt * 0.8); moved = true; }
      const dx = p.hx - p.x, dz = p.hz - p.z; if (dx * dx + dz * dz > 1e-6 && !p._pushed) { const d = Math.hypot(dx, dz), v = Math.min(d, dt * 0.35); p.x += dx / d * v; p.z += dz / d * v; moved = true; }
      p._pushed = false;
      if (moved) this._write(p);
    }
    for (const r of this.recs) if (r.moved) { r.moved = false; r.mesh.instanceMatrix.needsUpdate = true; }
    this._flashes(dt);
  }
  /** out of the camera's sight (behind it, or far off): somebody can arrive or leave there unseen */
  _unseen(p, fwd) {
    const dx = p.hx - this._cam.x, dz = p.hz - this._cam.z, d = Math.hypot(dx, dz);
    if (d > 11) return true;
    if (fwd && Number.isFinite(+fwd.x)) { const f = Math.hypot(fwd.x, fwd.z) || 1; return (dx * fwd.x + dz * fwd.z) / f < -0.15 * d; }
    return d > 9;
  }
  _flashes(dt) {
    if (!this.flash) return;
    const a = this.flash.geometry.attributes.position; let k = 0, any = false; this._flT -= dt;
    for (const p of this.people) {
      if (p.role !== 'photographer') continue;
      let on = false;
      if (p.on) {
        p.flashT -= dt;
        // (a shot every few seconds, never more than two a second across the room)
        if (p.flashT <= 0 && this._flT <= 0) { p.flashT = 1.6 + Math.random() * 4.5; p.flashOn = 0.07; this._flT = 0.5; const c = Math.cos(p.yaw), s = Math.sin(p.yaw), F = this._fl[this._flN % this._fl.length]; F.x = p.x + c * 0.5 * p.scale; F.y = p.y + 1.52 * p.scale; F.z = p.z - s * 0.5 * p.scale; if (this._flN < this._fl.length) this._flN++; }
        if (p.flashOn > 0) { p.flashOn -= dt; on = true; }
      }
      if (on) { const c = Math.cos(p.yaw), s = Math.sin(p.yaw); a.setXYZ(k, p.x + c * 0.52 * p.scale, p.y + 1.52 * p.scale, p.z - s * 0.52 * p.scale); any = true; } else a.setXYZ(k, 0, -100, 0);
      k++;
    }
    if (k) a.needsUpdate = true; this.flash.visible = any;
  }

  // ---- for the others -----------------------------------------------------------------------------------------------------
  push(x, z, r = 0.45) {
    let hard = 0; if (!this.ready) return 0;
    for (const p of this.people) {
      if (!p.on || p.seat || STILL.has(p.role)) continue;
      const dx = p.x - x, dz = p.z - z, d = Math.hypot(dx, dz); if (d >= r) continue;
      const k = Math.min(0.06, (r - d) * 0.35), ux = d > 1e-3 ? dx / d : Math.random() - 0.5, uz = d > 1e-3 ? dz / d : Math.random() - 0.5;
      p.x += ux * k; p.z += uz * k; p._pushed = true; this._write(p);
      hard = Math.max(hard, (r - d) / r);
    }
    for (const r2 of this.recs) if (r2.moved) { r2.moved = false; r2.mesh.instanceMatrix.needsUpdate = true; }
    return hard;
  }
  near(x, z, r) { let n = 0; for (const p of this.people) if (p.on && (p.x - x) ** 2 + (p.z - z) ** 2 < r * r) n++; return n; }
  flashes() { this._flOut.length = 0; for (let i = 0; i < this._flN; i++) this._flOut.push(this._fl[i]); this._flN = 0; return this._flOut; }
  arrive(role) { for (const p of this.people) if (p.role === role) { p.forced = true; p.wantOn = true; if (!p.on) { p.on = true; p.x = p.hx; p.z = p.hz; this._dirty = true; } } }
  leave(role) { for (const p of this.people) if (p.role === role) { p.forced = false; p.wantOn = false; if (p.on) { p.on = false; this._dirty = true; } } }
  snap() { for (const p of this.people) if (p.on !== p.wantOn) { p.on = p.wantOn; p.x = p.hx; p.z = p.hz; this._dirty = true; } if (this._dirty && this.ready) this._repack(); }
  stats() {
    let active = 0, calls = 0, tris = 0; for (const p of this.people) if (p.on) active++;
    for (const r of this.recs) if (r.mesh.visible && r.n) { calls++; tris += r.n * r.tris; }
    return { people: this.people.length, active, meshes: this.recs.length, calls, tris: Math.round(tris), templates: this.tpl.filter((t) => t.used).length, baked: this.recs.length };
  }
  dispose() {
    if (this.gone) return; this.gone = true; this.ready = false;
    this.group.parent?.remove(this.group);
    for (const r of this.recs) { r.mesh.dispose?.(); r.mesh.geometry.dispose(); if (r.src.userData.users > 0) r.src.userData.users--; }
    if (this.flash) { this.flash.geometry.dispose(); this.flash.material.dispose(); this.flash = null; }
    this.recs = []; this.people = []; this.group.clear();
  }
}

// ---- a principal's dance: bodies of their own in other poses (Brawl's Kit, for a party) -------------------------------------
export class HeroFrames {
  constructor(person, opts = {}, o = {}) {
    this.P = person; this.opts = opts || {}; this.poses = (o.poses || ['dance1', 'dance2', 'dance3']).slice(); this.prep = o.prep || null;
    this.fr = {}; this.cur = null; this.gone = false;
    this.body0 = person?.group?.children?.[0] || null; this.neck0 = person?.head ? person.head.position.clone() : null; this.bow0 = person?.head ? person.head.rotation.z : (person?.bow || 0); this.bow = this.bow0;
  }
  steps() { return this.poses.map((pose) => () => this.build(pose)); }
  /** one pose's body: built headless in the person's own clothes, their materials on it, hidden under their group */
  build(pose) {
    if (this.gone || !this.P?.group || pose in this.fr) return this.fr[pose] || null;
    let F = null;
    try { F = makePerson({ ...this.opts, pose, jitter: 0, headless: true }); } catch (e) { console.warn(`PartyCrowd: no '${pose}' body`, e); }
    if (!F?.group) { this.fr[pose] = null; return null; }
    if (F.head && F.head !== this.P.head) { F.head.parent?.remove(F.head); F.head.traverse((m) => { if (m.isMesh) m.geometry.dispose(); }); }
    // (the person's own materials - their colours, the room's light, shaders compiled - so the body is theirs)
    const own = new Map(); for (const k in F.mats || {}) if (this.P.mats?.[k]) own.set(F.mats[k], this.P.mats[k]);
    F.group.traverse((m) => { if (m.isMesh && own.has(m.material)) m.material = own.get(m.material); });
    for (const M of own.keys()) M.dispose();
    F._own = own;
    F.group.visible = false; F.group.position.set(0, 0, 0); F.group.rotation.set(0, 0, 0); F.group.scale.set(1, 1, 1); this.P.group.add(F.group);
    try { this.prep?.(F.group); } catch (e) { /* (the caller's touches: optional) */ }
    this.fr[pose] = F; return F;
  }
  /** which body shows: a frame by pose, or their own (null) - the head goes with it, onto that body's neck -> the frame or null */
  show(pose) {
    if (this.gone) return null;
    const F = (pose && this.fr[pose]) || null; if (F === this.cur) return F;
    for (const k in this.fr) if (this.fr[k]) this.fr[k].group.visible = this.fr[k] === F;
    if (this.body0) this.body0.visible = !F;
    const h = this.P.head, b = F ? (F.group.children.find((c) => c.isGroup) || F.group) : this.body0;
    if (h && b) { if (h.parent !== b) b.add(h); h.position.copy(F ? (F.neck || this.neck0) : this.neck0); }
    this.bow = F && typeof F.bow === 'number' ? F.bow : this.bow0; if (h) h.rotation.z = this.bow;
    this.cur = F; return F;
  }
  dispose() {
    if (this.gone) return; this.show(null); this.gone = true;
    for (const k in this.fr) { const F = this.fr[k]; if (!F) continue; this.P.group?.remove(F.group);
      // (their materials are the person's: only the frame's own geometry and any material of its own given back)
      const theirs = new Set(Object.values(this.P.mats || {}));
      F.group.traverse((m) => { if (m.isMesh) { m.geometry.dispose(); if (m.material && !theirs.has(m.material)) m.material.dispose?.(); } });
    }
    this.fr = {};
  }
}
