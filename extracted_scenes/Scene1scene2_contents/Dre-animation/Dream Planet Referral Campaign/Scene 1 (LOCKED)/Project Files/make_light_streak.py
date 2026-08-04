import numpy as np
from PIL import Image

OUT_W, OUT_H = 1080, 1302

ys, xs = np.mgrid[0:OUT_H, 0:OUT_W].astype(np.float32)

# Diagonal band: define a line direction (angle from vertical) through the canvas.
# Perpendicular distance from each pixel to a diagonal line passing through center.
angle_deg = 22.0  # tilt of the light band
theta = np.radians(angle_deg)
# line direction vector (dx, dy) normalized; normal vector for perpendicular distance
dirx, diry = np.sin(theta), np.cos(theta)
normx, normy = np.cos(theta), -np.sin(theta)

cx, cy = OUT_W / 2.0, OUT_H / 2.0
rel_x = xs - cx
rel_y = ys - cy
perp_dist = rel_x * normx + rel_y * normy  # signed distance from the diagonal centerline

band_half_width = OUT_W * 0.16  # softness/width of the light band
falloff = np.exp(-0.5 * (perp_dist / band_half_width) ** 2)  # gaussian cross-section

peak_alpha = 150.0  # subtle, not overpowering
alpha = (falloff * peak_alpha).clip(0, 255).astype(np.uint8)

# warm-white light color
color = np.zeros((OUT_H, OUT_W, 4), dtype=np.uint8)
color[..., 0] = 255
color[..., 1] = 248
color[..., 2] = 232
color[..., 3] = alpha

img = Image.fromarray(color, mode="RGBA")
img.save("output/light_streak.png")
print("saved light streak", img.size)
