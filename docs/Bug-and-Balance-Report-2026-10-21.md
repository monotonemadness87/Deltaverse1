# Bug and balance hunt — 2026-10-21

Automated play of every fight using the harness in `tools/sim/` (see its README). Covers the builds as of the location-atmosphere commit (Aqua R31).

## What ran

| Run | Scale |
| --- | --- |
| God-mode progress bots (12 engines) | 3 seeds × 40 simulated minutes each = 24 h of play |
| Normal-play chaos bots (12 engines) | 4 seeds × 20 simulated minutes each = 16 h |
| Muffet (in-browser engine bot) | 2 × 40 min god mode, 3 × 20 min normal |
| Balance probe | Each fight played twice for 15 min: standing still, and wandering randomly, always choosing FIGHT; damage per attack pattern |
| Browser button-masher on the real exported pages | 13 builds × 90 s: ~9,500 random Z/X/Enter/arrow/WASD presses, including 200+ pause/unpause toggles mid-fight |

The bots check every simulated half-second for exceptions, non-finite numbers anywhere in the engine snapshot, HP outside 0–max, negative enemy HP, and stalls (no change in state, turn, HP or enemy HP for 150 s while input continues).

## Results

**No crashes, no invalid numbers, no soft-locks, and no page errors in any build.**

Every fight is completable. In god mode the bots reached:

| Fight | Reached |
| --- | --- |
| Encore, Rift, Battle Lab | Won and fled endings, repeatedly |
| Gerson | Victory at turn 17 on every seed (the approved 17-turn pacing) |
| Mettalot | Won, 870–1080 s |
| Sans — No Promises | Won at ~300 s on every seed |
| Sans + Alphys | All 40 waves on every seed; won on 2 of 3 (see the charged-gate note below) |
| Flowey | Reached the "escaped" ending at turn 25 |
| Ant Tenna + Spamson | Victory at turn 27 on every seed |
| Spamson NEO | Won in 14–21 turns |
| Muffet | Survived to turn 60, where the designed web trap closes and is fatal |
| Aqua — full duel | Won on all 3 seeds (860–1240 s), passing the R28 finale gate: ten items used, critical recall, earned ONE MORE TIME |
| Aqua — finale practice | Won in under a minute, repeatedly |

## Findings for a decision

Item 1 was fixed as recommended. Items 2 and 3 are left as designed unless you decide otherwise.

### 1. Ant Tenna + Spamson — "THE FALLING PUNCHLINE" can be won by standing still — FIXED

**Fixed 2026-10-21.** Drops now land on eleven staggered slots spanning the whole floor, shifted half a slot on alternate waves. The column formula also had an aliasing bug: `(w*2 + k*3) % 6` put the third anvil in the same column as the first, so each wave had only two distinct drops. Now each wave has three distinct drops (two with BRACE). Over 40 waves every floor position is threatened except a 4 px wall margin. The standing-still bot now takes 40 damage/min (was 0); a random dodger takes 60/min, in line with the other comic patterns. Original finding:

Its anvils only ever drop into six fixed columns (centres at x = 169, 247, 325, 403, 481, 559; 46 px wide; 24 px with BRACE). The arena spans x = 104–664, so:
- x = 104–146 at the left wall and x = 582–664 at the right wall are never hit;
- the 32 px strips between columns are never hit;
- the SOUL starts at x = 290, inside one of those strips.

The standing-still bot took zero damage for the whole turn. **Proposed fix:** shift the column set by half a spacing on alternate waves and extend it across the full arena width, so every spot is threatened at some point and the telegraphs have to be read. (Every other pattern in the collection hit a player who stands still, apart from item 2 and the Battle Lab test patterns.)

### 2. Spamson NEO — "crossfire" is safe for a player who doesn't move

Both fans are aimed 20 px above and 20 px below the SOUL (`{x:s.x, y:s.y±20}`), so holding still threads between them by construction. This looks like a deliberate "don't move" pattern (like Undertale's blue attacks). Is that the intent? If not, aiming one fan at the SOUL itself would close it.

### 3. Ant Tenna + Spamson — the opening turn is the harshest opener in the collection

"WARM-UP PHRASE" lasts 18 s against Seth's 30 HP. The random dodger took ~44 damage in it (11 hits), and even the standing-still bot took 24. It was the only opening turn the normal-play bot never survived in 80 simulated minutes; in every other fight the same bot cleared several turns. Bots aren't players, but for a turn named "warm-up" in a pacifist boss rush that's worth a look.

### Lower priority

- **Battle Lab:** "rain" and "rings" never hit a player who stands still. It's a test sandbox, so probably fine.
- **Aqua — "save" (TRY AGAIN):** the standing-still sample was only 6.6 s, because the scripted fake checkpoint interrupts the wave. Inconclusive; no claim.

## Checked and intentional

- **Sans + Alphys steel relays have infinite HP:** `r.hp = r.steel ? Infinity : …`. These are the bullet-proof steel cells.
- **Sans + Alphys final wave can run long:** `finishAttack()` refuses to end the wave until a charged shot breaks the blaster gate (the "real charged-skull gates"). The random bot broke it on 2 of 3 seeds.
- **Muffet turn 60 is fatal** even in god mode, as designed.
- **Mettalot and Sans restart from the death screen** through the page script's `reset()`, not the engine; the browser masher covered that path.

## Limits

Bots play the engines; the Notebook wrappers, touch controls and rendering were covered separately by browser checks. Random bots are not humans: their damage numbers are relative signals for comparing patterns, not difficulty ratings, and surviving with god mode is not a no-hit proof. No phone hardware or audio was tested.
