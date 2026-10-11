import React from 'react';
import { Task } from '../../types/task';
import { PriorityBadge, CategoryChip } from '../common/Badge';
import { getRelativeDays, formatTime } from '../../utils/dateUtils';
import { Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

interface UpcomingDeadlinesProps {
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onViewAllTasks: () => void;
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  tasks,
  onViewTask,
  onViewAllTasks,
}) => {
  const pendingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Upcoming Deadlines</h3>
        </div>

        <button
          onClick={onViewAllTasks}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {pendingTasks.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
          <p className="font-semibold text-slate-600">All caught up!</p>
          <p>No upcoming task deadlines scheduled.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {pendingTasks.map((task) => {
            const { label: dueLabel, isOverdue, isToday } = getRelativeDays(task.dueDate);

            return (
              <div
                key={task.id}
                onClick={() => onViewTask(task)}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <CategoryChip category={task.category} size="sm" />
                    <PriorityBadge priority={task.priority} size="sm" />
                    {task.courseCode && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold">
                        {task.courseCode}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                    {task.title}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isOverdue
                        ? 'text-rose-700 bg-rose-50'
                        : isToday
                        ? 'text-amber-700 bg-amber-50'
                        : 'text-slate-600 bg-slate-100'
                    }`}
                  >
                    {dueLabel}
                  </span>
                  {task.dueTime && (
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {formatTime(task.dueTime)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
