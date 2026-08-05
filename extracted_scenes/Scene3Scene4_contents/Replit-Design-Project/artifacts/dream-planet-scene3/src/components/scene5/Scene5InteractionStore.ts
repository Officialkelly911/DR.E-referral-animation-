/**
 * Scene5InteractionStore.ts
 *
 * Phase 5 — Centralized deterministic interaction state for the Scene 5
 * Forum.  A single React Context wraps the whole Scene5PreviewApp so every
 * component can read and mutate the same state object.  The same state is
 * also reachable through the scene5Actions automation API (see
 * scene5Actions.ts) so the future cinematic timeline can drive it without
 * simulating clicks.
 *
 * Shape
 * ─────
 * Scene5InteractionState
 * ├── navigationState   ('home' | 'portfolio' | 'forum')
 * ├── forumState        ('post' | 'overview')
 * ├── forumScrollTarget (null | post-id string)
 * ├── activePostId      (null | post-id)   ← which post has a panel open
 * ├── posts             Record<postId, PostInteractionState>
 * │     ├── liked       boolean
 * │     ├── likeCount   number
 * │     ├── commentOpen boolean
 * │     ├── commentCount number
 * │     ├── commentShown boolean   ← prepared comment revealed
 * │     ├── shareOpen   boolean
 * │     └── shareConfirmed boolean
 * └── sideNavOpen       boolean
 *
 * All mutations go through a plain reducer so state transitions are
 * traceable and repeatable — no random seeds, no network, no timers.
 */

import React, { createContext, useContext, useReducer, useRef, useCallback } from 'react';
import type { Scene5ForumTab } from './Scene5ForumTabs';

// ─── Post-level interaction state ────────────────────────────────────────────

export interface PostInteractionState {
  liked: boolean;
  likeCount: number;
  commentOpen: boolean;
  commentCount: number;
  commentShown: boolean; // prepared comment revealed (for automation)
  shareOpen: boolean;
  shareConfirmed: boolean;
}

// ─── Top-level state ─────────────────────────────────────────────────────────

export type Scene5NavigationState = 'home' | 'portfolio' | 'forum';

