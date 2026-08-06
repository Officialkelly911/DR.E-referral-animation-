---
name: Dream Planet Scene 5 cinematic captured
description: Phase 6 capture complete; output location, key timing decisions, and next-step integration notes for Scene 5.
---

# Dream Planet — Scene 5 Cinematic (Phase 6)

## Status (August 2026)
Capture complete and QA'd. Standalone review cut ready; NOT yet in master.

## Output file
`extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 5/Final Animation/scene5_final.mp4`
- Duration: 9.2 s
- Resolution: 1080 × 1920 (9:16)
- FPS: 25
- Codec: H.264 (CRF 16, slow)
- No audio (score added at master stage)

## Key source files
- `Scene5Timeline.ts` — all timing constants (`S5.*`, `s5t()`)
- `Scene5CinematicAnimation.tsx` — async run() orchestrator + camera layer
- `Scene5CinematicApp.tsx` — standalone entry (no harness chrome)
- `main-scene5-cinematic.tsx` + `scene5-cinematic.html` — build entry
- `scripts/capture-scene5.mjs` — Playwright → ffmpeg pipeline

## Playwright ffmpeg note
Playwright's bundled ffmpeg binary must be installed before recordVideo works:
`npx playwright install ffmpeg`
This puts it at `~/.cache/ms-playwright/ffmpeg-1011/`. Must be re-run in any fresh environment.

## Timeline structure (9.5s spec, 9.2s delivered)
Phase 1: Entry dissolve (0.0–0.7s) — home screen / Scene 4 handoff
Phase 2: Side nav opens, View Portfolio tap (0.7–1.4s)
Phase 3: Portfolio reveal + camera push-in 100%→108% (1.4–2.7s)
Phase 4: View Forum tap → Forum enters (2.7–3.5s)
Phase 5: Forum reveal + camera push-in 100%→106% (3.5–4.5s)
Phase 6: Community feed scroll p1→p2→p1 (4.5–6.5s)
Phase 7: Like p1, open comments, show prepared comment, close (6.5–8.2s)
Phase 8: Final push-in + hold on forum feed (8.2–9.2s)

## Camera pattern
`motion.div` + `useAnimation()`, `transformOrigin: '50% 40%'`, scale + y.
Portfolio push: scale 1.08 / y -2%. Forum push: scale 1.06 / y -1%. Final: 1.04 / -1%.

## Opening/closing state
- Start: Home screen (dark hero card, orange FAB, bottom nav)
- End: Forum screen, p1 post liked (orange heart), comment sheet closed

## Next step — master concat
When Scene 5 is approved, concat Scenes 1–5 into `DreamPlanet_Master_v2.mp4`.
Scene 5 has no blank intro (unlike scene3_final.mp4 — see scene3-capture notes).
Use `scene5_final_no_audio.mp4` as the source for concat.

**Why separate no-audio copy:** The no-audio copy is identical but clearly named for the concat pipeline, which adds music as a separate pass.
