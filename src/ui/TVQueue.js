// The right-hand side of the broadcast as ONE column (the team principal's feed; made after the other graphics, and
// stepped after them). Race control's lines used to hang from the top right and the cards stood up from the bottom
// right, each knowing nothing of the other: with a few of each they ran into one another. Now the lines sit in the
// same column, above the cards, and the column has a budget - the height between the map and the pit wall. Each
// card still decides for itself when it has something to show (its `in` class, as before); this decides which of
// those are up: the most important first - the safety car's card, the pit stop's clock, STRATEGY, the battle, the
// car catching, the info cards - as many as fit, the rest HELD (class qh: folded away as if not asked for) until
// there is room. A card that is up stays up while it is wanted (nothing flickers for a few pixels); a held one comes
// up when room has been there for a second. So some things show together, nothing overlaps, and a new card is not
// pushed in over the others.
// Race control's lines have their own pace (ui/TVGraphics.js rc): two at most, the next no sooner than three and a
// half seconds after the last, a line that has waited ten seconds dropped.
const CSS = `
#tvg .xr > .rc { position: static; align-items: flex-end; margin: 0; }
#tvg .xr > .rc:empty { display: none; }
#tvg.neon .xr > .rc { margin-top: 8px; }
#tvg.neon .xc.in.qh { clip-path: inset(-24px -24px -24px 100%); max-height: 0; margin-top: 0; opacity: 0; pointer-events: none; animation: none; transition: clip-path .3s var(--nx-out), opacity .08s ease .3s, max-height .26s ease .34s, margin-top .26s ease .34s; }
#tvg.neon .xc.in.qh::after { animation: nxEdgeOut .3s var(--nx-out) both; }
`;
const ORDER = ['scc', 'pst', 'stg', '', 'catch', 'inf'];   // ('' : the battle's card has no class of its own)
const rank = (el) => { for (let i = 0; i < ORDER.length; i++) if (ORDER[i] && el.classList.contains(ORDER[i])) return i; return 3; };

export class TVQueue {
  /** root: #tvg (with its .xr column and its .rc lines already made) */
  constructor(root) {
    this.root = root; this.acc = 0; this.room = new Map();
    if (!document.getElementById('tvq-css')) { const st = document.createElement('style'); st.id = 'tvq-css'; st.textContent = CSS; document.head.appendChild(st); }
    this.col = root.querySelector('.xr'); const rc = root.querySelector('.rc');
    if (this.col && rc && rc.parentElement !== this.col) this.col.insertBefore(rc, this.col.firstChild);
    this.rc = rc;
  }
  reset() { this.room.clear(); for (const e of this.col?.querySelectorAll('.xc.qh') || []) e.classList.remove('qh'); }
  update(dt) {
    const col = this.col; if (!col) return; this.acc += dt; if (this.acc < 0.2) return; const step = this.acc; this.acc = 0;
    const R = this.root.getBoundingClientRect(), C = col.getBoundingClientRect(); if (!R.height) return;
    // (the room there is: from under the map - or under the live tag - to the column's foot)
    const map = this.root.querySelector('.map'), mr = map && getComputedStyle(map).display !== 'none' ? map.getBoundingClientRect() : null, top = (mr && mr.height ? mr.top + map.offsetHeight : R.top + 44) + 10;   // (the map at its full size: the column stops short of it, it is never squeezed)
    let left = C.bottom - top - (this.rc ? this.rc.offsetHeight + (this.rc.offsetHeight ? 8 : 0) : 0);
    for (const e of col.children) if (!e.classList.contains('xc') && e !== this.rc && e.offsetHeight) left -= e.offsetHeight + 8;   // (the replay's chip: its room is its own)
    const want = [...col.querySelectorAll('.xc.in')].sort((a, b) => rank(a) - rank(b));
    for (const e of want) {
      const h = e.scrollHeight + 8, held = e.classList.contains('qh');
      if (h <= left) { left -= h; if (held) { const t = (this.room.get(e) || 0) + step; this.room.set(e, t); if (t >= 1) { e.classList.remove('qh'); this.room.delete(e); } } }
      else { this.room.delete(e); if (!held) e.classList.add('qh'); }
    }
    for (const e of col.querySelectorAll('.xc.qh:not(.in)')) { e.classList.remove('qh'); this.room.delete(e); }
  }
}
