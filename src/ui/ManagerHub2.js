// The team principal's HQ, its further pages (ui/ManagerHub.js draws the frame and passes the clicks on): CREW (the pit
// crew: who, how quick, how tired; the training plan; the release; replacements), PEOPLE (the drivers' morale, what you
// say and promise, the race engineers), CAR (the design focus, the tunnel's hours, next year's car, the power unit's
// maker, the factory's work to rush) - and on the overview: the press's question and the rest week.
import { CREW_ROLES, TRAIN_FOCUS, TRAIN_INT, RELEASE, crewExpect, crewHire } from '../career/ManagerCrew.js';
import { TALKS, talk, moraleWord, engineerOf, swapEngineers, hireEngineer, answerPress } from '../career/ManagerPeople.js';
import { FOCUS, TRACK_DF, SUPPLIERS, NEXT_SHARES, SWITCH_FEE, aeroOf, trackFit, fitText, supplierOf, supplyDiff, isWorks, atrAllowance, atrLeft, atrCost, rush, signSupplier, rulesChange } from '../career/ManagerCar.js';
import { UP, upgradeName } from '../career/TechTree.js';

export const EXTRA_TABS = [['crew', 'PIT CREW'], ['people', 'PEOPLE'], ['car', 'CAR']];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (m) => `$${(Math.round(m * 10) / 10).toFixed(1)}M`;
const pct = (x) => `${Math.round(x * 100)}%`;
const bar = (x, col) => `<div class="m-bar" style="--bc:${col || (x > 0.66 ? '#1fae64' : x > 0.4 ? '#e0a100' : '#d4351c')}"><i style="width:${(Math.max(0, Math.min(1, x)) * 100).toFixed(0)}%"></i></div>`;
const seg = (a, cur, opts) => `<span class="m-seg">${opts.map(([v, n, t]) => `<button data-a="${a}" data-v="${v}" class="${String(cur) === String(v) ? 'm-on' : ''}"${t ? ` title="${esc(t)}"` : ''}>${esc(n)}</button>`).join('')}</span>`;
const note = (t) => `<p style="font-size:12px;color:#6b7480">${t}</p>`;

