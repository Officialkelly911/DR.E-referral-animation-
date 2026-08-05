/**
 * Scene5PreviewApp.tsx
 *
 * Phase 5 — Preview harness now wraps the entire Scene 5 subtree with
 * Scene5InteractionProvider, giving all components access to the centralized
 * interaction store.
 *
 * Changes from Phase 4
 * ────────────────────
 * • Wrapped in <Scene5InteractionProvider> with a dispatchRef.
 * • scene5Actions.register() called after mount so the automation API is
 *   live for Playwright / the future animation timeline.
 * • navigationState and sideNavOpen are now read from the store instead
 *   of local useState — local state removed for those.
 * • forumState (tab) lives in the store; Scene5Forum reads it directly.
 * • The harness-only "Back to menu" chrome is preserved unchanged.
 * • data-scene5-action attributes added to all nav-trigger elements.
 *
 * Served at /scene5-preview.html via src/main-scene5.tsx.
 */

import { useRef, useEffect } from 'react';
import { Share2, MoreHorizontal, Plus, ArrowLeft } from 'lucide-react';
import { Scene5SideNavigation } from './Scene5SideNavigation';
import { Scene5Portfolio } from './Scene5Portfolio';
import { Scene5Forum } from './Scene5Forum';
import {
  Scene5InteractionProvider,
  useScene5Interaction,
  type Scene5InteractionAction,
} from './Scene5InteractionStore';
import type React from 'react';
import { scene5Actions } from './scene5Actions';

// ─── Inner harness (reads from context) ──────────────────────────────────────

function Scene5PreviewInner() {
  const { state, dispatch } = useScene5Interaction();
  const screen = state.navigationState;
  const isOpen = state.sideNavOpen;

  // Sync query-param shortcuts on first mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const requestedScreen = params.get('screen');
    if (requestedScreen === 'portfolio') {
      dispatch({ type: 'NAVIGATE', screen: 'portfolio' });
    } else if (requestedScreen === 'forum') {
      dispatch({ type: 'NAVIGATE', screen: 'forum' });
    } else {
      dispatch({ type: 'OPEN_SIDE_NAV' });
    }
    // Tab shortcut
    if (params.get('tab') === 'overview') {
      dispatch({ type: 'SET_FORUM_TAB', tab: 'overview' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {/* Portfolio screen */}
        {screen === 'portfolio' && (
          <>
            <Scene5Portfolio
              onViewForum={() => dispatch({ type: 'NAVIGATE', screen: 'forum' })}
              onFloatingAction={() => {}}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: 'NAVIGATE', screen: 'home' })}
              data-scene5-action="back-to-menu"
              style={harnessBtnStyle}
            >
              <ArrowLeft size={13} /> Back to menu (preview only)
            </button>
          </>
        )}

        {/* Forum screen */}
        {screen === 'forum' && (
          <>
            <Scene5Forum
              onBack={() => dispatch({ type: 'NAVIGATE', screen: 'portfolio' })}
              onEditForum={() => {}}
              onFloatingAction={() => {}}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: 'NAVIGATE', screen: 'home' })}
              data-scene5-action="back-to-menu"
              style={harnessBtnStyle}
            >
              <ArrowLeft size={13} /> Back to menu (preview only)
            </button>
          </>
        )}

        {/* Home placeholder */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#f5f5f5',
            display: screen === 'home' ? 'block' : 'none',
          }}
          data-scene5-preview="home-placeholder"
        >
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
              onClick={() => dispatch({ type: 'OPEN_SIDE_NAV' })}
              aria-label="Open menu"
              data-scene5-action="open-navigation"
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

        {/* Side Navigation drawer */}
        <Scene5SideNavigation
          isOpen={isOpen}
          onClose={() => dispatch({ type: 'CLOSE_SIDE_NAV' })}
          onViewPortfolio={() => dispatch({ type: 'NAVIGATE', screen: 'portfolio' })}
          onSelectItem={() => {}}
        />

        {/* Open-menu shortcut (home + nav closed) */}
        {!isOpen && screen === 'home' && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'OPEN_SIDE_NAV' })}
            data-scene5-action="open-navigation"
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

// ─── Outer shell — provides the store ────────────────────────────────────────

export function Scene5PreviewApp() {
  const dispatchRef = useRef<React.Dispatch<Scene5InteractionAction> | null>(null);

  // Register the automation API once the provider has mounted.
  useEffect(() => {
    scene5Actions.register(dispatchRef);
  }, []);

  return (
    <Scene5InteractionProvider dispatchRef={dispatchRef}>
      <Scene5PreviewInner />
    </Scene5InteractionProvider>
  );
}

// ─── Harness button style ─────────────────────────────────────────────────────

const harnessBtnStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  zIndex: 40,
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '7px 10px 7px 8px',
  fontSize: '11px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
};
