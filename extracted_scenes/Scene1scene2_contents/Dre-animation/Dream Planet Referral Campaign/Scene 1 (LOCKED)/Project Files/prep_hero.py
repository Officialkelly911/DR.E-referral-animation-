import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

SRC = "attached_assets/B45BBD88-5A0C-4CF0-BCFD-B6D4820D490D_1785748314436.png"
OUT_DIR = "output"
import os
os.makedirs(OUT_DIR, exist_ok=True)

# ---------- helpers ----------

def radial_mask(w, h, cx, cy, r_in, r_out):
    """1.0 inside r_in, 0.0 outside r_out, smooth falloff between (normalized by w/2,h/2 ellipse)."""
    ys, xs = np.mgrid[0:h, 0:w]
    nx = (xs - cx) / (w / 2.0)
    ny = (ys - cy) / (h / 2.0)
    d = np.sqrt(nx ** 2 + ny ** 2)
    m = (r_out - d) / (r_out - r_in)
    m = np.clip(m, 0.0, 1.0)
    # smoothstep for a nicer falloff
    m = m * m * (3 - 2 * m)
    return m.astype(np.float32)

def to_arr(img):
    return np.asarray(img).astype(np.float32)

def to_img(arr):
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

# ---------- load ----------
img = Image.open(SRC)
img = ImageOps.exif_transpose(img).convert("RGB")
w, h = img.size
print("source size", w, h)

# tattoo focal point (validated visually with grid overlay)
cx, cy = w * 0.45, h * 0.43

arr = to_arr(img)

# ---------- 1. depth-of-field: blur background, keep subject sharp ----------
blurred_img = img.filter(ImageFilter.GaussianBlur(radius=22))
blurred_arr = to_arr(blurred_img)

focus_mask = radial_mask(w, h, cx, cy, r_in=0.42, r_out=0.88)[..., None]
arr = arr * focus_mask + blurred_arr * (1 - focus_mask)

# ---------- 2. extra sharpening on the subject only ----------
sharp_img = to_img(arr).filter(ImageFilter.UnsharpMask(radius=3, percent=130, threshold=2))
sharp_arr = to_arr(sharp_img)
sharpen_mask = radial_mask(w, h, cx, cy, r_in=0.30, r_out=0.60)[..., None]
arr = arr * (1 - sharpen_mask) + sharp_arr * sharpen_mask

# ---------- 3. background darken + warm tint + vignette (single edge mask) ----------
warm_dark = np.array([26, 18, 13], dtype=np.float32)  # dark warm neutral
edge_mask = 1.0 - radial_mask(w, h, cx, cy, r_in=0.38, r_out=1.05)  # 0 center -> 1 far edges
edge_mask = edge_mask[..., None]
strength = 0.62
arr = arr * (1 - edge_mask * strength) + warm_dark * (edge_mask * strength)

# ---------- 4. global warm cinematic color grade ----------
# warm channel shift: lift red/orange, pull down blue slightly
r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
r = r * 1.045
g = g * 1.008
b = b * 0.94
arr = np.stack([r, g, b], axis=-1)
arr = np.clip(arr, 0, 255)

graded = to_img(arr)
graded = ImageEnhance.Contrast(graded).enhance(1.12)
graded = ImageEnhance.Color(graded).enhance(0.91)  # reduce saturation ~9%
graded = ImageEnhance.Brightness(graded).enhance(1.02)

# gentle highlight roll-off + shadow depth via soft gamma curve
arr = to_arr(graded) / 255.0
arr = np.power(arr, 1.04)  # slightly deepen shadows/midtones
# soft highlight compression above 0.8
hi = arr > 0.8
arr[hi] = 0.8 + (arr[hi] - 0.8) * 0.85
arr = arr * 255.0
graded = to_img(arr)

graded.save(f"{OUT_DIR}/debug_graded_prerotate.jpg", quality=92)

# ---------- 5. rotate 10deg clockwise, expand, crop clean rectangle ----------
fill = (int(warm_dark[0]), int(warm_dark[1]), int(warm_dark[2]))
rotated = graded.rotate(-10, expand=True, resample=Image.BICUBIC, fillcolor=fill)
rw, rh = rotated.size
print("rotated size", rw, rh)

x0, x1 = int(rw * 0.14), int(rw * 0.86)
y0, y1 = int(rh * 0.10), int(rh * 0.90)
cropped = rotated.crop((x0, y0, x1, y1))
print("cropped size", cropped.size)

# ---------- 6. final upscale for resolution headroom ----------
target_w = 1200
scale = target_w / cropped.width
target_h = round(cropped.height * scale)
final = cropped.resize((target_w, target_h), Image.LANCZOS)
final = final.filter(ImageFilter.UnsharpMask(radius=1.5, percent=60, threshold=2))

final.save(f"{OUT_DIR}/scene1_hero_frame.png")
final.convert("RGB").save(f"{OUT_DIR}/scene1_hero_frame.jpg", quality=95, optimize=True)
print("final size", final.size)
print("done")
