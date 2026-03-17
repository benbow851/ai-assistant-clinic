
import { useState, useEffect } from 'react';
import type { ChatOption } from '@/hooks/use-chat-options';

export interface ChatOptionWithEditing extends ChatOption {
  isEditing: boolean;
}

export const useChatOptionState = (options: ChatOption[] | undefined) => {
  const [chatOptions, setChatOptions] = useState<ChatOptionWithEditing[]>([]);
  
  // Initialize local state when data is loaded
  useEffect(() => {
    if (options) {
      setChatOptions(options.map(option => ({
        ...option,
        isEditing: false
      })));
    }
  }, [options]);
  
  // Add a new chat option draft
  const handleAddOption = () => {
    setChatOptions([
      ...chatOptions, 
      { 
        id: '', 
        chat_text: 'New Option', 
        chat_query: 'What would you like to know?',
        isEditing: true,
        created_at: new Date().toISOString()
      }
    ]);
  };
  
  // Toggle editing mode for a chat option
  const handleEdit = (id: string) => {
    setChatOptions(chatOptions.map(option => 
      option.id === id ? { ...option, isEditing: true } : option
    ));
  };
  
  // Update local state for a chat option
  const handleChange = (id: string, field: 'chat_text' | 'chat_query', value: string) => {
    setChatOptions(chatOptions.map(option => 
      option.id === id ? { ...option, [field]: value } : option
    ));
  };
  
  // Exit editing mode
  const exitEditingMode = (id: string) => {
    setChatOptions(chatOptions.map(o => 
      o.id === id ? { ...o, isEditing: false } : o
    ));
  };
  
  // Remove option from local state (for unsaved options)
  const removeFromLocalState = (id: string) => {
    setChatOptions(chatOptions.filter(option => option.id !== id));
  };
  
  return {
    chatOptions,
    setChatOptions,
    handleAddOption,
    handleEdit,
    handleChange,
    exitEditingMode,
    removeFromLocalState
  };
};
