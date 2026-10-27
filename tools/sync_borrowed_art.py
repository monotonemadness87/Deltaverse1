#!/usr/bin/env python3
"""Copy the other fights' current art into a Flowey file, so his replays never show an older version.

Flowey replays other bosses with bundled copies of their art. This replaces each copy with the live
module from the source fight, renamed to the name Flowey requires:

  sans.html     art.js          -> sans-art.js      (class SansArt)
  sans.html     blaster-beam.js -> blaster-beam.js  (skull and beam lifecycle)
  rift.html     art.js          -> crown-art.js     (class CrownArt, pixel-crisp at draw size)
  mettalot.html art.js          -> ghost-art.js     (class GhostArt, palette-snapped)
  encore.html   sprite-atlas.js -> sprite-atlas.js
  encore.html   attack-art.js   -> encore-art.js    (batons, curtain slabs, stars, spotlights)
  encore.html   Encore's body sheet -> the image Flowey draws Encore from

A module missing from the Flowey file is inserted before the art module that needs it.
Usage: sync_borrowed_art.py games/flowey.html   (then rebuild the false genocide from it)
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def module(text, name):
    a = text.find('modules["%s"]=(exports,require)=>{' % name)
    if a < 0:
        return None
    nxt = text.find('\nmodules["', a + 10)
    main = text.find('\nconst {installNotebook}', a)
    end = min(x for x in (nxt, main) if x >= 0)
    return a, text.rfind('\n};', a, end) + 3


def source(game, name, rename=None, swaps=()):
    text = (ROOT / 'games' / (game + '.html')).read_text(encoding='utf-8')
    span = module(text, name)
    if not span:
        raise ValueError(f'{game}.html has no {name}')
    body = text[span[0]:span[1]]
    if rename:
        body = body.replace('modules["%s"]' % name, 'modules["%s"]' % rename, 1)
    for old, new in swaps:
        if body.count(old) != 1:
            raise ValueError(f'{game}.html {name} changed shape: {old}')
        body = body.replace(old, new)
    return body


def image_after(text, marker):
    i = text.index(marker) + len(marker)
    return text[i:text.index('"', i)]


MODULES = [
    ('blaster-beam.js', source('sans', 'blaster-beam.js'), 'sans-art.js'),
    ('sans-art.js', source('sans', 'art.js', 'sans-art.js', [('class Art{', 'class SansArt{'), ('Object.assign(exports,{SANS_ANCHORS,SANS_HEADS,sansPose,Art});', 'Object.assign(exports,{SANS_ANCHORS,SANS_HEADS,sansPose,SansArt});')]), None),
    ('crown-art.js', source('rift', 'art.js', 'crown-art.js'), None),
    ('ghost-art.js', source('mettalot', 'art.js', 'ghost-art.js'), None),
    ('sprite-atlas.js', source('encore', 'sprite-atlas.js'), 'encore-art.js'),
    ('encore-art.js', source('encore', 'attack-art.js', 'encore-art.js'), None),
]
encore = (ROOT / 'games' / 'encore.html').read_text(encoding='utf-8')
ENCORE_BODY = image_after(encore[encore.index('\nconst {installNotebook}'):], 'boss.src="')

for path in sys.argv[1:]:
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    for name, body, before in MODULES:
        span = module(text, name)
        if span:
            text = text[:span[0]] + body + text[span[1]:]
        else:
            at = module(text, before)[0]
            text = text[:at] + body + '\n' + text[at:]
    old = image_after(text, 'encoreSprite.src="')
    text = text.replace('encoreSprite.src="' + old + '"', 'encoreSprite.src="' + ENCORE_BODY + '"', 1)
    p.write_text(text, encoding='utf-8')
    print('synced', p)
