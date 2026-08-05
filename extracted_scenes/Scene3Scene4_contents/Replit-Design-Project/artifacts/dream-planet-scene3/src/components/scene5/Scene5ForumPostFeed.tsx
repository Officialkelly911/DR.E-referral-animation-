/**
 * Scene5ForumPostFeed.tsx
 *
 * The Post tab's body: the vertical feed of Forum posts, per the
 * Phase 4 spec's "2-3 visually strong posts" guidance rather than an
 * exhaustive list.
 */

import { FORUM_POSTS } from './Scene5ForumData';
import { Scene5ForumPost } from './Scene5ForumPost';

export function Scene5ForumPostFeed() {
  return (
    <div data-scene5="forum-post-feed" style={{ background: '#ffffff' }}>
      {FORUM_POSTS.map((post) => (
        <Scene5ForumPost key={post.id} post={post} />
      ))}
    </div>
  );
}
