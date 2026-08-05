/**
 * Scene5ViewForumButton.tsx
 *
 * The white pill "View Forum" control. This is the bridge into the Forum
 * (a later Scene 5 phase) — per the Phase 3 spec it must render, look
 * pressable, and expose a callback hook, but must NOT implement real
 * navigation yet.
 */

import { UserCheck } from 'lucide-react';

export interface Scene5ViewForumButtonProps {
  onPress?: () => void;
}

export function Scene5ViewForumButton({ onPress }: Scene5ViewForumButtonProps) {
  return (
    <button
      type="button"
      data-scene5="view-forum"
      onClick={onPress}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        background: '#f2f2f0',
        color: '#111111',
        border: 'none',
        borderRadius: '999px',
        padding: '13px 22px',
        fontSize: '15px',
        fontWeight: 700,
        lineHeight: 1,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <UserCheck size={17} strokeWidth={2.25} />
      View Forum
    </button>
  );
}
