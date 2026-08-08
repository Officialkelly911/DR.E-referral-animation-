# Scene 6 Final v3 QA Report

**Scene:** Join the Dream Planet Movement  
**Revision:** Replace penultimate Community Forum summary with Notifications  
**Status:** ✅ PASSED — standalone candidate ready for creative review  
**Master v3 integration:** Not performed by design

## Deliverables

| File | Location | Status |
|---|---|---|
| `scene6_final_v3.mp4` | `scene6/revision_v3/` | ✅ |
| `scene6_final_v3_no_audio.mp4` | `scene6/revision_v3/` | ✅ |
| `scene6_start_frame.png` | `scene6/revision_v3/` | ✅ |
| `scene6_end_frame.png` | `scene6/revision_v3/` | ✅ |

The same v3 video files are mirrored in `scene6/renders/` and the campaign
`Scene 6/Final Animation/` directory with the `v3` suffix. Existing approved
Scene 6 files were not overwritten.

## Technical Specifications

| Property | Result | Status |
|---|---:|---|
| Resolution | 1080 × 1920 | ✅ |
| Duration | 15.480s | ✅ |
| Frame rate | 25 fps capture | ✅ |
| Codec | H.264 / libx264 CRF 16 | ✅ |
| Pixel format | yuv420p | ✅ |
| Audio | None — music is added at master stage | ✅ |
| No-audio mirror | SHA-256 identical to video deliverable | ✅ |

## Revision Acceptance Checks

| Check | Result |
|---|---|
| Community Forum removed from the penultimate position | ✅ |
| Notifications screen appears immediately before CTA transition | ✅ |
| Notifications is a complete screen replacement, not an overlay on Forum | ✅ |
| Light/white interface matches supplied reference | ✅ |
| Header reads `Notification` with back button in reference position | ✅ |
| Orange notification icons and clean dividers are present | ✅ |
| `New` badge is present on the first notification | ✅ |
| Connected activity copy is readable | ✅ |
| Notification rows use consistent spacing and row rhythm | ✅ |
| Sidebar shows Home Feed behind it | ✅ Preserved in `Scene6Sidebar` / `Scene6HomeFeed` |
| CTA remains intact | ✅ Existing premium CTA unchanged |
| CTA follows Notifications with a deliberate crossfade | ✅ |
| No changes made to Scenes 1–5 | ✅ |
| Master v3 was not rebuilt or integrated | ✅ |

## Notification Copy Verified

The rendered screen includes activity connected to the preceding Scene 6
journey:

- `benjamin` commented: “Glasses look good on your Post” — `14hrs ago`
- `benjamin` liked your post — `14hrs ago`
- `@creativewave` hit 10k referrals this month — `14hrs ago`
- `Creativewave` liked your post — `14hrs ago`
- `jose` liked your post — `14hrs ago`
- `@Luna.creates` shared referral-network tips — `14hrs ago`
- `@Marcus.dp` unlocked the Community Leader badge — `14hrs ago`
- `@Queenportia` reached Gold tier — `1d ago`

## Motion QA

The notifications are implemented in `Scene6Notifications.tsx` as the
dedicated replacement screen. The list uses one compositor-friendly
`translate3d`/Framer Motion tween with no mid-scroll state changes, snapping,
or repeated layout updates. The revised timeline starts the gentle scroll at
`8.0s` and leaves the screen readable before the CTA handoff at `9.94s`.

Frame checks were captured at 6.8s, 7.2s, 8.2s, 9.0s, 9.5s, 10.0s, and 13.4s:

- ✅ Notification screen is visible and readable at 6.8–9.0s.
- ✅ Rows move continuously upward without a jump between sampled frames.
- ✅ The 9.5s sample shows a smooth Notifications → CTA crossfade.
- ✅ The 10.0s sample shows the existing CTA beginning without a forum frame.
- ✅ The 13.4s sample shows the CTA composition before its final fade.

## Source and Verification

Source changes are isolated to:

- `artifacts/dream-planet-scene3/src/components/scene6/Scene6Notifications.tsx`
- `artifacts/dream-planet-scene3/src/components/scene6/Scene6Timeline.ts`
- `artifacts/dream-planet-scene3/scripts/capture-scene6.mjs`

Verification completed:

- ✅ `pnpm --filter @workspace/dream-planet-scene3 run typecheck`
- ✅ `pnpm --filter @workspace/dream-planet-scene3 run build`
- ✅ Fresh Playwright + Chromium + ffmpeg capture
- ✅ `ffprobe` confirms 1080 × 1920, 25 fps, 15.480s, H.264, yuv420p
- ✅ Video and no-audio mirror hashes match

## Stop Condition

Scene 6 v3 is ready for creative review as a standalone candidate.
Do not integrate it into Master v3 until the Notifications replacement is
approved.