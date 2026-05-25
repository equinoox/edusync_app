'use server';

import {
  deleteNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/features/notifications/server/notifications.service';

const toActionError = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : 'Something went wrong';

export async function getMyNotificationsAction() {
  try {
    return await getMyNotifications();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getUnreadNotificationCountAction() {
  try {
    return await getUnreadNotificationCount();
  } catch (error) {
    return toActionError(error);
  }
}

export async function markNotificationAsReadAction(notificationId: string) {
  try {
    return await markNotificationAsRead(notificationId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function markAllNotificationsAsReadAction() {
  try {
    return await markAllNotificationsAsRead();
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteNotificationAction(notificationId: string) {
  try {
    return await deleteNotification(notificationId);
  } catch (error) {
    return toActionError(error);
  }
}
