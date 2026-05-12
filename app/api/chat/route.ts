import type { UIMessage } from 'ai';

import { createChatResponse } from '@/features/chat/server/chat.service';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await createChatResponse(messages);

  return result.toUIMessageStreamResponse();
}