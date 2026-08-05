/**
 * Scene5ForumEngagementBar.tsx
 *
 * Visual-only like/comment/share row under each post. Per the Phase 4
 * spec this is UI recreation only — icons and static counts, no click
 * handling, no state. Functional engagement (tap-to-like, opening a
 * comment sheet, share sheet) is a later Scene 5 phase.
 */

import { Heart, MessageCircle, Share2 } from 'lucide-react';

export interface Scene5ForumEngagementBarProps {
  likes: number;
  comments: number;
}

export function Scene5ForumEngagementBar({ likes, comments }: Scene5ForumEngagementBarProps) {
  return (
    <div
      data-scene5="forum-post-engagement"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        padding: '10px 14px 12px',
        color: '#6b6b66',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
        <Heart size={18} strokeWidth={2} />
        {likes}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
        <MessageCircle size={18} strokeWidth={2} />
        {comments}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
        <Share2 size={17} strokeWidth={2} />
        Share
      </span>
    </div>
  );
}
