from PIL import Image
from pathlib import Path

src = Path(__file__).resolve().parents[1] / "public" / "images" / "logo-idc-brasilia.png"
img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

# Remove near-black background (logo is painted on solid black)
threshold = 35
changed = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r <= threshold and g <= threshold and b <= threshold:
            pixels[x, y] = (r, g, b, 0)
            changed += 1

bbox = img.getbbox()
if bbox:
    left, top, right, bottom = bbox
    pad = 4
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(w, right + pad)
    bottom = min(h, bottom + pad)
    img = img.crop((left, top, right, bottom))

img.save(src, format="PNG", optimize=True)
print(f"size={img.size} transparent_pixels={changed} saved={src}")
