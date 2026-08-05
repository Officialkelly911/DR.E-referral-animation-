/**
 * Scene5NavigationSection.tsx
 *
 * Groups a set of Scene5NavigationItem rows, optionally preceded by the
 * divider that separates the main menu from Support/Settings.
 */

import type { ReactNode } from 'react';

export interface Scene5NavigationSectionProps {
  children: ReactNode;
  withDividerBefore?: boolean;
  dataScene5?: string;
}

export function Scene5NavigationSection({
  children,
  withDividerBefore,
  dataScene5,
}: Scene5NavigationSectionProps) {
  return (
    <div data-scene5={dataScene5}>
      {withDividerBefore && (
        <div
          data-scene5="side-nav-divider"
          style={{
            height: '1px',
            background: '#EFEFEF',
            margin: '6px 24px 10px',
          }}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}
