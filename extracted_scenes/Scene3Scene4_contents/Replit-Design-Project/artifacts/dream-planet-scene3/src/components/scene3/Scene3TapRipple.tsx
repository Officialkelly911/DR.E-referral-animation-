/**
 * Scene3TapRipple.tsx
 *
 * Premium tap indicator — a soft expanding ring that fades out.
 * Coordinates are in the 390px phone design space.
 */

import React from 'react';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface Scene3TapRippleProps {
  x: number;
  y: number;
}

export function Scene3TapRipple({ x, y }: Scene3TapRippleProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Inner dot — appears first */}
      <motion.div
        initial={{ opacity: 0.6, scale: 0 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.18)',
          top: y - 16,
          left: x - 16,
          transformOrigin: 'center center',
        }}
      />
      {/* Outer ring — expands behind the dot */}
      <motion.div
        initial={{ opacity: 0.35, scale: 0 }}
        animate={{ opacity: 0, scale: 2.2 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: 0.04 }}
        style={{
          position: 'absolute',
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,0,0,0.25)',
          top: y - 16,
          left: x - 16,
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}
