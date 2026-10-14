// LIFE › Style: her looks, planned together - the partner suite. Three tabs (FACE: eyes, lips, sculpt; HAIR: shape, colour,
// jewellery; WARDROBE: the cut, colour and fabric, shoes and clutch), each with starting points (presets) and fine
// controls - compact sliders, swatches, tiles - for one of four occasions (race day, a night race, a gala, a dinner); her
// in the hub's own studio beside the panel, live (career/Style.js for the state, ui/StylePreview.js for the person:
// colours and make-up in place, a new cut or hairstyle rebuilt a moment after the last change, nothing leaked). Every
// change is saved on the career (c.celebs.style) a moment after it is made; UNDO steps back; "Her own" clears a tab.
// Nothing here touches the relationship itself: no stats, no morale - styling only, inside the game's red-carpet limits,
// and quiet in a grave week. The hub routes its clicks here (HubSocial.socialClick) and stages the preview through
// styleStage(); range and colour inputs and the swatches' hover are listened to while the page is up.
import { CELEB, celebLook, seeing, datingWith, canStyle } from '../career/Celebs.js';
import * as St from '../career/Style.js';
import { StylePreview, previewKey, previewCheap, pointerHeld, tintHair } from './StylePreview.js';
import { makePerson, faceCacheTrim } from '../world/People.js';
import { reduced, arm } from './Motion.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const HEX = /^#[0-9a-f]{6}$/i;
const lin = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const lum = (hex) => { if (!HEX.test(String(hex || ''))) return 0.5; const n = parseInt(hex.slice(1), 16); return 0.2126 * lin((n >> 16) / 255) + 0.7152 * lin(((n >> 8) & 255) / 255) + 0.0722 * lin((n & 255) / 255); };
const initials = (name) => { const w = String(name || '?').trim().split(/\s+/); return (w.length > 1 ? w[0][0] + w[w.length - 1][0] : w[0].slice(0, 2)).toUpperCase(); };

const STYLE_BASE = `
#career .hs-p-style { gap: 8px; }
#career .sty-strip { gap: 10px; }
#career .sty-strip .hs-eye { flex: 0 1 auto; min-width: 96px; }
#career .sty-who { display: flex; gap: 4px; flex: none; }
#career .sty-who button { width: 30px; height: 30px; padding: 0; border-radius: 50%; border: 2px solid transparent; background: var(--a); color: var(--af); font: 800 10px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: 0; }
#career .sty-who button.on { border-color: #151a22; box-shadow: 0 0 0 2px #fff inset; }
#career .sty-occ { flex: none; width: 404px; }
#career .sty-occ > button { padding: 0 6px; font-size: 11.5px; }
#career .sty-tabs { display: flex; align-items: center; gap: 10px; height: 34px; flex: none; }
#career .sty-tabs .k-seg { flex: none; width: 270px; }
#career .sty-tabs .k-seg > button { font-weight: 700; letter-spacing: .06em; font-size: 11px; min-height: 28px; padding: 0 6px; }
#career .sty-pgs { display: inline-flex; gap: 2px; padding: 3px; border-radius: 11px; background: rgba(21,26,34,.06); flex: none; }
#career .sty-pgs button { border: 0; background: transparent; padding: 6px 10px; border-radius: 8px; font-size: 11px; letter-spacing: .03em; color: #5d6675; min-height: 0; }
#career .sty-pgs button.on { background: #fff; color: #151a22; box-shadow: 0 1px 3px rgba(25,35,60,.15); }
#career .hs .sty-pgs button:hover:not(:disabled) { color: #151a22; border-color: transparent; }
#career .sty-tabs .hs-grow { flex: 1; }
#career button.sty-ic { width: 30px; height: 30px; padding: 0; border-radius: 9px; font-size: 15px; letter-spacing: 0; }
#career .sty-saved { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; color: #1f7a4a; white-space: nowrap; min-width: 58px; text-align: right; }
#career .sty-saved.ing { color: #8a93a0; }
#career .sty-pre { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 7px; height: 54px; flex: none; }
#career button.sty-pc { display: flex; align-items: center; gap: 8px; height: 54px; padding: 6px 8px; border-radius: 12px; background: #fff; text-align: left; letter-spacing: 0; font-weight: 600; min-width: 0; overflow: hidden; border: 1px solid rgba(21,26,34,.08); }
#career button.sty-pc.on { border-color: #151a22; box-shadow: 0 0 0 1.5px #151a22 inset; }
#career .sty-pc svg { flex: none; width: 22px; height: 34px; color: #3a4350; }
#career .sty-pc > span { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
#career .sty-pc b { font-size: 11px; line-height: 1.15; color: #151a22; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; hyphens: none; overflow-wrap: normal; word-break: normal; }
#career .sty-pc i { display: flex; gap: 3px; } #career .sty-pc i u { width: 9px; height: 9px; border-radius: 50%; background: var(--c); box-shadow: inset 0 0 0 1px rgba(0,0,0,.15); }
#career .sty-body { flex: 1 1 auto; min-height: 0; overflow: hidden; padding: 10px 14px; display: flex; flex-direction: column; gap: 8px; }
#career .sty-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 2px 22px; align-content: start; }
#career .sty-col { display: flex; flex-direction: column; min-width: 0; }
#career .sty-row { display: grid; grid-template-columns: 92px minmax(0, 1fr) 46px 22px; align-items: center; gap: 6px; min-height: 38px; border-bottom: 1px solid #f1f3f6; }
#career .sty-row.w { grid-column: 1 / -1; grid-template-columns: 92px minmax(0, 1fr) 0 22px; }
#career .sty-row.nv { grid-template-columns: 92px minmax(0, 1fr) 0 22px; }
#career .sty-l { font-size: 11.5px; font-weight: 600; color: #3a4350; line-height: 1.2; }
#career .sty-l small { display: block; font-size: 9.5px; font-weight: 600; color: #6b7480; letter-spacing: .04em; }
#career .sty-c { min-width: 0; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
#career .sty-v { font-size: 11px; font-weight: 700; color: #151a22; text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; }
#career .sty-v.own { color: #6b7480; font-weight: 600; font-style: italic; }
#career button.sty-x { width: 22px; height: 22px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: #8a93a0; font-size: 13px; letter-spacing: 0; }
#career .hs button.sty-x:hover:not(:disabled) { color: #151a22; background: #f0f2f5; border-color: transparent; }
#career button.sty-x.off { visibility: hidden; }
#career input.sty-rng { -webkit-appearance: none; appearance: none; width: 100%; height: 18px; margin: 0; background: transparent; cursor: pointer; }
#career input.sty-rng::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; background: linear-gradient(90deg, #151a22 var(--p, 0%), #dfe3e9 var(--p, 0%)); }
#career input.sty-rng::-moz-range-track { height: 4px; border-radius: 2px; background: linear-gradient(90deg, #151a22 var(--p, 0%), #dfe3e9 var(--p, 0%)); }
#career input.sty-rng::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; margin-top: -5px; border-radius: 50%; background: #fff; border: 2px solid #151a22; box-shadow: 0 1px 3px rgba(0,0,0,.2); transition: transform 80ms; }
#career input.sty-rng::-moz-range-thumb { width: 10px; height: 10px; border-radius: 50%; background: #fff; border: 2px solid #151a22; }
#career input.sty-rng:active::-webkit-slider-thumb { transform: scale(1.15); }
#career input.sty-rng.own::-webkit-slider-runnable-track { background: linear-gradient(90deg, #8a93a0 var(--p, 0%), #e6e9ee var(--p, 0%)); }
#career input.sty-rng.own::-webkit-slider-thumb { border-color: #6b7480; }
#career input.sty-rng:focus-visible { outline: 2px solid #1d6fe0; outline-offset: 2px; border-radius: 4px; }
#career .sty-sw { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
#career button.sw, #career label.sw { width: 22px; height: 22px; min-height: 0; padding: 0; border-radius: 50%; background: var(--c); border: 0; box-shadow: inset 0 0 0 1px rgba(21,26,34,.18); flex: none; letter-spacing: 0; cursor: pointer; transition: transform 80ms, box-shadow 120ms; }
#career .hs button.sw:hover:not(:disabled) { transform: scale(1.08); border: 0; }
#career button.sw.on { box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #151a22; }
#career button.sw.own, #career label.sw.own { outline: 1.5px dashed #5d6675; outline-offset: 2px; }
#career button.sw.none { background: repeating-linear-gradient(135deg, #fff 0 4px, #e3e7ed 4px 5px); }
#career label.sw { position: relative; overflow: hidden; background: conic-gradient(from 0deg, #e5484d, #e39a1b, #f5d76e, #1fae64, #2ec4b6, #3d7bd9, #8b5cf6, #e0457b, #e5484d); }
#career label.sw.on { box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #151a22; }
#career label.sw input { position: absolute; inset: -6px; width: 34px; height: 34px; opacity: 0; cursor: pointer; border: 0; padding: 0; }
#career label.sw > i { position: absolute; inset: 5px; border-radius: 50%; background: var(--v, transparent); box-shadow: 0 0 0 1px rgba(255,255,255,.8); pointer-events: none; }
#career .sty-row.w .sty-sw { gap: 5px; } #career .sty-row.w button.sw, #career .sty-row.w label.sw { width: 24px; height: 24px; }
#career .sty-seg { display: inline-flex; flex-wrap: wrap; gap: 2px; padding: 2px; border-radius: 9px; background: rgba(21,26,34,.06); max-width: 100%; overflow: hidden; }
#career .sty-seg button { border: 0; background: transparent; padding: 5px 7px; min-height: 0; border-radius: 7px; font-size: 10.5px; font-weight: 600; letter-spacing: .02em; color: #5d6675; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; }
#career .sty-seg button.on { background: #fff; color: #151a22; box-shadow: 0 1px 3px rgba(25,35,60,.15); }
#career .sty-seg button.own { color: #151a22; outline: 1.5px dashed #6b7480; outline-offset: -2px; }
#career .sty-seg button i { width: 9px; height: 9px; border-radius: 50%; background: var(--c); box-shadow: inset 0 0 0 1px rgba(0,0,0,.2); }
#career .hs .sty-seg button:hover:not(:disabled) { color: #151a22; border-color: transparent; }
#career .sty-tiles { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
#career button.sty-tile { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; height: 74px; padding: 4px 4px 5px; border-radius: 11px; background: #fbfbfc; border: 1px solid rgba(21,26,34,.08); letter-spacing: 0; min-width: 0; }
#career .sty-tiles.k button.sty-tile { height: 86px; }
#career button.sty-tile svg { width: 34px; height: 42px; color: #3a4350; flex: none; }
#career button.sty-tile b { font-size: 10.5px; font-weight: 700; color: #151a22; text-align: center; line-height: 1.15; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#career button.sty-tile small { font-size: 9px; font-weight: 500; color: #6b7480; text-align: center; line-height: 1.15; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#career button.sty-tile.on { background: #fff; border-color: #151a22; box-shadow: 0 0 0 1.5px #151a22 inset; }
#career button.sty-tile.own:not(.on)::after { content: 'HER OWN'; position: absolute; top: 4px; right: 5px; font-size: 7.5px; font-weight: 800; letter-spacing: .1em; color: #6b7480; }
#career button.sty-tile:disabled { opacity: .35; }
#career .sty-note { font-size: 11px; color: #6b7480; line-height: 1.35; margin: 0; }
#career .sty-note b { color: #3a4350; }
#career .sty-foot { display: flex; align-items: center; gap: 8px; height: 20px; font-size: 11px; color: #6b7480; white-space: nowrap; overflow: hidden; flex: none; padding: 0 4px; }
#career .sty-foot b { color: #3a4350; font-weight: 700; }
#career .sty-foot span { overflow: hidden; text-overflow: ellipsis; }
#career .sty-body.m-swap, #career .sty-pre.m-swap { animation-duration: 200ms; }
#career .sty-turn { position: absolute; z-index: 1; top: calc(var(--top) + 2 * var(--pad)); right: 0; bottom: 0; cursor: grab; touch-action: none; pointer-events: auto; }
#career .sty-turn.drag { cursor: grabbing; }
#career .sty-bar { position: absolute; left: 50%; bottom: calc(var(--pad) + 6px); transform: translateX(-50%); width: max-content; display: flex; gap: 6px; align-items: center; padding: 5px; border-radius: 14px; background: rgba(250,251,253,.9); box-shadow: 0 8px 24px rgba(25,35,60,.14); white-space: nowrap; cursor: default; }
#career .sty-bar .sty-seg { flex-wrap: nowrap; }
#career .sty-bar .sty-seg button { padding: 6px 9px; font-size: 10.5px; }
#career .sty-bar .sty-shim { position: absolute; left: 12px; right: 12px; bottom: 2px; height: 2px; border-radius: 1px; overflow: hidden; opacity: 0; transition: opacity 140ms; }
#career .sty-bar .sty-shim::after { content: ''; position: absolute; inset: 0; width: 40%; background: linear-gradient(90deg, transparent, #151a22, transparent); animation: styShim 700ms linear infinite; }
#career .sty-bar.busy .sty-shim { opacity: .5; }
@keyframes styShim { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
#career .sty-hint { position: absolute; left: 50%; top: 14px; transform: translateX(-50%); font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: rgba(21,26,34,.38); pointer-events: none; white-space: nowrap; }
#career .sty-empty b { display: block; font-size: 15px; }
#career button.hs-look { align-self: flex-start; flex: none; padding: 6px 8px; font-size: 9.5px; letter-spacing: .08em; }
@media (max-height: 760px) { #career .sty-row { min-height: 34px; } #career button.sty-tile { height: 66px; } #career .sty-tiles.k button.sty-tile { height: 76px; } #career button.sty-tile svg { height: 32px; } }
@media (max-height: 700px) { #career .sty-pre { height: 46px; } #career button.sty-pc { height: 46px; padding: 4px 8px; } #career .sty-pc svg { height: 28px; } #career .sty-pc > span { gap: 2px; } #career .sty-pc b { font-size: 10.5px; line-height: 1.1; } #career .sty-row { min-height: 31px; } #career .sty-foot { display: none; } }
@media (max-width: 900px) { #career .sty-grid { grid-template-columns: minmax(0, 1fr); } #career .sty-pre { grid-template-columns: repeat(3, minmax(0, 1fr)); height: auto; } #career .sty-tiles { grid-template-columns: repeat(4, minmax(0, 1fr)); } #career .sty-turn { display: none; } #career .sty-occ { width: auto; } }
@media (prefers-reduced-motion: reduce) { #career .sty-bar .sty-shim::after { animation: none; } }
`;
// (a full 768-high screen: the page's room used - bigger labels, swatches, sliders and tiles; a shorter window keeps the
// compact sizes above. The evening's sheet keeps those always: it is one narrow column)
const STYLE_ROOMY = `
@media (min-height: 761px) and (min-width: 901px) {
#career .sty-row { min-height: 46px; grid-template-columns: 104px minmax(0, 1fr) 56px 26px; }
#career .sty-row.w, #career .sty-row.nv { grid-template-columns: 100px minmax(0, 1fr) 0 26px; }
#career .sty-grid { gap: 2px 26px; }
#career .sty-l { font-size: 13px; }
#career .sty-l small { font-size: 11px; }
#career .sty-v { font-size: 12.5px; }
#career button.sty-x { width: 26px; height: 26px; font-size: 15px; }
#career .sty-seg button { font-size: 12px; padding: 6px 9px; }
#career .sty-seg button i { width: 10px; height: 10px; }
#career .sty-sw { gap: 4px; } #career button.sw, #career label.sw { width: 26px; height: 26px; }
#career .sty-row.w .sty-sw { gap: 6px; } #career .sty-row.w button.sw, #career .sty-row.w label.sw { width: 28px; height: 28px; }
#career label.sw input { width: 40px; height: 40px; } #career label.sw > i { inset: 6px; }
#career input.sty-rng { height: 24px; }
#career input.sty-rng::-webkit-slider-runnable-track { height: 5px; border-radius: 3px; }
#career input.sty-rng::-webkit-slider-thumb { width: 18px; height: 18px; margin-top: -6.5px; }
#career .sty-tiles { gap: 8px; }
#career button.sty-tile { height: 96px; gap: 4px; }
#career .sty-tiles.k button.sty-tile { height: 110px; }
#career button.sty-tile svg { width: 40px; height: 50px; }
#career button.sty-tile b { font-size: 12px; white-space: normal; text-overflow: clip; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.12; }
#career button.sty-tile small { font-size: 10.5px; }
#career .sty-tiles.k button.sty-tile svg { height: 44px; }
#career .sty-note { font-size: 12.5px; }
#career .sty-pc b { font-size: 11.5px; }
}
/* (a page with few controls (airy: under half its card used) - the lips, the sculpt: each larger still, its card filled
   with them rather than left half empty) */
@media (min-height: 700px) and (min-width: 901px) {
#career .sty-body.airy .sty-row { min-height: 62px; grid-template-columns: 124px minmax(0, 1fr) 62px 28px; }
#career .sty-body.airy .sty-row.w, #career .sty-body.airy .sty-row.nv { grid-template-columns: 124px minmax(0, 1fr) 0 28px; }
#career .sty-body.airy .sty-l { font-size: 14.5px; }
#career .sty-body.airy .sty-l small { font-size: 12px; margin-top: 2px; }
#career .sty-body.airy .sty-v { font-size: 14px; }
#career .sty-body.airy .sty-sw { gap: 7px; } #career .sty-body.airy button.sw, #career .sty-body.airy label.sw { width: 32px; height: 32px; }
#career .sty-body.airy label.sw input { width: 46px; height: 46px; } #career .sty-body.airy label.sw > i { inset: 7px; }
#career .sty-body.airy .sty-seg button { font-size: 13px; padding: 8px 12px; }
#career .sty-body.airy input.sty-rng { height: 28px; }
#career .sty-body.airy input.sty-rng::-webkit-slider-runnable-track { height: 6px; }
#career .sty-body.airy input.sty-rng::-webkit-slider-thumb { width: 22px; height: 22px; margin-top: -8px; }
#career .sty-body.airy .sty-note { font-size: 13.5px; }
}`;
export const STYLE_CSS = STYLE_BASE + STYLE_ROOMY;
/** the page's body airy when its controls fill under half of it (larger still), never so large it would overflow */
function airy(R) {
  const B = R?.querySelector('.sty-body'); if (!B || !B.closest('#career')) return;
  B.classList.remove('airy'); const H = B.clientHeight; if (!H) return;
  const used = () => { const t = B.getBoundingClientRect().top; return [...B.children].reduce((m, ch) => Math.max(m, ch.getBoundingClientRect().bottom - t), 0); };
  if (used() < 0.52 * H) { B.classList.add('airy'); if (B.scrollHeight > H + 1 || used() > H - 4) B.classList.remove('airy'); }
}

