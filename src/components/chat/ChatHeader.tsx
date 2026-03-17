
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import nerdLogo from '@/assets/nerdoptimize-logo.png';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="bg-nerd-navy p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src={nerdLogo}
          alt="NerdOptimize"
          className="h-6 w-auto"
        />
        <div>
          <h2 className="font-bold text-white text-sm leading-tight">NerdOptimize Assistant</h2>
          <p className="text-nerd-cloud/60 text-xs">SEO · AI · AI Search</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="text-nerd-cloud hover:bg-white/10 rounded-md h-8 w-8">
        <X size={16} />
      </Button>
    </div>
  );
};

export default ChatHeader;
