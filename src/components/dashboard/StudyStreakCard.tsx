import React from 'react';
import { Flame, Award, Target } from 'lucide-react';

interface StudyStreakCardProps {
  currentStreakDays: number;
  dailyGoalMinutes: number;
  completedTasksToday: number;
}

export const StudyStreakCard: React.FC<StudyStreakCardProps> = ({
  currentStreakDays,
  dailyGoalMinutes,
  completedTasksToday,
}) => {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [true, true, true, true, true, true, false]; // mock week representation

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Study Streak & Goals</h3>
            <p className="text-[11px] text-slate-400">Consistency tracker</p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
          <Award className="w-3 h-3" />
          {currentStreakDays} Days
        </span>
      </div>

      {/* Week day bubbles */}
      <div className="flex items-center justify-between gap-1.5 mb-4 p-2 bg-slate-50/70 rounded-xl">
        {daysOfWeek.map((day, idx) => {
          const isActive = activeDays[idx];
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-400 font-semibold">{day}</span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-200/60 text-slate-400'
                }`}
              >
                {isActive ? '✓' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Target Stats */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            Daily Focus Target
          </span>
          <span className="font-semibold text-slate-800">{dailyGoalMinutes} mins</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Tasks Completed Today</span>
          <span className="font-semibold text-emerald-600">
            {completedTasksToday > 0 ? `${completedTasksToday} done` : '1 scheduled'}
          </span>
        </div>
      </div>
    </div>
  );
};
