// A cutscene's contact sheet: every shot of a scene (ui/CineScenes.js) at its middle, tiled into one picture, with the
// shot's number and its subtitle - to judge the framing without sitting through it.
//   node tools/cine_sheet.mjs <scene> [out.png] [ctx.json]     (env: DOF=1 the lens's blur, W/H the tile's size, AT=0.5, ONLY=2,5 those shots, COLS)
import fs from 'fs';
import path from 'path';
import http from 'http';
import { createRequire } from 'module';
import { ROOT } from './ai_lib.mjs';
const pw = (() => { for (const b of [ROOT + '/', '/opt/node22/lib/node_modules/', '/usr/local/lib/node_modules/', '/usr/lib/node_modules/']) { try { return createRequire(b)('playwright'); } catch (e) { /* next */ } } throw new Error('playwright'); })();
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.gz': 'application/gzip' };
const srv = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(p).pipe(res); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const name = process.argv[2], out = process.argv[3] || `cine_${name}.png`, ctx = process.argv[4] ? JSON.parse(fs.readFileSync(process.argv[4], 'utf8')) : {};
const TW = +(process.env.W || 400), TH = +(process.env.H || 225), AT = +(process.env.AT || 0.5), COLS = +(process.env.COLS || 4);
const browser = await pw.chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }).catch(() => pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }));
const page = await browser.newPage({ viewport: { width: TW, height: TH } });
const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' || /\[cine\]/.test(m.text())) errs.push(m.text().slice(0, 300)); });
await page.route('https://cdn.jsdelivr.net/**', (r) => { const u = r.request().url(), f = u.endsWith('build/three.module.js') ? 'three.js' : 'three_addons_' + (u.split('/examples/jsm/')[1] || '').replace(/\//g, '_'); const p = path.join(ROOT, 'tools', 'vendor', f); return fs.existsSync(p) ? r.fulfill({ body: fs.readFileSync(p), contentType: 'text/javascript' }) : r.continue(); });
try {
  await page.goto(`http://127.0.0.1:${srv.address().port}/tools/cine.html`);
  await page.waitForFunction(() => window.__ready, null, { timeout: 120000 });
  if (name === 'list') { console.log((await page.evaluate(() => window.__scenes)).join(' ')); }
  else {
    const t0 = Date.now();
    await page.evaluate(([n, c, lite]) => { window.requestAnimationFrame = () => 0; window.__play(n, c, { lite, fast: true }); }, [name, ctx, !process.env.DOF]);
    await page.waitForFunction(() => window.__done || window.__cine?.state.built, null, { timeout: 240000 });
    const st = await page.evaluate(() => (window.__cine ? window.__cine.state : null));
    if (!st) { console.log('FAILED', JSON.stringify(await page.evaluate(() => window.__res))); }
    else {
      console.log(`built in ${((Date.now() - t0) / 1000).toFixed(1)} s; shots ${st.n}; total ${st.shots.reduce((a, b) => a + b, 0).toFixed(1)} s; browse ${st.browse}`);
      const n = st.browse || st.n, tiles = [];
      const only = process.env.ONLY ? process.env.ONLY.split(',').map((x) => +x - 1) : null;
      for (let i = 0; i < n; i++) {
        if (only && !only.includes(i)) continue;
        const info = await page.evaluate(([i, at, br]) => {
          const C = window.__cine; if (br) { if (i) C.go(1); for (let q = 0; q < 40; q++) C.step(0.05); } else { C.jump(i, at); for (let q = 0; q < 12; q++) C.step(0.001); }
          const cv = document.querySelector('#cine canvas'); const s = C.state;
          return { png: cv.toDataURL('image/jpeg', 0.8), sub: s.sub, ask: s.ask, qte: s.qte, i: s.i, card: document.querySelector('#cine .card.on b')?.textContent || '', low: document.querySelector('#cine .low.on b')?.textContent || '', plq: document.querySelector('#cine .plq b')?.textContent || '' };
        }, [i, AT, !!st.browse]);
        tiles.push({ ...info, d: st.shots[i] });
      }
      const rows = Math.ceil(tiles.length / COLS);
      const sheet = await browser.newPage({ viewport: { width: TW * COLS, height: (TH + 34) * rows } });
      await sheet.setContent(`<body style="margin:0;background:#111;font:11px/1.2 Arial;color:#ddd"><div style="display:flex;flex-wrap:wrap">${tiles.map((t, i) => `<div style="width:${TW}px;height:${TH + 34}px;overflow:hidden"><img src="${t.png}" style="width:${TW}px;height:${TH}px;display:block"><div style="padding:2px 4px;height:30px;overflow:hidden"><b style="color:#ffd76a">${t.i + 1}</b> ${(t.d || 0).toFixed(1)}s ${t.card ? `[CARD ${t.card}] ` : ''}${t.low ? `[${t.low}] ` : ''}${t.plq ? `[${t.plq}] ` : ''}${t.ask ? `[ASK ${t.ask.join('/')}] ` : ''}${t.qte ? `[QTE ${t.qte}] ` : ''}${String(t.sub || '').replace(/</g, '&lt;')}</div></div>`).join('')}</div></body>`);
      await sheet.screenshot({ path: out }); console.log('sheet', out, `${tiles.length} shots`);
    }
  }
} catch (e) { console.log('FAIL', e.message.split('\n')[0]); }
finally { if (errs.length) console.log('errors:', [...new Set(errs)].slice(0, 6)); await browser.close(); srv.close(); }
