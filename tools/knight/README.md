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
- `src/attacks.js`: the hearts' moves (after DELTARUNE's Roaring Knight fight and the secret Gerson fight, the designer's references), the four Undertale waves, the Deltarune turns (one move from each heart in order), the UNIFIED waves (including the green-shield HAMMER OF JUSTICE) and the finale, A NEW WORLD. `startAttack(plan)` takes a plan to play a chosen wave (screenshots, tests).
- `src/knight-art.js`: draws the Knight's frames, Seth, Gerson and the painted rooms, plus the live parts (echo flowers, ceiling gems, the crystal, the stream).
- `src/audio.js`: the designer's battle theme, "Your Humble Service" (both halves and the finale; silent during the roar, then it resumes), a synthesized walk arpeggio, UNDERTALE's own effects, synthesized graze/shatter/roar, and the designer's snd_txt1.
- `src/page.js`: rendering (both UIs, the break, the Roaring-Knight-style backdrop with its colour arch and fog, the star void), input and touch targets.
- `art/knight-anim.png` and `.json`: **the designer's White Roaring Knight sprite sheets**, cut by `tools/extract_sheets.py`: 24 eight-frame body animations (idle, phase 2 and 3 idles, slashes, thrust, cleave, dash, star and diamond storms, orbiting blades, ground slam, teleports, roar, hurt, defeat, arrival, finale ascend...) and 16 four-frame effects (sword, star, diamond, crescent, ground spike, light beam, reticle, vortex ring, heal heart, hammer, ring pulse...). Names follow the designer's own sprite viewer. Each entry is `[x, y, w, h, anchorX, anchorY]`. Saved as a 255-colour indexed PNG.
- `art/seth2.png` and `.json`: **the designer's Human Seth pack**, by the same tool: 14 body animations (idle, walks, casting, reading, laughing, kneeling, offering a hand...), his glasses-shield, glasses and floating-page effects, and eight portraits. Used for the walk, the Deltarune-side Seth and his dialogue portraits.
- `art/knight.png` and `.json`: the Knight's dialogue portrait, still cut from the concept sheet by `tools/extract_knight.py` (no portrait came with the sheets).
- `art/gerson.png` and `.json`: Gerson's shopkeeper portrait (and his armoured pose), cropped from the art in `games/gerson.html` by the same tool.
- `art/rooms/`: the shop, the old path, the cavern and the battle backdrop, painted at 1x by `tools/paint_rooms.py`.
- `audio/theme.mp3`: "Your Humble Service" (DELTARUNE fan track), supplied by the designer, trimmed of its 2.3 s silent tail so it loops.
- `audio/`: `damage`, `select`, `slash`, `ding`, `heavy` (UNDERTALE's) and `txt` (the designer's snd_txt1), copied from `tools/marigold/audio`.
