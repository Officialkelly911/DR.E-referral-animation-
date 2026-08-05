/**
 * Scene5PortfolioGrid.tsx
 *
 * Three-column Portfolio media grid. Renders each item as an image/quote
 * tile or a video tile, in the order defined by Scene5PortfolioData.
 */

import { PORTFOLIO_MEDIA } from './Scene5PortfolioData';
import { Scene5PortfolioMediaTile } from './Scene5PortfolioMediaTile';
import { Scene5PortfolioVideoTile } from './Scene5PortfolioVideoTile';

export function Scene5PortfolioGrid() {
  return (
    <div
      data-scene5="portfolio-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px',
        background: '#ffffff',
        padding: '2px 0 0',
      }}
    >
      {PORTFOLIO_MEDIA.map((item) =>
        item.kind === 'video' ? (
          <Scene5PortfolioVideoTile key={item.id} item={item} />
        ) : (
          <Scene5PortfolioMediaTile key={item.id} item={item} />
        ),
      )}
    </div>
  );
}
