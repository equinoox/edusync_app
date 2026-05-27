'use client';

import { useEffect, useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

import type { QuizListItem } from '@/features/quizzes/types';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

type UpcomingPanelProps = {
  classroomId?: string;
  viewerRole?: 'student' | 'professor';
  onError?: (message: string) => void;
  items?: Array<{
    id: string;
    label: string;
    title: string;
    date: string;
    tone: {
      light: string;
      darkClass: string;
    };
  }>;
};

const formatQuizDate = (value: Date | string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date';

const defaultItems = [
  {
    id: 'planning',
    label: 'NEW',
    title: 'Create material plan',
    date: 'No due date',
    tone: {
      light: 'bg-violet-500/15 text-violet-500',
      darkClass: 'bg-violet-500/20 text-violet-300',
    },
  },
  {
    id: 'materials',
    label: 'PDF',
    title: 'Attach class material',
    date: 'Ready when you are',
    tone: {
      light: 'bg-emerald-500/15 text-emerald-500',
      darkClass: 'bg-emerald-500/20 text-emerald-300',
    },
  },
];

export function UpcomingPanel({
  classroomId,
  viewerRole,
  onError,
  items = defaultItems,
}: UpcomingPanelProps) {
  const { darkMode } = useTheme();
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!classroomId) return;

    let isActive = true;

    const loadUpcomingQuizzes = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/classrooms/${classroomId}/upcoming-quizzes`,
          { cache: 'no-store' },
        );
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
          onError?.(
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
  }, [classroomId, onError]);

  const isClassroomMode = Boolean(classroomId);

  return (
    <aside className={`rounded-xl border p-5 shadow-md ${darkMode ? "border-white/5 bg-slate-800" : "border-slate-200/70 bg-slate-400"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className={`h-5 w-5 ${darkMode ? "text-violet-300" : "text-violet-500"}`} />
          <h2 className={`font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>
            {isClassroomMode ? 'Upcoming Quizzes' : 'Upcoming'}
          </h2>
        </div>
        {isClassroomMode ? (
          <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-700"}`}>
            {isLoading ? 'Loading' : quizzes.length}
          </span>
        ) : (
          <span className={`text-sm font-medium ${darkMode ? "text-violet-300" : "text-violet-600"}`}>
            View Calendar
          </span>
        )}
      </div>

      <div className={`mt-5 divide-y ${darkMode ? "divide-white/5" : "divide-slate-200/70"}`}>
        {isClassroomMode ? (
          isLoading ? (
            <div className="grid min-h-24 place-items-center">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            </div>
          ) : quizzes.length === 0 ? (
            <p className={`py-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              No upcoming quizzes with assigned dates.
            </p>
          ) : (
            quizzes.map(quiz => (
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
          )
        ) : (
          items.map(item => (
          <div key={item.id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${darkMode ? item.tone.darkClass : item.tone.light}`}>
              {item.label}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`line-clamp-1 text-sm font-semibold ${darkMode ? "text-white" : "text-slate-950"}`}>
                {item.title}
              </p>
              <p className={`text-xs ${darkMode ? "text-violet-300" : "text-violet-500"}`}>{item.date}</p>
            </div>
          </div>
          ))
        )}
      </div>
    </aside>
  );
}
