import React from 'react';
import Header from '@/components/Header';

interface ErrorStateProps {
  onSignOut?: () => void;
  errorMessage?: string;
}

const ErrorState = ({ onSignOut, errorMessage }: ErrorStateProps) => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <p className="text-destructive text-lg font-semibold">เกิดข้อผิดพลาด</p>
        {errorMessage && <p className="text-muted-foreground text-sm max-w-md">{errorMessage}</p>}
      </div>
    </div>
  </div>
);

export default ErrorState;
