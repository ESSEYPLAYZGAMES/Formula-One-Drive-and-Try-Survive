// You at the pool club (ui/PartyPool.js's V.life, called by ui/Hangout.js's pool hooks): into the water off the shelf's
// steps - wading, then swimming once it is deep, the eye at the surface and bobbing - under for a moment (Space, the sound
// muffled, the light turned green-blue), off the edge with a jump (Space at the edge, facing the water) and out again over
// the coping (Space at the wall); a splash where anyone goes in, the ring of ripples round you. Only what is swum in goes
// in: an open shirt is left with the towels, clothes you can't swim in keep you on the shelf until you change at the towel
// stand. The guests: what they say over their heads when they are within ~4 m (the rest a murmur), E to talk to one of
// them, a word when you shove past. ?crowd=debug: the guest you look at - who, doing what, wanting what - and how many
// are doing each thing.
//
// Nothing allocated per frame: the splash is one Points of 160 drops, the bubbles six reused <div>s, the overlay one more.
//
// ==== THE CONTRACT ======================================================================================================
// poolPlay(K, E, o) -> life     o: { pool { x0, z0, x1, z1, shelf, wl, ledge, deep }, heightAt(x, z), night, towel { x, z },
//                                    swimKit(kit) -> 'swim' | 'shirt' | 'cover' | null (how a kit of yours goes in the water) }
// life.frame(dt)          Hangout, every frame after your step (not in a game, a talk or a moment): the water, the eye
// life.speed              your walking speed's factor now (wading, swimming)
// life.key(code) -> bool  a key of yours (Space): taken?
// life.target(x, z, fx, fz) -> { n: guest } | null   the guest you face within reach (E)
// life.prompt(t) -> html  their line in the prompt;   life.use(t) -> bool  E on them (or on the towels)
// life.splash(x, z, k)    a splash of size k at (x, z) (the crowd's cannonballs too)
// life.dispose()
// ======================================================================================================================
import * as THREE from 'three';

