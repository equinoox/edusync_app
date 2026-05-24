'use client';

import {
  BuildingLibraryIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import { CreateClassroomButton } from '@/features/classrooms/components/CreateClassroomButton';
import { useTheme } from '@/providers/ThemeProvider';

type SortOrder = 'desc' | 'asc';


type ClassroomsDashboardHeaderProps = {
  isProfessor: boolean;
  search: string;
  sortOrder: SortOrder;
  onSearchChange: (value: string) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onCreateClassroom: () => void;
};

export function ClassroomsDashboardHeader({
  isProfessor,
  search,
  sortOrder,
  onSearchChange,
  onSortOrderChange,
  onCreateClassroom,
}: ClassroomsDashboardHeaderProps) {

  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-inner ${darkMode ? "bg-violet-500/20 text-violet-300" : "bg-violet-500/15 text-violet-600"}`}>
          <BuildingLibraryIcon className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-950"}`}>
            Classrooms
          </h1>
          <p className={`mt-1 text-sm ${darkMode ? "text-slate-200" : "text-slate-600"}`}>
            Classes, materials, and students in one place.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block min-w-0 sm:w-64">
          <span className="sr-only">Search classrooms</span>
          <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Search classrooms..."
            className={`h-10 w-full rounded-lg border px-4 pr-10 text-sm outline-none transition shadow-sm focus:ring-2 focus:ring-violet-500 ${
              darkMode
                ? "border-white/5 bg-slate-800 text-white placeholder:text-slate-500"
                : "border-slate-200 bg-slate-400 text-slate-950 placeholder:text-slate-600"
            }`}
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Sort classrooms</span>
          <FunnelIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <select
            value={sortOrder}
            onChange={event => onSortOrderChange(event.target.value as SortOrder)}
            className={`h-10 appearance-none rounded-lg border px-10 text-sm font-bold outline-none transition shadow-sm focus:ring-2 focus:ring-violet-500 ${
              darkMode
                ? "border-white/5 bg-slate-800 text-slate-100"
                : "border-slate-200 bg-slate-400 text-slate-700"
            }`}
          >
            <option value="desc">Created DSC</option>
            <option value="asc">Created ASC</option>
          </select>
        </label>

        {isProfessor && (
          <div className="hidden sm:block">
            <CreateClassroomButton onClick={onCreateClassroom} />
          </div>
        )}
      </div>
    </div>
  );
}
