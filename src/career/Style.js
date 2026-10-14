// Her look, as you and she plan it: the partner suite's saved state and the rules that turn it into how she is drawn.
// Plain JSON on the career (c.celebs.style = { v, by: { <celebId>: rec } }), so it saves and loads with everything
// else; this file imports nothing (Celebs.js and the hub's page both use it - no cycle) and never touches three.js.
//
// A record (rec) - every field optional, a missing one means "her own" (what her wardrobe and her make-up bag pick):
//   hair:  { color, root ('none' | hex: darker roots), ends ('none' | hex: lighter lengths), melt (how far the root shade
//            reaches, m), strands (lock-to-lock contrast), shine } - physical, so it is hers on every occasion
//   face:  { day: MK, night: MK } - the two make-up moments (race day; a night race, a gala, a dinner)
//   occ:   { grid, night, evening, dinner, club, pool } - per occasion: { hs, tendrils, fringe, pin, wear }
// MK is People.js's MakeupSpec (world/People.js makePerson style.makeup): { look, liner: { thickness, wing, angle, color },
// lashes: { volume }, shadow: { intensity, color, under }, lips: { fill, liner, ombre, gloss }, sculpt: { contour,
// highlight, blush, blushColor, dew }, brows }. wear: { kit, color, accent, legs ('bare' | hex), fabric, shoes,
// shoeFinish, shoe (heels, sandals, knee or thigh boots), metal, earrings, choker, chain, cuffs, clutch, bag (a mini bag),
// clutchColor, clutchMetal } -> makePerson's kit, color, accent, legs, fabric, shoes, shoe, shoeFinish, acc and jewel. Styling only: no body, no necklines, no hems - the cuts are
// the curated kits, within the game's red-carpet limits.

export const STYLE_V = 1;
const HEX = /^#[0-9a-f]{6}$/i;

// ---- occasions ---------------------------------------------------------------------------------------------------------
export const SLOTS = ['grid', 'night', 'evening', 'dinner', 'club', 'pool'];
export const SLOT_NAME = { grid: 'Race day', night: 'Night race', evening: 'Gala', dinner: 'Dinner', club: 'Club', pool: 'Pool' };
export const SLOT_TIP = { grid: 'Race day: on the grid, by day', night: 'Night race: the grid under the lights', evening: 'Gala: rooftop evenings, galas', dinner: 'Dinner: the restaurant', club: 'Club: club nights on the roof, after-parties', pool: 'Pool: dayclubs, beach clubs, night swims' };
/** where each slot is worn (the footer's line) */
export const SLOT_WHERE = { grid: 'on the grid at day races', night: 'on the grid at night races', evening: 'at rooftop evenings and galas', dinner: 'at dinner', club: 'at club nights and after-parties', pool: 'at pool clubs, dayclubs and night swims' };
/** the make-up moment of a slot: race day by day, everything after dark at night (the pool's: the day's, light) */
export const MOMENT = { grid: 'day', night: 'night', evening: 'night', dinner: 'night', club: 'night', pool: 'day' };
/** the slot an occasion wears (a wet grid keeps her coat: none; a casual, sporty or home evening: none) -> slot | null */
export function slotOf(occ, night = false, wet = false) {
  if (occ === 'grid' || !occ) return wet ? null : night ? 'night' : 'grid';
  return occ === 'evening' || occ === 'dinner' || occ === 'club' || occ === 'pool' ? occ : null;
}
/** a slot's celebLook occasion and night flag (the preview's) */
export const SLOT_OCC = { grid: ['grid', false], night: ['grid', true], evening: ['evening', false], dinner: ['dinner', false], club: ['club', true], pool: ['pool', false] };

// ---- hair ---------------------------------------------------------------------------------------------------------------
/** People's styles, as the suite names them, in tile order */
export const HAIR_STYLES = [
  ['blowout', 'Blowout waves'], ['waves', 'Mermaid waves'], ['long', 'Long & sleek'], ['curlyLong', 'Long curls'],
  ['highpony', 'Snatched pony'], ['ponytail', 'Low ponytail'], ['topknot', 'Sleek topknot'], ['bun', 'Chignon'],
  ['curlybun', 'Curly bun'], ['messybun', 'Messy bun'], ['bob', 'Bob'], ['pixie', 'Pixie'],
];
export const HS_NAME = Object.fromEntries(HAIR_STYLES);
const HS_KEYS = HAIR_STYLES.map(([k]) => k);
/** styles that leave the ears (and so earrings) in sight */
export const UPDOS = new Set(['highpony', 'ponytail', 'topknot', 'bun', 'curlybun', 'messybun', 'pixie']);
/** can hair cut as baseHs be worn as hs? A pixie stays a pixie and a bob a bob; long hair wears any long style or updo */
export function hairFits(baseHs, hs) {
  if (!hs || !HS_NAME[hs]) return false;
  if (baseHs === 'pixie' || baseHs === 'bob') return hs === baseHs;
  return hs !== 'pixie' && hs !== 'bob';
}

// ---- the wardrobe: the curated cuts per occasion ------------------------------------------------------------------------
/**
 * KIT_INFO[kit]: name, note (a few words), tr (trousers: 'match' - in her colour, 'dark' - dark ones), sec (what the
 * second colour is), fab (the fabrics it can be made in), up (a one-piece whose neck the suite's choker suits)
 */
