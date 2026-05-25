import { and, count, desc, eq } from 'drizzle-orm';

import { getClassroomMemberships } from '@/features/classrooms/repositories/classrooms.repository';
import { db } from '@/lib/db';
import { calendarEvents } from '@/lib/db/schema/calendar';
import { notifications } from '@/lib/db/schema/notifications';

export async function createNotificationRecord(
  input: typeof notifications.$inferInsert,
) {
  const [notification] = await db
    .insert(notifications)
    .values(input)
    .onConflictDoNothing()
    .returning();

  return notification;
}

export async function getNotificationsByUser(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotificationCountByUser(userId: string) {
  const [result] = await db
    .select({ value: count(notifications.id) })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

  return Number(result?.value ?? 0);
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const [notification] = await db
    .update(notifications)
    .set({ read: true, updatedAt: new Date() })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
    .returning();

  return notification;
}

export async function markAllNotificationsRead(userId: string) {
  return db
    .update(notifications)
    .set({ read: true, updatedAt: new Date() })
    .where(eq(notifications.userId, userId))
    .returning();
}

export async function deleteNotificationRecord(
  notificationId: string,
  userId: string,
) {
  const [notification] = await db
    .delete(notifications)
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
    .returning();

  return notification;
}

export async function getStudentCustomCalendarEventsForDate(
  userId: string,
  date: Date,
) {
  return db
    .select()
    .from(calendarEvents)
    .where(
      and(
        eq(calendarEvents.userId, userId),
        eq(calendarEvents.eventType, 'custom'),
        eq(calendarEvents.date, date),
      ),
    )
    .orderBy(desc(calendarEvents.createdAt));
}

export async function getStudentIdsForClassroom(classroomId: string) {
  const memberships = await getClassroomMemberships(classroomId);
  return memberships.map(membership => membership.studentId);
}
