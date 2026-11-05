// Did an optimisation change what is drawn? A race on each circuit, driven frame by frame at a fixed 1/60 s (main.js
// frame(), the game's own loop stopped, the clocks pinned to the frames, Math.random seeded inside the game's calls);
// at set frames the camera is put at several poses - as the game had it, behind and above the car, high overhead, from
// the side, looking back at the field - and from each the frame is drawn twice from the very same state: once with the
// render optimisations switched off (three.js's own matrix update, every car drawn into the shadow map) and once with
// them on. Every pixel is read back and compared: identical, or how many differ and by how much (with PNGs of the two
// and of the difference written to the directory named).
//   node tools/regress.mjs [diffdir] [track ...]
//   REGRESS_CONTROL=off | on: the control - the same frame drawn twice in the same mode (both off, both on): what
//   differs then is the renderer's own variation from one draw to the next, not the optimisation's
import fs from 'fs';
import zlib from 'zlib';
import { openGame } from './ai_lib.mjs';

const W = 480, H = 270, AT = [1, 40, 100, 180];   // (the canvas; the frames checked)

function png(rgba, w, h) {   // (a minimal PNG writer: RGBA, rows flipped from GL's bottom-up order)
  const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (b) => { let c = -1; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const raw = Buffer.alloc((w * 4 + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + (h - 1 - y) * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const dir = process.argv[2] && !/^[a-z]+$/.test(process.argv[2]) ? process.argv[2] : null;
const tracks = process.argv.slice(dir ? 3 : 2).length ? process.argv.slice(dir ? 3 : 2) : ['lasvegas', 'silverstone', 'montreal', 'austin'];
let bad = 0, good = 0;
for (const track of tracks) {
  const g = await openGame(track);
  try {
    await g.page.setViewportSize({ width: W, height: H });
    await g.page.evaluate(async () => {
      let x = 20260704; window.__seeded = (fn) => { const R = Math.random; Math.random = () => ((x = (x * 16807) % 2147483647) / 2147483647); try { return fn(); } finally { Math.random = R; } };
      window.requestAnimationFrame = () => 0; await new Promise((r) => setTimeout(r, 1500));
      window.__t = 1e6; performance.now = () => window.__t; Date.now = () => 1.7e12 + Math.floor(window.__t);
      const F = window.__F1; Object.assign(F.settings, { grid: 'pick', slot: 12, len: 5, intro: 'off', sc: 'on', fail: 'on' });
      window.__seeded(() => F.restart());
      const d = F.S.director; window.__seeded(() => { for (let k = 0; k < 60 && !(d.world.racing && d.time - d.world.raceStart > 8); k++) F.stepSim(0.5); d.handOver(); });
      F.setSimTime(0);
    });
    if (process.env.REGRESS_CONTROL) await g.page.evaluate((c) => { window.__ctl = c; }, process.env.REGRESS_CONTROL);
    let f = 0;
    for (const at of AT) {
      const r = await g.page.evaluate(([n]) => {
        const F = window.__F1, R = F.renderer, gl = R.getContext(), cam = F.camera, p = F.S.player;
        window.__seeded(() => { for (let i = 0; i < n; i++) { window.__t += 1000 / 60; F.frame(window.__t); } });
        const read = () => { const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(w * h * 4); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px); return px; };
        const shot = (on) => { F.fastMatrix(on); F.SHADOW_CULL.on = on; R.info.autoReset = false; R.info.reset(); F.renderView(); const calls = R.info.render.calls; R.info.autoReset = true; const px = read(); F.fastMatrix(true); F.SHADOW_CULL.on = true; return { px, calls }; };
        const b64 = (px) => { let s = ''; for (let i = 0; i < px.length; i += 8192) s += String.fromCharCode.apply(null, px.subarray(i, i + 8192)); return btoa(s); };
        const pos0 = cam.position.clone(), q0 = cam.quaternion.clone(), th = p.th, cx = Math.cos(th), sz = Math.sin(th);
        const poses = [['game', null],
          ['chase', () => { cam.position.set(p.x - cx * 9, 3.2, p.z - sz * 9); cam.lookAt(p.x + cx * 20, 0.5, p.z + sz * 20); }],
          ['aerial', () => { cam.position.set(p.x - cx * 30, 70, p.z - sz * 30); cam.lookAt(p.x + cx * 60, 0, p.z + sz * 60); }],
          ['side', () => { cam.position.set(p.x + sz * 14, 2.5, p.z - cx * 14); cam.lookAt(p.x, 0.6, p.z); }],
          ['back', () => { cam.position.set(p.x + cx * 3, 2.2, p.z + sz * 3); cam.lookAt(p.x - cx * 40, 0.5, p.z - sz * 40); }]];
        const out = [];
        for (const [name, set] of poses) {
          if (set) { set(); cam.updateMatrixWorld(); }
          // (the optimised frame first, from the state the game left - three.js's own walk would bring every hidden part up to
          //  date and hide a stale one; then three.js's own)
          const B = shot(window.__ctl !== 'off'), A = shot(window.__ctl === 'on');
          let n = 0, maxd = 0; for (let k = 0; k < A.px.length; k += 4) { const dd = Math.max(Math.abs(A.px[k] - B.px[k]), Math.abs(A.px[k + 1] - B.px[k + 1]), Math.abs(A.px[k + 2] - B.px[k + 2])); if (dd) { n++; if (dd > maxd) maxd = dd; } }
          out.push({ name, n, maxd, callsOff: A.calls, callsOn: B.calls, a: n ? b64(A.px) : null, b: n ? b64(B.px) : null });
        }
        cam.position.copy(pos0); cam.quaternion.copy(q0); cam.updateMatrixWorld();
        return { w: gl.drawingBufferWidth, h: gl.drawingBufferHeight, out };
      }, [at - f]);
      f = at;
      for (const o of r.out) {
        if (o.n) bad++; else good++;
        console.log(`${track} frame ${at} ${o.name.padEnd(6)}: ${o.n ? `${o.n} PIXELS DIFFER (by up to ${o.maxd})` : 'identical'}   draw calls ${o.callsOff} -> ${o.callsOn}`);
        if (o.n && dir) {
          fs.mkdirSync(dir, { recursive: true });
          const a = Buffer.from(o.a, 'base64'), b = Buffer.from(o.b, 'base64'), d = new Uint8Array(a.length);
          for (let k = 0; k < a.length; k += 4) { const v = a[k] !== b[k] || a[k + 1] !== b[k + 1] || a[k + 2] !== b[k + 2]; d[k] = v ? 255 : a[k] >> 2; d[k + 1] = d[k + 2] = v ? 0 : a[k + 1] >> 2; d[k + 3] = 255; }
          fs.writeFileSync(`${dir}/${track}_${at}_${o.name}_off.png`, png(a, r.w, r.h)); fs.writeFileSync(`${dir}/${track}_${at}_${o.name}_on.png`, png(b, r.w, r.h)); fs.writeFileSync(`${dir}/${track}_${at}_${o.name}_diff.png`, png(d, r.w, r.h));
        }
      }
    }
  } finally { await g.close(); }
}
console.log(`${good} views identical, ${bad} different`);
process.exit(bad ? 1 : 0);
