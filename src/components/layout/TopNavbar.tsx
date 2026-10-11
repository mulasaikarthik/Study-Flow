import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  User,
  LogOut,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { UserProfile } from '../../types/user';
import { Button } from '../common/Button';

interface TopNavbarProps {
  user: UserProfile | null;
  onOpenCreateModal: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  onOpenCreateModal,
  onOpenProfile,
  onLogout,
  onToggleMobileMenu,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm bg-gradient-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent">
              StudyFlow
            </span>
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800">
              {user ? `Hi, ${user.fullName.split(' ')[0]}` : 'Welcome'}
            </p>
            <p className="text-[11px] text-slate-400">
              {user?.major ? `${user.major} · ${user.academicYear}` : 'Stay on top of your study plan'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-2xs text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">Add</span>
          </Button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              aria-expanded={dropdownOpen}
            >
              {user ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-100"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[100px] truncate">
                {user?.fullName?.split(' ')[0] || 'Student'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                {user && (
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
                      {user.major} • {user.academicYear}
                    </p>
                  </div>
                )}

                <div className="p-1 space-y-0.5 text-xs">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & Preferences</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
