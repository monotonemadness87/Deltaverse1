# Paint the walk's rooms as pixel art at 1x (shown at 2x): Snowdin's old forest path, the Forgotten Gallery,
# the ledge over the valley, and the memorial. Each has a trap (pacifist) and a hunt (genocide) variant,
# and the forest has a foreground layer of trunks Seth walks behind.
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
            self.a[y, x] = hexc(c) if isinstance(c, str) else c

    def rect(self, x, y, w, h, c):
        x0, y0, x1, y1 = max(0, int(x)), max(0, int(y)), min(self.w, int(x + w)), min(self.h, int(y + h))
        if x1 > x0 and y1 > y0:
            self.a[y0:y1, x0:x1] = hexc(c)

    def vgrad(self, y0, y1, c0, c1, x0=0, x1=None):
        """Dithered vertical gradient between two colours."""
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
            self.a[y, x, 3] = max(self.a[y, x, 3], 255 if alpha > .5 else int(alpha * 255))

    def save(self, name):
        Image.fromarray(self.a).save(os.path.join(OUT, name + '.png'))


# ------------------------------------------------------------------ shared props
def pine(c, x, base, h, pal, snow=True, rnd=None, density=.85):
    """A Snowdin pine: stacked jagged tiers shaded from the left, snow resting along each tier's upper edge."""
    rnd = rnd or random.Random(int(x * 7 + h))
    dark, mid, lite, trunk = pal
    c.rect(x - 1, base - 6, 3, 7, trunk)
    tiers = max(3, int(h / 11))
    top = base - 6 - h
    for t in range(tiers):
        ty0 = top + t * h / tiers * .8
        th = h / tiers * 1.3
        wmax = (h * .42) * (0.32 + 0.68 * (t + 1) / tiers)
        tops = {}
        for j in range(int(th)):
            y = int(ty0 + j)
            half = wmax * (j / th) ** .85
            jag = (1 if j % 3 == 2 else 0) if j > 2 else 0
            for xx in range(int(x - half - jag), int(x + half + jag) + 1):
                side = (xx - x) / max(1, half)
                col = dark if side > .3 else (lite if side < -.5 and j > 1 else mid)
                if j == int(th) - 1 or (jag and abs(side) > .9):
                    col = dark
                c.px(xx, y, col)
                tops.setdefault(xx, y)
        if snow:
            for xx, y in tops.items():
                left = xx <= x + 1
                if rnd.random() < density * (1 if left else .45):
                    c.px(xx, y, '#ffffff' if left else '#d6e1f2')
                    if left and rnd.random() < density * .8:
                        c.px(xx, y + 1, '#e3ebf7')


def bush(c, x, y, r, rnd):
    """A snow-laden shrub: a dark rounded mass, lit from the left, snow heaped on top."""
    for j in range(-r, 1):
        for i in range(-r - 2, r + 3):
            if (i / (r + 2)) ** 2 + (j / r) ** 2 <= 1:
                col = '#1a2747' if i > r * .3 else '#24365c'
                if j < -r * .45:
                    col = '#ffffff' if i < 0 else '#dbe5f3'
                elif j < -r * .3 and rnd.random() < .5:
                    col = '#e7eef8'
                c.px(x + i, y + j, col)
    c.rect(x - r - 2, y + 1, 2 * r + 5, 1, '#c3d0e6')


def mound(c, x, y, w, h, base='#eef4fc', shade='#cddbee', lite='#ffffff'):
    for j in range(h):
        half = w / 2 * math.sqrt(1 - (j / h) ** 2)
        yy = y - j
        for xx in range(int(x - half), int(x + half) + 1):
            col = base
            if xx > x + half * .45:
                col = shade
            if j > h * .6 and xx < x:
                col = lite
            c.px(xx, yy, col)


