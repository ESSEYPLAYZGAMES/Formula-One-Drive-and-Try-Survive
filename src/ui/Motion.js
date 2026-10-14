// The menus' motion kit: one place for how every screen moves, so the hub, the setup pages, the overlays, the phone
// and the hangouts all feel like the same game. It holds the timing and colour tokens, the keyframes, a few small
// components (segmented controls with a sliding thumb, tabs with an underline, meters, pips, toasts, drawers,
// popovers, a solid curtain for scene changes), and the helpers that drive them: a page swap where the old and the new
// page overlap in one grid cell (nothing waits, rapid clicks never queue), a same-page update of marked regions, static
// page sets, count-ups, a frame-budgeted queue for background work (portraits), two-click confirmation, and one
// keyboard dispatcher with a stack of scopes so only the topmost open thing hears a key.
// The rules it keeps (the player's laptop is an Intel UHD, GPU-bound): only transform and opacity ever move; nothing
// lasts longer than 260 ms (the sombre .m-calm screens excepted, 700 ms, opacity only); never a backdrop-filter, never
// a CSS filter over a live canvas, never a transition of box-shadow, width, height, top, left or filter; infinite
// animations only on small things (40 px or less) while they are shown; at most a dozen things moving at once. Reduced
// motion (the system setting, or html.m-off from the in-game toggle) turns every duration to 1 ms, so the events still
// fire but nothing slides, staggers or counts.
// It imports nothing; ensureMotion() puts its CSS first in <head>, so style.css and each module's own CSS override it.

