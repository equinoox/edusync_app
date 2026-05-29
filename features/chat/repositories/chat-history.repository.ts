import { asc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { chatMessages } from '@/lib/db/schema/chat';

export async function createChatMessageRecord(
  input: typeof chatMessages.$inferInsert,
) {
  const [message] = await db.insert(chatMessages).values(input).returning();
  return message;
}

export async function getUserChatMessages(userId: string) {
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(asc(chatMessages.createdAt));
}

export async function deleteUserChatMessages(userId: string) {
  return db.delete(chatMessages).where(eq(chatMessages.userId, userId));
}
