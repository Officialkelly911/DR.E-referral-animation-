# SCENE5_INTERACTION_AUDIT.md

Dream Planet Referral Campaign — Scene 5 Phase 5  
Forum Interaction States & Deterministic Community Engagement  
Audit Date: August 2026

---

## Status

Phase 5 implementation is **complete**. All interaction states have been
built, wired to the centralized store, verified manually, and covered by the
automated QA flow.

---

## What was built

| Deliverable | File | Status |
|---|---|---|
| Centralized interaction state | `Scene5InteractionStore.ts` | ✅ |
| Deterministic interaction data | `Scene5InteractionData.ts` | ✅ |
| Interactive engagement bar | `Scene5ForumEngagementBar.tsx` | ✅ |
| Comment bottom sheet | `Scene5CommentSheet.tsx` | ✅ |
| Share panel | `Scene5SharePanel.tsx` | ✅ |
| Forum post wired to store | `Scene5ForumPost.tsx` | ✅ |
| Deterministic scroll feed | `Scene5ForumPostFeed.tsx` | ✅ |
| Forum shell (tab from store) | `Scene5Forum.tsx` | ✅ |
| Preview harness (with provider) | `Scene5PreviewApp.tsx` | ✅ |
| Automation API | `scene5Actions.ts` | ✅ |
| Automated QA | `scene5InteractionQA.ts` | ✅ |
| Tab automation selectors | `Scene5ForumTabs.tsx` | ✅ |

---

## Interaction state architecture

### State shape

```
Scene5InteractionState
├── sideNavOpen          boolean
├── navigationState      'home' | 'portfolio' | 'forum'
├── forumState           'post' | 'overview'
├── forumScrollTarget    string | null   (post-id or 'top'; cleared after scroll)
├── activePostId         string | null
└── posts                Record<postId, PostInteractionState>
      ├── liked          boolean
      ├── likeCount      number
      ├── commentOpen    boolean
      ├── commentCount   number
      ├── commentShown   boolean         (prepared comment revealed)
      ├── shareOpen      boolean
      └── shareConfirmed boolean
```

### Architecture decisions

- Single React context (`Scene5InteractionContext`) wraps `Scene5PreviewApp`.
- All mutations flow through a pure `scene5Reducer` — no side effects in reducer.
- Posts are registered lazily on first render (`INIT_POST`) using base counts
  from `FORUM_POST_BASE_DATA`.
- `dispatchRef` is forwarded from the provider to `scene5Actions.register()`
  so the automation API can drive state without re-rendering the tree.

---

## Interaction behavior

### Like

| | Detail |
|---|---|
| **Source** | SIMULATED — no reference screenshot shows an active like state |
| **Default state** | Heart outline, count = 0, `data-scene5-liked="false"` |
| **Active state** | Heart filled `#e0335a`, count +1, `data-scene5-liked="true"` |
| **Animation** | 1.22× scale pop, 120 ms, Framer Motion |
| **Toggle** | Tap again → unlike → count −1 |
| **Layout stability** | Min-width on count span prevents layout shift |

### Comment

| | Detail |
|---|---|
| **Source** | SIMULATED — bottom sheet consistent with iOS platform patterns |
| **Default state** | Comment icon + count, no sheet |
| **Open state** | Bottom sheet slides up (320 ms tween), scrim covers forum |
| **Prepared comment** | Triggered by `scene5Actions.showPreparedComment(postId)` or tapping "Add a comment…" |
| **Count update** | +1 when `SHOW_PREPARED_COMMENT` dispatched, before comment is visible |
| **Close** | Tap scrim, tap ✕, or `scene5Actions.closeComments()` |
| **No keyboard input** | Automation does not require text input |

**Prepared comment data** (`Scene5InteractionData.ts`):
- Post p1: `saintcarl23` → "🔥 Love this shot — golden hour is everything"
- Post p2: `erosky❤️` → "Can't wait to hear the new vocals 🎤✨"

### Share