export const MOTION_CSS = `
:root{--m-press:80ms;--m-fast:140ms;--m-base:220ms;--m-slow:260ms;--m-calm:700ms;--m-stagger:24ms;--m-dist:10px;
 --ease-out:cubic-bezier(.2,.8,.2,1);--ease-in:cubic-bezier(.4,0,1,1);--ease-io:cubic-bezier(.4,0,.2,1);--ease-pop:cubic-bezier(.3,1.35,.5,1);
 --k-font:"Segoe UI Variable","Segoe UI",Inter,system-ui,Roboto,sans-serif;
 --k-surface:rgba(255,255,255,.045);--k-surface-2:rgba(255,255,255,.08);--k-line:rgba(255,255,255,.09);--k-fg:#eef1f7;--k-dim:#8d95a8;
 --k-seg-bg:rgba(255,255,255,.06);--k-seg-on:#eef1f7;--k-seg-on-fg:#0a0c14;--k-accent:#e10600;--k-up:#33d17a;--k-down:#ff5a4f;--k-warn:#ffb020;
 --k-focus:#00d4ff;--k-sheet:rgba(9,11,18,.94);--k-scrim:rgba(3,4,8,.55);--k-shadow:0 20px 50px rgba(0,0,0,.45)}
.k-light{--k-surface:#fff;--k-surface-2:#f4f6f9;--k-line:#e3e7ed;--k-fg:#151a22;--k-dim:#6b7482;--k-seg-bg:rgba(21,26,34,.06);--k-seg-on:#fff;
 --k-seg-on-fg:#151a22;--k-accent:var(--tc,#e10600);--k-up:#1fae64;--k-down:#d6202e;--k-warn:#e39a1b;--k-focus:#1d6fe0;
 --k-sheet:rgba(250,251,253,.97);--k-scrim:rgba(238,241,245,.72);--k-shadow:0 10px 30px rgba(25,35,60,.10)}
@media (prefers-reduced-motion:reduce){:root{--m-fast:1ms;--m-base:1ms;--m-slow:1ms;--m-calm:1ms;--m-stagger:0ms;--m-dist:0px}}
html.m-off{--m-fast:1ms;--m-base:1ms;--m-slow:1ms;--m-calm:1ms;--m-stagger:0ms;--m-dist:0px}

@keyframes m-in-up{from{opacity:0;transform:translate3d(0,var(--m-dist),0)}}
@keyframes m-in-down{from{opacity:0;transform:translate3d(0,calc(-1*var(--m-dist)),0)}}
@keyframes m-in-right{from{opacity:0;transform:translate3d(calc(2*var(--m-dist)),0,0)}}
@keyframes m-in-left{from{opacity:0;transform:translate3d(calc(-2*var(--m-dist)),0,0)}}
@keyframes m-out{to{opacity:0}}
@keyframes m-out-up{to{opacity:0;transform:translate3d(0,calc(-.6*var(--m-dist)),0)}}
@keyframes m-out-down{to{opacity:0;transform:translate3d(0,calc(.6*var(--m-dist)),0)}}
@keyframes m-out-left{to{opacity:0;transform:translate3d(calc(-1.2*var(--m-dist)),0,0)}}
@keyframes m-out-right{to{opacity:0;transform:translate3d(calc(1.2*var(--m-dist)),0,0)}}
@keyframes m-fade{from{opacity:0}}
@keyframes m-pop{from{opacity:0;transform:scale(.96)}}
@keyframes m-sheet{from{transform:translate3d(0,100%,0)}}
@keyframes m-slide-r{from{transform:translate3d(calc(100% + 24px),0,0)}}
@keyframes m-grow{from{transform:scaleX(0)}}
@keyframes m-badge{from{opacity:0;transform:scale(.4)}}
@keyframes m-dots{0%,80%,100%{opacity:.3;transform:none}40%{opacity:1;transform:translateY(-3px)}}
@keyframes m-pulse{50%{opacity:.55}}
@keyframes m-arm{to{transform:scaleX(0)}}

.m-stage{display:grid;min-height:0}
.m-stage>.m-page{grid-area:1/1;min-width:0;min-height:0}
.m-arrive{animation:var(--m-k,m-in-up) var(--m-base) var(--ease-out) both}
.m-leave{animation:var(--m-k,m-out) var(--m-fast) var(--ease-in) forwards;pointer-events:none}
.m-stagger>*{animation:m-in-up var(--m-base) var(--ease-out) both}
.m-stagger>:nth-child(2){animation-delay:calc(1*var(--m-stagger))}.m-stagger>:nth-child(3){animation-delay:calc(2*var(--m-stagger))}
.m-stagger>:nth-child(4){animation-delay:calc(3*var(--m-stagger))}.m-stagger>:nth-child(5){animation-delay:calc(4*var(--m-stagger))}
.m-stagger>:nth-child(6){animation-delay:calc(5*var(--m-stagger))}.m-stagger>:nth-child(n+7){animation:none}
.m-static,.m-static *{animation:none!important}
.m-swap{animation:var(--m-k,m-fade) var(--m-fast) var(--ease-out) both}
.m-grow{transform-origin:left center;animation:m-grow var(--m-slow) var(--ease-out) both}
.m-calm .m-arrive,.m-calm.m-arrive{animation:m-fade var(--m-calm) ease both}
.m-calm .m-leave,.m-calm.m-leave{animation:m-out var(--m-calm) ease forwards}
.m-calm .m-stagger>*,.m-calm .m-grow{animation:none}
.m-rise{color:var(--k-up);transition:color .4s}.m-fall{color:var(--k-down);transition:color .4s}

.m-pages{display:grid;min-height:0;position:relative}
.m-pages>.m-pg{grid-area:1/1;min-width:0;min-height:0;opacity:0;visibility:hidden;transform:translate3d(20px,0,0);
 transition:opacity var(--m-fast) var(--ease-in),transform var(--m-base) var(--ease-out),visibility 0s linear var(--m-base)}
.m-pages>.m-pg.past{transform:translate3d(-20px,0,0)}
.m-pages>.m-pg.on{opacity:1;visibility:visible;transform:none;transition:opacity var(--m-base) var(--ease-out),transform var(--m-base) var(--ease-out),visibility 0s}

[data-m].m-opening{animation:var(--m-ok,m-pop) var(--m-base) var(--ease-out) both}
[data-m=pop]{--m-ok:m-pop}[data-m=fade]{--m-ok:m-fade}[data-m=up]{--m-ok:m-in-up}
[data-m=sheet]{--m-ok:m-sheet}[data-m=right]{--m-ok:m-slide-r}
[data-m=sheet].m-opening,[data-m=right].m-opening{animation-duration:var(--m-slow)}
[data-m].m-closing{animation:m-out var(--m-fast) var(--ease-in) forwards;pointer-events:none}

.k-layer{position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:16px;background:var(--k-scrim);opacity:0;visibility:hidden;
 transition:opacity var(--m-fast) linear,visibility 0s linear var(--m-fast)}
.k-layer.open{opacity:1;visibility:visible;transition:opacity var(--m-base) linear}
.k-sheet{width:min(var(--w,720px),100%);max-height:100%;display:grid;grid-template-rows:auto minmax(0,1fr) auto;background:var(--k-sheet);
 border:1px solid var(--k-line);border-radius:14px;box-shadow:var(--k-shadow);overflow:hidden;color:var(--k-fg)}
.k-layer>.k-sheet{opacity:0;transform:translate3d(0,10px,0) scale(.985);transition:transform var(--m-base) var(--ease-out),opacity var(--m-base) var(--ease-out)}
.k-layer.open>.k-sheet{opacity:1;transform:none}
.k-layer.closing>.k-sheet{opacity:0;transform:translate3d(0,6px,0) scale(.99);transition-duration:var(--m-fast);transition-timing-function:var(--ease-in)}
@media (max-width:640px){.k-layer{place-items:end stretch;padding:0}
 .k-layer>.k-sheet{width:100%;max-height:calc(100dvh - 24px);border-radius:16px 16px 0 0;transform:translate3d(0,24px,0)}
 .k-sheet::before{content:"";justify-self:center;width:36px;height:4px;border-radius:2px;background:var(--k-line);margin:8px 0 0}}

.k-drawer-scrim{position:absolute;inset:0;z-index:3;background:rgba(21,26,34,.12);opacity:0;pointer-events:none;transition:opacity var(--m-fast) linear}
.k-drawer-scrim.open{opacity:1;pointer-events:auto}
.k-drawer{position:absolute;top:0;right:0;bottom:0;z-index:4;width:min(var(--dw,380px),100%);display:grid;grid-template-rows:auto minmax(0,1fr) auto;
 background:var(--k-sheet);border-left:1px solid var(--k-line);box-shadow:var(--k-shadow);transform:translate3d(100%,0,0);transition:transform var(--m-fast) var(--ease-in)}
.k-drawer.open{transform:none;transition:transform var(--m-slow) var(--ease-out)}
.k-pop{position:absolute;z-index:8;min-width:220px;padding:6px;background:var(--k-sheet);border:1px solid var(--k-line);border-radius:12px;box-shadow:var(--k-shadow);
 transform-origin:top right;opacity:0;transform:scale(.96);visibility:hidden;transition:opacity var(--m-fast),transform var(--m-fast) var(--ease-in),visibility 0s var(--m-fast)}
.k-pop.open{opacity:1;transform:none;visibility:visible;transition:opacity 160ms,transform 160ms var(--ease-out)}

.k-btn{position:relative;height:36px;padding:0 14px;border-radius:10px;font:700 12px/1 var(--k-font);letter-spacing:.08em;background:var(--k-surface);
 border:1px solid var(--k-line);color:var(--k-fg);cursor:pointer;transition:transform var(--m-press) var(--ease-out),background-color var(--m-fast),border-color var(--m-fast),color var(--m-fast)}
.k-btn:active:not(:disabled),.k-hit:active{transform:scale(.97)}
.k-btn--primary{background:var(--k-accent);border-color:var(--k-accent);color:#fff}.k-btn--ghost{background:transparent}
.k-btn--sm{height:30px;padding:0 10px}.k-btn--lg{height:46px;padding:0 22px;font-size:14px}
:where(button,[tabindex],input,select,a):focus-visible{outline:2px solid var(--k-focus);outline-offset:2px}
.k-seg{position:relative;display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;padding:3px;border-radius:12px;background:var(--k-seg-bg)}
.k-seg::before{content:"";position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px)/var(--n,2));border-radius:9px;background:var(--k-seg-on);
 box-shadow:0 1px 3px rgba(0,0,0,.15);transform:translate3d(calc(var(--k,0)*100%),0,0);transition:transform var(--m-base) var(--ease-io)}
.k-seg.none::before{opacity:0}
.k-seg>button{position:relative;z-index:1;min-width:0;min-height:30px;padding:0 12px;background:none;border:0;border-radius:9px;color:var(--k-dim);
 font:600 12px/1.1 var(--k-font);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color var(--m-fast)}
.k-seg>button.on,.k-seg>button.sel{color:var(--k-seg-on-fg)}
.k-tabs{position:relative;display:flex;gap:2px}
.k-tabs>button{background:none;border:0;padding:8px 12px 10px;color:var(--k-dim);font:700 11.5px/1 var(--k-font);letter-spacing:.08em;text-align:left}
.k-tabs>button.on{color:var(--k-fg)}
.k-tabs>.k-ind{position:absolute;left:0;bottom:0;width:1px;height:2px;background:var(--k-accent);transform-origin:0 0;
 transform:translate3d(var(--x,0px),0,0) scaleX(var(--w,0));transition:transform var(--m-base) var(--ease-io)}
.k-card{background:var(--k-surface);border:1px solid var(--k-line);border-radius:14px;padding:12px 14px}
.k-hit{position:relative;cursor:pointer;transition:transform var(--m-fast) var(--ease-out),border-color var(--m-fast)}
.k-hit::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 10px 24px rgba(25,35,60,.14);opacity:0;transition:opacity var(--m-fast);pointer-events:none}
.k-hit:hover{transform:translateY(-2px)}.k-hit:hover::after{opacity:1}
.k-meter{position:relative;height:6px;border-radius:3px;background:var(--k-seg-bg);overflow:hidden}
.k-meter>i{position:absolute;inset:0;background:var(--c,var(--k-accent));transform-origin:left;transform:scaleX(var(--v,0));transition:transform var(--m-slow) var(--ease-out)}
.k-meter.ticks::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 calc(100%/12 - 1px),var(--k-sheet) calc(100%/12 - 1px) calc(100%/12))}
.k-pips{display:inline-flex;gap:4px}.k-pips>i{width:8px;height:8px;border-radius:50%;background:var(--k-line)}
.k-pips>i.on{background:var(--c);opacity:calc(.55 + .45*var(--q,1))}.k-pips>i.nx{background:none;box-shadow:inset 0 0 0 1.5px var(--k-dim)}
.k-pips>i.dv{background:none;box-shadow:inset 0 0 0 1.5px var(--c);animation:m-pulse 1.4s ease-in-out infinite}
.k-tile{display:grid;align-content:center;gap:2px;padding:10px 12px;border-radius:12px;background:var(--k-surface);border:1px solid var(--k-line);min-width:0}
.k-tile>small{font:700 10.5px/1 var(--k-font);letter-spacing:.14em;text-transform:uppercase;color:var(--k-dim)}
.k-tile>b{font:800 22px/1.1 var(--k-font);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.k-tile>span{font-size:12px;color:var(--k-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.k-dots{display:inline-flex;gap:6px}.k-dots>i{width:8px;height:8px;border-radius:4px;background:var(--k-line);transition:background-color var(--m-fast)}.k-dots>i.on{background:var(--k-fg)}
.k-kbd{display:inline-block;font:700 10px/1 var(--k-font);padding:3px 6px;border:1px solid var(--k-line);border-radius:5px;color:var(--k-dim)}
.k-badge{animation:m-badge var(--m-base) var(--ease-pop) both}
.k-typing{display:inline-flex;gap:4px}.k-typing>i{width:6px;height:6px;border-radius:50%;background:currentColor;animation:m-dots 1s infinite}
.k-typing>i:nth-child(2){animation-delay:.15s}.k-typing>i:nth-child(3){animation-delay:.3s}
.k-pager{display:inline-flex;align-items:center;gap:4px;font:600 12px var(--k-font);color:var(--k-dim)}
.k-pager>button{min-width:28px;height:28px;border-radius:8px;background:none;border:1px solid transparent;color:inherit}.k-pager>button.on{border-color:var(--k-line);color:var(--k-fg)}
.k-armed{color:var(--k-down)!important;border-color:var(--k-down)!important}
.k-armed::after{content:"";position:absolute;left:8px;right:8px;bottom:3px;height:2px;background:currentColor;transform-origin:left;animation:m-arm 4s linear forwards}
.k-toasts{position:absolute;left:50%;bottom:16px;z-index:9;width:min(440px,calc(100% - 32px));transform:translateX(-50%);display:flex;flex-direction:column;gap:6px;pointer-events:none}
.k-toast{pointer-events:auto;display:flex;gap:10px;align-items:center;padding:10px 14px;border-radius:10px;background:var(--k-sheet);border:1px solid var(--k-line);
 border-left:3px solid var(--k-accent);box-shadow:var(--k-shadow);font:500 13px/1.35 var(--k-font);color:var(--k-fg);animation:m-in-up var(--m-base) var(--ease-out) both}
.k-toast.up{border-left-color:var(--k-up)}.k-toast.down{border-left-color:var(--k-down)}.k-toast.warn{border-left-color:var(--k-warn)}
.k-toast.out{animation:m-out var(--m-fast) var(--ease-in) forwards}
#m-curtain{position:fixed;inset:0;z-index:90;opacity:0;pointer-events:none;transition:opacity var(--m-base) ease}
#m-curtain.on{opacity:1;pointer-events:auto}

:where(.k-armed){position:relative}
.k-dh{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;border-bottom:1px solid var(--k-line);font:800 13px/1.2 var(--k-font);letter-spacing:.1em;text-transform:uppercase;color:var(--k-fg)}
.k-dh>b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.k-dh>.k-dx{flex:none;width:30px;height:30px;padding:0;border-radius:8px;background:none;border:1px solid var(--k-line);color:var(--k-dim);font:600 13px/1 var(--k-font);cursor:pointer}
.k-db{min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:12px 16px}
.k-df{padding:10px 16px 14px}.k-df:empty{display:none}
`;

