/**
 * Scene5CinematicAnimation.tsx
 *
 * Phase 6 — Cinematic Scene 5 animation (~10.0 s).
 *
 * Architecture
 * ────────────
 * Renders inside Scene5InteractionProvider. Every UI state change goes
 * through scene5Actions — the same deterministic API used by Phase 5 QA.
 * No duplicate interaction logic lives here.
 *
 * Camera layer
 * ────────────
 * A single Framer Motion `motion.div` wraps the phone frame and applies
 * scale + y transforms for cinematic push-ins, matching Scenes 3 & 4.
 * transformOrigin: '50% 40%' keeps the camera biased toward the upper
 * content area.
 *
 * Portfolio scroll
 * ────────────────
 * The Portfolio mounts as a single scrollable column ([data-scene5="portfolio-page"]).
 * We imperatively scroll that element to reveal the media grid during Phase 3,
 * then scroll back before triggering View Forum. This is the only place where
 * a raw DOM scroll is used — everything else goes through scene5Actions.
 *
 * Timeline (all timings sourced from Scene5Timeline.ts)
 * ────────
 *   Phase 1  (0.00–0.70s)  Scene 4 handoff → Side Nav opens
 *   Phase 2  (0.70–1.40s)  View Portfolio tap → Portfolio enters
 *   Phase 3  (1.40–3.00s)  Portfolio reveal — profile push + media grid scroll
 *   Phase 4  (3.00–3.80s)  View Forum tap → Forum enters
 *   Phase 5  (3.80–4.80s)  Forum header + first post reveal
 *   Phase 6  (4.80–6.40s)  Community discovery — feed scroll
 *   Phase 6b (6.40–7.20s)  Forum Overview beat
 *   Phase 7  (7.20–8.80s)  Engagement — Like + Comment + Share
 *   Phase 8  (8.80–10.0s)  Final frame — settle + hold
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

// ─── Easing curves ────────────────────────────────────────────────────────────

const EASE_SMOOTH   = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Delay helper ─────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

// ─── Tap ripple type ──────────────────────────────────────────────────────────

interface TapPos { x: number; y: number }

// ─── Phone frame sizing ───────────────────────────────────────────────────────

function getPhoneDimensions() {
  if (typeof window === 'undefined') return { scale: 2.769, h: 693 };
  const scale = window.innerWidth / 390;
  const h     = Math.ceil(window.innerHeight / scale);
  return { scale, h };
}

// ─── Smooth DOM scroll (for Portfolio media reveal) ───────────────────────────

function scrollPortfolioTo(targetY: number) {
  const el = document.querySelector('[data-scene5="portfolio-page"]') as HTMLElement | null;
  if (!el) return;
  el.scrollTo({ top: targetY, behavior: 'smooth' });
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
        <div
          data-scene5-action="open-navigation"
          style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px' }}
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
        position: 'absolute', bottom: '110px', right: '20px',
        width: '52px', height: '52px', borderRadius: '50%',
        background: '#FF6B00',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 16px rgba(255,107,0,0.4)',
      }}>
        <Plus color="#fff" size={26} />
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around',
        padding: '14px 0 24px',
        borderTop: '1px solid #e5e7eb', background: '#fff',
        fontSize: '11px', color: '#9ca3af',
      }}>
        <span>Home</span>
        <span>Explore</span>
        <span style={{ color: '#FF6B00', fontWeight: 600 }}>Invest</span>
        <span>Profile</span>
      </div>
    </div>
  );
}

// ─── Page slide transition config ─────────────────────────────────────────────

const PAGE_SLIDE = { duration: 0.38, ease: EASE_SMOOTH };

// ─── Main cinematic component (rendered inside InteractionProvider) ────────────

export function Scene5CinematicInner() {
  const { state, dispatch } = useScene5Interaction();
  const screen    = state.navigationState;
  const isNavOpen = state.sideNavOpen;

  const cameraControls                   = useAnimation();
  const [tapPos, setTapPos]              = useState<TapPos | null>(null);
  const [tapKey, setTapKey]              = useState(0);
  const [entryOpacity, setEntryOpacity]  = useState(1);
  const startedRef                       = useRef(false);

  // Register scene5Actions against this component's dispatch.
  const dispatchRef = useRef<React.Dispatch<Scene5InteractionAction> | null>(null);
  dispatchRef.current = dispatch;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    scene5Actions.register(dispatchRef);

    // ── Helpers ──────────────────────────────────────────────────────────────

    const showTap = async (x: number, y: number, holdMs = 280) => {
      setTapPos({ x, y });
      setTapKey(k => k + 1);
      await delay(holdMs);
      setTapPos(null);
    };

    const cam = (scale: number, y: string | number, duration: number) =>
      cameraControls.start({ scale, y, transition: { duration, ease: EASE_SMOOTH } });

    // ── Timeline ─────────────────────────────────────────────────────────────

    const run = async () => {

      // ══ Phase 1: Scene 4 → Side Navigation (0.0–0.70s) ══════════════════
      // Entry white overlay dissolves out — reveals home screen (Scene 4 handoff)
      await delay(80);
      setEntryOpacity(0); // CSS transition fades the overlay

      // Hamburger tap at ~0.25s
      await delay(s5t(S5.TAP_HAMBURGER) - 80);
      await showTap(28, 68); // hamburger icon: x=28, y=68 in 390px space

      await delay(60);
      scene5Actions.openSideNavigation();
      // Drawer slides in (~320ms animation). Wait until SIDE_NAV_HOLD.
      await delay(s5t(S5.SIDE_NAV_HOLD - S5.OPEN_SIDE_NAV) - 60);

      // ══ Phase 2: Side Navigation → Portfolio (0.70–1.40s) ════════════════
      // Subtle camera drift towards "View Portfolio" in the drawer.
      cam(1.04, '-0.5%', 0.30);
      await delay(280);

      // "View Portfolio" tap — inside the 390px nav, roughly center-left.
      await showTap(185, 148);
      await delay(60);

      scene5Actions.openPortfolio();

      // Camera resets as drawer exits.
      cam(1.0, 0, 0.25);

      // Wait for drawer exit (~320ms) + Portfolio slide-in (~380ms).
      await delay(480);

      // ══ Phase 3: Portfolio reveal — profile + media grid (1.40–3.00s) ════

      // 3a: Cinematic push toward profile header.
      cam(1.08, '-2%', S5.PORTFOLIO_PUSH_DURATION);
      await delay(s5t(S5.PORTFOLIO_PUSH_DURATION + 0.10));

      // 3b: Pull back a little while we scroll to media grid.
      cam(1.04, '0%', 0.40);
      await delay(200);

      // 3c: Scroll portfolio page down to reveal the media grid.
      //     Approximate scroll offset to clear the dark header (~340px in 390px space).
      scrollPortfolioTo(320);
      await delay(s5t(S5.PORTFOLIO_MEDIA_HOLD - S5.PORTFOLIO_SCROLL_DOWN));

      // 3d: Scroll back to top so "View Forum" is visible.
      scrollPortfolioTo(0);
      await delay(s5t(S5.CAMERA_RESET_START - S5.PORTFOLIO_SCROLL_UP));

      // 3e: Camera reset before View Forum tap.
      cam(1.0, 0, S5.CAMERA_RESET_DURATION);
      await delay(s5t(S5.CAMERA_RESET_DURATION + 0.05));

      // ══ Phase 4: View Forum tap → Forum (3.00–3.80s) ═════════════════════
      // Slight drift toward "View Forum" button in the portfolio profile area.
      cam(1.03, '-0.5%', 0.20);
      await delay(180);

      // "View Forum" tap — bottom of the dark profile header, right side.
      await showTap(298, 222);
      await delay(60);

      scene5Actions.openForum();
      cam(1.0, 0, 0.25);

      // Wait for Forum slide-in (~380ms).
      await delay(s5t(S5.FORUM_ENTER - S5.OPEN_FORUM));

      // ══ Phase 5: Forum reveal (3.80–4.80s) ════════════════════════════════
      cam(1.06, '-1%', S5.FORUM_PUSH_DURATION);
      await delay(s5t(S5.FORUM_PUSH_DURATION + 0.15));

      // Pull back before scroll begins.
      cam(1.0, 0, 0.35);
      await delay(350);

      // ══ Phase 6: Community discovery — feed scroll (4.80–6.40s) ══════════
      scene5Actions.scrollForumTo('p1');
      await delay(700);

      // Gentle downward camera drift as we scroll toward post 2.
      cam(1.03, '1%', 0.55);
      scene5Actions.scrollForumTo('p2');
      await delay(s5t(S5.P2_HOLD - S5.SCROLL_TO_P2));

      // Reset camera, scroll back toward post 1 before Overview.
      cam(1.0, 0, 0.40);
      scene5Actions.scrollForumTo('p1');
      await delay(400);

      // ══ Phase 6b: Forum Overview beat (6.40–7.20s) ═══════════════════════
      // Switch to Overview tab — shows community identity, members, guidelines.
      scene5Actions.switchForumTab('overview');
      await delay(s5t(S5.OVERVIEW_HOLD - S5.SWITCH_TO_OVERVIEW));

      // Switch back to Post Feed and let it settle.
      scene5Actions.switchForumTab('post');
      await delay(s5t(S5.POST_FEED_SETTLE - S5.SWITCH_BACK_TO_POST));

      // ══ Phase 7: Community engagement (7.20–8.80s) ════════════════════════

      // 7a: Like hero post 1.
      scene5Actions.likePost('p1');
      await delay(s5t(S5.OPEN_COMMENTS_P1 - S5.LIKE_P1));

      // 7b: Open comment sheet.
      scene5Actions.openComments('p1');
      await delay(s5t(S5.SHOW_COMMENT - S5.OPEN_COMMENTS_P1));

      // 7c: Reveal prepared comment.
      scene5Actions.showPreparedComment('p1');
      await delay(s5t(S5.CLOSE_COMMENTS - S5.SHOW_COMMENT));

      // 7d: Close comment sheet + scroll to post 2 for share.
      scene5Actions.closeComments();
      await delay(250);
      scene5Actions.scrollForumTo('p2');
      await delay(s5t(S5.OPEN_SHARE_P2 - S5.CLOSE_COMMENTS) - 250);

      // 7e: Open share panel on post 2.
      scene5Actions.openShare('p2');
      await delay(s5t(S5.CONFIRM_SHARE_P2 - S5.OPEN_SHARE_P2));

      // 7f: Confirm share — "Link Copied" state.
      scene5Actions.confirmShare('p2');
      await delay(s5t(S5.CLOSE_SHARE - S5.CONFIRM_SHARE_P2));

      // 7g: Close share panel — clean feed.
      scene5Actions.closeShare();
      await delay(200);

      // ══ Phase 8: Final frame — settle + hold (8.80–10.0s) ════════════════
      // Gentle final push. Settle on the community forum feed.
      cam(1.04, '-1%', S5.FINAL_PUSH_DURATION);
      await delay(s5t(S5.FINAL_PUSH_DURATION + 0.05));

      // Hold on the clean final frame until capture ends.
      await delay(s5t(S5.TOTAL - S5.FINAL_HOLD_START));
    };

    run().catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { scale: phoneScale, h: phoneH } = getPhoneDimensions();

  return (
    <div
      id="s5-root"
      style={{
        position: 'relative', width: '100%', height: '100%',
        overflow: 'hidden', background: '#ffffff',
      }}
    >
      {/* ── Camera layer ─────────────────────────────────────────────────── */}
      <motion.div
        id="s5-camera"
        animate={cameraControls}
        initial={{ scale: 1, y: 0 }}
        style={{ position: 'absolute', inset: 0, transformOrigin: '50% 40%' }}
      >
        {/* ── Phone frame ────────────────────────────────────────────────── */}
        <div
          id="s5-phone-frame"
          style={{
            position: 'absolute',
            top: 0, left: '50%',
            width: '390px', height: `${phoneH}px`,
            transformOrigin: 'top center',
            transform: `translateX(-50%) scale(${phoneScale})`,
            overflow: 'hidden',
            background: '#ffffff',
          }}
        >
          {/* ── Home screen (Scene 4 handoff) ──────────────────────────── */}
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

          {/* ── Side Navigation (always on top when open) ───────────────── */}
          <Scene5SideNavigation
            isOpen={isNavOpen}
            onClose={() => dispatch({ type: 'CLOSE_SIDE_NAV' })}
            onViewPortfolio={() => scene5Actions.openPortfolio()}
            onSelectItem={() => {}}
          />

          {/* ── Tap ripple ──────────────────────────────────────────────── */}
          {tapPos && (
            <Scene3TapRipple key={`tap-${tapKey}`} x={tapPos.x} y={tapPos.y} />
          )}
        </div>
      </motion.div>

      {/* ── Entry dissolve overlay (Scene 4 → 5 transition) ─────────────── */}
      <div
        id="s5-entry-overlay"
        style={{
          position: 'absolute', inset: 0,
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