def rock(c, x, y, w, h, snowy=True):
    for j in range(h):
        half = w / 2 * (1 - (j / h) ** 2 * .5)
        for xx in range(int(x - half), int(x + half) + 1):
            col = '#6f7894' if xx < x else '#4e5672'
            if j == h - 1 or (snowy and j > h - 3):
                col = '#f2f6fd' if snowy else '#8d96b1'
            c.px(xx, y - j, col)
    c.px(x - w // 2, y, '#3a405a')


def buttercup(c, x, y, big=False):
    c.px(x, y + 1, '#3f7a3c'); c.px(x, y + 2, '#3f7a3c'); c.px(x - 1, y + 2, '#5b9a4c')
    pts = [(-1, -1), (1, -1), (-1, 1), (1, 1), (0, -2), (-2, 0), (2, 0)] if big else [(-1, 0), (1, 0), (0, -1), (0, 1)]
    for dx, dy in pts:
        c.px(x + dx, y + dy, '#f2c93a')
    c.px(x, y, '#d9472f')


def thorn(c, x, y, h, lean=0):
    for j in range(h):
        half = max(0, int((1 - j / h) * 2.5))
        cx = x + lean * j / h
        for xx in range(int(cx - half), int(cx + half) + 1):
            c.px(xx, y - j, '#8c0f2a' if xx > cx else '#d8203f')
        if j > 2 and j % 4 == 0:
            c.px(int(cx) + (2 if j % 8 else -2), y - j, '#d8203f')
    c.px(int(x + lean), y - h, '#ff6b7d')


def dust(c, x, y, w=9):
    for j in range(3):
        for xx in range(x - w // 2 + j * 2, x + w // 2 - j * 2 + 1):
            c.px(xx, y - j, '#9a9ca8' if j else '#7e808c')
    c.px(x, y - 3, '#b4b6c0')


def footprints(c, x0, x1, y, col):
    for x in range(x0, x1, 9):
        yy = y + (3 if (x // 9) % 2 else 0)
        c.rect(x, yy, 3, 2, col)


# ------------------------------------------------------------------ the forest
def forest(genocide):
    W = 850
    c = Canvas(W)
    rnd = random.Random(7)
    c.vgrad(0, 60, '#05070f', '#0b1226')
    c.vgrad(60, 118, '#0b1226', '#111c36')
    for i in range(70):
        c.px(rnd.randrange(W), rnd.randrange(50), '#3a4672' if i % 4 else '#c9d4f2')
    far = ('#0d1427', '#111a31', '#16213b', '#1c1520')
    mid = ('#141e38', '#1a2747', '#233458', '#24191f')
    near = ('#18233f', '#213256', '#2c426c', '#2a1c20')
    for i in range(30):
        pine(c, i * 30 + rnd.randrange(14), 104, 50 + rnd.randrange(18), far, snow=False, rnd=rnd)
    for i in range(22):
        pine(c, i * 40 + 12 + rnd.randrange(16), 114, 62 + rnd.randrange(22), mid, rnd=rnd)
    for i in range(13):
        pine(c, i * 68 + 30 + rnd.randrange(20), 124, 86 + rnd.randrange(24), near, rnd=rnd)
    # snow bank at the tree line, then the clearing
    c.vgrad(118, 240, '#e3ecf8', '#f4f8fe')
    for x in range(W):
        top = 116 + int(3 * math.sin(x * .09) + 2 * math.sin(x * .023 + 1))
        for y in range(top, 126):
            c.px(x, y, '#cbd8ec' if y < top + 2 else '#dce6f4')
        c.px(x, top, '#ffffff')
    for y in range(126, 142):
        for x in range(W):
            if BAYER[y % 4, x % 4] < (142 - y) / 22:
                c.px(x, y, '#c6d3e9')
    for i in range(16):
        mound(c, i * 56 + rnd.randrange(30), 128, 30 + rnd.randrange(24), 5 + rnd.randrange(4))
    for i in range(9):
        x = 40 + i * 95 + rnd.randrange(30)
        mound(c, x, 236, 50 + rnd.randrange(30), 8 + rnd.randrange(5), '#f6f9ff', '#d3dff0')
    for i in range(7):
        bush(c, 60 + i * 120 + rnd.randrange(40), 218 + rnd.randrange(8), 9 + rnd.randrange(4), rnd)
    for i in range(5):
        pine(c, 20 + i * 190 + rnd.randrange(60), 246, 34 + rnd.randrange(10), near, rnd=rnd)
    # the path, packed snow with soft edges
    for x in range(W):
        y0 = 152 + int(2 * math.sin(x * .05)); y1 = 196 + int(2 * math.sin(x * .04 + 2))
        for y in range(y0, y1):
            col = '#d8e2f1' if BAYER[y % 4, x % 4] < .55 else '#dfe8f5'
            c.px(x, y, col)
        c.px(x, y0, '#c5d2e8'); c.px(x, y1, '#c9d5ea')
    for i in range(240):
        x, y = rnd.randrange(W), 128 + rnd.randrange(110)
        c.px(x, y, '#ffffff' if i % 3 else '#c3d0e6')
    for i in range(14):
        rock(c, rnd.randrange(W), 206 + rnd.randrange(28), 6 + rnd.randrange(5), 4 + rnd.randrange(3))
    # the sign
    sx = 150
    c.rect(sx - 1, 112, 3, 22, '#4b3326'); c.rect(sx - 15, 100, 31, 15, '#3a271d'); c.rect(sx - 14, 101, 29, 13, '#7a5236')
    c.rect(sx - 14, 101, 29, 2, '#9b6c49'); c.rect(sx - 11, 105, 22, 1, '#3a271d'); c.rect(sx - 11, 108, 16, 1, '#3a271d'); c.rect(sx - 14, 100, 29, 1, '#f4f8fe')
    footprints(c, 480, 700, 182, '#bccbe2' if not genocide else '#c49aa6')
    if genocide:
        for i in range(10):
            dust(c, 300 + i * 52 + rnd.randrange(20), 170 + rnd.randrange(40))
        for i in range(6):
            buttercup(c, 300 + i * 19, 158 + (i % 2) * 4)
        for i in range(7):
            thorn(c, 520 + i * 21, 200 + (i % 3) * 6, 9 + (i % 3) * 4, lean=(i % 2) * 2 - 1)
    else:
        for i in range(6):
            buttercup(c, 300 + i * 17, 160 + (i % 2) * 5, big=i % 3 == 0)
    c.save('forest-' + ('g' if genocide else 'p'))
    # foreground: dark trunks of trees nearer than the path, at the bottom edge
    f = Canvas(W)
    for x in (70, 410, 640, 820):
        for y in range(204, 240):
            w = 6 + (y - 204) // 8
            for xx in range(x - w, x + w):
                f.px(xx, y, '#0a0f1e' if xx > x - w + 2 else '#16203a')
        mound(f, x, 240, 34, 6, '#f4f8fe', '#d4e0f1')
    f.save('forest-fg')


# ------------------------------------------------------------------ the gallery
MURAL_TINT = ('#8f86ad', '#c8bfe0', '#4c4566')


def carve(c, x, y, mask, ink, shadow, k=2):
    """Mural pictogram, carved at 2x: a light face with a dark lower-right bevel."""
    for j, row in enumerate(mask):
        for i, ch in enumerate(row):
            if ch in '#ry':
                c.rect(x + i * k + 1, y + j * k + 1, k, k, shadow)
    for j, row in enumerate(mask):
        for i, ch in enumerate(row):
            col = {'#': ink, 'r': '#c4452f', 'y': '#e8c046'}.get(ch)
            if col:
                c.rect(x + i * k, y + j * k, k, k, col)
                if ch == '#' and (j == 0 or mask[j - 1][i] != '#'):
                    c.rect(x + i * k, y + j * k, k, 1, '#ddd5f2')


GHOST = ["..###..", ".#####.", "##.#.##", "#######", "#######", "#######", "#.#.#.#"]
KNIGHT = ["..r....", ".###...", ".#.##..", "#####.#", "#####.#", "#####.#", "#####.#", "#.#.#.#"]
HUMAN = [".##.", ".##.", "####", ".##.", ".##.", ".#.#", ".#.#"]
KING = ["#...#", "#####", ".###.", "#####", "#####", "#####", "#####", "#####", "##.##"]
TURTLE = [".###.", "#####", "#####", "#.#.#"]
SOUL = ["##.##", "#####", ".###.", "..#.."]


def mural(c, i, x, y):
    """One carved tablet, 96 x 86: a scene in raised relief, then three lines of script."""
    c.rect(x - 3, y - 3, 102, 92, '#0d0914')
    c.rect(x, y, 96, 86, '#3a3152'); c.rect(x + 2, y + 2, 92, 82, '#2c2440')
    c.rect(x, y, 96, 1, '#5a4f78'); c.rect(x, y, 1, 86, '#4a4066'); c.rect(x + 95, y, 1, 86, '#1b1528'); c.rect(x, y + 85, 96, 1, '#1b1528')
    ink, hi, dim, far, sh = '#9b91bd', '#d3c9ef', '#6c6390', '#4d4668', '#15101d'
    P = lambda m, dx, dy, col=ink: carve(c, x + dx, y + dy, m, col, sh)
    ground = lambda yy: c.rect(x + 6, y + yy, 84, 1, dim)
    if i == 0:
        for k, dx in enumerate((10, 41, 72)):
            P(KNIGHT, dx, 18 + (k % 2) * 4)
        ground(54)
    elif i == 1:
        P(KING, 43, 6, hi); P(KNIGHT, 12, 26); P(KNIGHT, 70, 26); P(TURTLE, 26, 42)
        ground(54)
    elif i == 2:
        P(HUMAN, 8, 30); P(HUMAN, 20, 32); c.rect(x + 28, y + 36, 24, 1, hi); c.rect(x + 50, y + 35, 2, 3, hi)
        P(GHOST, 56, 26, dim); P(GHOST, 74, 34, far)
        ground(54)
    elif i == 3:
        c.rect(x + 4, y + 8, 22, 46, '#0d0914'); c.rect(x + 4, y + 8, 22, 2, '#4a4066')
        P(GHOST, 28, 36); P(GHOST, 44, 40)
        P(KNIGHT, 70, 22, hi)
        ground(54)
    elif i == 4:
        c.rect(x + 8, y + 22, 20, 14, ink); c.rect(x + 6, y + 16, 24, 6, hi); c.rect(x + 15, y + 28, 6, 8, sh); P(GHOST, 30, 36)
        for k in range(8):
            c.rect(x + 52 + k * 5, y + 12 + (k % 3) * 4, 2, 2, '#c4452f')
        c.rect(x + 48, y + 8, 42, 1, dim)
        ground(54)
    else:
        for dx in (14, 44, 74):
            P(HUMAN, dx, 30)
            carve(c, x + dx - 1, y + 16, SOUL, '#e8c046', sh)
        c.rect(x + 4, y + 8, 88, 1, '#e8c046'); c.rect(x + 4, y + 10, 88, 1, '#8a6f2a')
        ground(54)
    rnd = random.Random(i)
    for row in (62, 69, 76):
        xx = x + 8
        while xx < x + 86:
            w = 2 + rnd.randrange(5)
            c.rect(xx, y + row, w, 2, '#6c6390'); c.rect(xx, y + row + 2, w, 1, '#1b1528')
            xx += w + 2


def gallery(genocide):
    W = 750
    c = Canvas(W)
    c.rect(0, 0, W, H, '#0b0812')
    c.vgrad(10, 168, '#1d1630', '#2a2142')
    rnd = random.Random(3)
    for row in range(0, 160, 13):
        y = 10 + row
        c.rect(0, y, W, 1, '#16101f')
        off = 0 if (row // 13) % 2 else 22
        for x in range(off, W, 44):
            c.rect(x, y, 1, 13, '#16101f')
            if rnd.random() < .3:
                c.rect(x + 2, y + 2, 6 + rnd.randrange(8), 1, '#352a4f')
    for i in range(40):
        x, y = rnd.randrange(W), 12 + rnd.randrange(150)
        for k in range(4 + rnd.randrange(6)):
            c.px(x + k, y + (k * k) % 3, '#120d1b')
    # glowing crystals in the corners of the wall
    for i in range(9):
        x = 40 + i * 84 + rnd.randrange(20)
        for k in range(5):
            c.px(x, 160 - k, '#3fd6d8' if k < 4 else '#a8fbff'); c.px(x + 1, 160 - k + 1, '#2a8c96')
        for k in range(10):
            c.blend(x + rnd.randrange(-6, 7), 150 + rnd.randrange(14), '#3fd6d8', .25)
    for i in range(6):
        mx = 39 + i * 116
        for y in range(18, 130):
            for x in range(mx - 10, mx + 106):
                if BAYER[y % 4, x % 4] < .18 * (1 - abs(x - mx - 48) / 60) * (1 - abs(y - 74) / 70):
                    c.blend(x, y, '#6b5b9a', .5)
        mural(c, i, mx, 30)
        if i == 3:
            if genocide:
                for k in range(5):
                    thorn(c, mx + 10 + k * 19, 130, 12 + (k % 2) * 5, lean=(k % 2) * 2 - 1)
            else:
                for k in range(4):
                    buttercup(c, mx + 22 + k * 17, 126, big=k % 2 == 1)
    # floor
    c.rect(0, 166, W, 3, '#3d3258')
    c.vgrad(169, 240, '#2b2342', '#221b35')
    for x in range(0, W, 26):
        c.rect(x, 169, 1, 71, '#1d162e')
    for y in (190, 214):
        c.rect(0, y, W, 1, '#1d162e')
    for i in range(30):
        x, y = rnd.randrange(W), 175 + rnd.randrange(60)
        c.rect(x, y, 2 + rnd.randrange(3), 1, '#3a3052')
    if genocide:
        for i in range(5):
            dust(c, 100 + i * 140 + rnd.randrange(40), 200 + rnd.randrange(30))
    c.save('gallery-' + ('g' if genocide else 'p'))


# ------------------------------------------------------------------ the ledge
def ledge(genocide):
    W = 560
    c = Canvas(W)
    c.vgrad(0, 90, '#020308', '#08101f')
    rnd = random.Random(11)
    for i in range(50):
        c.px(rnd.randrange(300), rnd.randrange(70), '#7d88b8' if i % 5 else '#ffffff')
    # the valley far below: rows of tiny snowy pines, a lit little house
    far = ('#0b1428', '#0f1a33', '#152342', '#120c12')
    c.vgrad(70, 240, '#09122a', '#0c1834')
    for row, (base, hgt) in enumerate(((92, 14), (118, 18), (148, 22), (184, 28), (228, 34))):
        for i in range(17):
            pine(c, i * 19 + rnd.randrange(9) + row * 5, base, hgt + rnd.randrange(6), far, snow=True, rnd=rnd, density=.55 + row * .08)
    hx, hy = 118, 136
    c.rect(hx - 10, hy + 12, 44, 4, '#dfe7f4')
    c.rect(hx, hy, 22, 13, '#1a2238'); c.rect(hx - 2, hy - 6, 26, 6, '#e7eef9'); c.rect(hx + 1, hy - 1, 20, 1, '#121a2d')
    for wx in (hx + 4, hx + 14):
        c.rect(wx, hy + 4, 4, 4, '#1f2433' if genocide else '#f6d870')
        if not genocide:
            for k in range(14):
                c.blend(wx + rnd.randrange(-6, 9), hy + rnd.randrange(-2, 14), '#f6d870', .18)
    c.rect(hx + 9, hy + 7, 4, 6, '#2a2018')
    # the cliff: stratified rock, the snow ledge, the drop below
    cliff_x = 300
    for y in range(0, 240):
        band = (y // 6) % 3
        for x in range(cliff_x + (2 if band == 1 else 0) - int(4 * math.sin(y * .2)), W):
            col = ('#5e6589', '#565c80', '#4f5577')[band]
            if (x * 3 + y * 7) % 31 == 0:
                col = '#6c7398'
            c.px(x, y, col)
        c.px(cliff_x - int(4 * math.sin(y * .2)) + (2 if band == 1 else 0), y, '#2b3049')
    c.rect(0, 165, W, 41, '#d4def0')
    for x in range(W):
        top = 165 + int(1.5 * math.sin(x * .13))
        c.px(x, top, '#ffffff'); c.px(x, top + 1, '#eef3fb')
        for y in range(201, 206):
            c.px(x, y, '#aab6cf' if y < 203 else '#8a95b3')
    c.rect(0, 206, W, 34, '#3d4363')
    for y in range(206, 240, 5):
        for x in range(0, W, 13):
            c.rect(x + (y % 3) * 4, y, 6, 1, '#4b5274')
    for i in range(90):
        c.px(rnd.randrange(W), 167 + rnd.randrange(34), '#ffffff' if i % 2 else '#bccae0')
    # the cave door in the cliff
    dx = 481
    for y in range(110, 166):
        half = 16 if y > 122 else int(16 * math.sqrt(max(0, 1 - ((122 - y) / 12) ** 2)))
        for x in range(dx - half - 2, dx + half + 3):
            c.px(x, y, '#2e3350')
        for x in range(dx - half, dx + half + 1):
            c.px(x, y, '#040406' if not genocide else '#060305')
    for k in range(16):
        c.blend(dx - 10 + rnd.randrange(20), 150 + rnd.randrange(16), '#7fd38f' if not genocide else '#8c0f2a', .12)
    if genocide:
        for k in range(6):
            thorn(c, dx - 14 + k * 6, 166, 14 + (k % 2) * 6, lean=(k % 3) - 1)
    for i in range(4):
        rock(c, 330 + i * 60 + rnd.randrange(20), 200, 6, 4)
    c.save('ledge-' + ('g' if genocide else 'p'))


# ------------------------------------------------------------------ the memorial
def memorial(genocide):
    W = 320
    c = Canvas(W)
    c.rect(0, 0, W, H, '#030504')
    c.vgrad(14, 158, '#0b1410', '#13221b')
    rnd = random.Random(5)
    for row in range(14, 158, 11):
        c.rect(30, row, 260, 1, '#0a120e')
        off = 0 if (row // 11) % 2 else 14
        for x in range(30 + off, 290, 28):
            c.rect(x, row, 1, 11, '#0a120e')
    for x in (30, 289):
        c.rect(x - 8, 14, 8, 146, '#0a110d')
    # pillars
    for px_ in (58, 262):
        c.rect(px_ - 9, 18, 18, 140, '#1d2a23'); c.rect(px_ - 9, 18, 4, 140, '#2c3d33'); c.rect(px_ + 6, 18, 3, 140, '#121b16')
        c.rect(px_ - 12, 18, 24, 6, '#2c3d33'); c.rect(px_ - 12, 152, 24, 6, '#2c3d33')
    # light from above
    for y in range(0, 160):
        spread = 20 + y * .35
        for x in range(int(215 - spread), int(215 + spread)):
            if BAYER[y % 4, x % 4] < .22 * (1 - y / 190):
                c.blend(x, y, '#c9f2c5', .35)
    for i, lx in enumerate((150, 192, 238, 280)):
        c.rect(lx - 3, 40, 7, 11, '#2c3d33'); c.rect(lx - 2, 41, 5, 8, '#e2f6d8'); c.rect(lx - 1, 42, 3, 5, '#ffffff')
        for k in range(30):
            c.blend(lx + rnd.randrange(-12, 13), 38 + rnd.randrange(18), '#b7f0b0', .12)
    # floor
    c.vgrad(158, 240, '#16231c', '#0f1813')
    for i in range(40):
        c.rect(rnd.randrange(W), 162 + rnd.randrange(76), 3 + rnd.randrange(6), 1, '#1e2d25')
    # pedestal and plaque
    px0 = 215
    c.rect(px0 - 30, 112, 60, 48, '#2c3a33'); c.rect(px0 - 33, 108, 66, 6, '#3c4c44'); c.rect(px0 - 33, 108, 66, 1, '#5b7064')
    c.rect(px0 - 30, 112, 4, 48, '#3a4b42'); c.rect(px0 + 26, 112, 4, 48, '#1d2722')
    c.rect(px0 - 16, 126, 32, 16, '#1d2722'); c.rect(px0 - 15, 127, 30, 14, '#24312a')
    for k, w in enumerate((22, 16, 20)):
        c.rect(px0 - 11, 130 + k * 4, w, 1, '#6e8a78')
    for k in range(3):
        c.rect(px0 - 24 + k * 22, 100, 6, 3, '#3c4c44')
    if genocide:
        for k in range(6):
            dust(c, 70 + k * 40, 200 + (k % 2) * 14)
    else:
        for k in range(9):
            buttercup(c, px0 - 30 + k * 7, 163 + (k % 2) * 3, big=k % 3 == 0)
        for k in range(10):
            buttercup(c, 40 + k * 26 + rnd.randrange(8), 205 + rnd.randrange(26), big=k % 2 == 0)
    c.save('memorial-' + ('g' if genocide else 'p'))


# ------------------------------------------------------------------ the battle backdrop
def battle(genocide):
    """Behind Marigold: the night forest at the edge of the clearing, a moon, ground fog. Kept dark so text reads."""
    W = 320
    c = Canvas(W)
    c.rect(0, 0, W, H, '#000000')
    c.vgrad(0, 70, '#020308', '#0a0d1c' if not genocide else '#1a0508')
    c.vgrad(70, 118, '#0a0d1c' if not genocide else '#1a0508', '#05060c')
    rnd = random.Random(21 if genocide else 20)
    for i in range(40):
        c.px(rnd.randrange(W), rnd.randrange(60), '#3a4268' if i % 3 else '#9aa6d6')
    mx, my, r = 252, 28, 11
    for y in range(my - r - 6, my + r + 7):
        for x in range(mx - r - 6, mx + r + 7):
            d = math.hypot(x - mx, y - my)
            if d <= r:
                col = ('#dfe6f5' if x < mx + 3 else '#b9c3dc') if not genocide else ('#c8303f' if x < mx + 3 else '#8c1726')
                if (x * 7 + y * 3) % 11 == 0:
                    col = '#c3cbe0' if not genocide else '#a8222f'
                c.px(x, y, col)
            elif d <= r + 6 and BAYER[y % 4, x % 4] < .35 * (1 - (d - r) / 6):
                c.blend(x, y, '#8e9cc8' if not genocide else '#7a1220', .35)
    pal = ('#070a14', '#0a0e1c', '#0e1426', '#050506') if not genocide else ('#0c0406', '#11060a', '#170a0e', '#050304')
    for i in range(16):
        pine(c, i * 22 + rnd.randrange(10), 118, 34 + rnd.randrange(22), pal, snow=not genocide, rnd=rnd, density=.25)
    for i in range(10):
        pine(c, i * 34 + rnd.randrange(14), 124, 50 + rnd.randrange(20), pal, snow=not genocide, rnd=rnd, density=.35)
    for y in range(100, 128):
        for x in range(W):
            if BAYER[y % 4, x % 4] < (y - 100) / 40:
                c.blend(x, y, '#1a2238' if not genocide else '#2a0c12', .55)
    # moonlit snow on the trees, dimmed so it stays behind the fight
    a = c.a[60:128]
    bright = (a[..., 0] > 190) & (a[..., 2] > 200)
    a[bright] = hexc('#46506e')
    if genocide:
        for k in range(14):
            thorn(c, 8 + k * 23 + rnd.randrange(8), 126, 8 + rnd.randrange(12), lean=rnd.randrange(-2, 3))
    else:
        for k in range(12):
            buttercup(c, 10 + k * 26 + rnd.randrange(10), 122 + rnd.randrange(4))
    c.save('battle-' + ('g' if genocide else 'p'))


for g in (False, True):
    forest(g); gallery(g); ledge(g); memorial(g); battle(g)
print('painted', OUT)