export interface Scene5InteractionState {
  sideNavOpen: boolean;
  navigationState: Scene5NavigationState;
  forumState: Scene5ForumTab;
  forumScrollTarget: string | null; // post-id to scroll to, cleared after scroll
  activePostId: string | null;
  posts: Record<string, PostInteractionState>;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export type Scene5InteractionAction =
  | { type: 'OPEN_SIDE_NAV' }
  | { type: 'CLOSE_SIDE_NAV' }
  | { type: 'NAVIGATE'; screen: Scene5NavigationState }
  | { type: 'SET_FORUM_TAB'; tab: Scene5ForumTab }
  | { type: 'SCROLL_FORUM_TO'; postId: string | null }
  | { type: 'CLEAR_SCROLL_TARGET' }
  | { type: 'LIKE_POST'; postId: string }
  | { type: 'UNLIKE_POST'; postId: string }
  | { type: 'OPEN_COMMENTS'; postId: string }
  | { type: 'SHOW_PREPARED_COMMENT'; postId: string }
  | { type: 'CLOSE_COMMENTS' }
  | { type: 'OPEN_SHARE'; postId: string }
  | { type: 'CONFIRM_SHARE'; postId: string }
  | { type: 'CLOSE_SHARE' }
  | { type: 'INIT_POST'; postId: string; likeCount: number; commentCount: number };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function postDefaults(likeCount = 0, commentCount = 0): PostInteractionState {
  return {
    liked: false,
    likeCount,
    commentOpen: false,
    commentCount,
    commentShown: false,
    shareOpen: false,
    shareConfirmed: false,
  };
}

function scene5Reducer(
  state: Scene5InteractionState,
  action: Scene5InteractionAction,
): Scene5InteractionState {
  switch (action.type) {
    case 'OPEN_SIDE_NAV':
      return { ...state, sideNavOpen: true };

    case 'CLOSE_SIDE_NAV':
      return { ...state, sideNavOpen: false };

    case 'NAVIGATE':
      return {
        ...state,
        navigationState: action.screen,
        sideNavOpen: false,
        // close any open panels when navigating away from forum
        activePostId: action.screen !== 'forum' ? null : state.activePostId,
        posts:
          action.screen !== 'forum'
            ? closeAllPanels(state.posts)
            : state.posts,
      };

    case 'SET_FORUM_TAB':
      return { ...state, forumState: action.tab };

    case 'SCROLL_FORUM_TO':
      return { ...state, forumScrollTarget: action.postId };

    case 'CLEAR_SCROLL_TARGET':
      return { ...state, forumScrollTarget: null };

    case 'INIT_POST': {
      if (state.posts[action.postId]) return state; // already initialised
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.postId]: postDefaults(action.likeCount, action.commentCount),
        },
      };
    }

    case 'LIKE_POST': {
      const post = state.posts[action.postId];
      if (!post || post.liked) return state;
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.postId]: { ...post, liked: true, likeCount: post.likeCount + 1 },
        },
      };
    }

    case 'UNLIKE_POST': {
      const post = state.posts[action.postId];
      if (!post || !post.liked) return state;
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.postId]: { ...post, liked: false, likeCount: Math.max(0, post.likeCount - 1) },
        },
      };
    }

    case 'OPEN_COMMENTS': {
      const post = state.posts[action.postId];
      if (!post) return state;
      return {
        ...state,
        activePostId: action.postId,
        posts: {
          ...state.posts,
          [action.postId]: { ...post, commentOpen: true },
        },
      };
    }

    case 'SHOW_PREPARED_COMMENT': {
      const post = state.posts[action.postId];
      if (!post || post.commentShown) return state;
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.postId]: {
            ...post,
            commentShown: true,
            commentCount: post.commentCount + 1,
          },
        },
      };
    }

    case 'CLOSE_COMMENTS': {
      const updated: Record<string, PostInteractionState> = {};
      for (const [id, post] of Object.entries(state.posts)) {
        updated[id] = { ...post, commentOpen: false };
      }
      return { ...state, activePostId: null, posts: updated };
    }

    case 'OPEN_SHARE': {
      const post = state.posts[action.postId];
      if (!post) return state;
      return {
        ...state,
        activePostId: action.postId,
        posts: {
          ...state.posts,
          [action.postId]: { ...post, shareOpen: true, shareConfirmed: false },
        },
      };
    }

    case 'CONFIRM_SHARE': {
      const post = state.posts[action.postId];
      if (!post) return state;
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.postId]: { ...post, shareConfirmed: true },
        },
      };
    }

    case 'CLOSE_SHARE': {
      const updated: Record<string, PostInteractionState> = {};
      for (const [id, post] of Object.entries(state.posts)) {
        updated[id] = { ...post, shareOpen: false };
      }
      return { ...state, activePostId: null, posts: updated };
    }

    default:
      return state;
  }
}

function closeAllPanels(posts: Record<string, PostInteractionState>) {
  const updated: Record<string, PostInteractionState> = {};
  for (const [id, post] of Object.entries(posts)) {
    updated[id] = { ...post, commentOpen: false, shareOpen: false };
  }
  return updated;
}

// ─── Initial state ────────────────────────────────────────────────────────────

export const INITIAL_SCENE5_STATE: Scene5InteractionState = {
  sideNavOpen: false,
  navigationState: 'home',
  forumState: 'post',
  forumScrollTarget: null,
  activePostId: null,
  posts: {},
};

// ─── Context ──────────────────────────────────────────────────────────────────

export interface Scene5InteractionContextValue {
  state: Scene5InteractionState;
  dispatch: React.Dispatch<Scene5InteractionAction>;
}

export const Scene5InteractionContext = createContext<Scene5InteractionContextValue | null>(null);

export function useScene5Interaction(): Scene5InteractionContextValue {
  const ctx = useContext(Scene5InteractionContext);
  if (!ctx) throw new Error('useScene5Interaction must be used inside Scene5InteractionProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface Scene5InteractionProviderProps {
  children: React.ReactNode;
  /**
   * Expose the dispatch function via a ref so the automation API (scene5Actions)
   * can drive state without re-rendering the provider.
   */
  dispatchRef?: React.MutableRefObject<React.Dispatch<Scene5InteractionAction> | null>;
}

export function Scene5InteractionProvider({
  children,
  dispatchRef,
}: Scene5InteractionProviderProps) {
  const [state, dispatch] = useReducer(scene5Reducer, INITIAL_SCENE5_STATE);

  // Wire up the external dispatch ref for the automation API.
  const stableDispatch: React.Dispatch<Scene5InteractionAction> = useCallback(
    (action) => dispatch(action),
    [],
  );

  if (dispatchRef) {
    dispatchRef.current = stableDispatch;
  }

  return React.createElement(
    Scene5InteractionContext.Provider,
    { value: { state, dispatch: stableDispatch } },
    children,
  );
}
