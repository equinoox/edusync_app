'use client';

import Link from 'next/link';
import {
  AcademicCapIcon,
  BellAlertIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

import type {
  NotificationItem as NotificationItemType,
  NotificationItemProps,
} from '@/features/notifications/types';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

const formatRelative = (value: Date | string) => {
  const createdAt = new Date(value).getTime();
  const diffMs = Date.now() - createdAt;
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
};

const getIcon = (notification: NotificationItemType) => {
  if (notification.type === 'calendar_event_today') return CalendarDaysIcon;
  if (notification.type === 'classroom_added') return UserGroupIcon;
  if (notification.type === 'classroom_document_added') return DocumentTextIcon;
  if (notification.type === 'classroom_quiz_added') return AcademicCapIcon;
  return BellAlertIcon;
};

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const { darkMode } = useTheme();
  const Icon = getIcon(notification);
  const content = (
    <div
      className={cn(
        'flex w-full gap-3 rounded-xl border p-3 text-left transition',
        darkMode
          ? notification.read
            ? 'border-white/5 bg-slate-900 hover:bg-slate-800'
            : 'border-violet-500/30 bg-violet-950/40 hover:bg-violet-950/60'
          : notification.read
            ? 'border-slate-500 bg-slate-300 hover:bg-slate-400'
            : 'border-indigo-300 bg-indigo-100 hover:bg-indigo-200',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-indigo-500/15 text-indigo-700',
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'line-clamp-1 text-sm font-semibold',
              darkMode ? 'text-white' : 'text-slate-950',
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
          )}
        </div>
        <p
          className={cn(
            'mt-1 line-clamp-2 text-xs',
            darkMode ? 'text-slate-400' : 'text-slate-700',
          )}
        >
          {notification.message}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className={darkMode ? 'text-xs text-slate-500' : 'text-xs text-slate-600'}>
            {formatRelative(notification.createdAt)}
          </span>
          {!notification.read && (
            <button
              type="button"
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                onMarkAsRead(notification);
              }}
              className="text-xs font-semibold text-violet-400"
            >
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={() => onMarkAsRead(notification)}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onMarkAsRead(notification)}>
      {content}
    </button>
  );
}
