# Aqua — Last Playmate: how the attacks look, behave and feel compared with the two reference fights

This report is for the game's designer. It compares the reference fan-game videos with our duel, attack by attack. It is about **visuals, motion and feel**. Turn-level timing is already covered in `docs/reference-study/aqua-refs-precise.md`, and I do not repeat it. A **Micro-pacing** section (§4) adds measurements at the level of single projectiles, for both the references and our game.

- **References.** B = "No More Deals" Chara fight (`chara.mp4`, 960x720, 59.73 fps). This is the main reference. A = "Love Maniac" (`lovemaniac.mp4`, 1280x720, 60 fps). For A, only the battle mechanics were looked at; the uploader's caption and black box were ignored.
- **Ours.** `games/aqua.html`, build R33. A hooked test copy (`window.__game`) was run on a virtual 60 fps clock. All 24 waves plus STILL WATERS were force-started, along with three Seth duel turns and two runs where the SOUL takes hits. Every spawn, event, parry and hit was logged, and frames were saved. The game's mechanics were not changed.
- **Rule for every suggestion.** Keep Aqua's mechanics, prices, parry budget, recall rule and the "tips, warnings and hitboxes agree" rule. Stay in our own art style: white pixel knives, Aqua's cyan, her eight existing poses, the Determination font. Nothing here copies reference sprites. Where a suggestion would change difficulty, I say so.

## 0. Files

Side-by-side contact sheets: reference row on top, ours below, same time spacing within each row. All are in `$S/vid/lf-aqua/`:

| Sheet | What it shows |
|---|---|
| `01-slash-vs-beam.png` | B aim-slash vs our beam (stop/menu): live phase, every 2nd frame |
| `02-lunge-knives.png` | B flanking knife lunges vs our side-cut fan: sprite scale and telegraph |
| `03-gather-vs-duet.png` | B knife cloud gathering then raining vs our STILL WATERS duet fans |
| `04-block-vs-parry.png` | B BLOCK vs our duel parry |
| `05-ring.png` | B finale knife ring vs our circle rosette |
| `06-lines-vs-rows.png` | A line volley vs our chain rows |
| `07-finale.png` | B finale storyboard vs ONE MORE TIME storyboard |

(`$S` = `/tmp/claude-0/-home-user-Deltaverse1/2f20f124-146c-5784-a658-987f627f8b17/scratchpad`.)

Working material is in `$S/lfa/`:
- per-attack reference sheets: `ref/b_*.png`, `ref/a_*.png`;
- per-pattern sheets of ours: `sh/o_w*.png`;
- zooms: `sh/z_*.png`, including `z_allposes.png` with all 8 Aqua poses and her props;
- raw per-frame features: `pace/*.npy`;
- our per-pattern pacing dump: `pace/ours.txt`;
- per-run spawn/event logs: `ours/*/log.json`;
- tools: `cap.js`, `tools/vsheet.py`, `isheet.py`, `refpace.py`, `events.py`, `ourpace.py`, `stack.py`.

## 1. Scale and units: the biggest structural difference

| | B (Chara) | A (Love Maniac) | Ours |
|---|---|---|---|
| Battle box | 216x209 px = 22.5% of screen width | ≈220x210 = 17% | **468x190 = 61% of the 768 canvas** |
| SOUL | 24 px | ≈20 px | 16 px |
| Box in SOUL widths | **9 x 9** | ≈11 x 10 | **29 x 12** |
| Ordinary knife | 96x29 px, white 2 px outline, black inside = **4 SOULs, 0.44 box widths** | ≈40 px silver blade with shading, ≈0.18 box widths | 56x18 px solid white silhouette = **3.5 SOULs, 0.12 box widths**. Fullscreen knives are 108x20. |
| Box border | 7 px (0.29 SOUL) | ≈4 px | 4 px (0.25 SOUL) |
| Live slash / beam | 30 px wedge (1.25 SOULs) | 3–4 px lines | 10–20 px bar (0.6–1.25 SOULs) |
| Fast knife speed | lunge 1,350 px/s, rain 1,610 px/s ≈ **56–67 SOULs/s** | converging knives 400–650 px/s ≈ 20–30 SOULs/s | 124–248 px/s ≈ **8–15 SOULs/s** (median 163–218). Aqua's own lunge: 760 px/s = 47 SOULs/s. |
| Knife speed ÷ player speed | ≈6–7x | ≈2–3x | **≈0.6–1.3x** (player 196 px/s) |

**What this means.** Our knives drift at about the player's own speed across a very wide floor. The references throw knives that are 3–7x faster than the player, but always after a long, clearly visible pre-phase. So our patterns read as moving walls and rows, while the references read as strikes. The one thing in ours that already feels like a reference strike is Aqua's own SOUL lunge: a locked cyan path, then a 760 px/s dash, then a cut arc.

Because our box holds about 3x as many SOUL widths, a 56 px knife looks small next to it, even though in SOUL units it is about 85% of a B knife.

## 2. Reference attack catalogue: sprites, behaviour, feel

### B: "No More Deals"

**Shared visual grammar** (`ref/b_aim1.png`, `ref/b_aim_slash.png`):
- **Warning.** A 1–2 px line across the whole screen, flickering yellow↔red at 6 Hz.
  - On aim-slashes the line pivots around the SOUL, sweeping about 180° in 0.8 s like a radar, and locks about 0.1 s before firing.
  - A beam gets a pair of parallel lines that mark its width.
- **Live slash.** A white wedge, thin at the enemy's end and about 30 px wide in the box.
  - It appears at full length on the first frame and widens over 2–3 frames.
  - It then swings about 25° over roughly 10 frames, as a blade would, while thinning.
  - It ends as a 1 px hairline for 2–3 frames and disappears at about 0.28 s.
  - **The band always runs through Chara's body**, so the cut visibly comes from her.
- **Enemy pose sync** (`04-block-vs-parry.png`, `01-…`):
  - knife snaps overhead about 1 frame *before* the hazard;
  - a red crescent smear lasts about 4 frames;
  - then a guard pose with the knife held across the body.
  - She does this on every slash, every beam volley and every BLOCK.
- **Knife sprite.** A white outline with a black interior. Overlapping knives stay separable, and a knife reads as an object, not a smear. Knives rotate freely in flight and spin while flying in.
- **Pre-phase cues** (`ref/b_cornerx.png`, `ref/b_special.png`, `ref/b_tiny.png`):
  - a dark-red **heart pulse** fills the box for about 0.3–0.6 s;
  - small **"!" squares** mark spawn points for about 1 s;
  - a single "!" appears before the tiny-box rhythm.
