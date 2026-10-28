# Marigold: The Forgotten Memorial

These files build `games/marigold.html`, the Snowdin encounter that replaced Rift.

```sh
python3 -I tools/marigold/build.py
```

- `src/story.js`: every line. The designer's monologue, murals and Aqua lines are kept verbatim (obvious typos fixed only).
- `src/world.js`: the walk: forest, the Forgotten Gallery (six murals), the ledge, the memorial.
- `src/engine.js`: the battle state machine, hazards, poison, the phone calls and anger, the spare and the endings. It keeps Rift's FIGHT contract (`target` → `fight` → `attackCursor`), so Seth's Torn Notebook drives the damage.
- `src/attacks.js`: 14 attacks for the trap (pacifist) and 14 for the hunt (genocide).
- `src/marigold-art.js`: draws Marigold's frames, Seth's walk, Flowey, and the procedurally painted rooms.
- `src/audio.js`: a synthesized placeholder waltz, until the designer supplies a theme.
- `src/page.js`: rendering, input and UI.
- `shell.html`: the page shell. The build fills in the font, its license and the SOUL image from `games/encore.html`.
- `art/marigold.png` and `.json`: Marigold's frames, cleaned from the designer's example sprite sheet at its 2× grid (palette-snapped, outlined) by `tools/extract_marigold.py`. The raw sheet is not committed.
- `art/seth.png` and `.json`: an original Undertale-scale human Seth (four directions, three walk frames), drawn by `tools/seth_sprite.py` after the designer's Flower Seth sheet.

The build copies these at build time:
- the shared Seth modules (font, Notebook, SOUL visuals, battle UI) byte-for-byte from `games/encore.html`;
- Aqua's current art module from `games/aqua.html`;
- the overworld Flowey from `tools/flowey-genocide/art`.

Rebuild after changing any of those.
