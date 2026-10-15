// The pool club's crowd, alive (world/PartyCrowd.js's people, ui/PartyPool.js's PoolCrowd): every guest someone of their
// own - a name, a drink they always order, a mood, the friends they came with - and four needs that rise and fall (thirst,
// company, the urge to dance, the heat) picking what they do next, re-weighed every few seconds and leant on by the night's
// phase (the music's energy and how full the place is). What they do: walk to a bar, queue, order, wait for the pour, drink
// it where they like; stand about in twos and threes talking in turns, laughing, toasting, hugging hello; dance (alone, in
// a crew that keeps the same moves, round a circle with one in the middle, in couples) and throw their hands up when the DJ
// drops it; wade in off the shelf, swim, float, splash each other, race a cannonball to the far wall, then grab a towel and
// dry off in the sun; lounge on the daybeds and in the cabanas, sit by the fire. The house works the room: servers carry
// bottles out to the tables (sparklers for a birthday), security walks the deck, the photographer goes from group to group.
//
// Built for the Intel UHD laptop as the rest of the venue: nothing allocated per frame (typed arrays, objects made once at
// the build), no light, no new draw call of its own - a person's activity is the crowd's template swap (each guest can wear
// their own kit in a dozen poses, all baked behind the cover), their walk two poses in turn, a swimmer or a floater a body
// laid flat in the instance matrix. The way about is a 0.5 m grid of the deck and the water (A* on typed arrays, the path
// pulled straight), the people re-sorted for their detail as PartyCrowd does.
//
// ==== THE CONTRACT ======================================================================================================
// new PoolBrain(crowd, plan) - plan (ui/PartyPool.js): { K (the Kit: areas, solids, discs), deck { x0, z0, x1, z1 }, pool
//   { x0, z0, x1, z1, shelf, wl, deep, ledge }, heightAt(x, z), night, door { x, z }, bars [{ id, slots [{ x, z, yaw }],
//   queue [{ x, z }] }], service { x, z }, towel { x, z, yaw }, dance [{ x, z, y, yaw, water }], chat [{ x, z, water? }],
//   seats [{ x, z, y, yaw, kind }], swim [{ x, z }], edge [{ x, z, ix, iz }] (cannonballs: on the deck, the point in the
//   water), patrol [{ x, z }], sun [{ x, z }], fire [{ x, z, y, yaw }], dj { x, z }, birthday { x, z }, say(text) (the LED) }
// .init()                  once the crowd's meshes are made: identities, groups, the grid
// .pre(dt)                 every frame before PartyCrowd.update: needs, choices, walking, poses (crowd._dirty on a swap)
// .bump(x, z, r)           you pushed through at (x, z): a word from whoever you shoved
// .counts() -> { act: n }  how many are doing what (the debug counter)
// .info(p) -> {...}        one person's state (the debug panel)
// .lines(cam, r) -> [p]    who is saying something within r of the camera now (p.L.say, p.L.sayT)
// .chat(p, cam)            you talking to p (ui/PartyPool.js's E key): they turn to you; -> [lines] the exchange
// ======================================================================================================================
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const pickR = (R, a) => a[Math.floor(R() * a.length) % a.length];
const fill = (s, L) => s.replace(/\{(\w+)\}/g, (_, k) => (L[k] != null ? L[k] : ''));

// ---- who they are -------------------------------------------------------------------------------------------------------
const NAMES_F = ['Ava', 'Mia', 'Zoe', 'Lena', 'Kiki', 'Nadia', 'Sofia', 'Jade', 'Tess', 'Priya', 'Mara', 'Luz', 'Skye', 'Ines', 'Becca', 'Yara', 'Coco', 'Dani', 'Elle', 'Rosa', 'Nina', 'Maya', 'Gigi', 'Talia', 'Ana', 'Brooke', 'Sasha', 'Imani', 'Noor', 'Remi'];
const NAMES_M = ['Leo', 'Marco', 'Jay', 'Theo', 'Kai', 'Andre', 'Sam', 'Nico', 'Omar', 'Ravi', 'Ben', 'Diego', 'Tom', 'Jonah', 'Felix', 'Ike', 'Luca', 'Max', 'Rafa', 'Cole', 'Eli', 'Hugo', 'Zane', 'Malik', 'Owen', 'Seb', 'Teo', 'Vince'];
const DRINKS = ['frozen margarita', 'flute of champagne', 'tequila soda', 'cold beer', 'rosé', 'mojito', 'Aperol spritz', 'vodka cran', 'water, lots of ice', 'piña colada'];
const MOODS = ['buzzing', 'chill', 'flirty', 'tipsy', 'hyped', 'sunkissed', 'sleepy', 'chatty'];
// (a line someone says - to their friends, or to you: {name} theirs, {drink} theirs, {friend} one of their group, {dj})
const SAY = {
  order: ['A {drink}, please!', 'Two {drink}s?', 'Can I get a {drink}?', 'Same again!', 'Whatever is coldest.'],
  serve: ['Thank you!', 'Amazing, cheers!', 'Keep the change.', 'Perfect.'],
  hello: ['{friend}! You made it!', 'There you are!', 'Hiii!', 'Look who it is!', 'Finally!'],
  toast: ['Cheers!', 'To Vegas!', 'To us!', 'Salud!', 'Bottoms up!'],
  laugh: ['Ha! Stop.', 'No way.', 'I am crying.', 'You did not!', 'Classic {friend}.'],
  drop: ['Here it comes!', 'HANDS UP!', 'Oh this one!', 'Let\'s gooo!', 'Tune!'],
  splash: ['Hey!', 'You\'re dead!', 'Not the hair!', 'Truce! Truce!', 'Ha! Got you!'],
  cannon: ['Race you to the wall!', 'Three, two, one...', 'Cannonball!', 'Loser buys shots!'],
  towel: ['That was amazing.', 'I need sun.', 'Towel me.', 'So refreshing.'],
  bump: ['Excuse me!', 'Whoa, easy.', 'Sorry, sorry.', 'Careful, I\'ve got a drink!', 'Oop, after you.', 'Watch it!'],
  bumpW: ['Hey! You\'re splashing me!', 'Watch the drink!', 'Ha, whoops.', 'Easy there, swimmer.'],
  birthday: ['Happy birthday!!', 'Speech! Speech!', 'Make a wish!'],
  count: ['Three!', 'Two!', 'One!', 'SHOTS!'],
  chant: ['Go! Go! Go!', 'Ayyy!', 'Get it!', 'Oh-oh-oh!'],
  photo: ['Everyone squeeze in!', 'Say Tidewater!', 'One more!', 'Get my good side.'],
  welcome: ['ID, please.', 'Have a great one.', 'Enjoy, folks.', 'Wristbands on.'],
};
// (two-way exchanges: A says, B answers - picked by the topic of the moment)
const TALK = [
  ['Is the water warm?', 'Like a bath. Get in.'], ['Who is this DJ?', '{dj}. Always plays here on race weekend.'], ['Did you see the race?', 'Saw the start. Then I saw the bar.'],
  ['I love this song.', 'You say that about every song.'], ['My feet are on fire.', 'Then stand in the pool, genius.'], ['Should we get a cabana?', 'With whose money?'],
  ['Where is {friend}?', 'Bar. Obviously.'], ['I could stay here forever.', 'Your flight is at nine.'], ['Look at that view.', 'Never gets old.'],
  ['Another {drink}?', 'Twist my arm.'], ['Who does she think she is?', 'A podium dancer. Literally.'], ['I am so sunburnt.', 'I told you. Factor fifty.'],
  ['Are you swimming later?', 'After this drink. Maybe two.'], ['This place is packed.', 'Peak time, babe.'], ['Shots?', 'Shots.'],
  ['Your swimsuit is so cute.', 'Thank you! It was on sale.'], ['I lost my sunglasses.', 'They\'re on your head.'], ['What time is it?', 'Doesn\'t matter.'],
  ['Who\'s the guy at the DJ booth?', 'Some driver. They\'re everywhere this weekend.'], ['Did you get the photo?', 'Sixty of them. One is good.'],
];
// (you, talking to one of them: their opening, your answer, theirs)
const MEET = [
  ['Hey! I\'m {name}. First time at Tidewater?', 'Something like that.', 'You picked the right weekend.'],
  ['{name}. Nice to meet you! Love the energy tonight.', 'Same. The music is unreal.', 'Wait till the drop. Trust me.'],
  ['Oh hi! I\'m {name}, I\'m with {friend}. Have you tried the {drink}?', 'Not yet. Any good?', 'Dangerously good.'],
  ['{name}! Hey. Are you racing this weekend? You look familiar.', 'Maybe.', 'Ha. Mysterious. I like it.'],
  ['I\'m {name}. Feeling {mood} - is that obvious?', 'A little.', 'Good. Come dance later.'],
  ['Hi! {name}. Have you been in the pool yet?', 'Thinking about it.', 'Do it. Cannonball off the side.'],
];

