import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLocation, Link } from 'wouter';

type ReferralHeaderProps = {
  title?: string;
  showLeaderboardButton?: boolean;
  theme?: 'light' | 'dark'; // light means white text/icons on dark bg, dark means dark text/icons on light bg
};

export function ReferralHeader({ title, showLeaderboardButton, theme = 'dark' }: ReferralHeaderProps) {
  const [, setLocation] = useLocation();

  const isLight = theme === 'light';
  
  return (
    <div className={`flex items-center justify-between px-4 py-4 z-10 relative ${isLight ? 'text-white' : 'text-black'}`}>
      <button 
        onClick={() => setLocation('/')}
        className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
          isLight
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-transparent hover:bg-gray-100 text-black'
        }`}
        data-testid="button-back"
      >
        <ChevronLeft size={26} />
      </button>

      {title && (
        <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>
      )}

      {showLeaderboardButton ? (
        <Link 
          href="/leaderboard"
          className="bg-white text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
          data-testid="link-leaderboard"
        >
          Leaderboard
        </Link>
      ) : (
        <div className="w-10 h-10" /> // Spacer for centering
      )}
    </div>
  );
}
