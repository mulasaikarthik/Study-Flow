import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { Sparkles, CheckCircle2, Calendar, Award, Timer } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative selection:bg-violet-100 selection:text-violet-800">
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto">
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for High-Performing Students</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Master your academic schedule with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              StudyFlow
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Never miss a lab deadline or midterm again. Organize homework, track focus sessions with Pomodoro, and stay on top of every assignment.
          </p>

          <div className="space-y-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
            {[
              {
                text: 'Smart task organizer with subject tags and priority badges',
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
              },
              {
                text: 'Built-in 25-minute Pomodoro study focus timer',
                icon: <Timer className="w-4 h-4 text-blue-500 shrink-0" />,
              },
              {
                text: 'Chronological timeline and overdue deadline warnings',
                icon: <Calendar className="w-4 h-4 text-violet-500 shrink-0" />,
              },
              {
                text: 'Track streaks, courses, and daily study goals',
                icon: <Award className="w-4 h-4 text-indigo-500 shrink-0" />,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-center">
          {mode === 'login' ? (
            <LoginForm onSwitchToSignUp={() => setMode('signup')} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400">
        StudyFlow · Student productivity dashboard
      </footer>
    </div>
  );
};
