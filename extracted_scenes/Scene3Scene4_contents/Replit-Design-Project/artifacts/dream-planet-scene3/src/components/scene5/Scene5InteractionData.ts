/**
 * Scene5InteractionData.ts
 *
 * Phase 5 — Deterministic data for hero post interaction sequences.
 *
 * Sources
 * ───────
 * • Base like/comment counts: SIMULATED — no unseen reference data
 *   provided exact values; counts are set to 0 per the spec instruction
 *   "use actual counts when known / do not invent counts unless required".
 * • Prepared comment: SIMULATED — provides a platform-consistent comment
 *   for deterministic video capture.
 *
 * All content is stored here (not hardcoded in components) so it can be
 * updated in one place if the real application's data is later provided.
 */

// ─── Post base counts ─────────────────────────────────────────────────────────

export interface Scene5PostBaseData {
  id: string;
  likes: number;
  comments: number;
}

/** SIMULATED — update when real counts are confirmed. */
export const FORUM_POST_BASE_DATA: Record<string, Scene5PostBaseData> = {
  p1: { id: 'p1', likes: 0, comments: 0 },
  p2: { id: 'p2', likes: 0, comments: 0 },
  p3: { id: 'p3', likes: 0, comments: 0 },
  p4: { id: 'p4', likes: 0, comments: 0 },
};

// ─── Prepared comments ────────────────────────────────────────────────────────

export interface Scene5Comment {
  id: string;
  username: string;
  /** Resolved image URL (imported asset) or empty string for avatar fallback. */
  avatar: string;
  text: string;
  timestamp: string;
}

/**
 * One deterministic prepared comment per hero post.
 *
 * SIMULATED — text is written to be platform-consistent and brand-appropriate.
 * Replace with real comment content when the live application is verified.
 */
export const PREPARED_COMMENTS: Record<string, Scene5Comment> = {
  p1: {
    id: 'cmt-p1-1',
    username: 'saintcarl23',
    avatar: '',           // filled by component from Scene5ForumData avatars
    text: '🔥 Love this shot — golden hour is everything',
    timestamp: 'Just now',
  },
  p2: {
    id: 'cmt-p2-1',
    username: 'erosky❤️',
    avatar: '',
    text: "Can't wait to hear the new vocals 🎤✨",
    timestamp: 'Just now',
  },
  p3: {
    id: 'cmt-p3-1',
    username: 'saintcarl23',
    avatar: '',
    text: 'This cover is stunning 😍 congrats on the EP!',
    timestamp: 'Just now',
  },
};

// ─── Share copy ───────────────────────────────────────────────────────────────

export interface Scene5ShareData {
  postId: string;
  /** Short label shown in the copy-link confirmation. */
  linkLabel: string;
  copyText: string;
}

/** SIMULATED — uses the Forum's known invite link pattern. */
export const SHARE_DATA: Record<string, Scene5ShareData> = {
  p1: {
    postId: 'p1',
    linkLabel: 'dreamplanet.org/forum/100',
    copyText: 'https://dreamplanet.org/forum/100',
  },
  p2: {
    postId: 'p2',
    linkLabel: 'dreamplanet.org/forum/100',
    copyText: 'https://dreamplanet.org/forum/100',
  },
};

// ─── Scroll targets ────────────────────────────────────────────────────────────

/**
 * Named scroll positions for the forum feed.
 *
 * 'top'        → scroll to 0
 * post-id      → scroll to that post card's top
 *
 * The feed uses data-scene5-post-id attributes so Playwright / the
 * animation timeline can find exact DOM nodes.
 */
export const FORUM_SCROLL_TARGETS = {
  TOP: 'top',
  HERO_POST_1: 'p1',
  HERO_POST_2: 'p2',
  HERO_POST_3: 'p3',
  HERO_POST_4: 'p4',
} as const;
