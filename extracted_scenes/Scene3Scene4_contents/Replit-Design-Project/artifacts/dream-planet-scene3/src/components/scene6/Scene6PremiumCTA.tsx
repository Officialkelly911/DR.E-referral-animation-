/**
 * Scene6PremiumCTA.tsx
 *
 * Premium CTA Redesign (Part B of the Scene 6 revision).
 *
 * Discards the old flat-black / plain-text CTA. Creative direction target:
 * Apple product launch × Stripe landing page × Linear.app motion — premium,
 * elegant, confident, never flashy. Preserves the approved message exactly
 * (referral code, download destinations, campaign branding) while rebuilding
 * the presentation from scratch.
 */

import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import logoUrl from '@assets/dp_logo_v1.svg';
import appIconUrl from '@assets/App_icon__1786044722968.WEBP';

const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_LUXURY = [0.16, 1.00, 0.30, 1.00] as const;

/** A single diagonal light band that sweeps once across its parent. Wrap the
 *  parent with `overflow: hidden` and `position: relative` for a clean clip. */
function LightSweep({ play, delay = 0 }: { play: boolean; delay?: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute', top: 0, bottom: 0, left: 0,
        width: '55%',
        background: 'linear-gradient(75deg, transparent 30%, rgba(255,255,255,0.30) 50%, transparent 70%)',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
      initial={{ x: '-140%' }}
      animate={play ? { x: '220%' } : { x: '-140%' }}
      transition={{ duration: 1.1, delay: delay + 0.15, ease: 'easeInOut' }}
    />
  );
}

function GooglePlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M3.6 2.4c-.3.3-.5.7-.5 1.2v16.8c0 .5.2.9.5 1.2l.1.1L13 12.3v-.2L3.7 2.3l-.1.1z" fill="#00D2FF" />
      <path d="M16.2 15.5 13 12.3v-.2l3.2-3.2 3.6 2c1 .6 1 1.5 0 2.1l-3.6 2z" fill="#FFCF00" />
      <path d="M16.2 15.5 13 12.2 3.6 21.6c.4.4 1 .4 1.7.1l10.9-6.2" fill="#FF3A44" />
      <path d="M16.2 8.9 5.3 2.7c-.7-.4-1.3-.3-1.7.1L13 12.2l3.2-3.3z" fill="#00F076" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="19" viewBox="0 0 384 512">
      <path
        fill="#0e0e11"
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 4 184.8 4 273.5c0 25.9 4.7 52.6 14.1 80.2 12.6 36.7 58.1 126.7 105.6 125.2 24.8-.6 42.3-17.6 74.6-17.6 31.4 0 47.6 17.6 75.1 17.6 47.9-.7 89-82.5 101-119.3-64.2-30.2-55.7-88.5-55.7-90.9zM261.9 88.8c26.9-32 24.5-61.2 23.7-71.7-23.8 1.4-51.4 16.4-67.2 34.9-17.4 19.5-27.6 43.6-25.4 70.7 25.9 2 49.5-11.4 68.9-33.9z"
      />
    </svg>
  );
}

function DownloadButton({ platform, delay, play }: { platform: 'google' | 'apple'; delay: number; play: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.5, delay, ease: EASE_SMOOTH }}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: '9px',
        background: 'rgba(255,255,255,0.075)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '14px',
        padding: '10px 18px',
        boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{
        width: '26px', height: '26px', borderRadius: '7px', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {platform === 'google' ? <GooglePlayIcon /> : <AppleIcon />}
      </div>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8.5px', fontWeight: 500 }}>
          {platform === 'google' ? 'GET IT ON' : 'Download on the'}
        </div>
        <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
          {platform === 'google' ? 'Google Play' : 'App Store'}
        </div>
      </div>
    </motion.div>
  );
}

interface Scene6PremiumCTAProps {
  bgVisible: boolean;
  logoVisible: boolean;
  headlineVisible: boolean;
  referralVisible: boolean;
  buttonsVisible: boolean;
  ctaButtonVisible: boolean;
  ambientActive: boolean;
}

