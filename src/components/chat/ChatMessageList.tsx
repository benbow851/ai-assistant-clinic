
import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatTypingIndicator from './ChatTypingIndicator';
import { Message } from './types';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="text-center text-snes-dark-gray pt-8">
          <p className="font-pixelated text-base">Send a message to start chatting!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))
      )}
      {isLoading && <ChatTypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
