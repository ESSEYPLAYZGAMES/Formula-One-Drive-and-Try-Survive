// The cutscenes (ui/Cine.js plays them, ui/CineSets.js is where they are shot). Each is a function of what really
// happened - ctx, plain data from the career (career/ManagerStory.js makes it) - and returns a scene: its title card, its
// set, its shots, its lines. Nothing here reads or changes the career: what you answer or do in a scene comes back from
// playCine ({ choice, picks, qte }) and the story applies it.
// ctx everywhere: { T: { name, color, color2, livery }, season, round, track, drivers: [{ name, short, number, helmet }] }.
// The set pieces are here; the drama's scenes are in CineScenes2.js.
import * as SETS from './CineSets.js';
import { paintTable, paintHeadline, paintIncident } from './CineSets.js';

const PI = Math.PI;
export const surname = (n) => String(n || '').trim().split(/\s+/).pop() || '';
/** people's options (world/People.js): a driver in the team's race suit, staff in its polo, someone in a jacket */
export const drv = (d, T, pose = 'talk', ex = {}) => ({ pose, kit: 'suit', color: T.color, accent: T.color2 || '#ffffff', cap: true, driver: d.name, teamName: T.name, ...ex });
export const staff = (name, T, pose = 'talk', ex = {}) => ({ pose, kit: 'polo', color: T.color, accent: T.color2 || '#ffffff', teamName: T.name, seed: `staff|${name}`, build: 'average', ...ex });
export const suit = (name, pose = 'talk', ex = {}) => ({ pose, kit: 'jacket', color: '#1c2333', accent: '#e9e9ec', legs: '#1a1c22', seed: `suit|${name}`, build: 'average', ...ex });
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
  return { id: 'launch', kicker: `${T.name} · Season ${ctx.season || ''}`, title: 'The new car', sub: 'Launch night', accent: T.color, bg: '#040508', fog: [18, 46], exposure: 1.05, needsCar: true, sound: { name: 'crowd', gain: 0.18 },
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

export const SCENES = { launch };
