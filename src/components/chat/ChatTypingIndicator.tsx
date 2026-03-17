
import React from 'react';

const ChatTypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="p-3 rounded-lg inline-block bg-snes-light-purple text-white">
        <div className="flex space-x-2">
          <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatTypingIndicator;
