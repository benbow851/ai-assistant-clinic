
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import type { ChatOption } from '@/hooks/use-chat-options';

interface ChatOptionItemProps {
  option: ChatOption & { isEditing: boolean };
  onDelete: (id: string) => void;
  onSave: (option: ChatOption & { isEditing: boolean }) => void;
  onEdit: (id: string) => void;
  onChange: (id: string, field: 'chat_text' | 'chat_query', value: string) => void;
  isSaving: boolean;
  isDeleting: boolean;
}

const ChatOptionItem: React.FC<ChatOptionItemProps> = ({
  option,
  onDelete,
  onSave,
  onEdit,
  onChange,
  isSaving,
  isDeleting
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="font-pixelated text-lg text-snes-blue">
          {option.isEditing ? (
            <Input
              value={option.chat_text}
              onChange={(e) => onChange(option.id, 'chat_text', e.target.value)}
              placeholder="Button text"
              className="font-pixelated"
              maxLength={20}
            />
          ) : (
            <span>{option.chat_text}</span>
          )}
        </div>
        <div className="flex space-x-2">
          {option.isEditing ? (
            <Button 
              onClick={() => onSave(option)} 
              variant="outline" 
              size="sm"
              disabled={isSaving}
            >
              <Save className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => onEdit(option.id)} 
              variant="outline" 
              size="sm"
            >
              Edit
            </Button>
          )}
          <Button 
            onClick={() => onDelete(option.id)} 
            variant="outline" 
            size="sm"
            disabled={isDeleting}
            className="text-red-500 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {option.isEditing ? (
        <Textarea
          value={option.chat_query}
          onChange={(e) => onChange(option.id, 'chat_query', e.target.value)}
          placeholder="Message to send when clicked"
          className="font-pixelated"
          rows={3}
        />
      ) : (
        <p className="text-gray-600 text-sm font-pixelated">
          <strong>Query:</strong> {option.chat_query}
        </p>
      )}
    </div>
  );
};

export default ChatOptionItem;