- **Flashes.** 10-frame white flashes open and close the mirror phases. A 4-frame flash switches on the red floor glow.

**Attack by attack:**

| B attack | Sprites | Behaviour | Feel |
|---|---|---|---|
| **Aim-line slashes** (turn 3) | Wedge slash, radar warning line | 1 slash/s; from slash 8 onward, 2–3 lines fire together | Rhythmic "duck-and-weave". The swing makes the danger zone grow slightly after it appears. |
| **Crosshair beams** (turn 2, `b_cross.png`) | Horizontal and vertical thin lines cross at the SOUL. Beams 40–60 px, horizontal fires 4 fr before vertical. | Before the beams: diagonal cyan knife sweeps. Then white knife "teeth" rise from floor and ceiling and **stay**, so the box fills up volley by volley. | Mounting claustrophobia. The beams are the punctuation; the accumulating knives are the build-up. |
| **Beam grid** (turn 16, `b_grid.png`) | Double-line pairs. 2 horizontal plus 2 vertical beams, about 50 px, one through Chara. A dark-red heart pulse inside the box during the warning. | Every 1.5 s. Cyan "hold still" knife columns appear for about 0.5 s after each volley. | Huge white flashes that fill a quarter of the screen. Very clear "now / safe" alternation. |
| **Diagonal lattice** (`b_lattice.png`) | About 16 lines in yellow, orange and red, added 0.07–0.1 s apart | 2 s build-up, then one big Chara swing, then the lines ignite one after another as thin white beams with pale trails | A cascade. The longest warning in the fight pays off as a chain reaction. |
| **Flanking lunges** (turn 1, `b_lunge.png`, `02-…`) | 96 px outline knives | Knives fly in **spinning** from screen corners, rotate to horizontal, **settle beside the box on the SOUL's row** (≈0.3 s hover), then cross the box in about 0.16 s. They alternate left and right. | Call-and-response, every 0.5 s. Fully readable because the hover is long and the strike is instant. |
| **Knife cloud → rain** (turn 4, `b_rain.png`, `b_rain_fire.png`) | Knives rise out of the box floor (every 0.30 s) and fly up to Chara | About 14 knives orbit or hang around her body for about 2 s. Then they detach one by one, tilt, and drop through the box at about 6 per second, thrown to varied x positions. The halo visibly empties. | A textbook **rest before the climax**: the gather is the warning, and the emptying halo is the countdown. |
| **Corner X + spinning blade** (turn 23, `b_cornerx.png`) | Heart pulse, then an orange "!" square (1 s), then 4 corner fans of 3 knives fly in. A double-ended blade spins slowly (≈0.6 rev/s) in the middle of the box. | Continuous rotation-tracking dodge, not discrete hits | A tense, quiet attack. No flashes, just a slow rotating threat. |
| **Tiny box rhythm** (turn 8, `b_tiny.png`) | 22–29 px beam through Chara herself, alternating sides of an 80x40 box. Swell, then hairline tail. | 0.50 s, then 0.40 s, with no line warning | A drum beat. The tempo change is the escalation. |
| **Box move / breathe** (turns 9, 10, `b_box9.png`, `b_breath.png`) | — | A tall box glides to the left edge of the screen over about 5 s. Knives come from the far side, so the travel distance grows, then it glides back. The "breathing" box squeezes from 330 to 120 px in sync with horizontal knife pairs (one pair every 1.42–1.46 s). | Space itself becomes the attack. Shape changes are always **tweened** (≈0.75 s eased), never snapped. |
| **BLOCK** (`04-…`) | Knife raise, 2-step red smear, guard pose; at +0.64 s a grey outlined "BLOCK" label about the width of the box pops up 13 px and settles | Held for 1.5 s. The attack bar's cursor stays frozen. | Unmistakably "she stopped you". The label is the payoff. |
| **Special attack** (turn 15, `b_special.png`) | Grey heart sprites drifting; large white orbs that burst into sparks | Announced about 10 s ahead | A different visual vocabulary from her normal attacks, so it feels like a genuine trump card. |
| **Finale** (`b_finale.png`, `07-…`) | UI vanishes on one frame. Giant close-up of Chara raising the knife (≈2.9 s). Empty box with falling white streaks. Orange teeth. Beams. A ring of about 28 outlined knives pointing inward, breathing. Orange and cyan knives crossing. Ring turns cyan ("hold still"). UI returns. | Chapters of 6, 6, 13 and 2.5 s, separated by 1–3 s transitions | Ceremony. Every chapter has its own look. The HP bar is hidden for 34 s. |
| **MERCY slash** | A standard warning line plus slash over the MERCY button; the button bursts into particles | During the player's menu | The UI as a target is the rival-player signature move. |

### A: Love Maniac

| A attack | Sprites | Behaviour | Feel |
|---|---|---|---|
| **Line volleys** (`a_lines.png`, `06-…`) | 6–10 thin 1–3 px lines, drawn in one at a time over ≈0.3–0.4 s. Each line heats red → orange/yellow → white (live). | All lines in a volley go live together for 0.3 s. Cycle 1.37 → 1.17 s; leads shrink from 0.85 to 0.6 s. | A "heating up" colour ramp instead of a flicker. Within-attack acceleration. |
| **Grey band → giant knife sweep** (`a_sweep.png`) | Wide, soft, translucent grey diagonal band (≈1.1 s). Then a large red knife held in a hand sweeps above the box. A jagged white "tremor" line stays inside the box for 1.3–1.5 s and fades. | One big event; small knives keep streaming | Scale contrast: one oversized weapon with a lingering scar. |
| **Pendulum / piston knives** (turn 6, `a_t6.png`) | Vertical knives in columns of a short 220x110 box | Each column oscillates up and down out of phase, like pendulums. A grey-band sweep is layered on top. | A continuous "find the gap" pulse. Few discrete threats (near-SOUL events every 1.2–4.5 s). |
| **Converging knives** (turn 1, `a_conv.png`) | Thin silver knives with shading on all 4 walls, outside the box | They hover pointing at the centre, slide in toward the SOUL in pairs from opposite walls (2–3 bw/s, accelerating), cross, then retreat | Steady 0.37 s pulse after a 3.9 s set-up |
| **Star snipe** | 1–4 bright four-point stars beside the enemy, each casting an aim line | They flare and fire about 1.4 s later, 0.47 s apart | Sniper tension: the source is visible and the delay is long |
| **Finale vortex** (`a_fin1.png`) | Hard black cut. A big 380x370 box with a slowly rotating grey streak vortex behind the play field. The SOUL has a pink trail. White knives enter through the box walls. A translucent red band (1.2 s) becomes a jagged red crack that stays about 1.1 s. | Near-SOUL events every 0.27–0.65 s (median 0.51) | A dreamlike change of scenery. The HP bar moves under the box and stays visible. |
| **Hit feedback** | The SOUL turns pink while invulnerable | — | — |

