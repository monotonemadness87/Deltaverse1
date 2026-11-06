# Gerson: how the attacks look, behave, feel and pace (reference video vs. our fight)

**Compared:**
- Reference: `dl/files/gerson.mp4` (Deltarune Ch4 secret Gerson, no-hit run).
- Ours: `games/gerson.html` ("Gerson — What For?"), all 17 `ATTACKS`.

**Where the numbers come from:**
- Timing study: `docs/reference-study/gerson-precise.md`.
- Reference frames and arrow tracks (contact sheets, colour-blob tracks).
- Our game, captured frame by frame on a virtual 60 fps clock.
- Our game, simulated headlessly with the real `engine.js` and `story.js`.

**Units.** Reference: 1 game frame (gf) = 1/30 s. Our game renders at 60 fps. I quote times in seconds or in 30 fps "gf" so the two can be compared directly.

All contact sheets are in `scratchpad/vid/lf-gerson/` (listed in §8).

---

## 0. The short version (most important gaps)

1. **Ours is metronomic; the reference is phrased.**
   - Every spawner in our game fires at one fixed interval for the whole 16–25 s turn:
     - Arrows: 0.48 / 0.42 / 0.35 s.
     - Shell waves: 1.26 / 1.11 / 3.05 s.
     - Hammers: every 5.6 s or 10 s.
     - Spawn-interval coefficient of variation is about 0.00–0.02.
   - Reference turns are built from phrases with rests:
     - slow pace-setters, then fast alternating pairs, then same-side trains;
     - 0.6–1.0 s rests;
     - a finisher.
   - In our shield turns the side changes on **every** arrival (29/29 in THE OLD GUARD). The reference uses same-side trains: only 9/17 arrivals change side in T8.
2. **No turn has a staged ending; turns stop on a timer.**
   - At `time >= duration` the engine runs `this.bullets=[]`. This deletes arrows that are still in flight; most turns' "last arrival" is exactly the duration.
   - THE PASSAGE HOLDS winds up a hammer at 24.02 s with a 1.5 s delay. The turn ends at 25 s, so **the telegraph never pays off**.
   - The reference ends with a readable finisher: big hammer → ring flash, ground-pound star burst, or clone ring → white flash. It then waits about 0.35 s and spins the box out.
3. **Hazards have no visible source, and Gerson barely acts.**
   - In shield turns Gerson holds pose 0 for 16–18 s, with only a 1.5 px bob.
   - In the 58 s finale he is off-screen from 6 s to about 55 s.
   - In the reference, attacks come out of him: a whirlwind spin, a swing smear that knocks the box, he bats the shell back, and his own body is the dive.
4. **Strikes have no impact.** Our hammer lane strike:
   - shows a static telegraph for 0.9 or 1.5 s;
   - then shows a pale bar at full brightness for 0.4 s;
   - has no flash, no shake and no motion;
   - Gerson is still in his wind-up pose when it lands.

   The reference dive has a clear sequence:
   - the attacker appears over the lane;
   - lane and silhouette ramp grey → white → grey over 0.40 s;
   - a smear crosses the box in 2 frames or fewer;
   - the body lingers about 0.2 s, then fades.
5. **Block feedback is weak.**
   - Our shield turns white for about 5 gf, and the arrow just disappears.
   - The block "kick" (`fx.kick(.07)`) moves the screen about **0.07 px**, so nothing is visible.
   - The reference shows a 3-frame white shield, one tinted frame, and 3–4 gold sparkles flung away from the impact over about 0.3 s.
6. **Colour hierarchy.** Our arrows are the same bright green as the shield, the SOUL fill and the box border. Reference threats are warm: yellow while queued, red when next. The player's kit is green and cyan.
7. **No box transitions.**
   - Our box is full size on frame 1, and the first hazard arrives 1.18 s later.
   - Our box spin has no cause. It eases exponentially and takes about 1.6 s (purple) or 2.7 s (hybrid) to reach 90 %.
   - In the reference, the box spins in over 7 gf with after-images. When it is re-shaped, it is *hit* by Gerson's swing and settles in about 0.4 s.

Things we already do as well as or better than the reference:
- **Hurt feedback:** red full-screen tint, edge vignette, about 2.5 px shake, HP tick, i-frame flicker.
- **Vine walls:**
  - they grow from Flowey along a tether;
  - they show a CRACKING → BREAKING state;
  - they burst into pixel debris that falls for 1.1 s.
- **Trick-arrow flip telegraph:** cyan ring on the new side, a dim ring on the old side, then a 0.22 s hesitation.
- **Shell "ghost + dashed path" pre-spawn:** 0.5 / 0.85 s.
- **Finale launch:** white flash, box border shattering into falling segments, UI dropping away, speed lines.

---

## 1. Method

- **Reference visuals.** Contact sheets of consecutive game frames, built from every second video frame, for each attack type: T1/T2/T3 shields, T4 big hammer + block + first dive, T5 launch/crossings/ground pound/stars, T6 set-up/storm/big hammer, T8/T9 arrows and shells, T10 dive chain, T11 wide box, T14 dive chain and ring finale. I also made enlarged crops of the arrow, shield, shells and storm hammers. Scripts are in `scratchpad/lfg/scripts/` (`sheet.py`, `grab.py`, `sbs.py`).
- **Reference micro-pacing.**
  - Arrow spawn and impact times come from the existing tracks `gp/arrows_T*.json`.
  - Block events come from +1 % TP steps on the TP bar (`gp/feat.npz`; about 3 px per 1 %, and a step shows 2 gf after the block).
  - T5 crossings come from `gp/shellT5.txt`.
  - Hammer-storm density comes from a new grey-blob tracker (`lfg/scripts/hamtrack.py`).
  - Lanes come from `gp/lanes_T11.txt` and the timing study.
  - Output: `lf-gerson/refpace.json`.
