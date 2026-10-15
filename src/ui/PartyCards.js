// The night after a race, over the career hub: TONIGHT - the invitations, offered when the round's report is closed (the
// team's own celebration in the paddock, a club night or a sponsor's after-party, or back to the hotel) - and THE MORNING
// AFTER - what the night did, in three tabs: the night itself (a photo and the timeline), the press, and the people (who
// you met, what it did to each of them, and the hangover). Layout, CSS and keys only: career/Party.js decides who is
// invited and what a night does (partyOffers, partyLaunch, partyResult), and ui/CareerHub.js opens these and routes the
// choices.
// Both fit 1366x768 with the browser's chrome (about 650 px of page) with nothing to scroll: two cards and a slim hotel
// tile; three tabs of fixed rows. Transform and opacity only, 260 ms at most (Motion.js), keyboard first; no backdrop
// blur. They mount on document.body above the hub (#career is z 40) as Motion's .k-layer sheets: TONIGHT dark (it is
// the night), the morning after in the hub's light theme.
//
// CONTRACT (what CareerHub passes in - see career/Party.js for the data itself):
//   showTonight({ c, offers, place?, handlers }) -> { el, close(), model }
//     offers: Party.partyOffers(c) - career/Party.js's Offer carries what a card shows (title, hostLine, place, start,
//       close, lastCall, dress, age, ok/why, hook, risk/spend/energy pips, cost, people, more, travel, contractual).
//     place(venueId) (optional) -> PartyVenues.PARTY_PLACES[venueId]: only fills what an offer leaves out.
//     handlers: { go(offerId, { transport }), sum(offerId, { transport }), hotel() } - each runs after the sheet closes.
//     c.party.race.lean ('team' | 'club' | 'hotel', optional: a winner's answer to the media pen's 'How will you celebrate
//       tonight?', ui/Interview.js via main.js) marks that card and opens the sheet on it.
//   showMorning({ c, last, handlers }) -> { el, close(), model }
//     last: a copy of c.party.last (career/Party.js PartyLast); handlers: { done(), media(), phone() }.
//   tonightModel(c, offers, place) / morningModel(c, last) -> the plain data each sheet draws (for tests).
import { open as mOpen, close as mClose, page as mPage, keys, arm } from './Motion.js';
import { BRAND_BY_ID, OUTLET_BY_ID } from '../career/PR.js';
import { CELEB, styledColor } from '../career/Celebs.js';
import { PartyCrowd } from '../world/PartyCrowd.js';

