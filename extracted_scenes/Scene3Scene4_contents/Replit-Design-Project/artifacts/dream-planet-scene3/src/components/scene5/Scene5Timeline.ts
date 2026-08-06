/**
 * Scene5Timeline.ts
 *
 * Phase 6 — Single source of truth for Scene 5 cinematic timing (~10.0s).
 *
 * Journey:
 *   Scene 4 handoff → Side Navigation → Portfolio (profile + media)
 *   → Forum → Community scroll → Overview beat → Engagement → Final frame
 *
 * All values are in SECONDS unless the property name ends in _MS.
 * Adjust values here only — do not hardcode durations in UI components.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Phase 1  (0.00–0.70s)  Scene 4 handoff → Side Nav opens   │
 * │  Phase 2  (0.70–1.40s)  View Portfolio tap → Portfolio in   │
 * │  Phase 3  (1.40–3.00s)  Portfolio reveal (profile + media)  │
 * │  Phase 4  (3.00–3.80s)  View Forum tap → Forum enters       │
 * │  Phase 5  (3.80–4.80s)  Forum header + first post           │
 * │  Phase 6  (4.80–6.40s)  Community discovery scroll          │
 * │  Phase 6b (6.40–7.20s)  Forum Overview beat (optional)      │
 * │  Phase 7  (7.20–8.80s)  Engagement: Like + Comment + Share  │
 * │  Phase 8  (8.80–10.0s)  Final frame — settle + hold         │
 * └─────────────────────────────────────────────────────────────┘
 */

export const S5 = {
  TOTAL: 10.0,

  // ── Phase 1: Scene 4 handoff → Side Navigation ────────────────────────────
  /** White entry overlay dissolve duration */
  ENTRY_DISSOLVE_DURATION: 0.30,
  /** When to show the hamburger tap ripple */
  TAP_HAMBURGER: 0.25,
  /** When to open the Side Navigation drawer */
  OPEN_SIDE_NAV: 0.45,
  /** Drawer fully open and held */
  SIDE_NAV_HOLD: 0.70,

  // ── Phase 2: Side Navigation → Portfolio ──────────────────────────────────
  /** Camera subtly drifts toward "View Portfolio" */
  CAMERA_TOWARD_PORTFOLIO: 0.80,
  /** Tap ripple on View Portfolio */
  TAP_VIEW_PORTFOLIO: 1.05,
  /** Dispatch openPortfolio — drawer closes, Portfolio slides in */
  OPEN_PORTFOLIO: 1.25,

  // ── Phase 3: Portfolio reveal — profile + media grid ──────────────────────
  /** Portfolio mounted — start cinematic profile push */
  PORTFOLIO_REVEAL_START: 1.45,
  /** Duration of the portfolio push-in: 100% → 108% (profile focus) */
  PORTFOLIO_PUSH_DURATION: 0.90,
  /** Hold on profile/stats/View Forum */
  PORTFOLIO_PROFILE_HOLD: 2.35,
  /** Scroll portfolio down to reveal media grid */
  PORTFOLIO_SCROLL_DOWN: 2.45,
  /** Pull camera back while grid is visible */
  PORTFOLIO_MEDIA_HOLD: 2.80,
  /** Scroll back to top (View Forum back in frame) */
  PORTFOLIO_SCROLL_UP: 2.85,
  /** Camera reset before View Forum tap */
  CAMERA_RESET_START: 2.90,
  CAMERA_RESET_DURATION: 0.20,

  // ── Phase 4: View Forum tap → Forum ───────────────────────────────────────
  /** Tap ripple on View Forum button */
  TAP_VIEW_FORUM: 3.10,
  /** Dispatch openForum */
  OPEN_FORUM: 3.25,
  /** Forum fully mounted and visible */
  FORUM_ENTER: 3.80,

  // ── Phase 5: Forum reveal ──────────────────────────────────────────────────
  /** Camera push on Forum entry: 100% → 106% */
  FORUM_PUSH_START: 3.90,
  FORUM_PUSH_DURATION: 0.75,
  /** Camera hold at 106% */
  FORUM_HOLD: 4.65,
  /** Reset camera before scroll */
  FORUM_CAMERA_RESET: 4.80,

  // ── Phase 6: Community discovery / feed scroll ────────────────────────────
  /** Scroll to hero post 1 */
  SCROLL_TO_P1: 4.90,
  /** Hold on post 1 */
  P1_HOLD: 5.50,
  /** Scroll down to reveal post 2 */
  SCROLL_TO_P2: 5.65,
  /** Hold on post 2 */
  P2_HOLD: 6.30,
  /** Scroll back toward post 1 before Overview */
  SCROLL_BACK_TO_P1: 6.40,

  // ── Phase 6b: Forum Overview beat (optional) ──────────────────────────────
  /** Switch to Forum Overview tab */
  SWITCH_TO_OVERVIEW: 6.50,
  /** Hold on Overview */
  OVERVIEW_HOLD: 6.90,
  /** Switch back to Post Feed */
  SWITCH_BACK_TO_POST: 7.10,
  /** Settle back on Post Feed */
  POST_FEED_SETTLE: 7.20,

  // ── Phase 7: Community engagement ────────────────────────────────────────
  /** Like post 1 */
  LIKE_P1: 7.35,
  /** Open comments for post 1 */
  OPEN_COMMENTS_P1: 7.70,
  /** Show prepared comment */
  SHOW_COMMENT: 8.00,
  /** Close comments + scroll to p2 for share */
  CLOSE_COMMENTS: 8.25,
  /** Open share panel on post 2 */
  OPEN_SHARE_P2: 8.50,
  /** Confirm share ("Link Copied") */
  CONFIRM_SHARE_P2: 8.65,
  /** Close share panel */
  CLOSE_SHARE: 8.80,

  // ── Phase 8: Final frame ──────────────────────────────────────────────────
  /** Gentle final camera push toward forum feed */
  FINAL_PUSH_START: 8.85,
  FINAL_PUSH_DURATION: 0.40,
  /** Hold the final composed frame */
  FINAL_HOLD_START: 9.25,
  END_START: 9.70,
  END_DURATION: 0.30,
} as const;

/** Total Scene 5 duration in ms — consumed by capture scripts */
export const S5_DURATION_MS = S5.TOTAL * 1000;

/**
 * Convert a scene-relative time (seconds) to a delay from animation start (ms).
 * This is the canonical way to translate timeline constants into setTimeout calls.
 */
export const s5t = (seconds: number): number => Math.round(seconds * 1000);
