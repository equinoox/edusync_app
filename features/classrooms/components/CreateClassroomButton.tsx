'use client';

import { PlusIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

type CreateClassroomButtonProps = {
  onClick: () => void;
  compact?: boolean;
  className?: string;
};

export function CreateClassroomButton({
  onClick,
  compact = false,
  className,
}: CreateClassroomButtonProps) {
  const { darkMode } = useTheme();

  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 gap-2 rounded-lg bg-violet-600 text-white shadow-lg shadow-violet-600/25',
        darkMode ? 'hover:bg-violet-500' : 'hover:bg-violet-700',
        compact && 'w-10 px-0',
        className,
      )}
      aria-label="Create classroom"
      title="Create classroom"
    >
      <PlusIcon className="h-5 w-5" />
      {!compact && <span>Create Classroom</span>}
    </Button>
  );
}
