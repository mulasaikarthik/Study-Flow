import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Task, TaskFilterOptions, TaskStatus, ViewMode } from '../types/task';
import { taskService } from '../services/taskService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { getRelativeDays, isDateInThisWeek } from '../utils/dateUtils';

interface TaskStats {
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  dueTodayCount: number;
  overdueCount: number;
  completionRate: number;
}

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilterOptions;
  viewMode: ViewMode;
  stats: TaskStats;
  allCategories: string[];
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterOptions>>;
  updateFilter: <K extends keyof TaskFilterOptions>(key: K, value: TaskFilterOptions[K]) => void;
  resetFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  editTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTask: (id: string) => Promise<boolean>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<boolean>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<boolean>;
}

const defaultFilters: TaskFilterOptions = {
  searchQuery: '',
  category: 'all',
  priority: 'all',
  status: 'all',
  dateRange: 'all',
  sortBy: 'dueDateAsc',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterOptions>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { showToast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load study tasks.';
      setError(errorMsg);
      setTasks([]);
      showToast({
        type: 'error',
        title: 'Could not load tasks',
        message: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const refreshTasks = useCallback(async () => {
    const data = await taskService.getTasks();
    setTasks(data);
    setError(null);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      setTasks([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    fetchTasks();
  }, [authLoading, isAuthenticated, user, fetchTasks]);

  const updateFilter = useCallback(<K extends keyof TaskFilterOptions>(key: K, value: TaskFilterOptions[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2563EB', '#7C3AED', '#38BDF8', '#A855F7', '#10B981'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newTask = await taskService.createTask(taskData);
      await refreshTasks();
      showToast({
        type: 'success',
        title: 'Task Created',
        message: `"${newTask.title}" added to your study schedule.`,
      });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create task.';
      showToast({ type: 'error', title: 'Error Creating Task', message: msg });
      return false;
    }
  };

  const editTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<boolean> => {
    try {
      await taskService.updateTask(id, updates);
      await refreshTasks();
      showToast({
        type: 'success',
        title: 'Task Updated',
        message: 'Task details have been saved.',
      });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not update task.';
      showToast({ type: 'error', title: 'Error Updating Task', message: msg });
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    const taskToDelete = tasks.find((t) => t.id === id);
    try {
      await taskService.deleteTask(id);
      await refreshTasks();
      showToast({
        type: 'info',
        title: 'Task Deleted',
        message: taskToDelete ? `"${taskToDelete.title}" removed.` : 'Task removed.',
      });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not delete task.';
      showToast({ type: 'error', title: 'Error Deleting Task', message: msg });
      return false;
    }
  };

  const toggleTask = async (id: string): Promise<boolean> => {
    try {
      const updated = await taskService.toggleTaskStatus(id);
      await refreshTasks();

      if (updated.status === 'completed') {
        triggerConfetti();
        showToast({
          type: 'success',
          title: 'Great Job! 🎉',
          message: `Completed "${updated.title}"!`,
        });
      } else {
        showToast({
          type: 'info',
          title: 'Task Reopened',
          message: `Marked "${updated.title}" as pending.`,
        });
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not update task status.';
      showToast({ type: 'error', title: 'Action Failed', message: msg });
      return false;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus): Promise<boolean> => {
    try {
      const updated = await taskService.updateTask(id, { status });
      await refreshTasks();

      if (status === 'completed') {
        triggerConfetti();
        showToast({
          type: 'success',
          title: 'Task Completed! 🏆',
          message: `Nice work on completing "${updated.title}"!`,
        });
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not update status.';
      showToast({ type: 'error', title: 'Status Error', message: msg });
      return false;
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string): Promise<boolean> => {
    try {
      await taskService.toggleSubtask(taskId, subtaskId);
      await refreshTasks();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not update subtask.';
      showToast({ type: 'error', title: 'Subtask Error', message: msg });
      return false;
    }
  };

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    tasks.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [tasks]);

  const stats = useMemo<TaskStats>(() => {
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.status === 'completed').length;
    const pendingCount = tasks.filter((t) => t.status === 'pending').length;
    const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;

    let dueTodayCount = 0;
    let overdueCount = 0;

    tasks.forEach((t) => {
      if (t.status !== 'completed') {
        const { isToday, isOverdue } = getRelativeDays(t.dueDate);
        if (isToday) dueTodayCount++;
        if (isOverdue) overdueCount++;
      }
    });

    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      totalCount,
      pendingCount,
      inProgressCount,
      completedCount,
      dueTodayCount,
      overdueCount,
      completionRate,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description.toLowerCase().includes(q);
          const matchCategory = task.category.toLowerCase().includes(q);
          const matchCourse = task.courseCode?.toLowerCase().includes(q);
          const matchTags = task.tags?.some((tag) => tag.toLowerCase().includes(q));

          if (!matchTitle && !matchDesc && !matchCategory && !matchCourse && !matchTags) {
            return false;
          }
        }

        if (filters.category !== 'all' && task.category !== filters.category) {
          return false;
        }

        if (filters.priority !== 'all' && task.priority !== filters.priority) {
          return false;
        }

        if (filters.status !== 'all') {
          if (filters.status === 'overdue') {
            const rel = getRelativeDays(task.dueDate);
            if (!rel.isOverdue || task.status === 'completed') return false;
          } else if (filters.status === 'today') {
            const rel = getRelativeDays(task.dueDate);
            if (!rel.isToday) return false;
          } else if (task.status !== filters.status) {
            return false;
          }
        }

        if (filters.dateRange !== 'all') {
          const rel = getRelativeDays(task.dueDate);
          if (filters.dateRange === 'today' && !rel.isToday) return false;
          if (filters.dateRange === 'overdue' && (!rel.isOverdue || task.status === 'completed')) return false;
          if (filters.dateRange === 'this_week' && !isDateInThisWeek(task.dueDate)) return false;
          if (filters.dateRange === 'upcoming' && (rel.isOverdue || rel.isToday)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priorityWeights: Record<string, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };

        switch (filters.sortBy) {
          case 'dueDateAsc':
            return (a.dueDate || '').localeCompare(b.dueDate || '');
          case 'dueDateDesc':
            return (b.dueDate || '').localeCompare(a.dueDate || '');
          case 'priorityDesc':
            return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
          case 'titleAsc':
            return a.title.localeCompare(b.title);
          case 'createdDesc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [tasks, filters]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        isLoading,
        error,
        filters,
        viewMode,
        stats,
        allCategories,
        setFilters,
        updateFilter,
        resetFilters,
        setViewMode,
        fetchTasks,
        addTask,
        editTask,
        deleteTask,
        toggleTask,
        updateTaskStatus,
        toggleSubtask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
