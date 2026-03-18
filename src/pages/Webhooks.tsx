
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { WebhooksTable, WebhookForm } from '@/components/WebhooksTable';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

type Webhook = {
  id: string;
  name: string;
  webhook_url: string;
  created_at: string;
};

const Webhooks = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWebhooks(data || []);
    } catch (error: any) {
      console.error('Error fetching webhooks:', error);
      toast({
        title: "Error",
        description: "Failed to load webhooks: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update UI without refetching
      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
      
      toast({
        title: "Webhook deleted",
        description: "The webhook has been successfully removed",
      });
    } catch (error: any) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Error",
        description: "Failed to delete webhook: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
      duration: 3000,
    });
  };

  return (
    <div className="snes-container min-h-screen max-w-6xl">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-pixelated text-snes-primary">Webhook Management</h1>
        <WebhookForm onWebhookAdded={fetchWebhooks} />
        <WebhooksTable 
          webhooks={webhooks} 
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Webhooks;
