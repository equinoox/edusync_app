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
      <div className={`flex flex-col gap-4 border-b pb-4 xl:flex-row xl:items-center xl:justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${darkMode ? 'bg-violet-600/30 text-violet-300' : 'bg-indigo-50 text-indigo-600'}`}>
            <CalendarDaysIcon className="h-7 w-7" />
          </span>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Calendar</h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Stay on top of your classes, assignments, and important deadlines.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCreateEvent}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-3.5 text-sm font-bold text-white shadow-md transition hover:bg-violet-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Event
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md"
            aria-label="Event options"
            title="Event options"
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToday}
            className={`h-10 rounded-xl px-4 text-sm font-semibold ${
              darkMode
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-white text-slate-800 hover:bg-slate-100'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={onPreviousMonth}
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100'
            }`}
            aria-label="Previous month"
            title="Previous month"
          >
            <ChevronLeftIcon className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-slate-700'}`} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100'
            }`}
            aria-label="Next month"
            title="Next month"
          >
            <ChevronRightIcon className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-slate-700'}`} />
          </button>
          <h2 className={`ml-2 text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{monthLabel}</h2>
        </div>

        <div className={`grid grid-cols-4 overflow-hidden rounded-xl p-1 text-sm ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {['Month', 'Week', 'Day', 'Agenda'].map((mode, index) => (
            <button
              key={mode}
              type="button"
              className={`rounded-lg px-3 py-1.5 ${
                index === 0 ? 'bg-violet-600 text-white' : darkMode ? 'text-slate-300' : 'text-slate-600'
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
