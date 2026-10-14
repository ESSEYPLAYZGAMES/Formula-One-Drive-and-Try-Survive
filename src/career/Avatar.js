// Your own driver's look ("Play as Yourself"): the data behind the new-career creator and the hub's Look tab - pure
// JSON and plain functions, nothing three.js, so the career layer stays pure. A look lives on the custom driver's own
// record in the save (c.drivers[c.playerId].look); every field may be null - "the game's own pick" (from the name,
// as before there were looks), so an old save with no look draws exactly as it always did. At run time the hub turns
// it into the shape world/People.js takes (personOpts) and registers it by the driver's name (People.setDriverLook),
// and the helmet design by name too (HelmetDesigns.setHelmetDesign): every scene that builds "you" by name - the hub,
// the grid, the podium, the interviews, the news, the hangouts, the cockpit - then draws you as you chose.

export const LOOK_V = 1;
/** skin tones, light to deep (People's own six among them) */
export const SKIN_TONES = ['#f6dcc6', '#f1d2b6', '#ecc7a6', '#e6bb95', '#e3b994', '#d9a77c', '#cf9a72', '#b98260', '#a8714b', '#8d5a3b', '#7a4e33', '#563522'];
/** hair colours [hex, name] */
export const HAIR_COLOURS = [['#141414', 'Jet black'], ['#17110d', 'Black'], ['#2b1d14', 'Dark brown'], ['#4a3222', 'Brown'], ['#6b4a2b', 'Chestnut'], ['#8a6a44', 'Light brown'], ['#a88458', 'Dark blond'], ['#c9a46a', 'Blond'], ['#7a3b22', 'Auburn'], ['#9b9b9b', 'Grey']];
/** a man's hair styles People draws [id, label] (long and bob left out: their locks fall onto the suit) */
export const HAIR_STYLES_M = [['short', 'Short'], ['buzz', 'Buzz cut'], ['side', 'Side parting'], ['quiff', 'Quiff'], ['swept', 'Swept back'], ['curly', 'Curly'], ['wavy', 'Wavy'], ['locs', 'Locs'], ['mullet', 'Mullet']];
/** styles with no parting to speak of */
export const NO_PART = ['buzz', 'curly', 'locs'];
export const BEARDS = [['none', 'Clean-shaven'], ['stubble', 'Stubble'], ['mustache', 'Moustache'], ['beard', 'Beard']];
/** eye colours [hex, name] */
export const EYES = [['#2e1c12', 'Dark brown'], ['#4a3020', 'Brown'], ['#6a5a32', 'Hazel'], ['#4e6a3c', 'Green'], ['#4a6f96', 'Blue'], ['#6c8094', 'Grey']];
/** the face's measures: len / wid (the face longer, wider), jaw (how much it narrows to the chin), chin, cheek(bones), brow, nose (1 = average) */
export const FACE_KEYS = ['len', 'wid', 'jaw', 'chin', 'cheek', 'brow', 'nose'];
export const FACE_PRESETS = {
  classic: { len: 1, wid: 1, jaw: 0.21, chin: 1, cheek: 1, brow: 1, nose: 1 },
  chiselled: { len: 1.03, wid: 0.99, jaw: 0.19, chin: 1.15, cheek: 1.3, brow: 1.15, nose: 1.04 },
  square: { len: 0.99, wid: 1.04, jaw: 0.16, chin: 1.2, cheek: 1.05, brow: 1.1, nose: 1 },
  long: { len: 1.07, wid: 0.96, jaw: 0.24, chin: 1, cheek: 0.95, brow: 1, nose: 1.1 },
  round: { len: 0.97, wid: 1.04, jaw: 0.19, chin: 0.85, cheek: 0.85, brow: 0.9, nose: 0.92 },
  youthful: { len: 0.98, wid: 0.99, jaw: 0.25, chin: 0.9, cheek: 0.9, brow: 0.85, nose: 0.9 },
};
/** [id, name, what it is] for the preset cards */
export const PRESET_INFO = [['classic', 'Classic', 'Balanced, even'], ['chiselled', 'Chiselled', 'High cheekbones'], ['square', 'Square', 'A strong jaw'], ['long', 'Long', 'Narrow, a longer nose'], ['round', 'Round', 'Soft, fuller cheeks'], ['youthful', 'Youthful', 'Fine features']];
/** the sliders' limits: kept close to the real grid's faces (len .97-1.08, wid .95-1.04, jaw .16-.25) - a person, never a caricature */
export const FACE_RANGE = { len: [0.94, 1.1], wid: [0.94, 1.07], jaw: [0.14, 0.28], chin: [0.7, 1.35], cheek: [0.7, 1.4], brow: [0.7, 1.35], nose: [0.82, 1.22] };
/** [key, label, low end, high end] for the fine-tune sliders */
export const FACE_SLIDERS = [['len', 'Length', 'Short', 'Long'], ['wid', 'Width', 'Narrow', 'Wide'], ['jaw', 'Jawline', 'Strong', 'Tapered'], ['chin', 'Chin', 'Soft', 'Strong'], ['cheek', 'Cheekbones', 'Soft', 'High'], ['brow', 'Brow', 'Soft', 'Heavy'], ['nose', 'Nose', 'Small', 'Large']];
export const HELMET_STYLES = [['solid', 'Solid'], ['split', 'Split'], ['stripes', 'Pinstripes'], ['crown', 'Crown'], ['wedges', 'Wedges'], ['gradient', 'Gradient'], ['tricolor', 'Tricolour'], ['swirl', 'Swirl']];
// (HelmetDesigns' other styles are kept if a look ever holds one, but not offered)
const HELMET_ANY = new Set([...HELMET_STYLES.map((s) => s[0]), 'marble', 'squiggle']);
export const VISORS = [['#20262e', 'Smoke'], ['#c9a227', 'Gold'], ['#2d7fd6', 'Blue'], ['#d4552a', 'Fire'], ['#6a4a8a', 'Violet']];
/** quick race-suit pairs [primary, secondary, name] */
export const SUIT_PAIRS = [['#0b1f3a', '#e8c547', 'Navy & gold'], ['#c8102e', '#ffffff', 'Red & white'], ['#111317', '#e10600', 'Black & red'], ['#f4f4f4', '#0a58ca', 'White & blue'], ['#0f5f3a', '#d9d9d9', 'Racing green'], ['#ff8000', '#1a1a1a', 'Papaya']];

