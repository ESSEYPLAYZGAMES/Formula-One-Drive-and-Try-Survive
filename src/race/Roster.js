// 2026 grid (11 teams / 22 cars) with tiered performance brackets. The spread between
// the best and worst car+driver combination is ~1.2 s/lap; a custom 23rd entry can be added.
export const TIERS = ['Top Tier', 'Upper Midfield', 'Lower Midfield', 'Backmarker'];
// car performance index by tier (power/aero scale). Rating = driver skill (cornering commitment, error rate).
const TIER_PERF = [1.0, 0.995, 0.990, 0.985];

// color = primary livery, color2 = accent (engine cover / wing flaps / stripes), helmet = driver helmet colour
const T = (team, color, color2, tier, drivers) => drivers.map(([name, short, rating, number, helmet]) => ({ name, short, team, color, color2, helmet, tier, perf: TIER_PERF[tier], rating, number }));

export const ROSTER = [
  ...T('McLaren', '#ff8000', '#1b1b1f', 0, [['Lando Norris', 'NOR', 0.95, 1, '#ffe600'], ['Oscar Piastri', 'PIA', 0.94, 81, '#1e8cff']]),
  ...T('Ferrari', '#e8002d', '#ffe600', 0, [['Charles Leclerc', 'LEC', 0.94, 16, '#ffffff'], ['Lewis Hamilton', 'HAM', 0.93, 44, '#ffd400']]),
  ...T('Red Bull Racing', '#1e3a8a', '#ffc400', 0, [['Max Verstappen', 'VER', 0.97, 3, '#ff6a00'], ['Isack Hadjar', 'HAD', 0.86, 6, '#cfe8ff']]),
  ...T('Mercedes', '#0b0f14', '#27f4d2', 0, [['George Russell', 'RUS', 0.93, 63, '#2b6bff'], ['Kimi Antonelli', 'ANT', 0.89, 12, '#ffffff']]),
  ...T('Aston Martin', '#00665e', '#c5ff3b', 1, [['Fernando Alonso', 'ALO', 0.92, 14, '#0b6cff'], ['Lance Stroll', 'STR', 0.80, 18, '#ffffff']]),
  ...T('Williams', '#0a2aa8', '#64c4ff', 1, [['Alexander Albon', 'ALB', 0.87, 23, '#ffffff'], ['Carlos Sainz', 'SAI', 0.90, 55, '#ff3b3b']]),
  ...T('Racing Bulls', '#e8eef7', '#2b4dff', 2, [['Liam Lawson', 'LAW', 0.84, 30, '#111111'], ['Arvid Lindblad', 'LIN', 0.80, 41, '#ffcc00']]),
  ...T('Haas', '#b6babd', '#e10600', 2, [['Esteban Ocon', 'OCO', 0.85, 31, '#1b1b1f'], ['Oliver Bearman', 'BEA', 0.84, 87, '#ffffff']]),
  ...T('Alpine', '#ff5fb0', '#1b3fbf', 3, [['Pierre Gasly', 'GAS', 0.86, 10, '#ffffff'], ['Franco Colapinto', 'COL', 0.80, 43, '#7fd0ff']]),
  ...T('Audi', '#151515', '#d40000', 3, [['Nico Hulkenberg', 'HUL', 0.85, 27, '#ffcc00'], ['Gabriel Bortoleto', 'BOR', 0.83, 5, '#22c55e']]),
  ...T('Cadillac', '#c9a86a', '#0b0f14', 3, [['Valtteri Bottas', 'BOT', 0.85, 77, '#ffffff'], ['Sergio Perez', 'PER', 0.86, 11, '#b1001f']]),
];

export function customDriver({ name, color, tier }) {
  const short = (name || 'YOU').replace(/[^A-Za-z]/g, '').slice(-3).toUpperCase().padEnd(3, 'X');
  return { name: name || 'Custom Driver', short, team: 'Independent', color: color || '#00d4ff', color2: '#ffffff', helmet: '#ffffff', tier: +tier, perf: TIER_PERF[+tier], rating: 0.9, number: 99, custom: true };
}

export const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

/** who steps in when a driver is stood down: the team's reserve first, then the F2 field ([name, short, rating, number, helmet, from]) */
export const RESERVES = {
  McLaren: ["Pato O'Ward", 'OWA', 0.82, 29, '#0b3d91', 'Reserve driver'],
  Ferrari: ['Antonio Giovinazzi', 'GIO', 0.82, 36, '#e8002d', 'Reserve driver'],
  'Red Bull Racing': ['Yuki Tsunoda', 'TSU', 0.86, 22, '#ffffff', 'Reserve driver'],
  Mercedes: ['Frederik Vesti', 'VES', 0.81, 33, '#c8102e', 'Reserve driver'],
  'Aston Martin': ['Felipe Drugovich', 'DRU', 0.81, 34, '#ffd400', 'Reserve driver'],
  Williams: ['Luke Browning', 'BRW', 0.79, 37, '#ffffff', 'F2'],
  'Racing Bulls': ['Ayumu Iwasa', 'IWA', 0.81, 40, '#ffffff', 'Reserve driver'],
  Haas: ['Ryo Hirakawa', 'HIR', 0.8, 38, '#ff2a2a', 'Reserve driver'],
  Alpine: ['Kush Maini', 'MAI', 0.78, 46, '#ff9933', 'Reserve driver'],
  Audi: ['Paul Aron', 'ARO', 0.8, 61, '#ffffff', 'Reserve driver'],
  Cadillac: ['Zhou Guanyu', 'ZHO', 0.82, 24, '#e10600', 'Reserve driver'],
};
export const F2 = [['Leonardo Fornaroli', 'FOR', 0.79, 70, '#00a3e0'], ['Richard Verschoor', 'VSC', 0.79, 62, '#ff7a00'], ['Jak Crawford', 'CRA', 0.79, 50, '#1e3a8a'],
  ['Dino Beganovic', 'BEG', 0.78, 45, '#ffd400'], ['Victor Martins', 'MRT', 0.78, 26, '#ffffff'], ['Joshua Durksen', 'DUR', 0.77, 39, '#d40000']];
/** a stand-in for a team, not one already taken: { name, short, rating, number, helmet, from } */
export function standIn(team, taken = new Set()) {
  const r = RESERVES[team], pick = (e, from) => ({ name: e[0], short: e[1], rating: e[2], number: e[3], helmet: e[4], from });
  if (r && !taken.has(r[0])) return pick(r, r[5]);
  const f = F2.find((e) => !taken.has(e[0])) || F2[0];
  return pick(f, 'F2');
}
