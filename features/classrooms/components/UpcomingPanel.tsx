'use client';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';

type UpcomingPanelProps = {
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

const defaultItems = [
  {
    id: 'planning',
    label: 'NEW',
    title: 'Create lesson plan',
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

export function UpcomingPanel({ items = defaultItems }: UpcomingPanelProps) {
  const { darkMode } = useTheme();

  return (
    <aside className={`rounded-xl border p-5 shadow-md ${darkMode ? "border-white/5 bg-slate-800" : "border-slate-200/70 bg-slate-400"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className={`h-5 w-5 ${darkMode ? "text-violet-300" : "text-violet-500"}`} />
          <h2 className={`font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>Upcoming</h2>
        </div>
        <span className={`text-sm font-medium ${darkMode ? "text-violet-300" : "text-violet-600"}`}>
          View Calendar
        </span>
      </div>

      <div className={`mt-5 divide-y ${darkMode ? "divide-white/5" : "divide-slate-200/70"}`}>
        {items.map(item => (
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
        ))}
      </div>
    </aside>
  );
}