const ALLF = ['satin', 'velvet', 'crepe', 'sequin', 'leather'];
export const KIT_INFO = {
  blazerdress: { name: 'Deep-V blazer dress', note: 'Belted, lapels in a deep V', sec: 'Belt', fab: ['crepe', 'satin', 'velvet', 'leather'] },
  wrapgown: { name: 'Slit wrap gown', note: 'Asymmetric, high slit', sec: 'Sash', fab: ['satin', 'velvet', 'crepe', 'sequin'] },
  plunge: { name: 'Plunge mini', note: 'Halter V, open back', sec: 'Trims', fab: ALLF },
  galaslip: { name: 'Gala slip', note: 'Bias-cut, to the floor', sec: 'Trims', fab: ['satin', 'velvet', 'crepe', 'sequin'] },
  slitgown: { name: 'Slit gown', note: 'Camisole, slit to the thigh', sec: 'Trims', fab: ['satin', 'velvet', 'crepe', 'sequin'] },
  halter: { name: 'Halter gown', note: 'Backless, slit', sec: 'Trims', fab: ['satin', 'velvet', 'crepe', 'sequin'] },
  gown: { name: 'Ball gown', note: 'Full skirt, V neck', sec: 'Belt', fab: ['velvet', 'satin', 'crepe', 'sequin'] },
  oneshoulder: { name: 'One-shoulder', note: 'Cut on the diagonal', sec: 'Trims', fab: ['satin', 'crepe', 'velvet', 'sequin'] },
  sequin: { name: 'Sequin mini', note: 'Camisole straps', sec: 'Trims', fab: ['sequin', 'satin', 'velvet'] },
  corset: { name: 'Corset dress', note: 'Boned bodice, midi', sec: 'Trims', fab: ['satin', 'velvet', 'crepe', 'leather'] },
  bardot: { name: 'Off-shoulder', note: 'Bardot neckline', sec: 'Trims', fab: ['crepe', 'satin', 'velvet'] },
  slip: { name: 'Slip dress', note: 'Midi, thin straps', sec: 'Trims', fab: ['satin', 'velvet', 'crepe'] },
  bodycon: { name: 'Bodycon mini', note: 'Sweetheart neckline', sec: 'Trims', fab: ['crepe', 'satin', 'velvet', 'leather', 'sequin'] },
  cropset: { name: 'Crop set', note: 'Cropped top, midi skirt', sec: 'Trims', fab: ['crepe', 'velvet', 'satin'] },
  wrap: { name: 'Wrap dress', note: 'Long sleeves, tie belt', sec: 'Trims', fab: ['crepe', 'satin', 'velvet'] },
  dress: { name: 'Day dress', note: 'Knee length, belted', sec: 'Belt', fab: ['crepe', 'satin', 'velvet'] },
  knit: { name: 'Knit dress', note: 'Ribbed, mock neck', sec: 'Trims', fab: [] },
  jumpsuit: { name: 'Jumpsuit', note: 'Wide legs, belted', sec: 'Belt', fab: ['crepe', 'satin', 'velvet', 'sequin'], tr: 'match' },
  pantsuit: { name: 'Trouser suit', note: 'Blazer, straight trousers', sec: 'Shirt', fab: ['crepe', 'velvet', 'satin'], tr: 'match' },
  blazer: { name: 'Blazer & trousers', note: 'A shell beneath', sec: 'Top beneath', fab: ['crepe', 'velvet', 'satin', 'leather'], tr: 'dark' },
  coord: { name: 'Co-ord', note: 'Square neck, wide trousers', sec: 'Trims', fab: ['crepe', 'satin'], tr: 'match' },
  trench: { name: 'Trench coat', note: 'Belted, over skinny jeans', sec: 'Lining', fab: ['crepe', 'leather', 'satin'] },
  leather: { name: 'Leather jacket', note: 'Over skinny trousers', sec: 'Top beneath', fab: ['leather', 'crepe', 'velvet'], tr: 'dark' },
  bomber: { name: 'Bomber', note: 'Over jeans', sec: 'Top beneath', fab: ['satin', 'crepe', 'leather', 'velvet'], tr: 'dark' },
  // (a club's - People's CLUB_KITS: cut-outs, open backs, micro hems, crop tops, sheer over opaque, separates; grp: the
  // cut page's group - a dress, or a top and its bottom)
  cutoutmini: { name: 'Cut-out mini', note: 'Waist cut-outs, rings', sec: 'Trims', fab: ['crepe', 'satin', 'velvet', 'leather', 'metallic'], grp: 'cut' },
  sidecut: { name: 'Ruched side cut', note: 'One shoulder, slit', sec: 'Trims', fab: ['satin', 'crepe', 'velvet', 'metallic'], grp: 'cut' },
  keyhole: { name: 'Under-bust cut', note: 'Long sleeves, mid-thigh', sec: 'Trims', fab: ['crepe', 'satin', 'velvet'], grp: 'cut' },
  backless: { name: 'Open-back mini', note: 'Bare to the waist, bow', sec: 'Trims', fab: ['satin', 'crepe', 'velvet', 'sequin'], grp: 'cut' },
  diamond: { name: 'Halter cut-out midi', note: 'Laced diamond, slit', sec: 'Trims', fab: ['crepe', 'satin', 'leather', 'metallic'], grp: 'cut' },
  ribcut: { name: 'Rib cut-out midi', note: 'Long sleeves, slit', sec: 'Trims', fab: ['crepe', 'satin', 'velvet'], grp: 'cut' },
  hipcut: { name: 'Hip cut-out micro', note: 'Strappy, hip cut-outs', sec: 'Trims', fab: ['crepe', 'satin', 'leather'], grp: 'cut' },
  haltermicro: { name: 'Halter micro', note: 'Backless micro-mini', sec: 'Trims', fab: ['sequin', 'metallic', 'satin'], grp: 'dress' },
  meshdress: { name: 'Mesh over slip', note: 'Fitted mesh, micro slip', sec: 'Trims', fab: [], fabNote: 'Sheer mesh over its own slip: no other fabric', grp: 'dress' },
  // (lace - world/Lace.js: laid on its lining (sec: the lining; fab: the lining's own cloth), sheer at the sleeves and the
  // yoke; the club's grouped on a page of their own)
  lacemini: { name: 'Lace mini', note: 'Lined, sheer sleeves', sec: 'Lining', fab: ['satin', 'crepe', 'velvet'], grp: 'lace' },
  lacebustier: { name: 'Lace bustier mini', note: 'Boned, scalloped hem', sec: 'Lining', fab: ['satin', 'crepe', 'velvet'], grp: 'lace' },
  lacecorset: { name: 'Lace corset', note: 'Leather trousers', sec: 'Lining', fab: ['satin', 'crepe', 'velvet'], tr: 'dark', grp: 'lace' },
  lacecorsetwide: { name: 'Guipure corset', note: 'Wide trousers', sec: 'Lining', fab: ['satin', 'crepe', 'velvet'], tr: 'match', grp: 'lace' },
  lacebody: { name: 'Lace bodysuit', note: 'Open blazer', sec: 'Lace', fab: ['crepe', 'satin', 'velvet', 'leather'], tr: 'match', grp: 'lace' },
  laceset: { name: 'Lace crop set', note: 'Sheer sleeves, mini', sec: 'Lining', fab: ['satin', 'crepe', 'velvet'], grp: 'lace' },
  lacesleeve: { name: 'Lace-sleeve mini', note: 'Sheer yoke, crepe', sec: 'Trims', fab: ['crepe', 'satin', 'velvet'], grp: 'lace' },
  slipmini: { name: 'Plunge slip', note: 'Satin mini, low back', sec: 'Trims', fab: ['satin', 'velvet', 'sequin', 'metallic'], grp: 'dress' },
  camiskirt: { name: 'Cami & skirt', note: 'Cowl cami, leather mini', sec: 'Skirt', fab: ['satin', 'velvet', 'sequin'], grp: 'set' },
  corsettop: { name: 'Corset & trousers', note: 'Wide trousers', sec: 'Trims', fab: ['satin', 'velvet', 'leather', 'crepe'], tr: 'match', grp: 'set' },
  corsetleather: { name: 'Corset & leather', note: 'Leather trousers', sec: 'Trims', fab: ['satin', 'velvet', 'crepe', 'sequin'], tr: 'dark', grp: 'set' },
  bandeauset: { name: 'Bandeau set', note: 'Ruched bandeau, micro', sec: 'Trims', fab: ['crepe', 'satin', 'velvet', 'leather', 'sequin'], grp: 'set' },
  twistset: { name: 'Twist bandeau set', note: 'Twist front, slit midi', sec: 'Trims', fab: ['satin', 'crepe', 'velvet', 'sequin'], grp: 'set' },
  tieset: { name: 'Tie-front set', note: 'Sweetheart crop, mini', sec: 'Trims', fab: ['crepe', 'satin', 'velvet'], grp: 'set' },
  onecrop: { name: 'One-shoulder crop', note: 'Low-rise jeans', sec: 'Trims', fab: ['crepe', 'satin', 'velvet'], tr: 'denim', grp: 'set' },
  lowrise: { name: 'Crop & low rise', note: 'Wide low-rise trousers', sec: 'Trims', fab: ['crepe', 'satin'], tr: 'match', grp: 'set' },
  cropjeans: { name: 'Bandeau & jeans', note: 'Low-rise jeans', sec: 'Trims', fab: ['satin', 'velvet', 'leather', 'sequin'], tr: 'denim', grp: 'set' },
  blazerbra: { name: 'Blazer & bralette', note: 'Open, sharp shoulders', sec: 'Bralette', fab: ['crepe', 'satin', 'velvet', 'leather'], grp: 'set' },
  blazerbtn: { name: 'Buttoned blazer', note: 'One button, bralette', sec: 'Bralette', fab: ['crepe', 'satin', 'velvet', 'leather'], grp: 'set' },
  croppants: { name: 'Bardot crop set', note: 'Off-shoulder, wide trousers', sec: 'Trims', fab: ['crepe', 'satin', 'velvet'], tr: 'match', grp: 'set' },
  // (lace for a gala, a dinner, a race day: a corded lace gown slit high, a lined lace midi, a satin slip trimmed in
  // Chantilly, a silk cami trimmed the same over jeans, a white broderie sundress)
  lacegown: { name: 'Lace gown', note: 'Sheer yoke, high slit', sec: 'Lining', fab: ['satin', 'crepe', 'velvet'], grp: 'lace' },
  lacemidi: { name: 'Lace midi', note: 'Lined in a contrast', sec: 'Lining', fab: ['crepe', 'satin', 'velvet'], grp: 'lace' },
  laceslip: { name: 'Lace-trim slip', note: 'Chantilly, deep lace hem', sec: 'Lace', fab: ['satin', 'velvet', 'crepe'], grp: 'lace' },
  lacecami: { name: 'Lace-trim cami', note: 'Silk, over jeans', sec: 'Lace', fab: [], fabNote: 'Washed silk, its lace trim', tr: 'denim', grp: 'set' },
  eyelet: { name: 'Eyelet sundress', note: 'White broderie, scalloped', sec: 'Trims', fab: [], fabNote: 'Its own cotton broderie', grp: 'dress' },
  // (the pool's - People's SWIM_KITS: bikinis, monokinis and one-pieces, and what goes over them; each in its own swim
  // cloth - matt or shiny lycra, a rib, crinkle, foil - so no fabric to choose; grp: the cut page's group)
  tribikini: { name: 'String triangle', note: 'Tie sides, cheeky', sec: 'Trims', fab: [], fabNote: 'Its own swim lycra', grp: 'bikini' },
  bandeaubikini: { name: 'Ruched bandeau', note: 'Strapless, full back', sec: 'Trims', fab: [], fabNote: 'Its own crinkle swim cloth', grp: 'bikini' },
  balconette: { name: 'Balconette', note: 'Underwired, high leg', sec: 'Trims', fab: [], fabNote: 'Its own shiny lycra', grp: 'bikini' },
  sportbikini: { name: 'Sporty scoop', note: 'Ribbed, high leg', sec: 'Trims', fab: [], fabNote: 'Its own swim rib', grp: 'bikini' },
  twistbikini: { name: 'Twist bandeau', note: 'Ring sides, Brazilian', sec: 'Trims', fab: [], fabNote: 'Its own metallic foil', grp: 'bikini' },
  stringbikini: { name: 'Thong bikini', note: 'String triangle, thong', sec: 'Trims', fab: [], fabNote: 'Its own shiny lycra', grp: 'bikini' },
  brazilbikini: { name: 'Brazilian balconette', note: 'Brazilian back', sec: 'Trims', fab: [], fabNote: 'Its own swim rib', grp: 'bikini' },
  monofront: { name: 'Front cut-out', note: 'Square neck monokini', sec: 'Trims', fab: [], fabNote: 'Its own swim lycra', grp: 'one' },
  monoside: { name: 'Side cut-outs', note: 'Waist cut either side', sec: 'Trims', fab: [], fabNote: 'Its own swim rib', grp: 'one' },
  monocross: { name: 'Laced monokini', note: 'Laced front cut-out', sec: 'Trims', fab: [], fabNote: 'Its own shiny lycra', grp: 'one' },
  monoring: { name: 'Ring monokini', note: 'Gold ring, high cut', sec: 'Trims', fab: [], fabNote: 'Its own shiny lycra', grp: 'one' },
  monoplunge: { name: 'Plunge monokini', note: 'Open sides and back', sec: 'Trims', fab: [], fabNote: 'Its own crinkle swim cloth', grp: 'one' },
  highcut: { name: 'High-cut one-piece', note: 'Scoop neck, high leg', sec: 'Trims', fab: [], fabNote: 'Its own swim lycra', grp: 'one' },
  scoopback: { name: 'Scoop back', note: 'Square neck, open back', sec: 'Trims', fab: [], fabNote: 'Its own swim rib', grp: 'one' },
  plungesuit: { name: 'Plunge one-piece', note: 'Deep V, low back', sec: 'Trims', fab: [], fabNote: 'Its own shiny lycra', grp: 'one' },
  beltedsuit: { name: 'Belted one-piece', note: 'Balconette, gold buckle', sec: 'Belt', fab: [], fabNote: 'Its own swim lycra', grp: 'one' },
  pareo: { name: 'Pareo', note: 'Sheer sarong, triangle', sec: 'Bikini beneath', fab: [], fabNote: 'Sheer chiffon over swimwear', grp: 'cover' },
  crochetmini: { name: 'Crochet mini', note: 'Over a bandeau', sec: 'Bikini beneath', fab: [], fabNote: 'Open crochet over swimwear', grp: 'cover' },
  meshcover: { name: 'Mesh mini', note: 'Over a high-cut suit', sec: 'Suit beneath', fab: [], fabNote: 'Fine mesh over swimwear', grp: 'cover' },
  kaftan: { name: 'Kaftan', note: 'Sheer, to the floor', sec: 'Suit beneath', fab: [], fabNote: 'Sheer chiffon over swimwear', grp: 'cover' },
  openshirt: { name: 'Open linen shirt', note: 'Over a balconette', sec: 'Bikini beneath', fab: [], fabNote: 'Crumpled linen over swimwear', grp: 'cover' },
  lacecover: { name: 'Lace beach dress', note: 'Guipure, over a bandeau', sec: 'Bikini beneath', fab: [], fabNote: 'Guipure lace over swimwear', grp: 'cover' },
};
/** each slot's cuts (the four signature silhouettes first wherever they fit) */
export const KITS = {
  // (a race day's: the dresses, suits and coats, then - for a hot one, Miami, Las Vegas by day - the crops and co-ords: GRID_GROUPS)
  grid: ['blazerdress', 'wrap', 'dress', 'jumpsuit', 'pantsuit', 'blazer', 'trench', 'coord', 'leather', 'bomber', 'knit', 'eyelet', 'cropset', 'croppants', 'tieset', 'twistset', 'lowrise', 'onecrop', 'cropjeans', 'bandeauset', 'lacecami'],
  night: ['blazerdress', 'plunge', 'galaslip', 'slip', 'bodycon', 'corset', 'bardot', 'sequin', 'jumpsuit', 'pantsuit', 'lacemidi'],
  evening: ['blazerdress', 'wrapgown', 'plunge', 'galaslip', 'slitgown', 'halter', 'gown', 'oneshoulder', 'sequin', 'corset', 'bardot', 'lacegown', 'lacemidi', 'laceslip'],
  dinner: ['blazerdress', 'plunge', 'galaslip', 'slip', 'bodycon', 'corset', 'oneshoulder', 'wrap', 'cropset', 'bardot', 'laceslip', 'lacecami'],
  // (a club night's: the dresses, then the tops and their bottoms, then the lace - the cut page shows one group at a time: CLUB_GROUPS)
  club: ['cutoutmini', 'sidecut', 'keyhole', 'backless', 'diamond', 'ribcut', 'hipcut', 'haltermicro', 'meshdress', 'slipmini', 'bodycon', 'sequin', 'camiskirt', 'corsettop', 'corsetleather', 'bandeauset', 'twistset', 'tieset', 'onecrop', 'lowrise', 'cropjeans', 'blazerbra', 'blazerbtn', 'croppants', 'lacemini', 'lacebustier', 'lacecorset', 'lacecorsetwide', 'lacebody', 'laceset', 'lacesleeve'],
  // (the pool's: bikinis, then monokinis and one-pieces, then what goes over them - POOL_GROUPS)
  pool: ['tribikini', 'bandeaubikini', 'balconette', 'sportbikini', 'twistbikini', 'stringbikini', 'brazilbikini', 'monofront', 'monoside', 'monocross', 'monoring', 'monoplunge', 'highcut', 'scoopback', 'plungesuit', 'beltedsuit', 'pareo', 'crochetmini', 'meshcover', 'kaftan', 'openshirt', 'lacecover'],
};
/** the club's cuts, grouped (KIT_INFO grp; none: a dress) - [group, its name]: no group more than its two rows of tiles */
export const CLUB_GROUPS = [['dress', 'Dresses'], ['cut', 'Cut-outs'], ['set', 'Tops & sets'], ['lace', 'Lace']];
/** the pool's, grouped the same way */
export const POOL_GROUPS = [['bikini', 'Bikinis'], ['one', 'One-pieces'], ['cover', 'Cover-ups']];
/** a gala's: the gowns and dresses, then the lace */
export const EVENING_GROUPS = [['dress', 'Gowns & dresses'], ['lace', 'Lace']];
/** a race day's: the dresses, suits and coats, then the crop tops, bandeaus and co-ords of a hot one */
export const GRID_GROUPS = [['day', 'Dresses & suits'], ['crop', 'Crops & co-ords']];
const GRID_CROP = new Set(['cropset', 'croppants', 'tieset', 'twistset', 'lowrise', 'onecrop', 'cropjeans', 'lacecami', 'bandeauset']);
/** the slots whose cut page shows one group at a time -> their groups */
export const GROUPS = { club: CLUB_GROUPS, pool: POOL_GROUPS, evening: EVENING_GROUPS, grid: GRID_GROUPS };
/** the shoes a pool look can swap to (People's SHOE_KINDS): slides, strappy sandals, platform sandals */
export const POOL_SHOES = [['slide', 'Slides'], ['sandal', 'Sandals'], ['platform', 'Platforms']];
/** a cut's group on a slot's cut page (occ: the slot - a race day's its own two) */
export const kitGroup = (k, occ) => (occ === 'grid' ? (GRID_CROP.has(k) ? 'crop' : 'day') : KIT_INFO[k]?.grp || (KIT_INFO[k]?.tr || k === 'cropset' ? 'set' : 'dress'));
export const FABRICS = [['satin', 'Liquid satin'], ['velvet', 'Velvet'], ['crepe', 'Structured crepe'], ['sequin', 'Sequin'], ['leather', 'Leather'], ['metallic', 'Metallic']];
/** the shoes a look can swap to (People's SHOE_KINDS, hers): heels, strappy sandals, boots to the knee or over it */
export const SHOE_TYPES = [['heel', 'Heels'], ['sandal', 'Sandals'], ['kneeboot', 'Knee boots'], ['thighboot', 'Thigh boots']];
export const FABRIC_NAME = Object.fromEntries(FABRICS);
export const METALS = [['gold', 'Polished gold', '#d9ab4f'], ['silver', 'Bright silver', '#d5d8de'], ['rose', 'Rose gold', '#e0a08c']];
export const METAL_NAME = Object.fromEntries(METALS.map(([k, n]) => [k, n]));
export const SHOE_FINISHES = [['patent', 'Patent'], ['matte', 'Matte'], ['satin', 'Satin'], ['suede', 'Suede'], ['metallic', 'Metallic']];
export const EARRINGS = [['none', 'None'], ['stud', 'Studs'], ['drop', 'Drops'], ['hoop', 'Hoops'], ['long', 'Long drops']];
export const CHOKERS = [['none', 'None'], ['metal', 'Metal'], ['ribbon', 'Ribbon']];

