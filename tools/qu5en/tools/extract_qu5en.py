"""Cut QU5EN's art out of the designer's sheets.

python3 -I tools/qu5en/tools/extract_qu5en.py <sheet.png> <head.jpg> <out-dir>

- <sheet.png>: the designer's sprite sheet (grid of cells on a purple key): the blue fighter (6 poses), the
  vector fighter (22 poses), three talk heads, the wireframe globe, and the arcade text (YOU LOSE!, HERO HP, ROUND 1, FIGHT, DRAW, FIGHT AGAIN, GIVE UP, RETIRE, TIME) and bursts.
- <head.jpg>: the designer's screenshot of the giant wireframe head; the head is traced from its colour and
  scaled down to its 2-pixel line grid. A closed-mouth copy ('head_closed') is drawn from it; she only opens her
  mouth while she talks.
Writes qu5en.png (the atlas), qu5en.json (frame rectangles) and globe.png (the backdrop) into <out-dir>.
The blue fighter is also written recoloured purple ('seth_*'), as Seth's arcade avatar.
"""
import json, sys
from collections import deque
from PIL import Image

BG, FILL = (195, 134, 255), (138, 90, 157)
BLUE, SETH = (0, 162, 232), (178, 73, 220)
NAMES = (['fighter_idle0', 'fighter_idle1', 'fighter_high', 'fighter_low', 'fighter_guard', 'fighter_ko'] +
         ['q_idle0', 'q_idle1', 'q_idle2', 'q_idle3', 'q_punch', 'q_idle4', 'q_lean', 'q_stance', 'q_hurt', 'q_crouch',
          'q_stance2', 'q_charge0', 'q_charge1', 'q_charge2', 'q_low', 'q_hurt2', 'q_kick0', 'q_kick1', 'q_ko', 'q_win0',
          'q_win1', 'q_walk', 'face_talk', 'face_smile', 'face_smug'])
# The arcade text and effects, in sheet order after the globe.
TEXT = ['you_lose', 'burst_red', 'burst_pink', 'wheel', 'octagon', 'tri', 'arrow', 'hero_hp', 'queen_hp', 'round1', 'fight',
        'draw', 'fight_again0', 'fight_again1', 'give_up0', 'give_up1', 'give_up2', 'retire0', 'retire1', 'time']


def cells(im):
    W, H = im.size; px = im.load(); seen = [[False] * W for _ in range(H)]; out = []
    for y in range(H):
        for x in range(W):
            if seen[y][x] or px[x, y] == FILL:
                continue
            q = deque([(x, y)]); seen[y][x] = True; x0 = x1 = x; y0 = y1 = y; n = 0
            while q:
                cx, cy = q.popleft(); n += 1; x0 = min(x0, cx); x1 = max(x1, cx); y0 = min(y0, cy); y1 = max(y1, cy)
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < W and 0 <= ny < H and not seen[ny][nx] and px[nx, ny] != FILL:
                        seen[ny][nx] = True; q.append((nx, ny))
            if n > 200:
                out.append((x0, y0, x1 + 1, y1 + 1))
    return out


def keyed(im, box, key=BG):
    c = im.crop(box).convert('RGBA'); px = c.load()
    for y in range(c.height):
        for x in range(c.width):
            if px[x, y][:3] == key:
                px[x, y] = (0, 0, 0, 0)
    bb = c.getbbox()
    return c.crop(bb) if bb else c


def head(path):
    src = Image.open(path).convert('RGB'); px = src.load(); W, H = src.size
    pts = [(x, y) for y in range(min(H, 500)) for x in range(W)
           if (lambda r, g, b: g > 150 and r > 110 and b < 120 and g > r)(*px[x, y])]
    x0 = min(p[0] for p in pts); x1 = max(p[0] for p in pts); y0 = min(p[1] for p in pts); y1 = max(p[1] for p in pts)
    mask = Image.new('L', (x1 - x0 + 1, y1 - y0 + 1), 0); mp = mask.load()
    for x, y in pts:
        mp[x - x0, y - y0] = 255
    f = 3.75
    small = mask.resize((round(mask.width / f), round(mask.height / f)), Image.BOX); sp = small.load()
    out = Image.new('RGBA', small.size, (0, 0, 0, 0)); op = out.load()
    for y in range(small.height):
        for x in range(small.width):
            if sp[x, y] > 70:
                op[x, y] = (181, 230, 29, 255)
    return out


def closed_mouth(head):
    """Her head with the mouth shut: the open jaw's inner lines go, the jaw and chin outline stay, and a closed smirk
    is drawn under the visor. The pixel ranges are in the 66x71 head this file produces."""
    img = head.copy(); px = img.load(); lime = (181, 230, 29, 255)
    erase = [((22, 23), (45, 46)), ((44, 45), (45, 46)), ((22, 45), (47, 48)), ((26, 31), (49, 51)), ((26, 27), (52, 58)),
             ((26, 29), (59, 59)), ((28, 29), (60, 62)), ((30, 31), (63, 64)), ((34, 37), (63, 64)), ((38, 39), (57, 62)),
             ((40, 41), (49, 62))]
    for (x0, x1), (y0, y1) in erase:
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if x < img.width and y < img.height:
                    px[x, y] = (0, 0, 0, 0)
    for (x0, x1), (y0, y1) in [((28, 39), (52, 53)), ((26, 27), (50, 51)), ((40, 41), (50, 51))]:
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                px[x, y] = lime
    return img


def main():
    sheet, head_path, out = sys.argv[1:4]
    im = Image.open(sheet).convert('RGB'); cs = cells(im)
    frames = {}
    sprite_cells, globe, rest = cs[:31], cs[31], cs[32:]
    for name, box in zip(NAMES, sprite_cells):
        frames[name] = keyed(im, box)
        if name.startswith('fighter_'):
            s = frames[name].copy(); p = s.load()
            for y in range(s.height):
                for x in range(s.width):
                    if p[x, y][:3] == BLUE:
                        p[x, y] = SETH + (255,)
            frames['seth_' + name[8:]] = s
    for name, box in zip(TEXT, rest):
        frames['ui_' + name] = keyed(im, box)
    frames['head'] = head(head_path)
    frames['head_closed'] = closed_mouth(frames['head'])
    keyed(im, globe, (0, 0, 0)).save(f'{out}/globe.png')
    # Shelf-pack the frames into one atlas.
    order = sorted(frames, key=lambda k: -frames[k].height); x = y = row = 0; W = 512; rects = {}
    for k in order:
        f = frames[k]
        if x + f.width > W:
            x = 0; y += row + 1; row = 0
        rects[k] = [x, y, f.width, f.height]; x += f.width + 1; row = max(row, f.height)
    atlas = Image.new('RGBA', (W, y + row + 1), (0, 0, 0, 0))
    for k, (ax, ay, w, h) in rects.items():
        atlas.paste(frames[k], (ax, ay))
    atlas.save(f'{out}/qu5en.png', optimize=True)
    json.dump(rects, open(f'{out}/qu5en.json', 'w'), separators=(',', ':'))
    print(atlas.size, len(rects))


if __name__ == '__main__':
    main()
