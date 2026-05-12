import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  type UIMessage,
} from 'ai';

import { CHAT_MODEL, MAX_CHAT_STEPS } from '@/lib/ai/ai-config';
import { CHAT_SYSTEM_PROMPT } from '@/features/chat/server/chat.config';
import { chatTools } from '@/features/chat/server/chat.tools';

export const createChatResponse = async (messages: UIMessage[]) => {
  return streamText({
    model: CHAT_MODEL,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(MAX_CHAT_STEPS),
    system: CHAT_SYSTEM_PROMPT,
    tools: chatTools,
  });
};