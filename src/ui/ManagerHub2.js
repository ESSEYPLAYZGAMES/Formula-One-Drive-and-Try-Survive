// The team principal's HQ, its further pages (ui/ManagerHub.js draws the frame and passes the clicks on; ui/HQKit.js is
// what they are built from): PIT CREW (who, how quick, how tired - the whole crew down the left; the stop, the training
// plan and the market stacked on the right), MORALE (your two drivers side by side - how each feels, what you say and
// promise - the team beside them; the race engineers under), DESIGN (the design focus and how the car suits each
// circuit; the tunnel's hours; next year's car; the power unit's maker; the factory's work to rush) - and on the
// overview: the press's question.
import { CREW_ROLES, TRAIN_FOCUS, TRAIN_INT, RELEASE, crewExpect, crewHire } from '../career/ManagerCrew.js';
import { TALKS, talk, moraleWord, engineerOf, swapEngineers, hireEngineer, answerPress } from '../career/ManagerPeople.js';
import { FOCUS, TRACK_DF, SUPPLIERS, NEXT_SHARES, SWITCH_FEE, aeroOf, trackFit, fitText, supplierOf, supplyDiff, isWorks, atrAllowance, atrLeft, atrCost, rush, signSupplier, rulesChange } from '../career/ManagerCar.js';
import { upgradeName } from '../career/TechTree.js';
import { esc, money, pct, sur, panel, kv, meter, ring, seg, person, stat, tag, empty } from './HQKit.js';

export const EXTRA_CSS = `
#mgr .q-cb { display: grid; grid-template-columns: 1fr 34px; gap: 6px; align-items: center; } #mgr .q-cb small { text-align: right; font-variant-numeric: tabular-nums; }
#mgr .q-fit { display: grid; grid-template-columns: 1fr auto; gap: 4px 10px; align-items: center; font-size: 12px; } #mgr .q-fit span { color: var(--dim); } #mgr .q-fit span small { color: var(--mute); } #mgr .q-fit b { text-align: right; }
#mgr .q-talk { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; } #mgr .q-talk button { padding: 8px 4px; white-space: normal; line-height: 1.15; }
#mgr .q-press { padding: 10px 0; border-bottom: 1px solid var(--line); } #mgr .q-press:last-child { border: 0; } #mgr .q-press > b { display: block; margin-bottom: 6px; font: 700 13px/1.3 var(--f); } #mgr .q-press .op { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; padding: 5px 0; } #mgr .q-press .op small { display: block; color: var(--mute); font-size: 11px; }
`;