// ---- glyphs: small line drawings for the tiles and the preset cards ---------------------------------------------------------
const svg = (inner, vb = '0 0 30 38') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const HEAD = '<ellipse cx="15" cy="15" rx="5.2" ry="6.4" fill="#f3e6dc" stroke="none"/><path d="M12.6 21.2v3.3M17.4 21.2v3.3M6 37c.6-6.3 4-9.6 9-9.6s8.4 3.3 9 9.6" stroke-width="1.1" opacity=".55"/>';
const HAIRG = {
  blowout: '<path d="M9.3 15.5c-.5-5.8 2.3-9.6 5.7-9.6s6.3 3.8 5.7 9.6c-.4 3.4 1.8 5.1 1.2 8.4-.6 3.3-3.2 4.2-2.6 7.4M9.3 15.5c.4 3.4-1.8 5.1-1.2 8.4.6 3.3 3.2 4.2 2.6 7.4M10.6 9.2c2.3 1.9 6.2 2.5 9.4 1.6" fill="currentColor" fill-opacity=".3"/>',
  waves: '<path d="M9.6 14.6c0-5.2 2.4-8.6 5.4-8.6s5.4 3.4 5.4 8.6c0 2.6 1.4 3.6 1 6.2-.4 2.6-2 3.4-1.4 6s1.6 3.2.8 5.8M9.6 14.6c0 2.6-1.4 3.6-1 6.2.4 2.6 2 3.4 1.4 6s-1.6 3.2-.8 5.8" fill="currentColor" fill-opacity=".3"/>',
  long: '<path d="M9.8 15c0-5.4 2.3-9 5.2-9s5.2 3.6 5.2 9v17.5M9.8 15v17.5M15 6.2v5" fill="currentColor" fill-opacity=".3"/>',
  curlyLong: '<path d="M8.6 14.6c-.8-5.6 2.6-9.4 6.4-9.4s7.2 3.8 6.4 9.4c1.8 1.3.4 3 1.6 4.4 1.2 1.4-.2 3.2 1 4.6s-.6 3.4.2 4.8M8.6 14.6c-1.8 1.3-.4 3-1.6 4.4-1.2 1.4.2 3.2-1 4.6s.6 3.4-.2 4.8" fill="currentColor" fill-opacity=".3"/><path d="M11 8.6c.8.9 1.9 1.1 2.8.4M16 8.3c.8.9 2 1 2.9.2" stroke-width="1"/>',
  highpony: '<path d="M9.8 14.2c0-5 2.3-8.3 5.2-8.3 2.4 0 4.3 2.2 5 5.6M19.4 6.4c1.9-2.6 5.3-2.5 6.3.6.9 2.8-.8 5.9-.3 9.4.4 3.1 1.6 4.6.6 7.3" fill="currentColor" fill-opacity=".3"/><path d="M18.4 5.4l2.2 2.6" stroke-width="2.6" stroke="#c9a24a"/>',
  ponytail: '<path d="M9.8 14.6c0-5.2 2.3-8.6 5.2-8.6s5.2 3.4 5.2 8.6M20 14.4c2 1 3 3.4 2.6 6.4-.4 3.2-2 5.2-1.6 8.4" fill="currentColor" fill-opacity=".3"/><path d="M19.6 14.6l1.6 1.8" stroke-width="2.2"/>',
  topknot: '<path d="M9.8 14.6c0-5.2 2.3-8.4 5.2-8.4s5.2 3.2 5.2 8.4" fill="currentColor" fill-opacity=".3"/><circle cx="15" cy="4.2" r="3.2" fill="currentColor" fill-opacity=".45"/>',
  bun: '<path d="M9.8 14.6c0-5.2 2.3-8.4 5.2-8.4s5.2 3.2 5.2 8.4" fill="currentColor" fill-opacity=".3"/><ellipse cx="21.6" cy="17.2" rx="2.8" ry="3" fill="currentColor" fill-opacity=".45"/>',
  curlybun: '<path d="M9.6 14.6c0-5 2.3-8 5.4-8s5.4 3 5.4 8" fill="currentColor" fill-opacity=".3"/><circle cx="15" cy="3.8" r="3.8" fill="currentColor" fill-opacity=".45"/><path d="M9.8 13.6c-1 1.2.2 2.4-.6 3.6s.4 2.4-.4 3.6M20.2 13.6c1 1.2-.2 2.4.6 3.6s-.4 2.4.4 3.6" stroke-width="1.1"/>',
  messybun: '<path d="M9.8 14.6c0-5 2.3-8.2 5.2-8.2s5.2 3.2 5.2 8.2" fill="currentColor" fill-opacity=".3"/><path d="M12 4.6c1-2.6 5-2.8 6.2-.2 1.4.1 2 1.6 1.1 2.6-1.6 1.6-6.4 1.8-8.2.2-.8-.9-.3-2.4.9-2.6zM9.9 13.8c-.9 2.4-.5 4.8.4 6.6M20.1 13.8c.9 2.4.5 4.8-.4 6.6" fill="currentColor" fill-opacity=".3"/>',
  bob: '<path d="M9.4 14.8c0-5.6 2.5-8.8 5.6-8.8s5.6 3.2 5.6 8.8v5.6c0 .8-1 1.4-1.8.9M9.4 14.8v5.6c0 .8 1 1.4 1.8.9M10.6 9.6c2.4 1.4 5.8 1.6 8.8.2" fill="currentColor" fill-opacity=".3"/>',
  pixie: '<path d="M9.8 15c-.6-5.6 2.2-9 5.2-9s5.6 3 5 8.2c-1.6-2.4-4.4-3.4-7.8-3-1.2.2-2 1.4-2.4 3.8z" fill="currentColor" fill-opacity=".45"/>',
};
const hairGlyph = (hs) => svg(HEAD + (HAIRG[hs] || HAIRG.long));
/** a silhouette for a cut: its neckline, hem, flare, trousers or jacket */
const KG = {
  blazerdress: { n: 'deepv', h: 0.32, f: 2, lap: 1, belt: 1, sl: 1 }, wrapgown: { n: 'wrap', h: 1, f: 4, slit: 1, asym: 1, belt: 1 }, plunge: { n: 'halter', h: 0.3, f: 2 },
  galaslip: { n: 'straps', h: 1, f: 3 }, slitgown: { n: 'straps', h: 1, f: 4, slit: 1 }, halter: { n: 'halter', h: 1, f: 5, slit: 1 }, gown: { n: 'v', h: 1, f: 9, belt: 1 },
  oneshoulder: { n: 'one', h: 0.45, f: 1, asym: 1 }, sequin: { n: 'straps', h: 0.28, f: 1, dots: 1 }, corset: { n: 'sweet', h: 0.62, f: 1, slit: 1, bone: 1 }, bardot: { n: 'bardot', h: 0.4, f: 1 },
  slip: { n: 'straps', h: 0.62, f: 2 }, bodycon: { n: 'sweet', h: 0.28, f: 0 }, cropset: { n: 'square', h: 0.62, f: 1, crop: 1, sl: 1 }, wrap: { n: 'wrap', h: 0.48, f: 3, sl: 1, belt: 1 },
  dress: { n: 'scoop', h: 0.48, f: 2, belt: 1, sl: 0.3 }, knit: { n: 'crew', h: 0.62, f: 0, sl: 1 }, jumpsuit: { n: 'v', tr: 1, belt: 1 }, pantsuit: { n: 'v', tr: 1, jk: 1, sl: 1 },
  blazer: { n: 'v', tr: 1, jk: 1, sl: 1 }, coord: { n: 'square', tr: 1, sl: 0.5 }, trench: { n: 'v', h: 0.55, f: 3, jk: 1, coat: 1, sl: 1, belt: 1 }, leather: { n: 'crew', tr: 1, jk: 1, sl: 1, short: 1 },
  bomber: { n: 'crew', tr: 1, jk: 1, sl: 1, short: 1 },
  // (a club's: cut-outs (cut: where), a sheer layer (sheer: a fainter fill, its own sleeves and hem), separates (sep))
  cutoutmini: { n: 'sweet', h: 0.24, f: 0, cut: 'waist' }, sidecut: { n: 'one', h: 0.24, f: 0, cut: 'side', slit: 1 }, keyhole: { n: 'crew', h: 0.36, f: 0, sl: 1, cut: 'under' },
  backless: { n: 'crew', h: 0.24, f: 0, sl: 1 }, diamond: { n: 'halter', h: 0.62, f: 0, cut: 'front', slit: 1 }, hipcut: { n: 'straps', h: 0.14, f: 0, cut: 'hip' },
  ribcut: { n: 'crew', h: 0.62, f: 0, sl: 1, cut: 'side', slit: 1 },
  haltermicro: { n: 'halter', h: 0.12, f: 1, dots: 1 }, meshdress: { n: 'crew', h: 0.5, f: 0, sl: 1, sheer: 1 },
  // (lace: its flowers over the cloth (lace: 1), or a trim along the neckline ('trim'); a scalloped hem (sc))
  lacemini: { n: 'scoop', h: 0.28, f: 0, sl: 1, lace: 1, sc: 1 }, lacebustier: { n: 'sweet', h: 0.26, f: 0, bone: 1, lace: 1, sc: 1 }, lacecorset: { n: 'sweet', tr: 1, bone: 1, lace: 1 },
  lacecorsetwide: { n: 'sweet', tr: 1, bone: 1, lace: 1 }, lacebody: { n: 'scoop', tr: 1, jk: 1, sl: 1, lace: 1 }, laceset: { n: 'square', h: 0.26, f: 0, crop: 1, sl: 1, lace: 1, sc: 1 },
  lacesleeve: { n: 'crew', h: 0.26, f: 0, sl: 1, lace: 'sl' }, lacegown: { n: 'crew', h: 1, f: 4, slit: 1, sl: 1, lace: 1 }, lacemidi: { n: 'scoop', h: 0.62, f: 0, sl: 0.3, lace: 1, sc: 1 },
  laceslip: { n: 'straps', h: 0.62, f: 2, lace: 'trim', sc: 1 }, lacecami: { n: 'straps', tr: 1, lace: 'trim' }, eyelet: { n: 'square', h: 0.42, f: 4, lace: 'eye', sc: 1 },
  slipmini: { n: 'plunge', h: 0.24, f: 1 }, camiskirt: { n: 'straps', h: 0.36, f: 0, sep: 1, slit: 1 }, corsettop: { n: 'sweet', tr: 1, bone: 1 }, corsetleather: { n: 'sweet', tr: 1, bone: 1 },
  bandeauset: { n: 'bardot', h: 0.14, f: 0, crop: 1 }, twistset: { n: 'bardot', h: 0.62, f: 0, crop: 1, slit: 1 }, tieset: { n: 'sweet', h: 0.24, f: 0, crop: 1 }, onecrop: { n: 'one', tr: 1, crop: 1 },
  lowrise: { n: 'square', tr: 1, crop: 1, sl: 0.4 }, cropjeans: { n: 'sweet', tr: 1, crop: 1 }, blazerbra: { n: 'sweet', h: 0.14, f: 0, jk: 1, sl: 1, crop: 1 }, blazerbtn: { n: 'sweet', h: 0.24, f: 0, jk: 1, sl: 1 },
  croppants: { n: 'bardot', tr: 1, crop: 1 },
};
// (the pool's: the body's outline faint, the swimwear on it solid - a bikini's top (t: tri, band, balc, sport) and
// bottoms (b: a thong's narrower), a one-piece (o) and its cut-out (cut), a belt; over it (cov) a sarong, a mini, a long
// kaftan or an open shirt, fainter)
const SWG = {
  tribikini: { t: 'tri' }, bandeaubikini: { t: 'band' }, balconette: { t: 'balc' }, sportbikini: { t: 'sport' }, twistbikini: { t: 'band', k: 1 }, stringbikini: { t: 'tri', b: 'thong' }, brazilbikini: { t: 'balc', b: 'thong' },
  monofront: { o: 'square', cut: 'front' }, monoside: { o: 'scoop', cut: 'side' }, monocross: { o: 'scoop', cut: 'cross' }, monoring: { o: 'scoop', cut: 'ring' }, monoplunge: { o: 'plunge', cut: 'sides' },
  highcut: { o: 'scoop' }, scoopback: { o: 'square' }, plungesuit: { o: 'plunge' }, beltedsuit: { o: 'balc', belt: 1 },
  pareo: { t: 'tri', cov: 'sarong' }, crochetmini: { t: 'band', cov: 'mini' }, meshcover: { o: 'scoop', cov: 'mini' }, kaftan: { o: 'scoop', cov: 'long' }, openshirt: { t: 'balc', cov: 'shirt' },
  lacecover: { t: 'band', b: 'thong', cov: 'long' },
};
function swimGlyph(g) {
  let s = '<path d="M10.6 5.6Q9.6 11 11.2 16L10.4 19.4 10 35M19.4 5.6Q20.4 11 18.8 16L19.6 19.4 20 35" stroke-width=".9" opacity=".4"/>';
  const F = 'fill="currentColor" fill-opacity=".55" stroke-width=".8"';
  if (g.t) s += `<path d="${{ tri: 'M11.2 8L13.8 12.4H10.6zM18.8 8L16.2 12.4h3.2z', band: 'M10.6 8.8h8.8v3.2h-8.8z', balc: 'M10.6 9.6q2.2-1.8 4.4.4 2.2-2.2 4.4-.4v2.6h-8.8z', sport: 'M10.8 7.6q4.2 3.2 8.4 0v4.8h-8.4z' }[g.t]}" ${F}/>`;
  if (g.t) s += `<path d="${g.b === 'thong' ? 'M10.8 18.4h8.4l-3.4 5h-1.6z' : 'M10.8 18.2h8.4l-2.8 5.4h-2.8z'}" ${F}/>`;
  if (g.k) s += '<circle cx="15" cy="10.4" r="1" fill="currentColor"/>';
  if (g.o) s += `<path d="${{ scoop: 'M11 7.4q4 3 8 0', square: 'M11 7.6h8', plunge: 'M11 6.4L15 14 19 6.4', balc: 'M11 9q2-1.6 4 .4 2-2 4-.4' }[g.o]}L18.8 16 19.4 18.6l-3.2 5h-2.4l-3.2-5L11.2 16z" ${F}/>`;
  if (g.cut) s += { front: '<ellipse cx="15" cy="14.4" rx="1.4" ry="2.2" fill="#fff" fill-opacity=".85" stroke-width=".7"/>', side: '<ellipse cx="11.9" cy="14.6" rx=".9" ry="2" fill="#fff" fill-opacity=".85" stroke-width=".7"/><ellipse cx="18.1" cy="14.6" rx=".9" ry="2" fill="#fff" fill-opacity=".85" stroke-width=".7"/>', cross: '<path d="M14.2 11.4l1.6 1.4M15.8 11.4l-1.6 1.4M14.2 13.6l1.6 1.4M15.8 13.6l-1.6 1.4" stroke-width=".7"/>', ring: '<circle cx="15" cy="14.6" r="1.3" stroke="#c9a24a" stroke-width=".9"/>', sides: '<path d="M11.4 13.4q1.4 2.2 1 4.6M18.6 13.4q-1.4 2.2-1 4.6" stroke="#fff" stroke-width="1.4"/>' }[g.cut] || '';
  if (g.belt) s += '<path d="M11.2 16h7.6" stroke-width="1.8" opacity=".8"/><rect x="14.1" y="15.2" width="1.8" height="1.6" stroke="#c9a24a" stroke-width=".7"/>';
  if (g.cov) s += { sarong: '<path d="M10.6 18.6L9.4 31.4 19.6 26.8 19.6 18.6z" fill="currentColor" fill-opacity=".14" stroke-width=".8" stroke-dasharray="1.4 1.2"/>', mini: '<path d="M10.4 6L9.6 26h10.8L19.6 6M10.4 6l-2.6 9M19.6 6l2.6 9" fill="currentColor" fill-opacity=".1" stroke-width=".8" stroke-dasharray="1.4 1.2"/>', long: '<path d="M10.4 6L8.6 35h12.8L19.6 6M10.4 6l-3.4 8M19.6 6l3.4 8" fill="currentColor" fill-opacity=".1" stroke-width=".8" stroke-dasharray="1.4 1.2"/>', shirt: '<path d="M12.6 5.2L12 24M17.4 5.2L18 24M10.6 5.6L7.6 14.6M19.4 5.6l3 9" stroke-width="1.3" opacity=".75"/>' }[g.cov] || '';
  return svg(s);
}
function kitGlyph(kit) {
  if (SWG[kit]) return swimGlyph(SWG[kit]);
  const g = KG[kit] || KG.dress, W = 4.6, sh = 9.5, top = 5, waist = 16, hip = 19, hem = g.tr ? 36 : hip + 1.5 + (g.h ?? 0.5) * 16, fl = g.f ?? 1;
  const neck = { deepv: 'M10.4 5l4.6 9 4.6-9', plunge: 'M10.8 5l4.2 8.4 4.2-8.4', v: 'M10.6 5l4.4 5.4L19.4 5', wrap: 'M10.6 5l7 9.4M19.4 5l-2.6 3', straps: 'M11 7.5c1.6 1.6 6.4 1.6 8 0M11 7.5L10.6 3.6M19 7.5l.4-3.9', sweet: 'M10.6 7.6c1.2-1.6 3.2-1.4 4.4.6 1.2-2 3.2-2.2 4.4-.6', halter: 'M11 8.4L14 3.4M19 8.4L16 3.4M11 8.4c1.6 1.4 6.4 1.4 8 0', one: 'M10.4 8.6L19.6 4', bardot: 'M9 7.4h12', square: 'M11.4 5v3.4h7.2V5', scoop: 'M11 5c.8 3.4 7.2 3.4 8 0', crew: 'M12.6 5c.6 1.4 4.2 1.4 4.8 0' }[g.n] || '';
  const L = 15 - W - (g.n === 'bardot' ? 1.4 : 0), R = 15 + W + (g.n === 'bardot' ? 1.4 : 0);
  let body = `<path d="M${L} ${top + 1}Q${15 - W - 0.6} ${waist - 4} ${15 - W + 1.4} ${waist}L${15 - W + 0.6} ${hip}${g.tr ? `L${10} ${hem}h4.2l.8-${hem - hip - 4}l.8 ${hem - hip - 4}h4.2L${15 + W - 0.6} ${hip}` : `L${15 - W - fl} ${hem}${g.asym ? `L${15 + W + fl} ${hem - 6}` : `H${15 + W + fl}`}L${15 + W - 0.6} ${hip}`}L${15 + W - 1.4} ${waist}Q${15 + W + 0.6} ${waist - 4} ${R} ${top + 1}" fill="currentColor" fill-opacity="${g.dots ? '.32' : '.14'}"/>`;
  if (neck) body += `<path d="${neck}" stroke-width="1.2"/>`;
  if (g.belt) body += `<path d="M${15 - W + 1.2} ${waist}h${2 * W - 2.4}" stroke-width="2.2" opacity=".7"/>`;
  if (g.slit) body += `<path d="M${15 + 1.6} ${hem}l1.4-${Math.max(5, (hem - hip) * 0.55)}" stroke-width="1.1"/>`;
  if (g.sl) { const len = g.sl >= 1 ? 13 : 5; body += `<path d="M${L} ${top + 1}l-2.4 ${len}M${R} ${top + 1}l2.4 ${len}" stroke-width="2.2" opacity=".55"/>`; }
  if (g.jk) body += `<path d="M${13} ${top}L${12.4} ${g.short ? hip - 1 : g.coat ? hem : hip + 3}M${17} ${top}L${17.6} ${g.short ? hip - 1 : g.coat ? hem : hip + 3}" stroke-width="1.1"/>`;
  if (g.lap) body += '<path d="M10.4 5l2.6 2.4-1 1.6M19.6 5L17 7.4l1 1.6" stroke-width="1"/>';
  if (g.crop) body += `<path d="M${15 - W + 1} ${waist - 2}h${2 * W - 2}" stroke-width="1" stroke-dasharray="1.5 1.5"/>`;
  if (g.bone) body += `<path d="M13.4 9v6.6M16.6 9v6.6" stroke-width=".9" opacity=".6"/>`;
  // (cut-outs: open ovals where the skin shows; a separate skirt's waistband; a sheer layer's own hem below the dress's)
  if (g.cut) body += { waist: `<ellipse cx="${15 - W + 1.6}" cy="${waist - 2}" rx="1" ry="2"/><ellipse cx="${15 + W - 1.6}" cy="${waist - 2}" rx="1" ry="2"/>`, side: `<ellipse cx="${15 - W + 1.8}" cy="${waist - 2}" rx="1.2" ry="2.6" transform="rotate(-20 ${15 - W + 1.8} ${waist - 2})"/>`, under: `<ellipse cx="15" cy="${waist - 4.6}" rx="2.6" ry="1"/>`, front: `<path d="M15 ${waist - 3}l1.4 2.6-1.4 2.6-1.4-2.6z"/>`, hip: `<ellipse cx="${15 - W + 2}" cy="${hip - 1.2}" rx="1" ry="1.8"/><ellipse cx="${15 + W - 2}" cy="${hip - 1.2}" rx="1" ry="1.8"/>` }[g.cut] || '';
  if (g.sep) body += `<path d="M${15 - W + 1} ${waist + 0.6}h${2 * W - 2}" stroke-width="1.6"/>`;
  if (g.sheer) body += `<path d="M${15 - W - 1} ${hip}L${15 - W - 1.6} ${Math.min(36, hem + 10)}H${15 + W + 1.6}L${15 + W + 1} ${hip}" stroke-width=".8" stroke-dasharray="1.4 1.2" opacity=".7"/>`;
  // (lace: small open flowers over the cloth - on the sleeves alone (sl), eyelets (eye), or a scalloped trim at the
  // neckline; a scalloped hem)
  if (g.lace === 'trim') body += `<path d="M11.2 9.2q.9 1 1.8 0t1.8 0 1.8 0 1.8 0" stroke-width=".8"/>`;
  else if (g.lace === 'sl') body += [[L - 1.2, 10], [L - 1.8, 15], [R + 1.2, 10], [R + 1.8, 15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" stroke-width=".6"/>`).join('');
  else if (g.lace) { const pts = [[13, 10], [17, 11.4], [15, 14.2], [12.6, 17.4], [17.2, 18.6], [14.6, 22], [12.8, 26.5], [17, 27.5], [15, 31.5]].filter(([, y]) => y < (g.tr ? hip + 1 : hem - 1.2)); body += pts.map(([x, y]) => g.lace === 'eye' ? `<ellipse cx="${x}" cy="${y}" rx=".6" ry=".9" fill="currentColor" fill-opacity=".5" stroke="none"/>` : `<circle cx="${x}" cy="${y}" r="1" stroke-width=".55"/><circle cx="${x}" cy="${y}" r=".3" fill="currentColor" stroke="none"/>`).join(''); }
  if (g.sc && !g.tr) body += `<path d="M${15 - W - fl} ${hem}${Array.from({ length: 5 }, (_, i) => `q${(2 * W + 2 * fl) / 10} 1.6 ${(2 * W + 2 * fl) / 5} 0`).join('')}" stroke-width=".8"/>`;
  return svg(body);
}
const eyeGlyph = (ink = '#151a22') => svg(`<path d="M4 20c4-5 10-6.6 15.4-4.6 2.6 1 5 1.8 7.4.8-1.8 2.6-4.6 3.4-6.8 3.2C16 24.6 8.8 24.4 4 20z" fill="${ink}" fill-opacity=".12"/><path d="M4 20c4-5 10-6.6 15.4-4.6 2.6 1 5 1.8 7.4.8" stroke="${ink}" stroke-width="2"/><circle cx="14.6" cy="20.2" r="3" fill="${ink}" fill-opacity=".55" stroke="none"/>`);
const lipGlyph = (c = '#b0122a') => svg(`<path d="M4 20c3.4-3.6 6.6-5 8.6-3.6 1.4-.8 3.4-.8 4.8 0 2-1.4 5.2 0 8.6 3.6-3.6 4.6-7.6 6.4-11 6.4S7.6 24.6 4 20z" fill="${c}" stroke="${c}"/><path d="M4 20c4 .8 7.4 1 11 1s7-.2 11-1" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`);
const metalDot = (k) => (St.METALS.find(([m]) => m === k) || [])[2] || '#c9ccd2';

// ---- the page's own state (kept for the session: coming back finds it as you left it) ------------------------------------
const SUBPG = { face: [['eyes', 'Eyes'], ['lips', 'Lips'], ['sculpt', 'Sculpt']], hair: [['shape', 'Shape'], ['colour', 'Colour'], ['jewel', 'Jewellery']], wear: [['cut', 'Cut'], ['fabric', 'Colour & fabric'], ['shoes', 'Shoes & clutch']] };
const TABS = [['face', 'Face'], ['hair', 'Hair'], ['wear', 'Wardrobe']];
const ZOOMS = [['close', 'Close'], ['face', 'Face'], ['head', 'Head'], ['full', 'Full']];
const YAWS = [['front', 'Front', 0], ['three', '¾', -0.7], ['side', 'Side', -Math.PI / 2], ['back', 'Back', Math.PI]];
const ZOOM_OF = { face: 'face', hair: 'head', wear: 'full' };
let U = null;
const uiOf = (c) => {
  if (!U || U.c !== c) U = { c, who: null, occ: 'evening', tab: 'face', pg: { face: 'eyes', hair: 'shape', wear: 'cut' }, hist: [], zoom: null, yaw: 0, yawK: 'front', drag: null, saveT: 0, saving: false };
  const L = seeing(c);
  if (!U.who || !L.includes(U.who)) { const d = datingWith(c); U.who = d && L.includes(d) ? d : L[0] || null; }
  return U;
};
/** open the page on her (the ✦ on a partner's card) */
export function styleFor(c, id) { const u = uiOf(c); if (seeing(c).includes(id)) { if (u.who !== id) { u.who = id; u.hist = []; } } return u; }

// ---- what she looks like for the occasion being styled -------------------------------------------------------------------------
/** her own look (celebLook) and with your plan over it, for a slot -> { C, rec, slot, moment, base, o, mk, baseHs } */
function lookCtx(c, id, slot, rec0) {
  const C = CELEB[id], rec = rec0 !== undefined ? rec0 : St.styleRec(c, id) || null, [occ, night] = St.SLOT_OCC[slot] || St.SLOT_OCC.evening;
  const base = celebLook(C, { occasion: occ, night, vary: 'preview', pose: 'pose', detail: 1 });
  const ov = rec ? St.resolveRec(rec, { occ, night }) : null;
  const o = ov ? St.applyStyle(base, ov, { baseHs: C.look?.hs }) : base;
  return { C, rec: rec || {}, slot, moment: St.MOMENT[slot], base, o, mk: St.mkValues(o.style?.makeup), baseHs: C.look?.hs || 'long' };
}
/** makePerson's options for the preview: the full detail, still, the catwalk pose */
// (on the FACE tab her sunglasses pushed up onto her head - the make-up is what is being looked at)
const previewOpts = (X, u = null) => { const o = { ...X.o, pose: 'pose', jitter: 0, detail: 1 }; if (u?.tab === 'face' && Array.isArray(o.acc) && o.acc.includes('shades')) o.acc = o.acc.map((a) => (a === 'shades' ? 'shadesUp' : a)); return o; };

// ---- controls -------------------------------------------------------------------------------------------------------------------
const pct = (v, a, b) => `${Math.round(((v - a) / (b - a || 1)) * 100)}%`;
/** a control row: label, control, value, and ↺ back to her own (shown only when it is yours) */
const row = (label, ctl, o = {}) => `<div class="sty-row${o.w ? ' w' : ''}${o.nv ? ' nv' : ''}" data-stykey="${esc(o.path || '')}"><span class="sty-l">${label}${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</span><div class="sty-c">${ctl}</div>${o.nv || o.w ? '<span></span>' : `<output class="sty-v${o.set ? '' : ' own'}" data-styv="${esc(o.path || '')}">${esc(o.val ?? '')}</output>`}${o.path ? `<button class="sty-x${o.set ? '' : ' off'}" data-styrst="${esc(o.path)}" title="Back to her own" aria-label="${esc(String(label).replace(/<[^>]+>/g, ''))}: back to her own">↺</button>` : '<span></span>'}</div>`;
/** a slider: data-sty its path (in her record), its unit's formatter */
const FMT = { pct: (v) => `${Math.round(v * 100)}%`, mm: (v) => `${(+v).toFixed(1)} mm`, deg: (v) => `${Math.round(v)}°`, cm: (v) => `${Math.round(v * 100)} cm`, x: (v) => `${(+v).toFixed(1)}×` };
function slider(X, label, path, a, b, step, eff, fmt, o = {}) {
  const set = St.getAt(X.rec, path) !== undefined, v = set ? St.getAt(X.rec, path) : eff;
  const vt = o.auto && !set ? `auto ${FMT[fmt](v)}` : FMT[fmt](v);
  return row(label, `<input type="range" class="sty-rng${set ? '' : ' own'}" data-sty="${esc(path)}" data-fmt="${fmt}"${o.auto ? ' data-auto="1"' : ''} min="${a}" max="${b}" step="${step}" value="${v}" style="--p:${pct(v, a, b)}" aria-label="${esc(label)}">`, { path, set, val: vt, sub: o.sub });
}
/** swatches (pal: [[hex, name]]), a free colour too; none: a 'none' chip first (her roots: none) */
function swatches(X, label, path, pal, eff, o = {}) {
  const set = St.getAt(X.rec, path) !== undefined, cur = String(set ? St.getAt(X.rec, path) : eff || '').toLowerCase();
  // (a match by the colour as it is painted - 5 bits a channel - so her own shade finds its swatch; hers, not picked by you:
  // a dashed ring ('own'), yours: the solid one)
  const qc = St.qHex(cur), is = (h) => (qc ? St.qHex(h) === qc : h.toLowerCase() === cur), mark = (m) => (m ? (set ? ' on' : ' own') : '');
  const sw = pal.map(([h, n]) => `<button class="sw${mark(is(h))}" data-styset="${esc(path)}|${h}" style="--c:${h}" title="${esc(n)}${is(h) && !set ? ' (her own)' : ''}" aria-label="${esc(n)}" aria-pressed="${set && is(h)}"></button>`).join('');
  const none = o.none ? `<button class="sw none${mark(cur === 'none')}" data-styset="${esc(path)}|none" title="${esc(o.none)}" aria-label="${esc(o.none)}" aria-pressed="${set && cur === 'none'}"></button>` : '';
  // (a colour in no swatch - picked freely, or her own - shown in the picker's circle)
  const free = HEX.test(cur) && !pal.some(([h]) => is(h));
  const pick = `<label class="sw${free ? mark(true) : ''}" title="${free && !set ? 'Her own colour - or any colour' : 'Any colour'}" style="--v:${free ? cur : 'transparent'}"><input type="color" data-sty="${esc(path)}" value="${HEX.test(cur) ? cur : '#808080'}" aria-label="${esc(label)}: any colour"><i></i></label>`;
  return row(label, `<div class="sty-sw" data-stygrp="${esc(path)}">${none}${sw}${pick}</div>`, { path, set, w: o.w, nv: true, sub: o.sub });
}
/** a segmented choice: opts [[value ('' her own), label, dot colour?]] */
function choice(X, label, path, opts, eff, o = {}) {
  const raw = St.getAt(X.rec, path), set = raw !== undefined, cur = set ? String(raw) : '';
  // (nothing picked by you: what she has now (eff) marked with a dashed outline - her own, seen)
  const ef = !set && eff != null && eff !== '' ? String(eff) : null;
  const b = opts.map(([v, n, dot, dis]) => { const on = String(v) === cur, own = !on && ef !== null && String(v) === ef; return `<button class="${on ? 'on' : ''}${own ? ' own' : ''}" data-styset="${esc(path)}|${esc(v)}" aria-pressed="${on}"${dis ? ` disabled title="${esc(dis)}"` : own ? ' title="Her own"' : ''}>${dot ? `<i style="--c:${dot}"></i>` : ''}${esc(n)}</button>`; }).join('');
  return row(label, `<div class="sty-seg" data-stygrp="${esc(path)}">${b}</div>`, { path, set, nv: true, w: o.w, sub: o.sub });
}
/** tiles: opts [[value, name, note, glyph, why-disabled]] */
function tiles(X, path, opts, eff, cls = '') {
  const raw = St.getAt(X.rec, path), cur = raw !== undefined ? String(raw) : '';
  return `<div class="sty-tiles ${cls}" data-stygrp="${esc(path)}">${opts.map(([v, n, note, g, why]) => `<button class="sty-tile${v === cur ? ' on' : ''}${v === eff ? ' own' : ''}" data-styset="${esc(path)}|${esc(v)}" title="${esc(why || `${n}${note ? ` - ${note}` : ''}`)}" aria-pressed="${v === cur}"${why ? ' disabled' : ''}>${g}<b>${esc(n)}</b>${note ? `<small>${esc(note)}</small>` : ''}</button>`).join('')}</div>`;
}

// ---- the page --------------------------------------------------------------------------------------------------------------------
const quiet = (t, p, btn = '') => `<div class="hs-card hs-empty sty-empty"><b>${esc(t)}</b><p>${esc(p)}</p>${btn ? `<div class="hs-acts2">${btn}</div>` : ''}</div>`;
/** LIFE › Style (H: the hub's helpers) -> html (HubSocial wraps it in the page) */
export function styleHTML(c, S = {}, H = {}) {
  const u = uiOf(c);
  if (H.calm) return quiet('Not this week.', 'There will be time for this later.');
  if (!u.who) return quiet('When you are seeing someone, plan her looks here.', 'Her hair, her make-up and what she wears to the races, the galas and dinner: the two of you choose them together, and she wears them wherever she goes with you.', '<button class="hs-btn" data-hsub="life:people">PEOPLE ›</button>');
  const why = canStyle(c, u.who); if (why) return quiet(why === 'Not this week' ? 'Not this week.' : why, 'There will be time for this later.');
  return pageHTML(c, u);
}
/** the page's five regions for an editor's state (o.sheet: the evening's own sheet - one occasion, one column) */
function pageHTML(c, u, o = {}) {
  const X = lookCtx(c, u.who, u.occ);
  return `${stripHTML(c, u, X, o)}${tabsHTML(c, u, X)}${presetsHTML(c, u, X)}${bodyHTML(c, u, X)}${footHTML(c, u, X, o)}`;
}
function stripHTML(c, u, X, o = {}) {
  const L = seeing(c), who = L.length > 1 && !o.sheet ? `<div class="sty-who">${L.map((id) => { const C = CELEB[id], col = St.lookColor(St.styleRec(c, id)) || C.look?.outfit || '#8a93a0'; return `<button class="${id === u.who ? 'on' : ''}" data-stywho="${esc(id)}" style="--a:${col};--af:${lum(col) > 0.45 ? '#151a22' : '#fff'}" title="${esc(C.name)}" aria-label="Style ${esc(C.name)}" aria-pressed="${id === u.who}">${esc(initials(C.name))}</button>`; }).join('')}</div>` : '';
  const k = St.SLOTS.indexOf(u.occ);
  if (o.sheet) return `<div class="hs-strip sty-strip" data-region="sty-strip"><div class="hs-eye"><small>Her look · ${esc(St.SLOT_NAME[u.occ])}</small><b>${esc(X.C.name)}</b></div><span class="hs-grow"></span><span class="sty-saved" data-stysaved>${u.hist.length ? 'Kept when you leave' : ''}</span><button class="hs-btn sty-ic" data-styclose="1" title="Close (L or Esc)" aria-label="Close">✕</button></div>`;
  return `<div class="hs-strip sty-strip" data-region="sty-strip"><div class="hs-eye"><small>Life · her look</small><b>${esc(X.C.name)}</b></div>${who}<span class="hs-grow"></span><span class="sty-saved${u.saving ? ' ing' : ''}" data-stysaved>${u.saving ? 'Saving…' : St.styleRec(c, u.who) ? 'Saved ✓' : ''}</span>
    <div class="k-seg sty-occ" style="--n:${St.SLOTS.length};--k:${k}" role="tablist" aria-label="Occasion">${St.SLOTS.map((s) => `<button class="${s === u.occ ? 'on' : ''}" data-styocc="${s}" title="${esc(St.SLOT_TIP[s])}" role="tab" aria-selected="${s === u.occ}">${esc(St.SLOT_NAME[s])}</button>`).join('')}</div></div>`;
}
function tabsHTML(c, u) {
  const k = TABS.findIndex(([t]) => t === u.tab), pg = u.pg[u.tab];
  return `<div class="sty-tabs" data-region="sty-tabs"><div class="k-seg" style="--n:3;--k:${k}" role="tablist" aria-label="Her look">${TABS.map(([t, n]) => `<button class="${t === u.tab ? 'on' : ''}" data-stytab="${t}" role="tab" aria-selected="${t === u.tab}">${n.toUpperCase()}</button>`).join('')}</div>
    <div class="sty-pgs">${SUBPG[u.tab].map(([p, n]) => `<button class="${p === pg ? 'on' : ''}" data-stypg="${p}">${esc(n)}</button>`).join('')}</div><span class="hs-grow"></span>
    <button class="hs-btn sty-ic" data-styundo="1" title="Undo the last change"${u.hist.length ? '' : ' disabled'}>↶</button><button class="hs-btn" data-styall="1" title="Everything back to her own, for every occasion">ALL HER OWN</button></div>`;
}
/** the presets of the tab: "Her own" first, then the starting points (the wardrobe's for the occasion) */
function presetsOf(u) {
  if (u.tab === 'face') return St.PRESETS.face.map((p) => ({ id: p.id, name: p.name, short: p.short, dots: p.dots, g: eyeGlyph(p.dots[0]) }));
  if (u.tab === 'hair') return St.PRESETS.hair.map((p) => ({ id: p.id, name: p.name, dots: [], g: hairGlyph(p.hs) }));
  return (St.PRESETS.wear[u.occ] || []).map((p) => ({ id: p.id, name: p.name, dots: [p.w.color, p.w.accent !== p.w.color ? p.w.accent : p.w.shoes, metalDot(p.w.metal)].filter(Boolean), g: kitGlyph(p.w.kit) }));
}
/** is a preset what she has on now (the tab's fields equal to it)? */
function presetOn(u, X, p) {
  if (u.tab === 'face') { const m = X.rec.face?.[X.moment], q = St.PRESETS.face.find((x) => x.id === p.id); return !!m && !!q && JSON.stringify(m) === JSON.stringify(normMk(nudeDeep(X, q.mk))); }
  if (u.tab === 'hair') { const S = X.rec.occ?.[u.occ], q = St.PRESETS.hair.find((x) => x.id === p.id); return !!S && S.hs === q.hs && (S.tendrils ?? null) === (q.tendrils ?? null); }
  const W = X.rec.occ?.[u.occ]?.wear, q = (St.PRESETS.wear[u.occ] || []).find((x) => x.id === p.id); return !!W && !!q && Object.entries(nudeDeep(X, q.w)).every(([k, v]) => W[k] === v);
}
/** a preset's make-up as it will be stored (clean through the schema: quantised) */
const normMk = (mk) => { const c0 = { celebs: { style: { v: 1, by: {} } } }; if (mk) St.setMany(c0, 'x', 'face.day', mk); return c0.celebs.style.by.x?.face?.day || null; };
function presetsHTML(c, u, X) {
  const P = presetsOf(u), own = u.tab === 'face' ? !X.rec.face?.[X.moment] : u.tab === 'hair' ? !X.rec.occ?.[u.occ]?.hs && X.rec.occ?.[u.occ]?.tendrils == null : !X.rec.occ?.[u.occ]?.wear?.kit && !X.rec.occ?.[u.occ]?.wear?.color;
  const ownG = u.tab === 'face' ? eyeGlyph('#8a93a0') : u.tab === 'hair' ? hairGlyph(X.base.style?.hs) : kitGlyph(X.base.kit);
  // (a name on its card in two lines at most: a short form where it has one, its hyphens unbroken - the full name in its title)
  const card = (id, name, dots, g, on, why = '', short = '') => `<button class="sty-pc${on ? ' on' : ''}" data-stypre="${esc(id)}"${why ? ` disabled title="${esc(why)}"` : ` title="${esc(name)}"`}>${g}<span><b>${esc(short || name).replace(/-/g, '‑')}</b>${dots.length ? `<i>${dots.map((d) => `<u style="--c:${d}"></u>`).join('')}</i>` : ''}</span></button>`;
  const cards = P.map((p) => { const H = u.tab === 'hair' ? St.PRESETS.hair.find((q) => q.id === p.id) : null; const why = H && !St.hairFits(X.baseHs, H.hs) ? 'Her hair is too short for this' : ''; return card(p.id, p.name, p.dots.map((d) => nudeFor(skinOf(X), d)), p.g, !why && presetOn(u, X, p), why, p.short); });
  return `<div class="sty-pre" data-region="sty-pre">${card('own', 'Her own', [], ownG, own)}${cards.join('')}</div>`;
}
function footHTML(c, u, X, o = {}) {
  const where = u.tab === 'hair' && u.pg.hair === 'colour' ? '<b>Hair colour</b> · hers on every occasion' : u.tab === 'face' ? `<b>${X.moment === 'day' ? 'Race-day make-up' : 'Evening make-up'}</b> · ${X.moment === 'day' ? 'race days, and the casual evenings' : 'shared by a night race, a gala and dinner'}` : `<b>${esc(St.SLOT_NAME[u.occ])}</b> · worn ${esc(St.SLOT_WHERE[u.occ])}`;
  const pin = X.rec.occ?.[u.occ]?.pin === false && u.tab === 'wear' ? ' · mixed into her rotation' : '';
  return `<div class="sty-foot" data-region="sty-foot"><span>${where}${pin}</span><span class="hs-grow"></span><span>${o.sheet ? 'Live in the room' : 'A studio view: under the lights she will shine a little less'}</span></div>`;
}
// ---- her own nudes: the palettes' nude shades (lips, the lip liner, heels, sheer tights) worked out on her skin - one
// fixed light nude reads chalky on deep skin - in the swatches and in a preset that wears one ------------------------------
const mulHex = (h, k) => { const n = parseInt(h.slice(1), 16); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map((v, i) => Math.max(0, Math.min(255, Math.round(v * k[i]))).toString(16).padStart(2, '0')).join(''); };
const NUDE = new Map();
for (const [h, k] of [['#b4786a', [0.82, 0.62, 0.58]], ['#c98a86', [0.86, 0.6, 0.62]], ['#8a5a48', [0.62, 0.42, 0.38]], ['#c9a088', [0.93, 0.88, 0.86]], ['#c9a88e', [0.97, 0.95, 0.94]]]) { NUDE.set(h, k); NUDE.set(St.qHex(h), k); }
const skinOf = (X) => [X.o?.skin, X.base?.skin, X.C?.look?.skin].find((s) => HEX.test(String(s || ''))) || '#e3b994';
/** a palette colour as she wears it: a nude shade made on her skin, any other as it is */
const nudeFor = (skin, h) => { const k = typeof h === 'string' && (NUDE.get(h.toLowerCase()) || NUDE.get(St.qHex(h))); return k ? mulHex(skin, k) : h; };
const palFor = (X, pal, q = false) => pal.map(([h, n]) => { const v = nudeFor(skinOf(X), h); return [q ? St.qHex(v) || v : v, n]; });
/** a preset's values with its nudes made on her skin (deep-copied) */
const nudeDeep = (X, v) => (Array.isArray(v) ? v.map((x) => nudeDeep(X, x)) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, nudeDeep(X, x)])) : nudeFor(skinOf(X), v));
function bodyHTML(c, u, X) {
  const pg = u.pg[u.tab], M = X.moment, mk = X.mk, f = `face.${M}`, S = `occ.${u.occ}`, W = `${S}.wear`, o = X.o;
  // (what she has now, for a control with nothing picked: its value as a choice's string)
  const J = o.jewel || {}, A = Array.isArray(o.acc) ? o.acc : [], sv = (v) => (v == null ? '' : String(v));
  let html = '';
  if (u.tab === 'face' && pg === 'eyes') {
    const th = St.getAt(X.rec, `${f}.liner.thickness`) ?? mk.liner.thickness;
    html = `<div class="sty-grid"><div class="sty-col">
      ${swatches(X, 'Liner shade', `${f}.liner.color`, St.PAL.ink, mk.liner.color || St.autoInk(th))}
      ${slider(X, 'Wing length', `${f}.liner.wing`, 0, 10, 0.5, mk.liner.wing, 'mm')}
      ${slider(X, 'Wing angle', `${f}.liner.angle`, 6, 40, 2, mk.liner.angle ?? St.autoAngle(th), 'deg', { auto: mk.liner.angle == null })}
      ${slider(X, 'Line thickness', `${f}.liner.thickness`, 0, 1, 0.05, mk.liner.thickness, 'pct')}
    </div><div class="sty-col">
      ${slider(X, 'Lashes', `${f}.lashes.volume`, 0, 1, 0.05, mk.lashes.volume, 'pct')}
      ${slider(X, 'Smoky wash', `${f}.shadow.intensity`, 0, 1, 0.05, mk.shadow.intensity, 'pct')}
      ${swatches(X, 'Shadow tone', `${f}.shadow.color`, St.PAL.lid, mk.shadow.color)}
      ${slider(X, 'Lower lash', `${f}.shadow.under`, 0, 1, 0.05, mk.shadow.under, 'pct', { sub: 'smoked under' })}
      ${choice(X, 'Brows', `${f}.brows`, [['soft', 'Soft'], ['brushed', 'Brushed'], ['sculpted', 'Sculpted']], mk.brows)}
    </div></div>`;
  } else if (u.tab === 'face' && pg === 'lips') {
    html = `<div class="sty-grid"><div class="sty-col">
      ${swatches(X, 'Lip colour', `${f}.lips.fill`, palFor(X, St.PAL.lip, true), mk.lips.fill, { sub: 'the inner fill' })}
      ${swatches(X, 'Lip liner', `${f}.lips.liner`, palFor(X, St.PAL.lipLine, true), mk.lips.liner, { sub: 'none: matched' })}
    </div><div class="sty-col">
      ${slider(X, 'Ombré blend', `${f}.lips.ombre`, 0, 1, 0.05, mk.lips.ombre, 'pct', { sub: 'liner into the fill' })}
      ${slider(X, 'Gloss', `${f}.lips.gloss`, 0, 1, 0.05, mk.lips.gloss, 'pct', { sub: 'matte to glass' })}
    </div></div><p class="sty-note">${lipGlyph(mk.lips.fill || nudeFor(skinOf(X), '#b4786a')).replace('<svg', '<svg style="width:22px;height:22px;vertical-align:-6px;margin-right:4px"')} The fill is the lip's own colour; the liner deepens the edge, and the ombré melts it in toward the middle.</p>`;
  } else if (u.tab === 'face') {
    html = `<div class="sty-grid"><div class="sty-col">
      ${slider(X, 'Contour', `${f}.sculpt.contour`, 0, 1, 0.05, mk.sculpt.contour, 'pct', { sub: 'cheek hollows, jaw' })}
      ${slider(X, 'Highlight', `${f}.sculpt.highlight`, 0, 1, 0.05, mk.sculpt.highlight, 'pct', { sub: 'cheekbones, nose' })}
      ${slider(X, 'Dewy finish', `${f}.sculpt.dew`, 0, 1, 0.05, mk.sculpt.dew, 'pct')}
    </div><div class="sty-col">
      ${slider(X, 'Blush', `${f}.sculpt.blush`, 0, 1, 0.05, mk.sculpt.blush, 'pct')}
      ${swatches(X, 'Blush tone', `${f}.sculpt.blushColor`, St.PAL.blush, mk.sculpt.blushColor)}
      ${choice(X, 'Base look', `${f}.look`, St.LOOK_NAMES, mk.look, { sub: 'what the rest builds on' })}
    </div></div>`;
  } else if (u.tab === 'hair' && pg === 'shape') {
    const eff = X.base.style?.hs || X.baseHs, hs = o.style?.hs || eff;
    html = `${tiles(X, `${S}.hs`, St.HAIR_STYLES.map(([k, n]) => [k, n, '', hairGlyph(k), St.hairFits(X.baseHs, k) ? '' : X.baseHs === 'pixie' || X.baseHs === 'bob' ? 'Her hair is too short for this' : 'She would have to cut it']), eff)}
      <div class="sty-grid"><div class="sty-col">${choice(X, 'Tendrils', `${S}.tendrils`, [['', 'Her own'], ['0', 'None'], ['1', 'Soft'], ['2', 'Full']], sv(o.style?.tendrils), { sub: 'framing the face' })}</div>
      <div class="sty-col">${choice(X, 'Fringe', `${S}.fringe`, [['', 'Her own'], ['true', 'Swept'], ['false', 'Off the face']], sv(o.style?.fringe), { sub: St.UPDOS.has(hs) ? 'with the hair down' : '' })}</div></div>
      <p class="sty-note">For <b>${esc(St.SLOT_NAME[u.occ])}</b>: ${esc(St.SLOT_WHERE[u.occ])}. ${hs === 'highpony' ? 'The snatched pony is tied in a cuff in her jewellery metal (Jewellery).' : 'A wet race keeps her hair up under the coat; karting, a ponytail.'}</p>`;
  } else if (u.tab === 'hair' && pg === 'colour') {
    const H = 'hair';
    html = `<div class="sty-grid"><div class="sty-col">
      ${swatches(X, 'Base colour', `${H}.color`, St.PAL.hair, o.hair)}
      ${swatches(X, 'Roots', `${H}.root`, St.PAL.root, o.style?.tone?.root || 'none', { none: 'No darker roots' })}
      ${slider(X, 'Root depth', `${H}.melt`, 0.02, 0.2, 0.01, o.style?.tone?.melt ?? 0.07, 'cm', { sub: 'how far it melts' })}
    </div><div class="sty-col">
      ${swatches(X, 'Ends', `${H}.ends`, St.PAL.ends, o.style?.tone?.ends || 'none', { none: 'No lighter ends' })}
      ${slider(X, 'Strand contrast', `${H}.strands`, 0, 2, 0.1, o.style?.tone?.strands ?? 1, 'x', { sub: 'lock to lock' })}
      ${slider(X, 'Shine', `${H}.shine`, 0, 1, 0.05, o.style?.shine ?? 0.5, 'pct')}
    </div></div><p class="sty-note">Her colour is hers on every occasion. Roots melt down from the parting; ends lighten the lengths, like a balayage.</p>`;
  } else if (u.tab === 'hair') {
    const hs = o.style?.hs || X.baseHs, down = !St.UPDOS.has(hs), mt = St.getAt(X.rec, `${W}.metal`);
    html = `${choice(X, 'Metal', `${W}.metal`, [['', 'Auto'], ...St.METALS], sv(J.metal), { w: true, sub: 'all of it' })}
      ${choice(X, 'Earrings', `${W}.earrings`, [['', 'Her own'], ...St.EARRINGS], A.includes('earrings') ? (['stud', 'hoop', 'long'].includes(J.earrings) ? J.earrings : 'drop') : 'none', { w: true, sub: down ? 'hair down: hidden' : 'hair up: on show' })}
      <div class="sty-grid"><div class="sty-col">
      ${choice(X, 'Choker', `${W}.choker`, [['', 'Her own'], ...St.CHOKERS], J.choker === 'metal' || J.choker === 'ribbon' ? J.choker : A.includes('choker') ? 'metal' : 'none')}
      ${choice(X, 'Neck chain', `${W}.chain`, [['', 'Her own'], ['true', 'On'], ['false', 'Off']], typeof J.chain === 'boolean' ? String(J.chain) : '')}
    </div><div class="sty-col">
      ${choice(X, 'Cuffs', `${W}.cuffs`, [['', 'Her own'], ['0', 'None'], ['1', 'One'], ['2', 'Both']], String(Math.max(J.cuffs === 1 || J.cuffs === 2 ? J.cuffs : 0, A.includes('cuffs') ? 2 : A.includes('cuff') ? 1 : 0)), { sub: 'at the wrist' })}
    </div></div><p class="sty-note">${mt ? `<b>${esc(St.METAL_NAME[mt])}</b> for the earrings, the choker, the chain, the cuffs and ${hs === 'highpony' ? 'the cuff round her snatched pony' : 'a high pony\'s cuff'}.` : 'Auto: gold with a warm accent colour, silver otherwise - and the high pony\'s cuff to match.'} ${down ? 'With her hair down the earrings are behind it: an updo (Shape) shows them.' : ''}</p>`;
  } else if (u.tab === 'wear' && pg === 'cut') {
    // (a club's or a pool's many cuts a group at a time - the dresses, or the tops and their bottoms; the bikinis, the
    // one-pieces, the cover-ups - never more than two rows)
    const GR = St.GROUPS?.[u.occ] || null, has = (g) => !!GR && GR.some(([x]) => x === g);
    const eff = X.base.kit, cg = GR ? (has(u.cg) ? u.cg : has(St.kitGroup(o.kit, u.occ)) ? St.kitGroup(o.kit, u.occ) : GR[0][0]) : null, KL = cg ? St.KITS[u.occ].filter((k) => St.kitGroup(k, u.occ) === cg) : St.KITS[u.occ];
    const grp = cg ? row('Show', `<div class="sty-seg">${GR.map(([g, n]) => `<button class="${g === cg ? 'on' : ''}" data-stycg="${g}" aria-pressed="${g === cg}">${esc(n)}</button>`).join('')}</div>`, { nv: true, w: true }) : '';
    html = `${grp}${tiles(X, `${W}.kit`, KL.map((k) => [k, St.KIT_INFO[k].name, St.KIT_INFO[k].note, kitGlyph(k), '']), eff, 'k')}
      <div class="sty-grid"><div class="sty-col">${choice(X, 'Wear it', `${S}.pin`, [['', 'Every time'], ['false', 'Mix into her rotation']])}</div><div class="sty-col"><p class="sty-note" style="padding-top:10px">${esc(St.SLOT_NAME[u.occ])}: ${esc(St.SLOT_WHERE[u.occ])}. "Mix in" makes it one of her outfits, worn some events, not all.</p></div></div>`;
  } else if (u.tab === 'wear' && pg === 'fabric') {
    const kit = o.kit, KI = St.KIT_INFO[kit] || {}, fab = (KI.fab || []);
    const legs = KI.tr ? swatches(X, 'Trousers', `${W}.legs`, St.PAL.garment.slice(0, 11), o.legs, { w: true, sub: 'none: matched' })
      : choice(X, 'Legs', `${W}.legs`, [['', 'Her own'], ['bare', 'Bare'], ...palFor(X, St.PAL.tights).map(([h, n]) => [h, n, h])], HEX.test(String(o.legs || '')) ? String(o.legs).toLowerCase() : 'bare', { w: true });
    html = `${swatches(X, 'Main colour', `${W}.color`, St.PAL.garment, o.color, { w: true })}
      ${swatches(X, KI.sec || 'Accent', `${W}.accent`, St.PAL.garment, o.accent, { w: true, sub: 'and her clutch' })}
      ${fab.length ? choice(X, 'Fabric', `${W}.fabric`, [['', 'Her own'], ...St.FABRICS.filter(([k]) => fab.includes(k))], sv(o.fabric), { w: true }) : row('Fabric', `<span class="sty-note">${esc(KI.fabNote || 'A knit: no other fabric for this cut')}</span>`, { nv: true })}
      ${legs}`;
  } else {
    const ownMetal = St.getAt(X.rec, `${W}.metal`);
    // (the shoes' kind on a club night or a night race - strappy sandals, boots to the knee or over it; a mini bag on a
    // chain in place of the clutch)
    const night = u.occ === 'club' || u.occ === 'night', pool = u.occ === 'pool';
    html = `${night || pool ? choice(X, 'Shoes', `${W}.shoe`, [['', 'Her own'], ...(pool ? St.POOL_SHOES : St.SHOE_TYPES)], sv(o.shoe), { w: true }) : ''}${swatches(X, night || pool ? 'Shoe colour' : 'Heels', `${W}.shoes`, palFor(X, St.PAL.heel), o.shoes, { w: true })}
      ${choice(X, night ? 'Finish' : 'Heel finish', `${W}.shoeFinish`, [['', 'Her own'], ...St.SHOE_FINISHES], sv(o.shoeFinish), { w: true, sub: 'patent: a mirror' })}
      <div class="sty-grid"><div class="sty-col">
      ${night ? choice(X, 'Bag', `${W}.bag`, [['', 'Her own'], ['true', 'Mini bag'], ['false', 'None']], A.includes('bag') ? 'true' : 'false') : ''}${choice(X, 'Clutch', `${W}.clutch`, [['', 'Her own'], ['true', 'Carry one'], ['false', 'None']], A.includes('clutch') ? 'true' : 'false')}
      ${choice(X, 'Hardware', `${W}.clutchMetal`, [['', 'Match'], ...St.METALS.map(([k, , d]) => [k, k === 'rose' ? 'Rose' : k[0].toUpperCase() + k.slice(1), d])], sv(J.clutchMetal), { sub: ownMetal ? `match: ${St.METAL_NAME[ownMetal].toLowerCase()}` : 'clasp and frame' })}
    </div><div class="sty-col">
      ${swatches(X, 'Clutch colour', `${W}.clutchColor`, St.PAL.garment.slice(0, 8), o.jewel?.clutchColor || o.accent, { sub: 'none: the accent' })}
    </div></div><p class="sty-note">The clutch's frame and clasp are its hardware: "Match" takes her jewellery's metal.</p>`;
  }
  return `<div class="hs-card sty-body" data-region="sty-body" data-pg="${u.tab}:${pg}">${html}</div>`;
}

