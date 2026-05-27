'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import type {
  CreateCalendarEventInput,
  CreateCalendarEventModalProps,
} from '@/features/calendar/types';
import { useTheme } from '@/providers/ThemeProvider';

const toInputDate = (date: Date | string) =>
  new Date(date).toISOString().slice(0, 10);

const defaultFormState: CreateCalendarEventInput = {
  title: '',
  description: '',
  date: toInputDate(new Date()),
};

export function CreateCalendarEventModal({
  isOpen,
  isSaving,
  initialEvent,
  onClose,
  onSubmit,
}: CreateCalendarEventModalProps) {
  const { darkMode } = useTheme();
  const [formState, setFormState] =
    useState<CreateCalendarEventInput>(defaultFormState);

  useEffect(() => {
    if (!isOpen) return;

    setFormState(
      initialEvent
        ? {
            title: initialEvent.title,
            description: initialEvent.description,
            date: toInputDate(initialEvent.date),
          }
        : defaultFormState,
    );
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      title: formState.title.trim(),
      description: formState.description.trim(),
      date: formState.date,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm edusync-enter-fast">
      <form
        onSubmit={handleSubmit}
        className={`edusync-scale-in w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl ${
          darkMode
            ? 'border-slate-700 bg-slate-900 shadow-black/40'
            : 'border-slate-500 bg-slate-300 shadow-slate-950/20'
        }`}
      >
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${
            darkMode ? 'border-slate-800' : 'border-slate-500'
          }`}
        >
          <div>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {initialEvent ? 'Edit Event' : 'Add Event'}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Create a simple one-day calendar note.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`edusync-button-motion rounded-lg p-2 transition ${
              darkMode
                ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                : 'text-slate-700 hover:bg-slate-400'
            }`}
            aria-label="Close event modal"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Title
            </span>
            <input
              value={formState.title}
              onChange={event => setFormState(previous => ({ ...previous, title: event.target.value }))}
              className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${
                darkMode
                  ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500'
                  : 'border-slate-500 bg-slate-400 text-slate-950 placeholder:text-slate-600'
              }`}
              placeholder="Study group"
              maxLength={255}
              required
            />
          </label>

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Description
            </span>
            <textarea
              value={formState.description}
              onChange={event => setFormState(previous => ({ ...previous, description: event.target.value }))}
              className={`min-h-24 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${
                darkMode
                  ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500'
                  : 'border-slate-500 bg-slate-400 text-slate-950 placeholder:text-slate-600'
              }`}
              placeholder="What should you remember?"
              maxLength={2000}
            />
          </label>

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Date
            </span>
            <input
              type="date"
              value={formState.date}
              onChange={event => setFormState(previous => ({ ...previous, date: event.target.value }))}
              className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${
                darkMode
                  ? 'border-slate-700 bg-slate-950 text-white'
                  : 'border-slate-500 bg-slate-400 text-slate-950'
              }`}
              required
            />
          </label>
        </div>

        <div
          className={`flex justify-end gap-2 border-t px-5 py-4 ${
            darkMode ? 'border-slate-800' : 'border-slate-500'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className={`edusync-button-motion h-10 rounded-lg px-4 text-sm font-bold transition disabled:opacity-60 ${
              darkMode
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-400 text-slate-950 hover:bg-slate-500'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="edusync-button-motion h-10 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : initialEvent ? 'Save Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