// ---- the grid ----------------------------------------------------------------------------------------------------------
// (0 blocked, 1 deck, 2 the shelf's water, 3 deep water; a deck cell only meets water at the shelf - the steps in)
const CS = 0.5, PMAX = 24;
class Nav {
  constructor(plan) {
    const D = plan.deck, P = plan.pool, K = plan.K;
    this.x0 = D.x0; this.z0 = D.z0; this.W = Math.ceil((D.x1 - D.x0) / CS); this.H = Math.ceil((D.z1 - D.z0) / CS); const N = this.N = this.W * this.H;
    this.type = new Uint8Array(N); this.g = new Float32Array(N); this.from = new Int32Array(N); this.stamp = new Uint32Array(N); this.closed = new Uint32Array(N); this.gen = 1;
    this.heap = new Int32Array(N); this.hf = new Float32Array(N); this.hn = 0; this.tmp = new Int32Array(256);
    const inA = (x, z) => (K.areas || []).some((a) => x > a.x0 && x < a.x1 && z > a.z0 && z < a.z1);
    for (let j = 0; j < this.H; j++) for (let i = 0; i < this.W; i++) {
      const x = this.x0 + (i + 0.5) * CS, z = this.z0 + (j + 0.5) * CS, k = j * this.W + i;
      let t = inA(x, z) ? 1 : 0;
      if (x > P.x0 + 0.05 && x < P.x1 - 0.05 && z > P.z0 + 0.05 && z < P.z1 - 0.05) t = z > P.shelf ? 2 : 3;
      if (t) for (const s of K.solids || []) if (x > s.x0 - 0.22 && x < s.x1 + 0.22 && z > s.z0 - 0.22 && z < s.z1 + 0.22) { t = 0; break; }
      if (t) for (const d of K.discs || []) if (!d.pp && (x - d.x) ** 2 + (z - d.z) ** 2 < (d.r + 0.22) ** 2) { t = 0; break; }
      this.type[k] = t;
    }
    // (the podiums rising out of the water, and the floats)
    for (const [cx, cz, r] of plan.blockW || []) for (let j = 0; j < this.H; j++) for (let i = 0; i < this.W; i++) { const x = this.x0 + (i + 0.5) * CS, z = this.z0 + (j + 0.5) * CS; if ((x - cx) ** 2 + (z - cz) ** 2 < r * r) this.type[j * this.W + i] = 0; }
  }
  cell(x, z) { const i = Math.floor((x - this.x0) / CS), j = Math.floor((z - this.z0) / CS); return i < 0 || j < 0 || i >= this.W || j >= this.H ? -1 : j * this.W + i; }
  /** may an agent (swim: allowed in the water) stand in cell k */
  ok(k, swim) { if (k < 0) return false; const t = this.type[k]; return t === 1 || (swim && t >= 2); }
  /** may it step from a to b (a deck cell meets the water only at the shelf) */
  step(a, b, swim) { if (!this.ok(b, swim)) return false; const ta = this.type[a], tb = this.type[b]; return !((ta === 1 && tb === 3) || (ta === 3 && tb === 1)); }
  typeAt(x, z) { const k = this.cell(x, z); return k < 0 ? 0 : this.type[k]; }
  /** the nearest cell an agent may stand in, within r cells -> cell | -1 */
  near(x, z, swim, r = 6) {
    const c = this.cell(x, z); if (this.ok(c, swim)) return c;
    const i0 = Math.floor((x - this.x0) / CS), j0 = Math.floor((z - this.z0) / CS); let best = -1, bd = 1e9;
    for (let d = 1; d <= r && best < 0; d++) for (let j = j0 - d; j <= j0 + d; j++) for (let i = i0 - d; i <= i0 + d; i++) {
      if (i < 0 || j < 0 || i >= this.W || j >= this.H) continue; const k = j * this.W + i; if (!this.ok(k, swim)) continue;
      const dd = (i - i0) ** 2 + (j - j0) ** 2; if (dd < bd) { bd = dd; best = k; }
    }
    return best;
  }
  cx(k) { return this.x0 + ((k % this.W) + 0.5) * CS; }
  cz(k) { return this.z0 + (Math.floor(k / this.W) + 0.5) * CS; }
  /** a straight line an agent may walk (sampled every 0.25 m) */
  clear(ax, az, bx, bz, swim) {
    const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(L / 0.25)); let pk = this.cell(ax, az);
    for (let s = 1; s <= n; s++) { const k = this.cell(ax + ((bx - ax) * s) / n, az + ((bz - az) * s) / n); if (k !== pk) { if (!this.step(pk, k, swim)) return false; pk = k; } }
    return true;
  }
  _push(k, f) { let i = this.hn++; const H = this.heap, F = this.hf; while (i > 0) { const p = (i - 1) >> 1; if (F[p] <= f) break; H[i] = H[p]; F[i] = F[p]; i = p; } H[i] = k; F[i] = f; }
  _pop() {
    const H = this.heap, F = this.hf, top = H[0], n = --this.hn; if (n <= 0) return top;
    const k = H[n], f = F[n]; let i = 0;
    for (;;) { let c = 2 * i + 1; if (c >= n) break; if (c + 1 < n && F[c + 1] < F[c]) c++; if (F[c] >= f) break; H[i] = H[c]; F[i] = F[c]; i = c; }
    H[i] = k; F[i] = f; return top;
  }
  /** A* from (ax, az) to (bx, bz) for a walker (or a swimmer): the corners of the path pulled straight into out (x, z
   * pairs, the goal last) -> how many points, 0 when there is no way */
  find(ax, az, bx, bz, swim, out) {
    const s = this.near(ax, az, swim), e = this.near(bx, bz, swim); if (s < 0 || e < 0) return 0;
    if (s === e || this.clear(ax, az, bx, bz, swim)) { out[0] = bx; out[1] = bz; return 1; }
    const gen = ++this.gen, W = this.W, ex = e % W, ez = (e / W) | 0; this.hn = 0;
    this.stamp[s] = gen; this.g[s] = 0; this.from[s] = -1; this._push(s, 0);
    let found = false, it = 0;
    while (this.hn && it++ < 9000) {
      const k = this._pop(); if (k === e) { found = true; break; } if (this.closed[k] === gen) continue; this.closed[k] = gen;
      const i = k % W, j = (k / W) | 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue; const ni = i + di, nj = j + dj; if (ni < 0 || nj < 0 || ni >= W || nj >= this.H) continue;
        const n = nj * W + ni; if (this.closed[n] === gen || !this.step(k, n, swim)) continue;
        if (di && dj && (!this.ok(j * W + ni, swim) || !this.ok(nj * W + i, swim))) continue;   // (no corner cut)
        const t = this.type[n], c = (di && dj ? 1.414 : 1) * (t >= 2 && !swim ? 9 : t === 3 ? 1.6 : t === 2 ? 1.3 : 1), g = this.g[k] + c;
        if (this.stamp[n] === gen && this.g[n] <= g) continue;
        this.stamp[n] = gen; this.g[n] = g; this.from[n] = k;
        const hx = Math.abs(ni - ex), hz = Math.abs(nj - ez); this._push(n, g + Math.max(hx, hz) + 0.414 * Math.min(hx, hz));
      }
    }
    if (!found) return 0;
    // (the cells back to the start, then pulled straight: the furthest one still in a clear line, each time)
    const T = this.tmp; let m = 0; for (let k = e; k >= 0 && m < T.length; k = this.from[k]) T[m++] = k;
    let n = 0, px = ax, pz = az, a = m - 1;
    while (a > 0 && n < PMAX - 1) {
      let b = 0; while (b < a - 1 && !this.clear(px, pz, this.cx(T[b]), this.cz(T[b]), swim)) b++;
      if (b === 0) break;
      px = this.cx(T[b]); pz = this.cz(T[b]); out[n * 2] = px; out[n * 2 + 1] = pz; n++; a = b;
    }
    out[n * 2] = bx; out[n * 2 + 1] = bz; return n + 1;
  }
}

