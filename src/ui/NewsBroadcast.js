// The news, after a race in which a driver was badly hurt: a TV news broadcast plays over the circuit as it was left,
// before the memorial card. Nobody knows anything yet, and the coverage assumes the worst:
//   breaking   - BREAKING NEWS over a live aerial shot of the wreck;
//   warning    - the broadcaster's warning before distressing footage;
//   phone      - a spectator's phone footage of the crash, filmed from the grandstand nearest to it (the accident's
//                replay, race/Replay.js): vertical 9:16 video the way the news shows it - the same picture enlarged,
//                blurred and dimmed behind it - shaky, chasing the car with a lag, pinch-zoomed, hunting for focus;
//                then the impact again, slowed, from a second phone somewhere else. Each phone has its own flaws (an
//                old one: blocky and noisy; a new one: sharp but overexposed; one in poor light: grainy; one on full
//                digital zoom: soft; a good one, just shaky) - and most go to pieces after the impact, the stand
//                erupting around them: the shot lost to the sky, the ground, the crowd, a head in front, nothing in
//                focus;
//   analysis   - the world feed's own replay from a trackside camera, slowed, frozen at the moment it went wrong with
//                a telestrator ring, while the pundits speculate about the cause and the driver's condition;
//   aerial     - the helicopter's replay, circling high above;
//   onboard    - the T-cam of a car that saw it happen, then the crashed car's own: rolling with the car, freezing
//                and stuttering only on the hard hits (the physics' own crash pulses), the signal lost for a moment
//                on the very hardest;
//   headlines  - the papers and the websites: critical condition, airlifted, "we fear the worst";
//   interviews - in front of the team's garage: the team principal, then a fellow driver;
//   prayers    - flowers and candles laid in front of the team's garage, the team standing by; messages from fans,
//                the team, a fellow driver;
//   silence    - the grid: the drivers in their race suits on one knee in a line across it, the teams standing behind
//                with their heads bowed, the marshals at the side (3D people: world/People.js).
// Several drivers hurt: each accident gets its own footage and analysis, each driver an onboard and an interview, and
// the headlines, the posts, the prayers and the silence are shared equally between them. The words are drawn from
// pools - headlines with the g each one took, other drivers caught up in it, the race itself on the ticker - so no two
// broadcasts read the same.
// Skippable (SKIP, Enter, Esc). The broadcaster, the pundits and the papers are made up; the drivers and teams are
// the game's, the team principals are not named.
import { makePerson, makeMic, makePhone, makeArm } from '../world/People.js';
import { tribute } from '../world/Tribute.js';
const CSS = `
#news { position: fixed; inset: 0; z-index: 55; pointer-events: none; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #fff; overflow: hidden; }
#news .bug { position: absolute; left: 3.2vw; top: 4vh; display: flex; align-items: stretch; height: 34px; box-shadow: 0 2px 10px rgba(0,0,0,.5); transition: opacity .3s; }
#news .bug b { background: #c8102e; padding: 0 12px; display: flex; align-items: center; font: 800 17px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .04em; }
#news .bug i { background: rgba(10,12,18,.88); padding: 0 12px; display: flex; align-items: center; gap: 8px; font: 700 13px/1 'Segoe UI', Arial, sans-serif; font-style: normal; letter-spacing: .14em; }
#news .bug i::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: #ff2a2a; animation: newsLive 1.2s ease-in-out infinite; }
#news .bug.footage i::before { display: none; }
#news .confirm, #news .family { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: rgba(0,0,0,.92); opacity: 0; transition: opacity 1.4s ease; padding: 0 12vw; }
#news .confirm.in, #news .family.in { opacity: 1; }
#news .confirm small, #news .family small { font: 800 13px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .4em; color: #c8102e; margin-bottom: 26px; }
#news .confirm h1 { font: 400 clamp(34px, 5vw, 64px)/1.1 Georgia, 'Times New Roman', serif; letter-spacing: .06em; margin: 0 0 22px; color: #f1f1f1; }
#news .confirm p { font: 400 clamp(15px, 1.6vw, 20px)/1.7 Georgia, serif; color: #b9b9b9; max-width: 820px; margin: 0; }
#news .family .lines p { font: italic 400 clamp(17px, 1.9vw, 24px)/1.65 Georgia, serif; color: #e6e2d9; margin: 0 0 18px; opacity: 0; transform: translateY(8px); transition: opacity 1.4s ease, transform 1.4s ease; max-width: 860px; }
#news .family .lines p.in { opacity: 1; transform: none; }
#news .family em { font: 400 14px/1 Georgia, serif; color: #8d8a83; letter-spacing: .12em; margin-top: 10px; font-style: normal; }
#news .place { position: absolute; right: 3.2vw; top: 4vh; font: 700 13px/34px 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; background: rgba(10,12,18,.75); padding: 0 12px; }
#news .lower { position: absolute; left: 3.2vw; right: 3.2vw; bottom: calc(5vh + 36px); transform: translateX(-110%); transition: transform .55s cubic-bezier(.2,.8,.2,1); }
#news .lower.in { transform: none; }
#news .lower .tab { display: inline-block; background: #c8102e; font: 800 14px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; padding: 7px 12px; }
#news .lower .main { background: #f4f4f2; color: #0b0d12; font: 800 clamp(18px, 2.6vw, 34px)/1.15 'Segoe UI', Arial, sans-serif; padding: 10px 16px; text-transform: uppercase; letter-spacing: .01em; }
#news .lower .sub { background: rgba(10,12,18,.9); font: 600 clamp(12px, 1.25vw, 16px)/1 'Segoe UI', Arial, sans-serif; padding: 9px 16px; letter-spacing: .06em; text-transform: uppercase; }
#news .ticker { position: absolute; left: 0; right: 0; bottom: 5vh; height: 36px; background: #0b0d12; display: flex; align-items: center; overflow: hidden; border-top: 2px solid #c8102e; }
#news .ticker b { flex: none; height: 100%; display: flex; align-items: center; background: #c8102e; padding: 0 14px; font: 800 13px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; z-index: 1; }
#news .ticker span { white-space: nowrap; padding-left: 100%; font: 600 15px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .03em; animation: newsTick 55s linear infinite; }
#news .cc { position: absolute; left: 50%; bottom: calc(5vh + 150px); transform: translateX(-50%); max-width: min(900px, 80vw); background: rgba(0,0,0,.82); font: 600 clamp(13px, 1.3vw, 18px)/1.35 Consolas, 'Courier New', monospace; padding: 6px 10px; text-transform: uppercase; opacity: 0; transition: opacity .2s; }
#news .cc.in { opacity: 1; }
#news .warn { position: absolute; inset: 0; background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; opacity: 0; transition: opacity .25s; text-align: center; padding: 0 10vw; }
#news .warn.in { opacity: 1; }
#news .warn b { font: 800 clamp(18px, 2.2vw, 28px)/1 'Segoe UI', Arial, sans-serif; letter-spacing: .3em; color: #ffcf33; }
#news .warn p { font: 500 clamp(15px, 1.6vw, 21px)/1.5 'Segoe UI', Arial, sans-serif; color: #ddd; margin: 0; max-width: 760px; }
#news .tag { position: absolute; left: 50%; top: 12vh; transform: translateX(-50%); font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .22em; background: rgba(0,0,0,.6); padding: 6px 10px; opacity: 0; transition: opacity .3s; }
#news .tag.in { opacity: 1; }
#news .cards { position: absolute; inset: 0; }
#news .paper { position: absolute; width: min(460px, 38vw); background: #f3f0e8; color: #111; padding: 14px 18px 16px; box-shadow: 0 18px 40px rgba(0,0,0,.6); opacity: 0; transform: translateY(40px) scale(.96) rotate(var(--r)); transition: opacity .5s, transform .6s cubic-bezier(.2,.8,.2,1), filter .6s; }
#news .paper.in { opacity: 1; transform: rotate(var(--r)); }
#news .paper.back { opacity: .5; filter: blur(1.5px) brightness(.7); transform: scale(.94) rotate(var(--r)); }
#news .paper .mast { font: 800 11px/1 Georgia, 'Times New Roman', serif; letter-spacing: .28em; border-bottom: 2px solid #111; padding-bottom: 7px; margin-bottom: 9px; display: flex; justify-content: space-between; }
#news .paper .mast em { font-style: normal; color: #c8102e; }
#news .paper h2 { font: 900 clamp(22px, 2.5vw, 34px)/1.05 Georgia, 'Times New Roman', serif; margin: 0 0 8px; text-transform: uppercase; }
#news .paper p { font: 400 14px/1.4 Georgia, 'Times New Roman', serif; margin: 0; color: #333; }
#news .paper.web { background: #fff; font-family: 'Segoe UI', Arial, sans-serif; }
#news .paper.web .mast { font-family: 'Segoe UI', Arial, sans-serif; border-bottom-color: #c8102e; }
#news .paper.web h2 { font-family: 'Segoe UI', Arial, sans-serif; font-weight: 800; text-transform: none; }
#news .posts { position: absolute; left: 0; right: 0; top: 13vh; bottom: calc(5vh + 140px); display: flex; justify-content: center; gap: 2vw; }
#news .col { width: min(400px, 34vw); display: flex; flex-direction: column; justify-content: flex-end; gap: 12px; }
#news .post { background: rgba(250,250,252,.96); color: #0f1419; border-radius: 14px; padding: 12px 14px; display: flex; gap: 10px; box-shadow: 0 10px 28px rgba(0,0,0,.45); opacity: 0; transform: translateY(30px); transition: opacity .5s, transform .5s cubic-bezier(.2,.8,.2,1); }
#news .post.in { opacity: 1; transform: none; }
#news .post .av { flex: none; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font: 800 15px/1 'Segoe UI', Arial, sans-serif; color: #fff; }
#news .post .who { font: 700 14px/1.2 'Segoe UI', Arial, sans-serif; }
#news .post .who span { font-weight: 400; color: #536471; }
#news .post .who .v { display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: #1d9bf0; color: #fff; font-size: 10px; line-height: 14px; text-align: center; margin-left: 3px; vertical-align: 1px; }
#news .post .txt { font: 400 15px/1.35 'Segoe UI', Arial, sans-serif; margin-top: 3px; }
#news .tele { position: absolute; inset: 0; opacity: 0; transition: opacity .25s; }
#news .tele.in { opacity: 1; }
#news .tele circle { stroke-dasharray: 400; stroke-dashoffset: 400; filter: drop-shadow(0 0 4px rgba(0,0,0,.6)); }
#news .tele.in circle { animation: newsDraw .6s ease-out forwards; }
@keyframes newsDraw { to { stroke-dashoffset: 0; } }
#news .silence { position: absolute; left: 0; right: 0; top: 16vh; text-align: center; opacity: 0; transition: opacity 1.8s; }
#news .silence.in { opacity: 1; }
#news .silence b { display: block; font: 300 clamp(26px, 3.6vw, 52px)/1 Georgia, 'Times New Roman', serif; letter-spacing: .3em; }
#news .silence span { display: block; margin-top: 16px; font: 400 clamp(14px, 1.5vw, 20px)/1.5 Georgia, 'Times New Roman', serif; color: #d6d6d6; font-style: italic; }
#news .skip { position: absolute; right: 3.2vw; top: calc(4vh + 46px); pointer-events: auto; background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.35); color: #ddd; font: 700 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .25em; padding: 8px 12px; cursor: pointer; }
#news .skip:hover { color: #fff; border-color: #fff; }
#news .hide { opacity: 0 !important; }
#news .ob { position: absolute; left: 3.2vw; top: calc(4vh + 46px); display: flex; align-items: stretch; height: 30px; opacity: 0; transition: opacity .3s; box-shadow: 0 2px 10px rgba(0,0,0,.5); }
#news .ob.in { opacity: 1; }
#news .ob .st { width: 6px; }
#news .ob b { background: rgba(10,12,18,.88); display: flex; align-items: center; padding: 0 12px; font: 800 15px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; }
#news .ob i { background: #f4f4f2; color: #0b0d12; display: flex; align-items: center; padding: 0 10px; font: 800 11px/1 'Segoe UI', Arial, sans-serif; font-style: normal; letter-spacing: .2em; }
#news .lost { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; opacity: 0; }
#news .lost.in { opacity: 1; }
#news .lost b { font: 700 clamp(18px, 2.2vw, 30px)/1 Consolas, 'Courier New', monospace; letter-spacing: .35em; color: #e8e8e8; }
#news .lost span { font: 600 12px/1 Consolas, 'Courier New', monospace; letter-spacing: .25em; color: #9a9a9a; }
@keyframes newsLive { 50% { opacity: .25; } }
@keyframes newsTick { to { transform: translateX(-100%); } }
`;
/** the phones: their pictures' flaws (compression block size, sensor noise, softness, colour, exposure, blown highlights, digital zoom) */
// (shake: the hands' tremor; chaos: how completely the filming falls apart after the impact, 0 - 1)
const PHONES = [
  { id: 'old', block: 4, grain: 0.07, defocus: 0.0025, sat: 0.72, expo: 1.0, clip: 0, tint: [1.03, 1.0, 0.9], zoom: 1, shake: 1, chaos: 0.9 },
  { id: 'new', block: 1, grain: 0.02, defocus: 0.0008, sat: 1.08, expo: 1.45, clip: 0.55, tint: [1.0, 1.0, 1.05], zoom: 1, shake: 1, chaos: 1 },
  { id: 'grainy', block: 2, grain: 0.11, defocus: 0.002, sat: 0.85, expo: 0.85, clip: 0, tint: [1.06, 0.98, 0.88], zoom: 1, shake: 1.1, chaos: 0.85 },
  { id: 'zoomed', block: 3, grain: 0.05, defocus: 0.0035, sat: 0.85, expo: 1.1, clip: 0.15, tint: [1.0, 1.0, 0.96], zoom: 1.8, shake: 1, chaos: 0.95 },
  { id: 'fine', block: 1.5, grain: 0.035, defocus: 0.0012, sat: 1.0, expo: 1.05, clip: 0, tint: [1.0, 1.0, 1.0], zoom: 1, shake: 1.7, chaos: 0.25 },
];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// the picture: a TV grade, or (phone) a spectator's vertical video the way the news shows it - pillarboxed by its own
// picture, enlarged, blurred and dimmed - soft, blocky with compression, noisy
const SHADER = {
  uniforms: { tDiffuse: { value: null }, uRes: { value: null }, uTime: { value: 0 }, uPhone: { value: 0 }, uDefocus: { value: 0 }, uBlock: { value: 6 }, uSat: { value: 1 }, uExpo: { value: 1 }, uGrain: { value: 0.03 }, uVig: { value: 0.4 }, uFade: { value: 0 }, uClip: { value: 0 }, uTint: { value: null }, uOcc: { value: 0 }, uOccX: { value: 0.5 }, uGlitch: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uTime, uPhone, uDefocus, uBlock, uSat, uExpo, uGrain, uVig, uFade, uClip, uOcc, uOccX, uGlitch; uniform vec3 uTint; varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    vec3 soft(vec2 uv, float r) {
      vec3 c = texture2D(tDiffuse, uv).rgb; if (r <= 0.0) return c;
      float rot = hash(gl_FragCoord.xy) * 6.2832;   // (the taps turned per pixel: a fine grain instead of streaks)
      for (int i = 0; i < 16; i++) { float a = float(i) * 2.39996 + rot, rr = r * sqrt((float(i) + 0.5) / 16.0); c += texture2D(tDiffuse, uv + vec2(cos(a) * uRes.y / uRes.x, sin(a)) * rr).rgb; }
      return c / 17.0;
    }
    void main() {
      vec2 uv = vUv; vec3 col;
      if (uPhone > 0.5) {
        float hw = 0.5 * (9.0 / 16.0) * uRes.y / uRes.x;   // half the phone picture's width, in screen uv
        if (abs(uv.x - 0.5) > hw) {
          col = soft(0.5 + (uv - 0.5) * (2.0 * hw), 0.07) * 0.38;   // the sides: the same picture, enlarged to cover, blurred, dimmed
        } else {
          vec2 blk = vec2(uBlock) / uRes, q = (floor(uv / blk) + 0.5) * blk;
          col = soft(mix(uv, q, 0.55), uDefocus);
          col += (hash(floor(uv * uRes / 2.0) + fract(uTime) * 91.0) - 0.5) * uGrain;
          col = mix(col, vec3(dot(col, vec3(0.33))), 0.12) * uTint;   // the phone's own colour
          // someone in the row in front: a dark, out-of-focus head and shoulders rising into the bottom of the picture
          float occ = uOcc * smoothstep(0.42, 0.18, length((uv - vec2(uOccX, -0.12)) * vec2(uRes.x / uRes.y * 1.4, 1.0)));
          col = mix(col, vec3(0.035, 0.03, 0.03), occ);
          col *= smoothstep(hw, hw - 0.003, abs(uv.x - 0.5));
        }
      } else {
        if (uGlitch > 0.0) {
          // a feed breaking up: bands of the picture torn sideways, frozen macroblocks, the colours split
          float f = floor(uTime * 18.0), band = floor(uv.y * 22.0);
          if (hash(vec2(band, f)) < uGlitch * 0.55) uv.x += (hash(vec2(band, f + 3.0)) - 0.5) * 0.18 * uGlitch;
          vec2 mb = vec2(16.0 + 40.0 * uGlitch) / uRes, cell = floor(uv / mb);
          if (hash(cell + f) < uGlitch * 0.5) uv = (cell + 0.5) * mb;
          float s = 0.008 * uGlitch;
          col = vec3(texture2D(tDiffuse, uv + vec2(s, 0.0)).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - vec2(s, 0.0)).b);
        } else col = soft(uv, uDefocus);
        col += (hash(uv * uRes + fract(uTime) * 57.0) - 0.5) * uGrain;
      }
      col *= uExpo;
      if (uClip > 0.0) { float b = dot(col, vec3(0.333)); col = mix(col, vec3(1.0), smoothstep(0.35, 0.95, b) * uClip) + 0.06 * uClip; }   // overexposed: the highlights blown out
      float l = dot(col, vec3(0.299, 0.587, 0.114)); col = mix(vec3(l), col, uSat);
      float v = smoothstep(1.15, 0.35, length((uv - 0.5) * vec2(uRes.x / uRes.y, 1.0))); col *= mix(1.0, v, uVig);
      gl_FragColor = vec4(max(col * (1.0 - uFade), 0.0), 1.0);
    }`,
};

const pick = (a) => a[(Math.random() * a.length) | 0];
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const andList = (a) => (a.length < 2 ? a[0] || '' : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const NUM = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
const MASTS = ['THE PADDOCK POST', 'GRID DAILY', 'MOTORSPORT WIRE', 'RACING TIMES', 'THE SUNDAY GRID', 'APEX NEWS', 'PIT LANE GAZETTE', 'CHEQUERED FLAG'];
const TAGS = ['LATE EDITION', 'LIVE', 'BREAKING', 'UPDATE', 'FRONT PAGE', 'EXCLUSIVE'];
const FANS = [['Lou', '@lap1_lou', '#7b61ff'], ['Ana', '@apex_ana', '#e0457b'], ['Pete', '@pitwall_pete', '#18a957'], ['Kat', '@kerb_kat', '#f08c00'], ['Sam', '@slipstream_sam', '#2f80ed'],
  ['Jo', '@dirtyair_jo', '#9b51e0'], ['Raf', '@drs_raf', '#eb5757'], ['Mia', '@boxbox_mia', '#27ae60'], ['Theo', '@undercut_theo', '#f2994a'], ['Nina', '@sector3_nina', '#56ccf2']];

/**
 * The medical update for a driver hurt, not killed: how they were found, where they were taken, what the team say - by
 * how bad it was (decideFate in main.js: c._out, the rounds they miss). The injuries are the kind such accidents cause;
 * nothing graphic.
 */
function medicalText(c, D, track) {
  const n = c?._out || 1, F = D.first, pick1 = (a) => a[(Math.random() * a.length) | 0];
  const miss = n === 1 ? 'will miss the next round' : `will miss the next ${n} rounds`;
  if (n === 1) return pick1([
    `${D.name} was conscious and talking when the medical car arrived, and climbed from the car with help. After checks at the medical centre and a precautionary scan, ${D.team} say ${F} has heavy bruising and ${miss} on medical advice.`,
    `${D.name} was checked at the medical centre at ${track || 'the circuit'} and taken to hospital for scans as a precaution. ${D.team} report no fractures; ${F} is badly bruised and sore, and ${miss}.`]);
  if (n === 2) return pick1([
    `${D.name} was helped from the car by the medical team and flown to hospital. ${D.team} confirm a concussion and a fracture to the left wrist. ${F} is awake and comfortable, and ${miss}.`,
    `${D.name} was taken to hospital by helicopter after being treated at the scene. Scans showed a concussion and cracked ribs. ${F} is in a stable condition and ${miss}.`]);
  return pick1([
    `${D.name} was extracted from the car by the medical team and flown to hospital, where ${F} remains tonight under observation. Scans showed a fractured vertebra; ${F} is expected to make a full recovery, but ${miss} at least.`,
    `${D.name} was treated at the scene for some time before being flown to hospital. ${D.team} say ${F} has a fractured pelvis and a concussion, is stable and in good hands, and ${miss} at least.`]);
}

export class NewsBroadcast {
  /**
   * @param o { THREE, hurt: [car], cars, meshes (car -> CarMesh), track, stands, obstacles, pit, trackName, race: { winner,
   *            retired: [{ name, reason }], sc, vsc, red }, camera, renderer, audio, scene, passes, onDone }
   */
  constructor(o) {
    Object.assign(this, o);
    this.T3 = o.THREE; this.t = 0; this.done = false; this.seg = null; this.fov0 = this.camera.fov;
    // the accidents: hurt drivers caught up in the same one share it (its replay has them all, near each other)
    this.incs = [];
    for (const h of this.hurt) {
      const C = h.injuryClip, host = C && this.incs.find((I) => I.clip && I.clip.cars.includes(h) && Math.hypot(I.clip.impact.x - C.impact.x, I.clip.impact.z - C.impact.z) < 160);
      if (host) host.hurt.push(h); else this.incs.push({ car: h, clip: C || null, hurt: [h] });
    }
    for (const I of this.incs) this._prep(I);
    this._use(this.incs[0]);
    // each hurt driver: the words the coverage will use for them (the same all through the broadcast)
    this.D = new Map(this.hurt.map((c) => [c, this._driver(c)]));
    // the running order: every accident gets its own footage and analysis, every hurt driver an onboard and an interview
    // (straight from the black: the warning, then the breaking news)
    const multi = this.hurt.length > 1, P = [], dead = this.hurt.filter((c) => c.fate === 'killed');
    if (this.incs.some((I) => I.clip)) P.push(['warning', 1.8]);
    P.push(['breaking', 4.5]);
    this.incs.forEach((I, n) => {
      if (!I.clip) return;
      const len = (I.clip.frames.length - 1) / I.clip.hz;
      P.push(['phone', Math.min(len, multi ? 6.5 : 8.5), n]);
      if (!multi) P.push(['slow', 5.5, n]);
      P.push(['analysis', multi ? 8 : 10, n], ['heli', multi ? 5 : 6, n]);
      if (I.other >= 0) P.push(['tcam', multi ? 4.5 : 5, n]);
      for (const h of I.hurt) P.push(['tcam2', multi ? 5 : 6, n, h]);
    });
    P.push(['headlines', 8.5 + 1.5 * Math.min(2, this.hurt.length - 1)]);
    if (this.pit) { const teams = new Set(); for (const h of this.hurt) if (!teams.has(h.team) && teams.size < 3) { teams.add(h.team); P.push(['interview1', 7, this.incs.findIndex((I) => I.hurt.includes(h)), h]); } P.push(['interview2', 7.5]); }
    this.anyDead = this.hurt.some((c) => c.fate === 'killed');
    if (this.anyDead) {
      P.push(['prayers', 7 + 2 * Math.min(2, this.hurt.length - 1)], ['silence', 9.5]);
      // the special report: the confirmation, each family's statement (read out for them), their first karting coach
      // at the circuit gates, and the fans gathered there into the night
      for (const c of dead.slice(0, 2)) P.push(['confirm', 7.5, null, c], ['family', 13, null, c]);
      P.push(['coach', 11, null, dead[0]], ['gates', 10, null, dead[0]]);
    }
    else {
      // (hurt, not killed: the medical update for each - what happened to them, how long they are out - then the get-well messages, no vigil)
      for (const c of this.hurt.slice(0, 2)) P.push(['medical', 9, null, c]);
      P.push(['wishes', 7 + 1.5 * Math.min(2, this.hurt.length - 1)]);
    }
    P.push(['out', 1.6]);
    let at = 0; this.plan = P.map(([k, d, inc, who]) => { const s = { k, t0: at, dur: d, inc, who }; at += d; return s; }); this.total = at;
    this._dom(); this._composer(); this._audioStart();
    this._key = (e) => { if (e.code === 'Enter' || e.code === 'Escape' || e.code === 'Space') { e.preventDefault(); this.finish(); } };
    window.addEventListener('keydown', this._key, true);
    this.aimV = new this.T3.Vector3(); this.fovT = 30; this.fov = 30; this.zoomT = 0;
    this.aim = this.clip ? this._pose(0, this.clip.focus).p.clone() : this.rest.clone();
  }

  // ---- the accidents ------------------------------------------------------------------------------------------------
  /** one accident's scene: where it happened, the first hit, the phones that filmed it, the car that saw it, the TV cameras, who else was in it */
  _prep(I) {
    const THREE = this.T3, C = I.clip;
    if (C) { const f = C.frames[C.frames.length - 1], o7 = C.focus * 7; I.rest = new THREE.Vector3(f[o7], f[o7 + 1], f[o7 + 2]); I.impact = new THREE.Vector3(C.impact.x, 0, C.impact.z); }
    else { const m = this.meshes.get(I.car), p = m ? m.group.position : { x: I.car.x, y: 0, z: I.car.z }; I.rest = new THREE.Vector3(p.x, p.y, p.z); I.impact = I.rest.clone(); }
    this.clip = C; this.rest = I.rest; this.impact = I.impact;
    I.impactT = C ? C.impact.k / C.hz : 0;
    // the first heavy blow (beyond the 5-6 g of a fast corner, within 2 s before the hardest): where the onboards and the analysis start
    I.firstHitT = I.impactT;
    if (C) for (let k = Math.max(2, C.impact.k - 2 * C.hz); k <= C.impact.k; k++) if (this._g(k / C.hz) > 10) { I.firstHitT = k / C.hz; break; }
    I.obStart = Math.max(0, I.firstHitT - 2.5); this.firstHitT = I.firstHitT;
    // two phones: the best view of it, and a second one somewhere else; each with its own flaws
    const ranked = this._phoneSpots(I.impact.x, I.impact.z), a = ranked[0];
    const b = ranked.find((c) => c.stand !== a.stand && c.score > a.score - 0.45) || ranked.find((c) => Math.hypot(c.x - a.x, c.z - a.z) > 30 && c.score > a.score - 0.45) || ranked[1] || a;
    const ph = shuffle(PHONES); I.phones = [{ spot: a, P: ph[0] }, { spot: b, P: ph[1] }]; I.spot = a;
    I.other = this._chaser(); I.bc = this._bcSpot(); I.tv = this._tvSpot();
    // who else was in it: out of the race too, damaged, or just past it
    I.involved = [];
    if (C) {
      const o = C.focus * 7, F = C.frames[Math.min(C.frames.length - 1, Math.round(I.firstHitT * C.hz))];
      C.cars.forEach((c, j) => {
        if (this.hurt.includes(c)) return;
        const dist = Math.hypot(F[o] - F[j * 7], F[o + 2] - F[j * 7 + 2]), dm = c.dmg ? c.dmg.fwL + c.dmg.fwR + c.dmg.rw + c.dmg.susp : 0;
        if (c.retired && /^Accident|wreck|Beached|Stuck/i.test(c.retireReason || '')) I.involved.push({ c, kind: 'out' });
        else if (dist < 45 && dm > 0.6) I.involved.push({ c, kind: 'damaged' });
        else if (dist < 25) I.involved.push({ c, kind: 'near' });
      });
      I.involved = I.involved.slice(0, 3);
    }
  }
  /** make accident I the one the cameras work on */
  _use(I) {
    if (!I) return; this.I = I;
    Object.assign(this, { car: I.car, clip: I.clip, rest: I.rest, impact: I.impact, impactT: I.impactT, firstHitT: I.firstHitT, obStart: I.obStart, phones: I.phones, spot: I.spot, other: I.other, bc: I.bc, tv: I.tv });
    this.cur = I.phones[0];
  }
  /** a hurt driver as the coverage speaks of them: names, team, the g, how bad it sounds */
  _driver(c) {
    const name = c.name, first = name.split(' ')[0], last = name.split(' ').pop(), I = this.incs.find((x) => x.hurt.includes(c));
    let g = c.peakG || 0;
    // (the physics' own crash pulse; only without one the replay's rougher frame-to-frame estimate)
    if (g < 5 && I?.clip) { const j = I.clip.cars.indexOf(c); if (j >= 0) { this._use(I); g = Math.max(g, ...this._g(0, true, j)); } }
    g = Math.round(g);
    const dead = c.fate === 'killed';
    const cond = dead ? (g >= 45 ? pick(['in critical condition', 'fighting for life', 'in a critical condition']) : pick(['in a serious condition', 'in critical condition', 'airlifted to hospital']))
      : g >= 45 ? pick(['in a serious but stable condition', 'conscious, airlifted to hospital', 'conscious and in hospital']) : pick(['conscious and taken to hospital', 'taken to hospital for checks', 'awake and talking at the medical centre']);
    const sev = g >= 50 ? pick(['horror', 'massive', 'violent']) : g >= 30 ? pick(['huge', 'heavy', 'high-speed']) : pick(['heavy', 'high-speed', 'big']);
    return { c, dead, name, first, last, LAST: last.toUpperCase(), team: c.team || 'the team', color: c.color, g, gTxt: g >= 15 ? `${g}g` : null, cond, sev, tag: last.replace(/[^A-Za-z]/g, '') };
  }

  /** can a camera at a see point b? (the buildings, landmarks and grandstands in between: world/Obstacles.js) */
  _los(ax, ay, az, bx, by, bz, skip = 14) {
    const O = this.obstacles; if (!O) return true;
    const L = Math.hypot(bx - ax, by - ay, bz - az), n = Math.ceil(L / 5), oh = this._oh || (this._oh = {});
    for (let i = 1; i < n; i++) {
      const u = i / n; if (L * u < skip || L * (1 - u) < 4) continue;   // (not the stand the camera is in, nor the car's own surroundings)
      if (O.hit(ax + (bx - ax) * u, az + (bz - az) * u, ay + (by - ay) * u, oh)) return false;
    }
    return true;
  }
  // ---- where a phone was filming from - always out in the open: the front rows of a grandstand (open to the sky, in
  //      front of its roof; the one that saw the most of the accident from closest, only what is in front of it), or a
  //      bank of spectators behind the barrier (never inside anything)
  _phoneSpots(ix, iz) {
    const tr = this.track, list = this.stands?.stands || [], C = this.clip, cands = [], O = this.obstacles, oh = {};
    const ST = { base: 1.2, tierD: 1.35, tierH: 0.48 };   // (world/Grandstands.js: the steps)
    for (const p of list) {
      if ((p.x - ix) ** 2 + (p.z - iz) ** 2 > 650 * 650) continue;
      for (const row of [0, 1]) for (const f of [-0.3, 0, 0.3]) {
        const [x, z] = p.world(f * p.len, 0.8 + (row + 0.5) * ST.tierD);
        cands.push({ x, y: ST.base + row * ST.tierH + 2.1, z, stand: p, pen: 0.02 * row });   // (standing, the phone held up)
      }
    }
    const q = tr.nearest(ix, iz), free = (x, y, z) => !O || [[0, 0], [1.2, 0], [-1.2, 0], [0, 1.2], [0, -1.2]].every(([a, b]) => !O.hit(x + a, z + b, y, oh));
    for (const ds of [-60, -25, 20]) for (const side of [1, -1]) {
      const s = tr.wrapS(q.s + ds), i = tr.idxAtS(s), f = tr.sample(s, side * (tr.wallAt(i, side) + 9));
      if (free(f.x, 2.8, f.z)) cands.push({ x: f.x, y: 2.8, z: f.z, stand: null, pen: 0.15 });
    }
    const targets = [];
    if (C) for (let k = 0; k < Math.min(C.frames.length, C.impact.k + 25); k += 3) { const o = C.focus * 7, f = C.frames[k]; targets.push([f[o], f[o + 1] + 0.6, f[o + 2]]); }
    else targets.push([ix, 0.6, iz]);
    for (const c of cands) {
      let vis = 0, dist = 0;
      const S = c.stand, front = (x, z) => !S || (x - S.x) * S.ez[0] + (z - S.z) * S.ez[1] < -2;
      for (const [x, y, z] of targets) { if (front(x, z) && this._los(c.x, c.y, c.z, x, y, z, S ? 14 : 3)) vis++; dist += Math.hypot(x - c.x, z - c.z); }
      c.score = vis / targets.length - dist / targets.length / 1500 - c.pen;
    }
    cands.sort((p, q) => q.score - p.score);
    return cands.length ? cands : [{ x: ix + 40, y: 4, z: iz, stand: null, score: 0 }];
  }
  /** a TV camera on the circuit with a clear view of the wreck (a long lens from along the track; from above if none) */
  _tvSpot() {
    const tr = this.track, r = this.rest, q = tr.nearest(r.x, r.z);
    for (const ds of [-55, 55, -35, 35, -90, 90, -20, 20]) {
      const f = tr.sample(tr.wrapS(q.s + ds), Math.max(-tr.halfWidth, Math.min(tr.halfWidth, q.d)) * 0.6);
      if (this._los(f.x, 1.8, f.z, r.x, r.y + 0.5, r.z, 3)) return { x: f.x, y: 1.8, z: f.z, fov: Math.max(9, Math.min(30, 600 / Math.hypot(f.x - r.x, f.z - r.z))) };
    }
    return { x: r.x + 45, y: 30, z: r.z + 20, fov: 26 };
  }
  /** the car whose T-cam saw the most of it: the crashed car ahead of it, in its picture, the nearer the better (-1: none did) */
  _chaser() {
    const C = this.clip; if (!C || C.cars.length < 2) return -1;
    const THREE = this.T3, o = C.focus * 7, k0 = Math.max(0, Math.round((this.firstHitT - 1) * C.hz)), k1 = Math.min(C.frames.length - 1, Math.round((this.firstHitT + 1.5) * C.hz));
    const fwd = new THREE.Vector3(), q = new THREE.Quaternion();
    let best = -1, bs = 0;
    for (let j = 0; j < C.cars.length; j++) {
      if (j === C.focus || this.hurt.includes(C.cars[j])) continue;
      let seen = 0, near = 0;
      for (let k = k0; k <= k1; k += 2) {
        const F = C.frames[k], p = j * 7, dx = F[o] - F[p], dz = F[o + 2] - F[p + 2], dist = Math.hypot(dx, dz);
        if (dist > 170 || dist < 3) continue;
        fwd.set(1, 0, 0).applyQuaternion(q.set(F[p + 3], F[p + 4], F[p + 5], F[p + 6]));
        if ((dx * fwd.x + dz * fwd.z) / dist > Math.cos(0.75)) { seen++; near += 3 * (1 - dist / 170) ** 2; }
      }
      const s = seen >= 4 ? near : 0; if (s > bs) { bs = s; best = j; }
    }
    return bs > 0 ? best : -1;
  }
  /** the world feed's trackside camera for the analysis replay: up on a tower, with the clearest view of the first hit */
  _bcSpot() {
    const tr = this.track, C = this.clip; if (!C) return null;
    const o = C.focus * 7, k0 = Math.max(0, Math.round((this.firstHitT - 2) * C.hz)), k1 = Math.min(C.frames.length - 1, Math.round((this.firstHitT + 1) * C.hz));
    const F = C.frames[Math.round(this.firstHitT * C.hz)] || C.frames[0], q = tr.nearest(F[o], F[o + 2]);
    let best = null, bs = -Infinity, bv = 0;
    const O = this.obstacles, oh = {};
    for (const ds of [-150, -110, -80, -55, 45, 70]) for (const side of [1, -1]) for (const off of [3, 8]) for (const y of [7, 13]) {
      const s = tr.wrapS(q.s + ds), i = tr.idxAtS(s), f = tr.sample(s, side * (tr.wallAt(i, side) + off));
      if (O && (O.hit(f.x, f.z, y, oh) || O.hit(f.x, f.z, y - 4, oh))) continue;   // (never inside a building or a stand)
      let vis = 0, dist = 0;
      for (let k = k0; k <= k1; k += 3) { const G = C.frames[k]; if (this._los(f.x, y, f.z, G[o], G[o + 1] + 0.6, G[o + 2], 0)) vis++; dist += Math.hypot(G[o] - f.x, G[o + 2] - f.z); }
      const n = Math.max(1, Math.floor((k1 - k0) / 3) + 1), sc = vis / n - dist / n / 600 + (ds < 0 ? 0.08 : 0) - (y > 10 ? 0.03 : 0);
      if (sc > bs) { bs = sc; bv = vis / n; best = { x: f.x, y, z: f.z }; }
    }
    // (nowhere along the circuit sees it clearly: the camera up high over the track itself, looking down the road at it)
    if (!best || bv < 0.6) { const f = tr.sample(tr.wrapS(q.s - 70), 0); best = { x: f.x, y: 30, z: f.z }; }
    return best;
  }
  /** the g car j of the replay took between two frames (from its motion), at clip time tau (all: the whole record) */
  _g(tau, all = false, j = null) {
    const C = this.clip; j = j ?? C.focus;
    const M = this._gc || (this._gc = new Map()); let A = M.get(C); if (!A) M.set(C, (A = {}));
    if (!A[j] && C.pulses) A[j] = Float32Array.from(C.pulses, (row) => row[j] || 0);   // (the physics' own crash pulses)
    if (!A[j]) {
      const o = j * 7, F = C.frames, n = F.length, v = [[0, 0, 0]], g = new Float32Array(n);
      for (let k = 1; k < n; k++) v.push([0, 1, 2].map((a) => (F[k][o + a] - F[k - 1][o + a]) * C.hz));
      for (let k = 2; k < n; k++) g[k] = Math.hypot(v[k][0] - v[k - 1][0], v[k][1] - v[k - 1][1], v[k][2] - v[k - 1][2]) * C.hz / 9.81;
      A[j] = g;
    }
    if (all) return A[j];
    return A[j][Math.max(0, Math.min(A[j].length - 1, Math.round(tau * C.hz)))];
  }
  /** car j's own first heavy hit in the replay (its own onboard starts 2.5 s before it) */
  _hits(j) {
    const C = this.clip, g = this._g(0, true, j); let ik = 0, mx = -1;
    for (let k = 2; k < g.length; k++) if (g[k] > mx) { mx = g[k]; ik = k; }
    if (j === C.focus) ik = C.impact.k;
    let fk = ik; for (let k = Math.max(2, ik - 2 * C.hz); k <= ik; k++) if (g[k] > 10) { fk = k; break; }
    return { firstHitT: fk / C.hz, obStart: Math.max(0, fk / C.hz - 2.5) };
  }

  // ---- the words ----------------------------------------------------------------------------------------------------
  _dom() {
    if (!document.getElementById('news-css')) { const st = document.createElement('style'); st.id = 'news-css'; st.textContent = CSS; document.head.appendChild(st); }
    const Ds = [...this.D.values()], TRACK = (this.trackName || 'the circuit').toUpperCase(), track = this.trackName || 'the circuit', n = Ds.length;
    const same = this.incs.length === 1;
    // the ticker: each hurt driver once, then everything else that happened - who else was in it, the race itself
    const tick = Ds.map((D) => (D.dead ? pick([`${D.name.toUpperCase()} ${D.cond.toUpperCase()}${D.gTxt ? ` AFTER ${D.gTxt.toUpperCase()} CRASH` : ''}`, `${D.name.toUpperCase()} AIRLIFTED TO HOSPITAL AFTER ${D.sev.toUpperCase()} CRASH AT ${TRACK}`, `${D.team.toUpperCase()}: "OUR THOUGHTS ARE WITH ${D.first.toUpperCase()} AND THE FAMILY"`])
      : pick([`${D.name.toUpperCase()} ${D.cond.toUpperCase()}${D.gTxt ? ` AFTER ${D.gTxt.toUpperCase()} CRASH` : ''}`, `${D.team.toUpperCase()}: "${D.first.toUpperCase()} IS CONSCIOUS AND TALKING"`, `${D.name.toUpperCase()} EXPECTED TO MISS THE NEXT TWO RACES`])));
    for (const I of this.incs) for (const v of I.involved) {
      const N = v.c.name.toUpperCase(), L0 = I.car.name.split(' ').pop().toUpperCase();
      tick.push(v.kind === 'out' ? pick([`${N} ALSO OUT OF THE RACE AFTER BEING CAUGHT UP IN ${L0}'S ACCIDENT`, `${N} RETIRED FROM THE SAME INCIDENT, REPORTED UNHURT`]) : v.kind === 'damaged' ? `${N} DAMAGED IN THE INCIDENT BUT CONTINUED` : pick([`${N} NARROWLY AVOIDED THE WRECKAGE`, `${N} HAD TO TAKE AVOIDING ACTION`]));
    }
    const R = this.race || {};
    if (R.abandoned) tick.push(`RACE ABANDONED AFTER ${andList(Ds.map((D) => D.LAST))}'S ACCIDENT`);
    tick.push(...Ds.map((D) => (D.dead ? pick([`TRIBUTES POUR IN FOR ${D.name.toUpperCase()}`, `"NEVER FORGET ${D.LAST}" - FANS GATHER AT THE GATES`, `THE SPORT MOURNS: ${D.name.toUpperCase()}`])
      : pick([`GET-WELL MESSAGES POUR IN FOR ${D.name.toUpperCase()}`, `${D.LAST} TO STAY IN HOSPITAL OVERNIGHT FOR OBSERVATION`, `HALO CREDITED AFTER ${D.LAST}'S ${D.sev.toUpperCase()} CRASH`]))));
    if (R.red) tick.push(pick(['RACE RED-FLAGGED FOR BARRIER REPAIRS', `RED FLAG: THE RACE WAS SUSPENDED${R.red > 1 ? ` ${R.red} TIMES` : ''}`]));
    if (R.sc) tick.push(`SAFETY CAR DEPLOYED${R.sc > 1 ? ` ${R.sc} TIMES` : ''}${R.vsc ? `, VIRTUAL SAFETY CAR ${R.vsc}` : ''}`);
    for (const r of shuffle(R.retired || []).slice(0, 2)) tick.push(`${r.name.toUpperCase()} OUT WITH ${String(r.reason || 'damage').toUpperCase()}`);
    if (R.winner) tick.push(this.anyDead ? pick([`${R.winner.toUpperCase()} WINS AT ${TRACK} - NO CELEBRATIONS ON THE PODIUM`, `${R.winner.toUpperCase()} TAKES VICTORY, DEDICATES IT TO ${andList(Ds.map((D) => D.first.toUpperCase()))}`])
      : pick([`${R.winner.toUpperCase()} WINS AT ${TRACK}`, `${R.winner.toUpperCase()} TAKES VICTORY, SENDS BEST WISHES TO ${andList(Ds.map((D) => D.first.toUpperCase()))}`]));
    tick.push(this.anyDead ? pick(['FIA: "NO FURTHER INFORMATION AT THIS TIME"', 'FIA STATEMENT EXPECTED WITHIN THE HOUR', 'RACE CONTROL: MEDICAL UPDATE TO FOLLOW']) : pick(['FIA TO INVESTIGATE THE ACCIDENT', 'MEDICAL UPDATE EXPECTED THIS EVENING', 'BARRIER REPAIRS UNDER WAY']),
      this.anyDead ? pick(['FANS GATHER AT THE CIRCUIT GATES', 'CANDLES LIT OUTSIDE THE PADDOCK ENTRANCE', 'FLOWERS LAID AT THE TEAM HOSPITALITY']) : pick(['SAFETY DEBATE REIGNITED', 'FANS RELIEVED AFTER SCARY MOMENTS', 'TEAM REVIEWING THE DATA']));
    // the papers: one leading on all of them if more than one, then each driver in turn
    const tmplHurt = (D) => shuffle([
      () => ({ h: `${D.LAST} IN HOSPITAL AFTER ${D.gTxt ? D.gTxt.toUpperCase() + ' ' : ''}CRASH` }),
      () => ({ h: `"${D.first.toUpperCase()} IS OK"`, p: `${D.team} confirm the driver is conscious and talking.` }),
      () => ({ web: true, h: `${D.name} ${D.cond} after ${D.sev} crash at ${track}` }),
      () => ({ h: `${D.LAST} TO MISS TWO RACES` }),
      () => ({ h: `THE CRASH THAT STOPPED ${TRACK}` }),
      () => ({ h: D.g >= 30 ? `HALO SAVES ${D.LAST}` : `${D.LAST}'S LUCKY ESCAPE` }),
      () => ({ h: `${D.LAST}'S ${D.sev.toUpperCase()} SHUNT: WHAT WE KNOW` }),
      () => ({ web: true, h: `Get well soon, ${D.first}: the paddock reacts`, p: 'Messages from every team on the grid.' }),
      () => ({ web: true, h: `${D.last} awake in hospital, team says`, p: 'Further checks are planned overnight.' }),
    ]);
    const tmpl = (D) => (!D.dead ? tmplHurt(D) : shuffle([
      () => ({ h: `${D.LAST} ${D.cond.toUpperCase()}${D.gTxt ? ` AFTER ${D.gTxt.toUpperCase()} CRASH` : ''}` }),
      () => ({ web: true, h: `${D.name} ${D.cond} after ${D.gTxt ? D.gTxt + ' ' : ''}impact at ${track}` }),
      () => ({ h: '"WE FEAR THE WORST"', p: `Paddock holds its breath after ${D.last}'s ${D.sev} crash.` }),
      () => (D.gTxt ? { h: `${D.gTxt.toUpperCase()}: THE CRASH THAT SILENCED ${TRACK}` } : { h: `THE CRASH THAT SILENCED ${TRACK}` }),
      () => ({ h: `PRAY FOR ${D.LAST}` }),
      () => ({ h: 'THE SPORT MOURNS', p: `Tributes pour in for ${D.name} after the accident at ${track}.` }),
      () => ({ h: `NEVER FORGET #${D.c.number ?? ''}`.trim(), p: `Fans gather in silence outside the ${D.team} garage.` }),
      () => ({ web: true, h: `FIA: no update yet on ${D.last}`, p: 'A medical statement is expected within the hour.' }),
      () => ({ h: `${D.LAST}'S ${D.sev.toUpperCase()} SHUNT: WHAT WE KNOW` }),
      () => ({ web: true, h: `Silence at ${track} as ${D.last} is airlifted` }),
    ]));
    const subs = (D) => (D.dead ? [`Unconfirmed reports from the circuit. More to follow.`, 'The race director has made no comment.', `${D.team} asks for privacy for ${D.first} and the family.`, 'Fans in tears at the circuit.', 'Medical helicopter seen leaving the circuit.', 'A sport reminded, again, of the price it can ask.']
      : ['The team says the driver is conscious.', 'Further checks in hospital tonight.', 'A reminder of how far safety has come.', 'The FIA will investigate.', `${D.team} thank the medical teams.`, 'The barrier took a battering.']);
    const papers = [];
    if (n > 1) papers.push({ h: `${NUM[n] || n} DRIVERS HOSPITALISED AFTER ${same ? 'MULTI-CAR CRASH' : 'SEPARATE CRASHES'} AT ${TRACK}`, p: `${andList(Ds.map((D) => D.name))} all taken to hospital.` });
    const pools = Ds.map(tmpl);
    for (let i = 0; papers.length < 5; i++) { const D = Ds[i % n], t = pools[i % n].pop()?.() || { h: D.dead ? `PRAY FOR ${D.LAST}` : `GET WELL SOON ${D.LAST}` }; papers.push({ p: pick(subs(D)), ...t }); }
    for (const p of papers) { p.mast = pick(MASTS); p.tag = pick(TAGS); }
    const spots = [[8, 16, -3], [52, 14, 2.5], [18, 40, 1.5], [55, 42, -2], [30, 24, -1]];
    // the posts: each hurt driver equally - the team, a fellow driver, the fans
    const fans = shuffle(FANS), others = this.cars.filter((c) => !this.hurt.includes(c)), posts = [], per = Math.max(2, Math.floor(8 / n));
    Ds.forEach((D, di) => {
      const mate = others.find((c) => c.team === D.team) || pick(others) || { name: 'A fellow driver', color: '#1d9bf0' };
      const mine = !D.dead ? [
        { av: D.team[0], col: D.color, who: D.team, handle: '@' + D.team.replace(/[^A-Za-z0-9]/g, ''), v: true, txt: pick([`Update: ${D.first} is conscious and has been taken to hospital for further checks. Thank you for all your messages. 🧡`, `${D.first} is awake and talking. We'll share more when we can. Thank you to the marshals and medical teams.`, `Relieved to say ${D.first} is OK. Sore, but OK. More checks tonight.`]) },
        { av: mate.name[0], col: '#1d9bf0', who: mate.name, handle: '@' + mate.name.split(' ').pop().toLowerCase(), v: true, txt: pick([`Scary one. Get well soon ${D.first}, see you back out there 💪`, `Just heard ${D.first} is ok. Huge relief. Heal up mate.`, `That looked horrible. So glad you're ok ${D.first} 🙏`]) },
      ] : [
        { av: D.team[0], col: D.color, who: D.team, handle: '@' + D.team.replace(/[^A-Za-z0-9]/g, ''), v: true, txt: pick([`Forever part of our family. Our hearts are with ${D.first} and the family. 🖤`, `There are no words. We ask everyone to respect the family's privacy at this time. 🖤`, `${D.first}. Always one of us. 🖤`]) },
        { av: mate.name[0], col: '#1d9bf0', who: mate.name, handle: '@' + mate.name.split(' ').pop().toLowerCase(), v: true, txt: pick([`Every lap I drive from now on is for you, ${D.first}. 🕊️`, `I don't know what to say. Brother, I'll never forget you.`, `Today the racing doesn't matter. ${D.first}, we're all with you. 🖤`]) },
      ];
      const fanTxt = !D.dead ? shuffle([`Get well soon ${D.first} 🙏`, `Thank god ${D.first} is ok. That looked awful.`, `${D.gTxt ? D.gTxt + '?! ' : ''}And ${D.first} is talking. Thank you halo.`, `Heal up ${D.first}, we'll be waiting for you 💪 #GetWell${D.tag}`,
        `I was in the stand. Still shaking. So relieved ${D.first} is ok`, `Two races out, then back stronger. Come on ${D.first}!`, `The marshals were there in seconds. Respect to them. Get well ${D.first}`, `My kids were scared. Told them ${D.first} is ok 🧡`]) : shuffle([`Never forget #${D.c.number ?? ''} 🕊️`, `I can't believe this. Forever in our hearts ${D.first} 🕊️`, `Fly high ${D.first}. The sport will never forget you.`, `Please be ok ${D.first} 🙏🙏🙏`, `I was in the stand. I can't stop shaking. Sending everything to ${D.first} 💔`, `Candles at the gates tonight for ${D.first}. Nobody is going home. 🕯️`,
        `Whatever happens - we're all with you ${D.first}. #PrayFor${D.tag}`, D.gTxt ? `${D.gTxt}. I can't believe anyone survives that. Come on ${D.first} 🙏` : `Just saw the replay. Feel sick. Stay strong ${D.first}`,
        `My kids are asking if ${D.first} is ok and I don't know what to tell them`, `The whole grandstand went silent. Praying for ${D.first} 🙏`, `#PrayFor${D.tag} trending worldwide right now. The sport is with you.`]);
      for (let i = 0; mine.length < per; i++) { const f = fans[(di * 4 + i) % fans.length]; mine.push({ av: f[0][0], col: f[2], who: f[0], handle: f[1], txt: fanTxt[i % fanTxt.length] }); }
      posts.push(...shuffle(mine).map((p, i) => ({ ...p, order: i * n + di })));
    });
    posts.sort((a, b) => a.order - b.order); posts.length = Math.min(posts.length, 8);
    this.Ds = Ds;
    const names = andList(Ds.filter((D) => D.dead).map((D) => D.name)) || andList(Ds.map((D) => D.name));
    const el = document.createElement('div'); el.id = 'news';
    el.innerHTML = `
      <div class="bug"><b>F1 NEWS</b><i>LIVE</i></div>
      <div class="place">${esc(TRACK)}</div>
      <button class="skip">SKIP ▸</button>
      <div class="tag"></div>
      <div class="ob"><span class="st"></span><b></b><i>ONBOARD</i></div>
      <div class="lost"><b>SIGNAL LOST</b><span></span></div>
      <svg class="tele" width="100%" height="100%"><circle r="40" fill="none" stroke="#ffd21f" stroke-width="5" stroke-linecap="round"/></svg>
      <div class="cards">${papers.map((p, i) => `<div class="paper${p.web ? ' web' : ''}" style="left:${spots[i][0]}vw;top:${spots[i][1]}vh;--r:${spots[i][2]}deg"><div class="mast">${esc(p.mast)}<em>${esc(p.tag)}</em></div><h2>${esc(p.h)}</h2><p>${esc(p.p || '')}</p></div>`).join('')}</div>
      <div class="posts"><div class="col"></div><div class="col"></div></div>
      <div class="confirm"><small>SPECIAL REPORT</small><h1></h1><p></p></div>
      <div class="family"><small></small><div class="lines"></div><em></em></div>
      <div class="silence"><b>A MOMENT OF SILENCE</b><span>Drivers, teams and marshals take a knee on the grid for ${esc(names)}. Never forgotten.</span></div>
      <div class="cc"></div>
      <div class="lower"><div class="tab"></div><div class="main"></div><div class="sub"></div></div>
      <div class="ticker"><b>LATEST</b><span>${esc(tick.join('  ·  '))}</span></div>
      <div class="warn"><b>WARNING</b><p>The following contains footage of ${n > 1 ? 'serious accidents' : 'a serious accident'}. Viewer discretion is advised.</p></div>`;
    document.body.appendChild(el); this.el = el;
    const cols = el.querySelectorAll('.posts .col');
    this.posts = posts.map((p, i) => { const d = document.createElement('div'); d.className = 'post'; d.innerHTML = `<div class="av" style="background:${esc(p.col)}">${esc(p.av)}</div><div><div class="who">${esc(p.who)}${p.v ? '<span class="v">✓</span>' : ''} <span>${esc(p.handle)}</span></div><div class="txt">${esc(p.txt)}</div></div>`; cols[i % 2].appendChild(d); return d; });
    this.papers = [...el.querySelectorAll('.paper')];
    el.querySelector('.skip').addEventListener('click', () => this.finish());
    this.$ = (s) => el.querySelector(s);
  }
  /** the lower third and the live captions for segment seg (drawn from the pools: no two broadcasts say it the same way) */
  _text(seg) {
    const k = seg.k, I = this.I, Ds = this.Ds, n = Ds.length, D = this.D.get(seg.who || I?.car) || Ds[0], track = this.trackName || 'the circuit';
    const names = andList(Ds.map((x) => x.name)), firsts = andList(Ds.map((x) => x.first)), incHurt = I ? I.hurt.map((h) => this.D.get(h)) : [D];
    const inv = I?.involved || [], invName = inv.length ? inv[0].c.name : null, same = this.incs.length === 1;
    const lead = n > 1 && this.incs.length > 1 ? ` The second accident, involving ${andList(this.incs.slice(1).map((x) => x.car.name))}, came later.` : '';
    switch (k) {
      case 'breaking': return n > 1
        ? { tab: 'BREAKING NEWS', main: same ? `Multi-car crash at ${track}` : `${NUM[this.incs.length] ? NUM[this.incs.length][0] + NUM[this.incs.length].slice(1).toLowerCase() : this.incs.length} heavy crashes at ${track}`, sub: `${names} · medical teams at the scene`,
          cc: [`>> We're getting reports of ${same ? 'a multi-car accident' : 'more than one serious accident'} at ${track}, involving ${names}.`, `>> All of them have been taken to the medical centre. We will bring you everything as we get it.`] }
        : { tab: 'BREAKING NEWS', main: `${pick(['Heavy', 'Huge', 'Serious'])} crash at ${track}`, sub: `${D.name} · medical teams at the scene`,
          cc: [pick([`>> We're just getting reports of a very heavy accident at ${track}. It involves ${D.name}. The medical car was there within seconds.`, `>> Breaking news from ${track}: ${D.name} has been involved in a ${D.sev} crash.${D.gTxt ? ` We're told the impact was around ${D.g} g.` : ''}`, `>> We're interrupting our coverage. ${D.name} has crashed heavily at ${track}, and the medical team are with ${D.first} now.`])] };
      case 'phone': return { tab: 'VIEWER FOOTAGE', main: incHurt.length > 1 ? `${andList(incHurt.map((x) => x.last))} crash` : `${D.name} in ${D.sev} crash`, sub: `Filmed by a spectator in ${this.spot.stand?.name ? 'the ' + this.spot.stand.name : this.spot.stand ? 'the grandstand' : 'the crowd'}`,
        cc: [pick(['>> This footage, filmed by a spectator in the grandstand, shows the moment of impact.', ">> We've been sent this by a fan at the circuit. It's difficult to watch.", '>> This was filmed from the stands. You can hear the crowd.']) + (invName ? ` ${pick([`${invName} is caught up in it too.`, `Watch ${invName} - there was nowhere to go.`])}` : '')] };
      case 'slow': return { tab: 'VIEWER FOOTAGE', main: `${D.name} in ${D.sev} crash`, sub: 'Second angle · slowed down', cc: [pick(['>> Another angle, from further round. The crowd falls silent.', '>> Slowed down, you can see the moment it goes wrong.', '>> From the other side of the circuit. Look at the speed.'])] };
      case 'analysis': {
        const cause = pick(['a failure at the rear', 'a puncture', 'a gust of wind', "contact we haven't seen yet", 'cold tyres', 'a brake problem']);
        return { tab: 'ANALYSIS', main: incHurt.length > 1 ? `${andList(incHurt.map((x) => x.last))}: what happened?` : pick(['What happened?', `${D.last}: what went wrong?`, 'The moment it went wrong']), sub: 'Mark Hollis, former F1 driver · Dr Anna Reyes, motorsport medic', cc: [
          pick([`>> HOLLIS: Watch the car here - it's already gone before the barrier. Was it ${cause}? We just don't know.`, `>> HOLLIS: There's no correction there at all. That tells me something broke. ${pick(['Suspension', 'Brakes', 'A tyre'])}, maybe.`, `>> HOLLIS: I've watched it ten times. I think it's ${cause}, but that's speculation.`]),
          invName ? `>> HOLLIS: And ${invName} - ${inv[0].kind === 'out' ? 'out of the race, but walked away' : inv[0].kind === 'damaged' ? 'damaged, but carried on' : 'missed it by inches'}.` : null,
          pick([`>> REYES: That is an enormous impact${D.gTxt ? ` - the early data is talking about ${D.g} g` : ''}. The survival cell has done its job. But the speed of the medical response tells you they were worried.`, `>> REYES: ${D.gTxt ? `At ${D.g} g` : 'At those forces'} the body takes a huge amount. The halo and the HANS device are there for exactly this.`, `>> REYES: The fact they went straight for the helicopter is what concerns me.`]),
          D.dead ? pick([">> HOLLIS: There are rumours in the paddock. I'm not going to repeat them. Let's wait for the FIA.", '>> REYES: Please - nobody should speculate about the condition of a driver. Let the doctors work.', ">> HOLLIS: Everyone here is just waiting. Nobody wants to say what they're thinking."])
            : pick([`>> REYES: The good news: we saw ${D.first} moving in the cockpit before the medical car arrived.`, `>> HOLLIS: And the word from the team is ${D.first} is conscious. That's all anyone wanted to hear.`, `>> REYES: Ten years ago, I'm not sure we'd be having this conversation. The car did its job.`]),
        ].filter(Boolean) };
      }
      case 'heli': return { tab: 'REPLAY', main: pick(['From the helicopter', 'The aerial view', 'From above']), sub: incHurt.length > 1 ? andList(incHurt.map((x) => x.name)) : D.name, cc: [pick(['>> From the helicopter you can see how far the car travelled.', '>> The view from above. Look at where the car ends up.', '>> This is the aerial replay. The marshals were there in seconds.'])] };
      case 'tcam': { const oc = this.clip.cars[this.other]; return { tab: 'ONBOARD', main: `Onboard with ${oc.name}`, sub: 'The car behind · world feed', cc: [pick([`>> This is the view from ${oc.name.split(' ')[0]}'s car, just behind.`, `>> ${oc.name.split(' ')[0]} was right there - this is the onboard.`, `>> Watch ahead of ${oc.name.split(' ')[0]}'s car.`])] }; }
      case 'tcam2': return { tab: 'ONBOARD', main: `${D.name}'s onboard camera`, sub: pick(['The feed cuts out on impact', 'The moment of impact', 'Signal lost on impact']), cc: [pick([`>> And this is from ${D.first}'s own car. The pictures cut out as the car hits.`, `>> ${D.first}'s onboard. We lose the signal on impact.`, `>> This is what ${D.first} saw. Then the feed goes.`])] };
      case 'headlines': if (!this.anyDead) return n > 1
        ? { tab: 'LATEST', main: `${firsts} in hospital`, sub: 'Teams: both conscious', cc: [`>> The latest: ${names} are in hospital. The teams say they are conscious, and will stay in overnight.${lead}`] }
        : { tab: 'LATEST', main: `${D.last}: ${D.cond}`, sub: pick(['Expected to miss the next two races', 'Further checks overnight', 'Team statement']), cc: [pick([`>> Good news from the medical centre: ${D.first} is conscious and talking. ${D.first} will stay in hospital tonight for checks.`, `>> The team say ${D.first} is sore, but OK. We're told two races out is likely.`, `>> Relief here. ${D.first} is awake, and asked about the car - which tells you everything.`])] };
        return n > 1
        ? { tab: 'BREAKING NEWS', main: `${firsts}: no official update`, sub: 'Reports: condition critical', cc: [`>> We're told ${n === 2 ? 'both' : 'all of them'} - ${names} - are in hospital. There is no official word on any of them yet.${lead}`] }
        : { tab: 'BREAKING NEWS', main: `${D.last}: condition "${D.cond.replace(/^in (a )?/, '')}" - reports`, sub: pick(['No official update from the FIA', 'The FIA has not commented', 'Medical statement expected']), cc: [pick([`>> We're hearing that ${D.first}'s condition is critical. I have to stress we don't have any more information than that.`, `>> The reports coming out of the paddock are not good. We'll only tell you what we can confirm.`, `>> Nobody here has seen ${D.first} since the helicopter left. Everyone is waiting.`])] };
      case 'interview1': if (!D.dead) return { tab: 'INTERVIEW', main: `Team Principal, ${D.team}`, sub: 'Speaking in the pit lane', cc: shuffle([
        `>> First of all, ${D.first} is OK. Conscious, talking, a bit sore. That's what matters.`, `>> We'll take our time. Health first, then we'll see about the next races.`,
        `>> Big thanks to the marshals and the medics. They were incredible.`, `>> The car is destroyed, but the car did its job. We'll learn from it.`, `>> ${D.first} asked how the race finished. I think that's a good sign.`]).slice(0, 2) };
        return { tab: 'INTERVIEW', main: `Team Principal, ${D.team}`, sub: 'Speaking in the pit lane', cc: shuffle([
        `>> We don't know any more than you do right now. ${D.first} is with the medical team, and that's all that matters.`, `>> The car can wait. The championship can wait. We just want to hear from ${D.first}.`,
        `>> I spoke to the family. I'm not going to say any more than that.`, `>> ${D.first} is a fighter. That's all I can say.`, `>> We will find out what happened. But not today. Today is about ${D.first}.`]).slice(0, 2) };
      case 'interview2': { const w = this.speaker; if (!this.anyDead) return { tab: 'INTERVIEW', main: `${w.name} · ${w.team}`, sub: 'Speaking after the race', cc: shuffle([
        `>> Scary to see. I'm just glad to hear ${firsts} ${n > 1 ? 'are' : 'is'} OK.`, ">> When you see a crash like that you fear the worst. Big relief.", `>> Get well soon. We want ${n > 1 ? 'them' : D.first} back racing.`, ">> The safety in these cars is incredible. Respect to everyone who made it that way."]).slice(0, 2) };
        return { tab: 'INTERVIEW', main: `${w.name} · ${w.team}`, sub: 'Speaking after the race', cc: shuffle(n > 1
        ? [`>> I just want to hear that ${firsts} are ok. Nothing else matters.`, '>> I saw the replays. I don\'t want to see them again.', '>> We all know the risks. You never think you\'ll see a day like this.']
        : [">> I saw the replay once. I don't want to see it again.", `>> ${D.first} is one of the toughest people I know. Come on, mate.`, `>> You put your helmet on and you accept the risk. But days like this... it's hard.`, `>> I didn't even look at the result. I just asked about ${D.first}.`]).slice(0, 2) }; }
      case 'wishes': return { tab: 'LIVE', main: `Get well soon, ${firsts}`, sub: 'Messages from across the sport', cc: shuffle([
        `>> The messages have been coming in all evening, from every team on the grid.`, `>> ${Ds[0].team} say ${Ds[0].first} will be assessed again tomorrow.`, '>> A scary afternoon. But tonight it is relief, more than anything.',
        `>> #GetWell${Ds[0].tag} has been trending since the crash.`]).slice(0, 2) };
      case 'coach': return { tab: 'SPECIAL REPORT', main: `${D.first}'s first karting coach`, sub: 'At the circuit gates, tonight', cc: shuffle([
        `>> I met ${D.first} as a kid in a borrowed suit, two sizes too big. By lunchtime they were quicker than everyone there.`,
        `>> Every time I watched a race on TV, I still saw that kid in the kart. Every single time.`,
        `>> ${D.first} rang me a few weeks ago. No reason. Just to say thank you. I'm so glad I picked up.`,
        `>> Racing gave ${D.first} everything. Today it took it all back. I don't know what to do with that.`,
        `>> If you're a young driver watching this... the people around you are what matters. Look after each other.`,
        `>> We used to sleep in the van at the tracks. ${D.first} would be up before me, cleaning the kart.`,
        `>> I keep thinking about the first trophy. It was plastic. ${D.first} carried it around for a week.`]).slice(0, 3) };
      case 'gates': return { tab: 'SPECIAL REPORT', main: `Thousands gather for ${D.first}`, sub: 'The circuit gates, tonight', cc: shuffle([
        `>> They have been arriving since the news broke. Scarves, flowers, caps, a helmet painted by a child.`,
        '>> There are thousands here, and you can barely hear a sound.',
        '>> Fans of every team. Tonight there are no rivals at these gates.',
        `>> Someone has hung a ${D.team} flag on the fence and written ${D.first}'s number on it, again and again.`,
        `>> A father just lifted his daughter up to leave her flowers. She asked me if ${D.first} was a good driver. I said the best.`,
        '>> The candles go all the way along the fence now. Nobody is leaving.']).slice(0, 3) };
      case 'prayers': return { tab: 'LIVE', main: `Prayers for ${firsts}`, sub: pick([`Flowers laid outside the ${Ds[0].team} garage`, 'Candles lit in the pit lane', 'Messages pour in from across the sport']), cc: shuffle([
        `>> Outside the ${Ds[0].team} garage, the flowers have been arriving all evening.`, '>> Mechanics, rival teams, marshals. Nobody here is talking about the race.',
        '>> A few minutes ago the whole pit lane stopped. Heads bowed, in silence.', `>> Someone has written "${pick(['Stay strong', 'Get well soon', 'We are with you'])}, ${Ds[0].first}" on a card and left it by the candles.`,
        `>> #PrayFor${Ds[0].tag} has been trending around the world for the last hour.`]).slice(0, 2) };
    }
    return null;
  }
  _lower(seg) {
    const L = this.$('.lower'), x = seg && this._text(seg);
    if (!x) { L.classList.remove('in'); this.$('.cc').classList.remove('in'); this.cc = null; return; }
    L.classList.remove('in'); void L.offsetWidth;
    L.querySelector('.tab').textContent = x.tab; L.querySelector('.main').textContent = x.main; L.querySelector('.sub').textContent = x.sub;
    setTimeout(() => L.classList.add('in'), 120);
    this.cc = { lines: x.cc, t: 0 }; this.$('.cc').classList.add('in');
  }

  // ---- the picture ----------------------------------------------------------------------------------------------------
  _composer() {
    const { EffectComposer, RenderPass, ShaderPass, OutputPass } = this.passes, THREE = this.T3;
    this.comp = new EffectComposer(this.renderer); this.comp.addPass(new RenderPass(this.scene, this.camera));
    this.pass = new ShaderPass(SHADER); this.pass.uniforms.uRes.value = new THREE.Vector2(1, 1); this.pass.uniforms.uTint.value = new THREE.Vector3(1, 1, 1); this.comp.addPass(this.pass); this.comp.addPass(new OutputPass());
  }
  render() {
    const THREE = this.T3, sz = this.renderer.getSize(new THREE.Vector2()), pr = this.renderer.getPixelRatio();
    if (!this._sz || this._sz.x !== sz.x || this._sz.y !== sz.y) { this._sz = sz; this.comp.setPixelRatio(pr); this.comp.setSize(sz.x, sz.y); }
    this.pass.uniforms.uRes.value.set(sz.x * pr, sz.y * pr);
    this.comp.render();
  }

  // ---- the cars: posed from the replay (frame time tau), or all at rest where the accident left them
  _pose(tau, j) {
    const THREE = this.T3, C = this.clip, n = C.frames.length, u = Math.max(0, Math.min(n - 1.001, tau * C.hz)), k = Math.floor(u), a = u - k;
    const A = C.frames[k], B = C.frames[k + 1], o = j * 7;
    const p = new THREE.Vector3(A[o] + (B[o] - A[o]) * a, A[o + 1] + (B[o + 1] - A[o + 1]) * a, A[o + 2] + (B[o + 2] - A[o + 2]) * a);
    const q = new THREE.Quaternion(A[o + 3], A[o + 4], A[o + 5], A[o + 6]).slerp(new THREE.Quaternion(B[o + 3], B[o + 4], B[o + 5], B[o + 6]), a);
    return { p, q };
  }
  _poseCars(tau, show = true) {
    // (live, after the accidents: only the wrecks are still there, each where it came to rest)
    const live = tau > 1e8;
    if (live) {
      this._restHalves();
      for (const [c, m] of this.meshes) m.group.visible = false;
      if (!show) return;
      for (const I of this.incs) {
        if (!I.clip) { const m = this.meshes.get(I.car); if (m) m.group.visible = true; continue; }
        const C = I.clip, f = C.frames[C.frames.length - 1];
        C.cars.forEach((c, j) => { const m = this.meshes.get(c); if (!m || !(c.retired || I.hurt.includes(c))) return; m.group.visible = true; m.group.position.set(f[j * 7], f[j * 7 + 1], f[j * 7 + 2]); m.group.quaternion.set(f[j * 7 + 3], f[j * 7 + 4], f[j * 7 + 5], f[j * 7 + 6]); });
      }
      return;
    }
    const C = this.clip, inClip = new Set(C ? C.cars : [this.car]);
    for (const [c, m] of this.meshes) { m.group.visible = show && inClip.has(c); m.showPieces?.(!inClip.has(c)); }
    for (const R of this.replicas?.values() || []) { R.group.visible = false; R.showPieces?.(false); }
    if (!show || !C) return;
    C.cars.forEach((c, j) => {
      const m = this.meshes.get(c); if (!m) return;
      const { p, q } = this._pose(tau, j); let target = m;
      // (damaged in it: not the wreck as it is now - a replica, its damage as it was at that moment of the replay:
      //  whole, then the dents, the parts breaking off and flying where they flew, torn in two when it was -
      //  CarMesh.replay, from the car's own record)
      if (this._isWreck(c)) {
        const t = C.t0 + tau, R = this._replica(c, t);
        if (R) { R.group.visible = true; R.showPieces(true); m.group.visible = false; target = R; R.group.position.copy(p); R.group.quaternion.copy(q); R.replay(c, t); }
      }
      target.group.position.copy(p); target.group.quaternion.copy(q);
    });
    this._replayFx(tau);
  }
  /** was this car damaged in the accident (it is shown whole at the start of a replay, and breaks up through it)? */
  _isWreck(c) { const d = c.dmg || {}; return !!(c.retired || c.wreck || c.split || this.hurt.includes(c) || (d.fwL || 0) + (d.fwR || 0) + (d.rw || 0) + (d.susp || 0) > 0.8); }
  /** a replay starting again: the cars whole, the scene clear (the wreck's debris and fire as they are now gone) */
  _replayReset() {
    const F = this.fx; if (F) { F.fire?.clear(); F.debris?.clear(); }   // (the pieces are the replicas' own: CarMesh.replay)
    for (const S of this.rstate?.values() || []) { if (S.fireE) S.fireE.dead = true; S.fireE = null; S.lastK = -1; }
    this._rTau = null;
  }
  /**
   * The accident as it happened, on the replica: at every recorded hit (the replay's crash pulses) debris and sparks
   * fly from where the car was (what it lost, and when, is the replica's own: CarMesh.replay), and if the car burned,
   * the fire takes hold from the engine and grows.
   */
  _replayFx(tau) {
    const C = this.clip, F = this.fx; if (!C || !F || !C.pulses) return;
    const k = Math.min(C.frames.length - 1, Math.floor(tau * C.hz));
    if (this._rTau != null && tau < this._rTau - 0.05) this._replayReset();   // (run again: whole again)
    this._rTau = tau;
    const M = this.rstate || (this.rstate = new Map());
    C.cars.forEach((c, j) => {
      if (!this._isWreck(c)) return;
      const R = this._replica(c); if (!R) return;
      let S = M.get(c); if (!S || S.R !== R) { S = { R, lastK: -1, fireE: null, peak: Math.max(1, ...C.pulses.map((pp) => pp[j] || 0)) }; M.set(c, S); }
      const col = R.livery.color.getHex(), o = j * 7;
      for (let f = Math.max(0, S.lastK + 1); f <= k; f++) {
        const g = C.pulses[f]?.[j] || 0; if (g < 6) continue;
        const quiet = f < k - 2;   // (catching up: a replay starting part-way through - the damage done, no shower of old debris)
        const A = C.frames[f], B = C.frames[Math.max(0, f - 1)], x = A[o], y = A[o + 1], z = A[o + 2], vx = (A[o] - B[o]) * C.hz, vz = (A[o + 2] - B[o + 2]) * C.hz;
        if (!quiet) { F.debris?.burst(x, z, vx, vz, Math.min(18, 2 + Math.round(g / 3)), col); F.fire?.sparks(x, y + 0.3, z, Math.min(70, Math.round(g * 1.6)), vx, vz); }
        if (g >= Math.min(20, S.peak * 0.6)) {
          if (!S.fireE && (c._burned || g >= 45) && F.fire) {
            const e = F.fire.add((out) => { if (!R.group.visible) return false; R.body.localToWorld(out.set(-1.3, 0.55, 0)); return true; }, 'fire', 0.4, () => false);
            e.replay = true; e.born = tau; S.fireE = e;
          }
        }
      }
      if (S.fireE) S.fireE.k = Math.min(1.6, 0.4 + (tau - S.fireE.born) * 0.5);
      S.lastK = k;
    });
  }
  /**
   * A car standing in for a damaged one in the replays (CarMesh.replay shows its damage as it was at race time t). A
   * replica torn in two cannot be whole again: replayed from before the tear, it is made anew.
   */
  _replica(c, t = Infinity) {
    if (!this.makeCarMesh) return null;
    const M = this.replicas || (this.replicas = new Map());
    let R = M.get(c);
    if (R && R.splitDone && t < (c.splitT ?? -Infinity)) { this.scene.remove(R.group); R.dispose(); M.delete(c); R = null; }
    if (!R) { R = this.makeCarMesh(c); this.scene.add(R.group); M.set(c, R); }
    return R;
  }
  /** the real cars as they are now (live shots, the end): their halves and pieces where they came to rest */
  _restHalves() {
    for (const m of this.meshes.values()) { if (m.half) m.half.visible = true; m.showPieces?.(true); }
    for (const R of this.replicas?.values() || []) { R.group.visible = false; R.showPieces?.(false); }
  }

  // ---- sound: a news sting, a low pad under it all; the phone's own sound (wind, the crowd, the impact); silence
  _audioStart() {
    const A = this.audio; A.quiet?.(); A.setMuffle?.(0);
    if (!A.ready || A.muted) return;
    const ctx = A.ctx, t = ctx.currentTime;
    [[659.3, 0], [987.8, 0.16], [880, 0.32], [1318.5, 0.5]].forEach(([f, d]) => setTimeout(() => A.beep(f, 0.5, 0.09), d * 1000));
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 3); g.connect(A.fx);
    this.pad = [73.42, 110, 164.8].map((f, i) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; const og = ctx.createGain(); og.gain.value = [1, 0.6, 0.25][i]; o.connect(og); og.connect(g); o.start(); return o; });
    this.padGain = g;
    this._atmos();
  }
  /**
   * Under the whole broadcast, low: dark, scraping atmospheres (assets/audio/atmos1-3), one after another in a random
   * order - not loud enough to take over, enough to leave the viewer uneasy.
   */
  _atmos() {
    const A = this.audio; if (!A.music) return;
    const order = shuffle(['atmos1', 'atmos2', 'atmos3']); let i = 0;
    const next = () => { if (this.done) return; this.atmosH = A.music(order[i++ % order.length], { gain: 0.3, fadeIn: i === 1 ? 4 : 1.5, onEnd: next }); };
    next();
  }
  /** the pad's chord (three notes, Hz), gliding there */
  _chord(f) { if (!this.pad) return; const t = this.audio.ctx.currentTime; this.pad.forEach((o, i) => o.frequency.setTargetAtTime(f[i], t, 0.8)); }
  _padTo(v, tc = 1.5) { if (this.padGain) this.padGain.gain.setTargetAtTime(v, this.audio.ctx.currentTime, tc); }
  _phoneSound(on) {
    const A = this.audio; if (!A.ready || A.muted) return;
    const ctx = A.ctx;
    if (on && !this.wind) {
      const n = A._noise(30); n.loop = true; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 650; bp.Q.value = 0.6;
      const g = ctx.createGain(); g.gain.value = 0.12; n.connect(bp); bp.connect(g); g.connect(A.fx); n.start(); this.wind = { n, g };
    } else if (!on && this.wind) { this.wind.g.gain.setTargetAtTime(0, ctx.currentTime, 0.2); const w = this.wind; setTimeout(() => { try { w.n.stop(); } catch (e) { /* stopped */ } }, 800); this.wind = null; }
  }
  /**
   * The crowd under a replay (assets/audio/crowd.mp3): the grandstand through the phone's small microphone in the
   * spectators' footage, the circuit's atmosphere on the world feed; a new take of it at each cut.
   */
  _crowd(on, phone, k) {
    const A = this.audio; if (!A.play) return;
    // each recording its own stretch of the crowd (a quarter of the track apart: two phones in two places, the feed's
    // own microphones), kept low under the news; at a cut the last one fades away as the next fades in
    if (this.crowdBase == null) this.crowdBase = Math.random() * 30;
    if (this.crowdH) { this.crowdH.stop(0.7); this.crowdH = null; }
    if (on) {
      const off = (this.crowdBase + { phone: 0, slow: 15, analysis: 7.5, heli: 22.5 }[k] + (this.I ? this.incs.indexOf(this.I) * 4 : 0)) % 30;
      this.crowdLvl = phone ? 0.5 : 0.28;
      this.crowdH = A.play('crowd', { gain: this.crowdLvl, loop: true, offset: off, lowpass: phone ? 3200 : 0, fadeIn: 0.6, rate: phone ? 1 : 0.98 });
    }
  }
  /** the moment of the crash, in a replay: the crowd's gasp, then its groan, over the noise - and the cheering falls away */
  _shocked(phone) {
    const A = this.audio; if (!A.play) return;
    const lp = phone ? 3600 : 0;
    A.play('gasp', { gain: phone ? 0.7 : 0.5, lowpass: lp, rate: 0.95 + Math.random() * 0.1 });
    A.play('groan', { gain: phone ? 0.65 : 0.45, lowpass: lp, delay: 0.4 + Math.random() * 0.3, rate: 0.96 + Math.random() * 0.08 });
    this.crowdH?.to(this.crowdLvl * 0.3, 0.9);
  }
  _impactSound(k) {
    const A = this.audio; if (!A.ready || A.muted) return;
    A.punch(0.5 * k); A.crunch(0.7 * k);
    const ctx = A.ctx, t = ctx.currentTime, n = A._noise(2.6), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1300; bp.Q.value = 0.9;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5 * k, t + 0.25); g.gain.exponentialRampToValueAtTime(0.001, t + 2.6);
    n.connect(bp); bp.connect(g); g.connect(A.fx); n.start(t);
  }

  // ---- the broadcast, frame by frame ------------------------------------------------------------------------------------
  update(dt) {
    if (this.done) return;
    this.t += dt; const t = this.t, THREE = this.T3, U = this.pass.uniforms, cam = this.camera;
    if (t >= this.total) { this.finish(); return; }
    const seg = this.plan.find((s) => t >= s.t0 && t < s.t0 + s.dur) || this.plan[this.plan.length - 1], st = t - seg.t0;
    if (seg !== this.seg) this._enter(seg);
    U.uTime.value = t; U.uGlitch.value = 0;
    // (under the tribute and the silence the pad moves through slow minor chords: Am - F - C - G)
    if (seg.k === 'prayers' || seg.k === 'silence') { const ch = Math.floor(t / 3.6) % 4; if (ch !== this._ch) { this._ch = ch; this._chord([[110, 164.8, 261.6], [87.3, 130.8, 220], [130.8, 196, 329.6], [98, 146.8, 246.9]][ch]); } }
    else if (this._ch != null) { this._ch = null; this._chord([73.42, 110, 164.8]); }
    U.uFade.value = Math.max(0, 1 - st / 0.35);   // (each cut through black)
    if (this.cc) {
      this.cc.t += dt; let tt = this.cc.t, i = 0; const L = this.cc.lines;
      while (i < L.length - 1 && tt > L[i].length / 34 + 1.6) { tt -= L[i].length / 34 + 1.6; i++; }
      this.$('.cc').textContent = L[i].slice(0, Math.floor(tt * 34));
    }
    if (seg.k === 'breaking') {
      // live, from the helicopter: a slow circle over the wreck (over each in turn when there are several)
      const I = this.incs[this.incs.length > 1 && st > seg.dur / 2 ? 1 : 0], rest = I.rest;
      this._poseCars(1e9);
      const a = 0.6 + t * 0.05, r = 95, h = 58 + Math.sin(t * 0.4) * 2;
      cam.position.set(rest.x + Math.cos(a) * r, h, rest.z + Math.sin(a) * r); cam.up.set(0, 1, 0); cam.lookAt(rest.x + Math.sin(t * 0.7) * 1.2, rest.y, rest.z);
      this._fov(24 - st * 0.6);
      this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0, uSat: 0.92, uExpo: 1, uGrain: 0.035, uVig: 0.35 });
      if (this.incs.length > 1 && Math.abs(st - seg.dur / 2) < dt) U.uFade.value = 1;
    } else if (seg.k === 'warning') {
      this._poseCars(0); U.uFade.value = 1;
    } else if (seg.k === 'phone' || seg.k === 'slow') {
      const tau = seg.k === 'phone' ? st : Math.max(0, this.impactT - 1.6) + st * 0.6;
      if (seg.k === 'phone' && !this._hit && tau >= this.impactT) { this._hit = true; this._shock = t; this._impactSound(1); this._shocked(true); }
      if (seg.k === 'slow' && !this._hit2 && tau >= this.impactT) { this._hit2 = true; this._shock = t; this._shocked(true); }
      this._poseCars(tau);
      this._phoneCam(dt, tau, t);
      const shock = this._shock != null ? Math.exp(-(t - this._shock) * 2.2) : 0, P = this.cur.P, ch = this._chaos(tau);
      // (focus hunting now and then, compression bursting, exposure pumping; after the impact: focus lost, a head in front)
      this._set({ uPhone: 1, uDefocus: P.defocus + 0.003 * Math.max(0, Math.sin(t * 0.9) - 0.75) * 4 + 0.006 * shock + ch * 0.006 * (0.6 + 0.4 * Math.sin(t * 3.1)),
        uBlock: P.block * (1 + 0.4 * shock + 0.5 * ch) + ((P.block > 2 || ch > 0.3) && Math.random() < 0.03 + 0.1 * ch ? 2 + 3 * ch : 0),
        uSat: P.sat, uExpo: P.expo * (1 + 0.07 * Math.sin(t * 1.3)) + 0.25 * shock + ch * 0.3 * Math.sin(t * 2.3), uGrain: P.grain * (1 + ch), uClip: P.clip, uVig: 0.2,
        uOcc: ch * Math.max(0, Math.sin(t * 0.8 + 1)), uOccX: 0.5 + 0.12 * Math.sin(t * 0.6) });
      U.uTint.value.set(...P.tint);
    } else if (seg.k === 'analysis') {
      // the world feed: a tracking shot from up on a tower, slowed into the first hit and frozen on it, a ring round the car
      const hitT = this.firstHitT + 0.15, frozen = st > seg.dur - 3.8, tau = Math.max(0, Math.min(hitT, hitT - (seg.dur - 3.8) * 0.4 + st * 0.4));
      if (!this._gasped && tau >= this.firstHitT) { this._gasped = true; this._shocked(false); }
      this._poseCars(tau);
      const tgt = this._pose(tau, this.clip.focus).p, bc = this.bc || { x: tgt.x + 40, y: 10, z: tgt.z };
      if (!this.bcAim || st < 0.05) this.bcAim = tgt.clone(); else this.bcAim.lerp(tgt, Math.min(1, dt * 6));
      cam.position.set(bc.x, bc.y, bc.z); cam.up.set(0, 1, 0); cam.lookAt(this.bcAim);
      const dist = cam.position.distanceTo(tgt), hf = 2 * Math.atan(9 / dist), vf = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hf / 2) / (cam.aspect || 1.7)));
      this._fov(Math.max(3, Math.min(40, vf)));
      this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0, uSat: 0.95, uExpo: 1, uGrain: 0.02, uVig: 0.3 });
      const tele = this.$('.tele');
      if (frozen) {
        cam.updateMatrixWorld(); const v = tgt.clone().add(new THREE.Vector3(0, 0.5, 0)).project(cam), W = innerWidth, H = innerHeight;
        const c = tele.querySelector('circle'), r = Math.max(26, Math.min(220, (3.4 / (dist * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2))) * H / 2));
        c.setAttribute('cx', ((v.x + 1) / 2) * W); c.setAttribute('cy', ((1 - v.y) / 2) * H); c.setAttribute('r', r);
        tele.classList.add('in');
      }
    } else if (seg.k === 'heli') {
      // the helicopter: circling high above, a long lens following the car through it, a little vibration
      const tau = Math.max(0, this.firstHitT - 2) + st * 0.75;
      if (!this._gasped && tau >= this.firstHitT) { this._gasped = true; this._shocked(false); }
      this._poseCars(tau);
      const tgt = this._pose(tau, this.clip.focus).p, base = this.heliBase || (this.heliBase = { a: Math.random() * 6.28 });
      if (!this.heliAim || st < 0.05) this.heliAim = tgt.clone(); else this.heliAim.lerp(tgt, Math.min(1, dt * 2.5));
      const a = base.a + st * 0.06, R = 130, h = 85;
      cam.position.set(this.heliAim.x + Math.cos(a) * R, h + Math.sin(t * 0.5) * 0.8, this.heliAim.z + Math.sin(a) * R); cam.up.set(0, 1, 0); cam.lookAt(this.heliAim);
      cam.rotateX((Math.random() - 0.5) * 0.0012); cam.rotateY((Math.random() - 0.5) * 0.0012);
      const dist = cam.position.distanceTo(this.heliAim); this._fov(THREE.MathUtils.radToDeg(2 * Math.atan(16 / dist)));
      this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0, uSat: 0.9, uExpo: 1, uGrain: 0.03, uVig: 0.3 });
    } else if (seg.k === 'interview1' || seg.k === 'interview2') {
      // in front of the team's garage: a reporter's camera on the shoulder, the microphone in shot
      this._poseCars(1e9, false);
      const S = this.set3d, P = S?.person;
      if (S) {
        cam.position.copy(S.cam).add(new THREE.Vector3(Math.sin(t * 0.7) * 0.01, Math.sin(t * 1.3) * 0.008, 0)); cam.up.set(0, 1, 0); cam.lookAt(S.look); cam.rotateZ(0.012 * Math.sin(t * 0.5)); this._fov(27);
        for (const m of S.mics || []) m.position.y += Math.sin(t * 3 + m.id) * 0.0004;   // (the hands holding them)
        P.head.rotation.z = P.bow + 0.05 * Math.sin(t * 5.3) * Math.max(0, Math.sin(t * 1.7)) - 0.03; P.head.rotation.y = 0.06 * Math.sin(t * 0.8);
      }
      this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0, uSat: 0.95, uExpo: 1.02, uGrain: 0.02, uVig: 0.35 });
    } else if (seg.k === 'tcam' || seg.k === 'tcam2') {
      this._onboard(seg, st, dt);
    } else if (seg.k === 'headlines') {
      // the wreck, live, on a long lens from along the circuit, dimmed behind the papers
      this._poseCars(1e9);
      const tv = this.tv, rest = this.rest;
      cam.position.set(tv.x, tv.y, tv.z); cam.up.set(0, 1, 0); cam.lookAt(rest.x + Math.sin(st * 0.25) * 3, rest.y + 0.4, rest.z);
      this._fov(tv.fov * (1 - st * 0.02));
      this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0.004, uSat: 0.8, uExpo: 0.62, uGrain: 0.04, uVig: 0.6 });
      const gap = (seg.dur - 1) / this.papers.length;
      this.papers.forEach((p, i) => { const on = st > 0.5 + i * gap; p.classList.toggle('in', on); p.classList.toggle('back', on && st > 0.5 + (i + 1) * gap && i < this.papers.length - 1); });
    } else if (seg.k === 'prayers' || seg.k === 'wishes') {
      // the flowers and candles in front of the garage, low and slow (or the crowd in the grandstand, with no pit lane)
      this._poseCars(1e9, !this.set3d?.tribute);
      const S = this.spot.stand, rest = this.rest, T = this.set3d?.tribute;
      if (T) {
        const u = st / seg.dur, a = T.from.clone().lerp(T.to, u);
        cam.position.set(a.x, 0.9 - 0.15 * u, a.z); cam.up.set(0, 1, 0); cam.lookAt(T.look.x + (T.to.x - T.from.x) * 0.25 * u, 0.6, T.look.z + (T.to.z - T.from.z) * 0.25 * u); this._fov(44);
        for (const f of T.flames) f.scale.y = 1.6 + 0.4 * Math.sin(t * 9 + f.userData.ph);
        this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0.0015, uSat: 0.75, uExpo: 0.85, uGrain: 0.035, uVig: 0.6 });
      } else if (S) {
        const L = S.len, lx = -L * 0.3 + (L * 0.6) * (st / seg.dur), [x, z] = S.world(lx, -28), [tx, tz] = S.world(lx * 0.8, (S.depth || 12) * 0.5);
        cam.position.set(x, 3.2, z); cam.up.set(0, 1, 0); cam.lookAt(tx, Math.max(3, ((S.height || 14) - 6) * 0.5), tz); this._fov(42);
      } else { const a = 2.2 + t * 0.04; cam.position.set(rest.x + Math.cos(a) * 40, 14, rest.z + Math.sin(a) * 40); cam.lookAt(rest); this._fov(35); }
      this._set(seg.k === 'wishes' ? { uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0.002, uSat: 0.95, uExpo: 1, uGrain: 0.025, uVig: 0.35 } : { uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0.003, uSat: 0.7, uExpo: 0.7, uGrain: 0.04, uVig: 0.55 });
      const gap = Math.min(1.25, (seg.dur - 1) / Math.max(1, this.posts.length));
      this.posts.forEach((p, i) => p.classList.toggle('in', st > 0.4 + i * gap));
    } else if (seg.k === 'silence') {
      // the grid: the drivers on one knee in a line across it, the teams behind; three-quarters on, tracking along the line
      this._poseCars(0, false);
      const tr = this.track, hw = tr.halfWidth, u = st / seg.dur, d = (-0.95 + 0.7 * u) * hw;
      const a = tr.sample(tr.wrapS(9.5 - u * 1.5), d), b = tr.sample(tr.wrapS(4), d + hw * 0.55);
      cam.position.set(a.x, 1.2, a.z); cam.up.set(0, 1, 0); cam.lookAt(b.x, 0.65, b.z); this._fov(40);
      this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0.0015, uSat: 0.35, uExpo: 0.8, uGrain: 0.04, uVig: 0.65 });
    } else if (seg.k === 'gates' || seg.k === 'coach' || seg.k === 'family' || seg.k === 'confirm') {
      this._poseCars(1e9, false);
      const S = this.set3d, u = st / seg.dur;
      if (S?.shot) {
        const a = S.shot.from.clone().lerp(S.shot.to, u), l = S.shot.look.clone().lerp(S.shot.look2 || S.shot.look, Math.max(0, (u - 0.45) / 0.55) ** 1.5);
        cam.position.copy(a).add(new THREE.Vector3(Math.sin(t * 0.6) * 0.01, Math.sin(t * 0.9) * 0.008, 0)); cam.up.set(0, 1, 0); cam.lookAt(l); this._fov(S.shot.fov || 40);
        for (const f of S.flames || []) f.scale.y = 1.6 + 0.4 * Math.sin(t * 9 + f.userData.ph);
        if (S.person) { const P = S.person; P.head.rotation.z = P.bow + 0.05 * Math.sin(t * 5.1) * Math.max(0, Math.sin(t * 1.6)) - 0.03; }
      }
      this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: seg.k === 'coach' ? 0.001 : 0.0025, uSat: seg.k === 'coach' ? 0.75 : 0.5, uExpo: 0.75, uGrain: 0.045, uVig: 0.65 });
      if (seg.k === 'family') { const ps = this.el.querySelectorAll('.family .lines p'); ps.forEach((p, i) => p.classList.toggle('in', st > 1.2 + i * 2.6)); }
    } else if (seg.k === 'medical') {
      this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0.004, uSat: 0.4, uExpo: 0.7, uGrain: 0.04, uVig: 0.7 });
    } else if (seg.k === 'out') {
      U.uFade.value = Math.min(1, st / (seg.dur * 0.8)); this.el.style.transition = 'opacity 1.2s'; this.el.style.opacity = '0';
    }
  }
  /**
   * The T-cam (above the airbox, looking ahead, rolling with the car). The car behind: zoomed into by the director. A
   * crashed car's own: its first hit gets through, then every heavy blow hurts the feed - it freezes, stutters,
   * breaks up - and on the biggest it is lost for a moment and comes back further on.
   */
  _onboard(seg, st, dt) {
    const THREE = this.T3, C = this.clip, own = seg.k === 'tcam2', U = this.pass.uniforms, cam = this.camera;
    const j = own ? Math.max(0, C.cars.indexOf(seg.who || this.car)) : this.other, H = own ? (this.ownHits || (this.ownHits = this._hits(j))) : { firstHitT: this.firstHitT, obStart: this.obStart };
    const real = H.obStart + st;
    const O = this.ob || (this.ob = { tau: real, hold: 0, lost: 0, lag: 0, stut: 0, lastK: -1 });
    if (own) {
      // only a hard hit (the physics' own pulse, 15 g and over: nothing a corner or a kerb does) touches the feed: it
      // freezes on the picture of the hit for a moment and stutters back; the very hardest (50 g+) lose it briefly
      const k = Math.round(real * C.hz), g = this._g(real, false, j);
      if (k !== O.lastK && g >= 15 && O.hold <= 0 && O.lost <= 0) {
        O.lastK = k; O.tau = real;
        if (g >= 50 && !O.lostOnce) { O.lostOnce = true; O.hold = 0.2; O.lost = 0.45 + Math.random() * 0.3; } else O.hold = Math.min(0.45, 0.12 + g * 0.005);
        O.stut = 0.4;
        if (this.audio.ready && !this.audio.muted) this.audio.crunch(Math.min(1, g / 30));
      }
    }
    const lostEl = this.$('.lost');
    if (O.hold > 0) O.hold -= dt;   // (frozen: the picture of the hit stays up)
    else if (O.lost > 0) { O.lost -= dt; O.tau = real; U.uFade.value = 1; lostEl.classList.add('in'); return; }
    else if (O.stut > 0) { O.stut -= dt; O.lag -= dt; if (O.lag <= 0) { O.tau = real; O.lag = 0.07 + Math.random() * 0.06; } }   // (stuttering back)
    else O.tau = real;
    lostEl.classList.remove('in');
    this._poseCars(O.tau);
    const { p, q } = this._pose(O.tau, j);
    const off = new THREE.Vector3(0.1, 1.12, 0).applyQuaternion(q), fwd = new THREE.Vector3(30, 0.8, 0).applyQuaternion(q), up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    cam.position.copy(p).add(off); cam.up.copy(up); cam.lookAt(cam.position.clone().add(fwd));
    cam.rotateX((Math.random() - 0.5) * 0.004); cam.rotateY((Math.random() - 0.5) * 0.003);   // (the mount's vibration)
    this._fov(own ? 68 : 58);
    if (cam.view?.enabled) cam.clearViewOffset();
    if (!own) {
      cam.updateMatrixWorld();
      const tp = this._pose(O.tau, C.focus).p.add(new THREE.Vector3(0, 0.5, 0)), dist = tp.distanceTo(cam.position), v = tp.clone().project(cam);
      const Z = Math.max(1, Math.min(3.2, dist / 26)), W = 1000, Hh = W / (cam.aspect || 1.7);
      if (v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1) {
        const px = (v.x + 1) / 2 * W, py = (1 - v.y) / 2 * Hh;
        this.crop = this.crop ? { x: this.crop.x + (px - this.crop.x) * Math.min(1, dt * 4), y: this.crop.y + (py - this.crop.y) * Math.min(1, dt * 4), z: this.crop.z + (Z - this.crop.z) * Math.min(1, dt * 2) } : { x: px, y: py, z: 1 };
      }
      if (this.crop && this.crop.z > 1.02) {
        const w = W / this.crop.z, h = Hh / this.crop.z;
        cam.setViewOffset(W, Hh, Math.max(0, Math.min(W - w, this.crop.x - w / 2)), Math.max(0, Math.min(Hh - h, this.crop.y - h / 2)), w, h);
      }
    }
    this._set({ uPhone: 0, uClip: 0, uOcc: 0, uDefocus: 0, uSat: 1, uExpo: 1, uGrain: 0.02, uVig: 0.25, uGlitch: 0 });
  }
  /** the people for this segment: the interviewee in front of the garage, the grid taking a knee; gone after it */
  /** the straight nearest track position s (70 m with no corner), searching outward -> its middle */
  _straightNear(s) {
    const tr = this.track, ok = (x) => { for (let k = -35; k <= 35; k += 7) if (tr.inCornerZone(tr.idxAtS(tr.wrapS(x + k)))) return false; return true; };
    for (let d = 0; d < tr.length / 2; d += 15) for (const x of [s + d, s - d]) if (ok(x)) return tr.wrapS(x);
    return tr.wrapS(-140);
  }
  _set3d(seg) {
    const THREE = this.T3, k = seg?.k;
    if (this.set3d) { this.scene.remove(this.set3d.group); for (const p of this.set3d.people) p.dispose(); this.set3d.group.traverse((o) => { o.userData.dispose?.(); if (o.isMesh && !this.set3d.people.some((p) => p.group === o)) o.geometry.dispose(); }); this.set3d = null; }
    if (this.backdrop) { this.backdrop.geometry.dispose(); this.backdrop.material.map.dispose(); this.backdrop.material.dispose(); this.backdrop = null; }
    const group = new THREE.Group(), people = [], add = (p, x, z, face) => { p.group.position.set(x, 0, z); p.group.rotation.y = face; group.add(p.group); people.push(p); return p; };
    const facing = (dx, dz) => Math.atan2(-dz, dx);   // (a person faces +x: turned to look along (dx, dz))
    if ((k === 'interview1' || k === 'interview2') && this.pit) {
      // whose garage: the hurt driver's team (the team principal), or the speaker's own (a fellow driver)
      // the media pen in front of the team's garage: the interviewee in the team jacket (a driver in the cap), a rail,
      // a cluster of microphones held up from below, a phone recording, the press officer at the side, the team's
      // dark wall with its lit strips behind; a tight, slightly handheld head-and-shoulders shot
      const sp = k === 'interview1' ? seg.who || this.car : this.speaker;
      const P = this.pit, ps = P.samples, gs = -P.trackSide, hw = P.halfWidth;
      const box = P.boxFor(sp.boxIdx ?? 0), i = Math.max(0, Math.min(ps.n - 1, box.i + (k === 'interview2' ? 3 : 0)));
      const at = (lat, along = 0) => [ps.px[i] + ps.nx[i] * gs * lat + ps.tx[i] * along, ps.pz[i] + ps.nz[i] * gs * lat + ps.tz[i] * along];
      const tx = ps.tx[i], tz = ps.tz[i], [px, pz] = at(hw - 0.5), [cx, cz] = at(hw - 1.95, -0.32);
      const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
      const who = makePerson({ pose: 'talk', kit: 'jacket', color: sp.color, accent: sp.color2 || '#ffffff', cap: k === 'interview2', jitter: 0.01, driver: k === 'interview2' ? sp.name : null, teamName: sp.team });   // (a fellow driver looks like themselves; a team principal is nobody in particular)
      add(who, px, pz, facing(cx - px, cz - pz) + 0.12);
      const mouth = V3(px, 1.55, pz), toCam = V3(cx - px, 0, cz - pz).normalize(), side = V3(tx, 0, tz);
      // the microphones (made-up broadcasters), each held by an arm reaching in from below
      const flags = shuffle([['#c8102e', 'F1 NEWS'], ['#0b3d91', 'GP TV'], ['#f2c200', 'RACE 24', '#111'], ['#ffffff', 'APEX', '#d4002a'], ['#1aa34a', 'PIT LANE'], ['#6a1b9a', 'GRID FM']]).slice(0, 4 + ((Math.random() * 2) | 0));
      const mics = [];
      flags.forEach(([col, label, ink], m) => {
        // (held up under the chin, fanned out across it; the hands below, the arms coming up steeply from out of shot)
        const off = (m - (flags.length - 1) / 2) * 0.085 + (Math.random() - 0.5) * 0.02;
        const head = mouth.clone().addScaledVector(toCam, 0.12 + Math.random() * 0.07).addScaledVector(side, off).add(V3(0, -0.1 - Math.random() * 0.08, 0));
        const mic = makeMic(col, label, ink); mic.position.copy(head); mic.lookAt(mouth); mic.rotateY(-Math.PI / 2); mic.rotateX((Math.random() - 0.5) * 0.4); group.add(mic); mics.push(mic);
        const hand = head.clone().addScaledVector(toCam, 0.21).add(V3(0, -0.1, 0)), shoulder = hand.clone().addScaledVector(toCam, 0.3).addScaledVector(side, off * 3 + Math.sign(off || 1) * 0.15).add(V3(0, -0.85, 0));
        group.add(makeArm(shoulder, hand, pick(['#2b2e35', '#3a3f48', '#1c2a44', '#4a4a4a']), pick(['#f1d2b6', '#e3b994', '#cf9a72', '#8d5a3b'])));
      });
      const phone = makePhone(), ph = mouth.clone().addScaledVector(toCam, 0.2).addScaledVector(side, -0.26).add(V3(0, -0.04, 0)); phone.position.copy(ph); phone.lookAt(cx, 1.5, cz); group.add(phone);
      group.add(makeArm(ph.clone().addScaledVector(toCam, 0.3).addScaledVector(side, -0.35).add(V3(0, -0.8, 0)), ph.clone().add(V3(0, -0.06, 0)), '#2b2e35'));
      // the crew's camera light on the interviewee (a lift of their own materials: a new light would recompile the scene)
      who.group.traverse((m) => { if (m.isMesh && m.material.emissive) m.material.emissive.copy(m.material.color).multiplyScalar(0.32); });
      // the press officer at the side, recording on a phone held in both hands - upright, the head bowed to it as the pose
      // holds it, the phone in the hands
      const [ox, oz] = at(hw - 0.8, 0.85), off = makePerson({ pose: 'record', kit: 'polo', color: sp.color, jitter: 0.01 });
      add(off, ox, oz, facing(cx - ox, cz - oz) - 0.7);
      const ob = off.group.children[0], toG = (p) => p.applyMatrix4(ob.matrix).applyMatrix4(off.group.matrix); off.group.updateMatrix(); ob.updateMatrix();
      const op = makePhone(); op.position.copy(toG(off.wrR.clone().setZ(0).add(V3(0.035, 0.035, 0)))); op.lookAt(toG(off.neck.clone())); group.add(op);
      // the rail of the pen, between the journalists and the interviewee
      const railMat = new THREE.MeshStandardMaterial({ color: '#8b9099', roughness: 0.4, metalness: 0.6 });
      const [rx, rz] = at(hw - 1.05); const rail = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.05, 0.05), railMat); rail.position.set(rx, 1.0, rz); rail.rotation.y = facing(tx, tz); group.add(rail);
      // the team's wall: dark, its name, lit vertical strips in the team's colour
      const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 768; const x2 = cv.getContext('2d');
      x2.fillStyle = '#121418'; x2.fillRect(0, 0, 1024, 768);
      for (const sx of [170, 610, 900]) { const gr = x2.createLinearGradient(sx - 30, 0, sx + 30, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.5, sp.color); gr.addColorStop(1, 'rgba(0,0,0,0)'); x2.fillStyle = gr; x2.fillRect(sx - 30, 120, 60, 520); x2.fillStyle = '#ffffff'; x2.globalAlpha = 0.55; x2.fillRect(sx - 4, 140, 8, 480); x2.globalAlpha = 1; }
      x2.fillStyle = '#d9dce2'; x2.font = '800 54px "Segoe UI", Arial, sans-serif'; x2.textAlign = 'center'; x2.fillText(String(sp.team || '').toUpperCase(), 390, 380);
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      const bd = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.4), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.5 }));
      const [bx, bz] = at(hw + 0.7, 0.3); bd.position.set(bx, 1.6, bz); bd.lookAt(cx, 1.6, cz); group.add(bd); this.backdrop = bd;
      // someone behind, out at the side of the pen
      const [qx, qz] = at(hw + 0.1, -1.6); add(makePerson({ pose: 'talk', kit: 'polo', color: pick(this.cars).color, jitter: 0.02 }), qx, qz, facing(tx, tz) + 0.4);
      this.scene.add(group);
      this.set3d = { group, people, person: who, mics, cam: V3(cx, 1.6, cz), look: V3(px, 1.5, pz).addScaledVector(side, -0.08) };
    } else if (k === 'prayers' && this.pit) {
      // the tribute: bouquets and candles laid in front of the garage, cards for each of them; the team standing by
      const P = this.pit, ps = P.samples, gs = -P.trackSide, hw = P.halfWidth, Ds = this.Ds, c0 = Ds[0].c;
      const box = P.boxFor(c0.boxIdx ?? 0), i = Math.max(0, Math.min(ps.n - 1, box.i));
      const at = (lat, along = 0, y = 0) => new THREE.Vector3(ps.px[i] + ps.nx[i] * gs * lat + ps.tx[i] * along, y, ps.pz[i] + ps.nz[i] * gs * lat + ps.tz[i] * along);
      const N = 70, M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), S3 = new THREE.Vector3(), E = new THREE.Euler(), col = new THREE.Color();
      const wraps = new THREE.InstancedMesh(new THREE.ConeGeometry(0.06, 0.32, 8, 1, true).rotateZ(-Math.PI / 2).translate(0.16, 0, 0), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.8 }), N);
      const blooms = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshStandardMaterial({ roughness: 0.7 }), N * 10);
      const leaves = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshStandardMaterial({ color: '#2f6b2a', roughness: 0.8 }), N * 3);
      const BLOOM = ['#f4f1ea', '#f4f1ea', '#d7263d', '#f7d6e0', '#f2c14e', '#9b5de5', '#ffffff', '#e8a0bf'], WRAP = ['#efe6d2', '#f5f5f5', '#d9c4a5', '#e9e1f2', '#1c1c1c'];
      let bi = 0, li = 0;
      for (let n = 0; n < N; n++) {
        const along = (Math.random() - 0.5) * 6, lat = hw + 0.7 - Math.random() * 1.6 * (1 - Math.abs(along) / 6);
        const p = at(lat, along, 0.06 + Math.random() * 0.05), yaw = Math.random() * 6.28;
        Q.setFromEuler(E.set((Math.random() - 0.5) * 0.4, yaw, (Math.random() - 0.5) * 0.3)); const base = M4.compose(p, Q, S3.set(1, 1, 1)).clone();
        wraps.setMatrixAt(n, base); wraps.setColorAt(n, col.set(pick(WRAP)));
        const tone = pick(BLOOM);   // (a bouquet mostly of one flower, a few others in it)
        for (let b = 0; b < 10; b++) { const r = 0.016 + Math.random() * 0.014, a = Math.random() * 6.28, rr = Math.random() * 0.055; blooms.setMatrixAt(bi, base.clone().multiply(M4.compose(S3.set(0.31 + Math.random() * 0.06, Math.cos(a) * rr, Math.sin(a) * rr), Q.identity(), new THREE.Vector3(r, r, r)))); blooms.setColorAt(bi++, col.set(Math.random() < 0.7 ? tone : pick(BLOOM))); }
        for (let b = 0; b < 3; b++) leaves.setMatrixAt(li++, base.clone().multiply(M4.compose(S3.set(0.3 + Math.random() * 0.06, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1), Q.identity(), new THREE.Vector3(0.05, 0.012, 0.025))));
      }
      group.add(wraps, blooms, leaves);
      // candles in front of them
      const NC = 26, candles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.028, 0.03, 1, 10).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: '#f3eee2', roughness: 0.6, emissive: '#3a2a10', emissiveIntensity: 0.4 }), NC);
      const flameMat = new THREE.MeshBasicMaterial({ color: '#ffc46b' }), flames = [];
      for (let n = 0; n < NC; n++) {
        const h = 0.07 + Math.random() * 0.1, p = at(hw - 1.0 - Math.random() * 0.5, (Math.random() - 0.5) * 5.5);
        candles.setMatrixAt(n, M4.compose(p, Q.identity(), S3.set(1, h, 1)));
        const f = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), flameMat); f.position.set(p.x, h + 0.02, p.z); f.scale.y = 1.8; f.userData.ph = n * 1.7; group.add(f); flames.push(f);
      }
      group.add(candles);
      // the cards: one for each of them, leaning against the garage
      Ds.forEach((D, n) => {
        const cv = document.createElement('canvas'); cv.width = 512; cv.height = 360; const x = cv.getContext('2d');
        x.fillStyle = '#fbfaf6'; x.fillRect(0, 0, 512, 360); x.fillStyle = D.color; x.fillRect(0, 0, 512, 26);
        x.fillStyle = '#1b1b1b'; x.textAlign = 'center'; x.font = '700 54px "Segoe Print", "Bradley Hand", cursive';
        const fit = (txt, y, px) => { let s = px; do { x.font = `700 ${s}px "Segoe Print", "Bradley Hand", cursive`; s -= 2; } while (x.measureText(txt).width > 430 && s > 20); x.fillText(txt, 256, y); };   // (shrunk to fit the card)
        fit(pick(['Never forget', 'Forever #' + (D.c.number ?? ''), 'Always with us', 'In our hearts']), 140, 54); fit(D.first + ' ' + String(D.c.number ?? '').trim(), 220, 54);
        x.font = '600 34px "Segoe Print", "Bradley Hand", cursive'; x.fillStyle = D.color; x.fillText(`#PrayFor${D.tag}`, 256, 300);
        const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
        const card = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.67), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25, side: THREE.DoubleSide }));
        const along = (n - (Ds.length - 1) / 2) * 1.4 + 0.6, p = at(hw + 0.8, along, 0.55), q = at(hw - 3, along, 0.75);
        card.position.copy(p); card.lookAt(q); group.add(card);
      });
      // banners on the garage above them: prayers, never forget
      Ds.forEach((D, n) => {
        const lines = [[`NEVER FORGET`, `${D.LAST} #${D.c.number ?? ''}`], [`PRAY FOR`, D.LAST], [`FOREVER`, `#${D.c.number ?? ''}`]][n % 3];
        const b = this._banner(lines, D.color, 2.6, 0.7), along = (n - (Ds.length - 1) / 2) * 3.8 - 1.6, p = at(hw + 0.95, along, 1.15), q = at(hw - 3, along, 1.15);
        b.position.copy(p); b.lookAt(q); group.add(b);
      });
      // the team, standing by with their heads bowed
      for (let n = 0; n < 5; n++) {
        const along = (n < 3 ? -3.6 - n * 0.7 : 3.4 + (n - 3) * 0.75), p = at(hw - 0.5 - Math.random() * 0.6, along), toward = at(hw, 0);
        add(makePerson({ pose: 'mourn', kit: 'polo', color: c0.color }), p.x, p.z, facing(toward.x - p.x, toward.z - p.z) + (Math.random() - 0.5) * 0.3);
      }
      this.scene.add(group);
      this.set3d = { group, people, tribute: { from: at(hw - 2.8, -2.4, 0), to: at(hw - 2.4, 1.8, 0), look: at(hw + 0.4, 0.5, 0), flames } };
    } else if (k === 'coach' || k === 'gates' || k === 'confirm' || k === 'family') {
      // that night on the circuit, on the straight nearest the accident: the fans let in along the barrier on the track side,
      // its catch-fence hung with banners and scarves, flowers and candles all along its foot - and their first karting
      // coach, talking to us. (On the track side of the barrier, the camera on the asphalt: nothing in the way.)
      const tr = this.track, side = -(this.pit?.sideSign || 1), D = this.D.get(seg.who) || this.Ds[0];
      const s0 = this._straightNear(seg.who?.s ?? 0), wall0 = tr.wallAt(tr.idxAtS(s0), side);
      const at = (lat, along = 0, y = 0) => { const f = tr.sample(tr.wrapS(s0 + along), side * lat); return new THREE.Vector3(f.x, y, f.z); };
      // (fence: the barrier's face - everything below is laid on the track side of it, looking back at the circuit)
      const fence = Math.max(tr.halfWidth + 1.5, (isFinite(wall0) ? wall0 : tr.halfWidth + 4) - 0.25), inward = -1;
      // (that night the grandstands are empty: the crowd is down here)
      if (!this._standsBack) this._standsBack = this.stands?.hide?.(() => true) || (() => {});
      const lines = [[`FOREVER`, `#${D.c.number ?? ''} ${D.LAST}`], [`THANK YOU`, D.first.toUpperCase()], [`RIP`, D.LAST], [`NEVER FORGET`, `#${D.c.number ?? ''}`], [`${D.first.toUpperCase()}`, 'WE LOVE YOU']];
      for (let n = 0; n < 5; n++) { const b = this._banner(lines[n], n % 2 ? '#16171a' : D.color, 2.4, 0.66), p0 = at(fence - 0.12, -11 + n * 5.2 + Math.random(), 1.45 + (n % 2) * 0.35); b.position.copy(p0); b.lookAt(at(fence - 6, -11 + n * 5.2, 1.5)); b.rotateZ((Math.random() - 0.5) * 0.08); group.add(b); }
      const flames = this._tribute(group, (a, l, y) => at(fence - 0.75 - l, a, y), 90, 1.6, 13, 34);
      // the fans: standing back from the flowers on the track, quiet, all teams' colours, facing the barrier
      const cols = [...new Set(this.cars.map((c) => c.color))];
      for (let n = 0; n < 22; n++) { const p0 = at(fence - 2.6 - Math.random() * 4.5, -12 + Math.random() * 24), to = at(fence, (Math.random() - 0.5) * 6); add(makePerson({ pose: Math.random() < 0.3 ? 'kneel' : 'mourn', kit: Math.random() < 0.5 ? 'polo' : 'jacket', color: pick(cols), jitter: 0.03 }), p0.x, p0.z, facing(to.x - p0.x, to.z - p0.z) + (Math.random() - 0.5) * 0.5); }
      let person = null; void inward;
      if (k === 'coach') {
        const p0 = at(fence - 2.0, 1.5), cam0 = at(fence - 4.8, 0.9);
        person = add(makePerson({ pose: 'talk', kit: 'jacket', color: '#3b3f46', accent: '#9aa0a8', hair: '#a9a9a9', jitter: 0.01 }), p0.x, p0.z, facing(cam0.x - p0.x, cam0.z - p0.z) + 0.15);
        person.group.traverse((m) => { if (m.isMesh && m.material.emissive) m.material.emissive.copy(m.material.color).multiplyScalar(0.28); });
        this.scene.add(group);
        this.set3d = { group, people, flames, person, shot: { from: cam0.clone().setY(1.62), to: cam0.clone().setY(1.6), look: p0.clone().setY(1.5), fov: 28 } };
      } else {
        this.scene.add(group);
        this.set3d = { group, people, flames, shot: { from: at(fence - 12, -9, 1.75), to: at(fence - 10, 6, 1.6), look: at(fence, -3, 0.9), look2: at(fence, 6, 1.4), fov: 38 } };
      }
    } else if (k === 'silence') {
      const tr = this.track, hw = tr.halfWidth, drivers = this.cars.filter((c) => !this.hurt.includes(c)), n = drivers.length;
      const span = 2 * hw - 1.6, step = span / Math.max(1, n - 1), sLine = tr.wrapS(4);
      drivers.forEach((c, j) => { const f = tr.sample(sLine, -span / 2 + j * step); add(makePerson({ pose: 'kneel', kit: 'suit', color: c.color, accent: c.color2, driver: c.name }), f.x, f.z, facing(f.tx, f.tz) + (Math.random() - 0.5) * 0.08); });
      const colors = [...new Set(this.cars.map((c) => c.color))];
      for (let j = 0; j < 16; j++) { const f = tr.sample(tr.wrapS(0.6 - Math.random() * 2.4), (Math.random() - 0.5) * (2 * hw - 1)); add(makePerson({ pose: 'mourn', kit: 'polo', color: colors[j % colors.length] }), f.x, f.z, facing(f.tx, f.tz) + (Math.random() - 0.5) * 0.3); }
      for (const side of [-1, 1]) for (let j = 0; j < 3; j++) { const f = tr.sample(tr.wrapS(1 + j * 2.2), side * (hw + 0.8 + Math.random())); add(makePerson({ pose: 'mourn', kit: 'marshal' }), f.x, f.z, facing(f.tx, f.tz) - side * 0.5); }
      // banners held up along the grid behind them: never forget, forever, pray for
      this.Ds.forEach((D, n) => {
        for (const [k2, lines] of [[0, ['NEVER FORGET', `${D.LAST} #${D.c.number ?? ''}`]], [1, [`FOREVER #${D.c.number ?? ''}`, D.first.toUpperCase()]]]) {
          const side = (k2 ? 1 : -1) * (n % 2 ? -1 : 1), f = tr.sample(tr.wrapS(-4.5 - n * 1.5), side * (hw * 0.45)), b = this._banner(lines, D.color, 3.2, 0.85);
          const ahead = tr.sample(tr.wrapS(10), side * (hw * 0.45)); b.position.set(f.x, 1.55, f.z); b.lookAt(ahead.x, 1.55, ahead.z); group.add(b);
        }
      });
      this.scene.add(group); this.set3d = { group, people };
    }
  }
  /** bouquets and candles laid along a line (world/Tribute.js) -> the candle flames */
  _tribute(group, at, n, spanL, spanA, nc) { return tribute(group, at, n, spanL, spanA, nc); }
  /** a cloth banner: two lines of text on the team's colour (a black band along the bottom), w x h metres */
  _banner(lines, color, w, h) {
    const THREE = this.T3, cv = document.createElement('canvas'); cv.width = 1024; cv.height = Math.round(1024 * h / w); const x = cv.getContext('2d');
    x.fillStyle = '#f6f4ef'; x.fillRect(0, 0, cv.width, cv.height); x.fillStyle = color; x.fillRect(0, 0, cv.width, cv.height * 0.12); x.fillStyle = '#111'; x.fillRect(0, cv.height * 0.88, cv.width, cv.height * 0.12);
    x.fillStyle = '#16171a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    lines.forEach((L, i) => { let s = i ? 96 : 76; do { x.font = `900 ${s}px "Segoe UI", Arial, sans-serif`; s -= 4; } while (x.measureText(L).width > cv.width * 0.9 && s > 24); x.fillStyle = i ? color : '#16171a'; x.fillText(L, cv.width / 2, cv.height * (0.32 + i * 0.34)); });
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const g = new THREE.PlaneGeometry(w, h, 16, 1), pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * 2.1) * 0.025);   // (a little slack in the cloth)
    return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.2 }));
  }
  _set(o) { const U = this.pass.uniforms; for (const k in o) U[k].value = o[k]; }
  _fov(f) { if (Math.abs(this.camera.fov - f) > 0.01) { this.camera.fov = f; this.camera.updateProjectionMatrix(); } }

  /** a spectator filming on a phone: chasing the car with a lag, pinch-zooming, shaking (badly at full zoom), flinching at the impact */
  _phoneCam(dt, tau, t) {
    const THREE = this.T3, cam = this.camera, sp = this.cur.spot, eye = new THREE.Vector3(sp.x, sp.y, sp.z);
    const tgt = this._pose(tau, this.clip.focus).p.add(new THREE.Vector3(0, 0.5, 0));
    this.aimV.addScaledVector(new THREE.Vector3().subVectors(tgt, this.aim).multiplyScalar(14).addScaledVector(this.aimV, -5.5), dt);
    this.aim.addScaledVector(this.aimV, dt);
    const dist = eye.distanceTo(tgt), want = THREE.MathUtils.radToDeg(2 * Math.atan(24 / (2 * dist * 0.5625)));
    this.zoomT -= dt; if (this.zoomT <= 0) { this.fovT = Math.max(2.5, Math.min(55, want * (0.85 + Math.random() * 0.4) / this.cur.P.zoom)); this.zoomT = 0.9 + Math.random() * 1.2; }
    this.fov += (this.fovT - this.fov) * Math.min(1, dt * 3);
    this._fov(this.fov);
    const P = this.cur.P, z = Math.min(2.2, Math.sqrt(30 / this.fov)) * P.shake, shock = this._shock != null ? Math.exp(-(t - this._shock) * 1.6) : 0;
    // after the impact the stand erupts: the filmer jumps, turns, shouts - the aim wanders off; the tremor goes wild
    const ch = this._chaos(tau), W = this.wander || (this.wander = { y: 0, p: 0, vy: 0, vp: 0 });
    W.vy += ((Math.random() - 0.5) * 9 - W.vy * 1.5 - W.y * 1.2) * dt; W.vp += ((Math.random() - 0.5) * 7 - W.vp * 1.5 - (W.p - 0.15) * 1.2) * dt;
    W.y = Math.max(-1.1, Math.min(1.1, W.y + W.vy * dt)); W.p = Math.max(-0.7, Math.min(0.9, W.p + W.vp * dt));
    this.crowdRate = 1 + 3.5 * Math.max(ch, tau > this.impactT ? 0.6 * Math.exp(-(tau - this.impactT) * 0.3) : 0);
    const k = THREE.MathUtils.degToRad(this.fov) / 0.5;
    const yaw = k * (0.025 * Math.sin(t * 1.1) + 0.014 * Math.sin(t * 2.7 + 1.3) + 0.006 * Math.sin(t * 8.3) * (1 + 3 * shock) + (Math.random() - 0.5) * 0.006 * z);
    const pitch = k * (0.02 * Math.sin(t * 0.9 + 2) + 0.011 * Math.sin(t * 3.4) + 0.006 * Math.sin(t * 9.1 + 0.5) * (1 + 3 * shock) + (Math.random() - 0.5) * 0.006 * z) - 0.09 * shock * k;
    eye.y += ch * (0.25 * Math.abs(Math.sin(t * 7.5)) + 0.1 * Math.sin(t * 2.1));
    cam.position.copy(eye); cam.up.set(0, 1, 0); cam.lookAt(this.aim);
    const wild = 1 + 6 * ch;
    cam.rotateY(yaw * z * wild + ch * W.y); cam.rotateX(pitch * z * wild + ch * W.p); cam.rotateZ(0.035 + 0.02 * Math.sin(t * 0.45) + 0.05 * shock * Math.sin(t * 13) + ch * 0.35 * Math.sin(t * 1.9 + W.y));
    if (ch > 0.3 && this.fovT < 30) this.fovT += dt * 25 * ch;
  }
  /** how far this phone's filming has gone to pieces at clip time tau (from half a second to a second after the impact) */
  _chaos(tau) {
    const P = this.cur.P, d = tau - this.impactT - (this.cur.delay ?? (this.cur.delay = 0.4 + Math.random() * 0.8));
    return P.chaos * Math.max(0, Math.min(1, d / 0.7));
  }

  _enter(seg) {
    this.seg = seg; const k = seg.k, $ = this.$;
    if (seg.inc != null && this.incs[seg.inc] !== this.I) { this._use(this.incs[seg.inc]); this._hit = this._hit2 = false; this._shock = null; }
    if (k === 'interview2' && !this.speaker) {
      // a fellow driver: the team-mate when one driver is hurt, else someone from another team
      const H = this.hurt, pool = this.cars.filter((c) => !H.includes(c));
      this.speaker = (H.length === 1 && pool.find((c) => c.team === H[0].team)) || pick(pool.filter((c) => !H.some((h) => h.team === c.team))) || pool[0] || H[0];
    }
    $('.warn').classList.toggle('in', k === 'warning');
    $('.tag').classList.toggle('in', k === 'phone' || k === 'slow');
    const bug = $('.bug'); bug.classList.toggle('footage', k === 'phone' || k === 'slow'); bug.querySelector('i').textContent = k === 'phone' || k === 'slow' ? 'VIEWER FOOTAGE' : k === 'tcam' || k === 'tcam2' || k === 'analysis' || k === 'heli' ? 'REPLAY' : 'LIVE';
    const bare = k === 'warning' || k === 'silence' || k === 'out' || k === 'confirm' || k === 'family' || k === 'medical';
    bug.classList.toggle('hide', bare); $('.place').classList.toggle('hide', bare); $('.ticker').classList.toggle('hide', bare);
    if (k === 'coach' || k === 'gates') bug.querySelector('i').textContent = 'SPECIAL REPORT';
    // (the special report's cards: the confirmation, the family's statement - read out for them, never in their words alone)
    const Dw = seg.who ? this.D.get(seg.who) : null;
    $('.confirm').classList.toggle('in', k === 'confirm' || k === 'medical'); $('.family').classList.toggle('in', k === 'family');
    $('.confirm small').textContent = k === 'medical' ? 'MEDICAL UPDATE' : 'SPECIAL REPORT';
    if (k === 'medical' && Dw) { $('.confirm h1').textContent = Dw.name; $('.confirm p').textContent = medicalText(seg.who, Dw, this.trackName); }
    if (k === 'confirm' && Dw) {
      $('.confirm h1').textContent = Dw.name;
      $('.confirm p').textContent = `The FIA has confirmed that ${Dw.name} died from injuries sustained in an accident at ${this.trackName || 'the circuit'} today. Formula 1, the FIA and every team on the grid send their deepest condolences to ${Dw.first}'s family, friends and everyone at ${Dw.team}.`;
    }
    if (k === 'family' && Dw) {
      $('.family small').textContent = `A STATEMENT FROM THE FAMILY OF ${Dw.name.toUpperCase()}`;
      const L = shuffle([
        `Our hearts are broken. ${Dw.first} lived for racing from the first day in a kart, and the world was brighter with ${Dw.first} in it.`,
        `We want to thank the marshals, the doctors and everyone who fought for ${Dw.first} today. You did everything you could.`,
        `To everyone who has sent messages, flowers and love: we see it all, and it is holding us up.`,
        `Please remember ${Dw.first} as we will - laughing, impossibly fast, and kind to everyone.`,
        `${Dw.first} knew the risks and chose this life anyway, because nothing else ever felt like home.`]).slice(0, 3);
      L.push('We ask for privacy as we grieve.');
      $('.family .lines').innerHTML = L.map((x) => `<p>${esc(x)}</p>`).join(''); $('.family em').textContent = `Read on behalf of the family by ${Dw.team}`;
    }
    if (k !== 'headlines') this.papers.forEach((p) => p.classList.remove('in', 'back'));
    if (k !== 'prayers' && k !== 'wishes') this.posts.forEach((p) => p.classList.remove('in'));
    this.ob = null; this.crop = null; this.ownHits = null; $('.lost').classList.remove('in'); if (this.camera.view?.enabled) this.camera.clearViewOffset();
    const ob = $('.ob'); ob.classList.toggle('in', k === 'tcam' || k === 'tcam2');
    if (k === 'tcam' || k === 'tcam2') { const oc = k === 'tcam' ? this.clip.cars[this.other] : seg.who || this.car; ob.querySelector('.st').style.background = oc.color; ob.querySelector('b').textContent = oc.name.split(' ').pop(); $('.lost span').textContent = `ONBOARD · ${oc.name.split(' ').pop().toUpperCase()}`; }
    $('.silence').classList.toggle('in', k === 'silence'); $('.tele').classList.remove('in');
    this._set3d(seg);
    if (k === 'phone') this._phoneSound(true);
    if (k === 'analysis' || k === 'heli' || k === 'tcam' || k === 'headlines' || k === 'silence' || k === 'out') this._phoneSound(false);
    if (k === 'heli') this.heliBase = null;
    const replay = k === 'phone' || k === 'slow' || k === 'analysis' || k === 'heli' || k === 'tcam' || k === 'tcam2';
    if (this.fx?.fire) { this.fx.fire.paused = replay; if (!replay) for (const e of this.fx.fire.emitters) if (e.replay) e.dead = true; }
    if (replay) this._replayReset();
    this._gasped = false; this._crowd(k === 'phone' || k === 'slow' || k === 'analysis' || k === 'heli', k === 'phone' || k === 'slow', k);
    if (k === 'phone' || k === 'slow') this._padTo(0.02); else if (k === 'interview1' || k === 'interview2' || k === 'coach') this._padTo(0.015); else if (k === 'prayers' || k === 'silence' || k === 'gates') this._padTo(0.05, 2.5); else if (k === 'confirm' || k === 'family') this._padTo(0.03, 3); else this._padTo(0.05);
    if (k === 'phone' || k === 'slow') {
      this.cur = this.phones[k === 'phone' ? 0 : 1]; const sn = this.cur.spot.stand?.name;
      $('.tag').textContent = `${k === 'slow' ? 'SECOND ANGLE · ' : ''}VIEWER FOOTAGE · ${sn ? sn.toUpperCase() : this.cur.spot.stand ? 'GRANDSTAND' : 'SPECTATOR BANK'}`;
      this.fov = this.fovT = 30; this.zoomT = 0; this.wander = null;
      this.aim = this._pose(k === 'phone' ? 0 : Math.max(0, this.impactT - 1.6), this.clip.focus).p.clone(); this.aimV.set(0, 0, 0);
      if (k === 'slow') this._shock = null;
    } else this.crowdRate = 1;
    if (k === 'warning' || k === 'silence' || k === 'out' || k === 'confirm' || k === 'family') this._lower(null);
    else if (k === 'slow') { const x = this._text(seg); this.$('.lower .sub').textContent = x.sub; this.cc = { lines: x.cc, t: 0 }; }
    else this._lower(seg);
  }

  finish() {
    if (this.done) return; this.done = true;
    this._standsBack?.(); this._standsBack = null;   // (the grandstands' crowd back for the race to come)
    window.removeEventListener('keydown', this._key, true);
    this._phoneSound(false); this._crowd(false); this.atmosH?.stop(1.6);
    if (this.fx?.fire) { this.fx.fire.paused = false; for (const e of this.fx.fire.emitters) if (e.replay) e.dead = true; }
    if (this.padGain) { this._padTo(0.0001, 0.3); const p = this.pad; setTimeout(() => p.forEach((o) => { try { o.stop(); } catch (e) { /* stopped */ } }), 1200); }
    this._set3d(null); if (this.camera.view?.enabled) this.camera.clearViewOffset();
    this._restHalves(); for (const R of this.replicas?.values() || []) { this.scene.remove(R.group); R.dispose(); }
    this.el.remove(); this._fov(this.fov0);
    for (const m of this.meshes.values()) m.group.visible = true;
    this.comp.dispose?.();
    this.onDone?.();
  }
}
