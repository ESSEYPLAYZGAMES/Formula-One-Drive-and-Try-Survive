// The team principal's operations (career/Manager.js): the car's parts, the team's facilities and its sponors.
//
// PARTS. The power unit and gearbox as the rules ration them: every driver has a season's allocation of each element
// (the ICE, the turbocharger, the MGU-K, the energy store, the gearbox) - one more than a fifth of the season's rounds,
// two at least, as twenty-four rounds have four. Every weekend wears the fitted unit (a push mixture the ICE more); a
// worn unit loses a little power and fails more often; a new one fitted is a new one of the allocation, and the first
// beyond it costs ten places on the grid, every one after five. The AI teams fit new units the same way, and take their
// penalties. The car's spares - front wings, rear wings, floors, suspension - are made in the factory, a few a round,
// paid for under the cost cap; damage and crashes use them up, and a car without the spare it needs races on the damaged
// part (a little slower) until the factory has made one.
//
// FACILITIES. Four the team principal builds and keeps up (the wind tunnel, CFD and the rest that develop the car are
// in the tech tree): the factory (how many spares a round, and how cheaply), hospitality (what sponsors pay), the driver
// in the loop simulator (how much a practice run tells the engineers - ui/Setup.js), the pit crew training centre (the
// stop's length). Each has a level (an upgrade takes rounds to build, and costs more each level) and a condition that
// falls every round it is used: its effect runs at half to full with the condition, and maintenance restores it.
//
// SPONSORS. A title sponsor and two partners, each a contract: a fee every race, a signing bonus, a target for every
// race weekend (a place, both cars in the top n) with its bonus, a season target (the constructors' order), and its
// seasons. Offers come by the team's marketability - its place, its hospitality, its drivers. The terms are negotiated:
// ask for more of the fee or the bonus, or more seasons, and the sponsor's willingness falls (shown as it would be said);
// twice turned down and it walks away.
import { techEffects } from './TechTree.js';

const r1 = (x) => Math.round(x * 10) / 10;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pick = (a) => a[Math.floor(Math.random() * a.length)];

// ---- parts ---------------------------------------------------------------------------------------------------------------
export const PU = { ice: { name: 'Internal combustion engine', short: 'ICE', wear: 0.22 }, tc: { name: 'Turbocharger', short: 'TC', wear: 0.23 }, mguk: { name: 'MGU-K', short: 'MGU-K', wear: 0.24 }, es: { name: 'Energy store', short: 'ES', wear: 0.17 }, gb: { name: 'Gearbox', short: 'GB', wear: 0.2 } };
export const SPARES = { fw: { name: 'Front wing', cost: 0.6, perf: 0.0025 }, rw: { name: 'Rear wing', cost: 0.5, perf: 0.002 }, floor: { name: 'Floor', cost: 1.2, perf: 0.003 }, susp: { name: 'Suspension', cost: 0.8, perf: 0.002 } };
/** a driver's season allocation of an element */
export const allocOf = (c, el) => Math.max(2, Math.ceil(c.rounds / (el === 'es' ? 8 : 4)));
function newPU() { return Object.fromEntries(Object.keys(PU).map((k) => [k, { used: 1, wear: 0 }])); }

