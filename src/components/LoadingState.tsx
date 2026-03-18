import React from 'react';
import Header from '@/components/Header';

interface LoadingStateProps {
  onSignOut?: () => void;
}

const LoadingState = ({ onSignOut }: LoadingStateProps) => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">กำลังโหลด...</p>
      </div>
    </div>
  </div>
);

export default LoadingState;
