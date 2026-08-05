/**
 * Scene5NavOverlay.tsx
 *
 * Muted background overlay shown behind the Side Navigation drawer.
 * Keeps the underlying screen visible (per reference) rather than
 * fully obscuring it. Independently animatable from the drawer itself.
 */

import { motion } from 'framer-motion';

export interface Scene5NavOverlayProps {
  onClick?: () => void;
}

export function Scene5NavOverlay({ onClick }: Scene5NavOverlayProps) {
  return (
    <motion.div
      data-scene5="side-nav-overlay"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(17,17,17,0.55)',
        zIndex: 40,
      }}
    />
  );
}
