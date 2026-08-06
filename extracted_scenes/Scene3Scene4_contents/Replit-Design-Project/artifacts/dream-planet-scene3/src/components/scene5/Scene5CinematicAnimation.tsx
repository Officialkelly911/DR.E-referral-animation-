/**
 * Scene5CinematicAnimation.tsx
 *
 * Phase 6 — Cinematic Scene 5 animation (~9.5 s).
 *
 * Architecture
 * ────────────
 * This component renders inside Scene5InteractionProvider and drives
 * every UI state change through scene5Actions (the same deterministic
 * API used by Phase 5's automated QA). No separate fake UI — the real
 * approved Scene 5 components are what gets filmed.
 *
 * Camera layer
 * ────────────
 * A single Framer Motion `motion.div` wraps the phone frame and receives
 * scale + y transforms to create cinematic push-in / pull-back effects,
 * matching the technique used in Scenes 3 & 4.
 *
 * Phone frame
 * ───────────
 * 390 × phoneH px design space, scaled to fill the capture canvas
 * (1080 × 1920) with the same transform math as Scene4ReferralAnimation.
 *
 * Timeline
 * ────────
 * Driven by an async run() that awaits fixed delays, all sourced from
 * Scene5Timeline.ts so they can be tuned in one place.
 *
 * Phase 1  (0.00–0.70s)  Scene 4 handoff → Side Nav opens
 * Phase 2  (0.70–1.40s)  View Portfolio tap → Portfolio enter
 * Phase 3  (1.40–2.70s)  Portfolio reveal — profile + push-in
 * Phase 4  (2.70–3.50s)  View Forum tap → Forum enter
 * Phase 5  (3.50–4.50s)  Forum reveal — header + first post
 * Phase 6  (4.50–6.50s)  Community discovery — feed scroll
 * Phase 7  (6.50–8.20s)  Community engagement — Like + Comment
 * Phase 8  (8.20–9.50s)  Final community frame — settle + hold
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Share2, MoreHorizontal, Plus } from 'lucide-react';

import { Scene5SideNavigation } from './Scene5SideNavigation';
import { Scene5Portfolio } from './Scene5Portfolio';
import { Scene5Forum } from './Scene5Forum';
import { Scene3TapRipple } from '@/components/scene3/Scene3TapRipple';
import { useScene5Interaction, type Scene5InteractionAction } from './Scene5InteractionStore';
import { scene5Actions } from './scene5Actions';
import { S5, s5t } from './Scene5Timeline';

// ─── Easing ───────────────────────────────────────────────────────────────────

const EASE_SMOOTH   = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const PAGE_SLIDE    = { duration: 0.40, ease: EASE_SMOOTH };

// ─── Delay helper ─────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

// ─── Tap ripple type ──────────────────────────────────────────────────────────

interface TapPos { x: number; y: number }

// ─── Phone frame sizing (matches Scene 4 math) ────────────────────────────────

function getPhoneDimensions() {
  if (typeof window === 'undefined') return { scale: 2.769, h: 693 };
  const scale = window.innerWidth / 390;
  const h     = Math.ceil(window.innerHeight / scale);
  return { scale, h };
}

// ─── Home screen placeholder (Scene 4 handoff visual) ────────────────────────

function Scene5HomeScreen() {
  return (
    <div
      data-scene5="home-screen"
      style={{ position: 'absolute', inset: 0, background: '#f5f5f5' }}
    >
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '48px 20px 12px',
      }}>
        {/* Hamburger — tap target for the cinematic */}
        <div
          data-scene5-action="open-navigation"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '8px',
          }}
        >
          <span style={{ width: '20px', height: '2px', background: '#111' }} />
          <span style={{ width: '20px', height: '2px', background: '#111' }} />
          <span style={{ width: '20px', height: '2px', background: '#111' }} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#111', fontSize: '14px', fontWeight: 600,
        }}>
          Share <Share2 size={16} />
        </div>
      </div>

      {/* More button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px' }}>
        <MoreHorizontal size={22} color="#111" />
      </div>

      {/* Hero dark card */}
      <div style={{
        height: '260px',
        background: 'linear-gradient(160deg,#1a1a1a,#3a3a3a)',
        margin: '16px 20px',
        borderRadius: '16px',
      }} />

      {/* Orange FAB */}
      <div style={{
        position: 'absolute',
        bottom: '110px',
        right: '20px',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: '#FF6B00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 16px rgba(255,107,0,0.4)',
      }}>
        <Plus color="#fff" size={26} />
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '14px 0 24px',
        borderTop: '1px solid #e5e7eb',
        background: '#fff',
        fontSize: '11px',
        color: '#9ca3af',
      }}>
        <span>Home</span>
        <span>Explore</span>
        <span style={{ color: '#FF6B00', fontWeight: 600 }}>Invest</span>
        <span>Profile</span>
      </div>
    </div>
  );
}

