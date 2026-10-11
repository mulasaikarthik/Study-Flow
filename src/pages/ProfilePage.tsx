import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Button } from '../components/common/Button';
import { UserProfileModal } from '../components/profile/UserProfileModal';
import {
  GraduationCap,
  Building2,
  Target,
  Flame,
  CheckCircle2,
  Edit3,
  Award,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { stats, tasks } = useTasks();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
          />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user.fullName}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {user.studentId}
              </span>
            </div>

            <p className="text-sm text-slate-500">{user.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-blue-600" />
                {user.university}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-4 h-4 text-violet-600" />
                {user.major} ({user.academicYear})
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            leftIcon={<Edit3 className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Study Streak
            </h4>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {user.currentStreakDays} Consecutive Days
          </div>
          <p className="text-xs text-slate-500 mt-1">Keep studying daily to maintain momentum!</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Target className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Daily Target
            </h4>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {user.dailyStudyGoalMinutes} Minutes
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ~{(user.dailyStudyGoalMinutes / 60).toFixed(1)} hours of focused study / day
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Completion Rate
            </h4>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.completionRate}%</div>
          <p className="text-xs text-slate-500 mt-1">
            {stats.completedCount} of {stats.totalCount} total tasks finished
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Current Course Enrollments
          </h3>
          <span className="text-xs text-slate-500 font-medium">Spring Quarter 2025</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              code: 'CS-244B',
              name: 'Distributed Systems Architecture',
              tasksCount: tasks.filter((t) => t.courseCode === 'CS-244B').length,
            },
            {
              code: 'MATH-104',
              name: 'Applied Linear Algebra & Matrices',
              tasksCount: tasks.filter((t) => t.courseCode === 'MATH-104').length,
            },
            {
              code: 'BIO-201',
              name: 'Molecular Genetics & CRISPR',
              tasksCount: tasks.filter((t) => t.courseCode === 'BIO-201').length,
            },
            {
              code: 'RES-499',
              name: 'Senior Honors Thesis Research',
              tasksCount: tasks.filter((t) => t.courseCode === 'RES-499').length,
            },
          ].map((c) => (
            <div
              key={c.code}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-blue-700">{c.code}</span>
                <p className="text-xs font-bold text-slate-800">{c.name}</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                {c.tasksCount} Tasks
              </span>
            </div>
          ))}
        </div>
      </div>

      <UserProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={updateProfile}
      />
    </div>
  );
};