// ---- the preview: her in the hub's studio ------------------------------------------------------------------------------------------
const STAND = [-9, 0, -12], AZ = 0.9, FRONT = -AZ;
let PV = null, ROOM = null, MOUNT = null, VKEY = null;
const host = (room) => ({ scene: room.scene, renderer: room.renderer, camera: room.cam, dirty: () => { room.dirty = true; } });
/** the camera's goal for a zoom: full length, the head and shoulders, the face */
function goalOf(zoom) {
  const h = PV?.headWorld() || [STAND[0], 1.62, STAND[2]], [x, , z] = STAND;
  // (close: the eyes - or, on the Lips page, the mouth - near enough to judge a liner's angle and a gloss)
  if (zoom === 'close') return { az: AZ, el: 0.02, dist: 0.62, t: [h[0], h[1] + (U?.tab === 'face' && U.pg.face === 'lips' ? -0.05 : 0.025), h[2]], world: true };
  if (zoom === 'face') return { az: AZ, el: 0.03, dist: 1.0, t: [h[0], h[1] + 0.02, h[2]], world: true };
  if (zoom === 'head') return { az: AZ, el: 0.05, dist: 2.3, t: [h[0], h[1] - 0.22, h[2]], world: true };
  return { az: AZ, el: 0.06, dist: 4.5, t: [x, 0.97, z], world: true };
}
function camTo(zoom) {
  if (!ROOM) return;
  const G = goalOf(zoom), key = `sty:${zoom}:${G.t.map((v) => v.toFixed(2)).join(',')}`;
  if (typeof ROOM.viewTo === 'function') ROOM.viewTo(key, G); VKEY = key;
}
// (the eyes and the lips pages close in on them; the sculpt page the whole face)
const zoomNow = (u) => u.zoom || (u.tab === 'face' && u.pg.face !== 'sculpt' ? 'close' : ZOOM_OF[u.tab]) || 'full';
/** turn her to a named angle, or by an amount (drag) */
function yawTo(u, k, ms = 240) { const Y = YAWS.find((y) => y[0] === k); if (!Y) return; u.yawK = k; u.yaw = Y[2]; PV?.turn(FRONT + u.yaw, ms); barSync(u); }
let busyT = 0;
/** the preview updated from her record as it now is (draft: a slider still moving) */
function refreshPreview(c, u, draft = false) {
  if (!PV || !u.who) return;
  if (!PV.person && !PV.building) return;   // (the first build is on its way: it takes the latest when it comes)
  const r = PV.update(previewOpts(lookCtx(c, u.who, u.occ), u), { draft });
  if (r !== 'queued') return;
  // (a rebuild on its way: a shimmer on the toolbar until she is in; then the camera on her again - heels change her height)
  const bar = MOUNT?.el.querySelector('.sty-bar'); bar?.classList.add('busy'); clearTimeout(busyT);
  const chk = () => { if (!PV) return; if (PV.building || (PV.want && previewKey(PV.want) !== PV.key)) { busyT = setTimeout(chk, 120); return; } bar?.classList.remove('busy'); if (MOUNT) camTo(zoomNow(u)); };
  busyT = setTimeout(chk, 240);
}
function barSync(u) {
  const el = MOUNT?.el; if (!el) return;
  for (const b of el.querySelectorAll('[data-styview]')) b.classList.toggle('on', b.dataset.styview === u.yawK);
  for (const b of el.querySelectorAll('[data-styzoom]')) b.classList.toggle('on', b.dataset.styzoom === zoomNow(u));
}
/** the turning overlay over the open studio, its toolbar - mounted while the page is up */
function mount(X, c, u) {
  if (MOUNT) { MOUNT.c = c; return; }
  const ui = X.el.querySelector('.ch-ui'); if (!ui) return;
  const el = document.createElement('div'); el.className = 'sty-turn';
  el.innerHTML = `<span class="sty-hint">Drag to turn her · scroll to zoom</span><div class="sty-bar"><div class="sty-seg">${YAWS.map(([k, n]) => `<button data-styview="${k}">${n}</button>`).join('')}</div><div class="sty-seg">${ZOOMS.map(([k, n]) => `<button data-styzoom="${k}">${n}</button>`).join('')}</div><span class="sty-shim"></span></div>`;
  ui.appendChild(el);
  const place = () => { const p = X.el.querySelector('.ch-panel'); if (!p) return; const r = p.getBoundingClientRect(), R = X.el.getBoundingClientRect(); el.style.left = `${Math.round(r.right - R.left + 6)}px`; };
  place();
  const M = MOUNT = { el, c, X, off: [] };
  const on = (t, ev, f, o) => { t.addEventListener(ev, f, o); M.off.push(() => t.removeEventListener(ev, f, o)); };
  on(window, 'resize', () => setTimeout(place, 0));
  // (the panel's own size: its right edge is where the studio's open space starts)
  try { const pn = X.el.querySelector('.ch-panel'), ro = new ResizeObserver(() => place()); if (pn) { ro.observe(pn); M.off.push(() => ro.disconnect()); } } catch (e) { /* (no observer: the window's resize alone) */ }
  // (turning her: a drag across the studio; a double-click faces her front again; the wheel steps the zoom)
  on(el, 'pointerdown', (e) => { if (e.target.closest('.sty-bar')) return; el.setPointerCapture?.(e.pointerId); u.drag = { x: e.clientX, y0: u.yaw }; el.classList.add('drag'); });
  on(el, 'pointermove', (e) => { if (!u.drag) return; u.yaw = u.drag.y0 + (e.clientX - u.drag.x) * 0.01; u.yawK = ''; PV?.turn(FRONT + u.yaw, 0); });
  const up = () => { if (!u.drag) return; u.drag = null; el.classList.remove('drag'); barSync(u); };
  on(el, 'pointerup', up); on(el, 'pointercancel', up);
  on(el, 'dblclick', (e) => { if (!e.target.closest('.sty-bar')) yawTo(u, 'front'); });
  on(el, 'wheel', (e) => { e.preventDefault(); const i = ZOOMS.findIndex(([k]) => k === zoomNow(u)), j = Math.max(0, Math.min(ZOOMS.length - 1, i + (e.deltaY > 0 ? 1 : -1))); if (j !== i) { u.zoom = ZOOMS[j][0]; camTo(u.zoom); barSync(u); } }, { passive: false });
  on(el, 'click', (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.styview) yawTo(u, b.dataset.styview); else if (b.dataset.styzoom) { u.zoom = b.dataset.styzoom; camTo(u.zoom); barSync(u); } });
  // (the page's own inputs - sliders, the colour pickers - and a swatch tried on under the pointer)
  on(X.el, 'input', (e) => onInput(hubEd(M.c), e, false), true);
  on(X.el, 'change', (e) => onInput(hubEd(M.c), e, true), true);
  on(X.el, 'pointerover', (e) => onPeek(hubEd(M.c), e), true);
  on(X.el, 'pointerout', (e) => { if (e.target.closest?.('[data-styset]') && !e.relatedTarget?.closest?.('[data-styset]')) PV?.unpeek(); }, true);
  barSync(u);
}
function unmount() { if (!MOUNT) return; for (const f of MOUNT.off) f(); MOUNT.el.remove(); MOUNT = null; }
/**
 * The hub's stage() for every page: on LIFE › Style her preview up (built at once the first time), the camera on her,
 * the overlay mounted -> true (the hub leaves the camera alone); any other page: all of it put away -> false
 */
