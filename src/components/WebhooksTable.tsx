
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Webhook = {
  id: string;
  name: string;
  webhook_url: string;
  created_at: string;
};

export const WebhooksTable = ({ 
  webhooks, 
  onDelete,
  isLoading
}: { 
  webhooks: Webhook[]; 
  onDelete: (id: string) => void;
  isLoading: boolean;
}) => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <Table>
        <TableCaption>List of configured webhooks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="animate-pulse flex justify-center">
                  Loading webhooks...
                </div>
              </TableCell>
            </TableRow>
          ) : webhooks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No webhooks configured yet.
              </TableCell>
            </TableRow>
          ) : (
            webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium">{webhook.name}</TableCell>
                <TableCell className="font-mono text-xs break-all">
                  {webhook.webhook_url}
                </TableCell>
                <TableCell>
                  {new Date(webhook.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(webhook.id)}
                    aria-label={`Delete webhook ${webhook.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export const WebhookForm = ({ 
  onWebhookAdded 
}: { 
  onWebhookAdded: () => void 
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (err) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('webhooks')
        .insert({ name, webhook_url: url });

      if (error) throw error;

      toast({
        title: "Webhook added",
        description: "Your webhook has been successfully added",
      });
      
      // Reset form
      setName('');
      setUrl('');
      
      // Refresh the webhooks list
      onWebhookAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add webhook",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white mb-6">
      <h3 className="text-lg font-medium">Add New Webhook</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            placeholder="e.g., Slack Notification"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            Webhook URL
          </label>
          <Input
            id="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Adding..." : "Add Webhook"}
      </Button>
    </form>
  );
};
