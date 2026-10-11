import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { PomodoroWidget } from '../components/dashboard/PomodoroWidget';
import { Target, CheckCircle2, Flame, Award } from 'lucide-react';
import { Task } from '../types/task';

export const PomodoroPage: React.FC = () => {
  const { tasks, toggleTask } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    tasks.find((t) => t.status !== 'completed')?.id || ''
  );

  const pendingTasks = tasks.filter((t: Task) => t.status !== 'completed');
  const activeTask = tasks.find((t: Task) => t.id === selectedTaskId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Deep Focus Study Timer
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Boost academic retention with timed intervals and focused study sprints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Focus Timer Container (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <PomodoroWidget />

          {/* Active study task selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Link Timer to Active Assignment
              </h3>
            </div>

            {pendingTasks.length === 0 ? (
              <p className="text-xs text-slate-400">No pending tasks. You can focus on general review!</p>
            ) : (
              <select
                aria-label="Link Timer to Active Assignment"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
              >
                {pendingTasks.map((t: Task) => (
                  <option key={t.id} value={t.id}>
                    [{t.category}] {t.title}
                  </option>
                ))}
              </select>
            )}

            {activeTask && (
              <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{activeTask.title}</span>
                  <span className="block text-[11px] text-blue-700 font-semibold mt-0.5">
                    Course: {activeTask.courseCode || activeTask.category}
                  </span>
                </div>
                <button
                  onClick={() => toggleTask(activeTask.id)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors font-medium text-xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Focus Tips & Techniques */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-violet-600" />
              The Pomodoro Method
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Choose 1 specific task without multitasking.</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Work intensely for 25 minutes until the timer rings.</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Take a 5-minute break (stretch, hydrate, rest eyes).</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-start gap-2">
                <span className="font-bold text-blue-600">4.</span>
                <span>After 4 sessions, enjoy a longer 15-minute recharge.</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl p-4.5 shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-100">
                Scientifically Proven
              </h4>
            </div>
            <p className="text-xs text-violet-100/90 leading-relaxed">
              Spaced focus intervals prevent cognitive fatigue and improve exam memory retention by up to 34%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
