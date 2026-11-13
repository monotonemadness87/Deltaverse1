# Spamson / Tenna: timing, micro-pacing and look and feel (references vs. "THE NEXT BIG THING" and "SPAMSON NEO — A Deal in the Dark")

**Compared**
- **TEN**: `dl/files/tenna-ch3.mp4`. Deltarune Ch 3, the Tenna final boss. 1280×720, 30 fps, 939 s. The battle runs from about 176 s to about 700 s. The game area is the centre 960×720 (1.5× scale of 640×480).
- **SPN**: `dl/files/spamton-neo.mp4`. Deltarune Ch 2, Spamton NEO (pacifist). 1280×720, 30 fps, 609 s. The battle runs from about 120 s to about 553 s. Same 1.5× layout.
- **MTT**: `dl/files/mettaton-neo-fan.mp4`. A fan-made Mettaton NEO v2.0. 962×720 (4:3 at 1.5×), 30 fps, 391 s. It is used as a third reference for yellow-SOUL, cannon and limb-sweep staging. It is fan work, not canon.
- **Ours**:
  - `games/spamtenna.html`, `LobbyBattle` ("THE NEXT BIG THING"): 27 turns. Turns 1–16 are the resident acts, 17–26 the Tenna + Spamson duo, and 27 the "POWER OF NEO" cannon finale.
  - `games/spamson-neo.html`, `NeoBattle` ("SPAMSON NEO — A Deal in the Dark"): phase 1 (4 patterns), phase 2 (6 patterns) and the 52 s final.
  - Neither shipped file was modified. Both engines were loaded read-only with `tools/sim/loader.js`.

**How the numbers were made**
- Every frame of all three videos was decoded through an ffmpeg pipe and scanned with numpy (`scripts/feat.py`, `hz.py`, `mtt-pass.py`). Per frame, the scan recorded:
  - the green (Deltarune) or white (MTT) bullet-box edges;
  - red and yellow SOUL blobs;
  - white, cyan, yellow and pink hazard blobs;
  - a 32×18 thumbnail, used for scene cuts.
- **Turn edges**:
  - DR box turns use the red-SOUL "spin-in" run (11–12 frames), then the first full box frame, then the 7-frame spin-out (`drturns.py`).
  - TEN minigames use hard scene cuts in the thumbnail stream (`|Δ| > 18`). They are exact to the frame.
  - MTT turns use the menu-box ↔ attack-box state plus SOUL presence. Several MTT turns are drawn in a non-standard box, and those edges come from 1 fps sheets (marked **≈**, ±0.5 s).
- **Pacing**:
  - Hazards were followed by a nearest-neighbour tracker. An "entry" is the frame a track crosses from outside the box to inside it (`cross.py`).
  - Entries less than 0.07 s apart are merged into one volley.
  - Player shots in SPN are elongated yellow blobs born within 60 px right of the yellow SOUL (`shots.py`).
