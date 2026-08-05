/**
 * Scene5Forum.tsx
 *
 * Scene 5 — Phase 4: Community Forum UI recreation.
 *
 * Static Forum page only, with the two states shown in the reference
 * screenshots: Post feed (primary) and Overview (secondary), switched
 * via the Post/Overview tabs. No functional engagement interactions
 * (like/comment/share are visual-only), no navigation into individual
 * posts, no cinematic animation, no master integration — those are
 * later Scene 5 phases.
 *
 * Like Scene5Portfolio, the whole page scrolls as one column: the dark
 * header/profile block and the white body share a single scroll
 * container.
 */

import { useState } from 'react';
import { Scene5ForumHeader } from './Scene5ForumHeader';
import { Scene5ForumProfileHeader } from './Scene5ForumProfileHeader';
import { Scene5ForumTabs, type Scene5ForumTab } from './Scene5ForumTabs';
import { Scene5ForumPostFeed } from './Scene5ForumPostFeed';
import { Scene5ForumOverview } from './Scene5ForumOverview';
import { Scene5PortfolioFloatingAction } from './Scene5PortfolioFloatingAction';

export interface Scene5ForumProps {
  onBack?: () => void;
  onEditForum?: () => void;
  onFloatingAction?: () => void;
}

export function Scene5Forum({ onBack, onEditForum, onFloatingAction }: Scene5ForumProps) {
  // Harness-only convenience: ?tab=overview jumps straight to the
  // Overview tab for review/QA without clicking through the tab switcher.
  const initialTab: Scene5ForumTab =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('tab') === 'overview'
      ? 'overview'
      : 'post';
  const [tab, setTab] = useState<Scene5ForumTab>(initialTab);

  return (
    <div
      data-scene5="forum-page"
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
        <Scene5ForumHeader onBack={onBack} onEditForum={onEditForum} />
        <Scene5ForumProfileHeader compact={tab === 'overview'} />
      </div>
      <Scene5ForumTabs active={tab} onChange={setTab} />
      {tab === 'post' ? <Scene5ForumPostFeed /> : <Scene5ForumOverview />}
      {tab === 'post' && <Scene5PortfolioFloatingAction onPress={onFloatingAction} />}
      <div style={{ height: '24px' }} />
    </div>
  );
}
