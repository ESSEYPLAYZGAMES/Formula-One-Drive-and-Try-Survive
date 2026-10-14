// The celebrities: twelve women from music, sport, film, fashion and television who turn up on the grid as guests - a
// singer, an Olympic sprinter, a film director, a fashion designer, an actress, a DJ, a tennis champion, a TV presenter,
// a model, a surfer, a chef and a racing streamer. Every one of them is made up (invented names, careers and lives -
// nobody real, nobody's likeness) and every one is an adult. You meet them on the grid walk; talk well and they warm to
// you, flirt and there may be a spark, ask one out and - if she likes how you carry yourself, your results, what the
// papers say about you - there is a date in the week between rounds: a text-only evening (a gallery, a concert, the
// beach, a gala) or one of the evening venues you walk around in 3D (a private dining room, your flat, a rooftop over
// the Strip, karting...), whose result comes back here (dateResult). A couple of dates and you are seeing each other;
// make it official and the cameras know - or keep it between the two of you. You can see more than one of them at once,
// and keep some of it quiet: a secret costs you composure every round you juggle it, and the evidence piles up - a long
// lens outside a restaurant, two of them at the same race, messages she was not meant to see, a tabloid tip-off, paddock
// gossip. She notices before she knows (a hint, a question), and when she knows she wants to talk: tell her the truth,
// deny it, blame the papers, end it with the other one, or beg - and she decides whether to stay. If the two of you
// were public, The Paddock Post has it as well. It stays PG: compliments, dinners, being photographed together, making
// it official, confrontations and sometimes a break-up; the women have minds of their own. Good relationships steady
// you (morale, focus) race after race; neglect, jealousy and long lenses wear them down, and there is a warning before
// she walks away. None of it ever touches the memorial, mourning or injury side of the game: in a grave week the
// photographers keep their distance, nobody is found out and nothing here makes a story of it; if your driver dies,
// those close to him are left in peace. The state lives on the career as plain JSON (c.celebs: bonds, partner (the
// public partner), met, log, confront); the callers save.
import { shiftMorale, moodOf } from './Morale.js';
import { prEvent, crisisFrom, fameIndex } from './PR.js';
import { styleEnsure, resolveRec, applyStyle, lookColor } from './Style.js';

const pick = (a) => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;
const first = (s) => String(s || '').split(' ')[0];
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone' };
// (made-up men a tabloid might pair her with: the other guests of the grid show - never a driver, never anyone real)
const MEN = ['Jonah Reese', 'Dex Okoro', 'Theo Quinn', 'Kai Brennan'];

// ---- the twelve ------------------------------------------------------------------------------------------------------
/** a look: skin, hair colour, hair style (People's long, waves, blowout, curlyLong, bob, ponytail, highpony, bun, topknot, curlybun, messybun, pixie), kit and colours, a standing pose, the face's shape */
/** an outfit (world/People.js's clothes): its kit, its colour, the accent (beneath a jacket, a belt, trims), the legs (trousers; under a skirt, sheer tights - none: bare), what she wears and carries (acc), her shoes' colour */
const fit = (kit, outfit, accent, legs, acc = [], shoes = null) => ({ kit, outfit, accent, legs, acc, shoes });
/** a night out's outfit (a club, an after-party: People's CLUB_KITS): fit's, and x - { fabric, shoe (People's SHOE_KINDS: sandals, knee- or thigh-high boots), shoeFinish, jewel } */
const cfit = (kit, outfit, accent, legs, acc = [], shoes = null, x = {}) => ({ ...fit(kit, outfit, accent, legs, acc, shoes), ...x });
const look = (skin, hair, hs, kit, outfit, accent, legs, pose, len, wid, jaw) => ({ skin, hair, hs, kit, outfit, accent, legs, pose, len, wid, jaw });
/** what wins her over, what puts her off, how jealous she gets, how much she hates the cameras, how much she enjoys a scene, how free a spirit she is (0..1: she does not expect to be the only one), how much she likes trouble (wreck 0..1: she knows you are taken - and wants to be the one) */
const traits = (likes, dislikes, jealousy, privacy, drama, free = 0, wreck = 0) => ({ likes, dislikes, jealousy, privacy, drama, free, wreck });
/**
 * Each: { id (fixed: the grid talk writes topics against it), name, job, from (where she grew up), home, age, fame
 * (20..95), often (the circuits she is usually at), vibe, bio, work (what she is busy with), hobby, fav / favLine (the
 * date she loves, and how it goes), meh / mehLine (the one she would rather not), traits, look, wear (her wardrobe, by
 * occasion: grid - a race day's, by day; night - a night race's, dressier; wet - a wet one's, under a coat; evening - a
 * rooftop, a gala; club - a club or an after-party, late; dinner; casual - a pub, a sim lounge, a coffee; sporty -
 * karting; home; and below: pool - a pool club, a dayclub; hot - a hot race's grid by day) }
 */
