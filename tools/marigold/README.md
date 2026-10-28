# Marigold: The Forgotten Memorial

These files build `games/marigold.html`, the Snowdin encounter that replaced Rift.

```sh
python3 -I tools/marigold/build.py
```

- `src/story.js`: every line. The designer's monologue, murals and Aqua lines are kept verbatim (obvious typos fixed only).
- `src/world.js`: the walk: forest, the Forgotten Gallery (six murals), the ledge, the memorial.
- `src/engine.js`: the battle state machine, hazards, poison, the phone calls and anger, the spare and the endings. It keeps Rift's FIGHT contract (`target` → `fight` → `attackCursor`), so Seth's Torn Notebook drives the damage.
- `src/attacks.js`: 14 attacks for the trap (pacifist) and 14 for the hunt (genocide).
- `src/marigold-art.js`: draws Marigold's frames, Seth's walk, Flowey, the painted rooms with their live snow and glow, and the battle backdrop.
- `src/audio.js`: the designer's themes (battle), UNDERTALE's own effects and the designer's snd_txt1 (text), and "Glowing Snow" over synthesized wind for the walk (sped up and pitched up on the trap).
- `src/page.js`: rendering, input and UI.
- `shell.html`: the page shell. The build fills in the font, its license and the SOUL image from `games/encore.html`.
- `art/marigold.png` and `.json`: Marigold's frames, cleaned from the designer's example sprite sheet at its 2× grid (palette-snapped, outlined) by `tools/extract_marigold.py`. The raw sheet is not committed.
- `art/seth.png` and `.json`: human Seth, by `tools/seth_sprite.py`. The front is the designer's Flower Seth idle frame recoloured to human skin. It also serves walking left, and mirrored, right. The back and the step frames are drawn to match it.
- `art/rooms/`: the walk's rooms and the battle backdrop, painted at 1x by `tools/paint_rooms.py`. There is a trap (`-p`) and a hunt (`-g`) version of each, plus the forest's foreground trunks.
- `audio/`: `trap.mp3` ("The King's Dream" fan track) and `hunt.mp3` ("Thorns of Agony" remaster), both supplied by the designer; `walk.mp3` is their "Glowing Snow" (DELTARUNE), trimmed of its silent head and tail so it loops; `txt.mp3` is their snd_txt1. `damage`, `select`, `slash`, `ding` and `heavy` are the UNDERTALE effects the other fights already use (copied from `aqua.html`, `gerson.html` and `muffet.html`). `yowl.mp3` is the designer's Omega yowl from the Flowey fights, used for her thorn and lance lunges.

The build copies these at build time:
- the shared Seth modules (font, Notebook, SOUL visuals, battle UI) byte-for-byte from `games/encore.html`;
- Aqua's current art module from `games/aqua.html`;
- the overworld Flowey from `tools/flowey-genocide/art`.

Rebuild after changing any of those.
