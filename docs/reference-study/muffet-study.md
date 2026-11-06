# Muffet: timing, micro-pacing and look and feel (references vs. "MUFFET — The Dark Nest")

**Compared**
- **UT**: `dl/files/muffet-undertale.mp4`. The original Undertale Muffet fight (pacifist, LV 1). 1280×720, 29.929 fps, 399 s, 11 942 frames. The game area is the centre 960×720 at 1.5× scale.
- **US**: `dl/files/muffet-underswap.mp4`. The Muffet fight from TS!Underswap (fan game). 1280×720, 30 fps, 706 s. The game area is about x 212–1068, and the frame is decorated.
- **KQ**: `dl/files/killerqueen.mp4`. A fan-made Deltarune video. Only the "GIGA QUEEN" boss fight is studied (§7). 640×360, 30 fps nominal, but about **53 % of frames are duplicates**, so the effective rate is ~15 fps.
- **Ours**: `games/muffet.html`, all attack families in `MuffetGame`. I tested it on a copy with `window.__game` exposed. The shipped file was not touched.

**How the numbers were made**
- Every frame of UT and US was decoded and scanned automatically (`scripts/feat.py`). Per frame, it found:
  - the box (the white run through the centre column),
  - the purple and red SOUL position,
  - purple string rows and columns,
  - white hazard blobs.

  Dialogue bubbles were found on a 160×90 downscale.
- Turn boundaries come from box-width state changes:
  - menu box (UT 862 px wide, US 760 px wide) → small box → menu box.
  - "Attack start" = first frame after the last speech-bubble frame.
  - "Attack end" = the last frame before the box starts growing back. UT always regrows in 10 frames (0.33 s); US in 9 frames.
- Hazards were followed by a nearest-neighbour tracker (`scripts/track.py`, `scripts/pace.py`). I checked identities by eye on frame sheets (`sheets/`).
- **Ours** was measured two ways:
  - Headless event logging on a virtual 60 fps clock (`scripts/ours-sim.js`): 33 scenarios. Seth was either still or random-walking, in god mode.
  - Canvas captures at chosen live times (`scripts/ours-cap.js`, frames in `ours/`).

**Units**
- 1 gf = 1/30 s.
- "bw/s" = box widths per second, using each fight's own attack box:
  - UT: 366 px.
  - US: 361 px (purple) and 201 px (small red box).
  - Ours: 480 px for NORMAL, 708 px for the full web.
- Times inside a turn are seconds from attack start. Ours uses `liveAge`, which is time after the warm-up.

**Uncertainty**
- Turn edges are exact to ±1 gf (UT/US) where marked with a frame number.
- On pet turns the box moves, tilts and changes shape, so the box tracker fails there. Those numbers come from sheets and are marked **≈** (±0.3 s).
- US red-SOUL turns and pet turns had cluttered hazard tracks, and many hazards were mis-classed. Counts there are **≈**.
- In the US video the player hops between strings constantly, so its switch counts overstate what the attacks require.
- KQ is low-resolution at ~15 effective fps. Its times are ±0.07–0.1 s, and its sprite descriptions are approximate.

---

## 0. Short version

Key numbers, references vs. ours:

| | UT | US | Ours |
|---|---|---|---|
| Normal attack length | 5.0–9.0 s (median 6.05) | 4.9–10.7 s (median ~6.9) | 10 / 11 / 12 s + 1.15 s warm-up (kept; designer rule) |
| Climax ("pet") turns | 18–19 s of attack (+2.9–4.4 s staged exit) every ~5–6 turns | 13.4–17.5 s every ~6 turns | chase 16 s + 1.8 s (T10/30/50); SIT TIGHT 15 + 1.8 s (T20/40) |
| Spawn-to-spawn interval | 0.27–0.67 s, usually **swung** (0.27/0.53, 0.33/0.67, 0.47/0.33); some turns metronomic (0.30, 0.33, 0.60) | 0.87–1.07 s single spiders; pet volleys every ~1.0 s | spider **pairs** every 0.80 / 0.73 / 0.67 / 0.53 s, CV = 0.00 in every family |
| Spider speed | 0.98–1.47 bw/s (crosses a string in 0.57–0.85 s); one slow turn at 0.61 | 0.53–0.62 bw/s (crossing ≈1.5–1.7 s) | 0.62 → 0.86 bw/s (crossing 1.49 → 1.08 s); web 0.46–0.62 |
| Entry lead (visible before reaching the box interior) | 0.30–0.50 s walking in **from outside the box** | ~0.33–0.4 s at the string end | 0.45 s ghost (38 % alpha) **standing still inside the box** |
| String switch | 3 gf (0.10 s); next switch possible at once (observed min gap 0.16–0.20 s) | 3 gf (0.10 s) | 0.17 s hop + 0.20 s cooldown (≤ 5 switches/s) |
| Required dodges | performed switches every 0.41–0.77 s (normal turns), 0.16–0.3 s at the pet climax | similar (noisy) | stationary-SOUL hits every ~1.0–1.75 s (T3), ~1.0–1.2 s (T47) |
| Rests and finishers | 0.6–1.4 s rests; finisher volleys (triple, double-double); 0.8–1.8 s quiet tail | 1.6–1.9 s rests; speed-up finisher | none; spawning stops at duration − 1.3 s, and the last spiders are deleted mid-string when the turn ends |

The main gaps, most important first:
1. **Metronome instead of phrases.** Every family uses one fixed interval for the whole turn: spiders, donuts, pours, pets, grabs, smashes, sweat and slams (0.92 s × 12). The references build turns from:
   - same-side trains,
   - swung pairs,
   - doubles and lane staircases,
   - 0.6–1.9 s rests,
   - a finisher volley.
2. **Hazards appear out of nowhere.** Our spiders fade in, stationary, at the box's edge node. Reference spiders and pastries **travel in from outside the box** for 0.3–0.5 s, along the string line or from the pet or utensil that throws them. Our six hands already grip the box at exactly the three lane heights, but no hazard comes out of them.
3. **No staged ending.** Turns drain for 1.3 s and then delete the hazards still in flight (`menu()` sets `bullets=[]`). UT ends normal turns with a finisher and a 0.8–1.8 s clean tail before the box regrows over 0.33 s.
4. **The pet is a stomp loop, not the set piece.** In both references the pet turn is the 15–19 s climax:
   - first the box is tugged, slid or tilted;
   - then the pet is revealed at the box's edge;
   - then the box becomes a tall scrolling strip;
   - then density bursts to 5–8 entries per second and the player climbs continuously.

   Our `pet` is a normal 10 s family of six identical aimed stomps, 1.7 s apart. Our real climaxes (chase, SIT TIGHT) are flat after their first 2.5–4.3 s.
5. **Switching strings feels sluggish.** The reference SOUL snaps to the next string in 0.10 s and can chain switches. Ours takes 0.17 s and then locks for 0.2 s. During the reference climax players switch every 0.16–0.3 s; ours cannot go much faster than 0.2 s.
6. **Small hazards in a wide box.**
   - Our spider is drawn about 21 px in a 480×154 box: 4.3 % of the width and 13.5 % of the height.
   - UT spiders are 9.6 % × 8.7 % of the box, and US spiders 12.5 % × 14 %.
   - Our box is 62.5 % of the canvas width, against 38–42 % in UT and US.

