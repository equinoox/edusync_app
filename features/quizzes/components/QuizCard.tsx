'use client';

import {
  CalendarDaysIcon,
  DocumentCheckIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

import { QuizActionsMenu } from '@/features/quizzes/components/QuizActionsMenu';
import type { QuizCardProps } from '@/features/quizzes/types';
import { useTheme } from '@/providers/ThemeProvider';

const formatPoints = (points: number) =>
  Number.isInteger(points) ? String(points) : points.toFixed(1);

const formatQuizDate = (date: Date | string | null) =>
  date
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(date))
    : null;

export function QuizCard({
  quiz,
  isProfessor,
  onManage,
  onTake,
  onDelete,
  animationDelayMs = 0,
}: QuizCardProps) {
  const { darkMode } = useTheme();
  const completedAttempt = quiz.attempt?.status === 'submitted' ? quiz.attempt : null;
  const expiredAttempt = quiz.attempt?.status === 'expired' ? quiz.attempt : null;
  const inProgressAttempt = quiz.attempt?.status === 'in_progress' ? quiz.attempt : null;
  const quizDateLabel = formatQuizDate(quiz.quizDate);

  return (
    <div
      className={`edusync-enter-fast grid min-w-[760px] grid-cols-[minmax(200px,1.7fr)_minmax(160px,1.15fr)_90px_110px_105px_95px_40px] items-center gap-3 border-b px-4 py-3 transition last:border-b-0 ${
        darkMode
          ? 'border-white/5 hover:bg-slate-800/80'
          : 'border-slate-200 hover:bg-slate-50'
      }`}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <button
        type="button"
        onClick={() => (isProfessor ? onManage(quiz) : onTake(quiz))}
        disabled={!isProfessor && Boolean(completedAttempt || expiredAttempt)}
        className="edusync-button-motion flex min-w-0 items-center gap-3 text-left disabled:cursor-not-allowed"
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold uppercase ${darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-500/15 text-violet-700'}`}>
          {quiz.title.slice(0, 4)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`line-clamp-1 text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
            {quiz.title}
          </h3>
          <p className={`mt-1 line-clamp-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            {quiz.description || 'No description provided.'}
          </p>
          {quizDateLabel && (
            <p className={`mt-1 flex items-center gap-1 text-xs ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              {quizDateLabel}
            </p>
          )}
        </div>
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${quiz.classroomId ? (darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-500/15 text-orange-700') : (darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/15 text-emerald-700')}`}>
          <DocumentCheckIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className={`truncate text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
            {quiz.classroomId ? quiz.classroomTitle ?? 'Classroom' : 'General Quiz'}
          </p>
          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-700'}`}>
            {quiz.classroomId ? 'Classroom' : 'Open access'}
          </p>
        </div>
      </div>

      <div className={`text-center text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
        {quiz.questionCount}
      </div>

      <div className={`text-center text-sm ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
        <p>{quiz.timeLimitMinutes} min</p>
        <p className={darkMode ? 'text-violet-300' : 'text-violet-700'}>
          {formatPoints(quiz.totalPoints)} pts
        </p>
      </div>

      <div className="flex justify-center">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
          completedAttempt
            ? darkMode
              ? 'bg-green-500/20 text-green-300'
              : 'bg-green-500/15 text-green-700'
            : expiredAttempt
              ? darkMode
                ? 'bg-red-500/20 text-red-300'
                : 'bg-red-500/15 text-red-700'
              : inProgressAttempt
                ? darkMode
                  ? 'bg-orange-500/20 text-orange-300'
                  : 'bg-orange-500/15 text-orange-700'
                : darkMode
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'bg-violet-500/15 text-violet-700'
        }`}>
          {completedAttempt
            ? 'Completed'
            : expiredAttempt
              ? 'Expired'
              : inProgressAttempt
                ? 'Started'
                : isProfessor
                  ? 'Draft'
                  : 'Upcoming'}
        </span>
      </div>

      <div className={`flex justify-center text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
        {completedAttempt ? (
          <span className={`inline-flex items-center gap-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
            <TrophyIcon className="h-4 w-4" />
            {formatPoints(completedAttempt.score)}/{formatPoints(completedAttempt.maxScore)}
          </span>
        ) : (
          '-'
        )}
      </div>

      <div className="flex justify-center">
        <QuizActionsMenu
          canDelete={isProfessor}
          quizTitle={quiz.title}
          onDelete={() => onDelete(quiz)}
        />
      </div>
    </div>
  );
}