- **Our visuals.** Playwright on a virtual 60 fps clock, driving `window.gerson.game`:
  - `startAttack(i)` jumps straight to an attack;
  - a bot aims the shield at the next arrow and steps to the open lane;
  - invincibility is on, except for one run with the bot off to capture hit feedback.
  - Script: `lfg/cap.js`. I captured attacks 0, 1, 3, 5, 15 and 16, plus a hit run.
- **Our micro-pacing.** The real engine modules were extracted and run headless (`lfg/sim.js`) for all 17 attacks:
  - perfect-shield bot, invincible, SOUL parked on its lane;
  - spawn = when a bullet is pushed;
  - arrow arrival = blocked or removed;
  - shell arrival = it crosses the SOUL's x position (y in the finale);
  - hammer arrival = when its `delay` ends.
  - Output: `lf-gerson/ours-pace.json`.

---

## 2. Reference attack catalogue: look, behaviour, feel

Screen geometry: 960×720 game screen; standard box ≈150 game px (224 video px).

### 2.1 Shield + arrows (T1–T3, T7–T9, T13)

**Look**

| Element | Description |
|---|---|
| Box | Bright green, 3 px border. |
| Guard | A thin dark-green square, 56 game px. It turns into an **octagon** in place at 36.63 s: the corners are clipped over 3 gf right after a block. |
| Shield | One side of the guard: a magenta/purple bar with a **cyan axe-head blade** at one end, so it reads as Gerson's weapon. |
| SOUL | Plain green heart. |
| Arrows | About 19×8 game px, which is 12.5 % of the box width. Solid fill, 1 gpx dark outline, 1 px highlight line. **Yellow while queued, red when next**, switching 2 gf after the previous block. They pop in at the screen edge at full opacity; there is no fade. Same-side trains show as a queued line of 2–3 yellow arrows (T8). |

**Behaviour**
- Arrows fly straight at constant speed. Speed is scaled so that the time to impact is about 0.6–0.7 s from every side.
- The shield snaps 90° in about 2 gf, with one in-between frame.
- **Gerson** stands to the right of the box at the same height:
  - crouched ready pose, hammer held level;
  - the scarf flutters (idle loop);
  - he does not throw each arrow; they come from the screen edges.

**Feel**
- **Block:**
  - the shield bar and blade turn pure white for 3 gf;
  - one pink-tinted frame follows;
  - 3–4 small gold four-point sparkles burst from the impact point and drift outward, fading over about 0.3 s;
  - TP +1 % ticks 2 gf later.
- No screen shake and no hit-stop on blocks.
- The guard's octagon shows white segments briefly when hit, in shell turns.

### 2.2 Shells (T8–T10, T13, T14)

- **Look:** small turtle shells (about 28 video px). They flip side to side as they spin and change colour (green ↔ yellow).
- **Behaviour:**
  - they enter from the screen edge (the first one always from the top);
  - they are knocked away at an angle off the shield and come back in from another side;
  - slow (about 190 px/s) and fast (340–540 px/s) types.
- **Feel:** the same block flash and sparkles as arrows. The shield visibly sweeps through the diagonal while turning.

### 2.3 Big hammer finisher (T4, T10, T14)

**Look**
- A small hammer, head-down, at the top centre.
- It flashes white and red on alternate frames.
- It descends at 0.2 box widths/s, a visible **6.5 s countdown** in T4.

**Behaviour**
- It hovers, then thrusts. The handle stretches out like a piston on the final lunge.

**Feel**
- **Impact** (sheet `ref-t4_block.png`):
  - the guard area becomes a solid white disc for 2 gf;
  - the guard shatters into pieces that fly outward;
  - a **thick white ring** (about 12 px) expands from the box and thins to a dashed 1 px line over about 0.25 s;
  - the SOUL flickers pink, then turns red.
  - Then: about 0.25 s of nothing, Gerson **drops in above the box**, and the first lane fades in.

### 2.4 Dives and lanes (T4, T10, T14; sheets `strike-telegraph…`, `ref-t10_chain.png`)

**Look**
- A full-size Gerson (or clone) appears directly above the lane.
- He becomes a **pure white silhouette in sync with the lane brightening** grey → white → grey.

**Behaviour**
- Lane onset → strike: 0.37–0.40 s.
- The strike is a pale lavender **motion-smear crescent** that crosses the box in 2 gf or fewer.
- The body then sits in the lane head-down with the shell spinning for about 0.2 s, and fades while the next clone is already forming.
- Diagonal lanes (T14) rotate the clone to match the lane axis.

**Feel**
- A near-miss shows a **white outline around the red SOUL** (graze).
- No shake; the impact is carried by the smear and the body.

### 2.5 Shell & stars (T5; sheets `ref-t5_pound.png`, `ref-t5_stars.png`)

**Launch**
- Gerson flashes green.
- A big white swing smear.
- He becomes a pink/green whirlwind and **bats a shell**.

**Crossings**
- The shell leaves a **trail of white stars** that hang in the box, then drift away.
- Gerson runs to the other side and **bats it back**: call-and-response.

**Ground pound**
- The shell rises to the top centre (about 0.6 s wind-up, with Gerson hovering above).
- Concentric grey shock-rings appear.
- The shell slams down stretched (motion squash).
- On impact: dust puffs along the floor, a white ring, and a cluster of grey stars that turn white.
- A **star fountain** follows (gravity arcs, spinning), then **star rain** for about 2.4 s. The SOUL shows graze outlines.

### 2.6 Hammer storm (T6, T12; sheets `box-spin…`, `ref-t6_storm.png`, `ref-t6_big.png`)

**Set-up**
- Gerson whirlwinds, then a **swing smear hits the box**.
- The box slides aside and rotates 45° into a diamond, with 3–4 after-image outlines, settling in about 0.4 s.

**Storm**
- Small grey/brown hammers (about 30 game px) tumble a little as they fly in arcs from Gerson's position at the upper right toward the lower left.
- They are **drawn across the whole screen, not clipped to the box**.
- Gerson keeps leaping and posing at the upper right while throwing.

