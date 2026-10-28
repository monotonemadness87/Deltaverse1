# Human Seth's overworld walk, built on the designer's Flower Seth sheet: the front idle frame is theirs
# (recoloured to human skin, pure black outline); the back, the profile and every step frame are drawn to match.
import sys, json
from PIL import Image

P = {'k': (10, 6, 18), 'h': (163, 73, 164), 'H': (103, 50, 149), 'L': (200, 112, 201), 's': (250, 214, 192), 'S': (226, 168, 150),
     'w': (255, 255, 255), 'n': (154, 126, 211), 'N': (154, 163, 211), 'c': (186, 71, 174), 'C': (138, 46, 128)}
W = 24
FRONT = [
"........................",
".....kkkkkk.............",
"......khhhhkkkk.........",
"......kkHHhhhhHkk.......",
".....kHHHhhLLhhhhkk.....",
"....kkhhhkhhLhhhhhhk....",
"....khhhhkhhhhhhhhhk....",
"...kkhhhkkHhhhHhhhhhk...",
"...kHhkkHskHkkkhhhhhk...",
"...kHkHwksskwwwkhhhhkk..",
"...khkwwkskkkwwwkhhhhk..",
"...kkkHkwkkwkkkkkkhhhk..",
"...khkwkwsskkwwwkhhhhk..",
"...khkkksssskkkkkhhhhk..",
"...khksskksssskskhhhhk..",
"..kkhksskSkssssskhhhkk..",
"..kkHhkssSSkksskHhhhkk..",
"..kkHhHkkssssHkkHhhkkkk.",
"..kkkhHknHkkHHkkhhhkkkk.",
"...kkhhkknHHnnkHhhhkkkk.",
"...kkhkkNkknnnkHhhkkkkk.",
"...kkkNwwNHkkHkkhkkkkk..",
"...kHkHNwwNNkHHkkHHkk...",
"...kHkNNNNHkkkkkHHHHk...",
"...kHkNkkkHkkkkHcHHHk...",
"..kkckNkssskccccccHHk...",
"..kcckNkssskHccccccHk...",
"..kckkNkssskHcccccck....",
"..kckkNHHssHkccccHHk....",
"..kkkHkNHHHHkkkkkkkk....",
"..kHkcckkNNkkcHkkckk....",
"..kskcccHkkHcHkHHcHk....",
"...kHccccccckkHHHHck....",
"...kHccccckkHHnnHHckk...",
"...kccccckkHHnnnHkcHk...",
"...kcccckHHHknnnHkcck...",
"..kHcckkkHHHknnnHkHcHk..",
"..kcHkknnkkkkkkkknkHck..",
"..kkkknwwwwnkknnnnkkkk..",
".....kwwwwnnwwwwnnn.....",
"......nnnnkkwwwwwn......",
"............knnnn.......",
]
SIDE = [
"........................",
"..........kkkkkk........",
"........kkhhhhhhkk......",
".......khhhLLhhhhhk.....",
"......khhhLLhhhhhhhk....",
".....khhhhhhhhhhhhhhk...",
".....khhkkhhhhhhhhhhk...",
"....khhksskHhhhhhhhhhk..",
"....khksssskHhhhhhhhhk..",
"....kkkkksskHhhhhhhhhk..",
"...kwkwkksskHhhhhhhhhk..",
"...kkkkkssskHhhhhhhhhk..",
"....ksssssskhHhhhhhhhk..",
"...kssssssskhHhhhhhhhk..",
"....kSssssskhHhhhhhhhk..",
"....kkSsssskhHhhhhhhhk..",
".....kkSSskhHhhhhhhhhk..",
"......kkkkHhHhhhhhhhhk..",
"......kccckHhhhhhhhhhk..",
".....kNNNNkHhhhhhhhhHk..",
".....kNwwNkcHhhhhhhhHk..",
"....ksNwwNkccHhhhhhhHk..",
"....ksNNNNkcccHhhhhhHk..",
".....kNNNNkccccHhhhHk...",
".....kNNNNkcccccHHHk....",
".....kkkkkkccccccHck....",
".....kcccccccccccccck...",
"....kccccccccccccccck...",
"....kcccHcccccccccCk....",
"....kccHcccccccccCCk....",
"....kcHccccccccccCCk....",
"...kccHcccccccccccCk....",
"...kcHccccccccccccCk....",
"...kcHcccccccccccCCk....",
"...kHccccccccccCCCk.....",
"...kCCCCCCCCCCCCCk......",
"....kkkkknnkknnkk.......",
"......knnnkknnnk........",
"......knnnkknnnk........",
".....kwwwwkwwwwk........",
"....kwwwwwkwwwk.........",
"....kkkkkkkkkkk.........",
]
BACK = [
"........................",
"........kkkkkk..........",
"......kkhhhhhhkk........",
".....khhhLLhhhhhk.......",
"....khhhLLhhhhhhhk......",
"...khhhhLhhhhhhhhhk.....",
"...khhhhhhhhHhhhhhk.....",
"..khhhhhhhhhHhhhhhhk....",
"..khHhhhhhhhHhhhhHhk....",
"..khHhhhhhhHhhhhhHhk....",
"..khHhhhhhhHhhhhhHhhk...",
"..khHhhhhhhHhhhhhHhhk...",
"..khhHhhhhhHhhhhhHhhk...",
"..khhHhhhhhHhhhhHhhhk...",
"..khhHhhhhhhHhhhHhhhk...",
".kkhhHhhhhhhHhhhHhhhkk..",
".kHhhHhhhhhhHhhhHhhhHk..",
".kHhhhHhhhhhHhhhhHhhHk..",
".kcHhhHhhhhhHhhhhHhHck..",
".kcHhhhHhhhhHhhhhHhHck..",
".kccHhhHhhhhHhhhhHhccck.",
".kccHhhhHhhhHhhhHhhccck.",
".kcccHhhHhhhHhhhHhcccck.",
".kcccHhhhHhhHhhHhhcccck.",
".kccccHhhHhhHhhHhccccck.",
".kccccHhkhhkhhkhcccccck.",
".kcccccHkcHkcHkcccccck..",
"..kcccccccccccccccccck..",
"..kCcccccccccccccccCk...",
"..kCccccccccccccccCk....",
"..kCcccccCcccccccccCk...",
"...kCccccCccccccccCk....",
"...kCccccCcccccccccCk...",
"...kCcccccCcccccccCCk...",
"...kCCccccCccccccCCk....",
"..kCCCCCCCCCCCCCCCCCk...",
"..kkkkknnkkkkkknnkkkk...",
".....knnnk...knnnk......",
".....knnnk...knnnk......",
".....kwwwwk..kwwwwk.....",
".....kkkkkk..kkkkkk.....",
"........................",
]