export const CELEBS = [
  { id: 'mira-vale', name: 'Mira Vale', job: 'Singer', from: 'Cork, Ireland', home: 'London', age: 29, fame: 88, often: ['lasvegas'],
    vibe: 'Warm, romantic and a little theatrical; laughs easily, sulks briefly',
    bio: 'Irish singer-songwriter whose third album went to number one on both sides of the Atlantic. Plays a residency on the Strip every autumn, still writes every song at a battered upright piano, and has never once been on time.',
    work: ['the new album', 'the Las Vegas residency', 'the arena tour', 'a duet she is not allowed to talk about yet'], hobby: 'cold-water swimming at home in Cork',
    fav: 'cooking', favLine: 'She says it is the first quiet evening she has had since the tour began.', meh: 'concert', mehLine: 'She spends half the set listening to the sound mix. Old habits.',
    traits: traits(['romantic', 'kind', 'funny'], ['arrogant', 'neglect'], 0.45, 0.35, 0.4), look: look('#f2d3bd', '#8a3b1c', 'waves', 'dress', '#1f4d3a', '#d4af6a', '#1d1b20', 'pose', 0.95, 0.92, 0.3),
    wear: { grid: fit('trench', '#b8925e', '#efe6d6', '#2b2f3a', ['lanyard', 'shadesUp']), night: [fit('wrap', '#1f4d3a', '#d4af6a', '#1d1b20', ['lanyard', 'clutch']), fit('bardot', '#1f4d3a', '#d4af6a', null, ['lanyard', 'clutch', 'earrings'])], wet: fit('trench', '#2e3b33', '#efe6d6', '#1d1b20', ['lanyard']), evening: [fit('gown', '#1f4d3a', '#d4af6a', null, ['clutch']), fit('slitgown', '#1f4d3a', '#d4af6a', null, ['clutch', 'earrings'], '#c9a24a'), fit('halter', '#d4af6a', '#1f4d3a', null, ['earrings'])], dinner: [fit('oneshoulder', '#6a1f2e', '#d4af6a', null, ['earrings', 'clutch']), fit('corset', '#6a1f2e', '#d4af6a', null, ['earrings'])], casual: fit('sweater', '#efe6d6', '#d4af6a', '#3a4a66'), sporty: fit('athleisure', '#1f4d3a', '#d4af6a', '#1d1b20', ['watch']), home: fit('knit', '#cbb89a', '#d4af6a', null),
      // (the emerald and the gold, theatrical: a velvet corset over wide trousers, black mesh over a slip, a wine ruched mini cut out at the side, an emerald satin slip)
      club: [cfit('corsettop', '#1f4d3a', '#d4af6a', '#1d1b20', ['earrings', 'bag'], '#d4af6a', { fabric: 'velvet', shoeFinish: 'metallic', jewel: { earrings: 'drop' } }), cfit('meshdress', '#1d1b20', '#1d1b20', null, ['earrings'], '#1d1b20'), cfit('sidecut', '#6a1f2e', '#d4af6a', null, ['earrings', 'bag'], '#d4af6a', { shoe: 'sandal', shoeFinish: 'metallic' }), cfit('slipmini', '#1f4d3a', '#d4af6a', null, ['earrings'], '#d4af6a', { shoeFinish: 'metallic', jewel: { chain: true } })] } },
  { id: 'lena-marsh', name: 'Lena Marsh', job: 'Olympic sprinter', from: 'Birmingham, England', home: 'Loughborough', age: 26, fame: 62, often: ['silverstone'],
    vibe: 'Driven and blunt, and very funny once she trusts you',
    bio: 'Two-time Olympian over 100 and 200 metres, and the fastest British woman over 200 for three seasons running. Talks about reaction times like a racing driver, and has been angling for a ride in a two-seater for years.',
    work: ['the indoor season', 'winter training in the sun', 'a new pair of spikes she is testing', 'the relay squad'], hobby: 'restoring a 1970s Mini with her dad',
    fav: 'karting', favLine: 'She wants a rematch before you have taken your helmet off.', meh: 'gala', mehLine: 'She slips out before the auction: training at six.',
    traits: traits(['winner', 'confident', 'funny'], ['cruel', 'showoff'], 0.25, 0.4, 0.2), look: look('#5e3a24', '#141414', 'ponytail', 'casual', '#f4f4f2', '#e8c25a', '#1f2a44', 'hips', 0.96, 0.93, 0.32),
    wear: { grid: fit('bomber', '#1f2a44', '#f4f4f2', '#2a3550', ['lanyard', 'shades']), night: [fit('jumpsuit', '#16161a', '#e8c25a', '#16161a', ['lanyard', 'earrings']), fit('bodycon', '#16161a', '#e8c25a', null, ['lanyard', 'earrings'], '#c9a24a')], wet: fit('athleisure', '#1f2a44', '#e8c25a', '#16161a', ['lanyard']), evening: [fit('gown', '#c9a24a', '#f4f4f2', null, ['earrings', 'clutch']), fit('halter', '#c9a24a', '#f4f4f2', null, ['earrings']), fit('slitgown', '#16161a', '#e8c25a', null, ['earrings', 'clutch'])], dinner: [fit('pantsuit', '#f4f4f2', '#16161a', '#f4f4f2', ['earrings']), fit('blazerdress', '#f4f4f2', '#e8c25a', null, ['earrings'], '#c9a24a')], casual: fit('casual', '#f4f4f2', '#e8c25a', '#2c3e66', ['shadesUp']), sporty: fit('athleisure', '#f4f4f2', '#e8c25a', '#1f2a44', ['watch']), home: fit('coord', '#8a8f99', '#e8c25a', '#8a8f99'),
      // (black and gold, an athlete's confidence: a cut-out mini, a gold sequin halter micro-mini, a corset crop over low-rise jeans, an open white blazer over a bralette)
      club: [cfit('cutoutmini', '#16161a', '#e8c25a', null, ['earrings'], '#16161a', { jewel: { earrings: 'hoop', metal: 'gold' } }), cfit('haltermicro', '#c9a24a', '#e8c25a', null, ['earrings'], '#c9a24a', { shoeFinish: 'metallic', jewel: { earrings: 'hoop' } }), cfit('cropjeans', '#16161a', '#e8c25a', '#2a3550', ['earrings'], '#16161a', { jewel: { earrings: 'hoop' } }), cfit('blazerbra', '#f4f4f2', '#16161a', null, ['earrings'], '#f4f4f2')] } },
  { id: 'sasha-ivers', name: 'Sasha Ivers', job: 'Film director', from: 'Toronto, Canada', home: 'Los Angeles', age: 34, fame: 55, often: ['lasvegas', 'silverstone'],
    vibe: 'Dry, watchful and allergic to small talk',
    bio: 'Canadian director whose second feature took the jury prize at a European festival. Now shooting a documentary about the people who build a night race - the caterers, the riggers, the crews who close a city overnight - and she notices everything.',
    work: ['the new film', 'her documentary about a night race', 'the festival cut', 'location scouting in the desert'], hobby: 'shooting and developing her own black-and-white film',
    fav: 'gallery', favLine: 'She frames every room with her hands and tells you where she would put the camera.', meh: 'gala', mehLine: 'She hates the flashbulbs and says so, quietly, all night.',
    traits: traits(['humble', 'funny', 'kind'], ['showoff', 'arrogant'], 0.2, 0.8, 0.15), look: look('#efcfb5', '#141414', 'bob', 'blazer', '#16181d', '#c9c2b8', '#16181d', 'cross', 0.97, 0.9, 0.28),
    wear: { grid: fit('pantsuit', '#16181d', '#c9c2b8', '#16181d', ['lanyard', 'shades']), night: [fit('pantsuit', '#2a2c33', '#e8e4dc', '#2a2c33', ['lanyard']), fit('slip', '#121316', '#c9c2b8', null, ['lanyard', 'clutch'])], wet: fit('trench', '#1b1c20', '#c9c2b8', '#16181d', ['lanyard']), evening: [fit('jumpsuit', '#121316', '#c9c2b8', '#121316', ['earrings']), fit('halter', '#121316', '#c9c2b8', null, ['earrings'])], dinner: [fit('blazer', '#16181d', '#efece6', '#16181d', ['earrings']), fit('blazerdress', '#16181d', '#c9c2b8', null, ['earrings']), fit('corset', '#16181d', '#c9c2b8', null, ['earrings'])], casual: fit('leather', '#16181d', '#8a8a8e', '#1b1c22'), sporty: fit('athleisure', '#26282e', '#c9c2b8', '#16181d', ['watch']), home: fit('sweater', '#3a3c42', '#c9c2b8', '#1b1c22'),
      // (black, spare, classic: a long-sleeved mini open at the back, a black satin cami over a charcoal leather mini, a corset over leather trousers)
      club: [cfit('backless', '#121316', '#c9c2b8', null, ['earrings'], '#121316', { fabric: 'crepe' }), cfit('camiskirt', '#121316', '#2a2c33', null, ['bag'], '#121316'), cfit('corsetleather', '#121316', '#c9c2b8', '#121316', ['earrings'], '#121316', { jewel: { metal: 'silver' } }), cfit('blazerbtn', '#121316', '#c9c2b8', null, ['earrings'], '#121316', { jewel: { metal: 'silver' } })] } },
  { id: 'noor-haddad', name: 'Noor Haddad', job: 'Fashion designer', from: 'Beirut, Lebanon', home: 'Paris', age: 31, fame: 70, often: ['silverstone'],
    vibe: 'Elegant and sharp-eyed; generous with praise when it is earned',
    bio: 'Born in Beirut, trained in Paris, runs her own label from an atelier in the Marais. Her capsule collection of race-inspired jackets sold out in an afternoon, and she has opinions about every team\'s kit.',
    work: ['the autumn collection', 'the Paris show', 'a capsule collection inspired by racing suits', 'the new atelier'], hobby: 'sketching strangers in cafés',
    fav: 'gala', favLine: 'She dressed half the room and knows exactly which half.', meh: 'karting', mehLine: 'The overalls, she says, are a crime against tailoring.',
    traits: traits(['confident', 'romantic', 'kind'], ['cruel', 'neglect'], 0.35, 0.5, 0.3), look: look('#d6a47c', '#2b1d14', 'long', 'dress', '#efe6d6', '#8a6a2a', '#2b2b2b', 'hips', 0.96, 0.9, 0.32),
    wear: { grid: fit('coord', '#efe6d6', '#8a6a2a', '#efe6d6', ['lanyard', 'shadesUp']), night: [fit('jumpsuit', '#d8c3a0', '#8a6a2a', '#d8c3a0', ['lanyard', 'clutch']), fit('slitgown', '#d8c3a0', '#8a6a2a', null, ['lanyard', 'clutch'], '#c9a44a'), fit('blazerdress', '#d8c3a0', '#8a6a2a', null, ['lanyard', 'clutch'], '#8a6a2a')], wet: fit('trench', '#b5925f', '#efe6d6', '#2b2b2b', ['lanyard']), evening: [fit('gown', '#141414', '#c9a44a', null, ['clutch']), fit('sequin', '#c9a44a', '#141414', null, ['earrings', 'clutch'], '#c9a44a'), fit('halter', '#141414', '#c9a44a', null, ['earrings'])], dinner: [fit('oneshoulder', '#a0522d', '#c9a44a', null, ['earrings', 'clutch'], '#8a6a2a'), fit('bardot', '#a0522d', '#8a6a2a', null, ['earrings'], '#8a6a2a')], casual: fit('knit', '#c2a27a', '#8a6a2a', '#5a4632'), sporty: fit('athleisure', '#cbb79a', '#8a6a2a', '#2b2b2b', ['watch']), home: fit('coord', '#e0d5c2', '#8a6a2a', '#e0d5c2'),
      // (a designer's eye, sand and black: black lace over a sand slip, a sand mini cut out under the bust, an open camel blazer over a black bralette and boots, champagne satin over black leather)
      club: [cfit('lacemini', '#141414', '#8a6a2a', null, ['earrings', 'bag'], '#141414'), cfit('keyhole', '#d8c3a0', '#8a6a2a', null, ['earrings'], '#8a6a2a', { fabric: 'crepe' }), cfit('blazerbra', '#c2a27a', '#141414', null, ['earrings'], '#141414', { shoe: 'kneeboot' }), cfit('camiskirt', '#d8c3a0', '#141414', null, ['earrings', 'bag'], '#141414')] } },
  { id: 'ava-rennick', name: 'Ava Rennick', job: 'Actress', from: 'Melbourne, Australia', home: 'Los Angeles', age: 30, fame: 92, often: ['lasvegas'],
    vibe: 'Quick, playful and completely at ease in front of a camera',
    bio: 'Australian actress who broke out as the lead in a streaming spy thriller and has barely been off a red carpet since. Does her own stunts when the insurers let her, and is far funnier than her films. Has a reputation for falling for people who are already spoken for - and for never apologising for it.',
    work: ['the new series', 'reshoots for the spy thriller', 'a stage run in the West End', 'the awards circuit'], hobby: 'indoor rock climbing',
    fav: 'rooftop', favLine: 'She says it is the best set she has ever stood on.', meh: 'gallery', mehLine: 'She is recognised four times between the first room and the second.',
    traits: traits(['funny', 'confident', 'adventurous'], ['neglect', 'cruel'], 0.5, 0.25, 0.55, 0, 0.85), look: look('#f1d2b6', '#d1aa62', 'waves', 'dress', '#a3162b', '#f2d7a0', '#151515', 'pose', 0.94, 0.92, 0.3),
    wear: { grid: fit('blazer', '#a3162b', '#f2ead8', '#3a4a66', ['lanyard', 'shadesUp']), night: [fit('slip', '#a3162b', '#f2d7a0', null, ['lanyard', 'clutch']), fit('bodycon', '#a3162b', '#f2d7a0', null, ['lanyard', 'clutch', 'earrings'])], wet: fit('trench', '#d9c9a8', '#a3162b', '#151515', ['lanyard']), evening: [fit('slitgown', '#a3162b', '#f2d7a0', null, ['clutch', 'earrings']), fit('halter', '#151515', '#f2d7a0', null, ['earrings']), fit('sequin', '#a3162b', '#f2d7a0', null, ['clutch'], '#a3162b'), fit('oneshoulder', '#f2d7a0', '#a3162b', null, ['clutch', 'earrings'], '#c9a24a')], dinner: [fit('slip', '#151515', '#f2d7a0', null, ['clutch']), fit('corset', '#151515', '#f2d7a0', null, ['earrings']), fit('bodycon', '#151515', '#f2d7a0', null, ['clutch', 'earrings'])], casual: fit('bomber', '#4a5240', '#f2ead8', '#3a4a66', ['shadesUp']), sporty: fit('athleisure', '#a3162b', '#f4f4f2', '#151515', ['watch']), home: fit('sweater', '#e8b4b8', '#f2d7a0', '#6a6e78'),
      // (red, bold, made for the cameras: a red sequin halter micro-mini, a red cut-out mini, a black plunging slip, a red suit open over a bralette with thigh-high boots)
      club: [cfit('haltermicro', '#a3162b', '#f2d7a0', null, ['earrings'], '#f2d7a0', { shoeFinish: 'metallic' }), cfit('cutoutmini', '#a3162b', '#f2d7a0', null, ['earrings', 'bag'], '#151515', { shoe: 'sandal' }), cfit('slipmini', '#151515', '#f2d7a0', null, ['earrings'], '#151515'), cfit('blazerbra', '#a3162b', '#151515', null, ['earrings'], '#151515', { shoe: 'thighboot' })] } },
  { id: 'jade-okafor', name: 'Jade Okafor', job: 'DJ', from: 'London, England', home: 'London', age: 27, fame: 66, often: ['lasvegas'],
    vibe: 'Loud, kind and always up for it',
    bio: 'South London DJ and producer who went from pirate-radio sets as a teenager to headlining festival main stages. Plays the race-weekend after-party in Las Vegas and knows every sound engineer on the Strip by name.',
    work: ['her summer residency in Ibiza', 'the new EP', 'the race-weekend after-party set', 'her Friday-night radio show'], hobby: 'digging through record shops for old vinyl',
    fav: 'concert', favLine: 'She knows the support act and gets you both backstage.', meh: 'cooking', mehLine: 'She is asleep on the sofa by half nine: three cities in four nights.',
    traits: traits(['funny', 'adventurous', 'confident'], ['arrogant', 'neglect'], 0.3, 0.2, 0.45, 0.6), look: look('#7a4e33', '#141414', 'curlyLong', 'casual', '#26262b', '#2ec4b6', '#2c3e66', 'hips', 0.95, 0.95, 0.3),
    wear: { grid: fit('leather', '#1c1c20', '#2ec4b6', '#2c3e66', ['lanyard', 'shades']), night: [fit('jumpsuit', '#1fa89c', '#1c1c20', '#1fa89c', ['lanyard']), fit('croppants', '#1c1c20', '#2ec4b6', '#1c1c20', ['lanyard', 'earrings'])], wet: fit('bomber', '#1c1c20', '#2ec4b6', '#2c3e66', ['lanyard']), evening: [fit('gown', '#1d8f86', '#e8c25a', null, ['clutch']), fit('slitgown', '#1d8f86', '#e8c25a', null, ['clutch', 'earrings'], '#e8c25a'), fit('sequin', '#1c1c20', '#2ec4b6', null, ['earrings'])], dinner: [fit('leather', '#1c1c20', '#e8c25a', '#1a1a1e'), fit('bodycon', '#1c1c20', '#2ec4b6', null, ['earrings'])], casual: fit('bomber', '#2ec4b6', '#1a1a1e', '#2c3e66'), sporty: fit('athleisure', '#1c1c20', '#2ec4b6', '#1c1c20', ['watch']), home: fit('casual', '#2ec4b6', '#26262b', '#2c3e66'),
      // (behind the decks and in front of them: a teal bandeau set with knee boots, a teal corset crop over low-rise jeans, black mesh with thigh-high boots, a silver metallic ruched mini)
      club: [cfit('bandeauset', '#1fa89c', '#1c1c20', null, ['earrings'], '#1c1c20', { shoe: 'kneeboot', jewel: { earrings: 'hoop' } }), cfit('cropjeans', '#2ec4b6', '#1c1c20', '#2c3e66', ['earrings'], '#1c1c20', { jewel: { earrings: 'hoop' } }), cfit('meshdress', '#1c1c20', '#1c1c20', null, ['earrings'], '#1c1c20', { shoe: 'thighboot' }), cfit('sidecut', '#b9bcc2', '#2ec4b6', null, ['earrings'], '#b9bcc2', { fabric: 'metallic', shoe: 'sandal', shoeFinish: 'metallic', jewel: { metal: 'silver' } })] } },
  { id: 'clara-voss', name: 'Clara Voss', job: 'Tennis champion', from: 'Hamburg, Germany', home: 'Monaco', age: 25, fame: 78, often: ['silverstone'],
    vibe: 'Fiercely competitive and precise; softer than she lets on',
    bio: 'German tennis player who won her first major at twenty-one and has not left the world\'s top five since. Treats a practice set like a final, keeps a notebook of every match she has lost, and hates losing at anything - cards included.',
    work: ['the grass-court swing', 'the end-of-season finals', 'a new racket she is not sure about', 'an off-season training block'], hobby: 'online chess, under a name nobody knows',
    fav: 'karting', favLine: 'She takes it as seriously as a final and wins it on the last lap.', meh: 'concert', mehLine: 'Too loud, she says. She has an early practice.',
    traits: traits(['winner', 'humble'], ['arrogant', 'showoff'], 0.35, 0.55, 0.2), look: look('#f0cfb2', '#c9a46a', 'ponytail', 'casual', '#f6f6f3', '#1f8a52', '#33456b', 'talk', 0.98, 0.91, 0.3),
    wear: { grid: fit('bomber', '#1f6a46', '#f6f6f3', '#e9e7e0', ['lanyard', 'shades', 'watch']), night: [fit('dress', '#1f6a46', '#f6f6f3', null, ['lanyard', 'earrings']), fit('bardot', '#f2f0ea', '#1f8a52', null, ['lanyard', 'earrings'])], wet: fit('trench', '#2a3550', '#f6f6f3', '#2a3550', ['lanyard']), evening: [fit('gown', '#f2f0ea', '#1f8a52', null, ['earrings', 'clutch']), fit('halter', '#1f6a46', '#f6f6f3', null, ['earrings'])], dinner: [fit('knit', '#ece6d8', '#1f8a52', null, ['earrings']), fit('cropset', '#ece6d8', '#1f8a52', null, ['earrings'])], casual: fit('sweater', '#2f7a52', '#f6f6f3', '#33456b', ['watch']), sporty: fit('tennis', '#f6f6f3', '#1f8a52', null, ['watch']), home: fit('athleisure', '#9aa0a8', '#1f8a52', '#33456b'),
      // (green and white, precise and classic: a white long-sleeved mini open at the back, a green satin corset over white wide trousers, a green mini cut out under the bust)
      club: [cfit('backless', '#f2f0ea', '#1f8a52', null, ['earrings'], '#f2f0ea', { fabric: 'crepe' }), cfit('corsettop', '#1f6a46', '#f6f6f3', '#f6f6f3', ['earrings'], '#f6f6f3'), cfit('keyhole', '#1f6a46', '#f6f6f3', null, ['earrings'], '#f2f0ea'), cfit('tieset', '#f2f0ea', '#1f8a52', null, ['earrings'], '#f2f0ea')] } },
  { id: 'elena-marchetti', name: 'Elena Marchetti', job: 'TV presenter', from: 'Milan, Italy', home: 'Milan', age: 33, fame: 74, often: ['lasvegas', 'silverstone'],
    vibe: 'Charming, sociable and impossible to fool',
    bio: 'Milanese presenter who hosts the biggest Sunday-night chat show in Italy and a motoring series on the side. Has interviewed half the grid, and can tell within a sentence when a driver is giving her a line. Enjoys a good scandal far more than she lets on - her own included.',
    work: ['the Sunday-night chat show', 'a travel series along the Amalfi coast', 'hosting an awards gala', 'the new season of her motoring show'], hobby: 'long Sunday lunches for twenty',
    fav: 'dinner', favLine: 'She knows the owner, the chef and the best table, and introduces you to all three.', meh: 'beach', mehLine: 'She lasts an hour in the sun and spends the rest under an umbrella, very elegantly.',
    traits: traits(['funny', 'kind', 'confident'], ['cruel', 'neglect'], 0.4, 0.2, 0.35, 0, 0.6), look: look('#e6bb95', '#2b1d14', 'long', 'blazer', '#9e1b2c', '#f4efe6', '#1b1b1f', 'talk', 0.95, 0.93, 0.31),
    wear: { grid: fit('blazer', '#9e1b2c', '#f4efe6', '#1b1b1f', ['lanyard', 'shadesUp']), night: [fit('blazerdress', '#9e1b2c', '#d4af6a', null, ['lanyard', 'clutch']), fit('corset', '#9e1b2c', '#d4af6a', null, ['lanyard', 'clutch', 'earrings'])], wet: fit('trench', '#1b1b1f', '#f4efe6', '#1b1b1f', ['lanyard']), evening: [fit('gown', '#7a1222', '#d4af6a', null, ['clutch']), fit('slitgown', '#7a1222', '#d4af6a', null, ['clutch', 'earrings'], '#d4af6a'), fit('bardot', '#151515', '#d4af6a', null, ['earrings', 'clutch'])], dinner: [fit('wrap', '#1e2a44', '#d4af6a', null), fit('bodycon', '#1e2a44', '#d4af6a', null, ['earrings'])], casual: fit('leather', '#7a4a2a', '#f4efe6', '#3a4a66', ['shadesUp']), sporty: fit('athleisure', '#9e1b2c', '#f4efe6', '#1b1b1f', ['watch']), home: fit('knit', '#7a7a80', '#f4efe6', '#5a5a60'),
      // (Milanese glamour, reds and black: a red corset over leather trousers, black lace over burgundy, a burgundy satin halter mini cut out at the midriff)
      club: [cfit('corsetleather', '#9e1b2c', '#d4af6a', '#151515', ['earrings', 'bag'], '#151515'), cfit('lacemini', '#151515', '#7a1222', null, ['earrings'], '#151515'), cfit('diamond', '#7a1222', '#d4af6a', null, ['earrings'], '#d4af6a', { fabric: 'satin', shoe: 'sandal', shoeFinish: 'metallic' }), cfit('twistset', '#7a1222', '#d4af6a', null, ['earrings'], '#d4af6a', { fabric: 'satin', shoe: 'sandal', shoeFinish: 'metallic' })] } },
  { id: 'priya-raman', name: 'Priya Raman', job: 'Model', from: 'Leicester, England', home: 'New York', age: 24, fame: 68, often: ['silverstone'],
    vibe: 'Thoughtful, curious and quietly stubborn',
    bio: 'Grew up in Leicester, scouted at nineteen, now the face of two fashion houses. Studies astrophysics part-time, runs a charity that builds schools for girls, and would rather talk about Saturn than about herself.',
    work: ['the spring campaign', 'a shoot in Marrakech', 'fashion week in Milan', 'her charity\'s new school'], hobby: 'astrophotography from rooftops',
    fav: 'rooftop', favLine: 'She brought a small telescope and finds Saturn above the lights.', meh: 'gala', mehLine: 'She has done too many of these for work, and it shows.',
    traits: traits(['kind', 'humble', 'adventurous'], ['cruel', 'scandal'], 0.25, 0.65, 0.25), look: look('#a8714b', '#141414', 'long', 'dress', '#3a1f5c', '#e8c25a', '#151515', 'pose', 0.98, 0.89, 0.33),
    wear: { grid: fit('jumpsuit', '#efece6', '#e8c25a', '#efece6', ['lanyard', 'shadesUp']), night: [fit('slip', '#3a1f5c', '#e8c25a', null, ['lanyard', 'clutch']), fit('sequin', '#3a1f5c', '#e8c25a', null, ['lanyard', 'earrings'], '#e8c25a')], wet: fit('trench', '#3a3c42', '#3a1f5c', '#151515', ['lanyard']), evening: [fit('gown', '#3a1f5c', '#e8c25a', null, ['clutch']), fit('halter', '#e8c25a', '#3a1f5c', null, ['earrings']), fit('slitgown', '#3a1f5c', '#e8c25a', null, ['clutch', 'earrings'])], dinner: [fit('oneshoulder', '#18181c', '#e8c25a', null, ['earrings', 'clutch']), fit('cropset', '#3a1f5c', '#e8c25a', null, ['earrings'])], casual: fit('bomber', '#3a1f5c', '#efece6', '#151515', ['shadesUp']), sporty: fit('athleisure', '#3a1f5c', '#e8c25a', '#151515', ['watch']), home: fit('coord', '#b9a6d0', '#e8c25a', '#b9a6d0'),
      // (a model's off-duty night, violet and gold: a violet mini cut out at the hips, violet mesh over a slip, gold satin over black leather, an ivory crop and low-rise trousers)
      club: [cfit('hipcut', '#3a1f5c', '#e8c25a', null, ['earrings'], '#e8c25a', { shoe: 'sandal', shoeFinish: 'metallic' }), cfit('meshdress', '#3a1f5c', '#3a1f5c', null, ['earrings'], '#18181c'), cfit('camiskirt', '#e8c25a', '#18181c', null, ['earrings', 'bag'], '#18181c'), cfit('lowrise', '#efece6', '#e8c25a', '#efece6', ['earrings'], '#e8c25a', { jewel: { earrings: 'hoop' } })] } },
  { id: 'tessa-kealoha', name: 'Tessa Kealoha', job: 'Surfer', from: 'Oahu, Hawaii', home: 'the North Shore of Oahu', age: 28, fame: 50, often: ['lasvegas'],
    vibe: 'Easy-going and fearless; laughs at everything except the ocean',
    bio: 'Big-wave surfer from the North Shore of Oahu with two world-tour event wins. Shapes her own boards, mistrusts anything with a schedule, and says a race start looks scarier than any wave she has ridden.',
    work: ['the big-wave season', 'a surf film', 'the next world-tour event', 'a new board she shaped herself'], hobby: 'shaping surfboards in her garage',
    fav: 'beach', favLine: 'She is in the water before you have parked. You are not.', meh: 'gala', mehLine: 'She wears trainers under the gown and dares anyone to notice.',
    traits: traits(['adventurous', 'funny', 'humble'], ['showoff', 'arrogant'], 0.15, 0.45, 0.15, 0.7), look: look('#b98258', '#3a2616', 'waves', 'casual', '#2a8c99', '#f5d76e', '#3a5a80', 'hips', 0.95, 0.94, 0.29),
    wear: { grid: fit('bomber', '#2a8c99', '#f5d76e', '#3a5a80', ['lanyard', 'shades']), night: [fit('coord', '#2a8c99', '#f5d76e', '#2a8c99', ['lanyard', 'earrings']), fit('cropset', '#2a8c99', '#f5d76e', null, ['lanyard', 'earrings'])], wet: fit('trench', '#e0b43a', '#f4f4f2', '#3a5a80', ['lanyard']), evening: [fit('gown', '#2a6c99', '#f5d76e', null, ['clutch']), fit('bardot', '#f5d76e', '#2a8c99', null, ['earrings']), fit('slitgown', '#2a6c99', '#f5d76e', null, ['clutch'])], dinner: [fit('dress', '#e07a5f', '#f5d76e', null), fit('croppants', '#e07a5f', '#f5d76e', '#e07a5f', ['earrings'])], casual: fit('casual', '#2a8c99', '#f5d76e', '#3a5a80', ['shadesUp']), sporty: fit('athleisure', '#2a8c99', '#f5d76e', '#1d2a3a', ['watch']), home: fit('sweater', '#d8c7a0', '#2a8c99', '#3a5a80'),
      // (easy, sunny, never fussy: a yellow bandeau set with sandals, a teal corset crop over jeans and white trainers, a blue satin slip)
      club: [cfit('bandeauset', '#f5d76e', '#2a8c99', null, ['earrings'], '#f4f4f2', { shoe: 'sandal' }), cfit('cropjeans', '#2a8c99', '#f5d76e', '#3a5a80', ['earrings'], '#f4f4f2', { shoe: 'trainer' }), cfit('slipmini', '#2a6c99', '#f5d76e', null, ['earrings'], '#f5d76e'), cfit('onecrop', '#f5d76e', '#2a8c99', '#3a5a80', ['earrings'], '#f4f4f2', { shoe: 'sandal' })] } },
  { id: 'maya-lindqvist', name: 'Maya Lindqvist', job: 'Chef', from: 'Stockholm, Sweden', home: 'London', age: 32, fame: 45, often: ['silverstone'],
    vibe: 'Warm and honest, with no patience for pretence',
    bio: 'Swedish chef whose London restaurant earned two stars in four years. Cooks for the hospitality suites at a few races a season, grows her own herbs on the roof, and is unimpressed by anyone who leaves food on the plate.',
    work: ['the restaurant in London', 'her second cookbook', 'a pop-up kitchen at the circuit', 'the new autumn menu'], hobby: 'foraging for mushrooms',
    fav: 'cooking', favLine: 'You cook for a chef. She eats every bite and suggests more salt only twice.', meh: 'dinner', mehLine: 'She reviews every course under her breath.',
    traits: traits(['humble', 'kind', 'romantic'], ['arrogant', 'neglect'], 0.3, 0.6, 0.1), look: look('#f3d6c0', '#dcc08e', 'bun', 'casual', '#efeae1', '#3d6b4f', '#2b2f38', 'cross', 0.96, 0.94, 0.27),
    wear: { grid: fit('bomber', '#55705a', '#efeae1', '#2b2f38', ['lanyard', 'shadesUp']), night: [fit('knit', '#3d6b4f', '#efeae1', null, ['lanyard', 'earrings']), fit('bardot', '#3d6b4f', '#efeae1', null, ['lanyard', 'earrings'])], wet: fit('trench', '#6b7f62', '#efeae1', '#2b2f38', ['lanyard']), evening: [fit('gown', '#4f6f5a', '#efeae1', null, ['earrings', 'clutch']), fit('slitgown', '#4f6f5a', '#efeae1', null, ['earrings', 'clutch'])], dinner: [fit('coord', '#efeae1', '#3d6b4f', '#efeae1', ['earrings']), fit('corset', '#efeae1', '#3d6b4f', null, ['earrings'])], casual: fit('sweater', '#efeae1', '#3d6b4f', '#3a4a66'), sporty: fit('athleisure', '#3d6b4f', '#efeae1', '#2b2f38', ['watch']), home: fit('casual', '#efeae1', '#3d6b4f', '#3a4a66'),
      // (honest and classic, green and cream: a green crepe mini cut out under the bust, cream satin over a chocolate leather mini with knee boots, a cream corset over green wide trousers)
      club: [cfit('keyhole', '#3d6b4f', '#efeae1', null, ['earrings'], '#2b2f38', { fabric: 'crepe' }), cfit('camiskirt', '#efeae1', '#4a2c20', null, ['earrings'], '#4a2c20', { shoe: 'kneeboot' }), cfit('corsettop', '#efeae1', '#3d6b4f', '#3d6b4f', ['earrings'], '#efeae1'), cfit('ribcut', '#3d6b4f', '#efeae1', null, ['earrings'], '#2b2f38')] } },
  { id: 'zoe-hartley', name: 'Zoe Hartley', job: 'Racing streamer', from: 'Manchester, England', home: 'Manchester', age: 25, fame: 58, often: ['silverstone', 'lasvegas'],
    vibe: 'Fast-talking, nerdy and fiercely loyal',
    bio: 'Manchester sim racer turned streamer with the biggest motorsport channel on the platform. Knows a lap of every circuit by heart, runs her own online league, and will tell you exactly where you lost time at Stowe. Competitive about everything - including people who are not strictly available.',
    work: ['her sim-racing league', 'a twenty-four-hour charity stream', 'her onboard-reaction series', 'a karting challenge with her chat'], hobby: 'building her own sim rig, again',
    fav: 'karting', favLine: 'She has studied the track map and still calls it a fair fight. It is not.', meh: 'gallery', mehLine: 'She checks last weekend\'s sector times on her phone in every room.',
    traits: traits(['winner', 'funny', 'confident'], ['cruel', 'neglect'], 0.35, 0.15, 0.5, 0, 0.7), look: look('#f0cfb2', '#6e1f33', 'blowout', 'casual', '#1b1b1f', '#ff2d6f', '#2c3e66', 'talk', 0.93, 0.95, 0.3),
    wear: { grid: fit('bomber', '#1b1b1f', '#ff2d6f', '#2c3e66', ['lanyard', 'shades']), night: [fit('leather', '#1b1b1f', '#ff2d6f', '#1b1b1f', ['lanyard', 'earrings']), fit('bodycon', '#ff2d6f', '#1b1b1f', null, ['lanyard', 'earrings']), fit('croppants', '#1b1b1f', '#ff2d6f', '#1b1b1f', ['lanyard', 'earrings'])], wet: fit('athleisure', '#1b1b1f', '#ff2d6f', '#1b1b1f', ['lanyard']), evening: [fit('jumpsuit', '#1b1b1f', '#ff2d6f', '#1b1b1f', ['earrings']), fit('sequin', '#1b1b1f', '#ff2d6f', null, ['earrings'], '#ff2d6f'), fit('slitgown', '#d42a62', '#1b1b1f', null, ['earrings'])], dinner: [fit('blazerdress', '#d42a62', '#1b1b1f', null, ['earrings']), fit('corset', '#1b1b1f', '#ff2d6f', null, ['earrings'])], casual: fit('casual', '#1b1b1f', '#ff2d6f', '#2c3e66'), sporty: fit('athleisure', '#ff2d6f', '#1b1b1f', '#1b1b1f', ['watch']), home: fit('sweater', '#e88aa8', '#1b1b1f', '#6a6e78'),
      // (pink and black, loud and sure of it: a hot-pink cut-out mini with thigh-high boots, a black sequin halter micro-mini, a pink corset over black leather, a black blazer open over a pink bralette with knee boots)
      club: [cfit('cutoutmini', '#ff2d6f', '#1b1b1f', null, ['earrings', 'bag'], '#1b1b1f', { shoe: 'thighboot' }), cfit('haltermicro', '#1b1b1f', '#ff2d6f', null, ['earrings'], '#1b1b1f'), cfit('corsetleather', '#d42a62', '#1b1b1f', '#1b1b1f', ['earrings'], '#1b1b1f'), cfit('blazerbra', '#1b1b1f', '#ff2d6f', null, ['earrings'], '#1b1b1f', { shoe: 'kneeboot' })] } },
];
// ---- at the pool (a Las Vegas dayclub, a Miami beach club, a yacht off Monaco: People's SWIM_KITS) -----------------------
// (wear.pool: each in her own colours, as at the club - string triangles, bandeaus, balconettes, sporty scoops; cheeky,
// Brazilian and thong backs for the bolder; monokinis and one-pieces; and over them, for the bar and the cabana, a sheer
// pareo, a crochet or mesh mini, a kaftan, a man's linen shirt left open. What she swims in first: a cover-up only once
// she is out of the water. Sunglasses, a straw hat for some, a tote, a belly chain or an anklet; the kit's own slides,
// sandals or platforms)
const POOL_WEAR = {
  // (emerald and gold, a singer's curves: an emerald balconette, a wine plunge monokini with a belly chain, an ivory pareo over emerald, a white kaftan)
  'mira-vale': [cfit('balconette', '#1f4d3a', '#d4af6a', null, ['shades', 'earrings'], '#d4af6a'), cfit('monoplunge', '#6a1f2e', '#d4af6a', null, ['earrings', 'bodychain'], '#d4af6a'), cfit('pareo', '#efe6d6', '#1f4d3a', null, ['sunhat', 'tote', 'earrings'], '#d4af6a'), cfit('kaftan', '#f6f2ea', '#1f4d3a', null, ['shades', 'earrings'], '#d4af6a')],
  // (black and gold, a sprinter's: a black sporty scoop, a gold string thong bikini, a black high-cut one-piece, a gold side cut-out)
  'lena-marsh': [cfit('sportbikini', '#16161a', '#e8c25a', null, ['shades'], '#16161a'), cfit('stringbikini', '#c9a24a', '#16161a', null, ['earrings', 'anklet'], '#c9a24a'), cfit('highcut', '#16161a', '#e8c25a', null, ['shades'], '#16161a'), cfit('monoside', '#c9a24a', '#16161a', null, ['earrings'], '#16161a')],
  // (a director's black and stone, minimal: a square-necked scoop back, a stone high-cut, a white shirt open over black)
  'sasha-ivers': [cfit('scoopback', '#121316', '#c9c2b8', null, ['shades'], '#121316'), cfit('highcut', '#8f877c', '#121316', null, ['shades'], '#121316'), cfit('openshirt', '#f2f0ea', '#121316', null, ['shades', 'tote'], '#121316')],
  // (bronze and black: a bronze twist-front Brazilian on gold rings, a black laced monokini, a sand crochet mini over black, black Brazilian bottoms)
  'noor-haddad': [cfit('twistbikini', '#8a6a2a', '#141414', null, ['shades', 'bodychain', 'earrings'], '#8a6a2a'), cfit('monocross', '#141414', '#8a6a2a', null, ['earrings'], '#141414'), cfit('crochetmini', '#d8c3a0', '#141414', null, ['sunhat', 'tote'], '#8a6a2a'), cfit('brazilbikini', '#141414', '#8a6a2a', null, ['earrings', 'anklet'], '#141414')],
  // (red and cream: a red string triangle, a red ringed monokini, a black thong, black mesh over red)
  'ava-rennick': [cfit('tribikini', '#a3162b', '#f2d7a0', null, ['shades', 'earrings'], '#f2d7a0'), cfit('monoring', '#a3162b', '#f2d7a0', null, ['earrings'], '#a3162b'), cfit('stringbikini', '#151515', '#a3162b', null, ['earrings', 'anklet'], '#151515'), cfit('meshcover', '#151515', '#a3162b', null, ['shades', 'earrings'], '#151515')],
  // (teal, black and silver, behind the decks: a teal Brazilian balconette, a black plunge monokini, a silver twist bikini, black crochet over teal)
  'jade-okafor': [cfit('brazilbikini', '#1fa89c', '#1c1c20', null, ['shades', 'earrings'], '#1c1c20'), cfit('monoplunge', '#1c1c20', '#2ec4b6', null, ['earrings', 'bodychain'], '#1c1c20'), cfit('twistbikini', '#b9bcc2', '#1c1c20', null, ['earrings'], '#b9bcc2'), cfit('crochetmini', '#1c1c20', '#1fa89c', null, ['shades', 'tote'], '#1c1c20')],
  // (green and ivory, a player's: a green sporty scoop, a belted green one-piece, an ivory shirt open over green)
  'clara-voss': [cfit('sportbikini', '#1f8a52', '#f6f6f3', null, ['shades'], '#f2f0ea'), cfit('beltedsuit', '#1f6a46', '#d4af6a', null, ['earrings'], '#1f6a46'), cfit('openshirt', '#f2f0ea', '#1f8a52', null, ['shades', 'tote'], '#f2f0ea')],
  // (red, wine and gold, Italian: a belted red one-piece, a wine balconette, a black monokini cut out at the front, a white kaftan over wine)
  'elena-marchetti': [cfit('beltedsuit', '#9e1b2c', '#d4af6a', null, ['shades', 'earrings'], '#d4af6a'), cfit('balconette', '#7a1222', '#d4af6a', null, ['earrings', 'anklet'], '#d4af6a'), cfit('monofront', '#151515', '#d4af6a', null, ['earrings'], '#151515'), cfit('kaftan', '#f6f2ea', '#7a1222', null, ['sunhat', 'shades'], '#d4af6a')],
  // (purple and gold: a purple side cut-out, a gold string triangle, a purple plunge, a cream pareo over purple)
  'priya-raman': [cfit('monoside', '#3a1f5c', '#e8c25a', null, ['earrings'], '#e8c25a'), cfit('tribikini', '#c9a24a', '#3a1f5c', null, ['shades', 'earrings', 'bodychain'], '#c9a24a'), cfit('plungesuit', '#3a1f5c', '#e8c25a', null, ['earrings'], '#3a1f5c'), cfit('pareo', '#efece6', '#3a1f5c', null, ['sunhat', 'tote'], '#e8c25a')],
  // (a surfer's teal and yellow: a teal sporty scoop, a yellow bandeau, a blue high-cut, white crochet over yellow)
  'tessa-kealoha': [cfit('sportbikini', '#2a8c99', '#f5d76e', null, ['shades', 'anklet'], '#f4f4f2'), cfit('bandeaubikini', '#f5d76e', '#2a8c99', null, ['earrings'], '#f4f4f2'), cfit('highcut', '#2a6c99', '#f5d76e', null, ['shades'], '#f4f4f2'), cfit('crochetmini', '#f4f4f2', '#f5d76e', null, ['sunhat', 'tote'], '#f4f4f2')],
  // (forest green, cream and brown: a green scoop back, a chocolate bandeau, a cream shirt open over green)
  'maya-lindqvist': [cfit('scoopback', '#3d6b4f', '#efeae1', null, ['shades'], '#4a2c20'), cfit('bandeaubikini', '#4a2c20', '#efeae1', null, ['earrings'], '#4a2c20'), cfit('openshirt', '#efeae1', '#3d6b4f', null, ['shades', 'tote'], '#4a2c20')],
  // (hot pink and black: a pink string thong, a black plunge monokini, black Brazilian bottoms, black mesh over pink)
  'zoe-hartley': [cfit('stringbikini', '#ff2d6f', '#1b1b1f', null, ['shades', 'anklet', 'earrings'], '#ff2d6f'), cfit('monoplunge', '#1b1b1f', '#ff2d6f', null, ['earrings', 'bodychain'], '#1b1b1f'), cfit('brazilbikini', '#1b1b1f', '#ff2d6f', null, ['earrings'], '#ff2d6f'), cfit('meshcover', '#1b1b1f', '#ff2d6f', null, ['shades', 'earrings'], '#1b1b1f')],
};
for (const C of CELEBS) if (POOL_WEAR[C.id] && C.wear) C.wear.pool = POOL_WEAR[C.id];
// ---- lace (world/Lace.js: a corded lace laid on a lining of a contrast or a deeper shade, sheer lace sleeves and yokes,
// a Chantilly-trimmed slip, white broderie by day, guipure by the pool) - each in her own colours, added to what she
// already wears for the occasion
const LACE_WEAR = {
  // (emerald lace on gold satin for a gala, an emerald lace crop set out at night, an ivory silk cami trimmed in emerald lace)
  'mira-vale': { evening: [cfit('lacegown', '#1f4d3a', '#d4af6a', null, ['clutch', 'earrings'], '#d4af6a')], club: [cfit('laceset', '#1f4d3a', '#1f4d3a', null, ['earrings', 'bag'], '#d4af6a', { shoeFinish: 'metallic' })], casual: [cfit('lacecami', '#efe6d6', '#1f4d3a', '#3a4a66', ['shadesUp'], '#d4af6a')] },
  // (black lace boned over gold satin; ivory lace on black to the calf)
  'lena-marsh': { club: [cfit('lacebustier', '#16161a', '#e8c25a', null, ['earrings', 'bag'], '#16161a')], evening: [cfit('lacemidi', '#f2ede3', '#16161a', null, ['earrings', 'clutch'], '#16161a')] },
  // (a black lace bodysuit under her black blazer; a black satin slip trimmed in ivory Chantilly; a black silk cami, ivory lace)
  'sasha-ivers': { club: [cfit('lacebody', '#121316', '#121316', '#121316', ['earrings'], '#121316')], evening: [cfit('laceslip', '#121316', '#efece6', null, ['earrings', 'clutch'], '#121316')], dinner: [cfit('lacecami', '#121316', '#efece6', '#1b1c22', ['earrings'], '#121316')] },
  // (black guipure on bronze over black trousers; champagne lace over black to the floor; a black silk cami, sand lace)
  'noor-haddad': { club: [cfit('lacecorsetwide', '#141414', '#8a6a2a', '#141414', ['earrings', 'bag'], '#141414')], evening: [cfit('lacegown', '#e8d3a9', '#141414', null, ['earrings', 'clutch'], '#141414')], casual: [cfit('lacecami', '#141414', '#d8c3a0', '#3a4a66', ['shadesUp'], '#141414')] },
  // (red lace sleeves and yoke on a red crepe mini; red lace on a deeper red to the floor)
  'ava-rennick': { club: [cfit('lacesleeve', '#a3162b', '#f2d7a0', null, ['earrings'], '#151515')], evening: [cfit('lacegown', '#a3162b', '#a3162b', null, ['earrings', 'clutch'], '#151515')] },
  // (an ivory lace corset over black leather; white eyelet by day)
  'jade-okafor': { club: [cfit('lacecorset', '#f2ede3', '#1c1c20', '#1c1c20', ['earrings', 'bag'], '#1c1c20')], casual: [cfit('eyelet', '#f6f3ec', '#f6f3ec', null, ['shadesUp'], '#f2f0ea')] },
  // (navy lace over ivory to the calf; white eyelet)
  'clara-voss': { evening: [cfit('lacemidi', '#1b2440', '#f6f6f3', null, ['earrings', 'clutch'], '#1b2440')], casual: [cfit('eyelet', '#f6f6f3', '#f6f6f3', null, ['watch'], '#f2f0ea')] },
  // (a wine satin slip trimmed in black Chantilly; black lace over red at dinner)
  'elena-marchetti': { evening: [cfit('laceslip', '#7a1222', '#151515', null, ['earrings', 'clutch'], '#151515')], dinner: [cfit('lacemidi', '#151515', '#9e1b2c', null, ['earrings'], '#151515')] },
  // (ivory lace over plum for a gala; a black lace crop set on plum; ivory guipure over a purple bikini)
  'priya-raman': { evening: [cfit('lacegown', '#f2ede3', '#3a1f5c', null, ['earrings', 'clutch'], '#e8c25a')], club: [cfit('laceset', '#151515', '#3a1f5c', null, ['earrings'], '#151515')], pool: [cfit('lacecover', '#f2ede3', '#3a1f5c', null, ['shades', 'earrings'], '#e8c25a')] },
  // (white eyelet; white guipure over teal)
  'tessa-kealoha': { casual: [cfit('eyelet', '#f4f4f2', '#f4f4f2', null, ['shadesUp'], '#f4f4f2')], pool: [cfit('lacecover', '#f4f4f2', '#2a8c99', null, ['sunhat', 'tote'], '#f4f4f2')] },
  // (a forest satin slip trimmed in cream lace; a cream silk cami, chocolate lace, at dinner)
  'maya-lindqvist': { evening: [cfit('laceslip', '#3d6b4f', '#efeae1', null, ['earrings', 'clutch'], '#4a2c20')], dinner: [cfit('lacecami', '#efeae1', '#4a2c20', '#3a4a66', ['earrings'], '#4a2c20')] },
  // (blush lace boned over black; hot pink lace crop set on black)
  'zoe-hartley': { club: [cfit('lacebustier', '#e8b4b8', '#1b1b1f', null, ['earrings', 'bag'], '#1b1b1f'), cfit('laceset', '#ff2d6f', '#1b1b1f', null, ['earrings'], '#1b1b1f')] },
};
for (const C of CELEBS) { const X = LACE_WEAR[C.id]; if (!X || !C.wear) continue; for (const [occ, L] of Object.entries(X)) { const w = C.wear[occ]; C.wear[occ] = [...(Array.isArray(w) ? w : w ? [w] : []), ...L]; } }
// ---- crop tops, bandeaus and co-ords, by day and by night - a hot race's grid by day (Miami, Las Vegas by day, Abu
// Dhabi: wear.hot, celebLook's when the race is one - else the grid's own), a pub, a sim lounge or a coffee, a dinner, a
// club - as they are worn there: a matching set, a crop over wide or low-rise trousers, a rib bandeau or a one-shoulder
// crop with jeans and trainers, a satin twist-front set slit to the knee. Each in her own colours and her own way, added
// to what she already wears for the occasion, each with its own hair (hs)
const CROP_WEAR = {
  // (emerald and ivory: an emerald crepe twist-front set slit to the knee, an ivory off-the-shoulder crop over wide
  // trousers; a wine rib one-shoulder crop with jeans and gold sandals)
  'mira-vale': { hot: [cfit('twistset', '#1f4d3a', '#d4af6a', null, ['lanyard', 'shades', 'earrings'], '#d4af6a', { fabric: 'crepe', shoeFinish: 'metallic', hs: 'waves' }), cfit('croppants', '#efe6d6', '#d4af6a', '#efe6d6', ['lanyard', 'shadesUp', 'earrings'], '#d4af6a', { hs: 'messybun' })],
    casual: [cfit('onecrop', '#6a1f2e', '#d4af6a', '#3a4a66', ['shadesUp'], '#d4af6a', { shoe: 'sandal', shoeFinish: 'metallic', hs: 'waves' })] },
  // (a sprinter's: a white rib one-shoulder crop, jeans and white trainers; a black crop over wide low-rise trousers; a
  // black rib bandeau and jeans; at the pool a black mesh mini over a black high-cut suit)
  'lena-marsh': { hot: [cfit('onecrop', '#f4f4f2', '#e8c25a', '#2a3550', ['lanyard', 'shades'], '#f4f4f2', { shoe: 'trainer', hs: 'highpony' }), cfit('lowrise', '#16161a', '#e8c25a', '#16161a', ['lanyard', 'shades', 'earrings'], '#16161a', { fabric: 'crepe', jewel: { earrings: 'hoop', metal: 'gold' }, hs: 'highpony' })],
    casual: [cfit('cropjeans', '#16161a', '#e8c25a', '#2c3e66', ['shadesUp'], '#f4f4f2', { fabric: 'rib', shoe: 'trainer', hs: 'ponytail' })],
    pool: [cfit('meshcover', '#16161a', '#16161a', null, ['shades', 'earrings'], '#16161a', { jewel: { earrings: 'hoop', metal: 'gold' }, hs: 'highpony' })] },
  // (black and stone, spare: a black square-necked crop over wide trousers, a stone co-ord; a black rib one-shoulder
  // crop with black jeans and ankle boots by day, the same in black satin at a club)
  'sasha-ivers': { hot: [cfit('lowrise', '#121316', '#c9c2b8', '#121316', ['lanyard', 'shades'], '#121316', { fabric: 'crepe', hs: 'bob' }), cfit('coord', '#e8e4dc', '#121316', '#e8e4dc', ['lanyard', 'shades'], '#121316', { hs: 'bob' })],
    casual: [cfit('onecrop', '#121316', '#c9c2b8', '#1b1c22', [], '#121316', { shoe: 'boot', hs: 'bob' })],
    club: [cfit('onecrop', '#121316', '#c9c2b8', '#121316', ['earrings'], '#121316', { fabric: 'satin', jewel: { metal: 'silver' }, hs: 'bob' })] },
  // (a designer's bronze, black and rust: a bronze satin twist-front set, a black off-the-shoulder crop over wide
  // trousers, an ivory crop over a midi skirt; a black rib one-shoulder crop and jeans; a rust satin twist set at dinner)
  'noor-haddad': { hot: [cfit('twistset', '#8a6a2a', '#c9a44a', null, ['lanyard', 'shades', 'earrings'], '#8a6a2a', { fabric: 'satin', shoeFinish: 'metallic', hs: 'blowout' }), cfit('croppants', '#141414', '#c9a44a', '#141414', ['lanyard', 'shadesUp', 'earrings'], '#141414', { hs: 'highpony' }), cfit('cropset', '#efe6d6', '#8a6a2a', null, ['lanyard', 'shades'], '#8a6a2a', { fabric: 'crepe', hs: 'topknot' })],
    casual: [cfit('onecrop', '#141414', '#8a6a2a', '#3a4a66', ['shadesUp'], '#8a6a2a', { shoe: 'sandal', hs: 'long' })],
    dinner: [cfit('twistset', '#a0522d', '#c9a44a', null, ['earrings', 'clutch'], '#8a6a2a', { fabric: 'satin', shoeFinish: 'metallic', hs: 'blowout' })] },
  // (red and black, for the cameras: a red tie-front crop and mini with sandals, a black rib bandeau and jeans; a red
  // one-shoulder crop and jeans; a red satin twist set at dinner)
  'ava-rennick': { hot: [cfit('tieset', '#a3162b', '#f2d7a0', null, ['lanyard', 'shades', 'earrings'], '#f2d7a0', { shoe: 'sandal', shoeFinish: 'metallic', hs: 'highpony' }), cfit('cropjeans', '#151515', '#a3162b', '#3a4a66', ['lanyard', 'shadesUp', 'earrings'], '#a3162b', { fabric: 'rib', shoe: 'sandal', hs: 'blowout' })],
    casual: [cfit('onecrop', '#a3162b', '#f2d7a0', '#3a4a66', ['shadesUp'], '#f4f4f2', { shoe: 'trainer', hs: 'waves' })],
    dinner: [cfit('twistset', '#a3162b', '#f2d7a0', null, ['earrings', 'clutch'], '#151515', { fabric: 'satin', hs: 'blowout' })] },
  // (teal and black: a teal crepe bandeau set with white trainers, a black rib one-shoulder crop and jeans; a black rib
  // bandeau and jeans; a black satin crop over wide trousers at dinner)
  'jade-okafor': { hot: [cfit('bandeauset', '#2ec4b6', '#1c1c20', null, ['lanyard', 'shades', 'earrings'], '#f4f4f2', { fabric: 'crepe', shoe: 'trainer', jewel: { earrings: 'hoop' }, hs: 'highpony' }), cfit('onecrop', '#1c1c20', '#2ec4b6', '#2c3e66', ['lanyard', 'shadesUp', 'earrings'], '#1c1c20', { shoe: 'sandal', jewel: { earrings: 'hoop' }, hs: 'curlyLong' })],
    casual: [cfit('cropjeans', '#1c1c20', '#2ec4b6', '#2c3e66', ['shadesUp', 'earrings'], '#f4f4f2', { fabric: 'rib', shoe: 'trainer', jewel: { earrings: 'hoop' }, hs: 'curlybun' })],
    dinner: [cfit('lowrise', '#1c1c20', '#2ec4b6', '#1c1c20', ['earrings'], '#1c1c20', { fabric: 'satin', jewel: { earrings: 'hoop' }, hs: 'curlyLong' })] },
  // (green and white: a white crop over a midi skirt, a green tie-front set with white sandals; a white rib one-shoulder
  // crop, jeans and trainers)
  'clara-voss': { hot: [cfit('cropset', '#f6f6f3', '#1f8a52', null, ['lanyard', 'shades', 'watch'], '#f2f0ea', { fabric: 'crepe', hs: 'highpony' }), cfit('tieset', '#1f6a46', '#f6f6f3', null, ['lanyard', 'shades', 'watch'], '#f2f0ea', { shoe: 'sandal', hs: 'ponytail' })],
    casual: [cfit('onecrop', '#f6f6f3', '#1f8a52', '#33456b', ['watch'], '#f2f0ea', { shoe: 'trainer', hs: 'ponytail' })] },
  // (Milanese: a red satin twist-front set with gold sandals, an ivory off-the-shoulder crop over wide trousers; a
  // burgundy crop over wide low-rise trousers, the two one colour; a black off-the-shoulder crop set at dinner)
  'elena-marchetti': { hot: [cfit('twistset', '#9e1b2c', '#d4af6a', null, ['lanyard', 'shades', 'earrings'], '#d4af6a', { fabric: 'satin', shoe: 'sandal', shoeFinish: 'metallic', hs: 'blowout' }), cfit('croppants', '#f4efe6', '#d4af6a', '#f4efe6', ['lanyard', 'shadesUp', 'earrings'], '#d4af6a', { hs: 'topknot' })],
    casual: [cfit('lowrise', '#7a1222', '#d4af6a', '#7a1222', ['shadesUp'], '#d4af6a', { fabric: 'crepe', hs: 'blowout' })],
    dinner: [cfit('croppants', '#151515', '#d4af6a', '#151515', ['earrings', 'clutch'], '#151515', { fabric: 'satin', hs: 'topknot' })] },
  // (violet, ivory and gold: an ivory crop over wide low-rise trousers, a violet tie-front set with gold sandals; a violet
  // rib one-shoulder crop, black jeans and trainers)
  'priya-raman': { hot: [cfit('lowrise', '#efece6', '#e8c25a', '#efece6', ['lanyard', 'shades', 'earrings'], '#e8c25a', { fabric: 'crepe', jewel: { earrings: 'hoop' }, hs: 'long' }), cfit('tieset', '#3a1f5c', '#e8c25a', null, ['lanyard', 'shades', 'earrings'], '#e8c25a', { shoe: 'sandal', shoeFinish: 'metallic', hs: 'highpony' })],
    casual: [cfit('onecrop', '#3a1f5c', '#e8c25a', '#151515', ['shadesUp'], '#f4f4f2', { shoe: 'trainer', hs: 'long' })] },
  // (sunny: a yellow rib bandeau, jeans and white trainers, a white tie-front set with sandals; a teal rib one-shoulder
  // crop and jeans)
  'tessa-kealoha': { hot: [cfit('cropjeans', '#f5d76e', '#2a8c99', '#3a5a80', ['lanyard', 'shades'], '#f4f4f2', { fabric: 'rib', shoe: 'trainer', hs: 'waves' }), cfit('tieset', '#f4f4f2', '#2a8c99', null, ['lanyard', 'shades', 'earrings'], '#f4f4f2', { shoe: 'sandal', hs: 'messybun' })],
    casual: [cfit('onecrop', '#2a8c99', '#f5d76e', '#3a5a80', ['shadesUp'], '#f4f4f2', { shoe: 'trainer', hs: 'waves' })] },
  // (green, cream and chocolate: a cream crop over a midi skirt, a green crop over wide low-rise trousers; a chocolate rib
  // one-shoulder crop and jeans; a green tie-front set at a club, chocolate heels)
  'maya-lindqvist': { hot: [cfit('cropset', '#efeae1', '#3d6b4f', null, ['lanyard', 'shadesUp'], '#4a2c20', { fabric: 'crepe', hs: 'bun' }), cfit('lowrise', '#3d6b4f', '#efeae1', '#3d6b4f', ['lanyard', 'shades'], '#4a2c20', { fabric: 'crepe', hs: 'messybun' })],
    casual: [cfit('onecrop', '#4a2c20', '#efeae1', '#3a4a66', [], '#4a2c20', { shoe: 'sandal', hs: 'messybun' })],
    club: [cfit('tieset', '#3d6b4f', '#efeae1', null, ['earrings'], '#4a2c20', { hs: 'messybun' })] },
  // (pink and black, loud: a hot-pink rib bandeau, jeans and white trainers, a black tie-front set; a pink one-shoulder
  // crop and black jeans; a black satin twist set at dinner)
  'zoe-hartley': { hot: [cfit('cropjeans', '#ff2d6f', '#1b1b1f', '#2c3e66', ['lanyard', 'shades'], '#f4f4f2', { fabric: 'rib', shoe: 'trainer', hs: 'highpony' }), cfit('tieset', '#1b1b1f', '#ff2d6f', null, ['lanyard', 'shades', 'earrings'], '#ff2d6f', { shoe: 'sandal', hs: 'blowout' })],
    casual: [cfit('onecrop', '#ff2d6f', '#1b1b1f', '#1b1b1f', ['shadesUp'], '#f4f4f2', { shoe: 'trainer', hs: 'highpony' })],
    dinner: [cfit('twistset', '#1b1b1f', '#ff2d6f', null, ['earrings'], '#1b1b1f', { fabric: 'satin', hs: 'blowout' })] },
};
for (const C of CELEBS) { const X = CROP_WEAR[C.id]; if (!X || !C.wear) continue; for (const [occ, L] of Object.entries(X)) { const w = C.wear[occ]; C.wear[occ] = [...(Array.isArray(w) ? w : w ? [w] : []), ...L]; } }
export const CELEB =Object.fromEntries(CELEBS.map((x) => [x.id, x]));
export const STAGES = ['stranger', 'met', 'friendly', 'flirting', 'dating', 'partner', 'ex'];
const STAGE_LABEL = { stranger: 'Not met', met: 'Just met', friendly: 'Friendly', flirting: 'Flirting', dating: 'Dating', partner: 'Partner', ex: 'Ex' };
const SI = (st) => STAGES.indexOf(st);
// (the stages at which you are together)
const TOGETHER = ['dating', 'partner'];
/** you are in something with her: together, or she said yes to a date you have not had yet (never one in mourning) */
const involved = (b) => !!b && !b.grieving && (TOGETHER.includes(b.stage) || (!!b.accepted && b.stage !== 'ex'));

