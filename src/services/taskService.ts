import { supabase } from '../lib/supabase';
import { Category, Priority, Subtask, Task, TaskStatus } from '../types/task';

type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  status: string | null;
  due_date: string | null;
  due_time: string | null;
  estimated_minutes: number | null;
  course_code: string | null;
  tags: string[] | null;
  subtasks: Subtask[] | null;
  created_at: string;
  updated_at: string;
};

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];
const STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];
const CATEGORIES: Category[] = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Literature',
  'Biology & Medicine',
  'Business & Econ',
  'Research Project',
  'Exam Prep',
  'Assignment',
  'General Study',
];

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message || '').trim();
    if (message) {
      if (/schema cache/i.test(message) || /could not find the '.+' column/i.test(message)) {
        return `${message} Run supabase/migrations/20260326_align_tasks_schema.sql in the Supabase SQL Editor, then retry.`;
      }
      return message;
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function asPriority(value: string | null): Priority {
  return PRIORITIES.includes(value as Priority) ? (value as Priority) : 'medium';
}

function asStatus(value: string | null): TaskStatus {
  return STATUSES.includes(value as TaskStatus) ? (value as TaskStatus) : 'pending';
}

function asCategory(value: string | null): Category {
  return CATEGORIES.includes(value as Category) ? (value as Category) : 'General Study';
}

function mapRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    category: asCategory(row.category),
    priority: asPriority(row.priority),
    status: asStatus(row.status),
    dueDate: row.due_date ?? '',
    dueTime: row.due_time ?? undefined,
    estimatedMinutes: row.estimated_minutes ?? undefined,
    courseCode: row.course_code ?? '',
    subtasks: Array.isArray(row.subtasks) ? row.subtasks : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
  };
}

function toRowPayload(taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> & { userId?: string }) {
  const payload: Record<string, unknown> = {};

  if (taskData.userId !== undefined) payload.user_id = taskData.userId;
  if (taskData.title !== undefined) payload.title = taskData.title;
  if (taskData.description !== undefined) payload.description = taskData.description;
  if (taskData.category !== undefined) payload.category = taskData.category;
  if (taskData.priority !== undefined) payload.priority = taskData.priority;
  if (taskData.status !== undefined) payload.status = taskData.status;
  if (taskData.dueDate !== undefined) payload.due_date = taskData.dueDate;
  if (taskData.dueTime !== undefined) payload.due_time = taskData.dueTime || null;
  if (taskData.estimatedMinutes !== undefined) payload.estimated_minutes = Number.isFinite(taskData.estimatedMinutes) ? taskData.estimatedMinutes : null;
  if (taskData.courseCode !== undefined) payload.course_code = taskData.courseCode?.trim() ? taskData.courseCode.trim() : null;
  if (taskData.tags !== undefined) payload.tags = Array.isArray(taskData.tags) ? taskData.tags : [];
  if (taskData.subtasks !== undefined) payload.subtasks = Array.isArray(taskData.subtasks) ? taskData.subtasks : [];

  payload.updated_at = new Date().toISOString();
  return payload;
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(getErrorMessage(error, 'Could not verify your session.'));
  }
  if (!data.user) {
    throw new Error('You must be signed in to manage tasks.');
  }
  return data.user.id;
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error(getErrorMessage(error, 'Failed to load tasks from the database.'));
    }

    return (data as TaskRow[] | null)?.map(mapRowToTask) ?? [];
  },

  async getTaskById(id: string): Promise<Task | null> {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(getErrorMessage(error, 'Failed to load that task.'));
    }
    if (!data) return null;
    return mapRowToTask(data as TaskRow);
  },

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from('tasks')
      .insert(
        toRowPayload({
          ...taskData,
          userId,
        })
      )
      .select('*')
      .single();

    if (error) {
      throw new Error(getErrorMessage(error, 'Failed to create task.'));
    }
    if (!data) {
      throw new Error('Task was not created.');
    }

    return mapRowToTask(data as TaskRow);
  },

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from('tasks')
      .update(toRowPayload(updates))
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw new Error(getErrorMessage(error, 'Failed to update task.'));
    }
    if (!data) {
      throw new Error('Task was not updated. You may not have permission to change it.');
    }

    return mapRowToTask(data as TaskRow);
  },

  async toggleTaskStatus(id: string): Promise<Task> {
    const userId = await requireUserId();

    const { data: current, error: currentError } = await supabase
      .from('tasks')
      .select('status')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (currentError) {
      throw new Error(getErrorMessage(currentError, 'Failed to load task status.'));
    }
    if (!current) {
      throw new Error('Task not found.');
    }

    const newStatus: TaskStatus = current.status === 'completed' ? 'pending' : 'completed';
    return this.updateTask(id, { status: newStatus });
  },

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new Error('Task not found.');
    }

    const updatedSubtasks: Subtask[] = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    return this.updateTask(taskId, { subtasks: updatedSubtasks });
  },

  async deleteTask(id: string): Promise<void> {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();

    if (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete task.'));
    }
    if (!data) {
      throw new Error('Task was not deleted. You may not have permission to remove it.');
    }
  },
};
