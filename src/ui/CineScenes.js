// The cutscenes (ui/Cine.js plays them, ui/CineSets.js is where they are shot). Each is a function of what really
// happened - ctx, plain data from the career (career/ManagerStory.js makes it) - and returns a scene: its title card, its
// set, its shots, its lines. Nothing here reads or changes the career: what you answer or do in a scene comes back from
// playCine ({ choice, picks, qte }) and the story applies it.
// ctx everywhere: { T: { name, color, color2, livery }, season, round, track, drivers: [{ name, short, number, helmet }] }.
// The set pieces are here; the drama's scenes are in CineScenes2.js.
import * as SETS from './CineSets.js';
import { paintTable, paintHeadline, paintIncident } from './CineSets.js';
import { baseLook } from '../world/People.js';

const PI = Math.PI;
export const surname = (n) => String(n || '').trim().split(/\s+/).pop() || '';
/** people's options (world/People.js): a driver in the team's race suit, staff in its polo, someone in a jacket */
export const drv = (d, T, pose = 'talk', ex = {}) => ({ pose, kit: 'suit', color: T.color, accent: T.color2 || '#ffffff', cap: true, driver: d.name, teamName: T.name, ...ex });
/** the same face each time for a name (People draws skin and hair at random unless told) */
const look = (id) => { const B = baseLook(id); return { seed: id, skin: B.skin, hair: B.hair, style: B.style }; };
export const staff = (name, T, pose = 'talk', ex = {}) => ({ pose, kit: 'polo', color: T.color, accent: T.color2 || '#ffffff', teamName: T.name, ...look(`staff|${name}`), build: 'average', ...ex });
export const suit = (name, pose = 'talk', ex = {}) => ({ pose, kit: 'jacket', color: '#1c2333', accent: '#e9e9ec', legs: '#1a1c22', ...look(`suit|${name}`), build: 'average', ...ex });
/** a line: who says it, what, their colour */
export const say = (who, text, c = null) => ({ who, text, c });
/** something animated from now for `dur` seconds: fn(u 0..1) */
export const tween = (k, dur, fn) => { const t0 = k.t; let done = false; k.each((t) => { if (done) return; const u = Math.min(1, (t - t0) / dur); fn(u); if (u >= 1) done = true; }); };
const ord = (n) => `${n}${['th', 'st', 'nd', 'rd'][n % 100 > 10 && n % 100 < 14 ? 0 : Math.min(4, n % 10) % 4] || 'th'}`;
export const P = (n) => `P${n}`;
const T0 = { name: 'Team', color: '#e10600', color2: '#ffffff' };
const D0 = [{ name: 'Driver One', short: 'ONE', number: 1 }, { name: 'Driver Two', short: 'TWO', number: 2 }];
const base = (ctx) => ({ T: ctx.T || T0, D: ctx.drivers && ctx.drivers.length ? ctx.drivers : D0 });

/**
 * 1. The car launch (the season's first scene): the hall, the car under its cover, the cover pulled (yours to pull: a
 * hold), the car turned under the lights, the partners named on the wall, the drivers beside it, what the room
 * expects. ctx: { sponsors: [names], last: { pos, target } | null, target, fans (0..100), lines: { d1, d2, press } }
 */