// ---- the career around her: now, the round, your driver, the week's mood ---------------------------------------------
/** a stamp for now: the race the career is at (after a race, the next one) */
const now = (c) => ({ season: c.season, round: c.round });
const rk = (c) => `${c.season}|${c.round}`;
/** rounds since a stamp ({ season, round } or a 'season|round' key) -> n (99 for never) */
const ago = (c, at) => {
  if (!at) return 99;
  if (typeof at === 'string') { const [s, r] = at.split('|').map(Number); at = { season: s, round: r }; }
  return (c.season - at.season) * (c.rounds || 6) + (c.round - at.round);
};
const meOf = (c) => c?.drivers?.[c.playerId] || null;
/** your driver is out hurt (an injury lay-off, not a ban) */
const hurt = (c) => { const d = meOf(c); return !!d && d.outUntil != null && d.outUntil >= c.round; };
/** at the round's end: your driver sat the race just run out hurt (or is still out) */
const satOut = (c) => { const d = meOf(c); return !!d && ((d.outUntil != null && d.outUntil >= c.round - 1) || d.returnRound === c.round); };
const banned = (c) => { const b = meOf(c)?.ban; return !!b && b.season === c.season && b.round === c.round; };
/** a grave week: the race just run brought an injury or a death or was abandoned (the career's PR context), or the paddock has just lost someone */
const grave = (c) => !!c.pr?.ctx?.grave || (c.lost || []).some((l) => ago(c, l) <= 0);
const trackOf = (c) => (c.calendar?.length ? c.calendar[(c.round - 1) % c.calendar.length] : null);
/** your finishing position last time out (99: none yet, or a retirement) */
const lastPos = (c) => { const L = c.log, r = L && L.length ? L[L.length - 1].you : null; return r == null ? 99 : r; };
const moodNow = (c) => {
  try { const d = meOf(c); if (d) return moodOf(d); } catch (e) { /* (a driver from before morale: neutral) */ }
  return { morale: 60, focus: 60, racecraft: 60, confidence: 60, composure: 60 };
};
// (the PR and morale engines are their own modules: a hiccup there never breaks a date or a message)
const pr = (c, kind, data) => { try { return c.pr ? prEvent(c, kind, data) : null; } catch (e) { console.warn('Celebs: PR event failed', kind, e); return null; } };
const crisis = (c, kind, data) => { try { return c.pr ? crisisFrom(c, kind, data) : null; } catch (e) { console.warn('Celebs: crisis failed', kind, e); return null; } };
const mood = (c, v, why, stat = null) => { try { return v ? shiftMorale(c, c.playerId, v, why, stat) : 0; } catch (e) { console.warn('Celebs: morale failed', e); return 0; } };
/** a line in the personal log (newest first, 30 kept) */
const note = (c, id, text, tone = 0) => { const s = c.celebs; if (!s || !text) return; s.log = s.log || []; s.log.unshift({ season: c.season, round: c.round, id, text, tone }); s.log.length = Math.min(s.log.length, 30); };
/** a line's tokens: {her} her first name, {work} what she is busy with, {hobby}, and any of x */
const fill = (s, C, x = {}) => s.replace(/\{(\w+)\}/g, (m, k) => (k === 'her' ? first(C.name) : k === 'work' ? pick(C.work) : k === 'hobby' ? C.hobby : x[k] ?? m));
/** first names in a sentence: 'Ava' / 'Ava and Zoe' / 'Ava, Zoe and Lena' */
const listOf = (ids) => { const n = ids.map((k) => first(CELEB[k]?.name)).filter(Boolean); return n.length > 1 ? `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : n[0] || 'someone'; };
/**
 * Morale from the week between rounds, inside THE WEEK's caps (morale +6 and each mood +8 over a week, kept by Agenda.js
 * in c.week.gain - read here as plain JSON, so an evening played in 3D counts against the same week); losses are never
 * capped -> applied
 */
const weekMood = (c, v, why, stat = null) => {
  v = Math.round(v); if (!v) return 0;
  const w = c.week && c.week.season === c.season && c.week.round === c.round ? c.week : null;
  if (v < 0 || !w) return mood(c, v, why, stat);
  w.gain = w.gain || {}; const k = stat || 'morale', a = Math.min(v, Math.max(0, (stat ? 8 : 6) - (w.gain[k] || 0))); if (a <= 0) return 0;
  const got = mood(c, a, why, stat); w.gain[k] = (w.gain[k] || 0) + Math.max(0, got); return got;
};

// ---- where you stand with each of them (c.celebs) --------------------------------------------------------------------
/**
 * A bond: aff (affection, -100..100), trust (0..100), stage (STAGES), since (when you started seeing each other), last
 * (the last time you saw her: a date, a talk on the grid, a race she came to watch), dates, public, upset (0..3: a
 * warning at 2, at 3 she ends it), invited (the race she is coming to), msgRound ('season|round' of your last message),
 * flirts, accepted (she said yes to a date you have not had yet), refused (when she last said no), metAt, talks, exAt,
 * idle (rounds without seeing you), photos (times the two of you were photographed), grieving (she lost someone close:
 * your previous driver). Several at once: public (the world knows: official, or the papers have you together), secret
 * (you are keeping it quiet), exclusive (as your partner she expects to be the only one - unless she is a free spirit),
 * suspicion (0..100: how sure she is there is someone else), evidence (0..100: how hard it would be to explain away),
 * susOf (who she suspects), susSrc / susAt (what last gave you away, and when), hintAt (her last hint), knows (the others
 * she knows about and accepted), confronted, caught (times), begged (times you begged her to stay)
 */
const newBond = () => ({ aff: 0, trust: 30, stage: 'stranger', since: null, last: null, dates: 0, public: false, upset: 0, invited: null, msgRound: null, flirts: 0,
  accepted: null, refused: null, metAt: null, talks: 0, talkRound: null, exAt: null, idle: 0, ultimatum: false, photos: 0, official: null, lastDate: null,
  jealousRound: null, invRound: null, grieving: false, griefSeason: null,
  secret: false, exclusive: false, suspicion: 0, evidence: 0, susOf: [], susSrc: null, susAt: null, hintAt: null, knows: [], confronted: null, caught: 0, begged: 0 });
/** your public partner (made official, the two of you in the open) among the bonds -> id | null */
const publicPartner = (s) => Object.keys(s.bonds).find((id) => CELEB[id] && s.bonds[id].stage === 'partner' && s.bonds[id].public && !s.bonds[id].grieving) || null;
/** a new career's c.celebs (exp: the evidence already counted this round) */
export function celebState() { return { bonds: {}, partner: null, met: [], log: [], eyes: null, confront: null, exp: null }; }
/** an older save's c.celebs, filled in (unknown celebrities dropped; a partner from before secrets expects to be the only one, unless she is a free spirit) -> c.celebs */
export function celebEnsure(c) {
  const s = c.celebs && typeof c.celebs === 'object' ? c.celebs : (c.celebs = celebState());
  s.bonds = s.bonds && typeof s.bonds === 'object' ? s.bonds : {}; s.met = Array.isArray(s.met) ? s.met.filter((id) => CELEB[id]) : [];
  s.log = Array.isArray(s.log) ? s.log.slice(0, 30) : []; if (s.eyes === undefined) s.eyes = null; if (s.exp === undefined) s.exp = null;
  for (const id of Object.keys(s.bonds)) {
    if (!CELEB[id]) { console.warn('Celebs: dropping an unknown celebrity', id); delete s.bonds[id]; continue; }
    const o = s.bonds[id] || {}, b = s.bonds[id] = { ...newBond(), ...o };
    if (o.exclusive === undefined && b.stage === 'partner') b.exclusive = (CELEB[id].traits.free || 0) < 0.5;
    for (const k of ['susOf', 'knows']) b[k] = Array.isArray(b[k]) ? b[k].filter((x) => CELEB[x] && x !== id) : [];
  }
  const cf = s.confront;
  if (!cf || typeof cf !== 'object' || !CELEB[cf.id] || !Array.isArray(cf.options) || !s.bonds[cf.id]) s.confront = null;
  else cf.otherIds = Array.isArray(cf.otherIds) ? cf.otherIds.filter((x) => CELEB[x]) : [];
  if (s.partner && !(s.bonds[s.partner]?.stage === 'partner' && s.bonds[s.partner].public)) s.partner = null;
  if (!s.partner) s.partner = publicPartner(s);
  // (her looks as the two of you planned them (career/Style.js): checked, and kept only for someone the game knows - her
  // own hair, so a style her hair cannot do is dropped)
  styleEnsure(s, (id) => (CELEB[id] ? CELEB[id].look?.hs || 'long' : ''));
  return s;
}
/** your bond with her (a stranger's, made on first sight; a quick race or an unknown id gets a loose one, not kept) -> bond */
export function bondOf(c, id) {
  if (!c || !CELEB[id]) return newBond();
  const s = c.celebs?.bonds ? c.celebs : celebEnsure(c);
  return s.bonds[id] || (s.bonds[id] = newBond());
}
/** 'Just met' / 'Friendly' / 'Flirting' / 'Dating' / 'Partner' / 'Ex' */
export function stageLabel(stage) { return STAGE_LABEL[stage] || 'Not met'; }
/** the stage as the personal tab shows it: a celebrity in mourning, one who wants to talk, a date she agreed to, an upset partner, a relationship kept quiet */
export function bondLabel(c, id) {
  const b = bondOf(c, id);
  if (b.grieving && c && b.griefSeason === c.season) return 'In mourning';
  if (c?.celebs?.confront?.id === id) return 'Wants to talk';
  if (b.accepted) return 'Said yes to a date';
  const tail = TOGETHER.includes(b.stage) ? `${b.upset >= 2 ? ' · upset' : ''}${b.secret ? ' · secret' : ''}` : '';
  return stageLabel(b.stage) + tail;
}
/** where you are likely to see her: 'Often at Las Vegas' / 'At most races' */
export function oftenText(celeb) {
  const C = typeof celeb === 'string' ? CELEB[celeb] : celeb; if (!C) return '';
  return C.often.length > 1 ? 'At most races' : `Often at ${TRACK[C.often[0]] || C.often[0]}`;
}
/** the one you are most openly with: your public partner, else your first other partner, else whoever you are dating -> id | null */
export function datingWith(c) {
  const s = c?.celebs; if (!s?.bonds) return null;
  if (s.partner && s.bonds[s.partner]?.stage === 'partner' && !s.bonds[s.partner].grieving) return s.partner;
  const L = seeing(c); return L.find((id) => s.bonds[id].stage === 'partner') || L[0] || null;
}
/** everyone you are seeing (dating, or a partner - public or not; never one in mourning) -> [ids] */
export function seeing(c) {
  const s = c?.celebs; if (!s?.bonds) return [];
  return Object.keys(s.bonds).filter((id) => CELEB[id] && TOGETHER.includes(s.bonds[id].stage) && !s.bonds[id].grieving);
}
/** your partners (made official - in public, or between the two of you) -> [ids] */
export function partners(c) { return seeing(c).filter((id) => c.celebs.bonds[id].stage === 'partner'); }

// ---- her looks, planned together (career/Style.js; the hub's LIFE › Style page) ----------------------------------------
/** her planned looks are worn: you are together (dating or partners) and she is not in mourning */
export function styleOn(c, id) { const b = c?.celebs?.bonds?.[id]; return !!CELEB[id] && !!b && TOGETHER.includes(b.stage) && !b.grieving; }
/** why her looks cannot be planned just now -> '' (they can) | the reason: only someone you are seeing; never in a grave week */
export function canStyle(c, id) {
  const b = c?.celebs?.bonds?.[id];
  if (!CELEB[id] || !b || !TOGETHER.includes(b.stage)) return 'Only someone you are seeing';
  if (b.grieving) return 'She has asked for privacy';
  if (grave(c)) return 'Not this week';
  return '';
}
/** the colour for her avatar: the colour of the look you planned for her, else her own -> hex */
export function styledColor(c, id) { const C = CELEB[id]; if (!C) return null; return (styleOn(c, id) && lookColor(c.celebs.style?.by?.[id])) || C.look?.outfit || null; }
/**
 * celebLook with her planned looks over it (career c; none - a quick race - or someone you are not seeing: celebLook as
 * it is): the hair colour and tones always, the make-up of the moment, and the occasion's hair and clothes (a look to
 * "mix into her rotation" (pin false) worn one event in as many as she has outfits for it, plus one; the same all event)
 */
export function styledLook(c, celeb, o = {}) {
  const base = celebLook(celeb, o);
  try {
    const C = typeof celeb === 'string' ? CELEB[celeb] : celeb, rec = C && c && styleOn(c, C.id) ? c.celebs.style?.by?.[C.id] : null;
    if (!rec) return base;
    const occ = o.occasion || 'grid', night = o.night ?? (o.track ? o.track === 'lasvegas' : false);
    const ov = resolveRec(rec, { occ, night, wet: !!o.wet }); if (!ov) return base;
    // (at the pool, a cut planned for it only where it can be worn: no cover-up in the water, no bare swimwear for a pool
    // night on a roof - there her own)
    if (ov.wear?.kit && occ === 'pool' && (o.water || o.cover) && POOL_COVER.has(ov.wear.kit) !== (!!o.cover && !o.water)) ov.wear = null;
    if (ov.wear && !ov.pin) {
      const L = poolOnly(wearFor(C.wear || {}, occ, o, night), occ, o), n = Array.isArray(L) ? L.length : 1;
      let h = 7; for (const ch of `${C.id}|${occ}|${o.vary ?? 0}|style`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      if (h % (n + 1)) ov.wear = null;
    }
    const out = applyStyle(base, ov, { baseHs: C.look?.hs });
    if (occ === 'pool' && o.water) out.shoe = 'bare';
    return out;
  } catch (e) { console.warn('Celebs: her planned look could not be applied', e); return base; }
}
/**
 * Her look as the two of you planned it on an evening out (the evening's result, s: { id, rec } - rec null: all her own
 * again): kept in place of what was there, checked as a save is; never in a grave week, never for someone you are not
 * seeing -> kept
 */
export function styleFromEvening(c, s) {
  if (!c?.celebs || !s || !CELEB[s.id] || canStyle(c, s.id)) return false;
  const tmp = { style: { v: 1, by: s.rec && typeof s.rec === 'object' ? { [s.id]: JSON.parse(JSON.stringify(s.rec)) } : {} } };
  styleEnsure(tmp, (id) => (CELEB[id] ? CELEB[id].look?.hs || 'long' : ''));
  if (!c.celebs.style || typeof c.celebs.style !== 'object') c.celebs.style = { v: 1, by: {} };
  if (!c.celebs.style.by) c.celebs.style.by = {};
  if (tmp.style.by[s.id]) c.celebs.style.by[s.id] = tmp.style.by[s.id]; else delete c.celebs.style.by[s.id];
  return true;
}
/** how a relationship stands with the world: 'public' (it is known), 'secret' (you keep it quiet) or 'quiet' (neither hidden nor announced) */
export function secrecyOf(c, id) { const b = bondOf(c, id); return b.public ? 'public' : b.secret ? 'secret' : 'quiet'; }
/** her trust in you, moved (0..100) -> applied */
export function trustCeleb(c, id, delta) {
  if (!c || !CELEB[id]) return 0;
  const b = bondOf(c, id), v0 = b.trust; b.trust = clamp(Math.round(v0 + delta), 0, 100); return b.trust - v0;
}
/** the stage follows affection: friends at 15, a spark at 30 with a flirt; a spark that cools falls back (dating and on are left to dates, words and break-ups) */
const restage = (c, id, b) => {
  const f = first(CELEB[id].name), was = b.stage;
  if (b.stage === 'met' && b.aff >= 15) b.stage = 'friendly';
  if (b.stage === 'friendly' && b.aff >= 30 && b.flirts > 0 && !b.grieving) b.stage = 'flirting';
  if (b.stage === 'ex' && ago(c, b.exAt) >= 4 && b.aff >= 30 && b.flirts > 0 && !b.grieving) b.stage = 'flirting';
  if (b.stage === 'flirting' && b.aff < 18 && !b.accepted) b.stage = 'friendly';
  if (b.stage === 'friendly' && b.aff < 5) b.stage = 'met';
  if (b.stage === was) return;
  const up = SI(b.stage) > SI(was) || was === 'ex';
  note(c, id, b.stage === 'friendly' ? (up ? `${f} counts you as a friend now.` : `The spark with ${f} has faded.`) : b.stage === 'flirting' ? (was === 'ex' ? `A second chance with ${f}?` : `There is a spark with ${f}.`) : `${f} has cooled on you.`, up ? 1 : -1);
};
/** her affection for you, moved (clamped; an ex stays at 10 or below for four rounds; the stage follows); why goes to the log -> applied */
export function relateCeleb(c, id, delta, why = '') {
  if (!c || !CELEB[id]) return 0;
  const b = bondOf(c, id), v0 = b.aff;
  let v = clamp(Math.round(v0 + (delta || 0)), -100, 100);
  if (b.stage === 'ex' && ago(c, b.exAt) < 4) v = Math.min(v, 10);
  b.aff = v; restage(c, id, b);
  if (why && v !== v0) note(c, id, why.endsWith('.') ? why : why + '.', v > v0 ? 1 : -1);
  return v - v0;
}

// ---- on the grid: meeting her, how a line lands, a flirt -------------------------------------------------------------
/** a conversation on the grid: the first one introduces you (affection +5); every one counts as seeing her this round -> bond */
export function meet(c, id) {
  const b = bondOf(c, id); if (!c || !CELEB[id]) return b;
  const C = CELEB[id], tr = trackOf(c);
  if (b.stage === 'stranger') {
    b.stage = 'met'; b.metAt = now(c); if (!c.celebs.met.includes(id)) c.celebs.met.push(id);
    note(c, id, `Met ${C.name} (${C.job.toLowerCase()}) on the grid${TRACK[tr] ? ` at ${TRACK[tr]}` : ''}.`, 1);
    relateCeleb(c, id, 5);
  }
  if (b.talkRound !== rk(c)) { b.talkRound = rk(c); b.talks++; }
  b.last = now(c); b.idle = 0;
  return b;
}
// (the walk's tones as she hears them: firm is confidence, sorry humility, light humour, show showing off)
const TONE_TRAIT = { kind: 'kind', firm: 'confident', sorry: 'humble', light: 'funny', flirt: 'romantic', show: 'showoff', cruel: 'cruel' };
const TONE_BASE = { kind: 5, firm: 4, light: 5, sorry: 3, flirt: 4, show: 0, cruel: -7, cold: -3, gossip: -1, leave: -1 };
const TONE_GRIEF = { kind: 3, sorry: 3, light: 0, firm: 0, cold: -2, gossip: -3, leave: 0, flirt: -6, show: -4, cruel: -9 };
/**
 * How a line on the grid lands with her: the walk's tone (kind, firm, light, cold, cruel, sorry, gossip, leave, flirt,
 * show) against what she likes and dislikes, the stage you are at and whether you are seeing someone else -> an
 * affection delta (-10..+8). Nothing is applied: relateCeleb (or talkTo) does that
 */
export function talkEffect(c, id, tone) {
  const C = CELEB[id]; if (!C) return 0;
  const b = c ? bondOf(c, id) : newBond(), T = C.traits, t = TONE_TRAIT[tone];
  if (b.grieving) return TONE_GRIEF[tone] ?? 0;
  let v = TONE_BASE[tone] ?? 0;
  if (t && T.likes.includes(t)) v += 3;
  if (t && T.dislikes.includes(t)) v -= 6;
  if (tone === 'show') v += (T.likes.includes('adventurous') ? 2 : 0) - (T.dislikes.includes('arrogant') ? 2 : 0);
  if (tone === 'firm' && T.dislikes.includes('arrogant')) v -= 1;
  if (tone === 'firm' && T.likes.includes('winner') && c && lastPos(c) <= 3) v += 2;   // (confidence with a podium behind it)
  if (tone === 'gossip' && T.dislikes.includes('cruel')) v -= 2;
  if (tone === 'flirt') {
    if (SI(b.stage) <= 1 && !T.likes.includes('confident')) v -= 2;   // (a bit forward for someone you have only just met)
    if (b.stage === 'dating' || b.stage === 'partner') v += 1;
    // (she knows you are with someone - in public, or because you told her - and a free spirit minds less; one who likes trouble likes it more)
    const taken = c ? seeing(c).some((k) => k !== id && (c.celebs.bonds[k].public || b.knows.includes(k))) : false;
    if (taken) v += T.wreck ? Math.round(2 * T.wreck) : -Math.round((T.dislikes.includes('scandal') ? 5 : 3) * (1 - 0.7 * (T.free || 0)));
    if (b.stage === 'ex' && ago(c, b.exAt) < 4) v = -2;
  }
  if (b.upset >= 2 && (tone === 'kind' || tone === 'sorry')) v += 1;
  return clamp(Math.round(v), -10, 8);
}
/** a flirt (the walk's fx 'flirt'): counted - with enough warmth it becomes a spark -> the stage */
export function flirt(c, id) {
  if (!c || !CELEB[id]) return 'stranger';
  const b = bondOf(c, id); if (b.grieving) return b.stage;
  b.flirts++; restage(c, id, b); return b.stage;
}
/** the walk's fx 'charm': a well-judged moment (affection +3, trust +2) -> applied affection */
export function charm(c, id) { if (!c || !CELEB[id]) return 0; trustCeleb(c, id, 2); return relateCeleb(c, id, 3); }
/**
 * A whole conversation on the grid, in one call: meet (the introduction, the contact), each line's talkEffect (the
 * first in full, the rest at half, +8 at most for one conversation), a flirt counted if one was in it -> { delta, stage,
 * was, met: true for a first meeting }
 */
export function talkTo(c, id, tones = []) {
  const C = CELEB[id], b = bondOf(c, id), was = b.stage; if (!c || !C) return { delta: 0, stage: was, was, met: false };
  const intro = was === 'stranger', f = first(C.name); meet(c, id);
  let d = 0; tones.forEach((t, i) => { d += talkEffect(c, id, t) * (i ? 0.5 : 1); });
  if (tones.includes('flirt')) flirt(c, id);
  d = clamp(Math.round(d), -12, 8);
  const got = relateCeleb(c, id, d, d >= 5 ? `A good talk with ${f} on the grid` : d <= -5 ? `${f} did not enjoy that conversation` : '');
  return { delta: got, stage: b.stage, was, met: intro };
}

// ---- asking her out --------------------------------------------------------------------------------------------------
// (how many you can keep going at once - seeing, or with a date to arrange - before the diary gives out)
const MAX_TOGETHER = 4;
/** why you cannot ask her out now -> a reason, or null when you can */
export function askOutWhy(c, id) {
  const C = CELEB[id]; if (!c || !C) return 'Not here';
  const b = bondOf(c, id), f = first(C.name), me = meOf(c), s = c.celebs;
  if (!me || !me.alive) return 'Choose your driver first';
  if (b.grieving) return 'Not now';
  if (b.accepted) return `${f} already said yes: arrange the date`;
  if (b.stage === 'dating' || b.stage === 'partner') return `You are already seeing ${f}`;
  if (b.stage !== 'flirting') return `Get to know ${f} better first`;
  if (ago(c, b.refused) < 2) return `${f} said not yet: give it time`;
  if (grave(c)) return 'Not this week';
  if (Object.keys(s.bonds).filter((k) => k !== id && involved(s.bonds[k])).length >= MAX_TOGETHER) return 'Your diary is full as it is';
  return null;
}
/** whether she can be asked out now (flirting, not straight after a no; seeing someone else does not stop you) */
export function canAskOut(c, id) { return !askOutWhy(c, id); }
const YES = ['{her} smiles. "After the race. You pick the place."', '"I was starting to think you would never ask." {her} is free once {work} lets her go.',
  '{her} laughs. "Go on, then. Somewhere without cameras, if you can manage it."'];
const YES_TRAIT = { romantic: '"I was hoping you would ask," says {her}.', winner: '"Win this weekend and I will let you pay," says {her}.', funny: '{her} pretends to check her diary for a long time. "Fine. Yes."' };
const NO = ['{her} is flattered, but {work} has her for the next month. "Ask me again some time."', '"Not yet," says {her}. "Let me get to know you a bit better first."',
  '{her} lets you down gently: "You are sweet. But not right now."'];
// (when the whole world knows you are with someone else)
const YES_TAKEN = ['{her} looks at you for a long moment. "You are with {partner}." A pause. "Somewhere quiet, then."', '"Everyone knows about you and {partner}," says {her}. "So it would have to be our secret." She does not say no.'];
// (one who likes trouble, when you are taken)
const YES_WRECK = ['"{partner}?" {her} smiles. "She does not have to know. Yet."', '{her} looks pleased with herself. "Somewhere {partner} would never think to look, then."',
  '"I wondered how long it would take you," says {her}. "Do not tell {partner}. I will."'];
const NO_TAKEN = ['"You are with {partner}," says {her}, kindly enough. "Ask me when you are not."', '{her} laughs, not unkindly. "Does {partner} know you are asking?"'];
/**
 * Ask her out: the chance comes from her affection and trust, your fame against hers, your public image, your
 * confidence and what she likes (a winner, confidence, humility; not arrogance, not scandal) - and whether the world
 * knows you are with someone else (a free spirit minds less). Yes: a date to arrange in THE WEEK (it makes you a
 * couple). No: affection -3 and not again for two rounds -> { ok, text }
 */
export function askOut(c, id) {
  const why = askOutWhy(c, id); if (why) return { ok: false, text: `${why}.` };
  const C = CELEB[id], b = bondOf(c, id), T = C.traits, f = first(C.name), m = moodNow(c), P = c.pr || {}, ps = P.persona || {};
  const taken = seeing(c).find((k) => k !== id && (c.celebs.bonds[k].public || b.knows.includes(k))) || null, pn = taken ? first(CELEB[taken].name) : '';
  let p = 0.22 + clamp(b.aff, 0, 100) / 100 * 0.6 + (b.trust - 30) / 100 * 0.3 + clamp((fameIndex(P.fame ?? 0.4) - C.fame) / 200, -0.15, 0.1) + clamp(P.image ?? 10, -100, 100) / 1000;
  p += (m.confidence - 50) / 50 * 0.05;
  if (T.dislikes.includes('scandal') && (P.heat || 0) > 50) p -= 0.1;
  if (T.likes.includes('winner') && lastPos(c) <= 3) p += 0.08;
  if (T.likes.includes('confident') && m.confidence >= 65) p += 0.05;
  if (T.likes.includes('humble') && (ps.humble || 0) > (ps.showman || 0) + (ps.controversial || 0)) p += 0.05;
  if (T.dislikes.includes('arrogant') && (ps.showman || 0) + (ps.controversial || 0) > (ps.humble || 0) + 3) p -= 0.06;
  if (taken) p += T.wreck ? 0.12 * T.wreck : -(0.22 * (1 - (T.free || 0)) + (T.dislikes.includes('scandal') ? 0.12 : 0));
  p = clamp(p - 0.1 * b.upset, 0.05, 0.9);
  if (Math.random() < p) {
    b.accepted = now(c); b.refused = null; note(c, id, `${f} said yes to a date.`, 1); mood(c, 2, `${f} said yes`);
    const lk = T.likes.find((k) => YES_TRAIT[k]), line = taken ? pick(T.wreck ? YES_WRECK : YES_TAKEN) : lk && Math.random() < 0.5 ? YES_TRAIT[lk] : pick(YES);
    return { ok: true, text: `${fill(line, C, { partner: pn })} Arrange the date in THE WEEK.` };
  }
  b.refused = now(c); relateCeleb(c, id, -3, `${f} said not yet`);
  const line = taken && Math.random() < 0.6 ? pick(NO_TAKEN) : C.fame - fameIndex(P.fame ?? 0.4) > 30 && Math.random() < 0.5 ? '"You are sweet," says {her}, "but my life is a circus as it is."' : pick(NO);
  return { ok: false, text: fill(line, C, { partner: pn }) };
}

// ---- dates (THE WEEK's 'date': Agenda.js) ----------------------------------------------------------------------------
// (cost: $M from your own account; energy: what the evening takes out of you; pub: how public it is, 0..1)
const D = (key, name, cost, energy, likes, pub, desc, when = null) => ({ key, name, cost, energy, likes, pub, desc, when });
const nextIs = (t) => (c) => trackOf(c) === t;
export const DATE_TYPES = [
  D('dinner', 'Dinner', 0.1, 10, ['romantic', 'kind'], 0.55, 'A corner table somewhere good, phones face down.'),
  D('gallery', 'A gallery opening', 0.1, 8, ['humble', 'kind'], 0.35, 'An exhibition, then a long walk with nowhere to be.'),
  D('concert', 'A concert', 0.2, 18, ['funny', 'adventurous'], 0.8, 'Good seats, loud music, a late night.'),
  D('karting', 'Karting', 0.1, 16, ['winner', 'adventurous', 'confident'], 0.5, 'An indoor kart track after hours. She wants a proper race.'),
  D('beach', 'A beach day', 0.3, 6, ['adventurous', 'romantic'], 0.6, 'A flight to the coast, sea air, nothing on the schedule.'),
  D('cooking', 'Cooking at home', 0, 5, ['kind', 'humble', 'romantic'], 0, 'You cook. She judges. No cameras.'),
  D('gala', 'A charity gala', 0.5, 15, ['kind', 'confident'], 1, 'Black tie, a table for a good cause, every lens in town.'),
  D('rooftop', 'A rooftop at night', 0.2, 10, ['romantic', 'adventurous'], 0.35, 'Above the Strip after dark, the city lit up below.', nextIs('lasvegas')),
];
const DT = Object.fromEntries(DATE_TYPES.map((d) => [d.key, d]));
const DATE_LINES = {
  dinner: ['{her} talks about {work} until the staff start stacking chairs. You walk her to the car.', 'Dinner runs three hours. You learn about {hobby}; she learns why you brake so late.',
    'A long, easy dinner. {her} steals your dessert and calls it a test.'],
  gallery: ['You know nothing about art and say so. {her} likes that more than any clever remark.', 'An opening, then a long walk. {her} talks about {work}; you mostly listen, and she notices.'],
  concert: ['Loud, late and very good. {her} knows every word of the encore.', 'You lose your voice by the second song. {her} says you dance the way you drive: fully committed.'],
  karting: ['{her} out-brakes you into the hairpin on the last lap and does not let it go all evening.', 'Ten laps, a photo finish, a rematch, another rematch. {her} is properly quick.'],
  beach: ['Sea air and no schedule. {her} falls asleep in the sun; you read the race notes and pretend you are not.', 'You swim, badly. {her} laughs, kindly, and tells you about {hobby}.'],
  cooking: ['You make pasta. {her} says it is better than she expected, which you decide to take as a compliment.', 'A quiet evening in. {her} tells you about {hobby} while the risotto very nearly burns.'],
  gala: ['Black tie and a table for a good cause. {her} works the room; you hold two glasses and smile.', 'A charity gala: the auction raises a fortune, and {her} bids on something ridiculous to keep it going.'],
  rooftop: ['A rooftop above the Strip after midnight, the Sphere glowing below. {her} says it looks like a racing line from up here.', 'The lights of the Strip, a quiet rooftop, and very little need to talk.'],
  visit: ['{her} comes by for the afternoon. No cameras, no racing talk: just company.', '{her} brings lunch and stays for the evening. It helps more than you say.'],
};
/** the chance the photographers catch the two of you (pub: how public the place is, 0..1; 0 in a grave week, while you recover, at home; a couple keeping it quiet is careful) */
const photoChance = (c, C, d, b) => (!c || !d.pub || grave(c) || hurt(c) ? 0 : d.pub * (C.fame / 100) * (0.45 + 0.5 * (1 - C.traits.privacy)) * (b.public ? 0.6 : 1) * (b.secret ? 0.5 : 1));
/** the chance of being photographed with her at a place this private (a venue's privacy, 0..1: 0.95 your flat, 0.2 a rooftop over the Strip) -> 0..1 */
export function photoRisk(c, id, privacy = 0.5) {
  const C = CELEB[id]; if (!C) return 0;
  return Math.round(photoChance(c, C, { pub: clamp(1 - (Number(privacy) || 0), 0, 1) }, bondOf(c, id)) * 100) / 100;
}
/**
 * What you could do with her this week: dinner, a gallery, a concert, karting, a beach day, cooking at home, a charity
 * gala, a rooftop above the Strip (the week before Las Vegas) - each with its cost from your own account, the energy it
 * takes, how likely the photographers are, and a word on whether it is her thing. While you recover from an injury, or
 * in a grave week: only a quiet visit (never photographed) -> [{ key, name, cost, energy, desc, risk, fav, meh, afford }]
 */
export function dateOptions(c, id) {
  const C = CELEB[id]; if (!C) return [];
  const f = first(C.name), b = bondOf(c, id);
  if (c && hurt(c)) return [{ key: 'visit', name: 'A quiet visit', cost: 0, energy: 0, risk: 0, fav: false, meh: false, afford: true, desc: `${f} comes to see you while you recover. No cameras, no plans.` }];
  if (c && grave(c)) return [{ key: 'visit', name: 'A quiet evening', cost: 0, energy: 0, risk: 0, fav: false, meh: false, afford: true, desc: `${f} comes round. No cameras, no plans: just company.` }];
  return DATE_TYPES.filter((d) => !d.when || (c && d.when(c))).map((d) => {
    const fav = C.fav === d.key, meh = C.meh === d.key, like = d.likes.some((t) => C.traits.likes.includes(t));
    const hint = fav ? `${f} would love this.` : meh ? `Not really ${f}'s thing.` : like ? `${f} would enjoy it.` : '';
    return { key: d.key, name: d.name, cost: d.cost, energy: d.energy, risk: Math.round(photoChance(c, C, d, b) * 100) / 100, fav, meh, afford: !c || (c.wallet ?? 0) >= d.cost, desc: hint ? `${d.desc} ${hint}` : d.desc };
  });
}
/** whether you can take her out: you are seeing her, or she said yes and is waiting for you to arrange it */
export function canDate(c, id) {
  if (!c || !CELEB[id]) return false;
  const b = bondOf(c, id), me = meOf(c);
  return !!me && me.alive && !b.grieving && (b.stage === 'dating' || b.stage === 'partner' || (!!b.accepted && b.stage !== 'ex'));
}
/** the first date after she said yes: you are a couple (kept quiet from the start when you are already seeing someone else) */
const startDating = (c, id, b) => {
  const f = first(CELEB[id].name), others = seeing(c).filter((k) => k !== id);
  b.stage = 'dating'; b.since = now(c); b.accepted = null; b.secret = others.length > 0;
  note(c, id, b.secret ? `You and ${f} are seeing each other - quietly, for now.` : `You and ${f} are seeing each other.`, 1);
};
/** the two of you in the papers: no longer a secret, known to the world - and to anyone else you are seeing -> what it led to ('' when nothing) */
const snapped = (c, id, b) => {
  // (the others see it while it is still news: exposure passes over what is already public)
  const was = b.secret; b.secret = false;
  const r = exposure(c, 'photo', [id], 1);
  b.photos++; b.public = true;
  return `${was ? ' The secret is out.' : ''}${r?.text ? ` ${r.text}` : ''}`;
};
/**
 * A date (THE WEEK's 'date'): affection +8..14 by how much it is her thing, trust up, your morale up, the cost from your
 * own account; the first one after she said yes makes you a couple. The photographers may be waiting (her fame against
 * how private she is) - a 'date' story for the press; never in a grave week, never while you recover. o: { mul (the
 * week's diminishing returns), morale (v, why, stat): the week's capped morale, else shiftMorale } -> { ok, text, gain,
 * photographed }
 */
