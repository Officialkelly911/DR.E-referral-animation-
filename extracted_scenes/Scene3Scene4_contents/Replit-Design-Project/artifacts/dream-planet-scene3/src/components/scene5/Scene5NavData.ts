/**
 * Scene5NavData.ts
 *
 * Navigation item data for the Scene 5 Side Navigation drawer.
 * Order and labels match the latest verified reference screenshot
 * (attached_assets Side-navigation.PNG) and screen recording.
 *
 * Icon choices: the reference uses clean outline icons. Original icon
 * assets were not supplied, so this maps each item to the closest
 * lucide-react outline icon (already a project dependency) at a
 * consistent stroke width/size — see Phase 2 fidelity notes.
 */

import {
  Store,
  ShoppingCart,
  Package,
  CircleDollarSign,
  Crown,
  PlayCircle,
  Video,
  Bookmark,
  Globe,
  Users,
  LifeBuoy,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface Scene5NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  dataScene5: string;
}

/** Main navigation items — order verified against the latest reference. */
export const SCENE5_MAIN_NAV_ITEMS: Scene5NavItem[] = [
  { id: 'store-analytics', label: 'Store Analytics', icon: Store, dataScene5: 'nav-store-analytics' },
  { id: 'sales', label: 'Sales', icon: ShoppingCart, dataScene5: 'nav-sales' },
  { id: 'purchases', label: 'My purchases', icon: Package, dataScene5: 'nav-purchases' },
  { id: 'raba-bag', label: 'Raba Bag', icon: CircleDollarSign, dataScene5: 'nav-raba-bag' },
  { id: 'subscriptions', label: 'Subscriptions', icon: Crown, dataScene5: 'nav-subscriptions' },
  { id: 'digital-library', label: 'Digital Library', icon: PlayCircle, dataScene5: 'nav-digital-library' },
  { id: 'masterclass', label: 'Masterclass', icon: Video, comingSoon: true, dataScene5: 'nav-masterclass' },
  { id: 'favorite', label: 'Favorite', icon: Bookmark, dataScene5: 'nav-favorite' },
  { id: 'distribution-hub', label: 'Distribution Hub', icon: Globe, comingSoon: true, dataScene5: 'nav-distribution-hub' },
  { id: 'referral', label: 'Referral', icon: Users, dataScene5: 'nav-referral' },
];

/**
 * Bottom-section items (below the divider). Not fully visible in the
 * supplied screenshot (cropped at the divider) — labels come from the
 * written spec; icons are a reasonable outline match, not a confirmed
 * visual reference. Flagged in the Phase 2 fidelity report.
 */
export const SCENE5_BOTTOM_NAV_ITEMS: Scene5NavItem[] = [
  { id: 'support', label: 'Support', icon: LifeBuoy, dataScene5: 'nav-support' },
  { id: 'settings', label: 'Settings', icon: Settings, dataScene5: 'nav-settings' },
];
