// The driver career's MAIL page (ui/CareerHub.js routes to it; career/DriverMail.js is what it shows) - the team
// principal's mail client (ui/ManagerMail.js) on the driver's hub: the list down the left, the letter that is open on
// the right - who, when, what they say, the terms on a card - and, where something is to be done, the button to the
// page where it is done.
import { dmailEnsure, dmailRead, dmailUnread } from '../career/DriverMail.js';
import { esc, panel, tag, kv, empty } from './HQKit.js';

const ini = (n) => { const w = String(n || '?').replace(/^The\s+/i, '').replace(/[^\p{L}\s']/gu, ' ').trim().split(/\s+/); return ((w[0]?.[0] || '?') + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase(); };
const av = (name, col, big) => `<i class="ml-av${big ? ' big' : ''}"${col ? ` style="--c:${esc(col)}"` : ''}>${esc(ini(name))}</i>`;
const when = (m) => `Round ${m.round} · ${m.season}`;
const chip = (m) => (m.tag === 'offer' ? tag('Offer', 'ac') : m.tag === 'report' ? tag('Report') : m.good === false ? tag('Note', 'bad') : tag('Note'));

function letter(m) {
  const go = m.go?.length ? `<div class="ml-acts">${m.go.map((g, i) => `<button class="${i ? 'ghost' : 'go'}" data-tab="${esc(g.tab)}" data-sub="${esc(g.sub || '')}">${esc(g.label)} →</button>`).join('')}</div>` : '';
  return `<article class="ml-let" data-k="mlread"><header class="ml-hd">${av(m.from, m.col, true)}<div class="ml-who"><b>${esc(m.from)}</b><small>${esc(m.org || '')}</small><small class="ml-to">to you · ${esc(when(m))}</small></div><span>${chip(m)}</span></header>
    <h2 class="ml-subj">${esc(m.subj)}</h2>
    <div class="ml-body">${(m.body || []).map((p) => `<p>${esc(p)}</p>`).join('')}<p class="ml-sig">${esc(m.from)}</p></div>
    ${m.terms?.length ? `<div class="ml-terms">${m.terms.map(([k, v]) => kv(esc(k), esc(v))).join('')}</div>` : ''}${go}</article>`;
}

/** the page: S.sel the open mail (else the newest) */
export function dmailHTML(c, S = {}) {
  const M = dmailEnsure(c), box = M.box, un = dmailUnread(c);
  const cur = box.find((m) => m.id === S.sel) || box[0] || null;
  if (cur) dmailRead(c, cur.id);
  const rows = box.map((m) => `<button class="ml-row${m === cur ? ' on' : ''}${m.read && m !== cur ? '' : m === cur ? '' : ' un'}" data-dmail="${esc(m.id)}">${av(m.from, m.col)}<span class="ml-m"><span class="ml-top"><b>${esc(m.from)}</b><em>${esc(`R${m.round}`)}</em></span><span class="ml-sj">${esc(m.subj)}</span><span class="ml-pv">${esc((m.body || [])[0] || '')}</span></span>${m.tag === 'offer' ? tag('Offer', 'ac') : ''}</button>`).join('');
  const bar = `<div class="ml-bar"><b>Inbox${un ? ` · ${un} unread` : ''}</b>${un > 1 ? '<button class="ghost ml-all" data-dmailall="1">MARK ALL READ</button>' : ''}</div>`;
  return `<div class="q-g dm-g">${panel('Mail', `${bar}<div class="ml-list" data-k="mllist">${rows || empty('Nothing yet.')}</div>`, { w: 5, scroll: false, k: 'mllist' })}${panel(cur ? esc(cur.org || 'Mail') : 'Mail', cur ? letter(cur) : empty('No mail.'), { w: 7, scroll: false })}</div>`;
}