export function goOnDate(c, id, key, o = {}) {
  const C = CELEB[id]; if (!c || !C) return { ok: false, text: 'Nobody to take out.' };
  const b = bondOf(c, id), f = first(C.name), T = C.traits;
  if (!canDate(c, id)) return { ok: false, text: b.grieving ? 'Not now.' : `You are not seeing ${f}.` };
  const O = dateOptions(c, id).find((x) => x.key === key); if (!O) return { ok: false, text: 'That is not on this week.' };
  if ((c.wallet ?? 0) < O.cost) return { ok: false, text: `Not enough in your own account ($${O.cost}M).` };
  const mul = o.mul ?? 1, mor = o.morale || ((v, why, stat) => mood(c, v, why, stat)), visit = key === 'visit';
  c.wallet = r1((c.wallet ?? 0) - O.cost);
  const like = (DT[key]?.likes || []).filter((t) => T.likes.includes(t)).length;
  const gain = Math.round(clamp(visit ? 6 : 9 + (O.fav ? 4 : O.meh ? -4 : 0) + Math.min(4, like * 2) + Math.random() * 2 + (b.upset ? 1 : 0), 4, 14) * mul);
  const start = !!b.accepted && b.stage !== 'dating' && b.stage !== 'partner';
  b.dates++; b.last = now(c); b.lastDate = now(c); b.idle = 0;
  if (start) startDating(c, id, b);
  b.accepted = null;
  const got = relateCeleb(c, id, gain, mul ? `${O.name} with ${f}` : '');
  trustCeleb(c, id, Math.round((3 + (!O.risk && T.privacy >= 0.6 ? 2 : 0)) * mul));
  if (b.upset && mul) { b.upset--; if (b.upset < 2) b.ultimatum = false; }
  mor(Math.round(3 * mul), visit ? `${f} came to see you` : `${O.name} with ${f}`);
  let snap = '';
  if (!visit && Math.random() < O.risk) {
    pr(c, 'date', { celeb: id, celebName: C.name, job: C.job, publicly: true });
    if (T.privacy >= 0.6) { trustCeleb(c, id, -4); relateCeleb(c, id, -2); snap = ` A photographer was waiting outside; ${f} hates that.`; }
    else snap = T.drama >= 0.45 ? ` A photographer was waiting outside. ${f} gives them her best side.` : ' A photographer was waiting outside.';
    snap += snapped(c, id, b);
  }
  const text = `${fill(pick(DATE_LINES[key] || DATE_LINES.dinner), C)}${O.fav ? ` ${C.favLine}` : O.meh ? ` ${C.mehLine}` : ''}${snap}${start ? ` You and ${f} are seeing each other${b.secret ? ' - quietly, for now' : ''}.` : ''}`;
  return { ok: true, text, gain: got, photographed: !!snap };
}

