import React from 'react';
import { Task } from '../../types/task';
import { PriorityBadge } from '../common/Badge';
import { Flame, CheckCircle, ArrowRight } from 'lucide-react';

interface PriorityMatrixProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onViewTask: (task: Task) => void;
  onAddNew: () => void;
}

export const PriorityMatrix: React.FC<PriorityMatrixProps> = ({
  tasks,
  onToggleTask,
  onViewTask,
  onAddNew,
}) => {
  const urgentTasks = tasks
    .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed')
    .slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">High-Priority Focus</h3>
            <p className="text-[11px] text-slate-400">Urgent and high priority study items</p>
          </div>
        </div>

        <button
          onClick={onAddNew}
          className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 hover:underline"
        >
          <span>+ Add Focus Task</span>
        </button>
      </div>

      {urgentTasks.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          <p className="font-semibold text-slate-700 mb-1">No urgent pressures right now! 🎉</p>
          <p>You have cleared all urgent assignments and exams.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {urgentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start justify-between gap-3 p-3 rounded-xl border border-rose-100/70 bg-rose-50/20 hover:bg-rose-50/40 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                  title="Mark as completed"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <h4
                    onClick={() => onViewTask(task)}
                    className="text-xs font-bold text-slate-800 hover:text-blue-600 cursor-pointer truncate"
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <PriorityBadge priority={task.priority} size="sm" />
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onViewTask(task)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white"
                title="View details"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
