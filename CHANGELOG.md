# Changelog

## 2026-10-22 — Aqua R34: readable knives, staged beams, parry callouts

Reworked from the reference study (`docs/reference-study/aqua-attacks-lookfeel.md`). Every wave keeps its length, and all mechanics and prices are unchanged. Both builds (full duel and finale practice) are re-stamped **R34**.

- **Warnings you can see:** knives that start outside the box now show their warning there, with a ghost that firms up and a glint just before launch, and a cyan bracket where a wall knife will cut in. Before, side cuts, curtains, fans and the STOP walls arrived with no visible warning.
- **Knives strike:** aimed knives hover, pull back slightly, then accelerate, arriving at exactly the same moment as before. Fans and multi-knife casts spread along the wall instead of stacking, and knives have a thin dark inner line so overlaps stay readable.
- **Beams:** a flickering warning line with edge lines at the true width, then a live beam that opens, swings slightly and thins, drawn from Aqua's hand. Its drawing and hitbox match. Her pose points while it aims and slashes when it fires.
- **Aqua reacts:** she reaches when casting, guards when parrying and flinches when hit.
- **Parries:** a "PARRY n/3" callout ("LAST PARRY" on the third) pops up at the parry for 0.7 s on a black plate, with a cyan ring and a brief freeze of her SOUL. The HUD counter blinks red when she's out.
- **Arena:** the battle box tweens into and out of each arena instead of snapping.
- **Rhythm:** each phrase opens with a faint cyan tell, casts speed up within a phrase, phrases are separated by short lulls, and the wave builds overall. Most waves end on one warned finisher slash.
- **Finale (ONE MORE TIME):** a hard cut, a ~2 s close-up card with HP still visible, chapter breaks with a flash and an empty-box hold, and a closing cyan "HOLD STILL" ring. By the cyan rule, the ring only cuts a moving SOUL.
- **Also fixed:** a cast-order bug introduced mid-rework, which would have changed which casts carry beams; the finale ring now has real hitboxes matching what is drawn; the wave title no longer crosses the close-up; Aqua's body follows box tweens; the HOLD STILL text no longer overlaps the rotated box.
- Reduced motion: steady warning lines, no chapter flashes, no kicks.
- Verified: god-mode bots win every seed in both builds, passing the finale gate, with no errors; normal-play deaths match the original. Per-pattern damage (12 runs per pattern, old → new): every pattern is within ±50%. The largest changes: ribbon +49% for a player standing still, reverse +40% for a randomly moving player, mirror and scare +32%.

## 2026-10-21 — Gerson: phrased attacks and real impacts

Reworked from the frame-by-frame reference study (`docs/reference-study/gerson-attacks-lookfeel.md`). Every turn keeps its exact length (16–25 s, finale 58 s) and all mechanics.

- **Rhythm:** attacks follow phrases instead of fixed timers. Shield turns open with slow arrows, then left/right pulses, then same-side runs of 2–4 with real rests between. THE OLD GUARD widens from left/right to all four sides mid-turn. String and hybrid turns run in phases and build to their busiest stretch at the end.
- **Finishers:** every turn ends on a readable finisher (a heavy blinking arrow, or a double hammer strike), then settles before the box leaves. Bullets are no longer deleted mid-flight, and no hammer winds up after its turn ends.
- **Hammer strikes:** the lane fills like a fuse, flashes before landing, then lands with a white lane flash, after-images, dust, a small shake and a thud. Gerson swings on the strike frame.
- **Box:** spins in and out quickly, and each mid-turn spin is caused by a visible swing (0.45 s, slight overshoot) instead of a slow drift. The first hazard comes ~0.55 s after the box is ready.
- **Blocks:** white-then-purple shield flash, gold sparkles, a small recoil and a visible (capped) jolt.
- **Readability:** arrows are amber so they no longer match the green shield, SOUL and box; the next arrow due turns red. Shells show a grey ghost before moving. Gerson gestures on each run and wall, breathes when idle, and stays on screen through the finale. The finale is five phases ending in a ring that closes with one opening, then bursts.
- **Also fixed:** the SOUL no longer flickers at the start of every turn; the 7-lane box no longer covers the enemy HP bar; "+5 HP" no longer covers the SOUL; finale arrows always get their full warning time.
- Reduced motion: no rotation, after-images, smear, shake or bursts.
- Verified: god-mode bots win at turn 17 on every seed with no errors; normal-play bots now reach turn 17 on every seed (fewer deaths, because the rests are real); per-attack damage mostly within ±25% of before; a careful-play bot took 8 hits over the fight versus 17 before.

