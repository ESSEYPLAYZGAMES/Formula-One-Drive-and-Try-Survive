// Your driver's conscience (the driver career): what they did with the life they had, good and bad, kept as it
// happens - and, if they are killed, weighed (ui/Reckoning.js): Heaven or Hell. A moral compass, felt while you can
// still change it (the hub's DRIVER panel: which way the scales lean) and final when you cannot.
// What counts is what your driver chose to do, on the track and off it (career/PR.js prEvent - every public act of
// your driver passes through it - and career/Career.js applyRace for a clean race): a day for charity, a donation,
// time for the fans, walking away from a fight; starting a fight, goading a rival, a crash you caused, a penalty, a
// ban, defying the team or taking out a team-mate - and the team orders obeyed. Only your own driver is ever judged:
// never the real drivers on the grid, whatever happens to them.
//   c.soul = { v: 1, by: { key: { n, w (the total), label, good } }, sum, first: { season, round } }

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

/** the deeds by what passes through prEvent: kind (and its data) -> [key, weight, label] | null */
function deedOf(kind, x) {
  switch (kind) {
    case 'charity': return num(x.donation) > 0 ? ['donate', 3, 'Gave to charity'] : ['charity', 4, 'Gave a day to a good cause'];
    case 'fans': return ['fans', 1.5, 'Gave the fans their time'];
    case 'restraint': return ['restraint', 2.5, 'Walked away from a fight'];
    case 'brawl': return x.started ? ['brawlStart', -4 - (x.escalated ? 1 : 0), 'Started a fight'] : ['brawl', -1.5 - (x.escalated ? 1 : 0), 'Traded blows in a brawl'];
    case 'jab': return ['jab', -1.5, 'Goaded a rival'];
    case 'penalty': { const p = clamp(Math.round(num(x.pts)), 0, 12); return p ? ['penalty', -(0.5 + p * 0.5), 'Penalised by the stewards'] : null; }
    case 'crash': return x.blame ? ['crashBlame', -2.5, 'Caused a crash'] : null;
    case 'ban': return ['ban', -3, 'Banned for dangerous driving'];
    case 'orders': return ({ youObeyed: ['obeyed', 1.5, 'Did as the team asked'], youSacrificed: ['sacrifice', 3, 'Gave way for the team'], youRefused: ['defied', -2.5, 'Defied team orders'],
      youBrokeHold: ['brokeHold', -2, 'Broke a hold order'], youHeldUp: ['heldUp', -3.5, 'Held a team-mate up on purpose'], youHit: ['hitMate', -4, 'Took out a team-mate'] })[x.sub] || null;
    default: return null;
  }
}

/** a deed into the ledger (key, weight: + good, - bad; label: what it says on the scales) */
export function deed(c, key, w, label) {
  if (!c || !key || !num(w)) return;
  const S = c.soul || (c.soul = { v: 1, by: {}, sum: 0, first: { season: c.season, round: c.round } });
  const e = S.by[key] || (S.by[key] = { n: 0, w: 0, label, good: w > 0 });
  e.n++; e.w = Math.round((e.w + w) * 10) / 10; S.sum = Math.round((S.sum + w) * 10) / 10;
}
/** an event of your driver's (career/PR.js prEvent): its deed, if it is one */
export function deedFromEvent(c, kind, x = {}) {
  const D = deedOf(kind, x || {}); if (D) deed(c, D[0], D[1], D[2]);
}
/** the scales now: -> { sum, lean (-1..1), word } */
export function compass(c) {
  const s = num(c?.soul?.sum);
  const word = s >= 6 ? 'Heaven-bound' : s >= 2 ? 'Leaning towards heaven' : s > -2 ? 'In the balance' : s > -6 ? 'Leaning towards hell' : 'Hell-bound';
  return { sum: s, lean: clamp(s / 12, -1, 1), word };
}
/**
 * The judgement (the driver has died): the deeds on each side, heaviest first, and the verdict - Heaven when the good
 * weighs at least as much as the harm. -> { heaven, sum, good: [{ label, n, w }], bad: [...], lesson }
 */
export function judge(c) {
  const by = Object.values(c?.soul?.by || {}), sum = num(c?.soul?.sum);
  const good = by.filter((e) => e.w > 0).sort((a, b) => b.w - a.w), bad = by.filter((e) => e.w < 0).sort((a, b) => a.w - b.w);
  const heaven = sum >= 0, top = (L) => L.slice(0, 2).map((e) => e.label.toLowerCase());
  const lesson = heaven
    ? (good.length ? `What lifted you: ${top(good).join(' and ')}. The good you did outweighed the harm.` : 'You did no great good, and no great harm. The scales found nothing against you.')
    : `What dragged you down: ${top(bad).join(' and ')}. The harm you did, on the track and off it, outweighed the good.`;
  return { heaven, sum, good, bad, lesson };
}