// ---- make-up --------------------------------------------------------------------------------------------------------------
/** People.js's make-up looks (LOOKS), as MakeupSpecs: the sliders' "her own" when a field is not set (angle null: auto) */
export const LOOK_PRESETS = {
  soft: { liner: { thickness: 0.4, wing: 2, angle: null, color: null }, lashes: { volume: 0.55 }, shadow: { intensity: 0.2, color: null, under: 0.12 }, lips: { fill: null, liner: null, ombre: 0.3, gloss: 0.4 }, sculpt: { contour: 0.3, highlight: 0.35, blush: 0.35, blushColor: '#d8675c', dew: 0.3 }, brows: 'soft' },
  clean: { liner: { thickness: 0.45, wing: 3, angle: null, color: null }, lashes: { volume: 0.8 }, shadow: { intensity: 0.15, color: '#b48770', under: 0.05 }, lips: { fill: null, liner: null, ombre: 0.35, gloss: 0.85 }, sculpt: { contour: 0.45, highlight: 0.8, blush: 0.75, blushColor: '#ee8a70', dew: 1 }, brows: 'brushed' },
  baddie: { liner: { thickness: 1, wing: 7.5, angle: null, color: null }, lashes: { volume: 1 }, shadow: { intensity: 0.75, color: '#5c3626', under: 0.45 }, lips: { fill: null, liner: null, ombre: 0.9, gloss: 0.8 }, sculpt: { contour: 1, highlight: 0.85, blush: 0.35, blushColor: '#c47a62', dew: 0.5 }, brows: 'sculpted' },
  siren: { liner: { thickness: 0.9, wing: 6, angle: null, color: null }, lashes: { volume: 1 }, shadow: { intensity: 0.95, color: '#3c2c30', under: 0.6 }, lips: { fill: '#b0122a', liner: null, ombre: 0.5, gloss: 1 }, sculpt: { contour: 0.75, highlight: 0.65, blush: 0.35, blushColor: '#c85a66', dew: 0.4 }, brows: 'sculpted' },
};
export const LOOK_NAMES = [['soft', 'Soft'], ['clean', 'Clean girl'], ['baddie', 'Snatched'], ['siren', 'Siren']];
/** the liner's angle when none is set (People's own rule: steeper the heavier the line), degrees */
export const autoAngle = (thickness) => Math.round(20.6 + 8 * thickness);
/** the liner's ink when none is set (People's: near-black for a heavy line, a soft brown-black otherwise) */
export const autoInk = (thickness) => (thickness >= 0.8 ? '#0d0908' : '#1f130e');
/** a makeup value (string, { look, lip } or a MakeupSpec) -> { look, lip? } plus its spec fields */
export const mkBase = (m) => (typeof m === 'string' ? { look: m } : m && typeof m === 'object' ? { ...m } : { look: 'soft' });
/** her own make-up (celebLook's) with your overrides over it: a different look drops her own lip colour -> a MakeupSpec */
export function mergeMakeup(base, ov) {
  const b = mkBase(base), out = { ...b };
  if (!ov) return out;
  if (ov.look && ov.look !== (b.look || 'soft')) { out.look = ov.look; delete out.lip; for (const k of ['liner', 'lashes', 'shadow', 'lips', 'sculpt', 'brows']) delete out[k]; }
  for (const k of ['liner', 'lashes', 'shadow', 'lips', 'sculpt']) if (ov[k]) out[k] = { ...(out[k] || {}), ...ov[k] };
  if (ov.brows) out.brows = ov.brows;
  // (a fill of your own replaces her own lip colour)
  if (ov.lips?.fill) delete out.lip;
  return out;
}
/** the full values the sliders show: the look's preset, her own lip, your overrides -> a complete MakeupSpec */
export function mkValues(m) {
  const b = mkBase(m), P = LOOK_PRESETS[b.look] || LOOK_PRESETS.soft, out = {};
  for (const k of ['liner', 'lashes', 'shadow', 'lips', 'sculpt']) out[k] = { ...P[k], ...(b[k] || {}) };
  out.brows = b.brows || P.brows; out.look = LOOK_PRESETS[b.look] ? b.look : 'soft';
  if (b.lip && !b.lips?.fill) out.lips.fill = b.lip;
  return out;
}

