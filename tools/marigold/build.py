"""Build games/marigold.html.

python3 -I tools/marigold/build.py

The page is assembled from tools/marigold/src (Marigold's own modules), tools/marigold/art (cleaned
sprite atlases), the shared Seth modules (font, Notebook, SOUL visuals, battle UI) copied byte-for-byte
from games/encore.html, Aqua's current art module from games/aqua.html, and the overworld Flowey from
tools/flowey-genocide/art.
"""
import base64, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.join(ROOT, 'tools', 'marigold')
OUT = os.path.join(ROOT, 'games', 'marigold.html')
ANCHOR = '\nconst {installNotebook}'
SHARED = ['font.js', 'konami.js', 'notebook.js', 'notebook-visual.js', 'soul-break.js', 'soul-visual.js', 'battle-ui.js']
OWN = ['story.js', 'attacks.js', 'world.js', 'engine.js', 'audio.js', 'marigold-art.js']


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
    encore = read(os.path.join(ROOT, 'games', 'encore.html'))
    aqua = read(os.path.join(ROOT, 'games', 'aqua.html'))
    font = re.search(r"src:url\('(data:font/ttf;base64,[A-Za-z0-9+/=]+)'\)", encore).group(1)
    license_txt = re.search(r'<a href="(data:text/plain;base64,[A-Za-z0-9+/=]+)" download="Determination-license.txt"', encore).group(1)
    soul = re.search(r'soul\.src="(data:image/png;base64,[A-Za-z0-9+/=]+)"', encore[encore.index(ANCHOR):]).group(1)

    shell = read(os.path.join(HERE, 'shell.html'))
    shell = shell.replace('__FONT_TTF__', font).replace('__LICENSE_TXT__', license_txt)

    parts = [shell, '\n']
    for name in SHARED:
        parts.append(module(encore, name))
    parts.append(module(aqua, 'art.js').replace('modules["art.js"]=', 'modules["aqua-art.js"]=', 1))
    art = os.path.join(HERE, 'art')
    for name in OWN:
        body = read(os.path.join(HERE, 'src', name))
        if name == 'marigold-art.js':
            body = (body.replace('__MARIGOLD_FRAMES__', json.dumps(json.load(open(os.path.join(art, 'marigold.json'))), separators=(',', ':')))
                        .replace('__SETH_FRAMES__', json.dumps(json.load(open(os.path.join(art, 'seth.json'))), separators=(',', ':')))
                        .replace('__MARIGOLD_PNG__', data_uri(os.path.join(art, 'marigold.png'), 'image/png'))
                        .replace('__SETH_PNG__', data_uri(os.path.join(art, 'seth.png'), 'image/png'))
                        .replace('__FLOWEY_PNG__', data_uri(os.path.join(ROOT, 'tools', 'flowey-genocide', 'art', 'overworld-flowey.png'), 'image/png')))
        assert '__' not in re.sub(r'__proto__', '', body) or name != 'marigold-art.js', name
        parts.append('modules["%s"]=(exports,require)=>{\n%s\n};\n' % (name, body.rstrip('\n')))
    page = read(os.path.join(HERE, 'src', 'page.js')).replace('__SOUL_PNG__', soul)
    assert page.startswith(ANCHOR)
    parts.append(page[1:])
    html = ''.join(parts)
    for token in ('__FONT_TTF__', '__LICENSE_TXT__', '__SOUL_PNG__', '__MARIGOLD_PNG__', '__SETH_PNG__', '__FLOWEY_PNG__', '__MARIGOLD_FRAMES__', '__SETH_FRAMES__'):
        assert token not in html, token
    out = sys.argv[1] if len(sys.argv) > 1 else OUT
    with open(out, 'w') as f:
        f.write(html)
    print(out, len(html))


if __name__ == '__main__':
    main()
