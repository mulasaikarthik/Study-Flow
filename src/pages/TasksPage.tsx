import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskRow } from '../components/tasks/TaskRow';
import { TaskKanban } from '../components/tasks/TaskKanban';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Task } from '../types/task';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

interface TasksPageProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (task: Task) => void;
  onViewTaskDetails: (task: Task) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
  onViewTaskDetails,
}) => {
  const {
    filteredTasks,
    isLoading,
    error,
    filters,
    viewMode,
    stats,
    allCategories,
    updateFilter,
    resetFilters,
    setViewMode,
    fetchTasks,
    toggleTask,
    updateTaskStatus,
    deleteTask,
  } = useTasks();

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Study Planner & Tasks
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {stats.pendingCount + stats.inProgressCount} active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize homework, lecture milestones, readings, and exams
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={onOpenCreateModal}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <TaskFilterBar
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categories={allCategories}
        stats={stats}
      />

      {/* Content Area */}
      {isLoading ? (
        <LoadingSpinner message="Filtering and organizing study tasks..." />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={fetchTasks}
          isLoading={isLoading}
        />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title={isFiltered ? 'No matching study tasks' : 'No study tasks added yet'}
          description={
            isFiltered
              ? 'Try adjusting your search keywords, priority, or category filters.'
              : 'Create your first assignment to start tracking homework, labs, and exams.'
          }
          icon={isFiltered ? 'search' : 'empty'}
          actionLabel="Add Study Task"
          onAction={onOpenCreateModal}
          secondaryActionLabel={isFiltered ? 'Reset Filters' : undefined}
          onSecondaryAction={isFiltered ? resetFilters : undefined}
        />
      ) : viewMode === 'kanban' ? (
        <TaskKanban
          tasks={filteredTasks}
          onUpdateStatus={updateTaskStatus}
          onEdit={onOpenEditModal}
          onDelete={(id) => setTaskToDelete(id)}
          onViewDetails={onViewTaskDetails}
        />
      ) : viewMode === 'list' ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={onOpenEditModal}
              onDelete={(id) => setTaskToDelete(id)}
              onViewDetails={onViewTaskDetails}
            />
          ))}
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={onOpenEditModal}
              onDelete={(id) => setTaskToDelete(id)}
              onViewDetails={onViewTaskDetails}
            />
          ))}
        </div>
      )}

      {/* Confirm Task Deletion Modal */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete Study Task"
        message="Are you sure you want to delete this study task? This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
