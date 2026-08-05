/**
 * Scene5ForumTabs.tsx
 *
 * "Post" / "Overview" tab switcher sitting on the white body below the
 * dark header block, matching the reference's underline-on-active style.
 */

export type Scene5ForumTab = 'post' | 'overview';

export interface Scene5ForumTabsProps {
  active: Scene5ForumTab;
  onChange: (tab: Scene5ForumTab) => void;
}

export function Scene5ForumTabs({ active, onChange }: Scene5ForumTabsProps) {
  return (
    <div data-scene5="forum-tabs" style={{ display: 'flex', background: '#ffffff', borderBottom: '1px solid #ececec' }}>
      {(
        [
          { key: 'post' as const, label: 'Post' },
          { key: 'overview' as const, label: 'Overview' },
        ]
      ).map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            data-scene5={`forum-tab-${tab.key}`}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '14px 0 12px',
              fontSize: '15px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#111111' : '#9a9a94',
              borderBottom: isActive ? '2px solid #111111' : '2px solid transparent',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
