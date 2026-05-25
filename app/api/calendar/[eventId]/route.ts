import {
  deleteCalendarEvent,
  updateCalendarEvent,
} from '@/features/calendar/server/calendar.service';

export const runtime = 'nodejs';

type CalendarEventRouteContext = {
  params: {
    eventId: string;
  };
};

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function PATCH(
  request: Request,
  { params }: CalendarEventRouteContext,
) {
  try {
    return Response.json(
      await updateCalendarEvent(params.eventId, await request.json()),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: CalendarEventRouteContext,
) {
  try {
    return Response.json(await deleteCalendarEvent(params.eventId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
