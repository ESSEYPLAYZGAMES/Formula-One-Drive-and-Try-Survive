// The build-up to a race, as the broadcast shows it (skippable: SKIP, Enter, Space, Esc). After a death in the race
// before: the grid's memorial first - the driver's helmet on a black plinth ahead of pole, flowers and candles, a
// banner - and the crowd's banners in the grandstand. Then race day: the helicopter over the circuit, the fans (a block
// of them in full detail in the front rows - flags, caps, team colours - for the show only), the grandstand, the grid
// with the mechanics (and umbrellas by day), a reporter's grid walk, a celebrity guest touching a car, a quick
// interview, and you on the grid. The stars at the race (career/Celebs.js: your partner, if she came, beside your car;
// the others by a front-row car and mid-grid) stand about the grid in their own looks, ready for the grid walk to
// talk to. Everything built for it is taken away after it - or, for WALK THE GRID, handed on to ui/GridWalk.js as it
// stands (dispose() when that is over). The reporter, the guests and the stars are all made up.
// Laid out on the flat plan like the race; on a circuit that is not flat everything is stood on the ground under it
// (world/Terrain.js: TERRAIN.at), and the shots are aimed on the flat - this.look, the point the camera is aimed at (y:
// its height over the ground there), is what main.js lifts the camera with.
import * as THREE from 'three';
import { TERRAIN } from '../world/Terrain.js';
import { makePerson, makeMic, makeHelmet } from '../world/People.js';
import { tribute, clothBanner, standBanners, disposeGroup } from '../world/Tribute.js';
import { Crowd, crowdTime } from '../world/Crowd.js';
import { CrowdLife } from '../world/CrowdLife.js';
import { CELEB, celebsAtRace, partnerAtRace, celebLook, styledLook } from '../career/Celebs.js';

const CSS = `
#prerace { position: fixed; inset: 0; z-index: 44; pointer-events: none; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #fff; }
#prerace .bug { position: absolute; left: 3vw; top: 4vh; display: flex; height: 32px; box-shadow: 0 2px 10px rgba(0,0,0,.45); }
#prerace .bug b { background: #e10600; padding: 0 12px; display: flex; align-items: center; font: 900 16px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; }
#prerace .bug i { background: rgba(10,12,18,.85); padding: 0 12px; display: flex; align-items: center; font: 700 12.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; font-style: normal; }
#prerace .lower { position: absolute; left: 3vw; bottom: 9vh; transform: translateX(-120%); transition: transform .6s cubic-bezier(.2,.8,.2,1); }
#prerace .lower.in { transform: none; }
#prerace .lower .tab { display: inline-block; background: #e10600; padding: 5px 10px; font: 800 11.5px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .18em; }
#prerace .lower .main { background: rgba(10,12,18,.88); padding: 10px 14px 4px; font: 800 clamp(20px, 2.4vw, 30px)/1.15 'Segoe UI', Arial, sans-serif; }
#prerace .lower .sub { background: rgba(10,12,18,.88); padding: 0 14px 10px; font: 500 14px/1.3 'Segoe UI', Arial, sans-serif; color: #c9ced8; }
#prerace.mem .lower .tab { background: #3b3b3b; } #prerace.mem .lower .main { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; letter-spacing: .04em; }
#prerace .cc { position: absolute; left: 50%; bottom: 3.5vh; transform: translateX(-50%); max-width: 70vw; background: rgba(0,0,0,.7); padding: 6px 12px; font: 600 16px/1.35 'Segoe UI', Arial, sans-serif; opacity: 0; transition: opacity .3s; text-align: center; }
#prerace .cc.in { opacity: 1; }
#prerace .btns { position: absolute; right: 3vw; top: 4vh; display: flex; gap: 8px; pointer-events: auto; }
#prerace .btns button { background: rgba(10,12,18,.7); color: #fff; border: 1px solid rgba(255,255,255,.3); border-radius: 6px; padding: 9px 14px; font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; cursor: pointer; }
#prerace .btns button.walk { background: #e10600; border-color: #e10600; }
#prerace .black { position: absolute; inset: 0; background: #000; opacity: 1; transition: opacity .9s ease; }
`;
const pick = (a) => a[(Math.random() * a.length) | 0];
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// (made-up guests and reporter; the women who used to be guests here are stars of career/Celebs.js now)
const GUESTS = [['Jonah Reese', 'Actor'], ['Dex Okoro', 'Footballer'], ['Theo Quinn', 'Comedian'], ['Kai Brennan', 'Tennis champion']];
const REPORTER = ['Martin Hale', 'Pit-lane reporter'];

