// The people out on a race night who are not famous: anyone at the after-party you could walk up to, talk to, take the
// number of and - if it goes that way - date. Each is made from a seed (the same person every time): a name, a job and
// what she is busy with, where she is from, a hobby, what wins her over and what puts her off, her personality (career/
// Persona.js: the Spark, the Ice, the Sunshine - her own conversations and texts), a face of her own, and a whole
// wardrobe in her own colours for every occasion the stars dress for (a race day, an evening, dinner, a club, the pool,
// home), so world/People.js builds her as carefully as any of them. She has the stars' shape (career/Celebs.js registers
// her: bonds, the phone, plans and dates work the same), with no fame to speak of and no circuit of her own. Everyone
// is invented and an adult (23-36). Nothing here touches the career: a pure function of the seed.

const POOL = (seed) => { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; s ^= s >>> 12; return (s >>> 0) / 4294967296; }; };
const pk = (R, a) => a[(R() * a.length) | 0];
const fit = (kit, outfit, accent, legs, acc = [], shoes = null) => ({ kit, outfit, accent, legs, acc, shoes });
const cfit = (kit, outfit, accent, legs, acc = [], shoes = null, x = {}) => ({ ...fit(kit, outfit, accent, legs, acc, shoes), ...x });

const FIRST = ['Amara', 'Bea', 'Camille', 'Dani', 'Elif', 'Freya', 'Gemma', 'Hana', 'Ines', 'Josie', 'Kira', 'Leila', 'Maeve', 'Nadia', 'Odette', 'Paloma', 'Quinn', 'Rosa', 'Saskia', 'Talia',
  'Una', 'Vera', 'Willa', 'Ximena', 'Yara', 'Zara', 'Alba', 'Bianca', 'Cleo', 'Daria', 'Esme', 'Farah', 'Greta', 'Harper', 'Isla', 'Juno', 'Kaia', 'Lucia', 'Mila', 'Nina', 'Orla', 'Pia',
  'Romy', 'Sofia', 'Tamsin', 'Uma', 'Valentina', 'Wren', 'Yasmin', 'Zoya', 'Aiko', 'Beatriz', 'Celine', 'Dina', 'Eva', 'Flora', 'Gia', 'Hollie', 'Ivy', 'Jasmine', 'Keira', 'Lola', 'Marisol',
  'Noemi', 'Olive', 'Priyanka', 'Rhea', 'Selin', 'Tove', 'Vivienne', 'Adaeze', 'Bryony', 'Chiara', 'Delphine', 'Emilia', 'Fen', 'Ingrid', 'Leonie', 'Mireille', 'Sienna', 'Thea', 'Ama'];
const LAST = ['Achterberg', 'Bellamy', 'Castellano', 'Dufresne', 'Ekwueme', 'Faraday', 'Galloway', 'Halvorsen', 'Ibarra', 'Jansen', 'Kowalczyk', 'Lindgren', 'Moreau', 'Nakamura', 'Okonkwo',
  'Pellegrini', 'Quintero', 'Rasmussen', 'Sorensen', 'Takeda', 'Underhill', 'Varga', 'Whitlock', 'Yilmaz', 'Zielinski', 'Ashdown', 'Brennan', 'Carvalho', 'Delacroix', 'Esposito', 'Fontaine',
  'Grieve', 'Haddow', 'Iwata', 'Kaplan', 'Lacroix', 'Marchand', 'Novak', 'Oduya', 'Prendergast', 'Rios', 'Salazar', 'Thorne', 'Vasquez', 'Wexford', 'Albrecht', 'Bianchi', 'Coates', 'Draper',
  'Ellery', 'Fischer', 'Granger', 'Hartmann', 'Ivers', 'Keane', 'Lowell', 'Mercer', 'Nilsen', 'Oyelaran', 'Pryce', 'Quill', 'Rourke', 'Stroud', 'Tierney', 'Valdez', 'Winslow', 'Adeyemi', 'Sato'];
