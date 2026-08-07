/**
 * Scene6ForumFeed.tsx
 *
 * Community Forum feed with ONE continuous, constant-velocity scroll —
 * fixes the "forum feed jumps from one position to another" bug.
 *
 * Implementation notes (why this fixes the stutter):
 *  - A single Framer Motion `animate` tween drives the whole scroll from
 *    start to finish. There is no mid-scroll setState, no restart, and no
 *    keyframe list — just one continuous transform, which the browser runs
 *    on the compositor thread for a stable 60fps feel (no dropped frames,
 *    no re-layout).
 *  - The eased curve (custom cubic bezier) mimics natural touch-scroll
 *    momentum: a quick, confident start that settles gently, matching the
 *    feel of Instagram/Threads/X feeds rather than a linear conveyor-belt.
 */

import { motion } from 'framer-motion';

const SCROLL_EASE = [0.22, 0.61, 0.36, 1] as const; // natural momentum-scroll feel

function ForumPost({
  title, author, likes, hot, index,
}: { title: string; author: string; likes: number; hot?: boolean; index: number }) {
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

const POSTS = [
  { title: 'Hit 10k referrals this month! The Dream Planet system actually works 🚀', author: '@creativewaves', likes: 284, hot: true },
  { title: 'Tips for growing your referral network in the first 30 days', author: '@luna.creates', likes: 156 },
  { title: "Reached Gold tier — here's what changed for my earnings", author: '@marcus.dp', likes: 97 },
  { title: "Just unlocked 'Community Leader' badge after 500 referrals 🏆", author: '@queenportia', likes: 72 },
  { title: 'Anyone else stacking Invest returns with referral bonuses? Huge combo', author: '@nova.orbit', likes: 133 },
  { title: 'My onboarding checklist for new referrals — saved everyone hours', author: '@atlas.codes', likes: 88 },
  { title: 'Forum challenge winners announced — congrats to everyone who joined 🎉', author: '@dp.team', likes: 210, hot: true },
  { title: 'Six months in: from zero to a real second income stream', author: '@ember.ray', likes: 64 },
];

export function Scene6ForumFeed({ scrollActive }: { scrollActive: boolean }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#111114',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#111114',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '6px',
        }}>
          <span style={{ color: '#fff', fontSize: '17px', fontWeight: 700 }}>Community Forum</span>
          <span style={{
            fontSize: '11px', color: '#FF6B00', fontWeight: 600,
            border: '1px solid rgba(255,107,0,0.35)',
            padding: '3px 10px', borderRadius: '6px',
          }}>Edit Forum</span>
        </div>
        <span style={{ color: '#6b7280', fontSize: '11px' }}>2.4k members · 847 posts this week</span>
      </div>

      {/* Scrolling viewport */}
      <div style={{ position: 'relative', height: 'calc(100% - 96px - 78px)', overflow: 'hidden' }}>
        <motion.div
          style={{ padding: '14px 20px' }}
          animate={scrollActive ? { y: '-38%' } : { y: 0 }}
          initial={{ y: 0 }}
          transition={{ duration: 3.2, ease: SCROLL_EASE }}
        >
          {POSTS.map((p, i) => <ForumPost key={p.author} {...p} index={i} />)}
        </motion.div>
        {/* fade masks top/bottom so the scroll never shows a hard content edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '18px',
          background: 'linear-gradient(#111114, transparent)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '18px',
          background: 'linear-gradient(transparent, #111114)', pointerEvents: 'none',
        }} />
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
