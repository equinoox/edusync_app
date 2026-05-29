import { auth } from '@clerk/nextjs/server';

import {
  clearChatHistory,
  getChatHistory,
} from '@/features/chat/server/chat-history.service';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json(await getChatHistory(userId));
}

export async function DELETE() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clearChatHistory(userId);

  return Response.json({ ok: true });
}
