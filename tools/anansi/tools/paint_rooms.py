# Paint Count Anansi's rooms as pixel art at 1x (shown at 2x): the spiders' wing of the Ruins, the theatre
# (seats, aisle, stage), and the battle backdrop (the stage seen from the house, with the boxes where his
# spiders come back to cheer). Each has a trap (-p) and a hunt (-g) version.
import sys, os, math, random
import numpy as np
from PIL import Image

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
H = 240
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16


def hexc(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)] + [255], np.uint8)


class Canvas:
    def __init__(self, w, h=H):
        self.w, self.h = w, h
        self.a = np.zeros((h, w, 4), np.uint8)

    def px(self, x, y, c):
        x, y = int(x), int(y)
        if 0 <= x < self.w and 0 <= y < self.h:
            self.a[y, x] = hexc(c)

    def rect(self, x, y, w, h, c):
        x0, y0, x1, y1 = max(0, int(x)), max(0, int(y)), min(self.w, int(x + w)), min(self.h, int(y + h))
        if x1 > x0 and y1 > y0:
            self.a[y0:y1, x0:x1] = hexc(c)

    def vgrad(self, y0, y1, c0, c1, x0=0, x1=None):
        x1 = self.w if x1 is None else x1
        A, B = hexc(c0), hexc(c1)
        for y in range(y0, y1):
            t = (y - y0) / max(1, y1 - y0 - 1)
            for x in range(x0, x1):
                self.a[y, x] = B if t > BAYER[y % 4, x % 4] else A

    def blend(self, x, y, c, alpha):
        x, y = int(x), int(y)
        if 0 <= x < self.w and 0 <= y < self.h:
            col = hexc(c)
            self.a[y, x, :3] = (self.a[y, x, :3] * (1 - alpha) + col[:3] * alpha).astype(np.uint8)
            self.a[y, x, 3] = 255

    def save(self, name):
        Image.fromarray(self.a).save(os.path.join(OUT, name + '.png'))