const TOK = new WeakMap();
const ARMED = new WeakMap();
const SIZE = new WeakMap();
const SCOPES = [];
const QUEUE = [];
let keysOn = false, qOn = false, holdTo = 0;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
// (the count-up formats: data-fmt on the number)
const FMT = {
  m: (x) => `$${(Math.round(x * 10) / 10).toFixed(1)}M`, i: (x) => String(Math.round(x)), p: (x) => `${Math.round(x)}%`,
  f: (x) => (x < 1 ? `${Math.round(x * 1000)}K` : x < 100 ? `${(Math.round(x * 10) / 10).toFixed(1)}M` : `${Math.round(x)}M`),
};

// ---- setting up ------------------------------------------------------------------------------------------------------
/** the kit's CSS, once, as the first thing in <head> (and the reduce-motion choice the player made last time) */
export function ensureMotion() {
  if (typeof document === 'undefined' || document.getElementById('motion-css')) return;
  const st = document.createElement('style'); st.id = 'motion-css'; st.textContent = MOTION_CSS; document.head.prepend(st);
  try { if (localStorage.getItem('f1sim-motion') === 'off') document.documentElement.classList.add('m-off'); } catch (e) { /* (a private window: no storage, the default) */ }
}
/** reduced motion: the system setting or the in-game toggle -> bool */
export function reduced() {
  try { return document.documentElement.classList.contains('m-off') || window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
}
/** the in-game toggle: on = every duration 1 ms (kept for next time when storage allows) */
export function setReduced(on) {
  document.documentElement.classList.toggle('m-off', !!on);
  try { localStorage.setItem('f1sim-motion', on ? 'off' : ''); } catch (e) { /* (no storage: this session only) */ }
}

// ---- pages -----------------------------------------------------------------------------------------------------------
/**
 * A page change on a host that holds one page: the old page leaves and the new one arrives in the same grid cell, at
 * the same time (no waiting, nothing measured). o: { dir (+1 forward, -1 back), axis 'y' (sections) | 'x' (sub-pages,
 * drills), stagger (the first six children rise one after another), keep (keep the scroll), calm (the sombre fade) }.
 * Only the host's .m-page children are touched: toasts and drawers mounted in the host stay. -> the new page, at once
 */
export function swap(host, html, o = {}) {
  const { dir = 1, axis = 'y', stagger = true, keep = false, calm = false } = o;
  host.classList.add('m-stage'); host.classList.toggle('m-calm', !!calm);
  const page = document.createElement('div'); page.className = 'm-page';
  if (typeof html === 'string') page.innerHTML = html; else if (html) page.append(html);
  const t = (TOK.get(host) || 0) + 1; TOK.set(host, t);
  // (a page still on its way out is dropped at once: five quick clicks leave one page, the last)
  for (const x of [...host.children]) if (x.classList.contains('m-page') && x.classList.contains('m-leave')) x.remove();
  const cur = [...host.children].filter((x) => x.classList.contains('m-page'));
  if (!cur.length || reduced()) {
    for (const x of cur) x.remove();
    host.insertBefore(page, host.firstChild); if (!keep) host.scrollTop = 0; return page;
  }
  const fwd = dir >= 0;
  for (const x of cur) {
    x.classList.remove('m-arrive', 'm-stagger'); x.classList.add('m-leave'); x.inert = true;
    x.style.setProperty('--m-k', axis === 'x' ? (fwd ? 'm-out-left' : 'm-out-right') : (fwd ? 'm-out-up' : 'm-out-down'));
  }
  page.classList.add('m-arrive'); if (stagger) page.classList.add('m-stagger');
  page.style.setProperty('--m-k', axis === 'x' ? (fwd ? 'm-in-right' : 'm-in-left') : (fwd ? 'm-in-up' : 'm-in-down'));
  host.insertBefore(page, cur[cur.length - 1].nextSibling);
  setTimeout(() => { for (const x of cur) x.remove(); }, calm ? 720 : 160);
  // (the arrival classes come off, so showing or hiding something later never replays the entrance)
  setTimeout(() => { page.classList.remove('m-arrive', 'm-stagger'); page.style.removeProperty('--m-k'); }, calm ? 750 : 420);
  if (!keep) host.scrollTop = 0;
  holdLater(260);
  return page;
}
/** a same-page update of [data-region="key"]: new contents, a quick fade (or a slide when dir is given); scroll kept -> the element or null */
export function region(root, key, html, o = {}) {
  const el = root?.querySelector(`[data-region="${key}"]`); if (!el) return null;
  if (typeof html === 'string') el.innerHTML = html; else if (html) el.replaceChildren(html);
  const dir = o.dir || 0;
  el.style.setProperty('--m-k', dir > 0 ? 'm-in-right' : dir < 0 ? 'm-in-left' : 'm-fade');
  el.classList.remove('m-swap'); void el.offsetWidth; el.classList.add('m-swap');
  return el;
}
/** the regions named in keys taken from a full page of html (a module only ever returns whole pages) -> false when a key is missing on either side (swap instead) */
export function patch(root, html, keys, o = {}) {
  if (!root || !keys || !keys.length) return false;
  const T = document.createElement('template'); T.innerHTML = html;
  const pairs = keys.map((k) => [k, root.querySelector(`[data-region="${k}"]`), T.content.querySelector(`[data-region="${k}"]`)]);
  if (pairs.some(([, a, b]) => !a || !b)) return false;
  for (const [k, a, b] of pairs) {
    // (the region's own attributes may have changed too: a state class, a colour)
    for (const at of [...b.attributes]) if (at.name !== 'class') a.setAttribute(at.name, at.value);
    a.className = b.className;
    region(root, k, b.innerHTML, o);
  }
  return true;
}
/** a set of static pages (.m-pages > .m-pg): page i shown, the ones before it to the left; o: { tabs (their buttons get .on), ind (an underline) } -> the page */
export function page(container, i, o = {}) {
  if (!container) return null;
  const P = [...container.children].filter((x) => x.classList.contains('m-pg'));
  P.forEach((p, j) => { p.classList.toggle('past', j < i); p.classList.toggle('on', j === i); p.inert = j !== i; });
  if (o.tabs) { const B = [...o.tabs.querySelectorAll('button')]; B.forEach((b, j) => b.classList.toggle('on', j === i)); if (o.ind && B[i]) underline(o.ind, B[i]); }
  container.dispatchEvent(new CustomEvent('m:page', { detail: { i } }));
  return P[i] || null;
}

// ---- opening and closing ---------------------------------------------------------------------------------------------
/**
 * Open a floating thing: a .k-layer (scrim and sheet) fades in; anything else plays its data-m entrance ('pop', 'fade',
 * 'up', 'sheet', 'right'). While the loading screen is up it waits for it to start hiding (o.now: do not wait).
 * -> a Promise, settled when the entrance has played
 */
export function open(el, kind = 'pop', o = {}) {
  if (!el) return Promise.resolve();
  const go = () => {
    if (el.classList.contains('k-layer')) { el.classList.remove('hidden', 'closing'); el.inert = false; void el.offsetWidth; el.classList.add('open'); }
    else {
      el.classList.remove('hidden', 'm-closing'); el.dataset.m = kind; el.classList.remove('m-opening'); void el.offsetWidth; el.classList.add('m-opening');
      setTimeout(() => el.classList.remove('m-opening'), 280);
    }
    el.dispatchEvent(new CustomEvent('m:open', { bubbles: true }));
    return wait(reduced() ? 0 : 220);
  };
  if (typeof document !== 'undefined' && document.body?.dataset.loader === 'on' && !o.now) {
    return new Promise((res) => {
      let done = false;
      const fire = () => { if (done) return; done = true; window.removeEventListener('loader:hiding', fire); go().then(res); };
      window.addEventListener('loader:hiding', fire);
      // (a loader that never says it is going: open anyway after a while rather than never)
      setTimeout(fire, 20000);
    });
  }
  return go();
}
/** close it again: fades out, then .hidden (so old code that checks .hidden keeps working), then then() -> a Promise */
export function close(el, then) {
  if (!el) { then?.(); return Promise.resolve(); }
  const lay = el.classList.contains('k-layer');
  return new Promise((res) => {
    const done = () => { el.classList.remove(lay ? 'closing' : 'm-closing'); el.classList.add('hidden'); try { then?.(); } finally { res(); } };
    if (lay) { el.classList.remove('open'); el.classList.add('closing'); el.inert = true; } else { el.classList.remove('m-opening'); el.classList.add('m-closing'); }
    el.dispatchEvent(new CustomEvent('m:close', { bubbles: true }));
    if (reduced()) done(); else setTimeout(done, 150);
  });
}

// ---- indicators and numbers ----------------------------------------------------------------------------------------------
/** a rail's highlight to the button it marks: its size set once when it changes (no transition), then moved by transform */
export function indicator(ind, target, axis = 'y') {
  if (!ind || !target) return;
  const z = SIZE.get(ind) || {};
  if (axis === 'x') { const w = target.offsetWidth; if (z.w !== w) { ind.style.width = `${w}px`; z.w = w; } ind.style.transform = `translate3d(${target.offsetLeft}px,0,0)`; }
  else { const h = target.offsetHeight; if (z.h !== h) { ind.style.height = `${h}px`; z.h = h; } ind.style.transform = `translate3d(0,${target.offsetTop}px,0)`; }
  SIZE.set(ind, z);
}
/** a .k-tabs underline under the tab it marks */
export function underline(ind, target) {
  if (!ind || !target) return;
  ind.style.setProperty('--x', `${target.offsetLeft}px`); ind.style.setProperty('--w', String(target.offsetWidth));
}
/** a .k-seg's thumb to button i (i < 0: no thumb), the class on that button */
export function seg(el, i, cls = 'on') {
  if (!el) return;
  const B = [...el.children].filter((b) => b.tagName === 'BUTTON');
  el.style.setProperty('--n', String(Math.max(1, B.length))); el.style.setProperty('--k', String(Math.max(0, i)));
  B.forEach((b, j) => b.classList.toggle(cls, j === i)); el.classList.toggle('none', i < 0);
}
/** a number counting from one value to another (cubic ease-out); nothing when reduced, when there is no old value or it has not changed */
export function countUp(el, from, to, o = {}) {
  const dur = o.dur ?? 600, fmt = o.fmt || String;
  if (!el || reduced() || from == null || from === to || !isFinite(from) || !isFinite(to)) return;
  const t0 = now();
  const step = (t) => { if (!el.isConnected) return; const u = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - u, 3); el.textContent = fmt(from + (to - from) * e); if (u < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
  el.classList.add(to > from ? 'm-rise' : 'm-fall'); setTimeout(() => el.classList.remove('m-rise', 'm-fall'), 1200);
}
/** every [data-n][data-v] under root counts from what memo last saw for its key (data-fmt: m money, i whole, p percent, f followers) */
export function countAll(root, memo) {
  if (!root || !memo) return;
  for (const el of root.querySelectorAll('[data-n][data-v]')) {
    const k = el.dataset.n, v = +el.dataset.v, from = memo[k]; memo[k] = v;
    if (el.closest('.m-calm')) continue;
    countUp(el, from, v, { fmt: FMT[el.dataset.fmt] || FMT.i });
  }
}

// ---- background work ------------------------------------------------------------------------------------------------
/** a job for the frame queue: 8 ms of work a frame, always at least one job (portraits, thumbnails) */
export function later(fn) {
  QUEUE.push(fn);
  if (!qOn) { qOn = true; requestAnimationFrame(drain); }
}
function drain() {
  if (now() < holdTo) { requestAnimationFrame(drain); return; }
  const t0 = now(); let n = 0;
  while (QUEUE.length && (n === 0 || now() - t0 < 8)) { const f = QUEUE.shift(); n++; try { f(); } catch (e) { console.warn('Motion: a queued job failed', e); } }
  if (QUEUE.length) requestAnimationFrame(drain); else qOn = false;
}
/** hold the queue for ms (a transition is playing: it gets the frames) */
export function holdLater(ms) { holdTo = Math.max(holdTo, now() + ms); }

// ---- scene changes and feedback ---------------------------------------------------------------------------------------
/** a solid full-screen cover in one colour, opacity only -> { cover(ms), reveal(ms) }, each a Promise */
export function curtain(color = '#000') {
  let el = document.getElementById('m-curtain');
  if (!el) { el = document.createElement('div'); el.id = 'm-curtain'; document.body.appendChild(el); }
  return {
    cover(ms = 200) { el.style.background = color; el.style.transitionDuration = reduced() ? '1ms' : `${ms}ms`; void el.offsetWidth; el.classList.add('on'); return wait(reduced() ? 0 : ms); },
    reveal(ms = 260) { el.style.transitionDuration = reduced() ? '1ms' : `${ms}ms`; el.classList.remove('on'); return wait(reduced() ? 0 : ms); },
  };
}
const dismiss = (t) => { if (!t || t.classList.contains('out')) return; clearTimeout(t._tm); t.classList.add('out'); setTimeout(() => t.remove(), reduced() ? 0 : 160); };
/** a short message at the foot of host (two at most: the oldest goes); o: { kind 'info'|'up'|'down'|'warn', ms } -> the toast */
export function toast(host, text, o = {}) {
  if (!host || !text) return null;
  const kind = o.kind || 'info', ms = o.ms ?? (kind === 'warn' ? 6000 : 3200);
  let box = [...host.children].find((x) => x.classList.contains('k-toasts'));
  if (!box) { box = document.createElement('div'); box.className = 'k-toasts'; host.appendChild(box); }
  const live = [...box.children].filter((x) => !x.classList.contains('out'));
  while (live.length >= 2) dismiss(live.shift());
  const t = document.createElement('div'); t.className = `k-toast ${kind}`; t.setAttribute('role', 'status'); t.textContent = String(text);
  box.appendChild(t); t._tm = setTimeout(() => dismiss(t), ms); t.onclick = () => dismiss(t);
  return t;
}

// ---- sizing and confirming ------------------------------------------------------------------------------------------
/** how many items of height itemH fit in el (o: { gap, cols, chrome (space taken by headers), min }) -> n */
export function fitCount(el, itemH, o = {}) {
  const { gap = 8, cols = 1, chrome = 0, min = 3 } = o;
  return Math.max(min, Math.floor(((el?.clientHeight || 0) - chrome + gap) / (itemH + gap))) * cols;
}
function disarm(btn) {
  const st = ARMED.get(btn); if (!st) return;
  clearTimeout(st.tm); window.removeEventListener('pointerdown', st.cap, true); ARMED.delete(btn);
  btn.classList.remove('k-armed'); if (btn.isConnected) btn.innerHTML = st.html;
}
/** a two-click confirm on the button itself (never the browser's confirm()): the first click arms it for ms -> false, the second -> true */
export function arm(btn, label = 'CONFIRM?', ms = 4000) {
  if (!btn) return false;
  if (ARMED.has(btn)) { disarm(btn); return true; }
  const st = { html: btn.innerHTML, tm: setTimeout(() => disarm(btn), ms), cap: null };
  st.cap = (e) => { if (!btn.contains(e.target)) disarm(btn); };
  ARMED.set(btn, st); btn.classList.add('k-armed'); btn.textContent = label;
  setTimeout(() => { if (ARMED.get(btn) === st) window.addEventListener('pointerdown', st.cap, true); }, 0);
  return false;
}

// ---- drawers and popovers -------------------------------------------------------------------------------------------
/** a panel sliding in from the right inside host (a positioned element): o: { width, title, foot (html), onClose } -> { el, body, close } */
export function drawer(host, html, o = {}) {
  const scrim = document.createElement('div'); scrim.className = 'k-drawer-scrim';
  const el = document.createElement('div'); el.className = 'k-drawer'; el.setAttribute('role', 'dialog'); el.style.setProperty('--dw', `${o.width || 380}px`);
  // (the drawer is the "show me everything" place: its body alone may scroll)
  el.innerHTML = `<div class="k-dh"><b>${esc(o.title || '')}</b><button class="k-dx" aria-label="Close">✕</button></div><div class="k-db" data-scroll-ok></div><div class="k-df">${o.foot || ''}</div>`;
  const body = el.querySelector('.k-db'); if (typeof html === 'string') body.innerHTML = html; else if (html) body.append(html);
  host.append(scrim, el);
  requestAnimationFrame(() => { scrim.classList.add('open'); el.classList.add('open'); });
  let shut = false, unbind = null;
  const close = () => {
    if (shut) return; shut = true; unbind?.();
    scrim.classList.remove('open'); el.classList.remove('open');
    setTimeout(() => { scrim.remove(); el.remove(); o.onClose?.(); }, reduced() ? 0 : 160);
  };
  scrim.onclick = close; el.querySelector('.k-dx').onclick = close;
  unbind = keys(el, { Escape: () => { close(); } });
  return { el, body, close };
}
/** a small menu under anchor (inside anchor's offset parent, or o.host): o: { align 'right'|'left', host } -> { el, close }; outside clicks and Esc close it */
export function popover(anchor, html, o = {}) {
  const host = o.host || anchor.offsetParent || document.body, align = o.align || 'right';
  const el = document.createElement('div'); el.className = 'k-pop'; el.setAttribute('role', 'menu');
  if (typeof html === 'string') el.innerHTML = html; else if (html) el.append(html);
  host.appendChild(el);
  const a = anchor.getBoundingClientRect(), h = host.getBoundingClientRect();
  el.style.top = `${a.bottom - h.top + 6}px`;
  if (align === 'right') { el.style.right = `${h.right - a.right}px`; el.style.transformOrigin = 'top right'; } else { el.style.left = `${a.left - h.left}px`; el.style.transformOrigin = 'top left'; }
  requestAnimationFrame(() => el.classList.add('open'));
  let shut = false, unbind = null;
  const out = (e) => { if (!el.contains(e.target) && !anchor.contains(e.target)) close(); };
  const close = () => {
    if (shut) return; shut = true; unbind?.(); window.removeEventListener('pointerdown', out, true);
    el.classList.remove('open'); setTimeout(() => el.remove(), reduced() ? 0 : 160);
  };
  setTimeout(() => { if (!shut) window.addEventListener('pointerdown', out, true); }, 0);
  unbind = keys(el, { Escape: () => { close(); } });
  return { el, close };
}

// ---- the keyboard ---------------------------------------------------------------------------------------------------
// (one listener for every menu; a stack of scopes, and only the topmost one that is open hears a key)
const activeScope = (s) => {
  const el = s.scope;
  if (el && el.nodeType === 1) { if (!el.isConnected || el.closest('.hidden') || el.closest('[inert]') || !el.getClientRects().length) return false; }
  return s.when?.() !== false;
};
function onKey(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target, typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''));
  if (typing && e.key !== 'Escape') return;
  for (let i = SCOPES.length - 1; i >= 0; i--) {
    const s = SCOPES[i]; if (!activeScope(s)) continue;
    const k = e.key || '', f = s.map[k] || (k.length === 1 ? s.map[k.toLowerCase()] : null);
    if (!f) return;
    const r = f(e); if (r === 'pass') continue;
    e.preventDefault(); e.stopPropagation(); return;
  }
}
/** keys for a scope (an element, or null for the whole page): map { 'Enter', 'Escape', 'ArrowLeft', 'q', '1', ... : fn(e) ('pass' lets the scope below have it) }; o: { when } -> unbind */
export function keys(scope, map, o = {}) {
  const s = { scope, map: map || {}, when: o.when };
  SCOPES.push(s);
  if (!keysOn) { keysOn = true; window.addEventListener('keydown', onKey, true); }
  return () => { const i = SCOPES.indexOf(s); if (i >= 0) SCOPES.splice(i, 1); };
}
/**
 * Keyboard (and gamepad) for a menu: up/down move between the shown [data-nav] elements (left/right too inside a
 * [data-nav-grid]), Enter or Space presses the focused one or calls primary(), Escape calls back(), q/e and Page
 * Up/Down call tabs(-1/+1), digits press [data-key="n"]. o: { primary, back, tabs } -> { unbind, pad(button) }
 */
