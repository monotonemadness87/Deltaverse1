# Clean the designer's Count Anansi sheets into crisp, art-resolution frames (their 2x grid).
# His body is pure black on a near-black backdrop, so each sprite is found by its bright outline
# (orange rim, cape, cravat), small gaps are closed, and everything inside the outline is kept, black included.
# Portraits keep their whole red-gradient panel.
#   python3 -I extract_anansi.py <sheets dir> <out prefix> <this tools dir>
import sys, json
sys.path.insert(0, sys.argv[3])
import numpy as np
from PIL import Image
from cc import dilate, components

SRC, OUT, F = sys.argv[1], sys.argv[2], 2.0
sheets = {n: np.asarray(Image.open(f'{SRC}/{n}.png').convert('RGB')).astype(int) for n in ('sheet2', 'sheet3')}

SPRITES = {  # name: (sheet, x0, y0, x1, y1)
    'idle0': ('sheet2', 10, 828, 132, 975), 'idle1': ('sheet2', 132, 828, 242, 975), 'talk': ('sheet2', 242, 828, 346, 975),
    'gesture': ('sheet2', 346, 828, 464, 975), 'hurt': ('sheet2', 464, 828, 568, 975), 'defeat': ('sheet2', 568, 828, 676, 975),
    'big': ('sheet2', 1384, 232, 1512, 500),
    'ow_down': ('sheet2', 746, 48, 822, 158), 'ow_left': ('sheet2', 828, 48, 896, 158), 'ow_right': ('sheet2', 902, 48, 976, 158), 'ow_up': ('sheet2', 982, 48, 1054, 158),
    'hand_open': ('sheet3', 943, 864, 1024, 978), 'hand_claw': ('sheet3', 1120, 866, 1226, 978),
    'ow_surprised': ('sheet2', 1096, 86, 1170, 176), 'ow_wine': ('sheet2', 1186, 86, 1281, 176), 'ow_turn': ('sheet2', 1284, 86, 1369, 176), 'ow_fallen': ('sheet2', 1372, 80, 1522, 172),
}
for i, (x0, x1) in enumerate([(813, 868), (881, 934), (950, 1002), (1016, 1073), (1086, 1142), (1157, 1212)]):
    SPRITES[f'walk_down{i}'] = ('sheet2', x0, 231, x1, 292)
for i, (x0, x1) in enumerate([(801, 885), (887, 966), (973, 1037), (1054, 1137), (1138, 1228)]):
    SPRITES[f'walk_left{i}'] = ('sheet2', x0, 296, x1, 357)
for i, (x0, x1) in enumerate([(799, 878), (880, 958), (968, 1034), (1042, 1130), (1130, 1221)]):
    SPRITES[f'walk_right{i}'] = ('sheet2', x0, 357, x1, 422)
for i, (x0, x1) in enumerate([(803, 870), (873, 939), (941, 1008), (1010, 1077), (1079, 1146), (1148, 1216)]):
    SPRITES[f'walk_up{i}'] = ('sheet2', x0, 424, x1, 494)

FRONT = ['neutral', 'smile', 'amused', 'closed', 'serious', 'intrigued', 'annoyed', 'angry', 'hurt', 'surprised']
FRONT_X = [(324, 439), (442, 558), (561, 677), (680, 795), (798, 913), (916, 1031), (1035, 1149), (1152, 1270), (1276, 1395), (1398, 1519)]
SPECIAL = ['laugh', 'cackle', 'menacing', 'teasing', 'disgusted', 'bored', 'mocking', 'thinking', 'scheming', 'worried', 'sad', 'tired', 'shocked', 'flustered']
SPECIAL_X = [(18, 128), (132, 241), (242, 355), (358, 449), (450, 546), (549, 655), (658, 753), (754, 867), (870, 973), (976, 1078), (1082, 1186), (1190, 1294), (1298, 1401), (1404, 1517)]
PORTRAITS = {('face_' + n): ('sheet3', x0 + 3, 47, x1 - 3, 176) for n, (x0, x1) in zip(FRONT, FRONT_X)}
PORTRAITS.update({('face_' + n): ('sheet3', x0 + 3, 485, x1 - 3, 596) for n, (x0, x1) in zip(SPECIAL, SPECIAL_X)})


def inside(region):
    """Pixels enclosed by the bright outline (its gaps closed), keeping the main body and anything attached."""
    bright = region.sum(2) > 70
    closed = dilate(bright, 2)
    h, w = closed.shape
    outside = np.zeros_like(closed)
    stack = [(y, x) for y in range(h) for x in (0, w - 1)] + [(y, x) for x in range(w) for y in (0, h - 1)]
    while stack:
        y, x = stack.pop()
        if outside[y, x] or closed[y, x]:
            continue
        outside[y, x] = True
        if y > 0: stack.append((y - 1, x))
        if y < h - 1: stack.append((y + 1, x))
        if x > 0: stack.append((y, x - 1))
        if x < w - 1: stack.append((y, x + 1))
    m = ~outside
    lab, boxes = components(m)
    if boxes:
        big = max(b[4] for b in boxes)
        keep = [b[5] for b in boxes if b[4] >= .06 * big]
        m = np.isin(lab, keep)
    return m


crops = {}
for name, (sh, x0, y0, x1, y1) in SPRITES.items():
    r = sheets[sh][y0:y1, x0:x1]
    crops[name] = (r, inside(r))
for name, (sh, x0, y0, x1, y1) in PORTRAITS.items():
    r = sheets[sh][y0:y1, x0:x1]
    crops[name] = (r, np.ones(r.shape[:2], bool))

allpix = np.concatenate([c[m] for c, m in crops.values()])
pal_img = Image.fromarray(allpix.reshape(1, -1, 3).astype(np.uint8)).quantize(colors=28, method=Image.Quantize.MEDIANCUT)
pal = np.array(pal_img.getpalette()[:28 * 3]).reshape(-1, 3)


def snap(c, m):
    h, w = m.shape
    H, W = max(1, round(h / F)), max(1, round(w / F))
    q = np.asarray(Image.fromarray(c.astype(np.uint8)).quantize(palette=pal_img, dither=Image.Dither.NONE)).astype(int)
    out = np.zeros((H, W, 4), np.uint8)
    for j in range(H):
        for i in range(W):
            ys = slice(int(j * h / H), max(int(j * h / H) + 1, int((j + 1) * h / H)))
            xs = slice(int(i * w / W), max(int(i * w / W) + 1, int((i + 1) * w / W)))
            mm = m[ys, xs]
            if mm.mean() < .45:
                continue
            col = pal[np.bincount(q[ys, xs][mm]).argmax()]
            if col.sum() < 40:
                col = np.array([4, 2, 6])
            out[j, i, :3] = col
            out[j, i, 3] = 255
    return out


tiles = []
for name, (c, m) in crops.items():
    t = snap(c, m)
    ys, xs = np.nonzero(t[..., 3])
    if len(ys):
        t = t[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    tiles.append((name, t))
W = 512
x = y = rowh = 0
place = {}
for name, t in tiles:
    h, w = t.shape[:2]
    if x + w + 1 > W:
        x = 0; y += rowh + 1; rowh = 0
    place[name] = (x, y, w, h); x += w + 1; rowh = max(rowh, h)
atlas = np.zeros((y + rowh + 1, W, 4), np.uint8)
for name, t in tiles:
    x, y, w, h = place[name]
    atlas[y:y + h, x:x + w] = t
Image.fromarray(atlas).save(OUT + '.png')
json.dump(place, open(OUT + '.json', 'w'))
print(atlas.shape, len(place))
