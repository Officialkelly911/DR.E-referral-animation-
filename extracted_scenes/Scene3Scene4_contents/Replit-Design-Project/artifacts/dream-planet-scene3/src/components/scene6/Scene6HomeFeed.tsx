/**
 * Scene6HomeFeed.tsx
 *
 * Recreation of the Dream Planet Home Feed screen (reference:
 * attached_assets/Home_page_feed__1786056302246.PNG).
 *
 * Used as:
 *  1. The opening static hold of Scene 6.
 *  2. The background the Side Navigation drawer reveals when it opens
 *     ("the sidebar should slide over the Home Feed exactly as in the
 *     real app" — background must stay the Home Feed, dimmed, never a
 *     placeholder).
 */

import { Bell, Search, MoreHorizontal, Plus, Wifi, Zap, ShoppingBag, MessageCircle, TrendingUp } from 'lucide-react';
import logoUrl from '@assets/dp_logo_v1.svg';

function BottomNavItem({
  icon, label, active,
}: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      color: active ? '#FF6B00' : '#9ca3af',
    }}>
      {icon}
      <span style={{ fontSize: '10px', fontWeight: active ? 700 : 500 }}>{label}</span>
    </div>
  );
}

export function Scene6HomeFeed() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0e0e11',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '54px 20px 14px',
      }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#FF8C3A,#cc5500)',
          border: '2px solid rgba(255,255,255,0.12)',
        }} />
        <img src={logoUrl} alt="Dream Planet" style={{ height: '26px', width: 'auto' }} />
        <div style={{ display: 'flex', gap: '18px', color: '#e5e7eb' }}>
          <Bell size={20} strokeWidth={2} />
          <Search size={20} strokeWidth={2} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', padding: '4px 20px 16px' }}>
        <span style={{
          background: '#ffffff', color: '#0e0e11',
          fontSize: '13px', fontWeight: 700,
          padding: '8px 20px', borderRadius: '20px',
        }}>All</span>
        <span style={{
          background: 'rgba(255,255,255,0.08)', color: '#9ca3af',
          fontSize: '13px', fontWeight: 600,
          padding: '8px 20px', borderRadius: '20px',
        }}>Others</span>
      </div>

      {/* Post card */}
      <div style={{ flex: 1, padding: '0 20px', overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 2px 14px',
        }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#FF6B00,#8a3d00)',
            flexShrink: 0,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>kiut_Rababag</span>
              <span style={{
                display: 'inline-flex', width: '13px', height: '13px', borderRadius: '50%',
                background: '#FF6B00', color: '#fff', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 900,
              }}>✓</span>
            </div>
            <span style={{ color: '#6b7280', fontSize: '11px' }}>Alien Creator</span>
          </div>
          <MoreHorizontal size={18} color="#6b7280" />
        </div>

        <div style={{
          position: 'relative',
          width: '100%', aspectRatio: '1 / 1.05',
          borderRadius: '18px', overflow: 'hidden',
          background: 'linear-gradient(160deg,#7c9db3 0%,#a9906f 45%,#5c6b74 100%)',
          filter: 'blur(9px) saturate(1.05)',
          transform: 'scale(1.05)',
        }} />
        <div style={{
          position: 'relative', marginTop: '-46px', display: 'flex', justifyContent: 'flex-end',
          paddingRight: '10px',
        }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#FF8C3A,#FF6B00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(255,107,0,0.45)',
            border: '3px solid #0e0e11',
          }}>
            <Plus size={22} color="#fff" strokeWidth={3} />
          </div>
        </div>
        <p style={{
          color: '#e5e7eb', fontSize: '13px', fontWeight: 500,
          margin: '10px 2px 0',
        }}>Eyes on the man with the bag 👀</p>
      </div>

      {/* Bottom nav */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '14px 12px 26px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#0d0d10',
      }}>
        <BottomNavItem icon={<Wifi size={20} />} label="Feed" active />
        <BottomNavItem icon={<Zap size={20} />} label="Challenge" />
        <BottomNavItem icon={<ShoppingBag size={20} />} label="Store" />
        <BottomNavItem icon={<MessageCircle size={20} />} label="Forum" />
        <BottomNavItem icon={<TrendingUp size={20} />} label="Invest" />
      </div>
    </div>
  );
}
