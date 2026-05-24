'use client';

import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

import type { ClassroomListItem } from '@/features/classrooms/types';
import { getClassroomColorOption } from '@/features/classrooms/components/classroom-ui';
import { useTheme } from '@/providers/ThemeProvider';

type RecentActivityPanelProps = {
  classrooms: ClassroomListItem[];
};

const formatRelative = (value: Date | string) => {
  const createdAt = new Date(value).getTime();
  const diffMs = Date.now() - createdAt;
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

export function RecentActivityPanel({ classrooms }: RecentActivityPanelProps) {
  const { darkMode } = useTheme();
  const recentClassrooms = classrooms.slice(0, 4);

  return (
    <aside className={`rounded-xl border p-5 shadow-md ${darkMode ? "border-white/5 bg-slate-800" : "border-slate-200/70 bg-slate-400"}`}>
      <div className="flex items-center gap-2">
        <SparklesIcon className={`h-5 w-5 ${darkMode ? "text-violet-300" : "text-violet-500"}`} />
        <h2 className={`font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>Recent Activity</h2>
      </div>

      <div className={`mt-5 divide-y ${darkMode ? "divide-white/5" : "divide-slate-200/70"}`}>
        {recentClassrooms.length === 0 ? (
          <p className={`py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
            No classroom activity yet.
          </p>
        ) : (
          recentClassrooms.map(classroom => {
            const color = getClassroomColorOption(classroom.color);

            return (
              <div key={classroom.id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${darkMode ? color.darkIconClass : color.iconClass}`}>
                  <SparklesIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`line-clamp-2 text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                    Classroom created in {classroom.title}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    {formatRelative(classroom.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        type="button"
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 text-sm font-medium transition ${darkMode ? "text-violet-300 hover:text-violet-200" : "text-violet-500 hover:text-violet-600"}`}
      >
        View all activity
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </aside>
  );
}
