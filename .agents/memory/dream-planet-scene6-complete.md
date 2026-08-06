---
name: Dream Planet Scene 6 complete
description: Scene 6 "Join the Dream Planet Movement" built and captured; QA passed; awaiting approval before Master v3 integration.
---

## Status (August 2026)
Scene 6 captured, QA passed, deliverables committed. NOT yet integrated into master.

## Deliverable locations
- `scene6/renders/scene6_final.mp4` — canonical render (workspace)
- `Scene 6/Final Animation/scene6_final.mp4` — campaign directory copy
- `scene6/qa/SCENE6_ANIMATION_QA.md` — full QA report

## Scene specs
- Duration: 7.920s (target 8.0s) | 1080×1920 | H.264 CRF 16 | no audio
- Timeline constants: `src/components/scene6/Scene6Timeline.ts`

## Animation sequence (8 phases)
P1 (0.0–0.75s): Scene 5 Forum final-frame static hold  
P2 (0.75–2.25s): UI dissolve — blur+fade forum, orange glow emerges, convergence particles  
P3 (2.25–3.20s): DP logo assembles from center with orange drop-shadow glow  
P4 (3.20–3.70s): "MORE THAN FOLLOWERS" tagline  
P5 (3.70–4.70s): "Join Dream Planet Today" / "Start earning with your community."  
P5b (4.50–5.20s): Referral card (IK54OTRD) slides up — glass card, orange glow  
P6 (5.20–5.70s): Store badges (Google Play + App Store)  
P7 (5.70–7.70s): Final hold (~2s) — full poster composition  
End (7.70–7.92s): Fade to black

## Capture pipeline
- Script: `artifacts/dream-planet-scene3/scripts/capture-scene6.mjs`
- Run from artifact root: `PORT_OVERRIDE=24448 node scripts/capture-scene6.mjs`
- End-frame snapshot at t=6.5s (before fade-to-black at 7.70s)
- **Path fix applied:** SCENE6_DIR uses 6 levels up (`../../../../../../scene6`), not 5

## Assets used
- Logo: `attached_assets/dp_logo_v1.svg` (from Logos.zip — DP mark on orange circle)
- App icon: `attached_assets/App_icon__1786044722968.WEBP`
- Store badges: `attached_assets/store_badges.jpeg` (626×626 square; display at `width: 160px`)
- All in project `attached_assets/` (accessible via `@assets` alias in vite config)

## Integration checklist (when approved)
See `scene6/README.md` for full step-by-step. Key steps:
1. Uncomment Scene 6 hooks in `build_master_v2.sh` and `validate_master.sh`
2. Probe first frames to set `TRIM_GUARDS[scene6]` (likely 0 — no white preamble)
3. Update `api-server/src/config/master.ts`: add Scene 6 to SCENES, bump duration to ~49.220s, version to "v3"
4. Run validate + build → all checks pass

**Why:**
Scene 6 was designed as a fully isolated production module — no master integration until creative review passes, per the established Phase 10 protocol.
