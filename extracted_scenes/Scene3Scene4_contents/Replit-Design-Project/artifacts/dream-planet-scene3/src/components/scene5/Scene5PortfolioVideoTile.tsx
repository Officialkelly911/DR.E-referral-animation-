/**
 * Scene5PortfolioVideoTile.tsx
 *
 * A video tile in the Portfolio grid: the original clip rendered as its
 * own first-frame thumbnail (via a paused <video>), with a centered play
 * overlay on top using the real supplied play-icon asset (trimmed to its
 * opaque bounding box).
 */

import playIcon from '@assets/Play_video_icon_trimmed.png';
import type { Scene5PortfolioMediaItem } from './Scene5PortfolioData';

export interface Scene5PortfolioVideoTileProps {
  item: Scene5PortfolioMediaItem;
}

export function Scene5PortfolioVideoTile({ item }: Scene5PortfolioVideoTileProps) {
  return (
    <div
      data-scene5="portfolio-media-tile"
      data-scene5-media-kind="video"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      <video
        src={item.src}
        aria-label={item.alt}
        muted
        playsInline
        preload="metadata"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <img
        data-scene5="portfolio-video-play-overlay"
        src={playIcon}
        alt=""
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: 'auto',
          aspectRatio: '656 / 767',
          objectFit: 'contain',
          filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
