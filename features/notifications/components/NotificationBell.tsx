'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

import {
  deleteNotificationAction,
  getMyNotificationsAction,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from '@/features/notifications/actions/notifications.action';
import { NotificationsDropdown } from '@/features/notifications/components/NotificationsDropdown';
import {
  ToastNotification,
  type ToastNotificationState,
} from '@/components/shared/ToastNotification';
import type {
  NotificationBellProps,
  NotificationItem,
} from '@/features/notifications/types';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export function NotificationBell({ compact = false }: NotificationBellProps) {
  const { darkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toast, setToast] = useState<ToastNotificationState | null>(null);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    const result = await getMyNotificationsAction();
    setIsLoading(false);

    if (typeof result === 'string') {
      setNotifications([]);
      return;
    }

    setNotifications(result);
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(previous => !previous);
    if (!isOpen) {
      void loadNotifications();
    }
  };

  const handleMarkAsRead = async (notification: NotificationItem) => {
    if (!notification.read) {
      setNotifications(previous =>
        previous.map(item =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );
      await markNotificationAsReadAction(notification.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(previous => previous.map(item => ({ ...item, read: true })));
    await markAllNotificationsAsReadAction();
  };

  const handleDeleteNotification = async (notification: NotificationItem) => {
    setNotifications(previous =>
      previous.filter(item => item.id !== notification.id),
    );

    const result = await deleteNotificationAction(notification.id);
    if (typeof result === 'string') {
      setNotifications(previous => [notification, ...previous]);
      setToast({ id: Date.now(), message: result, tone: 'error' });
      return;
    }

    setToast({ id: Date.now(), message: 'Notification deleted', tone: 'success' });
  };

  return (
    <div ref={containerRef} className="relative">
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />

      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'relative flex-shrink-0 rounded-lg p-2 transition-colors',
          compact ? 'h-9 w-9' : '',
          darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-400',
        )}
        aria-label="Notifications"
        title="Notifications"
      >
        <BellIcon
          className={cn(
            'h-5 w-5',
            darkMode ? 'text-violet-400' : 'text-slate-700',
          )}
        />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-violet-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationsDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRequestDelete={handleDeleteNotification}
        />
      )}
    </div>
  );
}