export function extraHTML(c, tab, T) {
  if (tab === 'crew') return crewHTML(c);
  if (tab === 'people') return peopleHTML(c);
  if (tab === 'car') return carHTML(c, T);
  return null;
}
function crewHTML(c) {
  const M = c.crew, E = crewExpect(c);
  const rows = CREW_ROLES.map((R) => { const m = M.members.find((x) => x.role === R.id); return `<tr><td>${esc(R.name)}</td><td><b>${esc(m.name)}</b></td><td style="width:16%">${bar(m.speed)}<small>${Math.round(m.speed * 100)}</small></td><td style="width:16%">${bar(m.cons)}<small>${Math.round(m.cons * 100)}</small></td><td style="width:16%">${bar(1 - m.fat, m.fat > 0.6 ? '#d4351c' : m.fat > 0.35 ? '#e0a100' : '#1fae64')}<small>${m.fat > 0.6 ? 'exhausted' : m.fat > 0.35 ? 'tired' : 'fresh'}</small></td></tr>`; }).join('');
  const market = (M.market || []).map((p, i) => { const R = CREW_ROLES.find((x) => x.id === p.role), cur = M.members.find((x) => x.role === p.role); return `<div class="m-drv"><div class="m-nm"><b>${esc(p.name)}</b><small>${esc(R.name)} · speed ${Math.round(p.speed * 100)} (now ${Math.round(cur.speed * 100)}) · consistency ${Math.round(p.cons * 100)} (now ${Math.round(cur.cons * 100)}) · ${money(p.salary * 1.5)} to bring in</small></div><button data-a="crewhire" data-v="${i}">HIRE</button></div>`; }).join('');
  return `<div class="m-grid"><div class="m-card" style="grid-column:1/-1"><h3>The crew</h3><table><tr><th>Job</th><th>Who</th><th>Speed</th><th>Consistency</th><th>Freshness</th></tr>${rows}</table></div>
    <div class="m-card"><h3>The stop</h3><div class="m-big">${E.time.toFixed(2)} s<span style="font-size:13px;color:#6b7480;font-weight:600"> on an average day</span></div>
      <div class="m-row2"><span>A mistake in a stop</span><b style="color:${E.err > 0.15 ? '#d4351c' : 'inherit'}">${pct(E.err)}</b></div>
      <div class="m-row2"><span>Ready for a double stop</span><b>${pct(M.stack)}</b></div>${bar(M.stack)}
      <div class="m-row2"><span>Release</span>${seg('crewrel', M.release, Object.entries(RELEASE).map(([k, R]) => [k, R.name, k === 'safe' ? 'Two tenths lost, never an unsafe release' : k === 'aggr' ? 'A tenth and a half gained; now and then an unsafe release: 5 s' : 'As trained']))}</div>
      ${note('A stop is as long as its slowest corner (the gun and the tyre handler there) and the jacks. The crew chief (STAFF) and the training centre (FACILITIES) shorten every stop. At a race weekend the crew can practise stops (PRACTICE): sharper for that race, a little more tired.')}</div>
    <div class="m-card"><h3>Training between the races</h3><div class="m-row2"><span>Focus</span>${seg('crewfocus', M.plan.focus, Object.entries(TRAIN_FOCUS).map(([k, n]) => [k, n]))}</div>
      <div class="m-row2"><span>Intensity</span>${seg('crewint', M.plan.int, Object.entries(TRAIN_INT).map(([k, I]) => [k, I.name, k === 'hard' ? 'Learns the most, tires the most' : k === 'light' ? 'Learns little, recovers' : 'Holds its freshness over a short season']))}</div>
      <div class="m-row2"><span>The crew's fatigue</span><b>${pct(E.fatigue)}</b></div>
      ${note('Speed and consistency are trained one at a time; double stops are their own drill; rest takes the fatigue off. A tired crew fumbles: wheel nuts, jacks, wheels.')}</div>
    <div class="m-card"><h3>On the market</h3>${market || '<p>Nobody now: new people at the season\'s end.</p>'}</div></div>`;
}
function peopleHTML(c) {
  const D = c.seatsOf(c.myTeam);
  const drv = D.map((d) => {
    const e = engineerOf(c, d.id), P = (c.promises || []).filter((p) => p.did === d.id && p.season === c.season);
    return `<div class="m-card"><h3>${esc(d.name)}</h3><div class="m-row2"><span>Morale</span><b>${d.morale ?? 60} · ${moraleWord(d.morale ?? 60)}</b></div>${bar((d.morale ?? 60) / 100)}
      <div class="m-row2"><span>Contract</span><b>to the end of ${d.until} · ${money(d.salary)}/season</b></div>
      <div class="m-row2"><span>Race engineer</span><b>${e ? `${esc(e.name)} · feedback ${Math.round(e.feedback * 100)} · chemistry ${pct(e.chem)}` : 'none'}</b></div>
      ${P.length ? `<div class="m-row2"><span>Promises</span><b>${P.map((p) => `${{ no1: 'number one', part: `a part by round ${p.due}`, contract: 'contract talks' }[p.kind]}${p.done ? (p.kept ? ' ✓' : ' ✗') : ''}`).join(', ')}</b></div>` : ''}
      <div class="m-acts" style="margin-top:8px">${Object.entries(TALKS).map(([k, T]) => `<button data-a="talk" data-v="${d.id}|${k}" title="${esc(T.title)}">${T.name}</button>`).join('')}</div></div>`;
  }).join('');
  const eng = `<div class="m-card"><h3>Race engineers</h3>${(c.engineers || []).map((e) => `<div class="m-drv"><div class="m-rt">${Math.round(e.feedback * 100)}</div><div class="m-nm"><b>${esc(e.name)}</b><small>with ${esc(c.drivers[e.did]?.name || 'no driver')} · chemistry ${pct(e.chem)}</small></div></div>`).join('')}
    <div class="m-acts"><button data-a="engswap">SWAP THE ENGINEERS</button></div>
    ${(c.engMarket || []).map((p, i) => `<div class="m-drv"><div class="m-rt" style="font-size:16px">${Math.round(p.feedback * 100)}</div><div class="m-nm"><b>${esc(p.name)}</b><small>available · $0.8M to bring in</small></div><span class="m-acts">${(c.engineers || []).map((e, k) => `<button data-a="enghire" data-v="${i}|${k}">FOR ${esc(String(c.drivers[e.did]?.name || '').split(' ').pop().toUpperCase())}</button>`).join('')}</span></div>`).join('')}
    ${note('Feedback: how much each practice run tells you about the set-up. Chemistry grows with every race together and is a little pace; a new pairing starts again.')}</div>`;
  const team = `<div class="m-card"><h3>The team</h3><div class="m-row2"><span>Fatigue</span><b>${pct(c.fatigue || 0)}</b></div>${bar(1 - (c.fatigue || 0))}
    <div class="m-row2"><span>Rest week before the next race</span>${seg('rest', c.restWeek ? 1 : 0, [[0, 'Work'], [1, 'Rest', 'The factory stands still for a round; the fatigue comes off']])}</div>
    ${note('The team tires every round - more with a full factory and hard pit crew training. Tired, new parts correlate worse and the crew fumbles. Morale is the driver\'s form on track (pace, mistakes, starts); an unhappy driver will not sign a new contract.')}</div>`;
  return `<div class="m-grid">${drv}${eng}${team}</div>`;
}
function carHTML(c, T) {
  const t = c.team, A = aeroOf(t), trk = c.seasonDone ? null : c.track, fit = trk ? trackFit(t, trk) : 1, name = (k) => T?.o?.trackName?.(k) || k;
  const ch = A.k < 0.05 ? 'no character yet' : `${A.p < -0.25 ? 'low drag' : A.p > 0.25 ? 'high downforce' : 'balanced'} (${Math.round(A.k * 100)}% defined)`;
  const design = `<div class="m-card"><h3>Design focus</h3><div class="m-row2"><span>New aero parts are designed for</span>${seg('focus', c.designFocus, Object.entries(FOCUS).map(([k, F]) => [k, F.name]))}</div>
    <div class="m-row2"><span>The car's character</span><b>${ch}</b></div>
    ${Object.keys(TRACK_DF).map((k) => `<div class="m-row2"><span>${esc(name(k))}${k === trk ? ' · next' : ''} <small style="color:#8a93a0">wants ${TRACK_DF[k] < -0.2 ? 'low drag' : TRACK_DF[k] > 0.2 ? 'downforce' : 'balance'}</small></span><b>${fitText(trackFit(t, k))}</b></div>`).join('')}
    ${note('Every aerodynamic level built (FACTORY) takes the focus chosen here; the car becomes what is on it.')}</div>`;
  const hours = `<div class="m-card"><h3>Wind tunnel &amp; CFD</h3><div class="m-big">${Math.max(0, atrLeft(c))}<span style="font-size:13px;color:#6b7480;font-weight:600"> of ${atrAllowance(c)} hours left this season</span></div>${bar(Math.max(0, atrLeft(c)) / atrAllowance(c))}
    ${note(`The testing restrictions: the higher in the constructors' championship, the fewer hours. An aerodynamic level costs ${atrCost(1)}-${atrCost(5)} hours as well as its price; with none left, no aero work starts until next season.`)}</div>`;
  const next = `<div class="m-card"><h3>Next year's car</h3><div class="m-row2"><span>Factory on the ${c.season + 1} car</span>${seg('nextshare', c.nextCar.share, NEXT_SHARES.map((s) => [s, pct(s), s >= 0.75 ? 'Every level started this season takes two races longer' : s >= 0.5 ? 'Every level started this season takes a race longer' : '']))}</div>
    <div class="m-row2"><span>Head start banked</span><b>${((c.nextCar.pts / Math.max(1, c.rounds)) * 0.0025 * 90 * (rulesChange(c.season + 1) ? 2 : 1)).toFixed(2)} s a lap</b></div>
    ${rulesChange(c.season + 1) ? '<p style="color:#b07b00"><b>New regulations next season:</b> work on next year\'s car counts double, and everyone\'s old advantage is cut by a third.</p>' : ''}
    ${note('The other teams make the same choice. A full season at 75 % is worth about 0.17 s a lap at the start of the next.')}</div>`;
  const cur = supplierOf(c, t.engine), works = isWorks(c);
  const sup = `<div class="m-card"><h3>Power unit</h3><div class="m-big">${esc(cur.name)}<span style="font-size:13px;color:#6b7480;font-weight:600"> · ${works ? 'works team' : 'customer'}</span></div>
    <table><tr><th>Maker</th><th>Power</th><th>Failures</th><th>A season</th><th></th></tr>${Object.keys(SUPPLIERS).map((k) => { const S = supplierOf(c, k), d = supplyDiff(c, k); return `<tr class="${k === t.engine ? 'm-me' : ''}"><td>${esc(S.name)}</td><td>${S.power >= 0 ? '+' : '−'}${Math.abs(S.power * 90).toFixed(2)} s</td><td>${pct(S.rel)}</td><td>${works ? '' : d ? `${d > 0 ? '+' : '−'}${money(Math.abs(d))}` : 'as now'}</td><td>${works ? '' : `<button data-a="supplier" data-v="${k}" class="${(c.engineNext || t.engine) === k ? 'm-on' : ''}">${k === t.engine ? (c.engineNext ? 'STAY' : 'NOW') : c.engineNext === k ? 'SIGNED' : 'SIGN'}</button>`}</td></tr>`; }).join('')}</table>
    ${note(works ? 'A works team builds its own.' : `A new maker's unit is in the car from next season: ${money(SWITCH_FEE)} to change the car round it. The makers' power and reliability move a little every winter.`)}</div>`;
  const dev = (t.dev || []).map((x) => `<div class="m-drv"><div class="m-nm"><b>${esc(upgradeName(x.id, x.level) || x.id)}</b><small>${x.left} race${x.left === 1 ? '' : 's'} to go${x.rushed ? ' · rushed' : ''}</small></div><button data-a="rush" data-v="${x.id}"${x.left <= 1 || x.rushed ? ' disabled' : ''}>RUSH · ${money((x.cost || 4) * 0.4)}</button></div>`).join('');
  const rsh = `<div class="m-card"><h3>In the factory</h3>${dev || '<p>Nothing being built: FACTORY to start a part.</p>'}${note('RUSH brings a level forward a race for 40 % of its price again (under the cost cap).')}</div>`;
  return `<div class="m-grid">${design}${hours}${next}${sup}${rsh}</div>`;
}
/** the overview's extra cards: the press's question */
export function homeExtra(c) {
  const P = c.press; if (!P || P.done) return '';
  return `<div class="m-card"><h3>The press</h3><p><b>${esc(P.q)}</b></p>${P.opts.map((o, i) => `<div class="m-drv"><div class="m-nm"><b>${esc(o.t)}</b><small>${esc(o.text)}</small></div><button data-a="press" data-v="${i}">SAY IT</button></div>`).join('')}${note('Every answer costs or wins something: a driver\'s morale, the board\'s confidence, the team\'s profile with sponsors. Unanswered by the next race: the board notices.')}</div>`;
}
/** a click on these pages -> { text, ok } | null (handled, nothing to say) | undefined (not ours) */
export function extraClick(c, a, v) {
  const R = (text, bad = /^(Not|No |You have already|.*will not|.*already|Two |There is no)/) => ({ text, ok: !bad.test(text) });
  if (a === 'crewfocus') { c.crew.plan.focus = v; c.save(); return null; }
  if (a === 'crewint') { c.crew.plan.int = v; c.save(); return null; }
  if (a === 'crewrel') { c.crew.release = v; c.save(); return null; }
  if (a === 'crewhire') { const r = crewHire(c, +v); c.save(); return R(r); }
  if (a === 'talk') { const [did, k] = String(v).split('|'); const r = talk(c, did, k); c.save(); return R(r); }
  if (a === 'engswap') { const r = swapEngineers(c); c.save(); return R(r); }
  if (a === 'enghire') { const [i, k] = String(v).split('|'); const r = hireEngineer(c, +i, +k); c.save(); return R(r); }
  if (a === 'rest') { c.restWeek = v === '1'; c.save(); return { text: c.restWeek ? 'A rest week: after the next race the fatigue comes off - and the factory makes no progress that round.' : 'Back to work.', ok: true }; }
  if (a === 'press') { const r = answerPress(c, +v); c.save(); return R(r); }
  if (a === 'focus') { c.designFocus = v; c.save(); return null; }
  if (a === 'nextshare') { c.nextCar.share = +v; c.save(); return null; }
  if (a === 'supplier') { const r = signSupplier(c, v); c.save(); return R(r); }
  if (a === 'rush') { const r = rush(c, v); c.save(); return R(r, /^(Not|Over|That is not|It )/); }
  return undefined;
}