export const PARTY_CARDS_CSS = `
.pc-layer{z-index:46}.pc-layer *,.pc-layer *::before,.pc-layer *::after{box-sizing:border-box}
.pc-layer .k-sheet{--w:960px;height:min(520px,calc(100vh - 110px));max-height:none;font-family:var(--k-font);position:relative}
.pc-layer.pc-n .k-sheet{background:linear-gradient(180deg,#141726 0%,#0b0d15 62%);border-color:rgba(255,255,255,.08);color:#eef1f7}
.pc-layer.pc-n{background:rgba(4,5,10,.62)}
.pc-head{display:flex;align-items:flex-end;gap:12px;padding:16px 22px 10px}
.pc-head small{display:block;font:700 10.5px/1 var(--k-font);letter-spacing:.16em;text-transform:uppercase;color:var(--k-dim)}
.pc-head h2{margin:6px 0 0;font:800 24px/1.05 var(--k-font);letter-spacing:.01em}
.pc-grow{flex:1;min-width:0}
.pc-res{font:800 12px/1 var(--k-font);letter-spacing:.12em;padding:7px 10px;border-radius:8px;background:rgba(255,255,255,.08)}
.pc-res.w{background:#f4c542;color:#1a1300}.pc-res.p{background:#cfd6e2;color:#151a22}.pc-res.d{background:rgba(255,90,79,.18);color:#ff8a80}
.pc-body{min-height:0;padding:4px 22px 0;display:flex;gap:14px;align-items:stretch;justify-content:center}
.pc-card{position:relative;flex:0 1 300px;min-width:0;max-height:380px;display:flex;flex-direction:column;gap:8px;padding:0 0 12px;border-radius:14px;background:#161a27;
 border:1px solid rgba(255,255,255,.08);cursor:pointer;overflow:hidden;outline:none;transition:transform var(--m-fast) var(--ease-out),opacity var(--m-fast)}
.pc-card::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 2px var(--hc),0 14px 34px rgba(0,0,0,.45);opacity:0;transition:opacity var(--m-fast);pointer-events:none}
.pc-card:hover{transform:translateY(-2px)}.pc-card.on::after{opacity:1}.pc-card:focus-visible::after{opacity:1}
.pc-card.off{cursor:default}.pc-card.off>*:not(.pc-why){opacity:.42}.pc-card.off:hover{transform:none}.pc-card.off .pc-tile{filter:grayscale(.9)}
.pc-tile{position:relative;flex:none;height:96px;padding:12px 14px;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;
 background:linear-gradient(135deg,var(--hc) 0%,var(--hc2) 100%);color:#fff;overflow:hidden}
.pc-tile::before{content:attr(data-g);position:absolute;right:10px;top:2px;font:400 68px/1 'Segoe UI Symbol',var(--k-font);opacity:.22}
.pc-tile small{font:700 10px/1 var(--k-font);letter-spacing:.16em;text-transform:uppercase;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-tile b{font:800 17px/1.15 var(--k-font);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 1px 8px rgba(0,0,0,.25)}
.pc-kbd{position:absolute;left:10px;top:10px;font:800 10px/1 var(--k-font);padding:4px 6px;border-radius:5px;background:rgba(0,0,0,.35);color:#fff}
.pc-rib{position:absolute;right:0;top:12px;font:800 9.5px/1 var(--k-font);letter-spacing:.14em;padding:5px 8px 5px 10px;border-radius:6px 0 0 6px;background:#fff;color:#151a22}
.pc-said{position:absolute;left:34px;top:10px;font:800 9.5px/1 var(--k-font);letter-spacing:.12em;text-transform:uppercase;padding:4px 7px;border-radius:5px;background:rgba(0,0,0,.35);color:#fff;white-space:nowrap}
.pc-hotel .pc-said{position:static;background:rgba(143,163,199,.16);color:#c6d2ea}
.pc-when{padding:0 14px;font:600 12px/1.3 var(--k-font);color:#c9cfdb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-when b{color:#fff;font-weight:800;font-variant-numeric:tabular-nums}
.pc-chips{padding:0 14px;display:flex;gap:5px;flex-wrap:nowrap;overflow:hidden}
.pc-chip{flex:none;font:700 10px/1 var(--k-font);letter-spacing:.08em;text-transform:uppercase;padding:5px 7px;border-radius:6px;background:rgba(255,255,255,.07);color:#c9cfdb;white-space:nowrap}
.pc-chip.k{background:#fff;color:#151a22}.pc-chip.a{background:rgba(255,176,32,.16);color:#ffc25a}.pc-chip.r{background:rgba(255,90,79,.16);color:#ff8a80}
.pc-who{padding:0 14px;display:grid;gap:6px}
.pc-who>small,.pc-notes>small{font:700 9.5px/1 var(--k-font);letter-spacing:.14em;text-transform:uppercase;color:var(--k-dim)}
.pc-who>span{display:flex;align-items:center;gap:6px;min-height:34px}
.pc-notes{padding:0 14px;display:grid;gap:4px;font:500 11.5px/1.3 var(--k-font);color:#aab2c2}
.pc-notes>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pc-notes>span::before{content:"· ";color:var(--hc)}
.pc-av{position:relative;flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--a);color:var(--af);font:800 11.5px/1 var(--k-font);
 box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.18)}
.pc-av>i{position:absolute;right:-3px;bottom:-3px;width:16px;height:16px;border-radius:50%;display:grid;place-items:center;font:700 9.5px/1 'Segoe UI Symbol',var(--k-font);font-style:normal;
 background:#0b0d15;color:var(--gc,#fff);box-shadow:0 0 0 1.5px #0b0d15}
.pc-av.more{background:rgba(255,255,255,.08);color:#c9cfdb;box-shadow:none}
.pc-hook{padding:0 14px;font:500 12.5px/1.4 var(--k-font);color:#dfe3ec;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pc-meta{margin-top:auto;padding:0 14px;display:flex;align-items:center;gap:12px;font:600 11px/1 var(--k-font);color:var(--k-dim);white-space:nowrap}
.pc-meta>span{display:inline-flex;align-items:center;gap:5px}
.pc-pips{display:inline-flex;gap:3px}.pc-pips>i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.12)}.pc-pips>i.on{background:var(--pc,#ffb020)}
.pc-meta b{color:#eef1f7;font-weight:800}
.pc-tr{margin:0 14px;display:grid;grid-template-columns:1fr 1fr;gap:3px;padding:3px;border-radius:9px;background:rgba(255,255,255,.06)}
.pc-tr>button{min-width:0;height:30px;padding:0 6px;border:0;border-radius:7px;background:none;color:var(--k-dim);font:700 10.5px/1.1 var(--k-font);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color var(--m-fast)}
.pc-tr>button.on{background:#eef1f7;color:#0a0c14}
.pc-why{position:absolute;left:14px;right:14px;top:50%;transform:translateY(-50%);padding:10px 12px;border-radius:8px;background:rgba(10,12,20,.92);border:1px solid rgba(255,255,255,.12);font:700 12px/1.3 var(--k-font);color:#fff;text-align:center}
.pc-hotel{position:relative;flex:0 0 168px;max-height:380px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:8px;padding:16px;border-radius:14px;
 border:1px dashed rgba(255,255,255,.16);background:rgba(255,255,255,.03);cursor:pointer;outline:none;transition:transform var(--m-fast) var(--ease-out)}
.pc-hotel::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 2px #8fa3c7;opacity:0;transition:opacity var(--m-fast);pointer-events:none}
.pc-hotel:hover{transform:translateY(-2px)}.pc-hotel.on::after,.pc-hotel:focus-visible::after{opacity:1}
.pc-hotel .pc-moon{font:400 34px/1 'Segoe UI Symbol',var(--k-font);color:#c6d2ea}
.pc-hotel b{font:800 15px/1.2 var(--k-font)}.pc-hotel p{margin:0;font:500 12px/1.4 var(--k-font);color:#aab2c2}
.pc-hotel .pc-chip{background:rgba(51,209,122,.14);color:#6fe0a0}
.pc-foot{display:flex;align-items:center;gap:8px;padding:12px 22px 16px}
.pc-keys{font:600 11px/1 var(--k-font);color:var(--k-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-keys .k-kbd{margin:0 2px}
.pc-btn{position:relative;flex:none;height:38px;padding:0 16px;border-radius:10px;font:800 12px/1 var(--k-font);letter-spacing:.08em;cursor:pointer;background:rgba(255,255,255,.06);
 border:1px solid rgba(255,255,255,.12);color:#eef1f7;transition:transform var(--m-press) var(--ease-out),background-color var(--m-fast),border-color var(--m-fast),color var(--m-fast)}
.pc-btn:hover:not(:disabled){transform:translateY(-1px)}.pc-btn:active:not(:disabled){transform:scale(.97)}.pc-btn:disabled{opacity:.4;cursor:default}
.pc-btn.go{background:#e10600;border-color:#e10600;color:#fff}
.pc-layer.k-light .pc-btn{background:#fff;border-color:#d6dbe3;color:#1d2430}.pc-layer.k-light .pc-btn.go{background:var(--tc,#e10600);border-color:var(--tc,#e10600);color:#fff}
@media (min-height:700px){.pc-hook{-webkit-line-clamp:3}}
@media (max-height:600px){.pc-hook{-webkit-line-clamp:1}.pc-tile{height:84px}.pc-head{padding-top:12px}.pc-head h2{font-size:20px}}
@media (max-height:540px){.pc-hook{display:none}}

/* the morning after */
.pc-layer.k-light .k-sheet{background:#f9fafc;color:#151a22}
.pc-tl.nt>div:not(.pc-sum){grid-template-columns:12px minmax(0,1fr)}
.pc-tabs{display:flex;gap:3px;padding:3px;border-radius:11px;background:rgba(21,26,34,.06)}
.pc-tabs>button{position:relative;height:32px;padding:0 14px;border:0;border-radius:8px;background:none;color:#6b7482;font:800 11px/1 var(--k-font);letter-spacing:.12em;cursor:pointer;transition:color var(--m-fast)}
.pc-tabs>button.on{background:#fff;color:#151a22;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.pc-tabs>button em{font-style:normal;margin-left:6px;padding:2px 5px;border-radius:5px;background:#e10600;color:#fff;font-size:9.5px}
.pc-pgs{min-height:0;margin:0 22px;overflow:hidden}
.pc-pgs>.m-pg{display:grid;min-height:0;overflow:hidden}
.pc-night{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:16px;align-items:stretch}
.pc-photo{position:relative;min-height:0;border-radius:12px;overflow:hidden;background:linear-gradient(135deg,var(--hc,#33244d),#0d0f17);display:grid;place-items:center}
.pc-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.pc-photo figcaption{position:absolute;left:0;right:0;bottom:0;padding:22px 12px 10px;background:linear-gradient(transparent,rgba(0,0,0,.66));color:#fff;font:600 12px/1.35 var(--k-font)}
.pc-photo .pc-none{color:rgba(255,255,255,.72);font:600 13px/1.4 var(--k-font);text-align:center;padding:0 24px}
.pc-photo .pc-none i{display:block;font:400 40px/1.1 'Segoe UI Symbol',var(--k-font);font-style:normal;margin-bottom:6px;opacity:.6}
.pc-tl{display:flex;flex-direction:column;gap:2px;min-height:0}
.pc-tl>div:not(.pc-sum){display:grid;grid-template-columns:48px minmax(0,1fr);gap:10px;align-items:baseline;padding:7px 0;border-bottom:1px solid #e9ecf1;font:500 13px/1.35 var(--k-font)}
.pc-tl b{font:800 12px/1 var(--k-font);font-variant-numeric:tabular-nums;color:#6b7482}
.pc-tl span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pc-sum{display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;padding-top:8px}
.pc-layer.k-light .pc-chip{background:#eef1f5;color:#3a4250}.pc-layer.k-light .pc-chip.a{background:#fff3dc;color:#a76a00}.pc-layer.k-light .pc-chip.r{background:#ffe5e3;color:#c0262f}.pc-layer.k-light .pc-chip.g{background:#e2f6ea;color:#14804a}
.pc-press{grid-template-rows:repeat(3,minmax(0,auto)) minmax(0,1fr);gap:10px;align-content:start}
.pc-hl{display:grid;grid-template-columns:5px minmax(0,1fr);gap:12px;padding:12px 14px 12px 0;border-radius:12px;background:#fff;border:1px solid #e3e7ed}
.pc-hl>i{border-radius:0 4px 4px 0;background:var(--oc,#6b7482)}
.pc-hl small{display:block;font:800 10px/1 var(--k-font);letter-spacing:.14em;text-transform:uppercase;color:var(--oc,#6b7482)}
.pc-hl b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:5px 0 7px;font:800 15.5px/1.3 var(--k-font)}
.pc-hl .pc-chip{margin-right:4px}
.pc-cr{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;background:#fff1f0;border:1px solid #ffd2cd}
.pc-cr span{flex:1;min-width:0;font:600 13px/1.35 var(--k-font)}
.pc-empty{padding:28px 12px;text-align:center;color:#6b7482;font:500 13.5px/1.5 var(--k-font)}
.pc-ppl{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:16px;align-items:start}
.pc-rows{display:flex;flex-direction:column;gap:6px;min-height:0}
.pc-row{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:10px;align-items:center;padding:6px 10px 6px 6px;border-radius:10px;background:#fff;border:1px solid #e9ecf1}
.pc-row .pc-av{box-shadow:none}.pc-row .pc-av>i{background:#fff;box-shadow:0 0 0 1.5px #fff}
.pc-row b{display:block;font:800 13px/1.2 var(--k-font);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-row small{display:block;font:500 11.5px/1.25 var(--k-font);color:#6b7482;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-row .pc-ds{display:flex;gap:4px;justify-content:flex-end}
.pc-hang{padding:14px;border-radius:12px;background:#fff;border:1px solid #e3e7ed;display:flex;flex-direction:column;gap:8px}
.pc-hang>small{font:800 10px/1 var(--k-font);letter-spacing:.14em;text-transform:uppercase;color:#6b7482}
.pc-hang>b{font:800 18px/1.2 var(--k-font)}
.pc-hang .pc-meter{height:6px;border-radius:3px;background:#eef1f5;overflow:hidden}.pc-hang .pc-meter>i{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0));background:var(--c,#e39a1b)}
.pc-hang ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px}
.pc-hang li{font:500 12.5px/1.35 var(--k-font);display:flex;gap:8px}.pc-hang li i{flex:none;width:16px;font-style:normal;text-align:center;color:#6b7482}
.pc-hint{font:500 12px/1.4 var(--k-font);color:#6b7482;margin:0}
.pc-txt{font:600 12px/1.3 var(--k-font);color:#6b7482;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`;

