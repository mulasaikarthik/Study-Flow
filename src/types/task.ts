export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Category =
  | 'Computer Science'
  | 'Mathematics'
  | 'Physics'
  | 'Literature'
  | 'Biology & Medicine'
  | 'Business & Econ'
  | 'Research Project'
  | 'Exam Prep'
  | 'Assignment'
  | 'General Study';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // ISO format or YYYY-MM-DD
  dueTime?: string; // HH:mm format
  estimatedMinutes?: number;
  courseCode?: string; // e.g. "CS-301", "MATH-210"
  subtasks: Subtask[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export type TaskFilterStatus = 'all' | 'pending' | 'in_progress' | 'completed' | 'overdue' | 'today';

export interface TaskFilterOptions {
  searchQuery: string;
  category: string;
  priority: string;
  status: TaskFilterStatus;
  dateRange: 'all' | 'today' | 'this_week' | 'overdue' | 'upcoming';
  sortBy: 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc' | 'titleAsc' | 'createdDesc';
}

export type ViewMode = 'grid' | 'list' | 'kanban';
