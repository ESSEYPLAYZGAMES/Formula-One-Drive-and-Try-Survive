// The team principal's car beyond the tech tree's levels (career/Manager.js, career/TechTree.js):
//
// DESIGN FOCUS. Every aerodynamic part is designed to a philosophy - low drag, balanced, high downforce - and the car
// takes on the character of what is on it (the more aero work with a focus, the more of one). A circuit wants what it
// wants: Las Vegas and Montreal's straights low drag, Silverstone and Austin's sweeps downforce. A car that suits the
// circuit gains up to ~0.13 s a lap; one that does not loses as much. The AI teams have characters of their own.
//
// TUNNEL AND CFD HOURS. The aerodynamic testing restrictions as an allowance: 100 hours a season scaled by the
// constructors' order (the leaders 70, tenth 115 - TechTree.atrFactor); every aerodynamic level costs hours (10 + 4 a
// level) as well as money, and with none left no aero work starts until next season.
//
// NEXT YEAR'S CAR. A share of the factory - 0, 25, 50 or 75 % - works on next season's car. This season pays: at 50 %
// every level started takes a race longer, at 75 % two. Next season gains: up to ~0.17 s a lap of a head start for a
// full season at 75 % (double in a year the rules change: every third season, when everyone's old advantage is also cut
// by a third). The AI teams make the same choice in their own way.
//
// THE POWER UNIT'S SUPPLIER. Works teams build their own; the rest buy (a dearer maker costs the difference a season,
// and $5M to change the car round a new unit): the unit's power and reliability as that maker has them (they drift from season to season). A customer may sign with another maker for
// next season.
//
// RUSH. A level in the factory brought forward a race for 40 % of its price again (under the cap).
import { UP, atrFactor, upgradeName } from './TechTree.js';

const r1 = (x) => Math.round(x * 10) / 10;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return (h >>> 0) / 4294967295; };

export const FOCUS = { ld: { name: 'Low drag', v: -1 }, bal: { name: 'Balanced', v: 0 }, hd: { name: 'High downforce', v: 1 } };
/** what each circuit asks of a car: -1 low drag .. +1 downforce */
export const TRACK_DF = { lasvegas: -0.85, montreal: -0.45, austin: 0.35, silverstone: 0.65 };
export const SUPPLIERS = {
  merc: { name: 'Mercedes', power: 0.0008, rel: 0.94, fee: 13, works: 'Mercedes' },
  ferrari: { name: 'Ferrari', power: 0.0006, rel: 1.0, fee: 12, works: 'Ferrari' },
  rbford: { name: 'Red Bull Ford', power: 0.0004, rel: 1.06, fee: 11, works: 'Red Bull Racing' },
  honda: { name: 'Honda', power: 0.0005, rel: 0.97, fee: 12, works: 'Aston Martin' },
  audi: { name: 'Audi', power: -0.0002, rel: 1.1, fee: 9, works: 'Audi' },
};
const DEFAULT_SUP = { McLaren: 'merc', Mercedes: 'merc', Williams: 'merc', Alpine: 'merc', Ferrari: 'ferrari', Haas: 'ferrari', Cadillac: 'ferrari', 'Red Bull Racing': 'rbford', 'Racing Bulls': 'rbford', 'Aston Martin': 'honda', Audi: 'audi' };
export const NEXT_SHARES = [0, 0.25, 0.5, 0.75];
export const SWITCH_FEE = 5;
/** what a maker's supply costs a season against the deal the team started with ($M, + dearer) */
export const supplyDiff = (c, key) => r1((SUPPLIERS[key]?.fee || 0) - (SUPPLIERS[c.team.engine0]?.fee || 0));
export const ATR_BASE = 100;

