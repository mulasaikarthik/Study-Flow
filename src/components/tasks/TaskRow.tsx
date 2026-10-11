import React from 'react';
import { Task } from '../../types/task';
import { PriorityBadge, CategoryChip } from '../common/Badge';
import { getRelativeDays, formatTime } from '../../utils/dateUtils';
import { Check, Calendar, Edit3, Trash2, Eye } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const isCompleted = task.status === 'completed';
  const { label: dueLabel, isOverdue, isToday } = getRelativeDays(task.dueDate);

  return (
    <div
      className={`group bg-white rounded-xl border p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 transition-all ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/50 opacity-75'
          : isOverdue
          ? 'border-rose-200 hover:border-rose-300'
          : 'border-slate-200/80 hover:border-blue-200 hover:bg-slate-50/30'
      }`}
    >
      {/* Left: Checkbox + Title + Category */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/50 text-transparent'
          }`}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              onClick={() => onViewDetails(task)}
              className={`text-sm font-semibold truncate cursor-pointer transition-colors ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-800 hover:text-blue-600'
              }`}
            >
              {task.title}
            </h4>
            {task.courseCode && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {task.courseCode}
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-xs text-slate-400 truncate max-w-md hidden sm:block">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Middle: Badges */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <CategoryChip category={task.category} size="sm" />
        <PriorityBadge priority={task.priority} size="sm" />
      </div>

      {/* Due Date */}
      <div className="shrink-0 text-right">
        <div
          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md ${
            isCompleted
              ? 'text-slate-400'
              : isOverdue
              ? 'text-rose-700 bg-rose-50 font-bold'
              : isToday
              ? 'text-amber-700 bg-amber-50 font-bold'
              : 'text-slate-600'
          }`}
        >
          <Calendar className="w-3 h-3" />
          <span>{dueLabel}</span>
          {task.dueTime && <span className="opacity-70 text-[10px]">({formatTime(task.dueTime)})</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onViewDetails(task)}
          className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          title="Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50"
          title="Edit"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
