// The driver's mail (the driver career; ui/DriverMailPage.js is its page in the hub, the team principal's own mail -
// career/ManagerMail.js - is the model). What reaches a race driver's inbox in a season: the race engineer's report
// after every race (the result, the points, the mark and its reasons, Driver of the Day); a team that wants you,
// through your agent (career/Seat.js offers and approaches); a brand's offer (career/PR.js deals); the stewards'
// letter when points go on your licence, and the ban; the team principal when management's confidence in you moves a
// long way; your agent when your contract has half a season left; the season's awards and its end; a fan's letter on
// a great day. Each mail that wants something done carries a button to the page where it is done - the offers, the
// deals, the licence - the mail itself decides nothing.
//   c.dmail = { box: [mail], seq, snap: { offers, deals, pts, conf, warn, contract } }
//   mail: { id, from, org, col, subj, body: [paragraphs], terms: [[label, value]], go: [{ label, tab, sub }], tag, good, season, round, read }

const sur = (n) => String(n || '').trim().split(/\s+/).pop(), first = (n) => String(n || '').trim().split(/\s+/)[0];
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const usd = (m) => `$${(Math.round(num(m) * 10) / 10).toFixed(1)}M`;
const ENG_F = ['Gianpiero', 'Hugh', 'Tom', 'Peter', 'Riccardo', 'Xavier', 'Andrea', 'Jonathan'], ENG_L = ['Lambiase', 'Bird', 'Stallard', 'Bonnington', 'Adami', 'Marcos', 'Stella', 'Eddolls'];
const AG_F = ['Nicole', 'Raymond', 'Julia', 'Marc', 'Sophie', 'David'], AG_L = ['Hartley', 'Vermeulen', 'Okoro', 'Lindqvist', 'Moreau', 'Castellanos'];
const pick = (a, s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return a[(h >>> 0) % a.length]; };

export function dmailEnsure(c) {
  if (!c.dmail) c.dmail = { box: [], seq: 1, snap: {} };
  const M = c.dmail; M.box = M.box || []; M.snap = M.snap || {}; M.seq = M.seq || 1;
  if (!M.agent) M.agent = `${pick(AG_F, `ag|${c.playerId}`)} ${pick(AG_L, `ag2|${c.playerId}`)}`;
  if (!M.hello) {
    M.hello = true;
    post(c, { from: M.agent, org: 'Your agent', subj: 'Your inbox', tag: 'fyi',
      body: ['Everything that is business comes here now: the race report after every round, any team that asks about you, the brands, the stewards, the team principal when there is something to say.',
        'Anything that needs a decision has a button that takes you to it. Your phone is still for the people in your life.'] });
  }
  return M;
}
function post(c, m) {
  const M = c.dmail; m.id = `d${M.seq++}`; m.season = c.season; m.round = c.round; m.read = false;
  M.box.unshift(m); if (M.box.length > 80) M.box.length = 80;
  return m;
}
/** unread mail (the rail's badge) */
export const dmailUnread = (c) => (c?.dmail?.box || []).filter((m) => !m.read).length;
export function dmailRead(c, id) { const m = (c?.dmail?.box || []).find((x) => x.id === id); if (m && !m.read) { m.read = true; return true; } return false; }
export function dmailReadAll(c) { for (const m of c?.dmail?.box || []) m.read = true; }

const engineerOf = (c) => { const t = c.myTeam || c.team?.name || ''; return { from: `${pick(ENG_F, `en|${t}|${c.playerId}`)} ${pick(ENG_L, `en2|${t}|${c.playerId}`)}`, org: `Race engineer · ${t || 'your team'}`, col: c.team?.color }; };

/**
 * A race has been run (career/Career.js applyRace): the report, and whatever has come in since the last one - offers,
 * deals, points, management's mood, the contract. rep: the race's report (pos, points, mark, markWhy, dotd, trophies,
 * ban, salary, bonus...), row: your row (pos, car), trackName.
 */
