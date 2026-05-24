'use client';

import {
  CalendarDaysIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import { useTheme } from '@/providers/ThemeProvider';

type SortOrder = 'desc' | 'asc';

type QuizzesDashboardHeaderProps = {
  isProfessor: boolean;
  search: string;
  sortOrder: SortOrder;
  onSearchChange: (value: string) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onCreateQuiz: () => void;
};

export function QuizzesDashboardHeader({
  isProfessor,
  search,
  sortOrder,
  onSearchChange,
  onSortOrderChange,
  onCreateQuiz,
}: QuizzesDashboardHeaderProps) {
  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-inner ${darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-500/15 text-violet-700'}`}>
          <CalendarDaysIcon className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
            Quizzes
          </h1>
          <p className={`mt-1 text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            Create, manage, and take quizzes to test your knowledge.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block min-w-0 sm:w-64">
          <span className="sr-only">Search quizzes</span>
          <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Search quizzes..."
            className={`h-10 w-full rounded-lg border px-4 pr-10 text-sm outline-none transition shadow-sm focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-white/5 bg-slate-800 text-white placeholder:text-slate-500' : 'border-slate-500 bg-slate-400 text-slate-950 placeholder:text-slate-700'}`}
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Sort quizzes</span>
          <FunnelIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <select
            value={sortOrder}
            onChange={event => onSortOrderChange(event.target.value as SortOrder)}
            className={`h-10 appearance-none rounded-lg border px-10 text-sm font-bold outline-none transition shadow-sm focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-white/5 bg-slate-800 text-slate-100' : 'border-slate-500 bg-slate-400 text-slate-800'}`}
          >
            <option value="desc">Created DSC</option>
            <option value="asc">Created ASC</option>
          </select>
        </label>

        {isProfessor && (
          <button
            type="button"
            onClick={onCreateQuiz}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700"
          >
            <PlusIcon className="h-5 w-5" />
            Create Quiz
          </button>
        )}
      </div>
    </div>
  );
}
