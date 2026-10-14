// GPU timing helpers for the browser console (dev only, not part of the game or the bundle):
//   await import('/tools/perfkit.js'); await __pk.vegas(); __pk.pose(5); __pk.mm()
// mm(): the best of 5 batches of 6 synced renders (readPixels waits for the GPU), in ms, at a fixed 1200 x 640.
const F = window.__F1;
const px = new Uint8Array(4);
window.__pk = {
  async vegas(time = 'night') {
    if (!F.W.track || F.W.def?.id !== 'lasvegas') { F.switchTrack('lasvegas'); let n = 0; while ((!F.W.track || F.W.loading) && n++ < 200) await new Promise((r) => setTimeout(r, 250)); }
    if (F.W.time !== time) F.setTimeOfDay(time);
    await import('/tools/harness.js'); window.__race.start(10);
    for (const c of F.S.director.cars) if (c.isPlayer) c.ghost = 0;
    F.S.paused = true; this.size(); return F.W.def.id;
  },
  size(w = 1200, h = 640) { const R = F.renderer; R.setPixelRatio(1); R.setSize(w, h, false); F.camera.aspect = w / h; F.camera.updateProjectionMatrix(); },
  /** behind the k-th AI car in the running order */
  pose(k = 5, back = 9, h = 3.2) {
    const d = F.S.director, c = d.cars.filter((c) => !c.isPlayer).sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.id - b.id)[k], th = c.th;
    F.camera.position.set(c.x - Math.cos(th) * back, h, c.z - Math.sin(th) * back); F.camera.lookAt(c.x + Math.cos(th) * 20, 0.5, c.z + Math.sin(th) * 20); F.camera.updateMatrixWorld();
    F.W.lights?.update(F.camera.position, 1); for (const m of F.S.meshes?.values?.() || []) m.detail?.(F.camera.position);
    return c.name;
  },
  at(x, y, z, lx, ly, lz) { F.camera.position.set(x, y, z); F.camera.lookAt(lx, ly, lz); F.camera.updateMatrixWorld(); F.W.lights?.update(F.camera.position, 1); },
  mm() {
    const R = F.renderer, gl = R.getContext(), sc = F.scene;
    R.render(sc, F.camera); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let best = 1e9; for (let b = 0; b < 5; b++) { const t = performance.now(); for (let i = 0; i < 6; i++) { R.render(sc, F.camera); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); } best = Math.min(best, (performance.now() - t) / 6); }
    return +best.toFixed(2);
  },
  /** GPU time of one render (timer query: unaffected by the page being hidden), the median of n, in ms */
  async gpu(n = 7) {
    const R = F.renderer, gl = R.getContext(), ext = gl.getExtension('EXT_disjoint_timer_query_webgl2'); if (!ext) return null;
    R.render(F.scene, F.camera);
    const qs = [];
    for (let i = 0; i < n; i++) { const q = gl.createQuery(); gl.beginQuery(ext.TIME_ELAPSED_EXT, q); R.render(F.scene, F.camera); gl.endQuery(ext.TIME_ELAPSED_EXT); qs.push(q); }
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const out = [];
    for (const q of qs) {
      let k = 0; while (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE) && k++ < 100) await new Promise((r) => setTimeout(r, 5));
      if (gl.getParameter(ext.GPU_DISJOINT_EXT)) return 'disjoint';
      out.push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6); gl.deleteQuery(q);
    }
    out.sort((a, b) => a - b); return +out[out.length >> 1].toFixed(2);
  },
  calls() { const R = F.renderer; R.info.autoReset = false; R.info.reset(); R.render(F.scene, F.camera); const c = R.info.render.calls; R.info.autoReset = true; return c; },
  /** show the current view as a still over the page (for the pane's screenshot) */
  shot(label = '') {
    const R = F.renderer; R.render(F.scene, F.camera); const url = R.domElement.toDataURL('image/jpeg', 0.9);
    let o = document.getElementById('__ov');
    if (!o) { o = document.createElement('div'); o.id = '__ov'; o.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font:14px sans-serif'; o.onclick = () => (o.style.display = 'none'); document.body.appendChild(o); }
    o.innerHTML = `<div>${label}</div><img src="${url}" style="max-width:100%;max-height:95%">`; o.style.display = 'flex'; return 'shown';
  },
  /** render the current view and save it as <name>.jpg via the local screenshot server (port 8768) */
  save(name) { const R = F.renderer; R.render(F.scene, F.camera); return fetch('http://127.0.0.1:8768/save?name=' + name, { method: 'POST', body: R.domElement.toDataURL('image/jpeg', 0.88) }).then((r) => r.text()); },
  hide() { const o = document.getElementById('__ov'); if (o) o.style.display = 'none'; },
};