## 3. Our visual grammar as it stands

Sources: code in `engine.js`, `choreography.js`, `knife-visual.js`, `duelist(-visual).js`, `defense(-visual).js`, `tension-visual.js`, ImpactFX, and the captures.

**Knife (`drawKnife`).** A solid white or coloured silhouette: grip, 2x18 cross-guard, angled blade. It is drawn smoothly rotated. It has **no outline**, so knives in a fan merge into one white clump (`sh/z_fan_knives.png`). It has no animation frames. Orbit knives spin at 4 rad/s and other knives point along their velocity.

**Spawn and pre-phase.**
- During `delay` a knife is drawn at 18% alpha with a grey "!" at 25% alpha. Then it pops to full white and moves at **constant velocity**. There is no hover, wind-back, ease or glint.
- **Defect:** the ghost and "!" are drawn inside the box clip, so knives that spawn outside the wall have no visible pre-phase at all. This affects side cuts, curtains, `fan`, the `stop` walls and the shield shots. These knives simply slide out of the wall (`02-…`, 2.9 s).
- Chain rows show their tips faintly at the top edge.
- Rosettes show a clear grey ring for 0.3 s.

**Beam (`beam`).**
- Warning: a 1 px dashed line at 45% alpha, plus two grey 62 px knives 100 px either side of the aim point, pointing at each other. This is a nice idea of our own.
- Live: a **static** filled bar of the full width, plus a slash prop at the centre, for 0.24–0.4 s.
- There is no grow, swing or thinning, and **it is clipped to the box**, so it never visibly crosses Aqua's body or comes from her.

**Flood.** A static rectangle at 14% alpha with a red outline and a label ("CROSS" / "MOVE"). When live it turns solid white for 0.6 s.

**Aqua's body.**
- She has 8 good poses (`sh/z_allposes.png`): idle, knife-ready crouch, ground crouch, **knife-point lunge**, tired/hurt, aggressive low knife, arms crossed, reaching hand.
- During waves the pose is mostly 1 (knife-ready). It is 2 or 3 for stage patterns, 5 during a duelist cut or above 85 frustration, and 4 under 20 HP.
- She bobs ±2 px. **Casts, beams and parries do not change her pose**, so in practice the body is a static portrait.
- In STILL WATERS and other tilted-camera phases she is pushed to (90, 185) and partly leaves the frame (`sh/o_pat_late.png`).

**Aqua's SOUL.** Our cause-and-effect strength. Duet, knife and mirror knives leave from her cyan SOUL. She dodges with sway, and a cyan motion streak appears above 20 px/s. Her lunge has:
- a 30 px cyan path at 16% alpha, with a dashed centre line;
- a red cut arc at 16% alpha;
- a 760 px/s dash with a cyan trail;
- a white arc plus a slash prop on the cut;
- a purple ring with a "Z" while she recovers.

This is the best-staged moment in our fight and matches the references' "long, clear tell, then an instant strike".

**Parry** (`04-…`, `sh/z_parry.png`). For 0.18 s:
- a spinning white crescent prop at about 50 px;
- a green 44 px square on her SOUL;
- the slash sound, and a "PARRY n/3" HUD text.

There is no body pose, label, hit-stop, flash or shake (ImpactFX maps `block` to `kick(.06)`, and `slash` has no effect). The three parries in the cyan duet run landed **0.34 s apart (1.48, 1.82 s) and then at 4.21 s**, so two of the three blur together.

**Graze.** A hollow, stepped heart outline (white, then cyan or purple) at 2.55x scale. It is readable and on-brand. It has no TP feedback beyond the bars.

**Seth hit.** A red edge vignette (0.34 s), trauma shake, a ±3 px jitter for 0.25 s, and the SOUL blinking at 8 Hz for 0.40 s.

**Aqua hit.** A floating damage number. There is no flash on her SOUL or body and no shake.

**Box.** The arena snaps to its new size and position at `beginWave` with no tween.
- `moveBox` (ribbon, break) drifts on a sine: ±70 px in x, ±26 px in y.
- The stage angle eases at `dt*4`, and the stage camera zooms.
- The red line from Aqua's hand to the box corner in ribbon (she drags the box) is excellent cause and effect.

**Finale (`last`, 40 s, `07-…`).**
- Five 8-second phases; a tilted, re-zoomed box; Aqua's body beside the box.
- Fullscreen 108 px knife fields drift at 120 px/s with a fixed diagonal lane (24–32 s).
- A full-screen face jumpscare at about 29.6 s.
- **The HUD and TP bars stay on throughout.** Phase changes have no flash or cut.

## 4. Micro-pacing: single projectiles, references vs ours

### Method

**References.** For each attack I extracted per-frame features over the box interior with `tools/refpace.py`:
- white pixels in the box;
- SOUL position, found as the densest red/pink blob;
- white pixels within 36 and 70 px of the SOUL;
- warning-colour pixels.

Events are runs above a threshold, merged across gaps of 3–6 frames (`tools/events.py`).
- A **hazard onset** is white entering the box.
- A **near-SOUL event** is white within 70 px of the SOUL. This is a proxy for "a required dodge", because the player had to be near it and get out of the way.
- Knife-rain launches and lattice ignitions were counted by eye on full-rate sheets.

**Ours.** These numbers come from the exact spawn logs:
- **Cast** = one director/choreography call.
- **Live onset** = spawn time + `delay` (knives), + `warning` (beams/floods), or + `release` (orbit knives).
- **Near-pass** = a live hazard's closest approach to the SOUL is under 22 px (the hitbox edge), merged within 0.12 s.

The SOUL followed a slow Lissajous path (7 s by 5 s, amplitude 30%/28% of the box) and was invincible, so these are hazards a passive player must react to. They are not a measure of skill.