What we do as well as or better than the references:
- Telegraphs for hands and body attacks:
  - grab 0.88 / 1.15 s with a closing-ring timer and a tether to the hand;
  - smash 1.08 s;
  - hip 1.05 s with a direction arrow;
  - knot closure 1.1 s in amber.
- The milestone warm-up: a purple tea wash plus the lower hands counting down from FIVE or THREE fingers to zero. This is our equivalent of the US tea-pour transformation turns, and it is tighter (1.8 s instead of 5.2 s).
- Hurt feedback: red edge glow (0.34 s), about 2.5 px of trauma shake, a pink ring, and a 0.9 s blink at 9 Hz. Neither UT nor US shows any visible screen effect on a hit (not measured; inferred from sheets).
- SIT TIGHT's physical compression and body staging.
- The chase ring-close opening.
- Hip and box translation that carries hazards along with the box.

---

## 1. Per-turn tables (references)

Columns:
- **Enemy start**: the box leaves menu size.
- **Attack start**: the bubble closes.
- **Attack end**: the box starts to regrow.
- **Menu**: the menu box is back.
- **Talk**: from enemy start to attack start.
- **Player turn**: from menu back to the next enemy start. It depends on the player and is listed for completeness.

### 1a. Undertale (frames at 29.929 fps)

| # | Enemy start | Attack start | Attack end | Menu | Talk | Attack | Attack identity | SOUL / strings | Box (px) | Player turn |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 65.99 (f1975) | 78.65 (f2354) | 79.02 | 79.02 (f2365) | 12.66 | — | Tea pour: the box fills with purple liquid and the red SOUL turns purple; then 3 strings appear and Muffet talks. No hazards. | red → purple, H3 | 366×208 | 9.26 |
| 2 | 88.28 (f2642) | 90.11 (f2697) | 95.13 (f2847) | 95.46 | 1.84 | 5.01 | Spiders: same-lane pairs | purple, H3 | 366×208 | 3.68 |
| 3 | 99.13 (f2967) | 102.34 (f3063) | 108.36 (f3243) | 108.69 | 3.21 | 6.01 | Spiders: swung pairs, side trains | H3 | 366×208 | 8.65 |
| 4 | 117.34 (f3512) | 119.42 (f3574) | 125.43 (f3754) | 125.76 | 2.07 | 6.01 | Spiders: doubles and singles, double-double finisher | H3 | 366×208 | 3.58 |
| 5 | 129.34 (f3871) | 131.81 (f3945) | 138.16 (f4135) | 138.49 | 2.47 | 6.35 | Spiders, then bouncing donuts | H3 | 366×208 | 3.41 |
| 6 | 141.90 (f4247) | 147.62 (f4418) | ≈168.3 | 168.67 (f5048) | 5.71 | ≈20.7 | **PET 1**: box tugged side to side, spider stream, pet reveal, tall tilting box, spiders drop from the top | H3 → tall, many strings | 366×208 → ≈330×≈420 tilted | 2.94 |
| 7 | 171.61 (f5136) | 174.25 (f5215) | 179.93 (f5385) | 180.26 | 2.64 | 5.68 | Spider and donut pairs | H3 | 366×208 | 3.64 |
| 8 | 183.90 (f5504) | 186.27 (f5575) | 191.99 (f5746) | 192.32 | 2.37 | 5.71 | Spiders: metronomic 0.334 s, sides alternate | H3 | 366×208 | 2.74 |
| 9 | 195.06 (f5838) | 197.00 (f5896) | 204.38 (f6117) | 204.72 | 1.94 | 7.38 | Opening donut volley, swung spiders, a croissant | H3 | 366×208 | 3.07 |
| 10 | 207.79 (f6219) | 210.57 (f6302) | 216.95 (f6493) | 217.28 | 2.77 | 6.38 | Croissants (boomerang): pair / single call and response | H3 | 366×208 | 4.64 |
| 11 | 221.93 (f6642) | 224.26 (f6712) | ≈246.3 | 246.65 (f7382) | 2.34 | ≈22.0 | **PET 2** (same staging as 6) | H3 → tall | as 6 | 2.37 |
| 12 | 249.02 (f7453) | 252.16 (f7547) | 258.21 (f7728) | 258.55 | 3.14 | 6.05 | Spiders: metronomic 0.30 s, alternating; **triple finisher** | H3 | 366×208 | 3.21 |
| 13 | 261.75 (f7834) | 264.66 (f7921) | 270.71 (f8102) | 271.04 | 2.91 | 6.05 | Donuts, slowing down, doubles at the end | H3 | 366×208 | 3.01 |
| 14 | 274.05 (f8202) | 277.82 (f8315) | 286.85 (f8585) | 287.18 | 3.78 | 9.02 | Croissants: metronomic 0.60 s, side trains of 3 | H3 | 366×208 | 4.28 |
| 15 | 291.46 (f8723) | 294.40 (f8811) | 301.45 (f9022) | 301.78 | 2.94 | 7.05 | Slow, dense spiders (0.61 bw/s): double + single | H3 | 366×208 | 7.18 |
| 16 | 308.96 (f9247) | 313.64 (f9387) | 321.33 (f9617) | 321.66 | 4.68 | 7.68 | Mix: volleys of 4, rests of 1.37 s, finisher | H3 | 366×208 | 4.34 |
| 17 | 326.00 (f9757) | 328.41 (f9829) | ≈347.7–352.0 | (ending talk to 383.7) | 2.41 | ≈19–23.7 | **PET 3**, then the fight ends in dialogue | H3 → tall | as 6 | — |

Summary for UT:
- Normal attack: median 6.05 s.
- Talk before the attack: 1.8–4.7 s (median ≈2.8).
- Player turn: median 3.6 s.
- The box regrows in 0.33 s.
- About 0.37 s passes between the bubble closing and the first hazard.

### 1b. Underswap (30 fps)