// ---- palettes -------------------------------------------------------------------------------------------------------------
/** People quantises make-up colours to 5 bits a channel: stored and shown as it will be painted */
export const qHex = (h) => { if (!HEX.test(String(h || ''))) return null; const n = parseInt(h.slice(1), 16), q = (v) => Math.min(255, Math.round(v / 8) * 8); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map((v) => q(v).toString(16).padStart(2, '0')).join(''); };
const qp = (L) => L.map(([h, n]) => [qHex(h), n]);
export const PAL = {
  garment: [['#111114', 'Black'], ['#f2ede3', 'Ivory'], ['#e8d3a9', 'Champagne'], ['#c9a24a', 'Gold'], ['#e8b4b8', 'Blush'], ['#d6336c', 'Fuchsia'], ['#b0122a', 'Red'], ['#6a1424', 'Wine'],
    ['#4a1f4f', 'Plum'], ['#26408b', 'Royal blue'], ['#1b2440', 'Navy'], ['#1d6f73', 'Teal'], ['#1f5e44', 'Emerald'], ['#8fa58a', 'Sage'], ['#b9bcc2', 'Silver'], ['#4a2c20', 'Chocolate']],
  ink: qp([['#0b0a0a', 'Jet black'], ['#24160f', 'Espresso'], ['#4a2b1c', 'Chocolate'], ['#3d1f33', 'Plum'], ['#1a2340', 'Navy'], ['#6b4a2a', 'Bronze']]),
  lid: qp([['#8c7366', 'Taupe'], ['#8a5a32', 'Bronze'], ['#3a3436', 'Charcoal smoke'], ['#5a3448', 'Plum'], ['#b07a6a', 'Rose gold'], ['#c9ab8a', 'Champagne'], ['#5e5a3a', 'Olive']]),
  lip: qp([['#b0122a', 'Classic red'], ['#b01c4c', 'Raspberry'], ['#6a2636', 'Berry'], ['#5a1422', 'Wine'], ['#a3302c', 'Brick'], ['#b4786a', 'Nude'], ['#c98a86', 'Pink nude'], ['#d8604a', 'Coral']]),
  lipLine: qp([['#6a3a30', 'Brown'], ['#5a1a2a', 'Berry'], ['#7a0e1c', 'Deep red'], ['#8a4a4a', 'Rose'], ['#8a5a48', 'Nude']]),
  blush: qp([['#ee8a70', 'Peach'], ['#d8675c', 'Rose'], ['#c85a66', 'Berry'], ['#c47a62', 'Bronze'], ['#e86a50', 'Coral']]),
  hair: [['#141414', 'Jet'], ['#2b1d14', 'Espresso'], ['#5a3420', 'Chestnut'], ['#8a3b1c', 'Copper'], ['#6e1f33', 'Burgundy'], ['#8a6a44', 'Caramel'], ['#c9a46a', 'Honey blonde'], ['#e0cfa8', 'Platinum']],
  root: [['#120d0a', 'Black-brown'], ['#2b1d14', 'Espresso'], ['#4a3222', 'Brown'], ['#2a1218', 'Deep plum']],
  ends: [['#a87a4a', 'Caramel'], ['#c9a46a', 'Honey'], ['#e3d4b0', 'Platinum'], ['#b8643a', 'Copper']],
  heel: [['#111114', 'Black'], ['#c9a088', 'Nude'], ['#c9a24a', 'Gold'], ['#b9bcc2', 'Silver'], ['#b0122a', 'Red'], ['#efe8dc', 'Ivory'], ['#5a1422', 'Wine'], ['#1b2440', 'Navy']],
  tights: [['#1a1a1c', 'Sheer black'], ['#c9a88e', 'Sheer nude']],
};

