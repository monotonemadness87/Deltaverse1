# Frame-accurate timing study: "(No Hit) Secret Gerson Fight | Deltarune Ch4"

This report replaces the approximate numbers in `gerson-report.md`. That report worked from storyboard sheets, and its clock drifts by up to ~12 s late in the video. All times here come from decoding every frame of `gerson.mp4`.

## 0. Method, units and caveats

- **Frame rate.** The file is 60 fps, but the game draws at **30 fps**: every game frame appears twice, and the recording's own overlay reads "30 FPS". The real precision is **1 game frame = 2 video frames = 1/30 s ≈ 0.033 s**. I give times in seconds from the start of the video. Frame numbers marked "vf" are 60 fps video frames (vf = round(t × 60)).
- **Recording hitches.** In a few places the video repeats the same frame many times. One example is at 84.0 s, where 12 identical video frames appear in a row. A hitch can stretch a single interval by up to ~0.2 s. Medians are used to keep hitches out of the summary numbers.
- **Pixel scale.** The game image is 960×720, pillarboxed at x = 160–1120, so **1 game pixel = 1.5 video pixels**. The standard bullet box measures **224×224 video px (≈150 game px)** from outer edge to outer edge, centred at (640, 360). **"Box widths/s" always means 224 px/s.** Speeds are also given in game px per game frame ("gpx/f" = video px/s ÷ 45).
- **How each measurement was made:**
  - Per-frame colour features, for the box outline, SOUL colour, TP bar height and command panel.
  - Colour-blob tracking of red and yellow arrows, used to get speed, side, colour change and impact frame.
  - Lane detection inside the box: grey/white column and row bands, plus enemy-body pixels.
  - Grey-blob optical flow for the hammers.
  - Spot checks on frame-by-frame contact sheets.
- Values marked **(≈)** or "uncertain" are estimates. Everything else is measured to ±1 game frame, unless the text says otherwise.

### Corrections to the coarse report

- **The shield-turn projectiles are arrows, not hammers.** They are small arrow sprites that fly straight in from the screen edges toward the green SOUL, in the style of Undyne's spears. The yellow markers the coarse report took for warnings are the same arrows. **An arrow is drawn yellow while it is waiting in line, and turns red when it becomes the next one due to hit** (§2.1).
- **"Shells" are a separate projectile** in later shield turns. They are turtle shells that the shield knocks away, and they come back in from another side.
- **A slow "big hammer" ends three of the shield turns** (T4, T10, T14). Blocking it sets off a white ring flash and switches the SOUL to red for the dive section.
- **Turn times.** There are still 14 enemy turns in the same order as before, but the times have moved; see the table below. For example, the wide-box turn is at 174.9–188.2 s, not 167–178 s.

## 1. Turn boundaries

Columns: **Box in** = first frame the spinning box is drawn. **Full** = the box reaches full size. **1st hazard** = first projectile or telegraph on screen. **Last hazard** = the last hazard is gone or blocked. **Spin-out** = last full-size frame before the box spins away. **Box gone** = last frame the box is drawn. **Menu** = the command panel starts to slide up.