| # | Enemy start | Attack start | Attack end | Menu | Talk | Attack | Attack identity | SOUL / layout | Box | Player turn |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 137.07 (f4112) | 142.70 (f4281) | 149.33 (f4480) | 149.83 | 5.63 | 6.63 | Two kitchen utensils swing through the box (one hot-coloured) | red, free | 201×185 | 8.40 |
| 2 | 158.23 (f4747) | 165.50 (f4965) | 171.37 (f5141) | 172.63 | 7.27 | 5.87 | A pan beside the box flips small food items up and in | red | 201×185 | 4.43 |
| 3 | 177.07 (f5312) | ≈186.0 | ≈188.5 | 196.43 | — | — | Tea pour turns the SOUL purple (≈2.5 s), then talk. No hazards. | → purple, H3 | 201×185 | 6.73 |
| 4 | 203.17 (f6095) | 216.10 (f6483) | 226.13 (f6784) | 226.43 | 12.93 | 10.03 | Spiders on 3 strings: staircase lanes, speed-up finisher | purple, H3 | 361×185 | 3.47 |
| 5 | 229.90 (f6897) | 248.50 (f7455) | ≈261.9 | 263.33 | 18.60 | ≈13.4 | **PET 1** (from the right): wide strip tilted ~8–12°, pet at the right end, spider/pastry volleys | H3 | ≈650×95 tilted | 7.43 |
| 6 | 270.77 (f8123) | 270.77 | 275.93 | 276.37 | 0 | 5.17 | Pour back to red (armour re-equipped). No hazards. | → red | 201×185 | 6.60 |
| 7 | 282.97 (f8489) | 295.67 (f8870) | 302.37 (f9071) | 302.67 | 12.70 | 6.70 | Spiders rappel down on threads from the box top | red, free | 361×185 | 8.67 |
| 8 | 311.33 (f9340) | 317.40 (f9522) | 324.10 (f9723) | 324.40 | 6.07 | 6.70 | Two shakers above the box sprinkle particles | red | 361×185 | 4.13 |
| 9 | 328.53 (f9856) | 328.53 | 333.73 | 334.13 | 0 | 5.20 | Pour back to purple | → purple | 201×185 | 2.77 |
| 10 | 336.90 (f10107) | 344.10 (f10323) | 354.13 (f10624) | 354.43 | 7.20 | 10.03 | Spiders on 3 strings: burst, rest, final pair | H3 | 361×185 | 12.53 |
| 11 | 366.97 (f11009) | 379.13 (f11374) | ≈394.5 | 395.30 | 12.17 | ≈15.4 | **PET 2** (from the left), tilted strip | H3 | ≈650×95 tilted | 3.43 |
| 12 | 398.73 (f11962) | 398.73 | 403.90 | 404.33 | 0 | 5.17 | Pour back to red | → red | 201×185 | 5.90 |
| 13 | 410.23 (f12307) | 433.27 (f12998) | 440.27 (f13208) | 440.40 | 23.03 | 7.00 | A purple web frame with nodes appears around the box; spiders crawl the radial lines inside | red | 201×185 + web | 7.87 |
| 14 | 448.27 (f13448) | 458.60 (f13758) | ≈465.0 | 465.73 | 10.33 | ≈6.4 | Two ovens flank the box, which turns slowly; ball volleys every 1.33 s | red | 201×185 rotating | 5.03 |
| 15 | 470.77 (f14123) | 470.77 | 475.93 | 476.37 | 0 | 5.17 | Pour back to purple | → purple | 201×185 | 4.73 |
| 16 | 481.10 (f14433) | 486.70 (f14601) | 497.40 (f14922) | 497.70 | 5.60 | 10.70 | Rolling pins sweep lanes (pincer pairs), plus spiders | H3 | 361×185 | 6.87 |
| 17 | 504.57 (f15137) | 514.40 (f15432) | ≈529.8 | 530.60 | 9.83 | ≈15.4 | **PET 3**: box rotates into a tall vertical strip with the pet at the top; at the end it rotates to horizontal with the pet at the side | rotated H3 | ≈130×400 → horizontal | 10.50 |
| 18 | 541.10 (f16233) | 548.17 (f16445) | 556.20 (f16686) | 556.50 | 7.07 | 8.03 | Spinning star-blades with smoke trails, plus spiders | H3 | 361×185 | 4.87 |
| 19 | 561.37 (f16841) | 566.57 (f16997) | ≈584.0 | 584.80 | 5.20 | ≈17.5 | **PET 4 (final)**: tall vertical strip with the pet at the bottom; star-blades from the sides; rotates out | rotated H3 | tall | (ending) |

Summary for US:
- Hazard attacks: median ≈6.9 s.
- Pet turns: 13.4–17.5 s.
- Pour turns: 5.2 s.
- Talk is long, 5–23 s, because of the captive party banter.
- Player turn: median ≈6 s.

US addition: a hanging signboard over the arena shows an **"upcoming attack" icon during the player's menu**, and a "now serving" variant. It works as a full-player-turn telegraph of the next attack.

### 1c. Ours: turn schedule (from code; enemy turn = warm-up + `waveDuration`)

| Turns | Family | Layout and box | Warm-up | Live attack | Enemy turn |
|---|---|---|---|---|---|
| 1–4 | adaptive (spiders, pet, whiteTea, grab, denyRescue, boxSpin, hipBump, handSmash, greenTea) | horizontal, **3 lanes**, 480×154 | 1.15 | 10 (hip 11.8) | 11.15 (12.95) |
| 5 | rethread | horizontal, **5 lanes** | 1.8 + tea wash | 10 | 11.8 |
| 6–9 | adaptive | horizontal, 5 lanes | 1.15 | 10 | 11.15 |
| 10 | chase | full web 708×426 | 1.8 | 16 | 17.8 |
| 11–14 | adaptive (no boxSpin on web) | web | 1.15 | 10 | 11.15 |
| 15 | rethread | vertical, 4 lanes | 1.8 | 10 | 11.8 |
| 16–19 | adaptive | vertical | 1.15 | 10 | 11.15 |
| 20 | SIT TIGHT | 400×154, lanes drop | 1.8 | 15 | 16.8 |
| 21–24 | adaptive | horizontal | 1.15 | 11 | 12.15 |
| 25–29 | rethread / adaptive | grid 5×5, 480×154 | 1.8 / 1.15 | 11 | 12.8 / 12.15 |
| 30 | chase | web | 1.8 | 16 | 17.8 |
| 31–34 | adaptive | web | 1.15 | 11 | 12.15 |
| 35–39 | rethread / adaptive | vertical, 6 lanes | | 11 | |
| 40 | SIT TIGHT (smaller still) | 376×154 | 1.8 | 15 | 16.8 |
| 41–44 | adaptive | grid 6×6 with gaps | 1.15 | 12 | 13.15 |
| 45–49 | rethread / adaptive | horizontal, 6 lanes | | 12 | 13.15 |
| 50 | tea speech (2.2 s drink) + chase | web | 1.8 | 16 | 17.8 + 2.2 |
| 51–59 | silence; rethread at 55 | web | | 12 | 13.15 / 13.8 |
| 60 | fatal SIT TIGHT | sealed | 1.8 | crush on the 7th landing at live ≈7.97 s | ≈9.8 |

- Our player turn is an untimed menu plus barks.
- Our "talk" is a bark page that the player advances (43 chars/s).
- Our turns are 1.6–1.9× the reference normal attack length. Per the designer's rule they stay as they are; the proposals below re-pace their *insides*.

---

## 2. Micro-pacing per attack

### 2a. UT normal turns (tracked; t = seconds from attack start)

