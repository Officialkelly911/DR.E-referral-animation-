/**
 * Scene6CinematicAnimation.tsx
 *
 * Scene 6: "Join the Dream Planet Movement" — Revision Pass
 * (Functional Corrections + Premium CTA Redesign)
 *
 * Self-starting, self-contained cinematic animation. No user interaction.
 * Rendered at 1080 × 1920 for capture via Playwright.
 *
 * Journey (see Scene6Timeline.ts for the full phase breakdown):
 *   Home Feed (sidebar reveal demo) → Forum (continuous smooth scroll) →
 *   Notifications (replaces the old Community Forum summary screen) →
 *   Premium cinematic CTA → fade to black.
 *
 * Architecture
 * ────────────
 * A single useEffect drives the entire timeline via setTimeout, exactly as
 * before — deterministic, no randomness, reproducible frame-for-frame for
 * capture. Screen layers cross-fade via opacity; within each screen, motion
 * is driven by single continuous Framer Motion tweens (never chained
 * mid-flight state changes) to keep everything at a stable 60fps.
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { S6, s6t } from './Scene6Timeline';
import { Scene6HomeFeed } from './Scene6HomeFeed';
import { Scene6Sidebar } from './Scene6Sidebar';
import { Scene6ForumFeed } from './Scene6ForumFeed';
import { Scene6Notifications } from './Scene6Notifications';
import { Scene6PremiumCTA } from './Scene6PremiumCTA';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

type Screen = 'home' | 'forum' | 'notifications' | 'cta';

export function Scene6CinematicAnimation() {
  const startedRef = useRef(false);

  // Screen visibility (crossfade via opacity)
  const [screen, setScreen] = useState<Screen>('home');
  const [forumOpacity, setForumOpacity] = useState(0);
  const [notifOpacity, setNotifOpacity] = useState(0);
  const [ctaOpacity, setCtaOpacity] = useState(0);

  // Sidebar
  const [sidebarProgress, setSidebarProgress] = useState(0); // animated via CSS transition below

  // Forum / notifications scroll gates
  const [forumScrollActive, setForumScrollActive] = useState(false);
  const [notifStaggerIn, setNotifStaggerIn] = useState(false);
  const [notifScrollActive, setNotifScrollActive] = useState(false);

  // CTA phase gates
  const [ctaBgVisible, setCtaBgVisible] = useState(false);
  const [ctaLogoVisible, setCtaLogoVisible] = useState(false);
  const [ctaHeadlineVisible, setCtaHeadlineVisible] = useState(false);
  const [ctaReferralVisible, setCtaReferralVisible] = useState(false);
  const [ctaButtonsVisible, setCtaButtonsVisible] = useState(false);
  const [ctaButtonVisible, setCtaButtonVisible] = useState(false);
  const [ctaAmbientActive, setCtaAmbientActive] = useState(false);

  // End fade
  const [endOpacity, setEndOpacity] = useState(0);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      // Marks the exact moment the timeline begins, so the capture script
      // can measure (and compensate for) the page-load/networkidle delay
      // between "recording started" and "animation actually started" —
      // without this, a fixed capture duration silently truncates the
      // final fade-to-black.
      document.documentElement.setAttribute('data-s6-started', String(Date.now()));

      // ── P1: Home Feed hold ──────────────────────────────────────────────
      await delay(s6t(S6.HOME_HOLD_END - 0));

      // ── P2: Sidebar opens over Home Feed ─────────────────────────────────
      setSidebarProgress(1);
      await delay(s6t(S6.SIDEBAR_CLOSE_START - S6.SIDEBAR_OPEN_START));

      // ── P4: Sidebar closes ────────────────────────────────────────────────
      setSidebarProgress(0);
      await delay(s6t(S6.FORUM_REVEAL_START - S6.SIDEBAR_CLOSE_START));

      // ── P5: Crossfade Home → Forum ───────────────────────────────────────
      setScreen('forum');
      setForumOpacity(1);
      await delay(s6t(S6.FORUM_SCROLL_START - S6.FORUM_REVEAL_START));

      // ── P6: Forum continuous scroll ──────────────────────────────────────
      setForumScrollActive(true);
      await delay(s6t(S6.NOTIF_REVEAL_START - S6.FORUM_SCROLL_START));

      // ── P7: Crossfade Forum → Notifications ──────────────────────────────
      setScreen('notifications');
      setNotifOpacity(1);
      await delay(s6t(S6.NOTIF_STAGGER_START - S6.NOTIF_REVEAL_START));

      // ── P8: Notifications stagger-in, then gentle scroll ─────────────────
      setNotifStaggerIn(true);
      await delay(s6t(S6.NOTIF_SCROLL_START - S6.NOTIF_STAGGER_START));
      setNotifScrollActive(true);
      await delay(s6t(S6.CTA_REVEAL_START - S6.NOTIF_SCROLL_START));

      // ── P9: Crossfade Notifications → CTA ────────────────────────────────
      setScreen('cta');
      setCtaOpacity(1);
      await delay(s6t(S6.CTA_T0 - S6.CTA_REVEAL_START));

      // ── P10: Premium CTA sequence ─────────────────────────────────────────
      setCtaBgVisible(true);
      await delay(s6t(S6.CTA_LOGO_OFFSET));
      setCtaLogoVisible(true);
      await delay(s6t(S6.CTA_HEADLINE_OFFSET - S6.CTA_LOGO_OFFSET));
      setCtaHeadlineVisible(true);
      await delay(s6t(S6.CTA_REFERRAL_OFFSET - S6.CTA_HEADLINE_OFFSET));
      setCtaReferralVisible(true);
      await delay(s6t(S6.CTA_BUTTONS_OFFSET - S6.CTA_REFERRAL_OFFSET));
      setCtaButtonsVisible(true);
      await delay(s6t(S6.CTA_BUTTON_OFFSET - S6.CTA_BUTTONS_OFFSET));
      setCtaButtonVisible(true);
      await delay(s6t(S6.CTA_AMBIENT_OFFSET - S6.CTA_BUTTON_OFFSET));
      setCtaAmbientActive(true);

      // ── Final hold → fade to black ────────────────────────────────────────
      await delay(s6t(S6.END_START - (S6.CTA_T0 + S6.CTA_AMBIENT_OFFSET)));
      setEndOpacity(1);
    };

    run().catch(console.error);
  }, []);

  return (
    <div
      id="s6-root"
      style={{
        position: 'relative', width: '100%', height: '100%',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        background: '#0a0a0d',
      }}
    >
      {/* ── Layer 10: Home Feed (persists until crossfade to Forum) ─────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        opacity: screen === 'home' ? 1 : 0,
        transition: `opacity ${S6.SCREEN_CROSSFADE_DURATION}s ease-in-out`,
        pointerEvents: 'none',
      }}>
        <Scene6HomeFeed />
      </div>

      {/* ── Layer 40: Sidebar drawer (slides over Home Feed) ─────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 40,
        transition: `transform ${S6.SIDEBAR_OPEN_DURATION}s cubic-bezier(0.32,0.72,0,1)`,
        opacity: screen === 'home' ? 1 : 0,
        pointerEvents: 'none',
      }}>
        <Scene6Sidebar progress={sidebarProgress} />
      </div>

      {/* ── Layer 11: Forum feed ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 11,
        opacity: forumOpacity,
        transition: `opacity ${S6.SCREEN_CROSSFADE_DURATION}s ease-in-out`,
        pointerEvents: 'none',
      }}>
        <Scene6ForumFeed scrollActive={forumScrollActive} />
      </div>

      {/* ── Layer 12: Notifications (replaces the old Forum summary screen) ──── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 12,
        opacity: notifOpacity,
        transition: `opacity ${S6.SCREEN_CROSSFADE_DURATION}s ease-in-out`,
        pointerEvents: 'none',
      }}>
        <Scene6Notifications staggerIn={notifStaggerIn} scrollActive={notifScrollActive} />
      </div>

      {/* ── Layer 13: Premium CTA ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 13,
        opacity: ctaOpacity,
        transition: `opacity ${S6.SCREEN_CROSSFADE_DURATION}s ease-in-out`,
        pointerEvents: 'none',
      }}>
        <Scene6PremiumCTA
          bgVisible={ctaBgVisible}
          logoVisible={ctaLogoVisible}
          headlineVisible={ctaHeadlineVisible}
          referralVisible={ctaReferralVisible}
          buttonsVisible={ctaButtonsVisible}
          ctaButtonVisible={ctaButtonVisible}
          ambientActive={ctaAmbientActive}
        />
      </div>

      {/* ── Layer 100: End fade to black ──────────────────────────────────────── */}
      <div
        id="s6-end-overlay"
        style={{
          position: 'absolute', inset: 0,
          background: '#000000',
          opacity: endOpacity,
          pointerEvents: 'none',
          zIndex: 100,
          transition: `opacity ${S6.END_DURATION}s ease-in`,
        }}
      />
    </div>
  );
}
