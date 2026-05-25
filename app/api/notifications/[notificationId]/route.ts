import {
  deleteNotification,
  markNotificationAsRead,
} from '@/features/notifications/server/notifications.service';

export const runtime = 'nodejs';

type NotificationRouteContext = {
  params: {
    notificationId: string;
  };
};

const toErrorResponse = (error: unknown) =>
  Response.json(
    { error: error instanceof Error ? error.message : 'Something went wrong' },
    { status: 400 },
  );

export async function PATCH(
  _request: Request,
  { params }: NotificationRouteContext,
) {
  try {
    return Response.json(await markNotificationAsRead(params.notificationId));
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: NotificationRouteContext,
) {
  try {
    return Response.json(await deleteNotification(params.notificationId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
