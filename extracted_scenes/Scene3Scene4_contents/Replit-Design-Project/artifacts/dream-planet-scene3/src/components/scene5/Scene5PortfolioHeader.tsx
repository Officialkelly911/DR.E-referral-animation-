/**
 * Scene5PortfolioHeader.tsx
 *
 * Top status row of the Portfolio page: the "dr._e" handle with its
 * verification badge on the left, and Share / Settings controls on the
 * right. Sits on the same dark near-black-green field as the rest of
 * the header/profile block (see Scene5Portfolio for the shared background).
 */

import { Share2, Settings, BadgeCheck } from 'lucide-react';

export function Scene5PortfolioHeader() {
  return (
    <div
      data-scene5="portfolio-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontSize: '19px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}
        >
          dr._e
        </span>
        {/* Verification badge: closest existing icon (lucide BadgeCheck)
            tinted Dream Planet orange — no original badge asset was
            supplied, per Phase 3 fidelity notes. */}
        <BadgeCheck size={18} color="#ffffff" fill="#FF8A1E" strokeWidth={1.75} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <button
          type="button"
          aria-label="Share portfolio"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Share2 size={21} color="#ffffff" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Portfolio settings"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Settings size={21} color="#ffffff" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