| # | Attack | Box in | Full | 1st hazard | Last hazard | Spin-out | Box gone | Menu | Box on (s) | Full→1st hazard (s) | Hazard span (s) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| T1 | Shield, square guard, arrows | 5.667 | 5.900 | 6.300 | 13.033 | 13.433 | 13.667 | 13.983 | 8.00 | 0.40 | 6.73 |
| T2 | Shield, square, arrows | 17.583 | 17.817 | 18.367 | 24.833 | 25.217 | 25.450 | 25.783 | 7.87 | 0.55 | 6.47 |
| T3 | Shield, square→**octagon at 36.63**, arrows | 31.800 | 32.033 | 32.467 | 39.567 | 39.917 | 40.150 | 40.483 | 8.35 | 0.43 | 7.10 |
| T4 | Shield (octagon) + slow big hammer + **1 dive** | 47.717 | 47.950 | 48.800 (big hammer) | 56.467 | 57.233 | 57.467 | 57.783 | 9.75 | 0.85 | 7.67 |
| T5 | **Shell & stars** (red SOUL) | 61.050 | 61.283 | 62.400 | ≈73.9 | 74.100 | 74.333 | 74.650 | 13.28 | 1.12 | ≈11.5 |
| T6 | **Hammer storm** (diamond box) | 83.150 | 83.383 | 84.383 | 96.000 | 96.667 | 96.900 | 97.150 | 13.75 | 1.00 | 11.62 |
| T7 | Shield (octagon), arrows incl. diagonals | 100.450 | 100.683 | 101.133 | 108.733 | 109.100 | 109.333 | 109.650 | 8.88 | 0.45 | 7.60 |
| T8 | Shield: arrows (119.2–124.6) then shells (≈125.2–129.6) | 118.483 | 118.717 | 119.233 | 129.633 | 130.033 | 130.267 | 130.583 | 11.78 | 0.52 | 10.40 |
| T9 | Shield: shells (140.2–) then arrows (143.9–151.2) | 139.317 | 139.483 | 140.167 | 151.233 | 151.600 | 151.833 | 152.150 | 12.52 | 0.68 | 11.07 |
| T10 | Shield shells + big hammer + **dive chain** | 155.517 | 155.750 | 156.433 | 165.067 | 165.800 | 166.067 | 166.350 | 10.55 | 0.68 | 8.63 |
| T11 | **Wide-box dives** (672×112 strip) | 174.917 | 175.150 | 176.667 (first lane) | 187.800 | 187.967 | 188.200 | 188.517 | 13.28 | 1.52* | 11.13 |
| T12 | **Hammer storm** (repeat) | 192.017 | 192.250 | 193.250 | 204.900 | 205.533 | 205.733 | 206.083 | 13.72 | 1.00 | 11.65 |
| T13 | Shield: shells (215.8–) then arrows (224.0–228.2) | 214.950 | 215.183 | 215.833 | 228.300 | 228.550 | 228.817 | 229.083 | 13.87 | 0.65 | 12.47 |
| T14 | Final: shield (shells, few arrows) → big hammer → dive chain → ring finale | 238.067 | 238.300 | 238.833 | ≈255.10 | (box shrinks 253.2–253.7) | 257.783 (fade to white) | none | 19.72 | 0.53 | ≈16.3 |

\*T11: the box is full size at 175.15. Gerson pops up above it at ≈175.8, the box stretches into the wide strip between 176.0 and 176.2, and the first lane appears at 176.667.

### Fixed transitions (identical in every turn)

| Transition | Video frames | Seconds |
|---|---|---|
| SOUL leaves Susie → box first drawn | 10 vf | 0.167 |
| Box spin-in, first pixel → full size | 14 vf (7 game frames) | 0.233 |
| Spin-out, last full frame → box gone | 14 vf | 0.233 |
| Box gone → command panel appears | 15–21 vf | 0.25–0.35 |
| Last hazard → spin-out starts | 10–46 vf | 0.17–0.77. About 0.35 s after shield turns and 0.6–0.77 s after big-hammer or dive endings. |

### Player turns (box gone → next box)

| Gap | Window (s) | Length (s) | Action (TP before → after) |
|---|---|---|---|
| P1 | 13.667–17.583 | 3.92 | FIGHT (38 → 62) |
| P2 | 25.450–31.800 | 6.35 | Spell (77 → 38) |
| P3 | 40.150–47.717 | 7.57 | Spell (54 → 15) |
| P4 | 57.467–61.050 | 3.58 | FIGHT (22 → 46) |
| P5 | 74.333–83.150 | 8.82 | Spell (52 → 13) |
| P6 | 96.900–100.450 | 3.55 | FIGHT (26 → 50) |
| P7 | 109.333–118.483 | 9.15 | Spell (61 → 22) |
| P8 | 130.267–139.317 | 9.05 | Spell (40 → 0) |
| P9 | 151.833–155.517 | 3.68 | FIGHT (27 → 51) |
| P10 | 166.067–174.917 | 8.85 | Spell (58 → 19) |
| P11 | 188.200–192.017 | 3.82 | FIGHT (27 → 51) |
| P12 | 205.733–214.950 | 9.22 | Spell (69 → 30) |
| P13 | 228.817–238.067 | 9.25 | Spell (44 → 0) |

