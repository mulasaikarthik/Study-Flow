import React from 'react';
import { Button } from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isLoading?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load your study tasks. Please check your network and try again.',
  onRetry,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-50/50 rounded-2xl border border-rose-100 max-w-lg mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-4 text-rose-600">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-600 mb-5 max-w-sm">{message}</p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-600" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
