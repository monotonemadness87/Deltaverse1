#!/usr/bin/env python3
"""Copy the current Sans art module from games/sans.html into a Flowey file.

Flowey's replays (and the false-genocide Sans + Alphys memory) draw Sans with a bundled
`sans-art.js` module. This replaces it with the live `art.js` from sans.html, so Flowey never
shows an older Sans than the Sans fights do. Usage: sync_sans_art.py games/flowey.html
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def module(text, name):
    a = text.find('modules["%s"]=(exports,require)=>{' % name)
    if a < 0:
        raise ValueError('missing module ' + name)
    nxt = text.find('\nmodules["', a + 10)
    main = text.find('\nconst {', a)
    end = min(x for x in (nxt, main) if x >= 0)
    return a, text.rfind('\n};', a, end) + 3


sans = (ROOT / 'games' / 'sans.html').read_text(encoding='utf-8')
a, b = module(sans, 'art.js')
art = sans[a:b].replace('modules["art.js"]', 'modules["sans-art.js"]', 1)
for old, new in [('class Art{', 'class SansArt{'), ('Object.assign(exports,{SANS_ANCHORS,SANS_HEADS,sansPose,Art});', 'Object.assign(exports,{SANS_ANCHORS,SANS_HEADS,sansPose,SansArt});')]:
    if art.count(old) != 1:
        raise ValueError('sans.html art.js changed shape: ' + old)
    art = art.replace(old, new)
for path in sys.argv[1:]:
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    a, b = module(text, 'sans-art.js')
    p.write_text(text[:a] + art + text[b:], encoding='utf-8')
    print('synced', p, len(text), '->', len(text) - (b - a) + len(art))
