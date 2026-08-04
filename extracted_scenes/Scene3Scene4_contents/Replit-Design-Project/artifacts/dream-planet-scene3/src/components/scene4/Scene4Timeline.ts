/**
 * Scene4Timeline.ts
 * Timing constants for Scene 4 — Deeper Referral Discovery (~9.0s)
 * Single source of truth — do not hardcode durations elsewhere.
 *
 * Journey: Leaderboard → View Levels → Referral Home (CTA)
 */

export const S4 = {
  TOTAL: 9.0,

  // Phase 1 — Open on Leaderboard (inherit Scene 3 end)
  LEADERBOARD_OPEN_DURATION: 0.6,

  // Phase 2 — Leaderboard push-in toward podium
  LEADERBOARD_PUSH_START: 0.6,
  LEADERBOARD_PUSH_DURATION: 1.6,

  // Phase 3 — Tap "View Levels" + camera reset
  TAP_LEVELS_START: 2.2,
  CAMERA_RESET_DURATION: 0.35,
  TAP_DURATION: 0.5,

  // Page transition: Leaderboard → Levels (iOS reverse push)
  TRANSITION_TO_LEVELS_START: 2.7,
  TRANSITION_DURATION: 0.45,

  // Phase 4 — Levels reveal + camera push toward Bronze card
  LEVELS_REVEAL_START: 3.15,
  LEVELS_REVEAL_DURATION: 0.5,
  LEVELS_PUSH_START: 3.65,
  LEVELS_PUSH_DURATION: 1.15,

  // Phase 5 — Bronze reward "$40" emphasis pulse
  BRONZE_EMPHASIS_START: 4.8,
  BRONZE_EMPHASIS_DURATION: 0.7,

  // Phase 6 — Camera pull-back: Silver & Gold tease
  PULLBACK_START: 5.8,
  PULLBACK_DURATION: 1.2,

  // Phase 7 — Tap back → Referral Home
  TAP_HOME_START: 7.0,
  TRANSITION_TO_HOME_START: 7.45,

  // Phase 8 — Referral Home + referral code CTA
  HOME_ENTER_START: 7.9,
  CODE_EMPHASIS_START: 8.3,
  CODE_EMPHASIS_DURATION: 0.5,
  END_START: 8.5,
  END_DURATION: 0.5,
} as const;

/** Total Scene 4 duration in ms — consumed by useVideoPlayer */
export const S4_DURATION_MS = S4.TOTAL * 1000;
