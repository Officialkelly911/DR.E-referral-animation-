# Dream Planet Referral Campaign — Scene 3 & 4

A video production workspace for the **Dream Planet Referral Campaign**, containing:

- **Scenes 1 & 2**: Already completed as final `.mp4` files (in `extracted_scenes/Scene1scene2_contents/`)
- **Scene 3 animation**: Cinematic 4.5-second reveal of the Referral Home (built, running)
- **Referral Module UI**: The locked React/TypeScript app animating in Scene 3 (and planned for Scene 4)

## Running the project

The workspace is a pnpm monorepo. Install dependencies first:

```sh
cd extracted_scenes/Scene3Scene4_contents/Replit-Design-Project
pnpm install
```

**Scene 3 animation preview** (port 24448, `/dream-planet-scene3/`):
```sh
pnpm --filter @workspace/dream-planet-scene3 run dev
```

**Referral Module UI** (for reference):
```sh
pnpm --filter @workspace/dream-planet-referral run dev
```

## Scene 3 animation — what's built

All 6 phases are implemented in Framer Motion:

| Phase | Time | Description |
|-------|------|-------------|
| 1 Entry | 0.0–0.6s | White overlay dissolves out (Scene 2 handoff) |
| 2 Reveal | 0.6–1.8s | Referral Home rises in: fade + scale settle |
| 3 Push-in | 1.8–3.0s | Slow camera scale 100% → 108% toward referral code |
| 4 Code Emphasis | 3.0–3.7s | Code card breathes: soft 1.028× pulse |
| 5 Levels Tease | 3.7–4.2s | "View Levels" link draws the eye |
| 6 Exit | 4.2–4.5s | White overlay fades in (Scene 4 handoff) |

Key files:
- `artifacts/dream-planet-scene3/src/components/scene3/Scene3Timeline.ts` — all timing constants
- `artifacts/dream-planet-scene3/src/components/scene3/Scene3ReferralAnimation.tsx` — animation orchestrator
- `artifacts/dream-planet-scene3/src/components/scene3/Scene3ReferralUI.tsx` — self-contained UI replica

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React 19 + Framer Motion (animation)
- Tailwind CSS v4 + Inter font
- Vite build

## Key constraints

- The Dream Planet Referral Module UI is **locked** — do not change layout, colors, typography, or assets
- Referral code must remain: `IK54OTRD`
- Referral URL must remain: `https://dreamplanet.org/referral/IK54OTRD`
- All Scene 3 logic lives under `artifacts/dream-planet-scene3/src/components/scene3/` — keep it isolated for clean GitHub merge

## Assets

All shared assets live in `extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/attached_assets/`:
- 4 memoji avatar PNGs (used in hero cluster)
- Dream Planet official logo PNGs
- AI music track: `Ai_music_for_dream_planet_video__1785842118219.mp3`
- Scene 1+2 reference: `extracted_scenes/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/`

## User preferences

_No explicit preferences recorded yet._
