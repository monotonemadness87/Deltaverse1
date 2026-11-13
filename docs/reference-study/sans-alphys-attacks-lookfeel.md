# Sans + Alphys: how the attacks look, behave and feel, plus micro-pacing

This compares two reference fights with our "Sans + Alphys — Misery Likes Company" (`games/sans-genocide.html`):
- **Sans:** Undertale Sans, Genocide (`dl/files/sans.mp4`).
- **Alphys:** a fan-made Alphys fight (`dl/files/alphys.mp4`).

It builds on the timing study `docs/reference-study/sans-alphys-precise.md` and does not repeat its turn tables. Here the questions are how each attack **looks, moves and lands**, and how its individual projectiles are **paced**.

**Suggestions respect the HANDOFF contract:**
- 40 waves;
- the readable-pressure nerfs;
- the 75-second finale;
- Aqua, Flowey, Yellow shots, white/gold cells, steel, charged-skull gates and KR.

Every suggestion describes a *quality* to build in our own style. None asks to copy a reference sprite.

---

## 0. Method and files

**Reference footage.** Frames were decoded with ffmpeg only and analysed with `python3 -I` (PIL/numpy).
- Segments are in `scratchpad/lf/ref/`; they will be deleted after this report.
- Sans is 24 fps. Alphys is 30 fps, cropped to the 960-px game area.

**Automatic trackers, all in `scratchpad/lf/tools/`:**
- `refbones.py`: bone-column entries at the box edges.
- `beamon.py`: beam onsets, measured as a jump in bright-pixel area. It also gives solid and grey durations.
- `boxfind.py`: box geometry.
- `sheet.py` and `pair.py`: contact sheets.

