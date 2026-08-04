/**
 * VideoTemplate.tsx
 * Scene 3 — Dream Planet Referral Experience Cinematic Animation
 *
 * Total duration: 4.5 seconds
 * Canvas: 1080 × 1920 (9:16), 60fps capture-ready
 *
 * Scene structure:
 *   scene3 (4500ms) — Scene3ReferralAnimation, all 6 phases
 */

import { useState } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { AnimatePresence, motion } from 'framer-motion';
import { Scene3ReferralAnimation } from '@/components/scene3/Scene3ReferralAnimation';
import { S3_DURATION_MS } from '@/components/scene3/Scene3Timeline';

const SCENE_DURATIONS = {
  scene3: S3_DURATION_MS, // 4500ms
};

export default function VideoTemplate() {
  // loopCount forces a remount of Scene3ReferralAnimation on each loop cycle,
  // so the animation useEffect and startedRef reset cleanly.
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
            exit={{ opacity: 0 }}
          >
            <Scene3ReferralAnimation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