- **FIGHT turns last 3.55–3.92 s.** Each one gives a flat **+24 % TP** when the attack lands (Gerson still shows "MISS").
- **Spell turns last 6.35–9.25 s.** They cost about 39–40 % TP net, and the later ones include a short line of Gerson dialogue. During spell turns the menu stays up for only ~2.7 s; the rest is animation.
- **The pattern is not strict alternation.** There are two spell turns in a row at P7–P8 and P12–P13.
- **Spectacle turns have no fixed preceding action.** T5 and T12 follow a FIGHT turn, while T6 and T11 follow a spell turn.

## 2. Telegraphs and lead times

### 2.1 Shield arrows (green SOUL, block with the rotating axe-shield)

- **Spawn and "telegraph".** Arrows spawn at the edge of the screen on one of 4 axes (T1 to mid-T3) or 8 axes (from 36.63 s). The upper 4 directions are much more common. Arrows from below travel up through the HUD strip. The arrow itself is the warning: there is no separate marker.
- **Time on screen before impact.** The time from appearing to being blocked is set by the turn's arrival timing, not by distance. Within a turn, **horizontal arrows are faster than vertical ones so that both arrive about 0.6–0.7 s after spawning.**
  - T2 example: right side at 668 px/s, impact 0.60 s after spawn; top at 459 px/s, 0.63 s; bottom at 448 px/s, 0.67 s; left at 627 px/s, 0.63 s.
  - Diagonal arrows start further out (~500 px) and take 0.8–1.0 s.
  - Per-turn medians of time on screen: T1 0.50, T2 0.67, T3 0.67, T4 0.63, T7 0.47, T8 0.75, T9 0.80, T13 0.90 s.
  - Slow "pace-setter" arrows are visible for 1.4–2.5 s: T1 opening (1.37–2.0 s), T2 at 21.17/24.83 (1.55 s), T3 at 38.10 (2.2 s), T13 at 225.8–227.0 (1.8 s).
- **Red "you're next" highlight.** Arrows are yellow while queued. An arrow turns red **2 game frames (4 vf) after the arrow ahead of it is blocked.** This held for every case checked, for example in T1 at 460→464, 494→498 and 530→534 vf. The first arrow of each burst spawns red.
  - Lead from turning red to impact, per-turn median: **0.18–0.33 s**. Overall range 0.10–0.93 s, and 0.0 s in the densest T9 burst.
  - The highlight therefore tells the player **which** arrow to block next, about **0.2–0.3 s ahead**. The overall direction warning comes from seeing the arrows travel in from the edge, 0.5–0.9 s ahead.
- **Spacing between impacts**, over all shield turns:
  - 10th / 50th / 90th percentile: **0.19 / 0.37 / 0.64 s**.
  - When the next arrow comes from a different side, so the shield has to turn: **0.23 / 0.37 / 0.67 s**. The minimum is 0.233 s, except possible 0.10 s pairs in T8/T9, where tracking is uncertain.
  - Same-side trains: 0.13–0.17 s apart (T1 at 12.77–13.03 and T3 at 38.73–38.90, for example).
- **Shield turn speed.** The shield snaps 90° in about 2 game frames (36.10 → 36.17 s). This is not a limiting factor.

### 2.2 Shells (green SOUL, shield turns T8–T10, T13, T14)

- Shells enter from the screen edge. The first one of each turn comes from the **top**:
  - T9: 140.17
  - T10: 156.43
  - T13: 215.83
  - T14: 238.83
- A shell reaches the shield **0.5–0.8 s (≈)** after appearing. When blocked it bounces off at an angle and comes back in later from another side.
- They have no red/yellow highlight. The visible incoming shell is the only warning.
- Shell speeds measured on straight segments are 190–540 px/s (≈0.85–2.4 box widths/s). There appear to be a slow (~190 px/s) and a fast (~340–540 px/s) kind. **(≈, the tracking is noisy because the shells spin and change colour.)**

### 2.3 Big hammer (shield-turn finisher)

- **T4:**
  - Visible at the top centre from **48.80 s**. It descends at only **~45 px/s (0.2 box widths/s)**, flashing white and red: about y 0 → 231 by 53.8 s.
  - It hovers for ~1.3 s, then strikes and is blocked at **≈55.33 s**.
  - It acts as a **~6.5 s visible countdown** to the end of the shield phase while arrows keep coming (51.3–54.8 s).
- **T10:**
  - Waits flashing at the right edge (x ≈ 930–1000) from **≈156.8–157.6 s**.
  - Lunges at **159.33 s** and is blocked at **≈159.5 s**: about 2.5 s visible. (≈, the flashing makes detection intermittent.)
