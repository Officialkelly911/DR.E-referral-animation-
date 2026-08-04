import React from 'react';
import { LeaderboardUser } from '@/data/leaderboardData';

function RowAvatar({ user, className = '' }: { user: LeaderboardUser; className?: string }) {
  return (
    <div className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {user.photo ? (
        <img
          src={user.photo}
          alt={user.username}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${user.color} text-white font-bold text-sm`}>
          {user.initials}
        </div>
      )}
    </div>
  );
}

export function LeaderboardRow({ user }: { user: LeaderboardUser }) {
  if (user.isCurrentUser) {
    return (
      <div className="bg-dp-orange-gradient rounded-full p-1 pl-4 pr-1 flex items-center justify-between shadow-md mb-4 mt-2">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold w-6 text-center">{user.rank}</span>
          <RowAvatar user={user} className="w-10 h-10 border-2 border-white shadow-sm" />
          <span className="font-semibold text-white truncate max-w-[120px]">{user.username}</span>
        </div>
        <div className="bg-black/20 backdrop-blur-md px-4 py-3 rounded-full text-white font-bold text-sm">
          {user.points}pt
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 font-bold w-6 text-center">{user.rank}</span>
        <RowAvatar user={user} className="w-10 h-10 border border-gray-100 bg-gray-50" />
        <span className="font-semibold text-black truncate max-w-[120px]">{user.username}</span>
      </div>
      <div className="bg-gray-100 px-4 py-2 rounded-full text-black font-bold text-sm">
        {user.points}pt
      </div>
    </div>
  );
}
