# Dream Planet Master v5 QA

**QA date:** 2026-08-09  
**Status:** ✅ APPROVED — rebuilt release

## Inputs and preservation

- Scenes 1–4 were rebuilt from the existing deterministic `build_master_v2.sh`
  source inputs without changing their source assets or timing.
- Scene 5 uses the approved revised canonical render:
  `Scene 5/Final Animation/scene5_final.mp4`.
- The approved Scene 5 render is 13.800s, 1080×1920, H.264, yuv420p, and
  contains the revised four-post forum sequence with the Forum floating “+”
  removed.
- The previous v1, v2, v3, and v4 masters were preserved.
- The existing integrated Scene 6 Notifications/CTA render was appended; no
  isolated Scene 6 v4/v5 candidate was substituted.

## Final media checks

| Check | Result |
|---|---|
| Resolution | ✅ 1080 × 1920 |
| Frame rate | ✅ 30fps |
| Video codec | ✅ H.264 |
| No-audio variant | ✅ Present and contains no audio stream |
| Audio variant | ✅ Present with AAC campaign audio |
| Total duration | ✅ 56.766667s |
| Audio synchronization | ✅ Audio/video duration delta within 0.2s |
| Frame count | ✅ Master frame count equals rebuilt base plus normalized Scene 6 |
| Duplicate/missing frame guard | ✅ Frame-count continuity check passed |

## Timeline

| Segment | Start | End | Duration |
|---|---:|---:|---:|
| Scene 1 | 0.000s | 3.000s | 3.000s |
| Scene 2 | 3.000s | 6.000s | 3.000s |
| Scene 3 | 6.000s | 19.433s | 13.433s |
| Scene 4 | 19.433s | 28.433s | 9.000s |
| Scene 5 revised | 28.433s | 41.300s | 12.867s |
| Scene 6 / final CTA sequence | 41.300s | 56.767s | 15.467s normalized |

## Transition QA

- **Scene 4 → Scene 5:** boundary frames at 28.433s and 28.500s contain
  live Scene 5 content; no black frame, white flash, or unintended pause.
- **Scene 5 → final CTA sequence:** boundary frames at 41.300s and 41.400s
  contain live content; the approved Scene 6 sequence then carries the
  Notifications-to-CTA transition into the premium end card.
- The final fade to black is intentional and remains at the end of the CTA.

## Release files

- `DreamPlanet_Master_v5.mp4`
- `DreamPlanet_Master_v5_audio.mp4`
- `DreamPlanet_Master_v5_no_audio.mp4`

The v5 build is reproducible with `build_master_v5.sh`. No earlier master was
overwritten.