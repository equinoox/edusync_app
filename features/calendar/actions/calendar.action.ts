'use server';

import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEventsByMonth,
  getMyCalendarEvents,
  getQuizCalendarEvents,
  updateCalendarEvent,
} from '@/features/calendar/server/calendar.service';
import type {
  CreateCalendarEventInput,
  GetCalendarEventsByMonthInput,
  UpdateCalendarEventInput,
} from '@/features/calendar/types';

const toActionError = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : 'Something went wrong';

export async function createCalendarEventAction(input: CreateCalendarEventInput) {
  try {
    return await createCalendarEvent(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateCalendarEventAction(
  eventId: string,
  input: UpdateCalendarEventInput,
) {
  try {
    return await updateCalendarEvent(eventId, input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteCalendarEventAction(eventId: string) {
  try {
    return await deleteCalendarEvent(eventId);
  } catch (error) {
    return toActionError(error);
  }
}

export async function getMyCalendarEventsAction() {
  try {
    return await getMyCalendarEvents();
  } catch (error) {
    return toActionError(error);
  }
}

export async function getCalendarEventsByMonthAction(
  input: GetCalendarEventsByMonthInput,
) {
  try {
    return await getCalendarEventsByMonth(input);
  } catch (error) {
    return toActionError(error);
  }
}

export async function getQuizCalendarEventsAction() {
  try {
    return await getQuizCalendarEvents();
  } catch (error) {
    return toActionError(error);
  }
}
