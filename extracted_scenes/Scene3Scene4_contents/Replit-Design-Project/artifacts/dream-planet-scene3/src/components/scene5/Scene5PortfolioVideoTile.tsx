/**
 * Scene5PortfolioVideoTile.tsx
 *
 * A video tile in the Portfolio grid: the original clip rendered as its
 * own first-frame thumbnail (via a paused <video>), with a centered,
 * independently styled play overlay on top.
 *
 * No original play-icon asset was usable as an overlay graphic (the
 * supplied "Play button assets" file is a full-bleed raster with an
 * opaque background, not a transparent icon) — the overlay is built
 * from the project's existing lucide-react icon system instead, per
 * the Phase 3 spec's fallback allowance.
 */

import { Play } from 'lucide-react';
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
      <div
        data-scene5="portfolio-video-play-overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.32)',
          border: '1.5px solid rgba(255,255,255,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Play size={16} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
      </div>
    </div>
  );
}
