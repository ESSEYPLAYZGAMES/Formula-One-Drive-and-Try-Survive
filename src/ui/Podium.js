// The podium, after a race run to the flag: the top three on the steps in their team kit and caps - the winner in the
// middle, arms up - the trophies at their feet, the backdrop with the Grand Prix's name, the crowd below; then the
// champagne, sprayed from the winner's bottle across the other two, confetti coming down. Its own small 3D view, a
// slow push-in like the world feed's; about ten seconds (Enter, Esc or SKIP ends it), then done(). The results are
// called for a quarter of a second into its fade, so their sheet is already arriving as the podium goes; near the end
// the SKIP button says where it leads (RESULTS, Enter).
import * as THREE from 'three';
import { makePerson } from '../world/People.js';
import { Crowd, crowdTime } from '../world/Crowd.js';
import { ensureMotion, reduced } from './Motion.js';

const CSS = `
#podium { position: fixed; inset: 0; z-index: 46; background: #000; opacity: 0; transition: opacity .7s; }
#podium.show { opacity: 1; }
#podium.gone { pointer-events: none; }
#podium canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
#podium .lower { position: absolute; left: 50%; bottom: 7vh; transform: translateX(-50%); text-align: center; color: #fff; font-family: 'Segoe UI', Roboto, Arial, sans-serif; text-shadow: 0 2px 12px rgba(0,0,0,.6); }
#podium .lower small { display: block; font: 700 13px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .35em; color: #ffd76a; margin-bottom: 8px; }
#podium .lower b { display: block; font: 800 clamp(24px, 3.4vw, 42px)/1.1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; }
#podium .lower span { display: block; margin-top: 8px; font-size: 14px; letter-spacing: .12em; color: rgba(255,255,255,.8); }
#podium .skip { position: absolute; right: 18px; top: 16px; display: grid; background: rgba(0,0,0,.4); color: #fff; border: 1px solid rgba(255,255,255,.3); border-radius: 8px; font: 700 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; padding: 9px 12px; cursor: pointer; }
/* (the two labels share one cell and cross-fade: SKIP, then where it leads) */
#podium .skip > span { grid-area: 1 / 1; display: inline-flex; align-items: center; justify-content: flex-end; gap: 8px; white-space: nowrap; transition: opacity 180ms ease; }
#podium .skip .nx { opacity: 0; }
#podium .skip.ready .now { opacity: 0; } #podium .skip.ready .nx { opacity: 1; }
#podium .skip kbd { font: 700 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; padding: 3px 6px; border: 1px solid rgba(255,255,255,.4); border-radius: 5px; color: rgba(255,255,255,.85); }
html.m-off #podium .skip > span { transition: none; }
@media (prefers-reduced-motion: reduce) { #podium .skip > span { transition: none; } }
`;

/**
 * top: [{ name, team, color, color2, number }] (P1, P2, P3); o: { track, night, audio }; done() at the end
 */
