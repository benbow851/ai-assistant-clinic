
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/data/newsData';

export const useCompleted = () => {
  return useQuery({
    queryKey: ['completed'],
    queryFn: async () => {
      console.log('Fetching completed items...');
      const { data, error } = await supabase
        .from('completed')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching completed items:', error);
        throw new Error(error.message);
      }
      
      console.log('Completed items fetched:', data);
      
      const completedItems: NewsItem[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.type || 'general',
        isRead: true,
        date: item.created_at,
      }));
      
      return completedItems;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};
