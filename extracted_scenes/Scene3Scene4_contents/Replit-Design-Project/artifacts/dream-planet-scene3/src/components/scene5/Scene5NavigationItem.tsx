/**
 * Scene5NavigationItem.tsx
 *
 * A single row in the Scene 5 Side Navigation drawer: icon + label,
 * with an optional "Coming Soon" badge. Styling-only pressed state
 * (no ripple/bounce/glow) so it stays animation-ready for later phases.
 */

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface Scene5NavigationItemProps {
  icon: LucideIcon;
  label: string;
  comingSoon?: boolean;
  dataScene5: string;
  onSelect?: () => void;
}

export function Scene5NavigationItem({
  icon: Icon,
  label,
  comingSoon,
  dataScene5,
  onSelect,
}: Scene5NavigationItemProps) {
  return (
    <motion.button
      type="button"
      data-scene5={dataScene5}
      onClick={comingSoon ? undefined : onSelect}
      disabled={comingSoon || undefined}
      aria-disabled={comingSoon || undefined}
      tabIndex={comingSoon ? -1 : undefined}
      whileTap={comingSoon ? undefined : { backgroundColor: 'rgba(0,0,0,0.035)' }}
      transition={{ duration: 0.12 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        padding: '13px 24px',
        background: 'transparent',
        border: 'none',
        textAlign: 'left',
        cursor: comingSoon ? 'default' : 'pointer',
        pointerEvents: comingSoon ? 'none' : 'auto',
        WebkitTapHighlightColor: 'transparent',
        font: 'inherit',
      }}
    >
      <Icon size={21} strokeWidth={1.75} color="#4b5563" style={{ flexShrink: 0 }} />
      <span
        style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#18181b',
          flex: 1,
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
      {comingSoon && (
        <span
          data-scene5={`${dataScene5}-badge`}
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#9ca3af',
            background: '#f2f2f3',
            padding: '4px 10px',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Coming Soon
        </span>
      )}
    </motion.button>
  );
}
