'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

export function ProgressPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { darkMode } = useTheme();

  return (
    <section
      className={cn(
        'edusync-enter edusync-card-motion rounded-xl border shadow-lg',
        darkMode
          ? 'border-white/[0.04] bg-slate-900/70 bg-[radial-gradient(circle_at_top_left,rgba(51,65,85,0.42),transparent_42%)]'
          : 'border-slate-200 bg-white',
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
  const { darkMode } = useTheme();

  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
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
  const { darkMode } = useTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`edusync-button-motion inline-flex items-center gap-2 text-sm font-medium transition ${darkMode ? 'text-violet-400 hover:text-violet-300' : 'text-indigo-600 hover:text-indigo-700'}`}
    >
      {children}
    </button>
  );
}
