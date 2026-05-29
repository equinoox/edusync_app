'use client';

import {
  ArrowUpTrayIcon,
  BoltIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

import {
  ProgressLinkButton,
  ProgressPanel,
  ProgressSectionTitle,
} from '@/features/progress/components/progress-ui';
import type {
  ProgressActivity,
  RecentAchievementsProps,
} from '@/features/progress/types';
import { useTheme } from '@/providers/ThemeProvider';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));

const getActivityIcon = (activity: ProgressActivity) => {
  if (activity.type === 'score_improvement') return BoltIcon;
  if (activity.title.toLowerCase().includes('fast')) return ArrowUpTrayIcon;
  if (activity.type === 'achievement') return StarIcon;
  return TrophyIcon;
};

export function RecentAchievements({
  activities,
  onViewAll,
}: RecentAchievementsProps) {
  const { darkMode } = useTheme();
  const visibleActivities = activities.slice(0, 4);

  return (
    <ProgressPanel className="p-4">
      <ProgressSectionTitle
        title="Recent Achievements"
        action={
          <button
            type="button"
            onClick={onViewAll}
            className={darkMode ? 'text-sm font-medium text-violet-400' : 'text-sm font-medium text-indigo-600'}
          >
            View all
          </button>
        }
      />

      {visibleActivities.length === 0 ? (
        <div className={`grid min-h-48 place-items-center rounded-xl border border-dashed text-center ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <p className={`px-6 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Recent quiz milestones will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {visibleActivities.map((activity, index) => {
          const Icon = getActivityIcon(activity);

          return (
            <div
              key={activity.id}
              className={`edusync-enter-fast grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b py-2.5 last:border-b-0 ${darkMode ? 'border-white/[0.06]' : 'border-slate-200'}`}
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-50 text-violet-700'}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {activity.title}
                </p>
                <p className={`truncate text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {activity.description}
                </p>
              </div>
              <time className={`whitespace-nowrap text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {formatDate(activity.occurredAt)}
              </time>
            </div>
          );
          })}
        </div>
      )}

      <div className="pt-3 text-center">
        <ProgressLinkButton onClick={onViewAll}>
          View all achievements
          <span aria-hidden="true">{'->'}</span>
        </ProgressLinkButton>
      </div>
    </ProgressPanel>
  );
}
