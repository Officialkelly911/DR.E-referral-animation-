/**
 * Scene5Forum.tsx
 *
 * Phase 5 — Forum page shell, now connected to Scene5InteractionStore.
 *
 * Changes from Phase 4
 * ────────────────────
 * • Reads `forumState` (tab) from the interaction store instead of local
 *   useState, so the automation API can switch tabs without simulating clicks.
 * • Tab change dispatches SET_FORUM_TAB into the store.
 * • The scroll container carries data-scene5="forum-page" so the feed's
 *   scroll helper can find it by attribute rather than DOM traversal.
 * • No cinematic animation, no master integration (Phase 5 scope only).
 *
 * data-scene5-action attributes added:
 *   forum-post-tab      → the "Post" tab button
 *   forum-overview-tab  → the "Overview" tab button
 *
 * Revision (targeted Scene 5 fix)
 * ────────────────────────────────
 * The Portfolio's floating "+" (add post) button must never appear on the
 * Forum — neither the Post Feed tab nor the Overview tab. Per the real
 * Dream Planet interface, that action belongs to the Portfolio page only.
 * The button is intentionally NOT rendered here at all (previously it was
 * shown on the 'post' tab, which was incorrect).
 */

import React from 'react';
import { useScene5Interaction } from './Scene5InteractionStore';
import { Scene5ForumHeader } from './Scene5ForumHeader';
import { Scene5ForumProfileHeader } from './Scene5ForumProfileHeader';
import { Scene5ForumTabs, type Scene5ForumTab } from './Scene5ForumTabs';
import { Scene5ForumPostFeed } from './Scene5ForumPostFeed';
import { Scene5ForumOverview } from './Scene5ForumOverview';

export interface Scene5ForumProps {
  onBack?: () => void;
  onEditForum?: () => void;
}

export function Scene5Forum({ onBack, onEditForum }: Scene5ForumProps) {
  const { state, dispatch } = useScene5Interaction();

  // Tab state now lives in the store so the automation API can switch it.
  const tab = state.forumState;

  const handleTabChange = (newTab: Scene5ForumTab) => {
    dispatch({ type: 'SET_FORUM_TAB', tab: newTab });
  };

  return (
    <div
      data-scene5="forum-page"
      data-scene5-action="forum-post"
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#ffffff',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
      }}
    >
      <div style={{ background: '#0d120c', paddingTop: 'env(safe-area-inset-top, 14px)' }}>
        <Scene5ForumHeader onBack={onBack} onEditForum={onEditForum} />
        <Scene5ForumProfileHeader compact={tab === 'overview'} />
      </div>

      {/* Tabs: stable data-scene5-action attributes for each tab button */}
      <Scene5ForumTabs active={tab} onChange={handleTabChange} />

      {tab === 'post' ? <Scene5ForumPostFeed /> : <Scene5ForumOverview />}

      <div style={{ height: '24px' }} />
    </div>
  );
}