// (a job and what she is busy with - in the third person, the phone puts it in her voice)
const JOBS = [
  ['Architect', ['a library extension she is fighting the council over', 'a competition entry for a footbridge', 'a house on a cliff that keeps her up at night']],
  ['Sommelier', ['the new wine list', 'a blind-tasting exam she swears she will fail', 'a vineyard trip she has been planning for months']],
  ['Marine biologist', ['a coral survey that starts next month', 'a paper on octopus behaviour', 'a grant application that is eating her alive']],
  ['Airline pilot', ['the long-haul roster', 'her captain upgrade', 'a 4am wake-up call on Thursday']],
  ['Photographer', ['a gallery show she keeps rescheduling', 'a magazine shoot on a rooftop', 'a photo book about night markets']],
  ['Florist', ['three weddings this weekend', 'the hotel lobby installation', 'her own shop, finally']],
  ['Interior designer', ['a boutique hotel refit', 'a client who wants everything beige', 'a flat she is redoing for herself']],
  ['Software engineer', ['an app launch that keeps slipping', 'a hackathon she has no business entering', 'a bug that only happens on Tuesdays']],
  ['Barrister', ['a trial that starts on Monday', 'a closing speech she rewrites every night', 'a case she is not allowed to talk about']],
  ['Personal trainer', ['a marathon block with three clients', 'her own coaching programme', 'a strongman competition she entered as a joke']],
  ['Vet', ['night shifts at the emergency clinic', 'a three-legged greyhound she is trying not to adopt', 'her surgery exams']],
  ['Gallery curator', ['an exhibition opening next week', 'an artist who will not answer emails', 'a sculpture that does not fit through the door']],
  ['Pastry chef', ['the new dessert menu', 'a wedding cake six tiers high', 'a croissant recipe she has been perfecting for a year']],
  ['Tattoo artist', ['a full back piece for a regular', 'a guest spot at a studio abroad', 'her flash sheet for the summer']],
  ['Yoga teacher', ['a retreat she is running by the sea', 'a sunrise class nobody turns up to', 'her teacher training course']],
  ['Travel writer', ['a guidebook to islands nobody has heard of', 'a column she files from airport lounges', 'a road-trip story with no ending yet']],
  ['Event planner', ['a product launch on a boat', 'a fortieth birthday with a circus theme', 'the race-weekend parties, among other things']],
  ['A&E doctor', ['a run of night shifts', 'her specialist exams', 'a week off she has not had in a year']],
  ['Physiotherapist', ['a dance company on tour', 'a clinic she is opening with a friend', 'a rugby team that will not do their stretches']],
  ['Music producer', ['an album for a band she will not name', 'a film score with an impossible deadline', 'a studio she is building in a barn']],
  ['Contemporary dancer', ['a new piece that premieres next month', 'a tour of tiny theatres', 'a choreography commission']],
  ['Stunt performer', ['a car chase in a film she cannot talk about', 'a high fall she is rehearsing', 'her fight-scene showreel']],
  ['Ceramicist', ['a kiln that keeps cracking things', 'a set of plates for a restaurant', 'a market stall every Saturday']],
  ['Data scientist', ['a model that predicts the weather badly', 'a conference talk she is dreading', 'a startup she might quit her job for']],
  ['Hotel manager', ['a five-star opening', 'a wedding party that has taken over the whole hotel', 'the rooftop bar she fought to get built']],
  ['Sailing instructor', ['a delivery trip across the Channel', 'a summer of beginners', 'a regatta crew that needs one more']],
  ['Aerospace engineer', ['a satellite that launches next year', 'a wind-tunnel test that went sideways', 'a patent she is quietly proud of']],
  ['Fashion buyer', ['the autumn collection', 'a trip to the fabric fairs', 'a designer she discovered on a market stall']],
  ['Radio DJ', ['the late show', 'a podcast she is launching', 'a playlist the station keeps rejecting']],
  ['Brewer', ['a beer named after her grandmother', 'a taproom opening', 'a sour that went very wrong']],
];
const HOBBY = ['open-water swimming', 'bouldering', 'salsa on Thursdays', 'vintage film cameras', 'a pottery class', 'tennis at dawn', 'restoring an old motorbike', 'karaoke, badly', 'trail running',
  'cooking for too many people', 'collecting records', 'learning Japanese', 'paddleboarding', 'pub quizzes', 'life drawing', 'horse riding', 'chess in the park', 'a book club that never reads the book'];
const FROM = ['Lisbon, Portugal', 'Glasgow, Scotland', 'Lyon, France', 'Accra, Ghana', 'Valencia, Spain', 'Kraków, Poland', 'Austin, Texas', 'Montreal, Canada', 'Bristol, England', 'Naples, Italy',
  'Gothenburg, Sweden', 'Istanbul, Turkey', 'Cape Town, South Africa', 'Osaka, Japan', 'Dublin, Ireland', 'Melbourne, Australia', 'Lagos, Nigeria', 'Rotterdam, Netherlands', 'Seville, Spain',
  'Leeds, England', 'Vancouver, Canada', 'Mexico City, Mexico', 'Bergen, Norway', 'Athens, Greece', 'Tbilisi, Georgia', 'São Paulo, Brazil', 'Brighton, England', 'Marseille, France'];