**Finisher**
- A **giant hammer**, about box size, falls rotating.
- It lands in the box and knocks the box about 45 px down.
- It sits and wobbles for about 0.6 s while the SOUL is squeezed into a corner, then slides out.

### 2.7 Wide-box dives (T11; sheet `ref-t11_wide.png`)

- Gerson leaps off-screen with **stacked vertical after-images**, then drops above the box.
- The box stretches into a 672×112 strip over about 0.2 s.
- A **row of clones** marches along the top; each one goes white over its lane, then dives.
- Sweeps run left → right, then right → left, followed by bursts of 2–3 lanes at once.

### 2.8 Finale (T14; sheet `finale-climax-ref-vs-ours.png`)

1. A dive chain accelerates: about 14 dives, 0.53 s → 0.30 s apart, with diagonal lanes.
2. The box shrinks to 0.75×.
3. Gerson whirlwinds; **clones pop in one by one** into a ring pointing inward.
4. They hold for about 0.9 s.
5. The box turns grey, then **everything flashes white for 0.13 s**.
6. One blurred spinning sweep around the box.
7. They vanish, and Gerson is standing again.
8. Fade to white.

---

## 3. Our attacks: look, behaviour, feel

Screen geometry: 768×576 canvas. Gerson is drawn at (270,134), upper left above the box.

| Mode (attacks) | Look | Behaviour | Feel |
|---|---|---|---|
| **Green / shield**: THE OLD GUARD, A HELPING WEED, SECOND THOUGHTS; reprises YOUR OWN GUARD, FOUR OPEN SIDES, NO VINES TO LEAN ON | 164 px box with a soft green 3 px border. SOUL is green with Seth's purple outline. Shield: pale-green flat bar (5×32 px) on a 1 px dark-green ring at r = 27. Arrows: bright green, about 20×14 px (≈12 % of the box, the same ratio as the reference), shown with a faint dotted guide line to the SOUL. Trick arrows: cyan double chevron. | Spawn 205 px from the SOUL. They pop in at full alpha; the second arrow of a pair waits at 40 % alpha. Constant speed taken from a 6-step table (230–380 px/s) → 0.46–0.77 s to impact. The shield turns with exponential smoothing (about 3–4 gf per 90°). Trick arrows flip at 76 px, with rings and a 0.22 s pause. **Flowey turns:** vine walls grow over 0.65 s on two sides with a tether to Flowey; they absorb arrows, flash, crack, turn brown ("BREAKING"), then burst. Heal seeds and thorns fly from Flowey. **Gerson stays in pose 0 all turn.** | **Block:** shield white for 0.15 s (about 5 gf); the arrow disappears; no particles; `kick(.07)` ≈ 0.07 px of shake (invisible); a block sound. **Hit:** red full-screen tint and red edge flash, about 2.5 px shake, HP drop, 0.76 s flicker. The SOUL also flickers for the first 1 s of *every* attack (start-of-turn i-frames look like a hit). |
| **Purple / strings**: BENT STRINGS, WHO IS PULLING?; reprises YOUR OWN FOOTING, MAKE AN OPENING | 340×176 box, three purple string lines. Shells: grey-white spiral discs, about 22 px. The open lane is a dark band. Hammer telegraph: dashed gold lane plus "!". | Shell walls with one gap enter from one side: a 0.5 s ghost at 35 % alpha with a dashed path, then constant speed 240–335 px/s. Gerson takes pose 3 for 0.6 s on each wave. Hammer: pose 2 (raised), lane telegraph for 0.9 s, then a pale bar and the hammer prop hold for 0.4 s. **Box spin** 90° starts 0.5 s after each wind-up, so it overlaps the strike. The box shrinks while rotated (`viewScale`). | Hammer strike: no event, flash or shake; it just appears and disappears. The spin has no cause on screen (only the text "Mind your footing, kid"). The rotated box crosses into the HUD. |
| **Hybrid**: HEART AND HANDS, TURNING THE SCREW, ROOM TO FALL, OLD HABITS, ONE MORE MINUTE, THE PASSAGE HOLDS | 484×200 box (5 lanes) or 556×216 (7 lanes). Green SOUL plus shield inside the strings. The top edge (y 240–250) overlaps Gerson's HP bar (y 243). | Arrows every 1.3 s (1.15 s in the later turns). Shell walls every 3.05 s, with a 2-lane gap and a 0.85 s ghost. Hammers at 4 s and 14 s (1.5 s telegraph). Spins every 7.7 s, sometimes 180°. Spin smoothing is 0.85/s, so the box is still visibly crooked about 4 s after a spin. | As above. THE PASSAGE HOLDS ends on a hammer wind-up that never strikes. |
| **Air**: ONE LAST LESSON | 0–4 s: hammer raised, then a white flash. The box border **shatters** into pieces with gravity and spin, the UI drops away, and parallax speed lines appear. Then only the SOUL, with a faint purple trail, in open sky. | From 7 s: arrows from below only, every 0.68 s, then 0.52 s after 25 s. From 8 s: rows of about 10 shells rise from below with one gap (marked by a chevron at the bottom and dotted 400 px rise paths), every 1.55 s, then 1.27 s. Hazards stop at 50 s. Landing runs 52–58 s; Gerson reappears kneeling at about 55 s. | The launch is strong. Then about 42 s with an unchanging threat vocabulary and no Gerson. **No climax:** hazards simply stop. |

---

## 4. Micro-pacing (per projectile)

**Definitions**
- *Spawn interval*: time between spawn events. Our walls of simultaneous shells count as one event.
- *Arrival interval*: time between consecutive arrivals at the shield or SOUL.
- *Peak*: the most arrivals in any 1-s window.
- *Decisions/s*: distinct things the player must react to per second (a shell wall counts as one decision).

