import { db } from "@/lib/db";
import { chatSessionsTable, chatMessagesTable } from "@/lib/db/schema/chat-history";
import { eq, desc, and } from "drizzle-orm";
import { ChatSession, ChatMessage, ChatSessionWithMessages } from "../types";

export async function createChatSession(
  userId: string,
  initialMessage: string
): Promise<ChatSession> {
  const title = initialMessage.substring(0, 50) + (initialMessage.length > 50 ? "..." : "");
  const preview = initialMessage.substring(0, 100);

  const sessions = await db
    .insert(chatSessionsTable)
    .values({
      userId,
      title,
      preview,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return sessions[0];
}

export async function saveMessage(
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatMessage> {
  const messages = await db
    .insert(chatMessagesTable)
    .values({
      sessionId,
      userId,
      role,
      content,
      createdAt: new Date(),
    })
    .returning();

  return {
    ...messages[0],
    role: messages[0].role as 'user' | 'assistant',
  };
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const sessions = await db
    .select()
    .from(chatSessionsTable)
    .where(eq(chatSessionsTable.userId, userId))
    .orderBy(desc(chatSessionsTable.updatedAt));

  return sessions;
}

export async function getChatSession(
  sessionId: string,
  userId: string
): Promise<ChatSessionWithMessages | null> {
  const sessions = await db
    .select()
    .from(chatSessionsTable)
    .where(
      and(
        eq(chatSessionsTable.id, sessionId),
        eq(chatSessionsTable.userId, userId)
      )
    )
    .limit(1);

  if (sessions.length === 0) return null;

  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId))
    .orderBy(chatMessagesTable.createdAt);

  return {
    ...sessions[0],
    messages: messages.map(msg => ({
      ...msg,
      role: msg.role as 'user' | 'assistant',
    })),
  };
}

export async function updateSessionTitle(
  sessionId: string,
  userId: string,
  title: string
): Promise<void> {
  await db
    .update(chatSessionsTable)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chatSessionsTable.id, sessionId),
        eq(chatSessionsTable.userId, userId)
      )
    );
}

export async function deleteChatSession(
  sessionId: string,
  userId: string
): Promise<void> {
  // Delete messages first
  await db
    .delete(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId));

  // Delete session
  await db
    .delete(chatSessionsTable)
    .where(
      and(
        eq(chatSessionsTable.id, sessionId),
        eq(chatSessionsTable.userId, userId)
      )
    );
}

export async function updateSessionTimestamp(sessionId: string): Promise<void> {
  await db
    .update(chatSessionsTable)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(chatSessionsTable.id, sessionId));
}