// ---- an evening at one of the venues (Social.js VENUES; played in 3D by ui/Hangout.js, or skipped) --------------------
// (each venue as a date: the old date it stands for (her favourite and least favourite evenings), and what suits it)
export const VENUE_DATE = { restaurant: 'dinner', apartment: 'cooking', rooftop: 'rooftop', karting: 'karting', poolclub: 'beach', pub: null, simlounge: null, coffee: null };
const VENUE_LIKES = { restaurant: ['romantic', 'kind'], apartment: ['kind', 'humble', 'romantic'], rooftop: ['romantic', 'adventurous'], karting: ['winner', 'adventurous', 'confident'],
  poolclub: ['adventurous', 'confident', 'funny'], pub: ['funny', 'humble'], simlounge: ['winner', 'funny', 'confident'], coffee: ['kind', 'humble'] };
const VENUE_NAME = { restaurant: 'Dinner', apartment: 'An evening at yours', rooftop: 'The rooftop', karting: 'Karting', poolclub: 'A night swim at Tidewater', pub: 'The pub', simlounge: 'The sim lounge', coffee: 'Coffee' };
// (how it went: good, middling, flat; {her}, {work}, {hobby})
const VENUE_LINES = {
  restaurant: { good: ['A private room, candles, and three courses you barely notice. {her} talks about {work} until the waiter gives up hovering.', 'Dinner in a private room. {her} steals your dessert and calls it a test you passed.'],
    flat: ['A beautiful room and a slightly stiff dinner. {her} checks the time once. You notice.'] },
  apartment: { good: ['You cook; {her} supervises and steals the best bits. It is the easiest evening either of you has had in weeks.', 'A quiet night in at yours. {her} tells you about {hobby} while the risotto very nearly burns.'],
    flat: ['A night in that never quite gets going. The pasta is fine. The silences are long.'] },
  rooftop: { good: ['Above the Strip after dark, the Sphere glowing below. {her} says the lights look like a racing line from up here.', 'The rooftop, the city lit up below, and very little need to talk.'],
    flat: ['The rooftop is loud and busy tonight. {her} spends half of it on her phone.'] },
  karting: { good: ['{her} out-brakes you into the hairpin on the last lap and does not let it go all evening.', 'Ten laps, a photo finish, a rematch, another rematch. {her} is properly quick.'],
    flat: ['Karting. {her} is a good sport about it, but it is not really her evening.'] },
  pub: { good: ['A corner booth in a village pub, the fire going. {her} beats you at darts and buys the next round of lemonades.', 'Pie, a crackling fire and a pub quiz you lose by one point. {her} knew the answer and did not say.'],
    flat: ['The pub is packed and too loud to talk. You leave early.'] },
  simlounge: { good: ['A sim-racing lounge after hours. {her} finds the limit at the first corner faster than you would like.', 'Three rigs, a lap-time battle and a lot of laughing. {her} wants a rematch.'],
    flat: ['{her} gives the sim rigs a polite go, then sits on the sofa scrolling.'] },
  coffee: { good: ['A long, quiet coffee. {her} talks about {work}; you mostly listen, and she notices.'], flat: ['A quick coffee between her meetings. Pleasant, and over too soon.'] },
  poolclub: { good: ['A cabana at Tidewater after midnight, the pool lit turquoise. {her} talks you into the water and wins the race to the far wall.', 'A night swim at the Meridian Grand, the music low, the Strip glowing past the palms. {her} does not check her phone once.'],
    flat: ['Tidewater is packed and loud tonight. {her} spends half of it being recognised.'] },
};
const VENUE_MID = ['A good evening, if not a great one. {her} says she had fun, and probably did.', 'Easy company and a nice evening. {her} hugs you goodbye.', 'A nice evening. {her} laughs at most of your stories, which is more than most people do.'];
const VENUE_BAD = ['It does not go well. {her} is polite, and leaves early.', 'An awkward evening. Neither of you can find the thread of it, and {her} calls a car before ten.'];
/** whether a venue is her kind of evening -> { fav, meh, like (how many of her likes it suits), hint } */
export function venueFit(id, venue) {
  const C = CELEB[id], v = typeof venue === 'string' ? venue : venue?.id; if (!C || !v) return { fav: false, meh: false, like: 0, hint: '' };
  const dk = VENUE_DATE[v], fav = !!dk && C.fav === dk, meh = !!dk && C.meh === dk, like = (VENUE_LIKES[v] || []).filter((t) => C.traits.likes.includes(t)).length, f = first(C.name);
  return { fav, meh, like, hint: fav ? `${f} would love this.` : meh ? `Not really ${f}'s thing.` : like ? `${f} would enjoy it.` : '' };
}
/** the evening THE WEEK booked with her (c.week.launches, Agenda.js), counted once: its diminishing-returns share and who else was there -> { mul, with: [celeb ids] } */
const launchFor = (c, id) => {
  const w = c.week, cid = 'c:' + id, L = w && w.season === c.season && w.round === c.round && Array.isArray(w.launches) ? w.launches : [];
  for (let i = L.length - 1; i >= 0; i--) {
    const x = L[i]; if (!Array.isArray(x.cids) || !x.cids.includes(cid) || (x.done || []).includes(cid)) continue;
    x.done = [...(x.done || []), cid];
    return { mul: typeof x.mul === 'number' ? x.mul : 1, with: x.cids.filter((k) => k !== cid && String(k).startsWith('c:')).map((k) => String(k).slice(2)).filter((k) => CELEB[k]) };
  }
  return { mul: 1, with: [] };
};
/**
 * How an evening with her went (Social.hangoutResult, after the 3D scene or a skipped one): score 0..1 (from the
 * evening), venue (a VENUES id, or the venue), seen (photographed). For someone you are seeing - or who said yes - it is
 * a date: affection -6..+14 by the score and whether the place is her thing, trust, your morale (inside the week's caps;
 * a second evening this week counts half, a third nothing), the first one makes you a couple. For anyone else it is a
 * friendly evening (smaller, and it counts as seeing her). Seen: the two of you are in the papers (no longer a secret;
 * whoever else you are seeing will hear of it - the press story itself is the caller's). o (optional, from the scene):
 * { mul, buzz ('ignore' | 'answer' | 'excuse': your phone went), cover (cover stories told), confess (you owned up to
 * someone else), flirt (a flirt in it) } -> { ok, text, gain, started }
 */
export function dateResult(c, id, score, venue, seen = false, o = {}) {
  const C = CELEB[id]; if (!c || !C) return { ok: false, text: '', gain: 0, started: false };
  const b = bondOf(c, id), f = first(C.name), T = C.traits, v = typeof venue === 'string' ? venue : venue?.id || null, s = clamp(Number(score) || 0, 0, 1);
  const L = launchFor(c, id), mul = typeof o.mul === 'number' ? o.mul : L.mul, fit = venueFit(id, v);
  if (b.grieving) { b.last = now(c); b.idle = 0; trustCeleb(c, id, 1); return { ok: true, text: `A quiet evening with ${f}. You mostly listen.`, gain: 0, started: false }; }
  const date = involved(b), start = date && !!b.accepted && !TOGETHER.includes(b.stage);
  let gain = -5 + s * 17 + (fit.fav ? 3 : fit.meh ? -3 : 0) + Math.min(2, fit.like) + (b.upset && s >= 0.5 ? 1 : 0);
  gain = Math.round(clamp(gain, -6, 14) * (gain > 0 ? mul * (date ? 1 : 0.6) : 1));
  b.last = now(c); b.idle = 0;
  let extra = '', started = false;
  if (start && s < 0.2) {
    b.accepted = null; note(c, id, `The first date with ${f} did not work out.`, -1);
    extra = ` ${f} is kind about it: she thinks you are better as friends.`;
  } else if (date) {
    if (start) { startDating(c, id, b); started = true; }
    b.accepted = null; b.dates++; b.lastDate = now(c);
  }
  const got = relateCeleb(c, id, gain, gain >= 5 ? `${VENUE_NAME[v] || 'An evening'} with ${f}` : gain <= -3 ? `An evening with ${f} that fell flat` : '');
  if (date) trustCeleb(c, id, s >= 0.5 ? Math.round((2 + s * 2 + (b.secret && T.privacy >= 0.6 && !seen ? 1 : 0)) * Math.max(mul, 0.5)) : s < 0.3 ? -2 : 0);
  if (date && b.upset && s >= 0.55 && mul) { b.upset--; if (b.upset < 2) b.ultimatum = false; }
  if (o.flirt) flirt(c, id);
  if (date) { if (s >= 0.3) weekMood(c, Math.round((1 + 3 * s) * mul), `${VENUE_NAME[v] || 'An evening'} with ${f}`); else mood(c, -2, `A date with ${f} that went wrong`); }
  // (the sneaky side, from the scene: the phone that buzzed, the stories you told, the truth you owned up to)
  if (date && (o.buzz || o.cover || o.confess)) extra += sneaks(c, id, b, o);
  if (seen) {
    if (T.privacy >= 0.6) { trustCeleb(c, id, -4); relateCeleb(c, id, -2); extra += ` A photographer was outside; ${f} hates that.`; }
    else extra += T.drama >= 0.45 ? ` A photographer was outside. ${f} gives them her best side.` : ' A photographer was outside.';
    if (date) extra += snapped(c, id, b);
    else for (const k of seeing(c)) if (CELEB[k].traits.jealousy >= 0.4) relateCeleb(c, k, -2, `${first(CELEB[k].name)} saw photographs of you out with ${f}`);
  }
  // (two of the women you are seeing at the same evening: they will each have noticed the other)
  const both = [id, ...L.with].filter((k) => involved(c.celebs.bonds[k]));
  if (both.length >= 2) { const r = exposure(c, 'room', both, 1.2, both); if (r?.text) extra += ` ${r.text}`; }
  const band = s >= 0.65 ? 'good' : s >= 0.35 ? 'mid' : s >= 0.15 ? 'flat' : 'bad', V = VENUE_LINES[v];
  const line = band === 'bad' ? pick(VENUE_BAD) : band === 'mid' || !V ? pick(VENUE_MID) : pick(V[band]);
  const text = `${fill(line, C)}${fit.fav && s >= 0.35 ? ` ${C.favLine}` : fit.meh ? ` ${C.mehLine}` : ''}${extra}${started ? ` You and ${f} are seeing each other${b.secret ? ' - quietly, for now' : ''}.` : ''}`;
  return { ok: true, text: text.trim(), gain: got, started };
}

// ---- between dates: a message, an invitation, making it official, ending it -------------------------------------------
const MSG = {
  met: ['{her} replies with a photo from {work} and a thumbs-up for the weekend.', 'A short reply from {her}: busy with {work}, but good luck this weekend.'],
  friendly: ['{her} sends back a voice note, mostly laughing, about {work}.', 'A long reply from {her} about {hobby}. She wants to know how the car feels.'],
  flirting: ['"Is this you being charming?" {her} writes. "It is working. Slightly."', '{her} replies within a minute, then pretends that was a coincidence.'],
  dating: ['{her} writes back from {work}: missing you, and "do not do anything silly this weekend".', 'A photo from {her}, somewhere far away, and "call me after the race".'],
  partner: ['{her} calls instead of writing back. You talk for an hour about nothing much.', '"Good luck this weekend. I will be watching." - {her}'],
  ex: ['A polite, short reply from {her}.', '{her} reads it. A thumbs-up, eventually.'],
};
/** a message (free, once a round): affection +2, trust +1; not the same as seeing her (it only halves this round's drift) -> { ok, text } */
export function message(c, id) {
  const C = CELEB[id]; if (!c || !C) return { ok: false, text: 'Nobody to message.' };
  const b = bondOf(c, id), f = first(C.name);
  if (b.stage === 'stranger') return { ok: false, text: `You have not met ${f} yet.` };
  if (b.msgRound === rk(c)) return { ok: false, text: `You have already messaged ${f} this week.` };
  b.msgRound = rk(c);
  if (b.grieving) { trustCeleb(c, id, 1); return { ok: true, text: `You send ${f} a few kind words. She thanks you.` }; }
  relateCeleb(c, id, 2); trustCeleb(c, id, 1);
  return { ok: true, text: fill(pick(MSG[b.stage] || MSG.met), C) };
}
/**
 * Why you cannot make it official with her now -> a reason, or null. Dating -> partner needs two dates and affection 55
 * (kept secret, it stays between the two of you); going public needs no other public partner
 */
export function officialWhy(c, id) {
  const C = CELEB[id]; if (!c || !C) return 'Nobody to make it official with';
  const b = bondOf(c, id), f = first(C.name), P = c.celebs.partner;
  if (b.grieving || !TOGETHER.includes(b.stage)) return `You are not seeing ${f}`;
  if (b.stage === 'partner' && b.public) return `You and ${f} are already official`;
  if (b.stage === 'dating' && b.dates < 2) return `Too soon: ${f} wants a few more dates first`;
  if (b.stage === 'dating' && b.aff < 55) return `${f} is not ready for that yet`;
  if (grave(c)) return 'Not this week. It can wait';
  const priv = b.stage === 'dating' && b.secret;
  if (!priv && P && P !== id && c.celebs.bonds[P]?.public) return `You are already official with ${first(CELEB[P].name)}`;
  return null;
}
/**
 * Make it official. Dating and kept secret: you are partners between the two of you (no story, morale +4). Otherwise -
 * or a private partner going public - the world knows: a PR 'official' story, your public partner, morale +6, and
 * anyone else you are seeing reads it in the papers -> { ok, text }
 */
export function makeOfficial(c, id) {
  const why = officialWhy(c, id); if (why) return { ok: false, text: `${why}.` };
  const C = CELEB[id], b = bondOf(c, id), f = first(C.name), T = C.traits, s = c.celebs;
  if (b.stage === 'dating' && b.secret) {
    b.stage = 'partner'; b.official = now(c); b.exclusive = (T.free || 0) < 0.5;
    trustCeleb(c, id, 5); mood(c, 4, `Together with ${f}`);
    const text = `You and ${f} make it official - between the two of you. Nobody else needs to know. Yet.`;
    note(c, id, text, 1); return { ok: true, text };
  }
  const was = b.stage; b.stage = 'partner'; b.secret = false; b.official = now(c); b.exclusive = (T.free || 0) < 0.5;
  // (it is in every paper: whoever else you are seeing reads it too - counted while it is still news)
  const r = b.public ? null : exposure(c, 'photo', [id], 1.5);
  b.public = true; s.partner = id;
  trustCeleb(c, id, was === 'dating' ? 5 : 3); mood(c, 6, `Official with ${f}`);
  pr(c, 'official', { celeb: id, celebName: C.name, job: C.job });
  let text = T.privacy >= 0.7 ? `You and ${f} make it official - on her terms: one photograph, no interviews.` : T.drama >= 0.45 ? `You and ${f} make it official, and the internet talks about nothing else for a day.` : `You and ${f} make it official. The photographs are everywhere by the evening.`;
  note(c, id, text, 1);
  if (r?.text) text += ` ${r.text}`;
  return { ok: true, text };
}
/**
 * Keep it quiet with her, or stop hiding it (on: true / false). Too late once the world knows. A private person is glad
 * of it; one who loves the spotlight would rather not be anyone's secret -> { ok, text }
 */
