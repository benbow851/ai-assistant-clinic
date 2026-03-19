
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { Message, Webhook } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  messages: Message[];
  isLoading: boolean;
  webhook: Webhook | null;
  onSendMessage: (message: string) => void;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  messages, 
  isLoading, 
  webhook, 
  onSendMessage 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        hideCloseButton 
        className={`p-0 bg-snes-background border-2 border-snes-secondary rounded-lg overflow-hidden ${
          isMobile ? 'w-[100vw] max-w-[100vw] h-[100vh] max-h-[100vh]' : 'sm:max-w-[600px]'
        }`}
      >
        <DialogTitle className="sr-only">Chat with Newwy Helper</DialogTitle>
        <div className={`flex flex-col ${isMobile ? 'h-full' : 'h-[700px]'}`}>
          <ChatHeader onClose={() => setIsOpen(false)} />
          <ChatMessageList messages={messages} isLoading={isLoading} />
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} webhook={webhook} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
