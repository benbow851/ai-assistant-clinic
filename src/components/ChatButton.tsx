
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import ChatDialog from './chat/ChatDialog';
import { useChatMessages } from './chat/useChatMessages';
import nerdLogo from '@/assets/nerdoptimize-logo.png';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, webhook, sendMessage } = useChatMessages();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open chat with NerdOptimize assistant"
        className={cn(
          "fixed bottom-6 right-6 z-50 cursor-pointer",
          "animate-bounce-slight"
        )}
      >
        <img
          src={nerdLogo}
          alt="Chat with NerdOptimize"
          className="w-[90px] h-[90px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-200"
        />
      </button>

      <ChatDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        messages={messages}
        isLoading={isLoading}
        webhook={webhook}
        onSendMessage={sendMessage}
      />
    </>
  );
};

export default ChatButton;