def web(c, x, y, r, col='#d9d0e6', corner='tl'):
    """A corner cobweb: radial threads and sagging rings."""
    sx, sy = {'tl': (1, 1), 'tr': (-1, 1), 'bl': (1, -1), 'br': (-1, -1)}[corner]
    for k in range(5):
        an = k / 4 * math.pi / 2
        for t in range(r):
            c.px(x + sx * math.cos(an) * t, y + sy * math.sin(an) * t, col)
    for ring in range(r // 4, r, r // 4):
        for s in range(0, 91, 2):
            an = math.radians(s)
            sag = 1 + .12 * math.sin(an * 4)
            c.px(x + sx * math.cos(an) * ring * sag, y + sy * math.sin(an) * ring * sag, col)


def spider(c, x, y, eye='#ff7a2a'):
    c.rect(x - 2, y - 2, 5, 4, '#0c0608')
    c.rect(x - 1, y - 3, 3, 1, '#0c0608')
    for dx in (-4, -3, 3, 4):
        c.px(x + dx, y - 1 + (abs(dx) - 3), '#0c0608'); c.px(x + dx, y + 1, '#0c0608')
    c.px(x - 1, y - 1, eye); c.px(x + 1, y - 1, eye)


def leaves(c, x, y, n, rnd):
    for _ in range(n):
        lx, ly = x + rnd.randrange(-14, 15), y + rnd.randrange(-4, 5)
        col = ('#c4342c', '#e04a32', '#8f2424', '#f06a3a')[rnd.randrange(4)]
        c.rect(lx, ly, 2, 1, col)


# ------------------------------------------------------------------ the spiders' wing of the Ruins
def hall(genocide):
    W = 640
    c = Canvas(W)
    rnd = random.Random(31)
    c.rect(0, 0, W, H, '#140a1c')
    # the wall: Ruins purple brick, darker at the top
    c.vgrad(20, 150, '#3b1f52', '#5a3478')
    for row in range(20, 150, 10):
        c.rect(0, row, W, 1, '#2c163e')
        off = 0 if (row // 10) % 2 else 12
        for x in range(off, W, 24):
            c.rect(x, row, 1, 10, '#2c163e')
            if rnd.random() < .25:
                c.rect(x + 2, row + 2, 8, 1, '#6c4290')
    c.rect(0, 148, W, 3, '#7a4ea0')
    # floor: lighter purple tiles
    c.vgrad(151, 240, '#6a3f8e', '#5a3278')
    for y in range(151, 240, 14):
        c.rect(0, y, W, 1, '#4c2a68')
        for x in range((y // 14 % 2) * 14, W, 28):
            c.rect(x, y, 1, 14, '#4c2a68')
    # pillars
    for x in (40, 230, 420, 610):
        c.rect(x - 9, 20, 18, 130, '#4a2866'); c.rect(x - 9, 20, 4, 130, '#6c4290'); c.rect(x + 6, 20, 3, 130, '#2c163e')
        c.rect(x - 12, 18, 24, 5, '#7a4ea0'); c.rect(x - 12, 144, 24, 5, '#7a4ea0')
    # cobwebs and their keepers
    for x, y, r, cor in ((0, 20, 30, 'tl'), (639, 20, 34, 'tr'), (220, 20, 22, 'tr'), (430, 20, 26, 'tl')):
        web(c, x, y, r, '#cbbfdc' if not genocide else '#7d708e', cor)
    if not genocide:
        for x, y in ((14, 34), (626, 40), (205, 32), (440, 36), (330, 26)):
            spider(c, x, y)
    # the bake sale (canon's spider bake sale), with its web sign
    bx = 150
    c.rect(bx - 22, 128, 44, 14, '#5b3a2a'); c.rect(bx - 24, 126, 48, 3, '#7a5236'); c.rect(bx - 20, 142, 3, 10, '#3e2618'); c.rect(bx + 17, 142, 3, 10, '#3e2618')
    if not genocide:
        for k in range(4):
            c.rect(bx - 16 + k * 9, 122, 6, 4, '#e0a85a'); c.rect(bx - 14 + k * 9, 123, 2, 2, '#7a4a20')
    web(c, bx - 24, 88, 20, '#e6deef' if not genocide else '#6f6380', 'tl'); web(c, bx + 24, 88, 20, '#e6deef' if not genocide else '#6f6380', 'tr')
    # a playbill on the wall
    px_ = 480
    c.rect(px_ - 16, 54, 32, 44, '#2a1420'); c.rect(px_ - 14, 56, 28, 40, '#e8d8b8'); c.rect(px_ - 10, 60, 20, 3, '#a02a2a')
    c.rect(px_ - 8, 66, 16, 14, '#140a10'); c.px(px_ - 3, 72, '#ff7a2a'); c.px(px_ + 2, 72, '#ff7a2a')
    for k in range(3):
        c.rect(px_ - 10, 84 + k * 4, 20 - k * 4, 1, '#7a5a3a')
    if genocide:
        c.rect(px_ - 12, 92, 24, 2, '#d0202a')
    # red leaves on the floor, as in the rest of the Ruins
    for x in (90, 300, 360, 520, 590):
        leaves(c, x, 170 + rnd.randrange(30), 22 if not genocide else 8, rnd)
    if genocide:
        for x in (260, 500):
            c.rect(x - 6, 200, 12, 3, '#8e8e98'); c.rect(x - 3, 198, 6, 2, '#a8a8b2')
    c.save('hall-' + ('g' if genocide else 'p'))


# ------------------------------------------------------------------ the theatre
def theatre(genocide):
    W = 320
    c = Canvas(W)
    rnd = random.Random(7)
    c.rect(0, 0, W, H, '#07040a')
    # proscenium and curtains
    c.rect(20, 10, 280, 6, '#a07a2a'); c.rect(20, 16, 280, 2, '#5a3e12')
    for x in range(20, 300, 6):
        c.rect(x, 18, 6, 3, '#c49a3a' if (x // 6) % 2 else '#8a6a20')
    c.vgrad(21, 120, '#2a0c14', '#14060a', 60, 260)
    for x0, side in ((20, 1), (300, -1)):
        for k in range(46):
            xx = x0 + side * k
            fold = (k // 5) % 2
            for y in range(21, 124 - int(10 * math.sin(k / 46 * math.pi / 2)) + (0 if k < 40 else 0)):
                c.px(xx, y, '#8a1a26' if fold else '#a8242e')
            c.px(xx, 21, '#5a0e16')
    c.rect(60, 21, 200, 6, '#6a1420')
    for x in range(60, 260, 10):
        c.rect(x, 27, 5, 3, '#6a1420')
    # the stage floor and footlights
    c.rect(20, 118, 280, 18, '#3a2214'); c.rect(20, 118, 280, 2, '#5a3a22')
    for x in range(20, 300, 18):
        c.rect(x, 120, 1, 16, '#2a160c')
    c.rect(20, 134, 280, 4, '#1a0e08')
    for x in range(34, 300, 24):
        lit = not genocide
        c.rect(x - 3, 131, 6, 3, '#ffb040' if lit else '#3a2a20')
        if lit:
            for k in range(14):
                c.blend(x + rnd.randrange(-8, 9), 116 + rnd.randrange(0, 16), '#ff9a3a', .18)
    # the house: rows of velvet seats either side of the aisle
    c.vgrad(138, 240, '#160a0e', '#0c0608')
    for row in range(7):
        y = 146 + row * 13
        for x in list(range(30, 140, 10)) + list(range(180, 292, 10)):
            col = '#7a1622' if not (genocide and (x * 7 + row * 3) % 5 == 0) else '#2a1a16'
            c.rect(x, y, 8, 8, col); c.rect(x, y, 8, 2, '#a02430' if col == '#7a1622' else '#3a2a22'); c.rect(x + 1, y + 8, 6, 2, '#2a080e')
    c.rect(146, 138, 28, 102, '#2a1a12')
    for y in range(140, 240, 8):
        c.rect(150, y, 20, 1, '#3a2418')
    # the notes on three seats
    for (x, y) in ((126, 205), (194, 176), (126, 150)):
        c.rect(x - 2, y - 2, 6, 4, '#efe4cc' if not genocide else '#cfc2a8')
    if genocide:
        for k in range(30):
            c.rect(rnd.randrange(30, 290), rnd.randrange(146, 236), 3, 2, '#0a0606')
        for x in (60, 230, 270):
            c.rect(x, 150 + (x % 40), 8, 8, '#1a0e0a')
    c.save('theatre-' + ('g' if genocide else 'p'))


# ------------------------------------------------------------------ the battle backdrop
def battle(genocide):
    W = 320
    c = Canvas(W)
    c.rect(0, 0, W, H, '#000000')
    rnd = random.Random(9)
    c.vgrad(0, 120, '#120408' if not genocide else '#180404', '#060203')
    # curtains framing the stage
    for x0, side in ((0, 1), (319, -1)):
        for k in range(54):
            xx = x0 + side * k
            fold = (k // 6) % 2
            depth = int(16 * math.sin(k / 54 * math.pi))
            for y in range(0, 124 - depth):
                c.px(xx, y, ('#5a0e18' if fold else '#701422') if not genocide else ('#3a0a0e' if fold else '#480c12'))
    c.rect(0, 0, W, 8, '#4a0a14' if not genocide else '#2a0608')
    for x in range(0, W, 8):
        c.rect(x, 8, 5, 4, '#4a0a14' if not genocide else '#2a0608')
    # the theatre boxes, high on either side: where the spiders come back to watch
    for x in (8, 268):
        c.rect(x, 20, 44, 26, '#2a0c10'); c.rect(x, 20, 44, 3, '#a07a2a'); c.rect(x, 43, 44, 3, '#a07a2a')
        for k in range(4):
            c.rect(x + 3 + k * 10, 34, 8, 9, '#4a1018' if not genocide else '#20080a')
    # stage boards and footlights, just above the box
    c.rect(54, 112, 212, 10, '#2a160c' if not genocide else '#1a0c06')
    for x in range(54, 266, 14):
        c.rect(x, 113, 1, 9, '#1a0c06')
    for x in range(64, 266, 20):
        c.rect(x - 2, 120, 4, 2, '#ffb040' if not genocide else '#5a3010')
    # a chandelier overhead
    cx = 160
    c.rect(cx - 1, 0, 2, 20, '#5a4a2a')
    c.rect(cx - 22, 20, 44, 3, '#a07a2a')
    for k in range(5):
        x = cx - 20 + k * 10
        c.rect(x - 1, 14, 2, 6, '#e8d8b8'); c.px(x, 12, '#ffb040' if not genocide else '#5a2a10'); c.px(x, 13, '#ffd070' if not genocide else '#3a1a08')
    c.save('battle-' + ('g' if genocide else 'p'))


for g in (False, True):
    hall(g); theatre(g); battle(g)
print('painted', OUT)
