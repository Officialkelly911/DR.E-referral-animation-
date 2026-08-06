---
name: Dream Planet Scene 5 cinematic captured
description: Phase 6 capture complete; output location, key timing decisions, and next-step integration notes for Scene 5.
---

# Dream Planet — Scene 5 Cinematic (Phase 6)

## Status (August 2026)
Full spec capture complete and QA'd. Targeted revision (v2, 13.80s, 7 phases) is the
current approved-for-review cut: Forum floating "+" removed (Portfolio-only now),
4 distinct Forum posts with 3 controlled scroll-and-hold beats (was 2 posts/1 scroll),
restrained interactions (Like p1, Comment p3). See `SCENE5_ANIMATION_QA.md` in
`artifacts/dream-planet-scene3/` for full before/after. Standalone review cut ready;
NOT yet in master (per spec, integration is explicitly gated on approval).

**Gotcha — multiple served copies of scene5_final.mp4 don't auto-sync.** The canonical
capture output lands in `.../Scene 5/Final Animation/`, but two *other* copies are
served independently and must be manually re-copied after every re-capture: the
workspace-root `scene5_player/` (standalone preview workflow) and
`artifacts/dream-planet-scene3/public/` (used by the in-app `scene5-review.html`
harness). A past revision updated the canonical file and QA docs but left both served
copies on the stale duration — always diff all three with `ffprobe`/`md5sum` after a
recapture, and update the hardcoded duration/phase-table text in `scene5_player/index.html`
and `scene5-review.html` too (they don't read timing from `Scene5Timeline.ts`).

## Output file
`extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Scene 5/Final Animation/scene5_final.mp4`
- Duration: 13.80 s
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

## Timeline structure (13.80s delivered, current)
Phase 1: Scene 4 handoff → Side Nav opens, holds to read (0.00–1.20s)
Phase 2: View Portfolio tap → Portfolio slides in (1.20–2.50s)
Phase 3: Portfolio reveal — profile/stats hold, media grid scroll, floating "+" visible (2.50–5.20s)
Phase 4: View Forum tap → Forum enters, floating "+" disappears (5.20–6.50s)
Phase 5: Forum reveal + camera push-in — header, 47 members, post 1 (6.50–8.00s)
Phase 6: Multi-post discovery — p1 (Like) → p2 → p3 (Comment) → p4, 3 controlled scrolls (8.00–12.60s)
Phase 7: Final push-in, hold on clean forum feed / p4 (12.60–13.80s)

## Camera pattern
`motion.div` + `useAnimation()`, `transformOrigin: '50% 40%'`, scale + y.
Portfolio push: scale 1.08 / y -2%. Forum push: scale 1.06 / y -1%. Final: 1.04 / -1%.

## Opening/closing state
- Start: Home screen (dark hero card, orange FAB, bottom nav)
- End: Forum screen settled on p4 (joanna), no overlays, floating "+" absent

## Next step — master concat
When Scene 5 is approved, concat Scenes 1–5 into `DreamPlanet_Master_v2.mp4`.
Scene 5 has no blank intro (unlike scene3_final.mp4 — see scene3-capture notes).
Use `scene5_final_no_audio.mp4` as the source for concat.

**Why separate no-audio copy:** The no-audio copy is identical but clearly named for the concat pipeline, which adds music as a separate pass.
