# Flowey: false genocide

These files build `games/flowey-genocide.html` from the false-pacifist `games/flowey.html`. The build keeps the engine and swaps in this route's story and patterns, the replayed bosses' art, and the plea-and-kill ending.

```sh
python3 -I tools/flowey-genocide/geno_assets.py tools/flowey-genocide/assets   # recrop Gerson, Muffet and Alphys art from their own games
python3 -I tools/flowey-genocide/geno_build.py games/flowey.html games/flowey-genocide.html
```

- `story.js`: the S-tier script, with the designer's kept lines verbatim.
- `patterns.js`: the fight plan; the genocide replays live in its `build()`.
- `geno-art.js`: the art module; the build fills in the cropped PNGs.
- `track.mp3`: the designer's supplied theme for this route (Inverted Fate "Checkmate"); the build embeds it.
- `geno_build.py`: the engine and page patches. Each replacement asserts that it matched exactly once.

Rebuild the genocide file whenever `games/flowey.html` changes.
