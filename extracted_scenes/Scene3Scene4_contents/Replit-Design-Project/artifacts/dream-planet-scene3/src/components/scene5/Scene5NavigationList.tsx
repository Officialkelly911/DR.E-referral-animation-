/**
 * Scene5NavigationList.tsx
 *
 * Full navigation menu body: main items (Store Analytics → Referral),
 * a divider, then the bottom section (Support, Settings). Scrolls
 * independently if content exceeds the drawer height on small viewports.
 */

import { SCENE5_MAIN_NAV_ITEMS, SCENE5_BOTTOM_NAV_ITEMS } from './Scene5NavData';
import { Scene5NavigationItem } from './Scene5NavigationItem';
import { Scene5NavigationSection } from './Scene5NavigationSection';

export interface Scene5NavigationListProps {
  onSelectItem?: (id: string) => void;
}

export function Scene5NavigationList({ onSelectItem }: Scene5NavigationListProps) {
  return (
    <nav
      data-scene5="side-nav-list"
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        paddingTop: '2px',
        paddingBottom: '12px',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Scene5NavigationSection dataScene5="side-nav-main-items">
        {SCENE5_MAIN_NAV_ITEMS.map((item) => (
          <Scene5NavigationItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            comingSoon={item.comingSoon}
            dataScene5={item.dataScene5}
            onSelect={() => onSelectItem?.(item.id)}
          />
        ))}
      </Scene5NavigationSection>

      <Scene5NavigationSection withDividerBefore dataScene5="side-nav-bottom-items">
        {SCENE5_BOTTOM_NAV_ITEMS.map((item) => (
          <Scene5NavigationItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            dataScene5={item.dataScene5}
            onSelect={() => onSelectItem?.(item.id)}
          />
        ))}
      </Scene5NavigationSection>
    </nav>
  );
}
