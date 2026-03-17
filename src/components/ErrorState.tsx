
import React from 'react';
import Header from '@/components/Header';

interface ErrorStateProps {
  onSignOut: () => void;
  errorMessage?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onSignOut, errorMessage = 'An error occurred' }) => {
  return (
    <div className="snes-container min-h-screen max-w-6xl">
      <Header />
      <div className="bg-white border border-red-500 p-6 mb-8 text-center">
        <h2 className="font-pixelated text-2xl text-red-500 mb-2">Error loading data</h2>
        <p className="font-retro text-snes-gray">{errorMessage}</p>
      </div>
    </div>
  );
};

export default ErrorState;