### 4.1 Shield turns: reference T1–T3, T7–T9, T13 vs. ours (green)

| | Arrows | Spawn interval mean / med / min / max (s) | Impact interval med (min–max) | Impact CV | Side changes | Peak /1 s | Longest rest | Hazard span |
|---|---|---|---|---|---|---|---|---|
| **Ref T1** | 13 (+2 blocks not tracked) | 0.51 / 0.30 / 0.00 / 1.97 | 0.32 (0.27–1.00) | 0.47 | 7/12 | 4 (5 with all blocks) | 1.00 s (9.40→10.40) | 6.7 s |
| **Ref T2** | 15 | 0.36 / 0.33 / 0.07 / 1.10 | 0.38 (0.33–0.77) | 0.27 | 14/14 | 3 | 0.77 s | 6.5 s |
| **Ref T3** | 15 | 0.47 / 0.40 / 0.07 / 1.23 | 0.43 (0.17–0.67) | 0.34 | 11/14 | 3–4 | 0.67 s | 7.1 s |
| **Ref T7** | 17 | 0.45 / 0.35 / 0.10 / 1.13 | 0.33 (0.17–1.00) | 0.55 | 11/16 | 4 | 1.00 s (103.6→104.6) | 7.6 s |
| **Ref T8** | 18 (+shells) | 0.26 / 0.27 / 0.03 / 0.77 | 0.30 (0.07–0.77) | 0.61 | 9/17 | **6** | 0.77 s | 10.4 s |
| **Ref T9** | 14 (+≈5 shells) | 0.43 / 0.27 / 0.03 / 2.37 | 0.33 (0.10–2.17) | 1.00 | 12/13 | 4–5 | 2.17 s (145.0→147.1) | 11.1 s |
| **Ref T13** | 8 (+≈8 shells) | 0.55 / 0.53 / 0.07 / 1.30 | 0.33 (0.23–0.60) | 0.33 | 7/7 | 3–4 | 3.1 s (shells 218.5→221.6) | 12.5 s |
| **Ours 0 OLD GUARD / 8 YOUR OWN GUARD** | 31 | **0.48 / 0.48 / 0.48 / 0.48** | 0.28 (0.27–0.75) | 0.45 | **29/29** | 3 | 0.75 s | 14.1 s |
| **Ours 1 HELPING WEED / 9 FOUR OPEN SIDES** | 55 (42 events; a pair every 3rd) | **0.41 / 0.42 / 0.40 / 0.42** | 0.22–0.26 (0.18–0.73) | 0.46–0.51 | 50–51/52 | 5 | 0.67–0.73 s | 16.1 s |
| **Ours 2 SECOND THOUGHTS / 10 NO VINES** | 63 (48 events) | **0.35 / 0.35 / 0.35 / 0.35** | 0.20 (0.18–0.82)\* | 0.49–0.68 | 54/60 | 6 | 0.80–0.82 s | 16.1 s |

\*In SECOND THOUGHTS, near-simultaneous arrivals (0.02 s apart) are arrows hitting a vine wall in the same frame as a block.

**How the reference changes rhythm within a turn**

| Turn | Phrases |
|---|---|
| T1 | Slow singles about 0.57 s apart (7.67, 8.23, 8.83, 9.40) → **1.0 s rest** → one slow single (10.40) → **fast alternating L/R** pulse, 0.30 s (10.97–12.43) → **3-arrow train from the top**, about 0.13 s apart (12.77–13.03). |
| T2 | A steady 0.33–0.40 s pulse from all four sides, with two slow decoys (visible about 1.5 s) as off-beats. The last arrow comes after a 0.77 s rest. |
| T3 | Pulse → the **octagon change** at a block (36.63) → the first diagonal after a 0.6 s gap → fast diagonal pair 0.17 s apart → one closing arrow after a 0.67 s rest. |
| T7 | 0.33 s pulse → **1.0 s rest** → speed ramps from 410–540 to 720–900 px/s at the end. |
| T8 | **Same-side triples** (L×3, R×3, L×3; 0.17–0.30 s apart; up to 6 on screen) → shells with blocks about 1.0–1.3 s apart (125.6, 126.8, 127.9, 128.4, 129.2, 129.6). |
| T13 | Shells alone, 1.1 s apart → **3.1 s rest** → accelerating 0.81, 0.65, 0.44, 0.35 → arrows mixing slow decoys (about 225 px/s) with fast closers (about 900 px/s). |

**Ours.** One constant spawn pulse per turn; nothing changes between second 1 and second 16.

- The arrival rhythm does vary, but only because the speed table cycles every 6 arrows. THE OLD GUARD repeats a "da-dum (0.27 s) … rest (0.75 s)" pair for all 16 s, a 2.9 s loop played about 5 times.
- The two-arrow "double" in turns 1/2/9/10 is always the same shape: the second arrow 0.12 s later at speed 380.
- There are **no same-side trains**: the side table and the 0.20 s arrival reservation guarantee a side change almost every time.
- There is **no finisher**; the turn ends on the timer and deletes arrows still in flight.

**Decisions per second at peak:** ref T8 about 6/s, but only for about 1 s at a time. Ours SECOND THOUGHTS reaches about 6/s and holds roughly 4–5/s for 16 s.

### 4.2 Lane strikes: reference dives (T4, T10, T11, T14) vs. our hammers (purple and hybrid)