All of our values are on Normal ("Attrition") difficulty: speed ×1.18, warning ×1.

Times for ours are seconds of `attackTime`, which starts after the 1.05 s warning card.

### 4.1 Per-attack tables

**Slash / beam family.** B aim-slash, crosshair, grid and finale beams compared with our `stop`, `menu`, `memory`, `spin`, `save` and `items` beams.

| | B aim-slashes | B crosshair | B beam grid | B finale beams | Ours: `stop` beam | Ours: `spin` | Ours: `memory` |
|---|---|---|---|---|---|---|---|
| Hazard onsets (s) | 344.40, 345.41, 346.40, 347.40, 348.46, 349.44, 350.40, 351.37, 352.41, 353.41, 354.40, 355.40 | 316.89, 318.42, 319.96, 321.43 | 804.09 → 817.59, 10 volleys | horizontal 1069.75, 1070.77, 1071.72 …; vertical 1077.06, 1078.07, 1079.04, 1080.03, ≈1081.0, 1082.07 | 2.02, 4.27, 5.38, 7.62, 8.74, 10.98, 12.11, 14.34, 15.47 | beam pairs every 2nd cast, about 2.08 s apart (the second line 0.3 s after the first) | triple beams 2.04/2.17, 8.26/8.39, 9.39/9.52, 15.24/15.38 … |
| Interval mean / min / max | **1.00** / 0.95 / 1.05 | 1.50 / 1.47 / 1.54 | **1.50** / 1.47 / 1.52 | ≈1.0 | 1.12 cast, but **beam gaps alternate 2.25 / 1.11** | 2.08 | irregular: 0.13 within a set, 1.1–5.7 between sets |
| Shape over the attack | Steady pulse; from #8 the count rises (1 → 2–3 per beat) | Steady, with accumulating knives as the escalation | Steady | Accelerates and overlaps at the end of each chapter | **Alternating long/short** (a 2-cast cycle) | Steady | Bursts |
| Warning lead | 0.90–0.97 s | 0.89–0.94 | 0.98–1.01 | 0.95–0.97 | 0.90 | 1.00–1.30 | 0.92–1.05 |
| Live | 0.25–0.30 | 0.20–0.23 | 0.22–0.27 | 0.27–0.30 | 0.40 (stop), 0.24 (others) | 0.28 | 0.24 |
| Required dodges per s at peak | 2 | 1.3 | 0.7 volleys/s (4 beams) | 1–2 | 4 in any 1 s window, with knives included | 5 | 3 |

**Knife strikes.** B flanking lunges and A converging knives compared with our `knife`, `fan`, `mirror` and the duet sources.

| | B flanking lunge | A converging pairs | Ours: `knife` | Ours: `fan` | Ours: `mirror` |
|---|---|---|---|---|---|
| Per-projectile onsets (s) | 279.64, 280.09, 280.64, 281.18, 281.61, 282.15, 282.62, 283.12, 283.64, 284.17, 284.59, 284.96 | 155.38, 155.75, 156.08, 156.45, 156.83, 157.15, 157.53, (rest 0.77), 158.30, 158.57, 159.05, 159.38, 159.75, 160.12, 160.50, 160.83, 161.23, 161.57, 161.97 | 1.62, 1.75, 1.86 \| 2.79×3 \| (lunge) 6.77×3 \| 7.84, 7.96, 8.08 \| 8.97, 9.09, 9.21 \| (lunge) 13.28 … | 1.57, 1.68, 1.77, 1.88, 1.98 \| 2.79×3 \| (lunge) 6.78 \| 7.80–8.20 (6 knives, 0.10 apart) \| 8.92–9.32 (5) … | 5-knife fans from both sides; live 0.50, 0.57, 0.64 within a fan |
| Interval | **0.48 mean** (0.37–0.55), alternating L/R | **0.37 median** (0.27–0.48) | Ripple of 0.12 s inside a cast; 1.12 s between casts; **4.0 s holes** around lunges | Ripple of 0.10 s; 1.12 s; 4.0 s holes | Ripple of 0.07 s; 1.04 s |
| Shape | Steady, with a slight acceleration at the end (0.42, 0.37) | Steady pulse, one 0.77 rest | **Burst, then rest** (3 knives, then quiet) | Burst, then rest | Burst, then rest |
| Pre-phase | Spinning fly-in, then **0.3 s visible hover** on the SOUL's row | Hover on the walls, pointing in | 0.50–0.74 s ghost at 18% alpha, inside the box | **0.45–0.85 s, invisible** (clipped outside the wall) | 0.50–0.64 s, invisible from outside |
| Flight speed | 1,350 px/s, crosses in 0.16 s | 400–650 px/s, accelerating | 218 px/s constant | 212–301 px/s | 230 px/s |
| Near-SOUL peak per 1 s | 3 | 3–4 | 2 | 4 | 4 |
| Near-pass gap median | 0.49 | 0.40 | (only 3 near passes in 14 s) | 0.50 | 0.68 |

**Gather → rain.** B knife cloud compared with our duet-heavy waves (`talk`, `duel`, `patience`).

| | B knife cloud (turn 4) | Ours: `talk` | Ours: `duel` | Ours: STILL WATERS |
|---|---|---|---|---|
| Sequence | Floor knives rise every **0.30 s** ×6 (388.3–389.8). Then **gather ≈2.0 s** with no threat. Then single drops at about **6 per second** (≈0.15–0.2 s apart) for 2.8 s (392.65–395.4), tapering. | Duet 7 (0.42 s lead) every cast; yellow bullets every 0.86 s; curtains every 2nd cast | Duet 5 + curtains + yellow bullets; casts 0.62 s apart on average | Three 6–12 s phases: curtains + duet7 → chain + sideCuts5 → curtains + beam + duet7 |
| Inter-projectile gaps | 0.30 (rise), 2.0 rest, 0.15–0.2 (drop) | Knives in a duet all live at once (7 together); groups 0.13–0.77 apart | Groups 0.48 apart (7.44, 7.92, 8.53, 9.35, 9.83, 10.31, 10.79 …) | Groups 0.43–0.48 apart (1.83, 2.26, 2.74 \| 3.67, 4.10, 4.58 \| …) |
| Rest before climax | **Yes, 2 s, with the threat visibly loading** | No | Only lunge holes (≈4 s) | **No pre-climax hold between phases** (phase changes at t = 6 and 18 happen mid-stream) |
| Peak dodges per s | ≈4 during the drop | 4 | 5 | 4 |

