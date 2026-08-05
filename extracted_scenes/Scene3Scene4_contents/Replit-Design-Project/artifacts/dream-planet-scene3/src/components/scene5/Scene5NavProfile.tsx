/**
 * Scene5NavProfile.tsx
 *
 * Profile block at the top of the Scene 5 Side Navigation drawer:
 * circular profile photo, name, and the "View Portfolio" accent link.
 * Uses the same original profile photo already locked in for Scene 3/4.
 */

// Same asset already used/locked in Scene 3 & 4 — reused via the shared
// @assets alias, not duplicated.
import profilePhoto from '@assets/Profile_photo__1785838557478.jpg';

export interface Scene5NavProfileProps {
  onViewPortfolio?: () => void;
}

export function Scene5NavProfile({ onViewPortfolio }: Scene5NavProfileProps) {
  return (
    <div data-scene5="side-nav-profile" style={{ padding: '18px 24px 14px' }}>
      <img
        src={profilePhoto}
        alt="Elizabeth Wisniewski"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          marginBottom: '12px',
        }}
      />
      <div
        style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#111111',
          lineHeight: 1.25,
          marginBottom: '6px',
        }}
      >
        Elizabeth Wisniewski DC PhD
      </div>
      <button
        type="button"
        data-scene5="view-portfolio"
        onClick={onViewPortfolio}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          font: 'inherit',
          fontSize: '14px',
          fontWeight: 600,
          color: '#FF6B00',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        View Portfolio
      </button>
    </div>
  );
}
