// The team principal's HQ, the pages of the paddock and the years (ui/ManagerHub.js draws the frame and passes the
// clicks on): RIVALS (every other team - who runs it and how, its car against the quickest, its people, its money,
// how things stand between you; their approaches for your staff, yours for theirs, a protest), MARKET (next season's
// grid as it fills, who has an offer, who is stopping, the champions so far), ACADEMY (your juniors, the prospects) -
// and DRIVERS as it is now: ages, what each asks for one, two or three years, who else wants him.
import { PHIL, ROLE_NAME, paceTable, raidTerms, raid, protest, answerApproach } from '../career/Rivals.js';
import { SERIES, ACADEMY_COST, ageOf, contractAsk, scout, academyUp, juniorRelease, promote, regsNext } from '../career/Seasons.js';

export const ERA_TABS = [['rivals', 'RIVALS'], ['market', 'MARKET'], ['academy', 'ACADEMY']];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (m) => `$${(Math.round(m * 10) / 10).toFixed(1)}M`;
const sur = (n) => String(n || '').trim().split(/\s+/).pop();
const bar = (x, col) => `<div class="m-bar" style="--bc:${col || (x > 0.66 ? '#1fae64' : x > 0.4 ? '#e0a100' : '#d4351c')}"><i style="width:${(Math.max(0, Math.min(1, x)) * 100).toFixed(0)}%"></i></div>`;
const note = (t) => `<details class="m-note"><summary>How this works</summary><p>${t}</p></details>`;
const sw = (c, team) => `<span class="m-sw" style="background:${c.teams[team]?.color || '#bbb'}"></span>`;
const arc = (c, d) => { const a = ageOf(c, d); return a < 25 && d.pot - d.rating > 0.02 ? 'still learning' : a < 27 ? 'improving' : a < 33 ? 'at his best' : a < 36 ? 'past his best' : 'near the end'; };

