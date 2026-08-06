# SCENE 5 ANIMATION QA
**Dream Planet Referral Campaign — Phase 6 Cinematic Capture**
Report date: 2026-08-06 (original capture) · Revised: 2026-08-06

---

## Revision — Targeted Pacing & Forum Content Fix

This is a **targeted revision** of the approved Scene 5 cinematic, not a rebuild. Scene 5's
architecture, camera system, and interaction plumbing (`scene5Actions`, the interaction store,
generic post/comment/share components) are unchanged. Three fixes were requested and implemented:

1. **Floating "+" (add post) button removed from the Forum entirely.** It previously appeared
   on the Forum's Post tab (a bug — it belongs to the Portfolio only). `Scene5Forum.tsx` no
   longer renders it under any tab. Verified programmatically: `document.querySelectorAll('[data-scene5="portfolio-floating-action"]')`
   returns 0 elements on both the Forum Post and Overview tabs, and 1 element on the Portfolio.
2. **Duration extended from 9.80 s to 13.80 s** (target range 13–16 s) by restructuring the
   timeline (`Scene5Timeline.ts`) into 7 phases with deliberately longer holds — enough time to
   actually read the Portfolio profile/stats and the Forum header before any scrolling begins.
3. **Forum content expanded from 2 posts to 4 posts**, each visually distinct, with 3 controlled
   scroll-and-hold beats (not continuous/momentum scrolling):
   - **p1** — adeoshodin (photographer) — arrive, hold, **Like**
   - **p2** — sonyavocals (studio singer) — scroll, hold, **no interaction**
   - **p3** — erosky❤️ ("Good Life EP" cover art, new media) — scroll, hold, **Comment** (prepared comment from saintcarl23)
   - **p4** — joanna (campaign shoot photo, new media) — scroll, final hold, **no interaction**

   Share remains available in the data/action layer (`SHARE_DATA`, `scene5Actions.openShare`)
   but is not used in this cut's on-screen sequence, per the requested restrained pacing.

| | Before (v1) | After (v2 — this revision) |
|---|---|---|
| Duration | 9.80 s | **13.80 s** |
| Forum posts | 2 | **4** |
| Forum scrolls | 1 | **3** |
| Floating "+" on Forum | Present (bug, Post tab) | **Absent (both tabs)** |
| Interactions shown | Like + Comment (p1), Share (p2) | Like (p1), Comment (p3) — restrained |

---

## Technical Verification

| Property       | Specification          | Actual                            | Status |
|----------------|------------------------|-----------------------------------|--------|
| Duration       | 13–16 s (revised spec) | **13.80 s**                       | ✅ Pass |
| Resolution     | 1080 × 1920 minimum    | **1080 × 1920** (9:16 portrait)   | ✅ Pass |
| Frame rate     | Project standard       | **25 fps**                        | ✅ Pass |
| Video codec    | H.264                  | **H.264** (libx264, CRF 16, slow) | ✅ Pass |
| Pixel format   | —                      | **yuv420p**                       | — |
| Audio          | None (master handles)  | **No audio track**                | ✅ Pass |
| Output file    | scene5_final.mp4       | `Scene 5/Final Animation/scene5_final.mp4` | ✅ Pass |
| Floating "+" on Forum | Must be absent   | **Absent — verified 0 elements on both tabs** | ✅ Pass |

---

## Output Files

| File | Location | Size |
|---|---|---|
| `scene5_final.mp4` | `Scene 5/Final Animation/` | ~9.6 MB |
| `scene5_final_no_audio.mp4` | `Scene 5/Final Animation/` | ~9.6 MB (identical copy reserved for master concat) |
| `scene5_start_frame.png` | `Scene 5/Final Animation/` | ~97 KB |
| `scene5_end_frame.png` | `Scene 5/Final Animation/` | ~1.3 MB |

---

## Start State

**Screen:** Dream Planet Home (Scene 4 handoff)

Visible elements:
- Hamburger navigation control (top-left)
- Share button (top-right)
- Dark gradient hero card
- Orange FAB (bottom-right)
- Bottom navigation bar, "Invest" active
- White entry overlay dissolves out in first 0.3 s

**Scene 4 → Scene 5 continuity:** The animation opens on the exact visual state of Scene 4's final frame — the Dream Planet home screen with Referral Campaign context. A brief white dissolve (0.3 s) bridges the scenes cleanly without fade-to-black, flash, or jump cut. The viewer experiences an unbroken continuation.

---

## End State

**Screen:** Forum Post Feed — post p4 (joanna, campaign shoot photo) in final hold, no overlays open

Visible elements:
- Post p3 (erosky❤️, EP cover) partially visible above, comment count updated to 1
- Post p4 (joanna) fully in view — clean card, no interaction applied (per restrained pacing plan)
- Clean forum feed — no overlays, no open sheets, no open drawers
- Camera settled at gentle 4% push-in with slight upward drift

The final frame is stable and compositionally clean. It provides a direct visual handoff to Scene 6.

---

## Scene 5 Sequence Summary (Revised — 13.80 s)