// ---- presets: starting points per tab (a preset fills its tab's fields; "Her own" clears them) -----------------------------
export const PRESETS = {
  face: [
    { id: 'cat', name: 'Sharp cat-eye', dots: ['#0b0a0a', '#b0122a', '#c47a62'], mk: { look: 'baddie', liner: { thickness: 1, wing: 9, angle: 28, color: '#080808' }, lashes: { volume: 1 }, shadow: { intensity: 0.45, color: '#3a3436', under: 0.2 }, lips: { fill: '#b0122a', ombre: 0.3, gloss: 0.9 }, sculpt: { contour: 0.85, highlight: 0.8, blush: 0.3 } } },
    { id: 'choc', name: 'Soft chocolate wing', short: 'Chocolate wing', dots: ['#4a2b1c', '#b4786a', '#ee8a70'], mk: { look: 'clean', liner: { thickness: 0.5, wing: 4.5, angle: 16, color: '#482818' }, lashes: { volume: 0.8 }, shadow: { intensity: 0.35, color: '#8a5a32', under: 0.15 }, lips: { fill: '#b4786a', liner: '#6a3a30', ombre: 0.55, gloss: 0.85 }, sculpt: { contour: 0.5, highlight: 0.75, blush: 0.6, blushColor: '#ee8a70', dew: 0.8 } } },
    { id: 'smoky', name: 'Smoky siren', dots: ['#3a3436', '#5a1422', '#c85a66'], mk: { look: 'siren', liner: { thickness: 0.9, wing: 6, color: '#080808' }, shadow: { intensity: 1, color: '#3a3436', under: 0.7 }, lips: { fill: '#5a1422', ombre: 0.4, gloss: 0.6 }, sculpt: { contour: 0.8 } } },
    { id: 'glow', name: 'Clean-girl glow', dots: ['#b48770', '#c98a86', '#ee8a70'], mk: { look: 'clean', sculpt: { highlight: 1, dew: 1, blush: 0.8 }, lips: { gloss: 1 } } },
    { id: 'baddie', name: 'Snatched baddie', dots: ['#5c3626', '#a5605a', '#c47a62'], mk: { look: 'baddie' } },
  ],
  hair: [
    { id: 'blow', name: 'Blowout waves', hs: 'blowout', tendrils: null },
    { id: 'pony', name: 'Snatched pony', hs: 'highpony', tendrils: 2, metal: 'gold' },
    { id: 'knot', name: 'Gala topknot', hs: 'topknot', tendrils: 0 },
    { id: 'curl', name: 'Curly bun', hs: 'curlybun', tendrils: null },
    { id: 'messy', name: 'Messy bun', hs: 'messybun', tendrils: 2 },
  ],
  // (per slot: complete looks - a cut, its colours, the fabric, the metal, the shoes and the bag)
  wear: {
    evening: [
      { id: 'emerald', name: 'Emerald satin gown', w: { kit: 'wrapgown', color: '#1f5e44', accent: '#1f5e44', fabric: 'satin', metal: 'gold', shoes: '#c9a24a', shoeFinish: 'metallic', earrings: 'drop', clutch: true, clutchColor: '#c9a24a', clutchMetal: 'gold' } },
      { id: 'velvet', name: 'Black velvet gown', w: { kit: 'gown', color: '#111114', accent: '#111114', fabric: 'velvet', metal: 'silver', shoes: '#111114', shoeFinish: 'patent', earrings: 'long', choker: 'none', clutch: true, clutchColor: '#b9bcc2', clutchMetal: 'silver' } },
      { id: 'ivory', name: 'Ivory blazer dress', w: { kit: 'blazerdress', color: '#f2ede3', accent: '#c9a24a', fabric: 'crepe', metal: 'rose', shoes: '#c9a088', shoeFinish: 'patent', earrings: 'hoop', clutch: true, clutchColor: '#f2ede3', clutchMetal: 'rose' } },
      { id: 'redmini', name: 'Red satin plunge', w: { kit: 'plunge', color: '#b0122a', accent: '#b0122a', fabric: 'satin', metal: 'gold', shoes: '#111114', shoeFinish: 'patent', earrings: 'drop', clutch: true, clutchColor: '#111114', clutchMetal: 'gold' } },
      { id: 'champ', name: 'Champagne gala slip', w: { kit: 'galaslip', color: '#e8d3a9', accent: '#e8d3a9', fabric: 'satin', metal: 'gold', shoes: '#c9a24a', shoeFinish: 'metallic', earrings: 'long', chain: true, clutch: true, clutchColor: '#c9a24a', clutchMetal: 'gold' } },
    ],
    night: [
      { id: 'blazer', name: 'Black blazer dress', w: { kit: 'blazerdress', color: '#111114', accent: '#c9a24a', fabric: 'crepe', metal: 'gold', shoes: '#111114', shoeFinish: 'patent', earrings: 'hoop' } },
      { id: 'redmini', name: 'Red satin plunge', w: { kit: 'plunge', color: '#b0122a', accent: '#b0122a', fabric: 'satin', metal: 'gold', shoes: '#111114', shoeFinish: 'patent', earrings: 'drop', clutch: true, clutchColor: '#111114' } },
      { id: 'champ', name: 'Champagne slip', w: { kit: 'galaslip', color: '#e8d3a9', accent: '#e8d3a9', fabric: 'satin', metal: 'gold', shoes: '#c9a24a', shoeFinish: 'metallic', chain: true } },
      { id: 'sequin', name: 'Silver sequins', w: { kit: 'sequin', color: '#b9bcc2', accent: '#b9bcc2', fabric: 'sequin', metal: 'silver', shoes: '#b9bcc2', shoeFinish: 'metallic', earrings: 'stud' } },
      { id: 'wine', name: 'Wine velvet slip', w: { kit: 'slip', color: '#6a1424', accent: '#6a1424', fabric: 'velvet', metal: 'rose', shoes: '#111114', shoeFinish: 'suede' } },
    ],
    dinner: [
      { id: 'ivory', name: 'Ivory blazer dress', w: { kit: 'blazerdress', color: '#f2ede3', accent: '#c9a24a', fabric: 'crepe', metal: 'rose', shoes: '#c9a088', shoeFinish: 'patent', earrings: 'hoop' } },
      { id: 'redmini', name: 'Red satin plunge', w: { kit: 'plunge', color: '#b0122a', accent: '#b0122a', fabric: 'satin', metal: 'gold', shoes: '#111114', shoeFinish: 'patent', earrings: 'drop', clutch: true, clutchColor: '#111114' } },
      { id: 'champ', name: 'Champagne slip', w: { kit: 'galaslip', color: '#e8d3a9', accent: '#e8d3a9', fabric: 'satin', metal: 'gold', shoes: '#c9a24a', shoeFinish: 'metallic', chain: true } },
      { id: 'emerald', name: 'Emerald corset', w: { kit: 'corset', color: '#1f5e44', accent: '#c9a24a', fabric: 'velvet', metal: 'gold', shoes: '#111114', shoeFinish: 'suede', earrings: 'drop' } },
      { id: 'navy', name: 'Navy one-shoulder', w: { kit: 'oneshoulder', color: '#1b2440', accent: '#b9bcc2', fabric: 'crepe', metal: 'silver', shoes: '#b9bcc2', shoeFinish: 'metallic', earrings: 'long' } },
    ],
    club: [
      { id: 'cutout', name: 'Black cut-out mini', w: { kit: 'cutoutmini', color: '#111114', accent: '#c9a24a', fabric: 'crepe', metal: 'gold', shoes: '#111114', shoe: 'sandal', shoeFinish: 'patent', earrings: 'hoop', bag: true, clutchColor: '#111114' } },
      { id: 'sequin', name: 'Gold sequin halter', w: { kit: 'haltermicro', color: '#c9a24a', accent: '#c9a24a', fabric: 'sequin', metal: 'gold', shoes: '#c9a24a', shoe: 'sandal', shoeFinish: 'metallic', earrings: 'hoop' } },
      { id: 'satin', name: 'Satin & leather', w: { kit: 'camiskirt', color: '#e8d3a9', accent: '#111114', fabric: 'satin', metal: 'gold', shoes: '#111114', shoe: 'heel', shoeFinish: 'patent', earrings: 'drop', bag: true, clutchColor: '#111114' } },
      { id: 'boots', name: 'Blazer & thigh boots', w: { kit: 'blazerbra', color: '#111114', accent: '#111114', fabric: 'crepe', metal: 'silver', shoes: '#111114', shoe: 'thighboot', shoeFinish: 'matte', earrings: 'stud' } },
      { id: 'mesh', name: 'Black mesh', w: { kit: 'meshdress', color: '#111114', accent: '#111114', metal: 'silver', shoes: '#111114', shoe: 'heel', shoeFinish: 'patent', earrings: 'long' } },
    ],
    pool: [
      { id: 'thong', name: 'Black thong bikini', w: { kit: 'stringbikini', color: '#111114', accent: '#c9a24a', metal: 'gold', shoes: '#111114', shoe: 'platform', earrings: 'hoop' } },
      { id: 'redtri', name: 'Red string triangle', w: { kit: 'tribikini', color: '#b0122a', accent: '#b0122a', metal: 'gold', shoes: '#c9a24a', shoe: 'sandal', earrings: 'hoop' } },
      { id: 'goldmono', name: 'Gold ring monokini', w: { kit: 'monoring', color: '#c9a24a', accent: '#c9a24a', metal: 'gold', shoes: '#c9a24a', shoe: 'platform', earrings: 'drop' } },
      { id: 'white', name: 'White high-cut', w: { kit: 'highcut', color: '#f2ede3', accent: '#c9a24a', metal: 'gold', shoes: '#f2ede3', shoe: 'slide', earrings: 'stud' } },
      { id: 'kaftan', name: 'Ivory kaftan', w: { kit: 'kaftan', color: '#f2ede3', accent: '#1d6f73', metal: 'gold', shoes: '#c9a088', shoe: 'slide', earrings: 'long' } },
    ],
    grid: [
      { id: 'trench', name: 'Camel trench', w: { kit: 'trench', color: '#b8925e', accent: '#efe6d6', fabric: 'crepe', metal: 'gold', shoes: '#111114', shoeFinish: 'matte' } },
      { id: 'suit', name: 'Black trouser suit', w: { kit: 'pantsuit', color: '#111114', accent: '#f2ede3', fabric: 'crepe', metal: 'silver', shoes: '#111114', shoeFinish: 'patent' } },
      { id: 'jump', name: 'Ivory jumpsuit', w: { kit: 'jumpsuit', color: '#f2ede3', accent: '#c9a24a', fabric: 'crepe', metal: 'gold', shoes: '#c9a088', shoeFinish: 'patent' } },
      { id: 'blazerd', name: 'Emerald blazer dress', w: { kit: 'blazerdress', color: '#1f5e44', accent: '#c9a24a', fabric: 'crepe', metal: 'gold', shoes: '#c9a088', shoeFinish: 'patent', earrings: 'hoop' } },
      // (a hot race day's: the crop and its wide low-rise trousers - five presets and her own fill the row)
      { id: 'crop', name: 'Ivory crop & trousers', w: { kit: 'lowrise', color: '#f2ede3', accent: '#c9a24a', fabric: 'crepe', metal: 'gold', shoes: '#c9a088', shoeFinish: 'patent', earrings: 'hoop' } },
    ],
  },
};

