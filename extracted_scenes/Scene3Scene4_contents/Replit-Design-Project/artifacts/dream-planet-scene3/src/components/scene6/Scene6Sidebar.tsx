/**
 * Scene6Sidebar.tsx
 *
 * Side navigation drawer for Scene 6. Slides in from the left over the
 * Home Feed. Fixes the "sidebar background" bug from the revision QA:
 * the Home Feed must remain visible (dimmed) behind the drawer — never
 * a blank/placeholder background.
 *
 * Self-contained to Scene 6 (does not import or modify any Scene 5 file).
 */

import { motion } from 'framer-motion';
import {
  Home, Trophy, ShoppingBag, MessageCircle, TrendingUp,
  Wallet, Settings, LifeBuoy, ChevronRight,
} from 'lucide-react';

const MAIN_ITEMS = [
  { icon: Home, label: 'Home Feed' },
  { icon: Trophy, label: 'Challenges' },
  { icon: ShoppingBag, label: 'Store' },
  { icon: MessageCircle, label: 'Community Forum' },
  { icon: TrendingUp, label: 'Invest' },
  { icon: Wallet, label: 'Wallet' },
];

const BOTTOM_ITEMS = [
  { icon: LifeBuoy, label: 'Support' },
  { icon: Settings, label: 'Settings' },
];

function NavRow({ icon: Icon, label }: { icon: typeof Home; label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '12px 22px',
    }}>
      <Icon size={19} color="#1f2937" strokeWidth={1.8} />
      <span style={{ color: '#1f2937', fontSize: '14px', fontWeight: 600, flex: 1 }}>{label}</span>
    </div>
  );
}

export function Scene6Sidebar({ progress }: { progress: number }) {
  // progress: 0 = fully closed (off-screen left), 1 = fully open
  const translateX = -100 + progress * 100; // % — from -100% to 0%
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none' }}>
      {/* Dimmer over the Home Feed behind the drawer */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#000000',
        opacity: progress * 0.55,
      }} />

      <div
        style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: '76%', maxWidth: '340px',
          background: '#ffffff',
          borderTopRightRadius: '26px',
          borderBottomRightRadius: '26px',
          boxShadow: '0 0 32px rgba(0,0,0,0.35)',
          transform: `translateX(${translateX}%)`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Profile */}
        <div style={{
          padding: '58px 22px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#FF8C3A,#cc5500)',
          }} />
          <div>
            <div style={{ color: '#0e0e11', fontSize: '15px', fontWeight: 800 }}>kiut_Rababag</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '2px',
              color: '#FF6B00', fontSize: '12px', fontWeight: 700,
            }}>
              View Portfolio <ChevronRight size={13} />
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, paddingTop: '10px' }}>
          {MAIN_ITEMS.map((item) => (
            <NavRow key={item.label} icon={item.icon} label={item.label} />
          ))}
          <div style={{ margin: '10px 22px', borderTop: '1px solid rgba(0,0,0,0.07)' }} />
          {BOTTOM_ITEMS.map((item) => (
            <NavRow key={item.label} icon={item.icon} label={item.label} />
          ))}
        </nav>
      </div>
    </div>
  );
}
