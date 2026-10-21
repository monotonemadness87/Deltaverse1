# Changelog

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
