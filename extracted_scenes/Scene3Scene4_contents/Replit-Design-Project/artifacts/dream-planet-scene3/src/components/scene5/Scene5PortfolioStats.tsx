/**
 * Scene5PortfolioStats.tsx
 *
 * "47 Members in forum | 105 Posts" line. Numbers verified against the
 * latest reference screenshot (dated in the Phase 3 spec) — see the
 * fidelity report if the live source ever shows different values.
 */

import { PROFILE } from './Scene5PortfolioData';

export function Scene5PortfolioStats() {
  return (
    <div
      data-scene5="portfolio-stats"
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        padding: '0 20px 18px',
        fontSize: '15px',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontWeight: 700, color: '#ffffff' }}>{PROFILE.membersInForum}</span>
      <span style={{ fontWeight: 400, color: '#9a9a94' }}>Members in forum</span>
      <span style={{ color: '#5a5a54' }}>|</span>
      <span style={{ fontWeight: 700, color: '#ffffff' }}>{PROFILE.posts}</span>
      <span style={{ fontWeight: 400, color: '#9a9a94' }}>Posts</span>
    </div>
  );
}