// ─── Main cinematic component (rendered inside InteractionProvider) ────────────

export function Scene5CinematicInner() {
  const { state, dispatch } = useScene5Interaction();
  const screen = state.navigationState;
  const isNavOpen = state.sideNavOpen;

  const cameraControls = useAnimation();
  const [tapPos, setTapPos]           = useState<TapPos | null>(null);
  const [tapKey, setTapKey]           = useState(0);
  const [entryOpacity, setEntryOpacity] = useState(1);
  const startedRef = useRef(false);

  // Register scene5Actions against this component's dispatch.
  const dispatchRef = useRef<React.Dispatch<Scene5InteractionAction> | null>(null);
  dispatchRef.current = dispatch;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    scene5Actions.register(dispatchRef);

    const showTap = async (x: number, y: number) => {
      setTapPos({ x, y });
      setTapKey(k => k + 1);
      await delay(320);
      setTapPos(null);
    };

    const cam = (scale: number, y: string | number, duration: number) =>
      cameraControls.start({
        scale,
        y,
        transition: { duration, ease: EASE_SMOOTH },
      });

    const run = async () => {
      // ── Phase 1: Scene 4 handoff — home screen dissolves in (0.0–0.7s) ────
      // Entry white overlay fades out to reveal the home screen.
      await delay(80);
      setEntryOpacity(0); // CSS transition handles the fade

      await delay(s5t(S5.TAP_HAMBURGER) - 80);
      // Hamburger tap — x:28, y:68 in 390px phone space
      await showTap(28, 68);

      await delay(80);
      scene5Actions.openSideNavigation();

      // Wait for drawer to fully settle (320ms animation)
      await delay(s5t(S5.SIDE_NAV_HOLD - S5.TAP_HAMBURGER) - 80);

      // ── Phase 2: Side Navigation → View Portfolio (0.7–1.4s) ─────────────
      // Subtle camera drift toward "View Portfolio" text in the drawer.
      cam(1.04, '-0.5%', 0.35);
      await delay(300);

      // View Portfolio tap — inside the 390px nav, approx center-left.
      await showTap(185, 148);
      await delay(80);

      // Navigate to Portfolio; drawer slides closed automatically.
      scene5Actions.openPortfolio();

      // Camera resets as drawer animates out.
      cam(1.0, 0, 0.28);

      // Wait for drawer exit (320ms) + portfolio slide-in (400ms).
      await delay(500);

      // ── Phase 3: Portfolio reveal — profile + push-in (1.4–2.7s) ─────────
      // Cinematic push toward profile header.
      cam(1.08, '-2%', S5.PORTFOLIO_PUSH_DURATION);
      await delay(s5t(S5.PORTFOLIO_PUSH_DURATION));

      // Reset camera before View Forum tap.
      cam(1.0, 0, S5.CAMERA_RESET_DURATION);
      await delay(s5t(S5.CAMERA_RESET_DURATION + 0.1));

      // ── Phase 4: View Forum tap → Forum (2.7–3.5s) ────────────────────────
      // View Forum button is in the dark profile header, right side.
      await showTap(298, 220);
      await delay(80);

      scene5Actions.openForum();

      // Wait for Forum slide-in.
      await delay(s5t(S5.FORUM_ENTER - S5.OPEN_FORUM));

      // ── Phase 5: Forum reveal — header + first post (3.5–4.5s) ──────────
      cam(1.06, '-1%', S5.FORUM_PUSH_DURATION);
      await delay(s5t(S5.FORUM_PUSH_DURATION + 0.2));

      // Pull back before scroll begins.
      cam(1.0, 0, 0.35);
      await delay(350);

      // ── Phase 6: Community discovery — feed scroll (4.5–6.5s) ────────────
      scene5Actions.scrollForumTo('p1');
      await delay(750);

      // Brief drift down toward second post.
      cam(1.03, '1%', 0.6);
      scene5Actions.scrollForumTo('p2');
      await delay(900);

      // Scroll back to hero post 1 for engagement.
      cam(1.0, 0, 0.4);
      scene5Actions.scrollForumTo('p1');
      await delay(500);

      // ── Phase 7: Community engagement — Like + Comment (6.5–8.2s) ────────

      // Like hero post 1.
      scene5Actions.likePost('p1');
      await delay(550);

      // Open comments.
      scene5Actions.openComments('p1');
      await delay(450);

      // Reveal prepared comment.
      scene5Actions.showPreparedComment('p1');
      await delay(550);

      // Close comments — return to clean feed.
      scene5Actions.closeComments();
      await delay(300);

      // ── Phase 8: Final community frame (8.2–9.5s) ─────────────────────────
      // Gentle final push — camera settles on the feed.
      cam(1.04, '-1%', S5.FINAL_PUSH_DURATION);
      await delay(s5t(S5.FINAL_PUSH_DURATION));

      // Hold on the composed final frame.
      await delay(s5t(S5.END_START - S5.FINAL_HOLD_START + S5.FINAL_PUSH_DURATION));
    };

    run().catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { scale: phoneScale, h: phoneH } = getPhoneDimensions();

  return (
    <div
      id="s5-root"
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#ffffff' }}
    >
      {/* ── Camera layer ─────────────────────────────────────────────────── */}
      <motion.div
        id="s5-camera"
        animate={cameraControls}
        initial={{ scale: 1, y: 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 40%',
        }}
      >
        {/* ── Phone frame ────────────────────────────────────────────────── */}
        <div
          id="s5-phone-frame"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '390px',
            height: `${phoneH}px`,
            transformOrigin: 'top center',
            transform: `translateX(-50%) scale(${phoneScale})`,
            overflow: 'hidden',
            background: '#ffffff',
          }}
        >
          {/* ── Home screen (Phase 1 / Scene 4 handoff) ────────────────── */}
          {screen === 'home' && <Scene5HomeScreen />}

          {/* ── Portfolio (Phase 3) — slides in from right ──────────────── */}
          <AnimatePresence>
            {screen === 'portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ x: '100%' }}
                animate={{ x: 0, transition: PAGE_SLIDE }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Scene5Portfolio
                  onViewForum={() => scene5Actions.openForum()}
                  onFloatingAction={() => {}}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Forum (Phase 5) — slides in from right ──────────────────── */}
          <AnimatePresence>
            {screen === 'forum' && (
              <motion.div
                key="forum"
                initial={{ x: '100%' }}
                animate={{ x: 0, transition: PAGE_SLIDE }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Scene5Forum
                  onBack={() => scene5Actions.openPortfolio()}
                  onEditForum={() => {}}
                  onFloatingAction={() => {}}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Side Navigation (renders on top when open) ──────────────── */}
          <Scene5SideNavigation
            isOpen={isNavOpen}
            onClose={() => dispatch({ type: 'CLOSE_SIDE_NAV' })}
            onViewPortfolio={() => scene5Actions.openPortfolio()}
            onSelectItem={() => {}}
          />

          {/* ── Tap ripple ──────────────────────────────────────────────── */}
          {tapPos && <Scene3TapRipple key={`tap-${tapKey}`} x={tapPos.x} y={tapPos.y} />}
        </div>
      </motion.div>

      {/* ── Entry dissolve overlay (Scene 4 → 5 transition) ─────────────── */}
      <div
        id="s5-entry-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          opacity: entryOpacity,
          pointerEvents: 'none',
          zIndex: 200,
          transition: `opacity ${S5.ENTRY_DISSOLVE_DURATION}s ease-out`,
        }}
      />
    </div>
  );
}