export function carEnsure(c) {
  for (const t of Object.values(c.teams)) {
    if (!t.aero) { const ai = t.name !== c.myTeam; t.aero = ai ? { sum: (hash(t.name + 'aero') * 2 - 1) * 4, n: 6 } : { sum: 0, n: 0 }; }
    if (!t.engine) t.engine = DEFAULT_SUP[t.name] || 'ferrari';
    if (t.engine0 == null) t.engine0 = t.engine;
  }
  if (!c.supDrift) c.supDrift = Object.fromEntries(Object.keys(SUPPLIERS).map((k) => [k, { power: 0, rel: 1 }]));
  if (!c.designFocus) c.designFocus = 'bal';
  if (!c.atr) c.atr = { used: 0 };
  if (!c.nextCar) c.nextCar = { share: 0, pts: 0 };
  if (c.engineNext === undefined) c.engineNext = null;
}
/** a team's aerodynamic character: p (-1 low drag .. +1 downforce) and how strong (0..1) */
export function aeroOf(t) { const a = t.aero || { sum: 0, n: 0 }; return { p: a.n ? clamp(a.sum / a.n, -1, 1) : 0, k: Math.min(1, a.n / 6) }; }
/** how a team's car suits a circuit: a factor on its performance (0.9986 .. 1.0014) */
export function trackFit(t, track) {
  const { p, k } = aeroOf(t), want = TRACK_DF[track] ?? 0;
  return 1 + (1 - Math.abs(p - want)) * 0.0014 * k;
}
export const fitText = (f) => { const s = (f - 1) * 90; return Math.abs(s) < 0.015 ? 'neutral' : `${s > 0 ? '+' : '−'}${Math.abs(s).toFixed(2)} s a lap`; };
/** the supplier's unit as it is this season: power (added to the car's performance) and rel (a factor on failures) */
export function supplierOf(c, key) { const S = SUPPLIERS[key] || SUPPLIERS.ferrari, d = c.supDrift?.[key] || { power: 0, rel: 1 }; return { ...S, key, power: S.power + d.power, rel: S.rel * d.rel }; }
/** what a team's power unit does to its cars, against the one it started the career with (the grid's balance is the tech tree's) */
export function engineFx(c, t) {
  const now = supplierOf(c, t.engine), was = SUPPLIERS[t.engine0] || now;
  return { perf: 1 + (now.power - was.power), relMul: now.rel / was.rel };
}
export const isWorks = (c, team = c.myTeam) => Object.values(SUPPLIERS).some((S) => S.works === team);

// ---- the tunnel's hours ------------------------------------------------------------------------------------------------
export const atrAllowance = (c) => Math.round(ATR_BASE * atrFactor(c, c.myTeam) * (c.story?.flags?.atrMul || 1));   // (less after a cost-cap breach: career/ManagerStory.js)
export const atrCost = (lvl) => 10 + 4 * lvl;
export const atrLeft = (c) => atrAllowance(c) - (c.atr?.used || 0);
/** may this level be started -> null, or why not (the cost cap first: career/Manager.js capCheck) */
export function buildCheck(c, id, lvl, cost) {
  const cap = c.capCheck?.(cost); if (cap) return cap;
  if (UP[id]?.atr && atrCost(lvl) > atrLeft(c)) return `No wind tunnel and CFD time left for it: ${atrCost(lvl)} hours needed, ${Math.max(0, atrLeft(c))} of ${atrAllowance(c)} left this season.`;
  return null;
}
/** a level started: its hours, its design focus, and the delay of a factory busy with next year's car */
export function onBuilt(c, id, lvl) {
  carEnsure(c);
  const u = UP[id], t = c.team;
  if (u?.atr) { c.atr.used += atrCost(lvl); t.aero.sum += FOCUS[c.designFocus]?.v ?? 0; t.aero.n += 1; }
  const extra = c.nextCar.share >= 0.75 ? 2 : c.nextCar.share >= 0.5 ? 1 : 0;
  if (extra && u?.branch !== 'facilities') { const x = (t.dev || []).find((y) => y.id === id && y.level === lvl); if (x) { x.left += extra; x.n = (x.n || x.left) + extra; } }
}
/** rush a level in the factory: a race sooner, 40 % of its price again -> text */
export function rush(c, id) {
  const t = c.team, x = (t.dev || []).find((y) => y.id === id); if (!x) return 'That is not in the factory.';
  if (x.left <= 1) return 'It is on the car after the next race already.';
  if (x.rushed) return 'It has been rushed once already.';
  const cost = r1((x.cost || 4) * 0.4), cap = c.capCheck?.(cost); if (cap) return cap;
  if (t.budget < cost) return `Not enough money: rushing it costs $${cost}M.`;
  t.budget = r1(t.budget - cost); t.devSpend = t.devSpend || { all: 0, fac: 0 }; t.devSpend.all = r1((+t.devSpend.all || 0) + cost);
  x.left--; x.rushed = true;
  return `${upgradeName(x.id, x.level)} rushed: $${cost}M, a race sooner.`;
}
/** a round's work on next year's car */
export function carRound(c) { carEnsure(c); c.nextCar.pts = +(c.nextCar.pts + c.nextCar.share).toFixed(2); }
/** the rules change every third season */
export const rulesChange = (season) => season % 3 === 0;
/**
 * The new season's cars (called with c.season already the new one): each team's head start from the work it put into
 * this car last season, the old advantages cut in a year the rules change, the makers' units drifting, a new supplier
 * signed, the tunnel's hours afresh -> lines of news
 */
