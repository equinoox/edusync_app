import type { z } from 'zod';

import type {
  createNotificationForStudentSchema,
  createNotificationsForClassroomStudentsSchema,
  notificationTypes,
} from '@/features/notifications/schemas';

export type NotificationType = (typeof notificationTypes)[number];
export type CreateNotificationForStudentInput = z.infer<
  typeof createNotificationForStudentSchema
>;
export type CreateNotificationsForClassroomStudentsInput = z.infer<
  typeof createNotificationsForClassroomStudentsSchema
>;

export type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  relatedClassroomId: string | null;
  relatedQuizId: string | null;
  relatedMaterialId: string | null;
  relatedCalendarEventId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type NotificationBellProps = {
  compact?: boolean;
};

export type NotificationsDropdownProps = {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  onClose: () => void;
  onMarkAsRead: (notification: NotificationItem) => void;
  onMarkAllAsRead: () => void;
};

export type NotificationItemProps = {
  notification: NotificationItem;
  onMarkAsRead: (notification: NotificationItem) => void;
};