export function setSecret(c, id, on = true) {
  const C = CELEB[id]; if (!c || !C) return { ok: false, text: 'Nobody to keep quiet about.' };
  const b = bondOf(c, id), f = first(C.name), T = C.traits;
  if (!involved(b)) return { ok: false, text: `You are not seeing ${f}.` };
  if (!on) {
    if (!b.secret) return { ok: true, text: `You are not hiding anything with ${f}.` };
    b.secret = false; note(c, id, `You stopped keeping it quiet with ${f}.`, 0);
    return { ok: true, text: seeing(c).some((k) => k !== id) ? `You stop hiding it with ${f}. If anyone asks, you will not deny it - and someone will ask.` : `You stop hiding it with ${f}.` };
  }
  if (b.secret) return { ok: true, text: `You are already keeping it quiet with ${f}.` };
  if (b.public) return { ok: false, text: b.stage === 'partner' ? `You and ${f} are official: there is no hiding it now.` : `The papers already have you and ${f} together: it is too late to hide it.` };
  b.secret = true;
  let text = `You and ${f} keep it quiet for now.`;
  if (T.privacy >= 0.6) { trustCeleb(c, id, 2); text = `${f} is glad to keep it between the two of you.`; }
  else if (T.privacy < 0.35 && T.drama >= 0.4) { relateCeleb(c, id, -2, `${f} would rather not be anyone's secret`); text = `${f} agrees to keep it quiet, but she would rather not be anyone's secret.`; }
  note(c, id, text, 0);
  return { ok: true, text };
}
const INV_YES = ['{her} will be on the grid at {track}.', '"Wouldn\'t miss it," says {her}. She will be at {track}.', '{her} moves {work} around to be at {track}.'];
/** invite her to the next race (friendly or closer): she says yes or is busy; one guest a race -> { ok, text } */
export function invite(c, id) {
  const C = CELEB[id]; if (!c || !C) return { ok: false, text: 'Nobody to invite.' };
  const b = bondOf(c, id), f = first(C.name), tr = trackOf(c), where = TRACK[tr] || 'the next race', s = c.celebs;
  if (c.round > c.rounds) return { ok: false, text: 'The season is over: invite her to the first race of the next one.' };
  if (b.grieving) return { ok: false, text: 'Not now.' };
  if (SI(b.stage) < 2 || b.stage === 'ex') return { ok: false, text: `You do not know ${f} well enough yet.` };
  if (hurt(c)) return { ok: false, text: 'You are not racing this weekend.' };
  if (banned(c)) return { ok: false, text: 'You are suspended for this round.' };
  if (grave(c)) return { ok: false, text: 'Not this weekend.' };
  if (b.invited && ago(c, b.invited) === 0) return { ok: true, text: `${f} is already coming to ${where}.` };
  const other = Object.keys(s.bonds).find((k) => k !== id && CELEB[k] && s.bonds[k].invited && ago(c, s.bonds[k].invited) === 0);
  if (other) return { ok: false, text: `You have already invited ${first(CELEB[other].name)} to this race.` };
  if (b.invRound === rk(c)) return { ok: false, text: `${f} has already said she can't make this one.` };
  b.invRound = rk(c);
  const p = ({ friendly: 0.55, flirting: 0.8, dating: 0.95, partner: 1 }[b.stage] || 0.5) + (C.often.includes(tr) ? 0.15 : 0) - b.upset * 0.15;
  if (Math.random() < p) {
    b.invited = now(c); note(c, id, `${f} will be at ${where} as your guest.`, 1);
    // (your public partner comes to every race: two of them on one grid is asking for trouble)
    const P = s.partner && s.partner !== id && involved(b) && !b.public && !s.bonds[s.partner]?.knows?.includes(id) ? first(CELEB[s.partner].name) : null;
    return { ok: true, text: fill(pick(INV_YES), C, { track: where }) + (P ? ` So will ${P}. Careful.` : '') };
  }
  return { ok: false, text: fill(`{her} can't make ${where}: {work}.`, C) };
}
/** take back an invitation to the next race (she is a little disappointed) -> { ok, text } */
export function uninvite(c, id) {
  const C = CELEB[id]; if (!c || !C) return { ok: false, text: 'Nobody to uninvite.' };
  const b = bondOf(c, id), f = first(C.name);
  if (!b.invited || ago(c, b.invited) !== 0) return { ok: false, text: `${f} is not coming to the next race.` };
  b.invited = null; relateCeleb(c, id, -2, `You took back ${f}'s invitation`);
  return { ok: true, text: `You tell ${f} the next race is not a good one after all. She says it is fine. It is mostly fine.` };
}
/** it is over (you end it, or she does): stage 'ex', affection 10 at most for four rounds, a PR 'breakup' story if it was public, your morale down */
const endBond = (c, id, byHer) => {
  const C = CELEB[id], b = bondOf(c, id), f = first(C.name), T = C.traits, was = b.stage, serious = was === 'partner' || was === 'dating';
  b.stage = 'ex'; b.exAt = now(c); b.aff = Math.min(b.aff, 10); b.flirts = 0; b.accepted = null; b.invited = null; b.upset = 0; b.ultimatum = false; b.idle = 0;
  b.secret = false; b.exclusive = false; b.suspicion = 0; b.evidence = 0; b.susOf = []; b.knows = []; b.hintAt = null;
  // (nobody else needs to suspect her any more; a confrontation of hers, or about only her, is over)
  const s = c.celebs;
  for (const o of Object.values(s.bonds)) { if (o.susOf?.includes(id)) o.susOf = o.susOf.filter((x) => x !== id); if (o.knows?.includes(id)) o.knows = o.knows.filter((x) => x !== id); }
  const cf = s.confront;
  if (cf && cf.id === id) s.confront = null;
  else if (cf && (cf.otherIds || []).every((x) => x === id)) {
    // (the one she found out about is over before she asked: she stays, warily - as if you had ended it for her)
    s.confront = null; trustCeleb(c, cf.id, -15); const cb = bondOf(c, cf.id); cb.suspicion = Math.min(cb.suspicion, 10); cb.evidence = 0;
    note(c, cf.id, `${first(CELEB[cf.id].name)} knows it is over with ${f}. She stays - warily.`, 0);
  } else if (cf) cf.otherIds = cf.otherIds.filter((x) => x !== id);
  if (s.partner === id) s.partner = publicPartner(s);
  if (serious && (b.public || b.photos > 0) && !grave(c)) pr(c, 'breakup', { celeb: id, celebName: C.name, job: C.job, by: byHer ? 'her' : 'you' });
  b.public = false;
  mood(c, was === 'partner' ? -10 : was === 'dating' ? -6 : -2, byHer ? `${f} ended it` : `You ended it with ${f}`);
  const how = T.drama >= 0.45 ? 'She does not take it quietly.' : T.privacy >= 0.6 ? 'She asks only that it stays private.' : 'She is kind about it, which somehow makes it worse.';
  const text = byHer ? `${f} has ended it. ${T.drama >= 0.45 ? 'She does it loudly.' : T.privacy >= 0.6 ? 'She asks only that it stays private.' : 'She is kind about it.'}`
    : serious ? `It is over with ${f}. ${how}` : `You tell ${f} it is not going anywhere. She shrugs it off.`;
  note(c, id, text, -1);
  return { ok: true, text };
};
/** you end it (flirting, dating or official): a PR 'breakup' story if it was public, morale -10 for a partner -> { ok, text } */
export function breakUp(c, id) {
  const C = CELEB[id]; if (!c || !C) return { ok: false, text: 'Nobody to break up with.' };
  const b = bondOf(c, id);
  if (!['flirting', 'dating', 'partner'].includes(b.stage) && !b.accepted) return { ok: false, text: `There is nothing to end with ${first(C.name)}.` };
  return endBond(c, id, false);
}
/** she is upset (why: a sentence): a warning at 2, at 3 she ends it -> the lines */
const upset = (c, id, why, lines = []) => {
  const C = CELEB[id], b = bondOf(c, id), f = first(C.name);
  b.upset = Math.min(3, b.upset + 1); note(c, id, why, -1); lines.push(why);
  if (b.upset >= 3) lines.push(endBond(c, id, true).text);
  else if (b.upset >= 2 && !b.ultimatum) { b.ultimatum = true; const t = `${f} wants to talk: things have to change, or it is over.`; note(c, id, t, -1); lines.push(t); }
  return lines;
};
/** upset her (why: a sentence; e.g. a night out in the papers): a warning at 2, a break-up at 3 -> { text } */
export function upsetCeleb(c, id, why) { if (!c || !CELEB[id]) return { text: '' }; return { text: upset(c, id, why).join(' ') }; }
/**
 * Flirting with another celebrity on the grid while you are seeing someone: each of them who sees it (on camera, or she
 * is at this race) loses affection and trust and may be upset; on camera it may be a 'scandal' story (a crisis if you
 * are public with her). When the one you flirted with is someone you are secretly seeing too, whoever saw it also grows
 * suspicious (exposure 'grid'). Those not there may still hear of it after the race. Nothing in a grave week -> { text } | null
 */
export function jealousyCheck(c, otherId, onCamera = false) {
  if (!c?.celebs || !CELEB[otherId] || grave(c)) return null;
  const W = seeing(c).filter((id) => id !== otherId); if (!W.length) return null;
  const here = new Set(celebsAtRace(c, trackOf(c))), pa = partnerAtRace(c); if (pa) here.add(pa);
  const saw = W.filter((id) => !!onCamera || here.has(id)), O = CELEB[otherId], o = first(O.name), out = [];
  if (saw.length < W.length) c.celebs.eyes = { season: c.season, round: c.round, id: otherId };
  if (!saw.length) return null;
  let story = false;
  for (const cur of saw) {
    const C = CELEB[cur], b = bondOf(c, cur), f = first(C.name), T = C.traits;
    if (b.jealousRound === rk(c)) { relateCeleb(c, cur, -2); out.push(`${f} is not impressed. Again.`); continue; }
    b.jealousRound = rk(c);
    relateCeleb(c, cur, -Math.round(4 + 8 * T.jealousy), `${f} saw you flirting with ${o}`); trustCeleb(c, cur, -6);
    let text = T.jealousy >= 0.4 ? `${f} saw you flirting with ${o}, and she is not amused.` : `${f} saw you flirting with ${o}. She raises an eyebrow.`;
    // (one story a flirt: the papers pick the woman they know you are with)
    if (onCamera && !story && Math.random() < 0.5 + 0.3 * T.drama) {
      const data = { celeb: cur, celebName: C.name, job: C.job, other: otherId, otherName: O.name };
      pr(c, 'scandal', data); if (b.public) crisis(c, 'scandal', data); text += ' The cameras caught it.'; story = true;
    }
    if (T.jealousy >= 0.3 || onCamera) { const L = upset(c, cur, `${f} is upset about ${o}.`); if (L.length > 1) text += ` ${L.slice(1).join(' ')}`; }
    out.push(text);
  }
  // (flirting with someone you are secretly seeing, in front of someone else you are seeing)
  if (involved(c.celebs.bonds[otherId])) { const r = exposure(c, 'grid', [otherId], onCamera ? 1.2 : 1, saw.filter((k) => TOGETHER.includes(c.celebs.bonds[k]?.stage))); if (r?.text) out.push(r.text); }
  return out.length ? { text: out.join(' ') } : null;
}

// ---- more than one at once: suspicion, being found out, facing her -----------------------------------------------------
// (each kind of evidence: how much it adds to her suspicion, and how hard it is to explain away - 0..100)
// ('room' is the grid's evidence at an evening out: two of them at the same table)
const SRC = { photo: { sus: 55, ev: 80 }, grid: { sus: 35, ev: 55 }, room: { sus: 35, ev: 55 }, texts: { sus: 26, ev: 50 }, tipoff: { sus: 28, ev: 30 }, friend: { sus: 24, ev: 25 } };
// (before she knows: a question, a look; {other} is a first name)
const HINTS = {
  photo: ['{her} has seen the photographs. She has not said anything yet, which is worse.', '{her} sends you a screenshot of a tabloid page, and no message at all.'],
  grid: ['{her} asks, very lightly, how well you know {other}.', '"You and {other} seemed friendly on the grid," says {her}. She smiles. Mostly.'],
  room: ['{her} watched you and {other} all evening. She has gone very quiet.', '"You and {other} get on well," says {her}, a little too lightly.'],
  texts: ['"Who keeps texting you?" asks {her}.', '{her} notices your phone face down on the table. Again.'],
  tipoff: ['{her} mentions that a journalist rang her about you. She laughs it off. Mostly.', 'A reporter from The Paddock Post has been asking {her} questions about you.'],
  friend: ['"Funny thing someone said in the paddock," says {her}, and changes the subject.', '{her} has heard something from someone in the paddock. She wants to know if there is anything in it.'],
};
// (when she knows, in her words: the phone and the hub show it; {other} is one first name or several)
const CONFRONT = {
  photo: ['I have seen the photographs of you and {other}. Do not tell me it is nothing.', 'You and {other}, in the papers. I want the truth, and I want it now.'],
  grid: ['I saw you with {other} on the grid. I am not stupid. What is going on?', 'You and {other}, on the grid, in front of me. Explain that.'],
  room: ['I watched you and {other} all evening. I am not stupid. What is going on?', 'You and {other}, in the same room, all night - in front of me. Explain that.'],
  texts: ['Who keeps texting you? Is it {other}? Be honest with me.', 'I saw the messages from {other}. I was not looking for them. Tell me what they are.'],
  tipoff: ['A journalist rang me today and asked about you and {other}. Why would they ask me that?', 'The Paddock Post called me about you and {other}. Tell me they have got it wrong.'],
  friend: ['People in the paddock are talking about you and {other}. Tell me they are wrong.', 'Someone asked me how {other} was. Why would anyone ask me that?'],
};
// (The Paddock Post's version, when a public partner finds out - PR writes its scandal crisis for the grid-walk flirt; the other is always another of the twelve)
const SCANDAL = {
  photo: ['Photographed with {other}', 'the photographs with {other}', 'The Paddock Post has photographs of you and {other} together, and {her} has seen them. The Post wants a comment.'],
  room: ['An awkward evening with {other}', 'the evening with {other}', 'Word of an awkward evening out with {her} and {other} has reached The Paddock Post. The Post wants a comment.'],
  texts: ['Messages to {other}', 'the messages to {other}', 'Someone close to {her} has told The Paddock Post about your messages to {other}. The Post wants a comment.'],
  tipoff: ['A tip-off about {other}', 'the tip-off about {other}', 'A tip-off about you and {other} reached {her} before it reached print. Now The Paddock Post has it, and wants a comment.'],
  friend: ['Paddock gossip about {other}', 'the gossip about {other}', 'Paddock gossip about you and {other} reached {her}, and then The Paddock Post. The Post wants a comment.'],
};
// (and its headlines, by the outlet's kind: the tabloid, the fans' platform, the broadcasters - {sur} is you, as PR names you)
const SCANDAL_HL = {
  photo: { tab: ['Caught on camera: {sur} and {other} - and {her} has seen the pictures', 'Love triangle? {sur} pictured with {other} behind {her}\'s back'],
    feed: ['#Team{her} trends as photos of {sur} and {other} emerge'], tv: ['{sur} photographed with {other}; {her}\'s team declines to comment'] },
  room: { tab: ['Awkward! {sur}, {her} and {other}: an evening out to forget', 'Three is a crowd: {sur}\'s night out with {her} and {other}'],
    feed: ['Chequered gossips about {sur}, {her} and {other}'], tv: ['Reports of off-track tension for {sur}'] },
  texts: { tab: ['Secret messages: {sur}, {other} - and {her} found out', 'What {her} found out: {sur} and {other}'],
    feed: ['Chequered reacts to reports of messages between {sur} and {other}'], tv: ['Reports link {sur} with {other}'] },
  tipoff: { tab: ['Exclusive: {sur} and {other} - the secret {her} did not know', 'Tip-off: {sur} seeing {other} behind {her}\'s back'],
    feed: ['#Team{her} trends after a tip-off about {sur} and {other}'], tv: ['Tabloid claims link {sur} with {other}'] },
  friend: { tab: ['Paddock whispers: {sur} and {other} - and now {her} knows', 'The paddock is talking: {sur}, {her} and {other}'],
    feed: ['Chequered picks up paddock gossip about {sur} and {other}'], tv: ['Paddock gossip links {sur} with {other}'] },
};
/** you, as a personal story names you: a real driver is only ever 'the <team> driver' (PR's rule), your own driver by surname */
const surOf = (c) => { const me = meOf(c); return !me ? 'the driver' : ['F1', 'Reserve', 'F2'].includes(me.from) ? `the ${me.team || c.myTeam || 'team'} driver` : String(me.name || '').split(' ').pop(); };
/** how much finding out would hurt her: a partner expects to be the only one (unless she is a free spirit), a jealous one minds more -> about 0.1..1.3 */
const concernOf = (b, T) => (b.stage === 'partner' || b.exclusive ? 1 : 0.7) * (1 - 0.85 * (T.free || 0)) * (0.7 + 0.6 * T.jealousy) * (1 - 0.9 * (T.wreck || 0));
/** she has enough to want it out in the open */
const ripe = (b) => b.suspicion >= 65 || (b.evidence >= 70 && b.suspicion >= 45);
/** the women you are seeing who are at this round's race (your public partner, anyone invited, anyone who is a guest anyway) -> [ids] */
export function seeingAtRace(c) {
  if (!c?.celebs?.bonds) return [];
  const here = new Set(celebsAtRace(c, trackOf(c))), p = partnerAtRace(c); if (p) here.add(p);
  return seeing(c).filter((id) => here.has(id));
}
/**
 * Something that could give you away. source: 'photo' (a date or a night out photographed), 'grid' (two of your
 * relationships at one race, or one sees you flirt with the other), 'room' (two of them at the same evening out),
 * 'texts' (messages she was not meant to see), 'tipoff' (a tabloid calls her), 'friend' (paddock gossip); ids: the
 * relationships it gives away; weight: how much there is to see (1 = typical); by: only these of yours notice (else
 * everyone you are seeing - at the race only, for 'grid').
 * Each one it reaches who did not already know grows suspicious (a free spirit less, a jealous one more): first hints,
 * then she wants to talk (confront: you are found out). The same evidence twice in a round counts once; nothing in a
 * grave week or while you recover -> { caught: [ids], hinted: [ids], text, lines } | null (nobody it could reach)
 */
export function exposure(c, source, ids, weight = 1, by = null) {
  const S = SRC[source], s = c?.celebs; if (!S || !s?.bonds || grave(c) || hurt(c)) return null;
  const E = [...new Set((Array.isArray(ids) ? ids : [ids]).filter((id) => CELEB[id] && involved(s.bonds[id])))]; if (!E.length) return null;
  const B = Array.isArray(by) ? by : by ? [by] : null, k = rk(c), tag = `${source}:${E.slice().sort().join(',')}:${B ? B.slice().sort().join(',') : '*'}`;
  if (!s.exp || s.exp.key !== k) s.exp = { key: k, done: [] };
  if (s.exp.done.includes(tag)) return null;
  s.exp.done.push(tag);
  const W = B ? seeing(c).filter((id) => B.includes(id)) : source === 'grid' ? seeingAtRace(c) : seeing(c), m = clamp(Number(weight) || 1, 0.1, 3);
  const caught = [], hinted = [], lines = []; let reached = 0;
  for (const id of W) {
    const b = s.bonds[id], C = CELEB[id], f = first(C.name);
    const about = E.filter((e) => e !== id && !s.bonds[e].public && !b.knows.includes(e)); if (!about.length) continue;
    reached++;
    const was = b.suspicion;
    b.suspicion = clamp(Math.round(was + S.sus * m * concernOf(b, C.traits)), 0, 100);
    b.evidence = clamp(Math.round(Math.max(b.evidence, S.ev * Math.min(1, m))), 0, 100);
    b.susOf = [...new Set([...about, ...b.susOf])].slice(0, 4); b.susSrc = source; b.susAt = now(c);
    if (ripe(b) && !s.confront) { const cf = confront(c, id); if (cf) { caught.push(id); lines.push(`${f} has found out about ${listOf(cf.otherIds)}, and she wants to talk.`); continue; } }
    if (b.suspicion >= 30 && (was < 30 || ago(c, b.hintAt) >= 2)) {
      b.hintAt = now(c); hinted.push(id);
      const t = fill(pick(HINTS[source]), C, { other: first(CELEB[about[0]].name) }); note(c, id, t, -1); lines.push(t);
    }
  }
  return reached ? { caught, hinted, text: lines.join(' '), lines } : null;
}
/** a public partner has found out: a 'scandal' story and its crisis, told the way it happened */
const scandal = (c, id, other, src) => {
  const C = CELEB[id], O = CELEB[other]; if (!C || !O || grave(c)) return;
  const data = { celeb: id, celebName: C.name, job: C.job, other, otherName: O.name };
  const r = pr(c, 'scandal', data), H = SCANDAL_HL[src];
  // (PR's scandal headlines are about a flirt on the grid: when something else gave you away, this round's say what it was)
  if (H && r?.headlines?.length && Array.isArray(c.pr?.feed)) {
    const X = { sur: surOf(c), her: first(C.name), other: O.name }, tx = (t) => { const v = t.replace(/\{(\w+)\}/g, (m, q) => X[q] ?? m); return v[0].toUpperCase() + v.slice(1); };
    for (const h of r.headlines) {
      const e = c.pr.feed.find((x) => x.kind === 'scandal' && x.text === h.text && x.season === c.season && x.round === c.round); if (!e) continue;
      e.text = h.text = tx(pick(H[h.outlet === 'post' ? 'tab' : h.outlet === 'feed' ? 'feed' : 'tv']));
    }
  }
  const k = crisis(c, 'scandal', data), T = SCANDAL[src];
  if (T && k && k.kind === 'scandal' && k.season === c.season && k.round === c.round && !(k.also || []).length && k.story === 'the grid-walk flirting') {
    const tx = (t) => t.replace(/\{her\}/g, first(C.name)).replace(/\{other\}/g, O.name);
    k.title = tx(T[0]); k.story = tx(T[1]); k.text = tx(T[2]);
  }
};
/**
 * She has found out, or is sure enough: she wants it out in the open (one at a time, c.celebs.confront - the hub and the
 * phone show it). Being found out costs you (morale -8, composure -6); if the two of you are public, The Paddock Post has
 * it too (a 'scandal' story and a crisis). A confrontation already waiting for someone else: she waits her turn -> {
 * id, otherIds, options: [{ key: 'confess' | 'deny' | 'tabloids' | 'endOther' | 'beg', label }], text, source, evidence,
 * season, round, ticks } | null
 */
