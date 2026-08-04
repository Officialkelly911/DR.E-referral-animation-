/**
 * Scene3LevelsUI.tsx
 *
 * Self-contained Referral Levels page for the Scene 3 cinematic animation.
 * Pixel-faithful to the locked dream-planet-referral Levels screen.
 *
 * Rules:
 *  - No routing / no Link / no wouter
 *  - No interactive state
 *  - Bronze is the active badge; Silver and Gold peek from the edges
 *  - Stagger reveal driven by parent via revealControls
 */

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Lock } from 'lucide-react';

type AnimationControls = ReturnType<typeof useAnimation>;

import bronzeBadge from '@assets/A11ED17F-C652-4842-860A-238B900B4582_1785791355033.png';
import silverBadge from '@assets/53083A32-EC5F-4005-B708-C200E43E8F4A_1785791355033.png';
import goldBadge from '@assets/68639902-95DA-48F1-91B5-E14F971DE277_1785791355033.png';

// 4-pointed diamond sparkle
function DiamondSparkle({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="#FF6B00"
      style={{ position: 'absolute', ...style }}
      aria-hidden="true"
    >
      <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
    </svg>
  );
}

// Framer Motion stagger variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export interface Scene3LevelsUIProps {
  revealControls?: AnimationControls;
}

export function Scene3LevelsUI({ revealControls }: Scene3LevelsUIProps) {
  return (
    <div
      id="s3-levels"
      style={{
        width: '390px',
        minHeight: '100%',
        background: '#FFF5EE',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background sparkle decorations */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <DiamondSparkle size={22} style={{ top: 108, left: 28, opacity: 0.6 }} />
        <DiamondSparkle size={14} style={{ top: 148, left: 56, opacity: 0.5 }} />
        <DiamondSparkle size={18} style={{ top: 100, right: 48, opacity: 0.5 }} />
        <DiamondSparkle size={12} style={{ top: 140, right: 24, opacity: 0.4 }} />
        <DiamondSparkle size={20} style={{ top: 168, right: 80, opacity: 0.55 }} />
        <DiamondSparkle size={16} style={{ top: 128, left: 88, opacity: 0.45 }} />
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            color: '#000',
            border: 'none',
            cursor: 'default',
          }}
        >
          <ChevronLeft size={26} />
        </button>
        <h1
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 18,
            fontWeight: 700,
            color: '#000',
            margin: 0,
          }}
        >
          Levels
        </h1>
        {/* "Leaderboard" navigation pill — tap target for Phase 7 (~x=330, y=36) */}
        <span
          id="s3-levels-leaderboard-btn"
          style={{
            background: 'white',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap',
            cursor: 'default',
          }}
        >
          Leaderboard
        </span>
      </div>

      {/* Animated content */}
      <motion.div
        animate={revealControls}
        initial="hidden"
        variants={containerVariants}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 48 }}
      >
        {/* Badge carousel — Bronze active, Silver/Gold peek */}
        <motion.div
          variants={badgeVariants}
          style={{
            position: 'relative',
            height: 240,
            overflow: 'hidden',
            marginTop: 8,
          }}
        >
          {/* Left nav arrow — disabled (Bronze is first) */}
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: 40,
              height: 40,
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.4,
            }}
          >
            <ChevronLeft size={22} />
          </div>

          {/* Right nav arrow — active */}
          <div
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: 40,
              height: 40,
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronRight size={22} />
          </div>

          {/* Bronze badge — centered, active (large) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              width: 170,
              height: 170,
              zIndex: 10,
            }}
          >
            <img src={bronzeBadge} alt="Bronze" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18))' }} />
          </div>

          {/* Silver badge — peeking from right */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translateX(calc(-50% + 195px)) translateY(-50%)`,
              width: 100,
              height: 100,
              zIndex: 5,
              opacity: 0.45,
            }}
          >
            <img src={silverBadge} alt="Silver" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </motion.div>

        {/* Bronze level content card */}
        <motion.div variants={itemVariants} style={{ padding: '0 0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24, paddingTop: 8 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#000', margin: '0 0 8px 0' }}>Bronze</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#9ca3af', fontWeight: 500 }}>
              <span>0/10 referrals</span>
            </div>
          </div>

          <div
            style={{
              background: '#1A1A1A',
              borderRadius: 24,
              padding: 24,
              color: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
              margin: '0 16px',
            }}
          >
            {/* Reward */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ marginTop: 2, background: 'rgba(255,255,255,0.2)', padding: 4, borderRadius: '50%', display: 'flex' }}>
                <Check size={16} color="white" />
              </div>
              <p style={{ fontWeight: 600, fontSize: 17, lineHeight: 1.4, margin: 0 }}>
                Get $40 when 10 of your referrals complete an activity.
              </p>
            </div>

            {/* Requirements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ marginTop: 2, background: 'rgba(255,255,255,0.2)', padding: 4, borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
                  <Check size={16} color="white" />
                </div>
                <p style={{ color: '#d1d5db', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>
                  Referred users must complete user onboarding
                </p>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ marginTop: 2, background: 'rgba(255,255,255,0.2)', padding: 4, borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
                  <Check size={16} color="white" />
                </div>
                <p style={{ color: '#d1d5db', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>
                  Join at least 2 forums and engage with at least 3 posts
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Silver / Gold locked cards — hinted */}
        <motion.div
          variants={itemVariants}
          style={{ margin: '8px 16px 0', display: 'flex', gap: 12 }}
        >
          {[
            { name: 'Silver', icon: silverBadge, pts: '$100' },
            { name: 'Gold',   icon: goldBadge,   pts: '$200' },
          ].map(level => (
            <div
              key={level.name}
              style={{
                flex: 1,
                background: '#f3f4f6',
                borderRadius: 16,
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                opacity: 0.7,
              }}
            >
              <img src={level.icon} alt={level.name} style={{ width: 40, height: 40, objectFit: 'contain', opacity: 0.5 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4b5563' }}>{level.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9ca3af', fontSize: 12 }}>
                <Lock size={11} />
                <span>Locked</span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
