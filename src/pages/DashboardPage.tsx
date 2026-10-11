import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { PriorityMatrix } from '../components/dashboard/PriorityMatrix';
import { PomodoroWidget } from '../components/dashboard/PomodoroWidget';
import { StudyStreakCard } from '../components/dashboard/StudyStreakCard';
import { QuickNotesWidget } from '../components/dashboard/QuickNotesWidget';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { Task } from '../types/task';
import { PlusCircle, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../components/common/Button';

interface DashboardPageProps {
  onNavigateToTasks: () => void;
  onNavigateToTab: (tab: string) => void;
  onOpenCreateTask: () => void;
  onViewTaskDetails: (task: Task) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToTasks,
  onNavigateToTab,
  onOpenCreateTask,
  onViewTaskDetails,
}) => {
  const { tasks, stats, isLoading, error, fetchTasks, toggleTask, updateFilter } = useTasks();
  const { user } = useAuth();

  const handleFilterClick = (statusFilter: string) => {
    if (statusFilter === 'all') {
      updateFilter('status', 'all');
    } else if (statusFilter === 'pending') {
      updateFilter('status', 'pending');
    } else if (statusFilter === 'completed') {
      updateFilter('status', 'completed');
    } else if (statusFilter === 'today') {
      updateFilter('status', 'today');
    }
    onNavigateToTasks();
  };

  if (isLoading && tasks.length === 0) {
    return <LoadingSpinner message="Loading your student productivity dashboard..." />;
  }

  if (error && tasks.length === 0) {
    return <ErrorState message={error} onRetry={fetchTasks} isLoading={isLoading} />;
  }

  const studentFirstName = user?.fullName?.split(' ')[0] || 'Student';

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg overflow-hidden">
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none transform translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{user?.university || 'Academic Session 2025'} • {user?.major || 'Undergraduate'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {studentFirstName}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              You have <strong className="text-white font-bold">{stats.pendingCount} pending study tasks</strong> and{' '}
              <strong className="text-white font-bold">{stats.dueTodayCount} due today</strong>. Let&apos;s stay focused and make great progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={onOpenCreateTask}
              leftIcon={<PlusCircle className="w-4 h-4 text-blue-600" />}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-sm"
            >
              Add New Task
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onNavigateToTasks}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Planner
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Overview */}
      <StatsOverview
        stats={stats}
        streakDays={user?.currentStreakDays || 6}
        onFilterClick={handleFilterClick}
      />

      {/* Main Grid: Left Deadlines & Focus / Right Timer & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Focus Assignments */}
          <PriorityMatrix
            tasks={tasks}
            onToggleTask={toggleTask}
            onViewTask={onViewTaskDetails}
            onAddNew={onOpenCreateTask}
          />

          {/* Upcoming Deadlines Timeline */}
          <UpcomingDeadlines
            tasks={tasks}
            onViewTask={onViewTaskDetails}
            onViewAllTasks={onNavigateToTasks}
          />

          {/* Courses & Category Quick Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Study Subjects & Courses</h3>
              </div>
              <button
                onClick={() => onNavigateToTab('calendar')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Schedule View
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Computer Science', code: 'CS-244B', count: tasks.filter((t: Task) => t.category === 'Computer Science').length, color: 'border-blue-200 bg-blue-50/50' },
                { name: 'Mathematics', code: 'MATH-104', count: tasks.filter((t: Task) => t.category === 'Mathematics').length, color: 'border-indigo-200 bg-indigo-50/50' },
                { name: 'Biology & Medicine', code: 'BIO-201', count: tasks.filter((t: Task) => t.category === 'Biology & Medicine').length, color: 'border-emerald-200 bg-emerald-50/50' },
                { name: 'Research Project', code: 'RES-499', count: tasks.filter((t: Task) => t.category === 'Research Project').length, color: 'border-purple-200 bg-purple-50/50' },
              ].map((sub, i) => (
                <div
                  key={i}
                  onClick={() => {
                    updateFilter('category', sub.name);
                    onNavigateToTasks();
                  }}
                  className={`p-3 rounded-xl border ${sub.color} hover:scale-[1.02] transition-transform cursor-pointer`}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-500 block">{sub.code}</span>
                  <h4 className="text-xs font-bold text-slate-800 truncate">{sub.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{sub.count} tasks</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Pomodoro Focus Timer */}
          <PomodoroWidget />

          {/* Daily Streak & Goals Card */}
          <StudyStreakCard
            currentStreakDays={user?.currentStreakDays || 6}
            dailyGoalMinutes={user?.dailyStudyGoalMinutes || 180}
            completedTasksToday={stats.completedCount}
          />

          {/* Scratchpad */}
          <QuickNotesWidget />
        </div>
      </div>
    </div>
  );
};
