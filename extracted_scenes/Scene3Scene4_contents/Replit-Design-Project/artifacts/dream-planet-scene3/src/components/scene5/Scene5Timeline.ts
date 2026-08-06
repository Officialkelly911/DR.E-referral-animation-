/**
 * Scene5Timeline.ts
 *
 * Phase 6 — Timing constants for Scene 5 cinematic animation (~9.5s).
 * Single source of truth — do not hardcode durations elsewhere.
 *
 * Journey:
 *   Scene 4 handoff → Side Navigation → Portfolio → Forum → Community
 *
 * All values are in seconds unless the property name ends in _MS.
 * All values are in seconds unless the property name ends in _MS.
 *
 *   Phase 1  (0.00–0.70s)  Scene 4 handoff → Side Nav opens
 *   Phase 2  (0.70–1.40s)  View Portfolio tap → Portfolio enter
 *   Phase 3  (1.40–2.70s)  Portfolio reveal — profile + push-in
 *   Phase 4  (2.70–3.50s)  View Forum tap → Forum enter
 *   Phase 5  (3.50–4.50s)  Forum reveal — header + first post
 *   Phase 6  (4.50–6.50s)  Community discovery — feed scroll
 *   Phase 7  (6.50–8.20s)  Community engagement — Like + Comment
 *   Phase 8  (8.20–9.50s)  Final community frame — settle + hold
 */

export const S5 = {
  TOTAL: 9.5,

  // ── Phase 1: Scene 4 handoff → Side Navigation ────────────────────────────
  /** White entry overlay dissolve duration */
  ENTRY_DISSOLVE_DURATION: 0.3,
  /** When to show the hamburger tap ripple */
  TAP_HAMBURGER: 0.25,
  /** When to open the Side Navigation drawer */
  OPEN_SIDE_NAV: 0.45,
  /** Drawer fully open and held */
  SIDE_NAV_HOLD: 0.70,

  // ── Phase 2: Side Navigation → Portfolio ──────────────────────────────────
  /** Camera subtly drifts toward View Portfolio */
  CAMERA_TOWARD_PORTFOLIO: 0.80,
  /** Tap ripple on View Portfolio */
  TAP_VIEW_PORTFOLIO: 1.05,
  /** Dispatch openPortfolio — drawer closes, Portfolio enters */
  OPEN_PORTFOLIO: 1.25,

  // ── Phase 3: Portfolio reveal ──────────────────────────────────────────────
  /** Portfolio is visible — start cinematic push */
  PORTFOLIO_REVEAL_START: 1.40,
  /** Duration of the portfolio push-in: 100% → 108% */
  PORTFOLIO_PUSH_DURATION: 1.20,
  /** Camera returns to 100% before View Forum tap */
  CAMERA_RESET_START: 2.55,
  CAMERA_RESET_DURATION: 0.25,

  // ── Phase 4: View Forum tap → Forum ───────────────────────────────────────
  /** Tap ripple on View Forum button */
  TAP_VIEW_FORUM: 2.80,
  /** Dispatch openForum */
  OPEN_FORUM: 3.00,
  /** Forum is now mounted and visible */
  FORUM_ENTER: 3.50,

  // ── Phase 5: Forum reveal ──────────────────────────────────────────────────
  /** Camera push on Forum entry: 100% → 106% */
  FORUM_PUSH_START: 3.60,
  FORUM_PUSH_DURATION: 0.80,
  /** Camera hold at 106% */
  FORUM_HOLD: 4.40,
  /** Reset camera before scroll */
  FORUM_CAMERA_RESET: 4.50,

  // ── Phase 6: Community discovery / feed scroll ────────────────────────────
  /** Scroll to hero post 1 */
  SCROLL_TO_P1: 4.60,
  /** Brief hold on post 1 */
  P1_HOLD: 5.30,
  /** Scroll down to reveal post 2 */
  SCROLL_TO_P2: 5.50,
  /** Hold on post 2 */
  P2_HOLD: 6.30,
  /** Scroll back toward post 1 for engagement */
  SCROLL_BACK_TO_P1: 6.50,

  // ── Phase 7: Community engagement ────────────────────────────────────────
  /** Like post 1 */
  LIKE_P1: 6.80,
  /** Open comments for post 1 */
  OPEN_COMMENTS_P1: 7.20,
  /** Show prepared comment */
  SHOW_COMMENT: 7.60,
  /** Close comments */
  CLOSE_COMMENTS: 8.00,

  // ── Phase 8: Final frame ──────────────────────────────────────────────────
  /** Gentle final camera push toward feed */
  FINAL_PUSH_START: 8.20,
  FINAL_PUSH_DURATION: 0.60,
  /** Hold the final composed frame */
  FINAL_HOLD_START: 8.80,
  END_START: 9.30,
  END_DURATION: 0.20,
} as const;

/** Total Scene 5 duration in ms — consumed by capture scripts */
export const S5_DURATION_MS = S5.TOTAL * 1000;

/** Convert a scene-relative time (seconds) to a delay from animation start (ms) */
export const s5t = (seconds: number): number => Math.round(seconds * 1000);
