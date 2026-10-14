# F1 sim: work left after v72 preview (2026-10-09, 12:47)

**STOPPED 2026-10-10 ~09:35 (usage limit).** Resume each with `resumeFromRunId`; agents read their `progress\*.md` logs.
- **Customization** (wf_3e3a0ce2-4ef): fix round 1 in progress (progress\fix.md). Re-review, more rounds and the critic follow.
- **Anatomy/shoulders** (wf_b54ef0c7-89d): fix round 2 done. Round-2 re-reviewers were running; resume with the same args (see the earlier resume calls).
- **After-party** (wf_4b521fcf-915): all WPs built; integration in progress (progress\integrator.md). Five reviewers, fixes and the critic follow.
- **Wardrobe** (wf_ca0b03c7-ecf): clubwear v2 done; the pool venue is done. Swimwear in progress (progress\swimwear.md, new file src/world/Swimwear.js). Then the lace step (w2:lace), then occasions, then reviewers and fixes.
- **Restart on resume:** the checkpoint script (`scratchpad\checkpoint.ps1`, ended after 12 h), the wake lock, and the swimwear-render watcher.
- **Next publish:** smoke-test the whole tree (boot, races, career, hub, hangouts, party offer flow), bundle, check dist boots, then publish. That covers customization, clubwear v2 and the people fixes.

**STOPPED at about 21:20 (usage limit).** All workflows were stopped mid-step, so files may contain partial edits. To resume, re-launch each workflow with `resumeFromRunId`; each agent reads its `progress\*.md` log (session scratchpad) first.
- **After-party build** (wf_4b521fcf-915): in the Build stage, WP1–WP6 in parallel. Spec: `scratchpad\party_spec.json`.
- **Clubwear** (wf_a200b342-05a): the build agent was mid-test. 17 women's and 6 men's kits exist in People.js (`CLUB_KITS`); the Celebs club occasion, the hangout use and the partner suite may be partial.
- **Anatomy** (wf_b54ef0c7-89d): shoulder re-review, then fix round 2.
- **Polish** (wf_d959421f-f0b): the refix, plus eyes at distance, the floating chain and the halter back. Pass the same `args.extra` on resume.
- **Neck girth** (wf_81129bc8-300): neck fix.
- **Customization review** (wf_3e3a0ce2-4ef): not resumed yet; reviews, fixes and the critic still to run.
- **Clean up** `scratchpad\locks\shared_editors.txt` when resuming.
- **Horror sounds, fixed by the lead:** test pages on the dev origin start muted (localStorage `f1sim-mute=1`, or `?mute`). Hangouts never play atmos1-3; those are only for crash news and mourning. Hangouts are now silent where they used atmos. TODO: procedurally synthesised venue music (lounge, pub, synthwave, club house at 120–128 bpm with a beat phase for the party).

**Update, 20:15:** the 12:51 preview could not get past the main menu. The bundle died on `export { structKey as previewKey }` in StylePreview.js. bundle.py now handles export lists and refuses any other unsupported export. A fixed build (artifact version 74) is published.

**Resumed at 20:10:**
- the shoulder re-review and fix round 2;
- polish refix, now also covering eyes at distance, the floating chain and the halter back;
- the proportions fix;
- the neck girth fix.

The customization review, fix rounds and completeness check follow once those land.

The v72 preview was published to https://claude.ai/artifact/JezKn4tPsUYMSW8dABcW1f and `dist/index.html`.
It was bundled at 12:45 while agents were still editing, so it is NOT smoke-tested end to end (the browser tab cap blocked the check).

## Still running or unfinished when the session limit hit
Agents keep progress logs in the session scratchpad `progress\*.md`; restarted agents read them and carry on.

- **Customization build** (workflow wf_3e3a0ce2-4ef): core, player and partner are all built.
  - Partner still has to do: a persistence check over a reload, the leak test, pin rotation, undo / "her own", and the hangout style sheet.
  - Then the five-lens review (UI fit, persistence, perf/leaks, visuals, regressions), up to 3 fix rounds, and a completeness check against the original request.
