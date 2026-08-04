/**
 * Scene3ReferralUI.tsx
 *
 * Self-contained, presentation-only copy of the locked Dream Planet
 * Referral Home interface for use in the Scene 3 cinematic animation.
 *
 * Rules:
 *  - No routing (no Link, no useLocation)
 *  - No interactive state (buttons are visual only)
 *  - Pixel-faithful to the locked dream-planet-referral module
 *  - Accepts AnimationControls for code card and View Levels emphasis
 *  - Referral code must remain: IK54OTRD
 */

import React from 'react';
import { motion, AnimationControls } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

// Avatar images — shared attached_assets folder (same @assets alias as referral app)
import yellowAvatarImg      from '@assets/D584BC4A-F374-4214-9909-3969CA68DFFF_1785791313737.png';
import lightBlueAvatarImg   from '@assets/90B081D0-1C60-4E73-82F9-438E59013B4A_1785791313737.png';
import pinkThumbsAvatarImg  from '@assets/3DF9C94B-3977-4E14-B891-1DEEC6A17354_1785791313737.png';
import hotPinkAvatarImg     from '@assets/61F98831-A057-42BC-84E4-E8862E1BE1E5_1785791313737.png';

export interface Scene3ReferralUIProps {
  /** Controls for the referral code card pulse (Phase 4) */
  codeCardControls?: AnimationControls;
  /** Controls for the View Levels tease (Phase 5) */
  viewLevelsControls?: AnimationControls;
}

export function Scene3ReferralUI({
  codeCardControls,
  viewLevelsControls,
}: Scene3ReferralUIProps) {
  return (
    <div
      id="s3-referral-home"
      style={{ width: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}
    >
      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <div
        id="s3-hero"
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #FF6B00 0%, #FF9A3C 100%)',
          paddingBottom: '56px',
        }}
      >
        {/* Sunburst rays */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '900px',
            height: '900px',
            transform: 'translate(-50%, -50%)',
            background: 'repeating-conic-gradient(from 0deg, transparent 0deg 13deg, rgba(255,255,255,0.12) 13deg 26deg)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Header row */}
        <div
          id="s3-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            cursor: 'default',
          }}>
            <ChevronLeft size={26} />
          </button>
          <span style={{
            background: 'white',
            color: 'black',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            Leaderboard
          </span>
        </div>

        {/* Title + avatar cluster */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          position: 'relative',
          zIndex: 2,
          paddingBottom: '8px',
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '24px',
            padding: '0 32px',
            lineHeight: 1.25,
            textShadow: '0 1px 4px rgba(0,0,0,0.15)',
            margin: '0 0 24px 0',
          }}>
            Refer your friends & earn
          </h1>

          {/* Avatar cluster — diamond arrangement matching locked UI */}
          <div style={{ position: 'relative', width: '220px', height: '210px' }}>
            {/* Top-center: pink thumbsup bearded */}
            <img src={pinkThumbsAvatarImg} alt="" style={{
              position: 'absolute', objectFit: 'contain',
              top: 0, left: '50%', transform: 'translateX(-55%)',
              width: '100px', height: '100px', zIndex: 3,
            }} />
            {/* Left: yellow glasses */}
            <img src={yellowAvatarImg} alt="" style={{
              position: 'absolute', objectFit: 'contain',
              top: '60px', left: 0,
              width: '98px', height: '98px', zIndex: 4,
            }} />
            {/* Right: light blue pointing */}
            <img src={lightBlueAvatarImg} alt="" style={{
              position: 'absolute', objectFit: 'contain',
              top: '66px', right: 0,
              width: '90px', height: '90px', zIndex: 4,
            }} />
            {/* Bottom-center: hot pink braids */}
            <img src={hotPinkAvatarImg} alt="" style={{
              position: 'absolute', objectFit: 'contain',
              bottom: 0, left: '50%', transform: 'translateX(-45%)',
              width: '96px', height: '96px', zIndex: 5,
            }} />
          </div>
        </div>

        {/* Referral code card — overlaps the bottom edge of hero */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 16px',
          transform: 'translateY(50%)',
          zIndex: 10,
        }}>
          <motion.div
            id="s3-code-card"
            animate={codeCardControls}
            initial={{ scale: 1 }}
            style={{ transformOrigin: 'center center' }}
          >
            <div style={{
              background: 'white',
              borderRadius: '9999px',
              padding: '8px 8px 8px 24px',
              width: '100%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #f3f4f6',
            }}>
              <span style={{
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'black',
              }}>
                IK54OTRD
              </span>
              <button style={{
                background: 'black',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '15px',
                border: 'none',
                cursor: 'default',
              }}>
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── STATS / TABS SECTION ─────────────────────────────────────── */}
      <div style={{
        flex: 1,
        background: 'white',
        paddingTop: '64px',
        padding: '64px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px 24px 0 0',
      }}>
        {/* Tab row */}
        <div style={{
          display: 'flex',
          gap: '32px',
          borderBottom: '1px solid #f3f4f6',
          marginBottom: '24px',
        }}>
          {/* Qualified tab — active */}
          <div style={{ paddingBottom: '16px', position: 'relative' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'black' }}>Qualified</span>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '2px', background: 'black', borderRadius: '2px 2px 0 0',
            }} />
          </div>
          {/* Pending tab */}
          <div style={{ paddingBottom: '16px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#9ca3af' }}>Pending</span>
          </div>
        </div>

        {/* Level summary row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'black', marginBottom: '4px' }}>
              bronze
            </div>
            {/* View Levels — animated for Phase 5 */}
            <motion.span
              id="s3-view-levels-link"
              animate={viewLevelsControls}
              initial={{ scale: 1 }}
              style={{
                color: '#FF6B00',
                fontWeight: 600,
                fontSize: '14px',
                display: 'inline-block',
                transformOrigin: 'left center',
              }}
            >
              View Levels
            </motion.span>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 700, color: 'black' }}>
            <span>0</span>
            <span style={{ color: '#9ca3af' }}> / 10</span>
          </div>
        </div>

        {/* Empty state */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
          fontSize: '14px',
          paddingTop: '32px',
        }}>
          No qualified referrals yet.
        </div>
      </div>
    </div>
  );
}
