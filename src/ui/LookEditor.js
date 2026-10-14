// Your own look, edited (career/Avatar.js holds the data): four static pages - FACE (a shape to start from, the
// measures fine-tuned, facial hair), HAIR (the cut, its colour, the parting), SKIN & EYES (the tone, the eyes, the small
// things) and SUIT & HELMET (the race suit in the team's colours or your own, the helmet's design and visor) - that
// slide sideways under a segmented control, never rebuilt: a click changes the look and the page's own buttons in place
// (the host is told, and redraws the figure in 3D). Used by the new career's YOUR LOOK step and the hub's DRIVER > Look
// tab (ui/CareerHub.js). Its buttons and inputs carry their own attributes only - data-lk (what it sets), data-lv (to
// what), data-lt (a page), data-lview (the camera) - so the hosts' own click routers never mistake them for theirs.
import { seg, page as mPage } from './Motion.js';
import * as A from '../career/Avatar.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const LOOK_TABS = ['Face', 'Hair', 'Skin & eyes', 'Suit & helmet'];

export const LOOK_CSS = `
#career .lk { flex: 1; min-height: 0; display: flex; flex-direction: column; }
#career .lk-tabs { flex: none; align-self: flex-start; }
#career .lk-tabs > button { min-height: 32px; padding: 0 14px; font-size: 12.5px; }
#career .lk-pages { flex: 1; min-height: 0; margin-top: 4px; }
#career .lk-pages > .m-pg { display: flex; flex-direction: column; overflow: hidden; }
#career .lk .lbl { margin: 12px 0 7px; }
#career .lk .m-pg > .lbl:first-child { margin-top: 8px; }
#career .lk button { letter-spacing: .01em; }
#career .lk-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
#career .lk .lk-card { height: 46px; padding: 0 11px; text-align: left; display: flex; flex-direction: column; justify-content: center; gap: 3px; min-width: 0; }
#career .lk .lk-card b { font: 700 12.5px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .lk .lk-card small { font: 600 11px/1.1 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #6b7480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .lk .lk-card.on, #career .lk .lk-chip.on, #career .lk .lk-eye.on { background: #fff; color: #151a22; border-color: var(--tc); box-shadow: 0 0 0 2px color-mix(in srgb, var(--tc) 32%, transparent); }
#career .lk-sls { display: grid; grid-template-columns: 1fr; gap: 0 18px; }
#career .lk-sl { display: grid; grid-template-columns: 86px 54px minmax(0, 1fr) 54px; align-items: center; gap: 8px; height: 29px; font-size: 12.5px; }
#career .lk-sl > span { font-weight: 700; color: #303845; }
#career .lk-sl > small { color: #8a93a0; font-size: 11px; font-weight: 600; white-space: nowrap; } #career .lk-sl > small.lo { text-align: right; }
#career .lk-sl input[type=range] { width: 100%; margin: 0; }
#career .lk-chips { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; } #career .lk-chips.c4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
#career .lk .lk-chip { height: 34px; padding: 0 8px; font: 600 12.5px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .lk-sws { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
#career .lk-skin { display: grid; grid-template-columns: repeat(7, 38px); gap: 8px; }
#career .lk .lk-sw, #career .lk .lk-sw.on { width: 30px; height: 30px; padding: 0; border-radius: 50%; background: var(--c); border: 2px solid #fff; box-shadow: 0 0 0 1px #cfd5de; }
#career .lk-skin .lk-sw, #career .lk-skin .lk-sw.on { width: 38px; height: 38px; }
#career .lk .lk-sw:hover:not(:disabled) { box-shadow: 0 0 0 1px #8a93a0; transform: translateY(-1px); }
#career .lk .lk-sw.on, #career .lk .lk-sw.on:hover { box-shadow: 0 0 0 2px #151a22; }
#career .lk input[type=color] { width: 40px; height: 32px; }
#career .lk-skin input[type=color] { width: 38px; height: 38px; }
#career .lk-col { display: inline-flex; align-items: center; gap: 6px; font: 700 11px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .06em; text-transform: uppercase; color: #5d6675; }
#career .lk-eyes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
#career .lk .lk-eye { height: 34px; padding: 0 9px; display: flex; align-items: center; gap: 7px; font: 600 12px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); white-space: nowrap; overflow: hidden; }
#career .lk-eye i { flex: none; width: 14px; height: 14px; border-radius: 50%; background: radial-gradient(circle, #111 0 28%, var(--c) 32%); box-shadow: 0 0 0 1px rgba(0,0,0,.18); }
#career .lk .seg button { padding: 8px 13px; }
#career .lk .seg button:disabled { opacity: .4; }
#career .lk-note { color: #6b7480; font-size: 12px; line-height: 1.35; }
#career .lk-suit { min-height: 36px; margin-top: 8px; display: grid; }
#career .lk-suit > * { grid-area: 1 / 1; display: flex; align-items: center; gap: 12px; min-width: 0; }
#career .lk:not(.lk-own) .lk-ownrow, #career .lk.lk-own .lk-team { visibility: hidden; }
#career .lk-tsw { width: 26px; height: 26px; border-radius: 7px; background: var(--c); box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); flex: none; }
#career .lk-pairs { display: inline-flex; gap: 6px; margin-left: auto; }
#career .lk .lk-pair { width: 26px; height: 26px; padding: 0; border-radius: 50%; background: linear-gradient(135deg, var(--a) 0 52%, var(--b) 52%); border: 2px solid #fff; box-shadow: 0 0 0 1px #cfd5de; }
#career .lk-hcols { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; margin-top: 8px; }
#career .lk .lk-link { padding: 7px 10px; font: 700 11px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); margin-left: auto; }
#career .lk-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
#career .lk-cam { position: absolute; right: var(--pad); bottom: var(--pad); z-index: 2; display: flex; align-items: center; gap: 2px; padding: 4px; border-radius: 13px; animation: m-fade var(--m-base, 220ms) var(--ease-out, ease) both; }
#career .lk-cam button { border: 0; background: transparent; padding: 8px 12px; border-radius: 9px; font: 700 11px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .06em; box-shadow: none; }
#career .lk-cam button:hover:not(:disabled) { transform: none; box-shadow: none; background: rgba(21,26,34,.05); }
#career .lk-cam button.on { background: #151a22; color: #fff; }
#career .lk-cam .dv { width: 1px; height: 20px; background: rgba(21,26,34,.12); margin: 0 4px; }
#career .lk-cam small { color: #8a93a0; font: 600 11px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); padding: 0 8px 0 4px; white-space: nowrap; }
#career.short .lk .lbl { margin: 8px 0 5px; } #career.short .lk-sl { height: 26px; } #career.short .lk .lk-card { height: 40px; }
#career .ch-panel.cc { width: clamp(520px, 43vw, 620px); }
#career .ch-panel.cc > .in { display: flex; flex-direction: column; overflow: hidden; }
#career .lk-hd { flex: none; display: flex; align-items: flex-start; gap: 12px; }
#career .lk-hd > div { flex: 1; min-width: 0; }
#career .lk-hd .lead { margin: 0 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .lk-hd > button { flex: none; padding: 8px 12px; font-size: 11px; }
#career .lk-foot { flex: none; margin-top: 10px; }
#career .ch-panel .row > span.tk, #career .ch-panel .tk { color: #d6202e; font-size: 12px; font-weight: 600; }
#career .wz1 { gap: 4px; }
#career .wz1 .teamrow { grid-template-columns: 132px 1fr 1fr; gap: 6px; }
#career .wz1 .pick { display: flex; align-items: baseline; gap: 8px; padding: 7px 11px; min-width: 0; }
#career .wz1 .pick b { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#career .wz1 .pick small { flex: none; white-space: nowrap; }
#career .wz1 + .detail { margin-top: 8px; padding: 8px 12px; }
#career .wz1 ~ .row { margin-top: 10px !important; }
#career .ch-panel > .in.m-arrive { animation-duration: var(--m-base, 220ms); }
@media (max-width: 899px) { #career .ch-panel.cc { width: auto; } #career .lk-cam { top: 64px; bottom: auto; right: 8px; } #career .lk-cam small { display: none; } }
@media (max-width: 699px) { #career .lk-cam { display: none; } }
`;

