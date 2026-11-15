// The team principal's HQ, the pages of the paddock and the years (ui/ManagerHub.js draws the frame and passes the
// clicks on): RIVALS (every other team - who runs it and how, its car against the quickest, its people, its money,
// how things stand between you; their approaches for your staff, yours for theirs, a protest), MARKET (next season's
// grid as it fills, who has an offer, who is stopping, the champions so far), ACADEMY (your juniors, the prospects) -
// and DRIVERS as it is now: ages, what each asks for one, two or three years, who else wants him.
import { PHIL, ROLE_NAME, paceTable, raidTerms, raid, protest, answerApproach } from '../career/Rivals.js';
import { SERIES, ACADEMY_COST, ageOf, contractAsk, scout, academyUp, juniorRelease, promote, regsNext } from '../career/Seasons.js';

import { esc, money, sur, panel, kv, meter, ring, person, tag, sw as swatch, empty } from './HQKit.js';
import { engineerOf, moraleWord } from '../career/ManagerPeople.js';
const sw = (c, team) => swatch(c.teams[team]?.color || '#bbb');
const arc = (c, d) => { const a = ageOf(c, d); return a < 25 && d.pot - d.rating > 0.02 ? 'still learning' : a < 27 ? 'improving' : a < 33 ? 'at his best' : a < 36 ? 'past his best' : 'near the end'; };

