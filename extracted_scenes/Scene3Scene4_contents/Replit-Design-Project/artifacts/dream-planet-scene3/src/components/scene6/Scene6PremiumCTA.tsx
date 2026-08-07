/**
 * Scene6PremiumCTA.tsx
 *
 * Premium CTA Redesign (Part B of the Scene 6 revision).
 *
 * Creative direction target: Apple product launch × Stripe landing page ×
 * Linear.app motion — premium, elegant, confident, never flashy. The CTA is
 * deliberately composed at a larger scale so the final frame reads as the
 * climax of the campaign, not a small card floating in an empty canvas.
 */

import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import premiumLogoUrl from '@assets/DP_premium_logo__1786104503908.PNG';
import appIconUrl from '@assets/App_icon__1786104449387.WEBP';

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
      {/* Background: layered charcoal, amber light field, watermark and dust */}
      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: bgVisible ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE_SMOOTH }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'radial-gradient(ellipse 76% 42% at 50% 23%, rgba(255,107,0,0.25) 0%, rgba(255,107,0,0.08) 38%, transparent 73%)',
            'radial-gradient(ellipse 62% 36% at 50% 68%, rgba(255,125,30,0.10) 0%, transparent 73%)',
            'linear-gradient(148deg, #202024 0%, #101114 42%, #08090c 100%)',
          ].join(', '),
        }} />
        {/* Orange radial glow behind logo */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 62% 40% at 50% 30%, rgba(255,145,50,0.22) 0%, transparent 70%)',
          }}
          animate={ambientActive ? { opacity: [0.85, 1, 0.85], scale: [1, 1.045, 1] } : { opacity: 1, scale: 1 }}
          transition={ambientActive ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 }}
        />
        {/* Fine vertical light axis, like a studio product-lighting setup */}
        <div style={{
          position: 'absolute', top: '7%', bottom: '7%', left: '50%', width: '1px',
          background: 'linear-gradient(180deg, transparent, rgba(255,155,74,0.12) 38%, rgba(255,155,74,0.04) 65%, transparent)',
          opacity: 0.7,
        }} />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 88% 84% at 50% 48%, transparent 42%, rgba(0,0,0,0.70) 100%)',
        }} />
        {/* Large blurred watermark logo, intentionally visible for depth */}
           <img
           src={premiumLogoUrl}
          alt=""
          aria-hidden
          style={{
            position: 'absolute', top: '43%', left: '50%',
             width: '980px', transform: 'translate(-50%,-50%)',
            opacity: 0.115, filter: 'blur(5px) saturate(0.85)',
          }}
        />
        {/* Soft floating particles */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
          <motion.div
            key={`p-${i}`}
            style={{
              position: 'absolute',
              width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
              borderRadius: '50%',
              background: '#FFB347',
              left: `${8 + (i * 17) % 84}%`,
              top: `${10 + (i * 23) % 78}%`,
            }}
            animate={{ y: [-12, 12, -12], opacity: [0.12, 0.5, 0.12] }}
            transition={{ duration: 3.4 + i * 0.32, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }}
          />
        ))}
      </motion.div>

      {/* Content column */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
         height: '100%', padding: '72px 42px 86px', gap: 0,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={logoVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.55, ease: EASE_SMOOTH }}
          style={{
            color: 'rgba(255,255,255,0.52)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: '24px',
          }}
        >
          The Dream Planet Movement
        </motion.div>
        {/* Logo hero */}
        <motion.div
           style={{ position: 'relative', overflow: 'hidden', marginBottom: '34px', borderRadius: '28px' }}
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={logoVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 16 }}
          transition={{ duration: 0.65, ease: EASE_LUXURY }}
        >
          <div style={{
            filter: logoVisible
              ? 'drop-shadow(0 0 34px rgba(255,107,0,0.55)) drop-shadow(0 0 70px rgba(255,107,0,0.22))'
              : 'none',
            transition: 'filter 1.3s ease-out',
             padding: '10px',
          }}>
             <img src={premiumLogoUrl} alt="Dream Planet" style={{ width: '270px', height: 'auto', display: 'block' }} />
          </div>
          <LightSweep play={logoVisible} delay={0.3} />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headlineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease: EASE_SMOOTH }}
           style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '650px' }}
        >
          <h1 style={{
             color: '#ffffff', fontSize: '48px', fontWeight: 800,
             margin: '0 0 18px', lineHeight: 1.08, letterSpacing: '-0.035em',
          }}>
            Your Community<br />Has Value
          </h1>
           <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '17px', fontWeight: 400, margin: 0, lineHeight: 1.55, letterSpacing: '0.005em' }}>
             Turn your influence into income.<br />Start earning with your community today.
          </p>
        </motion.div>

        {/* Referral card — premium glass, floating membership-card treatment */}
        <motion.div
           style={{ position: 'relative', marginBottom: '34px' }}
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
               borderRadius: '30px',
               padding: '30px 46px 27px',
               display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '11px',
              boxShadow: [
                '0 0 0 1px rgba(255,107,0,0.10)',
                 '0 0 78px rgba(255,107,0,0.24)',
                 '0 20px 58px rgba(0,0,0,0.56)',
              ].join(', '),
               minWidth: '480px',
            }}
          >
            <img src={appIconUrl} alt="Dream Planet" style={{
               width: '62px', height: '62px', borderRadius: '17px', objectFit: 'cover',
               marginBottom: '2px', boxShadow: '0 7px 18px rgba(0,0,0,0.34)',
            }} />
            <span style={{
               color: 'rgba(255,255,255,0.58)', fontSize: '12px', fontWeight: 700,
               letterSpacing: '0.16em', textTransform: 'uppercase',
            }}>Referral Code</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                 color: '#FF8A32', fontSize: '54px', fontWeight: 850,
                 letterSpacing: '0.20em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                textShadow: '0 0 24px rgba(255,122,26,0.45)',
              }}>IK54OTRD</span>
               <Copy size={20} color="rgba(255,255,255,0.48)" />
            </div>
             <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '12px', fontWeight: 400, marginTop: '2px', letterSpacing: '0.02em' }}>
              dreamplanet.org/referral/IK54OTRD
            </span>
            <LightSweep play={referralVisible} delay={0.55} />
          </motion.div>
        </motion.div>

        {/* Store badge artwork is intentionally omitted. This quiet platform cue
            keeps the referral code as the focal point of the final frame. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={buttonsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          style={{
            display: 'flex', alignItems: 'center', gap: '11px',
            color: 'rgba(255,255,255,0.62)', fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '30px',
          }}
        >
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: '#FF8A32', boxShadow: '0 0 10px rgba(255,138,50,0.8)',
          }} />
          Available on mobile
        </motion.div>

        {/* CTA button — genuine button, not plain text */}
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={ctaButtonVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.45, ease: EASE_LUXURY }}
          style={{
            border: 'none', cursor: 'default',
            background: 'linear-gradient(135deg,#FF8C3A,#FF6B00)',
            color: '#fff', fontSize: '15px', fontWeight: 800,
             padding: '17px 58px', borderRadius: '999px',
             boxShadow: '0 12px 36px rgba(255,107,0,0.48), 0 0 0 1px rgba(255,255,255,0.18) inset',
             letterSpacing: '0.02em',
             minWidth: '300px',
          }}
        >
          Join Dream Planet
        </motion.button>
      </div>
    </div>
  );
}
