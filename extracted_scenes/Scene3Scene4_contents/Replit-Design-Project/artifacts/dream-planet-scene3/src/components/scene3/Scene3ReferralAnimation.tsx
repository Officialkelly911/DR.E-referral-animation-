/**
 * Scene3ReferralAnimation.tsx
 *
 * Main orchestrator for the Scene 3 cinematic animation.
 * 4.5-second premium product reveal of the Dream Planet Referral Home.
 *
 * 6-phase timeline:
 *   Phase 1 (0.0–0.6s)  Entry        — white overlay dissolves out
 *   Phase 2 (0.6–1.8s)  Reveal       — UI fades + scales up from slight below
 *   Phase 3 (1.8–3.0s)  Push-in      — camera scale 100% → 108% toward code card
 *   Phase 4 (3.0–3.7s)  Code Emphasis— referral card breathes with a soft pulse
 *   Phase 5 (3.7–4.2s)  Levels Tease — "View Levels" gently draws the eye
 *   Phase 6 (4.2–4.5s)  Exit         — white overlay fades in for Scene 4 handoff
 */

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Scene3ReferralUI } from './Scene3ReferralUI';
import { S3 } from './Scene3Timeline';

// Cinematic easing curves
const EASE_EXPO_OUT   = [0.16, 1, 0.3, 1] as const;   // Premium settle
const EASE_SMOOTH     = [0.25, 0.46, 0.45, 0.94] as const; // Smooth push
const EASE_GENTLE_OUT = [0.4, 0, 0.2, 1] as const;    // Material-style out

export function Scene3ReferralAnimation() {
  // Animation controls for each layer
  const overlayControls    = useAnimation();
  const uiControls         = useAnimation();
  const cameraControls     = useAnimation();
  const codeCardControls   = useAnimation();
  const viewLevelsControls = useAnimation();

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      // ── PHASE 1: Entry (0.0 – 0.6s) ────────────────────────────────
      // White overlay fades out, revealing the warm orange hero beneath.
      // Fire without await so the reveal starts on time.
      overlayControls.start({
        opacity: 0,
        transition: { duration: S3.ENTRY_DURATION, ease: 'easeOut' },
      });

      // Wait for overlay to clear before UI animates in
      await new Promise(r => setTimeout(r, S3.ENTRY_DURATION * 1000));

      // ── PHASE 2: Referral Home Reveal (0.6 – 1.8s) ─────────────────
      // UI rises from slight below with opacity and gentle scale settle.
      await uiControls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: S3.REVEAL_DURATION,
          ease: EASE_EXPO_OUT,
        },
      });

      // ── PHASE 3: Camera Push-in (1.8 – 3.0s) ───────────────────────
      // Slow cinematic push toward the referral code card area.
      // Transform origin is set to ~55% vertical to focus the zoom
      // toward the code card, not the top of the screen.
      await cameraControls.start({
        scale: 1.08,
        y: '-1.5%',
        transition: {
          duration: S3.PUSH_DURATION,
          ease: EASE_SMOOTH,
        },
      });

      // ── PHASE 4: Referral Code Emphasis (3.0 – 3.7s) ───────────────
      // The code card breathes: out → in → settle.
      // Restrained — only 1.028× at peak. Premium, not bouncy.
      await codeCardControls.start({
        scale: [1, 1.028, 1],
        transition: {
          duration: S3.CODE_DURATION,
          ease: EASE_GENTLE_OUT,
          times: [0, 0.45, 1],
        },
      });

      // ── PHASE 5: View Levels Tease (3.7 – 4.2s) ─────────────────────
      // "View Levels" draws attention with a brief scale pulse.
      // Tells the viewer: there's more to explore.
      await viewLevelsControls.start({
        scale: [1, 1.18, 1],
        transition: {
          duration: S3.LEVELS_DURATION,
          ease: 'easeInOut',
          times: [0, 0.5, 1],
        },
      });

      // ── PHASE 6: Scene Exit (4.2 – 4.5s) ────────────────────────────
      // White overlay returns, preparing the handoff to Scene 4.
      // The viewer is left oriented in the referral experience.
      await overlayControls.start({
        opacity: 0.88,
        transition: { duration: S3.EXIT_DURATION, ease: 'easeIn' },
      });
    };

    run().catch(console.error);
  }, [
    overlayControls,
    uiControls,
    cameraControls,
    codeCardControls,
    viewLevelsControls,
  ]);

  // Scale 390px phone design to fill the actual viewport width
  const phoneScale =
    typeof window !== 'undefined' ? window.innerWidth / 390 : 2.769;
  const phoneContentHeight =
    typeof window !== 'undefined'
      ? `${Math.ceil(window.innerHeight / phoneScale)}px`
      : '693px';

  return (
    <div
      id="s3-root"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#FF6B00', // orange matches hero — no flash during entry
      }}
    >
      {/* ── CAMERA LAYER ──────────────────────────────────────────────
          Gets the Phase 3 push-in scale. Transform origin sits at ~55%
          vertical so the zoom pushes toward the code card, not the sky. */}
      <motion.div
        id="s3-camera"
        animate={cameraControls}
        initial={{ scale: 1, y: 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 55%',
        }}
      >
        {/* ── PHONE UI SCALER ────────────────────────────────────────
            Scales the 390px-wide design to fill the capture viewport.
            The inner content is always 390px; CSS scale handles the rest. */}
        <div
          id="s3-phone-scaler"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '390px',
            height: phoneContentHeight,
            transformOrigin: 'top center',
            transform: `translateX(-50%) scale(${phoneScale})`,
          }}
        >
          {/* ── UI REVEAL LAYER ──────────────────────────────────────
              Phase 2: rises from y=28px, opacity 0→1, scale 0.96→1 */}
          <motion.div
            id="s3-ui-wrap"
            animate={uiControls}
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: 'center bottom',
            }}
          >
            <Scene3ReferralUI
              codeCardControls={codeCardControls}
              viewLevelsControls={viewLevelsControls}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── TRANSITION OVERLAY ────────────────────────────────────────
          Phase 1: starts at opacity 1 (white), fades to 0 (entry from Scene 2).
          Phase 6: fades back to 0.88 (handoff to Scene 4).
          Sits above everything; pointer-events: none so nothing is blocked. */}
      <motion.div
        id="s3-overlay"
        animate={overlayControls}
        initial={{ opacity: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'white',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />
    </div>
  );
}