export function eraHTML(c, tab) {
  if (tab === 'rivals') return rivalsHTML(c);
  if (tab === 'market') return marketHTML(c);
  if (tab === 'academy') return academyHTML(c);
  return null;
}
function rivalsHTML(c) {
  const P = paceTable(c), worst = Math.max(0.3, ...P.map((r) => r.s)), R = c.rivals;
  const rows = P.map((r, i) => {
    const t = r.team, A = t.ai, heat = c.story?.pri?.[t.name]?.heat || 0;
    if (r.mine) return `<tr class="m-me"><td>${i + 1}</td><td>${sw(c, t.name)}<b>${esc(t.name)}</b><br><small>you</small></td><td colspan="2"><small>${esc(c.staff.td?.name || '-')} · ${esc(c.staff.strat?.name || '-')} · ${esc(c.staff.crew?.name || '-')}</small></td><td style="width:16%">${bar(1 - r.s / worst, '#2d6cdf')}<small>${r.s ? `+${r.s.toFixed(2)} s` : 'quickest'}</small></td><td><small>TD ${Math.round((c.staff.td?.rating || 0) * 100)} · strategy ${Math.round((c.staff.strat?.rating || 0) * 100)} · crew ${Math.round((c.staff.crew?.rating || 0) * 100)}</small></td><td></td></tr>`;
    const fresh = A.last && A.last.season === c.season && c.round - A.last.round <= 3;
    const st = Object.keys(ROLE_NAME).map((k) => { const T = raidTerms(c, t.name, k), p = A.staff[k]; return `<button data-a="rvraid" data-v="${esc(t.name)}|${k}" ${T.no ? 'disabled' : ''} title="${esc(T.no || `${p.name}, ${ROLE_NAME[k]}: ${money(T.fee)} to bring over, about ${Math.round(T.odds * 100)}% that he says yes`)}">${k === 'td' ? 'TD' : k === 'strat' ? 'STRAT' : 'CREW'} ${Math.round(p.rating * 100)}</button>`; }).join('');
    return `<tr><td>${i + 1}</td><td>${sw(c, t.name)}<b>${esc(t.name)}</b><br><small>${esc(A.boss)}${A.pressure ? ' · under pressure' : ''}</small></td><td><small><b>${esc(PHIL[A.phil]?.name || '')}</b><br>${esc(PHIL[A.phil]?.what || '')}</small></td><td><small>${A.money === 'flush' ? 'New money' : A.money === 'tight' ? 'Short of money' : 'Steady'}<br>${heat >= 40 ? 'No love lost' : heat >= 15 ? 'Needle with you' : 'On terms'}</small></td>
      <td style="width:16%">${bar(1 - r.s / worst)}<small>${r.s ? `+${r.s.toFixed(2)} s` : 'quickest'}${r.trend > 0.02 ? ` · found ${r.trend.toFixed(2)} s lately` : ''}</small></td>
      <td><span class="m-acts" style="gap:4px">${st}</span></td><td><button data-a="rvprot" data-v="${esc(t.name)}" ${fresh ? '' : 'disabled'} title="${fresh ? `Their new parts (about ${(A.last.perf * 40.5).toFixed(2)} s a lap) to the stewards: a $0.5M deposit` : 'They have brought nothing new in the last three races'}">PROTEST${fresh && A.grey > 0.55 ? ' ?' : ''}</button></td></tr>`;
  }).join('');
  const app = R.approaches.map((a, i) => `<div class="m-drv"><div class="m-nm"><b>${esc(a.team)} want ${esc(a.name)}</b><small>Your ${esc(ROLE_NAME[a.role])} · they offer ${money(a.salary)} a season (he is on ${money(c.staff[a.role]?.salary || 0)}) · decides after round ${a.due}</small></div><div class="m-acts"><button class="m-go" data-a="rvmatch" data-v="${i}">MATCH ${money(a.salary)}</button><button data-a="rvlet" data-v="${i}">LET HIM GO</button></div></div>`).join('');
  const nx = regsNext(c);
  return `<div class="m-grid"><div class="m-card" style="grid-column:1/-1"><h3>The grid</h3><table><tr><th>#</th><th>Team</th><th>How they work</th><th>State</th><th>Car, a lap</th><th>Their people (ask one)</th><th></th></tr>${rows}</table>
    ${note('The car column is the timing: seconds a lap behind the quickest car, drivers apart. A team under pressure has missed its target; twice, and its principal goes - the next one works differently. Asking for one of their people costs a fee and their goodwill, and he may say no. A protest only works on parts in a grey area: the "?" is the paddock wondering.')}</div>
    <div class="m-card"><h3>They want your people${R.approaches.length ? ` · ${R.approaches.length}` : ''}</h3>${app || '<p>Nobody has been approached.</p>'}${note('Match the offer and he stays on that salary. Let him go and his deputy steps up - a tenth worse - while they pay you for the notice. Left alone, he usually goes.')}</div>
    <div class="m-card"><h3>The rules</h3><div class="m-big">${nx}</div><p style="font-size:13px;color:#4a5260">The next new technical regulations${nx === c.season + 1 ? ': next season' : ''}. Every car is a new one then: the parts built for this one are gone, the factory is not, and the order is drawn again - from how good each old car was, each factory, the work put into the new car early (CAR page), and luck.</p></div></div>`;
}
function marketHTML(c) {
  const next = Object.values(c.teams).sort((a, b) => a.garage - b.garage).map((t) => {
    const stay = c.seatsOf(t.name).map((d) => { const gone = d.retiring ? 'retiring' : d.out ? 'out' : d.next && d.next.team !== t.name ? `to ${d.next.team}` : d.until <= c.season && !d.renew && t.name !== c.myTeam ? 'contract ending' : d.until <= c.season && t.name === c.myTeam ? (d.offer ? `offer from ${d.offer.team}` : 'contract ending') : ''; return `<span style="${gone ? 'color:#a33;text-decoration:' + (/retiring|out|to /.test(gone) ? 'line-through' : 'none') : ''}">${esc(sur(d.name))}</span>${gone ? ` <small>(${esc(gone)})</small>` : ` <small>to ${d.until}</small>`}`; });
    const come = Object.values(c.drivers).filter((d) => d.next?.team === t.name && d.team !== t.name).map((d) => `<b style="color:#1fae64">${esc(sur(d.name))}</b> <small>(signed)</small>`);
    return `<tr class="${t.name === c.myTeam ? 'm-me' : ''}"><td>${sw(c, t.name)}${esc(t.name)}</td><td>${[...stay, ...come].join(' · ')}</td></tr>`;
  }).join('');
  const D = Object.values(c.drivers).filter((d) => !d.retired);
  const moves = [...D.filter((d) => d.team === c.myTeam && d.offer).map((d) => `<div class="m-drv"><div class="m-nm"><b>${esc(d.name)}</b><small>Offer from ${esc(d.offer.team)}: ${money(d.offer.salary)} a season. Extend him (DRIVERS) or he goes in the winter.</small></div></div>`),
    ...D.filter((d) => d.retiring).map((d) => `<div class="m-drv"><div class="m-nm"><b>${esc(d.name)} · ${ageOf(c, d)}</b><small>Retiring at the end of the season${d.team ? ` (${esc(d.team)})` : ''}.</small></div></div>`)].join('');
  const champs = (c.history || []).slice().reverse().map((h) => `<tr><td>${h.season}</td><td>${esc(h.champ || '-')}</td><td>${esc(h.champTeam || '-')}</td><td>P${h.pos}</td></tr>`).join('');
  const log = (c.era?.log || []).slice(-8).reverse().map((e) => `<div class="m-drv"><div class="m-nm"><b style="font-weight:600">${e.kind === 'regs' ? `${e.season}: new regulations - ${esc(e.order.join(', '))} quickest out of the box` : `${e.season}: ${esc(e.name)} retired`}</b></div></div>`).join('');
  return `<div class="m-grid"><div class="m-card" style="grid-column:1/-1"><h3>Next season's grid, as it stands</h3><table><tr><th>Team</th><th>Drivers</th></tr>${next}</table>
    ${note('From the season\'s half-way the teams decide: renew, or sign someone better for next year - a free agent, a man whose contract is ending elsewhere, one of yours. A driver of yours with an offer leaves in the winter unless you extend him first; he asks more while the offer stands.')}</div>
    <div class="m-card"><h3>On the move</h3>${moves || '<p>Nothing yet. It starts at the season\'s half-way.</p>'}</div>
    <div class="m-card"><h3>Champions</h3>${champs ? `<table><tr><th>Season</th><th>Driver</th><th>Constructor</th><th>You</th></tr>${champs}</table>` : '<p>The first season is still being raced.</p>'}${log ? `<h3 style="margin-top:14px">The years</h3>${log}` : ''}</div></div>`;
}
function academyHTML(c) {
  const A = c.academy, room = 2 + A.level;
  const jun = A.juniors.map((j, i) => `<div class="m-drv"><div class="m-rt">${Math.round(j.rating * 100)}</div><div class="m-nm"><b>${esc(j.name)} · ${ageOf(c, j)}</b><small>${esc(SERIES[j.series].name)} · could be ${Math.round(j.lo * 100)}-${Math.round(j.hi * 100)} · ${j.res.length ? j.res.slice(-3).map((r) => `${r.season} ${r.series} P${r.pos}`).join(', ') : 'first season'} · ${money(SERIES[j.series].cost)} a season</small>${bar((j.rating - 0.58) / 0.34, '#2d6cdf')}</div>
    <div class="m-acts"><button class="${j.rating >= 0.755 ? 'm-go' : ''}" data-a="acprom" data-v="${i}" ${j.rating >= 0.755 ? '' : 'disabled title="Not the results for a super licence yet (76)"'}>PROMOTE</button><button data-a="acrel" data-v="${i}">RELEASE</button></div></div>`).join('');
  const pro = A.prospects.map((p, i) => `<div class="m-drv"><div class="m-rt">${Math.round(p.rating * 100)}</div><div class="m-nm"><b>${esc(p.name)} · ${ageOf(c, p)}</b><small>The scouts say ${Math.round(p.lo * 100)}-${Math.round(p.hi * 100)} one day · ${money(p.sign)} to sign</small></div><div class="m-acts"><button data-a="acsign" data-v="${i}" ${A.juniors.length >= room ? 'disabled title="The academy is full"' : ''}>SIGN</button></div></div>`).join('');
  const grads = Object.values(c.drivers).filter((d) => d.academy === c.myTeam && !d.team && !d.retired).map((d) => `<div class="m-drv"><div class="m-rt">${Math.round(d.rating * 100)}</div><div class="m-nm"><b>${esc(d.name)} · ${ageOf(c, d)}</b><small>Graduated: yours to sign first${(d.hold ?? 0) >= c.season ? ` until the end of ${d.hold}` : ' no longer - anyone may'} (DRIVERS). He asks less of the team that brought him up.</small></div></div>`).join('');
  return `<div class="m-grid"><div class="m-card"><h3>Your academy · level ${A.level}</h3><div class="m-row2"><span>Places</span><b>${A.juniors.length} of ${room}</b></div><div class="m-row2"><span>The scouts' guess is within</span><b>± ${Math.round((0.07 - A.level * 0.018) * 100)}</b></div>
      ${A.level < 3 ? `<button class="m-dark" data-a="acup" style="margin-top:8px">BUILD IT UP · ${money(ACADEMY_COST[A.level])}</button>` : ''}
      ${note('A junior races Formula 4, then 3, then 2, a season at a time, getting nearer to what he could be - faster in a better academy. At 76 he can be promoted: he is then a free agent only you may sign, this season and next, and he asks less of you. Three seasons of Formula 2 without a seat and he leaves. Each winter new prospects are scouted.')}</div>
    <div class="m-card"><h3>Juniors</h3>${jun || '<p>Nobody yet: sign a prospect.</p>'}${grads ? `<h3 style="margin-top:14px">Graduates</h3>${grads}` : ''}</div>
    <div class="m-card"><h3>Prospects this year</h3>${pro || '<p>All signed. More next winter.</p>'}</div></div>`;
}
/** DRIVERS: yours (age, where he is in his career, his contract, who wants him, what he asks to stay) and the free agents (what each asks of YOU) */
export function driversHTML(c) {
  const D = c.seatsOf(c.myTeam), empty = !c.seatsReady();
  const F = c.freeAgents().sort((a, b) => ((b.academy === c.myTeam) - (a.academy === c.myTeam)) || b.rating - a.rating).slice(0, 16);
  const mine = D.map((d) => {
    const T1 = contractAsk(c, d, 1), T2 = contractAsk(c, d, 2);
    return `<div class="m-drv"><div class="m-rt">${Math.round(d.rating * 100)}</div><div class="m-nm"><b>${esc(d.name)} · ${ageOf(c, d)}</b><small>#${d.number} · ${arc(c, d)} · ${d.points} pts · ${d.starts || 0} starts, ${d.wins || 0} wins · ${money(d.salary)}/season to the end of ${d.until}${d.retiring ? ' · <b style="color:#a33">retiring at the end of the season</b>' : ''}${d.offer ? ` · <b style="color:#a33">offer from ${esc(d.offer.team)}</b>` : ''}</small></div>
    <div class="m-acts">${T1.no ? `<button disabled title="${esc(T1.no)}">EXTEND</button>` : `<button data-a="extend" data-v="${d.id}|1" title="${esc(T1.why || '')}">+1 YEAR · ${money(T1.salary)}</button><button data-a="extend" data-v="${d.id}|2" title="${esc(T2.why || '')}">+2 · ${money(T2.salary)}</button>`}<button data-a="release" data-v="${d.id}" title="Paying off the contract: ${money(c.releaseCost(d))}">RELEASE · ${money(c.releaseCost(d))}</button></div></div>`;
  }).join('');
  const free = F.map((d) => {
    const T = [1, 2, 3].map((y) => contractAsk(c, d, y)), no = T[1].no;
    return `<div class="m-drv"><div class="m-rt">${Math.round(d.rating * 100)}</div><div class="m-nm"><b>${esc(d.name)} · ${ageOf(c, d)}</b><small>${d.academy === c.myTeam ? '<b style="color:#1fae64">your junior</b>' : esc(d.from || '')} · ${arc(c, d)}${no ? ` · <span style="color:#a33">${esc(no)}</span>` : ` · asks ${money(T[1].salary)}/season, ${money(T[1].fee)} to sign${T[1].why ? ` · ${esc(T[1].why)}` : ''}`}</small></div>
    <div class="m-acts">${no ? '' : [1, 2, 3].map((y) => `<button class="${empty && y === 2 ? 'm-go' : ''}" data-a="sign" data-v="${d.id}|${y}"${empty ? ` title="${y} season${y > 1 ? 's' : ''}: ${money(T[y - 1].salary)} a season"` : ' disabled title="Both seats are taken: release a driver first"'}>${y}Y</button>`).join('')}</div></div>`;
  }).join('');
  return `<div class="m-grid"><div class="m-card"><h3>Your drivers</h3>${mine || '<p>No drivers.</p>'}${note('Rating: pace and racecraft out of 100. A driver improves to about 27, holds it into his thirties, then fades; from 36 any season may be his last. A contract that ends this season runs out in the winter - extend to keep him. What he asks depends on what he is worth, where your team is in the order, how he feels, and whether someone else wants him.')}</div>
    <div class="m-card"><h3>Free agents</h3>${free || '<p>Nobody is free.</p>'}</div></div>`;
}
/** on the overview: what the paddock is waiting on you for */
export function eraHome(c) {
  const a = c.rivals?.approaches || [], off = c.seatsOf(c.myTeam).filter((d) => d.offer), nx = regsNext(c), out = [];
  for (const x of a) out.push(`${esc(x.team)} want your ${esc(ROLE_NAME[x.role])}, ${esc(x.name)} <button data-tab="rivals" style="margin-left:6px">ANSWER</button>`);
  for (const d of off) out.push(`${esc(d.name)} has an offer from ${esc(d.offer.team)} <button data-tab="drv" style="margin-left:6px">DRIVERS</button>`);
  if (nx === c.season + 1) out.push(`New regulations next season: the work on next year's car counts double <button data-tab="car" style="margin-left:6px">CAR</button>`);
  return out.length ? `<div class="m-card"><h3>The paddock</h3>${out.map((t) => `<div class="m-row2"><span>${t}</span></div>`).join('')}</div>` : '';
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
