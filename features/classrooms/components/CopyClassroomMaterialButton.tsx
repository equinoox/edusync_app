'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

import type { CopyClassroomMaterialButtonProps } from '@/features/classrooms/types';

export function CopyClassroomMaterialButton({
  isLoading,
  onCopy,
}: CopyClassroomMaterialButtonProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={isLoading}
      className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 via-violet-500 to-cyan-500 px-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      title="Copy to my Documents"
    >
      <ArrowDownTrayIcon className="h-4 w-4" />
      {isLoading ? 'Copying...' : 'Transfer'}
    </button>
  );
}
