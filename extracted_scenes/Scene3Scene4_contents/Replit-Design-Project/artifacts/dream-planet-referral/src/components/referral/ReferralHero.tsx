import React from 'react';
import { ReferralHeader } from './ReferralHeader';
import { ReferralCodeCard } from './ReferralCodeCard';

import yellowAvatarImg from "@assets/D584BC4A-F374-4214-9909-3969CA68DFFF_1785791313737.png";
import lightBlueAvatarImg from "@assets/90B081D0-1C60-4E73-82F9-438E59013B4A_1785791313737.png";
import pinkThumbsAvatarImg from "@assets/3DF9C94B-3977-4E14-B891-1DEEC6A17354_1785791313737.png";
import hotPinkAvatarImg from "@assets/61F98831-A057-42BC-84E4-E8862E1BE1E5_1785791313737.png";

export function ReferralHero() {
  return (
    <div
      id="hero"
      className="relative w-full flex flex-col"
      style={{ background: 'linear-gradient(180deg, #FF6B00 0%, #FF9A3C 100%)', paddingBottom: '56px' }}
    >
      {/* Sunburst rays overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: '900px',
            height: '900px',
            transform: 'translate(-50%, -50%)',
            background: 'repeating-conic-gradient(from 0deg, transparent 0deg 13deg, rgba(255,255,255,0.12) 13deg 26deg)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ReferralHeader showLeaderboardButton theme="light" />
      </div>

      {/* Title + avatars */}
      <div className="flex flex-col items-center justify-center flex-1 relative" style={{ zIndex: 2, paddingBottom: '8px' }}>
        <h1 className="text-white text-2xl font-extrabold text-center mb-6 px-8 leading-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
          Refer your friends & earn
        </h1>

        {/* Avatars cluster — overlapping diamond arrangement matching reference */}
        <div className="relative" style={{ width: '220px', height: '210px' }}>
          {/* Top-center: pink thumbsup bearded guy */}
          <img
            src={pinkThumbsAvatarImg}
            alt="Avatar"
            className="absolute object-contain"
            style={{ top: 0, left: '50%', transform: 'translateX(-55%)', width: '100px', height: '100px', zIndex: 3 }}
          />
          {/* Left: yellow glasses girl */}
          <img
            src={yellowAvatarImg}
            alt="Avatar"
            className="absolute object-contain"
            style={{ top: '60px', left: 0, width: '98px', height: '98px', zIndex: 4 }}
          />
          {/* Right: light blue bearded pointing man */}
          <img
            src={lightBlueAvatarImg}
            alt="Avatar"
            className="absolute object-contain"
            style={{ top: '66px', right: 0, width: '90px', height: '90px', zIndex: 4 }}
          />
          {/* Bottom-center: hot pink braids girl */}
          <img
            src={hotPinkAvatarImg}
            alt="Avatar"
            className="absolute object-contain"
            style={{ bottom: 0, left: '50%', transform: 'translateX(-45%)', width: '96px', height: '96px', zIndex: 5 }}
          />
        </div>
      </div>

      {/* Referral code card — overlaps bottom edge */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4"
        style={{ transform: 'translateY(50%)', zIndex: 10 }}
      >
        <ReferralCodeCard />
      </div>
    </div>
  );
}
