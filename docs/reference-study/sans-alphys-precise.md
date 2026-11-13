# Frame-accurate timing study: Sans (Genocide) and fan-made Alphys

This report refines `sans-alphys-report.md`, which was based on 5-second storyboards. Here every turn boundary, telegraph and speed is measured from decoded video frames.

## Method and accuracy

- **Video A:** `dl/files/sans.mp4`, 962x720, constant 24 fps, 21315 frames. Undertale runs at 30 fps, so each video frame covers about 1.25 game frames. A count of "N frames" in A therefore means N/24 s, and every boundary is uncertain by ±1 frame (±42 ms).
- **Video B:** `dl/files/alphys.mp4`, 1280x720, constant 30 fps, 19843 frames. The game area is the central 960x720 (x offset 160). Frames are ±33 ms.
- Both videos draw the game at **1.5 video px per game px**. Sizes are given in video px, with game px (÷1.5) where useful.
- **Automatic pass.** Every frame of both videos was decoded at half resolution. Per frame I recorded:
  - the bullet-box geometry (long white horizontal and vertical runs);
  - the colour and centroid of the red or blue SOUL;
  - orange and yellow pixels on the menu buttons;
  - HP-bar yellow and red widths;
  - fully black frames;
  - a speech-bubble detector (rows of solid white 160–460 px wide in the upper screen).
- **Extra scans.** One extra pass found dim-red warning graphics (red outline, R 60–190, G and B < 70). Another tracked the x position of yellow and cyan beams.
- **Manual checks.** Every boundary used below was checked on full-rate contact sheets.
- **Uncertainty markers:** (≈) means approximate, ±n f gives the frame tolerance, and **[inferred]** marks an interpretation that is not directly visible.
- **Definitions used in the tables:**
  - "Player turn" (P) is the time the large text box is on screen: menu, FIGHT bar and MISS or SHOCKED.
  - "Enemy turn" (E) runs from when the box starts to shrink until it starts to grow back.
  - Within E, "dialogue" is the time the speech bubble is up. The attack runs from bubble-off to box-regrow. That figure includes the box resize animation: about 0.17 s in A and about 0.8 s in B.

---

## VIDEO A: Sans, Genocide

### A0. Overall timeline

