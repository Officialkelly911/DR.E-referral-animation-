/**
 * Scene5ForumEngagementBar.tsx
 *
 * Phase 5 — Fully interactive like/comment/share row.
 *
 * Replaces the Phase 4 visual-only version.
 *
 * Interaction timing (per spec)
 * ──────────────────────────────
 * • Like icon transition: 120 ms scale + color
 * • Comment/Share press feedback: 80 ms opacity dip then restore
 *
 * data-scene5-action attributes on every button allow the automation
 * API and Playwright to target them without brittle CSS selectors.
 */

import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export interface Scene5ForumEngagementBarProps {
  postId: string;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export function Scene5ForumEngagementBar({
  postId,
  liked,
  likeCount,
  commentCount,
  onLike,
  onComment,
  onShare,
}: Scene5ForumEngagementBarProps) {
  return (
    <div
      data-scene5="forum-post-engagement"
      data-scene5-post-id={postId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        padding: '10px 14px 12px',
      }}
    >
      {/* Like */}
      <button
        type="button"
        aria-label={liked ? 'Unlike post' : 'Like post'}
        onClick={onLike}
        data-scene5-action="like"
        data-scene5-post-id={postId}
        data-scene5-liked={liked ? 'true' : 'false'}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <motion.span
          animate={{ scale: liked ? [1, 1.22, 1] : 1 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Heart
            size={18}
            strokeWidth={2}
            fill={liked ? '#e0335a' : 'none'}
            color={liked ? '#e0335a' : '#6b6b66'}
            style={{ transition: 'color 0.12s, fill 0.12s' }}
          />
        </motion.span>
        <motion.span
          key={likeCount}
          initial={{ opacity: 0.6, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: liked ? '#e0335a' : '#6b6b66',
            transition: 'color 0.12s',
            minWidth: '12px',
            display: 'inline-block',
          }}
        >
          {likeCount}
        </motion.span>
      </button>

      {/* Comment */}
      <button
        type="button"
        aria-label="Open comments"
        onClick={onComment}
        data-scene5-action="comment"
        data-scene5-post-id={postId}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          WebkitTapHighlightColor: 'transparent',
          color: '#6b6b66',
        }}
      >
        <MessageCircle size={18} strokeWidth={2} />
        <motion.span
          key={commentCount}
          initial={{ opacity: 0.6, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          style={{ fontSize: '13px', fontWeight: 500, color: '#6b6b66', minWidth: '12px', display: 'inline-block' }}
        >
          {commentCount}
        </motion.span>
      </button>

      {/* Share */}
      <button
        type="button"
        aria-label="Share post"
        onClick={onShare}
        data-scene5-action="share"
        data-scene5-post-id={postId}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          WebkitTapHighlightColor: 'transparent',
          color: '#6b6b66',
        }}
      >
        <Share2 size={17} strokeWidth={2} />
        <span style={{ fontSize: '13px', fontWeight: 500 }}>Share</span>
      </button>
    </div>
  );
}
