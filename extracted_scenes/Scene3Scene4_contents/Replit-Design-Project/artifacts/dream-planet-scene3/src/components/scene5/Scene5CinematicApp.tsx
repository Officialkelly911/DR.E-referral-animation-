/**
 * Scene5CinematicApp.tsx
 *
 * Phase 6 — Standalone cinematic entry for Scene 5.
 *
 * Renders the Scene5InteractionProvider + Scene5CinematicInner at a
 * full-bleed 1080×1920 canvas, matching the capture viewport.
 *
 * No harness chrome (no "Back to menu" buttons, no "Open menu" debug
 * buttons). The cinematic animation is self-contained and self-starting.
 *
 * Served at /dream-planet-scene3/scene5-cinematic.html via
 * src/main-scene5-cinematic.tsx.
 *
 * For capture: the script navigates to this URL, waits for the full
 * animation duration, then encodes the recorded WebM to MP4.
 */

import { useRef, useEffect } from 'react';
import {
  Scene5InteractionProvider,
  type Scene5InteractionAction,
} from './Scene5InteractionStore';
import { Scene5CinematicInner } from './Scene5CinematicAnimation';
import { scene5Actions } from './scene5Actions';
import type React from 'react';

export function Scene5CinematicApp() {
  const dispatchRef = useRef<React.Dispatch<Scene5InteractionAction> | null>(null);

  useEffect(() => {
    // Register the automation API so Playwright scripts can call
    // window.__scene5Actions if needed during capture.
    scene5Actions.register(dispatchRef);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#ffffff',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Scene5InteractionProvider dispatchRef={dispatchRef}>
        <Scene5CinematicInner />
      </Scene5InteractionProvider>
    </div>
  );
}
