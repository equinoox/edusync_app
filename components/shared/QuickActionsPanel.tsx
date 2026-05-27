'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { BoltIcon, PlusIcon } from '@heroicons/react/24/outline';

import { useTheme } from '@/providers/ThemeProvider';

export type QuickActionItem = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  Icon?: ComponentType<{ className?: string }>;
};

type QuickActionsPanelProps = {
  title?: string;
  items: QuickActionItem[];
};

export function QuickActionsPanel({
  title = 'Quick Actions',
  items,
}: QuickActionsPanelProps) {
  const { darkMode } = useTheme();

  const renderIcon = (Icon?: ComponentType<{ className?: string }>) => {
    const ActionIcon = Icon ?? PlusIcon;

    return (
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${darkMode ? 'bg-violet-600 text-white' : 'bg-indigo-600 text-white'}`}>
        <ActionIcon className="h-4 w-4" />
      </span>
    );
  };

  return (
    <aside className={`edusync-enter edusync-card-motion rounded-xl border p-5 shadow-md ${darkMode ? 'border-white/5 bg-slate-800' : 'border-slate-500 bg-slate-400'}`}>
      <div className="mb-5 flex items-center gap-2">
        <BoltIcon className={`h-5 w-5 ${darkMode ? 'text-violet-300' : 'text-violet-700'}`} />
        <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {items.map(item => {
          const content = (
            <>
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-950'}`}>
                {item.label}
              </span>
              {renderIcon(item.Icon)}
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`edusync-button-motion flex w-full items-center justify-between gap-3 rounded-lg transition ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-300'}`}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`edusync-button-motion flex w-full items-center justify-between gap-3 rounded-lg text-left transition ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-300'}`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