- **T14:** Comes from the left at ≈246.4 s. The block flash is at 246.57 s. Its lead time could not be separated from the shells around it.
- **Block outcome:**
  - The shield flashes white, and a **white ring expands from the box over ~0.25 s**.
  - The SOUL then turns red, ≈0.1–0.2 s after the block: T4 at 55.50, T10 at ≈159.65, T14 at ≈247.0.

### 2.4 Dives (red SOUL): "Gerson silhouette + lane" telegraph

The same timeline repeats every time. The lane is a grey band across the box (vertical, horizontal or diagonal).

| Step | Normal box (T4, T10) | Wide box (T11) | Final turn (T14) |
|---|---|---|---|
| Gerson or clone visible above the box | −28 vf (−0.47 s) | — | −28 vf (−0.47 s) |
| Lane starts fading in | **−24 vf (−0.40 s)** | **−28 to −30 vf (−0.47 to −0.50 s)** | **−22 vf (−0.37 s)** |
| Lane at peak brightness / silhouette pure white | −16 vf (−0.27 s) | −22 vf (−0.37 s) | ramps up to the hit |
| Lane faded out | −6 vf (−0.10 s) | similar | lane stays lit |
| Strike: swoosh crosses the box | 0 | 0 | 0 |
| Body stays in the lane | +4 to +16 vf (0.2 s), then fades by +20 vf | similar | overlaps with the next lane |

- **Samples.** In all cases, lane onset → strike was measured from frames.
  - **T4** (vf 3346 → 3368–3370): 22–24 vf.
  - **T10**: 9592→9616, 9628→9648, 9656→9680, 9688→9712, 9720→9744, 9752→9776, 9784→9808: each 24 vf (0.40 s).
  - **T10 horizontal dash**: ≈9866 → 9892, 26 vf.
  - **T11**: 10750 → 10780, 10766 → ≈10796, 11122 → 11152, 11184 → ≈11212: 28–30 vf.
  - **T14**:
    - Diagonal 14828 → 14850 and vertical 14864 → 14886, both 22 vf.
    - Second vertical 14972 → 14994, also 22 vf.
- **The strike itself is effectively instant.** The body crosses the whole box in ≤2 game frames (>3000 px/s). The lane is the only warning.
- **Lane sizes:**
  - Normal box (inner width ≈211 px): **92–120 px wide, about half the box**. Lanes sit at three positions: left (x 536–651), centre (586–706) and right (653–745), and are mostly placed over the SOUL.
  - T10 horizontal band: 120 px tall (y 306–425), the middle half.
  - Wide strip: lanes are **110 px wide (≈1/6 of the 644 px strip, ≈0.5 standard box widths)**.
- **Cadence:**
  - **T10:** one dive every **32 vf (0.53 s)**, 7 vertical dives in 159.87–163.2 s, then a pause, then a horizontal dash at 164.47–165.07 s. The next lane starts while the previous body is still in the box.
  - **T11 sweeps:**
    - 176.67–178.6: left→right, a new lane **every 10 vf (0.167 s)**, each shifted **75 px**. 8 lanes; the right end of the strip stays safe.
    - 179.17–181.3: right→left, a new lane every **16 vf (0.267 s)**, 75 px apart. The sweep moves at ≈280 px/s, faster than the SOUL (≈225 px/s), so the player has to start moving early and finishes at the far left end (x ≈ 362).
  - **T11 bursts:**
    - 182.2–183.2: 3 lanes at once (x 326–452, 568–728, 844–961), about 60 % of the strip.
    - 184.1–184.3: a lane covering two-thirds of the strip (326–728), then the remaining third (799–961).
    - 185.4–187.8: further bursts of 2–3 lanes.
  - **T14:** ~14 dives between 247.5 and 253.2 s, **average interval 0.41 s**, shortening from 0.53 s to 0.30–0.33 s. The dives mix vertical, horizontal and diagonal lanes.
- **Ring finale (T14):**
  - The box shrinks from 224 to **168 px** (0.75×) during 253.2–253.7.
  - **About 8 clones form a ring** around it at 253.77–253.97 and hold for **~0.9 s**.
  - Then the **whole box** turns grey (254.83) and white (254.90–254.97): a full-box telegraph of ≈0.13 s.
  - The clones spin around the box at 254.97–255.03 and vanish at 255.10.
  - No damage registers. It appears to be a scripted climax rather than a dodge test (uncertain).

