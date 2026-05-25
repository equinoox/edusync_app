'use client';

import { ChevronRightIcon } from '@heroicons/react/20/solid';

import { ProgressPanel, ProgressSectionTitle } from '@/features/progress/components/progress-ui';
import type { SubjectPerformanceProps } from '@/features/progress/types';
import { cn } from '@/lib/utils';

const toneClasses = {
  violet: 'bg-violet-500/20 text-violet-300',
  green: 'bg-emerald-500/20 text-emerald-300',
  blue: 'bg-blue-500/20 text-blue-300',
  orange: 'bg-orange-500/20 text-orange-300',
  cyan: 'bg-cyan-500/20 text-cyan-300',
  pink: 'bg-pink-500/20 text-pink-300',
};

const barClasses = {
  violet: 'bg-violet-500',
  green: 'bg-emerald-400',
  blue: 'bg-blue-400',
  orange: 'bg-orange-400',
  cyan: 'bg-cyan-400',
  pink: 'bg-pink-400',
};

export function SubjectPerformance({ items }: SubjectPerformanceProps) {
  return (
    <ProgressPanel className="p-5">
      <ProgressSectionTitle
        title="Subject Performance"
        action={
          <button type="button" className="text-sm font-medium text-violet-400">
            View all
          </button>
        }
      />

      {items.length === 0 ? (
        <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-slate-700 text-center">
          <p className="px-6 text-sm text-slate-400">
            Complete quizzes to unlock subject performance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.75rem_1rem] items-center gap-3">
            <span className={cn('flex h-9 w-9 items-center justify-center rounded-full', toneClasses[item.tone])}>
              <item.Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{item.name}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={cn('h-full rounded-full', barClasses[item.tone])}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
            <p className="text-right text-sm font-semibold text-white">{item.percent}%</p>
            <ChevronRightIcon className="h-4 w-4 text-violet-400" />
          </div>
        ))}
        </div>
      )}
    </ProgressPanel>
  );
}
