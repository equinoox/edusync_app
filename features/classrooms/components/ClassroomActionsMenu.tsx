'use client';

import { useEffect, useRef, useState } from 'react';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';

import type { ClassroomActionsMenuProps } from '@/features/classrooms/types';
import { useTheme } from '@/providers/ThemeProvider';

export function ClassroomActionsMenu({
  canDelete,
  classroomTitle,
  onDelete,
}: ClassroomActionsMenuProps) {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', closeMenu);
    return () => window.removeEventListener('mousedown', closeMenu);
  }, []);

  if (!canDelete) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(value => !value)}
        className={`rounded-lg p-1.5 text-slate-400 transition ${
          darkMode
            ? 'bg-slate-700 hover:bg-slate-600 hover:text-slate-200'
            : 'bg-slate-100/80 hover:bg-slate-200 hover:text-slate-700'
        }`}
        aria-label={`${classroomTitle} options`}
        title={`${classroomTitle} options`}
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-10 z-20 w-44 rounded-lg border p-1 shadow-lg ${
            darkMode
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
              darkMode
                ? 'text-red-200 hover:bg-red-950'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <TrashIcon className="h-4 w-4" />
            Delete classroom
          </button>
        </div>
      )}
    </div>
  );
}