export function extraHTML(c, tab, T) {
  if (tab === 'crew') return crewHTML(c);
  if (tab === 'people') return peopleHTML(c);
  if (tab === 'car') return carHTML(c, T);
  return null;
}
function crewHTML(c) {
  const M = c.crew, E = crewExpect(c);
  const rows = CREW_ROLES.map((R) => { const m = M.members.find((x) => x.role === R.id); return `<tr><td><small>${esc(R.name)}</small><br><b>${esc(m.name)}</b></td><td style="width:22%"><div class="q-cb">${meter(m.speed)}<small>${Math.round(m.speed * 100)}</small></div></td><td style="width:22%"><div class="q-cb">${meter(m.cons)}<small>${Math.round(m.cons * 100)}</small></div></td><td style="width:20%">${meter(1 - m.fat)}<small>${m.fat > 0.6 ? 'exhausted' : m.fat > 0.35 ? 'tired' : 'fresh'}</small></td></tr>`; }).join('');
  const market = (M.market || []).map((p, i) => { const R = CREW_ROLES.find((x) => x.id === p.role), cur = M.members.find((x) => x.role === p.role); return person({ rt: p.speed, sm: true, col: p.speed > cur.speed ? 'var(--good)' : 'var(--mute)', name: esc(p.name), sub: `${esc(R.name)} · speed ${Math.round(p.speed * 100)} (now ${Math.round(cur.speed * 100)}) · consistency ${Math.round(p.cons * 100)} (now ${Math.round(cur.cons * 100)}) · ${money(p.salary * 1.5)} to bring in`, act: `<button data-a="crewhire" data-v="${i}">HIRE</button>` }); }).join('');
  return `<div class="q-g">${panel('The crew', `<table><thead><tr><th>Job · who</th><th>Speed</th><th>Consistency</th><th>Freshness</th></tr></thead><tbody>${rows}</tbody></table>`, { w: 7, h: 3, pad: false, k: 'crew' })}
    ${panel('The stop', `<div style="display:flex;gap:18px;align-items:flex-end;margin-bottom:8px"><div class="q-huge">${E.time.toFixed(2)}<small style="font-size:13px;color:var(--mute);margin-left:4px">s</small></div><p class="q-fine" style="margin:0 0 3px">on an average day</p></div>
      ${kv('A mistake in a stop', pct(E.err), E.err > 0.15 ? 'bad' : '')}${kv('Ready for a double stop', pct(M.stack))}${kv('Release', seg('crewrel', M.release, Object.entries(RELEASE).map(([k, R]) => [k, R.name, k === 'safe' ? 'Two tenths lost, never an unsafe release' : k === 'aggr' ? 'A tenth and a half gained; now and then an unsafe release: 5 s' : 'As trained'])))}`, { w: 5, scroll: false, info: 'A stop is as long as its slowest corner (the gun and the tyre handler there) and the jacks. The crew chief (STAFF) and the training centre (FACILITIES) shorten every stop. At a race weekend the crew can practise stops (PRACTICE): sharper for that race, a little more tired.' })}
    ${panel('Training between the races', `${kv('Focus', seg('crewfocus', M.plan.focus, Object.entries(TRAIN_FOCUS).map(([k, n]) => [k, n])))}${kv('Intensity', seg('crewint', M.plan.int, Object.entries(TRAIN_INT).map(([k, I]) => [k, I.name, k === 'hard' ? 'Learns the most, tires the most' : k === 'light' ? 'Learns little, recovers' : 'Holds its freshness over a short season'])))}
      <div style="margin-top:6px">${kv('The crew\'s fatigue', pct(E.fatigue), E.fatigue > 0.5 ? 'bad' : '')}${meter(E.fatigue, null, { inv: true })}</div>`, { w: 5, scroll: false, info: 'Speed and consistency are trained one at a time; double stops are their own drill; rest takes the fatigue off. A tired crew fumbles: wheel nuts, jacks, wheels.' })}
    ${panel('On the market', market || empty('Nobody now: new people at the season\'s end.'), { w: 5, k: 'crewm' })}</div>`;
}
function peopleHTML(c) {
  const D = c.seatsOf(c.myTeam);
  const drv = D.map((d) => {
    const e = engineerOf(c, d.id), P = (c.promises || []).filter((p) => p.did === d.id && p.season === c.season), mo = d.morale ?? 60;
    return panel(esc(d.name), `<div style="display:flex;gap:14px;align-items:center;margin-bottom:8px">${ring(mo / 100, { big: true, col: mo >= 66 ? 'var(--good)' : mo >= 40 ? 'var(--warn)' : 'var(--bad)', text: mo })}<div><div class="q-big">${esc(moraleWord(mo))}</div><p class="q-fine" style="margin:3px 0 0">morale · it is his form on track</p></div></div>
      ${kv('Contract', `to the end of ${d.until} · ${money(d.salary)}`)}${kv('Race engineer', e ? `${esc(e.name)} · chemistry ${pct(e.chem)}` : 'none')}
      ${P.length ? kv('Promises', P.map((p) => `${{ no1: 'number one', part: `a part by round ${p.due}`, contract: 'contract talks' }[p.kind]}${p.done ? (p.kept ? ' ✓' : ' ✗') : ''}`).join(', ')) : ''}
      <h3 style="margin:10px 0 6px;font:800 9px/1 var(--f);letter-spacing:.2em;color:var(--mute)">TALK TO HIM</h3><div class="q-talk">${Object.entries(TALKS).map(([k, T]) => `<button data-a="talk" data-v="${d.id}|${k}" title="${esc(T.title)}">${T.name}</button>`).join('')}</div>`, { w: 4, k: `pp${d.id}` });
  }).join('');
  const team = panel('The team', `<div style="display:flex;gap:14px;align-items:center;margin-bottom:8px">${ring(1 - (c.fatigue || 0), { big: true, col: (c.fatigue || 0) > 0.6 ? 'var(--bad)' : (c.fatigue || 0) > 0.35 ? 'var(--warn)' : 'var(--good)', text: pct(c.fatigue || 0) })}<div><div class="q-big">${(c.fatigue || 0) > 0.6 ? 'Exhausted' : (c.fatigue || 0) > 0.35 ? 'Tired' : 'Fresh'}</div><p class="q-fine" style="margin:3px 0 0">fatigue across the factory and the garage</p></div></div>
    ${kv('Before the next race', seg('rest', c.restWeek ? 1 : 0, [[0, 'Work'], [1, 'Rest week', 'The factory stands still for a round; the fatigue comes off']]))}`, { w: 4, scroll: false, info: 'The team tires every round - more with a full factory and hard pit crew training. Tired, new parts correlate worse and the crew fumbles. Morale is the driver\'s form on track (pace, mistakes, starts); an unhappy driver will not sign a new contract.' });
  const eng = panel('Race engineers', (c.engineers || []).map((e) => person({ rt: e.feedback, name: esc(e.name), sub: `with ${esc(c.drivers[e.did]?.name || 'no driver')} · chemistry ${pct(e.chem)}`, under: meter(e.chem, 'var(--ac)', { thin: true }) })).join(''), { w: 7, act: '<button data-a="engswap">SWAP THEM</button>', info: 'Feedback: how much each practice run tells you about the set-up. Chemistry grows with every race together and is a little pace; a new pairing starts again.' });
  const mk = panel('Engineers available', (c.engMarket || []).map((p, i) => person({ rt: p.feedback, sm: true, name: esc(p.name), sub: '$0.8M to bring in', act: (c.engineers || []).map((e, k) => `<button data-a="enghire" data-v="${i}|${k}">FOR ${esc(sur(c.drivers[e.did]?.name).toUpperCase())}</button>`).join('') })).join('') || empty('Nobody now.'), { w: 5, k: 'engm' });
  return `<div class="q-g" style="grid-template-rows:minmax(0,1.5fr) minmax(0,1fr)">${drv}${team}${eng}${mk}</div>`;
}
function carHTML(c, T) {
  const t = c.team, A = aeroOf(t), trk = c.seasonDone ? null : c.track, name = (k) => T?.o?.trackName?.(k) || k;
  const ch = A.k < 0.05 ? 'No character yet' : `${A.p < -0.25 ? 'Low drag' : A.p > 0.25 ? 'High downforce' : 'Balanced'}`;
  const design = panel('Design focus', `${kv('New aero for', seg('focus', c.designFocus, Object.entries(FOCUS).map(([k, F]) => [k, F.name])))}
    <div style="margin:8px 0 10px"><div class="q-big">${ch}${A.k >= 0.05 ? `<small>${Math.round(A.k * 100)}% defined</small>` : ''}</div>${meter(A.k, 'var(--ac)')}</div>
    <div class="q-fit">${Object.keys(TRACK_DF).map((k) => `<span>${esc(name(k))}${k === trk ? ` ${tag('next', 'ac')}` : ''} <small>wants ${TRACK_DF[k] < -0.2 ? 'low drag' : TRACK_DF[k] > 0.2 ? 'downforce' : 'balance'}</small></span><b>${fitText(trackFit(t, k))}</b>`).join('')}</div>`, { w: 4, h: 3, k: 'dsg', info: 'Every aerodynamic level built (FACTORY) takes the focus chosen here; the car becomes what is on it.' });
  const left = Math.max(0, atrLeft(c)), al = atrAllowance(c);
  const hours = panel('Wind tunnel & CFD', `<div style="display:flex;gap:16px;align-items:center">${ring(left / Math.max(1, al), { big: true, text: left })}<div><div class="q-big">${left}<small>of ${al} hours</small></div><p class="q-fine" style="margin:3px 0 0">left this season</p></div></div>${kv('An aero level costs', `${atrCost(1)}-${atrCost(5)} hours`)}${kv('Allowance', `${al} hours · fewer the higher you finish`)}`, { w: 4, h: 3, scroll: false, info: `The testing restrictions: the higher in the constructors' championship, the fewer hours. An aerodynamic level costs ${atrCost(1)}-${atrCost(5)} hours as well as its price; with none left, no aero work starts until next season.` });
  const next = panel(`The ${c.season + 1} car`, `${kv('Factory on next year\'s car', seg('nextshare', c.nextCar.share, NEXT_SHARES.map((s) => [s, pct(s), s >= 0.75 ? 'Every level started this season takes two races longer' : s >= 0.5 ? 'Every level started this season takes a race longer' : ''])))}
    ${kv('Head start banked', `${((c.nextCar.pts / Math.max(1, c.rounds)) * 0.0025 * 90 * (rulesChange(c.season + 1) ? 2 : 1)).toFixed(2)} s a lap`, 'good')}
    ${rulesChange(c.season + 1) ? '<p class="warn" style="font-size:12px"><b>New regulations next season:</b> this work counts double, and everyone\'s old advantage is cut by a third.</p>' : ''}`, { w: 4, h: 3, scroll: false, info: 'The other teams make the same choice. A full season at 75 % is worth about 0.17 s a lap at the start of the next.' });
  const cur = supplierOf(c, t.engine), works = isWorks(c);
  const sup = panel('Power unit', `<div style="padding:0 14px 8px"><div class="q-big">${esc(cur.name)}<small>${works ? 'works team' : 'customer'}</small></div></div>
    <table><thead><tr><th>Maker</th><th class="n">Power</th><th class="n">Failures</th><th class="n">A season</th><th></th></tr></thead><tbody>${Object.keys(SUPPLIERS).map((k) => { const S = supplierOf(c, k), d = supplyDiff(c, k); return `<tr class="${k === t.engine ? 'me' : ''}"><td><b>${esc(S.name)}</b></td><td class="n">${S.power >= 0 ? '+' : '−'}${Math.abs(S.power * 90).toFixed(2)} s</td><td class="n">${pct(S.rel)}</td><td class="n">${works ? '' : d ? `${d > 0 ? '+' : '−'}${money(Math.abs(d))}` : 'as now'}</td><td class="n">${works ? '' : `<button data-a="supplier" data-v="${k}" class="${(c.engineNext || t.engine) === k ? 'go' : ''}">${k === t.engine ? (c.engineNext ? 'STAY' : 'NOW') : c.engineNext === k ? 'SIGNED' : 'SIGN'}</button>`}</td></tr>`; }).join('')}</tbody></table>`, { w: 4, h: 6, pad: false, k: 'pu', info: works ? 'A works team builds its own.' : `A new maker's unit is in the car from next season: ${money(SWITCH_FEE)} to change the car round it. The makers' power and reliability move a little every winter.` });
  const dev = (t.dev || []).map((x) => person({ name: esc(upgradeName(x.id, x.level) || x.id), sub: `${x.left} race${x.left === 1 ? '' : 's'} to go${x.rushed ? ' · rushed' : ''}`, act: `<button data-a="rush" data-v="${x.id}"${x.left <= 1 || x.rushed ? ' disabled' : ''}>RUSH · ${money((x.cost || 4) * 0.4)}</button>` })).join('');
  const rsh = panel('In the factory', dev || `${empty('Nothing being built.')}<button class="ghost" data-tab="fac">FACTORY →</button>`, { w: 4, h: 3, k: 'rush', info: 'RUSH brings a level forward a race for 40 % of its price again (under the cost cap).' });
  // (two rows: the focus and the power unit the height of both; between them the tunnel over next year's car - and the factory's work under the tunnel's column is the fifth: three columns, the middle one of three)
  // (the power unit down the middle; the focus over the factory's work on its left, the tunnel over next year's car on its right)
  return `<div class="q-g" style="grid-template-rows:repeat(6, minmax(0, 1fr))">${design}${sup}${hours}${rsh}${next}</div>`;
}
/** the overview's NEEDS YOU: the press's question, its answers on the spot */
export function homeExtra(c) {
  const P = c.press; if (!P || P.done) return '';
  return `<div class="q-press"><b>${tag('The press', 'ac')} ${esc(P.q)}</b>${P.opts.map((o, i) => `<div class="op"><div><b>${esc(o.t)}</b><small>${esc(o.text)}</small></div><button data-a="press" data-v="${i}">SAY IT</button></div>`).join('')}</div>`;
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
