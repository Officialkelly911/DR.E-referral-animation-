from PIL import Image, ImageDraw, ImageOps, ImageFont

src = "attached_assets/B45BBD88-5A0C-4CF0-BCFD-B6D4820D490D_1785748314436.png"
img = Image.open(src)
img = ImageOps.exif_transpose(img).convert("RGB")
w, h = img.size

# mark estimated tattoo center (46% x, 42% y) with a bright circle
marked = img.copy()
d = ImageDraw.Draw(marked)
cx, cy = int(w * 0.46), int(h * 0.42)
r = 12
d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 255, 255))

# rotate 10 deg clockwise (negative angle = clockwise in PIL), expand canvas
rotated = marked.rotate(-10, expand=True, resample=Image.BICUBIC, fillcolor=(18, 14, 12))
rw, rh = rotated.size
print("rotated size", rw, rh)

# grid overlay on rotated image
draw = ImageDraw.Draw(rotated)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except OSError:
    font = ImageFont.load_default()
for i in range(1, 10):
    x = int(rw * i / 10)
    draw.line([(x, 0), (x, rh)], fill=(0, 255, 0), width=2)
    draw.text((x + 4, 4), f"{i*10}%", font=font, fill=(0, 255, 0), stroke_width=2, stroke_fill=(0, 0, 0))
for i in range(1, 10):
    y = int(rh * i / 10)
    draw.line([(0, y), (rw, y)], fill=(255, 0, 255), width=2)
    draw.text((4, y + 4), f"{i*10}%", font=font, fill=(255, 0, 255), stroke_width=2, stroke_fill=(0, 0, 0))

rotated.save("scripts/debug_rotated_grid.jpg", quality=90)
print("saved")