### 2.5 Hammer storm (T6, T12): no lane telegraph

- **T6:**
  - The box moves up and left to (520, 282) and turns into a diamond (bbox 304 px) at **84.62 s**. The rotation takes ≈1.2 s from the box being full size.
  - The first hammers appear **0.23 s before** the diamond is complete (84.38 s).
- **T12:** The diamond is complete at 193.55 s; hammers start at 193.25 s.
- The hammers are thrown from the upper right, so that corner and Gerson's leaps are the warning. They pass through the box and fall out down and to the left.
- **Big hammer at the end:**
  - T6: thrown at 95.0 s, lands on the box at ≈95.25 (the box is knocked ~45 px down), stays until ≈95.9 and is gone by 96.0 s.
  - T12: thrown at 203.9 s, lands at ≈204.2, gone by 204.95 s.
  - It appears ≈0.25–0.3 s before landing; that is its only warning.

### 2.6 Shell & stars (T5): no lane telegraph

- Gerson flashes green, spins and launches as a shell at ≈62.4 s.
- Each pass across the box is visible as a straight line from the point it left. Passes alternate sides, coming from Susie's side, then Gerson's.
- **Ground pound:** the shell rises to the top centre (70.6–71.2 s, **≈0.6 s visible wind-up**), then slams down through the box at 71.27–71.47 s. A star burst and dust clouds follow, and the stars rain down until ≈73.9 s.

## 3. Hazard speed and density

| Hazard | Speed (video px/s) | Box widths/s | gpx/f | Notes |
|---|---|---|---|---|
| Arrows: slow pace-setters | 160–270 | 0.7–1.2 | 4–6 | T1 opening (≈212), T2/T13 singles (≈225–270) |
| Arrows: vertical (normal) | 320–460 | 1.4–2.1 | 7–10 | T2/T3/T8 ≈325–460 |
| Arrows: horizontal / diagonal (normal) | 540–720 | 2.4–3.2 | 12–16 | |
| Arrows: fast bursts | 800–925 | 3.6–4.1 | 18–20 | T1 10.97–12.43 (≈807), T3 (925), T7 end (≈895), T13 end (898) |
| Shells (shield turns) | 190–540 (≈) | 0.85–2.4 | 4–12 | Bounce off the shield and come back |
| Gerson shell, T5 crossings | 555–670 | 2.5–3.0 | 12–15 | A crossing every ≈0.6–0.75 s |
| Gerson shell, T5 ground pound | ≈1365 | ≈6 | ≈30 | 71.27 → 71.47 s |
| Stars, T5 rain after the slam | median ≈280, falling ≈225 | 1.0–1.25 | 6 | Up to ≈29 star blobs on screen (≈) |
| Hammers (storm) | median ≈420, IQR 270–540, p90 ≈640 | 1.9 (1.2–2.4) | 9 (6–12) | Same in T6 and T12 |
| Big hammer, T4 descent | ≈45 | 0.2 | 1 | Then a fast strike |
| Dive strike | >3000 | >13 | — | Effectively instant; only the 0.37–0.50 s lane matters |
| Player SOUL (red), for reference | ≈226 | ≈1.0 | ≈5 | Measured over a 113 px run |

### Peak hazards on screen

- **Arrows:** usually 2–4 at a time. Measured peaks per turn:

  | Turn | T1 | T2 | T3 | T4 | T7 | T8 | T9 | T13 |
  |---|---|---|---|---|---|---|---|---|
  | Peak arrows | 4 | 3 | 3 | 2 | 3 | **6** | 5 | 5 |

- **Shells:** 1–2 on screen in T8, T13 and T10, and up to **≈4 in T9** (141.2 s) and **T14** (240.7 s). (≈)
- **Hammer storm:**
  - T6: about 14 hammers 1 s in, building to a **peak of ≈40–45 on screen** at ≈86–88 s, about 35–40 for most of the turn, and tapering off from ≈94 s.
  - T12: peak ≈48 at ≈193.8–194.4 s. (Counts are grey-blob detections, ±5.)
- **Dives:** 1 lane at a time in T4 and T10, overlapping with the previous body. Up to **3 simultaneous lanes (≈60 % of the strip)** in T11. In the T14 finale, the whole box.