const HOME = ['London', 'Manchester', 'Paris', 'Barcelona', 'Berlin', 'Amsterdam', 'Las Vegas', 'Montreal', 'Austin', 'Edinburgh', 'Milan', 'Copenhagen', 'New York', 'Lisbon'];
const DATES = ['beach', 'concert', 'cooking', 'dinner', 'gala', 'gallery', 'karting', 'rooftop'];
const LIKES = ['romantic', 'kind', 'funny', 'confident', 'adventurous', 'humble', 'winner'];
const DISLIKES = ['arrogant', 'neglect', 'cruel', 'showoff', 'scandal'];
// (her personality - career/Persona.js's eight; the ids only, so this stays a pure function with no imports)
const PERSONA_IDS = ['spark', 'ice', 'sunny', 'flirtatious', 'emotional', 'rude', 'dominant', 'shy'];
const VIBE = { spark: 'Bubbly, playful and impulsive; a dare in everything, a laugh you hear across the room', ice: 'Cool, sharp and guarded; says less than she thinks and notices everything', sunny: 'Warm, sincere and a little dorky; easy company, blushes easily',
  flirtatious: 'Seductive, bold and sultry; turns everything into a flirt', emotional: 'Sensitive, romantic and tender; feels everything at full volume', rude: 'Blunt, sarcastic and hard to impress; secretly soft',
  dominant: 'Commanding, assertive and competitive; takes charge of every room', shy: 'Quiet, gentle and nervous; braver over text than in person' };
// (looks: skin tones light to deep; hair colours as people have them; the styles World/People builds)
const SKIN = ['#f6dcc8', '#f2d3bd', '#eac4a8', '#e0b08c', '#d29c74', '#c08660', '#a8704a', '#8d5a3a', '#6e4329', '#57341f', '#45291a'];
const HAIR_LIGHT = ['#e8d3a6', '#d9b77a', '#c9a066', '#b2824d', '#8a5a33', '#6a4428', '#4a2f1c', '#2b1d14', '#161012', '#8a3b1c', '#a64b24'];
const HAIR_DEEP = ['#161012', '#1d1410', '#2b1d14', '#3a2618', '#4a2f1c'];
const HS = ['long', 'waves', 'blowout', 'curlyLong', 'bob', 'ponytail', 'highpony', 'bun', 'topknot', 'curlybun', 'messybun', 'pixie'];
const HS_CURLY = ['curlyLong', 'curlybun', 'bob', 'highpony', 'bun', 'long', 'waves'];
// (her colours: an outfit colour and an accent that go with it)
const PAL = [['#1f4d3a', '#d4af6a'], ['#6a1f2e', '#e8c25a'], ['#1e2a44', '#d9dde4'], ['#151515', '#c9a24a'], ['#f2ede3', '#3a1f5c'], ['#b8925e', '#efe6d6'], ['#2a8c99', '#f4f4f2'], ['#c2255c', '#1d1b20'],
  ['#e3d5c3', '#6a4428'], ['#3a1f5c', '#e8c25a'], ['#7a2e1f', '#f0d9b5'], ['#0f3b57', '#e9b44c'], ['#d8a7b1', '#4a2f3a'], ['#2e3b33', '#e8e2d0'], ['#f4f4f2', '#151515'], ['#5b2a86', '#d9c6f0'],
  ['#c7522a', '#f6e7cb'], ['#264653', '#e9c46a'], ['#8d0801', '#f4d58d'], ['#e5e5e5', '#9e2a2b']];
const LEGS = ['#1d1b20', '#2b2f3a', '#3a4a66', '#efe6d6', null];
const DAY = ['trench', 'coord', 'jumpsuit', 'blazer', 'casual', 'knit', 'wrap', 'dress'];
const NIGHT = ['wrap', 'bardot', 'oneshoulder', 'bodycon', 'slip', 'halter', 'blazerdress'];
const EVENING = ['gown', 'slitgown', 'halter', 'oneshoulder'];
const DINNER = ['oneshoulder', 'corset', 'bardot', 'wrap', 'blazerdress', 'slip'];
const CASUAL = ['sweater', 'casual', 'leather', 'bomber', 'knit', 'jumpsuit'];
const CLUB = ['cutoutmini', 'sidecut', 'keyhole', 'backless', 'diamond', 'ribcut', 'hipcut', 'corsettop', 'corsetleather', 'bandeauset', 'twistset', 'tieset', 'onecrop', 'lowrise', 'cropjeans', 'blazerbra', 'meshdress', 'slipmini', 'lacemini'];
const POOLW = ['sportbikini', 'stringbikini', 'monoplunge'];
const FABRIC = ['satin', 'velvet', 'crepe', 'sequin', 'leather'];