**Rows / curtains / pistons.** A line volleys and A pistons compared with our `chain`, `blue`, `reverse`, `menu` curtains and `cyan`.

| | A line volleys | A pistons | Ours: `chain` | Ours: `blue` | Ours: `reverse` | Ours: `cyan` |
|---|---|---|---|---|---|---|
| Onsets | live 176.02, 177.38, 178.62, 179.90, 181.12, 182.28, 183.45, 184.62, 185.78 | continuous oscillation | rows 1.93, 3.04, 4.17, 5.28, 6.41 … 16.48 (14 rows × 14–15 knives) | rows every 1.12 | curtains/rows every 0.96 | 4 inward knives every 1.04 (1.89, 2.93, 3.98 …) |
| Interval | **1.37, 1.23, 1.28, 1.22, 1.17, 1.17, 1.17, 1.17** | — | **1.12 exactly, ×14** | 1.12 | 0.96 | 1.04 ×19 |
| Shape | **Accelerating** (−15%), and the lead also shrinks from 0.85 to 0.60 | Steady | **Pure metronome for 16 s** | Metronome | Metronome | Metronome for 20 s |
| Within-volley stagger | Lines drawn in one at a time, about 0.04–0.05 s apart, then all go live at once | Columns out of phase | All 15 knives of a row live on the same frame | Same | Same | 4 at once |
| Required dodges per s at peak | ≈1 (one volley) | ≈0.5 | 4 (rows plus graze passes) | 3 | 3 | 4 |
| Near-pass gap median | — | 2.0 | 0.25 (row edges brush the wandering SOUL) | 0.63 | 0.25 | 0.82 |

**Rings.** B finale knife ring and corner X compared with our `circle`, `orbit` and `save`.

| | B ring (1083–1096) | B corner X | Ours: `circle` | Ours: `orbit` | Ours: `save` |
|---|---|---|---|---|---|
| Structure | ≈28 knives ring the SOUL and breathe; orange and cyan knives cross through it every ≈0.4–0.7 s | Static corner fans plus one slowly spinning blade (≈0.6 rev/s): a continuous, not discrete, dodge | Ring of 9 every 1.12 s; each ring releases 1.65 s after spawn **toward one point** | Ring of 12 every 0.96 s, with lunge holes | Ring of 7 every 0.96 s plus X beams |
| Onsets | ring spawns once; crossers ≈0.4–0.7 s apart | — | 2.77, 5.02, 6.13, 8.38, 9.49, 11.73 … (ring release); beams 4.42, 7.77, 11.13 (every 3rd cast) | 2.62, 3.58, (lunge) 8.59, 10.51, 11.47 … | — |
| Near-pass gaps | — | 0.23 / 1.74 | median **0.55** (0.13–1.75) | median **0.25**, peak 5/s | median **0.27**, **peak 6/s (the densest in our fight)** |
| Simultaneous live hazards | ≈28–35 | 13 | median 28, max 39 | median 21, max 60 | median 31, max 42 |

**Finales.** B finale and A finale vortex compared with our `last`.

| | B finale | A finale part 1 | Ours: `last` (40 s) |
|---|---|---|---|
| Chapter rhythm | 8 s talk → cut → 2.9 s close-up → 1.6 s empty box → 6.2 s horizontal beams (1.0 s) → 1.1 s orb transition → 6.2 s vertical beams (1.0 s) → 13.2 s ring → 2.5 s cyan ring → UI back | Black cut → 11.2 s vortex (near-SOUL every 0.27–0.65 s, median 0.51; red band 1.2 s → crack) → 6 s menu → 10.8 s | Phases of 8 s: chain → curtains → wheel → curtains → chain; duet every 2nd cast; fullscreen knife phrases 24–32 s every 3 s; scare at about 28–29.6 s |
| Rests between chapters | 1.1–2.9 s **visibly empty** | 6 s menu | **None.** Casts every 0.84 s (1.68, 2.52, … with lunge holes), and phase boundaries fall on cast beats |
| Peak | 2 beams/s (overlapping) at the end of each beam chapter | 4/s | 4/s; up to 66 simultaneous live hazards |

**Duel turn (Seth attacks, Aqua defends).** Compared with B's BLOCK.

| | B BLOCK | Ours: cyan duel (6 s) |
|---|---|---|
| Events | 1 block per FIGHT: guard at +0.1 s, label at +0.64 s, held 1.5 s | Shots every 0.33 s (player). Parries at **1.48, 1.82, 4.21**, then the 4th connecting hit at 4.45. Purple and yellow duels: 0 parries, all dodged. |
| Spacing | — | Parries 1 and 2 are **0.34 s apart**, with nothing marking them as separate |

### 4.2 Summary of micro-pacing differences

1. **Tempo.** Our cast clock is a strict metronome: 1.12 s for waves 0–7, 1.04 s for 8–15, 0.96 s for 16 and later, and 0.84 s for the finale, scaled ×0.88–0.97 by frustration.
   - The tempo **never changes within a wave**. Only the fight stage or frustration changes it.
   - References keep steady pulses inside an attack, but change sub-pattern every 3–8 s (B) or accelerate within the attack (A: −15% cadence and −30% warning lead; B tiny box 0.5 → 0.4 s).
2. **Phrase structure.** Ours: a cast is a 0.07–0.12 s ripple of 3–7 knives, or a single-frame wall of 15. B: one hazard per beat, or a deliberate set of 2–3. Our ripple is good: it echoes A's line stagger. But all knives in a cast follow almost the same path, so the ripple reads as one fat hazard.
3. **Rests.** Our only rests are **duelist lunge holes** (≈4 s: 1.02 s windup, dash, 0.18 s cut, 0.85 s recover, spawner reset).
   - They work like B's gather-then-strike, but the rest is *after* a climax, not *before* one.
   - We have no visible "loading" rest, like B's 2 s gather or 1 s "!" squares, before a climax.
   - We have no 0.5–1.5 s lulls between sub-patterns.
   - We have no hold at the end of a wave.
4. **Dodge demand.**
   - Required dodges at peak: 3–6 per second in ours, 2–4 in the references.
   - Median near-pass gap: 0.25–0.9 s in ours, 0.37–1.0 s in the references.
   - Simultaneous live hazards: often 20–60 in ours, 3–35 in the references.

   Our density is at or above the references, but each hazard is slower and less dramatic. Ours feels like *many slow things*; the references feel like *few fast things*.
