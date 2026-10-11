import React from 'react';
import { Task } from '../../types/task';
import { PriorityBadge, CategoryChip } from '../common/Badge';
import { getRelativeDays, formatTime } from '../../utils/dateUtils';
import { 
  Check, 
  Clock, 
  Calendar, 
  ListTodo, 
  Edit3, 
  Trash2, 
  Eye
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const isCompleted = task.status === 'completed';
  const { label: dueLabel, isOverdue, isToday } = getRelativeDays(task.dueDate);

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-md ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/40 opacity-80'
          : isOverdue
          ? 'border-rose-200/80 hover:border-rose-300'
          : 'border-slate-200/90 hover:border-blue-200'
      }`}
    >
      <div>
        {/* Top Badges & Quick Action Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryChip category={task.category} size="sm" />
            <PriorityBadge priority={task.priority} size="sm" />
            {task.courseCode && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {task.courseCode}
              </span>
            )}
          </div>

          {/* Action Menu Buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onViewDetails(task)}
              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="View full details"
              aria-label="View task details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              title="Edit task"
              aria-label="Edit task"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Title & Interactive Checkbox */}
        <div className="flex items-start gap-3 mb-2.5">
          <button
            type="button"
            onClick={() => onToggle(task.id)}
            className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                : 'border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/50 text-transparent'
            }`}
            aria-label={isCompleted ? 'Mark task as pending' : 'Mark task as complete'}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          <div className="flex-1 min-w-0">
            <h4
              onClick={() => onViewDetails(task)}
              className={`text-sm font-bold leading-snug cursor-pointer transition-colors ${
                isCompleted
                  ? 'line-through text-slate-400'
                  : 'text-slate-800 hover:text-blue-600'
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Subtask progress bar (if task has subtasks) */}
        {totalSubtasks > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <ListTodo className="w-3 h-3 text-blue-500" />
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </span>
              <span className="font-semibold">{Math.round(subtaskProgress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  subtaskProgress === 100
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-blue-500 to-violet-500'
                }`}
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags Chips */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Due Date & Est Duration info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Due Date Indicator */}
        <div
          className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-md ${
            isCompleted
              ? 'text-slate-400 bg-slate-100'
              : isOverdue
              ? 'text-rose-700 bg-rose-50 font-semibold'
              : isToday
              ? 'text-amber-700 bg-amber-50 font-semibold'
              : 'text-slate-600 bg-slate-50'
          }`}
        >
          <Calendar className="w-3 h-3" />
          <span>{dueLabel}</span>
          {task.dueTime && (
            <span className="opacity-75 text-[11px]">({formatTime(task.dueTime)})</span>
          )}
        </div>

        {/* Est Duration */}
        {task.estimatedMinutes ? (
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Clock className="w-3 h-3" />
            {task.estimatedMinutes >= 60
              ? `${(task.estimatedMinutes / 60).toFixed(1).replace('.0', '')}h`
              : `${task.estimatedMinutes}m`}
          </span>
        ) : null}
      </div>
    </div>
  );
};
