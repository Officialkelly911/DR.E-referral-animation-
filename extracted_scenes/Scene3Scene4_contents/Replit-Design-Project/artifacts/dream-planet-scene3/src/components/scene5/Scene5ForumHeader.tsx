/**
 * Scene5ForumHeader.tsx
 *
 * Top row of the Forum page: a back chevron on the left and the white
 * "Edit Forum" pill on the right, matching both reference screenshots
 * (Post feed and Overview share this same header row).
 */

import { ChevronLeft } from 'lucide-react';

export interface Scene5ForumHeaderProps {
  onBack?: () => void;
  onEditForum?: () => void;
}

export function Scene5ForumHeader({ onBack, onEditForum }: Scene5ForumHeaderProps) {
  return (
    <div
      data-scene5="forum-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px 0',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#ffffff',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={onEditForum}
        data-scene5="edit-forum"
        style={{
          background: '#f2f2f0',
          color: '#111111',
          border: 'none',
          borderRadius: '999px',
          padding: '13px 24px',
          fontSize: '15px',
          fontWeight: 700,
          lineHeight: 1,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        Edit Forum
      </button>
    </div>
  );
}