Everything the trackers measured was checked against contact sheets. Where automatic tracking was unreliable (Alphys domes drawn over Alphys's sprite), I used the timing study's frame counts plus manual counts from the sheets.

**Our game.** `tools/wave.js` drives a Playwright run on a virtual 60 fps clock. It jumps straight to any wave the same way the phase code does (`battleDebug.game`: reset, `completed=N-1`, ally/core/Flowey flags, `startAttack`).
- It saves frames (every frame, or every 2nd) and a per-frame log.
- The log records every spawned hazard, skull, relay, platform and vine with its time, kind, warn and live values. It also records counts, mode, arena and cue.
- A simple bot hops in blue mode and charge-fires in yellow mode. Damage was disabled in most runs ("safe": hits are only logged), so hit counts measure nothing about difficulty.
- Waves sampled: 1, 2, 5, 8, 9, 11, 12, 16, 18, 19, 21, 22, 23, 25, 27, 28, 30, 31, 33, 36, 38, 39 and 40.
- Extra runs: a full-rate run of waves 1, 11, 21 and 23; a real-damage run of wave 11 for hit feedback; and the natural wave 20 → 21 transition through dialogue, menu and Notebook.
- `tools/pace.py` summarises the logs.
- **The source code shows the same timings.** `choreography.js` holds `WAVE_SPECS` and `buildWave`; the core beams, blasters and FX are in the same file.

**Side-by-side contact sheets** (reference rows on top, ours below), in `scratchpad/vid/lf-sans/`:

| File | Content |
|---|---|
| `scratchpad/vid/lf-sans/01-blaster-lifecycle.png` | Sans opening-volley blaster (every 83 ms) vs our wave-1 low-beam skull (every 100 ms) |
| `scratchpad/vid/lf-sans/02-slam.png` | Sans turn-16 slam (every video frame) vs our wave-1 slam |
| `scratchpad/vid/lf-sans/03-bone-lines.png` | Sans turn-1 bone lines vs our wave 2 SHORT BONES and wave 9 THE LONG HALL |
| `scratchpad/vid/lf-sans/04-machinery.png` | Alphys dome turret and pod (cause → effect) vs our wave 21 laser train and wave 28 disco rotor |
| `scratchpad/vid/lf-sans/05-climax.png` | Sans final blaster spiral and slam tail vs our wave-40 rings, gate and empty tail |
| `scratchpad/vid/lf-sans/06-transitions.png` | Sans flicker cut, Alphys phase-2 fade-in, our hard box swaps |

More single-source sheets are in `scratchpad/lf/sh/`, for example:
- `s_open_skull.png`: blaster close-up;
- `s_barr.png`, `s_slam.png`, `s_fin1.png`, `s_fin2.png`;
- `a_t1_dome.png`, `a_t1_pod.png`, `a_t2.png`, `a_t4.png`, `a_t8.png`, `a_t9.png`;
- `o_w01_skullzoom.png`, `o_w11.png`, `o_w21.png`, `o_w23.png`, `o_w40_a.png`, `o_hurt.png`, `o_trans.png`.

**Units and scale:**
- Reference sizes are video px. The game px is ÷1.5 for both videos.
- Ours are canvas px on a 768x640 canvas. The normal box is 464x170, compact 216x170 and wide 708x170.
- Sizes are therefore compared as **fractions of the box**.

---

## 1. Reference: how each attack looks and behaves

### 1.1 Sans

**Opening attack.** See `s_open_a.png`, `s_open_bl.png` and `s_open_skull.png`.

- **Cut-in.** It starts after a 2-frame black cut. The square box is 250 px.
- **Blue slam.** The SOUL turns blue and hits the floor in 2 frames. The box jolts a few px for about 5 frames.
- **Floor bones.**
  - A **dim-red outline rectangle**, thin and unfilled, marks the bottom third of the box.
  - After 6 frames the floor bones **extrude out of the wall over 2–3 frames**.
  - Sans raises his arm or points on each mode change, so cause and effect are always visible.
- **Bone wave.** Top and bottom bones scroll in and leave a *sloping* gap. The blasters swoop in **while the wave's tail is still in the box**, so there is no rest between the two parts.
- **Blaster stages**, frame by frame:
  1. **Arrival.** A fast swoop from off-screen with **about 30–60° of spin**, decelerating to rest in about 5 frames (0.2 s).
  2. **Idle.** Completely **still** for about 12 frames, with no pulse.
  3. **Fire.** The jaw opens *on the fire frame*. The beam starts narrow at the mouth and **widens in visible steps** over 3–7 frames; the near-mouth flare is stair-stepped.
  4. **Recoil.** The skull **recoils backwards** out of frame while the beam holds.
  5. **Fade.** The beam turns **light grey, then mid grey, then dark grey while narrowing** over 8–9 frames.
- **Beam and skull size:**
  - Opening beams are about 70 px wide, about 0.28 of the box side.
  - Opening skulls are about 0.5 of the box width.
- **Volleys:**
  - Four volleys; each is 4 beams that leave only the centre safe.
  - Volley 2 is an "X" of corner blasters.
  - Volley N+1 flies in **during volley N's fade**.
  - Before the last volley there is a **0.96 s held breath** while two large skulls arrive. Then a beam more than half the box tall is solid for 22 frames.

**Bone lines (T1, T3, T10, T12).** See `s_lines_a.png` and `s_lines_zoom.png`.
- **Bones:**
  - Bones are a thin shaft (about 9 px; 6 game px) with two-lobed knob caps.
  - They **emerge from inside the wall** with no warning.
  - Lines enter from **both sides 1–3 frames apart** and cross each other. At the crossing moments the two sets overlap, so the box briefly shows half as many bones: a "zipper" effect.
- **Slot:** the gap is a 22 px (15 game px) slot just above the floor.
- **Speed:** T10 uses the same cadence as T1, with faster bones.

**Blue bones (T2).** See `s_blue.png`.
- Tall **cyan** full-height bones alternate with short white floor bones from both sides.
- Each pair forces **stop, then hop**. The colour is the only telegraph.

**Platforms (T4–T9).** See `s_plat.png` and `s_platbl.png`.
- A "bone sea" floor carpet slides in as one block.
- Platforms are thin white outlines with a green inner line. They drift in lanes.
- Long single bones then drop from the ceiling.
- In T8, blasters sit off the box edges at platform height and fire **horizontal beams one tier tall, alternating left and right**.

**Gaster Blaster barrage (T15, T18, T22).** See `s_barr.png`.
- Skulls arrive **one at a time** from off-screen and aim diagonally at the SOUL.
- Each skull enters **while the previous one is firing**, forming a chain of calls and answers.
- The beam appears as a 1–2 px line for 1 frame, then is full width, then fades through grey.

**Telekinetic slams (T16, T17, T20 and the final).** See `s_slam.png` and `02-slam.png`.
1. Sans's hand moves.
2. The SOUL flies to a wall in about 4 frames.
3. On impact the **box jolts** for 1–2 frames.
4. A **dim-red outline zone** covers about a quarter of the box on that wall.
5. After 8–9 frames the bones **extrude over 3 frames**, hold about 10 frames, then **retract over 3 frames**.

**Phase-2 flicker medleys.** See `s_medley.png`.
- The screen cuts fully black for 9–11 frames, later only 2–3.
- Sans *and* the box reappear in new positions.
- Each sub-pattern is 0.9–1.9 s.

**Menu bones.** See `s_menu.png`. Small bones creep across the text box and the FIGHT target during phase-2 player turns.

**Final attack.** See `s_fin1.png`, `s_fin2.png` and `05-climax.png`.
- The box stretches to full width in 0.58 s.
- Sans **walks** the corridor.
- Crosshair slams are separated by 3/2/1-frame black cuts.
- **Blaster spiral:**
  - A *fan* of 30+ skulls rings Sans and the box and keeps rotating in.
  - Beams fire in **clusters of 2–3**.
- The fight ends on a **21 s slam tail with constant box jitter** while HP drains to 1. The pressure never drops to an empty box.

**Hit feedback.**
- On a hit there is **no screen shake and no flash**.
- The HP bar turns purple for KR, the HP numbers tick down, and the hit sound plays.
- The violence lives in the attacks, not in the hit reaction.

### 1.2 Alphys (fan-made)

**Staging.**
- A dark-green radial vignette sits behind the battle.
- Alphys's sprite is large and sits *directly on* the box. Every gadget flies in around her and is **drawn in front of her**.

**Pod laser (T1, T8).** See `a_t1_pod.png`.
1. The pod appears as a flat horizontal line.
2. It **unfolds** into a vertical capsule over about 6 frames.
3. Its two caps **separate** and a pale cream beam with a white core **stretches between them**.
4. The whole pylon then **pivots** to sweep the box with eased motion.

**Dome turrets (T1, T6, T7, T8, T10).** See `a_t1_dome.png`.
1. The dome enters **edge-on and flips to face the player**, like a coin, in 2–3 frames.
2. It hovers. Its central eye **glows orange for about 6 frames**.
3. A **1–2 px preview line** shows for 2 frames.
4. The beam widens to a white core with coloured glowing edges (cream, cyan or orange) and **slides with the dome**.
5. The dome leaves by **flipping edge-on again**.

In T8 the domes come in a **conveyor**: one after another from the right, up to 5 on screen.

**Tiles and ring mines.**
- Small white outline squares and diamonds **spin** as they drift.
- In T2 they pop in as a grid and are **flung out of the box when it tilts**.

**Box shapes.**
- The box escalates through shapes: notched (T1), **tilting seesaw** (T2), a bevelled hexagon morphed together with the red dashed warning (T4), octagon, diamond and a fanged mouth.
- The box itself is the escalation tool.

**Lightning or crosshair strikes.**
- Full-screen white lines strike with no warning.
- They become **jagged crackle** after 2–4 frames and decay into a dotted after-image.
- The decaying dots read as warnings *after* the strike.

**Phase 2 (T9).** See `a_t9.png` and `06-transitions.png`.
- Amalgamate figures **fade in behind Alphys over 0.6 s**.
- **2–3 frame static/noise patches** recur about every 2.5 s.
- One menu button is taken per turn.
- The SOUL pales.

---

## 2. Ours: how the attacks look, behave and feel (sampled waves)

| Wave | What it is | Look and behaviour (measured) |
|---|---|---|
| 1 NO FIRST TURN | Compact box 216x170. Two slams, then four skull → bone cycles | Slams: 900 px/s throw; a **14 px axis kick plus a thick white wall flash** for 0.32 s; ghost bones at 27 % alpha for 0.22 s, then full-height bones that **pop in and vanish** with no extrude or retract. Skulls are scale 0.42 (≈40x45 px, **0.26 of box height**), slide in **54 px over 0.24 s, ease-out, no spin**, and keep a gentle **2.5 % pulse** while idle. A **cyan 4-px preview line** is visible for the whole wind-up. The jaw opens **0.3 s before** firing. The beam is 22 px (0.13 of box height), flat white with a mouth flare, and blooms in 0.075 s. The skull recoils with 24t + 720t² px. Collapse: **white narrowing over 0.17 s, no grey stage**. Each beat has a cue ("LOW BEAMS · STAY GROUNDED", "BEAMS CLEAR · JUMP THE BONES") |
| 2 / 9 (hops / long hall) | Blue SOUL. Skull pair, then a 5-bone hill or an arch pair | Same skull lifecycle. Bones are the supplied bone graphic, recoloured, with caps and a stretched shaft. A white `!` marker at the box edge appears during the 0.38 s warning |
| 5 WRONG WAY | Slams rotating ↑ → ↓ ← | Same as wave 1. A 0.35 s gravity cue and a Sans gesture 0.28 s before each slam |
| 11 TWO TARGETS (Aqua) | Ring of 8 tracking skulls (scale 0.62) | All 8 skulls track Seth or Aqua with **cyan lines**. The lines turn **yellow on lock**, 0.17 s before fire. All 8 fire within 0.08 s, making a **full-screen starburst** that covers Sans and the HUD. Recoil sends the skulls off-screen. Aqua's soul has a cyan outline and an "A" tag |
| 12 SHARED GROUND | Blue SOUL. Two solid white 90x7 platforms at ±30 px/s, hills every 0.95 s | Clean. Platforms are plain white bars |
| 18 WHERE YOU WERE | Aimed horizontal plus vertical skull pair, then floor bones | The pair fires 0.15 s apart, so it reads as an "L" crossing |
| 21 POWER ON (Alphys) | Blue/orange vertical columns sliding at 520 px/s every 0.36 s, plus floor-bone trains | Columns **appear at the box edge with no emitter**. Each has a dashed preview for 0.45 s, a coloured body and a white 4-px core. Alphys is a yellow-tinted **scan-lined hologram panel** that only changes pose |
| 23 NO STANDING ROOM | Rows of 10 cells drop at 205 px/s: white, steel X, gold bomb with a cross blast; plus 6-skull rings every 2.1 s | Cells are outline boxes. The gold cell's × marks the bomb. The cross blast is two white beams. Green **text labels pile up inside the box** ("BLOCK BROKEN", "CROSS BLAST" written over each other, 1.8 s life) on top of the cue banner |
| 25 / 27 | Core walls and quarter tiles | Pale-yellow filled zones with a `!` during the warning, then solid cream. No machine attached |
| 28 LIGHT SHOW | Rotor disk (spins, shows HP) emits 6 rotating blue/orange rays | **The best cause → effect in our fight**: the beams visibly come out of a shootable object |
| 30 ALL SYSTEMS GO | Laser train, then rotors, then a thrown slam with a relay beam, then cells | Sections separated by empty rests (7.7–10.1 s) |
| 31 / 36 / 40 (Flowey) | Rings of 8 skulls, plus vines with petals, hack and save | Vines grow from Flowey (at the right) over 0.6 s. Readable |
| 40 ONE LAST EXPERIMENT | Slams (0–8 s) → corridor (10–23 s) → compact weave (25–36 s) → core with relays and rotor (38–49 s) → petal rings (51–63 s) → required gate (65 s) | See the micro-pacing section. The box swaps instantly between sections, and each section ends in an empty-box rest |

**Turn transitions.** See `o_trans.png`.
- The attack box swaps **instantly** to the 708-px dialogue box and back. There is no resize tween.
- The only "cut" punctuation is a white teleport flash in the dual-FIGHT moment.

**Hit feedback.** See `o_hurt.png`.
- Each hit plays a **red edge-glow for 0.34 s plus trauma shake** (0.3–0.54) and adds KR.
- KR invulnerability is 0.3 s, so during a starburst the flash and shake retrigger 2–3 times a second.

**Blue-mode jumps.** Gravity is 1100 px/s² and jump velocity 400 px/s.
- Full jump: **0.73 s** airtime, apex 73 px, **0.43 of box height**.
- Tap (release clamps rise to 140 px/s): about 0.4 s.
- Sans for comparison: tap 0.46–0.63 s, full **1.2 s**, apex about 0.5 of box height.
- Ours is snappier and heavier. That suits the nerfed "real landing window" design, but there is no Sans-style float.

---

## 3. Micro-pacing

Notation:
- "Event" = one spawn volley: a bone group, a skull ring, a cell row, a slam.
- "Interval" = time from one event's spawn to the next.
- "Empty box" = attack time with no hazard, warning, skull or machine at all.
- Our figures come from the logs. Reference figures come from the trackers (marked *auto*) or from manual frame counts and the timing study (*study*).

### 3.1 Bone lines and jumps: Sans T1 / T10 vs our waves 2, 9, 12 and the finale corridor

| | Sans T1 bone lines | Sans T10 (harder) | Ours w2 SHORT BONES | Ours w9 LONG HALL | Ours w12 SHARED GROUND | Ours w40 corridor (10–23 s) |
|---|---|---|---|---|---|---|
| Spawn-to-spawn (per side) | *auto*: L 0.54–0.79 (mean 0.69); R 0.62–0.71 (mean 0.67) | *auto*: 0.62–0.67 both sides | skull → bones 1.75; bones → next skull 2.36 | 1.75 / 2.95 alternating | hills **0.94–0.97** (metronome) | arches **0.92** (metronome) |
| Both sides combined | A pair every ≈0.66 s; the two sides are 0.04–0.12 s apart | Same | One threat at a time | One at a time | One side (alternating) | Right side only |
| Gap to pass | 22 px slot (≈15 game px) in a 199 px box, ≈0.11 of height | Same slot, faster bones (0.68 box widths/s) | Clear a 42 px hill (0.25 of box) | Slot 72–88 px (≈0.45 of box) | 42 px hills | Slot 72–88 px |
| Time between required jumps | Jump starts 0.63–0.75 s apart (8 jumps in 6.9 s) | 0.58–0.63 s | ≈2.4 s | ≈2.9 s | ≈0.95 s | ≈0.92 s |
| Changes over the attack | Steady pulse; the gap height is fixed (randomised in T3/T12) | Steady, faster | Steady | Steady | Steady | Steady |
| Empty box | ≈0 | ≈0 | 7 % (last 0.6 s) | 3 % | 2 % | about 2.9 s rest before the next section |
| Peak decisions/s | ≈3 bone columns/s crossing the SOUL | ≈3.2 | ≈0.8 | ≈0.7 | ≈1.1 | ≈1.1 |

### 3.2 Opening attack: Sans opening vs our wave 1

| | Sans opening (7.6 s) | Ours w1 NO FIRST TURN (20 s) |
|---|---|---|
| Event list (s) | 13.17 blue slam → 13.58 warning → 13.83 floor bones → 14.38 red → 14.71 bone wave → 15.75 four skulls in → fire **16.50, 17.33, 18.17**, then **19.12** big beam | 0.76 slam ↑ → 1.56 slam ↓ → 2.21 skulls → 3.95 hill → 5.44 skulls → 7.19 hill → 10.41 skulls → 12.16 hill → 13.65 skulls → 15.40 hill → nothing until 20.0 |
| Intervals | 0.41, 0.25, 0.55, 0.33, 1.04, 0.75, 0.83, 0.84, 0.95 | 0.81, 0.65, 1.74, 1.48, 1.75, **3.22**, 1.75, 1.48, 1.75 |
| Gaps between sub-patterns | slam → bone wave 0.33 s; bone wave → blasters **overlap** (blasters arrive while the wave is still inside); volley N+1 arrives during volley N's fade | slam → skulls 0.65 s; a 3.2 s rest mid-wave (9.3–10.4 s empty); **2.4 s empty tail** |
| Rhythm | Accelerating set-piece. Steady 0.83 s blaster pulse, a **0.96 s held breath**, then the biggest beam to close | Call and response (beam → stay grounded; bones → jump) at a constant ≈3.2 s cycle, repeated 4 times. It ends flat |
| Empty box | ≈0 % (only the 0.4 s tail fade) | **22 %** (4.35 s) |
| Peak load | 4 beams every 0.83 s plus 4 skulls arriving (≈5 hazards/s) | 2 events in 1 s (slam pair); otherwise ≤ 1 event/s |

### 3.3 Slams: Sans T16, T17, T20 and the final vs our waves 1, 5, 16 and the finale

| | Sans T16 / T17 / T20 | Ours w5 WRONG WAY and w40 0–8 s |
|---|---|---|
| Slam period | 1.04 → 0.83 → 0.65 s across the fight (*study*); within a turn, steady | **1.66–1.74 s**, constant in every wave |
| Warning → bones | Dim-red zone, 8–9 f (0.33–0.38 s); crosshair slams 0.58–0.67 s | Ghost bones 0.22 s, plus a text cue 0.35 s *before* the throw |
| Bone life | Extrude 3 f → hold ≈10 f → retract 3 f (≈0.65 s) | Live 0.46 s, instant on and off |
| Empty box | Small: the next throw follows about 0.2 s after the retract | **63 %** in w5; between slams the box is empty for ≈1.0 s each time |
| Decisions/s | ≈1–1.5 (throw plus jump) | ≈0.6 |

Wave 16 (UP AGAIN) inserts its two slams into a 0.98 s hill stream. That works better, because the slam lands inside an ongoing pulse.

### 3.4 Blasters: Sans barrage, T8 and the spiral vs our rings (waves 11, 17, 31, 36, 40) and wave 18

| | Sans T15 barrage | Sans T8 platform blasters | Sans final spiral | Ours w11 / w40 rings | Ours w18 WHERE YOU WERE |
|---|---|---|---|---|---|
| Beam onsets (*auto*) | 13 beams; intervals 0.50, 0.50, 0.54, 0.54, 0.58, 0.46, 0.62, 0.50, 0.46, 0.67, 0.46, 0.46 (mean **0.52**) | 9 beams; 0.83–0.96 (mean 0.875); alternating sides | Clusters of 2–3 beams **0.17–0.33 s apart**, clusters every ≈1.0–1.4 s (*auto*); the study counted 24 onsets in 7.7 s | **8 skulls per ring**, all fire within 0.08 s; rings every **1.04–1.07 s**, 13 rings in w11 and in w40 | Pairs (horizontal, then vertical 0.15 s later) every 1.5 s, plus floor bones |
| Appear → fire | 0.6–0.8 s (*study*) | ≈0.75 s | ≈0.8 s | 0.86–0.94 s (lock 0.17 s before fire) | 0.8 s |
| Solid / fade | ≈5 f (0.21 s) solid, 5–6 f grey | 5–7 f solid, 3–5 f grey | Variable | 0.5 s live: bloom 0.075 s, white collapse 0.17 s | 0.55 s |
| Rhythm | Single-file chain: each skull enters while the previous fires | Steady pulse, left/right call and response | Rotating fan; bursts and short rests | **Strobe**: everything at once, then a ≈0.3 s void | Short-long pairs |
| How it changes | Flat, then the next attack escalates | Flat | Builds into the slam tail | **Identical** for 13 rings. Ring size never changes within a wave | Flat |
| Peak load | ≈2 beams/s, one dodge each | ≈1.1/s | ≈3 beams/s | 7.6 beams/s, but only **≈1 decision/s** (step off the lock point) | ≈1.3/s |

### 3.5 Alphys machinery vs our Alphys waves (21, 22, 23, 25, 27, 28 and 30)

| | Alphys T1 | Alphys T3 / T8 | Ours w21 POWER ON | Ours w23 NO STANDING ROOM | Ours w28 LIGHT SHOW |
|---|---|---|---|---|---|
| Sequence | Pod sweep 163.1–167.2 s (eased, peak 1.15 box widths/s) with tiles drifting → bomb at 167.0 → **1.6 s rest** → domes 168.7–171.3 s | T3: chain of 4 tiles → crosshair strike, **every ≈2.1 s** (223.5, 225.7, 227.9, 229.7 s). T8: tiles → pod → 3-dome fan → dome conveyor, one every ≈0.5 s, up to 4–5 live (*study*) | Laser columns every **0.35–0.37 s** for 13.6 s, plus floor-bone trains every 1.05 s | Cell rows every 1.25 s, skull rings every 2.1 s; intervals 0.03–1.78 s (mean 0.53) | Rotor every 4.2 s, rings every 2.1 s; intervals 0.69 / 1.39 / 2.11 repeating |
| Appear → hazard | Pod 0.57 s; dome 0.40 s (glow → full 0.1 s); dome row 0.67 s | Domes 0.13–0.27 s (slow beams) | 0.45 s dashed preview | 0.36 s warn; cells fall continuously | 0.7 s |
| Rhythm | Three different sub-patterns, each with a visible gadget | Call and response (chain ↔ strike), later a conveyor build | **Single continuous pulse** of 0.36 s with a 1.05 s counter-pulse; no sub-structure | Two overlaid pulses (1.25 and 2.1 s) that drift in and out of phase | Repeating 3-beat bar |
| Empty box | T1 has a 1.6 s gap | ≈0 | 2 % | 2 % | 2 % |
| Peak load | ≈2 hazards/s | 4–5 live beams, ≈2 new/s | **4 events/s**, mean 18 live hazards | 3 events/s | 2 events/s |

### 3.6 Finale: Sans final (51.4 s) vs our wave 40 (75 s)

| Segment | Sans final | Ours w40 |
|---|---|---|
| 1 | 0–5.5 s: square-box slams plus screen-crossing bones, mixed blue/red | 0–8 s: slams every 1.7 s (box empty ≈60 % of this section) |
| Transition | **0.58 s** box stretch | **2.9 s empty**, then an instant swap |
| 2 | 6–15 s: corridor; Sans walks; 8.9 s | 10.6–23 s: arches every 0.92 s, constant |
| Transition | 0.42 s shrink, a 1.7 s pattern, a 10 f black cut | **2.85 s empty**, instant swap |
| 3 | 17.5–21 s: crosshair slams, 3/2/1 f cuts | 25.4–36 s: weave every 1.15 s |
| Transition | none | **2.84 s empty** |
| 4 | 21–30.4 s: **blaster spiral** (climax) | 38.6–49 s: core relays, rotor, rings |
| Transition | none | 1.5 s empty |
| 5 | 30.4–51.4 s: **slam tail with constant jitter** while HP drains | 51.4–63 s: identical 8-skull rings every 1.05 s (visual climax) |
| 6 | – | 65 s: required gate (7 skulls; repeats every 4.2 s until broken) |
| End | Pressure until the last frame | When the gate breaks on its first volley (≈67.5 s, the bot's run), the box is **completely empty for 7.2 s** until 75 s |
| Totals | Empty ≈0 % outside the 0.4–0.6 s transitions | 56 events; intervals 0.05–3.80 s (mean 1.19); **16.9 s empty (23 %)** |

### 3.7 Summary of what the numbers show

1. **Our early and solo waves pace at 1.5–3 s per threat. Sans paces at 0.5–0.9 s.** The nerf to readable pressure was achieved mostly by inserting *empty time*, not by making each threat easier to read. The waves feel sparse rather than readable.
2. **Our pulses are metronomic and identical within a wave.** Most intervals repeat to within 20 ms for the whole wave. Sans is also steady within a turn, but every turn is short (6–10 s) and the set-pieces escalate (0.83 s pulse → held breath → biggest beam).
3. **Our multi-section waves (30, 39, 40) separate sections with 1.5–2.9 s empty rests. Sans uses 0.4–0.6 s box tweens or black cuts.**
4. **Our peak load is concentrated in Alphys waves** (w21: 4 events/s, 18 live hazards) **and in ring starbursts** (7.6 beams/s). Elsewhere it is far below the references. The difficulty curve is lumpy.
5. **The finale's last beat is an empty box** whenever the gate falls on its first volley.

---

## 4. Wave by wave: closest reference, strengths, gaps, suggestions

### Wave 1 NO FIRST TURN → closest: Sans opening attack
**Does well:**
- It opens with a slam, like the reference.
- The low-beam/jump call and response teaches blue mode honestly.
- The cyan preview lines and `!` markers are a clearer warning grammar than Sans's.
- The Sans gesture before each slam ties cause to effect.

**Gaps:**
- 22 % empty box, including a 3.2 s mid-wave rest and a 2.4 s empty ending.
- Skulls are small (0.26 of box height) and slide only 54 px with no spin.
- The jaw opens 0.3 s early; the idle pulse makes the skulls look nervous rather than aimed.
- No climax.

**Suggestions:**
- **Overlap the next skull pair with the current bone formation's exit.** Spawn it when the hill passes the SOUL's farthest reachable x, not 0.8 s after it leaves the far edge.
  - Keep ≥ 0.4 s of grounded time before the beam goes live, to preserve the landing window.
  - This shrinks the cycle from ≈3.2 s to ≈2.2 s with no new rules.
- **End on a set-piece.** Add a 0.8 s held breath (no spawns), then two large skulls (scale ≈0.8) cross-firing a single wide low beam (≈0.4 box height, solid 0.5 s), then end the wave. Cut the empty tail.
- **Skull entry.** Swoop in from 120–160 px out with 90–180° of spin, ease-out over 0.2–0.25 s, then hold perfectly still (drop the 2.5 % idle pulse, or keep it only during the last 0.15 s as a charge tremble).
- **Fire.** Open the jaw 1–2 frames before the beam, not 0.3 s before.

### Waves 2 and 9 (hops, long hall) → closest: Sans T1 / T10 bone lines and T11 slides
**Does well:**
- Fixed, non-tracking beam rows and a real landing window, as the contract asks.
- Arches give generous slots (0.45 of box height).
- Bones use proper capped sprites.

**Gaps:**
- One required jump per 2.4–2.9 s, against Sans's 0.63–0.75 s.
- Single-side formations; no crossing.
- The bones pop in behind a ghost; nothing emerges from the wall.

**Suggestions:**
- **Keep the slot sizes, raise the pulse.** Add a second, cheaper bone line from the opposite side whose crossing with the main formation happens *away* from the SOUL's landing spot. This is the "zipper" quality: the lines meet and pass through each other.
- Aim for one jump decision every ≈1.2 s in wave 2, ≈1.0 s in wave 9.
- **Make bones slide out of the box wall:** clip them at the inner border and let them emerge, with the `!` marker kept outside. Drop the ghost for horizontally moving bones, since the marker already warns. Keep ghosts for in-place hazards.

### Wave 5 WRONG WAY (and the finale's slam section) → closest: Sans slams T16 → T20
**Does well:**
- The impact is *stronger* than Sans's: a 14 px axis kick plus a white flash on the impact wall.
- Gesture → throw → impact → bones is a complete cause-and-effect chain.
- Slams rotate through four walls; the reference uses two to four.

**Gaps:**
- 1.7 s fixed period, so the box is empty 63 % of the time.
- Bones pop to full and vanish instantly.
- The warning is a 27 % ghost of the bones themselves, which is hard to see against a just-landed SOUL.

**Suggestions:**
- **Tighten the period across the wave:** 1.5 s → 1.25 s → 1.0 s (about 20 % per four slams), echoing Sans's 1.04 → 0.65 s. The finale's slam section can start at 1.0 s.
- **Warning.** After impact, draw a thin outline zone in our own colour (dim cyan or white, 2 px) for ≈0.3 s.
- **Bone animation.** Extrude the bones from the wall over 3 frames (0.05 s), hold, then retract over 3 frames.
- **Fill the space between slams** with a single slow floor-bone train in the *new* gravity direction, so each slam lands inside an ongoing pulse. Wave 16 already proves this works.

### Wave 11 TWO TARGETS (Aqua) and the ring waves 17, 31, 36 and 40 (51–63 s) → closest: Sans barrage and final spiral
**Does well:**
- The cyan → yellow lock colour change is a superb readable telegraph that neither reference has.
- Targeting Aqua as well as Seth makes the two-player fight visible.
- The recoil is good.
- The starburst is spectacular.

**Gaps:**
- All 8 skulls fire within 0.08 s every 1.05 s, 13 times identically: a strobe with one decision per second.
- Beams cover Sans and the HUD; three-quarters of the screen whites out several times a second.
- No build-up and no last ring.
- Beams collapse in white (no grey fade), so the after-image is harsh.

**Suggestions:**
- **Fire rings in sequence, not all at once.** Step around the ring at 60–90 ms per skull, a "clock hand" sweep. Each skull keeps its own lock (lock 0.17 s before *its* fire).
  - This turns one strobe into a readable sweep and adds 0.5–0.7 s of motion per ring, at the same total beam count.
- **Shape the wave:**
  - first 4 s: rings of 4 skulls every 0.9 s;
  - middle: rings of 6;
  - last 3 s: rings of 8, alternating sweep direction;
  - then a 0.7 s rest and a final double ring (inner and outer radius).
- **Beam fade.** After the solid phase, fade over 0.13–0.15 s through about 70 % → 45 % → 20 % grey *while narrowing*, instead of the white width-only collapse. This softens the strobe and gives the "light burned out" feel.
- **Limit the whiteout:** clip ring beams to about 1.5x the box diagonal, or draw them at 85 % alpha past the box border, so Sans's reaction and the HP bar stay readable.

### Wave 18 WHERE YOU WERE → closest: Sans barrage (aimed single skulls)
**Does well:** aiming at the *remembered* position, with an L-shaped horizontal-then-vertical pair, is a strong idea, and the 0.15 s offset creates a mini call and response.

**Gap:** the pair repeats every 1.5 s with identical geometry.

**Suggestion:** after four pairs, shorten the follow-up delay to 0.1 s, then add a third skull diagonally. That gives a sense of escalation inside the wave.

### Wave 21 POWER ON (Alphys) → closest: Alphys dome conveyor (T8) and pod laser
**Does well:**
- The blue/orange colour rule plus dashed preview lines form a clear warning grammar.
- 520 px/s columns give real pressure.
- The hologram panel with scan-lines gives Alphys a presence without new art.

**Gaps:**
- Columns spawn at the box edge **with no emitter**, so cause and effect is missing; in the reference every beam hangs from a visible machine.
- The 0.36 s pulse never varies (4 events/s for 13.6 s).
- Alphys only changes pose.

**Suggestions:**
- **Give every column a carriage.** A small emitter rides a rail along the top border of the box.
  - Arrival: the emitter flips in edge-on (horizontal scale 0 → 1 over 3 frames).
  - Charge: its lens glows in the beam's colour for ≈0.27 s while the dashed line shows.
  - Fire: the column drops from the lens and slides with the carriage.
  - Exit: the carriage flips out edge-on.
- **Light a key on Alphys's console** (the existing 7-key strip under her hologram) whenever a device fires. That links the controller to the effect.
- **Phrase the pulse.** Group the 0.36 s pulse into bars of 4 columns followed by a 0.36 s rest, and shorten the rest to zero in the last 4 s as the escalation.

### Wave 23 NO STANDING ROOM (cells) → closest: Alphys T1 tiles/bomb and T3 chains
**Does well:**
- Shootable white, steel and gold cells and the gold cross blast are unique mechanics with a real decision (break or dodge).
- Falling rows are readable.

**Gaps:**
- Text clutter: the cue banner, plus "BLOCK BROKEN", "CROSS BLAST" and "SETH · CIRCUIT INTERRUPTED" labels overlapping in the box for 1.8 s each.
- Cells appear out of nowhere above the box.
- The 1.25 s and 2.1 s pulses drift in and out of phase, so sometimes three things land at once.

**Suggestions:**
- **Labels:** cap world-space labels at 0.6 s, offset each new label 14 px upward from the last, or replace them with a 0.25 s icon pop (a crack mark, a cross glyph). Show the long cue banner only the first time each pattern appears in a run.
- **Cell arrival:** cells drop from a hopper slot on the top border that opens 0.1 s before each row (2-frame shutter).
- **Lock the two pulses** in a 3:5 ratio (cells 1.26 s, rings 2.1 s), so the overlaps become a predictable "big beat" every 6.3 s.

### Waves 25 and 27 (core walls, tiles) → closest: Sans slams' red zones and Alphys box shapes
**Does well:** the pale-yellow `!` zones are honest silhouettes; the safe-tile logic is clear.

**Gap:** zones fill in place with no source and no motion, and the box never changes shape.

**Suggestion:** fill the zones as a wipe from the side nearest Alphys's panel (0.1 s sweep), and give each a 2-frame white edge flash when it goes live. Collision must stay identical to the zone. As an occasional set-piece, rotate the box by 10–15° (the engine already has `angle` / `turnRig`) during a tile wave, the way Alphys's box tilts.

### Wave 28 LIGHT SHOW (rotor) → closest: Alphys pod pivot sweep
**Does well:** this is our best cause-and-effect: a shootable, spinning, HP-numbered rotor emitting the rays.

**Gap:** the rotor simply appears.

**Suggestion:** lower it on a cable from the top border over 0.3 s, and **unfold** its six emitters from a closed disk over 4 frames as the rays' dashed previews appear. When broken, the rays collapse inward over 0.17 s (the `cutAt` envelope exists) and the disk drops out of the box.

### Wave 30 ALL SYSTEMS GO, wave 39 STILL HERE and wave 40 → closest: Sans phase-2 medleys and the final attack
**Does well:**
- The finale reprises every system of the fight: slams, corridor, weave, core, petals, gate.
- The required charged-skull gate makes a cooperative closing beat.
- Flowey's vines and save are readable.

**Gaps:**
- 1.5–2.9 s empty rests between sections, and instant box swaps.
- Each section is internally metronomic.
- The climax (51–63 s) is 13 identical rings.
- **After an early gate break the box sits empty for up to 7.2 s**; the 75 s fight ends on nothing.
- Sans walks the corridor in the reference; ours has a static Sans while the background camera pans.

**Suggestions:**
- **Black cuts.** Replace the inter-section rests with a 0.4 s cut for the first transition, then 0.1 s cuts. During each cut, tween or swap the box and reposition Sans, the reference's flicker-medley grammar. Keep a single 0.8 s held breath only before the final third.
- **Box tweens.** Tween the box over 0.15–0.25 s (ease-out) in `room()` and when swapping to the dialogue box. Hard swaps currently read as missing frames.
- **Make the gate the last beat, not the second-to-last.** Two options:
  - start the gate so its earliest possible break lands at ≈72–73 s;
  - or, once the gate breaks, run a decaying "aftershock" until 75 s: a slam every 1.0 s with ≈2 px constant box jitter, no new projectile types, the Sans slam-tail quality.

  Either keeps the 75 s contract and the required gate, and removes the empty tail.
- **Climax shape.** Use the sequenced-ring suggestion above at 51–63 s, accelerating 0.9 → 0.7 s, so the fight's peak is a build rather than a plateau.
- **Corridor.** Slide Sans's sprite across the top in the corridor section (12–20 px/s, matching `camera`), so the corridor reads as travel.

### Waves 31, 33, 36 and 38 (Flowey and root waves) → closest: Alphys phase 2 (a new presence joins)
**Does well:**
- Vines grow from Flowey at the screen edge, so cause and effect is clear.
- The pin, decoy and save marks are distinct.

**Gap:**
- The Flowey takeover has no on-screen transition cue inside the attack.
- The same 8-skull ring pulse as wave 11 makes waves 31 and 36 nearly identical; their intervals match to the frame: 1.05, 0.56, 0.50, 1.05…

**Suggestion:**
- Give wave 31's first second a Flowey-specific cue: a 2–3 frame static/vine-silhouette flash at the screen edge plus a 0.6 s fade-in of vine shadows behind the box (the Alphys phase-2 quality, in Flowey green).
- Vary the ring cadence or the sequence direction between 31 and 36, so the root styles feel different.

---

## 5. Cross-cutting look-and-feel suggestions (all waves)

1. **Blaster stages**, as a single shared spec:

   | Stage | Duration | What happens |
   |---|---|---|
   | Arrival | 0.2–0.25 s | Swoop-in with spin, ease-out |
   | Idle | ≥ 0.3 s | Perfectly still; keep the preview line |
   | Charge | 0.12 s | Tremble only |
   | Fire | 2–3 frames for the beam to reach full width | Jaw opens, beam grows from a 2 px line with a stepped mouth flare |
   | Hold | – | Recoil as now |
   | Fade | 8 frames | Grey and narrowing |

   Set-piece skulls should be scale ≥ 0.8, and beams ≥ 0.3 of box height.
2. **Shared warning grammar.** Keep our strengths: cyan preview → yellow lock, dashed core lines, `!` markers, ghost bones. Add only two cues:
   - an outline zone after slams;
   - a 1–2 frame thin preview line at every beam onset.
3. **Every machine has a body.** Columns, cells and walls get an emitter, carriage or hopper that flips or slides in, glows for 0.27 s, fires, and flips out. Alphys's console keys light on fire.
4. **Box motion.**
   - Tween every resize (0.15–0.25 s).
   - Use occasional 10–15° tilts in Alphys waves, keeping honest collision (rotation is already supported).
   - Use black cuts between remix sections.
5. **Hit feedback.**
   - Keep the red edge glow for real HP loss.
   - Rate-limit the shake to one kick per 0.5 s, and give KR ticks only the purple HP-bar pulse with no flash.
   - The reference shows that big attacks read better when the screen is not also shaking on every graze.
6. **Clutter.** Shorten and stack world-space labels. Teach with the banner once, then trust the visuals.
7. **Each wave ends on its biggest beat.** A 0.6–1.0 s held breath, then a single larger instance of the wave's own hazard. Never an empty tail longer than 0.5 s.
8. **Blue-mode feel.** Optional, and only if the designer wants Sans-like float: reduce gravity to ≈55 % while |vy| < 120 px/s (apex hang). That lengthens the full jump from 0.73 s to ≈0.85 s at the same apex.
   - Re-check the solo-jump landing windows before adopting it; they are tuned to the current 0.73 s.

---

## 6. Caveats

- Our runs used a simple bot with damage mostly disabled. The pacing numbers (spawn times, empty-box time, live counts) do not depend on skill, except for:
  - gate waves, where the end time depends on when the gate breaks (the bot never broke wave 8's gate; it broke the finale's on its first volley);
  - aimed skulls, whose positions depend on where the SOUL is.
- Reference video A is 24 fps from a 30 fps game: ±1 frame (42 ms).
- The beam and bone trackers miss events when hazards overlap. The Sans spiral and the Alphys dome counts are therefore reported as clusters, or taken from the timing study.
- Ours was captured on a virtual 60 fps clock with two fixed 1/120 s simulation steps per frame, which matches the real game loop.
- Large frame dumps were deleted after analysis. The JSON logs and scripts are kept in `scratchpad/lf/` (`tools/`, `logs/`); the contact sheets are in `scratchpad/lf/sh/` and `scratchpad/vid/lf-sans/`.
