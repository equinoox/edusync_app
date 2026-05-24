'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import type { ClassroomListItem } from '@/features/classrooms/types';
import type { CreateQuizInput } from '@/features/quizzes/types';
import { useTheme } from '@/providers/ThemeProvider';

type CreateQuizModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  classrooms: ClassroomListItem[];
  error?: string | null;
  onClose: () => void;
  onSubmit: (input: CreateQuizInput) => void;
};

const defaultFormState: CreateQuizInput = {
  title: '',
  description: '',
  weight: 0,
  timeLimitMinutes: 15,
  classroomId: null,
};

export function CreateQuizModal({
  isOpen,
  isSaving,
  classrooms,
  error,
  onClose,
  onSubmit,
}: CreateQuizModalProps) {
  const { darkMode } = useTheme();
  const [formState, setFormState] = useState<CreateQuizInput>(defaultFormState);
  const [quizScope, setQuizScope] = useState<'general' | 'classroom'>('general');

  useEffect(() => {
    if (isOpen) {
      setFormState(defaultFormState);
      setQuizScope('general');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...formState,
      title: formState.title.trim(),
      description: formState.description?.trim() ?? '',
      classroomId: quizScope === 'classroom' ? formState.classroomId : null,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl ${darkMode ? 'border-slate-700 bg-slate-900 shadow-black/40' : 'border-slate-500 bg-slate-300 shadow-slate-950/20'}`}
      >
        <div className={`flex items-center justify-between border-b px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-500'}`}>
          <div>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              Create Quiz
            </h2>
            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Set the quiz basics, then add questions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 transition ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-700 hover:bg-slate-400'}`}
            aria-label="Close create quiz modal"
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
              className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500' : 'border-slate-500 bg-slate-400 text-slate-950 placeholder:text-slate-600'}`}
              placeholder="Math Quiz"
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
              className={`min-h-24 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500' : 'border-slate-500 bg-slate-400 text-slate-950 placeholder:text-slate-600'}`}
              placeholder="Algebra and equations"
              maxLength={2000}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={`mb-2 block text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Weight
              </span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formState.weight}
                onChange={event => setFormState(previous => ({ ...previous, weight: Number(event.target.value) }))}
                className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-500 bg-slate-400 text-slate-950'}`}
                required
              />
            </label>
            <label className="block">
              <span className={`mb-2 block text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Time limit
              </span>
              <input
                type="number"
                min="1"
                value={formState.timeLimitMinutes}
                onChange={event => setFormState(previous => ({ ...previous, timeLimitMinutes: Number(event.target.value) }))}
                className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-500 bg-slate-400 text-slate-950'}`}
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(['general', 'classroom'] as const).map(scope => (
              <button
                key={scope}
                type="button"
                onClick={() => setQuizScope(scope)}
                className={`h-10 rounded-lg border text-sm font-bold capitalize transition ${quizScope === scope ? 'border-violet-500 bg-violet-600 text-white' : darkMode ? 'border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800' : 'border-slate-500 bg-slate-400 text-slate-800 hover:bg-slate-500'}`}
              >
                {scope}
              </button>
            ))}
          </div>

          {quizScope === 'classroom' && (
            <label className="block">
              <span className={`mb-2 block text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Classroom
              </span>
              <select
                value={formState.classroomId ?? ''}
                onChange={event => setFormState(previous => ({ ...previous, classroomId: event.target.value || null }))}
                className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-500 bg-slate-400 text-slate-950'}`}
                required
              >
                <option value="">Choose classroom</option>
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.title}
                  </option>
                ))}
              </select>
            </label>
          )}

          {error && (
            <p className={`rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-red-900/60 bg-red-950/50 text-red-200' : 'border-red-300 bg-red-100 text-red-700'}`}>
              {error}
            </p>
          )}
        </div>

        <div className={`flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end ${darkMode ? 'border-slate-800' : 'border-slate-500'}`}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className={`h-10 rounded-lg px-4 text-sm font-bold transition disabled:opacity-60 ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-400 text-slate-950 hover:bg-slate-500'}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="h-10 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            {isSaving ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}
