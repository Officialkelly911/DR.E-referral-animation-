/**
 * Scene5PortfolioFloatingAction.tsx
 *
 * The orange floating "+" button pinned over the media grid. Fixed to
 * the bottom-right of the Portfolio's scroll container, matching the
 * reference's on-screen position regardless of scroll offset.
 */

import { Plus } from 'lucide-react';

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
        background: '#FF6B1A',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(255,107,26,0.45)',
        cursor: 'pointer',
        zIndex: 5,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Plus color="#ffffff" size={26} strokeWidth={2.5} />
    </button>
  );
}