| | Detail |
|---|---|
| **Source** | SIMULATED — OS share sheet avoided for reliable automated capture |
| **Default state** | Share icon, label "Share", no panel |
| **Open state** | Bottom sheet slides up (300 ms tween) showing link + Copy link button |
| **Confirmed state** | Button transitions to green "✓ Link copied" (250 ms) |
| **Clipboard** | Best-effort `navigator.clipboard.writeText` in manual preview; skipped in automation |
| **Close** | Tap scrim, tap ✕, or `scene5Actions.closeShare()` |

### Forum feed scrolling

| | Detail |
|---|---|
| **Scroll container** | `[data-scene5="forum-page"]` — the forum's `position:absolute, overflow:auto` div |
| **Targets** | `'top'` → scrollTo(0), post-id → `scrollIntoView` offset via `getBoundingClientRect` |
| **Manual** | User scrolls naturally; not blocked by the interaction layer |
| **Automated** | `scene5Actions.scrollForumTo('p1')` dispatches `SCROLL_FORUM_TO` → feed effect executes → `CLEAR_SCROLL_TARGET` |
| **Behavior** | `'instant'` for automation, `'smooth'` for 'top' |

Named scroll targets (`FORUM_SCROLL_TARGETS`):
- `TOP` = `'top'`
- `HERO_POST_1` = `'p1'`
- `HERO_POST_2` = `'p2'`

### Forum tab switching

| | Detail |
|---|---|
| **Post → Overview** | `scene5Actions.switchForumTab('overview')` → `SET_FORUM_TAB` |
| **Overview → Post** | `scene5Actions.switchForumTab('post')` |
| **State preservation** | Post interaction state (likes, comments) survives tab switches |
| **Feed position** | Scroll position resets on tab switch (normal browser overflow behavior) |

### Navigation

| | Detail |
|---|---|
| **Home → Portfolio** | `scene5Actions.openPortfolio()` or "View Portfolio" in Side Nav |
| **Portfolio → Forum** | `scene5Actions.openForum()` or "View Forum" button on Portfolio |
| **Forum → Portfolio** | Forum header back button or `scene5Actions.openPortfolio()` |
| **State on navigate** | Panels (comment/share) closed; likes/comments preserved in store |

---

## Automation API

### scene5Actions (internal + window.__scene5Actions)

```ts
// Navigation
scene5Actions.openSideNavigation()
scene5Actions.closeSideNavigation()
scene5Actions.openPortfolio()
scene5Actions.openForum()
scene5Actions.goHome()
scene5Actions.navigateTo(screen)

// Forum
scene5Actions.switchForumTab('post' | 'overview')
scene5Actions.scrollForumTo('top' | 'p1' | 'p2')

// Like
scene5Actions.likePost(postId)
scene5Actions.unlikePost(postId)

// Comments
scene5Actions.openComments(postId)
scene5Actions.showPreparedComment(postId)
scene5Actions.closeComments()

// Share
scene5Actions.openShare(postId)
scene5Actions.confirmShare(postId)
scene5Actions.closeShare()

// Compound sequences
await scene5Actions.runHeroPost1Sequence(delays?)
await scene5Actions.runHeroPost2Sequence(delays?)
await scene5Actions.switchToOverviewAndBack(delays?)
```

---

## Interaction selectors

All interactive elements carry stable `data-scene5-action` attributes.

| Selector | Element |
|---|---|
| `[data-scene5-action="open-navigation"]` | Hamburger menu / Open menu button |
| `[data-scene5-action="back-to-menu"]` | Harness-only back button |
| `[data-scene5-action="like"][data-scene5-post-id="p1"]` | Like button, post p1 |
| `[data-scene5-action="comment"][data-scene5-post-id="p1"]` | Comment button, post p1 |
| `[data-scene5-action="share"][data-scene5-post-id="p1"]` | Share button, post p1 |
| `[data-scene5-action="comment-sheet"]` | Open comment bottom sheet |
| `[data-scene5-action="close-comments"]` | ✕ close button inside comment sheet |
| `[data-scene5-action="reveal-prepared-comment"]` | "Add a comment…" button |
| `[data-scene5-action="prepared-comment"]` | Revealed prepared comment |
| `[data-scene5-action="share-panel"]` | Open share panel |
| `[data-scene5-action="close-share"]` | ✕ close button inside share panel |
| `[data-scene5-action="copy-link"]` | Copy link / confirm button |
| `[data-scene5-action="forum-post-tab"]` | "Post" tab button |
| `[data-scene5-action="forum-overview-tab"]` | "Overview" tab button |
| `[data-scene5-action="forum-scroll"]` | Forum post feed root |
| `[data-scene5-post-id="p1"]` | All elements belonging to post p1 |
| `[data-scene5-post-id="p2"]` | All elements belonging to post p2 |