/** every team's parts state, made once (an old save brought up to date) */
export function opsEnsure(c) {
  for (const t of Object.values(c.teams)) {
    if (!t.pu) t.pu = {};
    for (const did of t.seats) if (!t.pu[did]) t.pu[did] = newPU();
    if (!t.spares) t.spares = { fw: 4, rw: 3, floor: 2, susp: 2 };
    if (!t.short) t.short = {};
    if (!t.making) t.making = [];
  }
  if (!c.fac) c.fac = Object.fromEntries(Object.keys(FAC).map((k) => [k, { level: FAC[k].start(c.team.tier), cond: 1, building: null }]));
  if (!c.sponsors) {
    // (a team never starts bare: its title sponsor and a partner on their standard terms - the third slot is yours to fill)
    c.sponsors = { title: null, p1: null, p2: null }; c.spOffers = makeOffers(c);
    for (const slot of ['title', 'p1']) { const o = c.spOffers.find((x) => x.slot === slot); if (o) sign(c, o, { base: 1, bonus: 1, years: o.years }, false); }
  }
  if (!c.penalties) c.penalties = {};
}
/** a car's worst-worn element and its effect: { relMul, perfMul } */
export function puEffect(c, team, did) {
  const p = c.teams[team]?.pu?.[did]; if (!p) return { relMul: 1, perfMul: 1 };
  let rel = 1, perf = 1;
  for (const k in PU) { const w = p[k]?.wear || 0; if (w > 0.6) rel *= 1 + (w - 0.6) * 3.5; if (k === 'ice' && w > 0.75) perf *= 1 - (w - 0.75) * 0.012; }
  return { relMul: rel, perfMul: perf };
}
/** what the car's spares situation costs it: a car racing a damaged part (none in stock when it was needed) */
export function sparesPerf(c, team) { const s = c.teams[team]?.short || {}; let p = 1; for (const k in s) if (s[k] > 0) p *= 1 - (SPARES[k]?.perf || 0); return p; }
/** fit a new unit of an element for a driver: from the allocation, or beyond it with a grid penalty -> text */
export function fitNew(c, team, did, el, auto = false) {
  const t = c.teams[team], p = t?.pu?.[did]; if (!p || !PU[el]) return 'No such unit.';
  p[el].used++; p[el].wear = 0;
  const over = p[el].used - allocOf(c, el);
  let pen = 0;
  if (over > 0) { const prior = Object.keys(PU).some((k) => k !== el && p[k].used > allocOf(c, k)) || over > 1; pen = prior ? 5 : 10; c.penalties[did] = (c.penalties[did] || 0) + pen; }
  const d = c.drivers[did];
  if (team === c.myTeam || pen) c.addNews(`${d?.name || did} takes a new ${PU[el].name.toLowerCase()} (${p[el].used} of ${allocOf(c, el)} this season)${pen ? `: ${pen}-place grid penalty` : ''}.`);
  return auto ? null : `New ${PU[el].name} for ${d?.name}: ${p[el].used} of ${allocOf(c, el)} this season${pen ? ` - a ${pen}-place grid penalty next race` : ''}.`;
}
/** order a spare: paid now (under the cost cap), ready after the next round (the factory's level: how many a round) */
export function orderSpare(c, part) {
  const t = c.team, S = SPARES[part]; if (!S) return 'No such part.';
  const cost = r1(S.cost * facFx(c, 'factory').costMul);
  const cap = c.capCheck?.(cost); if (cap) return cap;
  if (t.budget < cost) return `Not enough money: ${S.name} costs $${cost}M.`;
  const perRound = facFx(c, 'factory').perRound, queued = t.making.filter((x) => x.left === 1).length;
  t.budget = r1(t.budget - cost); t.devSpend = t.devSpend || { all: 0, fac: 0 }; t.devSpend.all = r1((+t.devSpend.all || 0) + cost);
  t.making.push({ part, left: queued >= perRound ? 2 : 1 });
  return `${S.name} ordered: $${cost}M, ready ${queued >= perRound ? 'in two rounds (the factory is full this round)' : 'after the next round'}.`;
}
/**
 * The weekend's wear and damage into the parts (after applyRace's results): rows [{ car: { careerId, team, retired,
 * retireReason, dmg? } }], push: { did: true } a car that ran a push mixture. AI teams fit new units at 85 % worn.
 */
