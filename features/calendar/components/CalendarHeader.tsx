'use client';

import {
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import type { CalendarHeaderProps } from '@/features/calendar/types';
import { useTheme } from '@/providers/ThemeProvider';

export function CalendarHeader({
  monthLabel,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onCreateEvent,
}: CalendarHeaderProps) {
  const { darkMode } = useTheme();

  return (
    <header>
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300">
            <CalendarDaysIcon className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <p className="mt-1 text-sm text-slate-300">
              Stay on top of your classes, assignments, and important deadlines.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCreateEvent}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white shadow-md transition hover:bg-violet-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Event
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md"
            aria-label="Event options"
            title="Event options"
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToday}
            className={`h-11 rounded-xl px-5 text-sm font-semibold ${
              darkMode
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-400 text-slate-900 hover:bg-slate-500'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={onPreviousMonth}
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-400 hover:bg-slate-500'
            }`}
            aria-label="Previous month"
            title="Previous month"
          >
            <ChevronLeftIcon className="h-5 w-5 text-white" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-400 hover:bg-slate-500'
            }`}
            aria-label="Next month"
            title="Next month"
          >
            <ChevronRightIcon className="h-5 w-5 text-white" />
          </button>
          <h2 className="ml-3 text-lg font-bold text-white">{monthLabel}</h2>
        </div>

        <div className="grid grid-cols-4 overflow-hidden rounded-xl bg-slate-800 p-1 text-sm">
          {['Month', 'Week', 'Day', 'Agenda'].map((mode, index) => (
            <button
              key={mode}
              type="button"
              className={`rounded-lg px-4 py-2 ${
                index === 0 ? 'bg-violet-600 text-white' : 'text-slate-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
