/**
 * Scene5ForumOverview.tsx
 *
 * The Overview tab's body: created date, guidelines with an "Update"
 * link, a member row with avatars + "See all", the invite link box
 * with a "Share Link" button, and the destructive "DELETE FORUM"
 * action — matching the Overview reference screenshot.
 */

import { Calendar, Link as LinkIcon } from 'lucide-react';
import { FORUM, FORUM_MEMBERS } from './Scene5ForumData';

export function Scene5ForumOverview() {
  return (
    <div data-scene5="forum-overview" style={{ background: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 20px', color: '#9a9a94', fontSize: '13.5px' }}>
        <Calendar size={15} strokeWidth={2} />
        Created {FORUM.createdDate}
      </div>
      <div style={{ height: '1px', background: '#ececec' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#111111' }}>Guidelines</span>
        <button type="button" style={{ background: 'none', border: 'none', color: '#FF6B00', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
          Update
        </button>
      </div>
      <div style={{ padding: '0 20px 16px', fontSize: '13.5px', color: '#6b6b66', lineHeight: 1.45, marginTop: '-10px' }}>
        {FORUM.guidelines}
      </div>
      <div style={{ height: '1px', background: '#ececec' }} />

      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#111111' }}>Member</span>
          <button type="button" style={{ background: 'none', border: 'none', color: '#FF6B00', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
            See all
          </button>
        </div>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
          {FORUM_MEMBERS.map((member) => (
            <div key={member.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: '#d9d9d5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: '11.5px', color: '#4a4a46', maxWidth: '58px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: '1px', background: '#ececec' }} />

      <div style={{ padding: '18px 20px 8px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111111', marginBottom: '12px' }}>Invite to forum</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f5f5f3',
            borderRadius: '10px',
            padding: '13px 14px',
            marginBottom: '14px',
          }}
        >
          <LinkIcon size={15} color="#6b6b66" />
          <span style={{ fontSize: '13.5px', color: '#4a4a46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {FORUM.inviteLink}
          </span>
        </div>
        <button
          type="button"
          data-scene5="forum-share-link"
          style={{
            width: '100%',
            background: '#111111',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '15px 0',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Share Link
        </button>
      </div>

      <div style={{ padding: '18px 20px 32px' }}>
        <button
          type="button"
          data-scene5="forum-delete"
          style={{
            background: 'none',
            border: 'none',
            color: '#e3402b',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          DELETE FORUM
        </button>
      </div>
    </div>
  );
}
