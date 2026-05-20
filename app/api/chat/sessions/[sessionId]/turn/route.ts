import type { UIMessage } from 'ai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import {
  saveLatestChatTurn,
} from '@/features/chat/server/chat-history.service';

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

export async function POST(req: Request, context: RouteContext) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await context.params;
  const body = (await req.json().catch(() => ({}))) as {
    messages?: UIMessage[];
  };

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: 'messages are required' },
      { status: 400 }
    );
  }

  const result = await saveLatestChatTurn(sessionId, userId, body.messages);
  return NextResponse.json({ session: result.session, saved: result.saved });
}
