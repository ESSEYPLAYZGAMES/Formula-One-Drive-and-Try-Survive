// Your own best moments, kept for the loading screen (ui/Loader.js): the pole and winner's shots under the Sphere, the
// build-up's aerial and its crowd, every photo you save in photo mode. want() asks for the next frame drawn; main.js
// renderView() hands the canvas to grab() straight after drawing it (the only moment a WebGL canvas can be read). Kept
// in the browser (IndexedDB), the latest few dozen; nothing leaves the machine.
const DB = 'f1sim-gallery', ST = 'shots', MAX = 40;
let dbp = null;
function db() {
  if (!dbp) dbp = new Promise((res, rej) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(ST, { keyPath: 'id', autoIncrement: true });
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  });
  return dbp;
}
const req = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

export const Gallery = {
  pending: null,
  /** keep the next frame drawn: tag ('pole', 'winner', 'grid', 'crowd', 'photo'), track id, a caption */
  want(tag, track, caption = '') { this.pending = { tag, track, caption, at: Date.now() }; },
  /** (main.js, straight after a frame is drawn) the frame, if one is wanted: scaled down, a JPEG, stored */
  grab(canvas) {
    const p = this.pending; if (!p || !canvas.width) return; this.pending = null;
    try {
      const w = Math.min(1600, canvas.width), h = Math.round(w * canvas.height / canvas.width);
      const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
      x.drawImage(canvas, 0, 0, w, h);
      // (not a frame mid-fade, nor one too dark to read)
      const s = document.createElement('canvas'); s.width = 32; s.height = 18; const sx = s.getContext('2d'); sx.drawImage(c, 0, 0, 32, 18);
      const px = sx.getImageData(0, 0, 32, 18).data; let L = 0; for (let i = 0; i < px.length; i += 4) L += px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11;
      if (L / (px.length / 4) < 14) return;
      c.toBlob((b) => { if (b) this._put({ ...p, w, h, blob: b }).catch(() => {}); }, 'image/jpeg', 0.85);
    } catch (e) { /* (a tainted or lost canvas: no shot) */ }
  },
  async _put(rec) {
    const d = await db(), tx = d.transaction(ST, 'readwrite'), st = tx.objectStore(ST);
    st.add(rec);
    const keys = await req(st.getAllKeys());
    for (const k of keys.slice(0, Math.max(0, keys.length + 1 - MAX))) st.delete(k);   // (the oldest go)
    return new Promise((res) => { tx.oncomplete = res; tx.onerror = res; });
  },
  /** every shot kept, newest first: [{ url (an object URL), tag, track, caption, at }] */
  async list() {
    try {
      const d = await db(), all = await req(d.transaction(ST).objectStore(ST).getAll());
      return all.reverse().map((r) => ({ url: URL.createObjectURL(r.blob), tag: r.tag, track: r.track, caption: r.caption, at: r.at }));
    } catch (e) { return []; }
  },
};
