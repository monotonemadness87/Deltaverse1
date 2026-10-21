# Changelog

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
- In Aqua the Notebook panel covers the TP bars while it is open.
