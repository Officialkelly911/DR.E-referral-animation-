/**
 * Scene5ForumData.ts
 *
 * Content + media mapping for the Scene 5 Forum page.
 *
 * Media assets come from the supplied "Forum" upload (avatars + forum
 * posts) plus additional supplied creator content used for the targeted
 * pacing revision. Real member avatars are used rather than invented
 * placeholders. Exact post captions/timestamps and the Overview screen's
 * guideline copy are not present in the source material (the reference
 * screenshots crop them), so this content is written to match the
 * reference's tone and structure rather than claiming to reproduce
 * unseen exact text.
 *
 * Revision (targeted Scene 5 fix)
 * ────────────────────────────────
 * Expanded from 2 to 4 posts so the cinematic's extended Forum sequence
 * (Scene5Timeline.ts, Phase 6) can show a real multi-post community
 * discovery instead of one post on repeat. p3 and p4 reuse existing
 * community member avatars (erosky❤️, joanna) already defined in
 * FORUM_MEMBERS below, paired with additional supplied creator media —
 * members sharing/crediting other creators' work fits the Forum's own
 * guidelines ("credit original work").
 */

import forumOwnerAvatar from '@assets/Profile_photo__1785838557478.jpg';

import postPhotographer from '@assets/scene5-forum/forum-post-01-photographer.jpg';
import postStudioSinger from '@assets/scene5-forum/forum-post-02-studio-singer.jpg';
import postEpCover from '@assets/Kiut_rababag_1785838557478.jpg';
import postShootPortrait from '@assets/Pingerzbeat_1785838557477.jpg';

import avatarAdeoshodin from '@assets/scene5-forum/avatar-adeoshodin.jpg';
import avatarPoster02 from '@assets/scene5-forum/avatar-poster-02.jpg';
import avatarSaintcarl23 from '@assets/scene5-forum/avatar-saintcarl23.png';
import avatarErosky from '@assets/scene5-forum/avatar-erosky.jpg';
import avatarJoanna from '@assets/scene5-forum/avatar-joanna.jpg';
import avatarZeezee from '@assets/scene5-forum/avatar-zeezee.jpg';

export { forumOwnerAvatar };

/**
 * The Forum belongs to the same creator shown in the Portfolio
 * (Scene5PortfolioData.PROFILE) — name/avatar/member count are shared,
 * but the Forum has its own description distinct from the personal bio.
 */
export const FORUM = {
  ownerName: 'dr. Elizabeth Wisniewski',
  members: 47,
  description:
    'A high frequency space for embodied creative expression. Weekly prompts, feedback, and creative accountability.',
  createdDate: '02 Jun, 2025',
  guidelines: 'Be kind, credit original work, and keep posts on-topic for the group.',
  inviteLink: 'https://dreamplanet.org/forum/100',
};

export interface Scene5ForumPostData {
  id: string;
  username: string;
  avatar: string;
  timestamp: string;
  media: string;
  caption: string;
}

export const FORUM_POSTS: Scene5ForumPostData[] = [
  {
    id: 'p1',
    username: 'adeoshodin',
    avatar: avatarAdeoshodin,
    timestamp: '2w ago',
    media: postPhotographer,
    caption: 'Behind the scenes on this week\u2019s shoot \u2014 chasing the golden hour light again \ud83d\udcf8',
  },
  {
    id: 'p2',
    username: 'sonyavocals',
    avatar: avatarPoster02,
    timestamp: '4d ago',
    media: postStudioSinger,
    caption: 'Late night session in the booth. New vocals coming soon \ud83c\udfa4',
  },
  {
    id: 'p3',
    username: 'erosky\u2764\ufe0f',
    avatar: avatarErosky,
    timestamp: '1w ago',
    media: postEpCover,
    caption: 'Cover art for the new EP is finally done \u2014 \u201cGood Life\u201d drops next month \ud83c\udfa7',
  },
  {
    id: 'p4',
    username: 'joanna',
    avatar: avatarJoanna,
    timestamp: '3d ago',
    media: postShootPortrait,
    caption: 'Testing some new looks for the next campaign shoot \u2728',
  },
];

export interface Scene5ForumMemberData {
  id: string;
  name: string;
  avatar: string | null;
}

export const FORUM_MEMBERS: Scene5ForumMemberData[] = [
  { id: 'mem1', name: 'saintcarl23', avatar: avatarSaintcarl23 },
  { id: 'mem2', name: 'erosky\u2764\ufe0f', avatar: avatarErosky },
  { id: 'mem3', name: 'joanna', avatar: avatarJoanna },
  { id: 'mem4', name: 'zeezee', avatar: avatarZeezee },
  { id: 'mem5', name: 'uche', avatar: null },
];