export function carNewSeason(c) {
  carEnsure(c);
  const reg = rulesChange(c.season), out = [];
  for (const t of Object.values(c.teams)) {
    const mine = t.name === c.myTeam, share = mine ? c.nextCar.pts / Math.max(1, c.rounds) : 0.05 + hash(`${t.name}|${c.season}|next`) * 0.3;
    if (reg) t.perfAdj = (+t.perfAdj || 0) * 0.65 - (t.tier === 0 ? 0.0008 : 0) + (hash(`${t.name}|${c.season}|reg`) - 0.5) * 0.003;
    const gain = share * 0.0025 * (reg ? 2 : 1);
    t.perfAdj = +((+t.perfAdj || 0) + gain).toFixed(5);
    if (mine) out.push(`Last season's work on this car is worth ${(gain * 90).toFixed(2)} s a lap${reg ? ' under the new rules' : ''}.`);
  }
  if (reg) out.push(`New technical regulations for ${c.season}: the order is shaken, and the work done early counts double.`);
  for (const k of Object.keys(SUPPLIERS)) { const d = c.supDrift[k]; d.power = +clamp(d.power + (Math.random() - 0.5) * 0.0006, -0.001, 0.001).toFixed(5); d.rel = +clamp(d.rel * (0.96 + Math.random() * 0.08), 0.85, 1.2).toFixed(3); }
  if (c.engineNext && SUPPLIERS[c.engineNext] && !isWorks(c)) { c.team.engine = c.engineNext; c.team.budget = r1(c.team.budget - SWITCH_FEE); out.push(`${c.myTeam} race ${SUPPLIERS[c.engineNext].name} power this season ($${SWITCH_FEE}M to change the car round it).`); }
  c.engineNext = null;
  // (the supply the team started with is in its budget already: a dearer or a cheaper maker is the difference)
  if (!isWorks(c)) { const diff = supplyDiff(c, c.team.engine); if (diff) { c.team.budget = r1(c.team.budget - diff); out.push(`The power unit supply from ${SUPPLIERS[c.team.engine].name}: $${Math.abs(diff)}M ${diff > 0 ? 'more' : 'less'} than the old deal this season.`); } }
  c.nextCar = { share: c.nextCar.share, pts: 0 }; c.atr = { used: 0 };
  return out;
}
/** sign with a maker for next season (a customer team) -> text */
export function signSupplier(c, key) {
  if (isWorks(c)) return `${c.myTeam} build their own power unit.`;
  if (!SUPPLIERS[key]) return 'No such supplier.';
  c.engineNext = key === c.team.engine ? null : key;
  const diff = supplyDiff(c, key);
  return c.engineNext ? `${SUPPLIERS[key].name} power for next season: $${SWITCH_FEE}M to change, then ${diff ? `$${Math.abs(diff)}M a season ${diff > 0 ? 'more' : 'less'} than now` : 'the same price'}.` : `Staying with ${SUPPLIERS[key].name}.`;
}
