
import { supabase } from '@/integrations/supabase/client';
import type { ChatOption } from '@/hooks/use-chat-options';

export const fetchChatOptions = async () => {
  const { data, error } = await (supabase as any)
    .from('chat_options')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching chat options:', error);
    throw new Error(error.message);
  }
  
  return data as ChatOption[];
};

export const saveChatOption = async (option: ChatOption) => {
  if (option.id) {
    const { error } = await (supabase as any)
      .from('chat_options')
      .update({
        chat_text: option.chat_text,
        chat_query: option.chat_query
      })
      .eq('id', option.id);
    
    if (error) throw new Error(error.message);
  } else {
    const { error } = await (supabase as any)
      .from('chat_options')
      .insert([{
        chat_text: option.chat_text,
        chat_query: option.chat_query
      }]);
    
    if (error) throw new Error(error.message);
  }
};

export const deleteChatOption = async (id: string) => {
  const { error } = await (supabase as any)
    .from('chat_options')
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(error.message);
};
