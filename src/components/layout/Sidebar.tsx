import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  CalendarDays,
  User,
  PlusCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { UserProfile } from '../../types/user';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  user: UserProfile | null;
  pendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreateModal,
  user,
  pendingCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'tasks',
      label: 'Tasks & Planner',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'timer',
      label: 'Focus Timer',
      icon: <Timer className="w-4 h-4" />,
    },
    {
      id: 'calendar',
      label: 'Deadlines',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: 'Student Profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 h-screen sticky top-0 shrink-0 select-none">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent">
              StudyFlow
            </span>
            <p className="text-[11px] text-slate-400">Student Productivity</p>
          </div>
        </div>
      </div>

      <div className="p-4 pb-2">
        <button
          onClick={onOpenCreateModal}
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 active:scale-[0.98] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
              </div>
            </button>
          );
        })}
      </nav>

      {user && (
        <div
          onClick={() => onSelectTab('profile')}
          className="p-3.5 border-t border-slate-100 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
        >
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
    </aside>
  );
};
