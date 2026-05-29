'use client';

import { CalendarDayCell } from '@/features/calendar/components/CalendarDayCell';
import type { CalendarMonthGridProps } from '@/features/calendar/types';
import { useTheme } from '@/providers/ThemeProvider';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarMonthGrid({
  days,
  onSelectEvent,
  onViewDayEvents,
}: CalendarMonthGridProps) {
  const { darkMode } = useTheme();

  return (
    <section
      className={`edusync-enter overflow-hidden rounded-xl border shadow-md ${
        darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
      }`}
    >
      <div
        className={`grid grid-cols-7 border-b ${
          darkMode ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        {weekdays.map(day => (
          <div
            key={day}
            className={`px-2 py-3 text-center text-sm font-bold ${
              darkMode ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <CalendarDayCell
            key={day.date.toISOString()}
            day={day}
            animationDelayMs={Math.min(index, 13) * 12}
            onSelectEvent={onSelectEvent}
            onViewDayEvents={onViewDayEvents}
          />
        ))}
      </div>
    </section>
  );
}
