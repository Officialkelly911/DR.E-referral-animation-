from PIL import Image, ImageDraw, ImageOps, ImageFont

src = "attached_assets/B45BBD88-5A0C-4CF0-BCFD-B6D4820D490D_1785748314436.png"
img = Image.open(src)
img = ImageOps.exif_transpose(img).convert("RGB")
w, h = img.size
print("size", w, h)

draw = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except OSError:
    font = ImageFont.load_default()

# vertical lines every 10%
for i in range(1, 10):
    x = int(w * i / 10)
    draw.line([(x, 0), (x, h)], fill=(0, 255, 0), width=2)
    draw.text((x + 4, 4), f"{i*10}%", font=font, fill=(0, 255, 0), stroke_width=2, stroke_fill=(0,0,0))

# horizontal lines every 10%
for i in range(1, 10):
    y = int(h * i / 10)
    draw.line([(0, y), (w, y)], fill=(255, 0, 255), width=2)
    draw.text((4, y + 4), f"{i*10}%", font=font, fill=(255, 0, 255), stroke_width=2, stroke_fill=(0,0,0))

img.save("scripts/debug_grid.jpg", quality=90)
print("saved")
