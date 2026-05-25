'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function ProgressPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-white/[0.04] bg-slate-900/70 shadow-[0_18px_45px_rgba(0,0,0,0.22)]',
        'bg-[radial-gradient(circle_at_top_left,rgba(51,65,85,0.42),transparent_42%)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function ProgressSectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {action}
    </div>
  );
}

export function ProgressLinkButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
    >
      {children}
    </button>
  );
}
