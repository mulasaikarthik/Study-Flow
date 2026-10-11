import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types/task';
import { getRelativeDays, formatDate, formatTime } from '../utils/dateUtils';
import { PriorityBadge, CategoryChip } from '../components/common/Badge';
import { Calendar, AlertCircle, Clock, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';

interface CalendarViewPageProps {
  onViewTask: (task: Task) => void;
  onOpenCreateModal: () => void;
}

export const CalendarViewPage: React.FC<CalendarViewPageProps> = ({
  onViewTask,
  onOpenCreateModal,
}) => {
  const { tasks, toggleTask } = useTasks();

  // Group pending tasks
  const overdueTasks: Task[] = [];
  const todayTasks: Task[] = [];
  const tomorrowTasks: Task[] = [];
  const upcomingTasks: Task[] = [];
  const completedTasks: Task[] = [];

  tasks.forEach((t: Task) => {
    if (t.status === 'completed') {
      completedTasks.push(t);
    } else {
      const rel = getRelativeDays(t.dueDate);
      if (rel.isOverdue) overdueTasks.push(t);
      else if (rel.isToday) todayTasks.push(t);
      else if (rel.isTomorrow) tomorrowTasks.push(t);
      else upcomingTasks.push(t);
    }
  });

  const sections = [
    {
      title: 'Overdue Deadlines',
      tasks: overdueTasks,
      icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      color: 'border-rose-200 bg-rose-50/20 text-rose-700',
      badge: `${overdueTasks.length} overdue`,
      showIfEmpty: false,
    },
    {
      title: 'Due Today',
      tasks: todayTasks,
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/20 text-amber-700',
      badge: `${todayTasks.length} tasks`,
      showIfEmpty: true,
    },
    {
      title: 'Due Tomorrow',
      tasks: tomorrowTasks,
      icon: <Calendar className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-200 bg-blue-50/20 text-blue-700',
      badge: `${tomorrowTasks.length} tasks`,
      showIfEmpty: true,
    },
    {
      title: 'Upcoming This Week & Later',
      tasks: upcomingTasks,
      icon: <Calendar className="w-4 h-4 text-violet-600" />,
      color: 'border-violet-200 bg-violet-50/20 text-violet-700',
      badge: `${upcomingTasks.length} tasks`,
      showIfEmpty: true,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Schedule & Deadlines
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chronological view of all course milestones, problem sets, and exams
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Deadline
        </Button>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => {
          if (!section.showIfEmpty && section.tasks.length === 0) return null;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100">{section.icon}</div>
                  <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${section.color}`}>
                  {section.badge}
                </span>
              </div>

              {section.tasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 italic">
                  No assignments scheduled for this period.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-slate-200/70 hover:border-blue-200 hover:bg-blue-50/10 transition-all group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                          title="Complete task"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <CategoryChip category={task.category} size="sm" />
                            <PriorityBadge priority={task.priority} size="sm" />
                          </div>
                          <h4
                            onClick={() => onViewTask(task)}
                            className="text-xs font-bold text-slate-800 hover:text-blue-600 cursor-pointer truncate"
                          >
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatDate(task.dueDate)} {task.dueTime ? `at ${formatTime(task.dueTime)}` : ''}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onViewTask(task)}
                        className="p-1.5 text-slate-400 group-hover:text-blue-600"
                        title="View details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
