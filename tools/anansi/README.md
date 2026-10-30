# ENCORE — Count Anansi

These files build `games/encore.html`, the Ruins encounter. ENCORE is the battle's name; the boss is Count Anansi.

```sh
python3 -I tools/anansi/build.py
```

- `src/story.js`: every line. The designer's lines are kept verbatim (obvious typos fixed only).
- `src/world.js`: the walk: the spiders' wing of the Ruins, then the theatre aisle and its seat notes.
- `src/engine.js`: the battle state machine: the ORANGE SOUL (the one tea pour that turns it orange, heat from standing still, burn stacks from fire, the dash), purple strings, the revolving stage, the genocide fire and reignitions, REFUSE and the letter, the endings. It keeps the Notebook's FIGHT contract (`target` → `fight` → `attackCursor`).
- `src/attacks.js`: THE SHOW's ten attacks (pacifist) and THE LAST SHOW's three lives of attacks (genocide).
- `src/anansi-art.js`: draws his frames and portraits, Seth's walk, the painted rooms and backdrop, and his props (spiders, playbills, candelabras, fang blades, teapot).
- `src/audio.js`: the designer's themes, muffled through the walls on the walk; UNDERTALE's own effects; the designer's snd_txt1 for text.
- `src/page.js`: rendering, input and UI.
- `shell.html`: the page shell. The build fills in the font, its license and the SOUL image from `tools/shared/`.
- `art/anansi.png` and `.json`: his frames (battle poses, overworld walk, hands, 24 portraits), cleaned from the designer's three sprite sheets by `tools/extract_anansi.py`. The raw sheets are not committed.
- `art/rooms/`: the hall, the theatre and the battle backdrop, painted at 1x by `tools/paint_rooms.py`, with SHOW (`-p`) and LAST SHOW (`-g`) versions.
- `audio/`: `pacifist.mp3` ("COPY-CAT PANIC") and `genocide.mp3` ("FRENETIC FOLLIES", re-encoded at 128 kbps), both supplied by the designer; `txt.mp3` is their snd_txt1; `damage`, `select`, `slash`, `ding` and `heavy` are the UNDERTALE effects the other fights already use.

The build copies these at build time:
- the shared Seth modules (font, Notebook, SOUL visuals, battle UI) from `tools/shared/`;
- human Seth's walk sheet from `tools/marigold/art/`;
- Aqua's current art module from `games/aqua.html`.

Rebuild after changing any of those. After rebuilding, run `python3 -I tools/sync_borrowed_art.py games/flowey.html` and rebuild the false genocide, since Flowey borrows `anansi-art.js`.