def grid(rows):
    return [list(r.ljust(W, '.')[:W]) for r in rows]


def back_from(front):
    g = grid(front)
    out = [['.'] * W for _ in g]
    for y, row in enumerate(g):
        xs = [x for x, ch in enumerate(row) if ch != '.']
        if not xs:
            continue
        a, b = xs[0], xs[-1]
        for x in range(a, b + 1):
            out[y][x] = row[x] if row[x] == '.' else 'k'
        if y < 29:  # long hair covers the head and shoulders
            for x in range(a + 1, b):
                out[y][x] = 'H' if x in (a + 1, b - 1) else ('L' if (y in (3, 4, 5) and abs(x - (a + b) // 2 + 1) < 2) else 'h')
            if 6 < y < 28 and a + 3 < (a + b) // 2 < b - 3:
                out[y][(a + b) // 2] = 'H'
        elif y < 37:  # the coat
            for x in range(a + 1, b):
                out[y][x] = 'C' if x in (a + 1, b - 1) or y == 36 else 'c'
        else:
            for x in range(a, b + 1):
                out[y][x] = row[x]
    return out


def shift_block(g, x0, x1, y0, y1, dx, dy):
    src = [r[:] for r in g]
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            g[y][x] = '.' if y >= y1 - 3 else g[y][x]
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if src[y][x] != '.' and 0 <= y + dy < len(g) and 0 <= x + dx < W:
                g[y + dy][x + dx] = src[y][x]
    return g


def steps(base, feet):
    """Two step frames. Facing you or away, each foot lifts a pixel in turn; in profile the feet stride apart and back."""
    out = []
    for moves in feet:
        g = [r[:] for r in base]
        for (x0, x1, dx, dy) in moves:
            g = shift_block(g, x0, x1, 36, 41, dx, dy)
        out.append(g)
    return out


def image(g):
    im = Image.new('RGBA', (W, len(g)), (0, 0, 0, 0))
    for y, row in enumerate(g):
        for x, ch in enumerate(row):
            if ch != '.':
                im.putpixel((x, y), P[ch] + (255,))
    return im


def main(out):
    front, side = grid(FRONT), grid(SIDE)
    back = grid(BACK)
    frames = {}
    for name, base, feet in (('down', front, [[(2, 11, 0, -1)], [(12, 21, 0, -1)]]), ('up', back, [[(2, 10, 0, -1)], [(11, 21, 0, -1)]]), ('left', side, [[(3, 9, -1, 0), (10, 16, 1, 0)], [(3, 9, 1, -1), (10, 16, -1, 0)]])):
        a, b = steps(base, feet)
        frames[name + '_stand'], frames[name + '_stepA'], frames[name + '_stepB'] = image(base), image(a), image(b)
    for k in ('stand', 'stepA', 'stepB'):
        frames['right_' + k] = frames['left_' + k].transpose(Image.FLIP_LEFT_RIGHT)
    names = list(frames)
    atlas = Image.new('RGBA', (W * len(names), 42), (0, 0, 0, 0))
    place = {}
    for i, n in enumerate(names):
        atlas.paste(frames[n], (i * W, 0))
        place[n] = [i * W, 0, W, 42]
    atlas.save(out + '.png')
    json.dump(place, open(out + '.json', 'w'))
    if len(sys.argv) > 2:
        atlas.resize((atlas.width * 6, atlas.height * 6), Image.NEAREST).save(sys.argv[2])


if __name__ == '__main__':
    main(sys.argv[1])
