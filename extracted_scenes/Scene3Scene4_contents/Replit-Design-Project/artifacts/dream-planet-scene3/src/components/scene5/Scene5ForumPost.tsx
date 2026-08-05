/**
 * Scene5ForumPost.tsx
 *
 * A single Forum post card: author row (avatar, username, timestamp,
 * overflow menu), full-bleed media, caption, and the static engagement
 * bar. Matches the reference's post structure in the Post feed screen.
 */

import { MoreHorizontal } from 'lucide-react';
import type { Scene5ForumPostData } from './Scene5ForumData';
import { Scene5ForumEngagementBar } from './Scene5ForumEngagementBar';

export interface Scene5ForumPostProps {
  post: Scene5ForumPostData;
}

export function Scene5ForumPost({ post }: Scene5ForumPostProps) {
  return (
    <div data-scene5="forum-post" style={{ borderBottom: '8px solid #f5f5f3' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px' }}>
        <img
          src={post.avatar}
          alt={post.username}
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#111111', lineHeight: 1.2 }}>{post.username}</div>
          <div style={{ fontSize: '12px', color: '#9a9a94', marginTop: '1px' }}>{post.timestamp}</div>
        </div>
        <button
          type="button"
          aria-label="Post options"
          style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#6b6b66', WebkitTapHighlightColor: 'transparent' }}
        >
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div style={{ width: '100%', aspectRatio: '4 / 5', background: '#000000', overflow: 'hidden' }}>
        <img src={post.media} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      <div style={{ padding: '10px 14px 0', fontSize: '13.5px', color: '#333333', lineHeight: 1.4 }}>
        <span style={{ fontWeight: 700, color: '#111111', marginRight: '6px' }}>{post.username}</span>
        {post.caption}
      </div>

      <Scene5ForumEngagementBar likes={0} comments={0} />
    </div>
  );
}
