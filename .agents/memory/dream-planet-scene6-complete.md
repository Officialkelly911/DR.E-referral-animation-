---
name: Dream Planet Scene 6 complete
description: Scene 6 "Join the Dream Planet Movement" passed final QA and was integrated into the tagged Master v3 release.
---

## Status (August 2026)
Scene 6 passed final QA, was appended to the locked Master v2 baseline, and is included in tagged Master v3.

## Deliverable locations
- `scene6/renders/scene6_final.mp4` — canonical render (workspace)
- `Scene 6/Final Animation/scene6_final.mp4` — campaign directory copy
- `scene6/qa/SCENE6_ANIMATION_QA.md` — full QA report

## Scene specs
- Duration: 15.480s (target 15.5s) | 1080×1920 | H.264 CRF 16 | no audio
- Timeline constants: `src/components/scene6/Scene6Timeline.ts`

## Animation sequence
P1–P8 (0.0–9.94s): Home Feed, sidebar, Forum scroll, Notifications  
P9 (9.94–10.34s): Notifications crossfade into the CTA background  
P10 (10.34–12.94s): Logo, headline, referral card, download buttons, CTA button  
P11 (12.94–14.64s): Full premium CTA hold for reading  
End (14.64–15.50s): Fade to black

## Capture pipeline
- Script: `artifacts/dream-planet-scene3/scripts/capture-scene6.mjs`
- Run from artifact root: `PORT_OVERRIDE=24448 node scripts/capture-scene6.mjs`
- End-frame snapshot at t=13.4s (before fade-to-black at 14.64s)
- **Path fix applied:** SCENE6_DIR uses 6 levels up (`../../../../../../scene6`), not 5

## Assets used
- Logo: `attached_assets/dp_logo_v1.svg` (from Logos.zip — DP mark on orange circle)
- App icon: `attached_assets/App_icon__1786044722968.WEBP`
- Store badges: `attached_assets/store_badges.jpeg` (626×626 square; display at `width: 160px`)
- All in project `attached_assets/` (accessible via `@assets` alias in vite config)

## Release status
- Master v3: 56.766667s, 1080×1920, 30fps, AAC audio; all 11 v3 validation checks pass.
- Master v2 remains the locked five-scene baseline and was hash-verified unchanged.
- Approved Scene 6 source assets are preserved in `archive/scene6_approved_v3/`.
- Release QA, changelog, notes, thumbnail, poster, and `scene6_final_v2.mp4` are in the Final Edit directory.

**Why:**
Scene 6 was designed as a fully isolated production module — no master integration until creative review passes, per the established Phase 10 protocol.
