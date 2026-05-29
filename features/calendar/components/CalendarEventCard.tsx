'use client';

import { AcademicCapIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

import type { CalendarEventCardProps } from '@/features/calendar/types';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export function CalendarEventCard({
  event,
  compact = false,
  onSelect,
}: CalendarEventCardProps) {
  const { darkMode } = useTheme();
  const isQuiz = event.eventType === 'quiz';
  const Icon = isQuiz ? AcademicCapIcon : CalendarDaysIcon;

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={cn(
        'edusync-enter-fast edusync-card-motion w-full rounded-lg border p-2 text-left transition',
        darkMode
          ? 'border-white/5 bg-slate-800/80 hover:bg-slate-700'
          : 'border-slate-200 bg-white hover:bg-slate-50',
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className={cn(
            'mt-1 h-2 w-2 shrink-0 rounded-full',
            isQuiz ? 'bg-orange-400' : 'bg-violet-500',
          )}
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate font-semibold',
              compact ? 'text-[11px]' : 'text-sm',
              darkMode ? 'text-white' : 'text-slate-950',
            )}
          >
            {event.title}
          </p>
          {!compact && (
            <p className={darkMode ? 'text-xs text-slate-300' : 'text-xs text-slate-700'}>
              {isQuiz
                ? event.classroomTitle ?? 'General quiz'
                : event.description || 'Custom event'}
            </p>
          )}
        </div>
        {!compact && <Icon className="h-4 w-4 shrink-0 text-violet-300" />}
      </div>
    </button>
  );
}
