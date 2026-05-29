'use client';

import { useState } from 'react';

import { useTheme } from '@/providers/ThemeProvider';
import type { RoleSelectionModalProps, UserRole } from '@/features/auth/types';

export function RoleSelectionModal({
  isSubmitting,
  error,
  onSelectRole,
}: RoleSelectionModalProps) {
  const { darkMode } = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [professorKey, setProfessorKey] = useState('');

  const handleStudentSelect = async () => {
    setSelectedRole('student');
    await onSelectRole('student');
  };

  const handleProfessorSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSelectRole('professor', professorKey);
  };

  return (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center px-4 edusync-enter-fast ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div
        className={`edusync-scale-in w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
          darkMode
            ? 'border-slate-700 bg-slate-900 text-white'
            : 'border-indigo-100 bg-white text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-selection-title"
      >
        <div className="mb-6 text-center">
          <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-extrabold shadow-md ${darkMode ? 'bg-violet-600' : 'bg-indigo-600'} text-white`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <h1 id="role-selection-title" className="text-2xl font-bold">
            How would you like to continue?
          </h1>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={handleStudentSelect}
            disabled={isSubmitting}
            className={`edusync-button-motion rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              selectedRole === 'student'
                ? darkMode
                  ? 'border-violet-500 bg-violet-950 text-violet-100'
                  : 'border-indigo-500 bg-indigo-50 text-indigo-900'
                : darkMode
                  ? 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <span className="block text-sm font-semibold">Student</span>
            <span className={darkMode ? 'text-xs text-slate-300' : 'text-xs text-slate-500'}>
              Learn with AI assistance and uploaded study materials.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('professor')}
            disabled={isSubmitting}
            className={`edusync-button-motion rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              selectedRole === 'professor'
                ? darkMode
                  ? 'border-orange-500 bg-orange-950/40 text-orange-100'
                  : 'border-orange-500 bg-orange-50 text-orange-900'
                : darkMode
                  ? 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <span className="block text-sm font-semibold">Professor</span>
            <span className={darkMode ? 'text-xs text-slate-300' : 'text-xs text-slate-500'}>
              Continue with instructor access after key verification.
            </span>
          </button>
        </div>

        {selectedRole === 'professor' && (
          <form onSubmit={handleProfessorSubmit} className="mt-5 space-y-3">
            <label className="block text-sm font-semibold" htmlFor="professor-key">
              Professor master key
            </label>
            <input
              id="professor-key"
              type="password"
              value={professorKey}
              onChange={event => setProfessorKey(event.currentTarget.value)}
              disabled={isSubmitting}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                darkMode
                  ? 'border-slate-700 bg-slate-800 text-white focus:border-orange-500 focus:ring-orange-500/20'
                  : 'border-slate-200 bg-white text-slate-900 focus:border-orange-500 focus:ring-orange-500/20'
              }`}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isSubmitting || professorKey.trim().length === 0}
              className="edusync-button-motion inline-flex h-10 w-full items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-semibold text-black transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Checking...' : 'Continue as Professor'}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
