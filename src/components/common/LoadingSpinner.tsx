import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading your study workspace...',
  subMessage = 'Syncing tasks, courses, and deadlines',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-8">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 animate-spin flex items-center justify-center p-1 shadow-lg shadow-blue-500/20">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full animate-ping opacity-75" />
      </div>

      <h4 className="text-base font-semibold text-slate-800 mb-1">{message}</h4>
      <p className="text-xs text-slate-500 max-w-sm">{subMessage}</p>
    </div>
  );
};
