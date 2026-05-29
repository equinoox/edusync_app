'use client';

import { ChevronRightIcon } from '@heroicons/react/20/solid';

import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { ProgressPanel, ProgressSectionTitle } from '@/features/progress/components/progress-ui';
import type { SubjectPerformanceProps } from '@/features/progress/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

const toneClasses = {
  violet: 'bg-violet-500/20 text-violet-300',
  green: 'bg-emerald-500/20 text-emerald-300',
  blue: 'bg-blue-500/20 text-blue-300',
  orange: 'bg-orange-500/20 text-orange-300',
  cyan: 'bg-cyan-500/20 text-cyan-300',
  pink: 'bg-pink-500/20 text-pink-300',
};

const lightToneClasses = {
  violet: 'bg-violet-50 text-violet-700',
  green: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  orange: 'bg-orange-50 text-orange-700',
  cyan: 'bg-cyan-50 text-cyan-700',
  pink: 'bg-pink-50 text-pink-700',
};

const barClasses = {
  violet: 'bg-violet-500',
  green: 'bg-emerald-400',
  blue: 'bg-blue-400',
  orange: 'bg-orange-400',
  cyan: 'bg-cyan-400',
  pink: 'bg-pink-400',
};

export function SubjectPerformance({ items, onViewAll }: SubjectPerformanceProps) {
  const { darkMode } = useTheme();
  const visibleItems = items.slice(0, 6);

  return (
    <ProgressPanel className="p-4">
      <ProgressSectionTitle
        title="Subject Performance"
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

      {visibleItems.length === 0 ? (
        <div className={`grid min-h-48 place-items-center rounded-xl border border-dashed text-center ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <p className={`px-6 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Complete quizzes to unlock subject performance.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className="edusync-enter-fast grid grid-cols-[2.25rem_minmax(0,1fr)_2.75rem_1rem] items-center gap-2.5"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', darkMode ? toneClasses[item.tone] : lightToneClasses[item.tone])}>
              <item.Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className={`truncate text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</p>
              <div className={`mt-2 h-1.5 overflow-hidden rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div
                  className={cn('h-full rounded-full edusync-progress-fill', barClasses[item.tone])}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
            <p className={`text-right text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <AnimatedNumber value={item.percent} suffix="%" />
            </p>
            <ChevronRightIcon className="h-4 w-4 text-violet-400" />
          </div>
        ))}
        </div>
      )}
    </ProgressPanel>
  );
}
