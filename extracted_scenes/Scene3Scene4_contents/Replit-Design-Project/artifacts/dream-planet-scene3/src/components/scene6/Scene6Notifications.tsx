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
  { name: 'benjamin', action: 'Commented: "Awesome vibe on your Post"', time: '14hrs ago' },
  { name: 'jose', action: 'Liked your Post', time: '14hrs ago' },
  { name: 'nosaduke', action: 'Commented: "Floral Princess on your Post"', time: '14hrs ago' },
  { name: 'nosaduke', action: 'Liked your Post', time: '14hrs ago' },
  { name: 'adeoshodin', action: 'Liked your Post', time: '1d ago' },
  { name: 'marcus.dp', action: 'Liked your Post', time: '2d ago' },
];

const SCROLL_EASE = [0.22, 0.61, 0.36, 1] as const;

function NotificationRow({ item, index, staggerIn }: { item: NotificationItem; index: number; staggerIn: boolean }) {
  const isStaggered = index < 4;
  return (
    <motion.div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
      }}
      initial={isStaggered ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
      animate={isStaggered && staggerIn ? { opacity: 1, y: 0 } : (isStaggered ? {} : { opacity: 1, y: 0 })}
      transition={{ duration: 0.32, delay: isStaggered ? index * 0.09 : 0, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%',
        background: 'linear-gradient(135deg,#FF6B00,#c94f00)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Zap size={17} color="#fff" fill="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 700 }}>{item.name}</span> {item.action}
        </p>
        <span style={{ color: '#6b7280', fontSize: '11px' }}>{item.time}</span>
      </div>
      {item.isNew && (
        <span style={{
          background: 'rgba(255,140,58,0.18)', color: '#FF8C3A',
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
      background: '#111114',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '54px 20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <ChevronLeft size={22} color="#e5e7eb" />
        <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>Notification</span>
      </div>

      <div style={{ position: 'relative', height: 'calc(100% - 96px)', overflow: 'hidden' }}>
        <motion.div
          animate={scrollActive ? { y: '-26%' } : { y: 0 }}
          initial={{ y: 0 }}
          transition={{ duration: 2.74, ease: SCROLL_EASE }}
        >
          {NOTIFICATIONS.map((item, i) => (
            <NotificationRow key={`${item.name}-${i}`} item={item} index={i} staggerIn={staggerIn} />
          ))}
        </motion.div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '18px',
          background: 'linear-gradient(transparent, #111114)', pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}
