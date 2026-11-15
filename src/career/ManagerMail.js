// The team principal's mail (career/Manager.js keeps it: c.mail; ui/ManagerMail.js is its page).
// What you ask of people outside your own office is not answered on the spot. An approach to a rival's pit crew chief
// goes through an intermediary and he thinks about it; a protest waits for the stewards to sit; a sponsor's board
// meets; a man on the market talks to his family; a driver's management reads the contract. You ask - it is in
// AWAITING REPLY - and the answer comes by mail after the next race, or the one after. Some answers are the end of
// it (the stewards' ruling, a sponsor's yes or no). Some are terms: he will come, for this much - and the signing is
// a button in the mail, good for two races. And the mail brings what would reach a principal's desk anyway: the
// team manager's report after each race, new parts on the car, a building finished, a rival after one of your
// people (answered from the mail), an offer for one of your drivers, the chairman when the board's mood moves.
//   c.mail = { box: [mail], out: [asked], clock, seq, snap }
//   mail:  { id, kind, from, org, col, subj, body: [paragraphs], terms: [[label, value]], acts: [{ id, label, hint, go }],
//            tag: 'offer' | 'reply' | 'fyi' | 'report', good, re, season, round, t, until, read, done, result, data }
//   asked: { id, kind, key, to, org, col, subj, body, season, round, due (clock), wait, data }
// The clock is a count of races run (and two for a winter): a thing asked before a race with a wait of one is
// answered after it.
// Not delayed: signing a free agent into an empty seat (a race cannot start with one), and what is yours alone to
// decide - a release, a talk with your own driver, the factory's orders (which take their own time already).
import { raidAsk, raidRefused, raidSign, protestLodge, protestRule, answerApproach, ROLE_NAME } from './Rivals.js';
import { propose, FAC } from './ManagerOps.js';
import { upgradeName } from './TechTree.js';
import { crewHire, CREW_ROLES } from './ManagerCrew.js';
import { hireEngineer, extendBlock } from './ManagerPeople.js';
import { scout, academyUp, contractAsk, ACADEMY_COST } from './Seasons.js';
import { signSupplier, SUPPLIERS } from './ManagerCar.js';

const r1 = (x) => Math.round(x * 10) / 10, rnd = Math.random, pick = (a) => a[(rnd() * a.length) | 0];
const sur = (n) => String(n || '').trim().split(/\s+/).pop(), first = (n) => String(n || '').trim().split(/\s+/)[0];
const STAFF = { td: 'Technical Director', strat: 'Head of Strategy', crew: 'Pit Crew Chief' };
const MGR_F = ['Helen', 'Marco', 'Sanjay', 'Ingrid', 'Paolo', 'Fiona', 'Dieter', 'Aiko'], MGR_L = ['Whitlock', 'Bianchi', 'Rao', 'Lindqvist', 'Ferraro', 'Drummond', 'Keller', 'Tanaka'];

export function mailEnsure(c) {
  if (!c.mail) c.mail = { box: [], out: [], clock: 0, seq: 1, snap: {} };
  const M = c.mail; M.box = M.box || []; M.out = M.out || []; M.snap = M.snap || {}; M.clock = M.clock || 0; M.seq = M.seq || 1;
  if (!M.tm) M.tm = `${pick(MGR_F)} ${pick(MGR_L)}`;   // (your team manager: the one who writes to you after every race)
  if (!M.hello) {
    M.hello = true;
    post(c, { kind: 'note', tag: 'fyi', from: M.tm, org: `Team Manager · ${c.myTeam}`, col: c.team?.color, subj: 'How things reach you now',
      body: ['Anything you ask of people outside this office takes time to come back. An approach to someone at another team, a protest, a sponsor\'s terms, a hire from the market, a contract extension, a prospect for the academy: you ask, it sits under AWAITING REPLY, and the answer arrives here after the next race - sometimes the one after.',
        'Some answers settle it. Others are terms, and the signing is a button in the mail itself - good for two races, then the offer lapses.',
        'I will write after every race with the result and the money. The factory and the board write when they have something to say.'] });
  }
  return M;
}
/** a mail into the box (newest first; the box keeps eighty - one still waiting for an answer is never dropped) */
function post(c, m) {
  const M = c.mail; m.id = `m${M.seq++}`; m.season = c.season; m.round = c.round; m.t = M.clock; m.read = false; m.done = !(m.acts && m.acts.length) ? undefined : false;
  if (m.acts?.length && m.until == null) m.until = M.clock + 2;
  M.box.unshift(m);
  if (M.box.length > 80) { for (let i = M.box.length - 1; i >= 0 && M.box.length > 80; i--) if (!(M.box[i].acts?.length && M.box[i].done === false)) M.box.splice(i, 1); }
  return m;
}
/** in words: when an answer is due */
export function dueWords(c, p) { const n = p.due - (c.mail?.clock || 0); return n <= 1 ? 'after the next race' : `in ${n} race weekends`; }
const openAct = (m) => !!(m.acts && m.acts.length && m.done === false);
export const mailUnread = (c) => (c.mail?.box || []).filter((m) => !m.read).length;
export const mailNeeds = (c) => (c.mail?.box || []).filter(openAct).length;
export const mailBadge = (c) => (c.mail?.box || []).filter((m) => !m.read || openAct(m)).length;

