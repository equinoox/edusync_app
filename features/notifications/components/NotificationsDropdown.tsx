'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import type { NotificationsDropdownProps } from '@/features/notifications/types';
import { useTheme } from '@/providers/ThemeProvider';

export function NotificationsDropdown({
  notifications,
  unreadCount,
  isLoading,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsDropdownProps) {
  const { darkMode } = useTheme();

  return (
    <section
      className={`absolute right-0 top-12 z-[80] flex max-h-[30rem] w-80 flex-col overflow-hidden rounded-2xl border shadow-lg sm:w-96 ${
        darkMode
          ? 'border-slate-700 bg-slate-900'
          : 'border-slate-500 bg-slate-300'
      }`}
    >
      <header
        className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${
          darkMode ? 'border-slate-800' : 'border-slate-500'
        }`}
      >
        <div>
          <h2 className={darkMode ? 'font-bold text-white' : 'font-bold text-slate-950'}>
            Notifications
          </h2>
          <p className={darkMode ? 'text-xs text-slate-400' : 'text-xs text-slate-700'}>
            {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-xs font-semibold text-violet-400"
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-400'
            }`}
            aria-label="Close notifications"
            title="Close"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="grid min-h-32 place-items-center">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div
            className={`rounded-xl border border-dashed px-4 py-10 text-center text-sm ${
              darkMode
                ? 'border-slate-700 text-slate-400'
                : 'border-slate-500 text-slate-700'
            }`}
          >
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