export function styleStage(room, X, tab, S) {
  const on = tab === 'life' && (S?.sub || '') === 'style' && !!X?.c;
  LAST = on ? { room, X } : null; watchSize();
  if (!on) { styleLeave(false); return false; }
  const c = X.c, u = uiOf(c);
  if (!u.who || canStyle(c, u.who) || !room || innerWidth < 700) { styleLeave(false); return false; }
  if (ROOM !== room) { PV?.dispose(); PV = null; ROOM = room; }
  if (!PV) PV = new StylePreview(host(room), { at: STAND, yaw: FRONT + u.yaw, debounce: 200, disc: 0.55 });
  mount(X, c, u); camTo(zoomNow(u)); room.setPortrait?.(true, 'style'); requestAnimationFrame(() => airy(root()));
  const opts = previewOpts(lookCtx(c, u.who, u.occ), u), bar = () => MOUNT?.el.querySelector('.sty-bar');
  const build = () => {
    clearTimeout(stageT); stageT = 0;
    if (!MOUNT || !PV || HUBX(X) !== 'style') return;
    try { PV.show(previewOpts(lookCtx(c, u.who, u.occ), u)); } catch (e) { console.warn('HubStyle: the preview could not be built', e); return; } finally { bar()?.classList.remove('busy'); }
    PV.turn(FRONT + u.yaw, 0); camTo(zoomNow(u));
  };
  // (her, as she was left: back at once. A first build - a few hundred ms of the main thread - only once the page has
  // slid in (its 220 ms), the shimmer on the toolbar meanwhile: the slide never stalls on it)
  clearTimeout(stageT);
  if ((PV.person && !PV.hidden) || (PV.hidden && previewKey(opts) === PV.key)) build();
  else { bar()?.classList.add('busy'); stageT = setTimeout(() => requestAnimationFrame(build), reduced() ? 0 : 250); }
  return true;
}
/** the hub page now showing ('style' while LIFE › Style is up) */
const HUBX = (X) => (X.tab === 'life' && X.sub === 'style' && X.mode === 'hub' ? 'style' : '');
let stageT = 0;
// (a window narrowed below the studio's width puts her away; widened again, she comes back - without the page drawn again)
let LAST = null, sizeOn = false, sizeT = 0;
function watchSize() {
  if (sizeOn) return; sizeOn = true;
  window.addEventListener('resize', () => {
    clearTimeout(sizeT);
    sizeT = setTimeout(() => {
      const L = LAST; if (!L || HUBX(L.X) !== 'style' || L.X.el?.style.display === 'none') return;
      if (innerWidth < 700) { if (MOUNT) styleLeave(false); } else if (!MOUNT) styleStage(L.room, L.X, 'life', { sub: 'style' });
    }, 220);
  });
}
/** a save still waiting on its timer made now (the tab closing, the page hidden: an edit never lost) */
export function styleFlush() { if (U?.saveT) { clearTimeout(U.saveT); U.saveT = 0; try { U.c?.save?.(); } catch (e) { console.warn('HubStyle: save failed', e); } U.saving = false; } }
/** off the page (or the hub closing): the save made now, her preview put away (flush: also the preview itself, for good) */
export function styleLeave(dispose = false) {
  styleFlush();
  PV?.unpeek?.(); clearTimeout(stageT); stageT = 0;
  unmount(); (ROOM || LAST?.room)?.setPortrait?.(false, 'style');
  // (another hub page: she is kept out of sight - coming back to Style is instant; the hub closing: let go for good)
  if (PV) { if (dispose) { PV.dispose(); PV = null; ROOM = null; } else if ((PV.person && !PV.hidden) || PV.disc || PV.building) PV.hide({ keep: true }); }
}