/** the editor's page tabs (the host may put them in its own header: the hub's head slot) */
export const lookTabsHTML = (tab = 0) => `<div class="k-seg lk-tabs" style="--n:${LOOK_TABS.length};--k:${tab}">${LOOK_TABS.map((n, i) => `<button data-lt="${i}" class="${i === tab ? 'on' : ''}">${esc(n)}</button>`).join('')}</div>`;
/** the camera's pill over the 3D view (view: 'face' | 'full' | 'helmet'; cap: worn) */
export const lookCamHTML = (view = 'face', cap = false) => `<div class="lk-cam glass" data-lkcam><button data-lview="face" class="${view === 'face' ? 'on' : ''}">FACE</button><button data-lview="full" class="${view === 'full' ? 'on' : ''}">FULL</button><button data-lview="helmet" class="${view === 'helmet' ? 'on' : ''}">HELMET</button><span class="dv"></span><button data-lk="cap" class="${cap ? 'on' : ''}" title="The team cap: as you are on the podium and in interviews">CAP</button><small>drag to turn</small></div>`;

/**
 * Every choice as it shows (the look's own, else the game's own pick - o.base: People.baseLook(name) - so a look with
 * nothing set shows the face the game draws) -> get(path)
 */
function getter(L, o) {
  const B = o.base || {}, bs = B.style || {}, team = o.team || {}, key = A.seedKey(L, o.name), AF = A.autoFace(key);
  const H = L.helmet || A.defaultHelmet(team.color, team.color2);
  return (p) => {
    switch (p) {
      case 'skin': return L.skin || B.skin || A.SKIN_TONES[4];
      case 'hair.style': return L.hair.style || (A.HAIR_STYLES_M.some((s) => s[0] === bs.hs) ? bs.hs : 'short');
      case 'hair.color': return L.hair.color || B.hair || '#2b1d14';
      case 'hair.part': return String(L.hair.part ?? A.autoPart(key));
      case 'beard': return L.beard || bs.fh || 'none';
      case 'eyes': return L.eyes || 'auto';
      case 'preset': return L.face.preset || '';
      case 'suit.own': return L.suit.own ? 'own' : 'team';
      case 'suit.primary': return L.suit.primary || team.color || '#00d4ff';
      case 'suit.secondary': return L.suit.secondary || team.color2 || '#ffffff';
      case 'helmet.style': return L.helmet ? L.helmet.style : '';
      case 'helmet.visor': return H.visor;
      case 'team.color': return team.color || '#00d4ff';
      case 'team.color2': return team.color2 || '#ffffff';
      default:
        if (p.startsWith('face.')) return L.face[p.slice(5)] ?? AF[p.slice(5)];
        if (p.startsWith('helmet.c.')) return H.c[+p.slice(9)];
        return null;
    }
  };
}
/** the look with one choice made (path, value) -> a new look, cleaned */
function apply(L0, p, v, o) {
  const L = JSON.parse(JSON.stringify(L0)), team = o.team || {}, H = () => (L.helmet = L.helmet || A.defaultHelmet(team.color, team.color2));
  const ownSuit = () => { L.suit.own = true; L.suit.primary = L.suit.primary || team.color || '#00d4ff'; L.suit.secondary = L.suit.secondary || team.color2 || '#ffffff'; };
  switch (p) {
    case 'skin': L.skin = v; break;
    case 'hair.style': L.hair.style = v; break;
    case 'hair.color': L.hair.color = v; break;
    case 'hair.part': L.hair.part = +v; break;
    case 'beard': L.beard = v; break;
    case 'eyes': L.eyes = v === 'auto' ? null : v; break;
    case 'preset': if (A.FACE_PRESETS[v]) Object.assign(L.face, A.FACE_PRESETS[v]); break;
    case 'seed': L.seed = Math.floor(Math.random() * 4294967296); break;
    case 'suit.own': if (v === 'own') ownSuit(); else L.suit.own = false; break;
    case 'suit.primary': ownSuit(); L.suit.primary = v; break;
    case 'suit.secondary': ownSuit(); L.suit.secondary = v; break;
    case 'suitpair': { const P = A.SUIT_PAIRS[+v]; if (P) { ownSuit(); [L.suit.primary, L.suit.secondary] = P; } break; }
    case 'helmet.style': H().style = v; break;
    case 'helmet.visor': H().visor = v; break;
    case 'helmet.fromSuit': { const own = L.suit.own; H().c = [(own ? L.suit.secondary : team.color2) || '#ffffff', (own ? L.suit.primary : team.color) || '#00d4ff', '#ffffff', '#111111']; break; }
    default:
      if (p.startsWith('face.')) { const k = p.slice(5); if (A.FACE_RANGE[k]) L.face[k] = +v; }
      else if (p.startsWith('helmet.c.')) H().c[+p.slice(9)] = v;
  }
  return A.normLook(L);
}

