# Master v2 — QA Baseline Snapshot

**Generated:** 2026-08-06  
**Git tag:** `master-v2-approved`  
**Purpose:** Reference for future regression detection. Any rebuild of Master v2 must match these values.

---

## Deliverables

| File | Size | SHA-256 |
|------|------|---------|
| `DreamPlanet_Master_v2.mp4` | 33 MB (33,916,550 bytes) | `52f5625181349682ff31699a0db1717ad5df63d53c6a5b48ad668c86a7fe14a1` |
| `DreamPlanet_Master_v2_audio.mp4` | 33 MB (33,916,550 bytes) | `52f5625181349682ff31699a0db1717ad5df63d53c6a5b48ad668c86a7fe14a1` |
| `DreamPlanet_Master_v2_no_audio.mp4` | 32 MB (32,869,670 bytes) | `a5874e8eb90b95a643cbceab202fabd26546a991af98ee8d6f049e66985c5e0b` |

> Note: `_v2.mp4` and `_v2_audio.mp4` are identical files (both are the audio master). This is by design — `build_master_v2.sh` copies `master_with_audio.mp4` to both output names.

---

## Video Spec

| Property | Value |
|----------|-------|
| Resolution | 1080 × 1920 |
| Aspect ratio | 9:16 |
| Frame rate | 30fps |
| Video codec | H.264 (yuv420p) |
| Total duration | 41.300s |
| Audio codec | AAC stereo, ~197 kbps |
| Audio duration | 41.300s |

---

## Scene Timeline

| Scene | Label | Start | End | Duration | Source |
|-------|-------|-------|-----|----------|--------|
| 1 | Tattoo Reveal | 0.000s | 3.000s | 3.000s | Procedurally generated |
| 2 | Creator Discovery | 3.000s | 6.000s | 3.000s | Procedurally generated |
| 3 | Referral Journey (v3) | 6.000s | 19.433s | 13.433s | `scene3_final.mp4` (trim: 0.7s) |
| 4 | Leaderboard | 19.433s | 28.433s | 9.000s | `scene4_final.mp4` |
| 5 | Community & Participation | 28.433s | 41.300s | 12.867s | `scene5_final.mp4` (trim: 0.9s) |

---

## Build

| Property | Value |
|----------|-------|
| Build script | `Final Edit/build_master_v2.sh` |
| Scene 3 trim | 0.7s (v3 standalone Playwright capture preamble) |
| Scene 5 trim | 0.9s (standalone Playwright capture preamble) |
| Audio | Applied once at master level (1s fadeout) |
| Music source | `Ai_music_for_dream_planet_video__1785842118219.mp3` |
| Approval date | 2026-08-06 |

---

## What Changed from Master v1

| Property | Master v1 | Master v2 |
|----------|-----------|-----------|
| Duration | 21.533s | 41.300s |
| Scenes | 4 | 5 |
| Scene 3 trim | 3.0s | 0.7s (v3 rebuild) |
| Scene 5 | — | Community & Participation (12.867s) |
| Build script | `build_master.sh` | `build_master_v2.sh` |

---

## Validation

Run at any time to confirm the approved deliverables are intact:

```sh
cd "extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit"
./validate_master.sh --verbose
```

Expected: all checks pass (9+).
