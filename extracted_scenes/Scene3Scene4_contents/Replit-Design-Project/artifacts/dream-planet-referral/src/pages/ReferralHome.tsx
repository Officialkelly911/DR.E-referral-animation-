import React from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ReferralHero } from '@/components/referral/ReferralHero';
import { ReferralStatsTabs } from '@/components/referral/ReferralStatsTabs';

export default function ReferralHome() {
  return (
    <MobileLayout className="bg-white">
      <div id="referral-home" className="flex flex-col min-h-[100dvh]">
        <ReferralHero />
        <ReferralStatsTabs />
      </div>
    </MobileLayout>
  );
}
