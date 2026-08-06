/**
 * Scene5Timeline.ts
 *
 * Targeted revision — Single source of truth for Scene 5 cinematic timing (~14.0s).
 *
 * This is a pacing revision, not a rebuild. The journey and architecture are
 * unchanged; every phase simply gets more breathing room, and the Forum
 * community-discovery beat is expanded from 1 post / 1 scroll to 4 posts /
 * 3 scrolls so the Forum reads as an active community rather than a rushed
 * UI demo.
 *
 * Journey:
 *   Scene 4 handoff → Side Navigation → Portfolio (profile + media)
 *   → Forum → Multi-post community discovery → Engagement → Final frame
 *
 * All values are in SECONDS unless the property name ends in _MS.
 * Adjust values here only — do not hardcode durations in UI components.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  Phase 1  (0.00–1.20s)   Scene 4 handoff → Side Nav opens        │
 * │  Phase 2  (1.20–2.50s)   Select "View Portfolio" → Portfolio in  │
 * │  Phase 3  (2.50–5.20s)   Portfolio reveal (profile + stats+media)│
 * │  Phase 4  (5.20–6.50s)   "View Forum" tap → Forum enters         │
 * │  Phase 5  (6.50–8.00s)   Forum initial reveal (header + post 1)  │
 * │  Phase 6  (8.00–12.60s)  Multi-post community discovery (p1-p4)  │
 * │  Phase 7  (12.60–14.0s)  Final frame — settle + hold             │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * Revision history
 * ────────────────
 * v1 (10.0s): initial cinematic capture — 2 forum posts, 1 scroll, both
 *   Like+Comment and Share landed on the same beat. Floating "+" button
 *   incorrectly also rendered on the Forum's Post tab.
 * v2 (14.0s) — THIS VERSION: extended to 13-16s target per review notes.
 *   Floating "+" removed from Forum entirely (Portfolio-only). Forum feed
 *   expanded to 4 distinct posts with 3 deliberate scroll-and-hold beats.
 *   Interactions made restrained/per-post: Like on p1, no interaction on
 *   p2, Comment on p3, final visual hold on p4 (no Share beat — kept
 *   available in the data/action layer, just not used in this cut).
 */

export const S5 = {
  TOTAL: 14.0,

  // ── Phase 1: Scene 4 handoff → Side Navigation (0.00–1.20s) ───────────────
  /** White entry overlay dissolve duration */
  ENTRY_DISSOLVE_DURATION: 0.30,
  /** When to show the hamburger tap ripple */
  TAP_HAMBURGER: 0.35,
  /** When to open the Side Navigation drawer */
  OPEN_SIDE_NAV: 0.55,
  /** Drawer fully open and held — long enough to recognize the menu + profile */
  SIDE_NAV_HOLD: 1.20,

  // ── Phase 2: Side Navigation → Portfolio (1.20–2.50s) ──────────────────────
  /** Camera subtly drifts toward "View Portfolio" */
  CAMERA_TOWARD_PORTFOLIO: 1.35,
  /** Tap ripple on View Portfolio */
  TAP_VIEW_PORTFOLIO: 1.75,
  /** Dispatch openPortfolio — drawer closes, Portfolio slides in */
  OPEN_PORTFOLIO: 2.05,
  /** Portfolio slide-in transition complete */
  PORTFOLIO_ENTER: 2.50,

  // ── Phase 3: Portfolio reveal — profile + stats + media (2.50–5.20s) ───────
  /** Duration of the portfolio push-in: 100% → 108% (profile focus) */
  PORTFOLIO_PUSH_DURATION: 0.80,
  /** Hold on profile / stats / "View Forum" — enough time to actually read it */
  PORTFOLIO_PROFILE_HOLD: 3.60,
  /** Scroll portfolio down to reveal the media grid (2-3 tiles) */
  PORTFOLIO_SCROLL_DOWN: 3.75,
  /** Hold on the media grid */
  PORTFOLIO_MEDIA_HOLD: 4.45,
  /** Scroll back to top ("View Forum" back in frame) */
  PORTFOLIO_SCROLL_UP: 4.60,
  /** Camera reset before View Forum tap */
  CAMERA_RESET_START: 4.85,
  CAMERA_RESET_DURATION: 0.20,

  // ── Phase 4: "View Forum" tap → Forum (5.20–6.50s) ─────────────────────────
  /** Tap ripple on View Forum button */
  TAP_VIEW_FORUM: 5.35,
  /** Dispatch openForum */
  OPEN_FORUM: 5.55,
  /** Forum fully mounted and visible — Portfolio's floating "+" is gone by now */
  FORUM_ENTER: 6.10,

  // ── Phase 5: Forum initial reveal (6.50–8.00s) ─────────────────────────────
  /** Camera push on Forum entry: 100% → 106% */
  FORUM_PUSH_START: 6.20,
  FORUM_PUSH_DURATION: 0.75,
  /** Camera hold at 106% — read the header, member count, and first post */
  FORUM_HOLD: 7.35,
  /** Reset camera before the discovery scroll sequence begins */
  FORUM_CAMERA_RESET: 7.65,

  // ── Phase 6: Multi-post community discovery (8.00–12.60s) ─────────────────
  // 4 distinct posts, 3 deliberate scroll-and-hold beats. Restrained
  // interaction pacing: Like (p1) → nothing (p2) → Comment (p3) → final
  // hold (p4). No continuous/momentum scrolling — every scroll settles.
  /** Post 1 is already in view on Forum entry — hold + Like */
  P1_HOLD_START: 8.00,
  LIKE_P1: 8.55,
  /** Scroll to post 2 */
  SCROLL_TO_P2: 9.00,
  P2_HOLD_START: 9.00,
  /** Scroll to post 3 */
  SCROLL_TO_P3: 9.95,
  P3_HOLD_START: 9.95,
  /** Comment interaction on post 3 */
  OPEN_COMMENTS_P3: 10.45,
  SHOW_COMMENT_P3: 10.75,
  CLOSE_COMMENTS_P3: 11.10,
  /** Scroll to post 4 (final post) */
  SCROLL_TO_P4: 11.30,
  P4_HOLD_START: 11.30,

  // ── Phase 7: Final frame — settle + hold (12.60–14.0s) ─────────────────────
  /** Gentle final camera push toward the settled forum feed */
  FINAL_PUSH_START: 12.60,
  FINAL_PUSH_DURATION: 0.40,
  /** Hold the final composed frame until capture ends */
  FINAL_HOLD_START: 13.00,
  END_START: 13.70,
  END_DURATION: 0.30,
} as const;

/** Total Scene 5 duration in ms — consumed by capture scripts */
export const S5_DURATION_MS = S5.TOTAL * 1000;

/**
 * Convert a scene-relative time (seconds) to a delay from animation start (ms).
 * This is the canonical way to translate timeline constants into setTimeout calls.
 */
export const s5t = (seconds: number): number => Math.round(seconds * 1000);
