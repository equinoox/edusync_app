import { and, asc, eq, gte, isNull, lt, or } from 'drizzle-orm';

import { classroomMemberships, classrooms } from '@/lib/db/schema/classrooms';
import { calendarEvents } from '@/lib/db/schema/calendar';
import { quizzes } from '@/lib/db/schema/quizzes';
import { db } from '@/lib/db';

export async function createCalendarEventRecord(
  input: typeof calendarEvents.$inferInsert,
) {
  const [event] = await db.insert(calendarEvents).values(input).returning();
  return event;
}

export async function updateCalendarEventRecord(
  eventId: string,
  input: Partial<typeof calendarEvents.$inferInsert>,
) {
  const [event] = await db
    .update(calendarEvents)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(calendarEvents.id, eventId))
    .returning();

  return event;
}

export async function deleteCalendarEventRecord(eventId: string) {
  const [event] = await db
    .delete(calendarEvents)
    .where(eq(calendarEvents.id, eventId))
    .returning();

  return event;
}

export async function getCalendarEventById(eventId: string) {
  const [event] = await db
    .select()
    .from(calendarEvents)
    .where(eq(calendarEvents.id, eventId))
    .limit(1);

  return event;
}

export async function getQuizCalendarEventByQuizId(quizId: string) {
  const [event] = await db
    .select()
    .from(calendarEvents)
    .where(eq(calendarEvents.quizId, quizId))
    .limit(1);

  return event;
}

export async function deleteQuizCalendarEventByQuizId(quizId: string) {
  const [event] = await db
    .delete(calendarEvents)
    .where(eq(calendarEvents.quizId, quizId))
    .returning();

  return event;
}

export async function getCalendarEventsForUser(input: {
  userId: string;
  role: 'student' | 'professor';
  startDate?: Date;
  endDate?: Date;
}) {
  const dateFilter =
    input.startDate && input.endDate
      ? and(
          gte(calendarEvents.date, input.startDate),
          lt(calendarEvents.date, input.endDate),
        )
      : undefined;

  const ownershipFilter =
    input.role === 'professor'
      ? eq(calendarEvents.userId, input.userId)
      : or(
          eq(calendarEvents.userId, input.userId),
          and(eq(calendarEvents.eventType, 'quiz'), isNull(calendarEvents.classroomId)),
          and(
            eq(calendarEvents.eventType, 'quiz'),
            eq(classroomMemberships.studentId, input.userId),
          ),
        );

  return db
    .select({
      event: calendarEvents,
      quizTitle: quizzes.title,
      classroomTitle: classrooms.title,
    })
    .from(calendarEvents)
    .leftJoin(quizzes, eq(quizzes.id, calendarEvents.quizId))
    .leftJoin(classrooms, eq(classrooms.id, calendarEvents.classroomId))
    .leftJoin(
      classroomMemberships,
      and(
        eq(classroomMemberships.classroomId, calendarEvents.classroomId),
        eq(classroomMemberships.studentId, input.userId),
      ),
    )
    .where(dateFilter ? and(ownershipFilter, dateFilter) : ownershipFilter)
    .orderBy(asc(calendarEvents.date), asc(calendarEvents.createdAt));
}
