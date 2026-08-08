# Dream Planet Referral Campaign — Scene 6

> **Status: COMPLETE — integrated into Master v3; technical validation passed, creative approval pending.**
>
> Master v2 (Scenes 1–5) remains frozen. Scene 6 is self-contained and must not
> touch any Scene 1–5 assets, the master build pipeline, or existing deliverables.

---

## Scene Overview

**Name:** Join the Dream Planet Movement  
**Phase:** Phase 10  
**Duration:** 15.480s (target: 15.5s)  
**Resolution:** 1080 × 1920  
**FPS:** 25 (WebM cap; normalized to 30fps at master concat)

---

## Storyboard

| Beat | Time | Visual Description |
|------|------|--------------------|
| P1–P8 | 0.0–9.94s | Home Feed → sidebar → Forum scroll → Notifications |
| P9 | 9.94–10.34s | Notifications crossfade into CTA background |
| P10 | 10.34–12.94s | Logo, headline, referral card, download buttons, and final CTA button ease in |
| P11 | 12.94–14.64s | Full premium CTA composition holds for reading |
| End | 14.64–15.50s | Glow and composition fade to black |

---

## Timing

| Property | Value |
|----------|-------|
| Actual duration | 15.480s |
| Scene 5 end time | 41.300s |
| Scene 6 start time (in master) | 41.300s |
| Scene 6 end time (in master) | ~56.780s |
| Total master duration (after Scene 6) | ~56.780s |

---

## Assets Used

| Asset | Source |
|-------|--------|
| Dream Planet logo | `attached_assets/dp_logo_v1.svg` (from Logos.zip) |
| App icon | `attached_assets/App_icon__1786044722968.WEBP` |
| Platform cue | Text-only “Available on mobile” line; store badge artwork intentionally omitted |
| Referral code | IK54OTRD |
| Referral URL | dreamplanet.org/referral/IK54OTRD |
| CTA headline | "Your Community Has Value" |
| CTA subtext | "Turn your influence into income. Start earning with your community today." |
| CTA eyebrow | "The Dream Planet Movement" |

---

## Source Files

| File | Location |
|------|----------|
| Animation timeline | `artifacts/dream-planet-scene3/src/components/scene6/Scene6Timeline.ts` |
| Animation component | `artifacts/dream-planet-scene3/src/components/scene6/Scene6CinematicAnimation.tsx` |
| App wrapper | `artifacts/dream-planet-scene3/src/components/scene6/Scene6CinematicApp.tsx` |
| Entry point | `artifacts/dream-planet-scene3/src/main-scene6-cinematic.tsx` |
| HTML entry | `artifacts/dream-planet-scene3/scene6-cinematic.html` |
| Capture script | `artifacts/dream-planet-scene3/scripts/capture-scene6.mjs` |
| QA report | `scene6/qa/SCENE6_ANIMATION_QA.md` |

---

## Deliverables

| File | Status |
|------|--------|
| `scene6/renders/scene6_final.mp4` | ✅ |
| `scene6/renders/scene6_final_no_audio.mp4` | ✅ |
| `scene6/qa/scene6_start_frame.png` | ✅ |
| `scene6/qa/scene6_end_frame.png` | ✅ |
| `scene6/qa/SCENE6_ANIMATION_QA.md` | ✅ |
| `Scene 6/Final Animation/scene6_final.mp4` | ✅ |
| `Scene 6/Final Animation/scene6_start_frame.png` | ✅ |
| `Scene 6/Final Animation/scene6_end_frame.png` | ✅ |

---

## QA Checklist

- [x] Resolution: 1080 × 1920
- [x] No blank/pure-white intro frames
- [x] Correct logo (DP mark, orange circle)
- [x] Correct referral code: IK54OTRD
- [x] CTA eyebrow: "The Dream Planet Movement"
- [x] Correct CTA: "Your Community Has Value" / "Turn your influence into income. Start earning with your community today."
- [x] Google Play / App Store badge artwork excluded from the CTA
- [x] Duration within target range (15.480s ≈ 15.5s)
- [x] No audio (music added at master concat)
- [x] Fade to black end transition
- [x] All motion language rules followed (no bounce, elastic, rotation, flash)

---

## Integration Steps (completed for Master v3)

1. Approved Scene 6 was preserved as `scene6_final_v3.mp4` and `scene6_final_v3_no_audio.mp4`.
2. `build_master_v3.sh` appends the approved Scene 6 to the locked Master v2 no-audio baseline.
3. `validate_master_v3.sh` verifies the v3 release and Scene 5→6 boundary.
4. `artifacts/api-server/src/config/master.ts` serves Master v3 and includes the Scene 6 timeline entry.
5. Release assets and QA documentation are stored in the `Final Edit/` directory.

---

## Notes

- The capture pipeline is identical to Scenes 3–5 (Playwright + system Chromium + ffmpeg)
- Re-run: `PORT_OVERRIDE=24448 node scripts/capture-scene6.mjs` from the artifact root
- Scene 6 preview URL: `http://localhost:24448/dream-planet-scene3/scene6-cinematic.html`
