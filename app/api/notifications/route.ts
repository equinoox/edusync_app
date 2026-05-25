import {
  getMyNotifications,
  markAllNotificationsAsRead,
} from '@/features/notifications/server/notifications.service';

export const runtime = 'nodejs';

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function GET() {
  try {
    return Response.json(await getMyNotifications());
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH() {
  try {
    return Response.json(await markAllNotificationsAsRead());
  } catch (error) {
    return toErrorResponse(error);
  }
}
