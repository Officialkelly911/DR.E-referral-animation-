/**
 * Scene4ReferralAnimation.tsx
 *
 * Scene 4 — Deeper Referral Discovery (~9.0 s)
 *
 * Narrative: the viewer has already seen the Referral Home (Scene 3).
 * Now we take them deeper: Leaderboard community → Levels progression
 * → back to Referral Home for a final referral-code CTA.
 *
 * Timeline:
 *   Phase 1  (0.0–0.6s)   Open on Leaderboard — inherit Scene 3's end frame
 *   Phase 2  (0.6–2.2s)   Leaderboard push-in toward podium top-3
 *   Phase 3  (2.2–3.2s)   Tap "View Levels" pill → iOS push to Levels
 *   Phase 4  (3.2–4.8s)   Levels reveal — camera push toward Bronze card
 *   Phase 5  (4.8–5.8s)   Bronze reward "$40" emphasis pulse
 *   Phase 6  (5.8–7.0s)   Camera pull-back: Silver & Gold tease
 *   Phase 7  (7.0–8.0s)   Tap back → Referral Home slide-in
 *   Phase 8  (8.0–9.0s)   Referral code emphasis + hold (CTA)
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Scene4LeaderboardUI } from './Scene4LeaderboardUI';
import { Scene4LevelsUI } from './Scene4LevelsUI';
import { Scene4ReferralHomeUI } from './Scene4ReferralHomeUI';
import { Scene3TapRipple } from '@/components/scene3/Scene3TapRipple';

// Cinematic easing
const EASE_EXPO_OUT  = [0.16, 1, 0.3, 1]   as const;
const EASE_SMOOTH    = [0.25, 0.46, 0.45, 0.94] as const;
const PAGE_TRANSITION = { duration: 0.45, ease: EASE_SMOOTH };

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

type Page = 'leaderboard' | 'levels' | 'home';

export function Scene4ReferralAnimation() {
  const [currentPage, setCurrentPage] = useState<Page>('leaderboard');
  const [tapPos, setTapPos] = useState<{ x: number; y: number } | null>(null);

  const cameraControls          = useAnimation();
  const leaderboardRevealCtrls  = useAnimation();
  const levelsRevealCtrls       = useAnimation();
  const homeRevealCtrls         = useAnimation();
  const codeCardCtrls           = useAnimation();

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      // ── PHASE 1: Open on Leaderboard (0.0–0.6s) ─────────────────────────
      // Leaderboard starts already revealed — inherits Scene 3's end state.
      leaderboardRevealCtrls.start('visible');
      await delay(600);

      // ── PHASE 2: Leaderboard push-in toward podium (0.6–2.2s) ───────────
      await cameraControls.start({
        scale: 1.08,
        y: '-3%',
        transition: { duration: 1.6, ease: EASE_SMOOTH },
      });

      // ── PHASE 3: Tap "View Levels" pill + camera reset (2.2–3.2s) ───────
      // "View Levels" is the Leaderboard header back action
      // Tap at leaderboard header "Levels" back area (~55px, 36px)
      setTapPos({ x: 55, y: 36 });
      cameraControls.start({
        scale: 1,
        y: 0,
        transition: { duration: 0.35, ease: EASE_SMOOTH },
      });
      await delay(500);
      setTapPos(null);

      setCurrentPage('levels');
      await delay(520);

      // ── PHASE 4: Levels reveal + camera push (3.2–4.8s) ─────────────────
      levelsRevealCtrls.start('visible');
      await delay(400);
      await cameraControls.start({
        scale: 1.07,
        y: '2%',
        transition: { duration: 1.2, ease: EASE_SMOOTH },
      });

      // ── PHASE 5: Bronze reward emphasis (4.8–5.8s) ───────────────────────
      // codeCardCtrls reused here as "bronze reward card" pulse
      await codeCardCtrls.start({
        scale: [1, 1.03, 1],
        transition: { duration: 0.7, ease: 'easeInOut', times: [0, 0.4, 1] },
      });

      // ── PHASE 6: Camera pull-back (Silver & Gold peek) (5.8–7.0s) ───────
      await cameraControls.start({
        scale: 0.97,
        y: '-1%',
        transition: { duration: 1.2, ease: EASE_SMOOTH },
      });

      // ── PHASE 7: Tap back → Referral Home (7.0–8.0s) ────────────────────
      // Tap on back button (~30px, 36px)
      setTapPos({ x: 30, y: 36 });
      cameraControls.start({
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: EASE_SMOOTH },
      });
      await delay(450);
      setTapPos(null);

      // Levels slides right (out), Home slides in from left
      setCurrentPage('home');
      await delay(520);

      // ── PHASE 8: Referral Home — code emphasis + CTA hold (8.0–9.0s) ────
      homeRevealCtrls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: EASE_EXPO_OUT },
      });
      await delay(200);

      // Gentle push toward the referral code card
      cameraControls.start({
        scale: 1.04,
        y: '-1%',
        transition: { duration: 0.7, ease: EASE_SMOOTH },
      });
      await delay(300);

      // Referral code card final pulse — draw the eye
      await codeCardCtrls.start({
        scale: [1, 1.032, 1],
        transition: { duration: 0.5, ease: 'easeInOut', times: [0, 0.45, 1] },
      });

      // Hold on the code as the end frame
      await delay(300);
    };

    run().catch(console.error);
  }, [
    cameraControls,
    leaderboardRevealCtrls,
    levelsRevealCtrls,
    homeRevealCtrls,
    codeCardCtrls,
  ]);

  const phoneScale = typeof window !== 'undefined' ? window.innerWidth / 390 : 2.769;
  const phoneH = typeof window !== 'undefined'
    ? Math.ceil(window.innerHeight / phoneScale)
    : 693;

  return (
    <div
      id="s4-root"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'white',
      }}
    >
      {/* Camera layer */}
      <motion.div
        id="s4-camera"
        animate={cameraControls}
        initial={{ scale: 1, y: 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 45%',
        }}
      >
        <div
          id="s4-phone-frame"
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
          <AnimatePresence>
            {currentPage === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ x: 0 }}
                exit={{ x: '-28%', transition: PAGE_TRANSITION }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Scene4LeaderboardUI revealControls={leaderboardRevealCtrls} />
              </motion.div>
            )}

            {currentPage === 'levels' && (
              <motion.div
                key="levels"
                initial={{ x: '100%' }}
                animate={{ x: 0, transition: PAGE_TRANSITION }}
                exit={{ x: '100%', transition: PAGE_TRANSITION }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Scene4LevelsUI
                  revealControls={levelsRevealCtrls}
                  bronzeCardControls={codeCardCtrls}
                />
              </motion.div>
            )}

            {currentPage === 'home' && (
              <motion.div
                key="home"
                initial={{ x: '-100%' }}
                animate={{ x: 0, transition: PAGE_TRANSITION }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <motion.div
                  animate={homeRevealCtrls}
                  initial={{ opacity: 0.4, scale: 0.98, y: 8 }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <Scene4ReferralHomeUI codeCardControls={codeCardCtrls} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {tapPos && <Scene3TapRipple x={tapPos.x} y={tapPos.y} />}
        </div>
      </motion.div>
    </div>
  );
}
