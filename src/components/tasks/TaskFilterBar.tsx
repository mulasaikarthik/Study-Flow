import React from 'react';
import { TaskFilterOptions, ViewMode } from '../../types/task';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  KanbanSquare, 
  ArrowUpDown, 
  RotateCcw 
} from 'lucide-react';

interface TaskFilterBarProps {
  filters: TaskFilterOptions;
  onFilterChange: <K extends keyof TaskFilterOptions>(key: K, value: TaskFilterOptions[K]) => void;
  onResetFilters: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  categories: string[];
  stats: {
    totalCount: number;
    pendingCount: number;
    inProgressCount: number;
    completedCount: number;
    overdueCount: number;
    dueTodayCount: number;
  };
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  categories,
  stats,
}) => {
  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.dateRange !== 'all';

  const statusTabs: Array<{ id: TaskFilterOptions['status']; label: string; count: number }> = [
    { id: 'all', label: 'All Tasks', count: stats.totalCount },
    { id: 'pending', label: 'Pending', count: stats.pendingCount },
    { id: 'in_progress', label: 'In Progress', count: stats.inProgressCount },
    { id: 'completed', label: 'Completed', count: stats.completedCount },
    { id: 'today', label: 'Due Today', count: stats.dueTodayCount },
    { id: 'overdue', label: 'Overdue', count: stats.overdueCount },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Search by title, description, course (e.g. CS-244B), or #tag..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns & View toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter by subject"
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              <option value="all">All Subjects</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter by priority"
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              value={filters.priority}
              onChange={(e) => onFilterChange('priority', e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔥 Urgent</option>
              <option value="high">⚠️ High</option>
              <option value="medium">⏱️ Medium</option>
              <option value="low">💤 Low</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Menu */}
          <div className="relative">
            <select
              aria-label="Sort tasks by"
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value as TaskFilterOptions['sortBy'])}
            >
              <option value="dueDateAsc">Due Date (Earliest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
              <option value="priorityDesc">Priority (Highest)</option>
              <option value="titleAsc">Title (A-Z)</option>
              <option value="createdDesc">Recently Added</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table / List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board View"
            >
              <KanbanSquare className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters button if any active filter */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              title="Clear all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Pill Tabs Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange('status', tab.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
