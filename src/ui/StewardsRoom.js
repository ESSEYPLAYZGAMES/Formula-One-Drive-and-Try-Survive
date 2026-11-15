// The stewards' room after the flag (the team principal's race: main.js stewardsAfter). The result is PROVISIONAL
// while incidents are still open: each is taken in turn as a document - the cars, the lap, the alleged breach - the
// evidence ticked off, a pause while they deliberate (longer for a hard one), and the decision stamped on it; then
// the classification beside it rearranges itself, the car penalised sliding down to its new place. If one of yours
// was the other car in an incident the stewards let go, you may lodge a protest (a deposit: back if it is upheld),
// heard the same way. Then the classification is FINAL. Space / Enter / a click: on; nothing here is decided by this
// file - it asks (o.decide, o.lodge) and shows what came back.
const CSS = `
#stwroom { position: fixed; inset: 0; z-index: 60; display: flex; gap: 26px; align-items: stretch; justify-content: center; padding: 4vh 4vw; background: radial-gradient(120% 90% at 50% 40%, rgba(8,10,16,.86), rgba(4,5,9,.96)); font-family: "Segoe UI Variable", "Segoe UI", Inter, system-ui, Roboto, sans-serif; color: #fff; opacity: 0; transition: opacity .5s; user-select: none; }
#stwroom.in { opacity: 1; }
#stwroom .cls { width: min(330px, 34vw); display: flex; flex-direction: column; min-height: 0; }
#stwroom .cls h4 { margin: 0 0 8px; font: 900 11px/1 inherit; letter-spacing: .2em; white-space: nowrap; color: #ffb300; text-shadow: 0 0 10px rgba(255,179,0,.6); transition: color .4s, text-shadow .4s; }
#stwroom.final .cls h4 { color: #2ee6a6; text-shadow: 0 0 10px rgba(46,230,166,.6); }
#stwroom .rows { position: relative; flex: 1; min-height: 0; overflow: hidden; }
#stwroom .rw { position: absolute; left: 0; right: 0; height: 22px; display: grid; grid-template-columns: 26px 4px 44px 1fr auto; gap: 0 7px; align-items: center; padding: 0 8px; font: 600 12px/1 inherit; background: rgba(255,255,255,.04); border-radius: 3px; transition: transform .9s cubic-bezier(.3,.9,.2,1), background .4s, box-shadow .4s; }
#stwroom .rw.mine { background: rgba(255,255,255,.13); } #stwroom .rw.hit { background: rgba(255,45,85,.3); box-shadow: 0 0 14px rgba(255,45,85,.5); } #stwroom .rw.up { background: rgba(46,230,166,.22); }
#stwroom .rw .p { text-align: right; font-weight: 800; color: #c9d1db; } #stwroom .rw i { height: 13px; border-radius: 2px; } #stwroom .rw .c { font-weight: 800; letter-spacing: .04em; }
#stwroom .rw .n { color: #aab3bf; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 11px; } #stwroom .rw .x { font: 800 10px/1 inherit; color: #ff6b81; letter-spacing: .04em; }
#stwroom .rw .x.g { color: #2ee6a6; }
#stwroom .room { width: min(520px, 50vw); display: flex; flex-direction: column; gap: 12px; min-height: 0; }
#stwroom .hdr { display: flex; align-items: baseline; justify-content: space-between; }
#stwroom .hdr b { font: 300 clamp(20px, 2.4vw, 32px)/1 inherit; letter-spacing: .16em; } #stwroom .hdr small { font: 800 10px/1 inherit; letter-spacing: .24em; color: #8a93a0; }
#stwroom .doc { position: relative; background: linear-gradient(180deg, rgba(16,19,28,.96), rgba(10,12,18,.96)); border: 1px solid rgba(255,255,255,.14); border-left: 3px solid #ffb300; border-radius: 6px; padding: 14px 16px 16px; box-shadow: 0 14px 40px rgba(0,0,0,.5); transform: translateY(18px); opacity: 0; transition: transform .45s cubic-bezier(.2,.8,.2,1), opacity .35s, border-color .4s; overflow: hidden; }
#stwroom .doc.in { transform: none; opacity: 1; } #stwroom .doc.old { opacity: .42; transform: scale(.97); padding: 10px 16px 11px; }
#stwroom .doc.old ul, #stwroom .doc.old .br, #stwroom .doc.old .dl, #stwroom .doc.old .dlt { display: none; } #stwroom .doc.old .out { margin-top: 6px; } #stwroom .doc.old .stamp { font-size: 10px; padding: 5px 8px; top: 9px; }
#stwroom .doc .no, #stwroom .doc .cars, #stwroom .doc .br { max-width: 56%; } #stwroom .doc.ask .no, #stwroom .doc.ask .cars { max-width: none; }
#stwroom .docs { display: flex; flex-direction: column; gap: 10px; min-height: 0; }
#stwroom .doc .no { font: 800 9px/1 inherit; letter-spacing: .24em; color: #8a93a0; }
#stwroom .doc .cars { display: flex; align-items: center; gap: 9px; margin: 9px 0 3px; font: 800 19px/1 inherit; letter-spacing: .04em; } #stwroom .doc .cars i { width: 5px; height: 18px; border-radius: 1px; display: inline-block; } #stwroom .doc .cars u { text-decoration: none; color: #6d7683; font-weight: 600; font-size: 14px; }
#stwroom .doc .br { font: 700 11px/1.3 inherit; letter-spacing: .14em; color: #c9d1db; text-transform: uppercase; }
#stwroom .doc ul { list-style: none; margin: 11px 0 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
#stwroom .doc li { font: 600 12px/1.2 inherit; color: #7d8794; display: flex; gap: 8px; align-items: center; opacity: .35; transition: opacity .3s, color .3s; } #stwroom .doc li::before { content: ''; width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid currentColor; box-sizing: border-box; }
#stwroom .doc li.ok { opacity: 1; color: #dfe5ec; } #stwroom .doc li.ok::before { background: #2ee6a6; border-color: #2ee6a6; box-shadow: 0 0 8px rgba(46,230,166,.7); }
#stwroom .doc .dl { margin-top: 12px; height: 3px; background: rgba(255,255,255,.1); border-radius: 2px; overflow: hidden; opacity: 0; } #stwroom .doc.think .dl { opacity: 1; }
#stwroom .doc .dl::after { content: ''; display: block; height: 100%; width: 34%; background: #ffb300; box-shadow: 0 0 10px #ffb300; animation: stwrThink 1.1s ease-in-out infinite alternate; }
#stwroom .doc .dlt { margin-top: 7px; font: 800 9px/1 inherit; letter-spacing: .3em; color: #ffb300; opacity: 0; } #stwroom .doc.think .dlt { opacity: 1; animation: stwrBlink 1s infinite; }
#stwroom .doc .stamp { position: absolute; right: 14px; top: 12px; padding: 7px 11px; border: 2px solid var(--v, #ff2d55); color: var(--v, #ff2d55); border-radius: 5px; font: 900 13px/1.15 inherit; letter-spacing: .12em; text-align: center; text-transform: uppercase; transform: rotate(-7deg) scale(2.4); opacity: 0; text-shadow: 0 0 12px var(--v, #ff2d55); box-shadow: 0 0 18px color-mix(in srgb, var(--v, #ff2d55) 55%, transparent), inset 0 0 14px color-mix(in srgb, var(--v, #ff2d55) 25%, transparent); max-width: 46%; }
#stwroom .doc.ruled .stamp { animation: stwrStamp .42s cubic-bezier(.2,1.4,.4,1) forwards; } #stwroom .doc.ruled { border-left-color: var(--v, #ff2d55); } #stwroom .doc.ruled .dl, #stwroom .doc.ruled .dlt { display: none; }
#stwroom .doc .out { margin-top: 12px; font: 600 12px/1.35 inherit; color: #dfe5ec; opacity: 0; transition: opacity .4s .3s; } #stwroom .doc.ruled .out { opacity: 1; }
#stwroom .ask { display: flex; flex-direction: column; gap: 8px; } #stwroom .ask p { margin: 0; font: 500 13px/1.4 inherit; color: #c9d1db; }
#stwroom button { font: 800 11px/1 inherit; letter-spacing: .14em; color: #fff; background: rgba(14,16,22,.9); border: 1px solid rgba(255,255,255,.26); border-radius: 6px; padding: 11px 14px; cursor: pointer; text-align: left; }
#stwroom button:hover { border-color: #fff; } #stwroom button.go2 { background: #e10600; border-color: #e10600; text-align: center; } #stwroom button small { display: block; margin-top: 5px; font: 600 10px/1.2 inherit; letter-spacing: .04em; color: #aab3bf; }
#stwroom .foot { margin-top: auto; font: 600 10px/1 inherit; letter-spacing: .14em; color: #6d7683; }
@keyframes stwrThink { from { transform: translateX(-10%); } to { transform: translateX(205%); } }
@keyframes stwrBlink { 50% { opacity: .3; } }
@keyframes stwrStamp { 0% { transform: rotate(-7deg) scale(2.4); opacity: 0; } 70% { transform: rotate(-7deg) scale(.94); opacity: 1; } 100% { transform: rotate(-7deg) scale(1); opacity: 1; } }
@media (max-width: 820px) { #stwroom { flex-direction: column; } #stwroom .cls, #stwroom .room { width: auto; } #stwroom .cls { max-height: 38vh; } }
`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const VERDICT = { pen: (v) => [`${v.sec} second\ntime penalty`, '#ff2d55'], racing: () => ['Racing incident\nno further action', '#2ee6a6'], nfa: () => ['No further\naction', '#c9d1db'], none: () => ['No further\naction', '#c9d1db'], upheld: (v) => [`Protest upheld\n${v.sec} second penalty`, '#2ee6a6'], dismissed: () => ['Protest\ndismissed', '#ff2d55'] };

