/**
 * Scene5ForumData.ts
 *
 * Content + media mapping for the Scene 5 Forum page (Phase 4).
 *
 * Media assets come from the supplied "Forum" upload (avatars + forum
 * posts). Per the Phase 4 spec, the goal is 2-3 visually strong posts
 * rather than an exhaustive feed, and real member avatars rather than
 * invented placeholders. The exact post captions/timestamps and the
 * Overview screen's guideline copy are not present in the source
 * material (the reference screenshots crop them), so this content is
 * written to match the reference's tone and structure rather than
 * claiming to reproduce unseen exact text.
 */

import forumOwnerAvatar from '@assets/Profile_photo__1785838557478.jpg';

import postPhotographer from '@assets/scene5-forum/forum-post-01-photographer.jpg';
import postStudioSinger from '@assets/scene5-forum/forum-post-02-studio-singer.jpg';

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
