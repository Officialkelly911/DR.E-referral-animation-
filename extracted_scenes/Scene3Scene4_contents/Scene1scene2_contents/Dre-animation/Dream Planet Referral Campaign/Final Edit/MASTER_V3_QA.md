# Dream Planet Master v3 QA

**QA date:** 2026-08-08  
**Status:** ✅ TECHNICALLY VALIDATED — CREATIVE APPROVAL PENDING

## Pass / fail checklist

| Check | Result | Evidence |
|---|---|---|
| Scene 6 final QA passed | ✅ Pass | `SCENE6_FINAL_QA.md` |
| Master v3 builds successfully | ✅ Pass | `build_master_v3.sh` clean rebuild to a temporary output directory |
| Scenes 1–5 preserved | ✅ Pass | Locked Master v2 SHA-256 hashes unchanged before/after rebuild |
| Resolution | ✅ Pass | 1080 × 1920 |
| Frame rate | ✅ Pass | 30fps |
| Pixel format | ✅ Pass | yuv420p |
| Audio present | ✅ Pass | AAC stereo campaign music |
| Audio synchronization | ✅ Pass | Audio/video duration delta: 0.000658s |
| No-audio export | ✅ Pass | No audio stream present |
| Scene order | ✅ Pass | 1 → 2 → 3 → 4 → 5 → 6 |
| Scene 5→6 transition | ✅ Pass | Boundary frames at 41.2s, 41.3s, and 41.4s contain live content |
| End behavior | ✅ Pass | CTA holds, then fades to black intentionally |
| CTA/source constraints | ✅ Pass | No store badge artwork; referral code remains `IK54OTRD` |

## Scene durations

| Scene | Start | End | Duration |
|---|---:|---:|---:|
| 1 — Tattoo Reveal | 0.000s | 3.000s | 3.000s |
| 2 — Creator Discovery | 3.000s | 6.000s | 3.000s |
| 3 — Referral Journey | 6.000s | 19.433s | 13.433s |
| 4 — Leaderboard | 19.433s | 28.433s | 9.000s |
| 5 — Community & Participation | 28.433s | 41.300s | 12.867s |
| 6 — Premium CTA | 41.300s | 56.767s | 15.467s normalized |
| **Total** | **0.000s** | **56.767s** | **56.767s** |

The isolated Scene 6 source is 15.480s at 25fps. Its 30fps normalized representation is 15.466667s; the resulting master is 56.766667s.

## Audio verification

- Master audio stream: AAC, 44.1kHz, stereo, approximately 192kbps.
- Audio duration: 56.766009s.
- Video duration: 56.766667s.
- Difference: 0.000658s, within the 0.5s production tolerance.
- Scene 6 contains no embedded audio; the campaign track is applied once at master level and fades during the final second.

## Transition and visual verification

Spot-check frames were extracted at scene boundaries and CTA milestones:

- `qa_v3/scene5_boundary_41_2s.png`
- `qa_v3/scene6_boundary_41_3s.png`
- `qa_v3/scene6_boundary_41_4s.png`
- `qa_v3/scene6_cta_54_7s.png`
- `qa_v3/scene6_fade_56_2s.png`

All boundary frames contain intentional visual content. The Scene 6 CTA uses the campaign’s orange/charcoal language, keeps the referral code dominant, and maintains the approved premium motion treatment.

## Final release status

Master v3 passes the release validation suite and the end-to-end technical
playback review. It is ready for final human creative approval as the
production master for the six-scene Dream Planet Referral Campaign.

Scenes 1–5 were not creatively modified. Master v2 remains untouched. The
integrated Scene 6 source is the approved versioned candidate:
`Scene 6/Final Animation/scene6_final_v3_no_audio.mp4`.