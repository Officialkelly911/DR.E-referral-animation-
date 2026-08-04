import React from 'react';
import { LeaderboardUser } from '@/data/leaderboardData';

function PodiumAvatar({ user, size }: { user: LeaderboardUser; size: 'lg' | 'md' }) {
  const dim = size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';
  const textSize = size === 'lg' ? 'text-3xl' : 'text-xl';

  return (
    <div className={`${dim} rounded-full overflow-hidden`}>
      {user.photo ? (
        <img
          src={user.photo}
          alt={user.username}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${user.color} text-white font-bold ${textSize}`}>
          {user.initials}
        </div>
      )}
    </div>
  );
}

export function LeaderboardPodium({ topUsers }: { topUsers: LeaderboardUser[] }) {
  const [first, second, third] = topUsers;

  return (
    <div className="flex items-end justify-center gap-6 mt-8 mb-12 h-[200px]">
      {/* 2nd Place */}
      {second && (
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-full border-2 border-orange-200 overflow-hidden shadow-sm">
              <PodiumAvatar user={second} size="md" />
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-orange-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              2
            </div>
          </div>
          <span className="font-semibold text-black text-sm truncate max-w-[80px]">{second.username}</span>
          <span className="text-gray-500 font-bold text-xs">{second.points}pt</span>
        </div>
      )}

      {/* 1st Place */}
      {first && (
        <div className="flex flex-col items-center -mt-8">
          <div className="relative mb-2">
            <div className="w-28 h-28 rounded-full border-4 border-[#FF6B00] overflow-hidden shadow-xl">
              <PodiumAvatar user={first} size="lg" />
            </div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FF6B00] text-white font-bold text-sm flex items-center justify-center shadow-md">
              1
            </div>
          </div>
          <span className="font-bold text-black text-base truncate max-w-[100px] mt-1">{first.username}</span>
          <span className="text-[#FF6B00] font-bold text-sm">{first.points}pt</span>
        </div>
      )}

      {/* 3rd Place */}
      {third && (
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-full border-2 border-[#CD7F32] overflow-hidden shadow-sm">
              <PodiumAvatar user={third} size="md" />
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#CD7F32] text-white font-bold text-xs flex items-center justify-center shadow-sm">
              3
            </div>
          </div>
          <span className="font-semibold text-black text-sm truncate max-w-[80px]">{third.username}</span>
          <span className="text-gray-500 font-bold text-xs">{third.points}pt</span>
        </div>
      )}
    </div>
  );
}
