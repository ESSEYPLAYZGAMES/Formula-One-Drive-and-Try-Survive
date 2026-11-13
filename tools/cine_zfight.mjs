// Where a cutscene's set would z-fight: pairs of faces of different materials lying in the same plane, facing the same
// way, one over the other, with nothing (a decal's offset) to say which is on top. Every triangle of the set's still
// geometry is put in the world, the axis-aligned ones sorted by their plane, and those within a millimetre and a half
// of each other tested for overlap (two undersides at one height are left out: they rest on something).   node tools/cine_zfight.mjs <scene> [ctx.json]     (prints the pairs, largest first)
import fs from 'fs';
import path from 'path';
import http from 'http';
import { createRequire } from 'module';
import { ROOT } from './ai_lib.mjs';
const pw = (() => { for (const b of [ROOT + '/', '/opt/node22/lib/node_modules/', '/usr/local/lib/node_modules/', '/usr/lib/node_modules/']) { try { return createRequire(b)('playwright'); } catch (e) { /* next */ } } throw new Error('playwright'); })();
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.gz': 'application/gzip' };
const srv = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(p).pipe(res); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const names = process.argv[2].split(','), ctx = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : {};
const browser = await pw.chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }).catch(() => pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }));
for (const name of names) {
  const page = await browser.newPage({ viewport: { width: 320, height: 180 } });
  page.on('pageerror', (e) => console.log('ERR', e.message));
  await page.route('https://cdn.jsdelivr.net/**', (r) => { const u = r.request().url(), f = u.endsWith('build/three.module.js') ? 'three.js' : 'three_addons_' + (u.split('/examples/jsm/')[1] || '').replace(/\//g, '_'); const p = path.join(ROOT, 'tools', 'vendor', f); return fs.existsSync(p) ? r.fulfill({ body: fs.readFileSync(p), contentType: 'text/javascript' }) : r.continue(); });
  try {
    await page.goto(`http://127.0.0.1:${srv.address().port}/tools/cine.html`);
    await page.waitForFunction(() => window.__ready, null, { timeout: 120000 });
    await page.evaluate(([n, c]) => { window.requestAnimationFrame = () => 0; window.__play(n, c, { lite: true, fast: true }); }, [name, ctx]);
    await page.waitForFunction(() => window.__done || window.__cine?.state.built, null, { timeout: 240000 });
    const out = await page.evaluate(() => {
      const S = window.__cine?.scene; if (!S) return null; S.updateMatrixWorld(true);
      const T = [], skip = (o) => { for (let q = o; q; q = q.parent) if (q.userData?.person || q.isSkinnedMesh || q.userData?.car) return true; return false; };
      const col = (m) => (m.color ? '#' + m.color.getHexString() : '?') + (m.map ? '+map' : '') + (m.transparent ? ` a${m.opacity}` : '');
      let nm = 0;
      S.traverse((o) => {
        if (!o.isMesh || o.isInstancedMesh || skip(o) || !o.visible) return; const m = [].concat(o.material)[0]; if (!m || m.polygonOffset || (m.transparent && m.depthWrite === false) || m.blending === 2) return;
        const g = o.geometry, P = g.attributes.position; if (!P || P.count > 400000) return; const ix = g.index, n = ix ? ix.count : P.count, e = o.matrixWorld.elements; nm++;
        const v = (i) => { const j = ix ? ix.getX(i) : i, x = P.getX(j), y = P.getY(j), z = P.getZ(j); return [e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]]; };
        for (let i = 0; i < n; i += 3) {
          const a = v(i), b = v(i + 1), c = v(i + 2), ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
          let nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx; const L = Math.hypot(nx, ny, nz); if (L < 2e-4) continue; nx /= L; ny /= L; nz /= L;   // (area under a square centimetre: nothing to see)
          const ax = Math.abs(nx) > 0.9995 ? 0 : Math.abs(ny) > 0.9995 ? 1 : Math.abs(nz) > 0.9995 ? 2 : -1; if (ax < 0) continue;
          const sg = [nx, ny, nz][ax] > 0 ? 1 : -1, sd = m.side === 2 ? 0 : sg, u = (ax + 1) % 3, w = (ax + 2) % 3;
          T.push({ ax, sd, d: a[ax], p: [[a[u], a[w]], [b[u], b[w]], [c[u], c[w]]], m: m.uuid, c: col(m), o: o.uuid, lo: [Math.min(a[u], b[u], c[u]), Math.min(a[w], b[w], c[w])], hi: [Math.max(a[u], b[u], c[u]), Math.max(a[w], b[w], c[w])] });
        }
      });
      // (the area two triangles share in their plane: one clipped by the other's edges)
      const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; };
      const clip = (A, B) => { let P = area(A) < 0 ? A.slice().reverse() : A.slice(); const Q = area(B) < 0 ? B.slice().reverse() : B; for (let i = 0; i < 3 && P.length; i++) { const a = Q[i], b = Q[(i + 1) % 3], ins = (p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= -1e-9, R = []; for (let j = 0; j < P.length; j++) { const p = P[j], q = P[(j + 1) % P.length], ip = ins(p), iq = ins(q); if (ip) R.push(p); if (ip !== iq) { const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]), d2 = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]), t = d1 / (d1 - d2); R.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); } } P = R; } return P.length >= 3 ? Math.abs(area(P)) : 0; };
      const by = new Map(), EPS = 0.0015; for (const t of T) { const k = `${t.ax}|${Math.round(t.d / EPS)}`; if (!by.has(k)) by.set(k, []); by.get(k).push(t); }
      const hits = new Map();
      for (const [k, L] of by) {
        const [ax, bin] = k.split('|').map(Number);
        for (const nb of [0, 1]) { const M = nb ? by.get(`${ax}|${bin + 1}`) : L; if (!M) continue;
          for (let i = 0; i < L.length; i++) { const a = L[i]; for (let j = nb ? 0 : i + 1; j < M.length; j++) { const b = M[j];
            if (a.m === b.m || Math.abs(a.d - b.d) > EPS || (ax === 1 && a.sd < 0 && b.sd < 0) || (a.sd && b.sd && a.sd !== b.sd) || a.hi[0] <= b.lo[0] || b.hi[0] <= a.lo[0] || a.hi[1] <= b.lo[1] || b.hi[1] <= a.lo[1]) continue;
            const s = clip(a.p, b.p); if (s < 4e-4) continue;
            const key = [a.c, b.c].sort().join(' / ') + ` | ${'xyz'[ax]}=${a.d.toFixed(3)}`, h = hits.get(key) || { s: 0, at: null }; h.s += s; h.at = h.at || [((Math.max(a.lo[0], b.lo[0]) + Math.min(a.hi[0], b.hi[0])) / 2).toFixed(2), ((Math.max(a.lo[1], b.lo[1]) + Math.min(a.hi[1], b.hi[1])) / 2).toFixed(2)]; h.gap = Math.abs(a.d - b.d).toFixed(4); hits.set(key, h); } } }
      }
      return { tris: T.length, meshes: nm, hits: [...hits].sort((a, b) => b[1].s - a[1].s).slice(0, 40).map(([k, h]) => `${h.s.toFixed(3)} m2  ${k}  (at ${'yzx'[+{ x: 0, y: 1, z: 2 }[k.split('| ')[1][0]]]},${'zxy'[+{ x: 0, y: 1, z: 2 }[k.split('| ')[1][0]]]} = ${h.at.join(', ')}; ${h.gap} m apart)`) };
    });
    console.log(`== ${name}: ${out ? `${out.meshes} meshes, ${out.tris} flat triangles, ${out.hits.length} pairs` : 'FAILED'}`); if (out) for (const h of out.hits) console.log('  ' + h);
  } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); }
  await page.close();
}
await browser.close(); srv.close();
