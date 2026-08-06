/**
 * Scene6CinematicAnimation.tsx
 *
 * Phase 10 — Scene 6: "Join the Dream Planet Movement"
 *
 * Self-starting, self-contained cinematic animation. No user interaction.
 * Rendered at 1080 × 1920 for capture via Playwright.
 *
 * Architecture
 * ────────────
 * A single useEffect drives the entire timeline via setTimeout.
 * State bits gate CSS transitions and Framer Motion variants.
 * No randomness — all values are deterministic for consistent capture.
 *
 * Layer stack (z-index)
 * ─────────────────────
 *   0   Dark ambient background
 *   1   Orange glow radial (Framer Motion opacity)
 *   5   Ambient floating particles (persistent, subtle)
 *   10  Convergence particles (appear during dissolve, drift to center)
 *   15  Brand content (logo, tagline, CTA, referral card, badges)
 *   20  Forum final-frame recreation (CSS fades + blurs out)
 *   30  Entry overlay (instant — keeps first frame clean)
 *   100 Fade-to-black end overlay
 *
 * Timeline sourced from Scene6Timeline.ts — adjust values there only.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { S6, s6t } from './Scene6Timeline';

// ─── Asset imports (via @assets alias → project attached_assets) ──────────────

import logoUrl from '@assets/dp_logo_v1.svg';
import appIconUrl from '@assets/App_icon__1786044722968.WEBP';
import storeBadgesUrl from '@assets/store_badges.jpeg';

// ─── Easing curves ────────────────────────────────────────────────────────────

const EASE_SMOOTH  = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_LUXURY  = [0.16, 1.00, 0.30, 1.00] as const;

// ─── Delay helper ─────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// ─── Convergence particles ────────────────────────────────────────────────────
// Deterministic positions (no Math.random) — important for capture reproducibility.
// sx/sy: pixel offsets from the logo center. All converge to (0, 0).

interface Particle {
  id: number;
  sx: number;   // start x offset from logo center (px)
  sy: number;   // start y offset from logo center (px)
  size: number;
  color: string;
  delayS: number;
}

const CONVERGENCE_PARTICLES: Particle[] = [
  { id:  1, sx: -320, sy: -480, size: 8,  color: '#FF6B00', delayS: 0.00 },
  { id:  2, sx:  360, sy: -420, size: 5,  color: '#FF8C3A', delayS: 0.10 },
  { id:  3, sx: -380, sy:  -80, size: 7,  color: '#FF6B00', delayS: 0.06 },
  { id:  4, sx:  400, sy:  -60, size: 9,  color: '#FFB347', delayS: 0.16 },
  { id:  5, sx: -260, sy:  300, size: 5,  color: '#FF6B00', delayS: 0.08 },
  { id:  6, sx:  300, sy:  280, size: 6,  color: '#FF8C3A', delayS: 0.14 },
  { id:  7, sx:   20, sy: -500, size: 4,  color: '#FF6B00', delayS: 0.20 },
  { id:  8, sx:  -30, sy:  500, size: 7,  color: '#FFB347', delayS: 0.04 },
  { id:  9, sx: -180, sy:  460, size: 5,  color: '#FF6B00', delayS: 0.12 },
  { id: 10, sx:  200, sy:  440, size: 8,  color: '#FF8C3A', delayS: 0.18 },
  { id: 11, sx: -420, sy:  180, size: 3,  color: '#FF6B00', delayS: 0.02 },
  { id: 12, sx:  440, sy:  200, size: 3,  color: '#FF8C3A', delayS: 0.22 },
];

// ─── Forum final-frame recreation (Scene 5 end state) ────────────────────────

function ForumPost({
  title, author, likes, hot, index,
}: {
  title: string; author: string; likes: number; hot?: boolean; index: number;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.035)',
      borderRadius: '14px',
      padding: '14px 16px',
      marginBottom: '10px',
      border: '1px solid rgba(255,255,255,0.055)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: index % 2 === 0
            ? 'linear-gradient(135deg,#FF6B00,#cc5500)'
            : 'linear-gradient(135deg,#FF8C3A,#e05a00)',
          flexShrink: 0,
        }} />
        <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 500 }}>{author}</span>
        {hot && (
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(255,107,0,0.18)',
            color: '#FF6B00',
            fontSize: '9px', fontWeight: 700,
            padding: '2px 7px', borderRadius: '4px',
            letterSpacing: '0.05em',
          }}>HOT</span>
        )}
      </div>
      <p style={{
        color: '#e5e7eb', fontSize: '13px', fontWeight: 500,
        margin: '0 0 10px', lineHeight: 1.45,
      }}>{title}</p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span style={{ color: '#FF6B00', fontSize: '11px', fontWeight: 600 }}>♥ {likes}</span>
        <span style={{ color: '#6b7280', fontSize: '11px' }}>💬 {Math.floor(likes / 3)}</span>
      </div>
    </div>
  );
}

function Scene5ForumFinalFrame({ scale }: { scale: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#111114',
      fontFamily: "'Inter', sans-serif",
      transform: `scale(${scale})`,
      transformOrigin: '50% 40%',
    }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#111114',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '6px',
        }}>
          <span style={{ color: '#fff', fontSize: '17px', fontWeight: 700 }}>
            Community Forum
          </span>
          <span style={{
            fontSize: '11px', color: '#FF6B00', fontWeight: 600,
            border: '1px solid rgba(255,107,0,0.35)',
            padding: '3px 10px', borderRadius: '6px',
          }}>Edit Forum</span>
        </div>
        <span style={{ color: '#6b7280', fontSize: '11px' }}>
          2.4k members · 847 posts this week
        </span>
      </div>

      {/* Posts */}
      <div style={{ padding: '14px 20px', overflow: 'hidden' }}>
        <ForumPost
          title="Hit 10k referrals this month! The Dream Planet system actually works 🚀"
          author="@creativewaves"
          likes={284}
          hot
          index={0}
        />
        <ForumPost
          title="Tips for growing your referral network in the first 30 days"
          author="@luna.creates"
          likes={156}
          index={1}
        />
        <ForumPost
          title="Reached Gold tier — here's what changed for my earnings"
          author="@marcus.dp"
          likes={97}
          index={2}
        />
        <ForumPost
          title="Just unlocked 'Community Leader' badge after 500 referrals 🏆"
          author="@queenportia"
          likes={72}
          index={3}
        />
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around',
        padding: '14px 0 24px',
        borderTop: '1px solid rgba(255,255,255,0.055)',
        background: '#0d0d10',
        fontSize: '11px', color: '#6b7280',
      }}>
        <span>Home</span>
        <span>Explore</span>
        <span style={{ color: '#FF6B00', fontWeight: 700 }}>Invest</span>
        <span>Profile</span>
      </div>
    </div>
  );
}