### How the shield attack escalates (exact times)

1. **T1 (5.67–13.67).** Square guard, 4 directions. It starts with **slow single arrows** (≈212 px/s, impacts every ≈0.57 s: 7.67, 8.23, 8.83, 9.40, 10.40). At **10.97 s** it switches to **fast arrows alternating left and right** (≈807 px/s, every 0.30 s). It ends with a **3-arrow train from the top** (12.77–13.03, 0.13 s apart).
2. **T2 (17.6–25.5).** Still 4 directions. A steady rhythm of single arrows **0.33–0.40 s apart** from all 4 sides at mixed speeds (440–770 px/s), with two slow decoys (≈268 px/s).
3. **T3 (31.8–40.2).** 4 directions until the guard **turns into an octagon at 36.63 s** (shown in place, right after a block). The **first diagonal arrow is blocked at 38.10 s**. The turn ends with a fast diagonal pair (38.73 / 38.90) and one arrow from the upper right (39.57).
4. **T4 (47.7–57.5).** Octagon. The slow big hammer is a 6.5 s countdown. Arrows come mostly from **below** (4 of 7). First **mode switch to red SOUL** at 55.50, and the first **dive** at 56.13.
5. **T7 (100.5–109.3).** Octagon. **Diagonals are now routine** (9 of 17 arrows come from UL/UR/DL/DR). Speed climbs through the turn, from ≈410–540 px/s up to **≈720–900 px/s at the end** (106.3–108.7).
6. **T8 (118.5–130.3).** The **densest arrow burst: 6 on screen**. Opening triples come from one side (left ×3, then right ×3, about 0.17–0.30 s apart). **Shells are introduced** in the second half.
7. **T9 (139.3–151.8).** **Shells first** (up to ≈4 at once), then **arrows from 143.9**, at ≈540 px/s and 0.23–0.33 s apart, mixed with returning shells. The tightest spacing in the fight is here.
8. **T10 (155.5–166.1).** Shells (156.4–≈159), then the big hammer, then a **7-dive chain** and a horizontal dash.
9. **T13 (215.0–228.8).** Shells alone for 8 s, then arrows (224.0–228.2) mixing slow decoys (≈225 px/s) with very fast ones (≈900 px/s at the end).
10. **T14 (238.1–257.8).** Shells (238.8–), a few arrows from below (243.2–245.1), the big hammer and ring flash (246.57), a **14-dive chain with diagonal lanes** (247.5–253.2), the box shrinking, and the ring finale.

## 4. Damage and feedback beats

- **HP stays at 230/230 for the whole run.** The HP bar never shortens during an enemy turn; the only "short" readings are where dive clones cover the HUD in T14. **No damage flashes occur.**
- **Block = +1 % TP.** In T1 every arrow block is followed **2 game frames later** by a +1 % step on the TP bar: blocks at vf 460, 494, 530, 564… and TP steps at 462, 496, 531, 565… T1 has 14 blocks → **+14 % (24 → 38)**. Every block also gives:
  - a **white flash on the shield** for 3 game frames;
  - a small burst of gold sparkles.
- **TP gained per enemy turn** (from the TP bar, ±1 %):

  | Turn | TP gain | Turn | TP gain |
  |---|---|---|---|
  | T1 | +14 | T8 | +18 |
  | T2 | +15 | T9 | ≈+26 |
  | T3 | +16 | T10 | +8 |
  | T4 | +8 | T11 | +8 |
  | T5 | +6 | T12 | +18 |
  | T6 | +13 | T13 | +14 |
  | T7 | +11 | T14 | ≈+9 |

  In the red-SOUL turns (T5, T6, T11, T12) the TP comes from **grazing**. A **white outline around the red SOUL** shows while hazards pass close: it is seen repeatedly in the hammer storms and after dives. TP rises in small steps of ≈1 %, often in short runs during the densest moments (for example T12 at 203.1–203.6 s).
- **Mode-switch feedback.** The big-hammer block gives a white ring flash, then the red SOUL, then about 0.25 s of nothing, then the first lane.

## 5. Design takeaways (reusable numbers)