| | Telegraph → strike | Strike interval | Sub-pattern structure | Peak decisions/s |
|---|---|---|---|---|
| **Ref T4** | Lane 0.37–0.40 s (attacker visible 0.47 s) | — (1 dive) | Arrows end 54.83 → big hammer blocked 55.33 (**0.5 s**) → ring 0.25 s → red SOUL 55.50 → first strike 56.13 (**0.63 s**) | — |
| **Ref T10** | 0.40 s (24 vf, constant) | **0.53 s × 7** (159.87–163.2), overlapping (the next lane starts while the previous body is still in the box) | Shells (about 0.43 s apart, 156.9–159.05) → hammer lunge 159.33 → **0.5 s** → 7-dive chain → **1.27 s rest** → horizontal dash 164.47–165.07 → spin-out 165.8 | ≈1.9/s |
| **Ref T11** | 0.47–0.50 s | Sweep A: a lane **every 0.167 s** (8 lanes, 75 px steps). Sweep B: every 0.267 s. Bursts: 2–3 lanes at once, about 1.0–1.2 s apart | Gerson set-up 1.5 s → sweep L→R (176.67–178.6) → about 0.6 s rest → sweep R→L (179.17–181.3) → about 0.9 s rest → burst (182.2) → burst (184.1/184.3) → bursts 185.4–187.8 | ≈6 lanes/s in a sweep (a moving "wave", one decision) |
| **Ref T14** | 0.37 s | About 14 dives, **0.53 → 0.30–0.33 s** (mean 0.41) | Shells → a few arrows → big hammer 246.57 → 0.9 s → chain 247.5–253.2 → shrink 0.5 s → ring hold 0.9 s → flash 0.13 s → sweep → end | 2.4–3.3/s |
| **Ours BENT STRINGS (3), YOUR OWN FOOTING (11)** | **0.90 s**, static | **5.6 s** (4.0, 9.6, 15.2) | Shell walls every **1.26 s** (2 shells, 240–335 px/s; arrivals 0.05–1.43 s apart). A hammer every 5.6 s, a spin 0.5–0.9 s after each wind-up. The same 5.6 s "bar" repeats 3×; no rests or finisher | Shells about 0.8 walls/s + 0.18 hammers/s ≈ **1/s** (peak 3 arrivals/s) |
| **Ours WHO IS PULLING? (4), MAKE AN OPENING (12)** | 0.90 s | 5.6 s | Walls every **1.11 s**, otherwise as above. Longest rest 1.3–2.0 s, at random positions | ≈1.1/s (peak 3–4) |
| **Ours HEART AND HANDS (5) … THE PASSAGE HOLDS (15)** | **1.50 s**, static | **10 s** (4.0, 14.0, [24.0 never lands in 15]) | Three independent clocks: arrows 1.30 s (1.15 s in 13–15), walls 3.05 s (3 / 5 / 5 shells arriving together), spins 7.7 s. Combined arrival interval median 0.17–0.64 s, but **holes up to 1.6 s** fall wherever the clocks leave gaps, not before a climax | ≈**1.2 decisions/s** (peak 4–7 arrivals/s, counting each shell in a wall) |

### 4.3 Spectacle red-SOUL turns (no direct counterpart in ours)

| | Spawn/arrival rhythm | Structure | Peak |
|---|---|---|---|
| **Ref T5 shell & stars** | Box crossings at 62.91, 64.09, 65.17, 66.26, 67.23, 67.95, ≈68.9, 69.82. Intervals **1.18, 1.08, 1.09, 0.97, 0.72, 0.93, 0.92**: accelerating ping-pong, alternating sides. The star trail lingers 0.5–1 s per pass | Launch (1.1 s set-up) → about 8 crossings → **0.6 s wind-up rest** at the top (70.6–71.2) → slam (0.2 s) → star fountain + rain for 2.4 s → end | About 1 crossing/s plus a field of stars |
| **Ref T6/T12 hammer storm** | A continuous stream from one corner. On screen: 14 at +0.5 s → 45–50 by +2.5 s. Inside the diamond: 3–5 (first half) → **8–9** (second half). With about 0.6 s dwell that is about 6 → 15 hammers/s passing through. No rests | Box knocked into a diamond (0.4 s) → stream builds over 2–3 s → steady, densest in the last third → tapers about 1 s before the end → **one big slow hammer** (warning about 0.25 s, sits about 0.6 s) → end | 6–15/s, read as one "field" moving one way |

### 4.4 Finale: reference T14 vs. ours ONE LAST LESSON

| | Reference T14 (19.7 s box time) | Ours ONE LAST LESSON (58 s) |
|---|---|---|
| Phases | Shields (5 s) → arrows (2 s) → big hammer → **14-dive chain, accelerating 0.53 → 0.30 s** → shrink → ring hold 0.9 s → white flash 0.13 s → sweep → vanish | 0–4 s hammer raised → shatter → 1.6 s launch → **1.4 s empty** → arrows from below 0.68 s (7–25 s) then 0.52 s (25–50 s); shell rows 1.55 s then 1.27 s (8–50 s) → **hazards stop at 50 s** → 2 s empty → 6 s landing |
| Spawn variety | Five sub-patterns, with 0.5–0.9 s rests between them | 2 projectile types, 1 direction, 1 tempo change (at 25 s) |
| Peak | 2.4–3.3 dives/s near the end | About 3 decisions/s (2 arrows + 1 row per 1.27 s). 14 arrivals/s if each shell is counted |
| Climax | Staged: hold → flash → sweep | None (a fade-out of spawns) |

### 4.5 Turn-level framing

| | Reference | Ours |
|---|---|---|
| Box in | 0.23 s spin-in | Instant |
| Box full → first hazard | 0.4–0.7 s (1.0–1.1 s for spectacle turns) | First spawn 1.18 s; first arrival 1.95 s (green), 2.1 s (hybrid), 2.4–3.6 s (purple) |
| Last hazard → box out | 0.35 s (plain), 0.6–0.8 s (after a finisher) | 0 s: projectiles are deleted at `duration`, and the dialogue box pops in on the same frame |
| Hazard span | 6.5–7.7 s early, 10.4–12.5 s later, 16.3 s finale | 14.1–16.1 s (green), 15.5–16.3 s (purple), 18–23 s (hybrid), 43 s (air) |

---

## 5. Attack by attack: closest reference, what works, gaps and fixes