export function dmailRound(c, rep = {}, o = {}) {
  const M = dmailEnsure(c), S = M.snap, me = c.me; if (!me) return;
  // the race report
  if (o.row && !rep.grave) {
    const E = engineerOf(c), r = o.row, dnf = !!r.car?.retired, pos = r.pos, pts = num(rep.points);
    const res = dnf ? `Out of the race${r.car?.retireReason ? ` (${String(r.car.retireReason).toLowerCase()})` : ''}` : `P${pos}${pts ? `, ${pts} point${pts === 1 ? '' : 's'}` : ''}`;
    const body = [dnf ? `Not the afternoon we wanted. ${r.car?.retireReason ? `${r.car.retireReason}.` : ''} We will go through it all before the next one.` : pos === 1 ? 'What a drive. A win - thank you, from all of us on the pit wall.' : pos <= 3 ? 'A podium. That was a strong one from start to finish.' : pts ? 'Points on the board. Good work.' : 'No points this time. There was more in it - we will find it.'];
    if (rep.mark != null) body.push(`The ratings gave you ${rep.mark}/10${rep.markWhy?.length ? `: ${rep.markWhy.join(', ')}` : ''}.`);
    if (rep.dotd?.id === me.id) body.push('And the fans voted you Driver of the Day.');
    const terms = [['Result', res]]; if (rep.mark != null) terms.push(['Rating', `${rep.mark}/10`]);
    if (num(rep.bonus) > 0) terms.push(['Bonus', usd(rep.bonus)]);
    post(c, { ...E, subj: `${o.trackName || 'The race'}: ${dnf ? 'DNF' : `P${pos}`}`, tag: 'report', good: !dnf && (pos <= 3 || pts > 0), body, terms });
    if (rep.trophies?.length) post(c, { ...E, subj: `Something for the cabinet: ${rep.trophies.join(', ')}`, tag: 'fyi', good: true, body: [`${rep.trophies.join(', ')} - it is in the trophy room now. Well earned.`], go: [{ label: 'THE TROPHIES', tab: 'trophies', sub: '' }] });
    if (!dnf && (pos === 1 || rep.dotd?.id === me.id) && Math.random() < 0.7) post(c, { from: 'A fan', org: 'Fan mail', subj: pos === 1 ? 'That win!' : 'Driver of the Day!', tag: 'fyi', good: true, body: [pick([`I have watched every race since I was six and I have never shouted like that. Thank you, ${first(me.name)}.`, `My whole family was on our feet. That is why we watch. Keep going!`, `I made a banner for the next race. You will see it at the first corner.`], `${c.season}|${c.round}|fan`)] });
  }
  // a team that wants you (career/Seat.js): each new offer once
  const seat = c.seat || {}, seen = new Set(S.offers || []);
  for (const of of seat.offers || []) {
    if (!of?.id || seen.has(of.id)) continue;
    const kind = { precontract: 'a pre-contract for next season', buyout: 'to buy out your contract', midseason: 'you, now', reserve: 'you as their reserve', renewal: 'to extend your contract', first: 'you for their seat', seat: 'you for their seat' }[of.kind] || 'you';
    post(c, { from: M.agent, org: 'Your agent', col: c.teams?.[of.team]?.color, subj: `${of.team} want ${kind}`, tag: 'offer', good: true,
      body: [`${of.team} have put an offer on the table: ${usd(of.salary)} a season for ${of.years} year${of.years === 1 ? '' : 's'}${of.role && of.role !== 'equal' ? `, as ${of.role === 'lead' ? 'their number one' : of.role}` : ''}.`, of.expect || 'Read it carefully before you answer.'],
      terms: [['Team', of.team], ['Salary', `${usd(of.salary)} a season`], ['Years', String(of.years)]], go: [{ label: 'SEE THE OFFER', tab: 'drivers', sub: 'offers' }] });
  }
  S.offers = (seat.offers || []).map((x) => x?.id).filter(Boolean);
  // a brand's offer (career/PR.js)
  const P = c.pr || {}, seenD = new Set(S.deals || []);
  for (const of of P.offers || []) {
    if (!of?.id || seenD.has(of.id)) continue;
    post(c, { from: of.brand || 'A brand', org: 'Partnerships', subj: `${of.brand || 'A brand'} would like to work with you`, tag: 'offer', good: true,
      body: [of.text || 'An offer to work together.', ...(of.clauses || []).slice(0, 2)], terms: [['Worth', `${usd(of.value)} a round`], ['For', `${of.rounds} rounds`]], go: [{ label: 'THE DEALS', tab: 'pr', sub: 'deals' }] });
  }
  S.deals = (P.offers || []).map((x) => x?.id).filter(Boolean);
  // the stewards: points on your licence, a ban
  const lic = Array.isArray(me.licence) ? me.licence : [], n0 = num(S.lic, lic.length);
  for (const e of lic.slice(n0)) post(c, { from: 'The Stewards', org: 'FIA', subj: `${e.pts} penalty point${e.pts === 1 ? '' : 's'} on your licence`, tag: 'fyi', good: false, body: [`For ${String(e.why || 'an offence').toLowerCase()}${e.at ? ` at ${e.at}` : ''}, ${e.pts} point${e.pts === 1 ? '' : 's'} ${e.pts === 1 ? 'has' : 'have'} been added to your super licence. Twelve within a year means a race ban.`], go: [{ label: 'YOUR LICENCE', tab: 'you', sub: 'licence' }] });
  S.lic = lic.length;
  if (rep.ban) post(c, { from: 'The Stewards', org: 'FIA', subj: 'Race ban', tag: 'fyi', good: false, body: [typeof rep.ban === 'string' ? rep.ban : 'With twelve points on your licence you will sit out the next race.'], go: [{ label: 'YOUR LICENCE', tab: 'you', sub: 'licence' }] });
  // the team principal, when management's confidence moves a long way (or a warning is given)
  if (seat.status === 'driver') {
    const conf = Math.round(num(seat.conf, 60)), tp = `${c.myTeam || 'The team'}`;
    if (seat.warn && !S.warn) post(c, { from: 'The team principal', org: tp, col: c.team?.color, subj: 'We need to talk', tag: 'fyi', good: false, body: ['The results are not where they need to be. I have backed you, but the board is asking questions. The next races matter.'], terms: [['Management confidence', String(conf)]], go: [{ label: 'YOUR SEAT', tab: 'drivers', sub: 'offers' }] });
    else if (S.conf != null && conf - S.conf >= 12) post(c, { from: 'The team principal', org: tp, col: c.team?.color, subj: 'Good work', tag: 'fyi', good: true, body: ['Just a note to say the factory has noticed. Keep doing what you are doing.'], terms: [['Management confidence', String(conf)]] });
    S.conf = conf; S.warn = !!seat.warn;
  }
  // your agent: half a season left on a contract that ends this year
  const k = me.contract; if (k && num(k.until, 0) <= c.season && c.round > c.rounds / 2 && S.contract !== c.season && !seat.next) {
    S.contract = c.season;
    post(c, { from: M.agent, org: 'Your agent', subj: 'Your contract ends this season', tag: 'fyi', good: false, body: [`Your deal with ${me.team || 'the team'} runs out at the end of ${c.season}. Teams are planning next year now - if you want to stay, or to move, this is when it is decided.`], go: [{ label: 'YOUR SEAT', tab: 'drivers', sub: 'offers' }] });
  }
}
/** the season is over: the awards and the review (career/Career.js seasonReview) */
export function dmailSeason(c, rv) {
  dmailEnsure(c); if (!rv) return;
  const A = (rv.awards || []).map((a) => `${a.title}: ${a.name} (${a.what})`);
  post(c, { ...engineerOf(c), subj: `Season ${rv.season}: P${rv.youPos || '-'} in the championship`, tag: 'report', good: (rv.youPos || 99) <= 10,
    body: [`${rv.champion?.name || 'The champion'} is champion. You finished P${rv.youPos || '-'} with ${rv.youPts} points.`, ...(A.length ? [`The season's awards - ${A.join('; ')}.`] : [])], go: [{ label: 'THE HISTORY', tab: 'trophies', sub: 'seasons' }] });
}
