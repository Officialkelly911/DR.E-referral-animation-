/**
 * Scene5PortfolioMediaTile.tsx
 *
 * A single image or quote-card tile in the Portfolio grid.
 * - "image": photo content — cropped to fill the square (object-fit: cover).
 * - "quote": the two supplied quote-card screenshots — shown uncropped
 *   (object-fit: contain) so the readable text composition is preserved,
 *   per the Phase 3 spec's "do not crop important text" requirement.
 */

import type { Scene5PortfolioMediaItem } from './Scene5PortfolioData';

export interface Scene5PortfolioMediaTileProps {
  item: Scene5PortfolioMediaItem;
}

export function Scene5PortfolioMediaTile({ item }: Scene5PortfolioMediaTileProps) {
  const isQuote = item.kind === 'quote';
  return (
    <div
      data-scene5="portfolio-media-tile"
      data-scene5-media-kind={item.kind}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        background: isQuote ? '#0d120c' : '#e5e5e0',
      }}
    >
      <img
        src={item.src}
        alt={item.alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: isQuote ? 'contain' : 'cover',
          display: 'block',
        }}
      />
    </div>
  );
}
