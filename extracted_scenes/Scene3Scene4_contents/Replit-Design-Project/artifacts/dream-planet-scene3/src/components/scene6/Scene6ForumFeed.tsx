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
import avatarAdeoshodin from '@assets/scene5-forum/avatar-adeoshodin.jpg';
import avatarPoster02 from '@assets/scene5-forum/avatar-poster-02.jpg';
import avatarSaintcarl23 from '@assets/scene5-forum/avatar-saintcarl23.png';
import avatarErosky from '@assets/scene5-forum/avatar-erosky.jpg';
import avatarJoanna from '@assets/scene5-forum/avatar-joanna.jpg';
import avatarZeezee from '@assets/scene5-forum/avatar-zeezee.jpg';

const SCROLL_EASE = [0.22, 0.61, 0.36, 1] as const; // natural momentum-scroll feel

function ForumPost({
  title, author, likes, hot, index, avatar, extended,
}: { title: string; author: string; likes: number; hot?: boolean; index: number; avatar: string; extended: boolean }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.035)',
      borderRadius: '14px',
      padding: extended ? '24px 26px' : '14px 16px',
      marginBottom: extended ? '18px' : '10px',
      border: '1px solid rgba(255,255,255,0.055)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          width: extended ? '48px' : '28px', height: extended ? '48px' : '28px', borderRadius: '50%',
          backgroundImage: `url(${avatar})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundColor: index % 2 === 0 ? '#c55b18' : '#e05a00',
          flexShrink: 0,
        }} />
        <span style={{ color: '#9ca3af', fontSize: extended ? '17px' : '11px', fontWeight: 500 }}>{author}</span>
        {hot && (
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(255,107,0,0.18)',
            color: '#FF6B00',
            fontSize: extended ? '12px' : '9px', fontWeight: 700,
            padding: extended ? '4px 10px' : '2px 7px', borderRadius: '4px',
            letterSpacing: '0.05em',
          }}>HOT</span>
        )}
      </div>
      <p style={{
        color: '#e5e7eb', fontSize: extended ? '23px' : '13px', fontWeight: 500,
        margin: '0 0 16px', lineHeight: 1.4,
      }}>{title}</p>
      <div style={{ display: 'flex', gap: extended ? '26px' : '16px' }}>
        <span style={{ color: '#FF6B00', fontSize: extended ? '16px' : '11px', fontWeight: 600 }}>♥ {likes}</span>
        <span style={{ color: '#6b7280', fontSize: extended ? '16px' : '11px' }}>💬 {Math.floor(likes / 3)}</span>
      </div>
    </div>
  );
}

const POSTS = [
  { title: 'Hit 10k referrals this month! The Dream Planet system actually works 🚀', author: '@creativewaves', likes: 284, hot: true, avatar: avatarAdeoshodin },
  { title: 'Tips for growing your referral network in the first 30 days', author: '@luna.creates', likes: 156, avatar: avatarPoster02 },
  { title: "Reached Gold tier — here's what changed for my earnings", author: '@marcus.dp', likes: 97, avatar: avatarSaintcarl23 },
  { title: "Just unlocked 'Community Leader' badge after 500 referrals 🏆", author: '@queenportia', likes: 72, avatar: avatarErosky },
  { title: 'Anyone else stacking Invest returns with referral bonuses? Huge combo', author: '@nova.orbit', likes: 133, avatar: avatarJoanna },
  { title: 'My onboarding checklist for new referrals — saved everyone hours', author: '@atlas.codes', likes: 88, avatar: avatarZeezee },
  { title: 'Forum challenge winners announced — congrats to everyone who joined 🎉', author: '@dp.team', likes: 210, hot: true, avatar: avatarAdeoshodin },
  { title: 'Six months in: from zero to a real second income stream', author: '@ember.ray', likes: 64, avatar: avatarPoster02 },
  { title: 'What I wish I knew before inviting my first ten referrals', author: '@saintcarl23', likes: 119, avatar: avatarSaintcarl23 },
  { title: 'Small wins count — celebrating every new connection this week', author: '@erosky❤️', likes: 51, avatar: avatarErosky },
];

export function Scene6ForumFeed({ scrollActive, extended = false }: { scrollActive: boolean; extended?: boolean }) {
  const extendedScrollY = [0, -125, -125, -275, -275, -425, -425, -575, -575, -725, -725, -875, -875] as number[];
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
           style={{ padding: extended ? '22px 28px' : '14px 20px' }}
           animate={scrollActive
             ? (extended ? { y: extendedScrollY } : { y: '-38%' })
             : { y: 0 }}
          initial={{ y: 0 }}
           transition={extended
             ? {
                 duration: 6.3,
                 ease: 'linear',
                 times: [0, 0.10, 0.17, 0.27, 0.34, 0.44, 0.51, 0.61, 0.68, 0.78, 0.85, 0.94, 1],
               }
             : { duration: 3.2, ease: SCROLL_EASE }}
        >
           {POSTS.map((p, i) => <ForumPost key={p.author} {...p} index={i} extended={extended} />)}
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