/**
 * The editor's pages (and its tabs, unless o.tabs === false: the host draws them elsewhere). o: { tab (the page shown),
 * team: { color, color2 } (the team's colours: the suit's when it is not your own), teamEdit (the team's colours can be
 * changed here: a new career's - data-lk "team.color" / "team.color2", handed to the host), base (People.baseLook(name)),
 * name } -> html
 */
export function lookEditorHTML(look, o = {}) {
  const L = A.normLook(look) || A.normLook(A.blankLook()), get = getter(L, o), tab = o.tab || 0;
  const on = (k, v) => (String(get(k)) === String(v) ? ' on' : '');
  const sw = (k, hex, title) => `<button class="lk-sw${on(k, hex)}" data-lk="${k}" data-lv="${esc(hex)}" style="--c:${esc(hex)}" title="${esc(title || hex)}" aria-label="${esc(title || hex)}"></button>`;
  const col = (k, label) => `<label class="lk-col">${label ? `<span>${esc(label)}</span>` : ''}<input type="color" data-lk="${k}" value="${esc(get(k))}" title="${esc(label || 'Any colour')}"></label>`;
  const segB = (k, id, n, dis = false) => `<button class="${on(k, id).trim()}" data-lk="${k}" data-lv="${esc(id)}"${dis ? ' disabled' : ''}>${esc(n)}</button>`;
  const pg = (i, html) => `<div class="m-pg${i < tab ? ' past' : i === tab ? ' on' : ''}"${i === tab ? '' : ' inert'}>${html}</div>`;
  const noPart = A.NO_PART.includes(get('hair.style'));
  const face = `<span class="lbl">Shape</span><div class="lk-cards">${A.PRESET_INFO.map(([id, n, d]) => `<button class="lk-card${on('preset', id)}" data-lk="preset" data-lv="${id}"><b>${esc(n)}</b><small>${esc(d)}</small></button>`).join('')}</div>
    <span class="lbl">Fine-tune</span><div class="lk-sls">${A.FACE_SLIDERS.map(([k, n, lo, hi]) => { const [a, b] = A.FACE_RANGE[k]; return `<label class="lk-sl"><span>${esc(n)}</span><small class="lo">${esc(lo)}</small><input type="range" data-lk="face.${k}" min="${a}" max="${b}" step="0.005" value="${get(`face.${k}`)}" aria-label="${esc(n)}"><small>${esc(hi)}</small></label>`; }).join('')}</div>
    <span class="lbl">Facial hair</span><div class="lk-row"><div class="seg">${A.BEARDS.map(([id, n]) => segB('beard', id, n)).join('')}</div></div>`;
  const hair = `<span class="lbl">Style</span><div class="lk-chips">${A.HAIR_STYLES_M.map(([id, n]) => `<button class="lk-chip${on('hair.style', id)}" data-lk="hair.style" data-lv="${id}">${esc(n)}</button>`).join('')}</div>
    <span class="lbl">Colour</span><div class="lk-sws">${A.HAIR_COLOURS.map(([h, n]) => sw('hair.color', h, n)).join('')}${col('hair.color', '')}</div>
    <span class="lbl">Parting</span><div class="lk-row"><div class="seg">${segB('hair.part', '1', 'Left', noPart)}${segB('hair.part', '-1', 'Right', noPart)}</div><span class="lk-note">Buzz cuts, curls and locs have none.</span></div>`;
  const skin = `<span class="lbl">Skin tone</span><div class="lk-skin">${A.SKIN_TONES.map((h, i) => sw('skin', h, `Tone ${i + 1}`)).join('')}${col('skin', '')}</div>
    <span class="lbl">Eyes</span><div class="lk-eyes"><button class="lk-eye${on('eyes', 'auto')}" data-lk="eyes" data-lv="auto"><i style="--c:#7a6a5a"></i>Auto</button>${A.EYES.map(([h, n]) => `<button class="lk-eye${on('eyes', h)}" data-lk="eyes" data-lv="${h}"><i style="--c:${h}"></i>${esc(n)}</button>`).join('')}</div>
    <span class="lbl">The small things</span><div class="lk-row"><button data-lk="seed">⟳ SHUFFLE</button><span class="lk-note">How you stand, how thick your hair grows${L.eyes ? '' : ', your eyes on Auto'} - drawn again.</span></div>`;
  const team = o.team || {};
  const teamRow = o.teamEdit ? `${col('team.color', 'Primary')}${col('team.color2', 'Secondary')}<span class="lk-note">Your team's livery: the car wears it too.</span>`
    : `<span class="lk-tsw" style="--c:${esc(team.color || '#888')}"></span><span class="lk-tsw" style="--c:${esc(team.color2 || '#fff')}"></span><span class="lk-note">The team's colours, as the car wears them.</span>`;
  const suit = `<span class="lbl">Race suit</span><div class="lk-row"><div class="seg">${segB('suit.own', 'team', 'Team colours')}${segB('suit.own', 'own', 'My own colours')}</div></div>
    <div class="lk-suit"><div class="lk-team">${teamRow}</div><div class="lk-ownrow">${col('suit.primary', 'Primary')}${col('suit.secondary', 'Secondary')}<span class="lk-pairs">${A.SUIT_PAIRS.map(([a, b, n], i) => `<button class="lk-pair" data-lk="suitpair" data-lv="${i}" title="${esc(n)}" aria-label="${esc(n)}" style="--a:${a};--b:${b}"></button>`).join('')}</span></div></div>
    <span class="lbl">Helmet${L.helmet ? '' : ' <span class="lk-note" style="text-transform:none;letter-spacing:0;font-weight:600">· plain for now: pick a design</span>'}</span><div class="lk-chips c4">${A.HELMET_STYLES.map(([id, n]) => `<button class="lk-chip${on('helmet.style', id)}" data-lk="helmet.style" data-lv="${id}">${esc(n)}</button>`).join('')}</div>
    <div class="lk-hcols">${col('helmet.c.0', 'Base')}${col('helmet.c.1', 'Accent')}${col('helmet.c.2', 'Detail')}${col('helmet.c.3', 'Trim')}<button class="lk-link" data-lk="helmet.fromSuit">FROM THE SUIT</button></div>
    <span class="lbl">Visor</span><div class="lk-sws">${A.VISORS.map(([h, n]) => sw('helmet.visor', h, n)).join('')}</div>`;
  return `<div class="lk${L.suit.own ? ' lk-own' : ''}">${o.tabs === false ? '' : lookTabsHTML(tab)}<div class="m-pages lk-pages">${pg(0, face)}${pg(1, hair)}${pg(2, skin)}${pg(3, suit)}</div></div>`;
}

