---
name: Dream Planet Scene 3 capture complete
description: State of the Scene 3 Playwright capture, the full 4-scene master output, and the Framer Motion v11 AnimationControls fix applied to all scene UI files.
---

# Dream Planet Scene 3 Capture — Complete

## Status (August 2026)
All scenes are captured and stitched. No further pipeline work needed unless animation content changes.

## Output files (all at `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/`)
- `Scene 3/Final Animation/scene3_final.mp4` — 9.52s, 1080×1920, H.264 CRF16, 25fps
- `Scene 4/Final Animation/scene4_final.mp4` — 9.0s, 1080×1920, H.264 CRF16, 25fps
- `Final Edit/DreamPlanet_Master_v1.mp4` — 24.5s, all 4 scenes, no audio
- `Final Edit/DreamPlanet_Master_v1_audio.mp4` — 24.5s, AI music mixed in
- `Final Edit/DreamPlanet_Master_v1_VisualReview.mp4` — 29MB visual review variant

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

## Capture script
`artifacts/dream-planet-scene3/scripts/capture-scene3-system.mjs`
- Records Scene 3 (10s buffer → trims to 9.5s) and Scene 4 (starts at 10s mark, trims 9.0s)
- Requires system Chromium (`which chromium` or nix store) and dev server on port 24448
- Stitches all 4 scenes if `scene1_scene2_combined.mp4` is present in Final Edit/
