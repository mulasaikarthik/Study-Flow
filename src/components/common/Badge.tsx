import React from 'react';
import { Priority, TaskStatus } from '../../types/task';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
  size = 'md',
}) => {
  const styles: Record<Priority, { bg: string; border: string; label: string; icon: React.ReactNode }> = {
    urgent: {
      bg: 'bg-rose-50 text-rose-700',
      border: 'border-rose-200',
      label: 'Urgent',
      icon: <Flame className="w-3.5 h-3.5 text-rose-600" />,
    },
    high: {
      bg: 'bg-amber-50 text-amber-800',
      border: 'border-amber-200',
      label: 'High',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
    },
    medium: {
      bg: 'bg-blue-50 text-blue-700',
      border: 'border-blue-200',
      label: 'Medium',
      icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
    },
    low: {
      bg: 'bg-slate-100 text-slate-600',
      border: 'border-slate-200',
      label: 'Low',
      icon: <AlertCircle className="w-3.5 h-3.5 text-slate-500" />,
    },
  };

  const config = styles[priority] || styles.medium;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5 font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.border} ${sizeClasses}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles: Record<TaskStatus, { bg: string; label: string; icon: React.ReactNode }> = {
    completed: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Completed',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    in_progress: {
      bg: 'bg-violet-50 text-violet-700 border-violet-200',
      label: 'In Progress',
      icon: <Clock className="w-3.5 h-3.5 text-violet-600" />,
    },
    pending: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      label: 'Pending',
      icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
    },
  };

  const config = styles[status] || styles.pending;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

interface CategoryChipProps {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, size = 'md' }) => {
  const categoryColors: Record<string, string> = {
    'Computer Science': 'bg-blue-50 text-blue-700 border-blue-200',
    'Mathematics': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Physics': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Biology & Medicine': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Literature': 'bg-amber-50 text-amber-800 border-amber-200',
    'Business & Econ': 'bg-teal-50 text-teal-700 border-teal-200',
    'Research Project': 'bg-purple-50 text-purple-700 border-purple-200',
    'Exam Prep': 'bg-rose-50 text-rose-700 border-rose-200',
    'Assignment': 'bg-violet-50 text-violet-700 border-violet-200',
    'General Study': 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const colorClass = categoryColors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-0.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-md border font-medium ${colorClass} ${sizeClasses}`}>
      {category}
    </span>
  );
};
