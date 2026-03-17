
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { NewsItem } from '@/data/newsData';

interface UseNewsActionsProps {
  newsItems: NewsItem[];
  setNewsItems: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  refetchNews: () => Promise<any>;
  refetchCompleted: () => Promise<any>;
}

export const useNewsActions = ({
  newsItems,
  setNewsItems,
  refetchNews,
  refetchCompleted
}: UseNewsActionsProps) => {
  
  const handleMarkAsRead = async (id: string) => {
    const itemToMove = newsItems.find(item => item.id === id);
    
    if (itemToMove) {
      try {
        console.log('Moving item to completed:', itemToMove);
        
        // Step 1: Add to completed table
        const { error: insertError } = await supabase
          .from('completed')
          .insert([{
            id: itemToMove.id,
            title: itemToMove.title,
            content: itemToMove.content,
            type: itemToMove.category
            // learning field removed as it no longer exists in database
          }]);
        
        if (insertError) {
          console.error('Error inserting to completed table:', insertError);
          throw insertError;
        }
        
        console.log('Item successfully added to completed table');
        
        // Step 2: Delete from news table using RPC
        console.log(`Attempting to delete news item with ID: ${id} using RPC`);
        
        const { data: deleteResult, error: deleteError } = await supabase.rpc('delete_news_item', {
          item_id: id
        });
        
        if (deleteError) {
          console.error('Error with RPC delete:', deleteError);
          
          // Fallback to regular delete if RPC fails
          console.log('Falling back to regular delete');
          const { error: fallbackError } = await supabase
            .from('news')
            .delete()
            .eq('id', id);
            
          if (fallbackError) {
            console.error('Error with fallback delete:', fallbackError);
            throw fallbackError;
          }
        }
        
        console.log('Delete operation completed, result:', deleteResult);
        
        // Step 3: Update local state to remove the item from the news list
        setNewsItems(prevItems => prevItems.filter(item => item.id !== id));
        
        // Step 4: Refetch both news and completed items to update the views
        await refetchNews();
        await refetchCompleted();
        
        toast({
          title: "Article marked as read",
          description: "The article has been moved to the 'Already read' section.",
          duration: 3000,
        });
      } catch (error: any) {
        console.error('Error marking as read:', error);
        toast({
          title: "Error",
          description: error.message || "Could not mark article as read",
          duration: 3000,
          variant: "destructive"
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting item with ID:', id);
      
      const { error } = await supabase
        .from('completed')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      console.log('Item deleted successfully from Supabase');
      
      // Update local state
      setNewsItems(prevItems => prevItems.filter(item => item.id !== id));
      
      // Refetch completed items
      await refetchCompleted();
      
      toast({
        title: "Article deleted",
        description: "The article has been removed from your list.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: error.message || "Could not delete article",
        duration: 3000,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      console.log('Deleting all completed items');
      
      const { error } = await supabase
        .from('completed')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // This will delete all rows
      
      if (error) {
        console.error('Supabase delete all error:', error);
        throw error;
      }
      
      console.log('All completed items deleted successfully');
      
      // Refetch completed items to update the view
      await refetchCompleted();
      
      toast({
        title: "All articles deleted",
        description: "All read articles have been removed from your list.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error deleting all articles:', error);
      toast({
        title: "Error",
        description: error.message || "Could not delete all articles",
        duration: 3000,
        variant: "destructive"
      });
    }
  };

  return {
    handleMarkAsRead,
    handleDelete,
    handleDeleteAll
  };
};
