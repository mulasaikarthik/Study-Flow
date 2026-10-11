import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_TIMES: Record<PomodoroMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroWidget: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_TIMES.pomodoro);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'pomodoro') {
        setSessionsCompleted((prev) => prev + 1);
      }
      // Play web audio chime if sound is enabled
      if (soundEnabled) {
        try {
          const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        } catch {
          // Audio fallback
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, soundEnabled]);

  const handleModeChange = (newMode: PomodoroMode) => {
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalTime = MODE_TIMES[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/10 text-violet-300">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Study Focus Timer</h3>
            <p className="text-[11px] text-slate-300">Pomodoro Technique</p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Mode Switches */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-white/5 rounded-xl mb-4 relative z-10">
        <button
          onClick={() => handleModeChange('pomodoro')}
          className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
            mode === 'pomodoro'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => handleModeChange('shortBreak')}
          className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
            mode === 'shortBreak'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Break (5m)
        </button>
        <button
          onClick={() => handleModeChange('longBreak')}
          className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
            mode === 'longBreak'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Long (15m)
        </button>
      </div>

      {/* Big Digits Display */}
      <div className="text-center my-3 relative z-10">
        <div className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-white mb-1.5">
          {formatTimer(timeLeft)}
        </div>
        <p className="text-xs text-slate-300">
          {isRunning ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Focus session in progress
            </span>
          ) : (
            'Ready to start studying'
          )}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden my-3 relative z-10">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-violet-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 relative z-10 mt-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          leftIcon={isRunning ? <Pause className="w-4 h-4 text-slate-800" /> : <Play className="w-4 h-4 text-slate-800 fill-current" />}
          className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-5"
        >
          {isRunning ? 'Pause' : 'Start Focus'}
        </Button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Session counter footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 relative z-10">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          Completed today:
        </span>
        <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
          {sessionsCompleted} Sessions ({(sessionsCompleted * 25) / 60 >= 1 ? `${((sessionsCompleted * 25) / 60).toFixed(1)}h` : `${sessionsCompleted * 25}m`})
        </span>
      </div>
    </div>
  );
};
