'use client';

import type { ClassroomStatCardProps } from '@/features/classrooms/types';
import { useTheme } from '@/providers/ThemeProvider';

import { cn } from '@/lib/utils';

const toneClasses = {
  violet: {
    light: 'bg-violet-500/15 text-violet-600',
    darkClass: 'bg-violet-500/20 text-violet-300',
  },
  orange: {
    light: 'bg-orange-500/15 text-orange-600',
    darkClass: 'bg-orange-500/20 text-orange-300',
  },
  green: {
    light: 'bg-emerald-500/15 text-emerald-600',
    darkClass: 'bg-emerald-500/20 text-emerald-300',
  },
  blue: {
    light: 'bg-blue-500/15 text-blue-600',
    darkClass: 'bg-blue-500/20 text-blue-300',
  },
};

export function ClassroomStatCard({
  icon: Icon,
  label,
  value,
  tone,
}: ClassroomStatCardProps) {

  const { darkMode } = useTheme();

  return (
    <article className={`edusync-enter edusync-card-motion rounded-xl border p-3.5 backdrop-blur ${darkMode ? "border-white/5 bg-slate-800" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center gap-2.5">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', darkMode ? toneClasses[tone].darkClass : toneClasses[tone].light)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xl font-bold leading-tight ${darkMode ? "text-white" : "text-slate-950"}`}>
            {value}
          </p>
          <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-500"}`}>{label}</p>
        </div>
      </div>
    </article>
  );
}
