"""Build games/knight.html.

python3 -I tools/knight/build.py

The page is assembled from tools/knight/src (the Knight's own modules), tools/knight/art (the placeholder atlas cut
from the concept sheet, Seth's walk, Gerson, the painted rooms), and the shared Seth modules (font, Notebook, SOUL
visuals, battle UI) in tools/shared.
"""
import base64, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.join(ROOT, 'tools', 'knight')
OUT = os.path.join(ROOT, 'games', 'knight.html')
ANCHOR = '\nconst {installNotebook}'
SHARED = ['font.js', 'konami.js', 'notebook.js', 'notebook-visual.js', 'soul-break.js', 'soul-visual.js', 'battle-ui.js']
OWN = ['story.js', 'attacks.js', 'world.js', 'engine.js', 'audio.js', 'knight-art.js']


def read(path, mode='r'):
    with open(path, mode) as f:
        return f.read()


def module(html, name):
    start = html.index('modules["%s"]=' % name)
    end = html.find('\nmodules["', start + 5)
    page = html.index(ANCHOR)
    if end < 0 or end > page:
        end = page
    return html[start:end].rstrip('\n') + '\n'


def data_uri(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(read(path, 'rb')).decode())


def main():
    shared = os.path.join(ROOT, 'tools', 'shared')
    font = data_uri(os.path.join(shared, 'Determination.ttf'), 'font/ttf')
    license_txt = data_uri(os.path.join(shared, 'Determination-license.txt'), 'text/plain')
    soul = data_uri(os.path.join(shared, 'soul.png'), 'image/png')

    shell = read(os.path.join(HERE, 'shell.html'))
    shell = shell.replace('__FONT_TTF__', font).replace('__LICENSE_TXT__', license_txt)

    parts = [shell, '\n']
    for name in SHARED:
        parts.append(read(os.path.join(shared, name)))
    art = os.path.join(HERE, 'art')
    for name in OWN:
        body = read(os.path.join(HERE, 'src', name))
        if name == 'knight-art.js':
            for token, fname in (('__KNIGHT_FRAMES__', 'knight.json'), ('__ANIM_FRAMES__', 'knight-anim.json'), ('__SIDE_FRAMES__', 'knight-side.json'), ('__DRUI_FRAMES__', 'dr-ui.json'), ('__SETH_FRAMES__', 'seth2.json'), ('__GERSON_FRAMES__', 'gerson.json')):
                body = body.replace(token, json.dumps(json.load(open(os.path.join(art, fname))), separators=(',', ':')))
            for token, fname in (('__KNIGHT_PNG__', 'knight.png'), ('__ANIM_PNG__', 'knight-anim.png'), ('__SIDE_PNG__', 'knight-side.png'), ('__DRUI_PNG__', 'dr-ui.png'), ('__SETH_PNG__', 'seth2.png'), ('__GERSON_PNG__', 'gerson.png')):
                body = body.replace(token, data_uri(os.path.join(art, fname), 'image/png'))
            body = body.replace('__ROOMS__', json.dumps({n[:-4]: data_uri(os.path.join(art, 'rooms', n), 'image/png') for n in sorted(os.listdir(os.path.join(art, 'rooms')))}, separators=(',', ':')))
        if name == 'audio.js':
            body = body.replace('__SOUNDS__', json.dumps({n[:-4]: data_uri(os.path.join(HERE, 'audio', n), 'audio/mpeg') for n in sorted(os.listdir(os.path.join(HERE, 'audio')))}, separators=(',', ':')))
        assert '__' not in re.sub(r'__proto__', '', body) or name != 'knight-art.js', name
        parts.append('modules["%s"]=(exports,require)=>{\n%s\n};\n' % (name, body.rstrip('\n')))
    page = read(os.path.join(HERE, 'src', 'page.js')).replace('__SOUL_PNG__', soul)
    assert page.startswith(ANCHOR)
    parts.append(page[1:])
    html = ''.join(parts)
    for token in ('__FONT_TTF__', '__LICENSE_TXT__', '__SOUL_PNG__', '__KNIGHT_PNG__', '__ANIM_PNG__', '__ANIM_FRAMES__', '__SIDE_PNG__', '__SIDE_FRAMES__', '__DRUI_PNG__', '__DRUI_FRAMES__', '__SETH_PNG__', '__GERSON_PNG__', '__KNIGHT_FRAMES__', '__SETH_FRAMES__', '__GERSON_FRAMES__', '__ROOMS__', '__SOUNDS__'):
        assert token not in html, token
    out = sys.argv[1] if len(sys.argv) > 1 else OUT
    with open(out, 'w') as f:
        f.write(html)
    print(out, len(html))


if __name__ == '__main__':
    main()
