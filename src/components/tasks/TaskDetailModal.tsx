import React from 'react';
import { Task } from '../../types/task';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PriorityBadge, StatusBadge, CategoryChip } from '../common/Badge';
import { formatDate, formatTime, getRelativeDays } from '../../utils/dateUtils';
import { 
  Calendar, 
  Clock, 
  Tag, 
  ListTodo, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleSubtask,
}) => {
  if (!task) return null;

  const isCompleted = task.status === 'completed';
  const { label: dueLabel, isOverdue, isToday } = getRelativeDays(task.dueDate);

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} size="sm" />
          {task.courseCode && (
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
              {task.courseCode}
            </span>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Title */}
        <div>
          <h2
            className={`text-xl font-bold ${
              isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {task.title}
          </h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <CategoryChip category={task.category} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Due Date & Time Info Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div>
              <span className="font-semibold block text-slate-900">
                {formatDate(task.dueDate)} {task.dueTime ? `at ${formatTime(task.dueTime)}` : ''}
              </span>
              <span
                className={`text-[11px] font-medium ${
                  isOverdue ? 'text-rose-600 font-bold' : isToday ? 'text-amber-600 font-bold' : 'text-slate-500'
                }`}
              >
                Status: {dueLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-violet-600" />
            <div>
              <span className="font-semibold block text-slate-900">
                Est. Study Time: {task.estimatedMinutes ? `${task.estimatedMinutes} mins` : 'Not specified'}
              </span>
              <span className="text-[11px] text-slate-500">
                Created: {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Description / Notes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Assignment Notes & Context
          </h4>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {task.description || (
              <span className="italic text-slate-400">No additional notes provided for this task.</span>
            )}
          </div>
        </div>

        {/* Subtasks Checklist */}
        {totalSubtasks > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-blue-600" />
                Subtasks & Milestones ({completedSubtasks}/{totalSubtasks})
              </h4>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {task.subtasks.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask(task.id, st.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span
                    className={`flex-1 ${
                      st.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
                    }`}
                  >
                    {st.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => onToggleStatus(task.id)}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            {isCompleted ? 'Mark Pending' : 'Mark Completed'}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onClose();
                onDelete(task.id);
              }}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
