'use client';

import {
  CalendarDaysIcon,
  ChartBarIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import type { ProgressHeaderProps } from '@/features/progress/types';

export function ProgressHeader({
  classroomLabel,
  periodLabel,
}: ProgressHeaderProps) {
  return (
    <header className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300">
          <ChartBarIcon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold leading-tight text-white">
            Progress
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Track your learning progress and performance over time.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="flex h-9 min-w-40 items-center justify-between rounded-xl bg-slate-800/90 px-3.5 text-sm font-medium text-white shadow-inner shadow-white/[0.02]"
        >
          <span>{classroomLabel}</span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>
        <button
          type="button"
          className="flex h-9 min-w-40 items-center justify-between rounded-xl bg-slate-800/90 px-3.5 text-sm font-medium text-white shadow-inner shadow-white/[0.02]"
        >
          <span className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4 text-slate-300" />
            {periodLabel}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