export function launch(ctx) {
  const { T, D } = base(ctx);
  return { id: 'launch', fill: 0.35, kicker: `${T.name} · Season ${ctx.season || ''}`, title: 'The new car', sub: 'Launch night', accent: T.color, bg: '#040508', fog: [18, 46], exposure: 1.05, needsCar: true, sound: { name: 'crowd', gain: 0.18 },
    build(k) {
      k.env(0.9, 0.3);
      const sponsors = (ctx.sponsors || []).slice(0, 4);
      const wallA = (x, W, H) => { x.fillStyle = '#030305'; x.fillRect(0, 0, W, H); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = T.color; x.font = `900 ${H * 0.34}px ${k.FONT}`; x.fillText(String(ctx.season || ''), W / 2, H * 0.42); x.fillStyle = '#ffffff'; x.font = `300 ${H * 0.09}px ${k.FONT}`; x.fillText('S E A S O N   L A U N C H', W / 2, H * 0.74); };
      const wallB = (x, W, H) => { const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#050506'); g.addColorStop(0.5, T.color); g.addColorStop(1, '#050506'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 0, W, H); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#ffffff'; x.font = `900 ${H * 0.26}px ${k.FONT}`; x.fillText(T.name.toUpperCase(), W / 2, H * 0.36); x.font = `600 ${H * 0.075}px ${k.FONT}`; x.fillStyle = 'rgba(255,255,255,.85)'; x.fillText(sponsors.length ? sponsors.map((s) => String(s).toUpperCase()).join('   ·   ') : `SEASON ${ctx.season || ''}`, W / 2, H * 0.72); };
      const A = SETS.stage(k, T, { wall: wallA, guests: 0.45 + 0.5 * Math.min(1, (ctx.fans ?? 60) / 100) });
      const car = k.car({ color: T.color, color2: T.color2, team: T.name, livery: T.livery, number: D[0].number, driver: D[0].name, helmet: D[0].helmet }, A.car, 0.55);
      // the cover: silk over the car, drawn back off its nose
      const cg = k.own(new k.THREE.SphereGeometry(1, 40, 20)); cg.scale(3.0, 0.74, 1.28); const pos = cg.attributes.position; for (let i = 0; i < pos.count; i++) { if (pos.getY(i) < -0.1) pos.setY(i, -0.1 - (pos.getY(i) + 0.1) * 0.15); pos.setY(i, pos.getY(i) + Math.sin(pos.getX(i) * 3.1) * 0.03 + Math.sin(pos.getZ(i) * 5.3) * 0.03); } cg.computeVertexNormals();
      const cover = new k.THREE.Mesh(cg, k.m('#0b0c10', 0.28, 0.1, { side: k.THREE.DoubleSide })); cover.castShadow = true; const hold = new k.THREE.Group(); hold.position.set(A.car[0], A.car[1] + 0.55, A.car[2]); hold.rotation.y = 0.55 - PI / 2; hold.add(cover); k.S.add(hold);
      let pulled = 0; const pull = (p) => { pulled = Math.max(pulled, p); cover.position.x = -pulled * 4.6; cover.scale.set(1 - pulled * 0.35, 1 - pulled * 0.75, 1); cover.rotation.z = pulled * 0.25; cover.visible = pulled < 0.995; };
      const d1 = k.person(drv(D[0], T, 'reach'), [-2.6, 0.5, 0.6], 0.9), d2 = k.person(drv(D[1] || D[0], T, 'reach'), [2.7, 0.5, -0.2], -1.4);
      const e1 = k.person(drv(D[0], T, 'cross'), [-2.2, 0.5, 0.9], 0.25), e2 = k.person(drv(D[1] || D[0], T, 'hips'), [2.3, 0.5, 0.7], -0.3); e1.g.visible = e2.g.visible = false;
      const lights = (u) => { A.key.intensity = 150 * u; A.rimL.intensity = 200 * u; A.rimR.intensity = 150 * u; fill.intensity = 0.5 * u; };
      const fill = k.light.hemi(0xfff4e6, 0x30262a, 0); A.rimL.intensity = 60; A.rimR.intensity = 40;
      const L = ctx.lines || {}, tgt = ctx.target ? P(ctx.target) : 'more';
      const shots = [
        { d: 5, p: [0, 7.5, 16], l: [0, 2.6, -3], p2: [0, 3.2, 11.5], l2: [0, 1.6, -1], f: 34, e: 'io', shake: 0.05, dof: 0.4, sub: say('Announcer', `Ladies and gentlemen, welcome to the launch of ${T.name}'s ${ctx.season || 'new'} season.`) },
        { d: 4.2, p: [-3.4, 0.95, 2.6], l: [0, 1.0, -1], p2: [-1.2, 0.9, 3.4], l2: [0.3, 1.05, -1], f: 26, e: 'soft', shake: 0.1, cut: 'dip', sub: ctx.last ? say('Announcer', `Last year: ${ord(ctx.last.pos)} in the constructors'. This year the board has asked for ${tgt}.`) : say('Announcer', `A new season. The board has asked for ${tgt} in the constructors'.`) },
        { d: 3, p: [3.6, 1.7, 3.8], l: [0, 1.1, -0.8], p2: [3.1, 1.6, 3.4], f: 30, shake: 0.2, sub: say('Announcer', 'The moment is yours.'),
          qte: { id: 'cover', kind: 'hold', prompt: 'Hold: pull the cover', from: 0.5, len: 3.4, need: 1.5, after: 0.5, words: { good: 'REVEALED', ok: 'REVEALED', miss: '' }, onProgress: (p) => pull(p * 0.9), onDone: (g, kk) => { const p0 = pulled; tween(kk, 0.7, (u) => pull(p0 + (1 - p0) * u)); tween(kk, 1.2, lights); A.wall.redraw(wallB); } } },
        { d: 5.5, p: [-4.4, 1.0, 1.4], l: [0, 1.05, -1], p2: [3.8, 1.3, 1.7], l2: [0, 1.0, -1], arc: [0, 0.15, 1.2], f: 30, e: 'io', shake: 0.06, on: () => { pull(1); lights(1); A.wall.redraw(wallB); d1.g.visible = d2.g.visible = false; }, sub: say('Announcer', `The ${ctx.season || ''} ${T.name}.`), sfx: (a) => a.play?.('crowd', { gain: 0.5 }) },
        { d: 4.5, p: [1.2, 0.62, 1.9], l: [-0.6, 0.95, -0.9], p2: [-1.9, 0.7, 1.5], l2: [0.4, 0.95, -1.2], f: 20, e: 'lin', shake: 0.04, sub: sponsors.length ? say('Announcer', `Carrying ${sponsors.length === 1 ? sponsors[0] : `${sponsors.slice(0, -1).join(', ')} and ${sponsors[sponsors.length - 1]}`} into the new season.`) : say('Announcer', 'No title partner on the engine cover yet. The commercial team has work to do.') },
        { d: 4, p: [-0.4, 1.95, 4.6], l: [-2.2, 2.05, 0.9], p2: [-0.8, 1.95, 4.2], f: 16, shake: 0.14, on: () => { e1.g.visible = e2.g.visible = true; e1.look = k.cam.position; }, low: { name: D[0].name, role: `${T.name} · No. ${D[0].number ?? ''}` }, sub: say(surname(D[0].name), L.d1 || 'It looks fast. We find out in a fortnight whether it is.') },
        D[1] && { d: 4, p: [0.6, 1.95, 4.5], l: [2.3, 2.05, 0.7], p2: [0.9, 1.95, 4.1], f: 16, shake: 0.14, on: () => { e2.look = k.cam.position; }, low: { name: D[1].name, role: `${T.name} · No. ${D[1].number ?? ''}` }, sub: say(surname(D[1].name), L.d2 || 'I am here to win races. The car has to let me.') },
        { d: 4, p: [0.8, 1.75, 9.2], l: [0, 1.5, 0], p2: [-0.6, 1.8, 8.6], f: 24, shake: 0.25, focus: [0.4, 1.7, 6.6], focus2: [0, 1.2, -1], sub: say('In the room', L.press || `"If that thing is quick, ${T.name} are back in it."`, '#cfd6e4') },
        { d: 5, p: [0, 2.4, 3.2], l: [0, 0.9, -1], p2: [0, 9.5, 0.6], l2: [0, 0.6, -1.0], f: 30, e: 'io', shake: 0.03, dof: 0.3 },
      ];
      return { shots };
    } };
}


// ---- the camera's grammar: framings worked out from where the actors stand ---------------------------------------------
/** an actor's head (a.hY: its height above their feet - lower seated) */
export const hd = (a) => [a.g.position.x, a.g.position.y + (a.hY ?? 1.62), a.g.position.z];
/** a close-up: `dist` from the head, `ang` round from straight ahead of them (+ to their left), a long lens */
export const cu = (a, o = {}) => { const h = hd(a), yaw = a.yaw + (o.ang ?? 0.35), d = o.dist ?? 2.3; return { p: [h[0] + Math.sin(yaw) * d, h[1] + (o.up ?? 0.03), h[2] + Math.cos(yaw) * d], l: [h[0], h[1] - (o.drop ?? 0.06), h[2]], f: o.f ?? 16 }; };
/** over a's shoulder at b: a's shoulder soft in the foreground, b sharp */
export const ots = (a, b, o = {}) => { const A = hd(a), B = hd(b), dx = B[0] - A[0], dz = B[2] - A[2], L = Math.hypot(dx, dz) || 1, ux = dx / L, uz = dz / L, s = o.side ?? 1, back = o.back ?? 0.95; return { p: [A[0] - ux * back - uz * 0.42 * s, A[1] + (o.up ?? 0.1), A[2] - uz * back + ux * 0.42 * s], l: [B[0], B[1] - 0.05, B[2]], f: o.f ?? 22, focus: B }; };
/** the two of them in one frame, from the side (s: which) */
export const two = (a, b, o = {}) => { const A = hd(a), B = hd(b), mx = (A[0] + B[0]) / 2, mz = (A[2] + B[2]) / 2, dx = B[0] - A[0], dz = B[2] - A[2], L = Math.hypot(dx, dz) || 1, s = o.side ?? 1, d = o.dist ?? Math.max(3.2, L * 2.2); return { p: [mx - dz / L * d * s + (o.slide ?? 0) * dx / L, (A[1] + B[1]) / 2 + (o.up ?? -0.1), mz + dx / L * d * s + (o.slide ?? 0) * dz / L], l: [mx, (A[1] + B[1]) / 2 - 0.1, mz], f: o.f ?? 26 }; };
/** a framing moved a little for a shot's end: a creep toward what it looks at (k: how far), a slide sideways */
export const creep = (sh, kq = 0.12, side = 0) => { const dx = sh.l[0] - sh.p[0], dy = sh.l[1] - sh.p[1], dz = sh.l[2] - sh.p[2], L = Math.hypot(dx, dz) || 1; return { ...sh, p2: [sh.p[0] + dx * kq - dz / L * side, sh.p[1] + dy * kq, sh.p[2] + dz * kq + dx / L * side] }; };
/** you: the team principal, in the team's colours - seen from behind, over a shoulder, never named */
export const youOpts = (T, pose = 'talk') => ({ pose, kit: 'polo', color: T.color, accent: T.color2 || '#ffffff', teamName: T.name, ...look('the-principal'), build: 'average' });
export const seated = (a, y = 1.27) => { if (a) a.hY = y; return a; };

// ---- the set pieces ---------------------------------------------------------------------------------------------------
const T1 = { name: 'Team', color: '#e10600', color2: '#ffffff' };
const carOf = (T, d) => ({ color: T.color, color2: T.color2, team: T.name, livery: T.livery, number: d?.number, driver: d?.name, helmet: d?.helmet });

/**
 * 2. The factory, walked through (a facility finished, or asked for from the HQ): down the four halls in turn, what
 * stands in each for its level, the one that changed named. ctx: { lv: { factory, hosp, dil, pitc }, changed, sponsors,
 * td: { name }, lines: { factory, hosp, dil, pitc } }
 */
export function factoryTour(ctx) {
  const { T, D } = base(ctx), lv = ctx.lv || { factory: 3, hosp: 2, dil: 2, pitc: 2 }, L = ctx.lines || {}, td = ctx.td?.name || 'Technical director';
  const NAME = { factory: 'Design & manufacturing', hosp: 'Hospitality', dil: 'The simulator', pitc: 'Pit crew centre' };
  const WHAT = { factory: (n) => `${n} design cells. ${n >= 3 ? 'The mill runs through the night now.' : 'The mill is still a rectangle of tape on the floor.'}`, hosp: (n) => `${n} suite${n === 1 ? '' : 's'} for the partners. This is where the money decides whether it likes us.`, dil: (n) => (n >= 2 ? 'The screen wraps the driver now. Friday starts here on Tuesday.' : 'A tub on six legs. It moves. It does not yet convince anyone.'), pitc: (n) => `${n} gun${n === 1 ? '' : 's'} on the gantry. Every tenth in the pit lane is found in this bay.` };
  return { id: 'factoryTour', kicker: `${T.name} · The factory`, title: ctx.changed ? `${NAME[ctx.changed]}: level ${lv[ctx.changed]}` : 'Where the car is made', accent: T.color, bg: '#14161b', exposure: 1.0, grade: 'neutral', needsCar: true, fill: 0.5,
    build(k) {
      k.env(0.6);
      const A = SETS.factory(k, T, lv, { sponsors: ctx.sponsors });
      for (let i = 0; i < Math.min(2, lv.factory); i++) seated(k.person(staff(`designer${i}`, T, 'sitReach'), [-4 + i * 3.4 - 0.6, 0, -4.5], PI));
      const host = k.person(suit('hospitality host', 'toast', { figure: 'f', build: 'slim' }), [11, 0, -5.4], 0.4), ops = k.person(staff('sim engineer', T, 'cross'), [22.6, 0, 4.1], PI);
      k.car(carOf(T, D[0]), [36, 0, -1.5], PI / 2);
      const crew = [[37.5, -2.55, 0, 'gun'], [37.5, -0.45, PI, 'gun'], [34.4, -2.55, 0, 'gun'], [34.4, -0.45, PI, 'gun'], [39.3, -1.5, -PI / 2, 'jack']].slice(0, 2 + lv.pitc).map(([x, z, f, p]) => k.crew({ color: T.color, accent: T.color2, pose: p, work: 1 }, [x, 0, z], f));
      const tdp = k.person(staff(td, T, 'gesture'), [-7.2, 0, 3.4], PI / 2);
      const bay = (id, i, x0) => ({ d: id === ctx.changed ? 6 : 4.4, p: [x0 - 4.5, 1.65, 6.6], l: [x0 - 1, 1.3, -2], p2: [x0 + 3.5, 1.65, 6.2], l2: [x0 + 0.5, 1.3, -2.5], f: 30, e: 'lin', shake: 0.1, dof: 0.5, low: id === ctx.changed ? { name: `New: ${NAME[id]}`, role: `Level ${lv[id]} of 5` } : { name: NAME[id], role: `Level ${lv[id]} of 5` }, sub: say(td, L[id] || WHAT[id](lv[id])) });
      const shots = [
        { d: 5, p: [-9, 6.8, 6.8], l: [8, 1.5, -1], p2: [-6.5, 2.4, 6.4], l2: [2, 1.4, -3], f: 30, e: 'io', dof: 0.4, sub: say(td, L.open || `You pay for it. You should see it. ${ctx.changed ? `Start with what is new: ${NAME[ctx.changed].toLowerCase()}.` : 'Four halls.'}`) },
        bay('factory', 0, 0), bay('hosp', 1, 12), bay('dil', 2, 24),
        { ...bay('pitc', 3, 36), p: [31, 1.2, 3.8], l: [36, 0.8, -1.5], p2: [40.5, 1.5, 3.2], l2: [36.5, 0.7, -1.5], f: 26 },
        { d: 4.6, p: [38, 0.55, -4.2], l: [37.5, 0.5, -2.55], p2: [36.2, 0.6, -4.6], l2: [36, 0.6, -1.5], f: 22, shake: 0.2, on: () => crew.forEach((c, i) => { if (c && i < 4) { c.pose = 'gunUp'; c.work = 0; } }), sub: say(td, L.close || 'That is the factory. Everything on Sunday starts as a line on a screen in here.') },
      ];
      void host; void ops; void tdp;
      return { shots };
    } };
}

/** the pit wall's five: you in the middle, engineers and the strategist either side - seated tense, or on their feet */
function wallFive(k, A, T, poses, standing) {
  const names = ['strategist', 'race engineer one', 'the-principal', 'race engineer two', 'crew chief'];
  return (standing ? A.stand : A.seats).map((s, i) => { const o = i === 2 ? youOpts(T, poses[i]) : staff(names[i], T, poses[i]); const a = k.person(o, [s[0], s[1], s[2]], 0); if (a && !standing) a.hY = 1.27; return a; });
}
/**
 * 3. The pit wall as the flag falls: what the result looked like from the stools. Short, and only watched. ctx: { kind:
 * 'win' | 'podium' | 'points' | 'double' (both out) | 'botch' (a stop thrown away) | 'heartbreak' (lost at the end), who
 * (the driver's name), pos, night, lines: { a, b } }
 */
export function pitwallReact(ctx) {
  const { T } = base(ctx), kind = ctx.kind || 'win', L = ctx.lines || {}, good = kind === 'win' || kind === 'podium' || kind === 'points';
  const TITLE = { win: 'The chequered flag', podium: 'On the podium', points: 'In the points', double: 'Both cars out', botch: 'In the pit lane', heartbreak: 'Two laps from home' };
  return { id: 'pitwallReact', kicker: `${ctx.track || 'The pit wall'} · ${T.name}`, title: TITLE[kind], accent: T.color, bg: ctx.night ? '#05070d' : '#8fb4dc', exposure: 1.0, grade: good ? 'warm' : 'cold', fill: 0.8, sound: good ? { name: 'crowd', gain: 0.35 } : null,
    build(k) {
      const rows = (ctx.gaps || []).map((g) => ({ a: g.pos, b: g.name, c: g.gap, hi: g.mine, col: g.col }));
      const A = SETS.pitwall(k, T, { night: ctx.night, screens: [null, null, paintTable('RACE', rows, T.color, { min: 5 })] });
      const sit = wallFive(k, A, T, kind === 'double' || kind === 'heartbreak' ? ['sitLean', 'mourn', 'sitLean', 'sit', 'sitArm'] : ['sit', 'sitLean', 'sitLean', 'sit', 'sitArm'], false);
      const up = wallFive(k, A, T, good ? ['cheer', 'cheer', 'cheer', 'brohug', 'cheer'] : kind === 'botch' ? ['hips', 'cross', 'hips', 'cross', 'shove'] : ['hips', 'mourn', 'cross', 'kneel', 'hips'], true);
      for (const a of up) if (a) { a.g.visible = false; if (good) a.bounce = 1; }
      for (const a of sit) if (a) a.look = { x: a.g.position.x * 0.5, y: 1.5, z: 0.7 };
      const rise = () => { for (const a of sit) if (a) a.g.visible = false; for (const a of up) if (a) a.g.visible = true; };
      // (a headset thrown down the pit lane: the stop that went wrong)
      const hs = k.box(0.2, 0.08, 0.18, k.m('#17181c', 0.5), 2.4, 1.9, -0.55); hs.visible = false; let thrown = -1;
      k.each((t) => { if (thrown < 0) return; const u = t - thrown; hs.visible = true; hs.position.set(k.org.x + 2.4 + u * 2.2, Math.max(0.05, 2.0 + u * 2.5 - 4.9 * u * u), k.org.z - 0.6 - u * 4.5); hs.rotation.set(u * 9, u * 7, 0); });
      const front = { p: [0.6, 2.1, 5.2], l: [0, 1.75, -0.2], f: 26 };
      const shots = good ? [
        { ...creep(cu(sit[2], { ang: 0.5, dist: 3.0, f: 14, up: 0.3 }), 0.1), d: 3.6, shake: 0.35, sub: say(ctx.eng || 'Race engineer', L.a || `Last lap. ${surname(ctx.who || 'He')} has it. Do not say it. Do not say it.`) },
        { ...front, p2: [-0.4, 1.95, 4.4], d: 3.4, shake: 1.0, on: rise, sub: say(ctx.eng || 'Race engineer', L.b || (kind === 'win' ? `P1! ${surname(ctx.who || '')} wins it! YES!` : kind === 'podium' ? `P${ctx.pos || 3}! That is a podium! Get in!` : `P${ctx.pos || 8}. Points. We will take every one of them.`)), sfx: (a) => a.play?.('crowd', { gain: 0.7 }) },
        { ...creep(cu(up[3], { ang: -0.6, dist: 2.8, f: 15, up: 0.1 }), 0.12), d: 3.2, shake: 0.8 },
        { d: 3.6, p: [-5.5, 2.6, 4.0], l: [0, 1.9, 0], p2: [-6.4, 3.4, 5.4], f: 28, e: 'out', shake: 0.3, dof: 0.4 },
      ] : kind === 'botch' ? [
        { ...creep(cu(sit[4], { ang: -0.5, dist: 3.0, f: 14, up: 0.3 }), 0.1), d: 3.6, shake: 0.4, sub: say('Crew chief', L.a || `${(ctx.time ?? 6.8).toFixed(1)} seconds. ${ctx.note || 'The front-left would not go on.'}`) },
        { ...front, p2: [1.2, 2.0, 4.6], d: 3.2, shake: 0.8, on: (kk) => { rise(); thrown = kk.t; }, sub: say('Crew chief', L.b || 'That was the race. That was the whole race.'), sfx: (a) => a.play?.('groan', { gain: 0.5 }) },
        { d: 3.8, p: [5.5, 0.6, -6.5], l: [4.5, 0.2, -4.0], p2: [5.2, 0.5, -6.0], f: 22, shake: 0.3, focus: [4.6, 0.1, -4.2] },
      ] : [
        { ...front, p: [0.2, 2.0, 5.6], p2: [0, 1.95, 4.6], f: 22, d: 4.2, shake: 0.2, sub: say(ctx.eng || 'Race engineer', L.a || (kind === 'double' ? `${surname(ctx.who || 'Car two')} is out as well. That is both of them.` : `He has lost it. ${ctx.pos ? `P${ctx.pos}. ` : ''}Two laps from the flag.`)), sfx: (a) => a.play?.('groan', { gain: 0.45 }) },
        { ...creep(cu(sit[1], { ang: 0.5, dist: 2.8, f: 14, up: 0.3 }), 0.08), d: 3.6, shake: 0.2 },
        { d: 4.6, p: [-4.8, 2.3, 3.6], l: [0, 1.7, -0.2], p2: [-6.5, 2.9, 5.2], f: 26, e: 'out', shake: 0.15, dof: 0.4, on: rise, sub: say(YOU_, L.b || (kind === 'double' ? 'Pack it up. All of it. We go again on Thursday.' : 'Nobody says a word to him until he has had a shower.'), '#cfd6e4') },
      ];
      return { shots };
    } };
}
const YOU_ = 'You';

/**
 * 4. The garage, the night after the crash: the car rebuilt while the paddock sleeps. Only watched. ctx: { d (who
 * crashed), damage (text), spares (left), clock: ['23:40', '02:15', '05:50'], lines: { chief, d } }
 */
export function garageNight(ctx) {
  const { T, D } = base(ctx), d = ctx.d || D[0], L = ctx.lines || {}, CL = ctx.clock || ['23:40', '02:15', '05:50'];
  return { id: 'garageNight', kicker: `${ctx.track || 'The garage'} · ${CL[0]}`, title: 'Through the night', accent: T.color, bg: '#04060b', exposure: 0.95, grade: 'cold', needsCar: true, fill: 0.6,
    build(k) {
      k.env(0.5);
      const clock = (tx, sp) => (x, W, H) => { x.fillStyle = '#0b0d12'; x.fillRect(0, 0, W, H); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#ff5a4d'; x.font = `900 ${H * 0.42}px ${k.FONT}`; x.fillText(tx, W / 2, H * 0.4); x.fillStyle = '#ffffff'; x.font = `600 ${H * 0.1}px ${k.FONT}`; x.fillText(sp, W / 2, H * 0.8); };
      const A = SETS.garage(k, T, { night: true, screens: [paintTable('DAMAGE', (ctx.parts || [ctx.damage || 'Front wing', 'Floor', 'Front-left corner']).map((p, i) => ({ a: i + 1, b: String(p).toUpperCase(), c: 'REPLACE', cc: '#ff5a4d' })), T.color, { min: 4 }), clock(CL[0], 'PARC FERMÉ OPENS 08:00'), paintTable('SPARES', [{ a: '', b: 'FRONT WINGS', c: String(ctx.spares ?? 1), hi: true }, { a: '', b: 'FLOORS', c: '1' }, { a: '', b: 'GEARBOXES', c: '1' }], T.color, { min: 4 })] });
      const car = k.car(carOf(T, d), [A.car[0], 0.22, A.car[2]], 0);
      for (const [x, z] of [[-0.9, 1.6], [0.9, 1.6], [-0.9, -1.2], [0.9, -1.2]]) k.box(0.3, 0.22, 0.3, k.m('#d9a800', 0.5, 0.4), x, 0.11, z);
      const c = [k.crew({ color: T.color, accent: T.color2, pose: 'gun', work: 1 }, [1.35, 0, 1.9], -PI / 2), k.crew({ color: T.color, accent: T.color2, pose: 'wing', work: 0.7 }, [0.3, 0, 3.3], PI), k.crew({ color: T.color, accent: T.color2, pose: 'steady', work: 0.4 }, [-1.3, 0, -0.6], PI / 2), k.crew({ color: T.color, accent: T.color2, pose: 'gun', work: 1 }, [-1.35, 0, 1.9], PI / 2)];
      // the new wing, carried in by two
      const wing = k.box(1.9, 0.05, 0.42, k.m(T.color, 0.3, 0.2), -6.2, 0.75, -3.4); const w1 = k.crew({ color: T.color, accent: T.color2, pose: 'wingCarry' }, [-6.2, 0, -4.3], 0), w2 = k.crew({ color: T.color, accent: T.color2, pose: 'wingCarry' }, [-6.2, 0, -2.5], 0);
      let carry = false; k.each(() => { if (!carry || !w1 || !w2) return; wing.position.set((w1.g.position.x + w2.g.position.x) / 2, 0.75, (w1.g.position.z + w2.g.position.z) / 2); wing.rotation.y = Math.atan2(w2.g.position.x - w1.g.position.x, w2.g.position.z - w1.g.position.z) + PI / 2; });
      // the grinder's sparks at the back of the car
      const N = 70, sp = new Float32Array(N * 3), sv = new Float32Array(N * 3), sl = new Float32Array(N), sg = k.own(new k.THREE.BufferGeometry()); sg.setAttribute('position', new k.THREE.BufferAttribute(sp, 3));
      k.S.add(new k.THREE.Points(sg, k.own(new k.THREE.PointsMaterial({ color: '#ffb347', size: 0.03, transparent: true, opacity: 0.95, depthWrite: false })))); const spark = k.light.point(0xffa040, 0, [-1.0, 0.6, -0.9], 5);
      let n = 0; k.each((t, dt) => { const on = Math.sin(t * 2.3) > 0.2; spark.intensity = on ? 6 + Math.random() * 10 : 0; for (let i = 0; i < N; i++) { if (sl[i] > 0) { sl[i] -= dt; sv[i * 3 + 1] -= 6 * dt; sp[i * 3] += sv[i * 3] * dt; sp[i * 3 + 1] = Math.max(0.01, sp[i * 3 + 1] + sv[i * 3 + 1] * dt); sp[i * 3 + 2] += sv[i * 3 + 2] * dt; } else sp[i * 3 + 1] = -5; } if (on) for (let q = 0; q < 3; q++) { const i = n++ % N; sp.set([k.org.x - 1.0, 0.6, k.org.z - 0.9], i * 3); sv.set([-1 - Math.random() * 2, 1 + Math.random() * 2, (Math.random() - 0.5) * 2], i * 3); sl[i] = 0.5; } sg.attributes.position.needsUpdate = true; });
      const dp = k.person(drv(d, T, 'cross', { cap: false }), [4.4, 0, 3.9], -2.3), chief = k.person(staff('crew chief', T, 'hips'), [3.2, 0, 2.6], 0.9); dp.g.visible = chief.g.visible = false; dp.look = { x: 0, y: 0.8, z: 0.5 }; chief.look = { x: 4.4, y: 1.6, z: 3.9 };
      const shots = [
        { d: 4.6, p: [-5.5, 1.2, 9.5], l: [0, 1.0, 0.5], p2: [-3.0, 1.15, 8.6], f: 20, e: 'lin', shake: 0.08, dof: 0.6, sub: say('Crew chief', L.chief || `${ctx.damage || 'Front wing, floor, the front-left corner'}. ${ctx.spares != null ? `${ctx.spares} wing${ctx.spares === 1 ? '' : 's'} left in the truck after this one. ` : ''}Nobody goes home.`) },
        { d: 3.8, p: [2.5, 0.38, 0.5], l: [1.0, 0.5, 1.8], p2: [2.2, 0.42, 0.2], f: 20, shake: 0.12 },
        { d: 4.4, p: [-2.4, 1.5, 4.8], l: [-4.8, 0.9, -2], p2: [-1.6, 1.5, 4.4], l2: [-2.0, 0.9, 1.0], f: 26, shake: 0.1, on: () => { carry = true; w1?.walk([[-3.4, -1.0], [-1.2, 2.4], [-0.5, 3.6]], 1.2, 'wing'); w2?.walk([[-3.4, 0.8], [-1.0, 3.8], [0.9, 3.9]], 1.2, 'wing'); A.screens[1].redraw(clock(CL[1], 'PARC FERMÉ OPENS 08:00')); } },
        { d: 3.6, p: [0.6, 3.6, 1.2], l: [-0.6, 0.4, -0.8], p2: [1.0, 3.4, 0.6], f: 28, roll: 0.3, roll2: 0.1, shake: 0.06, dof: 0.4 },
        { d: 5, cut: 'dip', p: [6.6, 1.65, 6.4], l: [3.6, 1.45, 3.1], p2: [6.0, 1.65, 5.6], f: 18, shake: 0.12, on: () => { A.screens[1].redraw(clock(CL[2], 'PARC FERMÉ OPENS 08:00')); dp.g.visible = chief.g.visible = true; c.forEach((x, i) => { if (x && i !== 2) { x.pose = 'stand'; x.work = 0; } }); }, sub: [say(surname(d.name), L.d || 'I am sorry. All of you. That one was on me.'), say('Crew chief', L.chief2 || 'It is a car. We build them. Go and sleep: you are driving it in six hours.')] },
        { d: 4, p: [0, 1.0, 10], l: [0, 0.9, 0.5], p2: [0, 1.3, 13], f: 24, e: 'io', shake: 0.04, dof: 0.3 },
      ];
      void car;
      return { shots };
    } };
}

/**
 * 5. The signing: the contract, the shirt with the name on it, the handshake for the photographers (a moment to catch),
 * what you tell the room. ctx: { d: { name, number }, years, salary, from, replaces, lines: { d } }. Asked: the message
 * (win | future | change). -> picks.message, qte.shake
 */
export function signing(ctx) {
  const { T } = base(ctx), d = ctx.d || { name: 'New Driver', number: 7 }, L = ctx.lines || {};
  const MSG = { win: [`He is here to win. This year.`, `${T.name} sign ${surname(d.name)} "to win now"`], future: ['He is the future of this team. Give him time.', `${surname(d.name)} is ${T.name}'s long game`], change: ['We needed a change. He is it.', `${T.name} ring the changes: ${surname(d.name)} in`] };
  return { id: 'signing', kicker: `${T.name} · Announcement`, title: `${d.name}`, sub: `${ctx.years || 2} year${(ctx.years || 2) === 1 ? '' : 's'}${ctx.from ? ` · from ${ctx.from}` : ''}`, accent: T.color, bg: '#06070a', exposure: 1.0, grade: 'neutral', sound: { name: 'crowd', gain: 0.12 },
    build(k) {
      const A = SETS.pressroom(k, T, { names: ctx.sponsors || [], rows: 3 });
      const sheet = k.sign(0.3, 0.42, (x, W, H) => { x.fillStyle = '#f6f3ec'; x.fillRect(0, 0, W, H); x.fillStyle = T.color; x.fillRect(0, 0, W, H * 0.08); x.fillStyle = '#222'; x.font = `800 ${H * 0.055}px ${k.FONT}`; x.fillText('DRIVER AGREEMENT', W * 0.08, H * 0.16); x.font = `400 ${H * 0.03}px ${k.FONT}`; x.fillStyle = '#666'; for (let i = 0; i < 14; i++) x.fillRect(W * 0.08, H * (0.22 + i * 0.04), W * (0.5 + k.rnd() * 0.34), H * 0.012); x.strokeStyle = '#16224f'; x.lineWidth = 3; x.beginPath(); x.moveTo(W * 0.12, H * 0.88); x.bezierCurveTo(W * 0.3, H * 0.78, W * 0.36, H * 0.96, W * 0.5, H * 0.86); x.bezierCurveTo(W * 0.6, H * 0.8, W * 0.66, H * 0.92, W * 0.8, H * 0.84); x.stroke(); }, 0.5, 1.101, -1.05, 0, 512); sheet.rotation.x = -PI / 2;
      const pen = k.cyl(0.006, 0.006, 0.14, k.m('#111318', 0.3, 0.6), 0.62, 1.11, -1.0, 8); pen.rotation.z = PI / 2 - 0.3;
      const shirt = k.sign(0.62, 0.72, (x, W, H) => { x.fillStyle = T.color; x.fillRect(0, 0, W, H); x.fillStyle = T.color2 || '#ffffff'; x.fillRect(0, H * 0.9, W, H * 0.1); x.textAlign = 'center'; x.fillStyle = '#ffffff'; x.font = `900 ${H * 0.13}px ${k.FONT}`; x.fillText(surname(d.name).toUpperCase().slice(0, 11), W / 2, H * 0.22); x.font = `900 ${H * 0.5}px ${k.FONT}`; x.fillText(String(d.number ?? ''), W / 2, H * 0.75); }, 0, 1.75, 0.35, 0, 512, { side: k.THREE.DoubleSide });
      const you1 = k.person(youOpts(T, 'handOut'), [-0.4, 0.3, -0.25], PI / 2), d1 = k.person(drv(d, T, 'handIn', { cap: false }), [0.4, 0.3, -0.25], -PI / 2);
      const you2 = k.person(youOpts(T, 'talk'), [-0.7, 0.3, 0.1], 0.2), d2 = k.person(drv(d, T, 'hips', { cap: true }), [0.7, 0.3, 0.1], -0.2); you1.g.visible = d1.g.visible = false; shirt.visible = true;
      const burst = k.light.point(0xffffff, 0, [0, 1.8, 3.5], 20); let flashAt = -9; k.each((t) => { const u = t - flashAt; burst.intensity = u >= 0 && u < 0.5 ? 220 * (Math.sin(u * 40) > 0 ? 1 : 0.2) * (1 - u * 2) : 0; });
      const scr = k.at(0, 0, 60).screen(1.6, 0.9, paintHeadline({ paper: 'Paddock Daily', head: '...', deck: '' }), 0, 1.2, 0, 0, 1.0, 1024); k.light.point(0xfff1e0, 3, [0, 1.3, 1.2], 4); k.at(0, 0, 0);
      const shots = [
        { d: 4, p: [1.0, 1.32, -0.6], l: [0.5, 1.1, -1.05], p2: [0.25, 1.3, -0.62], f: 22, shake: 0.06, sub: say('Announcer', L.open || `${d.name}. ${ctx.years || 2} year${(ctx.years || 2) === 1 ? '' : 's'}. ${ctx.salary ? `$${ctx.salary}M a season. ` : ''}Signed this morning.`, '#cfd6e4') },
        { d: 4, p: [0.4, 1.7, 2.6], l: [0, 1.75, 0.35], p2: [0.1, 1.74, 1.6], f: 24, shake: 0.08, focus: [0, 1.75, 0.35], sub: say('Announcer', L.shirt || `Number ${d.number ?? ''}. ${ctx.replaces ? `He takes ${surname(ctx.replaces)}'s seat.` : `In ${T.name} colours.`}`, '#cfd6e4') },
        { ...creep(two(you1, d1, { side: 1, dist: 3.6, f: 24, up: -0.1 }), 0.1), d: 3.2, shake: 0.2, on: () => { shirt.visible = false; you2.g.visible = d2.g.visible = false; you1.g.visible = d1.g.visible = true; },
          qte: { id: 'shake', kind: 'time', prompt: 'The handshake: hold it for the cameras', from: 0.5, len: 2.6, sweet: [0.55, 0.78], words: { good: 'THE PICTURE', ok: 'GOOD', miss: 'AWKWARD' }, onDone: (g, kk) => { if (g !== 'miss') flashAt = kk.t; } } },
        { ...creep(cu(d2, { ang: 0.4, dist: 2.3, f: 15 }), 0.1), d: 3.8, shake: 0.12, on: () => { you1.g.visible = d1.g.visible = false; you2.g.visible = d2.g.visible = true; d2.look = { x: 2, y: 1.6, z: 4 }; }, low: { name: d.name, role: `${T.name} · No. ${d.number ?? ''}` }, sub: say(surname(d.name), L.d || 'I did not come here to make up the numbers.') },
        { d: 3, p: [1.6, 1.6, 4.3], l: [-0.7, 1.9, 0.1], p2: [1.3, 1.6, 3.8], f: 16, shake: 0.2, focus: [1.2, 1.3, 2.6], focus2: [-0.7, 1.9, 0.1], sub: say('From the floor', L.q || `Why ${surname(d.name)}? Why now?`, '#cfd6e4'),
          ask: { id: 'message', prompt: 'What do you tell them?', time: 6.5, def: 'future', options: [{ id: 'win', label: 'He is here to win, this year' }, { id: 'future', label: 'He is the future: give him time' }, { id: 'change', label: 'We needed a change' }] } },
        { ...creep(cu(you2, { ang: -0.35, dist: 2.3, f: 15 }), 0.1), d: 3.2, shake: 0.1, sub: (r) => say(YOU_, (MSG[r.picks.message] || MSG.future)[0], '#ffffff') },
        { d: 3.6, cut: 'dip', p: [0.5, 1.25, 62.4], l: [0, 1.2, 60], p2: [0.2, 1.22, 61.7], f: 24, shake: 0.2, dof: 0, on: (kk, r) => scr.redraw(paintHeadline({ paper: 'Paddock Daily', head: (MSG[r.picks.message] || MSG.future)[1], deck: r.qte.shake === 'miss' ? 'An awkward handshake, a nervous room: the photographs say more than the press release.' : `${ctx.years || 2} years, number ${d.number ?? ''}, and a picture every site will run.`, col: T.color })) },
      ];
      return { shots };
    } };
}

/**
 * 6a. Dismissed: the board lets you go. ctx: { chair: { name }, pos, target, seasons, lines }. Asked: how you take it
 * (grace | record | blame) - what the paddock hears of it decides who calls.
 */
export function sacked(ctx) {
  const { T } = base(ctx), ch = ctx.chair?.name || 'The chair', L = ctx.lines || {};
  const REP = { grace: ['Then thank you for the chance. Look after the people downstairs.', 'That is how it should be done. I will say so, when they ask.'], record: [`P${ctx.pos ?? '?'} with that budget. Find someone who does better with it.`, 'You may be right. It does not change the letter.'], blame: ['I was handed a car that was a second off. Nobody in this room wants to say who signed it off.', 'I would not repeat that outside this room, if I were you.'] };
  return { id: 'sacked', kicker: `${T.name} · Season ${ctx.season || ''}`, title: 'The letter', accent: '#8a8f98', bg: '#06070a', exposure: 0.9, grade: 'cold',
    build(k) {
      const A = SETS.boardroom(k, T, { night: true, screen: paintTable("Constructors' championship", ctx.table || [], T.color, { note: ctx.target ? `TARGET P${ctx.target}` : '' }) });
      const chair = seated(k.person(suit(ch, 'sitLean', { build: 'broad' }), [0, 0, -1.2], 0)), you = seated(k.person(youOpts(T, 'sit'), [0, 0, 1.2], PI));
      chair.look = { x: 0, y: 1.25, z: 1.2 }; you.look = { x: 0, y: 0.8, z: 0.2 };
      const letter = k.sign(0.21, 0.3, (x, W, H) => { x.fillStyle = '#f6f3ec'; x.fillRect(0, 0, W, H); x.fillStyle = T.color; x.fillRect(W * 0.08, H * 0.06, W * 0.3, H * 0.05); x.fillStyle = '#555'; for (let i = 0; i < 9; i++) x.fillRect(W * 0.08, H * (0.2 + i * 0.07), W * (0.5 + k.rnd() * 0.34), H * 0.02); }, 0, 0.785, -0.5, 0, 256); letter.rotation.x = -PI / 2;
      k.at(0, 0, 60); const B = SETS.office(k, T, { cups: ctx.cups || 0 }); k.box(0.5, 0.32, 0.36, k.m('#b08d57', 0.9), 0.3, 0.95, -0.95); k.ball(0.14, k.m(T.color, 0.3, 0.3), 0.3, 1.2, -0.95); const off = k.shots([{ d: 5.5, cut: 'dip', p: [2.6, 1.7, 2.6], l: [0.2, 1.0, -1], p2: [3.4, 1.9, 3.4], f: 26, e: 'out', shake: 0.05, dof: 0.5, sub: say(YOU_, L.close || `${ctx.seasons || 2} season${(ctx.seasons || 2) === 1 ? '' : 's'}. It fits in one box.`, '#cfd6e4') }]); k.at(0, 0, 0); void B;
      const shots = [
        { d: 4.6, p: [4.4, 2.2, 3.4], l: [0, 0.9, 0], p2: [3.4, 1.8, 3.0], f: 28, e: 'io', dof: 0.5, sub: say(ch, L.open || 'There is no kind way to do this, so I will do it quickly.') },
        { d: 4, p: [0.5, 1.1, 0.35], l: [0, 0.79, -0.5], p2: [0.35, 1.0, 0.5], l2: [0, 0.79, 0.25], f: 20, shake: 0.05, run: (kk, u) => { letter.position.z = kk.org.z - 0.5 + Math.min(1, u * 1.6) * 0.75; }, sub: say(ch, L.fact || `P${ctx.pos ?? '?'}. We asked for P${ctx.target ?? '?'}. The board voted this morning.`) },
        { ...creep(ots(chair, you, { f: 20, back: 1.0 }), 0.08), d: 3, shake: 0.08, sub: [], ask: { id: 'how', prompt: 'How do you take it?', time: 7, def: 'grace', options: [{ id: 'grace', label: 'With grace' }, { id: 'record', label: 'Defend your record' }, { id: 'blame', label: 'Say whose car it was' }] } },
        { ...creep(cu(you, { ang: 0.3, dist: 2.3, f: 15 }), 0.1), d: 3.6, shake: 0.08, on: () => { you.look = { x: 0, y: 1.25, z: -1.2 }; }, sub: (r) => say(YOU_, (REP[r.picks.how] || REP.grace)[0], '#ffffff') },
        { ...creep(cu(chair, { ang: -0.3, dist: 2.4, f: 15 }), 0.1), d: 3.6, shake: 0.06, sub: (r) => say(ch, (REP[r.picks.how] || REP.grace)[1]) },
        ...off,
      ];
      return { shots };
    } };
}
/**
 * 6b. Letting a driver go. ctx: { d, why (text), lines }. Asked: how you tell him (honest | cold | kind).
 */
export function released(ctx) {
  const { T } = base(ctx), d = ctx.d || { name: 'Driver One', number: 1 }, L = ctx.lines || {};
  const REP = { honest: ['The stopwatch made the decision. I am only the one saying it.', 'At least you said it to my face.'], cold: ['The seat is not yours next year. That is all there is.', 'Then I hope it is worth it.'], kind: ['You gave this team everything. It was not enough, and that is on us too.', 'Do not be kind. It makes it worse.'] };
  return { id: 'released', kicker: `${T.name} · The office`, title: `${surname(d.name)} is out`, accent: T.color, bg: '#090a0e', exposure: 0.95, grade: 'cold',
    build(k) {
      const A = SETS.office(k, T, { cups: ctx.cups || 0, screen: paintTable('This season', ctx.table || [], T.color, { min: 4 }) });
      const you = seated(k.person(youOpts(T, 'sitLean'), [0, 0, -1.85], 0)), dr = seated(k.person(drv(d, T, 'sit', { cap: false }), [0.7, 0, 0.35], PI));
      you.look = { x: 0.7, y: 1.2, z: 0.35 }; dr.look = { x: 0, y: 1.2, z: -1.85 };
      const hel = k.ball(0.15, k.m(d.helmet || T.color, 0.25, 0.3), 0.7, 0.93, -0.75); hel.scale.set(1.12, 1, 1); void A;
      const shots = [
        { d: 4.4, p: [-3.0, 1.8, 2.8], l: [0.3, 1.0, -0.8], p2: [-2.2, 1.6, 2.4], f: 28, e: 'io', dof: 0.5, sub: say(YOU_, L.open || `Sit down, ${surname(d.name)}. ${ctx.why || 'You know why you are here.'}`, '#ffffff') },
        { ...creep(cu(dr, { ang: 0.35, dist: 2.2, f: 15 }), 0.1), d: 3.4, shake: 0.12, low: { name: d.name, role: T.name }, sub: say(surname(d.name), L.d1 || 'Just say it.'),
          ask: { id: 'how', prompt: 'How do you tell him?', time: 6.5, def: 'honest', options: [{ id: 'honest', label: 'Honestly: the lap times decided it' }, { id: 'cold', label: 'Briefly' }, { id: 'kind', label: 'Kindly' }] } },
        { ...creep(ots(dr, you, { f: 22, back: 0.9 }), 0.08), d: 3.4, shake: 0.08, sub: (r) => say(YOU_, (REP[r.picks.how] || REP.honest)[0], '#ffffff') },
        { ...creep(cu(dr, { ang: -0.3, dist: 2.0, f: 14 }), 0.1), d: 3.4, shake: 0.14, sub: (r) => say(surname(d.name), (REP[r.picks.how] || REP.honest)[1]) },
        { d: 5, cut: 'dip', p: [1.4, 1.15, 0.4], l: [0.7, 0.93, -0.75], p2: [1.1, 1.1, 0.1], f: 20, shake: 0.05, on: () => { dr.g.visible = false; you.look = { x: 0.7, y: 0.93, z: -0.75 }; }, sub: say(YOU_, L.close || 'He left the helmet on the desk.', '#cfd6e4') },
      ];
      return { shots };
    } };
}

/**
 * 7. The title decider's opening film (before the race that can settle it). Only watched. ctx: { a, b: { name, team:
 * { name, color }, pts, wins }, what ('drivers' | 'constructors'), track, left (races to go), mine (a | b | null) }
 */
export function decider(ctx) {
  const { T } = base(ctx), a = ctx.a || { name: 'Driver One', team: T, pts: 148, wins: 4 }, b = ctx.b || { name: 'Driver Two', team: { name: 'Rival', color: '#27f4d2' }, pts: 141, wins: 3 }, gap = Math.abs((a.pts || 0) - (b.pts || 0)), con = ctx.what === 'constructors';
  return { id: 'decider', kicker: `${ctx.track || 'The last race'} · ${con ? "Constructors'" : "Drivers'"} championship`, title: gap ? `${gap} point${gap === 1 ? '' : 's'}` : 'Level', sub: (ctx.left ?? 1) <= 1 ? 'One race' : `${ctx.left} races`, accent: '#d9b04a', bg: '#030406', fog: [16, 44], exposure: 1.0, grade: 'gold', fill: 1.0,
    build(k) {
      const wall = (lit) => (x, W, H) => { x.fillStyle = '#030305'; x.fillRect(0, 0, W, H); const half = (c, x0, al, d) => { const g = x.createLinearGradient(x0, 0, x0 + W / 2, 0); g.addColorStop(al ? 0 : 1, c); g.addColorStop(al ? 1 : 0, '#050506'); x.globalAlpha = lit ? 0.5 : 0.18; x.fillStyle = g; x.fillRect(x0, 0, W / 2, H); x.globalAlpha = 1; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#ffffff'; x.font = `900 ${H * 0.42}px ${k.FONT}`; x.fillText(String(d.pts ?? ''), x0 + W / 4, H * 0.45); x.font = `700 ${H * 0.085}px ${k.FONT}`; x.fillText(con ? String(d.team?.name || d.name).toUpperCase() : surname(d.name).toUpperCase(), x0 + W / 4, H * 0.8); }; half(a.team?.color || T.color, 0, true, a); half(b.team?.color || '#27f4d2', W / 2, false, b); x.fillStyle = '#d9b04a'; x.fillRect(W / 2 - 2, H * 0.1, 4, H * 0.8); };
      const A = SETS.stage(k, T, { wall: wall(false), guests: 0 });
      A.key.intensity = 0; A.rimL.color.set(a.team?.color || T.color); A.rimR.color.set(b.team?.color || '#27f4d2'); A.rimL.intensity = 260; A.rimR.intensity = 260;
      const pa = k.person(drv(a, a.team || T, 'cross'), [-2.2, 0.5, -0.6], 0.5), pb = k.person(drv(b, b.team || T, 'cross'), [2.2, 0.5, -0.6], -0.5);
      const fa = k.person(drv(a, a.team || T, 'hips'), [-0.85, 0.5, -0.6], PI / 2), fb = k.person(drv(b, b.team || T, 'hips'), [0.85, 0.5, -0.6], -PI / 2); fa.g.visible = fb.g.visible = false; fa.look = { x: 0.85, y: 2.1, z: -0.6 }; fb.look = { x: -0.85, y: 2.1, z: -0.6 };
      const gold = k.m('#d9b04a', 0.2, 0.95); k.box(0.5, 1.0, 0.5, k.m('#0e0f13', 0.3, 0.4), 0, 1.0, 1.0); const cup = k.cyl(0.13, 0.04, 0.3, gold, 0, 1.72, 1.0, 24); k.cyl(0.03, 0.07, 0.12, gold, 0, 1.56, 1.0, 14); const spot = k.light.spot(0xfff0d0, 0, [0, 6, 3], [0, 1.6, 1.0], 0.3, 0.6);
      k.env(0.8, 0.3);
      const shots = [
        { d: 4.4, p: [0, 3.4, 9.5], l: [0, 3.0, -4.3], p2: [0, 3.1, 6.5], f: 30, e: 'io', dof: 0, shake: 0.03, sub: say('Commentator', ctx.lines?.open || `${ctx.rounds || 'Twenty-two'} races. ${a.wins ?? 0} wins against ${b.wins ?? 0}. And it comes down to ${ctx.track || 'this'}.`, '#d9b04a') },
        { d: 4, p: [-3.4, 0.9, 2.4], l: [-2.2, 2.2, -0.6], p2: [-2.9, 0.95, 1.9], f: 22, shake: 0.06, low: { name: a.name, role: `${a.team?.name || ''} · ${a.pts ?? ''} points`, c: a.team?.color }, on: () => { pa.look = k.cam.position; }, sub: say('Commentator', ctx.lines?.a || `${surname(a.name)} needs ${ctx.needA || 'only to finish ahead'}.`, '#d9b04a') },
        { d: 4, p: [3.4, 0.9, 2.4], l: [2.2, 2.2, -0.6], p2: [2.9, 0.95, 1.9], f: 22, shake: 0.06, low: { name: b.name, role: `${b.team?.name || ''} · ${b.pts ?? ''} points`, c: b.team?.color }, on: () => { pb.look = k.cam.position; }, sub: say('Commentator', ctx.lines?.b || `${surname(b.name)} has to win. Nothing else will do.`, '#d9b04a') },
        { d: 4.4, p: [0, 2.05, 4.6], l: [0, 2.1, -0.6], p2: [0, 2.08, 3.2], f: 24, shake: 0.05, dof: 0.5, on: () => { pa.g.visible = pb.g.visible = false; fa.g.visible = fb.g.visible = true; A.wall.redraw(wall(true)); }, sub: say('Commentator', ctx.lines?.gap || (gap ? `${gap} point${gap === 1 ? '' : 's'} between them.` : 'Nothing between them.'), '#d9b04a') },
        { d: 5, p: [1.6, 1.7, 2.6], l: [0, 1.75, 1.0], p2: [-1.5, 1.85, 2.5], arc: [0, 0.1, 0.8], f: 22, e: 'io', shake: 0.03, on: () => { spot.intensity = 300; }, focus: [0, 1.78, 1.0], sub: say('Commentator', ctx.lines?.close || 'One of them leaves here a champion.', '#d9b04a') },
        { d: 2.6, card: { kicker: ctx.track || '', title: 'It ends here' }, p: [0, 1, 5], l: [0, 1, 0] },
      ];
      void cup;
      return { shots };
    } };
}

/**
 * 8. The cool-down room: the top three before the podium, the replay on the wall, what they say when they think the
 * microphones are off. Only watched. ctx: { top: [{ name, team: { name, color } }] (three), inc ({ a, b, ca, cb, where,
 * lap } - the moment replayed), lines: [l1, l2, l3] (who: 0, 1, 2 says what) }
 */
export function cooldownRoom(ctx) {
  const { T } = base(ctx), top = (ctx.top && ctx.top.length >= 3 ? ctx.top : [{ name: 'Driver One', team: T }, { name: 'Driver Two', team: { name: 'Rival', color: '#27f4d2' } }, { name: 'Driver Three', team: { name: 'Other', color: '#ff8000' } }]).slice(0, 3);
  const inc = ctx.inc || { a: 'P1', b: 'P2', ca: top[0].team.color, cb: top[1].team.color, where: 'Turn 1', lap: 1 }, L = ctx.lines || [];
  return { id: 'cooldownRoom', kicker: `${ctx.track || 'After the flag'} · The cool-down room`, title: 'Before the podium', accent: top[0].team.color, bg: '#0a0b0e', exposure: 1.0, grade: 'neutral', fill: 0.7,
    build(k) {
      let u = 0; const A = SETS.cooldown(k, T, { screen: paintIncident(inc, 0), c1: top[0].team.color, c2: top[1].team.color, c3: top[2].team.color });
      k.each((t, dt) => { u = (u + dt * 0.22) % 1.25; A.screen.redraw(paintIncident(inc, Math.min(1, u))); A.tv.intensity = 7 + Math.sin(t * 9) * 2; });
      const P3 = top.map((d, i) => { const a = k.person(drv(d, d.team, ['hips', 'cross', 'drink'][i], { cap: false }), A.spots[i], PI + [0.25, 0, -0.25][i]); if (a) a.look = { x: 0, y: 1.75, z: -2.9 }; return a; });
      const face = (i, ang) => creep(cu(P3[i], { ang, dist: 2.2, f: 14 }), 0.1);
      const shots = [
        { d: 4.4, p: [0.4, 1.75, 2.7], l: [0, 1.7, -2.9], p2: [0.1, 1.72, 1.8], f: 26, shake: 0.2, focus: [0, 1.75, -2.9], sub: say(surname(top[1].name), L[1] || `There. Look. You left me a car's width and then you took it away.`, top[1].team.color) },
        { d: 4.2, p: [-1.9, 1.62, -2.3], l: [-0.95, 1.6, 0.1], p2: [1.6, 1.62, -2.4], l2: [0.95, 1.6, 0.1], f: 16, e: 'lin', shake: 0.15, sub: say(surname(top[0].name), L[0] || 'It is lap one. If you go for a gap, I close it. You would have done the same.', top[0].team.color) },
        { ...face(1, 0.3), d: 3.2, shake: 0.2, on: () => { P3[1].look = hd(P3[0]) && { x: A.spots[0][0], y: 1.62, z: A.spots[0][2] }; P3[1].shake = 0.2; }, low: { name: top[1].name, role: `P2 · ${top[1].team.name}`, c: top[1].team.color } },
        { ...face(2, -0.3), d: 3.4, shake: 0.15, sub: say(surname(top[2].name), L[2] || 'Can you two do this on the plane? I would like my trophy.', top[2].team.color) },
        { d: 3.8, p: [-3.3, 1.2, 1.4], l: [0, 1.4, -0.2], p2: [-3.2, 1.25, 1.9], f: 24, shake: 0.1, focus: [-2.9, 0.9, 0.3], focus2: [0, 1.6, 0], dof: 1.3 },
      ];
      return { shots };
    } };
}

/**
 * 10. The season's film: its moments as they happened, one vignette each (up to five), then where it ended. Only
 * watched. ctx: { moments: [{ kind: 'win' | 'podium' | 'first' | 'crash' | 'double' | 'stop' | 'row' | 'low', round,
 * track, text, who }], pos, target, verdict ('beaten' | 'met' | 'missed' | 'sacked'), champ, champTeam }
 */
export function seasonReview(ctx) {
  const { T, D } = base(ctx), M = (ctx.moments || [{ kind: 'win', round: 3, track: 'Montreal', text: 'The first win.', who: D[0].name }, { kind: 'crash', round: 6, track: 'Silverstone', text: 'Both cars in the wall on lap one.' }]).slice(0, 5);
  const VER = { beaten: 'The board asked for less than you gave them.', met: 'What the board asked for. No more, no less.', missed: 'Short of what the board asked for.', sacked: 'It was not enough.' };
  return { id: 'seasonReview', kicker: `${T.name}`, title: `Season ${ctx.season || ''}`, sub: 'The year, as it happened', accent: T.color, bg: '#06070a', exposure: 1.0, grade: 'gold', needsCar: true, fill: 0.7, sound: { name: 'crowd', gain: 0.1 },
    build(k) {
      k.env(0.6);
      const need = (kinds) => M.some((m) => kinds.includes(m.kind));
      const shots = [];
      let W = null, G = null;
      if (need(['win', 'podium', 'first', 'low'])) { k.at(0, 0, 0); const A = SETS.pitwall(k, T, {}); const up = wallFive(k, A, T, ['cheer', 'cheer', 'cheer', 'brohug', 'cheer'], true), dn = wallFive(k, A, T, ['sitLean', 'mourn', 'sitLean', 'sit', 'sitArm'], false); W = { A, up, dn, O: [0, 0, 0] }; }
      if (need(['crash', 'double', 'stop', 'row'])) {
        k.at(0, 0, 90); const A = SETS.garage(k, T, { night: true }); k.car(carOf(T, D[0]), A.car, 0);
        const crew = [k.crew({ color: T.color, accent: T.color2, pose: 'gun', work: 1 }, [1.35, 0, 1.9], -PI / 2), k.crew({ color: T.color, accent: T.color2, pose: 'gun', work: 1 }, [-1.35, 0, 1.9], PI / 2), k.crew({ color: T.color, accent: T.color2, pose: 'jack' }, [0, 0, 3.6], PI), k.crew({ color: T.color, accent: T.color2, pose: 'steady', work: 0.4 }, [-1.3, 0, -0.6], PI / 2)];
        const da = k.person(drv(D[0], T, 'gesture'), [3.2, 0, 3.3], PI / 2 + 0.3), db = k.person(drv(D[1] || D[0], T, 'hips'), [4.5, 0, 3.3], -PI / 2 - 0.3); da.look = { x: 4.5, y: 1.6, z: 93.3 }; db.look = { x: 3.2, y: 1.6, z: 93.3 }; G = { A, crew, da, db };
      }
      M.forEach((m, i) => {
        const lowT = { name: `Round ${m.round ?? ''} · ${m.track || ''}`, role: { win: 'Victory', podium: 'Podium', first: 'A first', crash: 'In the wall', double: 'Both cars out', stop: 'In the pit lane', row: 'Behind the garage door', low: 'The low point' }[m.kind] || '' };
        shots.push({ d: 1.5, card: { kicker: lowT.name, title: lowT.role }, p: [0, 1, 5], l: [0, 1, 0] });
        if (['win', 'podium', 'first', 'low'].includes(m.kind) && W) {
          const good = m.kind !== 'low'; k.at(0, 0, 0);
          shots.push(...k.shots([{ d: 5, cut: 'dip', p: good ? [3.8, 2.2, 4.6] : [-0.6, 2.0, 5.4], l: [0, 1.8, -0.3], p2: good ? [-2.6, 2.0, 4.2] : [0.2, 1.95, 4.4], f: good ? 26 : 20, e: 'lin', shake: good ? 0.7 : 0.15, low: lowT, on: () => { W.up.forEach((a) => { if (a) { a.g.visible = good; a.bounce = good ? 1 : 0; } }); W.dn.forEach((a) => { if (a) a.g.visible = !good; }); }, sub: say('', m.text || '', '#ffffff'), sfx: good ? (au) => au.play?.('crowd', { gain: 0.5 }) : null }]));
        } else if (G) {
          k.at(0, 0, 90);
          const row = m.kind === 'row', stop = m.kind === 'stop';
          shots.push(...k.shots([{ d: 5, cut: 'dip', p: row ? [6.6, 1.6, 6.2] : stop ? [3.4, 0.6, 4.4] : [-5, 1.3, 8.6], l: row ? [3.85, 1.5, 3.3] : stop ? [1.2, 0.5, 1.9] : [0, 0.9, 0.5], p2: row ? [5.8, 1.6, 5.6] : stop ? [2.6, 0.55, 3.4] : [-2.8, 1.2, 7.8], f: row ? 16 : stop ? 20 : 22, e: 'lin', shake: row ? 0.4 : 0.1, low: lowT, on: () => { G.da.g.visible = G.db.g.visible = row; G.crew.forEach((c) => { if (c) c.work = stop ? 1 : 0.6; }); }, sub: say('', m.text || '', '#ffffff') }]));
        }
      });
      // the end: the place it finished, cast on a plate under one lamp
      k.at(0, 0, 180); const St = SETS.studio(k, T, {}); void St;
      const tint = (ctx.pos || 9) === 1 ? '#d9b04a' : (ctx.pos || 9) <= 3 ? '#c9ccd1' : '#b0703a';
      k.box(0.5, 1.0, 0.5, k.m('#111318', 0.3, 0.4), 0, 0.5, 1.2); const plate = k.cyl(0.3, 0.3, 0.03, k.m(tint, 0.22, 0.95), 0, 1.36, 1.2, 40); plate.rotation.x = PI / 2 - 0.2; k.sign(0.34, 0.2, k.letters([[`P${ctx.pos ?? '?'}`, 120, '#111318', 900]], null), 0, 1.37, 1.222, 0, 256, { transparent: true }).rotation.x = -0.2;
      shots.push(...k.shots([{ d: 6, cut: 'dip', p: [1.3, 1.5, 3.4], l: [0, 1.36, 1.2], p2: [-1.1, 1.45, 3.2], arc: [0, 0, 0.5], f: 20, e: 'io', shake: 0.03, focus: [0, 1.36, 1.2], sub: [say('', `P${ctx.pos ?? '?'} in the constructors'. ${VER[ctx.verdict] || ''}`, '#ffffff'), ctx.champ ? say('', `${ctx.champ} is champion${ctx.champTeam ? `; ${ctx.champTeam} take the constructors'` : ''}.`, '#cfd6e4') : null].filter(Boolean) }]));
      shots.push({ d: 2.6, card: { kicker: T.name, title: `Season ${(ctx.season || 0) + 1}`, sub: 'It starts again.' }, p: [0, 1, 5], l: [0, 1, 0] });
      k.at(0, 0, 0);
      return { shots };
    } };
}

/**
 * 31. The documentary's episode (after the rounds that mattered): people in a chair, saying what they would not say
 * to you; the garage between them; and your own turn in the chair. ctx: { ep, name (the episode's), heads: [{ name,
 * role, team: { name, color }, driver (true: race suit), line }] (two to four), vo (a journalist's line over the
 * garage), you: { q, opts: [{ id, label, line }] }, next (track) }. -> picks.you
 */
export function documentary(ctx) {
  const { T, D } = base(ctx), H = (ctx.heads && ctx.heads.length ? ctx.heads : [{ name: D[0].name, role: T.name, team: T, driver: true, line: 'People think you get used to it. You do not get used to it.' }, { name: 'Marta Voss', role: 'The Paddock Wire', team: { name: 'Press', color: '#8a8f98' }, line: `Nobody at ${T.name} will say it on the record. So I will.` }]).slice(0, 4);
  const Y = ctx.you || { q: 'How would you describe the last month?', opts: [{ id: 'calm', label: 'Measured', line: 'We are exactly where the work says we should be.' }, { id: 'fire', label: 'Defiant', line: 'Write us off. Please. I enjoy it.' }, { id: 'raw', label: 'Honest', line: 'It has been hard. Harder than I let them see.' }] };
  return { id: 'documentary', kicker: `Pit Wall · Episode ${ctx.ep || 1}`, title: `"${ctx.name || 'The Handshake'}"`, accent: T.color, bg: '#040507', exposure: 1.0, grade: 'doc', needsCar: true, fill: 0.5,
    build(k) {
      k.env(0.5);
      const shots = [], chairs = [];
      H.forEach((h, i) => { k.at(i * 40, 0, 0); const St = SETS.studio(k, h.team || T, { color: (h.team || T).color }); const a = seated(k.person(h.driver ? drv(h, h.team || T, 'sitLean', { cap: false }) : (h.team && h.team.name !== 'Press' ? { ...staff(h.name, h.team, 'sitArm') } : suit(h.name, 'sitArm', h.female ? { figure: 'f', build: 'slim' } : {})), St.seat.slice(0, 3), St.seat[3]), 1.27); if (a) a.look = { x: i * 40 + 1.4, y: 1.3, z: 3 }; chairs.push(a); });
      k.at(0, 0, 90); const G = SETS.garage(k, T, { night: true }); k.car(carOf(T, D[0]), G.car, 0); const gc = [k.crew({ color: T.color, accent: T.color2, pose: 'gun', work: 1 }, [1.35, 0, 1.9], -PI / 2), k.crew({ color: T.color, accent: T.color2, pose: 'steady', work: 0.4 }, [-1.3, 0, -0.6], PI / 2)]; void gc;
      const broll = k.shots([{ d: 5, cut: 'dip', p: [-5.2, 1.1, 8.8], l: [0, 0.9, 0.6], p2: [-2.4, 1.0, 8.0], f: 20, e: 'lin', shake: 0.1, dof: 0.7, sub: ctx.vo ? say(ctx.vo.who || 'Narrator', ctx.vo.line, '#cfd6e4') : null }, { d: 3.4, p: [2.5, 0.38, 0.5], l: [1.0, 0.5, 1.8], p2: [2.2, 0.42, 0.2], f: 20, shake: 0.12 }]);
      k.at(160, 0, 0); const Sy = SETS.studio(k, T, {}); const you = seated(k.person(youOpts(T, 'sitLean'), Sy.seat.slice(0, 3), Sy.seat[3]), 1.27); you.look = { x: 161.4, y: 1.3, z: 3 };
      const head = (i, o = {}) => { const h = H[i]; k.at(i * 40, 0, 0); return k.shots([{ d: 4.4, cut: o.cut, p: [o.tight ? 0.9 : 1.5, 1.3, o.tight ? 2.3 : 3.3], l: [o.tight ? 0.0 : -0.35, 1.26, 0], p2: [o.tight ? 0.8 : 1.35, 1.3, o.tight ? 2.1 : 3.0], f: o.tight ? 15 : 22, shake: 0.04, low: o.low === false ? null : { name: h.name, role: h.role, c: (h.team || T).color }, sub: say(surname(h.name), o.line || h.line, (h.team || T).color) }])[0]; };
      shots.push(head(0, { tight: true, low: false }));
      shots.push({ d: 2.6, card: { kicker: `Pit Wall · Episode ${ctx.ep || 1}`, title: `"${ctx.name || 'The Handshake'}"` }, p: [0, 1, 5], l: [0, 1, 0] });
      if (H[1]) shots.push(head(1, { cut: 'dip' }));
      shots.push(...broll);
      if (H[2]) shots.push(head(2, { cut: 'dip' }));
      if (H[3]) shots.push(head(3, { tight: true }));
      k.at(160, 0, 0);
      shots.push(...k.shots([
        { d: 3, cut: 'dip', p: [1.5, 1.3, 3.3], l: [-0.35, 1.26, 0], p2: [1.35, 1.3, 3.0], f: 22, shake: 0.04, low: { name: 'Team principal', role: T.name }, sub: say('Off camera', Y.q, '#cfd6e4'), ask: { id: 'you', prompt: 'Your answer, on camera', time: 7, def: Y.opts[0].id, options: Y.opts.map((x) => ({ id: x.id, label: x.label })) } },
        { d: 4, p: [0.9, 1.3, 2.3], l: [0, 1.26, 0], p2: [0.8, 1.3, 2.05], f: 15, shake: 0.05, sub: (r) => say(YOU_, (Y.opts.find((x) => x.id === r.picks.you) || Y.opts[0]).line, '#ffffff') },
      ]));
      shots.push({ d: 2.6, card: { kicker: 'Next time', title: ctx.next || 'The next race' }, p: [0, 1, 5], l: [0, 1, 0] });
      k.at(0, 0, 0);
      return { shots };
    } };
}

/**
 * 30. The trophy room: what the team has won under you, to walk round. ctx: { items: [{ kind, title, text, kicker,
 * tint, paint }] } (career/ManagerStory.js trophies)
 */
export function trophies(ctx) {
  const { T } = base(ctx), items = ctx.items && ctx.items.length ? ctx.items : [{ kind: 'board', kicker: 'Nothing yet', title: 'An empty room', text: 'The first plinth is waiting.' }];
  return { id: 'trophies', kicker: T.name, title: 'The trophy room', accent: '#d9b04a', bg: '#07080b', exposure: 1.0, grade: 'gold', fill: 0.3,
    build(k) { k.env(0.9, 0.3); const A = SETS.trophyRoom(k, T, items); return { shots: [], browse: A.stations }; } };
}

export const SET_PIECES = { launch, factoryTour, pitwallReact, garageNight, signing, sacked, released, decider, cooldownRoom, seasonReview, documentary, trophies };
