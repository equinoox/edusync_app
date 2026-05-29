'use client';

import { CalendarEventCard } from '@/features/calendar/components/CalendarEventCard';
import type { CalendarDayCellProps } from '@/features/calendar/types';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export function CalendarDayCell({
  day,
  onSelectEvent,
  onViewDayEvents,
  animationDelayMs = 0,
}: CalendarDayCellProps) {
  const { darkMode } = useTheme();
  const visibleEvents = day.events.slice(0, 2);
  const hiddenCount = day.events.length - visibleEvents.length;

  return (
    <div
      className={cn(
        'edusync-enter-fast min-h-[7.25rem] border-r border-t p-2.5 last:border-r-0 transition-colors duration-200',
        darkMode ? 'border-slate-800' : 'border-slate-500',
        day.isCurrentMonth
          ? darkMode
            ? 'bg-slate-950/20'
            : 'bg-slate-300'
          : darkMode
            ? 'bg-slate-950/40 text-slate-600'
            : 'bg-slate-400/60 text-slate-600',
      )}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div
        className={cn(
          'mb-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
          day.isToday
            ? 'bg-violet-600 text-white edusync-scale-in shadow-lg shadow-violet-950/30'
            : day.isCurrentMonth
              ? darkMode
                ? 'text-white'
                : 'text-slate-950'
              : 'text-slate-500',
        )}
      >
        {day.date.getDate()}
      </div>

      <div className="space-y-1.5">
        {visibleEvents.map(event => (
          <CalendarEventCard
            key={event.id}
            event={event}
            compact
            onSelect={onSelectEvent}
          />
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => onViewDayEvents(day)}
            className="edusync-button-motion text-xs font-semibold text-violet-400"
          >
            + {hiddenCount} more
          </button>
        )}
      </div>
    </div>
  );
}
