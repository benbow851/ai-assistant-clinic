
import React, { useState } from 'react';
import NewsItem, { NewsItemProps } from './NewsItem';
import NewsDetailModal from './NewsDetailModal';
import { Trash2, Newspaper, Zap } from 'lucide-react';

interface NewsSectionProps {
  title: string;
  newsItems: Omit<NewsItemProps, 'onMarkAsRead' | 'onDelete'>[];
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
  onDeleteAll?: () => void;
  showDeleteAll?: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({
  title,
  newsItems,
  onMarkAsRead,
  onDelete,
  onDeleteAll,
  showDeleteAll = false
}) => {
  const [selectedItem, setSelectedItem] = useState<Omit<NewsItemProps, 'onMarkAsRead' | 'onDelete'> | null>(null);

  return (
    <>
      <section style={{ marginBottom: 48 }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(77,98,167,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Zap size={16} color="#4d62a7" />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1d252d', margin: 0 }}>{title}</h2>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginTop: 2 }}>
                {newsItems.length} {newsItems.length === 1 ? 'article' : 'articles'} · click any card to read full story
              </p>
            </div>
          </div>

          {showDeleteAll && onDeleteAll && newsItems.length > 0 && (
            <button
              onClick={onDeleteAll}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 600, padding: '6px 12px',
                borderRadius: 8, border: '1px solid rgba(191,65,92,0.25)',
                background: 'rgba(191,65,92,0.05)', color: '#bf415c',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={13} />
              Clear All
            </button>
          )}
        </div>

        {newsItems.length === 0 ? (
          <div
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '56px 24px', textAlign: 'center',
              border: '1px dashed #d1d5db', borderRadius: 16,
              background: '#fafafa',
            }}
          >
            <div
              style={{
                width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}
            >
              <Newspaper size={22} color="#9ca3af" />
            </div>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>No articles here</p>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>Check back later for more SEO & AI updates.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
              gap: 20,
            }}
          >
            {newsItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 55}ms`, animationFillMode: 'both' }}
              >
                <NewsItem
                  {...item}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  onClick={() => setSelectedItem(item)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <NewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onMarkAsRead={onMarkAsRead}
        onDelete={onDelete}
      />
    </>
  );
};

export default NewsSection;

