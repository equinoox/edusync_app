import {
  createCalendarEventRecord,
  deleteCalendarEventRecord,
  deleteQuizCalendarEventByQuizId,
  getCalendarEventById,
  getCalendarEventsForUser,
  getQuizCalendarEventByQuizId,
  updateCalendarEventRecord,
} from '@/features/calendar/repositories/calendar.repository';
import {
  createCalendarEventSchema,
  createQuizCalendarEventSchema,
  getCalendarEventsByMonthSchema,
  updateCalendarEventSchema,
} from '@/features/calendar/schemas';
import type {
  CalendarEvent,
  CreateCalendarEventInput,
  GetCalendarEventsByMonthInput,
  UpdateCalendarEventInput,
} from '@/features/calendar/types';
import { getCurrentUserWithRole } from '@/features/auth/server/roles.service';
import { parseSchemaOrThrow } from '@/lib/validation/zod';

const parseDate = (value: string | Date) => {
  if (value instanceof Date) return new Date(value);

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnlyMatch) {
    return new Date(
      Number(dateOnlyMatch[1]),
      Number(dateOnlyMatch[2]) - 1,
      Number(dateOnlyMatch[3]),
    );
  }

  return new Date(value);
};

const toDateOnly = (value: string | Date) => {
  const date = parseDate(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getMonthRange = (year: number, month: number) => ({
  startDate: new Date(year, month, 1),
  endDate: new Date(year, month + 1, 1),
});

const isSameLocalDay = (first: Date | string, second: Date | string) =>
  toDateOnly(first).getTime() === toDateOnly(second).getTime();

const toCalendarEvent = (
  record: Awaited<ReturnType<typeof getCalendarEventsForUser>>[number],
  currentUser: { userId: string; role: 'student' | 'professor' },
): CalendarEvent => ({
  ...record.event,
  eventType: record.event.eventType as CalendarEvent['eventType'],
  classroomTitle: record.classroomTitle,
  quizTitle: record.quizTitle,
  canManage:
    record.event.eventType === 'custom' && record.event.userId === currentUser.userId,
  canTakeQuiz:
    currentUser.role === 'student' &&
    record.event.eventType === 'quiz' &&
    Boolean(record.event.quizId) &&
    isSameLocalDay(record.event.date, new Date()),
});

export async function createCalendarEvent(input: CreateCalendarEventInput) {
  const currentUser = await getCurrentUserWithRole();
  const values = parseSchemaOrThrow(createCalendarEventSchema, input);

  const event = await createCalendarEventRecord({
    userId: currentUser.userId,
    title: values.title,
    description: values.description,
    date: toDateOnly(values.date),
    eventType: 'custom',
  });

  return {
    ...event,
    eventType: event.eventType as CalendarEvent['eventType'],
    classroomTitle: null,
    quizTitle: null,
    canManage: true,
    canTakeQuiz: false,
  } satisfies CalendarEvent;
}

export async function updateCalendarEvent(
  eventId: string,
  input: UpdateCalendarEventInput,
) {
  const currentUser = await getCurrentUserWithRole();
  const event = await getCalendarEventById(eventId);

  if (!event || event.userId !== currentUser.userId || event.eventType !== 'custom') {
    throw new Error('Calendar event not found');
  }

  const values = parseSchemaOrThrow(updateCalendarEventSchema, input);
  const updatedEvent = await updateCalendarEventRecord(eventId, {
    ...values,
    date: values.date ? toDateOnly(values.date) : undefined,
  });

  return {
    ...updatedEvent,
    eventType: updatedEvent.eventType as CalendarEvent['eventType'],
    classroomTitle: null,
    quizTitle: null,
    canManage: true,
    canTakeQuiz: false,
  } satisfies CalendarEvent;
}

export async function deleteCalendarEvent(eventId: string) {
  const currentUser = await getCurrentUserWithRole();
  const event = await getCalendarEventById(eventId);

  if (!event || event.userId !== currentUser.userId || event.eventType !== 'custom') {
    throw new Error('Calendar event not found');
  }

  return deleteCalendarEventRecord(eventId);
}

export async function getMyCalendarEvents(): Promise<CalendarEvent[]> {
  const currentUser = await getCurrentUserWithRole();
  const records = await getCalendarEventsForUser(currentUser);

  return records.map(record => toCalendarEvent(record, currentUser));
}

export async function getCalendarEventsByMonth(
  input: GetCalendarEventsByMonthInput,
): Promise<CalendarEvent[]> {
  const currentUser = await getCurrentUserWithRole();
  const values = parseSchemaOrThrow(getCalendarEventsByMonthSchema, input);

  const records = await getCalendarEventsForUser({
    ...currentUser,
    ...getMonthRange(values.year, values.month),
  });

  return records.map(record => toCalendarEvent(record, currentUser));
}

export async function createQuizCalendarEvent(input: {
  quizId: string;
  professorId: string;
  classroomId: string | null;
  title: string;
  description?: string;
  date: string | Date | null;
}) {
  const values = parseSchemaOrThrow(createQuizCalendarEventSchema, {
    ...input,
    date: input.date ? new Date(input.date).toISOString() : null,
  });

  if (!values.date) {
    await deleteQuizCalendarEventByQuizId(values.quizId);
    return null;
  }

  const existingEvent = await getQuizCalendarEventByQuizId(values.quizId);
  const eventValues = {
    userId: values.professorId,
    title: values.title,
    description: values.description,
    date: toDateOnly(values.date),
    eventType: 'quiz',
    quizId: values.quizId,
    classroomId: values.classroomId,
  };

  if (existingEvent) {
    return updateCalendarEventRecord(existingEvent.id, eventValues);
  }

  return createCalendarEventRecord(eventValues);
}

export async function getQuizCalendarEvents() {
  const events = await getMyCalendarEvents();
  return events.filter(event => event.eventType === 'quiz');
}

export function checkQuizCanBeTakenToday(quizDate: Date | string | null) {
  if (!quizDate) return true;
  return isSameLocalDay(quizDate, new Date());
}
