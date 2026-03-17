
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { saveChatOption, deleteChatOption } from '@/utils/chat-option-service';
import type { ChatOption } from '@/hooks/use-chat-options';

export const useChatOptionMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mutation to save a chat option
  const saveMutation = useMutation({
    mutationFn: saveChatOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-options'] });
      toast({
        title: "Saved",
        description: "Chat option has been saved successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Mutation to delete a chat option
  const deleteMutation = useMutation({
    mutationFn: deleteChatOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-options'] });
      toast({
        title: "Deleted",
        description: "Chat option has been removed."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    saveMutation,
    deleteMutation
  };
};
