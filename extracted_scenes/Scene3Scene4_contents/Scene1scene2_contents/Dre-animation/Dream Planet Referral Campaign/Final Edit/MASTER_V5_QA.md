# Dream Planet Master v5 QA

**QA date:** 2026-08-08  
**Status:** ✅ TECHNICALLY VALIDATED — revised Scene 5 master candidate

## Build

- **Pipeline:** `build_master_v5.sh`
- **Build source:** approved canonical Scene 5 render plus approved Scene 6 v3
- **Build output:** `DreamPlanet_Master_v5.mp4`
- **Build completed without media errors:** ✅
- **Pipeline correction:** removed a redundant self-copy of boundary stills that
  caused the existing script to stop after successful media validation. No
  source, timing, or encoding behavior was changed.

## Inputs and preservation

- Scenes 1–4 were rebuilt by the existing deterministic `build_master_v2.sh`
  pipeline without creative changes.
- Scene 5 source used:
  `Scene 5/Final Animation/scene5_final.mp4`
- Scene 5 source properties: 13.800s, 1080×1920, H.264, yuv420p, 25fps.
- Scene 6 source used:
  `Scene 6/Final Animation/scene6_final_v3_no_audio.mp4`
- Scene 6 remains the approved Notifications → CTA candidate; no older Scene 6
  render was substituted.
- Master v2 remains untouched. Its protected hashes were checked after build:
  - `DreamPlanet_Master_v2.mp4` / `_audio.mp4`: identical approved hash
  - `DreamPlanet_Master_v2_no_audio.mp4`: identical approved hash
- The approved Scene 5 and Scene 6 source hashes were also unchanged.

## Final media checks

| Check | Result |
|---|---|
| Final video | ✅ `DreamPlanet_Master_v5.mp4` |
| Audio companion | ✅ `DreamPlanet_Master_v5_audio.mp4` |
| No-audio companion | ✅ `DreamPlanet_Master_v5_no_audio.mp4` |
| Resolution | ✅ 1080 × 1920 |
| Frame rate | ✅ 30fps |
| Video codec | ✅ H.264 |
| Pixel format | ✅ yuvj420p output from established pipeline |
| Video duration | ✅ 56.766667s |
| Audio duration | ✅ 56.766009s |
| Audio/video delta | ✅ 0.000658s |
| Audio stream | ✅ AAC, 44.1kHz, stereo |
| No-audio stream | ✅ no audio stream |
| Video frame count | ✅ 1703 frames |
| Full decode | ✅ no ffmpeg decode errors |
| Black-frame scan | ✅ no unintended black intervals detected |
| Duplicate-like frame scan | ✅ 0 frames flagged |

The audio track is applied once at master level and fades during the final
second. Scene 6 contributes no embedded audio.

## Scene timeline

| Segment | Start | End | Duration |
|---|---:|---:|---:|
| Scene 1 | 0.000s | 3.000s | 3.000s |
| Scene 2 | 3.000s | 6.000s | 3.000s |
| Scene 3 | 6.000s | 19.433s | 13.433s |
| Scene 4 | 19.433s | 28.433s | 9.000s |
| Scene 5 revised | 28.433s | 41.300s | 12.867s |
| Scene 6 / Notifications + CTA | 41.300s | 56.767s | 15.467s normalized |
| **Total** | **0.000s** | **56.767s** | **56.767s** |

The deterministic build reported 1703 frames, matching the rebuilt
Scenes 1–5 base plus normalized Scene 6.

## Boundary and playback QA

### Scene 4 → revised Scene 5

✅ Samples at 28.433s and 28.500s contain live Scene 5 content.  
✅ No black frame, white dead frame, duplicated scene, or unintended pause.  
✅ The revised Scene 5 forum/portfolio sequence begins as the expected
continuation of the preceding interaction.

### Scene 5 → Scene 6

✅ Samples at 41.300s and 41.400s contain live Scene 6 Home Feed content.  
✅ No old Scene 6 asset or Community Forum summary appears at the handoff.  
✅ The approved Scene 6 sequence remains intact after the revised Scene 5.

### Forum → Notifications → final CTA

✅ The standalone-approved Notifications screen is visible at the sampled
48.2s point: light interface, `Notification` header, orange icons, connected
activity copy, dividers, and `New` badge.  
✅ Notifications follows enough Scene 6 community activity to read naturally.  
✅ The CTA begins at the expected point and holds with readable headline,
referral code `IK54OTRD`, URL, mobile cue, and Join Dream Planet button.  
✅ The CTA is a continuation of the Notifications sequence, not an unrelated
cut caused by timeline exhaustion.  
✅ The final black frame is the intentional end fade.

### Full-campaign visual sampling

Representative stills are stored in `qa_v5/`:

- `scene1_start.png`
- `scene1_2_boundary.png`
- `scene2_3_boundary.png`
- `scene3_4_boundary.png`
- `scene4_5_boundary.png`
- `scene5_middle.png`
- `scene5_6_boundary.png`
- `notifications.png`
- `cta_begin.png`
- `cta_hold.png`
- `final_fade.png`
- `campaign_end.png`
- `contact_sheet.png`

The contact sheet and sampled stills were reviewed across the full campaign
from Scene 1 through the final fade.

## Validation commands

Passed:

- `bash build_master_v5.sh`
- `bash validate_master_v3.sh` — 11 passed, 0 failed
- `ffprobe` stream, duration, frame-count, and audio checks
- Full-file ffmpeg decode
- `blackdetect` scan
- `mpdecimate` duplicate-like frame scan
- Boundary still extraction and visual review

## Final handoff

- **Master:** `Final Edit/DreamPlanet_Master_v5.mp4`
- **Audio variant:** `Final Edit/DreamPlanet_Master_v5_audio.mp4`
- **No-audio variant:** `Final Edit/DreamPlanet_Master_v5_no_audio.mp4`
- **QA report:** `Final Edit/MASTER_V5_QA.md`
- **QA stills:** `Final Edit/qa_v5/`
- **Resolution:** 1080×1920
- **FPS:** 30
- **Duration:** 56.766667s
- **Audio:** AAC stereo, 56.766009s

Scenes 1–4 were not creatively modified. The approved revised Scene 5 was
used as the only replacement in the deterministic rebuild. The approved Scene
6 v3 candidate was preserved and used unchanged as the final sequence.
Master v2 remains untouched.