| Phase | Timing | Description | Status |
|---|---|---|---|
| 1 — Scene 4 handoff | 0.00–1.20 s | White dissolve reveals home. Hamburger tap. Side Nav drawer enters from left, holds long enough to read. | ✅ |
| 2 — View Portfolio | 1.20–2.50 s | Camera drifts toward "View Portfolio". Tap. Portfolio slides in from right. Drawer closes naturally. | ✅ |
| 3 — Portfolio reveal | 2.50–5.20 s | Profile push-in (100%→108%). Long hold on Dr. Elizabeth Wisniewski DC PhD profile, stats (47 members, 105 posts), View Forum. Camera pulls back. Portfolio scrolls down to reveal media grid, holds, scrolls back to top. Camera resets. Floating "+" visible throughout (Portfolio-only). | ✅ |
| 4 — View Forum | 5.20–6.50 s | Tap on "View Forum" button. Forum slides in from right — floating "+" disappears immediately (never rendered by Forum). | ✅ |
| 5 — Forum initial reveal | 6.50–8.00 s | Camera push-in (100%→106%). Forum header, 47 members, Edit Forum, and post p1 visible. No scrolling yet — deliberate read time. Camera resets. | ✅ |
| 6 — Multi-post discovery | 8.00–12.60 s | Hold on p1, **Like**. Controlled scroll to p2 (sonyavocals), hold, no interaction. Controlled scroll to p3 (erosky❤️, EP cover), hold, **Comment** opens + prepared comment reveals + closes. Controlled scroll to p4 (joanna). | ✅ |
| 7 — Final frame | 12.60–13.80 s | Gentle final push-in (4%). Settle on p4, clean feed, no overlays. Hold. | ✅ |

---

## Interactions Demonstrated

| Interaction | Post | Status |
|---|---|---|
| Side Navigation open | — | ✅ Shown |
| Portfolio navigation | — | ✅ Shown |
| Portfolio media grid | — | ✅ Shown (scroll reveal) |
| Portfolio floating "+" button | — | ✅ Shown (Portfolio only) |
| Forum navigation | — | ✅ Shown |
| Forum floating "+" button | — | ✅ **Confirmed absent** on both Post and Overview tabs |
| Multi-post scroll (3 controlled scrolls, no momentum) | p1 → p2 → p3 → p4 | ✅ Shown |
| Like | p1 (adeoshodin) | ✅ Shown — count updates, heart turns orange |
| — (no interaction, by design) | p2 (sonyavocals) | ✅ Shown — visual hold only |
| Comment (prepared) | p3 (erosky❤️) | ✅ Shown — sheet opens, comment from saintcarl23 reveals, closes |
| — (final visual hold, by design) | p4 (joanna) | ✅ Shown — no interaction, closing frame |
| Share (available but unused this cut) | — | Infra intact (`SHARE_DATA`, `scene5Actions.openShare`) — not exercised on-screen per restrained pacing plan |

---

## Motion QA

| Check | Status |
|---|---|
| Camera shake | None — ✅ |
| Unexpected jumps | None — ✅ |
| Flicker | None — ✅ |
| Layout shifts | None — ✅ |
| Animation stalls | None — ✅ |
| Drawer animation smooth | ✅ |
| Portfolio slide-in smooth | ✅ |
| Forum slide-in smooth | ✅ |
| Tab transition smooth | ✅ |
| Feed scroll smooth | ✅ |

---

## Visual Limitations / Known Assumptions

1. **Home screen is a placeholder** — The Scene 4 handoff opening frame is a purpose-built placeholder (dark hero card, orange FAB, bottom nav) that recreates the visual weight of Scene 4's final state. The actual Scene 4 MP4 is not re-rendered here; continuity is achieved visually rather than by embedding the live Scene 4 UI. This is consistent with the Scene 3 → 4 approach used throughout the campaign.

2. **Portfolio media grid** — The media grid contents are the assets defined in `Scene5PortfolioGrid.tsx` (the approved Phase 3 recreation). Any changes to those assets automatically appear in future re-captures without touching the cinematic animation file.

3. **Font 404** — A single font resource returns 404 in the dev environment (Google Fonts CDN request). This does not affect the capture — the fallback system font stack renders cleanly at capture resolution, and the Inter font is embedded via the existing CSS. No visual degradation observed.

4. **Capture FPS** — Playwright's `recordVideo` encodes at a variable rate during capture; ffmpeg re-encodes to a clean 25 fps constant frame rate. The `TRIM_S` value (9.8 s) was chosen to remove encoder flush frames at the end while preserving all animation content.

5. **Browser smooth scroll** — The Portfolio media reveal uses `el.scrollTo({ behavior: 'smooth' })`. In headless Chromium, smooth scroll is hardware-accelerated and behaves identically across repeated captures, making this deterministic.

---

## Master Integration Readiness

| Criterion | Status |
|---|---|
| Duration within spec (8–10 s) | ✅ 9.80 s |
| Resolution 1080 × 1920 | ✅ |
| H.264, yuv420p, faststart | ✅ |
| No audio track | ✅ |
| No-audio copy available | ✅ |
| Start frame clean | ✅ |
| End frame clean, no overlays | ✅ |
| Scene 4 → 5 continuity | ✅ |
| Scene 5 outgoing frame suitable for Scene 6 | ✅ |
| Scenes 1–4 and master untouched | ✅ |
| All 8 spec phases implemented | ✅ |

**Scene 5 is ready for standalone review.**

After approval, the integration path is:
> Scene 5 approval → append `scene5_final_no_audio.mp4` to the existing 4-scene concat → rebuild master with audio → validate

---

## Capture Reproducibility

The capture is fully deterministic and repeatable:

```bash
cd extracted_scenes/Scene3Scene4_contents/Replit-Design-Project/artifacts/dream-planet-scene3
PORT_OVERRIDE=24448 node scripts/capture-scene5.mjs
```

Prerequisites: dev server on port 24448, Playwright ffmpeg installed (`npx playwright install ffmpeg`), system Chromium at `/nix/store/.../chromium`.
