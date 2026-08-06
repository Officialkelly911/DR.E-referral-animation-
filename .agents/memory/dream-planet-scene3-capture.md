---
name: Dream Planet Scene 3 capture complete
description: State of the Scene 3 Playwright capture, the full 4-scene master output, and the Framer Motion v11 AnimationControls fix applied to all scene UI files.
---

# Dream Planet Scene 3 Capture — Complete

## Status (August 2026)
Scene 3 updated to **v3 (14.14s readability pass)** — timing only, no UI/design changes.
The 4-scene master (`DreamPlanet_Master_v1.mp4`) is now **stale** — it was built with Scene 3 v2 (11.84s).
Master must be rebuilt via `build_master.sh` before the campaign master is current.

## Output files (all at `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/`)
- `Scene 3/Final Animation/scene3_final.mp4` — **13.96s** (v3), 1080×1920, H.264 CRF16, 25fps
- `Scene 3/Final Animation/scene3_final_no_audio.mp4` — identical copy, ready for concat
- `Scene 4/Final Animation/scene4_final.mp4` — 9.0s, 1080×1920, H.264 CRF16, 25fps (unchanged)
- `Final Edit/DreamPlanet_Master_v1.mp4` — **STALE** (built with S3 v2); rebuild needed

## Scene 3 content (verified via start/end frames)
- Start: Referral Home (orange sunburst, IK54OTRD code, friend stickers)
- End: Leaderboard (kiut_Rababag #1/40pt, dr._e pinned at #9/0pt)
- Three-page journey confirmed: Home → View Levels → Leaderboard

## Framer Motion v11 fix — AnimationControls
FM v11 does not export `AnimationControls` as a named type. All scene UI components that used it were fixed with:
```ts
import { motion, useAnimation } from 'framer-motion';
type AnimationControls = ReturnType<typeof useAnimation>;
```
Applied to: `Scene3ReferralUI.tsx`, `Scene3LevelsUI.tsx`, `Scene3LeaderboardUI.tsx`
(and equivalents in Scene 4).

**Why:** The type was removed from the public FM v11 API surface. The `ReturnType<typeof useAnimation>` pattern is the correct FM v11 replacement and is stable.

**How to apply:** Any new scene UI file that accepts an `animControls` prop should use this pattern, not `import { AnimationControls }`.

## Known source quirk — scene3_final.mp4 has a baked-in blank intro
`scene3_final.mp4` has several seconds of blank/white content at its start before the UI appears. Any concat that uses this file as a source must trim that opening first, or the resulting master gets a dead white gap right after the preceding scene. One build path in this pipeline already trimmed it; another didn't — the two silently drifted out of sync.

**Why:** Source duration/thumbnail checks don't reveal a blank intro — only frame-by-frame brightness sampling across each scene boundary does. A reported "fade-to-white glitch" at a different scene boundary did NOT reproduce under the same frame-by-frame check — it was a plain hard cut between two differently-colored page backgrounds, not a defect. Don't trust coarse timestamp screenshots for boundary QA; sample per-frame average brightness instead.

**How to apply:** Before trusting or rebuilding any master render in this pipeline, verify every scene-source concat point actually trims dead frames, rather than assuming parity between build scripts.

## Capture script
`artifacts/dream-planet-scene3/scripts/capture-scene3-system.mjs`
- Records Scene 3 (10s buffer → trims to 9.5s) and Scene 4 (starts at 10s mark, trims 9.0s)
- Requires system Chromium (`which chromium` or nix store) and dev server on port 24448
- Stitches all 4 scenes if `scene1_scene2_combined.mp4` is present in Final Edit/
