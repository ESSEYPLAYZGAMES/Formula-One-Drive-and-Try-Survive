// Dev only (not part of the game or the bundle): the pool club (src/ui/PartyPool.js) staged by ui/Hangout.js without the
// game - a copy of Hangout.js patched in memory (the drawing buffer kept, the evening on window.__ev, __poolParty: run it
// as a party, the crowd made by V.crowdMake), unhosted; __PV.real() opens the real module. Shots go through the scratch
// screenshot server on 8768; tools/pooltest.html?poolauto&plan=[...] runs a whole plan headless. From any dev page:
//   await import('/tools/pooltest.js')
//   await __PV.open({ day: false, guests: [{ kind: 'celeb', id: 'mira-vale' }], wet: false, party: false })
//   __PV.cam([x, y, z], [lx, ly, lz]); await __PV.shot('pvP_name', 1600, 900); __PV.stats(); __PV.close()
const BASE = new URL('../src/ui/', import.meta.url).href;
let H = null;
async function hangout() {
  if (H) return H;
  let src = await (await fetch(BASE + 'Hangout.js', { cache: 'no-store' })).text();
  src = src.replace(/from '(\.\.?\/[^']+)'/g, (m, p) => `from '${new URL(p, BASE).href}'`);
  const rep = (a, b) => { if (!src.includes(a)) throw new Error('pooltest: patch anchor not found: ' + a.slice(0, 60)); src = src.replace(a, b); };
  rep("antialias: true, powerPreference: 'high-performance'", "antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance'");
  rep('this.api = this._api(); window.__hangout = this.api;', 'this.api = this._api(); window.__hangout = this.api; window.__ev = this;');
  rep('this.isParty = isPartyVenue(this.vid)', "this.isParty = (!!window.__poolParty && (this.vid === 'poolclub' || this.vid === 'dayclub')) || isPartyVenue(this.vid)");
  // (the swimwear crowd hook Hangout would need: the venue's own crowd when it brings one)
  if (!src.includes('V.crowdMake')) rep('const C = this.crowd = new PartyCrowd({', 'const C = this.crowd = (V.crowdMake || ((q) => new PartyCrowd(q)))({');
  // (Hangout registers the pool club itself - its '// pool hook' block)
  if (!src.includes('POOL_PLACES')) throw new Error('pooltest: Hangout.js has no pool hook');
  const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
  H = await import(url);
  return H;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const frames = (n = 2) => new Promise((r) => { const f = () => (--n <= 0 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
window.__PV = {
  async open(o = {}) {
    const M = await hangout();
    if (window.__hangout) { try { window.__hangout.dispose?.(); } catch (_) { /* */ } window.__hangout = null; }
    document.getElementById('hangout')?.remove();
    window.__poolWet = !!o.wet; window.__poolParty = !!o.party;
    const t0 = performance.now(), errs = [];
    const oe = console.error, ow = console.warn; console.error = (...a) => { errs.push('E ' + a.map((x) => String(x?.stack || x)).join(' ')); oe.apply(console, a); }; console.warn = (...a) => { errs.push('W ' + a.map((x) => String(x?.stack || x)).join(' ')); ow.apply(console, a); };
    const onErr = (e) => errs.push('U ' + String(e?.error?.stack || e?.message || e?.reason?.stack || e?.reason || e)); addEventListener('error', onErr); addEventListener('unhandledrejection', onErr);
    try {
      M.showHangout({ c: null, venue: o.day ? 'dayclub' : 'poolclub', guests: o.guests || [], night: !o.day, key: o.party ? 'party' : 'hangout', occasion: o.occ, ...(o.extra || {}) });
      const ev = window.__ev; if (!ev) return { ok: false, errs };
      while (!ev.ready && performance.now() - t0 < 35000 && !ev.disposed) await wait(100);
      await frames(3);
      // (later in the night: the clock on o.hours past the start, everyone due by then stood in place at once)
      if (o.hours && ev.ready) { ev.tl = (o.hours * 3600) / (ev.P.rate || 15); await frames(6); try { ev.crowd?.snap?.(); } catch (_) { /* */ } await frames(2); }
      return { ok: !!ev.ready, ms: Math.round(performance.now() - t0), errs, crowd: ev.crowd?.stats?.() || null, occ: ev.occ, party: ev.isParty };
    } finally { await frames(30); console.error = oe; console.warn = ow; removeEventListener('error', onErr); removeEventListener('unhandledrejection', onErr); }
  },
  /** the real (unpatched) ui/Hangout.js: the venue opens, the cover lifts, no error -> { ok, ms, errs } */
  async real(o = {}) {
    const M = await import('/src/ui/Hangout.js'), t0 = performance.now(), errs = [];
    const oe = console.error, ow = console.warn; console.error = (...a) => { errs.push('E ' + a.map((x) => String(x?.stack || x)).join(' ')); oe.apply(console, a); }; console.warn = (...a) => { errs.push('W ' + a.map((x) => String(x?.stack || x)).join(' ')); ow.apply(console, a); };
    try {
      const api = M.showHangout({ c: null, venue: o.venue || 'poolclub', guests: o.guests || [], night: o.night !== false, key: 'hangout' });
      while (!document.querySelector('#hangout .hg-cover.off') && performance.now() - t0 < 30000) await wait(100);
      await frames(20);
      const ok = !!document.querySelector('#hangout .hg-cover.off'); try { api?.dispose?.(); } catch (e) { errs.push('dispose ' + e); } document.getElementById('hangout')?.remove(); window.__hangout = null;
      return { ok, ms: Math.round(performance.now() - t0), errs: [...new Set(errs.map((e) => e.split('\n').slice(0, 2).join(' | ')))] };
    } finally { console.error = oe; console.warn = ow; }
  },
  /** headless makePerson builds: the looks the pool club dresses people in (its staff, DJ, security, the men's pool
   * looks) and the club kits its crowd falls back to, in every pose asked -> { n, maxTris, bad: [...] } */
  async stress(o = {}) {
    const P = await import('/src/world/People.js'), Pool = await import('/src/ui/PartyPool.js');
    const poses = o.poses || ['talk', 'sit', 'cheer', 'shove', 'kneel', 'mourn', 'dance1', 'drink', 'sitBooth'];
    const looks = [];
    for (let h = 1; h < 40; h += 3) { looks.push(Pool.poolDriverLook(h * 2654435761 >>> 0, true)); looks.push(Pool.poolDriverLook(h * 40503 >>> 0, false, h % 2 === 1)); }
    looks.push({ kit: 'knitpolo', color: '#111114', accent: '#111114', legs: '#141518' }, { kit: 'casual', color: '#f2f0ea', accent: '#111114', legs: '#1b2440', shoe: 'trainer', shoes: '#ecebe6' }, { kit: 'polo', color: '#0c0c0e', accent: '#0c0c0e', legs: '#0c0c0e' });
    for (const k of (P.CLUB_KITS || []).slice(0, o.clubN ?? 99)) looks.push({ kit: k, figure: 'f', color: '#b5121b', accent: '#0d0d10', style: { hs: 'long', lip: true } });
    for (const k of P.CLUB_KITS_M || []) looks.push({ kit: k, color: '#111114', accent: '#f1f0ec', legs: '#111114' });
    // (o.swim: only the swimwear - hers and his - as the pool's crowd wears it: q 0.45 / 0.32 like its templates, and full)
    if (o.swim) { looks.length = 0; for (const k of P.SWIM_KITS || []) looks.push({ kit: k, figure: 'f', color: '#e0218a', accent: '#21c4c8', style: { hs: 'long', lip: true } }); for (const k of P.SWIM_KITS_M || []) looks.push({ kit: k, color: '#f4f1ea', accent: '#1b2440', legs: '#1b2440' }); }
    let n = 0, maxTris = 0, maxAt = ''; const bad = [], over = {};
    for (const L of looks) for (const pose of poses) {
      const det = !o.full && n % 3 === 0 ? 0.25 : 1, crowdQ = !o.full && o.swim && n % 3 === 1 ? { q: 0.32, detail: 0.2, club: true } : null;
      try {
        const p = P.makePerson({ ...L, pose, detail: det, seed: 'pv' + n, ...(crowdQ || {}) }); let tri = 0, nan = false;
        p.group.traverse((m) => { if (!m.isMesh) return; const g = m.geometry, a = g.attributes.position; tri += (g.index ? g.index.count : a.count) / 3; for (let i = 0; i < a.array.length; i += 7) if (!Number.isFinite(a.array[i])) { nan = true; break; } });
        if (nan) bad.push(`NaN ${L.kit}/${pose}`); if (det === 1 && !crowdQ && tri > maxTris) { maxTris = tri; maxAt = `${L.kit}/${pose}`; }
        if (det === 1 && !crowdQ && tri > 36000) over[L.kit] = Math.max(over[L.kit] || 0, Math.round(tri));
        p.dispose?.();
      } catch (e) { bad.push(`${L.kit}/${pose}: ${String(e).slice(0, 120)}`); }
      n++; if (n % 20 === 0) await wait(0);
    }
    return { n, maxTris: Math.round(maxTris), maxAt, over, bad: bad.slice(0, 30), nbad: bad.length };
  },
  /** the camera at p looking at l (the venue's frame); walking stopped */
  cam(p, l) {
    const ev = window.__ev; ev.menu = ev.menu || { pv: true }; ev.pos.set(p[0], p[1], p[2]);
    const dx = l[0] - p[0], dz = l[2] - p[2]; ev.yaw = Math.atan2(dz, dx); ev.pitch = Math.atan2(l[1] - p[1], Math.hypot(dx, dz));
  },
  async shot(name, w = 1600, h = 900) {
    const ev = window.__ev, cv = ev.canvas; cv.style.width = w + 'px'; cv.style.height = h + 'px';
    await frames(4);
    const st = (await fetch('http://127.0.0.1:8768/save?name=' + name, { method: 'POST', body: cv.toDataURL('image/jpeg', 0.88) })).status;
    return st;
  },
  stats() {
    const ev = window.__ev, R = ev.renderer, i = R.info; let mesh = 0, tri = 0; ev.scene.traverse((m) => { if (m.isMesh && m.visible) { mesh++; } });
    return { calls: i.render.calls, tris: i.render.triangles, programs: i.programs?.length, geos: i.memory.geometries, tex: i.memory.textures, meshes: mesh, crowd: ev.crowd?.stats?.() || null, spots: ev.V?.crowdSpots?.length, wet: ev.V?.water?.wet };
  },
  close() { try { window.__hangout?.dispose?.(); } catch (e) { console.warn(e); } window.__hangout = null; document.getElementById('hangout')?.remove(); window.__ev = null; },
  /** a JSON log through the screenshot server (it saves the decoded body: NAME.png holds the text) */
  async log(name, obj) { const b = btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 1)))); return (await fetch('http://127.0.0.1:8768/save?name=' + name, { method: 'POST', body: 'data:text/plain;base64,' + b })).status; },
  /** a whole session: [{ open: {...}, shots: [{ name, cam: [p, l], w, h, t (seconds to run first) }] }] -> a log */
  async run(plan, logName = 'pvP_log') {
    const out = [];
    for (const step of plan) {
      const r = { open: step.open || step.real, res: null, shots: [], stats: null, err: null };
      if (step.real) { try { r.res = await this.real(step.real); } catch (e) { r.err = String(e?.stack || e); } out.push(r); continue; }
      if (step.stress) { try { r.res = await this.stress(step.stress); } catch (e) { r.err = String(e?.stack || e); } out.push(r); continue; }
      try {
        r.res = await this.open(step.open);
        for (const s of step.shots || []) { if (s.cam) this.cam(s.cam[0], s.cam[1]); if (s.t) await wait(s.t * 1000); r.shots.push([s.name, await this.shot(s.name, s.w, s.h), this.stats()]); }
        r.stats = this.stats();
        if (r.res?.errs) { const c = new Map(); for (const e of r.res.errs) { const k = e.split('\n').slice(0, 2).join(' | '); c.set(k, (c.get(k) || 0) + 1); } r.res.errs = [...c].map(([k, n]) => `${n}x ${k}`); }
      } catch (e) { r.err = String(e?.stack || e); }
      out.push(r); this.close(); await wait(300);
    }
    await this.log(logName, out); return out;
  },
};
if (new URLSearchParams(location.search).has('poolauto')) {
  // (headless: the plan in the page's ?plan= (JSON, URI-encoded), the log saved when it is done)
  setTimeout(async () => { let plan = []; try { plan = JSON.parse(decodeURIComponent(new URLSearchParams(location.search).get('plan') || '[]')); } catch (e) { await window.__PV.log('pvP_log', { err: String(e) }); return; } await window.__PV.run(plan); await window.__PV.log('pvP_done', { done: true }); }, 500);
}
