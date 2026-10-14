// Pit boxes: one branded garage per team behind the outer pit wall, a painted floor box in the team's colours
// in front of it, and the player's box in a different colour with a floating marker (the HUD cue).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { ribbon } from '../track/TrackBuilder.js';

const F = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';

function tex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
// All box artwork lives in three texture atlases (floor boxes, banners, wall boards) so the whole pit complex is a
// handful of merged meshes instead of one mesh per box (draw calls).
const TILE_W = 256, TILE_H = 512, COLS = 4;   // floor-box tiles in a 4 x 3 atlas
const BAN_W = 1024, BAN_H = 128;               // banner rows
const BRD_W = 192, BRD_H = 128;                // wall-board tiles in a 4 x 3 atlas

/** floor box tile drawn at (ox, oy): team colour frame, dark centre, team name along the lane; the player's box is cyan with their name */
// The tile is 4.4 m across the lane by 8.8 m along it (58 px a metre); the car drives from the tile's top to its
// bottom, and stops with its centre on the middle: the front axle 1.96 m and the rear 1.64 m either side of it.
function boxTile(x, ox, oy, name, color, color2, mine) {
  const W = TILE_W, H = TILE_H, PX = H / 8.8, cx = W / 2, cy = H / 2; x.save(); x.translate(ox, oy);
  const yel = '#f5c400', org = '#ff8a1a';
  // the box: dark painted floor (a touch lighter than the lane), a faint wash of the team's colour at its edges
  x.fillStyle = '#26282d'; x.fillRect(0, 0, W, H);
  const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, color + '33'); g.addColorStop(0.18, 'rgba(0,0,0,0)'); g.addColorStop(0.82, 'rgba(0,0,0,0)'); g.addColorStop(1, color + '33'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  // the two long edge lines, solid, and the short ends
  x.fillStyle = yel; x.fillRect(10, 0, 10, H); x.fillRect(W - 20, 0, 10, H); x.fillRect(10, 0, W - 20, 6); x.fillRect(10, H - 6, W - 20, 6);
  // the chevrons down the middle, pointing the way the car comes in
  x.fillStyle = org;
  for (let k = 0; k < 7; k++) {
    const y0 = 34 + k * 66, w = 34, d = 26, t = 14;
    x.beginPath(); x.moveTo(cx - w, y0); x.lineTo(cx, y0 + d); x.lineTo(cx + w, y0); x.lineTo(cx + w, y0 + t); x.lineTo(cx, y0 + d + t); x.lineTo(cx - w, y0 + t); x.closePath(); x.fill();
  }
  // the wheel marks: a bar across each wheel's track at the front and rear axles (where the crew kneel)
  x.fillStyle = yel;
  for (const ax of [1.96, -1.64]) { const y = cy + ax * PX; for (const s of [-1, 1]) { const wx = cx + s * 0.83 * PX; x.fillRect(wx - 30, y - 4, 60, 8); x.fillRect(wx + s * 30 - (s > 0 ? 0 : 6), y - 18, 6, 36); } }
  // the front jack's spot: a T ahead of the nose
  const ny = cy + 3.45 * PX; x.fillRect(cx - 22, ny, 44, 6); x.fillRect(cx - 3, ny, 6, 22);
  if (mine) { x.strokeStyle = '#00d4ff'; x.lineWidth = 8; x.strokeRect(2, 2, W - 4, H - 4); }   // (yours: a cyan outline)
  // the team's name along the garage side
  x.save(); x.translate(W - 44, cy); x.rotate(-Math.PI / 2); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = mine ? '#00d4ff' : 'rgba(255,255,255,.85)'; x.font = `900 ${mine ? 30 : 26}px ${F}`; x.fillText((mine ? `YOUR BOX · ${name}` : name).toUpperCase(), 0, 0);
  x.restore();
  x.restore();
}
/** garage banner row at oy: team colour band, name, accent stripe */
function bannerRow(x, oy, name, color, color2, k) {
  const W = BAN_W, H = BAN_H; x.save(); x.translate(0, oy);
  x.fillStyle = '#0b0d14'; x.fillRect(0, 0, W, H);
  x.fillStyle = color; x.fillRect(0, 0, W * 0.62, H); x.fillStyle = color2; x.fillRect(W * 0.62, 0, 14, H);
  const lum = 0.299 * parseInt(color.slice(1, 3), 16) + 0.587 * parseInt(color.slice(3, 5), 16) + 0.114 * parseInt(color.slice(5, 7), 16);
  x.fillStyle = lum > 150 ? '#101218' : '#ffffff'; x.font = `900 ${H * 0.5}px ${F}`; x.textBaseline = 'middle'; x.textAlign = 'left';
  x.fillText(name.toUpperCase(), 30, H / 2);
  x.fillStyle = '#ffffff'; x.font = `700 ${H * 0.34}px ${F}`; x.textAlign = 'right'; x.fillText(`GARAGE ${String(k + 1).padStart(2, '0')}`, W - 30, H / 2);
  x.restore();
}
/** remap a PlaneGeometry's uvs (0..1) into an atlas rectangle */
function uvRect(g, u0, v0, u1, v1) { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0)); return g; }
function markerCanvas(label) {
  const W = 512, H = 192, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = 'rgba(0,212,255,0.92)'; x.beginPath(); x.roundRect(20, 10, W - 40, 110, 22); x.fill();
  x.beginPath(); x.moveTo(W / 2 - 34, 118); x.lineTo(W / 2 + 34, 118); x.lineTo(W / 2, 182); x.closePath(); x.fill();
  x.fillStyle = '#04121a'; x.font = `900 62px ${F}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(label, W / 2, 66);
  return tex(c);
}

/**
 * @param pit   pit object from buildPitLane (boxes[k].team is filled here)
 * @param teams [{ name, color, color2 }] in box order; missing entries become "Independent"
 */
export function buildPitBoxes(pit, teams) {
  const group = new THREE.Group(); group.name = 'pitboxes';
  const ps = pit.samples, gs = -pit.trackSide, hw = pit.halfWidth;
  const garageMat = new THREE.MeshStandardMaterial({ color: 0x3a3f4b, roughness: 0.7, metalness: 0.2, emissive: 0x14161c, emissiveIntensity: 1 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.4, emissive: 0xc9d4e6, emissiveIntensity: 1.0 });   // brightly lit open garages at night (dimmed by applyTimeToMaterials in daylight)
  const doors = [], floors = [], banners = [], boards = [];
  const placeAt = (i, g, off, y) => { g.rotateY(Math.atan2(ps.tx[i], ps.tz[i])); g.translate(ps.px[i] + ps.nx[i] * gs * off, y, ps.pz[i] + ps.nz[i] * gs * off); return g; };
  // atlases
  const nBox = pit.boxes.length, rows = Math.ceil(nBox / COLS);
  const floorC = document.createElement('canvas'); floorC.width = TILE_W * COLS; floorC.height = TILE_H * rows; const floorX = floorC.getContext('2d');
  const banC = document.createElement('canvas'); banC.width = BAN_W; banC.height = BAN_H * nBox; const banX = banC.getContext('2d');
  const brdC = document.createElement('canvas'); brdC.width = BRD_W * COLS; brdC.height = BRD_H * rows; const brdX = brdC.getContext('2d');
  const tileRect = (k, w, h, cw, ch) => { const cx = k % COLS, cy = Math.floor(k / COLS); return { ox: cx * w, oy: cy * h, u0: cx * w / cw, u1: (cx + 1) * w / cw, v0: 1 - (cy + 1) * h / ch, v1: 1 - cy * h / ch }; };
  pit.boxes.forEach((b, k) => {
    const team = teams[k] || { name: 'Independent', color: '#00d4ff', color2: '#ffffff' }; b.team = team;
    const i = b.i;
    // painted floor box (working lane, garage side)
    const tr = tileRect(k, TILE_W, TILE_H, floorC.width, floorC.height); boxTile(floorX, tr.ox, tr.oy, team.name, team.color, team.color2, false);
    const fg = new THREE.PlaneGeometry(4.4, 8.8); fg.rotateX(-Math.PI / 2); floors.push(placeAt(i, uvRect(fg, tr.u0, tr.v0, tr.u1, tr.v1), hw - 2.2, 0.016));
    // door opening in the continuous pit building and the team banner above it
    // (planes on the building face look toward the lane (-gs * n); that rotation also makes their text read left-to-right from the lane)
    doors.push(placeAt(i, new THREE.PlaneGeometry(11.5, 3.8).rotateY(-gs * Math.PI / 2), hw + 1.2 - 0.03, 1.95));
    bannerRow(banX, k * BAN_H, team.name, team.color, team.color2, k);
    const bg = uvRect(new THREE.PlaneGeometry(14.8, 1.3), 0, 1 - (k + 1) / nBox, 1, 1 - k / nBox).rotateY(-gs * Math.PI / 2);
    banners.push(placeAt(i, bg, hw + 1.2 - 0.04, 4.35));
    // pit-wall gantry number on the track side (the crew's signal board position)
    const br = tileRect(k, BRD_W, BRD_H, brdC.width, brdC.height);
    brdX.fillStyle = team.color; brdX.fillRect(br.ox, br.oy, BRD_W, BRD_H); brdX.fillStyle = '#fff'; brdX.font = `900 80px ${F}`; brdX.textAlign = 'center'; brdX.textBaseline = 'middle'; brdX.fillText(String(k + 1), br.ox + 96, br.oy + 66);
    const wp = isFinite(pit.wallIn[i]) ? pit.wallIn[i] : pit.wallOff;
    boards.push(placeAt(i, uvRect(new THREE.PlaneGeometry(1.2, 0.8), br.u0, br.v0, br.u1, br.v1).rotateY(gs * Math.PI / 2), -(wp - 0.05), 1.6));
  });
  const floorTex = tex(floorC), banTex = tex(banC), brdTex = tex(brdC);
  const floorMat = new THREE.MeshBasicMaterial({ map: floorTex, transparent: true, opacity: 0.95, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  group.add(new THREE.Mesh(mergeGeometries(floors), floorMat));
  group.add(new THREE.Mesh(mergeGeometries(banners), new THREE.MeshStandardMaterial({ map: banTex, emissive: 0xffffff, emissiveMap: banTex, emissiveIntensity: 0.7, roughness: 0.5 })));
  group.add(new THREE.Mesh(mergeGeometries(boards), new THREE.MeshBasicMaterial({ map: brdTex, side: THREE.DoubleSide })));
  const merge = (gs) => { const g = new THREE.BufferGeometry(); const all = gs.map((x) => x.toNonIndexed()); let pos = [], nrm = [], uv = []; for (const a of all) { pos.push(...a.attributes.position.array); nrm.push(...a.attributes.normal.array); uv.push(...a.attributes.uv.array); } g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); return g; };
  // the pit building: one continuous block following the lane along its whole walled length (front wall, roof,
  // back wall, end caps), so the garages sit shoulder to shoulder like a real pit complex; extra unbranded doors
  // fill the bays beyond the team garages
  const i0 = Math.max(2, pit.wallStartI + 3), i1 = Math.min(ps.n - 3, pit.wallEndI - 3);
  const inB = (i) => i >= i0 && i < i1;
  const fr = hw + 1.2, bk = hw + 1.2 + 6.0, H = 5.4;
  const front = ribbon(ps, () => gs * fr, () => gs * fr, 0, { closed: false, yB: H, mask: inB, uvV: 4 });
  const roof = ribbon(ps, () => gs * fr, () => gs * bk, H, { closed: false, mask: inB, uvV: 4 });
  const backW = ribbon(ps, () => gs * bk, () => gs * bk, 0, { closed: false, yB: H, mask: inB, uvV: 4 });
  const caps = [];
  for (const i of [i0, i1]) { const g = new THREE.PlaneGeometry(6.0, H); g.rotateY(Math.atan2(ps.tx[i], ps.tz[i])); g.translate(ps.px[i] + ps.nx[i] * gs * (fr + 3.0), H / 2, ps.pz[i] + ps.nz[i] * gs * (fr + 3.0)); caps.push(g); }
  garageMat.side = THREE.DoubleSide;
  group.add(new THREE.Mesh(mergeGeometries([front, roof, backW]), garageMat));
  group.add(new THREE.Mesh(merge(caps), garageMat));
  // roof-edge light strip and the row of spotlights over the working lane
  const strip = ribbon(ps, () => gs * (fr - 0.05), () => gs * (fr - 0.05), H - 0.35, { closed: false, yB: H - 0.15, mask: inB });
  group.add(new THREE.Mesh(strip, new THREE.MeshBasicMaterial({ color: 0xfff4dc, side: THREE.DoubleSide })));
  // unbranded doors in the bays outside the team garages
  const pitch = Math.round(pit.boxPitch / ps.ds); const first = pit.boxes[0].i, last = pit.boxes[pit.boxes.length - 1].i;
  for (let i = first - pitch; i > i0 + 4; i -= pitch) doors.push(placeAt(i, new THREE.PlaneGeometry(11.5, 3.8).rotateY(-gs * Math.PI / 2), fr - 0.03, 1.95));
  for (let i = last + pitch; i < i1 - 4; i += pitch) doors.push(placeAt(i, new THREE.PlaneGeometry(11.5, 3.8).rotateY(-gs * Math.PI / 2), fr - 0.03, 1.95));
  group.add(new THREE.Mesh(merge(doors), doorMat));
  // floating marker over the player's box
  const marker = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerCanvas('YOUR BOX'), transparent: true, depthTest: false }));
  marker.scale.set(7, 2.6, 1); marker.visible = false; marker.renderOrder = 10; group.add(marker);
  let mine = -1; let markerBase = null;
  return {
    group, marker,
    /** mark box k as the player's: cyan floor box with their name, marker parked above it */
    setPlayer(k, name) {
      if (mine >= 0) { const t = pit.boxes[mine].team; const r = tileRect(mine, TILE_W, TILE_H, floorC.width, floorC.height); boxTile(floorX, r.ox, r.oy, t.name, t.color, t.color2, false); }
      mine = k; const t = pit.boxes[k].team; const r = tileRect(k, TILE_W, TILE_H, floorC.width, floorC.height);
      boxTile(floorX, r.ox, r.oy, name || t.name, t.color, t.color2, true); floorTex.needsUpdate = true;   // repaint just those atlas tiles
      const f = pit.boxFor(k); markerBase = new THREE.Vector3(f.x, 4.2, f.z); marker.position.copy(markerBase);
    },
    /** show / bob the marker (called every frame with sim time) */
    update(t, visible) {
      marker.visible = visible && markerBase != null;
      if (marker.visible) marker.position.y = markerBase.y + Math.sin(t * 3) * 0.35;
    },
  };
}
