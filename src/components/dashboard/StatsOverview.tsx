import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalCount: number;
    pendingCount: number;
    inProgressCount: number;
    completedCount: number;
    dueTodayCount: number;
    overdueCount: number;
    completionRate: number;
  };
  streakDays: number;
  onFilterClick?: (status: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  streakDays,
  onFilterClick,
}) => {
  const cards = [
    {
      title: 'Pending Tasks',
      value: stats.pendingCount + stats.inProgressCount,
      subtext: `${stats.inProgressCount} in progress`,
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50/70',
      border: 'border-blue-100',
      statusFilter: 'pending',
    },
    {
      title: 'Completed',
      value: stats.completedCount,
      subtext: `${stats.completionRate}% completion rate`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100',
      statusFilter: 'completed',
    },
    {
      title: 'Due Today',
      value: stats.dueTodayCount,
      subtext: stats.overdueCount > 0 ? `⚠️ ${stats.overdueCount} overdue` : 'No overdue tasks 🎉',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bg: stats.overdueCount > 0 ? 'bg-amber-50/70' : 'bg-slate-50',
      border: stats.overdueCount > 0 ? 'border-amber-200' : 'border-slate-200',
      statusFilter: 'today',
    },
    {
      title: 'Study Streak',
      value: `${streakDays} Days`,
      subtext: 'Daily focus goal active',
      icon: <Sparkles className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-50/70',
      border: 'border-violet-100',
      statusFilter: 'all',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => onFilterClick && onFilterClick(card.statusFilter)}
          className={`bg-white rounded-2xl border ${card.border} p-4.5 shadow-2xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {card.value}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                {card.subtext}
              </p>
            </div>

            <div className={`p-2.5 rounded-xl ${card.bg} shrink-0 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
          </div>

          {/* Bottom subtle progress line */}
          <div className="mt-3 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              style={{
                width: card.title === 'Completed' ? `${stats.completionRate}%` : '100%',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