## 2026-10-21 — Aqua: Notebook panel clears the TP bars

- **Aqua (full duel and finale practice):** the Torn Notebook panel was drawn across the inner edges of the SETH and AQUA TP bars, hiding them and their percentages while it was open. It is now narrowed to x 44–724, between the bars; the timing bar (x 67–701) still sits inside it.
- The shared Notebook module (all 13 builds) gains optional `game.notebookPanelX` / `game.notebookPanelW`, alongside the existing Y/H overrides. Every other fight keeps the default position.
- Aqua builds re-stamped **R33**.

## 2026-10-21 — Tenna's "determined" face redrawn

- The truncated `tenna-determined.png` (see Pixel pass 3) is now complete, so the expression shows its own face again instead of borrowing the cocky head. Rows 0–168 are the original pixels, unchanged. Rows 169–241 are a redraw that continues the surviving lines: the teeth box's sides and its two tooth separators run down to a rounded bottom edge parallel to the smile line (a wide, gritted grin), the left cheek mark is finished, and a matching right one is added. The chin outline is Tenna's own, taken from the clenched head (the same depth below the mouth) and fitted to this head's width. The fill is sampled from the original lavender (the same color and grain to within a level). The sprite config notes which rows are redrawn. Spamtenna, Flowey and Muffet carry the same file.
- Balance items 2 (Spamson NEO crossfire) and 3 (the Ant Tenna + Spamson warm-up turn) stay as designed, as confirmed.

## 2026-10-21 — Animation pass: typewriter wrap and Mettalot's sway

Stepped every fight frame by frame on a fixed 60 fps virtual clock (rAF and `performance.now` driven by hand). Captured four 48-frame bursts per fight (menus, dialogue, attacks), then scanned them for one-frame flicker (pixels going A→B→A, with shakes and flashes excluded), sprite pops and anchor jumps, and reviewed motion strips by eye.

- **Typewriter text no longer jumps lines (all 13 fights).** Every typewriter wrapped only the part typed so far, so a word reaching the end of a line was typed there and then jumped to the next line once it no longer fit ("almost n" → "almost / no"). Each fight now lays out the whole line with its own wrap rules and then reveals the first characters, so every word is typed where it ends up. A shared `typedLines` helper in each page maps characters back through the wrap. It was checked against every reveal length for greedy, indented (Battle Lab) and whitespace-collapsing (Ant Tenna + Spamson) wraps: lines only grow, never move. Muffet keeps measuring its smart-quote/ellipsis substitutions as drawn.
- **Mettalot's ghost, gloves, Blooky and stage glow swayed unevenly.** They were animated straight from the music element's clock, which in Chromium advances 9–27 ms per 16.7 ms frame, so the beat-driven motion sped up and slowed down every frame and the gloves stepped back and forth. They now follow a frame-rate clock eased toward the song: frame steps 16.67 ± 0.3 ms (was ± 4.2), within −0.7 ms of the music on average, snapping on pause, loop and restart. The rhythm notes still schedule from the real music time, so timing is unchanged.
- **Checked and fine:** idle loops and pose changes in every fight (no anchor pops or one-frame sprite drops), Encore's leaps (smooth, about 17 px per frame), Notebook timing bars, hurt shakes and flashes, Muffet's hands, Flowey's vines, the falling knives and blasters.

## 2026-10-21 — Pixel pass 3: broken Tenna head

- **Tenna's "determined" head was cut off mid-mouth.** Decoded all 228 images embedded in the fifteen games; one is damaged: `tenna-determined.png` (Spamtenna, Flowey, Muffet) stops after 169 of its 242 rows. It was already damaged in the original v60 hub, and no intact copy or source atlas exists anywhere in the project. Chromium draws the surviving rows, so Tenna appeared with the bottom of his head sliced off: for 0.7 s on every other wave cue in Ant Tenna + Spamson, and often during Flowey's Spamson NEO memory. The expression now uses Tenna's intact **cocky** head (the nearest face: a confident toothy grin), with a note in the sprite config. The damaged data is left in place. Muffet never shows this face, so its change is config only.
- Not redrawn: completing the lost rows would be new art. Ask if a redrawn "determined" face is wanted.

## 2026-10-21 — Pixel pass 2: Encore