- **Enemy-turn length.**
  - Box on screen: shield turns **7.9–8.9 s** early on (T1–T4, T7), **10.5–13.9 s** for mixed or spectacle turns, and **19.7 s** for the finale.
  - Hazard spans inside them: 6.5–7.7 s early, 10.4–12.5 s later, 16.3 s for the finale.
- **Turn framing.**
  - SOUL launch → box drawn: 0.17 s. Box spin-in: 0.23 s. First hazard **0.4–0.7 s after the box is full** (1.0–1.1 s for the spectacle turns, which need a set-up beat).
  - Last hazard → box spin-out: **0.35 s** after a plain block, **0.6–0.8 s** after a finisher. Spin-out 0.23 s. Menu 0.3 s later.
- **Player turns.** Short (**≈3.6–3.9 s**) after a FIGHT, longer (**6.4–9.3 s**) when a spell or dialogue plays, so total pressure stays at roughly a 60–75 % duty cycle.
- **Directional-block arrows.**
  - Make the **time to impact constant (≈0.6–0.7 s)** and scale speed by distance. That works out to ~450 px/s vertical and ~630 px/s horizontal at this resolution, or about **2.0 and 2.8 box widths/s**.
  - Use **slow decoys** (~1 box width/s, visible 1.5–2.5 s) and **fast closers** (~3.6–4 box widths/s, visible ~0.5 s) to change the rhythm.
  - Space impacts at **~0.37 s (median)**. Use **≥0.23 s** when the side changes, and allow **0.13–0.17 s** only for same-side trains.
  - Mark only the **next** projectile (yellow → red). It turns 2 game frames after the previous block, giving about **0.2–0.3 s** of "this one's next" warning.
- **Escalation steps.**
  - Directions: 4 → 8 (here ≈4.6 s into the third shield turn, after ≈37 blocks in total), and diagonals routine from the 5th shield turn.
  - Arrow types: single slow arrows → alternating fast pairs → same-side trains → mixed speeds.
  - Peak on screen: 3–4 → 6.
  - New projectile types arrive half a turn at a time: shells come in during the second half of T8, then lead the following turns.
  - Spectacle red-SOUL turns go in after shield turns, so attacks escalate by switching modes instead of only adding density.
- **Dive / lane strikes.**
  - Telegraph with a lane **about half the box wide**, starting **0.37–0.40 s** before an instant strike. Make it **0.47–0.50 s** on a 3× wide arena, where the player has further to run.
  - Fade in to peak in ~0.13 s and fade out ≈0.1 s before the hit. Show the attacker or silhouette ≈0.47 s before the hit.
  - Chain strikes every **0.53 s**, dropping to **0.3–0.4 s** in a finale.
  - With a SOUL speed of ~1 box width/s, a half-box lane can always be left in time.
- **Sweeps on a wide arena.**
  - Lane width ≈1/6 of the strip, stepping 75 px (≈0.68 lane widths) every **0.167 s** (fast) or **0.267 s** (slower than the player, but it chases).
  - Always end the sweep one lane short of the wall, so there is a safe pocket.
- **Bullet storm.**
  - ≈40–48 objects at once, all coming from one corner at ≈1.9 box widths/s (p90 2.8).
  - The single source corner makes the safe side easy to read.
  - Finish with one big, slow, readable object (≈0.3 s warning, ~0.7 s in the box).
- **Mode-switch beat.**
  - Use a slow, flashing "timer" projectile, here 6.5 s at 0.2 box widths/s, to show when the phase will end.
  - The block sets off a full-arena flash ring (~0.25 s). Then the SOUL changes colour, then a **≈0.25–0.5 s** pause before the first lane.

## Uncertain or not measured

- Shell speeds and counts (§2.2, §3) are approximate because the shells spin and change colour.
- The minimum 0.07–0.10 s impact gaps in T8/T9 may be tracking artefacts.
- T5's last-hazard time (≈73.9 s) and the star counts are approximate.
- The T14 big-hammer lead time was not isolated.
- Whether the T14 ring finale can actually hit the player cannot be told from a no-hit run.
- Grazes were not counted one by one; only their effect on TP is reported.

Measurement data and scripts: `scratchpad/gp/` (`feat.npz` per-frame features, `call.jsonl` and `ball.jsonl` colour blobs, `arrows_T*.json` arrow tracks, `lanes_T11.txt`, `gf_T6.txt`, `gf_T12.txt`, and contact sheets `s*.png`).
