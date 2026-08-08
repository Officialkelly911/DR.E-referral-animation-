/**
 * Scene6Timeline.ts
 *
 * Single source of truth for Scene 6 cinematic timing (15.5s).
 *
 * "Join the Dream Planet Movement" — the emotional payoff scene.
 *
 * Revision (Scene 6 Revision Pass — Functional Corrections + Premium CTA Redesign):
 *   Home Feed hold → Sidebar reveal (over Home Feed) → Sidebar close →
 *   Forum feed (continuous smooth scroll) → Notifications screen
 *   (replaces the old "Community Forum summary" intermediate) →
 *   Premium cinematic CTA → Final hold → Fade to black.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │  P1  (0.00–1.00s)    Home Feed — static hold                          │
 * │  P2  (1.00–1.36s)    Sidebar slides open over Home Feed               │
 * │  P3  (1.36–2.40s)    Sidebar open — hold                              │
 * │  P4  (2.40–2.74s)    Sidebar slides closed                            │
 * │  P5  (2.74–3.24s)    Crossfade: Home → Forum                          │
 * │  P6  (3.24–6.44s)    Forum feed — one continuous smooth scroll        │
 * │  P7  (6.44–6.94s)    Crossfade: Forum → Notifications                 │
 * │  P8  (6.94–9.94s)    Notifications — staggered load-in + gentle scroll│
 * │  P9  (9.94–10.44s)   Crossfade: Notifications → CTA background        │
 * │  P10 (10.34–…)       Premium CTA sequence (see CTA_* below)           │
 * │  End (14.64–15.50s)  Fade to black                                    │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * All values in SECONDS unless the property name ends in _MS or _DURATION.
 */

export const S6 = {
  TOTAL: 15.5,

  // ── P1: Home Feed — static hold (0.00–1.00s) ──────────────────────────────
  HOME_HOLD_END: 1.0,

  // ── P2–P4: Sidebar drawer over Home Feed (1.00–2.74s) ─────────────────────
  SIDEBAR_OPEN_START: 1.0,
  SIDEBAR_OPEN_DURATION: 0.36,
  SIDEBAR_CLOSE_START: 2.4,
  SIDEBAR_CLOSE_DURATION: 0.34,

  // ── P5: Crossfade Home → Forum (2.74–3.24s) ───────────────────────────────
  FORUM_REVEAL_START: 2.74,
  SCREEN_CROSSFADE_DURATION: 0.5,

  // ── P6: Forum feed — continuous scroll (3.24–6.44s) ───────────────────────
  FORUM_SCROLL_START: 3.24,
  FORUM_SCROLL_DURATION: 3.2,

  // ── P7: Crossfade Forum → Notifications (6.44–6.94s) ──────────────────────
  NOTIF_REVEAL_START: 6.44,

  // ── P8: Notifications — stagger in, then gentle scroll (6.94–9.94s) ──────
  NOTIF_STAGGER_START: 6.94,
  NOTIF_STAGGER_DURATION: 0.45,
  NOTIF_SCROLL_START: 8.0,
  NOTIF_SCROLL_DURATION: 1.94,

  // ── P9: Crossfade Notifications → CTA (9.94–10.44s) ───────────────────────
  CTA_REVEAL_START: 9.94,

  // ── P10: Premium CTA sequence — offsets are seconds from CTA_T0 ──────────
  CTA_T0: 10.34,
  CTA_BG_DURATION: 0.9,
  CTA_LOGO_OFFSET: 0.4,
  CTA_LOGO_DURATION: 0.65,
  CTA_HEADLINE_OFFSET: 0.85,
  CTA_HEADLINE_DURATION: 0.55,
  CTA_REFERRAL_OFFSET: 1.3,
  CTA_REFERRAL_DURATION: 0.65,
  CTA_BUTTONS_OFFSET: 1.85,
  CTA_BUTTONS_DURATION: 0.5,
  CTA_BUTTON_OFFSET: 2.35,
  CTA_BUTTON_DURATION: 0.45,
  CTA_AMBIENT_OFFSET: 2.6,

  // ── Final hold + fade to black ─────────────────────────────────────────────
  FINAL_HOLD_START: 12.64,
  END_START: 14.64,
  END_DURATION: 0.86,
} as const;

/** Total Scene 6 duration in ms — consumed by capture scripts */
export const S6_DURATION_MS = S6.TOTAL * 1000;

/**
 * Convert a scene-relative time (seconds) to a delay from animation
 * start (ms). Canonical translation from timeline constants to setTimeout.
 */
export const s6t = (seconds: number): number => Math.round(seconds * 1000);
