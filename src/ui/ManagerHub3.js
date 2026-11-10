// The team principal's HQ, its STORY page (ui/ManagerHub.js draws the frame; career/ManagerStory.js is what it shows):
// the matters waiting for you - each to watch as its scene (ui/CineIndex.js) or to decide in a line - the mood (the
// fans, what your word is worth, the feud), your drivers as they are, the other principals, the feed, the rumours, the
// scenes already seen (to watch again), the trophy room and the factory to walk round. And the pump: the scenes that
// play themselves when you come back to the HQ (the story's budget decides which: at most one, unless it cannot wait).
import { inboxOf, archiveOf, storyQueue, storyShown, storyApply, storyLodge, storyRumour, storyEnsure, rivalriesOf, trophiesOf, baseCtx, obeyChance, traitOf, TRAITS } from '../career/ManagerStory.js';
import { STYLES } from '../career/StoryLines.js';

export const STORY_TABS = [['story', 'STORY']];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const bar = (x, col) => `<div class="m-bar" style="--bc:${col || (x > 0.66 ? '#1fae64' : x > 0.4 ? '#e0a100' : '#d4351c')}"><i style="width:${(Math.max(0, Math.min(1, x)) * 100).toFixed(0)}%"></i></div>`;
const note = (t) => `<details class="m-note"><summary>How this works</summary><p>${t}</p></details>`;   // (folded away: the page reads without it)
const SCENE = { feudRow: 'The garage', debrief: 'Your office', poach: 'The paddock', hearing: 'The stewards', scrutineering: 'Scrutineering', audit: 'The auditors', sponsorCall: 'A call', leak: 'The factory, at night', seatFit: 'The garage', crewTalk: 'The garage', press: 'The press room', board: 'The boardroom', launch: 'Launch night', seasonReview: 'A film', documentary: 'A film', factoryTour: 'The factory', garageNight: 'The garage', sacked: 'The boardroom', signing: 'The press room', released: 'Your office' };

