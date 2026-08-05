/**
 * Scene5PortfolioData.ts
 *
 * Content + media mapping for the Scene 5 Portfolio page (Phase 3).
 *
 * Media assets come from the supplied "portfolio media files" upload
 * (13 photos incl. 2 quote-card screenshots + 4 short video clips).
 * The reference screenshots also show several original-artwork /
 * painting tiles (e.g. an orange heart abstract, a coin-mosaic heart)
 * that were NOT included in the supplied asset upload — those tiles
 * are intentionally omitted rather than invented. See the Phase 3
 * fidelity report for the full discrepancy list.
 */

// Profile identity — same locked asset already used in Scenes 3/4 and the
// Phase 2 Side Navigation.
import profilePhoto from '@assets/Profile_photo__1785838557478.jpg';

import media01 from '@assets/scene5-portfolio/portfolio-01-outdoor.jpg';
import media02 from '@assets/scene5-portfolio/portfolio-02-outdoor-table.jpg';
import media03 from '@assets/scene5-portfolio/portfolio-03-huskies.jpg';
import media04 from '@assets/scene5-portfolio/portfolio-04-blue-dress.jpg';
import media05 from '@assets/scene5-portfolio/portfolio-05-lake.jpg';
import media06 from '@assets/scene5-portfolio/portfolio-06-dock.jpg';
import media07QuoteA from '@assets/scene5-portfolio/portfolio-07-quote-not-for-everyone.jpg';
import media08QuoteB from '@assets/scene5-portfolio/portfolio-08-quote-hot-streak.jpg';
import media09 from '@assets/scene5-portfolio/portfolio-09-instrument.jpg';
import media10 from '@assets/scene5-portfolio/portfolio-10-porch-guitar.jpg';
import media11 from '@assets/scene5-portfolio/portfolio-11-group-indoor.jpg';
import media12 from '@assets/scene5-portfolio/portfolio-12-yoga.jpg';
import media13 from '@assets/scene5-portfolio/portfolio-13-house-husky.jpg';

import videoAppDemo from '@assets/scene5-portfolio/portfolio-video-app-demo.mp4';
import videoDomeTent from '@assets/scene5-portfolio/portfolio-video-dome-tent.mp4';
import videoOutdoorLounge from '@assets/scene5-portfolio/portfolio-video-outdoor-lounge.mp4';
import videoBoyTent from '@assets/scene5-portfolio/portfolio-video-boy-tent.mp4';

export { profilePhoto };

export const PROFILE = {
  name: 'Elizabeth Wisniewski DC PhD',
  handle: 'dr._e',
  category: 'Others',
  bio: 'Entrepreneur | embodied leadership | artist | double doctor',
  membersInForum: 47,
  posts: 105,
};

export type Scene5PortfolioMediaKind = 'image' | 'video' | 'quote';

export interface Scene5PortfolioMediaItem {
  id: string;
  kind: Scene5PortfolioMediaKind;
  src: string;
  alt: string;
}

/**
 * Grid order approximates the reference screenshots' visual rhythm
 * (mixing personal photos, video clips, and the two quote-card
 * screenshots) using only the supplied original assets.
 */
export const PORTFOLIO_MEDIA: Scene5PortfolioMediaItem[] = [
  { id: 'm1', kind: 'image', src: media01, alt: 'Elizabeth outdoors in a garden setting' },
  { id: 'm2', kind: 'video', src: videoOutdoorLounge, alt: 'Outdoor lounge video clip' },
  { id: 'm3', kind: 'image', src: media10, alt: 'Guitar player on a porch step' },
  { id: 'm4', kind: 'image', src: media09, alt: 'Playing a hand percussion instrument' },
  { id: 'm5', kind: 'image', src: media03, alt: 'Elizabeth with two husky dogs' },
  { id: 'm6', kind: 'image', src: media13, alt: 'Elizabeth and a husky outside her home' },
  { id: 'm7', kind: 'image', src: media05, alt: 'Lake with lily pads' },
  { id: 'm8', kind: 'image', src: media02, alt: 'Outdoor table setting' },
  { id: 'm9', kind: 'image', src: media06, alt: 'On a marina dock' },
  { id: 'm10', kind: 'quote', src: media07QuoteA, alt: '"You are not for everyone" quote card' },
  { id: 'm11', kind: 'video', src: videoDomeTent, alt: 'Backyard dome tent video clip' },
  { id: 'm12', kind: 'image', src: media04, alt: 'Portrait in a blue dress' },
  { id: 'm13', kind: 'image', src: media11, alt: 'Group hangout indoors' },
  { id: 'm14', kind: 'video', src: videoBoyTent, alt: 'Backyard grow-tent video clip' },
  { id: 'm15', kind: 'image', src: media12, alt: 'Outdoor yoga session' },
  { id: 'm16', kind: 'quote', src: media08QuoteB, alt: '"You have a major hot streak coming" quote card' },
  { id: 'm17', kind: 'video', src: videoAppDemo, alt: 'App feature demo clip' },
];
