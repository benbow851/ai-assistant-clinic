
import React from 'react';
import NewsSection from '@/components/NewsSection';
import { NewsItem } from '@/data/newsData';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface NewsContentProps {
  unreadNews: NewsItem[];
  completedItems: NewsItem[] | undefined;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

const NewsContent: React.FC<NewsContentProps> = ({
  unreadNews,
  completedItems,
  onMarkAsRead,
  onDelete,
  onDeleteAll
}) => {
  const allCaughtUp = unreadNews.length === 0 && completedItems && completedItems.length > 0;

  return (
    <>
      {allCaughtUp ? (
        <div className="flex flex-col items-center py-16 text-center rounded-2xl border border-dashed border-border bg-card mb-10 animate-fade-in">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'hsl(var(--nerd-blue) / 0.1)' }}>
            <CheckCircle2 size={28} style={{ color: 'hsl(var(--nerd-blue))' }} />
          </div>
          <h2 className="font-bold text-xl text-foreground mb-2">You're all caught up!</h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Great job! Check back later for more SEO & AI intelligence updates.
          </p>
        </div>
      ) : (
        <NewsSection
          title="Latest Updates"
          newsItems={unreadNews}
          onMarkAsRead={onMarkAsRead}
        />
      )}

      {completedItems && completedItems.length > 0 && (
        <div className="mt-2">
          <NewsSection
            title="Already Read"
            newsItems={completedItems}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
            showDeleteAll={true}
          />
        </div>
      )}
    </>
  );
};

export default NewsContent;
