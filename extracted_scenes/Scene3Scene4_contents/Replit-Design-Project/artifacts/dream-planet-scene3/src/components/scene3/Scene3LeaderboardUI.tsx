/**
 * Scene3LeaderboardUI.tsx
 *
 * Self-contained Leaderboard page for the Scene 3 cinematic animation.
 * Pixel-faithful to the locked dream-planet-referral Leaderboard screen.
 *
 * Rules:
 *  - No routing
 *  - No interactive state
 *  - Real profile photos — no placeholder initials for users with photos
 *  - Stagger reveal driven by parent via revealControls
 */

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

type AnimationControls = ReturnType<typeof useAnimation>;

// Profile photos
import kiutPhoto       from '@assets/Kiut_rababag_1785838557478.jpg';
import dmith2Photo     from '@assets/dmith2_1785838557478.jpg';
import queenportiaPhoto from '@assets/Queenportia_1785838557478.jpg';
import callLinsPhoto   from '@assets/Call_lins_1785838557478.jpg';
import pingerzPhoto    from '@assets/Pingerzbeat_1785838557477.jpg';
import davidPhoto      from '@assets/Davidsings_1785838557478.jpg';
import diaryPhoto      from '@assets/diaryofmskhef_1785838557478.jpg';
import drEPhoto        from '@assets/Profile_photo__1785838557478.jpg';

// Leaderboard data
const USERS = [
  { rank: 1, username: 'kiut_Rababag',   points: 40, photo: kiutPhoto,        color: '#14b8a6' },
  { rank: 2, username: 'dmith2',          points: 20, photo: dmith2Photo,      color: '#f97316' },
  { rank: 3, username: 'queenportia',     points: 20, photo: queenportiaPhoto, color: '#a855f7' },
  { rank: 4, username: 'call_lins',       points: 10, photo: callLinsPhoto,    color: '#3b82f6' },
  { rank: 5, username: 'eg',              points: 10, photo: null,             color: '#22c55e', initials: 'E' },
  { rank: 6, username: 'pingerzbeat',     points: 10, photo: pingerzPhoto,     color: '#ec4899' },
  { rank: 7, username: 'davidsings',      points: 10, photo: davidPhoto,       color: '#6366f1' },
  { rank: 8, username: 'diaryofmskhef',   points: 10, photo: diaryPhoto,       color: '#eab308' },
  { rank: 9, username: 'dr._e',           points: 0,  photo: drEPhoto,         color: '#ef4444', isCurrentUser: true },
] as const;

// Stagger variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

const podiumVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

// Avatar component
function Avatar({
  user,
  size,
  borderColor,
  borderWidth = 2,
}: {
  user: typeof USERS[number];
  size: number;
  borderColor?: string;
  borderWidth?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: borderColor ? `${borderWidth}px solid ${borderColor}` : undefined,
        boxShadow: borderColor ? '0 4px 12px rgba(0,0,0,0.12)' : undefined,
        flexShrink: 0,
      }}
    >
      {user.photo ? (
        <img
          src={user.photo}
          alt={user.username}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: user.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: size * 0.33,
          }}
        >
          {'initials' in user ? user.initials : user.username[0].toUpperCase()}
        </div>
      )}
    </div>
  );
}

export interface Scene3LeaderboardUIProps {
  revealControls?: AnimationControls;
}

export function Scene3LeaderboardUI({ revealControls }: Scene3LeaderboardUIProps) {
  const top3 = USERS.slice(0, 3);
  const listUsers = USERS.slice(3, 8);
  const currentUser = USERS[8];

  return (
    <div
      id="s3-leaderboard"
      style={{
        width: '390px',
        height: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
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
            border: 'none',
            cursor: 'default',
          }}
        >
          <ChevronLeft size={26} />
        </button>
        <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 18, fontWeight: 700, margin: 0 }}>
          Leaderboard
        </h1>
        <div style={{ width: 40, height: 40 }} />
      </div>

      {/* Scrollable content */}
      <motion.div
        animate={revealControls}
        initial="hidden"
        variants={containerVariants}
        style={{ flex: 1, overflowY: 'hidden', padding: '0 16px', display: 'flex', flexDirection: 'column' }}
      >
        {/* Time filter pills */}
        <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {(['This Week', 'This Month', 'All Time'] as const).map(label => (
            <div
              key={label}
              style={{
                padding: '8px 16px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                background: label === 'All Time' ? '#000' : '#fff',
                color: label === 'All Time' ? '#fff' : '#9ca3af',
                border: `1px solid ${label === 'All Time' ? '#000' : '#e5e7eb'}`,
              }}
            >
              {label}
            </div>
          ))}
        </motion.div>

        {/* Podium — top 3 */}
        <motion.div variants={podiumVariants}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24, marginTop: 8, marginBottom: 32, height: 200 }}>
            {/* 2nd place */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <Avatar user={top3[1]} size={80} borderColor="#fed7aa" />
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  width: 24, height: 24, borderRadius: '50%', background: '#fb923c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 11, fontWeight: 700,
                }}>2</div>
              </div>
              <span style={{ fontWeight: 600, fontSize: 13, color: '#000' }}>
                {top3[1].username.length > 10 ? top3[1].username.slice(0, 10) + '…' : top3[1].username}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af' }}>{top3[1].points}pt</span>
            </div>

            {/* 1st place */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <Avatar user={top3[0]} size={112} borderColor="#FF6B00" borderWidth={4} />
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  width: 32, height: 32, borderRadius: '50%', background: '#FF6B00',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 13, fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(255,107,0,0.35)',
                }}>1</div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#000', marginTop: 4 }}>
                {top3[0].username.length > 12 ? top3[0].username.slice(0, 12) + '…' : top3[0].username}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FF6B00' }}>{top3[0].points}pt</span>
            </div>

            {/* 3rd place */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <Avatar user={top3[2]} size={80} borderColor="#cd7f32" />
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  width: 24, height: 24, borderRadius: '50%', background: '#cd7f32',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 11, fontWeight: 700,
                }}>3</div>
              </div>
              <span style={{ fontWeight: 600, fontSize: 13, color: '#000' }}>
                {top3[2].username.length > 10 ? top3[2].username.slice(0, 10) + '…' : top3[2].username}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af' }}>{top3[2].points}pt</span>
            </div>
          </div>
        </motion.div>

        {/* Rows 4–8 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {listUsers.map(user => (
            <motion.div
              key={user.rank}
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#9ca3af', fontWeight: 700, width: 24, textAlign: 'center', fontSize: 14 }}>{user.rank}</span>
                <Avatar user={user} size={40} />
                <span style={{ fontWeight: 600, color: '#000', fontSize: 14, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.username}
                </span>
              </div>
              <div style={{ background: '#f3f4f6', padding: '8px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 700, color: '#000' }}>
                {user.points}pt
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sticky current user row — dr._e */}
      <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #f9fafb' }}>
        <div
          style={{
            background: 'linear-gradient(90deg, #FF6B00, #FF9A3C)',
            borderRadius: 9999,
            padding: '4px 4px 4px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(255,107,0,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'white', fontWeight: 700, width: 24, textAlign: 'center', fontSize: 14 }}>{currentUser.rank}</span>
            <Avatar user={currentUser} size={40} borderColor="white" />
            <span style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>{currentUser.username}</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', padding: '12px 16px', borderRadius: 9999, color: 'white', fontWeight: 700, fontSize: 13 }}>
            {currentUser.points}pt
          </div>
        </div>
      </div>
    </div>
  );
}
