# Scene 2 — The Reveal

**Status:** Built, pending your approval (not yet locked).

## What it does
Continues directly from Scene 1's locked master frame — same still image, same crop
center, same push-in mechanism — so the cut is invisible. The push-in continues from
106.5% (where Scene 1 ended) to 110%. A small, soft highlight drifts across the tattoo
around 4.8s. The caption "Join me on / **Dream Planet**" fades in lower-left, and the
official Dream Planet icon mark fades in beside it at 5.2s as the visual bridge into
Scene 3, then stays on screen through the cut.

## Contents
- `Final Animation/scene2_final.mp4` — 1080×1302 @30fps, 3.0s, with the correct 3.0–6.0s
  segment of the real "Dream Planet" song muxed in.
- `Project Files/` — `build_scene2.py` (text-layout + light-streak generation),
  `filter_graph.txt` (ffmpeg filter graph for the animation), `assets/` (`dp_icon.png`
  cropped from the official logo, `scene2_light_streak.png`), `layout.txt` (computed
  text/icon coordinates), `scene2_prerender_no_audio.mp4`, `scene2_song_segment.m4a`,
  and `source/` (archived copies of the Scene 2 brief, master prompt, and official logo).

## Key specs (for reproducing or adjusting)
- Source still: `Scene 1 (LOCKED)/Final Master Frame/scene1_master_frame.png` — reused
  as-is, no re-grading.
- Zoom: linear 1.065 → 1.10 over the full 3.0s (continuous with Scene 1's end zoom).
- Caption font: Inter SemiBold, 40px headline / 82px "Dream Planet", white with
  "Planet" in the brand orange `#F64A01` (sampled from the official logo/tattoo, not
  "Dream" — matches how both existing brand assets color the wordmark).
- Caption timing: fade in 3.6–4.4s (global), hold, fade out 5.5–5.8s.
- Icon fade-in: 5.2–5.7s, holds (does not fade out) — sets up Scene 3.
- Light pass: narrow, low-opacity diagonal drift, enabled ~4.5–5.3s only.

## Next
Scene 3 brief/materials not yet received — the "logo dissolves into the app interface"
transition described in the Scene 2 brief belongs to Scene 3's build.
