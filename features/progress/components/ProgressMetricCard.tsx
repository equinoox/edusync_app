'use client';

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';

import type { ProgressMetricCardProps } from '@/features/progress/types';
import { cn } from '@/lib/utils';

const toneClasses = {
  violet: {
    icon: 'bg-violet-600/25 text-violet-300',
    bar: 'bg-violet-500',
  },
  green: {
    icon: 'bg-emerald-500/20 text-emerald-300',
    bar: 'bg-emerald-400',
  },
  blue: {
    icon: 'bg-blue-600/20 text-blue-300',
    bar: 'bg-blue-400',
  },
  orange: {
    icon: 'bg-orange-500/20 text-orange-300',
    bar: 'bg-orange-400',
  },
};

export function ProgressMetricCard({
  label,
  value,
  changeLabel,
  progress,
  tone,
  Icon,
}: ProgressMetricCardProps) {
  const classes = toneClasses[tone];
  const isNegativeChange = changeLabel.trim().startsWith('-');
  const ChangeIcon = isNegativeChange ? ArrowDownIcon : ArrowUpIcon;
  const [changeValue, ...changeWords] = changeLabel.split(' ');

  return (
    <article className="rounded-2xl border border-white/[0.04] bg-slate-900/70 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            classes.icon,
          )}
        >
          <Icon className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-300">{label}</p>
          <p className="mt-1 text-2xl font-bold leading-tight text-white">
            {value}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-300">
            <ChangeIcon
              className={cn(
                'h-3.5 w-3.5',
                isNegativeChange ? 'text-rose-400' : 'text-emerald-400',
              )}
            />
            <span
              className={cn(
                'font-semibold',
                isNegativeChange ? 'text-rose-400' : 'text-emerald-400',
              )}
            >
              {changeValue}
            </span>
            <span>{changeWords.join(' ')}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn('h-full rounded-full', classes.bar)}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </article>
  );
}
