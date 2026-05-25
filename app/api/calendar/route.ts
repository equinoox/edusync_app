import {
  createCalendarEvent,
  getCalendarEventsByMonth,
  getMyCalendarEvents,
} from '@/features/calendar/server/calendar.service';

export const runtime = 'nodejs';

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (year !== null && month !== null) {
      return Response.json(
        await getCalendarEventsByMonth({
          year: Number(year),
          month: Number(month),
        }),
      );
    }

    return Response.json(await getMyCalendarEvents());
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    return Response.json(await createCalendarEvent(await request.json()));
  } catch (error) {
    return toErrorResponse(error);
  }
}
