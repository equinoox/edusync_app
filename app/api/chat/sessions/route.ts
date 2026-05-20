import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { createChatSession, getChatSessions } from '@/features/chat/server/chat-history.service';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessions = await getChatSessions(userId);
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    initialMessage?: string;
  };

  const initialMessage = body.initialMessage?.trim();

  if (!initialMessage) {
    return NextResponse.json(
      { error: 'initialMessage is required' },
      { status: 400 }
    );
  }

  const session = await createChatSession(userId, initialMessage);
  return NextResponse.json({ session }, { status: 201 });
}
