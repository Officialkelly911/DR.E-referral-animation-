/**
 * Scene5CommentSheet.tsx
 *
 * Phase 5 — Bottom-sheet comment interface for a single Forum post.
 *
 * Behavior
 * ────────
 * • Opens from the bottom when commentOpen === true.
 * • Shows a prepared comment when commentShown === true.
 * • Framer Motion slide-up/down (200–400 ms per spec).
 * • Deterministic: no keyboard input, no network, no randomness.
 * • Both manual tap and automation API can open/close/reveal.
 *
 * data-scene5-action attributes on interactive targets let Playwright
 * drive the sheet without relying on brittle CSS selectors.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Scene5Comment } from './Scene5InteractionData';
import { PREPARED_COMMENTS } from './Scene5InteractionData';
import { FORUM_MEMBERS } from './Scene5ForumData';
import avatarAdeoshodin from '@assets/scene5-forum/avatar-adeoshodin.jpg';
import avatarSaintcarl23 from '@assets/scene5-forum/avatar-saintcarl23.png';
import avatarErosky from '@assets/scene5-forum/avatar-erosky.jpg';

// Map username → imported avatar so the sheet doesn't need to pass blobs.
const AVATAR_MAP: Record<string, string> = {
  saintcarl23: avatarSaintcarl23,
  'erosky❤️': avatarErosky,
  adeoshodin: avatarAdeoshodin,
};

for (const m of FORUM_MEMBERS) {
  if (m.avatar) AVATAR_MAP[m.name] = m.avatar;
}

function resolveAvatar(username: string): string {
  return AVATAR_MAP[username] ?? '';
}

export interface Scene5CommentSheetProps {
  postId: string;
  isOpen: boolean;
  commentShown: boolean;
  onClose: () => void;
  onRevealComment: () => void;
}

export function Scene5CommentSheet({
  postId,
  isOpen,
  commentShown,
  onClose,
  onRevealComment,
}: Scene5CommentSheetProps) {
  const prepared: Scene5Comment | undefined = PREPARED_COMMENTS[postId];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            key="comment-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 60,
            }}
            data-scene5-action="comment-scrim"
          />

          {/* Sheet */}
          <motion.div
            key="comment-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            data-scene5-action="comment-sheet"
            data-scene5-post-id={postId}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 70,
              background: '#ffffff',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
              minHeight: '240px',
              maxHeight: '70%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Handle + header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px 10px',
                borderBottom: '1px solid #f0f0ed',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#111111' }}>Comments</span>
              <button
                type="button"
                aria-label="Close comments"
                onClick={onClose}
                data-scene5-action="close-comments"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#6b6b66',
                  display: 'flex',
                  alignItems: 'center',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Comment list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              {!commentShown && (
                <div style={{ color: '#9a9a94', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
                  No comments yet
                </div>
              )}

              {commentShown && prepared && (
                <motion.div
                  key="prepared-comment"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  data-scene5-action="prepared-comment"
                  style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                >
                  {resolveAvatar(prepared.username) ? (
                    <img
                      src={resolveAvatar(prepared.username)}
                      alt={prepared.username}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#e5e5e0',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#6b6b66',
                      }}
                    >
                      {prepared.username[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#111111', marginRight: '6px' }}>
                      {prepared.username}
                    </span>
                    <span style={{ fontSize: '13px', color: '#333333' }}>{prepared.text}</span>
                    <div style={{ fontSize: '11px', color: '#9a9a94', marginTop: '4px' }}>{prepared.timestamp}</div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Reveal button — automation entry point & manual trigger */}
            {!commentShown && (
              <div style={{ padding: '10px 16px 20px' }}>
                <button
                  type="button"
                  onClick={onRevealComment}
                  data-scene5-action="reveal-prepared-comment"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px dashed #d0d0ca',
                    background: 'none',
                    color: '#6b6b66',
                    fontSize: '13px',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Add a comment…
                </button>
              </div>
            )}
            <div style={{ height: 'env(safe-area-inset-bottom, 10px)' }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