// ---- small helpers ------------------------------------------------------------------------------------------------------
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const HEX = /^#[0-9a-f]{6}$/i;
const initials = (n) => { const p = String(n || '?').trim().split(/\s+/).filter(Boolean); return ((p[0]?.[0] || '?') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); };
const lum = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const shade = (h, k) => { if (!HEX.test(h || '')) return '#1a1d2b'; const n = parseInt(h.slice(1), 16), f = (v) => clamp(Math.round(v * k), 0, 255).toString(16).padStart(2, '0'); return `#${f((n >> 16) & 255)}${f((n >> 8) & 255)}${f(n & 255)}`; };
/** an hour of the night (23.5, 0.75 or 24.75) -> '23:30' / '00:45' */
export const hhmm = (h) => { if (h == null || !isFinite(+h)) return ''; const m = Math.round((((+h % 24) + 24) % 24) * 60); return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
// ($M -> '$100' / '$20K' / '$1.2M': under a thousand dollars in dollars, never '$0K')
const money = (m) => { const v = Math.abs(num(m)); if (!v) return '$0'; return v < 0.001 ? `$${Math.max(1, Math.round(v * 1e6))}` : v < 1 ? `$${Math.round(v * 1000)}K` : `$${(Math.round(v * 10) / 10).toFixed(1)}M`; };
const sgn = (v) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '±0');
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal' };
const GP = { lasvegas: 'Las Vegas GP', silverstone: 'British GP', montreal: 'Canadian GP' };
const CITY = { lasvegas: 'Las Vegas', silverstone: 'London', montreal: 'Montreal' };
// (each host brand's colours on the cards and the morning-after: invented brands, as career/PR.js BRANDS)
const BRAND_HUE = { ampwave: ['#1fd1c8', '#0b4b6e'], lanternfish: ['#3b6cff', '#1a1446'], lumora: ['#c48cff', '#2b1a4a'], vireo: ['#2bb673', '#0f3b2c'], solenne: ['#f0a73a', '#5a2a10'], arlette: ['#d9c3a1', '#2a2018'], velane: ['#b9a8d8', '#231c33'] };
// (who someone is to you, as a small badge on their disc)
const ROLE = {
  partner: ['♥', '#ff6b8a', 'Your partner'], mate: ['⇄', '#7fc4ff', 'Team-mate'], rival: ['⚔', '#ff8a5c', 'Rival'], exmate: ['↺', '#9fb4d6', 'Ex-team-mate'], ex: ['♡', '#c9a2ff', 'Your ex'],
  friend: ['☺', '#6fe0a0', 'Friend'], celeb: ['★', '#f4c542', 'Star'], star: ['★', '#f4c542', 'Star'], rep: ['$', '#6fe0a0', 'Sponsor'], sponsor: ['$', '#6fe0a0', 'Sponsor'], agent: ['§', '#ffc25a', 'Agent'],
  eng: ['⚙', '#c9cfdb', 'Race engineer'], press: ['✎', '#c9cfdb', 'Press'], infl: ['◉', '#ff7ad9', 'Influencer'], dj: ['♫', '#b98cff', 'DJ'], boss: ['▲', '#c9cfdb', 'Team principal'], present: ['·', '#c9cfdb', 'Driver'], driver: ['·', '#c9cfdb', 'Driver'],
};
const roleOf = (g) => ROLE[g?.role] || ROLE[g?.kind === 'celeb' ? 'celeb' : g?.kind === 'person' ? 'press' : 'driver'];
const disc = (g, cls = '') => {
  const c0 = HEX.test(String(g?.color || '')) ? g.color : '#5a6272', fg = lum(c0) > 0.55 ? '#151a22' : '#fff', R = roleOf(g);
  return `<span class="pc-av${cls ? ` ${cls}` : ''}" style="--a:${c0};--af:${fg}" title="${esc(`${g?.name || ''}${R ? ` · ${R[2]}` : ''}`)}">${esc(initials(g?.name))}${R && R[0] !== '·' ? `<i style="--gc:${R[1]}">${R[0]}</i>` : ''}</span>`;
};
const pips = (n, of, col) => `<span class="pc-pips" style="--pc:${col}">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
const nameList = (L) => (L.length <= 1 ? L.join('') : `${L.slice(0, -1).join(', ')} and ${L[L.length - 1]}`);
const ensureCSS = () => { if (typeof document === 'undefined' || document.getElementById('party-cards-css')) return; const st = document.createElement('style'); st.id = 'party-cards-css'; st.textContent = PARTY_CARDS_CSS; document.head.appendChild(st); };

// ---- TONIGHT ------------------------------------------------------------------------------------------------------------------
/**
 * The cards' data from the offers -> { kicker, title, res: { t, k }, cards: [{ id, team, color, color2, glyph, host, title,
 * when, chips: [{ t, k }], people (6 at most), more, hook, risk 0-4, spend 0-3, energy, locked (a reason) | null,
 * transport: null | 'car' }], hotel: { energy, line } }
 */
export function tonightModel(c, offers = [], place = () => null) {
  const R = c?.party?.race || {}, tid = R.track || c?.report?.track || null, team = c?.team || {}, pos = num(R.pos, num(c?.report?.pos, 0));
  const won = !!(R.won || pos === 1), podium = !!(R.podium || (pos >= 1 && pos <= 3)), dnf = !!(R.dnf || c?.report?.dnf);
  const gp = GP[tid] || `${TRACK[tid] || 'race'}`;
  // (what a winner told the media pen about tonight - 'team' | 'club' | 'hotel', main.js keeps it on the race's snapshot:
  //  that card is marked, and the sheet opens on it)
  const lean = ['team', 'club', 'hotel'].includes(R.lean) ? R.lean : null;
  // (a club still open after the team's party: the night can be both - the team card says so)
  const clubAfter = (Array.isArray(offers) ? offers : []).find((o) => o && o.venue !== 'teamparty' && o.host !== 'team' && o.ok !== false && (!o.status || ['open', 'offered'].includes(o.status)));
  const cards = (Array.isArray(offers) ? offers : []).filter(Boolean).slice(0, 2).map((o) => {
    // (career/Party.js's offer carries what the card shows - title, hostLine, place, start/close, dress, age, ok/why, hook,
    //  risk/spend/energy pips, people, more, travel; the venue's own data and the race only fill what an offer leaves out)
    const P = (typeof place === 'function' ? place(o.venue) : null) || {}, isTeam = (o.host || P.host) === 'team' || o.venue === 'teamparty';
    const B = o.brand ? BRAND_BY_ID[o.brand] || { brand: o.brandName || String(o.brand) } : null, hue = B ? BRAND_HUE[o.brand] : null;
    const color = HEX.test(o.color || '') ? o.color : isTeam ? (HEX.test(team.color || '') ? team.color : '#e10600') : hue ? hue[0] : HEX.test(P.hc || '') ? P.hc : '#7b5cff';
    const color2 = hue && !isTeam ? hue[1] : shade(color, isTeam ? 0.32 : 0.3);
    const keep = (g) => g && g.name && !['dj', 'bartender', 'staff', 'security', 'antagonist'].includes(g.role);
    const all = Array.isArray(o.people) ? o.people.filter(keep) : [...(o.guests || []), ...(o.present || [])].filter(keep);
    const stars = all.filter((g) => g.kind === 'celeb').map((g) => g.name);
    const start = o.start ?? P.start, close = o.close ?? P.close ?? null, age = o.age ?? P.age;
    const host = o.hostLine || (isTeam ? `${team.name || 'Your team'} · after the debrief` : B ? `${B.brand} presents` : P.kind || 'Club night');
    const title = o.title || (isTeam ? (dnf ? 'Drinks to forget' : won ? 'The winners’ party' : 'Team celebration') : B ? `The ${gp} after-party` : P.name || 'A club night');
    const where = o.place || (isTeam ? 'Team hospitality, the paddock' : [P.name, P.city].filter(Boolean).join(', '));
    const chips = [{ t: o.dress === 'Club' ? 'Club wear' : o.dress || (isTeam ? 'Team kit' : 'Club wear'), k: '' }];
    if (age && !isTeam) chips.push({ t: `${age}+`, k: 'a' });
    if (o.contractual) chips.push({ t: 'Contractual', k: 'k' }); else if (B) chips.push({ t: 'Sponsor night', k: '' });
    if (isTeam && podium && !dnf) chips.push({ t: 'Trophy', k: '' });
    let hook = o.hook || '';
    if (!hook) {
      const lead = [];
      if (stars.length && !isTeam) lead.push(`${nameList(stars.slice(0, 2))} on the list.`);
      if (isTeam) lead.push(dnf ? 'The boss says a few words.' : podium ? 'The trophy is on the table; the mechanics join after the pack-down.' : 'A drink with the crew once the debrief is done.');
      else if (o.contractual && B) lead.push(`${B.brand} wants five minutes. It is in your contract.`);
      else if (B) lead.push(`${B.brand} is hosting, and their people want to meet you.`);
      else if (CITY[tid] === 'London' || /london/i.test(P.city || '')) lead.push('Stickers over phone cameras at the door: nothing gets out unless someone leaks it.');
      else lead.push('No last call in Nevada: the lights go up at 05:00.');
      hook = lead.join(' ');
    }
    const priv = clamp(num(P.privacy, isTeam ? 0.65 : 0.25), 0, 1);
    const risk = clamp(Math.round(num(o.risk, (1 - priv) * 3)), 0, 3), spend = clamp(Math.round(num(o.spend, isTeam ? 0 : o.contractual ? 1 : 2)), 0, 3), energy = clamp(Math.round(num(o.energy, isTeam ? 1 : 2)), 0, 3);
    const locked = o.ok === false || (o.status && !['open', 'offered'].includes(o.status)) ? o.why || (age === 21 ? '21+ in Nevada' : `${age || 18}+ only`) : null;
    // (the small print: what the night counts as, when it ends, what it costs)
    const notes = [];
    if (o.contractual) notes.push('Counts as this week’s sponsor day');
    if (!isTeam && o.lastCall != null) notes.push(`Last orders ${hhmm(o.lastCall)}${close != null ? `, doors close ${hhmm(close)}` : ''}`);
    else if (!isTeam && close != null) notes.push(`No last call: the lights go up at ${hhmm(close)}`);
    if (isTeam) notes.push(clubAfter ? (clubAfter.travel ? 'Then on to the club if you like, by car or helicopter' : 'Then on to the club, if you like') : 'The team car takes you back to the hotel');
    if (num(o.cost) > 0) notes.push(`Expected spend about ${money(o.cost)}`);
    const tv = o.travel && typeof o.travel === 'object' ? o.travel : null;
    const transport = tv ? { car: `Car · ${tv.car || '1 h 45'}`, heli: `Heli · ${num(tv.heli?.min, 25)} min · ${money(num(tv.heli?.cost, 0.004))}` } : null;
    return { id: o.id, team: isTeam, color, color2, glyph: isTeam ? (podium && !dnf ? '♛' : '⚑') : '♫', host, title, when: `${hhmm(start)}${close != null ? ` – ${hhmm(close)}` : ''}`, where, chips, people: all.slice(0, 6), more: Math.max(0, all.length - 6) + (Array.isArray(o.people) ? num(o.more) : 0), hook, notes: notes.slice(0, 3), risk, spend, energy, locked, transport, said: !locked && lean === (isTeam ? 'team' : 'club') };
  });
  const res = dnf ? { t: 'DNF', k: 'd' } : won ? { t: 'WIN', k: 'w' } : pos ? { t: `P${pos}`, k: podium ? 'p' : '' } : null;
  return { kicker: [R.round ? `Round ${R.round}` : '', R.gp || TRACK[tid] || '', 'after the race'].filter(Boolean).join(' · '), title: 'Tonight', res, cards, lean, hotel: { energy: 10, said: lean === 'hotel', line: dnf ? 'Room service and the replay. Tomorrow is another day.' : 'An early night: if anyone asks, the next race starts now.' } };
}
const cardHTML = (m, i) => `<div class="pc-card${m.locked ? ' off' : ''}" role="button" tabindex="${m.locked ? -1 : 0}" data-pc="${i}" style="--hc:${m.color};--hc2:${m.color2}"${m.locked ? ' aria-disabled="true"' : ''}>
    <div class="pc-tile" data-g="${m.glyph}"><span class="pc-kbd">${i + 1}</span>${m.said ? '<span class="pc-said">As you told the press</span>' : ''}${m.chips.some((x) => x.k === 'k') ? '<span class="pc-rib">CONTRACTUAL</span>' : ''}<small>${esc(m.host)}</small><b>${esc(m.title)}</b></div>
    <div class="pc-when"><b>${esc(m.when)}</b>${m.where ? ` · ${esc(m.where)}` : ''}</div>
    <div class="pc-chips">${m.chips.map((x) => `<span class="pc-chip${x.k ? ` ${x.k}` : ''}">${esc(x.t)}</span>`).join('')}</div>
    <div class="pc-who"><small>Who’s going</small><span>${m.people.map((g) => disc(g)).join('')}${m.more ? `<span class="pc-av more">+${m.more}</span>` : ''}${!m.people.length ? '<span class="pc-txt">The team and its guests</span>' : ''}</span></div>
    <div class="pc-hook">${esc(m.hook)}</div>
    ${m.notes.length ? `<div class="pc-notes">${m.notes.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
    ${m.transport ? `<div class="pc-tr" data-pctr="${i}"><button class="on" data-tr="car" title="A car into London">${esc(m.transport.car)}</button><button data-tr="heli" title="From the circuit's helipad to Battersea">${esc(m.transport.heli)}</button></div>` : ''}
    <div class="pc-meta"><span title="How likely the photographers are">Cameras ${pips(m.risk, 3, '#ffb020')}</span><span title="What it costs you">Spend ${pips(m.spend, 3, '#6fe0a0')}</span><span title="What it takes out of the week">Energy ${pips(m.energy, 3, '#ff8a80')}</span></div>
    ${m.locked ? `<div class="pc-why">${esc(m.locked)}</div>` : ''}</div>`;
/**
 * TONIGHT over the hub. o = { c, offers, place, handlers: { go(id, opts), sum(id, opts), hotel() } } -> { el, close() }.
 * 1 / 2 pick a card, G go, S sum it up, H back to the hotel (Esc asks first), T the London transport; nothing is chosen
 * until a button says so, and the sheet closes before the handler runs.
 */
export function showTonight(o = {}) {
  ensureCSS();
  const M = tonightModel(o.c, o.offers, o.place), h = o.handlers || {};
  document.getElementById('party-tonight')?.remove();
  const el = document.createElement('div'); el.id = 'party-tonight'; el.className = 'k-layer pc-layer pc-n'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Tonight');
  el.innerHTML = `<div class="k-sheet"><header class="pc-head"><div><small>${esc(M.kicker)}</small><h2>${esc(M.title)}</h2></div><span class="pc-grow"></span>${M.res ? `<span class="pc-res ${M.res.k}">${esc(M.res.t)}</span>` : ''}</header>
    <div class="pc-body">${M.cards.map(cardHTML).join('')}<div class="pc-hotel" role="button" tabindex="0" data-pch="1"><span class="pc-moon">☾</span><b>Back to the hotel</b><p>${esc(M.hotel.line)}</p>${M.hotel.said ? '<span class="pc-said">As you told the press</span>' : ''}<span class="pc-chip">Energy +${M.hotel.energy}</span><span class="pc-kbd" style="position:static;background:rgba(255,255,255,.08)">H</span></div></div>
    <footer class="pc-foot"><span class="pc-keys">${M.cards.length > 1 ? '<span class="k-kbd">1</span><span class="k-kbd">2</span> choose · ' : ''}<span class="k-kbd">G</span> go · <span class="k-kbd">S</span> sum it up · <span class="k-kbd">H</span> hotel${M.cards.some((x) => x.transport) ? ' · <span class="k-kbd">T</span> car/heli' : ''}</span><span class="pc-grow"></span>
      <button class="pc-btn" data-pca="hotel">CALL IT A NIGHT</button><button class="pc-btn" data-pca="sum">SUM IT UP</button><button class="pc-btn go" data-pca="go">GO →</button></footer></div>`;
  document.body.appendChild(el);
  // (the sheet opens on the card the media pen heard about, else on the first open one)
  const said = M.cards.findIndex((x) => x.said);
  const st = { sel: M.hotel.said ? -2 : said >= 0 ? said : M.cards.findIndex((x) => !x.locked), tr: {}, shut: false };
  const cardsEl = [...el.querySelectorAll('.pc-card')], hotelEl = el.querySelector('.pc-hotel');
  const paint = () => {
    cardsEl.forEach((x, i) => x.classList.toggle('on', i === st.sel)); hotelEl.classList.toggle('on', st.sel === -2);
    const ok = st.sel >= 0 && !M.cards[st.sel]?.locked;
    for (const k of ['go', 'sum']) { const b = el.querySelector(`[data-pca="${k}"]`); if (b) b.disabled = !ok; }
  };
  const pick = (i) => { if (i === -2 || (M.cards[i] && !M.cards[i].locked)) { st.sel = i; paint(); } };
  const opts = () => { const m = M.cards[st.sel]; return { transport: m?.transport ? st.tr[st.sel] || 'car' : null }; };
  let unkeys = null;
  // (closing: its id goes at once, so the sheet that follows - the morning after a SUM IT UP - may open while this one fades)
  const close = (then) => { if (st.shut) return; st.shut = true; unkeys?.(); el.removeAttribute('id'); mClose(el, () => { el.remove(); }); try { then?.(); } catch (e) { console.error('PartyCards: the choice failed', e); } };
  const go = (k) => {
    if (k === 'hotel') { close(() => h.hotel?.()); return; }
    const m = M.cards[st.sel]; if (!m || m.locked) return;
    const id = m.id, op = opts();
    close(() => (k === 'go' ? h.go?.(id, op) : h.sum?.(id, op)));
  };
  el.addEventListener('click', (e) => {
    const t = e.target.closest('button, .pc-card, .pc-hotel'); if (!t || st.shut) return;
    if (t.dataset.tr) { const box = t.parentElement, i = +box.dataset.pctr; st.tr[i] = t.dataset.tr; box.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === t)); pick(i); return; }
    if (t.dataset.pca) { if (!t.disabled) go(t.dataset.pca); return; }
    if (t.dataset.pch) { if (st.sel === -2) go('hotel'); else pick(-2); return; }
    // (a card: the first click picks it, a second - or a double click - goes)
    if (t.dataset.pc != null) { const i = +t.dataset.pc; if (st.sel === i && e.detail >= 2) go('go'); else pick(i); }
  });
  const toggleTr = () => { const m = M.cards[st.sel]; if (!m?.transport) return 'pass'; const box = el.querySelector(`[data-pctr="${st.sel}"]`), b = box?.querySelector(`[data-tr="${(st.tr[st.sel] || 'car') === 'car' ? 'heli' : 'car'}"]`); b?.click(); return undefined; };
  const step = (d) => { const L = [...M.cards.map((m, i) => (m.locked ? null : i)).filter((i) => i != null), -2]; const j = L.indexOf(st.sel); pick(L[(j + d + L.length) % L.length]); };
  unkeys = keys(el, {
    1: () => pick(0), 2: () => pick(1), g: () => go('go'), s: () => go('sum'), h: () => go('hotel'), t: toggleTr,
    Enter: () => { if (st.sel === -2) go('hotel'); else go('go'); }, ArrowLeft: () => step(-1), ArrowRight: () => step(1),
    Escape: () => { const b = el.querySelector('[data-pca="hotel"]'); if (arm(b, 'ESC AGAIN: THE HOTEL')) go('hotel'); },
  });
  paint(); mOpen(el, 'fade', { now: true });
  // (while the sheet sits still: the crowds tonight's cards would need - the team's and the club's, so act 2 is ready
  // too - baked one template per idle slice, the next party's cover then skips them; each slice is 0.1-0.4 s, so it
  // starts once the sheet has faded in and stops the moment it closes)
  try {
    const night = (o.c?.party?.race?.track || '') !== 'silverstone', kinds = [...new Set(M.cards.filter((m) => !m.locked).map((m) => (m.team ? 'team' : 'club')))];
    const bakes = kinds.map((k) => PartyCrowd.prewarm(k, { night: k === 'team' ? night : true }));
    const idle = (f) => (typeof requestIdleCallback === 'function' ? requestIdleCallback(f, { timeout: 1200 }) : setTimeout(f, 120));
    const slice = () => { if (st.shut || !bakes.length) return; let more = false; try { more = bakes[0](); } catch (_) { more = false; } if (!more) bakes.shift(); if (bakes.length) idle(slice); };
    setTimeout(() => idle(slice), 700);
  } catch (e) { console.warn('PartyCards: no crowd prewarm', e); }
  return { el, close: () => close(), model: M };
}

