# Dream Planet Referral Campaign — Scene 3 & 4

A video production workspace for the **Dream Planet Referral Campaign**, containing:

- **Scenes 1 & 2**: ✅ Complete — locked final `.mp4` files (in `extracted_scenes/Scene1scene2_contents/`)
- **Scene 3 animation**: ✅ Complete — 14.14s cinematic journey: Referral Home → View Levels → Leaderboard (v3 readability pass — timing only)
- **Scene 4 animation**: ✅ Complete — 9.0s deeper discovery: Leaderboard → Levels → Referral Home CTA (captured, locked)
- **Master video**: ✅ Complete — all 4 scenes stitched, 24.5s total (with audio + visual review variants)
- **Referral Module UI**: Locked React/TypeScript app (pixel reference, do not modify)

## Running the project

The workspace is a pnpm monorepo. Install dependencies first:

```sh
cd extracted_scenes/Scene3Scene4_contents/Replit-Design-Project
pnpm install
```

**Scene 3 + 4 animation preview** (port 24448, `/dream-planet-scene3/`):
```sh
pnpm --filter @workspace/dream-planet-scene3 run dev
```

The preview loops Scene 3 (14.14s — v3) then Scene 4 (9.0s) continuously at 1080×1920.

**Referral Module UI** (for reference):
```sh
pnpm --filter @workspace/dream-planet-referral run dev
```

## Capturing MP4 exports

Both Scene 3 and Scene 4 are captured with Playwright using the system Chromium (Nix).

Prerequisites:
- Dev server running on port 24448 (above)
- System Chromium installed (done — `pkgs.chromium` in replit.nix)
- ffmpeg installed (done — `pkgs.ffmpeg` in replit.nix)

Run from inside `artifacts/dream-planet-scene3/`:

```sh
PORT_OVERRIDE=24448 node scripts/capture-scene3-system.mjs
```

This produces:
| File | Location |
|------|----------|
| `scene3_final.mp4` | `Scene1scene2_contents/…/Scene 3/Final Animation/` |
| `scene4_final.mp4` | `Scene1scene2_contents/…/Scene 4/Final Animation/` |
| `DreamPlanet_Master_v1.mp4` | `Scene1scene2_contents/…/Final Edit/` |

**Current output:**

| File | Duration | Status | Notes |
|------|----------|--------|-------|
| `scene3_final.mp4` | 14.16s | ✅ Current | Scene 3 v3, 1080×1920, H.264 CRF16 |
| `scene4_final.mp4` | 9.0s | ✅ Current | Scene 4, 1080×1920, H.264 CRF16 |
| `DreamPlanet_Master_v1.mp4` | 24.5s | ⚠️ Stale | Built with S3 v2 (11.84s) — rebuild needed |
| `DreamPlanet_Master_v1_audio.mp4` | 24.5s | ⚠️ Stale | Rebuild needed |
| `DreamPlanet_Master_v1_VisualReview.mp4` | 24.5s | ⚠️ Stale | Rebuild needed |

> **To rebuild the master:** run `build_master.sh` in `Scene1scene2_contents/…/Final Edit/` after Scene 3 update.

## Scene 3 animation — what's built

All 8 phases are implemented in Framer Motion (v3 — 14.14s readability pass):

| Phase | Time | Description |
|-------|------|-------------|
| 1 Entry | 0.0–0.5s | White overlay dissolves out (Scene 2 handoff) |
| 2 Reveal | 0.5–1.7s | Referral Home rises in: fade + scale settle |
| 3 Push-in | 1.7–4.2s | Slow camera push toward referral code (+0.5s) |
| 4 Code Emphasis | 4.2–4.9s | Code card breathes: soft 1.028× pulse |
| 4b Levels Tease | 4.9–5.4s | "View Levels" link draws the eye |
| 5 Tap → Levels | 5.4–7.2s | Tap ripple + iOS-style push to Levels page |
| 6 Levels | 7.2–9.2s | Stagger reveal + camera push-in (+0.6s) |
| 7 Tap → Leaderboard | 9.2–10.3s | Tap ripple + iOS-style push to Leaderboard |
| 8 Leaderboard | 10.3–14.14s | Reveal + push-in + extended hold (+1.2s) |

## Scene 4 animation — what's built

All 8 phases are implemented in Framer Motion:

| Phase | Time | Description |
|-------|------|-------------|
| 1 Open | 0.0–0.6s | Leaderboard — inherits Scene 3 end frame |
| 2 Push-in | 0.6–2.2s | Camera push toward podium top-3 |
| 3 Tap Levels | 2.2–3.2s | Tap "View Levels" → Levels page |
| 4 Levels reveal | 3.2–4.8s | Levels reveal + Bronze push-in |
| 5 Bronze emphasis | 4.8–5.8s | Bronze "$40" reward pulse |
| 6 Pull-back | 5.8–7.0s | Camera pull-back: Silver & Gold tease |
| 7 Tap → Home | 7.0–8.0s | Tap back → Referral Home |
| 8 CTA hold | 8.0–9.0s | Referral code emphasis + hold |

## Key files

- `artifacts/dream-planet-scene3/src/components/scene3/Scene3Timeline.ts` — Scene 3 timing constants
- `artifacts/dream-planet-scene3/src/components/scene3/Scene3ReferralAnimation.tsx` — Scene 3 orchestrator
- `artifacts/dream-planet-scene3/src/components/scene4/Scene4Timeline.ts` — Scene 4 timing constants
- `artifacts/dream-planet-scene3/src/components/scene4/Scene4ReferralAnimation.tsx` — Scene 4 orchestrator
- `artifacts/dream-planet-scene3/src/components/video/VideoTemplate.tsx` — loops both scenes
- `artifacts/dream-planet-scene3/scripts/capture-scene3-system.mjs` — Playwright capture script

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React 19 + Framer Motion (animation)
- Tailwind CSS v4 + Inter font
- Vite build
- Playwright (capture) + ffmpeg (MP4 encode)

## Key constraints

- The Dream Planet Referral Module UI is **locked** — do not change layout, colors, typography, or assets
- Referral code must remain: `IK54OTRD`
- Referral URL must remain: `https://dreamplanet.org/referral/IK54OTRD`
- Scene 3 logic lives under `artifacts/dream-planet-scene3/src/components/scene3/`
- Scene 4 logic lives under `artifacts/dream-planet-scene3/src/components/scene4/`

## Assets

All shared assets live in `extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/attached_assets/`:
- 4 memoji avatar PNGs (used in hero cluster)
- Dream Planet official logo PNGs
- Badge PNGs: Bronze, Silver, Gold
- Profile photo PNGs (leaderboard users)
- AI music track: `Ai_music_for_dream_planet_video__1785842118219.mp3`
- Scene 1+2 reference: `extracted_scenes/Scene1scene2_contents/Dre-animation/Dream Planet Referral Campaign/`

## System dependencies (replit.nix)

Required for Playwright Chromium capture:
`nspr`, `nss`, `atk`, `at-spi2-atk`, `dbus`, `xorg.libX11` and related X11 libs, `mesa`, `expat`, `libxkbcommon`, `alsa-lib`, `at-spi2-core`, `pango`, `cairo`, `cups`, `libdrm`, `systemd`, `chromium`, `ffmpeg`

## User preferences

_No explicit preferences recorded yet._