// ---- changes ----------------------------------------------------------------------------------------------------------------------
// (an editor: E = { c (the career - or a draft of it), u (its state), root() (its element), o (pageHTML's options),
// refresh(draft) (her updated), save() (the change kept), turn(k), peek(opts), unpeek() } - the hub's page, or an
// evening's sheet, the same controls in both)
const root = () => document.querySelector('#career .ch-pages > .m-page:not(.m-leave) .hs-p-style');
/** the hub page's editor */
const hubEd = (c) => { const u = uiOf(c); return { c, u, root, o: {}, refresh: (draft) => refreshPreview(c, u, draft), save: () => queueSave(c, u), turn: (k) => yawTo(u, k), peek: (o) => PV?.peek(o), unpeek: () => PV?.unpeek() }; };
/** the page's regions drawn again in place (slide: dir for the body and the presets) */
function redraw(E, keys, dir = 0) {
  const { c, u } = E, R = E.root(); if (!R) return;
  const T = document.createElement('template'); T.innerHTML = pageHTML(c, u, E.o);
  const act = document.activeElement, sel = act && R.contains(act) ? ['data-styset', 'data-styrst', 'data-stypre', 'data-stypg', 'data-stytab', 'data-styocc', 'data-sty', 'data-stywho'].map((a) => act.hasAttribute(a) ? `[${a}="${CSS.escape(act.getAttribute(a))}"]` : null).find(Boolean) : null;
  const rowKey = act && R.contains(act) ? act.closest('.sty-row')?.dataset.stykey : null;
  for (const k of keys) {
    const a = R.querySelector(`[data-region="${k}"]`), b = T.content.querySelector(`[data-region="${k}"]`);
    if (!a || !b) { if (!a && b) { /* (the page's shape changed: whole again) */ R.replaceChildren(...T.content.childNodes); return; } continue; }
    a.replaceWith(b);
    if (dir && !reduced() && (k === 'sty-body' || k === 'sty-pre')) { b.style.setProperty('--m-k', dir > 0 ? 'm-in-right' : 'm-in-left'); b.classList.add('m-swap'); setTimeout(() => b.classList.remove('m-swap'), 260); }
  }
  // (focus back where it was - or, that control now hidden (a ↺ once its row is her own again), on its row's own control)
  if (sel) {
    const ok = (el) => el && !el.disabled && !el.classList.contains('off') && getComputedStyle(el).visibility !== 'hidden';
    let el = R.querySelector(sel);
    if (!ok(el) && rowKey) el = [...R.querySelectorAll(`[data-stykey="${CSS.escape(rowKey)}"] input, [data-stykey="${CSS.escape(rowKey)}"] button`)].find(ok);
    el?.focus?.({ preventScroll: true });
  }
  airy(R);
}
/** the save, a moment after the last change (the whole career is one blob: not on every slider step) */
function queueSave(c, u) {
  clearTimeout(u.saveT); u.saving = true; savedChip({ u, root });
  u.saveT = setTimeout(() => { u.saveT = 0; try { c.save?.(); } catch (e) { console.warn('HubStyle: save failed', e); } u.saving = false; savedChip({ u, root }); }, 800);
}
function savedChip(E) { const { u } = E, R = E.root(), el = R?.querySelector('[data-stysaved]'); if (el && !E.o?.sheet) { el.textContent = u.saving ? 'Saving…' : 'Saved ✓'; el.classList.toggle('ing', u.saving); } else if (el) el.textContent = u.hist.length ? 'Kept when you leave' : ''; const ub = R?.querySelector('[data-styundo]'); if (ub) ub.disabled = !u.hist.length; }
/** her record as it is now, for UNDO */
const snap = (c, u) => { const r = St.styleRec(c, u.who); return r ? JSON.stringify(r) : null; };
function pushHist(c, u, s = snap(c, u)) { const L = u.hist; if (L.length && L[L.length - 1] === s) return; L.push(s); if (L.length > 20) L.shift(); }
const parseV = (v) => (v === '' ? null : v === 'true' ? true : v === 'false' ? false : /^-?\d+(\.\d+)?$/.test(v) ? +v : v);
/** a committed change: kept for UNDO, set, saved soon, the page and her updated */
function commit(E, path, value, regions = ['sty-body', 'sty-pre', 'sty-tabs', 'sty-foot']) {
  const { c, u } = E; pushHist(c, u);
  const r = St.setStyle(c, u.who, path, value, { baseHs: CELEB[u.who]?.look?.hs });
  if (!r.ok) { u.hist.pop(); return false; }
  E.save(); redraw(E, regions); savedChip(E); E.refresh(false);
  // (a new hairstyle seen from the side that shows it; a new cut full length)
  if (/\.hs$/.test(path) && value && u.tab === 'hair' && !u.drag && /pony|bun|knot/.test(String(value)) && u.yawK === 'front') E.turn?.('three');
  return true;
}
/**
 * The page's buttons (HubSocial.socialClick hands them on): who, occasion, tab, sub-page, presets, values, ↺, UNDO, ALL
 * HER OWN, and the ✦ that opens the page on her -> a hub result ({ tab, S }) to open the page, else null (done here)
 */