// ---- the brain ---------------------------------------------------------------------------------------------------------
const WALK = 1.15, WADE = 0.55, SWIM = 0.7;
// (activities: what the counter and the debug panel call them)
const ACTS = ['walk', 'queue', 'order', 'sip', 'chat', 'dance', 'circle', 'couple', 'crew', 'swim', 'float', 'wade', 'splash', 'cannon', 'towel', 'dry', 'lounge', 'fire', 'photo', 'serve', 'parade', 'patrol', 'perform', 'cheer', 'greet', 'toast', 'arrive', 'leave', 'idle'];
export class PoolBrain {
  constructor(crowd, plan) {
    this.C = crowd; this.plan = plan; this.R = rng(0x7d1e); this.t = 0; this.ready = false;
    this.path = null; this.nav = null; this.walkClock = 0; this.walkPh = 0; this.dropUntil = -1; this.nextDrop = 24; this.lastBeat = 0;
    this.queues = []; this.groups = []; this.circles = []; this.seats = []; this.events = { parade: 60, splash: 20, cannon: 30, chant: 40 };
    this.phase = 'Warm-up'; this.energy = 0.6; this.sayN = 0;
  }
  init() {
    const C = this.C, plan = this.plan, R = this.R;
    try { this.nav = new Nav(plan); } catch (e) { console.warn('PoolLife: no grid', e); return; }
    this.path = new Float32Array(C.people.length * PMAX * 2);
    // (each bar: its slots at the counter (who stands there), its queue behind)
    for (const b of plan.bars || []) this.queues.push({ id: b.id, slots: b.slots.map((s) => ({ ...s, p: null })), line: [], spots: b.queue });
    this.seats = (plan.seats || []).map((s) => ({ ...s, p: null }));
    this.fires = (plan.fire || []).map((s) => ({ ...s, p: null }));
    this.dances = (plan.dance || []).map((s) => ({ ...s, p: null }));
    // (identities: a name, a drink, a mood; the friends they came with - the patrons in their order, twos to fours)
    const pats = C.people.filter((p) => !p.staff);
    let gi = 0, left = 0, G = null;
    for (const p of C.people) {
      const fem = p.fig === 'f', W = p.W || null, L = p.L = {
        name: pickR(R, fem ? NAMES_F : NAMES_M), drink: pickR(R, DRINKS), mood: pickR(R, MOODS), grp: null, act: 'idle', goal: '', at: 0, dwell: 2 + R() * 3, think: R() * 3,
        thirst: R() * 0.7, social: 0.3 + R() * 0.5, dance: R() * 0.8, heat: R() * 0.6, wet: 0, stam: 0.6 + R() * 0.4,
        tx: p.x, tz: p.z, ty: p.y, tyaw: p.yaw, pi: 0, pn: 0, spd: WALK * (0.88 + R() * 0.24), stuck: 0, sx: p.x, sz: p.z, then: null, slot: null, q: null, say: '', sayT: 0, sayTo: null,
        swim: !!(plan.wet !== false && p.water && W && W.walk1 != null), anchor: !W || W.walk1 == null || p.role === 'performer' || p.zone === 'dj' || (p.y > 0.3 && p.zone === 'vip'),
        hx: p.hx, hz: p.hz, hy: p.y, hyaw: p.base, pose: '', roll: 0, bob: R() * TAU, last: '', meet: 0, you: 0, spk: 0, partner: null, i: C.people.indexOf(p),
      };
      if (p.staff) { L.name = p.role === 'security' ? pickR(R, ['Big Mike', 'Andre', 'Tank', 'Ray']) : p.role === 'photographer' ? pickR(R, ['Jules', 'Kofi', 'Mateo']) : p.role === 'server' ? pickR(R, ['Bianca', 'Lori', 'Gabi']) : pickR(R, ['Starla', 'Vee', 'Roxy']); L.mood = 'working'; L.drink = 'water'; continue; }
      if (L.anchor) continue;
      if (left <= 0) { G = { id: gi++, m: [], x: p.hx, z: p.hz, water: false, act: '', bday: false, spot: null }; this.groups.push(G); left = R() < 0.25 ? 1 : 2 + Math.floor(R() * 3); }
      G.m.push(p); L.grp = G; left--;
    }
    for (const G of this.groups) for (const p of G.m) { const o = G.m.filter((q) => q !== p); p.L.friend = o.length ? o[0].L.name : 'Sam'; }
    // (the birthday: a group by the host's cabana, its bottle on the way when the night peaks)
    const big = this.groups.filter((g) => g.m.length >= 3); if (big.length) { const B = pickR(R, big); B.bday = true; this.bday = B; }
    for (const p of C.people) if (p.L) { p.L.hx = p.hx; p.L.hz = p.hz; p.L.home = { x: p.hx, z: p.hz, y: p.y, yaw: p.base, pose: p.t }; }
    this.ready = true;
    void pats;
  }

