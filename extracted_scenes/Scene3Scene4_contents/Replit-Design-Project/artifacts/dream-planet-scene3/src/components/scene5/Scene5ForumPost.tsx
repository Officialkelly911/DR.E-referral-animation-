/**
 * Scene5ForumPost.tsx
 *
 * Phase 5 — Forum post card wired to the Scene5InteractionStore.
 *
 * Changes from Phase 4
 * ────────────────────
 * • Reads post interaction state from context (likes, comments, like toggle).
 * • Passes live handlers to Scene5ForumEngagementBar.
 * • Renders Scene5CommentSheet and Scene5SharePanel (absolutely positioned,
 *   parented here so they overlay only this post's card area; the parent
 *   Forum page must have position:relative or absolute for them to clip
 *   correctly — this is handled by Scene5Forum's scroll container).
 *
 * NOTE: Comment/Share panels use position:absolute relative to the nearest
 * positioned ancestor, which is the Scene5Forum scroll container (inset:0),
 * NOT the post card itself. This means the panels cover the full viewport
 * height, which is the correct UX. The panels are rendered inside the post
 * card component for encapsulation but visually float above the page.
 *
 * data-scene5-post-id on the root div is required by the scroll API.
 */

import { useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Scene5ForumPostData } from './Scene5ForumData';
import { Scene5ForumEngagementBar } from './Scene5ForumEngagementBar';
import { Scene5CommentSheet } from './Scene5CommentSheet';
import { Scene5SharePanel } from './Scene5SharePanel';
import { useScene5Interaction } from './Scene5InteractionStore';
import { FORUM_POST_BASE_DATA } from './Scene5InteractionData';

export interface Scene5ForumPostProps {
  post: Scene5ForumPostData;
}

export function Scene5ForumPost({ post }: Scene5ForumPostProps) {
  const { state, dispatch } = useScene5Interaction();

  // Register this post's base data on first render.
  useEffect(() => {
    const base = FORUM_POST_BASE_DATA[post.id] ?? { likes: 0, comments: 0 };
    dispatch({ type: 'INIT_POST', postId: post.id, likeCount: base.likes, commentCount: base.comments });
  }, [post.id, dispatch]);

  const postState = state.posts[post.id];
  const liked = postState?.liked ?? false;
  const likeCount = postState?.likeCount ?? 0;
  const commentCount = postState?.commentCount ?? 0;
  const commentOpen = postState?.commentOpen ?? false;
  const commentShown = postState?.commentShown ?? false;
  const shareOpen = postState?.shareOpen ?? false;
  const shareConfirmed = postState?.shareConfirmed ?? false;

  const handleLike = () => {
    if (liked) {
      dispatch({ type: 'UNLIKE_POST', postId: post.id });
    } else {
      dispatch({ type: 'LIKE_POST', postId: post.id });
    }
  };

  const handleComment = () => {
    dispatch({ type: 'OPEN_COMMENTS', postId: post.id });
  };

  const handleShare = () => {
    dispatch({ type: 'OPEN_SHARE', postId: post.id });
  };

  const handleCloseComments = () => {
    dispatch({ type: 'CLOSE_COMMENTS' });
  };

  const handleRevealComment = () => {
    dispatch({ type: 'SHOW_PREPARED_COMMENT', postId: post.id });
  };

  const handleConfirmShare = () => {
    dispatch({ type: 'CONFIRM_SHARE', postId: post.id });
  };

  const handleCloseShare = () => {
    dispatch({ type: 'CLOSE_SHARE' });
  };

  return (
    <div
      data-scene5="forum-post"
      data-scene5-post-id={post.id}
      style={{ borderBottom: '8px solid #f5f5f3' }}
    >
      {/* Author row */}
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
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: '#6b6b66',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <MoreHorizontal size={19} />
        </button>
      </div>

      {/* Media */}
      <div style={{ width: '100%', aspectRatio: '4 / 5', background: '#000000', overflow: 'hidden' }}>
        <img src={post.media} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      {/* Caption */}
      <div style={{ padding: '10px 14px 0', fontSize: '13.5px', color: '#333333', lineHeight: 1.4 }}>
        <span style={{ fontWeight: 700, color: '#111111', marginRight: '6px' }}>{post.username}</span>
        {post.caption}
      </div>

      {/* Interactive engagement bar */}
      <Scene5ForumEngagementBar
        postId={post.id}
        liked={liked}
        likeCount={likeCount}
        commentCount={commentCount}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
      />

      {/* Comment bottom sheet — portals visually above the forum scroll container */}
      <Scene5CommentSheet
        postId={post.id}
        isOpen={commentOpen}
        commentShown={commentShown}
        onClose={handleCloseComments}
        onRevealComment={handleRevealComment}
      />

      {/* Share panel */}
      <Scene5SharePanel
        postId={post.id}
        isOpen={shareOpen}
        confirmed={shareConfirmed}
        onConfirm={handleConfirmShare}
        onClose={handleCloseShare}
      />
    </div>
  );
}
