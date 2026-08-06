/**
 * Scene6Timeline.ts
 *
 * Single source of truth for Scene 6 cinematic timing (8.0s).
 *
 * "Join the Dream Planet Movement" — the emotional payoff scene.
 *
 * Journey:
 *   Scene 5 Forum final frame hold → UI dissolve → Logo formation
 *   → Tagline → CTA → Referral card → Store badges → Final hold
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  Phase 1  (0.00–0.75s)   Scene 5 Forum final frame — static hold │
 * │  Phase 2  (0.75–2.25s)   UI dissolve — blur, fade, particles     │
 * │  Phase 3  (2.25–3.20s)   Logo formation — scale + glow           │
 * │  Phase 4  (3.20–3.70s)   Tagline reveal                          │
 * │  Phase 5  (3.70–4.70s)   CTA headline + subtext                  │
 * │  Phase 5b (4.50–5.20s)   Referral card slides up                 │
 * │  Phase 6  (5.20–5.70s)   Store badges fade in                    │
 * │  Phase 7  (5.70–8.00s)   Final hold — 2.3s read time             │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * All values in SECONDS unless the property name ends in _MS or _DURATION.
 */

export const S6 = {
  TOTAL: 8.0,

  // ── Phase 1: Scene 5 Forum final frame — static hold (0.00–0.75s) ──────────
  FORUM_HOLD_END: 0.75,

  // ── Phase 2: UI dissolve (0.75–2.25s) ───────────────────────────────────────
  /** When the dissolve sequence begins */
  DISSOLVE_START: 0.75,
  /** Duration of forum opacity fade (1 → 0) */
  DISSOLVE_DURATION: 1.50,
  /** Duration of blur increase on forum layer (0 → 16px) */
  BLUR_DURATION: 1.20,
  /** When particles appear and drift toward logo center */
  PARTICLES_START: 0.75,

  // ── Phase 3: Logo formation (2.25–3.20s) ────────────────────────────────────
  /** Logo begins fading in (opacity + scale) */
  LOGO_START: 2.25,
  /** Duration of logo entry animation */
  LOGO_DURATION: 0.85,

  // ── Phase 4: Tagline (3.20–3.70s) ───────────────────────────────────────────
  TAGLINE_START: 3.20,
  TAGLINE_DURATION: 0.50,

  // ── Phase 5: CTA (3.70–4.70s) ───────────────────────────────────────────────
  CTA_START: 3.70,
  CTA_DURATION: 0.55,

  // ── Phase 5b: Referral card (4.50–5.20s) ────────────────────────────────────
  REFERRAL_START: 4.50,
  REFERRAL_DURATION: 0.65,

  // ── Phase 6: Store badges (5.20–5.70s) ──────────────────────────────────────
  BADGES_START: 5.20,
  BADGES_DURATION: 0.45,

  // ── Phase 7: Final hold (5.70–8.00s = 2.30s) ────────────────────────────────
  FINAL_HOLD_START: 5.70,
  /** End with brief fade to black */
  END_START: 7.70,
  END_DURATION: 0.30,
} as const;

/** Total Scene 6 duration in ms — consumed by capture scripts */
export const S6_DURATION_MS = S6.TOTAL * 1000;

/**
 * Convert a scene-relative time (seconds) to a delay from animation
 * start (ms). Canonical translation from timeline constants to setTimeout.
 */
export const s6t = (seconds: number): number => Math.round(seconds * 1000);
