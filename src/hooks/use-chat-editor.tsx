
import { useQuery } from '@tanstack/react-query';
import { fetchChatOptions } from '@/utils/chat-option-service';
import { useChatOptionState, type ChatOptionWithEditing } from '@/hooks/use-chat-option-state';
import { useChatOptionMutations } from '@/hooks/use-chat-option-mutations';
import type { ChatOption } from '@/hooks/use-chat-options';

export const useChatEditor = () => {
  // Fetch chat options
  const { data, isLoading, error } = useQuery({
    queryKey: ['chat-options'],
    queryFn: fetchChatOptions,
  });
  
  // Local state management
  const {
    chatOptions,
    handleAddOption,
    handleEdit,
    handleChange,
    exitEditingMode,
    removeFromLocalState
  } = useChatOptionState(data);
  
  // Mutations
  const { saveMutation, deleteMutation } = useChatOptionMutations();
  
  // Handle delete for both saved and unsaved options
  const handleDelete = (id: string) => {
    if (id) {
      deleteMutation.mutate(id);
    } else {
      // For new unsaved options, just remove from local state
      removeFromLocalState(id);
    }
  };
  
  // Handle save
  const handleSave = (option: ChatOptionWithEditing) => {
    saveMutation.mutate({
      id: option.id,
      chat_text: option.chat_text,
      chat_query: option.chat_query,
      created_at: option.created_at
    });
    
    // Update local state to exit editing mode
    exitEditingMode(option.id);
  };

  return {
    chatOptions,
    isLoading,
    error,
    handleAddOption,
    handleDelete,
    handleSave,
    handleEdit,
    handleChange,
    saveMutation,
    deleteMutation
  };
};
