import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { getChatSession } from '@/features/chat/server/chat-history.service';

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await context.params;
  const session = await getChatSession(sessionId, userId);

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({ session });
}
