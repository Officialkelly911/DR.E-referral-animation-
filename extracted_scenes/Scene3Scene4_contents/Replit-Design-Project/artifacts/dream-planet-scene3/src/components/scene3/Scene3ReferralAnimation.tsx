/**
 * Scene3ReferralAnimation.tsx
 *
 * Full Scene 3 cinematic orchestrator — 11.84 second journey through:
 *   Referral Home → View Levels → Leaderboard
 *
 * Timeline (v2 — pacing revision, +24.6% from original 9.5s):
 *   Phase 1  (0.0–0.5s)    Entry         — white overlay dissolves (from Scene 2)
 *   Phase 2  (0.5–1.7s)    Home reveal   — UI rises from below with scale settle
 *   Phase 3  (1.7–3.7s)    Home push-in  — camera 100% → 106% toward code card
 *   Phase 4  (3.7–4.4s)    Code emphasis — referral card breathes (1.028× pulse)
 *   Phase 4b (4.4–4.9s)    Levels tease  — "View Levels" link draws the eye
 *   Phase 5  (4.9–6.0s)    Tap + push to Levels — ripple, camera resets, iOS slide
 *   Phase 6  (6.0–8.1s)    Levels        — stagger reveal + camera push-in
 *   Phase 7  (8.1–9.2s)    Tap + push to Leaderboard — ripple, camera resets, iOS slide
 *   Phase 8  (9.2–11.84s)  Leaderboard   — stagger reveal + push-in + extended hold
 *
 * No UI, layout, transition, asset, or color changes from v1 — timing only.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Scene3ReferralUI } from './Scene3ReferralUI';
import { Scene3LevelsUI } from './Scene3LevelsUI';
import { Scene3LeaderboardUI } from './Scene3LeaderboardUI';
import { Scene3TapRipple } from './Scene3TapRipple';

// Cinematic easing curves
const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_SMOOTH   = [0.25, 0.46, 0.45, 0.94] as const;

// Page transition timing (iOS-style horizontal push)
const PAGE_TRANSITION = { duration: 0.45, ease: EASE_SMOOTH };

// Simple async delay
const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

type Page = 'home' | 'levels' | 'leaderboard';

export function Scene3ReferralAnimation() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [tapPos, setTapPos] = useState<{ x: number; y: number } | null>(null);

  // ── Controls ─────────────────────────────────────────────────────────────
  const overlayControls          = useAnimation(); // entry/exit white flash
  const cameraControls           = useAnimation(); // push-in scale (shared)
  const homeRevealControls       = useAnimation(); // home opacity+scale+y reveal
  const codeCardControls         = useAnimation(); // referral code card pulse
  const viewLevelsControls       = useAnimation(); // "View Levels" link highlight
  const levelsRevealControls     = useAnimation(); // levels page stagger
  const leaderboardRevealControls = useAnimation(); // leaderboard page stagger

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      // ── PHASE 1: Entry (0.0–0.5s) ──────────────────────────────────────
      // White dissolves — gives the impression of emerging from Scene 2.
      overlayControls.start({
        opacity: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
      });
      await delay(500);

      // ── PHASE 2: Referral Home Reveal (0.5–1.7s) ───────────────────────
      await homeRevealControls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 1.2, ease: EASE_EXPO_OUT },
      });

      // ── PHASE 3: Home Camera Push-in (1.7–3.7s) ────────────────────────
      // Slow cinematic push toward the referral code card area.
      await cameraControls.start({
        scale: 1.06,
        y: '-1.5%',
        transition: { duration: 2.0, ease: EASE_SMOOTH },
      });

      // ── PHASE 4: Referral Code Emphasis (3.7–4.4s) ─────────────────────
      await codeCardControls.start({
        scale: [1, 1.028, 1],
        transition: { duration: 0.7, ease: 'easeInOut', times: [0, 0.45, 1] },
      });

      // ── PHASE 4b: View Levels Tease (4.4–4.9s) ─────────────────────────
      await viewLevelsControls.start({
        scale: [1, 1.14, 1],
        opacity: [1, 0.6, 1],
        transition: { duration: 0.5, times: [0, 0.5, 1] },
      });

      // ── PHASE 5: Tap "View Levels" + Camera Reset + Transition ──────────
      // Tap ripple appears at the "View Levels" link position (~85px, 510px)
      setTapPos({ x: 85, y: 510 });
      // Camera resets concurrently while the ripple plays
      cameraControls.start({
        scale: 1,
        y: 0,
        transition: { duration: 0.35, ease: EASE_SMOOTH },
      });
      await delay(600);
      setTapPos(null);

      // iOS-style push: Home slides left, Levels slides in from right
      setCurrentPage('levels');
      await delay(520); // let the 450ms transition finish + small buffer

      // ── PHASE 6: Levels Reveal (6.0–6.5s) ──────────────────────────────
      // Fire stagger reveal on the levels content
      levelsRevealControls.start('visible');
      await delay(500); // let the stagger start before the camera moves

      // ── PHASE 6b: Levels Camera Push-in (6.5–8.1s) ─────────────────────
      await cameraControls.start({
        scale: 1.05,
        y: '-1%',
        transition: { duration: 1.6, ease: EASE_SMOOTH },
      });

      // ── PHASE 7: Tap "Leaderboard" Header Button + Camera Reset ─────────
      // Tap ripple on the "Leaderboard" header pill (~330px, 36px)
      setTapPos({ x: 330, y: 36 });
      cameraControls.start({
        scale: 1,
        y: 0,
        transition: { duration: 0.35, ease: EASE_SMOOTH },
      });
      await delay(600);
      setTapPos(null);

      // Levels slides left, Leaderboard slides in from right
      setCurrentPage('leaderboard');
      await delay(520);

      // ── PHASE 8: Leaderboard Reveal (9.2–9.7s) ──────────────────────────
      leaderboardRevealControls.start('visible');
      await delay(500);

      // ── PHASE 8b: Leaderboard Push-in + Hold (9.7–11.84s) ───────────────
      await cameraControls.start({
        scale: 1.05,
        y: '-1%',
        transition: { duration: 1.1, ease: EASE_SMOOTH },
      });

      // Extended end frame — clean hold before the loop restarts
      await delay(1000);
    };

    run().catch(console.error);
  }, [
    overlayControls,
    cameraControls,
    homeRevealControls,
    codeCardControls,
    viewLevelsControls,
    levelsRevealControls,
    leaderboardRevealControls,
  ]);

  // Scale 390px design to fill the viewport (portrait 9:16 capture)
  const phoneScale = typeof window !== 'undefined' ? window.innerWidth / 390 : 2.769;
  const phoneH = typeof window !== 'undefined'
    ? Math.ceil(window.innerHeight / phoneScale)
    : 693;

  return (
    <div
      id="s3-root"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#FF6B00', // matches hero — prevents flash between loops
      }}
    >
      {/* ── CAMERA LAYER ──────────────────────────────────────────────────
          A single push-in layer. Resets to scale:1 before each page transition,
          then builds up again on the new page. Transform origin at 55% vertical
          biases the zoom toward the lower-half content (code card, badge, podium). */}
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
        {/* ── PHONE SCALER ──────────────────────────────────────────────
            The design is always 390px wide. CSS scale fills the viewport.
            overflow:hidden clips off-screen pages during slide transitions. */}
        <div
          id="s3-phone-frame"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '390px',
            height: `${phoneH}px`,
            transformOrigin: 'top center',
            transform: `translateX(-50%) scale(${phoneScale})`,
            overflow: 'hidden',
          }}
        >
          {/* ── PAGE TRANSITIONS ──────────────────────────────────────
              AnimatePresence manages the iOS-style horizontal push.
              - Exiting page slides left (-28% parallax)
              - Entering page slides in from the right (100% → 0)
              Both happen simultaneously (default AnimatePresence mode). */}
          <AnimatePresence>
            {currentPage === 'home' && (
              <motion.div
                key="home"
                initial={{ x: 0 }}
                exit={{ x: '-28%', transition: PAGE_TRANSITION }}
                style={{ position: 'absolute', inset: 0 }}
              >
                {/* Home reveal layer: opacity + scale + y settle */}
                <motion.div
                  id="s3-home-reveal"
                  animate={homeRevealControls}
                  initial={{ opacity: 0, scale: 0.96, y: 28 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformOrigin: 'center bottom',
                  }}
                >
                  <Scene3ReferralUI
                    codeCardControls={codeCardControls}
                    viewLevelsControls={viewLevelsControls}
                  />
                </motion.div>
              </motion.div>
            )}

            {currentPage === 'levels' && (
              <motion.div
                key="levels"
                initial={{ x: '100%' }}
                animate={{ x: 0, transition: PAGE_TRANSITION }}
                exit={{ x: '-28%', transition: PAGE_TRANSITION }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Scene3LevelsUI revealControls={levelsRevealControls} />
              </motion.div>
            )}

            {currentPage === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ x: '100%' }}
                animate={{ x: 0, transition: PAGE_TRANSITION }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Scene3LeaderboardUI revealControls={leaderboardRevealControls} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TAP RIPPLE ────────────────────────────────────────────
              Renders in phone coordinate space so it scales correctly.
              Position is in the 390px design frame. */}
          {tapPos && <Scene3TapRipple x={tapPos.x} y={tapPos.y} />}
        </div>
      </motion.div>

      {/* ── TRANSITION OVERLAY ────────────────────────────────────────────
          Phase 1: starts at opacity:1 (white), fades to 0 on entry.
          Stays at 0 for the rest of the scene.
          Phase 6 (exit) is handled by the loop restart in VideoTemplate. */}
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
