
import React from 'react';
import { CheckCheck, Trash2, Clock, ChevronRight } from 'lucide-react';

export interface NewsItemProps {
  id: string;
  title: string;
  content: string;
  category: string;
  isRead: boolean;
  learning?: string;
  date?: string;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

type BadgeConfig = { bg: string; text: string; dot: string };

const getBadgeConfig = (category: string): BadgeConfig => {
  switch (category) {
    case 'YouTube':
      return { bg: '#dc2626', text: '#ffffff', dot: '#fca5a5' };
    case 'AI':
      return { bg: '#4d62a7', text: '#ffffff', dot: '#a5b4fc' };
    case 'SEO':
      return { bg: '#1d252d', text: '#ffffff', dot: '#93c5fd' };
    case 'AI Search':
      return { bg: '#7c3aed', text: '#ffffff', dot: '#c4b5fd' };
    case 'News':
      return { bg: '#1d252d', text: '#ffffff', dot: '#7dd3fc' };
    default:
      return { bg: '#4d62a7', text: '#ffffff', dot: '#a5b4fc' };
  }
};

const NewsItem: React.FC<NewsItemProps> = ({
  id,
  title,
  content,
  category,
  isRead,
  date,
  learning,
  onMarkAsRead,
  onDelete,
  onClick,
}) => {
  const badge = getBadgeConfig(category);
  const formattedDate = formatDate(date);

  return (
    <article
      onClick={onClick}
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: `1px solid ${isRead ? '#e5e7eb' : '#4d62a7'}`,
        borderLeft: `4px solid ${isRead ? '#e5e7eb' : '#4d62a7'}`,
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
        opacity: isRead ? 0.82 : 1,
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = '0 6px 24px rgba(77,98,167,0.18)';
        el.style.transform = 'translateY(-3px)';
        el.style.opacity = '1';
        el.style.borderColor = '#4d62a7';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        el.style.transform = 'translateY(0)';
        el.style.opacity = isRead ? '0.82' : '1';
        el.style.borderColor = isRead ? '#e5e7eb' : '#4d62a7';
      }}
    >
      {/* Top row: Badge + Date + Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Category badge */}
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: badge.bg, color: badge.text,
              fontSize: 11, fontWeight: 600,
              padding: '4px 10px', borderRadius: 99, letterSpacing: '0.02em',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.dot, opacity: 0.85 }} />
            {category}
          </span>

          {/* Date */}
          {formattedDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9ca3af' }}>
              <Clock size={11} strokeWidth={2} />
              {formattedDate}
            </span>
          )}
        </div>

        {/* Action button — stop propagation so it doesn't open modal */}
        <div style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {isRead && onDelete ? (
            <button
              onClick={() => onDelete(id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 600, padding: '4px 10px',
                borderRadius: 8, border: '1px solid rgba(191,65,92,0.25)',
                background: 'rgba(191,65,92,0.05)', color: '#bf415c',
                cursor: 'pointer', transition: 'all 0.15s',
                opacity: 0,
              }}
              className="delete-reveal-btn"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(191,65,92,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(191,65,92,0.05)'; }}
            >
              <Trash2 size={12} />
              Delete
            </button>
          ) : (
            !isRead && (
              <button
                onClick={() => onMarkAsRead(id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600, padding: '4px 10px',
                  borderRadius: 8, border: '1px solid rgba(77,98,167,0.3)',
                  background: 'rgba(77,98,167,0.07)', color: '#4d62a7',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(77,98,167,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(77,98,167,0.07)'; }}
              >
                <CheckCheck size={12} />
                Mark as Read
              </button>
            )
          )}
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.45, marginBottom: 10, color: '#1d252d' }}>
        {title}
      </h3>

      {/* Divider */}
      <div style={{ height: 1, background: '#f3f4f6', marginBottom: 10 }} />

      {/* Content preview */}
      <p
        style={{
          fontSize: 13, lineHeight: 1.65, color: '#6b7280', flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 14,
        }}
      >
        {content}
      </p>

      {/* Read More cue */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        fontSize: 12, fontWeight: 600, color: '#4d62a7',
      }}>
        <ChevronRight size={14} />
        Read full story
      </div>
    </article>
  );
};

export default NewsItem;

