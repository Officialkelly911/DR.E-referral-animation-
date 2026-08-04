import React, { useState } from 'react';
import { referralData } from '@/data/referralData';
import { Check } from 'lucide-react';

export function ReferralCodeCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // In a real app, write to clipboard
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="referral-card">
      <div className="bg-white rounded-full p-2 pl-6 pr-2 w-full shadow-lg flex items-center justify-between border border-gray-100">
        <span className="text-xl font-bold tracking-wider text-black" data-testid="text-referral-code">
          {referralData.code}
        </span>
        <button 
          id="cta-button"
          onClick={handleCopy}
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
          data-testid="button-share"
        >
          {copied ? <Check size={18} /> : null}
          {copied ? 'Copied' : 'Share'}
        </button>
      </div>
    </div>
  );
}
