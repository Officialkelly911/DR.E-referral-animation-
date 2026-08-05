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

**Master video review page** (port 8080, `/review`) — embed player, metadata, scene timeline:
```sh
pnpm --filter @workspace/api-server run dev
```
Then open `http://localhost:8080/review`. Also exposes `/review/meta` (JSON) and `/review/video` (MP4 stream). To update the review page for a new master version or Scene 5/6, edit `artifacts/api-server/src/config/master.ts`.

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

## Setup status

Dependencies installed and all four workflows (Scene 3 web, Referral Module web, API Server, mockup-sandbox) verified running and rendering correctly.

## Scene 5 materials (uploaded, not yet built)

`attached_assets/` contains a full Scene 5 spec ("Creator Portfolio → Community Forum → Engagement") plus reference screenshots, screen recordings, forum/portfolio media, and brand assets. This is a large new feature (new UI screens: side navigation, portfolio, forum feed, forum overview, plus like/comment/share interactions and a new cinematic animation timeline) — scoped as a separate follow-up task rather than done as part of initial project setup.

## Final master QA (Aug 5, 2026)

Ran a full production QA pass on the 4-scene master per the approved QA checklist. Result:

- **Real defect found & fixed**: `DreamPlanet_Master_v1.mp4` / `_audio.mp4` / `_no_audio.mp4` (in `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit/`) previously concatenated `scene3_final.mp4` **without trimming its baked-in ~3s blank white intro**, producing a ~2.9s blank white screen with music but no UI right after Scene 2 ends. Fixed by trimming Scene 3's source at `ss=3.0` before concatenating (same technique already used in `build_visual_review.sh`, just never applied back to the official master). New master duration: **21.53s** (was 24.53s). Pre-fix files archived under `Final Edit/_archive_pre_qa_fix/`.
- **Not a defect**: the Scene 3→4 cut (Levels page → Leaderboard) is a clean hard cut between two different page background colors (cream vs. white) — frame-by-frame analysis found no white flash frames. A prior QA note calling this a "fade-to-white glitch" did not hold up under verification.
- Audio: single continuous AAC stereo track (44.1kHz, ~196kbps), no gaps at any scene boundary, clean 1s fadeout re-generated to match the new shorter duration.
- Scene durations in the fixed master: S1 3.0s, S2 3.0s, S3 6.53s (post-trim), S4 9.0s.

## Canonical master build

The campaign master (`DreamPlanet_Master_v1.mp4` / `_audio.mp4` / `_no_audio.mp4`)
is no longer hand-assembled with manual FFmpeg commands. It's regenerated by:

```
extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit/build_master.sh
```

Run it from that directory to rebuild the master from the authoritative
scene sources (deterministic — verified byte-for-byte reproducible against
the current approved master). See `MASTER_BUILD.md` in the same directory
for the full spec: authoritative inputs, scene order/durations, the Scene 3
blank-intro trim guard, audio handling, validation checks, and how to add
Scene 5 / Scene 6.

## User preferences

_No explicit preferences recorded yet._
