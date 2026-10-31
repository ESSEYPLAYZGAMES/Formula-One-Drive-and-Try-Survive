"""The car model's textures (tools/car_model.mjs makes the geometry): the source glTF's, resized and saved as WebP for
src/vehicle/CarModel.js. The livery, decals and number textures are not used (the game paints its own); the wheel
rims' blue rings go dark grey; the tyre sidewall's red lettering becomes the alpha channel (CarModel tints it in the
compound's colour).

    python3 tools/car_textures.py <source textures dir> [out dir = assets/car/tex]
"""
import os, sys
from PIL import Image

SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'car', 'tex')
os.makedirs(OUT, exist_ok=True)

# name -> (source file, size, quality)
TEX = {
    'carbon3': ('redbull_carbon3.007_baseColor.png', 512, 82),
    'carbon3_n': ('redbull_carbon3.007_normal.png', 512, 90),
    'carbon1': ('redbull_carbon1.007_baseColor.png', 128, 85),
    'carbon2': ('redbull_carbon2.007_baseColor.png', 128, 85),
    'detail': ('redbull_detail.007_baseColor.png', 1024, 80),
    'generic': ('generics2.007_baseColor.png', 1024, 78),
    'light': ('rear_light_2.007_baseColor.png', 256, 85),
    'glass': ('glass.005_baseColor.png', 128, 85),
    'disc': ('discs.007_baseColor.png', 64, 90),
    'rim': ('redbull_wheel_hub.007_baseColor.png', 1024, 80),
    'tyre': ('sidewall.007_baseColor.png', 1024, 82),
    'tyre_n': ('sidewall.007_normal.png', 1024, 85),
    'swheel': ('redbull_steeringwheel.004_baseColor.png', 256, 85),
    'swdecal': ('sw_decals.004_baseColor.png', 512, 85),
}


def rim(im):
    """the rim's blue rings dark grey (the source's team colour)"""
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b = px[x, y][:3]
            if b > r + 18 and b > g + 12:
                l = int(0.3 * r + 0.59 * g + 0.11 * b * 0.6)
                px[x, y] = (l, l, l) + tuple(px[x, y][3:])
    return im


def tyre(im):
    """the red lettering: white, and its strength in the alpha channel"""
    im = im.convert('RGBA'); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, _ = px[x, y]
            red = max(0, min(255, int((r - max(g, b) - 40) * 2.2)))
            if red > 0:
                k = red / 255
                px[x, y] = (int(r + (235 - r) * k), int(g + (235 - g) * k), int(b + (235 - b) * k), red)
            else:
                px[x, y] = (r, g, b, 0)
    return im


def swdecal(im):
    """the steering wheel's labels without the source team's logos and chassis number (512 px boxes, cleared)"""
    im = im.convert('RGBA'); px = im.load(); k = im.width / 512
    for (x0, y0, x1, y1) in [(440, 330, 512, 452), (110, 452, 410, 512), (444, 70, 489, 250)]:
        for y in range(int(y0 * k), min(im.height, int(y1 * k))):
            for x in range(int(x0 * k), min(im.width, int(x1 * k))):
                px[x, y] = (0, 0, 0, 0)
    return im


total = 0
for name, (fn, size, q) in TEX.items():
    im = Image.open(os.path.join(SRC, fn))
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') and name in ('swdecal',) else 'RGB')
    if max(im.size) > size:
        im = im.resize((size, max(1, round(im.height * size / im.width))), Image.LANCZOS)
    if name == 'rim':
        im = rim(im)
    if name == 'tyre':
        im = tyre(im)
    if name == 'swdecal':
        im = swdecal(im)
    out = os.path.join(OUT, name + '.webp')
    im.save(out, 'WEBP', quality=q, method=6, exact=name == 'tyre')
    total += os.path.getsize(out)
    print(f'{name:10s} {im.size[0]}x{im.size[1]} {im.mode} {os.path.getsize(out) / 1024:.0f} KB')
print(f'total {total / 1024:.0f} KB')