| Turn | Hazards | Spawn-to-spawn (mean, min–max) | First half → second half | Side sequence | Speed (bw/s) | Switches performed (gap) | Peak entries/s | Tail rest |
|---|---|---|---|---|---|---|---|---|
| 2 | 7 spiders | 0.55 (0.33–0.97): **0.33 / 0.67 pairs** on the same lane | 0.45 → 0.66 | RRRR LLL | 0.98 | 2 | 2 | 0.83 |
| 3 | 13 spiders | 0.39 (0.27–0.54): **0.27 / 0.53 swing** | 0.37 → 0.41 | RRRR LLLLL RRRR | 0.98 | 0.56 (0.20–1.14) | 3 | 0.90 |
| 4 | 14 spiders | 0.43 (0.13–0.54): doubles (2 lanes at once); ends with a double, then 0.13 s later another double | 0.47 → **0.39** | R×6 LL R×6 | 1.10 | 0.52 (0.37–0.60) | 4 | 1.80 |
| 5 | 9 spiders + 3 donuts | 0.49: spider triplet at 0.27 → doubles at 0.43 → donuts at 0.67 | 0.38 → 0.60 | RRR then L×9 | 1.10 / 1.14 | 0.44 (0.20–0.70) | 5 | 1.74 |
| 7 | 8 spiders + 8 donuts | 0.62: pairs alternating 0.50 / 0.70; lone finisher after a 1.34 s rest | 0.60 → 0.64 | mixed | 1.15 / 0.65 | 0.75 | 4 | 0.37 |
| 8 | 12 spiders | **0.334, constant** | — | **RLRL…** | 1.42 | 0.68 | 3 | 1.34 |
| 9 | 5 donuts, 6 spiders, 1 croissant | 0.42: opening volley of 4 donuts in 0.1 s, then a 0.27 / 0.47 swing | 0.38 → 0.47 | RR LLL RLRLRLL | 0.82 / 1.47 / 1.36 | 0.45 (0.23–0.80) | 4 | 3.3 (croissants return) |
| 10 | 6 croissants | pair (top + bottom) → single (middle): 1.03 / 0.67 | | LLL RRR | 1.41 inbound, then they arc back | 0.77 | 3 | 2.9 |
| 12 | 15 spiders | **0.30 constant**, then a 0.60 rest and a **triple at once** | 0.30 → 0.35 | RLRL… | 1.47 | 0.66 | 4 | 1.40 |
| 13 | 9 donuts | 0.30, 0.40, 0.70, 0.70, 1.03, 0.70 (slowing), doubles at the end | 0.47 → 0.81 | mixed | 1.09 | 0.70 | 3 | 1.50 |
| 14 | 9 croissants | 0.60 constant; lanes cycle top / bottom / middle | | LLL RRR LLL | 1.41 | 0.73 | 2 | 3.5 |
| 15 | 15 spiders | 0.47 / 0.33 swing: a double (2 lanes), then a single | | (RR L)×5 | **0.61** (slow, long lead 0.68) | 0.41 | 5 | 2.5 |
| 16 | 4 donuts, 7 spiders, 4 croissants | volleys of 4 at 0.37 and 1.74, rests of 1.37 s, finisher pair at 4.6 | 1.01 → 0.40 | mixed | 0.77–1.35 | — | 6 | 2.5 |

Rhythm shape in UT:
- Most turns are **swung pulses**: a short gap then a long gap, about 1:2.
- Hazards come in **side trains** of 3–6 from one side before switching.
- Lanes rotate without repeating more than twice.
- Some turns are deliberately metronomic (T8, T12, T14). Even those alternate sides or lanes on every spawn, and T12 ends on a triple.
- After the last entry there is always a 0.4–1.8 s clean tail before the box regrows (longer for returning croissants).

**UT pet turns (≈, from sheets plus partial tracks):**

| Phase | Time from attack start | What happens |
|---|---|---|
| A | 0 – ≈3.2 | No hazards. The box slides left and right (≈0.5 s per swing), as if tugged by something off-screen. |
| B | ≈3.2 – 7.3 | Spiders stream in from the right every 0.20–0.43 s, often in pairs, while the box keeps sliding. |
| C | ≈7.3 – 8.4 | Rest. |
| D | ≈8.4 – 10.5 | The pet's toothed head rises at the box's right edge. A volley of about 9 objects arrives within 0.15 s. |
| E | ≈10.5 – 11 | The box stretches tall (≈2× its height) and tilts ±3–5°. The pet now sits at the bottom of the box. |
| F | ≈13 – 20.5 | Spiders queue visibly on the box's top edge and drop in bursts of 3–4. Spawn gaps are 0.1–0.6 s, and peak entries reach 7–8 per second. The player climbs strings continuously, switching every 0.16–0.3 s (5–6 switches/s), until the turn cuts. |

In phases D–F there are long gaps of about 1.0 s with single drops, which work as breathers.

### 2b. US

- **T4 spiders.** 10 spiders, one every 0.99 s (0.87–1.07). Lanes form a **staircase**: bottom, middle, top; R×3 then L×3. The last three arrive faster (0.96 → 1.35 bw/s). Speed is 0.62 bw/s on the 361 px box. Tail 1.7 s.
- **T10 spiders.** 7 spiders. Three come quickly (0.67 s apart) down the staircase, then a **1.9 s rest**, then 1.67 s gaps, then a final **pair 0.33 s apart**. Tail 2.7 s.
- **T16 rolling pins.** Pincer pairs (L and R at the same moment on the same lane), stepping top → middle → bottom every 0.67 s. Then a top-edge trio, then **rests of 1.67 s**. The pins are visible 0.65 s before entry.
- **T18 star-blades.** Gaps of 0.1–1.3 s; peak 3 entries/s.
- **Red turns.**
  - Utensil swipes every ≈0.57–0.73 s.
  - Oven volleys every **1.33 s, constant** (0.90, 2.23, 3.53, 4.87, 6.20 s), each 10–15 balls.
  - Shaker particles at irregular 0.4–1.1 s intervals.
- **Pet turns (≈).** Volleys of 4–8 objects on a **≈1.03 s pulse**: 0.87, 1.93, 2.97, 4.00, 5.07, 6.10, 7.17, 8.20, 9.27, 10.3, 11.3, 12.4, 13.4 s. Each pulse is answered by single stragglers 0.1–0.3 s later. The final pet adds side star-blades and ends with a rotate-out.

### 2c. Ours (event logs, 60 fps; base pattern without the anti-camp responses)