export function confront(c, id) {
  const C = CELEB[id], s = c?.celebs; if (!C || !s?.bonds) return null;
  if (s.confront) return s.confront.id === id ? s.confront : null;
  const b = bondOf(c, id), f = first(C.name); if (!TOGETHER.includes(b.stage) || b.grieving || grave(c) || hurt(c)) return null;
  const live = (k) => k !== id && CELEB[k] && involved(s.bonds[k]) && !s.bonds[k].public && !b.knows.includes(k);
  let others = b.susOf.filter(live); if (!others.length) others = seeing(c).filter(live);
  if (!others.length) return null;
  others = others.slice(0, 3);
  const src = SRC[b.susSrc] ? b.susSrc : 'texts', O = listOf(others);
  const options = [{ key: 'confess', label: 'Tell her the truth' }, { key: 'deny', label: 'Deny it' }, { key: 'tabloids', label: 'Blame the papers' },
    { key: 'endOther', label: `End it with ${O}` }, { key: 'beg', label: b.begged ? 'Beg her - again' : 'Beg her to stay' }];
  s.confront = { id, otherIds: others, options, text: fill(pick(CONFRONT[src]), C, { other: O }), source: src, evidence: b.evidence, season: c.season, round: c.round, ticks: 0 };
  b.confronted = now(c); b.caught++;
  note(c, id, `${f} has found out about ${O}. She wants to talk.`, -1);
  mood(c, -8, `${f} found out`); mood(c, -6, `${f} found out`, 'composure');
  // (what is in the open already is news at once; what was private gets out half the time)
  if (b.public && (src === 'photo' || src === 'tipoff' || src === 'grid' || Math.random() < 0.5)) scandal(c, id, others[0], src);
  return s.confront;
}
/** you owned up to her about the others (a confession, now or on a date): she may stay, knowing - or she ends it -> { stays, text } */
const owned = (c, id, others) => {
  const C = CELEB[id], b = bondOf(c, id), f = first(C.name), T = C.traits, O = listOf(others);
  trustCeleb(c, id, -30);
  const p = clamp(0.18 + 0.6 * (T.free || 0) + (b.aff - 40) / 100 * 0.6 + b.trust / 250 - 0.2 * T.jealousy, 0.05, 0.9);
  if (Math.random() < p) {
    b.knows = [...new Set([...b.knows, ...others])]; b.suspicion = 0; b.evidence = 0; b.susOf = []; if ((T.free || 0) >= 0.5) b.exclusive = false;
    relateCeleb(c, id, -4); mood(c, 2, 'Told the truth', 'composure');
    const text = (T.free || 0) >= 0.5 ? `You tell ${f} the truth about ${O}. She listens, then shrugs. "I never asked you for for ever. Just do not lie to me again."`
      : `You tell ${f} the truth about ${O}. It is a long, quiet evening. She does not leave - but she will not forget it.`;
    note(c, id, text, 0); return { stays: true, text };
  }
  const r = endBond(c, id, true);
  return { stays: false, text: `You tell ${f} the truth about ${O}. She thanks you for that, at least. ${r.text}` };
};
/** the sneaky side of an evening with her (from the 3D scene): the phone that buzzed, the stories you told, the truth you owned up to -> a sentence for the evening */
const sneaks = (c, id, b, o) => {
  const f = first(CELEB[id].name), others = seeing(c).filter((k) => k !== id && !c.celebs.bonds[k].public && !b.knows.includes(k));
  if (o.confess && others.length) return ` ${owned(c, id, others).text}`;
  let sus = 0, t = '';
  if (o.buzz === 'answer' || o.buzz === 'step') { sus += 12; t = ` You step away to answer your phone. ${f} watches you go.`; }
  else if (o.buzz === 'excuse') { sus += 6; trustCeleb(c, id, -2); t = ` "Work stuff," you say, about the phone. ${f} nods.`; }
  else if (o.buzz) sus += 3;
  const n = Math.min(2, Number(o.cover) || 0); if (n) { sus -= 5 * n; trustCeleb(c, id, -n); }
  if (others.length && sus) { b.suspicion = clamp(b.suspicion + sus, 0, 100); if (sus > 0) { b.susOf = [...new Set([...others, ...b.susOf])].slice(0, 4); b.susSrc = b.susSrc || 'texts'; b.susAt = now(c); } }
  return t;
};
/**
 * Answer her (key: one of the confrontation's options) - and she decides. confess: trust -30, she may stay if she is
 * a free spirit or very fond of you, and she knows; deny: works when she has little to go on (suspicion -20), else trust
 * -50 and she leaves; tabloids: blame the papers - easier with little evidence and a good public image; endOther: you
 * end it with the other(s), she stays (trust -15); beg: affection +5, trust -10, and it rarely works twice. Clears the
 * confrontation -> { ok, text, stays, id }
 */
export function resolveConfront(c, key) {
  const s = c?.celebs, cf = s?.confront; if (!cf) return { ok: false, text: 'Nobody is waiting for an answer.', stays: true, id: null };
  const C = CELEB[cf.id]; if (!C) { s.confront = null; return { ok: false, text: 'Nobody is waiting for an answer.', stays: true, id: null }; }
  if (!(cf.options || []).some((o) => o.key === key)) return { ok: false, text: 'That is not an answer.', stays: true, id: cf.id };
  s.confront = null;
  if (cf.kind === 'ultimatum') return answerUltimatum(c, cf, key);
  const id = cf.id, b = bondOf(c, id), f = first(C.name), T = C.traits, ev = Math.max(b.evidence || 0, cf.evidence || 0), img = c.pr?.image ?? 10;
  const others = (cf.otherIds || []).filter((k) => k !== id && CELEB[k] && involved(s.bonds[k])), O = listOf(others.length ? others : cf.otherIds || []);
  if (!TOGETHER.includes(b.stage) || b.grieving) return { ok: true, text: `It no longer matters: you and ${f} are not together.`, stays: false, id };
  let text = '', stays = true;
  const leave = (why) => { stays = false; text = `${why} ${endBond(c, id, true).text}`; };
  if (key === 'confess') {
    const r = others.length ? owned(c, id, others) : { text: `You tell ${f} the truth. It is over with ${O} anyway, and she knows it. She stays - for now.`, stays: true };
    text = r.text; stays = r.stays;
  } else if (key === 'deny') {
    if (Math.random() < clamp(0.9 - ev / 100 * 1.1 + b.trust / 300, 0.05, 0.85)) {
      b.suspicion = Math.max(0, b.suspicion - 20); b.evidence = Math.max(0, b.evidence - 15); trustCeleb(c, id, -2);
      text = `You tell ${f} there is nothing in it. She wants to believe you, and for now she does.`;
    } else { trustCeleb(c, id, -50); leave(`You tell ${f} there is nothing in it. She has seen too much to believe that.`); }
  } else if (key === 'tabloids') {
    const p = clamp(0.65 - ev / 100 * 0.9 + clamp(img, -100, 100) / 200 + (cf.source === 'photo' || cf.source === 'tipoff' ? 0.1 : cf.source === 'texts' ? -0.15 : 0), 0.05, 0.85);
    if (Math.random() < p) {
      b.suspicion = Math.max(0, b.suspicion - 25); b.evidence = Math.max(0, b.evidence - 10); trustCeleb(c, id, -4);
      text = `You blame the papers: long lenses, old photographs, stories that write themselves. ${f} has been in the tabloids enough to know how it works. She lets it go.`;
    } else {
      trustCeleb(c, id, -25); relateCeleb(c, id, -10, `${f} did not believe you`);
      text = `You blame the papers. ${f} looks at you for a long moment. "Do not do that. Not to me."`;
      const L = upset(c, id, `${f} is hurt, and angry.`); stays = TOGETHER.includes(b.stage); if (L.length > 1) text += ` ${L.slice(1).join(' ')}`;
    }
  } else if (key === 'endOther') {
    const ended = others.map((k) => endBond(c, k, false).text);
    trustCeleb(c, id, -15); b.suspicion = 10; b.evidence = 0; b.susOf = [];
    text = others.length ? `You end it with ${O}. ${f} stays - warily: trust will take time. ${ended[0] || ''}`.trim() : `It is already over with ${O}. ${f} stays - warily.`;
  } else if (key === 'beg') {
    b.begged++; relateCeleb(c, id, 5); trustCeleb(c, id, -10);
    if (Math.random() < (b.begged === 1 ? clamp(0.5 + (b.aff - 40) / 100 * 0.5, 0.15, 0.8) : 0.12)) {
      b.suspicion = Math.max(0, b.suspicion - 15); text = `You ask ${f} for another chance. She gives you one. "The last one," she says.`;
    } else leave(`You ask ${f} for another chance. ${b.begged > 1 ? '"You said that last time."' : '"I cannot."'}`);
  }
  // (a confession and a parting write their own lines in the log)
  if (stays && key !== 'confess') note(c, id, `You and ${f} talked it through.`, 0);
  return { ok: true, text, stays, id };
}
// ---- the ones who like trouble ---------------------------------------------------------------------------------------
const ULTIMATUM = ['"I am done being the secret," says {her}. "{other} or me. Choose."', '"I do not share," says {her}, which is rich, considering. "End it with {other}, or end it with me."',
  '{her} puts her phone face down on the table. "{other}. Is that going to be a problem for much longer?"'];
/**
 * The ones who like trouble (traits.wreck): she is seeing you while someone else has you too, and she wants to be the
 * one. Now and then (more often the keener she is, much more once you have asked her to wait) she makes a move: she
 * turns up at your next race - where the other one may well be - or she gives you an ultimatum (her, or them: a
 * confrontation of its own), or, kept waiting once too often, she tips off The Paddock Post. One move a round -> [lines]
 */
const wreckers = (c) => {
  const s = c.celebs, W = seeing(c), out = [];
  for (const id of W) {
    const C = CELEB[id], T = C.traits, b = s.bonds[id]; if (!T.wreck || b.grieving || b.aff < 40 || ago(c, b.since) < 2) continue;
    const rivals = W.filter((k) => k !== id); if (!rivals.length) continue;
    if (Math.random() > 0.1 + 0.3 * T.wreck + (b.stalled ? 0.25 : 0)) continue;
    const f = first(C.name), O = listOf(rivals.slice(0, 2));
    if (b.stalled >= 2 || (b.stalled && Math.random() < 0.5)) {
      // (tired of waiting: the story goes to the papers)
      b.stalled = 0;
      const r = exposure(c, 'tipoff', [id], 1.4, rivals);
      out.push(`Somebody tipped off The Paddock Post about you and ${f}. You have a fair idea who.`); if (r?.text) out.push(r.text);
      note(c, id, `${f} stopped waiting quietly.`, -1);
    } else if (!s.confront && ago(c, b.ultAt) >= 3 && Math.random() < 0.6) {
      s.confront = { kind: 'ultimatum', id, otherIds: rivals.slice(0, 3), text: fill(pick(ULTIMATUM), C, { other: O }), source: 'ultimatum', evidence: 0, season: c.season, round: c.round, ticks: 0,
        options: [{ key: 'chooseHer', label: `Choose ${f}: end it with ${O}` }, { key: 'stall', label: 'Ask her for time' }, { key: 'endHer', label: `End it with ${f}` }] };
      b.ultAt = now(c); note(c, id, `${f} wants an answer: her, or ${O}.`, -1);
      out.push(`${f} is tired of sharing you. She wants an answer: her, or ${O}.`);
    } else if (!b.invited) {
      // (she will be at your next race - whoever else is there)
      b.invited = now(c);
      out.push(`${f} says she will be at the next race, whether you asked her or not.`);
    }
  }
  return out;
};
/** your answer to her ultimatum - chooseHer (the others ended; you go public together), stall (time bought, once), endHer (she may not go quietly) -> { ok, text, stays, id } */
const answerUltimatum = (c, cf, key) => {
  const s = c.celebs, id = cf.id, C = CELEB[id], b = bondOf(c, id), f = first(C.name), T = C.traits;
  const others = (cf.otherIds || []).filter((k) => k !== id && CELEB[k] && involved(s.bonds[k])), O = listOf(others.length ? others : cf.otherIds || []);
  if (!TOGETHER.includes(b.stage) || b.grieving) return { ok: true, text: `It no longer matters: you and ${f} are not together.`, stays: false, id };
  if (key === 'chooseHer') {
    const ended = others.map((k) => endBond(c, k, false).text);
    b.stalled = 0; relateCeleb(c, id, 12, `You chose ${f}`); trustCeleb(c, id, 8);
    const was = b.public; b.stage = 'partner'; b.secret = false; b.public = true; b.official = now(c); b.exclusive = true; s.partner = id;
    mood(c, 4, `Chose ${f}`);
    if (!was) pr(c, 'official', { celeb: id, celebName: C.name, job: C.job });
    const text = `You end it with ${O} and go public with ${f}. She does not even pretend to be surprised.${ended[0] ? ` ${ended[0]}` : ''}`;
    note(c, id, text, 1); return { ok: true, text, stays: true, id };
  }
  if (key === 'stall') {
    b.stalled = (b.stalled || 0) + 1; relateCeleb(c, id, -4); trustCeleb(c, id, -5);
    const text = b.stalled > 1 ? `"You said that last time," says ${f}. She does not say what happens next.` : `"Fine," says ${f}. "But I am not waiting for ever."`;
    note(c, id, text, -1); return { ok: true, text, stays: true, id };
  }
  // (endHer: she does not always go quietly - the louder she is, the likelier the papers hear about it first)
  const spite = Math.random() < 0.25 + 0.6 * T.drama * T.wreck;
  const r = spite ? exposure(c, 'tipoff', [id], 1.6, others) : null;
  const end = endBond(c, id, false).text;
  const text = `${end}${spite ? ' By the morning, The Paddock Post has the story.' : ''}${r?.text ? ` ${r.text}` : ''}`.trim();
  return { ok: true, text, stays: false, id };
};
/** how likely you are to be found out, across everyone you are seeing -> { v: 0..100, label: 'None' | 'Low' | 'Medium' | 'High' } */
export function riskOf(c) {
  const W = seeing(c), s = c?.celebs, n = s ? Object.keys(s.bonds).filter((k) => involved(s.bonds[k])).length : 0;
  if (n < 2) return { v: 0, label: 'None' };
  const v = clamp(Math.round(Math.max(0, ...W.map((k) => s.bonds[k].suspicion || 0)) + 8 * W.filter((k) => s.bonds[k].secret).length + ((c.pr?.heat || 0) > 50 ? 10 : 0) + (s.confront ? 30 : 0)), 0, 100);
  return { v, label: v < 25 ? 'Low' : v < 55 ? 'Medium' : 'High' };
}

// ---- race day: who is on the grid ------------------------------------------------------------------------------------
// (a small seeded random: the same guests for a round however often it is asked)
const rng = (s) => {
  let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = (h + 0x6d2b79f5) | 0; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};
/**
 * The celebrities at a race: your partner and anyone you invited always, then two or three in all, drawn by the
 * circuits they like and how well you know them (never one in mourning this season). A quick race (c = null): two at
 * random -> [ids]
 */
export function celebsAtRace(c, trackId) {
  const R = c ? rng(`${c.season}|${c.round}|${trackId}`) : Math.random, s = c?.celebs?.bonds ? c.celebs : null, forced = [];
  if (s) {
    if (s.partner && CELEB[s.partner] && !s.bonds[s.partner]?.grieving) forced.push(s.partner);
    for (const [id, b] of Object.entries(s.bonds)) if (CELEB[id] && b.invited && b.invited.season === c.season && b.invited.round === c.round && !b.grieving && !forced.includes(id)) forced.push(id);
  }
  const n = c ? Math.max(forced.length, R() < 0.5 ? 3 : 2) : 2, out = forced.slice(0, 3);
  const pool = CELEBS.filter((C) => !out.includes(C.id) && !(s?.bonds[C.id]?.grieving && s.bonds[C.id].griefSeason === c.season)).map((C) => {
    const b = s?.bonds[C.id]; let w = 1 + (C.often.includes(trackId) ? 2 : 0);
    if (b) w *= b.stage === 'ex' ? 0.4 : SI(b.stage) >= 1 && SI(b.stage) <= 4 ? 1.4 : 1;
    return { id: C.id, w };
  });
  while (out.length < n && pool.length) {
    let x = R() * pool.reduce((a, p) => a + p.w, 0), i = 0;
    while (i < pool.length - 1 && (x -= pool[i].w) > 0) i++;
    out.push(pool.splice(i, 1)[0].id);
  }
  return out;
}
/** your partner, or the celebrity you invited, at this round's race -> id | null */
export function partnerAtRace(c) {
  const s = c?.celebs; if (!s?.bonds) return null;
  if (s.partner && CELEB[s.partner] && !s.bonds[s.partner]?.grieving) return s.partner;
  return Object.keys(s.bonds).find((id) => CELEB[id] && s.bonds[id].invited && ago(c, s.bonds[id].invited) === 0 && !s.bonds[id].grieving) || null;
}

// ---- the round's end ---------------------------------------------------------------------------------------------------
/** messages with her over the week just gone that are still on your phone (Social.js threads, read as plain JSON, and the hub's quick message) -> n */
const textsWith = (c, id) => {
  const T = c.social?.phone?.threads?.['c:' + id], b = c.celebs.bonds[id];
  return (Array.isArray(T) ? T.filter((m) => m && m.season != null && ago(c, m) <= 1).length : 0) + (b?.msgRound && ago(c, b.msgRound) <= 1 ? 1 : 0);
};
/** what could give you away over a round (W: everyone you are seeing): messages she was not meant to see, a tabloid tip-off while the heat is up, paddock gossip -> [lines] */
const giveaway = (c, W) => {
  const s = c.celebs, out = [], add = (r) => { if (r?.text) out.push(r.text); }, unaware = (a) => W.filter((k) => k !== a && !s.bonds[k].knows.includes(a));
  for (const a of W) {
    const A = s.bonds[a], n = A.public ? 0 : textsWith(c, a); if (!n) continue;
    for (const w of unaware(a)) {
      // (she sees your phone more when she sees you; a jealous one looks; a relationship you are not even hiding is easier to spot)
      const T = CELEB[w].traits, met = ago(c, s.bonds[w].last) <= 1;
      if (Math.random() < clamp((0.1 + 0.35 * T.jealousy) * (met ? 1.3 : 0.6) * Math.min(1, 0.35 + 0.15 * n) * (A.secret ? 1 : 1.4), 0, 0.6)) add(exposure(c, 'texts', [a], 1, [w]));
    }
  }
  const heat = c.pr?.heat || 0, sec = W.filter((k) => s.bonds[k].secret && !s.bonds[k].public);
  if (heat > 50) for (const a of sec) if (Math.random() < (heat - 50) / 100 * 0.6) { const by = unaware(a); if (by.length) add(exposure(c, 'tipoff', [a], 1, [by.includes(s.partner) ? s.partner : pick(by)])); }
  // (friends in the paddock hear things - never anyone named: nobody real is made a gossip)
  const fr = Object.values(c.social?.friends || {}).filter((x) => (x?.level || 0) >= 35).length;
  if (fr && sec.length && Math.random() < Math.min(0.09, 0.03 * fr)) { const a = pick(sec), by = unaware(a); if (by.length) add(exposure(c, 'friend', [a], 1, [pick(by)])); }
  return out;
};
/**
 * Once a round (Career.applyRace, after the round moves on): a race she came to watch counts as seeing her; without
 * contact affection drifts (flirting -4, dating -5, partner -3; a message or your partner at the track halves it); three
 * rounds without seeing her upsets her; a date she agreed to lapses after three rounds; the papers (photographs of a
 * couple not yet known - the end of a secret - and a rumour about her); what she heard about the grid. More than one at
 * once: suspicion fades when nothing new turns up, messages, tip-offs and gossip may give you away, and a woman who is
 * sure enough wants to talk; a confrontation left unanswered for two rounds ends it. How it is going: each good
 * relationship steadies you (morale +2 for the first, +1 for each more, +4 at most; a happy partner focus +2), a
 * strained partner does not, and each secret beyond the first relationship costs composure -2. A grave round, or while
 * you recover from an injury, all of it waits -> { lines }
 */
export function celebRoundTick(c) {
  const lines = []; if (!c) return { lines };
  const s = c.celebs?.bonds ? c.celebs : celebEnsure(c), quiet = grave(c) || satOut(c), last = lastPos(c), good = [], strained = [];
  // (a confrontation left unanswered: a round of silence is an answer of its own, and after two she is gone)
  const cf = s.confront;
  if (!quiet && cf && ago(c, cf) >= 1) {
    const C = CELEB[cf.id], b = s.bonds[cf.id];
    if (!C || !b || !TOGETHER.includes(b.stage)) s.confront = null;
    else if (++cf.ticks >= 2) {
      s.confront = null; const t = `${first(C.name)} waited for an answer that never came.`; note(c, cf.id, t, -1);
      // (an ultimatum left unanswered: she goes, and she makes sure the others hear about her on the way out)
      const r = cf.kind === 'ultimatum' ? exposure(c, 'tipoff', [cf.id], 1.4, cf.otherIds || []) : null;
      lines.push(t, endBond(c, cf.id, true).text); if (r?.text) lines.push(r.text);
    }
    else { trustCeleb(c, cf.id, -8); lines.push(`${first(C.name)} is still waiting for you to talk to her.`); }
  }
  for (const id of Object.keys(s.bonds)) {
    const C = CELEB[id], b = s.bonds[id]; if (!C) continue;
    const f = first(C.name), T = C.traits, came = !!b.invited && ago(c, b.invited) === 1;
    if (b.invited && ago(c, b.invited) >= 1) b.invited = null;   // (an invitation is for one race: the one just run)
    if (quiet || b.grieving || b.stage === 'stranger' || b.stage === 'ex') continue;
    const contact = ago(c, b.last) <= 1 || came, half = !contact && (ago(c, b.msgRound) <= 1 || id === s.partner);
    if (came) relateCeleb(c, id, 2 + (T.likes.includes('winner') && last <= 3 ? 2 : 0), `${f} came to watch you race`);
    b.idle = contact ? 0 : b.idle + 1;
    const dec = { flirting: 4, dating: 5, partner: 3 }[b.stage] || 0;
    if (!contact && dec) relateCeleb(c, id, -(half ? Math.ceil(dec / 2) : dec) - (T.dislikes.includes('neglect') && b.idle >= 2 ? 1 : 0));
    if (b.accepted && ago(c, b.accepted) >= 4) { b.accepted = null; relateCeleb(c, id, -4, 'You never called'); lines.push(`${f} said yes to a date weeks ago. You never called.`); }
    if (b.stage !== 'dating' && b.stage !== 'partner') continue;
    if (b.idle >= 3) { b.idle = 0; upset(c, id, `${f} feels neglected: three rounds without seeing you.`, lines); if (b.stage === 'ex') continue; }
    // (the papers: a couple nobody knows about yet, photographed - a couple keeping it quiet is careful, but not always careful enough; now and then a rumour about her)
    if (!b.public && Math.random() < C.fame / 100 * 0.22 * (b.secret ? 0.35 : 1)) {
      const was = b.secret; b.secret = false;
      pr(c, 'rumour', { celeb: id, celebName: C.name, job: C.job, other: null, otherName: null });
      lines.push(`Photographs of you and ${C.name} appear in the tabloids.${was ? ' The secret is out.' : ''}`);
      const r = exposure(c, 'photo', [id], 0.8); if (r?.text) lines.push(r.text);
      b.photos++; b.public = true;
      if (T.privacy >= 0.6) { upset(c, id, `${f} hates seeing your private life in the papers.`, lines); if (b.stage === 'ex') continue; }
    } else if (Math.random() < 0.03 + 0.05 * T.drama) {
      const man = pick(MEN); pr(c, 'rumour', { celeb: id, celebName: C.name, job: C.job, other: null, otherName: man });
      lines.push(`A tabloid links ${C.name} with ${man}. Her team calls it nonsense.`); mood(c, -2, 'Tabloid noise', 'composure');
    }
    // (what she heard about the grid: you flirting with someone else, out of shot - with someone you are secretly seeing, it makes her wonder)
    const E = s.eyes;
    if (E && E.id !== id && CELEB[E.id] && ago(c, E) <= 1 && Math.random() < 0.25 + 0.45 * T.jealousy) {
      const eb = s.bonds[E.id];
      if (involved(eb) && !eb.public && !b.knows.includes(E.id)) { relateCeleb(c, id, -3); const r = exposure(c, 'friend', [E.id], 0.8, [id]); if (r?.text) lines.push(r.text); }
      else { relateCeleb(c, id, -4); upset(c, id, `${f} heard you were flirting with ${first(CELEB[E.id].name)} on the grid.`, lines); if (b.stage === 'ex') continue; }
    }
    // (how it is going: counted after every bond has had its round)
    if (b.aff >= 50) good.push(id); else if (b.stage === 'partner' && b.aff < 0) strained.push(id);
    // (suspicion fades when nothing new turns up - faster when things are good between you)
    if (b.suspicion && ago(c, b.susAt) >= 1) { b.suspicion = Math.max(0, b.suspicion - (contact && b.aff >= 40 ? 6 : 4)); b.evidence = Math.max(0, b.evidence - 6); if (!b.suspicion) b.susOf = []; }
    if (contact && b.upset && b.aff >= 40) { b.upset--; if (b.upset < 2) b.ultimatum = false; }
  }
  if (!quiet) {
    const W = seeing(c), G = good.filter((k) => W.includes(k));
    if (G.length) {
      const why = `Things are good with ${listOf(G)}`; mood(c, Math.min(4, 1 + G.length), why);
      if (G.some((k) => s.bonds[k].stage === 'partner')) mood(c, 2, why, 'focus');
    }
    for (const k of strained) if (W.includes(k)) mood(c, -4, `Things are strained with ${first(CELEB[k].name)}`);
    // (juggling: every secret beyond the first relationship wears on you)
    if (W.length >= 2) {
      const sec = W.filter((k) => s.bonds[k].secret).length, st = 2 * Math.min(sec, W.length - 1);
      if (st) { mood(c, -st, 'Juggling more than one relationship', 'composure'); if (st >= 4) lines.push(`Keeping ${sec} relationships quiet is wearing on you (composure -${st}).`); }
      lines.push(...giveaway(c, W));
    }
    // (the ones who like trouble make their moves: a turn at your race, an ultimatum, a tip-off)
    if (W.length >= 2) lines.push(...wreckers(c));
    // (she is sure enough: the most suspicious one wants to talk, if nobody else is waiting)
    if (!s.confront) {
      const k = seeing(c).filter((x) => ripe(s.bonds[x])).sort((a, b) => s.bonds[b].suspicion - s.bonds[a].suspicion)[0];
      const nc = k ? confront(c, k) : null; if (nc) lines.push(`${first(CELEB[k].name)} has found out about ${listOf(nc.otherIds)}, and she wants to talk.`);
    }
  }
  if (s.eyes && ago(c, s.eyes) >= 1) s.eyes = null;
  return { lines };
}