export function menuNav(scope, o = {}) {
  const vis = (x) => !!x.getClientRects().length && !x.closest('[inert]') && !x.disabled;
  const items = (root) => [...(root || scope).querySelectorAll('[data-nav]')].filter(vis);
  const move = (d, grid) => {
    const a = document.activeElement, box = grid ? a?.closest?.('[data-nav-grid]') : null;
    if (grid && !box) return 'pass';
    const L = items(box || scope); if (!L.length) return 'pass';
    const i = L.indexOf(a), n = i < 0 ? (d > 0 ? 0 : L.length - 1) : (i + d + L.length) % L.length;
    L[n].focus(); return undefined;
  };
  const press = () => { const a = document.activeElement; if (a && a.matches?.('[data-nav]') && scope.contains(a)) { a.click(); return undefined; } if (o.primary) { o.primary(); return undefined; } return 'pass'; };
  const tab = (d) => { if (!o.tabs) return 'pass'; o.tabs(d); return undefined; };
  const map = {
    ArrowDown: () => move(1), ArrowUp: () => move(-1), ArrowRight: () => move(1, true), ArrowLeft: () => move(-1, true),
    Enter: press, ' ': press, Escape: () => { if (!o.back) return 'pass'; o.back(); return undefined; },
    q: () => tab(-1), e: () => tab(1), PageUp: () => tab(-1), PageDown: () => tab(1),
  };
  for (let n = 1; n <= 9; n++) map[String(n)] = () => { const b = scope.querySelector(`[data-key="${n}"]`); if (!b || !vis(b)) return 'pass'; b.click(); return undefined; };
  const unbind = keys(scope, map);
  const PAD = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'Enter', b: 'Escape', lb: 'q', rb: 'e' };
  return { unbind, pad: (btn) => { const k = PAD[btn]; if (k) map[k](); } };
}
