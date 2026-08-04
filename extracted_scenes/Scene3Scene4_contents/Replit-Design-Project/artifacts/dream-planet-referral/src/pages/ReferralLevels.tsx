import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ReferralHeader } from '@/components/referral/ReferralHeader';
import { ReferralLevelCard } from '@/components/referral/ReferralLevelCard';
import { levelsData } from '@/data/levelData';

// 4-pointed diamond sparkle matching the reference design
function DiamondSparkle({ size = 20, className = '', style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
    </svg>
  );
}

export default function ReferralLevels() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goLeft = () => setActiveIndex(prev => Math.max(0, prev - 1));
  const goRight = () => setActiveIndex(prev => Math.min(levelsData.length - 1, prev + 1));

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === levelsData.length - 1;

  return (
    <MobileLayout className="bg-[#FFF5EE]">
      {/* Background sparkle decorations — 4-pointed diamond shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <DiamondSparkle size={22} className="absolute text-[#FF6B00] opacity-60" style={{ top: '108px', left: '28px' } as React.CSSProperties} />
        <DiamondSparkle size={14} className="absolute text-[#FF6B00] opacity-50" style={{ top: '148px', left: '56px' } as React.CSSProperties} />
        <DiamondSparkle size={18} className="absolute text-[#FF6B00] opacity-50" style={{ top: '100px', right: '48px' } as React.CSSProperties} />
        <DiamondSparkle size={12} className="absolute text-[#FF6B00] opacity-40" style={{ top: '140px', right: '24px' } as React.CSSProperties} />
        <DiamondSparkle size={20} className="absolute text-[#FF6B00] opacity-55" style={{ top: '168px', right: '80px' } as React.CSSProperties} />
        <DiamondSparkle size={16} className="absolute text-[#FF6B00] opacity-45" style={{ top: '128px', left: '88px' } as React.CSSProperties} />
      </div>

      <ReferralHeader title="Levels" theme="dark" />

      <div className="flex-1 flex flex-col pt-6 pb-12 overflow-y-auto">
        {/* Carousel — peek layout: active badge centered, adjacent peek from edges */}
        <div className="relative h-[240px] overflow-hidden" id="badge-carousel">
          {/* Left nav arrow — always rendered, disabled on first */}
          <button
            onClick={goLeft}
            disabled={isFirst}
            className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-colors ${
              isFirst ? 'opacity-40 cursor-default' : 'hover:bg-gray-50 text-black'
            }`}
            data-testid="button-carousel-left"
            aria-label="Previous level"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right nav arrow — always rendered, disabled on last */}
          <button
            onClick={goRight}
            disabled={isLast}
            className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-colors ${
              isLast ? 'opacity-40 cursor-default' : 'hover:bg-gray-50 text-black'
            }`}
            data-testid="button-carousel-right"
            aria-label="Next level"
          >
            <ChevronRight size={22} />
          </button>

          {/* Badge track — translate to center active index */}
          {levelsData.map((level, idx) => {
            const offset = idx - activeIndex;
            // Active: centered. Adjacent: peek from side. Further: hidden.
            const isActive = offset === 0;
            const isPrev = offset === -1;
            const isNext = offset === 1;
            if (Math.abs(offset) > 1) return null;

            let translateX: string;
            if (isActive) translateX = '-50%';
            else if (isPrev) translateX = 'calc(-50% - 195px)';
            else translateX = 'calc(-50% + 195px)';

            return (
              <div
                key={level.id}
                className="absolute top-1/2"
                style={{
                  left: '50%',
                  transform: `translateX(${translateX}) translateY(-50%)`,
                  transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s',
                  opacity: isActive ? 1 : 0.45,
                  width: isActive ? '170px' : '100px',
                  height: isActive ? '170px' : '100px',
                  zIndex: isActive ? 10 : 5,
                }}
              >
                <img
                  src={level.image}
                  alt={level.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            );
          })}
        </div>

        {/* Content Card */}
        <div className="flex-1">
          <ReferralLevelCard level={levelsData[activeIndex]} />
        </div>
      </div>
    </MobileLayout>
  );
}
