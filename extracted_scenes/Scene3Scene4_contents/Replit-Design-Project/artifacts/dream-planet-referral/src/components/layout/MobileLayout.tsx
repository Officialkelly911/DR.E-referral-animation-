import React from 'react';

export function MobileLayout({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className="min-h-[100dvh] w-full bg-gray-100 flex justify-center overflow-hidden">
      <div className={`w-full max-w-[390px] min-h-[100dvh] bg-white relative shadow-2xl overflow-hidden flex flex-col ${className}`}>
        {children}
      </div>
    </div>
  );
}
