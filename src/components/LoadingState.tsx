
import React from 'react';
import Header from '@/components/Header';

interface LoadingStateProps {
  onSignOut: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ onSignOut }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-nerd-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-nerd-navy/60 text-sm font-medium">Loading news...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