// ---- the schema: every stored value checked, clamped, quantised (styleEnsure is total: it never throws) ----------------------
const N =(a, b, q) => ({ t: 'n', a, b, q }), E = (...v) => ({ t: 'e', v }), HX = { t: 'hex' }, QX = { t: 'qhex' }, B = { t: 'b' };
const MK_SPEC = {
  look: E('soft', 'clean', 'baddie', 'siren'), brows: E('soft', 'brushed', 'sculpted'),
  liner: { thickness: N(0, 1, 0.05), wing: N(0, 10, 0.5), angle: N(6, 40, 2), color: QX },
  lashes: { volume: N(0, 1, 0.05) },
  shadow: { intensity: N(0, 1, 0.05), color: QX, under: N(0, 1, 0.05) },
  lips: { fill: QX, liner: QX, ombre: N(0, 1, 0.05), gloss: N(0, 1, 0.05) },
  sculpt: { contour: N(0, 1, 0.05), highlight: N(0, 1, 0.05), blush: N(0, 1, 0.05), blushColor: QX, dew: N(0, 1, 0.05) },
};
const ALL_KITS = Object.keys(KIT_INFO);
const WEAR_SPEC = {
  kit: E(...ALL_KITS), color: HX, accent: HX, legs: { t: 'legs' }, fabric: E(...FABRICS.map(([k]) => k)), shoes: HX, shoeFinish: E(...SHOE_FINISHES.map(([k]) => k)),
  metal: E('gold', 'silver', 'rose'), earrings: E(...EARRINGS.map(([k]) => k)), choker: E(...CHOKERS.map(([k]) => k)), chain: B, cuffs: N(0, 2, 1),
  clutch: B, clutchColor: HX, clutchMetal: E('gold', 'silver', 'rose'), shoe: E(...[...SHOE_TYPES, ...POOL_SHOES].map(([k]) => k)), bag: B,
};
const SLOT_SPEC = { hs: E(...HS_KEYS), tendrils: N(0, 2, 1), fringe: B, pin: B, wear: WEAR_SPEC };
const HAIR_SPEC = { color: HX, root: { t: 'hexn' }, ends: { t: 'hexn' }, melt: N(0.02, 0.2, 0.01), strands: N(0, 2, 0.1), shine: N(0, 1, 0.05) };
const REC_SPEC = { at: { season: N(0, 9999, 1), round: N(0, 99, 1) }, hair: HAIR_SPEC, face: { day: MK_SPEC, night: MK_SPEC }, occ: Object.fromEntries(SLOTS.map((s) => [s, SLOT_SPEC])) };
const r2 = (v) => Math.round(v * 100) / 100;
/** one value against its spec -> the clean value, or undefined (dropped) */
function clean1(v, sp) {
  switch (sp.t) {
    case 'n': { const x = typeof v === 'string' && v.trim() !== '' ? Number(v) : v; if (typeof x !== 'number' || !isFinite(x)) return undefined; return r2(Math.min(sp.b, Math.max(sp.a, Math.round(x / sp.q) * sp.q))); }
    case 'e': return sp.v.includes(v) ? v : undefined;
    case 'hex': return typeof v === 'string' && HEX.test(v) ? v.toLowerCase() : undefined;
    case 'qhex': return typeof v === 'string' && HEX.test(v) ? qHex(v) : undefined;
    case 'hexn': return v === 'none' ? 'none' : typeof v === 'string' && HEX.test(v) ? v.toLowerCase() : undefined;
    case 'legs': return v === 'bare' ? 'bare' : typeof v === 'string' && HEX.test(v) ? v.toLowerCase() : undefined;
    case 'b': return typeof v === 'boolean' ? v : undefined;
    default: return undefined;
  }
}
/** an object against its spec: unknown keys and bad values dropped, empty objects removed -> the clean object, or undefined */
function clean(o, spec) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return undefined;
  const out = {};
  for (const k of Object.keys(spec)) {
    if (!(k in o)) continue;
    const sp = spec[k], v = sp.t ? clean1(o[k], sp) : clean(o[k], sp);
    if (v !== undefined) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}