---

## Automated QA

Run from the browser console or Playwright:

```js
// Browser console
await window.__scene5QA.runAll()

// Playwright
const report = await page.evaluate(() => window.__scene5QA.runAll())
console.log(report)  // { passed, failed, results }
```

17 steps covering:
1. Open Side Navigation
2. Open Portfolio
3. Open Forum
4. Find hero post (p1)
5. Like hero post
6. Verify Like state (data-scene5-liked="true")
7. Open Comments
8. Reveal prepared comment
9. Verify comment visible
10. Close Comments
11. Open Share (p2)
12. Confirm Share
13. Verify share confirmed
14. Close Share
15. Switch to Overview tab
16. Return to Post tab
17. Verify feed interaction state preserved

Each step logs ✅ PASS or ❌ FAIL with reason.

---

## Deterministic capture QA

The same interaction sequence produces identical results across repeated runs:

| Run | Like p1 | Comment p1 | Share p2 |
|---|---|---|---|
| 1 | 1 Like | 1 Comment | Link copied |
| 2 | 1 Like | 1 Comment | Link copied |
| 3 | 1 Like | 1 Comment | Link copied |

**Why:** All state is in a React reducer with no randomness, no network
calls, no timers (except deliberate automation delays), and no localStorage
reads that could drift between runs. The prepared comment content is a
static constant.

---

## Known assumptions and limitations

| Item | Status | Notes |
|---|---|---|
| Base like/comment counts | **SIMULATED** | Set to 0 — real app counts not confirmed from reference |
| Prepared comment text | **SIMULATED** | Platform-consistent; replace from real app data |
| Share behavior | **SIMULATED** | Copy-link confirmation; OS share sheet avoided |
| Comment bottom sheet style | **SIMULATED** | iOS platform-consistent; real app sheet not fully documented |
| Unlike behavior | **IMPLEMENTED** | Toggle assumed supported; modular if real app differs |
| Hero post 3 | **NOT ADDED** | 2 posts match Phase 4 "2-3 posts" guidance; add p3 when needed |

---

## What is NOT in Phase 5

Per the Phase 5 stop condition:

- ❌ Cinematic Scene 5 animation — NOT implemented
- ❌ Scene 5 video capture — NOT implemented
- ❌ Master video integration — NOT touched
- ❌ Scenes 1–4 — NOT modified
- ❌ Scene 6 — NOT started

---

## Files modified

Phase 5 touches only `artifacts/dream-planet-scene3/src/`:

| File | Change |
|---|---|
| `components/scene5/Scene5InteractionStore.ts` | **NEW** |
| `components/scene5/Scene5InteractionData.ts` | **NEW** |
| `components/scene5/Scene5ForumEngagementBar.tsx` | **REPLACED** (was visual-only) |
| `components/scene5/Scene5CommentSheet.tsx` | **NEW** |
| `components/scene5/Scene5SharePanel.tsx` | **NEW** |
| `components/scene5/Scene5ForumPost.tsx` | **UPDATED** |
| `components/scene5/Scene5ForumPostFeed.tsx` | **UPDATED** |
| `components/scene5/Scene5Forum.tsx` | **UPDATED** |
| `components/scene5/Scene5ForumTabs.tsx` | **UPDATED** (added data-scene5-action) |
| `components/scene5/Scene5PreviewApp.tsx` | **UPDATED** |
| `components/scene5/scene5Actions.ts` | **NEW** |
| `components/scene5/scene5InteractionQA.ts` | **NEW** |
| `main-scene5.tsx` | **UPDATED** (imports QA + actions) |

No Scenes 1–4 files, no master files, no Playwright capture scripts were
modified.
