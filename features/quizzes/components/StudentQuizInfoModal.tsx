'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import type { StudentQuizInfoModalProps } from '@/features/quizzes/types';
import { useTheme } from '@/providers/ThemeProvider';

const formatDate = (date: Date | string | null) =>
  date ? new Date(date).toLocaleDateString() : 'No date';

export function StudentQuizInfoModal({
  quiz,
  isOpen,
  onClose,
  onStart,
}: StudentQuizInfoModalProps) {
  const { darkMode } = useTheme();
  const [isConfirmingStart, setIsConfirmingStart] = useState(false);

  if (!isOpen || !quiz) return null;

  const handleStart = () => {
    setIsConfirmingStart(false);
    onStart(quiz);
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm edusync-enter-fast">
      <ConfirmationModal
        isOpen={isConfirmingStart}
        message="Are you sure you want to start this quiz?"
        confirmLabel="Start"
        loadingLabel="Starting..."
        onCancel={() => setIsConfirmingStart(false)}
        onConfirm={handleStart}
      />

      <div className={`edusync-scale-in flex w-full max-w-lg flex-col overflow-hidden rounded-xl border shadow-2xl ${darkMode ? 'border-slate-700 bg-slate-900 shadow-black/40' : 'border-slate-200 bg-white shadow-slate-950/20'}`}>
        <div className={`flex items-start justify-between gap-4 border-b px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="min-w-0">
            <h2 className={`truncate text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {quiz.title}
            </h2>
            <p className={`mt-1 line-clamp-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {quiz.description || 'No description provided.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`edusync-button-motion rounded-lg p-2 transition ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-700 hover:bg-slate-100'}`}
            aria-label="Close quiz information"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 px-5 py-5 text-sm sm:grid-cols-2">
          <div className={`rounded-lg border p-3 ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
            <p className="text-xs font-semibold uppercase">Classroom</p>
            <p className="mt-1 font-bold">{quiz.classroomTitle ?? 'General quiz'}</p>
          </div>
          <div className={`rounded-lg border p-3 ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
            <p className="text-xs font-semibold uppercase">Questions</p>
            <p className="mt-1 font-bold">{quiz.questionCount}</p>
          </div>
          <div className={`rounded-lg border p-3 ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
            <p className="text-xs font-semibold uppercase">Time</p>
            <p className="mt-1 font-bold">{quiz.timeLimitMinutes} min</p>
          </div>
          <div className={`rounded-lg border p-3 ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
            <p className="text-xs font-semibold uppercase">Points</p>
            <p className="mt-1 font-bold">{quiz.totalPoints}</p>
          </div>
          <div className={`rounded-lg border p-3 ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
            <p className="text-xs font-semibold uppercase">Weight</p>
            <p className="mt-1 font-bold">{quiz.weight}</p>
          </div>
          <div className={`rounded-lg border p-3 ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
            <p className="text-xs font-semibold uppercase">Date</p>
            <p className="mt-1 font-bold">{formatDate(quiz.quizDate)}</p>
          </div>
        </div>

        <div className={`flex justify-end border-t px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            type="button"
            onClick={() => setIsConfirmingStart(true)}
            className="edusync-button-motion h-10 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
