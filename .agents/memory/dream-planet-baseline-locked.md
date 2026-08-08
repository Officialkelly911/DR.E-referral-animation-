---
name: Dream Planet baseline locked
description: Master v2 remains the locked five-scene baseline; tagged Master v3 appends the approved Scene 6 without changing it.
---

## Current production master — Master v3 (2026-08-08)

- Git tag: `v3.0`
- Files: `DreamPlanet_Master_v3.mp4` / `_audio.mp4` / `_no_audio.mp4`
- Location: `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit/`
- Duration: 56.767s | 1080×1920 | 30fps | AAC audio
- QA: `MASTER_V3_QA.md` — 11/11 release checks pass

## Locked baseline — Master v2 (2026-08-06)

- Git tag: `master-v2-approved`
- Files: `DreamPlanet_Master_v2.mp4` / `_audio.mp4` / `_no_audio.mp4`
- Location: `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit/`
- Duration: 41.300s | 1080×1920 | 30fps | audio present (AAC ~197kbps)
- Build: `Final Edit/build_master_v2.sh` (deterministic)
- Baseline checksums: `archive/scene5_v1/MASTER_V2_BASELINE.md`

## Scene timeline (v2)

| Scene | Start | End | Duration |
|-------|-------|-----|----------|
| 1 Tattoo Reveal | 0.000s | 3.000s | 3.000s |
| 2 Creator Discovery | 3.000s | 6.000s | 3.000s |
| 3 Referral Journey (v3) | 6.000s | 19.433s | 13.433s |
| 4 Leaderboard | 19.433s | 28.433s | 9.000s |
| 5 Community & Participation | 28.433s | 41.300s | 12.867s |

## Master v1 (2026-08-05) — preserved

- Files: `DreamPlanet_Master_v1*.mp4` (same Final Edit dir)
- Duration: 21.533s | Scenes 1–4 only
- Build: `build_master.sh`

## validate_master.sh — v2 state

SCENE REGISTRY updated: `SCENE_ORDER=(scene1 scene2 scene3 scene4 scene5)`
`FLAT_SCENE_SRCS[scene5]` and `TRIM_GUARDS[scene5]="0.9"` added.
`--full` mode now calls `build_master_v2.sh`. `MIN_DURATION=36.0`.
Commented Scene 6 hooks in place throughout.

## Scene 5 archive

`archive/scene5_v1/` — approved deliverables + QA frames + manifest + baseline doc.

## Scene 6 scaffold

`scene6/` — isolated workspace (assets/ src/ captures/ renders/ qa/ README.md).
Scene 6 integration hooks commented out in `build_master_v2.sh` and `validate_master.sh`.
See `scene6/README.md` for the integration checklist when Scene 6 is ready.
