/**
 * Scene5SideNavigation.tsx
 *
 * Dream Planet Side Navigation drawer for Scene 5.
 * Phase 2 scope: UI + open/close interaction only. No routing, no Forum/
 * Portfolio navigation, no Scene 5 timeline wiring — those are later phases.
 *
 * Composition:
 *   Scene5SideNavigation
 *   ├── Scene5NavOverlay      (background dimmer, independently animatable)
 *   └── drawer
 *       ├── Scene5NavProfile        (photo, name, View Portfolio)
 *       └── Scene5NavigationList
 *           ├── Scene5NavigationSection (main items)
 *           └── Scene5NavigationSection (Support / Settings, with divider)
 *
 * All elements carry stable `data-scene5="..."` attributes (per the Phase 2
 * spec) so a later animation phase can target them without touching markup.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Scene5NavOverlay } from './Scene5NavOverlay';
import { Scene5NavProfile } from './Scene5NavProfile';
import { Scene5NavigationList } from './Scene5NavigationList';

export interface Scene5SideNavigationProps {
  /** Whether the drawer is open. Fully controlled by the parent. */
  isOpen: boolean;
  /** Called when the overlay is tapped (i.e. the user wants to close it). */
  onClose?: () => void;
  onViewPortfolio?: () => void;
  onSelectItem?: (id: string) => void;
}

export function Scene5SideNavigation({
  isOpen,
  onClose,
  onViewPortfolio,
  onSelectItem,
}: Scene5SideNavigationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div data-scene5="side-nav-root" style={{ position: 'absolute', inset: 0, zIndex: 30 }}>
          <Scene5NavOverlay onClick={onClose} />

          <motion.div
            data-scene5="side-nav"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '78%',
              maxWidth: '320px',
              minWidth: '272px',
              background: '#ffffff',
              borderTopRightRadius: '28px',
              borderBottomRightRadius: '28px',
              boxShadow: '0 0 28px rgba(0,0,0,0.14)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              paddingTop: 'env(safe-area-inset-top, 14px)',
              paddingBottom: 'env(safe-area-inset-bottom, 10px)',
            }}
          >
            <Scene5NavProfile onViewPortfolio={onViewPortfolio} />
            <Scene5NavigationList onSelectItem={onSelectItem} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