// ---- your driver changes ---------------------------------------------------------------------------------------------
/**
 * Your driver has died: whoever he was close to is left in peace - no partner, every bond that was more than a
 * friendship goes back to an acquaintance and she is in mourning (not at the races for the rest of the season; after
 * that, only quiet words). No break-up, no story, no morale; one measured line in the log -> how many were affected
 */
export function grieve(c) {
  const s = c.celebs?.bonds ? c.celebs : celebEnsure(c), me = meOf(c); let n = 0, near = null;
  for (const [id, b] of Object.entries(s.bonds)) {
    if (!CELEB[id] || !(['flirting', 'dating', 'partner'].includes(b.stage) || b.accepted)) continue;
    if (!near || b.stage === 'partner') near = id;
    b.stage = 'met'; b.grieving = true; b.griefSeason = c.season; b.accepted = null; b.invited = null; b.public = false; b.upset = 0; b.ultimatum = false; b.flirts = 0; b.idle = 0; n++;
  }
  // (no secrets, no suspicion, nothing waiting to be answered: none of it matters now)
  for (const b of Object.values(s.bonds)) { b.secret = false; b.exclusive = false; b.suspicion = 0; b.evidence = 0; b.susOf = []; b.knows = []; b.hintAt = null; }
  s.partner = null; s.eyes = null; s.confront = null; s.exp = null;
  if (n) note(c, near, `Those who were close to ${me?.name || 'your driver'} have asked for privacy.`, 0);
  return n;
}
/** a new driver of your choosing (the old one alive): a personal life starting afresh -> c.celebs (the career adds its own news line) */
export function resetForNewDriver(c) { c.celebs = celebState(); return c.celebs; }

// ---- her make-up (world/People.js's looks: clean - Clean Girl, baddie - Snatched Baddie, siren - Siren) ----------------
// (each her own by day, and a step up for an evening, a dinner, a night race's grid where it suits her; a look's name, or
// { look, lip } - a lip colour of her own)
const MAKEUP = {
  'mira-vale': { base: 'clean', evening: { look: 'siren', lip: '#8e1e30' } },   // (a wine-red lip with the red hair and the emerald)
  'lena-marsh': { base: 'clean', evening: 'baddie' },
  'sasha-ivers': { base: 'clean', evening: 'siren' },   // (the black bob and a classic red)
  'noor-haddad': { base: 'baddie', evening: 'baddie' },
  'ava-rennick': { base: 'siren', evening: 'siren' },
  'jade-okafor': { base: 'baddie', evening: { look: 'baddie', lip: '#6a2636' } },   // (a deep berry at night)
  'clara-voss': { base: 'clean', evening: 'baddie' },
  'elena-marchetti': { base: { look: 'siren', lip: '#a3302c' }, evening: 'siren' },   // (a brick red by day for the cameras)
  'priya-raman': { base: 'clean', evening: 'baddie' },
  'tessa-kealoha': { base: 'clean', evening: 'clean' },
  'maya-lindqvist': { base: 'clean', evening: 'clean' },
  // (her own glam by day: the snatched look with a longer, flatter cat-eye wing and a glass gloss; a raspberry red at night)
  'zoe-hartley': { base: { look: 'baddie', liner: { wing: 8, angle: 24 }, lips: { gloss: 0.9 } }, evening: { look: 'siren', lip: '#b01c4c' }, club: { look: 'baddie', liner: { wing: 9, angle: 26 }, lips: { fill: '#b01c4c', gloss: 1 } } },
};
// (a club's make-up, late: an evening's, or a look of her own for it - a lifted wing and a raspberry glass gloss, a
// smoked lid with a berry lip, a glossier clean face for the dance floor)
for (const [id, mk] of [['jade-okafor', { look: 'baddie', lip: '#6a2636', shadow: { intensity: 0.85 } }], ['tessa-kealoha', { look: 'clean', lips: { gloss: 1 }, sculpt: { highlight: 1 } }], ['lena-marsh', { look: 'baddie', lips: { gloss: 1 } }], ['priya-raman', { look: 'baddie', liner: { wing: 8.5 } }]]) if (MAKEUP[id]) MAKEUP[id].club = mk;
/** her make-up for the occasion: the evening one for an evening, a dinner or a night race's grid, a club's for a club (else the evening's), her own otherwise */
// (the pool's, by day: light and waterproof - a dewy, bronzed clean face and a gloss; a soft wing kept by the ones who
// never go without one; a red lip by the bolder; never a smoky lid in the sun)
for (const [id, mk] of [['mira-vale', { look: 'clean', lips: { gloss: 1 }, sculpt: { highlight: 1, dew: 1 } }], ['lena-marsh', 'clean'], ['sasha-ivers', { look: 'clean', lip: '#a3302c' }], ['noor-haddad', { look: 'clean', liner: { wing: 5.5 }, sculpt: { contour: 0.7 } }],
  ['ava-rennick', { look: 'clean', lip: '#b0122a', lips: { gloss: 1 } }], ['jade-okafor', { look: 'clean', liner: { wing: 4.5 }, lips: { gloss: 1 } }], ['clara-voss', 'clean'], ['elena-marchetti', { look: 'clean', lip: '#a3302c' }],
  ['priya-raman', { look: 'clean', liner: { wing: 5 } }], ['tessa-kealoha', { look: 'clean', sculpt: { highlight: 1, dew: 1 }, lips: { gloss: 1 } }], ['maya-lindqvist', 'clean'], ['zoe-hartley', { look: 'clean', liner: { wing: 6, angle: 24 }, lips: { gloss: 1 } }]]) if (MAKEUP[id]) MAKEUP[id].pool = mk;
const makeupFor = (C, occ, night) => { const m = MAKEUP[C?.id]; return m ? (occ === 'pool' ? m.pool || m.base : occ === 'club' ? m.club || m.evening || m.base : occ === 'evening' || occ === 'dinner' || (occ === 'grid' && night) ? m.evening || m.base : m.base) : 'soft'; };

// ---- her hair (world/People.js's styles: long, waves, blowout - voluminous sweeping waves, curlyLong, bob, pixie,
// ponytail, highpony - snatched high in a metal cuff, bun, topknot - a sleek gala knot, curlybun - a big loose bun on the
// crown, spiral ringlets left hanging round the face, messybun - a twisted messy one, loose curls down from the temples) --
// (by occasion - grid (by day), night (a night race's grid), wet, evening, dinner, casual, sporty, home - else her base,
// else her own; a list: one per event, picked as her outfits are - the same place in the list as the outfit's, where the
// two are as long: an updo with a backless halter or off the shoulders, waves with a gown)
const HAIRDO = {
  'mira-vale': { night: ['blowout', 'topknot'], wet: 'bun', evening: ['blowout', 'blowout', 'topknot'], dinner: ['curlybun', 'topknot'], sporty: 'ponytail' },
  'lena-marsh': { base: 'highpony', evening: ['topknot', 'highpony', 'topknot'], dinner: ['topknot', 'highpony'], home: 'ponytail' },
  'sasha-ivers': { base: 'bob' },
  'noor-haddad': { night: ['highpony', 'blowout', 'long'], wet: 'bun', evening: ['blowout', 'highpony', 'topknot'], dinner: ['blowout', 'topknot'], sporty: 'highpony' },
  'ava-rennick': { night: ['blowout', 'highpony'], wet: 'ponytail', evening: ['blowout', 'messybun', 'highpony', 'blowout'], dinner: ['blowout', 'topknot', 'waves'], sporty: 'highpony' },
  'jade-okafor': { night: ['highpony', 'curlybun'], evening: ['curlyLong', 'curlybun', 'highpony'], dinner: ['curlyLong', 'curlybun'], sporty: 'ponytail' },
  'clara-voss': { grid: 'highpony', night: ['highpony', 'topknot'], evening: ['blowout', 'topknot'], dinner: ['ponytail', 'topknot'], sporty: 'highpony' },
  'elena-marchetti': { night: ['blowout', 'topknot'], wet: 'bun', evening: ['blowout', 'blowout', 'topknot'], dinner: ['blowout', 'waves'], sporty: 'ponytail' },
  'priya-raman': { night: ['long', 'highpony'], evening: ['long', 'highpony', 'blowout'], dinner: ['blowout', 'highpony'], sporty: 'highpony' },
  'tessa-kealoha': { night: ['waves', 'highpony'], wet: 'ponytail', evening: ['waves', 'messybun', 'blowout'], dinner: ['waves', 'highpony'], sporty: 'ponytail' },
  'maya-lindqvist': { night: ['bun', 'messybun'], evening: 'topknot', dinner: ['bun', 'topknot'], sporty: 'ponytail' },
  // (long and full: voluminous blowout waves, snatched up into a high ponytail for the grid, a night race's leather and
  // its croppants, a sequin mini, a corset, karting and the rain; a messy bun at home)
  'zoe-hartley': { base: 'blowout', grid: 'highpony', night: ['highpony', 'blowout', 'highpony'], wet: 'highpony', evening: ['blowout', 'highpony', 'blowout'], dinner: ['blowout', 'highpony'], sporty: 'highpony', home: 'messybun' },
};
// (her hair beyond its style - People's style.fringe, tendrils, tone: the layered top with no fringe across it, two
// face-framing tendrils each side of a ponytail, a deeper wine shadow root melting into the burgundy)
// (a club's, picked with the outfit (wear.club: the same place in the list): up for a backless or a halter, or a high
// neck - the back and the earrings on show; down and full with a slip, a corset, a bandeau)
for (const [id, L] of [['mira-vale', ['blowout', 'topknot', 'curlybun', 'blowout']], ['lena-marsh', ['highpony', 'highpony', 'ponytail', 'topknot']], ['noor-haddad', ['highpony', 'topknot', 'blowout', 'long']],
  ['ava-rennick', ['highpony', 'blowout', 'waves', 'blowout']], ['jade-okafor', ['curlybun', 'curlyLong', 'highpony', 'curlyLong']], ['clara-voss', ['topknot', 'highpony', 'highpony']], ['elena-marchetti', ['blowout', 'topknot', 'highpony']],
  ['priya-raman', ['highpony', 'long', 'blowout', 'long']], ['tessa-kealoha', ['waves', 'messybun', 'waves']], ['maya-lindqvist', ['topknot', 'messybun', 'bun']], ['zoe-hartley', ['highpony', 'highpony', 'blowout', 'blowout']]]) if (HAIRDO[id]) HAIRDO[id].club = L;
// (at the pool, picked with the outfit (wear.pool): up to swim - a plait down the back (braid, from a low tie; highbraid,
// from a high one), a wet-look slick back (HAIR_X: slickback - to a low tie, slickbun, slickknot - a high bun, slickpony,
// slickbob), a messy bun, a high pony; long and loose, or waves, under a straw hat or with a cover-up at the cabana)
for (const [id, L] of [['mira-vale', ['braid', 'slickbun', 'waves', 'blowout']], ['lena-marsh', ['highbraid', 'slickpony', 'highpony', 'slickknot']], ['sasha-ivers', ['slickbob', 'bob', 'bob']], ['noor-haddad', ['slickback', 'highpony', 'long', 'braid']],
  ['ava-rennick', ['blowout', 'slickknot', 'braid', 'waves']], ['jade-okafor', ['curlybun', 'curlyLong', 'highbraid', 'curlyLong']], ['clara-voss', ['highbraid', 'slickknot', 'ponytail']], ['elena-marchetti', ['blowout', 'slickback', 'topknot', 'blowout']],
  ['priya-raman', ['slickback', 'highpony', 'braid', 'long', 'long']], ['tessa-kealoha', ['braid', 'messybun', 'slickpony', 'waves', 'waves']], ['maya-lindqvist', ['slickbun', 'messybun', 'topknot']], ['zoe-hartley', ['highbraid', 'slickback', 'highpony', 'blowout']]]) if (HAIRDO[id]) HAIRDO[id].pool = L;
/** the pool's own hair (a HAIRDO name -> People's style, and what goes with it): a plait (style.braid: a ponytail's or a
 * high one's tail plaited in three) and the wet look combed straight back (style.slick: darker and glossy as wet hair is,
 * no fringe, no tendrils) */
const HAIR_X = { braid: ['ponytail', { braid: true }], highbraid: ['highpony', { braid: true }], slickback: ['ponytail', { slick: true }], slickbun: ['bun', { slick: true }], slickknot: ['topknot', { slick: true }], slickpony: ['highpony', { slick: true }], slickbob: ['bob', { slick: true }] };
const HAIR_OPTS = { 'zoe-hartley': { fringe: false, tendrils: 2, tone: { root: '#3e1420', melt: 0.09 } } };
/** her make-up for the occasion (d) with a style's own over it (ov): a look's name, or a spec - the same look's values merged over hers, another look on its own */
const mergeMakeup = (d, ov) => {
  if (ov == null) return d;
  if (typeof ov !== 'object') return ov;
  const b = typeof d === 'string' ? { look: d } : { ...(d || {}) };
  if (ov.look && ov.look !== b.look) return { ...ov };
  const out = { ...b };
  for (const k of Object.keys(ov)) out[k] = ov[k] && typeof ov[k] === 'object' && b[k] && typeof b[k] === 'object' ? { ...b[k], ...ov[k] } : ov[k];
  return out;
};
// (hair worn long goes up in a ponytail for karting, unless she has her own way for it)
const LONG_HAIR = new Set(['long', 'waves', 'curlyLong', 'blowout']);
/** her hair for the occasion (HAIRDO; pick: the event's choice from a list) -> a People hair style */
const hairdoFor = (C, L, occ, night, wet, pick) => { const h = HAIRDO[C?.id] || {}, k = occ === 'grid' ? (wet && h.wet) || (night && h.night) || h.grid : h[occ]; return pick(k || h.base) || (occ === 'sporty' && LONG_HAIR.has(L.hs) ? 'ponytail' : L.hs || 'long'); };
// (a hot race's grid by day - the desert, the Gulf, Miami - wears wear.hot: the circuits the game has, or may have)
const HOT_GRID = new Set(['lasvegas', 'miami', 'abudhabi', 'yasmarina', 'bahrain', 'jeddah', 'qatar', 'losail', 'singapore', 'austin', 'mexico', 'saopaulo', 'interlagos', 'baku']);
/** the pool's cover-ups (People's SWIM_INFO cover and shirt): never worn in the water */
const POOL_COVER = new Set(['pareo', 'crochetmini', 'meshcover', 'kaftan', 'openshirt', 'lacecover']);
/**
 * her outfits for the occasion (W her wardrobe; o as celebLook's; night: a night race's) -> [fit] | fit | undefined: on the
 * grid a wet race's coat, a night race's, a hot race's by day (o.hot, else by o.track), else the grid's own; any other
 * occasion its own, else casual
 */
const wearFor = (W, occ, o, night) => (occ === 'grid' ? (o.wet && W.wet) || (night && W.night) || (!night && !o.wet && (o.hot ?? HOT_GRID.has(o.track)) && W.hot) || W.grid : W[occ] || W.casual);
/** at the pool: in the water (o.water) only what is swum in; a cover-up over her swimwear only (o.cover - a pool night on a roof); all of it when she has none of them */
const poolOnly = (Lw, occ, o) => { if (occ !== 'pool' || !Array.isArray(Lw) || !(o.water || o.cover)) return Lw; const cv = !!o.cover && !o.water, f = Lw.filter((F) => POOL_COVER.has(F?.kit) === cv); return f.length ? f : Lw; };

// ---- her figure (world/People.js's builds: slim, average, curvy, hourglass, fit) -----------------------------------------
// (each her own: a build, and her own share more or less of its bust and seat - curves { bust, seat }. A singer's and a
// DJ's full curves, an actress's and a designer's hourglass, a sprinter's and a surfer's athletic seat - high and round -
// with a lighter bust, a tennis player's toned and lean, a director's and a model's slim; never two quite alike)
const FIGURE = {
  'mira-vale': { build: 'curvy', curves: { bust: 1.04, seat: 1.02 } },
  'lena-marsh': { build: 'fit', curves: { bust: 0.95, seat: 1.14 } },
  'sasha-ivers': { build: 'slim', curves: { bust: 0.96, seat: 0.96 } },
  'noor-haddad': { build: 'hourglass', curves: { bust: 0.98, seat: 1.0 } },
  'ava-rennick': { build: 'hourglass', curves: { bust: 1.08, seat: 1.06 } },
  'jade-okafor': { build: 'curvy', curves: { bust: 1.08, seat: 1.14 } },
  'clara-voss': { build: 'fit', curves: { bust: 0.96, seat: 1.0 } },
  'elena-marchetti': { build: 'curvy', curves: { bust: 1.1, seat: 0.98 } },
  'priya-raman': { build: 'slim', curves: { bust: 0.98, seat: 1.02 } },
  'tessa-kealoha': { build: 'fit', curves: { bust: 1.02, seat: 1.1 } },
  'maya-lindqvist': { build: 'average', curves: { bust: 1.0, seat: 0.98 } },
  'zoe-hartley': { build: 'average', curves: { bust: 1.06, seat: 1.08 } },
};

// ---- how she looks (world/People.js makePerson) --------------------------------------------------------------------
/**
 * makePerson options for her: the figure, the outfit from her wardrobe for the occasion in her colours, skin and hair, a
 * hair style, a fuller lip, her face's shape, seeded by her id so she looks the same everywhere. o: { pose, detail,
 * occasion ('grid' (the default), 'evening', 'club', 'dinner', 'casual', 'sporty', 'home', 'pool'; any other: 'casual'),
 * night, wet, track (on the grid: a wet race's coat; a night race's - Las Vegas, unless told otherwise - dressier look; a
 * hot one's by day - HOT_GRID, or o.hot - its crops and co-ords), water (at the pool, standing in it: only what is swum
 * in), cover (at the pool, out of it all evening - a pool night on a roof: a cover-up over her swimwear), style (a
 * style of her own for this occasion, over everything she would otherwise wear - People's sanitizeStyle shape, run it
 * first on anything saved: { makeup (a look's name, or a make-up spec: the same look's values over her own for the
 * occasion, another look on its own), hair: { hs, color, tone, tendrils, fringe, shine }, wear: { kit, color, accent, legs
 * (null: bare), shoes, fabric, shoeFinish, cut }, jewel: { metal, earrings, chain, choker, cuffs, clutchColor,
 * clutchMetal }, acc: { earrings, clutch } (on or off) }) }
 */
export function celebLook(celeb, o = {}) {
  const C = typeof celeb === 'string' ? CELEB[celeb] : celeb, L = C?.look || {}, W = C?.wear || {}, occ = o.occasion || 'grid';
  const night = o.night ?? (o.track ? o.track === 'lasvegas' : false);
  // (an occasion with more than one outfit for it: which she wears this time, from the event (o.vary: the round, the
  // evening) - the same all through it, something else at the next)
  let h0 = 7; for (const ch of `${C?.id}|${occ}|${o.vary ?? 0}`) h0 = (h0 * 31 + ch.charCodeAt(0)) >>> 0;
  const pick = (x) => (Array.isArray(x) ? x[h0 % x.length] : x), L0 = wearFor(W, occ, o, night);
  const F = pick(poolOnly(L0, occ, o)) || null;
  // (her hair with it: the outfit's own (F.hs); else the occasion's list at the outfit's own place in her wardrobe's -
  // picked together, an updo with a backless one - and where the list is shorter, picked as ever; a pool's plait or wet
  // look its style and what goes with it - none of it when her own style says otherwise)
  const io = Array.isArray(L0) && F ? L0.indexOf(F) : -1, pickH = (x) => (Array.isArray(x) ? (io >= 0 && io < x.length ? x[io] : x[h0 % x.length]) : x);
  const hs0 = F?.hs || hairdoFor(C, L, occ, night, o.wet, pickH), HX = HAIR_X[hs0] || null, hs = HX ? HX[0] : hs0;
  // (a style of her own: what it says over hers - another kit's legs bare unless it says otherwise)
  const S = o.style && typeof o.style === 'object' ? o.style : null, Hr = S?.hair || {}, Wr = S?.wear || {}, HO = HAIR_OPTS[C?.id], kit = Wr.kit || F?.kit || L.kit || 'dress';
  const R = { pose: o.pose || L.pose || 'talk', kit, color: Wr.color || F?.outfit || L.outfit || '#2b2e35', accent: Wr.accent || F?.accent || L.accent || '#d4af6a', legs: 'legs' in Wr ? Wr.legs || undefined : Wr.kit && Wr.kit !== F?.kit ? undefined : F ? F.legs || undefined : L.legs || '#1b1b1f', skin: L.skin || '#e3b994', hair: Hr.color || L.hair || '#2b1d14',
    style: { hs: Hr.hs || hs, fh: null, lip: true, len: L.len ?? 0.94, wid: L.wid ?? 0.92, jaw: L.jaw ?? 0.3, makeup: S?.makeup != null ? mergeMakeup(makeupFor(C, occ, night), S.makeup) : makeupFor(C, occ, night), ...(HO ? { ...HO, ...(HO.tone ? { tone: { ...HO.tone } } : {}) } : {}) }, figure: 'f', build: FIGURE[C?.id]?.build, curves: FIGURE[C?.id]?.curves, seed: C?.id || String(celeb), cap: false, jitter: 0.01, detail: o.detail ?? 0.75, acc: F?.acc || [], shoes: Wr.shoes || F?.shoes || undefined };
  // (a night out's outfit as her wardrobe has it: its fabric, its shoes - sandals, boots - their finish, her jewellery for
  // it; her own style's over them, below - and none of it with another kit than the one it was chosen for)
  if (F && kit === F.kit) { for (const k of ['fabric', 'shoe', 'shoeFinish', 'cut']) if (F[k] != null) R[k] = F[k]; if (F.jewel) R.jewel = { ...F.jewel }; }
  if (HX && !Hr.hs) Object.assign(R.style, HX[1], HX[1].slick ? { fringe: false, tendrils: 0 } : {});
  if (S) {
    for (const k of ['fringe', 'tendrils', 'tone', 'shine']) if (k in Hr) R.style[k] = Hr[k];
    for (const k of ['fabric', 'shoe', 'shoeFinish', 'cut']) { const v = Wr[k] ?? S[k]; if (v != null) R[k] = v; }
    if (S.jewel && typeof S.jewel === 'object') R.jewel = { ...S.jewel };
    if (S.acc && typeof S.acc === 'object') { const A = new Set(R.acc); for (const k of ['earrings', 'clutch']) { if (S.acc[k] === true) A.add(k); else if (S.acc[k] === false) A.delete(k); } R.acc = [...A]; }
  }
  // (in the water, or sitting on its edge with her feet in it: barefoot)
  if (occ === 'pool' && o.water) R.shoe = 'bare';
  return R;
}