- **Shoulder fix** (wf_b54ef0c7-89d): fix round 1 is done and its re-review is running; round 2 follows.
  - Known: Noor's rust one-shoulder bare-shoulder edge, Ava's covered-shoulder lump, the off-shoulder arm-top step, and the night-grid stars looking dim.
- **Polish** (wf_d959421f-f0b): its second fix pass is running.
  - Long hair (blowout/waves) still shows ragged seams from behind; it needs a smooth base mass with fewer non-crossing locks.
  - Sasha's bob shows a forehead wedge, and pale blonde messy buns have a roll along the front.
- **Proportions and silhouette** (wf_97c6dbcf-baa): built; two reviewers, then a fix, follow.
  - Open: everyone is about 0.92 of model scale (men 170 cm, women 163 cm); the bust apex sits a bit high; shoulder width is 0.193 H against a 0.21 target; plunge edges show slight corners up close; triangle headroom is thin (35.7k of 36k).
- **Neck girth** (wf_81129bc8-300): started.
  - Measured on the mesh, the visible neck is far too thick below the jaw. Men are about 50–54 cm (target 38, drivers 41–43); women are 32 under the jaw rising to 38–41 lower down (target 29–32).
  - The neck flares into the shoulders too early.

## Lead's notes on the clubwear renders (21:40), for its fix round or the final pass
- **Low-rise jeans:** the front shows an odd V panel at the crotch (clC_q.jpg, 2nd and 7th). Make the low rise a level waistband with a slight dip, not a V.
- **Sheer overlay dresses:** the overlay hangs past the hem like a translucent sack (clA_q.jpg, 6th; clB_q.jpg, 3rd). Make it fitted to the body, ending at a defined hem (midi or maxi), with a visible edge.
- **Men's untucked shirts and polos:** the hem has stepped notches at the hips (clMen_q.jpg, 5th to 7th).
- **Rooftop:** the Sphere renders as a blank white dome (hg_club1.jpg); its show or feed isn't running in hangouts.

## Clubwear fix round done (02:50); leftovers
- **Lace and mesh base layers:** the nude base under the lacemini's lace reads as bare skin over the bust (cf_game_f.jpg). It must be a clearly non-skin colour. Rule added to the shared notes for clubwear v2 and swimwear.
- **Open backs** (backless, slipmini): the bare back shows faceted shoulder-blade bumps with sharp light fins (cf_backcu_bq.jpg). It needs more back columns in the neck/back skin loft when OF.back is set, or a softer blade.
- **Glossy leather trousers:** a soft V crease where the thighs leave the pelvis band (cf_pelvzoom_q.jpg). A seamless fix needs the pelvis and legs as one lofted surface.
- **Mesh midi:** a pencil column; black mesh on very pale skin reads grey.

