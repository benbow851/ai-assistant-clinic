
import React from 'react';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import ChatOptionItem from '@/components/chat-editor/ChatOptionItem';
import EmptyChatOptions from '@/components/chat-editor/EmptyChatOptions';
import AddOptionButton from '@/components/chat-editor/AddOptionButton';
import { useChatEditor } from '@/hooks/use-chat-editor';
import { Toaster } from "@/components/ui/toaster";

const ChatEditor = () => {
  const {
    chatOptions,
    isLoading,
    error,
    handleAddOption,
    handleDelete,
    handleSave,
    handleEdit,
    handleChange,
    saveMutation,
    deleteMutation
  } = useChatEditor();
  
  if (isLoading) return <LoadingState onSignOut={() => {}} />;
  if (error) return <ErrorState onSignOut={() => {}} errorMessage={error.message} />;
  
  return (
    <div className="snes-container min-h-screen max-w-6xl">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-pixelated text-snes-primary">Chat Options Management</h1>
        
        <div className="space-y-6">
          <p className="text-gray-600 mb-6 font-pixelated">
            Create up to 4 quick chat options that will appear above the chat input.
          </p>
          
          <div className="flex justify-end mb-4">
            <AddOptionButton 
              onAdd={handleAddOption}
              optionsCount={chatOptions.length}
              isPending={saveMutation.isPending || deleteMutation.isPending}
            />
          </div>

          {chatOptions.length === 0 ? (
            <EmptyChatOptions />
          ) : (
            chatOptions.map(option => (
              <ChatOptionItem 
                key={option.id || `new-${option.created_at}`}
                option={option}
                onDelete={handleDelete}
                onSave={handleSave}
                onEdit={handleEdit}
                onChange={handleChange}
                isSaving={saveMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))
          )}
        </div>
        
        {chatOptions.length > 0 && chatOptions.length < 4 && (
          <div className="mt-4">
            <AddOptionButton
              onAdd={handleAddOption}
              optionsCount={chatOptions.length}
              isFullWidth={true}
              isPending={saveMutation.isPending || deleteMutation.isPending}
            />
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default ChatEditor;