export function partsAfterRace(c, rows, push = {}) {
  opsEnsure(c);
  const used = [];
  for (const r of rows) {
    const t = c.teams[r.car.team], did = r.car.careerId, p = t?.pu?.[did]; if (!p) continue;
    for (const k in PU) p[k].wear = Math.min(1, p[k].wear + PU[k].wear * (0.85 + Math.random() * 0.3) * (k === 'ice' && push[did] ? 1.15 : 1));
    // damage: what the car brought home broken (a crash: the lot)
    const dm = r.car.dmg || {}, crash = r.car.retired && /accident/i.test(r.car.retireReason || '');
    const need = { fw: crash || (dm.fwL || 0) + (dm.fwR || 0) > 0.3 ? 1 : 0, rw: crash || (dm.rw || 0) > 0.25 ? 1 : 0, floor: crash || (dm.body || 0) > 0.4 ? 1 : 0, susp: crash || (dm.susp || 0) > 0.3 ? 1 : 0 };
    if (t.name !== c.myTeam) continue;   // (the AI teams' spares: as many as they need)
    for (const k in need) {
      if (!need[k]) continue;
      if (t.spares[k] > 0) { t.spares[k]--; used.push(SPARES[k].name); } else { t.short[k] = (t.short[k] || 0) + 1; c.addNews(`No ${SPARES[k].name.toLowerCase()} in stock: ${c.drivers[did]?.name} races a damaged one until the factory has made one.`); }
    }
  }
  // the AI teams: a new unit for an element nearly worn through (and its penalty)
  for (const t of Object.values(c.teams)) {
    if (t.name === c.myTeam) continue;
    for (const did of t.seats) { const p = t.pu[did]; if (!p) continue; for (const k in PU) if (p[k].wear > 0.85) fitNew(c, t.name, did, k, true); }
  }
  // the factory's work: spares made this round go first to a car racing without one
  const t = c.team;
  for (const x of t.making) x.left--;
  for (const x of t.making.filter((y) => y.left <= 0)) { if (t.short[x.part] > 0) t.short[x.part]--; else t.spares[x.part]++; }
  t.making = t.making.filter((y) => y.left > 0);
  return used;
}
/** the grid penalties for the next race, by driver name -> Map(name, places); cleared when served */
export function takePenalties(c) {
  const out = new Map(); for (const [did, n] of Object.entries(c.penalties || {})) if (n > 0 && c.drivers[did]) out.set(c.drivers[did].name, n);
  c.penalties = {}; return out;
}
/** a new season: the new season's power units, fresh, and every allocation starting again; no penalty carried over */
export function partsNewSeason(c) {
  opsEnsure(c); c.penalties = {};
  for (const t of Object.values(c.teams)) {
    for (const did of t.seats) { if (!t.pu[did]) t.pu[did] = newPU(); for (const k in PU) { t.pu[did][k].used = 1; t.pu[did][k].wear = 0; } }
    for (const did of Object.keys(t.pu)) if (!t.seats.includes(did)) delete t.pu[did];
  }
}

// ---- facilities ----------------------------------------------------------------------------------------------------------
export const FAC = {
  factory: { name: 'Factory', what: 'Makes the car\'s spares: how many a round, and what each costs.', start: (tier) => 3 - Math.min(2, tier), fx: (L) => ({ perRound: 1 + Math.floor(L / 2), costMul: 1.15 - 0.07 * L }) },
  hosp: { name: 'Hospitality', what: 'Where the sponsors are entertained: what they offer and pay.', start: (tier) => 3 - Math.min(2, tier), fx: (L) => ({ sponsorMul: 0.88 + 0.06 * L }) },
  dil: { name: 'Driver-in-the-loop simulator', what: 'The practice runs\' value: how quickly the engineers find the set-up.', start: (tier) => 2 - Math.min(1, tier >> 1), fx: (L) => ({ setupK: 0.7 + 0.12 * L }) },
  pitc: { name: 'Pit crew training centre', what: 'The stop\'s length.', start: (tier) => 2 - Math.min(1, tier >> 1), fx: (L) => ({ pitMul: 1.04 - 0.02 * L }) },
};
export const FAC_MAX = 5;
/** an upgrade's price ($M) and build (rounds) to level L */
export const facCost = (k, L) => r1((k === 'hosp' ? 2.5 : 3) * L * 1.35);
export const facRounds = (L) => 1 + Math.ceil(L / 2);
/** a facility's effect now: its level's, at half to full with its condition (a facility being upgraded: at its old level, 80 %) */
export function facFx(c, k) {
  const f = c.fac?.[k] || { level: 2, cond: 1 }, F = FAC[k], base = F.fx(f.level), flat = F.fx(0), w = (0.5 + 0.5 * f.cond) * (f.building ? 0.8 : 1);
  const out = {}; for (const key in base) out[key] = key === 'perRound' ? Math.max(1, Math.round(base[key] * w)) : flat[key] + (base[key] - flat[key]) * w;
  return out;
}
export function facUpgrade(c, k) {
  const f = c.fac[k], t = c.team; if (!f) return 'No such facility.';
  if (f.building) return `${FAC[k].name} is already being upgraded.`;
  if (f.level >= FAC_MAX) return `${FAC[k].name} is at its highest level.`;
  const cost = facCost(k, f.level + 1); if (t.budget < cost) return `Not enough money: the upgrade costs $${cost}M.`;
  t.budget = r1(t.budget - cost); f.building = { to: f.level + 1, left: facRounds(f.level + 1) };
  c.addNews(`Work starts on the ${FAC[k].name.toLowerCase()}: level ${f.level + 1}, ready in ${f.building.left} rounds ($${cost}M).`);
  return `${FAC[k].name}: level ${f.level + 1} in ${f.building.left} rounds, $${cost}M (capital spending: outside the cost cap).`;
}
export const maintCost = (c, k) => { const f = c.fac[k]; return r1((1 - f.cond) * (1 + f.level * 0.7)); };
export function facMaintain(c, k) {
  const f = c.fac[k], t = c.team, cost = maintCost(c, k); if (f.cond > 0.995) return `${FAC[k].name} is in full working order.`;
  if (t.budget < cost) return `Not enough money: the maintenance costs $${cost}M.`;
  t.budget = r1(t.budget - cost); f.cond = 1; return `${FAC[k].name} maintained: $${cost}M, back to 100%.`;
}
/** a round's wear and building on the facilities */
export function facRound(c) {
  for (const k in c.fac) {
    const f = c.fac[k]; f.cond = clamp(f.cond - (0.03 + 0.01 * f.level) * (0.8 + Math.random() * 0.4), 0, 1);
    if (f.building && --f.building.left <= 0) { f.level = f.building.to; f.building = null; f.cond = 1; c.addNews(`The ${FAC[k].name.toLowerCase()} is upgraded to level ${f.level}.`); }
  }
}