## Lead's notes on the Vegas club alpha renders (pvA_vegasclub_*.jpg, 02:26), for the party review
- **Walls and ceiling read as black void.** Real Vegas clubs have visible surfaces: LED wall panels, mirrored or padded walls, a lighting truss, columns, a ceiling rig. The stars overhead should read as a deliberate fibre-optic star ceiling, not open sky.
- **People are dark and flat under the club light**, with faces hard to read. Add a little rim or wash from the lasers and LED floor (relative lift, build-time).
- **Dance floor:** an LED tile floor with a disco ball and rings. Good, but busy: maybe fewer, larger tiles that pulse with the beat.
- **The bar** ("…LO ROOM"): a backlit shelf and onyx top look right. The sign is clipped at the left edge of the frame (check that it's centred).
- **The casino walk-in** (slots, a table, a rope line) is great.
- **The terrace** shows the Strip, the Ferris wheel and the Sphere with its eyeball. Good.

## Leftovers from the polish pass (finished 02:25)
- **Fair skin** (#efcfb5 to #f3d6c0: Maya, Mira, Ava, Sasha) reads as porcelain white under the lineup lighting (fin_st_q.jpg, fin_cb_f.jpg). Check exposure and tone mapping against real photos, and warm up or deepen the palette slightly.
- **Men's head-to-neck join:** a visible line from under the jaw to the nape in side and back views; on dark skin the head reads darker than the neck (fin_napez_s.jpg).
- **Men's full beards:** read as a heavy dark block in profile (fin_ear_s.jpg). Belongs with the men's face pass.
- **Pale messy buns:** the coils read as smooth wrapped bands; they need strand-direction shading.
- **Triangles:** the heaviest star look is Jade's curly bun + slit gown at 35,676.

## Clubwear v2: the lead's critique of the most revealing looks (rev_full_q/b, rev_cuA_f, rev_cuB_f), run after the clubwear workflow
1. **Hem length variety:** every mini sits mid-thigh, so haltermicro isn't micro. Add real micro, mini, mid-thigh and midi, and high slits on minis.
2. **Bandeaus:** they read as rigid tubes with thick straight edges. Add shaping: ruching or gathers, a sweetheart or straight neckline, fabric hugging the bust and ribs, a thin edge. Add variants: twist-front, one-shoulder crop, tie-front.
3. **Low-rise:** the V panel at the crotch looks like a pubic shield. Make it a level waistband sitting on the hip bones, with a button, belt loops, seams, pockets and denim texture. Jeans currently read as leggings.
4. **Blazer and bralette:** the blazer is boxy and the lapels thick. Make it sharper-shouldered with slimmer lapels, and give the bralette real cups and a band, worn open or with a single button.
5. **Sheer mesh dress:** the overlay hangs past the hem as a sack. Fit it to the body with a defined hem and a subtle mesh pattern.
6. **Cut-outs:** the edges read as punched holes. Add turned or bound edges, slightly bigger shapes (criss-cross, ring hardware, rib cut-outs), and a backless scoop down to the waist with a tie.
7. **Fabrics:** everything looks like the same glossy plastic. Give real material response: leather with grain and soft sheen; metallic and sequin with sparkle; satin with anisotropic highlight; matte crepe; knit rib; denim twill.
8. **Bodies under crops:** the midriff is a flat tube. Add a navel, a subtle waist and ab contour, and hip-bone hints where low-rise shows them.
9. **Leg colour:** the pink co-ord's legs come out pink-grey, looking like tights; the leg colour leaks from the accent. Make bare legs the default for club minis, with sheer tights only by choice.
10. **Bare shoulders:** the step at the arm top still shows (the shoulder fix round 2 is on it).
11. **Poses:** club looks need club poses (weight shift, hand on hip, leaning, dancing); the party build adds dances and a lean.

## User request 21:00, queued after the clubwear workflow
- More bandeaus and midriff-baring looks: bandeau and crop tops with high-waist or low-rise skirts and trousers, and co-ords.
- Spread them across occasions: club, casual, hot-race grids (Miami, Vegas daytime, Abu Dhabi), beach-club and yacht parties.
- The user likes the deep plunges and tight bodycon fits; keep leaning that way.

## Found 20:55, queued after the polish refix
- **Triangle budget:** 47 of 192 star looks are over 36k (max 41.3k, Jade's gown with curlyLong). Long hair is the cause: curlyLong about 16.9k, waves about 12.9k. Trim the hair's triangles without a visible loss.
- **Bug:** an unstyled woman can get a random men's look, including a beard.
- **Neck:** the women's head grew 6.5% (hd 1.14) for 7.65–7.96 heads. The neck agent must re-check the girth share against the new head.

## Found by the lead, not yet assigned
- **Eyes:** they read as white blanks at full-body distance, and one eye washes out at three-quarter views. The eye gloss has been reduced (`gr(0.8)` in faceTexture); next, darken the sclera, enlarge/darken the iris and strengthen the lash line so eyes read at distance.
- **Racewear and men's faces** (offered, not yet confirmed by the user):
  - suit livery panels and patches, and gloves;
  - a masculine face sculpt (brow, cheekbones, jaw);
  - men's hands.
- The plunge mini's sleeveless variant has a jagged shoulder edge (it uses a cap sleeve for now).
- The halter's open back looks flat and pale from behind.
- The slip/gown necklace chain floats off the neck.
- The test career renders used the name "Esselink Racing"; make sure no test save or keys are left in localStorage (agents back up and restore the real save).

## Then
1. Smoke-test: boot, quick race, career wizard, hub Look tab, partner style pages, hangout, grid walk, podium.
2. Bundle (`py -3 f1-vegas\tools\bundle.py` and `--artifact`) and publish the final v72.

Backups of src from before the build are in the session scratchpad `preBuild_src\`.

## v75 release (2026-10-11)
Built 02:07 (`dist/index.html` 31.7 MB, `dist/artifact.html` 8.5 MB, 112 modules). The offline file boots to the menu and a quick race runs with no console errors. Publish `dist/artifact.html` with the audio files from `assets/audio/` next to it: atmos1, atmos2, atmos3, clubcrowd, clubmusic, crowd, gasp, groan, horror and strings (.mp3).

**New for the player since v74**
- **After-party.** After a race, TONIGHT offers the nights out: your team's celebration, the Las Vegas GP after-party at the Halo Room, or the London club. You play the night in first person: the step-and-repeat, the bar and the dance floor, drinks with a meter, drivers and stars to talk to, drama, and photographers at the exit. You can also SUM IT UP or go back to the hotel. Next day a MORNING AFTER card shows the timeline, the press, the people and the texts. A team party settles the same way.
- **Tidewater Beach Club** at the Meridian Grand, Las Vegas: a night-swim pool party and a daytime dayclub, with DJ stage, pool, loungers and cabanas.
- **Swimwear:** 21 women's kits (bikinis, monokinis, one-pieces, cover-ups) and 4 men's. The stars have their own pool wardrobe, and Pool is a new occasion in the partner style suite.
- **Clubwear v2:** 22 women's and 6 men's club looks. The new fabrics include lace, mesh, leather and sequins.
- **Play as Yourself:** your own driver's face, hair, skin, eyes, suit and helmet. You set them in the new-career creator and can change them any time under DRIVER › Look.
- **Partner style suite:** LIFE › Style. You and your partner plan her make-up, hair and wardrobe for each occasion: race day, night race, gala, dinner, club and pool.
- **People polish:** smoother women's figures, with per-star builds and curves. The fixes:
  - garment seams: crop-top midriffs, low-rise waistbands, halter V-necks and armholes, men's hems and hips;
  - hair: closed bob underside, clean crown, nape hairline;
  - joins: the neck ring and nape, and the heel gap;
  - beards no longer turn white under lifted light.

**Gated off (the work is kept; nothing was deleted)**
- **Affection and drink** (the affection-intox build, stopped midway). Not in this release:
  - G "get close": hugs, holding hands, a slow dance, kisses, consent both ways;
  - stars getting drunk and acting bolder;
  - the pool's own drink model, and you in swimwear at the pool;
  - the cosy/stolen/carer press after the night.
  - **How it is switched off:** `export const AFFECTION_ON = false` in `src/ui/Affection.js`. With it false, Hangout.js never creates an Affection. Every other hook is null-safe and `res.aff` is never written, so `career/AffectionResult.js` (wired into CareerHub.finishEvening and PR.js) settles nothing.
  - **To switch it back on:** finish the work first, then set it to `true`. Still to do:
    - WP-B: author the paired poses for `world/PairFrames.js` (hug, arm round, hands, lean and so on). They are not in People.js POSES yet.
    - WP-A: add the two PartyPlay lines from its contract: `talkKiss(g, counted)` in `_kiss` and the `g.n.affHold` filter in `_leaveWith`. Also the HangoutTalk `affHold` topics.
    - Test the whole thing end to end. The logs are WP-A/B/C/D.md and affection-design.md in progress\.
- **Lace collection** (wardrobe w2 step 2b): only just started. Nothing is on disk, so there is nothing to gate.

**Known issues**
- The dayclub (13:00) shows the Las Vegas night sky behind the venue.
- Every session prints one harmless shader warning, `use of potentially uninitialized variable (f_canvasShow)`. It was already there before this round.
- People.js still holds the joins fixer's TEMP test counters and hooks (`globalThis.__JNB/__JNT/__JNoff/__JNR`). They do nothing in play; remove them when that fixer resumes.
- **people-polish-v3 left open:**
  - garments: cap/puff-sleeve and one-shoulder bites, shirt collar funnel, lapel spikes, bardot junction, lanyard path, trousers ballooning in lap poses;
  - joins: men's boxy shoulders, raised-arm shoulder join, face/neck tone contour;
  - hair: triangle trims, in progress.
- **Swimwear:** the gluteal-fold thigh/seat join is still slightly jagged up close.
- **Party fix round 1 left open:**
  - RR-2 could not be reproduced;
  - still to do: the UX-15 porte-cochère set, V5, V9, RR-15, PERF-3a/3c, crowd drunk templates and star face prewarm.
  - The round-2 reviews were cut short.
- **Frame time:** measured headless and capped at 60 Hz by vsync, so it says nothing about the GPU.
  - Rooftop with a star: 16.6 ms a frame, 18 ms CPU, 227k triangles.
  - Halo Room: 16.1 ms, 17 ms CPU, 341k triangles.
  - Team party: 16.0 ms. Pool club: 15.1 ms. Dayclub: 17.3 ms.
  - Re-measure on the Intel UHD laptop, especially the Halo Room.
- The dead dev files of the stopped agents were moved, not deleted, to `scratchpad\devfiles\` (e04a0948 session). They are tools labs, *_dev, affres_*, hairfix*, pb_*, jn_lab.*, gx_*, the gxp People copy and the src/world/__*.js copies.
- **Published as artifact Version 75** at 02:15. The audio now includes clubmusic and clubcrowd. The stale `offline.html` (an old build) was removed. main.js now hides the in-artifact download button when no offline.html sits beside the page: the full offline build (31.7 MB with its audio) is over the artifact's 16 MB file limit, so the user gets `dist/index.html` as a file instead.

## v77 (2026-10-11 09:30, weekly usage 90%): crowd fix and affection switched on
- **Club crowds:**
  - In Hangout._walk, people are soft for the player. Discs are flagged pp: 1 standing, 2 seated, 3 staff. `_free(..., soft)`, `_pressPeople` and `pressSlow`.
  - Standing guests side-step about 0.35–0.45 m. Furniture stays solid.
  - `PartyPlay._place` never puts anyone within 0.8 m of the player (used by invites, booth, _outWith and security).
  - Untested: London club, team party, rooftop (same code). Shuffled guests don't drift back.
- **Affection is ON** (`AFFECTION_ON = true`).
  - 12 crude pair poses are in People.js POSES; the 8 standing ones are in DRESS_POSES.
  - Hooks added: PartyPlay._kiss calls talkKiss, _leaveWith uses leaveHold(g), HangoutTalk has the affHold/affLeave gate.
  - Bug fixed: unshot(plan) now clears PairFrames.plan. Before, every shot after the first fell back to first person.
  - Camera fallback through the crowd.
  - Tested on the rooftop and in the Halo Room: hug, hands, slow dance, cheek, kiss, tipsy NPC kiss, a "no", care for a very drunk star, real-driver platonic only, rooftop fallout.
  - NOT verified: the Halo Room morning-after jealousy/press (needs a real post-race party).
  - Renders: aff_*.jpg in the f2e40f09 scratchpad.
- **v80 (11:35):** Tidewater is now a Las Vegas week EVENING venue. It's wired through Social VENUES 'poolclub' (date 'beach'), invites/moments, Agenda, Celebs, Phone, HubSocial, PR, HangoutTalk and main.js night mode, and the rooftop blurb is fixed. The agent was stopped at the 92% weekly line, so the career evening flow wasn't tested end to end in the lab; I only checked careerHangout({venue:'poolclub'}) on dist, with 0 errors. v81 (12:00): the Tidewater pool party is now a Vegas after-race invite. Party.js has poolclub in PLACE, PARTY_TIMES and RESIDENT; clubOf(track, season, round) alternates Tidewater and the Halo Room between Vegas races, because the TONIGHT sheet holds 2 cards. Also wired: PartyVenues, PartyTalk, Hangout party gating, HangoutTalk isPartyX. Tested end to end by the agent (offer, night, morning-after). The final clubOf tweak only got a boot check. Open: a third card so both clubs are offered on the same night; Vegas-only talk lines and the Jade guest-DJ spot still apply to the Halo Room only; drinks and affection at the pool party not exercised in the test.
- **Asked by the user (earlier, now partly done):** **Tidewater pool club is not reachable in the career.**
  - It is not in Social's or Agenda's venue lists and not offered as a party.
  - Add it as a Las Vegas week evening and/or a Vegas party offer. Small; first on next week's list.
  - The rooftop's pool nights are reachable now: Vegas week, evening "Rooftop over the Strip", about 1 night in 3.
  - Social.js still calls the rooftop's plunge pool one "nobody uses"; update that line.

## v82 (2026-10-11 13:15, weekly 93%): confront photographers
- NEW src/ui/PapsConfront.js (`PAPS_CONFRONT_ON = true`). Press P when photographed (a non-private evening, the party wall or exit, a photographed hug or kiss), then choose 1–4: ignore / "give me a minute" / swear / shove the camera.
- Fallout runs through papsFallout in CareerHub; sympathetic in grave weeks; a small chance of an assault complaint.
- Hooks: Hangout (prompt, P, _flash, _events, result), PartyPlay (_flashDom, papsExit at the photographed exit), Affection (_photoRoll -> personal), CareerHub.
- Open:
  - not hand-played and no renders;
  - the open story reuses the 'brawl' type;
  - arguments aren't counted as personal;
  - no photographers in the Memorial/Mourning3D scenes;
  - grief headlines say "him".

## Resume checklist (FINAL pause 2026-10-11 ~07:00 after v76, weekly usage 89%; the user caps the week at 93%; weekly reset 2026-10-16 05:00)
Workflow scripts are in `C:\Users\Ethan\.claude\projects\C--Users-Ethan-Desktop-Porn\e04a0948-beb7-4317-b214-5c51c321084c\workflows\scripts\`. Copies are in the b0ed918f session scratchpad `wfscripts\`; use those if a scriptPath outside the working directory is refused. The journals are in the `b0ed918f-b235-4956-8498-4cdd9130b784` session's `subagents\workflows\wf_*`.
All background processes are stopped: shot server, checkpoints, wake lock and agent headless Edges. The dev server on 8766 is still up.

**To resume in a new session:**
1. Copy those `wf_*` folders into the new session's `subagents\workflows\`.
2. Call `Workflow({scriptPath, resumeFromRunId})`. Finished agents replay from cache.
3. Agents keep their own progress logs in the e04a0948 scratchpad `progress\`.
4. First restart the shot server (f2e40f09 scratchpad, `py -3 shotserver.py`, port 8768), the checkpoint script and the wake lock.

**Where each workflow stands:**
- **figure-curves** `wf_d4a7a2cd-ef3`: the seat smoothing to the user's spec is DONE (wide bell falloff, egg/teardrop profile). Only its reviews and fix rounds are left.
  - The lead's cap: the figure stays at this level. No further enlarging.
- **wardrobe-v2** `wf_ca0b03c7-ecf`: swim, lace (13 kits, Lace.js) and occasions (crops, pool looks with slick hair and braids, pool nights, the Swim slot) are all DONE and shipped in v76. Left: the three reviews (tech, visual, realism) and the fix rounds. They were stopped right after starting.
- **people-polish-v3** `wf_0e87be7b-125`: fix round 1 was partial. Garments, joins and hair are still open (list above).
- **afterparty-build** `wf_4b521fcf-915`: fix round 1 is DONE. Left: the round-1 re-review, the completeness critic and fix:complete. The pool club is not yet a party venue.
- **customization-build** `wf_3e3a0ce2-4ef`: fix round 1 is DONE. Left: the re-review, fix round 2 and the critic.
- **affection-intox** `wf_f7c71162-bcd`: the design and critic are DONE. WP-C and WP-D are built. WP-A's hooks and WP-B's poses are partial, so it is gated off (see above). Left: build, integrate, review.
  - The content line: PG; a "no" ends the thread; no romance with someone very drunk; real drivers platonic only.

## v76 release (2026-10-11)
Built 06:49 (`dist/index.html` 31.8 MB, `dist/artifact.html` 8.6 MB, 113 modules; the new one is `src/world/Lace.js`). `dist/index.html` boots to the menu and a quick race runs with no console errors. Neither bundle has a line starting with `export`. Publish `dist/artifact.html` with the same audio files as v75.

**New for the player since v75**
- **Lace collection:** 13 lace looks with real lace over a lining:
  - club: lace mini, bustier mini, corset with leather trousers, guipure corset, bodysuit under an open blazer, crop set and lace-sleeve mini;
  - evening: lace gown, lace midi and lace slip;
  - day: eyelet sundress and lace-trim cami;
  - pool: a lace beach dress.
  - The stars wear them. In LIFE › Style, Club and Gala each have a new Lace group.
- **Occasions:**
  - Race day has a new "Crops & co-ords" group (9 crops and co-ords) and a new preset, "Ivory crop & trousers". On hot race days the stars wear crops at the circuit.
  - At the pool the stars get pool make-up and pool hair: slicked back, or a real three-strand braid.
  - A star standing in the water wears only swimwear and goes barefoot.
  - The drivers at a pool club wear pool clothes, not suits.
  - About one rooftop night in three is now a pool night round the plunge pool, with some of the stars in cover-ups.

**Smoke test (headless Edge, test storage only, 0 console errors)**
- Boot and quick race.
- The career wizard to the hub.
- LIFE › Style: Race day (crops), Club (lace), Gala and Pool (bikini and lace cover-up). Every preview renders, and every page fits 1366x768 with no scrolling.
- Rooftop evenings: with Zoe, and a forced pool night with three stars.
- After the race: simmed weekend → TONIGHT → Halo Room → the night → MORNING AFTER card.
- Pool club with a star in the water; the real pool club and dayclub open and close cleanly.
- 40 people builds (13 lace looks in 2 poses each, 6 crops, 8 star pool looks): no errors, no broken geometry, at most 36.9k triangles.

**Fixes and reverts:** none were needed. Both steps shipped as their agents left them. Affection stays off (`AFFECTION_ON = false`).

**Known issues** (all of v75's still apply, plus):
- Close up, pool looks with long hair, a sun hat and a bag reach about 37k triangles, a little over the 36k people budget. The kaftan and pareo cover-ups are also just over it (this was already true in v75).
- Headless frame times are capped at 60 Hz by vsync: the rooftop pool night measured 16.7 ms with 288k triangles, and the Halo Room 16.2 ms with 340k. Re-check both on the Intel UHD laptop.
- Not yet reviewed by the wardrobe-v2 visual/realism reviewers (their round was cut short).
