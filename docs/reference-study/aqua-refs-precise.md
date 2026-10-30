# Aqua duel boss: frame-accurate timing of the two reference videos

Companion to `aqua-refs-report.md`, which is the coarse storyboard pass. This file has measured numbers. Video B ("No More Deals" Chara) comes first because it is the stronger reference. Video A ("Love Maniac") follows. Reusable numbers are collected at the end.

## 0. Method and how far to trust the numbers

- **Sources.** B is `chara.mp4`: 960x720 at 59.73 fps, 82,576 frames. A is `lovemaniac.mp4`: 1280x720 at 60 fps. Both files were only read with ffmpeg and with Python/numpy/PIL.
- **Full-rate pass.** Every frame of each fight was decoded. B was covered from 251 s to 1250 s (59,700 frames) and A from 140 s to 387 s (14,800 frames). For each frame I recorded:
  - mean luminance;
  - counts of white, red, yellow, cyan, orange and grey pixels in the play field;
  - the yellow and red lengths of the HP bar;
  - the brightness and yellow-highlight state of each menu button;
  - a 120x90 greyscale thumbnail.
- **Box detection.** The battle box was found at 10 fps, and at full rate around turn boundaries. The detector looks for a pair of matching 2–10 px white horizontal bars joined by white vertical sides with an empty interior.
- **Visual checks.** I checked by eye at "game rate", meaning every 2nd frame, on timestamped contact sheets for:
  - every telegraph type quoted below;
  - the BLOCK parry;
  - the MERCY removal;
  - the finales.
- **Precision.**
  - Times are video seconds (s). "fr" means 60 fps video frames. To get a B frame index, multiply the time by 59.73.
  - In B many hazards only change every 2nd video frame, so the game logic appears to update at about 30 Hz. Other hazards, such as falling knives, move every frame. Hazard onsets are therefore exact to about ±1 frame (±17 ms), and durations to about ±2 frames.
  - Box-shrink starts come from the 10 fps pass and are good to ±0.1 s.
  - Telegraph onsets come from colour-pixel counts. Where warnings overlap, which is common in B, I attributed each one to its slash by eye. Those values are marked ≈.
- **Units.** Box widths are the outer size in source pixels. B's default square box is 216x209 px at 960 wide, which is 22.5% of the screen width. A's square box is about 220x210 px at 1280 wide, which is 17%. "bw/s" means box-widths per second, measured against the box on screen at that moment.
- **Content.** Only battle mechanics are described. Dialogue is paraphrased in a few words at most.

---

## VIDEO B: "No More Deals" Chara fight

### B1. Fight-level numbers