/**
 * The editor wired to its page (root: the .lk; the look it starts from). o: as lookEditorHTML's, and tabsEl() (the
 * tabs, when the host put them elsewhere), camEl() (the camera's pill), onChange(look, kind) - kind: 'slide' (a slider
 * moving), 'commit' (one let go), 'random', or the choice's own path -, onTab(i), onView(v), onCap(), onTeam(key,
 * value). -> { click(e), input(e), change(e) (each true when it was the editor's), set(look), tab(i), look }
 */
export function wireLookEditor(root, look, o = {}) {
  let L = A.normLook(look) || A.normLook(A.blankLook()), tab = o.tab || 0;
  const tabsEl = () => (o.tabsEl ? o.tabsEl() : root.querySelector('.lk-tabs'));
  const sync = () => {
    const get = getter(L, o);
    for (const b of root.querySelectorAll('button[data-lk][data-lv]')) b.classList.toggle('on', String(get(b.dataset.lk)) === b.dataset.lv);
    for (const x of root.querySelectorAll('input[data-lk]')) { if (x.type === 'range' && x === document.activeElement) continue; const v = get(x.dataset.lk); if (v != null && x.value !== String(v)) x.value = v; }
    const np = A.NO_PART.includes(get('hair.style'));
    for (const b of root.querySelectorAll('[data-lk="hair.part"]')) b.disabled = np;
    root.classList.toggle('lk-own', !!L.suit.own);
  };
  const showTab = (i, quiet = false) => {
    tab = Math.max(0, Math.min(LOOK_TABS.length - 1, i | 0));
    seg(tabsEl(), tab); mPage(root.querySelector('.lk-pages'), tab);
    if (!quiet) o.onTab?.(tab);
  };
  const commit = (next, kind) => { if (!next) return; L = next; sync(); o.onChange?.(L, kind); };
  const mine = (el) => !!el && (root.contains(el) || !!tabsEl()?.contains(el) || !!o.camEl?.()?.contains(el));
  return {
    get look() { return L; },
    click(e) {
      const b = e.target.closest?.('button'); if (!b || !mine(b)) return false;
      if (b.disabled) return true;
      const d = b.dataset;
      if (d.lt != null) { if (+d.lt !== tab) showTab(+d.lt); return true; }
      if (d.lview != null) { for (const x of b.parentElement.querySelectorAll('[data-lview]')) x.classList.toggle('on', x === b); o.onView?.(d.lview); return true; }
      if (d.lk == null) return false;
      if (d.lk === 'cap') { b.classList.toggle('on'); o.onCap?.(b.classList.contains('on')); return true; }
      if (d.lk === 'random') { commit(A.randomLook(Math.random, L), 'random'); return true; }
      if (d.lk.startsWith('team.')) return true;
      commit(apply(L, d.lk, d.lv ?? null, o), d.lk);
      return true;
    },
    input(e) {
      const t = e.target, k = t?.dataset?.lk; if (!k || !mine(t)) return false;
      if (k.startsWith('team.')) { o.onTeam?.(k.slice(5), t.value); return true; }
      commit(apply(L, k, t.value, o), t.type === 'range' ? 'slide' : k);
      return true;
    },
    change(e) {
      const t = e.target; if (!t?.dataset?.lk || !mine(t)) return false;
      if (t.type === 'range') o.onChange?.(L, 'commit');
      return true;
    },
    /** another look shown (randomised by the host, the name changed, the team's colours) */
    set(look2, o2 = null) { if (o2) Object.assign(o, o2); L = A.normLook(look2) || L; sync(); },
    tab(i) { showTab(i, true); },
  };
}
