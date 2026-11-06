# The White Roaring Knight: A New World

These files build `games/knight.html`, a pacifist-only Waterfall encounter.

```sh
python3 -I tools/knight/build.py
```

- `src/story.js`: every line: Gerson's shop, the echo flowers' wishes, the crystal, the Knight (each line tagged with the heart speaking: blade, wild or hope), the ACTs, the break and the ending.
- `src/world.js`: the walk: Gerson's shop → the old path (four echo flowers; the crack at the far end only opens once Gerson has told you about it) → the crystal. Touching it wakes the Knight.
- `src/engine.js`: the battle. It starts as an Undertale battle (`ui: 'ut'`, the Torn Notebook FIGHT contract `target` → `fight` → `attackCursor`). After four waves the Knight roars (`state: 'uibreak'`), and it continues as a Deltarune battle (`ui: 'dr'`) with:
  - TP from grazing, DEFEND, and Seth's spell PERSEVERE (40% TP);
  - FIGHT as Deltarune's timing bar;
  - FIGHT / ACT / ITEM / SPARE / DEFEND;
  - two MERCY bars, the Knight's (raised by Seth) and Seth's (raised by the Knight), and the mutual spare.
- `src/attacks.js`: the hearts' moves, the four Undertale waves, the Deltarune turns (one move from each heart in order), the UNIFIED waves and the finale, A NEW WORLD.
- `src/knight-art.js`: draws the Knight's frames, Seth, Gerson and the painted rooms, plus the live parts (echo flowers, ceiling gems, the crystal, the stream) and the Deltarune grid backdrop.
- `src/audio.js`: a synthesized placeholder score (walk, Undertale half, Deltarune half, finale), UNDERTALE's own effects, synthesized graze/shatter/roar, and the designer's snd_txt1.
- `src/page.js`: rendering (both UIs and the break), input and touch targets.
- `art/knight.png` and `.json`: **placeholders** cut from the designer's concept sheet by `tools/extract_knight.py` (phase 1 to 3 sprites, back, five action poses, crystal spikes, portrait, detail close-ups). Replace them when the designer's real sprite sheets arrive. The concept sheet itself is not committed.
- `art/gerson.png` and `.json`: Gerson's shopkeeper portrait (and his armoured pose), cropped from the art in `games/gerson.html` by the same tool.
- `art/seth.png` and `.json`: human Seth's walk, copied from `tools/marigold/art`.
- `art/rooms/`: the shop, the old path, the cavern and the battle backdrop, painted at 1x by `tools/paint_rooms.py`.
- `audio/`: `damage`, `select`, `slash`, `ding`, `heavy` (UNDERTALE's) and `txt` (the designer's snd_txt1), copied from `tools/marigold/audio`.
