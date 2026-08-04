# Scene 3 — LOCKED ✅

**Status:** Approved and locked as of 2026-08-04.

## What was built

A 9.5-second cinematic animation of the Dream Planet Referral experience
running in a React + Framer Motion browser application at 1080 × 1920 (9:16).

### 8-phase timeline

| Phase | Time      | Description                                      |
|-------|-----------|--------------------------------------------------|
| 1     | 0.0–0.4s  | White overlay dissolves — bridge from Scene 2    |
| 2     | 0.4–1.4s  | Referral Home rises (opacity + scale + y)        |
| 3     | 1.4–3.0s  | Camera push-in 100% → 106% toward code card      |
| 4     | 3.0–3.6s  | Referral code card breathes (1.028× pulse)       |
| 4b    | 3.6–4.0s  | "View Levels" link tease                         |
| 5     | 4.0–5.0s  | Tap ripple + iOS-style push to Levels page       |
| 6     | 5.0–6.6s  | Levels stagger reveal + camera push-in           |
| 7     | 6.6–7.6s  | Tap "Leaderboard" pill + iOS push to Leaderboard |
| 8     | 7.6–9.5s  | Leaderboard stagger reveal + push-in + hold      |

## Visual fidelity

- All three pages (Referral Home, View Levels, Leaderboard) are pixel-faithful
  to the locked `dream-planet-referral` module.
- Referral code: **IK54OTRD** (unchanged).
- All real profile photos used on the Leaderboard — no placeholder initials.
- Badge assets: bronze, silver, gold from `attached_assets/`.

## Scene 2 → Scene 3 transition

Scene 2's final 0.4s now fades to white (`scene2_final_with_fadeout.mp4`).
Scene 3 opens at full white and dissolves, making the cut invisible.

## Do not modify

- `src/components/scene3/` — all Scene 3 UI and orchestration files are locked.
- `src/components/scene3/Scene3Timeline.ts` — timing constants are locked.
- Referral code IK54OTRD and URL must not change.

## Rendering

- **Browser live preview:** running at `/dream-planet-scene3/` via Vite dev server.
- **Video export:** `node scripts/capture-scene3.mjs` (requires `libglib` system dep
  for Playwright Chromium; output to `captured/` and
  `../../Scene1scene2_contents/.../Scene 3/Final Animation/`).
- **Recording hooks:** `window.startRecording` / `window.stopRecording` wired via
  `useVideoPlayer` in `VideoTemplate.tsx` — compatible with Replit's native video export.

## Combined edit

`scene1_scene2_scene3_combined.mp4` — stitched after Scene 3 is rendered, stored in
`Dream Planet Referral Campaign/Final Edit/`.

## Next

Scene 4 (`src/components/scene4/`) — Deeper Referral Discovery, 9.0s.
See `VideoTemplate.tsx` for the full two-scene structure.
