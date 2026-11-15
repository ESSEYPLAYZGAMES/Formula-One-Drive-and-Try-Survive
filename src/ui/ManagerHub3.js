// The team principal's HQ, its STORY page (ui/ManagerHub.js draws the frame; career/ManagerStory.js is what it shows):
// the matters waiting for you - each to watch as its scene (ui/CineIndex.js) or to decide in a line - the mood (the
// fans, what your word is worth, the feud), your drivers as they are, the other principals, the feed, the rumours, the
// trophy room (a room to walk round: what the team has won). A scene is seen once, when it happens: there is no list
// of them to play again. And the pump: the scenes that
// play themselves when you come back to the HQ (the story's budget decides which: at most one, unless it cannot wait).
import { inboxOf, storyQueue, storyShown, storyApply, storyAmbient, storyAmbientShown, storyLodge, storyRumour, storyEnsure, rivalriesOf, trophiesOf, baseCtx, obeyChance, traitOf, TRAITS } from '../career/ManagerStory.js';
import { STYLES } from '../career/StoryLines.js';

import { esc, panel, meter, person, tag, empty } from './HQKit.js';
const SCENE = { feudRow: 'The garage', debrief: 'Your office', poach: 'The paddock', hearing: 'The stewards', scrutineering: 'Scrutineering', audit: 'The auditors', sponsorCall: 'A call', leak: 'The factory, at night', seatFit: 'The garage', crewTalk: 'The garage', press: 'The press room', board: 'The boardroom', launch: 'Launch night', seasonReview: 'A film', documentary: 'A film', factoryTour: 'The factory', garageNight: 'The garage', sacked: 'The boardroom', signing: 'The press room', released: 'Your office' };
const HOW = 'A matter comes up in person where it belongs - in the garage, the boardroom, the press room - when you are next there, one at a time; what you say in it counts. Or decide it here in a line. Left alone, each decides itself, the cautious way.';