function matterHTML(c, m) {
  const due = m.due != null && m.due < 90 ? (m.due <= c.round ? 'Decides itself at the next race' : `Before round ${m.due + 1}`) : '';
  const ops = (m.options || []).map((o) => `<button data-a="stpick" data-v="${esc(m.key)}|${esc(o.id)}" title="${esc(o.hint || '')}">${esc(o.label)}</button>`).join('');
  return `<div class="m-drv" style="align-items:flex-start"><div class="m-nm"><b>${esc(m.title)}</b><small>${esc(m.text || '')}</small><small style="color:#8a93a0">${esc(SCENE[m.scene] || '')}${due ? ` · ${due}` : ''}</small>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${m.pre ? '' : `<button class="m-go" data-a="stwatch" data-v="${esc(m.key)}" style="padding:6px 12px">▶ WATCH</button>`}${ops}</div></div></div>`;
}
export function storyHTML(c, tab) {
  if (tab !== 'story') return null;
  const S = storyEnsure(c), box = inboxOf(c), my = c.seatsOf(c.myTeam), seen = archiveOf(c);
  const inbox = `<div class="m-card" style="grid-column:1/-1"><h3>Waiting for you${box.length ? ` · ${box.length}` : ''}</h3>${box.length ? box.map((m) => matterHTML(c, m)).join('') : note('Nothing. Enjoy it.')}${note('Watch a matter as its scene and answer in it - what you say along the way counts too - or decide it here in a line. Left alone, each decides itself, the cautious way.')}</div>`;
  const mood = `<div class="m-card"><h3>The mood</h3>
    <div class="m-drv"><div class="m-nm"><b>The fans</b><small>${S.fans >= 65 ? 'With you: the stands are full of your colours.' : S.fans >= 40 ? 'Watching. Waiting.' : 'Restless. They have started to boo.'}</small></div><div style="width:38%">${bar(S.fans / 100)}</div></div>
    <div class="m-drv"><div class="m-nm"><b>Your word</b><small>${S.cred >= 65 ? 'The press believe what you tell them.' : S.cred >= 40 ? 'Taken with a pinch of salt.' : 'Nobody writes down what you say any more.'}</small></div><div style="width:38%">${bar(S.cred / 100)}</div></div>
    ${my.length === 2 ? `<div class="m-drv"><div class="m-nm"><b>${esc(my[0].name.split(' ').pop())} and ${esc(my[1].name.split(' ').pop())}</b><small>${S.feud.level >= 70 ? 'At war. They will race each other before anyone else.' : S.feud.level >= 45 ? 'Not speaking. An order may be ignored.' : S.feud.level >= 20 ? 'An edge between them.' : 'Getting on.'}</small></div><div style="width:38%">${bar(1 - S.feud.level / 100)}</div></div>` : ''}
    ${my.map((d) => { const t = TRAITS[traitOf(c, d.id)]; return `<div class="m-drv"><div class="m-nm"><b>${esc(d.name)} · ${esc(t.name)}</b><small>${esc(t.what)} Takes an order: ${Math.round(obeyChance(c, d.id) * 100)}%.</small></div></div>`; }).join('')}</div>`;
  const pri = Object.entries(S.pri).sort((a, b) => b[1].heat - a[1].heat).slice(0, 4), riv = rivalriesOf(c);
  const rivals = `<div class="m-card"><h3>The others</h3>${pri.map(([t, p]) => `<div class="m-drv"><div class="m-nm"><b>${esc(p.name)}</b><small>${esc(t)} · ${esc(STYLES[p.style]?.name || '')}${p.heat >= 40 ? ' · no love lost' : p.heat >= 15 ? ' · needle' : ''}</small></div><div style="width:30%">${bar(1 - p.heat / 100)}</div></div>`).join('')}
    ${riv.length ? `<h3 style="margin-top:14px">On the track</h3>${riv.map((r) => `<div class="m-drv"><div class="m-nm"><b>${esc((r.a || '').split(' ').pop())} v ${esc((r.b || '').split(' ').pop())}</b><small>${r.n} coming-together${r.n === 1 ? '' : 's'}${r.last ? ` · last: ${esc(r.last)}` : ''}</small></div></div>`).join('')}` : ''}</div>`;
  const feed = `<div class="m-card"><h3>The feed</h3>${S.feed.slice(0, 9).map((p) => `<div class="m-drv" style="align-items:flex-start"><div class="m-nm"><b style="font-weight:700">${esc(p.who)} <span style="color:#8a93a0;font-weight:400">${esc(p.h)} · R${p.round}</span></b><small style="color:#2a313c;font-size:13px">${esc(p.text)}</small></div></div>`).join('') || note('Quiet.')}</div>`;
  const rum = `<div class="m-card"><h3>Rumours</h3>${S.rumours.map((r) => `<div class="m-drv" style="align-items:flex-start"><div class="m-nm"><b style="font-weight:600">${esc(r.text)}</b>${r.answered ? `<small>${r.answered === 'deny' ? 'Denied.' : 'Left to run.'}</small>` : `<div style="display:flex;gap:6px;margin-top:6px"><button data-a="strum" data-v="${esc(r.id)}|deny">DENY IT</button><button data-a="strum" data-v="${esc(r.id)}|fuel">LET IT RUN</button></div>`}</div></div>`).join('') || note('Nothing going round. It will, in the second half of the season.')}${note('Deny what is true and it costs your word when it comes out. Let one run and the paddock talks - which is sometimes what you want.')}</div>`;
  const arch = `<div class="m-card"><h3>Scenes</h3><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px"><button class="m-dark" data-a="sttrophy">THE TROPHY ROOM</button><button class="m-dark" data-a="sttour">WALK THE FACTORY</button></div>${seen.slice(0, 10).map((x) => `<div class="m-drv"><div class="m-nm"><b>${esc(x.title)}</b><small>Season ${x.season} · round ${x.round}</small></div><button data-a="stagain" data-v="${esc(x.key)}">▶ AGAIN</button></div>`).join('') || note('The scenes you have watched are kept here.')}</div>`;
  return `<div class="m-grid">${inbox}${mood}${rivals}${feed}${rum}${arch}</div>`;
}
/** on the overview: what is waiting */
export function storyHome(c) {
  const box = inboxOf(c); if (!box.length) return '';
  return `<div class="m-card"><h3>Waiting for you · ${box.length}</h3><div class="m-big">${esc(box[0].title)}</div><p style="font-size:13px;color:#4a5260">${esc(box[0].text || '')}</p><button class="m-go" data-tab="story" style="padding:8px 14px">OPEN STORY →</button></div>`;
}
/** a click on the page: play(scene, ctx) -> Promise<result> shows a scene. -> Promise<a line to say | ''> | undefined (not ours) */
export function storyAct(c, a, v, play) {
  if (!/^st(watch|pick|rum|trophy|tour|again)$/.test(a || '')) return undefined;
  const S = storyEnsure(c);
  const watch = async (m) => { const res = await play(m.scene, m.ctx); if (res?.failed) return storyApply(c, m.key, {}) || 'The scene could not be shown; the matter settled itself.'; storyShown(c, m.key); return storyApply(c, m.key, res || {}); };
  return (async () => {
    if (a === 'stwatch') { const m = S.matters.find((x) => x.key === v && !x.done); return m ? watch(m) : ''; }
    if (a === 'stpick') { const [key, id] = String(v).split('|'), m = S.matters.find((x) => x.key === key && !x.done); if (!m) return ''; if (m.pre && id === 'lodge') { storyLodge(c, key); return watch(m); } return storyApply(c, key, { choice: id }); }
    if (a === 'strum') { const [id, what] = String(v).split('|'); const t = storyRumour(c, id, what); c.save(); return t; }
    if (a === 'sttrophy') { await play('trophies', { ...baseCtx(c), items: trophiesOf(c) }); return ''; }
    if (a === 'sttour') { await play('factoryTour', { ...baseCtx(c), lv: Object.fromEntries(Object.entries(c.fac || {}).map(([k, f]) => [k, f.level])), td: { name: c.staff?.td?.name } }); return ''; }
    if (a === 'stagain') { const x = S.seen.find((q) => q.key === v); if (x) await play(x.scene, x.ctx); return ''; }
    return '';
  })();
}
/** the scenes that play themselves now, one after another -> Promise<[lines]> */
export async function storyPump(c, play) {
  const out = [];
  for (const m of storyQueue(c)) { if (m.done) continue; const res = await play(m.scene, m.ctx); storyShown(c, m.key); const t = storyApply(c, m.key, res?.failed ? {} : res || {}); if (t) out.push(t); }
  return out;
}
