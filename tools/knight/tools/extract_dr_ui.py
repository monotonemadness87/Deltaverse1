"""Cut DELTARUNE's battle UI out of the designer's reference videos, at native 640 x 480, for the Deltarune half.

python3 -I tools/knight/tools/extract_dr_ui.py <frames-dir> <Human_Seth-dir> tools/knight/art

<frames-dir> holds frames of the two reference videos (the Kaizo Roaring Knight no-hit run and the secret Gerson
fight), each cropped to the 960 x 720 game area (x 160) and scaled to 640 x 480:
  kris_fight.png, kris_act.png, kris_item.png  Kris's command row with FIGHT / ACT / ITEM selected
  susie_panel.png      the collapsed party row (TP bar, SUSIE HP)       (Gerson fight)
  enemy_row.png        enemy select: HP / MERCY labels                  (Gerson fight)
  press.png            the FIGHT timing bar ("PRESS")                   (Gerson fight)
Seth's own party head icons come from the designer's Human Seth pack (supplied sheet cells r02 c28-c31).

Writes dr-ui.png and dr-ui.json: name -> [x, y, w, h]. Near-black is keyed out; white labels stay white (the page
tints them); the command icons keep their orange, and the SPARE / DEFEND selected states (never selected in the
videos) are the same icons recoloured to the selected yellow, as the game draws them.
"""
import json, os, sys
import numpy as np
from PIL import Image

ICONS = ['fight', 'act', 'item', 'spare', 'defend']
ORANGE, YELLOW = np.array([255, 127, 39]), np.array([255, 255, 0])


def load(path):
    return np.array(Image.open(path).convert('RGB')).astype(int)


def key(a, th=45):
    """RGBA from RGB with near-black transparent."""
    alpha = np.where(a.max(axis=2) > th, 255, 0)
    out = np.dstack([a, alpha]).astype(np.uint8)
    out[alpha == 0] = 0
    return Image.fromarray(out, 'RGBA')


def crop(a, x0, y0, x1, y1, th=45):
    return key(a[y0:y1, x0:x1], th)


def recolour_yellow(im):
    a = np.array(im).astype(int)
    orange = (a[..., 3] > 0) & (a[..., 0] > 150) & (a[..., 2] < 120)
    # Keep the shading: scale the yellow by the pixel's brightness relative to full orange.
    k = (a[..., 0] / 255.0)[..., None]
    a[..., :3] = np.where(orange[..., None], (YELLOW * k).astype(int), a[..., :3])
    return Image.fromarray(a.astype(np.uint8), 'RGBA')


def main():
    frames, seth, out = sys.argv[1:4]
    parts = {}
    sel = {'fight': 'kris_fight.png', 'act': 'kris_act.png', 'item': 'kris_item.png'}
    normal_src = {'fight': 'kris_act.png', 'act': 'kris_fight.png', 'item': 'kris_fight.png', 'spare': 'kris_fight.png', 'defend': 'kris_fight.png'}
    for i, name in enumerate(ICONS):
        x0 = 126 + 35 * i
        # The icon box (31 x 27) and, under a selected one, its little label (to y 366).
        parts['icon_' + name] = crop(load(os.path.join(frames, normal_src[name])), x0, 333, x0 + 34, 360)
        if name in sel:
            parts['icon_' + name + '_sel'] = crop(load(os.path.join(frames, sel[name])), x0, 333, x0 + 34, 367)
        else:
            parts['icon_' + name + '_sel'] = recolour_yellow(parts['icon_' + name])
    panel = load(os.path.join(frames, 'susie_panel.png'))
    parts['hp_small'] = crop(panel, 322, 346, 338, 356, 120)
    parts['tp_letters'] = crop(panel, 8, 77, 35, 112, 120)
    # The TP bar's slanted outline: everything coloured in the bar's column.
    bar = panel[47:231, 39:60]
    mask = (bar.max(axis=2) > 60)
    shape = np.zeros(bar.shape[:2] + (4,), np.uint8)
    shape[mask] = (255, 255, 255, 255)
    parts['tp_shape'] = Image.fromarray(shape, 'RGBA')
    enemy = load(os.path.join(frames, 'enemy_row.png'))
    parts['label_hp'] = crop(enemy, 423, 367, 451, 378, 150)
    parts['label_mercy'] = crop(enemy, 523, 367, 595, 378, 150)
    press = load(os.path.join(frames, 'press.png'))
    parts['press'] = crop(press, 46, 370, 75, 381, 100)
    cells = os.path.join(seth, 'sources', 'supplied_cells')
    for k, c in enumerate(['sheet_r02_c28.png', 'sheet_r02_c29.png', 'sheet_r02_c30.png', 'sheet_r02_c31.png']):
        im = Image.open(os.path.join(cells, c)).convert('RGBA')
        parts[f'seth_head{k}'] = im.crop(im.getchannel('A').getbbox())

    x = y = row = 0
    place = {}
    for name, im in parts.items():
        if x + im.width > 300:
            x, y, row = 0, y + row + 1, 0
        place[name] = [x, y, im.width, im.height]
        x += im.width + 1
        row = max(row, im.height)
    sheet = Image.new('RGBA', (300, y + row + 1), (0, 0, 0, 0))
    for name, im in parts.items():
        sheet.paste(im, tuple(place[name][:2]))
    sheet.save(os.path.join(out, 'dr-ui.png'), optimize=True)
    json.dump(place, open(os.path.join(out, 'dr-ui.json'), 'w'), separators=(',', ':'))
    print('dr-ui', sheet.size, len(place))


if __name__ == '__main__':
    main()