export function eraHTML(c, tab) {
  if (tab === 'rivals') return rivalsHTML(c);
  if (tab === 'market') return marketHTML(c);
  if (tab === 'academy') return academyHTML(c);
  return null;
}
/** RIVALS: the grid as a table the height of the page (each team: who runs it and how, its car against the quickest, its people to ask for, a protest); who wants your people, and the rules, beside it */
function rivalsHTML(c) {
  const P = paceTable(c), worst = Math.max(0.3, ...P.map((r) => r.s)), R = c.rivals;
  const rows = P.map((r, i) => {
    const t = r.team, A = t.ai, heat = c.story?.pri?.[t.name]?.heat || 0;
    if (r.mine) return `<tr class="me"><td class="n">${i + 1}</td><td>${sw(c, t.name)}<b>${esc(t.name)}</b><br><small>you</small></td><td><small>TD ${Math.round((c.staff.td?.rating || 0) * 100)} · strategy ${Math.round((c.staff.strat?.rating || 0) * 100)} · crew ${Math.round((c.staff.crew?.rating || 0) * 100)}</small></td><td style="width:20%">${meter(1 - r.s / worst, 'var(--ac)')}<small>${r.s ? `+${r.s.toFixed(2)} s` : 'quickest'}</small></td><td></td><td></td></tr>`;
    const fresh = A.last && A.last.season === c.season && c.round - A.last.round <= 3;
    const st = Object.keys(ROLE_NAME).map((k) => { const T = raidTerms(c, t.name, k), p = A.staff[k]; return `<button data-a="rvraid" data-v="${esc(t.name)}|${k}" ${T.no ? 'disabled' : ''} title="${esc(T.no || `${p.name}, ${ROLE_NAME[k]}: ${money(T.fee)} to bring over, about ${Math.round(T.odds * 100)}% that he says yes`)}">${k === 'td' ? 'TD' : k === 'strat' ? 'STR' : 'CREW'} ${Math.round(p.rating * 100)}</button>`; }).join('');
    return `<tr><td class="n">${i + 1}</td><td>${sw(c, t.name)}<b>${esc(t.name)}</b><br><small>${esc(A.boss)}</small></td>
      <td title="${esc(PHIL[A.phil]?.what || '')}"><b style="font-weight:600">${esc(PHIL[A.phil]?.name || '')}</b><br>${A.pressure ? tag('under pressure', 'warn') : ''}${A.money === 'flush' ? tag('new money', 'good') : A.money === 'tight' ? tag('short of money') : ''}${heat >= 40 ? tag('no love lost', 'bad') : heat >= 15 ? tag('needle') : ''}</td>
      <td style="width:20%">${meter(1 - r.s / worst, t.color)}<small>${r.s ? `+${r.s.toFixed(2)} s` : 'quickest'}${r.trend > 0.02 ? ` · found ${r.trend.toFixed(2)} s` : ''}</small></td>
      <td><span class="q-acts" style="max-width:none;flex-wrap:nowrap;gap:3px">${st}</span></td><td class="n"><button data-a="rvprot" data-v="${esc(t.name)}" ${fresh ? '' : 'disabled'} title="${fresh ? `Their new parts (about ${(A.last.perf * 40.5).toFixed(2)} s a lap) to the stewards: a $0.5M deposit` : 'They have brought nothing new in the last three races'}">PROTEST${fresh && A.grey > 0.55 ? ' ?' : ''}</button></td></tr>`;
  }).join('');
  const app = R.approaches.map((a, i) => person({ cls: 'top', name: `${esc(a.team)} want ${esc(a.name)}`, sub: `Your ${esc(ROLE_NAME[a.role])} · they offer ${money(a.salary)} a season (he is on ${money(c.staff[a.role]?.salary || 0)}) · decides after round ${a.due}`, under: `<div class="q-acts l"><button class="go" data-a="rvmatch" data-v="${i}">MATCH ${money(a.salary)}</button><button data-a="rvlet" data-v="${i}">LET HIM GO</button></div>` })).join('');
  const nx = regsNext(c);
  return `<div class="q-g">${panel('The grid', `<table><thead><tr><th class="n">#</th><th>Team</th><th>How they work</th><th>Car, a lap</th><th>Their people · ask one</th><th></th></tr></thead><tbody>${rows}</tbody></table>`, { w: 8, h: 2, pad: false, k: 'grid', info: 'The car column is the timing: seconds a lap behind the quickest car, drivers apart. A team under pressure has missed its target; twice, and its principal goes - the next one works differently. Asking for one of their people costs a fee and their goodwill, and he may say no. A protest only works on parts in a grey area: the "?" is the paddock wondering.' })}
    ${panel(`They want your people${R.approaches.length ? ` · ${R.approaches.length}` : ''}`, app || empty('Nobody has been approached.'), { w: 4, k: 'app', cls: R.approaches.length ? 'hero' : '', info: 'Match the offer and he stays on that salary. Let him go and his deputy steps up - a tenth worse - while they pay you for the notice. Left alone, he usually goes.' })}
    ${panel('The rules', `<div class="q-huge">${nx}</div><p class="q-fine" style="margin-top:6px">The next new technical regulations${nx === c.season + 1 ? ': next season' : ''}. Every car is a new one then: the parts built for this one are gone, the factory is not, and the order is drawn again - from how good each old car was, each factory, the work put into the new car early (DESIGN), and luck.</p>`, { w: 4, k: 'regs' })}</div>`;
}
/** MARKET: next season's grid as it fills, the height of the page; who is on the move and the champions beside it */
function marketHTML(c) {
  const next = Object.values(c.teams).sort((a, b) => a.garage - b.garage).map((t) => {
    const stay = c.seatsOf(t.name).map((d) => { const gone = d.retiring ? 'retiring' : d.out ? 'out' : d.next && d.next.team !== t.name ? `to ${d.next.team}` : d.until <= c.season && !d.renew && t.name !== c.myTeam ? 'contract ending' : d.until <= c.season && t.name === c.myTeam ? (d.offer ? `offer from ${d.offer.team}` : 'contract ending') : ''; return `<span style="${gone ? `color:var(--bad);text-decoration:${/retiring|out|to /.test(gone) ? 'line-through' : 'none'}` : ''}"><b style="font-weight:700">${esc(sur(d.name))}</b></span>${gone ? ` <small>(${esc(gone)})</small>` : ` <small>to ${d.until}</small>`}`; });
    const come = Object.values(c.drivers).filter((d) => d.next?.team === t.name && d.team !== t.name).map((d) => `<b class="good">${esc(sur(d.name))}</b> <small>(signed)</small>`);
    return `<tr class="${t.name === c.myTeam ? 'me' : ''}"><td>${sw(c, t.name)}<b>${esc(t.name)}</b></td><td>${[...stay, ...come].join(' &nbsp;·&nbsp; ')}</td></tr>`;
  }).join('');
  const D = Object.values(c.drivers).filter((d) => !d.retired);
  const moves = [...D.filter((d) => d.team === c.myTeam && d.offer).map((d) => person({ rt: d.rating, sm: true, name: `${esc(d.name)} ${tag('yours', 'bad')}`, sub: `Offer from ${esc(d.offer.team)}: ${money(d.offer.salary)} a season. Extend him or he goes in the winter.`, act: '<button class="go" data-tab="drv">DRIVERS</button>' })),
    ...D.filter((d) => d.retiring).map((d) => person({ rt: d.rating, sm: true, col: 'var(--mute)', name: `${esc(d.name)} · ${ageOf(c, d)}`, sub: `Retiring at the end of the season${d.team ? ` (${esc(d.team)})` : ''}.` }))].join('');
  const champs = (c.history || []).slice().reverse().map((h) => `<tr><td class="n">${h.season}</td><td><b>${esc(h.champ || '-')}</b></td><td>${esc(h.champTeam || '-')}</td><td class="n">P${h.pos}</td></tr>`).join('');
  const log = (c.era?.log || []).slice(-8).reverse().map((e) => person({ name: `<span style="font-weight:600">${e.kind === 'regs' ? `${e.season}: new regulations - ${esc(e.order.join(', '))} quickest out of the box` : `${e.season}: ${esc(e.name)} retired`}</span>` })).join('');
  return `<div class="q-g">${panel('Next season\'s grid, as it stands', `<table><thead><tr><th>Team</th><th>Drivers</th></tr></thead><tbody>${next}</tbody></table>`, { w: 7, h: 2, pad: false, k: 'nxt', info: 'From the season\'s half-way the teams decide: renew, or sign someone better for next year - a free agent, a man whose contract is ending elsewhere, one of yours. A driver of yours with an offer leaves in the winter unless you extend him first; he asks more while the offer stands.' })}
    ${panel('On the move', moves || empty('Nothing yet. It starts at the season\'s half-way.'), { w: 5, k: 'mv' })}
    ${panel('Champions', `${champs ? `<table><thead><tr><th class="n">Season</th><th>Driver</th><th>Constructor</th><th class="n">You</th></tr></thead><tbody>${champs}</tbody></table>` : `<div style="padding:8px 14px">${empty('The first season is still being raced.')}</div>`}${log ? `<div style="padding:4px 14px 0">${log}</div>` : ''}`, { w: 5, pad: false, k: 'ch' })}</div>`;
}
/** ACADEMY: the academy itself, your juniors, this year's prospects - three columns the height of the page */
function academyHTML(c) {
  const A = c.academy, room = 2 + A.level;
  const jun = A.juniors.map((j, i) => person({ rt: j.rating, name: `${esc(j.name)} · ${ageOf(c, j)}`, sub: `${esc(SERIES[j.series].name)} · could be ${Math.round(j.lo * 100)}-${Math.round(j.hi * 100)} · ${j.res.length ? j.res.slice(-3).map((r) => `${r.season} ${r.series} P${r.pos}`).join(', ') : 'first season'} · ${money(SERIES[j.series].cost)} a season`, under: meter((j.rating - 0.58) / 0.34, 'var(--ac)', { thin: true }),
    act: `<button class="${j.rating >= 0.755 ? 'go' : ''}" data-a="acprom" data-v="${i}" ${j.rating >= 0.755 ? '' : 'disabled title="Not the results for a super licence yet (76)"'}>PROMOTE</button><button data-a="acrel" data-v="${i}">RELEASE</button>` })).join('');
  const pro = A.prospects.map((p, i) => person({ rt: p.rating, sm: true, name: `${esc(p.name)} · ${ageOf(c, p)}`, sub: `The scouts say ${Math.round(p.lo * 100)}-${Math.round(p.hi * 100)} one day · ${money(p.sign)} to sign`, act: `<button data-a="acsign" data-v="${i}" ${A.juniors.length >= room ? 'disabled title="The academy is full"' : ''}>SIGN</button>` })).join('');
  const grads = Object.values(c.drivers).filter((d) => d.academy === c.myTeam && !d.team && !d.retired).map((d) => person({ rt: d.rating, col: 'var(--good)', name: `${esc(d.name)} · ${ageOf(c, d)} ${tag('graduate', 'good')}`, sub: `Yours to sign first${(d.hold ?? 0) >= c.season ? ` until the end of ${d.hold}` : ' no longer - anyone may'}. He asks less of the team that brought him up.`, act: '<button data-tab="drv">DRIVERS</button>' })).join('');
  return `<div class="q-g">${panel('Your academy', `<div class="q-col"><div><div class="q-huge">${A.level}<small style="font-size:13px;color:var(--mute);margin-left:6px">of 3</small></div><div class="q-pips">${[0, 1, 2].map((i) => `<i class="${i < A.level ? 'on' : ''}"></i>`).join('')}</div></div>
      <div>${kv('Places', `${A.juniors.length} of ${room}`)}${meter(A.juniors.length / room, 'var(--ac)')}</div>${kv('The scouts\' guess is within', `± ${Math.round((0.07 - A.level * 0.018) * 100)}`)}
      ${A.level < 3 ? `<button class="go sp" data-a="acup">BUILD IT UP · ${money(ACADEMY_COST[A.level])}</button>` : ''}</div>`, { w: 3, scroll: false, info: 'A junior races Formula 4, then 3, then 2, a season at a time, getting nearer to what he could be - faster in a better academy. At 76 he can be promoted: he is then a free agent only you may sign, this season and next, and he asks less of you. Three seasons of Formula 2 without a seat and he leaves. Each winter new prospects are scouted.' })}
    ${panel('Juniors', (jun || empty('Nobody yet: sign a prospect.')) + grads, { w: 5, k: 'jun' })}${panel('Prospects this year', pro || empty('All signed. More next winter.'), { w: 4, k: 'pro' })}</div>`;
}
/** DRIVERS: your two as cards (age, where he is in his career, his contract, who wants him, what he asks to stay); the free agents (what each asks of YOU) the height of the page */
export function driversHTML(c) {
  const D = c.seatsOf(c.myTeam), empt = !c.seatsReady();
  const F = c.freeAgents().sort((a, b) => ((b.academy === c.myTeam) - (a.academy === c.myTeam)) || b.rating - a.rating).slice(0, 16);
  const mine = D.map((d) => {
    const T1 = contractAsk(c, d, 1), T2 = contractAsk(c, d, 2);
    const e = engineerOf(c, d.id), mo = d.morale ?? 60;
    return panel(`#${d.number} · ${esc(arc(c, d))}`, `<div class="q-col"><div style="display:flex;gap:14px;align-items:center">${ring(d.rating, { big: true })}<div style="min-width:0"><div class="q-big">${esc(d.name)}<small>${ageOf(c, d)}</small></div><p style="margin:5px 0 0">${d.retiring ? tag('retiring at the season\'s end', 'bad') : ''}${d.offer ? tag(`offer from ${esc(d.offer.team)}`, 'bad') : ''}${d.until <= c.season ? tag('contract ending', 'warn') : ''}</p></div></div>
      <div class="q-sts" style="--n:4"><div class="q-st"><small>Points</small><b>${d.points}</b></div><div class="q-st"><small>Starts · wins</small><b>${d.starts || 0} · ${d.wins || 0}</b></div><div class="q-st"><small>Salary</small><b>${money(d.salary)}</b></div><div class="q-st"><small>Contract</small><b>to ${d.until}</b></div></div>
      <div>${kv('Morale', `${mo} · ${esc(moraleWord(mo))}`, mo < 40 ? 'bad' : '')}${meter(mo / 100)}</div>${kv('Race engineer', e ? `${esc(e.name)} · chemistry ${Math.round(e.chem * 100)}%` : 'none')}${kv('To stay he asks', T1.no ? esc(T1.no) : `${money(T1.salary)} for one year · ${money(T2.salary)} for two`)}
      <div class="q-acts l sp">${T1.no ? `<button disabled title="${esc(T1.no)}">EXTEND</button>` : `<button data-a="extend" data-v="${d.id}|1" title="${esc(T1.why || '')}">+1 YEAR · ${money(T1.salary)}</button><button data-a="extend" data-v="${d.id}|2" title="${esc(T2.why || '')}">+2 YEARS · ${money(T2.salary)}</button>`}<button class="ghost" data-a="release" data-v="${d.id}" title="Paying off the contract: ${money(c.releaseCost(d))}">RELEASE · ${money(c.releaseCost(d))}</button></div></div>`, { w: 6, scroll: false });
  }).join('') || panel('Your drivers', empty('No drivers.'), { w: 6 });
  const free = F.map((d) => {
    const T = [1, 2, 3].map((y) => contractAsk(c, d, y)), no = T[1].no;
    return person({ rt: d.rating, sm: true, name: `${esc(d.name)} · ${ageOf(c, d)}${d.academy === c.myTeam ? ` ${tag('your junior', 'good')}` : ''}`, sub: `${d.academy === c.myTeam ? '' : `${esc(d.from || '')} · `}${arc(c, d)}${no ? ` · <span class="bad">${esc(no)}</span>` : ` · asks ${money(T[1].salary)} a season, ${money(T[1].fee)} to sign${T[1].why ? ` · ${esc(T[1].why)}` : ''}`}`,
      act: no ? '' : [1, 2, 3].map((y) => `<button class="${empt && y === 2 ? 'go' : ''}" data-a="sign" data-v="${d.id}|${y}"${empt ? ` title="${y} season${y > 1 ? 's' : ''}: ${money(T[y - 1].salary)} a season"` : ' disabled title="Both seats are taken: release a driver first"'}>${y}Y</button>`).join('') });
  }).join('');
  // (your drivers side by side on top - or one above the other beside the free agents when there are two: the left half theirs, the right half the market's)
  return `<div class="q-g" style="grid-template-columns:repeat(12, minmax(0, 1fr));grid-template-rows:repeat(${Math.max(1, D.length)}, minmax(0, 1fr))">${mine}${panel(`Free agents${empt ? ' · a seat is empty' : ''}`, free || empty('Nobody is free.'), { w: 6, h: Math.max(1, D.length), k: 'free', style: `grid-column:7 / -1;grid-row:1 / span ${Math.max(1, D.length)}`, cls: empt ? 'hero' : '', info: 'Rating: pace and racecraft out of 100. A driver improves to about 27, holds it into his thirties, then fades; from 36 any season may be his last. A contract that ends this season runs out in the winter - extend to keep him. What he asks depends on what he is worth, where your team is in the order, how he feels, and whether someone else wants him.' })}</div>`;
}
/** on the overview's NEEDS YOU: what the paddock is waiting on you for */
export function eraHome(c) {
  const a = c.rivals?.approaches || [], off = c.seatsOf(c.myTeam).filter((d) => d.offer), nx = regsNext(c), out = [];
  for (const x of a) out.push(person({ name: `${tag('Paddock', 'warn')} ${esc(x.team)} want ${esc(x.name)}`, sub: `Your ${esc(ROLE_NAME[x.role])} · decides after round ${x.due}`, act: '<button data-tab="rivals">ANSWER</button>' }));
  for (const d of off) out.push(person({ name: `${tag('Offer', 'bad')} ${esc(d.name)}`, sub: `${esc(d.offer.team)} want him for next season`, act: '<button data-tab="drv">DRIVERS</button>' }));
  if (nx === c.season + 1) out.push(person({ name: `${tag('Rules')} New regulations next season`, sub: 'Work on next year\'s car counts double', act: '<button data-tab="car">DESIGN</button>' }));
  return out.join('');
}
/** a click on one of these pages -> { text, ok } | undefined (not ours) */
export function eraClick(c, a, v) {
  if (!/^(rv|ac)/.test(a || '')) return undefined;
  const say = (text, ok = true) => ({ text, ok: ok && !/^(Not|No |Your academy has|The academy is)/.test(text) });
  if (a === 'rvraid') { const [team, role] = String(v).split('|'); return raid(c, team, role); }
  if (a === 'rvprot') return protest(c, v);
  if (a === 'rvmatch' || a === 'rvlet') { const x = c.rivals.approaches[+v]; if (!x) return say('That is settled already.', false); const r = answerApproach(c, x, a === 'rvmatch' ? 'match' : 'let'); c.save(); return say(r); }
  if (a === 'acsign') return say(scout(c, +v));
  if (a === 'acup') return say(academyUp(c));
  if (a === 'acrel') return say(juniorRelease(c, +v));
  if (a === 'acprom') return say(promote(c, +v));
  return undefined;
}
