"""Cut the designer's White Roaring Knight sprite sheets and their Human Seth pack into the game's atlases.

python3 -I tools/knight/tools/extract_sheets.py <sheets-dir> <Human_Seth-dir> <side-dir> tools/knight/art

<sheets-dir> holds the four supplied sheets: a.png, b.png, c.png (the Knight's 24 body animations, one 8-frame
animation per row, 8 x 8 grids of 1254 px) and fx.png (16 four-frame effects, two per row). The animation names are
the ones the designer's own viewer shows (their screen recording). The sheets' colour channels carry stray glow in
fully transparent pixels, so only alpha decides what is kept (alpha >= 128).

<Human_Seth-dir> is the designer's Human Seth pack (sprites/body, sprites/effects, sprites/portraits; 128 px cells,
body anchor (64, 100)). Only its newly authored frames are used.

<side-dir> is the designer's White_Knight_Side_Battle_Sprites pack: 16 left-facing eight-frame animations in 112 px cells,
origin (56, 77), already clean (binary alpha, one 28-colour palette). Used as-is for the Deltarune half.

Clean pixels: the front sheets and the Human Seth pack are full of near-duplicate colours, which reads as speckle, so
the front Knight is snapped to the side pack's own 28-colour palette, Seth to one shared 24-colour palette, and then
isolated single pixels are replaced by their neighbours' colour. Effect sprites are shrunk (majority of each block) to
the size the page draws them, so every sprite is drawn at a whole-number scale; their entries carry that shrink
factor as a seventh number.

Each animation is cropped to the union of its frames' bounds, so its frames share one anchor (bottom centre for
bodies, centre for effects). Writes knight-anim.png/.json and seth2.png/.json; the json maps every frame name to
[x, y, w, h, ox, oy] where (ox, oy) is the anchor inside the frame.
"""
import json, os, sys
import numpy as np
from PIL import Image

BODY = {
    'a.png': ['idle', 'guard_parry', 'sword_windup', 'slash_horizontal', 'slash_diagonal', 'thrust_left', 'overhead_cleave', 'dash_left'],
    'b.png': ['phase2_idle', 'phase3_guard', 'back_idle', 'cast_star_storm', 'cast_diamond_storm', 'spin_multislash', 'finale_ascend', 'turn_back_to_front'],
    'c.png': ['arrival', 'roar_transition', 'cast_orbiting_blade', 'ground_slam', 'teleport_vanish', 'teleport_appear', 'hurt_stagger_kneel', 'defeat_dissolve'],
}
FX = [['sword_projectile', 'star_projectile'], ['diamond_shard', 'mini_knight'], ['crescent_slash', 'multislash_streak'], ['ground_spike', 'light_beam'],
      ['warning_reticle', 'splitting_diamond'], ['vortex_ring', 'heal_heart'], ['impact_star', 'twinkle'], ['hammer', 'ring_pulse']]
SETH_BODY = ['idle', 'talk', 'walk_front', 'walk_back', 'walk_left', 'cast_notebook_page', 'cast_glasses', 'shock_frustration', 'proud_laugh', 'read_notebook',
             'adjust_glasses', 'offer_hand_hug', 'kneel_stand', 'point_lecture']
SETH_FX = ['glasses_shield', 'magic_glasses_formation', 'floating_pages', 'impact_sparkle']
SETH_FACES = ['neutral', 'talking', 'happy', 'smug', 'shocked', 'angry', 'embarrassed', 'sad']


def clean(im):
    a = np.array(im.convert('RGBA'))
    keep = a[..., 3] >= 128
    a[..., 3] = np.where(keep, 255, 0)
    a[~keep] = 0
    return Image.fromarray(a, 'RGBA')


def despeckle(a):
    """Replace an opaque pixel unlike all four neighbours with the colour most of them share (3 or 4 of them)."""
    out = a.copy()
    h, w = a.shape[:2]
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if a[y, x, 3] == 0:
                continue
            n = [tuple(a[y - 1, x]), tuple(a[y + 1, x]), tuple(a[y, x - 1]), tuple(a[y, x + 1])]
            me = tuple(a[y, x])
            if me in n:
                continue
            best = max(set(n), key=n.count)
            if n.count(best) >= 3 and best[3] > 0:
                out[y, x] = best
    return out


