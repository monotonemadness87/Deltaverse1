# Paint the rooms as pixel art at 1x (shown at 2x): the crystal cavern (the whole walk) and the battle backdrop. Living things (echo flowers, ceiling gems, the crystal itself, water shimmer) are
# drawn live by the page on top of these.
#   python3 -I tools/knight/tools/paint_rooms.py tools/knight/art/rooms
import sys, os, random
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
        self.a[..., 3] = 255

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
        for y in range(max(0, y0), min(self.h, y1)):
            t = (y - y0) / max(1, y1 - y0 - 1)
            for x in range(x0, x1):
                self.a[y, x] = B if t > BAYER[y % 4, x % 4] else A

    def save(self, name):
        Image.fromarray(self.a).save(os.path.join(OUT, name + '.png'), optimize=True)


# Waterfall's palette: deep navy rock, teal-blue highlights, dark violet floor.
ROCK = ['#05081a', '#0b1230', '#131d48', '#1e2c66']
FLOOR = ['#140f2c', '#1d1640', '#2a2058']
WATER = ['#0a2a5a', '#1550a0', '#3a8ee0']


def cave_wall(c, top, bottom, rnd, lite=ROCK[3]):
    """Layered rock with ragged ledges and the odd lighter seam."""
    c.vgrad(top, bottom, ROCK[0], ROCK[2])
    for _ in range(c.w // 6):
        x, y = rnd.randrange(c.w), rnd.randrange(top, bottom)
        w = rnd.randrange(6, 26)
        c.rect(x, y, w, 1, ROCK[1] if rnd.random() < .6 else lite)
    for x in range(c.w):
        # A ragged ceiling edge.
        for y in range(top, top + 3 + (x * 7 + x // 5 * 3) % 6):
            c.px(x, y, ROCK[0])


def floor(c, y0, rnd):
    c.vgrad(y0, H, FLOOR[1], FLOOR[0])
    c.rect(0, y0, c.w, 1, FLOOR[2])
    for _ in range(c.w // 3):
        c.px(rnd.randrange(c.w), rnd.randrange(y0 + 2, H), FLOOR[2])


def grass(c, x, base, n, rnd, col='#24407a'):
    for k in range(n):
        h = rnd.randrange(5, 12)
        xx = x + k * 2
        for y in range(h):
            c.px(xx + (1 if y > h * .6 and k % 2 else 0), base - y, col if y < h - 2 else '#3a62a8')


def shop():
    rnd = random.Random(1)
    c = Canvas(320)
    cave_wall(c, 0, 150, rnd)
    floor(c, 150, rnd)
    # Back wall planks, a hand-painted sign space, and shelves of salvaged junk.
    c.rect(150, 40, 160, 100, '#1a1430')
    for x in range(150, 310, 10):
        c.rect(x, 40, 1, 100, '#120e24')
    for sy in (58, 92):
        c.rect(158, sy, 144, 3, '#4a3a2a')
        for k in range(9):
            col = ['#6a7aa8', '#a86a4a', '#5a9a6a', '#c8b060', '#7a5aa8'][(k * 3 + sy) % 5]
            w, h = 6 + (k * 5) % 7, 6 + (k * 3) % 9
            c.rect(162 + k * 16, sy - h, w, h, col)
            c.rect(162 + k * 16, sy - h, w, 1, '#d8d8e8')
    # The counter Gerson stands behind.
    c.rect(170, 118, 124, 30, '#3a2a20')
    c.rect(170, 118, 124, 3, '#6a5040')
    for x in range(176, 294, 14):
        c.rect(x, 124, 1, 22, '#2a1e18')
    # A lantern and the doorway out (left).
    c.rect(20, 70, 34, 80, '#03050e')
    c.rect(18, 68, 38, 2, ROCK[3])
    c.rect(118, 56, 6, 8, '#e8c060')
    c.rect(117, 54, 8, 2, '#6a5040')
    grass(c, 64, 150, 6, rnd)
    c.save('shop')


def path():
    rnd = random.Random(2)
    c = Canvas(720)
    cave_wall(c, 0, 158, rnd)
    floor(c, 158, rnd)
    # The stream along the bottom edge.
    for y in range(214, 240):
        for x in range(c.w):
            t = (y - 214) / 26
            c.a[y, x] = hexc(WATER[0] if t + BAYER[y % 4, x % 4] * .5 < .55 else WATER[1])
    for _ in range(90):
        x, y = rnd.randrange(c.w), rnd.randrange(216, 238)
        c.rect(x, y, rnd.randrange(3, 9), 1, WATER[2])
    # The path narrows into a crack in the rock at the far end: the hidden way in.
    for x in range(560, 720):
        squeeze = int((x - 560) * .45)
        c.rect(x, 158, 1, min(40, squeeze), ROCK[1])
        c.rect(x, 0, 1, min(60, squeeze // 2 + 6), ROCK[0])
    c.rect(682, 96, 22, 62, '#020308')
    c.rect(680, 94, 26, 2, ROCK[3])
    for x in range(40, 680, 47):
        grass(c, x, 214 if x % 3 else 160, 4 + x % 5, rnd)
    c.save('path')


def cavern():
    rnd = random.Random(3)
    c = Canvas(320)
    # A tall round chamber: the walls arch in toward the top.
    c.vgrad(0, 240, '#03040c', '#0a1230')
    for y in range(0, 170):
        inset = int(max(0, 70 - y) * 1.1)
        c.rect(0, y, 24 + inset, 1, ROCK[1])
        c.rect(296 - inset, y, 24 + inset, 1, ROCK[1])
    floor(c, 170, rnd)
    # The plinth the crystal grows from, and a ring of smaller crystals.
    c.rect(130, 160, 60, 12, '#1a2450')
    c.rect(126, 168, 68, 6, '#141c40')
    c.rect(130, 160, 60, 1, '#3a5aa0')
    for k, x in enumerate((60, 92, 226, 254)):
        h = 10 + k * 3
        for y in range(h):
            w = max(1, (h - y) // 3)
            c.rect(x - w, 170 - y, w * 2, 1, '#4a78c8' if y % 3 else '#9ac8ff')
    c.save('cavern')


def battle():
    rnd = random.Random(4)
    c = Canvas(320)
    c.vgrad(0, 240, '#000000', '#060a20')
    # Faint facets of the crystal's inside: long diagonal seams.
    for k in range(18):
        x0, y0 = rnd.randrange(-60, 320), rnd.randrange(0, 240)
        for t in range(rnd.randrange(30, 90)):
            c.px(x0 + t, y0 - t * .6, '#0c1638' if k % 3 else '#13224e')
    for _ in range(40):
        c.px(rnd.randrange(320), rnd.randrange(200), '#28407a')
    c.save('battle')


cavern()
battle()
print('rooms ->', OUT)