- **Encore's expression overlay drew a black rectangle.** To swap in the authored expression, both of Encore's draw paths painted a solid black box over the face and then pasted the portrait crop, including a grey sliver of the hat band. The box was bigger than the face, so it cut through the hat brim, feather and collar. The expression is now cut out as the face itself: the connected face shape plus the eyes and mouth inside it, unioned with the neutral face shape so the old face is always fully replaced. The lifted-mask "void" expression becomes face-shaped darkness with eyes.
- **Encore's moving poses** were 1/3-scale sprites enlarged 1.27× times the animated boss scale, so pixels were uneven and crawled as the scale changed. They are now built at exactly their on-screen size with Encore's own coverage rule (cached per size) and drawn on whole pixels, with the face overlay aligned to the same pixels.
- Tried and rejected: area-averaging Encore's standing pose washed out its thin black interior lines (eyes, buttons, seams), so that pose keeps its original sampling.

## 2026-10-21 — Pixel pass 1: even pixels and crisp line art

Audited every sprite draw in every fight: smoothing state, effective scale, stretch, source rectangles and call site. Then inspected each boss at its native canvas resolution, enlarged 3–12× with hard pixel edges. No fight upscaled with smoothing on. The problems were uneven pixels from fractional enlargements, and soft source art sampled too sparsely.

- **Aqua (portraits and battle poses):** were reduced to 128 px and then enlarged 1.05–1.53×, so outlines alternated between 1 and 2 pixels thick and broke into dots. They are now reduced straight from the full sheet to their on-screen height with area averaging, then snapped to the same flat palette: one even pixel per canvas pixel, continuous outlines, clearer eyes, mouth and bow. Props (knife, bow, clock, …) already used whole-number scaling and are unchanged.
- **Rift (Hollow Crown and its props):** were nearest-sampled from a 1536 px sheet at about 0.1×, catching scattered soft edge pixels, so the crown's white outlines came out thin, grey and broken. Now area-averaged to the exact size and snapped to white-on-black: solid, crisp lines.
- **Mettalot, Blooky and the gloves:** were 64 px frames enlarged 2.44× (mixing 2- and 3-pixel columns). Frames are now rebuilt at the exact number of game pixels they show (78 for the 156 px ghost) and enlarged by a whole number: the same size and chunky style, with every pixel even and the outline continuous.
- **Torn Notebook sprite (all 13 Notebook builds):** the 44 px frames were drawn at 2.4–2.58× in the 768 px fights. They now snap to whole-number scales: 2× while spinning (the size the 640 px fights already used), 3× on impact.
- **Checked and left as is:** Encore, Gerson, Sans, the blasters, Muffet, Spamtenna's moth and the in-battle SOUL were already crisp. Spamson NEO's softness is mostly its black anti-aliased outline against black; the alternatives tried were not clearly better, so it is unchanged.
- Aqua builds re-stamped **R32**.

## 2026-10-21 — Punchline camping fix

- **Ant Tenna + Spamson, THE FALLING PUNCHLINE** (and ONE LAST LITTLE THING, which shares its drops): anvils now land on eleven staggered slots across the whole floor, shifted half a slot on alternate waves, so standing in a wall band or a column gap no longer avoids every drop. This also fixes the column formula repeating the first anvil's column for the third, so each wave now really has three distinct drops (two with BRACE). Warnings, timing, speed and damage are unchanged. Verified: still bot 0 → 40 damage/min, random dodger 60/min; god-mode bots still reach victory at turn 27 with no errors.

## 2026-10-21 — Bug and balance hunt, simulation harness

- Added `tools/sim/`: a Node harness that loads each fight's engine straight from `games/*.html` and plays it with bots (chaos/progress bot, balance probe), plus an in-browser bot for Muffet. See its README.
- Ran ~40 simulated hours of bot play across all 12 engines, Muffet's engine in the browser, a balance probe of every fight, and ~9,500 random key presses against the real exported pages. **No crashes, invalid numbers, soft-locks or page errors.** Every fight was completed in god mode.
- Found three balance/design questions, reported for a decision and not changed: a camping hole in Ant Tenna + Spamson's "THE FALLING PUNCHLINE", Spamson NEO's "crossfire" being safe for a still player, and Ant Tenna + Spamson's unusually harsh opening turn. Full details are in [docs/Bug-and-Balance-Report-2026-10-21.md](docs/Bug-and-Balance-Report-2026-10-21.md).

No game files changed in this step.

## 2026-10-21 — Location atmosphere

