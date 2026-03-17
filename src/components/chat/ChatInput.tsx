
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Webhook } from './types';
import { Info, Search, Wrench, Zap } from 'lucide-react';
import { useChatOptions } from '@/hooks/use-chat-options';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  webhook: Webhook | null;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, webhook }) => {
  const [message, setMessage] = useState('');
  const { data: chatOptions, isLoading: optionsLoading } = useChatOptions();

  const handleSend = () => {
    if (message.trim() === '') return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePresetQuery = (query: string) => {
    onSendMessage(query);
  };

  // Map of icons by query text (partial match)
  const getIconForOption = (chatText: string) => {
    if (chatText.toLowerCase().includes('model')) return <Search className="w-3 h-3" />;
    if (chatText.toLowerCase().includes('tool')) return <Wrench className="w-3 h-3" />;
    if (chatText.toLowerCase().includes('help')) return <Info className="w-3 h-3" />;
    if (chatText.toLowerCase().includes('tip')) return <Zap className="w-3 h-3" />;
    return null; // Default: no icon
  };

  return (
    <div className="p-4 border-t border-snes-light-gray bg-white">
      <div className="flex flex-wrap gap-2 mb-3">
        {optionsLoading ? (
          <div className="text-xs text-gray-400">Loading options...</div>
        ) : (
          chatOptions?.map((option) => (
            <Button 
              key={option.id}
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 font-pixelated text-xs border-snes-light-gray"
              onClick={() => handlePresetQuery(option.chat_query)}
              disabled={isLoading || !webhook}
            >
              {getIconForOption(option.chat_text)}
              {option.chat_text}
            </Button>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input 
          type="text" 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          onKeyDown={handleKeyPress} 
          placeholder="Type your message here..." 
          className="flex-1 p-2 rounded border border-snes-light-gray font-pixelated text-base focus:outline-none focus:border-snes-blue"
          disabled={isLoading} 
        />
        <Button 
          onClick={handleSend} 
          className="bg-snes-blue hover:bg-snes-primary text-white font-pixelated text-xs px-4 py-2"
          disabled={isLoading || !webhook}
        >
          {isLoading ? "..." : "SEND"}
        </Button>
      </div>
      {!webhook && (
        <p className="text-red-500 text-xs mt-2 font-pixelated">No webhook configured. Please add one in the Webhooks page.</p>
      )}
    </div>
  );
};

export default ChatInput;
