
import React, { useEffect } from 'react';
import { X, Clock, CheckCheck, Trash2, BookOpen, Lightbulb } from 'lucide-react';
import { NewsItemProps } from './NewsItem';

interface NewsDetailModalProps {
  item: Omit<NewsItemProps, 'onMarkAsRead' | 'onDelete'> | null;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

type BadgeConfig = { bg: string; text: string; dot: string };
const getBadgeConfig = (category: string): BadgeConfig => {
  switch (category) {
    case 'YouTube': return { bg: '#dc2626', text: '#ffffff', dot: '#fca5a5' };
    case 'AI':      return { bg: '#4d62a7', text: '#ffffff', dot: '#a5b4fc' };
    case 'SEO':     return { bg: '#1d252d', text: '#ffffff', dot: '#93c5fd' };
    case 'AI Search': return { bg: '#7c3aed', text: '#ffffff', dot: '#c4b5fd' };
    case 'News':    return { bg: '#1d252d', text: '#ffffff', dot: '#7dd3fc' };
    default:        return { bg: '#4d62a7', text: '#ffffff', dot: '#a5b4fc' };
  }
};

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ item, onClose, onMarkAsRead, onDelete }) => {
  // Close on Escape key
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const badge = getBadgeConfig(item.category);
  const formattedDate = formatDate(item.date);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(13, 18, 30, 0.72)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 9998,
          animation: 'modalBackdropIn 0.22s ease',
        }}
      />

      {/* Modal Panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: 'min(720px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 48px)',
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 32px 80px rgba(13,18,30,0.28), 0 4px 16px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header bar */}
        <div
          style={{
            flexShrink: 0,
            background: 'linear-gradient(135deg, #111921 0%, #1e2d50 100%)',
            padding: '20px 24px 18px',
            position: 'relative',
          }}
        >
          {/* Category + Date row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: badge.bg, color: badge.text,
                fontSize: 11, fontWeight: 600,
                padding: '4px 12px', borderRadius: 99,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.dot }} />
              {item.category}
            </span>
            {formattedDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                <Clock size={11} strokeWidth={2} />
                {formattedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 style={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.4,
            margin: 0,
            paddingRight: 36,
          }}>
            {item.title}
          </h2>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)';
              (e.currentTarget as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* Content section */}
          <div style={{ marginBottom: item.learning ? 24 : 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: 'rgba(77,98,167,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <BookOpen size={14} color="#4d62a7" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4d62a7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Full Story
              </span>
            </div>

            <div
              style={{
                fontSize: 14.5,
                lineHeight: 1.78,
                color: '#374151',
                whiteSpace: 'pre-wrap',
              }}
            >
              {item.content}
            </div>
          </div>

          {/* Key Learning section */}
          {item.learning && (
            <div
              style={{
                marginTop: 24,
                background: 'linear-gradient(135deg, rgba(77,98,167,0.06) 0%, rgba(124,58,237,0.04) 100%)',
                border: '1px solid rgba(77,98,167,0.15)',
                borderLeft: '3px solid #4d62a7',
                borderRadius: 12,
                padding: '16px 20px',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
              }}>
                <Lightbulb size={14} color="#f7991a" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f7991a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Key Takeaway
                </span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.68, color: '#374151', margin: 0 }}>
                {item.learning}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          style={{
            flexShrink: 0,
            padding: '14px 28px',
            borderTop: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            background: '#fafafa',
          }}
        >
          {!item.isRead ? (
            <button
              onClick={() => { onMarkAsRead(item.id); onClose(); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, padding: '8px 18px',
                borderRadius: 10, border: 'none',
                background: '#4d62a7', color: '#ffffff',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#3d5297'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#4d62a7'; }}
            >
              <CheckCheck size={15} />
              Mark as Read
            </button>
          ) : (
            onDelete && (
              <button
                onClick={() => { onDelete(item.id); onClose(); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 600, padding: '8px 18px',
                  borderRadius: 10, border: '1px solid rgba(191,65,92,0.3)',
                  background: 'rgba(191,65,92,0.07)', color: '#bf415c',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(191,65,92,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(191,65,92,0.07)'; }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            )
          )}
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, padding: '8px 18px',
              borderRadius: 10, border: '1px solid #e5e7eb',
              background: '#ffffff', color: '#6b7280',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
};

export default NewsDetailModal;
