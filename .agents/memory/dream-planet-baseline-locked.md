---
name: Dream Planet baseline locked
description: Scenes 1–4 clean-rebuild verified; .gz archives removed from Git; Scene 5 integration points documented in SCENE5_INTEGRATION.md.
---

## Current approved master (Aug 5, 2026)

- File: `DreamPlanet_Master_v1_audio.mp4` / `_no_audio.mp4` / `_v1.mp4`
- Location: `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit/`
- Duration: 21.533s | 1080×1920 | 30fps | audio present
- Build: `Final Edit/build_master.sh` (deterministic; verified byte-for-byte reproducible)
- Validation: `validate_master.sh --full` → 22/22 checks pass (including Scene 3 blank-intro brightness guard 0.685 < 0.95)

## Archive cleanup (Aug 5, 2026)

`extracted_scenes/Scene1scene2.gz` (64 MB) and `Scene3Scene4.gz` (43 MB) removed from Git tracking via `git rm --cached`. Both were predecessor Replit workspace snapshots — all required content already extracted and tracked. No build or validation script references them. Added to `.gitignore`.

**Why:** Saves ~107 MB from clones; no rebuild impact confirmed by post-cleanup 22/22 pass.

## Scene 5 integration

All integration points are documented in `SCENE5_INTEGRATION.md` (repo root). The four files to edit when Scene 5 export is approved:

1. `Final Edit/build_master.sh` — add `SCENE5_SRC`, `build_scene5()`, append to `SCENE_ORDER`
2. `Final Edit/validate_master.sh` — add to `FLAT_SCENE_SRCS` and `SCENE_ORDER` in SCENE REGISTRY section
3. `artifacts/api-server/src/config/master.ts` — append to `SCENES`, update `MASTER_META.duration`
4. Canonical source path: `...Dream Planet Referral Campaign/Scene 5/Final Animation/scene5_final.mp4`

**How to apply:** When Scene 5 export is in hand, follow `SCENE5_INTEGRATION.md` step-by-step, run `build_master.sh /tmp/verify` first, then `validate_master.sh --full` before committing the new master.