The suggestions keep our mechanics: Flowey's vine walls and their breaking, trick-arrow flips, purple strings with lane-cooldown movement and box spins, the hybrid shield-plus-move, and the falling finale. They also keep our art: pale outlines, Seth's purple, the existing GersonArt poses and props. Wherever a quality of the reference is cited, the suggestion is to reproduce the quality in our own style, not the sprite.

### THE OLD GUARD (0) and YOUR OWN GUARD (8): closest to reference T1/T2

**What works**
- Clean geometry.
- The arrow-to-box size ratio matches the reference (about 12 %).
- Time-to-impact of 0.46–0.77 s is in the reference band.
- The dotted guide line is a good, subtle aim aid.
- The shield turn speed (about 3–4 gf per 90°) is fine.

**Gaps and fixes**
1. **Phrase the turn instead of using one 0.48 s clock.** For a 16 s turn, for example:
   - 3 slow pace-setters (speed about 150 px/s, 1.2–1.6 s visible, about 0.6 s apart);
   - an alternating L/R pulse at 0.30 s × 6;
   - a 0.8 s rest;
   - a same-side train of 3 at 0.15 s (allowed: the reference uses 0.13–0.17 s for same-side trains);
   - a 0.6 s rest;
   - repeat once at slightly higher speed;
   - finisher (point 5).

   Implementation: replace the `interval=solo?[.48,.4,.34][i]` lookup with a per-pattern script of `[delay, side, speed]` tuples. The existing `lastArrowArrival` reservation (≥0.20 s) should only apply when the side changes.
2. **Threat colour.** Draw arrows in a warm colour with a dark 1 px outline (for example the existing UI orange/amber), so they separate from the green shield, SOUL and border. Then mark **only the next-due arrow** with a second state (brighter or red-tinted), switched 2 gf after the previous block. The reference shows this gives a reliable 0.2–0.3 s "this one is next" cue.
3. **Block feedback.**
   - Shorten `blockFlash` from 0.15 s to 0.10 s (3 gf), then show 1 gf of Seth-purple tint on the shield.
   - Spawn 3–4 pixel sparkles at the impact point, flung away from the SOUL along the arrow's bearing, fading over 0.3 s (`ImpactFX.burst` with count 4, speed about 120, life .3, using the arrow's colour).
   - Leave the screen still, as the reference does. Instead, recoil the shield bar 2 px outward for 2 frames.
   - The current `kick(.07)` produces no visible shake (about 0.07 px), so either drop it or replace it with the recoil.
4. **Cause and effect.** Give Gerson a reason to be in the scene:
   - a 2-frame idle (scarf or breath) loop at 4–6 fps, instead of a 1.5 px bob;
   - a "throw" pose (pose 3) for about 0.2 s at the start of each phrase, aimed to the side of the coming volley.
   - Optionally, spawn the arrows of one phrase from his side of the screen.
5. **Finisher and exit.**
   - Stop spawning so that the last arrival is at least 0.35 s before `duration`.
   - End on one heavy arrow: bigger sprite, slow, flashing, visible about 2 s (the "countdown" quality of the reference big hammer). Blocking it fires an expanding ring (`ImpactFX.ring` radius about 120, width 6 → 1, life .25).
   - Then a 0.23 s box spin-out.
   - Never let `this.bullets=[]` delete visible arrows. Fade them over 4 frames if anything must be cleared.
6. **Box spin-in and the first beat.**
   - 7 gf spin-in: scale 0.5 → 1, rotation 90° → 0, with 2–3 fading outline after-images.
   - Move `nextArrow` from 1.2 to about 0.6 s after the box is full.
   - Do not flicker the SOUL during the start-of-turn grace period: keep `invulnerability`, but skip the alpha flicker when it comes from `startAttack`.

### A HELPING WEED (1), SECOND THOUGHTS (2), FOUR OPEN SIDES (9), NO VINES TO LEAN ON (10): closest to reference T3/T7/T8

**What works**
- The vine walls are our best supporting visual:
  - growth animation;
  - tether to Flowey;
  - hit flash and leaf flecks;
  - CRACKING / BREAKING colour states;
  - pixel-debris collapse.
- Trick arrows have a clear flip telegraph.
- The density (peak 5–6 per second) matches reference T8.

**Gaps and fixes**
1. **Density with no release.** We sustain 4–6 arrivals/s for about 16 s; the reference peaks at 6 for only about 1 s at a time. Keep the peak, but insert 0.6–1.0 s rests every 3–4 s and put the peak in the last third.
   - Unique opportunity: **use vine breaks as phrase markers.** When a wall breaks (now at about 8–11 s), pause spawning for 0.5 s, then send a same-side train at the newly opened side. This is the "escalate by changing modes" lesson, in Flowey's terms.
2. **The double arrow is always the same shape** (+0.12 s at speed 380). Alternate it with:
   - same-side trains (3 at 0.15 s);
   - a slow decoy and fast closer pair (the reference T2/T13 trick).
3. **Trick arrows.** Good already. Give the flip 2 frames of hit-stop on the arrow only (freeze its position), so the 0.22 s hesitation reads as deliberate.
4. **Heal-seed text.** The "+5 HP" text is drawn over the SOUL, where the player is looking. Draw it 30 px above the SOUL, or at the HP bar.
5. Apply all the OLD GUARD points (colour, block feedback, turn framing).

### BENT STRINGS (3), WHO IS PULLING? (4), YOUR OWN FOOTING (11), MAKE AN OPENING (12): closest to reference T10 dives/lanes (strike), T11 (lane reading) and T8–T9 shells (projectile)

**What works**
- The shell ghost with a dashed path, shown 0.5 s before moving, is an honest telegraph.
- The open-lane band is clear.
- Gerson changes pose on each wave and on the hammer.
- The spin is a genuine stage manipulation.

