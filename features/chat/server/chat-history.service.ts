import type { UIMessage } from 'ai';

import {
  createChatMessageRecord,
  deleteUserChatMessages,
  getUserChatMessages,
} from '@/features/chat/repositories/chat-history.repository';
import type {
  PersistedChatMessage,
  PersistedChatRole,
} from '@/features/chat/types';

export function getTextFromMessage(message: UIMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
    .trim();
}

export async function saveChatMessage(input: {
  userId: string;
  role: PersistedChatRole;
  content: string;
}) {
  const content = input.content.trim();

  if (!content) return null;

  return createChatMessageRecord({
    userId: input.userId,
    role: input.role,
    content,
  });
}

export async function getChatHistory(userId: string): Promise<PersistedChatMessage[]> {
  const messages = await getUserChatMessages(userId);

  return messages
    .filter(
      message => message.role === 'user' || message.role === 'assistant',
    )
    .map(message => ({
      id: message.id,
      role: message.role as PersistedChatRole,
      content: message.content,
      createdAt: message.createdAt,
    }));
}

export async function clearChatHistory(userId: string) {
  await deleteUserChatMessages(userId);
}
