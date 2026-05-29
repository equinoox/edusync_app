'use client';

import {
  CalendarDaysIcon,
  ChartBarIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import type { ProgressHeaderProps } from '@/features/progress/types';
import { useTheme } from '@/providers/ThemeProvider';

export function ProgressHeader({
  classroomLabel,
  periodLabel,
}: ProgressHeaderProps) {
  const { darkMode } = useTheme();

  return (
    <header className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${darkMode ? 'bg-violet-600/30 text-violet-300' : 'bg-indigo-50 text-indigo-600'}`}>
          <ChartBarIcon className="h-6 w-6" />
        </span>
        <div>
          <h1 className={`text-2xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Progress
          </h1>
          <p className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Track your learning progress and performance over time.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className={`flex h-9 min-w-40 items-center justify-between rounded-xl px-3.5 text-sm font-medium shadow-inner ${darkMode ? 'bg-slate-800/90 text-white shadow-white/[0.02]' : 'bg-white text-slate-800 shadow-slate-200'}`}
        >
          <span>{classroomLabel}</span>
          <ChevronDownIcon className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
        </button>
        <button
          type="button"
          className={`flex h-9 min-w-40 items-center justify-between rounded-xl px-3.5 text-sm font-medium shadow-inner ${darkMode ? 'bg-slate-800/90 text-white shadow-white/[0.02]' : 'bg-white text-slate-800 shadow-slate-200'}`}
        >
          <span className="flex items-center gap-2">
            <CalendarDaysIcon className={`h-4 w-4 ${darkMode ? 'text-slate-300' : 'text-slate-500'}`} />
            {periodLabel}
          </span>
          <ChevronDownIcon className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
        </button>
      </div>
    </header>
  );
}
