/**
 * VideoTemplate.tsx
 * Dream Planet Referral Campaign — Scenes 3 & 4
 *
 * Total duration: 18.5 seconds (Scene 3: 9.5s + Scene 4: 9.0s)
 * Canvas: 1080 × 1920 (9:16), 60fps capture-ready
 *
 * Scene structure:
 *   scene3 (9500ms) — Scene3ReferralAnimation
 *     Phase 1  (0.0–0.4s)   Entry — white dissolve from Scene 2
 *     Phase 2  (0.4–1.4s)   Referral Home reveal
 *     Phase 3  (1.4–3.0s)   Home camera push-in
 *     Phase 4  (3.0–3.6s)   Code card emphasis
 *     Phase 4b (3.6–4.0s)   View Levels tease
 *     Phase 5  (4.0–5.0s)   Tap → Levels transition
 *     Phase 6  (5.0–6.6s)   Levels reveal + push-in
 *     Phase 7  (6.6–7.6s)   Tap → Leaderboard transition
 *     Phase 8  (7.6–9.5s)   Leaderboard reveal + push-in + hold
 *
 *   scene4 (9000ms) — Scene4ReferralAnimation
 *     Phase 1  (0.0–0.6s)   Open on Leaderboard (inherit Scene 3 end)
 *     Phase 2  (0.6–2.2s)   Leaderboard push-in toward podium
 *     Phase 3  (2.2–3.2s)   Tap "View Levels" → Levels
 *     Phase 4  (3.2–4.8s)   Levels reveal + Bronze push-in
 *     Phase 5  (4.8–5.8s)   Bronze "$40" reward emphasis
 *     Phase 6  (5.8–7.0s)   Camera pull-back (Silver & Gold tease)
 *     Phase 7  (7.0–8.0s)   Tap back → Referral Home
 *     Phase 8  (8.0–9.0s)   Referral code CTA hold
 */

import { useState } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { AnimatePresence, motion } from 'framer-motion';
import { Scene3ReferralAnimation } from '@/components/scene3/Scene3ReferralAnimation';
import { Scene4ReferralAnimation } from '@/components/scene4/Scene4ReferralAnimation';
import { S3_DURATION_MS } from '@/components/scene3/Scene3Timeline';
import { S4_DURATION_MS } from '@/components/scene4/Scene4Timeline';

const SCENE_DURATIONS = {
  scene3: S3_DURATION_MS, // 9500ms
  scene4: S4_DURATION_MS, // 9000ms
};

export default function VideoTemplate() {
  // loopCount forces a remount of each animation on each loop cycle
  // so useEffect / startedRef reset cleanly.
  const [loopCount, setLoopCount] = useState(0);

  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
    loop: true,
    onVideoEnd: () => setLoopCount((n) => n + 1),
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ background: 'white' }}
    >
      <AnimatePresence mode="wait">
        {currentScene === 0 && (
          <motion.div
            key={`scene3-${loopCount}`}
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <Scene3ReferralAnimation />
          </motion.div>
        )}

        {currentScene === 1 && (
          <motion.div
            key={`scene4-${loopCount}`}
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <Scene4ReferralAnimation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
