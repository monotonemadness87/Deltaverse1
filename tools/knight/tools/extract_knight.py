"""Cut the White Roaring Knight's placeholder frames from the designer's concept sheet, plus Gerson for the shop.

python3 -I tools/knight/tools/extract_knight.py <concept.png> tools/knight/art

These are stand-ins until the designer's real sprite sheets arrive: each pose is cropped from the concept sheet
at its native pixel size and the sheet's black background is keyed out (dark glow fades to transparent).
Gerson's shop pose and portrait are cropped from the art already shipped in games/gerson.html.
Writes knight.png + knight.json (the atlas) and gerson.png + gerson.json.
"""
import base64, io, json, os, re, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Boxes on the 1536x1024 concept sheet.
BOXES = {
    # Only the dialogue portrait is still taken from the concept sheet; the battle sprites now come from the
    # designer's sprite sheets (tools/extract_sheets.py).
    'portrait': (28, 818, 203, 990),
}
# Sheet text that falls inside a box, blanked before keying (box-relative).
BLANK = {}


def key(img):
    a = np.array(img.convert('RGB')).astype(np.int32)
    v = a.max(axis=2)
    alpha = np.clip((v - 24) * 255 // 46, 0, 255)
    out = np.dstack([a, alpha]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def trim(im, pad=1):
    bb = im.getchannel('A').point(lambda x: 255 if x > 40 else 0).getbbox()
    if not bb:
        return im
    x0, y0, x1, y1 = bb
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


def pack(frames, width=1100):
    x = y = row = 0
    place = {}
    for name, im in frames.items():
        if x + im.width > width:
            x, y, row = 0, y + row + 1, 0
        place[name] = [x, y, im.width, im.height]
        x += im.width + 1
        row = max(row, im.height)
    sheet = Image.new('RGBA', (width, y + row + 1), (0, 0, 0, 0))
    for name, im in frames.items():
        sheet.paste(im, tuple(place[name][:2]))
    return sheet, place


def main():
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    sheet = Image.open(src).convert('RGB')
    frames = {}
    for name, box in BOXES.items():
        im = sheet.crop(box)
        if name in BLANK:
            from PIL import ImageDraw
            d = ImageDraw.Draw(im)
            for r in BLANK[name]:
                d.rectangle(r, fill=(0, 0, 0))
        im = key(im)
        frames[name] = im if name in ('portrait', 'face', 'cloth', 'scarf', 'blade') else trim(im)
        if name == 'portrait':
            # Shrunk to half by block majority (whole pixels at 1x), then despeckled.
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            from extract_sheets import shrink, despeckle
            sm = shrink(trim(im), .5)
            frames[name] = Image.fromarray(despeckle(np.array(sm)), 'RGBA')
    atlas, place = pack(frames)
    atlas.save(os.path.join(out, 'knight.png'), optimize=True)
    json.dump(place, open(os.path.join(out, 'knight.json'), 'w'))

    # Gerson, from the art module his own fight ships.
    html = open(os.path.join(ROOT, 'games', 'gerson.html')).read()
    k = html.index('modules["art.js"]=')
    body = html[k:html.index('\nmodules["', k + 5)]
    urls = dict(re.findall(r'this\.(\w+)=img\("data:image/\w+;base64,([^"]+)"\)', body))
    boss = Image.open(io.BytesIO(base64.b64decode(urls['boss']))).convert('RGBA')
    faces = Image.open(io.BytesIO(base64.b64decode(urls['faces']))).convert('RGBA')
    pose = boss.crop((60, 85, 60 + 426, 85 + 408))
    pose = trim(pose).resize((max(1, round(pose.width * .3)), max(1, round(pose.height * .3))), Image.LANCZOS)
    face = faces.crop((40, 10, 40 + 305, 10 + 415)).resize((76, 104), Image.LANCZOS)
    # Behind the shop counter: the portrait with its black JPEG background keyed out.
    keeper = np.array(face).astype(np.int32)
    keeper[..., 3] = np.where(keeper[..., :3].max(axis=2) < 26, 0, 255)
    g, gp = pack({'shop': trim(pose), 'face': face, 'keeper': Image.fromarray(keeper.astype(np.uint8), 'RGBA')}, 400)
    g.save(os.path.join(out, 'gerson.png'), optimize=True)
    json.dump(gp, open(os.path.join(out, 'gerson.json'), 'w'))
    print('knight', atlas.size, len(place), 'gerson', g.size, {k: v[2:] for k, v in gp.items()})


if __name__ == '__main__':
    main()