// ---- what can be asked ---------------------------------------------------------------------------------------------------
// each: key(data) - one of a kind at a time; btn(c, data) - the page's button(s) that asked [{ a, v }] (shown as waiting);
//       send(c, data) -> { no } | { to, org, col, subj, body, wait, note, data }; answer(c, p) -> posts the reply;
//       act(c, m, id) -> { text, ok } (a button in the reply)
const teamCol = (c, team) => c.teams?.[team]?.color || '#8a93a0';
const KINDS = {
  // ---- a rival's technical director, head of strategy or pit crew chief
  raid: {
    key: (d) => `raid|${d.team}|${d.role}`, btn: (c, d) => [{ a: 'rvraid', v: `${d.team}|${d.role}` }],
    send(c, d) {
      const R = raidAsk(c, d.team, d.role); if (R.no) return R;
      return { to: R.who.name, org: `${STAFF[d.role]} · ${d.team}`, col: teamCol(c, d.team), subj: `A conversation about ${c.myTeam}`, wait: rnd() < 0.4 ? 2 : 1,
        body: [`Through an intermediary, in confidence: ${c.myTeam} would like you as ${STAFF[d.role]}. We would meet the buy-out in your contract and improve your terms.`, 'Take the time you need.'],
        note: `Your approach to ${R.who.name} has gone through an intermediary ($0.2M).`, data: { name: R.who.name, fee: R.fee, odds: R.odds, rating: R.who.rating, salary: r1(R.who.salary * 1.15) } };
    },
    answer(c, p) {
      const d = p.data, t = c.teams[d.team], there = t?.ai?.staff?.[d.role]?.name === d.name;
      if (!there) return post(c, { kind: 'note', tag: 'reply', from: d.name, org: p.org, col: p.col, re: p.subj, subj: `Re: ${p.subj}`, good: false, body: ['Things have moved on since you wrote. I am no longer in a position to talk.'] });
      if (rnd() > d.odds) {
        raidRefused(c, d.team, d.name);
        post(c, { kind: 'note', tag: 'reply', from: d.name, org: p.org, col: p.col, re: p.subj, subj: `Re: ${p.subj}`, good: false, body: [`Thank you for thinking of me. I have talked it over at home and I am staying at ${d.team}: there is work here I want to finish.`, 'I would ask you not to raise it again this season.'] });
        if (rnd() < 0.6) post(c, { kind: 'note', tag: 'fyi', from: t.ai.boss, org: `Team Principal · ${d.team}`, col: p.col, subj: 'My people', good: false, body: [`I hear ${c.myTeam} have been talking to ${d.name}. The paddock is a small place.`, 'He is staying. Next time, call me first.'] });
        return null;
      }
      return post(c, { kind: 'raid', tag: 'offer', from: d.name, org: p.org, col: p.col, re: p.subj, subj: `Re: ${p.subj}`, good: true, data: d,
        body: [`I have thought about it, and yes: I would come to ${c.myTeam}.`, `My contract has a buy-out, which ${d.team} will insist on, and I would want the salary below. If that works for you, send the papers. I cannot keep this quiet for long.`],
        terms: [['Buy-out to ' + d.team, `$${d.fee}M`], ['Salary', `$${d.salary}M a season`], ['Rating', `${Math.round(d.rating * 100)}`]],
        acts: [{ id: 'yes', label: `SIGN HIM · $${d.fee}M`, go: true }, { id: 'no', label: 'WALK AWAY' }] });
    },
    act(c, m, id) { const d = m.data; if (id !== 'yes') return { text: `You let it go. ${d.name} stays at ${d.team}.`, ok: true }; return raidSign(c, d.team, d.role, d.name, d.fee); },
  },
  // ---- a protest against a rival's car
  protest: {
    key: () => 'protest', btn: (c, d) => [{ a: 'rvprot', v: d.team }],
    send(c, d) {
      const R = protestLodge(c, d.team); if (R.no) return R;
      return { to: 'The Stewards', org: 'FIA', col: '#1f3a8a', subj: `Protest: the legality of the ${d.team} car`, wait: 1, body: [`${c.myTeam} protest the parts ${d.team} have brought to the car in the last races, and ask that they be examined.`, 'The deposit of $0.5M is lodged with this protest.'], note: `Protest lodged against ${d.team} ($0.5M deposit).`, data: { last: R.last, grey: R.grey } };
    },
    answer(c, p) {
      const r = protestRule(c, p.data.team, p.data.last, p.data.grey);
      return post(c, { kind: 'note', tag: 'reply', from: 'The Stewards', org: 'FIA', col: '#1f3a8a', re: p.subj, subj: `Decision: ${r.ok ? 'protest upheld' : 'protest dismissed'}`, good: r.ok,
        body: [`The Stewards, having examined the ${p.data.team} car and heard both teams, decide as follows.`, r.text] });
    },
  },
  // ---- a technical director, a strategist, a crew chief from the market
  staff: {
    key: (d) => `staff|${d.role}`, btn: (c, d) => { const i = (c.hires?.[d.role] || []).findIndex((x) => x.name === d.name); return i >= 0 ? [{ a: 'hire', v: `${d.role}|${i}` }] : []; },
    send(c, d) {
      const p = c.hires?.[d.role]?.[d.i]; if (!p) return { no: 'No such person.' };
      const fee = r1(p.salary * 0.6); if (c.team.budget < fee) return { no: `Not enough money: the move costs $${fee}M.` };
      return { to: p.name, org: `${STAFF[d.role]} · available`, subj: `${STAFF[d.role]} at ${c.myTeam}`, wait: 1, body: [`We would like you to join ${c.myTeam} as ${STAFF[d.role]}: $${p.salary}M a season.`, 'Let us know.'], note: `Offer sent to ${p.name}.`, data: { name: p.name, salary: p.salary, rating: p.rating } };
    },
    answer(c, p) {
      const d = p.data, pool = c.hires?.[d.role] || [], i = pool.findIndex((x) => x.name === d.name), base = { from: d.name, org: p.org, re: p.subj, subj: `Re: ${p.subj}` };
      if (i < 0 || rnd() < 0.12) { if (i >= 0) pool.splice(i, 1); return post(c, { ...base, kind: 'note', tag: 'reply', good: false, body: ['I am sorry: I signed with another team last week. I wish you well with it.'] }); }
      const more = rnd() < 0.24, sal = more ? r1(d.salary * 1.1) : d.salary, fee = r1(d.salary * 0.6);
      return post(c, { ...base, kind: 'staff', tag: 'offer', good: true, data: { ...d, salary2: sal },
        body: more ? ['I am interested. But I have another offer on the table, and to say no to it I would need a little more than you wrote.', 'If you can do that, I can start at once.'] : [`Yes. I have followed ${c.myTeam} for a while and I think there is a lot to do there. I can start at once.`],
        terms: [['Salary', `$${sal}M a season${more ? ` (you offered $${d.salary}M)` : ''}`], ['To bring in', `$${fee}M`], ['Rating', `${Math.round(d.rating * 100)}`]],
        acts: [{ id: 'yes', label: `SIGN · $${fee}M`, go: true }, { id: 'no', label: 'DECLINE' }] });
    },
    act(c, m, id) {
      const d = m.data; if (id !== 'yes') return { text: `You pass on ${d.name}.`, ok: true };
      const i = (c.hires?.[d.role] || []).findIndex((x) => x.name === d.name); if (i < 0) return { text: `${d.name} is no longer available.`, ok: false };
      const r = c.hire(d.role, i), ok = !/^(Not|No )/.test(r); if (ok && d.salary2 && c.staff[d.role]) { c.staff[d.role].salary = d.salary2; c.save(); }
      return { text: r, ok };
    },
  },
  // ---- a pit crew member from the market
  crew: {
    key: (d) => `crew|${d.name}`, btn: (c, d) => { const i = (c.crew?.market || []).findIndex((x) => x.name === d.name); return i >= 0 ? [{ a: 'crewhire', v: `${i}` }] : []; },
    send(c, d) {
      const p = c.crew?.market?.[d.i]; if (!p) return { no: 'No such person.' };
      const fee = r1(p.salary * 1.5); if (c.team.budget < fee) return { no: `Not enough money: bringing ${p.name} in costs $${fee}M.` };
      const role = CREW_ROLES.find((R) => R.id === p.role)?.name || 'pit crew';
      return { to: p.name, org: `${role} · available`, subj: `A place in the ${c.myTeam} pit crew`, wait: 1, body: [`There is a place for you on ${role.toLowerCase()} in our crew. $${p.salary}M a season.`], note: `Offer sent to ${p.name}.`, data: { name: p.name, role } };
    },
    answer(c, p) {
      const d = p.data, mk = c.crew?.market || [], i = mk.findIndex((x) => x.name === d.name), base = { kind: 'note', tag: 'reply', from: d.name, org: p.org, re: p.subj, subj: `Re: ${p.subj}` };
      if (i < 0 || rnd() < 0.15) { if (i >= 0) mk.splice(i, 1); return post(c, { ...base, good: false, body: ['Thanks for the offer, but I have just agreed to go elsewhere. Good luck this season.'] }); }
      const r = crewHire(c, i), ok = !/^(Not|No )/.test(r);
      return post(c, { ...base, good: ok, body: ok ? ['I am in. I have handed my notice in and I will be in the garage for the next race.', r] : ['I would have come.', r] });
    },
  },
  // ---- a race engineer
  engineer: {
    key: (d) => `eng|${d.slot}`, btn: (c, d) => { const i = (c.engMarket || []).findIndex((x) => x.name === d.name); return i >= 0 ? [{ a: 'enghire', v: `${i}|${d.slot}` }] : []; },
    send(c, d) {
      const p = c.engMarket?.[d.i], was = c.engineers?.[d.slot]; if (!p || !was) return { no: 'No such engineer.' };
      if (c.team.budget < 0.8) return { no: `Not enough money: $0.8M to bring ${p.name} in.` };
      return { to: p.name, org: 'Race engineer · available', subj: `Race engineer at ${c.myTeam}`, wait: 1, body: [`We want you on the radio for ${c.drivers[was.did]?.name || 'one of our cars'}.`], note: `Offer sent to ${p.name}.`, data: { name: p.name } };
    },
    answer(c, p) {
      const d = p.data, i = (c.engMarket || []).findIndex((x) => x.name === d.name), base = { from: d.name, org: p.org, re: p.subj, subj: `Re: ${p.subj}` };
      if (i < 0) return post(c, { ...base, kind: 'note', tag: 'reply', good: false, body: ['I have taken another seat on the pit wall. Sorry.'] });
      const more = rnd() < 0.25, extra = more ? 0.3 : 0;
      return post(c, { ...base, kind: 'engineer', tag: 'offer', good: true, data: { ...d, extra },
        body: more ? ['I would like to. It means moving the family, so I would ask for a little towards that.'] : ['Yes - I know his driving, I think we would work well. Tell me when to start.'],
        terms: [['To bring in', `$${r1(0.8 + extra)}M${more ? ' (with $0.3M for the move)' : ''}`]], acts: [{ id: 'yes', label: `SIGN · $${r1(0.8 + extra)}M`, go: true }, { id: 'no', label: 'DECLINE' }] });
    },
    act(c, m, id) {
      const d = m.data; if (id !== 'yes') return { text: `You pass on ${d.name}.`, ok: true };
      const i = (c.engMarket || []).findIndex((x) => x.name === d.name); if (i < 0) return { text: `${d.name} is no longer available.`, ok: false };
      if (c.team.budget < 0.8 + (d.extra || 0)) return { text: `Not enough money: $${r1(0.8 + (d.extra || 0))}M.`, ok: false };
      const r = hireEngineer(c, i, d.slot), ok = !/^(Not|No )/.test(r); if (ok && d.extra) c.team.budget = r1(c.team.budget - d.extra); c.save();
      return { text: r, ok };
    },
  },
  // ---- a driver's contract extended
  extend: {
    key: (d) => `extend|${d.did}`, btn: (c, d) => [{ a: 'extend', v: `${d.did}|`, pre: true }],
    send(c, d) {
      const x = c.drivers[d.did]; if (!x || x.team !== c.myTeam) return { no: 'Not your driver.' };
      const no = extendBlock(c, d.did); if (no) return { no };
      const T = contractAsk(c, x, d.years); if (T.no) return { no: T.no };
      return { to: `${sur(x.name)}'s management`, org: x.name, col: c.team.color, subj: `${x.name}: ${d.years} more season${d.years === 1 ? '' : 's'}`, wait: 1, body: [`${c.myTeam} would like to extend ${x.name}'s contract by ${d.years} season${d.years === 1 ? '' : 's'}.`], note: `The extension has gone to ${sur(x.name)}'s management.`, data: { name: x.name } };
    },
    answer(c, p) {
      const d = p.data, x = c.drivers[d.did], base = { from: `${sur(d.name)}'s management`, org: d.name, col: p.col, re: p.subj, subj: `Re: ${p.subj}` };
      if (!x || x.team !== c.myTeam) return null;
      const no = extendBlock(c, d.did), T = no ? { no } : contractAsk(c, x, d.years);
      if (T.no) return post(c, { ...base, kind: 'note', tag: 'reply', good: false, body: [T.no] });
      const mo = x.morale ?? 60, more = rnd() < (mo < 45 ? 0.5 : 0.2), k = more ? (mo < 45 ? 1.08 : 1.05) : 1, sal = r1(T.salary * k);
      return post(c, { ...base, kind: 'extend', tag: 'offer', good: true, data: { ...d, k },
        body: more ? [`${first(d.name)} wants to stay. But ${x.offer ? `${x.offer.team} have been on the phone, and ` : ''}the number has to reflect what he has done for the team.`, 'On the terms below, he signs.'] : [`${first(d.name)} is happy where he is. On the terms below, he signs.`],
        terms: [['Salary', `$${sal}M a season`], ['To the end of', `${Math.max(x.until, c.season) + d.years}`]], acts: [{ id: 'yes', label: 'SIGN THE EXTENSION', go: true }, { id: 'no', label: 'LEAVE IT' }] });
    },
    act(c, m, id) {
      const d = m.data; if (id !== 'yes') return { text: `No extension for ${d.name}, for now.`, ok: true };
      const r = c.extend(d.did, d.years), ok = /extends to/.test(r); if (ok && d.k > 1) { const x = c.drivers[d.did]; x.salary = r1(x.salary * d.k); c.save(); return { text: `${d.name} extends to the end of ${x.until} at $${x.salary}M a season.`, ok }; }
      return { text: r, ok };
    },
  },
  // ---- a sponsor's terms
  sponsor: {
    key: (d) => `sp|${d.oid}`, btn: (c, d) => [{ a: 'prop', v: d.oid }, { a: 'neg', v: d.oid }],
    send(c, d) {
      const o = (c.spOffers || []).find((x) => x.id === d.oid); if (!o) return { no: 'That offer is gone.' };
      if (c.sponsors[o.slot]) return { no: 'That slot on the car is taken.' };
      const t = d.terms || { base: 1, bonus: 1, years: o.years };
      return { to: o.brand, org: 'Partnerships', subj: `${c.myTeam}: our terms`, wait: o.slot === 'title' ? 2 : 1, body: [`${c.myTeam} propose: $${r1(o.base * t.base)}M a race, a bonus of $${r1(o.bonus * t.bonus)}M, ${t.years} season${t.years === 1 ? '' : 's'}.`], note: `Your terms are with ${o.brand}: their board decides.`, data: { brand: o.brand, terms: t } };
    },
    answer(c, p) {
      const d = p.data, base = { kind: 'note', tag: 'reply', from: d.brand, org: 'Partnerships', re: p.subj, subj: `Re: ${p.subj}` };
      if (!(c.spOffers || []).some((x) => x.id === d.oid)) return post(c, { ...base, good: false, body: ['We have placed this budget elsewhere. Perhaps next season.'] });
      const r = propose(c, d.oid, d.terms), ok = /signs/.test(r);
      return post(c, { ...base, good: ok, body: [ok ? 'Our board met and approved the terms as you sent them. We look forward to seeing our name on the car.' : 'Our board met. On those terms the answer is no.', r] });
    },
  },
  // ---- a prospect for the academy
  scout: {
    key: (d) => `scout|${d.name}`, btn: (c, d) => { const i = (c.academy?.prospects || []).findIndex((x) => x.name === d.name); return i >= 0 ? [{ a: 'acsign', v: `${i}` }] : []; },
    send(c, d) {
      const A = c.academy, p = A?.prospects?.[d.i]; if (!p) return { no: 'No such prospect.' };
      if (A.juniors.length + (c.mail.out.filter((x) => x.kind === 'scout').length) >= 2 + A.level) return { no: `Your academy has room for ${2 + A.level}: build it up, or let someone go.` };
      if (c.team.budget < p.sign) return { no: `Not enough money: ${p.name} costs $${p.sign}M to sign.` };
      return { to: `The ${sur(p.name)} family`, org: p.name, subj: `A place in the ${c.myTeam} academy`, wait: 1, body: [`${c.myTeam} would like ${first(p.name)} in the academy from this season.`], note: `The offer has gone to ${p.name}'s family.`, data: { name: p.name } };
    },
    answer(c, p) {
      const d = p.data, P = c.academy?.prospects || [], i = P.findIndex((x) => x.name === d.name), base = { kind: 'note', tag: 'reply', from: `The ${sur(d.name)} family`, org: d.name, re: p.subj, subj: `Re: ${p.subj}` };
      if (i < 0 || rnd() < 0.15) { if (i >= 0) P.splice(i, 1); return post(c, { ...base, good: false, body: [`Thank you - but ${first(d.name)} has chosen another team's programme. It was a hard decision.`] }); }
      const r = scout(c, i), ok = /signed to the academy/.test(r);
      return post(c, { ...base, good: ok, body: ok ? [`We are delighted. ${first(d.name)} has not stopped smiling since the letter came.`, r] : [`${first(d.name)} wanted to come.`, r] });
    },
  },
  // ---- the academy built up
  acbuild: {
    key: () => 'acbuild', btn: () => [{ a: 'acup' }],
    send(c) {
      const A = c.academy; if (!A || A.level >= 3) return { no: 'The academy is as big as it gets.' };
      const cost = ACADEMY_COST[A.level]; if (c.team.budget < cost) return { no: `Not enough money: $${cost}M.` };
      return { to: 'Operations', org: c.myTeam, col: c.team.color, subj: 'Build the academy up', wait: 2, body: [`Go ahead with the next stage of the academy ($${cost}M, paid when it opens).`], note: 'The builders are booked: two races.' };
    },
    answer(c, p) { const r = academyUp(c), ok = /Academy level/.test(r); return post(c, { kind: 'note', tag: 'fyi', from: 'Operations', org: c.myTeam, col: c.team.color, re: p.subj, subj: ok ? 'The academy extension is open' : 'The academy extension is on hold', good: ok, body: [ok ? 'The new simulator room and the karts are in. The juniors moved in this morning.' : 'The building is ready, but the bill could not be paid.', r] }); },
  },
  // ---- a power unit for next season
  engine: {
    key: () => 'engine', btn: (c, d) => [{ a: 'supplier', v: d.key }],
    send(c, d) {
      const S = SUPPLIERS[d.key]; if (!S) return { no: 'No such supplier.' };
      const prev = c.engineNext, t = signSupplier(c, d.key), next = c.engineNext; c.engineNext = prev;   // (asked of it only what it would say: nothing is signed yet)
      if (/build their own/.test(t)) return { no: t };   // (a works team)
      if (!next) { c.engineNext = null; return { now: t }; }   // (staying with the maker you have: nothing to ask)
      return { to: S.name, org: 'Customer power units', subj: `A supply for ${c.myTeam} next season`, wait: 2, body: [`${c.myTeam} ask for a customer supply of ${S.name} power units from next season.`], note: `Your request is with ${S.name}'s board.` };
    },
    answer(c, p) { const S = SUPPLIERS[p.data.key], r = signSupplier(c, p.data.key); c.save(); return post(c, { kind: 'note', tag: 'reply', from: S.name, org: 'Customer power units', re: p.subj, subj: `Re: ${p.subj}`, good: true, body: ['The board has approved a customer supply. The contract follows by courier.', r] }); },
  },
  // ---- (not asked by you: a rival after one of your people - the mail it comes in carries the answer)
  approach: {
    act(c, m, id) {
      const d = m.data, a = (c.rivals?.approaches || []).find((x) => x.role === d.role && x.team === d.team && x.name === d.name);
      if (!a) return { text: 'It has been settled already.', ok: false };
      return { text: answerApproach(c, a, id === 'match' ? 'match' : 'let'), ok: id === 'match' };
    },
  },
};
/** the page buttons whose answer is being waited for -> [{ a, v, due }] */
export function mailMarks(c) {
  const out = []; for (const p of c.mail?.out || []) { try { for (const b of KINDS[p.kind]?.btn?.(c, p.data) || []) out.push({ ...b, due: dueWords(c, p) }); } catch (e) { /* a market that has moved on */ } }
  return out;
}
/** ask: -> { text, ok } (undefined: no such kind) */
export function mailAsk(c, kind, data = {}) {
  const M = mailEnsure(c), K = KINDS[kind]; if (!K || !K.send) return undefined;
  // (names for the keys that go by one)
  if (kind === 'staff') data.name = c.hires?.[data.role]?.[data.i]?.name; if (kind === 'crew') data.name = c.crew?.market?.[data.i]?.name; if (kind === 'engineer') data.name = c.engMarket?.[data.i]?.name; if (kind === 'scout') data.name = c.academy?.prospects?.[data.i]?.name;
  const key = K.key(data), had = M.out.find((p) => p.key === key); if (had) return { text: `You have asked already: the answer is due ${dueWords(c, had)}.`, ok: false };
  const open = M.box.find((m) => openAct(m) && m.key === key); if (open) return { text: 'The answer to that is in your mail, waiting for you.', ok: false };
  const s = K.send(c, data); if (s.no) return { text: s.no, ok: false }; if (s.now) return { text: s.now, ok: true };
  const p = { id: `o${M.seq++}`, kind, key, to: s.to, org: s.org, col: s.col || null, subj: s.subj, body: s.body, season: c.season, round: c.round, due: M.clock + s.wait, wait: s.wait, data: { ...data, ...(s.data || {}) } };
  M.out.push(p); c.save();
  return { text: `${s.note || 'Sent.'} The answer comes by mail ${dueWords(c, p)}.`, ok: true };
}
/** a thing asked taken back before it is answered -> text */
export function mailWithdraw(c, id) {
  const M = mailEnsure(c), i = M.out.findIndex((p) => p.id === id); if (i < 0) return { text: 'It has been answered already.', ok: false };
  const p = M.out[i]; M.out.splice(i, 1); c.save();
  return { text: `Withdrawn: ${p.to} will not be answering.${p.kind === 'raid' ? ' The intermediary keeps his fee.' : p.kind === 'protest' ? ' The deposit stays with the stewards.' : ''}`, ok: true };
}
/** a button in a mail -> { text, ok } */
export function mailAct(c, id, act) {
  const M = mailEnsure(c), m = M.box.find((x) => x.id === id); if (!m || !openAct(m)) return { text: 'That has been settled.', ok: false };
  const K = KINDS[m.kind]; let r; try { r = K?.act ? K.act(c, m, act) : { text: '', ok: true }; } catch (e) { r = { text: 'It could not be done.', ok: false }; }
  // (a signing that failed for money stays open - you may find the money; anything else is the end of it)
  if (r.ok || !/Not enough money/.test(r.text)) { m.done = true; m.result = r.text; m.chose = (m.acts.find((a) => a.id === act) || {}).label || act; }
  m.read = true; c.save(); return r;
}
export function mailRead(c, id) { const m = (c.mail?.box || []).find((x) => x.id === id); if (m && !m.read) { m.read = true; return true; } return false; }
export function mailReadAll(c) { for (const m of c.mail?.box || []) m.read = true; c.save(); }