const NDROP = 160, NBUB = 6;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const debugWanted = () => { try { return /(?:[?&#])crowd=debug\b/.test(location.search + location.hash) || !!globalThis.__crowdDebug; } catch (_) { return false; } };

export function poolPlay(K, E, o) {
  const P = o.pool, me = E.pool = { inWater: false, swim: false, under: false, x: 0, z: 0, wade: false };
  const life = { speed: 1 };
  let st = 'deck', jump = null, underT = 0, eyeV = 0, lastX = NaN, lastZ = NaN, warned = 0, changed = false, t = 0, bubT = 0, murT = 0, dbgT = 0, chatQ = [];
  const inRect = (x, z, m = 0) => x > P.x0 + m && x < P.x1 - m && z > P.z0 + m && z < P.z1 - m;

  // ---- the splash: drops thrown up where someone goes in, falling back -----------------------------------------------
  const pos = new Float32Array(NDROP * 3).fill(-100), vel = new Float32Array(NDROP * 3); let dropI = 0, live = 0;
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  const drops = K.obj(new THREE.Points(g, new THREE.PointsMaterial({ color: o.night ? '#b8f4ff' : '#ffffff', size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false, fog: false })));
  drops.frustumCulled = false; drops.renderOrder = 4; drops.visible = false;
  life.splash = (x, z, k = 1) => {
    const n = Math.min(NDROP / 2, Math.round(16 + 26 * k));
    for (let i = 0; i < n; i++) {
      const j = (dropI = (dropI + 1) % NDROP) * 3, a = Math.random() * Math.PI * 2, r = (0.4 + Math.random()) * 0.9 * k;
      pos[j] = x + Math.cos(a) * 0.15; pos[j + 1] = P.wl + 0.02; pos[j + 2] = z + Math.sin(a) * 0.15;
      vel[j] = Math.cos(a) * r; vel[j + 1] = (1.6 + Math.random() * 2.2) * Math.sqrt(k); vel[j + 2] = Math.sin(a) * r;
    }
    live = 1.6; drops.visible = true;
  };
  K.anim((_, dt) => {
    if (live <= 0) return; live -= dt; const d = Math.min(0.05, dt || 0);
    for (let j = 0; j < NDROP * 3; j += 3) { if (pos[j + 1] < -50) continue; vel[j + 1] -= 9.8 * d; pos[j] += vel[j] * d; pos[j + 1] += vel[j + 1] * d; pos[j + 2] += vel[j + 2] * d; if (pos[j + 1] < P.wl) pos[j + 1] = -100; }
    g.attributes.position.needsUpdate = true; if (live <= 0) drops.visible = false;
  });

  // ---- the overlays: under the water, the guests' lines, the debug panel ---------------------------------------------
  const host = E.canvas?.parentElement || null, mk = (css) => { if (!host) return null; const d = document.createElement('div'); d.style.cssText = 'position:absolute;pointer-events:none;' + css; host.appendChild(d); return d; };
  const uw = mk('inset:0;opacity:0;transition:opacity .25s;background:radial-gradient(ellipse at 50% 30%,rgba(40,190,200,.38),rgba(4,60,80,.78));backdrop-filter:blur(2px);z-index:2');
  const bub = []; for (let i = 0; i < NBUB; i++) { const d = mk('left:0;top:0;transform:translate(-50%,-100%);max-width:220px;padding:5px 9px;border-radius:12px;background:rgba(255,255,255,.92);color:#15161a;font:600 12px/1.25 system-ui,sans-serif;text-align:center;display:none;z-index:3;white-space:normal'); if (d) bub.push({ d, txt: '' }); }
  const dbg = debugWanted() ? mk('left:10px;top:10px;padding:8px 10px;border-radius:8px;background:rgba(0,0,0,.72);color:#dff;font:11px/1.35 ui-monospace,monospace;z-index:4;white-space:pre;max-width:46vw') : null;
  const near = []; const _v = new THREE.Vector3();
  const crowd = () => E.crowd || null, brain = () => crowd()?.life || null;

  // ---- what you may wear in: your kit (ui/Hangout.js's meOpts) -------------------------------------------------------
  const dress = () => { if (changed) return 'swim'; try { return o.swimKit?.(E.meOpts?.kit) || null; } catch (_) { return null; } };

  // ---- every frame ---------------------------------------------------------------------------------------------------
  life.frame = (dt) => {
    t += dt; const p = E.pos; if (!p) return;
    const busy = !!(E.seat || E.moment || E.talk || E.game);
    // (no way out of the deep end but over the coping: a step that would take you from deep water onto the deck is undone)
    if (Number.isFinite(lastX) && !jump && !busy) {
      const was = inRect(lastX, lastZ) && lastZ < P.shelf, now = inRect(p.x, p.z);
      if (was && !now) { p.x = Math.min(P.x1 - 0.3, Math.max(P.x0 + 0.3, p.x)); p.z = Math.min(P.z1 - 0.3, Math.max(P.z0 + 0.3, p.z)); if (t > warned) { warned = t + 6; E._toast?.('Space to climb out over the edge.', ''); } }
      // (into the water in clothes you can't swim in: as far as the shelf, then no further)
      const D = dress();
      if (!was && now && D !== 'swim' && D !== 'shirt' && p.z < P.shelf + 0.4) { p.x = lastX; p.z = Math.max(lastZ, P.shelf + 0.4); if (t > warned) { warned = t + 6; E._toast?.('Not in those clothes. There are swim shorts at the towel stand by the doors.', ''); } }
      if (!inRect(lastX, lastZ) && now && D === 'shirt' && !me.shirt) { me.shirt = true; E._toast?.('You leave your shirt with your towel on a lounger.', ''); }
    }
    const x = p.x, z = p.z, water = inRect(x, z), deep = water && z < P.shelf;
    // (off the deck into the deep end, walking: in with a splash)
    if (deep && st === 'deck' && !jump) { life.splash(x, z, 0.9); underT = 0.5; }
    st = jump ? 'jump' : deep ? 'swim' : water ? 'wade' : 'deck';
    me.inWater = water; me.swim = st === 'swim'; me.wade = st === 'wade'; me.x = x; me.z = z;
    // (the jump: an arc 1.8 m out, the splash, a moment under)
    if (jump) {
      jump.t = Math.min(1, jump.t + dt / 0.75); const u = jump.t;
      p.x = jump.x0 + (jump.x1 - jump.x0) * u; p.z = jump.z0 + (jump.z1 - jump.z0) * u; p.y = jump.y0 + 0.7 * Math.sin(Math.PI * u) + (P.wl - 0.2 - jump.y0) * u * u;
      if (u >= 1) { jump = null; life.splash(p.x, p.z, 1.4); underT = 0.9; }
    } else if (!busy) {
      const h = +o.heightAt(x, z) || 0, bob = Math.sin(t * 2.2) * 0.025;
      let want = 1.66 + h;
      if (st === 'swim') want = underT > 0 ? P.wl - 0.45 : P.wl + 0.14 + bob;
      else if (st === 'wade') want = 1.62 + h;
      eyeV = want; p.y += (want - p.y) * Math.min(1, dt * (st === 'swim' ? 5 : 10));
    }
    if (underT > 0) underT -= dt;
    me.under = !!(st === 'swim' && underT > 0 && p.y < P.wl);
    life.speed = st === 'swim' ? 0.62 : st === 'wade' ? 0.72 : 1;
    if (uw) uw.style.opacity = me.under ? '1' : '0';
    muffle(me.under);
    lastX = p.x; lastZ = p.z;
    // (the lines over the guests' heads, ten times a second; the murmur by how many are near)
    if ((bubT -= dt) <= 0) { bubT = 0.1; bubbles(); }
    if ((murT -= dt) <= 0) { murT = 0.5; const C = crowd(); if (C?.near && E.crowdBed?.to && !E.party) { try { E.crowdBed.to(0.12 + 0.2 * Math.min(1, C.near(x, z, 7) / 22) * (me.under ? 0.4 : 1), 0.8); } catch (_) { /* */ } } }
    if (dbg && (dbgT -= dt) <= 0) { dbgT = 0.25; debug(); }
    if (chatQ.length && chatQ[0].at <= t) { const c = chatQ.shift(); if (c.me) E._toast?.(`You: ${c.text}`, ''); else E._bark?.({ first: c.name }, c.text, 3.2); }
  };
  life.key = (code) => {
    if (code !== 'Space') return false;
    const p = E.pos; if (!p || jump || E.seat) return false;
    const fx = Math.cos(E.yaw || 0), fz = Math.sin(E.yaw || 0);
    if (st === 'deck') {   // (at the edge, facing the water: in)
      const ax = p.x + fx * 1.8, az = p.z + fz * 1.8, D = dress();
      if (!inRect(p.x + fx * 0.9, p.z + fz * 0.9) || !inRect(ax, az, 0.4) || az > P.shelf) return false;
      if (D !== 'swim' && D !== 'shirt') { E._toast?.('Not in those clothes. There are swim shorts at the towel stand by the doors.', ''); return true; }
      if (D === 'shirt' && !me.shirt) { me.shirt = true; E._toast?.('Shirt off, onto a lounger.', ''); }
      jump = { t: 0, x0: p.x, z0: p.z, y0: p.y, x1: ax, z1: az }; return true;
    }
    if (st === 'swim') {
      // (at the wall: out over the coping; else a moment under)
      const ox = p.x + fx * 0.9, oz = p.z + fz * 0.9;
      if (!inRect(ox, oz)) { const nx = p.x + fx * 1.1, nz = p.z + fz * 1.1; if (E._free?.(nx, nz)) { p.x = nx; p.z = nz; p.y = 1.66; lastX = nx; lastZ = nz; st = 'deck'; E._toast?.(['Out, dripping.', 'You haul yourself out onto the warm deck.'][Math.floor(t) % 2], ''); return true; } }
      underT = 1.6; return true;
    }
    return false;
  };
  // ---- the guests: who you face, and talking to them -----------------------------------------------------------------
  life.target = (x, z, fx, fz) => {
    const C = crowd(), B = brain(); if (!C?.ready || !B) return null;
    let best = null, bs = -9;
    for (const q of C.people) {
      if (!q.on || !q.L || q.staff && q.role === 'performer') continue; const dx = q.x - x, dz = q.z - z, d = Math.hypot(dx, dz); if (d > 2.2 || d < 0.05) continue;
      const dot = (dx * fx + dz * fz) / d; if (dot < 0.8) continue; const s = dot - d * 0.1; if (s > bs) { bs = s; best = q; }
    }
    return best ? { n: best, d: bs } : null;
  };
  life.prompt = (tg) => { const L = tg?.n?.L; return L ? `<span><kbd>E</kbd>Chat with ${esc(L.name)}</span><small>${esc(L.mood)}${L.drink && !tg.n.staff ? ' · ' + esc(L.drink) : ''}</small>` : ''; };
  life.use = (tg) => {
    if (tg?.h?.id === 'towels') {
      if (dress() === 'swim') { E._toast?.('A fresh towel, rolled under your arm.', ''); return true; }
      changed = true; E._toast?.('You change into swim shorts from the towel stand. The water is yours.', ''); return true;
    }
    const q = tg?.n, B = brain(); if (!q || !B) return false;
    const lines = B.chat(q, E.pos); if (!lines) return false;
    chatQ.length = 0; chatQ.push({ at: t, name: q.L.name, text: lines[0] }, { at: t + 2.6, me: true, text: lines[1] }, { at: t + 4.6, name: q.L.name, text: lines[2] });
    return true;
  };
  // ---- the overlays' frames ------------------------------------------------------------------------------------------
  function bubbles() {
    const B = brain(), cam = E.cam; if (!B || !cam || !bub.length) return;
    B.lines(E.pos, 4.2, near); near.sort((a, b) => ((a.x - E.pos.x) ** 2 + (a.z - E.pos.z) ** 2) - ((b.x - E.pos.x) ** 2 + (b.z - E.pos.z) ** 2));
    const W = host.clientWidth, H = host.clientHeight; let k = 0;
    for (let i = 0; i < near.length && k < bub.length; i++) {
      const q = near[i]; _v.set(q.x, q.y + (q.L.roll ? 0.45 : 1.95) * q.scale, q.z); E.scene?.localToWorld?.(_v); _v.project(cam);
      if (_v.z > 1 || Math.abs(_v.x) > 1.05 || Math.abs(_v.y) > 1.05) continue;
      const b = bub[k++]; if (b.txt !== q.L.say) { b.txt = q.L.say; b.d.textContent = q.L.say; } b.d.style.left = `${((_v.x + 1) / 2) * W}px`; b.d.style.top = `${((1 - _v.y) / 2) * H}px`; b.d.style.display = 'block';
    }
    for (; k < bub.length; k++) if (bub[k].d.style.display !== 'none') bub[k].d.style.display = 'none';
  }
  function debug() {
    const C = crowd(), B = brain(); if (!C || !B) { dbg.textContent = 'crowd: none'; return; }
    const s = C.stats(), c = B.counts(), tg = life.target(E.pos.x, E.pos.z, Math.cos(E.yaw || 0), Math.sin(E.yaw || 0)) || nearestAim(C);
    let txt = `guests ${s.active}/${s.people} · calls ${s.calls} · tris ${(s.tris / 1000).toFixed(0)}k · life ${(B.ms || 0).toFixed(2)} ms\n`;
    txt += Object.entries(c).filter(([, n]) => n).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · ') + '\n';
    txt += `you: ${st}${me.under ? ' (under)' : ''} · speed x${life.speed}\n`;
    const I = tg?.n ? B.info(tg.n) : null;
    if (I) txt += `\n${I.name} · ${I.role} · ${I.kit}\n${I.act} -> ${I.goal}\nmood ${I.mood} · ${I.drink}\ngroup ${I.group}\nthirst ${I.thirst.toFixed(2)} social ${I.social.toFixed(2)} dance ${I.dance.toFixed(2)} heat ${I.heat.toFixed(2)} stamina ${I.stamina.toFixed(2)} wet ${I.wet.toFixed(2)}`;
    dbg.textContent = txt;
  }
  // (the debug panel's aim reaches further than E: the guest nearest the middle of the view within 12 m)
  function nearestAim(C) {
    const x = E.pos.x, z = E.pos.z, fx = Math.cos(E.yaw || 0), fz = Math.sin(E.yaw || 0); let best = null, bs = 0.97;
    for (const q of C.people) { if (!q.on || !q.L) continue; const dx = q.x - x, dz = q.z - z, d = Math.hypot(dx, dz); if (d > 12 || d < 0.3) continue; const s = (dx * fx + dz * fz) / d; if (s > bs) { bs = s; best = q; } }
    return best ? { n: best } : null;
  }
  // ---- under the water: the music and the room through a low-pass, eased (the game's own audio, its sfx bus) ----------
  let lp = null, lpOn = false;
  function muffle(on) {
    if (on === lpOn) return; lpOn = on;
    const A = E.audio; if (!A?.ctx || !A.sfx) return;
    try {
      if (!lp) { lp = A._poolLP; if (!lp) { lp = A._poolLP = A.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 22000; A.sfx.disconnect(); A.sfx.connect(lp); lp.connect(A.ctx.destination); } }
      lp.frequency.setTargetAtTime(on ? 420 : 22000, A.ctx.currentTime, 0.08);
    } catch (_) { /* no audio graph */ }
  }
  life.dispose = () => {
    muffle(false); E.pool = null;
    for (const d of [uw, dbg, ...bub.map((b) => b.d)]) d?.remove();
    g.dispose(); drops.material.dispose();
  };
  return life;
}
