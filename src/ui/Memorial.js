// In memoriam (the heading implies the tragedy; the card names no one who has died). After a race in which an accident put a driver in the medical centre: a quiet card with get-well
// wishes for them - from the team, a fellow driver, the fans - and one true thing about what crashes do to the people
// in the cars (the body and the mind). A candle, the team's colour, a slow fade; ~14 s each (CONTINUE skips). (No
// memorial for the real drivers who have died: too sad for the game.)
const CSS = `
#memorial { position: fixed; inset: 0; z-index: 60; background: #000; display: flex; opacity: 0; transition: opacity 1.4s ease; font-family: Georgia, 'Times New Roman', serif; color: #e6e2d9; overflow-y: auto; }
#memorial.show { opacity: 1; }
#memorial .mem-card { width: min(580px, calc(100vw - 32px)); margin: auto; text-align: center; padding: 24px 0; animation: memZoom 16s ease-out both; }   /* (margin: auto - centred, and scrollable from its top when taller than the screen) */
#memorial .candle { position: relative; width: 14px; height: 46px; margin: 34px auto 26px; background: linear-gradient(#f3eee2, #cfc8b6); border-radius: 3px 3px 2px 2px; }
#memorial .candle::before { content: ''; position: absolute; left: 6px; top: -7px; width: 2px; height: 8px; background: #222; }
#memorial .flame { position: absolute; left: 50%; top: -30px; width: 12px; height: 24px; margin-left: -6px; border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  background: radial-gradient(ellipse at 50% 70%, #fff7d1 0%, #ffd27a 35%, #ff8a1f 70%, rgba(255,90,0,0) 100%); filter: blur(.4px); transform-origin: 50% 90%; animation: memFlicker 1.8s ease-in-out infinite; box-shadow: 0 0 28px 10px rgba(255,170,60,.22); }
#memorial .over { font: 600 13px/1 system-ui, sans-serif; letter-spacing: .55em; color: #a8a398; margin-bottom: 16px; }
#memorial .lost { font-style: italic; font-size: 16px; color: #b3aea2; }
#memorial .names { font: 500 12px/1.9 system-ui, sans-serif; letter-spacing: .12em; color: #7f7b72; margin: 8px 0 0; }
#memorial .stripe { height: 2px; width: 0; margin: 26px auto 22px; animation: memStripe 2s ease-out forwards; }
#memorial .for { font-size: clamp(22px, 5vw, 32px); margin: 0 0 10px; }
#memorial .what { font-size: 15px; line-height: 1.55; color: #cfcabe; }
#memorial .wishes { margin: 22px 0 0; }
#memorial .wish { font-style: italic; font-size: 15px; color: #e6e2d9; margin: 9px 0; }
#memorial .wish span { display: block; font: 500 11px/1.6 system-ui, sans-serif; font-style: normal; letter-spacing: .14em; color: #7f7b72; }
#memorial .fact { font: 400 13px/1.6 system-ui, sans-serif; color: #9a958a; margin: 26px auto 0; max-width: 470px; padding-top: 16px; border-top: 1px solid #22211e; }
#memorial .standin { font: 500 12px/1.5 system-ui, sans-serif; letter-spacing: .08em; color: #7f7b72; margin-top: 18px; }
#memorial .fade { opacity: 0; animation: memIn 1.6s ease forwards; }
#memorial button { margin-top: 26px; background: none; border: 1px solid #3b3934; color: #a8a398; font: 600 11px/1 system-ui, sans-serif; letter-spacing: .3em; padding: 10px 18px; cursor: pointer; }
#memorial button:hover { border-color: #7f7b72; color: #e6e2d9; }
@keyframes memIn { to { opacity: 1; } }
@keyframes memStripe { to { width: 120px; } }
@keyframes memZoom { from { transform: scale(.99); } to { transform: scale(1.01); } }
@keyframes memFlicker { 0%, 100% { transform: scale(1, 1) rotate(-1deg); opacity: .95; } 25% { transform: scale(.94, 1.06) rotate(1.5deg); } 50% { transform: scale(1.04, .95) rotate(-2deg); opacity: 1; } 75% { transform: scale(.97, 1.03) rotate(1deg); opacity: .9; } }
@media (prefers-reduced-motion: reduce) { #memorial .mem-card, #memorial .flame { animation: none; } #memorial .fade { animation-duration: .01s; } }
`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** one of these per card: what accidents do to the people in the cars, and what the sport has learned */
const FACTS = [
  "Romain Grosjean's crash in Bahrain in 2020 was measured at 67 g. He climbed out of the burning car after almost 30 seconds, and has spoken openly since about how long it took to come to terms with it.",
  'Crashes leave marks on the mind as well as the body. Fear, flashbacks and anxiety are common after a big impact, and many drivers work with sports psychologists. Talking about it is part of recovery.',
  "After a heavy accident a driver must be cleared by the FIA's medical team, including checks for concussion, before racing again. Concussion symptoms can appear hours or even days later.",
  'The halo, mandatory in Formula 1 since 2018, has been credited with saving drivers including Romain Grosjean (Bahrain 2020) and Zhou Guanyu (Silverstone 2022).',
  'The HANS device, mandatory in Formula 1 since 2003, holds the head and neck against the forces of a heavy frontal impact.',
];

/**
 * @param items [{ name, team, color, isPlayer, track, round (the one missed), mate (a fellow driver's name), standIn: { name, from } }]
 * @param done called after the last card
 * @param chime optional () => void, a low tone as each card appears
 */
