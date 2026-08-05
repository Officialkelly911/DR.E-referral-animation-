/**
 * Scene5ForumProfileHeader.tsx
 *
 * Avatar + name + member count + description block shared by both
 * Forum states. The Post feed reference shows the member count in the
 * orange accent with a small people glyph; the Overview reference
 * shows a more compact version without the description line — callers
 * control that via `compact`.
 */

import { Users } from 'lucide-react';
import { FORUM, forumOwnerAvatar } from './Scene5ForumData';

export interface Scene5ForumProfileHeaderProps {
  /** Overview's condensed header omits the description line. */
  compact?: boolean;
}

export function Scene5ForumProfileHeader({ compact = false }: Scene5ForumProfileHeaderProps) {
  if (compact) {
    return (
      <div data-scene5="forum-profile-compact" style={{ padding: '14px 20px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={forumOwnerAvatar}
          alt={FORUM.ownerName}
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
        />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>{FORUM.ownerName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: '#9a9a94', marginTop: '2px' }}>
            <Users size={12} strokeWidth={2.25} />
            {FORUM.members} members
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-scene5="forum-profile" style={{ padding: '16px 20px 16px' }}>
      <img
        src={forumOwnerAvatar}
        alt={FORUM.ownerName}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          border: '3px solid #ffffff',
          boxSizing: 'border-box',
          marginBottom: '12px',
        }}
      />
      <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', lineHeight: 1.25, marginBottom: '4px' }}>
        {FORUM.ownerName}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#FF6B00',
          marginBottom: '10px',
        }}
      >
        <Users size={15} strokeWidth={2.5} />
        {FORUM.members} members
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#c9c9c4',
          lineHeight: 1.4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {FORUM.description}
      </div>
    </div>
  );
}
