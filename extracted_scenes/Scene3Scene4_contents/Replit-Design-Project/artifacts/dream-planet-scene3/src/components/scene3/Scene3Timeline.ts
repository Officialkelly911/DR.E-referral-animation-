/**
 * Scene3Timeline.ts
 * Timing constants for the full Scene 3 cinematic sequence (all values in seconds).
 * Single source of truth — do not hardcode durations elsewhere.
 *
 * Full journey: Referral Home → View Levels → Leaderboard
 *
 * Revision history
 * ────────────────
 * v1 (9.5s): initial cinematic capture — tight pacing.
 * v2 (11.84s): targeted pacing revision (+24.6%).
 *   Most added time went to: Home first reveal (+0.4s push + 0.1s entry),
 *   View Levels dwell (+0.4s push + 0.1s tap + 0.1s stagger), and
 *   Leaderboard final hold (+0.55s).
 * v3 (14.14s): readability pass (+19.4% from v2).
 *   No UI, layout, transition, or asset changes — timing only.
 *   Added time distribution:
 *     Home push-in          +0.5s  (2.0 → 2.5s)  — more time to read referral code
 *     View Levels stagger   +0.2s  (0.5 → 0.7s)  — content settles before camera moves
 *     Levels camera push    +0.4s  (1.6 → 2.0s)  — more time on Levels page
 *     Leaderboard stagger   +0.2s  (0.5 → 0.7s)  — podium settles before camera moves
 *     End hold              +1.0s  (1.0 → 2.0s)  — Leaderboard final read time
 */

export const S3 = {
  TOTAL: 14.14,

  // Phase 1 — Entry: white overlay dissolves (continuation from Scene 2)
  ENTRY_DURATION: 0.5,

  // Phase 2 — Referral Home reveal: UI rises from below
  HOME_REVEAL_START: 0.5,
  HOME_REVEAL_DURATION: 1.2,

  // Phase 3 — Home camera push-in: 100% → 106% toward referral code
  HOME_PUSH_START: 1.7,
  HOME_PUSH_DURATION: 2.5,           // was 2.0 (+0.5s)

  // Phase 4 — Referral code emphasis: card breathes
  CODE_EMPHASIS_START: 4.2,          // was 3.7
  CODE_EMPHASIS_DURATION: 0.7,

  // Phase 4b — View Levels tease: link pulses
  LEVELS_TEASE_START: 4.9,           // was 4.4
  LEVELS_TEASE_DURATION: 0.5,

  // Phase 5 — Tap "View Levels" ripple + camera resets
  TAP_LEVELS_START: 5.4,             // was 4.9
  CAMERA_RESET_DURATION: 0.35,
  TAP_DURATION: 0.6,

  // Page transition: Home → Levels (iOS-style horizontal push)
  TRANSITION_TO_LEVELS_START: 6.0,   // was 5.5
  TRANSITION_DURATION: 0.45,

  // Phase 6 — Levels page content stagger reveal
  LEVELS_REVEAL_START: 6.52,         // was 6.02
  LEVELS_REVEAL_DURATION: 0.5,

  // Phase 6b — Levels camera push-in (stagger settle +0.2s before push)
  LEVELS_PUSH_START: 7.22,           // was 6.52 (+0.2s stagger settle)
  LEVELS_PUSH_DURATION: 2.0,         // was 1.6 (+0.4s)

  // Phase 7 — Tap "Leaderboard" header button ripple + camera resets
  TAP_LEADERBOARD_START: 9.22,       // was 8.12

  // Page transition: Levels → Leaderboard
  TRANSITION_TO_LEADERBOARD_START: 9.82,  // was 8.72

  // Phase 8 — Leaderboard reveal + push-in + hold
  LEADERBOARD_REVEAL_START: 10.34,   // was 9.24
  LEADERBOARD_REVEAL_DURATION: 0.5,
  LEADERBOARD_PUSH_START: 11.04,     // was 9.74 (+0.2s stagger settle)
  LEADERBOARD_PUSH_DURATION: 1.1,

  // End frame — extended clean hold, ready for Scene 4
  END_START: 12.14,                  // was 10.84
  END_DURATION: 2.0,                 // was 1.0 (+1.0s)
} as const;

/** Total duration in ms — consumed by useVideoPlayer */
export const S3_DURATION_MS = S3.TOTAL * 1000;
