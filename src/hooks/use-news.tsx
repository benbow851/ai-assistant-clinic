
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/data/newsData';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      console.log('Fetching news...');
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching news:', error);
        throw new Error(error.message);
      }
      
      console.log('News fetched:', data);
      
      const newsItems: NewsItem[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.type || 'general',
        isRead: false,
        date: item.created_at,
      }));
      
      return newsItems;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};