const HEX = /^#[0-9a-f]{6}$/i;
const STYLE_IDS = HAIR_STYLES_M.map((s) => s[0]), BEARD_IDS = BEARDS.map((b) => b[0]);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hex = (v) => (typeof v === 'string' && HEX.test(v) ? v.toLowerCase() : null);
const r3 = (v) => Math.round(v * 1000) / 1000;
const num = (v, [a, b]) => (typeof v === 'number' && isFinite(v) ? r3(clamp(v, a, b)) : null);
/** a string's own number (FNV-1a) */
export const hashStr = (s) => { let h = 2166136261; s = String(s ?? ''); for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
// (what People draws where a look leaves a choice to the game: its person's own number - from the look's seed, else the
// name - as People works it out, and the face and parting it gives)
const peopleSeed = (key) => { let h = 11; for (const ch of String(key ?? '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
/** the key People's numbers come from for this look and name */
export const seedKey = (look, name) => (look?.seed != null ? look.seed : name || '');
/** the face People draws with no measures set (key: seedKey) */
export function autoFace(key) {
  const sd = peopleSeed(key), vary = (k) => (((sd >>> k) % 100) / 100 - 0.5);
  return { len: 1, wid: 1, jaw: r3(0.22 + vary(3) * 0.1), chin: 1, cheek: 1, brow: 1, nose: r3(1 + vary(5) * 0.35) };
}
/** the parting People draws with none set: 1 left, -1 right */
export const autoPart = (key) => ((peopleSeed(key) >>> 6) & 1 ? 1 : -1);

/** a look with everything the game's own pick */
export const blankLook = () => ({ v: LOOK_V });
/** a helmet in a team's colours: its base the accent, the team's colour on it */
export const defaultHelmet = (color = '#00d4ff', color2 = '#ffffff') => ({ style: 'solid', c: [hex(color2) || '#ffffff', hex(color) || '#00d4ff', '#ffffff', '#111111'], visor: '#20262e' });
/** the preset a face is (every measure within .005 of it) -> its id, 'custom', or null (no measures set: the game's own) */
export function presetOf(face) {
  if (!face || FACE_KEYS.every((k) => face[k] == null)) return null;
  for (const [id, P] of Object.entries(FACE_PRESETS)) if (FACE_KEYS.every((k) => face[k] != null && Math.abs(face[k] - P[k]) < 0.005)) return id;
  return 'custom';
}
/** a look cleaned (hex colours, known choices, measures in range, unknown keys dropped) -> a new object, or null */
export function normLook(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const h = raw.hair && typeof raw.hair === 'object' ? raw.hair : {}, f = raw.face && typeof raw.face === 'object' ? raw.face : {}, s = raw.suit && typeof raw.suit === 'object' ? raw.suit : {}, hm = raw.helmet;
  const face = {}; for (const k of FACE_KEYS) face[k] = num(f[k], FACE_RANGE[k]);
  face.preset = presetOf(face);
  const part = h.part === 1 || h.part === -1 ? h.part : null;
  const seed = typeof raw.seed === 'number' && isFinite(raw.seed) ? Math.abs(Math.round(raw.seed)) % 4294967296 : null;
  const primary = hex(s.primary), secondary = hex(s.secondary);
  let helmet = null;
  if (hm && typeof hm === 'object' && !Array.isArray(hm)) {
    const c = Array.isArray(hm.c) ? hm.c : [], d = ['#ffffff', '#00d4ff', '#ffffff', '#111111'];
    helmet = { style: HELMET_ANY.has(hm.style) ? hm.style : 'solid', c: d.map((x, i) => hex(c[i]) || x), visor: hex(hm.visor) || '#20262e' };
  }
  return {
    v: LOOK_V, skin: hex(raw.skin), hair: { style: STYLE_IDS.includes(h.style) ? h.style : null, color: hex(h.color), part },
    beard: BEARD_IDS.includes(raw.beard) ? raw.beard : null, face, eyes: hex(raw.eyes), seed,
    suit: { own: !!s.own && !!primary, primary, secondary }, helmet,
  };
}
/** a look's own stamp (a short hash of it, cleaned): what the caches key on */
export const stampOf = (look) => hashStr(JSON.stringify(normLook(look) || blankLook())).toString(36);
/**
 * A look made explicit from what the game would have drawn (base: People.lookOf(name) -> { skin, hair, style }): the
 * creator starts from "you as the game would have drawn you". o: { color, color2 (the team's), seed }
 */
export function lookFrom(base, o = {}) {
  const sd = (o.seed ?? hashStr(o.name || '')) >>> 0, B = base || {}, st = B.style || {}, ids = Object.keys(FACE_PRESETS);
  return normLook({
    skin: B.skin, hair: { style: STYLE_IDS.includes(st.hs) ? st.hs : 'short', color: B.hair, part: (sd >>> 6) & 1 ? 1 : -1 },
    beard: st.fh || 'none', face: { ...FACE_PRESETS[ids[(sd >>> 3) % ids.length]] }, eyes: null, seed: sd,
    suit: { own: false, primary: o.color || null, secondary: o.color2 || null }, helmet: defaultHelmet(o.color, o.color2),
  });
}
/**
 * The look in the shape world/People.js's registry takes: { skin, hair, style: { hs, fh, part, iris, len, wid, jaw,
 * chin, cheek, brow, nose }, seed, suit: { primary, secondary } | null, helmet: { style, c, visor } | null, stamp }.
 * An unset choice is undefined (the game's own pick); a clean shave is fh: null.
 */
export function personOpts(look) {
  const L = normLook(look) || normLook(blankLook()), u = (v) => (v == null ? undefined : v);
  const style = { hs: u(L.hair.style), fh: L.beard === 'none' ? null : u(L.beard), part: u(L.hair.part), iris: u(L.eyes) };
  for (const k of FACE_KEYS) style[k] = u(L.face[k]);
  return {
    skin: u(L.skin), hair: u(L.hair.color), style, seed: u(L.seed),
    suit: L.suit.own ? { primary: L.suit.primary, secondary: L.suit.secondary || '#ffffff' } : null,
    helmet: L.helmet ? { style: L.helmet.style, c: [...L.helmet.c], visor: L.helmet.visor } : null, stamp: stampOf(L),
    // (the figure's own stamp - the look without its helmet, which no figure wears: a helmet's paint changed never rebuilds you)
    pstamp: stampOf({ ...L, helmet: null }),
  };
}
/** a plausible face for a fresh start (rng: () => 0..1; keep: the look whose suit and helmet stay) -> a look */
export function randomLook(rng = Math.random, keep = null) {
  const pick = (a) => a[Math.floor(rng() * a.length) % a.length];
  const wpick = (L) => { let t = rng() * L.reduce((s, [, w]) => s + w, 0); for (const [v, w] of L) { t -= w; if (t <= 0) return v; } return L[L.length - 1][0]; };
  const si = Math.floor(rng() * SKIN_TONES.length) % SKIN_TONES.length, deep = si >= 7;
  // (darker skin mostly with dark hair; grey now and then; blond and auburn mostly on fair skin)
  const hc = deep ? wpick([['#141414', 4], ['#17110d', 4], ['#2b1d14', 2], ['#4a3222', 0.6], ['#9b9b9b', 0.2]]) : wpick(HAIR_COLOURS.map(([h], i) => [h, [1.2, 1.2, 1.6, 1.6, 1.2, 1, 0.8, si < 4 ? 0.8 : 0.3, si < 4 ? 0.5 : 0.15, 0.15][i]]));
  const hs = wpick(STYLE_IDS.map((s) => [s, s === 'locs' ? (deep ? 1.2 : 0.15) : s === 'curly' ? (deep ? 1.4 : 0.7) : s === 'mullet' ? 0.35 : 1]));
  const beard = wpick([['none', 4.5], ['stubble', 3], ['mustache', 0.6], ['beard', 1.8]]);
  const P = FACE_PRESETS[pick(Object.keys(FACE_PRESETS))], face = {};
  // (half the time a preset as it is, else nudged a little: still a face the grid could hold)
  const nudge = rng() < 0.5;
  for (const k of FACE_KEYS) { const [a, b] = FACE_RANGE[k]; face[k] = nudge ? clamp(P[k] + (rng() - 0.5) * (b - a) * 0.22, a, b) : P[k]; }
  const eyes = deep ? pick(['#2e1c12', '#2e1c12', '#4a3020']) : wpick(EYES.map(([h], i) => [h, [2, 2, 1, 0.8, 1.2, 0.6][i]]));
  const K = normLook(keep) || {};
  return normLook({ skin: SKIN_TONES[si], hair: { style: hs, color: hc, part: rng() < 0.5 ? 1 : -1 }, beard, face, eyes, seed: Math.floor(rng() * 4294967296), suit: K.suit || { own: false }, helmet: K.helmet || null });
}