def snap(im, pal_img):
    """Map an RGBA image onto a palette (no dithering), keep its hard alpha, then despeckle."""
    a = np.array(im)
    q = np.array(im.convert('RGB').quantize(palette=pal_img, dither=Image.Dither.NONE).convert('RGB'))
    out = np.dstack([q, a[..., 3]]).astype(np.uint8)
    out[a[..., 3] == 0] = 0
    return Image.fromarray(despeckle(out), 'RGBA')


def palette_image(colours):
    p = Image.new('P', (1, 1))
    flat = [c for rgb in colours for c in rgb]
    p.putpalette(flat + flat[-3:] * (256 - len(colours)))
    return p


def shrink(im, factor):
    """Majority downsample by factor (< 1): each target pixel takes the commonest opaque colour of its block."""
    a = np.array(im)
    h, w = a.shape[:2]
    th, tw = max(1, round(h * factor)), max(1, round(w * factor))
    out = np.zeros((th, tw, 4), np.uint8)
    for ty in range(th):
        for tx in range(tw):
            blk = a[int(ty / factor):max(int(ty / factor) + 1, int((ty + 1) / factor)), int(tx / factor):max(int(tx / factor) + 1, int((tx + 1) / factor))].reshape(-1, 4)
            op = blk[blk[:, 3] > 0]
            if len(op) * 2 < len(blk):
                continue
            vals, counts = np.unique(op, axis=0, return_counts=True)
            out[ty, tx] = vals[counts.argmax()]
    return Image.fromarray(out, 'RGBA')


# The size each effect is drawn at (the page draws these at scale 1 after the shrink).
FX_SCALE = {'sword_projectile': .3, 'star_projectile': .2, 'diamond_shard': .16, 'heal_heart': .17, 'twinkle': .3, 'warning_reticle': .32,
            'ring_pulse': .35, 'hammer': .5, 'impact_star': .35}


def cells(sheet, n=8):
    step = sheet.width / n
    return [[sheet.crop((round(c * step), round(r * step), round((c + 1) * step), round((r + 1) * step))) for c in range(n)] for r in range(n)]


