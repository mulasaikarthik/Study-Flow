import React, { useState, useEffect } from 'react';
import { Task, Priority, Category, Subtask, TaskStatus } from '../../types/task';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PriorityBadge } from '../common/Badge';
import { getTodayString } from '../../utils/dateUtils';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Tag, 
  BookOpen, 
  ListTodo, 
  CheckSquare
} from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  initialTask?: Task | null;
  mode: 'create' | 'edit';
}

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

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  mode,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Computer Science');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('23:59');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(60);
  const [courseCode, setCourseCode] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask && mode === 'edit') {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setDueDate(initialTask.dueDate || getTodayString());
      setDueTime(initialTask.dueTime || '23:59');
      setEstimatedMinutes(initialTask.estimatedMinutes || 60);
      setCourseCode(initialTask.courseCode || '');
      setTags(initialTask.tags || []);
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Computer Science');
      setPriority('medium');
      setStatus('pending');
      setDueDate(getTodayString());
      setDueTime('23:59');
      setEstimatedMinutes(60);
      setCourseCode('');
      setTags([]);
      setSubtasks([]);
    }
    setErrors({});
  }, [initialTask, mode, isOpen]);

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSubtask: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.';
    }

    if (estimatedMinutes < 0 || isNaN(estimatedMinutes)) {
      newErrors.estimatedMinutes = 'Estimated minutes must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status,
        dueDate,
        dueTime,
        estimatedMinutes: Number(estimatedMinutes),
        courseCode: courseCode.trim().toUpperCase(),
        tags,
        subtasks,
      });

      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {mode === 'create' ? 'Create New Study Task' : 'Edit Study Task'}
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              {mode === 'create' ? 'Add homework, project milestones, or exam prep.' : 'Update task details and checklist.'}
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4.5 max-h-[75vh] overflow-y-auto px-1 py-1">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white'
            }`}
            placeholder="e.g. Algorithms Problem Set 3 or Read Biology Ch. 5"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            required
            autoFocus
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
        </div>

        {/* Category & Course Code Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="task-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject / Category
            </label>
            <select
              id="task-category"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-course" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Code <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="task-course"
              type="text"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white uppercase font-mono"
              placeholder="e.g. CS-106B or MATH-51"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              maxLength={12}
            />
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Priority Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIORITIES.map((p) => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex items-center justify-center p-2 rounded-xl border transition-all text-xs font-semibold capitalize ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50/50 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <PriorityBadge priority={p} size="sm" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Due Date & Time & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="task-due-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="task-due-date"
                type="date"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none sm:block hidden" />
            </div>
          </div>

          <div>
            <label htmlFor="task-due-time" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Time
            </label>
            <div className="relative">
              <input
                id="task-due-time"
                type="time"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
              <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none sm:block hidden" />
            </div>
          </div>

          <div>
            <label htmlFor="task-duration" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Est. Study Time (Mins)
            </label>
            <input
              id="task-duration"
              type="number"
              min="5"
              step="5"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Status (when editing) */}
        {mode === 'edit' && (
          <div>
            <label htmlFor="task-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['pending', 'in_progress', 'completed'] as TaskStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                    status === st
                      ? 'bg-violet-50 text-violet-700 border-violet-400 font-semibold ring-2 ring-violet-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description / Study Notes */}
        <div>
          <label htmlFor="task-desc" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Description & Notes
          </label>
          <textarea
            id="task-desc"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white resize-y"
            placeholder="Add assignment requirements, study guides, reference links, textbook pages..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Subtasks / Checklist */}
        <div className="border border-slate-200/80 rounded-xl p-3.5 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5 text-blue-600" />
              Subtasks & Milestones ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </span>
          </div>

          {/* Subtask input */}
          <div className="flex gap-2 mb-2.5">
            <input
              type="text"
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. Read chapter, draft introduction, review equations..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddSubtask}
              disabled={!newSubtaskTitle.trim()}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>

          {/* Subtask list */}
          {subtasks.length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200/80 text-xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span
                      className={`truncate ${
                        st.completed ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Remove subtask"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Tags
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-slate-200 bg-white">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-rose-600"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              className="text-xs text-slate-800 placeholder-slate-400 focus:outline-none flex-1 min-w-[120px] py-0.5"
              placeholder="Type tag and press enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={mode === 'create' ? <Plus className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
          >
            {mode === 'create' ? 'Create Task' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
