/**
 * Scene6CinematicApp.tsx
 *
 * Phase 10 — Standalone cinematic entry wrapper for Scene 6.
 *
 * Renders Scene6CinematicAnimation at a full-bleed 1080×1920 canvas,
 * matching the Playwright capture viewport.
 *
 * No harness chrome. Self-starting. Served at:
 *   /dream-planet-scene3/scene6-cinematic.html
 * via src/main-scene6-cinematic.tsx.
 */

import { Scene6CinematicAnimation } from './Scene6CinematicAnimation';

export function Scene6CinematicApp({ variant = 'v3' }: { variant?: 'v3' | 'v4' }) {
  return (
    <div
      id="s6-app-root"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a0d',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Scene6CinematicAnimation variant={variant} />
    </div>
  );
}