Each fight now has a light, location-themed atmosphere behind the battle (`AmbientFX`, in the shared Notebook module). It is drawn right after the fight's own background, so the arena, text boxes and sprites paint over it. That means it never shows inside the box where it could be mistaken for a hazard; verified at full resolution during attacks.

| Fight | Atmosphere |
| --- | --- |
| Encore | A warm stage light from above, with dust turning in it. Genocide: the light stutters and the dust greys out. |
| Rift | Quiet snowfall under a cold light. Cataclysm: muted, and the snow drifts upward. |
| Gerson | Waterfall's ceiling crystals twinkle cyan; a few motes drift up. |
| Mettalot | Pink and white glitter rising through her spotlights. |
| Sans, Sans + Alphys | Orange and blue CORE energy rising, with a heat glow from below. |
| Ant Tenna + Spamson | Hotland embers and a flickering heat glow from below. |
| Spamson NEO | A few neon pink and violet sparks hanging in the dark. |
| Muffet | Purple spores drifting under a faint haze over the nest. |
| Aqua | Ash settling in a cold light, with the odd cyan glint. |

Flowey (already has its living vine layer) and Battle Lab are unchanged. The atmosphere freezes when paused, holds still under reduced motion, and is off on title, death and Game Over screens. Aqua builds re-stamped **R31**.

## 2026-10-21 — Phone landscape

Phones (and tablets) held sideways now get a proper battle layout in every fight. The game fills the screen height, the D-pad sits in the left margin, and action buttons sit on the right. Before this, Mettalot, Muffet, Spamson NEO and Ant Tenna + Spamson had every control below the fold, both Sans fights rendered a 264×220 game, and Encore/Rift/Gerson scrolled.

- **Sans, Sans + Alphys, Mettalot:** controls float in the side margins; the Z button is large, with X beside it and ♪/Ⅱ/↻ above.
- **Ant Tenna + Spamson, Spamson NEO:** D-pad left, X and FIRE stacked right, PAUSE/SOUND in the top corners; the footnote is hidden in landscape.
- **Muffet:** three columns. Left: toolbar and D-pad. Centre: the arena. Right: the action panel (FIGHT/ACT/ITEM/MERCY and choice lists, scrollable if long), with BACK/CONFIRM below it.
- **Encore, Rift:** title and PACIFIST/GENOCIDE on the left, toolbar on the right, D-pad and X/Z in the bottom corners.
- **Gerson:** MOVE pad left, SHIELD pad and utilities right.
- On small phones (667×375, 740×360) the arena shrinks just enough for the side controls to fit, rather than overflowing.
- Landscape pages no longer scroll at all.

Applies only to `(pointer:coarse) and (orientation:landscape)`, so desktop and portrait layouts are unchanged (re-measured). Verified at 667×375, 740×360, 844×390, 932×430 and 1180×820: nothing off-screen, and tapping the on-screen confirm button advances every fight. Aqua and Flowey already had this layout and are unchanged.

## 2026-10-21 — Spectacle pass 1: impact and feedback

A shared effects layer (`ImpactFX`, inside the shared `notebook-visual.js` module in all 13 Notebook builds) runs as the last step of every frame. It re-blits the finished frame for camera shake (slightly enlarged so no bare edge shows), then draws shockwave rings, pixel shards and flashes. It is purely visual and never touches encounter state, timing, hitboxes or damage.