export class PreRace {
  /**
   * o: { scene, camera, track, stands, pit, cars (the race's, on their grid slots), player, trackName, night, weather,
   *      memorial: [{ name, number, team, color, helmet }], returning, audio, strings(on), walk (offer WALK THE GRID),
   *      career (the Career, or null in a quick race), trackId, onDone(walk) }
   */
  constructor(o) {
    Object.assign(this, o);
    this.t = 0; this.done = false; this.look = new THREE.Vector3(); this.group = new THREE.Group(); this.people = []; this.anims = []; this.crew = new Map(); this.mourners = [];
    const tr = this.track, cars = [...this.cars].sort((a, b) => (a.gridPos || 99) - (b.gridPos || 99)), hw = tr.halfWidth;
    this.grid = cars; this.pole = cars[0];
    const f0 = tr.sample(this.pole.s, 0); this.fwd = new THREE.Vector3(f0.tx, 0, f0.tz); this.left = new THREE.Vector3(f0.tz, 0, -f0.tx);   // (track-forward, and its left)
    const P = (c) => new THREE.Vector3(c.x, 0, c.z);
    this.front = P(this.pole); this.look.copy(this.front).setY(1);
    const facing = (dx, dz) => Math.atan2(-dz, dx);
    // (by night the TV crews' lamps: a little of each person's own colour as fill, so faces don't go to black - no extra lights)
    const lift = (p) => { if (this.night) for (const k in p.mats) { const m = p.mats[k]; if (m.emissive && m.color) m.emissive.copy(m.color).multiplyScalar(0.2); } };
    const add = (p, x, z, face, y = 0) => { lift(p); p.group.position.set(x, y + TERRAIN.at(x, z), z); p.group.rotation.y = face; this.group.add(p.group); this.people.push(p); return p; };   // (y: over the ground there)
    const teamsCol = [...new Set(cars.map((c) => c.color))];

    // ---- the memorial ahead of pole: a black plinth with the helmet(s), a banner behind, flowers and candles round it
    const M = this.memorial || [];
    this.mem = null;
    if (M.length) {
      const c0 = this.front.clone().addScaledVector(this.fwd, 30), g0 = TERRAIN.at(c0.x, c0.z), g = this.group, black = new THREE.MeshStandardMaterial({ color: '#16161a', roughness: 0.3, metalness: 0.2, emissive: '#2a1c0c', emissiveIntensity: 0.35 });
      const w = Math.max(1.4, M.length * 0.9);
      // (its top 1 m over the ground at its middle; on a slope 0.4 m more of it under the ground, so no edge stands off it)
      const sink = TERRAIN.on ? 0.4 : 0, pl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0 + sink, w), black); pl.position.copy(c0).setY(g0 + (1.0 - sink) / 2); pl.rotation.y = facing(this.fwd.x, this.fwd.z); g.add(pl);
      M.forEach((m, i) => {
        const hel = makeHelmet(m.helmet || '#ffffff', m.color || '#888', m.number ?? '', { driver: m.name }); hel.scale.setScalar(2.1);
        const off = (i - (M.length - 1) / 2) * 0.85; hel.position.copy(c0).addScaledVector(this.left, off).setY(g0 + 1.0 + 0.3); hel.rotation.y = facing(-this.fwd.x, -this.fwd.z) + 0.4; g.add(hel);
      });
      const first = (n) => n.split(' ')[0], last = (n) => n.split(' ').pop();
      const ban = clothBanner(M.length > 1 ? ['FOREVER', M.map((m) => last(m.name).toUpperCase()).join(' · ')] : [`FOREVER #${M[0].number ?? ''}`, last(M[0].name).toUpperCase()], M[0].color || '#333', 4.2, 1.15);
      ban.position.copy(c0).addScaledVector(this.fwd, 1.3); ban.position.y = 2.0 + TERRAIN.at(ban.position.x, ban.position.z); ban.lookAt(ban.position.clone().addScaledVector(this.fwd, -10)); g.add(ban);
      const at = (along, lat, y) => { const v = c0.clone().addScaledVector(this.left, along).addScaledVector(this.fwd, -0.7 - lat); return v.setY(y + TERRAIN.at(v.x, v.z)); };
      this.flames = tribute(g, at, 70, 1.6, 2.6, 22);
      // the grid's drivers and the teams, standing back from it, heads bowed
      for (let n = 0; n < 12; n++) {
        const side = n % 2 ? 1 : -1, k = n >> 1, a = 0.5 + k * 0.17, r = 3.6 + (k % 2) * 0.9 + Math.random() * 0.3;
        const pos = c0.clone().addScaledVector(this.fwd, -Math.cos(a) * r * 0.75 - 0.6).addScaledVector(this.left, side * Math.sin(a) * r * 1.25), c = cars[n % cars.length];
        const mo = add(makePerson({ pose: 'mourn', kit: n < 6 ? 'suit' : 'polo', color: c.color, accent: c.color2, driver: n < 6 ? c.name : null, jitter: 0.02, detail: 0.7 }), pos.x, pos.z, facing(c0.x - pos.x, c0.z - pos.z) + (Math.random() - 0.5) * 0.25);
        mo.driverName = n < 6 ? c.name : null; mo.busy = true; this.mourners.push(mo);   // (busy: heads stay bowed)
      }
      const Ds = M.map((m) => ({ first: first(m.name), last: last(m.name), number: m.number, color: m.color || '#333' }));
      this.bannerAt = standBanners(g, this.stands?.stands, c0, Ds, 6);
      this.mem = { c0, names: M.map((m) => m.name), list: M };
    }

    // ---- the fans: the grandstand nearest the grid (its name for the captions). Every stand in shot is filled with
    //      people in full 3D by main.js (world/StandCrowds.js) for the whole of the show
    this.stand = (this.stands?.stands || []).map((p) => ({ p, d: Math.hypot(p.x - this.front.x, p.z - this.front.z) })).sort((a, b) => a.d - b.d)[0]?.p || null;

    // ---- the grid: mechanics at the front ten cars and yours, umbrellas over them by day
    const gridCars = cars.slice(0, 10); if (this.player && !gridCars.includes(this.player)) gridCars.push(this.player);
    for (const c of gridCars) {
      const p = P(c), fw = new THREE.Vector3(Math.cos(c.th), 0, Math.sin(c.th)), lf = new THREE.Vector3(Math.sin(c.th), 0, -Math.cos(c.th));
      for (const s of [-1, 1]) {
        const m = p.clone().addScaledVector(fw, 2.0 + Math.random() * 0.4).addScaledVector(lf, s * 1.45);
        // (your own car's two in full detail - one of them talks to you in the grid walk; the rest join the crowd, which
        //  draws hundreds of people in a few draw calls: _gridCrowd)
        if (c !== this.player) { (this._lateCrew || (this._lateCrew = [])).push({ c, x: m.x, z: m.z, face: facing(p.x - m.x, p.z - m.z) + (Math.random() - 0.5) * 0.6 }); continue; }
        const mech = add(makePerson({ pose: Math.random() < 0.5 ? 'talk' : 'mourn', kit: 'polo', color: c.color, accent: c.color2, jitter: 0.03, cap: Math.random() < 0.5, detail: 0.5 }), m.x, m.z, facing(p.x - m.x, p.z - m.z) + (Math.random() - 0.5) * 0.6);
        if (!this.crew.has(c)) this.crew.set(c, []); this.crew.get(c).push(mech);
      }
      if (!this.night) {
        const u = p.clone().addScaledVector(fw, 0.1).addScaledVector(lf, 1.35);
        const hold = add(makePerson({ pose: 'flag', kit: 'polo', color: c.color, jitter: 0.02, detail: 0.45 }), u.x, u.z, facing(fw.x, fw.z));
        const pivot = new THREE.Group(); pivot.position.copy(hold.wrR); hold.group.children[0].add(pivot);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.0, 6), new THREE.MeshStandardMaterial({ color: '#d9dce2' })); pole.position.y = 0.35; pivot.add(pole);
        const can = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.38, 16, 1, true), new THREE.MeshStandardMaterial({ color: c.color, side: THREE.DoubleSide, roughness: 0.7 })); can.position.y = 0.95; pivot.add(can);
        pivot.rotation.x = -0.35;   // (tilted over the cockpit)
      }
    }
    // ---- the guests and the reporter
    const g2 = shuffle(GUESTS); this.guestA = g2[0]; this.guestB = g2[1];
    const cA = cars[Math.min(2, cars.length - 1)], pA = P(cA), fA = new THREE.Vector3(Math.cos(cA.th), 0, Math.sin(cA.th)), lA = new THREE.Vector3(Math.sin(cA.th), 0, -Math.cos(cA.th));
    const gpos = pA.clone().addScaledVector(fA, -0.7).addScaledVector(lA, 1.12);
    this.celeb = add(makePerson({ pose: 'reach', kit: 'jacket', color: pick(['#2b2e35', '#5a2e2e', '#1c2a44', '#e9e6e1']), jitter: 0.01 }), gpos.x, gpos.z, facing(-lA.x, -lA.z));
    this.celebCar = cA;
    const cB = cars[Math.min(5, cars.length - 1)], pB = P(cB), lB = new THREE.Vector3(Math.sin(cB.th), 0, -Math.cos(cB.th)), fB = new THREE.Vector3(Math.cos(cB.th), 0, Math.sin(cB.th));
    const ip = pB.clone().addScaledVector(lB, -2.6).addScaledVector(fB, 1.2), rp = ip.clone().addScaledVector(fB, 0.95);
    this.guest = add(makePerson({ pose: 'talk', kit: 'jacket', color: pick(['#3a3f48', '#4a1f3a', '#20354a']), jitter: 0.01 }), ip.x, ip.z, facing(rp.x - ip.x, rp.z - ip.z));
    this.rep = add(makePerson({ pose: 'reach', kit: 'jacket', color: '#1b2a4a', accent: '#e10600', jitter: 0.01 }), rp.x, rp.z, facing(ip.x - rp.x, ip.z - rp.z));
    const mic = makeMic('#e10600', 'F1 LIVE'); mic.position.copy(this.rep.wrR).add(new THREE.Vector3(0.06, 0.08, 0)); mic.rotation.z = 0.5; this.rep.group.children[0].add(mic);
    this.ipos = ip; this.rpos = rp;
    // the grid walk: a second reporter walking down the middle of the grid, past the cars
    this.walker = add(makePerson({ pose: 'talk', kit: 'jacket', color: '#1b2a4a', accent: '#e10600', jitter: 0.01 }), this.front.x, this.front.z, 0);
    const wm = makeMic('#e10600', 'F1 LIVE'); wm.position.copy(this.walker.wrR).add(new THREE.Vector3(0.02, 0.25, 0)); wm.rotation.z = Math.PI / 2; this.walker.group.children[0].add(wm);
    const lastC = cars[Math.min(9, cars.length - 1)];
    this.walkA = tr.sample(this.pole.s + 2, 0); this.walkB = tr.sample(lastC.s, 0);
    // ---- back from injury: the returning driver by their car, talking to the pit-lane reporter (the comeback)
    this.back = null;
    const RT = this.returning || [];
    if (RT.length) {
      const r0 = RT[0], car = cars.find((c) => c.name === r0.name);
      if (car) {
        const pC = P(car), fw = new THREE.Vector3(Math.cos(car.th), 0, Math.sin(car.th)), lf = new THREE.Vector3(Math.sin(car.th), 0, -Math.cos(car.th));
        const dp = pC.clone().addScaledVector(fw, 3.9).addScaledVector(lf, -1.7), rp = pC.clone().addScaledVector(fw, 3.9).addScaledVector(lf, -2.75);
        const drv = add(makePerson({ pose: 'talk', kit: 'suit', color: car.color, accent: car.color2, driver: car.name, jitter: 0.01, detail: 0.9 }), dp.x, dp.z, facing(rp.x - dp.x, rp.z - dp.z));
        const rep2 = add(makePerson({ pose: 'reach', kit: 'jacket', color: '#1b2a4a', accent: '#e10600', jitter: 0.01 }), rp.x, rp.z, facing(dp.x - rp.x, dp.z - rp.z));
        const mic2 = makeMic('#e10600', 'F1 LIVE'); mic2.position.copy(rep2.wrR).add(new THREE.Vector3(0.06, 0.08, 0)); mic2.rotation.z = 0.5; rep2.group.children[0].add(mic2);
        drv.busy = true; this.back = { r0, car, drv, rep2, dp, rp };
        // (the camera's spot and the line to them kept clear of the crowd)
        const mid = dp.clone().lerp(rp, 0.5), ax = rp.clone().sub(dp).normalize(), perp = new THREE.Vector3(-ax.z, 0, ax.x);
        this._clear = [0.8, 1.6, 2.4, 3.2].map((k) => mid.clone().addScaledVector(perp, k));
      }
    }
    // ---- the stars (before the crowd, which keeps off the spots they stand on)
    this._stars(cars, hw, add);
    this._gridCrowd(cars, hw);
    this.scene.add(this.group);

    // ---- the running order
    const plan = [];
    if (this.mem) plan.push(['memorial', 10], ['banners', 6]);
    if (this.back) plan.push(['return', 10]);
    plan.push(['aerial', 5.5], ['fans', 5.5], ['stands', 4], ['grid', 5], ['walk', 6.5], ['celeb', 4.5], ['interview', 7.5]);
    if (this.player) plan.push(['you', 5]);
    let at = 0; this.plan = plan.map(([k, d]) => { const s = { k, t0: at, dur: d }; at += d; return s; }); this.total = at + 0.8;
    this._dom();
    // the crowd (quiet under the memorial), the strings for it
    this.crowd = this.audio?.play?.('crowd', { loop: true, gain: this.mem ? 0.05 : 0.32, offset: 'random', fadeIn: 1.5 });
    if (this.mem) this.strings?.(true);
    this._key = (e) => { if (e.code === 'Enter' || e.code === 'Escape' || e.code === 'Space') { e.preventDefault(); this.finish(); } };
    window.addEventListener('keydown', this._key, true);
    this.fov0 = this.camera.fov;
  }

  /**
   * The grid's edges: inside the track's own walls at each point, m metres in -> { wallOf(i, side), edge(x, z, m) ->
   * { ok, d, s } } (this.edge, which the grid walk keeps to as well)
   */
  _edges(hw) {
    if (this._E) return this._E;
    const tr = this.track, tq = {};
    // (the pit lane's side: its own wall, the pit wall, is nearer than the circuit's barrier on the other side)
    const PL = this.pit, wallOf = (i, side) => { if (PL?.wallD && side === PL.sideSign) { for (let k = 0; k < 12; k++) for (const j of [i + k, i - k]) { const v = PL.wallD[((j % tr.n) + tr.n) % tr.n]; if (isFinite(v)) return Math.min(v, hw + 0.6); } return hw + 0.6; } return tr.wallAt(i, side); };   // (no pit wall found near: the pit entry or exit road is there - keep to the track)
    const edge = (x, z, m) => { const q = tr.nearest(x, z, -1, tq), w = wallOf(q.i, q.d >= 0 ? 1 : -1), lim = (isFinite(w) && w > 1 ? Math.min(w, hw + 4) : hw) - m; return { ok: Math.abs(q.d) < lim, d: q.d, s: q.s }; };
    this.edge = edge;
    return (this._E = { wallOf, edge });
  }

  /**
   * The celebrities at the race (career/Celebs.js celebsAtRace: your partner and anyone you invited, then two or three
   * in all; a quick race, two at random), each in her own look (celebLook): she came for you - beside your car, inside
   * the walls, facing where you set off from; the others by a front-row car and one mid-grid. Never on the cars, the
   * people already placed, the spots the grid walk puts the drivers and your team in, the comeback's or the memorial's.
   * A stand-in's weekend: she is a guest like the others. window.__forceStars (a list of ids, or 'id,id') picks them
   * (tests). -> this.stars [{ id, name, job, person, at, car, partner }]
   */
  _stars(cars, hw, add) {
    const out = (this.stars = []), C = this.career || null, me = this.player || null, { edge } = this._edges(hw);
    let ids = [], f = null;
    try { f = window.__forceStars; } catch (_) { /* (no window: none forced) */ }
    const forced = f ? (Array.isArray(f) ? f : String(f).split(',')).map((s) => String(s).trim()).filter((id) => CELEB[id]) : [];
    if (forced.length) ids = [...new Set(forced)].slice(0, 3);
    else { try { ids = celebsAtRace(C, this.trackId || this.track.def?.id || null) || []; } catch (e) { console.warn('PreRace: the stars', e); ids = []; } }
    if (!ids.length || !cars.length) return out;
    const stand = !!C && !!me && me.careerId != null && me.careerId !== C.playerId;
    let mine = null; if (C && me && !stand) { try { mine = partnerAtRace(C); } catch (e) { mine = null; } }
    const atCar = (c, u, v) => [c.x + Math.cos(c.th) * u + Math.sin(c.th) * v, c.z + Math.sin(c.th) * u - Math.cos(c.th) * v];
    const facing = (dx, dz) => Math.atan2(-dz, dx);
    const F = this.fwd, fr = this.front, c0 = this.mem?.c0, end = cars[cars.length - 1], along0 = (end.x - fr.x) * F.x + (end.z - fr.z) * F.z;
    // (kept for others: the drivers' spots and your team's in the grid walk, where you set off from, the comeback's)
    const keep = cars.map((c) => [...atCar(c, -1.3, -1.45), 1.0]);
    if (me) for (const [u, v] of [[-1.0, 2.9], [1.2, 3.1], [0, 1.9], [-0.5, 1.9]]) keep.push([...atCar(me, u, v), 1.0]);
    for (const q of this._clear || []) keep.push([q.x, q.z, 1.2]);
    const clear = (x, z) => {
      const a = (x - fr.x) * F.x + (z - fr.z) * F.z; if (a > (c0 ? 24 : 12) || a < along0 - 10) return false;
      const e = edge(x, z, 0.7); if (!e.ok || Math.abs(e.d) < 0.85) return false;
      if (c0 && Math.hypot(x - c0.x, z - c0.z) < 4.8) return false;
      for (const c of cars) { const dx = x - c.x, dz = z - c.z, ca = Math.cos(c.th), sa = Math.sin(c.th), u = dx * ca + dz * sa, v = -dx * sa + dz * ca; if (Math.abs(u) < 3.35 && Math.abs(v) < 1.5) return false; }
      for (const p of this.people) if ((x - p.group.position.x) ** 2 + (z - p.group.position.z) ** 2 < 1.0) return false;
      for (const [kx, kz, r] of keep) if ((x - kx) ** 2 + (z - kz) ** 2 < r * r) return false;
      return true;
    };
    // (where to stand round a car, in the car's frame: along it, and to its left)
    const NEAR_YOU = [[0.6, -2.6], [1.6, -2.5], [-0.5, -2.7], [2.6, -2.3], [0.6, -3.4], [3.6, 1.2], [-3.6, 1.2], [2.4, 2.6]];
    const BY_CAR = [[0.9, 2.5], [0.9, -2.6], [-0.4, 2.7], [2.3, 2.4], [2.4, -2.4], [-0.4, -2.8], [3.7, 0.9], [3.7, -0.9]];
    const spotAt = (c, offs) => { for (const [u, v] of offs) { const [x, z] = atCar(c, u, v); if (clear(x, z)) return [x, z]; } return null; };
    // (the cars to stand by: a front row one, then mid-grid - never yours (hers, if she came for you), the guests' or the reporter's)
    const used = new Set([me, this.celebCar, cars[Math.min(5, cars.length - 1)]]);
    const FRONT = [cars[1], cars[0], cars[3]], MID = [cars[6], cars[7], cars[4], cars[8], cars[9], cars[3]];
    let k = 0;
    for (const id of ids) {
      const K = CELEB[id]; if (!K) continue;
      const hers = !!me && id === mine;
      let at = hers ? spotAt(me, NEAR_YOU) : null, car = at ? me : null;
      if (!at) for (const c of k++ % 2 ? [...MID, ...FRONT] : [...FRONT, ...MID]) { if (!c || used.has(c)) continue; at = spotAt(c, BY_CAR); if (at) { car = c; break; } }
      if (!at) continue;
      used.add(car);
      // (she faces where you set off from, if she came for you; else the car, more or less)
      const [tx, tz] = hers && car === me ? atCar(me, -0.5, 1.9) : [car.x, car.z];
      let p = null;
      // (dressed for race day: a night race's look dressier, a wet one's under a coat)
      const dress = { occasion: 'grid', night: !!this.night, wet: !!this.weather && this.weather !== 'dry', track: this.trackId || this.track.def?.id || null, vary: C ? `${C.season || 0}.${C.round || 0}` : Math.floor(Date.now() / 864e5) };
      // (someone you are seeing in the looks the two of you planned (LIFE › Style); a quick race: her own)
      const lookOf = (o) => (C ? styledLook(C, K, o) : celebLook(K, o));
      try { p = add(makePerson(lookOf(this.mem ? { ...dress, pose: 'talk' } : dress)), at[0], at[1], facing(tx - at[0], tz - at[1]) + (hers ? 0 : (Math.random() - 0.5) * 0.8)); } catch (e) { console.warn('PreRace: a star', id, e); continue; }
      this._keyLit(p);
      out.push({ id, name: K.name, job: K.job, person: p, at: new THREE.Vector3(at[0], 0, at[1]), car, partner: hers });
    }
    return out;
  }
  /**
   * By night a star in the TV crews' key light (p: her person), once as she is built: a share more of each of her own
   * colours than the crowd's fill (lift in the constructor: 0.2), the more the darker it is - her face (its paint), her
   * skin by her skin's own darkness, her dress by its - so deep skin, her makeup and a dark dress read under the
   * floodlights while a pale one is barely changed; never more than half her own colour: nothing washed out
   */
  _keyLit(p) {
    if (!this.night || !p?.mats) return;
    const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b, sm = (x) => { const t = Math.max(0, Math.min(1, (x - 0.08) / 0.42)); return t * t * (3 - 2 * t); };
    const sk = p.mats.skin?.color ? lum(p.mats.skin.color) : 0.4;
    for (const k in p.mats) { const m = p.mats[k]; if (!m?.emissive || !m.color) continue; const l = k === 'face' || k === 'skin' ? sk : lum(m.color); m.emissive.copy(m.color).multiplyScalar(0.24 + 0.24 * (1 - sm(l))); }
  }

  /**
   * The grid as busy as it really is: round every car its crew in the team's kit, guests and VIPs in groups (lanyards,
   * phones up), photographers, TV crews at the front - alive (world/CrowdLife.js: talking, filming, selfies, walking
   * about) - and the tyre blankets on. The middle of the grid is kept as a walkway (the reporter's walk, the crowd's
   * comings and goings, yours), as are the spots the grid walk puts the drivers and your team in (ui/GridWalk.js).
   * The edges are the track's own walls at each point, not a line from pole. -> this.life
   */
  _gridCrowd(cars, hw) {
    const occ = [], tr = this.track, tq = {};
    for (const p of this.people) occ.push({ x: p.group.position.x, z: p.group.position.z, r: 0.75 });
    for (const q of this._clear || []) occ.push({ x: q.x, z: q.z, r: 1.1 });
    // (and a little room round each star, for whoever comes over to talk to her)
    for (const s of this.stars || []) occ.push({ x: s.at.x, z: s.at.z, r: 1.2 });
    const F = this.fwd, L = this.left, fr = this.front, c0 = this.mem?.c0;
    const fwOf = (c) => [Math.cos(c.th), Math.sin(c.th)], lfOf = (c) => [Math.sin(c.th), -Math.cos(c.th)];
    const atCar = (c, u, v) => { const [fx, fz] = fwOf(c), [lx, lz] = lfOf(c); return [c.x + fx * u + lx * v, c.z + fz * u + lz * v]; };
    // (kept clear: the drivers' and your team's spots in the grid walk)
    for (const c of cars) { const [x, z] = atCar(c, -1.3, -1.45); occ.push({ x, z, r: 0.9 }); }
    if (this.player) for (const [u, v] of [[-1.0, 2.9], [1.2, 3.1], [0, 1.9]]) { const [x, z] = atCar(this.player, u, v); occ.push({ x, z, r: 0.9 }); }
    const along0 = (cars[cars.length - 1].x - fr.x) * F.x + (cars[cars.length - 1].z - fr.z) * F.z;
    // (on the grid: inside the walls where it is - the track's own edge at that point - and not on the walkway)
    const { wallOf, edge } = this._edges(hw);
    const open = (x, z) => {
      const a = (x - fr.x) * F.x + (z - fr.z) * F.z; if (a > (c0 ? 24 : 12) || a < along0 - 10) return false;
      const e = edge(x, z, 0.5); if (!e.ok || Math.abs(e.d) < 0.85) return false;
      if (c0 && Math.hypot(x - c0.x, z - c0.z) < 4.6) return false;
      for (const c of cars) { const dx = x - c.x, dz = z - c.z, ca = Math.cos(c.th), sa = Math.sin(c.th), u = dx * ca + dz * sa, v = -dx * sa + dz * ca; if (Math.abs(u) < 3.25 && Math.abs(v) < 1.4) return false; }
      return true;
    };
    const life = (this.life = new CrowdLife({ night: this.night, cars, track: tr, free: open, walkway: (x, z) => { const q = tr.nearest(x, z, -1, tq), f = tr.sample(q.s, (Math.random() - 0.5) * 0.9); return [f.x, f.z]; } }));
    const free = (x, z, r = 0.62) => {
      if (!open(x, z)) return false;
      if (c0 && Math.hypot(x - c0.x, z - c0.z) < 4.6) return false;
      for (const c of cars) { const dx = x - c.x, dz = z - c.z, ca = Math.cos(c.th), sa = Math.sin(c.th), u = dx * ca + dz * sa, v = -dx * sa + dz * ca; if (Math.abs(u) < 3.25 && Math.abs(v) < 1.4) return false; }
      for (const q of occ) { const rr = Math.max(r, q.r); if ((x - q.x) ** 2 + (z - q.z) ** 2 < rr * rr) return false; }
      return true;
    };
    const put = (role, x, z, face, col, home, act) => { life.add(role, x, z, face, col, 0.95 + Math.random() * 0.09, home, act); occ.push({ x, z, r: 0.62 }); };
    for (const m of this._lateCrew || []) put('crew', m.x, m.z, m.face, { top: m.c.color, team: m.c.color, acc: m.c.color2 || '#ffffff', legs: '#1c1e23' }, m.c, 'idle');
    const faceTo = (x, z, tx, tz) => facingOf(tx - x, tz - z) + (Math.random() - 0.5) * 0.5;
    const JACKETS = ['#1d2027', '#2b2f38', '#3a3f48', '#14161b', '#4a4f58', '#2a3550', '#5b4636', '#e9e6e1', '#8a8f99', '#6b2e2e'];
    const SHIRTS = ['#f2f2ef', '#e9e3d6', '#1b1d22', '#2d4a6b', '#9fb6c9', '#d9c7a3', '#6d7f5a', '#b04a4a', '#f0c9c9', '#ffffff'];
    const LEGS = ['#22252b', '#2d3a55', '#3b4a66', '#a89a7a', '#e8e4da', '#1a1a1a', '#5b5f66'];
    const guestCol = () => { const j = Math.random() < 0.55; const top = j ? pick(JACKETS) : pick(SHIRTS); return { top, team: top, legs: pick(LEGS), acc: pick(['#e10600', '#00d2be', '#ff8000', '#ffffff', '#1e41ff', '#ffd400']) }; };
    // a group of n round a centre, facing it
    const group = (role, n, cx, cz, col, home) => {
      let k = 0;
      for (let t = 0; t < n * 6 && k < n; t++) {
        const a = Math.random() * 6.283, r = 0.5 + Math.random() * 0.35, x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r;
        if (!free(x, z)) continue;
        put(role, x, z, faceTo(x, z, cx, cz), col(), home, 'chat');
        k++;
      }
    };
    cars.forEach((c, i) => {
      const crewCol = () => ({ top: c.color, team: c.color, acc: c.color2 || '#ffffff', legs: Math.random() < 0.5 ? '#1c1e23' : new THREE.Color(c.color).multiplyScalar(0.35).getStyle() });
      // the crew: round the car, most of them facing it
      const nCrew = 5 + (i < 10 ? 3 : 1);
      for (let k = 0, t = 0; k < nCrew && t < 80; t++) {
        const a = Math.random() * 6.283, u = Math.cos(a) * (3.4 + Math.random() * 1.0), v = Math.sin(a) * (1.6 + Math.random() * 0.9), [x, z] = atCar(c, u, v);
        if (!free(x, z)) continue;
        put('crew', x, z, Math.random() < 0.7 ? faceTo(x, z, c.x, c.z) : Math.random() * 6.28, crewCol(), c, 'idle'); k++;
      }
      // guests and VIPs, in twos and threes and fours: thickest at the front of the grid
      const nG = i < 4 ? 4 : i < 10 ? 3 : i < 16 ? 2 : 1;
      for (let g = 0; g < nG; g++) {
        const a = Math.random() * 6.283, [cx, cz] = atCar(c, Math.cos(a) * (4 + Math.random() * 2.5), Math.sin(a) * (2.2 + Math.random() * 1.6));
        const crewG = Math.random() < 0.2 && i < 10;
        group(crewG ? 'crew' : 'guest', 2 + ((Math.random() * 3) | 0), cx, cz, crewG ? crewCol : guestCol, c);
      }
      // photographers on the front rows, facing the car
      if (i < 8) for (let k = 0, t = 0; k < 1 + (i < 2 ? 2 : 0) && t < 40; t++) {
        const a = (Math.random() - 0.5) * 2.4, [x, z] = atCar(c, Math.cos(a) * 4.2, Math.sin(a) * 2.6);
        if (!free(x, z)) continue;
        put('photo', x, z, faceTo(x, z, c.x, c.z), { top: pick(['#16181d', '#2b2f38', '#e8662a']), team: '#16181d', legs: pick(LEGS) }, c, 'shoot'); k++;
      }
      // TV crews at pole, the front row and your car: a camera operator and a presenter
      if (i < 2 || c === this.player) for (let t = 0; t < 30; t++) {
        const a = Math.random() * 6.283, [x, z] = atCar(c, Math.cos(a) * 3.8, Math.sin(a) * 2.4); if (!free(x, z, 1.0)) continue;
        const [px, pz] = [x + Math.cos(a) * 1.3, z + Math.sin(a) * 1.3]; if (!free(px, pz)) continue;
        put('tv', x, z, faceTo(x, z, px, pz), { top: '#1b1d22', team: '#1b1d22', legs: '#22252b' }, c, 'tv');
        const pres = life.people[life.people.length - 1]; void pres;
        put('guest', px, pz, faceTo(px, pz, x, z), guestCol(), c, 'chat'); break;
      }
    });
    // the sides of the grid out to the walls - the far side's wide run-off too - all the way down: people standing about
    const crewOf = (c) => () => ({ top: c.color, team: c.color, acc: c.color2 || '#ffffff', legs: '#1c1e23' });
    const nearCar = (x, z) => { let b = cars[0], bd = Infinity; for (const c of cars) { const d = (c.x - x) ** 2 + (c.z - z) ** 2; if (d < bd) { bd = d; b = c; } } return b; };
    const s0 = tr.nearest(this.front.x, this.front.z, -1, tq).s;
    for (let k = along0 - 8; k < (c0 ? 22 : 10); k += 2.4) for (const side of [-1, 1]) {
      if (Math.random() < 0.42) continue;
      const s = s0 + k, i = tr.idxAtS(s), w = wallOf(i, side); if (!isFinite(w)) continue;
      const lo = 3.9, hi = Math.min(w - 0.9, hw + 4); if (hi <= lo + 0.3) continue;
      const f = tr.sample(s, side * (lo + Math.random() * (hi - lo))), near = nearCar(f.x, f.z), crewG = Math.random() < 0.25;
      group(crewG ? 'crew' : 'guest', 2 + ((Math.random() * 3) | 0), f.x, f.z, crewG ? crewOf(near) : guestCol, near);
      life.spots.push([f.x, f.z]);
      // (a wide run-off beyond the track's edge: filled too - people stand out there by the barrier)
      if (w > hw + 2 && Math.random() < 0.75) {
        const g2 = tr.sample(s + 1.2, side * (hw + 0.6 + Math.random() * (w - hw - 1.6))), n2 = nearCar(g2.x, g2.z);
        group(Math.random() < 0.2 ? 'photo' : 'guest', 2 + ((Math.random() * 3) | 0), g2.x, g2.z, guestCol, n2);
        life.spots.push([g2.x, g2.z]);
      }
    }
    life.build(this.group);
    // the tyre blankets: every car's four wheels, a band of the team's colour round each
    const n = cars.length * 4, bl = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.382, 0.382, 1, 22).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#16171a', roughness: 0.9 }), n);
    const band = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.386, 0.386, 0.07, 22, 1, true).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 }), n);
    const M = new THREE.Matrix4(), Qn = new THREE.Quaternion(), S = new THREE.Vector3(), P0 = new THREE.Vector3(), E = new THREE.Euler(), gr = [0, 0], col = new THREE.Color();
    let k = 0;
    for (const c of cars) for (const [bx, bz, w] of [[1.96, 0.848, 0.345], [1.96, -0.848, 0.345], [-1.64, 0.797, 0.445], [-1.64, -0.797, 0.445]]) {
      // (the car's body frame: +x forward, +z its left, turned by -th; on a slope lifted and tilted with the car, as
      //  CarMesh.update stands it: pitch and roll from the ground's slope under it)
      let gy = 0, gp = 0, gq = 0;
      if (TERRAIN.on) { TERRAIN.grad(c.x, c.z, gr); const ca = Math.cos(c.th), sa = Math.sin(c.th); gy = TERRAIN.at(c.x, c.z); gp = Math.atan(gr[0] * ca + gr[1] * sa); gq = Math.atan(gr[0] * sa - gr[1] * ca); }
      Qn.setFromEuler(E.set(gq, -c.th, gp, 'YZX'));
      P0.set(bx, 0.365, bz).applyQuaternion(Qn).add(S.set(c.x, gy, c.z));
      bl.setMatrixAt(k, M.compose(P0, Qn, S.set(1, 1, w))); band.setMatrixAt(k, M.compose(P0, Qn, S.set(1, 1, 1))); band.setColorAt(k, col.set(c.color)); k++;
    }
    bl.instanceMatrix.needsUpdate = true; band.instanceMatrix.needsUpdate = true; bl.computeBoundingSphere(); band.computeBoundingSphere();
    this.group.add(bl, band);
    function facingOf(dx, dz) { return Math.atan2(-dz, dx); }
  }

  /** the grid's people going about their business (the show, and the grid walk after it): the crowd, and the heads of
   *  the people in full detail (a look round, a nod) */
  idle(dt, t) {
    crowdTime(t); this.life?.update(dt, t, this.camera.position);
    for (const p of this.people) { if (!p.head || p.busy) continue; const ph = p._ph ?? (p._ph = Math.random() * 6.28); p.head.rotation.z = p.bow + 0.04 * Math.sin(t * 0.9 + ph); p.head.rotation.y = 0.22 * Math.sin(t * 0.31 + ph * 2); }
  }
  /** the stand's 3D crowd on (and its sheet fans hidden) for the shots of it; off again for the rest */

  _dom() {
    if (!document.getElementById('prerace-css')) { const st = document.createElement('style'); st.id = 'prerace-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = this.el = document.createElement('div'); el.id = 'prerace';
    el.innerHTML = `<div class="bug"><b>F1</b><i>LIVE · ${esc((this.trackName || '').toUpperCase())}</i></div><div class="btns">${this.walk ? '<button class="walk">WALK THE GRID ▸</button>' : ''}<button class="skip">SKIP ▸</button></div><div class="lower"><div class="tab"></div><div class="main"></div><div class="sub"></div></div><div class="cc"></div><div class="black"></div>`;
    document.body.appendChild(el);
    el.querySelector('.skip').addEventListener('click', () => this.finish());
    el.querySelector('.walk')?.addEventListener('click', () => this.finish(true));
    requestAnimationFrame(() => { el.querySelector('.black').style.opacity = 0; });
  }
  _text(k) {
    const pole = this.pole, G = this.guestA, H = this.guestB, me = this.player, names = this.mem?.names || [];
    switch (k) {
      case 'memorial': return { tab: 'IN MEMORIAM', main: names.join(' · '), sub: 'The grid remembers', cc: [] };
      case 'banners': return { tab: 'IN MEMORIAM', main: 'The fans remember', sub: this.stand?.name || 'The grandstand', cc: [] };
      case 'return': {
        const B = this.back.r0, n = B.rounds || 1, F = B.name.split(' ')[0], L = B.name.split(' ').pop().toUpperCase();
        const QA = [
          [`${F}, welcome back. How are you feeling?`, pick(["Good. A bit stiff still, but the doctors cleared me and I'm ready.", 'Grateful, more than anything. To the marshals and the medics.', "Like I never left. Let's go racing."])],
          ['What was it like watching from home?', pick(['Horrible. I shouted at the TV more than I should admit.', 'Hard. I just wanted to be back with the team.', 'Strange. You feel very far away from it all.'])],
          [`Do you remember much of the accident${B.at ? ` at ${B.at}` : ''}?`, pick(["Bits. I've watched it back once. That was enough.", 'The halo and the barrier did their job. That is why I am here.', "I'd rather look forward today, if that's okay."])],
          ['Any fear getting back in the car?', pick(['Respect, not fear. That is how it should be.', 'None. The moment I sat in it this morning, it felt like home.', 'A little. That is healthy. It makes you careful.'])],
        ];
        const qa = [QA[0], ...shuffle(QA.slice(1)).slice(0, 1)];
        return { tab: 'THE COMEBACK', main: B.name, sub: `Back after ${n === 1 ? 'one race' : `${n} races`} out${B.at ? ` · the accident at ${B.at}` : ''} · ${B.team}`, cc: qa.flatMap(([q, a]) => [`>> HALE: ${q}`, `>> ${L}: ${a}`]) };
      }
      case 'aerial': return { tab: 'RACE DAY', main: this.trackName, sub: `${this.night ? 'Lights out under the lights' : 'Race day'}${this.weather && this.weather !== 'dry' ? ` · ${this.weather} track` : ''}`, cc: [] };
      case 'fans': return { tab: 'LIVE', main: pick(['The crowd is ready', 'A sell-out crowd', 'The fans are in']), sub: this.stand?.name || 'The main grandstand', cc: [] };
      case 'stands': return null;
      case 'grid': return { tab: 'THE GRID', main: `${pole.name} on pole`, sub: pole.team, cc: [] };
      case 'walk': return { tab: 'GRID WALK', main: REPORTER[0], sub: REPORTER[1], cc: shuffle([
        ">> Here we go then. A few minutes to go, and the grid is absolutely buzzing.", `>> ${pole.name.split(' ').pop()} on pole, sitting in the car, eyes closed. Not a word to anyone.`,
        ">> The tyre blankets are coming off. Engineers doing their last checks.", ">> You can feel it down here. The noise from the grandstand is incredible.",
        `>> Big day for ${me ? me.team : 'the midfield'}. Plenty of nerves in that garage.`]).slice(0, 2) };
      case 'celeb': return { tab: 'GRID', main: G[0], sub: `${G[1]} · guest of ${this.celebCar.team}`, cc: [] };
      case 'interview': {
        const n = H[0].split(' ')[0], N = n.toUpperCase(), Q = [['First time on a Formula 1 grid?', pick(["First time, and I'm shaking. You can feel the engines in your chest!", "First time. Nobody told me it would be this loud!", "Second time - and it doesn't get any less scary."])],
          ['Who are you backing tonight?', pick([`Honestly? Anyone who brings it home safe. Then ${pole.name.split(' ').pop()}.`, `I've been told to say ${me ? me.team : 'everyone'}... so, ${me ? me.team : 'everyone'}!`, `Whoever is brave enough into Turn 1. I couldn't do it.`])],
          ['Have you met any of the drivers?', pick(["I touched a car and a mechanic glared at me. I'm leaving now.", 'They are so calm. I would be throwing up.', 'One of them said hi. I will be telling people about that for years.'])]];
        const qa = shuffle(Q).slice(0, 2);
        return { tab: 'GRID WALK', main: H[0], sub: H[1], cc: qa.flatMap(([q, a]) => [`>> HALE: ${n}, ${q.charAt(0).toLowerCase() + q.slice(1)}`, `>> ${N}: ${a}`]) };
      }
      case 'you': return { tab: 'STARTING', main: me.name, sub: `P${me.gridPos || '-'} · ${me.team}`, cc: [] };
    }
    return null;
  }
  _enter(seg) {
    this.seg = seg; const x = this._text(seg.k), L = this.el.querySelector('.lower');
    this.el.classList.toggle('mem', seg.k === 'memorial' || seg.k === 'banners');
    if (!x) { L.classList.remove('in'); } else { L.classList.remove('in'); void L.offsetWidth; L.querySelector('.tab').textContent = x.tab; L.querySelector('.main').textContent = x.main; L.querySelector('.sub').textContent = x.sub; setTimeout(() => L.classList.add('in'), 250); }
    this.cc = x?.cc?.length ? { lines: x.cc, t: 0 } : null; this.el.querySelector('.cc').classList.toggle('in', !!this.cc);
    // (out of the memorial: the strings fade, the crowd comes up)
    if (this.mem && seg.k === 'aerial') { this.strings?.(false); this.crowd?.to(0.32, 1.5); }
  }

  update(dt) {
    if (this.done) return;
    this.t += dt; const t = this.t, cam = this.camera;
    if (t >= this.total) { this.finish(); return; }
    const seg = this.plan.find((s) => t >= s.t0 && t < s.t0 + s.dur) || this.plan[this.plan.length - 1], st = t - seg.t0, u = Math.min(1, st / seg.dur);
    if (seg !== this.seg) this._enter(seg);
    for (const f of this.anims) f(t);
    this.idle(dt, t);
    for (const f of this.flames || []) f.scale.y = 1.6 + 0.4 * Math.sin(t * 9 + f.userData.ph);
    if (this.cc) {
      this.cc.t += dt; let tt = this.cc.t, i = 0; const Ls = this.cc.lines;
      while (i < Ls.length - 1 && tt > Ls[i].length / 30 + 1.2) { tt -= Ls[i].length / 30 + 1.2; i++; }
      this.el.querySelector('.cc').textContent = Ls[i].slice(0, Math.floor(tt * 30));
    }
    const V = (x, y, z) => new THREE.Vector3(x, y, z), F = this.fwd, Lf = this.left, fr = this.front, S = this.stand;
    // (every shot on the flat, its heights over the ground; look: what it is aimed at - main.js lifts the camera with it)
    const shot = (from, to, look, fov) => { const p = from.clone().lerp(to, u * u * (3 - 2 * u)); cam.position.copy(p).add(V(Math.sin(t * 0.7) * 0.01, Math.sin(t * 1.1) * 0.008, 0)); cam.up.set(0, 1, 0); cam.lookAt(look); this.look.copy(look); if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); } };
    // (in the stand's frame: x along it, d back from its front edge, y over its own floor - which on a slope is the level
    //  plinth it stands on, not the ground under each point: world/Grandstands.js y0, k)
    const sw = (x, d, y) => { const [a, b] = S.world(x, d); return V(a, y + standOff(S, x, a, b), b); };
    switch (seg.k) {
      case 'memorial': { const c0 = this.mem.c0; shot(c0.clone().addScaledVector(F, -12).addScaledVector(Lf, 1.2).setY(0.9), c0.clone().addScaledVector(F, -6.5).addScaledVector(Lf, 0.4).setY(1.05), c0.clone().setY(1.15 + 0.15 * u), 36); break; }
      case 'banners': {
        // along the front of the stand from the track side, past the banners
        const B = this.bannerAt?.[2] || this.bannerAt?.[0];
        if (!B) { shot(this.mem.c0.clone().setY(3), this.mem.c0.clone().setY(4), this.mem.c0.clone().setY(1), 40); break; }
        const s = B.stand, at = (x, d, y) => { const [a, b] = s.world(x, d); return V(a, y + standOff(s, x, a, b), b); }, x0 = B.f * s.len;
        shot(at(x0 - 9, -13, 2.4), at(x0 + 5, -11, 2.9), B.pos.clone().setY(B.pos.y - 0.4), 34); break;
      }
      case 'return': {
        // a two-shot by the car: the returning driver and the reporter, the camera drifting in
        const B = this.back, mid = B.dp.clone().lerp(B.rp, 0.5), ax = B.rp.clone().sub(B.dp).normalize(), perp = V(-ax.z, 0, ax.x);
        shot(mid.clone().addScaledVector(perp, 3.0).addScaledVector(ax, -0.4).setY(1.62), mid.clone().addScaledVector(perp, 2.3).addScaledVector(ax, -0.2).setY(1.58), mid.clone().setY(1.48), 30);
        B.drv.head.rotation.z = B.drv.bow + 0.05 * Math.sin(t * 5.2) * Math.max(0, Math.sin(t * 1.3)) - 0.03;
        break;
      }
      case 'aerial': { const sd = S ? -Math.sign((S.x - fr.x) * Lf.x + (S.z - fr.z) * Lf.z) || 1 : 1;   // (from the side away from the grandstand)
        shot(fr.clone().addScaledVector(F, 240).addScaledVector(Lf, 14 * sd).setY(150), fr.clone().addScaledVector(F, 90).addScaledVector(Lf, 6 * sd).setY(62), P(this.grid[Math.min(5, this.grid.length - 1)]), 40); break; }
      case 'fans': if (S) shot(sw(-0.08 * S.len, -6.5, 3.0), sw(0.08 * S.len, -6.5, 3.2), sw(0.03 * S.len * (u * 2 - 1), 2.5, 3.4), 40); else shot(fr.clone().setY(6), fr.clone().setY(8), fr.clone().addScaledVector(F, -40), 50); break;
      case 'stands': if (S) shot(sw(-0.1 * S.len, -48, 7), sw(0.1 * S.len, -44, 9), sw(0, 6, 6), 46); else shot(fr.clone().addScaledVector(Lf, 40).setY(20), fr.clone().addScaledVector(Lf, 35).setY(18), fr, 50); break;
      case 'grid': shot(fr.clone().addScaledVector(F, 22).addScaledVector(Lf, this.track.halfWidth * 0.6).setY(1.0), fr.clone().addScaledVector(F, 15).addScaledVector(Lf, this.track.halfWidth * 0.3).setY(1.3), P(this.grid[Math.min(6, this.grid.length - 1)]).setY(0.6), 34); break;
      case 'walk': {
        // the reporter walking back down the grid toward the camera's way; the camera ahead, backing off with them
        const A = V(this.walkA.x, 0, this.walkA.z), B = V(this.walkB.x, 0, this.walkB.z), w = A.clone().lerp(B, u), dir = B.clone().sub(A).normalize();
        this.walker.group.position.set(w.x, Math.abs(Math.sin(t * 7)) * 0.03 + TERRAIN.at(w.x, w.z), w.z); this.walker.group.rotation.y = Math.atan2(-dir.z, dir.x);
        const c = w.clone().addScaledVector(dir, 3.1).setY(1.6); cam.position.copy(c); cam.up.set(0, 1, 0); this.look.copy(w).setY(1.45); cam.lookAt(this.look); if (cam.fov !== 34) { cam.fov = 34; cam.updateProjectionMatrix(); }
        this.walker.head.rotation.z = this.walker.bow + 0.05 * Math.sin(t * 5.3) * Math.max(0, Math.sin(t * 1.7)) - 0.03;
        break;
      }
      case 'celeb': { const g = this.celeb.group.position, c = this.celebCar, fw = V(Math.cos(c.th), 0, Math.sin(c.th)), lf = V(Math.sin(c.th), 0, -Math.cos(c.th)); shot(g.clone().addScaledVector(fw, -3.4).addScaledVector(lf, 2.4).setY(1.6), g.clone().addScaledVector(fw, -2.5).addScaledVector(lf, 1.9).setY(1.4), g.clone().addScaledVector(lf, -0.5).setY(1.0), 36); break; }
      case 'interview': {
        const ip = this.ipos, rp = this.rpos, d = ip.clone().sub(rp).normalize(), side = V(-d.z, 0, d.x);
        shot(rp.clone().addScaledVector(d, -1.5).addScaledVector(side, 0.95).setY(1.72), rp.clone().addScaledVector(d, -1.3).addScaledVector(side, 0.8).setY(1.7), ip.clone().setY(1.52), 28);
        this.guest.head.rotation.z = this.guest.bow + 0.05 * Math.sin(t * 5.1) * Math.max(0, Math.sin(t * 1.4)) - 0.03;
        break;
      }
      case 'you': { const c = this.player, p = P(c), fw = V(Math.cos(c.th), 0, Math.sin(c.th)), lf = V(Math.sin(c.th), 0, -Math.cos(c.th)); shot(p.clone().addScaledVector(fw, 1.2).addScaledVector(lf, 5.2).setY(1.9), p.clone().addScaledVector(fw, 0.6).addScaledVector(lf, 3.4).setY(1.45), p.clone().addScaledVector(fw, -0.3).setY(0.75), 36); break; }
    }
    if (this.total - t < 0.9) this.el.querySelector('.black').style.opacity = 1;   // (to black, and into the race)
    function P(c) { return new THREE.Vector3(c.x, 0, c.z); }
    // (a point in stand s's frame (x along it) at world (a, b): its floor's height over the ground there)
    function standOff(s, x, a, b) { return TERRAIN.on ? (s.y0 || 0) + (s.k || 0) * x - TERRAIN.at(a, b) : 0; }
  }
  /** over (or skipped): everything built for it gone; walk: the grid as it stands handed to the grid walk instead */
  finish(walk = false) {
    if (this.done) return; this.done = true;
    window.removeEventListener('keydown', this._key, true);
    if (this.mem) this.strings?.(false);
    this.el.remove();
    walk = walk && this.walk;
    if (walk) this.crowd?.to?.(0.32, 1); else this.dispose();
    this.onDone?.(walk);
  }
  /** take it all away (finish() does, unless it went to the grid walk) */
  dispose() {
    if (this.disposed) return; this.disposed = true;
    this.crowd?.stop(1.2); this.crowd = null;
    this.scene.remove(this.group);
    for (const p of this.people) { this.group.remove(p.group); p.dispose(); }
    disposeGroup(this.group);
    if (this.camera.fov !== this.fov0) { this.camera.fov = this.fov0; this.camera.updateProjectionMatrix(); }
  }
}
