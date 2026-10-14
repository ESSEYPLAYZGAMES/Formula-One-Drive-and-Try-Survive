// Dev only (WP2-venues-engine): stage the after-party's rooms (ui/PartyVenues.js) in the real game for tests and
// renders. Not part of the game or the bundle (tools/ is never bundled).
// Use, on any same-origin page (e.g. /NEXT.md) in a tab of your own:
//   const m = await import('/tools/partyvenue.js?v=1'); m.shim(); await m.boot();      // the game, with its saves redirected
//   await __PV.career('lasvegas');            // a throwaway career raced at that circuit (offers from career/Party.js)
//   await __PV.open('vegasclub');             // the venue staged in the loaded world, run to ready
//   __PV.go(x, z, yaw, pitch); await __PV.shot('pvA_vegasclub_floor');
//   __PV.end(); __PV.clean();                 // the evening closed; the test keys removed
// The user's career (localStorage 'f1sim-career-v2') is never touched: every 'f1sim*' key is redirected to 'wp2t:f1sim*'.

const PFX = 'wp2t:';
/** every f1sim* storage key redirected to a test key of its own (call before the game loads) */
export function shim() {
  const P = Storage.prototype; if (P.__wp2) return; P.__wp2 = true;
  const g = P.getItem, s = P.setItem, r = P.removeItem, map = (k) => (/^f1sim/.test(String(k)) ? PFX + k : k);
  P.getItem = function (k) { return g.call(this, map(k)); };
  P.setItem = function (k, v) { return s.call(this, map(k), v); };
  P.removeItem = function (k) { return r.call(this, map(k)); };
}
/** the game's page written into this document (the window - and the shim - stay) -> resolves once __F1 is up */
export async function boot(timeout = 30000) {
  const html = await fetch('/index.html?wp2=' + Date.now(), { cache: 'no-store' }).then((x) => x.text());
  window.__wp2errs = [];
  window.addEventListener('error', (e) => window.__wp2errs.push(String(e.message || e.error)));
  window.addEventListener('unhandledrejection', (e) => window.__wp2errs.push('rej: ' + String(e.reason?.message || e.reason)));
  document.open(); document.write(html); document.close();
  const t0 = performance.now();
  while (!window.__F1 && performance.now() - t0 < timeout) await new Promise((res) => setTimeout(res, 100));
  return !!window.__F1;
}

const F = () => window.__F1;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let now = 0;
const PV = {
  c: null, res: null, api: null,
  /** a throwaway career (not saved over the user's: the shim) with one race simulated at trackId -> its offers */
  async career(trackId = 'lasvegas', driver = 0) {
    const C = F().Career, c = C.create({ driver, tracks: [trackId, trackId === 'lasvegas' ? 'silverstone' : 'lasvegas'], rounds: 4 });
    try { c.simRace?.(); } catch (e) { console.warn('[PV] simRace', e); }
    this.c = c; let off = [];
    try { off = F().Party.partyOffers(c) || []; } catch (e) { console.warn('[PV] offers', e); }
    return off.map((o) => ({ id: o.id, venue: o.venue, ok: o.ok, why: o.why, brand: o.brand, people: (o.people || []).length }));
  },
  /** the launch for a venue: the career's offer if it has one, else a hand-made one */
  launch(venue = 'vegasclub', o = {}) {
    const P = F().Party, c = this.c; let L = null;
    if (c) { try { const off = (P.partyOffers(c) || []).find((x) => x.venue === venue); if (off) L = P.partyLaunch(c, off.id, o.act || 1, o.carry || null, o); } catch (e) { console.warn('[PV] launch', e); } }
    if (!L) L = { key: 'party', partyId: 'wp2|' + venue, venue, host: venue === 'teamparty' ? 'team' : 'club', track: venue === 'londonclub' ? 'silverstone' : 'lasvegas', night: true, act: 1, guests: o.guests || [], drama: [] };
    if (o.brand !== undefined) L.brand = o.brand;
    if (o.night !== undefined) L.night = o.night;
    return L;
  },
  /** the venue staged in the real world (the race's track loaded first) and run until it is ready (or timeout s) */
  async open(venue = 'vegasclub', o = {}) {
    const L = this.launch(venue, o); this.L = L; this.res = null;
    if (F().W?.def?.id !== L.track && !(venue === 'londonclub' && o.unhosted)) await F().switchTrack(L.track);
    F().party(venue, { c: this.c, launch: L, ...(o.sw || {}) }).then((r) => { this.res = r; });
    const t0 = performance.now(); now = now || performance.now();
    while (performance.now() - t0 < (o.timeout || 30000)) {
      for (let i = 0; i < 4; i++) { now += 33; F().frame(now); }
      const api = window.__hangout; if (api?.state?.ready) { this.api = api; break; }
      await sleep(30);
    }
    this.api = window.__hangout || null;
    return this.api?.state ? { ready: this.api.state.ready, guests: this.api.state.guests.length, hosted: this.api.state.hosted?.anchor || null, hots: this.api.state.hots } : null;
  },
  /** n frames of the game's loop (dt ~33 ms) */
  step(n = 1, dt = 33) { for (let i = 0; i < n; i++) { now += dt; F().frame(now); } return this.api?.state?.clock; },
  /** you at (x, z) in the venue's frame, looking along yaw (0 = +x), pitch up/down; then a couple of frames */
  go(x, z, yaw = null, pitch = null, y = null) { const ev = this.ev(); if (!ev) return null; ev.pos.x = x; ev.pos.z = z; if (y != null) ev.pos.y = y; if (yaw != null) ev.yaw = yaw; if (pitch != null) ev.pitch = pitch; this.step(3); return { zone: this.api.zone, seal: this.api.seal }; },
  /** the Evening behind the api (tests) */
  ev() { const p = window.__partyPlay; return p?.ev || null; },
  /** the frame rendered at w x h and saved via the 8768 shot server as <name>.jpg */
  async shot(name, w = 1366, h = 768) {
    const R = F().renderer, cam = F().camera;
    R.setPixelRatio(1); R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    now += 33; F().frame(now); R.setPixelRatio(1); R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); R.render(F().scene, cam);
    const info = { calls: R.info.render.calls, tris: R.info.render.triangles, programs: R.info.programs?.length };
    const url = R.domElement.toDataURL('image/jpeg', 0.9);
    const r = await fetch('http://127.0.0.1:8768/save?name=' + encodeURIComponent(name), { method: 'POST', body: url }).then((x) => x.text()).catch((e) => 'ERR ' + e);
    return { name, info, r: String(r).slice(0, 120) };
  },
  /** the evening closed now (its result into this.res via the frame loop) */
  async end() { try { this.api?.finish?.('normal'); } catch (_) { /* */ } for (let i = 0; i < 80 && !this.res; i++) { this.step(3); await sleep(20); } return this.res ? { left: this.res.left, venue: this.res.venue, party: !!this.res.party } : null; },
  /** the test keys out of storage */
  clean() { const ks = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PFX)) ks.push(k); } for (const k of ks) localStorage.removeItem(k); return ks.length; },
};
window.__PV = PV;
export { PV };