  // ---- poses: a person's own kit in another pose (their W: pose -> template index) -----------------------------------
  pose(p, pose, alt = null, swap = false) {
    const W = p.W; if (!W) return;
    const t = W[pose] ?? W[FALL[pose]] ?? W.talk ?? p.t, a = alt ? W[alt] ?? -1 : -1;
    if (p.t !== t || p.alt !== a || p.swap !== swap) { p.t = t; p.alt = a; p.swap = swap; p.cur = 0; this.C._dirty = true; }
    p.L.pose = pose;
  }
  say(p, list, dur = 3, to = null) {
    const L = p.L; if (!L) return; const s = typeof list === 'string' ? list : pickR(this.R, list);
    L.say = fill(s, { name: L.name, drink: L.drink, friend: L.friend || 'babe', dj: this.plan.djName || 'the DJ', mood: L.mood }); L.sayT = dur; L.sayTo = to; this.sayN++;
  }
  /** off somewhere: a path to (x, z), then (act, pose) there, facing yaw */
  go(p, x, z, then, swim = null) {
    const L = p.L, sw = swim ?? (L.swim && this.nav.typeAt(x, z) >= 2), o = (L.i * PMAX) * 2;
    const n = this.nav.find(p.x, p.z, x, z, sw || this.nav.typeAt(p.x, p.z) >= 2, this.path.subarray(o, o + PMAX * 2));
    L.then = then; L.tx = x; L.tz = z; L.stuck = 0; L.sx = p.x; L.sz = p.z;
    if (!n) { L.pn = 0; return false; }
    L.pn = n; L.pi = 0; L.act = then?.walk || 'walk'; L.at = 0; L.roll = 0; p.seat = false;
    return true;
  }
  /** arrived: what they came for */
  _arrive(p) {
    const L = p.L, T = L.then; L.pn = 0; L.at = 0;
    if (!T) { L.act = 'idle'; this.pose(p, 'talk'); return; }
    if (T.y != null) p.y = T.y; if (T.yaw != null) L.tyaw = T.yaw;
    L.act = T.act; L.dwell = T.dwell ?? 6 + this.R() * 8; p.seat = !!T.seat;
    this.pose(p, T.pose || 'talk', T.alt || null, !!T.swap);
    if (T.fn) T.fn(p);
  }
  _free(list) { const f = list.filter((s) => !s.p); return f.length ? pickR(this.R, f) : null; }
  /** of a few picked at random (free ones, k of them), the nearest to p: people mostly go somewhere close by */
  _near(p, list, k = 3, free = true) {
    let best = null, bd = 1e9; const n = list.length; if (!n) return null;
    for (let i = 0, got = 0; i < k * 4 && got < k; i++) { const s = list[Math.floor(this.R() * n) % n]; if (free && s.p) continue; got++; const d = (s.x - p.x) ** 2 + (s.z - p.z) ** 2; if (d < bd) { bd = d; best = s; } }
    return best || (free ? this._free(list) : list[0]);
  }
  _release(p) {
    const L = p.L; if (L.slot) { if (L.slot.p === p) L.slot.p = null; L.slot = null; }
    if (L.q) { const i = L.q.line.indexOf(p); if (i >= 0) L.q.line.splice(i, 1); L.q = null; }
    if (L.partner?.L?.partner === p) L.partner.L.partner = null; L.partner = null;
  }