/** a matter: what it is, where it will come up and by when, and its answers to give here in a line */
function matterHTML(c, m) {
  const due = m.due != null && m.due < 90 ? (m.due <= c.round ? 'decides itself at the next race' : `before round ${m.due + 1}`) : '';
  const ops = (m.options || []).map((o) => `<button data-a="stpick" data-v="${esc(m.key)}|${esc(o.id)}" title="${esc(o.hint || '')}">${esc(o.label)}</button>`).join('');
  return person({ cls: 'top', name: esc(m.title), sub: `${esc(m.text || '')}<br>${tag(esc(SCENE[m.scene] || 'A matter'))}${due ? ` ${tag(due, m.due <= c.round ? 'warn' : '')}` : ''}`, under: ops ? `<div class="q-acts l">${ops}</div>` : '' });
}
/** a mood on a line: its name, what it means now, how full */
const mood = (name, text, x) => person({ name, sub: text, under: meter(x) });
/** INBOX: what is waiting for you down the left (the whole height); the mood and the other principals; the feed and the rumours */
export function storyHTML(c, tab) {
  if (tab !== 'story') return null;
  const S = storyEnsure(c), box = inboxOf(c), my = c.seatsOf(c.myTeam), won = trophiesOf(c);
  const inbox = panel(`Waiting for you${box.length ? ` · ${box.length}` : ''}`, box.length ? box.map((m) => matterHTML(c, m)).join('') : empty('Nothing. Enjoy it.'), { w: 5, h: 2, k: 'inbox', cls: box.length ? 'hero' : '', info: HOW });
  const md = panel('The mood', `${mood('The fans', S.fans >= 65 ? 'With you: the stands are full of your colours.' : S.fans >= 40 ? 'Watching. Waiting.' : 'Restless. They have started to boo.', S.fans / 100)}
    ${mood('Your word', S.cred >= 65 ? 'The press believe what you tell them.' : S.cred >= 40 ? 'Taken with a pinch of salt.' : 'Nobody writes down what you say any more.', S.cred / 100)}
    ${my.length === 2 ? mood(`${esc(my[0].name.split(' ').pop())} and ${esc(my[1].name.split(' ').pop())}`, S.feud.level >= 70 ? 'At war. They will race each other before anyone else.' : S.feud.level >= 45 ? 'Not speaking. An order may be ignored.' : S.feud.level >= 20 ? 'An edge between them.' : 'Getting on.', 1 - S.feud.level / 100) : ''}
    ${my.map((d) => { const t = TRAITS[traitOf(c, d.id)]; return person({ name: `${esc(d.name)} ${tag(esc(t.name), 'ac')}`, sub: `${esc(t.what)} Takes an order: ${Math.round(obeyChance(c, d.id) * 100)}%.` }); }).join('')}`, { w: 4, k: 'mood' });
  const pri = Object.entries(S.pri).sort((a, b) => b[1].heat - a[1].heat).slice(0, 4), riv = rivalriesOf(c);
  const others = panel('The others', `${pri.map(([t, p]) => person({ name: esc(p.name), sub: `${esc(t)} · ${esc(STYLES[p.style]?.name || '')}${p.heat >= 40 ? ' · no love lost' : p.heat >= 15 ? ' · needle' : ''}`, under: meter(1 - p.heat / 100, null, { thin: true }) })).join('')}
    ${riv.map((r) => person({ name: `${esc((r.a || '').split(' ').pop())} v ${esc((r.b || '').split(' ').pop())}`, sub: `${r.n} coming-together${r.n === 1 ? '' : 's'} on track${r.last ? ` · last: ${esc(r.last)}` : ''}` })).join('')}`, { w: 3, k: 'oth', act: `<button class="ghost" data-a="sttrophy" title="${won.length ? `${won.length} on the plinths` : 'The first plinth is waiting'}">TROPHY ROOM${won.length ? ` · ${won.length}` : ''}</button>` });
  const feed = panel('The feed', S.feed.slice(0, 12).map((p) => person({ cls: 'top', name: `${esc(p.who)} <span style="color:var(--mute);font-weight:500">${esc(p.h)} · R${p.round}</span>`, sub: `<span style="color:var(--dim);font-size:12px">${esc(p.text)}</span>` })).join('') || empty('Quiet.'), { w: 4, k: 'feed' });
  const rum = panel('Rumours', S.rumours.map((r) => person({ cls: 'top', name: esc(r.text), sub: r.answered ? (r.answered === 'deny' ? 'Denied.' : 'Left to run.') : '', under: r.answered ? '' : `<div class="q-acts l"><button data-a="strum" data-v="${esc(r.id)}|deny">DENY IT</button><button data-a="strum" data-v="${esc(r.id)}|fuel">LET IT RUN</button></div>` })).join('') || empty('Nothing going round. It will, in the second half of the season.'), { w: 3, k: 'rum', info: 'Deny what is true and it costs your word when it comes out. Let one run and the paddock talks - which is sometimes what you want.' });
  return `<div class="q-g">${inbox}${md}${others}${feed}${rum}</div>`;
}
/** on the overview's NEEDS YOU: what is waiting (the first of them, and how many more) */
export function storyHome(c) {
  const box = inboxOf(c); if (!box.length) return '';
  return person({ cls: 'top', name: `${tag(`Decisions · ${box.length}`, 'ac')} ${esc(box[0].title)}`, sub: esc(box[0].text || ''), act: '<button class="go" data-tab="story">OPEN →</button>' });
}
/** a click on the page: play(scene, ctx) -> Promise<result> shows a scene. -> Promise<a line to say | ''> | undefined (not ours) */
export function storyAct(c, a, v, play) {
  if (!/^st(watch|pick|rum|trophy)$/.test(a || '')) return undefined;
  const S = storyEnsure(c);
  const watch = async (m) => { const res = await play(m.scene, m.ctx); if (res?.failed) return storyApply(c, m.key, {}) || 'The scene could not be shown; the matter settled itself.'; storyShown(c, m.key); return storyApply(c, m.key, res || {}); };
  return (async () => {
    if (a === 'stwatch') { const m = S.matters.find((x) => x.key === v && !x.done); return m ? watch(m) : ''; }
    if (a === 'stpick') { const [key, id] = String(v).split('|'), m = S.matters.find((x) => x.key === key && !x.done); if (!m) return ''; if (m.pre && id === 'lodge') { storyLodge(c, key); return watch(m); } return storyApply(c, key, { choice: id }); }
    if (a === 'strum') { const [id, what] = String(v).split('|'); const t = storyRumour(c, id, what); c.save(); return t; }
    if (a === 'sttrophy') { await play('trophies', { ...baseCtx(c), items: trophiesOf(c) }); return ''; }
    return '';
  })();
}
/** a matter that belongs to the page just opened, coming up there (the story's own budget: storyAmbient) -> Promise<a line | ''> | null: none */
export function storyAmbientPlay(c, tab, play, shownThisVisit) {
  const m = storyAmbient(c, tab, shownThisVisit); if (!m) return null;
  return (async () => { const res = await play(m.scene, m.ctx); if (res?.failed) return ''; storyShown(c, m.key); storyAmbientShown(c); return storyApply(c, m.key, res || {}) || ''; })();
}
/** the scenes that play themselves now, one after another -> Promise<[lines]> */
export async function storyPump(c, play) {
  const out = [];
  for (const m of storyQueue(c)) { if (m.done) continue; const res = await play(m.scene, m.ctx); storyShown(c, m.key); out.n = (out.n || 0) + 1; const t = storyApply(c, m.key, res?.failed ? {} : res || {}); if (t) out.push(t); }
  return out;
}
