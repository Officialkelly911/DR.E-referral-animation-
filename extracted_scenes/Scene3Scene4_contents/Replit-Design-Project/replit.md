# Dream Planet Referral Module — Scene 3 & 4 Animation Project

A pixel-faithful recreation of the Dream Planet Referral module used as a live animation canvas for a multi-scene promotional video campaign (Scenes 3 & 4). Three navigable mobile screens — Referral Home, View Levels, Leaderboard — are animated cinematically in a 9:16 vertical format.

## Run & Operate

| Command | What it does |
|---|---|
| `pnpm --filter @workspace/dream-planet-scene3 run dev` | **Scene 3 animation preview** (port auto-assigned, Vite) |
| `pnpm --filter @workspace/dream-planet-referral run dev` | Locked Referral Module UI (standalone, port auto-assigned) |
| `pnpm --filter @workspace/api-server run dev` | API server (port 5000) |
| `pnpm run typecheck` | Full typecheck across all packages |
| `pnpm run build` | Typecheck + build all packages |

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Animation: Framer Motion (framer-motion), GSAP 3
- UI: React 18 + Tailwind CSS (Vite)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM

## Where things live

```
artifacts/
  dream-planet-scene3/         ← Scene 3 cinematic animation (primary deliverable)
    src/
      components/scene3/
        Scene3ReferralAnimation.tsx   ← master orchestrator / timeline (9.5s)
        Scene3ReferralUI.tsx          ← Referral Home (Phase 1-4b)
        Scene3LevelsUI.tsx            ← Referral Levels (Phase 6)
        Scene3LeaderboardUI.tsx       ← Leaderboard (Phase 8)
        Scene3TapRipple.tsx           ← tap indicator for nav transitions
        Scene3Timeline.ts             ← timing constants
      lib/video/
        animations.ts                 ← shared easing/spring/variant presets
        hooks.ts                      ← video utility hooks
  dream-planet-referral/       ← locked UI module (source of truth for visual fidelity)
  api-server/                  ← Express API
  mockup-sandbox/              ← component preview canvas
```

## Scene 3 Animation — 9.5 s Timeline

| Phase | Time | Description |
|---|---|---|
| 1 | 0.0–0.4 s | Entry — white overlay dissolves (bridge from Scene 2) |
| 2 | 0.4–1.4 s | Referral Home reveal — UI rises with scale settle |
| 3 | 1.4–3.0 s | Home camera push-in 100% → 106% toward code card |
| 4 | 3.0–3.6 s | Referral code card pulse (1.028× breathe) |
| 4b | 3.6–4.0 s | "View Levels" link tease |
| 5 | 4.0–5.0 s | Tap "View Levels" ripple + iOS-style push to Levels |
| 6 | 5.0–6.6 s | Levels stagger reveal + camera push-in |
| 7 | 6.6–7.6 s | Tap "Leaderboard" pill + iOS-style push to Leaderboard |
| 8 | 7.6–9.5 s | Leaderboard stagger reveal + push-in + hold (Scene 4 handoff) |

## Architecture decisions

- **AnimationControls typing**: Framer Motion v11 dropped `AnimationControls` as a named export. All files derive the type via `type AnimationControls = ReturnType<typeof useAnimation>`.
- **Cubic-bezier ease arrays**: Must be cast as `[number, number, number, number]` tuples to satisfy TypeScript's `Easing` type; plain `number[]` is rejected.
- **Single camera layer**: One `motion.div#s3-camera` wraps all three pages. It resets to `scale:1` before each page transition, then rebuilds the push-in on the new page — avoids compounding transforms.
- **390 px design width**: All UI components are authored at 390 px wide. A CSS `scale()` transform fills the viewport, keeping the design pixel-perfect at any resolution.
- **Tap targets are visual only**: Navigation pill buttons (`cursor: default`) are rendered in the correct positions so the `Scene3TapRipple` appears on a real UI element, not empty space.

## User preferences

_Populate as you build._

## Gotchas

- Running `pnpm run typecheck` at the workspace root checks **all** artifacts. Fix errors in all packages before marking work complete.
- The locked `dream-planet-referral` UI must not be modified for layout, colors, typography, or assets.
- Scene 3 loops automatically in the browser. For video export, a separate capture script is needed (see Task #2).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Scenes 1 & 2 were developed in a separate project (`extracted_scenes/Scene1scene2_contents/`) and are intended to be merged via GitHub