// ---- THE MORNING AFTER ------------------------------------------------------------------------------------------------------
const EXIT = { hotel: 'Back to the hotel', side: 'Out of the side door', front: 'Out of the front door', breakfast: 'Breakfast with friends', carried: 'Put in a car', ejected: 'Shown the door', moveon: 'On to the club' };
const TIER = (L) => (L >= 8.5 ? 'Drunk' : L >= 5.5 ? 'Tipsy' : L >= 3 ? 'Merry' : 'Sober');
/** the morning-after sheet's data from c.party.last (career/Party.js), tolerant of what a summary leaves out -> plain data */
export function morningModel(c, last = {}) {
  const L = last || {}, tid = L.track || c?.party?.race?.track || null, B = L.brand ? BRAND_BY_ID[L.brand] : null, hue = B ? BRAND_HUE[L.brand] : null;
  const venue = L.place || L.title || (L.venue === 'teamparty' ? 'Team hospitality' : 'The night');
  const ex = String(L.exit || ''), exit = ex.startsWith('together') ? 'Left together' : EXIT[ex] || '';
  // (PartyLast.timeline: [text], 6 at most - a line may lead with its time, '00:52 ...')
  const tl = (Array.isArray(L.timeline) ? L.timeline : []).map((x) => {
    if (typeof x === 'string') { const m = /^(\d{1,2}:\d{2})\s*[·:-]?\s*(.*)$/.exec(x); return m ? { t: m[1], text: m[2] } : { t: '', text: x }; }
    return x && x.text ? { t: typeof x.at === 'number' ? hhmm(x.at) : x.t || '', text: x.text } : null;
  }).filter(Boolean).slice(0, 6);
  // (PartyLast.press: [{ outlet, name, text, tone }], 3 at most)
  const press = (Array.isArray(L.press) ? L.press : []).map((s) => (typeof s === 'string' ? { text: s } : s)).filter((s) => s && s.text).slice(0, 3)
    .map((s) => { const O = OUTLET_BY_ID[s.outlet] || null, t = num(s.tone); return { text: s.text, outlet: s.name || O?.name || s.outlet || '', color: O?.color || '#6b7482', chips: t ? [{ t: t > 0 ? 'Good for your image' : 'Bad for your image', k: t > 0 ? 'g' : 'r' }] : [] }; });
  // (PartyLast.crisis: the kind raised, or null; the story itself waits in c.pr.crisis until it is answered in MEDIA)
  const PK = c?.pr?.crisis || null, open = !!(L.crisis && PK);
  const K = L.crisis ? { title: (open && PK.title) || (L.crisis === 'brawl' ? 'Bouncers step in' : L.crisis === 'nightout' ? 'The night out' : String(L.crisis)) } : null;
  // (PartyLast.people: [{ cid, name, role, delta: [{ k, v, text }] }], 6 at most)
  const DK = { friendship: 'Friend', rapport: 'Rapport', affection: 'Affection', appeal: 'Appeal', offer: 'Offer', snub: 'Snubbed', agent: 'Agent' };
  const ppl = (Array.isArray(L.people) ? L.people : []).filter((p) => p && (p.name || p.cid)).slice(0, 6).map((p) => {
    const cid = String(p.cid || ''), chips = (Array.isArray(p.delta) ? p.delta : []).filter(Boolean).slice(0, 3).map((d) => {
      const v = Math.round(num(d.v)), lbl = DK[d.k] || d.k || '';
      if (d.k === 'offer') return { t: d.text && d.text.length <= 22 ? d.text : 'Sponsor offer', k: 'g' };
      if (d.k === 'snub') return { t: 'Snubbed', k: 'r' };
      if (d.k === 'agent') return { t: d.text && d.text.length <= 22 ? d.text : 'Agent onside', k: 'g' };
      return { t: v ? `${lbl} ${sgn(v)}` : d.text || lbl, k: v > 0 ? 'g' : v < 0 ? 'r' : '' };
    });
    const why = (p.delta || []).find((d) => d && d.text && d.text.length > 22)?.text || ROLE[p.role]?.[2] || '';
    // (the disc's colour: hers - the look you planned for her, as the hub and the phone show it -, his team's, the brand's)
    const sc = (id2) => { try { return c ? styledColor(c, id2) : null; } catch (e) { return null; } };
    const id = cid.slice(2), color = p.color || (cid.startsWith('c:') ? sc(id) || CELEB[id]?.look?.outfit : cid.startsWith('d:') ? c?.teams?.[c?.drivers?.[id]?.team]?.color : cid.startsWith('p:rep:') ? BRAND_HUE[cid.slice(6)]?.[0] : null);
    return { name: p.name || cid, role: p.role || null, kind: cid.startsWith('c:') ? 'celeb' : cid.startsWith('p:') ? 'person' : 'driver', color, why, chips };
  });
  // (PartyLast.hangover: { H, energy, slot ('recovery' | 'iv' | null), rough, text })
  const H = L.hangover && typeof L.hangover === 'object' ? L.hangover : { H: num(L.hangover) };
  const hv = clamp(num(H.H), 0, 1), hang = [];
  const en = Math.round(num(H.energy, hv > 0.15 ? -(8 + 30 * hv) : 0));
  if (en) hang.push({ i: '☾', t: `Energy ${sgn(en < 0 ? en : -en)} this week` });
  if (H.slot === 'iv') hang.push({ i: '✚', t: 'Slot 1: the IV-hydration clinic on the Strip (energy +12, it costs)' });
  else if (H.slot === 'recovery') hang.push({ i: '▭', t: 'Slot 1 is recovery: locked, energy +10, nothing gained' });
  if (H.rough) hang.push({ i: '!', t: 'A rough morning: a sponsor or media day in the first two slots goes badly' });
  if (H.text && !(en && /energy/i.test(H.text))) hang.push({ i: '·', t: String(H.text) });
  if (!hang.length) hang.push({ i: '✓', t: 'Fresh enough. Nothing lost from the week.' });
  const peak = num(L.peak), M0 = L.money && typeof L.money === 'object' ? L.money : {};
  const sum = [{ t: exit, k: ex === 'carried' || ex === 'ejected' ? 'r' : '' }, { t: peak >= 0.5 ? `Peak: ${TIER(peak).toLowerCase()}` : 'Soft drinks, mostly', k: peak >= 8.5 ? 'r' : peak >= 5.5 ? 'a' : '' }, { t: M0.spend ? (M0.spend < 0 ? `Up ${money(M0.spend)} on the night` : `Spent ${money(M0.spend)}`) : null, k: M0.spend < 0 ? 'g' : '' }, { t: M0.comped ? 'The table was comped' : null, k: 'g' }].filter((x) => x.t);
  // (PartyLast.texts: [{ cid, name, text }])
  const tx = Array.isArray(L.texts) ? L.texts : [], nt = tx.length;
  return { kicker: `The morning after · ${L.city || CITY[tid] || TRACK[tid] || ''}`.replace(/ · $/, ''), title: venue, color: hue ? hue[0] : L.venue === 'teamparty' ? c?.team?.color || '#e10600' : '#7b5cff', photo: typeof L.photo === 'string' && /^data:image\/|^https?:|^blob:/.test(L.photo) ? L.photo : null, caption: L.gp ? `After the ${L.gp}` : '',
    london: L.venue === 'londonclub', snapped: !!(L.photographed || L.posed || /photographer|flashes|step-and-repeat/i.test(JSON.stringify(tl || []))), timeline: tl, sum, press, crisis: K ? { title: K.title, open } : null, people: ppl, hang, hv, texts: nt, textFrom: [...new Set(tx.map((t) => (typeof t === 'string' ? '' : t?.name || '')).filter(Boolean))].slice(0, 3) };
}
/**
 * THE MORNING AFTER over the hub. o = { c, last, handlers: { done(), media(), phone() } } -> { el, close() }. Q / E or the
 * arrows (and 1-3) change tab; Enter goes on a tab, then closes on the last; Esc closes; P the phone.
 */