// ---- sponsors ------------------------------------------------------------------------------------------------------------
const BRANDS = ['Vanta Energy', 'Orbitel', 'Kestrel Watches', 'NovaPay', 'Helix Cloud', 'Sable Spirits', 'Quanta Logistics', 'Arcadia Air', 'Brightline Bank', 'Corvid Security', 'Tidal Beverages', 'Meridian Tyres', 'Polaris Telecom', 'Juniper Software', 'Granite Insurance', 'Lumen Lighting', 'Sierra Motors', 'Atlas Freight', 'Ember Gaming', 'Harbor Crypto'];
const SLOTS = { title: { name: 'Title sponsor', mul: 1 }, p1: { name: 'Partner', mul: 0.35 }, p2: { name: 'Partner', mul: 0.3 } };
export const SPONSOR_SLOTS = SLOTS;
/** the team's appeal to sponsors: 0.5 (a backmarker nobody watches) .. 1.6 (the champions) */
export function marketability(c) {
  const n = Object.keys(c.teams).length, pos = c.boardPos ? c.boardPos(c.myTeam) : 6, D = c.seatsOf(c.myTeam);
  const drv = D.length ? D.reduce((s, d) => s + d.rating, 0) / D.length : 0.85;
  return clamp((0.55 + 0.9 * (1 - (pos - 1) / Math.max(1, n - 1)) + (drv - 0.85) * 3) * facFx(c, 'hosp').sponsorMul, 0.45, 1.7);
}
/** the offers for the empty slots (three a slot, by marketability) */
export function makeOffers(c) {
  const m = marketability(c), out = [];
  for (const slot of Object.keys(SLOTS)) {
    if (c.sponsors?.[slot]) continue;
    for (let i = 0; i < 3; i++) {
      const base = r1((0.9 + Math.random() * 0.8) * m * SLOTS[slot].mul * 1.0), years = 1 + Math.floor(Math.random() * 3);
      const kind = Math.random() < 0.55 ? 'best' : 'both';
      out.push({ id: `${slot}-${Date.now().toString(36)}-${i}`, slot, brand: pick(BRANDS.filter((b) => !out.some((o) => o.brand === b) && !Object.values(c.sponsors || {}).some((s) => s?.brand === b))), base, sign: r1(base * (1 + Math.random() * 2)), bonus: r1(base * (0.35 + Math.random() * 0.4)), kind, years, seasonBonus: r1(base * 2), patience: 2, terms: { base: 1, bonus: 1, years } });
    }
  }
  return out;
}
/** how likely the sponsor is to accept these terms (0..1) and in words */
export function acceptOdds(o, terms) {
  const ask = (terms.base - 1) * 2.4 + (terms.bonus - 1) * 1.2 + Math.max(0, terms.years - o.years) * 0.08 - Math.max(0, o.years - terms.years) * 0.05;
  const p = clamp(0.92 - ask, 0.03, 0.97);
  return { p, word: p > 0.8 ? 'Very likely' : p > 0.6 ? 'Likely' : p > 0.4 ? 'Even' : p > 0.2 ? 'Unlikely' : 'Very unlikely' };
}
/** propose terms to an offer -> text (signed, refused - and walked away) */
export function propose(c, oid, terms) {
  const o = c.spOffers.find((x) => x.id === oid); if (!o) return 'That offer is gone.';
  if (c.sponsors[o.slot]) return `The ${SLOTS[o.slot].name.toLowerCase()} slot is taken.`;
  const { p } = acceptOdds(o, terms);
  if (Math.random() < p) { const s = sign(c, o, terms, true); return `${o.brand} signs: $${s.base}M a race, $${r1(o.sign * terms.base)}M on signing, to the end of ${s.until}.`; }
  o.patience--; if (o.patience <= 0) { c.spOffers = c.spOffers.filter((x) => x !== o); return `${o.brand} turns the terms down - and walks away.`; }
  return `${o.brand} turns the terms down. They might listen once more.`;
}
/** an offer signed on these terms (paid its signing bonus when `paid`) -> the contract */
function sign(c, o, terms, paid) {
  const s = { brand: o.brand, slot: o.slot, base: r1(o.base * terms.base), bonus: r1(o.bonus * terms.bonus), kind: o.kind, seasonBonus: o.seasonBonus, until: c.season + terms.years - 1, since: c.season };
  c.sponsors[o.slot] = s; if (paid) c.team.budget = r1(c.team.budget + o.sign * terms.base);
  c.spOffers = c.spOffers.filter((x) => x.slot !== o.slot);
  c.addNews(`${o.brand} ${paid ? 'signs' : 'is'} ${c.myTeam}'s ${SLOTS[o.slot].name.toLowerCase()} to the end of ${s.until}: $${s.base}M a race${paid ? `, $${r1(o.sign * terms.base)}M on signing` : ''}.`);
  return s;
}
/** a race's sponsor money: the fees, the race target's bonus (the title sponsor's and the partners') -> { fees, bonus, met: [brand] } */
export function sponsorRace(c, mine) {
  const P = mine.filter((m) => !m.dnf).map((m) => m.pos), best = P.length ? Math.min(...P) : 99, exp = c.expectedPos?.() ?? 10, expB = c.expectedPos?.(true) ?? exp;
  let fees = 0, bonus = 0; const met = [];
  for (const s of Object.values(c.sponsors || {})) {
    if (!s) continue; fees += s.base;
    const target = s.kind === 'best' ? Math.max(1, Math.round(expB)) : Math.min(10, Math.round(exp + 2));   // (a car: as high as the better car should finish; both: a little behind where they should)
    const ok = s.kind === 'best' ? best <= target : P.length === 2 && P.every((p) => p <= target);
    s.lastTarget = s.kind === 'best' ? `a car in the top ${target}` : `both cars in the top ${target}`;
    if (ok) { bonus += s.bonus; met.push(s.brand); }
  }
  return { fees: r1(fees), bonus: r1(bonus), met };
}
/** each sponsor's target for the coming weekend -> [{ brand, slot, text, bonus }] */
export function sponsorTargets(c) {
  const exp = c.expectedPos?.() ?? 10, expB = c.expectedPos?.(true) ?? exp;
  return Object.values(c.sponsors || {}).filter(Boolean).map((s) => ({ brand: s.brand, slot: s.slot, bonus: s.bonus,
    text: s.kind === 'best' ? `a car in the top ${Math.max(1, Math.round(expB))}` : `both cars in the top ${Math.min(10, Math.round(exp + 2))}` }));
}
/** the season's end: the season targets (constructors' place within two of the board's), contracts run out, new offers */
export function sponsorsSeasonEnd(c, pos) {
  let paid = 0;
  for (const [slot, s] of Object.entries(c.sponsors || {})) {
    if (!s) continue;
    if (pos <= (c.board?.target || 10) + 1) { paid += s.seasonBonus; }
    if (s.until <= c.season) { c.addNews(`${s.brand}'s contract with ${c.myTeam} ends.`); c.sponsors[slot] = null; }
  }
  c.team.budget = r1(c.team.budget + paid);
  c.spOffers = makeOffers(c);
  return paid;
}