  // ---- what next: needs, the phase, who they are with --------------------------------------------------------------
  _decide(p) {
    const L = p.L, R = this.R, E = this.energy, night = this.plan.night, G = L.grp, inW = this.nav.typeAt(p.x, p.z) >= 2;
    if (p.staff) return this._staff(p);
    // (a group's lead chooses for all of them, now and then; the others follow, unless a need of their own is pressing)
    const lead = G && G.m[0] === p, wet = L.wet > 0.3 && !inW;
    const U = {
      bar: L.thirst * 1.3 + (L.mood === 'tipsy' ? 0.2 : 0),
      dance: L.dance * (0.25 + E) * (this.phase === 'Quiet' ? 0 : 1) + (this.dropUntil > this.C.B ? 0.5 : 0),
      swim: L.swim ? L.heat * (night ? 1.05 : 1.45) + (inW ? 0.35 : 0) + 0.1 : -1,
      chat: L.social * 0.9 + (G && G.m.length > 1 ? 0.15 : 0),
      lounge: (1 - L.stam) * 0.9 + (this.phase === 'Last hour' || this.phase === 'Quiet' ? 0.35 : 0) + (1 - E) * 0.2,
      dry: wet ? 1.4 : -1,
    };
    let best = 'chat', bv = -9; for (const k in U) { const v = U[k] + R() * 0.25; if (v > bv) { bv = v; best = k; } }
    if (G && !lead && G.act && L.thirst < 0.8 && !wet && R() < 0.75) best = G.act;
    if (best === 'swim' && !L.swim) best = 'chat';
    if (lead && G) G.act = best;
    this._release(p);
    if (inW && best !== 'swim' && best !== 'dance') { this._leaveWater(p, best); return; }
    this['_' + best](p);
  }
  _staff(p) {
    const L = p.L, R = this.R, P = this.plan;
    if (p.role === 'security') { const w = P.patrol[(L.wp = ((L.wp ?? Math.floor(R() * P.patrol.length)) + 1) % P.patrol.length)]; this.go(p, w.x, w.z, { act: 'patrol', pose: 'cross', dwell: 3 + R() * 5, walk: 'patrol' }); return; }
    if (p.role === 'photographer') {
      const tg = pickR(R, this.groups.filter((g) => g.spot && g.m.length > 1 && g.m.every((q) => q.on))) || null;
      if (!tg) { L.dwell = 3; return; }
      const a = R() * TAU, x = tg.spot.x + Math.cos(a) * 2.2, z = tg.spot.z + Math.sin(a) * 2.2;
      if (this.nav.typeAt(x, z) !== 1) { L.dwell = 2; return; }
      this.go(p, x, z, { act: 'photo', pose: 'photo', dwell: 4.5, yaw: Math.atan2(-(tg.spot.z - z), tg.spot.x - x), fn: () => { for (const q of tg.m) if (q.on && q.L.act !== 'walk') { q.L.tyaw = Math.atan2(-(z - q.z), x - q.x); this.pose(q, pickR(R, ['cheer', 'toast', 'talk'])); q.L.dwell = Math.max(q.L.dwell, q.L.at + 4); } this.say(pickR(R, tg.m), SAY.photo); } });
      return;
    }
    if (p.role === 'server') {
      if (L.parade) return;
      if (L.act === 'serve' || !L.out) {   // (out with a bottle to a table someone is at, then back for the next)
        const busy = this.seats.filter((s) => s.p && (s.kind === 'cabana' || s.kind === 'daybed')), s = pickR(R, busy);
        if (!s) { L.dwell = 4; return; }
        const x = s.x + Math.cos(s.yaw) * 0.9, z = s.z - Math.sin(s.yaw) * 0.9; L.out = true;
        this.go(p, x, z, { act: 'serve', pose: 'drink', dwell: 3 + R() * 2, yaw: s.yaw + Math.PI, walk: 'serve', fn: () => { if (s.p) this.say(s.p, SAY.serve, 2.2); } });
      } else { L.out = false; this.go(p, P.service.x, P.service.z, { act: 'serve', pose: 'drink', dwell: 4 + R() * 6, yaw: Math.PI / 2, walk: 'serve' }); }
      return;
    }
    L.dwell = 9999;   // (the podium's dancers stay up there)
  }
  _leaveWater(p, next) {
    const P = this.plan.pool, x = clamp(p.x, P.x0 + 1, P.x1 - 1), z = P.z1 + 0.9;
    this.go(p, x, z, { act: 'idle', pose: 'talk', dwell: 0.1, fn: () => { p.L.wet = 1; } }, true);
    p.L.act = 'wade';
  }
  _bar(p) {
    const L = p.L, Q = this.R() < 0.75 ? this._near(p, this.queues.map((q) => ({ q, x: q.spots[0].x, z: q.spots[0].z })), 2, false)?.q : pickR(this.R, this.queues); if (!Q) return this._chat(p);
    L.q = Q; Q.line.push(p); const k = Q.line.length - 1, s = Q.spots[Math.min(k, Q.spots.length - 1)];
    this.go(p, s.x + (k >= Q.spots.length ? (this.R() - 0.5) * 0.6 : 0), s.z, { act: 'queue', pose: 'talk', dwell: 999, yaw: s.yaw ?? Math.PI / 2 });
  }
  /** the queues move up: the first in line to a free slot at the counter, the rest a place forward */
  _queues() {
    for (const Q of this.queues) {
      const s = Q.slots.find((x) => !x.p), h = Q.line[0];
      if (s && h && h.L.act === 'queue') {
        Q.line.shift(); s.p = h; h.L.slot = s; h.L.q = null;
        this.go(h, s.x, s.z, { act: 'order', pose: 'gesture', dwell: 2.5 + this.R() * 2, yaw: s.yaw, fn: (p) => this.say(p, SAY.order, 2.4) });
      }
      Q.line.forEach((p, i) => { const sp = Q.spots[Math.min(i, Q.spots.length - 1)]; if (p.L.act === 'queue' && Math.hypot(p.x - sp.x, p.z - sp.z) > 0.5 && i < Q.spots.length) this.go(p, sp.x, sp.z, { act: 'queue', pose: pickR(this.R, ['talk', 'drink']), dwell: 999, yaw: sp.yaw ?? Math.PI / 2 }); });
    }
  }
  _chat(p) {
    const L = p.L, G = L.grp, R = this.R, P = this.plan;
    // (with their group: where the lead stands, else a spot of their own on the deck (or the shelf, wet ones))
    let c = G?.spot && G.m[0] !== p ? G.spot : null;
    if (!c) { const W = L.swim && R() < 0.3 && L.wet > 0.2 ? P.chat.filter((s) => s.water) : P.chat.filter((s) => !s.water); c = this._near(p, W.length ? W : P.chat, 3, false); if (G) G.spot = c; }
    const n = G ? G.m.length : 1, k = G ? G.m.indexOf(p) : 0, a = (k / Math.max(1, n)) * TAU + (G?.id || 0), r = n <= 1 ? 0 : 0.42 + n * 0.08;
    const x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r;
    this.go(p, x, z, { act: 'chat', pose: R() < 0.5 ? 'drink' : 'talk', dwell: 35 + R() * 40, yaw: Math.atan2(-(c.z - z), c.x - x), y: this._floor(x, z) });
  }
  _dance(p) {
    const L = p.L, R = this.R, G = L.grp, water = L.swim && R() < 0.65;
    const opts = this.dances.filter((s) => !s.p && (s.water ? water : true)); const s = this._near(p, opts.length ? opts : this.dances, 4); if (!s || s.p) return this._chat(p);
    s.p = p; L.slot = s;
    // (a couple: two of a group facing each other; the rest of the floor faces the DJ - a crew keeps one phase)
    const mate = G && G.m.length === 2 && G.m[0] === p ? G.m[1] : null;
    this.go(p, s.x, s.z, { act: 'dance', pose: 'dance1', alt: 'dance2', swap: true, dwell: 40 + R() * 45, yaw: s.yaw, y: s.y, fn: (q) => { q.misc[0] = G ? (G.id % 4) * 0.4 : q.misc[0]; this.C._dirty = true; } });
    if (mate && mate.L.act !== 'walk') {
      const a = s.yaw, x = s.x + Math.cos(a) * 0.75, z = s.z - Math.sin(a) * 0.75; this._release(mate); L.partner = mate; mate.L.partner = p;
      this.go(mate, x, z, { act: 'couple', pose: 'dance1', alt: 'dance2', swap: true, dwell: 40 + R() * 40, yaw: a + Math.PI, y: this._floor(x, z) });
      L.then.act = 'couple'; L.then.yaw = a;
    }
  }
  _swim(p) {
    const L = p.L, R = this.R, S = this.plan.swim, s = this._near(p, S, 3, false), f = R() < 0.35;
    L.wet = 1;
    this.go(p, s.x + (R() - 0.5) * 2, s.z + (R() - 0.5) * 1.5, { act: f ? 'float' : 'swim', pose: f ? 'talk' : 'walk1', dwell: 30 + R() * 35, yaw: R() * TAU, walk: 'swim' }, true);
  }
  _lounge(p) {
    const L = p.L, R = this.R, night = this.plan.night;
    const pool = night && R() < 0.4 && this.fires.some((s) => !s.p) ? this.fires : this.seats; const s = this._near(p, pool, 3); if (!s || s.p) return this._chat(p);
    s.p = p; L.slot = s;
    this.go(p, s.x, s.z, { act: pool === this.fires ? 'fire' : 'lounge', pose: 'sitBooth', seat: true, dwell: 60 + R() * 70, yaw: s.yaw, y: s.y ?? 0 });
  }
  _dry(p) {
    const L = p.L, T = this.plan.towel, R = this.R;
    this.go(p, T.x + (R() - 0.5) * 1.2, T.z, { act: 'towel', pose: 'talk', dwell: 2.5, yaw: T.yaw, fn: (q) => { this.say(q, SAY.towel, 2); const s = pickR(R, this.plan.sun); q.L.after = s; } });
  }
  _floor(x, z) { try { return +this.plan.heightAt(x, z) || 0; } catch (_) { return 0; } }

