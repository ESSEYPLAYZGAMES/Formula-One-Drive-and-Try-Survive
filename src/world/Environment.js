// Sky, lighting rig, ground, fog and PMREM environment with a midnight / midday switch.
import * as THREE from 'three';

function groundTexture(day, style = 'city') {
  const gc = document.createElement('canvas'); gc.width = gc.height = 512; const ctx = gc.getContext('2d');
  if (style === 'park') {
    // Ile Notre-Dame in June: lush, freshly mown parkland grass, clover and a few worn patches
    ctx.fillStyle = day ? '#4f8a35' : '#0e1c0f'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 12000; i++) {
      const g = Math.random();
      ctx.fillStyle = day ? `rgba(${48 + g * 46},${112 + g * 64},${30 + g * 30},0.5)` : `rgba(${14 + g * 14},${32 + g * 26},${14 + g * 12},0.5)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5 + Math.random() * 2.5, 2 + Math.random() * 4);
    }
    for (let i = 0; i < 40; i++) { ctx.fillStyle = day ? 'rgba(120,130,60,0.12)' : 'rgba(30,30,20,0.12)'; ctx.beginPath(); ctx.arc(Math.random() * 512, Math.random() * 512, 6 + Math.random() * 18, 0, 7); ctx.fill(); }
    for (let i = 0; i < 512; i += 24) { ctx.fillStyle = day ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)'; if ((i / 24) % 2) ctx.fillRect(0, i, 512, 24); }
    const t = new THREE.CanvasTexture(gc); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(300, 300); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  if (style === 'texas') {
    // Central Texas in the autumn: mown grass, green near the water lines, gone tan and straw-coloured in the dry
    // patches - and the pale limestone soil showing through
    ctx.fillStyle = day ? '#7d8a4c' : '#141a0f'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 60; i++) { ctx.fillStyle = day ? `rgba(${150 + Math.random() * 40},${140 + Math.random() * 30},${80 + Math.random() * 30},0.22)` : 'rgba(40,38,26,0.2)'; ctx.beginPath(); ctx.arc(Math.random() * 512, Math.random() * 512, 12 + Math.random() * 40, 0, Math.PI * 2); ctx.fill(); }
    for (let i = 0; i < 10000; i++) {
      const g = Math.random(), dry = Math.random() < 0.4;
      ctx.fillStyle = day ? (dry ? `rgba(${150 + g * 50},${138 + g * 40},${78 + g * 30},0.45)` : `rgba(${80 + g * 40},${110 + g * 40},${48 + g * 22},0.5)`) : `rgba(${18 + g * 14},${24 + g * 18},${14 + g * 10},0.5)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5 + Math.random() * 3, 2 + Math.random() * 4);
    }
    for (let i = 0; i < 512; i += 32) { ctx.fillStyle = day ? 'rgba(255,255,240,0.03)' : 'rgba(255,255,255,0.01)'; if ((i / 32) % 2) ctx.fillRect(0, i, 512, 32); }
    const t = new THREE.CanvasTexture(gc); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(240, 240); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  if (style === 'grass') {
    // countryside circuit: mown grass with darker / lighter tufts (no street grid)
    ctx.fillStyle = day ? '#4c7a34' : '#0d1a0e'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      const g = Math.random();
      ctx.fillStyle = day ? `rgba(${50 + g * 50},${105 + g * 60},${35 + g * 30},0.5)` : `rgba(${14 + g * 16},${30 + g * 26},${14 + g * 14},0.5)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 3, 2 + Math.random() * 5);
    }
    for (let i = 0; i < 512; i += 32) { ctx.fillStyle = day ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.012)'; if ((i / 32) % 2) ctx.fillRect(0, i, 512, 32); }   // mowing stripes
    const t = new THREE.CanvasTexture(gc); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(260, 260); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  ctx.fillStyle = day ? '#a89a80' : '#15161c'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = day ? `rgba(${150 + Math.random() * 40},${135 + Math.random() * 35},${105 + Math.random() * 30},0.45)` : `rgba(${40 + Math.random() * 30},${40 + Math.random() * 30},${50 + Math.random() * 30},0.35)`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
  }
  // faint street grid
  ctx.strokeStyle = day ? 'rgba(90,85,80,0.35)' : 'rgba(70,72,90,0.25)'; ctx.lineWidth = 2;
  for (let i = 0; i < 512; i += 128) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke(); }
  const gt = new THREE.CanvasTexture(gc); gt.wrapS = gt.wrapT = THREE.RepeatWrapping; gt.repeat.set(200, 200); gt.colorSpace = THREE.SRGBColorSpace;
  return gt;
}

const PRESETS = {
  night: { top: 0x03040a, horizon: 0x2a1e3a, glow: 0x6a3a5a, sun: 0, stars: 1, sunColor: 0xbfc8ff, sunI: 0.7, sunPos: [-600, 900, 400], hemiSky: 0x9aa0cc, hemiGround: 0x1a1410, hemiI: 0.75, amb: 0x3a3c46, ambI: 0.75, fog: 0x0a0c18, fogD: 0.00035, bg: 0x070812, exposure: 1.1, envI: 0.6 },   // race-night lift: the real event is floodlit bright
  day: { top: 0x2f6fd8, horizon: 0xcfe0f2, glow: 0xfff2d0, sun: 1, stars: 0, sunColor: 0xfff1dc, sunI: 2.6, sunPos: [500, 1100, -300], hemiSky: 0xbfd8ff, hemiGround: 0x9a8a6a, hemiI: 0.9, amb: 0x8fa3c0, ambI: 0.35, fog: 0xc9d6e6, fogD: 0.00016, bg: 0x9ec3ee, exposure: 0.95, envI: 1.0 },
};

export function createEnvironment(scene, renderer) {
  scene.background = new THREE.Color(0x070812);
  scene.fog = new THREE.FogExp2(0x0a0c18, 0.00035);

  const skyGeo = new THREE.SphereGeometry(5200, 32, 16);   // inside the camera's 6000 m far plane; it follows the camera
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x03040a) }, horizon: { value: new THREE.Color(0x2a1e3a) }, glow: { value: new THREE.Color(0x6a3a5a) }, uSun: { value: 0 }, uStars: { value: 1 }, sunDir: { value: new THREE.Vector3(0.4, 0.7, -0.3).normalize() } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 top, horizon, glow, sunDir; uniform float uSun, uStars; varying vec3 vDir;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      void main(){
        float h = clamp(vDir.y, 0.0, 1.0);
        vec3 c = mix(horizon, top, pow(h, 0.45));
        c += glow * exp(-h * 14.0) * 0.9;
        vec2 g = floor(vDir.xz / max(vDir.y, 0.05) * 90.0);
        float st = step(0.995, hash(g)) * smoothstep(0.1, 0.5, h) * uStars;
        c += vec3(st) * 0.7;
        float sd = max(dot(normalize(vDir), sunDir), 0.0);
        c += uSun * (vec3(1.0, 0.95, 0.85) * pow(sd, 900.0) * 6.0 + vec3(1.0, 0.9, 0.7) * pow(sd, 12.0) * 0.35);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  // (drawn after everything solid: three.js orders opaque objects by material before depth, so without this the sky
  // and the ground - most of the screen - were shaded in full and then painted over by the road, the buildings and
  // the cars; drawn last, the depth test skips every hidden pixel of them)
  const sky = new THREE.Mesh(skyGeo, skyMat); sky.name = 'sky'; sky.renderOrder = 2; scene.add(sky);

  const hemi = new THREE.HemisphereLight(0x8a90c0, 0x1a1410, 0.55); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xbfc8ff, 0.7); sun.position.set(-600, 900, 400); scene.add(sun);
  const amb = new THREE.AmbientLight(0x30323a, 0.6); scene.add(amb);

  const groundSets = { city: { night: groundTexture(false), day: groundTexture(true) } };
  let gtNight = groundSets.city.night, gtDay = groundSets.city.day;
  // pushed back in depth: from a helicopter shot the 5 cm between the ground and the road is below depth precision
  const groundMat = new THREE.MeshStandardMaterial({ map: gtNight, roughness: 1, color: 0x8a8a90, polygonOffset: true, polygonOffsetFactor: 4, polygonOffsetUnits: 8 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(12000, 12000), groundMat);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.05; ground.name = 'ground'; ground.renderOrder = 1; scene.add(ground);

  // environment maps (reflections) for both times of day
  const pmrem = new THREE.PMREMGenerator(renderer);
  const makeEnv = (preset) => {
    const envScene = new THREE.Scene();
    const s2 = sky.clone(); s2.material = skyMat.clone(); s2.material.uniforms.top.value = new THREE.Color(preset.top); s2.material.uniforms.horizon.value = new THREE.Color(preset.horizon); s2.material.uniforms.glow.value = new THREE.Color(preset.glow); s2.material.uniforms.uSun.value = preset.sun; s2.material.uniforms.uStars.value = preset.stars;
    envScene.add(s2);
    if (!preset.sun) for (const [c, x, y, z] of [[0xff4488, 0, 80, -400], [0x33ccff, 300, 60, 200], [0xffcc66, -300, 90, 100], [0x9944ff, 100, 50, 400]]) { const m = new THREE.Mesh(new THREE.SphereGeometry(60, 8, 8), new THREE.MeshBasicMaterial({ color: c })); m.position.set(x, y, z); envScene.add(m); }
    return pmrem.fromScene(envScene, 0.04).texture;
  };
  const envNight = makeEnv(PRESETS.night), envDay = makeEnv(PRESETS.day);
  pmrem.dispose();

  const env = { sky, sun, hemi, amb, ground, mode: 'night' };
  env.setTime = (mode) => {
    const p = PRESETS[mode] || PRESETS.night; env.mode = mode;
    skyMat.uniforms.top.value.set(p.top); skyMat.uniforms.horizon.value.set(p.horizon); skyMat.uniforms.glow.value.set(p.glow);
    skyMat.uniforms.uSun.value = p.sun; skyMat.uniforms.uStars.value = p.stars;
    sun.color.set(p.sunColor); sun.intensity = p.sunI; sun.position.set(...p.sunPos);
    skyMat.uniforms.sunDir.value.copy(sun.position).normalize();
    hemi.color.set(p.hemiSky); hemi.groundColor.set(p.hemiGround); hemi.intensity = p.hemiI;
    amb.color.set(p.amb); amb.intensity = p.ambI;
    scene.fog.color.set(p.fog); scene.fog.density = p.fogD; scene.background.set(p.bg);
    scene.environment = mode === 'day' ? envDay : envNight; scene.environmentIntensity = p.envI;
    groundMat.map = mode === 'day' ? gtDay : gtNight; groundMat.color.set(mode === 'day' ? 0xffffff : 0x8a8a90); groundMat.needsUpdate = true;
    renderer.toneMappingExposure = p.exposure;
  };
  /** ground cover per venue: 'city' (sandy lots + street grid) or 'grass' (a countryside circuit) */
  env.setGround = (style) => {
    if (!groundSets[style]) groundSets[style] = { night: groundTexture(false, style), day: groundTexture(true, style) };
    gtNight = groundSets[style].night; gtDay = groundSets[style].day;
    groundMat.map = env.mode === 'day' ? gtDay : gtNight; groundMat.needsUpdate = true;
  };
  env.setTime('night');
  return env;
}

/**
 * Rain: a GPU-animated point cloud that travels with the camera. Streaks are drawn as stretched sprites
 * falling with a slight wind; intensity 0 hides it. Also darkens the sky / raises fog when wet.
 */
export function createRain(scene) {
  const N = 9000, BOX = 90, HGT = 60;
  const pos = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * BOX; pos[i * 3 + 1] = Math.random() * HGT; pos[i * 3 + 2] = (Math.random() - 0.5) * BOX; seed[i] = Math.random(); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    uniforms: { uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uIntensity: { value: 0 }, uWind: { value: new THREE.Vector2(6, 2) } },
    vertexShader: `uniform float uTime, uIntensity; uniform vec3 uCam; uniform vec2 uWind; attribute float seed; varying float vA;
      void main(){
        float speed = 24.0 + seed * 10.0;
        vec3 p = position;
        p.y = mod(p.y - uTime * speed, ${HGT.toFixed(1)});
        p.x = mod(p.x + uTime * uWind.x + uCam.x + ${(BOX / 2).toFixed(1)}, ${BOX.toFixed(1)}) - ${(BOX / 2).toFixed(1)};
        p.z = mod(p.z + uTime * uWind.y + uCam.z + ${(BOX / 2).toFixed(1)}, ${BOX.toFixed(1)}) - ${(BOX / 2).toFixed(1)};
        vec3 world = vec3(uCam.x + p.x, p.y, uCam.z + p.z);
        vA = step(seed, uIntensity) * 0.55;
        vec4 mv = viewMatrix * vec4(world, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp(90.0 / max(1.0, -mv.z), 1.5, 6.0);
      }`,
    fragmentShader: `varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float a = smoothstep(0.5, 0.05, abs(d.x)) * smoothstep(0.5, 0.1, abs(d.y)); if (vA <= 0.0) discard; gl_FragColor = vec4(0.75, 0.82, 0.95, a * vA); }`,
  });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; pts.name = 'rain'; pts.visible = false; scene.add(pts);
  return {
    points: pts,
    setIntensity(i) { mat.uniforms.uIntensity.value = i; pts.visible = i > 0.01; },
    update(camera, dt) { if (!pts.visible) return; mat.uniforms.uTime.value += dt; mat.uniforms.uCam.value.copy(camera.position); },
  };
}

/**
 * Dim / relight emissive materials for the time of day. Stores the night values on first use.
 * ShaderMaterials with uLitProb (window shader) get a daytime window probability; emissive standard
 * materials and unlit glow materials are scaled down in daylight.
 */
export function applyTimeToMaterials(root, mode) {
  const day = mode === 'day';
  root.traverse((o) => {
    if (!o.material) return;
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of ms) {
      if (m.userData.timeSkip) continue;
      if (m.isShaderMaterial && m.uniforms?.uLitProb) {
        if (m.userData.nightLit == null) m.userData.nightLit = m.uniforms.uLitProb.value;
        m.uniforms.uLitProb.value = day ? 0.04 : m.userData.nightLit;
        if (m.uniforms.uDay) m.uniforms.uDay.value = day ? 1 : 0;
        if (m.uniforms.uLightDir) m.uniforms.uLightDir.value.set(day ? 0.45 : -0.5, day ? 0.8 : 0.8, day ? -0.3 : 0.3).normalize();
        if (m.uniforms.uBoost) { if (m.userData.nightBoost == null) m.userData.nightBoost = m.uniforms.uBoost.value; m.uniforms.uBoost.value = day ? 0.3 : m.userData.nightBoost; }
      } else if (m.isMeshStandardMaterial && m.emissiveIntensity > 0 && m.emissive && (m.emissive.r + m.emissive.g + m.emissive.b) > 0.05) {
        if (m.userData.nightEI == null) m.userData.nightEI = m.emissiveIntensity;
        m.emissiveIntensity = day ? m.userData.nightEI * 0.22 : m.userData.nightEI;
      } else if (m.isMeshBasicMaterial && !m.map && !m.wireframe && m.userData.glow !== false) {
        if (!m.userData.nightColor) m.userData.nightColor = m.color.clone();
        m.color.copy(m.userData.nightColor); if (day) m.color.multiplyScalar(0.55);
      }
    }
  });
}
