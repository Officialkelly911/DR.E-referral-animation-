import React from 'react';
import { Check, Lock } from 'lucide-react';
import { LevelInfo } from '@/data/levelData';

export function ReferralLevelCard({ level }: { level: LevelInfo }) {
  return (
    <div className="w-full mt-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-black mb-2">{level.name}</h2>
        <div className="flex items-center justify-center gap-2 text-gray-500 font-medium">
          {level.isLocked ? (
            <>
              <Lock size={16} />
              <span>Locked</span>
            </>
          ) : (
            <span>{level.current}/{level.target} referrals</span>
          )}
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-[24px] p-6 text-white shadow-xl mx-4">
        <div className="flex gap-4 items-start pb-4 border-b border-white/10">
          <div className="mt-1 bg-white/20 p-1 rounded-full">
            <Check size={16} className="text-white" />
          </div>
          <p className="font-semibold text-lg leading-snug">{level.rewardText}</p>
        </div>
        
        <div className="flex flex-col gap-4 mt-4">
          {level.requirements.map((req, idx) => (
            <div key={idx} className={`flex gap-4 items-start ${idx !== level.requirements.length - 1 ? 'pb-4 border-b border-white/10' : ''}`}>
              <div className="mt-1 bg-white/20 p-1 rounded-full shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <p className="text-gray-300 font-medium leading-snug">{req}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
