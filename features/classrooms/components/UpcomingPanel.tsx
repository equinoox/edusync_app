'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

import { ViewAllModal } from '@/components/shared/ViewAllModal';
import type { UpcomingPanelProps } from '@/features/classrooms/types';
import type { QuizListItem } from '@/features/quizzes/types';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

const formatQuizDate = (value: Date | string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date';

export function UpcomingPanel({
  classroomId,
  viewerRole,
  onError,
}: UpcomingPanelProps) {
  const { darkMode } = useTheme();
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let isActive = true;
    const endpoint = classroomId
      ? `/api/classrooms/${classroomId}/upcoming-quizzes`
      : '/api/quizzes/upcoming';

    const loadUpcomingQuizzes = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(endpoint, { cache: 'no-store' });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? 'Unable to load upcoming quizzes');
        }

        if (isActive) {
          setQuizzes(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        if (isActive) {
          setQuizzes([]);
          onErrorRef.current?.(
            error instanceof Error
              ? error.message
              : 'Unable to load upcoming quizzes',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadUpcomingQuizzes();

    return () => {
      isActive = false;
    };
  }, [classroomId]);

  const isClassroomMode = Boolean(classroomId);
  const visibleQuizzes = quizzes.slice(0, 2);

  return (
    <>
      <ViewAllModal
        isOpen={isViewAllOpen}
        title="All Upcoming Quizzes"
        items={quizzes}
        emptyMessage="No upcoming quizzes with assigned future dates."
        onClose={() => setIsViewAllOpen(false)}
        renderItem={quiz => (
          <div className={`flex items-center gap-3 rounded-xl border p-4 ${darkMode ? 'border-white/5 bg-slate-800' : 'border-slate-300 bg-slate-200'}`}>
            <span
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                darkMode
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'bg-violet-500/15 text-violet-700',
              )}
            >
              QZ
            </span>
            <div className="min-w-0 flex-1">
              <p className={`line-clamp-1 text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                {quiz.title}
              </p>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                {formatQuizDate(quiz.quizDate)} - {quiz.timeLimitMinutes} min - {quiz.totalPoints} pts
                {typeof quiz.weight === 'number' ? ` - weight ${quiz.weight}` : ''}
              </p>
            </div>
            {viewerRole && (
              <a
                href={`/quizzes?${viewerRole === 'student' ? 'take' : 'quizId'}=${quiz.id}`}
                className="shrink-0 text-xs font-semibold text-violet-400 transition hover:text-violet-300"
              >
                {viewerRole === 'student' ? 'Take' : 'Manage'}
              </a>
            )}
          </div>
        )}
      />
      <aside className={`rounded-xl border p-5 shadow-md ${darkMode ? "border-white/5 bg-slate-800" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className={`h-5 w-5 ${darkMode ? "text-violet-300" : "text-violet-500"}`} />
          <h2 className={`font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>
            {isClassroomMode ? 'Upcoming Quizzes' : 'Upcoming'}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-700"}`}>
            {isLoading ? 'Loading' : quizzes.length}
          </span>
          {quizzes.length > 2 && (
            <button
              type="button"
              onClick={() => setIsViewAllOpen(true)}
              className={`text-sm font-medium transition hover:opacity-75 ${darkMode ? "text-violet-300" : "text-violet-600"}`}
            >
              View all
            </button>
          )}
          {!isClassroomMode && (
            <Link
              href="/calendar"
              className={`text-sm font-medium transition hover:opacity-75 ${darkMode ? "text-violet-300" : "text-violet-600"}`}
            >
              Calendar
            </Link>
          )}
        </div>
      </div>

      <div className={`mt-5 divide-y ${darkMode ? "divide-white/5" : "divide-slate-200/70"}`}>
        {isLoading ? (
          <div className="grid min-h-24 place-items-center">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          </div>
        ) : quizzes.length === 0 ? (
          <p className={`py-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            No upcoming quizzes with assigned future dates.
          </p>
        ) : (
          visibleQuizzes.map(quiz => (
              <div key={quiz.id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                    darkMode
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'bg-violet-500/15 text-violet-700',
                  )}
                >
                  QZ
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`line-clamp-1 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-950"}`}>
                    {quiz.title}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-700"}`}>
                    {formatQuizDate(quiz.quizDate)} - {quiz.timeLimitMinutes} min - {quiz.totalPoints} pts
                    {typeof quiz.weight === 'number' ? ` - weight ${quiz.weight}` : ''}
                  </p>
                </div>
                {viewerRole && (
                  <a
                    href={`/quizzes?${viewerRole === 'student' ? 'take' : 'quizId'}=${quiz.id}`}
                    className="shrink-0 text-xs font-semibold text-violet-400 transition hover:text-violet-300"
                  >
                    {viewerRole === 'student' ? 'Take' : 'Manage'}
                  </a>
                )}
              </div>
            ))
          )}
      </div>
      </aside>
    </>
  );
}
