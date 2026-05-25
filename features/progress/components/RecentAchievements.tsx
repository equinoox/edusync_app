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
  const visibleActivities = activities.slice(0, 4);

  return (
    <ProgressPanel className="p-5">
      <ProgressSectionTitle
        title="Recent Achievements"
        action={
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-medium text-violet-400"
          >
            View all
          </button>
        }
      />

      {visibleActivities.length === 0 ? (
        <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-slate-700 text-center">
          <p className="px-6 text-sm text-slate-400">
            Recent quiz milestones will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {visibleActivities.map(activity => {
          const Icon = getActivityIcon(activity);

          return (
            <div
              key={activity.id}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[0.06] py-3 last:border-b-0"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {activity.title}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {activity.description}
                </p>
              </div>
              <time className="whitespace-nowrap text-xs text-slate-400">
                {formatDate(activity.occurredAt)}
              </time>
            </div>
          );
          })}
        </div>
      )}

      <div className="pt-4 text-center">
        <ProgressLinkButton onClick={onViewAll}>
          View all achievements
          <span aria-hidden="true">{'->'}</span>
        </ProgressLinkButton>
      </div>
    </ProgressPanel>
  );
}