- **Torn Notebook impact:** strength scales with timing quality. Perfect strikes get gold shards, a stronger shake, a warm flash and a second shockwave ring. Ordinary shots that land on Aqua get a light version.
- **Timing stops:** each press answers on the bar: a gold spark burst for a perfect stop, a soft purple ring otherwise.
- **Seth hurt:** a short jolt plus a red glow pressing in from the screen edges, layered on each fight's existing hurt shake.
- **Set pieces, per fight** (via `fx.bind(game, map)` on each fight's own event names):
  - Gerson: hammer landing, shatter, vine-wall break, Aqua stealing the kill; a tiny tick on shield blocks.
  - Ant Tenna + Spamson: the explosion, transformation, menu blast, cannon shots and impacts.
  - Spamson NEO: the injection (pink flash), transformation, menu blast, cannon shots.
  - Muffet: slams, captures, the cannon, soul break. Only Seth's damage triggers the hurt effect, not Aqua's.
  - Sans / Sans + Alphys: blasters firing, gravity slams, gate breaks, CORE beams, Aqua's slashes.
  - Flowey: blaster blasts, control-warp flashes.
  - Aqua: Seth's special skills landing, her assault, parry ticks.
  - Every fight: a hard jolt on Game Over.
- **Fairness guard:** effects triggered by hazards during dodging (blasters, cannon fire, beams, slams) are capped to a gentle shake, so they never make the arena hard to read.
- **Reduced motion:** each fight's own "reduce flashes/motion" toggle is honoured (Encore, Rift, Flowey, Gerson, Aqua, both Spamson builds, Muffet), as is the system reduce-motion preference everywhere. With it on there is no shake, and flashes drop to 30%.
- Aqua full and finale practice re-stamped **R30**.

Verified with no page errors in any build, the hurt effect captured firing in all 12 Notebook fights, impact and timing-stop effects captured frame by frame, and all 17 hub entries launching.

## 2026-10-21 — Polish pass 1: visual defects and screen fit

Found by playing every build headlessly at desktop (1280×800) and phone (390×844) sizes and reviewing the frames. No mechanics, damage, timing, dialogue or art were changed.

### Torn Notebook overlay (all 13 builds that use it)

- **Empty frame lingering after the strike.** During the 0.52 s impact phase the overlay kept drawing its black panel and white border at full opacity, so an empty box sat over the encounter's next panel (Gerson's GUARDED readout, Aqua's duel arena, Sans's dialogue). The panel now clears in 0.14 s once the strike resolves. Encore, Rift and the Tenna/Spamson duo keep it, because they deliberately present their pre-strike state during impact and the next panel there is the same box.
- **Wrong position on 768×640 canvases.** The panel assumed a 4:3 canvas, so in Sans — No Promises, Sans + Alphys and Mettalot it sat ~45 px low, hid the HP row, and the encounter's own box peeked out around it. Builds can now set `game.notebookPanelY` / `game.notebookPanelH`; those three align it to their box. The timing content stays centred in the panel.
- **Contextual cue line.** Builds can set `game.notebookCue()`; Mettalot uses it to keep its pink "STRIKE A POSE" cue visible above the Notebook.
- Each installed Notebook now records its encounter `kind`.

### Encounter fixes

- **Mettalot:** the menu narration ("Three strings and a ghost who wants her name in lights.") was one centred line wider than the 420 px box; it now wraps inside it. The "GAP n" lane cue no longer prints over the METTALOT name tag — the tag fades out while a cue shows and the two cross-fade.
- **Sans — No Promises / Sans + Alphys:** the attack caption (e.g. "IMPACT · JUMP AWAY FROM THE BONES") was drawn straight over Sans's sprite; it now has a dark backing plate.

### Fit the screen (desktop, mouse + hover devices only)

At common laptop sizes (1024×700 to 1920×1080) seven builds were taller than the window, pushing the command row or controls below the fold. All battle builds now fit the window with no scrolling, at those sizes and inside the hub player:

- **Gerson:** both touch D-pads are hidden on desktop (WASD/arrows already drive them); the stage scales to the window height. Sound/pause/reset/X/Z buttons remain.
- **Ant Tenna + Spamson, Spamson NEO:** their "hide touch pad on desktop" rule was written `@media(...)and(pointer:fine)`. CSS parses `and(` as a function token, so the query was invalid and never applied; the syntax is fixed and the stage scales to the window height.
- **Mettalot:** D-pad hidden on desktop; stage scales to the window height.
- **Muffet:** stage scales to the window height.
- **Encore, Rift:** sizing formula was 5 px short; corrected.

Phone portrait and landscape layouts are unchanged (verified identical before/after with touch emulation).

### Builds

- Aqua full and finale practice re-stamped **R29** (`2026-10-21-R29`) on the HUD, title, pause build line and meta tag. The R29 changes are only the Notebook overlay fixes above. `AQUA_BUILD` is display/snapshot only, so no saved memory is invalidated.
- Hub rebuilt from `games/`; all 17 hub entries (15 files, three Tenna/Spamson variants) launch without errors, and extraction round-trips exactly.

### Verification limits

Automated headless Chromium only: scripted input, screenshots, layout measurement, console/page-error capture. Not a human playtest, not phone hardware, and no audio audibility check.

### Known, not yet addressed

- Phone **landscape** still scrolls in Mettalot, Muffet, Spamson NEO and Ant Tenna + Spamson (unchanged from before this pass).
- In Aqua the Notebook panel covers the TP bars while it is open. (Fixed in R33.)