def union_crop(frames, anchor):
    """Crop frames to their union bbox; anchor 'bottom' (bottom centre) or 'center'."""
    boxes = [f.getchannel('A').getbbox() for f in frames]
    boxes = [b for b in boxes if b]
    if not boxes:
        return [], (0, 0)
    x0, y0 = min(b[0] for b in boxes), min(b[1] for b in boxes)
    x1, y1 = max(b[2] for b in boxes), max(b[3] for b in boxes)
    out = [f.crop((x0, y0, x1, y1)) for f in frames]
    w, h = x1 - x0, y1 - y0
    return out, ((w // 2, h) if anchor == 'bottom' else (w // 2, h // 2))


def save_indexed(im, path):
    """Save as a 255-colour indexed PNG (index 255 transparent): the art has hard alpha, so nothing is lost but a
    little colour precision, and the atlas is a quarter of the size."""
    a = np.array(im)
    mask = a[..., 3] > 0
    q = im.convert('RGB').quantize(colors=255, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    p = np.where(mask, np.array(q), 255).astype(np.uint8)
    out = Image.fromarray(p, 'P')
    pal = q.getpalette()[:765]
    out.putpalette(pal + [0] * (768 - len(pal)))  # pad to 256 entries so index 255 exists
    # An explicit transparency table (only index 255 transparent): optimize/auto-detection can drop it.
    out.save(path, transparency=bytes([255] * 255 + [0]))


def pack(named, width):
    x = y = row = 0
    place = {}
    for name, (im, _) in named.items():
        if x + im.width > width:
            x, y, row = 0, y + row + 1, 0
        place[name] = [x, y, im.width, im.height]
        x += im.width + 1
        row = max(row, im.height)
    sheet = Image.new('RGBA', (width, y + row + 1), (0, 0, 0, 0))
    for name, (im, anc) in named.items():
        sheet.paste(im, tuple(place[name][:2]))
        place[name] += list(anc)
    return sheet, place


def main():
    sheets, seth, side, out = sys.argv[1:5]
    side_pal = Image.open(os.path.join(side, 'source', 'palette.png')).convert('RGB')
    colours = sorted(set(map(tuple, np.array(side_pal).reshape(-1, 3).tolist())))[:256]
    colours = [tuple(c) for c in colours]
    kpal = palette_image(colours)
    named = {}
    for fname, names in BODY.items():
        grid = cells(clean(Image.open(os.path.join(sheets, fname))))
        for r, name in enumerate(names):
            frames, anc = union_crop(grid[r], 'bottom')
            for i, f in enumerate(frames):
                named[f'{name}_{i}'] = (snap(f, kpal), anc)
    grid = cells(clean(Image.open(os.path.join(sheets, 'fx.png'))))
    for r, pair in enumerate(FX):
        for half, name in enumerate(pair):
            frames, anc = union_crop(grid[r][half * 4:half * 4 + 4], 'center')
            k = FX_SCALE.get(name, 1)
            for i, f in enumerate(frames):
                f = snap(f, kpal)
                if k < 1:
                    f = shrink(f, k)
                    named[f'{name}_{i}'] = (f, (f.width // 2, f.height // 2, k))
                else:
                    named[f'{name}_{i}'] = (f, anc)
    atlas, place = pack(named, 2000)
    save_indexed(atlas, os.path.join(out, 'knight-anim.png'))
    json.dump(place, open(os.path.join(out, 'knight-anim.json'), 'w'), separators=(',', ':'))

    # The side set, as supplied: one crop for every frame of every animation, anchored at the pack's origin.
    anims = json.load(open(os.path.join(side, 'animations.json')))['animations']
    sframes = {}
    for name, anim in anims.items():
        for i, fr in enumerate(anim['frames']):
            sframes[f'{name}_{i}'] = Image.open(os.path.join(side, fr['file'])).convert('RGBA')
    boxes = [f.getchannel('A').getbbox() for f in sframes.values()]
    x0, y0 = min(b[0] for b in boxes), min(b[1] for b in boxes)
    x1, y1 = max(b[2] for b in boxes), max(b[3] for b in boxes)
    ox, oy = anims['idle']['origin']
    sided = {k: (f.crop((x0, y0, x1, y1)), (ox - x0, oy - y0)) for k, f in sframes.items()}
    satlas_k, splace_k = pack(sided, 1600)
    save_indexed(satlas_k, os.path.join(out, 'knight-side.png'))
    json.dump(splace_k, open(os.path.join(out, 'knight-side.json'), 'w'), separators=(',', ':'))

    snamed = {}
    root = os.path.join(seth, 'sprites')
    # One flat palette for all of Seth: quantize every body frame together.
    allf = [Image.open(os.path.join(root, 'body', n, f'{n}_{i:02d}.png')).convert('RGBA') for n in SETH_BODY for i in range(8)]
    big = Image.new('RGB', (128 * len(allf), 128), (0, 0, 0))
    for i, f in enumerate(allf):
        big.paste(f.convert('RGB'), (i * 128, 0), f)
    spal = big.quantize(colors=24, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    for name in SETH_BODY:
        frames = [Image.open(os.path.join(root, 'body', name, f'{name}_{i:02d}.png')).convert('RGBA') for i in range(8)]
        # The pack's body anchor is (64, 100): keep it, relative to the crop.
        boxes = [f.getchannel('A').getbbox() for f in frames]
        x0, y0 = min(b[0] for b in boxes), min(b[1] for b in boxes)
        x1, y1 = max(b[2] for b in boxes), max(b[3] for b in boxes)
        for i, f in enumerate(frames):
            snamed[f'{name}_{i}'] = (snap(f.crop((x0, y0, x1, y1)), spal), (64 - x0, 100 - y0))
    for name in SETH_FX:
        files = sorted(os.listdir(os.path.join(root, 'effects', name)))
        frames = [Image.open(os.path.join(root, 'effects', name, f)).convert('RGBA') for f in files]
        crops, anc = union_crop(frames, 'center')
        for i, f in enumerate(crops):
            snamed[f'{name}_{i}'] = (f, anc)
    for face in SETH_FACES:
        f = Image.open(os.path.join(root, 'portraits', f'portrait_{face}', f'portrait_{face}_00.png')).convert('RGBA')
        b = f.getchannel('A').getbbox()
        snamed['face_' + face] = (snap(f.crop(b), spal), (0, 0))
    satlas, splace = pack(snamed, 1024)
    save_indexed(satlas, os.path.join(out, 'seth2.png'))
    json.dump(splace, open(os.path.join(out, 'seth2.json'), 'w'), separators=(',', ':'))
    print('knight', atlas.size, len(place), 'side', satlas_k.size, len(splace_k), 'seth', satlas.size, len(splace))


if __name__ == '__main__':
    main()