export function showMorning(o = {}) {
  ensureCSS();
  const M = morningModel(o.c, o.last), h = o.handlers || {};
  document.getElementById('party-morning')?.remove();
  const el = document.createElement('div'); el.id = 'party-morning'; el.className = 'k-layer k-light pc-layer'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'The morning after');
  const photo = M.photo ? `<img src="${esc(M.photo)}" alt="">${M.caption ? `<figcaption>${esc(M.caption)}</figcaption>` : ''}`
    : `<div class="pc-none"><i>${M.london ? '◍' : '◫'}</i>${M.snapped ? 'The agency pictures from last night are already on Chequered’s site.' : M.london ? 'Stickers over the phone cameras: no photos from inside.' : 'No photo of you from last night. Probably for the best.'}</div>`;
  const night = `<section class="m-pg on pc-night" data-t="night"><figure class="pc-photo" style="--hc:${esc(shade(M.color, 0.55))};margin:0">${photo}</figure>
    <div class="pc-tl${M.timeline.some((x) => x.t) ? '' : ' nt'}">${M.timeline.map((x) => `<div><b>${esc(x.t || '·')}</b><span>${esc(x.text)}</span></div>`).join('') || '<div><b>·</b><span>A quiet one, as nights go.</span></div>'}<div class="pc-sum">${M.sum.map((x) => `<span class="pc-chip${x.k ? ` ${x.k}` : ''}">${esc(x.t)}</span>`).join('')}</div></div></section>`;
  const press = `<section class="m-pg pc-press" data-t="press">${M.press.map((s) => `<div class="pc-hl" style="--oc:${esc(s.color)}"><i></i><div><small>${esc(s.outlet)}</small><b>${esc(s.text)}</b>${s.chips.map((x) => `<span class="pc-chip ${x.k}">${esc(x.t)}</span>`).join('')}</div></div>`).join('') || '<div class="pc-empty">Nothing in the papers. The night stayed in the room.</div>'}
    ${M.crisis ? `<div class="pc-cr"><span>${M.crisis.open ? 'The press wants an answer' : 'A story to watch'}: <b>${esc(M.crisis.title)}</b></span>${M.crisis.open ? '<button class="pc-btn go" data-pcm="media">ANSWER IN MEDIA ›</button>' : ''}</div>` : ''}</section>`;
  const ppl = `<section class="m-pg pc-ppl" data-t="people"><div class="pc-rows">${M.people.map((p) => `<div class="pc-row">${disc(p)}<span><b>${esc(p.name)}</b><small>${esc(p.why)}</small></span><span class="pc-ds">${p.chips.map((x) => `<span class="pc-chip${x.k ? ` ${x.k}` : ''}">${esc(x.t)}</span>`).join('') || '<span class="pc-chip">Said hello</span>'}</span></div>`).join('') || '<div class="pc-empty">Nobody new. Sometimes a night is just a night.</div>'}</div>
    <div class="pc-hang"><small>The hangover</small><b>${M.hv >= 0.6 ? 'Rough' : M.hv >= 0.3 ? 'Feeling it' : M.hv > 0.15 ? 'A little slow' : 'Fine'}</b><span class="pc-meter" style="--v:${M.hv.toFixed(2)};--c:${M.hv >= 0.6 ? '#d6202e' : '#e39a1b'}"><i></i></span><ul>${M.hang.map((x) => `<li><i>${x.i}</i><span>${esc(x.t)}</span></li>`).join('')}</ul>${M.hv > 0.15 ? '<p class="pc-hint">Rest in the week brings the energy back before race day.</p>' : ''}</div></section>`;
  const tabs = [['night', 'NIGHT'], ['press', 'PRESS'], ['people', 'PEOPLE']];
  el.innerHTML = `<div class="k-sheet"><header class="pc-head"><div><small>${esc(M.kicker)}</small><h2>${esc(M.title)}</h2></div><span class="pc-grow"></span>
      <nav class="pc-tabs">${tabs.map(([k, n], i) => `<button data-pct="${i}" class="${i === 0 ? 'on' : ''}">${n}${k === 'press' && M.crisis?.open ? '<em>!</em>' : ''}</button>`).join('')}</nav></header>
    <div class="pc-pgs m-pages">${night}${press}${ppl}</div>
    <footer class="pc-foot"><span class="pc-txt">${M.texts ? `${M.texts} new text${M.texts === 1 ? '' : 's'}${M.textFrom.length ? `: ${esc(nameList(M.textFrom))}` : ''}` : ''}</span><span class="pc-grow"></span>
      ${M.texts ? '<button class="pc-btn" data-pcm="phone">OPEN THE PHONE</button>' : ''}<button class="pc-btn go" data-pcm="next">NEXT →</button></footer></div>`;
  document.body.appendChild(el);
  const pgs = el.querySelector('.pc-pgs'), nav = el.querySelector('.pc-tabs'), nx = el.querySelector('[data-pcm="next"]');
  let tab = 0, shut = false, unkeys = null;
  const show = (i) => { tab = clamp(i, 0, 2); mPage(pgs, tab, { tabs: nav }); nx.textContent = tab >= 2 ? 'TO THE WEEK →' : 'NEXT →'; };
  const close = (then) => { if (shut) return; shut = true; unkeys?.(); el.removeAttribute('id'); mClose(el, () => el.remove()); try { then?.(); } catch (e) { console.error('PartyCards: the morning after failed', e); } };
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || shut) return;
    if (b.dataset.pct != null) { show(+b.dataset.pct); return; }
    const k = b.dataset.pcm;
    if (k === 'next') { if (tab >= 2) close(() => h.done?.()); else show(tab + 1); } else if (k === 'media') close(() => h.media?.()); else if (k === 'phone') close(() => h.phone?.());
  });
  unkeys = keys(el, {
    1: () => show(0), 2: () => show(1), 3: () => show(2), q: () => show(tab - 1), e: () => show(tab + 1), ArrowLeft: () => show(tab - 1), ArrowRight: () => show(tab + 1),
    Enter: () => { nx.click(); }, Escape: () => close(() => h.done?.()), p: () => { if (!M.texts) return 'pass'; close(() => h.phone?.()); return undefined; },
  });
  show(0); mOpen(el, 'fade', { now: true });
  return { el, close: () => close(), model: M };
}
/** a sheet of ours is up (CareerHub: no report or second sheet over it) */
export const partySheetUp = () => typeof document !== 'undefined' && !!(document.getElementById('party-tonight') || document.getElementById('party-morning'));
