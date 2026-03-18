
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Message, Webhook } from './types';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [newsContext, setNewsContext] = useState<string>('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch webhook
        const { data: webhookData, error: webhookError } = await (supabase as any)
          .from('webhooks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!webhookError && webhookData && webhookData.length > 0) {
          setWebhook(webhookData[0] as Webhook);
        }

        // Fetch news for context
        const { data: newsData, error: newsError } = await (supabase as any)
          .from('news')
          .select('title, content, type, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!newsError && newsData && newsData.length > 0) {
          const summary = (newsData as any[]).map((n: any, i: number) => 
            `[${i + 1}] ${n.title} (${n.type}, ${new Date(n.created_at).toLocaleDateString('th-TH')})\n${n.content}`
          ).join('\n\n---\n\n');
          setNewsContext(summary);
        }
      } catch (error: any) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const sendMessage = async (message: string) => {
    if (!webhook) {
      toast({
        title: "No webhook configured",
        description: "Please add a webhook in the Webhooks page first.",
        variant: "destructive",
      });
      return;
    }

    const userMessageId = Date.now().toString();
    const userMessage = {
      text: message,
      isUser: true,
      id: userMessageId
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text
      }));

      // Send the message with news context to the webhook
      const response = await fetch(webhook.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          userId: 'anonymous',
          timestamp: new Date().toISOString(),
          newsContext: newsContext,
          conversationHistory: conversationHistory,
          systemPrompt: `คุณคือผู้ช่วย AI ของ NerdOptimize ที่เชี่ยวชาญด้าน SEO, AI และ AI Search ตอบเป็นภาษาไทยเสมอเมื่อผู้ใช้ถามเป็นภาษาไทย ใช้ข้อมูลข่าวด้านล่างเพื่อตอบคำถามเกี่ยวกับเนื้อหาในระบบ:\n\n${newsContext}`
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log("Webhook response:", responseData);
      } catch (e) {
        console.error("Error parsing webhook response as JSON:", e);
        // If the response isn't JSON, use text
        const textResponse = await response.text();
        console.log("Raw webhook response:", textResponse);
        responseData = { output: textResponse || "Response format not recognized" };
      }

      // Check different response formats
      const aiResponse = responseData.output || responseData.message || 
                        (typeof responseData === 'string' ? responseData : 
                        "I received your message, but I'm not sure how to respond.");
      
      setMessages(prev => [...prev, {
        text: aiResponse,
        isUser: false,
        id: Date.now().toString()
      }]);
    } catch (error) {
      console.error('Error sending message to webhook:', error);
      
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error connecting to the assistant. Please try again later.",
        isUser: false,
        id: Date.now().toString()
      }]);
      
      toast({
        title: "Error",
        description: "Failed to send message to webhook. Please check your webhook configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    webhook,
    sendMessage
  };
};
