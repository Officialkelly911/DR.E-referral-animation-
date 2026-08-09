# Dream Planet Referral Campaign — Scene 3 & 4

A video production workspace for the **Dream Planet Referral Campaign**, containing:

- **Scenes 1 & 2**: Already completed as final `.mp4` files (in `extracted_scenes/Scene1scene2_contents/`)
- **Scene 3 animation**: Full 14.14s cinematic journey — Referral Home → View Levels → Leaderboard (built, running; v3 readability pass)
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

**Master v5 preview player** (port 5000, `/`) — full 56.767-second production render with audio:
```sh
node scene5_player/server.mjs
```
The player streams the authoritative `Final Edit/DreamPlanet_Master_v5.mp4` through `/master-v5.mp4`, with the individual Scene 5 and Scene 6 review clips available in the adjacent tabs.

**Scene 3 animation preview** (port 24448, `/dream-planet-scene3/`):
```sh
pnpm --filter @workspace/dream-planet-scene3 run dev
```

**Referral Module UI** (for reference):
```sh
pnpm --filter @workspace/dream-planet-referral run dev
```

## Scene 3 animation — what's built

Full 14.14s cinematic journey (v3 — readability pass) implemented in Framer Motion:

| Phase | Time | Description |
|-------|------|-------------|
| 1 Entry | 0.0–0.5s | White overlay dissolves (Scene 2 handoff) |
| 2 Reveal | 0.5–1.7s | Referral Home rises in: fade + scale settle |
| 3 Push-in | 1.7–4.2s | Camera 100% → 106% toward referral code card |
| 4 Code Emphasis | 4.2–4.9s | Code card breathes: soft 1.028× pulse |
| 4b Levels Tease | 4.9–5.4s | "View Levels" link draws the eye |
| 5 Tap + Transition | 5.4–7.2s | Tap ripple → iOS-style push to Levels page |
| 6 Levels | 7.2–9.2s | Stagger reveal + camera push-in |
| 7 Tap + Transition | 9.2–10.3s | Tap ripple → iOS-style push to Leaderboard |
| 8 Leaderboard | 10.3–14.14s | Stagger reveal + push-in + extended hold |

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

Dependencies installed and the configured `Scene 5 Preview` workflow verified running and serving the Master v5 review player. The project was re-imported from GitHub; restart that exact workflow after future changes.

## Scene 5 materials (uploaded, in progress)

`attached_assets/` contains a full Scene 5 spec ("Creator Portfolio → Community Forum → Engagement") plus reference screenshots, screen recordings, forum/portfolio media, and brand assets. This is a large new feature (new UI screens: side navigation, portfolio, forum feed, forum overview, plus like/comment/share interactions and a new cinematic animation timeline).

**Phase 2 — Side Navigation Drawer: done.** Recreated as `Scene5SideNavigation` and children under
`artifacts/dream-planet-scene3/src/components/scene5/`. Review harness at
`/dream-planet-scene3/scene5-preview.html` (isolated from Scenes 3/4). See
`SCENE5_PHASE2_FIDELITY_REPORT.md` for the visual fidelity audit against the reference screenshot.
Per the phase spec, work stopped here — Portfolio, Forum, engagement interactions, the Scene 5
animation timeline, and master integration are separate later phases pending review/approval.

## Deterministic master pipeline

The current production deliverable is Master v5, rebuilt from the locked Scenes 1–4,
the approved revised Scene 5, and approved Scene 6 v3. The v2 builder remains the
deterministic Scenes 1–5 base used by `build_master_v5.sh`; its scratch workspaces are
regenerable and ignored by Git.

- **Production master:** `Final Edit/DreamPlanet_Master_v5.mp4`
- **Audio variant:** `Final Edit/DreamPlanet_Master_v5_audio.mp4`
- **No-audio variant:** `Final Edit/DreamPlanet_Master_v5_no_audio.mp4`
- **Build:** `Final Edit/build_master_v5.sh`
- **QA report:** `Final Edit/MASTER_V5_QA.md`
- **Master v1–v4 delivery files:** removed as superseded; source scenes and build scripts remain

### Production Scene Timeline (final)

| Scene | Start | End | Duration |
|-------|-------|-----|----------|
| 1 | 0.000 s | 3.000 s | 3.000 s |
| 2 | 3.000 s | 6.000 s | 3.000 s |
| 3 (v3) | 6.000 s | 19.433 s | 13.433 s |
| 4 | 19.433 s | 28.433 s | 9.000 s |
| 5 | 28.433 s | 41.300 s | 12.867 s |

---

## Historical master QA (Aug 5, 2026)

Ran a full production QA pass on the 4-scene master per the approved QA checklist. Result:

- **Real defect found & fixed**: `DreamPlanet_Master_v1.mp4` / `_audio.mp4` / `_no_audio.mp4` (in `extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit/`) previously concatenated `scene3_final.mp4` **without trimming its baked-in ~3s blank white intro**, producing a ~2.9s blank white screen with music but no UI right after Scene 2 ends. Fixed by trimming Scene 3's source at `ss=3.0` before concatenating (same technique already used in `build_visual_review.sh`, just never applied back to the official master). New master duration: **21.53s** (was 24.53s). Pre-fix files archived under `Final Edit/_archive_pre_qa_fix/`.
- **Not a defect**: the Scene 3→4 cut (Levels page → Leaderboard) is a clean hard cut between two different page background colors (cream vs. white) — frame-by-frame analysis found no white flash frames. A prior QA note calling this a "fade-to-white glitch" did not hold up under verification.
- Audio: single continuous AAC stereo track (44.1kHz, ~196kbps), no gaps at any scene boundary, clean 1s fadeout re-generated to match the new shorter duration.
- Scene durations in the fixed master: S1 3.0s, S2 3.0s, S3 6.53s (post-trim), S4 9.0s.

## Canonical master build

The campaign master (`DreamPlanet_Master_v5.mp4` / `_audio.mp4` / `_no_audio.mp4`)
is regenerated by:

```
extracted_scenes/Scene3Scene4_contents/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/Final Edit/build_master_v5.sh
```

Run it from that directory to rebuild the master from the authoritative
scene sources (deterministic — verified byte-for-byte reproducible against
the current approved master). See `MASTER_BUILD.md` in the same directory
for the full spec: authoritative inputs, scene order/durations, the Scene 3
blank-intro trim guard, audio handling, validation checks, and the Scene 5 / Scene 6
integration.

## User preferences

_No explicit preferences recorded yet._

## Master v5 final rebuild (Aug 9, 2026)

The complete campaign was rebuilt with the deterministic `Final Edit/build_master_v5.sh`
pipeline using the approved revised Scene 5 and approved Scene 6 v3. The resulting
master is 56.766667s at 1080×1920, 30fps, with AAC stereo audio. The no-audio and
audio companion variants are generated alongside it.

- Master: `Final Edit/DreamPlanet_Master_v5.mp4`
- Audio variant: `Final Edit/DreamPlanet_Master_v5_audio.mp4`
- No-audio variant: `Final Edit/DreamPlanet_Master_v5_no_audio.mp4`
- QA: `Final Edit/MASTER_V5_QA.md`
- Visual QA stills: `Final Edit/qa_v5/`

Master v1–v4 delivery files were removed after verification as superseded. The approved
source scenes, deterministic build scripts, final masters, variants, and QA documentation
remain available for reproducible production rebuilds. Master v5 is locked as the production
version.