| Family (variant) | Spawn-to-spawn | Rhythm | Telegraph / speed | Stationary-SOUL hits (required dodges) |
|---|---|---|---|---|
| spiders T1–9 (all 3 variants) | pairs every **0.817 s**, CV 0.00; 11 beats, last at 8.13 | one spider from each side per beat on adjacent lanes; v2 adds a donut every 2.45 s | ghost 0.45 s; 300 px/s = **0.62 bw/s**, crossing 1.49 s | every 1.04–1.75 s (7 per 10 s) |
| spiders T10–19 | pairs / 0.733 s | same | 328 px/s (0.46 bw/s on web, 0.68 vertical) | ~6 per 10 s |
| spiders T20–29 (grid) | pairs / 0.667 s | same | 356 px/s, 0.74 bw/s | 9 per 11 s |
| spiders T40+ | pairs / **0.533 s** | same; donut every 1.60 s | 412 px/s, 0.86 bw/s | 10 per 12 s |
| pet | 1 stomp + 2 donuts every **1.717 s** (T3) → 1.383 (T47) | identical beats ×6–8 | stomp warning 1.05 s, live 0.3; donuts 0.61–0.79 bw/s | every ~1.4–1.7 s |
| whiteTea | stream + 3–5 drops every **1.117 s** (T3) → 0.783 (T47) | identical | stream line 0.8 s, then 0.75 s live; drops 300–412 px/s down (1.9–2.7 box-heights/s) | every ~1.1–1.6 s |
| grab | 1 grab + 1 spider every **1.667 s** (T3) → 1.27 (T47) | identical; v1 also grabs Aqua | warning 0.88 s (v1: 1.15) + 0.22 s live | every 1.67 s if stationary |
| handSmash | 1 smash + 1 spider every **1.717 s** → 1.31 | identical | 1.08 s + 0.18 s | same |
| hipBump | hip every **2.50 s** (4 per turn) + spider pairs every 0.967 s | two metronomes | 1.05 s warning; box thrown ≤ 76 px | every 1–2.6 s |
| boxSpin | donut pairs every **0.917 s** (T3) → 0.667 | identical; linear 360° turn over live 1–7 s | 0.4 s, 0.62–0.80 bw/s | 5 per 10 s |
| rethread | spider pairs 0.817 s + knot closure every **3.0 s** | two metronomes | closure amber 1.1 s, closed 2.2 s | 5 per 10 s |
| chase | ring closes 0–2.5 s, re-expands 2.5–4.3 s, then the face chases at 62 px/s; spider pairs every **0.85 s**; grab every 2.6 s; closure every 4 s | after 4.3 s, flat for 10.4 s | spiders 0.46–0.62 bw/s on web | ~6 per 16 s (moving) |
| SIT TIGHT | slam every **0.917 s** ×12 (first at 0.63 s); sweat 2 drops every **0.483 s** | two metronomes, 4:2 ratio | the lift pose (0.5 s) is the telegraph; sweat 0.28 s, about 2 box-heights/s | ~9–11 per 15 s |
| fatal T60 | slam every 0.917 s; crush at the 7th (live 7.97 s) | metronome | — | — |

Anti-camp ("still" runs): every 4th projectile fired while the SOUL stays still adds a deck response — hip, smash, grab or crossfire. These come every ~1.6–2.5 s and are the only source of variety in a still run.

**String switch, ours vs. references:**

| | Horizontal / vertical switch | Next switch possible | Max switches/s | Grid / web |
|---|---|---|---|---|
| UT | 0.10 s (3 gf) per 60 px | immediately | observed 5–6/s at the pet climax | — |
| US | 0.10 s (3 gf) per 53 px | immediately | observed 5–6/s | — |
| Ours | 0.17 s linear hop, plus a 0.20 s `laneCooldown` that starts with the hop | after 0.20 s | **≈5/s if the button is held**; tap-to-tap is 0.2 s at best | 188 px/s along edges, turning at junctions |

The reference hop reads as a snap. Ours reads as a glide, and the half-transparent arc of a 0.17 s hop is visible.

**Gaps between sub-patterns:**
- UT: 0.6–1.4 s rests, and 1.0–1.2 s inside pet turns.
- US: 1.6–1.9 s rests.
- Ours: none in any family. The only "rest" is the 1.3 s drain at the end, plus SIT TIGHT's built-in hover.

---

## 3. Telegraph lead times and hazard speeds

| Hazard | Lead before it can hurt | How the lead shows | Speed |
|---|---|---|---|
| UT spider | 0.30–0.50 s (median ≈0.33–0.48); 0.68 on slow T15 | walks in on the string line from 100–160 px outside the box | 0.98–1.47 bw/s (359–538 px/s at 1.5×); slow turn 0.61 |
| UT donut | 0.28–0.39 s | rolls in from outside; bounces diagonally | 0.65–1.14 bw/s |
| UT croissant | 0.30–0.33 s | flies in from outside, arcs back out | 1.36–1.41 bw/s inbound |
| UT pet-phase drop | up to ≈1–2 s | spiders sit queued on the top edge of the box before dropping (≈) | — |
| UT pet itself | ≈2.1 s | head visible at the box edge before the tall phase | — |
| US spider | ≈0.33–0.40 s | appears at the string end, at the box edge | 0.53–0.62 bw/s |
| US rolling pin | ≈0.65 s | visible at the side of the box | ≈0.53 bw/s |
| US oven volley | ≈0.5 s (≈) | oven door opens | balls ≈0.8 bw/s (≈) |
| US next attack | whole player turn (2.8–12.5 s) | "upcoming" icon signboard | — |
| Ours: spider / donut | 0.45 / 0.40 s | 38 % ghost, still, inside the box | spider 0.62 → 0.86 bw/s; donut 0.61–0.83 |
| Ours: white drop | 0.80 s | stream line (50 % alpha) + ghost drops | 1.9–2.7 box-heights/s |
| Ours: pet stomp | 1.05 s | circle + pet falling 110 px | — |
| Ours: grab | 0.88 / 1.15 s | amber disc, closing ring, tether to the hand, "GRAB" label | — |
| Ours: smash | 1.08 s | same, "SMASH" | — |
| Ours: hip | 1.05 s | amber ring, arrow, "HIP CHECK", Muffet's body wind-up | throw ≤ 76 px in 0.88 s |
| Ours: knot closure | 1.1 s | edge turns amber | — |
| Ours: SIT slam | 0.50 s lift + 0.14 s bounce | body pose | 0.917 s cycle |
| Ours: sweat | 0.28 s | ghost | 294–328 px/s |

Our telegraphs for body and hands (0.9–1.15 s) are longer and clearer than anything in UT or US, whose hazards rely on visible approach. Our *projectile* lead (0.40–0.45 s) is in the reference range, but it is **static**: a stationary ghost tells you where, while a crawling-in spider tells you where, when and how fast.

---

## 4. Look and feel

### 4a. Sizes relative to the box

| | Box (share of game-area width) | Spider (w × h, % of box) | Lane spacing (% of box height) | SOUL (% of box height) |
|---|---|---|---|---|
| UT | 366×208 px (38 %) | 35×18 px: **9.6 % × 8.7 %** | 60 px: 29 % | ≈24 px: 11 % |
| US | 361×185 (42 %) | 45×26: **12.5 % × 14 %** | 53 px: 29 % | ≈11 % |
| KQ | 112×112 (17.5 %) | — | — | — |
| Ours | 480×154 (**62.5 %**) | ≈21×21: **4.3 % × 13.5 %** | 3 lanes 58 px (38 %); 5 lanes 29 px (19 %); 6 lanes 23 px (15 %) | 13 px: 8 % |

### 4b. Reference qualities (described, not copied)

**Undertale**
- Pure white sprites on black. Hard pixel edges with no outline colour. Strings are thin, dim purple lines inside the box only.
- Spiders: a chunky body with a 2-frame leg flicker. They slide at a constant speed along the string line and enter from beyond the box edge.
- Donuts: white rings that roll diagonally and bounce off the edges.
- Croissants: crescents that curve in and boomerang out.
- The only colour accents are the magenta SOUL and the orange UI.
- Muffet is large and centred above the box. She idles with a cup-sip and does not animate per attack.
- **Climax staging (pet):**
  - the box itself is moved: dragged, slid, stretched tall, wobbled by a few degrees;
  - the pet's mouth is visible at the box's edge;
  - danger collects visibly before it falls (spiders lined up on the top edge).
- No screen shake, flash or particles were seen on hits or attacks. Inferred from sheets; not verified frame by frame.

