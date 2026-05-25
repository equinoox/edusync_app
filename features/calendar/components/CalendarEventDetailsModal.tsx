'use client';

import {
  AcademicCapIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  PlayIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import type { CalendarEventDetailsModalProps } from '@/features/calendar/types';
import { useTheme } from '@/providers/ThemeProvider';

export function CalendarEventDetailsModal({
  event,
  isSaving,
  onClose,
  onEdit,
  onDelete,
  onTakeQuiz,
}: CalendarEventDetailsModalProps) {
  const { darkMode } = useTheme();

  if (!event) return null;

  const isQuiz = event.eventType === 'quiz';
  const Icon = isQuiz ? AcademicCapIcon : CalendarDaysIcon;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <section
        className={`w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl ${
          darkMode
            ? 'border-slate-700 bg-slate-900 shadow-black/40'
            : 'border-slate-500 bg-slate-300 shadow-slate-950/20'
        }`}
      >
        <div
          className={`flex items-start justify-between border-b px-5 py-4 ${
            darkMode ? 'border-slate-800' : 'border-slate-500'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600/25 text-violet-300">
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2 className={`truncate text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                {event.title}
              </h2>
              <p className={darkMode ? 'text-sm text-slate-300' : 'text-sm text-slate-700'}>
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 transition ${
              darkMode
                ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                : 'text-slate-700 hover:bg-slate-400'
            }`}
            aria-label="Close event details"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <p className={`rounded-xl border p-4 text-sm ${
            darkMode
              ? 'border-slate-700 bg-slate-950 text-slate-300'
              : 'border-slate-500 bg-slate-400 text-slate-800'
          }`}>
            {event.description || (isQuiz ? 'Quiz calendar event.' : 'No description provided.')}
          </p>

          {isQuiz && (
            <div className={`rounded-xl border p-4 text-sm ${
              darkMode
                ? 'border-slate-700 bg-slate-950 text-slate-300'
                : 'border-slate-500 bg-slate-400 text-slate-800'
            }`}>
              <p className="font-semibold">
                {event.classroomTitle ?? 'General quiz'}
              </p>
              <p className="mt-1 text-xs">
                Quiz can be started only on its assigned date.
              </p>
            </div>
          )}
        </div>

        <div
          className={`flex flex-wrap justify-end gap-2 border-t px-5 py-4 ${
            darkMode ? 'border-slate-800' : 'border-slate-500'
          }`}
        >
          {event.canManage && (
            <>
              <button
                type="button"
                onClick={() => onDelete(event)}
                disabled={isSaving}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
              <button
                type="button"
                onClick={() => onEdit(event)}
                disabled={isSaving}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Edit
              </button>
            </>
          )}
          {event.canTakeQuiz && (
            <button
              type="button"
              onClick={() => onTakeQuiz(event)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700"
            >
              <PlayIcon className="h-4 w-4" />
              Take Quiz
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