// ─── Referral card ────────────────────────────────────────────────────────────

function ReferralCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.065)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,107,0,0.28)',
      borderRadius: '22px',
      padding: '22px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      boxShadow: [
        '0 0 0 1px rgba(255,107,0,0.08)',
        '0 0 48px rgba(255,107,0,0.18)',
        '0 12px 40px rgba(0,0,0,0.45)',
      ].join(', '),
      minWidth: '268px',
    }}>
      <img
        src={appIconUrl}
        alt="Dream Planet"
        style={{
          width: '48px', height: '48px',
          borderRadius: '12px',
          objectFit: 'cover',
          marginBottom: '2px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      />
      <span style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
      }}>Referral Code</span>
      <span style={{
        color: '#FF6B00',
        fontSize: '28px', fontWeight: 800,
        letterSpacing: '0.18em',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
      }}>IK54OTRD</span>
      <span style={{
        color: 'rgba(255,255,255,0.35)',
        fontSize: '10px', fontWeight: 400,
        marginTop: '2px',
      }}>dreamplanet.org/referral/IK54OTRD</span>
    </div>
  );
}

// ─── Main animation component ─────────────────────────────────────────────────

export function Scene6CinematicAnimation() {
  const startedRef = useRef(false);

  // Forum layer state
  const [forumOpacity, setForumOpacity] = useState(1);
  const [forumBlur,    setForumBlur]    = useState(0);
  const [forumScale,   setForumScale]   = useState(1.04); // match S5 final push

  // Background glow
  const [bgGlow, setBgGlow] = useState(false);

  // Particle state
  const [particlesActive, setParticlesActive] = useState(false);

  // Brand content visibility
  const [logoVisible,     setLogoVisible]     = useState(false);
  const [taglineVisible,  setTaglineVisible]  = useState(false);
  const [ctaVisible,      setCtaVisible]      = useState(false);
  const [referralVisible, setReferralVisible] = useState(false);
  const [badgesVisible,   setBadgesVisible]   = useState(false);

  // End fade
  const [endOpacity, setEndOpacity] = useState(0);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      // ── Phase 1: Forum hold (0.0–0.75s) ─────────────────────────────────────
      await delay(s6t(S6.FORUM_HOLD_END));

      // ── Phase 2: UI dissolve (0.75–2.25s) ───────────────────────────────────
      setParticlesActive(true);
      setForumOpacity(0);
      setForumBlur(16);
      setForumScale(1.08); // gentle push-in as it dissolves
      setBgGlow(true);

      // ── Phase 3: Logo formation (2.25s) ─────────────────────────────────────
      await delay(s6t(S6.LOGO_START - S6.DISSOLVE_START));
      setLogoVisible(true);

      // ── Phase 4: Tagline (3.20s) ─────────────────────────────────────────────
      await delay(s6t(S6.TAGLINE_START - S6.LOGO_START));
      setTaglineVisible(true);

      // ── Phase 5: CTA (3.70s) ─────────────────────────────────────────────────
      await delay(s6t(S6.CTA_START - S6.TAGLINE_START));
      setCtaVisible(true);

      // ── Phase 5b: Referral card (4.50s) ──────────────────────────────────────
      await delay(s6t(S6.REFERRAL_START - S6.CTA_START));
      setReferralVisible(true);

      // ── Phase 6: Store badges (5.20s) ────────────────────────────────────────
      await delay(s6t(S6.BADGES_START - S6.REFERRAL_START));
      setBadgesVisible(true);

      // ── Phase 7: Final hold → fade to black (7.70s) ──────────────────────────
      await delay(s6t(S6.END_START - S6.BADGES_START));
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
      {/* ── Layer 0: Dark ambient ─────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, background: '#0a0a0d', zIndex: 0 }} />

      {/* ── Layer 1: Orange glow (fades in with bg transition) ───────────────── */}
      <motion.div
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        animate={{ opacity: bgGlow ? 1 : 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 2.0, ease: EASE_SMOOTH }}
      >
        {/* Central orange radial — where the logo appears */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 65% 40% at 50% 36%, rgba(255,107,0,0.20) 0%, transparent 70%)',
        }} />
        {/* Edge vignette — keeps the composition premium */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 45%, rgba(0,0,0,0.65) 100%)',
        }} />
        {/* Subtle horizontal accent line at logo level */}
        <div style={{
          position: 'absolute',
          top: '36%', left: '20%', right: '20%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.15), transparent)',
        }} />
      </motion.div>

      {/* ── Layer 5: Ambient floating particles (persistent atmospheric) ──────── */}
      {[0,1,2,3,4,5].map(i => (
        <motion.div
          key={`amb-${i}`}
          style={{
            position: 'absolute',
            width: '3px', height: '3px',
            borderRadius: '50%',
            background: '#FF6B00',
            left: `${18 + i * 13}%`,
            top:  `${22 + (i % 3) * 22}%`,
            zIndex: 5,
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.15, 0.40, 0.15] }}
          transition={{
            duration: 2.8 + i * 0.45,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.35,
          }}
        />
      ))}

      {/* ── Layer 10: Convergence particles — drift from screen edges to center ─ */}
      {/* The container sits at the logo center */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '36%',
        transform: 'translate(-50%, -50%)',
        width: 0, height: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        {CONVERGENCE_PARTICLES.map(p => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              width: `${p.size}px`, height: `${p.size}px`,
              borderRadius: p.size > 6 ? '3px' : '50%',
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}80`,
              // Initial: at offset from center
              left: `${p.sx}px`,
              top:  `${p.sy}px`,
              marginLeft: `-${p.size / 2}px`,
              marginTop:  `-${p.size / 2}px`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={particlesActive ? {
              x: -p.sx,       // drift to center (0,0)
              y: -p.sy,
              opacity: [0, 0.85, 0.85, 0],
              scale:   [0, 1.3, 1.0, 0.2],
            } : {}}
            transition={{
              duration: 1.55,
              delay: p.delayS,
              ease: EASE_LUXURY,
            }}
          />
        ))}
      </div>

      {/* ── Layer 15: Brand content ───────────────────────────────────────────── */}
      <div
        id="s6-brand"
        style={{
          position: 'absolute', inset: 0,
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 36px 100px',
          gap: 0,
        }}
      >
        {/* Logo */}
        <motion.div
          animate={logoVisible
            ? { opacity: 1, scale: 1,    y: 0 }
            : { opacity: 0, scale: 0.90, y: 18 }}
          initial={  { opacity: 0, scale: 0.90, y: 18 }}
          transition={{ duration: S6.LOGO_DURATION, ease: EASE_LUXURY }}
          style={{ marginBottom: '14px' }}
        >
          <div style={{
            filter: logoVisible
              ? 'drop-shadow(0 0 28px rgba(255,107,0,0.50)) drop-shadow(0 0 60px rgba(255,107,0,0.20))'
              : 'none',
            transition: 'filter 1.2s ease-out',
          }}>
            <img
              src={logoUrl}
              alt="Dream Planet"
              style={{
                width: '130px',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          animate={taglineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          initial={               { opacity: 0, y: 10 }}
          transition={{ duration: S6.TAGLINE_DURATION, ease: EASE_SMOOTH }}
          style={{
            color: 'rgba(255,255,255,0.60)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textAlign: 'center',
            margin: '0 0 36px',
            textTransform: 'uppercase',
          }}
        >
          More Than Followers
        </motion.p>

        {/* CTA */}
        <motion.div
          animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          initial={            { opacity: 0, y: 14 }}
          transition={{ duration: S6.CTA_DURATION, ease: EASE_SMOOTH }}
          style={{ textAlign: 'center', marginBottom: '30px' }}
        >
          <h1 style={{
            color: '#ffffff',
            fontSize: '26px',
            fontWeight: 800,
            margin: '0 0 9px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            Join Dream Planet Today
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.50)',
            fontSize: '14px',
            fontWeight: 400,
            margin: 0,
            lineHeight: 1.55,
          }}>
            Start earning with your community.
          </p>
        </motion.div>

        {/* Referral card */}
        <motion.div
          animate={referralVisible
            ? { opacity: 1, y: 0,  scale: 1    }
            : { opacity: 0, y: 22, scale: 0.96 }}
          initial={  { opacity: 0, y: 22, scale: 0.96 }}
          transition={{ duration: S6.REFERRAL_DURATION, ease: EASE_LUXURY }}
          style={{ marginBottom: '26px' }}
        >
          <ReferralCard />
        </motion.div>

        {/* Store badges */}
        <motion.div
          animate={badgesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          initial={              { opacity: 0, y: 10 }}
          transition={{ duration: S6.BADGES_DURATION, ease: EASE_SMOOTH }}
        >
          <img
            src={storeBadgesUrl}
            alt="Download on App Store & Google Play"
            style={{
              width: '160px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '10px',
              display: 'block',
              opacity: 0.90,
            }}
          />
        </motion.div>
      </div>

      {/* ── Layer 20: Forum final frame (fades + blurs out) ───────────────────── */}
      <div
        id="s6-forum-layer"
        style={{
          position: 'absolute', inset: 0,
          zIndex: 20,
          opacity: forumOpacity,
          filter: `blur(${forumBlur}px)`,
          transition: [
            `opacity ${S6.DISSOLVE_DURATION}s ease-out`,
            `filter   ${S6.BLUR_DURATION}s ease-out`,
          ].join(', '),
          pointerEvents: 'none',
        }}
      >
        <Scene5ForumFinalFrame scale={forumScale} />
      </div>

      {/* ── Layer 100: End fade to black ─────────────────────────────────────── */}
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
