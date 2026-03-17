
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { NewsItem } from '@/data/newsData';
import { useNews } from '@/hooks/use-news';
import { useCompleted } from '@/hooks/use-completed';
import { useNewsActions } from '@/hooks/use-news-actions';
import { isConnected } from '@/lib/supabase-credentials';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import NewsContent from '@/components/NewsContent';
import brandAmbassador from '@/assets/brand-ambassador.png';
import { Zap, TrendingUp, Brain, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StatPill = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
    <Icon size={15} className="text-[hsl(var(--nerd-orange))] flex-shrink-0" />
    <div>
      <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide leading-none mb-0.5">{label}</p>
      <p className="text-white text-sm font-bold leading-none">{value}</p>
    </div>
  </div>
);

const HeroSection = ({ unreadCount }: { unreadCount: number }) => (
  <div
    className="relative overflow-hidden rounded-3xl mb-10"
    style={{ background: 'linear-gradient(135deg, #111921 0%, #1e2d50 55%, #151d28 100%)' }}
  >
    {/* Mesh grid overlay */}
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.04,
        backgroundImage: `repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 40px),
                          repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)`
      }}
    />

    {/* Glow blobs */}
    <div className="absolute top-[-40px] right-[28%] w-72 h-72 rounded-full blur-3xl pointer-events-none"
      style={{ background: 'rgba(77,98,167,0.18)' }} />
    <div className="absolute bottom-[-30px] left-[-20px] w-56 h-56 rounded-full blur-3xl pointer-events-none"
      style={{ background: 'rgba(191,65,92,0.12)' }} />

    <div className="relative z-10 flex items-end justify-between gap-6 px-8 pt-10" style={{ minHeight: 280 }}>
      {/* Left content */}
      <div className="flex-1 max-w-xl pb-10">
        {/* Live badge */}
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderColor: 'rgba(255,255,255,0.14)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#f7991a' }} />
          Live Intelligence Feed
        </div>

        <h1
          className="font-black text-3xl md:text-4xl leading-tight mb-4 animate-fade-in"
          style={{ color: '#ffffff', animationDelay: '80ms' }}
        >
          Your SEO, AI &<br />
          <span style={{ color: '#6b82c4' }}>AI Search Hub</span>
        </h1>

        <p
          className="text-sm leading-relaxed mb-7 max-w-md animate-fade-in"
          style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '160ms' }}
        >
          Curated intelligence for NerdOptimize members — stay ahead with daily SEO strategy, AI breakthroughs, and search trend updates.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <StatPill icon={Zap} label="Unread" value={unreadCount > 0 ? `${unreadCount} new` : 'All caught up'} />
          <StatPill icon={TrendingUp} label="Topics" value="SEO · AI · Search" />
          <StatPill icon={Brain} label="By" value="NerdOptimize" />
        </div>
      </div>

      {/* Brand ambassador */}
      <div
        className="hidden md:block flex-shrink-0 self-end animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <img
          src={brandAmbassador}
          alt="NerdOptimize Brand Ambassador"
          className="w-auto object-contain select-none"
          style={{ height: 240, filter: 'drop-shadow(0 -6px 28px rgba(77,98,167,0.35))' }}
        />
      </div>
    </div>
  </div>
);

const CredentialsPrompt = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="snes-container">
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="p-4 rounded-2xl bg-primary/10 mb-6">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">ยังไม่ได้เชื่อมต่อ Supabase</h2>
          <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
            กรุณากรอก Credentials เพื่อเชื่อมต่อกับ Supabase ก่อนเริ่มใช้งาน ข้อมูลข่าวสารและฟีเจอร์ต่างๆ จะพร้อมใช้งานหลังจากเชื่อมต่อสำเร็จ
          </p>
          <Button onClick={() => navigate('/credentials')} size="lg" className="gap-2">
            <Shield size={18} />
            ไปหน้า Credentials
          </Button>
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  const connected = isConnected();
  const { data: supabaseNews, isLoading: newsLoading, error: newsError, refetch: refetchNews } = useNews();
  const { data: completedItems, isLoading: completedLoading, error: completedError, refetch: refetchCompleted } = useCompleted();
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    const savedNews = localStorage.getItem('newwy-news');
    return savedNews ? JSON.parse(savedNews) : [];
  });

  useEffect(() => {
    if (supabaseNews) {
      setNewsItems(prevItems => {
        const existingItemsMap = new Map(prevItems.map(item => [item.id, item]));
        return supabaseNews.map(item => ({
          ...item,
          isRead: existingItemsMap.has(item.id)
            ? existingItemsMap.get(item.id)!.isRead
            : false
        }));
      });
    }
  }, [supabaseNews]);

  useEffect(() => {
    localStorage.setItem('newwy-news', JSON.stringify(newsItems));
  }, [newsItems]);

  const { handleMarkAsRead, handleDelete, handleDeleteAll } = useNewsActions({
    newsItems,
    setNewsItems,
    refetchNews,
    refetchCompleted
  });

  const unreadNews = newsItems.filter(item => !item.isRead);

  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
      duration: 3000,
    });
  };

  if (!connected) {
    return <CredentialsPrompt />;
  }

  if (newsLoading || completedLoading) {
    return <LoadingState onSignOut={handleSignOut} />;
  }

  if (newsError || completedError) {
    const error = newsError || completedError;
    return <ErrorState onSignOut={handleSignOut} errorMessage={error?.message} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="snes-container">
        <HeroSection unreadCount={unreadNews.length} />
        <NewsContent
          unreadNews={unreadNews}
          completedItems={completedItems}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
        />
      </main>
    </div>
  );
};

export default Index;
