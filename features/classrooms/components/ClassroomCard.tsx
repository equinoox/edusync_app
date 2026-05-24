'use client';

import type { ReactNode } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import type { ClassroomListItem } from '@/features/classrooms/types';
import {
  getClassroomColorOption,
  getClassroomIconOption,
} from '@/features/classrooms/components/classroom-ui';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

type ClassroomCardProps = {
  classroom: ClassroomListItem;
  actions?: ReactNode;
  onView: (classroom: ClassroomListItem) => void;
};

const formatCreatedDate = (value: Date | string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export function ClassroomCard({ classroom, actions, onView }: ClassroomCardProps) {
  const color = getClassroomColorOption(classroom.color);
  const icon = getClassroomIconOption(classroom.icon);
  const Icon = icon.Icon;
  const progress = Math.min(100, Math.max(18, classroom.numberOfStudents * 12));
  const { darkMode } = useTheme();

  return (
    <article className={`group relative overflow-hidden rounded-xl border p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg h-72 flex flex-col ${darkMode ? "border-white/5 bg-slate-800" : "border-slate-200/70 bg-slate-400"}`}>
      <div className={cn('absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent opacity-80', color.glowClass)} />

      <div className="relative flex items-start justify-between gap-3">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', darkMode ? color.darkIconClass : color.iconClass)}>
          <Icon className="h-6 w-6" />
        </div>

        {actions}
      </div>

      <div className="relative mt-3">
        <h3 className={`line-clamp-1 text-sm font-bold ${darkMode ? "text-white" : "text-slate-950"}`}>
          {classroom.title}
        </h3>
        <p className={`mt-1 line-clamp-2 min-h-8 text-xs ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
          {classroom.description}
        </p>
      </div>

      <div className="relative mt-3 flex items-center justify-between text-xs">
        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
          {classroom.numberOfStudents} students
        </span>
        <time className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          {formatCreatedDate(classroom.createdAt)}
        </time>
      </div>

      <div className="relative mt-2 flex items-center gap-3">
        <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${darkMode ? "bg-slate-900" : "bg-slate-200"}`}>
          <div
            className={cn('h-full rounded-full', color.progressClass)}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
          {progress}%
        </span>
      </div>

      <div className={`relative mt-3 border-t pt-3 flex-1 flex flex-col justify-end ${darkMode ? "border-white/5" : "border-slate-200/70"}`}>
        <button
          type="button"
          onClick={() => onView(classroom)}
          className={cn('inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-75', darkMode ? color.darkActionClass : color.actionClass)}
        >
          View Classroom
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
