# Scene 1 — The Hook (LOCKED)

**Status: Approved / Locked.** Do not modify `Final Master Frame/` or `Final Animation/`. If a change is truly needed, get explicit sign-off first — Scenes 2-4 are being built to match this look.

**Audio:** with explicit sign-off, the placeholder ambient track was swapped for the real "Dream Planet" song's 0:00–0:03 slice (video re-muxed with `-c:v copy`, picture/animation untouched). Scene 2 uses the matching 0:03–0:06 slice, so the music now runs continuously across the cut.

## Contents
- `Final Master Frame/` — graded hero still (`scene1_master_frame.png` / `.jpg`), 1200×1446. Source frame for the animation.
- `Final Animation/scene1_final.mp4` — finished clip, 1080×1302 @30fps, 3.0s, placeholder ambient audio muxed in.
- `Project Files/` — everything needed to reproduce or reference the build:
  - `source/` — the exact production doc, master prompt, and source photos this scene was built from.
  - `prep_hero.py` — still-image prep (DOF blur/vignette/grade/rotate/crop).
  - `grid_debug.py`, `rotate_debug.py`, `debug_grid.jpg`, `debug_rotated_grid.jpg` — focal-point/rotation measurement tools and their output, kept for reference.
  - `make_light_streak.py`, `light_streak.png` — light-sweep overlay asset generator + output.
  - `filter_graph.txt` — ffmpeg filter graph used to animate the final clip.
  - `scene1_prerender_no_audio.mp4` — video-only render (before audio mux); re-mux from here if only the audio needs to change.
  - `fonts/Inter-SemiBold.ttf` — caption typeface, reused across the campaign.

## Key specs (match these in later scenes)
- Tattoo focal point used for the DOF/vignette mask: ~45%, 43% of the source frame.
- Rotation: 10° clockwise.
- Crop after rotation: 14-86% of width, 10-90% of height of the rotated canvas.
- Output: 1080×1302, 30fps, exactly 3.0s / 90 frames.
- Timeline: black 0-0.2s → fade in 0.2-0.5s → push-in starts 0.5s (100%→106.5% by 3.0s) → light sweep 0.8-2.3s → caption in 1.2-1.6s, hold, out 2.8-3.0s → hard cut at 3.0s.