- **Ours**:
  - Headless event logs on a fixed 60 fps clock (`scripts/ours-sim.js`). Every turn was run with the SOUL held still and damage disabled, and every hit was logged. The ST finale was run twice: with no upgrades, and with every upgrade (the hub's "NEO + UPGRADES" path).
  - Canvas captures were made at chosen live times on a virtual clock (`scripts/ours-cap.js`, frames in `ours/st` and `ours/neo`, sheets `sheets/ours-*.png`).

**Units**
- 1 gf = 1/30 s.
- "bw/s" means box widths per second, using each fight's own box.
  - SPN: 224 px square (the default box), 359×166 (the heads and big-ball turns), 374×256 (the rail turns), 489 (the face split, which is 225 per half).
  - TEN: 224×224.
  - MTT: 275–280 square, 637×200 wide.
  - Ours: ST 560×184 (5 lanes; 3 lanes on turns 1–4), finale 560×350 (7 vertical strings); NEO 560×168 (3 lanes), 544×232 (5 vertical), final 584×390.
- Because our box is 2–2.5× wider *relative to the screen*, I also give "sw/s" (screen widths per second; the game area is 960 px for refs and 768 px for ours) where it matters.

**Uncertainty**
- Box-turn edges are ±1 gf. Minigame edges are exact to the cut.
- **≈** marks sheet-derived values (±0.3–0.5 s).
- Entry counts:
  - Cyan Spamton heads break into 2–4 blobs. For SPN T1/T2/T8/T12/T13, the **volley** counts and **rests** are reliable; raw entry counts and peak entries per second are inflated (roughly ÷3).
  - Phone and pipis turns spawn hazards inside or beside the box, so their "entries" undercount. Those turns are described from sheets.
  - SPN shot counts depend on the SOUL being detected and are a lower bound.
  - MTT counts (ring fragments) are **≈**.
- Player turns in the references depend on the player and are listed for completeness.

---

## 0. Short version

| | TEN (Ch 3) | SPN (Ch 2) | MTT (fan) | Ours: ST duo + finale | Ours: NEO |
|---|---|---|---|---|---|
| Enemy attack length | box turns 6.3–8.5 s; minigames 9.0–11.5 s, often **two back to back** ("double feature") | 8.1–14.8 s (median 9.8); one 18.7 s pipis-plus-call turn; BIG SHOT ≈18.4 s | 10.9–23.6 s | duo 24–32 s; finale 162 s (kept: designer rule) | P1 11.5 s, P2 14.5 s, final 52 s |
| Spawn-to-spawn | **phrased**: stars 0.1–0.8 s; cut lines 0.07–0.7 s; rimshot launches every **2.3–2.6 s** with mini-star bursts in between; lightning **pairs** (0.1 s) every 0.7–0.86 s | **bursts and rests**: heads arrive as trios 0.07–0.17 s apart, then a **0.80–0.97 s rest** (5 rests in 8 s); diamond chains at 0.1–0.4 s, rests of 1.1–1.5 s; rails 0.67 s metronome then 0.2 s triplets | bursts at 0.17–0.2 s, rests 0.8–1.3 s, plus long set-up rests (3–9 s) | each actor is a **metronome** (Tenna 2.4–4.2 s, Spamson 1.15–3.2 s); combined sequence 0.05–2.7 s but repeating | one cast every **1.9 s** (P1/P2) or 1.48 s (final); CV < 0.02 inside a pattern |
| Hazard speed | 0.5–0.8 bw/s (≈0.12–0.19 sw/s) | **1.0–1.4 bw/s** for heads, diamonds and rails (crossing 0.7–1.0 s; 0.38–0.51 sw/s); 0.4–0.55 for big balls and face pellets | ≈0.5–1.0 | 0.29–0.55 bw/s (0.21–0.40 sw/s); finale up to 0.70 bw/s | **0.24–0.29 bw/s** (0.17–0.20 sw/s); final 0.39 |
| Peak entries/s | 6–10 | 7–13 (corrected) | ≈11–22 | 7–15 (child projectiles included) | 2–11 |
| Clean tail | 0.3–1.0 s | 0.1–0.5 s (the box spins out over still-live hazards) | ≈0.3 s | **negative on 18 of 27 turns**: the last spawn enters after the turn ends and is deleted | 7 of 11 patterns negative |
| Shooting (yellow) | not in box turns; aiming minigames ("SHOOT THE TARGETS", western) | taps 0.10–0.17 s apart, 2.1–2.8 shots/s sustained on shoot-heavy turns, ≥1 s pauses while dodging | yellow column and lattice turns, shots ≈0.15 s apart | 3-shot bursts (0.11 s), 0.38 s cooldown, ≈5 shots/s max; charge 0.85 s | 0.115 s auto-fire for 0.36 s, then charge to 1.0 s |
| Hazard size (in box) | stars ≈18–30 px = 8–13 % of box | heads 24–30 px (7–13 %), diamonds 37–44 px (17–20 %), big balls ≈55 px; SOUL 22 px = **10 %** | diamonds ≈5–8 % of box | heads 26 px (4.6 %), cards 18×22 (3.2 %); SOUL 15 px = **2.7 %** | cards 18 px (3.2 %), relay 30 px; SOUL 15 px (2.7 %) |

Main gaps, most important first:
1. **Metronomes inside 24–32 s turns.** The references build a 6–14 s turn from 3–6 *phrases* separated by 0.8–1.5 s rests, with a finisher. Ours run one or two fixed clocks for the whole turn. Rests exist only by accident, where the two actors' clocks drift apart. With the turn length kept, the ~4× longer window needs **sections**: intro, build, a rest, a peak and a finisher.
2. **Hazards appear at the box edge instead of coming out of the performers.** In SPN every hazard has a visible source on screen:
   - heads fly out of his body;
   - the heart on a chain fires the diamonds;
   - the pipis are lobbed down a bounce-path;
   - the phone handset orbits the box;
   - the giant face half sits *inside* the box and shoots.

   In TEN the stage itself is the source: stars spill from the spotlight wash, Tenna leaps through the "GAME TIME!" screen, and the box is literally cut by a clapperboard-style slash. Ours spawn hazards 20 px outside the box edge, while Tenna and Spamson stand still above it with a 5 px gesture wobble.
3. **Speed and scale.** In SPN hazards cross the box in 0.7–1.0 s and are 7–20 % of its width. Ours cross a far wider box in 1.8–3.6 s and are 3–5 % of its width. NEO is the slowest of all (0.17–0.20 sw/s, versus 0.38–0.51 for SPN heads).
4. **No staged climax shape.**
   - TEN's ending: a 30 s "channel surfing" montage cuts between minigames at accelerating 2.0 → 1.2 s intervals. That is followed by a 22.5 s live confrontation on the main stage, and a 4 s white-out.
   - SPN's BIG SHOT turn: the background and party vanish, the boss becomes a giant face beside the box, and a white flash closes the turn.
   - Ours: the ST finale has good stage *labels* (controlled → recoil → unstable → overload), but density only steps from 2.75 to 2.05 s per wave. NEO's final flips orientation every 13 s and otherwise holds 1.48 s per cast.
5. **Truncated endings.** In 18 of 27 ST turns and 7 of 11 NEO patterns, the last spawn's entry time is after the turn ends (tail −0.05 to −1.92 s), and `bullets=[]` deletes it.
6. **No graze or "near miss" feedback.** Both Deltarune references reward grazing with TP and a SOUL glint. Ours has no graze in either game (HANDOFF defines graze only for Aqua). A cosmetic graze cue is suggested; no resource is added.

What ours does as well as or better than the references:
- **Explicit, honest telegraphs.**
  - Tenna's gates: 2.05–2.22 s with a generator to shoot.
  - Spotlight rows: 1.0 s with a progress bar.
  - The cannon sweep: 1.25–1.4 s with the full swept area tinted and green safe pockets.
  - NEO relays: a 2.65 s fuse ring, and a "SAFE" lane.

  Both references rely mostly on visible approach.
- **The yellow-SOUL economy.** Burst plus charge, generators (5 shots or 1 charge), cash boxes, timed shop breaks and upgrades. This is deeper than SPN's tap-shoot and is the ST fight's identity.
- **Duo co-authorship.** Tenna owns lanes and gates; Spamson owns projectiles. The header names both moves ("TENNA · SMASH CUT / SPAMSON · SPAM MAIL"). This mirrors TEN's "host + game" split and SPN's "salesman + merchandise" split.
- **Finale structure with breathers.** The FINAL_BREAKS shop windows (22–26, 76–81, 134–139.5 s) are a better long-fight rest pattern than either reference's single long turn.

---

## 1. Per-turn tables (references)

Columns:
- **Talk**: the speech bubble or game-show "GAME TIME!" intro.
- **Start**: box formed, or first minigame frame.
- **End**: spin-out start, or the cut back to the stage.
- **Attack**: the length from Start to End.
- **Player turn**: from the previous End to this Talk.

Times are in seconds of the video, with frame numbers.

### 1a. TEN (Tenna, Ch 3; 30 fps)

The structure is a game show. Every enemy turn is introduced on the main stage:
- a "SCORE" board;
- Tenna's line;
- Tenna leaping through the screen;
- either a bullet-box turn on a dimmed stage, or a full-screen *minigame* with its own art and controls.

The score board then adds a bonus. The party's menu returns during the score screen, which is the player turn.

| # | Talk (≈) | Start | End | Attack | Identity | SOUL / control | Box | Player turn (≈) |
|---|---|---|---|---|---|---|---|---|
| 1 | 198–206.5 | 206.93 (f6208) | 213.27 (f6398) | 6.33 | **All-star stars**: the stage dims to spotlight wash; white 5-point stars curve in from both sides and bounce | red, free | 224×224 | ≈21 (opening plus party ACTs) |
| 2 | 219 "GAME TIME" + 220–225 | 227.13 (f6814) | 236.13 (f7084) | **9.00** | **DODGE FIRE** minigame: a kitchen set with two chefs, flames rain down, a 9→0 countdown on the back screen | party sprite runs and jumps | full screen | ≈6 |
| 3 | 243–248 | 250.00 (f7500) | 260.50 (f7815) | 10.50 | **PERFORM**: a 3-column rhythm game, one column per party member | rhythm keys | full | ≈6.5 |
| 4 | 267–273 | 275.60 (f8268) | 287.07 (f8612) | 11.47 | **SHOOT THE TARGETS**: trains of white capsule targets slide in from the right; a red reticle aims | aim + fire | full | ≈5 |
| 5 | 292–296 | 298.60 (f8958) | 307.60 (f9228) | 9.00 | **SHOOT** (western): a 3×3 window façade; targets pop up in windows; fire from horseback | aim | full | ≈3.5 |
| 6 | 311–316 | 317.80 (f9534) | 328.30 (f9849) | 10.50 | PERFORM 2 | rhythm | full | ≈5.7 |
| 7 | 334–336 ("cut!") | 337.60 (f10128) | 346.10 (f10383) | 8.50 | **SMASH CUT**: a white line flashes across the screen, the box is sliced into two offset halves that slide, and zig-zag "cut" marks sweep through | red | 224, split | ≈5 |
| 8a | 351–355 | 357.50 (f10725) | 368.00 (f11040) | 10.50 | **BOUNCE THE BALL**: walls of numbered red and cyan cloud blocks; bounce a ball with an umbrella-SOUL; countdown | SOUL with paddle | box + side walls | — |
| 8b | (none: a "double feature") | 369.30 (f11079) | 378.27 (f11348) | 8.97 | **DODGE** (western): windows outline red, then fire white; the party hops between windows | move between windows | full | ≈7 |
| 9a | 386–388 | 390.43 (f11713) | 400.93 (f12028) | 10.50 | PERFORM 3 | | | — |
| 9b | — | 402.23 (f12067) | 411.23 (f12337) | 9.00 | SHOOT (western) 2 | | | ≈5 |
| 10a | 418–421 | 422.80 (f12684) | 433.20 (f12996) | 10.40 | BOUNCE THE BALL 2 | | | — |
| 10b | — | 435.00 (f13050) | 445.50 (f13365) | 10.50 | PERFORM 4 | | | ≈12.5 |
| 11 | 458–461 | 462.20 (f13866) | 470.57 (f14117) | 8.37 | **RIMSHOT**: a large star bounces off the box walls and releases mini-star bursts; drum-kit staging | red | 224 | ≈6 |
| 12 | 477–479 | 480.73 (f14422) | 487.07 (f14612) | 6.33 | All-star stars 2 | red | 224 | ≈5.5 |
| 13 | 492–495 | 496.73 (f14902) | 505.00 (f15150) | 8.27 | **LIGHTNING**: the box is split and offset; lightning bolts fall in pairs | red | 224, split | ≈5 |
| 14a | 510–513 | 515.43 (f15463) | 524.43 (f15733) | 9.00 | DODGE FIRE 2 | | | — |
| 14b | — | 525.73 (f15772) | 534.70 (f16041) | 8.97 | SHOOT THE TARGETS 2 | | | ≈5 |
| 15a | 540 | 542.53 (f16276) | 551.50 (f16545) | 8.97 | DODGE (western) 2 | | | — |
| 15b | — | 552.80 (f16584) | 561.80 (f16854) | 9.00 | DODGE FIRE 3 | | | ≈15 |
| 16 | 577–578 | 579.20 (f17376) | 587.60 (f17627) | 8.40 | RIMSHOT 2 | red | 224 | ≈3 |
| 17a | 591 | 593.60 (f17808) | 602.57 (f18077) | 8.97 | SHOOT THE TARGETS 3 | | | — |
| 17b | — | 603.87 (f18116) | 612.87 (f18386) | 9.00 | DODGE FIRE 4 | | | ≈4 |
| 18 | 616–621 ("final episode") | 622.90 (f18687) | 627.13 (f18814) | 4.23 | PERFORM 5, **cut off** by static | | | — |
| 19 | — | 627.13 | 657.07 (f19712) | **29.94** | **CHANNEL SURFING**: a white static flash (7 gf) every 0.9–3.0 s jumps between every earlier minigame, with a channel number in the corner. Cut intervals: 1.64, 2.03, 3.03, 1.50, 1.37, 2.03, 1.47, 1.00, 1.30, 1.27, 1.23, 1.20, 1.47, 1.26, 1.10, 2.04, 0.90, 1.23, 1.93 | all modes | all | — |
| 20 | — | 657.30 | ≈679.8 | ≈22.5 | **Live confrontation** on the main stage. Tenna (turning red) leaps around firing red projectile streams and stars; the party shoots back with reticles | aim + dodge | full stage | — |
| — | — | ≈680.0 | ≈684.0 | ≈4.0 | **White-out** | | | |

Summary for TEN:
- Bullet-box turns: 6.3–8.5 s.
- Minigames: 9.0 ± 0.03 s (timed games) or 10.5 s (PERFORM, BOUNCE).
- After turn 7, Tenna chains **two games per turn**, about 1.3 s apart, giving 18–21 s of enemy time.
- The ending stacks 4.2 + 29.9 + 22.5 + 4.0 ≈ 60 s of climax.

### 1b. SPN (Spamton NEO, Ch 2; 30 fps)

| # | Talk | Spin-in | Start | End | Attack | Identity | Box (px) | Player turn |
|---|---|---|---|---|---|---|---|---|
| 1 | 127.57 | 132.23 | 132.60 (f3978) | 140.67 (f4220) | 8.07 | **Flying heads**: cyan heads fly out of his body in trios and cross the wide box | 359×166 | — |
| 2 | 144.23 | 148.03 | 148.40 (f4452) | 158.87 (f4766) | 10.47 | **Rails**: rows of pillar columns roll in on carts with a floor line; heads ride the carts; the box slides left and right with the stage | 374×256, moving | 3.33 |
| 3 | 162.13 | 165.63 | 166.00 (f4980) | 178.37 (f5351) | 12.37 | **Heart on a chain**: his heart extends toward the box on a bead chain and sprays white diamonds; shoot the heart | 224 | 3.03 |
| 4 | 185.13 | 188.17 | 188.57 (f5657) | 207.23 (f6217) | **18.67** | **Pipis + phone**: he talks on a phone during the attack; pipis eggs are lobbed down a floor line from the right, burst into heads, and turn into a bigger pipis pack | 224 + a long floor lane to x≈992 | 6.53 |
| 5 | 210.77 | 212.67 | 213.03 (f6391) | 221.50 (f6645) | 8.47 | **Phone call**: a handset and its bead cord orbit the box; ring glyphs fire inward | 359×166 | 3.30 |
| 6 | 225.77 | 229.80 | 230.17 (f6905) | 239.63 (f7189) | 9.47 | **Face split**: the box doubles; the right half holds half of his giant face, whose nose and mouth fire pellets and dashed lasers | 225 + 264 | 4.03 |
| 7 | 242.93 | 245.30 | 245.67 (f7370) | 256.97 (f7709) | 11.30 | Heart on a chain 2 | 224 | 3.07 |
| 8 | 260.63 | 264.07 | 264.43 (f7933) | 274.30 (f8229) | 9.87 | **Big balls + heads**: large white spheres bounce while head trios fly | 359×166 | 3.43 |
| 9 | 298.80 | 300.93 | 301.30 (f9039) | 310.93 (f9328) | 9.63 | Face split 2 | 225 + 264 | 24.3 (party actions) |
| 10 | 325.60 | 329.93 | 330.30 (f9909) | 338.60 (f10158) | 8.30 | Phone call 2 (the box is briefly squeezed in width) | 359→275 | 14.4 |
| 11 | 348.77 | 351.20 | 351.57 (f10547) | 366.33 (f10990) | 14.77 | Pipis 2 | 224 + lane | 9.9 |
| 12 | 379.00 | 380.70 | 381.07 (f11432) | 391.60 (f11748) | 10.53 | Rails 2 (box squeezed) | 374×256 | 12.4 |
| 13 | 407.47 | 410.00 | 410.37 (f12311) | 420.17 (f12605) | 9.80 | Big balls 2 | 359×166 | 15.6 |
| 14 | 423.70 | 427.03 | 427.40 (f12822) | 440.30 (f13209) | 12.90 | Heart on a chain 3 (denser) | 224 | 3.3 |
| 15 | 465.50 | 467.57 | 467.93 (f14038) | 476.00 (f14280) | 8.07 | **Gag turn**: he holds a phone; the SOUL is shown upside down; the call is "for him". Almost no hazards: a story beat in attack form | 224 | 25.0 |
| 16 | 480.63 | 485.43 | ≈485.9 (f14574) | ≈504.2 (f15127) | **≈18.4** | **BIG SHOT climax**: the background goes black; he becomes a huge face beside the box; dollar-sign cones fire from his mouth; the SOUL is reshaped; a huge ghost head swoops across; a white flash ends it | 282×212, flickers | 4.4 |
| 17 | 511.37 | 512.60 | 513.00 (f15389) | 526.83 (f15805) | 13.87 | Heart on a chain 4, the last before the ending | 224 | 7.2 |

Summary for SPN:
- Normal attacks: 8.1–14.8 s (median 9.8).
- Talk before an attack: 1.2–4.8 s.
- The red-SOUL spin-in is always 11–12 gf (0.37–0.40 s), and the spin-out is always 7 gf (0.23 s).
- The player turn is 3.0–4.4 s when the player just acts, and up to 25 s with party spells.

### 1c. MTT (fan Mettaton NEO v2.0)

| # | Start | End | Attack | Identity | SOUL | Box |
|---|---|---|---|---|---|---|
| 1 | 30.13 (f904) | 41.03 (f1231) | 10.90 | **Spotlight bombs**: Mettaton's chest-core reticle locks; small bombs drop and burst into ring clusters (orange flash at the core) | red | 280×270 |
| 2 | 60.00 (f1800) | 75.07 (f2252) | 15.07 | **Rings**: concentric white, blue and orange rings expand from his core and sweep the wide box (blue = stay still, orange = move) | red | 640×200 |
| 3 | 81.40 (f2442) | 104.93 (f3148) | 23.53 | **Limb cannons**: arm and leg cannons sweep cone beams (orange) and drop blue/orange pillars | red | 280×270 |
| 4 | ≈113.9 | 134.97 (f4049) | ≈21.1 | **Flight**: he takes off on fire wings; arcs of white pellets plus crosshair reticles | red | 640×200 |
| 5 | ≈149.5 | ≈157.4 | ≈8 | **Legs**: huge legs stomp through a fullscreen box | red | ≈900×520 |
| 6 | 167.17 | 181.73 | 14.60 | **Box split**: the box divides into 2–5 panes; limbs shoot through | red | 550×270 |
| 7 | ≈198 | ≈210 | ≈12 | **Disco floor**: colour tiles flash and heels stomp | red | wide |
| 8 | ≈222.1 | ≈233.0 | ≈11 | **Yellow column**: a tall one-SOUL-wide column; rows of bomb clusters scroll down; shoot gaps; a white cross-laser telegraph at the SOUL's row | **yellow, shoots up** | ≈50×full height |
| 9 | 246.70 | 257.70 | 11.00 | Spotlight bombs 2 | red | 280 |
| 10 | ≈269.5 | ≈282 | ≈12.5 | **Arms ring**: a dozen arms holding discs ring the box and fire inward | red | 280 |
| 11 | 298.00 (f8940) | 308.97 (f9269) | 10.97 | **Pink lattice**: the background turns magenta; diamond grids slide in from the sides; zig-zag cross lasers at the SOUL's row and column | yellow | 280 |
| 12 | 316.10 (f9483) | 327.77 (f9833) | 11.67 | **Finale**: denser lattice, the box framed by diamonds | yellow | 280 |

MTT summary:
- Attacks last 8–23.5 s.
- Every turn is announced by a body change: the core lights up, the wings change colour, he takes flight, legs appear, or the background colour changes.

### 1d. Ours: turn schedule (from code)

**ST (`LobbyBattle`)**
- The attack runs `ATTACKS[turn].duration`; `nextWave` starts at 1.5 s.
- Turn 17 has a 2.0 s "transform" intro (STRINGS + SHOOTING).
- Turn 27 has a 2.4 s "charge" intro (the strings rotate vertical).
- The player turn is an untimed menu plus an optional shop.

| Turns | Actor | Pattern | Duration | Box / SOUL |
|---|---|---|---|---|
| 1–4 | Mothlark | melody / harmony / sustain / crescendo | 18 / 20 / 22 / 24 | 560×184, 3 lanes, purple strings |
| 5–8 | Presto | cups / portals / cages / reveal | 19 / 21 / 23 / 25 | 5 lanes |
| 9–12 | Stephex | steps / waltz / cross / danceFinal | 20 / 22 / 24 / 26 | 5 lanes; strings sway ±12 px |
| 13–16 | Boing | spring / domino / **scenery (Falling Punchline)** / chain | 20 / 22 / 24 / 26 | 5 lanes |
| 17–26 | Tenna + Spamson | shootIntro, spots, receivers, cards, addisons, targets, roles, remix, marquee, closing | 24, 25, 26, 27, 26, 28, 28, 30, 30, 32 | 5 lanes, **yellow + purple** (shoot right) |
| 27 | Spamson's cannon | neo | **162.35** (shop breaks at 22–26, 76–81, 134–139.5) | 560×350, 7 vertical strings, shoot up |

**NEO (`NeoBattle`)**

| Phase | Patterns (one per turn, cycling) | Duration | Box |
|---|---|---|---|
| 1 (36 HP) | invoice, pods, sweep, receipts | 11.5 s | 560×168, 3 horizontal lanes, shoot right |
| 2 (60 HP, after the DT injection) | relay, crossfire, wings, mortgage, recoil, gauntlet | 14.5 s | 544×232, 5 vertical lanes, shoot up |
| 3 (final, at ≤12 HP) | rotates wings → relay → sweep → pods → mortgage → crossfire → recoil → gauntlet every 6.5 s; the orientation flips every 13 s | 52 s | 584×390 |

---

## 2. Micro-pacing per attack

### 2a. TEN bullet-box turns (tracked; t from box formed)

| Turn | Entries / volleys | Spawn-to-spawn (mean; min–max) | Sequence shape | Speed | Peak entries/s | Tail |
|---|---|---|---|---|---|---|
| Stars 1 (6.33 s) | 15 / 12 | 0.40; 0.13–0.80 | first entry at 1.0 s; swung 0.4 / 0.33 / 0.8, then a 0.13–0.33 flurry at 3–4.5 s; last at 5.37 | 0.83 bw/s (IQR 0.35–1.19), curving | 6 | **0.96** |
| Stars 2 (6.33 s) | 24 / 17 | 0.28; 0.10–0.60 | denser version; no rest > 0.6 | 0.77 | 9 | 0.86 |
| Smash cut (8.5 s) | 46 / 31 | 0.24; 0.07–0.70 | zig-zag cut groups of 2–3 marks; the box halves re-slide at about 1.3 s intervals (≈) | 0.63 | 10 | 0.33 |
| Rimshot 1 (8.37 s) | 13 / 8 | 0.86; 0.07–2.63 | big-star launches at 0.5 and then about every **2.3–2.6 s**; the mini-star bursts between are the dodge content | 0.56 | 7 | 1.84 |
| Rimshot 2 (8.40 s) | 15 / 9 | 0.75; 0.13–2.44 | same, plus a tail finisher | 0.50 | 7 | 1.90 |
| Lightning (8.27 s) | 20 / 19 | 0.39; 0.07–0.86 | **pairs**: 0.1 s, then 0.7–0.86 s, like a drum "da-dum … da-dum"; the box halves offset | 0.36 (falling) | 5 | 0.20 |

TEN minigames (from 0.2 s sheets, **≈**):
- **Dodge Fire.**
  - Flames rain in singles and doubles about every 0.3–0.6 s.
  - A small warning icon appears on the floor about 0.5 s before some drops.
  - The countdown digit is the rhythm anchor: about 1.0 s per digit, 9 digits.
  - Density rises slightly over the last 3 digits.
- **Western dodge.**
  - The window outlines turn red about 0.4–0.6 s before a white "shot" flash.
  - A new set of red outlines appears every 0.4–0.8 s, usually 2–5 windows at a time.
  - The party must be in an un-outlined window; it moves one window per hop.
- **Shoot the targets.**
  - Trains of 3–5 capsule targets enter from the right every ≈0.6–1.2 s.
  - Shots stream continuously (red tracer dots).
  - The density peaks at 8.4–8.6 s, then a finisher train arrives.

### 2b. SPN (tracked)

| Turn | Volleys | Spawn-to-spawn | Rhythm shape | Speed (bw/s) | Peak (corr.) | Rests | Player shots |
|---|---|---|---|---|---|---|---|
| 1 Heads | 30 | trios 0.07–0.17 s apart, then a rest | **0.85 ± 0.07 s rest between trios** (at 1.30, 2.63, 3.97, 5.40, 6.70 s) | 1.36 (IQR 1.07–1.75) | ≈12 heads/s inside a trio, ≈3.5/s overall | 5 × 0.80–0.97 | 9 (1.1/s), gaps 1.0–2.8 |
| 2 Rails | 14 (columns) + 31 (heads) | columns **1.0 s** metronome × 3, then a **0.2/0.2/0.2 triplet**, then 1.0 × 3 again | "three slow, three fast" | 1.00 | ≈8 | 1.0–1.34 | few (dodge turn) |
| 3 Heart chain | 27 | 0.07–0.54 inside a spray, **1.13–1.43 s rests** | 5 sprays of about 2 s each, then rests (1.97, 3.97, 5.87, 8.07, 10.07 s) | 1.24 | 9 | 5 | **2.43/s**, min 0.10 s |
| 4 Pipis | 9 pipis | 0.6–2.1 s (mean 1.32) | thrown about every 1.3 s; each bursts into heads near the SOUL; heads 1.1 bw/s | pipis roll 0.29; heads ≈1.1 | 2–3 | | 1.0/s |
| 5 Phones | ≈10 | 0.1–0.84, plus one 2.07 s rest | continuous orbit; ring glyph pairs | 1.04 | ≈3 | 0.8, 0.84, 0.83, 2.07 | 2.6/s |
| 6 Face split | 24 | 0.07–1.04 (mean 0.29) | pellet streams with 1 rest; the dashed laser fires every ≈1–1.5 s | 1.12 | 8 | 1 × 1.04 | 0.74/s |
| 7 Heart chain 2 | 40 | 0.07–0.83 (mean 0.26) | denser and nearly continuous; one 0.83 rest | 1.14 | 9 | 1 | **2.83/s** |
| 8 Big balls | 10 balls + 34 head volleys | balls 0.2–2.1; head trios 0.1 apart | balls bounce slowly (0.39) while heads streak (0.85) | 0.39 / 0.85 | ≈7 | 1.13, 1.03, 2.1 | 1.0/s |
| 9 Face split 2 | 28 | 0.07–0.93 (mean 0.28) | 3 rests of 0.86–0.93 s | 1.16 | 9 | 3 | |
| 12 Rails 2 | 16 | columns 0.67 s metronome × 5, a 1.06 s rest, **0.2 × 3**, 0.67 × 5 | faster version of T2 | 1.01 | ≈8 | 1 | |
| 13 Big balls 2 | 9 balls + 43 | balls about every 1.0 s; heads 0.1 s chains | | 0.44 / 0.93 | ≈12 | 0.96, 1.87, 1.03 | 1.5/s |
| 14 Heart chain 3 | 47 | 0.07–1.07 (mean 0.25) | the densest; rests only late (8.03, 9.87) | 1.21 | 13 | 2 | |
| 16 BIG SHOT | 31 | a 4.46 s staged opening, bursts at 0.1–0.4, a 2.9 s mid-break, then **0.5 s metronome** at the end | intro → burst → break → metronome finale | 0.64 | 9 | 4.46, 2.9, 2.0 | |
| 17 Heart chain 4 | 48 | 0.07–1.27 (mean 0.26) | continuous with 2 rests | 1.29 | 16 | 0.93, 1.27 | 2.1/s |

Rhythm shape in SPN:
- **Bursts plus about 0.8–1.4 s rests** in almost every turn. That works out to 4–6 phrases per 8–13 s turn.
- Two-speed turns are common: slow big objects (balls, pipis, rail columns) with fast small ones (heads, diamonds) layered on top.
- The rails turns use an explicit "3 slow + 3 fast" bar.
- The heart-chain turns are the **shooting** turns: the player sustains 2–3 shots/s at 0.10–0.17 s spacing. The other turns are dodge turns (≤1 shot/s, with gaps of 1–5 s).
- The opening rest from box formed to first entry is 0.7–1.6 s.
- Tails are short (0.1–0.5 s). The spin-out begins while hazards are still flying, and they vanish with the box.

### 2c. MTT (≈)

| Turn | Volleys | Spawn-to-spawn | Rests | Notes |
|---|---|---|---|---|
| Bombs 1 / 2 | 34 / 33 | median 0.20 (mean 0.27) | 1.2 at the start, 0.83 mid | bombs about 0.8–1.0 s apart; each bursts into a ring cluster |
| Rings | 37 | median 0.18 | a **3.3 s opening** (charge), then 1.07, 0.87 and a 1.67 tail | ring pulses about every 1.5–2 s |
| Limb cannons | 25 | median 0.23 | **3.7 s and 4.2 s** wind-ups (limb raise → beam) | beams are the telegraph: an outline cone, then a filled colour |
| Flight | 53 | median 0.17 | an **8.9 s take-off cinematic** inside the attack | arcs of pellets in strings of 8–10 |
| Yellow column | ≈ a row every 0.4–0.5 s | | | cross-lasers about every 2 s |
| Pink lattice / finale | 19 / 20 | median 0.40 / 0.20 | 0.83–1.97 | lattice slabs slide in about every 1.5–2.5 s; cross-laser between slabs |

### 2d. Ours

**ST, residents (turns 1–16): per-attack metronomes** (event logs, SOUL still)

| Turn | Interval (CV) | Vols | Peak/s | Speed (bw/s) | Leads | Still-SOUL hits (gap) | Tail |
|---|---|---|---|---|---|---|---|
| 1 Warm-up phrase | **0.86 (0.01)** | 20 | 4 | 0.52 | ghost 0.2–0.44 | 6 (1.5–3.7) | −0.26 |
| 2 Room for two | 1.31 | 15 | 3 | 0.47–0.56 | 0.2–0.8 | 6 | −0.63 |
| 3 The long note | 2.11 | 10 | 2 | wall 0.38 | 0.6 | 4 | +0.90 |
| 4 An actual encore | 2.11 | 11 | 3 | 0.57 | 0.6 | 6 | +0.78 |
| 5 Three-cup soul | 1.86 | 10 | 2 | 0.52 | 0.8 | **2** in 19 s | −0.03 |
| 6 Through the curtain | 2.11 | 10 | 2 | 0.56 | 0.8 | 5 | −0.30 |
| 7 One human, two boxes | 2.51 | 9 | 9 | 0.54 | 1.05 / 1.55 | 7 | −0.13 |
| 8 Nothing up my sleeves | 2.51 | 10 | 10 | 0.56 | 1.05 / 1.55 | 13 | −0.65 |
| 9 Watch your step | 1.41 | 14 | 4 | tiles | 1.0–1.17 | 4 | −0.89 |
| 10 Sideways waltz | 1.16 | 18 | 19 | tiles | 1.0–1.17 | 17 (every 1.16 s exactly) | −0.40 |
| 11 Crossing the floor | 1.46 | 16 | 20 | 0.53 | 1.0–1.17 | 15 | −0.58 |
| 12 Six-step finish | 1.26 | 20 | 20 | 0.53 | 0.8–0.96 | 19 | −0.45 |
| 13 Spring in your step | 1.21 | 16 | 2 | 0.85–0.98 | spring ring 0.7 | 7 | −0.47 |
| 14 Hold your groans | 2.11 | 10 | 9 | 0.57 | 0.9–1.78 (ripple) | 2 | −0.52 |
| 15 **Falling Punchline** | 1.61 | 14 | 3 | anvils fall in 0.25 s | 0.9 / 1.08 / 1.26 (staggered) | 4 | +0.29 |
| 16 One last little thing | 2.01 | 13 | 10 | 0.85–1.12 | 0.7–1.78 | 8 | **−1.43** |

**ST, duo (turns 17–26): two clocks interleaved**

| Turn | Tenna clock | Spamson clock | Combined sequence (first 10) | Peak/s* | Spamson speed (bw/s) | Leads | Hits (gap) | Tail |
|---|---|---|---|---|---|---|---|---|
| 17 Word from our heroes | 2.9 | 2.2 (from 6 s) | 1.1, 1.1, 1.8, 0.4, 2.2, 0.3, 1.9, 1.0, 1.22, 1.7 | 8 | 0.39–0.48 | 1.0 | 14 (0.63–1.85) | −0.12 |
| 18 All-stars | **2.4** | **1.15** | 0.3, 1.16, 0.95, 0.22, 1.17, 1.03, 0.13, 1.17, 1.1, 0.05 | 11 | 0.42–0.46 | 1.0 | 28 (0.63–1.18) | +0.05 |
| 19 Smash cut | 2.9 | 1.8 | 0.3, 1.81, 0.8, 1.02, 1.82, 0.08, 1.72, 1.18, 0.62, 1.8 | 11 | 0.29–0.47 | cut 0.65; gate 2.2 | 24 | −1.00 |
| 20 Rimshot bargains | **4.2** | 1.35 | 0.3, 1.36, 1.37, 1.18, 0.19, 1.36, 1.35, 1.3, 0.05, 1.35 | 14 | 0.18–0.46 | — | 20 | −0.28 |
| 21 Call from the front row | 2.9 | 1.55 | 0.3, 1.56, 1.05, 0.52, 1.57, 0.83, 0.73, 1.55, 0.62, 0.93 | 12 | 0.29 (pipis) | gate 2.22; fuse 1.25 | 17 | −1.02 |
| 22 Heart of the offer | 2.9 | **3.2** | 0.3, 2.61, 0.6, 2.32, 0.88, 2.02, 1.18, 1.72, 1.48, 1.42 | 15 | 0.53 | 1.0 / 2.2 | **31** (0.63–1.13) | **−1.92** |
| 23 Vacuum-packed | 2.9 | 2.1 | 0.3, 2.11, 0.5, 1.62, 1.3, 0.8, 2.1, 2.1, 0.8, 1.3 | 7 | 0.48–0.55 | 0.95 / 1.9 | 20 | −1.62 |
| 24 Channel surfing | 2.6 | 1.65 | 0.3, 1.66, 0.65, 1.02, 1.6, 0.07, 1.65, 0.88, 0.77, 1.65 | 12 | 0.29–0.47 | 0.9 / 2.2 | 31 | +0.48 |
| 25 Double feature | 2.9 | 1.8 | (identical to 19) | 14 | 0.29–0.51 | 2.1 | 29 | +0.13 |
| 26 The next big thing | 2.9 | 2.2 | 0.3, 2.21, 0.4, 1.82, 1.1, 1.1, 1.8, 0.4, 2.2, 0.3 | 15 | 0.29–0.52 | 0.78 / 2.12 | 35 | −0.75 |

\*Peak counts include child projectiles (miniheads, diamonds, starlets).

- "Hits" is the number of times a perfectly still SOUL would be struck. The 0.63 s minimum is the invulnerability window (0.62 s).
- The duo turns have **no section structure.** The two clocks (for example 2.9 and 1.8) beat against each other, so the combined gaps look varied (0.05–2.7 s), but every 5–6 s the same pattern repeats for the whole 24–32 s.
- Turn 25 is byte-identical in timing to turn 19, and turn 26 opens like turn 17.

**ST finale (turn 27, 162.35 s)**

| Stage (live s) | Wave interval | Gate deadline | Crossfire every | Card / spark speed | Sweep (every 5th wave) |
|---|---|---|---|---|---|
| controlled 0–45 | 2.75 | 2.05 | 3.3 | 265 px/s (0.76 box-heights/s; 0.47 bw/s) | lead 1.4 + 1.45 s sweep |
| recoil 45–105 | 2.50 | 1.88 | 2.45 | 315 | same |
| unstable 105–145 | 2.30 | 1.76 | 1.9 | 340–355 | same |
| overload 145–162 | 2.05 | 1.62 | **1.25** | 355–390 | 1.25 + 1.25 s; after 153 s every other wave |

- Overall: 105 volleys; interval mean 1.53 s, min 0.13, max 5.68 (the sweeps).
- Peak: 23 entries/s (a 7-lane card row).
- A still SOUL is hit 94 times without upgrades and 69 times with every upgrade.
- Shop breaks: 4.0, 5.0 and 5.5 s with an empty field. These are the only rests.
- The ramp from 2.75 to 2.05 s is gentle (−25 % over 160 s). By contrast, TEN's channel-surf cuts tighten 2.0 → 1.2 s (−40 %) within 30 s.

**NEO**

| Pattern | Cast interval | Shape | Speed | Peak/s | Still hits (gap) | Tail |
|---|---|---|---|---|---|---|
| P1 invoice | **1.90** metronome | one card row (2 lanes) per cast | 155 px/s = 0.28 bw/s, crossing 3.6 s | 2 | 4 (1.8–3.8) | +0.53 |
| P1 pods | 1.70 + a 0.2 fan | pod, then a 7-pellet fan at 1.7 s | 80 / 125 px/s | 11 | 6 | +0.65 |
| P1 sweep | 2.25 | single cone sweep, 1.05 s warning, 0.95 s live | — | 1 | 3 | +1.75 |
| P1 receipts | 1.9 (relay every 2nd) | | 0.28 | 3 | 4 | +0.45 |
| P2 relay | 1.9 / 0.75 / 1.15 | relay fuse 2.65 s → beams | 130 | 8 | 8 | −0.05 |
| P2 crossfire | 1.9 | two 3-pellet fans aimed ±20 px off the SOUL | 155 | 7 | **0 (camping hole)** | −0.50 |
| P2 wings | 1.9 | a feather row with one gap | 155 = 0.28 bw/s (0.67 box-heights/s) | 5 | 5 | −0.37 |
| P2 mortgage | 1.9 | beam + relay + 2-pellet fan | 135 | 5 | 4 | −0.05 |
| P2 recoil | 1.9 | sweep + a 4-pellet rain at 1.3 s | 145 | 5 | 5 | −0.85 |
| P2 gauntlet | 2.15 | relay + card row (+ sweep every 2nd) | 135 | 10 | 10 | +0.15 |
| P3 final | **1.48** | 8 patterns × 6.5 s; orientation flips at 13 / 26 / 39 s | 185 × 1.22 = 226 px/s (0.39 bw/s) | 11 | 18 in 52 s (gap up to 13.5 s) | −0.67 |

> **Finding:** in phase 2, `crossfire` never hit a still SOUL on the bottom row of the middle lane. Both fans are aimed 20 px above or below the SOUL with a ±0.3 rad spread, and only every 3rd cast adds a relay. That is a camping hole in the HANDOFF sense. The fix: aim the centre pellet *at* the SOUL on one fan, and keep the offset on the other.

### 2e. Side by side

| Measure | TEN | SPN | Ours (ST duo) | Ours (NEO) |
|---|---|---|---|---|
| Phrases per turn | 3–5 (stars, cut, lightning); 2–3 launches (rimshot) | 4–6 (trios, sprays, bars) | 1 (two clocks, repeating every ≈5–6 s) | 1 |
| Rests ≥ 0.8 s | 0–2 per turn | 1–5 per turn, 0.8–1.5 s | incidental, 1.5–2.7 s, when the clocks drift apart | none (fixed 1.9 s) |
| Shortest gap | 0.07–0.13 s | 0.07 s | 0.05 s (two clocks coinciding) | 0.18–0.73 s |
| Required-dodge rhythm | ≈0.3–0.8 s (≈, from entries) | ≈0.25–0.5 s in phrases | still-SOUL hits every 0.63–1.3 s | 1.2–3.8 s |
| Finisher | rimshot tail burst; lightning last pair | rails triplets; BIG SHOT 0.5 s metronome outro | none; last spawns deleted | none |
| Shooting windows | aiming minigames 9–11.5 s | heart-chain turns: sustained 2–3 shots/s; dodge turns ≤ 1/s | generators every 2.4–4.2 s; shootable cards and heads continuous | relays every 1.9–3.8 s |

---

## 3. Telegraph lead times and hazard speeds

| Hazard | Lead before it can hurt | How the lead shows | Speed |
|---|---|---|---|
| SPN heads | 0.3–0.5 s (≈) | fly out of his body on the right and cross open space before the box | 1.07–1.75 bw/s (0.4–0.65 sw/s) |
| SPN rails | 0.7–1.0 s | the column rolls in visibly from the right edge, with the floor line | 1.0 bw/s |
| SPN heart diamonds | 0.2–0.4 s | the heart is visible at the end of its chain; it recoils as it sprays | 1.2–1.3 bw/s |
| SPN pipis | ≈1.5–2 s | lobbed from his hand, then roll along a visible floor lane (0.29 bw/s), then burst | heads after the burst ≈1.1 |
| SPN face-split laser | ≈0.3–0.5 s | a dashed line from the nose to the SOUL row, then a solid line | instant |
| SPN phone rings | ≈0.3 s | the handset faces the box and the ring glyph grows | ≈1.0 |
| SPN BIG SHOT cones | ≈0.5 s | a green outline cone, then dollar signs | ≈0.6 |
| TEN stars | 0.3–0.5 s | spill from the spotlight wash outside the box | 0.77–0.83 bw/s |
| TEN smash cut | **≈0.2 s line + about 1 s of zig-zag drift** | a white full-width line flash, then the box halves slide | 0.63 |
| TEN lightning | ≈0.3–0.5 s | the bolt is visible above or below the box before it crosses | 0.36 |
| TEN western dodge | 0.4–0.6 s | red window outlines, then a white flash | instant |
| TEN dodge fire | ≈0.5 s | a floor warning icon on some drops | falling |
| MTT limb beams | **1–4 s** | the limb raises and an outline cone shows, then the cone fills | sweep |
| MTT rings | 0.3–0.5 s per ring; 3.3 s initial charge | the core flares orange | expanding |
| MTT cross lasers | ≈0.5 s | a thin wavy line, then a thick line | instant |
| **Ours ST**: Tenna spot row / blockRows | 1.0 s (+0.22 with CUES, +0.3 assist) | 15–20 % fill blinking at 13 Hz, progress bar along the edge | — |
| **Ours ST**: gate (generator) | 2.05–2.22 s | all rows marked; "!" on the gated lane; a shootable generator | — |
| **Ours ST**: cut | 0.65 s | strip; the box halves offset by up to 14 px | — |
| **Ours ST**: Spamson bullets | 0–0.45 s ghost at 35 % alpha | static ghost at the box edge | 165–310 px/s = 0.29–0.55 bw/s |
| **Ours ST finale**: gate | 2.05 → 1.62 s | "neo" pink rows + generator | 265–390 px/s |
| **Ours ST finale**: shutter | 1.48 s | upper or lower band + a "STAY LOW / MOVE UP" label | — |
| **Ours ST finale**: crossfire | 1.05 / 0.85 s | a row at the SOUL's y + a "!" box on the edge | — |
| **Ours ST finale**: cannon sweep | 1.4 / 1.25 s + 1.45 / 1.25 s sweep | full swept wedge tinted, a muzzle ring growing, green safe pockets | angular |
| **Ours NEO**: card / feather rows | 0.72–0.82 s ghost (×1.3 READ, ×0.88 hard) | 42 % ghost | 155 px/s = 0.28 bw/s |
| **Ours NEO**: sweep | 1.05 s (BAIT 1.35) | red wedge + "SWEEP" + green safe lane | 0.95 s live |
| **Ours NEO**: relay | 2.65 s fuse, then 0.8 s beam warning | gold ring countdown + "SAFE" lane | beams 0.33 s live |
| **Ours NEO**: laneBeam | 0.95 s | pink 2 px line | 0.42 s live |

Our telegraphs are longer and more explicit than the references'. That fits HANDOFF ("warnings, reachable openings"). The gap is **speed after the telegraph**:
- An SPN head, once visible, crosses its box in 0.7–1.0 s.
- An NEO card crosses ours in 3.6 s.

The reference turns read as "warned, then fast". Ours read as "warned, then slow".

---

## 4. Look and feel

### 4a. Sizes relative to the box

| | Box (share of game width) | SOUL | Typical hazard | Largest hazard |
|---|---|---|---|---|
| SPN | 224 (23 %), 359 (37 %), 374 (39 %) | 22 px = **10 %** of 224 | heads 24–30 px (11–13 % of 224; 7–8 % of 359) | diamonds 37–44 px (≈18 %); big balls ≈55 px (15 % of 359); face half 264 px |
| TEN | 224 (23 %) | 22 px (10 %) | stars ≈18–30 px (8–13 %) | rimshot star ≈40 px |
| MTT | 280 (29 %), 637 (66 %) | ≈20 px (7 %) | diamonds ≈16–22 px | limbs and legs fill the screen |
| Ours ST | 560 (**73 %**) | 15 px = **2.7 %** | heads 26 px incl. outline (4.6 %); cards 18×22 (3.2 %); stars 16 px | mail 38×26; heart 32 px; sweep beam 28–34 px wide |
| Ours NEO | 544–584 (71–76 %) | 15 px (2.7 %) | cards 18×14; feathers 12×18 | relay 30 px; pods 26 px |

Our arena is close to the full width, so even correctly sized hazards look small. The references keep hazards at about the SOUL's size or 2× it; ours are 1.1–1.7× a much smaller SOUL.

### 4b. Reference qualities (described, not copied)

**TEN: a game-show broadcast**
- The default "stage" is bright and saturated: a stage floor, a big scoreboard and a cheering crowd silhouette along the bottom.
- When a bullet-box turn starts, the **lights dim to a spotlight cone**, the crowd darkens, and the box sits in the light. On the turn end the lights pop back up and the scoreboard adds a bonus.
- **The host moves.**
  - He leaps up and out of frame before each game, and lands as a full-screen "zoom in" on his TV face.
  - His TV face displays static or a test pattern during transitions.
  - He stands beside the box during dodging, reacting.
- **Minigames are whole-screen re-skins**: a kitchen, a western street, a rhythm stage, a shooting gallery. Each has a big title that animates on letter by letter and a timer/countdown as a large background digit.
- **Pacing devices**:
  - countdown digits;
  - a score popup per success;
  - **"double features"** (two games back to back);
  - the **static flash channel-change** (7 gf, white noise) used as a hard cut.
- **Climax**: the channel-surf montage gets faster. Then a live, fully animated host fights on the normal stage, his colours shifting to red while projectiles stream across, and the scene ends in a 4 s white-out.

**SPN: a broken salesman and his merchandise**
- The boss hangs from visible **green strings** at the top. Wings, colour pops (pink, yellow) and a flicker cycle; his pose changes per attack.
- The **box is the stage**:
  - it changes shape per attack (wide strip, tall square, a rail lane, a split with his own face inside);
  - it moves (slides with the rails) and squeezes.
- **Every projectile is a product of his body**:
  - heads (his own face, cyan, detached);
  - the heart on a bead chain;
  - the phone handset with its cord;
  - pipis eggs that hatch heads;
  - the giant face-half's nose and mouth.
- Spawn: heads emerge from his torso and travel visibly. Despawn: shot heads pop with a small white burst; others leave the box edge or vanish on the spin-out.
- **Yellow-SOUL feel**:
  - small fast shots (≈28×10 px, ≈720 px/s, about 2–3 bw/s);
  - the SOUL is an arrow-like heart pointing right;
  - tap-firing comes at the player's own rhythm (0.10–0.17 s);
  - a held shot charges a large ring.
  - Hit targets flash, and the heads have a small knock-back.
  - There is no burst limit; the challenge is the hazard rhythm.
- **Graze**: the TP bar on the left climbs during turns, about 2 → 13 % over turn 2. The game rewards near-misses with a glint and sound.
- **Climax**: BIG SHOT. The background and party disappear, he is drawn as a huge face beside a small box, cones of dollar signs come from his mouth, a ghost-white head swoops through, and a full white flash follows. Visual escalation is strongest here even though the hazard rate is lower (0.5 s metronome).

**MTT (fan)**
- White-on-black line art with one or two accent colours per turn (orange core, blue/orange ring rules, magenta finale).
- **Each attack is announced by the body**: the core reticle, raised limbs, wings igniting, flight, legs.
- The two yellow turns use **a tall narrow column** (a "shoot your way up" lane) and a **lattice** framed by diamonds, with **cross-laser telegraphs** drawn as wavy lines.
- The finale turns the whole background magenta and multiplies the diamond frames. It is the clearest "the stage itself changes for the finale" signal of the three references.

### 4c. Ours (captures: `sheets/ours-st-a/b/c.png`, `sheets/ours-neo.png`)

**ST, residents**
- Each resident is a large white sprite centred above the box. Their identity reads well (Mothlark, Presto, Stephex, Boing).
- Telegraphs are white or gold outlines with labels (STEP, EXIT, REST, IN/OUT and numbers, ↓).
- Hazards are white silhouettes: notes with trails, orbs, hammers, anvils and domino slabs.
- **The Falling Punchline**:
  - three full-height drop strips (46 px wide, 8 % of the box) staggered by 0.18 s, on 11 shifted slots;
  - a "↓" marker and a falling anvil sprite at r = 23 px;
  - it is the most physical resident attack, and the strip warning matches the anvil.

**ST, duo**
- Tenna (pink and red, with a TV head) and Spamson (pale blue suit, yellow tie) stand side by side above the box at the same scale as the residents. They wobble ≤ 5 px on their cues.
- Earlier acts sit as greyscale spectators at the sides, and three greyscale mini-Spamsons hold "GO! / WIN / GO!" signs. It is a nice "crowd" layer.
- The box border turns gold in duo turns. The purple strings are numbered 1–5.
- Shootables have a gold square outline; HP numbers float above generators, hearts and billboards.
- Spamson's projectiles use a small grin portrait inside a gold box (heads), "MAIL" boxes, words in boxes, $ cards, a blue pipis ellipse with a fuse bar, and a mini SOUL-heart.
- Tenna's are white stars, spotlight rows (cream), step tiles, flame rows and "window" rows.
- Spawn: a 35 % ghost at the box edge (0–0.45 s), then slide. Despawn: shot items burst into 6 gold pixels (0.45 s); unshot items leave the box or are wiped at turn end.
- **Smash cut** (19, 25) is the strongest stage trick: the canvas halves are re-blitted with an offset of up to 14 px and a white seam. Visually it reads as an edit.
- **Hit**: a 0.2 s red tint over the arena (45 %), red edge glow 0.34 s, ≈2.5 px shake, and the SOUL blinking at 14 Hz for 0.62 s.
- **Shoot**:
  - 13×3 px tracers (charged: 23×8), white-cored;
  - a burst-ammo pip row in the box corner;
  - a charge ring around the SOUL;
  - audio `fire`, `armorHit`, `targetHit`. There is no muzzle flash on the SOUL (`shootFlash` is set but never drawn).
- **Graze**: none.

**ST finale**
- The box grows to 560×350 and the strings rotate vertical in a 2.4 s "charge" intro.
- The duo shrink (×0.74), Spamson's cannon is visible, and Tenna shuffles beside him.
- The heat bar and stage label sit at the top right.
- Cannon sweeps move the whole Spamson sprite to the screen edge with the cannon aimed along the beam. This is the best "origin is the boss" moment in our games.
- Debris particles fly from the beam's wall impacts every 0.13 s, and scorch marks persist as "wreckage" on the box.
- Shop breaks bring the Addisons in from the sides.
- The ending explosion: a 0.7 s cream flash, a smoke cloud, white flags and a soot palette.

**NEO**
- Spamson is drawn large, with the cannon arm. Phase 2 adds greyscale "screen"-composited wings that pulse at 20 Hz. The neon atmosphere sparks drift behind.
- Hazards are white and gold geometric primitives: $ cards, receipts, feathers (diamonds), a blue "?" pod, pink lane beams, the relay box with a fuse ring, and the sweep wedge.
- During sweeps the boss sprite is moved and rotated so that the cannon muzzle sits at the beam pivot.
- The final shows the boss small and translucent (×0.62, 70 % alpha) at alternating screen edges, while the menu buttons are blasted off and tumble.
- Hit and shoot feedback is the same as ST via `NotebookVisual` (red edge flash plus shake).
- The relay break draws a gold ring and a bark ("HE BUILT THAT FOR OUR FEATURE PRESENTATION!").

---

## 5. Turn-by-turn comparison and suggestions

All suggestions keep:
- our mechanics: lanes and strings, yellow + purple, burst/charge, generators, cash boxes, shop and breaks, ACT flags, BRIBE, checkpoints, NEO relays and exposure, phases;
- **every turn's duration**;
- HANDOFF: honest collision silhouettes, reachable openings, no camping holes, Spamson as a polished salesman (no glitch-bracket speech), Spamson wears only the stolen cannon arm in the lobby, and the winged NEO stays distinct;
- our own art style: white silhouettes, gold = shootable, cream/pink/green telegraph colours, our Tenna, Spamson and Addison sprites. No reference sprites are proposed.

The common tool is a **section table per turn**: a list of `{t, what, count}` replacing the `nextTenna` / `nextSpamson` clocks inside `duoPatterns` (and `nextCast` in NEO). It keeps the same hazard families and roughly the same total count, so balance moves little. Re-run `tools/sim/balance.js` and `bot.js` after each change.

### Shared fixes (both games)

- **G1. Clean tails.**
  - Clamp spawns so that `delay + crossing ≤ duration − 0.5` (ST) or `duration − 0.4` (NEO).
  - Use the freed last 0.5–1.2 s for a finisher (see each turn), then hold a ≥ 0.4 s empty box before `message(AFTER…)`.
  - This removes the 18 truncated ST turns and 7 truncated NEO patterns.
- **G2. Phrase + rest grammar.** Inside each turn:
  - intro (1.5–3 s, one actor only);
  - build (two actors, 0.2–0.4 s bursts);
  - **rest** (0.8–1.4 s, nothing new, cash box available);
  - peak (the densest 3–5 s);
  - finisher (a scripted volley);
  - clean tail.

  For a 24–32 s duo turn this means **two cycles** of build → rest → peak. That puts the references' 4–6 phrases per 8–14 s into the same proportion.
- **G3. Visible origin.** Spawn every Spamson projectile **at his sprite** (shoulder, hand or chest; use `duoPos.spamson`, or `boss.x`/`boss.y` in NEO). Animate a 0.25–0.4 s flight to the lane entry point *outside* the box, and keep it harmless until it crosses the edge.
  - Tenna's row hazards should begin as a beam from his antenna tips or TV screen down to the row (a 1 px cream line for 0.12 s, matching the existing muzzle-line trick for cannon rows).
  - The existing `delay` becomes travel time, so the timing contract is unchanged.
- **G4. Scale.**
  - On 5-lane layouts (lane spacing 34 px), draw heads, cards and mail at 1.3× (heads r 11 → 14; cards 18×22 → 22×28) **and** scale `r` to match. Keep a ≥ 6 px gap to the next lane.
  - Draw the SOUL at 18–19 px (hurtbox unchanged at the existing +4 margin, or matched). This brings the SOUL to about 3.3 % and hazards to about 6 % of the box, and to 9–11 % of lane spacing at most.
  - Do not shrink the box (mechanic). Optionally add a 1 px dark outline to gold items so they read over the strings.
- **G5. Speed after the warning.** Keep every ghost/warning lead, and raise travel speed so crossing a 560 box takes 1.4–2.0 s instead of 1.8–3.6 s:
  - ST Spamson items: 165–310 → 230–380 px/s.
  - NEO rows: 155 → 210 px/s (P1) and 230 px/s (P2).
  - Offset with the G2 rests, so the dodges-per-second budget stays close to today's still-SOUL hit rate (ST duo 0.8–1.3 s; NEO 1.2–3.8 s).
  - Assist and practice multipliers still apply.
- **G6. Graze cue (cosmetic only).** When a damaging hitbox passes within 10 px of the SOUL without hitting it, show:
  - a thin white arc on that side of the SOUL (0.12 s);
  - a soft tick sound (rate-limited to 8/s);
  - a crowd `cheer` pulse in ST (`crowdReaction`).

  No TP and no resource change, so nothing in HANDOFF moves.
- **G7. Shot juice.**
  - Draw `shootFlash`: a 3-frame gold muzzle star on the SOUL's front.
  - Add a 2 px knock-back on non-lethal hits (`armorHit`) on the hit item.
  - On a generator break, show a 0.1 s white frame on that lane's strip plus `fx.kick(.12)`.

### ST turns 1–4: Mothlark (melody / harmony / sustain / crescendo) ↔ TEN PERFORM (rhythm game), SPN rails ("3 slow + 3 fast")

What ours does well:
- Notes with trails make "long tails are part of the note" literal.
- The REST gap in the sustain wall is a reachable opening.
- BREATHE and HUM are real modifiers.

Gaps:
- One clock per turn (0.86 / 1.31 / 2.11 / 2.11 s, CV 0.01).
- Notes appear at the box edge.
- No bar structure, although the act is *music*.
- Turns 1–2 end truncated.

Suggestions:
1. **Bars.** Re-time as 4-beat bars on a 0.43 s beat (T1). Use notes on beats 1–2–3, rest on beat 4. Every 4th bar, place a "pickup" pair at 0.21 s spacing. For T2, a bar of call (top lanes) answered by an echo bar (the existing echo note) one bar later.
2. **Sustain walls** (T3/T4): keep the 2.1 s period, but make the walls arrive in **pairs 1.05 s apart, then 3.15 s rest** (the same count). Then the crescendo's "KEY CHANGE" every 3rd wave becomes the phrase end.
3. **Origin.** Notes leave Mothlark's mouth, rise in an arc to the box's right edge (0.3 s, inside the existing 0.2–0.44 s delay), then fly the lane.
4. **Finisher.** The last 1.2 s holds one sustained wall with the REST gap on the lane the SOUL is *not* on. It is warned by the existing 0.6 s and ends the phrase.

### ST turns 5–8: Presto (cups / portals / cages / reveal) ↔ TEN western dodge (outlined windows → shot), MTT box split

What ours does well:
- Labelled IN/OUT portals, the EXIT gap and WATCH-THE-HANDS reveals are clear "trick" grammar.
- The cage traps the SOUL's own column (it reacts to position).

Gaps:
- 1.86–2.51 s metronomes.
- T5 hits a still SOUL only twice in 19 s (cups are too easy to camp).
- T8 hits 13 times, all of them cages.
- No misdirection rhythm, the core of a magic trick.

Suggestions:
1. **Shell-game phrases.** Use 3 cup flashes at 0.35 s (left, middle, right, mirroring the western window "outline then shot"). The rattling cup fires at the end of the phrase, followed by a 1.0 s rest. That gives 4 phrases per 19 s, with orbs from the cups.
2. **Anti-camp for T5.** Every second phrase, place the trap lane on the SOUL's current lane (warned by the existing 0.8–1.05 s cup glow). That keeps reachability and removes the 2-hit camping.
3. **Portals (T6).** Pair the IN/OUT burst with a 0.25 s white curtain-swish sprite at the OUT point (our art). Let the orb exit 0.25 s *after* entering instead of instantly; that gap is the trick's "beat".
4. **Reveal finisher (T8).** In the last 1.5 s, three cages close at once on alternate columns with the EXIT gap staggered left → right, at 0.3 s each.

### ST turns 9–12: Stephex (steps / waltz / cross / danceFinal) ↔ TEN dodge-fire countdown, SPN rails bars

What ours does well:
- Footprint tiles demand both a string change and travel.
- MIRROR and SPACE modify readably.
- Moving strings (the floor dances).

Gaps:
- Still-SOUL hits land at an exact metronome (T10 every 1.16 s, T11 1.46, T12 1.26). That is a predictable cadence with no swing, for a *dance*.
- Peak 19–20 tiles/s comes from tiles appearing all at once.

Suggestions:
1. **Count-in and swing.**
   - Start with a visible "5-6-7-8" count: Stephex's legs tap; 4 white floor ticks at 0.35 s.
   - Then alternate long-short steps (0.9 / 0.5 s, the same mean as 1.4) on T9.
   - Use a waltz 3/4 on T10: steps at 1.15, 0.77, 0.77 s (mean 0.9 ≈ the same count over 22 s once rests are added).
2. **Rest bars.** After every 6 steps (the "six-step" motif), place a 1.2 s bar where the whole floor shows STEP (all safe).
3. **The tile cascade already ripples** (`col*.055`). Widen the ripple to 0.12 s per column so the tiles visibly "walk" across the floor in the step direction. This matches the reference "visible approach".
4. **Finisher (T12).** Six steps at 0.35 s in a zig-zag lane pattern, warned at 0.8 s each, then a clean tail.

### ST turns 13–16: Boing (spring / domino / **The Falling Punchline** / chain) ↔ TEN dodge fire (drops with a floor warning, countdown), SPN big balls (slow big + fast small)

What ours does well:
- **The Falling Punchline** already has the best reference-like grammar in the resident acts:
  - full-height drop strips with ↓;
  - staggered 0.18 s triples;
  - a shifted slot set so no spot is permanently safe;
  - BRACE shrinks strips (honest hitbox change).
- Dominoes ripple 0.22 s per slab.
- Springs bounce with gravity.

Gaps:
- One clock per turn (1.21 / 2.11 / 1.61 / 2.01 s).
- T15 still-SOUL hits vary from 1.8 to 14 s apart (some slots are much safer than others).
- T16 ends with 1.43 s of spawns deleted.
- The anvils appear at the box top instead of falling from the scenery above.

Suggestions:
1. **Falling Punchline as joke structure.**
   - **Setup**: 2 single drops, 1.2 s apart.
   - **Setup**: a triple at the 0.18 s stagger.
   - **Pause**: 1.0 s (Boing glances up).
   - **Punchline**: 5 drops across alternating slots at 0.12 s.
   - **Rimshot**: a 0.6 s rest.

   Repeat 3× in 24 s, with about the same anvil count (42).
2. **Origin.** Anvils hang visibly from a rope at the top edge of the screen above their strip during the strip warning, and the rope snaps at `delay`. Draw them from our existing anvil polygon. The rope sits outside the box, so it costs nothing in collision.
3. **Slot fairness.** Weight the next slot choice by the SOUL's distance to the last 3 drop centres, so camping in one spot meets a drop within ≤ 3 s. That fixes the 14 s gap.
4. **T16 chain finisher.** Clamp per G1. The final 1.2 s is the chain's last link: one domino run whose last slab tips into a single anvil drop. LAUGH removes that link, which matches the existing "lose their final link".

### ST turn 17: "A WORD FROM OUR HEROES" (shootIntro, 24 s) ↔ SPN heads (T1), TEN stars 1

What ours does well:
- The practice target for 6 s, then generators and cash boxes: a gentle shooting tutorial.

Gaps:
- After 6 s it is a 2.9 / 2.2 s two-clock loop for 18 s.
- Heads appear at the box edge.

Suggestions:
1. **Sections.**
   - 0–6 s: practice (keep).
   - 6–12 s: Spamson **head trios**. Three heads launched from his chest 0.15 s apart, travel 0.35 s to the box edge, then fly a lane. A 0.9 s rest between trios. Same total heads.
   - 12–13.2 s: rest; a cash box appears.
   - 13.2–20 s: Tenna spotlight rows on 1.45 s phrases (two rows, then a rest), layered with trios.
   - 20–22.5 s: peak.
   - 22.5–23.5 s: a finisher: Tenna lights all rows except the generator lane (gate), with a 2.05 s lead begun at 21.4 s.
   - Then a clean tail.
2. Spamson leans forward on each trio launch (`spamsonGesture`), so the gesture and the spawn become one event.

### Turn 18: "ALL-STARS! BIG SALES!" (spots: stars + flying heads, 25 s) ↔ TEN stars 1 / 2, SPN heads

What ours does well:
- Stars arc through the strings, and heads fire miniheads at the SOUL, so the shoot-or-dodge choice is real.

Gaps:
- A 2.4 / 1.15 clock pair, with 28 still-SOUL hits at 0.63–1.18 s: relentless with no rests.
- Stars enter in a row at fixed 0.075 s lane stagger every 2.4 s.

Suggestions:
1. **Star swing.** Release stars on a swung 0.33 / 0.53 s pattern, as in TEN stars 1, and have them spill from the spotlight wash. Draw a cream cone from Tenna's screen to the box's right edge during the turn: our existing palette, our own shape.
2. **Rests.** Two 1.0 s rests (at about 9 and about 18 s) where only one cash box drifts. Heads launch in trios as in turn 17.
3. **Finisher.** All five lanes of stars except the cash lane, released 0.1 s apart, at 23.4 s.

### Turn 19: "SMASH CUT! EXPRESS MAIL!" (receivers, 26 s) ↔ TEN smash cut, SPN rails

What ours does well:
- The canvas-split effect, generator gates and destructible mail carts. This is the closest of our turns to its reference in look.

Gaps:
- The cut is a 0.65 s strip warning on all non-gap lanes.
- TEN's cut is a **full-width white line flash (≈0.2 s), then the box halves slide** with marks drifting for about 1 s.
- Our split offset is cosmetic (14 px). Mail arrives on a 1.8 s clock.

Suggestions:
1. **Cut as an edit beat.** On each Tenna cue, flash a 1-frame white horizontal seam across the full canvas (our `cut` effect already draws it), followed by the 0.65 s strip. Fire the strip on the beat of a "clap" sound. Cuts land every 2.9 s; alternate a single cut with a **double cut** (two seams 0.3 s apart, offset in opposite directions).
2. **Mail rails.** Run mail carts as rails bars: 3 carts at 1.0 s, then 3 at 0.25 s, then a 1.2 s rest. That matches the SPN rails' "3 slow + 3 fast", with about the same total mail. Carts enter from behind Spamson's position (G3).
3. **Finisher.** A final double cut whose seams close the gated lane last. The generator must be shot to open it; the existing gate rule gives 2.2 s.

### Turn 20: "RIMSHOT BARGAINS" (cards: rimstars + sales words, 27 s) ↔ TEN rimshot 1 / 2, SPN heart sprays

What ours does well:
- Bouncing rimstars with emitted starlet bursts mirror TEN's rimshot almost exactly in mechanics.
- Sine-moving gold words are a good salesman hazard.

Gaps:
- Rimstars every 4.2 s (TEN: 2.3–2.6 s within an 8.4 s turn).
- Starlets every 1.25 s from each star, CV 0.
- Words on a 1.35 s clock.
- 110 starlets make the turn's peak 14/s, almost all of it starlets.

Suggestions:
1. **Drum fills.** The rimstar launch is a "ba-dum-tss":
   - two drum ticks (white 0.1 s flashes at Tenna's hands);
   - the rimstar launch;
   - starlet bursts at 0.9, 1.6 and 2.0 s after launch (accelerating), then silence until the next launch at 2.6 s.

   That gives 10 launches in 27 s with a 1.2 s rest after every third.
2. **Words in sentences.** Spamson's words come as 3-word phrases ("BUY · BIG · NOW") at 0.4 s spacing, then a 1.2 s pause. Each phrase's last word is the gold one, so shooting is phrased too.

### Turn 21: "A CALL FROM THE FRONT ROW" (addisons: pipis + Addison signs, 26 s) ↔ SPN pipis (T4 / 11), SPN phone (T5 / 10)

What ours does well:
- Timed pipis with a visible fuse bar and minihead release on miss: the exact "hatch" idea.
- Addison sign cues use a friendly crowd as telegraph.

Gaps:
- Pipis appear at the box edge on a 1.55 s clock. In SPN they are **lobbed** and **roll** about 1.5–2 s before they become a threat.
- The phone theme is only in the name.

Suggestions:
1. **Lob.** Spamson tosses each pipis in a 0.45 s arc from his hand to the box's right edge (harmless in the air), then it rolls in its lane. The existing fuse (1.25 s) starts on landing. Use 1.3 s average spacing with ±0.5 s variation, plus doubles.
2. **Phone motif.** Draw a gold handset prop (our own simple shape) beside Spamson. Each pipis volley is preceded by a "ring" glyph pair (0.25 s) at the handset, as the audio cue `cue` already exists.
3. **Finisher.** Three pipis lobbed together onto three lanes, with fuses staggered by 0.3 s. Shooting order matters.

### Turn 22: "THE HEART OF THE OFFER" (targets: heart emitter + window rays, 28 s) ↔ SPN heart on a chain (T3 / 7 / 14 / 17)

What ours does well:
- The gold heart is a shootable emitter (5 HP) firing diamond spreads. It is the same *idea* as SPN's chained heart.
- Window rays with separate generators.

Gaps:
- **31 still-SOUL hits.** The hardest turn by still-hits, and it ends 1.92 s truncated.
- The heart spawns at the box edge and oscillates ±15 px.
- SPN's heart turns are **the shooting turns**, with sustained 2–3 shots/s in 4–5 sprays separated by 1.1–1.5 s rests, and the heart is visibly tethered to the boss.

Suggestions:
1. **Tether.** Draw a dotted gold chain from Spamson's chest to the heart (our art, a bead line). The heart slides in along it over 0.5 s and retracts when broken or when its life ends. This changes the origin, not the hitbox.
2. **Spray phrases.** The heart fires 4 diamond triads at 0.35 s, then pauses 1.2 s while still exposed (the shooting window), then repeats. Total diamonds drop about 20 %, which offsets G5.
3. **Window rays as rests.** Tenna's window rows happen only during the heart's pauses, so the player alternates "dodge diamonds / shoot heart" with "find the window".
4. **Clamp per G1.** Use the last 1.0 s as a "closing offer": the heart's final 6-diamond fan, then a clean tail.

### Turn 23: "VACUUM-PACKED SHOWTIME" (roles: money vacuum + footprints and cuts, 28 s) ↔ MTT limb sweep (body announces the attack), TEN western dodge

What ours does well:
- Physical pull (65 px/s right) that the player can fight.
- A mix of lane change and along-string travel.

Gaps:
- The vacuum pulses 1.3 s on a 2.1 s clock, with no wind-up visual on Spamson.
- Ends 1.62 s truncated.

Suggestions:
1. **Inhale wind-up.** Spamson's jacket puffs and a ring of white "air lines" converges on the box's right edge for 0.5 s before each pull, then the pull runs 1.3 s.
2. **Inhale phrases.** Pulls come at 2.1, 2.1, then 0.9 (a quick double), then a 1.4 s rest.
3. Footprint rows stay on Tenna's 2.9 s clock, but are placed only in the "exhale" gaps.
4. **Finisher.** One long 2.0 s inhale with money flying *out* of the box toward him: shootable for cash, harmless. This makes a comic exit beat.

### Turn 24: "CHANNEL SURFING DELIVERY" (remix, 30 s) ↔ TEN channel surfing (29.9 s, cuts 2.0 → 1.2 s)

What ours does well:
- Tenna cycles DANCE / COOKING / SHOOTING channels (step / flame / window rows), and Spamson's deliveries continue across switches. It is the same idea as the reference finale.

Gaps:
- The channel switches every 2.6 s, in a fixed order, at a fixed rate.
- There is no "static" transition: rows just change kind.

Suggestions:
1. **Static cut.** Each channel change gets a 0.12 s full-box white-noise flash (random 2×2 grey pixels, our own effect). The box border tints per channel (step = white, flame = orange, shooting = cream), and a small channel number appears in the box corner.
2. **Accelerating surf.** Channel lengths go 3.4 → 3.0 → 2.6 → 2.2 → 1.9 → 1.6 → 1.4 → 1.2 s, then a 1.4 s rest. Repeat the ramp once (30 s total).
3. Spamson's deliveries pause 0.4 s across each flash, so it reads as a cut.

### Turn 25: "DOUBLE FEATURE, DOUBLE DEAL" (marquee, 30 s) ↔ TEN "double feature" (two games back to back, 1.3 s apart)

What ours does well:
- Generator gates + stars + pipis + heads.
- The "same size letters" dialogue sets up the marquee theme.

Gaps:
- Timing is identical to turn 19 (the same 2.9 / 1.8 clocks).
- No marquee visual, and no "two features".

Suggestions:
1. **Two features.** Turn 25 runs as two 14 s halves, 1.3 s apart, with a marquee title flash between them:
   - Feature A: Tenna's stars + gates.
   - Feature B: Spamson's pipis + heads + mail.
   - The marquee: our gold border lights chase around the box (40 bulbs, 0.05 s step) and two name plates of **equal size** light up.
   - The last 2.5 s: both features at once (the "double deal"), then a clean tail.
2. This keeps 30 s and makes the turn distinct from 19.

### Turn 26: "THE NEXT BIG THING" (closing, 32 s) ↔ TEN live confrontation, SPN heart chain 4 (the last turn before the ending)

What ours does well:
- Everything returns: gates, Addison signs, hearts, pipis, mail and stars. A proper "closing number".

Gaps:
- Pacing is again two clocks, with 35 still-SOUL hits (the most), ending truncated.
- It opens like turn 17.

Suggestions:
1. **Medley.** Five 5 s quotes of earlier duo turns (stars, cut, rimshot, heart, channel), each ending in a 0.8 s rest. Then a 4 s "both bow" finale: two gates at once, 1.0 s apart, each with its generator. Then a clean tail.
2. **Staging.** Tenna and Spamson trade sides on each quote (a 0.5 s slide along the stage line), so every quote's origin side changes. The audience spectators cheer (`crowdReaction`) on each rest.

### Turn 27: "BEHOLD, THE POWER OF NEO!" (cannon finale, 162.35 s; also the hub's NEO + UPGRADES) ↔ TEN finale (channel surf 30 s → live host 22.5 s → white-out), SPN BIG SHOT (≈18.4 s), MTT magenta finale

What ours does well:
- The cannon sweep (moving the whole Spamson sprite and aiming along a beam with honest safe pockets).
- Persistent wreckage.
- The heat bar and stage labels.
- Timed shop breaks with thrown healing.
- Menu blast.
- The explosion ending with soot and flags.

Gaps:
- **Density ramps only 25 % in 160 s** (2.75 → 2.05 s waves).
- No section ever feels like the "big moment": stages change label and expression, but the field looks the same.
- A still SOUL is hit roughly every 1.7 s for 160 s, which is long and flat.
- The final 17 s (overload) adds sweeps every other wave but no stage change.
- The upgrades path changes only survivability (69 vs 94 still-hits).

Suggestions (same 162.35 s, same breaks):
1. **Section map.**
   - 0–22 s **"demonstration"**: 3.0 s waves, one sweep, crossfire off.
   - 26–76 s **"recoil"**: 2.5 s waves in phrases of 3 waves then a 2.2 s rest. Sweeps alternate edges.
   - 81–134 s **"unstable"**: 2.2 s waves. Add a **channel-cut** every 4th wave: a 0.12 s static flash; strings reposition by one lane; Tenna announces from the side.
   - 139.5–155 s **"overload"**: accelerate 2.0 → 1.4 s. The heat bar flashes red. The box border pulses pink. The background takes a pink-to-red radial wash (our palette; the MTT idea of the whole stage changing colour).
   - 155–160.5 s **"BIG ONE"**: the cannon charges at full screen, with Spamson scaled up to 1.0 at the bottom edge (the sprite already exists). A 1.6 s telegraphed full-box sweep with two green pockets, then a 0.4 s white frame.
   - 160.5–162.35 s: silence, then the existing explosion state.
2. **Phrase the cards.** Card and spark rows enter in groups of 3 rows 0.25 s apart, then a 1.1 s gap, instead of one row per wave plus crossfire on an independent clock. Merge crossfire into the gaps.
3. **Make upgrades felt.**
   - In the NEO + UPGRADES run, LEFT/TRI GUARD blocks already thicken the guard line for 0.25 s (`shieldFlash`). Add a 1-frame white burst and a short spark spray on the blocked item, so a block reads as an event.
   - QUICK CHARGE should get a visible charge ring at the SOUL that fills faster with a "ping".

   This is cosmetic only, so balance is unaffected.
4. **Tenna in the finale.** He is the host. Let him call each stage change with a bark *and* raise a title card (our pixel font in a cream frame at the top: "RECOIL", "UNSTABLE", "OVERLOAD") for 0.6 s. The same device as TEN's animated titles, in our style.

### NEO phase 1 (11.5 s turns): invoice / pods / sweep / receipts ↔ SPN T1 heads, T4 pipis, MTT limb cannon

What ours does well:
- Clear, honest warnings (READ lengthens them, BAIT changes the sweep).
- Gold relays that expose him.
- The sweep moves the actual boss sprite.

Gaps:
- The slowest hazards of any studied fight: 0.28 bw/s, crossing 3.6 s, with one cast every 1.9 s and 2–6 still-hits per turn.
- Invoices appear at the box edge, not from him.
- No rest or finisher structure.

Suggestions:
1. **invoice.** Cards fan out of his free hand (G3) in two quick rows 0.3 s apart. Rest 1.0 s. Repeat 4× (same 12 cards). Speed 210 px/s (crossing 2.7 s).
2. **pods.** Lob each pod in an arc from his hand to a lane end (0.4 s) and roll it at 80 px/s; it pops at the existing 1.7 s. Space the pods 1.3 / 1.3 / 2.0 s. The finisher is 2 pods popping together on adjacent lanes with a gap lane between.
3. **sweep.** Keep 2.25 s sweeps. Add MTT-style limb wind-up: the cannon arm rises for 0.3 s with a widening outline before the existing 1.05 s wedge. Alternate the left/right origins so the boss visibly walks between them (`boss.x` already eases).
4. **receipts.** Receipts print out of a slot in his chest as a 0.4 s ribbon, then fly. The relay every second cast stays.

### NEO phase 2 (14.5 s turns): relay / crossfire / wings / mortgage / recoil / gauntlet ↔ SPN rails (bars), heart chain (sprays + rests), face split (a laser from the face), BIG SHOT (climax staging); MTT cross lasers

What ours does well:
- Relays with SAFE lanes and exposure tie dodging to the FIGHT economy.
- The wings visibly pulse.
- CUT WIRES disables wing crossfire.

Gaps:
- Every pattern is a 1.9 s clock.
- **crossfire has a camping hole** (0 still-hits).
- The wings pulse at 20 Hz, but feathers come from the box edge.
- The speed is again 0.24–0.28 bw/s.

Suggestions:
1. **crossfire.** Aim one 3-pellet fan's centre at the SOUL and offset the other by ±20 px (alternate which fan is centred). The pellets emerge from the wing tips (left fan from the left wing, right from the right).
2. **wings.** Feathers peel off the wing sprite: a white flick from the wing silhouette (0.25 s), then they fly the lane. Phrase them as 3 rows at 0.5 s, then a 1.4 s rest while the wings flare. Speed 230 px/s.
3. **relay.** Rail-style bars: relays at 1.0 s × 3, then a 0.3 s triple on the far lanes, then a 1.2 s rest. Keep the 2.65 s fuse.
4. **mortgage.** Lane beams originate from his eye (a 1 px pink line from his face to the lane top for 0.12 s, then the existing 0.95 s warning). This is our version of the face-laser.
5. **recoil.** Each sweep kicks his whole sprite back 12 px with a 2-frame white rim (`fx.kick` already exists). The 4-pellet rain falls from the cannon smoke above the box.
6. **gauntlet.** As the phase's "last offer", the box narrows by 15 % for the turn (the strings move inward and the hitboxes stay honest). The relay and card-row cadence speeds from 2.15 → 1.6 s across the turn.

### NEO final (52 s; orientation flips at 13 / 26 / 39 s) ↔ SPN BIG SHOT, TEN channel surf, MTT magenta finale

What ours does well:
- Menu buttons blasted off and tumbling.
- The orientation swap as a stage event with barks ("UP, KID! KEEP LOOKING UP!").
- The final relay rotation reuses every learned pattern.

Gaps:
- A fixed 1.48 s cast cadence for 52 s.
- The boss is shown small and translucent at the edges for most of the final, the opposite of BIG SHOT's huge presence.
- The ending is a 1-frame state change to `finishPrompt`.

Suggestions:
1. **Four acts of 13 s** (they already exist via the flips):
   - Act 1: 1.6 s casts.
   - Act 2: 1.4 s.
   - Act 3: 1.25 s, plus a 0.8 s rest after every 3rd cast.
   - Act 4: 1.6 → 1.0 s accelerando.
2. **Presence.** In acts 3–4, draw Spamson at full scale behind the box (40 % alpha). The wings span the screen, the cannon muzzle enters from the side where the cast originates, and the neon sparks double.
3. **Final 3 s.** All casts stop. His heartbeat glow (the existing DT pink) pulses 3× at 0.8 s, then a 0.3 s white frame, then `finishPrompt` ("I… CAN'T…"). This gives the climax a breath before Muffet's interception.

---

## 6. Files

- Report: `st-study/st-study.md` (this file).
- Scripts (all read the videos only through ffmpeg pipes, `python3 -I`):
  - `scripts/feat.py`, `hz.py`, `mtt-pass.py`: per-frame features;
  - `drturns.py`, `drseg.py`: turn edges;
  - `cross.py`, `drpace.py`, `shots.py`: pacing;
  - `sheet.py`: contact sheets;
  - `ours-sim.js`, `ours-an.py`: our event logs;
  - `ours-cap.js`: our canvas captures;
  - `extract.js`: module source extraction for reading.
- Data kept (small): `data/*-turns.json`, `neo-cross.json`, `neo-pipis-cross.json`, `ten-cross.json`, `neo-shots.json`, `ours-st.json`, `ours-neo.json`, `ours-summary.json`, `neo-runs.txt`.
- Sheets:
  - `sheets/s1-*.png`: 1 fps overviews;
  - `neo-t*.png`, `ten-*.png`, `mtt-*.png`: 0.2 s detail;
  - `ours-st-*.png`, `ours-neo.png`: ours.
- Raw per-frame dumps (`*.jsonl`, `*-th.npy`) and the scratch scipy install were deleted after analysis.