| Item | Value |
|---|---|
| First menu (the fight proper begins) | 270.450 s |
| Last enemy phase ends (end of the finale) | ≈1098.9 s, so the fight lasts **≈828 s (13.8 min)** |
| Player turns | 26: 21 FIGHT and 5 ITEM. MERCY was never used, and ACT was only browsed. |
| FIGHT results | **20 of 20 measurable FIGHTs were BLOCKed.** The 21st opens the finale, and its label was also seen. No damage was ever dealt. |
| Time from menu opening to the player's confirm | median **2.7 s** (range 1.4–4.4 s; ITEM turns run up to 11.3 s because of the long item text) |
| Time from FIGHT confirm to the start of the enemy phase | **2.09–2.13 s**: about 0.64 s of guard animation, then about 1.49 s of BLOCK label |
| Enemy-phase length (from the end of the player's turn to the next menu) | median **27.2 s**, range 11.2–45.4 s |
| Dialogue inside enemy phases | median 4.1 s, max **29.1 s**. It is front-loaded: turns 1–15 almost all open with 5–29 s of speech, and turns 16–25 have almost none. |
| Pure attack time (from the end of the last speech bubble to the next menu) | median **16.3 s**, range 8.4–30.5 s, about 445 s in total |
| Share of fight time | about 10% menus, about 25% dialogue, about 55% attacks, about 10% transitions, BLOCK and the finale |
| Box shrink and expand animation | **≈0.75 s**, eased. Shrink starts about 0.15–0.3 s after the action resolves. Expand starts on the exact frame the menu highlight returns: wide 861 px → 216 px between 274.32 and 275.07 s, and 216 → 861 px between 298.76 and 299.51 s. |

### B2. Per-turn table

How to read the columns:
- **Menu** runs from the menu appearing to the confirm. For FIGHT turns, the confirm is when the attack bar appears.
- **Enemy phase** runs from the end of the player's action to the frame the next menu appears.
- **Dlg** is the span from the first to the last speech bubble.
- **Atk** is the attack span after the last bubble.
- Box sizes are W x H in px at 960x720. "Sq" is the default 216x209 square, centred at x≈480.
- "Line" is a thin flickering yellow/red warning line, and "beam" is a thick white live hazard.

| # | Menu (s) | Act | Enemy phase (s) | Dlg | Atk start–end (len) | Box | Attack content | HP |
|---|---|---|---|---|---|---|---|---|
| 1 | 270.450–271.873 (1.42) | F→BLOCK | 274.134–298.761 (24.6) | 274.15–290.36, interleaved with attacks | 290.37–298.76 (8.4) | Sq | Dark-red heart pulse in the box. Flanking knives wind back, then lunge across the box (≈279–285). A white flash at 290.31 (4 fr) turns on the permanent red floor glow. Sets of vertical lines → thin vertical beams fired one after another (291.9–295.5), plus side knives. | 99→99 |
| 2 | 298.761–301.858 (3.10) | F→BLOCK | 303.951–322.669 (18.7) | 303.97–309.41 | 309.43–322.67 (13.2) | Wide 426x209 | Vertical knife pistons. A cyan knife sweep under a crosshair line. **4 crosshair beam volleys**, with beams at 316.893, 318.416, 319.956 and 321.430. | 99→99 |
| 3 | 322.669–325.967 (3.30) | F→BLOCK | 328.076–356.303 (28.2) | 328.09–342.39 | 342.41–356.30 (13.9) | Sq | **Aim-line slashes**: 12 slashes, one per second, ramping from 1 to 3 slashes at once (details in B3). | 99→75 |
| 4 | 356.303–358.497 (2.19) | F→BLOCK | 360.623–396.869 (36.3) | 360.64–377.95 | 377.97–396.87 (18.9) | 390→180→350 x209 | Knife "teeth" on the side walls while the box narrows and widens. A cloud of about 14 knives gathers around Chara (≈388.4–393, a buildup of about 2 s or more), then rains down into the box. | 75→51 |
| 5 | 396.869–399.665 (2.80) | F→BLOCK | 401.791–429.014 (27.2) | 401.81–413.75 | 413.76–429.01 (15.3) | Sq | Heart pulse, then vertical knife pillars. Then a **diagonal line lattice** (422.67–427.8): lines are added one by one until about 16 or more cross the box, and they fire one after another. | 51→51 |
| 6 | 429.014–432.563 (3.55) | F→BLOCK | 434.723–467.470 (32.7) | 434.74–448.22 | 448.23–467.47 (19.2) | Sq → 270x260 | Floor and ceiling knives. Then a larger box lined with knives, while knives fall from around Chara. | 51→39 |
| 7 | 467.470–469.463 (1.99) | F→BLOCK | 471.589–503.968 (32.4) | 471.61–487.71 | 487.73–503.97 (16.2) | ≈220x230 | Orange "!" spawn-warning squares inside the box. Knives circle outside. Crosshair beams at 491.95/492.11, ≈495.4 and ≈498.9. A big white flash at 503.0. | 39→27 |
| 8 | 503.968–507.500 (3.53) | F→BLOCK | 509.610–538.674 (29.1) | 509.63–516.29, spoken while the box is tiny | 516.31–538.67 (22.4) | **Tiny 80x40** under Chara, later 230x40 | Rhythmic vertical beam through the tiny box, **every 0.50 s, then every 0.40 s**, with no line warning. The box then widens. | 27→27 |
| 9 | 538.674–541.671 (3.00) | F→BLOCK | 543.764–578.085 (34.3) | 543.78–552.52 | 552.54–578.09 (25.6) | Tall 90x130 → **moves to the left edge** (centre x≈100) → Sq | Wall blades in a narrow box that slides across the screen, then a square with a grey heart. | 27→14 |
| 10 | 578.085–581.132 (3.05) | **ITEM** +41 | 581.149–595.647 (**14.50**) | none | 581.15–595.65 (14.5) | "Breathing" 330↔120–150 x230 | Horizontal knife pairs from both walls while the box narrows and widens repeatedly. | 55→55 |
| 11 | 595.647–598.309 (2.66) | F→BLOCK | 600.469–637.050 (36.6) | 600.49–619.20 | 619.22–637.05 (17.8) | Sq | Side knives. **Mirror phase** 623.89–632.55: the screen is flipped and greyed between two white flashes of 10–11 fr. | 55→31 |
| 12 | 637.050–638.825 (1.78) | F (MERCY hovered) →BLOCK | 641.001–686.405 (45.4) | 641.02–670.13 (**29.1 s**) | 670.15–686.41 (16.3) | Sq | Horizontal warning lines → horizontal beams fired one after another, plus grey hearts. Mirror phase 677.82–685.15. | 31→31 |
| 13 | 686.405–688.415 (2.01) | F→BLOCK | 690.524–733.517 (43.0) | 690.54–717.26 | 717.28–733.52 (16.2) | Sq | Yellow flower petals float up. L-shaped knife pairs cross the box. | 31→27 |
| 14 | 733.517–735.694 (2.18) | **ITEM** +40 | 735.711–750.209 (**14.50**) | none | (14.5) | Breathing box | Same attack as turn 10. | 67→67 |
| 15 | 750.209–752.754 (2.54) | F→BLOCK | 754.897–796.819 (41.9) | 754.91–780.56, with **"Special Attack" announced** | 780.58–796.82 (16.2) | 360x280 | Special attack: grey SOUL-hearts, large white orbs and sparks. | 67→67 |
| 16 | 796.819–799.983 (3.16) | F→BLOCK | 802.126–819.320 (17.2) | none | 802.14–819.32 (17.2) | Sq | **Beam grid**: 10 volleys **every 1.50 s**, each with 2 horizontal and 2 vertical beams, then cyan knife columns. | 67→52 |
| 17 | 819.320–821.513 (2.19) | F→BLOCK, **MERCY destroyed during this menu** | 822.468–850.996 (28.5) | 822.48–829.77 | 829.78–851.00 (21.2) | 420x209 | Half-orange, half-cyan knife fill. Teeth rows on top and bottom. A grey heart and a white orb. | 55→43 |
| 18 | 850.996–853.708 (2.71) | F→BLOCK | 855.851–873.665 (17.8) | none | (17.8) | 390x209 | Thrown orange and cyan knives. Mirror flashes 860.47–864.34 and 867.37–870.37, including one colour-inverted frame. **The heaviest damage turn.** | 43→**6** |
| 19 | 873.665–878.085 (4.42) | **ITEM** +41 | 878.101–889.268 (**11.17**) | none | (11.2) | Sq | Corner knife clusters attacking inward. | 47→34 |
| 20 | 889.268–890.825 (1.56) | F→BLOCK | 892.985–923.506 (30.5) | none | (30.5) | ≈230x220 | Knife rain from above Chara with shards. A big jagged red pixel slash at ≈915.0. Mirror phase 915.62–922.60. | 34→23 |
| 21 | 923.506–925.950 (2.44) | **ITEM** +59 | 925.967–940.482 (**14.52**) | none | (14.5) | Breathing box | Same attack as turns 10 and 14. | 82→≈83 |
| 22 | 940.482–944.031 (3.55) | F→BLOCK | 946.158–970.333 (24.2) | none | (24.2) | 120x200 → Sq | A narrow box with single knives, wall blades, knife combs from above and below, and orange/cyan knives. | 83→83 |
| 23 | 970.333–972.727 (2.39) | F→BLOCK | 974.887–996.066 (21.2) | none | (21.2) | Sq | A "!" marker, then **corner X**: 4 corner clusters of 3 knives each, plus a spinning double-ended blade. Red vertical lines at the end. | 83→59 |
| 24 | 996.066–1000.268 (4.20) | F→BLOCK | 1002.377–1029.566 (27.2) | none | (27.2) | Sq / 230x220 | Mirror phase 1004.04–1022.33 (18.3 s) with grey slashes and coloured lines. Then yellow X lines with grey hearts (1022.5–1024.6). | 59→34 |
| 25 | 1029.566–1040.850 (11.28) | **ITEM** (pie, to max) +65 | 1040.867–1052.017 (**11.15**) | none | (11.2) | Sq | Corner knife clusters, the same attack as turn 19. | 99→87 |
| 26 | 1052.017–≈1055.75 (≈3.7) | F→BLOCK | 1057.844–≈1098.9 | 1057.89–1063.74 | **Finale** 1063.85–1097.84 | — | See B6. | 87→34 |

After turn 26 no menu appears again. The defeated-Chara monologue runs inside the normal UI from about 1099 to about 1217 s, followed by a white flash at 1220.09 s.

### B3. Telegraphs: warning lines, slashes and beams

**What a warning looks like (it is the same across the whole fight).**
- The warning is a **1–2 px wide line** (2–4 px along a row on steep lines). Most warnings cross the whole screen.
- It **flickers between pure yellow (#FFFF00) and pure red (#FF0000) with a 10-frame period**, about **6 Hz**: roughly 5–6 frames yellow, then 4–5 frames red. This was measured on 5 different attacks and the median period was exactly 10 fr each time.
- About 1 s of warning is therefore about 6 colour cycles.
- Beams get a **pair of parallel lines** that marks the full beam width. Single slashes get one centre line.
- Chara's sprite raises the knife on the frame the hazard fires.

**What a live hazard looks like.**
- A thick white band, **20–40 px wide**, which is 10–18% of the 216 px box and about 1–1.6 SOUL widths.
- It grows over the first 2–3 frames (21 → 30 → 39 px), then thins to a hairline before it vanishes.
- The large-scale numbers (counts, not a chart):
  - Aim-line slash: the white surge lasts 15–20 fr.
  - Beams: 11–14 fr above the threshold.
  - "Full visible life including fade" is about 0.3 s for slashes and about 0.2 s for beams.

| Attack (instances measured) | Warning first visible → hazard live | Live time (white present) | Cadence and spacing | Notes |
|---|---|---|---|---|
| **Aim-line slash**, turn 3 (12) | 1st slash: line at 343.429 → slash at 344.400 = **0.971 s (58 fr)**. Later slashes ≈**0.90 s**: the next line appears about 2 frames after the previous slash fires (344.50 → 345.404). | **0.25–0.33 s** (15–20 fr, median 0.27 s). The band swings about 20–30° while it thins. | Onsets 344.400, 345.404, 346.392, 347.397, 348.451, 349.439, 350.393, 351.398, 352.402, 353.407, 354.395, 355.399. **Interval 1.00 s** (range 0.95–1.05). Free time between slashes is about 0.7 s. | The line is aimed through the SOUL's current position and rotates slowly as it tracks. From slash 8 onward, 2–3 lines and slashes fire together. **Peak: 3 live slashes plus 3 warnings on screen** (354.47, 355.42). Box 216 px, so a slash is about 12% of the box width. |
| **Crosshair beams**, turn 2 (4) | Yellow/red runs start at 316.005, 317.495, 319.019 and 320.509. Beams fire at 316.893, 318.416, 319.956 and 321.430. Leads **0.888 / 0.921 / 0.937 / 0.921 s** (mean 0.92 s = 55 fr). | 0.20–0.23 s at full strength, about 0.33 s including fade | Every **1.50 s** (1.52, 1.54, 1.47) | One horizontal and one vertical line, fixed where the SOUL was when they spawned. The horizontal beam fires about 4 fr before the vertical one. Two earlier warnings (313.0 and 314.55) cue cyan knife sweeps (lead about 0.77–0.89 s). |
| **Beam grid**, turn 16 (10) | Lines at 803.11 → beams at 804.119 = **1.01 s**. Next: 804.65 → 805.625 = **0.98 s** | **0.18–0.22 s** (11–13 fr) | Beams at 804.119, 805.625, 807.099, 808.605, 810.095, 811.602, 813.109, 814.616, 816.123, 817.613: **every 1.50 s** | Paired double lines. Each volley is 2 horizontal plus 2 vertical beams, about 40–80 px wide. Cyan "stand still" knife columns are left in the box after each volley. |
| **Finale horizontal beams** (≈7) | Line at 1068.78 → beam at 1069.747 = **0.97 s** | 0.25–0.32 s | 1069.75, 1070.77, 1071.72, then overlapping beams to 1074.95: **≈1.0 s** | The line sits on the SOUL's row. |
| **Finale vertical beams** (6) | Line at ≈1076.11 → beam at 1077.063 = **0.95 s** | 0.27–0.30 s | 1077.06, 1078.07, 1079.04, 1080.03, ≈1081.0, 1082.07: **≈1.0 s** | 20 px wide |
| **MERCY-button slash** (1) | Line over MERCY at **820.425** → slash at **821.430 = 1.005 s (60 fr)** | Visible about 0.37 s | — | Happens **during the player's menu** (see B4). |
| **Crosshair over knives**, turn 7 (3) | Crosshair at 491.28 → vertical beam at 491.95 (**0.67 s**), horizontal beam at 492.11 (**0.84 s**). The other two volleys had about 0.64–1.0 s of lead. | 0.13 s (4 game steps) | about 3.5 s apart | Mixed with orange "!" spawn squares and circling knives. |
| **Vertical-line beams**, turn 1 (6) | Line set at 291.88 → beams at 292.18 / 292.35 / 292.52 = **0.30 / 0.47 / 0.64 s**. Second set: 292.89 → 293.35 = 0.47 s | 0.10–0.17 s | The three beams fire 0.17 s apart, left to right through the shown lines | The **shortest warnings in the fight**, used once, as the first "real" attack. The beams are thin (about 20 px). |
| **Diagonal lattice**, turn 5 (≈16 lines) | First line at 422.67. Lines keep being added (about 1 every 0.07–0.1 s at first) until about 423.9. First fire at 424.63 = **≈2.0 s**. Later lines fire at 424.93, 425.20, 425.53, 426.60 and 426.97 | 0.10–0.30 s each | Sequential, about 0.3 s apart | Lines are yellow, orange and red. The longest warning in the fight, because the player has to read a whole lattice. |
| **Tiny-box rhythm beam**, turn 8 (16) | **No line warning.** The fixed position and steady rhythm are the warning, and Chara raises her knife each time. | 0.12–0.15 s (about 4 game steps), about 0.2 s with the thin tail | 522.97, 523.47, 523.98, 524.46 (**0.50 s**). Then 527.88 → 529.90 and 534.49 → 538.11 (**0.40 s**) | The vertical beam (29 px) covers part of an 80x40 box. |
| **Horizontal sweep beams**, turn 12 (≈6) | First line at ≈672.5 → first beam at ≈673.46 = **≈1.0 s** | about 0.1–0.15 s | about 0.2–0.4 s apart, staggered rows | Mixed with grey hearts, then the mirror phase. |

**Knife speeds** (tracked frame by frame):
- **Flanking lunge knife** (turn 1, box 216 px). The knife is 95 px long, which is 0.44 box widths. It winds back about 45–90 px over 2–4 frames, then moves **45 px per 2 frames, about 1,350 px/s = ≈6.2 bw/s**. It crosses the box in about 0.16 s. The hover/aim phase before the lunge is about 0.3–0.5 s.
- **Falling knife from the cloud** (turn 4, box 396 px): **27 px per frame, about 1,610 px/s = ≈4.1 bw/s, or 7.7 box-heights/s**. It crosses the 209 px box height in about 0.13 s. The warning is the cloud gathering for about 2 s.
- In general, knives that are thrown fast always have a visible pre-phase: hovering, gathering, or "!" squares about 0.3–2 s ahead. Knives that are slow or already in the box move along walls instead.

**Peak hazard counts.** These were estimated from frames, so treat them as about ±2:
- knife ring in the finale: about 28 knives;
- wall teeth (turn 17): about 30;
- knife cloud around Chara: about 14;
- corner X: 12 knives plus 1 spinning blade;
- lattice: about 16 lines;
- aim-slashes: 3 slashes plus 3 warnings at once.

### B4. Rival-player cues

**The BLOCK parry.** It happened on all 20 measured FIGHTs. The video gives no reason to think a well-timed press could get through.

The timeline below starts at **t0**, the frame the attack bar appears after FIGHT is confirmed (for example 301.858 s):
- The bar's cursor stays parked at the left edge and never moves.
- At **+0.10–0.14 s**, Chara snaps her knife overhead (a knife-raise sprite).
- From about +0.15 to +0.40 s she plays a short downward swing, during which the knife sprite becomes a red smear.
- From about **+0.40 s**, she holds a **guard pose with the knife horizontal across her body**.
- At **+0.64 s** (+0.62 to +0.70 across 20 instances), the **"BLOCK" label** appears.
- Over the next 2–3 game steps the label bobs: it pops up about 13 px, then settles about 25 px lower.
- The label stays on screen for **1.47–1.59 s (median 1.49 s, about 89 fr)**, exactly until the enemy phase starts. Dialogue or the box shrink then begins on the next frame.
- **Confirm → enemy phase takes 2.09–2.13 s** in total.

What the label looks like:
- light-grey pixel capitals with a dark outline;
- **≈234 x 30 px** at 960x720, which is about 24% of the screen width and about the width of the battle box;
- centred horizontally on Chara (x 363–596) and sitting 10–15 px above her hair (y ≈108–138 at rest).

What else the player sees during a BLOCK:
- no damage number, no enemy HP bar and no miss text;
- the battle bar stays visible behind the label the whole time;
- the FIGHT button stays highlighted.

**The announced special attack** (turn 15):
- The announcement bubble is visible from about 770.4 s, and the red-coloured words appear in it at about 770.4.
- The next bubble asks the player not to die and ends at **780.56**.
- The first special-attack hazards (grey hearts, then the white orb) appear at **780.58–781.6**.
- So it is **about 10 s from the announcement to the first hazard**: about 8 s of further speech, then about 1–2 s to the first visible hazard.
- The attack itself lasts 16.2 s.
- The next turn (16) has no dialogue and is the beam grid, the densest regular attack so far.

**MERCY removal** (in the player's menu at turn 17):
- The menu opens at 819.320.
- The player hovers MERCY at about 820.2–820.4.
- At **820.425** a flickering vertical warning line appears over the MERCY button. Meanwhile the cursor moves to ITEM and the flavour text types out.
- At **821.430 (+1.005 s)** a white slash cuts the button, and it bursts into particles over about 0.2–0.3 s.
- From **≈821.7** only FIGHT, ACT and ITEM remain, centred-left, for the rest of the fight.
- The player confirms FIGHT at 821.51, so this happened while the player was still choosing.
- This is the only hazard aimed at the UI.

**Other rival flavour.** The speech bubbles talk about saves, reloads and "playing through" the timeline. Turns 11, 12, 18, 20 and 24 contain **mirror phases**: the screen is flipped and greyed, opened and closed by **10-frame (0.17 s) white flashes**, and lasts 3.0–18.3 s.

### B5. Items, recovery and breathing room

**ITEM use** (5 times). The heal lands about 1.6–2.9 s after the menu opens.

| Menu | HP before → after | Item text after the heal | The attack that followed |
|---|---|---|---|
| 578.09 | 14 → 55 (+41) | 1.1 s | breathing-box knives, 14.50 s, no damage |
| 733.52 | 27 → 67 (+40) | 0.6 s | breathing-box knives, 14.50 s, no damage |
| 873.67 | **6** → 47 (+41) | 2.4 s | corner knives, 11.17 s, −13 |
| 923.51 | 23 → 82 (+59) | 0.6 s | breathing-box knives, 14.52 s, no damage |
| 1029.57 | 34 → **99** (pie, +65) | 8.4 s (long text) | corner knives, 11.15 s, −12 |

- **Each item turn is followed by one of two fixed, shorter, no-dialogue attacks (11.2 s or 14.5 s).** They are easier than the turns around them (−0 to −13 HP, compared with −12 to −37 on FIGHT turns), so healing buys a real breather.
- Items were used when HP was 6–34 out of 99. The heaviest FIGHT-turn damage was −37 (turn 18), and the typical damage was −12 to −24.

**Breathing room.**
- Within attacks:
  - aim-slashes leave about 0.7 s free per 1.0 s cycle;
  - crosshair beams and the beam grid leave about 1.3 s free per 1.5 s cycle;
  - finale beams leave about 0.7 s per 1.0 s cycle.
- Between attacks in the same phase there are short lulls of about 0.5–1.5 s: a heart pulse, a box resize, or knives retracting.
- Between turns there are:
  - the box resize (0.75 s each way);
  - the player's menu (median 2.7 s);
  - the BLOCK beat (2.1 s);
  - dialogue (up to 29 s in the first half, almost none after turn 15).
- Pacing therefore gets tighter in the second half. Enemy phases there are shorter (11–30 s) but almost entirely attack, and there are more mirror phases.

### B6. Finale

The finale runs from turn 26 to the end. Times are in seconds.

| Segment | From | To | Length | What happens / what is hidden |
|---|---|---|---|---|
| BLOCK and last dialogue | 1055.75 | 1063.74 | ≈8.0 | Normal UI. The last bubbles are one line each, ending with a "ready?" question. |
| **UI vanishes** | **1063.854** | — | — | On a single frame the HP bar, name/LV, buttons and red floor glow all disappear. **From here until 1097.84 the player cannot see their HP.** |
| Close-up cut-in | 1063.9 | ≈1066.8 | ≈2.9 | A giant zoomed Chara sprite raises the knife. A red knife smear appears. |
| Box alone | ≈1066.9 | ≈1068.5 | ≈1.6 | An empty box. A heart pulse at about 1068.0, then orange knife "teeth" appear on the walls (orange means you must move). |
| Horizontal beams | 1068.78 (first line) | ≈1075.0 | ≈6.2 | About 7 beams. 0.97 s warning, then a 1.0 s cadence that accelerates and overlaps at the end. |
| Orb transition | ≈1075.0 | ≈1076.1 | ≈1.1 | Two white orbs above and below the box. |
| Vertical beams | 1076.11 (first line) | ≈1082.3 | ≈6.2 | 6 beams. 0.95 s warning, 1.0 s cadence. A flash at 1082.2. |
| Knife ring | ≈1083.1 | ≈1096.3 | ≈13.2 | About 28 knives form a ring around the SOUL. From about 1088.5 to 1096.0, orange and cyan knives fly across the screen through the ring. |
| Cyan ring | ≈1096.4 | ≈1098.9 | ≈2.5 | The ring turns cyan ("hold still"). |
| UI returns | **1097.84** | ≈1099.0 | ≈1.1 | The HP bar shows 34, and Chara and the box are back to normal. |

- **UI-free time is 33.99 s (1063.854–1097.840).** The whole final turn, from FIGHT confirm to normal UI, is about 43 s.
- No menu follows. The ending monologue starts inside the normal UI.

---

## VIDEO A: "Love Maniac"

The uploader's black box and caption overlays sit over the enemy sprite and the top of the frame. Colour counts are noisier here because the background is red/pink line art. The menu state was taken from MERCY button brightness: about 36 when lit, about 9 when dimmed.

### A1. Per-turn table

FIGHT turns **land hits** in A: the sprite flashes and a damage number appears. There is no parry. Menu times include the attack bar, which takes about 1.3 s. HP figures come from the HP-bar fill.

| # | Menu (s) | Act | Enemy phase (s) | Box | Attack content | HP |
|---|---|---|---|---|---|---|
| 1 | 148.83–151.43 (2.6) | F (hit) | 151.43–163.48 (12.1) | Sq 220x210 | Knives appear around the walls, hover, then converge on the SOUL (≈400–650 px/s, about **1.8–3 bw/s**, accelerating) and bounce back out. | 99→57 |
| 2 | 163.48–165.00 (1.5) | F (hit) | 165.00–186.72 (21.7) | Small wide box for speech, then Sq | Speech about 169–173.5. **Line volleys** 175.17–186.03 (10 volleys). | 57→47 |
| 3 | 186.72–188.52 (1.8) | **ITEM** +40 | 188.52–201.78 (13.3) | Sq | Small square markers plus knives. **Star snipe** 194.1–199.3. | 87→87 |
| 4 | 201.78–203.25 (1.5) | F (hit) | 203.25–214.12 (10.9) | Sq | Knives stream past and through the box. | 87→87 |
| 5 | 214.12–216.12 (2.0) | F (hit) | 216.12–234.17 (18.1) | Sq | Speech about 220.5–225 (Flowey appears on the pedestal). Knives and markers. **Grey band** 228.67 → giant knife sweep 229.8. | 87→87 |
| 6 | 234.17–236.07 (1.9) | F (hit) | 236.07–254.38 (18.3) | **Short 220x110** | Knife pistons (staggered columns) about 239–253. Grey band at 242.9. | 87→36 |
| 7 | 254.38–255.58 (1.2) | **ITEM** +61 | 255.58–271.12 (15.5) | Short 220x110 | Knife combs above and below (guillotine rows). Grey band at 258.6. | 97→87 |
| 8 | 271.12–272.63 (1.5) | F (hit) | 272.63–288.90 (16.3) | Sq | **Line volleys** 275.65–288.18 (10). Grey band and jagged line about 278.6–280.5. | 87→77 |
| 9 | 288.90–290.58 (1.7) | F (hit) | 290.58–311.75 (21.2) | Sq | Speech about 296. Markers and knives. Grey band at 302.2. Star snipe about 305–307. | 77→77 |
| 10 | 311.75–313.12 (1.4) | F (hit) | 313.12–325.13 (12.0) | Sq | Knives. Grey band 319.7, jagged line 320.7. | 77→16 |
| 11 | 325.13–327.60 (2.5) | **ITEM** +61 | 327.60–341.53 (13.9) | Sq | **Line volleys** 328.27–340.88 (10); the later ones are red lines only, in X patterns. Grey band at 332.8. | 77→77 |
| 12 | 341.53–343.73 (2.2) | F (hit) | 343.73–360.50 | Wide speech box → **finale box ≈380x370** | Speech about 347–349. **Finale part 1** from 349.267. | 77→≈54 |
| — | 360.50–366.45 (5.95) | Normal screen returns, ACT highlighted | — | Wide box drawn with a gap in its top edge | Menu interlude inside the finale. | — |
| 13 | — | — | 366.45–377.2 | ≈380x370 | **Finale part 2**. Black at 377.2, "Continue?" at 377.5. | ≈54→≈45 |

Summary for A:
- Menus take **1.2–2.6 s**, including the attack bar.
- Enemy phases take **10.9–21.7 s** (median about 16 s).
- Dialogue is short and in only a few turns (bubbles of about 3–5 s).
- Item turns are followed by normal attacks of 13–15.5 s.
- The heaviest hits are −42 (turn 1), −51 (turn 6, pistons) and −61 (turn 10).

### A2. Telegraphs in A

**Line volleys** (30 volleys measured across 3 attacks):
- Each volley draws about 6–10 full-screen lines through the box. They start **thin red**, shift to **orange and yellow**, then turn **white (live)**. This is a "heating up" colour ramp, not a flicker. The lines are about 1–3 px wide.
- The first volley of each attack has a **1.12–1.17 s** warning.
- After that, the warning shrinks steadily from **0.85 s down to 0.58–0.62 s** across the 10 volleys.
- The **live white phase is 0.27–0.37 s** (median 0.30 s, 18 fr).
- After the white ends, there are 0.20–0.25 s of quiet before the next lines appear.
- The cycle period accelerates from **1.35 s to 1.15 s**.

| Attack | Leads (s), in volley order | Live (s) |
|---|---|---|
| 175–186 | 0.85, 0.82, 0.75, 0.73, 0.70, 0.67, 0.70, 0.63, 0.62 | 0.27–0.32 |
| 275–288 | 1.17, 0.85, 0.78, 0.77, 0.73, 0.67, 0.67, 0.63, 0.65, 0.62 | 0.28–0.37 |
| 328–341 | 1.12, 0.85, 0.77, 0.73, 0.73, 0.67, 0.67, 0.62, 0.62, 0.58 | 0.30–0.37 |

**Other telegraphs in A:**
- **Grey band then giant knife sweep** (7 times). A wide translucent grey diagonal band crosses the box for **≈1.1–1.2 s** (228.67 → 229.8). Then a giant red knife held in a hand sweeps, and a jagged white "tremor" line is left inside the box for **≈1.3–1.5 s**, fading by about 231.3.
- **Star snipe**:
  - 1–4 bright four-point stars appear one after another, about 0.25 s apart, beside the enemy (194.1–194.9).
  - Each star casts a red/yellow aim line to the SOUL.
  - The stars flare and fire about **1.4 s** after their lines appear, at 195.87, 196.33 and 196.80. The flares are about 0.47 s apart.
  - These were measured from a sheet sampled every 4 frames, so they are good to ±0.07 s.
- **Finale red band**:
  - A wide translucent red band appears at about 352.3 (±0.1).
  - A jagged red line becomes live inside it at **353.57**, which is about 1.2 s of warning.
  - The band fades, and the jagged line stays until about 354.7 (about 1.1 s).
  - The SOUL was hit at 353.6 (79 → 56).
  - The same pattern repeats at about 369.6–371.2.

### A3. Rival cues, items and finale in A

- **No rival-player defence.** Every FIGHT connects, with a white sprite flash and a red number. There is no enemy dodge, parry or item use. The phase cue is ACT changing the sprite and Flowey's reactions.
- **Items** (3): +40 at 186.7 (HP 47 → 87), +61 at 254.4 (36 → 97) and +61 at 325.1 (16 → 77). Each heal comes about 1.2–2.5 s after the menu opens. There is no lighter "reward" attack afterwards; the next attack is a normal 13–15.5 s one.
- **Finale**:
  - At **349.267** there is a hard cut. The background, enemy, Flowey and buttons all go black.
  - Only a large box of about 380x370 is left, with the HP bar moved under it. Inside is a dark swirling vortex, knives sit on the box edges, the SOUL has a pink trail, and the top edge of the box is open.
  - That lasts **11.2 s**.
  - Then the normal screen returns for **5.95 s** (360.50–366.45). It is an ACT menu with the box drawn open at the top.
  - Then a second box-only stretch of about **10.8 s** (366.45–377.2).
  - Then black, and "Continue?" at about 377.5.
  - **About 22 s of the finale is box-only.** Unlike B, the HP bar stays visible (moved under the box), but the buttons, enemy and background are hidden.

---

## Design takeaways for Aqua (reusable numbers)

These are measured from the references. Ranges show what each reference used. The bold value is a sensible default if Aqua should feel like B. At 30 Hz logic, 1 game step is about 33 ms.

1. **Warning line, then a white slash.**
   - **Warning lead.** Use **0.9–1.0 s for the standard slash or beam** (B: 0.89–1.01 s in 4 attack types and 30+ instances). Use 0.6–0.85 s for a tightening volley, as A ramps from 0.85 to 0.6 s within one attack. Use **0.3–0.65 s only for "fast" sequential beams** along lines that are already on screen. Use **≈2 s for a full lattice** of 15 or more lines. The very first instance of each attack can get +0.1–0.3 s (B 0.97 s, A 1.12–1.17 s).
   - **Live slash time: 0.25–0.33 s (8–10 game steps), default 0.27 s.** Beams: **0.18–0.23 s**. Tiny rhythmic beams: about 0.13 s.
   - **Cadence:** **1.0 s** for single aim-slashes (warning about 0.9 s overlapping the end of the previous slash). **1.5 s** for big beam volleys (1.0 s warning + 0.2 s beam + 0.3 s gap). A's line volleys run 1.35 → 1.15 s.
   - **Look:** a 1–2 px line flickering yellow/red at **6 Hz (10 fr per cycle)**. Beams are marked by two parallel lines at the beam's width. The live slash is a white band 20–40 px wide (about 10–18% of the box, 1–1.6 SOUL widths) that grows over 2–3 frames, swings or thins, and is gone by about 0.3 s. Chara's sprite pose (knife up) is synced to the fire frame.
   - **Peak load:** up to **3 live slashes plus 3 warnings** at once, or about 16 lattice lines.
2. **Knives.** Fast lunges move at **≈6 bw/s** (1,350 px/s against a 216 px box) after a 0.3–0.5 s hover and a 2–4 frame wind-back. Falling rain moves at **≈4 bw/s, or 7.7 box-heights/s**, after an approximately 2 s visible gather. Homing knives in A move at about 2–3 bw/s. Every fast knife needs a visible pre-phase: a hover, a gather, or a "!" square 0.3–2 s ahead.
3. **Parry callout (B's BLOCK).** Guard sprite at +0.1 s after the action. **Label at +0.64 s, held for ≈1.5 s (89 fr)**, with a small 13 px pop-up bob on entry. It is about box-width (24% of the screen) and sits just above the head. Hand over to the enemy phase on the frame it ends, so confirm → enemy phase is ≈2.1 s. The attack bar stays visible with its cursor frozen, which tells the player the hit never started. If Aqua parries **three times per exchange**, three 1.5 s labels would add 4.5 s, so a shorter callout of about **0.6–0.8 s per parry** with the same 0.64 s guard lead-in would keep each exchange near 2–3 s. This is an extrapolation, not something the references show.
4. **Turn rhythm.**
   - Player menu: about 1.5–3 s (median 2.7 s in B).
   - Box resize: **0.75 s** each way.
   - Enemy phase: **11–45 s** (median 27 s), of which pure attack is **8–30 s (median 16 s)**.
   - Dialogue is front-loaded: 5–29 s per turn in the first half, about 0 in the second half.
   - A's turns are tighter: 11–22 s enemy phases and short speech.
5. **Item and recovery.**
   - Heals in B are about 40–65 HP out of 99 and land about 2 s after the menu opens. Item text is held 0.6–2.4 s (8.4 s for the flagship pie).
   - B follows **every heal with a fixed, shorter, no-dialogue attack (11.2 s or 14.5 s) that does little damage (0–13 HP)**. This is a deliberate breather and a good model for Aqua "spending" a turn or item.
   - Typical damage per FIGHT-turn attack is 12–37 HP out of 99.
6. **Breathing room inside attacks.** About 0.7 s free per 1 s slash cycle. About 1.3 s free per 1.5 s beam cycle. Lulls of 0.5–1.5 s between sub-patterns, such as a heart pulse or a box resize.
7. **UI as a target.** B shows MERCY getting a standard **1.0 s** warning line and slash *during the player's menu*. That is a clean model for Aqua cutting a button or spending TP visibly. After it, the remaining buttons simply re-centre.
8. **Special-attack announcement.** About **10 s** from the announcement to the first hazard in B (about 8 s of speech plus about 1–2 s). A tighter version, such as a 2–3 s callout, then a 0.75 s box resize, then a 1 s first warning, would keep the cue legible without the long monologue.
9. **Finale pacing (B).**
   - About 6 s of dialogue.
   - **Hard-cut UI removal on a single frame.**
   - About 3 s close-up cut-in.
   - About 1.6 s of empty box.
   - About 6 s of horizontal beams (1 s cadence, 0.95–0.97 s warnings).
   - About 1 s transition.
   - About 6 s of vertical beams.
   - About 13 s knife ring with crossing coloured knives.
   - About 2.5 s cyan "hold still" ring.
   - The UI returns about 1 s later.
   - **About 34 s with no UI, HP hidden.**
   - A splits about 22 s of box-only finale into 11.2 s and 10.8 s halves around a 6 s menu interlude, and keeps the HP bar visible.
10. **Phase punctuation.** Use 10-frame (0.17 s) white flashes to open and close "mirror" or flashback segments, 3–18 s long. Use a single 4-frame flash to switch on a persistent visual change; in B that is the red floor glow at 290.31.

Uncertainty summary:
- Hazard onsets are good to about ±1 frame, and warning onsets to ±1–2 frames. Values marked ≈ are about ±0.1 s.
- Peak hazard counts are about ±2.
- A's star-snipe timings are good to about ±0.07 s.
- HP values are read from the bar fill and are good to about ±2 HP.
- The claim that B's parry is automatic rests on the cursor never moving in the frames inspected (3 turns checked closely) and on the constant 0.64 s label lead in all 20 instances.