**Gaps and fixes**
1. **Hammer telegraph: animate it, don't just show it.**
   - Keep 0.9 s for fairness: lane changes have a 0.22 s cooldown, so our "escape" is slower than the reference's free movement.
   - For the first 0.6 s, let the gold dashes **fill along the lane like a fuse**.
   - Then brighten the whole lane to near-white for 2 frames at T–0.13 s and drop it back to dim. This is the reference's grey → white → grey ramp, in our colours.
   - Put Gerson in the raised pose for the wind-up and switch to the **swing pose on the exact strike frame**. Currently he is still in the wind-up pose when the strike lands, and pose 3 appears later from an unrelated shell wave.
2. **The strike needs motion and impact.**
   - Over 2 frames, sweep the hammer prop along the lane from Gerson's side, leaving 3 decreasing-alpha after-images (a smear).
   - On the strike frame: emit a new `'slam'` event, mapped to `kick(.3)` (about 1.3 px) and a 2-frame white flash clipped to the lane, plus a small dust burst at the far wall.
   - Fade the bar out over 0.15 s instead of holding it at full brightness for 0.4 s.
3. **Spin: show the cause and shape the ease.**
   - Trigger the spin with a visible blow: Gerson's swing pose plus a short pale smear arc touching the box corner.
   - The box is pushed 10–15 px, rotates with an ease-out (about 0.4 s, slight overshoot), and leaves 2–3 outline after-images.
   - This replaces `angle += diff*min(1,dt*1.45)`, which reaches only 90 % at 1.6 s and 99 % at 3.2 s.
   - **Do not overlap the spin with the hammer strike**, as now (spin at wind-up +0.5 s, strike at +0.9 s with the box at about 45°). Either start the spin 0.3 s after the strike, or freeze the strike lane's highlight in screen space so it stays readable mid-rotation.
4. **Rhythm.** The 5.6 s bar (wall, wall, wall, wall, hammer + spin) repeats identically 3×.
   - Vary it: two quick walls 0.7 s apart (call) → one slow wall (response) → a 1.0 s rest before each hammer.
   - Make the last bar the densest.
   - End the turn on a final "double hammer" (two lanes, the third open), then 0.6 s of quiet before the exit.
5. **Shell look.**
   - The grey spiral disc reads as a generic ball. Add a 2-frame wobble or squash on spawn.
   - Tint shells slightly warm once they are moving: ghost = grey, active = warm. The reference changes the shell's colour as its state changes.
   - Spawn walls from Gerson's side of the box when possible, so pose 3 visibly "throws" them.

### HEART AND HANDS (5), TURNING THE SCREW (6), ROOM TO FALL (7), OLD HABITS (13), ONE MORE MINUTE (14), THE PASSAGE HOLDS (15): closest to reference T4/T10/T14 (shield phase → big hammer → strike chain)

**What works**
- Combining two control schemes is our unique hook.
- Shell walls with a 2-lane gap and a 0.85 s ghost are fair.
- Arrows are slower in this mode (×0.75), which leaves attention for movement.

**Gaps and fixes**
1. **Three unsynchronised clocks, at about 1.2 decisions/s for 20–25 s.** This is the least dense mode in the fight and also the longest.
   - The reference mixed turns *sequence* their sub-patterns, with 0.5–0.9 s gaps:
     - shield phase about 3–5 s;
     - finisher;
     - ring;
     - strike chain about 3–5 s;
     - rest;
     - closer.
   - Suggested shape for each 20–25 s hybrid turn:
     - (a) 4–5 s shield-only phrase;
     - (b) 0.5 s gap with a Gerson pose change;
     - (c) 4–5 s of walls and movement;
     - (d) 0.8 s rest;
     - (e) both at once for 4–6 s, rising;
     - (f) finisher plus 0.6 s quiet.
   - This keeps the approved turn length while giving it phrasing.
2. **THE PASSAGE HOLDS' dangling wind-up.** The wind-up at 24.02 s has a 1.5 s delay against a 25 s duration, so it never strikes.
   - Make that hammer the turn's finisher by ending at about 26.2 s.
   - Or move it to start no later than duration − 2.2 s.
   - More generally: never spawn a telegraph whose strike lands after `duration`.
3. **Crooked box.** At spin rate 0.85/s the box is still visibly tilted (about 5°) 4 s after a spin. Use the same 0.4 s eased spin as the purple turns.
4. **Overlap with the HUD and Gerson.** The 7-lane box (y = 240) overlaps the enemy HP bar (y = 243), and rotated boxes cross the stats row. Either:
   - lower the HP bar or the box by about 12 px; or
   - clamp `viewScale` against the HUD rectangle as well as the canvas.
5. **Strikes and blocks.** Apply the purple-turn and green-turn feedback fixes. The 1.5 s hybrid telegraph should use the same fuse-and-flash ramp.

### ONE LAST LESSON (16): closest to reference T14 finale; also borrows T5 (ground-pound staging) and T6 (single-source stream)

**What works**
- The opening is the most spectacular moment in our fight:
  - white flash;
  - shattered border segments falling with spin;
  - UI dropping away;
  - speed lines;
  - purple SOUL trail.
- The shell-row gap marker and the 400 px dotted rise paths are good long-range telegraphs.

**Gaps and fixes**
1. **Gerson is absent for about 46 s.**
   - Keep him in frame: a small falling silhouette in the parallax layer, or a figure diving past every 6–8 s with a pale smear.
   - When he passes, the next arrow volley or shell row leaves *from him*. This is the reference's cause-and-effect quality, in our art.
2. **One vocabulary for 42 s.** Insert phase changes every 8–10 s, each preceded by a 0.6–1.0 s rest:
   - rows from below;
   - arrow trains from one side;
   - a "storm" of small shells drifting diagonally from one corner (easy to read because of the single source);
   - rows with two gaps that close.