export function showPodium(top, o, done) {
  if (!top?.length) { done?.(); return; }
  ensureMotion();
  if (!document.getElementById('podium-css')) { const st = document.createElement('style'); st.id = 'podium-css'; st.textContent = CSS; document.head.appendChild(st); }
  const el = document.createElement('div'); el.id = 'podium';
  el.innerHTML = `<canvas></canvas><button class="skip"><span class="now">SKIP ▸</span><span class="nx">RESULTS ▸ <kbd>Enter</kbd></span></button><div class="lower"><small>${esc((o.track || 'GRAND PRIX').toUpperCase())} · RACE WINNER</small><b>${esc(top[0].name)}</b><span>${esc(top[0].team)}${top[1] ? ` · 2nd ${esc(top[1].name)}` : ''}${top[2] ? ` · 3rd ${esc(top[2].name)}` : ''}</span></div>`;
  document.body.appendChild(el);
  let R; try { R = new THREE.WebGLRenderer({ canvas: el.querySelector('canvas'), antialias: true }); } catch (e) { el.remove(); done?.(); return; }
  R.setPixelRatio(Math.min(1.5, devicePixelRatio || 1)); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = o.night ? 1.1 : 1.0;
  const S = new THREE.Scene(); S.background = new THREE.Color(o.night ? '#090b16' : '#8fb4dc'); S.fog = new THREE.Fog(S.background, 14, 40);
  S.add(new THREE.HemisphereLight(o.night ? 0x9aa6ff : 0xffffff, 0x3a3020, o.night ? 0.7 : 1.3));
  const spot = new THREE.SpotLight(0xfff2dc, o.night ? 60 : 30, 30, 0.6, 0.6, 1.4); spot.position.set(4, 9, 7); spot.target.position.set(0, 1.5, 0); S.add(spot, spot.target);
  const fill = new THREE.DirectionalLight(0xffffff, o.night ? 0.5 : 1.1); fill.position.set(-5, 6, 4); S.add(fill);
  const disposables = [];
  const mesh = (g, m) => { const x = new THREE.Mesh(g, m); disposables.push(g, m); S.add(x); return x; };
  // the podium: three white steps, the numbers on the front; the backdrop with the Grand Prix's name; the crowd below
  const white = new THREE.MeshStandardMaterial({ color: '#f2f3f5', roughness: 0.5 });
  const steps = [[0, 1.0, 1], [-1.45, 0.72, 2], [1.45, 0.48, 3]];
  const numTex = (n) => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#f2f3f5'; x.fillRect(0, 0, 128, 128); x.fillStyle = '#c8102e'; x.font = '900 90px "Segoe UI", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), 64, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  for (const [x, h, n] of steps) {
    mesh(new THREE.BoxGeometry(1.4, h, 1.3), white).position.set(x, h / 2, 0);
    const tx = numTex(n); disposables.push(tx); mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.5 })).position.set(x, h * 0.55, 0.651);
  }
  const bcv = document.createElement('canvas'); bcv.width = 2048; bcv.height = 768; const bx = bcv.getContext('2d');
  const gr = bx.createLinearGradient(0, 0, 0, 768); gr.addColorStop(0, '#15161c'); gr.addColorStop(1, '#2a1214'); bx.fillStyle = gr; bx.fillRect(0, 0, 2048, 768);
  bx.fillStyle = '#c8102e'; bx.fillRect(0, 610, 2048, 26); bx.fillStyle = '#ffffff'; bx.textAlign = 'center'; bx.textBaseline = 'middle';
  bx.font = '900 150px "Segoe UI", Arial, sans-serif'; bx.fillText((o.track || 'GRAND PRIX').toUpperCase(), 1024, 300); bx.font = '700 64px "Segoe UI", Arial, sans-serif'; bx.fillStyle = '#d9dce2'; bx.fillText('GRAND PRIX', 1024, 470);
  const btex = new THREE.CanvasTexture(bcv); btex.colorSpace = THREE.SRGBColorSpace; disposables.push(btex);
  mesh(new THREE.PlaneGeometry(12, 4.5), new THREE.MeshStandardMaterial({ map: btex, emissive: 0xffffff, emissiveMap: btex, emissiveIntensity: 0.35, roughness: 0.8 })).position.set(0, 3.4, -1.6);
  // the podium's balcony (the steps on it), and the track below it where the crowd has come on to see them: in full
  //  3D (world/Crowd.js), facing the podium - arms up, team caps and shirts, flags, phones held up
  const deck = new THREE.MeshStandardMaterial({ color: '#2b2d33', roughness: 0.9 });
  mesh(new THREE.PlaneGeometry(40, 24), deck).rotation.x = -Math.PI / 2; S.children[S.children.length - 1].position.z = -9.8;
  mesh(new THREE.BoxGeometry(40, 1.3, 0.25), new THREE.MeshStandardMaterial({ color: '#1c1d22', roughness: 0.8 })).position.set(0, -0.65, 2.3);
  mesh(new THREE.PlaneGeometry(40, 30), new THREE.MeshStandardMaterial({ color: '#34363c', roughness: 0.95 })).rotation.x = -Math.PI / 2; S.children[S.children.length - 1].position.set(0, -1.3, 17.3);
  const tc = top.map((d) => d.color);
  const crowd = new Crowd({ night: o.night }), cgrp = new THREE.Group(); S.add(cgrp);
  const CASUAL = ['#f2f2ef', '#1b1d22', '#2d4a6b', '#9fb6c9', '#d9c7a3', '#b04a4a', '#3a3f48', '#ffd400', '#ff8000'], LEGS = ['#22252b', '#2d3a55', '#3b4a66', '#a89a7a', '#1a1a1a'];
  const pk = (a) => a[(Math.random() * a.length) | 0];
  for (let z = 2.75; z < 7.6; z += 0.58) for (let x = -8.5; x <= 8.5; x += 0.56) {
    const spec = crowd.spec('fanF', 16), team = Math.random() < 0.6, c = team ? pk(tc) : pk(CASUAL);
    const jump = spec.pose === 'cheer' && Math.random() < 0.8 ? 0.6 + Math.random() * 0.6 : 0;
    crowd.add(spec, x + (Math.random() - 0.5) * 0.22, z + (Math.random() - 0.5) * 0.2, Math.PI / 2 + (Math.random() - 0.5) * 0.5 - x * 0.03, { top: c, team: team ? c : pk(tc), acc: team ? '#ffffff' : pk(CASUAL), legs: pk(LEGS) }, 0.93 + Math.random() * 0.1, -1.3, jump);
  }
  crowd.build(cgrp); for (const m of crowd.meshes) disposables.push(m.geometry);
  // the three: P1 arms up in the middle, P2 and P3 either side; team kit, caps, a face each their own
  const people = top.slice(0, 3).map((d, i) => {
    const P = makePerson({ pose: i === 0 ? 'cheer' : 'talk', kit: 'suit', color: d.color, accent: d.color2 || '#ffffff', cap: true, driver: d.name, teamName: d.team, jitter: 0.01 });
    P.group.position.set(steps[i][0], steps[i][1], 0.05); P.group.rotation.y = -Math.PI / 2 + (i === 1 ? 0.12 : i === 2 ? -0.12 : 0); S.add(P.group); return P;
  });
  // the trophies (gold, at their feet) and the winner's bottle
  const gold = new THREE.MeshStandardMaterial({ color: '#d9b04a', roughness: 0.25, metalness: 0.85 });
  const cup = [[0, 0.02], [0.05, 0.02], [0.05, 0.04], [0.02, 0.06], [0.02, 0.18], [0.09, 0.26], [0.1, 0.4], [0.085, 0.42]].map(([r, y]) => new THREE.Vector2(r, y));
  steps.forEach(([x, h], i) => { if (i < top.length) mesh(new THREE.LatheGeometry(cup, 24), gold).position.set(x + 0.42, h, 0.4).multiplyScalar(1); });
  const bottle = mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.3, 14), new THREE.MeshStandardMaterial({ color: '#1f4d2a', roughness: 0.2, metalness: 0.3 }));
  // champagne (droplets, under gravity) and confetti (falling, turning)
  const NC = 500, cpos = new Float32Array(NC * 3), cvel = new Float32Array(NC * 3), clife = new Float32Array(NC);
  const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(cpos, 3)); disposables.push(cg);
  const cm = new THREE.PointsMaterial({ color: '#fff4d0', size: 0.035, transparent: true, opacity: 0.9, depthWrite: false }); disposables.push(cm);
  S.add(new THREE.Points(cg, cm)); clife.fill(0); for (let i = 0; i < NC; i++) cpos[i * 3 + 1] = -10;
  const NF = 260, conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.05, 0.03), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.6 }), NF); disposables.push(conf.geometry, conf.material); S.add(conf);
  const fl = [], M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1), col = new THREE.Color();
  for (let i = 0; i < NF; i++) { fl.push({ p: new THREE.Vector3((Math.random() - 0.5) * 7, 6 + Math.random() * 6, (Math.random() - 0.5) * 3), s: Math.random() * 6, w: 1 + Math.random() * 3 }); conf.setColorAt(i, col.set(['#ffd76a', '#ffffff', '#c8102e', ...tc][i % (3 + tc.length)])); }
  const cam = new THREE.PerspectiveCamera(34, 1, 0.05, 80);
  // the crowd's roar
  const roar = o.audio?.play?.('crowd', { gain: 0.6, loop: true, offset: 'random', fadeIn: 0.8 });
  let t = 0, last = performance.now(), on = true, emitted = 0, ready = false;
  const skip = el.querySelector('.skip');
  const frame = (now) => {
    if (!on) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    const c = el.querySelector('canvas'), w = c.clientWidth || innerWidth, h = c.clientHeight || innerHeight;
    if (c.width !== Math.round(w * R.getPixelRatio())) { R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    // the camera: a slow push-in from the front, drifting round a little
    const u = Math.min(1, t / 10), a = -0.25 + 0.4 * u;
    cam.position.set(Math.sin(a) * (11 - 4 * u), 2.6 - 0.4 * u, Math.cos(a) * (11 - 4 * u)); cam.lookAt(0, 1.9, 0);
    // the winner's bottle: in the right hand, shaken, then sprayed across the others
    const P0 = people[0]; P0.group.updateMatrixWorld(true); const hand = P0.group.localToWorld(new THREE.Vector3(0.12, 1.86, -0.22));
    bottle.position.copy(hand); bottle.rotation.set(0, 0, t > 3 ? -1.1 + Math.sin(t * 2) * 0.5 : Math.sin(t * 18) * 0.3);
    if (t > 3 && t < 8.5) {
      const n = Math.floor(160 * dt * 10); for (let k = 0; k < n && emitted < 1e9; k++, emitted++) {
        const i = emitted % NC, dir = new THREE.Vector3(Math.sin(t * 2) * 1.2, 0.8 + Math.random() * 0.5, 0.5 + Math.random() * 0.4).normalize().multiplyScalar(4 + Math.random() * 3);
        cpos.set([hand.x, hand.y + 0.15, hand.z], i * 3); cvel.set([dir.x + (Math.random() - 0.5), dir.y, dir.z + (Math.random() - 0.5)], i * 3); clife[i] = 1.4;
      }
    }
    for (let i = 0; i < NC; i++) { if (clife[i] <= 0) continue; clife[i] -= dt; cvel[i * 3 + 1] -= 9.8 * dt; cpos[i * 3] += cvel[i * 3] * dt; cpos[i * 3 + 1] += cvel[i * 3 + 1] * dt; cpos[i * 3 + 2] += cvel[i * 3 + 2] * dt; if (clife[i] <= 0) cpos[i * 3 + 1] = -10; }
    cg.attributes.position.needsUpdate = true;
    fl.forEach((f, i) => { if (t > 1.5) { f.p.y -= dt * (0.6 + 0.3 * Math.sin(f.s)); f.p.x += Math.sin(t * f.w + f.s) * dt * 0.3; if (f.p.y < 0.05) f.p.y = 0.05; } Q.setFromEuler(E.set(t * f.w + f.s, t * f.w * 0.7, f.s)); conf.setMatrixAt(i, M4.compose(f.p, Q, one)); });
    conf.instanceMatrix.needsUpdate = true;
    // the winner bouncing a little, the others turning to look
    P0.group.position.y = steps[0][1] + Math.max(0, Math.sin(t * 5)) * 0.04 * (t < 3 ? 1 : 0.3);
    people.forEach((P, i) => { P.head.rotation.y = i ? (i === 1 ? -0.3 : 0.3) * Math.min(1, t / 3) : 0.1 * Math.sin(t * 0.8); });
    crowdTime(t); R.render(S, cam);
    // (the champagne is spent: the button says where it goes next)
    if (t > 8.5 && !ready) { ready = true; skip.classList.add('ready'); skip.setAttribute('aria-label', 'Results'); }
    if (t > 10.5) finish(); else requestAnimationFrame(frame);
  };
  const finish = () => {
    if (!on) return; on = false; window.removeEventListener('keydown', key, true);
    roar?.stop(1.2); el.classList.remove('show'); el.classList.add('gone');
    // the results are called a quarter of a second into the fade (their sheet arrives while this goes); the 3D is let
    // go once the fade is over
    setTimeout(() => done?.(), reduced() ? 0 : 250);
    setTimeout(() => { for (const P of people) P.dispose(); for (const d of disposables) d.dispose?.(); R.dispose(); R.forceContextLoss?.(); el.remove(); }, 700);
  };
  const key = (e) => { if (e.code === 'Enter' || e.code === 'Escape' || e.code === 'Space') { e.preventDefault(); finish(); } };
  window.addEventListener('keydown', key, true); skip.onclick = finish;
  setTimeout(finish, 11500);   // (whatever the frame rate - a tab in the background - it ends)
  requestAnimationFrame(() => el.classList.add('show')); setTimeout(() => el.classList.add('show'), 30);
  requestAnimationFrame(frame);
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
