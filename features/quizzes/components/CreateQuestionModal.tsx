'use client';

import { useState, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { addQuestionToQuizAction } from '@/features/quizzes/actions/quizzes.action';
import { addQuestionToQuizSchema } from '@/features/quizzes/schemas';
import type {
  CreateQuestionModalProps,
  QuizOptionDraft,
  QuizOptionLabel,
} from '@/features/quizzes/types';
import { parseSchemaOrThrow } from '@/lib/validation/zod';
import { useTheme } from '@/providers/ThemeProvider';

const optionLabels: QuizOptionLabel[] = ['a', 'b', 'c', 'd', 'e'];

const createDefaultOptions = (): QuizOptionDraft[] =>
  optionLabels.map(label => ({ label, content: '', isCorrect: false }));

export function CreateQuestionModal({
  quiz,
  isOpen,
  onClose,
  onQuestionAdded,
  onToast,
}: CreateQuestionModalProps) {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [points, setPoints] = useState(1);
  const [hasNegativePoints, setHasNegativePoints] = useState(false);
  const [options, setOptions] = useState<QuizOptionDraft[]>(createDefaultOptions);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidatingDone, setIsValidatingDone] = useState(false);

  if (!isOpen || !quiz) return null;

  const resetForm = () => {
    setContent('');
    setPoints(1);
    setHasNegativePoints(false);
    setOptions(createDefaultOptions());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedOptions = options
      .map(option => ({ ...option, content: option.content.trim() }))
      .filter(option => option.content.length > 0);
    const trimmedContent = content.trim();
    const numericPoints = Number(points);

    if (options.some(option => option.isCorrect && !option.content.trim())) {
      onToast('Correct answers cannot be empty', 'error');
      return;
    }

    let input;
    try {
      input = parseSchemaOrThrow(addQuestionToQuizSchema, {
        quizId: quiz.id,
        content: trimmedContent,
        points: numericPoints,
        hasNegativePoints,
        options: preparedOptions,
      });
    } catch (validationError) {
      onToast(
        validationError instanceof Error
          ? validationError.message
          : 'Question data is invalid',
        'error',
      );
      return;
    }

    setIsSaving(true);
    const result = await addQuestionToQuizAction(input);
    setIsSaving(false);

    if (typeof result === 'string') {
      onToast(result, 'error');
      return;
    }

    onToast('Question added', 'success');
    resetForm();
    onQuestionAdded();
  };

  const handleDone = async () => {
    if (isSaving || isValidatingDone) return;

    setIsValidatingDone(true);

    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/validate`, {
        method: 'POST',
      });
      const result = await response.json();

      if (!response.ok) {
        onToast(result.error ?? 'Quiz is not ready yet', 'error', response.status);
        return;
      }

      onClose();
    } catch (error) {
      onToast(
        error instanceof Error ? error.message : 'Quiz is not ready yet',
        'error',
      );
    } finally {
      setIsValidatingDone(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm edusync-enter-fast">
      <form
        onSubmit={handleSubmit}
        className={`edusync-scale-in flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border shadow-2xl ${darkMode ? 'border-slate-700 bg-slate-900 shadow-black/40' : 'border-slate-200 bg-white shadow-slate-950/20'}`}
      >
        <div className={`flex shrink-0 items-center justify-between border-b px-5 py-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              Add Questions
            </h2>
            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {quiz.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`edusync-button-motion rounded-lg p-2 transition ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-700 hover:bg-slate-100'}`}
            aria-label="Close question modal"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Question
            </span>
            <textarea
              value={content}
              onChange={event => setContent(event.target.value)}
              className={`min-h-24 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-950 placeholder:text-slate-600'}`}
              placeholder="What is the result of..."
              required
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={`mb-2 block text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Points
              </span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={points}
                onChange={event => setPoints(Number(event.target.value))}
                className={`h-11 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-950'}`}
                required
              />
            </label>
            <label className={`mt-7 flex h-11 items-center gap-3 rounded-lg border px-3 text-sm font-semibold ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-200' : 'border-slate-200 bg-white text-slate-800'}`}>
              <input
                type="checkbox"
                checked={hasNegativePoints}
                onChange={event => setHasNegativePoints(event.target.checked)}
                className="h-4 w-4 accent-violet-600"
              />
              Negative points
            </label>
          </div>

          <div className="space-y-3">
            <p className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Options
            </p>
            {options.map((option, index) => (
              <div
                key={option.label}
                className="edusync-enter-fast flex items-center gap-2"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold uppercase ${darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-500/15 text-violet-700'}`}>
                  {option.label}
                </span>
                <input
                  value={option.content}
                  onChange={event =>
                    setOptions(previous =>
                      previous.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, content: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className={`h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-950 placeholder:text-slate-600'}`}
                  placeholder={`Option ${option.label.toUpperCase()}`}
                />
                <label className={`flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-bold ${darkMode ? 'border-slate-700 bg-slate-950 text-slate-200' : 'border-slate-200 bg-white text-slate-800'}`}>
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={event =>
                      setOptions(previous =>
                        previous.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, isCorrect: event.target.checked }
                            : item,
                        ),
                      )
                    }
                    className="h-4 w-4 accent-violet-600"
                  />
                  Correct
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={`flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            type="button"
            onClick={handleDone}
            disabled={isSaving || isValidatingDone}
            className={`edusync-button-motion h-10 rounded-lg px-4 text-sm font-bold transition ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
          >
            {isValidatingDone ? 'Checking...' : 'Done'}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="edusync-button-motion h-10 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            {isSaving ? 'Adding...' : 'Add Question'}
          </button>
        </div>
      </form>
    </div>
  );
}
