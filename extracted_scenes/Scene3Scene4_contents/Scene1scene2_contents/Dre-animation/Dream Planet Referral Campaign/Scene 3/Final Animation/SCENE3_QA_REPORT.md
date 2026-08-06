# Scene 3 QA Report — v3 (Readability Pass)

**Date:** 2026-08-06  
**Revision:** v3 — timing-only readability pass  
**Previous revision:** v2 (11.84s)

---

## Output files

| File | Size | Duration | Resolution | Codec | Pixel fmt |
|------|------|----------|------------|-------|-----------|
| `scene3_final.mp4` | 6.6 MB | 14.16s | 1080×1920 | h264 | yuv420p |
| `scene3_final_no_audio.mp4` | 6.6 MB | 14.16s | 1080×1920 | h264 | yuv420p |
| `scene3_start_frame.png` | — | — | 1080×1920 | — | — |
| `scene3_end_frame.png` | — | — | 1080×1920 | — | — |

> Note: ffprobe reports 14.16s vs the 14.14s timeline target. The 0.02s difference is normal encoder frame-boundary rounding at 25fps (one frame = 0.04s). All 14.14s of animation content is present — the trim is set to exactly `S3_DURATION_MS / 1000 = 14.14` with no content cut.

---

## Timing changes (v2 → v3)

| Phase | v2 duration | v3 duration | Δ | Rationale |
|-------|------------|------------|---|-----------|
| Home camera push-in (Phase 3) | 2.0s | 2.5s | +0.5s | More time to read referral code card |
| Levels stagger settle (Phase 6 pause) | 0.5s | 0.7s | +0.2s | Content settles before camera moves |
| Levels camera push-in (Phase 6b) | 1.6s | 2.0s | +0.4s | More time on View Levels page |
| Leaderboard stagger settle (Phase 8 pause) | 0.5s | 0.7s | +0.2s | Podium settles before camera moves |
| Leaderboard end hold (Phase 8b end) | 1.0s | 2.0s | +1.0s | Generous final read time on Leaderboard |
| **TOTAL** | **11.84s** | **14.14s** | **+2.30s (+19.4%)** | |

---

## Scene 2 → Scene 3 transition

✅ Intact — Phase 1 white overlay dissolves unchanged (0.0–0.5s, `easeOut`).

## Scene 3 → Scene 4 handoff

✅ Intact — Leaderboard final frame is held for 2.0s before loop/handoff. No exit overlay or transition logic modified.

---

## Capture pipeline fix (v3 also fixes prior trim bugs)

Both capture scripts were corrected to trim at exactly `S3_DURATION_MS / 1000 = 14.14s`:

- **`capture-scene3-only.mjs`** (canonical Scene-3-only script): was trimming to `14.14 - 0.2 = 13.94s`, cutting 0.2s of the end hold. Fixed to `14.14s`.
- **`capture-scene3.mjs`** (legacy full-pipeline script): was trimming to `RECORD_MS / 1000 - 0.5 = 14.44s`, potentially including 0.3s of Scene 4 after the loop. Fixed to explicit `14.14s`.

---

## What was NOT changed

- UI design, layouts, colors, typography, assets
- Page transition animations (iOS-style horizontal push, 0.45s)
- Camera push-in easing curves
- Tap ripple timing or positions
- Scene 4, 5, or master concat pipeline

---

## Pass/fail checklist

- [x] 1080×1920 resolution
- [x] h264 / yuv420p
- [x] Duration ≥ 14.14s (reported: 14.16s — full content present)
- [x] Clean start frame (white entry overlay visible — correct)
- [x] Clean end frame (Leaderboard in settled hold — correct)
- [x] No Scene 4, 5 or master files modified
- [x] `scene3_final_no_audio.mp4` present (identical copy for concat pipeline)
- [x] Start and end frames generated
- [x] Capture trim set to exact scene duration (no content removed, no Scene 4 bleed)
