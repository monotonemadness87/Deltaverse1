# Shared Seth modules

The pieces every Seth fight shares, kept here so a build never depends on another game's file:
`font.js`, `konami.js`, `notebook.js` and `notebook-visual.js` (the Torn Notebook), `soul-break.js`, `soul-visual.js`, `battle-ui.js`,
the Determination font with its license, and the SOUL image. Each `.js` file is a whole `modules["name"]=...` entry, copied byte-for-byte
from the shipped games (they were identical across them when copied). `tools/marigold/build.py` and `tools/anansi/build.py` read them from here.