  // ---- every frame --------------------------------------------------------------------------------------------------
  pre(dt) {
    if (!this.ready) return;
    const C = this.C, R = this.R, B = C.B; this.t += dt; this.budget = 3; const t0 = performance.now();
    // (the walk: every walker on one clock, two poses in turn - one re-pack a step, not one a person)
    this.walkClock += dt; let flip = false; if (this.walkClock > 0.34) { this.walkClock = 0; this.walkPh ^= 1; flip = true; }
    // (the DJ's drop: at the peak, every so often - the floor's hands up and jumping for a bar or two)
    const bi = Math.floor(B);
    if (bi !== this.lastBeat) {
      this.lastBeat = bi;
      if (bi >= this.nextDrop) { this.nextDrop = bi + 32 * (1 + Math.floor(R() * 2)); if (this.energy > 0.7 && R() < 0.75) { this.dropUntil = B + 8; this._drop(); } }
    }
    this.thinkAcc = (this.thinkAcc || 0) + dt; const slow = this.thinkAcc > 0.25; if (slow) { try { this.phase = this.plan.phase?.() || this.phase; } catch (_) { /* */ } this._queues(); this._events(this.thinkAcc); this.thinkAcc = 0; }
    for (const p of C.people) {
      const L = p.L; if (!L) continue;
      if (L.sayT > 0) L.sayT -= dt;
      // (arriving: in at the door, through the host's check; leaving: out the same way)
      if (p.wantOn && !p.on) { if (!L.anchor && !p.staff && this.plan.door) this._enter(p); else { p.on = true; C._dirty = true; } continue; }
      if (!p.on) continue;
      if (p.wantOn) L.offT = 0; else L.offT = (L.offT || 0) + dt;   // (a share of the room going: only once the night has been thinning a while - never a walk-out as the room is shown)
      if (!p.wantOn && L.act !== 'leave' && L.offT > 25) { if (L.anchor || p.staff) { p.on = false; C._dirty = true; continue; } this._release(p); this.go(p, this.plan.door.x, this.plan.door.z + 0.6, { act: 'leave', pose: 'talk', dwell: 0.1, fn: (q) => { q.on = false; C._dirty = true; q.L.act = 'gone'; } }); L.act = 'leave'; continue; }
      // (needs: thirst and the rest rise; what they are doing eases them)
      const a = L.act;
      L.thirst = clamp(L.thirst + dt * (a === 'sip' ? -0.03 : 0.0065), 0, 1.2); L.social = clamp(L.social + dt * (a === 'chat' || a === 'greet' ? -0.012 : 0.006), 0, 1.2);
      L.dance = clamp(L.dance + dt * (a === 'dance' || a === 'couple' || a === 'circle' ? -0.01 : 0.006 * (0.4 + this.energy)), 0, 1.2);
      L.heat = clamp(L.heat + dt * (a === 'swim' || a === 'float' || a === 'splash' || a === 'wade' ? -0.03 : this.plan.night ? 0.003 : 0.009), 0, 1.2);
      L.stam = clamp(L.stam + dt * (a === 'lounge' || a === 'fire' ? 0.02 : a === 'dance' || a === 'swim' ? -0.008 : -0.001), 0, 1); if (L.wet > 0 && a !== 'swim' && a !== 'float' && a !== 'splash') L.wet = Math.max(0, L.wet - dt * (a === 'dry' ? 0.05 : 0.01));
      if (L.pn) this._walk(p, dt, flip); else if (!L.anchor) this._stay(p, dt);
      else if (p.staff) this._stay(p, dt);
    }
    // (people walking through others step round them: a little separation, only for whoever is on the move)
    if (slow) this._apart();
    this.ms = (this.ms || 0) * 0.95 + (performance.now() - t0) * 0.05;
  }
  _walk(p, dt, flip) {
    const L = p.L, o = L.i * PMAX * 2, P = this.path; let x = P[o + L.pi * 2], z = P[o + L.pi * 2 + 1];
    const typ = this.nav.typeAt(p.x, p.z), water = typ >= 2, deep = typ === 3, swimming = deep || L.act === 'swim' && water;
    const sp = (swimming ? SWIM : water ? WADE : L.spd) * (L.act === 'leave' ? 1.15 : 1);
    let dx = x - p.x, dz = z - p.z, d = Math.hypot(dx, dz);
    if (d < 0.12) { if (++L.pi >= L.pn) { this._arrive(p); return; } x = P[o + L.pi * 2]; z = P[o + L.pi * 2 + 1]; dx = x - p.x; dz = z - p.z; d = Math.hypot(dx, dz); }
    const k = Math.min(d, sp * dt); p.x += (dx / d) * k; p.z += (dz / d) * k; p.hx = p.x; p.hz = p.z;
    const yaw = Math.atan2(-dz, dx); let dy = yaw - p.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); p.yaw += dy * Math.min(1, dt * 8); p.want = p.yaw; p.base = p.yaw;
    // (the body: on its feet over the floor; swimming, laid flat at the surface; wading, sunk to the knees or the waist)
    const fl = this._floor(p.x, p.z);
    if (swimming) { L.roll = -Math.PI / 2; p.y = this.plan.pool.wl - 0.07 + Math.sin(this.t * 3 + L.bob) * 0.025; if (L.pose !== 'walk1') this.pose(p, 'walk1', null, false); }
    else { L.roll = 0; p.y += (fl - p.y) * Math.min(1, dt * 10); const w = L.act === 'serve' || L.then?.walk === 'serve' ? 'walkS' : L.act === 'patrol' ? 'walk1' : 'walk1'; if (flip || (L.pose !== 'walk1' && L.pose !== 'walk3')) this.pose(p, (this.walkPh ^ (L.i & 1)) ? 'walk3' : 'walk1'); void w; }
    // (stuck: hardly a step in three seconds - another way, else somewhere else)
    L.stuck += dt; if (L.stuck > 3) { if (Math.hypot(p.x - L.sx, p.z - L.sz) < 0.25) { L.fail = (L.fail || 0) + 1; if (L.fail > 2) { L.fail = 0; const c = this.nav.near(p.x, p.z, L.swim || water); if (c >= 0) { p.x = this.nav.cx(c); p.z = this.nav.cz(c); } L.pn = 0; L.act = 'idle'; L.dwell = 0.5; L.at = 0; } else this.go(p, L.tx, L.tz, L.then); } L.stuck = 0; L.sx = p.x; L.sz = p.z; }
    C_write(this.C, p);
  }
  /** standing (sitting, swimming) where they are: turns, turns to talk, a sip, the floor's jumps - and, their time up, what next */
  _stay(p, dt) {
    const L = p.L, R = this.R, C = this.C; L.at += dt;
    let dy = Math.atan2(Math.sin(L.tyaw - p.yaw), Math.cos(L.tyaw - p.yaw)); if (Math.abs(dy) > 0.01 && !p.staff) { p.yaw += dy * Math.min(1, dt * 4); p.want = p.yaw; p.base = p.yaw; C_write(C, p); }
    const a = L.act;
    if (a === 'swim' || a === 'float') {   // (drifting about the deep water: a stroke, a float on the back)
      L.roll = a === 'float' ? Math.PI / 2 : -Math.PI / 2; p.y = this.plan.pool.wl - (a === 'float' ? 0.04 : 0.07) + Math.sin(this.t * 2 + L.bob) * 0.03;
      if (a === 'swim') { const sp = SWIM * 0.6 * dt, nx = p.x + Math.cos(p.yaw) * sp, nz = p.z - Math.sin(p.yaw) * sp; if (this.nav.typeAt(nx, nz) === 3) { p.x = nx; p.z = nz; } else { L.tyaw = p.yaw + Math.PI * (0.6 + R() * 0.8); } }
      else { p.x += Math.cos(this.t * 0.2 + L.bob) * dt * 0.05; }
      p.hx = p.x; p.hz = p.z; C_write(C, p);
    } else if (L.roll) { L.roll = 0; C_write(C, p); }
    if (a === 'chat' && L.grp) {   // (taking turns: one talks - their hands going - the others listen, sip, laugh)
      const G = L.grp; if (G.m[0] === p && (G.spkT = (G.spkT || 0) - dt) <= 0) {
        const near = G.m.filter((q) => q.on && q.L.act === 'chat'); G.spkT = 2.5 + R() * 3;
        if (near.length > 1) { const s = pickR(R, near); for (const q of near) this.pose(q, q === s ? 'gesture' : R() < 0.4 ? 'drink' : 'talk'); const ex = pickR(R, TALK), o = near.find((q) => q !== s); this.say(s, ex[0], 2.6, o?.L.name); if (o) setTimeoutLine(this, o, ex[1], 1.6); if (R() < 0.18) { const l = pickR(R, near.filter((q) => q !== s)); if (l) { this.pose(l, 'cheer'); this.say(l, SAY.laugh, 2); } } if (R() < 0.08) for (const q of near) { this.pose(q, 'toast'); if (q === s) this.say(q, SAY.toast, 2); } }
      }
    }
    if (a === 'dance' || a === 'couple' || a === 'circle' || a === 'crew') {   // (the drop: hands up, a jump on every beat)
      const up = this.dropUntil > C.B; if (up && L.pose !== 'cheer') this.pose(p, 'cheer'); else if (!up && L.pose === 'cheer') this.pose(p, 'dance1', 'dance2', true);
      const base = L.then?.y ?? this._floor(p.x, p.z), j = up && base > -0.5 ? 0.11 * Math.abs(Math.sin(Math.PI * C.B)) : 0; if (Math.abs(p.y - (base + j)) > 0.004) { p.y = base + j; C_write(C, p); }
    }
    if (a === 'towel' && L.at > L.dwell && L.after) { const s = L.after; L.after = null; this.go(p, s.x + (R() - 0.5), s.z + (R() - 0.5), { act: 'dry', pose: 'talk', dwell: 15 + R() * 15, yaw: R() * TAU }); return; }
    if (a === 'order' && L.at > L.dwell) { this.say(p, SAY.serve, 1.6); this.plan.served?.(L.slot); L.thirst = Math.max(0, L.thirst - 0.4); L.act = 'sip'; L.at = 0; L.dwell = 8 + R() * 8; this.pose(p, 'drink'); if (L.slot) { L.slot.p = null; L.slot = null; } return; }
    if (a === 'sip' && L.at > L.dwell) { L.thirst = 0; this._chat(p); return; }
    if (a === 'queue') return;
    if (a === 'greet' && L.at > 1.4) { this.pose(p, 'talk'); L.act = 'chat'; }
    if (a === 'arrive' && L.at > L.dwell) {
      if (L.meet && L.grp?.spot) { L.meet = 0; this._chat(p); if (L.then) { L.then.act = 'greet'; L.then.pose = 'cheer'; L.then.fn = (q) => this.say(q, SAY.hello, 2.4); } return; }
      this._decide(p); return;
    }
    if (a === 'photo' && L.at > L.dwell) this.pose(p, 'talk');
    if (a === 'splash' && L.at > L.dwell) { L.roll = 0; this._swim(p); return; }
    if (a === 'perform') return;
    if (a === 'cannon' && L.jump) { this._jump(p, dt); return; }
    if (a === 'cannon' && L.at > 8) { L.dwell = 0; }
    // (time to choose again: every 2-4 s once their dwell is up)
    if (L.at > L.dwell && (L.think -= dt) <= 0) { if (this.budget-- <= 0) { L.think = 0.05; return; } L.think = 2 + R() * 2; this._decide(p); }
  }
  /** a cannonball: off the edge in an arc, a splash, then a race to the far wall */
  _jump(p, dt) {
    const L = p.L, J = L.jump, P = this.plan.pool;
    if (L.at < J.wait) return;
    J.t = Math.min(1, J.t + dt / 0.8); const u = J.t;
    p.x = J.x0 + (J.x1 - J.x0) * u; p.z = J.z0 + (J.z1 - J.z0) * u; p.hx = p.x; p.hz = p.z;
    p.y = 0.75 * Math.sin(Math.PI * Math.min(1, u * 1.15)) + (P.wl - 0.9) * u * u; C_write(this.C, p);
    if (u >= 1) {
      L.jump = null; L.wet = 1; L.heat = 0; this.plan.splash?.(p.x, p.z, 1.3);
      const f = J.far || { x: -Math.sign(p.x || 1) * (P.x1 - 1.2), z: p.z }; this.go(p, f.x, clamp(f.z, P.z0 + 1, P.shelf - 0.6), { act: 'swim', pose: 'walk1', dwell: 4 + this.R() * 6, yaw: this.R() * TAU, walk: 'swim', fn: (q) => this.say(q, ['Ha! I win!', 'Touch!', 'Rematch!', 'Again!'], 2) }, true);
    }
  }
  _enter(p) {
    const L = p.L, D = this.plan.door, R = this.R, C = this.C;
    p.on = true; C._dirty = true; p.x = D.x + (R() - 0.5) * 1.6; p.z = D.z; p.y = 0; p.yaw = -Math.PI / 2; p.hx = p.x; p.hz = p.z; L.act = 'arrive';
    const H = this.plan.host; this.go(p, H.x + (R() - 0.5) * 0.6, H.z - R() * 0.8, { act: 'arrive', pose: 'talk', dwell: 1.2 + R() * 1.6, yaw: -Math.PI / 2 });
    // (the friends they came with: hello on meeting, the first of them already in)
    const G = L.grp; if (G && G.m.some((q) => q !== p && q.on && q.L.act !== 'arrive' && q.L.act !== 'leave')) L.meet = 1;
  }
  /** the drop: everyone dancing throws their hands up; a few on the deck rush the floor */
  _drop() {
    const R = this.R; let n = 0;
    for (const p of this.C.people) { const L = p.L; if (!L || !p.on || L.anchor) continue; const a = L.act; if (a === 'dance' || a === 'couple' || a === 'circle' || a === 'crew') { if (R() < 0.12 && n++ < 4) this.say(p, SAY.drop, 2); } else if ((a === 'chat' || a === 'sip') && !L.pn && R() < 0.22) { L.dance += 0.6; L.dwell = 0; L.think = 0; } }
  }
  /** the night's set pieces, now and then: a splash fight, a cannonball race, a chant round a circle, the birthday's bottle */
  _events(dt) {
    const E = this.events, R = this.R, C = this.C, P = this.plan; for (const k in E) E[k] -= dt;
    const ppl = C.people;
    if (E.splash <= 0) {
      E.splash = 25 + R() * 30; const sw = ppl.filter((p) => p.on && p.L && (p.L.act === 'swim' || p.L.act === 'float') && !p.L.pn);
      const a = pickR(R, sw), b = a && sw.filter((q) => q !== a && Math.hypot(q.x - a.x, q.z - a.z) < 5).sort((u, v) => Math.hypot(u.x - a.x, u.z - a.z) - Math.hypot(v.x - a.x, v.z - a.z))[0];
      if (a && b) for (const [p, q] of [[a, b], [b, a]]) { const L = p.L; L.act = 'splash'; L.at = 0; L.dwell = 5 + R() * 3; L.roll = 0; p.y = this._floor(p.x, p.z); L.tyaw = Math.atan2(-(q.z - p.z), q.x - p.x); this.pose(p, 'cheer'); this.say(p, SAY.splash, 2); P.splash?.(p.x, p.z, 0.6); C_write(C, p); }
    }
    if (E.cannon <= 0) {
      E.cannon = 40 + R() * 40; const dry = ppl.filter((p) => p.on && p.L?.swim && !p.L.pn && (p.L.act === 'chat' || p.L.act === 'sip' || p.L.act === 'dry') && p.L.grp && p.L.grp.m.length > 1).slice(0, 40);
      const a = pickR(R, dry); if (a) { const G = a.L.grp, e = pickR(R, P.edge); G.m.slice(0, 3).forEach((p, i) => { if (!p.on || !p.L.swim) return; this._release(p); const ox = Math.abs(e.ix - e.x) > Math.abs(e.iz - e.z) ? 0 : (i - 1) * 1.1, oz = ox ? 0 : (i - 1) * 1.1, ex = e.x + ox, ez = e.z + oz; this.go(p, ex, ez, { act: 'cannon', pose: 'cheer', dwell: 99, yaw: Math.atan2(-(e.iz - e.z), e.ix - e.x), fn: (q) => { if (i === 0) this.say(q, SAY.cannon, 2); q.L.jump = { t: 0, wait: 1.6 + i * 0.3, x0: q.x, z0: q.z, x1: e.ix + ox, z1: e.iz + oz, far: e.far }; } }); }); }
    }
    if (E.chant <= 0) {
      E.chant = 30 + R() * 30; const d = ppl.filter((p) => p.on && p.L && (p.L.act === 'dance' || p.L.act === 'crew') && !p.L.pn && this.nav.typeAt(p.x, p.z) === 1);
      const c = pickR(R, d); if (c && this.energy > 0.6) { const ring = d.filter((q) => q !== c && Math.hypot(q.x - c.x, q.z - c.z) < 4).slice(0, 6); ring.forEach((q, i) => { const a = (i / ring.length) * TAU, x = c.x + Math.cos(a) * 1.2, z = c.z + Math.sin(a) * 1.2; if (this.nav.typeAt(x, z) !== 1) return; this._release(q); this.go(q, x, z, { act: 'circle', pose: 'cheer', dwell: 10 + R() * 6, yaw: Math.atan2(-(c.z - z), c.x - x) }); if (i < 2) setTimeoutLine(this, q, pickR(R, SAY.chant), 2 + i); }); if (ring.length >= 3) { c.L.act = 'circle'; c.L.at = 0; c.L.dwell = 12; this.pose(c, 'dance1', 'dance2', true); } }
    }
    if (E.parade <= 0) {
      E.parade = 80 + R() * 60;
      const B = this.bday; if (B && this.energy > 0.85 && B.m.some((p) => p.on)) {
        const at = P.birthday, sv = ppl.filter((p) => p.on && p.role === 'server');
        sv.forEach((s, i) => { s.L.parade = true; s.L.sp = true; this.go(s, at.x + 1.2, at.z + (i - 0.5) * 0.8, { act: 'parade', pose: 'drink', dwell: 9, yaw: Math.PI, walk: 'parade', fn: (q) => { q.L.sp = false; q.L.parade = false; } }); s.L.act = 'parade'; });
        B.m.forEach((p, i) => { if (!p.on) return; this._release(p); const x = at.x + 0.3 + Math.cos(i * 1.3) * 0.7, z = at.z + Math.sin(i * 1.3) * 0.8; this.go(p, x, z, { act: 'cheer', pose: 'cheer', dwell: 14, yaw: Math.atan2(-(at.z - z), at.x - x), fn: (q) => { if (i === 0) this.say(q, SAY.birthday, 2.5); } }); });
        P.say?.(`HAPPY BIRTHDAY ${B.m[0].L.name}`.toUpperCase());
        B.m.forEach((p, i) => SAY.count.forEach((c, k) => setTimeoutLine(this, p, c, 9 + k * 1.1, i === 0)));
      }
    }
  }
  _apart() {
    const ppl = this.C.people;
    for (const p of ppl) {
      if (!p.on || !p.L?.pn) continue;
      for (const q of ppl) {
        if (q === p || !q.on) continue; const dx = p.x - q.x, dz = p.z - q.z, d2 = dx * dx + dz * dz; if (d2 > 0.2 || d2 < 1e-6) continue;
        const d = Math.sqrt(d2), k = (0.45 - d) * 0.5, nx = p.x + (dx / d) * k, nz = p.z + (dz / d) * k;
        if (this.nav.ok(this.nav.cell(nx, nz), this.nav.typeAt(p.x, p.z) >= 2)) { p.x = nx; p.z = nz; p.hx = nx; p.hz = nz; }
      }
    }
  }

  // ---- for the others --------------------------------------------------------------------------------------------------
  bump(x, z, r) {
    const R = this.R; if ((this.bumpT || 0) > this.t) return;
    for (const p of this.C.people) {
      if (!p.on || !p.L || !p._pushed) continue; if ((p.x - x) ** 2 + (p.z - z) ** 2 > r * r) continue;
      this.bumpT = this.t + 2.5 + R() * 2; const w = this.nav.typeAt(p.x, p.z) >= 2;
      this.say(p, w ? SAY.bumpW : SAY.bump, 1.8); p.L.tyaw = Math.atan2(-(z - p.z), x - p.x); return;
    }
  }
  /** you joining a group: standing close by its middle, they open up and face you */
  join(x, z) {
    for (const G of this.groups) {
      if (!G.spot || G.m.length < 2) continue; const d = Math.hypot(G.spot.x - x, G.spot.z - z); if (d > 1.5) continue;
      for (const p of G.m) if (p.on && p.L.act === 'chat' && !p.L.pn) { const a = Math.atan2(-(z - p.z), x - p.x), b = Math.atan2(-(G.spot.z - p.z), G.spot.x - p.x); p.L.tyaw = Math.atan2(Math.sin(a) + Math.sin(b), Math.cos(a) + Math.cos(b)); }
      if (!G.you) { G.you = true; const s = G.m.find((p) => p.on && p.L.act === 'chat'); if (s) this.say(s, ['Oh hey! Join us.', 'Pull up!', 'Hi! We were just talking about you. Kidding.', 'Squeeze in!'], 2.6); }
      return G;
    }
    return null;
  }
  chat(p, cam) {
    const L = p.L; if (!L) return null; const ex = MEET[(L.you++ + L.i) % MEET.length];
    L.tyaw = Math.atan2(-(cam.z - p.z), cam.x - p.x); L.dwell = Math.max(L.dwell, L.at + 8); if (!L.pn) this.pose(p, 'gesture');
    return ex.map((s) => fill(s, { name: L.name, drink: L.drink, friend: L.friend || 'my friends', mood: L.mood }));
  }
  lines(cam, r, out) {
    out.length = 0; for (const p of this.C.people) { const L = p.L; if (!p.on || !L || L.sayT <= 0) continue; if ((p.x - cam.x) ** 2 + (p.z - cam.z) ** 2 < r * r) out.push(p); }
    return out;
  }
  counts() { const c = {}; for (const a of ACTS) c[a] = 0; for (const p of this.C.people) if (p.on && p.L) { const a = p.L.pn ? (p.L.then?.walk === 'swim' ? 'swim' : 'walk') : p.L.anchor ? (p.role === 'performer' ? 'perform' : p.L.pose?.startsWith('dance') ? 'dance' : 'idle') : p.L.act; c[a] = (c[a] || 0) + 1; if (this.nav.typeAt(p.x, p.z) >= 2) c.inWater = (c.inWater || 0) + 1; } return c; }
  info(p) {
    const L = p.L; if (!L) return null;
    return { name: L.name, role: p.role, kit: p.wk || '', act: L.pn ? `walking (${L.then?.act || '?'})` : L.act, goal: L.then?.act || L.act, mood: L.mood, drink: L.drink, group: L.grp ? `${L.grp.m.length} (${L.grp.m.map((q) => q.L.name).join(', ')})` : '-', thirst: L.thirst, social: L.social, dance: L.dance, heat: L.heat, stamina: L.stam, wet: L.wet };
  }
}
// (a pose a kit lacks: the nearest it has)
const FALL = { gesture: 'talk', cheer: 'dance2', toast: 'drink', hug: 'talk', brohug: 'talk', sitBooth: 'talk', walk3: 'walk1', walk2: 'walk1', walk1: 'talk', dance2: 'dance1', dance1: 'talk', photo: 'talk', cross: 'talk', talk: 'drink' };
/** a person's matrix written again (their place, their turn, their roll) */
function C_write(C, p) { if (p.mesh) C._write(p); }
/** a line said a moment later (the answer in an exchange): on the brain's own clock, no timer object kept */
function setTimeoutLine(B, p, text, delay, loud = true) {
  const L = p.L; if (!L) return; (L.later || (L.later = [])).push({ at: B.t + delay, text, loud });
  if (!B._lt) { B._lt = true; const pre = B.pre; B.pre = function (dt) { pre.call(this, dt); for (const q of this.C.people) { const Q = q.L; if (!Q?.later?.length) continue; for (let i = Q.later.length - 1; i >= 0; i--) if (Q.later[i].at <= this.t) { const l = Q.later.splice(i, 1)[0]; if (l.loud) this.say(q, l.text, 2.2); } } }; }
}
