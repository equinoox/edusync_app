'use client';

import { useEffect, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import {
  startQuizAttemptAction,
  submitQuizAttemptAction,
} from '@/features/quizzes/actions/quiz-attempts.action';
import type { QuizAttempt, QuizForTaking, TakeQuizModalProps } from '@/features/quizzes/types';
import { useTheme } from '@/providers/ThemeProvider';

const getElapsedSeconds = (startedAt: Date | string) =>
  Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function TakeQuizModal({
  quiz,
  isOpen,
  onClose,
  onSubmitted,
  onToast,
}: TakeQuizModalProps) {
  const { darkMode } = useTheme();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [quizForTaking, setQuizForTaking] = useState<QuizForTaking | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingSubmit, setIsConfirmingSubmit] = useState(false);

  useEffect(() => {
    if (!isOpen || !quiz) return;

    let cancelled = false;

    const startAttempt = async () => {
      setIsLoading(true);
      const result = await startQuizAttemptAction({ quizId: quiz.id });
      setIsLoading(false);

      if (cancelled) return;

      if (typeof result === 'string') {
        onToast(result, 'error');
        onClose();
        return;
      }

      setAttempt(result.attempt as QuizAttempt);
      setQuizForTaking(result.quiz);
      setRemainingSeconds(
        Math.max(
          0,
          result.quiz.timeLimitMinutes * 60 - getElapsedSeconds(result.attempt.startedAt),
        ),
      );
    };

    void startAttempt();

    return () => {
      cancelled = true;
      setAttempt(null);
      setQuizForTaking(null);
      setSelectedOptions({});
      setIsConfirmingSubmit(false);
    };
  }, [isOpen, onClose, onToast, quiz]);

  useEffect(() => {
    if (!isOpen || !quizForTaking || !attempt) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds(current => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [attempt, isOpen, quizForTaking]);

  const allQuestionsAnswered = useMemo(() => {
    if (!quizForTaking) return false;
    return quizForTaking.questions.every(
      question => selectedOptions[question.id]?.length > 0,
    );
  }, [quizForTaking, selectedOptions]);

  if (!isOpen || !quiz) return null;

  const toggleOption = (questionId: string, optionId: string) => {
    setSelectedOptions(previous => {
      const currentSelection = previous[questionId] ?? [];
      const nextSelection = currentSelection.includes(optionId)
        ? currentSelection.filter(id => id !== optionId)
        : [...currentSelection, optionId];

      return {
        ...previous,
        [questionId]: nextSelection,
      };
    });
  };

  const handleSubmit = async () => {
    if (!attempt || !quizForTaking) return;

    if (remainingSeconds <= 0) {
      onToast('Time is up. This quiz can no longer be submitted.', 'error');
      setIsConfirmingSubmit(false);
      return;
    }

    if (!allQuestionsAnswered) {
      onToast('Answer every question before submitting', 'error');
      setIsConfirmingSubmit(false);
      return;
    }

    setIsSubmitting(true);
    const result = await submitQuizAttemptAction({
      attemptId: attempt.id,
      answers: quizForTaking.questions.map(question => ({
        questionId: question.id,
        selectedOptionIds: selectedOptions[question.id] ?? [],
      })),
    });
    setIsSubmitting(false);
    setIsConfirmingSubmit(false);

    if (typeof result === 'string') {
      onToast(result, 'error');
      return;
    }

    onToast('Quiz submitted', 'success');
    onSubmitted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm edusync-enter-fast">
      <ConfirmationModal
        isOpen={isConfirmingSubmit}
        isLoading={isSubmitting}
        message="Are you sure you want to submit this quiz?"
        loadingLabel="Submitting..."
        onCancel={() => setIsConfirmingSubmit(false)}
        onConfirm={handleSubmit}
      />

      <div className={`edusync-scale-in flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border shadow-2xl ${darkMode ? 'border-slate-700 bg-slate-900 shadow-black/40' : 'border-slate-200 bg-white shadow-slate-950/20'}`}>
        <div className={`flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="min-w-0">
            <h2 className={`truncate text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {quizForTaking?.title ?? quiz.title}
            </h2>
            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {quizForTaking?.description ?? quiz.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-lg px-3 py-2 text-sm font-bold ${remainingSeconds < 60 ? 'bg-red-500 text-white' : darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-500/15 text-violet-700'}`}>
              {formatTime(remainingSeconds)}
            </span>
            <button
              type="button"
              onClick={onClose}
              className={`edusync-button-motion rounded-lg p-2 transition ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-700 hover:bg-slate-100'}`}
              aria-label="Close quiz"
              title="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {isLoading || !quizForTaking ? (
            <div className="flex justify-center py-16">
              <span className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${darkMode ? 'border-violet-300' : 'border-violet-700'}`} />
            </div>
          ) : (
            <div className="space-y-4">
              {quizForTaking.questions.map((question, index) => (
                <section
                  key={question.id}
                  className={`edusync-enter-fast rounded-xl border p-4 ${darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-white'}`}
                  style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                      {question.sequenceNumber}. {question.content}
                    </h3>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-500/15 text-violet-700'}`}>
                      {question.points} pts
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {question.options.map(option => {
                      const isSelected = selectedOptions[question.id]?.includes(option.id);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleOption(question.id, option.id)}
                          className={`edusync-button-motion rounded-lg border px-3 py-3 text-left text-sm transition ${isSelected ? 'border-violet-500 bg-violet-600 text-white' : darkMode ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-200'}`}
                        >
                          <span className="font-bold uppercase">{option.label}.</span> {option.content}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className={`flex justify-end border-t px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            type="button"
            onClick={() => setIsConfirmingSubmit(true)}
            disabled={isLoading || !quizForTaking || remainingSeconds <= 0}
            className="edusync-button-motion h-10 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Finish Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
