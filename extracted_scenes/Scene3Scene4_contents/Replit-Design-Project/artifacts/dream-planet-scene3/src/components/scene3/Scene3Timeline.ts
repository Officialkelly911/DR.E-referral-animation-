/**
 * Scene3Timeline.ts
 * Timing constants for the full Scene 3 cinematic sequence (all values in seconds).
 * Single source of truth — do not hardcode durations elsewhere.
 *
 * Full journey: Referral Home → View Levels → Leaderboard
 */

export const S3 = {
  TOTAL: 9.5,

  // Phase 1 — Entry: white overlay dissolves (continuation from Scene 2)
  ENTRY_DURATION: 0.4,

  // Phase 2 — Referral Home reveal: UI rises from below
  HOME_REVEAL_START: 0.4,
  HOME_REVEAL_DURATION: 1.0,

  // Phase 3 — Home camera push-in: 100% → 106% toward referral code
  HOME_PUSH_START: 1.4,
  HOME_PUSH_DURATION: 1.6,

  // Phase 4 — Referral code emphasis: card breathes
  CODE_EMPHASIS_START: 3.0,
  CODE_EMPHASIS_DURATION: 0.6,

  // Phase 4b — View Levels tease: link pulses
  LEVELS_TEASE_START: 3.6,
  LEVELS_TEASE_DURATION: 0.4,

  // Phase 5 — Tap "View Levels" ripple + camera resets
  TAP_LEVELS_START: 4.0,
  CAMERA_RESET_DURATION: 0.35,
  TAP_DURATION: 0.5,

  // Page transition: Home → Levels (iOS-style horizontal push)
  TRANSITION_TO_LEVELS_START: 4.5,
  TRANSITION_DURATION: 0.45,

  // Phase 6 — Levels page content stagger reveal
  LEVELS_REVEAL_START: 4.95,
  LEVELS_REVEAL_DURATION: 0.5,

  // Phase 6b — Levels camera push-in
  LEVELS_PUSH_START: 5.45,
  LEVELS_PUSH_DURATION: 1.2,

  // Phase 7 — Tap "Leaderboard" header button ripple + camera resets
  TAP_LEADERBOARD_START: 6.65,

  // Page transition: Levels → Leaderboard
  TRANSITION_TO_LEADERBOARD_START: 7.1,

  // Phase 8 — Leaderboard reveal + push-in + hold
  LEADERBOARD_REVEAL_START: 7.55,
  LEADERBOARD_REVEAL_DURATION: 0.5,
  LEADERBOARD_PUSH_START: 8.05,
  LEADERBOARD_PUSH_DURATION: 1.0,

  // End frame — clean hold, ready for Scene 4
  END_START: 9.05,
  END_DURATION: 0.45,
} as const;

/** Total duration in ms — consumed by useVideoPlayer */
export const S3_DURATION_MS = S3.TOTAL * 1000;
