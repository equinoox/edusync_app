'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import {
  deleteQuestionAction,
  getQuizForEditingAction,
} from '@/features/quizzes/actions/quizzes.action';
import type { QuizForEditing, QuizListItem, QuizQuestion } from '@/features/quizzes/types';
import { useTheme } from '@/providers/ThemeProvider';

type QuizDetailsModalProps = {
  quiz: QuizListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (quiz: QuizListItem) => void;
  onChanged?: () => void;
  onToast: (message: string, tone?: 'success' | 'error' | 'info') => void;
};

export function QuizDetailsModal({
  quiz,
  isOpen,
  onClose,
  onAddQuestion,
  onChanged,
  onToast,
}: QuizDetailsModalProps) {
  const { darkMode } = useTheme();
  const [details, setDetails] = useState<QuizForEditing | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<QuizQuestion | null>(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadDetails = useCallback(() => {
    if (!quiz) return;

    startTransition(async () => {
      const result = await getQuizForEditingAction(quiz.id);

      if (typeof result === 'string') {
        onToast(result, 'error');
        onClose();
        return;
      }

      setDetails(result);
    });
  }, [onClose, onToast, quiz]);

  useEffect(() => {
    if (!isOpen) {
      setDetails(null);
      return;
    }

    loadDetails();
  }, [isOpen, loadDetails]);

  if (!isOpen || !quiz) return null;

  const activeQuiz = details ?? quiz;

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;

    setIsDeletingQuestion(true);
    const result = await deleteQuestionAction(questionToDelete.id);
    setIsDeletingQuestion(false);

    if (typeof result === 'string') {
      onToast(result, 'error');
      return;
    }

    setQuestionToDelete(null);
    onToast('Question deleted', 'success');
    loadDetails();
    onChanged?.();
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <ConfirmationModal
        isOpen={Boolean(questionToDelete)}
        isLoading={isDeletingQuestion}
        message="Are you sure you want to delete this question?"
        loadingLabel="Deleting..."
        onCancel={() => setQuestionToDelete(null)}
        onConfirm={handleDeleteQuestion}
      />
      <div className={`flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border shadow-2xl ${darkMode ? 'border-slate-700 bg-slate-900 shadow-black/40' : 'border-slate-500 bg-slate-300 shadow-slate-950/20'}`}>
        <div className={`flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-500'}`}>
          <div className="min-w-0">
            <h2 className={`truncate text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {activeQuiz.title}
            </h2>
            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {activeQuiz.description || 'No description provided.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 transition ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-700 hover:bg-slate-400'}`}
            aria-label="Close quiz details"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className={`mb-4 grid gap-3 rounded-xl border p-3 text-sm ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-500 bg-slate-400 text-slate-800'} sm:grid-cols-4`}>
            <span>{Number(activeQuiz.totalPoints).toFixed(1)} pts</span>
            <span>Weight {Number(activeQuiz.weight).toFixed(1)}</span>
            <span>{activeQuiz.timeLimitMinutes} min</span>
            <span>{details?.questions.length ?? 0} questions</span>
          </div>

          {isPending && !details ? (
            <div className="flex justify-center py-10">
              <span className={`h-7 w-7 animate-spin rounded-full border-2 border-t-transparent ${darkMode ? 'border-violet-300' : 'border-violet-700'}`} />
            </div>
          ) : details?.questions.length ? (
            <div className="space-y-3">
              {details.questions.map(question => (
                <div key={question.id} className={`rounded-xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-500 bg-slate-400'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                      {question.sequenceNumber}. {question.content}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-500/15 text-violet-700'}`}>
                        {question.points} pts
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuestionToDelete(question)}
                        className={`rounded-lg p-2 transition ${darkMode ? 'text-red-200 hover:bg-red-950' : 'text-red-700 hover:bg-red-200'}`}
                        aria-label="Delete question"
                        title="Delete question"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map(option => (
                      <div key={option.id} className={`rounded-lg px-3 py-2 text-sm ${option.isCorrect ? (darkMode ? 'bg-green-500/20 text-green-200' : 'bg-green-500/15 text-green-800') : (darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-300 text-slate-800')}`}>
                        <span className="font-bold uppercase">{option.label}.</span> {option.content}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`rounded-xl border border-dashed px-4 py-10 text-center text-sm ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-500 bg-slate-400 text-slate-700'}`}>
              No questions yet. Add the first one to make this quiz usable.
            </p>
          )}
        </div>

        <div className={`flex justify-end border-t px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-500'}`}>
          <button
            type="button"
            onClick={() => onAddQuestion(activeQuiz)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