export function Scene6PremiumCTA({
  bgVisible, logoVisible, headlineVisible, referralVisible, buttonsVisible, ctaButtonVisible, ambientActive,
}: Scene6PremiumCTAProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Background: deep charcoal → graphite gradient */}
      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: bgVisible ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE_SMOOTH }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #17171b 0%, #0a0a0d 55%, #121215 100%)',
        }} />
        {/* Orange radial glow behind logo */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 38% at 50% 30%, rgba(255,107,0,0.28) 0%, transparent 72%)',
          }}
          animate={ambientActive ? { opacity: [0.85, 1, 0.85], scale: [1, 1.045, 1] } : { opacity: 1, scale: 1 }}
          transition={ambientActive ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 }}
        />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 115% 115% at 50% 50%, transparent 42%, rgba(0,0,0,0.62) 100%)',
        }} />
        {/* Large blurred watermark logo, low opacity, for depth */}
        <img
          src={logoUrl}
          alt=""
          aria-hidden
          style={{
            position: 'absolute', top: '38%', left: '50%',
            width: '620px', transform: 'translate(-50%,-50%)',
            opacity: 0.09, filter: 'blur(6px)',
          }}
        />
        {/* Soft floating particles */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <motion.div
            key={`p-${i}`}
            style={{
              position: 'absolute',
              width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
              borderRadius: '50%',
              background: '#FFB347',
              left: `${12 + i * 11}%`,
              top: `${14 + (i % 4) * 20}%`,
            }}
            animate={{ y: [-12, 12, -12], opacity: [0.12, 0.5, 0.12] }}
            transition={{ duration: 3.4 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}
      </motion.div>

      {/* Content column */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: '70px 40px 90px', gap: 0,
      }}>
        {/* Logo hero */}
        <motion.div
          style={{ position: 'relative', overflow: 'hidden', marginBottom: '20px', borderRadius: '20px' }}
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={logoVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 16 }}
          transition={{ duration: 0.65, ease: EASE_LUXURY }}
        >
          <div style={{
            filter: logoVisible
              ? 'drop-shadow(0 0 34px rgba(255,107,0,0.55)) drop-shadow(0 0 70px rgba(255,107,0,0.22))'
              : 'none',
            transition: 'filter 1.3s ease-out',
            padding: '6px',
          }}>
            <img src={logoUrl} alt="Dream Planet" style={{ width: '148px', height: 'auto', display: 'block' }} />
          </div>
          <LightSweep play={logoVisible} delay={0.3} />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headlineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease: EASE_SMOOTH }}
          style={{ textAlign: 'center', marginBottom: '30px', maxWidth: '340px' }}
        >
          <h1 style={{
            color: '#ffffff', fontSize: '30px', fontWeight: 800,
            margin: '0 0 12px', lineHeight: 1.16, letterSpacing: '-0.015em',
          }}>
            Your Community<br />Has Value
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', fontWeight: 400, margin: 0, lineHeight: 1.6 }}>
            Turn your influence into income. Start earning with your community today.
          </p>
        </motion.div>

        {/* Referral card — premium glass, floating membership-card treatment */}
        <motion.div
          style={{ position: 'relative', marginBottom: '28px' }}
          initial={{ opacity: 0, y: 26, scale: 0.95 }}
          animate={referralVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 26, scale: 0.95 }}
          transition={{ duration: 0.65, ease: EASE_LUXURY }}
        >
          <motion.div
            animate={referralVisible && ambientActive ? { y: [0, -6, 0] } : { y: 0 }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'relative', overflow: 'hidden',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(26px)', WebkitBackdropFilter: 'blur(26px)',
              border: '1px solid rgba(255,107,0,0.35)',
              borderRadius: '24px',
              padding: '24px 34px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              boxShadow: [
                '0 0 0 1px rgba(255,107,0,0.10)',
                '0 0 56px rgba(255,107,0,0.22)',
                '0 16px 44px rgba(0,0,0,0.5)',
              ].join(', '),
              minWidth: '272px',
            }}
          >
            <img src={appIconUrl} alt="Dream Planet" style={{
              width: '46px', height: '46px', borderRadius: '12px', objectFit: 'cover',
              marginBottom: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }} />
            <span style={{
              color: 'rgba(255,255,255,0.55)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase',
            }}>Referral Code</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                color: '#FF7A1A', fontSize: '30px', fontWeight: 800,
                letterSpacing: '0.18em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                textShadow: '0 0 24px rgba(255,122,26,0.45)',
              }}>IK54OTRD</span>
              <Copy size={16} color="rgba(255,255,255,0.45)" />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 400, marginTop: '2px' }}>
              dreamplanet.org/referral/IK54OTRD
            </span>
            <LightSweep play={referralVisible} delay={0.55} />
          </motion.div>
        </motion.div>

        {/* Download buttons — horizontal, equal size, glass */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '26px' }}>
          <DownloadButton platform="google" delay={0.0} play={buttonsVisible} />
          <DownloadButton platform="apple" delay={0.12} play={buttonsVisible} />
        </div>

        {/* CTA button — genuine button, not plain text */}
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={ctaButtonVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.45, ease: EASE_LUXURY }}
          style={{
            border: 'none', cursor: 'default',
            background: 'linear-gradient(135deg,#FF8C3A,#FF6B00)',
            color: '#fff', fontSize: '15px', fontWeight: 800,
            padding: '15px 46px', borderRadius: '999px',
            boxShadow: '0 10px 30px rgba(255,107,0,0.45), 0 0 0 1px rgba(255,255,255,0.12) inset',
            letterSpacing: '0.01em',
          }}
        >
          Join Dream Planet
        </motion.button>
      </div>
    </div>
  );
}
