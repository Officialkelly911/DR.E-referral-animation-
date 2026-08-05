/**
 * Scene5PortfolioFloatingAction.tsx
 *
 * The orange floating "+" button pinned over the media grid. Fixed to
 * the bottom-right of the Portfolio's scroll container, matching the
 * reference's on-screen position regardless of scroll offset.
 *
 * Renders the real supplied "Add post" icon asset (already a complete
 * orange-circle + white-plus graphic) rather than the hand-built
 * div + lucide Plus stand-in used before that asset was provided.
 */

import addPostIcon from '@assets/Add_post_icon_trimmed.png';

export interface Scene5PortfolioFloatingActionProps {
  onPress?: () => void;
}

export function Scene5PortfolioFloatingAction({ onPress }: Scene5PortfolioFloatingActionProps) {
  return (
    <button
      type="button"
      data-scene5="portfolio-floating-action"
      onClick={onPress}
      aria-label="Add portfolio item"
      style={{
        position: 'sticky',
        float: 'right',
        bottom: '18px',
        marginRight: '16px',
        marginTop: '-70px',
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        background: 'none',
        border: 'none',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(255,107,26,0.45)',
        cursor: 'pointer',
        zIndex: 5,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <img
        src={addPostIcon}
        alt=""
        style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block', objectFit: 'cover' }}
      />
    </button>
  );
}