/** a seed for a new person tonight (k: which of tonight's strangers) */
export function localSeed(season, round, venue, k) { let h = 2166136261; for (const ch of `${season}|${round}|${venue}|${k}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
/** the id a local goes by (the seed in it: the same person, rebuilt, after a reload) */
export const localId = (seed) => `l-${(seed >>> 0).toString(36)}`;
export const isLocalId = (id) => /^l-[0-9a-z]+$/.test(String(id || ''));
const seedOf = (id) => parseInt(String(id).slice(2), 36) >>> 0;

/** the person for an id (or a seed): the stars' shape (career/Celebs.js), plus local: true and her persona */
export function makeLocal(idOrSeed) {
  const seed = typeof idOrSeed === 'number' ? idOrSeed >>> 0 : seedOf(idOrSeed), id = localId(seed), R = POOL(seed);
  const name = `${pk(R, FIRST)} ${pk(R, LAST)}`, [job, work] = pk(R, JOBS), from = pk(R, FROM), home = pk(R, HOME), age = 23 + ((R() * 14) | 0), hobby = pk(R, HOBBY);
  const persona = PERSONA_IDS[(R() * PERSONA_IDS.length) | 0];
  const deep = R() < 0.35, skin = deep ? pk(R, SKIN.slice(6)) : pk(R, SKIN.slice(0, 8)), hair = deep ? pk(R, HAIR_DEEP) : pk(R, HAIR_LIGHT), hs = deep && R() < 0.6 ? pk(R, HS_CURLY) : pk(R, HS);
  const [col, acc] = pk(R, PAL), [col2, acc2] = pk(R, PAL), legs = () => pk(R, LEGS);
  const likes = [...new Set([pk(R, LIKES), pk(R, LIKES), pk(R, LIKES)])], dislikes = [...new Set([pk(R, DISLIKES), pk(R, DISLIKES)])].filter((d) => !(d === 'arrogant' && likes.includes('confident') && R() < 0.5));
  const fav = pk(R, DATES); let meh = pk(R, DATES); if (meh === fav) meh = DATES[(DATES.indexOf(fav) + 3) % DATES.length];
  const jew = () => (R() < 0.5 ? ['earrings'] : ['earrings', 'clutch']);
  const wear = {
    grid: fit(pk(R, DAY), col, acc, legs(), ['lanyard', R() < 0.5 ? 'shadesUp' : 'watch']),
    night: [fit(pk(R, NIGHT), col, acc, null, ['lanyard', 'clutch']), fit(pk(R, NIGHT), col2, acc2, null, ['lanyard', 'earrings'])],
    wet: fit('trench', pk(R, ['#2e3b33', '#2b2f3a', '#b8925e', '#151515']), acc, legs(), ['lanyard']),
    evening: [fit(pk(R, EVENING), col, acc, null, jew()), fit(pk(R, EVENING), col2, acc2, null, jew())],
    dinner: [fit(pk(R, DINNER), col, acc, null, jew()), fit(pk(R, DINNER), col2, acc2, null, ['earrings'])],
    casual: [fit(pk(R, CASUAL), col2, acc, legs()), fit(pk(R, CASUAL), col, acc2, legs())],
    sporty: fit('athleisure', col, acc, '#1d1b20', ['watch']),
    home: fit(pk(R, ['knit', 'sweater']), pk(R, ['#efe6d6', '#cbb89a', '#d9dde4', '#e3d5c3']), acc, null),
    club: [cfit(pk(R, CLUB), col, acc, null, ['earrings', 'bag'], acc, { fabric: pk(R, FABRIC), shoeFinish: R() < 0.5 ? 'metallic' : 'satin' }), cfit(pk(R, CLUB), col2, acc2, null, ['earrings'], col2, { shoe: R() < 0.5 ? 'sandal' : undefined })],
    pool: [cfit(pk(R, POOLW), col, acc, null, ['shades'], acc), cfit('meshcover', col2, acc2, null, ['sunhat'], acc2)],
  };
  const traits = { likes, dislikes, jealousy: 0.2 + R() * 0.5, privacy: 0.2 + R() * 0.5, drama: 0.1 + R() * 0.5, free: R() < 0.2 ? 0.3 + R() * 0.3 : 0, wreck: R() < 0.15 ? 0.2 + R() * 0.3 : 0 };
  const look = { skin, hair, hs, kit: wear.grid.kit, outfit: col, accent: acc, legs: wear.grid.legs, pose: pk(R, ['talk', 'hips', 'cross', 'pose']), len: 0.9 + R() * 0.1, wid: 0.88 + R() * 0.1, jaw: 0.2 + R() * 0.2 };
  return {
    id, name, job, from, home, age, fame: 6 + ((R() * 20) | 0), often: [], local: true, persona, vibe: VIBE[persona],
    bio: `${job} from ${from}, living in ${home}. Spends her free time on ${hobby}.`,
    work, hobby, fav, favLine: 'She says it is exactly her kind of evening.', meh, mehLine: 'She is polite about it. Mostly.', traits, look, wear,
  };
}