5. **Warning lead.** Our warning leads are already in the reference range: knives 0.42–0.90 s, beams 0.90–1.30 s, orbit release 1.65 s, lunge windup 1.02 s. The problem is not timing but **visibility**: an 18% ghost, invisible outside the box, a 45% dashed line.

## 5. Per-pattern comparison and suggestions

The builders shared by many patterns are fixed once in §6. This section lists each pattern's closest reference, what already works, and its specific gaps.

| # | Pattern (design name) | Closest reference | What ours does well | Specific gaps → suggestion |
|---|---|---|---|---|
| 0 | `knife`, MAY I? (3-knife aimed fan from her SOUL) | B knife-cloud single drops; A star snipe | Knives leave her SOUL (clear cause). 0.12 s ripple. Burst-then-rest with lunges. | The three paths almost overlap, at 218 px/s. → Have the knives appear at her SOUL and **rotate from her facing to the aim over 0.2 s** (a visible tracking arc). Add a 2-frame white glint on each blade 0.08 s before launch, and a 6 px wind-back. Keep the arrival time the same (see §6.2). |
| 1 | `fan`, TWO STEPS AHEAD (`sideCuts(5)` from the walls, plus a top knife) | B flanking lunges | Side origin matches B. Aimed at the SOUL. | Ghosts are clipped, so knives appear from nowhere. Five knives from one point form a clump. → Draw the pre-phase outside the clip. Spread spawn points ≥14 px along the wall. Have each knife **slide 10 px into view and hover pointing at the SOUL** for its delay, then launch. |
| 2 | `chain`, WALK WITH ME (falling knife rows with a feint gap) | A guillotine combs / line volleys; B wall teeth | Readable gap. The feint, where Aqua walks to a false gap first, is a strong rival trick. | 1.12 s metronome ×14. All 15 knives drop on the same frame. Tips at 18%. → Make the row **"rattle"**: tips jitter 1 px for the last 0.15 s and flash cyan on release. Release knives from the gap outward, 0.01 s apart, a 0.1 s zipper. Every 4th row, do a quick pair of rows 0.56 s apart, then skip a beat. |
| 3 | `circle`, DANCE CARD (rosette of 9 plus a beam every 3rd cast) | B finale knife ring; B corner X spin | The spinning ring is the most reference-like image we have, and its ghost is visible. | All 9 converge on one point and stack into a white blob (`05-ring.png`). → Release them **in sequence around the ring, 0.06 s apart**. Each knife stops spinning and points at the SOUL for 0.1 s before it goes. Lead the beam with the paired-line warning. |
| 4 | `stop`, HOLD THAT THOUGHT (cyan/orange knife walls plus a beam) | B cyan/orange knives; B crosshair | The colour rule carries over. The beam is aimed at the SOUL. | Coloured knives slide out of the clipped wall with no tell. The beam is static. Beam gaps alternate 2.25 s / 1.11 s. → Coloured knives **hang half-visible at the wall edge**, with a coloured tip 4 px past the wall, during their delay. Add the beam profile from §6.3. Make the beam bar pick up the knives' colour edge (2 px cyan/orange rim) so "stay" and "move" read at a glance. |
| 5 | `blue`, BORROWED GRAVITY (rows under gravity plus a vertical beam) | A pistons; B floor teeth | Gravity-oriented gaps. | As in `chain`. → Add a **floor glint**: 1 px tips along the floor brighten 0.2 s before the next row lands. Add a small 2-frame dust spark where knives hit the floor, so the impact reads. |
| 6 | `menu`, HANDS WHERE I CAN SEE (curtains plus `sideCuts(3)`) | B breathing-box knife pairs | Curtain gap follows the player. | Curtains appear from outside with no tell. → Show a **cyan 2 px gap marker** on both walls at `gapY` for the 0.9 s delay; it is where the opening will be. Make knives in a curtain release top to bottom 0.015 s apart. |
| 7 | `memory`, I REMEMBER THAT STEP (3 parallel beams on an old position, plus duet) | B crosshair (fixed where the SOUL was); B lattice | A story-driven idea. | Nothing shows *what* she remembers. → Draw a **hollow purple afterimage of Seth's SOUL** at the remembered spot for 0.35 s before the warning, using the existing graze-outline style, then fire the 3 beams in a lattice-style ignition 0.13 s apart (the timing already does this). |
| 8 | `split`, ROOM FOR TWO (half-box flood plus top knives) | B box move / breathe | The CROSS label is clear. | The flood is a static 14% rectangle that turns solid. → **Fill the flood like a gauge** from its outer wall across the warning time, so the player can read the countdown. On live, flash white for 2 frames, then fade over 0.3 s. Tween the split box in over 0.5 s instead of snapping it. |
| 9 | `spin`, TAKE THE LEAD (rows plus crosshair beams; small box; body beside the box) | B crosshair (turn 2) | Crosshair matches B. Her body sits beside the box. | Beams are clipped to the box, so they never touch her. → Draw beams across the whole stage **from her hand**: she switches to pose 3 (point) when they fire, and the band starts at her knife. |
| 10 | `cyan`, PATIENT HANDS (4 slow inward knives on the orbit ring) | B finale cyan ring | Her colour, her rules; the ring guide is drawn. | 4 knives at 124 px/s on a 1.04 s metronome for 20 s: the flattest wave in pacing. → **Queue the 4 knives on the outer ring, spinning in place**, then release them one by one (0.15 s apart) in her orbit direction. Every 5th cast, add an 8-knife ring that holds 0.4 s (a "hold still" beat). |
| 11 | `ribbon`, TIED TO YOU (diagonal beam plus side cuts; moving box dragged by a red line) | B box slide (turn 9) | **The best cause and effect in the fight**: she visibly drags the box. | The sine drift has no anticipation. → Add a 0.15 s **pull-back** in the opposite direction before each big swing, and pulse the red line brighter on each tug. |
| 12 | `items`, PACKED FOR TWO (curtains, duet 5, beams) | B special (different vocabulary) | — | Looks the same as `menu`/`duel`. → Give it **its own vocabulary**, as B's special did. Spawn the duet from a tossed pie or item prop that bursts into knives: a 3-frame scale-in from 0.6 to 1.0 and a pop of 6 white pixels. |
| 13 | `mirror`, THE SAME RULES (two 5-fans from both top sides) | A converging pairs; B L-shaped pairs | Symmetry matches the theme. | Both fans fire on the same frame. → Fire them as **call and response**: left fan, then the right fan 0.25 s later, mirrored. |
| 14 | `scare`, LOOK AT ME (`sideCuts(6)` plus a scare beam) | B mirror-phase flashes | The jumpscare exists and respects reduce-motion. | No set-up. → Starting 1 s before the scare beam, **dim the box border to grey** and stop spawning (a held breath). Then flash for 10 frames with the face. |
| 15 | `talk`, DON'T BLINK (talks while throwing duet 7 and curtains) | B turn 1 (speech interleaved with attacks) | Talk-and-throw matches B. | 7 knives leave at once at 0.42 s lead. → Sync **pose 3 (point) to each duet** for 0.2 s, with the speech bubble bouncing 2 px on the throw. |
| 16 | `steal`, MY BUTTON NOW (knives rise from the menu buttons) | B MERCY slash (UI as target) | Hazards come from the UI, a true rival-player move. | The button does not react. → The source button **flashes cyan and shakes 1 px** during the 0.65 s delay, and the knives emerge from its top edge, as with MERCY in B. |
| 17 | `orbit`, STILL MOVING (rosette of 12) | B finale knife ring | Dense ring look. | Same single-point convergence as `circle`, with a 5/s peak. → Sequenced release as in `circle`. Alternate the spin direction per ring (the code already alternates `i%2`) and **show the direction** with a faint 2 px trail on the leading knife. |
| 18 | `reverse`, TURNABOUT (curtains plus rows) | B breathing box | — | Metronome at 0.96 s. → Insert a **one-beat rest every 5th cast**, with a heart-pulse cue (§6.5) on the rest beat. |
| 19 | `attrition`, NOT TIRED YET (alternating curtains, rows, duet 6) | B item breather (deliberately easier) | Alternation gives variety. | → Make it *look* tired. Aqua's body uses pose 4 (tired) between casts and pose 5 on casts. **Lengthen her body's bob** to 1.5 s, with a 4 px sway. |
| 20 | `save`, NO WAY BACK (rosette 7, X beams, fake SAVE) | B save/reload talk; MERCY slash | The fake SAVE is a great rival trick. | The densest wave (6/s peak, near-pass median 0.27 s) with no breathing room. → Release the rosette in sequence. Make the fake-save box **appear with the real save-point glow** (a 3-frame white scale-in), and stop spawning while it is on screen. |
| 21 | `break`, BREAK THE FRAME (box rotates ±90° every cast) | B mirror phases (flip with flashes) | A strong concept. | The rotation eases with no punctuation. → Bracket each 90° turn with a **4-frame cyan edge flash** and a 0.1 s hold before the rotation starts (anticipation). |
| 22 | `duel`, JUST YOU AND ME (curtains, duet 5, beams) | B regular mid-fight turns | — | → Use it as the first wave with **visible TP spending**: when Aqua pays, a cyan drop leaves her TP bar and flies to her SOUL. Each duet starts there. |
| 23 | `last`, ONE MORE TIME | B finale; A vortex | Phase structure. Fullscreen knives outside the box with a safe lane. Jumpscare. Stage tilt. | See §6.7. No ceremony, no cut, HUD always on, no rests between phases. |
| — | `patience`, STILL WATERS (100 TP, 24 s) | B announced special | A real 3-phase structure. | Phases change mid-stream. Her body is pushed out of frame. → Give a **2–3 s announcement** (a cyan "STILL WATERS" title card in the box). Put a 0.8 s hold plus a heart pulse at t = 6 and t = 18. Keep her body fully on-screen at reduced height. |

