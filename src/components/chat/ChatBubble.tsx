
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from './types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <div 
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div className={`p-3 rounded-lg inline-block max-w-[80%] ${
        message.isUser 
          ? 'bg-snes-blue text-white font-pixelated text-sm' 
          : 'bg-black text-white'
      }`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {message.isUser ? (
          <p className="text-sm">{message.text}</p>
        ) : (
          <div className="markdown-content text-base text-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <table className="w-full border-collapse border border-white/30 my-2 text-sm">
                    {children}
                  </table>
                ),
                thead: ({ children }) => (
                  <thead className="bg-white/10">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-white/30 px-2 py-1 text-left font-semibold">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="border border-white/30 px-2 py-1">{children}</td>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
