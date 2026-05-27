'use client';

import type { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { useTheme } from '@/providers/ThemeProvider';

type ViewAllModalProps<T> = {
  isOpen: boolean;
  title: string;
  items: T[];
  emptyMessage: string;
  onClose: () => void;
  renderItem: (item: T, index: number) => ReactNode;
};

export function ViewAllModal<T>({
  isOpen,
  title,
  items,
  emptyMessage,
  onClose,
  renderItem,
}: ViewAllModalProps<T>) {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 edusync-enter-fast">
      <section
        className={`flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl edusync-scale-in ${
          darkMode
            ? 'border-white/10 bg-slate-900 text-white'
            : 'border-slate-300 bg-slate-100 text-slate-950'
        }`}
      >
        <header
          className={`flex shrink-0 items-center justify-between gap-4 border-b px-5 py-4 ${
            darkMode ? 'border-white/10' : 'border-slate-300'
          }`}
        >
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className={darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>
              {items.length} item{items.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`edusync-button-motion rounded-lg p-2 transition ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
            }`}
            aria-label="Close modal"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div
              className={`rounded-xl border border-dashed px-5 py-10 text-center text-sm ${
                darkMode
                  ? 'border-slate-700 text-slate-400'
                  : 'border-slate-300 text-slate-600'
              }`}
            >
              {emptyMessage}
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="edusync-enter-fast"
                  style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                >
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