## 6. Cross-cutting fixes, in priority order, each implementable

### 6.1 Make every pre-phase visible

Biggest win, no balance change.

- **Draw outside the box.** In the render loop, draw knives in `age < delay` (and their "!") in an **unclipped pass**, as fullscreen hazards already are.
  - Use ≈45% alpha, rising to 70% in the last 0.15 s.
  - Add a **2-frame white glint**: a 3x3 px highlight running along the blade 0.08 s before activation.
- **Show which wall knives come from.** Knives that spawn outside the wall should sit with their tip 4–6 px inside the box border during their delay.
- **Replace the grey "!".** Use a 2 px cyan bracket square at 100% alpha (Aqua's colour, our style), shown for the first 0.4 s of the delay.

### 6.2 A hover-then-strike profile for aimed knives

`knife`, `sideCuts`, `duet`, `mirror`, `target`/`fan`, the aimed director family.

**Today:** pop, then constant speed. **Proposed**, keeping each knife's *time of arrival* at the snapshot target equal to the current one, so fairness and dodge windows are unchanged:
1. hover for the existing delay;
2. 6 px wind-back over the last 0.1 s of the delay;
3. accelerate from 40% to 160% of today's speed over the first 0.12 s of flight.

This puts us closer to the references' "long tell, fast strike" without the 6x speed jump. **This affects feel and must be play-tested.** Fast knives become harder to react to late but easier to read early. `knifeDistance` and the swept collision already use the true position, so hitboxes still agree.

### 6.3 Beam profile and origin

`beam()`, `mark()`, `menuAttack`.

- **Warning.**
  - Replace the 45% dashed line with a **solid 2 px line flickering cyan ↔ white at 6 Hz** (10 frames per cycle).
  - For beams 14 px or wider, draw **two edge lines** at ±width/2.
  - Keep our two converging knives: they are a good signature. Let them slide 20 px toward the centre during the warning, so they act as a countdown.
- **Live.** Width ramps from 40% → 100% over 2 frames. Hold. In the last 4 frames, thin to 2 px, with 1 px for the final frame.
  - For Aqua's own slashes (`mark` in choreography), add a **≈20° swing** about the end nearest her during the live time. The swing must be mirrored in the hitbox, or kept inside the drawn band.
- **Origin.** Draw the beam band in an **unclipped pass across the whole stage**, so it visibly passes through her body or starts at her hand. Collision stays as it is today, because the SOUL is confined to the box.
- **Aqua sync.** Use pose 3 on the warning, then pose 5 plus a 4-frame cyan smear (the existing `slash` prop, tinted) on the fire frame.

### 6.4 Knife sprite readability

- Add a **1 px black inner line**, or draw at 56x18 with a 1 px black stroke inset, so overlapping knives separate. Aqua's own knife in her poses is already a white outline with black inside, so this matches her art.
- Optionally make ordinary knives **64 px long** (4 SOULs, as in B). Only with proportional hitbox growth, because `bladeLength` drives `knifeDistance` and the hitbox would grow too. That adds difficulty.
- Spread fan spawn points along the source wall (≥14 px apart).

### 6.5 Sub-pattern cues and rests

The director/choreography only reshapes the spawn schedule; prices stay the same.

- **Heart-pulse tell.** Aqua's cyan SOUL drawn at 3x in the box at 30% → 0% alpha over 0.4 s, before:
  - the first cast of each wave;
  - every frustration pattern shift;
  - every Cyan Turn;
  - each phase change in STILL WATERS and the finale.
- **Phrase rest.** Skip one cast every 5–6 casts (for example `i % 6 === 5`) in pure-metronome waves: `chain`, `blue`, `cyan`, `reverse`, `spin`. Optionally place the tell on the rest beat.
- **End-of-wave hold.** No new casts in the final 0.8 s of `duration`, so the last hazards resolve before the box returns.
- **Within-wave acceleration**, as A does. Scale the cast interval from ×1.10 in the first quarter to ×0.92 in the last quarter. The average stays ≈1, so total pressure is unchanged.

### 6.6 Parry, graze and hit feedback

**Parry.** On `tryParry` and duelist cuts:
- Aqua's body switches to **pose 5 for 0.15 s, then pose 1**. She guards.
- A **"PARRY" label** in the Determination font, cyan with a dark outline, ≈200 px wide, centred over her head. It pops 12 px up over 2 frames, settles, and holds **0.7 s**. That is the shortened BLOCK callout the timing study recommends for 3 parries per exchange.
  - It shows "PARRY 2/3" and "LAST PARRY" states. On the 3rd parry it turns white, and the HUD "PARRY 0/3" blinks red twice.
  - Overlapping parries restart the pop. Two parries 0.34 s apart then read as two beats.
- A render-only **3-frame freeze** of her SOUL, a white flash on it, and `fx.ring(e.x, e.y, {color: '#3ee0ed', radius: 34, life: .2})`.
- `fx.kick(.12)`.
- The page **deflects visibly**: 6–8 paper-white shards along the reflected angle.

**Aqua hit.** Currently only a number. Add:
- a 2-frame white flash of her SOUL and **body**, as A's sprite flash does;
- a pose-4 flinch for 0.2 s;
- `fx.kick(.15)`.

**Graze.** Keep the hollow outline. While TP is being earned, add 2 px cyan or purple sparks that drift toward the matching slanted TP bar (render-only, about 4 per second).

**Seth hit.** Already good: red edge glow, shake and blink. Optionally add a 2-frame white SOUL flash before the blink.

### 6.7 Finale and STILL WATERS staging

Keep all mechanics, the timing of the fullscreen safe lane, and the jumpscare.

- **Cut.** On the first frame of `last`, cut the menu buttons, frustration text and TP labels for **one frame-exact cut** (B), or keep only the HP bar under the box (A, gentler and more readable).
- **Close-up.** Show Aqua at 2x height in pose 3 (knife point), using the existing portrait or pose art, before the first hazard. **1.5–2.5 s**, with the knife prop glinting.
- **Chapters.** Use the existing 8 s phase boundaries. Put a **10-frame white flash** and a **0.8–1.2 s empty-box hold** with a heart-pulse tell at each boundary.
- **Fullscreen knife chapter (24–32 s).** Dim the background stars and ambient to 40%, so the 108 px blades read as "outside the frame".
- **Last chapter.** Make the final 3 s a **cyan "hold still" ring**: cyan knives, which in our colour rules mean you must not move. Patience is Aqua's identity, so this is the most on-theme ending possible.
- **Ending.** Bring the UI back with a single flash.

### 6.8 Box behaviour

- **Tween** every arena change over **0.6–0.75 s** with ease-in-out: the split, spin, break and last boxes, and the return to ROOM. Today they snap at `beginWave`.
- **Anticipation.** Add a 0.1 s anticipation before each `break` rotation and each big `ribbon` swing.

## 7. What already matches or beats the references

These should be kept.

- **Warning leads** are in the reference range everywhere: knives 0.42–0.9 s, beams 0.9–1.3 s, lunge windup 1.02 s, orbit release 1.65 s.
- **Aqua's SOUL lunge.** A locked cyan path, a red arc, a 760 px/s dash with a trail, a cut, then a purple "Z" opening. This is a full reference-quality tell → strike → punish beat, and it creates natural 4 s phrase breaks.
- **Hazards that visibly come from Aqua.** Her SOUL (duet, knife, mirror), her hand (the ribbon line), the menu buttons (steal) and her body beside the box (spin, last). This cause and effect is stronger than A's and on a par with B's.
- **The hollow graze heart**, the slanted TP bars, the PARRY counter and the colour rules (cyan/orange). Grazing as a mechanic does not exist in either reference, and ours is legible.
- **Converging-knife beam warnings** are an original signature. Keep them, and only improve the line and the live band.
- **The finale's fullscreen knives with a persistent safe lane, the stage tilt and the jumpscare.** The ingredients are there; only the ceremony (cut, close-up, rests, flashes) is missing.

## 8. Caveats

- "Required dodges" for ours come from a passive, invincible Lissajous SOUL. A real player who pre-moves will see fewer near passes.
- For the references, near-SOUL white within 70 px is a proxy for a required dodge, and includes the player's own skill.
- Reference sprite sizes are measured at the video's resolution. Our sizes are canvas pixels.
- Director substitutions (`aimed`, `crossfire`, `ring`, `shield`, `spokes`) depend on the learned memory, which was empty in a fresh browser. Some casts in other playthroughs will differ from these logs.
- Hit-stop is suggested as a **render-only** freeze, to respect "ImpactFX never changes encounter state or timing". A true simulation pause would need a fairness review.
- Defensive local cuts (below half HP) and the recall were reviewed from code, not captured:
  - **Defensive cut:** a dashed cyan 58 px arc on tell (0.16–0.24 s), then a white 5 px arc and a knife sweep (0.12 s).
  - **Recall:** a cyan arc trail, the SOUL fading over 0.65 s, and "AQUA WITHDRAWS".

  Both are clear. They would benefit from the same pose sync and parry label treatment as §6.6.
