import React, { useState } from 'react';
import { Link } from 'wouter';
import { referralData } from '@/data/referralData';
import { EmptyState } from './EmptyState';

export function ReferralStatsTabs() {
  const [activeTab, setActiveTab] = useState<'qualified' | 'pending'>('qualified');

  return (
    <div className="flex-1 bg-white pt-16 px-6 flex flex-col rounded-t-3xl">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        <button
          onClick={() => setActiveTab('qualified')}
          className={`pb-4 text-base font-semibold transition-colors relative ${
            activeTab === 'qualified' ? 'text-black' : 'text-gray-400'
          }`}
          data-testid="tab-qualified"
        >
          Qualified
          {activeTab === 'qualified' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 text-base font-semibold transition-colors relative ${
            activeTab === 'pending' ? 'text-black' : 'text-gray-400'
          }`}
          data-testid="tab-pending"
        >
          Pending
          {activeTab === 'pending' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />
          )}
        </button>
      </div>

      {/* Level Summary Row */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-base font-semibold text-black">{referralData.currentLevel.toLowerCase()}</h2>
          <Link 
            href="/levels" 
            id="view-levels"
            className="text-[#FF6B00] font-semibold text-sm mt-1 inline-block"
            data-testid="link-view-levels"
          >
            View Levels
          </Link>
        </div>
        <div className="text-3xl font-bold text-black">
          <span>{referralData.qualified}</span>
          <span className="text-gray-400"> / {referralData.target}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'qualified' ? (
          referralData.qualified === 0 ? (
            <EmptyState message="No qualified referrals yet." />
          ) : (
            <div>{/* List of qualified referrals would go here */}</div>
          )
        ) : (
          <EmptyState message="No pending referrals." />
        )}
      </div>
    </div>
  );
}
