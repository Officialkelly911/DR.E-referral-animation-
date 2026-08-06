# Scene 5 Archive — v1 Approved

**Archived:** 2026-08-06  
**Status:** Approved and frozen. These are the final deliverables for Scene 5 v1.

---

## Contents

| File | Size | Description |
|------|------|-------------|
| `scene5_final.mp4` | ~9.7 MB | Scene 5 source — with original audio track (muted at master concat stage) |
| `scene5_final_no_audio.mp4` | ~9.7 MB | Scene 5 source — audio stripped variant |
| `scene5_start_frame.png` | ~98 KB | First meaningful frame (post-trim reference) |
| `scene5_end_frame.png` | ~1.4 MB | Last frame (Scene 5 → Scene 6 transition reference) |
| `scene5_start_frame_capture.png` | ~98 KB | Start frame from Playwright capture pipeline |
| `scene5_end_frame_capture.png` | ~1.4 MB | End frame from Playwright capture pipeline |

---

## Scene 5 Specs

| Property | Value |
|----------|-------|
| Title | Community & Participation |
| Source duration | ~13.8s |
| Duration in Master v2 | 12.867s (0.9s trim applied) |
| Trim start | 0.9s (Playwright preamble) |
| Resolution | 1080 × 1920 |
| Frame rate | 25fps source → 30fps in master |
| Audio | No audio in master input (score added at concat) |
| Codec | H.264, CRF 16 |
| Position in master | 28.433s – 41.300s |

---

## Animation Phases

| Phase | Time (source) | Description |
|-------|--------------|-------------|
| P1 | 0.00 – 1.20s | Scene 4 handoff — white dissolve → home → Side Nav opens |
| P2 | 1.20 – 2.50s | View Portfolio tap → Portfolio slides in |
| P3 | 2.50 – 5.20s | Portfolio reveal — profile/stats hold, media grid scroll |
| P4 | 5.20 – 6.50s | View Forum tap → Forum enters |
| P5 | 6.50 – 8.00s | Forum reveal + camera push-in |
| P6 | 8.00 – 12.60s | Multi-post discovery — like/comment interactions |
| P7 | 12.60 – 13.80s | Final push-in, hold on clean forum feed |

---

## Source Location

Original capture pipeline lives in:
```
extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/
  artifacts/dream-planet-scene3/src/components/scene5/
```

Canonical source path in master build:
```
extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/
  Dre-animation/Dream Planet Referral Campaign/
    Scene 5/Final Animation/scene5_final.mp4
```

---

> These files are read-only references. Do not overwrite them.
> Future Scene 5 revisions would be archived as `scene5_v2/`.