export function showMemorial(items, done, chime) {
  if (!document.getElementById('memorial-css')) { const st = document.createElement('style'); st.id = 'memorial-css'; st.textContent = CSS; document.head.appendChild(st); }
  let el = document.getElementById('memorial');
  if (!el) { el = document.createElement('div'); el.id = 'memorial'; document.body.appendChild(el); }
  let i = 0, timer = null, f = Math.floor(Math.random() * FACTS.length);
  const next = () => {
    clearTimeout(timer);
    if (i >= items.length) { el.classList.remove('show'); setTimeout(() => { el.remove(); done?.(); }, 1400); return; }
    const m = items[i++]; el.innerHTML = card(m, FACTS[f++ % FACTS.length]); el.classList.add('show'); el.scrollTop = 0; chime?.();
    el.querySelector('button').addEventListener('click', next);
    timer = setTimeout(next, 16000);
  };
  setTimeout(next, 30);   // (a timer, not a frame callback: it must run even if the tab is in the background)
}

function card(m, fact) {
  const first = m.name.split(' ')[0], last = m.name.split(' ').pop(), tag = last.replace(/[^A-Za-z]/g, '');
  const d = (k, html) => `<div class="fade" style="animation-delay:${k}s">${html}</div>`;
  if (!m.dead) {
    // (hurt, not killed: relief and get-well wishes - this is not a memorial)
    const num0 = m.number != null ? `#${m.number}` : '', who = m.isPlayer ? 'you' : esc(first);
    return `<div class="mem-card" style="animation:none">
      ${d(0.6, '<div class="over">GET WELL SOON</div>')}
      ${d(1.4, `<div class="stripe" style="background:${esc(m.color)}"></div><div class="for">${m.isPlayer ? 'Heal up.' : esc(m.name)}</div><div class="names">${esc([num0, m.team].filter(Boolean).join(' · '))}</div>
        <div class="what">${m.isPlayer ? 'You were' : `${esc(first)} was`} taken to hospital from ${esc(m.track)} after a heavy accident - conscious, sore, and kept in for checks. The car did its job.</div>`)}
      <div class="wishes">
        ${d(4.2, `<div class="wish">“Thank you for all the messages. ${m.isPlayer ? 'You are' : `${esc(first)} is`} OK, and that's what matters.”<span>${esc(m.team.toUpperCase())}</span></div>`)}
        ${d(5.4, `<div class="wish">“Scary one. Get well soon, see ${who} back out there.”<span>${esc((m.mate || 'THE PADDOCK').toUpperCase())}</span></div>`)}
        ${d(6.6, `<div class="wish">“So relieved. Heal up ${m.isPlayer ? '' : esc(first) + ' '}🧡 #GetWell${esc(m.isPlayer ? '' : tag)}”<span>THE FANS</span></div>`)}
      </div>
      ${d(8.0, `<div class="fact">${esc(fact)}</div>`)}
      ${m.standIn ? d(9.2, `<div class="standin">${esc(m.standIn.name)} (${esc(m.standIn.from)}) will drive the ${esc(m.team)} car in Round ${m.round}${m.round2 ? ` and Round ${m.round2}` : ''}.${m.isPlayer ? ' You will watch from the pit wall.' : ''}</div>`) : ''}
      ${d(9.8, '<button>CONTINUE</button>')}
    </div>`;
  }
  // (the worst assumed: nobody speaks of getting well)
  const num = m.number != null ? `#${m.number}` : '';
  const what = m.isPlayer
    ? `You were airlifted from ${esc(m.track)} after a heavy accident. The paddock fell silent, and nobody could bring themselves to say what everyone feared.`
    : `${esc(first)} was airlifted from ${esc(m.track)} after a heavy accident. The paddock fell silent, and nobody could bring themselves to say what everyone feared.`;
  const to = m.isPlayer ? 'you' : esc(first);
  return `<div class="mem-card">
    ${d(0.2, '<div class="candle"><div class="flame"></div></div>')}
    ${d(0.8, '<div class="over">IN MEMORIAM</div>')}
    ${d(1.8, `<div class="stripe" style="background:${esc(m.color)}"></div><div class="for">${m.isPlayer ? 'For you.' : esc(m.name)}</div><div class="names">${esc([num, m.team].filter(Boolean).join(' · '))}</div><div class="what">${what}</div>`)}
    <div class="wishes">
      ${d(5.6, `<div class="wish">“Forever part of our family. We will never forget ${to}.”<span>${esc(m.team.toUpperCase())}</span></div>`)}
      ${d(6.8, `<div class="wish">“Every lap I drive from now on is for ${m.isPlayer ? 'you' : esc(first)}.”<span>${esc((m.mate || 'THE PADDOCK').toUpperCase())}</span></div>`)}
      ${d(8.0, `<div class="wish">“Never forget ${esc(num || first)}. Forever in our hearts. #PrayFor${esc(m.isPlayer ? '' : tag)}”<span>THE FANS</span></div>`)}
    </div>
    ${d(9.6, `<div class="fact">${esc(fact)}</div>`)}
    ${m.standIn ? d(11.0, `<div class="standin">${esc(m.standIn.name)} (${esc(m.standIn.from)}) will drive the ${esc(m.team)} car in Round ${m.round}${m.round2 ? ` and Round ${m.round2}` : ''}.${m.isPlayer ? ' You will watch from the pit wall.' : ''}</div>`) : ''}
    ${d(11.2, '<div class="over" style="margin-top:22px">NEVER FORGET</div>')}
    ${d(11.8, '<button>CONTINUE</button>')}
  </div>`;
}
