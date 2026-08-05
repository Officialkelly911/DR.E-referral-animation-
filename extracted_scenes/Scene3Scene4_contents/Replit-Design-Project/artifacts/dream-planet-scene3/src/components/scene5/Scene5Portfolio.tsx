/**
 * Scene5Portfolio.tsx
 *
 * Scene 5 — Phase 3: Portfolio UI Recreation.
 *
 * Static Portfolio page only: header, profile, stats, View Forum
 * (placeholder callback — no real Forum navigation yet), media grid,
 * and the floating action button. No Forum implementation, no
 * engagement interactions, no cinematic animation, no master
 * integration — those are later Scene 5 phases.
 *
 * The whole page scrolls as one column; the dark header/profile block
 * and the white grid share this single scroll container (there is no
 * separate inner scroll region), matching the reference recording.
 */

import { Scene5PortfolioHeader } from './Scene5PortfolioHeader';
import { Scene5PortfolioProfile } from './Scene5PortfolioProfile';
import { Scene5PortfolioStats } from './Scene5PortfolioStats';
import { Scene5PortfolioGrid } from './Scene5PortfolioGrid';
import { Scene5PortfolioFloatingAction } from './Scene5PortfolioFloatingAction';

export interface Scene5PortfolioProps {
  /** Placeholder hook for the future Forum navigation — not wired yet. */
  onViewForum?: () => void;
  /** Placeholder hook for the floating "+" action — not wired yet. */
  onFloatingAction?: () => void;
}

export function Scene5Portfolio({ onViewForum, onFloatingAction }: Scene5PortfolioProps) {
  return (
    <div
      data-scene5="portfolio-page"
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#ffffff',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{ background: '#0d120c', paddingTop: 'env(safe-area-inset-top, 14px)' }}>
        <Scene5PortfolioHeader />
        <Scene5PortfolioProfile onViewForum={onViewForum} />
        <Scene5PortfolioStats />
      </div>
      <Scene5PortfolioGrid />
      <Scene5PortfolioFloatingAction onPress={onFloatingAction} />
      <div style={{ height: '24px' }} />
    </div>
  );
}
