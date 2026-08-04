/**
 * Scene3Timeline.ts
 * Timing constants for the Scene 3 cinematic animation (all values in seconds).
 * Single source of truth — do not hardcode durations elsewhere.
 */

export const S3 = {
  TOTAL: 4.5,

  // Phase 1 — Entry from Scene 2: white overlay dissolves out
  ENTRY_START:    0.0,
  ENTRY_DURATION: 0.6,

  // Phase 2 — Referral Home reveal: UI fades + scales up from below
  REVEAL_START:    0.6,
  REVEAL_DURATION: 1.2,

  // Phase 3 — Camera push-in: subtle 100% → 108% scale toward code card
  PUSH_START:    1.8,
  PUSH_DURATION: 1.2,

  // Phase 4 — Referral code emphasis: code card breathes with a soft scale pulse
  CODE_START:    3.0,
  CODE_DURATION: 0.7,

  // Phase 5 — View Levels tease: brief scale/glow on "View Levels" link
  LEVELS_START:    3.7,
  LEVELS_DURATION: 0.5,

  // Phase 6 — Scene exit: white overlay fades in for Scene 4 handoff
  EXIT_START:    4.2,
  EXIT_DURATION: 0.3,
} as const;

/** Total duration in milliseconds, for useVideoPlayer */
export const S3_DURATION_MS = S3.TOTAL * 1000;
