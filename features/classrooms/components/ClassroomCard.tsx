'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';

import type { ClassroomCardProps } from '@/features/classrooms/types';
import {
  getClassroomColorOption,
  getClassroomIconOption,
} from '@/features/classrooms/components/classroom-ui';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';


const formatCreatedDate = (value: Date | string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export function ClassroomCard({
  classroom,
  actions,
  onView,
  animationDelayMs = 0,
}: ClassroomCardProps) {
  const color = getClassroomColorOption(classroom.color);
  const icon = getClassroomIconOption(classroom.icon);
  const Icon = icon.Icon;
  const { darkMode } = useTheme();

  return (
    <article
      className={`edusync-enter edusync-card-motion group relative overflow-hidden rounded-xl border p-4 shadow-md transition hover:shadow-lg h-72 flex flex-col ${darkMode ? "border-white/5 bg-slate-800" : "border-slate-200 bg-white"}`}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className={cn('absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent opacity-80', color.glowClass)} />

      <div className="relative flex justify-center">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', darkMode ? color.darkIconClass : color.iconClass)}>
          <Icon className="h-6 w-6" />
        </div>

        {actions && <div className="absolute right-0 top-0">{actions}</div>}
      </div>

      <div className="relative mt-4 text-center">
        <h3 className={`line-clamp-1 text-sm font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>
          {classroom.title}
        </h3>
        <p className={`mt-1 line-clamp-2 min-h-8 text-xs ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
          {classroom.description}
        </p>
      </div>

      <div className="relative mt-4 flex flex-col items-center gap-1 text-center text-xs">
        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
          {classroom.numberOfStudents} students
        </span>
        <time className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          {formatCreatedDate(classroom.createdAt)}
        </time>
      </div>

      <div className={`relative mt-auto flex justify-end border-t pt-3 ${darkMode ? "border-white/5" : "border-slate-200/70"}`}>
        <button
          type="button"
          onClick={() => onView(classroom)}
          className={cn('edusync-button-motion inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-75', darkMode ? color.darkActionClass : color.actionClass)}
        >
          View Classroom
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
