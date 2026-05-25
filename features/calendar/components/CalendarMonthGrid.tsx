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
      className={`overflow-hidden rounded-xl border shadow-md ${
        darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-500 bg-slate-300'
      }`}
    >
      <div
        className={`grid grid-cols-7 border-b ${
          darkMode ? 'border-slate-800' : 'border-slate-500'
        }`}
      >
        {weekdays.map(day => (
          <div
            key={day}
            className={`px-3 py-4 text-center text-sm font-bold ${
              darkMode ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map(day => (
          <CalendarDayCell
            key={day.date.toISOString()}
            day={day}
            onSelectEvent={onSelectEvent}
            onViewDayEvents={onViewDayEvents}
          />
        ))}
      </div>
    </section>
  );
}
