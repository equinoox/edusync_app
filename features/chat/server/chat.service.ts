import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  type UIMessage,
} from 'ai';

import { CHAT_MODEL, MAX_CHAT_STEPS } from '@/lib/ai/ai-config';
import { CHAT_SYSTEM_PROMPT } from '@/features/chat/server/chat.config';
import { createChatTools } from '@/features/chat/server/chat.tools';

export const createChatResponse = async (
  messages: UIMessage[],
  documentId?: string,
) => {
  return streamText({
    model: CHAT_MODEL,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(MAX_CHAT_STEPS),
    system: CHAT_SYSTEM_PROMPT,
    tools: createChatTools(documentId),
  });
};
