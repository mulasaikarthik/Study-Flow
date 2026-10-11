import React from 'react';
import { Button } from './Button';
import { BookOpenCheck, PlusCircle, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'empty' | 'search';
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  description = 'You have no study tasks matching this criteria. Create a new task or adjust your filters.',
  icon = 'empty',
  actionLabel = 'Add New Task',
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-xs max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-50 to-violet-50 border border-blue-100/60 flex items-center justify-center mb-5 text-blue-600 shadow-xs">
        {icon === 'search' ? (
          <SearchX className="w-8 h-8 text-blue-500" />
        ) : (
          <BookOpenCheck className="w-8 h-8 text-violet-600" />
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm leading-relaxed">{description}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
