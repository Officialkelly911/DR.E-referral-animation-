/**
 * Scene5PreviewApp.tsx
 *
 * Standalone review harness for Phase 2 (Side Navigation) ONLY.
 * This is NOT part of the Scene 5 cinematic build and is fully isolated
 * from App.tsx / VideoTemplate.tsx (Scenes 3 & 4) — it exists purely so
 * the drawer can be reviewed against the reference in a browser.
 *
 * The block behind the drawer is a minimal placeholder standing in for
 * the real underlying screen (which will be built in the Portfolio phase)
 * so the overlay's "keep the background visible" behavior can be judged.
 * Served at /scene5-preview.html via src/main-scene5.tsx.
 */

import { useState } from 'react';
import { Share2, MoreHorizontal, Plus } from 'lucide-react';
import { Scene5SideNavigation } from './Scene5SideNavigation';

export function Scene5PreviewApp() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: '24px 0',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '390px',
          height: '844px',
          background: '#ffffff',
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: '0 0 0 1px #e5e7eb, 0 24px 48px rgba(0,0,0,0.12)',
        }}
      >
        {/* Placeholder underlying screen — stands in for the real Portfolio
            screen (Phase 3), just enough to demonstrate the overlay keeps
            the background visible rather than hiding it. */}
        <div style={{ position: 'absolute', inset: 0, background: '#f5f5f5' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '48px 20px 12px',
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '8px',
                cursor: 'pointer',
              }}
            >
              <span style={{ width: '20px', height: '2px', background: '#111' }} />
              <span style={{ width: '20px', height: '2px', background: '#111' }} />
              <span style={{ width: '20px', height: '2px', background: '#111' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#111', fontSize: '14px', fontWeight: 600 }}>
              Share <Share2 size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px' }}>
            <MoreHorizontal size={22} color="#111" />
          </div>
          <div
            style={{
              height: '260px',
              background: 'linear-gradient(160deg,#1a1a1a,#3a3a3a)',
              margin: '16px 20px',
              borderRadius: '16px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '110px',
              right: '20px',
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#FF6B00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(255,107,0,0.4)',
            }}
          >
            <Plus color="#fff" size={26} />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-around',
              padding: '14px 0 24px',
              borderTop: '1px solid #e5e7eb',
              background: '#fff',
              fontSize: '11px',
              color: '#9ca3af',
            }}
          >
            <span>Home</span>
            <span>Explore</span>
            <span style={{ color: '#FF6B00', fontWeight: 600 }}>Invest</span>
            <span>Profile</span>
          </div>
        </div>

        <Scene5SideNavigation
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onViewPortfolio={() => {}}
          onSelectItem={() => {}}
        />

        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 60,
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Open menu
          </button>
        )}
      </div>
    </div>
  );
}
