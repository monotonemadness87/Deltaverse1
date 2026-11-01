# QU5EN — Quantum 5 Engine

These files build `games/qu5en.html`, the CORE's pacifist-only fight before Sans.

```sh
python3 -I tools/qu5en/build.py
```

- `src/story.js`: every line, the quiz bank, and the ACTs' lines. The designer's lines are verbatim. Her creator is only ever "the previous royal scientist".
- `src/engine.js`: the battle: the quiz (answers by position, shot or dash), DATA, the eight rounds' SOUL modes (purple, blue gravity, cyan ring, yellow shooting, green shield, orange with dash and heat, the arcade fighter, purple strings), ACTs, FIGHT as percussive maintenance, checkpoints, the scan and the spare. It keeps the Notebook's FIGHT contract (`target` → `fight` → `attackCursor`).
- `src/attacks.js`: the rounds: what each spawns and what a wrong answer costs.
- `src/qu5en-art.js`: draws her frames and the globe.
- `src/audio.js`: the designer's theme, UNDERTALE's own effects, synthesized arcade blips, and snd_txt1 for text.
- `src/page.js`: rendering, input and UI.
- `shell.html`: the page shell. The build fills in the font, its license and the SOUL image from `tools/shared/`.
- `art/qu5en.png` and `.json`: her atlas, cut by `tools/extract_qu5en.py` from the designer's sprite sheet (fighter poses, talk heads, the blue fighter and its purple recolour for Seth, arcade text and bursts) and their screenshot (the giant head, traced and scaled to its 2-pixel line grid). `art/globe.png` is the sheet's globe. The raw sheet and screenshot are not committed.
- `audio/`: `theme.mp3` ("QU5EN", supplied by the designer, re-encoded at 128 kbps); `txt.mp3` is their snd_txt1; `damage`, `select`, `slash`, `ding` and `heavy` are the UNDERTALE effects the other fights already use.

Rebuild after changing `tools/shared/`.
