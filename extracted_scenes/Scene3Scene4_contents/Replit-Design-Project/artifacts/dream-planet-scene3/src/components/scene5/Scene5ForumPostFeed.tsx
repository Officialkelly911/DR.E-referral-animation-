/**
 * Scene5ForumPostFeed.tsx
 *
 * Phase 5 — Post feed with deterministic scroll control.
 *
 * Changes from Phase 4
 * ────────────────────
 * • Exposes a scroll ref via a forwarded ref so the parent (Scene5Forum)
 *   can imperatively scroll to any post by its stable post-id.
 * • Reads forumScrollTarget from the interaction store and executes the
 *   scroll, then clears the target to avoid re-firing.
 * • Each post card's root element carries data-scene5-post-id for reliable
 *   element lookup — both by this component and by Playwright.
 *
 * Scroll behaviour
 * ────────────────
 * The feed's scroll container is the Scene5Forum page's own overflow
 * container (position:absolute, inset:0, overflowY:auto). Scrolling
 * to a post queries data-scene5-post-id on the feed and calls
 * scrollIntoView with smooth behaviour for manual preview and instant
 * for automated capture (scrollBehavior param from the caller).
 */

import { useEffect, useRef } from 'react';
import { FORUM_POSTS } from './Scene5ForumData';
import { Scene5ForumPost } from './Scene5ForumPost';
import { useScene5Interaction } from './Scene5InteractionStore';

/** Exposed so Scene5Forum can imperatively control scroll position. */
export interface Scene5ForumPostFeedHandle {
  scrollToPost: (postId: string | 'top', behavior?: ScrollBehavior) => void;
}

export function Scene5ForumPostFeed() {
  const { state, dispatch } = useScene5Interaction();
  const feedRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll helper: finds the post card by data attribute and scrolls the
   * page container (not the feed div itself, which is not the scroll root).
   */
  const scrollToPost = (postId: string | 'top', behavior: ScrollBehavior = 'smooth') => {
    if (!feedRef.current) return;
    // Walk up to find the overflowY:auto scroll container.
    const scrollContainer = feedRef.current.closest<HTMLElement>('[data-scene5="forum-page"]');
    if (!scrollContainer) return;

    if (postId === 'top') {
      scrollContainer.scrollTo({ top: 0, behavior });
      return;
    }

    const postEl = feedRef.current.querySelector<HTMLElement>(`[data-scene5-post-id="${postId}"]`);
    if (!postEl) return;
    const containerTop = scrollContainer.getBoundingClientRect().top;
    const postTop = postEl.getBoundingClientRect().top;
    const offset = postTop - containerTop + scrollContainer.scrollTop - 8; // 8px breathing room
    scrollContainer.scrollTo({ top: offset, behavior });
  };

  // React to automation-driven scroll targets from the store.
  useEffect(() => {
    const target = state.forumScrollTarget;
    if (!target) return;
    // Use instant scroll for automation; smooth for the 'top' sentinel.
    scrollToPost(target, target === 'top' ? 'smooth' : 'instant');
    dispatch({ type: 'CLEAR_SCROLL_TARGET' });
  }, [state.forumScrollTarget, dispatch]);

  return (
    <div
      ref={feedRef}
      data-scene5="forum-post-feed"
      data-scene5-action="forum-scroll"
      style={{ background: '#ffffff' }}
    >
      {FORUM_POSTS.map((post) => (
        <Scene5ForumPost key={post.id} post={post} />
      ))}
    </div>
  );
}
