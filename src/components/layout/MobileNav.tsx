import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  CalendarDays,
  User,
  X,
  Sparkles,
  Plus,
} from 'lucide-react';
import { UserProfile } from '../../types/user';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  user: UserProfile | null;
  pendingCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenCreateModal,
  user,
  pendingCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" />, badge: pendingCount },
    { id: 'timer', label: 'Focus Timer', icon: <Timer className="w-5 h-5" /> },
    { id: 'calendar', label: 'Deadlines', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-slate-800 text-sm">StudyFlow</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 pb-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateModal();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Study Task</span>
              </button>
            </div>

            <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {user && (
              <div className="p-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-800 truncate">{user.fullName}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{user.university}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            currentTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('tasks')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors relative ${
            currentTab === 'tasks' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <CheckSquare className="w-4.5 h-4.5" />
          <span>Tasks</span>
          {pendingCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>

        <button
          onClick={onOpenCreateModal}
          className="-mt-5 w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform"
          aria-label="Add Task"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onSelectTab('timer')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            currentTab === 'timer' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <Timer className="w-4.5 h-4.5" />
          <span>Timer</span>
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            currentTab === 'profile' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <User className="w-4.5 h-4.5" />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};
