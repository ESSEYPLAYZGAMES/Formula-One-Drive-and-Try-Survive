// What the GPU is given each frame, and what the scene costs the CPU to walk: a race on one circuit (as tools/profile.mjs
// sets it up), the camera behind a car in the field, then
//   - the scene graph: objects, meshes, how many have their matrices recomputed every frame (matrixAutoUpdate), lights
//   - the frame's draw calls and triangles - main pass and shadow pass - by the top-level group they belong to
//   - programs (compiled shaders) and materials, and whether any are created or recompiled while the race runs
//   - textures and geometry held on the GPU (three's renderer.info.memory) and the shadow map
//   node tools/sceneprof.mjs [track] [time: day|night]
import { openGame } from './ai_lib.mjs';

const track = process.argv[2] || 'lasvegas';
const g = await openGame(track);
try {
  await g.page.setViewportSize({ width: 1280, height: 720 });
  const r = await g.page.evaluate(async (time) => {
    const F = window.__F1; Object.assign(F.settings, { grid: 'pick', slot: 12, len: 5, intro: 'off', ...(time ? { time } : {}) });
    F.restart();
    const d = F.S.director; for (let k = 0; k < 60 && !(d.world.racing && d.time - d.world.raceStart > 8); k++) F.stepSim(0.5);
    d.handOver();
    window.requestAnimationFrame = () => 0; await new Promise((res) => setTimeout(res, 300));
    let t = performance.now(); const R = F.renderer, sc = F.scene;
    const frames = (n) => { for (let i = 0; i < n; i++) { t += 1000 / 60; F.frame(t); } };
    frames(30);
    // ---- the scene graph
    let objs = 0, meshes = 0, auto = 0, autoStatic = 0, visMeshes = 0, inst = 0, lights = 0, shadowCasters = 0, skinned = 0, points = 0, lines = 0, sprites = 0;
    sc.traverse((o) => { objs++; if (o.matrixAutoUpdate) auto++; if (o.isMesh) { meshes++; if (o.visible) visMeshes++; if (o.isInstancedMesh) inst++; if (o.castShadow) shadowCasters++; if (o.isSkinnedMesh) skinned++; } if (o.isLight) lights++; if (o.isPoints) points++; if (o.isLine || o.isLineSegments) lines++; if (o.isSprite) sprites++; });
    const top = (o) => { let p = o; while (p.parent && p.parent !== sc) p = p.parent; return (p.name || p.type) + (p.userData?.name ? ':' + p.userData.name : ''); };
    // ---- per draw: the renderer's own calls, intercepted for one frame (main pass and shadow pass apart)
    const per = new Map(); let pass = 'main';
    const rbd = R.renderBufferDirect.bind(R);
    R.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
      const k = (camera.isOrthographicCamera && camera !== F.camera ? 'shadow ' : '') + top(object), e = per.get(k) || { calls: 0, tris: 0, objs: new Set() };
      const idx = geometry.index, count = group ? group.count : idx ? idx.count : geometry.attributes.position?.count || 0;
      const n = Math.min(count, geometry.drawRange.count === Infinity ? count : geometry.drawRange.count) / 3 * (object.isInstancedMesh ? object.count : (geometry.isInstancedBufferGeometry ? geometry.instanceCount : 1));
      e.calls++; e.tris += Math.round(n); e.objs.add(object.name || object.type); per.set(k, e);
      return rbd(camera, scene, geometry, material, object, group);
    };
    const p0 = R.info.programs.length;
    R.info.autoReset = false; R.info.reset(); frames(1); const info = { calls: R.info.render.calls, tris: R.info.render.triangles }; R.info.autoReset = true;
    R.renderBufferDirect = rbd;
    // ---- programs and materials created while the race runs (two seconds of it)
    const mats = new Set(); sc.traverse((o) => { if (o.material) for (const m of [].concat(o.material)) mats.add(m); });
    let getProg = 0; const progs0 = R.info.programs.length;
    frames(120);
    const progs1 = R.info.programs.length;
    const shadowLight = []; sc.traverse((o) => { if (o.isLight && o.castShadow) shadowLight.push(`${o.type} ${o.shadow.mapSize.x}x${o.shadow.mapSize.y}`); });
    return {
      track: F.W.def.id, time: F.W.time, objs, meshes, visMeshes, instanced: inst, autoUpdate: auto, lights, shadowCasters, points, lines, sprites,
      frame: info, programs: { atStart: p0, after2s: progs1, newIn2s: progs1 - progs0 }, materials: mats.size, memory: R.info.memory, shadowLights: shadowLight,
      byGroup: [...per.entries()].sort((a, b) => b[1].tris - a[1].tris).map(([k, e]) => ({ k, calls: e.calls, tris: e.tris, objs: [...e.objs].slice(0, 6).join(',') })),
    };
  }, process.argv[3] || null);
  console.log(`== ${r.track} (${r.time}): objects ${r.objs}, meshes ${r.meshes} (visible ${r.visMeshes}, instanced ${r.instanced}, shadow casters ${r.shadowCasters}), points ${r.points}, lines ${r.lines}, sprites ${r.sprites}, lights ${r.lights}; matrixAutoUpdate ${r.autoUpdate}`);
  console.log(`frame: ${r.frame.calls} draw calls, ${r.frame.tris} triangles; programs ${JSON.stringify(r.programs)}; materials ${r.materials}; memory ${JSON.stringify(r.memory)}; shadow ${r.shadowLights.join(' ')}`);
  console.log('by group (calls, triangles):');
  for (const e of r.byGroup.slice(0, 40)) console.log(`  ${String(e.calls).padStart(5)} ${String(e.tris).padStart(9)}  ${e.k}   [${e.objs}]`);
} finally { await g.close(); }
