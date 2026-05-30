import { getClassroomRecordById } from '@/features/classrooms/repositories/classrooms.repository';
import { getCurrentUserWithRole } from '@/features/auth/server/roles.service';
import {
  createNotificationRecord,
  deleteNotificationRecord,
  getNotificationsByUser,
  getStudentCustomCalendarEventsForDate,
  getStudentIdsForClassroom,
  getUnreadNotificationCountByUser,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/features/notifications/repositories/notifications.repository';
import {
  createNotificationForStudentSchema,
  createNotificationsForClassroomStudentsSchema,
} from '@/features/notifications/schemas';
import type {
  CreateNotificationForStudentInput,
  CreateNotificationsForClassroomStudentsInput,
  NotificationItem,
} from '@/features/notifications/types';
import { parseSchemaOrThrow } from '@/lib/validation/zod';

const toDateOnly = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const toNotificationItem = (
  notification: typeof import('@/lib/db/schema/notifications').notifications.$inferSelect,
): NotificationItem => ({
  ...notification,
  type: notification.type as NotificationItem['type'],
});

async function createTodaysCalendarEventNotifications(userId: string) {
  const todaysEvents = await getStudentCustomCalendarEventsForDate(
    userId,
    toDateOnly(new Date()),
  );

  await Promise.all(
    todaysEvents.map(event =>
      createNotificationRecord({
        userId,
        type: 'calendar_event_today',
        title: 'Calendar event today',
        message: `${event.title} is scheduled for today.`,
        link: '/calendar',
        relatedCalendarEventId: event.id,
      }),
    ),
  );
}

export async function createNotificationForStudent(
  input: CreateNotificationForStudentInput,
) {
  const values = parseSchemaOrThrow(createNotificationForStudentSchema, input);

  return createNotificationRecord({
    userId: values.userId,
    type: values.type,
    title: values.title,
    message: values.message,
    link: values.link ?? null,
    relatedClassroomId: values.relatedClassroomId ?? null,
    relatedQuizId: values.relatedQuizId ?? null,
    relatedMaterialId: values.relatedMaterialId ?? null,
    relatedCalendarEventId: values.relatedCalendarEventId ?? null,
  });
}

export async function createNotificationsForClassroomStudents(
  input: CreateNotificationsForClassroomStudentsInput,
) {
  const values = parseSchemaOrThrow(createNotificationsForClassroomStudentsSchema, input);
  const studentIds = await getStudentIdsForClassroom(values.classroomId);

  return Promise.all(
    studentIds.map(studentId =>
      createNotificationForStudent({
        userId: studentId,
        type: values.type,
        title: values.title,
        message: values.message,
        link: values.link ?? null,
        relatedClassroomId: values.relatedClassroomId ?? values.classroomId,
        relatedQuizId: values.relatedQuizId ?? null,
        relatedMaterialId: values.relatedMaterialId ?? null,
        relatedCalendarEventId: values.relatedCalendarEventId ?? null,
      }),
    ),
  );
}

export async function notifyStudentAddedToClassroom(input: {
  studentId: string;
  classroomId: string;
}) {
  const classroom = await getClassroomRecordById(input.classroomId);

  if (!classroom) return null;

  return createNotificationForStudent({
    userId: input.studentId,
    type: 'classroom_added',
    title: 'Added to classroom',
    message: `You were added to ${classroom.title}.`,
    link: '/classrooms',
    relatedClassroomId: classroom.id,
  });
}

export async function getMyNotifications(): Promise<NotificationItem[]> {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role !== 'student') {
    return [];
  }

  await createTodaysCalendarEventNotifications(currentUser.userId);
  const notifications = await getNotificationsByUser(currentUser.userId);

  return notifications.map(toNotificationItem);
}

export async function getUnreadNotificationCount() {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role !== 'student') {
    return 0;
  }

  await createTodaysCalendarEventNotifications(currentUser.userId);
  return getUnreadNotificationCountByUser(currentUser.userId);
}

export async function markNotificationAsRead(notificationId: string) {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role !== 'student') {
    throw new Error('Forbidden');
  }

  const notification = await markNotificationRead(
    notificationId,
    currentUser.userId,
  );

  if (!notification) {
    throw new Error('Notification not found');
  }

  return toNotificationItem(notification);
}

export async function markAllNotificationsAsRead() {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role !== 'student') {
    return [];
  }

  const notifications = await markAllNotificationsRead(currentUser.userId);
  return notifications.map(toNotificationItem);
}

export async function deleteNotification(notificationId: string) {
  const currentUser = await getCurrentUserWithRole();

  if (currentUser.role !== 'student') {
    throw new Error('Forbidden');
  }

  const notification = await deleteNotificationRecord(
    notificationId,
    currentUser.userId,
  );

  if (!notification) {
    throw new Error('Notification not found');
  }

  return toNotificationItem(notification);
}