3. **Climax.** Hazards now stop at 50 s with no beat. Stage a finisher in our style, for example:
   - shells gather into a **closing ring** around the SOUL, popping in one at a time over about 0.2 s;
   - the ring holds for 0.9 s with a gap;
   - it flashes white for 0.13 s;
   - it sweeps once around;
   - it bursts into debris (reuse the vine-wall or box-shatter debris look).
   - Then the landing. The reference spends about 1.9 s on this sequence.
4. **Rhythm.**
   - Arrows: 0.68 → 0.52 s, a single tempo change at 25 s.
   - Rows: 1.55 → 1.27 s.
   - Instead, accelerate in steps toward the climax, for example rows 1.55 → 1.3 → 1.0 → 0.8 s in the last 6 s, as the reference dive chain does (0.53 → 0.30 s).
5. **Landing.** The 52–58 s landing is long and has no hazards. Shorten it to about 3 s, or fill it with Gerson's line and his kneeling pose sooner. He appears at about 55 s.

---

## 6. Cross-cutting checklist (priority order)

| # | Change | Where | Cost |
|---|---|---|---|
| 1 | Replace constant spawn intervals with per-pattern phrase scripts: pace-setters, pulses, same-side trains, 0.6–1.0 s rests, densest last third | `pattern()` in engine.js | M |
| 2 | Turn finisher and clean exit: stop spawning so the last arrival is ≥0.35 s before `duration`; no telegraph whose strike lands after `duration`; never delete visible bullets; 0.23 s spin-out | `pattern()`, the end-of-turn branch in `update()`, `field()` | S |
| 3 | Lane-strike staging: fuse fill → 2-frame white peak at T–0.13 s → 2-frame swept hammer smear → `'slam'` (kick .3, lane flash) → 0.15 s fade; Gerson in swing pose on the strike frame | `spawnHammer`, `field()`, `notebookVisual.fx.bind` | M |
| 4 | Box spin with a visible cause and a 0.4 s ease-out with after-images; not overlapping a strike | `update()` angle easing, `transformArena`, `pattern()` | S |
| 5 | Warm threat colour plus a "next-due" highlight for arrows | `art.prop('arrow')` tint, `field()` | S |
| 6 | Block feedback: 3 gf white + 1 gf purple, 3–4 sparkles along the bearing, 2 px shield recoil; drop the invisible `kick(.07)` | `arrowStep`, `field()` shield draw, `ImpactFX` | S |
| 7 | Gerson acting: idle loop; throw or swing poses tied to spawns; keep him visible in the finale | `characters()`, pose timers | M |
| 8 | Box spin-in (7 gf, after-images); first hazard about 0.6 s after the box is full; no i-frame flicker at turn start | `startAttack`, `field()` | S |
| 9 | Finale phases and staged climax (ring → hold → flash → sweep → burst) | `finalePattern` | M–L |
| 10 | Layout: hybrid box against the enemy HP bar; rotated box against the HUD | arena constants, `viewScale` | S |

Optional, for feel parity: a **near-miss outline** (1 px white ring around the SOUL for 4 frames when a shell or hammer passes within about 12 px) in purple and hybrid turns. In the reference this cue sells near misses; we can show it without attaching any resource.

---

## 7. Caveats

- Reference block times come from TP steps. The bar saturates or hides in places, which is why T7 shows fewer TP blocks than arrows. Shell counts are ≈.
- Hammer-storm spawn rate was estimated from on-screen and in-box counts (±5) rather than from individual tracks. Grey-blob "new track" counts over-count fragments.
- T5 crossing times use the shell's x = 640 crossings. Its paths are diagonal, so these differ a little from the timing study's "every 0.6–0.75 s" figure.
- Our pacing comes from a deterministic headless run with a perfect-shield bot. Real players, Flowey rescues and vine intercepts shift arrivals slightly but not spawns. Captured frames are from the real page with an invincible bot.
- No reference hits exist (it is a no-hit run), so hurt feedback could not be compared.

## 8. Contact sheets and data (`scratchpad/vid/lf-gerson/`)

**Side-by-side sheets** (row 1 reference, row 2 ours, 1 tile = 1/30 s unless labelled):
- `block-feedback-ref-vs-ours.png`: block flash, sparkles and arrow colour.
- `strike-telegraph-ref-vs-ours.png`: dive lane and silhouette ramp vs. our hammer lane, wind-up pose and spin overlap.
- `box-spin-ref-vs-ours.png`: box knocked into a diamond by a swing vs. our cause-less exponential spin.
- `turn-opening-ref-vs-ours.png`: spin-in vs. pop-in.
- `finale-climax-ref-vs-ours.png`: ring → hold → flash → sweep vs. hazards fading out and the long landing.

**Reference-only sheets:**
- `ref-t4_block.png`: big-hammer block, white ring, red SOUL, Gerson drop-in.
- `ref-t5_pound.png`, `ref-t5_stars.png`: ground pound and star rain.
- `ref-t6_storm.png`, `ref-t6_big.png`: hammer storm and giant-hammer finisher.
- `ref-t10_chain.png`, `ref-t14_chain.png`, `ref-t11_wide.png`: dive chains and wide box.
- `ref-t9_shellzoom.png`: shells and shield sweep, enlarged.

**Our sheets:**
- `ours-a1_trick.png`, `ours-a1_break.png`: trick flip and vine break.
- `ours-a3_ham.png`: hammer strike during the spin.
- `ours-a5_a.png`: hybrid.
- `ours-a15_end.png`: dangling final wind-up.
- `ours-a16_launch.png`, `ours-a16_mid.png`: finale.
- `ours-hit.png`: hurt feedback.

**Data:**
- `refpace.json`: reference arrow spawn and impact times, sides, speeds, TP block times.
- `ours-pace.json`: every spawn and arrival for all 17 of our attacks.

**Scripts** (in `scratchpad/lfg/`): `sim.js`, `cap.js`, `scripts/sheet.py`, `scripts/sbs.py`, `scripts/refpace.py`, `scripts/ourpace.py`, `scripts/hamtrack.py`.