// ---- what reaches the desk by itself -------------------------------------------------------------------------------------
function desk(c, rep) {
  const M = c.mail, S = M.snap, mine = c.team, tm = { from: M.tm, org: `Team Manager · ${c.myTeam}`, col: mine.color };
  // the race, from the team manager
  if (rep?.mine?.length) {
    const res = rep.mine.map((m) => `${sur(m.name)} ${m.dnf ? 'DNF' : `P${m.pos}`}`).join(', '), pts = rep.mine.reduce((s, m) => s + (m.pts || 0), 0), pos = c.posOf?.(c.myTeam);
    post(c, { kind: 'note', tag: 'report', ...tm, subj: `Round ${rep.round}: ${res}`, good: pts > 0,
      body: [rep.mine.map((m) => m.dnf ? `${m.name} did not finish${m.why ? ` (${String(m.why).toLowerCase()})` : ''}.` : `${m.name} finished P${m.pos}${m.pts ? ` for ${m.pts} point${m.pts === 1 ? '' : 's'}` : ', out of the points'}.`).join(' '),
        `${pts ? `${pts} point${pts === 1 ? '' : 's'} for the team` : 'No points this time'}${pos ? `: P${pos} in the constructors'` : ''}.${rep.objective ? ` The board's target for the race was ${rep.objective.met ? 'met' : 'missed'}.` : ''}`],
      terms: [['Prize and TV money', `$${rep.income ?? 0}M`], ['Sponsors', `$${rep.sponsor ?? 0}M`], ['Wages', `−$${rep.wages ?? 0}M`], ['Budget now', `$${r1(mine.budget)}M`]] });
  }
  // new parts on the car, from the technical director
  if (rep?.parts?.length) {
    const td = c.staff?.td, names = rep.parts.map((p) => { try { return `${upgradeName(p.id, p.level)} (${Math.round((p.q || 1) * 100)}% of the tunnel's promise)`; } catch (e) { return p.id; } }).filter(Boolean);
    post(c, { kind: 'note', tag: 'fyi', from: td?.name || 'The factory', org: `Technical Director · ${c.myTeam}`, col: mine.color, subj: `On the car: ${names.length} new part${names.length === 1 ? '' : 's'}`, good: true, body: [`Finished and fitted for the next race: ${names.join('; ')}.`, 'The numbers from the tunnel are in the factory page. We will know what it is really worth after a race distance.'] });
  }
  // a building finished
  for (const [k, f] of Object.entries(c.fac || {})) { const was = S.fac?.[k]; if (was != null && f.level > was) post(c, { kind: 'note', tag: 'fyi', from: 'Operations', org: c.myTeam, col: mine.color, subj: `${FAC?.[k]?.name || 'Building work'}: level ${f.level} is ready`, good: true, body: [`The work on the ${String(FAC?.[k]?.name || k).toLowerCase()} is done and the keys are handed over. It is at level ${f.level} from today.`] }); }
  S.fac = Object.fromEntries(Object.entries(c.fac || {}).map(([k, f]) => [k, f.level]));
  // a rival after one of your people: he tells you himself, and the answer is in the mail
  for (const a of c.rivals?.approaches || []) {
    if (a.mailed) continue; a.mailed = true;
    post(c, { kind: 'approach', tag: 'offer', from: a.name, org: `${STAFF[a.role] || ROLE_NAME?.[a.role] || 'Staff'} · ${c.myTeam}`, col: mine.color, subj: `${a.team} have made me an offer`, good: false, data: { role: a.role, team: a.team, name: a.name }, until: M.clock + Math.max(1, a.due - c.round),
      body: [`I would rather you heard it from me: ${a.team} have offered me $${a.salary}M a season to go there.`, 'I like it here. But it is a lot more than I am on, and I have to think about my family. If you can match it I will stay, and that will be the end of it.'],
      terms: [['Their offer', `$${a.salary}M a season`], ['He is on', `$${c.staff?.[a.role]?.salary ?? '?'}M a season`]], acts: [{ id: 'match', label: `MATCH IT · $${a.salary}M`, go: true }, { id: 'let', label: 'LET HIM GO' }] });
  }
  // an offer for one of your drivers
  for (const d of c.seatsOf?.(c.myTeam) || []) {
    if (!d.offer || d.offer.mailed) continue; d.offer.mailed = true;
    post(c, { kind: 'note', tag: 'fyi', from: `${sur(d.name)}'s management`, org: d.name, col: teamCol(c, d.offer.team), subj: `${d.offer.team} want ${sur(d.name)} for next season`, good: false, body: [`As a courtesy: ${d.offer.team} have put an offer in front of ${first(d.name)} for next season, at $${d.offer.salary}M.`, `His contract with you ends this year. If ${c.myTeam} want to keep him, an extension before the winter would settle it.`] });
  }
  // the board, when its mood moves
  const conf = c.board?.conf ?? 50;
  if (S.conf != null && Math.abs(conf - S.conf) >= 7) { const up = conf > S.conf; post(c, { kind: 'note', tag: 'fyi', from: 'The Chairman', org: `The board · ${c.myTeam}`, col: mine.color, subj: up ? 'The board is pleased' : 'The board is concerned', good: up, body: [up ? 'A short note to say that the board has noticed. Keep it going.' : conf < 30 ? 'I will be plain: the board is losing patience. We need results, and soon.' : 'The last few races have not been what we were promised. The board would like to see an improvement.', `Confidence in you stands at ${Math.round(conf)}%.`] }); S.conf = conf; }
  if (S.conf == null) S.conf = conf;
}
/** a race has been run (career/Manager.applyRace, before the round moves on): the answers that are due come in, offers left too long lapse, the desk's own mail */
export function mailRound(c, rep) {
  const M = mailEnsure(c); M.clock++;
  for (const m of M.box) if (openAct(m) && m.until != null && M.clock >= m.until) { m.done = true; m.result = m.kind === 'approach' ? '' : 'You did not answer in time: the offer lapsed.'; m.lapsed = true; }
  desk(c, rep);
  for (const p of [...M.out]) { if (p.due > M.clock) continue; M.out.splice(M.out.indexOf(p), 1); try { const m = KINDS[p.kind]?.answer?.(c, p); if (m) m.key = p.key; } catch (e) { console.warn('[mail] an answer', p.kind, e); } }
}
/** the season is over (career/Manager.endSeason): everything still out is answered now - there is a winter to sign in */
export function mailWinter(c) {
  const M = mailEnsure(c);
  for (const p of [...M.out]) { M.out.splice(M.out.indexOf(p), 1); try { const m = KINDS[p.kind]?.answer?.(c, p); if (m) m.key = p.key; } catch (e) { console.warn('[mail] an answer', p.kind, e); } }
}
/** a new season (career/Manager.nextSeason, before the markets are drawn again): an offer from last year's market left unsigned is gone */
export function mailNewSeason(c) {
  const M = mailEnsure(c); M.clock += 2;
  for (const m of M.box) if (openAct(m) && (['staff', 'crew', 'engineer', 'approach'].includes(m.kind) || (m.until != null && M.clock >= m.until))) { m.done = true; m.result = 'Left over the winter: the offer lapsed.'; m.lapsed = true; }
}
