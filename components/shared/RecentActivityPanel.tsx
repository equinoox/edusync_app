'use client';

import type { ComponentType } from 'react';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

import { useTheme } from '@/providers/ThemeProvider';

export type RecentActivityItem = {
  id: string;
  title: string;
  description?: string;
  timestamp?: Date | string;
  label?: string;
  Icon?: ComponentType<{ className?: string }>;
  tone?: {
    light: string;
    dark: string;
  };
};

type RecentActivityPanelProps = {
  title?: string;
  emptyMessage: string;
  items: RecentActivityItem[];
  actionLabel?: string;
  previewLimit?: number;
  onViewAll?: () => void;
};

const formatRelative = (value: Date | string) => {
  const createdAt = new Date(value).getTime();
  const diffMs = Date.now() - createdAt;
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return `${Math.round(diffHours / 24)}d ago`;
};

export function RecentActivityPanel({
  title = 'Recent Activity',
  emptyMessage,
  items,
  actionLabel = 'View all activity',
  previewLimit,
  onViewAll,
}: RecentActivityPanelProps) {
  const { darkMode } = useTheme();
  const visibleItems = previewLimit ? items.slice(0, previewLimit) : items;

  return (
    <aside className={`edusync-enter edusync-card-motion rounded-xl border p-5 shadow-md ${darkMode ? 'border-white/5 bg-slate-800' : 'border-slate-500 bg-slate-400'}`}>
      <div className="flex items-center gap-2">
        <SparklesIcon className={`h-5 w-5 ${darkMode ? 'text-violet-300' : 'text-violet-600'}`} />
        <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
          {title}
        </h2>
      </div>

      <div className={`mt-5 divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-500'}`}>
        {visibleItems.length === 0 ? (
          <p className={`py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {emptyMessage}
          </p>
        ) : (
          visibleItems.map((item, index) => {
            const Icon = item.Icon ?? SparklesIcon;

            return (
              <div
                key={item.id}
                className="edusync-enter-fast flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${darkMode ? item.tone?.dark ?? 'bg-violet-500/20 text-violet-300' : item.tone?.light ?? 'bg-violet-500/15 text-violet-700'}`}>
                  {item.label ? (
                    <span className="text-[10px] font-bold">{item.label}</span>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`line-clamp-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                    {item.title}
                  </p>
                  {(item.description || item.timestamp) && (
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-700'}`}>
                      {item.description}
                      {item.description && item.timestamp ? ' - ' : ''}
                      {item.timestamp ? formatRelative(item.timestamp) : ''}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className={`edusync-button-motion mt-5 inline-flex w-full items-center justify-center gap-2 text-sm font-medium transition ${darkMode ? 'text-violet-300 hover:text-violet-200' : 'text-violet-700 hover:text-violet-800'}`}
      >
        {actionLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </aside>
  );
}