| Segment | Time (s) | Frames | Notes |
|---|---|---|---|
| Encounter flash/black | 1.92–3.04 | 46–72 | Battle UI from 3.04 s |
| Intro dialogue | 3.96–12.75 | 95–306 | Bubble on screen 8.8 s |
| Hard cut to black | 12.79–12.88 | 307–308 | **2 black frames** (≈0.08 s) before the opening attack |
| **Opening attack** | 12.88–≈20.5 | 309–≈491 | 7.6 s; details in A2 |
| Post-attack quip, box idle | 20.5–21.96 | | Short bubble 21.1–21.7 s |
| Phase 1 (12 attacks + spare speech) | 22.21–208.71 | | Every player action was FIGHT, so a bubble appears on every turn |
| False mercy | 208.71–220.00 | | See A3 |
| Phase 2 (attacks #14–#22, plus 4 no-dialogue turns) | 220.00–435.29 | | |
| Turn #23 dialogue, then final attack | 435.29–492.38 | | Final attack 441.00–492.38 = **51.4 s** |
| "Special attack" monologue | 492.42–600.96 | | Talking bursts: 492.4–499.6, 509.6–531.6, 541.6–547.2, 557.2–577.6, 587.6–601.0 |
| Idle stall (player pushes the SOUL, Sans snaps it back) | ≈601–816.3 | | See A6 |
| Box drag to FIGHT | 816.29–≈832 | 19591–≈19970 | |
| Kill and death dialogue | ≈832–870 | | |

Time budget for 12.88–492.4 s (479.5 s of combat):
- Bullets on screen (attack windows): ≈266 s (55 %).
- Sans dialogue inside the box: ≈101 s (21 %).
- Player turns and box transitions: the remaining ≈24 %.

### A1. Per-turn table

Abbreviations: P = player turn; dlg = dialogue bubble. Box sizes are video px (game px = ÷1.5):
- **Wide:** 572x212 (≈381x141 game).
- **Square:** 250x250 (≈166).
- **Tall:** 662x242 (≈441x161).
- **Large:** 616x312 (≈410x208).
- **Flicker-wide:** 616x174, alternating with 464x174.

The SOUL mode is the dominant colour in the attack window.

**Phase 1** (all blue SOUL except the opening)

| # | P before (s) | Enemy turn (s) | dlg (s) | Attack window (s) | Attack (wiki name) | Box |
|---|---|---|---|---|---|---|
| 0 | – | 12.88–21.96 | – | 12.88–≈20.5 (7.6) | **Opening "strongest attack"**, 3 segments (A2) | Square |
| 1 | 3.67 | 25.88–35.46 | 2.70 | 28.58–35.46 (6.88) | Bone lines | Wide |
| 2 | 3.17 | 38.62–49.96 | 4.88 | 43.50–49.96 (6.46) | Blue bones | Wide |
| 3 | 3.50 | 53.46–62.62 | 2.04 | 55.50–62.62 (7.12) | Randomized bone lines | Wide |
| 4 | 3.38 | 66.00–77.12 | 2.58 | 68.58–77.12 (8.54) | Platforms 1 | Wide |
| 5 | 3.62 | 80.75–92.33 | 1.71 | 82.46–92.33 (9.87) | Platforms 2 | Wide |
| 6 | 3.38 | 95.71–107.29 | 3.41 | 99.12–107.29 (8.17) | Platforms 3 | Wide |
| 7 | 4.17 | 111.46–121.29 | 2.33 | 113.79–121.29 (7.50) | Platforms 4 | **Tall** |
| 8 | 3.88 | 125.17–136.67 | 3.04 | 128.21–136.67 (8.46) | Platforms with Gaster Blasters | Wide |
| 9 | 3.88 | 140.54–153.12 | 5.08 | 145.62–153.12 (7.50) | Platforms 4 (harder) | Tall |
| 10 | 3.67 | 156.79–166.04 | 2.75 | 159.54–166.04 (6.50) | Bone lines (harder, faster) | Wide |
| 11 | 3.58 | 169.62–180.67 | 3.17 | 172.79–180.67 (7.88) | Horizontal bone slides | Wide |
| 12 | 3.50 | 184.17–195.21 | 3.91 | 188.08–195.21 (7.13) | Randomized bone lines (harder) | Wide |
| 13 | 3.42 | 198.62–208.71 | 10.08 | **none** | Spare speech ("...friend?") | Wide, empty |

- Phase-1 player turns (FIGHT, then target bar, then MISS) are very consistent at **3.2–4.2 s** (mean 3.6).
- Phase-1 attacks run **6.5–9.9 s** (mean 7.7). Dialogue runs 1.7–5.1 s.
- A full phase-1 cycle is **13.7–15.6 s**.

**Phase 2.** Red and blue SOUL mix. Turns without dialogue follow a non-FIGHT player action. ITEM use is visible on every one of them (Dog Salad, Face Steak, Legendary Hero) except the turn at 339.8 s, where the action is **[inferred]**.

| # | P before (s) | Enemy turn (s) | dlg (s) | Attack window (s) | Attack | SOUL | Box |
|---|---|---|---|---|---|---|---|
| 14 | 4.83 (FIGHT) | 220.00–234.42 | 4.79 | 224.79–234.42 (9.63) | **Flicker medley**: bone rows, bone lines and blue bones in a shifting box. 6 cuts | Blue | Flicker-wide; Sans and box move with each cut |
| 15 | 4.88 | 239.29–257.29 | 9.88 | 249.17–257.29 (8.12) | Gaster Blaster barrage (single blasters, diagonal beams) | Red | Large |
| (item) | 5.21 (Dog Salad) | 262.50–272.08 | – | 262.50–272.08 (9.58) | Flicker medley: square + 2 side blasters, platforms over a bone sea, bone lines. 6 cuts | Red/blue | Mixed |
| 16 | 4.83 | 276.92–291.50 | 4.79 | 281.71–291.50 (9.79) | Telekinetic slams, 9 slams ≈1.0 s apart | Red→blue | Square |
| 17 | 4.50 | 296.00–308.21 | 4.38 | 300.38–308.21 (7.83) | Slams, 9 slams ≈0.83 s apart | Blue | Square |
| 18 | 4.38 | 312.58–328.12 | 7.42 | 320.00–328.12 (8.12) | Blaster barrage | Red | Large |
| 19 | 4.12 | 332.25–339.83 | 1.17 ("...TODAY") | 333.42–339.83 (6.41) | Screen-crossing long bones | Red | Square |
| (item) | 5.12 | 344.96–354.17 | – | 344.96–354.17 (9.21) | Flicker medley (blasters, then bone lines). 7 short cuts | Red→blue | Flicker-wide |
| 20 | 4.33 | 358.50–367.79 | 3.12 | 361.62–367.79 (6.17) | Slams ≈0.65 s apart, then a horizontal bone wall | Red→blue | Square |
| 21 | 3.42 | 371.21–384.58 | 3.25 | 374.46–384.58 (10.12) | Flicker medley: bone sea, sine-wave bone arc (red SOUL), bone lines, blue bones. 7 short cuts | Mixed | Mixed |
| (item) | 2.12 (Face Steak) | 386.71–393.17 | – | 386.71–393.17 (6.46) | Slams ≈0.64 s apart | Blue | Square |
| (item) | 1.58 (L. Hero) | 394.75–403.33 | – | 394.75–403.33 (8.58) | Blaster barrage | Red | Large |
| (item) | 1.29 (L. Hero) | 404.62–411.08 | – | 404.62–411.08 (6.46) | Slams ≈0.64 s apart | Blue | Square |
| 22 | 3.50 | 414.58–431.54 | 8.84 | 423.42–431.54 (8.12) | Blaster barrage | Red | Large |
| 23 | 3.75 | 435.29–492.38 | 5.71 | **441.00–492.38 (51.4)** | Final attack (A4) | Mixed | Square / full-width |

- Phase-2 FIGHT turns take 3.4–4.9 s.
- ITEM turns can be as short as **1.3 s**. A practised player picks an item and the box shrinks again almost immediately.
- Phase-2 attacks run 6.2–10.1 s (mean 8.2).
- Phase-2 dialogue runs longer, up to 9.9 s, because Sans gets his story lines here.

### A2. Opening attack, segment by segment

| Time (s) | Frame | Event |
|---|---|---|
| 12.75 | 306 | Last bubble frame |
| 12.79–12.88 | 307–308 | 2 black frames (hard cut) |
| 12.88 | 309 | Square box appears, red SOUL centred. Sans's eye alternates cyan/yellow on alternate frames from 310 |
| 13.17 | 316 | SOUL turns **blue** and falls. It lands at frame 318, **2 frames** later (≈0.08 s) |
| 13.29–13.46 | 319–323 | Screen shake on impact, ≈5 frames, box offset by a few px |
| 13.58 | 326 | **Red warning rectangle** over the bottom 1/3 of the box |
| 13.83 | 332 | Floor bones start rising. They are full height by 334. **Warning lead = 6 frames (0.25 s)** |
| 14.38 | 345 | SOUL back to **red**; Sans points (348) |
| 14.71 | 353 | Bone wave enters from the left. Top and bottom bones leave a sloping gap that scrolls across. The box is clear again by ≈16.4 s |
| 15.75 | 378 | 4 blasters fly in, at rest by ≈384 |
| 16.50 | 396 | **Volley 1** (4 beams covering the box sides): solid 396–405 (10 f), fading 406–414. **Appear→fire = 18 frames (0.75 s)** |
| 16.54 | 397 | Volley-2 blasters appear while volley 1 is firing |
| 17.33 | 416 | **Volley 2** ("X", corner blasters): solid 416–425 (10 f), fade to ≈433. Appear→fire 19 f (0.79 s) |
| 18.17 | 436 | **Volley 3** (repeat of volley 1). Fire interval 20 f (0.83 s) |
| ≈18.6 | ≈446 | Two large blasters arrive left and right |
| 19.12 | 459 | **Volley 4** (huge horizontal beam): solid 460–481 (**22 f, 0.92 s**), fade 482–490 |
| ≈20.46 | ≈491 | Last trace gone |

- Fire times: 396, 416, 436 and 459. That is a **0.83 s cadence**, with ≈0.96 s before the final big beam.

### A3. False mercy and the phase-2 transition

| Time (s) | Event |
|---|---|
| 198.62–208.71 | Enemy turn with **only dialogue** (10.1 s), no bullets |
| 208.71–214.54 | Player turn, 5.8 s. "Sans is sparing you." The player uses ITEM (Dog Salad, HP maxed). MERCY is not taken |
| 214.54–215.17 | **Empty enemy turn**: the box shrinks and regrows in 0.63 s and nothing is fired |
| 215.17–220.00 | Player turn: "Sans is sparing you." again, then FIGHT, then MISS (218.9–219.4) |
| 220.00–224.79 | Dialogue ("...the hard way, huh?") |
| 224.79 | **First flicker cut** |

**Flicker cuts (phase-2 "screen flicker").** The whole screen, including the UI, goes fully black (mean brightness < 3/255). Sans, the box and the pattern reappear in a new state.

| Group | Cuts at (s) | Length per cut |
|---|---|---|
| Turn #14 medley | 224.79, 226.75, 229.04, 230.38, 232.46, 233.96 | **10, 10, 10, 9, 9, 11 frames (0.38–0.46 s)** |
| Item medley at 262.5 s | 262.50, 264.08, 266.00, 268.25, 270.08, 271.67 | 11, 10, 9, 9, 10, 10 frames |
| Item medley at 345 s | 344.96, 346.29, 347.29, 349.13, 350.13, 352.13, 354.08 | **2–3 frames (0.08–0.13 s)** |
| Turn #21 medley | 374.46, 375.46, 377.29, 379.33, 381.17, 383.25, 384.50 | 2–3 frames |
| Final attack | 458.08 (10 f), then 459.38 (3), 460.33 (2), 461.33 (1) | |

- Each sub-pattern between cuts lasts **0.9–1.9 s**. The first two medleys used long blackouts; the later two used short ones.
- The box size changes across each cut (616 → 464 px wide and back). Sans's sprite also jumps position.
- In the first medley the last cut (233.96) goes straight into the player's menu. The black hides the turn change.

### A4. Final attack sub-segments (turn #23)

| Time (s) | Frames | Duration | Segment |
|---|---|---|---|
| 435.29–441.00 | 10447–10583 | 5.71 s | Dialogue ("survive THIS...") |
| 441.00–446.46 | 10584–10714 | 5.46 s | Square box: slams (warning lead 8–10 f) plus screen-crossing long bones. Blue, then red, then blue |
| 446.46–447.04 | 10715–10729 | **0.58 s (14 f)** | Box stretches to **full screen width** |
| 447.04–455.96 | | 8.9 s | **Bone corridor**: blue SOUL in a long low corridor with bones above and below. Sans walks across. HP dips only lightly |
| 455.96–456.38 | | 0.42 s | Box shrinks back |
| 456.4–458.08 | | 1.7 s | Short bone pattern in a 616-px box |
| 458.08–458.50 | 10994–11003 | 10 f | Flicker cut |
| 458.50–462.08 | | 3.6 s | Square box, **crosshair slam warnings**: 4 slams with **14–16 f (0.58–0.67 s)** lead, separated by 3/2/1-frame black cuts |
| 462.08–471.42 | 11090–11314 | **9.3 s** | **Gaster Blaster spiral**: blasters stream in around the box (≈30+ on screen at peak, estimated by eye). Beams fire in clusters about every 0.8–1.0 s (24 beam onsets detected in 7.7 s). Red SOUL. HP 28 → ≈2 |
| 471.42–492.38 | 11314–11817 | **21.0 s** | Repeated wall slams with constant screen shake (box jitter ±7 half-px each frame). HP reaches 1 at **473.96** and stays there |
| 492.42 | 11818 | | "huff... puff..." bubble; the special-attack monologue begins |

- Measured length: **51.4 s** from bubble-off to the end of the slams. The wiki says "roughly 40 s". The difference is the long slam tail.

### A5. Telegraphs (lead time from warning to live hazard)

**Telekinetic slams.** The warning is a dim red outline rectangle covering the zone that bones will fill. Lead = first warning frame to first bone frame.

| Turn | Leads, frames (at 24 fps) | Slam period |
|---|---|---|
| Opening | 6 (0.25 s) | – |
| #16 (282–291 s) | 10, 7, 9, 7, 8, 9, 9, 8, 9 | ≈25 f (1.04 s) |
| #17 (300–308 s) | 6, 6, 8, 4, 7, 7, 6, 7, 7 | ≈20 f (0.83 s) |
| #20 (362–367 s) | 10, 10, 8, 9, 10, 9, 10, 9, 8 | ≈15.6 f (0.65 s) |
| Item turn (387–393 s) | 9, 11, 9, 8, 10, 11, 9, 10, 8 | ≈15.3 f (0.64 s) |
| Item turn (405–411 s) | 8, 8, 9, 8, 9, 9, 8, 8, 8 | ≈15.3 f (0.64 s) |
| Final, square part | 10, 8, 9, 8 | – |
| Final, crosshair part | 14, 16, 16, 16 | ≈23 f (0.96 s) |

- **Typical slam lead: 8–9 frames = 0.33–0.38 s** (≈10–11 game frames). The fastest is 4 f (0.17 s).
- The warning shape stays on until 1–2 frames before the bones appear.
- The slam period tightens over the fight: 1.04 → 0.83 → 0.65 s.

**Gaster Blasters.** Lead is from the blaster sprite appearing to the first beam frame.

| Context | Samples (frames) | Seconds |
|---|---|---|
| Opening volleys | 18, 19, ≈20 | 0.75–0.83 |
| Phase-2 barrage (249 s) | 14, 20, 18 | 0.58–0.83 |
| Phase-2 barrage (320 s) | ≈26 (first blaster after dialogue), 23, ≈9 | 0.38–1.08 |

- Phase-2 barrage blasters fly in rotating, settle, then fire. **Typical lead is 0.6–0.8 s**; the first blaster of a turn waits longer.
- Fire cadence in barrages is one beam every **12–17 frames (0.5–0.7 s)**:
  - turn #15: 12, 14, 11 f;
  - turn #18: 14, 15, 19, 15 f;
  - item turn: 15, 18, 14, 15 f;
  - turn #22: 14, 17, 15, 19 f.
- Beam life:
  - Barrage beam: **solid ≈5 f (0.21 s)**, then a grey fade ≈5–6 f (0.2–0.25 s). Total ≈0.45 s.
  - Opening volley beams: solid 10–13 f (0.42–0.54 s) + fade ≈8 f.
  - Big final opening beam: solid 22 f (0.92 s) + fade 9 f.

**Other cues**
- **Blue bones:** the colour itself is the telegraph; there is no lead time.
- **Platforms and bone lines:** the hazards are visible as they enter at the box edge. Bone lines moving at 0.59 box widths/s therefore give about 0.85 s from edge to centre.

### A6. Speeds, density, jump windows

**Bone lines (turn 1)**
- Speed: **14 px/frame = 336 px/s ≈ 0.59 box widths/s** (224 game px/s).
- Lines enter from both sides. In each direction they are spaced 184 px (0.32 box widths), so lines arrive **every 0.55 s per direction**.
- Up to 6–7 lines are visible at once.
- Gap geometry (box interior is 199 px tall):
  - Top bones reach down to 53 px above the floor.
  - Bottom bones are 31 px tall.
  - The slot is **22 px tall (≈15 game px), centred 31–53 px above the floor**.
- Randomized lines (turn 12): slots ≈29 px tall at varying heights, 91–120 px above the floor in the sampled frame.

**Hard bone lines (turn 10):** **≈16 px/frame = 384–400 px/s ≈ 0.68 box widths/s**, spacing 204 px.

**Menu bones (phase-2 player turns)**
- Small vertical bones travel **right to left** along the button row and through the text box.
- Speed: **≈8.7 px/frame = 209 px/s** (0.22 screen widths/s, 139 game px/s). They take ≈4.6 s to cross the screen.
- They come in pairs about 100 px apart. Usually 2–4 are on screen.
- They are present for the whole player turn, from the first menu frame until the box shrinks.

**Screen-crossing long bones (turn #19):** long horizontal bones (≈300 px) sweep vertically at about 18–22 px/frame, ≈480 px/s (≈1.9 box heights/s) (≈).

**Blue-SOUL jumps (SOUL centre height, floor = 0)**
- Turn 1: **8 jumps** (the wiki says 8). Each has **11–15 frames of airtime (0.46–0.63 s)** and an apex of 27–34 px (18–23 game px), so the player hops just into the 22-px slot. Jump starts are 0.63–0.75 s apart.
- Turn 10 (hard): 8 jumps, 12–14 f airtime, starts **0.58–0.63 s** apart.
- Blue bones (turn 2): 5 jumps, 11–17 f.
- Turn 11 (bone slides): 2 full jumps of **29–30 f (1.2 s)**, apex ≈100 px. This is close to the maximum jump height, about half the wide box's height.
- Practical windows:
  - a tap jump stays airborne about 0.5 s;
  - a full-hold jump about 1.2 s;
  - a slam hits the floor within 2 frames of the SOUL turning blue.

**Peak simultaneous hazards**
- Bone-line turns: 6–7 lines.
- Opening volleys: 4 blasters plus 4 more arriving.
- Blaster spiral: ≈30+ blasters on screen (estimated from frames), with several beams at once.
- Barrage turns: 1–2 beams at a time.

**Special-attack stall (A0)**
- From 617 to 753 s the player repeatedly pushes the SOUL left. It reaches the wall about every **11 frames (0.46 s)** and is snapped back to centre right away. 130+ snap-backs were counted.
- Pushing stops at ≈771 s.
- Sans is left alone for about 45 s before the box starts moving (816.29 s).
- The drag goes left until ≈822 s, then down. The box moves at ≈19 video px/s (≈13 game px/s) and reaches FIGHT at about 831.7 s. The drag takes ≈15 s.

---

## VIDEO B: Fan-made Alphys fight

### B0. Overall timeline

| Segment | Time (s) | Notes |
|---|---|---|
| Load screen, Core, corridor monologue | 0–127.0 | Pre-battle text boxes |
| Black transition | 127.00–129.10 | 2.1 s |
| Battle UI appears | 129.10–130.00 | |
| **The player acts first** | 130.00 | "Alphys initiates the battle." |
| 12 enemy turns plus the finale turn | 141.17–545.0 | 415.9 s of battle (129.1–545.0) |
| Finale attack | ≈536.2–545.0 | ≈8.8 s, white-blob absorption |
| White narration | 545.0–609.5 | 64.5 s |
| Fade to black, then credits | 609.5–611.5, then credits | |

Time budget (129.1–545.0 s, 415.9 s):
- Alphys dialogue in an empty box: **194.5 s (47 %)**.
- Attacks: **136.0 s (33 %)**.
- Player turns: **75.4 s (18 %)**.
- Box transitions: ≈10 s.

Compare Sans: 21 % dialogue and 55 % attack.

### B1. Per-turn table

All times are exact to ±1 frame (33 ms). "Dialogue" is bubble-on time. In-turn gaps between bubble pages are included and noted. "Attack" runs from bubble-off to box-regrow start. The box then takes ≈0.6–0.8 s to expand back to the text box.

Box sizes are measured from the axis-aligned borders and are approximate for reshaped boxes. 208 px video ≈ 139 game px.

| T | P before (s), action | Enemy turn (s) | Dialogue (s) | Attack (s) | Dlg : attack | Attack content | Box |
|---|---|---|---|---|---|---|---|
| 1 | 130.00–141.17 (11.17), intro text, Check, FIGHT (SHOCKED −10) | 141.17–172.47 | 141.17–162.00 (**20.83**, incl. a 1.4 s gap 156.5–157.9) | 162.00–171.63 (**9.63**) | 2.2 : 1 | Pod laser sweeps through the box; tile bullets; white-heart bomb explodes ("BOM") at 167.0; then two dome turrets slide beams across (169.3–171.3) | Square with notched sides, ≈208x208 |
| 2 | 172.47–180.90 (8.43), ITEM (Spider Donut) | 180.90–200.60 | 180.90–193.93 (13.03) | 193.93–199.83 (**5.90**) | 2.2 : 1 | Ring-mine grid; the box **tilts and rotates**; lightning crosshair strikes 198.1–199.5 | ≈256x208, rotating |
| 3 | 200.60–205.37 (4.77), FIGHT (−7) | 205.37–231.30 | 205.37–220.97 (15.60) | 220.97–230.63 (9.66) | 1.6 : 1 | Pairs of laser pylons march past the box sides; ring bullets; crosshair strike at 229.8 | Wide ≈344x208 |
| 4 | 231.30–235.70 (4.40), FIGHT (−11) | 235.70–260.47 | 235.70–249.70 (14.00, incl. a 0.7 s gap) | 249.70–259.67 (9.97) | 1.4 : 1 | **Red dashed diagonal warning**, then a diagonal yellow laser between two emitters; the box becomes a rotated bevelled hexagon; crosshair strikes 252.4–255.1 | ≈256x254, hexagon |
| 5 | 260.47–268.43 (7.97), ITEM (Legendary Hero) | 268.43–293.53 | 268.43–281.77 (13.34) | 281.77–292.77 (11.00) | 1.2 : 1 | Octagonal/irregular box; side pylon; jagged lightning crosshairs 284.0–286.7; dome turrets with **cyan** beams 290.5–291.5 | ≈268, octagon |
| 6 | 293.53–297.37 (3.84), FIGHT (−6) | 297.37–328.53 | 297.37–318.63 (**21.26**) | 318.63–327.77 (9.14) | 2.3 : 1 | Horizontal laser along the top edge between two pylons; sliding dome beams (yellow, orange, cyan) 321–327 | ≈268 square |
| 7 | 328.53–332.77 (4.24), FIGHT (−5) | 332.77–358.10 | 332.77–346.83 (14.06, incl. a 0.9 s gap) | 346.83–357.33 (10.50) | 1.3 : 1 | Square tiles orbit the box; 3–5 domes above Alphys fire yellow beams 349.9–355 | Short-wide ≈284x164 |
| 8 | 358.10–364.13 (6.03), ITEM | 364.13–394.03 | 364.13–380.33 (16.20) | 380.33–393.40 (**13.07**) | 1.2 : 1 | Notched wide box; tiles; pod lasers; **five-dome cyan/orange sliding beams** 388–392.4 | Wide ≈388x208, notched |
| 9 | 394.03–398.77 (4.74), FIGHT (−6) | 398.77–420.97 | 398.77–409.23 (10.46) | 409.23–420.37 (11.14) | 0.9 : 1 | **PHASE 2.** Rotating ellipse of drop bullets around the SOUL; smiley bullet; laser along the bottom; dog sprite | Wide ≈388x208 |
| 10 | 420.97–424.63 (3.66), FIGHT (−5) | 424.63–456.63 | 424.63–439.17 (14.54) | 439.17–455.83 (**16.66**) | 0.9 : 1 | Fang "mouth" box that morphs (parallelogram at ≈450); domes with cyan/orange beams 452–455 | ≈208, morphing |
| 11 | 456.63–462.70 (6.07), ITEM (Glamburger, to 68) | 462.70–484.37 | 462.70–474.10 (11.40) | 474.10–≈484.4 (≈10.3) | 1.1 : 1 | Ring grid, dogs; box rotates 45° into a diamond; yellow lasers through the centre | ≈256, diamond |
| 12 | 484.37–490.67 (6.30), FIGHT (−8) | 490.67–522.17 | 490.67–511.10 (**20.43**) | 511.10–≈521.4 (≈10.3) | 2.0 : 1 | Smiley faces, dogs; two **V-shaped** yellow lasers from hand turrets | ≈316 |
| 13 | 522.17–525.97 (3.80), not FIGHT (no bar; action not identified) | 525.97–(end) | 525.97–535.33 (9.36) | ≈536.2–545.0 (≈8.8) | 1.1 : 1 | **Finale**, see B4 | Square → tall tooth column |

- Totals: dialogue 194.5 s, attacks ≈136 s.
- **Mean dialogue 15.0 s per turn against a mean attack of 10.5 s.** Phase 1 runs about 1.2–2.3 : 1 dialogue to attack; phase 2 runs about 0.9–2.0 : 1.
- Player turns: FIGHT turns 3.7–4.8 s; ITEM turns 6.0–8.4 s.
- Full cycle: **24–35 s** (mean ≈31 s), about twice Sans's 14–15 s.

### B2. The "SHOCKED" FIGHT penalty

Eight FIGHT presses were measured. All follow the same timing to within one frame:

| Event | Offset from the FIGHT bar appearing |
|---|---|
| Target bar appears | 0 |
| Player presses (bar stops) | ≈0.6–0.7 s (player-dependent) |
| Green-cyan electric orbs appear around Alphys | ≈1.0 s |
| **HP drops** | **1.07–1.17 s** (32–35 frames) |
| "SHOCKED" label shown above Alphys | from ≈1.1–1.3 s, for ≈0.8 s |
| Box shrinks into Alphys's turn | **2.03–2.10 s** after the bar appeared |

HP lost per press (read from the HP numbers):

| Time (s) | HP before → after | Loss |
|---|---|---|
| 140.1 | 68 → 58 | −10 |
| 204.2 | 54 → 47 | −7 |
| 234.6 | 31 → 20 | −11 |
| 296.3 | 52 → 46 | −6 |
| 331.7 | 46 → 41 | −5 |
| 397.6 | 52 → 46 | −6 |
| 423.5 | 46 → 41 | −5 |
| 489.6 | 68 → 60 | −8 |

- The loss is **5–11 HP**, roughly 7–16 % of max HP (68). It may be random or scale with something not visible.
- No damage number or HP bar for Alphys ever appears.

**Phase-2 HP regeneration (≈).** During phase 2 the player's HP visibly climbs in +2 steps. Examples:
- 441.3–448.4 s: about 1 HP/s.
- 513–522 s: 41 → 66, about 2.8 HP/s, between hits.
- After the 489.6 s SHOCK: 60 → 66 → 68 within ≈1.5 s.

The mechanism is not shown on screen **[uncertain: could be a scripted heal-over-time in phase 2]**.

### B3. Telegraphs

| Hazard | Warning cue | Samples: warning → live | Notes |
|---|---|---|---|
| **Red dashed diagonal** (T4) | Red dashes along the future laser line | Dashes from 249.90 (f 7497) to 250.50; emitters slide in 250.8–251.0; **laser live 251.30 (f 7539)** | **Lead 42 f = 1.40 s.** The dashes vanish 0.8 s before firing, a "memorise the line" telegraph |
| Pod laser (T1) | Pod sprite descends next to the box | Pod appears 162.53 (f 4876); thin beam ≈162.93; full beam 163.10 (f 4893) | **0.40 s to thin preview, 0.57 s to full beam** |
| Dome turret, T1 | Dome slides in from the edge, centre glows | Enters f 5066 → beam f 5078 | **12 f = 0.40 s.** Glow to full beam only ≈3 f (0.1 s) |
| Dome turret, T6 | Same | f 9620 → f 9632 | 12 f = 0.40 s |
| Dome row, T7 | 3 domes drop above Alphys, centres glow yellow, thin preview lines | Appear f ≈10502, glow f 10514, full f 10522 | **≈20 f = 0.67 s** (glow to full 8 f = 0.27 s) |
| Dome row, T8 (cyan) | Domes enter one after another at the right | Each fires ≈4–8 f after appearing | **0.13–0.27 s**: almost no warning, but the beams slide slowly |
| **Crosshair / lightning lines** (T2, T3, T4, T5) | **None found.** The line flashes solid white at full length immediately | Solid flash 2–4 f, then jagged "crackle" ≈4 f, then dotted after-image 4–6 f; total ≈12–14 f (0.4–0.47 s) | The storyboard's "dotted aim lines" are actually the decay. The bracket reticle appears with or after the strike. Strike spacing: T2 every ≈12 f (0.4 s); T5 every ≈25 f (0.83 s) |

### B4. Speeds and density

**Pod laser sweep (T1)**
- Eased back-and-forth motion. The beam moves from x≈389 to x≈494 and back over 163.1–167.2 s.
- Amplitude ≈105 px, about half the 208-px box.
- Peak speed ≈8 px/frame = **240 px/s ≈ 1.15 box widths/s**; average ≈0.25 box widths/s.

**Sliding dome beams**
- T1 (yellow/orange): **≈16 px/frame = 480 px/s ≈ 2.3 box widths/s**. A beam crosses the 208-px box in ≈0.43 s. New beams start every 18–22 f (0.6–0.73 s).
- T8 (cyan): ≈10 px/frame = **300 px/s ≈ 0.77 box widths/s** (box 388 px). New beams start every ≈14–16 f (≈0.5 s), so **up to 4 cyan beams** are live at once.

**Peak simultaneous hazards**
- Phase 1: T8 has 4–5 dome beams plus 6–8 tiles.
- Phase 2: T11–T12 have a grid of about 15 rings plus dogs and lasers.
- Finale: dozens of smiley-face bullets.

**SOUL mode:** red throughout phase 1. No gravity (blue) mode was seen. Cyan/orange beams appear in T5–T10. Whether they use Undertale's stay-still/move rule could not be confirmed from HP changes, because beams crossing the HP bar make the bar readings noisy **[uncertain]**.

### B5. Phase-2 changes, with times

| Time (s) | Change |
|---|---|
| 398.20–398.60 | Last phase-1 SHOCKED |
| 398.77 | T9 dialogue begins (normal sprite) |
| **≈406.4–407.1** | **Amalgamate-like figures fade in** behind Alphys over ≈18–20 frames (0.6 s), mid-dialogue |
| 408.87–409.07 | Grey static/noise patches flash at the screen's upper left for 2–3 frames (glitch cue) |
| 409.23 | First phase-2 attack (drop ellipse) |
| **410.93** | **MERCY** button loses its orange and turns white with a creature on it, 1.7 s into the T9 attack |
| **439.53** | **ACT** button taken, 0.36 s into the T10 attack |
| **474.40** | **ITEM** button taken, 0.30 s into the T11 attack. The SOUL sprite also stops reading as solid red around here |
| **511.57** | **FIGHT** button taken, 0.47 s into the T12 attack. The SOUL is pale/white |
| ≈536.2–537.3 | Finale: the screen darkens, a black square closes in around the box, and the HUD disappears |
| 537.8 | The box gains tooth walls |
| 538.9 | Smiley-face swarm |
| 539.5–544.9 | White floods in from the edges as a jagged blob. The box narrows to a tall tooth corridor (540–542.7), then widens |
| 545.0 | Full white; narration begins |

- Each button takeover lands right at the start of a phase-2 attack, **one button per turn** in the order MERCY → ACT → ITEM → FIGHT, at 29–37 s intervals.

---

## Design takeaways

### Reusable numbers

| Quantity | Sans (A) | Alphys (B) | Suggested default |
|---|---|---|---|
| Player turn (FIGHT) | 3.2–4.2 s (phase 1), 3.4–4.9 s (phase 2) | 3.7–4.8 s (incl. 2.07 s SHOCK sequence) | ≈3.5–4.5 s |
| Enemy dialogue per turn | 1.2–5 s (≤10 s for story beats) | 9–21 s (mean 15 s) | ≤4 s, or overlap it with the attack |
| Attack length | 6.5–10 s (mean ≈8) | 6–17 s (mean 10.5) | 7–9 s |
| Full cycle | 14–15 s | 24–35 s | 14–18 s |
| Bullets-on-screen share | 55 % | 33 % | ≥50 % |
| Slam / zone warning lead | 8–9 f at 24 fps (0.33–0.38 s); 0.25 s on the very first one; 0.6–0.67 s for crosshair slams | – | 0.35 s for familiar threats, 0.6 s for new ones |
| Line-laser warning | – | 1.40 s (dashed red diagonal) | 0.8–1.4 s for full-box lines |
| Blaster/turret: appear → fire | 0.6–0.8 s (≥1 s for the first of a turn) | Domes 0.4–0.67 s; pod 0.4–0.57 s | 0.6 s; a short glow/thin-line preview in the last ≈0.1–0.27 s |
| Beam life | 0.21 s solid + 0.2–0.25 s fade (barrage); 0.42–0.92 s solid (set-piece) | Sliding beams live 0.4–1.5 s | 0.2 s solid / 0.25 s fade for spam; ≥0.5 s for set-pieces |
| Barrage cadence | One beam per 0.5–0.7 s | One dome per 0.5–0.73 s | ≈0.6 s |
| Bone / laser speed | 0.59 → 0.68 box widths/s (336 → 400 px/s at 1.5x) | Domes 0.77–2.3 box widths/s; pod peak 1.15 box widths/s | 0.6 box widths/s, rising to 0.7 |
| Slam period | 1.04 → 0.83 → 0.65 s | – | Tighten by ≈20 % per reuse |
| Jump airtime | Tap 0.46–0.63 s; full 1.2 s | – | Design gaps around 0.5 s taps |
| Flicker cut | 9–11 f (0.4 s) early, 2–3 f (0.1 s) later | Static flash 2–3 f | 0.4 s first, then 0.1 s |
| Self-damage on FIGHT | – | 5–11 HP (7–16 % of max), 1.1 s after the bar | – |

### What each fight does well

- **Sans:**
  - Keeps the box busy. Dialogue is short (median ≈3 s), and the opening and final attacks are long continuous set-pieces.
  - Teaches each idea once in phase 1 (bone lines, blue bones, randomized lines, platforms 1–4, platforms with blasters), then remixes them behind flicker cuts in phase 2.
  - Escalates by reusing the same slam warning with a shorter period (1.0 → 0.65 s), not by adding new rules.
  - Uses true blackouts as transition punctuation. A 0.4-s cut hides box resizing and Sans repositioning, so every sub-pattern starts cleanly.
- **Alphys:**
  - Builds threats from visible hardware: pods, pylons, domes, a remote. Each gadget announces itself by sliding in 0.4–0.67 s before it fires.
  - Escalates through **box geometry** (notched, rotated, hexagon, octagon, diamond) and **UI corruption** (one button per phase-2 turn).
  - Spends about half the battle on dialogue in an empty box. That works for story but drains tension.
  - The crosshair lightning has no pre-warning, and its decaying dotted lines read as warnings after the fact. This looks unfair.

### Combining them in a "Sans + Alphys" fight

1. **Talk over attacks.** Give Alphys's lines to bubbles shown while Sans's pattern runs, and the reverse. Aim for about 3–4 s of bubble per turn outside an attack, and keep the cycle at about 15 s.
2. **One warning grammar.** Use Sans's dim-red zone rectangle (0.35 s) for close, familiar threats. Use Alphys's dashed red line (≈1.0–1.4 s) for full-length lasers. Add a 0.1–0.25 s glow or thin line just before any beam. Give Alphys's lightning a real 0.3–0.4 s dashed preview before the solid flash.
3. **Shared cadence.** Blasters and domes both work at about 0.6 s per shot and about 0.6 s appear-to-fire. A mixed barrage can alternate a skull and a dome every 0.6 s, which reads as one rhythm.
4. **Colour rules.** Sans's light-blue bones and Alphys's cyan beams can share the "don't move" rule; orange means "move". Keep yellow for UI only (Alphys's yellow lasers clash with the FIGHT highlight).
5. **Transition cues.** Use Sans's black cuts (0.4 s first, 0.1 s later) between remix segments. Use Alphys's 0.6 s fade-in plus a 2–3 frame static flash for a story phase change. Pick one cue as the "phase 2 has started" signal.
6. **Menu pressure.** Sans's menu bones (209 px/s, right to left, cannot kill) and Alphys's button takeover (one button per turn) can stack. If FIGHT also shocks for 5–11 HP, budget about one heal every two turns, or drop the menu bones on shock turns.
7. **Finale.** Sans's 51 s final attack plus about 6 min of stall, and Alphys's 9 s blob plus 64 s of narration, are both far longer than the attack loop. For a fan fight, cap the set-piece at about 30–40 s and the non-interactive coda at about 60 s, with a skip on retries.

---

### Files and caveats

- Analysis scripts are in `scratchpad/prec/py/` (feature extraction, box/turn segmentation, beam tracking, red-warning scan, contact sheets).
- Large intermediate frame dumps were deleted after measurement.
- A is a 24 fps capture of a 30 fps game. Some game frames are dropped or duplicated (consecutive identical frames were seen during beams), so single-frame events can be missed or doubled.
- Crowded scenes are approximate: blaster counts in the spiral, the exact on-screen bone count, and B's rotated boxes (where box dimensions are only bounding estimates).
- HP readings in B were confirmed from the on-screen digits for the SHOCK table; the regeneration rates come from the bar and are approximate.