export function styleClick(c, d, S = {}) {
  if (!c) return null;
  if (d.styopen != null) { styleFor(c, d.styopen); return { tab: 'life', S: { sub: 'style' } }; }
  const E = hubEd(c), u = E.u; if (!u.who) return null;
  if (d.stywho != null) { if (d.stywho !== u.who && seeing(c).includes(d.stywho)) { u.who = d.stywho; u.hist = []; redraw(E, ['sty-strip', 'sty-tabs', 'sty-pre', 'sty-body', 'sty-foot']); refreshPreview(c, u); } return null; }
  if (d.styocc != null) { if (St.SLOTS.includes(d.styocc) && d.styocc !== u.occ) { const dir = Math.sign(St.SLOTS.indexOf(d.styocc) - St.SLOTS.indexOf(u.occ)); u.occ = d.styocc; occSync(E); redraw(E, ['sty-pre', 'sty-body', 'sty-foot'], dir); refreshPreview(c, u); } return null; }
  if (d.stytab != null) {
    if (SUBPG[d.stytab] && d.stytab !== u.tab) { u.zoom = null; handle(E, d); camTo(zoomNow(u)); if (u.tab === 'hair' && u.yawK === 'front') yawTo(u, 'three'); else if (u.tab !== 'hair' && u.yawK === 'three') yawTo(u, 'front'); barSync(u); refreshPreview(c, u); }
    return null;
  }
  handle(E, d);
  // (a sub-page of its own camera - the eyes, the lips, the face: the view goes with it unless you chose one)
  if (d.stypg != null && (!u.zoom || u.zoom === 'close') && MOUNT) { camTo(zoomNow(u)); barSync(u); }
  return null;
}
/** an editor's own buttons: tab, sub-page, presets, values, ↺, UNDO, ALL HER OWN -> true when it was one of them */
function handle(E, d) {
  const { c, u } = E;
  if (d.stytab != null) { if (SUBPG[d.stytab] && d.stytab !== u.tab) { const dir = Math.sign(TABS.findIndex(([t]) => t === d.stytab) - TABS.findIndex(([t]) => t === u.tab)); u.tab = d.stytab; redraw(E, ['sty-tabs', 'sty-pre', 'sty-body', 'sty-foot'], dir); } return true; }
  if (d.stycg != null) { if ((St.GROUPS?.[u.occ] || St.CLUB_GROUPS).some(([g]) => g === d.stycg)) { u.cg = d.stycg; redraw(E, ['sty-body']); } return true; }
  if (d.stypg != null) { const L = SUBPG[u.tab], i = L.findIndex(([p]) => p === d.stypg), j = L.findIndex(([p]) => p === u.pg[u.tab]); if (i >= 0 && i !== j) { u.pg[u.tab] = d.stypg; redraw(E, ['sty-tabs', 'sty-body', 'sty-foot'], Math.sign(i - j)); } return true; }
  if (d.styset != null) { const s = String(d.styset), k = s.indexOf('|'); if (k > 0) commit(E, s.slice(0, k), parseV(s.slice(k + 1))); return true; }
  if (d.styrst != null) { commit(E, String(d.styrst), null); return true; }
  if (d.stypre != null) { preset(E, String(d.stypre)); return true; }
  if (d.styundo != null) {
    const prev = u.hist.pop(); if (prev === undefined) return true;
    const s = c.celebs; if (!s.style) s.style = { v: St.STYLE_V, by: {} };
    if (prev == null) delete s.style.by[u.who]; else s.style.by[u.who] = JSON.parse(prev);
    St.styleEnsure(s, (id) => (CELEB[id] ? CELEB[id].look?.hs || 'long' : ''));
    E.save(); redraw(E, ['sty-tabs', 'sty-pre', 'sty-body', 'sty-foot']); savedChip(E); E.refresh(false); return true;
  }
  if (d.styall != null) {
    const b = E.root()?.querySelector('[data-styall]');
    if (b && !arm(b, 'SURE? ALL OF IT')) return true;
    pushHist(c, u); St.resetStyle(c, u.who, 'all'); E.save(); redraw(E, ['sty-strip', 'sty-tabs', 'sty-pre', 'sty-body', 'sty-foot']); E.refresh(false); return true;
  }
  return false;
}
function occSync(E) { const R = E.root(); const box = R?.querySelector('.sty-occ'); if (!box) return; const i = St.SLOTS.indexOf(E.u.occ); box.style.setProperty('--k', String(i)); [...box.children].forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-selected', String(j === i)); }); }
/** a starting point: the tab's fields set to it ("Her own": cleared) */
function preset(E, id) {
  const { c, u } = E, X = lookCtx(c, u.who, u.occ);
  pushHist(c, u);
  if (u.tab === 'face') {
    St.resetStyle(c, u.who, `face.${X.moment}`);
    const p = St.PRESETS.face.find((q) => q.id === id); if (p) St.setMany(c, u.who, `face.${X.moment}`, nudeDeep(X, p.mk));
  } else if (u.tab === 'hair') {
    for (const k of ['hs', 'tendrils', 'fringe']) St.setStyle(c, u.who, `occ.${u.occ}.${k}`, null);
    const p = St.PRESETS.hair.find((q) => q.id === id);
    if (p && St.hairFits(X.baseHs, p.hs)) { St.setStyle(c, u.who, `occ.${u.occ}.hs`, p.hs, { baseHs: X.baseHs }); if (p.tendrils != null) St.setStyle(c, u.who, `occ.${u.occ}.tendrils`, p.tendrils); if (p.metal) St.setStyle(c, u.who, `occ.${u.occ}.wear.metal`, p.metal); }
  } else {
    St.resetStyle(c, u.who, `occ.${u.occ}.wear`);
    const p = (St.PRESETS.wear[u.occ] || []).find((q) => q.id === id); if (p) St.setMany(c, u.who, `occ.${u.occ}.wear`, nudeDeep(X, p.w));
  }
  E.save(); redraw(E, ['sty-tabs', 'sty-pre', 'sty-body', 'sty-foot']); savedChip(E); E.refresh(false);
}
/** a slider or a colour picker moving (draft: the preview's quick paint) or let go (commit: kept, saved) */
function onInput(E, e, done) {
  const t = e.target; if (!t || t.dataset?.sty == null || !E.root()?.contains(t)) return;
  const { c, u } = E; if (!c || !u?.who) return;
  const path = t.dataset.sty, v = t.type === 'range' ? +t.value : t.value;
  // (the state before a drag, kept once for UNDO)
  if (!u.dragSnap) u.dragSnap = { path, s: snap(c, u) };
  St.setStyle(c, u.who, path, v, { baseHs: CELEB[u.who]?.look?.hs });
  if (t.type === 'range') {
    const a = +t.min, b = +t.max; t.style.setProperty('--p', pct(v, a, b)); t.classList.remove('own');
    const out = t.closest('.sty-row')?.querySelector('.sty-v'); if (out) { out.textContent = FMT[t.dataset.fmt]?.(v) ?? String(v); out.classList.remove('own'); }
    t.closest('.sty-row')?.querySelector('.sty-x')?.classList.remove('off');
  } else {
    const g = t.closest('.sty-sw'); if (g) { for (const b of g.querySelectorAll('button.sw')) { b.classList.remove('on', 'own'); b.setAttribute('aria-pressed', 'false'); } const L = t.closest('label'); L?.classList.remove('own'); L?.classList.add('on'); L?.style.setProperty('--v', v); }
    t.closest('.sty-row')?.querySelector('.sty-x')?.classList.remove('off');
  }
  E.refresh(!done && /^face\./.test(path));
  if (done) { pushHist(c, u, u.dragSnap.s); u.dragSnap = null; E.save(); if (t.type !== 'range') redraw(E, ['sty-pre']); savedChip(E); }
}
/** a swatch under the pointer: tried on her for a moment (colours only - nothing that needs a rebuild) */
function onPeek(E, e) {
  const b = e.target.closest?.('button[data-styset]'); if (!b || !E.u?.who || !E.root()?.contains(b)) return;
  const s = b.dataset.styset, k = s.indexOf('|'), path = s.slice(0, k);
  // (colours a material carries alone: never the hair's - its brows and baby hairs would be painted again under the pointer)
  if (!/^occ\.\w+\.wear\.(color|accent|shoes|metal|clutchMetal)$/.test(path)) return;
  const { c, u } = E, tmp = { season: c.season, round: c.round, celebs: { style: JSON.parse(JSON.stringify(c.celebs?.style || { v: 1, by: {} })) } };
  St.setStyle(tmp, u.who, path, parseV(s.slice(k + 1)));
  E.peek?.(previewOpts(lookCtx(c, u.who, u.occ, St.styleRec(tmp, u.who) || null), u));
}
// ---- the evening's own sheet: her look planned in the room (ui/Hangout.js - the rooftop, the restaurant) ------------------------
// (the same controls in a one-column sheet on the right; she is the preview - restyled in place, rebuilt where she stands;
// the edit is a draft of your career's style, handed back in the evening's result when it ends - the evening never writes
// to the career itself, so an evening that fails keeps nothing)
const SHEET_SLOT = { rooftop: 'evening', restaurant: 'dinner' };
const SHEET_CSS = () => `
#hangout .hg-style { position: absolute; right: 16px; top: 60px; bottom: 16px; width: 436px; max-width: calc(100vw - 32px); z-index: 7; pointer-events: auto; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 16px; background: rgba(246,247,250,.97); color: #151a22; box-shadow: 0 18px 50px rgba(0,0,0,.5); font: 13px/1.35 'Segoe UI', Roboto, Arial, sans-serif; overflow: hidden; animation: hgStyIn 220ms cubic-bezier(.2,.8,.2,1) both; }
#hangout .hg-style.out { animation: hgStyOut 160ms ease both; }
@keyframes hgStyIn { from { opacity: 0; transform: translate3d(28px, 0, 0); } }
@keyframes hgStyOut { to { opacity: 0; transform: translate3d(28px, 0, 0); } }
#hangout .hg-style button { position: relative; font: 700 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; color: #1d2430; background: #fff; border: 1px solid #d6dbe3; padding: 8px 10px; border-radius: 10px; cursor: pointer; transition: transform 80ms, background-color 120ms, border-color 120ms, color 120ms; }
#hangout .hg-style button:active:not(:disabled) { transform: scale(.97); }
#hangout .hg-style button:disabled { opacity: .45; cursor: default; }
#hangout .hg-style .hs-strip { display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 8px 0 12px; background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 12px; flex: none; white-space: nowrap; overflow: hidden; }
#hangout .hg-style .hs-eye { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
#hangout .hg-style .hs-eye small { font-size: 9.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #8a93a0; }
#hangout .hg-style .hs-eye b { font-size: 14px; font-weight: 800; }
#hangout .hg-style .hs-grow { flex: 1 1 auto; min-width: 0; }
#hangout .hg-style .hs-card { background: #fff; border: 1px solid rgba(21,26,34,.07); border-radius: 12px; box-shadow: 0 2px 10px rgba(25,35,60,.05); }
#hangout .hg-style button.hs-btn { padding: 7px 9px; font-size: 10.5px; border-radius: 9px; white-space: nowrap; }
#hangout .hg-style .k-seg > button { background: none; border: 0; box-shadow: none; padding: 0 6px; min-height: 28px; border-radius: 9px; color: #6b7482; font: 700 11px/1.1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; }
#hangout .hg-style .k-seg > button.on { color: #151a22; }
` + STYLE_BASE.replace(/#career /g, '#hangout .hg-style ') + `
#hangout .hg-style .sty-tabs { flex-wrap: wrap; height: auto; row-gap: 6px; }
#hangout .hg-style .sty-tabs .k-seg { width: 100%; }
#hangout .hg-style .sty-pre { grid-template-columns: repeat(3, minmax(0, 1fr)); height: auto; grid-auto-rows: 46px; }
#hangout .hg-style button.sty-pc { height: 46px; }
#hangout .hg-style .sty-body { overflow-y: auto; overscroll-behavior: contain; }
#hangout .hg-style .sty-grid { grid-template-columns: minmax(0, 1fr); }
#hangout .hg-style .sty-row, #hangout .hg-style .sty-row.w, #hangout .hg-style .sty-row.nv { grid-template-columns: 84px minmax(0, 1fr) 40px 22px; }
#hangout .hg-style .sty-row.w, #hangout .hg-style .sty-row.nv { grid-template-columns: 84px minmax(0, 1fr) 0 22px; }
#hangout .hg-style .sty-seg { flex-wrap: wrap; }
#hangout .hg-style .sty-tiles { grid-template-columns: repeat(4, minmax(0, 1fr)); }
#hangout .hg-style .sty-tiles.k button.sty-tile { height: 76px; } #hangout .hg-style button.sty-tile { height: 68px; } #hangout .hg-style button.sty-tile svg { width: 28px; height: 34px; }
#hangout .hg-style button.sty-tile b { white-space: normal; text-overflow: clip; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.1; }
#hangout .hg-style button.sty-tile small { display: none; }
#hangout .hg-style .sty-pgs button { padding: 5px 7px; font-size: 10.5px; }
#hangout .hg-style .sty-tabs button.hs-btn { padding: 6px 7px; font-size: 9.5px; }
#hangout .hg-style .sty-body > .sty-note { display: none; }
#hangout .hg-style .sty-foot span:last-child { color: #1f7a4a; font-weight: 700; }
`;
/** can her look be planned here tonight: the rooftop or the restaurant, someone you are seeing, never a quiet night */
export function sheetFor(c, vid, g) { return !!c && !!SHEET_SLOT[vid] && g?.kind === 'celeb' && !!g.id && !!CELEB[g.id] && !canStyle(c, g.id); }
// (the fields People's restyle changes in place: the preview's own list - what previewKey leaves out)
const CHEAP = previewCheap;
const getP = (o, path) => path.split('.').reduce((v, k) => (v == null ? undefined : v[k]), o);
/** the fields restyle changes in place that differ between two option sets -> a patch, or null */
const patchOf = (a, b, draft) => { let p = null; for (const [path, f] of CHEAP) { const x = JSON.stringify(getP(a, path) ?? null), y = JSON.stringify(getP(b, path) ?? null); if (x !== y) (p = p || {})[f] = getP(b, path) ?? null; } if (p && draft) p.draft = true; return p; };
const letGo = (p) => { if (!p) return; if (p.comp) p.comp.then(() => p.dispose()); else p.dispose(); };
/**
 * The sheet over an evening (ev: Hangout's Evening; g: her, a guest) -> { close() -> { id, rec } | null (unchanged),
 * destroy() } . The edit lives in a draft (the career's style copied; a second opening goes on with it).
 */
export function openStyleSheet(ev, g) {
  // (a club night on the roof: her club look - Hangout's ev.occ)
  // (a pool night on the roof, her in a cover-up over her swimwear (Hangout's g.lookX): her pool look)
  const c = ev.c, slot = SHEET_SLOT[ev.vid] && g?.lookX?.occasion === 'pool' ? 'pool' : SHEET_SLOT[ev.vid] && ev.occ === 'club' ? 'club' : SHEET_SLOT[ev.vid]; if (!c || !slot || !g?.person) return null;
  if (!document.getElementById('hg-style-css')) { const st = document.createElement('style'); st.id = 'hg-style-css'; st.textContent = SHEET_CSS(); document.head.appendChild(st); }
  const D = ev._styD || (ev._styD = { season: c.season, round: c.round, rounds: c.rounds, celebs: { bonds: c.celebs?.bonds || {}, partner: c.celebs?.partner || null, style: JSON.parse(JSON.stringify(c.celebs?.style || { v: St.STYLE_V, by: {} })) }, pr: c.pr || {}, lost: c.lost || [] });
  const orig = ev._styO ?? (ev._styO = JSON.stringify(St.styleRec(D, g.id) || null));
  const u = ev._styU || (ev._styU = { c: D, who: g.id, occ: slot, tab: 'face', pg: { face: 'eyes', hair: 'shape', wear: 'cut' }, hist: [], zoom: null, yaw: 0, yawK: 'front', saving: false });
  const el = document.createElement('div'); el.className = 'hg-style k-light'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', `${CELEB[g.id].name}'s look`);
  // (her, live: the options she was built with; each change in place where People can, else built again where she stands)
  const optsOf = () => { const X = g.lookX || {}, base = celebLook(g.C || CELEB[g.id], { pose: g.pose, detail: 0.75, occasion: slot, night: !!ev.night, track: ev.trackId, vary: ev.vary, water: X.water, cover: X.cover }); const rec = St.styleRec(D, g.id), ov = rec ? St.resolveRec(rec, { occ: slot, night: !!ev.night }) : null; return ov ? St.applyStyle(base, ov, { baseHs: CELEB[g.id].look?.hs }) : base; };
  // (drafty: her face is a slider's quick paint (256 px, no eye map) - painted in full once the slider is let go)
  let shown = g.opts || optsOf(), key = previewKey(shown), want = shown, timer = 0, busy = false, raf = 0, pend = null, dead = false, drafty = false, fin = 0;
  const rebuild = async () => {
    if (busy || dead || ev.closing || ev.disposed) return; busy = true;
    try {
      await new Promise((r) => { requestAnimationFrame(() => r()); setTimeout(r, 50); });
      const old = g.person, opts = want; if (!old || dead) return;
      const p = makePerson(opts); ev._lift?.(p); ev._hostLit?.(p.group);
      p.group.position.copy(old.group.position); p.group.quaternion.copy(old.group.quaternion);
      const R = ev.renderer; if (R?.compileAsync && ev.cam) { p.comp = R.compileAsync(p.group, ev.cam, ev.host ? ev.host.scene : ev.scene).catch(() => {}).finally(() => { p.comp = null; }); await Promise.race([p.comp, new Promise((r) => setTimeout(r, 400))]); }
      if (dead || ev.closing || ev.disposed || g.person !== old) { letGo(p); return; }
      ev.scene.add(p.group); ev.scene.remove(old.group); letGo(old);
      g.person = p; g.opts = opts; shown = opts; key = previewKey(opts); drafty = false;
    } catch (e) { console.warn('HubStyle: she could not be dressed again', e); } finally { busy = false; }
    if (!dead && want !== shown) apply(false);
  };
  const apply = (draft) => {
    if (dead) return; want = optsOf();
    if (busy) return;
    if (previewKey(want) !== key) { clearTimeout(timer); timer = setTimeout(rebuild, 240); return; }
    let p = patchOf(shown, want, draft);
    // (the slider let go: her face a quick draft - painted in full now, even when nothing else changed)
    if (!draft && drafty) { p = p || {}; if (p.makeup === undefined) p.makeup = getP(want, 'style.makeup') ?? null; }
    if (!p) { shown = want; return; }
    if (draft && p.makeup !== undefined) {
      pend = { p, o: want }; if (!raf) raf = requestAnimationFrame(() => { raf = 0; const q = pend; pend = null; if (q && !dead && g.person?.restyle?.(q.p)) { shown = q.o; drafty = true; } });
      // (and when it stops without a word - never while the pointer is still held - in full a moment later)
      const f = () => { if (dead || !drafty || busy) return; if (pointerHeld()) { fin = setTimeout(f, 320); return; } apply(false); };
      clearTimeout(fin); fin = setTimeout(f, 320); return;
    }
    if (raf) { cancelAnimationFrame(raf); raf = 0; pend = null; }
    clearTimeout(fin);
    // (her hair's colour where it has tones of its own: shown at once, exact once she is built again)
    if (g.person?.restyle?.(p)) { shown = want; g.opts = want; if (p.makeup !== undefined) drafty = false; } else { if (p.hair) tintHair(g.person, p.hair); clearTimeout(timer); timer = setTimeout(rebuild, 240); }
  };
  const E = { c: D, u, root: () => el, o: { sheet: true }, refresh: (draft) => apply(draft), save: () => {}, turn: null, peek: null, unpeek: null };
  el.innerHTML = pageHTML(D, u, E.o);
  ev.el.appendChild(el);
  const off = [], on = (t, n, f, o) => { t.addEventListener(n, f, o); off.push(() => t.removeEventListener(n, f, o)); };
  on(el, 'click', (e) => { const b = e.target.closest('button'); if (!b || b.disabled || !el.contains(b)) return; if (b.dataset.styclose != null) { H.close(); return; } handle(E, b.dataset); });
  on(el, 'input', (e) => onInput(E, e, false)); on(el, 'change', (e) => onInput(E, e, true));
  for (const n of ['mousedown', 'pointerdown', 'wheel']) on(el, n, (e) => e.stopPropagation());
  // (she is framed on the left of the view, the sheet on the right: the view turned toward her, over a moment)
  const gp = g.person.group.position, dx = gp.x - ev.pos.x, dz = gp.z - ev.pos.z, d = Math.hypot(dx, dz) || 1, y0 = ev.yaw, p0 = ev.pitch;
  let y1 = Math.atan2(dz, dx) + Math.atan(Math.min(1, 0.3 * (innerWidth > 900 ? 1 : 0.4))); const p1 = Math.max(-0.5, Math.min(0.3, Math.atan2(1.3 - ev.pos.y, d)));
  while (y1 - y0 > Math.PI) y1 -= 2 * Math.PI; while (y1 - y0 < -Math.PI) y1 += 2 * Math.PI;
  if (d < 6) { const t0 = performance.now(), ms = reduced() ? 1 : 320, step = () => { if (dead) return; const k = Math.min(1, (performance.now() - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; ev.yaw = y0 + (y1 - y0) * e; ev.pitch = p0 + (p1 - p0) * e; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
  if (want !== shown || previewKey(optsOf()) !== key) apply(false);
  const H = {
    /** closed: the draft kept on the evening; -> { id, rec } when her look changed, else null */
    close() {
      if (dead) return ev._styR || null;
      // (a quick paint still on her face: the full one before the sheet goes - she is seen close up all evening)
      if (drafty && !busy && previewKey(optsOf()) === key) { if (raf) { cancelAnimationFrame(raf); raf = 0; pend = null; } apply(false); }
      dead = true; clearTimeout(timer); clearTimeout(fin); if (raf) cancelAnimationFrame(raf);
      // (a change still waiting to be seen: shown now, before the sheet goes)
      if (!busy && previewKey(optsOf()) !== key) { dead = false; want = optsOf(); rebuild().finally(() => { dead = true; }); }
      for (const f of off) f();
      el.classList.add('out'); setTimeout(() => el.remove(), reduced() ? 0 : 170);
      // (the faces painted while trying looks given back - a few kept, for a second look)
      setTimeout(() => { try { faceCacheTrim(6); } catch (e) { /* (an older People: its own cap) */ } }, 600);
      const now = JSON.stringify(St.styleRec(D, g.id) || null);
      ev._styR = now !== orig ? { id: g.id, rec: St.styleRec(D, g.id) ? JSON.parse(now) : null } : null;
      return ev._styR;
    },
    /** gone with the evening: nothing more built (whatever is being built let go) */
    destroy() { dead = true; clearTimeout(timer); clearTimeout(fin); if (raf) cancelAnimationFrame(raf); for (const f of off) f(); el.remove(); },
  };
  return H;
}

/** test hooks (the console): the preview, the page's state */
export const __style = { preview: () => PV, ui: () => U, opts: (c, id, slot) => previewOpts(lookCtx(c, id, slot)), goal: (z) => goalOf(z) };
