/**
 * scene5Actions.ts
 *
 * Phase 5 — Clean internal automation API for the Scene 5 interaction layer.
 *
 * Purpose
 * ───────
 * Provides a stable, named set of actions that the future Scene 5
 * cinematic animation timeline (and Playwright scripts) can call to drive
 * the UI deterministically — without simulating pointer events or relying
 * on fragile DOM selectors.
 *
 * Each function validates that the dispatch handle is live before
 * calling it, so callers do not need to guard against undefined.
 *
 * Usage from the animation timeline
 * ──────────────────────────────────
 *   import { scene5Actions } from './scene5Actions';
 *   scene5Actions.openSideNavigation();
 *   scene5Actions.likePost('p1');
 *   // ... etc.
 *
 * Usage from Playwright (automated capture)
 * ──────────────────────────────────────────
 *   await page.evaluate(() => window.__scene5Actions.openForum());
 *   await page.evaluate(() => window.__scene5Actions.likePost('p1'));
 *
 * Registration
 * ────────────
 * Scene5PreviewApp calls `scene5Actions.register(dispatchRef)` after
 * mounting the Scene5InteractionProvider.  The actions are also bound
 * to `window.__scene5Actions` for Playwright access.
 *
 * Isolation
 * ─────────
 * All actions are isolated to Scene 5 — no Scene 1-4 state, no master,
 * no external network calls.
 */

import type React from 'react';
import type { Scene5InteractionAction, Scene5NavigationState } from './Scene5InteractionStore';
import type { Scene5ForumTab } from './Scene5ForumTabs';

// ─── Internal dispatch handle ──────────────────────────────────────────────────

let _dispatch: React.Dispatch<Scene5InteractionAction> | null = null;

function dispatch(action: Scene5InteractionAction) {
  if (!_dispatch) {
    console.warn('[scene5Actions] Not registered — call scene5Actions.register(dispatchRef) first.');
    return;
  }
  _dispatch(action);
}

// ─── Public API ────────────────────────────────────────────────────────────────

export const scene5Actions = {
  /**
   * Register the interaction store's dispatch function.
   * Called by Scene5PreviewApp after mounting the provider.
   */
  register(dispatchRef: React.MutableRefObject<React.Dispatch<Scene5InteractionAction> | null>) {
    _dispatch = dispatchRef.current;
    // Re-read on next tick in case the ref is set after this call.
    setTimeout(() => {
      if (dispatchRef.current) _dispatch = dispatchRef.current;
    }, 0);
  },

  // ── Navigation ────────────────────────────────────────────────────────────

  /** Open the Side Navigation drawer. */
  openSideNavigation() {
    dispatch({ type: 'OPEN_SIDE_NAV' });
  },

  /** Close the Side Navigation drawer. */
  closeSideNavigation() {
    dispatch({ type: 'CLOSE_SIDE_NAV' });
  },

  /** Navigate to the Portfolio screen (also closes Side Nav). */
  openPortfolio() {
    dispatch({ type: 'NAVIGATE', screen: 'portfolio' });
  },

  /** Navigate to the Forum screen. */
  openForum() {
    dispatch({ type: 'NAVIGATE', screen: 'forum' });
  },

  /** Return to the Home screen. */
  goHome() {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
  },

  /** Navigate to any named screen. */
  navigateTo(screen: Scene5NavigationState) {
    dispatch({ type: 'NAVIGATE', screen });
  },

  // ── Forum tabs ────────────────────────────────────────────────────────────

  /**
   * Switch the Forum's active tab.
   * @param tab 'post' | 'overview'
   */
  switchForumTab(tab: Scene5ForumTab) {
    dispatch({ type: 'SET_FORUM_TAB', tab });
  },

  // ── Forum feed scrolling ──────────────────────────────────────────────────

  /**
   * Scroll the forum feed to a named position.
   * @param target 'top' | post-id (e.g. 'p1', 'p2')
   *
   * The feed component reads forumScrollTarget from the store and
   * executes the scroll imperatively.
   */
  scrollForumTo(target: string) {
    dispatch({ type: 'SCROLL_FORUM_TO', postId: target });
  },

  // ── Like ──────────────────────────────────────────────────────────────────

  /** Like a post (no-op if already liked). */
  likePost(postId: string) {
    dispatch({ type: 'LIKE_POST', postId });
  },

  /** Unlike a post (no-op if not liked). */
  unlikePost(postId: string) {
    dispatch({ type: 'UNLIKE_POST', postId });
  },

  // ── Comments ──────────────────────────────────────────────────────────────

  /** Open the comment sheet for a post. */
  openComments(postId: string) {
    dispatch({ type: 'OPEN_COMMENTS', postId });
  },

  /** Reveal the prepared comment inside the open comment sheet. */
  showPreparedComment(postId: string) {
    dispatch({ type: 'SHOW_PREPARED_COMMENT', postId });
  },

  /** Close the comment sheet (works for any open post). */
  closeComments() {
    dispatch({ type: 'CLOSE_COMMENTS' });
  },

  // ── Share ─────────────────────────────────────────────────────────────────

  /** Open the share panel for a post. */
  openShare(postId: string) {
    dispatch({ type: 'OPEN_SHARE', postId });
  },

  /** Confirm the share (show "Link copied" state). */
  confirmShare(postId: string) {
    dispatch({ type: 'CONFIRM_SHARE', postId });
  },

  /** Close the share panel. */
  closeShare() {
    dispatch({ type: 'CLOSE_SHARE' });
  },

  // ── Compound sequences (convenience) ─────────────────────────────────────

  /**
   * Execute the full Hero Post 1 interaction sequence:
   * Like → open Comments → reveal prepared comment.
   * Delays are animation-ready but not final cinematic timing.
   */
  async runHeroPost1Sequence(delays = { afterLike: 600, afterOpenComments: 400 }) {
    scene5Actions.scrollForumTo('p1');
    await wait(400);
    scene5Actions.likePost('p1');
    await wait(delays.afterLike);
    scene5Actions.openComments('p1');
    await wait(delays.afterOpenComments);
    scene5Actions.showPreparedComment('p1');
  },

  /**
   * Execute the Hero Post 2 share sequence:
   * Scroll → open Share → confirm Share.
   */
  async runHeroPost2Sequence(delays = { afterScroll: 400, afterOpenShare: 600 }) {
    scene5Actions.closeComments(); // safety close
    scene5Actions.scrollForumTo('p2');
    await wait(delays.afterScroll);
    scene5Actions.openShare('p2');
    await wait(delays.afterOpenShare);
    scene5Actions.confirmShare('p2');
  },

  /** Switch Forum ↔ Overview tabs. */
  async switchToOverviewAndBack(delays = { hold: 800 }) {
    scene5Actions.switchForumTab('overview');
    await wait(delays.hold);
    scene5Actions.switchForumTab('post');
  },
} as const;

// ─── Bind to window for Playwright access ─────────────────────────────────────

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>)['__scene5Actions'] = scene5Actions;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