/** the spec at a path ('occ.evening.wear.color') -> spec | null */
const specAt = (path) => { let s = REC_SPEC; for (const k of path.split('.')) { s = s && !s.t ? s[k] : null; if (!s) return null; } return s; };
/** a slot's kit outside its whitelist, or a hairstyle her hair cannot do (baseHs), dropped */
function fitRec(rec, baseHs) {
  for (const s of SLOTS) {
    const S = rec.occ?.[s]; if (!S) continue;
    if (S.wear?.kit && !KITS[s].includes(S.wear.kit)) delete S.wear.kit;
    if (S.wear?.fabric && S.wear.kit && !(KIT_INFO[S.wear.kit].fab || []).includes(S.wear.fabric)) delete S.wear.fabric;
    if (S.hs && baseHs && !hairFits(baseHs, S.hs)) delete S.hs;
    if (S.wear && !Object.keys(S.wear).length) delete S.wear;
    if (!Object.keys(S).length) delete rec.occ[s];
  }
  if (rec.occ && !Object.keys(rec.occ).length) delete rec.occ;
  return rec;
}
/**
 * A save's c.celebs.style made sound (an old save has none: it stays absent until a first edit; garbage of any kind is
 * cleaned, never thrown on). known(id) -> her base hair style ('' / true for a celebrity the game knows, falsy for one
 * it does not) -> s.style (or undefined)
 */
export function styleEnsure(s, known) {
  try {
    if (!s || typeof s !== 'object') return undefined;
    const st = s.style;
    if (st == null) return undefined;
    if (typeof st !== 'object' || Array.isArray(st)) { delete s.style; return undefined; }
    // (versions: none yet before 1 - a later one adds its steps here)
    const by = st.by && typeof st.by === 'object' && !Array.isArray(st.by) ? st.by : {}, out = {};
    for (const id of Object.keys(by)) {
      const base = known ? known(id) : true; if (!base) continue;
      const r = clean(by[id], REC_SPEC); if (!r) continue;
      fitRec(r, typeof base === 'string' ? base : null);
      if (Object.keys(r).some((k) => k !== 'at')) out[id] = r;
    }
    s.style = { v: STYLE_V, by: out };
    return s.style;
  } catch (e) { console.warn('Style: a style record could not be read, cleared', e); s.style = { v: STYLE_V, by: {} }; return s.style; }
}
/** her record (make: created when missing) -> rec | null */
export function styleRec(c, id, make = false) {
  const s = c?.celebs; if (!s || !id) return null;
  if (!s.style || typeof s.style !== 'object') { if (!make) return null; s.style = { v: STYLE_V, by: {} }; }
  if (!s.style.by) s.style.by = {};
  return s.style.by[id] || (make ? (s.style.by[id] = {}) : null);
}
/** a value at a path in her record -> value | undefined */
export function getAt(rec, path) { let o = rec; for (const k of path.split('.')) { if (o == null || typeof o !== 'object') return undefined; o = o[k]; } return o; }
/** drop empty objects up a path */
const prune = (rec, keys) => { for (let i = keys.length - 1; i >= 1; i--) { const p = getAt(rec, keys.slice(0, i).join('.')); if (p && typeof p === 'object' && !Object.keys(p).length) { const par = i > 1 ? getAt(rec, keys.slice(0, i - 1).join('.')) : rec; if (par) delete par[keys[i - 1]]; } } };
/**
 * A value set in her record at a path (null / undefined / '' clears it: her own again), checked against the schema and
 * the slot's cuts; stamped with the round. at: { season, round } -> { ok, value }
 */
