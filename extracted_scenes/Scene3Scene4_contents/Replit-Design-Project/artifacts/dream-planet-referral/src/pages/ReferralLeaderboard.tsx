import React, { useState, useMemo } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ReferralHeader } from '@/components/referral/ReferralHeader';
import { LeaderboardPodium } from '@/components/referral/LeaderboardPodium';
import { LeaderboardRow } from '@/components/referral/LeaderboardRow';
import { leaderboardData } from '@/data/leaderboardData';

export default function ReferralLeaderboard() {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');

  const topUsers = useMemo(() => leaderboardData.slice(0, 3), [timeFilter]); // normally we'd filter data based on timeFilter
  const listUsers = useMemo(() => leaderboardData.slice(3, -1), [timeFilter]);
  const currentUser = useMemo(() => leaderboardData[leaderboardData.length - 1], [timeFilter]);

  return (
    <MobileLayout className="bg-white">
      <div id="leaderboard" className="flex flex-col h-[100dvh]">
        <ReferralHeader title="Leaderboard" theme="dark" />

        <div className="flex-1 overflow-y-auto px-4 py-2 pb-0">
          {/* Time Filter Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                timeFilter === 'week'
                  ? 'bg-black text-white border-black shadow-md'
                  : 'text-gray-500 border-gray-200 bg-white hover:bg-gray-50'
              }`}
              data-testid="tab-filter-week"
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                timeFilter === 'month'
                  ? 'bg-black text-white border-black shadow-md'
                  : 'text-gray-500 border-gray-200 bg-white hover:bg-gray-50'
              }`}
              data-testid="tab-filter-month"
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                timeFilter === 'all'
                  ? 'bg-black text-white border-black shadow-md'
                  : 'text-gray-500 border-gray-200 bg-white hover:bg-gray-50'
              }`}
              data-testid="tab-filter-all"
            >
              All Time
            </button>
          </div>

          <LeaderboardPodium topUsers={topUsers} />

          {/* Scrollable list */}
          <div className="flex flex-col gap-1">
            {listUsers.map(user => (
              <LeaderboardRow key={user.rank} user={user} />
            ))}
          </div>
        </div>

        {/* Sticky Current User — contained within the mobile frame */}
        <div className="px-4 py-3 bg-white border-t border-gray-50">
          <LeaderboardRow user={currentUser} />
        </div>
      </div>
    </MobileLayout>
  );
}
