// Shared by tools/ai_train.mjs and tools/ai_fit.mjs: the game in a headless browser (a static server on the repo, three.js
// from tools/vendor when it is there), a circuit built, tools/harness.js loaded - and the calibration block of
// src/ai/Calibration.js read and written in place.
//   needs: playwright (npm i -g playwright, or in a local node_modules) and a Chromium (PLAYWRIGHT_BROWSERS_PATH, or
//   CHROME=/path/to/chrome)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAL_FILE = path.join(ROOT, 'src', 'ai', 'Calibration.js');

function playwright() {
  for (const base of [ROOT + '/', process.cwd() + '/', '/opt/node22/lib/node_modules/', '/usr/local/lib/node_modules/', '/usr/lib/node_modules/']) {
    try { return createRequire(base)('playwright'); } catch (e) { /* next */ }
  }
  throw new Error('playwright is not installed (npm i -g playwright)');
}
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg' };
function serve() {
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(p).pipe(res);
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r(srv)));
}
function chromePath() {
  if (process.env.CHROME) return process.env.CHROME;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try { const d = fs.readdirSync(base).filter((x) => x.startsWith('chromium-')).sort().pop(); if (d) { const p = path.join(base, d, 'chrome-linux', 'chrome'); if (fs.existsSync(p)) return p; } } catch (e) { /* default */ }
  return undefined;
}

/** the game with circuit `track` built: { page, close() } */
export async function openGame(track) {
  const { chromium } = playwright(), srv = await serve(), port = srv.address().port;
  const browser = await chromium.launch({ executablePath: chromePath(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  page.on('pageerror', (e) => console.error('[page]', e.message));
  await page.route('https://cdn.jsdelivr.net/**', (r) => {
    const u = r.request().url(), f = u.endsWith('build/three.module.js') ? 'three.js' : 'three_addons_' + (u.split('/examples/jsm/')[1] || '').replace(/\//g, '_');
    const p = path.join(ROOT, 'tools', 'vendor', f);
    return fs.existsSync(p) ? r.fulfill({ body: fs.readFileSync(p), contentType: 'text/javascript' }) : r.continue();
  });
  await page.goto(`http://127.0.0.1:${port}/index.html`);
  await page.waitForFunction(() => window.__F1 && window.__F1.switchTrack, null, { timeout: 180000 });
  await page.evaluate((t) => window.__F1.switchTrack(t), track);
  await page.waitForFunction(() => window.__F1.W.track && !window.__F1.W.loading, null, { timeout: 300000 });
  await page.evaluate(() => import('/tools/harness.js'));
  await page.evaluate((t) => { const F = window.__F1; F.settings.track = t; F.settings.mode = 'quick'; F.settings.driver = F.settings.driver ?? 0; }, track);
  return { page, close: async () => { await browser.close(); srv.close(); } };
}
/** laps of the AI alone with calibration `cal` (tools/harness.js __calRun) */
export const calRun = (page, laps, cal, opts = {}) => page.evaluate(([l, c, o]) => window.__calRun(l, c, o), [laps, cal, opts]);

/** the calibration of `track` as src/ai/Calibration.js holds it now (or a neutral one) */
export async function readCal(page, track) { return page.evaluate((t) => JSON.parse(JSON.stringify(window.__F1.AI_CAL[t] || { corners: {} })), track); }
/** write `cal` for `track` into src/ai/Calibration.js (the entry between its // <cal:track> markers, or a new one) */
export function writeCal(track, cal) {
  let src = fs.readFileSync(CAL_FILE, 'utf8');
  const fmt = (o) => '{ ' + Object.entries(o).map(([k, v]) => `${k}: ${typeof v === 'number' ? +v.toFixed(3) : JSON.stringify(v)}`).join(', ') + ' }';
  const corners = Object.keys(cal.corners).sort((a, b) => a - b).map((n) => `      ${n}: ${fmt(cal.corners[n])},`).join('\n');
  const block = `  // <cal:${track}>\n  ${track}: {\n    source: ${JSON.stringify(cal.source || '')},\n${cal.fitted ? `    fitted: ${JSON.stringify(cal.fitted)},\n` : ''}    corners: {\n${corners}\n    },\n  },\n  // </cal:${track}>`;
  const re = new RegExp(`  // <cal:${track}>[\\s\\S]*?// </cal:${track}>`);
  if (re.test(src)) src = src.replace(re, block);
  else src = src.replace('export const AI_CAL = {\n', `export const AI_CAL = {\n${block}\n`);
  fs.writeFileSync(CAL_FILE, src);
}
/** the numbered corners grouped by the corner zone they share (a chicane's two turns are tuned together) */
export const groupsOf = (page) => page.evaluate(() => {
  const tr = window.__F1.W.track, out = [];
  for (const z of tr.cornerZones) { const ts = (z.turns || []).filter((t) => (tr.def.corners || []).some((c) => c.n === t && c.s != null)); if (ts.length) out.push(ts); }
  return out;
});