**Underswap**
- Same white-on-black hazard language, slightly bigger spiders with leg animation, on a decorated purple nest backdrop. Captives are visible above the arena.
- The fight is themed as **a kitchen**: utensils, pan, shakers, ovens, rolling pins. Hazards visibly come from objects placed around the box. The ovens sit beside it, the shakers above it, the pan juts out from its side.
- **Pet staging:**
  - the box becomes a long strip **tilted ~10°**, with the pet's head filling one end;
  - in later pets the strip **rotates to vertical**, with the pet at the top or bottom, and rotates out at the end.
- SOUL colour swaps are staged as a teapot pouring into the box until it fills (≈2.5 s).
- The "upcoming" signboard previews the next attack during the menu.

### 4c. Ours (captures: `sheets/ours-sp-pet.png`, `ours-b.png`, `ours-c.png`)

- **Muffet**: a floating face (five eyes, fangs, expression changes). The **six hands** come in from the face and grip the box edges at three tiers during the warm-up. Tier heights match the three lanes of the 3-lane layout almost exactly. Hand poses change per job: grip, tension, beckon, pinch, smash, offer and the countdown fingers.
- **Milestone warm-up** (1.8 s): a purple full-screen wash with falling purple droplets, and the lower hands counting down.
- **Projectiles**: small white sprites; spider, donut, white and purple droplets.
  - Pending ones are drawn at 38 % alpha, motionless, for 0.40–0.45 s. Then they slide; donuts spin at 2 rad/s.
  - They vanish when they reach the end of their route. There is no exit motion, and no despawn effect at the turn's end (they are cleared).
