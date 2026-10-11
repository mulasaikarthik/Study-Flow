import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/user';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { User, Bell, Volume2, Target, GraduationCap, Building2, Save } from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<UserProfile>) => Promise<boolean>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dailyStudyGoalMinutes, setDailyStudyGoalMinutes] = useState(180);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setUniversity(user.university || '');
      setMajor(user.major || '');
      setAcademicYear(user.academicYear || '');
      setStudentId(user.studentId || '');
      setDailyStudyGoalMinutes(user.dailyStudyGoalMinutes || 120);
      setNotificationsEnabled(user.notificationsEnabled ?? true);
      setSoundEnabled(user.soundEnabled ?? true);
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const ok = await onUpdate({
        fullName,
        university,
        major,
        academicYear,
        studentId,
        dailyStudyGoalMinutes: Number(dailyStudyGoalMinutes),
        notificationsEnabled,
        soundEnabled,
      });
      if (ok) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Student Profile & Settings</h3>
            <p className="text-xs text-slate-500">Manage academic details & study preferences</p>
          </div>
        </div>
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar preview */}
        <div className="flex items-center gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt="Avatar"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-200"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{fullName || 'Student'}</h4>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
              ID: {studentId || 'STU-2025'}
            </span>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* University & Major Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              University
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Major / Specialization
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>
        </div>

        {/* Academic Year */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Academic Standing
          </label>
          <select
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          >
            <option value="Freshman Year">Freshman Year</option>
            <option value="Sophomore Year">Sophomore Year</option>
            <option value="Junior Year">Junior Year</option>
            <option value="Senior Year">Senior Year</option>
            <option value="Master's / Graduate">Master&apos;s / Graduate</option>
            <option value="PhD Candidate">PhD Candidate</option>
          </select>
        </div>

        {/* Daily Study Goal */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-violet-600" />
            Daily Focus Goal: {dailyStudyGoalMinutes} Minutes ({(dailyStudyGoalMinutes / 60).toFixed(1)} hrs)
          </label>
          <input
            type="range"
            min="30"
            max="480"
            step="15"
            className="w-full accent-blue-600"
            value={dailyStudyGoalMinutes}
            onChange={(e) => setDailyStudyGoalMinutes(Number(e.target.value))}
          />
        </div>

        {/* Notification & Sound toggles */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Deadline Reminders</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="rounded text-blue-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Focus Timer Sounds & Chimes</span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="rounded text-blue-600 w-4 h-4"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </Modal>
  );
};
