// The team principal's HQ, its MAIL page (ui/ManagerHub.js draws the frame; career/ManagerMail.js is what it shows).
// A mail client on the sheet: the list down the left - INBOX (what has come: answers, offers to sign, the team
// manager's reports, the factory, the board), AWAITING REPLY (what you have asked and when the answer is due),
// DECISIONS (the story's matters: career/ManagerStory.js - the same ones the paddock page lists) - and the one that
// is open on the right, as a letter: who, when, what they say, the terms on a card, and the buttons that settle it.
// And the asking itself: the pages' own buttons for the things that take time (an approach, a protest, a hire, an
// extension, a sponsor's terms, a prospect, the academy's building, an engine) come through here - mailClick - and
// become a mail sent instead of an answer on the spot; while one is out its button on its page shows as asked.
import { mailEnsure, mailAsk, mailAct, mailWithdraw, mailRead, mailReadAll, mailMarks, mailUnread, dueWords } from '../career/ManagerMail.js';
import { inboxOf, decisionsOf } from '../career/ManagerStory.js';
import { esc, panel, seg, tag, kv, person, empty } from './HQKit.js';

const SCENE = { feudRow: 'The garage', debrief: 'Your office', poach: 'The paddock', hearing: 'The stewards', scrutineering: 'Scrutineering', audit: 'The auditors', sponsorCall: 'A call', leak: 'The factory, at night', seatFit: 'The garage', crewTalk: 'The garage', press: 'The press room', board: 'The boardroom', launch: 'Launch night', seasonReview: 'A film', documentary: 'A film', factoryTour: 'The factory', garageNight: 'The garage', sacked: 'The boardroom', signing: 'The press room', released: 'Your office' };
const HOW = 'What you ask of people outside your office is answered by mail: after the next race, sometimes the one after. Terms that come back are signed from the mail itself, and lapse if left for two races.';
const ini = (n) => { const w = String(n || '?').replace(/^The\s+/i, '').replace(/[^\p{L}\s']/gu, ' ').trim().split(/\s+/); return ((w[0]?.[0] || '?') + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase(); };
const av = (name, col, big) => `<i class="ml-av${big ? ' big' : ''}"${col ? ` style="--c:${esc(col)}"` : ''}>${esc(ini(name))}</i>`;
const when = (m) => `Round ${m.round} · ${m.season}`;
const open = (m) => !!(m.acts && m.acts.length && m.done === false);
const chip = (m) => open(m) ? tag('Answer needed', 'ac') : m.acts?.length ? tag(m.lapsed ? 'Lapsed' : 'Settled', m.lapsed ? 'bad' : '') : m.tag === 'reply' ? tag('Reply', m.good ? 'good' : 'bad') : m.tag === 'report' ? tag('Report') : tag('Note');

/** a row of the list */
const row = (id, on, un, name, col, date, subj, prev, tg, k = 'mailsel') => `<button class="ml-row${on ? ' on' : ''}${un ? ' un' : ''}" data-a="${k}" data-v="${esc(id)}">${av(name, col)}<span class="ml-m"><span class="ml-top"><b>${esc(name)}</b><em>${esc(date)}</em></span><span class="ml-sj">${esc(subj)}</span><span class="ml-pv">${esc(prev)}</span></span><span class="ml-tg">${tg}</span></button>`;

/** the letter that is open */
function letter(c, m) {
  const M = c.mail, left = m.until != null ? m.until - M.clock : null;
  const acts = open(m) ? `<div class="ml-acts">${m.acts.map((a) => `<button class="${a.go ? 'go' : 'ghost'}" data-a="mailact" data-v="${esc(m.id)}|${esc(a.id)}"${a.hint ? ` title="${esc(a.hint)}"` : ''}>${esc(a.label)}</button>`).join('')}${left != null ? `<small>${left <= 1 ? 'Lapses after the next race' : `Lapses in ${left} races`}</small>` : ''}</div>`
    : m.acts?.length ? `<div class="ml-done${m.lapsed ? ' no' : ''}"><i>${m.lapsed ? '!' : '✓'}</i><span>${m.chose ? `<b>${esc(m.chose)}</b> ` : ''}${esc(m.result || (m.lapsed ? 'It was settled without you.' : ''))}</span></div>` : '';
  return `<article class="ml-let" data-k="mlread"><header class="ml-hd">${av(m.from, m.col, true)}<div class="ml-who"><b>${esc(m.from)}</b><small>${esc(m.org || '')}</small><small class="ml-to">to you · ${esc(when(m))}</small></div><span>${chip(m)}</span></header>
    <h2 class="ml-subj">${esc(m.subj)}</h2>${m.re ? `<div class="ml-re">In reply to your message <q>${esc(m.re)}</q></div>` : ''}
    <div class="ml-body">${(m.body || []).map((p) => `<p>${esc(p)}</p>`).join('')}<p class="ml-sig">${esc(m.from)}</p></div>
    ${m.terms?.length ? `<div class="ml-terms">${m.terms.map(([k, v]) => kv(esc(k), esc(v))).join('')}</div>` : ''}${acts}</article>`;
}
/** a thing asked and not yet answered: what you wrote, and where it has got to */
function asked(c, p) {
  const M = c.mail, left = Math.max(0, p.due - M.clock), k = Math.max(0, Math.min(1, 1 - left / Math.max(1, p.wait))), step = k <= 0 ? 1 : 2;
  return `<article class="ml-let" data-k="mlread"><header class="ml-hd">${av(p.to, p.col, true)}<div class="ml-who"><b>To ${esc(p.to)}</b><small>${esc(p.org || '')}</small><small class="ml-to">from you · sent before round ${p.round}, ${p.season}</small></div><span>${tag('Awaiting reply', 'warn')}</span></header>
    <h2 class="ml-subj">${esc(p.subj)}</h2>
    <div class="ml-body">${(p.body || []).map((x) => `<p>${esc(x)}</p>`).join('')}<p class="ml-sig">You</p></div>
    <div class="ml-trk" style="--k:${(0.12 + 0.76 * k).toFixed(2)}"><i></i><span class="on">Sent</span><span class="${step >= 2 ? 'on' : ''}">Being considered</span><span>Reply ${esc(dueWords(c, p))}</span></div>
    <div class="ml-acts"><button class="ghost" data-a="mailwd" data-v="${esc(p.id)}">WITHDRAW IT</button><small>Nothing is settled until they answer.</small></div></article>`;
}
/** a matter of the story, as a letter (decided here in a line, as on the paddock page) */
function matter(c, m) {
  const due = m.due != null && m.due < 90 ? (m.due <= c.round ? 'Decides itself at the next race' : `Before round ${m.due + 1}`) : '';
  return `<article class="ml-let" data-k="mlread"><header class="ml-hd">${av(SCENE[m.scene] || 'A matter', null, true)}<div class="ml-who"><b>${esc(SCENE[m.scene] || 'A matter')}</b><small>In person, when you are next there - or decide it here</small><small class="ml-to">${esc(when(m))}</small></div><span>${tag('Decision', 'ac')}</span></header>
    <h2 class="ml-subj">${esc(m.title)}</h2><div class="ml-body"><p>${esc(m.text || '')}</p></div>
    <div class="ml-acts">${(m.options || []).map((o, i) => `<button class="${i ? 'ghost' : 'go'}" data-a="stpick" data-v="${esc(m.key)}|${esc(o.id)}" title="${esc(o.hint || '')}">${esc(o.label)}</button>`).join('')}${due ? `<small>${due}</small>` : ''}</div></article>`;
}

export function mailHTML(c, tab, H) {
  if (tab !== 'mail') return null;
  const M = mailEnsure(c), S = H.ml || (H.ml = { f: 'in', sel: null }), dec = decisionsOf(c);
  const box = M.box.slice().sort((a, b) => (open(b) ? 1 : 0) - (open(a) ? 1 : 0)), un = mailUnread(c);
  const f = S.f, items = f === 'out' ? M.out.slice().reverse() : f === 'dec' ? dec : box, idOf = (x) => (f === 'dec' ? x.key : x.id);
  let cur = items.find((x) => idOf(x) === S.sel) || items[0] || null;
  if (cur && f === 'in') mailRead(c, cur.id);
  const bar = `<div class="ml-bar">${seg('mailf', f, [['in', `Inbox${un ? ` · ${un}` : ''}`], ['out', `Awaiting reply${M.out.length ? ` · ${M.out.length}` : ''}`], ['dec', `Decisions${dec.length ? ` · ${dec.length}` : ''}`]])}${f === 'in' && un > 1 ? '<button class="ghost ml-all" data-a="mailall">MARK ALL READ</button>' : ''}</div>`;
  const rows = items.map((x) => f === 'out' ? row(x.id, x === cur, false, x.to, x.col, `due ${dueWords(c, x).replace('after the next race', 'next race')}`, x.subj, (x.body || [])[0] || '', tag('Asked', 'warn'))
    : f === 'dec' ? row(x.key, x === cur, true, SCENE[x.scene] || 'A matter', null, when(x), x.title, x.text || '', tag('Decision', 'ac'))
      : row(x.id, x === cur, !x.read && x !== cur, x.from, x.col, when(x), x.subj, x.result && x.acts?.length ? x.result : (x.body || [])[0] || '', chip(x))).join('');
  const none = f === 'out' ? 'Nothing is out. Ask someone something: an approach on the Rivals page, an offer on Staff, terms on Sponsors.' : f === 'dec' ? 'No decisions are waiting.' : 'No mail yet.';
  const list = panel('Mail', `${bar}<div class="ml-list q-sc" data-k="mllist">${rows || empty(none)}</div>`, { w: 5, cls: 'ml-lp', scroll: false, pad: false, sub: M.out.length ? `${M.out.length} awaiting reply` : '', info: HOW });
  const read = panel(cur ? (f === 'out' ? 'Sent' : f === 'dec' ? 'A decision' : 'Message') : 'Message', cur ? (f === 'out' ? asked(c, cur) : f === 'dec' ? matter(c, cur) : letter(c, cur)) : empty('Nothing selected.'), { w: 7, cls: 'ml-rp', scroll: false, pad: false });
  return `<div class="q-g">${list}${read}</div>`;
}
/** on the overview's NEEDS YOU: the mail that wants an answer (or how much is unread), and what is out */
export function mailHome(c) {
  const M = mailEnsure(c), need = M.box.filter(open), un = mailUnread(c); let h = '';
  if (need.length) h += person({ cls: 'top', name: `${tag(`Mail · ${need.length} to answer`, 'ac')} ${esc(need[0].subj)}`, sub: `${esc(need[0].from)}: ${esc((need[0].body || [])[0] || '')}`, act: '<button class="go" data-tab="mail">OPEN →</button>' });
  else if (un) h += person({ cls: 'top', name: `${tag(`Mail · ${un} unread`, 'ac')} ${esc(M.box.find((m) => !m.read)?.subj || '')}`, sub: esc(M.box.find((m) => !m.read)?.from || ''), act: '<button data-tab="mail">READ →</button>' });
  if (M.out.length) h += person({ name: `${tag(`Awaiting reply · ${M.out.length}`, 'warn')}`, sub: M.out.slice(0, 3).map((p) => `${esc(p.to)} (${esc(dueWords(c, p))})`).join(' · ') });
  return h;
}
/** the pages' buttons whose answer is out: shown as asked (after a page is drawn) */
export function mailMark(root, c) {
  if (!root || !c?.mail?.out?.length) return; let marks; try { marks = mailMarks(c); } catch (e) { return; } if (!marks.length) return;
  for (const b of root.querySelectorAll('.q-stage button[data-a]')) {
    const a = b.dataset.a, v = b.dataset.v ?? '', m = marks.find((x) => x.a === a && (x.v == null || (x.pre ? v.startsWith(x.v) : v === x.v))); if (!m) continue;
    b.disabled = true; b.classList.add('ml-wait'); b.title = `Asked - the answer comes by mail ${m.due}.`; if (!b.firstElementChild && b.textContent.trim().length <= 14) b.textContent = 'ASKED';
  }
}
/** a click: the mail's own, and the askings that go by mail -> { text, ok } | null (done, nothing to say) | undefined (not ours) */
export function mailClick(c, a, v, H) {
  const S = H.ml || (H.ml = { f: 'in', sel: null }), sp = String(v ?? '').split('|');
  switch (a) {
    case 'mailf': S.f = v; S.sel = null; return null;
    case 'mailsel': S.sel = v; if (mailRead(c, v)) c.save(); return null;
    case 'mailall': mailReadAll(c); return null;
    case 'mailact': { const r = mailAct(c, sp[0], sp[1]); return r; }
    case 'mailwd': S.sel = null; return mailWithdraw(c, v);
    // ---- what is asked by mail now, from the pages' own buttons
    case 'rvraid': return mailAsk(c, 'raid', { team: sp[0], role: sp[1] });
    case 'rvprot': return mailAsk(c, 'protest', { team: v });
    case 'hire': return mailAsk(c, 'staff', { role: sp[0], i: +sp[1] });
    case 'crewhire': return mailAsk(c, 'crew', { i: +v });
    case 'enghire': return mailAsk(c, 'engineer', { i: +sp[0], slot: +sp[1] });
    case 'extend': return mailAsk(c, 'extend', { did: sp[0], years: +sp[1] || 1 });
    case 'prop': { const o = (c.spOffers || []).find((x) => x.id === v), r = mailAsk(c, 'sponsor', { oid: v, terms: H.neg && H.neg.id === v ? { base: H.neg.base, bonus: H.neg.bonus, years: H.neg.years } : { base: 1, bonus: 1, years: o?.years || 1 } }); if (r?.ok) H.neg = null; return r; }
    case 'acsign': return mailAsk(c, 'scout', { i: +v });
    case 'acup': return mailAsk(c, 'acbuild', {});
    case 'supplier': return mailAsk(c, 'engine', { key: v });
    default: return undefined;
  }
}

export const MAIL_CSS = `
#mgr .ml-lp > .q-pb, #mgr .ml-rp > .q-pb { display: flex; flex-direction: column; min-height: 0; padding: 0; overflow: hidden; }
#mgr .ml-bar { display: flex; align-items: center; gap: 8px; padding: 10px 12px 9px; border-bottom: 1px solid var(--line); flex: none; }
#mgr .ml-bar .q-seg { flex: 1; display: flex; } #mgr .ml-bar .q-seg button { flex: 1; white-space: nowrap; padding-left: 6px; padding-right: 6px; }
#mgr .ml-bar .ml-all { flex: none; font-size: 9.5px; padding: 6px 8px; }
#mgr .ml-list { flex: 1; min-height: 0; overflow-y: auto; padding: 6px; }
#mgr button.ml-row { all: unset; box-sizing: border-box; display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; gap: 10px; align-items: center; width: 100%; padding: 9px 10px 9px 12px; border-radius: 10px; cursor: pointer; position: relative; font-family: var(--f); color: var(--dim); transition: background .18s var(--ease), transform .18s var(--ease); animation: mlIn .34s var(--ease) both; }
#mgr button.ml-row + .ml-row { margin-top: 2px; }
#mgr button.ml-row:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
#mgr button.ml-row.on { background: color-mix(in srgb, var(--ac) 14%, var(--panel2)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ac) 45%, transparent); }
#mgr button.ml-row.un::before { content: ''; position: absolute; left: 3px; top: 50%; width: 5px; height: 5px; margin-top: -2.5px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 8px var(--ac); }
#mgr .ml-m { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
#mgr .ml-top { display: flex; align-items: baseline; gap: 8px; min-width: 0; } #mgr .ml-top b { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 600 12.5px/1.2 var(--f); color: var(--dim); }
#mgr .ml-top em { flex: none; font: 600 10px/1 var(--f); font-style: normal; color: var(--mute); letter-spacing: .04em; }
#mgr .ml-sj { font: 600 12.5px/1.25 var(--f); color: var(--dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#mgr .ml-pv { font: 500 11.5px/1.3 var(--f); color: var(--mute); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#mgr .ml-row.un .ml-top b, #mgr .ml-row.un .ml-sj { color: var(--ink); font-weight: 800; } #mgr .ml-row.on .ml-top b, #mgr .ml-row.on .ml-sj { color: var(--ink); }
#mgr .ml-tg { align-self: start; padding-top: 1px; }
#mgr .ml-av { --c: var(--mute); flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font: 800 11.5px/1 var(--f); font-style: normal; letter-spacing: .04em; color: #fff; background: linear-gradient(140deg, color-mix(in srgb, var(--c) 82%, #fff 4%), color-mix(in srgb, var(--c) 58%, #000)); box-shadow: inset 0 0 0 1px rgba(255,255,255,.16); text-shadow: 0 1px 1px rgba(0,0,0,.35); }
#mgr .ml-av.big { width: 46px; height: 46px; font-size: 15px; }
#mgr .ml-let { flex: 1; min-height: 0; overflow-y: auto; padding: 18px 22px 18px; display: flex; flex-direction: column; animation: mlOpen .3s var(--ease) both; }
#mgr .ml-hd { display: flex; align-items: center; gap: 13px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
#mgr .ml-who { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; } #mgr .ml-who b { font: 800 15px/1.2 var(--f); color: var(--ink); } #mgr .ml-who small { font: 500 11.5px/1.3 var(--f); color: var(--dim); } #mgr .ml-who .ml-to { color: var(--mute); font-size: 10.5px; letter-spacing: .03em; }
#mgr .ml-subj { margin: 16px 0 0; font: 800 21px/1.2 var(--f); letter-spacing: -.01em; color: var(--ink); }
#mgr .ml-re { margin-top: 7px; font: 500 11.5px/1.3 var(--f); color: var(--mute); } #mgr .ml-re q { color: var(--dim); font-style: italic; }
#mgr .ml-body { margin-top: 14px; max-width: 62ch; } #mgr .ml-body p { margin: 0 0 11px; font: 500 13.5px/1.62 var(--f); color: var(--dim); }
#mgr .ml-body .ml-sig { margin-top: 16px; color: var(--ink); font-weight: 700; } #mgr .ml-body .ml-sig::before { content: ''; display: block; width: 26px; height: 2px; margin-bottom: 9px; border-radius: 2px; background: var(--ac); }
#mgr .ml-terms { margin-top: 6px; padding: 10px 14px; max-width: 440px; border-radius: 10px; border: 1px solid var(--line2); background: color-mix(in srgb, var(--ink) 4%, transparent); }
#mgr .ml-acts { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: auto; padding-top: 16px; } #mgr .ml-acts small { margin-left: 6px; font: 600 11px/1.3 var(--f); color: var(--mute); }
#mgr .ml-acts button { padding: 10px 16px; }
#mgr .ml-done { display: flex; gap: 10px; align-items: flex-start; margin-top: auto; padding: 11px 13px; border-radius: 10px; background: color-mix(in srgb, var(--good) 13%, transparent); color: var(--dim); font: 500 12.5px/1.45 var(--f); } #mgr .ml-done b { color: var(--ink); margin-right: 4px; }
#mgr .ml-done i { flex: none; width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; font: 800 11px/1 var(--f); font-style: normal; background: var(--good); color: #06110b; } #mgr .ml-done.no { background: color-mix(in srgb, var(--bad) 13%, transparent); } #mgr .ml-done.no i { background: var(--bad); color: #fff; }
#mgr .ml-trk { --k: .12; position: relative; display: grid; grid-template-columns: 1fr 1fr 1fr; margin-top: 18px; padding-top: 16px; max-width: 520px; }
#mgr .ml-trk::before { content: ''; position: absolute; left: 0; right: 0; top: 4px; height: 3px; border-radius: 3px; background: color-mix(in srgb, var(--ink) 12%, transparent); }
#mgr .ml-trk i { position: absolute; left: 0; top: 4px; height: 3px; width: calc(var(--k) * 100%); border-radius: 3px; background: var(--warn); box-shadow: 0 0 10px var(--warn); transition: width .5s var(--ease); }
#mgr .ml-trk span { font: 800 9.5px/1.3 var(--f); letter-spacing: .12em; text-transform: uppercase; color: var(--mute); } #mgr .ml-trk span.on { color: var(--warn); } #mgr .ml-trk span:nth-of-type(2) { text-align: center; } #mgr .ml-trk span:nth-of-type(3) { text-align: right; }
#mgr button.ml-wait { border-style: dashed; opacity: .8; } #mgr button.ml-wait::before { content: '\\2709\\00a0'; }
@keyframes mlIn { from { opacity: 0; transform: translateX(-6px); } } @keyframes mlOpen { from { opacity: .35; transform: translateY(5px); } }
#mgr[data-tone="vice"] button.ml-row.on { background: linear-gradient(100deg, color-mix(in srgb, var(--ac) 20%, transparent), rgba(155,92,255,.12)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ac) 55%, transparent), 0 0 18px -8px var(--ac); }
#mgr[data-tone="vice"] .ml-terms { background: rgba(155,92,255,.08); border-color: rgba(200,165,255,.18); } #mgr[data-tone="vice"] .ml-subj { text-shadow: 0 0 18px rgba(255,160,215,.28); }
`;
