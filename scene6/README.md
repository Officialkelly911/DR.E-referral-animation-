# Dream Planet Referral Campaign — Scene 6

> **Status: COMPLETE — Awaiting creative review and approval before Master v3 integration.**
>
> Master v2 (Scenes 1–5) remains frozen. Scene 6 is self-contained and must not
> touch any Scene 1–5 assets, the master build pipeline, or existing deliverables.

---

## Scene Overview

**Name:** Join the Dream Planet Movement  
**Phase:** Phase 10  
**Duration:** 7.920s (target: 8.0s)  
**Resolution:** 1080 × 1920  
**FPS:** 25 (WebM cap; normalized to 30fps at master concat)

---

## Storyboard

| Beat | Time | Visual Description |
|------|------|--------------------|
| P1 | 0.0–0.75s | Scene 5 Forum final frame — static hold |
| P2 | 0.75–2.25s | UI dissolve: forum fades + blurs, orange glow emerges, particles drift to center |
| P3 | 2.25–3.20s | Dream Planet logo assembles — DP mark with orange glow drop-shadow |
| P4 | 3.20–3.70s | Tagline: "MORE THAN FOLLOWERS" fades in |
| P5 | 3.70–4.70s | CTA: "Join Dream Planet Today" + "Start earning with your community." |
| P5b | 4.50–5.20s | Referral card slides up — glass card, orange border, IK54OTRD code |
| P6 | 5.20–5.70s | Store badges appear (Google Play + App Store) |
| P7 | 5.70–7.70s | Final hold — full composition |
| End | 7.70–7.92s | Fade to black |

---

## Timing

| Property | Value |
|----------|-------|
| Actual duration | 7.920s |
| Scene 5 end time | 41.300s |
| Scene 6 start time (in master) | 41.300s |
| Scene 6 end time (in master) | ~49.220s |
| Total master duration (after Scene 6) | ~49.220s |

---

## Assets Used

| Asset | Source |
|-------|--------|
| Dream Planet logo | `attached_assets/dp_logo_v1.svg` (from Logos.zip) |
| App icon | `attached_assets/App_icon__1786044722968.WEBP` |
| Store badges | `attached_assets/store_badges.jpeg` (626×626) |
| Referral code | IK54OTRD |
| Referral URL | dreamplanet.org/referral/IK54OTRD |
| CTA headline | "Join Dream Planet Today" |
| CTA subtext | "Start earning with your community." |
| Tagline | "More Than Followers" |

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
- [x] Correct tagline: "More Than Followers"
- [x] Correct CTA: "Join Dream Planet Today" / "Start earning with your community."
- [x] Store badges visible
- [x] Duration within target range (7.920s ≈ 8.0s)
- [x] No audio (music added at master concat)
- [x] Fade to black end transition
- [x] All motion language rules followed (no bounce, elastic, rotation, flash)

---

## Integration Steps (when Scene 6 is approved)

1. Confirm `scene6/renders/scene6_final.mp4` is the approved file
2. In `Final Edit/build_master_v2.sh`:
   - Uncomment `SCENE6_SRC` variable
   - Uncomment `build_scene6()` function
   - Append `scene6` to `SCENE_ORDER`
3. In `Final Edit/validate_master.sh`:
   - Uncomment `FLAT_SCENE_SRCS[scene6]` in SCENE REGISTRY
   - Uncomment `SCENE_ORDER` scene6 entry
   - Uncomment `TRIM_GUARDS[scene6]` (probe first frame to find correct trim)
4. Update `artifacts/api-server/src/config/master.ts`:
   - Append Scene 6 entry to `SCENES` array
   - Update `MASTER_META.duration` to ~49.220s
   - Bump `MASTER_VERSION` to "v3"
5. Run `./build_master_v2.sh` → verify all checks pass
6. Run `./validate_master.sh --verbose` → all checks pass
7. Update memory: `dream-planet-baseline-locked.md`

---

## Notes

- The capture pipeline is identical to Scenes 3–5 (Playwright + system Chromium + ffmpeg)
- Re-run: `PORT_OVERRIDE=24448 node scripts/capture-scene6.mjs` from the artifact root
- Scene 6 preview URL: `http://localhost:24448/dream-planet-scene3/scene6-cinematic.html`
