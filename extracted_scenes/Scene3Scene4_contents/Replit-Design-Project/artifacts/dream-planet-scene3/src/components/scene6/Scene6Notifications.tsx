/**
 * Scene6Notifications.tsx
 *
 * Replaces the old "Community Forum summary" intermediate screen with a
 * Notifications screen (reference: attached_assets/Notification_screen__1786056302246.PNG).
 *
 * Motion:
 *  - The first few notifications slide/fade in staggered (~300–450ms) so the
 *    screen doesn't "instantly populate" — it reads as a page that just
 *    loaded, not a static screenshot.
 *  - After the stagger, the whole list drifts upward in ONE continuous,
 *    gentle tween (same single-animation technique as the Forum feed) —
 *    smooth and alive, never abrupt.
 *
 * This is a complete screen replacement for the old penultimate Community
 * Forum summary. The forum component is intentionally not nested here.
 */

import { motion } from 'framer-motion';
import { ChevronLeft, Zap } from 'lucide-react';

interface NotificationItem {
  name: string;
  action: string;
  time: string;
  isNew?: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  { name: 'benjamin', action: 'Commented: "Glasses look good on your Post"', time: '14hrs ago', isNew: true },
  { name: 'benjamin', action: 'Liked your Post', time: '14hrs ago' },
  { name: '@creativewave', action: 'Hit 10k referrals this month! The Dream Planet system actually works!', time: '14hrs ago' },
  { name: 'Creativewave', action: 'Liked your Post', time: '14hrs ago' },
  { name: 'jose', action: 'Liked your Post', time: '14hrs ago' },
  { name: '@Luna.creates', action: 'Tips for growing your referral network in the first 30 days', time: '14hrs ago' },
  { name: '@Marcus.dp', action: 'Just unlocked "Community Leader" badge after 500 referrals', time: '14hrs ago' },
  { name: '@Queenportia', action: "Reached Gold tier — here's what changed for my earnings", time: '1d ago' },
];

const SCROLL_EASE = [0.22, 0.61, 0.36, 1] as const;

function NotificationRow({ item, index, staggerIn }: { item: NotificationItem; index: number; staggerIn: boolean }) {
  const isStaggered = index < 4;
  return (
    <motion.div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(15,23,42,0.07)',
      }}
      initial={isStaggered ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
      animate={isStaggered && staggerIn ? { opacity: 1, y: 0 } : (isStaggered ? {} : { opacity: 1, y: 0 })}
      transition={{ duration: 0.32, delay: isStaggered ? index * 0.09 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%',
        background: '#c74312',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Zap size={17} color="#fff" fill="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#16181d', fontSize: '13px', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 700 }}>{item.name}</span> {item.action}
        </p>
        <span style={{ color: '#9ca0a6', fontSize: '11px' }}>{item.time}</span>
      </div>
      {item.isNew && (
        <span style={{
          background: '#fff0e8', color: '#c84b18',
          fontSize: '10px', fontWeight: 700,
          padding: '4px 10px', borderRadius: '10px',
          flexShrink: 0,
        }}>New</span>
      )}
    </motion.div>
  );
}

export function Scene6Notifications({ staggerIn, scrollActive }: { staggerIn: boolean; scrollActive: boolean }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflow: 'hidden',
    }}>
      {/* The supplied reference is 472×840. Render the complete mobile
          composition at the 1080×1920 scene scale instead of shrinking the
          reference's typography and row rhythm into the canvas. */}
      <div style={{
        position: 'absolute',
        width: '472px', height: '840px',
        transform: 'scale(2.2881356)',
        transformOrigin: 'top left',
        background: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}>
        {/* iOS-style status bar from the supplied reference screenshot. */}
        <div style={{
          height: '76px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '0 28px 10px',
          color: '#101114',
          fontSize: '16px', fontWeight: 700,
        }}>
          <span>11:21</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px' }}>
            <span style={{ letterSpacing: '-2px' }}>▮▮▮▮</span>
            <span style={{ fontSize: '15px' }}>⌁</span>
            <span style={{
              border: '1px solid #6b7280', borderRadius: '4px',
              padding: '1px 3px', fontSize: '10px', lineHeight: 1,
            }}>▰</span>
          </div>
        </div>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '20px 28px 28px',
          borderBottom: '1px solid rgba(15,23,42,0.07)',
        }}>
          <ChevronLeft size={30} color="#101114" strokeWidth={1.8} />
          <span style={{ color: '#101114', fontSize: '20px', fontWeight: 600 }}>Notification</span>
        </div>

        <div style={{ position: 'relative', height: 'calc(100% - 156px)', overflow: 'hidden' }}>
          <motion.div
            animate={scrollActive ? { y: '-11%' } : { y: 0 }}
            initial={{ y: 0 }}
            style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}
            transition={{ duration: 1.94, ease: SCROLL_EASE }}
          >
            {NOTIFICATIONS.map((item, i) => (
              <NotificationRow key={`${item.name}-${i}`} item={item} index={i} staggerIn={staggerIn} />
            ))}
          </motion.div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '18px',
            background: 'linear-gradient(transparent, #ffffff)', pointerEvents: 'none',
          }} />
        </div>
      </div>
    </div>
  );
}