/**
 * o: { order(): [{ id, code, name, color, mine, out }] (the classification now, first to last),
 *      cases: [{ title, a: { id, code, color }, b, lap, where, tough, decide(): { kind, sec } }],
 *      protests: [{ a, b, lap, where, cost, text, lodge(): { kind: 'upheld' | 'dismissed', sec } }], team (yours, for the protest's name),
 *      audio? } -> Promise (resolved when the classification is final and the room is left)
 */
export function stewardsRoom(o) {
  return new Promise((resolve) => {
    if (!document.getElementById('stwroom-css')) { const st = document.createElement('style'); st.id = 'stwroom-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = document.createElement('div'); el.id = 'stwroom';
    el.innerHTML = `<div class="cls"><h4>PROVISIONAL CLASSIFICATION</h4><div class="rows"></div></div><div class="room"><div class="hdr"><b>THE STEWARDS</b><small class="cnt"></small></div><div class="docs"></div><div class="foot">SPACE · ENTER · CLICK: ON</div></div>`;
    document.body.appendChild(el); setTimeout(() => el.classList.add('in'), 30);
    const rowsEl = el.querySelector('.rows'), docs = el.querySelector('.docs'), cnt = el.querySelector('.cnt'), rowOf = new Map(); let first = null, dead = false, skip = null;
    const wait = (ms) => new Promise((r) => { const t = setTimeout(() => { skip = null; r(); }, ms); skip = () => { clearTimeout(t); skip = null; r(); }; });
    const key = (e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); e.stopPropagation(); skip?.(); } };
    addEventListener('keydown', key, true); el.addEventListener('click', (e) => { if (!e.target.closest('button')) skip?.(); });
    /** the classification drawn where it stands now: each row moved to its place (and marked by how it moved) */
    const place = (mark) => {
      const O = o.order(); if (!first) first = new Map(O.map((r, i) => [r.id, i]));
      const h = Math.max(15, Math.min(22, Math.floor((rowsEl.clientHeight || 500) / Math.max(1, O.length)) - 1));
      O.forEach((r, i) => {
        let R = rowOf.get(r.id);
        if (!R) { R = document.createElement('div'); R.className = `rw${r.mine ? ' mine' : ''}`; R.innerHTML = `<span class="p"></span><i style="background:${esc(r.color)}"></i><span class="c">${esc(r.code)}</span><span class="n">${esc(r.name)}</span><span class="x"></span>`; R.style.height = `${h}px`; rowsEl.appendChild(R); rowOf.set(r.id, R); R._i = i; }
        const was = R._i; R._i = i; R.style.transform = `translateY(${i * (h + 2)}px)`; R.firstChild.textContent = r.out ? 'OUT' : i + 1;
        const d0 = first.get(r.id) - i, x = R.lastChild; x.textContent = d0 ? `${d0 > 0 ? '▲' : '▼'}${Math.abs(d0)}` : ''; x.className = `x${d0 > 0 ? ' g' : ''}`;
        if (mark && was !== i) { R.classList.add(i > was ? 'hit' : 'up'); setTimeout(() => R.classList.remove('hit', 'up'), 2600); }
      });
    };
    const car = (c) => `<i style="background:${esc(c.color)}"></i>${esc(c.code)}`;
    /** a document: shown, its evidence ticked, deliberated, stamped with what `rule` gives -> the ruling */
    const hear = async (D, rule) => {
      for (const d of docs.querySelectorAll('.doc')) d.classList.add('old');
      const doc = document.createElement('div'); doc.className = 'doc';
      doc.innerHTML = `<div class="no">${esc(D.no)}</div><div class="cars">${car(D.a)}${D.b ? `<u>and</u>${car(D.b)}` : ''}</div><div class="br">${esc(D.breach)}</div><ul>${D.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><div class="dl"></div><div class="dlt">DELIBERATING</div><div class="stamp"></div><div class="out"></div>`;
      docs.appendChild(doc); while (docs.children.length > 3) docs.firstChild.remove();
      setTimeout(() => doc.classList.add('in'), 30); await wait(1100);
      for (const li of doc.querySelectorAll('li')) { li.classList.add('ok'); try { o.audio?.beep?.(880, 0.03, 0.05); } catch (e) { /* silent */ } await wait(850); }
      doc.classList.add('think'); await wait(D.tough ? 4200 : 2300);
      const before = o.order().map((r) => r.id), v = rule(), [txt, col] = (VERDICT[v.kind] || VERDICT.nfa)(v);
      doc.style.setProperty('--v', col); doc.querySelector('.stamp').innerHTML = esc(txt).replace(/\n/g, '<br>'); doc.classList.remove('think'); doc.classList.add('ruled');
      try { o.audio?.beep?.(v.kind === 'pen' || v.kind === 'dismissed' ? 180 : 620, 0.16, 0.2); } catch (e) { /* silent */ }
      await wait(650);
      // (what it does to the result: said, and the classification moved)
      place(true);
      const O = o.order(), moved = O.map((r, i) => [r, before.indexOf(r.id), i]).filter((x) => x[1] !== x[2] && (x[0].id === D.a.id || x[0].mine)).slice(0, 3).map(([r, a, b]) => `${r.code} P${a + 1} → P${b + 1}`);
      doc.querySelector('.out').textContent = v.text || (moved.length ? moved.join(' · ') : v.kind === 'pen' || v.kind === 'upheld' ? 'No change of position.' : 'The result stands.');
      await wait(2600);
      return v;
    };
    const steps = (k) => ['Video evidence reviewed', 'Telemetry and team radio reviewed', k.tough ? 'Both drivers and their teams heard' : 'The drivers heard'];
    (async () => {
      place(false); cnt.textContent = o.cases.length ? `${o.cases.length} DECISION${o.cases.length > 1 ? 'S' : ''} PENDING` : 'THE RESULT'; await wait(o.cases.length ? 1500 : 700);
      let n = 0;
      for (const k of o.cases) { n++; cnt.textContent = `DECISION ${n} OF ${o.cases.length}`; await hear({ no: `DOCUMENT ${10 + n} · LAP ${k.lap}${k.where ? ` · ${k.where}` : ''}`, a: k.a, b: k.b, breach: 'Alleged breach: causing a collision', steps: steps(k), tough: k.tough }, k.decide); if (dead) return; }
      // ---- a protest of yours
      for (const P of (typeof o.protests === 'function' ? o.protests() : o.protests) || []) {
        cnt.textContent = 'YOUR RIGHT OF PROTEST';
        const ask = document.createElement('div'); ask.className = 'doc in ask';
        ask.innerHTML = `<div class="no">LAP ${P.lap}${P.where ? ` · ${esc(P.where)}` : ''}</div><div class="cars">${car(P.a)}<u>on</u>${car(P.b)}</div><p>${esc(P.text)}</p><button data-v="lodge">LODGE A PROTEST${P.cost ? ` · $${P.cost}M DEPOSIT` : ''}<small>Heard now. Upheld: a penalty for ${esc(P.a.code)}${P.cost ? ', the deposit back' : ''}. Dismissed: ${P.cost ? 'the deposit is lost, and the paddock notes it' : 'the result stands'}.</small></button><button data-v="no">ACCEPT THE STEWARDS' DECISION</button>`;
        for (const d of docs.querySelectorAll('.doc')) d.classList.add('old'); docs.appendChild(ask); while (docs.children.length > 3) docs.firstChild.remove();
        const pick = await new Promise((r) => { ask.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) r(b.dataset.v); }); });
        ask.remove();
        if (pick === 'lodge') await hear({ no: `PROTEST · ${String(o.team || 'YOUR TEAM').toUpperCase()}`, a: P.a, b: P.b, breach: `Protest against the classification of car ${P.a.code}`, steps: ['The protest admitted', 'Video and telemetry reviewed again', 'Both teams heard'], tough: true }, P.lodge);
      }
      el.classList.add('final'); el.querySelector('.cls h4').textContent = 'FINAL CLASSIFICATION'; cnt.textContent = 'THE RESULT IS FINAL';
      const go = document.createElement('button'); go.className = 'go2'; go.textContent = 'CONTINUE'; el.querySelector('.room').insertBefore(go, el.querySelector('.foot'));
      await Promise.race([wait(9000), new Promise((r) => { go.onclick = r; })]);
      dead = true; removeEventListener('keydown', key, true); el.classList.remove('in'); setTimeout(() => { el.remove(); resolve(); }, 520);
    })().catch((e) => { console.warn('[stewards room]', e); removeEventListener('keydown', key, true); el.remove(); resolve(); });
  });
}
