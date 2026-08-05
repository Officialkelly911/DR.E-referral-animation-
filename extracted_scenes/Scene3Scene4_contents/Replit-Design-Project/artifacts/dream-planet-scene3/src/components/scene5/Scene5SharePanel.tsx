/**
 * Scene5SharePanel.tsx
 *
 * Phase 5 — Deterministic share panel for a Forum post.
 *
 * Behavior
 * ────────
 * • Slides up from the bottom (300–500 ms).
 * • Shows a "Copy link" action that transitions to a ✓ confirmation.
 * • Does NOT open the OS share sheet — browser-based capture cannot
 *   reproduce it reliably (per Phase 5 spec).
 * • Reversible: onClose returns the forum to normal.
 * • Both manual tap and automation API can open/confirm/close.
 *
 * SIMULATED: no real clipboard write during automated capture;
 * the confirmation state is driven by share state rather than a
 * real navigator.clipboard result.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Link, Check, X } from 'lucide-react';
import { SHARE_DATA } from './Scene5InteractionData';

export interface Scene5SharePanelProps {
  postId: string;
  isOpen: boolean;
  confirmed: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function Scene5SharePanel({
  postId,
  isOpen,
  confirmed,
  onConfirm,
  onClose,
}: Scene5SharePanelProps) {
  const shareData = SHARE_DATA[postId];

  const handleCopyLink = () => {
    // Best-effort real clipboard write for manual preview use.
    if (shareData && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareData.copyText).catch(() => {});
    }
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            key="share-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.35)',
              zIndex: 60,
            }}
            data-scene5-action="share-scrim"
          />

          {/* Panel */}
          <motion.div
            key="share-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            data-scene5-action="share-panel"
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
              padding: '16px 16px 24px',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#111111' }}>Share</span>
              <button
                type="button"
                aria-label="Close share panel"
                onClick={onClose}
                data-scene5-action="close-share"
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

            {/* Link row */}
            {shareData && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: '#f5f5f3',
                  borderRadius: '12px',
                  marginBottom: '14px',
                }}
              >
                <Link size={16} color="#6b6b66" />
                <span style={{ flex: 1, fontSize: '13px', color: '#333333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {shareData.linkLabel}
                </span>
              </div>
            )}

            {/* Copy link button */}
            <motion.button
              type="button"
              onClick={handleCopyLink}
              data-scene5-action="copy-link"
              animate={confirmed ? { background: '#1a6b3c', color: '#ffffff' } : { background: '#111111', color: '#ffffff' }}
              transition={{ duration: 0.25 }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {confirmed ? (
                <>
                  <Check size={17} />
                  Link copied
                </>
              ) : (
                'Copy link'
              )}
            </motion.button>

            <div style={{ height: 'env(safe-area-inset-bottom, 10px)' }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
