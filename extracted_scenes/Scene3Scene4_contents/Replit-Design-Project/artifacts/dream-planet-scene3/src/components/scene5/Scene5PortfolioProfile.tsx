/**
 * Scene5PortfolioProfile.tsx
 *
 * Avatar + name + category + bio + the View Forum action, laid out to
 * match the reference: avatar and View Forum share a row, then name,
 * category, and bio stack below at full width.
 */

import { PROFILE, profilePhoto } from './Scene5PortfolioData';
import { Scene5ViewForumButton } from './Scene5ViewForumButton';

export interface Scene5PortfolioProfileProps {
  onViewForum?: () => void;
}

export function Scene5PortfolioProfile({ onViewForum }: Scene5PortfolioProfileProps) {
  return (
    <div data-scene5="portfolio-profile" style={{ padding: '18px 20px 16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <img
          data-scene5="portfolio-avatar"
          src={profilePhoto}
          alt={PROFILE.name}
          style={{
            width: '78px',
            height: '78px',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
            border: '3px solid #ffffff',
            boxSizing: 'border-box',
          }}
        />
        <Scene5ViewForumButton onPress={onViewForum} />
      </div>

      <div
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.25,
          marginBottom: '2px',
        }}
      >
        {PROFILE.name}
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 400,
          color: '#9a9a94',
          marginBottom: '12px',
        }}
      >
        {PROFILE.category}
      </div>
      <div
        style={{
          fontSize: '14.5px',
          fontWeight: 400,
          color: '#e8e8e4',
          lineHeight: 1.4,
        }}
      >
        {PROFILE.bio}
      </div>
    </div>
  );
}
