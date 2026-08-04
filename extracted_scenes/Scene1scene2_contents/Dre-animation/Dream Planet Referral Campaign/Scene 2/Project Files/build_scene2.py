"""
Scene 2 - The Reveal - build pipeline.

Continues directly from Scene 1's locked master frame (same still image),
extends the push-in from 106.5% -> 110%, adds a subtle light pass, the
"Join me on / Dream Planet" caption, and a soft fade-in of the official
Dream Planet icon mark as the visual bridge into Scene 3.
"""
import numpy as np
from PIL import Image, ImageFont

FONT_PATH = "../../Scene 1 (LOCKED)/Project Files/fonts/Inter-SemiBold.ttf"
OUT_W, OUT_H = 1080, 1302
ORANGE = (246, 74, 1)

# ---------------------------------------------------------------------------
# 1. Subtle light streak (smaller / softer than Scene 1's broad sweep -- this
#    is a "small natural reflection", not a full diagonal light band).
# ---------------------------------------------------------------------------
ys, xs = np.mgrid[0:OUT_H, 0:OUT_W].astype(np.float32)
angle_deg = 18.0
theta = np.radians(angle_deg)
normx, normy = np.cos(theta), -np.sin(theta)
cx, cy = OUT_W * 0.55, OUT_H * 0.4  # centered nearer the tattoo focal point
rel_x, rel_y = xs - cx, ys - cy
perp_dist = rel_x * normx + rel_y * normy

band_half_width = OUT_W * 0.075  # narrower than Scene 1 -> smaller reflection
falloff = np.exp(-0.5 * (perp_dist / band_half_width) ** 2)
peak_alpha = 78.0  # lower peak than Scene 1 (150) -> subtler
alpha = (falloff * peak_alpha).clip(0, 255).astype(np.uint8)

color = np.zeros((OUT_H, OUT_W, 4), dtype=np.uint8)
color[..., 0] = 255
color[..., 1] = 250
color[..., 2] = 238
color[..., 3] = alpha
Image.fromarray(color, mode="RGBA").save("assets/scene2_light_streak.png")
print("saved scene2_light_streak.png")

# ---------------------------------------------------------------------------
# 2. Text layout: measure with the real font so placement is exact.
# ---------------------------------------------------------------------------
HEADLINE_SIZE = 40
MAIN_SIZE = 82
MARGIN_X = 90

f_headline = ImageFont.truetype(FONT_PATH, HEADLINE_SIZE)
f_main = ImageFont.truetype(FONT_PATH, MAIN_SIZE)

def measure(font, text):
    box = font.getbbox(text)
    return box[2] - box[0], box[3] - box[1]

hl_w, hl_h = measure(f_headline, "Join me on")
dream_w, dream_h = measure(f_main, "Dream ")
planet_w, planet_h = measure(f_main, "Planet")
main_h = max(dream_h, planet_h)

BOTTOM_MARGIN = 150
main_y = OUT_H - BOTTOM_MARGIN - main_h
headline_gap = 18
headline_y = main_y - headline_gap - hl_h

icon_h = 96
icon_gap = 22
icon_x = MARGIN_X
icon_y = headline_y - icon_gap - icon_h

print(f"headline y={headline_y} h={hl_h}")
print(f"main y={main_y} h={main_h} dream_w={dream_w} planet_w={planet_w}")
print(f"icon x={icon_x} y={icon_y} (h={icon_h})")

with open("layout.txt", "w") as fh:
    fh.write(f"MARGIN_X={MARGIN_X}\n")
    fh.write(f"HEADLINE_SIZE={HEADLINE_SIZE}\n")
    fh.write(f"MAIN_SIZE={MAIN_SIZE}\n")
    fh.write(f"headline_y={headline_y}\n")
    fh.write(f"main_y={main_y}\n")
    fh.write(f"dream_w={dream_w}\n")
    fh.write(f"planet_x={MARGIN_X + dream_w}\n")
    fh.write(f"icon_x={icon_x}\n")
    fh.write(f"icon_y={icon_y}\n")
    fh.write(f"icon_h={icon_h}\n")
    fh.write(f"orange={ORANGE[0]}x{ORANGE[1]}x{ORANGE[2]}\n")
