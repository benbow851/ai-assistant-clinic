
import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyChatOptions: React.FC = () => {
  return (
    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white">
      <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
      <h3 className="text-gray-600 font-pixelated mb-2">No Chat Options Yet</h3>
      <p className="text-gray-500 font-pixelated">
        Create quick chat options that will appear above the chat input.
      </p>
    </div>
  );
};

export default EmptyChatOptions;