- **Strings**: dark purple (#763c96) lines, 2 px. Junction dots appear on grid and web. Closures turn amber, then show as a dashed line with a bug-egg knot.
- **SOUL on strings**: the 0.17 s hop shows the SOUL gliding between lanes, with a 0.2 s lockout. There is no squash, no string twang and no sound accent per hop. Not verified for audio.
- **Hit**: red edge glow (0.34 s), screen jolt (~2.5 px), pink expanding ring, 0.9 s blink at 9 Hz. There is no graze feedback, and neither UT nor US has graze.
- **Shake**: ±4 px for 0.2 s on hip and slam, 0.14 s on smash. There is no white flash anywhere in a turn.
- **Body attacks**: the HIP CHECK body sprite steps in from the side with wind-up, impact, recoil and recover. SIT TIGHT's large body lowers onto the box with lift, bounce and crush. Both are strong staging.
- **Pet**: a large spider pet falls 110 px onto a circle during its 1.05 s warning, then sits in the box for 0.3 s. It is not present between stomps.
- **Climax**: there is no build within a turn. The milestone climaxes have strong openings (ring close, the body sitting down) and then hold one density.

---

## 5. Turn-by-turn comparison and suggestions

All suggestions keep:
- our mechanics: families, lanes, AI choice, damage, the HANDOFF set pieces, Aqua's independent navigation;
- our turn lengths;
- our art style: white silhouettes, purple silk, amber telegraphs, Muffet's floating face and six hands.

They re-time spawns inside the same window and with roughly the same hazard count. Every change should be re-run through `tools/sim/muffet-bot.js` and the Aqua navigator, because Aqua plans from `dangerAt` and must stay competent.

### S1. Spiders (Silk commuters / Crossed invitations / The little procession) ↔ UT T2–4, T8, T12, T15; US T4, T10

**What ours does well**
- Two-sided threat on aimed lanes (prediction).
- The ghost telegraph.
- Speed rises per 10 turns.
- Anti-camp decks.

**Gaps**
- Pairs every 0.817 s with CV 0 and the same symmetric L+R shape every beat.
- No same-side trains, no rests, no finisher.
- The last 1.3 s just drains, and spiders still mid-string get deleted (T1–9: last spawn 8.13 + 0.45 + 1.49 s crossing = 10.07 s, after the end at 10.0; T40+: 12.2 s, after 12.0).
- Spiders are visually tiny.

**Suggestions**
1. **One phrase table per variant**, about the same count (≈22–24 spiders in 10 s at T1–9). Times are for the 10 s turn; scale them by `waveDuration/10` for longer turns.
   - **v0 "commuters"**, after UT T3: side trains with a swung pulse.
     - 0–2.4 s: 4 singles from R at 0.27 / 0.53 swing, then 4 from L.
     - 2.4–3.2 s: rest.
     - 3.2–6.4 s: alternating trains of 3, as pairs on adjacent lanes.
     - 6.4–7.2 s: rest.
     - 7.2–8.0 s: finisher.
   - **v1 "crossed invitations"**, after UT T8/T12: a strict alternating metronome at 0.33 s (L, R, L, R, each on a new lane) for 5 s, then a 0.6 s rest, then **all lanes but one at once** (the open lane is aimed away from the SOUL's prediction) as the finisher.
   - **v2 "procession"**, after US T4: a lane **staircase** (bottom → top) at 0.8–1.0 s, then reversed from the other side. Speed rises 10 % on each step of the last staircase. Donuts land on the off-beats.
2. **Finisher plus clean tail.** Clamp the last spawn so that `spawn + warning + crossing ≤ waveDuration − 0.6`. For T1–9 that means the last spawn at ≤ 7.46 s. Then show the finisher, then ≥ 0.6 s of empty box before `endAttack`. This also removes the mid-string deletion.
3. **Crawl in from the hands.** Spawn the spider at the gripping hand of the matching tier, outside the box edge. Have it walk the remaining 0.35–0.45 s of `warning` along a short silk extension into the box, harmless until it crosses the edge. Open that hand's pose (from TENSION to an opening pinch) 0.15 s before the release.
   - Same `warning` value, so the timing contract is unchanged.
   - The ghost becomes motion.
   - Hazards come out of Muffet's anatomy, our own version of "the danger has a source".
   - On grid and web, release from the hand nearest the start node.
4. **Size.** Draw `spider-small` at about 2.6r → 3.2r (≈26 px) on 3–4-lane layouts, and keep 2.6r on 5–6 lanes (23–29 px spacing). Hitbox unchanged. Optionally add a 1 px purple-black outline so spiders read over the silk.

### S2. Pet (Second helping / Pet landing / Dinner bell) ↔ UT/US pet turns

**What ours does well**
- A long, aimed telegraph.
- The pet sprite is a real body with weight.

**Gaps**
- Six identical 1.717 s beats.
- The pet doesn't exist between stomps.
- Donuts come from box sides unrelated to the pet.
- No staging arc.

**Suggestions** (same 10 s and the same 6 stomps, 12 donuts):
1. **Perch.** At live 0, the pet crawls onto one end of the box over 0.6 s and stays half-visible there, alternating ends per variant. Each stomp's 1.05 s warning starts with a crouch at the perch, then the existing fall onto the circle. After the 0.3 s live window, it hops back to the perch.
2. **Donuts from the pet.** Emit the two donuts from the perch position on the landing, rather than from the box sides.
3. **Accelerating cadence.** Use 1.9, 1.75, 1.6, 1.4, 1.2 s, then a **double stomp**: two circles 0.35 s apart on adjacent lanes. That still makes 6 stomps, finished by about 8.7 s. Follow with a 0.8 s rest while the pet climbs away.
4. On each landing, nudge the box 3–4 px toward the pet with the existing `translateHipArena` path, plus a 0.12 s shake. The silk lines bow for 0.2 s. This is UT's "the box is being tugged" in our language.

### S3. White tea (curtain / tipping pot / three sharp pours) ↔ US shakers (T8), KQ T1 swinging emitter

**What ours does well**
- An 0.8 s stream line that shows the column; the pour hand moves to the stream.

**Gaps**
- Metronomic 1.117 s pours.
- v0 steps through columns in a fixed order.
- No sweep feel and no finisher.

**Suggestions**
- Treat the pouring hand as a moving emitter that **sweeps**: three pours left → right at 0.75 s, then a 1.0 s rest while the pot tips back. Then three pours right → left, a rest, then "three sharp pours" as a 0.35 s triple that brackets the SOUL. Same pour count.
- Let the teapot travel visibly along the top edge between pours, as KQ's emitter does.

### S4. Grab / deny rescue ↔ no direct Muffet equivalent (closest: KQ giant-hand attacks)

**What ours does well**
- The best telegraph in the fight, and Aqua is targeted independently.

**Gaps**
- A 1.667 s metronome, always one grab plus one spider.

**Suggestions**
- Phrase it as long, short, long, short, long (2.0 / 1.2 / 2.0 / 1.2 / 2.0) with the same 6 grabs.
- In v1, make one beat a two-hand pincer: both lower hands mark adjacent patches 0.3 s apart.
- End with 1.0 s of empty box while the hands return to grip. That gives a readable "she gives up this round" moment.
- Optionally give the non-grabbing hand a feint beckon with no disc. It is visual only and must not enter `dangerAt`.

### S5. Hand smash ↔ KQ finale fists on the box

**Gaps**
- The impact has only ±4 px of shake.

**Suggestions**
- On the smash, briefly wave the struck string: displace the lane line ±3 px for 0.25 s.
- Add a white 2-frame impact flash (alpha 0.25) limited to the palm disc.
- Add 6–8 silk-fibre particles.
- Keep 1.08 s; change the cadence as in S4.

### S6. HIP CHECK ↔ UT pet phase A (box slides), US oven turn

**What ours does well**
- Already the most "reference-like" staging: the body swing moves the box and hazards ride along with it.

**Suggestions**
- Replace the fixed 2.5 s period with 2.8, 2.2, 1.6 s, a 1.2 s rest, then a last hip. That is still 4 hips.
- Pause the spider pairs for the 0.46 s RECOIL window. This works as the call and response: the hip is the call, the spiders are the response.

### S7. Box spin (Turn the table) ↔ US ovens (box turning, volleys every 1.33 s), KQ T11 rotating box

**Gaps**
- A linear 0 → 360° turn over 6 s, with donuts every 0.917 s regardless of the rotation.

**Suggestions**
- Rotate in **4 quarter-turns** of 0.45 s each (eased), with 1.0–1.1 s holds between them.
- Fire donut pairs only during the holds: 2–3 pairs per hold, keeping about 20 donuts in total.
- The hands' TWIST pose leads each quarter-turn by 0.2 s and is its telegraph.

This gives turn-and-fire beats instead of continuous drift, and makes "your controls follow its strings" readable.

### S8. Rethread (milestone ×5) ↔ US pour turns, UT turn 1

**What ours does well**
- The tea wash with countdown fingers. It is shorter and clearer than the 5.2 s reference pours.

**Gap**
- After the warm-up it is the plain spider metronome plus closures every 3.0 s.

**Suggestion**
- Apply S1's phrase table, and land each closure warning on a rest in the phrase. Then the knot appears while the player has the attention to read it.

### S9. Chase (The girls' circle / Lost in the silk / The last dance; T10, T30, T50) ↔ UT/US pet climax

**What ours does well**
- The ring close and expand opening (0–4.3 s) is spectacle that fits the HANDOFF.

**Gap**
- From 4.3 to 16 s it is flat: pairs every 0.85 s, grab every 2.6 s, closure every 4 s.

**Suggestion**: three acts inside the same 16 s.

| Act | Time | Content |
|---|---|---|
| 1 | 4.3–8 s | Face at its base speed; single spiders every 1.2 s; one closure. |
| 2 | 8–12 s | Face +15 % speed; pairs in swung 0.45 / 0.75 s; grab every 2.0 s. |
| 3 | 12–14.4 s | **Burst**: pairs at 0.4 s and a second closure. |
| Finisher | 14.4 s | The ring of girl-spiders flickers back for 0.6 s at a radius that lets the player through, as a show of force. |
| Release | 15–16 s | Spawns stop and the face retreats to its menu position. |

Spawning already stops at 14.7 s. Keep the total spider count about the same.

### S10. SIT TIGHT (T20, T40) ↔ KQ finale (giant body above the box, hands around it, 1.35–1.6 s pulses, arrow telegraphs)

**What ours does well**
- Real compression, lane loss and the body art.
- The HANDOFF rule of **no spiders**, which is correct.

**Gaps**
- 12 slams exactly 0.917 s apart.
- Sweat every 0.483 s, continuously.
- No accent landings.

**Suggestions**
- Keep 12 landings between 1.8 and 12 s, but phrase them:
  - 3 at 0.92 s;
  - a 1.4 s held hover (LIFT pose held, and the shadow on the box top darkens as the telegraph);
  - 2 at 0.7 s;
  - 3 at 0.92 s;
  - a hover;
  - 2 final landings.

  Compression is per landing, so the end state is unchanged.
- Drop sweat between landings in call and response (2 drops in each hover, none on a landing frame), keeping about 48 drops.
- On landings 4, 8 and 12, add a 0.06 s white flash (alpha 0.18) and ±6 px shake.
- When a lane is about to be removed, blink that string for 0.5 s before the landing that removes it.

### S11. Fatal SIT TIGHT (T60) ↔ KQ finale white-out

The contract stays: a designed fatal trap, cut to black, then Game Over with Muffet's smile, no restored box.

**Suggestions**
- Hold the hover before the 7th landing about 1.6 s instead of 0.92, with all crossings glowing amber as "knots close".
- Make the cut to black itself the climax, on the crush frame.
- Change only the timing, not the outcome.

### S12. Global

1. **Switching feel.** Shorten the hop from 0.17 to 0.10 s and the cooldown from 0.20 to 0.12 s. Add a 2-frame squash on the SOUL and a ±2 px twang on the departed string. Re-check balance with the bot, because faster switching makes dodging easier.
2. **Preview at menu time** (US signboard idea, our style). Only for the **deterministic** milestone turns (×5, ×10, 60), show a small silk tag hanging from one hand during the menu. It shows the layout icon (horizontal, vertical, grid, web) or a teacup for SIT TIGHT. Adaptive turns stay unannounced, so the AI's choice is not spoiled.
3. **Despawn.** Spiders that finish their route should crawl off past the box edge, toward a hand, over 0.2 s instead of vanishing. At the turn's end, sweep the remaining hazards out in 0.25 s (fade plus slide outward) instead of deleting them on one frame.

---

## 6. Giga Queen (inspiration for spectacle and staging)

**Source and scope**
- `dl/files/killerqueen.mp4`. The fight runs from the boss's reveal at ≈2720 s to its end. The first enemy box appears at 2746.80 s, and the final white-out is at 3102.4–3105.4 s.
- Measured with `scripts/kqfeat.py`:
  - the green box: largest green component;
  - the red SOUL;
  - yellow and white blobs;
  - luminance and frame difference.
- Effective rate is ~15 fps, so times are ±0.07–0.1 s and **sprite details are approximate**.
- Enemy turn = green box visible.
- Player turn = the gap between boxes. Deltarune player turns include three party members' actions, their animations and the boss's dialogue.

### 6a. Per-turn table (box 112×112 px; game area 640 px wide)

| # | Box on | Box off | Attack | Player turn after | Identity (≈) |
|---|---|---|---|---|---|
| 1 | 2746.80 | 2756.07 | 9.27 | 21.86 | A wireframe emitter at the top swings like a pendulum and pours a **snaking chain** of white pieces through the box; it sweeps across in ≈1.0–1.4 s |
| 2 | 2777.93 | 2785.47 | 7.54 | 15.20 | Falling small white pieces |
| 3 | 2800.67 | 2809.37 | 8.70 | 17.30 | A giant gloved hand with a device; pop-up "laughing" windows stack beside the box and spit pieces |
| 4 | 2826.67 | 2833.07 | 6.40 | 14.00 | Diagonal slash streaks; the boss **swoops through** the screen |
| 5 | 2847.07 | 2854.97 | 7.90 | 11.20 | Green emitters around the box draw a **red sight line**, then fire white beams; yellow "!" bars inside the box |
| 6 | 2866.17 | 2874.07 | 7.90 | 16.00 | Yellow battery-like bars inside the box; a pointing hand |
| 7 | 2890.07 | 2899.77 | 9.70 | 15.60 | Emitters plus white sparks |
| 8 | 2915.37 | 2928.40 | 13.03 | 13.80 | Hand plus windows, longer |
| 9 | 2942.20 | 2949.57 | 7.37 | 15.10 | White bits and a red wall |
| 10 | 2964.67 | 2972.20 | 7.53 | ≈13.8 | A device fires white beams in a **fan** |
| 11 | ≈2986.2 | ≈2995.3 | ≈9.1 | ≈12.0 | The box rotates inside a dotted frame; white orbs orbit (box not trackable while rotated) |
| 12 | 3007.30 | 3016.90 | 9.60 | 20.80 | Goblets and bubble skulls, then a green acid pillar |
| F | 3037.70 | 3102.4 | **≈64.7** | — | **Finale**: real-time, with party prompts during the attack |

Talk between turns is part of the player turn. Normal attacks are 6.4–13.0 s (median 7.9).

### 6b. Finale timeline (≈)

| Time (s) | What happens |
|---|---|
| 3037.7 | Arena goes dark (luminance 49 → 0 by 3039), box only, party prompts appear |
| 3043.5 | Background returns; the **giant figure rises behind the box**; its two big hands rest on either side |
| 3044.5 | Fan-like arches close in from both sides |
| 3047.0, 3049.8 | Full-screen flashes (luminance +30) |
| 3051.5 – ≈3060.5 | **Two large yellow spoked wheels** (each ≈1.35 box widths across) flank the box |
| 3070.7, 3084.0, 3097.7 | Further flashes; fists punch toward the box; a goblet is thrown; party beam cut-ins |
| 3102.4 | White-out over 0.2 s (luminance 73 → 189), held for 3 s |

The wheel sequence:
- Grey **arrows inside the box** (pointing down) appear ≈0.5–0.9 s before the wheels act.
- The wheels roll in from the screen edges (≈0.3 s), sit flanking the box, flash brighter with an electric pulse, **converge over the box** for ≈0.5 s, then part.
- Brightness pulses at 3051.8, 3053.1, 3055.0, 3056.4, 3058.4 and 3059.9, so the period is **≈1.35–1.6 s** and each pulse is ON for ≈0.6 s.
- The arrows flip to point up before the next cycle.

### 6c. Staging lessons for our Muffet turns (our own style only)

- **The boss's body frames the box.**
  - In the finale, the giant body is behind the box and the hands are beside it. Hazards are props the body handles: goblets, wheels, fists.
  - This matches our six-hand concept. In milestone turns (chase, SIT TIGHT), let the hands do visible work on the beat: slap the box edge, spin a web wheel, pinch a string.
- **A big rotating radial object is a natural Muffet motif.**
  - The flanking wheels read like spoked webs.
  - Suggestion for chase or the web rethread turns (T10/30/50, T55): two large **silk orb-webs**, drawn in our purple silk style with amber charge, roll in beside the full-web arena.
  - They pulse on a 1.4 s cycle, with a 0.6 s glow as the telegraph.
  - On each pulse, the web arena's outer ring knots (the existing `closeRoute` closures) light on the side the orb touches.

  This is visual staging for mechanics we already have; the orbs are not new hitboxes.
- **Directional arrows inside the box, 0.5–0.9 s ahead.** For SIT TIGHT, show faint purple chevrons on the strings 0.5 s before each landing. They point up, in the direction the kick will throw the SOUL. That gives a readable "you will be thrown" telegraph for `sitKick`.
- **Darkness, then reveal.** The finale starts with ≈5 s of near-black with only the box lit before the body rises.
  - For T50, after the tea speech, or for T60: a 0.8–1.2 s dim, inside the existing 1.8 s warm-up, before the tea wash.
  - The fatal turn's contract (cut to black) already uses darkness as its payoff.
- **Flash budget.** KQ uses about 5 full flashes in 65 s, roughly one every 13 s, on big beats only. If flashes are added to ours (S10), keep them to about one per 4–5 s and only on accent landings.
- **Emitters with sight lines** (T5, T10). Placing sources around the box and drawing a thin line before firing is the same idea as our white-tea stream line, and it supports S3's moving-teapot emitter.

---

## 7. Files (scratchpad `muffet-study/`)

- `muffet-study.md`: this report.
- `scripts/`:
  - `feat.py`, `turns.py`, `turns2.py`, `fix.py`, `track.py`, `pace.py`, `turnsheet.py`, `sheet.py`: reference analysis.
  - `kqfeat.py`: Giga Queen features.
  - `ours-sim.js`: our event logger.
  - `ours-cap.js`: our virtual-clock captures.
  - `ours-an.py`: our pacing summary.
- `data/`:
  - `ut.jsonl`, `us.jsonl`, `kq.jsonl`: per-frame features.
  - `*-turnsF.json`: turn edges with frame numbers.
  - `*-tracks.json`, `*-pace.json`: hazard tracks and pacing.
  - `ours-still.json`, `ours-walk.json`: our event logs.
- `sheets/`:
  - `ov-*.png`: overviews.
  - `ut-turnrows.png`, `us-turnrows1.png`: one row per turn.
  - `ut-pet1-2fps.png`, `ut-pet-detail.png`: UT pet turn.
  - `us-attacks.png`, `us1s-*.png`: US attack identities.
  - `kq-*.png`: Giga Queen.
  - `ours-*.png`: our captures.
- `ours/`: our capture frames.

Raw 160×90 RGB dumps and the test HTML copy were deleted after the analysis.
