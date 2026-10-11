import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import { PriorityBadge, CategoryChip } from '../common/Badge';
import { getRelativeDays } from '../../utils/dateUtils';
import { CheckCircle2, Clock, CircleDot, ChevronRight, ChevronLeft, Trash2, Edit3 } from 'lucide-react';

interface TaskKanbanProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  onUpdateStatus,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const columns: Array<{
    id: TaskStatus;
    title: string;
    icon: React.ReactNode;
    color: string;
    bgHeader: string;
    badgeBg: string;
  }> = [
    {
      id: 'pending',
      title: 'To Do',
      icon: <CircleDot className="w-4 h-4 text-slate-500" />,
      color: 'border-slate-200',
      bgHeader: 'bg-slate-100/70 text-slate-700',
      badgeBg: 'bg-slate-200 text-slate-700',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <Clock className="w-4 h-4 text-violet-600" />,
      color: 'border-violet-200',
      bgHeader: 'bg-violet-50 text-violet-800',
      badgeBg: 'bg-violet-200 text-violet-800',
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-200',
      bgHeader: 'bg-emerald-50 text-emerald-800',
      badgeBg: 'bg-emerald-200 text-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col bg-slate-50/60 rounded-2xl border border-slate-200/80 p-3 min-h-[420px]"
          >
            {/* Column Header */}
            <div
              className={`flex items-center justify-between p-2.5 rounded-xl mb-3 font-semibold text-xs tracking-wide uppercase ${col.bgHeader}`}
            >
              <div className="flex items-center gap-2">
                {col.icon}
                <span>{col.title}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                {colTasks.length}
              </span>
            </div>

            {/* Task Cards in Column */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[620px] pr-0.5">
              {colTasks.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No tasks in {col.title}
                </div>
              ) : (
                colTasks.map((task) => {
                  const { label: dueLabel, isOverdue, isToday } = getRelativeDays(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                    >
                      {/* Chips */}
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <CategoryChip category={task.category} size="sm" />
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => onViewDetails(task)}
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-2"
                      >
                        {task.title}
                      </h4>

                      {/* Due info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span
                          className={`px-1.5 py-0.2 rounded font-medium ${
                            isOverdue
                              ? 'text-rose-700 bg-rose-50 font-bold'
                              : isToday
                              ? 'text-amber-700 bg-amber-50 font-bold'
                              : 'text-slate-600'
                          }`}
                        >
                          {dueLabel}
                        </span>

                        {/* Stage transition controls */}
                        <div className="flex items-center gap-1">
                          {col.id !== 'pending' && (
                            <button
                              onClick={() => {
                                const nextStatus = col.id === 'completed' ? 'in_progress' : 'pending';
                                onUpdateStatus(task.id, nextStatus);
                              }}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                              title="Move back"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {col.id !== 'completed' && (
                            <button
                              onClick={() => {
                                const nextStatus = col.id === 'pending' ? 'in_progress' : 'completed';
                                onUpdateStatus(task.id, nextStatus);
                              }}
                              className="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold"
                              title="Move forward"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onEdit(task)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-violet-600"
                            title="Edit"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDelete(task.id)}
                            className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