export function setStyle(c, id, path, value, o = {}) {
  const sp = specAt(path); if (!sp || !sp.t) return { ok: false, value: undefined };
  const keys = path.split('.'), rec = styleRec(c, id, true); if (!rec) return { ok: false, value: undefined };
  let v = value == null || value === '' ? undefined : clean1(value, sp);
  if (v !== undefined && keys[0] === 'occ' && keys[2] === 'wear' && keys[3] === 'kit' && !KITS[keys[1]]?.includes(v)) v = undefined;
  if (v !== undefined && keys[0] === 'occ' && keys[2] === 'hs' && o.baseHs && !hairFits(o.baseHs, v)) return { ok: false, value: undefined };
  let p = rec; for (const k of keys.slice(0, -1)) { if (!p[k] || typeof p[k] !== 'object') p[k] = {}; p = p[k]; }
  const last = keys[keys.length - 1];
  if (v === undefined) delete p[last]; else p[last] = v;
  // (a new cut: a fabric it cannot be made in goes)
  if (keys[2] === 'wear' && last === 'kit') { const W = p, f = W.fabric; if (f && !(KIT_INFO[W.kit || ''] || { fab: ALLF }).fab.includes(f)) delete W.fabric; }
  prune(rec, keys);
  if (c.season != null) rec.at = { season: c.season, round: c.round ?? 0 };
  if (Object.keys(rec).every((k) => k === 'at')) delete c.celebs.style.by[id];
  return { ok: true, value: v };
}
/** several fields at once under a base path (a preset): each set, or cleared when null -> ok */
export function setMany(c, id, basePath, obj, o = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) setMany(c, id, `${basePath}.${k}`, v, o);
    else setStyle(c, id, `${basePath}.${k}`, v, o);
  }
  return true;
}
/** a part of her record cleared (her own again): 'face.day', 'hair', 'occ.evening.wear', ... or 'all' */
export function resetStyle(c, id, scope) {
  const rec = styleRec(c, id, false); if (!rec) return;
  if (scope === 'all') { delete c.celebs.style.by[id]; return; }
  const keys = scope.split('.'), par = keys.length > 1 ? getAt(rec, keys.slice(0, -1).join('.')) : rec;
  if (par && typeof par === 'object') delete par[keys[keys.length - 1]];
  prune(rec, keys);
  if (Object.keys(rec).every((k) => k === 'at')) delete c.celebs.style.by[id];
}
/** a stable hash of her record (FNV-1a over sorted JSON): caches, portraits */
export function styleHash(rec) {
  const st = (v) => (v && typeof v === 'object' ? `{${Object.keys(v).sort().map((k) => `${k}:${st(v[k])}`).join(',')}}` : JSON.stringify(v));
  let h = 0x811c9dc5; for (const ch of st(rec || {})) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}

// ---- from her record to how she is drawn -------------------------------------------------------------------------------------
/**
 * Her record for one occasion (occ: celebLook's occasion; night, wet) -> { hair, face (her make-up moment's overrides),
 * hs, tendrils, fringe, wear, pin } | null. A wet grid, a casual, sporty or home evening take only her hair colour and the
 * day's make-up; the grid's lanyard and a wet race's coat are never styled away.
 */
export function resolveRec(rec, ctx = {}) {
  if (!rec || typeof rec !== 'object') return null;
  const slot = slotOf(ctx.occ || 'grid', !!ctx.night, !!ctx.wet), S = slot ? rec.occ?.[slot] : null, moment = slot ? MOMENT[slot] : 'day';
  const ov = { slot, hair: rec.hair || null, face: rec.face?.[moment] || null, hs: S?.hs || null, tendrils: S?.tendrils ?? null, fringe: S?.fringe ?? null, wear: S?.wear || null, pin: S?.pin !== false };
  return ov.hair || ov.face || ov.hs || ov.tendrils != null || ov.fringe != null || ov.wear ? ov : null;
}
/**
 * celebLook's makePerson options with her style over them (ov: resolveRec's; baseHs: the hair she has, for hairFits) -> a
 * new options object (o itself untouched). A new cut brings its own legs: trousers in her colour (or dark), a skirt's
 * bare unless tights are chosen; the lanyard stays.
 */
export function applyStyle(o, ov, ctx = {}) {
  if (!o || !ov) return o;
  const out = { ...o, style: { ...(o.style || {}) }, acc: [...(o.acc || [])] }, st = out.style, H = ov.hair || {};
  // hair: the colour, the roots and ends, the shine
  if (H.color) out.hair = H.color;
  if (H.root || H.ends || H.melt != null || H.strands != null) {
    const t = { ...(st.tone || {}) };
    if (H.root === 'none') delete t.root; else if (H.root) t.root = H.root;
    if (H.ends === 'none') delete t.ends; else if (H.ends) t.ends = H.ends;
    if (H.melt != null) t.melt = H.melt; if (H.strands != null) t.strands = H.strands;
    if (t.root || t.ends || t.strands != null) st.tone = t; else delete st.tone;
  }
  if (H.shine != null) st.shine = H.shine;
  // the face: her own make-up for the moment with yours over it
  if (ov.face) st.makeup = mergeMakeup(st.makeup, ov.face);
  // the hair for the occasion
  // (a style of your choosing in place of hers: her own plait or wet look - celebLook's pool hair - goes with hers)
  if (ov.hs && (!ctx.baseHs || hairFits(ctx.baseHs, ov.hs))) { st.hs = ov.hs; delete st.braid; delete st.slick; }
  if (ov.tendrils != null) st.tendrils = ov.tendrils;
  if (ov.fringe != null) st.fringe = ov.fringe;
  const W = ov.wear; if (!W) return out;
  // the clothes
  const kit0 = out.kit, kit = W.kit && KIT_INFO[W.kit] ? W.kit : kit0, KI = KIT_INFO[kit] || {}, newCut = kit !== kit0;
  out.kit = kit;
  if (W.color) out.color = W.color;
  if (W.accent) out.accent = W.accent;
  // (trousers of her colour, dark ones, or denim - low-rise jeans)
  const trOf = (tr) => (tr === 'match' ? out.color : tr === 'denim' ? '#3d5172' : '#1b1b1f');
  if (W.legs === 'bare') out.legs = KI.tr ? trOf(KI.tr) : undefined;
  else if (W.legs) out.legs = W.legs;
  else if (KI.tr === 'match' && (newCut || W.color)) out.legs = out.color;
  else if (newCut) out.legs = KI.tr ? trOf(KI.tr) : undefined;
  // (a new cut in its own cloth and its own shape: the outfit it replaces - her wardrobe's own fabric, its cut - left
  // behind with it; a halter micro-mini in its sequins, a mesh dress in its mesh, unless a fabric is chosen)
  if (newCut) { delete out.cut; delete out.fabric; }
  if (W.fabric && (KI.fab || ALLF).includes(W.fabric)) out.fabric = W.fabric;
  if (W.shoes) out.shoes = W.shoes;
  if (W.shoeFinish) out.shoeFinish = W.shoeFinish;
  // (the shoes' kind: heels, sandals, knee or thigh boots - a new cut's own unless chosen)
  if (W.shoe) out.shoe = W.shoe; else if (newCut) delete out.shoe;
  // what she wears and carries (the paddock pass stays on a grid)
  const A = new Set(out.acc);
  if (W.earrings === 'none') A.delete('earrings'); else if (W.earrings) A.add('earrings');
  if (W.clutch === false) A.delete('clutch'); else if (W.clutch === true) A.add('clutch');
  // (a mini bag on a chain in place of a clutch)
  if (W.bag === false) A.delete('bag'); else if (W.bag === true) { A.add('bag'); A.delete('clutch'); }
  if (W.choker && W.choker !== 'none') A.add('choker');
  if (W.cuffs) A.add(W.cuffs > 1 ? 'cuffs' : 'cuff');
  out.acc = [...A];
  const J = { ...(out.jewel || {}) };
  if (W.metal) J.metal = W.metal;
  if (W.earrings && W.earrings !== 'none') J.earrings = W.earrings;
  if (W.chain != null) J.chain = W.chain;
  if (W.choker) J.choker = W.choker === 'none' ? false : W.choker;
  if (W.cuffs != null) J.cuffs = W.cuffs;
  if (W.clutchColor) J.clutchColor = W.clutchColor;
  if (W.clutchMetal) J.clutchMetal = W.clutchMetal;
  if (Object.keys(J).length) out.jewel = J;
  return out;
}
/** the colour that stands for her look (an avatar's): your gala colour, else her race-day one -> hex | null */
export function lookColor(rec) { return rec?.occ?.evening?.wear?.color || rec?.occ?.grid?.wear?.color || rec?.occ?.night?.wear?.color || rec?.occ?.dinner?.wear?.color || rec?.occ?.club?.wear?.color || null; }
