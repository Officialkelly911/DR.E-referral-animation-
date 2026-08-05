/**
 * Scene5PortfolioHeader.tsx
 *
 * Top status row of the Portfolio page: the "dr._e" handle with its
 * verification badge on the left, and Share / Settings controls on the
 * right. Sits on the same dark near-black-green field as the rest of
 * the header/profile block (see Scene5Portfolio for the shared background).
 *
 * Verification badge, Share, and Settings glyphs are the real supplied
 * icon assets (trimmed to their opaque bounding box) rather than the
 * lucide-react stand-ins used before those assets were provided.
 */

import verificationBadge from '@assets/Verification_badge_icon_trimmed.png';
import shareIcon from '@assets/Share_icon_trimmed.png';
import settingsIcon from '@assets/Settings_icon_trimmed.png';

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
        <img
          src={verificationBadge}
          alt="Verified"
          style={{ height: '18px', width: 'auto', aspectRatio: '785 / 833', objectFit: 'contain', display: 'block' }}
        />
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
          <img
            src={shareIcon}
            alt=""
            style={{ height: '19px', width: 'auto', aspectRatio: '719 / 594', objectFit: 'contain', display: 'block' }}
          />
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
          <img
            src={settingsIcon}
            alt=""
            style={{ height: '21px', width: 'auto', aspectRatio: '723 / 716', objectFit: 'contain', display: 'block' }}
          />
        </button>
      </div>
    </div>
  );
}
