
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChatOption {
  id: string;
  chat_text: string;
  chat_query: string;
  created_at: string;
}

export const useChatOptions = () => {
  return useQuery({
    queryKey: ['chat-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_options')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching chat options:', error);
        throw new Error(error.message);
      }
      
      return data as ChatOption[];
    },
  });
};
